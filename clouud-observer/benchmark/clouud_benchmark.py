"""
clouud_benchmark.py — CLOUUD-BENCH-004
Standard detection-system evaluation for the Clouud observer module.
Metrics: confusion matrix, precision, recall, F1, accuracy, per-condition
failure analysis. Stdlib only. Writes CLOUUD_SCORECARD.md + results.json.

Honest scope note (printed in the scorecard): the classifier is
deterministic and the golden set is labeled from the same four-condition
definition. A perfect score therefore proves IMPLEMENTATION CORRECTNESS
(code matches spec), not real-world discrimination power. The live test
is the growing observer log, scored against base rates over time
(OBS-001 Section 6). This harness is the regression floor every future
change must clear.
"""

import json, time, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from synchronicity import Event, classify

HERE = os.path.dirname(os.path.abspath(__file__))


def run():
    with open(os.path.join(HERE, "golden_set.json")) as f:
        golden = json.load(f)

    tp = fp = tn = fn = 0
    rows, condition_failures = [], {}

    for case in golden["cases"]:
        a = Event(**case["a"]); b = Event(**case["b"])
        v = classify(a, b,
                     causally_independent=case["causally_independent"],
                     observer_meaning=case["observer_meaning"])
        expected = case["label"] == "TRUE_SYNCHRONICITY"
        got = v.is_synchronicity
        ok = expected == got
        if expected and got: tp += 1
        elif expected and not got: fn += 1
        elif not expected and got: fp += 1
        else: tn += 1
        for r in v.reasons:
            if r.startswith("FAIL"):
                key = r.split(":")[1].strip()[:40]
                condition_failures[key] = condition_failures.get(key, 0) + 1
        rows.append({"id": case["id"], "label": case["label"],
                     "tests": case["tests"], "expected": expected,
                     "predicted": got, "correct": ok,
                     "reasons": v.reasons})

    n = len(rows)
    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) else 0.0
    accuracy = (tp + tn) / n

    results = {
        "benchmark_id": "CLOUUD-BENCH-004",
        "ran_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "golden_set": golden["meta"]["id"],
        "n_cases": n,
        "confusion_matrix": {"TP": tp, "FP": fp, "TN": tn, "FN": fn},
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1": round(f1, 4),
        "accuracy": round(accuracy, 4),
        "condition_failure_counts": condition_failures,
        "cases": rows,
    }
    with open(os.path.join(HERE, "results.json"), "w") as f:
        json.dump(results, f, indent=2)

    grade = "PASS — implementation matches spec" if accuracy == 1.0 else \
            f"FAIL — {n - (tp + tn)} case(s) diverge from spec; fix before push"

    md = []
    md.append("# CLOUUD Benchmark Scorecard — CLOUUD-BENCH-004\n")
    md.append(f"Ran (UTC): {results['ran_at_utc']}  |  Golden set: {n} labeled cases\n")
    md.append("## Standard detection metrics\n")
    md.append("| Metric | Value |")
    md.append("|---|---|")
    md.append(f"| Precision | {results['precision']} |")
    md.append(f"| Recall | {results['recall']} |")
    md.append(f"| F1 | {results['f1']} |")
    md.append(f"| Accuracy | {results['accuracy']} |")
    md.append(f"| Confusion (TP/FP/TN/FN) | {tp}/{fp}/{tn}/{fn} |")
    md.append(f"\n**Verdict: {grade}**\n")
    md.append("## Per-case results\n")
    md.append("| ID | Label | Exercises | Predicted sync? | Correct |")
    md.append("|---|---|---|---|---|")
    for r in rows:
        md.append(f"| {r['id']} | {r['label']} | {r['tests']} | "
                  f"{r['predicted']} | {'✓' if r['correct'] else '✗ MISMATCH'} |")
    md.append("\n## Scope statement (honest labeling, per FEED-003)\n")
    md.append("This scorecard measures IMPLEMENTATION CORRECTNESS: the "
              "deterministic classifier against a golden set labeled from the "
              "same OBS-001 definition. It is the regression floor — every "
              "future change to the classifier must keep this at 100%. It is "
              "NOT a measure of real-world discrimination power. That measure "
              "accrues in logs/ as observer-labeled events accumulate and are "
              "scored against base rates (OBS-001 §6). Grade of this artifact: "
              "CLEAN as regression test; claims beyond that scope: none made.\n")
    md.append("## Standard-model context\n")
    md.append("LLM benchmarks (MMLU, HumanEval, MT-Bench, Arena Elo) do not "
              "apply: Clouud's observer module is a detection system, not a "
              "chatbot. The applicable standard is the confusion-matrix "
              "family above — the same framework used for spam filters, "
              "fraud detection, and medical screening.\n")

    with open(os.path.join(HERE, "CLOUUD_SCORECARD.md"), "w") as f:
        f.write("\n".join(md))

    print(json.dumps({k: results[k] for k in
                      ["n_cases", "confusion_matrix", "precision",
                       "recall", "f1", "accuracy"]}, indent=2))
    print(f"\n{grade}")
    print("Wrote: CLOUUD_SCORECARD.md, results.json")


if __name__ == "__main__":
    run()
