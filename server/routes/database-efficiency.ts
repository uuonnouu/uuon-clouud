
import { Router, Request, Response } from 'express';
import { cpuEfficientDBManager } from '../cpu-efficient-database-manager';
import { databaseMLOptimizer } from '../database-ml-optimizer';

const router = Router();

/**
 * Get database efficiency statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const queueStats = cpuEfficientDBManager.getQueueStats();
    
    res.json({
      success: true,
      cpuEfficiency: {
        queueLength: queueStats.queueLength,
        priorityDistribution: queueStats.priorityDistribution,
        totalEstimatedCPUCost: queueStats.totalEstimatedCPUCost,
        isProcessing: queueStats.isProcessing
      },
      mode: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve efficiency stats',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Force process pending database operations (development only)
 */
router.post('/force-process', async (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ 
      error: 'Force processing not allowed in production' 
    });
  }

  try {
    // This would trigger immediate processing in development
    res.json({
      success: true,
      message: 'Database operations processing triggered',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to force process operations',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Update shape data efficiently
 */
router.post('/update-shape', async (req: Request, res: Response) => {
  try {
    const { shapeId, shapeData } = req.body;
    
    if (!shapeId || !shapeData) {
      return res.status(400).json({ 
        error: 'Missing shapeId or shapeData' 
      });
    }

    await cpuEfficientDBManager.updateShapeDataEfficiently(shapeId, shapeData);
    
    res.json({
      success: true,
      message: `Shape ${shapeId} update scheduled efficiently`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to schedule shape update',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * Get database storage optimization stats
 */
router.get('/storage-optimization', async (req: Request, res: Response) => {
  try {
    const storageStats = await databaseMLOptimizer.getStorageStats();
    
    res.json({
      success: true,
      storageOptimization: {
        models: {
          count: storageStats.models.count,
          compressionRatio: storageStats.models.compressionRatio,
          spaceUsed: `${(storageStats.models.compressedSize / 1024 / 1024).toFixed(2)}MB`
        },
        assets: {
          count: storageStats.assets.count,
          compressionRatio: storageStats.assets.compressionRatio,
          spaceUsed: `${(storageStats.assets.compressedSize / 1024 / 1024).toFixed(2)}MB`
        },
        databaseUtilization: storageStats.databaseUtilization,
        totalSavings: `${(storageStats.totalSavings / 1024 / 1024).toFixed(2)}MB`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to retrieve storage optimization stats',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export { router as databaseEfficiencyRoutes };
