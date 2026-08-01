/**
 * CLOUUD UFM API
 * REST interface for the Universal Figure Model reasoning layer.
 * File: server/routes/ufm-api.ts
 *
 * Mount in server/index.ts:
 *   import ufmRouter from './routes/ufm-api';
 *   app.use('/api/ufm', ufmRouter);
 */

import { Router, Request, Response } from 'express';
import {
  Domain,
  DOMAIN_CONSTRAINTS,
  VALID_WEIGHT_TYPES,
  Entity,
  Relation,
  Constraint,
  Provenance,
  Figure,
  UFMReasoner,
  ClouudFigureAgent,
} from '../lib/ufm/ufm-core';

const router = Router();

// In-memory agent registry — one agent per agentId
// For production: swap with Neon-backed persistence
const agents = new Map<string, ClouudFigureAgent>();

function getOrCreateAgent(agentId: string): ClouudFigureAgent {
  if (!agents.has(agentId)) {
    agents.set(agentId, new ClouudFigureAgent(agentId));
  }
  return agents.get(agentId)!;
}

function buildFigureFromBody(body: any): Figure {
  const {
    name, domain, entities = [], relations = [], constraints = [], provenance: prov
  } = body;

  if (!name) throw new Error('name is required');
  if (!domain || !(domain in DOMAIN_CONSTRAINTS)) {
    throw new Error(`domain must be one of: ${Object.values(Domain).join(', ')}`);
  }
  if (!prov?.creator || !prov?.source) {
    throw new Error('provenance.creator and provenance.source are required');
  }

  const entityObjs = (entities as any[]).map(e =>
    new Entity(e.id, e.type, e.attributes || {})
  );
  const relationObjs = (relations as any[]).map(r =>
    new Relation(r.source, r.target, r.relation, r.weight, r.weight_type)
  );
  const constraintObjs = (constraints as any[]).map(c =>
    new Constraint(c.rule, c.confidence, c.evidence_chain || [])
  );
  const provObj = new Provenance(
    prov.creator,
    prov.source,
    prov.timestamp || new Date().toISOString(),
    prov.parent_id || null,
    prov.transformation || null,
  );

  return new Figure(domain as Domain, name, entityObjs, relationObjs, constraintObjs, provObj);
}

// ── GET /api/ufm ─────────────────────────────────────────────────────────────
// Catalog — what the UFM system provides
router.get('/', (_req: Request, res: Response) => {
  res.json({
    system: 'CLOUUD UFM — Universal Figure Model v1.1',
    canonical_object: 'F = (P, E, R, C)',
    layers: {
      ontology: 'Defines what exists — F = (P, E, R, C)',
      reasoner: 'Manipulates figures — isomorphism, constraints, provenance, transformation',
      planner:  'Acts on reasoner output — /api/ufm/agent/*',
    },
    domains: Object.values(Domain),
    valid_weight_types: [...VALID_WEIGHT_TYPES],
    endpoints: [
      'GET  /api/ufm',
      'POST /api/ufm/figure/validate',
      'POST /api/ufm/figure/compare',
      'POST /api/ufm/agent/:agentId/register',
      'GET  /api/ufm/agent/:agentId/registry',
      'GET  /api/ufm/agent/:agentId/audit',
      'GET  /api/ufm/agent/:agentId/isomorphic',
      'POST /api/ufm/agent/:agentId/derive',
    ],
  });
});

// ── POST /api/ufm/figure/validate ────────────────────────────────────────────
// Validates a figure definition without registering it.
// Use this to check a figure before sending to an agent.
router.post('/figure/validate', (req: Request, res: Response) => {
  try {
    const fig = buildFigureFromBody(req.body);
    const [pValid, pMsg] = UFMReasoner.verifyProvenanceIntegrity(fig);
    const failures = UFMReasoner.validateConstraints(fig);
    res.json({
      valid: pValid && failures.length === 0,
      figure: fig.toDict(),
      provenance_valid: pValid,
      provenance_detail: pMsg,
      constraint_failures: failures,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/ufm/figure/compare ─────────────────────────────────────────────
// Compares two figures for relational isomorphism.
// Body: { figure1: {...}, figure2: {...} }
router.post('/figure/compare', (req: Request, res: Response) => {
  try {
    const { figure1, figure2 } = req.body;
    if (!figure1 || !figure2) {
      return res.status(400).json({ error: 'figure1 and figure2 are required' });
    }
    const f1 = buildFigureFromBody(figure1);
    const f2 = buildFigureFromBody(figure2);
    res.json(UFMReasoner.compare(f1, f2));
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/ufm/agent/:agentId/register ────────────────────────────────────
// Register a figure with an agent. P is verified first — rejected on failure.
router.post('/agent/:agentId/register', (req: Request, res: Response) => {
  try {
    const agent = getOrCreateAgent(req.params.agentId);
    const fig = buildFigureFromBody(req.body);
    const figId = agent.registerFigure(fig);
    res.status(201).json({
      registered: true,
      figure_id: figId,
      figure_name: fig.name,
      agent_id: req.params.agentId,
      registry_size: agent.registry.size,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ── GET /api/ufm/agent/:agentId/registry ─────────────────────────────────────
// List all registered figures for an agent.
router.get('/agent/:agentId/registry', (req: Request, res: Response) => {
  const agent = getOrCreateAgent(req.params.agentId);
  res.json({
    agent_id: req.params.agentId,
    count: agent.registry.size,
    figures: [...agent.registry.values()].map(f => f.toDict()),
  });
});

// ── GET /api/ufm/agent/:agentId/audit ────────────────────────────────────────
// Full diagnostic on all registered figures.
router.get('/agent/:agentId/audit', (req: Request, res: Response) => {
  const agent = getOrCreateAgent(req.params.agentId);
  res.json({
    agent_id: req.params.agentId,
    audit: agent.auditRegistry(),
  });
});

// ── GET /api/ufm/agent/:agentId/isomorphic ───────────────────────────────────
// Find all isomorphic pairs in the registry.
router.get('/agent/:agentId/isomorphic', (req: Request, res: Response) => {
  const agent = getOrCreateAgent(req.params.agentId);
  const pairs = agent.findIsomorphicPairs();
  res.json({
    agent_id: req.params.agentId,
    isomorphic_pairs: pairs.map(([n1, n2, detail]) => ({ figure1: n1, figure2: n2, detail })),
    count: pairs.length,
    note: '1-WL algorithm — necessary condition, not sufficient. False positives possible on regular graphs (e.g. K3,3 vs K4).',
  });
});

// ── POST /api/ufm/agent/:agentId/derive ──────────────────────────────────────
// Derive a new figure from an existing one via transformation.
// Body: { source_id, transform_name, entities, relations, constraints }
router.post('/agent/:agentId/derive', (req: Request, res: Response) => {
  try {
    const agent = getOrCreateAgent(req.params.agentId);
    const { source_id, transform_name, entities = [], relations = [], constraints = [] } = req.body;

    if (!source_id) return res.status(400).json({ error: 'source_id required' });
    if (!transform_name) return res.status(400).json({ error: 'transform_name required' });

    const entityObjs = (entities as any[]).map(e => new Entity(e.id, e.type, e.attributes || {}));
    const relationObjs = (relations as any[]).map(r =>
      new Relation(r.source, r.target, r.relation, r.weight, r.weight_type)
    );
    const constraintObjs = (constraints as any[]).map(c =>
      new Constraint(c.rule, c.confidence, c.evidence_chain || [])
    );

    const newId = agent.derive(source_id, transform_name, entityObjs, relationObjs, constraintObjs);
    const derived = agent.registry.get(newId)!;

    res.status(201).json({
      derived: true,
      figure_id: newId,
      figure_name: derived.name,
      parent_id: source_id,
      transform_name,
      provenance_hash: derived.provenance.hash,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
