import * as THREE from 'three';

/**
 * Advanced Memory Management System for Mathematical Visualization Platform
 * Prevents memory leaks in complex shape rendering and AI computations
 */

export class MemoryManager {
  private static instance: MemoryManager;
  private geometryCache = new Map<string, THREE.BufferGeometry>();
  private materialCache = new Map<string, THREE.Material>();
  private textureCache = new Map<string, THREE.Texture>();
  private cleanupInterval: NodeJS.Timeout | null = null;
  private memoryThreshold = 1024; // MB - increased threshold to prevent aggressive cleanups
  
  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }
  
  startMonitoring(): void {
    this.cleanupInterval = setInterval(() => {
      try {
        this.performCleanup();
        this.logMemoryUsage();
      } catch (error) {
        console.error('🚨 Memory manager error:', error);
        // Don't crash on memory management errors
      }
    }, 300000); // Every 5 minutes - further reduced frequency
  }
  
  private performCleanup(): void {
    // Clean unused geometries
    this.geometryCache.forEach((geometry, key) => {
      if (geometry.userData.lastUsed < Date.now() - 60000) { // 1 minute unused
        geometry.dispose();
        this.geometryCache.delete(key);
        console.log(`🧹 Cleaned unused geometry: ${key}`);
      }
    });
    
    // Clean unused materials
    this.materialCache.forEach((material, key) => {
      if (material.userData.lastUsed < Date.now() - 60000) {
        material.dispose();
        this.materialCache.delete(key);
        console.log(`🧹 Cleaned unused material: ${key}`);
      }
    });
    
    // Clean unused textures
    this.textureCache.forEach((texture, key) => {
      if (texture.userData.lastUsed < Date.now() - 60000) {
        texture.dispose();
        this.textureCache.delete(key);
        console.log(`🧹 Cleaned unused texture: ${key}`);
      }
    });
  }
  
  private logMemoryUsage(): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const used = Math.round(memInfo.usedJSHeapSize / 1048576);
      const limit = Math.round(memInfo.jsHeapSizeLimit / 1048576);
      
      console.log(`🧠 Memory: ${used}MB / ${limit}MB (${Math.round(used/limit*100)}%)`);
      
      if (used > this.memoryThreshold) {
        console.warn(`⚠️ High memory usage: ${used}MB - forcing cleanup`);
        this.forceCleanup();
      }
    }
  }
  
  private forceCleanup(): void {
    // Force garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
    
    // Clear all caches
    this.geometryCache.clear();
    this.materialCache.clear();
    this.textureCache.clear();
    
    console.log('🔥 Performed emergency memory cleanup');
  }
  
  cacheGeometry(key: string, geometry: THREE.BufferGeometry): THREE.BufferGeometry {
    geometry.userData.lastUsed = Date.now();
    this.geometryCache.set(key, geometry);
    return geometry;
  }
  
  getCachedGeometry(key: string): THREE.BufferGeometry | undefined {
    const geometry = this.geometryCache.get(key);
    if (geometry) {
      geometry.userData.lastUsed = Date.now();
    }
    return geometry;
  }
  
  stopMonitoring(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

export const memoryManager = MemoryManager.getInstance();
