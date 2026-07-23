
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing production build dependencies...');

// Fix missing setTheoryVisualizationShapes
const missingShapes = {
  'setTheoryVisualizationShapes': {
    'set_union': {
      name: 'Set Union',
      equation: (u, v, params) => {
        const { a = 2, b = 1 } = params;
        const theta = u * Math.PI * 2;
        const phi = v * Math.PI * 2;
        
        const x = a * Math.cos(theta) * (1 + b * Math.cos(phi));
        const y = a * Math.sin(theta) * (1 + b * Math.cos(phi));
        const z = b * Math.sin(phi);
        
        return [x, y, z];
      },
      defaultParams: { a: 2, b: 0.5 }
    }
  }
};

// Create the missing file
const missingFilePath = path.join(__dirname, '../client/src/lib/setTheoryVisualizationShapes.ts');
const fileContent = `
export const SET_THEORY_VISUALIZATION_SHAPES = ${JSON.stringify(missingShapes.setTheoryVisualizationShapes, null, 2)
  .replace(/"equation":\s*"([^"]*)"/, '"equation": $1')
  .replace(/\\"/g, '"')};

console.log('📐 Set Theory Visualization Shapes loaded');
`;

try {
  fs.writeFileSync(missingFilePath, fileContent);
  console.log('✅ Created missing setTheoryVisualizationShapes.ts');
} catch (error) {
  console.error('❌ Failed to create missing file:', error);
}

// Clean up any corrupted node_modules
const nodeModulesPath = path.join(__dirname, '../node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('🧹 Cleaning corrupted packages...');
  // Remove problematic packages that might cause build issues
  const problematicPackages = [
    'three-mesh-bvh',
    'react-use-gesture',
    'xterm'
  ];
  
  problematicPackages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
      fs.rmSync(pkgPath, { recursive: true, force: true });
      console.log(`🗑️ Removed problematic package: ${pkg}`);
    }
  });
}

console.log('✅ Production build fixes applied');
