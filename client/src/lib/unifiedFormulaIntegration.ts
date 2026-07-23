
/**
 * UNIFIED FORMULA INTEGRATION SYSTEM
 * Integrates all available mathematical formulas for frontend 3D rendering
 * Provides unified access to 1000+ mathematical shapes and equations
 */

import { SurfaceParameters } from '../types/math';
import { ALL_SHAPE_LIBRARIES } from '../components/ParametricSurface';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { UNIFIED_MATH_SYMBOLS } from './unifiedMathSymbols';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';

export interface FormulaMetadata {
  name: string;
  category: string;
  subcategory?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaults: Partial<SurfaceParameters>;
  description: string;
  complexity: 'basic' | 'intermediate' | 'advanced' | 'research';
  domain: {
    uMin: number;
    uMax: number;
    vMin: number;
    vMax: number;
  };
  parameterInfo: {
    active: string[];
    ranges: Record<string, [number, number]>;
    descriptions: Record<string, string>;
  };
}

export class UnifiedFormulaIntegration {
  private static instance: UnifiedFormulaIntegration;
  private formulaRegistry: Map<string, FormulaMetadata> = new Map();
  private categoryIndex: Map<string, string[]> = new Map();
  private initialized = false;

  static getInstance(): UnifiedFormulaIntegration {
    if (!UnifiedFormulaIntegration.instance) {
      UnifiedFormulaIntegration.instance = new UnifiedFormulaIntegration();
    }
    return UnifiedFormulaIntegration.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    console.log('🔧 Initializing unified formula integration system...');
    
    await this.loadAllFormulas();
    await this.buildCategoryIndex();
    await this.validateFormulas();

    this.initialized = true;
    console.log(`✅ Formula integration complete: ${this.formulaRegistry.size} formulas loaded`);
  }

  private async loadAllFormulas(): Promise<void> {
    // Load from ALL_SHAPE_LIBRARIES
    Object.entries(ALL_SHAPE_LIBRARIES).forEach(([key, shape]) => {
      if (shape.equation) {
        this.formulaRegistry.set(key, {
          name: shape.name || key.replace(/_/g, ' ').toUpperCase(),
          category: this.detectCategory(key),
          equation: shape.equation,
          defaults: shape.defaultParams || {},
          description: shape.description || `${key} mathematical surface`,
          complexity: this.detectComplexity(key),
          domain: {
            uMin: shape.defaultParams?.uMin ?? 0,
            uMax: shape.defaultParams?.uMax ?? 1,
            vMin: shape.defaultParams?.vMin ?? 0,
            vMax: shape.defaultParams?.vMax ?? 1
          },
          parameterInfo: this.analyzeParameters(shape)
        });
      }
    });

    // Load mathematical constants as visualizations
    Object.entries(MATHEMATICAL_CONSTANTS).forEach(([key, constant]) => {
      if (constant.equation) {
        this.formulaRegistry.set(`const_${key}`, {
          name: constant.name || key,
          category: 'constants',
          equation: constant.equation,
          defaults: constant.defaultParams || {},
          description: `Mathematical constant: ${key}`,
          complexity: 'intermediate',
          domain: { uMin: 0, uMax: 1, vMin: 0, vMax: 1 },
          parameterInfo: this.analyzeParameters(constant)
        });
      }
    });

    // Load unified math symbols
    Object.entries(UNIFIED_MATH_SYMBOLS).forEach(([key, symbol]) => {
      if (symbol.equation) {
        this.formulaRegistry.set(`symbol_${key}`, {
          name: symbol.name || key,
          category: 'symbols',
          equation: symbol.equation,
          defaults: symbol.defaultParams || {},
          description: `Mathematical symbol: ${key}`,
          complexity: 'basic',
          domain: { uMin: 0, uMax: 1, vMin: 0, vMax: 1 },
          parameterInfo: this.analyzeParameters(symbol)
        });
      }
    });

    // Load universal mathematics
    Object.entries(UNIVERSAL_MATHEMATICS).forEach(([key, formula]) => {
      if (formula.equation) {
        this.formulaRegistry.set(`universal_${key}`, {
          name: formula.name || key,
          category: 'universal',
          equation: formula.equation,
          defaults: formula.defaultParams || {},
          description: `Universal mathematics: ${key}`,
          complexity: 'research',
          domain: { uMin: 0, uMax: 1, vMin: 0, vMax: 1 },
          parameterInfo: this.analyzeParameters(formula)
        });
      }
    });
  }

  private buildCategoryIndex(): void {
    this.categoryIndex.clear();
    
    this.formulaRegistry.forEach((formula, key) => {
      if (!this.categoryIndex.has(formula.category)) {
        this.categoryIndex.set(formula.category, []);
      }
      this.categoryIndex.get(formula.category)!.push(key);
    });
  }

  private detectCategory(key: string): string {
    const categoryMap: Record<string, string> = {
      'sphere': 'basic_geometry',
      'cube': 'basic_geometry',
      'torus': 'basic_geometry',
      'klein_bottle': 'topology',
      'mobius': 'topology',
      'lorenz': 'attractors',
      'mandelbrot': 'fractals',
      'heart': 'anatomy',
      'brain': 'anatomy',
      'dna': 'biology',
      'quantum': 'physics',
      'schrodinger': 'physics',
      'einstein': 'physics',
      'chakra': 'sacred_geometry',
      'golden': 'sacred_geometry',
      'phi': 'constants',
      'pi': 'constants'
    };

    for (const [pattern, category] of Object.entries(categoryMap)) {
      if (key.toLowerCase().includes(pattern)) {
        return category;
      }
    }

    return 'advanced';
  }

  private detectComplexity(key: string): FormulaMetadata['complexity'] {
    const complexityMap: Record<string, FormulaMetadata['complexity']> = {
      'sphere': 'basic',
      'cube': 'basic',
      'cylinder': 'basic',
      'torus': 'intermediate',
      'klein_bottle': 'advanced',
      'boy_surface': 'research',
      'quantum': 'research',
      'theory_of_everything': 'research'
    };

    for (const [pattern, complexity] of Object.entries(complexityMap)) {
      if (key.toLowerCase().includes(pattern)) {
        return complexity;
      }
    }

    return 'intermediate';
  }

  private analyzeParameters(shape: any): FormulaMetadata['parameterInfo'] {
    const defaults = shape.defaultParams || shape.defaults || {};
    const active: string[] = [];
    const ranges: Record<string, [number, number]> = {};
    const descriptions: Record<string, string> = {};

    // Standard parameter analysis
    const parameterMap = {
      a: { range: [0.1, 10], desc: 'X-axis scaling factor' },
      b: { range: [0.1, 10], desc: 'Y-axis scaling factor' },
      c: { range: [0.1, 10], desc: 'Z-axis scaling factor' },
      d: { range: [-5, 5], desc: 'Shape deformation parameter' },
      e: { range: [-5, 5], desc: 'Secondary deformation' },
      f: { range: [-5, 5], desc: 'Tertiary effects parameter' },
      g: { range: [-2, 2], desc: 'Tessellation/Frequency modifier' },
      h: { range: [-2, 2], desc: 'Mirror X/Amplitude modifier' },
      i: { range: [-2, 2], desc: 'Mirror Y/Bulge modifier' },
      j: { range: [-2, 2], desc: 'Mirror Z/Pinch modifier' },
      k: { range: [-2, 2], desc: 'Internal/Flare modifier' },
      l: { range: [-2, 2], desc: 'External/Taper modifier' },
      m: { range: [-2, 2], desc: 'Smoothness/Mirror modifier' },
      uSegments: { range: [4, 200], desc: 'U-direction mesh density' },
      vSegments: { range: [4, 200], desc: 'V-direction mesh density' }
    };

    Object.keys(defaults).forEach(param => {
      if (parameterMap[param as keyof typeof parameterMap]) {
        active.push(param);
        ranges[param] = parameterMap[param as keyof typeof parameterMap].range;
        descriptions[param] = parameterMap[param as keyof typeof parameterMap].desc;
      }
    });

    return { active, ranges, descriptions };
  }

  private async validateFormulas(): Promise<void> {
    let validCount = 0;
    let invalidCount = 0;

    for (const [key, formula] of this.formulaRegistry.entries()) {
      try {
        // Test formula with default parameters
        const testParams = {
          type: key as any,
          a: 1, b: 1, c: 1, d: 0, e: 0, f: 0,
          g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
          ...formula.defaults
        } as SurfaceParameters;

        const result = formula.equation(0.5, 0.5, testParams);
        
        if (Array.isArray(result) && result.length === 3 && 
            result.every(val => typeof val === 'number' && isFinite(val))) {
          validCount++;
        } else {
          console.warn(`⚠️ Formula validation failed for ${key}:`, result);
          invalidCount++;
        }
      } catch (error) {
        console.error(`❌ Formula error for ${key}:`, error);
        invalidCount++;
      }
    }

    console.log(`✅ Formula validation complete: ${validCount} valid, ${invalidCount} invalid`);
  }

  // PUBLIC API METHODS

  getFormulaByKey(key: string): FormulaMetadata | null {
    return this.formulaRegistry.get(key) || null;
  }

  getAllFormulas(): Map<string, FormulaMetadata> {
    return new Map(this.formulaRegistry);
  }

  getFormulasByCategory(category: string): FormulaMetadata[] {
    const keys = this.categoryIndex.get(category) || [];
    return keys.map(key => this.formulaRegistry.get(key)!).filter(Boolean);
  }

  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys());
  }

  searchFormulas(query: string): FormulaMetadata[] {
    const results: FormulaMetadata[] = [];
    const queryLower = query.toLowerCase();

    this.formulaRegistry.forEach((formula, key) => {
      if (
        key.toLowerCase().includes(queryLower) ||
        formula.name.toLowerCase().includes(queryLower) ||
        formula.description.toLowerCase().includes(queryLower) ||
        formula.category.toLowerCase().includes(queryLower)
      ) {
        results.push(formula);
      }
    });

    return results;
  }

  getFormulaStats(): {
    total: number;
    byCategory: Record<string, number>;
    byComplexity: Record<string, number>;
  } {
    const byCategory: Record<string, number> = {};
    const byComplexity: Record<string, number> = {};

    this.formulaRegistry.forEach(formula => {
      byCategory[formula.category] = (byCategory[formula.category] || 0) + 1;
      byComplexity[formula.complexity] = (byComplexity[formula.complexity] || 0) + 1;
    });

    return {
      total: this.formulaRegistry.size,
      byCategory,
      byComplexity
    };
  }

  // 3D RENDERING INTEGRATION

  async render3D(formulaKey: string, parameters: Partial<SurfaceParameters> = {}): Promise<{
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
  }> {
    const formula = this.getFormulaByKey(formulaKey);
    if (!formula) {
      throw new Error(`Formula not found: ${formulaKey}`);
    }

    const mergedParams = {
      type: formulaKey as any,
      a: 1, b: 1, c: 1, d: 0, e: 0, f: 0,
      g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      uMin: formula.domain.uMin,
      uMax: formula.domain.uMax,
      vMin: formula.domain.vMin,
      vMax: formula.domain.vMax,
      uSegments: 64,
      vSegments: 64,
      ...formula.defaults,
      ...parameters
    } as SurfaceParameters;

    return this.generateMeshData(formula, mergedParams);
  }

  private generateMeshData(
    formula: FormulaMetadata, 
    params: SurfaceParameters
  ): {
    vertices: number[];
    indices: number[];
    normals: number[];
    uvs: number[];
  } {
    const vertices: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const uSegments = params.uSegments || 64;
    const vSegments = params.vSegments || 64;
    const uRange = (params.uMax ?? 1) - (params.uMin ?? 0);
    const vRange = (params.vMax ?? 1) - (params.vMin ?? 0);

    // Generate vertices
    for (let j = 0; j <= vSegments; j++) {
      for (let i = 0; i <= uSegments; i++) {
        const u = (params.uMin ?? 0) + (i / uSegments) * uRange;
        const v = (params.vMin ?? 0) + (j / vSegments) * vRange;

        try {
          const point = formula.equation(u, v, params);
          if (Array.isArray(point) && point.length === 3 && 
              point.every(val => isFinite(val))) {
            vertices.push(point[0], point[1], point[2]);
          } else {
            vertices.push(0, 0, 0);
          }
        } catch (error) {
          vertices.push(0, 0, 0);
        }

        uvs.push(i / uSegments, j / vSegments);
      }
    }

    // Generate indices
    for (let j = 0; j < vSegments; j++) {
      for (let i = 0; i < uSegments; i++) {
        const idx = j * (uSegments + 1) + i;
        const idx1 = idx + 1;
        const idx2 = idx + (uSegments + 1);
        const idx3 = idx2 + 1;

        indices.push(idx, idx1, idx3);
        indices.push(idx, idx3, idx2);
      }
    }

    // Calculate normals
    const normals = this.calculateNormals(vertices, indices);

    return { vertices, indices, normals, uvs };
  }

  private calculateNormals(vertices: number[], indices: number[]): number[] {
    const normals = new Array(vertices.length).fill(0);

    // Calculate face normals and accumulate
    for (let i = 0; i < indices.length; i += 3) {
      const i1 = indices[i] * 3;
      const i2 = indices[i + 1] * 3;
      const i3 = indices[i + 2] * 3;

      const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
      const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
      const v3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];

      const edge1 = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
      const edge2 = [v3[0] - v1[0], v3[1] - v1[1], v3[2] - v1[2]];

      const normal = [
        edge1[1] * edge2[2] - edge1[2] * edge2[1],
        edge1[2] * edge2[0] - edge1[0] * edge2[2],
        edge1[0] * edge2[1] - edge1[1] * edge2[0]
      ];

      // Accumulate normals for each vertex
      [i1, i2, i3].forEach(idx => {
        normals[idx] += normal[0];
        normals[idx + 1] += normal[1];
        normals[idx + 2] += normal[2];
      });
    }

    // Normalize
    for (let i = 0; i < normals.length; i += 3) {
      const length = Math.sqrt(normals[i] ** 2 + normals[i + 1] ** 2 + normals[i + 2] ** 2);
      if (length > 0) {
        normals[i] /= length;
        normals[i + 1] /= length;
        normals[i + 2] /= length;
      }
    }

    return normals;
  }
}

// Export singleton instance
export const unifiedFormulaIntegration = UnifiedFormulaIntegration.getInstance();
