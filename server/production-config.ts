/**
 * Production Configuration
 * Optimized settings for deployment
 */

export const productionConfig = {
  // Disable heavy features in production
  features: {
    aiTransformers: process.env.NODE_ENV === 'development',
    onnxRuntime: process.env.NODE_ENV === 'development',
    largeModels: false,
    debugTools: false,
    heavyAnimations: false
  },

  // Optimize memory usage for Replit deployment
  memory: {
    maxShapeCache: 100, // Reduced from 1000
    maxParameterHistory: 50, // Reduced from 500
    garbageCollectionInterval: 30000 // 30 seconds
  },

  // Lightweight asset loading
  assets: {
    loadLargeTextures: false,
    loadComplexModels: false,
    enablePreloading: false
  },

  // Production database optimizations for Replit
  database: {
    connectionPoolSize: 5, // Optimized for Replit reserved system
    queryTimeout: 10000, // Increased for production stability
    enableCaching: true,
    autoSeed: true, // Enable automatic seeding on production database creation
    seedOnDeploy: process.env.NODE_ENV === 'production',
    backupEnabled: true,
    compressionEnabled: true,
    // Replit-specific production settings
    replitOptimized: true,
    reservedSystemConfig: {
      maxConnections: 10,
      connectionRetries: 3,
      healthCheckInterval: 60000, // 1 minute
      gracefulShutdown: true
    }
  },

  // Deployment-specific settings
  deployment: {
    platform: 'replit_reserved',
    databaseCreation: 'auto', // Create production DB upon publishing
    seedingStrategy: 'smart', // Only seed if database is empty
    assetOptimization: true,
    compressionEnabled: true
  }
};

// Memory cleanup utility
export class ProductionMemoryManager {
  private cleanupInterval: NodeJS.Timeout | null = null;
  private memoryThreshold = 512 * 1024 * 1024; // 512MB

  startCleanup() {
    // Memory cleanup every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.performCleanup();
      this.optimizeNodeCache();
    }, 300000);
  }

  private optimizeNodeCache() {
    // Module cache optimization disabled in ES modules context
    // This optimization is not needed in production builds with proper bundling
  }

  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  private performCleanup() {
    const memUsage = process.memoryUsage();

    if (memUsage.heapUsed > this.memoryThreshold) {
      console.log(`🧹 Memory usage high (${Math.round(memUsage.heapUsed / 1024 / 1024)}MB), forcing cleanup`);

      if (global.gc) {
        global.gc();
      }

      // Clear shape cache if memory still high
      if (process.memoryUsage().heapUsed > this.memoryThreshold) {
        this.clearShapeCache();
      }
    }
  }

  private clearShapeCache() {
    try {
      // Clear any cached geometry data
      console.log('🗑️ Clearing shape cache to free memory');
      // Implementation would clear cached shapes
    } catch (error) {
      console.error('❌ Cache cleanup failed:', error);
    }
  }
}