
import { Router } from 'express';
import { databaseDeploymentOptimizer } from '../database-deployment-optimizer';
import { databaseMLOptimizer } from '../database-ml-optimizer';

const router = Router();

// Start deployment optimization
router.post('/optimize-deployment', async (req, res) => {
  try {
    console.log('🚀 Starting deployment optimization process...');
    
    await databaseDeploymentOptimizer.optimizeForDeployment();
    
    res.json({
      success: true,
      message: 'Deployment optimization completed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Deployment optimization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get optimization savings estimate
router.get('/savings-estimate', async (req, res) => {
  try {
    const estimate = await databaseDeploymentOptimizer.estimateDeploymentSavings();
    
    res.json({
      success: true,
      estimate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get savings estimate',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current database storage usage
router.get('/storage-usage', async (req, res) => {
  try {
    const stats = await databaseMLOptimizer.getStorageStats();
    
    res.json({
      success: true,
      usage: {
        models: {
          count: stats.models.count,
          storageUsed: `${(stats.models.compressedSize / 1024 / 1024).toFixed(2)}MB`,
          compressionRatio: `${stats.models.compressionRatio.toFixed(2)}x`
        },
        assets: {
          count: stats.assets.count,
          storageUsed: `${(stats.assets.compressedSize / 1024 / 1024).toFixed(2)}MB`,
          compressionRatio: `${stats.assets.compressionRatio.toFixed(2)}x`
        },
        embeddings: {
          count: stats.embeddings.count,
          storageUsed: `${(stats.embeddings.totalSize / 1024 / 1024).toFixed(2)}MB`
        },
        totalSavings: `${(stats.totalSavings / 1024 / 1024).toFixed(2)}MB`
      },
      recommendations: [
        stats.models.count === 0 ? 'Consider migrating ML models to database storage' : null,
        stats.assets.count < 10 ? 'Move large static assets to database storage' : null,
        stats.totalSavings < 100 * 1024 * 1024 ? 'More assets can be optimized for deployment' : null
      ].filter(Boolean),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get storage usage',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cleanup unused database assets
router.post('/cleanup-unused', async (req, res) => {
  try {
    await databaseMLOptimizer.cleanupOldData();
    
    const newStats = await databaseMLOptimizer.getStorageStats();
    
    res.json({
      success: true,
      message: 'Cleanup completed',
      newStats: {
        models: newStats.models.count,
        assets: newStats.assets.count,
        embeddings: newStats.embeddings.count,
        totalStorage: `${((newStats.models.compressedSize + newStats.assets.compressedSize) / 1024 / 1024).toFixed(2)}MB`
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as deploymentOptimizationRoutes };
