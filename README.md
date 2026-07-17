# Clouud — Detection System for Grounded AI Reasoning

**UUON Foundation Inc. · Kassel, Germany**

Clouud is a detection architecture: it classifies signals, prices every
claim against measurement, and refuses grades higher than their evidence.
This repo contains the parts that exist and run today. Claims beyond that
are labeled PLANNED. See [REALITY_REPORT.md](REALITY_REPORT.md) for the
live validation of every checkable claim — regenerated from a real shell,
not asserted.

## What is in this repo (verified, runs)

- **clouud-observer/** — the Observer Module
  - `synchronicity.py` — four-condition event classifier (stdlib only)
  - `nightly_review.py` — unattended log review job
  - `docs/` — the constitution:
    - OBS-001 Observer Model & Synchronicity Detection
    - PHEN-002 Phenomena Lattice & Classification
    - FEED-003 Ingestion Quality Gate (every document graded before feed)
  - `logs/` — append-only event log; entry 001 is the canonical instance
  - `benchmark/` — CLOUUD-BENCH-004 golden set + scorecard
    (standard detection metrics: precision / recall / F1)

## Operating rules (enforced, not aspirational)

1. Nothing enters the corpus without a grade; no grade exceeds its
   measurement.
2. Numbers without disclosed methods are flagged, not ingested.
3. Only the human observer declares meaning; the machine verifies
   structure.
4. Promotion of any claim is paid for in instrumentation, never
   testimony volume.

## PLANNED (not built — labeled honestly)

- Commit-and-verify for reasoning traces: hash-commit a trace, verify by
  deterministic re-execution against the committed digest. Modest,
  buildable, unproven until benchmarked. No compression ratios, costs,
  or latency figures will be quoted until measured.
- npm package, Docker image, community channels: none exist yet.
  Anything claiming otherwise predates the reality report.

## License

MIT for the observer module. All other UUON documents remain property of
UUON Foundation Inc.

*No grade higher than its measurement.*
