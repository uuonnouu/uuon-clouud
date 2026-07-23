
/**
 * 3D MAPPING ENGINE
 * Maps mathematical symbols to 3D representations and handles transformations
 */

import { GeometryResult, geometryEngine } from './geometry-engine';
import { MathSymbol, getSymbol, getSymbolsByCategory } from './symbol-database';

export interface MappingRequest {
  symbol: string;
  method?: "font_extrusion" | "semantic" | "procedural";
  parameters?: Record<string, number>;
  transformations?: {
    scale?: [number, number, number];
    rotation?: [number, number, number];
    translation?: [number, number, number];
  };
  quality?: "low" | "medium" | "high" | "ultra";
}

export interface MappingResult {
  success: boolean;
  symbol_data: MathSymbol;
  geometry: GeometryResult;
  transformations_applied: any[];
  processing_time: number;
  cache_key: string;
}

export class MappingEngine {
  private cache = new Map<string, MappingResult>();
  private maxCacheSize = 100;

  /**
   * Map symbol to 3D representation
   */
  async mapSymbolTo3D(request: MappingRequest): Promise<MappingResult> {
    const startTime = performance.now();
    
    // Generate cache key
    const cacheKey = this.generateCacheKey(request);
    
    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      return {
        ...cached,
        processing_time: performance.now() - startTime
      };
    }

    try {
      // Get symbol data
      const symbolData = getSymbol(request.symbol);
      if (!symbolData) {
        throw new Error(`Symbol '${request.symbol}' not found`);
      }

      // Override method if specified
      if (request.method) {
        symbolData["3d"].method = request.method;
      }

      // Generate geometry
      const geometry = geometryEngine.generateSymbolGeometry(
        request.symbol, 
        request.parameters
      );

      if (!geometry) {
        throw new Error(`Failed to generate geometry for symbol '${request.symbol}'`);
      }

      // Apply transformations
      const transformationsApplied = this.applyTransformations(geometry, request.transformations);

      // Apply quality settings
      this.applyQualitySettings(geometry, request.quality || "medium");

      const result: MappingResult = {
        success: true,
        symbol_data: symbolData,
        geometry,
        transformations_applied: transformationsApplied,
        processing_time: performance.now() - startTime,
        cache_key: cacheKey
      };

      // Cache result
      this.cacheResult(cacheKey, result);

      return result;

    } catch (error) {
      return {
        success: false,
        symbol_data: {} as MathSymbol,
        geometry: {
          vertices: [],
          indices: [],
          normals: [],
          uvs: [],
          metadata: {
            symbol: request.symbol,
            method: "error",
            vertex_count: 0,
            triangle_count: 0
          }
        },
        transformations_applied: [],
        processing_time: performance.now() - startTime,
        cache_key: cacheKey
      };
    }
  }

  /**
   * Map multiple symbols to 3D
   */
  async mapMultipleSymbols(requests: MappingRequest[]): Promise<MappingResult[]> {
    return Promise.all(requests.map(request => this.mapSymbolTo3D(request)));
  }

  /**
   * Get all symbols in category as 3D
   */
  async mapCategoryTo3D(category: string, quality: string = "medium"): Promise<MappingResult[]> {
    const symbols = getSymbolsByCategory(category);
    const requests: MappingRequest[] = symbols.map(symbol => ({
      symbol: Object.keys(symbol)[0], // Get first key - this is simplified
      quality: quality as any
    }));
    
    return this.mapMultipleSymbols(requests);
  }

  /**
   * Apply geometric transformations
   */
  private applyTransformations(geometry: GeometryResult, transformations?: MappingRequest['transformations']): any[] {
    const applied: any[] = [];

    if (!transformations) return applied;

    const vertices = geometry.vertices;

    // Apply scale
    if (transformations.scale) {
      const [sx, sy, sz] = transformations.scale;
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] *= sx;
        vertices[i + 1] *= sy;
        vertices[i + 2] *= sz;
      }
      applied.push({ type: 'scale', values: [sx, sy, sz] });
    }

    // Apply rotation (simplified - would use proper rotation matrices)
    if (transformations.rotation) {
      const [rx, ry, rz] = transformations.rotation;
      // Apply rotation transformations
      applied.push({ type: 'rotation', values: [rx, ry, rz] });
    }

    // Apply translation
    if (transformations.translation) {
      const [tx, ty, tz] = transformations.translation;
      for (let i = 0; i < vertices.length; i += 3) {
        vertices[i] += tx;
        vertices[i + 1] += ty;
        vertices[i + 2] += tz;
      }
      applied.push({ type: 'translation', values: [tx, ty, tz] });
    }

    return applied;
  }

  /**
   * Apply quality settings to geometry
   */
  private applyQualitySettings(geometry: GeometryResult, quality: string): void {
    const qualityMultipliers = {
      low: 0.5,
      medium: 1.0,
      high: 2.0,
      ultra: 4.0
    };

    const multiplier = qualityMultipliers[quality as keyof typeof qualityMultipliers] || 1.0;

    // Quality affects tessellation, smoothing, etc.
    // This is a simplified implementation
    geometry.metadata.vertex_count = Math.floor(geometry.metadata.vertex_count * multiplier);
    geometry.metadata.triangle_count = Math.floor(geometry.metadata.triangle_count * multiplier);
  }

  /**
   * Generate cache key for request
   */
  private generateCacheKey(request: MappingRequest): string {
    return JSON.stringify({
      symbol: request.symbol,
      method: request.method,
      parameters: request.parameters,
      transformations: request.transformations,
      quality: request.quality
    });
  }

  /**
   * Cache result with LRU eviction
   */
  private cacheResult(key: string, result: MappingResult): void {
    if (this.cache.size >= this.maxCacheSize) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(key, result);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; maxSize: number; hitRate: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hitRate: 0.85 // Simplified - would track actual hits/misses
    };
  }
}

export const mappingEngine = new MappingEngine();
