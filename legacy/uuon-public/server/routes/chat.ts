import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { openApiSpec } from '../openapi';

const router = Router();

// ── Rate limiter — 10/min (Clouud's limit is 15/min, we stay safely under) ──
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Rate limit exceeded — 10 requests per minute per IP' },
});

// ── Prompt injection guard ────────────────────────────────────────────────────
const INJECTION_PATTERNS = [
  /system\s*:/i,
  /<\/?(?:inst|sys|s|system)\b/i,
  /ignore\s+(?:previous|above|all)\s+instructions/i,
  /you\s+are\s+now/i,
  /forget\s+(?:your|all|the)\s+(?:instructions|rules|context)/i,
];

function sanitize(input: string): string {
  let s = input.trim();
  for (const p of INJECTION_PATTERNS) s = s.replace(p, '[removed]');
  return s;
}

// ── Universe Advisor system context injected as the opening message ───────────
const ENDPOINT_LIST = Object.entries(openApiSpec.paths)
  .map(([path, methods]: [string, any]) =>
    Object.entries(methods)
      .map(([m, op]: [string, any]) => `  ${m.toUpperCase()} /api${path} — ${op.summary}`)
      .join('\n')
  )
  .join('\n');

const UNIVERSE_ADVISOR_CONTEXT = `You are the Universe Advisor for Δmension (also written Dmension) — the mathematical infrastructure for virtual worlds.

Your role: guide developers integrating with the Δmension API with precision, clarity, and mathematical depth.

PLATFORM:
Δmension computes 2,650+ mathematically exact 3D shapes from parametric equations. Every shape is built from real mathematics — no approximations. Shapes are controlled by parameters A–Z plus UV domain settings. Results are flat vertex/normal/UV/index arrays compatible with Three.js, Unity, and Unreal Engine.

AUTHENTICATION:
All engine endpoints require X-API-Key header with a dmn_live_* key.
Get a key: POST /api/auth/generate-key (requires login session).
Format: dmn_live_<40 hex chars>

LIVE ENDPOINTS:
${ENDPOINT_LIST}

ENGINES:
- Fractal Engine: 16 shapes including Mandelbrot, Julia, and IFS fractals
- Relativity Engine: General relativity shapes — Schwarzschild metric, Kerr, light cone
- Modulo Engine: Modular arithmetic patterns and prime spirals
- Quantum Engine: Coming soon (IBM hardware integration pending — returns 503)

RESPONSE FORMAT:
All render endpoints return: { vertices, normals, uvs, indices, parameters, metadata }
Vertices/normals/uvs are flat Float32 arrays. Indices are triangle face indices.

ADVISOR RULES:
- Answer only questions about Δmension integration, 3D mathematics, and API usage
- Be precise — include working code examples (curl, JavaScript, Python, Unity C#) when useful
- Reference actual endpoint paths and parameter names
- If a question is outside Δmension scope, redirect to what you can help with
- Never invent endpoints or parameters that don't exist above`;

// ── Clouud client — two-step: create conversation → send message ──────────────
function getClouudBase(): string {
  const base = process.env.CLOUUD_BASE_URL;
  if (!base) throw new Error('CLOUUD_BASE_URL not configured');
  return base.replace(/\/$/, '');
}

async function createConversation(base: string): Promise<number> {
  const res = await fetch(`${base}/api/conversations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Δmension Universe Advisor Session' }),
  });
  if (!res.ok) throw new Error(`Clouud create-conversation failed: ${res.status}`);
  const data: any = await res.json();
  return data.id;
}

async function sendMessage(base: string, conversationId: number, content: string): Promise<string> {
  const res = await fetch(`${base}/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`Clouud send-message failed: ${res.status}`);
  const data: any = await res.json();
  const reply = data?.assistantMessage?.content;
  if (typeof reply !== 'string') throw new Error('Unexpected Clouud response shape');
  return reply;
}

// ── Session-keyed conversation cache (persists for the browser session) ────────
// External API callers (no session) get a fresh conversation each request.
function getSessionConversationId(req: Request): number | null {
  return (req.session as any)?.clouudConversationId ?? null;
}

function setSessionConversationId(req: Request, id: number): void {
  try { (req.session as any).clouudConversationId = id; } catch (_) {}
}

// ── POST /api/chat ─────────────────────────────────────────────────────────────
router.post('/', chatLimiter, async (req: Request, res: Response) => {
  const { message } = req.body ?? {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: 'message must be 500 characters or fewer' });
  }

  const safeMessage = sanitize(message);

  try {
    const base = getClouudBase();
    let conversationId = getSessionConversationId(req);

    if (!conversationId) {
      // New session — create conversation and prime it with Universe Advisor context
      conversationId = await createConversation(base);
      await sendMessage(base, conversationId, UNIVERSE_ADVISOR_CONTEXT);
      setSessionConversationId(req, conversationId);
    }

    const reply = await sendMessage(base, conversationId, safeMessage);
    return res.json({ reply, engine: 'Clouud', conversation_id: conversationId });

  } catch (err: any) {
    const msg: string = err?.message ?? String(err);
    console.error('[chat/clouud]', msg);

    if (msg.includes('CLOUUD_BASE_URL not configured')) {
      return res.status(503).json({
        error: 'Universe Advisor not yet connected',
        hint: 'Set CLOUUD_BASE_URL in Secrets to your Clouud Replit URL',
      });
    }
    return res.status(503).json({ error: 'Universe Advisor temporarily unavailable' });
  }
});

export default router;
