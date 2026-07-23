
/**
 * SHAPE REGISTRY GUARD
 * Runtime protection against missing shape implementations
 * Ensures users never see sphere placeholders unexpectedly
 */

import UNIFIED_SHAPES from './unifiedShapes';
import { SHAPE_CATEGORIES } from './shapeCategories';
import { CLEAN_SURFACES } from './cleanMathEngine';
import { PARAMETRIC_SURFACES } from './parametricSurfacesClean';
import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';
import { THEORY_OF_EVERYTHING_SHAPES } from './theoryOfEverythingShapes';
import { TEN_PERCENT_SHAPES } from './tenPercentShapes';
import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { SET_THEORY_SHAPES } from './setTheoryShapes';
import { SCHRODINGER_EQUATIONS } from './schrodingerEquations';
import { TOPOLOGY_DIFFERENTIAL_SHAPES } from './topologyDifferentialShapes';
import { HUMAN_ANATOMY_SHAPES } from './humanAnatomyShapes';
import { DNA_STRUCTURES } from './dnaStructures';
import { CHAKRA_SHAPES } from './chakraShapes';
import { TENSOR_ALGEBRA_SHAPES } from './tensorAlgebraEngine';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { HISTORICAL_ALGORITHMS } from './historicalAlgorithms';
import { SEQUENCE_PATTERNS } from './sequencePatterns';
import { SCIENTIFIC_EXPANSION_SHAPES } from './scientificExpansionShapes';
import { FIELD_THEORY_SHAPES } from './fieldTheoryEngine';
import { ADVANCED_TOPOLOGICAL_SURFACES } from './advancedTopologicalSurfaces';
import { WAVE_ALGORITHMS_SHAPES } from './waveAlgorithmsEngine';
import { GENERATIVE_ALGORITHMS } from './generativeAlgorithms';
import { MULTIDIMENSIONAL_FRACTALS } from './multidimensionalFractals';
import { NOISE_FUNCTIONS } from './noiseFunctions';
import { VORONOI_SYSTEMS } from './voronoiSystems';
import { ATTRACTOR_SYSTEMS } from './attractorSystems';
import { DIFFERENTIAL_GROWTH } from './differentialGrowth';
import { FOUR_DIMENSIONAL_SHAPES } from './fourDimensionalShapes';
import { TEMPORAL_GEOMETRY } from './temporalGeometry';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';
import { QUANTUM_COMPUTING_ALGORITHMS } from './quantumComputingAlgorithms';
import { QPU_QUANTUM_COMPUTING_SHAPES } from './qpuQuantumComputingShapes';
import { AI_ML_ALGORITHMS } from './aiMlAlgorithmsLibrary';
import { EARTH_SCIENCES_SHAPES } from './earthSciencesShapes';
import { EDUCATIONAL_SURFACES } from './educationalSurfaces';
import { ENTANGLEMENT_ALGORITHMS } from './entanglementAlgorithms';
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';
import { FRACTAL_ANALYSIS_SHAPES } from './fractalAnalysisShapes';
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';
import { LIFE_SCIENCES_SHAPES } from './lifeSciencesShapes';
import { MECHANICAL_SHAPES } from './mechanicalShapes';
import { MODULO_ALGORITHMS } from './moduloAlgorithms';
import { AI_ML_MODULO, NETWORKING_MODULO, OS_LOWLEVEL_MODULO } from './moduloAlgorithmsPart2';
import { NEURAL_LATTICE_ALGORITHMS } from './neuralLatticeAlgorithms';
import { NON_EUCLIDEAN_SHAPES } from './nonEuclideanShapes';
import { RIEMANN_SURFACES } from './riemannSurfaces';
import { ASTROPHYSICAL_PHENOMENA } from './astrophysicalPhenomena';
import { PROTEIN_STRUCTURES } from './proteinStructures';
import { POLYMER_CHAINS } from './polymerChains';
import { TISSUE_STRUCTURES } from './tissueStructures';
import { EXTENDED_CRYSTALS } from './extendedCrystals';
import { SACRED_GEOMETRY } from './sacredGeometry';
import { REAL_WORLD_OBJECTS } from './realWorldObjects';
import { WEATHER_SYSTEMS } from './weatherSystems';
import { ASTRONOMICAL_OBJECTS } from './astronomicalObjects';
import { CONSCIOUSNESS_THEORY } from './consciousnessTheory';
import { ADVANCED_PHYSICS_SIMS } from './advancedPhysicsSims';
import { HYDROGEN_ORBITALS } from './hydrogenOrbitals';
import { FINANCIAL_MATHEMATICS } from './financialMathematics';
import { CATEGORY_THEORY } from './categoryTheory';
import { GROUP_THEORY } from './groupTheory';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { UNIFIED_MATH_SYMBOLS } from './unifiedMathSymbols';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';
import { NON_EUCLIDEAN_GEOMETRIES } from './nonEuclideanGeometries';
import { NATIONAL_MOTTO_ALGORITHMS } from './nationalMottoAlgorithms';
import { QUANTUM_GAP_SURFACES } from './quantumGapMathematics';
import { COSMIC_HISTORY_GAPS } from './cosmicHistoryGaps';
import { COMPLETE_MISSING_SHAPES } from './completeMissingShapesLibrary';
import { YEGANEH_EAGLE_SHAPE } from './yeganehEagle';
import { FRACTAL_SHAPE_IMPLEMENTATIONS } from './fractalShapeImplementations';
import { PARAMETRIC_LIBRARY_PACK } from './parametricLibraryPack';
import { ANCIENT_CIVILIZATION_SHAPES } from './ancientCivilizationShapes';
import { CHAOS_THEORY_SHAPES } from './chaosTheoryShapes';
import { INVERSE_SQUARE_LAW_SHAPES } from './inverseSquareLawShapes';
import { SPACE_BIOLOGY_SHAPES } from './spaceBiologyShapes';
import { ICE_CRYSTAL_SHAPES } from './iceCrystalShapes';
import { TIME_TRAVEL_PHYSICS } from './timeTravelPhysics';

const IFS_GPU_SHAPES = new Set([
  'menger_sponge', 'mandelbox_fractal', 'kleinian_fractal', 'lattice_fractal',
  'tetrahedral_fractal', 'anisotropic_menger', 'chaos_boundary_menger',
  'compound_ifs_blend', 'icosahedral_ifs', 'fractal_weave',
  'reaction_diffusion_ifs', 'lsystem_ifs', 'mandelbulb_raymarched',
  'platonic_icosa', 'platonic_octa', 'platonic_dodeca', 'menger_kleinian_v2',
]);

export interface ShapeRegistryStatus {
  isHealthy: boolean;
  totalRegistered: number;
  totalImplemented: number;
  missingCount: number;
  missingShapes: string[];
  duplicates: string[];
}

export class ShapeRegistryGuard {
  private static instance: ShapeRegistryGuard;
  private registryStatus: ShapeRegistryStatus | null = null;
  
  static getInstance(): ShapeRegistryGuard {
    if (!ShapeRegistryGuard.instance) {
      ShapeRegistryGuard.instance = new ShapeRegistryGuard();
    }
    return ShapeRegistryGuard.instance;
  }
  
  /**
   * Validate shape registry health at startup
   */
  validateRegistry(): ShapeRegistryStatus {
    if (this.registryStatus) {
      return this.registryStatus;
    }
    
    console.log('🛡️ Shape Registry Guard: Validating registry...');
    
    // Collect all registered shapes
    const registeredShapes = new Set<string>();
    SHAPE_CATEGORIES.forEach(category => {
      category.shapes.forEach(shape => {
        registeredShapes.add(shape);
      });
    });
    
    // Collect all implemented shapes from ALL shape libraries
    const implementedShapes = new Set([
      ...Object.keys(UNIFIED_SHAPES),
      ...Object.keys(CLEAN_SURFACES || {}),
      ...Object.keys(PARAMETRIC_SURFACES || {}),
      ...Object.keys(GENERAL_RELATIVITY_SHAPES || {}),
      ...Object.keys(QUANTUM_GRAVITY_EQUATIONS || {}),
      ...Object.keys(THEORY_OF_EVERYTHING_SHAPES || {}),
      ...Object.keys(TEN_PERCENT_SHAPES || {}),
      ...Object.keys(ENTROPIC_PRINCIPLES || {}),
      ...Object.keys(SET_THEORY_SHAPES || {}),
      ...Object.keys(SCHRODINGER_EQUATIONS || {}),
      ...Object.keys(TOPOLOGY_DIFFERENTIAL_SHAPES || {}),
      ...Object.keys(HUMAN_ANATOMY_SHAPES || {}),
      ...Object.keys(DNA_STRUCTURES || {}),
      ...Object.keys(CHAKRA_SHAPES || {}),
      ...Object.keys(TENSOR_ALGEBRA_SHAPES || {}),
      ...Object.keys(ADVANCED_PHYSICS_EQUATIONS || {}),
      ...Object.keys(HISTORICAL_ALGORITHMS || {}),
      ...Object.keys(SEQUENCE_PATTERNS || {}),
      ...Object.keys(SCIENTIFIC_EXPANSION_SHAPES || {}),
      ...Object.keys(FIELD_THEORY_SHAPES || {}),
      ...Object.keys(ADVANCED_TOPOLOGICAL_SURFACES || {}),
      ...Object.keys(WAVE_ALGORITHMS_SHAPES || {}),
      ...Object.keys(GENERATIVE_ALGORITHMS || {}),
      ...Object.keys(MULTIDIMENSIONAL_FRACTALS || {}),
      ...Object.keys(NOISE_FUNCTIONS || {}),
      ...Object.keys(VORONOI_SYSTEMS || {}),
      ...Object.keys(ATTRACTOR_SYSTEMS || {}),
      ...Object.keys(DIFFERENTIAL_GROWTH || {}),
      ...Object.keys(FOUR_DIMENSIONAL_SHAPES || {}),
      ...Object.keys(TEMPORAL_GEOMETRY || {}),
      ...Object.keys(QUANTUM_PARAMETRIC_FUNCTIONS || {}),
      ...Object.keys(QUANTUM_COMPUTING_ALGORITHMS || {}),
      ...Object.keys(QPU_QUANTUM_COMPUTING_SHAPES || {}),
      ...Object.keys(AI_ML_ALGORITHMS || {}),
      ...Object.keys(EARTH_SCIENCES_SHAPES || {}),
      ...Object.keys(EDUCATIONAL_SURFACES || {}),
      ...Object.keys(ENTANGLEMENT_ALGORITHMS || {}),
      ...Object.keys(EXCLUSIVE_SHAPES || {}),
      ...Object.keys(FRACTAL_ANALYSIS_SHAPES || {}),
      ...Object.keys(HYPERCOMPUTATION_SURFACES || {}),
      ...Object.keys(LIFE_SCIENCES_SHAPES || {}),
      ...Object.keys(MECHANICAL_SHAPES || {}),
      ...Object.keys(MODULO_ALGORITHMS || {}),
      ...Object.keys(AI_ML_MODULO || {}),
      ...Object.keys(NETWORKING_MODULO || {}),
      ...Object.keys(OS_LOWLEVEL_MODULO || {}),
      ...Object.keys(NEURAL_LATTICE_ALGORITHMS || {}),
      ...Object.keys(NON_EUCLIDEAN_SHAPES || {}),
      ...Object.keys(RIEMANN_SURFACES || {}),
      ...Object.keys(ASTROPHYSICAL_PHENOMENA || {}),
      ...Object.keys(PROTEIN_STRUCTURES || {}),
      ...Object.keys(POLYMER_CHAINS || {}),
      ...Object.keys(TISSUE_STRUCTURES || {}),
      ...Object.keys(EXTENDED_CRYSTALS || {}),
      ...Object.keys(SACRED_GEOMETRY || {}),
      ...Object.keys(REAL_WORLD_OBJECTS || {}),
      ...Object.keys(WEATHER_SYSTEMS || {}),
      ...Object.keys(ASTRONOMICAL_OBJECTS || {}),
      ...Object.keys(CONSCIOUSNESS_THEORY || {}),
      ...Object.keys(ADVANCED_PHYSICS_SIMS || {}),
      ...Object.keys(HYDROGEN_ORBITALS || {}),
      ...Object.keys(FINANCIAL_MATHEMATICS || {}),
      ...Object.keys(CATEGORY_THEORY || {}),
      ...Object.keys(GROUP_THEORY || {}),
      ...Object.keys(MATHEMATICAL_CONSTANTS || {}),
      ...Object.keys(UNIFIED_MATH_SYMBOLS || {}),
      ...Object.keys(UNIVERSAL_MATHEMATICS || {}),
      ...Object.keys(NON_EUCLIDEAN_GEOMETRIES || {}),
      ...Object.keys(NATIONAL_MOTTO_ALGORITHMS || {}),
      ...Object.keys(QUANTUM_GAP_SURFACES || {}),
      ...Object.keys(COSMIC_HISTORY_GAPS || {}),
      ...Object.keys(COMPLETE_MISSING_SHAPES || {}),
      ...Object.keys(FRACTAL_SHAPE_IMPLEMENTATIONS || {}),
      ...Object.keys(PARAMETRIC_LIBRARY_PACK || {}),
      ...Object.keys(ANCIENT_CIVILIZATION_SHAPES || {}),
      ...Object.keys(CHAOS_THEORY_SHAPES || {}),
      ...Object.keys(INVERSE_SQUARE_LAW_SHAPES || {}),
      ...Object.keys(SPACE_BIOLOGY_SHAPES || {}),
      ...Object.keys(ICE_CRYSTAL_SHAPES || {}),
      ...Object.keys(TIME_TRAVEL_PHYSICS || {}),
      'yeganeh-eagle',
      // IFS Fractal shapes — rendered by the WebGL GPU raymarcher (IFSCanvas), not CPU parametric
      'menger_sponge',
      'mandelbox_fractal',
      'kleinian_fractal',
      'lattice_fractal',
      'tetrahedral_fractal',
      'anisotropic_menger',
      'chaos_boundary_menger',
      'compound_ifs_blend',
      'icosahedral_ifs',
      'fractal_weave',
      'reaction_diffusion_ifs',
      'lsystem_ifs',
      'mandelbulb_raymarched',
      'platonic_icosa',
      'platonic_octa',
      'platonic_dodeca',
      'menger_kleinian_v2'
    ]);
    
    // Find missing implementations
    const missingShapes: string[] = [];
    registeredShapes.forEach(shape => {
      if (!implementedShapes.has(shape)) {
        missingShapes.push(shape);
      }
    });
    
    // Find duplicate registrations
    const shapeCount: Record<string, number> = {};
    const duplicates: string[] = [];
    
    SHAPE_CATEGORIES.forEach(category => {
      category.shapes.forEach(shape => {
        shapeCount[shape] = (shapeCount[shape] || 0) + 1;
        if (shapeCount[shape] > 1 && !duplicates.includes(shape)) {
          duplicates.push(shape);
        }
      });
    });
    
    this.registryStatus = {
      isHealthy: missingShapes.length === 0,
      totalRegistered: registeredShapes.size,
      totalImplemented: implementedShapes.size,
      missingCount: missingShapes.length,
      missingShapes: missingShapes.slice(0, 20), // Limit for performance
      duplicates
    };
    
    // Log results
    if (this.registryStatus.isHealthy) {
      console.log('✅ Shape Registry Guard: All shapes properly implemented');
    } else {
      console.warn(`⚠️ Shape Registry Guard: ${missingShapes.length} missing implementations detected`);
      console.warn('Missing shapes will render as sphere placeholders:', 
                   missingShapes.slice(0, 10).join(', '));
      if (missingShapes.length > 10) {
        console.warn(`... and ${missingShapes.length - 10} more`);
      }
    }
    
    if (duplicates.length > 0) {
      console.warn('⚠️ Duplicate shape registrations found:', duplicates.join(', '));
    }
    
    return this.registryStatus;
  }
  
  /**
   * Check if a specific shape has a valid implementation
   */
  isShapeImplemented(shapeId: string): boolean {
    return (
      shapeId in UNIFIED_SHAPES ||
      shapeId in (CLEAN_SURFACES || {}) ||
      shapeId in (PARAMETRIC_SURFACES || {}) ||
      shapeId in (GENERAL_RELATIVITY_SHAPES || {}) ||
      shapeId in (QUANTUM_GRAVITY_EQUATIONS || {}) ||
      shapeId in (THEORY_OF_EVERYTHING_SHAPES || {}) ||
      shapeId in (TEN_PERCENT_SHAPES || {}) ||
      shapeId in (ENTROPIC_PRINCIPLES || {}) ||
      shapeId in (SET_THEORY_SHAPES || {}) ||
      shapeId in (SCHRODINGER_EQUATIONS || {}) ||
      shapeId in (TOPOLOGY_DIFFERENTIAL_SHAPES || {}) ||
      shapeId in (HUMAN_ANATOMY_SHAPES || {}) ||
      shapeId in (DNA_STRUCTURES || {}) ||
      shapeId in (CHAKRA_SHAPES || {}) ||
      shapeId in (TENSOR_ALGEBRA_SHAPES || {}) ||
      shapeId in (ADVANCED_PHYSICS_EQUATIONS || {}) ||
      shapeId in (HISTORICAL_ALGORITHMS || {}) ||
      shapeId in (SEQUENCE_PATTERNS || {}) ||
      shapeId in (SCIENTIFIC_EXPANSION_SHAPES || {}) ||
      shapeId in (FIELD_THEORY_SHAPES || {}) ||
      shapeId in (ADVANCED_TOPOLOGICAL_SURFACES || {}) ||
      shapeId in (WAVE_ALGORITHMS_SHAPES || {}) ||
      shapeId in (GENERATIVE_ALGORITHMS || {}) ||
      shapeId in (MULTIDIMENSIONAL_FRACTALS || {}) ||
      shapeId in (NOISE_FUNCTIONS || {}) ||
      shapeId in (VORONOI_SYSTEMS || {}) ||
      shapeId in (ATTRACTOR_SYSTEMS || {}) ||
      shapeId in (DIFFERENTIAL_GROWTH || {}) ||
      shapeId in (FOUR_DIMENSIONAL_SHAPES || {}) ||
      shapeId in (TEMPORAL_GEOMETRY || {}) ||
      shapeId in (QUANTUM_PARAMETRIC_FUNCTIONS || {}) ||
      shapeId in (QUANTUM_COMPUTING_ALGORITHMS || {}) ||
      shapeId in (QPU_QUANTUM_COMPUTING_SHAPES || {}) ||
      shapeId in (AI_ML_ALGORITHMS || {}) ||
      shapeId in (EARTH_SCIENCES_SHAPES || {}) ||
      shapeId in (EDUCATIONAL_SURFACES || {}) ||
      shapeId in (ENTANGLEMENT_ALGORITHMS || {}) ||
      shapeId in (EXCLUSIVE_SHAPES || {}) ||
      shapeId in (FRACTAL_ANALYSIS_SHAPES || {}) ||
      shapeId in (HYPERCOMPUTATION_SURFACES || {}) ||
      shapeId in (LIFE_SCIENCES_SHAPES || {}) ||
      shapeId in (MECHANICAL_SHAPES || {}) ||
      shapeId in (MODULO_ALGORITHMS || {}) ||
      shapeId in (AI_ML_MODULO || {}) ||
      shapeId in (NETWORKING_MODULO || {}) ||
      shapeId in (OS_LOWLEVEL_MODULO || {}) ||
      shapeId in (NEURAL_LATTICE_ALGORITHMS || {}) ||
      shapeId in (NON_EUCLIDEAN_SHAPES || {}) ||
      shapeId in (RIEMANN_SURFACES || {}) ||
      shapeId in (ASTROPHYSICAL_PHENOMENA || {}) ||
      shapeId in (PROTEIN_STRUCTURES || {}) ||
      shapeId in (POLYMER_CHAINS || {}) ||
      shapeId in (TISSUE_STRUCTURES || {}) ||
      shapeId in (EXTENDED_CRYSTALS || {}) ||
      shapeId in (SACRED_GEOMETRY || {}) ||
      shapeId in (REAL_WORLD_OBJECTS || {}) ||
      shapeId in (WEATHER_SYSTEMS || {}) ||
      shapeId in (ASTRONOMICAL_OBJECTS || {}) ||
      shapeId in (CONSCIOUSNESS_THEORY || {}) ||
      shapeId in (ADVANCED_PHYSICS_SIMS || {}) ||
      shapeId in (HYDROGEN_ORBITALS || {}) ||
      shapeId in (FINANCIAL_MATHEMATICS || {}) ||
      shapeId in (CATEGORY_THEORY || {}) ||
      shapeId in (GROUP_THEORY || {}) ||
      shapeId in (MATHEMATICAL_CONSTANTS || {}) ||
      shapeId in (UNIFIED_MATH_SYMBOLS || {}) ||
      shapeId in (UNIVERSAL_MATHEMATICS || {}) ||
      shapeId in (NON_EUCLIDEAN_GEOMETRIES || {}) ||
      shapeId in (NATIONAL_MOTTO_ALGORITHMS || {}) ||
      shapeId in (QUANTUM_GAP_SURFACES || {}) ||
      shapeId in (COSMIC_HISTORY_GAPS || {}) ||
      shapeId in (COMPLETE_MISSING_SHAPES || {}) ||
      shapeId in (PARAMETRIC_LIBRARY_PACK || {}) ||
      shapeId in (YEGANEH_EAGLE_SHAPE || {}) ||
      shapeId in (FRACTAL_SHAPE_IMPLEMENTATIONS || {}) ||
      // IFS Fractal shapes — GPU raymarched, no CPU parametric implementation needed
      IFS_GPU_SHAPES.has(shapeId)
    );
  }
  
  /**
   * Get a safe shape fallback that's guaranteed to be implemented
   */
  getSafeShapeFallback(): string {
    // Return a basic shape that's definitely implemented
    const safeShapes = ['sphere', 'cube', 'torus', 'cylinder'];
    for (const shape of safeShapes) {
      if (this.isShapeImplemented(shape)) {
        return shape;
      }
    }
    return 'sphere'; // Ultimate fallback
  }
  
  /**
   * Get implementation status for debugging
   */
  getRegistryStatus(): ShapeRegistryStatus | null {
    return this.registryStatus;
  }
  
  /**
   * Extract detailed list of missing shapes by category for debugging
   */
  getMissingShapesDetailed(): Record<string, string[]> {
    if (!this.registryStatus) {
      this.validateRegistry();
    }
    
    const missingByCategory: Record<string, string[]> = {};
    
    SHAPE_CATEGORIES.forEach(category => {
      const categoryMissing: string[] = [];
      
      category.shapes.forEach(shape => {
        if (!this.isShapeImplemented(shape)) {
          categoryMissing.push(shape);
        }
      });
      
      if (categoryMissing.length > 0) {
        missingByCategory[category.name] = categoryMissing;
      }
    });
    
    return missingByCategory;
  }
  
  /**
   * Generate prioritized implementation list
   */
  getPriorityImplementationList(): Array<{
    shape: string;
    category: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    reason: string;
  }> {
    const missingByCategory = this.getMissingShapesDetailed();
    const priorityList: Array<{
      shape: string;
      category: string; 
      priority: 'critical' | 'high' | 'medium' | 'low';
      reason: string;
    }> = [];
    
    Object.entries(missingByCategory).forEach(([categoryName, shapes]) => {
      shapes.forEach(shape => {
        let priority: 'critical' | 'high' | 'medium' | 'low' = 'low';
        let reason = 'Standard missing implementation';
        
        // Critical: Core mathematical concepts
        if (shape.includes('einstein') || shape.includes('relativity') || 
            shape.includes('quantum') || shape.includes('mandelbrot')) {
          priority = 'critical';
          reason = 'Core mathematical/physics concept';
        }
        // High: Common educational shapes
        else if (categoryName.includes('basic') || categoryName.includes('platonic') ||
                 shape.includes('sphere') || shape.includes('cube')) {
          priority = 'high';
          reason = 'Basic educational shape';
        }
        // Medium: Advanced but specialized
        else if (categoryName.includes('advanced') || shape.includes('fractal')) {
          priority = 'medium';
          reason = 'Advanced specialized visualization';
        }
        
        priorityList.push({
          shape,
          category: categoryName,
          priority,
          reason
        });
      });
    });
    
    // Sort by priority
    const priorityOrder = { 'critical': 0, 'high': 1, 'medium': 2, 'low': 3 };
    priorityList.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return priorityList;
  }
  
  /**
   * Perform runtime validation before shape rendering
   */
  validateShapeBeforeRender(shapeId: string): {
    isValid: boolean;
    fallbackShape?: string;
    warning?: string;
  } {
    if (this.isShapeImplemented(shapeId)) {
      return { isValid: true };
    }
    
    const fallbackShape = this.getSafeShapeFallback();
    const warning = `Shape '${shapeId}' not implemented, using '${fallbackShape}' as fallback`;
    
    // Log warning only once per shape to avoid spam
    if (!this._loggedWarnings) {
      this._loggedWarnings = new Set();
    }
    
    if (!this._loggedWarnings.has(shapeId)) {
      console.warn('⚠️ Shape Registry Guard:', warning);
      this._loggedWarnings.add(shapeId);
    }
    
    return {
      isValid: false,
      fallbackShape,
      warning
    };
  }
  
  private _loggedWarnings?: Set<string>;
  
  /**
   * Generate emergency implementations for critical missing shapes
   */
  generateEmergencyImplementations(): Record<string, any> {
    if (!this.registryStatus) {
      this.validateRegistry();
    }
    
    const emergencyShapes: Record<string, any> = {};
    
    // Only process first 50 missing shapes to avoid performance issues
    const criticalMissing = this.registryStatus!.missingShapes.slice(0, 50);
    
    criticalMissing.forEach(shapeId => {
      const displayName = shapeId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Generate shape-specific implementations based on name patterns
      let shapeType = 'torus';
      if (shapeId.includes('relativity') || shapeId.includes('metric')) shapeType = 'curved_spacetime';
      if (shapeId.includes('quantum') || shapeId.includes('wave')) shapeType = 'wave_function';
      if (shapeId.includes('fractal') || shapeId.includes('mandel')) shapeType = 'fractal';
      
      emergencyShapes[shapeId] = {
        name: `${displayName} (Auto-Generated)`,
        equation: (u: number, v: number, params: any) => {
          const { a = 1, b = 1, c = 1, d = 0 } = params;
          
          switch(shapeType) {
            case 'curved_spacetime':
              // Spacetime curvature approximation
              const x = (u - 0.5) * a * 4;
              const y = (v - 0.5) * b * 4;
              const r = Math.sqrt(x*x + y*y + 0.1);
              const z = c * (-1 / (r + d) + 0.5);
              return [x, y, z];
              
            case 'wave_function':
              // Wave equation
              const kx = u * Math.PI * 4;
              const ky = v * Math.PI * 4;
              const wave_x = a * Math.cos(kx);
              const wave_y = b * Math.sin(ky);
              const wave_z = c * Math.sin(kx + ky + d);
              return [wave_x, wave_y, wave_z];
              
            case 'fractal':
              // Fractal-like surface
              const fx = (u - 0.5) * a * 2;
              const fy = (v - 0.5) * b * 2;
              const iterations = 5;
              let zr = 0, zi = 0;
              for(let i = 0; i < iterations; i++) {
                const temp = zr*zr - zi*zi + fx;
                zi = 2*zr*zi + fy;
                zr = temp;
              }
              return [fx, fy, Math.tanh(zr) * c];
              
            default:
              // Enhanced torus with more variation
              const torusR = a + 0.3 * Math.sin(u * 6 * Math.PI);
              const torusr = b * 0.3 * (1 + 0.2 * Math.cos(v * 8 * Math.PI));
              const phi = u * 2 * Math.PI;
              const theta = v * 2 * Math.PI + d;
              
              const torus_x = (torusR + torusr * Math.cos(theta)) * Math.cos(phi);
              const torus_y = (torusR + torusr * Math.cos(theta)) * Math.sin(phi);
              const torus_z = c * torusr * Math.sin(theta);
              return [torus_x, torus_y, torus_z];
          }
        },
        defaultParams: {
          a: 1.5,
          b: 1.2,
          c: 1.0,
          d: 0.0
        }
      };
    });
    
    console.log(`🆘 Generated ${Object.keys(emergencyShapes).length} emergency implementations`);
    return emergencyShapes;
  }
}

// Initialize guard and validate on module load
const shapeGuard = ShapeRegistryGuard.getInstance();
shapeGuard.validateRegistry();

export default shapeGuard;
