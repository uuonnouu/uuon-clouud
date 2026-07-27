import { Router } from 'express';
import { neon } from '@neondatabase/serverless';

const router = Router();

const getClouudDB = () => neon(process.env.DATABASE_URL!);
const getDmensionDB = () => neon(process.env.CLEAN_DB!);

// ── MATHEMATICAL CONSTANTS ──────────────────────────────────────────
router.get('/constants', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`
      SELECT symbol, name, value, value_text, units, category, description, domain, earth_link
      FROM mathematical_constants
      ORDER BY category, name
    `;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/constants/:symbol', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`
      SELECT * FROM mathematical_constants
      WHERE symbol = ${req.params.symbol} OR name ILIKE ${req.params.symbol}
      LIMIT 1
    `;
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Constant not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── BLOCKCHAIN ALGORITHMS ───────────────────────────────────────────
router.get('/algorithms', async (req, res) => {
  try {
    const sql = getClouudDB();
    const { category } = req.query;
    const rows = category
      ? await sql`SELECT * FROM "uuon-blockchain-algorithms" WHERE category = ${category as string} ORDER BY "algorithm-name"`
      : await sql`SELECT * FROM "uuon-blockchain-algorithms" ORDER BY category, "algorithm-name"`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/algorithms/:id', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`
      SELECT a.*, json_agg(json_build_object('metric', m."metric-name", 'value', m."metric-value")) AS metrics
      FROM "uuon-blockchain-algorithms" a
      LEFT JOIN "uuon-algorithm-metrics" m ON m."algorithm-id" = a."algorithm-id"
      WHERE a."algorithm-id" = ${req.params.id}
      GROUP BY a.id
      LIMIT 1
    `;
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Algorithm not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── SHAPES ──────────────────────────────────────────────────────────
router.get('/shapes', async (req, res) => {
  try {
    const sql = getClouudDB();
    const { category, limit = '20', offset = '0' } = req.query;
    const rows = category
      ? await sql`SELECT shape_id, name, category, formula, earth_link FROM dmension_shapes WHERE category = ${category as string} ORDER BY shape_id::int LIMIT ${parseInt(limit as string)} OFFSET ${parseInt(offset as string)}`
      : await sql`SELECT shape_id, name, category, formula, earth_link FROM dmension_shapes ORDER BY shape_id::int LIMIT ${parseInt(limit as string)} OFFSET ${parseInt(offset as string)}`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/shapes/:id', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`
      SELECT * FROM dmension_shapes
      WHERE shape_id = ${req.params.id} OR name ILIKE ${req.params.id}
      LIMIT 1
    `;
    if (!rows[0]) return res.status(404).json({ success: false, error: 'Shape not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PATTERNS ────────────────────────────────────────────────────────
router.get('/patterns', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM patterns ORDER BY id`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/pattern-parameters', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM pattern_parameters ORDER BY id`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── UINVERSE IDEAS ──────────────────────────────────────────────────
router.get('/ideas', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM uinverse_ideas ORDER BY id`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── CREATOR PROFILE ─────────────────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM creator_profile ORDER BY id`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GCENTRIC VERSIONS ───────────────────────────────────────────────
router.get('/gcentric', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM gcentric_versions ORDER BY id`;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── PROOF BASELINE ──────────────────────────────────────────────────
router.get('/proof-baseline', async (req, res) => {
  try {
    const sql = getClouudDB();
    const rows = await sql`SELECT * FROM proof01_baseline LIMIT 1`;
    res.json({ success: true, data: rows[0] || null });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── DMENSION REGISTRY (minting metadata) ───────────────────────────
router.get('/registry', async (req, res) => {
  try {
    const sql = getDmensionDB();
    const { limit = '20', offset = '0' } = req.query;
    const rows = await sql`
      SELECT id, shape_type, display_name, category, render_png_cid, render_html_cid,
             CASE WHEN equation_js IS NOT NULL THEN true ELSE false END AS has_equation
      FROM complete_shape_registry
      ORDER BY id
      LIMIT ${parseInt(limit as string)} OFFSET ${parseInt(offset as string)}
    `;
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/registry/stats', async (req, res) => {
  try {
    const sql = getDmensionDB();
    const rows = await sql`
      SELECT 
        COUNT(*) AS total,
        COUNT(render_png_cid) AS has_png,
        COUNT(render_html_cid) AS has_html,
        COUNT(equation_js) AS has_equation
      FROM complete_shape_registry
    `;
    res.json({ success: true, data: rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── INDEX ───────────────────────────────────────────────────────────
router.get('/', (_req, res) => {
  res.json({
    name: 'UUON Internal Knowledge API',
    version: '1.0.0',
    endpoints: [
      'GET /api/knowledge/constants',
      'GET /api/knowledge/constants/:symbol',
      'GET /api/knowledge/algorithms',
      'GET /api/knowledge/algorithms/:id',
      'GET /api/knowledge/shapes',
      'GET /api/knowledge/shapes/:id',
      'GET /api/knowledge/patterns',
      'GET /api/knowledge/pattern-parameters',
      'GET /api/knowledge/ideas',
      'GET /api/knowledge/profile',
      'GET /api/knowledge/gcentric',
      'GET /api/knowledge/proof-baseline',
      'GET /api/knowledge/registry',
      'GET /api/knowledge/registry/stats',
    ]
  });
});

export default router;
