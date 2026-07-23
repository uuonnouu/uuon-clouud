/**
 * Build Optimization Script
 * Prepares the application for lightweight deployment
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const LARGE_DEPENDENCIES = [
  '@xenova/transformers',
  'onnxruntime-web',
  'onnxruntime-node',
  '@mediapipe/tasks-vision'
];

async function optimizeForDeployment() {
  console.log('🚀 Starting deployment optimization...');

  // 1. Create production package.json without heavy deps
  await createProductionPackageJson();
  
  // 2. Build with optimizations
  await buildForProduction();
  
  // 3. Clean up build artifacts
  await cleanBuildArtifacts();
  
  console.log('✅ Build optimization complete!');
  console.log('📦 Container size should now be under 2GB');
}

async function createProductionPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  // Remove heavy dependencies for production build
  LARGE_DEPENDENCIES.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`🗑️ Removing ${dep} from production build`);
      delete packageJson.dependencies[dep];
    }
    if (packageJson.optionalDependencies && packageJson.optionalDependencies[dep]) {
      delete packageJson.optionalDependencies[dep];
    }
  });

  // Save production package.json
  fs.writeFileSync('package.production.json', JSON.stringify(packageJson, null, 2));
  console.log('📦 Created optimized package.production.json');
}

async function buildForProduction() {
  console.log('🔨 Building for production...');
  
  // Set production environment variables
  process.env.NODE_ENV = 'production';
  process.env.VITE_OPTIMIZE_BUNDLE = 'true';
  
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Production build complete');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

async function cleanBuildArtifacts() {
  const pathsToClean = [
    'dist/**/*.map',
    'dist/assets/*.map',
    'dist/client/**/*.map',
    'node_modules/.cache',
    '.vite'
  ];

  pathsToClean.forEach(pattern => {
    try {
      execSync(`rm -rf ${pattern}`, { stdio: 'pipe' });
    } catch (error) {
      // Ignore errors for non-existent paths
    }
  });

  console.log('🧹 Cleaned build artifacts');
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeForDeployment().catch(console.error);
}
