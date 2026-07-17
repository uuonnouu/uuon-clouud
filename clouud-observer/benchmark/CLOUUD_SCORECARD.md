# CLOUUD Benchmark Scorecard — CLOUUD-BENCH-004

Ran (UTC): 2026-07-17T11:43:33Z  |  Golden set: 10 labeled cases

## Standard detection metrics

| Metric | Value |
|---|---|
| Precision | 1.0 |
| Recall | 1.0 |
| F1 | 1.0 |
| Accuracy | 1.0 |
| Confusion (TP/FP/TN/FN) | 3/0/7/0 |

**Verdict: PASS — implementation matches spec**

## Per-case results

| ID | Label | Exercises | Predicted sync? | Correct |
|---|---|---|---|---|
| T01 | TRUE_SYNCHRONICITY | all four conditions pass | True | ✓ |
| T02 | TRUE_SYNCHRONICITY | tight window, identical surface | True | ✓ |
| T03 | TRUE_SYNCHRONICITY | cross-modal match at threshold edge | True | ✓ |
| N01 | NEAR_MISS | FAILS condition 1: outside temporal window | False | ✓ |
| N02 | NEAR_MISS | FAILS condition 2: weak similarity | False | ✓ |
| N03 | NEAR_MISS | FAILS condition 3: causally linked (echo) | False | ✓ |
| N04 | NEAR_MISS | FAILS condition 4: no observer meaning declared | False | ✓ |
| X01 | NOISE | fails multiple conditions | False | ✓ |
| X02 | NOISE | empty encoding guard | False | ✓ |
| X03 | NOISE | similarity genuinely below threshold (0.4) | False | ✓ |

## Scope statement (honest labeling, per FEED-003)

This scorecard measures IMPLEMENTATION CORRECTNESS: the deterministic classifier against a golden set labeled from the same OBS-001 definition. It is the regression floor — every future change to the classifier must keep this at 100%. It is NOT a measure of real-world discrimination power. That measure accrues in logs/ as observer-labeled events accumulate and are scored against base rates (OBS-001 §6). Grade of this artifact: CLEAN as regression test; claims beyond that scope: none made.

## Standard-model context

LLM benchmarks (MMLU, HumanEval, MT-Bench, Arena Elo) do not apply: Clouud's observer module is a detection system, not a chatbot. The applicable standard is the confusion-matrix family above — the same framework used for spam filters, fraud detection, and medical screening.
