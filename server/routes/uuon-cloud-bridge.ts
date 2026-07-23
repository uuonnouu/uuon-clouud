/**
 * UUON CLOUD BRIDGE ROUTES
 * Mounts at /api/bridge
 *
 * FROM this app TO uuon-clouud.replit.app:
 *   POST /api/bridge/push/shape          — send one shape's GEOMETRY ONLY (no formulas)
 *   POST /api/bridge/push/embeddings     — send ML embeddings
 *   POST /api/bridge/sync                — full bidirectional sync
 *   GET  /api/bridge/pull/shapes         — fetch shapes from cloud
 *   GET  /api/bridge/pull/ml-updates     — fetch ML model updates from cloud
 *
 * FROM uuon-clouud.replit.app TO this app (incoming webhooks):
 *   POST /api/bridge/receive/shape       — cloud sends a shape here
 *   POST /api/bridge/receive/ml          — cloud sends ML data here
 *
 * Status:
 *   GET  /api/bridge/status              — ping UUON Cloud + show config
 *
 * IP POLICY: formulas and digitalDNA are never accepted or transmitted by
 * this router. Only computed geometry (shapeType, parameters, physicsCategory,
 * vertices) crosses this boundary.
 */

import { Router, Request, Response } from 'express';
import uuonCloudBridge, {
  ShapeExportPackage,
  pingUuonCloud,
  pushShapeToCloud,
  pushEmbeddingsToCloud,
  pullShapesFromCloud,
  pullMLUpdatesFromCloud,
  fullSync,
  verifyBridgeRequest,
} from '../services/uuonCloudBridgeService';

const router = Router();

const incomingShapeLog: Array<ShapeExportPackage & { receivedAt: string }> = [];
const incomingMLLog:    Array<{ shapeType: string; count: number; receivedAt: string }> = [];

// ─────────────────────────────────────────────────────────────────────────────
// STATUS
// ─────────────────────────────────────────────────────────────────────────────

router.get('/status', async (_req: Request, res: Response) => {
  const cloudStatus = await pingUuonCloud();

  res.json({
    dmension: {
      status: 'online',
      url: process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : 'https://dmension-mathematical-universe.replit.app',
      capabilities: ['shapes', 'ml-embeddings', 'physics', 'quantum', 'export'],
    },
    uuonCloud: {
      url: uuonCloudBridge.cloudBaseUrl,
      ...cloudStatus,
    },
    bridge: {
      secretConfigured: !!(process.env.UUON_BRIDGE_SECRET),
      incomingShapes: incomingShapeLog.length,
      incomingMLBatches: incomingMLLog.length,
      lastCheck: new Date().toISOString(),
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUSH — Send shape geometry from Δmension → UUON Cloud
// formulas/digitalDNA are intentionally NOT read from the request body.
// ─────────────────────────────────────────────────────────────────────────────

router.post('/push/shape', async (req: Request, res: Response) => {
  const { shapeType, parameters, physicsCategory, vertices } = req.body;

  if (!shapeType) {
    return res.status(400).json({ error: 'shapeType is required' });
  }

  const pkg: ShapeExportPackage = {
    shapeType,
    parameters: parameters || {},
    physicsCategory: physicsCategory || 'static',
    vertices,
    timestamp: new Date().toISOString(),
  };

  const result = await pushShapeToCloud(pkg);

  res.status(result.success ? 200 : 502).json({
    ...result,
    shapeType,
    pushedAt: pkg.timestamp,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PUSH — Send ML embeddings from Δmension → UUON Cloud
// ─────────────────────────────────────────────────────────────────────────────

router.post('/push/embeddings', async (req: Request, res: Response) => {
  const { shapeType, embeddings, metadata } = req.body;

  if (!shapeType || !embeddings) {
    return res.status(400).json({ error: 'shapeType and embeddings are required' });
  }

  const result = await pushEmbeddingsToCloud(shapeType, embeddings, metadata);

  res.status(result.success ? 200 : 502).json({
    ...result,
    shapeType,
    embeddingCount: Array.isArray(embeddings) ? embeddings.length : 0,
    pushedAt: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PULL — Fetch shapes from UUON Cloud → Δmension
// ─────────────────────────────────────────────────────────────────────────────

router.get('/pull/shapes', async (req: Request, res: Response) => {
  const { category, limit, since } = req.query;

  const result = await pullShapesFromCloud({
    category: category as string | undefined,
    limit: limit ? Number(limit) : undefined,
    since: since as string | undefined,
  });

  res.status(result.success ? 200 : 502).json({
    ...result,
    pulledAt: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PULL — Fetch ML model updates from UUON Cloud
// ─────────────────────────────────────────────────────────────────────────────

router.get('/pull/ml-updates', async (_req: Request, res: Response) => {
  const result = await pullMLUpdatesFromCloud();

  res.status(result.success ? 200 : 502).json({
    ...result,
    pulledAt: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SYNC
// ─────────────────────────────────────────────────────────────────────────────

router.post('/sync', async (req: Request, res: Response) => {
  const { shapes } = req.body;
  const localShapes: ShapeExportPackage[] = Array.isArray(shapes) ? shapes : [];

  const result = await fullSync(localShapes);

  res.status(result.success ? 200 : 207).json({
    ...result,
    syncedAt: new Date().toISOString(),
    message: result.success
      ? `Sync complete: pushed ${result.pushed}, pulled ${result.pulled}, ML updates ${result.mlUpdates}`
      : `Sync partial: ${result.errors.length} errors`,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RECEIVE — UUON Cloud sends a shape to this app (incoming webhook)
// ─────────────────────────────────────────────────────────────────────────────

router.post('/receive/shape', (req: Request, res: Response) => {
  const bridgeSecret = req.headers['x-bridge-secret'] as string | undefined;

  if (!verifyBridgeRequest(bridgeSecret)) {
    return res.status(401).json({ error: 'Invalid or missing bridge secret' });
  }

  const shape = req.body as ShapeExportPackage;

  if (!shape.shapeType) {
    return res.status(400).json({ error: 'shapeType is required' });
  }

  incomingShapeLog.unshift({ ...shape, receivedAt: new Date().toISOString() });
  if (incomingShapeLog.length > 100) incomingShapeLog.splice(100);

  console.log(`🔗 Bridge: received shape "${shape.shapeType}" from UUON Cloud`);

  res.json({
    success: true,
    message: `Shape "${shape.shapeType}" received and logged`,
    receivedAt: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RECEIVE — UUON Cloud sends ML data / embeddings to this app
// ─────────────────────────────────────────────────────────────────────────────

router.post('/receive/ml', (req: Request, res: Response) => {
  const bridgeSecret = req.headers['x-bridge-secret'] as string | undefined;

  if (!verifyBridgeRequest(bridgeSecret)) {
    return res.status(401).json({ error: 'Invalid or missing bridge secret' });
  }

  const { shapeType, embeddings, metadata } = req.body;

  if (!shapeType) {
    return res.status(400).json({ error: 'shapeType is required' });
  }

  const count = Array.isArray(embeddings) ? embeddings.length : 0;

  incomingMLLog.unshift({ shapeType, count, receivedAt: new Date().toISOString() });
  if (incomingMLLog.length > 100) incomingMLLog.splice(100);

  console.log(`🤖 Bridge: received ${count} ML embeddings for "${shapeType}" from UUON Cloud`);

  res.json({
    success: true,
    message: `ML data for "${shapeType}" received`,
    embeddingsReceived: count,
    receivedAt: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LOG
// ─────────────────────────────────────────────────────────────────────────────

router.get('/log', (_req: Request, res: Response) => {
  res.json({
    incomingShapes: incomingShapeLog.slice(0, 20),
    incomingML: incomingMLLog.slice(0, 20),
    totals: {
      shapes: incomingShapeLog.length,
      mlBatches: incomingMLLog.length,
    },
  });
});

export default router;