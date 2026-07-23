/**
 * UUON CLOUD BRIDGE SERVICE
 * Handles all communication between Δmension and uuon-clouud.replit.app
 * - Pushes shape geometry data (computed output only — never formulas) outward
 * - Receives learning feedback and model updates inward
 * - Provides a health-check / handshake between the two systems
 *
 * IP POLICY: This service must NEVER transmit formulas, equations, or any
 * representation of the underlying mathematical generation logic. Only
 * computed geometry (vertices, parameters, category labels) may cross this
 * boundary. See geometry-only transmission policy.
 */

const UUON_CLOUD_BASE = process.env.UUON_CLOUD_URL || 'https://uuon-clouud.replit.app';
const BRIDGE_SECRET   = process.env.UUON_BRIDGE_SECRET || '';

function authHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Bridge-Secret': BRIDGE_SECRET,
    'X-Source-App': 'dmension-mathematical-universe',
    'X-Bridge-Version': '1.0',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDSHAKE
// ─────────────────────────────────────────────────────────────────────────────

export async function pingUuonCloud(): Promise<{
  reachable: boolean;
  status?: string;
  capabilities?: string[];
  latencyMs?: number;
  error?: string;
}> {
  const start = Date.now();
  try {
    const res = await fetch(`${UUON_CLOUD_BASE}/api/health`, {
      method: 'GET',
      headers: authHeaders(),
      signal: AbortSignal.timeout(8000),
    });

    const latencyMs = Date.now() - start;

    if (!res.ok) {
      return { reachable: false, error: `HTTP ${res.status}`, latencyMs };
    }

    const data = await res.json().catch(() => ({}));
    return {
      reachable: true,
      status: data.status || 'ok',
      capabilities: data.capabilities || [],
      latencyMs,
    };
  } catch (err: any) {
    return { reachable: false, error: err.message, latencyMs: Date.now() - start };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUSH — Send shape geometry to UUON Cloud
// NOTE: formulas/digitalDNA fields intentionally removed — geometry only.
// ─────────────────────────────────────────────────────────────────────────────

export interface ShapeExportPackage {
  shapeType: string;
  parameters: Record<string, number>;
  physicsCategory: string;
  vertices?: number[];
  timestamp?: string;
}

export async function pushShapeToCloud(shape: ShapeExportPackage): Promise<{
  success: boolean;
  cloudId?: string;
  error?: string;
}> {
  try {
    const payload = {
      shapeType: shape.shapeType,
      parameters: shape.parameters,
      physicsCategory: shape.physicsCategory,
      vertices: shape.vertices,
      source: 'dmension',
      timestamp: shape.timestamp || new Date().toISOString(),
    };

    const res = await fetch(`${UUON_CLOUD_BASE}/api/shapes/receive`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      cloudId: data.id || data.cloudId,
      error: res.ok ? undefined : (data.error || `HTTP ${res.status}`),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUSH — Send ML embeddings to UUON Cloud
// ─────────────────────────────────────────────────────────────────────────────

export async function pushEmbeddingsToCloud(
  shapeType: string,
  embeddings: number[][],
  metadata?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${UUON_CLOUD_BASE}/api/ml/embeddings`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        shapeType,
        embeddings,
        metadata: metadata || {},
        source: 'dmension',
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json().catch(() => ({}));
    return {
      success: res.ok,
      error: res.ok ? undefined : (data.error || `HTTP ${res.status}`),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PULL — Fetch shapes from UUON Cloud
// ─────────────────────────────────────────────────────────────────────────────

export async function pullShapesFromCloud(options?: {
  category?: string;
  limit?: number;
  since?: string;
}): Promise<{
  success: boolean;
  shapes?: ShapeExportPackage[];
  count?: number;
  error?: string;
}> {
  try {
    const params = new URLSearchParams();
    if (options?.category) params.set('category', options.category);
    if (options?.limit)    params.set('limit', String(options.limit));
    if (options?.since)    params.set('since', options.since);

    const url = `${UUON_CLOUD_BASE}/api/shapes/export?${params.toString()}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: authHeaders(),
      signal: AbortSignal.timeout(12000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return {
      success: true,
      shapes: data.shapes || data.data || [],
      count: data.count || (data.shapes || []).length,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PULL — Fetch ML model updates from UUON Cloud
// ─────────────────────────────────────────────────────────────────────────────

export async function pullMLUpdatesFromCloud(): Promise<{
  success: boolean;
  models?: Array<{ name: string; version: string; improvements: string[] }>;
  error?: string;
}> {
  try {
    const res = await fetch(`${UUON_CLOUD_BASE}/api/ml/updates`, {
      method: 'GET',
      headers: authHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return {
      success: true,
      models: data.models || data.updates || [],
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// BIDIRECTIONAL SYNC — Full exchange in one call
// ─────────────────────────────────────────────────────────────────────────────

export async function fullSync(localShapes: ShapeExportPackage[]): Promise<{
  success: boolean;
  pushed: number;
  pulled: number;
  mlUpdates: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let pushed = 0;
  let pulled = 0;
  let mlUpdates = 0;

  for (const shape of localShapes) {
    const result = await pushShapeToCloud(shape);
    if (result.success) {
      pushed++;
    } else {
      errors.push(`Push ${shape.shapeType}: ${result.error}`);
    }
  }

  const pullResult = await pullShapesFromCloud({ limit: 50 });
  if (pullResult.success) {
    pulled = pullResult.count || 0;
  } else {
    errors.push(`Pull shapes: ${pullResult.error}`);
  }

  const mlResult = await pullMLUpdatesFromCloud();
  if (mlResult.success) {
    mlUpdates = mlResult.models?.length || 0;
  } else {
    errors.push(`Pull ML: ${mlResult.error}`);
  }

  return {
    success: errors.length === 0,
    pushed,
    pulled,
    mlUpdates,
    errors,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// VERIFY INCOMING REQUEST from UUON Cloud
// SECURITY FIX: now fails CLOSED if no secret is configured, instead of
// allowing all requests through. If UUON_BRIDGE_SECRET is unset, incoming
// webhooks are rejected rather than silently accepted.
// ─────────────────────────────────────────────────────────────────────────────

export function verifyBridgeRequest(secret: string | undefined): boolean {
  if (!BRIDGE_SECRET) {
    console.warn('⚠️  UUON_BRIDGE_SECRET not set — rejecting all incoming bridge requests.');
    return false;
  }
  return secret === BRIDGE_SECRET;
}

export const uuonCloudBridge = {
  ping: pingUuonCloud,
  pushShape: pushShapeToCloud,
  pushEmbeddings: pushEmbeddingsToCloud,
  pullShapes: pullShapesFromCloud,
  pullMLUpdates: pullMLUpdatesFromCloud,
  fullSync,
  verifyRequest: verifyBridgeRequest,
  cloudBaseUrl: UUON_CLOUD_BASE,
};

export default uuonCloudBridge;