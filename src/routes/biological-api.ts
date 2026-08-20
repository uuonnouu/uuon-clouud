/**
 * CLOUUD Biological API Routes
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Mount in server/index.ts:
 *   import biologicalRoutes from '../src/routes/biological-api';
 *   app.use('/api/biological', biologicalRoutes);
 *
 * Endpoints:
 *   GET  /api/biological/topology          — full organism map (all engines, layers, signal types)
 *   GET  /api/biological/engines           — all engines in registry
 *   GET  /api/biological/engines/:id       — single engine record
 *   GET  /api/biological/layer/:n          — all engines on a given layer
 *   GET  /api/biological/wires             — all defined cross-engine wires
 *   GET  /api/biological/constants         — fractal attractor constants
 *   GET  /api/biological/health            — router + gate-uuay health
 *   POST /api/biological/dispatch          — dispatch P-vector to an engine via CNS
 */

import { Router, Request, Response } from 'express';
import {
  BIOLOGICAL_REGISTRY,
  CROSS_ENGINE_WIRES,
  FRACTAL_ATTRACTOR_CONSTANTS,
  getEngine,
  getEnginesByLayer,
  getTopologyMap,
  getLiveEngines,
} from '../../engine/biological/registry';
import { dispatch, routerHealth } from '../../engine/biological/router';

const router = Router();

// ── GET /api/biological/topology ─────────────────────────────────────────────

router.get('/topology', (_req: Request, res: Response) => {
  const topology = getTopologyMap();
  const unassigned = BIOLOGICAL_REGISTRY.filter(e => e.layer === null);

  res.json({
    framework:     'F=(P,E,M,R,C)',
    author:        'Phillip Aguilar Ruiz III / UUON Foundation Inc.',
    license:       'USAL-1.0',
    total_engines: BIOLOGICAL_REGISTRY.length,
    live_engines:  getLiveEngines().length,
    layers:        topology,
    unassigned,
    wires:         CROSS_ENGINE_WIRES,
    signal_types: {
      ROUTED:    'Dispatched via gate-uuay. No direct engine-to-engine calls.',
      BROADCAST: 'Read from endocrine_state table. Written by Endocrine Engine only.',
      PUBLISHED: 'Writes to dmension table. Other engines pull when needed.',
    },
    topology_rule: 'No engine calls another engine directly. All signals route through gate-uuay or read from dmension tables.',
  });
});

// ── GET /api/biological/engines ───────────────────────────────────────────────

router.get('/engines', (_req: Request, res: Response) => {
  res.json({
    count:   BIOLOGICAL_REGISTRY.length,
    engines: BIOLOGICAL_REGISTRY.map(e => ({
      engine_id:    e.engine_id,
      name:         e.name,
      layer:        e.layer,
      bio_system:   e.bio_system,
      signal_type:  e.signal_type,
      status:       e.status,
      npm_package:  e.npm_package,
      gate_endpoint: e.gate_endpoint,
      upstream_url: e.upstream_url,
    })),
  });
});

// ── GET /api/biological/engines/:id ───────────────────────────────────────────

router.get('/engines/:id', (req: Request, res: Response) => {
  const engine = getEngine(req.params.id);
  if (!engine) {
    res.status(404).json({ error: `Engine not found: ${req.params.id}` });
    return;
  }
  res.json(engine);
});

// ── GET /api/biological/layer/:n ──────────────────────────────────────────────

router.get('/layer/:n', (req: Request, res: Response) => {
  const n = parseInt(req.params.n, 10);
  if (isNaN(n)) {
    res.status(400).json({ error: 'Layer must be an integer' });
    return;
  }
  const engines = getEnginesByLayer(n);
  if (engines.length === 0) {
    res.status(404).json({ error: `No engines registered at layer ${n}` });
    return;
  }
  res.json({ layer: n, count: engines.length, engines });
});

// ── GET /api/biological/wires ─────────────────────────────────────────────────

router.get('/wires', (_req: Request, res: Response) => {
  res.json({
    count: CROSS_ENGINE_WIRES.length,
    rule:  'All wires route through gate-uuay. No direct engine-to-engine calls.',
    wires: CROSS_ENGINE_WIRES,
  });
});

// ── GET /api/biological/constants ────────────────────────────────────────────

router.get('/constants', (_req: Request, res: Response) => {
  res.json({
    source:      'Discovered 2026-08-20 from 7 hand-built fractal presets',
    description: 'Mathematical attractors — parameter values the fractal engine family returned to with zero variation. These are not aesthetic preferences.',
    constants:   FRACTAL_ATTRACTOR_CONSTANTS,
    meaning: {
      escape_radius: 'Doubled from standard Mandelbrot=2. Expanded escape basin — stable boundary behavior across all 7 presets.',
      contrast:      'Maximum distinguishable information perceptual constant.',
      coloring_mode: 'Most stable rendering mode (iteration count default, 5/7 presets).',
    },
  });
});

// ── GET /api/biological/health ────────────────────────────────────────────────

router.get('/health', async (_req: Request, res: Response) => {
  const health = await routerHealth();
  res.json({
    biological_registry: 'OK',
    total_engines:       BIOLOGICAL_REGISTRY.length,
    live_engines:        getLiveEngines().length,
    ...health,
    timestamp: new Date().toISOString(),
  });
});

// ── POST /api/biological/dispatch ─────────────────────────────────────────────
// Body: { engine_id: string, p_vector: object }
// Dispatches a P-vector through the CNS to the target engine via gate-uuay.

router.post('/dispatch', async (req: Request, res: Response) => {
  const { engine_id, p_vector } = req.body as {
    engine_id?: string;
    p_vector?:  Record<string, unknown>;
  };

  if (!engine_id) {
    res.status(400).json({ error: 'engine_id is required' });
    return;
  }
  if (!p_vector || typeof p_vector !== 'object') {
    res.status(400).json({ error: 'p_vector is required and must be an object' });
    return;
  }

  const result = await dispatch({ engine_id, p_vector });

  if (!result.ok) {
    res.status(result.error?.includes('not found') ? 404 : 502).json(result);
    return;
  }

  res.json(result);
});

export default router;
