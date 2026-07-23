import { ShapeRegistryValidator } from './shapeRegistryValidator';

export class SystemMaintenance {
  private static maintenanceInterval: NodeJS.Timeout | null = null;
  private static healthCheckInterval: NodeJS.Timeout | null = null;
  private static isRunning = false;
  private static performanceMetrics = {
    frameRate: 60,
    memoryUsage: 0,
    renderTime: 0,
    lastOptimization: Date.now(),
    geometryCache: 0,
    textureCache: 0,
    shapeGenerationTime: 0
  };

  static startMaintenance(): void {
    if (this.maintenanceInterval) return; // Already running

    console.log('🧹 System maintenance started - every 10 minutes');
    this.isRunning = true;

    this.maintenanceInterval = setInterval(async () => {
      try {
        await this.performMaintenance();
      } catch (error) {
        console.error('🚨 System maintenance error:', error);
        // Don't crash on maintenance errors - just log and continue
      }
    }, 600000); // Every 10 minutes - reduced frequency

    // Initial maintenance run - delayed more to allow system to stabilize
    setTimeout(() => {
      try {
        this.performMaintenance();
      } catch (error) {
        console.error('🚨 Initial maintenance error:', error);
      }
    }, 30000); // Wait 30 seconds after startup
  }

  private static performHealthCheck() {
    const memUsage = (performance as any).memory ?
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;

    this.performanceMetrics.memoryUsage = memUsage;
    this.performanceMetrics.frameRate = this.getCurrentFrameRate();

    // Adaptive memory management with device-specific thresholds
    const deviceMemory = (navigator as any).deviceMemory || 4;
    const criticalThreshold = Math.max(400, deviceMemory * 50);
    const highThreshold = Math.max(250, deviceMemory * 30);
    
    if (memUsage > criticalThreshold) {
      console.log('🚨 Critical memory usage detected, triggering emergency cleanup');
      this.emergencyCleanup();
    } else if (memUsage > highThreshold) {
      console.log('🧹 High memory usage detected, triggering optimization');
      this.performOptimization();
    }

    // Frame rate based optimization
    if (this.performanceMetrics.frameRate < 30) {
      console.log('📉 Low frame rate detected, reducing quality');
      this.reduceRenderingQuality();
    } else if (this.performanceMetrics.frameRate > 55) {
      console.log('📈 High frame rate detected, can increase quality');
      this.increaseRenderingQuality();
    }

    // Validate shape registry and clean cache periodically
    if (Date.now() - this.performanceMetrics.lastOptimization > 30 * 60 * 1000) {
      ShapeRegistryValidator.validateRegistry();
      this.cleanupShapeCache();
      this.performanceMetrics.lastOptimization = Date.now();
    }
  }

  static stopMaintenanceSchedule(): void {
    if (this.maintenanceInterval) {
      clearInterval(this.maintenanceInterval);
      this.maintenanceInterval = null;
    }
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ System maintenance and monitoring stopped');
  }

  private static async performMaintenance(): Promise<void> {
    if (this.isRunning) {
      console.log('🧹 Starting system maintenance...');

      try {
        // 1. WebGL resource cleanup
        await this.cleanupWebGLResources();

        // 2. Clear unused textures
        await this.cleanupTextures();

        // 3. Garbage collect JavaScript objects
        await this.forceGarbageCollection();

        // 4. Clear expired cache entries
        await this.cleanupExpiredCaches();

        // 5. Optimize performance settings
        await this.optimizePerformanceSettings();

        console.log('✅ System maintenance completed successfully');

      } catch (error) {
        console.error('❌ System maintenance failed:', error);
      } finally {
        // Reset isRunning after maintenance, but keep monitoring active
      }
    } else {
      console.log('System maintenance is not active. Skipping performMaintenance.');
    }
  }

  private static async cleanupWebGLResources(): Promise<void> {
    console.log('🎮 Cleaning up WebGL resources...');

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('webglCleanup'));
    }

    // Wait for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  private static async cleanupTextures(): Promise<void> {
    console.log('🖼️ Cleaning up unused textures...');

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('textureCleanup'));
    }
  }

  private static async forceGarbageCollection(): Promise<void> {
    console.log('🗑️ Forcing garbage collection...');

    // Create memory pressure to trigger GC
    const memoryPressure = new Array(1000000).fill(0);
    memoryPressure.length = 0; // Release immediately

    // Give browser time to collect
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  private static async cleanupExpiredCaches(): Promise<void> {
    console.log('💾 Cleaning up expired caches...');

    // Clear shape cache
    if (typeof window !== 'undefined' && (window as any).shapeCache) {
      (window as any).shapeCache.cleanup();
    }
  }

  private static async optimizePerformanceSettings(): Promise<void> {
    console.log('⚡ Optimizing performance settings...');

    // Check current performance and adjust settings
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('performanceOptimization'));
    }
  }

  // Re-apply optimized settings or adjust based on current metrics
  private static async applyOptimizedSettings(): Promise<void> {
    console.log('⚙️ Applying optimized settings...');
    // This could involve adjusting rendering quality, animation speed, etc.
    // For now, we'll just log it.
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('applyOptimizedSettings'));
    }
  }

  // Trigger optimization based on current metrics
  private static async performOptimization(): Promise<void> {
    console.log('🚀 Performing on-demand optimization...');
    await this.applyOptimizedSettings();
    this.performanceMetrics.lastOptimization = Date.now();
    // Potentially re-evaluate other metrics after optimization
  }

  // Emergency cleanup when memory is critical
  static emergencyCleanup(): Promise<void> {
    console.warn('🚨 Emergency cleanup activated!');

    return new Promise(async (resolve) => {
      // Aggressive cleanup
      await this.cleanupWebGLResources();
      await this.cleanupTextures();
      await this.cleanupShapeCache();
      await this.forceGarbageCollection();

      // Reduce quality to minimum
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('emergencyQualityReduction'));
      }

      resolve();
    });
  }

  private static getCurrentFrameRate(): number {
    // Simple frame rate calculation
    if (typeof performance !== 'undefined') {
      const now = performance.now();
      if (this.lastFrameTime) {
        const delta = now - this.lastFrameTime;
        const fps = 1000 / delta;
        this.lastFrameTime = now;
        return Math.min(120, Math.max(1, fps));
      }
      this.lastFrameTime = now;
    }
    return 60; // Default assumption
  }

  private static lastFrameTime: number = 0;

  private static async cleanupShapeCache(): Promise<void> {
    console.log('🗄️ Cleaning up shape cache...');

    if (typeof window !== 'undefined' && (window as any).shapeCache) {
      const cache = (window as any).shapeCache;
      if (cache.cleanup) {
        cache.cleanup();
      }
      if (cache.clear) {
        cache.clear();
      }
    }

    // Dispatch cache cleanup event
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('shapeCacheCleanup'));
    }
  }

  private static reduceRenderingQuality(): void {
    console.log('📉 Reducing rendering quality for performance');

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('reduceRenderQuality', {
        detail: {
          segments: 0.7, // Reduce segment count by 30%
          shadows: false,
          antialiasing: false,
          postProcessing: false
        }
      }));
    }
  }

  private static increaseRenderingQuality(): void {
    console.log('📈 Increasing rendering quality');

    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('increaseRenderQuality', {
        detail: {
          segments: 1.2, // Increase segment count by 20%
          shadows: true,
          antialiasing: true,
          postProcessing: true
        }
      }));
    }
  }
}

export const systemMaintenance = new SystemMaintenance();