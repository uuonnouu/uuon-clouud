#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ProcessCleanup {
  async findTenantProcesses() {
    try {
      // Find processes that might be tenant/monitoring processes
      const { stdout } = await execAsync('ps aux | grep -E "(njin|sync|monitor|perfection)" | grep -v grep');
      return stdout.split('\n').filter(line => line.trim());
    } catch (error) {
      return [];
    }
  }

  async cleanupZombieProcesses() {
    console.log('🧹 Cleaning up zombie processes...');
    
    try {
      // Kill any orphaned monitoring processes
      await execAsync('pkill -f "njin-optimizer" || true');
      await execAsync('pkill -f "system-sync" || true');
      await execAsync('pkill -f "perfection-coordinator" || true');
      
      // Clean up any stuck Node processes on development ports
      await execAsync('lsof -ti:5173 | xargs kill -9 2>/dev/null || true');
      
      // Clean up temporary files
      await execAsync('find /tmp -name "*.tmp" -user $(whoami) -delete 2>/dev/null || true');
      
      // Clear Node.js cache if needed
      await execAsync('npm cache clean --force 2>/dev/null || true');
      
      console.log('✅ Zombie process cleanup complete');
    } catch (error) {
      console.warn('⚠️ Process cleanup had issues:', error.message);
    }
  }

  async optimizeMemory() {
    console.log('🧠 Optimizing memory usage...');
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('✅ Forced garbage collection');
    }
    
    // Clear Node.js module cache for non-essential modules
    const moduleKeepList = ['fs', 'path', 'http', 'https', 'express'];
    Object.keys(require.cache).forEach(key => {
      const shouldKeep = moduleKeepList.some(keep => key.includes(keep));
      if (!shouldKeep && key.includes('node_modules')) {
        delete require.cache[key];
      }
    });
    
    console.log('✅ Module cache optimized');
  }
}

const cleanup = new ProcessCleanup();

if (import.meta.url === `file://${process.argv[1]}`) {
  cleanup.cleanupZombieProcesses()
    .then(() => cleanup.optimizeMemory())
    .catch(console.error);
}

export { ProcessCleanup };
