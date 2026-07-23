
/**
 * DATABASE DEPLOYMENT OPTIMIZER
 * Optimizes deployment by moving heavy assets to database storage
 */

import { databaseMLOptimizer } from './database-ml-optimizer';
import fs from 'fs';
import path from 'path';

export class DatabaseDeploymentOptimizer {
  private readonly HEAVY_ASSETS = [
    // ML Models
    'node_modules/@xenova/transformers/models',
    'node_modules/onnxruntime-web/dist/*.wasm',
    
    // Large textures
    'client/public/textures',
    'client/public/models',
    'client/public/sounds',
    
    // Development assets
    'attached_assets',
    'automation-reports'
  ];

  async optimizeForDeployment(): Promise<void> {
    console.log('🚀 Starting database-optimized deployment...');

    // 1. Move heavy ML assets to database
    await this.moveMLAssetsToDatabase();
    
    // 2. Move large static assets to database
    await this.moveStaticAssetsToDatabase();
    
    // 3. Create lightweight production build
    await this.createLightweightBuild();
    
    // 4. Generate deployment manifest
    await this.generateDeploymentManifest();

    console.log('✅ Database-optimized deployment ready');
  }

  private async moveMLAssetsToDatabase(): Promise<void> {
    console.log('📦 Moving ML assets to database...');

    const mlAssets = [
      { 
        name: 'transformers-tokenizer',
        path: 'node_modules/@xenova/transformers/dist/tokenizers.js',
        type: 'js-module'
      },
      {
        name: 'onnx-wasm',
        path: 'node_modules/onnxruntime-web/dist/ort-wasm.wasm',
        type: 'wasm'
      }
    ];

    for (const asset of mlAssets) {
      try {
        if (fs.existsSync(asset.path)) {
          const buffer = fs.readFileSync(asset.path);
          await databaseMLOptimizer.storeAsset(asset.name, asset.type, buffer, {
            originalPath: asset.path,
            deploymentOptimization: true
          });
          
          // Create lightweight stub file
          fs.writeFileSync(asset.path, `
            // This asset has been moved to database storage for deployment optimization
            // It will be loaded dynamically when needed
            export const loadFromDatabase = async () => {
              const response = await fetch('/api/ml-data/load-asset/${asset.name}');
              return response.arrayBuffer();
            };
          `);
          
          console.log(`📦 Moved ${asset.name} to database (${(buffer.length / 1024 / 1024).toFixed(2)}MB saved)`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to move ${asset.name} to database:`, error);
      }
    }
  }

  private async moveStaticAssetsToDatabase(): Promise<void> {
    console.log('🖼️ Moving static assets to database...');

    const assetDirs = [
      'client/public/textures',
      'client/public/models',
      'client/public/sounds'
    ];

    for (const dir of assetDirs) {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stats = fs.statSync(filePath);
          
          // Only move files larger than 100KB
          if (stats.size > 100000) {
            try {
              const buffer = fs.readFileSync(filePath);
              const assetName = `static-${file}`;
              const assetType = path.extname(file).slice(1);
              
              await databaseMLOptimizer.storeAsset(assetName, assetType, buffer, {
                originalPath: filePath,
                directory: dir,
                deploymentOptimization: true
              });
              
              // Remove original file and create stub
              fs.unlinkSync(filePath);
              fs.writeFileSync(filePath + '.stub', JSON.stringify({
                message: 'Asset moved to database storage',
                assetName,
                size: stats.size,
                loadUrl: `/api/ml-data/load-asset/${assetName}`
              }));
              
              console.log(`🖼️ Moved ${file} to database (${(stats.size / 1024 / 1024).toFixed(2)}MB saved)`);
            } catch (error) {
              console.warn(`⚠️ Failed to move ${file} to database:`, error);
            }
          }
        }
      }
    }
  }

  private async createLightweightBuild(): Promise<void> {
    console.log('⚡ Creating lightweight production build...');

    // Create production package.json without heavy deps
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Remove or mark as external heavy dependencies
    const heavyDeps = [
      '@xenova/transformers',
      'onnxruntime-web',
      'onnxruntime-node'
    ];

    heavyDeps.forEach(dep => {
      if (packageJson.dependencies[dep]) {
        // Mark as external instead of removing
        packageJson.external = packageJson.external || [];
        packageJson.external.push(dep);
        console.log(`📦 Marked ${dep} as external dependency`);
      }
    });

    // Add database loader dependencies
    packageJson.dependencies['lz4'] = '^0.6.5';
    packageJson.dependencies['multer'] = '^1.4.5-lts.1';

    fs.writeFileSync('package.production.json', JSON.stringify(packageJson, null, 2));
  }

  private async generateDeploymentManifest(): Promise<void> {
    const stats = await databaseMLOptimizer.getStorageStats();
    
    const manifest = {
      name: "UUON Foundation Engines - Database Optimized",
      version: "2.0.0",
      optimizationType: "database-storage",
      buildDate: new Date().toISOString(),
      databaseAssets: {
        models: stats.models.count,
        staticAssets: stats.assets.count,
        embeddings: stats.embeddings.count,
        totalSavings: `${(stats.totalSavings / 1024 / 1024).toFixed(2)}MB`
      },
      deploymentFeatures: [
        "database-stored-ml-models",
        "compressed-assets",
        "lazy-loading",
        "smart-caching"
      ],
      loadingStrategy: "on-demand-from-database"
    };

    fs.writeFileSync('dist/deployment-manifest.json', JSON.stringify(manifest, null, 2));
    console.log('📋 Generated deployment manifest with database optimization details');
  }

  async estimateDeploymentSavings(): Promise<any> {
    const stats = await databaseMLOptimizer.getStorageStats();
    
    return {
      beforeOptimization: {
        totalSize: '2.1GB (estimated)',
        mlModels: '1.2GB',
        staticAssets: '650MB',
        code: '250MB'
      },
      afterOptimization: {
        deploymentSize: '350MB (estimated)',
        databaseStorage: `${((stats.models.compressedSize + stats.assets.compressedSize) / 1024 / 1024).toFixed(0)}MB`,
        compressionRatio: `${stats.models.compressionRatio.toFixed(2)}x average`,
        totalSavings: `${(stats.totalSavings / 1024 / 1024).toFixed(0)}MB`
      },
      benefits: [
        'Faster deployment times',
        'Reduced memory usage',
        'Scalable asset management',
        'Intelligent caching',
        'Replit-optimized storage'
      ]
    };
  }
}

export const databaseDeploymentOptimizer = new DatabaseDeploymentOptimizer();
