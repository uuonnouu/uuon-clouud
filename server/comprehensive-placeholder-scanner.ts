#!/usr/bin/env tsx
/**
 * COMPREHENSIVE PLACEHOLDER SCANNER
 * Detects all shapes using sphere/cube placeholders and prepares for mass insertion
 */

import { promises as fs } from 'fs';
import { resolve } from 'path';

interface PlaceholderShape {
  id: string;
  category: string;
  displayName: string;
  placeholderType: 'sphere' | 'cube' | 'unknown';
  foundIn: string[];
  priority: number;
  readyForInsertion: boolean;
}

export class ComprehensivePlaceholderScanner {
  private placeholderShapes: Map<string, PlaceholderShape> = new Map();
  private registeredShapes = new Set<string>();
  private implementedShapes = new Set<string>();

  async scanAllPlaceholders(): Promise<PlaceholderShape[]> {
    console.log('🔍 COMPREHENSIVE PLACEHOLDER SCAN INITIATED...');
    
    // Load all registered shapes from categories
    await this.loadRegisteredShapes();
    
    // Load implemented shapes from all libraries
    await this.loadImplementedShapes();
    
    // Cross-reference to find placeholders
    await this.identifyPlaceholders();
    
    // Prepare for mass insertion
    await this.prepareForInsertion();
    
    const results = Array.from(this.placeholderShapes.values());
    console.log(`📊 SCAN COMPLETE: Found ${results.length} shapes using placeholders`);
    
    return results;
  }

  private async loadRegisteredShapes(): Promise<void> {
    console.log('📋 Loading registered shapes from categories...');
    
    try {
      const categoriesPath = resolve(__dirname, '../client/src/lib/shapeCategories.ts');
      const categoriesContent = await fs.readFile(categoriesPath, 'utf-8');
      
      // Extract all shape arrays from categories
      const shapeArrayMatches = categoriesContent.match(/shapes:\s*\[([\s\S]*?)\]/g);
      
      if (shapeArrayMatches) {
        shapeArrayMatches.forEach(match => {
          const shapeStrings = match.match(/'([^']+)'/g);
          if (shapeStrings) {
            shapeStrings.forEach(shapeString => {
              const shapeName = shapeString.replace(/'/g, '');
              if (this.isValidShapeName(shapeName)) {
                this.registeredShapes.add(shapeName);
              }
            });
          }
        });
      }
      
      console.log(`✅ Found ${this.registeredShapes.size} registered shapes`);
    } catch (error) {
      console.error('❌ Failed to load registered shapes:', error);
    }
  }

  private async loadImplementedShapes(): Promise<void> {
    console.log('🔧 Loading implemented shapes from libraries...');
    
    const shapeLibraries = [
      'client/src/lib/unifiedShapes.ts',
      'client/src/lib/advancedPhysicsEquations.ts',
      'client/src/lib/quantumParametricFunctions.ts',
      'client/src/lib/quantumComputingFormulas.ts',
      'client/src/lib/biologicalShapeImplementations.ts',
      'client/src/lib/astrophysicalPhenomena.ts',
      'client/src/lib/fractalAnalysisShapes.ts',
      'client/src/lib/crystallographyShapes.ts',
      'client/src/lib/topologyKnotsFixed.ts',
      'client/src/lib/fourDimensionalShapes.ts',
      'client/src/lib/hydrogenOrbitals.ts',
      'client/src/lib/mathematicalConstants.ts',
      'client/src/lib/cleanMathEngine.ts'
    ];
    
    for (const libPath of shapeLibraries) {
      if (await this.fileExists(libPath)) {
        try {
          const content = await fs.readFile(libPath, 'utf-8');
          await this.extractImplementedShapes(content, libPath);
        } catch (error) {
          console.warn(`⚠️ Could not read ${libPath}: ${error}`);
        }
      }
    }
    
    console.log(`✅ Found ${this.implementedShapes.size} implemented shapes`);
  }

  private async extractImplementedShapes(content: string, filePath: string): Promise<void> {
    const patterns = [
      /(\w+):\s*\{[\s\S]*?equation:\s*\(/g,          // shape: { equation: (
      /['"`](\w+)['"`]:\s*\{[\s\S]*?equation:/g,     // "shape": { equation:
      /export\s+const\s+(\w+)\s*=\s*\{[\s\S]*?equation/g  // export const SHAPE = { ... equation
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const shapeName = match[1];
        if (shapeName && this.isValidShapeName(shapeName)) {
          this.implementedShapes.add(shapeName);
        }
      }
    });
  }

  private async identifyPlaceholders(): Promise<void> {
    console.log('🎯 Identifying shapes using placeholders...');
    
    this.registeredShapes.forEach(shapeId => {
      if (!this.implementedShapes.has(shapeId)) {
        const placeholderShape: PlaceholderShape = {
          id: shapeId,
          category: this.getCategoryForShape(shapeId),
          displayName: this.getDisplayName(shapeId),
          placeholderType: this.detectPlaceholderType(shapeId),
          foundIn: ['categories'],
          priority: this.getPriorityLevel(shapeId),
          readyForInsertion: true
        };
        
        this.placeholderShapes.set(shapeId, placeholderShape);
      }
    });
  }

  private async prepareForInsertion(): Promise<void> {
    console.log('🚀 Preparing shapes for mass insertion...');
    
    // Sort by priority and group by type
    const sortedShapes = Array.from(this.placeholderShapes.values())
      .sort((a, b) => b.priority - a.priority);
    
    // Mark high-priority shapes as ready
    sortedShapes.forEach((shape, index) => {
      shape.readyForInsertion = index < 100; // Top 100 priority shapes
    });
    
    console.log(`📋 ${sortedShapes.filter(s => s.readyForInsertion).length} shapes ready for insertion`);
  }

  private detectPlaceholderType(shapeId: string): 'sphere' | 'cube' | 'unknown' {
    const shapeLower = shapeId.toLowerCase();
    
    // Sphere placeholder indicators
    if (shapeLower.includes('sphere') || shapeLower.includes('ball') || 
        shapeLower.includes('orbital') || shapeLower.includes('atom') ||
        shapeLower.includes('bubble') || shapeLower.includes('droplet') ||
        shapeLower.includes('round') || shapeLower.includes('circular')) {
      return 'sphere';
    }
    
    // Cube placeholder indicators
    if (shapeLower.includes('cube') || shapeLower.includes('box') || 
        shapeLower.includes('crystal') || shapeLower.includes('lattice') ||
        shapeLower.includes('grid') || shapeLower.includes('voxel') ||
        shapeLower.includes('square') || shapeLower.includes('block')) {
      return 'cube';
    }
    
    return 'unknown';
  }

  private getCategoryForShape(shapeId: string): string {
    const shapeLower = shapeId.toLowerCase();
    
    if (shapeLower.includes('quantum') || shapeLower.includes('qubit')) return 'quantum-computing';
    if (shapeLower.includes('dna') || shapeLower.includes('protein') || shapeLower.includes('cell')) return 'biological-systems';
    if (shapeLower.includes('fractal') || shapeLower.includes('mandel') || shapeLower.includes('julia')) return 'fractal-analysis';
    if (shapeLower.includes('topology') || shapeLower.includes('knot') || shapeLower.includes('klein')) return 'topology-differential';
    if (shapeLower.includes('einstein') || shapeLower.includes('relativity') || shapeLower.includes('black_hole')) return 'general-relativity';
    if (shapeLower.includes('crystal') || shapeLower.includes('lattice') || shapeLower.includes('diamond')) return 'crystallography';
    if (shapeLower.includes('chakra') || shapeLower.includes('sacred') || shapeLower.includes('golden')) return 'sacred-geometry';
    if (shapeLower.includes('4d') || shapeLower.includes('tesseract') || shapeLower.includes('hypercube')) return '4d-hyperdimensional';
    
    return 'miscellaneous';
  }

  private getPriorityLevel(shapeId: string): number {
    const shapeLower = shapeId.toLowerCase();
    
    // High priority shapes (commonly searched)
    if (shapeLower.includes('ibm') || shapeLower.includes('quantum_computer')) return 10;
    if (shapeLower.includes('dna') || shapeLower.includes('helix')) return 9;
    if (shapeLower.includes('einstein') || shapeLower.includes('black_hole')) return 8;
    if (shapeLower.includes('mandelbrot') || shapeLower.includes('fractal')) return 7;
    if (shapeLower.includes('tesseract') || shapeLower.includes('4d')) return 6;
    if (shapeLower.includes('sacred') || shapeLower.includes('golden')) return 5;
    if (shapeLower.includes('crystal') || shapeLower.includes('lattice')) return 4;
    if (shapeLower.includes('topology') || shapeLower.includes('knot')) return 3;
    
    return 1; // Default priority
  }

  private getDisplayName(shapeId: string): string {
    return shapeId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private isValidShapeName(name: string): boolean {
    return name.length > 2 && 
           name.includes('_') && 
           !name.includes(' ') && 
           !/^[A-Z_]+$/.test(name) && 
           !name.startsWith('use') && 
           !name.startsWith('get');
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async generateInsertionReport(): Promise<void> {
    const results = await this.scanAllPlaceholders();
    
    const report = {
      timestamp: new Date().toISOString(),
      totalPlaceholders: results.length,
      readyForInsertion: results.filter(s => s.readyForInsertion).length,
      byCategory: this.groupByCategory(results),
      byPlaceholderType: this.groupByPlaceholderType(results),
      highPriorityShapes: results.filter(s => s.priority >= 7),
      shapes: results
    };
    
    await fs.writeFile(
      resolve(__dirname, '../PLACEHOLDER_INSERTION_REPORT.json'), 
      JSON.stringify(report, null, 2)
    );
    
    console.log('\n🎯 PLACEHOLDER INSERTION REPORT:');
    console.log('═══════════════════════════════════════════════');
    console.log(`📊 Total Placeholders: ${report.totalPlaceholders}`);
    console.log(`🚀 Ready for Insertion: ${report.readyForInsertion}`);
    console.log(`⭐ High Priority: ${report.highPriorityShapes.length}`);
    console.log('\n📂 BY CATEGORY:');
    Object.entries(report.byCategory).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
    console.log('\n🔧 BY PLACEHOLDER TYPE:');
    Object.entries(report.byPlaceholderType).forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
    console.log('\n✅ Report saved: PLACEHOLDER_INSERTION_REPORT.json');
  }

  private groupByCategory(shapes: PlaceholderShape[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    shapes.forEach(shape => {
      grouped[shape.category] = (grouped[shape.category] || 0) + 1;
    });
    return grouped;
  }

  private groupByPlaceholderType(shapes: PlaceholderShape[]): Record<string, number> {
    const grouped: Record<string, number> = {};
    shapes.forEach(shape => {
      grouped[shape.placeholderType] = (grouped[shape.placeholderType] || 0) + 1;
    });
    return grouped;
  }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  (async () => {
    try {
      const scanner = new ComprehensivePlaceholderScanner();
      await scanner.generateInsertionReport();
    } catch (error) {
      console.error('❌ Placeholder scanning failed:', error);
      process.exit(1);
    }
  })();
}

export { ComprehensivePlaceholderScanner };
