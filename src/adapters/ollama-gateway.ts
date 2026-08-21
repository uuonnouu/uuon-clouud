/**
 * Ollama Gateway — with AIBH Compression Field
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 * License: USAL-1.0
 *
 * Pipeline:
 *   RSS feeds → WorldContext → AIBH field analysis → prompt → Ollama
 */

import { WorldMonitorAdapter } from './worldmonitor-adapter.ts';
import type { WorldContext } from './worldmonitor-adapter.ts';

const OLLAMA_BASE   = process.env.OLLAMA_URL   ?? 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL ?? 'gemma3';

let fieldAdapter: import('./compression-field-adapter.ts').CompressionFieldAdapter | null = null;

async function getFieldAdapter() {
  if (fieldAdapter) return fieldAdapter;
  try {
    const { CompressionFieldAdapter } = await import('./compression-field-adapter.ts');
    fieldAdapter = new CompressionFieldAdapter();
    return fieldAdapter;
  } catch { return null; }
}

const CLOUUD_SYSTEM = `You are a reasoning interface for CLOUUD — a living computational system built by UUON Foundation Inc. (Phillip Aguilar Ruiz III). CLOUUD processes live world data through the AIBH Compression Field Engine, classifying information by Shannon entropy and gravitational zone. Use field state to prioritize which events deserve deeper analysis. Be precise. Do not fabricate events or sources. If world context is unavailable, say so clearly.`;

async function buildPrompt(question: string, ctx: WorldContext): Promise<string> {
  const blocks: string[] = [];

  if (ctx.wm_available) {
    blocks.push(
      `=== LIVE WORLD CONTEXT (${ctx.fetched_at}) ===`,
      `Events: ${ctx.event_count} | Categories: ${ctx.categories_present.join(', ')}`,
      ctx.compressed_summary,
      '=== END WORLD CONTEXT ===',
    );
  } else {
    blocks.push('=== WORLD CONTEXT: RSS feeds unavailable ===');
  }

  const adapter = await getFieldAdapter();
  if (adapter && ctx.wm_available) {
    try {
      const field = adapter.analyze(ctx);
      blocks.push('', field.field_summary);
    } catch { /* engine.js absent — degrade gracefully */ }
  }

  try {
    const topo = await fetch('https://gate-uuay-production.up.railway.app/v1/registry/topology', {
      signal: AbortSignal.timeout(3000)
    });
    if (topo.ok) {
      const topoJson = await topo.json();
      blocks.push('', '=== LIVE ENGINE STATE ===', JSON.stringify(topoJson, null, 2), '=== END ENGINE STATE ===');
    }
  } catch { /* gate-uuay unavailable — degrade gracefully */ }

  blocks.push('', `User question: ${question}`);
  return blocks.join('\n');
}

async function* streamOllama(prompt: string, model: string, system: string): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, system, prompt, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line) as { response?: string; done?: boolean };
        if (json.response) yield json.response;
        if (json.done) return;
      } catch { /* partial line */ }
    }
  }
}

export interface AskOptions {
  model?: string;
  injectWorldContext?: boolean;
  injectClouudSystem?: boolean;
}

export const OllamaGateway = {
  async *ask(question: string, opts: AskOptions = {}): AsyncGenerator<string> {
    const { model = DEFAULT_MODEL, injectWorldContext = true, injectClouudSystem = true } = opts;
    const ctx: WorldContext = injectWorldContext
      ? await WorldMonitorAdapter.getContext()
      : { fetched_at: new Date().toISOString(), event_count: 0, top_events: [], categories_present: [], compressed_summary: '', wm_available: false };
    const prompt = await buildPrompt(question, ctx);
    const system = injectClouudSystem ? CLOUUD_SYSTEM : '';
    yield* streamOllama(prompt, model, system);
  },

  async askSync(question: string, opts: AskOptions = {}): Promise<string> {
    const chunks: string[] = [];
    for await (const chunk of this.ask(question, opts)) chunks.push(chunk);
    return chunks.join('');
  },

  async listModels(): Promise<string[]> {
    try {
      const res  = await fetch(`${OLLAMA_BASE}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json() as { models?: { name: string }[] };
      return (data.models ?? []).map(m => m.name);
    } catch { return []; }
  },
};
