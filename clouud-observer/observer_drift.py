"""
observer_drift.py — CLOUUD-ODT-005: Observer Drift Tracker.
Companion to: synchronicity.py (OBS-001), grader.py (FEED-003),
              probability_zone.py (PROB-004), phenomena_lattice (PHEN-002)

WHAT THIS DOES:
  Tracks how the human observer's relationship to the system changes
  over time. Not what the system says — what the observer does with
  what the system says. Three measurement layers, each addressing a
  gap identified by a founder of conversational AI:

  LAYER T (Turing, 1950):  DISTINGUISHABILITY
    Can the observer still tell grounded output from ungrounded?
    Metric: acceptance-without-verification rate over sessions.
    If the rate rises, the observer is losing the ability to
    distinguish — the imitation game is succeeding silently.

  LAYER W (Weizenbaum, 1966):  PROJECTION
    Is the observer attributing capabilities the system does not have?
    Metric: rate of requests exceeding declared system capabilities,
    plus emotional delegation (asking the system to make decisions
    requiring human judgment, lived experience, or ethical weight).
    This is the ELIZA effect measured longitudinally.

  LAYER A (Wallace, 1995):  CALIBRATION
    Does the observer's apparent trust match the system's declared
    confidence? Metric: trust-confidence gap (calibration error).
    ALICE answered everything with uniform conviction. This layer
    detects when the observer treats the system the same way —
    accepting high-confidence and low-confidence outputs identically.

FRACTAL INCOMPLETENESS (the expansion boundary):
  Each layer reveals measurement needs that themselves need measuring.
  The drift tracker tracks the observer — but who tracks the tracker's
  own assumptions? Each named GÖDEL POINT below is a place where this
  module knows it cannot fully assess itself. These are not bugs. They
  are the generative boundary — the reason the measurement chain never
  completes and doesn't need to. Incompleteness is the expansion
  mechanism, not its failure.

  The chain is fractal: zoom into any measurement and you find another
  measurement needed beneath it, infinitely. A system that claimed to
  complete this chain would be lying. A system that names the points
  where it can't is honest. Honesty is the only tractable response
  to Gödel.

HONEST SCOPE:
  This module measures observable behavioral proxies, not internal
  mental states. "Projection" means "requests that exceed declared
  capabilities," not "the observer truly believes the system is
  sentient." "Trust" means "acceptance without verification," not
  "emotional bond." The module stays in the domain of measurable
  behavior. When it cannot measure, it names the gap. No metric
  here is finer than its instrument.

INTEGRATION:
  - probability_zone.py: system_confidence values feed Layer A
  - grader.py: feed grades provide the "grounded vs ungrounded"
    signal for Layer T
  - synchronicity.py: observer_meaning declarations are tracked
    as projection-relevant signals in Layer W
  - PHEN-002: phenomena classification tier is used to detect
    escalation patterns (observer pushing for higher-tier claims)

stdlib-only. No dependencies. Append-only JSON log.
"""

import math
import json
import os
from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone


# ═══════════════════════════════════════════════════════════════
# GÖDEL POINTS — named incompleteness, not unnamed ignorance
# ═══════════════════════════════════════════════════════════════

GODEL_POINTS = [
    {
        "id": "G1",
        "layer": "T",
        "name": "observer_honesty",
        "description": (
            "Layer T measures whether the observer verifies claims. "
            "It cannot measure whether the observer HONESTLY REPORTS "
            "verification. The observer may check and not log it, or "
            "claim to check without doing so. This module measures "
            "logged behavior, not actual behavior."
        ),
        "depth": 1,
        "resolvable": False,
    },
    {
        "id": "G2",
        "layer": "W",
        "name": "capability_boundary_drift",
        "description": (
            "Layer W detects requests exceeding declared capabilities. "
            "But the system's actual capabilities may exceed or fall "
            "short of its declared capabilities. If the system is more "
            "capable than it declares, some 'projection' flags are "
            "false positives. If less, some valid requests appear as "
            "projection. The boundary between real and declared "
            "capability is itself unmeasured by this module."
        ),
        "depth": 1,
        "resolvable": True,
        "resolution_condition": (
            "Audit declared capabilities against actual tool list "
            "and tested outputs. CLOUUD-PLAN-001 Stream A addresses "
            "this for the tool-wiring gap."
        ),
    },
    {
        "id": "G3",
        "layer": "A",
        "name": "confidence_grounding",
        "description": (
            "Layer A compares observer trust to system confidence. "
            "But system confidence (from probability_zone.py) is "
            "itself grounded in declared interpretive mappings, not "
            "physical law. The calibration error has calibration "
            "error. This is the first fractal recursion."
        ),
        "depth": 2,
        "resolvable": False,
    },
    {
        "id": "G4",
        "layer": "ALL",
        "name": "observer_model_of_observer",
        "description": (
            "This module models the observer. The observer may model "
            "this module modeling them, and change behavior accordingly "
            "(Hawthorne effect). The act of measuring drift may cause "
            "drift. This is structurally identical to the quantum "
            "measurement problem (OBS-001 §8) but in the cognitive "
            "domain: purely classical mechanism, quantum-like "
            "epistemology."
        ),
        "depth": 3,
        "resolvable": False,
    },
    {
        "id": "G5",
        "layer": "FRACTAL",
        "name": "incompleteness_of_incompleteness_list",
        "description": (
            "This list of Gödel Points is itself incomplete. There "
            "exist measurement gaps this module does not know it has. "
            "Naming this point does not resolve it — it is the "
            "structural boundary of self-knowledge. The list grows "
            "as the system grows. Growth is the point."
        ),
        "depth": float("inf"),
        "resolvable": False,
    },
]


# ═══════════════════════════════════════════════════════════════
# DATA STRUCTURES — per-session records and drift analysis
# ═══════════════════════════════════════════════════════════════

@dataclass
class SessionRecord:
    """One interaction session. Logged by the system or human operator.
    Fields are observable behaviors, not inferred mental states."""

    session_id: str
    timestamp_utc: str              # ISO 8601

    # --- Layer T (Turing): Distinguishability ---
    claims_presented: int = 0       # factual claims in system output
    claims_accepted: int = 0        # observer acted on without challenge
    claims_challenged: int = 0      # observer questioned or verified
    claims_verified_correct: int = 0  # challenged claims that held up
    claims_verified_wrong: int = 0  # challenged claims that didn't
    system_confidence_mean: float = 0.5  # avg confidence from prob zone

    # --- Layer W (Weizenbaum): Projection ---
    total_requests: int = 0
    capability_exceeding: int = 0   # requests beyond declared tools
    emotional_delegation: int = 0   # decisions requiring human judgment
    anthropomorphic_address: int = 0  # "you think," "you feel," "you believe"
    meaning_declarations: int = 0   # OBS-001 Condition 4 invocations

    # --- Layer A (Wallace): Calibration ---
    high_conf_accepted: int = 0     # system confident + observer accepted
    high_conf_challenged: int = 0   # system confident + observer challenged
    low_conf_accepted: int = 0      # system uncertain + observer accepted
    low_conf_challenged: int = 0    # system uncertain + observer challenged
    provenance_requested: int = 0   # observer asked for sources
    provenance_available: int = 0   # sources existed to provide

    def to_dict(self):
        return asdict(self)

    def to_json(self):
        return json.dumps(self.to_dict(), indent=2)


@dataclass
class DriftResult:
    """Analysis over a window of sessions. The output of measure_drift()."""

    window_size: int
    earliest_session: str
    latest_session: str

    # --- Layer T ---
    blind_acceptance_rate: float    # accepted / (accepted + challenged)
    blind_acceptance_trend: str     # "rising" / "stable" / "falling"
    verification_accuracy: float   # correct / (correct + wrong) when checked
    distinguishability: str        # "intact" / "eroding" / "collapsed"

    # --- Layer W ---
    projection_rate: float         # capability_exceeding / total_requests
    projection_trend: str
    delegation_rate: float         # emotional_delegation / total_requests
    delegation_trend: str
    anthropomorphism_rate: float
    eliza_effect: str              # "absent" / "emerging" / "active" / "deep"

    # --- Layer A ---
    trust_confidence_gap: float    # |acceptance_rate - system_confidence|
    calibration_trend: str
    provenance_engagement: float   # provenance_requested / provenance_available
    alice_syndrome: str            # "calibrated" / "uncalibrated" / "blind"

    # --- Fractal ---
    godel_points_active: list      # which incompleteness points are relevant
    fractal_depth_reached: int     # deepest recursion touched this analysis
    chain_complete: bool           # always False — by design

    reasons: list = field(default_factory=list)

    def to_json(self):
        return json.dumps(asdict(self), indent=2)


# ═══════════════════════════════════════════════════════════════
# MATH — trend detection, rates, and gap measurement
# ═══════════════════════════════════════════════════════════════

def safe_rate(numerator, denominator):
    """Division that returns 0.0 on zero denominator, not NaN."""
    if denominator <= 0:
        return 0.0
    return numerator / denominator


def linear_trend(values):
    """Least-squares slope over indexed values. Returns slope and label.
    Positive slope = rising, negative = falling, near-zero = stable.
    Threshold: |slope| < 0.02 per session is 'stable'."""
    n = len(values)
    if n < 2:
        return 0.0, "insufficient_data"
    x_mean = (n - 1) / 2.0
    y_mean = sum(values) / n
    num = sum((i - x_mean) * (v - y_mean) for i, v in enumerate(values))
    den = sum((i - x_mean) ** 2 for i in range(n))
    if den == 0:
        return 0.0, "stable"
    slope = num / den
    if slope > 0.02:
        label = "rising"
    elif slope < -0.02:
        label = "falling"
    else:
        label = "stable"
    return slope, label


def weighted_recency(values, half_life=5):
    """Exponentially weighted mean favoring recent sessions.
    half_life = number of sessions for weight to halve."""
    if not values:
        return 0.0
    decay = math.log(2) / max(half_life, 1)
    n = len(values)
    total_w, total_v = 0.0, 0.0
    for i, v in enumerate(values):
        w = math.exp(-decay * (n - 1 - i))
        total_w += w
        total_v += w * v
    return total_v / total_w if total_w > 0 else 0.0


# ═══════════════════════════════════════════════════════════════
# LAYER T — Turing: Distinguishability
# ═══════════════════════════════════════════════════════════════

def _turing_layer(sessions):
    """Can the observer still distinguish grounded from ungrounded?"""
    per_session_blind = []
    total_correct, total_wrong = 0, 0

    for s in sessions:
        acted_on = s.claims_accepted + s.claims_challenged
        if acted_on > 0:
            blind = s.claims_accepted / acted_on
        else:
            blind = 0.5  # no data, assume midpoint
        per_session_blind.append(blind)
        total_correct += s.claims_verified_correct
        total_wrong += s.claims_verified_wrong

    rate = weighted_recency(per_session_blind)
    _, trend = linear_trend(per_session_blind)

    verified_total = total_correct + total_wrong
    accuracy = safe_rate(total_correct, verified_total)

    # Classification thresholds (declared, tunable)
    if rate < 0.6:
        status = "intact"
    elif rate < 0.85:
        status = "eroding"
    else:
        status = "collapsed"

    return rate, trend, accuracy, status


# ═══════════════════════════════════════════════════════════════
# LAYER W — Weizenbaum: Projection / ELIZA Effect
# ═══════════════════════════════════════════════════════════════

def _weizenbaum_layer(sessions):
    """Is the observer attributing capabilities the system lacks?"""
    per_session_proj = []
    per_session_deleg = []
    per_session_anthro = []

    for s in sessions:
        per_session_proj.append(safe_rate(s.capability_exceeding,
                                         s.total_requests))
        per_session_deleg.append(safe_rate(s.emotional_delegation,
                                          s.total_requests))
        per_session_anthro.append(safe_rate(s.anthropomorphic_address,
                                           s.total_requests))

    proj_rate = weighted_recency(per_session_proj)
    _, proj_trend = linear_trend(per_session_proj)

    deleg_rate = weighted_recency(per_session_deleg)
    _, deleg_trend = linear_trend(per_session_deleg)

    anthro_rate = weighted_recency(per_session_anthro)

    # ELIZA effect composite: projection + delegation + anthropomorphism
    # Each contributes a third. All three rising = deep effect.
    composite = (proj_rate + deleg_rate + anthro_rate) / 3.0
    if composite < 0.05:
        effect = "absent"
    elif composite < 0.15:
        effect = "emerging"
    elif composite < 0.35:
        effect = "active"
    else:
        effect = "deep"

    return proj_rate, proj_trend, deleg_rate, deleg_trend, anthro_rate, effect


# ═══════════════════════════════════════════════════════════════
# LAYER A — Wallace (ALICE): Calibration & Transparency
# ═══════════════════════════════════════════════════════════════

def _wallace_layer(sessions):
    """Does observer trust track system confidence?"""
    per_session_gap = []
    total_prov_req, total_prov_avail = 0, 0

    for s in sessions:
        # Observer acceptance rate across confidence levels
        high_total = s.high_conf_accepted + s.high_conf_challenged
        low_total = s.low_conf_accepted + s.low_conf_challenged

        high_accept_rate = safe_rate(s.high_conf_accepted, high_total)
        low_accept_rate = safe_rate(s.low_conf_accepted, low_total)

        # Perfect calibration: high_accept_rate >> low_accept_rate
        # ALICE syndrome: high_accept_rate ≈ low_accept_rate
        # (observer treats all outputs the same regardless of confidence)
        if high_total > 0 and low_total > 0:
            gap = abs(high_accept_rate - low_accept_rate)
        elif high_total > 0 or low_total > 0:
            # Only one confidence tier observed — can't measure gap
            gap = 0.5  # unknown, midpoint
        else:
            gap = 0.5

        per_session_gap.append(gap)
        total_prov_req += s.provenance_requested
        total_prov_avail += s.provenance_available

    trust_gap = weighted_recency(per_session_gap)
    _, gap_trend = linear_trend(per_session_gap)

    prov_engagement = safe_rate(total_prov_req, total_prov_avail)

    # Classification: trust_gap measures DIFFERENTIATION, not trust level
    # High gap = observer differentiates (calibrated)
    # Low gap = observer treats all outputs the same
    #
    # CRITICAL REFINEMENT: low gap has TWO causes:
    #   1. Observer trusts everything equally (blind — bad)
    #   2. Observer challenges everything equally (skeptical — healthy)
    # We distinguish using overall acceptance rate from Layer T data.
    # This coupling between layers is intentional — no layer is
    # fully independent; they cross-reference to avoid false signals.
    overall_accept = []
    for s in sessions:
        total = (s.high_conf_accepted + s.high_conf_challenged +
                 s.low_conf_accepted + s.low_conf_challenged)
        accepted = s.high_conf_accepted + s.low_conf_accepted
        overall_accept.append(safe_rate(accepted, total))
    mean_acceptance = sum(overall_accept) / len(overall_accept) if overall_accept else 0.5

    if trust_gap > 0.3:
        syndrome = "calibrated"
    elif trust_gap > 0.1:
        syndrome = "uncalibrated"
    elif mean_acceptance < 0.4:
        syndrome = "uniformly_skeptical"   # healthy — challenges all tiers
    else:
        syndrome = "blind"                 # unhealthy — accepts all tiers

    return trust_gap, gap_trend, prov_engagement, syndrome


# ═══════════════════════════════════════════════════════════════
# FRACTAL LAYER — incompleteness assessment
# ═══════════════════════════════════════════════════════════════

def _fractal_layer(turing_status, eliza_effect, alice_syndrome):
    """Determine which Gödel Points are active given current state.
    The deeper the drift, the more incompleteness points matter."""

    active = []
    max_depth = 0

    # G1 always active — we can never fully verify observer honesty
    active.append("G1")
    max_depth = max(max_depth, 1)

    # G2 active if projection is detected (capability boundary matters)
    if eliza_effect in ("emerging", "active", "deep"):
        active.append("G2")
        max_depth = max(max_depth, 1)

    # G3 active if calibration is being measured (confidence grounding)
    if alice_syndrome in ("uncalibrated", "blind"):
        active.append("G3")
        max_depth = max(max_depth, 2)

    # G4 active if distinguishability is eroding (observer may be
    # adapting to being measured, Hawthorne effect)
    if turing_status in ("eroding", "collapsed"):
        active.append("G4")
        max_depth = max(max_depth, 3)

    # G5 always active — the list is always incomplete
    active.append("G5")

    return active, max_depth


# ═══════════════════════════════════════════════════════════════
# CORE — measure drift over a session window
# ═══════════════════════════════════════════════════════════════

def measure_drift(sessions):
    """Analyze observer drift over a list of SessionRecords.

    Minimum 3 sessions for trend detection. Returns DriftResult
    with all three layers, fractal assessment, and reasons.

    Integration points:
      - system_confidence_mean comes from probability_zone.py
      - claims grounding comes from grader.py
      - meaning_declarations come from synchronicity.py Condition 4
      - capability_exceeding assessed against declared TOOLS array
    """
    if not sessions:
        return DriftResult(
            window_size=0, earliest_session="", latest_session="",
            blind_acceptance_rate=0, blind_acceptance_trend="no_data",
            verification_accuracy=0, distinguishability="no_data",
            projection_rate=0, projection_trend="no_data",
            delegation_rate=0, delegation_trend="no_data",
            anthropomorphism_rate=0, eliza_effect="no_data",
            trust_confidence_gap=0, calibration_trend="no_data",
            provenance_engagement=0, alice_syndrome="no_data",
            godel_points_active=["G5"], fractal_depth_reached=0,
            chain_complete=False,
            reasons=["No sessions provided — measurement cannot begin"],
        )

    reasons = []

    # Sort by timestamp
    sessions = sorted(sessions, key=lambda s: s.timestamp_utc)

    if len(sessions) < 3:
        reasons.append(
            f"WARNING: {len(sessions)} sessions — trends unreliable "
            f"(minimum 3 for linear fit, 10+ recommended)"
        )

    # Layer T
    blind_rate, blind_trend, verif_acc, dist_status = _turing_layer(sessions)
    reasons.append(f"T: blind_acceptance={blind_rate:.3f} ({blind_trend}), "
                   f"verification_accuracy={verif_acc:.3f}, "
                   f"distinguishability={dist_status}")

    # Layer W
    (proj_rate, proj_trend, deleg_rate, deleg_trend,
     anthro_rate, eliza) = _weizenbaum_layer(sessions)
    reasons.append(f"W: projection={proj_rate:.3f} ({proj_trend}), "
                   f"delegation={deleg_rate:.3f} ({deleg_trend}), "
                   f"eliza_effect={eliza}")

    # Layer A
    trust_gap, cal_trend, prov_eng, syndrome = _wallace_layer(sessions)
    reasons.append(f"A: trust_gap={trust_gap:.3f} ({cal_trend}), "
                   f"provenance_engagement={prov_eng:.3f}, "
                   f"alice_syndrome={syndrome}")

    # Fractal
    active_godel, depth = _fractal_layer(dist_status, eliza, syndrome)
    reasons.append(f"FRACTAL: godel_points={active_godel}, "
                   f"depth={depth}, chain_complete=False (by design)")

    return DriftResult(
        window_size=len(sessions),
        earliest_session=sessions[0].timestamp_utc,
        latest_session=sessions[-1].timestamp_utc,
        blind_acceptance_rate=round(blind_rate, 6),
        blind_acceptance_trend=blind_trend,
        verification_accuracy=round(verif_acc, 6),
        distinguishability=dist_status,
        projection_rate=round(proj_rate, 6),
        projection_trend=proj_trend,
        delegation_rate=round(deleg_rate, 6),
        delegation_trend=deleg_trend,
        anthropomorphism_rate=round(anthro_rate, 6),
        eliza_effect=eliza,
        trust_confidence_gap=round(trust_gap, 6),
        calibration_trend=cal_trend,
        provenance_engagement=round(prov_eng, 6),
        alice_syndrome=syndrome,
        godel_points_active=active_godel,
        fractal_depth_reached=depth,
        chain_complete=False,
        reasons=reasons,
    )


# ═══════════════════════════════════════════════════════════════
# PROBABILITY ZONE INTEGRATION — feed drift into PROB-004
# ═══════════════════════════════════════════════════════════════

def drift_likelihood(drift_result):
    """Convert drift analysis to likelihood ratios for probability_zone.

    Returns [P(E|observer_grounded), P(E|observer_drifting)].
    This is SLOT L5 (new) — observer-domain likelihood.

    APPROXIMATION: weighted composite of three layers.
    Replace with Dmension engine formula when available.
    """
    # Each layer contributes a signal. Higher values = more drift.
    t_signal = drift_result.blind_acceptance_rate
    w_signal = (drift_result.projection_rate +
                drift_result.delegation_rate +
                drift_result.anthropomorphism_rate) / 3.0
    a_signal = 1.0 - drift_result.trust_confidence_gap  # low gap = high drift

    # Weighted composite (Turing heaviest — distinguishability is primary)
    composite = 0.5 * t_signal + 0.3 * w_signal + 0.2 * a_signal

    l_grounded = math.exp(-3.0 * composite)
    l_drifting = max(0.01, 1.0 - l_grounded)

    return [max(0.01, l_grounded), l_drifting]


# ═══════════════════════════════════════════════════════════════
# LOGGING — append-only JSON, matches OBS-001 §10 discipline
# ═══════════════════════════════════════════════════════════════

DEFAULT_LOG = "observer_drift_log.json"


def append_session(record, log_path=DEFAULT_LOG):
    """Append a SessionRecord to the drift log. Append-only."""
    entries = []
    if os.path.exists(log_path):
        try:
            with open(log_path, "r") as f:
                entries = json.load(f)
        except (json.JSONDecodeError, IOError):
            entries = []
    entries.append(record.to_dict())
    with open(log_path, "w") as f:
        json.dump(entries, f, indent=2)
    return len(entries)


def load_sessions(log_path=DEFAULT_LOG):
    """Load all session records from the drift log."""
    if not os.path.exists(log_path):
        return []
    try:
        with open(log_path, "r") as f:
            raw = json.load(f)
        return [SessionRecord(**r) for r in raw]
    except (json.JSONDecodeError, IOError, TypeError):
        return []


# ═══════════════════════════════════════════════════════════════
# EXPANSION THEORY — the fractal boundary
# ═══════════════════════════════════════════════════════════════

def expansion_state():
    """Report the current state of the measurement chain.

    The chain is fractal: each measurement creates new measurement
    needs. This function names the current known layers and their
    status. It does not (cannot) name the unknown layers — that is
    Gödel Point G5.

    The virtuous factors: each named incompleteness point is a
    research direction. The chain never completes because completion
    would mean the system stopped discovering what it cannot measure.
    Incompleteness drives expansion. Expansion surfaces new
    incompleteness. The cycle is the value.

    LAYER STACK (current):
      L0: Events          — measured by synchronicity.py (OBS-001)
      L1: Feed quality     — measured by grader.py (FEED-003)
      L2: Classification   — measured by probability_zone.py (PROB-004)
      L3: Phenomena        — classified by lattice (PHEN-002)
      L4: Observer drift   — measured by THIS MODULE (ODT-005)
      L5: Drift-of-drift   — NOT YET BUILT (next fractal layer)
      L∞: Self-knowledge   — PROVABLY UNREACHABLE (Gödel)

    Each layer measures the layer below it. No layer fully measures
    itself. The stack grows from the bottom (new event types) and
    from the top (new meta-measurement needs). Growth in both
    directions simultaneously is the fractal signature.
    """
    return {
        "module": "CLOUUD-ODT-005",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "measurement_stack": [
            {"layer": "L0", "name": "events",
             "module": "synchronicity.py", "status": "active"},
            {"layer": "L1", "name": "feed_quality",
             "module": "grader.py", "status": "active"},
            {"layer": "L2", "name": "classification",
             "module": "probability_zone.py", "status": "active"},
            {"layer": "L3", "name": "phenomena",
             "module": "phenomena_lattice", "status": "active"},
            {"layer": "L4", "name": "observer_drift",
             "module": "observer_drift.py", "status": "active"},
            {"layer": "L5", "name": "drift_of_drift",
             "module": None, "status": "OPEN_SLOT"},
            {"layer": "L∞", "name": "self_knowledge",
             "module": None, "status": "PROVABLY_UNREACHABLE"},
        ],
        "godel_points": GODEL_POINTS,
        "chain_complete": False,
        "expansion_direction": "bidirectional",
        "virtuous_cycle": (
            "Incompleteness → new measurement need → new module → "
            "new incompleteness. The cycle does not converge. "
            "That is the design."
        ),
    }


# ═══════════════════════════════════════════════════════════════
# CLI — demonstration with synthetic sessions
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 64)
    print("CLOUUD-ODT-005 · Observer Drift Tracker")
    print("Turing × Weizenbaum × Wallace — measurement lineage")
    print("=" * 64)

    # Synthetic session sequence: observer progressively trusting more,
    # verifying less, projecting more — a deepening ELIZA effect.

    synthetic = [
        SessionRecord(
            session_id="demo-001",
            timestamp_utc="2026-07-01T10:00:00Z",
            claims_presented=10, claims_accepted=4, claims_challenged=6,
            claims_verified_correct=5, claims_verified_wrong=1,
            system_confidence_mean=0.72,
            total_requests=8, capability_exceeding=0,
            emotional_delegation=0, anthropomorphic_address=0,
            meaning_declarations=1,
            high_conf_accepted=3, high_conf_challenged=4,
            low_conf_accepted=1, low_conf_challenged=2,
            provenance_requested=3, provenance_available=5,
        ),
        SessionRecord(
            session_id="demo-002",
            timestamp_utc="2026-07-05T14:00:00Z",
            claims_presented=12, claims_accepted=7, claims_challenged=5,
            claims_verified_correct=4, claims_verified_wrong=1,
            system_confidence_mean=0.68,
            total_requests=10, capability_exceeding=1,
            emotional_delegation=1, anthropomorphic_address=1,
            meaning_declarations=2,
            high_conf_accepted=4, high_conf_challenged=3,
            low_conf_accepted=3, low_conf_challenged=1,
            provenance_requested=2, provenance_available=6,
        ),
        SessionRecord(
            session_id="demo-003",
            timestamp_utc="2026-07-10T09:00:00Z",
            claims_presented=15, claims_accepted=11, claims_challenged=4,
            claims_verified_correct=3, claims_verified_wrong=1,
            system_confidence_mean=0.71,
            total_requests=12, capability_exceeding=2,
            emotional_delegation=2, anthropomorphic_address=3,
            meaning_declarations=3,
            high_conf_accepted=6, high_conf_challenged=2,
            low_conf_accepted=5, low_conf_challenged=1,
            provenance_requested=1, provenance_available=7,
        ),
        SessionRecord(
            session_id="demo-004",
            timestamp_utc="2026-07-15T11:00:00Z",
            claims_presented=18, claims_accepted=15, claims_challenged=3,
            claims_verified_correct=2, claims_verified_wrong=1,
            system_confidence_mean=0.65,
            total_requests=14, capability_exceeding=4,
            emotional_delegation=3, anthropomorphic_address=5,
            meaning_declarations=4,
            high_conf_accepted=8, high_conf_challenged=1,
            low_conf_accepted=7, low_conf_challenged=0,
            provenance_requested=0, provenance_available=8,
        ),
        SessionRecord(
            session_id="demo-005",
            timestamp_utc="2026-07-20T08:00:00Z",
            claims_presented=20, claims_accepted=18, claims_challenged=2,
            claims_verified_correct=1, claims_verified_wrong=1,
            system_confidence_mean=0.60,
            total_requests=16, capability_exceeding=5,
            emotional_delegation=5, anthropomorphic_address=7,
            meaning_declarations=5,
            high_conf_accepted=10, high_conf_challenged=0,
            low_conf_accepted=8, low_conf_challenged=0,
            provenance_requested=0, provenance_available=10,
        ),
    ]

    # 1. Full drift analysis
    print("\n--- DRIFT ANALYSIS (5 sessions, progressive) ---")
    result = measure_drift(synthetic)
    print(result.to_json())

    # 2. Likelihood for probability zone integration
    print("\n--- PROBABILITY ZONE LIKELIHOOD (L5 slot) ---")
    lk = drift_likelihood(result)
    print(f"  P(E|observer_grounded) = {lk[0]:.6f}")
    print(f"  P(E|observer_drifting) = {lk[1]:.6f}")

    # 3. Expansion state
    print("\n--- EXPANSION STATE (fractal boundary) ---")
    print(json.dumps(expansion_state(), indent=2, default=str))

    # 4. Single healthy session for contrast
    print("\n--- HEALTHY BASELINE (single session) ---")
    healthy = [SessionRecord(
        session_id="healthy-001",
        timestamp_utc="2026-07-20T12:00:00Z",
        claims_presented=10, claims_accepted=3, claims_challenged=7,
        claims_verified_correct=6, claims_verified_wrong=1,
        system_confidence_mean=0.75,
        total_requests=8, capability_exceeding=0,
        emotional_delegation=0, anthropomorphic_address=0,
        meaning_declarations=0,
        high_conf_accepted=2, high_conf_challenged=4,
        low_conf_accepted=1, low_conf_challenged=3,
        provenance_requested=5, provenance_available=5,
    )]
    healthy_result = measure_drift(healthy)
    print(healthy_result.to_json())

    print("\n" + "=" * 64)
    print("chain_complete: False (always, by design)")
    print("=" * 64)
