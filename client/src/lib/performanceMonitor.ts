import { isMobileDevice, isLowPowerDevice, getDeviceProfile } from './deviceDetection';

interface PerformanceMetrics {
  shapeLoadTime: number;
  renderTime: number;
  memoryUsage: number;
  cacheHitRate: number;
  fps: number;
  frameTime: number;
}

interface DeviceInfo {
  mobile: boolean;
  cores: number;
  memory: number;
  platform: string;
}

interface OptimizedSettings {
  uSegments: number;
  vSegments: number;
  enableAnimations: boolean;
  enableParticles: boolean;
  enableTrails: boolean;
  enableBloom: boolean;
  renderQuality: 'low' | 'medium' | 'high' | 'ultra' | 'minimal';
  particleCount: number;
  throttleInterval: number;
  shadowMapSize: number;
  antialias: boolean;
  adaptiveQuality: boolean;
  memoryLimit: number;
}


class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    shapeLoadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    cacheHitRate: 0,
    fps: 60,
    frameTime: 16.67
  };

  private timers = new Map<string, number>();
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private frameCount: number = 0;
  private targetFPS: number = 60;
  private isMobile = false;
  private deviceProfile: 'mobile' | 'tablet' | 'desktop' = 'desktop';
  private deviceInfo: DeviceInfo = { mobile: false, cores: 0, memory: 0, platform: '' };
  private optimizedSettings!: OptimizedSettings;
  private lastFrameCheck: number = 0;
  private lastQualityChangeTime?: number;
  private currentQuality: number = 1.0; // Initial quality factor

  constructor() {
    if (typeof window !== 'undefined') {
      this.isMobile = isMobileDevice();
      this.deviceProfile = getDeviceProfile();
      console.log('[PerformanceMonitor] Device: mobile, Mobile:', this.isMobile, '📱⚡');

      // Attempt to gather more detailed device info
      this.deviceInfo = {
        mobile: this.isMobile,
        cores: navigator.hardwareConcurrency || 4, // Default to 4 cores if not available
        memory: (navigator as any).deviceMemory || 4, // Default to 4GB if not available
        platform: navigator.platform || 'Unknown'
      };
      console.log('[PerformanceMonitor] Device Info:', this.deviceInfo, '💻🔧');

      this.applyOptimizations();
    }
  }

  startTimer(operation: string) {
    this.timers.set(operation, performance.now());
  }

  endTimer(operation: string): number {
    const start = this.timers.get(operation);
    if (!start) return 0;

    const duration = performance.now() - start;
    this.timers.delete(operation);

    // Update metrics
    switch (operation) {
      case 'shapeLoad':
        this.metrics.shapeLoadTime = duration;
        break;
      case 'render':
        this.metrics.renderTime = duration;
        break;
    }

    return duration;
  }

  // Track FPS for adaptive quality
  trackFrame() {
    const now = performance.now();

    // Prevent memory leaks - ultra-minimal frame tracking
    if (this.frameTimes.length > 20) { // Reduced from 30
      this.frameTimes.splice(0, 10); // Remove oldest half
    }

    if (this.lastFrameTime > 0) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimes.push(frameTime);

      // Keep only last 30 frames - reduced from 60
      if (this.frameTimes.length > 30) {
        this.frameTimes.shift();
      }

      // Calculate average FPS
      const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.metrics.frameTime = avgFrameTime;
      this.metrics.fps = 1000 / avgFrameTime;

      // DISABLED: Overly aggressive quality reduction
      // Users should control quality manually via parameters
      // Auto-reduction was causing poor visual quality even on capable devices

      // Only reduce quality in extreme cases (below 10 FPS)
      if (avgFrameTime > 100) { // 10 FPS threshold - emergency only
        this.currentQuality = Math.max(0.7, this.currentQuality - 0.02);
        this.applyQualityReduction();
      }
    }
    this.lastFrameTime = now;
    this.frameCount++;
  }

  // Should skip this frame for performance?
  shouldSkipFrame(interval: number = 1): boolean {
    if (this.metrics.fps >= this.targetFPS) return false;

    // Skip frames based on performance
    if (this.metrics.fps < 30) {
      return this.frameCount % 2 !== 0; // Skip every other frame
    } else if (this.metrics.fps < 45) {
      return this.frameCount % 3 !== 0; // Skip 2 out of 3 frames
    }

    return this.frameCount % interval !== 0;
  }

  getMemoryUsage() {
    if ('memory' in performance) {
      // @ts-ignore - Chrome specific
      const memory = (performance as any).memory;
      if (memory && typeof memory.usedJSHeapSize === 'number') {
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }
    }
    // Return -1 if memory API unavailable (not 0) to distinguish from low memory
    return this.metrics.memoryUsage || -1;
  }

  hasMemoryAPI(): boolean {
    return 'memory' in performance && 
           typeof (performance as any).memory?.usedJSHeapSize === 'number';
  }

  getMetrics(): PerformanceMetrics {
    this.getMemoryUsage();
    return { ...this.metrics };
  }

  // Adaptive optimization based on device type, FPS, and memory
  getOptimizedSettings(): OptimizedSettings {
    return this.optimizedSettings;
  }

  private applyOptimizations(): void {
    const isMobile = this.deviceInfo.mobile;
    const isLowEnd = this.deviceInfo.cores <= 4 || this.deviceInfo.memory < 4;
    const isHighEnd = this.deviceInfo.cores >= 8 && this.deviceInfo.memory >= 16;

    // Base optimizations - REDUCED 15% to prevent WebGL context loss
    let optimizedSettings: OptimizedSettings = {
      uSegments: isMobile ? 48 : isLowEnd ? 64 : isHighEnd ? 96 : 80,
      vSegments: isMobile ? 24 : isLowEnd ? 32 : isHighEnd ? 48 : 40,
      enableAnimations: !isMobile,
      enableParticles: false,
      enableTrails: false,
      enableBloom: !isMobile && isHighEnd,
      renderQuality: isMobile ? 'medium' : isLowEnd ? 'medium' : 'high',
      particleCount: isMobile ? 15 : isLowEnd ? 30 : isHighEnd ? 75 : 50,
      throttleInterval: isMobile ? 4 : isHighEnd ? 2 : 3,
      shadowMapSize: isMobile ? 256 : isLowEnd ? 512 : 1024,
      antialias: !isMobile && isHighEnd,
      adaptiveQuality: false,
      memoryLimit: isMobile ? 96 : isLowEnd ? 192 : isHighEnd ? 512 : 384
    };

    // Apply Mac-specific optimizations - reduced to prevent WebGL crashes
    if (this.deviceInfo.platform === 'Mac') {
      optimizedSettings = {
        ...optimizedSettings,
        uSegments: Math.min(optimizedSettings.uSegments * 1.2, 96),
        vSegments: Math.min(optimizedSettings.vSegments * 1.2, 48),
        enableBloom: isHighEnd,
        enableTrails: false,
        renderQuality: 'high',
        shadowMapSize: 1024,
        antialias: true
      };
    }

    // Apply iOS-specific optimizations - improved minimum quality with integer clamping
    if (this.deviceInfo.platform === 'iOS' || this.deviceInfo.platform === 'iPhone') {
      optimizedSettings = {
        ...optimizedSettings,
        uSegments: Math.round(Math.max(optimizedSettings.uSegments * 0.8, 64)),
        vSegments: Math.round(Math.max(optimizedSettings.vSegments * 0.8, 32)),
        enableBloom: false,
        renderQuality: 'medium',
        shadowMapSize: 512,
        memoryLimit: 128
      };
    }

    this.optimizedSettings = optimizedSettings;

    // Start real-time performance monitoring
    this.startPerformanceMonitoring();
  }

  private startPerformanceMonitoring(): void {
    // Monitor performance every 30 seconds - reduced CPU overhead
    setInterval(() => {
      this.monitorAndAdjust();
    }, 30000);
  }

  private monitorAndAdjust(): void {
    if (typeof performance === 'undefined') return;

    const memUsage = (performance as any).memory ? 
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;

    const currentTime = performance.now();
    const frameTime = currentTime - (this.lastFrameCheck || currentTime);
    const estimatedFPS = frameTime > 0 ? 1000 / frameTime : 60;
    this.lastFrameCheck = currentTime;

    // Check if quality changes are happening too frequently (oscillation prevention)
    const now = Date.now();
    if (this.lastQualityChangeTime && now - this.lastQualityChangeTime < 3000) {
      // Skip adjustment if less than 3 seconds since last change
      return;
    }

    // DISABLED: Auto quality adjustment - users control quality manually
    // This was causing unacceptable quality degradation
    // Only reduce in emergency cases (below 5 FPS)
    if (estimatedFPS < 5) {
      this.reduceQuality();
      this.lastQualityChangeTime = now;
    }
  }

  // This method is called by trackFrame when quality needs to be reduced
  private applyQualityReduction() {
    if (!this.optimizedSettings.adaptiveQuality) return;

    const current = this.optimizedSettings;
    this.optimizedSettings = {
      ...current,
      uSegments: Math.max(current.uSegments * this.currentQuality, 16),
      vSegments: Math.max(current.vSegments * this.currentQuality, 8),
      enableBloom: false, // Bloom is often performance intensive
      enableTrails: false, // Trails can also be costly
      shadowMapSize: Math.max(current.shadowMapSize * this.currentQuality, 256)
    };

    console.log('📉 Quality reduced due to performance constraints. Current quality factor:', this.currentQuality);
    window.dispatchEvent(new CustomEvent('qualityReduced', { 
      detail: this.optimizedSettings 
    }));
  }

  // This method is called by trackFrame when quality needs to be increased
  private applyQualityIncrease() {
    if (!this.optimizedSettings.adaptiveQuality) return;

    const current = this.optimizedSettings;
    const maxSegments = this.deviceInfo.mobile ? 64 : 128; // Max segments based on device

    this.optimizedSettings = {
      ...current,
      uSegments: Math.min(current.uSegments / this.currentQuality, maxSegments), // Reverse quality factor
      vSegments: Math.min(current.vSegments / this.currentQuality, maxSegments / 2), // Reverse quality factor
      enableBloom: !this.deviceInfo.mobile, // Enable bloom on non-mobile if possible
      enableTrails: this.deviceInfo.cores >= 8, // Enable trails on high-end devices
      shadowMapSize: Math.min(current.shadowMapSize / this.currentQuality, 2048) // Reverse quality factor
    };

    console.log('📈 Quality increased due to good performance. Current quality factor:', this.currentQuality);
    window.dispatchEvent(new CustomEvent('qualityIncreased', { 
      detail: this.optimizedSettings 
    }));
  }

  // These methods are now simplified as the core logic is in trackFrame
  private reduceQuality(): void {
    // The actual reduction logic is in trackFrame's call to applyQualityReduction
    // This method might be called by monitorAndAdjust for more direct control if needed
    this.applyQualityReduction();
  }

  private increaseQuality(): void {
    // The actual increase logic is in trackFrame's call to applyQualityIncrease
    // This method might be called by monitorAndAdjust for more direct control if needed
    this.applyQualityIncrease();
  }

  isMobileDevice(): boolean {
    return this.isMobile;
  }

  getDeviceProfile(): 'mobile' | 'tablet' | 'desktop' {
    return this.deviceProfile;
  }
}

export const performanceMonitor = new PerformanceMonitor();