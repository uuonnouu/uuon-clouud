import { Router } from 'express';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { formula_implementations, shape_tokens, complete_shape_registry } from '@shared/schema';
import { count } from 'drizzle-orm';

const router = Router();

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL not set');
  return drizzle(neon(url));
}

function requireAdmin(req: any, res: any, next: any) {
  const user = (req.session as any)?.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/admin/seed-missing-tokens
//
// 1. Calls DatabaseSeeder.seedAllUnifiedShapes() to ensure every shape in the
//    frontend UNIFIED_SHAPES catalog has a formula_implementations row.
// 2. Queries complete_shape_registry for any remaining shapes still missing a
//    formula row (catches registry-only entries that seedAllUnifiedShapes
//    doesn't enumerate).
// 3. Inserts stub formula records for those extra shapes (onConflictDoNothing).
// 4. Calls DatabaseSeeder.incrementalTokenSync() which generates semantic tokens
//    for every formula_implementations row that lacks shape_tokens entries.
// 5. Returns { inserted_formulas, tokens_generated, final_counts }.
// ─────────────────────────────────────────────────────────────────────────────
router.post('/seed-missing-tokens', requireAdmin, async (req, res) => {
  try {
    const db = getDb();

    console.log('🌱 [admin] seed-missing-tokens: starting…');

    // ── Step 1: seed UNIFIED_SHAPES → formula_implementations ────────────────
    // Lazy-import to avoid the startup cost of loading the 329 KB shape library
    const { DatabaseSeeder } = await import('../database-seeder');
    const seeder = new DatabaseSeeder();

    console.log('🌱 [admin] Calling seedAllUnifiedShapes (UNIFIED_SHAPES → formula_implementations)…');
    const unifiedResult = await seeder.seedAllUnifiedShapes();
    console.log(`✅ seedAllUnifiedShapes: +${unifiedResult.seeded} inserted, ${unifiedResult.skipped} skipped`);

    // ── Step 2: registry gap — shapes in complete_shape_registry but still
    //   missing from formula_implementations after seedAllUnifiedShapes ────────
    const registryRows = await db
      .select({ shape_type: complete_shape_registry.shape_type, display_name: complete_shape_registry.display_name, category: complete_shape_registry.category })
      .from(complete_shape_registry);

    const existingFormulas = await db
      .select({ shape_type: formula_implementations.shape_type })
      .from(formula_implementations);
    const existingSet = new Set(existingFormulas.map(r => r.shape_type));

    const registryMissing = registryRows.filter(r => !existingSet.has(r.shape_type));
    console.log(`📊 Registry gap after seedAllUnifiedShapes: ${registryMissing.length} shapes still missing`);

    // ── Step 3: insert stubs for registry-only shapes ─────────────────────────
    const BATCH = 50;
    let extraInserted = 0;
    const now = new Date().toISOString();

    for (let i = 0; i < registryMissing.length; i += BATCH) {
      const batch = registryMissing.slice(i, i + BATCH);
      const records = batch.map(r => {
        const cat = deriveCategory(r.shape_type, r.category);
        return {
          shape_type: r.shape_type,
          formula_name: r.display_name || r.shape_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          equation_function: 'function(u, v, params) { /* See UNIFIED_SHAPES */ }',
          equation_x_formula: 'x(u, v, params)',
          equation_y_formula: 'y(u, v, params)',
          equation_z_formula: 'z(u, v, params)',
          parameter_dependencies: JSON.stringify({ a: ['scale'], b: ['amplitude'], c: ['frequency'] }),
          default_parameters: JSON.stringify({ a: 1.0, b: 1.0, c: 1.0, x: 1.0, y: 1.0, z: 1.0 }),
          uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }),
          segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
          complexity_score: 5,
          category: cat,
          subcategory: cat,
          mathematical_foundation: 'Parametric surface equation',
          implementation_notes: `Auto-seeded from complete_shape_registry: ${r.shape_type}`,
          performance_optimization: 'Standard parametric evaluation',
          visualization_hints: JSON.stringify({ preferred_lighting: 'smooth', recommended_material: 'solid' }),
          copyright_info: 'UUON Foundation Mathematical Library',
          is_verified: false,
          security_level: 'standard',
          created_at: now,
          updated_at: now,
        };
      });

      try {
        await db.insert(formula_implementations).values(records).onConflictDoNothing();
        extraInserted += records.length;
      } catch {
        for (const rec of records) {
          try { await db.insert(formula_implementations).values(rec).onConflictDoNothing(); extraInserted++; } catch { /* skip */ }
        }
      }
    }

    const totalInserted = unifiedResult.seeded + extraInserted;
    console.log(`✅ Formula stubs total: +${unifiedResult.seeded} (UNIFIED) + ${extraInserted} (registry-only) = ${totalInserted}`);

    // ── Step 4: generate tokens for every formula without tokens ──────────────
    // incrementalTokenSync finds ALL formula rows missing shape_tokens entries
    // and calls generateTokensForShape for each — this is the canonical path.
    console.log('🏷️ [admin] Calling incrementalTokenSync…');
    const tokensBefore = Number((await db.select({ c: count() }).from(shape_tokens))[0]?.c ?? 0);
    await seeder.incrementalTokenSync();
    const tokensAfter = Number((await db.select({ c: count() }).from(shape_tokens))[0]?.c ?? 0);
    const tokensGenerated = tokensAfter - tokensBefore;

    // ── Step 5: final count report ────────────────────────────────────────────
    const finalFormulas = Number((await db.select({ c: count() }).from(formula_implementations))[0]?.c ?? 0);
    const shapesWithTokens = (await db.selectDistinct({ st: shape_tokens.shape_type }).from(shape_tokens)).length;

    const summary = {
      success: true,
      inserted_formulas: totalInserted,
      tokens_generated: tokensGenerated,
      final_counts: {
        total_formula_implementations: finalFormulas,
        total_shape_tokens: tokensAfter,
        shapes_with_tokens: shapesWithTokens,
        shapes_missing_tokens: finalFormulas - shapesWithTokens,
      },
    };

    console.log('✅ [admin] seed-missing-tokens complete:', JSON.stringify(summary, null, 2));
    res.json(summary);

  } catch (err: any) {
    console.error('❌ [admin] seed-missing-tokens error:', err);
    res.status(500).json({ success: false, error: err?.message ?? 'Unknown error' });
  }
});

function deriveCategory(shapeType: string, registryCategory: string): string {
  if (registryCategory && registryCategory !== 'general') return registryCategory;
  if (shapeType.includes('medical') || shapeType.includes('ct_') || shapeType.includes('mri_') || shapeType.includes('mpr_')) return 'medical';
  if (shapeType.includes('dna') || shapeType.includes('protein') || shapeType.includes('cell') || shapeType.includes('biological')) return 'biological';
  if (shapeType.includes('quantum') || shapeType.includes('electron') || shapeType.includes('orbital') || shapeType.includes('qubit')) return 'physics';
  if (shapeType.includes('fractal') || shapeType.includes('mandelbrot') || shapeType.includes('julia') || shapeType.includes('burning_ship')) return 'fractal';
  if (shapeType.includes('torus') || shapeType.includes('klein') || shapeType.includes('mobius') || shapeType.includes('manifold')) return 'topology';
  if (shapeType.includes('4d') || shapeType.includes('5d') || shapeType.includes('tesseract') || shapeType.includes('hyper')) return 'hyperdimensional';
  if (shapeType.includes('alchemical') || shapeType.includes('zodiac') || shapeType.includes('chakra') || shapeType.includes('babylonian')) return 'symbolic';
  if (shapeType.includes('thermal') || shapeType.includes('cooling') || shapeType.includes('heat') || shapeType.includes('pue')) return 'engineering';
  if (shapeType.includes('letter_')) return 'linguistic';
  if (shapeType.includes('time_') || shapeType.includes('phenomenon_')) return 'philosophical';
  if (shapeType.includes('attractor') || shapeType.includes('chaos') || shapeType.includes('lorenz')) return 'chaos';
  if (shapeType.includes('string') || shapeType.includes('gravity')) return 'physics';
  if (shapeType.includes('menger') || shapeType.includes('mandelbox') || shapeType.includes('kleinian') || shapeType.includes('ifs')) return 'ifs_fractal';
  if (shapeType.includes('ice_') || shapeType.includes('snowflake')) return 'crystallographic';
  if (shapeType.includes('harmony') || shapeType.includes('symphony')) return 'harmonic';
  if (shapeType.includes('diatom') || shapeType.includes('uuon')) return 'foundational';
  return 'general';
}

export default router;
