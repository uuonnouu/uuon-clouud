import * as THREE from 'three';

/**
 * Geometry Optimizer with LRU-based BufferGeometry pooling
 * Manages geometry memory efficiently for high-performance rendering
 */

interface CacheEntry {
  geometry: THREE.BufferGeometry;
  lastAccess: number;
  accessCount: number;
  memorySize: number;
}

export class GeometryOptimizer {
  private static instance: GeometryOptimizer;
  private cache = new Map<string, CacheEntry>();
  private maxCacheSize = 100; // Max geometries in cache
  private maxMemoryMB = 256; // Max memory in MB
  private currentMemoryMB = 0;
  
  static getInstance(): GeometryOptimizer {
    if (!GeometryOptimizer.instance) {
      GeometryOptimizer.instance = new GeometryOptimizer();
    }
    return GeometryOptimizer.instance;
  }
  
  /**
   * Generate a unique cache key for geometry parameters
   */
  generateKey(shapeType: string, params: Record<string, number>): string {
    const sortedParams = Object.keys(params).sort().map(k => `${k}:${params[k].toFixed(2)}`).join('|');
    return `${shapeType}_${sortedParams}`;
  }
  
  /**
   * Get geometry from cache or return undefined
   */
  get(key: string): THREE.BufferGeometry | undefined {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccess = Date.now();
      entry.accessCount++;
      return entry.geometry;
    }
    return undefined;
  }
  
  /**
   * Store geometry in cache with LRU eviction
   */
  set(key: string, geometry: THREE.BufferGeometry): void {
    const memorySize = this.estimateGeometryMemory(geometry);
    
    // Evict if necessary
    while (this.cache.size >= this.maxCacheSize || this.currentMemoryMB + memorySize > this.maxMemoryMB) {
      if (!this.evictLRU()) break;
    }
    
    this.cache.set(key, {
      geometry,
      lastAccess: Date.now(),
      accessCount: 1,
      memorySize
    });
    this.currentMemoryMB += memorySize;
  }
  
  /**
   * Evict least recently used geometry
   */
  private evictLRU(): boolean {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;
    
    this.cache.forEach((entry, key) => {
      if (entry.lastAccess < oldestTime) {
        oldestTime = entry.lastAccess;
        oldestKey = key;
      }
    });
    
    if (oldestKey) {
      const entry = this.cache.get(oldestKey);
      if (entry) {
        entry.geometry.dispose();
        this.currentMemoryMB -= entry.memorySize;
        this.cache.delete(oldestKey);
        return true;
      }
    }
    return false;
  }
  
  /**
   * Estimate geometry memory usage in MB
   */
  private estimateGeometryMemory(geometry: THREE.BufferGeometry): number {
    let bytes = 0;
    const attributes = geometry.attributes;
    
    for (const name in attributes) {
      const attr = attributes[name];
      if (attr && attr.array) {
        bytes += attr.array.byteLength;
      }
    }
    
    if (geometry.index) {
      bytes += geometry.index.array.byteLength;
    }
    
    return bytes / (1024 * 1024);
  }
  
  /**
   * Get cache statistics
   */
  getStats(): { entries: number; memoryMB: number; hitRate: number } {
    let totalAccess = 0;
    this.cache.forEach(entry => {
      totalAccess += entry.accessCount;
    });
    
    return {
      entries: this.cache.size,
      memoryMB: Math.round(this.currentMemoryMB * 100) / 100,
      hitRate: this.cache.size > 0 ? totalAccess / this.cache.size : 0
    };
  }
  
  /**
   * Clear all cached geometries
   */
  clear(): void {
    this.cache.forEach(entry => entry.geometry.dispose());
    this.cache.clear();
    this.currentMemoryMB = 0;
  }
}

export const geometryOptimizer = GeometryOptimizer.getInstance();
