
/**
 * Intelligent Preloading System
 * Predicts and preloads shapes/resources based on user behavior
 */

import { geometryOptimizer } from './geometryOptimizer';

interface UsagePattern {
  shapeId: string;
  frequency: number;
  lastUsed: number;
  averageSessionTime: number;
}

export class IntelligentPreloader {
  private usagePatterns = new Map<string, UsagePattern>();
  private preloadQueue: string[] = [];
  private isPreloading = false;
  private maxPreloadItems = 5;

  constructor() {
    this.loadUsagePatterns();
    this.startIntelligentPreloading();
  }

  recordUsage(shapeId: string, sessionTime: number = 0) {
    const existing = this.usagePatterns.get(shapeId);
    
    if (existing) {
      existing.frequency++;
      existing.lastUsed = Date.now();
      existing.averageSessionTime = (existing.averageSessionTime + sessionTime) / 2;
    } else {
      this.usagePatterns.set(shapeId, {
        shapeId,
        frequency: 1,
        lastUsed: Date.now(),
        averageSessionTime: sessionTime
      });
    }

    this.saveUsagePatterns();
    this.updatePreloadQueue();
  }

  private updatePreloadQueue() {
    // Sort by usage frequency and recency
    const sortedShapes = Array.from(this.usagePatterns.values())
      .sort((a, b) => {
        const scoreA = this.calculatePreloadScore(a);
        const scoreB = this.calculatePreloadScore(b);
        return scoreB - scoreA;
      })
      .slice(0, this.maxPreloadItems)
      .map(p => p.shapeId);

    this.preloadQueue = sortedShapes.filter(shapeId => 
      !geometryOptimizer.get(geometryOptimizer.generateKey(shapeId, {}))
    );
  }

  private calculatePreloadScore(pattern: UsagePattern): number {
    const recencyWeight = 0.3;
    const frequencyWeight = 0.5;
    const sessionWeight = 0.2;

    const daysSinceUsed = (Date.now() - pattern.lastUsed) / (1000 * 60 * 60 * 24);
    const recencyScore = Math.max(0, 10 - daysSinceUsed) * recencyWeight;
    const frequencyScore = Math.log(pattern.frequency + 1) * frequencyWeight;
    const sessionScore = Math.min(pattern.averageSessionTime / 1000, 300) / 300 * sessionWeight;

    return recencyScore + frequencyScore + sessionScore;
  }

  private async startIntelligentPreloading() {
    if (this.isPreloading) return;
    this.isPreloading = true;

    while (this.preloadQueue.length > 0) {
      const shapeId = this.preloadQueue.shift()!;
      
      try {
        await this.preloadShape(shapeId);
        console.log(`🔮 Preloaded shape: ${shapeId}`);
        
        // Yield control to prevent blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`⚠️ Preload failed for ${shapeId}:`, error);
      }
    }

    this.isPreloading = false;
    
    // Schedule next preload check
    setTimeout(() => this.startIntelligentPreloading(), 30000);
  }

  private async preloadShape(shapeId: string) {
    // Import the shape dynamically and cache its geometry
    try {
      const { UNIFIED_SHAPES } = await import('./unifiedShapes');
      const shapeData = UNIFIED_SHAPES[shapeId];
      
      if (shapeData) {
        // Pre-generate geometry with default parameters
        const defaultParams = shapeData.defaultParams || {};
        const cacheKey = geometryOptimizer.generateKey(shapeId, defaultParams);
        
        if (!geometryOptimizer.get(cacheKey)) {
          // Generate and cache the geometry
          const geometry = await this.generateShapeGeometry(shapeData, defaultParams);
          geometryOptimizer.set(cacheKey, geometry);
        }
      }
    } catch (error) {
      throw new Error(`Failed to preload shape ${shapeId}: ${error}`);
    }
  }

  private async generateShapeGeometry(shapeData: any, params: any) {
    // This would integrate with your existing geometry generation
    // For now, return a placeholder
    const THREE = await import('three');
    return new THREE.BufferGeometry();
  }

  private loadUsagePatterns() {
    try {
      const stored = localStorage.getItem('shapeUsagePatterns');
      if (stored) {
        const patterns = JSON.parse(stored);
        Object.entries(patterns).forEach(([key, value]: [string, any]) => {
          this.usagePatterns.set(key, value);
        });
      }
    } catch (error) {
      console.warn('Failed to load usage patterns:', error);
    }
  }

  private saveUsagePatterns() {
    try {
      const patterns = Object.fromEntries(this.usagePatterns);
      localStorage.setItem('shapeUsagePatterns', JSON.stringify(patterns));
    } catch (error) {
      console.warn('Failed to save usage patterns:', error);
    }
  }

  getPreloadStats() {
    return {
      totalPatterns: this.usagePatterns.size,
      queueLength: this.preloadQueue.length,
      isPreloading: this.isPreloading,
      topShapes: Array.from(this.usagePatterns.values())
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5)
        .map(p => ({ shape: p.shapeId, frequency: p.frequency }))
    };
  }
}

export const intelligentPreloader = new IntelligentPreloader();
