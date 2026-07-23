/**
 * SHAPE LIBRARIES LOADER
 * 
 * Centralized loader for ALL_SHAPE_LIBRARIES that can be imported
 * by parameterAuthority.ts without circular dependencies.
 * 
 * This module imports all shape libraries and exports them as a single object.
 */

import { UNIFIED_SHAPES } from './unifiedShapes';
import { PARAMETRIC_LIBRARY_PACK } from './parametricLibraryPack';
import { CLEAN_SURFACES } from './cleanMathEngine';
import { PARAMETRIC_SURFACES } from './parametricSurfacesClean';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';
import { NON_EUCLIDEAN_SHAPES } from './nonEuclideanShapes';
import { RIEMANN_SURFACES } from './riemannSurfaces';
import { EDUCATIONAL_SURFACES } from './educationalSurfaces';
import { TOPOLOGY_KNOTS } from './topologyKnotsFixed';
import { CATEGORY_THEORY } from './categoryTheory';
import { GROUP_THEORY } from './groupTheory';
import { HISTORICAL_ALGORITHMS } from './historicalAlgorithms';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { UNIFIED_MATH_SYMBOLS } from './unifiedMathSymbols';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';
import { MULTIDIMENSIONAL_FRACTALS } from './multidimensionalFractals';
import { SACRED_GEOMETRY } from './sacredGeometry';
import { ADVANCED_TOPOLOGICAL_SURFACES } from './advancedTopologicalSurfaces';
import { REAL_WORLD_OBJECTS } from './realWorldObjects';
import { NON_EUCLIDEAN_GEOMETRIES } from './nonEuclideanGeometries';
import { MECHANICAL_SHAPES } from './mechanicalShapes';
import { WEATHER_SYSTEMS } from './weatherSystems';
import { SEQUENCE_PATTERNS } from './sequencePatterns';
import { ASTRONOMICAL_OBJECTS } from './astronomicalObjects';
import { CONSCIOUSNESS_THEORY } from './consciousnessTheory';
import { EXTENDED_CRYSTALS } from './extendedCrystals';
import { ADVANCED_PHYSICS_SIMS } from './advancedPhysicsSims';
import { HYDROGEN_ORBITALS } from './hydrogenOrbitals';
import { QUANTUM_GAP_SURFACES } from './quantumGapMathematics';
import { NOISE_FUNCTIONS } from './noiseFunctions';
import { DIFFERENTIAL_GROWTH } from './differentialGrowth';
import { PROTEIN_STRUCTURES } from './proteinStructures';
import { ASTROPHYSICAL_PHENOMENA } from './astrophysicalPhenomena';
import { VORONOI_SYSTEMS } from './voronoiSystems';
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';
import { NATIONAL_MOTTO_ALGORITHMS } from './nationalMottoAlgorithms';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { SCHRODINGER_EQUATIONS } from './schrodingerEquations';
import { HUMAN_ANATOMY_SHAPES } from './humanAnatomyShapes';
import { ATTRACTOR_SYSTEMS } from './attractorSystems';
import { POLYMER_CHAINS } from './polymerChains';
import { TISSUE_STRUCTURES } from './tissueStructures';
import { GENERATIVE_ALGORITHMS } from './generativeAlgorithms';
import { ENTANGLEMENT_ALGORITHMS } from './entanglementAlgorithms';
import { FINANCIAL_MATHEMATICS } from './financialMathematics';
import { CHAKRA_SHAPES } from './chakraShapes';
import { DNA_STRUCTURES } from './dnaStructures';
import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';
import { THEORY_OF_EVERYTHING_SHAPES } from './theoryOfEverythingShapes';
import { FOUR_DIMENSIONAL_SHAPES } from './fourDimensionalShapes';
import { TEMPORAL_GEOMETRY } from './temporalGeometry';
import { TEN_PERCENT_SHAPES } from './tenPercentShapes';
import { SET_THEORY_SHAPES } from './setTheoryShapes';
import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { 
  SCIENTIFIC_EXPANSION_SHAPES, 
  MOLECULAR_BIOLOGY_SHAPES,
  MICROBIOLOGY_SHAPES,
  BOTANY_SHAPES,
  ZOOLOGY_ECOLOGY_SHAPES,
  GEOLOGY_SHAPES,
  OCEANOGRAPHY_SHAPES,
  METEOROLOGY_SHAPES,
  ECONOMICS_SHAPES,
  SOCIOLOGY_SHAPES,
  POLITICAL_SCIENCE_SHAPES,
  INDUSTRIAL_ENGINEERING_SHAPES,
  CIVIL_ENGINEERING_SHAPES,
  AEROSPACE_ENGINEERING_SHAPES,
  BIOINFORMATICS_ALGORITHMS
} from './scientificExpansionShapes';
import { LIFE_SCIENCES_SHAPES } from './lifeSciencesShapes';
import { EARTH_SCIENCES_SHAPES } from './earthSciencesShapes';
import { SOCIAL_SCIENCES_SHAPES } from './socialSciencesShapes';
import { MODULO_ALGORITHMS } from './moduloAlgorithms';
import { MODULO_ALGORITHMS_PART2 } from './moduloAlgorithmsPart2';
import { MISSING_SHAPES_BRIDGE } from './missingShapesBridge';
import { FRACTAL_SHAPE_IMPLEMENTATIONS } from './fractalShapeImplementations';
import { TENSOR_ALGEBRA_SHAPES } from './tensorAlgebraEngine';
import { FIELD_THEORY_SHAPES } from './fieldTheoryEngine';
import { WAVE_ALGORITHMS_SHAPES } from './waveAlgorithmsEngine';
import { IFS_FRACTALS_REGISTRY } from './ifsFractalsRegistry';

export const ALL_SHAPE_LIBRARIES: Record<string, any> = {
  ...UNIFIED_SHAPES,
  ...PARAMETRIC_LIBRARY_PACK,
  ...CLEAN_SURFACES,
  ...PARAMETRIC_SURFACES,
  ...EXCLUSIVE_SHAPES,
  ...NON_EUCLIDEAN_SHAPES,
  ...RIEMANN_SURFACES,
  ...EDUCATIONAL_SURFACES,
  ...TOPOLOGY_KNOTS,
  ...CATEGORY_THEORY,
  ...GROUP_THEORY,
  ...HISTORICAL_ALGORITHMS,
  ...MATHEMATICAL_CONSTANTS,
  ...UNIFIED_MATH_SYMBOLS,
  ...UNIVERSAL_MATHEMATICS,
  ...QUANTUM_PARAMETRIC_FUNCTIONS,
  ...MULTIDIMENSIONAL_FRACTALS,
  ...SACRED_GEOMETRY,
  ...ADVANCED_TOPOLOGICAL_SURFACES,
  ...REAL_WORLD_OBJECTS,
  ...NON_EUCLIDEAN_GEOMETRIES,
  ...MECHANICAL_SHAPES,
  ...WEATHER_SYSTEMS,
  ...SEQUENCE_PATTERNS,
  ...ASTRONOMICAL_OBJECTS,
  ...CONSCIOUSNESS_THEORY,
  ...EXTENDED_CRYSTALS,
  ...ADVANCED_PHYSICS_SIMS,
  ...HYDROGEN_ORBITALS,
  ...QUANTUM_GAP_SURFACES,
  ...NOISE_FUNCTIONS,
  ...DIFFERENTIAL_GROWTH,
  ...PROTEIN_STRUCTURES,
  ...ASTROPHYSICAL_PHENOMENA,
  ...VORONOI_SYSTEMS,
  ...HYPERCOMPUTATION_SURFACES,
  ...NATIONAL_MOTTO_ALGORITHMS,
  ...ADVANCED_PHYSICS_EQUATIONS,
  ...SCHRODINGER_EQUATIONS,
  ...HUMAN_ANATOMY_SHAPES,
  ...ATTRACTOR_SYSTEMS,
  ...POLYMER_CHAINS,
  ...TISSUE_STRUCTURES,
  ...GENERATIVE_ALGORITHMS,
  ...ENTANGLEMENT_ALGORITHMS,
  ...FINANCIAL_MATHEMATICS,
  ...CHAKRA_SHAPES,
  ...DNA_STRUCTURES,
  ...GENERAL_RELATIVITY_SHAPES,
  ...QUANTUM_GRAVITY_EQUATIONS,
  ...THEORY_OF_EVERYTHING_SHAPES,
  ...FOUR_DIMENSIONAL_SHAPES,
  ...TEMPORAL_GEOMETRY,
  ...TEN_PERCENT_SHAPES,
  ...SET_THEORY_SHAPES,
  ...ENTROPIC_PRINCIPLES,
  ...SCIENTIFIC_EXPANSION_SHAPES,
  ...MOLECULAR_BIOLOGY_SHAPES,
  ...MICROBIOLOGY_SHAPES,
  ...BOTANY_SHAPES,
  ...ZOOLOGY_ECOLOGY_SHAPES,
  ...GEOLOGY_SHAPES,
  ...OCEANOGRAPHY_SHAPES,
  ...METEOROLOGY_SHAPES,
  ...ECONOMICS_SHAPES,
  ...SOCIOLOGY_SHAPES,
  ...POLITICAL_SCIENCE_SHAPES,
  ...INDUSTRIAL_ENGINEERING_SHAPES,
  ...CIVIL_ENGINEERING_SHAPES,
  ...AEROSPACE_ENGINEERING_SHAPES,
  ...BIOINFORMATICS_ALGORITHMS,
  ...LIFE_SCIENCES_SHAPES,
  ...EARTH_SCIENCES_SHAPES,
  ...SOCIAL_SCIENCES_SHAPES,
  ...MODULO_ALGORITHMS,
  ...MODULO_ALGORITHMS_PART2,
  ...TENSOR_ALGEBRA_SHAPES,
  ...FIELD_THEORY_SHAPES,
  ...WAVE_ALGORITHMS_SHAPES,
  ...FRACTAL_SHAPE_IMPLEMENTATIONS,
  ...MISSING_SHAPES_BRIDGE,
  // IFS FRACTALS — GPU raymarched (never CPU-computed, but registered so lookups don't return undefined)
  ...IFS_FRACTALS_REGISTRY
};

