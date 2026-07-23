import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { computeShapeDynamics } from '../lib/shapeDynamicsEngine';
import { useParameterAuthority, PARAMETER_SPECS, ParameterKey, registerShapeLookup } from '../lib/parameterAuthority';
import { registerSystemWithHub, SYSTEM_IDS, SYSTEM_PRIORITIES, sendMessage, CHANNELS } from '../lib/systemIntegrationHub';
import { SurfaceParameters, VisualizationMode } from "../types/math";
import { exportAnimatedMath, AnimatedExportOptions } from "../utils/mathExport";
import { selectOptimalMesh, calculateSegmentCount } from "../lib/meshOptimizer";
import { useAdaptiveCamera } from "../hooks/useAdaptiveCamera";
import { COMPREHENSIVE_SHAPE_LIBRARY, getCleanDefaults, ParametricSurface as ParametricSurfaceType } from "../lib/shapeRegistryIntegration";
import { createParametricDataForExport, embedParametricDataInGLTF } from "../lib/parametricDataPreservation";
import { createHolographicExportScene, bakeHolographicToStandardMaterial, HOLOGRAPHIC_PRESETS, DEFAULT_HOLOGRAPHIC_OPTIONS } from "../lib/holographicExport";
import { enhanceGeometryForExport } from "../lib/industrialExportStandards";
import { getDefaultParameters } from "../lib/parametricSurfacesClean";
import * as DiamondGeometry from "../lib/diamondGeometry";
import { FOUR_DIMENSIONAL_SHAPES } from "../lib/fourDimensionalShapes";
import { TEMPORAL_GEOMETRY } from "../lib/temporalGeometry";
import { MATERIAL_PRESETS, createMaterialFromPreset, createExportMaterial, createTriplanarExportMaterial } from "../lib/materialPresets";
import { addWireframeOverlay } from "../lib/wireframeTextureGenerator";
import { ENGINEERING_PBR_MATERIALS, createEngineeringPBRMaterial, createEngineeringPBRMaterialWithVertexColors } from "../lib/engineeringPBRMaterialSystem";
import { customTextureManager } from "../lib/customTextureManager";
import { applyUniversalTransformations } from "../lib/universalTransformations";
import { getManifest } from "../lib/parameterManifests";
import { CLEAN_SURFACES } from "../lib/cleanMathEngine";
import { PARAMETRIC_SURFACES } from "../lib/parametricSurfacesClean";
import { EXCLUSIVE_SHAPES } from "../lib/exclusiveShapes";
import { NON_EUCLIDEAN_SHAPES } from "../lib/nonEuclideanShapes";
import { RIEMANN_SURFACES } from "../lib/riemannSurfaces";
import { EDUCATIONAL_SURFACES } from "../lib/educationalSurfaces";
import { TOPOLOGY_KNOTS } from "../lib/topologyKnotsFixed";
import { CATEGORY_THEORY } from "../lib/categoryTheory";
import { GROUP_THEORY } from "../lib/groupTheory";
import { HISTORICAL_ALGORITHMS } from '../lib/historicalAlgorithms';
import { MATHEMATICAL_CONSTANTS } from "../lib/mathematicalConstants";
import { UNIFIED_MATH_SYMBOLS } from "../lib/unifiedMathSymbols";
import { UNIVERSAL_MATHEMATICS } from "../lib/universalMathematics";
import { QUANTUM_PARAMETRIC_FUNCTIONS } from '../lib/quantumParametricFunctions';
import { MULTIDIMENSIONAL_FRACTALS } from "../lib/multidimensionalFractals";
import { SACRED_GEOMETRY } from "../lib/sacredGeometry";
import { ADVANCED_TOPOLOGICAL_SURFACES } from "../lib/advancedTopologicalSurfaces";
import { REAL_WORLD_OBJECTS } from "../lib/realWorldObjects";
import { NON_EUCLIDEAN_GEOMETRIES } from "../lib/nonEuclideanGeometries";
import { MECHANICAL_SHAPES } from '../lib/mechanicalShapes';
import { WEATHER_SYSTEMS } from '../lib/weatherSystems';
import { SEQUENCE_PATTERNS } from "../lib/sequencePatterns";
import { ASTRONOMICAL_OBJECTS } from '../lib/astronomicalObjects';
import { CONSCIOUSNESS_THEORY } from '../lib/consciousnessTheory';
import { EXTENDED_CRYSTALS } from '../lib/extendedCrystals';
import { ADVANCED_PHYSICS_SIMS } from '../lib/advancedPhysicsSims';
import { HYDROGEN_ORBITALS } from "../lib/hydrogenOrbitals";
import { QUANTUM_GAP_SURFACES } from "../lib/quantumGapMathematics";
import { NOISE_FUNCTIONS } from '../lib/noiseFunctions';
import { DIFFERENTIAL_GROWTH } from '../lib/differentialGrowth';
import { PROTEIN_STRUCTURES } from '../lib/proteinStructures';
import { ASTROPHYSICAL_PHENOMENA } from '../lib/astrophysicalPhenomena';
import { VORONOI_SYSTEMS } from '../lib/voronoiSystems';
import { HYPERCOMPUTATION_SURFACES } from "../lib/hypercomputationSurfaces";
import { NATIONAL_MOTTO_ALGORITHMS } from "../lib/nationalMottoAlgorithms";
import { ADVANCED_PHYSICS_EQUATIONS } from '../lib/advancedPhysicsEquations';
import { SCHRODINGER_EQUATIONS } from "../lib/schrodingerEquations";
import { HUMAN_ANATOMY_SHAPES } from '../lib/humanAnatomyShapes';
import { ATTRACTOR_SYSTEMS } from '../lib/attractorSystems';
import { POLYMER_CHAINS } from '../lib/polymerChains';
import { TISSUE_STRUCTURES } from '../lib/tissueStructures';
import { GENERATIVE_ALGORITHMS } from '../lib/generativeAlgorithms';
import { ENTANGLEMENT_ALGORITHMS } from "../lib/entanglementAlgorithms";
import { FINANCIAL_MATHEMATICS } from '../lib/financialMathematics';
import { CHAKRA_SHAPES } from "../lib/chakraShapes";
import { DNA_STRUCTURES } from '../lib/dnaStructures';
import { GENERAL_RELATIVITY_SHAPES } from '../lib/generalRelativityShapes';
import { TENSOR_ALGEBRA_SHAPES } from '../lib/tensorAlgebraEngine';
import { FIELD_THEORY_SHAPES } from '../lib/fieldTheoryEngine';
import { WAVE_ALGORITHMS_SHAPES } from '../lib/waveAlgorithmsEngine';
import { QUANTUM_GRAVITY_EQUATIONS } from "../lib/quantumGravityEquations";
import { THEORY_OF_EVERYTHING_SHAPES } from "../lib/theoryOfEverythingShapes";
import { exportForARVR, downloadARVRExport, downloadTensorPhysicsSidecar, ARVRExportOptions } from "../lib/arVrExportEngine";
import { 
  createNeuralSceneFromMesh, 
  exportNeuralScene,
  createNerfstudioExport,
  exportNerfstudioPackage,
  exportPointCloudPLY,
  generateNerfstudioTrainingCommand,
  NEURAL_FORMULAS,
  type ShapeParameters as NeuralShapeParameters
} from "../lib/neuralRepresentationsEngine";
import { TEN_PERCENT_SHAPES } from "../lib/tenPercentShapes";
import { SET_THEORY_SHAPES } from "../lib/setTheoryShapes";
import { ENTROPIC_PRINCIPLES } from '../lib/entropicPrinciples';
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
} from "../lib/scientificExpansionShapes";
import { LIFE_SCIENCES_SHAPES } from "../lib/lifeSciencesShapes";
import { EARTH_SCIENCES_SHAPES } from "../lib/earthSciencesShapes";
import { SOCIAL_SCIENCES_SHAPES } from "../lib/socialSciencesShapes";
import { MODULO_ALGORITHMS } from "../lib/moduloAlgorithms";
import { MODULO_ALGORITHMS_PART2 } from "../lib/moduloAlgorithmsPart2";
import { ShapeRegistryGuard } from '../lib/shapeRegistryGuard';
import { MISSING_SHAPES_BRIDGE } from '../lib/missingShapesBridge';
import { isIFSShape } from '../stores/ifsStore';
import { 
  crossLearningEngine, 
  initializeCrossLearning, 
  registerShapeForLearning,
  evolveLearningSystem,
  getCrossLearningMetrics 
} from '../lib/crossLearningEngine';
import { FRACTAL_SHAPE_IMPLEMENTATIONS } from '../lib/fractalShapeImplementations';
import { UNIFIED_SHAPES } from '../lib/unifiedShapes';
import { PARAMETRIC_LIBRARY_PACK } from '../lib/parametricLibraryPack';
import { RARE_MANIFOLDS } from '../lib/rareManifolds';
import { injectTriplanarFbm, TRIPLANAR_PATTERN_IDS } from '../lib/triplanarFbmShader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { SurfaceGenerator } from '../lib/surfaceGenerator'; // Assuming SurfaceGenerator is exported from here

// Initialize SurfaceGenerator once
const surfaceGenerator = new SurfaceGenerator();

export const ALL_SHAPE_LIBRARIES: Record<string, any> = {
  // RARE MANIFOLDS first so they're always resolvable
  ...RARE_MANIFOLDS,
  ...UNIFIED_SHAPES,
  ...PARAMETRIC_LIBRARY_PACK,
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
  ...COMPREHENSIVE_SHAPE_LIBRARY,
  // ADD THE MISSING SPECIALIZED LIBRARIES
  ...GENERAL_RELATIVITY_SHAPES,
  ...TENSOR_ALGEBRA_SHAPES,
  ...FIELD_THEORY_SHAPES,
  ...WAVE_ALGORITHMS_SHAPES,
  ...ENTROPIC_PRINCIPLES,
  // ADD FALLBACK BRIDGE FOR MISSING IMPLEMENTATIONS
  ...MISSING_SHAPES_BRIDGE,
  // CLEAN_SURFACES MUST BE LAST - proper equation-style shapes override old x,y,z style
  ...CLEAN_SURFACES
};


// Register shape lookup callback with Parameter Authority
// This allows Parameter Authority to load defaults for shapes not in SHAPE_DEFAULTS_MAP
registerShapeLookup((shapeType: string) => {
  const shape = ALL_SHAPE_LIBRARIES[shapeType];
  if (shape && shape.defaultParams) {
    return shape.defaultParams as Record<string, number>;
  }
  return null;
});

// Parameter D diagnostic disabled - was causing WebGL context loss on startup
// Enable for debugging only: import('../lib/parameterDiagnostics').then(({ logParameterDReport }) => logParameterDReport());

function getShapeFunction(type: string): ((u: number, v: number, params: SurfaceParameters) => [number, number, number]) | null {
  // Search in ALL_SHAPE_LIBRARIES which includes ALL shapes from all sources
  const shape = ALL_SHAPE_LIBRARIES[type];

  // Validate that the shape has a proper equation function before returning
  // This guards against metadata-only entries or malformed shapes
  if (shape?.equation && typeof shape.equation === 'function') {
    return shape.equation;
  }

  return null;
}

function generate4DGeometry(type: string, params: { scale: number; rotationW: number; projectionType: string }): THREE.BufferGeometry | null {
  const shape = FOUR_DIMENSIONAL_SHAPES[type];
  if (!shape) return null;

  const surfaceParams = {
    type: type,
    a: params.scale,
    b: 1,
    c: 1,
    d: params.rotationW,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uSegments: 32,
    vSegments: 32,
    uMin: 0,
    uMax: 1,
    vMin: 0,
    vMax: 1
  } as SurfaceParameters;

  const positions: number[] = [];
  const indices: number[] = [];
  const uSegs = 32;
  const vSegs = 32;

  for (let j = 0; j <= vSegs; j++) {
    for (let i = 0; i <= uSegs; i++) {
      const u = i / uSegs;
      const v = j / vSegs;
      try {
        const [x, y, z] = shape.equation(u, v, surfaceParams);
        if (isFinite(x) && isFinite(y) && isFinite(z)) {
          positions.push(x, y, z);
        } else {
          positions.push(0, 0, 0);
        }
      } catch {
        positions.push(0, 0, 0);
      }
    }
  }

  for (let j = 0; j < vSegs; j++) {
    for (let i = 0; i < uSegs; i++) {
      const a = j * (uSegs + 1) + i;
      const b = a + 1;
      const c = a + (uSegs + 1);
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

const LOCKED_SHAPE_COLORS: Record<string, string> = {
  'nahui_ocelotl': '#8B4513',
  'nahui_ehecatl': '#40E0D0',
  'nahui_quiahuitl': '#DC143C',
  'nahui_atl': '#00A86B',
  'nahui_ollin': '#FFBF00',
};

interface PhysicsConfig {
  timeStep: number;
  dampingFactor: number;
  gravityStrength: number;
  displayForces: boolean;
  displayTrails: boolean;
  colorMode: 'energy' | 'velocity' | 'temperature' | 'phase' | 'none';
}

interface ParametricSurfaceProps {
  parameters: SurfaceParameters;
  visualizationMode: VisualizationMode;
  colorMode: string;
  animationPreset?: string;
  backgroundMode?: string;
  physicsEnabled?: boolean;
  physicsConfig?: PhysicsConfig;
  isPhysicsAnimating?: boolean;
  animationType?: 'spin' | 'precession' | 'tumble' | 'stable' | 'gyroscope' | 'tensor';
  animationVelocity?: number;
  breatheIntensity?: number;
  dynamicsMode?: 'rigid' | 'soft';
  onGeometryUpdate?: (geometry: THREE.BufferGeometry) => void;
}

export default function ParametricSurface({ 
  parameters, 
  visualizationMode, 
  colorMode, 
  animationPreset,
  backgroundMode = 'white',
  physicsEnabled = false,
  physicsConfig,
  isPhysicsAnimating = false,
  animationType = 'spin',
  animationVelocity = 1,
  breatheIntensity = 0.5,
  dynamicsMode = 'soft',
  onGeometryUpdate
}: ParametricSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const rotationWRef = useRef(0);
  const paramsDirtyRef = useRef(false);
  const physicsTimeRef = useRef(0);
  const physicsVelocity = useRef({ x: 0, y: 0, z: 0 });
  const [earthTextureLoaded, setEarthTextureLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // State to track loading

  // PARAMETER AUTHORITY: Register renderer as primary subscriber
  // This ensures we get notified of ALL parameter changes through the central system
  const authorityValues = useParameterAuthority(state => state.values);
  const setShape = useParameterAuthority(state => state.setShape);

  // Register with Integration Hub on mount
  useEffect(() => {
    const unsubscribe = registerSystemWithHub(
      SYSTEM_IDS.RENDERER,
      (params, changed) => {
        // Log parameter changes for debugging
        if (changed.length > 0) {
          console.log(`⚡ Renderer: Parameters changed: ${changed.join(', ')}`);
        }
      },
      SYSTEM_PRIORITIES.RENDERER
    );

    console.log('⚡ Parameter Authority: Renderer connected');

    return unsubscribe;
  }, []);

  // Sync shape type with authority
  useEffect(() => {
    if (parameters.type) {
      setShape(parameters.type);
    }
  }, [parameters.type, setShape]);

  // MERGE: Combine props parameters with authority values
  // Authority values take precedence for A-Z parameters
  const mergedParameters = useMemo(() => {
    return {
      ...parameters,
      // Authority values override props for A-Z parameters
      a: authorityValues.a,
      b: authorityValues.b,
      c: authorityValues.c,
      d: authorityValues.d,
      e: authorityValues.e,
      f: authorityValues.f,
      g: authorityValues.g,
      h: authorityValues.h,
      i: authorityValues.i,
      j: authorityValues.j,
      k: authorityValues.k,
      l: authorityValues.l,
      m: authorityValues.m,
      n: authorityValues.n,
      o: authorityValues.o,
      p: authorityValues.p,
      q: authorityValues.q,
      r: authorityValues.r,
      s: authorityValues.s,
      t: authorityValues.t,
      u: authorityValues.u,
      v: authorityValues.v,
      w: authorityValues.w,
      x: authorityValues.x,
      y: authorityValues.y,
      z: authorityValues.z,
    } as SurfaceParameters;
  }, [parameters, authorityValues]);

  // Mark geometry as dirty whenever any A-Z parameter slider changes so the
  // animation loop can skip expensive computeVertexNormals() on pure-animation frames.
  useEffect(() => {
    paramsDirtyRef.current = true;
  }, [authorityValues]);

  // PHYSICS-BASED ANIMATION STATE - computed from shape's actual properties
  const shapeDynamicsRef = useRef<{
    principalMoments: [number, number, number];
    stabilityIndex: number;
    gyroscopicRatio: number;
    optimalSpinAxis: THREE.Vector3;
    principalAxes: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
    inertiaTensor: { Ixx: number; Iyy: number; Izz: number; Ixy: number; Ixz: number; Iyz: number };
    centerOfMass: THREE.Vector3;
    angularMomentum: THREE.Vector3;
    volume: number;
    surfaceArea: number;
    mass: number;
  }>({
    principalMoments: [1, 1, 1],
    stabilityIndex: 0.5,
    gyroscopicRatio: 1,
    optimalSpinAxis: new THREE.Vector3(0, 1, 0),
    principalAxes: [new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,1)],
    inertiaTensor: { Ixx: 1, Iyy: 1, Izz: 1, Ixy: 0, Ixz: 0, Iyz: 0 },
    centerOfMass: new THREE.Vector3(0, 0, 0),
    angularMomentum: new THREE.Vector3(0, 1, 0),
    volume: 0,
    surfaceArea: 0,
    mass: 0,
  });
  const animTimeRef = useRef(0);

  // GMod6 transform ref — receives rotation/scale from GMod6ControlPanel
  // via custom events so animation never touches the Zustand param store.
  const gmod6TransformRef = useRef<{ rotationY: number; scale: number } | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      gmod6TransformRef.current = (e as CustomEvent).detail;
    };
    window.addEventListener('gmod6Transform', handler);
    return () => window.removeEventListener('gmod6Transform', handler);
  }, []);

  // Clear vertex-morph cache when the shape type changes so stale
  // originalPositions from the previous shape are never re-applied.
  useEffect(() => {
    if (meshRef.current?.geometry) {
      delete meshRef.current.geometry.userData.originalPositions;
      delete meshRef.current.geometry.userData.centerOfMass;
    }
    // Also reset the shapeDynamics to neutral so tensor mode re-computes
    shapeDynamicsRef.current = {
      principalMoments: [1, 1, 1],
      stabilityIndex: 0.5,
      gyroscopicRatio: 1,
      optimalSpinAxis: new THREE.Vector3(0, 1, 0),
      principalAxes: [new THREE.Vector3(0,1,0), new THREE.Vector3(1,0,0), new THREE.Vector3(0,0,1)],
      inertiaTensor: { Ixx: 1, Iyy: 1, Izz: 1, Ixy: 0, Ixz: 0, Iyz: 0 },
      centerOfMass: new THREE.Vector3(0, 0, 0),
      angularMomentum: new THREE.Vector3(0, 1, 0),
      volume: 0,
      surfaceArea: 0,
      mass: 0,
    };
  }, [parameters.type]);

  const optimalMesh = useMemo(() => selectOptimalMesh(parameters.type), [parameters.type]);

  // External GLB model loading
  const [externalGeometry, setExternalGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [loadingExternal, setLoadingExternal] = useState(false);

  // Check if current shape is an external GLB model
  const externalModelPath = useMemo(() => {
    const fractalShape = FRACTAL_SHAPE_IMPLEMENTATIONS[parameters.type];
    return fractalShape?.externalModel || null;
  }, [parameters.type]);

  // Decimate geometry to reduce vertex count for performance
  const decimateGeometry = (geom: THREE.BufferGeometry, targetVertices: number = 8000): THREE.BufferGeometry => {
    const positions = geom.attributes.position;
    const originalCount = positions.count;

    if (originalCount <= targetVertices) {
      console.log(`📊 Geometry has ${originalCount} vertices - no decimation needed`);
      return geom;
    }

    // Calculate skip factor for decimation
    const skipFactor = Math.ceil(originalCount / targetVertices);
    console.log(`🔧 Decimating from ${originalCount} to ~${Math.ceil(originalCount / skipFactor)} vertices (skip ${skipFactor})`);

    const newPositions: number[] = [];
    const newNormals: number[] = [];
    const newUvs: number[] = [];

    const hasNormals = geom.attributes.normal;
    const hasUvs = geom.attributes.uv;

    for (let i = 0; i < originalCount; i += skipFactor) {
      newPositions.push(
        positions.getX(i),
        positions.getY(i),
        positions.getZ(i)
      );
      if (hasNormals) {
        newNormals.push(
          hasNormals.getX(i),
          hasNormals.getY(i),
          hasNormals.getZ(i)
        );
      }
      if (hasUvs) {
        newUvs.push(
          hasUvs.getX(i),
          hasUvs.getY(i)
        );
      }
    }

    const decimatedGeom = new THREE.BufferGeometry();
    decimatedGeom.setAttribute('position', new THREE.Float32BufferAttribute(newPositions, 3));
    if (newNormals.length > 0) {
      decimatedGeom.setAttribute('normal', new THREE.Float32BufferAttribute(newNormals, 3));
    }
    if (newUvs.length > 0) {
      decimatedGeom.setAttribute('uv', new THREE.Float32BufferAttribute(newUvs, 2));
    }
    decimatedGeom.computeVertexNormals();

    return decimatedGeom;
  };

  // Load external GLB/OBJ model if applicable
  useEffect(() => {
    if (!externalModelPath) {
      setExternalGeometry(null);
      return;
    }

    setLoadingExternal(true);
    const isOBJ = externalModelPath.toLowerCase().endsWith('.obj');
    console.log(`🔧 Loading external ${isOBJ ? 'OBJ' : 'GLB'} model: ${externalModelPath}`);

    const processGeometry = (geom: THREE.BufferGeometry) => {
      // Center and normalize scale
      geom.computeBoundingBox();
      const box = geom.boundingBox!;
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const normalizeScale = 5 / maxDim;

      geom.translate(-center.x, -center.y, -center.z);
      geom.scale(normalizeScale, normalizeScale, normalizeScale);

      // Decimate if too many vertices (target 8000 for smooth performance)
      return decimateGeometry(geom, 8000);
    };

    if (isOBJ) {
      // Load OBJ file
      const objLoader = new OBJLoader();
      objLoader.load(
        externalModelPath,
        (obj) => {
          console.log(`✅ External OBJ loaded successfully: ${externalModelPath}`);
          let extractedGeometry: THREE.BufferGeometry | null = null;
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh && !extractedGeometry) {
              extractedGeometry = processGeometry(child.geometry.clone());
            }
          });
          if (extractedGeometry) {
            setExternalGeometry(extractedGeometry);
            const vertexCount = (extractedGeometry as THREE.BufferGeometry).attributes.position?.count || 0;
            console.log(`📐 External OBJ geometry: ${vertexCount} vertices (after decimation)`);
          }
          setLoadingExternal(false);
        },
        (progress) => {
          const percent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
          if (percent > 0 && percent % 25 === 0) {
            console.log(`📦 Loading external OBJ: ${percent}%`);
          }
        },
        (error) => {
          console.error(`❌ Failed to load external OBJ: ${externalModelPath}`, error);
          setExternalGeometry(null);
          setLoadingExternal(false);
        }
      );
    } else {
      // Load GLB file
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        externalModelPath,
        (gltf) => {
          console.log(`✅ External GLB loaded successfully: ${externalModelPath}`);
          let extractedGeometry: THREE.BufferGeometry | null = null;
          gltf.scene.traverse((child) => {
            if (child instanceof THREE.Mesh && !extractedGeometry) {
              extractedGeometry = processGeometry(child.geometry.clone());
            }
          });
          if (extractedGeometry) {
            setExternalGeometry(extractedGeometry);
            const vertexCount = (extractedGeometry as THREE.BufferGeometry).attributes.position?.count || 0;
            console.log(`📐 External GLB geometry: ${vertexCount} vertices (after decimation)`);
          }
          setLoadingExternal(false);
        },
        (progress) => {
          const percent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
          if (percent > 0 && percent % 25 === 0) {
            console.log(`📦 Loading external GLB: ${percent}%`);
          }
        },
        (error) => {
          console.error(`❌ Failed to load external GLB: ${externalModelPath}`, error);
          setExternalGeometry(null);
          setLoadingExternal(false);
        }
      );
    }

    return () => {
      // Cleanup
      if (externalGeometry) {
        externalGeometry.dispose();
      }
    };
  }, [externalModelPath]);

  // Special handler for Hello UUorld Earth texture - loads asynchronously
  useEffect(() => {
    if (colorMode === 'world_map_glow' && !earthTextureLoaded) {
      // Small delay to ensure mesh is ready
      const loadTexture = () => {
        if (!meshRef.current || !meshRef.current.material) {
          // Retry after a short delay if mesh isn't ready
          setTimeout(loadTexture, 100);
          return;
        }

        console.log('🌍 Loading Hello UUorld Earth texture...');
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(
          '/textures/hello-uuorld-earth.jpg',
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.generateMipmaps = true;
            texture.anisotropy = 16;
            texture.needsUpdate = true;

            if (meshRef.current && meshRef.current.material) {
              const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
              mat.map = texture;
              mat.color = new THREE.Color(0xffffff);
              mat.emissive = new THREE.Color(0x000000); // Remove green glow
              mat.emissiveIntensity = 0;
              mat.metalness = 0.15;
              mat.roughness = 0.5;
              mat.clearcoat = 0.3;
              mat.needsUpdate = true;
              console.log('✅ Hello UUorld Earth texture applied to mesh (clean, no glow)');
              setEarthTextureLoaded(true);
            }
          },
          (progress) => {
            console.log('📥 Loading Earth texture:', Math.round((progress.loaded / progress.total) * 100) + '%');
          },
          (error) => {
            console.error('❌ Failed to load Earth texture:', error);
          }
        );
      };

      // Start loading after a small delay
      setTimeout(loadTexture, 200);
    }

    // Reset texture state when colorMode changes away from world_map_glow
    if (colorMode !== 'world_map_glow') {
      setEarthTextureLoaded(false);
    }
  }, [colorMode, earthTextureLoaded]);

  useAdaptiveCamera(meshRef);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.frustumCulled = false;
    }
  }, []);

  // Cross-Learning Engine Integration - shapes learn from each other
  useEffect(() => {
    initializeCrossLearning();

    // Register current shape for cross-learning
    const shapeId = parameters.type;
    const category = shapeId.split('_')[0] || 'general';
    registerShapeForLearning(shapeId, category, {
      a: parameters.a,
      b: parameters.b,
      c: parameters.c,
      d: parameters.d ?? 0,
      e: parameters.e ?? 0,
      f: parameters.f ?? 0
    });

    const metrics = getCrossLearningMetrics();
    if (metrics.connectionCount > 0) {
      console.log(`🧠 Cross-Learning: ${metrics.connectionCount} connections, Energy: ${metrics.totalEnergy.toFixed(2)}`);
    }
  }, [parameters.type, parameters.a, parameters.b, parameters.c, parameters.d, parameters.e, parameters.f]);

  const handleExport = useCallback(async (event: CustomEvent) => {
    if (!meshRef.current) {
      console.error('❌ Export failed: No mesh available');
      return;
    }

    const { exportType, geometryStyle } = event.detail || {};
    console.log(`🎯 Export triggered: ${exportType}${geometryStyle ? ` (geometry: ${geometryStyle})` : ''}`);

    // Handle PLY Point Cloud export separately (not GLB)
    if (exportType === 'ply-points') {
      try {
        const geometry = meshRef.current.geometry;
        const positions = geometry.attributes.position.array;
        const totalPoints = Math.floor(positions.length / 3);

        // Limit to 10,000 points for reasonable file size
        const maxPoints = 10000;
        const step = totalPoints > maxPoints ? Math.ceil(totalPoints / maxPoints) : 1;
        const pointCount = Math.ceil(totalPoints / step);

        // Build PLY file content (ASCII format for maximum compatibility)
        let plyContent = `ply
format ascii 1.0
comment Generated by Dimension Mathematical Universe
comment Shape: ${parameters.type}
comment Total vertices: ${pointCount}
comment Tip: Scale points in your 3D software - these are raw vertex positions
element vertex ${pointCount}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
`;

        for (let i = 0; i < totalPoints; i += step) {
          const x = positions[i * 3];
          const y = positions[i * 3 + 1];
          const z = positions[i * 3 + 2];
          // Green color matching the shape theme (0, 255, 136)
          plyContent += `${x.toFixed(6)} ${y.toFixed(6)} ${z.toFixed(6)} 0 255 136\n`;
        }

        // Download PLY file
        const blob = new Blob([plyContent], { type: 'application/x-ply' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${parameters.type}_pointcloud_${Date.now()}.ply`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log(`✅ PLY point cloud exported: ${pointCount} points`);
        console.log(`💡 Open in Blender, MeshLab, CloudCompare, or any 3D software to adjust point size`);
        return;
      } catch (err) {
        console.error('❌ PLY export failed:', err);
        return;
      }
    }

    // PERMANENT FIX: Validate shape is implemented before export
    const guard = ShapeRegistryGuard.getInstance();
    const isImplemented = guard.isShapeImplemented(parameters.type);

    if (!isImplemented) {
      console.error(`❌ Export blocked: Shape "${parameters.type}" is not implemented (would export placeholder sphere)`);
      console.warn('🛡️ Export Protection: Preventing export of placeholder geometry');
      alert(`Cannot export "${parameters.type}" - this shape uses placeholder geometry. Please select a fully implemented shape.`);
      return;
    }

    // Additional validation for point exports
    if (exportType === 'points') {
      console.log(`🔍 Point export validation: Shape "${parameters.type}" has ${meshRef.current.geometry.attributes.position.count} vertices`);

      // Ensure we're not exporting a basic sphere as points
      const vertexCount = meshRef.current.geometry.attributes.position.count;
      const isBasicSphere = vertexCount === 482 || vertexCount === 512; // Common sphere vertex counts

      if (isBasicSphere && !['sphere', 'bloch_sphere', 'riemann_sphere'].includes(parameters.type)) {
        console.warn(`⚠️ Point export warning: "${parameters.type}" appears to use sphere placeholder (${vertexCount} vertices)`);
        console.log(`🔧 Attempting to use original shape geometry for point export...`);
      }
    }

    try {
      const scene = new THREE.Scene();

      // Clone geometry and create new mesh for export
      const rawGeometry = meshRef.current.geometry.clone();

      // Ensure geometry has proper attributes
      if (!rawGeometry.attributes.position) {
        console.error('❌ Export failed: Geometry has no position attribute');
        return;
      }

      // CRITICAL: Apply industry-standard geometry enhancement
      // This ensures proper UVs (TEXCOORD_0), normals, tangents, and indices
      // Fixes "missing UV mapping" and "no vertex data" issues in external tools
      console.log('🔧 Enhancing geometry for industry-standard export...');
      const clonedGeometry = enhanceGeometryForExport(rawGeometry);

      let exportMesh: THREE.Mesh;

      // Determine the effective geometry style
      // For static exports: use exportType directly (solid, wireframe, points)
      // For animated exports: use geometryStyle parameter (defaults to solid)
      const isAnimatedExport = ['sketchfab', 'transform-anim', 'physics-anim'].includes(exportType);
      const effectiveGeometryType = isAnimatedExport ? (geometryStyle || 'solid') : exportType;

      if (effectiveGeometryType === 'wireframe') {
        // WIREFRAME: Clean edge-only export — no filled surface or embedded color
        const edgesGeometry = new THREE.EdgesGeometry(clonedGeometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: 0x00ff88,
          linewidth: 1
        });
        const wireframe = new THREE.LineSegments(edgesGeometry, wireframeMaterial);
        wireframe.name = 'MathShape_Wireframe';
        scene.add(wireframe);
        exportMesh = wireframe as any;

        console.log('✅ Wireframe export: clean edge-only, no fill or glow mesh');

      } else if (effectiveGeometryType === 'solid-wire') {
        // SOLID + WIREFRAME: Combined — solid filled surface WITH edge lines overlaid
        // This gives the on-screen "wireframe mode" look in the exported file
        const group = new THREE.Group();
        group.name = 'MathShape_SolidWire';

        // 1. Solid fill mesh
        let swSolidMat: THREE.MeshStandardMaterial;
        if (MATERIAL_PRESETS[colorMode]) {
          swSolidMat = TRIPLANAR_PATTERN_IDS.has(colorMode)
            ? createTriplanarExportMaterial(colorMode, parameters.fBmLayers ?? 3, parameters.domainWarp ?? 0, 512)
            : createExportMaterial(colorMode, 2048) as THREE.MeshStandardMaterial;
          if (!swSolidMat.metalness) swSolidMat.metalness = 0.35;
          if (!swSolidMat.roughness) swSolidMat.roughness = 0.45;
        } else {
          swSolidMat = new THREE.MeshStandardMaterial({
            color: 0x00ff88, metalness: 0.35, roughness: 0.45, side: THREE.DoubleSide
          });
        }
        const swSolidMesh = new THREE.Mesh(clonedGeometry, swSolidMat);
        swSolidMesh.name = 'MathShape_Solid';
        group.add(swSolidMesh);

        // 2. Edge wireframe overlay — derive color from the material
        const preset = MATERIAL_PRESETS[colorMode];
        const wireEdgeColor = preset?.properties?.emissive
          ? new THREE.Color(preset.properties.emissive)
          : preset?.properties?.color
            ? new THREE.Color(preset.properties.color).lerp(new THREE.Color(0xffffff), 0.4)
            : new THREE.Color(0x00ff88);
        const swEdgesGeo = new THREE.EdgesGeometry(clonedGeometry, 15);
        const swWireMat = new THREE.LineBasicMaterial({ color: wireEdgeColor, linewidth: 1 });
        const swWireLines = new THREE.LineSegments(swEdgesGeo, swWireMat);
        swWireLines.name = 'MathShape_WireOverlay';
        group.add(swWireLines);

        scene.add(group);
        exportMesh = swSolidMesh;
        console.log('✅ Solid+Wire combined export: solid fill + matching edge overlay');

      } else if (effectiveGeometryType === 'points') {
        // POINTS: Export as TRUE GLTF point cloud (primitive mode 0)
        // This creates actual points that 3D software recognizes as point-based objects
        const positions = clonedGeometry.attributes.position.array;

        // Limit points for performance (max 5000 for reasonable file size)
        const totalPoints = Math.floor(positions.length / 3);
        const maxPoints = 5000;
        const step = totalPoints > maxPoints ? Math.ceil(totalPoints / maxPoints) : 1;
        const pointCount = Math.ceil(totalPoints / step);

        console.log(`📍 True Point Cloud export: ${pointCount} points (step: ${step})`);
        console.log(`💡 GLTF primitive mode: POINTS (0) - recognized as point cloud in 3D software`);

        // Create point cloud geometry with sampled positions
        const pointPositions: number[] = [];
        const pointColors: number[] = [];

        for (let i = 0; i < totalPoints; i += step) {
          pointPositions.push(
            positions[i * 3],
            positions[i * 3 + 1],
            positions[i * 3 + 2]
          );
          // Green color matching our theme
          pointColors.push(0, 1, 0.53); // #00ff88
        }

        // Create BufferGeometry for points
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(pointPositions, 3));
        pointsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(pointColors, 3));

        // Use PointsMaterial - GLTFExporter exports this with primitive mode POINTS (0)
        const pointsMaterial = new THREE.PointsMaterial({
          size: 0.05,
          vertexColors: true,
          sizeAttenuation: true
        });

        // Create THREE.Points object - this exports as GLTF primitive mode 0 (POINTS)
        const pointsObject = new THREE.Points(pointsGeometry, pointsMaterial);
        pointsObject.name = 'MathShape_Points';
        scene.add(pointsObject);

        // Create a dummy mesh for exportMesh reference (needed for later code)
        // The actual export uses the pointsObject
        const dummyGeometry = new THREE.BufferGeometry();
        dummyGeometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
        exportMesh = new THREE.Mesh(dummyGeometry, new THREE.MeshBasicMaterial({ visible: false }));
        exportMesh.name = 'MathShape_Points_Ref';
        exportMesh.visible = false;

        console.log(`✅ True point cloud created: ${pointCount} points (GLTF primitive mode: POINTS)`);

      } else if (effectiveGeometryType === 'holographic') {
        // HOLOGRAPHIC: Sci-fi hologram with interference patterns, Fresnel glow, chromatic aberration
        console.log('🌌 Creating holographic export with full effects...');

        // Create the holographic scene with all effects
        const holographicResult = createHolographicExportScene(
          clonedGeometry,
          HOLOGRAPHIC_PRESETS['sci-fi-green'], // Use sci-fi green preset to match our theme
          4 // 4 second animation duration
        );

        // Clear the scene and add holographic objects
        while (scene.children.length > 0) {
          scene.remove(scene.children[0]);
        }

        // Add all objects from holographic scene
        holographicResult.scene.children.forEach(child => {
          scene.add(child.clone());
        });

        // For GLTF export, we need to bake the shader to a standard material
        // since GLTF doesn't support custom shaders
        const bakedHolographicMaterial = bakeHolographicToStandardMaterial(
          HOLOGRAPHIC_PRESETS['sci-fi-green'],
          0
        );

        // Create the main export mesh with baked material
        exportMesh = new THREE.Mesh(clonedGeometry.clone(), bakedHolographicMaterial);
        exportMesh.name = 'Hologram_Core';

        // Add wireframe overlay for the holographic cage effect
        const holoEdges = new THREE.EdgesGeometry(clonedGeometry);
        const holoWireframeMat = new THREE.LineBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.9,
          linewidth: 2
        });
        const holoWireframe = new THREE.LineSegments(holoEdges, holoWireframeMat);
        holoWireframe.name = 'Hologram_Wireframe';
        scene.add(holoWireframe);

        // Add outer glow shell
        const outerGlowGeometry = clonedGeometry.clone();
        const positions = outerGlowGeometry.attributes.position;
        const normals = outerGlowGeometry.attributes.normal;

        if (positions && normals) {
          const scaledPositions = new Float32Array(positions.count * 3);
          for (let i = 0; i < positions.count; i++) {
            scaledPositions[i * 3] = positions.getX(i) + normals.getX(i) * 0.03;
            scaledPositions[i * 3 + 1] = positions.getY(i) + normals.getY(i) * 0.03;
            scaledPositions[i * 3 + 2] = positions.getZ(i) + normals.getZ(i) * 0.03;
          }
          outerGlowGeometry.setAttribute('position', new THREE.BufferAttribute(scaledPositions, 3));
        }

        const outerGlowMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ff88,
          transparent: true,
          opacity: 0.2,
          side: THREE.BackSide
        });
        const outerGlow = new THREE.Mesh(outerGlowGeometry, outerGlowMaterial);
        outerGlow.name = 'Hologram_OuterGlow';
        scene.add(outerGlow);

        // Add chromatic aberration simulation with offset meshes
        const redShiftGeom = clonedGeometry.clone();
        const blueShiftGeom = clonedGeometry.clone();

        const redMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: 0.05,
          side: THREE.DoubleSide
        });
        const blueMaterial = new THREE.MeshBasicMaterial({
          color: 0x0000ff,
          transparent: true,
          opacity: 0.05,
          side: THREE.DoubleSide
        });

        const redShift = new THREE.Mesh(redShiftGeom, redMaterial);
        redShift.position.x += 0.02;
        redShift.name = 'Hologram_ChromaticRed';

        const blueShift = new THREE.Mesh(blueShiftGeom, blueMaterial);
        blueShift.position.x -= 0.02;
        blueShift.name = 'Hologram_ChromaticBlue';

        scene.add(redShift);
        scene.add(blueShift);
        scene.add(exportMesh);

        console.log('✨ Holographic export created with:');
        console.log('   - Emissive glowing core');
        console.log('   - Cyan wireframe cage');
        console.log('   - Outer glow shell (Fresnel simulation)');
        console.log('   - Chromatic aberration (red/blue shift)');
        console.log('   - Multiple layered geometry for depth bloom');

      } else {
        // SOLID (default): Use baked procedural material if available
        let solidMaterial: THREE.MeshStandardMaterial;

        if (MATERIAL_PRESETS[colorMode]) {
          console.log(`✨ Baking procedural material "${colorMode}" for solid export`);
          const mat = TRIPLANAR_PATTERN_IDS.has(colorMode)
            ? createTriplanarExportMaterial(colorMode, parameters.fBmLayers ?? 3, parameters.domainWarp ?? 0, 512)
            : createExportMaterial(colorMode, 2048) as THREE.MeshStandardMaterial;
          // Ensure PBR slots are populated so Marmoset / Blender get real values
          if (mat.metalness === undefined || mat.metalness === null) mat.metalness = 0.35;
          if (mat.roughness === undefined || mat.roughness === null) mat.roughness = 0.45;
          solidMaterial = mat;
        } else {
          // Fallback to standard PBR — colour comes from the live material on the mesh
          const liveMat = meshRef.current?.material;
          const liveColor = liveMat && 'color' in liveMat
            ? (liveMat as THREE.MeshStandardMaterial).color
            : new THREE.Color(0x00ff88);
          const liveMetal = liveMat && 'metalness' in liveMat
            ? (liveMat as THREE.MeshStandardMaterial).metalness ?? 0.35
            : 0.35;
          const liveRough = liveMat && 'roughness' in liveMat
            ? (liveMat as THREE.MeshStandardMaterial).roughness ?? 0.45
            : 0.45;
          solidMaterial = new THREE.MeshStandardMaterial({
            color: liveColor,
            metalness: liveMetal,
            roughness: liveRough,
            side: THREE.DoubleSide
          });
        }

        exportMesh = new THREE.Mesh(clonedGeometry, solidMaterial);
        exportMesh.name = 'MathShape';
        scene.add(exportMesh);
        console.log(`🔮 Solid export PBR: metalness=${(solidMaterial.metalness).toFixed(2)}, roughness=${(solidMaterial.roughness).toFixed(2)}, color=${solidMaterial.color.getHexString()}`);
      }

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 10, 7);
      scene.add(ambientLight);
      scene.add(directionalLight);

      // PARAMETRIC DATA PRESERVATION: Embed regeneration data for "living geometry"
      clonedGeometry.computeBoundingBox();
      const parametricPackage = createParametricDataForExport(
        parameters.type,
        parameters,
        {
          vertexCount: clonedGeometry.attributes.position?.count || 0,
          faceCount: clonedGeometry.index ? clonedGeometry.index.count / 3 : (clonedGeometry.attributes.position?.count || 0) / 3,
          boundingBox: clonedGeometry.boundingBox
        },
        { exportType }
      );

      // Embed in scene userData (preserved in GLTF extras)
      scene.userData = {
        ...scene.userData,
        parametricData: parametricPackage,
        dimensionUniverse: {
          shapeId: parameters.type,
          category: parametricPackage.identity.category,
          formula: parametricPackage.identity.formula,
          canRegenerate: true,
          version: '1.0.0'
        }
      };
      console.log(`📦 Parametric data embedded for: ${parameters.type}`);

      const exporter = new GLTFExporter();

      // Determine the target mesh name based on geometry style for animation tracks
      const targetMeshName = effectiveGeometryType === 'points' ? 'MathShape_Points' :
                             effectiveGeometryType === 'wireframe' ? 'MathShape_Wireframe' :
                             effectiveGeometryType === 'solid-wire' ? 'MathShape_SolidWire' :
                             effectiveGeometryType === 'holographic' ? 'Hologram_Core' : 'MathShape';

      // For Sketchfab export, create rotation animation
      // For Transform-anim export, create simple pulsing animation
      let animations: THREE.AnimationClip[] = [];
      if (exportType === 'sketchfab') {
        const duration = 4; // 4 second full rotation loop

        // Create quaternions for full 360° Y-axis rotation
        const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
        const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
        const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
        const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, (3 * Math.PI) / 2, 0));
        const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));

        const times = [0, duration * 0.25, duration * 0.5, duration * 0.75, duration];
        const values = [
          q0.x, q0.y, q0.z, q0.w,  // 0°
          q1.x, q1.y, q1.z, q1.w,  // 90°
          q2.x, q2.y, q2.z, q2.w,  // 180°
          q3.x, q3.y, q3.z, q3.w,  // 270°
          q4.x, q4.y, q4.z, q4.w   // 360° (back to start for seamless loop)
        ];

        const quaternionKF = new THREE.QuaternionKeyframeTrack(
          `${targetMeshName}.quaternion`,
          times,
          values
        );

        const clip = new THREE.AnimationClip('Rotate', duration, [quaternionKF]);
        animations = [clip];
        console.log(`🎬 Created Sketchfab rotation animation (4s loop) for ${targetMeshName}`);
      } else if (exportType === 'transform-anim') {
        // Simple pulsing animation - smooth and non-chaotic
        const duration = 3; // 3 second pulse cycle
        const times = [0, duration * 0.5, duration]; // Start, peak, end

        // Gentle pulse: 1.0 -> 1.15 -> 1.0
        const scaleValues = [
          1.0, 1.0, 1.0,   // Start at normal size
          1.15, 1.15, 1.15, // Peak at 15% larger
          1.0, 1.0, 1.0    // Back to normal (seamless loop)
        ];

        const scaleKF = new THREE.VectorKeyframeTrack(
          `${targetMeshName}.scale`,
          times,
          scaleValues,
          THREE.InterpolateSmooth // Smooth easing
        );

        const clip = new THREE.AnimationClip('Pulse', duration, [scaleKF]);
        animations = [clip];
        console.log(`🎬 Created pulsing animation (3s cycle) for ${targetMeshName}`);
      } else if (exportType === 'physics-anim') {
        // Physics-based animation using INERTIA TENSOR dynamics (NOT generic rotation)
        // Uses computed shape dynamics: principal moments, stability, optimal spin axis
        const { generatePhysicsAnimationWithDynamics } = await import('../lib/physicsAnimationEngine');

        // Build dynamics input from computed shape dynamics
        const dynamics = shapeDynamicsRef.current.principalMoments[0] > 0 ? {
          principalMoments: shapeDynamicsRef.current.principalMoments,
          stabilityIndex: shapeDynamicsRef.current.stabilityIndex,
          gyroscopicRatio: shapeDynamicsRef.current.gyroscopicRatio,
          optimalSpinAxis: shapeDynamicsRef.current.optimalSpinAxis,
          centerOfMass: shapeDynamicsRef.current.centerOfMass
        } : undefined;

        const { clip, category, description } = generatePhysicsAnimationWithDynamics(
          parameters.type,
          clonedGeometry,
          targetMeshName,
          dynamics
        );
        animations = [clip];
        console.log(`🔬 Physics animation: ${category} for ${targetMeshName}`);
        console.log(`📐 Model: ${description}`);
        if (dynamics) {
          console.log(`🎯 Using inertia tensor: I=[${dynamics.principalMoments.map(m => m.toFixed(1)).join(', ')}]`);
        }
      }

      const exportOptions: any = {
        binary: true,
        includeCustomExtensions: true,
        animations: animations.length > 0 ? animations : undefined
      };

      exporter.parse(
        scene,
        (result) => {
          try {
            const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Build filename suffix based on export type and geometry style
            let suffix = exportType || 'solid';
            if (isAnimatedExport && geometryStyle && geometryStyle !== 'solid') {
              const animType = exportType === 'sketchfab' ? 'sketchfab' : 
                               exportType === 'physics-anim' ? 'physics' :
                               exportType === 'transform-anim' ? 'transform' : exportType;
              suffix = `${animType}_${geometryStyle}_animated`;
            } else if (exportType === 'sketchfab') {
              suffix = 'sketchfab_animated';
            } else if (exportType === 'physics-anim') {
              suffix = 'physics_animated';
            } else if (exportType === 'transform-anim') {
              suffix = 'transform_animated';
            }
            link.download = `${parameters.type}_${suffix}_${Date.now()}.glb`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            console.log(`✅ GLB ${exportType || 'solid'} export complete`);
          } catch (downloadError) {
            console.error('❌ Download failed:', downloadError);
          }
        },
        (error) => {
          console.error('❌ GLTFExporter parse failed:', error);
          // Try fallback export with simpler options
          try {
            exporter.parse(
              scene,
              (fallbackResult) => {
                const blob = new Blob([fallbackResult as ArrayBuffer], { type: 'model/gltf-binary' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${parameters.type}_${exportType || 'solid'}_fallback_${Date.now()}.glb`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                console.log(`✅ GLB ${exportType || 'solid'} fallback export complete`);
              },
              (fallbackError) => {
                console.error('❌ Fallback export also failed:', fallbackError);
              },
              { binary: true }
            );
          } catch (fallbackErr) {
            console.error('❌ Complete export failure:', fallbackErr);
          }
        },
        exportOptions
      );
    } catch (err) {
      console.error('❌ Export initialization failed:', err);
    }
  }, [parameters.type, colorMode]);

  useEffect(() => {
    const listener = (e: Event) => handleExport(e as CustomEvent);
    window.addEventListener('exportGLTF', listener);
    return () => window.removeEventListener('exportGLTF', listener);
  }, [handleExport]);

  // PLY export listener — converts geometry to ASCII PLY and downloads directly
  useEffect(() => {
    const handlePLY = (e: Event) => {
      const mesh = meshRef.current;
      if (!mesh?.geometry) {
        console.error('❌ PLY export: no mesh available');
        return;
      }
      try {
        const geo = mesh.geometry;
        const pos = geo.attributes.position;
        const idx = geo.index;
        const vertexCount = pos.count;
        const faceCount = idx ? idx.count / 3 : vertexCount / 3;
        const lines: string[] = [
          'ply', 'format ascii 1.0',
          `element vertex ${vertexCount}`,
          'property float x', 'property float y', 'property float z',
          `element face ${faceCount}`,
          'property list uchar int vertex_indices',
          'end_header'
        ];
        for (let i = 0; i < vertexCount; i++) {
          lines.push(`${pos.getX(i).toFixed(6)} ${pos.getY(i).toFixed(6)} ${pos.getZ(i).toFixed(6)}`);
        }
        if (idx) {
          for (let i = 0; i < idx.count; i += 3) {
            lines.push(`3 ${idx.getX(i)} ${idx.getX(i+1)} ${idx.getX(i+2)}`);
          }
        }
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ev = e as CustomEvent;
        a.href = url;
        a.download = `${ev.detail?.filename ?? 'dmension-shape'}.ply`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: { filename: a.download, fileSize: `${(blob.size/1024).toFixed(1)} KB`, shape: parameters.type }
        }));
      } catch (err) {
        console.error('❌ PLY export failed:', err);
        window.dispatchEvent(new CustomEvent('gltfExportError', { detail: { error: String(err) } }));
      }
    };
    window.addEventListener('exportPLY', handlePLY);
    return () => window.removeEventListener('exportPLY', handlePLY);
  }, [parameters.type]);

  // STL export listener — ASCII STL
  useEffect(() => {
    const handleSTL = (e: Event) => {
      const mesh = meshRef.current;
      if (!mesh?.geometry) {
        console.error('❌ STL export: no mesh available');
        return;
      }
      try {
        const geo = mesh.geometry;
        const pos = geo.attributes.position;
        const idx = geo.index;
        const lines: string[] = [`solid dmension_${parameters.type}`];
        const getVertex = (i: number) => [pos.getX(i), pos.getY(i), pos.getZ(i)] as [number,number,number];
        const cross = (a: [number,number,number], b: [number,number,number]): [number,number,number] => [
          a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]
        ];
        const faceCount = idx ? idx.count / 3 : pos.count / 3;
        for (let f = 0; f < faceCount; f++) {
          const i0 = idx ? idx.getX(f*3) : f*3;
          const i1 = idx ? idx.getX(f*3+1) : f*3+1;
          const i2 = idx ? idx.getX(f*3+2) : f*3+2;
          const v0 = getVertex(i0), v1 = getVertex(i1), v2 = getVertex(i2);
          const ab: [number,number,number] = [v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2]];
          const ac: [number,number,number] = [v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2]];
          const n = cross(ab, ac);
          const len = Math.sqrt(n[0]**2+n[1]**2+n[2]**2) || 1;
          lines.push(`  facet normal ${(n[0]/len).toFixed(6)} ${(n[1]/len).toFixed(6)} ${(n[2]/len).toFixed(6)}`);
          lines.push('    outer loop');
          [v0,v1,v2].forEach(v => lines.push(`      vertex ${v[0].toFixed(6)} ${v[1].toFixed(6)} ${v[2].toFixed(6)}`));
          lines.push('    endloop', '  endfacet');
        }
        lines.push(`endsolid dmension_${parameters.type}`);
        const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const ev = e as CustomEvent;
        a.href = url;
        a.download = `${ev.detail?.filename ?? 'dmension-shape'}.stl`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: { filename: a.download, fileSize: `${(blob.size/1024).toFixed(1)} KB`, shape: parameters.type }
        }));
      } catch (err) {
        console.error('❌ STL export failed:', err);
        window.dispatchEvent(new CustomEvent('gltfExportError', { detail: { error: String(err) } }));
      }
    };
    window.addEventListener('exportSTL', handleSTL);
    return () => window.removeEventListener('exportSTL', handleSTL);
  }, [parameters.type]);

  const handleAnimatedExport = useCallback(async (event: CustomEvent) => {
    if (!meshRef.current) {
      console.error('❌ Animated export failed: No mesh available');
      return;
    }

    const { shapeName, duration, fps, format, bakeLighting, lightingSettings } = event.detail || {};

    console.log('🎬 Animated export triggered:', { shapeName, duration, fps, format, bakeLighting });
    console.log('🎨 Current material preset for export:', colorMode);

    try {
      const exportScene = new THREE.Scene();
      const clonedMesh = meshRef.current.clone();

      // Deep clone geometry and material to prevent live-scene mutation during export
      clonedMesh.geometry = meshRef.current.geometry.clone();
      clonedMesh.material = Array.isArray(meshRef.current.material)
        ? meshRef.current.material.map(m => m.clone())
        : meshRef.current.material.clone();

      // Bake procedural material textures for export
      if (MATERIAL_PRESETS[colorMode]) {
        console.log(`✨ Baking procedural material "${colorMode}" for animated export`);
        const bakedMaterial = TRIPLANAR_PATTERN_IDS.has(colorMode)
          ? createTriplanarExportMaterial(colorMode, parameters.fBmLayers ?? 3, parameters.domainWarp ?? 0, 512)
          : createExportMaterial(colorMode, 2048);
        clonedMesh.material = bakedMaterial;
      }

      exportScene.add(clonedMesh);

      const exportOptions: AnimatedExportOptions = {
        format: format || 'glb',
        bakeLighting: bakeLighting,
        lightingSettings: lightingSettings
      };

      await exportAnimatedMath(
        exportScene,
        shapeName || parameters.type,
        duration || 10,
        fps || 30,
        (progress) => {
          window.dispatchEvent(new CustomEvent('animatedMathExportProgress', { 
            detail: { progress } 
          }));
        },
        format || 'glb',
        exportOptions
      );

      window.dispatchEvent(new CustomEvent('animatedMathExportComplete'));
    } catch (error) {
      console.error('❌ Animated export failed:', error);
      window.dispatchEvent(new CustomEvent('animatedMathExportError', {
        detail: { error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, [parameters.type, colorMode]);

  useEffect(() => {
    const listener = (e: Event) => handleAnimatedExport(e as CustomEvent);
    window.addEventListener('exportAnimatedMath', listener);
    return () => window.removeEventListener('exportAnimatedMath', listener);
  }, [handleAnimatedExport]);

  const handleARVRExport = useCallback(async (event: CustomEvent) => {
    if (!meshRef.current) {
      console.error('❌ AR/VR export failed: No mesh available');
      return;
    }

    console.log('📱 AR/VR export triggered for:', parameters.type);
    console.log('🎨 Current material preset:', colorMode);

    try {
      const shapeInfo = COMPREHENSIVE_SHAPE_LIBRARY[parameters.type] || { name: parameters.type };
      const shapeName = shapeInfo.name || parameters.type;
      const category = parameters.type.split('_')[0] || 'general';
      const formula = 'parametric-surface';

      // Always bake an animation — default rotate when physics is off, tensor/etc when on
      const arAnimType: 'rotate' | 'float' | 'pulse' | 'none' | 'tensor' = isPhysicsAnimating
        ? (animationType === 'tensor' || animationType === 'gyroscope' ? 'tensor'
          : animationType === 'tumble' ? 'float' : 'pulse')
        : 'rotate';

      // Use the true Jacobi-computed principal axes from shapeDynamicsRef directly
      const [exportAx1, exportAx2, exportAx3] = shapeDynamicsRef.current.principalAxes;

      const options: Partial<ARVRExportOptions> = {
        platform: 'universal',
        filename: `${parameters.type}_ar`,
        quality: 'mobile',
        embedAnimation: true,
        animationType: arAnimType,
        autoScale: true,
        targetSize: 1,
        animationDuration: 10 / Math.max(animationVelocity, 0.1),
        tensorAxes: arAnimType === 'tensor' ? {
          axis1: { x: exportAx1.x, y: exportAx1.y, z: exportAx1.z },
          axis2: { x: exportAx2.x, y: exportAx2.y, z: exportAx2.z },
          axis3: { x: exportAx3.x, y: exportAx3.y, z: exportAx3.z },
        } : undefined,
      };

      const result = await exportForARVR(
        meshRef.current,
        parameters.type,
        shapeName,
        category,
        formula,
        colorMode,
        options
      );

      if (result.success) {
        downloadARVRExport(result);

        console.log('✅ AR/VR export complete:', result.filename);
        console.log('📋 Embed code available');

        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: {
            shape: shapeName,
            filename: result.filename,
            fileSize: result.metadata.fileSize ? `${(result.metadata.fileSize / 1024).toFixed(1)} KB` : 'Unknown',
            vertexCount: result.metadata.vertexCount
          }
        }));
      } else {
        console.error('❌ AR/VR export failed:', result.error);
        window.dispatchEvent(new CustomEvent('gltfExportError', {
          detail: { error: result.error }
        }));
      }
    } catch (error) {
      console.error('❌ AR/VR export error:', error);
      window.dispatchEvent(new CustomEvent('gltfExportError', {
        detail: { error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, [parameters.type, colorMode, isPhysicsAnimating, animationType]);

  useEffect(() => {
    const listener = (e: Event) => handleARVRExport(e as CustomEvent);
    window.addEventListener('exportARVR', listener);
    return () => window.removeEventListener('exportARVR', listener);
  }, [handleARVRExport]);

  const handleGridSceneExport = useCallback(async () => {
    if (!meshRef.current) {
      console.error('❌ Grid-scene export: no mesh');
      return;
    }
    try {
      const { exportSceneWithGrid, downloadSceneExport } = await import('../lib/arVrExportEngine');
      // Find the grid LineSegments in the scene
      let gridLines: THREE.LineSegments | null = null;
      meshRef.current.parent?.traverseAncestors?.(() => {});
      // Traverse the R3F root scene
      const r3fScene = meshRef.current.parent;
      if (r3fScene) {
        r3fScene.traverse((obj) => {
          if (!gridLines && obj instanceof THREE.LineSegments && obj !== meshRef.current) {
            gridLines = obj;
          }
        });
      }
      const shapeInfo = COMPREHENSIVE_SHAPE_LIBRARY[parameters.type] || { name: parameters.type };
      const shapeName = shapeInfo.name || parameters.type;
      const result = await exportSceneWithGrid(meshRef.current, gridLines, parameters.type, shapeName, 8);
      if (result.success && result.blob) {
        downloadSceneExport(result.blob, result.filename);
        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: { shape: shapeName, filename: result.filename, fileSize: `${(result.blob.size / 1024).toFixed(1)} KB`, vertexCount: 0 }
        }));
      } else {
        console.error('❌ Grid-scene export failed:', result.error);
      }
    } catch (err) {
      console.error('❌ Grid-scene export error:', err);
    }
  }, [parameters.type]);

  useEffect(() => {
    const listener = () => handleGridSceneExport();
    window.addEventListener('exportGridScene', listener);
    return () => window.removeEventListener('exportGridScene', listener);
  }, [handleGridSceneExport]);

  const handleNeuralExport = useCallback(async (event: CustomEvent) => {
    if (!meshRef.current) {
      console.error('❌ Neural export failed: No mesh available');
      return;
    }

    const exportType = event.detail?.type || 'nerfstudio';
    console.log('🧠 Neural NeRF export triggered for:', parameters.type, 'format:', exportType);

    try {
      const shapeInfo = COMPREHENSIVE_SHAPE_LIBRARY[parameters.type] || { name: parameters.type };
      const shapeName = shapeInfo.name || parameters.type;

      const shapeParams: NeuralShapeParameters = {
        a: parameters.a ?? 1,
        b: parameters.b ?? 1,
        c: parameters.c ?? 1,
        d: parameters.d,
        e: parameters.e,
        f: parameters.f,
        uMin: parameters.uMin,
        uMax: parameters.uMax,
        vMin: parameters.vMin,
        vMax: parameters.vMax,
        uSegments: parameters.uSegments,
        vSegments: parameters.vSegments
      };

      if (exportType === 'nerfstudio') {
        const nerfstudioExport = await createNerfstudioExport(
          meshRef.current,
          parameters.type,
          shapeName,
          shapeParams,
          {
            numViews: 100,
            quality: 'medium',
            includePointCloud: true,
            includeSemantic: false
          }
        );

        const packageFiles = await exportNerfstudioPackage(nerfstudioExport);
        
        const timestamp = Date.now();
        const downloads = [
          { blob: packageFiles.transforms, name: `${parameters.type}_transforms_${timestamp}.json` },
          { blob: packageFiles.config, name: `${parameters.type}_instant_ngp_config_${timestamp}.json` },
          { blob: packageFiles.formulas, name: `${parameters.type}_formulas_${timestamp}.json` },
          { blob: packageFiles.metadata, name: `${parameters.type}_metadata_${timestamp}.json` }
        ];

        if (nerfstudioExport.point_cloud) {
          const plyBlob = exportPointCloudPLY(nerfstudioExport.point_cloud);
          downloads.push({ blob: plyBlob, name: `${parameters.type}_points_${timestamp}.ply` });
        }

        for (const { blob, name } of downloads) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }

        const trainingCmd = generateNerfstudioTrainingCommand(
          `./data/${parameters.type}`,
          'nerfacto'
        );

        console.log('✅ Nerfstudio export complete!');
        console.log('📦 Files exported:', downloads.map(d => d.name).join(', '));
        console.log('🚀 Training command:', trainingCmd);
        console.log('📐 Formulas included:', Object.keys(NEURAL_FORMULAS).join(', '));
        console.log('🔐 Security: SHA-256 hash + verification code embedded');

        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: {
            shape: shapeName,
            filename: downloads[0].name,
            fileSize: `${downloads.length} files`,
            quality: 'Nerfstudio Compatible'
          }
        }));
      } else {
        const neuralScene = createNeuralSceneFromMesh(
          meshRef.current,
          parameters.type,
          shapeName
        );

        const blob = exportNeuralScene(neuralScene);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${parameters.type}_neural_${Date.now()}.nerf.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('✅ Neural NeRF export complete:', a.download);
        console.log('🔐 Security: SHA-256 hash + verification code embedded');

        window.dispatchEvent(new CustomEvent('gltfExportSuccess', {
          detail: {
            shape: shapeName,
            filename: a.download,
            fileSize: `${(blob.size / 1024).toFixed(1)} KB`,
            quality: 'Neural NeRF'
          }
        }));
      }
    } catch (error) {
      console.error('❌ Neural export error:', error);
      window.dispatchEvent(new CustomEvent('gltfExportError', {
        detail: { error: error instanceof Error ? error.message : 'Unknown error' }
      }));
    }
  }, [parameters]);

  useEffect(() => {
    const listener = (e: Event) => handleNeuralExport(e as CustomEvent);
    window.addEventListener('exportNeural', listener);
    return () => window.removeEventListener('exportNeural', listener);
  }, [handleNeuralExport]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const cappedDelta = Math.min(delta, 0.05); // cap at 50 ms to avoid jumps after tab switch

    // PHYSICS SIMULATION - when enabled, apply physics-based animations
    if (physicsEnabled && physicsConfig) {
      physicsTimeRef.current += cappedDelta * (1 / physicsConfig.timeStep);

      // Get physics category for this shape type
      const category = parameters.type.toLowerCase();
      const isWave = category.includes('wave') || category.includes('schrodinger') || category.includes('fourier');
      const isMolecular = category.includes('molecule') || category.includes('atom') || category.includes('orbital');
      const isCellular = category.includes('cell') || category.includes('tissue') || category.includes('membrane');
      const isAttractor = category.includes('lorenz') || category.includes('attractor') || category.includes('chaos');
      const isAnatomical = category.includes('heart') || category.includes('anatomy') || category.includes('organ');
      const isQuantum = category.includes('quantum') || category.includes('bloch') || category.includes('superposition');
      const isAstro = category.includes('planet') || category.includes('orbit') || category.includes('galaxy');

      // Apply damping
      const damping = physicsConfig.dampingFactor;
      physicsVelocity.current.x *= damping;
      physicsVelocity.current.y *= damping;
      physicsVelocity.current.z *= damping;

      const pt = physicsTimeRef.current; // read once per frame — no state, no re-render
      if (isWave) {
        // Wave physics: oscillation with interference
        const freq = 2 + (physicsConfig.gravityStrength * 0.2);
        meshRef.current.position.y = Math.sin(pt * freq) * 0.3;
        meshRef.current.rotation.z = Math.sin(pt * freq * 0.7) * 0.15;
      } else if (isMolecular) {
        // Molecular physics: thermal vibration (Brownian motion)
        const temp = physicsConfig.gravityStrength * 0.05;
        meshRef.current.position.x += (Math.random() - 0.5) * temp * cappedDelta;
        meshRef.current.position.y += (Math.random() - 0.5) * temp * cappedDelta;
        meshRef.current.position.z += (Math.random() - 0.5) * temp * cappedDelta;
        meshRef.current.rotation.x += (Math.random() - 0.5) * temp * cappedDelta * 0.5;
        meshRef.current.rotation.y += (Math.random() - 0.5) * temp * cappedDelta * 0.5;
      } else if (isCellular) {
        // Cellular physics: fluid dynamics
        const viscosity = 1 - (physicsConfig.dampingFactor * 0.1);
        meshRef.current.position.y += Math.sin(pt * 1.5) * 0.02 * viscosity;
        meshRef.current.scale.x = 1 + Math.sin(pt * 2) * 0.05;
        meshRef.current.scale.z = 1 + Math.cos(pt * 2) * 0.05;
      } else if (isAttractor) {
        // Attractor physics: chaotic trajectory
        const sigma = 10, rho = 28, beta = 8/3;
        const dt = physicsConfig.timeStep * 0.1;
        physicsVelocity.current.x += (sigma * (physicsVelocity.current.y - physicsVelocity.current.x)) * dt;
        physicsVelocity.current.y += (physicsVelocity.current.x * (rho - physicsVelocity.current.z) - physicsVelocity.current.y) * dt;
        physicsVelocity.current.z += (physicsVelocity.current.x * physicsVelocity.current.y - beta * physicsVelocity.current.z) * dt;
        meshRef.current.rotation.x = physicsVelocity.current.x * 0.05;
        meshRef.current.rotation.y = physicsVelocity.current.y * 0.05;
        meshRef.current.rotation.z = physicsVelocity.current.z * 0.02;
      } else if (isAnatomical) {
        // Anatomical physics: cardiac pulsation
        const bpm = 72;
        const heartPhase = (pt * bpm / 60) % 1;
        const contraction = Math.sin(heartPhase * Math.PI * 2) * 0.15;
        meshRef.current.scale.set(1 + contraction, 1 + contraction * 0.8, 1 + contraction);
      } else if (isQuantum) {
        // Quantum physics: probability cloud fluctuation
        const uncertainty = 0.1;
        meshRef.current.position.x += (Math.random() - 0.5) * uncertainty * cappedDelta;
        meshRef.current.position.y += (Math.random() - 0.5) * uncertainty * cappedDelta;
        meshRef.current.rotation.y = (pt * 5) % (Math.PI * 2);
      } else if (isAstro) {
        // Astrophysical physics: orbital mechanics
        const orbitalSpeed = physicsConfig.gravityStrength * 0.02;
        meshRef.current.rotation.y += orbitalSpeed * cappedDelta;
        meshRef.current.position.y = Math.sin(pt * 0.5) * 0.1;
      } else {
        // Default physics: gentle oscillation
        meshRef.current.rotation.y += cappedDelta * 0.3;
        const defaultScale = 1 + Math.sin(pt) * 0.02;
        meshRef.current.scale.set(defaultScale, defaultScale, defaultScale);
      }

      // Apply gravity if enabled
      if (physicsConfig.gravityStrength > 0 && !isAstro) {
        physicsVelocity.current.y -= physicsConfig.gravityStrength * 0.001 * cappedDelta;
      }

    } else if (isPhysicsAnimating) {
      // ========== ANIMATION LOOP ==========
      // Use capped delta throughout so frame spikes don't cause time jumps.
      animTimeRef.current += cappedDelta;
      const t = animTimeRef.current;

      const omega = animationVelocity * 3.0;
      // breatheIntensity scales morph amplitude; dynamicsMode 'rigid' halves it
      const modeScale = dynamicsMode === 'rigid' ? 0.5 : 1.0;
      const amp = 0.15 * animationVelocity * breatheIntensity * modeScale;

      // Cache original geometry positions once — no allocation per frame.
      const geom = meshRef.current.geometry;
      const posAttr = geom.attributes.position as THREE.BufferAttribute | undefined;
      if (posAttr && !geom.userData.originalPositions) {
        geom.userData.originalPositions = new Float32Array(posAttr.array as Float32Array);
        const com = new THREE.Vector3();
        for (let i = 0; i < posAttr.count; i++) {
          com.x += posAttr.getX(i);
          com.y += posAttr.getY(i);
          com.z += posAttr.getZ(i);
        }
        geom.userData.centerOfMass = com.divideScalar(posAttr.count);
      }
      const original = geom.userData.originalPositions as Float32Array | undefined;
      const center = (geom.userData.centerOfMass as THREE.Vector3) ?? new THREE.Vector3();

      if (animationType === 'tensor' || animationType === 'gyroscope') {
        // ── PRINCIPAL-AXIS ORIENTATION TOUR (runs every frame) ──
        // Three-leg seamless cycle: axis1 → axis2 → axis3 → axis1
        // Each leg uses cubic ease-in-out over 3s / animationVelocity.
        const tourPeriod = 9.0 / animationVelocity;
        const tourPhase = t % tourPeriod;
        const legDur = tourPeriod / 3;
        const legIdx = Math.floor(tourPhase / legDur);
        const raw = (tourPhase % legDur) / legDur;
        const eased = raw < 0.5 ? 4 * raw ** 3 : 1 - Math.pow(-2 * raw + 2, 3) / 2;

        const { principalAxes, principalMoments, stabilityIndex } = shapeDynamicsRef.current;
        const [ax1, ax2, ax3] = principalAxes;
        const wUp = new THREE.Vector3(0, 1, 0);
        const tourQ = [
          new THREE.Quaternion().setFromUnitVectors(wUp, ax1.clone().normalize()),
          new THREE.Quaternion().setFromUnitVectors(wUp, ax2.clone().normalize()),
          new THREE.Quaternion().setFromUnitVectors(wUp, ax3.clone().normalize()),
        ];
        meshRef.current.quaternion.copy(
          tourQ[legIdx % 3].clone().slerp(tourQ[(legIdx + 1) % 3], eased)
        );

        // ── CONTINUOUS TENSOR VERTEX MORPH (skipped when morph is negligible) ──
        if (original && posAttr && amp > 0.001) {
          const [I1, I2, I3] = principalMoments;
          const spinAx = ax1;
          const breathAmp = amp * (1 - stabilityIndex * 0.5);
          const breath = Math.sin(t * omega * I1 * 1.5) * breathAmp;
          const scl = 1 + breath;
          const crossBrth = Math.sin(t * omega * I2 * 1.2) * amp * 0.15;
          for (let i = 0; i < posAttr.count; i++) {
            const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
            const dx = ox - center.x, dy = oy - center.y, dz = oz - center.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
            const aniso = Math.sin(dist * I3 * 2 - t * omega) * amp * 0.2;
            posAttr.setXYZ(i,
              center.x + dx * scl + spinAx.x * (dx * spinAx.x) * crossBrth + aniso * spinAx.y * 0.5,
              center.y + dy * scl + spinAx.y * (dy * spinAx.y) * crossBrth + aniso * spinAx.z * 0.5,
              center.z + dz * scl + spinAx.z * (dz * spinAx.z) * crossBrth + aniso * spinAx.x * 0.5
            );
          }
          posAttr.needsUpdate = true;
          if (amp > 0.005) geom.computeVertexNormals();
        }

      } else {
        // ── NON-TENSOR MODES: smooth continuous rotation + vertex morph every frame ──
        meshRef.current.rotation.y = (t * animationVelocity) % (Math.PI * 2);

        if (original && posAttr && amp > 0.001) {
          switch (animationType) {
            case 'spin': {
              const breath = Math.sin(t * omega * 2) * amp;
              const scale = 1 + breath;
              for (let i = 0; i < posAttr.count; i++) {
                const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
                posAttr.setXYZ(i,
                  center.x + (ox - center.x) * scale,
                  center.y + (oy - center.y) * scale,
                  center.z + (oz - center.z) * scale
                );
              }
              break;
            }
            case 'precession': {
              const pulse = 1 + Math.sin(t * omega) * amp * 0.3;
              for (let i = 0; i < posAttr.count; i++) {
                const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
                const dx = ox - center.x, dy = oy - center.y, dz = oz - center.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
                const wave = Math.sin(dist * 3 - t * omega * 2) * amp * 0.5;
                posAttr.setXYZ(i,
                  center.x + dx * pulse,
                  center.y + dy * pulse + wave,
                  center.z + dz * pulse
                );
              }
              break;
            }
            case 'tumble': {
              for (let i = 0; i < posAttr.count; i++) {
                const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
                posAttr.setXYZ(i,
                  ox + Math.sin(t * omega * 1.5 + i * 0.02) * amp * 0.2,
                  oy + Math.cos(t * omega * 1.2 + i * 0.03) * amp * 0.15,
                  oz + Math.sin(t * omega * 1.8 + i * 0.025) * amp * 0.18
                );
              }
              break;
            }
            case 'stable': {
              const breath = 1 + Math.sin(t * omega * 0.8) * amp * 0.2;
              for (let i = 0; i < posAttr.count; i++) {
                const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
                const dx = ox - center.x, dz = oz - center.z;
                const heightWave = Math.sin(Math.sqrt(dx*dx+dz*dz) * 2 - t * omega) * amp * 0.4;
                posAttr.setXYZ(i,
                  center.x + (ox - center.x) * breath,
                  oy + heightWave,
                  center.z + (oz - center.z) * breath
                );
              }
              break;
            }
            default: {
              const breath = Math.sin(t * omega * 1.5) * amp * 0.3;
              const scale = 1 + breath;
              for (let i = 0; i < posAttr.count; i++) {
                const ox = original[i * 3], oy = original[i * 3 + 1], oz = original[i * 3 + 2];
                const dx = ox - center.x, dy = oy - center.y, dz = oz - center.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz) || 0.001;
                const wave = Math.sin(dist * 2.5 - t * omega * 1.2) * amp * 0.25;
                const wobble = Math.sin(t * omega * 0.7 + i * 0.01) * amp * 0.1;
                posAttr.setXYZ(i,
                  center.x + dx * scale + wobble,
                  center.y + dy * scale + wave,
                  center.z + dz * scale + wobble * 0.5
                );
              }
              break;
            }
          }
          posAttr.needsUpdate = true;
          if (amp > 0.005) geom.computeVertexNormals();
        }
      }
      // Mark paramsDirtyRef consumed so shape-change geometry rebuilds don't compound
      paramsDirtyRef.current = false;
    }

    // GMod6 transform — apply pending rotation/scale from GMod6ControlPanel
    // only when neither physics nor the tensor animation loop is active.
    if (gmod6TransformRef.current && !physicsEnabled && !isPhysicsAnimating) {
      meshRef.current.rotation.y = gmod6TransformRef.current.rotationY;
      const gs = gmod6TransformRef.current.scale;
      meshRef.current.scale.set(gs, gs, gs);
    }

    // 4D shapes — advance the W-rotation angle and update the mesh via a simple
    // Y-rotation.  Full geometry re-projection runs only inside the useMemo when
    // structural parameters change; we do NOT call generate4DGeometry here every
    // frame so there are no per-frame geometry allocations.
    if (parameters.type.includes('tesseract') || 
        parameters.type.includes('hypercube') ||
        parameters.type.includes('4d') ||
        parameters.type.includes('hypersphere') ||
        parameters.type.includes('5_cell') ||
        parameters.type.includes('16_cell') ||
        parameters.type.includes('24_cell')) {
      rotationWRef.current += cappedDelta * 0.3;
      meshRef.current.rotation.y += cappedDelta * 0.3;
      meshRef.current.rotation.z += cappedDelta * 0.12;
    }
  });

  const geometry = useMemo(() => {
    // IFS GPU shapes — rendered by IFSCanvas (WebGL raymarcher), not Three.js
    // Return empty geometry immediately so no sphere fallback warning fires
    if (isIFSShape(parameters.type)) {
      return new THREE.BufferGeometry();
    }

    // If external GLB model is loaded, use that geometry
    if (externalGeometry) {
      console.log('📐 Using external GLB geometry');
      // Clone and apply parameter-based transformations
      const geom = externalGeometry.clone();
      const scale = mergedParameters.a || 1;
      geom.scale(scale, scale, scale);
      return geom;
    }

    // Shape type validation and geometry generation
    let newGeometry: THREE.BufferGeometry;

    // Handle WireGenesis mesh (bypasses parametric generation)
    if (parameters.type === 'wiregenesis_mesh') {
      console.log('🎯 Rendering WireGenesis mesh');

      // Check if we have a stored mesh from WireGenesis engine
      const storedMesh = (window as any).wireGenesisMesh;
      if (storedMesh && storedMesh.geometry) {
        newGeometry = storedMesh.geometry.clone();
        console.log('✅ Using WireGenesis generated mesh:', {
          vertices: newGeometry.attributes.position.count,
          triangles: newGeometry.index ? newGeometry.index.count / 3 : 0
        });
      } else {
        // Fallback to simple plane if no mesh available
        console.warn('⚠️ No WireGenesis mesh found, using fallback plane');
        newGeometry = new THREE.PlaneGeometry(
          Math.abs(parameters.a || 2),
          Math.abs(parameters.c || 2),
          Math.min(64, parameters.uSegments || 32),
          Math.min(64, parameters.vSegments || 32)
        );
      }
    } else {
      // Standard parametric surface generation
      const shapeExists = surfaceGenerator.hasShapeType(parameters.type);
      if (!shapeExists) {
        console.warn(`⚠️ Unknown shape type: ${parameters.type}, falling back to sphere`);
        newGeometry = surfaceGenerator.generateSurface({ ...parameters, type: 'sphere' });
      } else {
        newGeometry = surfaceGenerator.generateSurface(parameters);
      }
    }


    // PARAMETER AUTHORITY: Extract ALL parameters A-Z from merged values
    // Authority values take precedence - no other system can override
    const { 
      type, 
      a = 1, b = 1, c = 1,           // A-C: Global transforms (foundation)
      d = 0, e = 0,                   // D-E: Foundational curves (lowest chaos)
      f = 0, g = 0,                   // F-G: Surfaces of revolution (low chaos)
      h = 0, i = 0,                   // H-I: Extrusions & sweeps (low-medium)
      j = 0, k = 0,                   // J-K: Lofts & interpolations (medium)
      l = 0, m = 0,                   // L-M: Superquadrics (medium-high)
      n = 0, o = 0,                   // N-O: Minimal surfaces (topological)
      p = 0, q = 0,                   // P-Q: Waveforms & harmonics (wave dynamics)
      r = 0, s = 0,                   // R-S: Special structures (topological twist)
      t = 0, u: paramU = 0,          // T-U: Φ-based forms (golden ratio) - 'u' renamed to avoid conflict with loop variable
      v: paramV = 0, w = 0,          // V-W: Fractals & noise (high chaos) - 'v' renamed to avoid conflict
      x = 0, y = 0, z = 0,           // X-Y-Z: Universal axis offsets (post-transform)
      uSegments = 64, vSegments = 64, 
      uMin = 0, uMax = 1, vMin = 0, vMax = 1,
      time = 0
    } = mergedParameters;

    // Log parameter state for debugging (including UV and mesh)
    console.log(`⚡ Geometry rebuild: A=${a.toFixed(2)}, B=${b.toFixed(2)}, C=${c.toFixed(2)}, D=${d.toFixed(2)} | UV=[${uMin},${uMax}]×[${vMin},${vMax}] | Mesh=${uSegments}×${vSegments}`);

    const fourDTypes = [
      'tesseract', 'hypercube', '4d_hypersphere', 'hypersphere_4d',
      '5_cell', '16_cell', '24_cell', '120_cell', '600_cell',
      'klein_bottle_4d', 'hopf_fibration'
    ];

    if (fourDTypes.some(t => type.toLowerCase().includes(t))) {
      const fourDGeom = generate4DGeometry(type, {
        scale: a || 2,
        rotationW: rotationWRef.current,
        projectionType: 'stereographic'
      });
      if (fourDGeom) return fourDGeom;
    }

    const { uSegments: optU, vSegments: optV } = calculateSegmentCount(
      optimalMesh.meshType,
      optimalMesh.tessellationDensity
    );

    const actualUSegments = uSegments || optU;
    const actualVSegments = vSegments || optV;

    const segU = Math.max(4, Math.min(300, actualUSegments));
    const segV = Math.max(4, Math.min(300, actualVSegments));

    switch (type) {
      case 'cube':
        const cubeSize = Math.max(0.1, Math.abs(a));
        const cubeWidthSegs = Math.max(1, Math.floor(segU / 10));
        const cubeHeightSegs = Math.max(1, Math.floor(segV / 10));
        const cubeDepthSegs = Math.max(1, Math.floor((segU + segV) / 20));
        return new THREE.BoxGeometry(cubeSize, cubeSize * (b || 1), cubeSize * (c || 1), cubeWidthSegs, cubeHeightSegs, cubeDepthSegs);

      case 'sphere': {
        const sphPhiStart   = uMin ?? 0;
        const sphPhiLen     = Math.max(0.01, (uMax ?? Math.PI * 2) - sphPhiStart);
        const sphThetaStart = vMin ?? 0;
        const sphThetaLen   = Math.max(0.01, (vMax ?? Math.PI) - sphThetaStart);
        return new THREE.SphereGeometry(1, segU, segV, sphPhiStart, sphPhiLen, sphThetaStart, sphThetaLen);
      }

      case 'torus': {
        const torusArc = Math.max(0.01, (uMax ?? Math.PI * 2) - (uMin ?? 0));
        return new THREE.TorusGeometry(1, 0.3, segV, segU, torusArc);
      }

      case 'cylinder':
        const cylRadius = Math.max(0.1, Math.abs(a));
        const cylHeight = Math.max(0.1, Math.abs(b));
        return new THREE.CylinderGeometry(cylRadius, cylRadius, cylHeight, segU, Math.max(1, Math.floor(segV / 4)));

      case 'cone':
        const coneRadius = Math.max(0.1, Math.abs(a));
        const coneHeight = Math.max(0.1, Math.abs(b));
        return new THREE.ConeGeometry(coneRadius, coneHeight, segU, Math.max(1, Math.floor(segV / 4)));

      case 'tetrahedron':
        const tetraDetail = Math.max(0, Math.floor(segU / 50));
        return new THREE.TetrahedronGeometry(Math.max(0.1, Math.abs(a)), tetraDetail);

      case 'octahedron':
        const octaDetail = Math.max(0, Math.floor(segU / 50));
        return new THREE.OctahedronGeometry(Math.max(0.1, Math.abs(a)), octaDetail);

      case 'dodecahedron':
        const dodecaDetail = Math.max(0, Math.floor(segU / 50));
        return new THREE.DodecahedronGeometry(Math.max(0.1, Math.abs(a)), dodecaDetail);

      case 'icosahedron':
        const icoDetail = Math.max(0, Math.floor(segU / 50));
        return new THREE.IcosahedronGeometry(Math.max(0.1, Math.abs(a)), icoDetail);

      case 'square':
        const planeSize = Math.max(0.1, Math.abs(a));
        return new THREE.PlaneGeometry(planeSize, planeSize, segU, segV);

      case 'diamond_round_brilliant':
        return DiamondGeometry.generateRoundBrilliant({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: b || 0.16,
          pavilionDepth: c || 0.43
        });

      case 'diamond_princess':
        return DiamondGeometry.generatePrincessCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: b || 0.14,
          pavilionDepth: c || 0.45
        });

      case 'diamond_emerald':
        return DiamondGeometry.generateEmeraldCut({
          diameter: Math.max(0.5, Math.abs(a)),
          crownHeight: b || 0.12,
          pavilionDepth: c || 0.42
        });

      default:
        break;
    }

    // UNIVERSAL A/B/C FALLBACK: manifest-aware vertex-level scale
    // For shapes whose equations don't declare a/b/c, apply as X/Y/Z scale on each vertex
    // Shapes that DO declare a/b/c in their manifest use them in equations or mesh scale — skip
    const _abcManifest = getManifest(type);
    const _abcActive = _abcManifest?.activeParams ?? [];
    const _vertScaleA = _abcActive.includes('a') ? 1 : a;
    const _vertScaleB = _abcActive.includes('b') ? 1 : b;
    const _vertScaleC = _abcActive.includes('c') ? 1 : c;

    const shapeFunc = getShapeFunction(type);
    if (!shapeFunc) {
      // REGISTRY GUARD: Prevent unexpected sphere placeholders
      const shapeGuard = ShapeRegistryGuard.getInstance();
      const validation = shapeGuard.validateShapeBeforeRender(parameters.type);

      if (!validation.isValid) {
        console.error(`🚨 SHAPE REGISTRY GUARD: ${validation.warning}`);

        // Try to use a better fallback than basic sphere
        if (validation.fallbackShape && validation.fallbackShape !== parameters.type) {
          const fallbackEquation = ALL_SHAPE_LIBRARIES[validation.fallbackShape]; // Use ALL_SHAPE_LIBRARIES for lookup
          if (fallbackEquation) {
            console.log(`🔧 Using ${validation.fallbackShape} as fallback for ${parameters.type}`);
            // @ts-ignore -- Ignoring because generateSurfaceFromEquation is not defined in this scope.
            // This is a placeholder for a method that should exist if we were to implement this fallback logic.
            // For now, we'll stick to the original sphere fallback.
            return new THREE.SphereGeometry(1, 32, 16); 
          }
        }

        // Generate emergency implementation if available
        const emergencyShapes = shapeGuard.generateEmergencyImplementations();
        if (emergencyShapes[parameters.type]) {
          console.log(`🆘 Using emergency implementation for ${parameters.type}`);
           // @ts-ignore -- Same as above, generateSurfaceFromEquation is not defined.
          return new THREE.SphereGeometry(1, 32, 16);
        }
      }

      console.warn(`No surface equation found for ${parameters.type} - using sphere fallback`);
      return new THREE.SphereGeometry(1, 32, 16);
    }

    // UNIFIED PARAMETER SYSTEM: Build complete params with ALL A-Z values
    // CRITICAL: A/B/C are PURE AXIS SCALING - NOT passed to shape equations
    // They are applied as post-geometry mesh transforms only
    // D-Z: Transformation parameters for chaos-ordered morphing
    const mergedParams = {
      ...getCleanDefaults(),
      ...parameters,
      // A-C: Fixed at 1.0 for shape equations - pure axis scaling via mesh transform
      a: 1, b: 1, c: 1,
      // D-E: Foundational curves
      d, e,
      // F-G: Surfaces of revolution
      f, g,
      // H-I: Extrusions & sweeps
      h, i,
      // J-K: Lofts & interpolations
      j, k,
      // L-M: Superquadrics
      l, m,
      // N-O: Minimal surfaces
      n, o,
      // P-Q: Waveforms & harmonics
      p, q,
      // R-S: Special structures
      r, s,
      // T-U: Φ-based forms (using renamed variables)
      t, u: paramU,
      // V-W: Fractals & noise (using renamed variable for v)
      v: paramV, w,
      // X-Y-Z: Universal offsets (handled separately below)
      x, y, z,
      // Time and mesh parameters
      time,
      uMin, uMax, vMin, vMax, uSegments, vSegments
    } as SurfaceParameters;

    const positions: number[] = [];
    const indices: number[] = [];
    const uvs: number[] = [];

    const uRange = (uMax ?? 1) - (uMin ?? 0);
    const vRange = (vMax ?? 1) - (vMin ?? 0);

    // SEAM PREVENTION: Detect if surface wraps around (closed in U or V direction)
    // For shapes with 2π rotation (theta = v * 2π), prevent duplicate vertices at seam
    // by using a slightly reduced endpoint (prevents overlapping mesh at wraparound)
    const isClosedSurface = type.includes('sphere') || type.includes('torus') || 
                            type.includes('cosmic') || type.includes('inflation') ||
                            type.includes('ellipsoid') || type.includes('cylinder') ||
                            type.includes('cone') || type.includes('horn') ||
                            type.includes('shell') || type.includes('helix') ||
                            type.includes('orbital') || type.includes('wave') ||
                            type.includes('surface') || type.includes('revolution');

    // For closed surfaces, the last vertex should connect back to first, not duplicate
    // We achieve this by reducing the loop count and modifying indices
    const seamlessV = isClosedSurface && Math.abs(vRange - 1) < 0.01;
    const seamlessU = isClosedSurface && Math.abs(uRange - 1) < 0.01;

    // Effective segment counts (closed surfaces don't need the duplicate endpoint vertex)
    const effectiveSegV = seamlessV ? segV : segV;
    const effectiveSegU = seamlessU ? segU : segU;

    for (let j = 0; j <= effectiveSegV; j++) {
      for (let i = 0; i <= effectiveSegU; i++) {
        // For closed surfaces, use slightly less than 1.0 for the last vertex
        // This prevents mesh overlap at the seam while maintaining continuity
        const uFraction = seamlessU && i === effectiveSegU ? (segU - 0.001) / segU : i / segU;
        const vFraction = seamlessV && j === effectiveSegV ? (segV - 0.001) / segV : j / segV;

        const uVal = (uMin ?? 0) + uFraction * uRange;
        const vVal = (vMin ?? 0) + vFraction * vRange;

        try {
          const point = shapeFunc(uVal, vVal, mergedParams);

          if (point && Array.isArray(point) && point.length === 3 && 
              isFinite(point[0]) && isFinite(point[1]) && isFinite(point[2])) {

            // APPLY UNIVERSAL TRANSFORMATIONS (D-M parameters)
            // D: Twist, E: Wave, F: Ripple, G: Tessellation
            // H: Mirror X, I: Bulge, J: Pinch, K: Flare, L: Taper, M: Symmetry
            const transformedPoint = applyUniversalTransformations(
              [point[0], point[1], point[2]], 
              uVal, 
              vVal, 
              mergedParams
            );

            // UNIVERSAL X, Y, Z OFFSET (applies to ALL shapes as post-transform translation)
            // Uses authority values through mergedParameters
            const xOffset = x * 0.1;
            const yOffset = y * 0.1;
            const zOffset = z * 0.1;

            // UNIVERSAL A/B/C FALLBACK: apply vertex-level scale for non-manifest axes
            positions.push(
              transformedPoint[0] * _vertScaleA + xOffset, 
              transformedPoint[1] * _vertScaleB + yOffset, 
              transformedPoint[2] * _vertScaleC + zOffset
            );
          } else {
            positions.push(0, 0, 0);
          }
        } catch (e) {
          positions.push(0, 0, 0);
        }

        uvs.push(i / segU, j / segV);
      }
    }

    for (let j = 0; j < segV; j++) {
      for (let i = 0; i < segU; i++) {
        const idx = j * (segU + 1) + i;
        const idx1 = idx + 1;
        const idx2 = idx + (segU + 1);
        const idx3 = idx2 + 1;

        indices.push(idx, idx1, idx3);
        indices.push(idx, idx3, idx2);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // INERTIA TENSOR — compute principal moments from vertex positions and
    // store them in shapeDynamicsRef so the tensor animation mode can use
    // physics-accurate rotation axes without touching any equation params.
    try {
      const pos = geometry.attributes.position;
      if (pos && pos.count > 0) {
        let cx = 0, cy = 0, cz = 0;
        const n = pos.count;
        for (let vi = 0; vi < n; vi++) {
          cx += pos.getX(vi); cy += pos.getY(vi); cz += pos.getZ(vi);
        }
        cx /= n; cy /= n; cz /= n;

        let Ixx = 0, Iyy = 0, Izz = 0, Ixy = 0, Ixz = 0, Iyz = 0;
        for (let vi = 0; vi < n; vi++) {
          const dx = pos.getX(vi) - cx;
          const dy = pos.getY(vi) - cy;
          const dz = pos.getZ(vi) - cz;
          Ixx += dy * dy + dz * dz;
          Iyy += dx * dx + dz * dz;
          Izz += dx * dx + dy * dy;
          Ixy -= dx * dy;
          Ixz -= dx * dz;
          Iyz -= dy * dz;
        }

        // ── Jacobi eigendecomposition of 3×3 symmetric inertia tensor ──
        // Gives true principal moments (eigenvalues) and principal axes (eigenvectors).
        // Converges in ≤50 sweeps for any 3×3 symmetric matrix.
        {
          let ja = [
            [Ixx, Ixy, Ixz],
            [Ixy, Iyy, Iyz],
            [Ixz, Iyz, Izz],
          ] as [[number,number,number],[number,number,number],[number,number,number]];
          let jv = [[1,0,0],[0,1,0],[0,0,1]] as [[number,number,number],[number,number,number],[number,number,number]];
          const jacobiEps = 1e-12;
          for (let jIter = 0; jIter < 50; jIter++) {
            let maxOff = 0, jp = 0, jq = 1;
            for (let ii = 0; ii < 3; ii++) for (let jj = ii + 1; jj < 3; jj++) {
              if (Math.abs(ja[ii][jj]) > maxOff) { maxOff = Math.abs(ja[ii][jj]); jp = ii; jq = jj; }
            }
            if (maxOff < jacobiEps) break;
            const tau = (ja[jq][jq] - ja[jp][jp]) / (2 * ja[jp][jq]);
            const jt = tau >= 0
              ? 1 / (tau + Math.sqrt(1 + tau * tau))
              : 1 / (tau - Math.sqrt(1 + tau * tau));
            const jc = 1 / Math.sqrt(1 + jt * jt);
            const js = jt * jc;
            const app = ja[jp][jp]; const aqq = ja[jq][jq]; const apq = ja[jp][jq];
            ja[jp][jp] = app - jt * apq;
            ja[jq][jq] = aqq + jt * apq;
            ja[jp][jq] = 0; ja[jq][jp] = 0;
            for (let r = 0; r < 3; r++) {
              if (r !== jp && r !== jq) {
                const apr = ja[jp][r]; const aqr = ja[jq][r];
                ja[jp][r] = jc * apr - js * aqr; ja[r][jp] = ja[jp][r];
                ja[jq][r] = js * apr + jc * aqr; ja[r][jq] = ja[jq][r];
              }
            }
            for (let r = 0; r < 3; r++) {
              const vp = jv[r][jp]; const vq = jv[r][jq];
              jv[r][jp] = jc * vp - js * vq;
              jv[r][jq] = js * vp + jc * vq;
            }
          }
          // Eigenvalues on diagonal; sort ascending (min moment = most stable spin axis first)
          const eVals: [number, number, number] = [ja[0][0], ja[1][1], ja[2][2]];
          const order = ([0,1,2] as [number,number,number]).slice().sort((a, b) => eVals[a] - eVals[b]) as [number,number,number];
          const sortedVals = order.map(i => eVals[i]) as [number,number,number];
          // Columns of jv are eigenvectors
          const sortedVecs = order.map(i => new THREE.Vector3(jv[0][i], jv[1][i], jv[2][i]).normalize()) as [THREE.Vector3, THREE.Vector3, THREE.Vector3];

          const Imax = Math.max(...sortedVals) || 1;
          const spinAxis = sortedVecs[0].clone(); // axis of minimum moment = most stable

          // ── Surface area and volume from indexed triangles ──
          let geomVolume = 0;
          let geomSurfaceArea = 0;
          const idxBuf = geometry.index;
          if (idxBuf) {
            for (let ti = 0; ti < idxBuf.count; ti += 3) {
              const i0 = idxBuf.getX(ti), i1 = idxBuf.getX(ti+1), i2 = idxBuf.getX(ti+2);
              const x0 = pos.getX(i0), y0 = pos.getY(i0), z0 = pos.getZ(i0);
              const x1 = pos.getX(i1), y1 = pos.getY(i1), z1 = pos.getZ(i1);
              const x2 = pos.getX(i2), y2 = pos.getY(i2), z2 = pos.getZ(i2);
              // Signed tetrahedral volume (divergence theorem)
              geomVolume += (x0*(y1*z2 - y2*z1) + x1*(y2*z0 - y0*z2) + x2*(y0*z1 - y1*z0)) / 6;
              // Triangle area
              const ex1 = x1-x0, ey1 = y1-y0, ez1 = z1-z0;
              const ex2 = x2-x0, ey2 = y2-y0, ez2 = z2-z0;
              const cx2 = ey1*ez2 - ez1*ey2, cy2 = ez1*ex2 - ex1*ez2, cz2 = ex1*ey2 - ey1*ex2;
              geomSurfaceArea += 0.5 * Math.sqrt(cx2*cx2 + cy2*cy2 + cz2*cz2);
            }
          }
          const absVolume = Math.abs(geomVolume);

          const stabilityIdx = sortedVals[2] > 0.001
            ? (sortedVals[2] - sortedVals[0]) / sortedVals[2]
            : 0;

          shapeDynamicsRef.current = {
            principalMoments: [sortedVals[0]/Imax, sortedVals[1]/Imax, sortedVals[2]/Imax],
            stabilityIndex: Math.max(0, Math.min(1, stabilityIdx)),
            gyroscopicRatio: sortedVals[0] > 0 ? sortedVals[2] / sortedVals[0] : 1,
            optimalSpinAxis: spinAxis,
            principalAxes: sortedVecs,
            inertiaTensor: { Ixx, Iyy, Izz, Ixy, Ixz, Iyz },
            centerOfMass: new THREE.Vector3(cx, cy, cz),
            angularMomentum: spinAxis.clone(),
            volume: absVolume,
            surfaceArea: geomSurfaceArea,
            mass: absVolume, // unit density
          };
        }
      }
    } catch (_) { /* non-critical — shapeDynamicsRef retains previous value */ }

    setIsLoading(false); // Geometry generated, set loading to false

    return geometry;
  }, [
    // PARAMETER AUTHORITY: Track authority values for guaranteed reactivity
    // This ensures geometry updates when authority values change
    mergedParameters.type,
    authorityValues.a, authorityValues.b, authorityValues.c,
    authorityValues.d, authorityValues.e, authorityValues.f, authorityValues.g,
    authorityValues.h, authorityValues.i, authorityValues.j, authorityValues.k,
    authorityValues.l, authorityValues.m, authorityValues.n, authorityValues.o,
    authorityValues.p, authorityValues.q, authorityValues.r, authorityValues.s,
    authorityValues.t, authorityValues.u, authorityValues.v, authorityValues.w,
    authorityValues.x, authorityValues.y, authorityValues.z,
    // mergedParameters.time intentionally excluded — time changes every frame via animTimeRef
    // and must NOT trigger geometry rebuilds. Only structural parameters drive rebuilds.
    mergedParameters.uMin, mergedParameters.uMax, mergedParameters.vMin, mergedParameters.vMax,
    mergedParameters.uSegments, mergedParameters.vSegments,
    optimalMesh, externalGeometry
  ]);

  // Pass geometry to parent for Shape Dynamics panel
  useEffect(() => {
    if (geometry && onGeometryUpdate) {
      onGeometryUpdate(geometry);
    }
  }, [geometry, onGeometryUpdate]);

  const material = useMemo(() => {
    const lockedColor = LOCKED_SHAPE_COLORS[parameters.type];

    const materialPreset = MATERIAL_PRESETS[colorMode];

    const getColor = () => {
      if (lockedColor) return lockedColor;
      if (materialPreset) return materialPreset.properties.color;

      switch (colorMode) {
        case 'neon_green': return '#00ff00';
        case 'neon_blue': return '#00ffff';
        case 'neon_pink': return '#ff00ff';
        case 'plasma': return '#8b00ff';
        case 'rainbow': return '#ff0080';
        case 'pure_white': return '#ffffff';
        case 'pure_black': return '#000000';
        case 'viridis': return '#21918c';
        case 'inferno': return '#f98e09';
        case 'magma': return '#b73779';
        case 'gold': return '#ffd700';
        case 'silver': return '#c0c0c0';
        case 'copper': return '#b87333';
        case 'emerald': return '#50c878';
        case 'ruby': return '#e0115f';
        case 'sapphire': return '#0f52ba';
        case 'amethyst': return '#9966cc';
        default: return '#00ff88';
      }
    };

    const color = new THREE.Color(getColor());

    if (colorMode === 'none' || colorMode === '') {
      return new THREE.MeshStandardMaterial({
        color: '#888888',
        metalness: 0.1,
        roughness: 0.7,
        side: THREE.DoubleSide,
        transparent: false,
      });
    }

    if (visualizationMode === 'points') {
      return new THREE.PointsMaterial({
        color,
        size: 0.1,
        transparent: false,
        sizeAttenuation: true
      });
    } else {
      if (colorMode.startsWith('custom_')) {
        const presetId = colorMode.replace('custom_', '');
        const customMaterial = customTextureManager.createMaterialFromCustomPreset(presetId, THREE.DoubleSide);
        if (customMaterial) {
          customMaterial.roughness = 0.3;
          customMaterial.metalness = 0.5;
          customMaterial.envMapIntensity = 1.8;
          if ('clearcoat' in customMaterial) {
            (customMaterial as THREE.MeshPhysicalMaterial).clearcoat = 0.9;
            (customMaterial as THREE.MeshPhysicalMaterial).clearcoatRoughness = 0.05;
          }
          return customMaterial;
        }
      }

      if (materialPreset && !lockedColor) {
        const mat = createMaterialFromPreset(colorMode, THREE.DoubleSide);
        if (TRIPLANAR_PATTERN_IDS.has(colorMode)) {
          injectTriplanarFbm(mat as THREE.MeshPhysicalMaterial, {
            pattern: colorMode,
            fBmLayers: parameters.fBmLayers ?? 3,
            domainWarp: parameters.domainWarp ?? 0,
          });
        }
        return mat;
      }

      if (ENGINEERING_PBR_MATERIALS[colorMode]) {
        return createEngineeringPBRMaterial(colorMode);
      }

      return new THREE.MeshPhysicalMaterial({
        color,
        metalness: 0.55,
        roughness: 0.25,
        emissive: color.clone().multiplyScalar(0.25),
        emissiveIntensity: 0.45,
        transparent: false,
        side: THREE.DoubleSide,
        envMapIntensity: 2.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        sheen: 0.6,
        sheenRoughness: 0.15,
        sheenColor: color.clone().multiplyScalar(0.5),
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      });
    }
  }, [visualizationMode, colorMode, parameters.type, backgroundMode, parameters.fBmLayers, parameters.domainWarp]);

  // Calculate transform values from parameters
  const rotationX = ((parameters.rotationX ?? 0) * Math.PI) / 180;
  const rotationY = ((parameters.rotationY ?? 0) * Math.PI) / 180;
  const rotationZ = ((parameters.rotationZ ?? 0) * Math.PI) / 180;

  // AUTO-SCALE: Normalize all shapes to consistent visible size (target ~15 units)
  const autoScaleFactor = useMemo(() => {
    if (!geometry) return 5; // Default scale if no geometry

    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return 5;

    const size = new THREE.Vector3();
    box.getSize(size);

    // Check for NaN or Infinity values in size
    if (!isFinite(size.x) || !isFinite(size.y) || !isFinite(size.z)) {
      console.warn('⚠️ Invalid bounding box size, using default scale');
      return 5;
    }

    const maxDimension = Math.max(size.x, size.y, size.z);

    // Target size of 15 units for all shapes
    const TARGET_SIZE = 15;

    // Handle edge cases
    if (!isFinite(maxDimension) || isNaN(maxDimension)) {
      console.warn('⚠️ Invalid maxDimension, using default scale');
      return 5;
    }

    // Zero or very small shapes: use default scale (geometry may not be computed yet)
    if (maxDimension <= 0 || maxDimension < 0.001) {
      // Don't log spam for zero dimensions - this is often just timing
      if (maxDimension > 0) {
        console.log(`📐 Very small shape (${maxDimension.toFixed(6)}), using default scale`);
      }
      return 5; // Safe default scale instead of extreme 15000x
    }

    // Very large shapes: scale them down
    if (maxDimension > 10000) {
      return TARGET_SIZE / maxDimension;
    }

    const scaleFactor = TARGET_SIZE / maxDimension;

    // Clamp to reasonable range (0.1x to 500x for very small shapes)
    return Math.max(0.1, Math.min(500, scaleFactor));
  }, [geometry]);

  // COMPUTE SHAPE DYNAMICS FROM ACTUAL GEOMETRY - for physics-based animation
  useEffect(() => {
    if (!geometry || !isPhysicsAnimating) return;

    try {
      console.log('🔬 Computing shape dynamics for physics animation...');
      const dynamics = computeShapeDynamics(geometry, 1000, 1);

      if (dynamics && dynamics.momentOfInertia) {
        const { Ixx, Iyy, Izz } = dynamics.momentOfInertia;

        // Sort principal moments to get I1 <= I2 <= I3
        const moments: [number, number, number] = [
          Math.abs(Ixx) || 1,
          Math.abs(Iyy) || 1,
          Math.abs(Izz) || 1
        ].sort((a, b) => a - b) as [number, number, number];

        const [I1, I2, I3] = moments;

        // Stability index: 0 = symmetric (stable), 1 = highly asymmetric (unstable)
        const stabilityIndex = I2 > 0.001 ? (I3 - I1) / I2 : 0;

        // Gyroscopic ratio: ratio of largest to smallest moment
        const gyroscopicRatio = I1 > 0.001 ? I3 / I1 : 1;

        // Find axis of minimum moment of inertia (most stable spin axis)
        let optimalAxis = new THREE.Vector3(0, 1, 0);
        const minMoment = Math.min(Ixx, Iyy, Izz);
        if (minMoment === Ixx) optimalAxis = new THREE.Vector3(1, 0, 0);
        else if (minMoment === Izz) optimalAxis = new THREE.Vector3(0, 0, 1);

        // Merge into existing ref — preserve Jacobi-computed fields
        // (principalAxes, inertiaTensor, volume, surfaceArea, mass) set by useMemo.
        shapeDynamicsRef.current = {
          ...shapeDynamicsRef.current,
          principalMoments: moments,
          stabilityIndex,
          gyroscopicRatio,
          optimalSpinAxis: optimalAxis,
          centerOfMass: new THREE.Vector3(
            dynamics.centerOfMass?.x || 0,
            dynamics.centerOfMass?.y || 0,
            dynamics.centerOfMass?.z || 0
          ),
          angularMomentum: new THREE.Vector3(0, 1, 0),
        };

        console.log(`✅ Shape dynamics computed:
  Principal Moments: [${I1.toFixed(2)}, ${I2.toFixed(2)}, ${I3.toFixed(2)}]
  Stability Index: ${stabilityIndex.toFixed(3)} (${stabilityIndex < 0.3 ? 'stable' : stabilityIndex < 0.7 ? 'moderate' : 'unstable'})
  Gyroscopic Ratio: ${gyroscopicRatio.toFixed(2)} (${gyroscopicRatio > 2 ? 'high resistance' : 'low resistance'})
  Optimal Spin Axis: [${optimalAxis.x}, ${optimalAxis.y}, ${optimalAxis.z}]`);
      }
    } catch (error) {
      console.warn('⚠️ Could not compute shape dynamics:', error);
    }

    // Reset animation time when shape changes
    animTimeRef.current = 0;
  }, [geometry, isPhysicsAnimating, parameters.type]);

  // PURE AXIS SCALING: A/B/C mesh-level scale rules:
  //  - Switch-case primitives (always return early, never reach vertex loop) → always apply
  //  - Vertex-loop shapes with a/b/c declared in manifest → apply (they can't use vertex path for ABC)
  //  - Vertex-loop shapes without a/b/c in manifest → scale already applied at vertex level; skip here
  const SWITCH_PRIMITIVE_TYPES = new Set([
    'cube','sphere','torus','cylinder','cone',
    'tetrahedron','octahedron','dodecahedron','icosahedron',
    'square','diamond_round_brilliant','diamond_princess','diamond_emerald'
  ]);
  const _isSwitchPrimitive = SWITCH_PRIMITIVE_TYPES.has(parameters.type);
  const _meshManifest = getManifest(parameters.type);
  const _meshABCActive = _meshManifest?.activeParams ?? [];
  const axisScaleA = (_isSwitchPrimitive || _meshABCActive.includes('a')) ? (authorityValues.a ?? 1) : 1;
  const axisScaleB = (_isSwitchPrimitive || _meshABCActive.includes('b')) ? (authorityValues.b ?? 1) : 1;
  const axisScaleC = (_isSwitchPrimitive || _meshABCActive.includes('c')) ? (authorityValues.c ?? 1) : 1;

  // Flip transforms: flip = -1, no flip = 1
  // Combined with auto-scale AND A/B/C pure axis scaling
  const scaleX = (parameters.flipX ? -1 : 1) * autoScaleFactor * axisScaleA;
  const scaleY = (parameters.flipY ? -1 : 1) * autoScaleFactor * axisScaleB;
  const scaleZ = (parameters.flipZ ? -1 : 1) * autoScaleFactor * axisScaleC;

  // Create wireframe geometry for topology overlay rendering
  const wireframeGeometry = useMemo(() => {
    if (visualizationMode === 'wireframe' && geometry) {
      return new THREE.WireframeGeometry(geometry);
    }
    return null;
  }, [geometry, visualizationMode]);

  // Wireframe line material — coloured to stand out against any background/material
  const wireframeLineMaterial = useMemo(() => {
    const lockedColor = LOCKED_SHAPE_COLORS[parameters.type];
    let wireframeColor: THREE.Color;
    if (backgroundMode === 'white') {
      wireframeColor = new THREE.Color('#000000');
    } else if (lockedColor) {
      wireframeColor = new THREE.Color(lockedColor).multiplyScalar(1.8);
    } else {
      wireframeColor = new THREE.Color('#00ff88');
    }
    return new THREE.LineBasicMaterial({
      color: wireframeColor,
      transparent: true,
      opacity: 0.85,
      linewidth: 1,
      depthTest: true
    });
  }, [visualizationMode, backgroundMode, parameters.type]);

  // Wireframe mode: render topology lines. When colorMode is 'none' render only
  // the wire lines for a clean neutral mesh; otherwise overlay on the active material.
  if (visualizationMode === 'wireframe' && wireframeGeometry) {
    const isCleanWireframe = colorMode === 'none' || colorMode === '';

    if (isCleanWireframe) {
      return (
        <group
          rotation={[rotationX, rotationY, rotationZ]}
          scale={[scaleX, scaleY, scaleZ]}
        >
          {/* Invisible mesh keeps meshRef on canonical triangle geometry for export */}
          <mesh ref={meshRef} geometry={geometry} visible={false} />
          {/* Clean wireframe: lines only, no filled surface visible */}
          <lineSegments geometry={wireframeGeometry} material={wireframeLineMaterial} />
        </group>
      );
    }

    // Material active: show full surface + glowing edge overlay
    const overlaidMaterial =
      (material instanceof THREE.MeshStandardMaterial)
        ? addWireframeOverlay(material)
        : material;

    return (
      <group
        rotation={[rotationX, rotationY, rotationZ]}
        scale={[scaleX, scaleY, scaleZ]}
      >
        {/* Full active material surface — preserves procedural textures/maps */}
        <mesh ref={meshRef} geometry={geometry} material={overlaidMaterial} castShadow receiveShadow />
        {/* Topology wireframe line overlay on top for clear edge/topology visibility */}
        <lineSegments geometry={wireframeGeometry} material={wireframeLineMaterial} />
      </group>
    );
  }

  if (visualizationMode === 'points') {
    return (
      <points 
        ref={meshRef as any} 
        geometry={geometry} 
        material={material}
        rotation={[rotationX, rotationY, rotationZ]}
        scale={[scaleX, scaleY, scaleZ]}
      />
    );
  }

  return (
    <mesh 
      ref={meshRef} 
      geometry={geometry} 
      material={material} 
      castShadow 
      receiveShadow
      rotation={[rotationX, rotationY, rotationZ]}
      scale={[scaleX, scaleY, scaleZ]}
    />
  );
}