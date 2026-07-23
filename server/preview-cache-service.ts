import { neon } from '@neondatabase/serverless';
import { Router, Request, Response } from 'express';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

export const previewCacheRouter = Router();

interface CacheEntry {
  shape_type: string;
  preview_data: string;
  thumbnail_url: string;
  parameters_hash: string;
  width: number;
  height: number;
  format: string;
  compressed_size: number;
  created_at: string;
  expires_at: string;
}

async function getPreviewFromCache(shapeType: string, paramsHash: string): Promise<CacheEntry | null> {
  try {
    const result = await sql`
      SELECT * FROM shape_preview_cache 
      WHERE shape_type = ${shapeType} 
      AND parameters_hash = ${paramsHash}
      AND expires_at > NOW()
      LIMIT 1
    `;
    return result.length > 0 ? result[0] as unknown as CacheEntry : null;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

async function storePreviewInCache(
  shapeType: string,
  paramsHash: string,
  previewData: string,
  format: string = 'png',
  width: number = 256,
  height: number = 256
): Promise<boolean> {
  try {
    const compressedSize = Buffer.byteLength(previewData, 'base64');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    
    await sql`
      INSERT INTO shape_preview_cache (
        shape_type, preview_data, parameters_hash, width, height, format, 
        compressed_size, created_at, expires_at
      ) VALUES (
        ${shapeType}, ${previewData}, ${paramsHash}, ${width}, ${height}, ${format},
        ${compressedSize}, NOW(), ${expiresAt}
      )
      ON CONFLICT (shape_type, parameters_hash) 
      DO UPDATE SET 
        preview_data = EXCLUDED.preview_data,
        width = EXCLUDED.width,
        height = EXCLUDED.height,
        compressed_size = EXCLUDED.compressed_size,
        expires_at = EXCLUDED.expires_at
    `;
    return true;
  } catch (error) {
    console.error('Cache write error:', error);
    return false;
  }
}

function hashParameters(params: Record<string, unknown>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}:${JSON.stringify(params[key])}`)
    .join('|');
  
  let hash = 0;
  for (let i = 0; i < sortedParams.length; i++) {
    const char = sortedParams.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

previewCacheRouter.get('/preview/:shapeType', async (req: Request, res: Response) => {
  const { shapeType } = req.params;
  const params = req.query as Record<string, unknown>;
  const paramsHash = hashParameters(params);
  
  const cached = await getPreviewFromCache(shapeType, paramsHash);
  
  if (cached) {
    res.set({
      'Content-Type': `image/${cached.format}`,
      'Cache-Control': 'public, max-age=86400',
      'X-Cache': 'HIT'
    });
    
    const imageBuffer = Buffer.from(cached.preview_data, 'base64');
    return res.send(imageBuffer);
  }
  
  res.set('X-Cache', 'MISS');
  return res.status(404).json({ 
    error: 'Preview not cached',
    shapeType,
    paramsHash,
    message: 'Preview will be generated on first render'
  });
});

previewCacheRouter.post('/preview/:shapeType', async (req: Request, res: Response) => {
  const { shapeType } = req.params;
  const { previewData, parameters, format = 'png', width = 256, height = 256 } = req.body;
  
  if (!previewData || !parameters) {
    return res.status(400).json({ error: 'Missing previewData or parameters' });
  }
  
  const paramsHash = hashParameters(parameters);
  const success = await storePreviewInCache(shapeType, paramsHash, previewData, format, width, height);
  
  if (success) {
    return res.json({ 
      success: true, 
      shapeType, 
      paramsHash,
      message: 'Preview cached successfully'
    });
  } else {
    return res.status(500).json({ error: 'Failed to cache preview' });
  }
});

previewCacheRouter.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await sql`
      SELECT 
        COUNT(*) as total_cached,
        COUNT(DISTINCT shape_type) as unique_shapes,
        COALESCE(SUM(compressed_size), 0) as total_size_bytes,
        MAX(created_at) as last_cached
      FROM shape_preview_cache
      WHERE expires_at > NOW()
    `;
    
    const categoryStats = await sql`
      SELECT 
        r.category,
        COUNT(c.shape_type) as cached_count
      FROM complete_shape_registry r
      LEFT JOIN shape_preview_cache c ON r.shape_type = c.shape_type
      WHERE r.is_active = true
      GROUP BY r.category
      ORDER BY cached_count DESC
    `;
    
    res.json({
      cache: stats[0],
      categories: categoryStats
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get cache stats' });
  }
});

previewCacheRouter.delete('/expired', async (_req: Request, res: Response) => {
  try {
    const result = await sql`
      DELETE FROM shape_preview_cache 
      WHERE expires_at < NOW()
      RETURNING shape_type
    `;
    
    res.json({
      deleted: result.length,
      message: `Cleaned ${result.length} expired cache entries`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clean expired cache' });
  }
});

export { getPreviewFromCache, storePreviewInCache, hashParameters };
