# CLOUUD Observer Drift Tracker — Specification

Document ID: CLOUUD-ODT-005
Companion to: OBS-001, PHEN-002, FEED-003, PROB-004
Drafted: 2026-07-20
Status: Active — v1.0
Code: clouud-observer/observer_drift.py

---

## 1. What This Is

A longitudinal measurement instrument that tracks how the human
observer's relationship to Clouud changes over time. Not what the
system says — what the observer does with what the system says.

Three measurement layers, each addressing a gap identified by a
founder of conversational AI.

---

## 2. The Three Layers

### Layer T — Turing (1950): Distinguishability

Can the observer still tell grounded output from ungrounded?

Turing's imitation game located intelligence in the observer's
judgment but never modeled the observer. This layer measures
whether the observer is losing the ability to distinguish —
whether the imitation game is succeeding silently.

Metric: blind acceptance rate (accepted without verification /
total claims acted on), tracked over sessions with trend detection.

Thresholds (declared, tunable):
  < 0.60 → intact
  0.60–0.85 → eroding
  > 0.85 → collapsed

### Layer W — Weizenbaum (1966): Projection (ELIZA Effect)

Is the observer attributing capabilities the system does not have?

Weizenbaum showed people projected understanding onto a keyword
matcher. This layer measures the ELIZA effect longitudinally:
capability-exceeding requests, emotional delegation, and
anthropomorphic address.

Composite metric: (projection_rate + delegation_rate +
anthropomorphism_rate) / 3.

Thresholds:
  < 0.05 → absent
  0.05–0.15 → emerging
  0.15–0.35 → active
  > 0.35 → deep

### Layer A — Wallace (1995): Calibration (ALICE Syndrome)

Does observer trust track system confidence?

ALICE answered everything with uniform conviction. This layer
detects when the observer treats high-confidence and low-confidence
outputs identically — the ALICE syndrome.

Metric: trust-confidence gap (difference in acceptance rate between
high-confidence and low-confidence outputs).

With cross-reference to Layer T:
  gap > 0.30 → calibrated
  gap > 0.10 → uncalibrated
  gap ≤ 0.10 + low overall acceptance → uniformly_skeptical (healthy)
  gap ≤ 0.10 + high overall acceptance → blind (unhealthy)

---

## 3. Fractal Incompleteness

Each layer reveals measurement needs that themselves need measuring.
Five named Gödel Points mark where this module knows it cannot
fully assess itself:

  G1: Observer honesty (logged behavior ≠ actual behavior)
  G2: Capability boundary drift (declared ≠ actual capabilities)
  G3: Confidence grounding (calibration error has calibration error)
  G4: Observer model of observer (Hawthorne effect — measurement causes drift)
  G5: Incompleteness of incompleteness list (always incomplete, by construction)

The chain never completes. Incompleteness drives expansion.
Expansion surfaces new incompleteness. The cycle is the value.

---

## 4. Measurement Stack

```
L0: Events           — synchronicity.py (OBS-001)
L1: Feed quality      — grader.py (FEED-003)
L2: Classification    — probability_zone.py (PROB-004)
L3: Phenomena         — phenomena_lattice (PHEN-002)
L4: Observer drift    — observer_drift.py (ODT-005) ← THIS MODULE
L5: Drift-of-drift    — OPEN SLOT
L∞: Self-knowledge    — PROVABLY UNREACHABLE (Gödel)
```

Each layer measures the layer below it. No layer fully measures
itself. The stack grows bidirectionally: new event types from
below, new meta-measurement needs from above.

---

## 5. Integration Points

### Input from existing modules:
  - system_confidence_mean ← probability_zone.py (PROB-004)
  - feed grades ← grader.py (FEED-003)
  - meaning_declarations ← synchronicity.py Condition 4 (OBS-001)
  - classification tier ← phenomena_lattice (PHEN-002)

### Output to probability zone:
  - drift_likelihood() returns [P(E|grounded), P(E|drifting)]
  - This fills SLOT L5 — observer-domain likelihood
  - Feeds directly into Bayesian update (PROB-004 Z4 node)

### Logging:
  - Append-only JSON (observer_drift_log.json)
  - Schema extends OBS-001 §10 event log
  - Full provenance chain per analysis

---

## 6. What This Does NOT Do

  - Does not infer mental states. "Projection" means observable
    behavior (capability-exceeding requests), not belief.
  - Does not prevent drift. It measures drift. The response to
    a drift signal is a human decision, not an automated one.
  - Does not replace OBS-001 Condition 4. Observer meaning is
    still human-supplied only. This module measures the observer's
    BEHAVIOR, not their declarations.
  - Does not claim to measure itself completely. Gödel Points
    G1–G5 name what it structurally cannot assess.

---

## 7. Feed Manifest Grade

CLEAN. Declared metrics, reproducible, verdicts carry reasons,
incompleteness points explicitly named. All thresholds declared
and tunable. No unfalsifiable anchors. No G°centric dependency.
The module's zero-point is statistical (base rates from session
data), not assigned.
