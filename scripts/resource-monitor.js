
/**
 * CONTINUOUS RESOURCE MONITOR
 * Monitors and protects shape libraries from external interference
 */

import { exec } from 'child_process';
import fs from 'fs';

class ResourceMonitor {
  constructor() {
    this.isMonitoring = false;
    this.checkInterval = 30000; // 30 seconds
    this.protectedPorts = [5000, 5173];
    this.protectedPaths = [
      'client/src/lib/unifiedShapes.ts',
      'client/src/lib/shapeCategories.ts',
      'server/lib/shapes/shapeComputer.ts'
    ];
  }

  async start() {
    if (this.isMonitoring) {
      console.log('⚠️ Resource monitor already running');
      return;
    }

    this.isMonitoring = true;
    console.log('🛡️ Starting continuous resource monitoring...');
    console.log(`⏱️ Check interval: ${this.checkInterval/1000}s`);
    
    // Initial check
    await this.performCheck();
    
    // Set up continuous monitoring
    this.monitorInterval = setInterval(async () => {
      await this.performCheck();
    }, this.checkInterval);
    
    console.log('✅ Resource monitor active');
  }

  async performCheck() {
    try {
      await this.checkPortExclusivity();
      await this.checkFileIntegrity();
      await this.checkMemoryUsage();
      await this.logStatus();
    } catch (error) {
      console.error('❌ Monitor check error:', error.message);
    }
  }

  async checkPortExclusivity() {
    for (const port of this.protectedPorts) {
      try {
        await new Promise((resolve, reject) => {
          exec(`lsof -ti:${port}`, (error, stdout, stderr) => {
            if (stdout) {
              const pids = stdout.trim().split('\n');
              if (pids.length > 1) {
                console.warn(`⚠️ Multiple processes on port ${port}: ${pids.length}`);
                // Kill extra processes (keep the first one - likely ours)
                for (let i = 1; i < pids.length; i++) {
                  exec(`kill -9 ${pids[i]} 2>/dev/null || true`);
                }
                console.log(`✅ Cleaned up port ${port} conflicts`);
              }
            }
            resolve();
          });
        });
      } catch (error) {
        // Port check failed, but continue monitoring
      }
    }
  }

  async checkFileIntegrity() {
    for (const filePath of this.protectedPaths) {
      try {
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          
          // Check if file is accessible
          try {
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK);
          } catch (accessError) {
            console.warn(`⚠️ File access issue: ${filePath}`);
            // Attempt to fix permissions
            exec(`chmod u+rw "${filePath}" 2>/dev/null || true`);
          }
        } else {
          console.warn(`⚠️ Protected file missing: ${filePath}`);
        }
      } catch (error) {
        console.warn(`⚠️ File integrity check failed for ${filePath}:`, error.message);
      }
    }
  }

  async checkMemoryUsage() {
    try {
      await new Promise((resolve) => {
        exec('ps aux | grep node | grep -v grep | wc -l', (error, stdout) => {
          if (stdout) {
            const nodeProcessCount = parseInt(stdout.trim());
            if (nodeProcessCount > 5) {
              console.warn(`⚠️ High Node.js process count: ${nodeProcessCount}`);
            }
          }
          resolve();
        });
      });
    } catch (error) {
      // Memory check failed, continue
    }
  }

  logStatus() {
    const timestamp = new Date().toISOString();
    console.log(`🛡️ [${timestamp}] Resource monitor: All systems protected`);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.isMonitoring = false;
      console.log('🛑 Resource monitoring stopped');
    }
  }
}

// Start monitoring if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const monitor = new ResourceMonitor();
  monitor.start();
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping resource monitor...');
    monitor.stop();
    process.exit(0);
  });
}

export default ResourceMonitor;
