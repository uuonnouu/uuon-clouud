
// Emergency performance optimizer for mobile devices
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private isMobile = false;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceOptimizer();
    }
    return this.instance;
  }
  
  constructor() {
    this.detectDevice();
    this.applyOptimizations();
  }
  
  private detectDevice() {
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
  }
  
  private applyOptimizations() {
    if (this.isMobile) {
      // Disable heavy features on mobile
      this.disableExpensiveEffects();
      this.reduceShapeComplexity();
      this.optimizeRenderSettings();
    }
  }
  
  private disableExpensiveEffects() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    // Turn off bloom, particles, trails
    const effectsToDisable = ['enableBloom', 'enableParticles', 'enableTrails'];
    effectsToDisable.forEach(effect => {
      localStorage.setItem(effect, 'false');
    });
  }
  
  private reduceShapeComplexity() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    // Lower tessellation on mobile - reduced to prevent WebGL crashes
    localStorage.setItem('uSegments', '64');
    localStorage.setItem('vSegments', '32');
    localStorage.setItem('renderQuality', 'medium');
  }
  
  private optimizeRenderSettings() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    // Reduce shadow quality, disable antialiasing
    localStorage.setItem('shadowMapSize', '128');
    localStorage.setItem('antialias', 'false');
    localStorage.setItem('memoryLimit', '64');
  }
  
  getOptimizedSettings() {
    return {
      uSegments: this.isMobile ? 48 : 80,
      vSegments: this.isMobile ? 24 : 40,
      enableBloom: false,
      enableParticles: false,
      renderQuality: this.isMobile ? 'medium' : 'high',
      maxShapes: this.isMobile ? 8 : 20
    };
  }
}

// Initialize immediately
export const performanceOptimizer = PerformanceOptimizer.getInstance();
