/**
 * AGENT COORDINATION API
 * Provides endpoints for all SDK governance agents
 * Centralizes agent management and reporting
 */

import { Router } from 'express';
import { architecturePlatformAgent } from '../agents/architectureAgent';
import { dataGovernanceAgent } from '../agents/dataGovernanceAgent';
import { buildPackagingAgent } from '../agents/buildPackagingAgent';
import { observabilityAgent } from '../agents/observabilityAgent';

const router = Router();

// ============================================================================
// ARCHITECTURE AGENT ENDPOINTS
// ============================================================================

router.get('/architecture/report', (req, res) => {
  try {
    const report = architecturePlatformAgent.generateArchitectureReport();
    res.json({
      success: true,
      agent: 'architecture',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/architecture/structure', (req, res) => {
  try {
    const architecture = architecturePlatformAgent.getArchitecture();
    res.json({
      success: true,
      agent: 'architecture',
      data: architecture,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/architecture/validate-module', (req, res) => {
  try {
    const { moduleDef } = req.body;
    const validation = architecturePlatformAgent.validateModuleAddition(moduleDef);
    res.json({
      success: true,
      agent: 'architecture',
      data: validation,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/architecture/request-feature', (req, res) => {
  try {
    const { feature, module } = req.body;
    const approval = architecturePlatformAgent.registerFeatureRequest(feature, module);
    res.json({
      success: true,
      agent: 'architecture',
      data: approval,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// DATA GOVERNANCE AGENT ENDPOINTS
// ============================================================================

router.get('/data-governance/report', (req, res) => {
  try {
    const storageReport = dataGovernanceAgent.getStorageReport();
    const complianceReport = dataGovernanceAgent.getComplianceReport();

    res.json({
      success: true,
      agent: 'data-governance',
      data: {
        storage: storageReport,
        compliance: complianceReport
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/data-governance/store', (req, res) => {
  try {
    const { dataType, identifier, data } = req.body;
    const result = dataGovernanceAgent.store(dataType, identifier, data);
    res.json({
      success: true,
      agent: 'data-governance',
      data: { stored: result },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/data-governance/retrieve/:dataType/:identifier', (req, res) => {
  try {
    const { dataType, identifier } = req.params;
    const data = dataGovernanceAgent.retrieve(dataType, identifier);
    res.json({
      success: true,
      agent: 'data-governance',
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// BUILD PACKAGING AGENT ENDPOINTS  
// ============================================================================

router.get('/build/report', (req, res) => {
  try {
    const report = buildPackagingAgent.getBuildReport();
    res.json({
      success: true,
      agent: 'build-packaging',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/build/target/:targetName', (req, res) => {
  try {
    const { targetName } = req.params;
    const report = buildPackagingAgent.getTargetReport(targetName);
    res.json({
      success: true,
      agent: 'build-packaging',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/build/target/:targetName', async (req, res) => {
  try {
    const { targetName } = req.params;
    const result = await buildPackagingAgent.buildTarget(targetName);
    res.json({
      success: result.success,
      agent: 'build-packaging',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/build/all', async (req, res) => {
  try {
    const results = await buildPackagingAgent.buildAll();
    const successCount = results.filter(r => r.success).length;

    res.json({
      success: successCount === results.length,
      agent: 'build-packaging',
      data: {
        results,
        summary: {
          total: results.length,
          successful: successCount,
          failed: results.length - successCount
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/build/publish/:targetName', async (req, res) => {
  try {
    const { targetName } = req.params;
    const { version } = req.body;
    const result = await buildPackagingAgent.publishBuild(targetName, version);

    res.json({
      success: result,
      agent: 'build-packaging',
      data: { published: result, target: targetName, version },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// OBSERVABILITY AGENT ENDPOINTS
// ============================================================================

router.get('/observability/health', (req, res) => {
  try {
    const report = observabilityAgent.getHealthReport();
    res.json({
      success: true,
      agent: 'observability',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/observability/metrics', (req, res) => {
  try {
    const timeframe = req.query.timeframe ? 
      parseInt(req.query.timeframe as string) : 
      24 * 60 * 60 * 1000; // 24 hours default

    const report = observabilityAgent.getMetricsReport(timeframe);
    res.json({
      success: true,
      agent: 'observability',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/observability/validation', (req, res) => {
  try {
    const report = observabilityAgent.getValidationReport();
    res.json({
      success: true,
      agent: 'observability',
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/observability/metric', (req, res) => {
  try {
    const event = req.body;
    observabilityAgent.recordMetric(event);
    res.json({
      success: true,
      agent: 'observability',
      data: { recorded: true },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// COORDINATION ENDPOINTS - All Agents
// ============================================================================

router.get('/status', (req, res) => {
  try {
    const status = {
      architecture: {
        active: true,
        modules: architecturePlatformAgent.getArchitecture().modules,
        health: 'operational'
      },
      dataGovernance: {
        active: true,
        policies: Object.keys(dataGovernanceAgent.getStorageReport().policies).length,
        health: 'operational'
      },
      buildPackaging: {
        active: true,
        targets: buildPackagingAgent.getBuildReport().targets.total,
        health: 'operational'
      },
      observability: {
        active: true,
        healthChecks: observabilityAgent.getHealthReport().checks.length,
        health: observabilityAgent.getHealthReport().overall
      }
    };

    res.json({
      success: true,
      data: status,
      summary: {
        totalAgents: 4,
        operational: Object.values(status).filter((s: any) => s.health === 'operational').length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/dashboard', (req, res) => {
  try {
    const dashboard = {
      architecture: {
        version: architecturePlatformAgent.getArchitecture().version,
        modules: Object.keys(architecturePlatformAgent.getArchitecture().modules).length,
        health: architecturePlatformAgent.generateArchitectureReport().healthScore
      },
      dataGovernance: {
        storagePolicies: Object.keys(dataGovernanceAgent.getStorageReport().policies).length,
        dataTypes: dataGovernanceAgent.getComplianceReport().dataTypes,
        compliance: Object.keys(dataGovernanceAgent.getComplianceReport().byCompliance)
      },
      buildPackaging: {
        targets: buildPackagingAgent.getBuildReport().targets.total,
        successRate: buildPackagingAgent.getBuildReport().builds.successRate,
        lastBuilds: buildPackagingAgent.getBuildReport().builds.total
      },
      observability: {
        overallHealth: observabilityAgent.getHealthReport().overall,
        healthyChecks: observabilityAgent.getHealthReport().summary.healthy,
        totalMetrics: observabilityAgent.getMetricsReport().totalOperations
      }
    };

    res.json({
      success: true,
      data: dashboard,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// SITEMAP COORDINATION ENDPOINTS  
// ============================================================================

router.get('/sitemap/status', async (req, res) => {
  try {
    const fs = require('fs');
    const sitemapFiles = [
      'sitemap-index.xml',
      'sitemap-all-shapes.xml',
      'sitemap-categories.xml',
      'sitemap-algorithms.xml',
      'sitemap-engines.xml'
    ];

    const sitemapStatus = sitemapFiles.map(file => {
      const exists = fs.existsSync(`client/public/${file}`);
      let lastModified = null;
      if (exists) {
        const stats = fs.statSync(`client/public/${file}`);
        lastModified = stats.mtime.toISOString();
      }
      return { file, exists, lastModified };
    });

    res.json({
      success: true,
      agent: 'sitemap-coordination',
      data: {
        totalSitemaps: sitemapFiles.length,
        activeSitemaps: sitemapStatus.filter(s => s.exists).length,
        sitemaps: sitemapStatus
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/sitemap/regenerate', async (req, res) => {
  try {
    console.log('🗺️ Agent-coordinated sitemap regeneration...');

    // Trigger sitemap generation through agents
    const { StandardizedSitemapGenerator } = require('../sitemap-framework-generator');
    const generator = new StandardizedSitemapGenerator();

    await generator.generateAllSitemaps();

    res.json({
      success: true,
      agent: 'sitemap-coordination',
      message: 'Sitemaps regenerated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      agent: 'sitemap-coordination'
    });
  }
});

// ============================================================================
// DEPLOYMENT AGENT COORDINATION  
// ============================================================================

router.post('/deployment/optimize', async (req, res) => {
  try {
    console.log('🚀 Agent-coordinated deployment optimization...');

    // Coordinate all agents for deployment
    const architectureReport = architecturePlatformAgent.getArchitecture();
    const dataReport = dataGovernanceAgent.getStorageReport();
    const buildReport = buildPackagingAgent.getBuildReport();
    const healthReport = observabilityAgent.getHealthReport();

    // Run deployment optimization
    const { databaseDeploymentOptimizer } = require('../database-deployment-optimizer');
    await databaseDeploymentOptimizer.optimizeForDeployment();

    res.json({
      success: true,
      agent: 'deployment-coordination',
      optimization: {
        architecture: architectureReport.status,
        dataGovernance: dataReport.status,
        build: buildReport.status,
        health: healthReport.overall
      },
      message: 'Deployment optimization completed',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      agent: 'deployment-coordination'
    });
  }
});

router.get('/deployment/readiness', (req, res) => {
  try {
    const readiness = {
      architecture: {
        status: 'ready',
        modules: architecturePlatformAgent.getArchitecture().modules.length,
        agent: 'ArchitecturePlatformAgent'
      },
      dataGovernance: {
        status: 'ready',
        policies: Object.keys(dataGovernanceAgent.getStorageReport().policies).length,
        agent: 'DataGovernanceAgent'
      },
      buildPackaging: {
        status: 'ready',
        targets: buildPackagingAgent.getBuildReport().targets.total,
        agent: 'BuildPackagingAgent'
      },
      observability: {
        status: observabilityAgent.getHealthReport().overall,
        checks: observabilityAgent.getHealthReport().checks.length,
        agent: 'ObservabilityAgent'
      }
    };

    const overallReadiness = Object.values(readiness).every(
      (agent: any) => agent.status === 'ready' || agent.status === 'healthy'
    );

    res.json({
      success: true,
      agent: 'deployment-coordination',
      readiness: {
        overall: overallReadiness ? 'ready' : 'not-ready',
        agents: readiness
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      agent: 'deployment-coordination'
    });
  }
});

console.log('🤖 Agent coordination routes configured with sitemap and deployment integration');

export default router;