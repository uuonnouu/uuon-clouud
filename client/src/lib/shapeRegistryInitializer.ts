
import { getAllImplementedShapes, getAllRegisteredShapes } from './shapeRegistryValidator';
import { SHAPE_CATEGORIES } from './shapeCategories';

/**
 * Initialize the shape registry and populate the miscellaneous category
 * This runs once during app startup to ensure all shapes are accessible
 */
export function initializeShapeRegistry(): void {
  console.log('🔧 Initializing shape registry with auto-registration...');
  
  try {
    const implemented = getAllImplementedShapes();
    const registered = getAllRegisteredShapes();
    
    const missingShapes: string[] = [];
    implemented.forEach(shape => {
      if (!registered.has(shape)) {
        missingShapes.push(shape);
      }
    });
    
    if (missingShapes.length > 0) {
      console.log(`🔄 Found ${missingShapes.length} unregistered shapes, adding to miscellaneous category...`);
      
      // Find or create miscellaneous category
      let miscCategory = SHAPE_CATEGORIES.find(cat => cat.id === 'miscellaneous');
      
      if (!miscCategory) {
        // Create new miscellaneous category
        miscCategory = {
          id: 'miscellaneous',
          name: '🔧 Auto-Registered Shapes',
          icon: '🔧',
          description: `System immune response: ${missingShapes.length} shapes auto-registered to prevent dropdown crashes`,
          shapes: []
        };
        SHAPE_CATEGORIES.push(miscCategory);
        console.log('📁 Created new miscellaneous category');
      }
      
      // Clear existing auto-registered shapes and add current missing ones
      miscCategory.shapes = [...missingShapes.sort()];
      miscCategory.description = `System immune response: ${missingShapes.length} shapes auto-registered to prevent dropdown crashes`;
      
      console.log(`✅ Successfully populated miscellaneous category with ${missingShapes.length} shapes`);
      console.log('🛡️ Shape dropdown crash prevention: ACTIVE');
      
      // Log breakdown by category for debugging
      const breakdown = categorizeAutoRegisteredShapes(missingShapes);
      console.log('📊 Auto-registered shapes breakdown:');
      Object.entries(breakdown).forEach(([category, shapes]) => {
        if (shapes.length > 0) {
          console.log(`   • ${category}: ${shapes.length} shapes`);
        }
      });
      
    } else {
      console.log('✅ All shapes properly registered - no auto-registration needed');
    }
    
  } catch (error) {
    console.error('❌ Shape registry initialization failed:', error);
  }
}

/**
 * Categorize auto-registered shapes for better understanding
 */
function categorizeAutoRegisteredShapes(shapes: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    'Quantum Computing': [],
    'Machine Learning': [],
    'Advanced Physics': [],
    'Biological Systems': [],
    'Cryptography': [],
    'Mathematical Functions': [],
    'Other': []
  };
  
  shapes.forEach(shape => {
    if (shape.includes('quantum') || shape.includes('qubit') || shape.includes('entangle')) {
      categories['Quantum Computing'].push(shape);
    } else if (shape.includes('ml_') || shape.includes('neural') || shape.includes('ai_')) {
      categories['Machine Learning'].push(shape);
    } else if (shape.includes('physics_') || shape.includes('relativity') || shape.includes('field_')) {
      categories['Advanced Physics'].push(shape);
    } else if (shape.includes('bio_') || shape.includes('dna_') || shape.includes('protein_')) {
      categories['Biological Systems'].push(shape);
    } else if (shape.includes('crypto_') || shape.includes('hash_') || shape.includes('encrypt')) {
      categories['Cryptography'].push(shape);
    } else if (shape.includes('math_') || shape.includes('equation_') || shape.includes('formula_')) {
      categories['Mathematical Functions'].push(shape);
    } else {
      categories['Other'].push(shape);
    }
  });
  
  return categories;
}

/**
 * Get the current count of auto-registered shapes
 */
export function getAutoRegisteredShapeCount(): number {
  const miscCategory = SHAPE_CATEGORIES.find(cat => cat.id === 'miscellaneous');
  return miscCategory ? miscCategory.shapes.length : 0;
}
