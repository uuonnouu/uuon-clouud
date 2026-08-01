/**
 * CLOUUD UNIVERSAL FIGURE MODEL (UFM) v1.1
 * TypeScript port — zero external dependencies
 * UUON Foundation Inc. | Phillip Aguilar Ruiz III
 *
 * Canonical mathematical object: F = (P, E, R, C)
 * P = Provenance  ← the ground. E, R, C are what P certifies.
 * E = Entities
 * R = Relations
 * C = Constraints
 *
 * Architecture position: ONTOLOGY layer.
 *   Ontology  → defines what exists          (this file)
 *   Reasoner  → manipulates what exists      (UFMReasoner)
 *   Learner   → improves how reasoning works (external)
 *   Planner   → acts on reasoner output      (external)
 *
 * File: server/lib/ufm/ufm-core.ts
 */

import { createHash } from 'crypto';
import { randomUUID } from 'crypto';

// ============================================================
// DOMAIN TAXONOMY
// ============================================================

export enum Domain {
  LANGUAGE    = 'language',
  MATHEMATICS = 'mathematics',
  GEOMETRY    = 'geometry',
  LOGIC       = 'logic',
  COMPUTATION = 'computation',
  PHYSICS     = 'physics',
  BIOLOGY     = 'biology',
  ECONOMICS   = 'economics',
}

export const DOMAIN_CONSTRAINTS: Record<Domain, string[]> = {
  [Domain.LANGUAGE]:    ['entities are lexical or conceptual units', 'relations are semantic'],
  [Domain.MATHEMATICS]: ['relations are formally typed', 'constraints are axiom-derived'],
  [Domain.GEOMETRY]:    ['entities are points or sets of points', 'relations preserve metric structure'],
  [Domain.LOGIC]:       ['relations are inference rules', 'constraints are tautologies or axioms'],
  [Domain.COMPUTATION]: ['entities are states or symbols', 'relations are transition functions'],
  [Domain.PHYSICS]:     ['relations obey conservation laws', 'constraints are symmetry groups'],
  [Domain.BIOLOGY]:     ['entities are biological units', 'relations are causal or structural'],
  [Domain.ECONOMICS]:   ['entities are agents or goods', 'relations carry utility or exchange weight'],
};

// ============================================================
// CORE PRIMITIVES
// ============================================================

export interface EntityData {
  id: string;
  type: string;
  attributes: Record<string, unknown>;
}

export class Entity implements EntityData {
  id: string;
  type: string;
  attributes: Record<string, unknown>;

  constructor(id: string, type: string, attributes: Record<string, unknown> = {}) {
    this.id = id;
    this.type = type;
    this.attributes = attributes;
  }

  toDict(): EntityData {
    return { id: this.id, type: this.type, attributes: this.attributes };
  }
}

export const VALID_WEIGHT_TYPES = new Set([
  'probability', 'distance', 'confidence',
  'tensor_component', 'strength', 'correlation',
]);

export interface RelationData {
  source: string;
  target: string;
  relation: string;
  weight: number;
  weight_type: string;
}

export class Relation implements RelationData {
  source: string;
  target: string;
  relation: string;
  weight: number;
  weight_type: string;

  constructor(
    source: string,
    target: string,
    relation: string,
    weight: number,
    weight_type: string,
  ) {
    if (!VALID_WEIGHT_TYPES.has(weight_type)) {
      throw new Error(
        `Relation weight_type '${weight_type}' is undefined. ` +
        `Valid types: ${[...VALID_WEIGHT_TYPES].join(', ')}. ` +
        `Bare numeric weights are rejected — type the weight.`
      );
    }
    this.source = source;
    this.target = target;
    this.relation = relation;
    this.weight = weight;
    this.weight_type = weight_type;
  }

  toDict(): RelationData {
    return {
      source: this.source,
      target: this.target,
      relation: this.relation,
      weight: this.weight,
      weight_type: this.weight_type,
    };
  }
}

export interface ConstraintData {
  rule: string;
  confidence: number;
  evidence_chain: string[];
}

export class Constraint implements ConstraintData {
  rule: string;
  confidence: number;
  evidence_chain: string[];

  constructor(rule: string, confidence: number, evidence_chain: string[]) {
    if (confidence < 0.0 || confidence > 1.0) {
      throw new Error(`Constraint confidence must be in [0.0, 1.0], got ${confidence}`);
    }
    if (confidence < 1.0 && evidence_chain.length === 0) {
      throw new Error(
        `Constraint '${rule}' has confidence ${confidence} < 1.0 ` +
        `but no evidence_chain. Confidence must be derived, not asserted.`
      );
    }
    this.rule = rule;
    this.confidence = confidence;
    this.evidence_chain = evidence_chain;
  }

  toDict(): ConstraintData {
    return { rule: this.rule, confidence: this.confidence, evidence_chain: this.evidence_chain };
  }
}

export interface ProvenanceData {
  creator: string;
  source: string;
  timestamp: string;
  parent_id: string | null;
  transformation: string | null;
  hash: string;
}

export class Provenance implements ProvenanceData {
  creator: string;
  source: string;
  timestamp: string;
  parent_id: string | null;
  transformation: string | null;
  hash: string;

  constructor(
    creator: string,
    source: string,
    timestamp: string,
    parent_id: string | null,
    transformation: string | null,
  ) {
    this.creator = creator;
    this.source = source;
    this.timestamp = timestamp;
    this.parent_id = parent_id;
    this.transformation = transformation;
    const payload = `${creator}|${source}|${timestamp}|${parent_id}|${transformation}`;
    this.hash = createHash('sha256').update(payload).digest('hex');
  }

  toDict(): ProvenanceData {
    return {
      creator: this.creator,
      source: this.source,
      timestamp: this.timestamp,
      parent_id: this.parent_id,
      transformation: this.transformation,
      hash: this.hash,
    };
  }
}

// ============================================================
// CANONICAL FIGURE OBJECT  F = (P, E, R, C)
// ============================================================

export interface FigureData {
  id: string;
  name: string;
  domain: string;
  entities: EntityData[];
  relations: RelationData[];
  constraints: ConstraintData[];
  provenance: ProvenanceData;
}

export class Figure {
  id: string;
  name: string;
  domain: Domain;
  entities: Map<string, Entity>;
  relations: Relation[];
  constraints: Constraint[];
  provenance: Provenance;

  constructor(
    name: string,
    domain: Domain,
    entities: Entity[],
    relations: Relation[],
    constraints: Constraint[],
    provenance: Provenance,
  ) {
    if (!(domain in DOMAIN_CONSTRAINTS)) {
      throw new Error(`Domain '${domain}' has no registered constraint set.`);
    }
    this.id = randomUUID();
    this.name = name;
    this.domain = domain;
    this.entities = new Map(entities.map(e => [e.id, e]));
    this.relations = relations;
    this.constraints = constraints;
    this.provenance = provenance;
    this._validateRelationEndpoints();
  }

  private _validateRelationEndpoints(): void {
    for (const r of this.relations) {
      if (!this.entities.has(r.source)) {
        throw new Error(`Relation source '${r.source}' not in entity set.`);
      }
      if (!this.entities.has(r.target)) {
        throw new Error(`Relation target '${r.target}' not in entity set.`);
      }
    }
  }

  /** Structural fingerprint — relation pattern only, objects irrelevant */
  relationSignature(): Set<string> {
    return new Set(this.relations.map(r => `${r.relation}::${r.weight_type}`));
  }

  toDict(): FigureData {
    return {
      id: this.id,
      name: this.name,
      domain: this.domain,
      entities: [...this.entities.values()].map(e => e.toDict()),
      relations: this.relations.map(r => r.toDict()),
      constraints: this.constraints.map(c => c.toDict()),
      provenance: this.provenance.toDict(),
    };
  }

  toString(): string {
    return `Figure(id=${this.id.slice(0, 8)}..., name='${this.name}', domain=${this.domain}, E=${this.entities.size}, R=${this.relations.length}, C=${this.constraints.length})`;
  }
}

// ============================================================
// UFM REASONER — Manipulates Figure objects
// ============================================================

export class UFMReasoner {

  /** Relational isomorphism — structure matches, objects irrelevant */
  static areRelationallyIsomorphic(f1: Figure, f2: Figure): [boolean, string] {
    const sig1 = f1.relationSignature();
    const sig2 = f2.relationSignature();
    const union = new Set([...sig1, ...sig2]);
    const diff = [...union].filter(x => !(sig1.has(x) && sig2.has(x)));
    if (diff.length === 0) {
      return [true, `Figures '${f1.name}' and '${f2.name}' share identical relation structure.`];
    }
    return [false, `Relation signatures differ. Divergence: ${JSON.stringify(diff)}`];
  }

  /** Constraint validation — checks confidence thresholds */
  static validateConstraints(fig: Figure): string[] {
    const failures: string[] = [];
    for (const c of fig.constraints) {
      if (c.confidence === 0.0) {
        failures.push(
          `CRITICAL: Constraint '${c.rule}' has confidence 0.0 — ` +
          `this constraint provides no structural guarantee.`
        );
      } else if (c.confidence < 0.5) {
        failures.push(
          `WARN: Constraint '${c.rule}' confidence ${c.confidence} is below threshold. ` +
          `Evidence chain: ${JSON.stringify(c.evidence_chain)}`
        );
      }
    }
    return failures;
  }

  /** Provenance hash verification — Mercury Engine hook */
  static verifyProvenanceIntegrity(fig: Figure): [boolean, string] {
    const p = fig.provenance;
    const payload = `${p.creator}|${p.source}|${p.timestamp}|${p.parent_id}|${p.transformation}`;
    const expected = createHash('sha256').update(payload).digest('hex');
    if (p.hash === expected) {
      return [true, `Provenance hash verified for figure '${fig.name}'.`];
    }
    return [false,
      `PROVENANCE INTEGRITY FAILURE for figure '${fig.name}'. ` +
      `Expected: ${expected.slice(0, 16)}... Got: ${p.hash.slice(0, 16)}... ` +
      `Figure may be fabricated or tampered.`
    ];
  }

  /** Transformation — produces new Figure, never mutates source */
  static applyTransformation(
    sourceFig: Figure,
    transformName: string,
    newEntities: Entity[],
    newRelations: Relation[],
    newConstraints: Constraint[],
    agentId: string,
  ): Figure {
    const newProvenance = new Provenance(
      agentId,
      `transformation:${transformName}`,
      new Date().toISOString(),
      sourceFig.id,
      transformName,
    );
    return new Figure(
      `${sourceFig.name}::${transformName}`,
      sourceFig.domain,
      newEntities,
      newRelations,
      newConstraints,
      newProvenance,
    );
  }

  /** Full diagnostic comparison between two figures */
  static compare(f1: Figure, f2: Figure): Record<string, unknown> {
    const [iso, isoMsg] = UFMReasoner.areRelationallyIsomorphic(f1, f2);
    const [p1Valid, p1Msg] = UFMReasoner.verifyProvenanceIntegrity(f1);
    const [p2Valid, p2Msg] = UFMReasoner.verifyProvenanceIntegrity(f2);
    return {
      figures: [f1.name, f2.name],
      relationally_isomorphic: iso,
      isomorphism_detail: isoMsg,
      f1_constraint_failures: UFMReasoner.validateConstraints(f1),
      f2_constraint_failures: UFMReasoner.validateConstraints(f2),
      f1_provenance_valid: p1Valid,
      f1_provenance_detail: p1Msg,
      f2_provenance_valid: p2Valid,
      f2_provenance_detail: p2Msg,
    };
  }
}

// ============================================================
// CLOUUD FIGURE AGENT — Planner-facing surface
// ============================================================

export class ClouudFigureAgent {
  agentId: string;
  registry: Map<string, Figure>;
  reasoner: UFMReasoner;

  constructor(agentId: string) {
    this.agentId = agentId;
    this.registry = new Map();
    this.reasoner = new UFMReasoner();
  }

  registerFigure(fig: Figure): string {
    const [valid, msg] = UFMReasoner.verifyProvenanceIntegrity(fig);
    if (!valid) throw new Error(`Figure rejected at registration: ${msg}`);
    this.registry.set(fig.id, fig);
    return fig.id;
  }

  findIsomorphicPairs(): Array<[string, string, string]> {
    const figures = [...this.registry.values()];
    const results: Array<[string, string, string]> = [];
    for (let i = 0; i < figures.length; i++) {
      for (let j = i + 1; j < figures.length; j++) {
        const [iso, msg] = UFMReasoner.areRelationallyIsomorphic(figures[i], figures[j]);
        if (iso) results.push([figures[i].name, figures[j].name, msg]);
      }
    }
    return results;
  }

  auditRegistry(): Record<string, unknown>[] {
    return [...this.registry.values()].map(fig => {
      const [pValid, pMsg] = UFMReasoner.verifyProvenanceIntegrity(fig);
      return {
        figure: fig.name,
        id: fig.id,
        domain: fig.domain,
        provenance_valid: pValid,
        provenance_detail: pMsg,
        constraint_failures: UFMReasoner.validateConstraints(fig),
        entity_count: fig.entities.size,
        relation_count: fig.relations.length,
      };
    });
  }

  derive(
    sourceId: string,
    transformName: string,
    newEntities: Entity[],
    newRelations: Relation[],
    newConstraints: Constraint[],
  ): string {
    const source = this.registry.get(sourceId);
    if (!source) throw new Error(`No figure with id '${sourceId}' in registry.`);
    const derived = UFMReasoner.applyTransformation(
      source, transformName, newEntities, newRelations, newConstraints, this.agentId
    );
    return this.registerFigure(derived);
  }
}
