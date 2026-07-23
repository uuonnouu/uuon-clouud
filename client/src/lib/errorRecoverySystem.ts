
/**
 * Enhanced Error Recovery System
 * Provides automatic fallbacks and self-healing capabilities
 */

export class ErrorRecoverySystem {
  private static instance: ErrorRecoverySystem;
  private recoveryStrategies = new Map<string, () => Promise<void>>();
  private errorHistory: Array<{error: string, timestamp: number, recovered: boolean}> = [];

  static getInstance(): ErrorRecoverySystem {
    if (!ErrorRecoverySystem.instance) {
      ErrorRecoverySystem.instance = new ErrorRecoverySystem();
    }
    return ErrorRecoverySystem.instance;
  }

  registerRecoveryStrategy(errorType: string, strategy: () => Promise<void>) {
    this.recoveryStrategies.set(errorType, strategy);
  }

  async handleError(error: Error, context: string): Promise<boolean> {
    console.log(`🔧 Error Recovery: ${error.message} in ${context}`);
    
    this.errorHistory.push({
      error: error.message,
      timestamp: Date.now(),
      recovered: false
    });

    // Try specific recovery strategy
    const strategy = this.recoveryStrategies.get(error.constructor.name);
    if (strategy) {
      try {
        await strategy();
        this.markRecovered(error.message);
        console.log(`✅ Recovery successful for: ${error.message}`);
        return true;
      } catch (recoveryError) {
        console.warn(`❌ Recovery failed:`, recoveryError);
      }
    }

    // Fallback recovery strategies
    return await this.attemptGenericRecovery(error, context);
  }

  private async attemptGenericRecovery(error: Error, context: string): Promise<boolean> {
    const strategies = [
      () => this.clearCacheRecovery(),
      () => this.resetParametersRecovery(),
      () => this.fallbackRenderingRecovery(),
      () => this.memoryCleanupRecovery(),
      () => this.networkRetryRecovery(context),
      () => this.safeModeRecovery()
    ];

    for (const strategy of strategies) {
      try {
        await strategy();
        this.markRecovered(error.message);
        console.log(`✅ Generic recovery successful for: ${error.message}`);
        return true;
      } catch (strategyError) {
        console.warn(`⚠️ Recovery strategy failed, trying next:`, strategyError);
        continue;
      }
    }

    // Final fallback - attempt system reset
    try {
      await this.systemResetRecovery();
      this.markRecovered(error.message);
      console.log(`✅ System reset recovery successful for: ${error.message}`);
      return true;
    } catch (resetError) {
      console.error(`❌ All recovery strategies including system reset failed for: ${error.message}`);
      return false;
    }
  }

  private async memoryCleanupRecovery() {
    // Force garbage collection if available
    if (typeof window !== 'undefined' && (window as any).gc) {
      (window as any).gc();
    }
    
    // Clear large objects from memory
    if (typeof window !== 'undefined') {
      // Clear any large cached data
      const cacheKeys = Object.keys(localStorage).filter(key => 
        key.includes('cache') || key.includes('geometry') || key.includes('texture')
      );
      cacheKeys.forEach(key => localStorage.removeItem(key));
    }
  }

  private async networkRetryRecovery(context: string) {
    if (context.includes('network') || context.includes('fetch')) {
      // Wait for potential network recovery
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dispatch network retry event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('networkRecoveryAttempt'));
      }
    }
  }

  private async safeModeRecovery() {
    // Enable safe mode rendering
    if (typeof window !== 'undefined') {
      localStorage.setItem('safeMode', 'true');
      window.dispatchEvent(new CustomEvent('enableSafeMode'));
    }
  }

  private async systemResetRecovery() {
    // Reset all systems to default state
    if (typeof window !== 'undefined') {
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new CustomEvent('systemReset'));
    }
  }

  private async clearCacheRecovery() {
    // Clear various caches
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shapeCache');
      sessionStorage.removeItem('parameterCache');
    }
  }

  private async resetParametersRecovery() {
    // Reset to safe default parameters
    const event = new CustomEvent('resetToDefaults');
    window.dispatchEvent(event);
  }

  private async fallbackRenderingRecovery() {
    // Switch to basic rendering mode
    const event = new CustomEvent('enableFallbackMode');
    window.dispatchEvent(event);
  }

  private markRecovered(errorMessage: string) {
    const errorEntry = this.errorHistory
      .reverse()
      .find(e => e.error === errorMessage);
    if (errorEntry) {
      errorEntry.recovered = true;
    }
  }

  getRecoveryStats() {
    const total = this.errorHistory.length;
    const recovered = this.errorHistory.filter(e => e.recovered).length;
    return {
      totalErrors: total,
      recoveredErrors: recovered,
      recoveryRate: total > 0 ? (recovered / total) * 100 : 100
    };
  }
}

export const errorRecovery = ErrorRecoverySystem.getInstance();
