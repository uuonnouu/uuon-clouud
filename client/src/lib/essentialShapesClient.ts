
/**
 * ESSENTIAL SHAPES CLIENT
 * Frontend interface to access bare minimum mathematical shapes
 */

interface EssentialShape {
  id: string;
  equation: string;
  params: string[];
  complexity: number;
  use_cases: string[];
}

interface ShapeSystem {
  shapes: Record<string, EssentialShape>;
  algorithms: Record<string, string>;
  learning_paths: Record<string, any>;
}

export class EssentialShapesClient {
  private baseUrl: string;
  private cache = new Map<string, any>();

  constructor(baseUrl = '/api/essential-shapes') {
    this.baseUrl = baseUrl;
  }

  async getEssentialCore(): Promise<ShapeSystem> {
    if (this.cache.has('core')) {
      return this.cache.get('core');
    }

    try {
      const response = await fetch(`${this.baseUrl}/essential-core`);
      const data = await response.json();
      
      if (data.success) {
        this.cache.set('core', data);
        return data;
      }
      throw new Error('Failed to load essential shapes core');
    } catch (error) {
      console.error('Essential shapes API error:', error);
      return this.getFallbackCore();
    }
  }

  async getShapeById(shapeId: string): Promise<EssentialShape | null> {
    try {
      const response = await fetch(`${this.baseUrl}/essential-core/shape/${shapeId}`);
      const data = await response.json();
      return data.success ? data.shape : null;
    } catch (error) {
      console.error(`Failed to load shape ${shapeId}:`, error);
      return null;
    }
  }

  async getAlgorithms(): Promise<Record<string, string>> {
    if (this.cache.has('algorithms')) {
      return this.cache.get('algorithms');
    }

    try {
      const response = await fetch(`${this.baseUrl}/essential-core/algorithms`);
      const data = await response.json();
      
      if (data.success) {
        this.cache.set('algorithms', data.core_algorithms);
        return data.core_algorithms;
      }
    } catch (error) {
      console.error('Failed to load algorithms:', error);
    }

    return this.getFallbackAlgorithms();
  }

  async getLearningPath(system: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/essential-core/learn/${system}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to get learning path for ${system}:`, error);
      return null;
    }
  }

  // Fallback core shapes if API fails
  private getFallbackCore(): ShapeSystem {
    return {
      shapes: {
        sphere: {
          id: 'sphere',
          equation: 'x=r·sin(φ)·cos(θ), y=r·sin(φ)·sin(θ), z=r·cos(φ)',
          params: ['r'],
          complexity: 1,
          use_cases: ['3D basics', 'collision detection', 'volume calculations']
        },
        cube: {
          id: 'cube', 
          equation: 'vertices: (±a,±a,±a)',
          params: ['a'],
          complexity: 1,
          use_cases: ['voxel systems', '3D grids', 'basic modeling']
        }
      },
      algorithms: this.getFallbackAlgorithms(),
      learning_paths: {}
    };
  }

  private getFallbackAlgorithms(): Record<string, string> {
    return {
      parametric_generation: 'f(u,v,params) → [x,y,z]',
      mesh_tessellation: 'vertices + indices → triangular mesh'
    };
  }

  // Generate shape data for external systems
  async generateShapeData(shapeId: string, params: Record<string, number> = {}) {
    const shape = await this.getShapeById(shapeId);
    if (!shape) return null;

    return {
      shape_id: shapeId,
      equation: shape.equation,
      parameters: params,
      generated_at: Date.now(),
      usage: `Copy this equation and parameters to generate ${shapeId} in your system`,
      optimization_tip: 'Cache results if using same parameters multiple times'
    };
  }
}

export const essentialShapesClient = new EssentialShapesClient();
