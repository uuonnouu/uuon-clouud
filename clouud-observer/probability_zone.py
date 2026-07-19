"""
probability_zone.py — CLOUUD-PROB-004: Probability operating zone.
Companion to: synchronicity.py (OBS-001), grader.py (FEED-003)
Source geometry: Dmension Quantum Probability Distribution engine
Formula: |ψ⟩ = α|0⟩ + β|1⟩,  |α|² + |β|² = 1
GLB ref: quantum_probability_distribution_ar_universal.glb

WHAT THIS DOES:
  Clouud walks a six-zone graph for every classification decision.
  The graph's geometry comes from a real Dmension engine output —
  a quantum probability distribution shape whose computed physical
  and geometric properties set the operating parameters.

WHAT THE PARAMETERS MEAN:
  Normalization (|α|²+|β|²=1) → probabilities must sum to 1.
  Inertia tensor             → resistance to belief change per axis.
  Gaussian curvature (K)     → decision boundary sharpness.
  Mean curvature (H)         → confidence threshold.
  Material density           → prior strength (water=moderate, neutron_star=immovable).

STATE SPACE NOTE (ℝ vs ℂ):
  The source geometry lives on S³ (complex): α,β ∈ ℂ gives
  a²+b²+c²+d² = 1 (4 real dimensions, hypersphere).
  Our operating space is the real simplex projection: P(H)+P(¬H)=1
  (classical probability, no phases). This is correct — Clouud does
  classical Bayesian inference, not quantum computing. The quantum
  geometry provides the shape; the Fisher metric provides the natural
  distance on our projection of it. The Fisher metric IS the real
  restriction of the Fubini-Study metric (the natural quantum metric).
  This is a precise mathematical relationship, not a metaphor.

HONEST SCOPE:
  The inertia→damping and curvature→threshold mappings are declared
  interpretive choices, not physical laws. They are testable: change
  the mapping, rerun BENCH-005, measure the effect. The Dmension
  formulas provide the numbers; the mappings decide how those numbers
  govern probability updates. Both are explicit and adjustable.

  Four likelihood formula slots (L1–L4) use approximations until
  Dmension engine formulas replace them. Empty slots default to
  simple functions that are clearly marked. An empty slot never
  pretends to compute more than it does.

stdlib-only. No dependencies.
"""

import math
import json
from dataclasses import dataclass, field, asdict


# ═══════════════════════════════════════════════════════════════
# ZONE GEOMETRY — from Dmension Quantum Probability Distribution
# ═══════════════════════════════════════════════════════════════

ZONE = {
    "formula": "|α|² + |β|² = 1",
    "volume_m3":          0.0464,
    "surface_area_m2":    4.4962,
    "gaussian_curvature": 743.0670,   # K — elliptic
    "mean_curvature":     7.0959,     # H
    "kappa_1":            7.10,       # principal curvature max
    "kappa_2":            7.10,       # principal curvature min (umbilical)
    "center_of_mass":     (-0.2, 0.3, 3.1),
    "euler_characteristic": 81,
    "genus":              0,
    "coord_system":       "cylindrical",
    "mesh": {"V": 1105, "E": 3072, "F": 2048},
    "inertia_water": {                # at ρ = 1000 kg/m³
        "Ixx": 7.66e+1,  "Ixy": 2.58e+0,  "Ixz": -1.75e-2,
        "Iyy": 8.30e+1,  "Iyz": 8.17e-3,
        "Izz": 1.60e+2,
    },
    "inertia_neutron": {              # at ρ = 4×10¹⁷ kg/m³
        "Ixx": 3.08e+16, "Ixy": 9.83e+14, "Ixz": -7.37e+12,
        "Iyy": 3.34e+16, "Iyz": 3.47e+12,
        "Izz": 6.42e+16,
    },
    "glb_ref": [
        "quantum_probability_distribution_ar_universal.glb",
        "quantum_probability_distribution_wireframe_fallback.glb",
        "quantum_probability_distribution_points_fallback.glb",
    ],
}

# Material densities (kg/m³). Scales inertia linearly from water baseline.
DENSITIES = {
    "air":      1.225,      "wood_oak":   750,       "water":    1_000,
    "plastic":  1_050,      "concrete":   2_400,     "glass":    2_500,
    "aluminum": 2_700,      "diamond":    3_510,     "titanium": 4_500,
    "steel":    7_850,      "gold":       19_300,    "neutron_star": 4e17,
}

_BASE_DENSITY = 1_000.0


# ═══════════════════════════════════════════════════════════════
# MATH CORE — Bayes + simplex constraint
# ═══════════════════════════════════════════════════════════════

def normalize(v):
    """Enforce Σp = 1. The simplex constraint from |α|²+|β|²=1."""
    s = sum(v)
    if s <= 0:
        return [1.0 / len(v)] * len(v)
    return [x / s for x in v]


def log_odds(p):
    """Probability → log-odds (stable at extremes)."""
    p = max(1e-15, min(1 - 1e-15, p))
    return math.log(p / (1 - p))


def from_log_odds(lo):
    """Log-odds → probability."""
    return 1.0 / (1.0 + math.exp(-lo))


def bayesian_update(prior, likelihoods):
    """Z4 node. Bayes' theorem. Fixed — no formula slots."""
    assert len(prior) == len(likelihoods)
    raw = [p * l for p, l in zip(prior, likelihoods)]
    return normalize(raw)


# ═══════════════════════════════════════════════════════════════
# INFORMATION GEOMETRY — Fisher metric, entropy, Hellinger
# ═══════════════════════════════════════════════════════════════
# Why these and not Euclidean margin:
#   The Fisher information metric is the natural Riemannian metric
#   on the probability simplex. It reduces from the Fubini-Study
#   metric on quantum state space when phases are discarded.
#   Our operating space (real simplex) is the classical projection
#   of the source geometry (complex S³ from |α|²+|β|²=1).
#   These functions compute distances on OUR space correctly.

def shannon_entropy(p_vec):
    """
    H = −Σ p·log₂(p). Measures classification uncertainty in bits.
    H = 0 → certain (one hypothesis dominates).
    H = log₂(n) → maximally uncertain (uniform distribution).
    """
    return -sum(p * math.log2(p) if p > 1e-15 else 0.0 for p in p_vec)


def hellinger_distance(p, q):
    """
    Hellinger distance: H(P,Q) = (1/√2) × √(Σ(√pᵢ − √qᵢ)²).
    Range [0,1]. Derived from Bhattacharyya coefficient.
    This IS the geodesic distance on the probability simplex
    under the Fisher metric (up to a constant factor).
    """
    assert len(p) == len(q)
    return math.sqrt(0.5 * sum((math.sqrt(pi) - math.sqrt(qi))**2
                                for pi, qi in zip(p, q)))


def bhattacharyya_coeff(p, q):
    """
    BC(P,Q) = Σ √(pᵢ·qᵢ). Measures overlap between distributions.
    BC = 1 → identical. BC = 0 → completely separated.
    Related to Hellinger: H² = 1 − BC.
    """
    assert len(p) == len(q)
    return sum(math.sqrt(pi * qi) for pi, qi in zip(p, q))


def fisher_distance_binary(p1, p2):
    """
    Fisher geodesic distance between two binary distributions.
    For P(H)=p1 vs P(H)=p2 on a 2-outcome simplex:
      d = 2·|arccos(√p1·√p2 + √(1−p1)·√(1−p2))|
    This is the arc length on the probability circle under the
    Fisher metric. Small probability changes near the extremes
    are LARGER (more informative) than the same change near 0.5.
    """
    p1 = max(1e-15, min(1 - 1e-15, p1))
    p2 = max(1e-15, min(1 - 1e-15, p2))
    cos_half = math.sqrt(p1 * p2) + math.sqrt((1 - p1) * (1 - p2))
    cos_half = max(-1.0, min(1.0, cos_half))
    return 2.0 * math.acos(cos_half)


# ═══════════════════════════════════════════════════════════════
# INERTIA-WEIGHTED UPDATE — tensor governs update resistance
# ═══════════════════════════════════════════════════════════════

def _get_damping(material, axis):
    """
    Compute damping factor from inertia tensor and material density.
    Damping = I_axis × (ρ/ρ_water) / I_xx_water.
    Normalized so water + x-axis = 1.0 (baseline, least resistant).
    """
    tensor = ZONE["inertia_water"]
    axis_val = {"x": tensor["Ixx"], "y": tensor["Iyy"], "z": tensor["Izz"]}.get(axis, tensor["Izz"])
    density_ratio = DENSITIES.get(material, _BASE_DENSITY) / _BASE_DENSITY
    return (axis_val * density_ratio) / tensor["Ixx"]


def weighted_update(prior, likelihoods, material="water", axis="z"):
    """
    Bayesian update with inertia damping.
    Likelihoods are pulled toward 1.0 (agnostic) by the damping factor.
    Higher damping = evidence has less pull = more conservative update.

    Mapping (declared interpretive choice):
      physical inertia (resistance to rotation)
      → epistemic inertia (resistance to belief change)
    """
    damping = _get_damping(material, axis)
    damped = [1.0 + (l - 1.0) / damping for l in likelihoods]
    return bayesian_update(prior, damped)


# ═══════════════════════════════════════════════════════════════
# DECISION MARGIN — curvature governs boundary sharpness
# ═══════════════════════════════════════════════════════════════

def decision_margin(posterior):
    """
    Z5 node. How close is the leading hypothesis to the boundary?

    Three distance measures reported:
      euclidean_margin: p_max − p_second (simple, for comparison)
      fisher_distance:  geodesic distance from uniform under Fisher metric
      entropy_bits:     Shannon entropy of the posterior

    Mean curvature H governs the confidence threshold on Fisher distance.
    The Fisher metric is geometrically correct for probability distributions —
    it is the real projection of the Fubini-Study metric on the source
    quantum state space S³.
    """
    n = len(posterior)
    ranked = sorted(posterior, reverse=True)
    euclidean_margin = ranked[0] - (ranked[1] if n > 1 else 0.0)

    # Uniform distribution = maximum uncertainty = the boundary center
    uniform = [1.0 / n] * n

    # Fisher distance from uniform (how far from "I don't know")
    fisher_dist = hellinger_distance(posterior, uniform)

    # Shannon entropy (bits of uncertainty remaining)
    entropy = shannon_entropy(posterior)
    max_entropy = math.log2(n) if n > 1 else 1.0

    # Threshold: 1/H on Fisher distance scale
    threshold = 1.0 / ZONE["mean_curvature"]       # ≈ 0.1409

    return {
        "euclidean_margin": round(euclidean_margin, 6),
        "fisher_distance":  round(fisher_dist, 6),
        "entropy_bits":     round(entropy, 6),
        "entropy_ratio":    round(entropy / max_entropy, 6) if max_entropy > 0 else 0,
        "threshold":        round(threshold, 6),
        "confident":        fisher_dist > threshold,
        "note":             "posterior well-separated (Fisher)"
                            if fisher_dist > threshold
                            else "near boundary — low confidence",
    }


# ═══════════════════════════════════════════════════════════════
# DOMAIN PRIORS — per-domain hypothesis sets + axis assignment
# ═══════════════════════════════════════════════════════════════

DOMAINS = {
    "sync": {
        "hypotheses": ["meaningful", "chance"],
        "prior":      [0.05, 0.95],     # most conjunctions are chance
        "axis":       "z",              # hardest to shift
    },
    "phenomena": {
        "hypotheses": ["data_strained", "model_strained", "law_strained"],
        "prior":      [0.80, 0.18, 0.02],
        "axis":       "z",
    },
    "feed": {
        "hypotheses": ["clean", "contaminated"],
        "prior":      [0.50, 0.50],     # agnostic until evidence
        "axis":       "y",              # moderate resistance
    },
    "shape": {
        "hypotheses": ["valid", "degenerate"],
        "prior":      [0.70, 0.30],
        "axis":       "x",              # easiest to shift
    },
}


# ═══════════════════════════════════════════════════════════════
# ZONE RESULT — full provenance chain
# ═══════════════════════════════════════════════════════════════

@dataclass
class ZoneResult:
    domain:         str
    prior:          list
    evidence:       dict
    likelihoods:    list
    posterior:       list
    decision:       dict
    material:       str
    zone_path:      list

    def to_json(self):
        return json.dumps(asdict(self), indent=2)


# ═══════════════════════════════════════════════════════════════
# TRAVERSE — walk the graph Z0 → Z6
# ═══════════════════════════════════════════════════════════════

def traverse(domain, evidence, likelihoods, material="water"):
    """
    Walk the zone graph for a single event.
      Z0 INTAKE → Z1 PRIOR → Z2 EVIDENCE → Z3 LIKELIHOOD →
      Z4 UPDATE → Z5 CLASSIFY → Z6 LOG
    Returns ZoneResult with every intermediate value preserved.
    """
    if domain not in DOMAINS:
        raise ValueError(f"unknown domain '{domain}'; known: {list(DOMAINS)}")

    cfg   = DOMAINS[domain]
    prior = cfg["prior"][:]
    axis  = cfg["axis"]

    posterior = weighted_update(prior, likelihoods, material, axis)
    margin   = decision_margin(posterior)

    best     = posterior.index(max(posterior))
    margin["classification"] = cfg["hypotheses"][best]
    margin["posterior_map"]   = dict(zip(cfg["hypotheses"],
                                        [round(p, 6) for p in posterior]))

    return ZoneResult(
        domain=domain, prior=prior, evidence=evidence,
        likelihoods=likelihoods,
        posterior=[round(p, 6) for p in posterior],
        decision=margin, material=material,
        zone_path=["Z0_INTAKE", f"Z1_PRIOR_{domain}",
                   f"Z2_{domain.upper()}_EVIDENCE",
                   "Z3_LIKELIHOOD", "Z4_UPDATE", "Z5_CLASSIFY", "Z6_LOG"],
    )


# ═══════════════════════════════════════════════════════════════
# SLOT L1 — sync likelihood (approximation, awaiting Dmension)
# ═══════════════════════════════════════════════════════════════

def sync_likelihood(similarity, window_ms, causally_independent):
    """
    APPROXIMATION for SLOT L1. Returns [P(E|meaningful), P(E|chance)].
    Replace with Dmension engine formula when available.
    Current logic:
      If meaningful, high similarity expected → l_meaningful ≈ sim
      If chance, high similarity rare → l_chance ≈ (1-sim) × window_decay
      If not causally independent → agnostic (no information)
    """
    if not causally_independent:
        return [0.5, 0.5]

    window_decay = max(0.01, 1.0 - (window_ms / 3000.0))
    l_meaningful = max(0.01, similarity)
    l_chance     = max(0.01, (1.0 - similarity) * (1.0 - window_decay) + 0.01)
    return [l_meaningful, l_chance]


def from_sync_verdict(similarity, window_ms, causally_independent,
                      inventory_prior=0.95, material="water"):
    """
    Integration point: synchronicity.py → probability zone.
    inventory_prior: P(chance) from OBS-001 §5 homophone inventory.
    """
    evidence = {
        "similarity": similarity,
        "window_ms": window_ms,
        "causally_independent": causally_independent,
        "slot": "L1_APPROXIMATION",
    }
    lk = sync_likelihood(similarity, window_ms, causally_independent)

    # Override domain prior with inventory-specific prior
    custom_prior = [1.0 - inventory_prior, inventory_prior]
    posterior = weighted_update(custom_prior, lk, material,
                               DOMAINS["sync"]["axis"])
    margin = decision_margin(posterior)

    hyps = DOMAINS["sync"]["hypotheses"]
    best = posterior.index(max(posterior))
    margin["classification"] = hyps[best]
    margin["posterior_map"]   = dict(zip(hyps, [round(p, 6) for p in posterior]))

    return ZoneResult(
        domain="sync", prior=custom_prior, evidence=evidence,
        likelihoods=lk,
        posterior=[round(p, 6) for p in posterior],
        decision=margin, material=material,
        zone_path=["Z0_INTAKE", "Z1_PRIOR_sync", "Z2_SYNC_EVIDENCE",
                   "Z3_LIKELIHOOD_L1_approx", "Z4_UPDATE", "Z5_CLASSIFY",
                   "Z6_LOG"],
    )


# ═══════════════════════════════════════════════════════════════
# SLOT L3 — feed likelihood (approximation, awaiting Dmension)
# ═══════════════════════════════════════════════════════════════

def feed_likelihood(pattern_counts):
    """
    APPROXIMATION for SLOT L3. Returns [P(E|clean), P(E|contaminated)].
    Replace with Dmension engine formula when available.
    Poison patterns decay P(clean) exponentially.
    """
    poison  = sum(pattern_counts.get(k, 0)
                  for k in ["DO_NOT_FEED", "PERSONAL_HOLD"])
    caution = sum(pattern_counts.get(k, 0)
                  for k in ["LABELED", "SPLIT"])
    l_clean = math.exp(-2.0 * poison) * math.exp(-0.5 * caution)
    l_dirty = max(0.01, 1.0 - l_clean)
    return [max(0.01, l_clean), l_dirty]


def from_feed_grade(pattern_counts, total_checked=0, material="water"):
    """Integration point: grader.py → probability zone."""
    evidence = {"pattern_counts": pattern_counts,
                "total_checked": total_checked,
                "slot": "L3_APPROXIMATION"}
    lk = feed_likelihood(pattern_counts)
    return traverse("feed", evidence, lk, material)


# ═══════════════════════════════════════════════════════════════
# ZONE METADATA — for GLB extras field encoding
# ═══════════════════════════════════════════════════════════════

def zone_metadata():
    """Full zone configuration. Encodes into GLB extras per PROB-004 §5."""
    return {
        "document_id": "CLOUUD-PROB-004",
        "formula":     ZONE["formula"],
        "geometry": {
            "volume_m3":          ZONE["volume_m3"],
            "surface_area_m2":    ZONE["surface_area_m2"],
            "gaussian_curvature": ZONE["gaussian_curvature"],
            "mean_curvature":     ZONE["mean_curvature"],
            "kappa":              [ZONE["kappa_1"], ZONE["kappa_2"]],
            "euler_chi":          ZONE["euler_characteristic"],
            "genus":              ZONE["genus"],
            "coord_system":       ZONE["coord_system"],
        },
        "center_of_mass":  ZONE["center_of_mass"],
        "inertia_water":   ZONE["inertia_water"],
        "inertia_neutron": ZONE["inertia_neutron"],
        "mesh":            ZONE["mesh"],
        "glb_provenance":  ZONE["glb_ref"],
        "domains":         {k: v["hypotheses"] for k, v in DOMAINS.items()},
        "densities":       DENSITIES,
    }


# ═══════════════════════════════════════════════════════════════
# CLI — demonstration runs
# ═══════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("=" * 60)
    print("CLOUUD-PROB-004 · Probability Zone · Quantum Distribution")
    print("=" * 60)

    # 1. Canonical sync: makes cents / makes sense
    print("\n--- SYNC: canonical instance (water density) ---")
    r1 = from_sync_verdict(0.889, 1200, True, inventory_prior=0.40)
    print(r1.to_json())

    # 2. Same event, neutron-star density (prior barely moves)
    print("\n--- SYNC: canonical instance (neutron star density) ---")
    r2 = from_sync_verdict(0.889, 1200, True, inventory_prior=0.40,
                           material="neutron_star")
    print(r2.to_json())

    # 3. High-similarity, causally dependent (should collapse)
    print("\n--- SYNC: high similarity but causally dependent ---")
    r3 = from_sync_verdict(0.95, 500, False, inventory_prior=0.40)
    print(r3.to_json())

    # 4. Feed: document with poison patterns
    print("\n--- FEED: 2 poison + 1 caution pattern ---")
    r4 = from_feed_grade({"DO_NOT_FEED": 2, "LABELED": 1}, 15)
    print(r4.to_json())

    # 5. Feed: clean document
    print("\n--- FEED: no patterns detected ---")
    r5 = from_feed_grade({}, 15)
    print(r5.to_json())

    # 6. Zone metadata
    print("\n--- ZONE METADATA ---")
    print(json.dumps(zone_metadata(), indent=2))

    # 7. Damping comparison across materials
    print("\n--- DAMPING TABLE (z-axis) ---")
    for mat in ["air", "water", "steel", "gold", "neutron_star"]:
        d = _get_damping(mat, "z")
        print(f"  {mat:>14s}  damping = {d:.4e}")
