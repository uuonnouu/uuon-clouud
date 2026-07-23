/**
 * PERFORMANCE ANALYTICS & OPTIMIZATION ENGINE
 * Real-time monitoring and automatic optimization of mathematical rendering
 */

import { intelligenceMetricsEnhancer } from './intelligenceMetricsEnhancer';

// Listen for autonomous optimization events — guarded to prevent duplicate registration
if (typeof window !== 'undefined' && !(window as any).__perfAnalyticsListenerInit) {
  (window as any).__perfAnalyticsListenerInit = true;
  window.addEventListener('autonomousOptimization', (event: any) => {
    const { metric, action, expectedImpact } = event.detail;
    console.log(`🤖 Autonomous optimization triggered: ${action} on ${metric} (expected impact: ${(expectedImpact * 100).toFixed(1)}%)`);

    // Apply the optimization based on the metric and action
    switch (metric) {
      case 'frameRate':
        if (action === 'optimize') {
          // Trigger frame rate optimization
          window.dispatchEvent(new CustomEvent('reduceQuality'));
        }
        break;
      case 'memoryUsage':
        if (action === 'optimize') {
          // Trigger memory cleanup
          window.dispatchEvent(new CustomEvent('memoryCleanup'));
        }
        break;
      case 'renderTime':
        if (action === 'optimize') {
          // Trigger render optimization
          window.dispatchEvent(new CustomEvent('optimizeRendering'));
        }
        break;
    }
  });
}

export interface PerformanceMetrics {
  frameRate: number;
  renderTime: number;
  geometryGenerationTime: number;
  shaderCompilationTime: number;
  memoryUsage: number;
  vertexCount: number;
  triangleCount: number;
  drawCalls: number;
  parameterComplexity: number;
  shapeDifficulty: 'trivial' | 'simple' | 'moderate' | 'complex' | 'extreme';
  physicsComputationTime?: number;
  quantumStateComplexity?: number;
  relativisticAccuracy?: number;
  mathematicalPrecision?: number;
}

export interface OptimizationRecommendation {
  type: 'reduce_segments' | 'simplify_equation' | 'cache_geometry' | 'level_of_detail';
  description: string;
  expectedImprovement: number; // percentage
  implementation: () => void;
}

export class PerformanceAnalyticsEngine {
  private metrics: PerformanceMetrics[] = [];
  private readonly MAX_METRICS_HISTORY = 50; // Ultra-reduced for minimal memory footprint
  private readonly MEMORY_PRESSURE_THRESHOLD = 0.85; // 85% of max memory
  private currentShapeMetrics = new Map<string, PerformanceMetrics>();
  private performanceTargets = {
    minFrameRate: 30,
    maxRenderTime: 16.67, // 60fps target
    maxMemoryUsage: 500 * 1024 * 1024, // 500MB
    maxVertexCount: 1000000
  };
  private memoryPressureDetected = false;
  private analysisInterval: any; // To hold the interval ID

  // Placeholder for the continuous analysis method that will be modified
  private requestThrottleMap = new Map<string, number>();
  private readonly REQUEST_THROTTLE_DURATION = 5000; // 5 seconds

  private frameTimeHistory: number[] = [];
  private memoryUsageHistory: Array<{timestamp: number, used: number, total: number}> = [];
  private renderingMetrics = new Map<string, {count: number, totalTime: number, avgTime: number}>();
  private performanceObserver?: PerformanceObserver;

  private startContinuousAnalysis(): void {
    this.analysisInterval = setInterval(() => {
      this.analyzeCurrentPerformance();
      this.optimizeIfNeeded();
      this.cleanupOldMetrics();
      this.cleanupThrottleMap();
    }, 300000); // Reduced to 5 minutes to minimize CPU overhead
  }

  private cleanupThrottleMap(): void {
    const now = Date.now();
    const entries = Array.from(this.requestThrottleMap.entries());
    for (const [key, timestamp] of entries) {
      if (now - timestamp > this.REQUEST_THROTTLE_DURATION * 2) {
        this.requestThrottleMap.delete(key);
      }
    }
  }

  shouldThrottleRequest(shapeId: string): boolean {
    const now = Date.now();
    const lastRequest = this.requestThrottleMap.get(shapeId);

    if (lastRequest && (now - lastRequest) < this.REQUEST_THROTTLE_DURATION) {
      return true; // Throttle this request
    }

    this.requestThrottleMap.set(shapeId, now);
    return false; // Allow this request
  }

  // Placeholder methods that would be called by startContinuousAnalysis
  private analyzeCurrentPerformance(): void {
    // In a real scenario, this would analyze the current state
    // For this example, we'll just log that it's running
    // console.log("Analyzing current performance...");
  }

  private optimizeIfNeeded(): void {
    // In a real scenario, this would check if optimization is needed
    // console.log("Checking if optimization is needed...");
  }

  private cleanupOldMetrics(): void {
    // In a real scenario, this would clean up old metrics
    // console.log("Cleaning up old metrics...");
  }

  // Method to stop the interval when the engine is no longer needed
  stopContinuousAnalysis(): void {
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
  }

  startMetricsCapture(shapeId: string): void {
    const startTime = performance.now();

    // Initialize metrics for this shape
    this.currentShapeMetrics.set(shapeId, {
      frameRate: 0,
      renderTime: 0,
      geometryGenerationTime: startTime,
      shaderCompilationTime: 0,
      memoryUsage: this.estimateMemoryUsage(),
      vertexCount: 0,
      triangleCount: 0,
      drawCalls: 1,
      parameterComplexity: 0,
      shapeDifficulty: 'simple',
      physicsComputationTime: 0, // Initialize new physics metrics
      quantumStateComplexity: 0,
      relativisticAccuracy: 1.0, // Assume perfect accuracy initially
      mathematicalPrecision: 1.0 // Assume perfect precision initially
    });
  }

  endMetricsCapture(shapeId: string, vertexCount: number, triangleCount: number): void {
    const endTime = performance.now();
    const metrics = this.currentShapeMetrics.get(shapeId);

    if (!metrics) return;

    metrics.renderTime = endTime - metrics.geometryGenerationTime;
    metrics.geometryGenerationTime = metrics.renderTime;
    metrics.vertexCount = vertexCount;
    metrics.triangleCount = triangleCount;
    metrics.frameRate = 1000 / metrics.renderTime;
    metrics.shapeDifficulty = this.classifyShapeDifficulty(metrics);

    this.metrics.push(metrics);

    // 🧮 INTELLIGENCE ENHANCEMENT: Record metrics for trend analysis
    intelligenceMetricsEnhancer.recordMetric('frameRate', metrics.frameRate, 0.95);
    intelligenceMetricsEnhancer.recordMetric('renderTime', metrics.renderTime, 0.90);
    intelligenceMetricsEnhancer.recordMetric('memoryUsage', metrics.memoryUsage / (1024 * 1024), 0.85);
    intelligenceMetricsEnhancer.recordMetric('vertexCount', metrics.vertexCount, 0.99);
    intelligenceMetricsEnhancer.recordMetric('physicsComputationTime', metrics.physicsComputationTime || 0, 0.88);
    intelligenceMetricsEnhancer.recordMetric('quantumStateComplexity', metrics.quantumStateComplexity || 0, 0.82);
    intelligenceMetricsEnhancer.recordMetric('relativisticAccuracy', metrics.relativisticAccuracy || 1.0, 0.90);
    intelligenceMetricsEnhancer.recordMetric('mathematicalPrecision', metrics.mathematicalPrecision || 1.0, 0.91);


    const difficultyScore = this.getDifficultyScore(metrics.shapeDifficulty);
    intelligenceMetricsEnhancer.recordMetric('shapeDifficulty', difficultyScore, 0.92);

    // Rolling window: Prevent unlimited metrics storage
    if (this.metrics.length > this.MAX_METRICS_HISTORY) {
      const removeCount = this.metrics.length - this.MAX_METRICS_HISTORY;
      this.metrics.splice(0, removeCount);
    }

    this.analyzePerformanceTrends();
    this.detectMemoryPressure();
  }

  getOptimizationRecommendations(shapeId: string): OptimizationRecommendation[] {
    const metrics = this.currentShapeMetrics.get(shapeId);
    if (!metrics) return [];

    const recommendations: OptimizationRecommendation[] = [];

    // Frame rate too low
    if (metrics.frameRate < this.performanceTargets.minFrameRate) {
      recommendations.push({
        type: 'reduce_segments',
        description: `Reduce mesh resolution from ${metrics.vertexCount} to ${Math.floor(metrics.vertexCount * 0.7)} vertices`,
        expectedImprovement: 30,
        implementation: () => this.reduceSegments(shapeId, 0.7)
      });
    }

    // Too many vertices
    if (metrics.vertexCount > this.performanceTargets.maxVertexCount) {
      recommendations.push({
        type: 'level_of_detail',
        description: 'Implement Level-of-Detail (LOD) system for distant viewing',
        expectedImprovement: 50,
        implementation: () => this.implementLOD(shapeId)
      });
    }

    // High memory usage
    if (metrics.memoryUsage > this.performanceTargets.maxMemoryUsage) {
      recommendations.push({
        type: 'cache_geometry',
        description: 'Enable geometry caching and compression',
        expectedImprovement: 40,
        implementation: () => this.enableGeometryCache(shapeId)
      });
    }

    // Complex equations
    if (metrics.parameterComplexity > 0.8) {
      recommendations.push({
        type: 'simplify_equation',
        description: 'Simplify mathematical equation complexity',
        expectedImprovement: 25,
        implementation: () => this.simplifyEquation(shapeId)
      });
    }

    // Physics Computation Time
    if (metrics.physicsComputationTime && metrics.physicsComputationTime > 50) { // Example threshold
      recommendations.push({
        type: 'simplify_equation', // Or a new type for physics optimization
        description: `Optimize physics computation: currently taking ${metrics.physicsComputationTime.toFixed(2)}ms`,
        expectedImprovement: 20,
        implementation: () => this.optimizePhysicsComputation(shapeId)
      });
    }

    // Quantum State Complexity
    if (metrics.quantumStateComplexity && metrics.quantumStateComplexity > 0.9) { // Example threshold
      recommendations.push({
        type: 'simplify_equation', // Or a new type for quantum optimization
        description: `Simplify quantum state: complexity is ${metrics.quantumStateComplexity.toFixed(2)}`,
        expectedImprovement: 15,
        implementation: () => this.simplifyQuantumState(shapeId)
      });
    }

    // Relativistic Accuracy
    if (metrics.relativisticAccuracy && metrics.relativisticAccuracy < 0.95) { // Example threshold
      recommendations.push({
        type: 'simplify_equation', // Or a new type for relativistic optimization
        description: `Improve relativistic accuracy: currently at ${metrics.relativisticAccuracy.toFixed(2)}`,
        expectedImprovement: 10,
        implementation: () => this.improveRelativisticAccuracy(shapeId)
      });
    }

    // Mathematical Precision
    if (metrics.mathematicalPrecision && metrics.mathematicalPrecision < 0.98) { // Example threshold
      recommendations.push({
        type: 'simplify_equation', // Or a new type for precision optimization
        description: `Enhance mathematical precision: currently at ${metrics.mathematicalPrecision.toFixed(2)}`,
        expectedImprovement: 5,
        implementation: () => this.enhanceMathematicalPrecision(shapeId)
      });
    }


    return recommendations;
  }

  private getDifficultyScore(difficulty: 'trivial' | 'simple' | 'moderate' | 'complex' | 'extreme'): number {
    const scores = { trivial: 0.1, simple: 0.3, moderate: 0.5, complex: 0.7, extreme: 0.9 };
    return scores[difficulty];
  }

  private classifyShapeDifficulty(metrics: PerformanceMetrics): 'trivial' | 'simple' | 'moderate' | 'complex' | 'extreme' {
    const score = (
      (metrics.vertexCount / 100000) +
      (metrics.renderTime / 10) +
      (metrics.parameterComplexity * 5) +
      (metrics.memoryUsage / (100 * 1024 * 1024)) +
      (metrics.physicsComputationTime ? metrics.physicsComputationTime / 50 : 0) + // Include physics time
      (metrics.quantumStateComplexity ? metrics.quantumStateComplexity * 2 : 0) + // Include quantum complexity
      (metrics.relativisticAccuracy ? (1 - metrics.relativisticAccuracy) * 3 : 0) + // Include relativistic inaccuracy
      (metrics.mathematicalPrecision ? (1 - metrics.mathematicalPrecision) * 3 : 0) // Include mathematical imprecision
    );

    if (score < 0.5) return 'trivial';
    if (score < 1.5) return 'simple';
    if (score < 3.0) return 'moderate';
    if (score < 6.0) return 'complex';
    return 'extreme';
  }

  private analyzePerformanceTrends(): void {
    if (this.metrics.length < 10) return;

    const recent = this.metrics.slice(-10);
    const avgFrameRate = recent.reduce((sum, m) => sum + m.frameRate, 0) / recent.length;
    const avgRenderTime = recent.reduce((sum, m) => sum + m.renderTime, 0) / recent.length;

    // Detect performance degradation EARLIER with predictive analysis
    const recentSlope = this.calculatePerformanceSlope(recent);
    if (recentSlope < -0.5 || avgFrameRate < this.performanceTargets.minFrameRate * 1.2) {
      console.warn(`⚠️ Performance degradation predicted: ${avgFrameRate.toFixed(1)} fps (slope: ${recentSlope.toFixed(2)})`);
      this.triggerPerformanceOptimization();
    }

    // Detect memory leaks
    const memoryTrend = recent.slice(-5).map(m => m.memoryUsage);
    const isIncreasing = memoryTrend.every((val, i) => i === 0 || val >= memoryTrend[i - 1]);
    if (isIncreasing && memoryTrend[memoryTrend.length - 1] > this.performanceTargets.maxMemoryUsage) {
      console.warn('🚨 Memory leak detected - memory usage consistently increasing');
    }

    this.detectPerformanceTrends(recent);
    this.adjustQualityBasedOnTrends(avgFrameRate, avgRenderTime);
  }

  private calculatePerformanceSlope(metrics: PerformanceMetrics[]): number {
    // Calculate trend slope for predictive analysis
    if (metrics.length < 2) return 0;

    const n = metrics.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    metrics.forEach((m, i) => {
      sumX += i;
      sumY += m.frameRate;
      sumXY += i * m.frameRate;
      sumX2 += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private detectMemoryPressure(): void {
    const currentMemory = this.estimateMemoryUsage();
    const memoryUsageRatio = currentMemory / this.performanceTargets.maxMemoryUsage;

    if (memoryUsageRatio > this.MEMORY_PRESSURE_THRESHOLD) {
      if (!this.memoryPressureDetected) {
        this.memoryPressureDetected = true;
        console.warn(`🔴 Memory pressure detected: ${(memoryUsageRatio * 100).toFixed(1)}% of max memory`);
        this.handleMemoryPressure();
      }
    } else if (memoryUsageRatio < 0.7) {
      // Memory pressure relieved
      if (this.memoryPressureDetected) {
        this.memoryPressureDetected = false;
        console.log('✅ Memory pressure relieved');
      }
    }
  }

  private handleMemoryPressure(): void {
    // Trigger aggressive cleanup
    console.log('🧹 Triggering memory cleanup...');

    // Clear old metrics more aggressively under memory pressure
    if (this.metrics.length > this.MAX_METRICS_HISTORY * 0.5) {
      const removeCount = Math.floor(this.metrics.length * 0.3);
      this.metrics.splice(0, removeCount);
      console.log(`🗑️ Removed ${removeCount} old metric entries`);
    }

    // Clear old shape metrics
    const shapesToRemove: string[] = [];
    const cutoffTime = Date.now() - (5 * 60 * 1000); // 5 minutes

    for (const entry of Array.from(this.currentShapeMetrics.entries())) {
      const [shapeId, metrics] = entry;
      if (metrics.geometryGenerationTime < cutoffTime) {
        shapesToRemove.push(shapeId);
      }
    }

    shapesToRemove.forEach(id => this.currentShapeMetrics.delete(id));
    if (shapesToRemove.length > 0) {
      console.log(`🗑️ Cleared ${shapesToRemove.length} old shape metric entries`);
    }

    // Dispatch event for other systems to clean up
    window.dispatchEvent(new CustomEvent('memoryPressure', {
      detail: { severity: 'high', timestamp: Date.now() }
    }));
  }

  private triggerPerformanceOptimization(): void {
    // Automatically apply conservative optimizations
    const recentShapes = Array.from(this.currentShapeMetrics.keys()).slice(-5);

    recentShapes.forEach(shapeId => {
      const recommendations = this.getOptimizationRecommendations(shapeId);
      const safeOptimizations = recommendations.filter(r =>
        r.type === 'reduce_segments' && r.expectedImprovement < 40
      );

      safeOptimizations.forEach(opt => {
        console.log(`🔧 Auto-applying optimization: ${opt.description}`);
        opt.implementation();
      });
    });
  }

  private reduceSegments(shapeId: string, factor: number): void {
    // Implementation would modify shape parameters to reduce segment count
    console.log(`Reducing segments for ${shapeId} by ${(1-factor)*100}%`);
  }

  private implementLOD(shapeId: string): void {
    console.log(`Implementing LOD for ${shapeId}`);
  }

  private enableGeometryCache(shapeId: string): void {
    console.log(`Enabling geometry cache for ${shapeId}`);
  }

  private simplifyEquation(shapeId: string): void {
    console.log(`Simplifying equation for ${shapeId}`);
  }

  // New methods for physics-related optimizations
  private optimizePhysicsComputation(shapeId: string): void {
    console.log(`Optimizing physics computation for ${shapeId}`);
    // Placeholder for actual physics optimization logic
  }

  private simplifyQuantumState(shapeId: string): void {
    console.log(`Simplifying quantum state for ${shapeId}`);
    // Placeholder for actual quantum state simplification logic
  }

  private improveRelativisticAccuracy(shapeId: string): void {
    console.log(`Improving relativistic accuracy for ${shapeId}`);
    // Placeholder for actual relativistic accuracy improvement logic
  }

  private enhanceMathematicalPrecision(shapeId: string): void {
    console.log(`Enhancing mathematical precision for ${shapeId}`);
    // Placeholder for actual mathematical precision enhancement logic
  }


  private estimateMemoryUsage(): number {
    // Estimate current memory usage
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  }

  getAverageMetrics(): PerformanceMetrics | null {
    if (this.metrics.length === 0) return null;

    const avg = this.metrics.reduce((sum, metrics) => ({
      frameRate: sum.frameRate + metrics.frameRate,
      renderTime: sum.renderTime + metrics.renderTime,
      geometryGenerationTime: sum.geometryGenerationTime + metrics.geometryGenerationTime,
      shaderCompilationTime: sum.shaderCompilationTime + metrics.shaderCompilationTime,
      memoryUsage: sum.memoryUsage + metrics.memoryUsage,
      vertexCount: sum.vertexCount + metrics.vertexCount,
      triangleCount: sum.triangleCount + metrics.triangleCount,
      drawCalls: sum.drawCalls + metrics.drawCalls,
      parameterComplexity: sum.parameterComplexity + metrics.parameterComplexity,
      shapeDifficulty: 'moderate' as const,
      physicsComputationTime: sum.physicsComputationTime + (metrics.physicsComputationTime || 0),
      quantumStateComplexity: sum.quantumStateComplexity + (metrics.quantumStateComplexity || 0),
      relativisticAccuracy: sum.relativisticAccuracy + (metrics.relativisticAccuracy || 1.0),
      mathematicalPrecision: sum.mathematicalPrecision + (metrics.mathematicalPrecision || 1.0)
    }), {
      frameRate: 0, renderTime: 0, geometryGenerationTime: 0, shaderCompilationTime: 0,
      memoryUsage: 0, vertexCount: 0, triangleCount: 0, drawCalls: 0, parameterComplexity: 0,
      shapeDifficulty: 'moderate' as const,
      physicsComputationTime: 0,
      quantumStateComplexity: 0,
      relativisticAccuracy: 0,
      mathematicalPrecision: 0
    });

    const count = this.metrics.length;
    return {
      frameRate: avg.frameRate / count,
      renderTime: avg.renderTime / count,
      geometryGenerationTime: avg.geometryGenerationTime / count,
      shaderCompilationTime: avg.shaderCompilationTime / count,
      memoryUsage: avg.memoryUsage / count,
      vertexCount: Math.round(avg.vertexCount / count),
      triangleCount: Math.round(avg.triangleCount / count),
      drawCalls: Math.round(avg.drawCalls / count),
      parameterComplexity: avg.parameterComplexity / count,
      shapeDifficulty: this.classifyShapeDifficulty({
        frameRate: avg.frameRate / count,
        renderTime: avg.renderTime / count,
        geometryGenerationTime: avg.geometryGenerationTime / count,
        shaderCompilationTime: avg.shaderCompilationTime / count,
        memoryUsage: avg.memoryUsage / count,
        vertexCount: Math.round(avg.vertexCount / count),
        triangleCount: Math.round(avg.triangleCount / count),
        drawCalls: Math.round(avg.drawCalls / count),
        parameterComplexity: avg.parameterComplexity / count,
        shapeDifficulty: 'moderate',
        physicsComputationTime: avg.physicsComputationTime / count,
        quantumStateComplexity: avg.quantumStateComplexity / count,
        relativisticAccuracy: avg.relativisticAccuracy / count,
        mathematicalPrecision: avg.mathematicalPrecision / count
      }),
      physicsComputationTime: avg.physicsComputationTime / count,
      quantumStateComplexity: avg.quantumStateComplexity / count,
      relativisticAccuracy: avg.relativisticAccuracy / count,
      mathematicalPrecision: avg.mathematicalPrecision / count
    };
  }

  generatePerformanceReport(): string {
    const avgMetrics = this.getAverageMetrics();
    if (!avgMetrics) return 'No performance data available';

    // Get intelligence insights
    const intelligenceReport = intelligenceMetricsEnhancer.getSummaryReport() as any;
    const systemHealth = (intelligenceReport.systemHealth * 100).toFixed(1);

    return `
📊 Performance Analytics Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Frame Rate: ${avgMetrics.frameRate.toFixed(1)} fps
⏱️  Render Time: ${avgMetrics.renderTime.toFixed(2)} ms
🧮 Avg Vertices: ${avgMetrics.vertexCount.toLocaleString()}
📐 Avg Triangles: ${avgMetrics.triangleCount.toLocaleString()}
💾 Memory Usage: ${(avgMetrics.memoryUsage / (1024*1024)).toFixed(1)} MB
🔄 Draw Calls: ${avgMetrics.drawCalls}
🎚️  Complexity: ${(avgMetrics.parameterComplexity * 100).toFixed(1)}%
🏆 Difficulty: ${avgMetrics.shapeDifficulty.toUpperCase()}

✨ Physics Metrics:
   Physics Computation Time: ${(avgMetrics.physicsComputationTime || 0).toFixed(2)} ms
   Quantum State Complexity: ${(avgMetrics.quantumStateComplexity || 0).toFixed(2)}
   Relativistic Accuracy: ${(avgMetrics.relativisticAccuracy || 1.0).toFixed(2)}
   Mathematical Precision: ${(avgMetrics.mathematicalPrecision || 1.0).toFixed(2)}

🧠 Intelligence Metrics:
   System Health: ${systemHealth}% (φ-enhanced)
   Active Trends: ${Object.keys(intelligenceReport.metrics || {}).length}
   Learning Rate: ${this.getIntelligenceTrend()}

Total Shapes Analyzed: ${this.metrics.length}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }

  private detectPerformanceTrends(recent: PerformanceMetrics[]): void {
    if (recent.length < 5) return;

    // Calculate performance slope over time
    const frameRates = recent.map(m => m.frameRate);
    const slope = this.calculateSlope(frameRates);

    // Predict performance degradation
    if (slope < -2) { // Frame rate declining by 2fps per measurement
      console.warn('🔻 Performance degradation trend detected');
      this.scheduleProactiveOptimization();
    }

    // Memory leak detection
    const memoryUsages = recent.map(m => m.memoryUsage);
    const memorySlope = this.calculateSlope(memoryUsages);
    if (memorySlope > 10 * 1024 * 1024) { // 10MB increase per measurement
      console.warn('📈 Memory leak pattern detected');
      this.scheduleMemoryCleanup();
    }
  }

  private calculateSlope(values: number[]): number {
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumX2 = values.reduce((sum, _, i) => sum + i * i, 0);

    // Avoid division by zero if n=1
    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) return 0;

    return (n * sumXY - sumX * sumY) / denominator;
  }

  private scheduleProactiveOptimization(): void {
    // Reduce quality preemptively
    setTimeout(() => {
      console.log('🔧 Applying proactive quality reduction');
      // Trigger quality reduction in performance monitor
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('proactiveOptimization'));
      }
    }, 1000);
  }

  private scheduleMemoryCleanup(): void {
    // Force garbage collection and cache cleanup
    setTimeout(() => {
      console.log('🧹 Performing proactive memory cleanup');
      if (typeof window !== 'undefined') {
        // Clear unused textures, geometries, etc.
        window.dispatchEvent(new CustomEvent('memoryCleanup'));
      }
    }, 500);
  }

  private adjustQualityBasedOnTrends(avgFrameRate: number, avgRenderTime: number): void {
    const currentTime = Date.now();
    const timeSinceLastAdjustment = currentTime - (this.lastQualityAdjustment || 0);

    // Don't adjust too frequently
    if (timeSinceLastAdjustment < 5000) return;

    // DISABLED: Auto quality adjustment - poor visual quality
    // Only reduce in absolute emergency (FPS < 5)
    if (avgFrameRate < 5) {
      console.log('🚨 Emergency quality reduction - FPS critically low');
      this.triggerQualityReduction();
      this.lastQualityAdjustment = currentTime;
    }
  }

  private lastQualityAdjustment = 0;

  private triggerQualityReduction(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('reduceQuality'));
    }
  }

  private triggerQualityIncrease(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('increaseQuality'));
    }
  }

  private getIntelligenceTrend(): string {
    const frameRateTrend = intelligenceMetricsEnhancer.getTrend('frameRate');
    if (frameRateTrend) {
      const direction = frameRateTrend.direction === 'ascending' ? '📈' :
                       frameRateTrend.direction === 'descending' ? '📉' : '➡️';
      return `${direction} ${frameRateTrend.velocity.toFixed(4)}/update`;
    }
    return 'Analyzing...';
  }

  // Add a constructor or initialization method to start the analysis
  constructor() {
    this.startContinuousAnalysis();
    this.setupAdvancedMetrics();
  }

  private setupAdvancedMetrics() {
    // Setup performance observer for detailed metrics
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name.startsWith('shape-render-')) {
            const shapeName = entry.name.replace('shape-render-', '');
            this.recordRenderingTime(shapeName, entry.duration);
          }
        }
      });

      this.performanceObserver.observe({ entryTypes: ['measure'] });
    }

    // Track memory usage periodically
    setInterval(() => {
      this.trackMemoryUsage();
    }, 5000);
  }

  trackRenderStart(shapeName: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`shape-render-${shapeName}-start`);
    }
  }

  trackRenderEnd(shapeName: string) {
    if (typeof performance !== 'undefined') {
      performance.mark(`shape-render-${shapeName}-end`);
      performance.measure(
        `shape-render-${shapeName}`,
        `shape-render-${shapeName}-start`,
        `shape-render-${shapeName}-end`
      );
    }
  }

  private recordRenderingTime(shapeName: string, duration: number) {
    const existing = this.renderingMetrics.get(shapeName) || {count: 0, totalTime: 0, avgTime: 0};
    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    this.renderingMetrics.set(shapeName, existing);
  }

  private trackMemoryUsage() {
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      this.memoryUsageHistory.push({
        timestamp: Date.now(),
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize
      });

      // Keep only last 100 measurements
      if (this.memoryUsageHistory.length > 100) {
        this.memoryUsageHistory = this.memoryUsageHistory.slice(-100);
      }
    }
  }

  getDetailedMetrics() {
    const avgFrameTime = this.frameTimeHistory.length > 0
      ? this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length
      : 0;

    const currentMemory = this.memoryUsageHistory[this.memoryUsageHistory.length - 1];

    return {
      averageFrameTime: avgFrameTime,
      currentFPS: avgFrameTime > 0 ? 1000 / avgFrameTime : 0,
      memoryUsage: currentMemory ? {
        used: Math.round(currentMemory.used / 1024 / 1024),
        total: Math.round(currentMemory.total / 1024 / 1024),
        usagePercent: Math.round((currentMemory.used / currentMemory.total) * 100)
      } : null,
      topSlowShapes: Array.from(this.renderingMetrics.entries())
        .sort(([,a], [,b]) => b.avgTime - a.avgTime)
        .slice(0, 5)
        .map(([name, metrics]) => ({
          shape: name,
          avgRenderTime: Math.round(metrics.avgTime * 100) / 100,
          renderCount: metrics.count
        }))
    };
  }
}

import { enhancedPerformanceCore } from './enhancedPerformanceCore';

export const performanceAnalytics = new PerformanceAnalyticsEngine();

// Integrate enhanced performance core
enhancedPerformanceCore.integrateWithPerformanceAnalytics(performanceAnalytics);