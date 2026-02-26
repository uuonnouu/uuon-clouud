const DMENSION_URL = process.env.DMENSION_API_URL || 'https://dmension-mathematical-universe.replit.app';
const BRIDGE_SECRET = process.env.UUON_BRIDGE_SECRET || '';

const HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  'X-Bridge-Secret': BRIDGE_SECRET,
  'X-Source-App': 'uuon-cloud',
};

async function safeFetch(url: string, options?: RequestInit): Promise<any> {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    if (!res.ok) {
      throw new Error(`Δmension returned ${res.status}: ${text.slice(0, 200)}`);
    }
    return { raw: text, status: res.status };
  }
}

export async function checkConnection() {
  const start = Date.now();
  const data = await safeFetch(`${DMENSION_URL}/api/bridge/status`, { headers: HEADERS });
  const latency = Date.now() - start;
  return { ...data, latencyMs: latency, bridgeUrl: DMENSION_URL };
}

export async function sendShape(shapeData: {
  shapeType: string;
  parameters: Record<string, number>;
  physicsCategory?: string;
}) {
  return await safeFetch(`${DMENSION_URL}/api/bridge/receive/shape`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify(shapeData),
  });
}

export async function sendMLData(shapeType: string, embeddings: number[][], metadata: Record<string, any> = {}) {
  return await safeFetch(`${DMENSION_URL}/api/bridge/receive/ml`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ shapeType, embeddings, metadata }),
  });
}

export async function getShapes(options: { category?: string; limit?: number } = {}) {
  const params = new URLSearchParams();
  if (options.category) params.set('category', options.category);
  if (options.limit) params.set('limit', String(options.limit));
  return await safeFetch(`${DMENSION_URL}/api/bridge/pull/shapes?${params}`, { headers: HEADERS });
}

export async function getMLUpdates() {
  return await safeFetch(`${DMENSION_URL}/api/bridge/pull/ml-updates`, { headers: HEADERS });
}

export async function fullSync(localShapes: any[] = []) {
  return await safeFetch(`${DMENSION_URL}/api/bridge/sync`, {
    method: 'POST',
    headers: HEADERS,
    body: JSON.stringify({ shapes: localShapes }),
  });
}

export async function viewSentLog() {
  return await safeFetch(`${DMENSION_URL}/api/bridge/log`, { headers: HEADERS });
}

export const dmensionBridge = {
  checkConnection,
  sendShape,
  sendMLData,
  getShapes,
  getMLUpdates,
  fullSync,
  viewSentLog,
};
