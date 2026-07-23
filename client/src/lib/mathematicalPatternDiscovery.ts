/**
 * MATHEMATICAL PATTERN DISCOVERY ENGINE
 * Discovers similarities between shapes and enables cross-enhancement
 * Connects shapes with shared mathematical properties for fusion and optimization
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

// ═══════════════════════════════════════════════════════════════
// PATTERN SIGNATURES - Mathematical fingerprints for each shape
// ═══════════════════════════════════════════════════════════════

export interface PatternSignature {
  id: string;
  harmonicProfile: number[];
  symmetryGroup: string;
  topologicalGenus: number;
  curvatureType: 'positive' | 'negative' | 'zero' | 'mixed';
  dimensionality: number;
  periodicityX: number;
  periodicityY: number;
  hasInversion: boolean;
  hasReflection: boolean;
  hasRotation: boolean;
  dominantFrequencies: number[];
  parameterSensitivity: Record<string, number>;
}

export interface SimilarityMatch {
  shapeId: string;
  similarity: number;
  sharedPatterns: string[];
  fusionPotential: number;
  enhancementSuggestions: string[];
}

export interface EnhancementPath {
  sourceShape: string;
  targetShape: string;
  transformations: string[];
  parameterMappings: Record<string, string>;
  expectedOutcome: string;
}

// ═══════════════════════════════════════════════════════════════
// PATTERN DISCOVERY ENGINE
// ═══════════════════════════════════════════════════════════════

class MathematicalPatternDiscoveryEngine {
  private signatureCache: Map<string, PatternSignature> = new Map();
  private similarityMatrix: Map<string, Map<string, number>> = new Map();
  private enhancementPaths: EnhancementPath[] = [];

  // Mathematical constants for pattern analysis
  private readonly PHI = (1 + Math.sqrt(5)) / 2;
  private readonly PI = Math.PI;
  private readonly E = Math.E;

  analyzeShape(
    shapeId: string,
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    defaultParams: SurfaceParameters
  ): PatternSignature {
    if (this.signatureCache.has(shapeId)) {
      return this.signatureCache.get(shapeId)!;
    }

    const samples = this.sampleSurface(equation, defaultParams);
    const harmonicProfile = this.computeHarmonicProfile(samples);
    const symmetryGroup = this.detectSymmetryGroup(samples);
    const curvatureType = this.analyzeCurvature(samples);
    const periodicityX = this.detectPeriodicity(samples, 'x');
    const periodicityY = this.detectPeriodicity(samples, 'y');
    const dominantFrequencies = this.extractDominantFrequencies(samples);
    const parameterSensitivity = this.computeParameterSensitivity(equation, defaultParams);

    const signature: PatternSignature = {
      id: shapeId,
      harmonicProfile,
      symmetryGroup,
      topologicalGenus: this.estimateGenus(samples),
      curvatureType,
      dimensionality: 3,
      periodicityX,
      periodicityY,
      hasInversion: this.hasInversionSymmetry(samples),
      hasReflection: this.hasReflectionSymmetry(samples),
      hasRotation: this.hasRotationalSymmetry(samples),
      dominantFrequencies,
      parameterSensitivity
    };

    this.signatureCache.set(shapeId, signature);
    return signature;
  }

  private sampleSurface(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    params: SurfaceParameters
  ): Array<[number, number, number]> {
    const samples: Array<[number, number, number]> = [];
    const resolution = 16;

    for (let i = 0; i <= resolution; i++) {
      for (let j = 0; j <= resolution; j++) {
        const u = i / resolution;
        const v = j / resolution;
        try {
          const point = equation(u, v, params);
          if (point.every(c => isFinite(c))) {
            samples.push(point);
          }
        } catch (e) {
          // Skip invalid points
        }
      }
    }

    return samples;
  }

  private computeHarmonicProfile(samples: Array<[number, number, number]>): number[] {
    const profile: number[] = [];
    const n = samples.length;
    
    for (let freq = 1; freq <= 8; freq++) {
      let sumCos = 0, sumSin = 0;
      for (let i = 0; i < n; i++) {
        const t = i / n * 2 * Math.PI * freq;
        const mag = Math.sqrt(samples[i][0]**2 + samples[i][1]**2 + samples[i][2]**2);
        sumCos += mag * Math.cos(t);
        sumSin += mag * Math.sin(t);
      }
      profile.push(Math.sqrt(sumCos**2 + sumSin**2) / n);
    }
    
    return profile;
  }

  private detectSymmetryGroup(samples: Array<[number, number, number]>): string {
    const hasC2 = this.hasRotationalSymmetry(samples, 2);
    const hasC3 = this.hasRotationalSymmetry(samples, 3);
    const hasC4 = this.hasRotationalSymmetry(samples, 4);
    const hasC6 = this.hasRotationalSymmetry(samples, 6);
    const hasReflection = this.hasReflectionSymmetry(samples);

    if (hasC6 && hasReflection) return 'D6';
    if (hasC4 && hasReflection) return 'D4';
    if (hasC3 && hasReflection) return 'D3';
    if (hasC2 && hasReflection) return 'D2';
    if (hasC6) return 'C6';
    if (hasC4) return 'C4';
    if (hasC3) return 'C3';
    if (hasC2) return 'C2';
    if (hasReflection) return 'Cs';
    return 'C1';
  }

  private analyzeCurvature(samples: Array<[number, number, number]>): 'positive' | 'negative' | 'zero' | 'mixed' {
    let positive = 0, negative = 0, zero = 0;
    
    for (let i = 1; i < samples.length - 1; i++) {
      const prev = samples[i - 1];
      const curr = samples[i];
      const next = samples[i + 1];
      
      const v1 = [curr[0] - prev[0], curr[1] - prev[1], curr[2] - prev[2]];
      const v2 = [next[0] - curr[0], next[1] - curr[1], next[2] - curr[2]];
      
      const cross = v1[0] * v2[1] - v1[1] * v2[0];
      
      if (cross > 0.01) positive++;
      else if (cross < -0.01) negative++;
      else zero++;
    }

    const total = positive + negative + zero;
    if (total === 0) return 'zero';
    
    if (positive > total * 0.7) return 'positive';
    if (negative > total * 0.7) return 'negative';
    if (zero > total * 0.7) return 'zero';
    return 'mixed';
  }

  private detectPeriodicity(samples: Array<[number, number, number]>, axis: 'x' | 'y' | 'z'): number {
    const idx = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    const values = samples.map(s => s[idx]);
    
    for (let period = 2; period <= values.length / 2; period++) {
      let matches = 0;
      for (let i = 0; i < values.length - period; i++) {
        if (Math.abs(values[i] - values[i + period]) < 0.1) {
          matches++;
        }
      }
      if (matches > (values.length - period) * 0.8) {
        return period;
      }
    }
    
    return 0;
  }

  private extractDominantFrequencies(samples: Array<[number, number, number]>): number[] {
    const profile = this.computeHarmonicProfile(samples);
    const indexed = profile.map((v, i) => ({ freq: i + 1, amplitude: v }));
    indexed.sort((a, b) => b.amplitude - a.amplitude);
    return indexed.slice(0, 3).map(f => f.freq);
  }

  private computeParameterSensitivity(
    equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number],
    baseParams: SurfaceParameters
  ): Record<string, number> {
    const sensitivity: Record<string, number> = {};
    const paramKeys = ['a', 'b', 'c', 'd', 'e', 'f'];
    const delta = 0.1;

    const baseSamples = this.sampleSurface(equation, baseParams);
    const baseEnergy = this.computeEnergy(baseSamples);

    for (const key of paramKeys) {
      const testParams = { ...baseParams, [key]: ((baseParams[key as keyof SurfaceParameters] as number) || 1) + delta };
      const testSamples = this.sampleSurface(equation, testParams);
      const testEnergy = this.computeEnergy(testSamples);
      sensitivity[key] = Math.abs(testEnergy - baseEnergy) / delta;
    }

    return sensitivity;
  }

  private computeEnergy(samples: Array<[number, number, number]>): number {
    return samples.reduce((sum, s) => sum + s[0]**2 + s[1]**2 + s[2]**2, 0) / samples.length;
  }

  private estimateGenus(samples: Array<[number, number, number]>): number {
    const n = samples.length;
    let holes = 0;
    
    const centroid = samples.reduce(
      (acc, s) => [acc[0] + s[0]/n, acc[1] + s[1]/n, acc[2] + s[2]/n] as [number, number, number],
      [0, 0, 0] as [number, number, number]
    );
    
    const distances = samples.map(s => 
      Math.sqrt((s[0]-centroid[0])**2 + (s[1]-centroid[1])**2 + (s[2]-centroid[2])**2)
    );
    
    const avgDist = distances.reduce((a, b) => a + b, 0) / n;
    const minDist = Math.min(...distances);
    
    if (minDist < avgDist * 0.3) holes = 1;
    if (minDist < avgDist * 0.1) holes = 2;
    
    return holes;
  }

  private hasInversionSymmetry(samples: Array<[number, number, number]>): boolean {
    const n = samples.length;
    let matches = 0;
    
    for (const sample of samples) {
      const inverted: [number, number, number] = [-sample[0], -sample[1], -sample[2]];
      for (const other of samples) {
        if (Math.abs(other[0] - inverted[0]) < 0.1 &&
            Math.abs(other[1] - inverted[1]) < 0.1 &&
            Math.abs(other[2] - inverted[2]) < 0.1) {
          matches++;
          break;
        }
      }
    }
    
    return matches > n * 0.7;
  }

  private hasReflectionSymmetry(samples: Array<[number, number, number]>): boolean {
    const n = samples.length;
    let matchesXY = 0, matchesXZ = 0, matchesYZ = 0;
    
    for (const sample of samples) {
      for (const other of samples) {
        if (Math.abs(other[0] - sample[0]) < 0.1 &&
            Math.abs(other[1] - sample[1]) < 0.1 &&
            Math.abs(other[2] + sample[2]) < 0.1) matchesXY++;
        if (Math.abs(other[0] - sample[0]) < 0.1 &&
            Math.abs(other[1] + sample[1]) < 0.1 &&
            Math.abs(other[2] - sample[2]) < 0.1) matchesXZ++;
        if (Math.abs(other[0] + sample[0]) < 0.1 &&
            Math.abs(other[1] - sample[1]) < 0.1 &&
            Math.abs(other[2] - sample[2]) < 0.1) matchesYZ++;
      }
    }
    
    return matchesXY > n * 0.5 || matchesXZ > n * 0.5 || matchesYZ > n * 0.5;
  }

  private hasRotationalSymmetry(samples: Array<[number, number, number]>, fold: number = 2): boolean {
    const angle = (2 * Math.PI) / fold;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const n = samples.length;
    let matches = 0;
    
    for (const sample of samples) {
      const rotated: [number, number, number] = [
        sample[0] * cos - sample[1] * sin,
        sample[0] * sin + sample[1] * cos,
        sample[2]
      ];
      
      for (const other of samples) {
        if (Math.abs(other[0] - rotated[0]) < 0.15 &&
            Math.abs(other[1] - rotated[1]) < 0.15 &&
            Math.abs(other[2] - rotated[2]) < 0.15) {
          matches++;
          break;
        }
      }
    }
    
    return matches > n * 0.6;
  }

  // ═══════════════════════════════════════════════════════════════
  // SIMILARITY COMPUTATION
  // ═══════════════════════════════════════════════════════════════

  computeSimilarity(sig1: PatternSignature, sig2: PatternSignature): number {
    let score = 0;
    let maxScore = 0;

    // Harmonic profile similarity (weighted heavily)
    maxScore += 30;
    const harmonicDiff = sig1.harmonicProfile.reduce((sum, v, i) => 
      sum + Math.abs(v - (sig2.harmonicProfile[i] || 0)), 0);
    score += Math.max(0, 30 - harmonicDiff * 5);

    // Symmetry group match
    maxScore += 20;
    if (sig1.symmetryGroup === sig2.symmetryGroup) score += 20;
    else if (sig1.symmetryGroup[0] === sig2.symmetryGroup[0]) score += 10;

    // Curvature type match
    maxScore += 15;
    if (sig1.curvatureType === sig2.curvatureType) score += 15;
    else if (sig1.curvatureType === 'mixed' || sig2.curvatureType === 'mixed') score += 7;

    // Topological genus match
    maxScore += 15;
    if (sig1.topologicalGenus === sig2.topologicalGenus) score += 15;
    else if (Math.abs(sig1.topologicalGenus - sig2.topologicalGenus) === 1) score += 8;

    // Dominant frequency overlap
    maxScore += 10;
    const freqOverlap = sig1.dominantFrequencies.filter(f => sig2.dominantFrequencies.includes(f)).length;
    score += (freqOverlap / 3) * 10;

    // Symmetry property matches
    maxScore += 10;
    if (sig1.hasInversion === sig2.hasInversion) score += 3;
    if (sig1.hasReflection === sig2.hasReflection) score += 3;
    if (sig1.hasRotation === sig2.hasRotation) score += 4;

    return (score / maxScore) * 100;
  }

  findSimilarShapes(
    signature: PatternSignature,
    allSignatures: PatternSignature[],
    minSimilarity: number = 50
  ): SimilarityMatch[] {
    const matches: SimilarityMatch[] = [];

    for (const other of allSignatures) {
      if (other.id === signature.id) continue;

      const similarity = this.computeSimilarity(signature, other);
      if (similarity >= minSimilarity) {
        const sharedPatterns = this.identifySharedPatterns(signature, other);
        const fusionPotential = this.computeFusionPotential(signature, other);
        const enhancementSuggestions = this.generateEnhancementSuggestions(signature, other);

        matches.push({
          shapeId: other.id,
          similarity,
          sharedPatterns,
          fusionPotential,
          enhancementSuggestions
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  private identifySharedPatterns(sig1: PatternSignature, sig2: PatternSignature): string[] {
    const patterns: string[] = [];

    if (sig1.symmetryGroup === sig2.symmetryGroup) {
      patterns.push(`Shared symmetry: ${sig1.symmetryGroup}`);
    }
    if (sig1.curvatureType === sig2.curvatureType) {
      patterns.push(`Same curvature: ${sig1.curvatureType}`);
    }
    if (sig1.topologicalGenus === sig2.topologicalGenus) {
      patterns.push(`Same genus: ${sig1.topologicalGenus}`);
    }
    
    const sharedFreqs = sig1.dominantFrequencies.filter(f => sig2.dominantFrequencies.includes(f));
    if (sharedFreqs.length > 0) {
      patterns.push(`Shared harmonics: ${sharedFreqs.join(', ')}`);
    }

    return patterns;
  }

  private computeFusionPotential(sig1: PatternSignature, sig2: PatternSignature): number {
    let potential = 0;

    // Similar symmetry groups fuse well
    if (sig1.symmetryGroup === sig2.symmetryGroup) potential += 25;
    else if (sig1.symmetryGroup[0] === sig2.symmetryGroup[0]) potential += 15;

    // Same curvature type enables smooth blending
    if (sig1.curvatureType === sig2.curvatureType) potential += 20;
    
    // Matching topology allows seamless joining
    if (sig1.topologicalGenus === sig2.topologicalGenus) potential += 20;

    // Harmonic compatibility
    const harmonicCompatibility = this.computeHarmonicCompatibility(
      sig1.dominantFrequencies, 
      sig2.dominantFrequencies
    );
    potential += harmonicCompatibility * 35;

    return Math.min(100, potential);
  }

  private computeHarmonicCompatibility(freqs1: number[], freqs2: number[]): number {
    let compatibility = 0;
    
    for (const f1 of freqs1) {
      for (const f2 of freqs2) {
        // Check for harmonic relationships (ratios of small integers)
        const ratio = f1 / f2;
        if (Math.abs(ratio - 1) < 0.1) compatibility += 0.3;
        else if (Math.abs(ratio - 2) < 0.1 || Math.abs(ratio - 0.5) < 0.1) compatibility += 0.2;
        else if (Math.abs(ratio - 1.5) < 0.1 || Math.abs(ratio - 0.667) < 0.1) compatibility += 0.15;
        else if (Math.abs(ratio - this.PHI) < 0.1) compatibility += 0.25; // Golden ratio
      }
    }
    
    return Math.min(1, compatibility);
  }

  private generateEnhancementSuggestions(sig1: PatternSignature, sig2: PatternSignature): string[] {
    const suggestions: string[] = [];

    if (sig1.symmetryGroup !== sig2.symmetryGroup) {
      suggestions.push(`Apply ${sig2.symmetryGroup} symmetry transform to enhance structure`);
    }

    if (sig1.curvatureType !== sig2.curvatureType && sig2.curvatureType !== 'mixed') {
      suggestions.push(`Blend with ${sig2.curvatureType} curvature regions from ${sig2.id}`);
    }

    const uniqueFreqs = sig2.dominantFrequencies.filter(f => !sig1.dominantFrequencies.includes(f));
    if (uniqueFreqs.length > 0) {
      suggestions.push(`Add harmonic components at frequencies ${uniqueFreqs.join(', ')}`);
    }

    // Parameter sensitivity suggestions
    for (const [param, sensitivity] of Object.entries(sig2.parameterSensitivity)) {
      if (sensitivity > (sig1.parameterSensitivity[param] || 0) * 1.5) {
        suggestions.push(`Parameter ${param} has higher impact - consider mapping from ${sig2.id}`);
      }
    }

    return suggestions;
  }

  // ═══════════════════════════════════════════════════════════════
  // CROSS-ENHANCEMENT GENERATION
  // ═══════════════════════════════════════════════════════════════

  generateEnhancementPath(source: PatternSignature, target: PatternSignature): EnhancementPath {
    const transformations: string[] = [];
    const parameterMappings: Record<string, string> = {};

    // Symmetry transformation
    if (source.symmetryGroup !== target.symmetryGroup) {
      transformations.push(`symmetry_transform(${source.symmetryGroup} -> ${target.symmetryGroup})`);
    }

    // Curvature blending
    if (source.curvatureType !== target.curvatureType) {
      transformations.push(`curvature_blend(${source.curvatureType}, ${target.curvatureType}, t)`);
    }

    // Harmonic addition
    const newFreqs = target.dominantFrequencies.filter(f => !source.dominantFrequencies.includes(f));
    for (const freq of newFreqs) {
      transformations.push(`add_harmonic(frequency=${freq}, amplitude=0.1)`);
    }

    // Map parameters based on sensitivity
    for (const [param, sensitivity] of Object.entries(source.parameterSensitivity)) {
      const targetSensitivity = target.parameterSensitivity[param] || 0;
      if (Math.abs(sensitivity - targetSensitivity) < sensitivity * 0.3) {
        parameterMappings[param] = param;
      }
    }

    return {
      sourceShape: source.id,
      targetShape: target.id,
      transformations,
      parameterMappings,
      expectedOutcome: `Enhanced ${source.id} with ${target.id} characteristics`
    };
  }

  // ═══════════════════════════════════════════════════════════════
  // BATCH ANALYSIS AND NETWORK BUILDING
  // ═══════════════════════════════════════════════════════════════

  buildSimilarityNetwork(signatures: PatternSignature[]): Map<string, SimilarityMatch[]> {
    const network = new Map<string, SimilarityMatch[]>();

    for (const sig of signatures) {
      const matches = this.findSimilarShapes(sig, signatures, 40);
      network.set(sig.id, matches);
    }

    return network;
  }

  findOptimalFusionPairs(signatures: PatternSignature[]): Array<{ pair: [string, string]; score: number }> {
    const pairs: Array<{ pair: [string, string]; score: number }> = [];

    for (let i = 0; i < signatures.length; i++) {
      for (let j = i + 1; j < signatures.length; j++) {
        const fusionScore = this.computeFusionPotential(signatures[i], signatures[j]);
        if (fusionScore >= 60) {
          pairs.push({
            pair: [signatures[i].id, signatures[j].id],
            score: fusionScore
          });
        }
      }
    }

    return pairs.sort((a, b) => b.score - a.score);
  }

  getStatistics(): { cacheSize: number; enhancementPaths: number } {
    return {
      cacheSize: this.signatureCache.size,
      enhancementPaths: this.enhancementPaths.length
    };
  }
}

export const patternDiscoveryEngine = new MathematicalPatternDiscoveryEngine();

