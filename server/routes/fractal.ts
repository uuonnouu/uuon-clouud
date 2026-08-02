/**
 * UUON Recursive Fractal Engine — API Routes
 * Phillip Aguilar Ruiz III / UUON Foundation Inc.
 * USAL-1.0
 *
 * POST /api/fractal/render  → PNG (requires sharp)
 * POST /api/fractal/field   → Float32Array binary (escape values)
 * POST /api/fractal/seed    → store named parameter seed
 * GET  /api/fractal/seed/:id → retrieve named parameter seed
 */

import { Router, Request, Response } from 'express';
import { generateField, iterate, colorPixel, FractalParams } from '../lib/fractal-pipeline';

const router = Router();

// ── Param validation ──────────────────────────────────────────────────────────

function validateParams(body: any): { params: FractalParams; error?: string } {
  const p = body as Partial<FractalParams>;

  const clamp = (v: any, lo: number, hi: number, def: number): number => {
    const n = typeof v === 'number' ? v : def;
    return Math.max(lo, Math.min(hi, n));
  };

  const params: FractalParams = {
    mode:          clamp(p.mode,          0,  1,   0),
    generator:     clamp(p.generator,     0,  15,  0),
    pretransform:  clamp(p.pretransform,  0,  21,  0),
    posttransform: clamp(p.posttransform, 0,  10,  0),
    iter:          clamp(p.iter,          16, 512, 144),
    escape:        clamp(p.escape,        2,  16,  4),
    power:         clamp(p.power,         1,  4,   2),
    pa:            clamp(p.pa,           -4,  4,   0),
    pb:            clamp(p.pb,           -4,  4,   0),
    symk:          clamp(p.symk,          1,  12,  1),
    sym_rot:       clamp(p.sym_rot,       0,  360, 0),
    tessellation:  clamp(p.tessellation,  0,  1,   0),
    cx:            typeof p.cx === 'number' ? p.cx : -0.5,
    cy:            typeof p.cy === 'number' ? p.cy : 0,
    zoom:          clamp(p.zoom,         -3,  12,  0),
    julia_re:      typeof p.julia_re === 'number' ? p.julia_re : -0.7269,
    julia_im:      typeof p.julia_im === 'number' ? p.julia_im : 0.1889,
    coloring:      clamp(p.coloring,      0,  19,  0),
    palette:       clamp(p.palette,       0,  10,  4),
    width:         clamp(p.width,         64, 2048, 512),
    height:        clamp(p.height,        64, 2048, 512),
    cycles:        clamp(p.cycles ?? 1,   0.5, 3,  1),
    col_offset:    clamp(p.col_offset ?? 0, 0, 1,  0),
    col_phase:     clamp(p.col_phase ?? 0,  0, 1,  0),
    contrast:      clamp(p.contrast ?? 0.65, 0.3, 2, 0.65),
    smooth:        (p.smooth  ?? 1) ? 1 : 0,
    invert:        (p.invert  ?? 0) ? 1 : 0,
    interior:      (p.interior ?? 0) ? 1 : 0,
  };

  return { params };
}

// ── POST /api/fractal/field ───────────────────────────────────────────────────
// Returns raw Float32Array of normalized escape values [0,1] per pixel.
// width × height floats, row-major, top-left origin.
// Useful as heightmap data, texture masks, or ML training input.

router.post('/field', (req: Request, res: Response) => {
  try {
    const { params, error } = validateParams(req.body);
    if (error) return res.status(400).json({ error });

    const field  = generateField(params);
    const buffer = Buffer.from(field.buffer);

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('X-Field-Width',  String(params.width));
    res.setHeader('X-Field-Height', String(params.height));
    res.setHeader('X-Field-Encoding', 'float32-normalized-escape');
    res.setHeader('X-UUON-Engine', 'recursive-fractal-engine@1.0.0');
    res.send(buffer);
  } catch (e: any) {
    console.error('[fractal/field]', e);
    res.status(500).json({ error: 'Field generation failed', detail: e?.message });
  }
});

// ── POST /api/fractal/render ──────────────────────────────────────────────────
// Returns PNG image. Requires `sharp` — falls back to JSON field if unavailable.

router.post('/render', async (req: Request, res: Response) => {
  try {
    const { params, error } = validateParams(req.body);
    if (error) return res.status(400).json({ error });

    const { width, height } = params;
    const aspect = width / height;
    const scale  = 3.0 / Math.pow(2, params.zoom);

    // Build RGBA pixel buffer
    const rgba = Buffer.alloc(width * height * 4);

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        const ux = px / width;
        const uy = 1 - py / height;
        const wx = (ux - 0.5) * aspect * scale + params.cx;
        const wy = (uy - 0.5)          * scale + params.cy;

        const result = iterate(wx, wy, params);
        const [r, g, b] = colorPixel(result, params);

        const i = (py * width + px) * 4;
        rgba[i]   = Math.round(Math.max(0, Math.min(1, r)) * 255);
        rgba[i+1] = Math.round(Math.max(0, Math.min(1, g)) * 255);
        rgba[i+2] = Math.round(Math.max(0, Math.min(1, b)) * 255);
        rgba[i+3] = 255;
      }
    }

    // Try sharp for PNG encoding
    try {
      const sharp = await import('sharp');
      const png = await sharp.default(rgba, { raw: { width, height, channels: 4 } })
        .png({ compressionLevel: 6 })
        .toBuffer();

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('X-UUON-Engine', 'recursive-fractal-engine@1.0.0');
      res.setHeader('X-Fractal-Generator', String(params.generator));
      res.setHeader('X-Fractal-Coloring',  String(params.coloring));
      res.send(png);
    } catch (_sharpErr) {
      // sharp not installed — return raw RGBA as binary with headers describing format
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('X-Image-Format', 'raw-rgba');
      res.setHeader('X-Image-Width',  String(width));
      res.setHeader('X-Image-Height', String(height));
      res.setHeader('X-UUON-Engine',  'recursive-fractal-engine@1.0.0');
      res.setHeader('X-Sharp-Missing', 'true');
      res.send(rgba);
    }
  } catch (e: any) {
    console.error('[fractal/render]', e);
    res.status(500).json({ error: 'Render failed', detail: e?.message });
  }
});

// ── POST /api/fractal/seed ────────────────────────────────────────────────────
// Store a named parameter seed. Requires DATABASE_URL in env.

router.post('/seed', async (req: Request, res: Response) => {
  try {
    const { params, error } = validateParams(req.body);
    if (error) return res.status(400).json({ error });

    const name      = typeof req.body.name === 'string' ? req.body.name.slice(0, 120) : null;
    const timestamp = new Date().toISOString();
    const id        = `rfe_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Store in DB if available
    if (process.env.DATABASE_URL) {
      try {
        const { neon } = await import('@neondatabase/serverless');
        const sql = neon(process.env.DATABASE_URL);
        await sql`
          CREATE TABLE IF NOT EXISTS fractal_seeds (
            id          TEXT PRIMARY KEY,
            name        TEXT,
            params      JSONB NOT NULL,
            created_at  TIMESTAMPTZ DEFAULT NOW()
          )
        `;
        await sql`
          INSERT INTO fractal_seeds (id, name, params)
          VALUES (${id}, ${name}, ${JSON.stringify(params)})
        `;
      } catch (dbErr: any) {
        console.warn('[fractal/seed] DB write failed (non-fatal):', dbErr?.message);
      }
    }

    res.json({ id, name, timestamp, params });
  } catch (e: any) {
    console.error('[fractal/seed]', e);
    res.status(500).json({ error: 'Seed storage failed', detail: e?.message });
  }
});

// ── GET /api/fractal/seed/:id ─────────────────────────────────────────────────

router.get('/seed/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!process.env.DATABASE_URL) {
      return res.status(503).json({ error: 'Seed registry unavailable — no DATABASE_URL configured' });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT * FROM fractal_seeds WHERE id = ${id} LIMIT 1`;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Seed not found', id });
    }

    res.json(rows[0]);
  } catch (e: any) {
    console.error('[fractal/seed GET]', e);
    res.status(500).json({ error: 'Seed retrieval failed', detail: e?.message });
  }
});

// ── GET /api/fractal/info ─────────────────────────────────────────────────────

router.get('/info', (_req: Request, res: Response) => {
  res.json({
    engine:      'UUON Recursive Fractal Engine',
    version:     '1.0.0',
    author:      'Phillip Aguilar Ruiz III / UUON Foundation Inc.',
    license:     'USAL-1.0',
    repo:        'github.com/UUON-Foundation/recursive-fractal-engine',
    npm:         '@uuon-foundation/recursive-fractal-engine',
    generators:  16,
    pretransforms: 22,
    posttransforms: 11,
    coloring_modes: 20,
    palettes:    11,
    total_systems: '7744',
    endpoints: {
      field:  'POST /api/fractal/field  → Float32Array escape values',
      render: 'POST /api/fractal/render → PNG image',
      seed:   'POST /api/fractal/seed   → store named parameter seed',
      get:    'GET  /api/fractal/seed/:id → retrieve named parameter seed',
    }
  });
});

export default router;
