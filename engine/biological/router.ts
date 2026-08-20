/**
 * CLOUUD Biological Router — CNS Signal Dispatch
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Framework: F=(P,E,M,R,C)
 * License:   USAL-1.0
 *
 * This is the CNS routing layer. It dispatches signals between engines
 * via gate-uuay. It never calls engines directly. Engines never call
 * each other directly. All signals pass through here.
 *
 * TOPOLOGY ENFORCED:
 *   Engine → router.dispatch() → gate-uuay → target engine
 *   Never: Engine → Engine
 */

import { getEngine, getRoutedEngines, EngineRecord } from './registry';

const GATE_UUAY_BASE = process.env.GATE_UUAY_URL ?? 'https://gate-uuay-production.up.railway.app';
const GATE_API_KEY   = process.env.GATE_API_KEY   ?? '';

export interface DispatchPayload {
  engine_id: string;
  p_vector:  Record<string, unknown>;
  caller?:   string;   // engine_id of the calling engine, for provenance
}

export interface DispatchResult {
  ok:         boolean;
  engine_id:  string;
  layer:      number | null;
  bio:        string;
  output:     unknown;
  provenance: unknown;
  proof:      unknown;
  error?:     string;
}

// ─── CORE DISPATCH ────────────────────────────────────────────────────────────

export async function dispatch(payload: DispatchPayload): Promise<DispatchResult> {
  const engine = getEngine(payload.engine_id);

  if (!engine) {
    return {
      ok: false,
      engine_id: payload.engine_id,
      layer: null,
      bio: 'UNKNOWN',
      output: null,
      provenance: null,
      proof: null,
      error: `Engine not found in biological registry: ${payload.engine_id}`,
    };
  }

  if (!engine.gate_endpoint) {
    return {
      ok: false,
      engine_id: payload.engine_id,
      layer: engine.layer,
      bio: engine.bio_function,
      output: null,
      provenance: null,
      proof: null,
      error: `Engine ${payload.engine_id} has no gate-uuay endpoint. Signal type: ${engine.signal_type}. It may be PUBLISHED (pull from dmension) or BROADCAST (read endocrine_state table).`,
    };
  }

  const url = `${GATE_UUAY_BASE}${engine.gate_endpoint}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key':    GATE_API_KEY,
        'X-Caller':     payload.caller ?? 'clouud-router',
        'X-Framework':  'F=(P,E,M,R,C)',
        'X-Author':     'Phillip Aguilar Ruiz III / UUON Foundation Inc.',
      },
      body: JSON.stringify({ p_vector: payload.p_vector }),
    });

    const data = await res.json() as {
      output?: unknown;
      provenance?: unknown;
      proof?: unknown;
      error?: string;
    };

    return {
      ok:         res.ok,
      engine_id:  payload.engine_id,
      layer:      engine.layer,
      bio:        engine.bio_function,
      output:     data.output     ?? null,
      provenance: data.provenance ?? null,
      proof:      data.proof      ?? null,
      error:      data.error,
    };
  } catch (err) {
    return {
      ok: false,
      engine_id: payload.engine_id,
      layer: engine.layer,
      bio: engine.bio_function,
      output: null,
      provenance: null,
      proof: null,
      error: String(err),
    };
  }
}

// ─── WIRE DISPATCH ────────────────────────────────────────────────────────────
// Runs a cross-engine wire. Source engine produces output; this function
// re-dispatches the relevant payload to the target engine via gate-uuay.
// Source and target never communicate directly.

export async function wire(
  from_engine_id: string,
  to_engine_id:   string,
  payload_key:    string,
  source_output:  Record<string, unknown>,
): Promise<DispatchResult> {
  const target = getEngine(to_engine_id);
  if (!target) {
    return {
      ok: false,
      engine_id: to_engine_id,
      layer: null,
      bio: 'UNKNOWN',
      output: null,
      provenance: null,
      proof: null,
      error: `Wire target not found: ${to_engine_id}`,
    };
  }

  // Build the p_vector for the target from the source output
  const wire_p_vector: Record<string, unknown> = {
    ...(target.p_vector ?? {}),
    [payload_key]: source_output[payload_key] ?? source_output,
    _wire_from: from_engine_id,
  };

  return dispatch({
    engine_id: to_engine_id,
    p_vector:  wire_p_vector,
    caller:    from_engine_id,
  });
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────

export async function routerHealth(): Promise<{
  gate_uuay:       boolean;
  routed_engines:  number;
  gate_url:        string;
}> {
  let gate_ok = false;
  try {
    const res = await fetch(`${GATE_UUAY_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    gate_ok = res.ok;
  } catch { /* gate unreachable */ }

  return {
    gate_uuay:      gate_ok,
    routed_engines: getRoutedEngines().length,
    gate_url:       GATE_UUAY_BASE,
  };
}
