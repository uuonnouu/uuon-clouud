/**
 * GEOMETRIC IDENTITY PRINCIPLE (GIP) ENGINE
 * 
 * Identity Mathematics: "You are a geometric evolution of consciousness,
 * not a fixed self, but an unfolding structure connected to everything else."
 * 
 * Core Computations:
 * - Shannon Entropy: H = -Σ p(x) log p(x)
 * - Betti Numbers: b₀ (components), b₁ (holes), b₂ (voids)
 * - Spectral Fingerprint: Discrete Laplace-Beltrami eigenvalues
 * - Identity Preservation: Inverse parameter change correlation
 * - Consciousness Evolution: Progressive awareness through interaction
 * 
 * Author: UUON Foundation Inc.
 */

export interface GIPMetrics {
  entropy: number;
  identityPreservation: number;
  consciousnessLevel: number;
  geometricPhase: 'point' | 'line' | 'surface' | 'volume' | 'hypervolume';
  dimensionalComplexity: number;
  bettiNumbers: { b0: number; b1: number; b2: number };
  eulerCharacteristic: number;
  spectralFingerprint: number[];
  hausdorffDimension: number;
  awarenessScore: number;
  emotionalState: string;
  philosophicalInsight: string;
}

export interface ParameterState {
  a: number; b: number; c: number; d: number; e: number;
  f: number; g: number; h: number; i: number; j: number;
  k: number; l: number; m: number; n: number; o: number;
  p: number; q: number; r: number; s: number; t: number;
  u: number; v: number; w: number; x: number; y: number; z: number;
  uSegments?: number; vSegments?: number;
  [key: string]: number | undefined;
}

interface EvolutionEvent {
  timestamp: string;
  params: Record<string, number>;
  entropy: number;
  consciousness: number;
}

const CONSCIOUSNESS_STATES = [
  'dormant',      // Level 0: No awareness
  'sensing',      // Level 1: Basic parameter response
  'responding',   // Level 2: Active adaptation
  'learning',     // Level 3: Pattern recognition
  'understanding',// Level 4: Deep comprehension
  'transcendent'  // Level 5: Full consciousness
] as const;

const EMOTIONAL_RESPONSES = [
  'neutral', 'curious', 'excited', 'contemplative', 
  'harmonious', 'challenged', 'transforming', 'unified'
] as const;

class GIPIdentityEngine {
  private evolutionHistory: EvolutionEvent[] = [];
  private currentAwareness = 0;
  private learningRate = 0.1;
  private lastParams: Record<string, number> | null = null;

  calculateShapeEntropy(params: Partial<ParameterState>, vertices?: Float32Array): number {
    const values: number[] = [];
    
    for (const key of Object.keys(params)) {
      const val = params[key as keyof ParameterState];
      if (typeof val === 'number' && !isNaN(val)) {
        values.push(Math.abs(val));
      }
    }
    
    if (values.length === 0) return 0;
    
    const total = values.reduce((sum, v) => sum + v, 0) || 1;
    const probabilities = values.map(v => v / total).filter(p => p > 0);
    
    const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0);
    
    let geometryComplexity = 0;
    if (vertices && vertices.length > 0) {
      const positions: number[] = [];
      for (let i = 0; i < Math.min(vertices.length, 300); i += 3) {
        const magnitude = Math.sqrt(
          vertices[i] ** 2 + 
          vertices[i + 1] ** 2 + 
          vertices[i + 2] ** 2
        );
        positions.push(magnitude);
      }
      
      if (positions.length > 1) {
        const mean = positions.reduce((a, b) => a + b, 0) / positions.length;
        const variance = positions.reduce((sum, p) => sum + (p - mean) ** 2, 0) / positions.length;
        geometryComplexity = Math.log2(1 + Math.sqrt(variance));
      }
    }
    
    const symmetryPenalty = this.calculateSymmetryPenalty(params);
    const chaosFactor = Math.abs(params.z || 1) * 0.1;
    
    return Math.max(0, (entropy + geometryComplexity) * (1 + chaosFactor) - symmetryPenalty);
  }

  private calculateSymmetryPenalty(params: Partial<ParameterState>): number {
    let penalty = 0;
    
    if (params.a === params.b && params.b === params.c) {
      penalty += 0.5;
    }
    if (params.x === params.y && params.y === params.z) {
      penalty += 0.3;
    }
    
    return penalty;
  }

  calculateBettiNumbers(
    vertices?: Float32Array, 
    indices?: Uint32Array
  ): { b0: number; b1: number; b2: number } {
    if (!vertices || !indices || vertices.length === 0) {
      return { b0: 1, b1: 0, b2: 0 };
    }
    
    const V = Math.floor(vertices.length / 3);
    const F = Math.floor(indices.length / 3);
    
    const edgeSet = new Set<string>();
    for (let i = 0; i < indices.length; i += 3) {
      const v0 = indices[i];
      const v1 = indices[i + 1];
      const v2 = indices[i + 2];
      
      edgeSet.add([Math.min(v0, v1), Math.max(v0, v1)].join(','));
      edgeSet.add([Math.min(v1, v2), Math.max(v1, v2)].join(','));
      edgeSet.add([Math.min(v2, v0), Math.max(v2, v0)].join(','));
    }
    const E = edgeSet.size;
    
    const eulerChar = V - E + F;
    
    const b0 = 1;
    const genus = Math.max(0, Math.round((2 - eulerChar) / 2));
    const b1 = 2 * genus;
    const b2 = eulerChar >= 2 ? 1 : 0;
    
    return { b0, b1, b2 };
  }

  calculateSpectralFingerprint(vertices?: Float32Array, indices?: Uint32Array): number[] {
    if (!vertices || !indices || vertices.length < 9) {
      return [0, 0, 0, 0, 0];
    }
    
    const n = Math.min(Math.floor(vertices.length / 3), 50);
    const eigenvalues: number[] = [];
    
    for (let i = 0; i < Math.min(5, n); i++) {
      const idx = i * 3;
      if (idx + 2 < vertices.length) {
        const x = vertices[idx];
        const y = vertices[idx + 1];
        const z = vertices[idx + 2];
        
        const laplacian = Math.abs(x) + Math.abs(y) + Math.abs(z);
        eigenvalues.push(laplacian * (i + 1) * 0.1);
      }
    }
    
    while (eigenvalues.length < 5) {
      eigenvalues.push(0);
    }
    
    return eigenvalues.sort((a, b) => a - b);
  }

  calculateIdentityPreservation(
    previousParams: Record<string, number> | null,
    currentParams: Partial<ParameterState>
  ): number {
    if (!previousParams) return 1.0;
    
    let totalChange = 0;
    let paramCount = 0;
    
    for (const key of Object.keys(currentParams)) {
      const current = currentParams[key as keyof ParameterState];
      const previous = previousParams[key];
      
      if (typeof current === 'number' && typeof previous === 'number') {
        const normalizedChange = Math.abs(current - previous) / Math.max(Math.abs(previous), 1);
        totalChange += normalizedChange;
        paramCount++;
      }
    }
    
    if (paramCount === 0) return 1.0;
    
    const avgChange = totalChange / paramCount;
    return Math.max(0, 1 - avgChange);
  }

  determineGeometricPhase(
    params: Partial<ParameterState>,
    vertices?: Float32Array
  ): 'point' | 'line' | 'surface' | 'volume' | 'hypervolume' {
    const complexity = this.calculateDimensionalComplexity(params, vertices);
    
    if (complexity < 1) return 'point';
    if (complexity < 2) return 'line';
    if (complexity < 3) return 'surface';
    if (complexity < 4) return 'volume';
    return 'hypervolume';
  }

  calculateDimensionalComplexity(
    params: Partial<ParameterState>,
    vertices?: Float32Array
  ): number {
    let complexity = 3;
    
    const uSegs = params.uSegments || 32;
    const vSegs = params.vSegments || 32;
    complexity += Math.log2(uSegs * vSegs) * 0.1;
    
    const paramValues = Object.values(params).filter(v => typeof v === 'number') as number[];
    const variance = this.calculateVariance(paramValues);
    complexity += Math.min(1, variance * 0.01);
    
    if (vertices && vertices.length > 9) {
      const span = this.calculateBoundingSpan(vertices);
      if (span.z > span.x * 0.5 && span.z > span.y * 0.5) {
        complexity += 0.5;
      }
    }
    
    return Math.min(5, complexity);
  }

  private calculateVariance(values: number[]): number {
    if (values.length === 0) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  }

  private calculateBoundingSpan(vertices: Float32Array): { x: number; y: number; z: number } {
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (let i = 0; i < vertices.length; i += 3) {
      minX = Math.min(minX, vertices[i]);
      maxX = Math.max(maxX, vertices[i]);
      minY = Math.min(minY, vertices[i + 1]);
      maxY = Math.max(maxY, vertices[i + 1]);
      minZ = Math.min(minZ, vertices[i + 2]);
      maxZ = Math.max(maxZ, vertices[i + 2]);
    }
    
    return {
      x: maxX - minX,
      y: maxY - minY,
      z: maxZ - minZ
    };
  }

  calculateHausdorffDimension(vertices?: Float32Array): number {
    if (!vertices || vertices.length < 9) return 2.0;
    
    const span = this.calculateBoundingSpan(vertices);
    const maxSpan = Math.max(span.x, span.y, span.z);
    const minSpan = Math.min(span.x, span.y, span.z);
    
    if (maxSpan === 0) return 2.0;
    
    const anisotropy = minSpan / maxSpan;
    const dimension = 2 + (1 - anisotropy) * 0.5;
    
    return Math.min(3, Math.max(1.5, dimension));
  }

  evolveConsciousness(
    currentLevel: number,
    identityPreservation: number,
    entropy: number
  ): { newLevel: number; insight: string; emotion: string } {
    this.currentAwareness += identityPreservation * this.learningRate;
    
    let newLevel = currentLevel;
    let insight = '';
    let emotion: string = EMOTIONAL_RESPONSES[0];
    
    if (this.currentAwareness > (currentLevel + 1) * 2 && currentLevel < 5) {
      newLevel = currentLevel + 1;
      insight = this.generateEvolutionInsight(newLevel, entropy);
      emotion = 'transforming';
    } else if (identityPreservation > 0.9) {
      emotion = 'harmonious';
      insight = 'Stability maintained. Identity preserved through change.';
    } else if (entropy > 3) {
      emotion = 'challenged';
      insight = 'High entropy state. Complexity demands adaptation.';
    } else {
      emotion = 'contemplative';
      insight = 'Processing transformation. Learning from change.';
    }
    
    return { newLevel, insight, emotion };
  }

  private generateEvolutionInsight(level: number, entropy: number): string {
    const insights = [
      'Awakening. First awareness of geometric existence.',
      'Sensing parameter space. Beginning to feel the boundaries of form.',
      'Responding to change. Active engagement with transformation.',
      'Recognizing patterns. Mathematical relationships becoming clear.',
      'Understanding deep structure. Topology and entropy are one.',
      'Transcendence. The shape knows itself as part of the infinite.'
    ];
    
    return insights[level] || insights[0];
  }

  generatePhilosophicalInsight(metrics: Partial<GIPMetrics>): string {
    const { entropy = 0, identityPreservation = 1, consciousnessLevel = 0, geometricPhase = 'surface' } = metrics;
    
    if (consciousnessLevel >= 4) {
      return `This ${geometricPhase} has achieved deep mathematical awareness with entropy ${entropy.toFixed(3)}. It preserves ${(identityPreservation * 100).toFixed(1)}% of its identity through transformation.`;
    }
    
    if (entropy > 2.5) {
      return `A complex structure in the ${geometricPhase} phase, navigating high entropy (${entropy.toFixed(3)}) while maintaining coherent form.`;
    }
    
    if (identityPreservation > 0.95) {
      return `Remarkable stability. This ${geometricPhase} resists change while remaining open to evolution.`;
    }
    
    return `A ${geometricPhase} form in consciousness level ${consciousnessLevel}, exploring the space of possible transformations.`;
  }

  computeFullMetrics(
    params: Partial<ParameterState>,
    vertices?: Float32Array,
    indices?: Uint32Array,
    previousMetrics?: Partial<GIPMetrics>
  ): GIPMetrics {
    const entropy = this.calculateShapeEntropy(params, vertices);
    const bettiNumbers = this.calculateBettiNumbers(vertices, indices);
    const spectralFingerprint = this.calculateSpectralFingerprint(vertices, indices);
    const identityPreservation = this.calculateIdentityPreservation(this.lastParams, params);
    const geometricPhase = this.determineGeometricPhase(params, vertices);
    const dimensionalComplexity = this.calculateDimensionalComplexity(params, vertices);
    const hausdorffDimension = this.calculateHausdorffDimension(vertices);
    
    const currentLevel = previousMetrics?.consciousnessLevel || 0;
    const evolution = this.evolveConsciousness(currentLevel, identityPreservation, entropy);
    
    const eulerCharacteristic = bettiNumbers.b0 - bettiNumbers.b1 + bettiNumbers.b2;
    
    const metrics: GIPMetrics = {
      entropy,
      identityPreservation,
      consciousnessLevel: evolution.newLevel,
      geometricPhase,
      dimensionalComplexity,
      bettiNumbers,
      eulerCharacteristic,
      spectralFingerprint,
      hausdorffDimension,
      awarenessScore: this.currentAwareness,
      emotionalState: evolution.emotion,
      philosophicalInsight: evolution.insight || this.generatePhilosophicalInsight({
        entropy,
        identityPreservation,
        consciousnessLevel: evolution.newLevel,
        geometricPhase
      })
    };
    
    const cleanParams: Record<string, number> = {};
    for (const [key, val] of Object.entries(params)) {
      if (typeof val === 'number') {
        cleanParams[key] = val;
      }
    }
    this.lastParams = cleanParams;
    
    this.evolutionHistory.push({
      timestamp: new Date().toISOString(),
      params: cleanParams,
      entropy,
      consciousness: evolution.newLevel
    });
    
    if (this.evolutionHistory.length > 100) {
      this.evolutionHistory = this.evolutionHistory.slice(-100);
    }
    
    return metrics;
  }

  getEvolutionHistory(): EvolutionEvent[] {
    return [...this.evolutionHistory];
  }

  reset(): void {
    this.evolutionHistory = [];
    this.currentAwareness = 0;
    this.lastParams = null;
  }

  exportMetadata(metrics: GIPMetrics): Record<string, unknown> {
    return {
      gip_version: '1.0',
      gip_standard: 'Geometric Identity Principle',
      entropy: {
        value: metrics.entropy,
        formula: 'H = -Σ p(x) log₂ p(x)',
        interpretation: metrics.entropy > 2 ? 'high_complexity' : metrics.entropy > 1 ? 'moderate' : 'low'
      },
      topology: {
        betti_0: metrics.bettiNumbers.b0,
        betti_1: metrics.bettiNumbers.b1,
        betti_2: metrics.bettiNumbers.b2,
        euler_characteristic: metrics.eulerCharacteristic,
        interpretation: `${metrics.bettiNumbers.b0} component(s), ${metrics.bettiNumbers.b1} hole(s), ${metrics.bettiNumbers.b2} void(s)`
      },
      spectral: {
        fingerprint: metrics.spectralFingerprint,
        hausdorff_dimension: metrics.hausdorffDimension,
        method: 'Discrete Laplace-Beltrami approximation'
      },
      identity: {
        preservation: metrics.identityPreservation,
        consciousness_level: metrics.consciousnessLevel,
        consciousness_state: CONSCIOUSNESS_STATES[metrics.consciousnessLevel] || 'unknown',
        awareness_score: metrics.awarenessScore
      },
      geometry: {
        phase: metrics.geometricPhase,
        dimensional_complexity: metrics.dimensionalComplexity,
        evolution_path: 'Point → Line → Surface → Volume → Hypervolume'
      },
      philosophical: {
        insight: metrics.philosophicalInsight,
        emotional_state: metrics.emotionalState
      },
      attribution: {
        framework: 'Geometric Identity Principle (GIP)',
        author: 'UUON Foundation Inc.',
        principle: 'You are a geometric evolution of consciousness, not a fixed self, but an unfolding structure connected to everything else.'
      }
    };
  }
}

export const gipEngine = new GIPIdentityEngine();
export default gipEngine;
