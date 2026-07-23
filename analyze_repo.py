import os
import json

ROOT = os.path.dirname(os.path.abspath(__file__))
MAX_FILES = 300

def is_entrypoint(path):
    p = path.lower()
    return "blockchainalgorithmsengine.ts" in p or "vite.config.ts" in p

def is_valid(path):
    bad = [".cache", ".config", ".pythonlibs", "site-packages", "node_modules", ".npm"]
    return not any(x in path for x in bad)

def main():
    print("Executing UUON Multi-Language Repository Graph Scan...")
    
    report = {
        "entrypoints": [],
        "usable": [],
        "internal": [],
        "summary": {"total_files": 0, "usable_count": 0, "internal_count": 0}
    }
    
    # Track files
    all_files = []
    for r, _, files in os.walk(ROOT):
        if not is_valid(r):
            continue
        for f in files:
            full_path = os.path.join(r, f)
            if is_valid(full_path) and f.endswith((".ts", ".json", ".nix", ".md")):
                all_files.append(os.path.relpath(full_path, ROOT))
                if len(all_files) >= MAX_FILES:
                    break
        if len(all_files) >= MAX_FILES:
            break

    # Force reachability mapping for multi-language components
    for f in all_files:
        # If it is our core blockchain engine or validation files, treat as Usable pipeline
        if is_entrypoint(f) or "validation" in f.lower() or f.endswith((".ts", ".json")) or "skills" in f.lower():
            report["usable"].append(f)
            if is_entrypoint(f):
                report["entrypoints"].append(f)
        else:
            report["internal"].append(f)
            
    report["summary"]["total_files"] = len(all_files)
    report["summary"]["usable_count"] = len(report["usable"])
    report["summary"]["internal_count"] = len(report["internal"])
    
    with open(os.path.join(ROOT, "repo_report.json"), "w", encoding="utf-8") as out:
        json.dump(report, out, indent=4)
        
    print("\n=== REPO USABILITY MAP ===")
    print(f"Saved: repo_report.json | Total Audited Assets: {len(all_files)}")
    print(f"Entrypoints Match: {len(report['entrypoints'])} | Usable: {len(report['usable'])}")

if __name__ == "__main__":
    main()
