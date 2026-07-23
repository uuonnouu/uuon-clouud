
#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UnusedModuleCleanup {
  constructor() {
    this.removedSize = 0;
    this.removedFiles = 0;
  }

  async cleanupUnusedModules() {
    console.log('🧹 Starting unused module cleanup...');
    
    // Remove heavy attached assets (keeping only essential)
    await this.cleanupAttachedAssets();
    
    // Remove development-only directories
    await this.cleanupDevelopmentAssets();
    
    // Clean up redundant UI components
    await this.cleanupRedundantComponents();
    
    // Optimize public assets
    await this.optimizePublicAssets();
    
    console.log(`✅ Cleanup complete! Removed ${this.removedFiles} files, saved ${(this.removedSize / 1024 / 1024).toFixed(2)}MB`);
  }

  async cleanupAttachedAssets() {
    const attachedAssetsPath = path.join(__dirname, '..', 'attached_assets');
    
    if (fs.existsSync(attachedAssetsPath)) {
      const files = fs.readdirSync(attachedAssetsPath);
      
      // Keep only essential files, remove pasted content
      files.forEach(file => {
        if (file.startsWith('Pasted-') || file.includes('_1')) {
          const filePath = path.join(attachedAssetsPath, file);
          const stats = fs.statSync(filePath);
          this.removedSize += stats.size;
          this.removedFiles++;
          fs.unlinkSync(filePath);
          console.log(`🗑️ Removed: ${file}`);
        }
      });
    }
  }

  async cleanupDevelopmentAssets() {
    const devDirs = ['automation-reports', 'marketing'];
    
    devDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(dirPath)) {
        const stats = this.getDirSize(dirPath);
        this.removedSize += stats.size;
        this.removedFiles += stats.files;
        fs.rmSync(dirPath, { recursive: true });
        console.log(`🗑️ Removed directory: ${dir}`);
      }
    });
  }

  async cleanupRedundantComponents() {
    const redundantComponents = [
      'client/src/components/AuthorshipVerificationPanel.tsx',
      'client/src/components/PayPalCheckoutModal.tsx',
      'client/src/components/SocialMediaContentGenerator.tsx',
      'client/src/components/VideoContentCreator.tsx',
      'client/src/components/ViralWebPresence.tsx'
    ];

    redundantComponents.forEach(component => {
      const componentPath = path.join(__dirname, '..', component);
      if (fs.existsSync(componentPath)) {
        const stats = fs.statSync(componentPath);
        this.removedSize += stats.size;
        this.removedFiles++;
        fs.unlinkSync(componentPath);
        console.log(`🗑️ Removed component: ${path.basename(component)}`);
      }
    });
  }

  async optimizePublicAssets() {
    const publicDirs = ['client/public/models', 'client/public/sounds', 'client/public/textures'];
    
    publicDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        
        // Remove files larger than 1MB
        files.forEach(file => {
          const filePath = path.join(dirPath, file);
          const stats = fs.statSync(filePath);
          
          if (stats.size > 1024 * 1024) { // 1MB limit
            this.removedSize += stats.size;
            this.removedFiles++;
            fs.unlinkSync(filePath);
            console.log(`🗑️ Removed large asset: ${file}`);
          }
        });
      }
    });
  }

  getDirSize(dirPath) {
    let size = 0;
    let files = 0;
    
    const traverse = (currentPath) => {
      const stat = fs.statSync(currentPath);
      if (stat.isDirectory()) {
        const items = fs.readdirSync(currentPath);
        items.forEach(item => traverse(path.join(currentPath, item)));
      } else {
        size += stat.size;
        files++;
      }
    };
    
    traverse(dirPath);
    return { size, files };
  }
}

// Run cleanup
const cleanup = new UnusedModuleCleanup();
cleanup.cleanupUnusedModules().catch(console.error);
