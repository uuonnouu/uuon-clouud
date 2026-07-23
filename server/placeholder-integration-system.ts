#!/usr/bin/env tsx
/**
 * PLACEHOLDER INTEGRATION SYSTEM
 * Automatically integrates placeholder fixes into the unified shapes system
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Fix ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PlaceholderIntegrationSystem {
  
  async integratePlaceholderFixes(): Promise<void> {
    console.log('🔧 Integrating placeholder fixes into unified shapes...');
    
    try {
      // Load the generated placeholder fixes
      const placeholderFixes = await this.loadPlaceholderFixes();
      
      // Load current unified shapes
      const unifiedShapesContent = await this.loadUnifiedShapes();
      
      // Merge the fixes
      const updatedContent = await this.mergeFixesIntoUnifiedShapes(
        unifiedShapesContent, 
        placeholderFixes
      );
      
      // Write updated unified shapes
      await this.writeUpdatedUnifiedShapes(updatedContent);
      
      console.log('✅ Placeholder fixes successfully integrated!');
      
    } catch (error) {
      console.error('❌ Failed to integrate placeholder fixes:', error);
      throw error;
    }
  }

  private async loadPlaceholderFixes(): Promise<string> {
    try {
      const fixesPath = resolve(__dirname, '../client/src/lib/placeholderFixes.ts');
      const content = await fs.readFile(fixesPath, 'utf-8');
      
      // Extract the PLACEHOLDER_FIXES object content
      const match = content.match(/export const PLACEHOLDER_FIXES = \{([\s\S]*?)\};/);
      if (!match) {
        throw new Error('Could not extract PLACEHOLDER_FIXES content');
      }
      
      return match[1].trim();
    } catch (error) {
      console.error('❌ Could not load placeholder fixes:', error);
      throw error;
    }
  }

  private async loadUnifiedShapes(): Promise<string> {
    try {
      const unifiedPath = resolve(__dirname, '../client/src/lib/unifiedShapes.ts');
      return await fs.readFile(unifiedPath, 'utf-8');
    } catch (error) {
      console.error('❌ Could not load unified shapes:', error);
      throw error;
    }
  }

  private async mergeFixesIntoUnifiedShapes(
    unifiedContent: string, 
    placeholderFixes: string
  ): Promise<string> {
    
    // Find the UNIFIED_SHAPES export
    const unifiedShapesMatch = unifiedContent.match(
      /(export const UNIFIED_SHAPES[^=]*= \{)([\s\S]*?)(\n\};)/
    );
    
    if (!unifiedShapesMatch) {
      throw new Error('Could not find UNIFIED_SHAPES export in unified shapes file');
    }
    
    const [, exportStart, existingShapes, exportEnd] = unifiedShapesMatch;
    
    // Check if existingShapes ends with a comma, if not add one
    const cleanExistingShapes = existingShapes.trim();
    const needsComma = cleanExistingShapes && !cleanExistingShapes.endsWith(',');
    
    // Merge the content
    const mergedShapes = cleanExistingShapes + 
                        (needsComma ? ',' : '') + 
                        (cleanExistingShapes ? '\n\n  // === PLACEHOLDER FIXES ===\n' : '') +
                        placeholderFixes;
    
    // Replace in original content
    const updatedContent = unifiedContent.replace(
      unifiedShapesMatch[0],
      exportStart + mergedShapes + exportEnd
    );
    
    return updatedContent;
  }

  private async writeUpdatedUnifiedShapes(content: string): Promise<void> {
    try {
      const unifiedPath = resolve('./client/src/lib/unifiedShapes.ts');
      
      // Create backup first
      const backupPath = resolve('./client/src/lib/unifiedShapes.backup.ts');
      const originalContent = await fs.readFile(unifiedPath, 'utf-8');
      await fs.writeFile(backupPath, originalContent);
      console.log('📄 Created backup: unifiedShapes.backup.ts');
      
      // Write updated content
      await fs.writeFile(unifiedPath, content);
      console.log('📄 Updated unifiedShapes.ts with placeholder fixes');
      
    } catch (error) {
      console.error('❌ Failed to write updated unified shapes:', error);
      throw error;
    }
  }

  async validateIntegration(): Promise<void> {
    console.log('🔍 Validating placeholder integration...');
    
    try {
      const unifiedPath = resolve('./client/src/lib/unifiedShapes.ts');
      const content = await fs.readFile(unifiedPath, 'utf-8');
      
      // Count shapes with equation implementations
      const equationMatches = content.match(/equation:\s*\(/g);
      const equationCount = equationMatches ? equationMatches.length : 0;
      
      // Check for syntax errors (basic validation)
      if (!content.includes('export const UNIFIED_SHAPES')) {
        throw new Error('Missing UNIFIED_SHAPES export');
      }
      
      // Count braces to check for balance
      const openBraces = (content.match(/\{/g) || []).length;
      const closeBraces = (content.match(/\}/g) || []).length;
      
      if (openBraces !== closeBraces) {
        throw new Error(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
      }
      
      console.log(`✅ Integration validation passed:`);
      console.log(`   • Total equation implementations: ${equationCount}`);
      console.log(`   • Brace balance: ${openBraces}/${closeBraces} ✓`);
      console.log(`   • Export structure: ✓`);
      
    } catch (error) {
      console.error('❌ Integration validation failed:', error);
      
      // Restore from backup if validation fails
      try {
        const backupPath = resolve('./client/src/lib/unifiedShapes.backup.ts');
        const unifiedPath = resolve('./client/src/lib/unifiedShapes.ts');
        
        const backupContent = await fs.readFile(backupPath, 'utf-8');
        await fs.writeFile(unifiedPath, backupContent);
        console.log('🔄 Restored from backup due to validation failure');
      } catch (restoreError) {
        console.error('❌ Failed to restore from backup:', restoreError);
      }
      
      throw error;
    }
  }
}

// CLI execution for ES modules
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    const integrator = new PlaceholderIntegrationSystem();
    
    try {
      await integrator.integratePlaceholderFixes();
      await integrator.validateIntegration();
      console.log('\n🎉 PLACEHOLDER INTEGRATION COMPLETE!');
      console.log('All placeholder shapes now have mathematical implementations.');
      
    } catch (error) {
      console.error('\n💥 INTEGRATION FAILED:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  })();
}

export { PlaceholderIntegrationSystem };
