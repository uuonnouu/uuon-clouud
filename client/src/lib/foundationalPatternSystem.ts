/**
 * FOUNDATIONAL PATTERN SYSTEM - UUON Foundation Inc.
 * Universal Binary-Decimal Pattern Generation System
 * 
 * Core computational primitive for the Δmension Mathematical Universe
 * Creates alternating binary patterns (1, 10, 101, 1010...) with O(1) cached lookups
 * 
 * Applications:
 * - Hash distribution for token ecosystem
 * - Load balancing for 2,500+ shape calculations
 * - Adaptive sampling for real-time parameter morphing
 * - Memory efficiency for large mathematical datasets
 */

export interface PatternResult {
  index: number;
  binary: string;
  decimal: number;
  hash: string;
  normalized: number;
}

export interface PatternCache {
  patterns: Map<number, PatternResult>;
  maxCached: number;
  hits: number;
  misses: number;
}

export interface LoadBalanceResult {
  bucket: number;
  totalBuckets: number;
  distribution: number[];
  efficiency: number;
}

export interface AdaptiveSampleResult {
  samples: number[];
  density: number;
  coverage: number;
  pattern: string;
}

const PHI = (1 + Math.sqrt(5)) / 2;
const HASH_PRIME = 31;
const MAX_CACHE_SIZE = 10000;

let patternCache: PatternCache = {
  patterns: new Map(),
  maxCached: MAX_CACHE_SIZE,
  hits: 0,
  misses: 0
};

export function generateBinaryPattern(n: number): string {
  if (n <= 0) return '1';
  let pattern = '';
  for (let i = 0; i <= n; i++) {
    pattern += (i % 2 === 0) ? '1' : '0';
  }
  return pattern;
}

export function binaryToDecimal(binary: string): number {
  return parseInt(binary, 2);
}

export function generatePatternHash(binary: string, decimal: number): string {
  let hash = 0;
  for (let i = 0; i < binary.length; i++) {
    hash = (hash * HASH_PRIME + binary.charCodeAt(i)) >>> 0;
  }
  hash = (hash * HASH_PRIME + decimal) >>> 0;
  return hash.toString(16).padStart(8, '0');
}

export function getPattern(index: number): PatternResult {
  if (patternCache.patterns.has(index)) {
    patternCache.hits++;
    return patternCache.patterns.get(index)!;
  }

  patternCache.misses++;
  
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

  if (patternCache.patterns.size < patternCache.maxCached) {
    patternCache.patterns.set(index, result);
  }

  return result;
}

export function getPatternBatch(start: number, count: number): PatternResult[] {
  const results: PatternResult[] = [];
  for (let i = start; i < start + count; i++) {
    results.push(getPattern(i));
  }
  return results;
}

export function getCacheStats(): { hits: number; misses: number; size: number; hitRate: number } {
  const total = patternCache.hits + patternCache.misses;
  return {
    hits: patternCache.hits,
    misses: patternCache.misses,
    size: patternCache.patterns.size,
    hitRate: total > 0 ? patternCache.hits / total : 0
  };
}

export function clearCache(): void {
  patternCache.patterns.clear();
  patternCache.hits = 0;
  patternCache.misses = 0;
}

export function prewarmCache(count: number = 1000): void {
  const limit = Math.min(count, MAX_CACHE_SIZE);
  for (let i = 0; i < limit; i++) {
    getPattern(i);
  }
}

export function hashToIndex(hash: string, maxIndex: number): number {
  let value = 0;
  for (let i = 0; i < hash.length; i++) {
    value = (value * 16 + parseInt(hash[i], 16)) % maxIndex;
  }
  return value;
}

export function distributeLoad(itemCount: number, bucketCount: number): LoadBalanceResult {
  const distribution = new Array(bucketCount).fill(0);
  
  for (let i = 0; i < itemCount; i++) {
    const pattern = getPattern(i);
    const bucket = hashToIndex(pattern.hash, bucketCount);
    distribution[bucket]++;
  }
  
  const avg = itemCount / bucketCount;
  const variance = distribution.reduce((sum, count) => sum + Math.pow(count - avg, 2), 0) / bucketCount;
  const efficiency = 1 - Math.sqrt(variance) / avg;
  
  return {
    bucket: distribution.indexOf(Math.max(...distribution)),
    totalBuckets: bucketCount,
    distribution,
    efficiency: Math.max(0, Math.min(1, efficiency))
  };
}

export function adaptiveSample(
  totalPoints: number,
  targetSamples: number,
  densityFactor: number = 1.0
): AdaptiveSampleResult {
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
  
  while (samples.length < targetSamples && samples.length > 0) {
    const lastIdx = samples[samples.length - 1];
    if (lastIdx + step < totalPoints) {
      samples.push(lastIdx + step);
    } else {
      break;
    }
  }
  
  return {
    samples,
    density: samples.length / totalPoints,
    coverage: samples.length / targetSamples,
    pattern: getPattern(samples.length).binary
  };
}

export function generateTokenHash(shapeId: string, category: string): string {
  let combined = shapeId + ':' + category;
  let hash = 0;
  
  for (let i = 0; i < combined.length; i++) {
    const pattern = getPattern(i % 100);
    hash = (hash * HASH_PRIME + combined.charCodeAt(i) + pattern.decimal) >>> 0;
  }
  
  const patternSuffix = getPattern(hash % 1000).hash.substring(0, 4);
  return hash.toString(16).padStart(8, '0') + patternSuffix;
}

export function parameterToPattern(paramValue: number, paramName: string): PatternResult {
  const nameHash = paramName.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
  const index = Math.abs(Math.floor(paramValue * 100) + nameHash) % 10000;
  return getPattern(index);
}

export function morphingPattern(
  fromValue: number,
  toValue: number,
  t: number
): { value: number; pattern: PatternResult } {
  const fromPattern = getPattern(Math.abs(Math.floor(fromValue * 100)) % 1000);
  const toPattern = getPattern(Math.abs(Math.floor(toValue * 100)) % 1000);
  
  const interpolatedDecimal = fromPattern.decimal * (1 - t) + toPattern.decimal * t;
  const morphedValue = fromValue * (1 - t) + toValue * t;
  
  const resultPattern = getPattern(Math.floor(interpolatedDecimal) % 1000);
  
  return {
    value: morphedValue,
    pattern: resultPattern
  };
}

export function goldenPattern(n: number): PatternResult {
  const goldenIndex = Math.floor(n * PHI) % 10000;
  return getPattern(goldenIndex);
}

export function fibonacciPattern(n: number): PatternResult[] {
  const results: PatternResult[] = [];
  let a = 0, b = 1;
  
  for (let i = 0; i < n && i < 100; i++) {
    results.push(getPattern(a % 1000));
    [a, b] = [b, a + b];
  }
  
  return results;
}

export const FoundationalPatternSystem = {
  getPattern,
  getPatternBatch,
  getCacheStats,
  clearCache,
  prewarmCache,
  distributeLoad,
  adaptiveSample,
  generateTokenHash,
  parameterToPattern,
  morphingPattern,
  goldenPattern,
  fibonacciPattern,
  hashToIndex
};

export default FoundationalPatternSystem;
