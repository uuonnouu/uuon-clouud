
/**
 * UNIFIED SHAPE REGISTRY INTEGRATION
 * Connects all shape libraries to the main system
 * © 2025 UUON Foundation Inc.
 */

import UNIFIED_SHAPES, { getCleanDefaults } from './unifiedShapes';
import type { ParametricSurface } from './unifiedShapes';
import { SHAPE_CATEGORIES } from './shapeCategories';
import { BABYLONIAN_ZODIAC_SHAPES } from './babylonianZodiacShapes';
import { YEGANEH_EAGLE_SHAPE } from './yeganehEagle';

export { getCleanDefaults };
export type { ParametricSurface };

import { CLEAN_SURFACES } from './cleanMathEngine';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';
import { BIOLOGICAL_SHAPE_IMPLEMENTATIONS, MATHEMATICAL_SHAPE_IMPLEMENTATIONS } from './biologicalShapeImplementations';
import { FOUR_DIMENSIONAL_SHAPES } from './fourDimensionalShapes';
import { TEMPORAL_GEOMETRY } from './temporalGeometry';
import { CHAKRA_SHAPES } from './chakraShapes';
import { EXTENDED_CRYSTALS } from './extendedCrystals';
import { LIFE_SCIENCES_SHAPES } from './lifeSciencesShapes';
import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';
import { THEORY_OF_EVERYTHING_SHAPES } from './theoryOfEverythingShapes';
import { TEN_PERCENT_SHAPES } from './tenPercentShapes';
import { SET_THEORY_SHAPES } from './setTheoryShapes';
import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { SCHRODINGER_EQUATIONS } from './schrodingerEquations';
import { COSMIC_PHYSICS_EQUATIONS } from './cosmicPhysicsEquations';
import { COSMIC_HISTORY_GAPS } from './cosmicHistoryGaps';
import { TENSOR_ALGEBRA_SHAPES } from './tensorAlgebraEngine';
import { FIELD_THEORY_SHAPES } from './fieldTheoryEngine';
import { WAVE_ALGORITHMS_SHAPES } from './waveAlgorithmsEngine';
import { UNIFIED_MASTER_EQUATION_SHAPES } from './unifiedMasterEquation';
import { CATEGORY_THEORY } from './categoryTheory';
import { GROUP_THEORY } from './groupTheory';
import { TOPOLOGY_KNOTS } from './topologyKnotsFixed';
import { TOPOLOGY_DIFFERENTIAL_SHAPES } from './topologyDifferentialShapes';
import { UNIFIED_MATH_SYMBOLS, TRIG_WAVE_FUNCTIONS } from './unifiedMathSymbols';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';
import { MULTIDIMENSIONAL_FRACTALS } from './multidimensionalFractals';
import { FRACTAL_ANALYSIS_SHAPES } from './fractalAnalysisShapes';
import { SACRED_GEOMETRY } from './sacredGeometry';
import { ADVANCED_TOPOLOGICAL_SURFACES } from './advancedTopologicalSurfaces';
import { NON_EUCLIDEAN_GEOMETRIES } from './nonEuclideanGeometries';
import { SEQUENCE_PATTERNS } from './sequencePatterns';
import { GMOD6_SURFACES } from './uuon-gmod6-engine';
import {
  CORE_MATH_MODULO,
  CRYPTO_MODULO,
  CS_DATA_STRUCTURES_MODULO,
  SEQUENCES_PATTERNS_MODULO,
  GRAPHICS_SIMULATION_MODULO,
  GEOMETRY_SPATIAL_MODULO,
  AUDIO_SIGNAL_MODULO,
  MODULO_ALGORITHMS
} from './moduloAlgorithms';
import {
  AI_ML_MODULO,
  NETWORKING_MODULO,
  OS_LOWLEVEL_MODULO,
  ROBOTICS_PHYSICS_MODULO,
  CHAOS_FRACTALS_MODULO,
  COSMOLOGY_MODULO,
  UUON_CUSTOM_MODULO,
  MODULO_ALGORITHMS_PART2
} from './moduloAlgorithmsPart2';
import { AI_ML_ALGORITHMS } from './aiMlAlgorithmsLibrary';
import { NEURAL_LATTICE_ALGORITHMS } from './neuralLatticeAlgorithms';
import { QUANTUM_COMPUTING_ALGORITHMS } from './quantumComputingAlgorithms';
import { QPU_QUANTUM_COMPUTING_SHAPES } from './qpuQuantumComputingShapes';
import { QUANTUM_VISUALIZATION_SHAPES } from './quantumVisualizationShapes';
import { ENTANGLEMENT_ALGORITHMS } from './entanglementAlgorithms';
import { QUANTUM_GAP_SURFACES } from './quantumGapMathematics';
import {
  SCIENTIFIC_EXPANSION_SHAPES,
  UNIFIED_WHOLENESS,
  MOLECULAR_BIOLOGY_SHAPES,
  MICROBIOLOGY_SHAPES,
  BOTANY_SHAPES,
  ZOOLOGY_ECOLOGY_SHAPES,
  BIOINFORMATICS_ALGORITHMS,
  GEOLOGY_SHAPES,
  OCEANOGRAPHY_SHAPES,
  METEOROLOGY_SHAPES,
  ECONOMICS_SHAPES,
  SOCIOLOGY_SHAPES,
  POLITICAL_SCIENCE_SHAPES,
  INDUSTRIAL_ENGINEERING_SHAPES,
  CIVIL_ENGINEERING_SHAPES,
  AEROSPACE_ENGINEERING_SHAPES
} from './scientificExpansionShapes';
import { EARTH_SCIENCES_SHAPES } from './earthSciencesShapes';
import { DNA_STRUCTURES } from './dnaStructures';
import { PROTEIN_STRUCTURES } from './proteinStructures';
import { POLYMER_CHAINS } from './polymerChains';
import { TISSUE_STRUCTURES } from './tissueStructures';
import { HUMAN_ANATOMY_SHAPES } from './humanAnatomyShapes';
import { SOCIAL_SCIENCES_SHAPES } from './socialSciencesShapes';
import {
  CONSENSUS_ALGORITHMS,
  CRYPTOGRAPHIC_ALGORITHMS,
  PROOF_SYSTEMS,
  LAYER2_ALGORITHMS,
  PRIVACY_ALGORITHMS,
  POST_QUANTUM_ALGORITHMS
} from './blockchainAlgorithmsEngine';
import { ASTROPHYSICAL_PHENOMENA } from './astrophysicalPhenomena';
import { ASTRONOMICAL_OBJECTS } from './astronomicalObjects';
import { WEATHER_SYSTEMS } from './weatherSystems';
import { NATIONAL_MOTTO_ALGORITHMS } from './nationalMottoAlgorithms';
import { MECHANICAL_SHAPES } from './mechanicalShapes';
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';
import { HISTORICAL_ALGORITHMS } from './historicalAlgorithms';
import { GENERATIVE_ALGORITHMS } from './generativeAlgorithms';
import { NOISE_FUNCTIONS } from './noiseFunctions';
import { DIFFERENTIAL_GROWTH } from './differentialGrowth';
import { ATTRACTOR_SYSTEMS } from './attractorSystems';
import { DUAL_MIRROR_ENERGY_SYSTEM } from './dualMirrorEnergySystem';
import { VORONOI_SYSTEMS } from './voronoiSystems';
import { INVERSE_FISHBOWL_SPACE } from './inverseFishBowlSpace';
import { HIGHER_DIMENSIONAL_GAPS } from './higherDimensionalGaps';
import { HYDROGEN_ORBITALS } from './hydrogenOrbitals';
import { REAL_WORLD_OBJECTS } from './realWorldObjects';
import { FINANCIAL_MATHEMATICS } from './financialMathematics';
import { CONSCIOUSNESS_THEORY } from './consciousnessTheory';
import { ADVANCED_PHYSICS_SIMS } from './advancedPhysicsSims';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';
import { NON_EUCLIDEAN_SHAPES } from './nonEuclideanShapes';
import { RIEMANN_SURFACES } from './riemannSurfaces';
import { EDUCATIONAL_SURFACES } from './educationalSurfaces';
import { GENERAL_RELATIVITY_FALLBACKS, TOPOLOGY_FALLBACKS, MISSING_SHAPES_BRIDGE } from './missingShapesBridge';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { PARAMETRIC_SURFACES } from './parametricSurfaces';
import { INTEGRATED_FORMULA_LIBRARIES } from './formulaIntegrationBridge';

// Convert array-based blockchain algorithms to object format
function arrayToObject(arr: any[]): Record<string, any> {
  const result: Record<string, any> = {};
  for (const item of arr) {
    if (item && item.id && item.equation) {
      result[item.id] = {
        equation: item.equation,
        defaultParams: item.defaultParams || {},
        name: item.name || item.id,
        description: item.description || ''
      };
    }
  }
  return result;
}

// Pre-convert blockchain algorithms from arrays to objects
const CONSENSUS_ALGORITHMS_OBJ = arrayToObject(CONSENSUS_ALGORITHMS);
const CRYPTOGRAPHIC_ALGORITHMS_OBJ = arrayToObject(CRYPTOGRAPHIC_ALGORITHMS);
const PROOF_SYSTEMS_OBJ = arrayToObject(PROOF_SYSTEMS);
const LAYER2_ALGORITHMS_OBJ = arrayToObject(LAYER2_ALGORITHMS);
const PRIVACY_ALGORITHMS_OBJ = arrayToObject(PRIVACY_ALGORITHMS);
const POST_QUANTUM_ALGORITHMS_OBJ = arrayToObject(POST_QUANTUM_ALGORITHMS);

export const COMPREHENSIVE_SHAPE_LIBRARY: Record<string, any> = {
  // Priority 0: Mathematical Art masterpieces - FIRST in lookup order
  'yeganeh-eagle': YEGANEH_EAGLE_SHAPE,
  
  // Priority 1: Ancient historical mathematical reconstructions
  ...BABYLONIAN_ZODIAC_SHAPES,
  ...UNIFIED_SHAPES,
  ...CLEAN_SURFACES,
  ...ADVANCED_PHYSICS_EQUATIONS,
  ...GENERAL_RELATIVITY_SHAPES,
  ...QUANTUM_PARAMETRIC_FUNCTIONS,
  ...BIOLOGICAL_SHAPE_IMPLEMENTATIONS,
  ...MATHEMATICAL_SHAPE_IMPLEMENTATIONS,
  ...FOUR_DIMENSIONAL_SHAPES,
  ...TEMPORAL_GEOMETRY,
  ...CHAKRA_SHAPES,
  ...EXTENDED_CRYSTALS,
  ...LIFE_SCIENCES_SHAPES,
  ...QUANTUM_GRAVITY_EQUATIONS,
  ...THEORY_OF_EVERYTHING_SHAPES,
  ...TEN_PERCENT_SHAPES,
  ...SET_THEORY_SHAPES,
  ...ENTROPIC_PRINCIPLES,
  ...SCHRODINGER_EQUATIONS,
  ...COSMIC_PHYSICS_EQUATIONS,
  ...COSMIC_HISTORY_GAPS,
  ...TENSOR_ALGEBRA_SHAPES,
  ...FIELD_THEORY_SHAPES,
  ...WAVE_ALGORITHMS_SHAPES,
  ...UNIFIED_MASTER_EQUATION_SHAPES,
  ...CATEGORY_THEORY,
  ...GROUP_THEORY,
  ...TOPOLOGY_KNOTS,
  ...TOPOLOGY_DIFFERENTIAL_SHAPES,
  ...UNIFIED_MATH_SYMBOLS,
  ...TRIG_WAVE_FUNCTIONS,
  ...UNIVERSAL_MATHEMATICS,
  ...MULTIDIMENSIONAL_FRACTALS,
  ...FRACTAL_ANALYSIS_SHAPES,
  ...SACRED_GEOMETRY,
  ...ADVANCED_TOPOLOGICAL_SURFACES,
  ...NON_EUCLIDEAN_GEOMETRIES,
  ...SEQUENCE_PATTERNS,
  ...GMOD6_SURFACES,
  ...CORE_MATH_MODULO,
  ...CRYPTO_MODULO,
  ...CS_DATA_STRUCTURES_MODULO,
  ...SEQUENCES_PATTERNS_MODULO,
  ...GRAPHICS_SIMULATION_MODULO,
  ...GEOMETRY_SPATIAL_MODULO,
  ...AUDIO_SIGNAL_MODULO,
  ...MODULO_ALGORITHMS,
  ...AI_ML_MODULO,
  ...NETWORKING_MODULO,
  ...OS_LOWLEVEL_MODULO,
  ...ROBOTICS_PHYSICS_MODULO,
  ...CHAOS_FRACTALS_MODULO,
  ...COSMOLOGY_MODULO,
  ...UUON_CUSTOM_MODULO,
  ...MODULO_ALGORITHMS_PART2,
  ...AI_ML_ALGORITHMS,
  ...NEURAL_LATTICE_ALGORITHMS,
  ...QUANTUM_COMPUTING_ALGORITHMS,
  ...QPU_QUANTUM_COMPUTING_SHAPES,
  ...QUANTUM_VISUALIZATION_SHAPES,
  ...ENTANGLEMENT_ALGORITHMS,
  ...QUANTUM_GAP_SURFACES,
  ...SCIENTIFIC_EXPANSION_SHAPES,
  ...UNIFIED_WHOLENESS,
  ...MOLECULAR_BIOLOGY_SHAPES,
  ...MICROBIOLOGY_SHAPES,
  ...BOTANY_SHAPES,
  ...ZOOLOGY_ECOLOGY_SHAPES,
  ...BIOINFORMATICS_ALGORITHMS,
  ...GEOLOGY_SHAPES,
  ...OCEANOGRAPHY_SHAPES,
  ...METEOROLOGY_SHAPES,
  ...ECONOMICS_SHAPES,
  ...SOCIOLOGY_SHAPES,
  ...POLITICAL_SCIENCE_SHAPES,
  ...INDUSTRIAL_ENGINEERING_SHAPES,
  ...CIVIL_ENGINEERING_SHAPES,
  ...AEROSPACE_ENGINEERING_SHAPES,
  ...EARTH_SCIENCES_SHAPES,
  ...DNA_STRUCTURES,
  ...PROTEIN_STRUCTURES,
  ...POLYMER_CHAINS,
  ...TISSUE_STRUCTURES,
  ...HUMAN_ANATOMY_SHAPES,
  ...SOCIAL_SCIENCES_SHAPES,
  ...CONSENSUS_ALGORITHMS_OBJ,
  ...CRYPTOGRAPHIC_ALGORITHMS_OBJ,
  ...PROOF_SYSTEMS_OBJ,
  ...LAYER2_ALGORITHMS_OBJ,
  ...PRIVACY_ALGORITHMS_OBJ,
  ...POST_QUANTUM_ALGORITHMS_OBJ,
  ...ASTROPHYSICAL_PHENOMENA,
  ...ASTRONOMICAL_OBJECTS,
  ...WEATHER_SYSTEMS,
  ...NATIONAL_MOTTO_ALGORITHMS,
  ...MECHANICAL_SHAPES,
  ...HYPERCOMPUTATION_SURFACES,
  ...HISTORICAL_ALGORITHMS,
  ...GENERATIVE_ALGORITHMS,
  ...NOISE_FUNCTIONS,
  ...DIFFERENTIAL_GROWTH,
  ...ATTRACTOR_SYSTEMS,
  ...DUAL_MIRROR_ENERGY_SYSTEM,
  ...VORONOI_SYSTEMS,
  ...INVERSE_FISHBOWL_SPACE,
  ...HIGHER_DIMENSIONAL_GAPS,
  ...HYDROGEN_ORBITALS,
  ...REAL_WORLD_OBJECTS,
  ...FINANCIAL_MATHEMATICS,
  ...CONSCIOUSNESS_THEORY,
  ...ADVANCED_PHYSICS_SIMS,
  ...EXCLUSIVE_SHAPES,
  ...NON_EUCLIDEAN_SHAPES,
  ...RIEMANN_SURFACES,
  ...EDUCATIONAL_SURFACES,
  ...GENERAL_RELATIVITY_FALLBACKS,
  ...TOPOLOGY_FALLBACKS,
  ...MISSING_SHAPES_BRIDGE,
  ...MATHEMATICAL_CONSTANTS,
  ...PARAMETRIC_SURFACES,
  ...INTEGRATED_FORMULA_LIBRARIES
};

export function autoRegisterMissingShapes() {
  const implementedShapes = Object.keys(COMPREHENSIVE_SHAPE_LIBRARY);
  const registeredShapes = SHAPE_CATEGORIES.flatMap(cat => cat.shapes);
  const missingShapes = implementedShapes.filter(shape => !registeredShapes.includes(shape));
  
  if (missingShapes.length > 0) {
    console.log(`🔄 Auto-registering ${missingShapes.length} missing shapes...`);
    
    const miscCategory = SHAPE_CATEGORIES.find(cat => cat.id === 'miscellaneous');
    if (miscCategory) {
      miscCategory.shapes.push(...missingShapes);
    } else {
      SHAPE_CATEGORIES.push({
        id: 'miscellaneous',
        name: '🔧 Auto-Registered Shapes',
        icon: '🔧',
        description: 'Automatically registered missing shapes',
        shapes: missingShapes
      });
    }
    
    console.log(`✅ Auto-registered ${missingShapes.length} shapes`);
  }
  
  return {
    totalImplemented: implementedShapes.length,
    totalRegistered: registeredShapes.length + missingShapes.length,
    autoRegistered: missingShapes.length
  };
}

const registrationResult = autoRegisterMissingShapes();

export default COMPREHENSIVE_SHAPE_LIBRARY;
