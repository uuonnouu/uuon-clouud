# CLOUUD-PROB-004 · Nano Reference

## What It Is
A probability zone Clouud walks for every classification decision.
Six nodes. One graph. Geometry from Dmension quantum probability
distribution. Not visual — internal reference only.

## The Formula
|ψ⟩ = α|0⟩ + β|1⟩,  |α|² + |β|² = 1
This IS the probability constraint: P(H) + P(¬H) = 1.
The simplex. The normalization. Same object.

## The Walk
```
INTAKE → PRIOR → EVIDENCE → LIKELIHOOD → UPDATE → CLASSIFY → LOG
  Z0       Z1       Z2          Z3         Z4       Z5       Z6
```

## What the Tensor Data Does

| Property | Value | Controls |
|----------|-------|----------|
| Inertia Ixx | 7.66e+1 | X-axis update resistance (shape domain) |
| Inertia Iyy | 8.30e+1 | Y-axis update resistance (feed domain) |
| Inertia Izz | 1.60e+2 | Z-axis update resistance (sync/phenomena) |
| Mean curvature H | 7.0959 | Confidence threshold = 1/H ≈ 0.141 |
| Gaussian curvature K | 743.067 | Decision boundary sharpness |
| Material density | variable | Prior strength multiplier |

## State Space (ℝ vs ℂ)
Source geometry lives on S³ (complex hypersphere, 4 real dims).
Operating space is the real simplex projection (classical probability).
Fisher metric on the simplex IS the real restriction of the Fubini-Study
metric on S³. This is a precise relationship, not a metaphor.

## Distance Metrics (Z5 node)
- **Euclidean margin**: p_max − p_second (flat, for comparison only)
- **Fisher distance**: Hellinger distance from uniform — geodesic on simplex
- **Shannon entropy**: bits of uncertainty remaining (0=certain, 1=maximum)
- **Entropy ratio**: entropy / max_entropy (0=certain, 1=maximally uncertain)

Confidence uses Fisher distance, not Euclidean. Fisher correctly weights
changes near the extremes as more informative than changes near 0.5.

## Domains
- **sync** → [meaningful, chance] — z-axis, hardest to shift
- **phenomena** → [data, model, law strained] — z-axis
- **feed** → [clean, contaminated] — y-axis, moderate
- **shape** → [valid, degenerate] — x-axis, easiest to shift

## Material = Prior Strength
```
air          → 0.003x  (evidence dominates)
water        → 2.1x    (balanced)
steel        → 16.4x   (resistant)
gold         → 40.3x   (very resistant)
neutron_star → 8.4e14x (immovable)
```

## Honest Scope
- Inertia→damping is a declared interpretive mapping, not physics
- Curvature→threshold is a declared interpretive mapping, not physics
- Both are testable: change the mapping, rerun BENCH-005, measure
- Likelihood slots L1–L4 use approximations until Dmension formulas replace them
- Empty slots never pretend to compute more than they do

## Integration Points
- `from_sync_verdict()` ← synchronicity.py
- `from_feed_grade()` ← grader.py
- `traverse()` ← any domain, direct call
- `zone_metadata()` → GLB extras encoding

## Files
- `probability_zone.py` — executable code
- `CLOUUD_probability_zone_spec.md` — full architecture (PROB-004)
- `quantum_probability_distribution_ar_universal.glb` — source geometry
- `quantum_probability_distribution_wireframe_fallback.glb` — wireframe
- `quantum_probability_distribution_points_fallback.glb` — point cloud

## Open Slots
- **L1**: sync likelihood surface — awaiting Dmension formula
- **L2**: phenomena likelihood surface — awaiting Dmension formula
- **L3**: feed likelihood surface — awaiting Dmension formula
- **L4**: shape likelihood surface — awaiting Dmension formula

## One-Line Rule
Every probability passes through the zone; every zone result
carries its full chain; no chain is shorter than its measurement.
