
#!/usr/bin/env node

/**
 * MISSING SHAPES EXTRACTOR
 * Generates comprehensive list of shapes causing sphere placeholder issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 MISSING SHAPES EXTRACTOR - Analyzing shape registry gaps...\n');

// Import shape categories (simulate the import)
function loadShapeCategories() {
  try {
    const categoriesPath = path.join(__dirname, '../client/src/systems/shapeCategories.ts');
    const categoriesContent = fs.readFileSync(categoriesPath, 'utf8');
    
    // Extract shape names from the file (simplified parsing)
    const shapeMatches = categoriesContent.match(/shapes:\s*\[(.*?)\]/gs);
    const allShapes = [];
    
    if (shapeMatches) {
      shapeMatches.forEach(match => {
        const shapes = match.match(/'([^']+)'/g);
        if (shapes) {
          shapes.forEach(shape => {
            allShapes.push(shape.replace(/'/g, ''));
          });
        }
      });
    }
    
    return [...new Set(allShapes)]; // Remove duplicates
  } catch (error) {
    console.error('❌ Could not load shape categories:', error.message);
    return [];
  }
}

// Check implementation libraries
function checkImplementations() {
  const libPath = path.join(__dirname, '../client/src/lib');
  const implementedShapes = new Set();
  
  try {
    const files = fs.readdirSync(libPath);
    const shapeFiles = files.filter(file => 
      file.includes('Shapes.ts') || 
      file.includes('shapes.ts') ||
      file.includes('Engine.ts') ||
      file.includes('Algorithms.ts')
    );
    
    console.log(`📁 Checking ${shapeFiles.length} implementation files...\n`);
    
    shapeFiles.forEach(file => {
      try {
        const content = fs.readFileSync(path.join(libPath, file), 'utf8');
        
        // Extract exported shape keys
        const exportMatches = content.match(/export\s+const\s+\w+\s*=\s*{([^}]+)}/gs);
        if (exportMatches) {
          exportMatches.forEach(match => {
            const shapeKeys = match.match(/(\w+):/g);
            if (shapeKeys) {
              shapeKeys.forEach(key => {
                implementedShapes.add(key.replace(':', ''));
              });
            }
          });
        }
        
        // Also check object literals
        const objectMatches = content.match(/{\s*(\w+):\s*{/g);
        if (objectMatches) {
          objectMatches.forEach(match => {
            const key = match.match(/{\s*(\w+):/);
            if (key && key[1]) {
              implementedShapes.add(key[1]);
            }
          });
        }
        
      } catch (err) {
        console.warn(`⚠️ Could not process ${file}:`, err.message);
      }
    });
    
  } catch (error) {
    console.error('❌ Could not scan implementation directory:', error.message);
  }
  
  return implementedShapes;
}

// Main analysis
function analyzeShapeGaps() {
  const registeredShapes = loadShapeCategories();
  const implementedShapes = checkImplementations();
  
  console.log(`📊 ANALYSIS RESULTS:`);
  console.log(`   • Registered shapes: ${registeredShapes.length}`);
  console.log(`   • Implemented shapes: ${implementedShapes.size}`);
  
  const missingShapes = registeredShapes.filter(shape => !implementedShapes.has(shape));
  const extraImplementations = [...implementedShapes].filter(shape => !registeredShapes.includes(shape));
  
  console.log(`   • Missing implementations: ${missingShapes.length}`);
  console.log(`   • Extra implementations: ${extraImplementations.length}\n`);
  
  // Categorize missing shapes
  const categorizedMissing = {
    critical: [],
    physics: [],
    mathematics: [],
    biology: [],
    fractals: [],
    quantum: [],
    topology: [],
    basic: [],
    other: []
  };
  
  missingShapes.forEach(shape => {
    const shapeLower = shape.toLowerCase();
    
    if (shapeLower.includes('einstein') || shapeLower.includes('relativity') || 
        shapeLower.includes('schwarzschild') || shapeLower.includes('kerr')) {
      categorizedMissing.critical.push(shape);
    } else if (shapeLower.includes('quantum') || shapeLower.includes('qubit') || 
               shapeLower.includes('entangle')) {
      categorizedMissing.quantum.push(shape);
    } else if (shapeLower.includes('mandel') || shapeLower.includes('fractal') || 
               shapeLower.includes('julia') || shapeLower.includes('chaos')) {
      categorizedMissing.fractals.push(shape);
    } else if (shapeLower.includes('dna') || shapeLower.includes('protein') || 
               shapeLower.includes('cell') || shapeLower.includes('neural')) {
      categorizedMissing.biology.push(shape);
    } else if (shapeLower.includes('knot') || shapeLower.includes('topology') || 
               shapeLower.includes('klein') || shapeLower.includes('mobius')) {
      categorizedMissing.topology.push(shape);
    } else if (shapeLower.includes('sphere') || shapeLower.includes('cube') || 
               shapeLower.includes('pyramid') || shapeLower.includes('prism')) {
      categorizedMissing.basic.push(shape);
    } else if (shapeLower.includes('physics') || shapeLower.includes('field') || 
               shapeLower.includes('wave') || shapeLower.includes('particle')) {
      categorizedMissing.physics.push(shape);
    } else if (shapeLower.includes('math') || shapeLower.includes('equation') || 
               shapeLower.includes('function') || shapeLower.includes('formula')) {
      categorizedMissing.mathematics.push(shape);
    } else {
      categorizedMissing.other.push(shape);
    }
  });
  
  // Generate report
  const report = {
    summary: {
      totalRegistered: registeredShapes.length,
      totalImplemented: implementedShapes.size,
      totalMissing: missingShapes.length,
      percentageMissing: Math.round((missingShapes.length / registeredShapes.length) * 100)
    },
    missingByCategory: categorizedMissing,
    sampleMissing: missingShapes.slice(0, 50), // First 50 for immediate action
    extraImplementations: extraImplementations.slice(0, 20)
  };
  
  // Write detailed report
  fs.writeFileSync(
    path.join(__dirname, '../MISSING_SHAPES_DETAILED_REPORT.json'),
    JSON.stringify(report, null, 2)
  );
  
  console.log('🎯 MISSING SHAPES BY CATEGORY:');
  console.log('══════════════════════════════════════\n');
  
  Object.entries(categorizedMissing).forEach(([category, shapes]) => {
    if (shapes.length > 0) {
      console.log(`📐 ${category.toUpperCase()} (${shapes.length} missing):`);
      shapes.slice(0, 10).forEach(shape => {
        console.log(`   • ${shape}`);
      });
      if (shapes.length > 10) {
        console.log(`   ... and ${shapes.length - 10} more\n`);
      } else {
        console.log('');
      }
    }
  });
  
  console.log('📄 Detailed report saved to: MISSING_SHAPES_DETAILED_REPORT.json');
  console.log('\n✅ Analysis complete - Use this data to prioritize implementations');
  
  return report;
}

// Run the analysis
if (require.main === module) {
  analyzeShapeGaps();
}

module.exports = { analyzeShapeGaps };
