
/**
 * RAM OPTIMIZATION API ROUTES
 * Provides memory optimization data without affecting frontend
 */

import { Router } from 'express';
import { ramOptimizer } from '../ram-optimization-engine';

const router = Router();

// Get current memory metrics
router.get('/metrics', async (req, res) => {
  try {
    const metrics = ramOptimizer.getCurrentMetrics();
    const pattern = ramOptimizer.getCurrentPattern();
    const strategy = ramOptimizer.getActiveStrategy();

    res.json({
      success: true,
      data: {
        metrics,
        pattern,
        strategy,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('RAM metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve RAM metrics'
    });
  }
});

// Get optimization report
router.get('/report', async (req, res) => {
  try {
    const report = ramOptimizer.generateOptimizationReport();
    
    res.json({
      success: true,
      data: {
        report,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('RAM report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate RAM report'
    });
  }
});

// Health check for RAM optimizer
router.get('/health', async (req, res) => {
  try {
    const metrics = ramOptimizer.getCurrentMetrics();
    const isHealthy = metrics && metrics.utilization < 90;

    res.json({
      success: true,
      data: {
        status: isHealthy ? 'healthy' : 'warning',
        utilization: metrics?.utilization || 0,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'RAM optimizer health check failed'
    });
  }
});

export default router;
