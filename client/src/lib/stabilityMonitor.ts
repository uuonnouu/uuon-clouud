
/**
 * STABILITY MONITOR
 * Prevents crashes and glitches by monitoring system health
 */

export class StabilityMonitor {
  private static instance: StabilityMonitor;
  private errorCount = 0;
  private lastErrorTime = 0;
  private maxErrors = 5;
  private errorWindow = 10000; // 10 seconds
  private stabilityMode = false;

  static getInstance(): StabilityMonitor {
    if (!StabilityMonitor.instance) {
      StabilityMonitor.instance = new StabilityMonitor();
    }
    return StabilityMonitor.instance;
  }

  private constructor() {
    this.setupErrorHandling();
    this.monitorPerformance();
  }

  private setupErrorHandling(): void {
    // Catch unhandled errors
    window.addEventListener('error', (event) => {
      this.handleError('JavaScript Error', event.error);
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError('Promise Rejection', event.reason);
      event.preventDefault(); // Prevent console spam
    });

    // Monitor WebGL context issues
    window.addEventListener('webglcontextlost', () => {
      this.handleError('WebGL Context Lost', new Error('WebGL context lost'));
    });
  }

  private handleError(type: string, error: any): void {
    const now = Date.now();
    
    // Reset counter if enough time has passed
    if (now - this.lastErrorTime > this.errorWindow) {
      this.errorCount = 0;
    }
    
    this.errorCount++;
    this.lastErrorTime = now;
    
    console.warn(`🚨 Stability Monitor: ${type} (${this.errorCount}/${this.maxErrors})`);
    
    // Enter stability mode if too many errors
    if (this.errorCount >= this.maxErrors && !this.stabilityMode) {
      this.enterStabilityMode();
    }
  }

  private enterStabilityMode(): void {
    console.warn('🛡️ Entering stability mode - reducing system load');
    this.stabilityMode = true;
    
    // Reduce system activity
    window.dispatchEvent(new CustomEvent('enterStabilityMode'));
    
    // Exit stability mode after 30 seconds
    setTimeout(() => {
      this.exitStabilityMode();
    }, 30000);
  }

  private exitStabilityMode(): void {
    console.log('✅ Exiting stability mode - normal operation resumed');
    this.stabilityMode = false;
    this.errorCount = 0;
    
    window.dispatchEvent(new CustomEvent('exitStabilityMode'));
  }

  private monitorPerformance(): void {
    setInterval(() => {
      if (this.stabilityMode) return;
      
      try {
        // Check memory usage
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          const usedMB = memory.usedJSHeapSize / (1024 * 1024);
          
          if (usedMB > 1500) { // 1.5GB threshold
            console.warn('⚠️ High memory usage detected - entering stability mode');
            this.enterStabilityMode();
          }
        }
      } catch (error) {
        // Ignore monitoring errors
      }
    }, 30000); // Check every 30 seconds
  }

  public isStable(): boolean {
    return !this.stabilityMode && this.errorCount < 3;
  }

  public reset(): void {
    this.errorCount = 0;
    this.stabilityMode = false;
    console.log('🔄 Stability monitor reset');
  }
}

export const stabilityMonitor = StabilityMonitor.getInstance();
