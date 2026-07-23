#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class EnhancedPortCleanup {
  constructor() {
    this.targetPort = 5000;
    this.maxRetries = 10;
    this.retryDelay = 1500;
  }

  async findProcessesOnPort(port) {
    const commands = [
      `lsof -ti:${port}`,
      `netstat -tulpn | grep :${port} | awk '{print $7}' | cut -d'/' -f1`,
      `ss -tulpn | grep :${port} | awk '{print $6}' | cut -d',' -f2 | cut -d'=' -f2`
    ];

    const processes = new Set();

    for (const cmd of commands) {
      try {
        const { stdout } = await execAsync(cmd);
        if (stdout.trim()) {
          stdout.trim().split('\n').forEach(pid => {
            if (pid && !isNaN(pid)) {
              processes.add(parseInt(pid));
            }
          });
        }
      } catch (error) {
        // Command failed, continue with next method
      }
    }

    return Array.from(processes);
  }

  async killProcess(pid) {
    const killMethods = [
      `kill -TERM ${pid}`,
      `kill -KILL ${pid}`,
      `kill -9 ${pid}`
    ];

    for (const method of killMethods) {
      try {
        await execAsync(method);
        console.log(`✅ Killed process ${pid} with ${method}`);
        return true;
      } catch (error) {
        console.log(`⚠️ Failed to kill ${pid} with ${method}`);
      }
    }
    return false;
  }

  async aggressivePortCleanup(port = this.targetPort) {
    console.log(`🔧 Starting aggressive port ${port} cleanup...`);

    let attempt = 0;
    while (attempt < this.maxRetries) {
      attempt++;
      console.log(`🔄 Cleanup attempt ${attempt}/${this.maxRetries}`);

      // Step 1: Find all processes
      const processes = await this.findProcessesOnPort(port);

      if (processes.length === 0) {
        console.log(`✅ Port ${port} is clean`);
        return true;
      }

      console.log(`🎯 Found processes on port ${port}:`, processes);

      // Step 2: Kill processes gracefully first, then forcefully
      for (const pid of processes) {
        await this.killProcess(pid);
      }

      // Step 3: Nuclear cleanup commands
      const nuclearCommands = [
        `pkill -f ":${port}"`,
        `pkill -f "port.${port}"`,
        `pkill -f "PORT=${port}"`,
        `pkill -f "npm.*start"`,
        `pkill -f "node.*server"`,
        `pkill -f "tsx.*server"`,
        `fuser -k ${port}/tcp`,
        `lsof -ti:${port} | xargs -r kill -9`
      ];

      for (const cmd of nuclearCommands) {
        try {
          await execAsync(`${cmd} 2>/dev/null || true`);
        } catch (error) {
          // Ignore errors, these are cleanup attempts
        }
      }

      // Step 4: System-level cleanup
      try {
        await execAsync(`echo "" > /proc/sys/net/ipv4/ip_local_port_range`);
        await execAsync(`sysctl -w net.ipv4.ip_local_port_range="32768 61000"`);
      } catch (error) {
        // System commands may not be available
      }

      // Step 5: Wait and verify
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));

      const remainingProcesses = await this.findProcessesOnPort(port);
      if (remainingProcesses.length === 0) {
        console.log(`✅ Port ${port} successfully cleaned after ${attempt} attempts`);
        return true;
      }

      console.log(`⚠️ Port ${port} still has ${remainingProcesses.length} processes after attempt ${attempt}`);
    }

    console.log(`❌ Failed to clean port ${port} after ${this.maxRetries} attempts`);
    return false;
  }

  async cleanupRelatedProcesses() {
    console.log('🧹 Cleaning up related Node.js processes...');

    const processPatterns = [
      'npm run dev',
      'npm start',
      'tsx server',
      'node server',
      'vite dev',
      'nodemon'
    ];

    for (const pattern of processPatterns) {
      try {
        await execAsync(`pkill -f "${pattern}" 2>/dev/null || true`);
        console.log(`✅ Cleaned processes matching: ${pattern}`);
      } catch (error) {
        // Ignore cleanup errors
      }
    }

    // Clean up zombie processes
    try {
      await execAsync('pkill -9 -f "defunct" 2>/dev/null || true');
      await execAsync('pkill -9 -f "zombie" 2>/dev/null || true');
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  async performFullCleanup() {
    console.log('🚀 Starting FULL system cleanup...');

    // Clean related processes first
    await this.cleanupRelatedProcesses();

    // Wait for processes to die
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clean target port aggressively
    const success = await this.aggressivePortCleanup(this.targetPort);

    if (success) {
      console.log('✅ Full cleanup completed successfully');
      return true;
    } else {
      console.log('❌ Full cleanup completed with issues');
      return false;
    }
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const execPromise = promisify(exec);

  async function cleanupPorts() {
    try {
      console.log('🧹 Enhanced port cleanup starting...');

      // Kill any processes on port 5000
      try {
        await execPromise('lsof -ti:5000 | xargs kill -9');
        console.log('✅ Port 5000 cleaned');
      } catch (error) {
        console.log('ℹ️ Port 5000 already clean');
      }

      // Kill any processes on port 3000
      try {
        await execPromise('lsof -ti:3000 | xargs kill -9');
        console.log('✅ Port 3000 cleaned');
      } catch (error) {
        console.log('ℹ️ Port 3000 already clean');
      }

      // Clear any orphaned node processes
      try {
        await execPromise('pkill -f "node.*server"');
        console.log('✅ Orphaned server processes cleaned');
      } catch (error) {
        console.log('ℹ️ No orphaned processes found');
      }

      console.log('🎯 Enhanced port cleanup completed successfully');
      process.exit(0);
    } catch (error) {
      console.error('❌ Port cleanup error:', error.message);
      process.exit(1);
    }
  }

  cleanupPorts();
}

export { EnhancedPortCleanup };