/**
 * AUTOMATED PROOF TESTING SYSTEM
 * Runs comprehensive mathematical proofs on schedule
 */

import { mathematicalProofEngine } from './mathematical-proof-engine';
import { writeFileSync } from 'fs';
import { CertificateStorageManager } from './certificate-storage-manager';

export class AutomatedProofTester {
  private isRunning = false;
  private testInterval: NodeJS.Timeout | null = null;
  
  startAutomatedTesting(intervalHours: number = 24) {
    if (this.isRunning) {
      console.log('⚠️ Automated proof testing already running');
      return;
    }
    
    // Cleanup any existing interval
    if (this.testInterval) {
      clearInterval(this.testInterval);
    }
    
    this.isRunning = true;
    console.log(`🔬 Starting automated proof testing (every ${intervalHours} hours)`);
    
    // Run initial test
    this.runProofTest();
    
    // Schedule recurring tests
    this.testInterval = setInterval(() => {
      this.runProofTest();
    }, intervalHours * 60 * 60 * 1000);
  }
  
  stopAutomatedTesting() {
    if (this.testInterval) {
      clearInterval(this.testInterval);
      this.testInterval = null;
    }
    this.isRunning = false;
    console.log('⏹️ Automated proof testing stopped');
  }
  
  private async runProofTest() {
    try {
      console.log('🔬 Running automated mathematical proof test...');
      const report = await mathematicalProofEngine.runComprehensiveProofTests();
      
      // Store certificate in Replit KV (no local files)
      if (report.averageScore >= 80) {
        const certificate = await mathematicalProofEngine.exportProofCertificate(report);
        const certId = await CertificateStorageManager.storeCertificate(certificate, report);
        console.log(`🏆 Proof certificate stored: ${certId}`);
      }
      
      // Save report summary (lightweight)
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const summaryReport = {
        timestamp: report.timestamp,
        totalShapes: report.totalShapes,
        averageScore: report.averageScore,
        passedTests: report.passedTests,
        failedTests: report.failedTests
      };
      
      writeFileSync(`proof-summary-${timestamp}.json`, JSON.stringify(summaryReport, null, 2));
      console.log(`📄 Proof summary saved (${JSON.stringify(summaryReport).length} bytes)`);
      
      // Get storage stats
      const stats = await CertificateStorageManager.getCertificateStats();
      console.log(`📊 Certificate Storage: ${stats.totalCertificates} certs, ${stats.storageUsed} used`);
      
      // Log summary
      console.log(`✅ Automated proof test completed:`);
      console.log(`   - Total Shapes: ${report.totalShapes}`);
      console.log(`   - Passed: ${report.passedTests}`);
      console.log(`   - Failed: ${report.failedTests}`);
      console.log(`   - Average Score: ${report.averageScore.toFixed(2)}%`);
      
    } catch (error) {
      console.error('❌ Automated proof test failed:', error);
    }
  }
}

export const automatedProofTester = new AutomatedProofTester();
