
const fs = require('fs');
const path = require('path');

class AttachedAssetsCleanup {
  constructor() {
    this.ASSETS_DIR = './attached_assets';
    this.cleanupStats = {
      filesRemoved: 0,
      spaceSaved: 0,
      errors: []
    };
  }

  async cleanupMigratedAssets() {
    console.log('🧹 Starting cleanup of migrated attached assets...');
    
    if (!fs.existsSync(this.ASSETS_DIR)) {
      console.log('❌ attached_assets directory not found');
      return;
    }

    // Create backup first
    await this.createBackup();

    const files = fs.readdirSync(this.ASSETS_DIR);
    
    for (const file of files) {
      const filePath = path.join(this.ASSETS_DIR, file);
      
      try {
        const stats = fs.statSync(filePath);
        
        // Skip stub files and essential files
        if (file.endsWith('.stub') || file === '.gitkeep') {
          continue;
        }
        
        // Remove quantum research documents (they're now in database)
        if (this.isQuantumDocument(file)) {
          this.cleanupStats.spaceSaved += stats.size;
          this.cleanupStats.filesRemoved++;
          fs.unlinkSync(filePath);
          console.log(`🗑️ Removed: ${file} (${(stats.size / 1024).toFixed(2)}KB)`);
        }
        
      } catch (error) {
        this.cleanupStats.errors.push(`Failed to process ${file}: ${error.message}`);
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }

    await this.generateCleanupReport();
  }

  isQuantumDocument(filename) {
    const quantumKeywords = [
      'QAOA', 'quantum', 'Nishimori', 'phase-transition',
      'Heisenberg', 'VQE', 'kernel', 'classification',
      'Krylov', 'diagonalization', 'Pasted-Advanced-techniques',
      'Pasted-Ground-state', 'Pasted-Quantum', 'Pasted-Enhance',
      'Pasted-auli-Correlation'
    ];
    
    return quantumKeywords.some(keyword => 
      filename.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  async createBackup() {
    const backupDir = './attached_assets_backup';
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const files = fs.readdirSync(this.ASSETS_DIR);
    
    for (const file of files) {
      if (this.isQuantumDocument(file)) {
        const sourcePath = path.join(this.ASSETS_DIR, file);
        const backupPath = path.join(backupDir, file);
        fs.copyFileSync(sourcePath, backupPath);
      }
    }
    
    console.log(`💾 Created backup in ${backupDir}`);
  }

  async generateCleanupReport() {
    const report = {
      cleanupDate: new Date().toISOString(),
      summary: {
        filesRemoved: this.cleanupStats.filesRemoved,
        spaceSaved: `${(this.cleanupStats.spaceSaved / 1024 / 1024).toFixed(2)}MB`,
        errors: this.cleanupStats.errors.length
      },
      details: {
        errors: this.cleanupStats.errors
      },
      status: this.cleanupStats.errors.length === 0 ? 'SUCCESS' : 'COMPLETED_WITH_ERRORS'
    };

    fs.writeFileSync('attached_assets_cleanup_report.json', JSON.stringify(report, null, 2));
    console.log(`📋 Cleanup report saved: ${report.summary.filesRemoved} files removed, ${report.summary.spaceSaved} saved`);
  }
}

// Execute cleanup if run directly
if (require.main === module) {
  const cleanup = new AttachedAssetsCleanup();
  cleanup.cleanupMigratedAssets().then(() => {
    console.log('🎉 Cleanup completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  });
}

module.exports = { AttachedAssetsCleanup };
