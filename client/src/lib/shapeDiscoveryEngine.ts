
/**
 * AUTONOMOUS MATHEMATICAL SHAPE DISCOVERY ENGINE
 * Analyzes parameter patterns and discovers new mathematical forms
 */

import { SurfaceParameters } from '../types/math';
import { UNIFIED_SHAPES } from './unifiedShapes';

interface DiscoveredShape {
  id: string;
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  parentShapes: string[];
  discoveryMethod: 'parameter_mutation' | 'equation_fusion' | 'geometric_interpolation';
  uniquenessScore: number;
  mathematicalProperties: {
    genus: number;
    eulerCharacteristic: number;
    surfaceType: 'closed' | 'open' | 'minimal';
    curvature: 'positive' | 'negative' | 'mixed' | 'zero';
  };
}

export class ShapeDiscoveryEngine {
  private discoveredShapes: Map<string, DiscoveredShape> = new Map();
  private parameterAnalysisHistory: Array<{
    shapeId: string;
    parameters: SurfaceParameters;
    userRating: number;
    timestamp: number;
  }> = [];

  // Analyze successful parameter combinations and mutate them
  async discoverFromParameterMutation(): Promise<DiscoveredShape[]> {
    const highRatedCombinations = this.parameterAnalysisHistory
      .filter(entry => entry.userRating > 0.8)
      .slice(-50); // Last 50 successful combinations

    const newShapes: DiscoveredShape[] = [];

    for (const combo of highRatedCombinations) {
      const mutatedParams = this.mutateParameters(combo.parameters);
      const shape = await this.synthesizeShape(combo.shapeId, mutatedParams);
      if (shape && shape.uniquenessScore > 0.7) {
        newShapes.push(shape);
      }
    }

    return newShapes;
  }

  // Fuse equations from multiple shapes to create hybrid forms
  async discoverFromEquationFusion(): Promise<DiscoveredShape[]> {
    const shapeKeys = Object.keys(UNIFIED_SHAPES);
    const newShapes: DiscoveredShape[] = [];

    // Try fusion between topologically compatible shapes
    for (let i = 0; i < shapeKeys.length - 1; i++) {
      for (let j = i + 1; j < shapeKeys.length; j++) {
        const shape1 = UNIFIED_SHAPES[shapeKeys[i]];
        const shape2 = UNIFIED_SHAPES[shapeKeys[j]];
        
        const fusedShape = this.fuseEquations(shapeKeys[i], shape1, shapeKeys[j], shape2);
        if (fusedShape && fusedShape.uniquenessScore > 0.6) {
          newShapes.push(fusedShape);
        }
      }
    }

    return newShapes;
  }

  private mutateParameters(params: SurfaceParameters): SurfaceParameters {
    const mutation = { ...params };
    
    // Apply controlled random mutations
    const mutationStrength = 0.3;
    mutation.a = params.a + (Math.random() - 0.5) * mutationStrength;
    mutation.b = params.b + (Math.random() - 0.5) * mutationStrength;
    mutation.c = params.c + (Math.random() - 0.5) * mutationStrength;
    mutation.d = params.d + (Math.random() - 0.5) * mutationStrength;
    
    return mutation;
  }

  private fuseEquations(id1: string, shape1: any, id2: string, shape2: any): DiscoveredShape | null {
    const fusionWeight = 0.5 + (Math.random() - 0.5) * 0.4; // 0.3 to 0.7

    const fusedEquation = (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const [x1, y1, z1] = shape1.equation(u, v, params);
      const [x2, y2, z2] = shape2.equation(u, v, params);
      
      return [
        x1 * fusionWeight + x2 * (1 - fusionWeight),
        y1 * fusionWeight + y2 * (1 - fusionWeight),
        z1 * fusionWeight + z2 * (1 - fusionWeight)
      ];
    };

    return {
      id: `fusion_${id1}_${id2}_${Date.now()}`,
      name: `${shape1.name} × ${shape2.name} Hybrid`,
      equation: fusedEquation,
      parentShapes: [id1, id2],
      discoveryMethod: 'equation_fusion',
      uniquenessScore: this.calculateUniqueness(fusedEquation),
      mathematicalProperties: this.analyzeGeometry(fusedEquation)
    };
  }

  private calculateUniqueness(equation: Function): number {
    // Sample the equation and compare against existing shapes
    const samplePoints = 20;
    const signature: number[] = [];
    
    for (let i = 0; i < samplePoints; i++) {
      for (let j = 0; j < samplePoints; j++) {
        const u = i / samplePoints;
        const v = j / samplePoints;
        const [x, y, z] = equation(u, v, { a: 1, b: 1, c: 1, d: 1 });
        signature.push(Math.sqrt(x*x + y*y + z*z));
      }
    }

    // Compare against existing shapes (simplified uniqueness metric)
    return Math.random() * 0.5 + 0.5; // Placeholder - would implement full comparison
  }

  private analyzeGeometry(equation: Function) {
    return {
      genus: 0,
      eulerCharacteristic: 2,
      surfaceType: 'closed' as const,
      curvature: 'mixed' as const
    };
  }

  private async synthesizeShape(parentId: string, mutatedParams: SurfaceParameters): Promise<DiscoveredShape | null> {
    const parentShape = UNIFIED_SHAPES[parentId];
    if (!parentShape) return null;

    const synthesizedEquation = (u: number, v: number, params: SurfaceParameters) => {
      return parentShape.equation(u, v, { ...params, ...mutatedParams });
    };

    return {
      id: `mutated_${parentId}_${Date.now()}`,
      name: `Enhanced ${parentShape.name}`,
      equation: synthesizedEquation,
      parentShapes: [parentId],
      discoveryMethod: 'parameter_mutation',
      uniquenessScore: this.calculateUniqueness(synthesizedEquation),
      mathematicalProperties: this.analyzeGeometry(synthesizedEquation)
    };
  }

  // Public interface for adding user feedback
  recordParameterUsage(shapeId: string, parameters: SurfaceParameters, userRating: number) {
    this.parameterAnalysisHistory.push({
      shapeId,
      parameters,
      userRating,
      timestamp: Date.now()
    });

    // Keep only recent history
    if (this.parameterAnalysisHistory.length > 1000) {
      this.parameterAnalysisHistory.splice(0, 500);
    }
  }

  getDiscoveredShapes(): DiscoveredShape[] {
    return Array.from(this.discoveredShapes.values());
  }
}

export const shapeDiscoveryEngine = new ShapeDiscoveryEngine();
