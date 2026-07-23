
import fs from 'fs';
import path from 'path';
import { databaseMLOptimizer } from '../server/database-ml-optimizer';

export class AttachedAssetsMigrator {
  private readonly ASSETS_DIR = './attached_assets';
  private migrationStats = {
    totalFiles: 0,
    successfulMigrations: 0,
    failedMigrations: 0,
    totalSizeSaved: 0,
    errors: [] as string[]
  };

  async migrateAllAssets(): Promise<void> {
    console.log('🚀 Starting migration of attached_assets to database storage...');
    
    if (!fs.existsSync(this.ASSETS_DIR)) {
      console.log('❌ attached_assets directory not found');
      return;
    }

    const files = fs.readdirSync(this.ASSETS_DIR);
    this.migrationStats.totalFiles = files.length;

    console.log(`📊 Found ${files.length} files to migrate`);

    for (const file of files) {
      await this.migrateFile(file);
    }

    await this.generateMigrationReport();
    await this.cleanupOriginalFiles();
  }

  private async migrateFile(filename: string): Promise<void> {
    const filePath = path.join(this.ASSETS_DIR, filename);
    
    try {
      const stats = fs.statSync(filePath);
      const buffer = fs.readFileSync(filePath);
      
      // Determine asset type based on extension
      const ext = path.extname(filename).toLowerCase();
      const assetType = this.determineAssetType(ext);
      
      // Generate unique asset name
      const assetName = `attached_${Date.now()}_${filename}`;
      
      // Store in database
      await databaseMLOptimizer.storeAsset(assetName, assetType, buffer, {
        originalPath: filePath,
        originalName: filename,
        migrationDate: new Date().toISOString(),
        fileSize: stats.size,
        category: 'attached_assets'
      });

      this.migrationStats.successfulMigrations++;
      this.migrationStats.totalSizeSaved += stats.size;
      
      console.log(`✅ Migrated: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);

    } catch (error) {
      this.migrationStats.failedMigrations++;
      const errorMsg = `Failed to migrate ${filename}: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.migrationStats.errors.push(errorMsg);
      console.error(`❌ ${errorMsg}`);
    }
  }

  private determineAssetType(extension: string): string {
    const typeMap: { [key: string]: string } = {
      '.txt': 'text',
      '.md': 'text',
      '.json': 'text',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.obj': '3d_model',
      '.glb': '3d_model',
      '.gltf': '3d_model',
      '.mp3': 'audio',
      '.wav': 'audio',
      '.pdf': 'document'
    };
    
    return typeMap[extension] || 'binary';
  }

  private async generateMigrationReport(): Promise<void> {
    const report = {
      migrationDate: new Date().toISOString(),
      summary: {
        totalFiles: this.migrationStats.totalFiles,
        successful: this.migrationStats.successfulMigrations,
        failed: this.migrationStats.failedMigrations,
        totalSizeSaved: `${(this.migrationStats.totalSizeSaved / 1024 / 1024 / 1024).toFixed(2)}GB`,
        successRate: `${((this.migrationStats.successfulMigrations / this.migrationStats.totalFiles) * 100).toFixed(1)}%`
      },
      errors: this.migrationStats.errors,
      recommendations: [
        'Verify all assets are accessible via API endpoints',
        'Update any hardcoded file paths to use database retrieval',
        'Consider implementing lazy loading for large assets'
      ]
    };

    fs.writeFileSync('attached_assets_migration_report.json', JSON.stringify(report, null, 2));
    console.log('📋 Migration report saved to attached_assets_migration_report.json');
  }

  private async cleanupOriginalFiles(): Promise<void> {
    if (this.migrationStats.successfulMigrations === this.migrationStats.totalFiles) {
      console.log('🧹 All files migrated successfully. Creating cleanup script...');
      
      // Create a backup script instead of directly deleting
      const backupScript = `#!/bin/bash
# Backup script for attached_assets
# Run this after verifying database migration is working correctly

echo "Creating backup of attached_assets..."
tar -czf attached_assets_backup_$(date +%Y%m%d_%H%M%S).tar.gz attached_assets/

echo "Backup created. To remove original files after verification:"
echo "rm -rf attached_assets/"
echo ""
echo "To restore if needed:"
echo "tar -xzf attached_assets_backup_*.tar.gz"
`;

      fs.writeFileSync('backup_and_cleanup.sh', backupScript);
      fs.chmodSync('backup_and_cleanup.sh', 0o755);
      
      console.log('✅ Created backup_and_cleanup.sh - run after verifying migration');
    } else {
      console.log('⚠️  Some files failed to migrate. Manual cleanup required.');
    }
  }
}

// Execute migration if run directly
const isMainModule = import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('migrate-attached-assets.ts');

if (isMainModule) {
  const migrator = new AttachedAssetsMigrator();
  migrator.migrateAllAssets().then(() => {
    console.log('🎉 Migration completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });
}
