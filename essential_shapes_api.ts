/**
 * UUON Foundation — Essential Shapes API  (was empty)
 *
 * Lightweight public-read endpoint that returns:
 *   GET /api/essential-shapes              — paginated shape list with equation flags
 *   GET /api/essential-shapes/:shape_type  — single shape with full equation metadata
 *   GET /api/essential-shapes/stats        — coverage + mint stats for dashboards
 *
 * No auth required for reads. Minting endpoints still require x-api-key.
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { Router, Request, Response } from "express";
import { neon } from "@neondatabase/serverless";

const router = Router();

function getSQL() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// ── Placeholder detection (mirrors deploy-and-mint-v2 logic) ─────────────────
const PLACEHOLDER_EQ = new Set(["u", "v", "0", "undefined", "null", "", "MISSING"]);

function isRealEquation(eq: string | null): boolean {
  return !!eq && !PLACEHOLDER_EQ.has(eq.trim());
}

// ── GET /api/essential-shapes ─────────────────────────────────────────────────
router.get("/", async (req: Request, res: Response) => {
  try {
    const sql      = getSQL();
    const page     = Math.max(1, parseInt((req.query.page  as string) ?? "1", 10));
    const limit    = Math.min(200, Math.max(1, parseInt((req.query.limit as string) ?? "50", 10)));
    const offset   = (page - 1) * limit;
    const category = (req.query.category as string) ?? null;
    const verified = req.query.verified === "true" ? true : null;

    const rows = await sql`
      SELECT
        r.id,
        r.shape_type,
        r.display_name,
        r.category,
        r.subcategory,
        r.source,
        r.mint_status,
        r.priority,
        CASE
          WHEN f.equation_x_formula IS NOT NULL
           AND f.equation_x_formula NOT IN ('u','v','0','undefined','','MISSING')
          THEN true ELSE false
        END AS has_equation,
        COALESCE(f.is_verified, false) AS is_verified,
        COALESCE(f.complexity_score, 0) AS complexity_score,
        COALESCE(f.mathematical_foundation, '') AS math_foundation
      FROM complete_shape_registry r
      LEFT JOIN formula_implementations f ON f.shape_type = r.shape_type
      WHERE r.is_active = true
        ${category ? sql`AND r.category = ${category}` : sql``}
        ${verified === true ? sql`AND COALESCE(f.is_verified, false) = true` : sql``}
      ORDER BY r.priority DESC, r.id ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) AS n
      FROM complete_shape_registry
      WHERE is_active = true
        ${category ? sql`AND category = ${category}` : sql``}
    `;

    res.json({
      success:  true,
      page,
      limit,
      total:    parseInt((total[0] as any).n),
      shapes:   rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/essential-shapes/stats ──────────────────────────────────────────
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const sql = getSQL();

    const [reg, fi, withEq, minted, verified, categories] = await Promise.all([
      sql`SELECT COUNT(*) AS n FROM complete_shape_registry WHERE is_active = true`,
      sql`SELECT COUNT(*) AS n FROM formula_implementations`,
      sql`
        SELECT COUNT(*) AS n FROM formula_implementations
        WHERE equation_x_formula IS NOT NULL
          AND equation_x_formula NOT IN ('u','v','0','undefined','','MISSING')
          AND equation_y_formula IS NOT NULL
          AND equation_y_formula NOT IN ('u','v','0','undefined','','MISSING')
      `,
      sql`SELECT COUNT(*) AS n FROM complete_shape_registry WHERE mint_status = 'minted'`,
      sql`SELECT COUNT(*) AS n FROM formula_implementations WHERE is_verified = true`,
      sql`
        SELECT category, COUNT(*) AS n
        FROM complete_shape_registry
        WHERE is_active = true
        GROUP BY category
        ORDER BY COUNT(*) DESC
        LIMIT 20
      `,
    ]);

    const totalReg   = parseInt((reg[0]      as any).n);
    const totalFI    = parseInt((fi[0]       as any).n);
    const totalEq    = parseInt((withEq[0]   as any).n);
    const totalMint  = parseInt((minted[0]   as any).n);
    const totalVerif = parseInt((verified[0] as any).n);

    res.json({
      success:             true,
      registry_total:      totalReg,
      formula_total:       totalFI,
      equation_coverage:   `${Math.round((totalEq / Math.max(totalFI, 1)) * 100)}%`,
      verified_shapes:     totalVerif,
      minted_shapes:       totalMint,
      pending_mint:        totalReg - totalMint,
      categories:          categories,
      timestamp:           new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET /api/essential-shapes/:shape_type ─────────────────────────────────────
router.get("/:shape_type", async (req: Request, res: Response) => {
  try {
    const sql        = getSQL();
    const shapeType  = req.params.shape_type;

    const rows = await sql`
      SELECT
        r.id,
        r.shape_type,
        r.display_name,
        r.category,
        r.subcategory,
        r.description,
        r.source,
        r.mint_status,
        r.priority,
        r.seo_keywords,
        r.canonical_url,
        r.created_at,
        r.updated_at,
        -- equation fields
        f.equation_x_formula,
        f.equation_y_formula,
        f.equation_z_formula,
        f.default_parameters,
        f.mathematical_foundation,
        f.complexity_score,
        f.security_level,
        COALESCE(f.is_verified, false) AS is_verified,
        -- token ledger
        l.token_id,
        l.token_uri,
        l.on_chain_status,
        l.on_chain_contract
      FROM complete_shape_registry r
      LEFT JOIN formula_implementations f ON f.shape_type = r.shape_type
      LEFT JOIN shape_token_ledger l       ON l.shape_type = r.shape_type
      WHERE r.shape_type = ${shapeType}
        AND r.is_active  = true
      LIMIT 1
    `;

    if (!rows.length) {
      return res.status(404).json({ success: false, error: `Shape "${shapeType}" not found` });
    }

    const row = rows[0] as any;
    const hasEquation =
      isRealEquation(row.equation_x_formula) &&
      isRealEquation(row.equation_y_formula) &&
      isRealEquation(row.equation_z_formula);

    res.json({
      success:     true,
      shape:       {
        ...row,
        has_equation: hasEquation,
        // Don't expose raw equation strings on public endpoint — only flag
        equation_x_formula: hasEquation ? "[PROTECTED]" : null,
        equation_y_formula: hasEquation ? "[PROTECTED]" : null,
        equation_z_formula: hasEquation ? "[PROTECTED]" : null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;