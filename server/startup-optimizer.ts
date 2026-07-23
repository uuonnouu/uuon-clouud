
export class StartupOptimizer {
  private deferredServices: Array<() => Promise<void>> = [];
  private criticalServices: Array<() => Promise<void>> = [];

  // Add critical services that must start immediately
  addCriticalService(service: () => Promise<void>) {
    this.criticalServices.push(service);
  }

  // Add services that can be deferred after main server is ready
  addDeferredService(service: () => Promise<void>) {
    this.deferredServices.push(service);
  }

  async startCriticalServices() {
    console.log('🚀 Starting critical services...');
    for (const service of this.criticalServices) {
      try {
        await service();
      } catch (error) {
        console.warn('⚠️ Critical service failed:', error);
      }
    }
  }

  async startDeferredServices() {
    console.log('⏳ Starting deferred services...');
    // Start deferred services in parallel with delays to prevent resource contention
    const servicePromises = this.deferredServices.map((service, index) => 
      new Promise(resolve => 
        setTimeout(async () => {
          try {
            await service();
            resolve(true);
          } catch (error) {
            console.warn(`⚠️ Deferred service ${index} failed:`, error);
            resolve(false);
          }
        }, index * 500) // Reduced stagger to 500ms
      )
    );

    await Promise.all(servicePromises);
    console.log('✅ All deferred services attempted');
  }

  // Clean shutdown of all services
  async shutdown() {
    console.log('🛑 Shutting down startup optimizer...');
    

    // Stop system perfection coordinator
    try {
      const { systemPerfectionCoordinator } = await import('./system-perfection-coordinator');
      systemPerfectionCoordinator.stopContinuousMonitoring?.();
    } catch {}

    // Stop system sync monitor
    try {
      const { systemSyncMonitor } = await import('./system-sync-monitor');
      systemSyncMonitor.stopMonitoring?.();
    } catch {}
  }
}

export const startupOptimizer = new StartupOptimizer();
