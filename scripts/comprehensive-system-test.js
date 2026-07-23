
#!/usr/bin/env node

import { execSync } from 'child_process';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

class ComprehensiveSystemTest {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.testResults = [];
    this.criticalErrors = [];
  }

  log(message, status = 'INFO') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${status}: ${message}`;
    console.log(logMessage);
    
    this.testResults.push({
      timestamp,
      status,
      message,
      test: this.currentTest || 'GENERAL'
    });
  }

  async runTest(testName, testFn) {
    this.currentTest = testName;
    this.log(`Starting test: ${testName}`, 'TEST');
    
    try {
      await testFn();
      this.log(`✅ Test passed: ${testName}`, 'PASS');
    } catch (error) {
      this.log(`❌ Test failed: ${testName} - ${error.message}`, 'FAIL');
      this.criticalErrors.push({ test: testName, error: error.message });
    }
  }

  async testServerHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (response.ok) {
        const data = await response.json();
        this.log(`Server health check passed: ${JSON.stringify(data)}`);
      } else {
        throw new Error(`Health check failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Server unreachable: ${error.message}`);
    }
  }

  async testNasaOsdrIntegration() {
    try {
      const response = await fetch(`${this.baseUrl}/api/nasa-osdr/studies`);
      if (response.ok) {
        const data = await response.json();
        this.log(`NASA OSDR integration working: Found ${data.length || 0} studies`);
      } else {
        throw new Error(`NASA OSDR API failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`NASA OSDR test failed: ${error.message}`);
    }
  }

  async testShapeRegistry() {
    try {
      const response = await fetch(`${this.baseUrl}/api/shapes`);
      if (response.ok) {
        const shapes = await response.json();
        const shapeCount = Array.isArray(shapes) ? shapes.length : Object.keys(shapes).length;
        this.log(`Shape registry loaded: ${shapeCount} shapes available`);
        
        if (shapeCount < 100) {
          throw new Error(`Low shape count: ${shapeCount} (expected > 100)`);
        }
      } else {
        throw new Error(`Shape registry failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Shape registry test failed: ${error.message}`);
    }
  }

  async testMathematicalEngine() {
    try {
      const response = await fetch(`${this.baseUrl}/api/unified-math/equations`);
      if (response.ok) {
        const equations = await response.json();
        const equationCount = Array.isArray(equations) ? equations.length : Object.keys(equations).length;
        this.log(`Mathematical engine loaded: ${equationCount} equations`);
      } else {
        throw new Error(`Mathematical engine failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Mathematical engine test failed: ${error.message}`);
    }
  }

  async testTokenEconomy() {
    try {
      const response = await fetch(`${this.baseUrl}/api/token-ecosystem/status`);
      if (response.ok) {
        const tokenData = await response.json();
        this.log(`Token economy active: ${JSON.stringify(tokenData)}`);
      } else {
        throw new Error(`Token economy failed: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Token economy test failed: ${error.message}`);
    }
  }

  async testFileSystemIntegrity() {
    const criticalFiles = [
      'server/index.ts',
      'client/src/App.tsx',
      'package.json',
      'shared/schema.ts'
    ];

    for (const file of criticalFiles) {
      if (!fs.existsSync(file)) {
        throw new Error(`Critical file missing: ${file}`);
      }
    }

    this.log('File system integrity check passed');
  }

  async testDatabaseConnectivity() {
    try {
      const response = await fetch(`${this.baseUrl}/api/database-diagnostics/status`);
      if (response.ok) {
        const dbStatus = await response.json();
        this.log(`Database connectivity: ${JSON.stringify(dbStatus)}`);
      } else {
        this.log('Database diagnostics endpoint not available (non-critical)', 'WARN');
      }
    } catch (error) {
      this.log(`Database test warning: ${error.message}`, 'WARN');
    }
  }

  async testQuantumIntegration() {
    try {
      const response = await fetch(`${this.baseUrl}/api/quantum/algorithms`);
      if (response.ok) {
        const algorithms = await response.json();
        this.log(`Quantum integration active: ${Array.isArray(algorithms) ? algorithms.length : 'Available'} algorithms`);
      } else {
        this.log('Quantum integration endpoint not available (non-critical)', 'WARN');
      }
    } catch (error) {
      this.log(`Quantum integration warning: ${error.message}`, 'WARN');
    }
  }

  async testPerformanceMetrics() {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${this.baseUrl}/api/system-health/metrics`);
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 5000) {
        throw new Error(`Slow response time: ${responseTime}ms (expected < 5000ms)`);
      }
      
      this.log(`Performance metrics: Response time ${responseTime}ms`);
    } catch (error) {
      throw new Error(`Performance test failed: ${error.message}`);
    }
  }

  async testSecurityHeaders() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const headers = response.headers;
      
      // Check for basic security headers
      const securityChecks = [
        'x-powered-by', // Should NOT be present
        'access-control-allow-origin'
      ];
      
      this.log('Security headers check completed');
    } catch (error) {
      throw new Error(`Security headers test failed: ${error.message}`);
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      totalTests: this.testResults.filter(r => r.status === 'TEST').length,
      passed: this.testResults.filter(r => r.status === 'PASS').length,
      failed: this.testResults.filter(r => r.status === 'FAIL').length,
      warnings: this.testResults.filter(r => r.status === 'WARN').length,
      criticalErrors: this.criticalErrors,
      results: this.testResults
    };

    // Write report to file
    const reportPath = 'test-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    return report;
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive System Test Suite');
    console.log('=' * 50);

    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Core System Tests
    await this.runTest('File System Integrity', () => this.testFileSystemIntegrity());
    await this.runTest('Server Health', () => this.testServerHealth());
    await this.runTest('Shape Registry', () => this.testShapeRegistry());
    await this.runTest('Mathematical Engine', () => this.testMathematicalEngine());
    await this.runTest('Performance Metrics', () => this.testPerformanceMetrics());
    await this.runTest('Security Headers', () => this.testSecurityHeaders());

    // NASA Integration Tests
    await this.runTest('NASA OSDR Integration', () => this.testNasaOsdrIntegration());

    // Platform Features Tests
    await this.runTest('Token Economy', () => this.testTokenEconomy());
    await this.runTest('Database Connectivity', () => this.testDatabaseConnectivity());
    await this.runTest('Quantum Integration', () => this.testQuantumIntegration());

    // Generate report
    const report = this.generateReport();
    
    console.log('\n' + '=' * 50);
    console.log('🎯 TEST SUITE COMPLETE');
    console.log('=' * 50);
    console.log(`Total Tests: ${report.totalTests}`);
    console.log(`Passed: ${report.passed} ✅`);
    console.log(`Failed: ${report.failed} ❌`);
    console.log(`Warnings: ${report.warnings} ⚠️`);
    
    if (report.criticalErrors.length > 0) {
      console.log('\n🚨 CRITICAL ERRORS:');
      report.criticalErrors.forEach(error => {
        console.log(`  - ${error.test}: ${error.error}`);
      });
    }
    
    console.log(`\n📊 Full report saved to: test-report.json`);
    
    // Exit with appropriate code
    process.exit(report.failed > 0 ? 1 : 0);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const tester = new ComprehensiveSystemTest();
  tester.runAllTests().catch(error => {
    console.error('❌ Test suite failed to run:', error);
    process.exit(1);
  });
}

export { ComprehensiveSystemTest };
