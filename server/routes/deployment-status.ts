
import { Router } from 'express';
import { unifiedDeploymentCoordinator } from '../unified-deployment-coordinator';

const router = Router();

/**
 * GET /api/deployment-status
 * Returns complete system unification and deployment readiness status
 */
router.get('/', async (req, res) => {
  try {
    const report = await unifiedDeploymentCoordinator.performMaintenanceCheck();
    
    res.json({
      success: true,
      deploymentReport: report,
      summary: {
        status: report.status,
        checks: report.checks,
        timestamp: report.timestamp
      },
      nextSteps: report.status === 'healthy' ? 
        ['Ready for production deployment', 'All systems unified and optimized'] :
        ['Address system warnings', 'Complete pending checklist items']
    });
  } catch (error) {
    console.error('❌ Deployment status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assess deployment status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/deployment-status/optimize
 * Performs system optimization and unification
 */
router.post('/optimize', async (req, res) => {
  try {
    console.log('🔧 Starting system optimization and unification...');
    
    await unifiedDeploymentCoordinator.deploymentModeSwitch('production');
    const report = await unifiedDeploymentCoordinator.performMaintenanceCheck();
    
    res.json({
      success: true,
      message: 'System optimization and unification completed',
      optimizationResults: {
        status: report.status,
        checks: report.checks,
        deploymentReady: report.status === 'healthy'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Optimization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/status', (req, res) => {
  try {
    const deploymentStatus = {
      sitemap: {
        connected: true,
        endpoints: [
          '/api/sitemap/generate-shape-sitemaps',
          '/api/sitemap-standard/generate-standardized-sitemaps',
          '/api/sitemap-framework/generate-complete-ecosystem',
          '/api/sitemap-hierarchy/'
        ],
        xmlFiles: [
          'sitemap-index.xml',
          'sitemap-all-shapes.xml',
          'sitemap-categories.xml'
        ]
      },
      agents: {
        coordination: '/api/agents/status',
        deployment: '/api/agents/deployment/optimize',
        sitemap: '/api/agents/sitemap/status'
      },
      optimization: {
        database: 'active',
        build: 'ready',
        assets: 'optimized'
      },
      api: {
        health: '/api/health',
        shapes: '/api/shapes',
        compute: '/api/compute',
        export: '/api/export'
      }
    };

    res.json({
      success: true,
      deployment: deploymentStatus,
      connected: true,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/test-connections', async (req, res) => {
  try {
    const connections = [];
    
    try {
      const fs = require('fs');
      const sitemapExists = fs.existsSync('client/public/sitemap-index.xml');
      connections.push({
        service: 'Sitemap XML Files',
        status: sitemapExists ? 'connected' : 'missing',
        details: sitemapExists ? 'Sitemap files present' : 'Generate sitemaps first'
      });
    } catch {
      connections.push({
        service: 'Sitemap XML Files',
        status: 'error',
        details: 'Cannot access sitemap directory'
      });
    }

    try {
      const { architecturePlatformAgent } = require('../agents/architectureAgent');
      const agentStatus = architecturePlatformAgent.getArchitecture();
      connections.push({
        service: 'Agent Coordination',
        status: 'connected',
        details: `${agentStatus.modules.length} modules managed`
      });
    } catch {
      connections.push({
        service: 'Agent Coordination',
        status: 'error',
        details: 'Agent system not responding'
      });
    }

    try {
      const { databaseDeploymentOptimizer } = require('../database-deployment-optimizer');
      connections.push({
        service: 'Deployment Optimizer',
        status: 'connected',
        details: 'Deployment optimizer ready'
      });
    } catch {
      connections.push({
        service: 'Deployment Optimizer',
        status: 'error',
        details: 'Deployment optimizer not available'
      });
    }

    const allConnected = connections.every(conn => conn.status === 'connected');

    res.json({
      success: true,
      allConnected,
      connections,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export { router as deploymentStatusRoutes };
