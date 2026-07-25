import { Router, Request, Response } from 'express';
import { requireMintAuth } from '../middleware/requireMintAuth';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { shape_tokens, morph_manifold_data, formula_implementations } from '@shared/schema';
import { eq, sql, desc, and, count } from 'drizzle-orm';

const router = Router();
const connectionString = process.env.DATABASE_URL!;
const sqlNeon = neon(connectionString);
const db = drizzle(sqlNeon);

// Get token ecosystem overview
router.get('/ecosystem-overview', async (req, res) => {
  try {
    const tokenStats = await db
      .select({
        token_type: shape_tokens.token_type,
        count: sql`count(*)`.as('count'),
        total_value: sql`sum(weight * 100)`.as('total_value'),
        avg_weight: sql`avg(weight)`.as('avg_weight')
      })
      .from(shape_tokens)
      .groupBy(shape_tokens.token_type)
      .orderBy(desc(sql`count(*)`));

    const totalTokens = await db
      .select({ count: sql`count(*)`.as('count') })
      .from(shape_tokens);

    const totalValue = await db
      .select({ value: sql`sum(weight * 100)`.as('value') })
      .from(shape_tokens);

    res.json({
      success: true,
      ecosystem: {
        total_tokens: totalTokens[0]?.count || 0,
        total_economy_value: totalValue[0]?.value || 0,
        token_categories: tokenStats,
        benefits: [
          'Unified metadata standard across all shapes',
          'Semantic search and discovery',
          'Token-based monetization',
          'AI classification intelligence',
          'Enhanced export capabilities'
        ]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch token ecosystem overview'
    });
  }
});

// Get token benefits by category
router.get('/benefits/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const categoryTokens = await db
      .select()
      .from(shape_tokens)
      .where(eq(shape_tokens.token_type, category))
      .orderBy(desc(shape_tokens.weight))
      .limit(50);

    const benefits = {
      mathematical: {
        primary: 'Advanced mathematical classification',
        value_range: '$10-200',
        applications: ['Research', 'Education', 'Scientific modeling']
      },
      therapeutic: {
        primary: 'Health and wellness applications',
        value_range: '$100-500',
        applications: ['Meditation', 'Healing therapy', 'Energy work']
      },
      scientific: {
        primary: 'Multi-domain scientific utility',
        value_range: '$50-800',
        applications: ['Physics research', 'Biological modeling', 'Engineering']
      },
      parametric: {
        primary: 'Dynamic shape manipulation',
        value_range: '$25-300',
        applications: ['CAD systems', '3D printing', 'Animation']
      }
    };

    res.json({
      success: true,
      category,
      benefits: benefits[category as keyof typeof benefits] || {},
      tokens: categoryTokens,
      count: categoryTokens.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category benefits'
    });
  }
});

// Get high-value tokens
router.get('/high-value-tokens', async (req, res) => {
  try {
    const highValueTokens = await db
      .select({
        shape_type: shape_tokens.shape_type,
        token_value: shape_tokens.token_value,
        token_type: shape_tokens.token_type,
        weight: shape_tokens.weight,
        estimated_value: sql`weight * 150`.as('estimated_value')
      })
      .from(shape_tokens)
      .where(sql`weight > 0.7`)
      .orderBy(desc(shape_tokens.weight))
      .limit(100);

    res.json({
      success: true,
      high_value_tokens: highValueTokens,
      total_high_value: highValueTokens.length,
      economy_insight: 'High-value tokens drive premium shape licensing and AI training data value'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch high-value tokens'
    });
  }
});

// Search tokens by benefit criteria
router.get('/search', async (req, res) => {
  try {
    const { benefit, min_value, category } = req.query;

    let query = db.select().from(shape_tokens);

    if (category) {
      query = query.where(eq(shape_tokens.token_type, category as string));
    }

    if (min_value) {
      query = query.where(sql`weight * 100 >= ${Number(min_value)}`);
    }

    const results = await query.orderBy(desc(shape_tokens.weight)).limit(200);

    res.json({
      success: true,
      search_criteria: { benefit, min_value, category },
      results,
      count: results.length,
      discoverability: 'Shape tokens enable precise discovery based on mathematical and therapeutic properties'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search tokens'
    });
  }
});

// Get all morph manifold data with A/B/C control parameters
router.get('/morph-manifold', async (req, res) => {
  try {
    const morphData = await db
      .select({
        shape_type: morph_manifold_data.shape_type,
        default_a: morph_manifold_data.default_a,
        default_b: morph_manifold_data.default_b,
        default_c: morph_manifold_data.default_c,
        morph_type: morph_manifold_data.morph_type,
        uses_phi: morph_manifold_data.uses_phi,
        transformation_type: morph_manifold_data.transformation_type,
        recommended_segments: morph_manifold_data.recommended_segments,
        complexity_multiplier: morph_manifold_data.complexity_multiplier
      })
      .from(morph_manifold_data)
      .orderBy(morph_manifold_data.shape_type);

    res.json({
      success: true,
      morph_manifolds: morphData,
      count: morphData.length,
      description: 'A/B/C Control Manifold System - Transforms static shapes into programmable multi-dimensional forms'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch morph manifold data'
    });
  }
});

// Get morph manifold data for specific shape
router.get('/morph-manifold/:shapeType', async (req, res) => {
  try {
    const { shapeType } = req.params;

    const morphData = await db
      .select()
      .from(morph_manifold_data)
      .where(eq(morph_manifold_data.shape_type, shapeType))
      .limit(1);

    const tokenData = await db
      .select()
      .from(shape_tokens)
      .where(eq(shape_tokens.shape_type, shapeType));

    if (morphData.length === 0) {
      return res.status(404).json({
        success: false,
        error: `Morph manifold data not found for shape: ${shapeType}`
      });
    }

    res.json({
      success: true,
      morph_manifold: morphData[0],
      tokens: tokenData,
      control_system: {
        a_description: 'Primary control uniform (X-axis influence)',
        b_description: 'Secondary control uniform (Y-axis influence)',
        c_description: 'Tertiary control uniform (Scale/Z influence)',
        shader_analogy: 'A/B/C work like GPU shader uniforms for mathematical surfaces'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch morph manifold data for shape'
    });
  }
});

// Trigger complete token generation sweep
router.post('/admin/complete-token-sweep', async (req, res) => {
  try {
    if (!requireMintAuth(req, res)) return;
    console.log('🚀 Admin triggered complete token sweep...');

    // Import database seeder
    const { DatabaseSeeder } = require('../database-seeder');
    const seeder = new DatabaseSeeder();

    await seeder.completeTokenSweep();

    // Get updated metrics
    const tokenStats = await db
      .select({
        token_type: shape_tokens.token_type,
        count: sql`count(*)`.as('count'),
        total_value: sql`sum(weight * 100)`.as('total_value')
      })
      .from(shape_tokens)
      .groupBy(shape_tokens.token_type);

    const totalTokens = await db
      .select({ count: sql`count(*)`.as('count') })
      .from(shape_tokens);

    res.json({
      success: true,
      message: 'Complete token sweep completed successfully',
      results: {
        total_tokens_now: totalTokens[0]?.count || 0,
        token_categories: tokenStats,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Complete token sweep error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete token sweep',
      details: error.message
    });
  }
});

// Get shapes using golden ratio (phi)
router.get('/morph-manifold/filter/phi', async (req, res) => {
  try {
    const phiShapes = await db
      .select()
      .from(morph_manifold_data)
      .where(eq(morph_manifold_data.uses_phi, true));

    res.json({
      success: true,
      phi_shapes: phiShapes,
      count: phiShapes.length,
      mathematical_significance: 'These shapes integrate the Golden Ratio (φ = 1.618...) into their A/B/C control manifold'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch phi-based morph shapes'
    });
  }
});

// Seed ALL shapes from frontend UNIFIED_SHAPES into database AND generate tokens
router.post('/admin/seed-all-shapes', async (req, res) => {
  try {
    const { shapes } = req.body;

    if (!shapes || !Array.isArray(shapes)) {
      return res.status(400).json({ success: false, error: 'shapes array required' });
    }

    console.log(`🌱 Seeding ${shapes.length} shapes into database...`);

    let seeded = 0;
    let skipped = 0;

    for (const shape of shapes) {
      const { shapeType, name, category } = shape;

      if (!shapeType) {
        skipped++;
        continue;
      }

      // Derive category from shape type if not provided
      let derivedCategory = category || 'general';
      if (shapeType.includes('medical') || shapeType.includes('ct_') || shapeType.includes('mri_')) {
        derivedCategory = 'medical';
      } else if (shapeType.includes('dna') || shapeType.includes('protein') || shapeType.includes('cell')) {
        derivedCategory = 'biological';
      } else if (shapeType.includes('quantum') || shapeType.includes('electron') || shapeType.includes('orbital')) {
        derivedCategory = 'physics';
      } else if (shapeType.includes('fractal') || shapeType.includes('mandelbrot') || shapeType.includes('julia')) {
        derivedCategory = 'fractal';
      } else if (shapeType.includes('torus') || shapeType.includes('klein') || shapeType.includes('mobius')) {
        derivedCategory = 'topology';
      } else if (shapeType.includes('4d') || shapeType.includes('tesseract') || shapeType.includes('hyper')) {
        derivedCategory = 'hyperdimensional';
      } else if (shapeType.includes('alchemical') || shapeType.includes('zodiac') || shapeType.includes('sacred')) {
        derivedCategory = 'symbolic';
      } else if (shapeType.includes('thermal') || shapeType.includes('cooling') || shapeType.includes('heat')) {
        derivedCategory = 'engineering';
      }

      try {
        await db.insert(formula_implementations).values({
          shape_type: shapeType,
          formula_name: name || shapeType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          equation_function: 'function(u, v, params) { /* See UNIFIED_SHAPES */ }',
          equation_x_formula: 'x(u, v, params)',
          equation_y_formula: 'y(u, v, params)',
          equation_z_formula: 'z(u, v, params)',
          parameter_dependencies: JSON.stringify({ a: ['scale'], b: ['amplitude'], c: ['frequency'] }),
          default_parameters: JSON.stringify({ a: 1.0, b: 1.0, c: 1.0, x: 1.0, y: 1.0, z: 1.0 }),
          uv_domain: JSON.stringify({ uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }),
          segment_settings: JSON.stringify({ uSegments: 64, vSegments: 32 }),
          complexity_score: 5,
          category: derivedCategory,
          subcategory: derivedCategory,
          therapeutic_classification: 'general',
          mathematical_foundation: 'Parametric surface equation',
          implementation_notes: `Seeded from UNIFIED_SHAPES: ${shapeType}`,
          performance_optimization: 'Standard parametric evaluation',
          visualization_hints: JSON.stringify({ preferred_lighting: 'smooth', recommended_material: 'solid' }),
          copyright_info: 'UUON Foundation Mathematical Library',
          created_at: new Date(),
          updated_at: new Date()
        }).onConflictDoNothing();
        seeded++;
      } catch (insertError) {
        skipped++;
      }

      if (seeded % 100 === 0 && seeded > 0) {
        console.log(`📊 Progress: ${seeded}/${shapes.length} shapes seeded`);
      }
    }

    // Get updated count
    const totalCount = await db.select({ count: count() }).from(formula_implementations);

    console.log(`✅ Shape seeding complete: ${seeded} added, ${skipped} skipped`);
    console.log(`📊 Total shapes in database: ${totalCount[0]?.count || 0}`);

    res.json({
      success: true,
      message: `Seeded ${seeded} shapes, skipped ${skipped}`,
      results: {
        seeded,
        skipped,
        total_shapes: totalCount[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Shape seeding error:', error);
    res.status(500).json({ success: false, error: 'Failed to seed shapes' });
  }
});

// Generate tokens from user interactions
router.post("/generate-interaction", async (req, res) => {
  return res.status(403).json({ error: "disabled" });
  try {
    const { tokens, energy, timestamp, source, shapeType } = req.body;

    console.log(`🪙 Processing interaction: ${tokens} tokens, ${energy} energy, shape: ${shapeType}`);

    // Ledger writes disabled 2026-07-23: interaction events must not mint ledger rows.
    if (shapeType && tokens > 0) {
      console.log(`✅ Interaction tokens recorded successfully: ${tokens} tokens`);
      res.json({
        success: true,
        message: 'Interaction tokens recorded',
        recorded: { tokens, energy, timestamp, saved_to_db: 0 }
      });
    } else {
      console.log('⚠️ No valid shapeType or tokens provided for interaction recording.');
      res.json({
        success: true,
        message: 'No tokens recorded: invalid input',
        recorded: { tokens: 0, energy, timestamp, saved_to_db: 0 }
      });
    }
  } catch (error) {
    console.error('Interaction token processing error:', error);
    res.status(500).json({ success: false, error: 'Failed to process interaction tokens' });
  }
});

// Bulk sync token batches
router.post('/bulk-sync', async (_req, res) => {
  return res.status(403).json({ error: 'disabled' });
});

export { router as tokenEcosystemRoutes };