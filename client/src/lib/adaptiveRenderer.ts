/**
 * ADAPTIVE RENDERING SYSTEM
 * Dynamically adjusts rendering quality based on performance metrics
 */

export interface RenderingSettings {
  uSegments: number;
  vSegments: number;
  enableShadows: boolean;
  enableBloom: boolean;
  enableAO: boolean;
  shadowMapSize: number;
  antialias: boolean;
  pixelRatio: number;
  memoryBudget: number; // MB
  targetFPS: number;
}

export class AdaptiveRenderer {
  private currentSettings: RenderingSettings;
  private performanceHistory: number[] = [];
  private memoryHistory: number[] = [];
  private frameTimeHistory: number[] = [];
  private isOptimizing = false;

  constructor() {
    this.currentSettings = this.getDefaultSettings();
    this.startMonitoring();
  }

  private getDefaultSettings(): RenderingSettings {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    return {
      uSegments: isMobile ? 64 : 128,
      vSegments: isMobile ? 32 : 64,
      enableShadows: !isMobile,
      enableBloom: false,
      enableAO: !isMobile,
      shadowMapSize: isMobile ? 512 : 1024,
      antialias: !isMobile,
      pixelRatio,
      memoryBudget: isMobile ? 128 : 512,
      targetFPS: isMobile ? 30 : 60
    };
  }

  private startMonitoring(): void {
    setInterval(() => {
      this.collectPerformanceMetrics();
      this.analyzeAndOptimize();
    }, 2000);
  }

  private collectPerformanceMetrics(): void {
    // Collect frame time
    const now = performance.now();
    if (this.lastFrameTime) {
      const frameTime = now - this.lastFrameTime;
      this.frameTimeHistory.push(frameTime);
      if (this.frameTimeHistory.length > 30) {
        this.frameTimeHistory.shift();
      }
    }
    this.lastFrameTime = now;

    // Collect memory usage
    if ('memory' in performance) {
      const memUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024;
      this.memoryHistory.push(memUsage);
      if (this.memoryHistory.length > 10) {
        this.memoryHistory.shift();
      }
    }

    // Calculate performance score
    const avgFrameTime = this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length;
    const currentFPS = avgFrameTime > 0 ? 1000 / avgFrameTime : 60;
    this.performanceHistory.push(currentFPS);
    
    if (this.performanceHistory.length > 20) {
      this.performanceHistory.shift();
    }
  }

  private lastFrameTime: number = 0;

  private analyzeAndOptimize(): void {
    if (this.isOptimizing || this.performanceHistory.length < 5) return;

    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    const avgMemory = this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length;

    const fpsRatio = avgFPS / this.currentSettings.targetFPS;
    const memoryRatio = avgMemory / this.currentSettings.memoryBudget;

    // DISABLED: Auto quality adjustment - poor user experience
    // Users should control quality via manual parameters
    // Only reduce in absolute emergency (FPS < 5)
    if (fpsRatio < 0.08) {  // Less than 5 FPS
      this.reduceQuality();
    }
  }

  private reduceQuality(): void {
    this.isOptimizing = true;
    
    const settings = { ...this.currentSettings };
    
    // Reduce segments first
    if (settings.uSegments > 16) {
      settings.uSegments = Math.floor(settings.uSegments * 0.8);
      settings.vSegments = Math.floor(settings.vSegments * 0.8);
    }
    
    // Disable expensive effects
    if (settings.enableBloom) {
      settings.enableBloom = false;
    } else if (settings.enableAO) {
      settings.enableAO = false;
    } else if (settings.enableShadows) {
      settings.enableShadows = false;
    } else if (settings.shadowMapSize > 256) {
      settings.shadowMapSize = Math.floor(settings.shadowMapSize * 0.5);
    }

    this.currentSettings = settings;
    this.notifySettingsChange();
    
    console.log('📉 Quality reduced:', settings);
    
    setTimeout(() => {
      this.isOptimizing = false;
    }, 3000);
  }

  private increaseQuality(): void {
    this.isOptimizing = true;
    
    const settings = { ...this.currentSettings };
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Increase quality gradually
    if (!settings.enableShadows && !isMobile) {
      settings.enableShadows = true;
    } else if (settings.shadowMapSize < 1024 && !isMobile) {
      settings.shadowMapSize = Math.min(settings.shadowMapSize * 2, 1024);
    } else if (!settings.enableAO && !isMobile) {
      settings.enableAO = true;
    } else if (!settings.enableBloom && !isMobile) {
      settings.enableBloom = true;
    } else if (settings.uSegments < (isMobile ? 64 : 128)) {
      settings.uSegments = Math.floor(settings.uSegments * 1.2);
      settings.vSegments = Math.floor(settings.vSegments * 1.2);
    }

    this.currentSettings = settings;
    this.notifySettingsChange();
    
    console.log('📈 Quality increased:', settings);
    
    setTimeout(() => {
      this.isOptimizing = false;
    }, 3000);
  }

  private notifySettingsChange(): void {
    window.dispatchEvent(new CustomEvent('adaptiveRenderingUpdate', {
      detail: this.currentSettings
    }));
  }

  public getCurrentSettings(): RenderingSettings {
    return { ...this.currentSettings };
  }

  public forceQualityLevel(level: 'low' | 'medium' | 'high' | 'ultra'): void {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let settings: Partial<RenderingSettings>;
    
    switch (level) {
      case 'low':
        settings = {
          uSegments: 24,
          vSegments: 12,
          enableShadows: false,
          enableBloom: false,
          enableAO: false,
          shadowMapSize: 256,
          antialias: false
        };
        break;
      case 'medium':
        settings = {
          uSegments: isMobile ? 32 : 48,
          vSegments: isMobile ? 16 : 24,
          enableShadows: !isMobile,
          enableBloom: false,
          enableAO: false,
          shadowMapSize: 512,
          antialias: !isMobile
        };
        break;
      case 'high':
        settings = {
          uSegments: isMobile ? 48 : 64,
          vSegments: isMobile ? 24 : 32,
          enableShadows: true,
          enableBloom: !isMobile,
          enableAO: !isMobile,
          shadowMapSize: isMobile ? 512 : 1024,
          antialias: true
        };
        break;
      case 'ultra':
        settings = {
          uSegments: isMobile ? 64 : 128,
          vSegments: isMobile ? 32 : 64,
          enableShadows: true,
          enableBloom: true,
          enableAO: true,
          shadowMapSize: isMobile ? 1024 : 2048,
          antialias: true
        };
        break;
    }

    this.currentSettings = { ...this.currentSettings, ...settings };
    this.notifySettingsChange();
    console.log(`🎯 Quality forced to ${level}:`, this.currentSettings);
  }

  public getPerformanceReport(): string {
    const avgFPS = this.performanceHistory.reduce((a, b) => a + b, 0) / this.performanceHistory.length;
    const avgMemory = this.memoryHistory.reduce((a, b) => a + b, 0) / this.memoryHistory.length;
    
    return `
📊 Adaptive Rendering Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 Current FPS: ${avgFPS.toFixed(1)}
💾 Memory Usage: ${avgMemory.toFixed(1)} MB
🔧 Segments: ${this.currentSettings.uSegments}×${this.currentSettings.vSegments}
✨ Effects: Shadows=${this.currentSettings.enableShadows}, Bloom=${this.currentSettings.enableBloom}, AO=${this.currentSettings.enableAO}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
  }
}

// Global singleton guard — prevents duplicate instance when module lands in multiple chunks
const _arKey = Symbol.for('dmension_adaptiveRenderer');
if (!(globalThis as any)[_arKey]) (globalThis as any)[_arKey] = new AdaptiveRenderer();
export const adaptiveRenderer: AdaptiveRenderer = (globalThis as any)[_arKey];
