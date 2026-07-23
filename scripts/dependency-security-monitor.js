#!/usr/bin/env node

/**
 * DEPENDENCY SECURITY MONITOR
 * Continuous monitoring for vulnerable dependencies
 */

import { execSync } from 'child_process';
import fs from 'fs';

class DependencySecurityMonitor {
  constructor() {
    this.vulnerabilityLog = 'security_vulnerabilities.json';
    this.checkInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async checkVulnerabilities() {
    console.log('🔍 Scanning for dependency vulnerabilities...');
    
    try {
      // Run npm audit
      const npmAudit = execSync('npm audit --json 2>/dev/null || echo "{}"', { 
        encoding: 'utf8' 
      });
      
      const auditResults = JSON.parse(npmAudit);
      
      // Run pip check for Python dependencies
      let pipVulns = [];
      try {
        const pipCheck = execSync('pip list --outdated --format=json 2>/dev/null || echo "[]"', { 
          encoding: 'utf8' 
        });
        pipVulns = JSON.parse(pipCheck);
      } catch (error) {
        console.log('   ℹ️ Python dependency check skipped');
      }
      
      const report = {
        timestamp: new Date().toISOString(),
        npmVulnerabilities: auditResults.vulnerabilities || {},
        pipOutdated: pipVulns,
        totalNpmVulns: Object.keys(auditResults.vulnerabilities || {}).length,
        criticalVulns: this.getCriticalVulnerabilities(auditResults),
        recommendations: this.generateRecommendations(auditResults, pipVulns)
      };
      
      // Save report
      fs.writeFileSync(this.vulnerabilityLog, JSON.stringify(report, null, 2));
      
      console.log(`   📊 Found ${report.totalNpmVulns} npm vulnerabilities`);
      console.log(`   📊 Found ${pipVulns.length} outdated Python packages`);
      
      if (report.criticalVulns.length > 0) {
        console.log('🚨 CRITICAL VULNERABILITIES DETECTED:');
        report.criticalVulns.forEach(vuln => {
          console.log(`   ❌ ${vuln.name}: ${vuln.severity} - ${vuln.title}`);
        });
      }
      
      return report;
      
    } catch (error) {
      console.error('❌ Vulnerability scan failed:', error.message);
      throw error;
    }
  }

  getCriticalVulnerabilities(auditResults) {
    const critical = [];
    
    if (auditResults.vulnerabilities) {
      Object.entries(auditResults.vulnerabilities).forEach(([name, vuln]) => {
        if (vuln.severity === 'critical' || vuln.severity === 'high') {
          critical.push({
            name,
            severity: vuln.severity,
            title: vuln.title,
            range: vuln.range
          });
        }
      });
    }
    
    return critical;
  }

  generateRecommendations(npmAudit, pipOutdated) {
    const recommendations = [];
    
    if (npmAudit.vulnerabilities && Object.keys(npmAudit.vulnerabilities).length > 0) {
      recommendations.push('Run safe dependency updater to fix npm vulnerabilities');
    }
    
    if (pipOutdated.length > 0) {
      recommendations.push('Update Python packages using pip install --upgrade');
    }
    
    recommendations.push('Review critical vulnerabilities immediately');
    recommendations.push('Test system after any dependency updates');
    
    return recommendations;
  }

  startMonitoring() {
    console.log('🔄 Starting continuous dependency security monitoring...');
    
    // Initial check
    this.checkVulnerabilities();
    
    // Schedule regular checks
    setInterval(() => {
      console.log('⏰ Scheduled vulnerability check...');
      this.checkVulnerabilities().catch(console.error);
    }, this.checkInterval);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const monitor = new DependencySecurityMonitor();
  monitor.checkVulnerabilities().catch(console.error);
}

export { DependencySecurityMonitor };
