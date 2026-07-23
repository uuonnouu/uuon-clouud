/**
 * ╔═══════════════════════════════════════════════════════════════════════════╗
 * ║                    001_MASTER_FORMULA_REGISTRY                            ║
 * ║                                                                           ║
 * ║  ΔMENSION / DMENSION MATHEMATICAL UNIVERSE                               ║
 * ║  Primary Shape & Formula Registry - FIRST IN DATA TREE                   ║
 * ║                                                                           ║
 * ║  This file MUST remain first alphabetically (001_ prefix) to ensure      ║
 * ║  all new formulas pass through this registry before any other lookup.    ║
 * ║                                                                           ║
 * ║  Total Shapes: 2,677+ | Categories: 150+ | Formulas: 2,226+              ║
 * ╚═══════════════════════════════════════════════════════════════════════════╝
 */

import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════════════════
// CORE SHAPE LIBRARIES - Primary Mathematical Implementations
// ═══════════════════════════════════════════════════════════════════════════
import UNIFIED_SHAPES from './unifiedShapes';
import { CLEAN_SURFACES } from './cleanMathEngine';
import { PARAMETRIC_SURFACES } from './parametricSurfacesClean';
import { EDUCATIONAL_SURFACES } from './educationalSurfaces';

// ═══════════════════════════════════════════════════════════════════════════
// PHYSICS & QUANTUM MECHANICS
// ═══════════════════════════════════════════════════════════════════════════
import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';
import { THEORY_OF_EVERYTHING_SHAPES } from './theoryOfEverythingShapes';
import { SCHRODINGER_EQUATIONS } from './schrodingerEquations';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';
import { QUANTUM_COMPUTING_ALGORITHMS } from './quantumComputingAlgorithms';
import { QPU_QUANTUM_COMPUTING_SHAPES } from './qpuQuantumComputingShapes';
import { HYDROGEN_ORBITALS } from './hydrogenOrbitals';
import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { ENTANGLEMENT_ALGORITHMS } from './entanglementAlgorithms';
import { INVERSE_SQUARE_LAW_SHAPES } from './inverseSquareLawShapes';

// ═══════════════════════════════════════════════════════════════════════════
// TOPOLOGY & GEOMETRY
// ═══════════════════════════════════════════════════════════════════════════
import { TOPOLOGY_DIFFERENTIAL_SHAPES } from './topologyDifferentialShapes';
import { ADVANCED_TOPOLOGICAL_SURFACES } from './advancedTopologicalSurfaces';
import { NON_EUCLIDEAN_SHAPES } from './nonEuclideanShapes';
import { NON_EUCLIDEAN_GEOMETRIES } from './nonEuclideanGeometries';
import { RIEMANN_SURFACES } from './riemannSurfaces';
import { FOUR_DIMENSIONAL_SHAPES } from './fourDimensionalShapes';
import { TEMPORAL_GEOMETRY } from './temporalGeometry';
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';

// ═══════════════════════════════════════════════════════════════════════════
// FRACTALS & CHAOS
// ═══════════════════════════════════════════════════════════════════════════
import { MULTIDIMENSIONAL_FRACTALS } from './multidimensionalFractals';
import { FRACTAL_ANALYSIS_SHAPES } from './fractalAnalysisShapes';
import { FRACTAL_SHAPE_IMPLEMENTATIONS } from './fractalShapeImplementations';
import { NOISE_FUNCTIONS } from './noiseFunctions';
import { VORONOI_SYSTEMS } from './voronoiSystems';
import { ATTRACTOR_SYSTEMS } from './attractorSystems';
import { DIFFERENTIAL_GROWTH } from './differentialGrowth';
import { CHAOS_THEORY_SHAPES } from './chaosTheoryShapes';

// ═══════════════════════════════════════════════════════════════════════════
// LIFE SCIENCES & BIOLOGY
// ═══════════════════════════════════════════════════════════════════════════
import { HUMAN_ANATOMY_SHAPES } from './humanAnatomyShapes';
import { DNA_STRUCTURES } from './dnaStructures';
import { PROTEIN_STRUCTURES } from './proteinStructures';
import { POLYMER_CHAINS } from './polymerChains';
import { TISSUE_STRUCTURES } from './tissueStructures';
import { LIFE_SCIENCES_SHAPES } from './lifeSciencesShapes';
import { SPACE_BIOLOGY_SHAPES } from './spaceBiologyShapes';

// ═══════════════════════════════════════════════════════════════════════════
// EARTH & SPACE SCIENCES
// ═══════════════════════════════════════════════════════════════════════════
import { EARTH_SCIENCES_SHAPES } from './earthSciencesShapes';
import { ASTROPHYSICAL_PHENOMENA } from './astrophysicalPhenomena';
import { ASTRONOMICAL_OBJECTS } from './astronomicalObjects';
import { WEATHER_SYSTEMS } from './weatherSystems';

// ═══════════════════════════════════════════════════════════════════════════
// MATHEMATICS & THEORY
// ═══════════════════════════════════════════════════════════════════════════
import { SET_THEORY_SHAPES } from './setTheoryShapes';
import { CATEGORY_THEORY } from './categoryTheory';
import { GROUP_THEORY } from './groupTheory';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';
import { TENSOR_ALGEBRA_SHAPES } from './tensorAlgebraEngine';
import { FIELD_THEORY_SHAPES } from './fieldTheoryEngine';
import { WAVE_ALGORITHMS_SHAPES } from './waveAlgorithmsEngine';

// ═══════════════════════════════════════════════════════════════════════════
// AI & COMPUTING
// ═══════════════════════════════════════════════════════════════════════════
import { AI_ML_ALGORITHMS } from './aiMlAlgorithmsLibrary';
import { GENERATIVE_ALGORITHMS } from './generativeAlgorithms';
import { NEURAL_LATTICE_ALGORITHMS } from './neuralLatticeAlgorithms';
import { HISTORICAL_ALGORITHMS } from './historicalAlgorithms';
import { SEQUENCE_PATTERNS } from './sequencePatterns';
import { MODULO_ALGORITHMS } from './moduloAlgorithms';
import { AI_ML_MODULO, NETWORKING_MODULO, OS_LOWLEVEL_MODULO } from './moduloAlgorithmsPart2';

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALIZED DOMAINS
// ═══════════════════════════════════════════════════════════════════════════
import { SACRED_GEOMETRY } from './sacredGeometry';
import { CHAKRA_SHAPES } from './chakraShapes';
import { FINANCIAL_MATHEMATICS } from './financialMathematics';
import { CONSCIOUSNESS_THEORY } from './consciousnessTheory';
import { ADVANCED_PHYSICS_SIMS } from './advancedPhysicsSims';
import { MECHANICAL_SHAPES } from './mechanicalShapes';
import { REAL_WORLD_OBJECTS } from './realWorldObjects';
import { EXTENDED_CRYSTALS } from './extendedCrystals';
import { ICE_CRYSTAL_SHAPES } from './iceCrystalShapes';

// ═══════════════════════════════════════════════════════════════════════════
// CULTURAL & HISTORICAL
// ═══════════════════════════════════════════════════════════════════════════
import { ANCIENT_CIVILIZATION_SHAPES } from './ancientCivilizationShapes';
import { NATIONAL_MOTTO_ALGORITHMS } from './nationalMottoAlgorithms';
import { UNIFIED_MATH_SYMBOLS } from './unifiedMathSymbols';

// ═══════════════════════════════════════════════════════════════════════════
// EXPANSION & BRIDGE LIBRARIES
// ═══════════════════════════════════════════════════════════════════════════
import { SCIENTIFIC_EXPANSION_SHAPES } from './scientificExpansionShapes';
import { COMPLETE_MISSING_SHAPES } from './completeMissingShapesLibrary';
import { PARAMETRIC_LIBRARY_PACK } from './parametricLibraryPack';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';
import { TEN_PERCENT_SHAPES } from './tenPercentShapes';
import { QUANTUM_GAP_SURFACES } from './quantumGapMathematics';
import { COSMIC_HISTORY_GAPS } from './cosmicHistoryGaps';
import { TIME_TRAVEL_PHYSICS } from './timeTravelPhysics';

// ═══════════════════════════════════════════════════════════════════════════
// SHAPE INTERFACE - Standard for all parametric surfaces
// ═══════════════════════════════════════════════════════════════════════════
export interface ParametricShape {
  name: string;
  category?: string;
  formula?: string;
  description?: string;
  defaultParams?: Record<string, number>;
  generate?: (params: Record<string, number>) => THREE.BufferGeometry;
  equation?: (u: number, v: number, params: Record<string, number>) => number[];
}

// ═══════════════════════════════════════════════════════════════════════════
// MASTER SHAPE REGISTRY - All shapes merged with priority order
// ═══════════════════════════════════════════════════════════════════════════
export const MASTER_SHAPE_REGISTRY: Record<string, any> = {
  // Priority 1: UNIFIED_SHAPES (primary source - 335KB of implementations)
  ...UNIFIED_SHAPES,
  
  // Priority 2: Clean Math Engine (core mathematical surfaces)
  ...CLEAN_SURFACES,
  
  // Priority 3: Parametric Surfaces
  ...PARAMETRIC_SURFACES,
  
  // Priority 4: Educational Surfaces
  ...EDUCATIONAL_SURFACES,
  
  // Priority 5: Physics & Quantum
  ...GENERAL_RELATIVITY_SHAPES,
  ...QUANTUM_GRAVITY_EQUATIONS,
  ...THEORY_OF_EVERYTHING_SHAPES,
  ...SCHRODINGER_EQUATIONS,
  ...ADVANCED_PHYSICS_EQUATIONS,
  ...QUANTUM_PARAMETRIC_FUNCTIONS,
  ...QUANTUM_COMPUTING_ALGORITHMS,
  ...QPU_QUANTUM_COMPUTING_SHAPES,
  ...HYDROGEN_ORBITALS,
  ...ENTROPIC_PRINCIPLES,
  ...ENTANGLEMENT_ALGORITHMS,
  ...INVERSE_SQUARE_LAW_SHAPES,
  
  // Priority 6: Topology & Geometry
  ...TOPOLOGY_DIFFERENTIAL_SHAPES,
  ...ADVANCED_TOPOLOGICAL_SURFACES,
  ...NON_EUCLIDEAN_SHAPES,
  ...NON_EUCLIDEAN_GEOMETRIES,
  ...RIEMANN_SURFACES,
  ...FOUR_DIMENSIONAL_SHAPES,
  ...TEMPORAL_GEOMETRY,
  ...HYPERCOMPUTATION_SURFACES,
  
  // Priority 7: Fractals & Chaos
  ...MULTIDIMENSIONAL_FRACTALS,
  ...FRACTAL_ANALYSIS_SHAPES,
  ...FRACTAL_SHAPE_IMPLEMENTATIONS,
  ...NOISE_FUNCTIONS,
  ...VORONOI_SYSTEMS,
  ...ATTRACTOR_SYSTEMS,
  ...DIFFERENTIAL_GROWTH,
  ...CHAOS_THEORY_SHAPES,
  
  // Priority 8: Life Sciences
  ...HUMAN_ANATOMY_SHAPES,
  ...DNA_STRUCTURES,
  ...PROTEIN_STRUCTURES,
  ...POLYMER_CHAINS,
  ...TISSUE_STRUCTURES,
  ...LIFE_SCIENCES_SHAPES,
  ...SPACE_BIOLOGY_SHAPES,
  
  // Priority 9: Earth & Space
  ...EARTH_SCIENCES_SHAPES,
  ...ASTROPHYSICAL_PHENOMENA,
  ...ASTRONOMICAL_OBJECTS,
  ...WEATHER_SYSTEMS,
  
  // Priority 10: Pure Mathematics
  ...SET_THEORY_SHAPES,
  ...CATEGORY_THEORY,
  ...GROUP_THEORY,
  ...MATHEMATICAL_CONSTANTS,
  ...UNIVERSAL_MATHEMATICS,
  ...TENSOR_ALGEBRA_SHAPES,
  ...FIELD_THEORY_SHAPES,
  ...WAVE_ALGORITHMS_SHAPES,
  
  // Priority 11: AI & Computing
  ...AI_ML_ALGORITHMS,
  ...GENERATIVE_ALGORITHMS,
  ...NEURAL_LATTICE_ALGORITHMS,
  ...HISTORICAL_ALGORITHMS,
  ...SEQUENCE_PATTERNS,
  ...MODULO_ALGORITHMS,
  ...AI_ML_MODULO,
  ...NETWORKING_MODULO,
  ...OS_LOWLEVEL_MODULO,
  
  // Priority 12: Specialized
  ...SACRED_GEOMETRY,
  ...CHAKRA_SHAPES,
  ...FINANCIAL_MATHEMATICS,
  ...CONSCIOUSNESS_THEORY,
  ...ADVANCED_PHYSICS_SIMS,
  ...MECHANICAL_SHAPES,
  ...REAL_WORLD_OBJECTS,
  ...EXTENDED_CRYSTALS,
  ...ICE_CRYSTAL_SHAPES,
  
  // Priority 13: Cultural & Historical
  ...ANCIENT_CIVILIZATION_SHAPES,
  ...NATIONAL_MOTTO_ALGORITHMS,
  ...UNIFIED_MATH_SYMBOLS,
  
  // Priority 14: Expansion Libraries
  ...SCIENTIFIC_EXPANSION_SHAPES,
  ...COMPLETE_MISSING_SHAPES,
  ...PARAMETRIC_LIBRARY_PACK,
  ...EXCLUSIVE_SHAPES,
  ...TEN_PERCENT_SHAPES,
  ...QUANTUM_GAP_SURFACES,
  ...COSMIC_HISTORY_GAPS,
  ...TIME_TRAVEL_PHYSICS,
};

// ═══════════════════════════════════════════════════════════════════════════
// SHAPE LOOKUP FUNCTION - Primary entry point for all shape queries
// ═══════════════════════════════════════════════════════════════════════════
export function lookupShape(shapeName: string): ParametricShape | null {
  const normalized = shapeName.toLowerCase().replace(/\s+/g, '_');
  return MASTER_SHAPE_REGISTRY[normalized] || MASTER_SHAPE_REGISTRY[shapeName] || null;
}

// ═══════════════════════════════════════════════════════════════════════════
// REGISTRY STATISTICS
// ═══════════════════════════════════════════════════════════════════════════
export function getRegistryStats() {
  const shapes = Object.keys(MASTER_SHAPE_REGISTRY);
  const categories = new Set(shapes.map(s => MASTER_SHAPE_REGISTRY[s]?.category || 'Uncategorized'));
  
  return {
    totalShapes: shapes.length,
    totalCategories: categories.size,
    categories: Array.from(categories),
    timestamp: new Date().toISOString()
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATE SHAPE EXISTS
// ═══════════════════════════════════════════════════════════════════════════
export function shapeExists(shapeName: string): boolean {
  return lookupShape(shapeName) !== null;
}

// ═══════════════════════════════════════════════════════════════════════════
// GET ALL SHAPE NAMES
// ═══════════════════════════════════════════════════════════════════════════
export function getAllShapeNames(): string[] {
  return Object.keys(MASTER_SHAPE_REGISTRY);
}

// ═══════════════════════════════════════════════════════════════════════════
// DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════
export default MASTER_SHAPE_REGISTRY;

