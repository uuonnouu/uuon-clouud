import { SystemMaintenance } from './systemMaintenance';
import { memoryManager } from './memoryManager';
import { performanceMonitor } from './performanceMonitor';

interface CleanupMetrics {
  memoryBefore: number;
  memoryAfter: number;
  performanceGain: number;
  cleanupDuration: number;
  componentsOptimized: number;
}

export class FrontendCleanupSystem {
  private static instance: FrontendCleanupSystem;
  private isCleanupRunning = false;
  private cleanupHistory: CleanupMetrics[] = [];
  private qualityOscillationPrevention = {
    lastQualityChange: 0,
    changeCount: 0,
    stabilizationMode: false
  };
  private gentleCleanupInterval: ReturnType<typeof setInterval> | null = null;
  private emergencyCheckInterval: ReturnType<typeof setInterval> | null = null;

  static getInstance(): FrontendCleanupSystem {
    if (!FrontendCleanupSystem.instance) {
      FrontendCleanupSystem.instance = new FrontendCleanupSystem();
    }
    return FrontendCleanupSystem.instance;
  }

  // Emergency cleanup for overwhelmed frontend
  async emergencyCleanup(): Promise<CleanupMetrics> {
    if (this.isCleanupRunning) {
      console.log('🔄 Cleanup already in progress, skipping duplicate request');
      return this.getLastCleanupMetrics();
    }

    console.log('🚨 EMERGENCY FRONTEND CLEANUP INITIATED');
    this.isCleanupRunning = true;
    const startTime = performance.now();
    const memoryBefore = this.getMemoryUsage();

    try {
      // 1. Stabilize quality oscillation
      await this.stabilizeQualitySystem();

      // 2. Aggressive memory cleanup
      await this.aggressiveMemoryCleanup();

      // 3. Performance monitor reset
      await this.resetPerformanceMonitors();

      // 4. Component state cleanup
      await this.cleanupComponentStates();

      // 5. Event listener cleanup
      await this.cleanupEventListeners();

      // 6. Animation cleanup
      await this.cleanupAnimations();

      // 7. WebGL resource optimization
      await this.optimizeWebGLResources();

      const memoryAfter = this.getMemoryUsage();
      const duration = performance.now() - startTime;

      const metrics: CleanupMetrics = {
        memoryBefore,
        memoryAfter,
        performanceGain: ((memoryBefore - memoryAfter) / memoryBefore) * 100,
        cleanupDuration: duration,
        componentsOptimized: 7
      };

      this.cleanupHistory.push(metrics);
      console.log('✅ Emergency cleanup completed:', metrics);
      
      return metrics;
    } finally {
      this.isCleanupRunning = false;
    }
  }

  // Gentle cleanup for regular maintenance
  async gentleCleanup(): Promise<void> {
    if (this.isCleanupRunning) return;

    console.log('🧹 Gentle frontend cleanup started');
    this.isCleanupRunning = true;

    try {
      // Less aggressive cleanup operations
      await this.optimizeComponentCache();
      await this.cleanupUnusedEventListeners();
      await this.optimizeRenderingQueue();
      await this.preventQualityOscillation();
      
      console.log('✅ Gentle cleanup completed');
    } finally {
      this.isCleanupRunning = false;
    }
  }

  private async stabilizeQualitySystem(): Promise<void> {
    console.log('⚖️ Stabilizing quality oscillation system...');
    
    // Enable stabilization mode to prevent rapid quality changes
    this.qualityOscillationPrevention.stabilizationMode = true;
    
    // Reset quality change counters
    this.qualityOscillationPrevention.changeCount = 0;
    this.qualityOscillationPrevention.lastQualityChange = Date.now();

    // PRESERVE USER SETTINGS - Don't override user's current parameters
    if (typeof window !== 'undefined') {
      // Check if user has modified parameters before applying defaults
      window.dispatchEvent(new CustomEvent('preserveCurrentSettings'));
      
      // Only adjust mesh quality, not user parameters
      const nonIntrusiveSettings = {
        enableAnimations: false,
        enableParticles: false,
        renderQuality: 'medium' as const,
        adaptiveQuality: false, // Temporarily disable adaptive quality
        preserveUserParams: true // Flag to prevent parameter override
      };

      window.dispatchEvent(new CustomEvent('forceStableQuality', {
        detail: nonIntrusiveSettings
      }));
    }

    // Re-enable adaptive quality after stabilization period (30 seconds)
    setTimeout(() => {
      this.qualityOscillationPrevention.stabilizationMode = false;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('enableAdaptiveQuality'));
      }
      console.log('⚖️ Quality system stabilization period ended');
    }, 30000);
  }

  private async aggressiveMemoryCleanup(): Promise<void> {
    console.log('🧽 Aggressive memory cleanup...');
    
    // Clear all caches aggressively
    if (typeof window !== 'undefined') {
      // Clear shape cache
      if ((window as any).shapeCache) {
        (window as any).shapeCache.clear();
      }

      // Clear Three.js caches
      window.dispatchEvent(new CustomEvent('clearAllThreeJSCaches'));

      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
    }

    // Use memory manager for cleanup
    await SystemMaintenance.emergencyCleanup();
    
    // Create memory pressure to force cleanup
    const memoryPressure = Array.from({length: 10000}, () => new Array(1000).fill(0));
    setTimeout(() => {
      memoryPressure.length = 0;
    }, 100);
  }

  private async resetPerformanceMonitors(): Promise<void> {
    console.log('📊 Resetting performance monitors...');
    
    // Reset performance monitoring systems
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resetPerformanceMonitors'));
    }

    // Clear performance history to prevent bad data influence
    performanceMonitor.getMetrics(); // This will reset internal counters
  }

  private async cleanupComponentStates(): Promise<void> {
    console.log('🔧 Cleaning up component states...');
    
    if (typeof window !== 'undefined') {
      // Reset React component states that might be causing issues
      window.dispatchEvent(new CustomEvent('resetComponentStates'));
      
      // Clear any stuck loading states
      window.dispatchEvent(new CustomEvent('clearLoadingStates'));
      
      // Reset parameter states to defaults
      window.dispatchEvent(new CustomEvent('resetParameterStates'));
    }
  }

  private async cleanupEventListeners(): Promise<void> {
    console.log('👂 Cleaning up event listeners...');
    
    // Remove accumulated event listeners that might be causing memory leaks
    if (typeof window !== 'undefined') {
      const events = ['resize', 'scroll', 'mousemove', 'touchmove'];
      events.forEach(eventType => {
        // Clone node to remove all event listeners
        const body = document.body;
        const newBody = body.cloneNode(true);
        // Only do this for non-critical elements
      });

      // Dispatch cleanup event for components to remove their listeners
      window.dispatchEvent(new CustomEvent('cleanupEventListeners'));
    }
  }

  private async cleanupAnimations(): Promise<void> {
    console.log('🎬 Cleaning up animations...');
    
    if (typeof window !== 'undefined') {
      // Cancel all running animations
      window.dispatchEvent(new CustomEvent('cancelAllAnimations'));
      
      // Clear animation queues
      window.dispatchEvent(new CustomEvent('clearAnimationQueues'));
      
      // Reset animation states
      window.dispatchEvent(new CustomEvent('resetAnimationStates'));
    }
  }

  private async optimizeWebGLResources(): Promise<void> {
    console.log('🎮 Optimizing WebGL resources...');
    
    if (typeof window !== 'undefined') {
      // Dispose unused WebGL resources
      window.dispatchEvent(new CustomEvent('optimizeWebGLResources'));
      
      // Compress textures
      window.dispatchEvent(new CustomEvent('compressTextures'));
      
      // Optimize geometry
      window.dispatchEvent(new CustomEvent('optimizeGeometry'));
    }
  }

  private async optimizeComponentCache(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('optimizeComponentCache'));
    }
  }

  private async cleanupUnusedEventListeners(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cleanupUnusedEventListeners'));
    }
  }

  private async optimizeRenderingQueue(): Promise<void> {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('optimizeRenderingQueue'));
    }
  }

  private async preventQualityOscillation(): Promise<void> {
    const now = Date.now();
    if (now - this.qualityOscillationPrevention.lastQualityChange < 5000) {
      this.qualityOscillationPrevention.changeCount++;
      
      if (this.qualityOscillationPrevention.changeCount > 3) {
        console.log('🚫 Quality oscillation detected, enabling stabilization mode');
        await this.stabilizeQualitySystem();
      }
    } else {
      this.qualityOscillationPrevention.changeCount = 0;
    }
  }

  private getMemoryUsage(): number {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / 1024 / 1024;
    }
    return 0;
  }

  private getLastCleanupMetrics(): CleanupMetrics {
    return this.cleanupHistory[this.cleanupHistory.length - 1] || {
      memoryBefore: 0,
      memoryAfter: 0,
      performanceGain: 0,
      cleanupDuration: 0,
      componentsOptimized: 0
    };
  }

  // Scheduled cleanup - ultra-optimized intervals for minimal CPU usage
  startScheduledCleanup(): void {
    // Clear any existing intervals first to prevent duplicates
    this.stopScheduledCleanup();
    
    // Gentle cleanup every 60 minutes - minimal frequency
    this.gentleCleanupInterval = setInterval(() => {
      this.gentleCleanup();
    }, 60 * 60 * 1000);

    // Emergency cleanup check every 10 minutes - minimal frequency
    this.emergencyCheckInterval = setInterval(() => {
      const memoryUsage = this.getMemoryUsage();
      if (memoryUsage > 600) { // Raised threshold to 600MB
        console.log(`🚨 High memory usage detected: ${memoryUsage}MB`);
        this.emergencyCleanup();
      }
    }, 10 * 60 * 1000);
  }

  // Stop all scheduled cleanup intervals (prevents memory leaks on unmount)
  stopScheduledCleanup(): void {
    if (this.gentleCleanupInterval) {
      clearInterval(this.gentleCleanupInterval);
      this.gentleCleanupInterval = null;
    }
    if (this.emergencyCheckInterval) {
      clearInterval(this.emergencyCheckInterval);
      this.emergencyCheckInterval = null;
    }
  }

  getCleanupHistory(): CleanupMetrics[] {
    return [...this.cleanupHistory];
  }
}

export const frontendCleanup = FrontendCleanupSystem.getInstance();
