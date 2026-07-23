import { Router } from 'express';
import shapesRouter from './routes/shapes';

const nerfApi = Router();

// Health / info — public, no auth required
nerfApi.get('/health', (_req, res) => {
  res.json({
    status:  'ok',
    service: 'Δmension NeRF Neural Export API',
    org:     'UUON Foundation Inc.',
    version: '1.0.0',
    tiers: {
      metadata:   'public_auth  — shape identity, parameters, bounds',
      formulas:   'public_auth  — parametric equations and mathematical basis',
      transforms: 'protected    — camera transform matrices',
      ngp_config: 'internal     — not exposed via API',
      weights:    'internal     — not exposed via API',
    },
    docs: '/api/docs',
  });
});

// Shape asset routes (API key required — see routes/shapes.ts)
nerfApi.use('/shapes', shapesRouter);

export default nerfApi;
