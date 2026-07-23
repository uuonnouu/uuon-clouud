
/**
 * SPECIALIZED EQUATIONS API
 * Access to advanced mathematical equations not in UI dropdown
 * Clean separation from visualization system
 */

import { getAllImplementedShapes, getAllRegisteredShapes } from './shapeRegistryValidator';
import { UNIFIED_SHAPES } from './unifiedShapes';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from '../shapes/quantum/quantumParametricFunctions';
import { BIOLOGICAL_SHAPE_IMPLEMENTATIONS } from './biologicalShapeImplementations';
import type { ParametricSurface } from './unifiedShapes';

export interface SpecializedEquationInfo {
  shapeId: string;
  category: string;
  equation: ParametricSurface['equation'];
  name: string;
  description?: string;
  complexity: 'basic' | 'advanced' | 'expert' | 'research';
  usage: 'api' | 'computational' | 'research' | 'visualization';
}

/**
 * Get all specialized equations (not in UI dropdown)
 */
export function getSpecializedEquations(): SpecializedEquationInfo[] {
  const implemented = getAllImplementedShapes();
  const registered = getAllRegisteredShapes();
  
  const specialized: SpecializedEquationInfo[] = [];
  
  implemented.forEach(shapeId => {
    if (!registered.has(shapeId)) {
      const equation = findEquationById(shapeId);
      if (equation) {
        specialized.push({
          shapeId,
          category: categorizeEquation(shapeId),
          equation: equation.equation,
          name: equation.name || shapeId,
          description: equation.description,
          complexity: assessComplexity(shapeId),
          usage: determineUsage(shapeId)
        });
      }
    }
  });
  
  return specialized;
}

/**
 * Get specialized equations by category
 */
export function getSpecializedEquationsByCategory(category: string): SpecializedEquationInfo[] {
  return getSpecializedEquations().filter(eq => eq.category === category);
}

/**
 * Get equation by ID from specialized libraries
 */
export function getSpecializedEquation(shapeId: string): SpecializedEquationInfo | null {
  const specialized = getSpecializedEquations();
  return specialized.find(eq => eq.shapeId === shapeId) || null;
}

/**
 * List available specialized categories
 */
export function getSpecializedCategories(): { [category: string]: number } {
  const categories: { [key: string]: number } = {};
  
  getSpecializedEquations().forEach(eq => {
    categories[eq.category] = (categories[eq.category] || 0) + 1;
  });
  
  return categories;
}

// Helper functions
function findEquationById(shapeId: string): ParametricSurface | null {
  // Search in all shape libraries
  const allLibraries = [
    UNIFIED_SHAPES,
    ADVANCED_PHYSICS_EQUATIONS,
    QUANTUM_PARAMETRIC_FUNCTIONS,
    BIOLOGICAL_SHAPE_IMPLEMENTATIONS
    // Add other libraries as needed
  ];
  
  for (const library of allLibraries) {
    if (library[shapeId]) {
      return library[shapeId];
    }
  }
  
  return null;
}

function categorizeEquation(shapeId: string): string {
  if (shapeId.includes('quantum') || shapeId.includes('qubit')) return 'Quantum Computing';
  if (shapeId.includes('bio') || shapeId.includes('dna') || shapeId.includes('protein')) return 'Biological Systems';
  if (shapeId.includes('relativity') || shapeId.includes('field')) return 'Advanced Physics';
  if (shapeId.includes('neural') || shapeId.includes('ml_')) return 'Machine Learning';
  if (shapeId.includes('crypto') || shapeId.includes('hash')) return 'Cryptography';
  return 'Mathematical Analysis';
}

function assessComplexity(shapeId: string): 'basic' | 'advanced' | 'expert' | 'research' {
  if (shapeId.includes('research') || shapeId.includes('experimental')) return 'research';
  if (shapeId.includes('quantum') || shapeId.includes('relativity')) return 'expert';
  if (shapeId.includes('advanced') || shapeId.includes('complex')) return 'advanced';
  return 'basic';
}

function determineUsage(shapeId: string): 'api' | 'computational' | 'research' | 'visualization' {
  if (shapeId.includes('research') || shapeId.includes('experimental')) return 'research';
  if (shapeId.includes('compute') || shapeId.includes('algorithm')) return 'computational';
  if (shapeId.includes('visual') || shapeId.includes('display')) return 'visualization';
  return 'api';
}

/**
 * Execute specialized equation with parameters
 */
export function executeSpecializedEquation(
  shapeId: string, 
  u: number, 
  v: number, 
  params: Record<string, number>
): [number, number, number] | null {
  const equation = getSpecializedEquation(shapeId);
  if (!equation) return null;
  
  try {
    return equation.equation(u, v, params);
  } catch (error) {
    console.error(`Error executing specialized equation ${shapeId}:`, error);
    return null;
  }
}

// Export summary
export const SPECIALIZED_EQUATIONS_SUMMARY = {
  getAll: getSpecializedEquations,
  getByCategory: getSpecializedEquationsByCategory,
  getById: getSpecializedEquation,
  getCategories: getSpecializedCategories,
  execute: executeSpecializedEquation
};
