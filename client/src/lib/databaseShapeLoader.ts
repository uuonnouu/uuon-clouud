/**
 * Database-First Shape Loader
 * Fetches shapes from the database API instead of bundling everything
 * This is how games load assets - on-demand from server
 */

interface DatabaseShape {
  shape_type: string;
  formula_name: string;
  equation_x_formula: string;
  equation_y_formula: string;
  equation_z_formula: string;
  default_parameters: Record<string, number>;
  uv_domain: { uMin: number; uMax: number; vMin: number; vMax: number };
  segment_settings: { uSegments: number; vSegments: number };
  category: string;
  complexity_score: number;
}

interface CompiledEquation {
  equation: (u: number, v: number, params: any) => [number, number, number];
  defaultParams: any;
  name: string;
}

class DatabaseShapeLoader {
  private static instance: DatabaseShapeLoader;
  private shapeCache = new Map<string, CompiledEquation>();
  private shapeListCache: { shape_type: string; formula_name: string; category: string }[] | null = null;
  private loadingPromises = new Map<string, Promise<CompiledEquation | null>>();
  
  static getInstance(): DatabaseShapeLoader {
    if (!DatabaseShapeLoader.instance) {
      DatabaseShapeLoader.instance = new DatabaseShapeLoader();
    }
    return DatabaseShapeLoader.instance;
  }

  async getShapeList(): Promise<{ shape_type: string; formula_name: string; category: string }[]> {
    if (this.shapeListCache) {
      return this.shapeListCache;
    }

    try {
      const response = await fetch('/api/shapes');
      const data = await response.json();
      
      if (data.success && data.shapes) {
        this.shapeListCache = data.shapes;
        console.log(`📦 Loaded ${data.shapes.length} shapes from database`);
        return data.shapes;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch shape list:', error);
      return [];
    }
  }

  async getShape(shapeType: string): Promise<CompiledEquation | null> {
    if (this.shapeCache.has(shapeType)) {
      return this.shapeCache.get(shapeType)!;
    }

    if (this.loadingPromises.has(shapeType)) {
      return this.loadingPromises.get(shapeType)!;
    }

    const loadPromise = this.loadShapeFromDatabase(shapeType);
    this.loadingPromises.set(shapeType, loadPromise);
    
    try {
      const result = await loadPromise;
      this.loadingPromises.delete(shapeType);
      return result;
    } catch (error) {
      this.loadingPromises.delete(shapeType);
      return null;
    }
  }

  private async loadShapeFromDatabase(shapeType: string): Promise<CompiledEquation | null> {
    try {
      const response = await fetch(`/api/shapes/${shapeType}/formula`);
      const data = await response.json();
      
      if (!data.success || !data.formula) {
        console.warn(`⚠️ Shape not found in database: ${shapeType}`);
        return null;
      }

      const formula = data.formula as DatabaseShape;
      const compiled = this.compileFormula(formula);
      
      if (compiled) {
        this.shapeCache.set(shapeType, compiled);
        console.log(`✅ Loaded shape from database: ${shapeType}`);
      }
      
      return compiled;
    } catch (error) {
      console.error(`Failed to load shape ${shapeType}:`, error);
      return null;
    }
  }

  private compileFormula(formula: DatabaseShape): CompiledEquation | null {
    try {
      const xFormula = formula.equation_x_formula;
      const yFormula = formula.equation_y_formula;
      const zFormula = formula.equation_z_formula;

      const equation = (u: number, v: number, params: any): [number, number, number] => {
        const { a = 1, b = 1, c = 1, d = 0, e = 0, f = 0 } = params;
        
        try {
          const x = this.evaluateFormula(xFormula, u, v, { a, b, c, d, e, f, ...params });
          const y = this.evaluateFormula(yFormula, u, v, { a, b, c, d, e, f, ...params });
          const z = this.evaluateFormula(zFormula, u, v, { a, b, c, d, e, f, ...params });
          
          return [
            isFinite(x) ? x : 0,
            isFinite(y) ? y : 0,
            isFinite(z) ? z : 0
          ];
        } catch {
          return [0, 0, 0];
        }
      };

      const defaultParams = {
        ...formula.default_parameters,
        ...formula.uv_domain,
        ...formula.segment_settings
      };

      return {
        equation,
        defaultParams,
        name: formula.formula_name
      };
    } catch (error) {
      console.error('Failed to compile formula:', error);
      return null;
    }
  }

  private evaluateFormula(formula: string, u: number, v: number, params: Record<string, number>): number {
    const { a, b, c, d, e, f } = params;
    
    let expr = formula
      .replace(/\bu\b/g, `(${u})`)
      .replace(/\bv\b/g, `(${v})`)
      .replace(/\ba\b/g, `(${a})`)
      .replace(/\bb\b/g, `(${b})`)
      .replace(/\bc\b/g, `(${c})`)
      .replace(/\bd\b/g, `(${d})`)
      .replace(/\be\b/g, `(${e})`)
      .replace(/\bf\b/g, `(${f})`)
      .replace(/sin\(/g, 'Math.sin(')
      .replace(/cos\(/g, 'Math.cos(')
      .replace(/tan\(/g, 'Math.tan(')
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/exp\(/g, 'Math.exp(')
      .replace(/log\(/g, 'Math.log(')
      .replace(/abs\(/g, 'Math.abs(')
      .replace(/pow\(/g, 'Math.pow(')
      .replace(/PI/g, 'Math.PI')
      .replace(/π/g, 'Math.PI');

    try {
      return Function(`"use strict"; return (${expr})`)();
    } catch {
      return 0;
    }
  }

  async preloadCategory(category: string): Promise<void> {
    try {
      const response = await fetch(`/api/shapes/category/${category}`);
      const data = await response.json();
      
      if (data.success && data.shapes) {
        console.log(`📦 Preloading ${data.shapes.length} shapes from category: ${category}`);
        
        for (const shape of data.shapes.slice(0, 10)) {
          await this.getShape(shape.shape_type);
        }
      }
    } catch (error) {
      console.error(`Failed to preload category ${category}:`, error);
    }
  }

  getCacheStats(): { cached: number; total: number } {
    return {
      cached: this.shapeCache.size,
      total: this.shapeListCache?.length || 0
    };
  }

  clearCache(): void {
    this.shapeCache.clear();
    this.shapeListCache = null;
    console.log('🧹 Shape cache cleared');
  }
}

export const databaseShapeLoader = DatabaseShapeLoader.getInstance();
export type { CompiledEquation, DatabaseShape };
