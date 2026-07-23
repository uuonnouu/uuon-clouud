
export class PermanentStabilityManager {
  private static instance: PermanentStabilityManager;
  private isInitialized: boolean = false;
  private activeProcesses: Set<string> = new Set();

  static getInstance(): PermanentStabilityManager {
    if (!PermanentStabilityManager.instance) {
      PermanentStabilityManager.instance = new PermanentStabilityManager();
    }
    return PermanentStabilityManager.instance;
  }

  async initializeStabilityLayer(): Promise<void> {
    if (this.isInitialized) {
      console.log('🛡️ Stability layer already active');
      return;
    }

    console.log('🛡️ Initializing permanent stability layer...');

    // Disable conflicting monitoring systems
    this.disableConflictingProcesses();
    
    // Set up minimal monitoring
    this.setupMinimalMonitoring();

    this.isInitialized = true;
    console.log('✅ Permanent stability layer active');
  }

  private disableConflictingProcesses(): void {
    // Prevent multiple port cleanup attempts
    const conflictingProcesses = [
      'port-cleanup',
      'system-restart',
      'resource-monitor',
      'process-cleanup'
    ];

    conflictingProcesses.forEach(process => {
      if (this.activeProcesses.has(process)) {
        console.log(`🛑 Disabling conflicting process: ${process}`);
        this.activeProcesses.delete(process);
      }
    });
  }

  private setupMinimalMonitoring(): void {
    // Ultra-lightweight health check every 5 minutes
    setInterval(() => {
      if (process.memoryUsage().heapUsed > 500 * 1024 * 1024) { // 500MB limit
        if (global.gc) {
          global.gc();
          console.log('🧹 Memory cleanup performed');
        }
      }
    }, 300000);
  }

  preventRestartLoop(operation: string): boolean {
    if (this.activeProcesses.has(operation)) {
      console.log(`🚫 Prevented duplicate operation: ${operation}`);
      return false;
    }
    
    this.activeProcesses.add(operation);
    setTimeout(() => this.activeProcesses.delete(operation), 30000);
    return true;
  }
}

export const permanentStabilityManager = PermanentStabilityManager.getInstance();
