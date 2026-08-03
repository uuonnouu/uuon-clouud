/**
 * Ollama Gateway
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Wraps Ollama's local API with:
 *  1. WorldMonitor context injection (live world state prepended to every prompt)
 *  2. Streaming support
 *  3. UUON project memory injection (clouud ecosystem context)
 *
 * Usage:
 *   import { OllamaGateway } from './ollama-gateway';
 *   const stream = OllamaGateway.ask('What is happening in the Taiwan Strait?');
 *   for await (const chunk of stream) process.stdout.write(chunk);
 */

import { WorldMonitorAdapter, WorldContext } from './worldmonitor-adapter';

const OLLAMA_BASE = process.env.OLLAMA_URL ?? 'http://localhost:11434';
const DEFAULT_MODEL = process.env.OLLAMA_MODEL ?? 'gemma3';

// ── UUON system context ───────────────────────────────────────────────────────
// Injected into every prompt so the model has project awareness.
// Keep this under 300 chars — it's background, not foreground.

const CLOUUD_SYSTEM = `You are a reasoning interface for CLOUUD — a living computational system built by UUON Foundation Inc. (Phillip Aguilar Ruiz III). CLOUUD models natural form mathematically. You receive live world context from WorldMonitor. Use it where relevant. Be precise. Cite sources if available.`;

// ── Prompt builder ────────────────────────────────────────────────────────────

function buildPrompt(userQuestion: string, worldCtx: WorldContext): string {
  const ctxBlock = worldCtx.wm_available
    ? `=== LIVE WORLD CONTEXT (WorldMonitor — ${worldCtx.fetched_at}) ===\nEvents captured: ${worldCtx.event_count}\n${worldCtx.compressed_summary}\n=== END CONTEXT ===\n\n`
    : `=== WORLD CONTEXT: WorldMonitor unavailable at ${worldCtx.fetched_at} ===\n\n`;

  return `${ctxBlock}User question: ${userQuestion}`;
}

// ── Ollama streaming iterator ─────────────────────────────────────────────────

async function* streamOllama(
  prompt: string,
  model: string,
  system: string,
): AsyncGenerator<string> {
  const res = await fetch(`${OLLAMA_BASE}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      system,
      prompt,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Ollama error: ${res.status} ${res.statusText}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    // Ollama streams one JSON object per line
    for (const line of text.split('\n')) {
      if (!line.trim()) continue;
      try {
        const json = JSON.parse(line) as { response?: string; done?: boolean };
        if (json.response) yield json.response;
        if (json.done) return;
      } catch {
        // partial line — will be completed next chunk
      }
    }
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface AskOptions {
  model?: string;
  injectWorldContext?: boolean;   // default: true
  injectClouudSystem?: boolean;   // default: true
}

export const OllamaGateway = {
  /**
   * Ask a question. Returns an async generator of text chunks (streaming).
   *
   *   for await (const chunk of OllamaGateway.ask('...')) {
   *     process.stdout.write(chunk);
   *   }
   */
  async *ask(
    question: string,
    opts: AskOptions = {},
  ): AsyncGenerator<string> {
    const {
      model = DEFAULT_MODEL,
      injectWorldContext = true,
      injectClouudSystem = true,
    } = opts;

    const worldCtx: WorldContext = injectWorldContext
      ? await WorldMonitorAdapter.getContext()
      : {
          fetched_at: new Date().toISOString(),
          event_count: 0,
          top_events: [],
          categories_present: [],
          compressed_summary: '',
          wm_available: false,
        };

    const prompt = buildPrompt(question, worldCtx);
    const system = injectClouudSystem ? CLOUUD_SYSTEM : '';

    yield* streamOllama(prompt, model, system);
  },

  /**
   * Non-streaming version. Returns full response as a string.
   */
  async askSync(question: string, opts: AskOptions = {}): Promise<string> {
    const chunks: string[] = [];
    for await (const chunk of this.ask(question, opts)) {
      chunks.push(chunk);
    }
    return chunks.join('');
  },

  /**
   * List available local models.
   */
  async listModels(): Promise<string[]> {
    try {
      const res = await fetch(`${OLLAMA_BASE}/api/tags`);
      if (!res.ok) return [];
      const data = (await res.json()) as { models?: { name: string }[] };
      return (data.models ?? []).map(m => m.name);
    } catch {
      return [];
    }
  },
};
