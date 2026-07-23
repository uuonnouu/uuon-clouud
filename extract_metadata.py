#!/usr/bin/env python3
"""
extract_metadata.py

Pulls TEXT-SAFE metadata from the live Δmension API (uuon.world) and writes
an instruction/output JSONL file suitable for GPT-2 fine-tuning.

Deliberately excludes:
  - raw vertex/normal/UV arrays (not meaningful tokens for a 1024-ctx LM)
  - anything behind the x-api-key gated /render endpoints
  - "formula" fields (the API returns null for these by design - proprietary)

Confirmed-working endpoints (as of 2026-06-21, verified via curl):
  GET  /api/shapes/categories            -> 107 categories w/ counts
  GET  /api/engines                       -> 4 engines w/ descriptions
  GET  /api/sdk-info                      -> module list
  GET  /api/sdk/discover                  -> operations per module
  GET  /api/sdk/health                    -> module health
  GET  /api/status                        -> route map
  POST /api/shapes/compute {category, shapeType} -> resolvedParameters
  GET  /api/shapes/list?shapeType=X       -> parameter metadata (min/max/desc) per letter

NOT yet confirmed working (the script tries several variants and logs results
rather than assuming success - check unconfirmed_endpoint_attempts.json after running):
  POST /api/sdk/unified/shapes/list-shapes   -> wants a "shapeId"/"category" key
                                                  the server doesn't seem to accept yet
  POST /api/sdk/unified/shapes/get-defaults  -> wants "shapeId"

If you discover the correct body shape for list-shapes (e.g. via the
/developer console), set KNOWN_SHAPE_TYPES below or pass --shapes-file.
"""

import json
import time
import argparse
import urllib.request
import urllib.error
from pathlib import Path

BASE = "https://uuon.world"

# Shape type names we have CONFIRMED work against /api/shapes/compute.
# Expand this list as you discover more real names (from the /developer
# console, from a working list-shapes call, or from your own engine docs).
KNOWN_SHAPE_TYPES = [
    "klein-bottle",
]

OUTPUT_DIR = Path(__file__).parent / "data"
OUTPUT_DIR.mkdir(exist_ok=True)


def http_get(path, timeout=15):
    url = f"{BASE}{path}"
    req = urllib.request.Request(url, headers={"Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, {"raw_error_body": body}
    except Exception as e:
        return None, {"exception": str(e)}


def http_post(path, payload, timeout=15):
    url = f"{BASE}{path}"
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}, method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, {"raw_error_body": body}
    except Exception as e:
        return None, {"exception": str(e)}


def fetch_categories():
    print("[fetch] /api/shapes/categories")
    status, data = http_get("/api/shapes/categories")
    if status == 200 and data.get("success"):
        return data["categories"]
    print(f"  WARNING: categories fetch failed (status={status}): {data}")
    return []


def fetch_engines():
    print("[fetch] /api/engines")
    status, data = http_get("/api/engines")
    if status == 200:
        return data.get("engines", [])
    print(f"  WARNING: engines fetch failed (status={status}): {data}")
    return []


def fetch_sdk_discover():
    print("[fetch] /api/sdk/discover")
    status, data = http_get("/api/sdk/discover")
    if status == 200 and data.get("success"):
        return data.get("availableModules", {})
    print(f"  WARNING: sdk/discover fetch failed (status={status}): {data}")
    return {}


def fetch_shape_compute(category, shape_type):
    status, data = http_post(
        "/api/shapes/compute", {"category": category, "shapeType": shape_type}
    )
    if status == 200 and data.get("success"):
        return data
    return None


def fetch_shape_parameter_metadata(shape_type):
    """GET /api/shapes/list?shapeType=X - returns full per-parameter
    min/max/default/description, equation label, complexity, uvDomain."""
    status, data = http_get(f"/api/shapes/list?shapeType={shape_type}")
    if status == 200 and "parameters" in data:
        return data
    return None


def try_unconfirmed_endpoints(category_names):
    """
    Attempts list-shapes / get-defaults with several plausible body shapes.
    Logs every attempt + response so you can see exactly what the server
    accepts/rejects without re-running curl by hand. Does NOT assume success.
    """
    attempts = []

    list_shapes_bodies = [
        {"category": category_names[0]} if category_names else {"category": "topology"},
        {"params": {"category": category_names[0] if category_names else "topology"}},
        {"shapeId": "klein-bottle"},
        {"moduleParams": {"category": "topology"}},
        {},
    ]
    for body in list_shapes_bodies:
        status, data = http_post("/api/sdk/unified/shapes/list-shapes", body)
        attempts.append(
            {"endpoint": "list-shapes", "body": body, "status": status, "response": data}
        )
        if status == 200 and data.get("success"):
            print(f"  >>> list-shapes SUCCEEDED with body: {body}")
        time.sleep(0.2)

    get_defaults_bodies = [
        {"shapeId": "klein-bottle"},
        {"shapeType": "klein-bottle"},
        {"shapeId": "topology/klein-bottle"},
    ]
    for body in get_defaults_bodies:
        status, data = http_post("/api/sdk/unified/shapes/get-defaults", body)
        attempts.append(
            {"endpoint": "get-defaults", "body": body, "status": status, "response": data}
        )
        if status == 200 and data.get("success"):
            print(f"  >>> get-defaults SUCCEEDED with body: {body}")
        time.sleep(0.2)

    out_path = OUTPUT_DIR / "unconfirmed_endpoint_attempts.json"
    out_path.write_text(json.dumps(attempts, indent=2))
    print(f"[log] wrote {len(attempts)} attempts to {out_path}")
    return attempts


def build_training_examples(categories, engines, sdk_modules, shape_computations, shape_param_meta):
    """
    Builds instruction/output pairs from ONLY text-safe fields.
    Three example families:
      1. category -> shape count
      2. engine -> description/tier/shape count
      3. shape type -> resolved parameter vector (numeric but compact/structured)
      4. shape type -> parameter metadata (min/max/description per letter)
    """
    examples = []

    for cat in categories:
        examples.append({
            "instruction": f"How many shapes are in the '{cat['name']}' category of the UUON Δmension API?",
            "output": f"The '{cat['name']}' category contains {cat['count']} shapes."
        })

    for eng in engines:
        name = eng.get("name", eng.get("id"))
        desc = eng.get("description", "").rstrip(".")
        examples.append({
            "instruction": f"Describe the {name} in the UUON Δmension API.",
            "output": (
                f"{name} is a {eng.get('tier', 'unknown-tier')} engine. "
                f"{desc}. It exposes {eng.get('shapeCount', 'an unknown number of')} shapes "
                f"via endpoints: {', '.join(eng.get('endpoints', []))}."
            )
        })

    for module_name, module_info in sdk_modules.items():
        ops = ", ".join(module_info.get("operations", []))
        feats = ", ".join(module_info.get("features", []))
        examples.append({
            "instruction": f"What operations does the '{module_name}' module support in the Δmension unified SDK?",
            "output": f"The '{module_name}' module (v{module_info.get('version', '?')}) supports operations: {ops}. Features: {feats}."
        })

    for comp in shape_computations:
        params = comp.get("resolvedParameters", {})
        nonzero = {k: v for k, v in params.items() if v != 0}
        examples.append({
            "instruction": f"What are the non-zero resolved parameters for the '{comp['shapeType']}' shape?",
            "output": json.dumps(nonzero)
        })

    for meta in shape_param_meta:
        param_descs = []
        for letter, info in meta.get("parameters", {}).items():
            param_descs.append(
                f"{letter} (default {info.get('default')}, range {info.get('min')} to {info.get('max')}): {info.get('description')}"
            )
        examples.append({
            "instruction": f"Describe the parameters of the '{meta.get('id')}' shape.",
            "output": (
                f"'{meta.get('id')}' is a {meta.get('category')} shape with equation type "
                f"'{meta.get('equation')}' and complexity {meta.get('complexity')}. Parameters: "
                + "; ".join(param_descs)
            )
        })

    return examples


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--shapes-file", help="Optional JSON file with extra shape names per category, "
                                                "e.g. {\"topology\": [\"klein-bottle\", \"torus\"]}")
    parser.add_argument("--skip-unconfirmed", action="store_true",
                         help="Skip probing list-shapes/get-defaults variants")
    args = parser.parse_args()

    categories = fetch_categories()
    engines = fetch_engines()
    sdk_modules = fetch_sdk_discover()

    category_names = [c["name"] for c in categories]

    if not args.skip_unconfirmed:
        print("\n[probe] Attempting unconfirmed list-shapes / get-defaults variants...")
        try_unconfirmed_endpoints(category_names)

    # Build the known shape-type worklist: hardcoded + optional user file
    shape_worklist = list(KNOWN_SHAPE_TYPES)
    if args.shapes_file:
        extra = json.loads(Path(args.shapes_file).read_text())
        for cat, names in extra.items():
            shape_worklist.extend(names)
    shape_worklist = sorted(set(shape_worklist))

    print(f"\n[fetch] Computing {len(shape_worklist)} known shape type(s): {shape_worklist}")
    shape_computations = []
    shape_param_meta = []
    # we don't actually know each shape's category for certain beyond klein-bottle/topology;
    # try 'topology' as default category guess, this only affects the request payload context
    for shape_type in shape_worklist:
        comp = fetch_shape_compute("topology", shape_type)
        if comp:
            shape_computations.append(comp)
            print(f"  OK compute: {shape_type}")
        else:
            print(f"  SKIP compute: {shape_type} (failed)")

        meta = fetch_shape_parameter_metadata(shape_type)
        if meta:
            shape_param_meta.append(meta)
            print(f"  OK param metadata: {shape_type}")
        else:
            print(f"  SKIP param metadata: {shape_type} (failed)")
        time.sleep(0.2)

    examples = build_training_examples(
        categories, engines, sdk_modules, shape_computations, shape_param_meta
    )

    out_path = OUTPUT_DIR / "training_data.jsonl"
    with out_path.open("w") as f:
        for ex in examples:
            f.write(json.dumps(ex) + "\n")

    print(f"\n[done] Wrote {len(examples)} training examples to {out_path}")
    print(f"        Categories: {len(categories)} | Engines: {len(engines)} | "
          f"SDK modules: {len(sdk_modules)} | Shape computes: {len(shape_computations)} | "
          f"Param metadata: {len(shape_param_meta)}")
    if len(shape_computations) <= 1:
        print("\n[note] Only 1 (or 0) shape compute(s) succeeded. The dataset is currently "
              "dominated by category/engine/SDK metadata, not per-shape parameter data. "
              "Once list-shapes works (see unconfirmed_endpoint_attempts.json) or you supply "
              "--shapes-file with real names, re-run to enrich the dataset.")


if __name__ == "__main__":
    main()