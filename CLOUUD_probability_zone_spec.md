# CLOUUD Probability Zone — Internal Reference Architecture

Document ID: CLOUUD-PROB-004
Companion to: OBS-001, PHEN-002, FEED-003
Drafted: 2026-07-19
Status: Architecture specification, v0.1 — formula slots open

---

## 1. What This Is

An internal GLB-structured graph that Clouud traverses for every
classification decision. Not rendered for humans. Not decorative.
A machine-readable map where each vertex carries a computation,
each edge carries data, and the bounded geometry enforces that
all probability values remain legal (sum to 1, non-negative).

The GLB format is the carrier: vertices = processing nodes,
edges = data flow paths, vertex metadata = formulas and state.
Clouud loads this structure once and walks it per event.

---

## 2. Why GLB (not flat code)

Flat code executes a pipeline. A graph structure does three things
flat code does not:

1. MULTI-PATH: different event types take different routes through
   the same probability space. Sync events, phenomena reports, feed
   documents, and shape outputs each enter at the same intake node
   but fork to domain-specific evidence nodes. A graph encodes this
   naturally; a linear pipeline cannot.

2. BOUNDED GEOMETRY: the probability simplex is a geometric object.
   Encoding it as actual geometry (vertex positions constrained to
   the simplex surface) means illegal probability states are
   structurally unreachable — not caught by validation, but
   prevented by shape.

3. PORTABLE: one .glb file contains the entire processing topology.
   Dmension already handles GLB. Clouud references it. No separate
   config files, no pipeline YAML, no orchestration layer.

---

## 3. Node Architecture (the graph Clouud walks)

Six zones. Each zone is a vertex cluster in the GLB.
Edges between zones carry typed data.

```
                    ┌─────────────────────────────┐
                    │        Z0 · INTAKE           │
                    │  raw input, domain tagging   │
                    └──────────┬──────────────────-─┘
                               │ tagged event
                    ┌──────────▼───────────────────┐
                    │        Z1 · PRIOR            │
                    │  domain-specific P(H₀)       │
                    └──────────┬───────────────────-┘
                               │ prior vector
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
     ┌────────────┐   ┌────────────┐   ┌────────────┐
     │ Z2a · SYNC │   │ Z2b · PHEN │   │ Z2c · FEED │  ... Z2n
     │  evidence  │   │  evidence  │   │  evidence  │
     └─────┬──────┘   └─────┬──────┘   └─────┬──────┘
           │                │                │
           └────────────────┼────────────────┘
                            │ evidence vector
                    ┌───────▼─────────────────────┐
                    │      Z3 · LIKELIHOOD         │
                    │  P(E|H) for each hypothesis  │
                    │  *** FORMULA SLOTS HERE ***   │
                    └───────┬─────────────────────-─┘
                            │ likelihood ratios
                    ┌───────▼─────────────────────┐
                    │      Z4 · UPDATE             │
                    │  Bayes' theorem (universal)  │
                    │  posterior = L × prior / P(E)│
                    └───────┬─────────────────────-─┘
                            │ posterior vector
                    ┌───────▼─────────────────────┐
                    │      Z5 · CLASSIFY           │
                    │  map posterior → lattice node │
                    │  or verdict or feed grade    │
                    └───────┬─────────────────────-─┘
                            │ decision + provenance
                    ┌───────▼─────────────────────┐
                    │      Z6 · LOG                │
                    │  append-only, full chain     │
                    └─────────────────────────────-─┘
```

---

## 4. Zone Specifications

### Z0 · INTAKE

Function: receive raw input, tag with domain, emit to Z1.
No probability yet. Pure data.

Input: any event (paired events for sync, report for phenomena,
       document for feed, equation output for shape validation).
Output: `{ domain: str, payload: any, t_utc: ISO8601 }`
Vertex count: 1 (single entry point).

### Z1 · PRIOR

Function: assign prior probability vector before any evidence
is examined. One prior per competing hypothesis.

Per domain:
- SYNC: P(meaningful) from homophone inventory collision rate
  and corpus frequency of the surface forms. Standing homophones
  get high P(chance), rare collisions get low P(chance).
  Source: OBS-001 §5 inventory + stress_test.py base-rate sim.
- PHEN: P(data-strained) starts high (most reports are).
  P(law-strained) starts near zero (PHEN-002 escalation cost).
  Source: historical resolution rates from attached corpus.
- FEED: P(clean) from document-type base rates. Code files
  start higher than manifestos. Source: grader.py pattern
  frequency across the existing corpus.
- SHAPE (Dmension outputs): P(valid) from equation class.
  Well-studied equations (Schrödinger, Einstein) start high.
  Novel parametric combinations start lower.

Output: prior vector `π = [P(H₁), P(H₂), ..., P(Hₙ)]` where Σπ = 1.
Vertex count: 1 per domain (4 initial, extensible).

### Z2 · EVIDENCE (domain-specific, parallel branches)

Function: collect measurable evidence using domain-appropriate
instruments. Each branch computes different measurements but
emits a common evidence structure.

#### Z2a · SYNC evidence
Measurements taken:
- IPA segment Levenshtein similarity (phonemic layer): s_phonemic
- IPA segment Levenshtein similarity (phonetic layer): s_phonetic
- Temporal window: |t₁ − t₂| ms
- Causal independence: bool + justification
- Observer meaning: human-declared string (NEVER generated)
Source: synchronicity.py classify()

#### Z2b · PHENOMENA evidence
Measurements taken:
- Pose test result: well-posed / ill-posed (PHEN-002 §4 step 3)
- Artifact sweep matches: list of instrument failure modes checked
- Base-rate fit: P(known object) above/below threshold
- Instrument metadata: sensor count, range resolution, error bounds
Source: PHEN-002 §4 classification procedure

#### Z2c · FEED evidence
Measurements taken:
- Pattern matches from grader.py regex bank
- Structural analysis: agreement-elicitation markers, credential
  presence, validation stamps without procedure
- Falsifiability check: are claims testable?
Source: grader.py grade_text()

#### Z2n · SHAPE evidence (slot for Dmension engine outputs)
Measurements taken:
- *** FORMULA SLOT: equation evaluation metrics ***
- *** FORMULA SLOT: convergence/divergence measure ***
- *** FORMULA SLOT: parameter boundary check ***
- *** FORMULA SLOT: engine-specific validity criteria ***

Output (common structure from all branches):
```
evidence = {
  domain: str,
  measurements: dict,     # domain-specific key-value pairs
  instrument: str,        # what took the measurement
  method_disclosed: bool  # OBS-001 §7 rule: no method = flag
}
```

### Z3 · LIKELIHOOD

Function: compute P(evidence | hypothesis) for each hypothesis
in the prior vector. This is where domain-specific probability
models live. This is where the Dmension engine formulas plug in.

The likelihood function answers: "if hypothesis H were true,
how probable is the evidence we actually observed?"

FORMULA SLOTS (to be filled from Dmension engine equations):

```
SLOT L1: sync likelihood surface
  Input: similarity scores, temporal window
  Output: P(this similarity | meaningful) and P(this similarity | chance)
  Current approximation: similarity threshold (binary)
  Target: continuous likelihood from a real distribution
  *** AWAITING DMENSION FORMULA ***

SLOT L2: phenomena likelihood surface
  Input: pose test, artifact sweep, base-rate fit
  Output: P(this evidence profile | data-strained) vs
          P(this evidence profile | model-strained) vs
          P(this evidence profile | law-strained)
  *** AWAITING DMENSION FORMULA ***

SLOT L3: feed likelihood surface
  Input: pattern match count and types
  Output: P(this pattern set | clean) vs P(this pattern set | poisoned)
  Current approximation: grader.py regex cascade (deterministic)
  Target: probabilistic scoring with graded confidence
  *** AWAITING DMENSION FORMULA ***

SLOT L4: shape likelihood surface
  Input: equation evaluation outputs
  Output: P(this output | valid equation) vs P(this output | degenerate)
  *** AWAITING DMENSION FORMULA ***
```

Output: likelihood ratio vector `L = [L₁, L₂, ..., Lₙ]`
where Lₖ = P(E | Hₖ) / P(E | H₀) for reference hypothesis H₀.

### Z4 · UPDATE

Function: Bayes' theorem. Universal — same operation regardless
of domain. This node has no formula slots because the formula is
fixed: it IS Bayes' theorem.

```
For each hypothesis Hₖ:
  posterior(Hₖ) = likelihood(Hₖ) × prior(Hₖ) / P(E)

where P(E) = Σ likelihood(Hⱼ) × prior(Hⱼ)  (normalization)
```

In log-odds form (numerically stable for extreme values):
```
log_posterior_odds(Hₖ) = log_likelihood_ratio(Hₖ) + log_prior_odds(Hₖ)
```

Output: posterior vector `π' = [P(H₁|E), P(H₂|E), ..., P(Hₙ|E)]`
Constraint enforced by geometry: Σπ' = 1 (point on simplex surface).

### Z5 · CLASSIFY

Function: map the posterior vector to a decision. The decision
type depends on domain:

- SYNC → Verdict: { is_synchronicity, reasons[] } (OBS-001)
- PHEN → Lattice node: data/model/law/logic-strained (PHEN-002)
- FEED → Grade: CLEAN/SPLIT/LABELED/HOLD/DO_NOT_FEED (FEED-003)
- SHAPE → Validity: valid/degenerate/boundary

Decision boundaries are hyperplanes in the probability simplex.
Their positions are the classification thresholds. These are
tunable but must be declared and logged — never silent.

Output:
```
decision = {
  domain: str,
  classification: str,
  posterior: [float],           # the full vector, not just the winner
  margin: float,               # distance from nearest boundary
  threshold_used: str,         # which boundary was decisive
  confidence_note: str         # "posterior well-separated" or
                               # "near boundary — low confidence"
}
```

### Z6 · LOG

Function: append-only record. Every field from Z0–Z5 stored.
Full provenance chain: what prior was used, what evidence was
collected, what likelihood model computed the ratios, what
posterior resulted, what decision was made, and what thresholds
were applied.

Schema extends OBS-001 §10 event log:
```
{
  logged_at_utc: ISO8601,
  zone_path: [Z0, Z1, Z2x, Z3, Z4, Z5, Z6],  # which nodes were hit
  prior: { vector, source },
  evidence: { measurements, instrument, method_disclosed },
  likelihood: { ratios, model_id, formula_version },
  posterior: { vector, normalization_constant },
  decision: { classification, margin, threshold },
  provenance: { agent, version, zone_map_version }
}
```

Separation rule (carried from OBS-001): interpretation never
leaks into the physical record. Observer meaning is stored
verbatim in evidence; it does not modify likelihood or posterior.

---

## 5. GLB Encoding

The graph above maps to GLB as follows:

- Each zone → a named mesh node (empty geometry, metadata only)
- Each vertex within a zone → a point with position on the
  probability simplex (for Z4/Z5) or arbitrary layout (for Z0-Z2)
- Each edge → a GLB accessor linking source and target vertices
- Metadata per vertex → GLB extras field:
  ```
  "extras": {
    "zone": "Z3",
    "formula_slot": "L1",
    "input_schema": { ... },
    "output_schema": { ... },
    "formula_ref": "dmension://quantum/wave_probability_v1"
  }
  ```
- The simplex constraint (Σπ = 1) is encoded as a bounded mesh
  surface — posteriors are points ON this surface, never outside it.

File: `clouud_probability_zone.glb`
Human-visible: NO.
Clouud-traversable: YES.
Dmension-generated: YES (the simplex surface and node positions
come from Dmension's equation engines).

---

## 6. What the Formulas Must Provide

When you bring the Dmension engine formulas, each one needs to
answer ONE question to fill its slot:

**SLOT L1 (sync):** Given two phonetic strings with similarity s
observed within window w, what is the probability of that
observation under "meaningful conjunction" vs under "chance"?

**SLOT L2 (phenomena):** Given an evidence profile (pose test,
artifact sweep, base-rate), what is the probability of that
profile under each strain level (data/model/law)?

**SLOT L3 (feed):** Given a set of detected patterns in a document,
what is the probability of that pattern set under "clean corpus"
vs "contaminated"?

**SLOT L4 (shape):** Given a Dmension engine output (mesh, equation
evaluation), what is the probability that the output represents
a valid mathematical object vs a degenerate/boundary case?

Each formula maps an evidence vector to a likelihood value.
That is the only requirement. The formula can be as simple or
complex as the math demands — the architecture does not constrain
it. Bayes' theorem (Z4) handles the rest.

---

## 7. What This Does NOT Do

- Does not replace synchronicity.py. That code is the Z2a evidence
  collector. It feeds this system; it is not replaced by it.
- Does not replace grader.py. That code is the Z2c evidence
  collector.
- Does not replace the phenomena lattice. The lattice (PHEN-002)
  is the Z5 classification target for phenomena-domain events.
- Does not invoke G°centric Position 33. The zero-point of this
  system is the probability simplex origin — where all hypotheses
  are equally likely. That is a mathematical zero-point derived
  from the probability axioms, not an assigned position.
- Does not generate observer meaning. Condition 4 (OBS-001) is
  human-supplied and passes through untouched.
- Does not fabricate likelihoods. Every formula slot must be
  filled with a declared equation from a named source. Empty
  slots use uniform likelihood (agnostic — no information added)
  until filled. An empty slot never pretends to compute.

---

## 8. Integration Checklist

- [ ] Receive Dmension engine formulas for slots L1–L4
- [ ] Validate each formula: does it map evidence → [0,1]?
- [ ] Encode node graph as GLB with extras metadata
- [ ] Generate simplex surface geometry via Dmension
- [ ] Wire Z2a to synchronicity.py output
- [ ] Wire Z2c to grader.py output
- [ ] Implement Z4 (Bayes' theorem — fixed, no slots)
- [ ] Define decision boundaries for Z5 per domain
- [ ] Extend OBS-001 log schema for full zone-path provenance
- [ ] Stress test: run BENCH-005 through the zone, compare
      to direct synchronicity.py output (must agree on all
      500 cases or the integration has a bug)

---

## 9. One-Line Summary

A GLB-encoded graph that Clouud walks for every decision:
intake → prior → evidence → likelihood (your formulas here) →
Bayes → classify → log; geometry enforces legal probabilities;
empty slots stay honest.
