import { Router, Request, Response } from 'express';
import { db } from '../storage';
import { custom_fused_shapes } from '../../shared/schema';
import { eq, desc } from 'drizzle-orm';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      shapeName,
      shapeId,
      // Legacy 2-shape fields
      parentShape1,
      parentShape2,
      fusionRatio,
      // New multi-shape fields
      parentShapes,
      fusionMetadata,
      // Common fields
      fusedParameters,
      description,
      isAnimated,
      animationKeyframes,
      isPublic,
      autoSave = false
    } = req.body;

    // Validation: Either legacy OR multi-shape format
    const isLegacyFormat = parentShape1 && parentShape2;
    const isMultiShapeFormat = parentShapes && Array.isArray(parentShapes);

    if (!shapeName || !shapeId || !fusedParameters) {
      return res.status(400).json({ 
        error: 'Missing required fields: shapeName, shapeId, fusedParameters' 
      });
    }

    if (!isLegacyFormat && !isMultiShapeFormat) {
      return res.status(400).json({ 
        error: 'Must provide either (parentShape1 + parentShape2) OR (parentShapes array)' 
      });
    }

    const now = new Date();

    const newShape = {
      user_id: null,
      shape_name: shapeName,
      shape_id: shapeId,
      // Legacy fields (for backward compatibility)
      parent_shape_1: isLegacyFormat ? parentShape1 : null,
      parent_shape_2: isLegacyFormat ? parentShape2 : null,
      fusion_ratio: isLegacyFormat ? (fusionRatio || 0.5) : null,
      // New multi-shape fields
      parent_shapes: isMultiShapeFormat ? JSON.stringify(parentShapes) : null,
      fusion_metadata: fusionMetadata ? JSON.stringify(fusionMetadata) : null,
      // Common fields
      fused_parameters: typeof fusedParameters === 'string' ? fusedParameters : JSON.stringify(fusedParameters),
      description: description || null,
      is_animated: isAnimated || false,
      animation_keyframes: animationKeyframes ? JSON.stringify(animationKeyframes) : null,
      is_public: isPublic !== undefined ? isPublic : true,
      usage_count: 0,
      created_at: now,
      updated_at: now
    };

    const [savedShape] = await db.insert(custom_fused_shapes).values(newShape).returning();

    const message = autoSave 
      ? `Auto-saved fusion "${shapeName}" (${parentShapes?.length || 2} shapes)` 
      : `Fused shape "${shapeName}" saved successfully!`;

    console.log(`✨ ${message}`);

    res.json({ 
      success: true, 
      shape: savedShape,
      message,
      isMultiShape: isMultiShapeFormat,
      shapeCount: parentShapes?.length || 2
    });

  } catch (error: any) {
    console.error('Error saving fused shape:', error);
    res.status(500).json({ 
      error: 'Failed to save fused shape', 
      details: error.message 
    });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    console.log('📚 Fetching custom fused shapes from database...');

    // Add caching headers for better performance
    res.set({
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // 5 min cache, 10 min stale
      'ETag': `"fused-shapes-${Date.now()}"`,
      'Vary': 'Accept-Encoding'
    });

    const shapes = await db
      .select()
      .from(custom_fused_shapes)
      .where(eq(custom_fused_shapes.is_public, true))
      .orderBy(desc(custom_fused_shapes.usage_count), desc(custom_fused_shapes.created_at))
      .limit(100);

    console.log(`✅ Found ${shapes.length} custom fused shapes`);

    if (shapes.length > 0) {
      console.log('📋 Sample shapes:', shapes.slice(0, 2).map(s => ({
        name: s.shape_name,
        parents: `${s.parent_shape_1} + ${s.parent_shape_2}`,
        ratio: s.fusion_ratio
      })));
    }

    res.json({ 
      success: true, 
      shapes,
      count: shapes.length,
      timestamp: new Date().toISOString(),
      performance: {
        cached: true,
        optimized: true
      }
    });
  } catch (error: any) {
    console.error('❌ Error loading fused shapes:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to load fused shapes', 
      details: error.message 
    });
  }
});

router.get('/:shapeId', async (req: Request, res: Response) => {
  try {
    const { shapeId } = req.params;

    const [shape] = await db
      .select()
      .from(custom_fused_shapes)
      .where(eq(custom_fused_shapes.shape_id, shapeId))
      .limit(1);

    if (!shape) {
      return res.status(404).json({ error: 'Fused shape not found' });
    }

    await db
      .update(custom_fused_shapes)
      .set({ usage_count: shape.usage_count + 1 })
      .where(eq(custom_fused_shapes.shape_id, shapeId));

    res.json({ success: true, shape });
  } catch (error: any) {
    console.error('Error loading fused shape:', error);
    res.status(500).json({ 
      error: 'Failed to load fused shape', 
      details: error.message 
    });
  }
});

router.delete('/:shapeId', async (req: Request, res: Response) => {
  try {
    const { shapeId } = req.params;

    await db
      .delete(custom_fused_shapes)
      .where(eq(custom_fused_shapes.shape_id, shapeId));

    res.json({ success: true, message: 'Fused shape deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting fused shape:', error);
    res.status(500).json({ 
      error: 'Failed to delete fused shape', 
      details: error.message 
    });
  }
});

export default router;