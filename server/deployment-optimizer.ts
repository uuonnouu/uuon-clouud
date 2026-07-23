
/**
 * Deployment Size Optimizer
 * Reduces container image size for Cloud Run deployments
 */

import fs from 'fs';
import path from 'path';

class DeploymentOptimizer {
  private excludedPaths = [
    'node_modules/.cache',
    'node_modules/@xenova/transformers/models',
    'node_modules/onnxruntime-web/dist/*.wasm',
    'client/src/lib/biologicalShapeImplementations.ts',
    'attached_assets',
    'automation-reports',
    'legal',
    'marketing'
  ];

  async optimizeForDeployment() {
    console.log('🚀 Starting deployment optimization...');
    
    // Remove unnecessary large files
    await this.cleanLargeAssets();
    
    // Optimize node_modules
    await this.optimizeNodeModules();
    
    // Create lightweight production manifest
    await this.createProductionManifest();
    
    console.log('✅ Deployment optimization complete');
  }

  private async cleanLargeAssets() {
    const largePaths = [
      'client/public/models',
      'client/public/sounds',
      'client/public/textures'
    ];

    for (const dirPath of largePaths) {
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        // Keep only essential files, remove large ones
        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          if (stats.size > 500000) { // 500KB limit
            fs.unlinkSync(filePath);
            console.log(`🗑️ Removed large asset: ${filePath}`);
          }
        });
      }
    }
  }

  private async optimizeNodeModules() {
    // Remove development-only packages from node_modules
    const devPackages = [
      'node_modules/@types',
      'node_modules/typescript',
      'node_modules/vite',
      'node_modules/@vitejs'
    ];

    // Note: In production, these are automatically excluded by npm ci --production
    console.log('📦 Node modules will be optimized by production build');
  }

  private async createProductionManifest() {
    const manifest = {
      name: "UUON Foundation Engines",
      version: "1.0.0",
      optimized: true,
      buildDate: new Date().toISOString(),
      excludedFeatures: [
        "development-assets",
        "large-models",
        "debug-tools"
      ]
    };

    fs.writeFileSync('dist/deployment-manifest.json', JSON.stringify(manifest, null, 2));
  }
}

export { DeploymentOptimizer };
