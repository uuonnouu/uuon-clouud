import { Router, Request, Response } from 'express';
// Lazy-loaded to prevent all shape libraries loading at server startup
let _unifiedShapes: Record<string, any> | null = null;
async function getUnifiedShapes() {
  if (!_unifiedShapes) {
    const mod = await import('../client/src/lib/unifiedShapes');
    _unifiedShapes = (mod as any).UNIFIED_SHAPES || (mod as any).default || mod;
  }
  return _unifiedShapes!;
}

const router = Router();

const validateAPIKey = (req: Request, res: Response, next: Function) => {
  const apiKey = (req.headers['x-api-key'] || req.body?._apiKey) as string;
  if (!apiKey) return res.status(401).json({ error: 'API key required' });
  if (req.body?._apiKey) delete req.body._apiKey;
  // API key validation enabled - future: add database validation, rate limiting, usage tracking
  next();
};

interface VerificationRequest {
  algorithmId: string;
  parameters: Record<string, number>;
  uDomain?: [number, number];
  vDomain?: [number, number];
  metadata?: { projectName?: string; requestedBy?: string; purpose?: string };
}

interface VerificationResponse {
  algorithmId?: string;
  isValid: boolean;
  validation: {
    hasNaN: boolean;
    hasInfinity: boolean;
    hasSingularities: boolean;
    singularityCount: number;
    parameterRangeValid: boolean;
    geometryGenerated: boolean;
  };
  properties?: {
    vertexCount: number;
    boundingBox: { min: [number, number, number]; max: [number, number, number] };
    surfaceArea?: number;
  };
  warnings: string[];
  errors: string[];
  timestamp: string;
}

const createErrorResponse = (algorithmId: string, errorMsg: string): VerificationResponse => ({
  algorithmId,
  isValid: false,
  validation: {
    hasNaN: false, hasInfinity: false, hasSingularities: false,
    singularityCount: 0, parameterRangeValid: false, geometryGenerated: false
  },
  warnings: [], errors: [errorMsg], timestamp: new Date().toISOString()
});

router.post('/verify-surface', validateAPIKey, async (req: Request, res: Response) => {
  try {
    const { algorithmId, parameters, uDomain = [0, 1], vDomain = [0, 1] }: VerificationRequest = req.body;
    if (!algorithmId || !parameters) {
      return res.status(400).json({ error: 'Missing required fields: algorithmId and parameters' });
    }

    const UNIFIED_SHAPES = await getUnifiedShapes();
    const algorithm = UNIFIED_SHAPES[algorithmId as keyof typeof UNIFIED_SHAPES];
    if (!algorithm) {
      return res.status(404).json({ error: 'Algorithm not found', message: `Algorithm ID "${algorithmId}" not in verified library` });
    }

    const verification = await verifySurfaceWithInternalAlgorithm(algorithm.equation, parameters, uDomain, vDomain);
    res.json({ ...verification, algorithmId, timestamp: new Date().toISOString() });
  } catch (error: any) {
    res.status(500).json({ error: 'Verification failed', message: error.message });
  }
});

router.post('/verify-batch', validateAPIKey, async (req: Request, res: Response) => {
  try {
    const { shapes }: { shapes: VerificationRequest[] } = req.body;
    if (!shapes || !Array.isArray(shapes)) {
      return res.status(400).json({ error: 'Expected array of shapes to verify' });
    }

    const UNIFIED_SHAPES = await getUnifiedShapes();
    const results = await Promise.all(shapes.map(async (shape) => {
      try {
        const algorithm = UNIFIED_SHAPES[shape.algorithmId as keyof typeof UNIFIED_SHAPES];
        if (!algorithm) return createErrorResponse(shape.algorithmId, `Algorithm ID "${shape.algorithmId}" not found`);
        
        const verification = await verifySurfaceWithInternalAlgorithm(
          algorithm.equation, shape.parameters, shape.uDomain || [0, 1], shape.vDomain || [0, 1]
        );
        return { algorithmId: shape.algorithmId, ...verification, timestamp: new Date().toISOString() };
      } catch (error: any) {
        return createErrorResponse(shape.algorithmId, `Verification failed: ${error.message}`);
      }
    }));

    const validCount = results.filter(r => r.isValid).length;
    res.json({
      results,
      summary: { total: shapes.length, valid: validCount, invalid: shapes.length - validCount },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Batch verification failed', message: error.message });
  }
});

async function verifySurfaceWithInternalAlgorithm(
  equationFunc: (u: number, v: number, params: any) => [number, number, number],
  parameters: Record<string, number>,
  uDomain: [number, number],
  vDomain: [number, number]
): Promise<Omit<VerificationResponse, 'timestamp' | 'algorithmId'>> {
  const warnings: string[] = [];
  const errors: string[] = [];
  let hasNaN = false, hasInfinity = false, singularityCount = 0, vertexCount = 0;
  const minPoint: [number, number, number] = [Infinity, Infinity, Infinity];
  const maxPoint: [number, number, number] = [-Infinity, -Infinity, -Infinity];

  try {
    const parameterRangeValid = Object.values(parameters).every(
      val => typeof val === 'number' && !isNaN(val) && isFinite(val)
    );
    if (!parameterRangeValid) errors.push('Invalid parameter values detected');

    const sampleResolution = 20;
    for (let i = 0; i <= sampleResolution; i++) {
      for (let j = 0; j <= sampleResolution; j++) {
        const u = uDomain[0] + (uDomain[1] - uDomain[0]) * i / sampleResolution;
        const v = vDomain[0] + (vDomain[1] - vDomain[0]) * j / sampleResolution;

        try {
          const [x, y, z] = equationFunc(u, v, parameters);
          if (isNaN(x) || isNaN(y) || isNaN(z)) { hasNaN = true; singularityCount++; continue; }
          if (!isFinite(x) || !isFinite(y) || !isFinite(z)) { hasInfinity = true; singularityCount++; continue; }

          minPoint[0] = Math.min(minPoint[0], x); minPoint[1] = Math.min(minPoint[1], y); minPoint[2] = Math.min(minPoint[2], z);
          maxPoint[0] = Math.max(maxPoint[0], x); maxPoint[1] = Math.max(maxPoint[1], y); maxPoint[2] = Math.max(maxPoint[2], z);
          vertexCount++;
        } catch (err: any) {
          errors.push(`Equation error at (u=${u.toFixed(2)}, v=${v.toFixed(2)}): ${err.message}`);
          singularityCount++;
        }
      }
    }

    const geometryGenerated = vertexCount > 0;
    if (hasNaN) warnings.push(`Found ${singularityCount} NaN values in surface`);
    if (hasInfinity) warnings.push(`Found ${singularityCount} infinite values in surface`);
    if (singularityCount > (sampleResolution * sampleResolution * 0.1)) {
      warnings.push(`High singularity density: ${singularityCount} points failed`);
    }

    return {
      isValid: errors.length === 0 && geometryGenerated && !hasNaN && !hasInfinity,
      validation: { hasNaN, hasInfinity, hasSingularities: singularityCount > 0, singularityCount, parameterRangeValid, geometryGenerated },
      properties: geometryGenerated ? { vertexCount, boundingBox: { min: minPoint, max: maxPoint } } : undefined,
      warnings, errors
    };
  } catch (error: any) {
    return {
      isValid: false,
      validation: { hasNaN: true, hasInfinity: true, hasSingularities: true, singularityCount: 0, parameterRangeValid: false, geometryGenerated: false },
      warnings, errors: [...errors, `Equation parsing failed: ${error.message}`]
    };
  }
}

router.get('/verification-capabilities', async (req: Request, res: Response) => {
  try {
    const UNIFIED_SHAPES = await getUnifiedShapes();
    const algorithms = Object.keys(UNIFIED_SHAPES);
    res.json({
      algorithms,
      total: algorithms.length,
      categories: {
        quantum: algorithms.filter(a => a.includes('quantum')).length,
        biological: algorithms.filter(a => a.includes('cell') || a.includes('mitochondria')).length,
        minimal: algorithms.filter(a => a.includes('minimal')).length,
        topological: algorithms.filter(a => a.includes('klein') || a.includes('mobius')).length,
        total: algorithms.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to get capabilities', message: error.message });
  }
});

export default router;
