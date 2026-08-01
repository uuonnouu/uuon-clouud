# CLOUUD UFM — Universal Figure Model
## System README v1.1
**UUON Foundation Inc. | Phillip Aguilar Ruiz III**

---

## What This System Is

The Universal Figure Model (UFM) is the ontology layer of the Clouud reasoning architecture. It defines the smallest invariant structure that carries meaning across domains — geometric, linguistic, logical, computational, physical.

It is not a learning model. It is not an inference engine. It is the data contract that all reasoning, learning, and planning layers operate on. The distinction is load-bearing:

```
Ontology  →  defines what exists             (UFM — this system)
Reasoner  →  manipulates what exists         (UFMReasoner)
Learner   →  improves how reasoning works    (external, consumes UFMReasoner output)
Planner   →  acts on reasoner output         (external, calls UFMReasoner)
```

Collapsing any two of these layers produces an untestable system.

---

## Origin of the Figure

The UFM derives from a precise question:

> A metaphor is a figure of speech. What is the mathematical equivalent of a figure?

The answer is not a metaphor, not an isomorphism, not a mapping. The answer is the structure itself.

In language:

```
Figure of Speech  =  Pattern of Meaning
```

In mathematics:

```
Figure  =  (Objects, Relationships between those Objects)
```

A triangle is not three points. It is the relationships among three points. Change the points while preserving the relationships and it is still the same figure. This is the foundational insight: **what matters is not what the objects are — it is how they relate.**

From this, the canonical mathematical figure is:

```
F = (P, E, R, C)
```

---

## The Canonical Object: F = (P, E, R, C)

### Ordering Note — Why P Comes First

The conventional construction order would place P last, as a trailing metadata field. This is wrong for the following reason:

**P is not a trailing attribute. P is the precondition.**

Nothing in E, R, or C can be trusted without a verified provenance chain. A figure with entities, relations, and constraints but no provenance is not a figure — it is an assertion. It cannot be distinguished from a fabricated figure. It cannot be audited. It cannot be traced to its origin or derivation history.

The correct ordering is:

```
F = (P, E, R, C)
```

Read: a figure exists only within a provenance context. P is the ground. E, R, C are what P certifies.

This is consistent with Clouud's evidence-first principle and with the Mercury Engine's fabrication detection logic. When a figure enters the registry, P is verified first. If P fails, E, R, and C are never evaluated. The notation reflects operational priority, not construction order.

---

### P — Provenance

**What breaks if removed:** Two structurally identical figures become indistinguishable regardless of origin. Fabricated figures cannot be detected. The Mercury Engine has no hook. Blockchain provenance integration fails.

Fields:
- `creator` — agent, system, or human identifier
- `source` — origin: dataset, derivation, contract address, user input
- `timestamp` — ISO 8601 UTC
- `parent_id` — Figure.id this was derived from (None = root figure)
- `transformation` — name of transformation applied to produce this figure
- `hash` — SHA-256 of all above fields, computed on creation, never manually set

Provenance is append-only. Every transformation produces a new P with a `parent_id` pointing to the source. History is never mutated.

---

### E — Entities

**What breaks if removed:** No objects to relate. The figure collapses to an empty set. R, C have nothing to operate on.

An entity is a node in the figure. It carries a typed id and domain-specific attributes. Entities do not define the figure — they are the raw material the relations act on.

---

### R — Relations

**What breaks if removed:** The figure has objects but no structure. F = (P, E, {}, C) is a labeled set, not a figure. The triangle becomes three unconnected points.

A relation is a typed, weighted edge between two entities. Weight type is required and must be declared from a controlled vocabulary:

```
probability | distance | confidence | tensor_component | strength | correlation
```

Bare numeric weights are rejected. A weight without a declared type is uninterpretable.

---

### C — Constraints

**What breaks if removed:** Any combination of E and R becomes valid. The figure has no structural law. A triangle with four sides would pass. A metaphor with no shared relational structure would be accepted.

Constraints carry a confidence value. Confidence is derived from an evidence chain — never asserted. A constraint with confidence < 1.0 and no evidence chain is rejected at construction time. This enforces Clouud's evidence-first principle at the schema level.

---

## Graph Isomorphism

Two figures are relationally isomorphic when:

```
(E₁, R₁) ≅ (E₂, R₂)
```

The objects differ. The relation structure is invariant. This is the mathematical metaphor — one pattern is another pattern under a transformation.

**This is the core claim of the UFM:** meaning lives in structure, not in objects.

### The Algorithm

The visual engine implements Weisfeiler-Leman (1-WL) color refinement, which is a necessary condition for isomorphism, not a sufficient one. This is stated honestly in the system trace output. Full graph isomorphism is not known to be NP-complete — it is an open problem in complexity theory. 1-WL can produce false positives for certain regular graphs (e.g. K₃,₃ vs K₄). The system documents this at runtime, not in a footnote.

### Sequential checks run in this order:

```
1. Node count match
2. Edge count match
3. Degree sequence match
4. Weisfeiler-Leman certificate match
5. Completeness caveat logged
```

Each step either passes or terminates the check with a specific failure reason. No step is skipped.

---

## Files in This System

| File | Layer | Purpose |
|------|-------|---------|
| `clouud_ufm_reasoning_layer.py` | Ontology + Reasoner | Canonical Figure class, UFMReasoner, ClouudFigureAgent |
| `clouud_graph_isomorphism.html` | Visual Aid | Interactive isomorphism detection with algorithm trace |
| `CLOUUD_UFM_README.md` | Documentation | This file |

---

## Design Laws

These are not preferences. They are structural requirements.

**1. Every field must answer: what breaks if this does not exist?**
If nothing breaks, the field does not belong in the core. It belongs in a domain-specific extension schema.

**2. Confidence is derived, never asserted.**
Any confidence value below 1.0 requires an evidence chain. The system rejects constraint construction without it.

**3. Weight type is required on every relation.**
A numeric weight without a declared type is uninterpretable. The system rejects relation construction without a valid weight type from the controlled vocabulary.

**4. Provenance is verified before anything else.**
Registration rejects on provenance failure. E, R, C are never evaluated on an unverified figure.

**5. Transformations produce new figures, never mutate existing ones.**
Every derived figure carries a new P with `parent_id` pointing to the source. Transformation history is preserved, not overwritten.

**6. The four layers are kept separate.**
Ontology defines. Reasoner manipulates. Learner improves. Planner acts. No layer does another layer's job.

---

## Open Problems

These are honest boundaries, not deferred tasks.

**1. 1-WL is not complete.**
The isomorphism check is a necessary condition. For full graph isomorphism, a stronger algorithm (Nauty, Traces, VF2) is required. This is a known hard problem. The current implementation is correct for its stated scope and documents its own limits.

**2. `relation_signature()` is approximate.**
The current structural fingerprint uses `(relation_label, weight_type)` pairs. For figures with different topologies or entity counts, full graph-theoretic isomorphism detection requires a dedicated algorithm. This is the next honest boundary to address.

**3. Meaning is not yet formalized.**
The UFM v1.0 listed `meaning` as a field. It was removed from the core because it could not answer the design law question. Meaning is the hardest problem in formal systems. Until it is operationally grounded — to the IPA vowel analysis layer, the Gödelian feedback loop, or another defined mechanism — it does not belong in the core schema. It is deferred, not forgotten.

**4. Domain-specific constraint sets are declared, not enforced.**
The `DOMAIN_CONSTRAINTS` registry exists but does not yet programmatically validate that a figure's constraints match its domain's laws. This is the next structural gap.

---

## Attribution

```
UUON Foundation Inc.
Phillip Aguilar Ruiz III — Founder and Principal Investigator
phi1@uuonfoundation.com
Kassel, Germany

Derivation origin: figure of speech → figure of structure
Mathematical grounding: F = (P, E, R, C)
License: SAL-1.0
```
