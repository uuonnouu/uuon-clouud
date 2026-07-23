import fs from 'fs';
import path from 'path';
import { databaseMLOptimizer } from './database-ml-optimizer';

const ASSETS_DIR = './attached_assets';
const WATCH_INTERVAL = 5000;

const processedFiles = new Set<string>();

function determineAssetType(extension: string): string {
  const typeMap: { [key: string]: string } = {
    '.txt': 'text',
    '.md': 'markdown',
    '.json': 'json',
    '.png': 'image',
    '.jpg': 'image',
    '.jpeg': 'image',
    '.gif': 'image',
    '.webp': 'image',
    '.obj': '3d_model',
    '.glb': '3d_model',
    '.gltf': '3d_model',
    '.mp3': 'audio',
    '.wav': 'audio',
    '.ogg': 'audio',
    '.pdf': 'document',
    '.csv': 'data',
    '.js': 'code',
    '.ts': 'code',
    '.tsx': 'code'
  };
  return typeMap[extension.toLowerCase()] || 'binary';
}

async function migrateNewAsset(filename: string): Promise<boolean> {
  const filePath = path.join(ASSETS_DIR, filename);
  
  try {
    const stats = fs.statSync(filePath);
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const assetType = determineAssetType(ext);
    const assetName = `auto_${Date.now()}_${filename}`;
    
    await databaseMLOptimizer.storeAsset(assetName, assetType, buffer, {
      originalPath: filePath,
      originalName: filename,
      migrationDate: new Date().toISOString(),
      fileSize: stats.size,
      category: 'attached_assets',
      autoMigrated: true
    });

    fs.unlinkSync(filePath);
    
    console.log(`🔄 Auto-migrated: ${filename} (${(stats.size / 1024).toFixed(1)}KB) → database`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to auto-migrate ${filename}:`, error);
    return false;
  }
}

async function checkForNewAssets(): Promise<void> {
  if (!fs.existsSync(ASSETS_DIR)) {
    return;
  }

  const files = fs.readdirSync(ASSETS_DIR);
  
  for (const file of files) {
    if (!processedFiles.has(file)) {
      const filePath = path.join(ASSETS_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile()) {
        const success = await migrateNewAsset(file);
        if (success) {
          processedFiles.add(file);
        }
      }
    }
  }
}

export function startAutoAssetMigrator(): void {
  console.log('🔄 Auto-asset migrator started - new assets will be moved to database automatically');
  
  checkForNewAssets();
  
  setInterval(checkForNewAssets, WATCH_INTERVAL);
}

export async function migrateAssetImmediately(buffer: Buffer, filename: string, metadata: Record<string, unknown> = {}): Promise<string> {
  const ext = path.extname(filename).toLowerCase();
  const assetType = determineAssetType(ext);
  const assetName = `upload_${Date.now()}_${filename}`;
  
  const checksum = await databaseMLOptimizer.storeAsset(assetName, assetType, buffer, {
    originalName: filename,
    uploadDate: new Date().toISOString(),
    category: 'user_uploads',
    ...metadata
  });

  console.log(`📤 Uploaded and stored: ${filename} → database (checksum: ${checksum.substring(0, 8)}...)`);
  
  return assetName;
}
