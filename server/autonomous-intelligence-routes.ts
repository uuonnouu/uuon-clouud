
/**
 * AUTONOMOUS INTELLIGENCE ROUTES
 * API endpoints for autonomous intelligence metrics and control
 * Product of UUON Foundation
 */

import { Router } from 'express';
import { serverIntelligenceMetrics } from './core-automation-engine';

const router = Router();

// Get current intelligence metrics
router.get('/metrics', (req, res) => {
  try {
    const metrics = serverIntelligenceMetrics.getMetrics();
    
    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        metrics,
        autonomousMode: true,
        systemHealth: metrics.systemHealth || 0.95
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve intelligence metrics'
    });
  }
});

// Record new metrics
router.post('/metrics', (req, res) => {
  try {
    const { metricName, value, confidence = 0.95 } = req.body;
    
    if (!metricName || typeof value !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'metricName and value are required'
      });
    }

    serverIntelligenceMetrics.recordMetric(metricName, value, confidence);

    res.json({
      success: true,
      message: `Metric ${metricName} recorded successfully`,
      data: { metricName, value, confidence }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record metric'
    });
  }
});

interface Recommendation {
  metric: string;
  action: string;
  urgency: 'high' | 'medium' | 'low';
  description: string;
  expectedImpact: number;
  autoApply: boolean;
}

// Get autonomous recommendations
router.get('/recommendations', (req, res) => {
  try {
    const metrics = serverIntelligenceMetrics.getMetrics();
    const recommendations: Recommendation[] = [];

    // Generate server-side recommendations based on metrics
    Object.entries(metrics).forEach(([metric, value]) => {
      if (value < 0.7) {
        recommendations.push({
          metric,
          action: 'optimize',
          urgency: value < 0.5 ? 'high' : 'medium',
          description: `${metric} below optimal threshold (${(value * 100).toFixed(1)}%)`,
          expectedImpact: 1 - value,
          autoApply: value > 0.3
        });
      }
    });

    res.json({
      success: true,
      data: {
        recommendations,
        totalRecommendations: recommendations.length,
        criticalCount: recommendations.filter((r: Recommendation) => r.urgency === 'high').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate recommendations'
    });
  }
});

// Health check with intelligence metrics
router.get('/health', (req, res) => {
  try {
    const metrics = serverIntelligenceMetrics.getMetrics();
    const healthScore = Object.values(metrics).length > 0 ? 
      Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.values(metrics).length : 1.0;

    const status = healthScore > 0.9 ? 'excellent' : 
                  healthScore > 0.7 ? 'good' : 
                  healthScore > 0.5 ? 'degraded' : 'critical';

    res.json({
      success: true,
      data: {
        status,
        healthScore: healthScore,
        metrics: Object.keys(metrics).length,
        timestamp: new Date().toISOString(),
        autonomous: true,
        recommendations: healthScore < 0.8
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Health check failed'
    });
  }
});

export default router;
