
#!/usr/bin/env node
/**
 * COMPREHENSIVE REGISTRATION ISSUES DETECTOR
 * Scans all shape libraries and identifies registration problems
 */

const fs = require('fs');
const path = require('path');

async function detectAllRegistrationIssues() {
  console.log('🔍 Comprehensive Registration Issues Analysis...\n');

  // 1. Scan all shape library files
  const shapeLibraries = [
    'client/src/lib/hydrogenOrbitals.ts',
    'client/src/lib/advancedPhysicsEquations.ts',
    'client/src/lib/quantumParametricFunctions.ts',
    'client/src/lib/biologicalShapeImplementations.ts',
    'client/src/lib/astrophysicalPhenomena.ts',
    'client/src/lib/attractorSystems.ts',
    'client/src/lib/chakraShapes.ts',
    'client/src/lib/crystallographyShapes.ts',
    'client/src/lib/dnaStructures.ts',
    'client/src/lib/fractalAnalysisShapes.ts',
    'client/src/lib/mathematicalConstants.ts',
    'client/src/lib/molecularBiologyShapes.ts',
    'client/src/lib/topologyKnotsFixed.ts'
  ];

  const implementedShapes = new Set();
  const shapesByLibrary = {};

  // Scan each library
  for (const libraryPath of shapeLibraries) {
    try {
      const content = fs.readFileSync(libraryPath, 'utf-8');
      const shapes = extractShapesFromLibrary(content, libraryPath);
      shapesByLibrary[libraryPath] = shapes;
      shapes.forEach(shape => implementedShapes.add(shape));
      
      console.log(`📚 ${path.basename(libraryPath)}: ${shapes.length} shapes`);
    } catch (error) {
      console.log(`⚠️ Could not read ${libraryPath}: ${error.message}`);
    }
  }

  // 2. Load registered shapes from categories
  const registeredShapes = new Set();
  try {
    const categoriesContent = fs.readFileSync('client/src/lib/shapeCategories.ts', 'utf-8');
    const registered = extractRegisteredShapes(categoriesContent);
    registered.forEach(shape => registeredShapes.add(shape));
    console.log(`\n📋 Total registered in categories: ${registered.length}`);
  } catch (error) {
    console.log(`❌ Could not read shape categories: ${error.message}`);
  }

  // 3. Load seeded shapes from database schema
  const seededShapes = new Set();
  try {
    const seedContent = fs.readFileSync('server/seed-369-shapes.ts', 'utf-8');
    const seeded = extractSeededShapes(seedContent);
    seeded.forEach(shape => seededShapes.add(shape));
    console.log(`💾 Total seeded in database: ${seeded.length}`);
  } catch (error) {
    console.log(`❌ Could not read seed file: ${error.message}`);
  }

  // 4. Analyze mismatches
  console.log('\n🔍 MISMATCH ANALYSIS:');
  console.log('═══════════════════════════════════════════════════════\n');

  const missingFromCategories = [];
  const missingFromDatabase = [];
  const orphanedInCategories = [];

  implementedShapes.forEach(shape => {
    if (!registeredShapes.has(shape)) {
      missingFromCategories.push(shape);
    }
    if (!seededShapes.has(shape)) {
      missingFromDatabase.push(shape);
    }
  });

  registeredShapes.forEach(shape => {
    if (!implementedShapes.has(shape)) {
      orphanedInCategories.push(shape);
    }
  });

  // 5. Report by library
  console.log('📚 ISSUES BY LIBRARY:');
  console.log('────────────────────────────────────────────────────────\n');

  Object.entries(shapesByLibrary).forEach(([library, shapes]) => {
    const libraryName = path.basename(library, '.ts');
    const unregistered = shapes.filter(shape => !registeredShapes.has(shape));
    const unseeded = shapes.filter(shape => !seededShapes.has(shape));
    
    if (unregistered.length > 0 || unseeded.length > 0) {
      console.log(`❌ ${libraryName}:`);
      console.log(`   • Total shapes: ${shapes.length}`);
      console.log(`   • Missing from categories: ${unregistered.length}`);
      console.log(`   • Missing from database: ${unseeded.length}`);
      
      if (unregistered.length > 0) {
        console.log(`   • Unregistered: ${unregistered.slice(0, 3).join(', ')}${unregistered.length > 3 ? '...' : ''}`);
      }
      console.log();
    }
  });

  // 6. Summary report
  console.log('📊 SUMMARY REPORT:');
  console.log('═══════════════════════════════════════════════════════\n');
  console.log(`Total Implemented Shapes: ${implementedShapes.size}`);
  console.log(`Total Registered in Categories: ${registeredShapes.size}`);
  console.log(`Total Seeded in Database: ${seededShapes.size}`);
  console.log();
  console.log(`❌ Missing from Categories: ${missingFromCategories.length}`);
  console.log(`💾 Missing from Database: ${missingFromDatabase.length}`);
  console.log(`👻 Orphaned in Categories: ${orphanedInCategories.length}`);

  // 7. Critical orbital shapes analysis
  console.log('\n🪐 ORBITAL SHAPES ANALYSIS:');
  console.log('────────────────────────────────────────────────────────\n');
  
  const orbitalShapes = Array.from(implementedShapes).filter(shape => 
    shape.includes('orbital') || shape.includes('hydrogen')
  );
  
  const unregisteredOrbitals = orbitalShapes.filter(shape => !registeredShapes.has(shape));
  const unseededOrbitals = orbitalShapes.filter(shape => !seededShapes.has(shape));
  
  console.log(`Total Orbital Shapes: ${orbitalShapes.length}`);
  console.log(`Unregistered Orbitals: ${unregisteredOrbitals.length}`);
  console.log(`Unseeded Orbitals: ${unseededOrbitals.length}`);
  
  if (unregisteredOrbitals.length > 0) {
    console.log('\nUnregistered orbital shapes:');
    unregisteredOrbitals.forEach(shape => console.log(`   • ${shape}`));
  }

  // Generate fix recommendations
  console.log('\n🔧 FIX RECOMMENDATIONS:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (missingFromCategories.length > 0) {
    console.log('1. Add to shapeCategories.ts:');
    console.log(`   ${missingFromCategories.length} shapes need category registration`);
  }
  
  if (missingFromDatabase.length > 0) {
    console.log('2. Add to seed-369-shapes.ts:');
    console.log(`   ${missingFromDatabase.length} shapes need database seeding`);
  }
  
  if (orphanedInCategories.length > 0) {
    console.log('3. Remove orphaned entries:');
    console.log(`   ${orphanedInCategories.length} registered shapes have no implementation`);
  }

  return {
    implementedShapes: implementedShapes.size,
    registeredShapes: registeredShapes.size,
    seededShapes: seededShapes.size,
    missingFromCategories: missingFromCategories.length,
    missingFromDatabase: missingFromDatabase.length,
    orphanedInCategories: orphanedInCategories.length,
    unregisteredOrbitals: unregisteredOrbitals.length,
    unseededOrbitals: unseededOrbitals.length
  };
}

function extractShapesFromLibrary(content, libraryPath) {
  const shapes = [];
  
  // Match different export patterns
  const exportPatterns = [
    /export const (\w+) = \{/g,                    // export const SHAPE = {
    /(\w+):\s*\{[\s\S]*?equation:/g,               // SHAPE: { equation:
    /['"](\w+)['"]:\s*\{[\s\S]*?equation:/g,       // "SHAPE": { equation:
  ];
  
  exportPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const shapeName = match[1];
      if (shapeName && shapeName.length > 3 && !shapeName.includes('DEFAULT')) {
        shapes.push(shapeName);
      }
    }
  });
  
  return [...new Set(shapes)];
}

function extractRegisteredShapes(content) {
  const shapes = [];
  const shapeArrayMatches = content.match(/shapes:\s*\[([\s\S]*?)\]/g);
  
  if (shapeArrayMatches) {
    shapeArrayMatches.forEach(match => {
      const shapeStrings = match.match(/['"]([\w_]+)['"]/g);
      if (shapeStrings) {
        shapeStrings.forEach(shapeString => {
          const shapeName = shapeString.replace(/['"]/g, '');
          if (shapeName && shapeName.length > 3) {
            shapes.push(shapeName);
          }
        });
      }
    });
  }
  
  return [...new Set(shapes)];
}

function extractSeededShapes(content) {
  const shapes = [];
  const shapeTypeMatches = content.match(/shape_type:\s*['"]([^'"]+)['"]/g);
  
  if (shapeTypeMatches) {
    shapeTypeMatches.forEach(match => {
      const shapeName = match.match(/shape_type:\s*['"]([^'"]+)['"]/)[1];
      if (shapeName && shapeName.length > 3) {
        shapes.push(shapeName);
      }
    });
  }
  
  return [...new Set(shapes)];
}

// Run the analysis
detectAllRegistrationIssues()
  .then(results => {
    console.log('\n✅ Analysis complete!');
    console.log(`Summary: ${results.missingFromCategories + results.missingFromDatabase + results.orphanedInCategories} total issues found`);
  })
  .catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
