/**
 * UNIFIED MATHEMATICAL SYSTEM API ROUTES
 * RESTful endpoints for plaintext math symbols, emoji translations, and unified 3D rendering
 */

import { Router, Request, Response } from 'express';
import {
  getAllUnifiedSymbols,
  getUnifiedSymbol,
  parseEmojiCodeNames,
  outputFormat,
  GEOMETRY_SYMBOLS,
  TRIGONOMETRY_FUNCTIONS,
  CALCULUS_OPERATORS,
  ALGEBRA_STRUCTURES,
  SPECIAL_CONSTANTS,
  EMOJI_TRANSLATIONS
} from '../unified-math-system';

const router = Router();

/**
 * GET /api/unified/symbols
 * Get all unified symbols organized by category
 */
router.get('/unified/symbols', (req: Request, res: Response) => {
  try {
    const allSymbols = getAllUnifiedSymbols();
    
    res.json({
      success: true,
      mode: "plaintext",
      categories: {
        geometry: Object.keys(allSymbols.geometry).length,
        trigonometry: Object.keys(allSymbols.trigonometry).length,
        calculus: Object.keys(allSymbols.calculus).length,
        algebra: Object.keys(allSymbols.algebra).length,
        constants: Object.keys(allSymbols.constants).length,
        emojis: Object.keys(allSymbols.emojis).length
      },
      data: allSymbols,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Unified symbols error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve unified symbols'
    });
  }
});

/**
 * GET /api/unified/symbol/:key
 * Get single unified symbol by key
 */
router.get('/unified/symbol/:key', (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const symbol = getUnifiedSymbol(key);
    
    if (!symbol) {
      return res.status(404).json({
        success: false,
        error: `Symbol '${key}' not found in unified system`
      });
    }
    
    res.json({
      success: true,
      symbol: key,
      data: symbol,
      output_format: outputFormat(key),
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
 * POST /api/unified/parse
 * Parse input string and convert emoji code-names to 3D mesh types
 */
router.post('/unified/parse', (req: Request, res: Response) => {
  try {
    const { input } = req.body;
    
    if (!input || typeof input !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Input must be a non-empty string'
      });
    }
    
    const parsed = parseEmojiCodeNames(input);
    
    res.json({
      success: true,
      original: input,
      parsed: parsed,
      mode: "plaintext_3d_mesh_mapping",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({
      success: false,
      error: 'Parsing failed'
    });
  }
});

/**
 * GET /api/unified/category/:category
 * Get all symbols in a specific category
 */
router.get('/unified/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    
    const categoryMappings: Record<string, any> = {
      geometry: GEOMETRY_SYMBOLS,
      trigonometry: TRIGONOMETRY_FUNCTIONS,
      calculus: CALCULUS_OPERATORS,
      algebra: ALGEBRA_STRUCTURES,
      constants: SPECIAL_CONSTANTS,
      emojis: EMOJI_TRANSLATIONS
    };
    
    const categoryData = categoryMappings[category.toLowerCase()];
    
    if (!categoryData) {
      return res.status(404).json({
        success: false,
        error: `Category '${category}' not found`,
        available_categories: Object.keys(categoryMappings)
      });
    }
    
    res.json({
      success: true,
      category: category,
      count: Object.keys(categoryData).length,
      symbols: categoryData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Category error:', error);
    res.status(500).json({
      success: false,
      error: 'Category retrieval failed'
    });
  }
});

/**
 * POST /api/unified/render3d
 * Render any unified symbol to 3D representation
 */
router.post('/unified/render3d', async (req: Request, res: Response) => {
  try {
    const { symbol, parameters, quality } = req.body;
    
    if (!symbol) {
      return res.status(400).json({
        success: false,
        error: 'Symbol parameter required'
      });
    }
    
    const symbolData = getUnifiedSymbol(symbol);
    
    if (!symbolData) {
      return res.status(404).json({
        success: false,
        error: `Symbol '${symbol}' not found`
      });
    }
    
    const format = outputFormat(symbol);
    
    res.json({
      success: true,
      symbol: symbol,
      "3d_representation": format["3d_representation"],
      mesh_type: format.mesh_type,
      description: format.description,
      parameters: parameters || symbolData["3d"].parameters,
      quality: quality || "medium",
      render_ready: true,
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
 * GET /api/unified/constants
 * Get all special constants (PHI, TON values, etc.)
 */
router.get('/unified/constants', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      constants: SPECIAL_CONSTANTS,
      count: Object.keys(SPECIAL_CONSTANTS).length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Constants error:', error);
    res.status(500).json({
      success: false,
      error: 'Constants retrieval failed'
    });
  }
});

/**
 * GET /api/unified/emojis
 * Get all emoji translations
 */
router.get('/unified/emojis', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      emojis: EMOJI_TRANSLATIONS,
      count: Object.keys(EMOJI_TRANSLATIONS).length,
      mode: "plaintext_code_names_only",
      note: "System never outputs real emojis, always plaintext code names",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Emoji translations error:', error);
    res.status(500).json({
      success: false,
      error: 'Emoji translations retrieval failed'
    });
  }
});

/**
 * POST /api/unified/batch-render
 * Batch render multiple symbols to 3D
 */
router.post('/unified/batch-render', async (req: Request, res: Response) => {
  try {
    const { symbols } = req.body;
    
    if (!Array.isArray(symbols)) {
      return res.status(400).json({
        success: false,
        error: 'symbols must be an array of symbol keys'
      });
    }
    
    const results = symbols.map(symbol => {
      const symbolData = getUnifiedSymbol(symbol);
      if (!symbolData) {
        return {
          symbol,
          success: false,
          error: 'Symbol not found'
        };
      }
      
      const format = outputFormat(symbol);
      return {
        symbol,
        success: true,
        "3d_representation": format["3d_representation"],
        mesh_type: format.mesh_type,
        description: format.description
      };
    });
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    res.json({
      success: true,
      total: symbols.length,
      successful: successful.length,
      failed: failed.length,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Batch render error:', error);
    res.status(500).json({
      success: false,
      error: 'Batch rendering failed'
    });
  }
});

/**
 * GET /api/unified/stats
 * Get unified system statistics
 */
router.get('/unified/stats', (req: Request, res: Response) => {
  try {
    const allSymbols = getAllUnifiedSymbols();
    
    const stats = {
      total_symbols: 
        Object.keys(allSymbols.geometry).length +
        Object.keys(allSymbols.trigonometry).length +
        Object.keys(allSymbols.calculus).length +
        Object.keys(allSymbols.algebra).length +
        Object.keys(allSymbols.constants).length +
        Object.keys(allSymbols.emojis).length,
      by_category: {
        geometry: Object.keys(allSymbols.geometry).length,
        trigonometry: Object.keys(allSymbols.trigonometry).length,
        calculus: Object.keys(allSymbols.calculus).length,
        algebra: Object.keys(allSymbols.algebra).length,
        constants: Object.keys(allSymbols.constants).length,
        emojis: Object.keys(allSymbols.emojis).length
      },
      special_constants: {
        PHI: 1.618033988749,
        PHI_INV: 0.618033988749,
        TON_202: 1.202,
        TON_1480: 1.1480,
        TON_256: 1.256,
        TON_618: 1.618
      },
      capabilities: [
        "Plaintext mode (no Unicode symbols or emojis)",
        "Emoji code-name translation",
        "3D mesh mapping",
        "Mathematical constant definitions",
        "Geometry symbol rendering",
        "Trigonometry function visualization",
        "Calculus operator representation",
        "Algebra structure mapping",
        "Batch processing",
        "Real-time parsing"
      ],
      mode: "UNIFIED_PLAINTEXT_SYSTEM"
    };
    
    res.json({
      success: true,
      stats,
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
