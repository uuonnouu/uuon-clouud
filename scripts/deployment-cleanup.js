
#!/usr/bin/env node

/**
 * DEPLOYMENT CLEANUP SCRIPT
 * Ensures clean state for production deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🔧 Starting deployment cleanup...');

// 1. Kill any existing processes
console.log('🛑 Stopping existing processes...');
try {
  execSync('pkill -f "npm run dev" || true', { stdio: 'pipe' });
  execSync('pkill -f "node.*5000" || true', { stdio: 'pipe' });
  execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
  execSync('lsof -ti:5173 | xargs kill -9 2>/dev/null || true', { stdio: 'pipe' });
} catch (e) {
  // Ignore cleanup errors
}

// 2. Clean build artifacts
console.log('🧹 Cleaning build artifacts...');
const pathsToClean = [
  'dist',
  'node_modules/.cache',
  '.vite',
  'client/dist'
];

pathsToClean.forEach(path => {
  try {
    if (fs.existsSync(path)) {
      execSync(`rm -rf ${path}`, { stdio: 'pipe' });
    }
  } catch (e) {
    // Ignore cleanup errors
  }
});

// 3. Verify critical files exist
console.log('✅ Verifying deployment files...');
const criticalFiles = [
  'package.json',
  'server/index.ts',
  'client/src/App.tsx',
  'shared/schema.ts'
];

const missing = criticalFiles.filter(file => !fs.existsSync(file));
if (missing.length > 0) {
  console.error('❌ Missing critical files:', missing);
  process.exit(1);
}

console.log('✅ Deployment cleanup complete!');
