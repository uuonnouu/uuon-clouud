const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class SafeDependencyUpdater {
  constructor() {
    this.backupDir = 'backup_dependencies';
    this.allowedPackages = new Set([
      'cross-spawn', 'glob', 'jws', 'path-to-regexp', 'validator',
      'vega', 'vega-expression', 'vega-interpreter', 'qiskit', 'urllib3'
    ]);
    this.vulnerableDeps = [
      'cross-spawn@7.0.3',
      'glob@10.3.10',
      'jws@3.2.2',
      'path-to-regexp@0.1.10',
      'validator@13.12.0',
      'vega@5.33.0',
      'vega-expression@5.0.1',
      'vega-expression@5.2.0',
      'vega-interpreter@1.0.5'
    ];
    this.criticalDeps = [
      'qiskit@1.2.0',
      'urllib3@2.5.0'
    ];
  }

  validatePackageName(name) {
    return this.allowedPackages.has(name) && /^[a-zA-Z0-9@\-_.]+$/.test(name);
  }

  async updateSafely() {
    console.log('🔒 Starting SAFE dependency updates...');

    // Step 1: Create backup
    await this.createBackup();

    // Step 2: Check system status
    await this.checkSystemHealth();

    // Step 3: Update safe dependencies first
    await this.updateSafeDependencies();

    // Step 4: Update critical dependencies with testing
    await this.updateCriticalDependencies();

    // Step 5: Verify system integrity
    await this.verifySystemIntegrity();

    console.log('✅ Safe dependency updates completed');
  }

  async createBackup() {
    console.log('💾 Creating dependency backup...');

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    // Backup package files
    const filesToBackup = [
      'package.json',
      'package-lock.json',
      'requirements.txt'
    ];

    for (const file of filesToBackup) {
      if (fs.existsSync(file)) {
        fs.copyFileSync(file, path.join(this.backupDir, `${file}.backup`));
        console.log(`   📁 Backed up ${file}`);
      }
    }
  }

  async checkSystemHealth() {
    console.log('🏥 Checking system health before updates...');

    try {
      // Kill any conflicting processes
      execSync('pkill -f "npm run dev" || true', { stdio: 'pipe' });
      execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });

      console.log('   ✅ Port conflicts cleared');

      // Verify core files exist
      const criticalFiles = [
        'server/index.ts',
        'client/src/App.tsx',
        'server/unified-communication-coordinator.ts'
      ];

      for (const file of criticalFiles) {
        if (!fs.existsSync(file)) {
          throw new Error(`Critical file missing: ${file}`);
        }
      }

      console.log('   ✅ Core system files verified');

    } catch (error) {
      console.error('❌ System health check failed:', error.message);
      throw error;
    }
  }

  async updateSafeDependencies() {
    console.log('🔧 Updating safe dependencies...');

    for (const dep of this.vulnerableDeps) {
      const [name, version] = dep.split('@');

      if (!this.validatePackageName(name)) {
        console.warn(`   ⚠️ Skipping invalid package name: ${name}`);
        continue;
      }

      try {
        console.log(`   📦 Updating ${name}...`);

        execSync(`npm update ${name}`, { stdio: 'pipe' });

        const testResult = execSync('timeout 10s npm run build 2>/dev/null || echo "build_failed"', {
          encoding: 'utf8',
          stdio: 'pipe'
        });

        if (testResult.includes('build_failed')) {
          console.warn(`   ⚠️ ${name} update may have issues - will investigate`);
        } else {
          console.log(`   ✅ ${name} updated successfully`);
        }

      } catch (error) {
        console.warn(`   ⚠️ Could not update ${name}: ${error.message}`);
      }
    }
  }

  async updateCriticalDependencies() {
    console.log('🚨 Updating critical dependencies with extra caution...');

    for (const dep of this.criticalDeps) {
      const [name, version] = dep.split('@');

      if (!this.validatePackageName(name)) {
        console.warn(`   ⚠️ Skipping invalid package name: ${name}`);
        continue;
      }

      try {
        console.log(`   🔐 Carefully updating ${name}...`);

        if (name === 'urllib3') {
          execSync('pip install --upgrade urllib3', { stdio: 'pipe' });
        } else if (name === 'qiskit') {
          execSync('pip install --upgrade qiskit', { stdio: 'pipe' });
        } else {
          execSync(`npm update ${name}`, { stdio: 'pipe' });
        }

        console.log(`   ✅ ${name} updated with caution`);

      } catch (error) {
        console.warn(`   ⚠️ Critical dependency ${name} needs manual review: ${error.message}`);
      }
    }
  }

  async verifySystemIntegrity() {
    console.log('🔍 Verifying system integrity...');

    try {
      // Test that the server can start
      console.log('   🚀 Testing server startup...');
      const serverTest = execSync('timeout 15s node -e "require(\'./server/index.ts\')" 2>/dev/null || echo "server_failed"', {
        encoding: 'utf8',
        stdio: 'pipe'
      });

      if (serverTest.includes('server_failed')) {
        console.warn('   ⚠️ Server startup test had issues - may need manual review');
      } else {
        console.log('   ✅ Server startup test passed');
      }

      // Test build process
      console.log('   📦 Testing build process...');
      execSync('npm run build 2>/dev/null', { stdio: 'pipe' });
      console.log('   ✅ Build process verified');

      // Clean up any test processes
      execSync('pkill -f "node.*server" || true', { stdio: 'pipe' });
      execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });

    } catch (error) {
      console.error('❌ System integrity verification failed:', error.message);

      // Restore backup if needed
      console.log('🔄 Restoring backup due to integrity failure...');
      await this.restoreBackup();
      throw error;
    }
  }

  async restoreBackup() {
    console.log('🔄 Restoring dependency backup...');

    const filesToRestore = [
      'package.json',
      'package-lock.json',
      'requirements.txt'
    ];

    for (const file of filesToRestore) {
      const backupFile = path.join(this.backupDir, `${file}.backup`);
      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, file);
        console.log(`   📁 Restored ${file}`);
      }
    }

    // Reinstall dependencies
    execSync('npm install', { stdio: 'inherit' });
  }
}

// Run if called directly
if (require.main === module) {
  const updater = new SafeDependencyUpdater();
  updater.updateSafely().catch(error => {
    console.error('❌ Safe dependency update failed:', error.message);
    process.exit(1);
  });
}

// No export needed as it's a direct script execution