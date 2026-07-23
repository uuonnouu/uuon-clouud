/**
 * FRONTEND SYNCHRONIZATION SYSTEM
 * Ensures all changes are immediately visible on the frontend
 * Handles WebGL context issues, HMR conflicts, and state propagation
 */

export class FrontendSynchronization {
  private static instance: FrontendSynchronization;
  private updateCallbacks = new Set<() => void>();
  private lastUpdateTime = 0;
  private forcedUpdateCount = 0;
  private contextLossCount = 0;
  private lastContextLossTime = 0;
  private syncInterval: NodeJS.Timeout | null = null; // Added to manage the interval

  static getInstance(): FrontendSynchronization {
    if (!FrontendSynchronization.instance) {
      FrontendSynchronization.instance = new FrontendSynchronization();
    }
    return FrontendSynchronization.instance;
  }

  private constructor() {
    this.setupGlobalListeners();
    this.setupDevModeHelpers();
    this.startSyncInterval(); // Start the interval when an instance is created
  }

  private setupGlobalListeners(): void {
    // Listen for parameter changes
    window.addEventListener('parameterChange', this.handleParameterChange.bind(this) as EventListener);

    // Listen for WebGL context issues
    window.addEventListener('webglcontextlost', this.handleContextLoss.bind(this));

    // Listen for forced updates
    window.addEventListener('forceUpdate', this.handleForceUpdate.bind(this) as EventListener);

    // Listen for visibility changes (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.forceUpdate('Visibility restored');
      }
    });
  }

  private setupDevModeHelpers(): void {
    // Add global functions for manual debugging
    (window as any).forceRefresh = () => {
      this.forceUpdate('Manual refresh');
    };

    (window as any).debugFrontendSync = () => {
      console.log('🔍 Frontend Sync Status:', {
        updateCallbacks: this.updateCallbacks.size,
        lastUpdateTime: new Date(this.lastUpdateTime).toLocaleTimeString(),
        forcedUpdateCount: this.forcedUpdateCount,
        webglContext: !!(window as any).threeRenderer,
        scene: !!(window as any).threeScene
      });
    };

    // Hot key for force refresh (Ctrl+Shift+R)
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        this.forceUpdate('Hotkey triggered');
      }
    });
  }

  private handleParameterChange(event: CustomEvent): void {
    const now = Date.now();
    
    // Prevent rapid-fire updates (debounce to 500ms)
    if (now - this.lastUpdateTime < 500) {
      return;
    }
    
    this.lastUpdateTime = now;
    this.notifyComponents();
  }

  private handleContextLoss(): void {
    const now = Date.now();

    // Prevent context loss loop - if we're getting multiple losses in short time, back off
    if (now - this.lastContextLossTime < 3000) {
      this.contextLossCount++;

      // If we've lost context 3+ times in 3 seconds, we're in a loop - stop trying
      if (this.contextLossCount >= 3) {
        console.error('🚨 WebGL context loss loop detected - stopping recovery attempts');
        return;
      }
    } else {
      // Reset counter if it's been more than 3 seconds
      this.contextLossCount = 1;
    }

    this.lastContextLossTime = now;
    console.warn(`⚠️ Frontend sync handling WebGL context loss (${this.contextLossCount}/3)`);

    // Only force update if not in a loop
    this.forceUpdate('WebGL context loss');
  }

  private handleForceUpdate(): void {
    console.log('🔄 Frontend sync handling forced update');
    this.forceUpdate('Forced update');
  }

  public forceUpdate(reason: string = 'Unknown'): void {
    const now = Date.now();

    // Prevent too frequent updates (debounce to 1000ms for better stability)
    if (now - this.lastUpdateTime < 1000) {
      return;
    }

    this.lastUpdateTime = now;
    this.forcedUpdateCount++;

    // Force re-render of all registered components
    this.notifyComponents();

    // Only refresh WebGL for critical reasons, but NOT for context loss
    // (context restoration is handled by the browser automatically)
    if (reason.includes('Hotkey') || reason.includes('Visibility')) {
      this.refreshWebGL();
    }

    // Dispatch global update event
    window.dispatchEvent(new CustomEvent('frontendSyncUpdate', {
      detail: { reason, timestamp: now, count: this.forcedUpdateCount }
    }));
  }

  private notifyComponents(): void {
    this.updateCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('❌ Error in update callback:', error);
      }
    });
  }

  private refreshWebGL(): void {
    const renderer = (window as any).threeRenderer;
    const scene = (window as any).threeScene;

    if (renderer && scene) {
      try {
        // Force renderer update
        renderer.clear();
        renderer.render(scene, (window as any).threeCamera);
        console.log('✅ WebGL forced refresh successful');
      } catch (error) {
        console.error('❌ WebGL refresh failed:', error);
      }
    }
  }

  public registerUpdateCallback(callback: () => void): () => void {
    this.updateCallbacks.add(callback);

    // Return unregister function
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  public getStats() {
    return {
      updateCallbacks: this.updateCallbacks.size,
      lastUpdateTime: this.lastUpdateTime,
      forcedUpdateCount: this.forcedUpdateCount
    };
  }

  // New method to start the synchronization interval
  private startSyncInterval(): void {
    // Disable automatic sync interval to prevent loops
    // Components will update through event-driven mechanisms only
    console.log('🔄 Sync interval disabled to prevent update loops');
  }

  // Placeholder for the actual synchronization logic
  private performSync(): void {
    // In a real scenario, this would perform background synchronization tasks.
    // For this example, we'll just log that it's running.
    console.log('Performing background synchronization...');
    // Example: Fetching data, updating state, etc.
    // this.notifyComponents(); // Could potentially trigger component updates
  }

  // Method to stop the interval, useful for cleanup if needed
  public stopSyncInterval(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Method to check system health
  private async checkSystemHealth(): Promise<{ healthy: boolean; issues: string[] }> {
    const issues: string[] = [];

    // Check critical systems with proper endpoints
    const healthChecks = [
      { name: 'aiSystem', endpoint: '/api/uuon-ai/health' },
      { name: 'latticeSystem', endpoint: '/api/uuon-lattice/health' }
    ];

    for (const { name, endpoint } of healthChecks) {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          const errorData = await response.json();
          issues.push(`${name}: ${errorData.error || 'Health check failed'}`);
        }
      } catch (error) {
        issues.push(`${name}: ${error instanceof Error ? error.message : 'Connection failed'}`);
      }
    }

    const healthy = issues.length === 0;
    if (!healthy) {
      console.warn('⚠️ System health issues:', issues);
    } else {
      console.log('✅ All systems healthy.');
    }
    return { healthy, issues };
  }
}

// Global instance
export const frontendSync = FrontendSynchronization.getInstance();

// Expose for debugging
(window as any).frontendSync = frontendSync;