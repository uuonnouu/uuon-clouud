
const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE MISSING SHAPES SCANNER - Scanning ENTIRE system...\n');

// Scan all possible locations for registered shapes
const SCAN_LOCATIONS = [
  'client/src/systems/shapeCategories.ts',
  'client/src/lib/shapeCategories.ts', 
  'server/seed-369-shapes.ts',
  'server/database-seeder.ts',
  'client/public/proof-navigation.json',
  'client/src/lib/unifiedShapes.ts',
  'client/src/shapes/foundations/unifiedShapes.ts',
  'client/src/lib/parametricSurfaces.ts',
  'shared/schema.ts'
];

// Scan all implementation libraries
const IMPLEMENTATION_LIBRARIES = [
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
  'client/src/lib/topologyKnotsFixed.ts',
  'client/src/lib/hydrogenOrbitals.ts',
  'client/src/lib/generalRelativityShapes.ts',
  'client/src/lib/entropicPrinciples.ts',
  'client/src/lib/setTheoryShapes.ts',
  'client/src/lib/moduloAlgorithmsLibrary.ts',
  'client/src/lib/moduloAlgorithmsLibraryPart2.ts',
  'client/src/lib/unifiedLearningEngine.ts',
  'client/src/shapes/quantum/quantumParametricFunctions.ts',
  'client/src/shapes/foundations/unifiedShapes.ts'
];

// Files created in last 24 hours (check modification time)
const RECENT_FILES = [];

function findRecentFiles(dir, hours = 24) {
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  
  try {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        findRecentFiles(fullPath, hours);
      } else if (stats.mtime.getTime() > cutoff && 
                 (item.endsWith('.ts') || item.endsWith('.js') || item.endsWith('.json'))) {
        RECENT_FILES.push(fullPath);
      }
    });
  } catch (error) {
    // Skip inaccessible directories
  }
}

function extractShapesFromFile(filePath) {
  const shapes = new Set();
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Multiple extraction patterns
    const patterns = [
      /shapes:\s*\[([\s\S]*?)\]/g,                    // shapes: [...]
      /shape_type:\s*['"`]([^'"`]+)['"`]/g,           // shape_type: "..."
      /['"`](\w+)['"`]:\s*\{[\s\S]*?equation:/g,     // "shape": { equation:
      /(\w+):\s*\{[\s\S]*?equation:\s*\(/g,          // shape: { equation: (
      /export\s+const\s+(\w+)\s*=\s*\{/g,            // export const SHAPE = {
      /(\w+_\w+)/g                                    // any underscore pattern
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        let shapeName = match[1];
        if (shapeName && shapeName.length > 3 && 
            shapeName.includes('_') && 
            !shapeName.startsWith('use') &&
            !shapeName.startsWith('get') &&
            !/^[A-Z_]+$/.test(shapeName)) {
          shapes.add(shapeName);
        }
      }
    });
    
    // Extract from arrays
    const arrayMatches = content.match(/\[([\s\S]*?)\]/g);
    if (arrayMatches) {
      arrayMatches.forEach(match => {
        const stringMatches = match.match(/['"`]([^'"`]+)['"`]/g);
        if (stringMatches) {
          stringMatches.forEach(str => {
            const shapeName = str.replace(/['"`]/g, '');
            if (shapeName.length > 3 && shapeName.includes('_')) {
              shapes.add(shapeName);
            }
          });
        }
      });
    }
    
  } catch (error) {
    console.warn(`⚠️ Could not read ${filePath}: ${error.message}`);
  }
  
  return shapes;
}

function extractImplementationsFromFile(filePath) {
  const implementations = new Set();
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Look for actual implementations with equations
    const implementationPatterns = [
      /(\w+):\s*\{[\s\S]*?equation:\s*\(/g,          // shape: { equation: (
      /['"`](\w+)['"`]:\s*\{[\s\S]*?equation:/g,     // "shape": { equation:
      /export\s+const\s+(\w+)\s*=\s*\{[\s\S]*?equation/g  // export const SHAPE = { ... equation
    ];
    
    implementationPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const shapeName = match[1];
        if (shapeName && shapeName.length > 3) {
          implementations.add(shapeName);
        }
      }
    });
    
  } catch (error) {
    // Skip errors
  }
  
  return implementations;
}

async function scanSystem() {
  console.log('📁 Scanning recent files (last 24 hours)...');
  findRecentFiles('.', 24);
  console.log(`Found ${RECENT_FILES.length} recently modified files\n`);
  
  // All registered shapes
  const allRegistered = new Set();
  
  console.log('📋 SCANNING REGISTRATION SOURCES:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  [...SCAN_LOCATIONS, ...RECENT_FILES].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const shapes = extractShapesFromFile(filePath);
      shapes.forEach(shape => allRegistered.add(shape));
      console.log(`📄 ${path.basename(filePath)}: ${shapes.size} shapes found`);
    }
  });
  
  console.log(`\n📊 TOTAL REGISTERED SHAPES: ${allRegistered.size}\n`);
  
  // All implementations
  const allImplementations = new Set();
  
  console.log('⚙️ SCANNING IMPLEMENTATION LIBRARIES:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  [...IMPLEMENTATION_LIBRARIES, ...RECENT_FILES].forEach(filePath => {
    if (fs.existsSync(filePath)) {
      const implementations = extractImplementationsFromFile(filePath);
      implementations.forEach(impl => allImplementations.add(impl));
      console.log(`🔧 ${path.basename(filePath)}: ${implementations.size} implementations found`);
    }
  });
  
  console.log(`\n📊 TOTAL IMPLEMENTATIONS: ${allImplementations.size}\n`);
  
  // Find missing
  const missingFormulas = [];
  allRegistered.forEach(shape => {
    if (!allImplementations.has(shape)) {
      missingFormulas.push(shape);
    }
  });
  
  console.log('❌ SHAPES WITH NO FORMULA IMPLEMENTATIONS:');
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (missingFormulas.length === 0) {
    console.log('🎉 NO MISSING FORMULAS FOUND - All registered shapes have implementations!\n');
  } else {
    console.log(`🚨 FOUND ${missingFormulas.length} SHAPES WITHOUT FORMULAS:\n`);
    
    // Group by category patterns
    const categorized = {
      quantum: [],
      physics: [],
      biology: [],
      topology: [],
      fractals: [],
      medical: [],
      crypto: [],
      ai_ml: [],
      other: []
    };
    
    missingFormulas.forEach(shape => {
      const lower = shape.toLowerCase();
      if (lower.includes('quantum') || lower.includes('qubit')) {
        categorized.quantum.push(shape);
      } else if (lower.includes('einstein') || lower.includes('relativity') || lower.includes('physics')) {
        categorized.physics.push(shape);
      } else if (lower.includes('dna') || lower.includes('protein') || lower.includes('bio')) {
        categorized.biology.push(shape);
      } else if (lower.includes('knot') || lower.includes('topology') || lower.includes('klein')) {
        categorized.topology.push(shape);
      } else if (lower.includes('fractal') || lower.includes('mandel') || lower.includes('julia')) {
        categorized.fractals.push(shape);
      } else if (lower.includes('medical') || lower.includes('tpms') || lower.includes('scaffold')) {
        categorized.medical.push(shape);
      } else if (lower.includes('crypto') || lower.includes('hash') || lower.includes('cipher')) {
        categorized.crypto.push(shape);
      } else if (lower.includes('neural') || lower.includes('learning') || lower.includes('ai')) {
        categorized.ai_ml.push(shape);
      } else {
        categorized.other.push(shape);
      }
    });
    
    Object.entries(categorized).forEach(([category, shapes]) => {
      if (shapes.length > 0) {
        console.log(`🔴 ${category.toUpperCase().replace('_', '/')} (${shapes.length} missing):`);
        shapes.forEach(shape => console.log(`   • ${shape}`));
        console.log('');
      }
    });
  }
  
  // Recent files analysis
  if (RECENT_FILES.length > 0) {
    console.log('🕐 RECENTLY MODIFIED FILES (Last 24 Hours):');
    console.log('═══════════════════════════════════════════════════════\n');
    RECENT_FILES.forEach(file => {
      const stats = fs.statSync(file);
      console.log(`📄 ${file} (modified: ${stats.mtime.toLocaleString()})`);
    });
  }
  
  return {
    totalRegistered: allRegistered.size,
    totalImplemented: allImplementations.size,
    missingCount: missingFormulas.length,
    missingShapes: missingFormulas,
    recentFiles: RECENT_FILES
  };
}

// Run the scan
scanSystem()
  .then(results => {
    console.log('\n✅ COMPREHENSIVE SCAN COMPLETE!');
    console.log(`📊 Summary: ${results.missingCount}/${results.totalRegistered} shapes missing formulas`);
    
    if (results.missingCount > 0) {
      console.log('\n🔧 Next steps:');
      console.log('1. Review the missing shapes list above');
      console.log('2. Implement formulas for high-priority shapes');
      console.log('3. Run validation after implementation');
    }
  })
  .catch(error => {
    console.error('❌ Scan failed:', error);
    process.exit(1);
  });
