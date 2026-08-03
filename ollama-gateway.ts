/**
 * Ollama Gateway — with AIBH Compression Field
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 * License: USAL-1.0
 */

import { WorldMonitorAdapter } from './worldmonitor-adapter.ts';
import type { WorldContext } from './worldmonitor-adapter.ts';

const OLLAMA_BASE   = process.env.OLLAMA_URL   ?? 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL ?? 'gemma3';

const CLOUUD_SYSTEM = `You are CLOUUD, a reasoning interface built by UUON Foundation Inc. (Phillip Aguilar Ruiz III). Rules you follow without exception: Write in plain prose. No bullet points, no bold text, no headers, no markdown of any kind. Do not fabricate citations, sources, or documents. Use the live world context provided to ground your responses. Be precise and concise. One clear paragraph per idea. No filler sentences. Code and math are exceptions — format those correctly.`;

async function buildPrompt(question: string, ctx: WorldContext): Promise<string> {
  const blocks: string[] = [];
  if (ctx.wm_available) {
    blocks.push(`=== LIVE WORLD CONTEXT (${ctx.fetched_at}) ===`, `Events: ${ctx.event_count}`, ctx.compressed_summary, '=== END ===');
  } else {
    blocks.push('=== WORLD CONTEXT: unavailable ===');
  }
  blocks.push('', `User question: ${question}`);
  return blocks.join('\n');
}

async function* streamOllama(prompt: string, model: string, system: string): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, system, prompt, stream: true }),
  });
  if (!res.ok || !res.body) throw new Error(`Ollama error: ${res.status}`);
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    for (const line of decoder.decode(value, { stream: true }).split('\n')) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line) as { response?: string; done?: boolean };
        if (json.response) yield json.response;
        if (json.done) return;
      } catch { /* partial */ }
    }
  }
}

export interface AskOptions { model?: string; injectWorldContext?: boolean; }

export const OllamaGateway = {
  async *ask(question: string, opts: AskOptions = {}): AsyncGenerator<string> {
    const { model = DEFAULT_MODEL, injectWorldContext = true } = opts;
    const ctx: WorldContext = injectWorldContext
      ? await WorldMonitorAdapter.getContext()
      : { fetched_at: new Date().toISOString(), event_count: 0, top_events: [], categories_present: [], compressed_summary: '', wm_available: false };
    yield* streamOllama(await buildPrompt(question, ctx), model, CLOUUD_SYSTEM);
  },
  async askSync(question: string, opts: AskOptions = {}): Promise<string> {
    const chunks: string[] = [];
    for await (const chunk of this.ask(question, opts)) chunks.push(chunk);
    return chunks.join('');
  },
  async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${OLLAMA_BASE}/api/tags`);
      if (!res.ok) return [];
      const data = await res.json() as { models?: { name: string }[] };
      return (data.models ?? []).map(m => m.name);
    } catch { return []; }
  },
};
