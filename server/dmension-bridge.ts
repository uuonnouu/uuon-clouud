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

let dmensionConnected = false;
let lastCheckTime: string | null = null;
let retryCount = 0;

export function getDmensionStatus() {
  return { connected: dmensionConnected, lastCheck: lastCheckTime, retries: retryCount, url: DMENSION_URL };
}

export function startConnectionMonitor() {
  const RETRY_INTERVAL = 30000;
  const MAX_RETRIES = 120;

  async function tryConnect() {
    if (dmensionConnected || retryCount >= MAX_RETRIES) return;
    retryCount++;
    lastCheckTime = new Date().toISOString();
    try {
      const start = Date.now();
      const res = await fetch(`${DMENSION_URL}/api/bridge/status`, {
        headers: HEADERS,
        signal: AbortSignal.timeout(10000),
      });
      const latency = Date.now() - start;
      if (res.ok) {
        dmensionConnected = true;
        console.log(`[DMENSION] Connected after ${retryCount} attempts (${latency}ms latency)`);
        return;
      }
      const text = await res.text();
      console.log(`[DMENSION] Attempt ${retryCount}: HTTP ${res.status} — ${text.slice(0, 80)}`);
    } catch (e: any) {
      console.log(`[DMENSION] Attempt ${retryCount}: ${e.message.slice(0, 80)}`);
    }
    setTimeout(tryConnect, RETRY_INTERVAL);
  }

  console.log(`[DMENSION] Starting connection monitor → ${DMENSION_URL}`);
  console.log(`[DMENSION] Will retry every ${RETRY_INTERVAL / 1000}s for up to ${MAX_RETRIES} attempts`);
  tryConnect();
}

export const dmensionBridge = {
  checkConnection,
  sendShape,
  sendMLData,
  getShapes,
  getMLUpdates,
  fullSync,
  viewSentLog,
  getDmensionStatus,
  startConnectionMonitor,
};
