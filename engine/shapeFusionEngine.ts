import { SurfaceParameters } from '../types/math';
import { getDefaultParameters } from './parametricSurfacesClean';
import { getBiologicalShapeMetadata, UUON_ATTRIBUTION } from './biologicalShapesMetadata';
import { cryptoEngine, CryptoHash, ProofOfWork, CryptoToken } from './cryptoEngine';

// Extended interface for N-shape fusion
export interface WeightedShape {
  id: string;
  weight: number;
}

export interface MultiShapeFusionData {
  shapeId: string;
  shapeName: string;
  parentShapes: WeightedShape[]; // Array of shapes with weights
  fusedParameters: Partial<SurfaceParameters>;
  description: string;
  metadata?: {
    totalShapes: number;
    biologicalShapesIncluded: number;
    uuonAttribution: typeof UUON_ATTRIBUTION;
    fusionTimestamp: string;
  };
  crypto?: {
    parameterHash: CryptoHash;
    proofOfWork: ProofOfWork;
    cryptoToken: CryptoToken;
    blockchainProof: string;
  };
}

// Legacy interface for backward compatibility (2-shape fusion)
export interface FusedShapeData {
  shapeId: string;
  shapeName: string;
  parentShape1: string;
  parentShape2: string;
  fusionRatio: number;
  fusedParameters: Partial<SurfaceParameters>;
  description: string;
}

export interface AnimationKeyframe {
  time: number;
  parameters: Partial<SurfaceParameters>;
}

export class ShapeFusionEngine {
  private generateUniqueId(parent1: string, parent2: string): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `fusion_${parent1}_${parent2}_${timestamp}${random}`;
  }

  private generateFusionName(parent1: string, parent2: string): string {
    const p1 = parent1.replace(/_/g, ' ').split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
    const p2 = parent2.replace(/_/g, ' ').split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
    
    return `${p1}-${p2} Hybrid`;
  }

  /**
   * NEW: N-Shape Weighted Fusion with Blockchain Validation
   * Fuses multiple shapes with individual weights
   * Includes cryptographic proof of work, blockchain validation, and UUON attribution
   */
  public async fuseShapesWeighted(shapes: WeightedShape[]): Promise<MultiShapeFusionData | null> {
    if (shapes.length < 2) {
      console.warn('Need at least 2 shapes to fuse');
      return null;
    }

    // Validate all shapes exist
    const shapeParams = shapes.map(s => ({
      id: s.id,
      weight: s.weight,
      params: getDefaultParameters(s.id)
    }));

    if (shapeParams.some(sp => !sp.params)) {
      console.warn('One or more shapes not found:', shapes.map(s => s.id));
      return null;
    }

    // Normalize weights to sum to 1
    const normalizedShapes = this.normalizeWeights(shapes);
    
    // Blend parameters using weighted average
    const blendedParams = this.blendParametersWeighted(shapeParams as any);
    
    // Generate metadata
    const biologicalCount = shapes.filter(s => getBiologicalShapeMetadata(s.id)).length;
    
    // CRYPTO VALIDATION: Hash the fused parameters (internal)
    const parameterHash = await cryptoEngine.hashParameters(blendedParams);

    // PROOF OF WORK: Validate fusion with computational proof (internal)
    const fusionProofData = {
      shapes: normalizedShapes,
      parameterHash: parameterHash.hash,
      biologicalCount,
      timestamp: new Date().toISOString()
    };
    const proofOfWork = await cryptoEngine.proofOfWork(
      JSON.stringify(fusionProofData), 
      biologicalCount > 0 ? 4 : 3  // Higher difficulty for biological shapes
    );

    const shapeId = this.generateMultiShapeId(normalizedShapes);
    const shapeName = this.generateMultiShapeName(normalizedShapes);

    // UUON SIGNATURE: Sign with UUON Foundation credentials (internal)
    const uuonSignature = await cryptoEngine.signData(
      { ...UUON_ATTRIBUTION, shapeId, timestamp: Date.now() },
      'UUON_FOUNDATION_PRIVATE_KEY_2025'  // Private key for signatures
    );

    // CRYPTO TOKEN: Generate blockchain token (internal)
    const cryptoToken = await cryptoEngine.generateCryptoToken(
      shapeId,
      shapeName,
      { normalizedShapes, blendedParams, biologicalCount },
      uuonSignature
    );

    const fusionData: MultiShapeFusionData = {
      shapeId,
      shapeName,
      parentShapes: normalizedShapes,
      fusedParameters: blendedParams,
      description: this.generateMultiShapeDescription(normalizedShapes),
      metadata: {
        totalShapes: shapes.length,
        biologicalShapesIncluded: biologicalCount,
        uuonAttribution: UUON_ATTRIBUTION,
        fusionTimestamp: new Date().toISOString()
      },
      crypto: {
        parameterHash,
        proofOfWork,
        cryptoToken,
        blockchainProof: cryptoToken.metadata.blockchainProof
      }
    };
    
    return fusionData;
  }

  /**
   * Normalize weights so they sum to 1.0
   */
  private normalizeWeights(shapes: WeightedShape[]): WeightedShape[] {
    const totalWeight = shapes.reduce((sum, s) => sum + s.weight, 0);
    if (totalWeight === 0) {
      // Equal weights if all zero
      const equalWeight = 1 / shapes.length;
      return shapes.map(s => ({ ...s, weight: equalWeight }));
    }
    return shapes.map(s => ({ ...s, weight: s.weight / totalWeight }));
  }

  /**
   * Blend parameters using weighted average: Σ(weight * param)
   */
  private blendParametersWeighted(
    shapeParams: Array<{ id: string; weight: number; params: Partial<SurfaceParameters> }>
  ): Partial<SurfaceParameters> {
    const paramKeys: (keyof SurfaceParameters)[] = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
      'uMin', 'uMax', 'vMin', 'vMax', 'uSegments', 'vSegments'
    ];

    const blended: Partial<SurfaceParameters> = {
      type: shapeParams[0].id as any // Use first shape as base type
    };

    paramKeys.forEach(key => {
      let weightedSum = 0;
      shapeParams.forEach(sp => {
        const value = sp.params[key];
        if (value !== undefined) {
          weightedSum += sp.weight * (value as number);
        }
      });

      if (key === 'uSegments' || key === 'vSegments') {
        (blended as any)[key] = Math.round(weightedSum);
      } else {
        (blended as any)[key] = weightedSum;
      }
    });

    return blended;
  }

  /**
   * Generate unique ID for multi-shape fusion
   */
  private generateMultiShapeId(shapes: WeightedShape[]): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    const shapeHash = shapes.map(s => s.id.substring(0, 3)).join('_');
    return `fusion_multi_${shapeHash}_${timestamp}${random}`;
  }

  /**
   * Generate human-readable name for multi-shape fusion
   */
  private generateMultiShapeName(shapes: WeightedShape[]): string {
    if (shapes.length === 2) {
      const p1 = this.formatShapeName(shapes[0].id);
      const p2 = this.formatShapeName(shapes[1].id);
      return `${p1}-${p2} Hybrid`;
    } else if (shapes.length === 3) {
      const names = shapes.map(s => this.formatShapeName(s.id));
      return `${names[0]}-${names[1]}-${names[2]} Tri-Fusion`;
    } else {
      return `${shapes.length}-Shape Hybrid Fusion`;
    }
  }

  /**
   * Generate description for multi-shape fusion
   */
  private generateMultiShapeDescription(shapes: WeightedShape[]): string {
    const percentages = shapes.map(s => 
      `${this.formatShapeName(s.id)} (${(s.weight * 100).toFixed(1)}%)`
    ).join(', ');
    return `Multi-shape mathematical fusion: ${percentages}`;
  }

  /**
   * Format shape name for display
   */
  private formatShapeName(shapeId: string): string {
    return shapeId.replace(/_/g, ' ').split(' ').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
  }

  /**
   * LEGACY: Two-shape fusion (backward compatible)
   * Routes through weighted fusion system with crypto validation
   */
  public async fuseShapes(shape1Id: string, shape2Id: string, ratio: number = 0.5): Promise<FusedShapeData | null> {
    // Convert to weighted fusion
    const weightedShapes: WeightedShape[] = [
      { id: shape1Id, weight: 1 - ratio },
      { id: shape2Id, weight: ratio }
    ];

    const multiResult = await this.fuseShapesWeighted(weightedShapes);
    if (!multiResult) return null;

    // Convert back to legacy format
    return {
      shapeId: multiResult.shapeId,
      shapeName: multiResult.shapeName,
      parentShape1: shape1Id,
      parentShape2: shape2Id,
      fusionRatio: ratio,
      fusedParameters: multiResult.fusedParameters,
      description: multiResult.description
    };
  }

  public async fuseRandomShapes(availableShapes: string[], ratio?: number): Promise<FusedShapeData | null> {
    if (availableShapes.length < 2) {
      console.warn('Need at least 2 shapes to fuse');
      return null;
    }

    const shuffled = [...availableShapes].sort(() => Math.random() - 0.5);
    const shape1 = shuffled[0];
    const shape2 = shuffled[1];
    const fusionRatio = ratio !== undefined ? ratio : 0.3 + Math.random() * 0.4;

    return await this.fuseShapes(shape1, shape2, fusionRatio);
  }

  public generateAnimationSequence(
    fusedShape: FusedShapeData,
    durationSeconds: number = 5,
    fps: number = 30
  ): AnimationKeyframe[] {
    const totalFrames = Math.floor(durationSeconds * fps);
    const keyframes: AnimationKeyframe[] = [];

    for (let frame = 0; frame <= totalFrames; frame++) {
      const progress = frame / totalFrames;
      const time = progress * durationSeconds;

      const animatedParams: Partial<SurfaceParameters> = { ...fusedShape.fusedParameters };

      const baseParams = fusedShape.fusedParameters;
      if (baseParams.a !== undefined) animatedParams.a = baseParams.a * (1 + 0.2 * Math.sin(progress * Math.PI * 4));
      if (baseParams.b !== undefined) animatedParams.b = baseParams.b * (1 + 0.15 * Math.cos(progress * Math.PI * 3));
      if (baseParams.g !== undefined) animatedParams.g = (baseParams.g || 0) + progress * Math.PI * 2;
      if (baseParams.i !== undefined) animatedParams.i = (baseParams.i || 0) + Math.sin(progress * Math.PI * 6) * 0.5;

      keyframes.push({
        time,
        parameters: animatedParams
      });
    }

    return keyframes;
  }

  private blendValue(val1: number | undefined, val2: number | undefined, ratio: number): number {
    const v1 = val1 ?? 0;
    const v2 = val2 ?? 0;
    return v1 * (1 - ratio) + v2 * ratio;
  }

  public interpolateKeyframes(
    keyframes: AnimationKeyframe[],
    currentTime: number
  ): Partial<SurfaceParameters> | null {
    if (keyframes.length === 0) return null;
    if (keyframes.length === 1) return keyframes[0].parameters;

    for (let i = 0; i < keyframes.length - 1; i++) {
      const kf1 = keyframes[i];
      const kf2 = keyframes[i + 1];

      if (currentTime >= kf1.time && currentTime <= kf2.time) {
        const t = (currentTime - kf1.time) / (kf2.time - kf1.time);
        
        const interpolated: Partial<SurfaceParameters> = {};
        const keys = Object.keys(kf1.parameters) as (keyof SurfaceParameters)[];
        
        keys.forEach(key => {
          const v1 = kf1.parameters[key] as number;
          const v2 = kf2.parameters[key] as number;
          if (v1 !== undefined && v2 !== undefined) {
            (interpolated as any)[key] = v1 * (1 - t) + v2 * t;
          }
        });

        return interpolated;
      }
    }

    return keyframes[keyframes.length - 1].parameters;
  }
}

export const fusionEngine = new ShapeFusionEngine();
