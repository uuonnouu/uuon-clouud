/**
 * clouud — WorldMonitor + Ollama API Routes
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Mount these routes in your existing uuon-clouud Express server:
 *
 *   import worldmonitorRoutes from './routes/worldmonitor';
 *   app.use('/api/world', worldmonitorRoutes);
 *
 * Endpoints:
 *   GET  /api/world/status        — WorldMonitor + Ollama health
 *   GET  /api/world/context       — Raw live world context (JSON)
 *   POST /api/world/ask           — Ask Ollama with world context injected
 *   POST /api/world/ask/stream    — Same, streamed (SSE)
 */

import { Router, Request, Response } from 'express';
import { WorldMonitorAdapter } from '../adapters/worldmonitor-adapter';
import { OllamaGateway } from '../adapters/ollama-gateway';

const router = Router();

// ── GET /api/world/status ─────────────────────────────────────────────────────

router.get('/status', async (_req: Request, res: Response) => {
  const [wmAvailable, models] = await Promise.all([
    WorldMonitorAdapter.isAvailable(),
    OllamaGateway.listModels(),
  ]);

  res.json({
    worldmonitor: {
      available: wmAvailable,
      url: process.env.WORLDMONITOR_URL ?? 'http://localhost:3000',
    },
    ollama: {
      available: models.length > 0,
      models,
      url: process.env.OLLAMA_URL ?? 'http://localhost:11434',
    },
    clouud: {
      version: process.env.npm_package_version ?? '1.0.0',
      timestamp: new Date().toISOString(),
    },
  });
});

// ── GET /api/world/context ────────────────────────────────────────────────────

router.get('/context', async (_req: Request, res: Response) => {
  try {
    const ctx = await WorldMonitorAdapter.getContext();
    res.json(ctx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch world context', detail: String(err) });
  }
});

// ── POST /api/world/ask ───────────────────────────────────────────────────────
// Body: { question: string, model?: string }
// Returns: { answer: string, world_context_used: boolean, event_count: number }

router.post('/ask', async (req: Request, res: Response) => {
  const { question, model } = req.body as { question?: string; model?: string };

  if (!question?.trim()) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  try {
    const answer = await OllamaGateway.askSync(question, { model });
    const ctx = await WorldMonitorAdapter.getContext();

    res.json({
      answer,
      world_context_used: ctx.wm_available,
      event_count: ctx.event_count,
      model: model ?? process.env.OLLAMA_MODEL ?? 'gemma3',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: 'Ollama error', detail: String(err) });
  }
});

// ── POST /api/world/ask/stream ────────────────────────────────────────────────
// Body: { question: string, model?: string }
// Returns: Server-Sent Events stream
// Client: const es = new EventSource('/api/world/ask/stream', { method: 'POST', ... });

router.post('/ask/stream', async (req: Request, res: Response) => {
  const { question, model } = req.body as { question?: string; model?: string };

  if (!question?.trim()) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    for await (const chunk of OllamaGateway.ask(question, { model })) {
      send('token', { text: chunk });
    }
    send('done', { timestamp: new Date().toISOString() });
  } catch (err) {
    send('error', { message: String(err) });
  } finally {
    res.end();
  }
});

export default router;
