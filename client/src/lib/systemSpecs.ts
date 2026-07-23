/**
 * Δmension Mathematical Universe - System Specifications
 * Quick Reference Module for Runtime Access
 * 
 * Usage: import { SYSTEM_SPECS, getSystemStatus } from './systemSpecs';
 */

export const SYSTEM_SPECS = {
  version: '2.0.0',
  lastUpdated: '2025-12-08',
  
  // Core Metrics
  metrics: {
    totalShapes: 1995,
    mathematicalEquations: 1586,
    uiDropdownShapes: 1297,
    categories: 114,
    databaseRecords: 398,
    shapeTokens: 369,
    healthScore: 88
  },

  // Parameter System
  parameters: {
    globalTransforms: { keys: ['a', 'b', 'c'], range: [-26, 26], step: 0.01, chaos: 'lowest' },
    foundationalCurves: { keys: ['d', 'e'], range: [-180, 180], step: 0.05, chaos: 'low' },
    surfacesRevolution: { keys: ['f', 'g'], range: [-180, 180], step: 0.05, chaos: 'low' },
    extrusionsSweeps: { keys: ['h', 'i'], range: [-180, 180], step: 0.05, chaos: 'low-medium' },
    loftsInterpolations: { keys: ['j', 'k'], range: [-180, 180], step: 0.02, chaos: 'medium' },
    superquadrics: { keys: ['l', 'm'], range: [-180, 180], step: 0.02, chaos: 'medium-high' },
    minimalSurfaces: { keys: ['n', 'o'], range: [-180, 180], step: 0.02, chaos: 'topological' },
    waveformsHarmonics: { keys: ['p', 'q'], range: [-180, 180], step: 0.02, chaos: 'wave' },
    specialStructures: { keys: ['r', 's'], range: [-180, 180], step: 0.02, chaos: 'topological-twist' },
    phiBasedForms: { keys: ['t', 'u'], range: [-180, 180], step: 0.05, chaos: 'golden-ratio' },
    fractalsNoise: { keys: ['v', 'w'], range: [-180, 180], step: 0.1, chaos: 'high' },
    universalOffsets: { keys: ['x', 'y', 'z'], range: [-10, 10], step: 0.01, chaos: 'post-transform' }
  },

  // Scale Dynamics
  scalePresets: {
    micro: { name: 'Atomic/Quantum', uv: 25, segments: 128 },
    meso: { name: 'Cellular/Biological', uv: 50, segments: 96 },
    macro: { name: 'Planetary/Cosmic', uv: 100, segments: 64 }
  },

  // Feature Flags
  features: {
    higherDimensionalShapes: true,
    voiceControl: true,
    formulaMapping: true,
    patternDiscovery: true,
    crossLearning: true,
    neuralExport: true,
    physicsSimulation: true,
    proceduralMaterials: true
  },

  // Optimizer Status
  optimizers: {
    batchedTracking: { active: true, interval: 2000 },
    requestOptimizer: { active: true, delay: 'configurable' },
    geometryOptimizer: { active: true, cacheLimit: '256MB' },
    preloadManager: { active: true, mode: 'priority-based' },
    smartFlowManager: { active: true, tracking: 'user-patterns' },
    loadBearingOptimizer: { active: true, scaling: 'adaptive' },
    memoryManager: { active: true, interval: 300000, threshold: '1GB' }
  },

  // Shape Libraries Count
  shapeLibraries: {
    unified: 'UNIFIED_SHAPES',
    parametricPack: 120,
    higherDimensional: 25,
    patternCodex: 40,
    fractalIterations: 23,
    iceCrystals: 16,
    theoryOfEverything: 10
  },

  // Fusion Opportunities
  fusionMatrix: [
    { shapeA: 'hopf_fibration', shapeB: 'clifford_torus', compatibility: 92, benefit: 'Linked torus visualization' },
    { shapeA: 'e8_lattice', shapeB: 'calabi_yau', compatibility: 87, benefit: 'String theory completeness' },
    { shapeA: 'tesseract', shapeB: 'penteract', compatibility: 95, benefit: 'Dimensional progression' },
    { shapeA: 'bloch_sphere', shapeB: 'quantum_hall', compatibility: 89, benefit: 'Quantum state visualization' }
  ],

  // Cross-Examination Targets
  crossExamination: [
    { categoryA: 'quantum_computing', categoryB: 'higher_dimensional', overlap: 78 },
    { categoryA: 'sacred_geometry', categoryB: 'phi_based', overlap: 91 },
    { categoryA: 'biological', categoryB: 'protein_structures', overlap: 85 },
    { categoryA: 'fractals', categoryB: 'noise_functions', overlap: 88 }
  ]
} as const;

// Runtime status function
export function getSystemStatus(): {
  healthy: boolean;
  score: number;
  issues: string[];
  ready: boolean;
} {
  const issues: string[] = [];
  
  // Check critical systems
  if (SYSTEM_SPECS.metrics.healthScore < 80) {
    issues.push('Health score below threshold');
  }
  
  return {
    healthy: issues.length === 0,
    score: SYSTEM_SPECS.metrics.healthScore,
    issues,
    ready: SYSTEM_SPECS.metrics.healthScore >= 85
  };
}

// Parameter lookup helper
export function getParameterSpec(key: string): {
  range: [number, number];
  step: number;
  chaos: string;
  group: string;
} | null {
  const keyLower = key.toLowerCase();
  
  for (const [group, spec] of Object.entries(SYSTEM_SPECS.parameters)) {
    if (spec.keys.includes(keyLower)) {
      return {
        range: spec.range as [number, number],
        step: spec.step,
        chaos: spec.chaos,
        group
      };
    }
  }
  return null;
}

// Fusion compatibility check
export function checkFusionCompatibility(shapeA: string, shapeB: string): number {
  const fusion = SYSTEM_SPECS.fusionMatrix.find(
    f => (f.shapeA === shapeA && f.shapeB === shapeB) ||
         (f.shapeA === shapeB && f.shapeB === shapeA)
  );
  return fusion?.compatibility ?? 0;
}

// Export for quick console access — guarded to prevent duplicate assignment
if (typeof window !== 'undefined' && !(window as any).__systemSpecsInit) {
  (window as any).__systemSpecsInit = true;
  (window as any).SYSTEM_SPECS = SYSTEM_SPECS;
  (window as any).getSystemStatus = getSystemStatus;
}
