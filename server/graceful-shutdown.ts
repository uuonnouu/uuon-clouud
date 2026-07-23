
import { startupOptimizer } from './startup-optimizer';

class GracefulShutdown {
  private shutdownHandlers: Array<() => Promise<void>> = [];

  addShutdownHandler(handler: () => Promise<void>) {
    this.shutdownHandlers.push(handler);
  }

  async performShutdown() {
    console.log('🛑 Performing graceful shutdown...');
    
    // Stop monitoring systems first
    await startupOptimizer.shutdown();
    
    // Run custom shutdown handlers
    for (const handler of this.shutdownHandlers) {
      try {
        await handler();
      } catch (error) {
        console.warn('⚠️ Shutdown handler failed:', error);
      }
    }
    
    console.log('✅ Graceful shutdown complete');
  }

  setup() {
    process.on('SIGTERM', async () => {
      await this.performShutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await this.performShutdown();
      process.exit(0);
    });
  }
}

export const gracefulShutdown = new GracefulShutdown();
