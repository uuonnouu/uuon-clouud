import { Router, Request, Response } from 'express';
import { wolframAlphaService } from '../services/wolframAlphaService';
import { ibmQuantumService } from '../services/ibmQuantumService';

const router = Router();

// Request deduplication and rate limiting
const requestCache = new Map<string, { result: any; timestamp: number }>();
const rateLimitMap = new Map<string, number[]>();
const CACHE_DURATION = 30000; // 30 seconds
const RATE_LIMIT = 10; // Max 10 requests per minute per shape
const RATE_WINDOW = 60000; // 1 minute

/**
 * Wolfram Alpha query endpoint
 * POST /api/compute/wolfram
 */
router.post('/wolfram', async (req: Request, res: Response) => {
  try {
    const { query, fullResults = false } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter is required'
      });
    }

    if (!wolframAlphaService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'Wolfram Alpha API not configured. Please add WOLFRAM_ALPHA_APP_ID to environment.'
      });
    }

    const result = fullResults
      ? await wolframAlphaService.queryFull(query)
      : await wolframAlphaService.query(query);

    res.json(result);
  } catch (error: any) {
    console.error('Wolfram API route error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * IBM Quantum randomness endpoint
 * POST /api/compute/quantum/random
 */
router.post('/quantum/random', async (req: Request, res: Response) => {
  try {
    const { seed } = req.body;

    const result = await ibmQuantumService.getQuantumRandomness(seed);
    res.json(result);
  } catch (error: any) {
    console.error('Quantum randomness error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * IBM Quantum interference endpoint
 * POST /api/compute/quantum/interference
 */
router.post('/quantum/interference', async (req: Request, res: Response) => {
  try {
    const { baseValue, lambda } = req.body;

    if (typeof baseValue !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'baseValue must be a number'
      });
    }

    const result = await ibmQuantumService.applyQuantumInterference(
      baseValue,
      lambda
    );

    res.json({
      success: true,
      result
    });
  } catch (error: any) {
    console.error('Quantum interference error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Dual intelligence compute endpoint
 * Combines Wolfram (symbolic) + Quantum (probabilistic)
 * POST /api/compute/dual
 */
router.post('/dual', async (req: Request, res: Response) => {
  try {
    const { equation, applyQuantumVariation = false } = req.body;

    if (!equation) {
      return res.status(400).json({
        success: false,
        error: 'Equation is required'
      });
    }

    // Step 1: Get Wolfram symbolic result
    const wolframResult = await wolframAlphaService.query(equation);

    if (!wolframResult.success) {
      return res.json(wolframResult);
    }

    // Step 2: Optionally apply quantum variation
    let finalResult = wolframResult;
    if (applyQuantumVariation && wolframResult.plaintext) {
      // Extract numeric value if possible
      const numMatch = wolframResult.plaintext.match(/[-+]?\d*\.?\d+/);
      if (numMatch) {
        const baseValue = parseFloat(numMatch[0]);
        const quantumValue = await ibmQuantumService.applyQuantumInterference(baseValue);

        finalResult = {
          ...wolframResult,
          quantumVariation: quantumValue,
          blendRatio: '70% Wolfram + 30% Quantum'
        };
      }
    }

    res.json(finalResult);
  } catch (error: any) {
    console.error('Dual compute error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Parametric surface computation endpoint
 * POST /api/compute/surface
 * SECURITY: Keeps proprietary shape algorithms server-side
 */
router.post('/surface', async (req: Request, res: Response) => {
  try {
    // Validate required parameters
    const { shapeId, parameters } = req.body;

    if (!shapeId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: shapeId'
      });
    }

    if (!parameters || typeof parameters !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameter: parameters (must be object)'
      });
    }

    const params = req.body as {
      shapeId: string;
      parameters?: Record<string, any>;
      uSegments?: number;
      vSegments?: number;
      uMin?: number;
      uMax?: number;
      vMin?: number;
      vMax?: number;
    };

    const requestKey = JSON.stringify(params);
    const now = Date.now();

    // Check cache first
    const cached = requestCache.get(requestKey);
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      console.log(`🎯 Serving cached result for ${params.shapeId}`);
      return res.json(cached.result);
    }

    // Rate limiting per shape
    const shapeRequests = rateLimitMap.get(params.shapeId) || [];
    const recentRequests = shapeRequests.filter(timestamp => now - timestamp < RATE_WINDOW);

    if (recentRequests.length >= RATE_LIMIT) {
      console.warn(`🚫 Rate limit exceeded for ${params.shapeId}`);
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded. Please slow down your requests.',
        retryAfter: Math.ceil((RATE_WINDOW - (now - recentRequests[0])) / 1000)
      });
    }

    // Update rate limit tracking
    recentRequests.push(now);
    rateLimitMap.set(params.shapeId, recentRequests);

    // Import shape registry (will be created)
    const { computeSurfaceGeometry } = await import('../lib/shapes/shapeComputer');

    const result = await computeSurfaceGeometry({
      shapeId: params.shapeId,
      parameters: params.parameters || {},
      uSegments: params.uSegments || 96,
      vSegments: params.vSegments || 72,
      uMin: params.uMin || 0,
      uMax: params.uMax || 1,
      vMin: params.vMin || 0,
      vMax: params.vMax || 1
    });

    if (!result.success) {
      return res.status(404).json(result);
    }

    // Cache the result
    requestCache.set(requestKey, {
      result,
      timestamp: now
    });

    // Cleanup old cache entries periodically
    if (Math.random() < 0.1) { // 10% chance
      cleanupCache();
    }

    res.json(result);
  } catch (error: any) {
    console.error('Surface computation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/status', (req: Request, res: Response) => {
  res.json({
    wolfram: wolframAlphaService.isConfigured(),
    quantum: ibmQuantumService.isConfigured(),
    dualIntelligenceReady: wolframAlphaService.isConfigured() && ibmQuantumService.isConfigured()
  });
});

function cleanupCache() {
  const now = Date.now();
  Array.from(requestCache.entries()).forEach(([key, cached]) => {
    if (now - cached.timestamp > CACHE_DURATION) {
      requestCache.delete(key);
    }
  });

  Array.from(rateLimitMap.entries()).forEach(([shapeId, timestamps]) => {
    const recent = timestamps.filter((t: number) => now - t < RATE_WINDOW);
    if (recent.length === 0) {
      rateLimitMap.delete(shapeId);
    } else {
      rateLimitMap.set(shapeId, recent);
    }
  });
}

// Enhanced Shape Dynamics endpoint
router.post('/enhanced-shape-dynamics', async (req, res) => {
  try {
    const { shapeId, shapeName, category, basicDynamics, triggerType = 'manual' } = req.body;
    
    if (!shapeId || !basicDynamics) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shape ID and basic dynamics required' 
      });
    }
    
    const { enhancedShapeDynamicsEngine } = await import('../enhanced-shape-dynamics-engine');
    
    // Check if automation should run for this trigger type
    if (!enhancedShapeDynamicsEngine.shouldRunAutomation(triggerType)) {
      return res.json({
        success: true,
        skipped: true,
        reason: `Automation skipped for trigger type: ${triggerType}`,
        timestamp: new Date().toISOString()
      });
    }
    
    console.log(`🎯 Running enhanced dynamics for ${shapeId} (trigger: ${triggerType})`);
    
    const enhancedDynamics = await enhancedShapeDynamicsEngine.computeEnhancedShapeDynamics(
      shapeId,
      shapeName || 'Unknown Shape',
      category || 'general',
      basicDynamics,
      triggerType
    );
    
    // Generate enhanced tokens
    const enhancedTokens = enhancedShapeDynamicsEngine.generateEnhancedTokens(shapeId, enhancedDynamics);
    
    // Validate results
    const isValid = enhancedShapeDynamicsEngine.validateEnhancedDynamics(enhancedDynamics);
    
    res.json({
      success: true,
      shapeId,
      enhancedDynamics,
      enhancedTokens,
      validationPassed: isValid,
      triggerType,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Enhanced dynamics computation error:', error);
    res.status(500).json({
      success: false,
      error: 'Enhanced dynamics computation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Export-triggered enhanced dynamics
router.post('/export-enhanced-dynamics', async (req, res) => {
  try {
    const { shapeId, exportType, basicDynamics } = req.body;
    
    if (!shapeId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Shape ID required for export dynamics' 
      });
    }
    
    const { enhancedShapeDynamicsEngine } = await import('../enhanced-shape-dynamics-engine');
    
    console.log(`📦 Running export-triggered enhanced dynamics for ${shapeId} (${exportType})`);
    
    const enhancedDynamics = await enhancedShapeDynamicsEngine.computeEnhancedShapeDynamics(
      shapeId,
      `Exported ${shapeId}`,
      'export-generated',
      basicDynamics || {},
      'export'
    );
    
    const enhancedTokens = enhancedShapeDynamicsEngine.generateEnhancedTokens(shapeId, enhancedDynamics);
    
    res.json({
      success: true,
      shapeId,
      exportType,
      enhancedDynamics,
      enhancedTokens,
      exportOptimized: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Export-triggered dynamics error:', error);
    res.status(500).json({
      success: false,
      error: 'Export dynamics computation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;