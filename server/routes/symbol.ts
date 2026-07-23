
/**
 * MATHEMATICAL SYMBOL API ROUTES
 * RESTful endpoints for symbol database and 3D mapping
 */

import { Router, Request, Response } from 'express';
import { 
  MATHEMATICAL_SYMBOLS, 
  getSymbol, 
  getSymbolsByCategory, 
  searchSymbols,
  SYMBOL_CATEGORIES 
} from '../symbol-database';
import { mappingEngine, MappingRequest } from '../3d-mapping-engine';

const router = Router();

/**
 * GET /api/symbol/:name
 * Get single symbol data
 */
router.get('/uuon-symbol/:name', (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const symbol = getSymbol(name);

    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: `Symbol '${name}' not found`
      });
    }

    res.json({
      success: true,
      symbol: name,
      data: symbol,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symbol lookup error:', error);
    res.status(500).json({
      success: false,
      error: 'Symbol lookup failed'
    });
  }
});

/**
 * GET /api/symbols
 * Get all symbols with optional filtering
 */
router.get('/uuon-symbols', (req: Request, res: Response) => {
  try {
    const { category, search } = req.query;

    let symbols;
    if (category) {
      symbols = getSymbolsByCategory(category as string);
    } else if (search) {
      symbols = searchSymbols(search as string);
    } else {
      symbols = Object.values(MATHEMATICAL_SYMBOLS);
    }

    res.json({
      success: true,
      count: symbols.length,
      symbols,
      categories: Object.keys(SYMBOL_CATEGORIES),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Symbols listing error:', error);
    res.status(500).json({
      success: false,
      error: 'Symbols listing failed'
    });
  }
});

/**
 * GET /api/symbol/categories
 * Get all symbol categories
 */
router.get('/uuon-symbol/categories', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      categories: SYMBOL_CATEGORIES,
      total_symbols: Object.keys(MATHEMATICAL_SYMBOLS).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Categories listing failed'
    });
  }
});

/**
 * POST /api/symbol/:name/render3d
 * Generate 3D representation of symbol
 */
router.post('/uuon-symbol/:name/render3d', async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const { method, parameters, transformations, quality } = req.body;

    const mappingRequest: MappingRequest = {
      symbol: name,
      method,
      parameters,
      transformations,
      quality: quality || 'medium'
    };

    const result = await mappingEngine.mapSymbolTo3D(mappingRequest);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: `Failed to render symbol '${name}' in 3D`
      });
    }

    res.json({
      success: true,
      symbol: name,
      "3d_data": {
        vertices: result.geometry.vertices,
        indices: result.geometry.indices,
        normals: result.geometry.normals,
        uvs: result.geometry.uvs
      },
      metadata: result.geometry.metadata,
      symbol_info: {
        unicode: result.symbol_data.unicode,
        latex: result.symbol_data.latex,
        description: result.symbol_data.description,
        category: result.symbol_data.category
      },
      processing_info: {
        method_used: result.symbol_data["3d"].method,
        transformations_applied: result.transformations_applied,
        processing_time_ms: result.processing_time,
        cache_hit: result.processing_time < 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('3D rendering error:', error);
    res.status(500).json({
      success: false,
      error: '3D rendering failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/symbols/render3d/batch
 * Render multiple symbols to 3D
 */
router.post('/uuon-symbols/render3d/batch', async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body;

    if (!Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        error: 'symbols must be an array'
      });
    }

    const requests: MappingRequest[] = symbols.map(item => ({
      symbol: typeof item === 'string' ? item : item.symbol,
      method: typeof item === 'object' ? item.method : undefined,
      parameters: typeof item === 'object' ? item.parameters : undefined,
      transformations: typeof item === 'object' ? item.transformations : undefined,
      quality: typeof item === 'object' ? item.quality : 'medium'
    }));

    const results = await mappingEngine.mapMultipleSymbols(requests);

    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);

    res.json({
      success: true,
      processed: results.length,
      successful: successfulResults.length,
      failed: failedResults.length,
      results: successfulResults.map(result => ({
        symbol: result.geometry.metadata.symbol,
        "3d_data": {
          vertices: result.geometry.vertices,
          indices: result.geometry.indices,
          normals: result.geometry.normals,
          uvs: result.geometry.uvs
        },
        metadata: result.geometry.metadata,
        processing_time_ms: result.processing_time
      })),
      errors: failedResults.map(result => ({
        symbol: result.geometry.metadata.symbol,
        error: 'Rendering failed'
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch 3D rendering error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch 3D rendering failed'
    });
  }
});

/**
 * GET /api/symbol/:name/formats
 * Get symbol in all supported formats
 */
router.get('/uuon-symbol/:name/formats', (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const symbol = getSymbol(name);

    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: `Symbol '${name}' not found`
      });
    }

    // Return exact contract format as specified
    res.json({
      symbol: symbol.symbol,
      unicode: symbol.unicode,
      draw_js: symbol.draw_js,
      html: symbol.html,
      latex: symbol.latex,
      python_safe: symbol.python_safe,
      json_safe: symbol.json_safe,
      "3d": {
        method: symbol["3d"].method,
        mesh: symbol["3d"].mesh || "Generated on request",
        geometry_type: symbol["3d"].geometry_type,
        parameters: symbol["3d"].parameters
      },
      description: symbol.description,
      category: symbol.category,
      aliases: symbol.aliases
    });
  } catch (error) {
    console.error('Symbol formats error:', error);
    res.status(500).json({
      success: false,
      error: 'Symbol formats retrieval failed'
    });
  }
});

/**
 * GET /api/symbols/stats
 * Get symbol database statistics
 */
router.get('/uuon-symbols/stats', (req: Request, res: Response) => {
  try {
    const symbolCount = Object.keys(MATHEMATICAL_SYMBOLS).length;
    const categoryCount = Object.keys(SYMBOL_CATEGORIES).length;
    
    const methodStats = Object.values(MATHEMATICAL_SYMBOLS).reduce((acc, symbol) => {
      const method = symbol["3d"].method;
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryStats = Object.entries(SYMBOL_CATEGORIES).reduce((acc, [category, symbols]) => {
      acc[category] = symbols.length;
      return acc;
    }, {} as Record<string, number>);

    const cacheStats = mappingEngine.getCacheStats();

    res.json({
      success: true,
      database: {
        total_symbols: symbolCount,
        total_categories: categoryCount,
        symbols_by_method: methodStats,
        symbols_by_category: categoryStats
      },
      cache: cacheStats,
      capabilities: [
        "Unicode conversion",
        "HTML entity encoding", 
        "LaTeX formatting",
        "JavaScript escaping",
        "Python string safety",
        "JSON serialization",
        "Font extrusion 3D",
        "Semantic geometry 3D",
        "Procedural generation 3D",
        "Real-time caching",
        "Batch processing"
      ],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Stats retrieval failed'
    });
  }
});

export default router;
