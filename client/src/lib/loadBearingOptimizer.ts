/**
 * Load Bearing Optimizer - Intelligent load distribution and progressive loading
 * Ensures smooth performance even with complex mathematical visualizations
 */

interface LoadMetrics {
  cpuLoad: number;
  gpuLoad: number;
  memoryUsage: number;
  frameTime: number;
  pendingOperations: number;
}

interface LoadThresholds {
  maxCpuLoad: number;
  maxGpuLoad: number;
  maxMemoryMB: number;
  targetFrameTime: number;
}

export class LoadBearingOptimizer {
  private static instance: LoadBearingOptimizer;
  private metrics: LoadMetrics = {
    cpuLoad: 0,
    gpuLoad: 0,
    memoryUsage: 0,
    frameTime: 16,
    pendingOperations: 0
  };
  private thresholds: LoadThresholds = {
    maxCpuLoad: 80,
    maxGpuLoad: 85,
    maxMemoryMB: 512,
    targetFrameTime: 16.67 // 60fps target
  };
  private frameTimeSamples: number[] = [];
  private operationQueue: Array<{ fn: () => Promise<void>; priority: number }> = [];
  private isProcessing = false;
  private metricsInterval: ReturnType<typeof setInterval> | null = null;
  
  static getInstance(): LoadBearingOptimizer {
    if (!LoadBearingOptimizer.instance) {
      LoadBearingOptimizer.instance = new LoadBearingOptimizer();
    }
    return LoadBearingOptimizer.instance;
  }
  
  /**
   * Start monitoring system load
   */
  startMonitoring(): void {
    if (this.metricsInterval) return;
    
    this.metricsInterval = setInterval(() => {
      this.updateMetrics();
    }, 1000);
  }
  
  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }
  
  /**
   * Record a frame time for performance tracking
   */
  recordFrameTime(ms: number): void {
    this.frameTimeSamples.push(ms);
    if (this.frameTimeSamples.length > 60) {
      this.frameTimeSamples.shift();
    }
    this.metrics.frameTime = this.getAverageFrameTime();
  }
  
  /**
   * Get average frame time
   */
  private getAverageFrameTime(): number {
    if (this.frameTimeSamples.length === 0) return 16;
    return this.frameTimeSamples.reduce((a, b) => a + b, 0) / this.frameTimeSamples.length;
  }
  
  /**
   * Update load metrics
   */
  private updateMetrics(): void {
    // Memory usage
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      this.metrics.memoryUsage = Math.round(memInfo.usedJSHeapSize / (1024 * 1024));
    }
    
    // Estimate CPU load based on frame time deviation
    const frameTimeRatio = this.metrics.frameTime / this.thresholds.targetFrameTime;
    this.metrics.cpuLoad = Math.min(100, frameTimeRatio * 50);
    
    // GPU load estimation (rough based on frame drops)
    const recentFrames = this.frameTimeSamples.slice(-10);
    const droppedFrames = recentFrames.filter(t => t > 20).length;
    this.metrics.gpuLoad = (droppedFrames / 10) * 100;
    
    this.metrics.pendingOperations = this.operationQueue.length;
    
    // Adaptive quality adjustment
    this.adjustQuality();
  }
  
  /**
   * Adjust rendering quality based on load
   */
  private adjustQuality(): void {
    const isOverloaded = 
      this.metrics.cpuLoad > this.thresholds.maxCpuLoad ||
      this.metrics.gpuLoad > this.thresholds.maxGpuLoad ||
      this.metrics.memoryUsage > this.thresholds.maxMemoryMB;
    
    if (isOverloaded) {
      // Reduce quality
      const event = new CustomEvent('loadOptimizer:reduceQuality', {
        detail: {
          suggestedSegments: Math.max(32, 64 - Math.floor(this.metrics.cpuLoad / 10)),
          disableEffects: this.metrics.gpuLoad > 90
        }
      });
      window.dispatchEvent(event);
    }
  }
  
  /**
   * Queue an operation with priority
   */
  queueOperation(fn: () => Promise<void>, priority: number = 5): void {
    this.operationQueue.push({ fn, priority });
    this.operationQueue.sort((a, b) => b.priority - a.priority);
    this.processQueue();
  }
  
  /**
   * Process queued operations when load allows
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    if (this.operationQueue.length === 0) return;
    
    // Wait if system is overloaded
    if (this.metrics.cpuLoad > this.thresholds.maxCpuLoad) {
      setTimeout(() => this.processQueue(), 100);
      return;
    }
    
    this.isProcessing = true;
    
    const operation = this.operationQueue.shift();
    if (operation) {
      try {
        await operation.fn();
      } catch (error) {
        console.warn('Load-bearing operation failed:', error);
      }
    }
    
    this.isProcessing = false;
    
    // Continue processing
    if (this.operationQueue.length > 0) {
      requestAnimationFrame(() => this.processQueue());
    }
  }
  
  /**
   * Get optimal segment count based on current load
   */
  getOptimalSegments(baseSegments: number): number {
    const loadFactor = 1 - (this.metrics.cpuLoad / 200); // 0.5 to 1.0
    return Math.max(16, Math.floor(baseSegments * loadFactor));
  }
  
  /**
   * Check if system can handle additional load
   */
  canAcceptLoad(estimatedLoad: number): boolean {
    return this.metrics.cpuLoad + estimatedLoad < this.thresholds.maxCpuLoad;
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): LoadMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Get load status summary
   */
  getStatus(): 'optimal' | 'moderate' | 'heavy' | 'critical' {
    const avgLoad = (this.metrics.cpuLoad + this.metrics.gpuLoad) / 2;
    if (avgLoad < 40) return 'optimal';
    if (avgLoad < 60) return 'moderate';
    if (avgLoad < 80) return 'heavy';
    return 'critical';
  }
}

export const loadBearingOptimizer = LoadBearingOptimizer.getInstance();
