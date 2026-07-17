"""
nightly_review.py — Clouud Observer Module, unattended job.
Runs on a schedule. Reads the append-only log, recomputes observed vs
expected rates per category, appends a dated report. No interaction needed.
Stdlib only. CLOUUD-OBS-001 Section 11, step 5 (REVIEW).
"""

import json, time, os

LOG = os.path.join(os.path.dirname(__file__), "logs", "synchronicity_log.json")
REPORT = os.path.join(os.path.dirname(__file__), "logs", "review_reports.jsonl")


def load_entries(path):
    entries = []
    if not os.path.exists(path):
        return entries
    with open(path) as f:
        buf = ""
        for line in f:
            buf += line
            try:
                entries.append(json.loads(buf))
                buf = ""
            except json.JSONDecodeError:
                continue
    return entries


def review():
    entries = load_entries(LOG)
    n = len(entries)
    report = {
        "reviewed_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "entries_total": n,
        "with_base_rate": sum(1 for e in entries if "base_rate_estimate" in e
                              or "scores" in e),
        "verdict": None,
        "note": "",
    }
    if n < 30:
        report["verdict"] = "INSUFFICIENT_SAMPLES"
        report["note"] = (f"{n} entries. No observed-vs-expected claim is "
                          "permitted below 30 samples per category. "
                          "Keep logging.")
    else:
        report["verdict"] = "COMPARE"
        report["note"] = ("Sufficient samples exist; extend this job with "
                          "per-category observed/expected comparison.")
    with open(REPORT, "a") as f:
        f.write(json.dumps(report) + "\n")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    review()
