
import { Router } from 'express';
import { requireMintAuth } from './middleware/requireMintAuth';
import { dbLoader } from './database-loader';
import { seeder } from './database-seeder';
import { db } from './storage';
import { formula_implementations } from '../shared/schema';
import { sql } from 'drizzle-orm';

const router = Router();

// GET / — root handler for GET /api/shapes (router is mounted at /api/shapes)
// Must be registered before the /:shapeId wildcard to avoid being swallowed.
router.get('/', async (req, res) => {
  try {
    const formulas = await dbLoader.getAllFormulas();
    const { category, limit: qLimit, offset: qOffset } = req.query;
    let filtered = formulas;
    if (category) {
      filtered = formulas.filter(f => f.category === category);
    }
    const total = filtered.length;
    const offset = parseInt(String(qOffset || '0'), 10);
    const limit = Math.min(parseInt(String(qLimit || '100'), 10), 500);
    const page = filtered.slice(offset, offset + limit);
    res.json({
      success: true,
      shapes: page.map(f => ({
        shape_type: f.shape_type,
        formula_name: f.formula_name,
        category: f.category,
        complexity_score: f.complexity_score,
      })),
      total,
      limit,
      offset,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting all shapes:', error);
    res.status(500).json({ error: 'Failed to get shapes' });
  }
});

// Get shape defaults from database
router.get('/shapes/:shapeName/defaults', async (req, res) => {
  try {
    const { shapeName } = req.params;
    const defaults = await dbLoader.getShapeDefaults(shapeName);

    if (!defaults) {
      return res.status(404).json({ error: 'Shape not found', shape: shapeName });
    }

    res.json({
      success: true,
      shape: shapeName,
      defaults,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting shape defaults:', error);
    res.status(500).json({ error: 'Failed to get shape defaults' });
  }
});

// Get shape formula from database
router.get('/shapes/:shapeName/formula', async (req, res) => {
  try {
    const { shapeName } = req.params;
    const formula = await dbLoader.getShapeFormula(shapeName);
    
    if (!formula) {
      return res.status(404).json({ error: 'Shape formula not found' });
    }
    
    res.json({
      success: true,
      shape: shapeName,
      formula,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting shape formula:', error);
    res.status(500).json({ error: 'Failed to get shape formula' });
  }
});

// Get all available shapes
router.get('/shapes', async (req, res) => {
  try {
    const formulas = await dbLoader.getAllFormulas();
    
    res.json({
      success: true,
      shapes: formulas.map(f => ({
        shape_type: f.shape_type,
        formula_name: f.formula_name,
        category: f.category,
        complexity_score: f.complexity_score,
        therapeutic_classification: f.therapeutic_classification
      })),
      count: formulas.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting all shapes:', error);
    res.status(500).json({ error: 'Failed to get shapes' });
  }
});

// Get shapes by category
router.get('/shapes/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const shapes = await dbLoader.getShapesByCategory(category);
    
    res.json({
      success: true,
      category,
      shapes,
      count: shapes.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting shapes by category:', error);
    res.status(500).json({ error: 'Failed to get shapes by category' });
  }
});

// Get shape presets
router.get('/shapes/:shapeName/presets', async (req, res) => {
  try {
    const { shapeName } = req.params;
    const presets = await dbLoader.getShapePresets(shapeName);
    
    res.json({
      success: true,
      shape: shapeName,
      presets,
      count: presets.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting shape presets:', error);
    res.status(500).json({ error: 'Failed to get shape presets' });
  }
});

// Get parameter definitions
router.get('/parameters', async (req, res) => {
  try {
    const parameters = await dbLoader.getAllParameterDefinitions();
    
    res.json({
      success: true,
      parameters,
      count: parameters.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting parameter definitions:', error);
    res.status(500).json({ error: 'Failed to get parameter definitions' });
  }
});

// Get specific parameter definition
router.get('/parameters/:paramName', async (req, res) => {
  try {
    const { paramName } = req.params;
    const parameter = await dbLoader.getParameterDefinition(paramName);
    
    if (!parameter) {
      return res.status(404).json({ error: 'Parameter not found' });
    }
    
    res.json({
      success: true,
      parameter,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting parameter definition:', error);
    res.status(500).json({ error: 'Failed to get parameter definition' });
  }
});

// Seed database (admin function)
const requireAdmin = (req: any, res: any, next: any) => {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || req.headers['x-admin-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

router.post('/admin/seed', requireAdmin, async (req, res) => {
  try {
    await seeder.seedAll();
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Clear cache
router.post('/admin/clear-cache', requireAdmin, async (req, res) => {
  try {
    dbLoader.clearCache();
    
    res.json({
      success: true,
      message: 'Cache cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// GET /categories — must be registered BEFORE /:shapeId so "categories" isn't
// treated as a shape ID by the wildcard route below.
// Queries the database directly so counts are always accurate, even on cold start.
router.get('/categories', async (req, res) => {
  try {
    const rows = await db
      .select({
        name: formula_implementations.category,
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(formula_implementations)
      .groupBy(formula_implementations.category);

    const categories = rows.map(r => ({
      name: r.name || 'uncategorized',
      count: r.count,
    }));

    res.json({
      success: true,
      categories,
      total: categories.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error getting categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// POST /compute — compute geometry for a given shape + parameter set.
// Wires to the same dbLoader / shape defaults used by the rest of the API.
router.post('/compute', async (req, res) => {
  try {
    const { shapeType, parameters = {} } = req.body;
    if (!shapeType) {
      return res.status(400).json({ error: 'shapeType is required' });
    }
    const [defaults, formula] = await Promise.all([
      dbLoader.getShapeDefaults(shapeType).catch(() => null),
      dbLoader.getShapeFormula(shapeType).catch(() => null),
    ]);
    res.json({
      success: true,
      shapeType,
      resolvedParameters: { ...defaults, ...parameters },
      formula: formula ? {
        name: formula.formula_name,
        category: formula.category,
        complexity: formula.complexity_score,
        equations: {
          x: formula.equation_x_formula,
          y: formula.equation_y_formula,
          z: formula.equation_z_formula,
        },
      } : null,
      note: 'Full vertex geometry available via POST /api/engines/{engine}/render with an x-api-key header.',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error computing shape:', error);
    res.status(500).json({ error: 'Failed to compute shape' });
  }
});

// Get individual shape details by ID
router.get('/:shapeId', async (req, res) => {
  try {
    const { shapeId } = req.params;
    const shapeName = shapeId.replace(/-/g, '_');
    
    const defaults = await dbLoader.getShapeDefaults(shapeName);
    const formula = await dbLoader.getShapeFormula(shapeName);

    if (!defaults && !formula) {
      return res.status(404).json({ error: 'Shape not found', id: shapeId });
    }

    const shapeData = {
      id: shapeId,
      name: shapeId.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      category: formula?.category || 'parametric-surfaces',
      equation: formula?.equations?.x ? `x(u,v), y(u,v), z(u,v)` : 'Parametric surface',
      description: `A mathematical ${shapeId.replace(/-/g, ' ')} with full A-Z parameter control. This shape responds to parameter adjustments in real-time.`,
      parameters: {
        A: { default: defaults?.A || 1, min: -360, max: 360, description: 'Primary scale/transform' },
        B: { default: defaults?.B || 1, min: -360, max: 360, description: 'Secondary scale/transform' },
        C: { default: defaults?.C || 1, min: -360, max: 360, description: 'Tertiary scale/transform' },
        D: { default: defaults?.D || 0, min: -360, max: 360, description: 'Foundational curve parameter' },
        E: { default: defaults?.E || 0, min: -360, max: 360, description: 'Secondary curve parameter' },
        F: { default: defaults?.F || 0, min: -360, max: 360, description: 'Surface of revolution' },
      },
      complexity: formula?.complexity_score || 3,
      uvDomain: {
        uMin: defaults?.uMin || 0,
        uMax: defaults?.uMax || 6.28318,
        vMin: defaults?.vMin || 0,
        vMax: defaults?.vMax || 3.14159
      },
      materials: ['Default', 'Titanium', 'Glass', 'Carbon Fiber', 'Gold', 'Ceramic'],
      exportFormats: ['GLB', 'PLY', 'NeRF', 'Animated GLB', 'Point Cloud', 'Sketchfab']
    };
    
    res.json(shapeData);
  } catch (error) {
    console.error('Error getting shape details:', error);
    res.status(500).json({ error: 'Failed to get shape details' });
  }
});



export { router as shapeRoutes };
