"""
CLOUUD UNIVERSAL FIGURE MODEL (UFM) v1.1
Reasoning Layer — Zero External Dependencies
UUON Foundation Inc. | Phillip Aguilar Ruiz III

Canonical mathematical object:
    F = (P, E, R, C)
    P = Provenance  ← the ground. E, R, C are what P certifies.
    E = Entities
    R = Relations
    C = Constraints

Ordering note: P is not a trailing attribute. P is the precondition.
Nothing in E, R, or C can be trusted without a verified provenance chain.
A figure with no provenance is an assertion, not a figure.
Registration rejects on provenance failure before E, R, C are evaluated.

Design law: Every field must answer "what breaks if this does not exist?"
If nothing breaks, the field does not belong in the core.

Architecture position: This is the ONTOLOGY layer.
    Ontology  → defines what exists          (this file)
    Reasoner  → manipulates what exists      (UFMReasoner)
    Learner   → improves how reasoning works (external, consumes UFMReasoner output)
    Planner   → acts on reasoner output      (external, calls UFMReasoner)
"""

import hashlib
import json
import uuid
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any, Dict, List, Optional, Tuple


# ============================================================
# DOMAIN TAXONOMY
# ============================================================

class Domain(str, Enum):
    LANGUAGE    = "language"
    MATHEMATICS = "mathematics"
    GEOMETRY    = "geometry"
    LOGIC       = "logic"
    COMPUTATION = "computation"
    PHYSICS     = "physics"
    BIOLOGY     = "biology"
    ECONOMICS   = "economics"

    # Domain-specific constraint sets are registered below.
    # Adding a domain here requires registering its constraints
    # in DOMAIN_CONSTRAINTS or the system raises at validation time.


# ============================================================
# CORE PRIMITIVES
# ============================================================

@dataclass
class Entity:
    """
    A node in a Figure. Defined by its id and type.
    Attributes carry domain-specific properties.
    Breaks if removed: no objects to relate — figure collapses to empty.
    """
    id: str
    type: str
    attributes: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict:
        return {"id": self.id, "type": self.type, "attributes": self.attributes}


@dataclass
class Relation:
    """
    A typed, weighted edge between two entities.
    Weight type is REQUIRED and must be declared — bare numerics are rejected.
    Breaks if removed: figure has objects but no structure. F = (P, E, {}, C) is a labeled set, not a figure.
    """
    source: str          # Entity.id
    target: str          # Entity.id
    relation: str        # Semantic label
    weight: float        # Magnitude
    weight_type: str     # REQUIRED: "probability" | "distance" | "confidence" | "tensor_component" | "strength"

    VALID_WEIGHT_TYPES = {
        "probability", "distance", "confidence",
        "tensor_component", "strength", "correlation"
    }

    def __post_init__(self):
        if self.weight_type not in self.VALID_WEIGHT_TYPES:
            raise ValueError(
                f"Relation weight_type '{self.weight_type}' is undefined. "
                f"Valid types: {self.VALID_WEIGHT_TYPES}. "
                f"Bare numeric weights are rejected — type the weight."
            )

    def to_dict(self) -> Dict:
        return {
            "source": self.source,
            "target": self.target,
            "relation": self.relation,
            "weight": self.weight,
            "weight_type": self.weight_type
        }


@dataclass
class Constraint:
    """
    A structural rule that must hold over E and R.
    Confidence is DERIVED from evidence, never asserted.
    Evidence chain is required if confidence < 1.0.
    Breaks if removed: figure has no rules — any E, R combination would be valid.
    """
    rule: str
    confidence: float          # [0.0, 1.0] — must be derived
    evidence_chain: List[str]  # What supports this confidence value

    def __post_init__(self):
        if not 0.0 <= self.confidence <= 1.0:
            raise ValueError(f"Constraint confidence must be in [0.0, 1.0], got {self.confidence}")
        if self.confidence < 1.0 and not self.evidence_chain:
            raise ValueError(
                f"Constraint '{self.rule}' has confidence {self.confidence} < 1.0 "
                f"but no evidence_chain. Confidence must be derived, not asserted."
            )

    def to_dict(self) -> Dict:
        return {
            "rule": self.rule,
            "confidence": self.confidence,
            "evidence_chain": self.evidence_chain
        }


@dataclass
class Provenance:
    """
    Origin and transformation history of a Figure.
    Breaks if removed: two structurally identical figures become indistinguishable.
    The system cannot detect fabricated figures. Mercury Engine integration fails.
    Every transformation must produce a new Provenance entry — history is append-only.
    """
    creator: str               # Agent, system, or human identifier
    source: str                # Origin: dataset, derivation, user input, contract address
    timestamp: str             # ISO 8601 UTC
    parent_id: Optional[str]   # Figure.id this was derived from (None = root)
    transformation: Optional[str]  # Name of transformation applied to produce this figure
    hash: str = field(init=False)  # Computed on creation — not manually set

    def __post_init__(self):
        payload = f"{self.creator}|{self.source}|{self.timestamp}|{self.parent_id}|{self.transformation}"
        self.hash = hashlib.sha256(payload.encode()).hexdigest()

    def to_dict(self) -> Dict:
        return {
            "creator": self.creator,
            "source": self.source,
            "timestamp": self.timestamp,
            "parent_id": self.parent_id,
            "transformation": self.transformation,
            "hash": self.hash
        }


# ============================================================
# DOMAIN CONSTRAINT REGISTRY
# Every domain must declare its structural laws here.
# ============================================================

DOMAIN_CONSTRAINTS: Dict[str, List[str]] = {
    Domain.LANGUAGE:    ["entities are lexical or conceptual units", "relations are semantic"],
    Domain.MATHEMATICS: ["relations are formally typed", "constraints are axiom-derived"],
    Domain.GEOMETRY:    ["entities are points or sets of points", "relations preserve metric structure"],
    Domain.LOGIC:       ["relations are inference rules", "constraints are tautologies or axioms"],
    Domain.COMPUTATION: ["entities are states or symbols", "relations are transition functions"],
    Domain.PHYSICS:     ["relations obey conservation laws", "constraints are symmetry groups"],
    Domain.BIOLOGY:     ["entities are biological units", "relations are causal or structural"],
    Domain.ECONOMICS:   ["entities are agents or goods", "relations carry utility or exchange weight"],
}


# ============================================================
# CANONICAL FIGURE OBJECT  F = (P, E, R, C)
# P is the ground. E, R, C are what P certifies.
# ============================================================

class Figure:
    """
    The minimal invariant structure that carries meaning across domains.
    Derived from: "figure of speech" → "figure of structure"
    Mathematical grounding: F = (P, E, R, C)

    P is verified first. If P fails, no further evaluation occurs.
    A triangle is not three points. It is the relationships among three points.
    Change the points while preserving the relationships — it is still the same figure.
    """

    def __init__(
        self,
        name: str,
        domain: Domain,
        entities: List[Entity],
        relations: List[Relation],
        constraints: List[Constraint],
        provenance: Provenance
    ):
        self.id: str = str(uuid.uuid4())
        self.name = name
        self.domain = domain

        # Validate domain is registered
        if domain not in DOMAIN_CONSTRAINTS:
            raise ValueError(f"Domain '{domain}' has no registered constraint set. Register it in DOMAIN_CONSTRAINTS.")

        self.entities: Dict[str, Entity] = {e.id: e for e in entities}
        self.relations: List[Relation] = relations
        self.constraints: List[Constraint] = constraints
        self.provenance: Provenance = provenance

        # Validate relation endpoints exist
        self._validate_relation_endpoints()

    def _validate_relation_endpoints(self):
        entity_ids = set(self.entities.keys())
        for r in self.relations:
            if r.source not in entity_ids:
                raise ValueError(f"Relation source '{r.source}' not in entity set.")
            if r.target not in entity_ids:
                raise ValueError(f"Relation target '{r.target}' not in entity set.")

    def relation_signature(self) -> frozenset:
        """
        Structural fingerprint based on relation patterns only.
        Used for isomorphism detection — objects are irrelevant, patterns are not.
        """
        return frozenset(
            (r.relation, r.weight_type)
            for r in self.relations
        )

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "name": self.name,
            "domain": self.domain.value,
            "entities": [e.to_dict() for e in self.entities.values()],
            "relations": [r.to_dict() for r in self.relations],
            "constraints": [c.to_dict() for c in self.constraints],
            "provenance": self.provenance.to_dict()
        }

    def to_json(self, indent: int = 2) -> str:
        return json.dumps(self.to_dict(), indent=indent)

    def __repr__(self) -> str:
        return (
            f"Figure(id={self.id[:8]}..., name='{self.name}', "
            f"domain={self.domain.value}, "
            f"E={len(self.entities)}, R={len(self.relations)}, "
            f"C={len(self.constraints)})"
        )


# ============================================================
# UFM REASONER — Manipulates Figure objects
# This is layer 2. The ontology defines. The reasoner operates.
# ============================================================

class UFMReasoner:
    """
    Operates on Figure objects. Does not define them.
    Separation is enforced: this class holds no schema logic.
    """

    # ----------------------------------------------------------
    # ISOMORPHISM DETECTION
    # Two figures are relationally isomorphic if their relation
    # signatures match regardless of what the entities are.
    # This is the mathematical metaphor: (A,R_A) ≅ (B,R_B)
    # ----------------------------------------------------------

    @staticmethod
    def are_relationally_isomorphic(f1: Figure, f2: Figure) -> Tuple[bool, str]:
        sig1 = f1.relation_signature()
        sig2 = f2.relation_signature()
        if sig1 == sig2:
            return True, f"Figures '{f1.name}' and '{f2.name}' share identical relation structure."
        diff = sig1.symmetric_difference(sig2)
        return False, f"Relation signatures differ. Divergence: {diff}"

    # ----------------------------------------------------------
    # CONSTRAINT VALIDATION
    # Applies the "what breaks" test operationally.
    # A figure with constraint confidence 0.0 is structurally undefined.
    # ----------------------------------------------------------

    @staticmethod
    def validate_constraints(fig: Figure) -> List[str]:
        failures = []
        for c in fig.constraints:
            if c.confidence == 0.0:
                failures.append(
                    f"CRITICAL: Constraint '{c.rule}' has confidence 0.0 — "
                    f"this constraint provides no structural guarantee."
                )
            elif c.confidence < 0.5:
                failures.append(
                    f"WARN: Constraint '{c.rule}' confidence {c.confidence} is below threshold. "
                    f"Evidence chain: {c.evidence_chain}"
                )
        return failures

    # ----------------------------------------------------------
    # TRANSFORMATION WITH PROVENANCE CHAIN
    # Every transformation produces a new Figure.
    # The original is never mutated. History is preserved.
    # ----------------------------------------------------------

    @staticmethod
    def apply_transformation(
        source_fig: Figure,
        transform_name: str,
        new_entities: List[Entity],
        new_relations: List[Relation],
        new_constraints: List[Constraint],
        agent_id: str
    ) -> Figure:
        """
        Produces a derived Figure with a full provenance chain back to source.
        Preserves: the derivation record.
        Does NOT automatically claim to preserve: topology, symmetry, meaning.
        Those claims must be verified externally per domain.
        """
        new_provenance = Provenance(
            creator=agent_id,
            source=f"transformation:{transform_name}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            parent_id=source_fig.id,
            transformation=transform_name
        )
        return Figure(
            name=f"{source_fig.name}::{transform_name}",
            domain=source_fig.domain,
            entities=new_entities,
            relations=new_relations,
            constraints=new_constraints,
            provenance=new_provenance
        )

    # ----------------------------------------------------------
    # FABRICATION DETECTION (Mercury Engine hook)
    # Checks provenance hash integrity.
    # A figure whose hash does not match its declared fields
    # has been tampered with or fabricated.
    # ----------------------------------------------------------

    @staticmethod
    def verify_provenance_integrity(fig: Figure) -> Tuple[bool, str]:
        p = fig.provenance
        expected_payload = f"{p.creator}|{p.source}|{p.timestamp}|{p.parent_id}|{p.transformation}"
        expected_hash = hashlib.sha256(expected_payload.encode()).hexdigest()
        if p.hash == expected_hash:
            return True, f"Provenance hash verified for figure '{fig.name}'."
        return False, (
            f"PROVENANCE INTEGRITY FAILURE for figure '{fig.name}'. "
            f"Expected: {expected_hash[:16]}... Got: {p.hash[:16]}... "
            f"Figure may be fabricated or tampered."
        )

    # ----------------------------------------------------------
    # FIGURE COMPARISON REPORT
    # Full diagnostic between two figures.
    # ----------------------------------------------------------

    @staticmethod
    def compare(f1: Figure, f2: Figure) -> Dict[str, Any]:
        iso, iso_msg = UFMReasoner.are_relationally_isomorphic(f1, f2)
        c1_failures = UFMReasoner.validate_constraints(f1)
        c2_failures = UFMReasoner.validate_constraints(f2)
        p1_valid, p1_msg = UFMReasoner.verify_provenance_integrity(f1)
        p2_valid, p2_msg = UFMReasoner.verify_provenance_integrity(f2)

        return {
            "figures": [f1.name, f2.name],
            "relationally_isomorphic": iso,
            "isomorphism_detail": iso_msg,
            "f1_constraint_failures": c1_failures,
            "f2_constraint_failures": c2_failures,
            "f1_provenance_valid": p1_valid,
            "f1_provenance_detail": p1_msg,
            "f2_provenance_valid": p2_valid,
            "f2_provenance_detail": p2_msg,
        }


# ============================================================
# CLOUUD AGENT INTERFACE
# The entry point for autonomous agent consumption.
# Agents call this. They do not construct Figures directly.
# ============================================================

class ClouudFigureAgent:
    """
    Reasoning interface for Clouud autonomous agents.
    Agents register figures, query isomorphisms, and receive
    structured reports they can act on.

    This is the PLANNER-facing surface. It speaks in decisions,
    not in schema details.
    """

    def __init__(self, agent_id: str):
        self.agent_id = agent_id
        self.registry: Dict[str, Figure] = {}
        self.reasoner = UFMReasoner()

    def register_figure(self, fig: Figure) -> str:
        valid, msg = UFMReasoner.verify_provenance_integrity(fig)
        if not valid:
            raise ValueError(f"Figure rejected at registration: {msg}")
        self.registry[fig.id] = fig
        return fig.id

    def find_isomorphic_pairs(self) -> List[Tuple[str, str, str]]:
        """Returns list of (fig1.name, fig2.name, detail) for isomorphic pairs."""
        figures = list(self.registry.values())
        results = []
        for i in range(len(figures)):
            for j in range(i + 1, len(figures)):
                iso, msg = UFMReasoner.are_relationally_isomorphic(figures[i], figures[j])
                if iso:
                    results.append((figures[i].name, figures[j].name, msg))
        return results

    def audit_registry(self) -> List[Dict]:
        """Full diagnostic on every registered figure."""
        report = []
        for fig in self.registry.values():
            failures = UFMReasoner.validate_constraints(fig)
            p_valid, p_msg = UFMReasoner.verify_provenance_integrity(fig)
            report.append({
                "figure": fig.name,
                "id": fig.id,
                "domain": fig.domain.value,
                "provenance_valid": p_valid,
                "provenance_detail": p_msg,
                "constraint_failures": failures,
                "entity_count": len(fig.entities),
                "relation_count": len(fig.relations)
            })
        return report

    def derive(
        self,
        source_id: str,
        transform_name: str,
        new_entities: List[Entity],
        new_relations: List[Relation],
        new_constraints: List[Constraint]
    ) -> str:
        source = self.registry.get(source_id)
        if not source:
            raise KeyError(f"No figure with id '{source_id}' in registry.")
        derived = UFMReasoner.apply_transformation(
            source_fig=source,
            transform_name=transform_name,
            new_entities=new_entities,
            new_relations=new_relations,
            new_constraints=new_constraints,
            agent_id=self.agent_id
        )
        return self.register_figure(derived)


# ============================================================
# USAGE EXAMPLE — Demonstrates the full stack
# ============================================================

if __name__ == "__main__":

    # Build a geometric figure: triangle
    prov_triangle = Provenance(
        creator="phillip_aguilar_ruiz_iii",
        source="UFM_derivation:figure_of_speech_to_figure_of_structure",
        timestamp=datetime.now(timezone.utc).isoformat(),
        parent_id=None,
        transformation=None
    )
    triangle = Figure(
        name="Triangle_ABC",
        domain=Domain.GEOMETRY,
        entities=[
            Entity(id="A", type="point", attributes={"position": [0, 0]}),
            Entity(id="B", type="point", attributes={"position": [1, 0]}),
            Entity(id="C", type="point", attributes={"position": [0.5, 1]}),
        ],
        relations=[
            Relation("A", "B", "edge", 1.0, "distance"),
            Relation("B", "C", "edge", 1.118, "distance"),
            Relation("A", "C", "edge", 1.118, "distance"),
        ],
        constraints=[
            Constraint(
                rule="sum of interior angles equals pi",
                confidence=1.0,
                evidence_chain=["Euclidean geometry axiom"]
            )
        ],
        provenance=prov_triangle
    )

    # Build a linguistic figure: metaphor with same relation structure
    prov_metaphor = Provenance(
        creator="phillip_aguilar_ruiz_iii",
        source="UFM_derivation:figure_of_speech",
        timestamp=datetime.now(timezone.utc).isoformat(),
        parent_id=None,
        transformation=None
    )
    metaphor = Figure(
        name="Metaphor_LifeIsJourney",
        domain=Domain.LANGUAGE,
        entities=[
            Entity(id="A", type="concept", attributes={"label": "life"}),
            Entity(id="B", type="concept", attributes={"label": "start"}),
            Entity(id="C", type="concept", attributes={"label": "end"}),
        ],
        relations=[
            Relation("A", "B", "edge", 1.0, "strength"),
            Relation("B", "C", "edge", 0.9, "strength"),
            Relation("A", "C", "edge", 0.9, "strength"),
        ],
        constraints=[
            Constraint(
                rule="source and target domains share relational structure",
                confidence=0.85,
                evidence_chain=["Lakoff conceptual metaphor theory", "empirical linguistic analysis"]
            )
        ],
        provenance=prov_metaphor
    )

    # Initialize agent and run
    agent = ClouudFigureAgent(agent_id="clouud_core_v1")
    agent.register_figure(triangle)
    agent.register_figure(metaphor)

    print("=== CLOUUD UFM REASONING LAYER v1.1 ===\n")

    print("Registered Figures:")
    for fig in agent.registry.values():
        print(f"  {fig}")

    print("\nIsomorphism Detection:")
    pairs = agent.find_isomorphic_pairs()
    if pairs:
        for f1n, f2n, detail in pairs:
            print(f"  ISOMORPHIC: {f1n} <-> {f2n}")
            print(f"  Detail: {detail}")
    else:
        print("  No isomorphic pairs found.")

    print("\nRegistry Audit:")
    audit = agent.audit_registry()
    for entry in audit:
        print(f"  [{entry['figure']}]")
        print(f"    Provenance valid: {entry['provenance_valid']}")
        print(f"    Constraint failures: {entry['constraint_failures'] or 'None'}")

    print("\nFigure JSON (triangle):")
    print(triangle.to_json())
