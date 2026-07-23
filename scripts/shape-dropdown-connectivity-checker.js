
#!/usr/bin/env node
/**
 * SHAPE DROPDOWN CONNECTIVITY CHECKER
 * Identifies shapes that exist in the system but are not connected to the dropdown UI
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SHAPE DROPDOWN CONNECTIVITY CHECKER - Analyzing UI connections...\n');

// Load shape categories (what appears in dropdown)
function loadShapeCategoriesFromUI() {
  const categoriesPath = path.join(__dirname, '../client/src/systems/shapeCategories.ts');
  const dropdownShapes = new Set();
  
  try {
    const content = fs.readFileSync(categoriesPath, 'utf8');
    
    // Extract shapes from categories
    const shapeArrayMatches = content.match(/shapes:\s*\[([\s\S]*?)\]/g);
    if (shapeArrayMatches) {
      shapeArrayMatches.forEach(match => {
        const shapeMatches = match.match(/'([^']+)'/g);
        if (shapeMatches) {
          shapeMatches.forEach(shape => {
            dropdownShapes.add(shape.replace(/'/g, ''));
          });
        }
      });
    }
    
    console.log(`📋 Dropdown UI Shapes: ${dropdownShapes.size} shapes registered in categories`);
    return dropdownShapes;
  } catch (error) {
    console.error('❌ Could not load shape categories:', error.message);
    return new Set();
  }
}

// Load all implemented shapes from libraries
function loadImplementedShapes() {
  const implementedShapes = new Set();
  
  const shapeLibraries = [
    'client/src/lib/advancedPhysicsEquations.ts',
    'client/src/lib/quantumParametricFunctions.ts', 
    'client/src/lib/quantumComputingFormulas.ts',
    'client/src/lib/quantumGravityEquations.ts',
    'client/src/lib/generalRelativityShapes.ts',
    'client/src/lib/entropicPrinciples.ts',
    'client/src/lib/setTheoryShapes.ts',
    'client/src/lib/biologicalShapeImplementations.ts',
    'client/src/lib/astrophysicalPhenomena.ts',
    'client/src/lib/fractalAnalysisShapes.ts',
    'client/src/lib/crystallographyShapes.ts',
    'client/src/lib/topologyKnotsFixed.ts',
    'client/src/lib/mathematicalConstants.ts',
    'client/src/lib/hydrogenOrbitals.ts',
    'client/src/lib/fourDimensionalShapes.ts',
    'client/src/lib/unifiedShapes.ts',
    'client/src/lib/cleanMathEngine.ts',
    'client/src/lib/parametricSurfacesClean.ts'
  ];
  
  console.log('🔧 SCANNING IMPLEMENTATION LIBRARIES:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  shapeLibraries.forEach(libPath => {
    if (fs.existsSync(libPath)) {
      try {
        const content = fs.readFileSync(libPath, 'utf8');
        
        // Look for actual shape implementations with equations
        const patterns = [
          /(\w+):\s*\{[\s\S]*?equation:\s*\(/g,          // shape: { equation: (
          /['"`](\w+)['"`]:\s*\{[\s\S]*?equation:/g,     // "shape": { equation:
          /export\s+const\s+(\w+)\s*=\s*\{[\s\S]*?equation/g  // export const SHAPE = { ... equation
        ];
        
        let shapeCount = 0;
        patterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            const shapeName = match[1];
            if (shapeName && shapeName.length > 2 && !shapeName.startsWith('get') && !shapeName.startsWith('use')) {
              implementedShapes.add(shapeName);
              shapeCount++;
            }
          }
        });
        
        console.log(`🔧 ${path.basename(libPath)}: ${shapeCount} implementations found`);
      } catch (error) {
        console.warn(`⚠️ Could not read ${libPath}: ${error.message}`);
      }
    }
  });
  
  console.log(`\n📊 TOTAL IMPLEMENTED SHAPES: ${implementedShapes.size}\n`);
  return implementedShapes;
}

// Check database seeded shapes
function loadDatabaseSeededShapes() {
  const seededShapes = new Set();
  
  const dbSeederPath = path.join(__dirname, '../server/seed-369-shapes.ts');
  
  if (fs.existsSync(dbSeederPath)) {
    try {
      const content = fs.readFileSync(dbSeederPath, 'utf8');
      
      // Extract shape_type values
      const shapeTypeMatches = content.match(/shape_type:\s*['"`]([^'"`]+)['"`]/g);
      if (shapeTypeMatches) {
        shapeTypeMatches.forEach(match => {
          const shapeType = match.match(/shape_type:\s*['"`]([^'"`]+)['"`]/);
          if (shapeType && shapeType[1]) {
            seededShapes.add(shapeType[1]);
          }
        });
      }
      
      console.log(`🗄️ Database Seeded Shapes: ${seededShapes.size} shapes in database`);
    } catch (error) {
      console.warn('⚠️ Could not read database seeder:', error.message);
    }
  }
  
  return seededShapes;
}

// Main analysis function
function analyzeDropdownConnectivity() {
  const dropdownShapes = loadShapeCategoriesFromUI();
  const implementedShapes = loadImplementedShapes();
  const seededShapes = loadDatabaseSeededShapes();
  
  console.log('\n🎯 DROPDOWN CONNECTIVITY ANALYSIS:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Find implemented shapes NOT in dropdown
  const missingFromDropdown = [];
  implementedShapes.forEach(shape => {
    if (!dropdownShapes.has(shape)) {
      missingFromDropdown.push(shape);
    }
  });
  
  // Find seeded shapes NOT in dropdown  
  const seededNotInDropdown = [];
  seededShapes.forEach(shape => {
    if (!dropdownShapes.has(shape)) {
      seededNotInDropdown.push(shape);
    }
  });
  
  // Find dropdown shapes WITHOUT implementations
  const dropdownWithoutImpl = [];
  dropdownShapes.forEach(shape => {
    if (!implementedShapes.has(shape)) {
      dropdownWithoutImpl.push(shape);
    }
  });
  
  console.log(`🚨 SHAPES WITH IMPLEMENTATIONS BUT NOT IN DROPDOWN: ${missingFromDropdown.length}`);
  if (missingFromDropdown.length > 0) {
    console.log('   These shapes exist but users can\'t access them:\n');
    
    // Categorize missing shapes
    const categories = {
      ibm_quantum: [],
      physics: [],
      biology: [],
      mathematics: [],
      fractals: [],
      topology: [],
      other: []
    };
    
    missingFromDropdown.forEach(shape => {
      const lower = shape.toLowerCase();
      if (lower.includes('ibm') || lower.includes('quantum_computer') || lower.includes('qiskit')) {
        categories.ibm_quantum.push(shape);
      } else if (lower.includes('einstein') || lower.includes('physics') || lower.includes('relativity')) {
        categories.physics.push(shape);
      } else if (lower.includes('dna') || lower.includes('protein') || lower.includes('cell')) {
        categories.biology.push(shape);
      } else if (lower.includes('math') || lower.includes('equation') || lower.includes('formula')) {
        categories.mathematics.push(shape);
      } else if (lower.includes('fractal') || lower.includes('mandel') || lower.includes('julia')) {
        categories.fractals.push(shape);
      } else if (lower.includes('topology') || lower.includes('knot') || lower.includes('klein')) {
        categories.topology.push(shape);
      } else {
        categories.other.push(shape);
      }
    });
    
    Object.entries(categories).forEach(([category, shapes]) => {
      if (shapes.length > 0) {
        console.log(`   🔴 ${category.toUpperCase()} (${shapes.length} missing):`);
        shapes.slice(0, 15).forEach(shape => {
          console.log(`      • ${shape}`);
        });
        if (shapes.length > 15) {
          console.log(`      ... and ${shapes.length - 15} more`);
        }
        console.log('');
      }
    });
  }
  
  console.log(`🗄️ DATABASE SHAPES NOT IN DROPDOWN: ${seededNotInDropdown.length}`);
  if (seededNotInDropdown.length > 0) {
    console.log('   Database has these shapes but dropdown doesn\'t show them:\n');
    seededNotInDropdown.slice(0, 20).forEach(shape => {
      console.log(`   • ${shape}`);
    });
    if (seededNotInDropdown.length > 20) {
      console.log(`   ... and ${seededNotInDropdown.length - 20} more\n`);
    }
  }
  
  console.log(`💔 DROPDOWN SHAPES WITHOUT IMPLEMENTATIONS: ${dropdownWithoutImpl.length}`);
  if (dropdownWithoutImpl.length > 0) {
    console.log('   These appear in dropdown but fall back to sphere:\n');
    dropdownWithoutImpl.slice(0, 20).forEach(shape => {
      console.log(`   • ${shape}`);
    });
    if (dropdownWithoutImpl.length > 20) {
      console.log(`   ... and ${dropdownWithoutImpl.length - 20} more\n`);
    }
  }
  
  // Generate solutions
  console.log('\n🔧 RECOMMENDED SOLUTIONS:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (missingFromDropdown.length > 0) {
    console.log('1. ADD MISSING SHAPES TO DROPDOWN:');
    console.log('   Update client/src/systems/shapeCategories.ts to include:');
    console.log('   - IBM Quantum shapes (high priority)');
    console.log('   - Advanced physics equations');
    console.log('   - Biological implementations\n');
  }
  
  if (dropdownWithoutImpl.length > 0) {
    console.log('2. IMPLEMENT MISSING FORMULAS:');
    console.log('   Create implementations for dropdown shapes');
    console.log('   Or remove them from categories to avoid sphere fallbacks\n');
  }
  
  if (seededNotInDropdown.length > 0) {
    console.log('3. SYNC DATABASE WITH DROPDOWN:');
    console.log('   Either add database shapes to UI or remove unused database entries\n');
  }
  
  return {
    missingFromDropdown,
    seededNotInDropdown,
    dropdownWithoutImpl,
    totalImplemented: implementedShapes.size,
    totalInDropdown: dropdownShapes.size,
    totalInDatabase: seededShapes.size
  };
}

// Run the analysis
if (require.main === module) {
  const results = analyzeDropdownConnectivity();
  
  console.log('\n✅ ANALYSIS COMPLETE!');
  console.log(`📊 Summary: ${results.missingFromDropdown.length} implemented shapes missing from dropdown`);
  console.log('💡 Focus on IBM Quantum and physics shapes for immediate user impact');
}

module.exports = { analyzeDropdownConnectivity };
