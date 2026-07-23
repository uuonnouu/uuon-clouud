/**
 * FOUNDATIONAL PATTERN API - UUON Foundation Inc.
 * REST API endpoints for pattern generation and hash distribution
 * 
 * Provides server-side pattern operations for:
 * - Token hash generation
 * - Load balancing calculations
 * - Adaptive sampling coordination
 * - Cross-system pattern synchronization
 */

import { Router, Request, Response } from 'express';

const router = Router();

const PHI = (1 + Math.sqrt(5)) / 2;
const HASH_PRIME = 31;
const MAX_CACHE_SIZE = 10000;

interface PatternResult {
  index: number;
  binary: string;
  decimal: number;
  hash: string;
  normalized: number;
}

interface PatternCache {
  patterns: Map<number, PatternResult>;
  hits: number;
  misses: number;
}

const serverPatternCache: PatternCache = {
  patterns: new Map(),
  hits: 0,
  misses: 0
};

function generateBinaryPattern(n: number): string {
  if (n <= 0) return '1';
  let pattern = '';
  for (let i = 0; i <= n; i++) {
    pattern += (i % 2 === 0) ? '1' : '0';
  }
  return pattern;
}

function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2);
}

function generatePatternHash(binary: string, decimal: number): string {
  let hash = 0;
  for (let i = 0; i < binary.length; i++) {
    hash = (hash * HASH_PRIME + binary.charCodeAt(i)) >>> 0;
  }
  hash = (hash * HASH_PRIME + decimal) >>> 0;
  return hash.toString(16).padStart(8, '0');
}

function getPattern(index: number): PatternResult {
  if (serverPatternCache.patterns.has(index)) {
    serverPatternCache.hits++;
    return serverPatternCache.patterns.get(index)!;
  }

  serverPatternCache.misses++;
  
  const binary = generateBinaryPattern(index);
  const decimal = binaryToDecimal(binary);
  const hash = generatePatternHash(binary, decimal);
  const normalized = decimal / Math.pow(2, binary.length);

  const result: PatternResult = {
    index,
    binary,
    decimal,
    hash,
    normalized
  };

  if (serverPatternCache.patterns.size < MAX_CACHE_SIZE) {
    serverPatternCache.patterns.set(index, result);
  }

  return result;
}

function hashToIndex(hash: string, maxIndex: number): number {
  let value = 0;
  for (let i = 0; i < hash.length; i++) {
    value = (value * 16 + parseInt(hash[i], 16)) % maxIndex;
  }
  return value;
}

function generateTokenHash(shapeId: string, category: string): string {
  let combined = shapeId + ':' + category;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const pattern = getPattern(i % 100);
    hash = (hash * HASH_PRIME + combined.charCodeAt(i) + pattern.decimal) >>> 0;
  }
  
  const patternSuffix = getPattern(hash % 1000).hash.substring(0, 4);
  return hash.toString(16).padStart(8, '0') + patternSuffix;
}

router.get('/pattern/:index', (req: Request, res: Response) => {
  try {
    const index = parseInt(req.params.index, 10);
    
    if (isNaN(index) || index < 0 || index > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid index. Must be between 0 and 100000'
      });
    }
    
    const pattern = getPattern(index);
    
    res.json({
      success: true,
      pattern,
      cached: serverPatternCache.patterns.has(index)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate pattern'
    });
  }
});

router.get('/pattern/batch/:start/:count', (req: Request, res: Response) => {
  try {
    const start = parseInt(req.params.start, 10);
    const count = parseInt(req.params.count, 10);
    
    if (isNaN(start) || isNaN(count) || count > 1000 || count < 1) {
      return res.status(400).json({
        success: false,
        error: 'Invalid parameters. Count must be between 1 and 1000'
      });
    }
    
    const patterns: PatternResult[] = [];
    for (let i = start; i < start + count; i++) {
      patterns.push(getPattern(i));
    }
    
    res.json({
      success: true,
      patterns,
      count: patterns.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate pattern batch'
    });
  }
});

router.post('/token-hash', (req: Request, res: Response) => {
  try {
    const { shapeId, category } = req.body;
    
    if (!shapeId || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing shapeId or category'
      });
    }
    
    const tokenHash = generateTokenHash(shapeId, category);
    const patternIndex = hashToIndex(tokenHash, 10000);
    const pattern = getPattern(patternIndex);
    
    res.json({
      success: true,
      tokenHash,
      pattern,
      shapeId,
      category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate token hash'
    });
  }
});

router.post('/load-balance', (req: Request, res: Response) => {
  try {
    const { itemCount, bucketCount = 16 } = req.body;
    
    if (!itemCount || itemCount < 1 || itemCount > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid itemCount. Must be between 1 and 100000'
      });
    }
    
    const distribution = new Array(bucketCount).fill(0);
    
    for (let i = 0; i < itemCount; i++) {
      const pattern = getPattern(i);
      const bucket = hashToIndex(pattern.hash, bucketCount);
      distribution[bucket]++;
    }
    
    const avg = itemCount / bucketCount;
    const variance = distribution.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / bucketCount;
    const efficiency = 1 - Math.sqrt(variance) / avg;
    
    res.json({
      success: true,
      distribution,
      bucketCount,
      itemCount,
      efficiency: Math.max(0, Math.min(1, efficiency)),
      average: avg
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to calculate load distribution'
    });
  }
});

router.post('/adaptive-sample', (req: Request, res: Response) => {
  try {
    const { totalPoints, targetSamples, densityFactor = 1.0 } = req.body;
    
    if (!totalPoints || !targetSamples) {
      return res.status(400).json({
        success: false,
        error: 'Missing totalPoints or targetSamples'
      });
    }
    
    const samples: number[] = [];
    const adjustedDensity = densityFactor * PHI;
    const step = Math.max(1, Math.floor(totalPoints / targetSamples));
    
    for (let i = 0; i < totalPoints && samples.length < targetSamples; i += step) {
      const pattern = getPattern(i);
      const shouldSample = pattern.normalized * adjustedDensity > 0.3;
      
      if (shouldSample || samples.length < targetSamples / 2) {
        samples.push(i);
      }
    }
    
    res.json({
      success: true,
      samples,
      sampleCount: samples.length,
      density: samples.length / totalPoints,
      coverage: samples.length / targetSamples
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate adaptive samples'
    });
  }
});

router.get('/cache-stats', (_req: Request, res: Response) => {
  const total = serverPatternCache.hits + serverPatternCache.misses;
  
  res.json({
    success: true,
    stats: {
      hits: serverPatternCache.hits,
      misses: serverPatternCache.misses,
      size: serverPatternCache.patterns.size,
      maxSize: MAX_CACHE_SIZE,
      hitRate: total > 0 ? serverPatternCache.hits / total : 0
    }
  });
});

router.post('/prewarm', (req: Request, res: Response) => {
  try {
    const { count = 1000 } = req.body;
    const limit = Math.min(count, MAX_CACHE_SIZE);
    
    const startSize = serverPatternCache.patterns.size;
    
    for (let i = 0; i < limit; i++) {
      getPattern(i);
    }
    
    const endSize = serverPatternCache.patterns.size;
    
    res.json({
      success: true,
      message: `Cache prewarmed with ${limit} patterns`,
      previousSize: startSize,
      currentSize: endSize,
      added: endSize - startSize
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to prewarm cache'
    });
  }
});

router.get('/golden/:n', (req: Request, res: Response) => {
  try {
    const n = parseInt(req.params.n, 10);
    
    if (isNaN(n) || n < 0 || n > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid n. Must be between 0 and 100000'
      });
    }
    
    const goldenIndex = Math.floor(n * PHI) % 10000;
    const pattern = getPattern(goldenIndex);
    
    res.json({
      success: true,
      input: n,
      goldenIndex,
      pattern,
      phi: PHI
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate golden pattern'
    });
  }
});

router.get('/fibonacci/:count', (req: Request, res: Response) => {
  try {
    const count = parseInt(req.params.count, 10);
    
    if (isNaN(count) || count < 1 || count > 100) {
      return res.status(400).json({
        success: false,
        error: 'Invalid count. Must be between 1 and 100'
      });
    }
    
    const patterns: PatternResult[] = [];
    let a = 0, b = 1;
    
    for (let i = 0; i < count; i++) {
      patterns.push(getPattern(a % 1000));
      [a, b] = [b, a + b];
    }
    
    res.json({
      success: true,
      patterns,
      count: patterns.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate fibonacci patterns'
    });
  }
});

for (let i = 0; i < 100; i++) {
  getPattern(i);
}

console.log('🧬 Foundational Pattern API loaded');
console.log('   📊 Pattern generation endpoints ready');
console.log('   🔗 Token hash distribution active');
console.log('   ⚖️ Load balancing algorithms enabled');
console.log('   🎯 Adaptive sampling operational');

export default router;
