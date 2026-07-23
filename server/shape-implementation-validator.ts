#!/usr/bin/env tsx
/**
 * SHAPE IMPLEMENTATION VALIDATOR
 * Ensures all registered shapes have mathematical implementations
 * Prevents the sphere placeholder problem from recurring
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';

export class ShapeImplementationValidator {
  private errors: string[] = [];
  private warnings: string[] = [];
  
  async validateAllShapes(): Promise<{success: boolean; errors: string[]; warnings: string[]}> {
    console.log('🔍 Validating shape implementations...');
    
    try {
      // Step 1: Load all registered shapes
      const registeredShapes = await this.loadRegisteredShapes();
      console.log(`📋 Found ${registeredShapes.size} registered shapes`);
      
      // Step 2: Load all implemented shapes
      const implementedShapes = await this.loadImplementedShapes();
      console.log(`⚙️ Found ${implementedShapes.size} implemented shapes`);
      
      // Step 3: Cross-validate
      await this.crossValidate(registeredShapes, implementedShapes);
      
      // Step 4: Validate implementation quality
      await this.validateImplementationQuality(implementedShapes);
      
      const success = this.errors.length === 0;
      
      if (success) {
        console.log('✅ All shape implementations are valid');
      } else {
        console.log(`❌ Found ${this.errors.length} critical errors`);
        this.errors.forEach(error => console.log(`   • ${error}`));
      }
      
      if (this.warnings.length > 0) {
        console.log(`⚠️ Found ${this.warnings.length} warnings`);
        this.warnings.forEach(warning => console.log(`   • ${warning}`));
      }
      
      return {
        success,
        errors: this.errors,
        warnings: this.warnings
      };
      
    } catch (error) {
      this.errors.push(`Validation failed: ${error}`);
      return {
        success: false,
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }
  
  private async loadRegisteredShapes(): Promise<Set<string>> {
    const shapes = new Set<string>();
    
    try {
      const categoriesPath = resolve('./client/src/lib/shapeCategories.ts');
      const content = await fs.readFile(categoriesPath, 'utf-8');
      
      // Extract shape arrays from categories
      const shapeArrayMatches = content.match(/shapes:\s*\[([\s\S]*?)\]/g);
      
      if (shapeArrayMatches) {
        shapeArrayMatches.forEach(match => {
          // Extract individual shape strings
          const shapeStrings = match.match(/"([^"]+)"/g);
          if (shapeStrings) {
            shapeStrings.forEach(shapeString => {
              const shapeName = shapeString.replace(/"/g, '');
              if (this.isValidShapeName(shapeName)) {
                shapes.add(shapeName);
              }
            });
          }
        });
      }
      
    } catch (error) {
      this.errors.push(`Failed to load registered shapes: ${error}`);
    }
    
    return shapes;
  }
  
  private async loadImplementedShapes(): Promise<Set<string>> {
    const shapes = new Set<string>();
    
    try {
      const unifiedShapesPath = resolve('./client/src/lib/unifiedShapes.ts');
      const content = await fs.readFile(unifiedShapesPath, 'utf-8');
      
      // Extract shape object keys
      const shapeMatches = content.match(/(\w+):\s*{[\s\S]*?equation:\s*\(/g);
      
      if (shapeMatches) {
        shapeMatches.forEach(match => {
          const shapeName = match.split(':')[0].trim();
          if (this.isValidShapeName(shapeName)) {
            shapes.add(shapeName);
          }
        });
      }
      
    } catch (error) {
      this.errors.push(`Failed to load implemented shapes: ${error}`);
    }
    
    return shapes;
  }
  
  private async crossValidate(registered: Set<string>, implemented: Set<string>): Promise<void> {
    // Find missing implementations
    const missingImplementations: string[] = [];
    registered.forEach(shape => {
      if (!implemented.has(shape)) {
        missingImplementations.push(shape);
      }
    });
    
    // Find orphaned implementations
    const orphanedImplementations: string[] = [];
    implemented.forEach(shape => {
      if (!registered.has(shape)) {
        orphanedImplementations.push(shape);
      }
    });
    
    // Report missing implementations as errors
    if (missingImplementations.length > 0) {
      this.errors.push(`${missingImplementations.length} shapes are registered but not implemented:`);
      missingImplementations.slice(0, 10).forEach(shape => {
        this.errors.push(`  - ${shape} (will render as sphere placeholder)`);
      });
      if (missingImplementations.length > 10) {
        this.errors.push(`  - ... and ${missingImplementations.length - 10} more`);
      }
    }
    
    // Report orphaned implementations as warnings
    if (orphanedImplementations.length > 0) {
      this.warnings.push(`${orphanedImplementations.length} shapes are implemented but not registered in categories`);
      orphanedImplementations.slice(0, 5).forEach(shape => {
        this.warnings.push(`  - ${shape} (hidden from UI)`);
      });
      if (orphanedImplementations.length > 5) {
        this.warnings.push(`  - ... and ${orphanedImplementations.length - 5} more`);
      }
    }
  }
  
  private async validateImplementationQuality(implemented: Set<string>): Promise<void> {
    try {
      const unifiedShapesPath = resolve('./client/src/lib/unifiedShapes.ts');
      const content = await fs.readFile(unifiedShapesPath, 'utf-8');
      
      // Check for common implementation issues
      implemented.forEach(shapeName => {
        const shapeRegex = new RegExp(`${shapeName}:\\s*{[\\s\\S]*?}(?=,\\s*\\w+:|$)`);
        const shapeMatch = content.match(shapeRegex);
        
        if (shapeMatch) {
          const shapeCode = shapeMatch[0];
          
          // Check if equation exists
          if (!shapeCode.includes('equation:')) {
            this.errors.push(`${shapeName}: Missing equation property`);
          }
          
          // Check if defaultParams exists
          if (!shapeCode.includes('defaultParams:')) {
            this.warnings.push(`${shapeName}: Missing defaultParams (will use fallback defaults)`);
          }
          
          // Check for potential NaN/Infinity issues
          if (shapeCode.includes('Math.sqrt') && !shapeCode.includes('Math.abs')) {
            this.warnings.push(`${shapeName}: Math.sqrt without Math.abs may cause NaN values`);
          }
          
          // Check for division without zero checks
          if (shapeCode.includes('/ ') && !shapeCode.includes('|| 1')) {
            this.warnings.push(`${shapeName}: Division operations should include zero protection`);
          }
        }
      });
      
    } catch (error) {
      this.warnings.push(`Could not validate implementation quality: ${error}`);
    }
  }
  
  private isValidShapeName(name: string): boolean {
    return name.length > 2 && 
           name.includes('_') && 
           !name.includes(' ') && 
           !/^[A-Z_]+$/.test(name) && // Not all caps (likely a constant)
           !name.startsWith('use') && // Not a React hook
           !name.startsWith('get'); // Not a utility function
  }
  
  async generateFixScript(): Promise<void> {
    if (this.errors.length === 0) return;
    
    const fixScript = `#!/usr/bin/env node
/**
 * AUTO-GENERATED FIX SCRIPT
 * Addresses missing shape implementations
 */

const { MissingShapeDetector } = require('./missing-shape-detector');

async function fixMissingShapes() {
  console.log('🔧 Applying fixes for missing shape implementations...');
  
  const detector = new MissingShapeDetector();
  await detector.scanAllSources();
  await detector.generateImplementationFile();
  
  console.log('✅ Fix script completed');
  console.log('Next steps:');
  console.log('1. Review generated implementations in missing-implementations.ts');
  console.log('2. Merge approved implementations into unifiedShapes.ts');
  console.log('3. Run validation again to confirm fixes');
}

fixMissingShapes().catch(console.error);
`;
    
    await fs.writeFile('./fix-missing-shapes.js', fixScript);
    console.log('🔧 Generated automatic fix script: fix-missing-shapes.js');
  }
}

// CLI execution
if (require.main === module) {
  (async () => {
    const validator = new ShapeImplementationValidator();
    const result = await validator.validateAllShapes();
    
    if (!result.success) {
      await validator.generateFixScript();
      process.exit(1);
    }
  })();
}

export { ShapeImplementationValidator };
