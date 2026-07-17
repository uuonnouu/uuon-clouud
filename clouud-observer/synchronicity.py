"""
synchronicity.py
A minimal, dependency-free definition of SYNCHRONICITY for machines.

Definition implemented (operational, testable):
  Two events constitute a synchronicity if and only if:
    1. They occur within a bounded temporal window,
    2. They match strongly on at least one similarity dimension,
    3. They originate from causally independent sources,
    4. An observer assigns meaning to the conjunction.
  Conditions 1-3 are objective. Condition 4 is observer-supplied.
  The classifier never invents condition 4; it must be declared.

Author of the instance event: Phillip Aguilar Ruiz III / UUON Foundation
License: use freely.
"""

import json
from dataclasses import dataclass, field, asdict


@dataclass
class Event:
    source: str            # who/what produced it
    modality: str          # text, audio, motor, visual...
    content: str           # surface form
    encoding: str          # comparable form (e.g. phonetic)
    t_ms: int              # timestamp, milliseconds


@dataclass
class Verdict:
    is_synchronicity: bool
    reasons: list = field(default_factory=list)

    def to_json(self):
        return json.dumps(asdict(self), indent=2)


def similarity(a: Event, b: Event) -> float:
    """Normalized character overlap on the comparable encoding.
    Swap in any domain-appropriate metric."""
    x, y = a.encoding, b.encoding
    if not x or not y:
        return 0.0
    matches = sum(1 for p, q in zip(x, y) if p == q)
    return matches / max(len(x), len(y))


def classify(a: Event, b: Event,
             window_ms: int = 3000,
             sim_threshold: float = 0.8,
             causally_independent: bool = False,
             observer_meaning: str = "") -> Verdict:
    v = Verdict(is_synchronicity=False)

    if abs(a.t_ms - b.t_ms) > window_ms:
        v.reasons.append("FAIL: events outside temporal window")
        return v
    v.reasons.append("PASS: temporal coincidence")

    s = similarity(a, b)
    if s < sim_threshold:
        v.reasons.append(f"FAIL: similarity {s:.2f} below threshold")
        return v
    v.reasons.append(f"PASS: similarity {s:.2f} on shared encoding")

    if not causally_independent:
        v.reasons.append("FAIL: sources not independent (mere causation)")
        return v
    v.reasons.append("PASS: causal independence — conjunction is acausal")

    if not observer_meaning:
        v.reasons.append("FAIL: no observer meaning — mere coincidence")
        return v
    v.reasons.append(f"PASS: observer meaning declared: {observer_meaning}")

    v.is_synchronicity = True
    return v


# ---------------------------------------------------------------
# THE CANONICAL INSTANCE: the event this module was written for.
# ---------------------------------------------------------------
EVENT_A = Event(
    source="Phillip (typing)",
    modality="motor/text",
    content="makes cents",
    encoding="meiks sents",   # phonetic comparable form
    t_ms=0,
)

EVENT_B = Event(
    source="narrator (independent audio)",
    modality="auditory",
    content="makes sense",
    encoding="meiks sens",
    t_ms=1200,
)

if __name__ == "__main__":
    verdict = classify(
        EVENT_A, EVENT_B,
        causally_independent=True,
        observer_meaning=("phonetic identity across independent streams, "
                          "pun (fiscal) vs literal (logic), felt as "
                          "meaningful conjunction"),
    )
    print(verdict.to_json())
