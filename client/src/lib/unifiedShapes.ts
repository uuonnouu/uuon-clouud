import { SurfaceParameters } from '../types/math';
import { getCleanDefaults as sharedGetCleanDefaults } from '../types/shapes';
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';
import { MULTIDIMENSIONAL_FRACTALS } from './multidimensionalFractals';
import { SCHRODINGER_EQUATIONS } from './schrodingerEquations';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { ENTANGLEMENT_ALGORITHMS } from './entanglementAlgorithms';
import { SEQUENCE_PATTERNS } from './sequencePatterns';
import { UNIFIED_MATH_SYMBOLS } from './unifiedMathSymbols';
import { SET_THEORY_SHAPES } from './setTheoryShapes';
import { CHAKRA_SHAPES } from './chakraShapes';
import { DNA_STRUCTURES } from './dnaStructures';
import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';
import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { THEORY_OF_EVERYTHING_SHAPES } from './theoryOfEverythingShapes';
import { TEN_PERCENT_SHAPES } from './tenPercentShapes';
import LIFE_SCIENCES_SHAPES from './lifeSciencesShapes';
import EARTH_SCIENCES_SHAPES from './earthSciencesShapes';
import SOCIAL_SCIENCES_SHAPES from './socialSciencesShapes';
import { SCIENTIFIC_EXPANSION_SHAPES } from './scientificExpansionShapes';
import UNIFIED_MASTER_EQUATION_SHAPES from './unifiedMasterEquation';
import { GMOD6_SURFACES } from './uuon-gmod6-engine';
import { TOPOLOGY_DIFFERENTIAL_SHAPES } from './topologyDifferentialShapes';
import { QPU_QUANTUM_COMPUTING_SHAPES } from './qpuQuantumComputingShapes';
import { FRACTAL_ANALYSIS_SHAPES } from './fractalAnalysisShapes';
import { ICE_CRYSTAL_SHAPES } from './iceCrystalShapes';
import { FRACTAL_SHAPE_IMPLEMENTATIONS } from './fractalShapeImplementations';
import { DMENSION_PATTERN_CODEX } from './dmensionPatternCodex';
import { UUON_MESH_SHAPES, UUON_MESH_SHAPE_COUNT } from './uuonMeshEngine';
import { HARMONY_WAVE_SHAPES, HARMONY_WAVE_SHAPE_COUNT } from './harmonyWaveShapes';
import { ATOMIC_STRUCTURE_SHAPES, ATOMIC_STRUCTURE_SHAPE_COUNT } from './atomicStructureShapes';
import { HISTORICAL_ALGORITHMS, HISTORICAL_ALGORITHMS_COUNT } from './historicalAlgorithms';
import { UNIFIED_TOE_CANVAS, UNIFIED_TOE_CANVAS_COUNT } from './unifiedTOECanvas';
import { COMPLETE_MISSING_SHAPES } from './completeMissingShapesLibrary';
import { THERMAL_ENGINEERING_SHAPES, THERMAL_ENGINEERING_SHAPE_COUNT } from './thermalEngineeringShapes';
import { CROSS_DOMAIN_HYBRID_SHAPES, CROSS_DOMAIN_HYBRID_SHAPE_COUNT } from './crossDomainHybridShapes';
import { SCIENTIFIC_IDENTITY_SHAPES, SCIENTIFIC_IDENTITY_SHAPE_COUNT } from './scientificIdentityShapes';
import { ALL_TIME_PHENOMENON_SHAPES, TIME_PRINCIPLE_SHAPES, PHENOMENON_PRINCIPLE_SHAPES, UNIFIED_PRINCIPLE_SHAPES } from './timePhenomenonShapes';
import { LINGUISTIC_GEOMETRY_SHAPES } from './linguisticGeometryShapes';
import { MISSING_19_SHAPES, MISSING_19_SHAPE_COUNT } from './missing19ShapesImplementation';
import { ALL_MINIMAL_SURFACES, ALL_MINIMAL_SURFACES_COUNT, MINIMAL_SURFACES_SPHERE_COUNT, MINIMAL_SURFACES_TORI_COUNT, MINIMAL_SURFACES_HIGHER_GENUS_COUNT } from './minimalSurfacesLibrary';
import { CHAOS_THEORY_SHAPES, CHAOS_THEORY_SHAPE_COUNT } from './chaosTheoryShapes';
import { CONSCIOUSNESS_MATH_SHAPES, CONSCIOUSNESS_MATH_SHAPE_COUNT } from './consciousnessMathShapes';

/**
 * UNIFIED SHAPE TEMPLATE - MASTER FILE
 * **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
 * **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
 * **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**
 * 
 * IMPORTANT: ALL NEW SHAPES MUST BE ADDED TO THIS FILE
 * 
 * ENHANCED PARAMETERS A-M WITH GEOMETRIC TRANSFORMATIONS
 * Each parameter controls a distinct geometric or material property
 * All shapes are manipulative in this 4D space
 * 
 * GEOMETRIC TRANSFORMATION PARAMETERS (A-F): Range 0.0 → 25.00
 * a = SCALE UNIFORMITY - Controls overall size with uniform scaling across all axes
 * b = SCALE ANISOTROPY - Controls non-uniform scaling (stretching/compression ratio)
 * c = ROTATION INTENSITY - Controls combined rotational transformation magnitude
 * d = SHEAR TRANSFORM - Controls shear deformation along primary axes
 * e = SKEW ASYMMETRY - Controls asymmetrical skewing and perspective distortion
 * f = DEFORMATION AMPLITUDE - Controls mesh deformation and surface warping intensity
 * 
 * CURVATURE & TOPOLOGY PARAMETERS (G-J): Range 0.0 → 25.00
 * g = CURVATURE RADIUS - Controls bending radius and overall surface curvature
 * h = SURFACE TWIST - Controls helical/spiral twist applied to the geometry
 * i = TAPER RATIO - Controls conical tapering from base to tip
 * j = BULGE FACTOR - Controls outward bulging and volume expansion
 * 
 * FREQUENCY & MODULATION PARAMETERS (K-M): Range 0.0 → 25.00
 * k = FREQUENCY MULTIPLIER - Controls oscillation frequency for wave-like deformations
 * l = AMPLITUDE MODULATION - Controls depth of periodic surface variations
 * m = PHASE OFFSET - Controls phase shift for multi-axis wave interactions
 * 
 * n-z = Advanced mathematical parameters
 */

export const getCleanDefaults = sharedGetCleanDefaults;

export const UNIFIED_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // EQUIRECTANGULAR SPHERE - Perfect for World Map Projection
  // Standard spherical projection used in cartography and Earth textures
  // ============================================================================

  equirectangular_sphere: {
    name: "🌍 Equirectangular Sphere - World Map Projection",
    equation: (u, v, params) => {
      const radius = params.a ?? 8;
      
      // Equirectangular projection: direct UV to spherical mapping
      // u maps to longitude (0 to 2π), v maps to latitude (0 to π)
      const theta = u * Math.PI * 2;  // Longitude: 0 to 360°
      const phi = v * Math.PI;         // Latitude: 0 to 180° (pole to pole)
      
      // Perfect sphere - ideal for texture mapping
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 128, vSegments: 64
    })
  },

  // ============================================================================
  // UUON=(U² O(n)) - Linear Complexity in U-Squared Space
  // ============================================================================

  uuon: {
    name: "🔢 UUON/U²O(n) - LINEAR COMPLEXITY ALGORITHM",
    equation: (u, v, params) => {
      const scale = params.a ?? 3;       // Overall scale
      const amplitude = params.b ?? 1;   // Wave amplitude  
      const depth = params.c ?? 1;       // Z-axis modulation
      const twist = params.d ?? 0;       // Spiral twist
      const harmonic = params.e ?? 0;    // Harmonic frequency
      const ripple = params.f ?? 0;      // Ripple effect

      // U² O(n) - Combining quadratic mapping with linear complexity
      const uSquared = u * u;            // U² transformation
      const linearN = v;                 // O(n) - linear progression

      // The UUON core equation: f(u,v) = u² · n where n scales linearly
      const uuonCore = uSquared * linearN;

      // Create expanding rings representing O(n) growth
      const theta = u * Math.PI * 2;
      const n = Math.floor(v * 8) + 1;   // Discrete n levels (1 to 8)
      const nContinuous = v * 8;

      // Radius grows with n (linear complexity visualization)
      const baseRadius = scale * (0.5 + 0.5 * linearN);

      // U² modulates the surface at each n level
      const uSquaredWave = Math.sin(uSquared * Math.PI * 4) * amplitude * 0.3;

      // Height shows complexity layers
      const layerHeight = depth * (n / 4 - 1);

      // Apply transformations
      const twistAngle = theta + (twist * linearN * 0.1);
      const harmonicMod = harmonic !== 0 ? Math.sin(harmonic * theta * 2) * 0.1 : 0;
      const rippleMod = ripple !== 0 ? Math.cos(ripple * nContinuous * Math.PI) * 0.05 : 0;

      // Final coordinates - toroidal structure showing O(n) levels
      const r = baseRadius * (1 + uSquaredWave + harmonicMod + rippleMod);

      const x = r * Math.cos(twistAngle);
      const y = r * Math.sin(twistAngle);
      const z = layerHeight + uuonCore * depth * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uSegments: 96, vSegments: 72
    })
  },

  // ============================================================================
  // WAVE DISPLACEMENT PLANE - Flat Surface with Wave Algorithms
  // Double-meshed flat surface for wave visualization and displacement mapping
  // ============================================================================

  wave_displacement_plane: {
    name: "〰️ Wave Displacement Plane - Studio Surface",
    description: "High-density flat surface for wave algorithms and displacement visualization. Use parameters: A=size, D=wave amplitude, E=wave frequency, G=wave type (0=sine, 1=cosine, 2=noise, 3=ripple), H=animation speed.",
    equation: (u, v, params) => {
      const size = params.a ?? 10;
      const amplitude = params.d ?? 0.5;
      const frequency = params.e ?? 2;
      const waveType = Math.round(params.g ?? 0) % 4;
      const animTime = params.h ?? 0;
      
      const x = (u - 0.5) * size;
      const y = (v - 0.5) * size;
      
      let z = 0;
      
      if (waveType === 0) {
        z = Math.sin(x * frequency + animTime) * Math.sin(y * frequency + animTime) * amplitude;
      } else if (waveType === 1) {
        z = Math.cos(x * frequency + animTime) * Math.cos(y * frequency + animTime) * amplitude;
      } else if (waveType === 2) {
        const hash = (n: number) => {
          const h = Math.sin(n * 127.1 + n * 311.7) * 43758.5453;
          return h - Math.floor(h);
        };
        const nx = Math.floor(x * frequency * 0.5);
        const ny = Math.floor(y * frequency * 0.5);
        z = (hash(nx + ny * 57 + animTime * 0.1) * 2 - 1) * amplitude;
      } else {
        const dist = Math.sqrt(x * x + y * y);
        z = Math.sin(dist * frequency - animTime * 2) * amplitude * Math.exp(-dist * 0.1);
      }
      
      return [x, z, y];
    },
    defaultParams: getCleanDefaults({ 
      a: 10, d: 1.5, e: 4, g: 0, h: 0,
      uSegments: 256, vSegments: 256
    })
  },

  wave_interference_plane: {
    name: "〰️ Wave Interference Plane - Multi-source",
    description: "Multiple wave sources creating interference patterns. A=size, D=amplitude, E=frequency, F=source count, G=phase offset.",
    equation: (u, v, params) => {
      const size = params.a ?? 10;
      const amplitude = params.d ?? 1.0;
      const frequency = params.e ?? 5;
      const sources = Math.max(1, Math.round(params.f ?? 4));
      const phase = params.g ?? 0;
      
      const x = (u - 0.5) * size;
      const y = (v - 0.5) * size;
      
      let z = 0;
      
      for (let i = 0; i < sources; i++) {
        const angle = (i / sources) * Math.PI * 2;
        const sx = Math.cos(angle) * size * 0.4;
        const sy = Math.sin(angle) * size * 0.4;
        const dist = Math.sqrt((x - sx) ** 2 + (y - sy) ** 2);
        z += Math.sin(dist * frequency + phase + i * 0.5) * amplitude / sources;
      }
      
      return [x, z, y];
    },
    defaultParams: getCleanDefaults({ 
      a: 10, d: 1.0, e: 5, f: 4, g: 0,
      uSegments: 192, vSegments: 192
    })
  },

  // ============================================================================
  // THE SHAPE OF THE UNIVERSE - Primary Unified Mathematical Structure
  // Synthesizes ALL mathematical formulas into one coherent visualization
  // ============================================================================

  shape_of_universe: {
    name: "🌌 Shape of the Universe - Unified Mathematical Structure",
    equation: (u, v, params) => {
      // Enhanced parameters for multi-scale control with proper zero handling
      const a = params.a ?? 4;  // Primary cosmic scale
      const b = params.b ?? 2;  // Secondary quantum scale  
      const c = params.c ?? 1;  // Tertiary lattice scale
      const d = params.d ?? 0;  // Harmonic amplitude (0 = static base)
      const e = params.e ?? 0;  // Wave frequency multiplier
      const f = params.f ?? 0;  // Fractal complexity depth
      const g = params.g ?? 0;  // Spacetime curvature intensity
      const h = params.h ?? 0;  // Lattice network strength
      const i = params.i ?? 0;  // Quantum vacuum fluctuation
      const j = params.j ?? 0;  // Dark energy expansion
      const k = params.k ?? 5;  // Harmonic resonance count
      const l = params.l ?? 0;  // Microstructure detail level
      const m = params.m ?? 0;  // Phase synchronization offset
      const n = params.n ?? 0;  // Dimensional folding parameter
      const o = params.o ?? 0;  // Consciousness field strength
      const p = params.p ?? 0;  // Information density
      const q = params.q ?? 0;  // Entropic flow direction
      const r = params.r ?? 0;  // Field coupling strength
      const s = params.s ?? 0;  // Symmetry breaking parameter
      const t = params.t ?? 0;  // Temporal flow rate
      const uu = params.u ?? 0; // Unified field coherence
      const vv = params.v ?? 0; // Vibrational harmonics
      const w = params.w ?? 0;  // Wavefunction collapse probability
      const x = params.x ?? 1;  // X-dimension scaling
      const y = params.y ?? 1;  // Y-dimension scaling
      const z = params.z ?? 1;  // Z-dimension scaling
      const time = params.time ?? 0;

      // =================================================================
      // LAYER 1: COSMIC TOPOLOGY - Enhanced spherical manifold base
      // =================================================================
      const theta = u * 2 * Math.PI; // Azimuthal coordinate
      const phi = v * Math.PI;       // Polar coordinate
      
      // Base cosmic sphere with enhanced curvature dynamics
      const baseRadius = a * (1 + g * Math.sin(theta * 2) * Math.cos(phi) * 0.1);
      const cosmicCurvature = 1 + g * (
        Math.sin(theta * 3 + time * 0.1) * Math.cos(phi * 2) * 0.05 +
        Math.cos(theta + phi + time * 0.2) * 0.03
      );

      // =================================================================
      // LAYER 2: QUANTUM FIELD FLUCTUATIONS - Vacuum energy effects
      // =================================================================
      let quantumFluctuation = 0;
      if (i > 0) {
        const vacuumEnergy = Math.sin(u * 20 * Math.PI) * Math.cos(v * 15 * Math.PI);
        const zeroPointField = Math.sin(theta * 8 + time) * Math.sin(phi * 6);
        quantumFluctuation = i * (vacuumEnergy * 0.02 + zeroPointField * 0.015);
      }

      // =================================================================
      // LAYER 3: LATTICE NETWORK STRUCTURE - Discrete spacetime
      // =================================================================
      let latticeEffect = 0;
      if (h > 0) {
        const latticeX = Math.sin(u * 12 * Math.PI) > 0.7 ? 1 : 0;
        const latticeY = Math.cos(v * 12 * Math.PI) > 0.7 ? 1 : 0;
        const latticeInteraction = latticeX * latticeY;
        latticeEffect = h * latticeInteraction * Math.sin(time * 2) * 0.08;
      }

      // =================================================================
      // LAYER 4: FRACTAL MICROSTRUCTURE - Self-similar patterns
      // =================================================================
      let fractalDetail = 0;
      if (f > 0) {
        let fractalSum = 0;
        for (let octave = 1; octave <= Math.floor(f * 4) + 1; octave++) {
          const freq = Math.pow(2, octave);
          const amplitude = 1 / Math.pow(2, octave);
          fractalSum += amplitude * (
            Math.sin(theta * freq + time * octave * 0.1) *
            Math.cos(phi * freq * 0.8 + time * octave * 0.15)
          );
        }
        fractalDetail = f * fractalSum * 0.03;
      }

      // =================================================================
      // LAYER 5: HARMONIC RESONANCE - Universal frequency patterns
      // =================================================================
      let harmonicWaves = 0;
      if (d > 0) {
        let harmonicSum = 0;
        for (let harmonic = 1; harmonic <= k; harmonic++) {
          const frequency = harmonic * (e + 1);
          const phase = m + harmonic * Math.PI / k;
          harmonicSum += Math.sin(theta * frequency + phase) * Math.cos(phi * frequency * 0.7 + phase * 0.8) / harmonic;
        }
        harmonicWaves = d * harmonicSum * 0.06;
      }

      // =================================================================
      // LAYER 6: DARK ENERGY EXPANSION - Accelerating universe
      // =================================================================
      let darkEnergyEffect = 0;
      if (j > 0) {
        const expansionFactor = 1 + j * time * 0.001;
        const darkEnergyField = Math.sin(theta * 1.5 + time * 0.05) * Math.cos(phi * 1.2 + time * 0.08);
        darkEnergyEffect = j * darkEnergyField * expansionFactor * 0.04;
      }

      // =================================================================
      // LAYER 7: CONSCIOUSNESS FIELD - Information processing layer
      // =================================================================
      let consciousnessField = 0;
      if (o > 0) {
        const infoProcess = Math.sin(u * 26 * Math.PI) * Math.cos(v * 26 * Math.PI); // 26-dimensional consciousness
        const coherenceWave = Math.sin(theta + phi + time * 0.1);
        consciousnessField = o * infoProcess * coherenceWave * 0.025;
      }

      // =================================================================
      // LAYER 8: TEMPORAL DYNAMICS - Time flow variations
      // =================================================================
      let temporalFlow = 0;
      if (t > 0) {
        const timeWarp = Math.sin(theta * 2 + time * 0.3) * Math.cos(phi + time * 0.2);
        const chronalField = Math.sin(u * 8 * Math.PI + time) * Math.cos(v * 6 * Math.PI + time * 1.2);
        temporalFlow = t * (timeWarp + chronalField * 0.5) * 0.03;
      }

      // =================================================================
      // LAYER 9: UNIFIED FIELD COHERENCE - Field unification
      // =================================================================
      let unifiedFieldEffect = 0;
      if (uu > 0) {
        const fieldUnification = (
          Math.sin(theta * 3 + phi * 2) +
          Math.cos(theta + phi * 3) +
          Math.sin(theta * 2 + phi + time * 0.1)
        ) / 3;
        unifiedFieldEffect = uu * fieldUnification * 0.035;
      }

      // =================================================================
      // LAYER 10: DIMENSIONAL FOLDING - Extra dimensions
      // =================================================================
      let dimensionalFolding = 0;
      if (n > 0) {
        const kk_modes = Math.sin(theta * 7) * Math.cos(phi * 11); // Kaluza-Klein modes
        const compactification = Math.sin(u * 16 * Math.PI) * Math.cos(v * 13 * Math.PI);
        dimensionalFolding = n * (kk_modes + compactification * 0.7) * 0.02;
      }

      // =================================================================
      // LAYER 11: CONNECTION BRIDGE GROWTH - Dynamic gap bridging
      // The universe grows as mathematical connections are discovered
      // P = Connection density, Q = Bridge strength, R = Coherence coupling
      // =================================================================
      let connectionBridge = 0;
      const connectionDensity = p;  // How many connections discovered
      const bridgeStrength = q;     // Strength of gap bridges
      const coherenceCoupling = r;  // Field coherence between domains
      
      if (connectionDensity > 0 || bridgeStrength > 0 || coherenceCoupling > 0) {
        // Cross-domain bridge nodes (5 primary mathematical domains)
        const quantumBridge = Math.sin(theta * 5 + phi * 3) * Math.cos(theta - phi);
        const cosmicBridge = Math.sin(theta * 2 + time * 0.1) * Math.cos(phi * 4);
        const fractalBridge = Math.sin(theta * 8) * Math.sin(phi * 13) * 0.5;
        const topologicalBridge = Math.cos(theta * 3 + phi * 5 + time * 0.05);
        const harmonicBridge = Math.sin((theta + phi) * 7) * Math.cos((theta - phi) * 11);
        
        // Connection network grows with discovered bridges
        const networkGrowth = 1 + connectionDensity * 0.1; // Expands as connections increase
        const bridgeInterference = (
          quantumBridge * 0.25 + 
          cosmicBridge * 0.2 + 
          fractalBridge * 0.2 + 
          topologicalBridge * 0.2 + 
          harmonicBridge * 0.15
        );
        
        // Coherence amplifies when domains connect
        const coherenceAmplification = 1 + coherenceCoupling * Math.sin(time * 0.08);
        
        // Total bridge contribution - universe literally grows with connections
        connectionBridge = bridgeStrength * bridgeInterference * networkGrowth * coherenceAmplification * 0.05;
      }

      // =================================================================
      // LAYER 12: SYMMETRY EMERGENCE - S parameter reveals hidden patterns
      // =================================================================
      let symmetryEmergence = 0;
      if (s > 0) {
        // Symmetry breaking reveals underlying structure
        const su3Color = Math.sin(theta * 3) * Math.sin(phi * 3) * Math.cos(theta + phi);
        const su2Weak = Math.sin(theta * 2) * Math.cos(phi * 2);
        const u1Hypercharge = Math.sin(theta + phi);
        symmetryEmergence = s * (su3Color * 0.4 + su2Weak * 0.35 + u1Hypercharge * 0.25) * 0.03;
      }

      // =================================================================
      // SYNTHESIS: Combine all 12 layers with proper scaling
      // Universe grows dynamically as connections are discovered
      // =================================================================
      const totalRadius = baseRadius * cosmicCurvature + 
                         quantumFluctuation + 
                         latticeEffect + 
                         fractalDetail + 
                         harmonicWaves + 
                         darkEnergyEffect + 
                         consciousnessField + 
                         temporalFlow + 
                         unifiedFieldEffect + 
                         dimensionalFolding +
                         connectionBridge +    // Layer 11: Gap bridging growth
                         symmetryEmergence;    // Layer 12: Hidden pattern emergence

      // Apply dimensional scaling
      const finalX = totalRadius * Math.sin(phi) * Math.cos(theta) * x;
      const finalY = totalRadius * Math.sin(phi) * Math.sin(theta) * y; 
      const finalZ = totalRadius * Math.cos(phi) * z;

      return [finalX, finalY, finalZ];
    },
    defaultParams: { 
      a: 4, b: 2, c: 1, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, 
      k: 5, l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, 
      u: 0, v: 0, w: 0, x: 1, y: 1, z: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 128, vSegments: 96 
    }
  },

  // ============================================================================
  // FOUNDATION SHAPES - Essential 3D Primitives
  // ============================================================================

  square: {
    name: "🔲 Square - Flat 2D Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 0;
      const d = params.d ?? 3;
      const e = params.e ?? 4;
      const f = params.f ?? 2;

      const x = a * (u - 0.5);
      const y = b * (v - 0.5);
      const z = c + d * Math.sin(e * u * Math.PI) * Math.cos(e * v * Math.PI) * 0.1 + 
                f * Math.sin((u + v) * Math.PI * 4) * 0.05;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 0, d: 3, e: 4, f: 2, uSegments: 64, vSegments: 64 })
  },

  cube: {
    name: "🧊 Cube - 3D Solid",
    equation: (u, v, params) => {
      // Pure axis mode: a=X width, b=Y height, c=Z depth - equal for proper cube
      const pureMode = params.pureAxisMode !== false;

      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;

      const face = Math.floor(u * 6) % 6;
      const localU = (u * 6) % 1;
      const localV = v;

      let x = 0, y = 0, z = 0;

      // Create unit cube first, then scale by a,b,c
      switch(face) {
        case 0: x = (localU - 0.5); y = (localV - 0.5); z = 0.5; break;  // Front
        case 1: x = (localU - 0.5); y = (localV - 0.5); z = -0.5; break; // Back
        case 2: x = 0.5; y = (localU - 0.5); z = (localV - 0.5); break;  // Right
        case 3: x = -0.5; y = (localU - 0.5); z = (localV - 0.5); break; // Left
        case 4: x = (localU - 0.5); y = 0.5; z = (localV - 0.5); break;  // Top
        case 5: x = (localU - 0.5); y = -0.5; z = (localV - 0.5); break; // Bottom
      }

      // D-F add surface detail (not affecting a,b,c)
      const waveX = d * Math.sin(localU * Math.PI * 4) * 0.05;
      const waveY = e * Math.cos(localV * Math.PI * 4) * 0.05;
      const waveZ = f * Math.sin((localU + localV) * Math.PI * 6) * 0.03;

      // Pure axis mode: a,b,c scale ONLY their axes
      return [
        a * x + waveX, 
        b * y + waveY, 
        c * z + waveZ
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, uSegments: 48, vSegments: 48 })
  },

  circle: {
    name: "⭕ Circle - 3D Disk",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      // D-M: Transform parameters - use ?? to allow 0 values
      const d = params.d ?? 0;  // Wave amplitude (default 0 for static)
      const e = params.e ?? 0;  // Wave frequency (default 0 for static)
      const f = params.f ?? 0;  // Secondary wave

      const theta = u * 2 * Math.PI;
      const r = v * a;
      const x = r * Math.cos(theta) * b;
      const y = r * Math.sin(theta) * c;
      // Only apply wave effects if d or e are non-zero
      const z = d * Math.sin(theta * (e || 1)) * v + f * Math.cos(v * Math.PI * 4) * 0.1;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1, d: 0, e: 0, f: 0, uSegments: 64, vSegments: 16 })
  },

  triangle: {
    name: "🔺 Triangle - 3D Solid",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 0;  // Z offset (default 0 for flat)
      // D-M: Transform parameters - use ?? to allow 0 values
      const d = params.d ?? 0;  // Wave multiplier (default 0 for static)
      const e = params.e ?? 0;  // Secondary wave (default 0 for static)
      const f = params.f ?? 0;  // Tertiary wave

      const angle = u * 2 * Math.PI;
      const r = v * a;
      const sides = 3;
      const sideAngle = Math.floor(angle / (2 * Math.PI / sides)) * (2 * Math.PI / sides);

      const x = r * Math.cos(sideAngle) * b;
      const y = r * Math.sin(sideAngle) * b;
      // Only apply wave effects if d, e, or f are non-zero
      const z = c + d * Math.sin(angle * 2) * 0.1 + e * Math.cos(v * Math.PI * 4) * 0.1 + f * Math.sin((u + v) * 8) * 0.1;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 0, d: 0, e: 0, f: 0, uSegments: 48, vSegments: 16 })
  },

  // ============================================================================
  // BASIC 3D CURVED SHAPES
  // ============================================================================

  cylinder: {
    name: "Cylinder",
    equation: (u, v, params) => {
      // Pure axis mode: a=X radius, b=Y radius, c=Z height
      const pureMode = params.pureAxisMode !== false;

      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g ?? 0; // WAVE FREQ
      const h = params.h ?? 0; // WAVE AMP
      const i = params.i ?? 0; // BULGE
      const j = params.j ?? 0; // PINCH
      const k = params.k ?? 0; // FLARE
      const l = params.l ?? 0; // TAPER
      const m = params.m ?? 0; // MIRROR FOLD

      // TWIST: Rotate based on height (D parameter)
      const twistAngle = d * v * 0.1;
      const baseX = Math.cos(u + twistAngle);
      const baseY = Math.sin(u + twistAngle);

      // G-M: Complex transformations (not affecting a,b,c)
      const waveRadius = 1 + h * Math.sin(g * v * Math.PI * 2) * 0.1;
      const bulgeFactor = 1 + i * Math.sin((v - 0.5) * Math.PI * 2) * 0.1;
      const pinchFactor = 1 / (1 + Math.abs(j) * 0.1 * Math.cos(v * Math.PI * 4));
      const flareFactor = 1 + k * Math.abs(v - 0.5) * 0.2;
      const taperFactor = 1 + l * (v - 0.5) * 0.1;

      // MIRROR FOLD: Symmetrical segments
      const mirrorU = m > 0 ? Math.floor(u / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : u;

      const finalRadius = Math.max(0.1, waveRadius * bulgeFactor * pinchFactor * flareFactor * taperFactor);

      if (pureMode) {
        // Pure axis mode: a,b,c scale ONLY their axes
        return [
          a * finalRadius * (m > 0 ? Math.cos(mirrorU) : baseX),
          b * finalRadius * (m > 0 ? Math.sin(mirrorU) : baseY),
          c * v
        ];
      } else {
        // Legacy mode: e,f also affect scaling
        return [
          a * finalRadius * (m > 0 ? Math.cos(mirrorU) : baseX) * e,
          b * finalRadius * (m > 0 ? Math.sin(mirrorU) : baseY) * e,
          c * v * f
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, e: 1, f: 1, uMin: 0, uMax: 6.28318, uSegments: 64, vSegments: 32 })
  },

  sphere: {
    name: "Sphere",
    equation: (u, v, params) => {
      // Pure axis mode: a,b,c control ONLY X,Y,Z scaling
      const pureMode = params.pureAxisMode !== false; // Default to true

      const a = params.a !== undefined ? params.a : 1;
      const b = params.b !== undefined ? params.b : 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 0;
      const m = params.m ?? 0;

      const sinV = Math.sin(v);
      const cosV = Math.cos(v);
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);

      // Base sphere coordinates (unit sphere)
      let x = sinV * cosU;
      let y = sinV * sinU;
      let z = cosV;

      // Apply D-M transformations (not a,b,c)
      const twistAngle = d * cosV * 0.1;
      if (Math.abs(d) > 0.001) {
        const cosT = Math.cos(twistAngle);
        const sinT = Math.sin(twistAngle);
        const xRot = x * cosT - y * sinT;
        const yRot = x * sinT + y * cosT;
        x = xRot;
        y = yRot;
      }

      const waveOffset = h * Math.sin(g * v) * 0.1;
      const bulgeFactor = 1 + i * Math.sin(v * Math.PI) * 0.1;
      const pinchFactor = Math.pow(2, -j * Math.cos(v * 2));
      const flareFactor = 1 + k * Math.abs(z) * 0.1;
      const taperFactor = 1 + l * z * 0.1;

      const mirrorU = m > 0 ? Math.floor(u / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : u;
      const mirrorCos = Math.cos(mirrorU);
      const mirrorSin = Math.sin(mirrorU);
      const mirrorZ = m > 0 ? Math.cos(v) : z;

      const radiusModulation = (1 + waveOffset) * bulgeFactor * pinchFactor * flareFactor * taperFactor;

      if (pureMode) {
        // Pure axis mode: a, b, c scale ONLY their respective axes
        return [
          a * (m > 0 ? mirrorCos * sinV : x) * radiusModulation,
          b * (m > 0 ? mirrorSin * sinV : y) * radiusModulation,
          c * (m > 0 ? mirrorZ : z) * radiusModulation
        ];
      } else {
        // Legacy mode: e,f also affect scaling (backwards compatibility)
        return [
          a * (m > 0 ? mirrorCos * sinV : x) * radiusModulation * e,
          b * (m > 0 ? mirrorSin * sinV : y) * radiusModulation * e,
          c * (m > 0 ? mirrorZ : z) * radiusModulation * f
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, e: 1, f: 1, uMin: 0, uMax: 6.28318, vMin: 0, vMax: 3.14159, uSegments: 64, vSegments: 32 })
  },

  unit_sphere: {
    name: "Unit Sphere (Radius = 1)",
    equation: (u, v, params) => {
      // Unit Sphere: x² + y² + z² = 1
      // A sphere with radius exactly 1, centered at the origin
      // The fundamental reference sphere in mathematics and physics
      
      const a = params.a !== undefined ? params.a : 1;
      const b = params.b !== undefined ? params.b : 1;
      const c = params.c !== undefined ? params.c : 1;
      
      // Spherical coordinates with unit radius (r = 1)
      // u ∈ [0, 2π] - azimuthal angle (longitude)
      // v ∈ [0, π] - polar angle (latitude from pole)
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);
      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      
      // Unit sphere parametric equations:
      // x = sin(v) * cos(u)
      // y = sin(v) * sin(u)  
      // z = cos(v)
      // These satisfy x² + y² + z² = 1
      
      return [
        a * sinV * cosU,  // x-coordinate
        b * sinV * sinU,  // y-coordinate
        c * cosV          // z-coordinate
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 1, c: 1, x: 1, y: 1, z: 1,
      uMin: 0, uMax: 6.28318, 
      vMin: 0, vMax: 3.14159, 
      uSegments: 64, vSegments: 32 
    })
  },

  torus: {
    name: "Torus",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 2;
      const b = params.b !== undefined ? params.b : 0.8;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 0;
      const m = params.m ?? 0;

      const twistAngle = d * v;
      const waveRadius = a + h * Math.sin(g * u);
      const bulgeFactor = 1 + i * Math.cos(v);
      const pinchFactor = Math.pow(2, -j * Math.sin(v * 2));
      const flareFactor = 1 + k * (a + b * Math.cos(v)) / a;
      const taperFactor = 1 + l * Math.cos(u);

      const mirrorU = m > 0 ? Math.floor(u / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : u;
      const mirrorV = m > 0 ? Math.floor(v / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : v;

      const tubeRadius = b * bulgeFactor * pinchFactor * taperFactor;
      const majorRadius = waveRadius * flareFactor;

      return [
        (majorRadius + tubeRadius * Math.cos(v + twistAngle)) * Math.cos(m > 0 ? mirrorU : u) * e,
        (majorRadius + tubeRadius * Math.cos(v + twistAngle)) * Math.sin(m > 0 ? mirrorU : u) * e,
        tubeRadius * Math.sin(v + twistAngle) * c * f
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.8, c: 1, e: 1, f: 1, uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 64, vSegments: 32 })
  },

  // ============================================================================
  // KNOT THEORY SHAPES - Mathematical Knot Topology
  // Uses robust parallel-transport frame with Gram-Schmidt orthogonalization
  // ============================================================================

  trefoil_knot: {
    name: "🔗 Trefoil Knot (3₁) - T(3,2) Torus Knot",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.4;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      const p = 3, q = 2;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (Math.cos(q * t) + 2);
      const knotX = r * Math.cos(p * t + d);
      const knotY = r * Math.sin(p * t + d);
      const knotZ = c * (-Math.sin(q * t));
      
      const dt = 0.001;
      const r1 = a * (Math.cos(q * (t + dt)) + 2);
      const r2 = a * (Math.cos(q * (t - dt)) + 2);
      const nextX = r1 * Math.cos(p * (t + dt) + d);
      const nextY = r1 * Math.sin(p * (t + dt) + d);
      const nextZ = c * (-Math.sin(q * (t + dt)));
      const prevX = r2 * Math.cos(p * (t - dt) + d);
      const prevY = r2 * Math.sin(p * (t - dt) + d);
      const prevZ = c * (-Math.sin(q * (t - dt)));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(p * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.4, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 })
  },

  cinquefoil_knot: {
    name: "🔗 Cinquefoil Knot (5₁) - T(5,2) Torus Knot",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.3;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      const p = 5, q = 2;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (Math.cos(q * t) + 2);
      const knotX = r * Math.cos(p * t + d);
      const knotY = r * Math.sin(p * t + d);
      const knotZ = c * (-Math.sin(q * t));
      
      const dt = 0.001;
      const r1 = a * (Math.cos(q * (t + dt)) + 2);
      const r2 = a * (Math.cos(q * (t - dt)) + 2);
      const nextX = r1 * Math.cos(p * (t + dt) + d);
      const nextY = r1 * Math.sin(p * (t + dt) + d);
      const nextZ = c * (-Math.sin(q * (t + dt)));
      const prevX = r2 * Math.cos(p * (t - dt) + d);
      const prevY = r2 * Math.sin(p * (t - dt) + d);
      const prevZ = c * (-Math.sin(q * (t - dt)));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(p * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.3, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 160, vSegments: 32 })
  },

  figure_eight_knot: {
    name: "🔗 Figure-Eight Knot (4₁) - Unique Prime Knot",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.35;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const knotX = a * (2 + Math.cos(2 * t + d)) * Math.cos(3 * t);
      const knotY = a * (2 + Math.cos(2 * t + d)) * Math.sin(3 * t);
      const knotZ = c * Math.sin(4 * t);
      
      const dt = 0.001;
      const nextX = a * (2 + Math.cos(2 * (t + dt) + d)) * Math.cos(3 * (t + dt));
      const nextY = a * (2 + Math.cos(2 * (t + dt) + d)) * Math.sin(3 * (t + dt));
      const nextZ = c * Math.sin(4 * (t + dt));
      const prevX = a * (2 + Math.cos(2 * (t - dt) + d)) * Math.cos(3 * (t - dt));
      const prevY = a * (2 + Math.cos(2 * (t - dt) + d)) * Math.sin(3 * (t - dt));
      const prevZ = c * Math.sin(4 * (t - dt));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(4 * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.35, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 })
  },

  torus_knot_general: {
    name: "🔗 General Torus Knot T(p,q)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.35;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      const p = Math.max(2, Math.round(Math.abs(params.g ?? 3)));
      const q = Math.max(1, Math.round(Math.abs(params.h ?? 2)));
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (Math.cos(q * t) + 2);
      const knotX = r * Math.cos(p * t + d);
      const knotY = r * Math.sin(p * t + d);
      const knotZ = c * (-Math.sin(q * t));
      
      const dt = 0.001;
      const r1 = a * (Math.cos(q * (t + dt)) + 2);
      const r2 = a * (Math.cos(q * (t - dt)) + 2);
      const nextX = r1 * Math.cos(p * (t + dt) + d);
      const nextY = r1 * Math.sin(p * (t + dt) + d);
      const nextZ = c * (-Math.sin(q * (t + dt)));
      const prevX = r2 * Math.cos(p * (t - dt) + d);
      const prevY = r2 * Math.sin(p * (t - dt) + d);
      const prevZ = c * (-Math.sin(q * (t - dt)));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(p * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.35, c: 1, g: 3, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 })
  },

  septafoil_knot: {
    name: "🔗 Septafoil Knot (7₁) - T(7,2) Torus Knot",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0.25;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      const p = 7, q = 2;
      
      const t = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (Math.cos(q * t) + 2);
      const knotX = r * Math.cos(p * t + d);
      const knotY = r * Math.sin(p * t + d);
      const knotZ = c * (-Math.sin(q * t));
      
      const dt = 0.001;
      const r1 = a * (Math.cos(q * (t + dt)) + 2);
      const r2 = a * (Math.cos(q * (t - dt)) + 2);
      const nextX = r1 * Math.cos(p * (t + dt) + d);
      const nextY = r1 * Math.sin(p * (t + dt) + d);
      const nextZ = c * (-Math.sin(q * (t + dt)));
      const prevX = r2 * Math.cos(p * (t - dt) + d);
      const prevY = r2 * Math.sin(p * (t - dt) + d);
      const prevZ = c * (-Math.sin(q * (t - dt)));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(p * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.25, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 192, vSegments: 32 })
  },

  granny_knot: {
    name: "🔗 Granny Knot - Composite Knot (3₁#3₁)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const b = params.b ?? 0.25;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0;
      const f = params.f ?? 0;
      
      const t = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const knotX = a * (Math.sin(t) + 2 * Math.sin(2 * t + d));
      const knotY = a * (Math.cos(t) - 2 * Math.cos(2 * t + d));
      const knotZ = c * (-Math.sin(3 * t));
      
      const dt = 0.001;
      const nextX = a * (Math.sin(t + dt) + 2 * Math.sin(2 * (t + dt) + d));
      const nextY = a * (Math.cos(t + dt) - 2 * Math.cos(2 * (t + dt) + d));
      const nextZ = c * (-Math.sin(3 * (t + dt)));
      const prevX = a * (Math.sin(t - dt) + 2 * Math.sin(2 * (t - dt) + d));
      const prevY = a * (Math.cos(t - dt) - 2 * Math.cos(2 * (t - dt) + d));
      const prevZ = c * (-Math.sin(3 * (t - dt)));
      
      let tX = (nextX - prevX) / (2 * dt);
      let tY = (nextY - prevY) / (2 * dt);
      let tZ = (nextZ - prevZ) / (2 * dt);
      const tLen = Math.sqrt(tX * tX + tY * tY + tZ * tZ) || 1;
      tX /= tLen; tY /= tLen; tZ /= tLen;
      
      const eps = 0.001;
      let refX = 0, refY = 1, refZ = 0;
      if (Math.abs(tY) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      else if (Math.abs(tZ) > 0.99) { refX = 1; refY = 0; refZ = 0; }
      
      const dot = refX * tX + refY * tY + refZ * tZ;
      let nX = refX - dot * tX;
      let nY = refY - dot * tY;
      let nZ = refZ - dot * tZ;
      let nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ);
      if (nLen < eps) { nX = 1 - tX * tX; nY = -tX * tY; nZ = -tX * tZ; nLen = Math.sqrt(nX * nX + nY * nY + nZ * nZ) || 1; }
      nX /= nLen; nY /= nLen; nZ /= nLen;
      
      const bX = tY * nZ - tZ * nY;
      const bY = tZ * nX - tX * nZ;
      const bZ = tX * nY - tY * nX;
      
      const tubeR = b * (1 + f * Math.sin(3 * t));
      const twist = e * t;
      const cosP = Math.cos(phi + twist), sinP = Math.sin(phi + twist);
      
      return [
        knotX + tubeR * (cosP * nX + sinP * bX),
        knotY + tubeR * (cosP * nY + sinP * bY),
        knotZ + tubeR * (cosP * nZ + sinP * bZ)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.25, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 160, vSegments: 32 })
  },

  hypersphere: {
    name: "Hypersphere (4D Sphere → 3D)",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 2;
      const b = params.b !== undefined ? params.b : 2;
      const c = params.c !== undefined ? params.c : 2;
      const d = params.d !== undefined ? params.d : 1;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const w = params.w !== undefined ? params.w : 0.3;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const psi = (d * 0.5 + 0.5) * Math.PI;

      const sinPsi = Math.sin(psi);
      const cosPsi = Math.cos(psi);
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      const x1 = sinPsi * sinPhi * cosTheta;
      const x2 = sinPsi * sinPhi * sinTheta;
      const x3 = sinPsi * cosPhi;
      const x4 = cosPsi;

      const denom = Math.max(0.1, 1.5 - x4 * w);

      return [
        a * x1 / denom * e,
        b * x2 / denom * e,
        c * x3 / denom * f
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 2, d: 1, e: 1, f: 1, w: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 })
  },

  hypercube: {
    name: "Hypercube (Tesseract → 3D)",
    description: "Symmetric 4D hypercube with balanced rendering. Uses 8 cubic cells rendered as continuous surface. Parameter G selects projection: 0=Stereographic, 1=Orthographic, 2=Perspective.",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const g = params.g ?? 0;
      
      // Render 8 cubic cells of the tesseract as continuous surfaces
      // Each cell is a 3D cube at one of the 8 coordinate extremes in 4D
      const cellIndex = Math.floor(u * 8) % 8;
      const localU = (u * 8) % 1;
      const localV = v;
      
      // Face coordinates within each cubic cell (6 faces per cell)
      const faceIndex = Math.floor(localU * 6) % 6;
      const faceU = (localU * 6) % 1;
      const faceV = localV;
      
      // Convert face coords to [-1, 1] range
      const fu = faceU * 2 - 1;
      const fv = faceV * 2 - 1;
      
      // 4D point based on cell and face
      let x4 = 0, y4 = 0, z4 = 0, w4 = 0;
      
      // Define cubic cells by which coordinate is fixed at ±1
      const cellCoord = cellIndex < 4 ? -1 : 1;
      const cellAxis = cellIndex % 4;
      
      // Generate face points for each cell
      if (cellAxis === 0) { // w fixed
        w4 = cellCoord;
        if (faceIndex === 0) { x4 = 1; y4 = fu; z4 = fv; }
        else if (faceIndex === 1) { x4 = -1; y4 = fu; z4 = fv; }
        else if (faceIndex === 2) { x4 = fu; y4 = 1; z4 = fv; }
        else if (faceIndex === 3) { x4 = fu; y4 = -1; z4 = fv; }
        else if (faceIndex === 4) { x4 = fu; y4 = fv; z4 = 1; }
        else { x4 = fu; y4 = fv; z4 = -1; }
      } else if (cellAxis === 1) { // x fixed
        x4 = cellCoord;
        if (faceIndex === 0) { w4 = 1; y4 = fu; z4 = fv; }
        else if (faceIndex === 1) { w4 = -1; y4 = fu; z4 = fv; }
        else if (faceIndex === 2) { w4 = fu; y4 = 1; z4 = fv; }
        else if (faceIndex === 3) { w4 = fu; y4 = -1; z4 = fv; }
        else if (faceIndex === 4) { w4 = fu; y4 = fv; z4 = 1; }
        else { w4 = fu; y4 = fv; z4 = -1; }
      } else if (cellAxis === 2) { // y fixed
        y4 = cellCoord;
        if (faceIndex === 0) { x4 = 1; w4 = fu; z4 = fv; }
        else if (faceIndex === 1) { x4 = -1; w4 = fu; z4 = fv; }
        else if (faceIndex === 2) { x4 = fu; w4 = 1; z4 = fv; }
        else if (faceIndex === 3) { x4 = fu; w4 = -1; z4 = fv; }
        else if (faceIndex === 4) { x4 = fu; w4 = fv; z4 = 1; }
        else { x4 = fu; w4 = fv; z4 = -1; }
      } else { // z fixed
        z4 = cellCoord;
        if (faceIndex === 0) { x4 = 1; y4 = fu; w4 = fv; }
        else if (faceIndex === 1) { x4 = -1; y4 = fu; w4 = fv; }
        else if (faceIndex === 2) { x4 = fu; y4 = 1; w4 = fv; }
        else if (faceIndex === 3) { x4 = fu; y4 = -1; w4 = fv; }
        else if (faceIndex === 4) { x4 = fu; y4 = fv; w4 = 1; }
        else { x4 = fu; y4 = fv; w4 = -1; }
      }
      
      // Apply 4D rotation (XW plane rotation for balanced viewing)
      const rotAngle = d * 0.1;
      const cosR = Math.cos(rotAngle);
      const sinR = Math.sin(rotAngle);
      const x4_rot = x4 * cosR - w4 * sinR;
      const w4_rot = x4 * sinR + w4 * cosR;
      
      // Project 4D → 3D using selected method
      let x3 = 0, y3 = 0, z3 = 0;
      const projType = Math.round(g) % 3;
      
      if (projType === 0) {
        // Stereographic projection (preserves angles, best for topology)
        const denom = Math.max(0.3, 2.5 - w4_rot * 0.4);
        x3 = x4_rot / denom;
        y3 = y4 / denom;
        z3 = z4 / denom;
      } else if (projType === 1) {
        // Orthographic projection (preserves parallel lines)
        x3 = x4_rot * 0.8;
        y3 = y4 * 0.8;
        z3 = z4 * 0.8;
      } else {
        // Perspective projection (natural depth perception)
        const perspDist = 4.0;
        const denom = Math.max(0.3, perspDist - w4_rot);
        x3 = x4_rot * perspDist / denom;
        y3 = y4 * perspDist / denom;
        z3 = z4 * perspDist / denom;
      }
      
      return [a * x3, b * y3, c * z3];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 2, d: 0, g: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 192, vSegments: 64 })
  },

  hypersimplex: {
    name: "4D Simplex (5-Cell → 3D)",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 1;
      const b = params.b !== undefined ? params.b : 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const w = params.w ?? 0.5;

      const phi = (1 + Math.sqrt(5)) / 2;
      const vertices4D = [
        [1, 1, 1, -1/Math.sqrt(5)],
        [1, -1, -1, -1/Math.sqrt(5)],
        [-1, 1, -1, -1/Math.sqrt(5)],
        [-1, -1, 1, -1/Math.sqrt(5)],
        [0, 0, 0, Math.sqrt(5) - 1/Math.sqrt(5)]
      ];

      const edges = [
        [0,1],[0,2],[0,3],[0,4],
        [1,2],[1,3],[1,4],
        [2,3],[2,4],
        [3,4]
      ];

      const t = (u * edges.length) % 1;
      const edgeIdx = Math.floor(u * edges.length) % edges.length;
      const edge = edges[edgeIdx];

      const v1 = vertices4D[edge[0]];
      const v2 = vertices4D[edge[1]];

      const x1 = (1-t) * v1[0] + t * v2[0];
      const x2 = (1-t) * v1[1] + t * v2[1];
      const x3 = (1-t) * v1[2] + t * v2[2];
      const x4 = (1-t) * v1[3] + t * v2[3];

      const rotW = d * 0.1;
      const cosW = Math.cos(rotW);
      const sinW = Math.sin(rotW);
      const x4_rot = x4 * cosW - x1 * sinW;
      const x1_rot = x4 * sinW + x1 * cosW;

      const denom = 2.5 - x4_rot * w;
      return [
        a * x1_rot / denom,
        b * x2 / denom,
        c * x3 / denom
      ];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1.5, c: 1.5, e: 1, f: 1, w: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 16 })
  },

  ellipsoid: {
    name: "Ellipsoid",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 2;
      const b = params.b !== undefined ? params.b : 1.5;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g ?? 0; // WAVE FREQ
      const h = params.h ?? 0; // WAVE AMP
      const i = params.i ?? 0; // BULGE
      const j = params.j ?? 0; // PINCH
      const k = params.k ?? 0; // FLARE
      const l = params.l ?? 0; // TAPER
      const m = params.m ?? 0; // MIRROR FOLD

      // Base coordinates
      const baseX = Math.sin(v) * Math.cos(u);
      const baseY = Math.sin(v) * Math.sin(u);
      const baseZ = Math.cos(v);

      // TWIST
      const twistAngle = d * baseZ;
      const cosT = Math.cos(twistAngle);
      const sinT = Math.sin(twistAngle);
      let x = baseX * cosT - baseY * sinT;
      let y = baseX * sinT + baseY * cosT;

      // WAVE
      const waveRadius = Math.sin(v) * (1 + h * Math.sin(g * v));

      // BULGE
      const bulgeFactor = 1 + i * Math.sin(v * Math.PI);

      // PINCH (stable - no singularities)
      const pinchFactor = Math.pow(2, -j * Math.cos(v * 2));

      // FLARE
      const flareFactor = 1 + k * Math.abs(baseZ);

      // TAPER
      const taperFactor = 1 + l * baseZ;

      // MIRROR FOLD
      const mirrorU = m > 0 ? Math.floor(u / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : u;

      const finalRadius = waveRadius * bulgeFactor * pinchFactor * flareFactor * taperFactor;

      return [
        a * finalRadius * (m > 0 ? Math.cos(mirrorU) : x) * e,
        b * finalRadius * (m > 0 ? Math.sin(mirrorU) : y) * e,
        c * baseZ * f
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1.5, c: 1, e: 1, f: 1, uMin: 0, uMax: 6.28318, vMin: 0, vMax: 3.14159, uSegments: 64, vSegments: 32 })
  },

  cone: {
    name: "Cone",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d ?? 0;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g ?? 0; // WAVE FREQ
      const h = params.h ?? 0; // WAVE AMP
      const i = params.i ?? 0; // BULGE
      const j = params.j ?? 0; // PINCH
      const k = params.k ?? 0; // FLARE
      const l = params.l ?? 0; // TAPER
      const m = params.m ?? 0; // MIRROR FOLD

      // TWIST: Rotate based on height
      const twistAngle = d * v;
      const baseX = Math.cos(u + twistAngle);
      const baseY = Math.sin(u + twistAngle);

      // WAVE: Add ripples
      const waveRadius = v * (1 + h * Math.sin(g * v * Math.PI * 2));

      // BULGE: Expand at middle
      const bulgeFactor = 1 + i * v * (1 - v) * 4;

      // PINCH: Contract (stable - no singularities)
      const pinchFactor = Math.pow(2, -j * Math.cos(v * Math.PI * 2));

      // FLARE: Expand at base
      const flareFactor = 1 + k * v;

      // TAPER: Adjust cone angle
      const taperFactor = 1 + l * (1 - v);

      // MIRROR FOLD
      const mirrorU = m > 0 ? Math.floor(u / (Math.PI * 2 / m)) * (Math.PI * 2 / m) + Math.PI / m : u;

      const finalRadius = waveRadius * bulgeFactor * pinchFactor * flareFactor * taperFactor;

      return [
        a * finalRadius * (m > 0 ? Math.cos(mirrorU) : baseX) * e,
        b * finalRadius * (m > 0 ? Math.sin(mirrorU) : baseY) * e,
        (1 - v) * c * f
      ];
    },
    defaultParams: getCleanDefaults({ c: 1, e: 1, f: 1, uMin: 0, uMax: 6.28318, uSegments: 64, vSegments: 32 })
  },

  // ============================================================================
  // NON-EUCLIDEAN GEOMETRY
  // ============================================================================

  pseudosphere: {
    name: "Pseudosphere - Constant Negative Curvature",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 2;
      const b = params.b !== undefined ? params.b : 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d !== undefined ? params.d : 1;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g !== undefined ? params.g : 1;
      const h = params.h !== undefined ? params.h : 1;

      const theta = u * Math.PI * 2 * d;
      const t_param = v * Math.PI * 0.98 + 0.01;
      const cosh_safe = Math.max(1e-6, Math.cosh(t_param)); // Prevent division by zero
      const sech_t = 1 / cosh_safe;
      const radius = a * sech_t * e;
      const z_tractrix = t_param - Math.tanh(t_param);

      const x = radius * Math.cos(theta) * b * f;
      const y = radius * Math.sin(theta) * b * g;
      const z = a * z_tractrix * c * h;

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, uSegments: 96, vSegments: 64 })
  },

  hyperbolic_paraboloid: {
    name: "Hyperbolic Paraboloid - Saddle Surface",
    equation: (u, v, params) => {
      const a = params.a !== undefined ? params.a : 2;
      const b = params.b !== undefined ? params.b : 1;
      const c = params.c !== undefined ? params.c : 1;
      const d = params.d !== undefined ? params.d : 1;
      const e = params.e !== undefined ? params.e : 1;
      const f = params.f !== undefined ? params.f : 1;
      const g = params.g !== undefined ? params.g : 1;
      const h = params.h !== undefined ? params.h : 1;
      const i = params.i !== undefined ? params.i : 1;

      const u_scaled = (u - 0.5) * a * d;
      const v_scaled = (v - 0.5) * a * e;
      const g_safe = Math.max(1e-6, Math.abs(g)); // Prevent division by zero
      const h_safe = Math.max(1e-6, Math.abs(h)); // Prevent division by zero
      const x_term = Math.pow(u_scaled, 2) / (g_safe * g_safe);
      const y_term = Math.pow(v_scaled, 2) / (h_safe * h_safe);

      const x = u_scaled * b * e;
      const y = v_scaled * b * f;
      const z = (x_term - y_term) * c * i;

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // RIEMANN SURFACES
  // ============================================================================

  square_root_riemann: {
    name: "Square Root Riemann Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 0;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const e = params.e ?? 0.1;
      const f = params.f ?? 0.1;
      const g = params.g ?? 1;
      const h = params.h ?? 0.1;
      const i = params.i ?? 1;
      const j = params.j ?? 1;

      const rho = a * u + b;
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI)) % 2;
      const adjustedTheta = theta - 2 * Math.PI * sheet;
      const sqrtRho = Math.sqrt(Math.abs(rho));
      const sqrtTheta = adjustedTheta / 2 + sheet * Math.PI;

      return [
        sqrtRho * Math.cos(sqrtTheta) + e * sheet * 0.1,
        sqrtRho * Math.sin(sqrtTheta) + f * sheet * 0.1,
        g * sheet + h * Math.sin(u * i) * Math.cos(v * j)
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 128 })
  },

  logarithm_riemann: {
    name: "Logarithm Riemann Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 0;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0.01;
      const f = params.f ?? 0.01;
      const g = params.g ?? 0.5;
      const h = params.h ?? 0.1;
      const i = params.i ?? 2;

      // Clamp exponent to prevent overflow
      const exponent = Math.min(100, Math.max(-100, a * u + b));
      const rho = Math.exp(exponent);
      const theta = c * v + d;
      const sheet = Math.floor(theta / (2 * Math.PI));

      const x = rho * Math.cos(theta) + e * 0.01 * sheet;
      const y = rho * Math.sin(theta) + f * 0.01 * sheet;
      const z = g * (theta + 2 * Math.PI * sheet) + h * Math.sin(u * i);

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 192 })
  },

  // Additional cosmic topology shapes to complement shape_of_universe
  cosmic_microwave_background: {
    name: "📡 Cosmic Microwave Background - Temperature Fluctuations",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const temp_variation = params.d ?? 0.1;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // CMB temperature fluctuations (~10^-5 K variations)
      const base_temp = 2.725; // Kelvin
      const fluctuation = temp_variation * (
        Math.sin(theta * 7) * Math.cos(phi * 11) * 0.00001 +
        Math.sin(theta * 13 + time * 0.1) * Math.cos(phi * 17) * 0.00001 +
        Math.sin(theta * 23) * Math.cos(phi * 19 + time * 0.05) * 0.00001
      );
      
      const radius = a + fluctuation * 10000; // Amplify for visibility
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 3, d: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 96 }
  },

  dark_energy_field: {
    name: "🌑 Dark Energy Field - Accelerating Expansion",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const lambda = params.d ?? 0.5; // Cosmological constant
      const expansion_rate = params.e ?? 0.2;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Dark energy density ~70% of universe
      const expansion_factor = 1 + expansion_rate * time * 0.01;
      const dark_energy_density = lambda * (
        1 + 0.1 * Math.sin(theta * 3 + time * 0.1) * Math.cos(phi * 2) +
        0.05 * Math.cos(theta + phi * 2 + time * 0.15)
      );
      
      const radius = a * expansion_factor * (1 + dark_energy_density * 0.1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 4, d: 0.5, e: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 }
  },

  cosmic_consciousness_field: {
    name: "🧠 Cosmic Consciousness Field - Information Processing",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const consciousness_strength = params.o ?? 0.5;
      const info_density = params.p ?? 0.3;
      const coherence = params.q ?? 0.4;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // 26-dimensional consciousness projection (A-Z parameter space)
      const consciousness_field = consciousness_strength * (
        Math.sin(u * 26 * Math.PI + time * 0.1) * Math.cos(v * 26 * Math.PI) +
        Math.sin(theta * 13 + time * 0.2) * Math.cos(phi * 13 + time * 0.15)
      );
      
      const information_density = info_density * (
        Math.sin(theta * 8 + phi * 5) * Math.cos(theta * 3 + phi * 7) +
        Math.sin(time * 0.3) * Math.cos(theta + phi)
      );
      
      const field_coherence = coherence * Math.sin(theta + phi + time * 0.1);
      
      const radius = a + (consciousness_field + information_density + field_coherence) * 0.3;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { 
      a: 3, o: 0.5, p: 0.3, q: 0.4, 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 128, vSegments: 96 
    }
  },

  riemann_zeta_critical_line: {
    name: "📐 Riemann Zeta ζ(s) - Critical Line (Unsolved - Millennium Prize $1M)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;
      const f = params.f ?? 1;
      const g = params.g ?? 0.5; // Critical line Re(s) = 1/2
      const h = params.h ?? 1;
      const i = params.i ?? 5;

      // Critical line: Re(s) = 1/2, Im(s) = t
      const realPart = g; // Fixed at 1/2 for critical line
      const imagPart = i * (u - 0.5); // t varies along u

      // Simplified zeta function visualization using partial sums
      let zetaReal = 0;
      let zetaImag = 0;
      const numTerms = Math.floor(20 + e * 10); // Control number of terms with parameter

      for (let n = 1; n <= numTerms; n++) {
        const nPowerS = Math.pow(n, -realPart);
        const angle = -imagPart * Math.log(n);
        zetaReal += nPowerS * Math.cos(angle);
        zetaImag += nPowerS * Math.sin(angle);
      }

      // Position along critical line
      const x = a * realPart + d * Math.sin(h * v * Math.PI);
      const y = b * imagPart / 5; // Scale down for visibility
      const z = c * (zetaReal * Math.cos(f * v * Math.PI) + zetaImag * Math.sin(f * v * Math.PI));

      // Safety check
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64, g: 0.5, i: 50 })
  },

  riemann_zeta_function: {
    name: "🔢 Riemann Zeta Function ζ(s) = Σ(1/n^s) (Hypothesis Unsolved)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 3;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const e = params.e ?? 1;
      const f = params.f ?? 0;
      const g = params.g ?? 20; // Number of terms in series
      const h = params.h ?? 1;

      // Map (u,v) to complex plane: s = σ + it
      const sigma = e * (u * 4 - 2); // Real part: -2 to 2
      const t = f + h * (v * 10 - 5); // Imaginary part: -5 to 5

      // Compute ζ(s) using partial sum
      let zetaReal = 0;
      let zetaImag = 0;
      const numTerms = Math.floor(Math.max(10, g));

      if (sigma > 0) {
        for (let n = 1; n <= numTerms; n++) {
          const nPowerMinusSigma = Math.pow(n, -sigma);
          const angle = -t * Math.log(n);
          zetaReal += nPowerMinusSigma * Math.cos(angle);
          zetaImag += nPowerMinusSigma * Math.sin(angle);
        }
      }

      const magnitude = Math.sqrt(zetaReal * zetaReal + zetaImag * zetaImag);
      const phase = Math.atan2(zetaImag, zetaReal);

      const x = a * sigma;
      const y = b * t / 5;
      const z = c * Math.min(5, magnitude) * Math.cos(phase + d);

      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 96, g: 30 })
  },

  euler_product_formula: {
    name: "🔬 Euler Product ζ(s) = Π(1/(1-p^(-s))) - Prime Connection",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 2.5;
      const c = params.c ?? 1.5;
      const d = params.d ?? 0;
      const e = params.e ?? 1;
      const f = params.f ?? 1;
      const g = params.g ?? 0; 
      const h = params.h ?? 1;

      // Primes for Euler product
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];

      const sigma = e * (u * 4 - 1); // Real part: -1 to 3
      const t = f * (v * 8 - 4); // Imaginary part: -4 to 4

      let productReal = 1;
      let productImag = 0;

      if (sigma > 1) { // Euler product converges for Re(s) > 1
        for (let i = 0; i < Math.min(10, primes.length); i++) {
          const p = primes[i];
          const pPowerMinusS = Math.pow(p, -sigma);
          const angle = -t * Math.log(p);

          const denominatorReal = 1 - pPowerMinusS * Math.cos(angle);
          const denominatorImag = pPowerMinusS * Math.sin(angle);
          const denomMagSq = denominatorReal * denominatorReal + denominatorImag * denominatorImag;

          if (denomMagSq > 1e-10) {
            const newReal = (productReal * denominatorReal + productImag * denominatorImag) / denomMagSq;
            const newImag = (productImag * denominatorReal - productReal * denominatorImag) / denomMagSq;
            productReal = newReal;
            productImag = newImag;
          }
        }
      }

      const magnitude = Math.sqrt(productReal * productReal + productImag * productImag);

      const x = a * sigma + g * Math.sin(h * v * Math.PI * 2) * 0.1;
      const y = b * t / 4;
      const z = c * Math.min(3, magnitude) + d * Math.cos(h * u * Math.PI * 2) * 0.1;

      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 96 })
  },

  riemann_integral: {
    name: "∫ Riemann Integral - Limit of Riemann Sums",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 2;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const e = params.e ?? 1;
      const f = params.f ?? 1;
      const g = params.g ?? 1;
      const h = params.h ?? 1;

      // Visualize Riemann sum rectangles
      const x_coord = a * (u - 0.5);
      const numPartitions = Math.floor(10 + e * 10); // Number of partitions
      const partitionIndex = Math.floor(u * numPartitions);
      const partitionWidth = 1 / numPartitions;
      const samplePoint = (partitionIndex + 0.5) / numPartitions;

      // Function to integrate: f(x) = sin(πx) + 1
      const funcValue = f * (Math.sin(g * samplePoint * Math.PI * 2) + h);

      // Create stepped visualization (Riemann rectangles)
      const localU = (u * numPartitions) % 1;
      const isInRectangle = v < (funcValue / 3); // Normalize height

      const y_coord = b * (v - 0.5);
      const z_coord = c * (isInRectangle ? funcValue : 0) + d * Math.sin(u * Math.PI * 4) * 0.1;

      return [x_coord, y_coord, z_coord];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 64, e: 2 })
  },

  // ============================================================================
  // ADVANCED QUANTUM ORBITALS - Higher Energy States
  // ============================================================================

  hydrogen_orbital_4f: {
    name: "⚛️ Hydrogen 4f Orbital - Complex Angular Nodes",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const n = 4, l = 3, m = 0;

      const r = a * (n * n) / 4;
      const angularPart = Math.pow(Math.sin(theta), l) * Math.cos(m * phi);
      const radialModulation = Math.exp(-r / (2 * n)) * Math.pow(r / n, l);
      const probDensity = e * radialModulation * Math.abs(angularPart);

      const x = probDensity * Math.sin(theta) * Math.cos(phi);
      const y = probDensity * Math.sin(theta) * Math.sin(phi);
      const z = probDensity * Math.cos(theta) + d;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, a: 2, e: 3 })
  },

  hydrogen_orbital_5d: {
    name: "⚛️ Hydrogen 5d Orbital - Extended Electron Cloud",
    equation: (u, v, params) => {
      const a = params.a ?? 3.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const n = 5, l = 2, m = 0;

      const r = a * (n * n) / 5;
      const angularPart = Math.pow(Math.sin(theta), l) * Math.cos(m * phi);
      const radialModulation = Math.exp(-r / (2 * n)) * Math.pow(r / n, l);
      const probDensity = e * radialModulation * Math.abs(angularPart);

      const x = probDensity * Math.sin(theta) * Math.cos(phi);
      const y = probDensity * Math.sin(theta) * Math.sin(phi);
      const z = probDensity * Math.cos(theta) + d;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, a: 2.5, e: 2.5 })
  },

  hydrogen_orbital_6s: {
    name: "⚛️ Hydrogen 6s Orbital - Spherical Radial Nodes",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const n = 6, l = 0;

      const r = a * Math.abs(Math.sin(theta * n));
      const radialModulation = Math.exp(-r / (2 * n)) * (1 - r / n + Math.pow(r / n, 2) / 2);
      const probDensity = e * Math.abs(radialModulation);

      const x = probDensity * Math.sin(theta) * Math.cos(phi);
      const y = probDensity * Math.sin(theta) * Math.sin(phi);
      const z = probDensity * Math.cos(theta) + d;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, a: 3, e: 2 })
  },

  quantum_tunneling_barrier: {
    name: "🌀 Quantum Tunneling - Probability Cloud Through Barrier",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 1.5;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;
      const f = params.f ?? 0.5;

      const x = a * (u - 0.5);
      const barrierWidth = 0.3;
      const barrierCenter = 0;

      // Tunneling probability decreases exponentially inside barrier
      const inBarrier = Math.abs(x) < barrierWidth;
      const tunnelProb = inBarrier ? Math.exp(-e * Math.abs(x)) : 1;

      const theta = v * 2 * Math.PI;
      const waveAmp = f * tunnelProb;

      const y = b * waveAmp * Math.cos(theta);
      const z = c * waveAmp * Math.sin(theta) + d;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32, a: 3, e: 3 })
  },

  electron_spin_up: {
    name: "↑ Electron Spin Up - Magnetic Moment",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Spin-up representation with upward-pointing lobes
      const spinModulation = Math.cos(theta / 2);
      const r = a * Math.abs(spinModulation) * e;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = c * (r * Math.cos(theta) + 0.5) + d;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48, c: 1.5 })
  },

  electron_spin_down: {
    name: "↓ Electron Spin Down - Opposite Magnetic Moment",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 2;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Spin-down representation with downward-pointing lobes
      const spinModulation = Math.sin(theta / 2);
      const r = a * Math.abs(spinModulation) * e;

      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = c * (r * Math.cos(theta) - 0.5) + d;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48, c: 1.5 })
  },

  harmonic_oscillator_n2: {
    name: "🎵 Quantum Harmonic Oscillator n=2 - Second Excited State",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const x_pos = a * (u - 0.5);
      const n = 2;
      const hermite_n2 = 4 * x_pos * x_pos - 2;
      const waveFunc = hermite_n2 * Math.exp(-x_pos * x_pos / 2);

      const theta = v * 2 * Math.PI;
      const amp = e * Math.abs(waveFunc) / 3;

      const y = b * amp * Math.cos(theta);
      const z = c * amp * Math.sin(theta) + d;

      return [x_pos, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32, a: 2.5 })
  },

  harmonic_oscillator_n3: {
    name: "🎵 Quantum Harmonic Oscillator n=3 - Third Excited State",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const x_pos = a * (u - 0.5);
      const n = 3;
      const hermite_n3 = 8 * Math.pow(x_pos, 3) - 12 * x_pos;
      const waveFunc = hermite_n3 * Math.exp(-x_pos * x_pos / 2);

      const theta = v * 2 * Math.PI;
      const amp = e * Math.abs(waveFunc) / 4;

      const y = b * amp * Math.cos(theta);
      const z = c * amp * Math.sin(theta) + d;

      return [x_pos, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32, a: 2.5 })
  },

  particle_box_n2: {
    name: "📦 Particle in Box n=2 - First Excited Standing Wave",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 1.5;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const x = a * (u - 0.5);
      const n = 2;
      const waveFunc = e * Math.sin(n * Math.PI * u);

      const theta = v * 2 * Math.PI;
      const y = b * Math.abs(waveFunc) * Math.cos(theta);
      const z = c * Math.abs(waveFunc) * Math.sin(theta) + d;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32 })
  },

  particle_box_n3: {
    name: "📦 Particle in Box n=3 - Second Excited Standing Wave",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 1.5;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const x = a * (u - 0.5);
      const n = 3;
      const waveFunc = e * Math.sin(n * Math.PI * u);

      const theta = v * 2 * Math.PI;
      const y = b * Math.abs(waveFunc) * Math.cos(theta);
      const z = c * Math.abs(waveFunc) * Math.sin(theta) + d;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32 })
  },

  // ============================================================================
  // ADVANCED BIOLOGY - Molecular Structures
  // ============================================================================

  actin_filament: {
    name: "🧬 Actin Filament - Cytoskeleton Fiber",
    equation: (u, v, params) => {
      const a = params.a ?? 4;
      const b = params.b ?? 0.3;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 13;

      const t = u * a;
      const theta = v * 2 * Math.PI;
      const helixAngle = e * u * 2 * Math.PI;

      // Double helix structure of F-actin
      const r = b * (1 + 0.1 * Math.sin(helixAngle));
      const x = t + d;
      const y = c * r * Math.cos(theta + helixAngle);
      const z = c * r * Math.sin(theta + helixAngle);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 24, a: 5 })
  },

  microtubule: {
    name: "🔬 Microtubule - Hollow Cylindrical Protein",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 13;

      const height = a * (u - 0.5);
      const theta = v * 2 * Math.PI;
      const protofilamentAngle = Math.floor(v * e) * (2 * Math.PI / e);

      const r = b;
      const x = r * Math.cos(theta) + 0.05 * Math.cos(protofilamentAngle);
      const y = r * Math.sin(theta) + 0.05 * Math.sin(protofilamentAngle);
      const z = c * height + d;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 64, b: 1.2 })
  },

  collagen_triple_helix: {
    name: "🌀 Collagen Triple Helix - Structural Protein",
    equation: (u, v, params) => {
      const a = params.a ?? 6;
      const b = params.b ?? 0.4;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 3;

      const t = u * a;
      const helixNum = Math.floor(v * 3);
      const helixOffset = helixNum * (2 * Math.PI / 3);
      const helixAngle = e * u * 2 * Math.PI + helixOffset;

      const r = b;
      const x = t + d;
      const y = c * r * Math.cos(helixAngle);
      const z = c * r * Math.sin(helixAngle);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 96, a: 7 })
  },

  hemoglobin_quaternary: {
    name: "🔴 Hemoglobin - Quaternary Protein Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 4;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Four subunits arranged in tetrahedral geometry
      const subunitNum = Math.floor(v * 4);
      const offsets = [
        [1, 1, 1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1]
      ];
      const offset = offsets[subunitNum] || [0, 0, 0];

      const r = a * (0.8 + 0.2 * Math.sin(e * phi));
      const x = r * Math.sin(theta) * Math.cos(phi) + offset[0] * 0.5 + d;
      const y = r * Math.sin(theta) * Math.sin(phi) + offset[1] * 0.5;
      const z = r * Math.cos(theta) + offset[2] * 0.5;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 64, a: 1.5 })
  },

  antibody_y_structure: {
    name: "🛡️ Antibody Y-Structure - Immunoglobulin",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const branch = Math.floor(v * 3);
      const t = u * a;
      const theta = (u * 2 - 1) * Math.PI / 6;

      let x, y, z;
      if (branch === 0) {
        // Stem
        x = d;
        y = 0;
        z = -c * t;
      } else {
        // Two arms
        const armAngle = (branch - 1.5) * Math.PI / 3;
        x = e * t * Math.sin(armAngle) + d;
        y = b * 0.2 * Math.sin(u * Math.PI * 4);
        z = c * t * Math.cos(armAngle);
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 96, a: 2.5 })
  },

  myosin_motor_protein: {
    name: "💪 Myosin Motor Protein - Molecular Motor",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 0.5;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const t = u * a;
      const theta = v * 2 * Math.PI;

      // Head domain
      const headSize = u < 0.3 ? e * (1 + u) : e;
      const r = b * headSize;

      const x = t + d;
      const y = c * r * Math.cos(theta);
      const z = c * r * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 32, a: 4 })
  },

  keratin_fiber: {
    name: "🧵 Keratin Fiber - Hair & Nail Protein",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const b = params.b ?? 0.25;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 7;

      const t = u * a;
      const theta = v * 2 * Math.PI;
      const coilAngle = e * u * 2 * Math.PI;

      const r = b * (1 + 0.15 * Math.cos(coilAngle * 3));
      const x = t + 0.1 * Math.sin(coilAngle) + d;
      const y = c * r * Math.cos(theta);
      const z = c * r * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 24, a: 6 })
  },

  elastin_network: {
    name: "🕸️ Elastin Network - Elastic Fiber Matrix",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;

      const x = a * (u - 0.5);
      const y = a * (v - 0.5);
      const wave = e * 0.3;
      const z = c * (wave * Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 4) +
                      wave * Math.sin(u * Math.PI * 6) * Math.sin(v * Math.PI * 6)) + d;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, a: 2.5 })
  },

  // ============================================================================
  // CRYSTALLOGRAPHY - Lattice Structures
  // ============================================================================

  diamond_cubic_lattice: {
    name: "💎 Diamond Cubic Lattice - Carbon Crystal Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;

      const cellX = Math.floor(u * e);
      const cellY = Math.floor(v * e);
      const localU = (u * e) % 1;
      const localV = (v * e) % 1;

      // FCC lattice with tetrahedral bonding
      const positions = [
        [0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5],
        [0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
      ];

      const atomIndex = Math.floor(localU * 8);
      const pos = positions[atomIndex] || [0, 0, 0];

      const x = a * (cellX + pos[0]) + d;
      const y = a * (cellY + pos[1]);
      const z = c * a * (pos[2] + localV * 0.1);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, e: 3 })
  },

  hexagonal_close_packed: {
    name: "⬡ Hexagonal Close-Packed (HCP) - Metal Crystal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1.633;
      const d = params.d ?? 0;
      const e = params.e ?? 3;

      const layer = Math.floor(u * e);
      const theta = v * 2 * Math.PI;
      const ringNum = Math.floor(v * 6);

      const r = a * (0.5 + ringNum * 0.3);
      const hexAngle = theta + (layer % 2) * Math.PI / 6;

      const x = r * Math.cos(hexAngle) + d;
      const y = r * Math.sin(hexAngle);
      const z = c * a * (u - 0.5);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 64, e: 4 })
  },

  body_centered_cubic: {
    name: "🔷 Body-Centered Cubic (BCC) - Iron Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;

      const cellX = Math.floor(u * e);
      const cellY = Math.floor(v * e);
      const localU = (u * e) % 1;
      const localV = (v * e) % 1;

      // Corner atom or body-center atom
      const isCenterAtom = localU > 0.4 && localU < 0.6 && localV > 0.4 && localV < 0.6;
      const pos = isCenterAtom ? [0.5, 0.5, 0.5] : [localU, localV, 0];

      const x = a * (cellX + pos[0]) + d;
      const y = a * (cellY + pos[1]);
      const z = c * a * pos[2];

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, e: 3 })
  },

  simple_cubic_lattice: {
    name: "📦 Simple Cubic Lattice - Basic Crystal Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 3;

      const cellX = Math.floor(u * e);
      const cellY = Math.floor(v * e);
      const cellZ = Math.floor((u + v) * e / 2) % e;

      const x = a * cellX + d;
      const y = a * cellY;
      const z = c * a * cellZ;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 48, e: 4 })
  },

  wurtzite_structure: {
    name: "⬢ Wurtzite Structure - ZnO Crystal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1.633;
      const d = params.d ?? 0;
      const e = params.e ?? 3;

      const layer = Math.floor(u * e);
      const theta = v * 2 * Math.PI;
      const hexIndex = Math.floor(v * 6);

      const hexAngle = hexIndex * Math.PI / 3 + theta;
      const r = a * (0.5 + (hexIndex % 2) * 0.2);

      const x = r * Math.cos(hexAngle) + d;
      const y = r * Math.sin(hexAngle);
      const z = c * a * (layer / e + (hexIndex % 2) * 0.375);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 64, e: 4 })
  },

  rock_salt_structure: {
    name: "🧂 Rock Salt (NaCl) Structure - Ionic Crystal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;

      const cellX = Math.floor(u * e);
      const cellY = Math.floor(v * e);
      const localU = (u * e) % 1;
      const localV = (v * e) % 1;

      // Alternating Na and Cl positions
      const isNa = (Math.floor(localU * 2) + Math.floor(localV * 2)) % 2 === 0;
      const atomSize = isNa ? 0.95 : 1.05;

      const x = a * (cellX + localU) * atomSize + d;
      const y = a * (cellY + localV) * atomSize;
      const z = c * a * (localU + localV) / 4;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, e: 3 })
  },

  perovskite_structure: {
    name: "⚡ Perovskite Structure - Solar Cell Crystal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 2;

      const cellX = Math.floor(u * e);
      const cellY = Math.floor(v * e);
      const localU = (u * e) % 1;
      const localV = (v * e) % 1;

      // ABO3 structure: A at corners, B at center, O at faces
      const positions = [
        [0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0],
        [0.5, 0.5, 0.5], [0.5, 0, 0.5], [0, 0.5, 0.5]
      ];

      const atomIndex = Math.floor(localU * 7);
      const pos = positions[atomIndex] || [0, 0, 0];

      const x = a * (cellX + pos[0]) + d;
      const y = a * (cellY + pos[1]);
      const z = c * a * (pos[2] + localV * 0.2);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, e: 2 })
  },

  penrose_tiling_3d: {
    name: "🔶 Penrose Tiling 3D - Aperiodic Quasicrystal",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 5;

      const phi = (1 + Math.sqrt(5)) / 2;
      const angle = v * 2 * Math.PI;
      const pentAngle = Math.floor(v * 5) * (2 * Math.PI / 5);

      const r = a * (1 + 0.2 * Math.cos(e * angle));
      const x = r * Math.cos(pentAngle + angle / phi) + d;
      const y = r * Math.sin(pentAngle + angle / phi);
      const z = c * a * Math.sin(u * Math.PI * phi);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80, e: 5 })
  },

  icosahedral_quasicrystal: {
    name: "⭐ Icosahedral Quasicrystal - 5-Fold Symmetry",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const phi = (1 + Math.sqrt(5)) / 2;
      const theta = u * Math.PI;
      const angle = v * 2 * Math.PI;
      const layer = Math.floor(v * 12);
      const icoAngle = layer * Math.PI / 6;

      const r = a * e * (1 + 0.1 * Math.sin(5 * angle));
      const x = r * Math.sin(theta) * Math.cos(angle + icoAngle) + d;
      const y = r * Math.sin(theta) * Math.sin(angle + icoAngle);
      const z = c * r * Math.cos(theta) * phi;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 96, a: 2 })
  },

  octahedral_quasicrystal: {
    name: "🔸 Octahedral Quasicrystal - 8-Fold Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const theta = u * Math.PI;
      const angle = v * 2 * Math.PI;
      const octAngle = Math.floor(v * 8) * (Math.PI / 4);

      const r = a * e * (1 + 0.15 * Math.cos(8 * angle));
      const x = r * Math.sin(theta) * Math.cos(angle + octAngle) + d;
      const y = r * Math.sin(theta) * Math.sin(angle + octAngle);
      const z = c * r * Math.cos(theta);

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 96, a: 2 })
  },

  dodecahedral_quasicrystal: {
    name: "⬟ Dodecahedral Quasicrystal - 12-Fold Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 1;

      const phi = (1 + Math.sqrt(5)) / 2;
      const theta = u * Math.PI;
      const angle = v * 2 * Math.PI;
      const dodecaAngle = Math.floor(v * 12) * (Math.PI / 6);

      const r = a * e * (1 + 0.12 * Math.sin(12 * angle));
      const x = r * Math.sin(theta) * Math.cos(angle + dodecaAngle) + d;
      const y = r * Math.sin(theta) * Math.sin(angle + dodecaAngle);
      const z = c * r * Math.cos(theta) / phi;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 96, a: 2 })
  },

  amorphous_glass_network: {
    name: "🌫️ Amorphous Glass Network - Disordered Silica",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0;
      const e = params.e ?? 0.5;

      const x = a * (u - 0.5);
      const y = a * (v - 0.5);

      // Pseudo-random disorder using sin/cos combinations
      const disorder = e * (Math.sin(u * 13.7 + v * 17.3) + Math.cos(u * 23.1 - v * 19.7));
      const z = c * disorder + d;

      return [x * b, y * b, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64, e: 0.8 })
  },

  // ============================================================================
  // TEST SHAPE - Demonstrates g-m parameters working in equations
  // ============================================================================

  test_g_to_m_wave: {
    name: "🧪 Test: g-m Parameters Wave",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      const x = a * (u - 0.5);
      const y = a * (v - 0.5);
      const z = h * Math.sin((u * Math.PI * 4) + g) +
                h * Math.cos((v * Math.PI * 4)) +
                i * u * Math.sin(v * Math.PI * 2) +
                j * (u - 0.5) * (v - 0.5) +
                k * Math.sin(u * v * Math.PI * 4) +
                (l * (1 - u)) * Math.sin(v * Math.PI * 2) +
                m;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // THE 300 COLLECTION - Final 8 Legendary Mathematical Surfaces
  // ============================================================================

  breather_surface: {
    name: "🌊 Breather Surface - Dynamic Soliton",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = Math.max(-0.99, Math.min(0.99, params.g ?? 0.4)); // Clamp to prevent NaN
      const h = params.h ?? 1;

      const w = Math.sqrt(1 - g * g);
      const denom = Math.max(1e-6, a * (Math.pow(w * Math.cosh(g * u), 2) + Math.pow(g * Math.sin(w * v), 2))); // Prevent division by zero

      const x = h * (-u + (2 * w * Math.cosh(g * u) * Math.sinh(g * u)) / denom);
      const y = h * (2 * w * Math.cosh(g * u) * (-(w * Math.cos(v) * Math.cos(w * v)) - Math.sin(v) * Math.sin(w * v)) / denom);
      const z = h * (2 * w * Math.cosh(g * u) * (-(w * Math.sin(v) * Math.cos(w * v)) + Math.cos(v) * Math.sin(w * v)) / denom);

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: -6.28, uMax: 6.28, vMin: -6.28, vMax: 6.28, uSegments: 96, vSegments: 96 })
  },

  richmond_surface: {
    name: "💎 Richmond Minimal Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const x = a * h * (Math.cos(u) * Math.cos(v) / 2 - Math.cos(3 * u) * Math.cos(3 * v) / 6 + g);
      const y = a * h * (Math.sin(u) * Math.cos(v) / 2 - Math.sin(3 * u) * Math.cos(3 * v) / 6);
      const z = a * h * Math.sin(v) * (Math.cos(2 * u) + 1) / 2;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: -3.14159, uMax: 3.14159, vMin: -3.14159, vMax: 3.14159, uSegments: 64, vSegments: 64 })
  },

  bour_minimal_surface: {
    name: "🎭 Bour's Minimal Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const x = a * h * (u * Math.cos(v) - u * u * Math.cos(2 * v) / 2 + g);
      const y = a * h * (-u * Math.sin(v) - u * u * Math.sin(2 * v) / 2);
      const z = a * h * (4 * u * u * Math.cos(v) / 3);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 2, vMin: 0, vMax: 6.28318, uSegments: 64, vSegments: 64 })
  },

  scherk_first_surface: {
    name: "🏛️ Scherk's First Minimal Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const x = a * u;
      const y = a * v;

      // Prevent division by zero and log of negative/zero values
      const numerator = Math.abs(Math.cos(v + g));
      const denominator = Math.max(1e-10, Math.abs(Math.cos(u)));
      const logArg = Math.max(1e-10, numerator / denominator);
      const z = a * h * Math.log(logArg);

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: -1.5, uMax: 1.5, vMin: -1.5, vMax: 1.5, uSegments: 64, vSegments: 64 })
  },

  costa_minimal_surface: {
    name: "⚡ Costa's Minimal Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const phi = u;
      const theta = v;

      const x = a * h * (Math.cos(phi) * Math.cos(theta) / 2 - Math.cos(3 * phi) * Math.cos(3 * theta) / 6 + g);
      const y = a * h * (Math.cos(phi) * Math.sin(theta) / 2 - Math.cos(3 * phi) * Math.sin(3 * theta) / 6);
      const z = a * h * Math.sin(phi) - Math.sin(3 * phi) / 3;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 3.14159, vMin: 0, vMax: 6.28318, uSegments: 80, vSegments: 80 })
  },

  henneberg_minimal_surface: {
    name: "🌟 Henneberg Minimal Surface",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const x = a * h * (2 * Math.sinh(u) * Math.cos(v) - (2/3) * Math.sinh(3 * u) * Math.cos(3 * v) + g);
      const y = a * h * (2 * Math.sinh(u) * Math.sin(v) + (2/3) * Math.sinh(3 * u) * Math.sin(3 * v));
      const z = a * h * (2 * Math.cosh(2 * u) * Math.cos(2 * v));

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: -1, uMax: 1, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  jeener_klein_bottle: {
    name: "🍾 Jeener's Klein Bottle Variant",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0.5;

      const r = a * (1 + Math.cos(v + g) * i);
      const x = r * Math.cos(u);
      const y = r * Math.sin(u);
      const z = h * Math.sin(v) * (1 + Math.cos(u) * i);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 64, vSegments: 64 })
  },

  figure8_klein_bottle: {
    name: "🍾 Figure-8 Klein Bottle Immersion",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 2;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const halfU = (u + g) / 2;
      const cosHalfU = Math.cos(halfU);
      const sinHalfU = Math.sin(halfU);
      const sinV = Math.sin(v);
      const sin2V = Math.sin(2 * v);

      const x = h * (cosHalfU * sinV - sinHalfU * sin2V + d * Math.cos(u + g));
      const y = h * (cosHalfU * sinV - sinHalfU * sin2V + d * Math.sin(u + g));
      const z = h * (sinHalfU * sinV + cosHalfU * sin2V);

      return [x * a * b, y * a * b, z * a * c];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // UNIVERSAL MORPHING ENGINE - A/B/C Control Manifold System
  // Transforms static shapes into programmable multi-dimensional forms
  // A/B/C = Control uniforms (like GPU shaders), u/v = surface coordinates
  // ============================================================================

  universal_morph_base: {
    name: "🌀 Universal Morph - Base Shape",
    equation: (u, v, params) => {
      const A = params.a ?? 1.202;
      const B = params.b ?? 1.618;
      const C = params.c ?? 1.256;
      const t = (u + v) / 2;

      const x = (Math.sin(u * A) + Math.cos(v * B)) * C;
      const y = (Math.cos(u * B) - Math.sin(v * A)) * C;
      const z = (Math.sin(t * A) + Math.cos(t * B)) * C;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_warp: {
    name: "🌊 Universal Morph - Warp Phase",
    equation: (u, v, params) => {
      const A = (params.a ?? 1.202) * 1.1;
      const B = (params.b ?? 1.618) * 0.9;
      const C = (params.c ?? 1.256) * 1.02;
      const uW = u * 1.2;
      const vW = v * 0.8;
      const t = ((u + v) / 2) * 1.05;

      const x = (Math.sin(uW * A) + Math.cos(vW * B)) * C;
      const y = (Math.cos(uW * B) - Math.sin(vW * A)) * C;
      const z = (Math.sin(t * A) + Math.cos(t * B)) * C;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_phase: {
    name: "✨ Universal Morph - Phase Shift",
    equation: (u, v, params) => {
      const baseA = params.a ?? 1.202;
      const baseB = params.b ?? 1.618;
      const baseC = params.c ?? 1.256;
      const t = (u + v) / 2;

      const A = baseA + Math.sin(t);
      const B = baseB + Math.cos(t);
      const C = baseC + Math.sin(u * v);

      const x = (Math.sin(u * A) + Math.cos(v * B)) * C;
      const y = (Math.cos(u * B) - Math.sin(v * A)) * C;
      const z = (Math.sin(t * A) + Math.cos(t * B)) * C;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_golden: {
    name: "🌟 Universal Morph - Golden Ratio",
    equation: (u, v, params) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const A = (params.a ?? 1) * phi;
      const B = (params.b ?? 1) * (phi - 1);
      const C = params.c ?? 1.256;
      const d = params.d ?? 0;
      const t = (u + v) / 2 + d;

      const x = (Math.sin(u * A) + Math.cos(v * B)) * C;
      const y = (Math.cos(u * B) - Math.sin(v * A)) * C;
      const z = (Math.sin(t * A) + Math.cos(t * B)) * C * phi;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_hyperbolic: {
    name: "🕳️ Universal Morph - Hyperbolic",
    equation: (u, v, params) => {
      const A = params.a ?? 1.202;
      const B = params.b ?? 1.618;
      const C = params.c ?? 1.256;
      const d = params.d ?? 0.5;
      const t = (u + v) / 2;

      const sinhU = Math.sinh(u * d - Math.PI * d);
      const coshV = Math.cosh(v * d - Math.PI * d);

      const x = (sinhU * A + Math.cos(v * B)) * C;
      const y = (coshV * B - Math.sin(u * A)) * C;
      const z = (Math.sin(t * A) * Math.tanh(t * d) + Math.cos(t * B)) * C;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_lattice: {
    name: "🔷 Universal Morph - Lattice Harmonics",
    equation: (u, v, params) => {
      const A = params.a ?? 1.202;
      const B = params.b ?? 1.618;
      const C = params.c ?? 1.256;
      const d = params.d ?? 3;
      const e = params.e ?? 2;
      const t = (u + v) / 2;

      const latticeX = Math.sin(u * A * d) + Math.cos(v * B * e);
      const latticeY = Math.cos(u * B * e) - Math.sin(v * A * d);
      const latticeZ = Math.sin(t * A * d) * Math.cos(t * B * e);

      const x = latticeX * C;
      const y = latticeY * C;
      const z = latticeZ * C * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 128, vSegments: 128 })
  },

  universal_morph_4d_projection: {
    name: "🔮 Universal Morph - 4D Projection",
    equation: (u, v, params) => {
      const A = params.a ?? 1.202;
      const B = params.b ?? 1.618;
      const C = params.c ?? 1.256;
      const d = params.d ?? 1;
      const t = (u + v) / 2;

      const w = Math.sin(u * A) * Math.cos(v * B) * d;
      const projectionFactor = 1 / (2 - w * 0.3);

      const x4 = (Math.sin(u * A) + Math.cos(v * B)) * C;
      const y4 = (Math.cos(u * B) - Math.sin(v * A)) * C;
      const z4 = (Math.sin(t * A) + Math.cos(t * B)) * C;

      const x = x4 * projectionFactor;
      const y = y4 * projectionFactor;
      const z = z4 * projectionFactor;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  universal_morph_portal: {
    name: "🌀 Universal Morph - Portal Dynamics",
    equation: (u, v, params) => {
      const A = params.a ?? 1.202;
      const B = params.b ?? 1.618;
      const C = params.c ?? 1.256;
      const d = params.d ?? 1;
      const e = params.e ?? 0.5;
      const t = (u + v) / 2;

      const portalRadius = 1 + e * Math.sin(t * A * 3);
      const twist = t * B * d;

      const x = portalRadius * (Math.sin(u * A) + Math.cos(v * B)) * C * Math.cos(twist);
      const y = portalRadius * (Math.cos(u * B) - Math.sin(v * A)) * C * Math.sin(twist);
      const z = (Math.sin(t * A) + Math.cos(t * B)) * C * portalRadius;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uMin: 0, uMax: 6.28318, vMin: 0, vMax: 6.28318, uSegments: 96, vSegments: 96 })
  },

  spartan_shield_300: {
    name: "⚔️ Spartan Shield 300 - THIS IS SPARTA!",
    equation: (u, v, params) => {
      const a = params.a ?? 3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0.3;
      const i = params.i ?? 0;

      // Circular shield with battle worn texture
      const theta = u * 2 * Math.PI;
      const r = v * a;

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * (Math.cos(8 * theta) * Math.sin(r) + 
                     Math.sin(6 * theta + g) * (1 - v) +
                     i * Math.cos(r * 4));

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 32 })
  },

  catalan_minimal_surface: {
    name: "🏺 Catalan's Minimal Surface - The 300th",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;

      const x = a * (u - Math.sin(u) * Math.cosh(v));
      const y = a * h * (1 - Math.cos(u) * Math.cosh(v + g));
      const z = a * h * (4 * Math.sin(u / 2) * Math.sinh(v / 2));

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uMin: -3.14159, uMax: 3.14159, vMin: -1, vMax: 1, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // BEYOND 300 - Advanced Mathematical Structures from Research
  // ============================================================================

  penrose_tiling_projection: {
    name: "🔷 Penrose Quasicrystal Tiling - 5D Projection",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0.3;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // Projection from 5D to 2D using golden ratio
      const phi = (1 + Math.sqrt(5)) / 2;
      const theta1 = u * 2 * Math.PI + i * u;
      const theta2 = v * 2 * Math.PI;

      let x = a * (Math.cos(theta1) + phi * Math.cos(theta1 / phi + g));
      let y = a * (Math.sin(theta1) + phi * Math.sin(theta1 / phi));
      let z = h * (Math.cos(theta2) * Math.sin(theta1 * 5)) + m;

      // Apply bend, warp, taper
      x += j * v * 0.5;
      x *= (1 + k * Math.sin(v * Math.PI * 2) * 0.3) * (1 + (l - 1) * v);
      y *= (1 + (l - 1) * v);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 100 })
  },

  poincare_disk_hyperbolic: {
    name: "🌀 Poincaré Disk - Hyperbolic Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0.5;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // Poincaré disk model with hyperbolic metric
      const r = u * 0.95;
      const theta = v * 2 * Math.PI + g + i * u;

      let x = a * r * Math.cos(theta) * (1 + j * r * 0.3);
      let y = a * r * Math.sin(theta) * (1 + j * r * 0.3);

      // Prevent division by zero when r approaches 1
      const denom = Math.max(1e-6, Math.pow(1 - r * r, 2));
      let z = h * (4 * r * r) / denom + m;

      // Apply warp and taper
      x *= (1 + k * Math.sin(theta * 2) * 0.2) * (1 + (l - 1) * u);
      y *= (1 + k * Math.cos(theta * 2) * 0.2) * (1 + (l - 1) * u);

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  voronoi_delaunay_surface: {
    name: "📐 Voronoi-Delaunay Dual Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0.8;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // Simulate Voronoi cells with distance field
      let x = a * (u - 0.5);
      let y = a * (v - 0.5);

      // Distance to nearest seed points
      const cellX = Math.floor(u * 5 + g) / 5;
      const cellY = Math.floor(v * 5) / 5;
      const dist = Math.sqrt(Math.pow(u - cellX, 2) + Math.pow(v - cellY, 2));

      let z = h * dist * (1 + Math.sin(dist * 20)) + m;

      // Apply twist, bend, warp, taper
      const angle = i * dist;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const tempX = x * cosA - y * sinA;
      const tempY = x * sinA + y * cosA;
      x = tempX + j * v * 0.5;
      y = tempY * (1 + k * Math.sin(u * Math.PI * 2) * 0.3);
      x *= (1 + (l - 1) * v);
      y *= (1 + (l - 1) * v);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  apollonian_gasket: {
    name: "⭕ Apollonian Gasket - Circle Packing",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 0.4;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // Descartes' circle theorem visualization
      const theta = u * 2 * Math.PI + i * v;
      const r = v;

      const k1 = 1, k2 = 1, k3 = 1;
      const k4 = k1 + k2 + k3 + Math.sqrt(2 * (k1 * k1 + k2 * k2 + k3 * k3));

      let x = a * r * Math.cos(theta + g);
      let y = a * r * Math.sin(theta);
      let z = h * Math.sin(r * k4 * Math.PI) * Math.cos(theta * 3) + m;

      // Apply bend, warp, taper
      x += j * r * 0.5;
      x *= (1 + k * Math.sin(theta * 2) * 0.2) * (1 + (l - 1) * r);
      y *= (1 + k * Math.cos(theta * 2) * 0.2) * (1 + (l - 1) * r);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  hypercube_5d_projection: {
    name: "🔷 5D Hypercube - Penteract Projection",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // 5D hypercube projected to 3D
      const angle1 = u * 2 * Math.PI + i * u;
      const angle2 = v * 2 * Math.PI + g;

      let x = a * h * (Math.cos(angle1) + Math.cos(angle1 + angle2) / 2);
      let y = a * h * (Math.sin(angle1) + Math.sin(angle1 + angle2) / 2);
      let z = a * h * (Math.cos(angle2) + Math.sin(angle1 - angle2) / 2) + m;

      // Apply bend, warp, taper
      x += j * v * 0.3;
      x *= (1 + k * Math.sin(v * Math.PI * 2) * 0.2) * (1 + (l - 1) * v);
      y *= (1 + k * Math.cos(v * Math.PI * 2) * 0.2) * (1 + (l - 1) * v);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  lichtenberg_fractal: {
    name: "⚡ Lichtenberg Fractal - Electric Discharge",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;  // Phase
      const h = params.h ?? 0.6; // Amplitude
      const i = params.i ?? 2.5; // Twist (branch count)
      const j = params.j ?? 0;   // Bend
      const k = params.k ?? 0;   // Warp
      const l = params.l ?? 1;   // Taper
      const m = params.m ?? 0;   // Offset

      // Fractal branching pattern with COMPLETE g-m support
      const theta = u * 2 * Math.PI + g;
      const r = v;

      const branches = Math.floor(i + 3);
      const branchAngle = Math.sin(r * branches * Math.PI) * 0.5 + j * r * 0.3;

      let x = a * r * Math.cos(theta + branchAngle) * (1 + k * Math.sin(theta * 3) * 0.2);
      let y = a * r * Math.sin(theta + branchAngle) * (1 + k * Math.cos(theta * 3) * 0.2);
      let z = h * r * Math.sin(r * 8 * Math.PI) * (1 - r) + m;

      // Apply taper
      const taperFactor = 1 + (l - 1) * r;
      x *= taperFactor;
      y *= taperFactor;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 80 })
  },

  spin_network_quantum: {
    name: "🌌 Spin Network - Quantum Graph Structure",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0;
      const j = params.j ?? 0.5;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // SU(2) representation space visualization
      const phi = u * 2 * Math.PI + i * v;
      const theta = v * Math.PI + g;

      const spinFactor = (j + 0.5) * 2;

      let x = a * h * Math.sin(theta) * Math.cos(phi) * (1 + Math.cos(spinFactor * theta) / 4);
      let y = a * h * Math.sin(theta) * Math.sin(phi) * (1 + Math.cos(spinFactor * theta) / 4);
      let z = a * h * Math.cos(theta) * (1 + Math.sin(spinFactor * phi) / 4) + m;

      // Apply warp and taper
      x *= (1 + k * Math.sin(phi * 2) * 0.2) * (1 + (l - 1) * v);
      y *= (1 + k * Math.cos(phi * 2) * 0.2) * (1 + (l - 1) * v);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  calabi_yau_simplified: {
    name: "🎭 Calabi-Yau Manifold - String Theory Space",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const i = params.i ?? 0;
      const j = params.j ?? 0;
      const k = params.k ?? 0;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      // Simplified Calabi-Yau projection
      const phi = u * 2 * Math.PI + g + i * u;
      const psi = v * 2 * Math.PI;

      let x = a * h * (Math.cos(phi) + Math.cos(psi)) * Math.cos(phi + psi);
      let y = a * h * (Math.sin(phi) + Math.sin(psi)) * Math.cos(phi - psi);
      let z = a * h * (Math.cos(2 * phi) + Math.sin(2 * psi)) + m;

      // Apply bend, warp, taper
      x += j * v * 0.3;
      x *= (1 + k * Math.sin(psi * 2) * 0.2) * (1 + (l - 1) * v);
      y *= (1 + k * Math.cos(psi * 2) * 0.2) * (1 + (l - 1) * v);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 100 })
  },

  // ============================================================================
  // BIOLOGICAL TISSUE STRUCTURES - Organoid & Pathology Models
  // ============================================================================

  mini_olfactory_bulb: {
    name: "🧠 Mini Olfactory Bulb (mOB) - Brain Organoid",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;      // Overall size
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;         // Phase offset
      const h = params.h ?? 1;         // Layer intensity
      const i = params.i ?? 0;         // Twist
      const j = params.j ?? 0.3;       // Bend
      const k = params.k ?? 0;         // Warp (disabled)
      const l = params.l ?? 1;         // Taper
      const m = params.m ?? 0;         // Z offset

      // Spherical base for organoid structure
      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Layered glomerular structure (concentric layers)
      const glomerularLayers = 8;  // Multiple laminar layers
      const layerModulation = Math.sin(theta * glomerularLayers) * Math.cos(phi * glomerularLayers) * 0.15;

      // Radial folding pattern (mimics tissue convolution)
      const foldingFreq = 12;
      const foldingPattern = Math.sin(theta * foldingFreq) * 0.08 + Math.cos(phi * foldingFreq * 0.7) * 0.08;

      // Combined radius with layering and folding
      const r = a * h * (1 + layerModulation + foldingPattern);

      // Spherical coordinates
      let x = r * Math.sin(phi) * Math.cos(theta);
      let y = r * Math.sin(phi) * Math.sin(theta);
      let z = r * Math.cos(phi) + m;

      // Apply bend for asymmetry (realistic organoid shape)
      x += j * Math.cos(phi) * 0.3;
      y += j * Math.sin(theta) * Math.sin(phi) * 0.3;

      // Apply taper
      const edgeDistU = Math.abs(u - 0.5) * 2;
      const edgeDistV = Math.abs(v - 0.5) * 2;
      const edgeDist = Math.max(edgeDistU, edgeDistV);
      const taperFactor = 1 + (l - 1) * Math.min(edgeDist, 1) * 0.3;
      x *= taperFactor;
      y *= taperFactor;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 80 })
  },

  breast_cancer_tissue: {
    name: "🔬 Breast Cancer Tissue - Pathology Model",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;      // Overall size
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;         // Phase offset
      const h = params.h ?? 1;         // Density intensity
      const i = params.i ?? 0;         // Twist
      const j = params.j ?? 0.3;       // Irregularity factor
      const k = params.k ?? 0;         // Warp (disabled)
      const l = params.l ?? 1;         // Taper
      const m = params.m ?? 0;         // Z offset

      // Base rectangular tissue section
      const x_base = a * (u - 0.5);
      const y_base = a * 0.8 * (v - 0.5);

      // Heterogeneous density patterns (irregular cancer tissue)
      const denseRegion1 = Math.sin(u * 7 * Math.PI + g) * Math.cos(v * 5 * Math.PI);
      const denseRegion2 = Math.cos(u * 11 * Math.PI) * Math.sin(v * 9 * Math.PI);
      const denseRegion3 = Math.sin(u * 13 * Math.PI) * Math.sin(v * 7 * Math.PI);

      // Combined heterogeneous pattern
      const densityPattern = (denseRegion1 * 0.4 + denseRegion2 * 0.3 + denseRegion3 * 0.3) * h;

      // Irregular surface topology (cancer tissue irregularity)
      const irregularityU = Math.sin(u * 15 * Math.PI) * Math.cos(v * 11 * Math.PI);
      const irregularityV = Math.cos(u * 19 * Math.PI) * Math.sin(v * 13 * Math.PI);
      const irregularity = (irregularityU + irregularityV) * j * 0.2;

      // Z-height represents tissue density/thickness
      const z = densityPattern * 0.5 + irregularity + m;

      // Apply positional irregularity
      let x = x_base + irregularityU * j * 0.15;
      let y = y_base + irregularityV * j * 0.15;

      // Apply taper for edge effects
      const edgeDistU = Math.abs(u - 0.5) * 2;
      const edgeDistV = Math.abs(v - 0.5) * 2;
      const edgeDist = Math.max(edgeDistU, edgeDistV);
      const taperFactor = 1 + (l - 1) * Math.min(edgeDist, 1) * 0.3;
      x *= taperFactor;
      y *= taperFactor;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 150, vSegments: 150 })
  },

  // ============================================================================
  // MEDICAL DEVICE STRUCTURES - TPMS Scaffolds & Implants (2025 Research)
  // ============================================================================

  gyroid_tpms: {
    name: "🦴 Gyroid TPMS - Bone Scaffold (Minimal Surface)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const k = params.k ?? 0.65;
      const l = params.l ?? 1;

      const uParam = (u - 0.5) * 2 * Math.PI;
      const vParam = (v - 0.5) * 2 * Math.PI;

      const porosityScale = k;
      const gyroidValue = Math.sin(uParam + g) * Math.cos(vParam) + 
                          Math.sin(vParam) * Math.cos(uParam) + 
                          Math.sin(uParam) * Math.cos(vParam + g);

      const x = a * (u - 0.5) * 2;
      const y = a * (v - 0.5) * 2;
      const z = h * gyroidValue * porosityScale * 0.5;

      const edgeDist = Math.sqrt(Math.pow(u - 0.5, 2) + Math.pow(v - 0.5, 2)) * 2;
      const taperFactor = 1 - (l - 1) * Math.min(edgeDist, 1) * 0.3;

      return [x * taperFactor * b, y * taperFactor * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 120 })
  },

  diamond_tpms: {
    name: "💎 Diamond TPMS - Load-Bearing Implant (Schwarz Diamond)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const k = params.k ?? 0.70;
      const l = params.l ?? 1;

      const uParam = (u - 0.5) * 2 * Math.PI;
      const vParam = (v - 0.5) * 2 * Math.PI;

      const porosityScale = k;
      const diamondValue = Math.sin(uParam + g) * Math.sin(vParam) * Math.sin(uParam + vParam) +
                           Math.sin(uParam + g) * Math.cos(vParam) * Math.cos(uParam + vParam) +
                           Math.cos(uParam + g) * Math.sin(vParam) * Math.cos(uParam + vParam) +
                           Math.cos(uParam + g) * Math.cos(vParam) * Math.sin(uParam + vParam);

      const x = a * (u - 0.5) * 2;
      const y = a * (v - 0.5) * 2;
      const z = h * diamondValue * porosityScale * 0.4;

      const edgeDist = Math.sqrt(Math.pow(u - 0.5, 2) + Math.pow(v - 0.5, 2)) * 2;
      const taperFactor = 1 - (l - 1) * Math.min(edgeDist, 1) * 0.3;

      return [x * taperFactor * b, y * taperFactor * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 120 })
  },

  primitive_tpms: {
    name: "🔲 Primitive TPMS - Cortical Bone (Schwarz P)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const k = params.k ?? 0.60;
      const l = params.l ?? 1;

      const uParam = (u - 0.5) * 2 * Math.PI;
      const vParam = (v - 0.5) * 2 * Math.PI;

      const porosityScale = k;
      const primitiveValue = Math.cos(uParam + g) + Math.cos(vParam) + Math.cos(uParam + vParam);

      const x = a * (u - 0.5) * 2;
      const y = a * (v - 0.5) * 2;
      const z = h * primitiveValue * porosityScale * 0.4;

      const edgeDist = Math.sqrt(Math.pow(u - 0.5, 2) + Math.pow(v - 0.5, 2)) * 2;
      const taperFactor = 1 - (l - 1) * Math.min(edgeDist, 1) * 0.3;

      return [x * taperFactor * b, y * taperFactor * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 100 })
  },

  iws_tpms: {
    name: "🏗️ IWS TPMS - Tissue Engineering (I-Wrapped Package)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = params.g ?? 0;
      const h = params.h ?? 1;
      const k = params.k ?? 0.68;
      const l = params.l ?? 1;

      const uParam = (u - 0.5) * 2 * Math.PI;
      const vParam = (v - 0.5) * 2 * Math.PI;

      const porosityScale = k;
      const iwsValue = 2 * (Math.cos(uParam + g) * Math.cos(vParam) + 
                            Math.cos(vParam) * Math.cos(uParam + vParam) + 
                            Math.cos(uParam + vParam) * Math.cos(uParam + g)) -
                       (Math.cos(2 * (uParam + g)) + Math.cos(2 * vParam) + Math.cos(2 * (uParam + vParam)));

      const x = a * (u - 0.5) * 2;
      const y = a * (v - 0.5) * 2;
      const z = h * iwsValue * porosityScale * 0.3;

      const edgeDist = Math.sqrt(Math.pow(u - 0.5, 2) + Math.pow(v - 0.5, 2)) * 2;
      const taperFactor = 1 - (l - 1) * Math.min(edgeDist, 1) * 0.3;

      return [x * taperFactor * b, y * taperFactor * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 120 })
  },

  // ============================================================================
  // BIOBOT SYSTEMS - Advanced Synthetic Bio-Robots
  // ============================================================================

  muscle_powered_biobot: {
    name: "💪 Muscle-Powered Biobot - Contract-Relax Walker",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 2;
      const g = params.g ?? 0;
      const h = params.h ?? 0.3;
      const i = params.i ?? 0.1;
      const j = params.j ?? 0;
      const k = params.k ?? 5;
      const l = params.l ?? 1;
      const m = params.m ?? 0;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const musclePulse = Math.sin(f * theta + g) * Math.cos(f * phi) * h;

      const fractalTexture = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const iteration = Math.abs(Math.sin(u * 15) * Math.cos(v * 15));
      const contractRelax = Math.sin(theta * 3) * Math.cos(phi * 2) * 0.15;

      const radius = a * (1 + musclePulse + fractalTexture + iteration * 0.05 + contractRelax);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) * 0.7;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60 })
  },

  ciliabot: {
    name: "🦠 CiliaBot - Continuous Beating Spheroid",
    equation: (u, v, params) => {
      const a = params.a ?? 0.3;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 8;
      const g = params.g ?? 0;
      const h = params.h ?? 0.15;
      const i = params.i ?? 0.05;
      const k = params.k ?? 12;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const ciliaBeating = Math.sin(f * theta + g) * Math.cos(f * phi) * h;

      const fractalSkin = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const mandelbrotIteration = Math.abs(Math.sin(u * 20) * Math.cos(v * 20));

      const baseRadius = a * (1 + ciliaBeating + fractalSkin + mandelbrotIteration * 0.03);

      const x = baseRadius * Math.sin(phi) * Math.cos(theta);
      const y = baseRadius * Math.sin(phi) * Math.sin(theta);
      const z = baseRadius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48 })
  },

  xenobot: {
    name: "🐸 Xenobot - Self-Healing Crawling Blob",
    equation: (u, v, params) => {
      const a = params.a ?? 0.8;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 3;
      const g = params.g ?? 0;
      const h = params.h ?? 0.2;
      const i = params.i ?? 0.1;
      const j = params.j ?? 0.15;
      const k = params.k ?? 8;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const crawlDeformation = Math.sin(f * theta + g) * h;

      const blobIrregularity = Math.sin(theta * 5) * Math.cos(phi * 4) * j;
      const fractalPattern = Math.sin(u * k * Math.PI) * Math.cos(v * k * Math.PI) * i;
      const juliaSet = Math.sin(u * 18 + v * 22) * Math.cos(u * 22 - v * 18) * 0.04;

      const radius = a * (1 + crawlDeformation + blobIrregularity + fractalPattern + juliaSet);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) * 0.7;

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 48 })
  },

  magneto_biobot: {
    name: "🧲 Magneto-Biobot - Magnetic Navigation Helix",
    equation: (u, v, params) => {
      const a = params.a ?? 0.4;
      const b = params.b ?? 0.1;
      const e = params.e ?? 2;
      const f = params.f ?? 5;
      const g = params.g ?? 0;
      const h = params.h ?? 0.1;
      const i = params.i ?? 0.08;
      const k = params.k ?? 10;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const magneticField = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const helicalPattern = Math.sin(theta * e) * Math.cos(phi * e) * 0.12;

      const fractalMagneticTexture = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const spiralIteration = Math.abs(Math.sin(u * 25) * Math.cos(v * 15));

      const radius = a * (1 + magneticField + helicalPattern + fractalMagneticTexture + spiralIteration * 0.02);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 64 })
  },

  light_responsive_biobot: {
    name: "💡 Light-Responsive Biobot - Phototropic Sheet",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 0.6;
      const f = params.f ?? 4;
      const g = params.g ?? 0;
      const h = params.h ?? 0.25;
      const i = params.i ?? 0.12;
      const k = params.k ?? 7;
      const l = params.l ?? 1;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const lightBending = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const photoContraction = Math.sin(theta * 2) * Math.cos(phi * 3) * 0.18;

      const fractalLightPattern = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const diffusionIteration = Math.abs(Math.sin(u * 16 + v * 12) * Math.cos(u * 12 - v * 16));

      const radius = a * (1 + lightBending + photoContraction + fractalLightPattern + diffusionIteration * 0.05);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60 })
  },

  chemotactic_biobot: {
    name: "🧪 Chemotactic Biobot - Gradient Navigator",
    equation: (u, v, params) => {
      const a = params.a ?? 0.25;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 6;
      const g = params.g ?? 0;
      const h = params.h ?? 0.08;
      const i = params.i ?? 0.06;
      const j = params.j ?? 0.1;
      const k = params.k ?? 15;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const chemicalGradient = Math.sin(f * theta + g) * Math.cos(f * phi) * h;

      const fractalChemicalSensor = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const perlinNoise = Math.sin(u * 30 + v * 25) * Math.cos(u * 25 - v * 30) * 0.02;

      const gradientBias = j * Math.sin(theta) * Math.cos(phi);

      const radius = a * (1 + chemicalGradient + fractalChemicalSensor + perlinNoise + gradientBias);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 56, vSegments: 40 })
  },

  sperm_hybrid_biobot: {
    name: "🏊 Sperm-Hybrid Biobot - Flagella Swimmer",
    equation: (u, v, params) => {
      const a = params.a ?? 0.15;
      const b = params.b ?? 0.08;
      const e = params.e ?? 3;
      const f = params.f ?? 8;
      const g = params.g ?? 0;
      const h = params.h ?? 0.06;
      const i = params.i ?? 0.04;
      const k = params.k ?? 12;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const flagellaWave = Math.sin(f * theta + g) * Math.cos(e * phi) * h;
      const swimmingMotion = Math.sin(theta * 4) * Math.cos(phi * 3) * 0.08;

      const fractalMembraneTexture = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const microScale = Math.abs(Math.sin(u * 40) * Math.cos(v * 35));

      const radius = a * (1 + flagellaWave + swimmingMotion + fractalMembraneTexture + microScale * 0.02);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48 })
  },

  hydrogel_scaffold_biobot: {
    name: "🧊 Hydrogel Scaffold Biobot - Customizable Hybrid",
    equation: (u, v, params) => {
      const a = params.a ?? 0.7;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 4;
      const g = params.g ?? 0;
      const h = params.h ?? 0.18;
      const i = params.i ?? 0.15;
      const j = params.j ?? 0.1;
      const k = params.k ?? 6;
      const l = params.l ?? 1;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      const embeddedCellPulsation = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const scaffoldPattern = Math.sin(theta * 3) * Math.cos(phi * 4) * 0.12;

      const hydrogelPorosity = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const scaffoldStructure = Math.sin(u * 10 + v * 8) * Math.cos(u * 8 - v * 10) * j;
      const fractalHydrogel = Math.abs(Math.sin(u * 18) * Math.cos(v * 14));

      const radius = a * (1 + embeddedCellPulsation + scaffoldPattern + hydrogelPorosity + scaffoldStructure + fractalHydrogel * 0.03);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56 })
  },

  // ============================================================================
  // ADVANCED BIOBOTS 2024 - Cutting-Edge Synthetic Biology
  // ============================================================================

  anthrobot: {
    name: "🫁 Anthrobot - Human Tracheal Cell Biobot (30-500 µm, visualized 60x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: 30-500 µm (35 µm avg), scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 12;
      const g = params.g ?? 0;
      const h = params.h ?? 0.15;
      const i = params.i ?? 0.08;
      const k = params.k ?? 18;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Cilia beating pattern (yellow in fluorescence microscopy)
      const ciliaBeat = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const ciliaProjection = Math.sin(theta * 8) * Math.cos(phi * 6) * 0.12;

      // Tracheal cell texture
      const fractalCilia = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const trachealSurface = Math.abs(Math.sin(u * 22) * Math.cos(v * 28));
      const healingFactors = Math.sin(phi * 10) * Math.cos(theta * 8) * 0.06;

      const radius = a * (1 + ciliaBeat + ciliaProjection + fractalCilia + trachealSurface * 0.04 + healingFactors);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56 })
  },

  cardiac_biobot: {
    name: "❤️ Cardiac Biobot - Beating Heart Tissue",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 1.5;  // Heart rate frequency
      const g = params.g ?? 0;
      const h = params.h ?? 0.25;
      const i = params.i ?? 0.12;
      const k = params.k ?? 8;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Cardiac muscle contraction
      const systole = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const muscleStriation = Math.sin(theta * 6) * Math.cos(phi * 8) * 0.18;

      // Cardiac tissue texture
      const fractalMuscle = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const cardiomyocytePattern = Math.abs(Math.sin(u * 14 + v * 18) * Math.cos(u * 18 - v * 14));
      const valveStructure = Math.sin(phi * 4) * Math.cos(theta * 5) * 0.08;

      const radius = a * (1 + systole + muscleStriation + fractalMuscle + cardiomyocytePattern * 0.05 + valveStructure);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64 })
  },

  neuromuscular_biobot: {
    name: "⚡ Neuromuscular Biobot - Optogenetic Control (~600 µm, visualized 3x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~600 µm, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 10;
      const g = params.g ?? 0;
      const h = params.h ?? 0.2;
      const i = params.i ?? 0.1;
      const k = params.k ?? 14;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Light-activated motor neuron firing (optogenetic channelrhodopsin)
      const neuronFiring = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const muscleContraction = Math.sin(theta * 4) * Math.cos(phi * 3) * 0.16;

      // Neuromuscular junction texture
      const fractalSynapse = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const acetylcholineReceptors = Math.abs(Math.sin(u * 20 + v * 16) * Math.cos(u * 16 - v * 20));
      const motorEndplate = Math.sin(phi * 12) * Math.cos(theta * 10) * 0.07;

      const radius = a * (1 + neuronFiring + muscleContraction + fractalSynapse + acetylcholineReceptors * 0.04 + motorEndplate);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 76, vSegments: 60 })
  },

  cortical_assembloid: {
    name: "🧠 Cortical Assembloid - Brain Organoid Biobot",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;  // 0.5-2mm typical
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 3;
      const g = params.g ?? 0;
      const h = params.h ?? 0.22;
      const i = params.i ?? 0.18;
      const k = params.k ?? 6;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Neural oscillations
      const neuralActivity = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const corticalFolding = Math.sin(theta * 5) * Math.cos(phi * 7) * 0.2;

      // Brain tissue texture
      const fractalCortex = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const neuralNetworkPattern = Math.abs(Math.sin(u * 12 + v * 14) * Math.cos(u * 14 - v * 12));
      const sulciGyri = Math.sin(phi * 8) * Math.cos(theta * 6) * 0.15;

      const radius = a * (1 + neuralActivity + corticalFolding + fractalCortex + neuralNetworkPattern * 0.06 + sulciGyri);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // CELLULAR ORGANELLES - Subcellular Structures
  // ============================================================================

  peroxisome: {
    name: "🔬 Peroxisome - Metabolic Organelle (0.1-1 µm, visualized 2500x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: 0.1-1 µm (800 nm), scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 16;
      const g = params.g ?? 0;
      const h = params.h ?? 0.12;
      const i = params.i ?? 0.08;
      const k = params.k ?? 20;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Enzymatic activity
      const enzymeActivity = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const catalase = Math.sin(theta * 12) * Math.cos(phi * 10) * 0.08;

      // Peroxisomal membrane texture
      const fractalMembrane = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const fattyAcidBreakdown = Math.abs(Math.sin(u * 28) * Math.cos(v * 32));
      const peroxins = Math.sin(phi * 18) * Math.cos(theta * 16) * 0.05;

      const radius = a * (1 + enzymeActivity + catalase + fractalMembrane + fattyAcidBreakdown * 0.03 + peroxins);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 36 })
  },

  vacuole: {
    name: "💧 Vacuole - Storage Compartment (variable size, visible scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;  // Variable size
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 4;
      const g = params.g ?? 0;
      const h = params.h ?? 0.15;
      const i = params.i ?? 0.1;
      const k = params.k ?? 8;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Osmotic pressure variation
      const osmoticPressure = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const tonoplast = Math.sin(theta * 6) * Math.cos(phi * 5) * 0.12;

      // Vacuolar membrane texture
      const fractalTonoplast = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const storageVesicles = Math.abs(Math.sin(u * 14 + v * 16) * Math.cos(u * 16 - v * 14));
      const fluidPockets = Math.sin(phi * 10) * Math.cos(theta * 8) * 0.08;

      const radius = a * (1 + osmoticPressure + tonoplast + fractalTonoplast + storageVesicles * 0.04 + fluidPockets);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48 })
  },

  centrosome: {
    name: "⭐ Centrosome - Microtubule Organizing Center (~1 µm, visualized 2000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~1 µm, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 20;
      const g = params.g ?? 0;
      const h = params.h ?? 0.18;
      const i = params.i ?? 0.12;
      const k = params.k ?? 24;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Microtubule nucleation
      const microtubuleStars = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const centriolePattern = Math.sin(theta * 9) * Math.cos(phi * 9) * 0.16;

      // Pericentriolar material texture
      const fractalPCM = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const gammaTubulin = Math.abs(Math.sin(u * 32 + v * 28) * Math.cos(u * 28 - v * 32));
      const astralRays = Math.sin(phi * 16) * Math.cos(theta * 14) * 0.14;

      const radius = a * (1 + microtubuleStars + centriolePattern + fractalPCM + gammaTubulin * 0.05 + astralRays);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60 })
  },

  centriole: {
    name: "🌀 Centriole - Cylindrical Barrel Structure (~0.5 µm, visualized 4000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~0.5 µm, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 9;  // 9-fold symmetry
      const g = params.g ?? 0;
      const h = params.h ?? 0.2;
      const i = params.i ?? 0.15;
      const k = params.k ?? 27;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // 9-fold triplet microtubule arrangement
      const tripletMicrotubules = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const barrelStructure = Math.sin(theta * 9) * Math.cos(phi * 3) * 0.18;

      // Centriole barrel texture
      const fractalBarrel = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const cartwheel = Math.abs(Math.sin(u * 36 + v * 27) * Math.cos(u * 27 - v * 36));
      const microtubuleTriplets = Math.sin(phi * 9) * Math.cos(theta * 9) * 0.12;

      const radius = a * (1 + tripletMicrotubules + barrelStructure + fractalBarrel + cartwheel * 0.04 + microtubuleTriplets);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 48 })
  },

  nucleolus: {
    name: "🔵 Nucleolus - Ribosome Factory (~2 µm, visualized 1000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~2 µm, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 12;
      const g = params.g ?? 0;
      const h = params.h ?? 0.16;
      const i = params.i ?? 0.12;
      const k = params.k ?? 16;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // rRNA transcription activity
      const rRNATranscription = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const fibrillarCenters = Math.sin(theta * 8) * Math.cos(phi * 6) * 0.14;

      // Nucleolar texture
      const fractalNucleolus = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const ribosomeAssembly = Math.abs(Math.sin(u * 20 + v * 24) * Math.cos(u * 24 - v * 20));
      const denseComponents = Math.sin(phi * 14) * Math.cos(theta * 12) * 0.1;

      const radius = a * (1 + rRNATranscription + fibrillarCenters + fractalNucleolus + ribosomeAssembly * 0.05 + denseComponents);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56 })
  },

  smooth_er: {
    name: "🧪 Smooth Endoplasmic Reticulum - Lipid Synthesis (visible scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 8;
      const g = params.g ?? 0;
      const h = params.h ?? 0.18;
      const i = params.i ?? 0.14;
      const k = params.k ?? 10;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Tubular network structure
      const tubularNetwork = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const lipidSynthesis = Math.sin(theta * 6) * Math.cos(phi * 8) * 0.16;

      // Smooth membrane texture (no ribosomes)
      const fractalMembrane = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const calciumStorage = Math.abs(Math.sin(u * 16 + v * 18) * Math.cos(u * 18 - v * 16));
      const detoxification = Math.sin(phi * 12) * Math.cos(theta * 10) * 0.1;

      const radius = a * (1 + tubularNetwork + lipidSynthesis + fractalMembrane + calciumStorage * 0.05 + detoxification);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64 })
  },

  // Cellular Organelles - Core subcellular structures
  mitochondria: {
    name: "⚡ Mitochondria - Powerhouse with Cristae (1-10 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.8;
      const b = params.b ?? 0.3;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      let r = b * sinPhi;
      const cristaeCount = 18;
      const cristaeDepth = 0.08 * Math.abs(Math.sin(cristaeCount * phi));
      const cristaeOrientation = Math.sin(cristaeCount * theta * 0.3);
      r += cristaeDepth * cristaeOrientation;
      const outerMembrane = 0.015 * Math.sin(40 * theta) * Math.sin(30 * phi);
      r += outerMembrane;
      const irregularity = 0.02 * Math.sin(8 * theta + 5 * phi);
      r += irregularity;
      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi * 2.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72, a: 0.8, b: 0.3 })
  },

  nucleus: {
    name: "🧬 Nucleus - Control Center with Chromatin (10-20 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      let r = a * sinPhi;
      const poreCount = 30;
      const nuclearPores = 0.03 * Math.sin(poreCount * theta) * Math.sin(poreCount * phi);
      r += nuclearPores;
      const chromatinDensity = 0.05 * Math.abs(Math.sin(12 * theta + 8 * phi));
      r += chromatinDensity;
      const envelopeTexture = 0.02 * Math.sin(50 * theta) * Math.sin(40 * phi);
      r += envelopeTexture;
      const nucleolusBulge = 0.08 * Math.exp(-5 * Math.pow(phi - Math.PI/3, 2)) * Math.cos(theta);
      r += nucleolusBulge;
      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi + nucleolusBulge * 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72, a: 1.5 })
  },

  rough_er: {
    name: "🔬 Rough ER - Ribosome-Studded Network",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      let r = 0.3 + 0.2 * sinPhi;
      const branches = 0.15 * Math.abs(Math.sin(4 * theta)) * Math.sin(3 * phi);
      r += branches;
      const ribosomeCount = 60;
      const ribosomes = 0.08 * Math.abs(Math.sin(ribosomeCount * theta) * Math.sin(ribosomeCount * phi * 0.7));
      r += ribosomes;
      const cisternae = 0.12 * Math.sin(6 * phi) * Math.cos(3 * theta);
      r += cisternae;
      return [r * Math.cos(theta) * a, r * Math.sin(theta) * a, cosPhi * a * 1.2 + cisternae * 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 90, a: 1.2 })
  },

  golgi_apparatus: {
    name: "📦 Golgi Apparatus - Stacked Cisternae (5-8 layers)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const stackCount = 7;
      const stackHeight = 0.8;
      const discRadius = 0.6 * sinPhi;
      const stackLayer = Math.floor(phi / Math.PI * stackCount);
      const layerOffset = (stackLayer / stackCount - 0.5) * stackHeight;
      let r = discRadius * (1 - 0.2 * Math.abs(cosPhi));
      const edgeCurve = phi < Math.PI/2 ? 0.1 * Math.sin(4 * theta) : 0.15 * Math.sin(3 * theta);
      r += edgeCurve;
      const vesicles = 0.06 * Math.abs(Math.sin(8 * theta)) * (phi > Math.PI * 0.7 ? 1 : 0);
      r += vesicles;
      return [r * Math.cos(theta) * a, r * Math.sin(theta) * a, layerOffset * a + vesicles * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 84, vSegments: 64, a: 1.0 })
  },

  lysosome: {
    name: "🔮 Lysosome - Digestive Vesicle (0.1-1.2 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.4;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      let r = a * sinPhi;
      const enzymeGranules = 0.04 * Math.sin(25 * theta) * Math.sin(20 * phi);
      r += enzymeGranules;
      const membraneTexture = 0.02 * Math.sin(15 * theta + 12 * phi);
      r += membraneTexture;
      const denseCore = 0.05 * Math.exp(-3 * Math.pow(phi - Math.PI/2, 2));
      r += denseCore;
      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48, a: 0.4 })
  },

  ribosome: {
    name: "⚙️ Ribosome - Protein Factory (20-30 nm)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.15;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      let r = a * sinPhi;
      const largeSubunit = phi > Math.PI/2 ? 0.08 * Math.exp(-8 * Math.pow(phi - Math.PI * 0.7, 2)) : 0;
      const smallSubunit = phi < Math.PI/2 ? 0.06 * Math.exp(-8 * Math.pow(phi - Math.PI * 0.3, 2)) : 0;
      r += largeSubunit + smallSubunit;
      const rnaTexture = 0.01 * Math.sin(50 * theta) * Math.sin(40 * phi);
      r += rnaTexture;
      const interfaceGap = Math.abs(phi - Math.PI/2) < 0.2 ? -0.02 : 0;
      r += interfaceGap;
      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 36, a: 0.15 })
  },

  // ============================================================================
  // BLOOD & IMMUNE CELLS - Hematology
  // ============================================================================

  red_blood_cell: {
    name: "🔴 Red Blood Cell (Erythrocyte) - Biconcave Disc (7-8 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const r = a * sinPhi;

      // TRUE biconcave disc - thicker rim, central depression (no hole)
      const biconcaveZ = a * 0.2 * (1 - 2.5 * Math.pow(sinPhi - 0.5, 2)) * Math.cos(phi);

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        biconcaveZ
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48, a: 1, c: 0.4 })
  },

  neutrophil: {
    name: "⚪ Neutrophil - Multi-lobed Nucleus (10-12 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Multi-lobed nuclear indentations (3-5 lobes)
      const lobes = 4;
      const lobeDepth = 0.15 * Math.sin(lobes * theta) * Math.sin(2 * phi);
      r += lobeDepth;

      // Granular cytoplasm texture
      const granules = 0.02 * Math.sin(15 * theta) * Math.sin(15 * phi);
      r += granules;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56, a: 1.2 })
  },

  lymphocyte: {
    name: "🔵 Lymphocyte - Large Nucleus (7-12 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.9;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Large nucleus creates central bulge (80% of cell volume)
      const nucleusBulge = 0.3 * Math.exp(-2 * Math.pow(phi - Math.PI/2, 2));
      r += nucleusBulge;

      // Smooth surface (no granules)
      const smoothSurface = 0.01 * Math.sin(8 * theta) * Math.sin(6 * phi);
      r += smoothSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi + nucleusBulge * 0.5
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 68, vSegments: 52, a: 0.9 })
  },

  monocyte: {
    name: "🟤 Monocyte - Kidney-shaped Nucleus (15-22 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Kidney-shaped nuclear indentation
      const kidneyIndent = 0.25 * Math.sin(theta) * Math.sin(2 * phi) * 
                          Math.exp(-Math.pow(theta - Math.PI, 2));
      r -= Math.abs(kidneyIndent);

      // Slightly irregular surface
      const irregularSurface = 0.03 * Math.sin(12 * theta) * Math.sin(8 * phi);
      r += irregularSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60, a: 1.5 })
  },

  macrophage: {
    name: "🦠 Macrophage - Irregular with Pseudopodia (15-30 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Irregular pseudopodia (3-6 extensions)
      const pseudopodia = 0.4 * Math.max(0, Math.sin(3 * theta) * Math.sin(phi));
      r += pseudopodia;

      // Additional smaller extensions
      const microExtensions = 0.15 * Math.sin(8 * theta) * Math.sin(4 * phi);
      r += microExtensions;

      // Rough, textured surface
      const roughSurface = 0.05 * Math.sin(20 * theta) * Math.sin(15 * phi);
      r += roughSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi + pseudopodia * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 84, vSegments: 64, a: 1.8 })
  },

  platelet: {
    name: "🩸 Platelet - Irregular Fragment (2-4 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 0.3; // Much smaller
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Irregular fragment shape
      let r = a * sinPhi * (0.7 + 0.3 * Math.sin(5 * theta));

      // Fragment irregularities
      const fragments = 0.1 * Math.sin(7 * theta) * Math.sin(9 * phi);
      r += fragments;

      // Asymmetric shape
      const asymmetry = 0.05 * Math.sin(3 * theta + phi);
      r += asymmetry;

      return [
        r * Math.cos(theta) * (1 + 0.2 * Math.sin(4 * phi)),
        r * Math.sin(theta) * (1 + 0.15 * Math.cos(3 * phi)),
        a * cosPhi * 0.5 // Flattened
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 36, a: 0.3 })
  },

  eosinophil: {
    name: "🟠 Eosinophil - Bi-lobed with Large Granules (12-17 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.15;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Bi-lobed nucleus (2 lobes)
      const biLobe = 0.2 * Math.sin(2 * theta) * Math.sin(1.5 * phi);
      r += biLobe;

      // Large bright granules
      const largeGranules = 0.08 * Math.abs(Math.sin(12 * theta) * Math.sin(10 * phi));
      r += largeGranules;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 76, vSegments: 58, a: 1.15 })
  },

  basophil: {
    name: "🟣 Basophil - Dark Granules (10-14 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;

      // Dense granules create bumpy surface
      const denseGranules = 0.12 * Math.abs(Math.sin(18 * theta) * Math.sin(14 * phi));
      r += denseGranules;

      // Very granular surface (nucleus often obscured)
      const granularSurface = 0.06 * Math.sin(25 * theta) * Math.sin(20 * phi);
      r += granularSurface;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 62, a: 1.1 })
  },

  // ============================================================================
  // MICROORGANISMS - Bacteria & Viruses
  // ============================================================================

  bacterial_cell: {
    name: "🦠 Bacterial Cell - Rod with Flagella (~2 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;   // Length
      const b = params.b ?? 0.3; // Width
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Rod shape (elongated)
      const r = b * sinPhi;
      const z = a * cosPhi;

      // Flagella at ends
      let flagellaX = 0;
      let flagellaY = 0;
      if (Math.abs(cosPhi) > 0.8) {
        flagellaX = 0.3 * Math.sin(10 * theta) * Math.sign(cosPhi);
        flagellaY = 0.3 * Math.cos(10 * theta) * Math.sign(cosPhi);
      }

      return [
        r * Math.cos(theta) + flagellaX,
        r * Math.sin(theta) + flagellaY,
        z
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48, a: 2, b: 0.3 })
  },

  bacteriophage: {
    name: "🧬 Bacteriophage - Virus Injector (~200 nm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Icosahedral head at top (phi < π/2)
      // Cylindrical tail at bottom (phi > π/2)
      const isHead = cosPhi > 0;

      if (isHead) {
        // Icosahedral head with facets
        const icosahedralFacets = 1 + 0.15 * Math.abs(Math.sin(5 * theta) * Math.cos(3 * phi));
        const r = a * sinPhi * icosahedralFacets;

        return [
          r * Math.cos(theta),
          r * Math.sin(theta),
          a * cosPhi
        ];
      } else {
        // Cylindrical tail with tail fibers
        const tailRadius = a * 0.2; // Thin tail
        const tailFibers = phi > 2.8 ? 0.3 * Math.abs(Math.sin(6 * theta)) : 0; // Fibers at end

        return [
          (tailRadius + tailFibers) * Math.cos(theta),
          (tailRadius + tailFibers) * Math.sin(theta),
          a * cosPhi
        ];
      }
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56, a: 1 })
  },

  coronavirus: {
    name: "🦠 Coronavirus - Spike Proteins (~120 nm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Spherical envelope
      let r = a * sinPhi;

      // LONG prominent spike proteins (≥40% extension beyond envelope)
      const spikePattern = Math.abs(Math.sin(8 * theta) * Math.sin(6 * phi));
      const longSpikes = spikePattern > 0.7 ? 0.5 : 0; // Only at specific points
      r += longSpikes;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64, a: 1 })
  },

  icosahedral_virus: {
    name: "🔷 Icosahedral Virus - 20-Faced Capsid (~50 nm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Sharp triangular facets using spherical harmonics
      const facets = Math.abs(Math.sin(5 * theta) * Math.sin(5 * phi) + 
                              Math.cos(5 * theta) * Math.cos(5 * phi));
      const r = a * (sinPhi + 0.2 * facets); // Sharp geometric shape

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60, a: 1 })
  },

  yeast_cell: {
    name: "🍞 Yeast Cell - Budding Fungus (~5 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Ellipsoid main body
      let r = a * sinPhi;

      // Budding sphere at side (≥40% protrusion)
      const budTheta = Math.PI * 0.5; // Bud position
      const budPhi = Math.PI * 0.6;
      const budDistance = Math.sqrt(
        Math.pow(theta - budTheta, 2) + 
        Math.pow(phi - budPhi, 2)
      );
      const budProtrusion = budDistance < 0.8 ? 0.6 * (1 - budDistance / 0.8) : 0;
      r += budProtrusion;

      return [
        r * Math.cos(theta) * 1.2, // Ellipsoid shape
        r * Math.sin(theta),
        a * cosPhi * 0.8
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 68, vSegments: 52, a: 1 })
  },

  paramecium: {
    name: "👾 Paramecium - Ciliated Protist (~200 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Elongated slipper shape (prolate ellipsoid)
      const slipperProfile = 1 + 0.3 * Math.sin(phi); // Tapered ends
      let r = a * sinPhi * slipperProfile * 0.5; // Thinner

      // Oral groove (ventral indentation)
      const grooveDepth = theta > Math.PI * 0.7 && theta < Math.PI * 1.3 ? -0.15 : 0;
      r += grooveDepth;

      // Cilia ripples along edge
      const cilia = 0.04 * Math.sin(20 * theta) * Math.sin(15 * phi);
      r += cilia;

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi * 1.8 // Very elongated
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72, a: 1.5 })
  },

  amoeba: {
    name: "🦠 Amoeba - Shape-Shifting Protist (~250 µm)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Irregular blob with noise-driven pseudopodia
      const noise1 = Math.sin(3 * theta) * Math.cos(2 * phi);
      const noise2 = Math.sin(5 * theta + 1) * Math.cos(3 * phi + 0.5);
      const noise3 = Math.sin(2 * theta + 2) * Math.cos(4 * phi + 1);

      // 3-5 pseudopodia extending outward
      const pseudopodia = 0.5 * (noise1 + 0.7 * noise2 + 0.5 * noise3);

      const r = a * sinPhi * (1 + pseudopodia);

      return [
        r * Math.cos(theta),
        r * Math.sin(theta),
        a * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64, a: 1 })
  },

  axon_with_myelin: {
    name: "🔗 Axon with Myelin Sheath - Neural Fiber",
    equation: (u, v, params) => {
      const t = u;
      const theta = v * 2 * Math.PI;

      const path_length = params.a ?? 2;
      const r_axon = params.b ?? 0.05;
      const r_myelin_base = params.c ?? 0.15;
      const segments = params.d ?? 10;
      const node_gaps = params.e ?? 0.2;
      const wraps = params.f ?? 100;

      const is_node = Math.sin(t * segments * Math.PI) > 0.8;
      const myelin_thickness = is_node ? r_axon : r_myelin_base * (1 + node_gaps * Math.sin(wraps * t));

      const x = path_length * t;
      const y = myelin_thickness * Math.cos(theta);
      const z = myelin_thickness * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 48, a: 2, b: 0.05, c: 0.15, d: 10, e: 0.2, f: 100 })
  },

  // ============================================================================
  // PLANT CELL STRUCTURES - Photosynthesis & Structure
  // ============================================================================

  chloroplast: {
    name: "🌿 Chloroplast - Photosynthesis Organelle (~5 µm, visualized 400x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~5 µm, lens-shaped with thylakoid stacks, green chlorophyll, scaled
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 10;
      const g = params.g ?? 0;
      const h = params.h ?? 0.16;
      const i = params.i ?? 0.12;
      const k = params.k ?? 16;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Lens-shaped with thylakoid stacks
      const lensShape = 1 - 0.4 * Math.pow(Math.cos(phi), 2);
      const thylakoidStacks = Math.sin(f * theta + g) * Math.cos(f * phi) * h;

      // Chloroplast texture
      const fractalGrana = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const chlorophyll = Math.abs(Math.sin(u * 20 + v * 22) * Math.cos(u * 22 - v * 20));
      const stroma = Math.sin(phi * 14) * Math.cos(theta * 12) * 0.1;

      const radius = a * lensShape * (1 + thylakoidStacks + fractalGrana + chlorophyll * 0.04 + stroma);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 72, vSegments: 56 })
  },

  plant_cell_wall: {
    name: "🧱 Plant Cell Wall - Cellulose Structure (visible scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 6;
      const g = params.g ?? 0;
      const h = params.h ?? 0.14;
      const i = params.i ?? 0.1;
      const k = params.k ?? 12;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Rigid cubic structure
      const celluloseFibers = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const pectin = Math.sin(theta * 8) * Math.cos(phi * 6) * 0.12;

      // Cell wall texture
      const fractalCellulose = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const ligninDeposition = Math.abs(Math.sin(u * 16 + v * 18) * Math.cos(u * 18 - v * 16));
      const plasmodesmata = Math.sin(phi * 10) * Math.cos(theta * 8) * 0.08;

      const radius = a * (1 + celluloseFibers + pectin + fractalCellulose + ligninDeposition * 0.04 + plasmodesmata);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 48 })
  },

  plant_vacuole: {
    name: "💧 Plant Vacuole - Large Central Storage (visible scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 0;
      const g = params.g ?? 0;
      const h = params.h ?? 0;
      const i = params.i ?? 0;
      const k = params.k ?? 0;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Large spherical vacuole
      const turgorPressure = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const anthocyanins = Math.sin(theta * 5) * Math.cos(phi * 4) * 0.1;

      // Plant vacuole texture
      const fractalTonoplast = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const waterStorage = Math.abs(Math.sin(u * 14 + v * 16) * Math.cos(u * 16 - v * 14));
      const cellSap = Math.sin(phi * 8) * Math.cos(theta * 6) * 0.08;

      const radius = a * (1 + turgorPressure + anthocyanins + fractalTonoplast + waterStorage * 0.03 + cellSap);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 88, vSegments: 68 })
  },

  // ============================================================================
  // MOLECULAR MACHINES - Nanoscale Protein Complexes
  // ============================================================================

  atp_synthase: {
    name: "⚡ ATP Synthase - Rotating Molecular Motor (~10 nm, visualized 200000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~10 nm, mushroom-shaped rotating motor, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 24;  // Rotation frequency
      const g = params.g ?? 0;
      const h = params.h ?? 0.22;
      const i = params.i ?? 0.16;
      const k = params.k ?? 30;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Mushroom shape with rotating central stalk
      const rotaryStalk = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const f1Complex = Math.sin(theta * 6) * Math.cos(phi * 3) * 0.2;

      // ATP synthase texture
      const fractalProtonChannel = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const catalyticSites = Math.abs(Math.sin(u * 36 + v * 40) * Math.cos(u * 40 - v * 36));
      const bindingChange = Math.sin(phi * 24) * Math.cos(theta * 18) * 0.14;

      const radius = a * (1 + rotaryStalk + f1Complex + fractalProtonChannel + catalyticSites * 0.05 + bindingChange);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72 })
  },

  kinesin: {
    name: "🚶 Kinesin - Walking Motor Protein (~8 nm, visualized 250000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~8 nm, two-headed walking motor, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 16;
      const g = params.g ?? 0;
      const h = params.h ?? 0.24;
      const i = params.i ?? 0.18;
      const k = params.k ?? 28;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Two-headed motor with walking motion
      const motorHeads = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const steppingMotion = Math.sin(theta * 8) * Math.cos(phi * 4) * 0.2;

      // Kinesin texture
      const fractalNeckLinker = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const atpHydrolysis = Math.abs(Math.sin(u * 32 + v * 36) * Math.cos(u * 36 - v * 32));
      const cargoBinding = Math.sin(phi * 20) * Math.cos(theta * 16) * 0.14;

      const radius = a * (1 + motorHeads + steppingMotion + fractalNeckLinker + atpHydrolysis * 0.05 + cargoBinding);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 84, vSegments: 64 })
  },

  ribosome_detailed: {
    name: "🏭 Ribosome - Protein Factory (~25 nm, visualized 80000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~25 nm, two subunits (60S+40S), scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 12;
      const g = params.g ?? 0;
      const h = params.h ?? 0.18;
      const i = params.i ?? 0.14;
      const k = params.k ?? 22;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Two subunits (large 60S + small 40S in eukaryotes)
      const largeSubunit = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const smallSubunit = Math.sin(theta * 10) * Math.cos(phi * 8) * 0.16;

      // Ribosome texture
      const fractalrRNA = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const peptidylTransferase = Math.abs(Math.sin(u * 28 + v * 30) * Math.cos(u * 30 - v * 28));
      const mRNAChannel = Math.sin(phi * 18) * Math.cos(theta * 14) * 0.12;

      const radius = a * (1 + largeSubunit + smallSubunit + fractalrRNA + peptidylTransferase * 0.04 + mRNAChannel);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 88, vSegments: 68 })
  },

  proteasome: {
    name: "♻️ Proteasome - Protein Degradation Machine (~15 nm, visualized 133000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Scientific: ~15 nm, barrel-shaped with regulatory caps, scaled for visualization
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const f = params.f ?? 14;
      const g = params.g ?? 0;
      const h = params.h ?? 0.2;
      const i = params.i ?? 0.16;
      const k = params.k ?? 26;

      const theta = u * 2 * Math.PI + g;
      const phi = v * Math.PI;

      // Barrel-shaped with regulatory caps
      const catalyticCore = Math.sin(f * theta + g) * Math.cos(f * phi) * h;
      const regulatoryCap = Math.sin(theta * 7) * Math.cos(phi * 6) * 0.18;

      // Proteasome texture
      const fractalBarrel = Math.sin(theta * k) * Math.cos(phi * k) * i;
      const ubiquitinRecognition = Math.abs(Math.sin(u * 30 + v * 34) * Math.cos(u * 34 - v * 30));
      const proteolysis = Math.sin(phi * 20) * Math.cos(theta * 16) * 0.14;

      const radius = a * (1 + catalyticCore + regulatoryCap + fractalBarrel + ubiquitinRecognition * 0.04 + proteolysis);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x * b, y * b, z * c];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 60 })
  },

  dna_double_helix: {
    name: "🧬 DNA Double Helix - Animated Genetic Code (~2 nm diameter, visualized 1000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;  // Scientific: ~2 nm diameter, double-stranded helix
      const b = params.b ?? 0.9;  // Helix radius
      const c = params.c ?? 0.5;  // Helix pitch (vertical rise per turn)
      const f = params.f ?? 6;    // Number of helix turns
      const g = params.g ?? 0;    // Phase/rotation offset
      const h = params.h ?? 0.09; // Tube radius
      const i = params.i ?? 0.08;  // Iridescent texture intensity
      const k = params.k ?? 20;   // Texture detail

      // Parametric helix angle (multiple turns)
      const helixAngle = u * Math.PI * f * 2 + g;

      // Two strands with π phase offset
      const strandPhase = v < 0.5 ? 0 : Math.PI;
      const tubeAngle = (v < 0.5 ? v * 2 : (v - 0.5) * 2) * Math.PI * 2;

      // Main helix path (centerline)
      const helixX = b * Math.cos(helixAngle + strandPhase);
      const helixY = b * Math.sin(helixAngle + strandPhase);
      const helixZ = c * (helixAngle - Math.PI * f) / 2; // Centered vertically

      // Tube geometry around helix path
      const tubeOffset = h * a * (1 + i * Math.sin(helixAngle * 3) * 0.3); // Iridescent texture
      const normalX = -Math.sin(helixAngle + strandPhase);
      const normalY = Math.cos(helixAngle + strandPhase);

      const fresnel = Math.sin(tubeAngle * k + helixAngle * 3) * Math.cos(tubeAngle * k * 0.7) * i;
      const spectrum = Math.sin(helixAngle * 4 + tubeAngle * 2) * 0.03;

      const x = helixX + (normalX * Math.cos(tubeAngle) + 0) * tubeOffset * (1 + fresnel + spectrum);
      const y = helixY + (normalY * Math.cos(tubeAngle) + 0) * tubeOffset * (1 + fresnel + spectrum);
      const z = helixZ + Math.sin(tubeAngle) * tubeOffset * (1 + fresnel);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 72 })
  },

  nucleic_acid_double_helix: {
    name: "🧬 Nucleic Acid Double Helix - Complete Molecular Structure with Base Pairs (~2 nm, 1000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;   // Overall scale - Watson-Crick double helix
      const b = params.b ?? 1.0;   // Helix radius for sugar-phosphate backbone
      const c = params.c ?? 0.34;  // Scientific: 0.34 nm rise per base pair (3.4 Å)
      const f = params.f ?? 8;     // Number of helix turns (10 base pairs per turn)
      const g = params.g ?? 0;     // Phase/rotation offset
      const h = params.h ?? 0.12;  // Backbone tube radius
      const i = params.i ?? 0.15;  // Base pair connector width
      const k = params.k ?? 24;    // Molecular texture detail
      const l = params.l ?? 0.08;  // Phosphate group bumps
      const m = params.m ?? 0.6;   // Base pair length (distance between backbones)

      // Parametric helix angle (right-handed B-form DNA)
      const helixAngle = u * Math.PI * f * 2 + g;

      // Create three components: two backbones + base pairs
      const componentType = Math.floor(v * 3);
      const localV = (v * 3) % 1;

      if (componentType < 2) {
        // Sugar-phosphate backbone strands (antiparallel)
        const strandPhase = componentType === 0 ? 0 : Math.PI;
        const tubeAngle = localV * Math.PI * 2;

        // Helix path for backbone
        const helixX = b * Math.cos(helixAngle + strandPhase);
        const helixY = b * Math.sin(helixAngle + strandPhase);
        const helixZ = c * f * (helixAngle / (Math.PI * 2)) - (c * f) / 2;

        // Phosphate groups (bumpy texture)
        const phosphate = Math.sin(helixAngle * 10) * Math.cos(tubeAngle * 6) * l;
        const sugarGroove = Math.sin(helixAngle * 5 + tubeAngle * 3) * 0.04;

        // Backbone tube with molecular detail
        const tubeOffset = h * a * (1 + phosphate + sugarGroove);
        const normalX = -Math.sin(helixAngle + strandPhase);
        const normalY = Math.cos(helixAngle + strandPhase);

        const x = helixX + normalX * Math.cos(tubeAngle) * tubeOffset;
        const y = helixY + normalY * Math.cos(tubeAngle) * tubeOffset;
        const z = helixZ + Math.sin(tubeAngle) * tubeOffset;

        return [x, y, z];
      } else {
        // Base pairs (rungs connecting the two strands)
        const basePairAngle = localV * Math.PI * 2;
        const basePairPosition = (localV - 0.5) * m * b * 2; // Distance along base pair

        // Base pair centers follow helix
        const centerX = Math.cos(helixAngle);
        const centerY = Math.sin(helixAngle);
        const centerZ = c * f * (helixAngle / (Math.PI * 2)) - (c * f) / 2;

        // Base pair "rung" geometry with molecular structure
        const baseRotation = helixAngle + Math.PI / 2;
        const basePairX = basePairPosition * Math.cos(baseRotation);
        const basePairY = basePairPosition * Math.sin(baseRotation);

        // Base texture (purine-pyrimidine pairing)
        const baseTexture = Math.sin(helixAngle * k) * Math.cos(basePairAngle * 4) * i * 0.3;
        const hydrogenBonds = Math.abs(Math.sin(localV * Math.PI)) * 0.06; // H-bonds in center

        const radius = i * a * (1 + baseTexture + hydrogenBonds);

        const x = centerX * 0 + basePairX + Math.cos(basePairAngle) * radius;
        const y = centerY * 0 + basePairY + Math.sin(basePairAngle) * radius;
        const z = centerZ;

        return [x, y, z];
      }
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 72 })
  },

  liposome: {
    name: "🫧 Liposome - Phospholipid Bilayer Vesicle (~100 nm, drug delivery nanocarrier, 10000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;   // Vesicle radius (~100 nm)
      const b = params.b ?? 1.0;   // Overall scale
      const h = params.h ?? 0.06;  // Bilayer thickness (~4 nm membrane)
      const i = params.i ?? 0.08;  // Phospholipid head texture
      const k = params.k ?? 36;    // Molecular texture detail
      const l = params.l ?? 0.04;  // Membrane fluidity ripples

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Double bilayer (inner and outer leaflets)
      const layerPhase = v < 0.5 ? 0 : 1;
      const localV = (v < 0.5 ? v * 2 : (v - 0.5) * 2);
      const layerOffset = layerPhase * h * a;

      // Phospholipid head groups (bumpy texture)
      const headGroups = Math.sin(theta * k) * Math.cos(phi * k * 0.7) * i;
      const membraneRipple = Math.sin(theta * 8 + phi * 6) * l; // Fluid membrane

      const radius = a * b * (1 + layerOffset + headGroups + membraneRipple);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 144, vSegments: 72 })
  },

  fullerene_c60: {
    name: "⚛️ Fullerene C60 - Buckminsterfullerene (~0.7 nm, Nobel Prize 1996, 10000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;   // C60 radius (~0.7 nm)
      const b = params.b ?? 1.0;   // Scale
      const h = params.h ?? 0.15;  // Carbon atom bumps
      const i = params.i ?? 0.08;  // Hexagon-pentagon pattern
      const k = params.k ?? 12;    // Icosahedral symmetry (12 pentagons)

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Truncated icosahedron pattern (soccer ball)
      // 12 pentagons + 20 hexagons = 32 faces
      const pentagonPattern = Math.sin(theta * 5) * Math.cos(phi * 3) * i;
      const hexagonPattern = Math.sin(theta * 6) * Math.cos(phi * 5) * i * 0.7;

      // Carbon atom positions (60 vertices)
      const carbonAtoms = Math.sin(theta * k) * Math.cos(phi * k) * h;
      const bondPattern = Math.cos(theta * k * 1.5 + phi * 12) * 0.05;

      const radius = a * b * (1 + pentagonPattern + hexagonPattern + carbonAtoms + bondPattern);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 60 })
  },

  dendrimer: {
    name: "🌳 Dendrimer - Branched Polymer Nanostructure (~5-10 nm, generation 4, 1000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;   // Core radius
      const b = params.b ?? 0.8;   // Branch scale
      const c = params.c ?? 4;     // Generation number (branching levels)
      const h = params.h ?? 0.2;   // Branch thickness
      const i = params.i ?? 0.12;  // Terminal group density
      const k = params.k ?? 8;     // Branching symmetry

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Fractal branching pattern (generation-based)
      let branchPattern = 0;
      for (let gen = 1; gen <= c; gen++) {
        const genFreq = Math.pow(2, gen); // Exponential branching
        branchPattern += Math.sin(theta * genFreq * k) * Math.cos(phi * genFreq * 0.7) * (h / gen);
      }

      // Terminal functional groups on surface
      const terminalGroups = Math.sin(theta * k * 4) * Math.cos(phi * k * 3) * i;
      const dendriticArms = Math.abs(Math.sin(theta * 3 + phi * 4)) * 0.15;

      const radius = a * b * (1 + branchPattern + terminalGroups + dendriticArms);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 50 })
  },

  carbon_nanotube: {
    name: "⚫ Carbon Nanotube - Rolled Graphene Cylinder (~1-2 nm diameter, 1000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;   // Tube radius (~1 nm)
      const b = params.b ?? 3.0;   // Tube length
      const c = params.c ?? 0.142; // C-C bond length (0.142 nm)
      const h = params.h ?? 0.08;  // Carbon atom bumps
      const k = params.k ?? 18;    // Chirality (n,m) hexagonal pattern
      const l = params.l ?? 0.05;  // sp2 hybridization texture

      const theta = u * 2 * Math.PI;
      const z = (v - 0.5) * b * 2;

      // Hexagonal graphene lattice (rolled)
      const hexPattern = Math.sin(theta * k) * Math.cos(z * 8) * h;
      const bondPattern = Math.cos(theta * k * 1.5 + z * 12) * l;

      // Carbon atom positions (sp2 hybridized)
      const carbonAtoms = Math.sin(theta * k * 2) * Math.sin(z * 10) * 0.06;
      const piElectrons = Math.cos(theta * k * 3) * 0.04; // Conjugated system

      const radius = a * (1 + hexPattern + bondPattern + carbonAtoms + piElectrons);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 80 })
  },

  graphene_sheet: {
    name: "◼️ Graphene - Single-Layer Hexagonal Carbon Lattice (~0.34 nm thick, 10000000x scale)",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;   // Sheet size
      const b = params.b ?? 3.0;   // Sheet width
      const c = params.c ?? 0.142; // C-C bond length (1.42 Å)
      const h = params.h ?? 0.12;  // Carbon atom height
      const i = params.i ?? 0.08;  // Hexagonal pattern depth
      const k = params.k ?? 12;    // Lattice frequency

      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * b * 2;

      // Perfect hexagonal lattice (honeycomb)
      const hexLatticeX = Math.sin(x * k) * Math.cos(y * k * Math.sqrt(3) / 2);
      const hexLatticeY = Math.cos(x * k * Math.sqrt(3) / 2) * Math.sin(y * k);
      const hexPattern = (hexLatticeX + hexLatticeY) * i;

      // Carbon atom positions (sp2 hybridized)
      const carbonBumps = Math.sin(x * k * 2) * Math.cos(y * k * 2) * h;
      const piOrbital = Math.cos(x * k + y * k) * 0.05; // π-electron cloud

      // Slight ripple (graphene isn't perfectly flat)
      const ripple = Math.sin(x * 2) * Math.cos(y * 2) * 0.1;

      const z = hexPattern + carbonBumps + piOrbital + ripple;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 120 })
  },

  // ============================================================================
  // ATOMIC & MOLECULAR ORBITALS - Quantum Chemistry Visualization
  // ============================================================================

  hydrogen_1s_orbital: {
    name: "⚛️ Hydrogen 1s Orbital - Spherical Electron Cloud",
    equation: (u, v, params) => {
      const a0 = params.a ?? 1.5;  // Bohr radius scale
      const theta = v * Math.PI;    // Polar angle [0,π]
      const phi = u * 2 * Math.PI;  // Azimuthal angle [0,2π]

      // Radial distance (u maps to radius for visualization)
      const rMax = a0 * 4;  // Show up to 4 Bohr radii
      const r = u * rMax;

      // 1s wavefunction: ψ₁ₛ(r) = (1/√π) * (1/a₀)^(3/2) * e^(-r/a₀)
      const psi = Math.exp(-r / a0);
      const probability = psi * psi;  // |ψ|² probability density

      // Geometric displacement: radius modulated by probability
      const geometricRadius = r + probability * a0 * 2;

      const sinTheta = Math.sin(theta);
      return [
        geometricRadius * sinTheta * Math.cos(phi),
        geometricRadius * sinTheta * Math.sin(phi),
        geometricRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64, a: 1.5 })
  },

  hydrogen_2p_orbital: {
    name: "⚛️ Hydrogen 2p Orbital - Dumbbell Electron Cloud",
    equation: (u, v, params) => {
      const a0 = params.a ?? 1.8;  // Bohr radius scale
      const theta = v * Math.PI;    // Polar angle [0,π]
      const phi = u * 2 * Math.PI;  // Azimuthal angle [0,2π]

      // Radial distance
      const rMax = a0 * 8;  // 2p extends further
      const r = u * rMax;

      // 2p_z wavefunction: ψ₂p(r,θ) ∝ r * e^(-r/2a₀) * cos(θ)
      const radialPart = r * Math.exp(-r / (2 * a0));
      const angularPart = Math.cos(theta);  // p_z orientation (creates lobes)

      const psi = radialPart * angularPart;
      const probability = psi * psi;  // |ψ|²

      // DUMBBELL geometry: sign changes create two lobes
      const sign = angularPart >= 0 ? 1 : -1;
      const geometricRadius = r + sign * Math.sqrt(probability) * a0 * 3;

      const sinTheta = Math.sin(theta);
      return [
        geometricRadius * sinTheta * Math.cos(phi),
        geometricRadius * sinTheta * Math.sin(phi),
        geometricRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 64, a: 1.8 })
  },

  hydrogen_3d_orbital: {
    name: "⚛️ Hydrogen 3d Orbital - Cloverleaf Electron Cloud",
    equation: (u, v, params) => {
      const a0 = params.a ?? 2.0;  // Bohr radius scale
      const theta = v * Math.PI;    // Polar angle [0,π]
      const phi = u * 2 * Math.PI;  // Azimuthal angle [0,2π]

      // Radial distance
      const rMax = a0 * 12;  // 3d extends even further
      const r = u * rMax;

      // 3d_z² wavefunction: ψ₃d(r,θ) ∝ r² * e^(-r/3a₀) * (3cos²θ - 1)
      const radialPart = r * r * Math.exp(-r / (3 * a0));
      const angularPart = 3 * Math.pow(Math.cos(theta), 2) - 1;  // Creates 4 lobes

      const psi = radialPart * angularPart;
      const probability = psi * psi;  // |ψ|²

      // CLOVERLEAF geometry with proper nodal structure
      const sign = angularPart >= 0 ? 1 : -1;
      const geometricRadius = r + sign * Math.sqrt(probability) * a0 * 2;

      const sinTheta = Math.sin(theta);
      return [
        geometricRadius * sinTheta * Math.cos(phi),
        geometricRadius * sinTheta * Math.sin(phi),
        geometricRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72, a: 2.0 })
  },

  quantum_atom_complete: {
    name: "⚛️ Complete Atom - Quantum Wave Pattern (Ψ_atom)",
    equation: (u, v, params) => {
      const nucleusSize = params.a ?? 0.15;      // Dense nucleus cluster
      const cloudRadius = params.b ?? 2.5;       // Electron probability cloud extent
      const vacuumField = params.c ?? 0.3;       // Active vacuum energy field
      const energyLevel = params.d ?? 1;         // Quantum number n (1,2,3...)
      const electronCount = params.e ?? 1;       // Number of electrons
      const waveFreq = params.f ?? 4;            // Wave pattern frequency
      const quantumPhase = params.g ?? 0;        // Quantum phase offset

      const theta = v * Math.PI;                 // Polar angle
      const phi = u * 2 * Math.PI;               // Azimuthal angle

      // Layer selection: 0=nucleus, 1=electron clouds, 2=vacuum field
      const layer = Math.floor(u * 3) % 3;
      const localU = (u * 3) % 1;

      let x = 0, y = 0, z = 0;

      if (layer === 0) {
        // NUCLEUS: Dense quark cluster (protons + neutrons)
        // Represents strong force binding quarks together
        const nucleusTheta = localU * 2 * Math.PI;
        const nucleusPhi = v * Math.PI;

        // Quark clustering pattern (3 quarks per nucleon)
        const quarkModulation = 1 + 0.15 * Math.sin(nucleusTheta * 3) * Math.sin(nucleusPhi * 3);
        const r = nucleusSize * quarkModulation;

        const sinPhi = Math.sin(nucleusPhi);
        const cosPhi = Math.cos(nucleusPhi);

        x = r * sinPhi * Math.cos(nucleusTheta);
        y = r * sinPhi * Math.sin(nucleusTheta);
        z = r * cosPhi;

      } else if (layer === 1) {
        // ELECTRON PROBABILITY CLOUDS: Standing-wave excitations
        // Multiple shells for multi-electron atoms
        const r = localU * cloudRadius * energyLevel;

        // Quantum wavefunction Ψ(r,θ,φ) - radial + angular parts
        const bohrRadius = cloudRadius / (2.5 * energyLevel);
        const radialWave = Math.exp(-r / bohrRadius) * Math.pow(r / bohrRadius, energyLevel - 1);

        // Angular momentum creates orbital shapes (s, p, d orbitals)
        const angularWave = Math.sin(theta * electronCount) * Math.cos(phi * electronCount + quantumPhase);

        // Combined wavefunction Ψ(r,θ,φ)
        const psi = radialWave * angularWave;
        const probability = psi * psi;  // |ψ|² probability density

        // Probability cloud geometry (fuzzy sphere, not solid orbit)
        const cloudModulation = 1 + probability * 0.8;
        const cloudR = r * cloudModulation;

        const sinTheta = Math.sin(theta);
        x = cloudR * sinTheta * Math.cos(phi);
        y = cloudR * sinTheta * Math.sin(phi);
        z = cloudR * Math.cos(theta);

        // Wave-like vibration pattern
        const waveEffect = vacuumField * 0.2 * Math.sin(waveFreq * (r + quantumPhase));
        x += waveEffect * Math.cos(phi);
        y += waveEffect * Math.sin(phi);

      } else {
        // VACUUM ENERGY FIELD: Active quantum foam (not empty space!)
        // Zero-point energy fluctuations, virtual particles
        const fieldR = cloudRadius * 1.3 + localU * vacuumField;

        // Quantum field fluctuations
        const fieldPerturbation = vacuumField * 0.25 * (
          Math.sin(waveFreq * theta + quantumPhase) * 
          Math.cos(waveFreq * phi) +
          Math.sin(waveFreq * localU * Math.PI * 2) * 0.3
        );

        const effectiveR = fieldR + fieldPerturbation;

        const sinTheta = Math.sin(theta);
        x = effectiveR * sinTheta * Math.cos(phi);
        y = effectiveR * sinTheta * Math.sin(phi);
        z = effectiveR * Math.cos(theta);
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uSegments: 120, 
      vSegments: 90, 
      a: 0.15,   // nucleus size
      b: 2.5,    // cloud radius
      c: 0.3,    // vacuum field
      d: 1,      // energy level
      e: 1,      // electrons
      f: 4,      // wave frequency
      g: 0       // quantum phase
    })
  },

  // ============================================================================
  // CHAOS THEORY - Additional Lorenz Variations
  // Note: Main lorenz_attractor is in chaosTheoryShapes.ts
  // ============================================================================

  lorenz_butterfly_surface: {
    name: "🦋 Lorenz Butterfly Surface - Phase Space Manifold",
    equation: (u, v, params) => {
      const sigma = params.a ?? 10;
      const rho = params.b ?? 28;
      const beta = params.c ?? 2.667;
      const scale = params.d ?? 0.06;

      // Multiple trajectories with different initial conditions
      // v parameter selects which trajectory/initial condition
      const trajectoryOffset = (v - 0.5) * 0.02;

      const totalSteps = 12000;
      const dt = 0.005;

      // Slightly different initial conditions create the "surface" effect
      let x = 0.1 + trajectoryOffset;
      let y = 0.0 + trajectoryOffset * 0.5;
      let z = 0.0;

      const targetStep = Math.floor(u * totalSteps);

      for (let i = 0; i < targetStep; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;

        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }

      const zCentered = z - (rho - 1);

      return [x * scale, y * scale, zCentered * scale];
    },
    defaultParams: getCleanDefaults({
      a: 10, b: 28, c: 2.667, d: 0.06,
      uSegments: 128, vSegments: 16
    })
  },

  // ============================================================================
  // WAVE SHAPES - Fundamental Wave Equations
  // ============================================================================

  electromagnetic_wave: {
    name: "⚡ Electromagnetic Wave - Spherical Dipole Radiation E(r,θ,t)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;  // Base radius
      const b = params.b ?? 0.6;  // Radiation amplitude
      const c = params.c ?? 4.0;  // Frequency
      const d = params.d ?? 0.5;  // Phase offset
      const e = params.e ?? 3.0;  // Number of radiation lobes

      const theta = u * 2 * Math.PI;  // Azimuthal angle
      const phi = v * Math.PI;        // Polar angle

      // Spherical dipole radiation pattern
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Radial energy distribution (inverse square law)
      const radialDecay = 1 / (1 + u * 2);

      // Dipole radiation intensity: I ∝ sin²(θ)
      const dipolePattern = Math.pow(Math.sin(phi), 2);

      // Oscillating radiation field with angular dependence
      const radiationField = b * Math.sin(c * u - d) * dipolePattern * radialDecay;

      // Multi-lobe pattern (E-field nodes and antinodes)
      const lobePattern = Math.abs(Math.sin(e * phi));

      // VOLUMETRIC RADIAL OSCILLATION - energy as geometric depth
      const r = a + radiationField * lobePattern;

      return [
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 8.554, b: 4.234, c: 5.703, d: 0.5, e: 3.0,
      uSegments: 96, vSegments: 72 
    })
  },

  sound_wave: {
    name: "🔊 Sound Wave - Spherical Pressure Wave from Point Source p(r,t)",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;  // Base radius
      const b = params.b ?? 0.7;  // Pressure amplitude
      const c = params.c ?? 6.0;  // Frequency (wavelength count)
      const d = params.d ?? 0.25; // Damping coefficient

      const theta = u * 2 * Math.PI;  // Azimuthal angle
      const phi = v * Math.PI;        // Polar angle

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Radial distance factor (0 to 1)
      const radialFactor = (u + v) * 0.5;

      // Spherical wave attenuation (1/r falloff)
      const attenuation = 1 / (1 + radialFactor * 3);

      // Pressure oscillations (compression/rarefaction zones)
      const pressure = b * Math.sin(c * radialFactor * Math.PI * 2) * attenuation;

      // Omnidirectional radiation (slight angular variation for realism)
      const directivity = 1 + 0.1 * Math.cos(3 * theta) * Math.sin(2 * phi);

      // VOLUMETRIC RADIAL PRESSURE - energy as geometric depth
      const r = a + pressure * directivity;

      return [
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 0.7, c: 6.0, d: 0.25,
      uSegments: 96, vSegments: 72 
    })
  },

  brain_wave: {
    name: "🧠 Brain Wave - Layered Cortical Shells (Delta/Theta/Alpha/Beta)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;  // Base radius
      const b = params.b ?? 0.15; // Wave amplitude
      const c = params.c ?? 2.0;  // Delta (0.5-4 Hz) - deepest layer
      const d = params.d ?? 6.0;  // Theta (4-8 Hz)
      const e = params.e ?? 10.0; // Alpha (8-13 Hz)
      const f = params.f ?? 20.0; // Beta (13-30 Hz) - outermost layer

      const theta = u * 2 * Math.PI;  // Azimuthal angle
      const phi = v * Math.PI;        // Polar angle

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Layered shell structure (cortical layers)
      const shellFactor = v; // 0 = inner, 1 = outer

      // Multi-frequency brain waves at different cortical depths
      const delta = b * 1.0 * Math.sin(c * theta) * (1 - shellFactor); // Deep
      const thetaWave = b * 0.8 * Math.sin(d * theta + phi) * (1 - Math.abs(shellFactor - 0.33) * 3);
      const alpha = b * 0.6 * Math.sin(e * theta + phi * 1.5) * (1 - Math.abs(shellFactor - 0.66) * 3);
      const beta = b * 0.4 * Math.sin(f * theta + phi * 2) * shellFactor; // Superficial

      // Combine cortical activity (LAYERED SHELLS)
      const corticalActivity = delta + thetaWave + alpha + beta;

      // Angular modulation (different brain regions)
      const regionalActivity = Math.sin(4 * phi) * Math.cos(3 * theta);

      // VOLUMETRIC LAYERED STRUCTURE - energy as geometric depth in shells
      const r = a * (1 + shellFactor * 0.4) + corticalActivity + regionalActivity * b * 0.3;

      return [
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, b: 0.15, c: 2.0, d: 6.0, e: 10.0, f: 20.0,
      uSegments: 120, vSegments: 90 
    })
  },

  seismic_wave: {
    name: "🌍 Seismic Wave - P-Wave and S-Wave Propagation",
    equation: (u, v, params) => {
      const a = params.a ?? 3.5;  // Wave propagation distance
      const b = params.b ?? 1.0;  // P-wave amplitude (primary)
      const c = params.c ?? 0.7;  // S-wave amplitude (secondary)
      const d = params.d ?? 8.0;  // P-wave velocity factor
      const e = params.e ?? 5.0;  // S-wave velocity factor

      const x = (u - 0.5) * a * 3;
      const y = (v - 0.5) * a * 3;
      const radius = Math.sqrt(x * x + y * y);  // RADIAL propagation from epicenter

      // P-wave (compressional): faster velocity, arrives first
      const pWave = b * Math.sin(d * radius - u * 8 * Math.PI) * Math.exp(-radius * 0.2);

      // S-wave (shear): slower velocity, arrives after P-wave
      const sWave = c * Math.sin(e * radius - v * 6 * Math.PI) * Math.exp(-radius * 0.25);

      // Rayleigh surface wave (ground roll)
      const rayleigh = 0.4 * Math.exp(-radius * 0.3) * Math.sin(4 * radius - u * 5 * Math.PI);

      const z = pWave + sWave + rayleigh;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 3.5, b: 1.0, c: 0.7, d: 8.0, e: 5.0,
      uSegments: 100, vSegments: 100 
    })
  },

  ocean_wave: {
    name: "🌊 Ocean Wave - Spherical Ripple from Droplet Impact",
    equation: (u, v, params) => {
      const a = params.a ?? 2.2;  // Base radius (droplet size)
      const b = params.b ?? 0.5;  // Wave amplitude
      const c = params.c ?? 8.0;  // Ripple frequency (number of waves)
      const d = params.d ?? 0.25; // Damping coefficient
      const e = params.e ?? 0.3;  // Crown splash height

      const theta = u * 2 * Math.PI;  // Azimuthal angle
      const phi = v * Math.PI;        // Polar angle

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      // Angular distance from impact point (top)
      const angularDist = phi;

      // Ripple waves radiating outward from impact
      const ripples = b * Math.sin(c * angularDist - theta * 2) * Math.exp(-d * angularDist * 3);

      // Crown splash (vertical jets at impact point)
      const crownSplash = phi < Math.PI * 0.2 ? 
        e * Math.abs(Math.sin(6 * theta)) * (1 - phi / (Math.PI * 0.2)) : 0;

      // Surface tension oscillations (capillary waves)
      const capillary = 0.08 * Math.sin(15 * theta) * Math.sin(12 * phi) * Math.exp(-angularDist * 2);

      // VOLUMETRIC SURFACE DEFORMATION - energy as geometric depth
      const r = a + ripples + crownSplash + capillary;

      return [
        r * sinPhi * Math.cos(theta),
        r * sinPhi * Math.sin(theta),
        r * cosPhi
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.2, b: 0.5, c: 8.0, d: 0.25, e: 0.3,
      uSegments: 120, vSegments: 90 
    })
  },

  gravitational_wave: {
    name: "🌌 Gravitational Wave - Einstein's h(t) = h₀ sin(2πft) Strain",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;  // Spacetime extent
      const b = params.b ?? 0.15; // Plus polarization amplitude
      const c = params.c ?? 0.15; // Cross polarization amplitude
      const d = params.d ?? 2.0;  // Frequency
      const e = params.e ?? 0.5;  // Phase difference

      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const t = u;  // Internal scaling: u [0,1] serves as time parameter

      // Plus polarization h₊(t) and Cross polarization h×(t)
      const hPlus = b * Math.cos(d * Math.PI * t);
      const hCross = c * Math.sin(d * Math.PI * t + e);

      // Spacetime distortion (extremely small in reality ~10⁻²¹)
      const strainX = x * (1 + hPlus);
      const strainY = y * (1 + hCross);
      const z = 0.2 * Math.sin(d * Math.PI * t) * Math.exp(-(x * x + y * y) * 0.1);

      return [strainX, strainY, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 5.0, b: 0.15, c: 0.15, d: 2.0, e: 0.5,
      uSegments: 100, vSegments: 100 
    })
  },

  cardiac_wave: {
    name: "❤️ Cardiac Wave - ECG Waveform P-QRS-T Action Potential",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;  // Time scale (heartbeat cycle)
      const b = params.b ?? 0.5;  // P-wave amplitude (atrial)
      const c = params.c ?? 1.5;  // QRS amplitude (ventricular)
      const d = params.d ?? 0.7;  // T-wave amplitude (repolarization)
      const e = params.e ?? 70.0; // Heart rate (bpm)

      const x = (u - 0.5) * a * 2;  // TIME along X-axis (internal scaling: u [0,1] → x scaled)
      const y = (v - 0.5) * 2;      // ECG LEADS (internal scaling: v [0,1] → y [-1,1])

      // P wave (atrial depolarization) - Gaussian
      const pWave = b * Math.exp(-Math.pow((x - 0.5), 2) / 0.02);

      // QRS complex (ventricular depolarization) - Sharp spike PROMINENT
      const qrsWave = c * Math.exp(-Math.pow((x + 0.5), 2) / 0.005);

      // T wave (ventricular repolarization) - Broad Gaussian
      const tWave = d * Math.exp(-Math.pow((x - 2.0), 2) / 0.05);

      // DISTINCTIVE ECG TRACE (flat layout like medical monitor)
      const ecg = pWave + qrsWave + tWave;
      const z = ecg + y * 0.1;  // Slight offset per lead

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 4.0, b: 0.5, c: 1.5, d: 0.7, e: 70.0,
      uSegments: 150, vSegments: 24 
    })
  },

  quantum_wave: {
    name: "⚛️ Quantum Wave - Schrödinger Ψ(x,t) Probability Density",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Spatial extent
      const b = params.b ?? 1.0;  // Amplitude
      const c = params.c ?? 3.0;  // Quantum number n
      const d = params.d ?? 5.0;  // Frequency
      const e = params.e ?? 0.8;  // Uncertainty width

      const x = (u - 0.5) * a * 4;
      const theta = v * 2 * Math.PI;  // Internal scaling: v [0,1] → theta [0,2π]

      // Free particle wave function Ψ(x,t) = A exp[i(kx - ωt)]
      const a_safe = Math.max(1e-6, Math.abs(a)); // Prevent division by zero
      const k = c * Math.PI / a_safe;
      const omega = d;

      // WAVE PACKET with Gaussian envelope (Heisenberg uncertainty)
      // Prevent division by zero
      const e_safe = Math.max(1e-6, Math.abs(e));
      const envelope = Math.exp(-(x * x) / (2 * e_safe * e_safe));
      const phase = k * x - omega * v;

      // PROBABILITY CLOUD visualization (spherical shells)
      const probability = envelope * Math.cos(phase);
      const radius = 0.5 + b * probability * 0.8;

      const y = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 3.0, b: 1.0, c: 3.0, d: 5.0, e: 0.8,
      uSegments: 120, vSegments: 50 
    })
  },

  atmospheric_wave: {
    name: "🌥️ Atmospheric Wave - Rossby & Gravity Waves",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;  // Spatial scale
      const b = params.b ?? 0.8;  // Wave amplitude
      const c = params.c ?? 0.3;  // Vertical scale height
      const d = params.d ?? 2.0;  // Rossby wave frequency
      const e = params.e ?? 4.0;  // Gravity wave frequency

      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const t1 = u * 2 * Math.PI;  // Internal scaling: u [0,1] → t1 [0,2π]
      const t2 = v * 3 * Math.PI;  // Internal scaling: v [0,1] → t2 [0,3π]

      // Rossby wave (large-scale planetary waves)
      const rossbyWave = b * Math.cos(d * x - t1);

      // Gravity wave (vertical oscillations)
      const gravityWave = b * 0.5 * Math.sin(e * (x + y) - t2);

      // Vertical structure with scale height
      // Prevent division by zero and clamp exponent to prevent overflow
      const scaleHeight = Math.max(1e-6, a * c);
      const exponent = Math.min(100, Math.max(-100, y / scaleHeight));
      const verticalStructure = Math.exp(exponent);

      const z = (rossbyWave + gravityWave) * verticalStructure;

      // Safety check for NaN/Infinity
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 5.0, b: 0.8, c: 0.3, d: 2.0, e: 4.0,
      uSegments: 100, vSegments: 100 
    })
  },

  circadian_wave: {
    name: "⏰ Circadian Wave - 24-Hour Biological Rhythm R(t) = R₀ + A cos(2πt/τ + φ)",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;  // Time scale (24 hours)
      const b = params.b ?? 1.0;  // Rhythm amplitude
      const c = params.c ?? 0.5;  // Melatonin peak factor
      const d = params.d ?? 0.7;  // Cortisol peak factor
      const e = params.e ?? 1.0;  // Coupling strength

      const angle = u * 2 * Math.PI;  // Internal scaling: u [0,1] → angle [0,2π] (24-hour clock face)
      const radius_base = 2.0;
      const radial_depth = v * 1.5;  // Internal scaling: v [0,1] → depth [0,1.5]

      // Core circadian oscillation: R(t) = R_mean + R_amplitude cos(2πt/τ + φ)
      const phase = -Math.PI / 3; // Peak ~2-4 AM
      const circadianRhythm = b * Math.cos(angle + phase);

      // Melatonin rhythm (peaks at NIGHT - top of circle)
      const melatonin = c * Math.cos(angle + phase) * (1 - v);

      // Cortisol rhythm (peaks MORNING - opposite)
      const cortisol = d * Math.cos(angle + phase + Math.PI) * (1 - v);

      // CLOCK FACE display showing 24-hour cycle
      const totalRhythm = circadianRhythm + melatonin * 0.5 + cortisol * 0.5;
      const radius = radius_base + totalRhythm * 0.6;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = radial_depth + totalRhythm * v * 0.3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 4.0, b: 1.0, c: 0.5, d: 0.7, e: 1.0,
      uSegments: 120, vSegments: 40 
    })
  },

  // ============================================================================
  // FRACTAL TIME & QUANTUM PHYSICS - Theoretical Visualization
  // Based on: Quantum-Enhanced Materials Simulation & Fractal Time Theory
  // ============================================================================

  fractal_time_spiral: {
    name: "🌀 Fractal Time Spiral - Recursive Temporal Dimensions",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const phi = 1.618033988749895;
      const feigenbaum = 4.669;
      const pi = Math.PI;

      const theta = u * pi * 2 * feigenbaum;
      const radius = a * (1 + phi * u);
      const fractal_scale = Math.sin(u * feigenbaum * pi) * b * 0.5;

      const x = radius * Math.cos(theta) + fractal_scale * Math.cos(v * pi * 2);
      const y = radius * Math.sin(theta) + fractal_scale * Math.sin(v * pi * 2);
      const z = c * u * feigenbaum + Math.sin(theta / phi) * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 120, vSegments: 48 
    })
  },

  quantum_entanglement_field: {
    name: "⚛️ Quantum Entanglement Field - Fine Structure Constant",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const alpha = 0.007297352569;
      const phi = 1.618033988749895;
      const pi = Math.PI;

      const wave1 = Math.sin(u * pi * 2 / alpha) * a;
      const wave2 = Math.cos(v * pi * 2 / alpha) * b;
      const entangle = Math.sin((u + v) * pi * phi) * c * 0.5;

      const x = wave1 * Math.cos(v * pi * 2);
      const y = wave2 * Math.sin(u * pi * 2);
      const z = entangle + Math.sin(u * v * pi * 10) * alpha * 10;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 72 
    })
  },

  higher_dimensional_projection: {
    name: "🔮 11D M-Theory Projection - Higher Dimensions to 3D",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const pi = Math.PI;
      const e = 2.718281828459045;

      const theta = u * pi * 2;
      const phi = v * pi;

      const dim_fold = Math.pow(Math.sin(u * 11 * pi), 2);
      const projection = Math.exp(-v * e) * a;

      const x = projection * Math.sin(phi) * Math.cos(theta) * (1 + dim_fold * 0.3);
      const y = projection * Math.sin(phi) * Math.sin(theta) * (1 + dim_fold * 0.3);
      const z = projection * Math.cos(phi) * b + Math.sin(u * v * pi * 11) * c * 0.2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 110, vSegments: 55 
    })
  },

  dark_matter_interaction: {
    name: "🌑 Dark Matter Interaction Pattern - Quantum Anomalies",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const gamma = 0.577215664901533;
      const pi = Math.PI;

      const anomaly = Math.sin(u * pi * 7) * Math.cos(v * pi * 5);
      const interaction = Math.exp(-Math.pow(u - 0.5, 2) - Math.pow(v - 0.5, 2)) * a;

      const x = (u - 0.5) * a * 4 + anomaly * 0.3;
      const y = (v - 0.5) * b * 4 + Math.sin(u * v * pi * 10) * 0.3;
      const z = interaction * c * 2 + Math.cos((u + v) * pi * gamma * 10) * 0.4;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 60 
    })
  },

  cosmic_fractal_expansion: {
    name: "🌌 Cosmic Fractal Expansion - Dark Energy Scaling",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const mandelbrot = 1.2619;
      const phi = 1.618033988749895;
      const pi = Math.PI;

      const expansion = Math.pow(u, mandelbrot) * a;
      const fractal = Math.sin(v * pi * 2 * phi) * b * 0.5;

      const theta = u * pi * 2;
      const radius = expansion * (1 + Math.sin(v * pi * mandelbrot) * 0.3);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = fractal * c + u * Math.cos(theta / phi) * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 100, vSegments: 50 
    })
  },

  planck_scale_quantum: {
    name: "🔬 Planck Scale Quantum Field - Ultra-Precision Constants",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;

      const zeta2 = 1.644934066848226;
      const theta_q = 1.233700550136170;
      const pi = Math.PI;

      const planck_wave = Math.sin(u * pi * 2 * theta_q) * a;
      const quantum_field = Math.cos(v * pi * 2 * zeta2) * b;

      const x = planck_wave * Math.cos(v * pi * 2);
      const y = quantum_field * Math.sin(u * pi * 2);
      const z = Math.sin(u * v * pi * zeta2 * 4) * c + Math.cos(u * theta_q * pi) * 0.3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 72 
    })
  },

  // ============================================================================
  // DIAMOND CUTS - Professional Gemstone Faceting Geometries
  // ============================================================================

  diamond_round_brilliant: {
    name: "💎 Round Brilliant Cut - 58 Facets",
    equation: (u, v, params) => {
      const a = params.a ?? 1;  // Diameter scale
      const b = params.b ?? 1;  // Height scale
      const c = params.c ?? 1;  // Depth multiplier

      const tableSize = 0.55;  // Table size = 55% of diameter
      const crownHeight = 0.16; // Crown height = 16% of diameter
      const pavilionDepth = 0.43; // Pavilion depth = 43% of diameter
      const crownAngle = 34.5 * Math.PI / 180; // 34.5 degrees
      const pavilionAngle = 40.75 * Math.PI / 180; // 40.75 degrees

      const theta = u * Math.PI * 2; // Full rotation
      const radius = a * Math.sin(v * Math.PI); // Spherical base

      // Create double cone structure (crown + pavilion)
      let z;
      if (v < 0.5) {
        // Crown (upper cone) with 34.5° angle
        const normalizedV = v * 2; // 0 to 1 for crown
        z = b * crownHeight * (1 - normalizedV) * Math.cos(crownAngle);
      } else {
        // Pavilion (lower cone) with 40.75° angle
        const normalizedV = (v - 0.5) * 2; // 0 to 1 for pavilion
        z = -b * pavilionDepth * normalizedV * Math.cos(pavilionAngle) * c;
      }

      // Apply table truncation
      const tableRadius = tableSize * a;
      const r = radius * (1 - Math.abs(v - 0.5) * 0.3);

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  diamond_princess: {
    name: "💎 Princess Cut - Square Brilliant",
    equation: (u, v, params) => {
      const a = params.a ?? 1;  // Size scale
      const b = params.b ?? 1;  // Height scale
      const c = params.c ?? 1;  // Depth scale

      const pavilionAngle = 41 * Math.PI / 180; // 41 degrees
      const crownAngle = 34 * Math.PI / 180; // 34 degrees

      // Square base with D4h symmetry (4-fold rotational symmetry)
      const x = a * (u - 0.5);
      const y = a * (v - 0.5);

      // Pyramid geometry with truncated top (table)
      const distFromCenter = Math.max(Math.abs(x), Math.abs(y));

      let z;
      if (distFromCenter < 0.3 * a) {
        // Table (flat top)
        z = b * 0.2;
      } else if (distFromCenter < 0.5 * a) {
        // Crown slope
        const slope = (distFromCenter - 0.3 * a) / (0.2 * a);
        z = b * 0.2 - slope * b * 0.2 * Math.tan(crownAngle);
      } else {
        // Pavilion slope
        const slope = (distFromCenter - 0.5 * a) / (0.5 * a);
        z = -slope * b * c * Math.tan(pavilionAngle);
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48 
    })
  },

  diamond_emerald: {
    name: "💎 Emerald Cut - Rectangular Step Cut",
    equation: (u, v, params) => {
      const a = params.a ?? 1.35;  // Length (1.30-1.40 ratio)
      const b = params.b ?? 1;     // Width
      const c = params.c ?? 1;     // Depth scale

      const x = a * (u - 0.5);
      const y = b * (v - 0.5);

      // Step-cut terraces (parallel planes)
      const numSteps = 8;
      const stepIndex = Math.floor(Math.abs(x / a) * numSteps);
      const stepDepth = 0.05;

      const z = -stepIndex * stepDepth * c;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.35, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48 
    })
  },

  diamond_oval: {
    name: "💎 Oval Cut - Elliptical Brilliant",
    equation: (u, v, params) => {
      const a = params.a ?? 1.3;  // Semi-major axis
      const b = params.b ?? 1;    // Semi-minor axis
      const c = params.c ?? 1;    // Depth scale

      const crownAngle = 34.5 * Math.PI / 180;
      const pavilionAngle = 40.75 * Math.PI / 180;

      const theta = u * Math.PI * 2;

      // Elliptical transformation
      const x = a * Math.cos(theta) * Math.sin(v * Math.PI);
      const y = b * Math.sin(theta) * Math.sin(v * Math.PI);

      // Apply brilliant cut angles
      let z;
      if (v < 0.5) {
        z = 0.2 * (1 - v * 2) * Math.cos(crownAngle);
      } else {
        z = -0.4 * ((v - 0.5) * 2) * Math.cos(pavilionAngle) * c;
      }

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.3, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  diamond_marquise: {
    name: "💎 Marquise Cut - Football Shape",
    equation: (u, v, params) => {
      const a = params.a ?? 2;    // Length (elongated)
      const b = params.b ?? 1;    // Width
      const c = params.c ?? 1;    // Depth scale

      const theta = u * Math.PI * 2;

      // Double-pointed ellipse (bicone geometry)
      const radius = Math.sin(v * Math.PI);
      const pointSharpness = Math.pow(Math.abs(Math.cos(theta)), 0.5);

      const x = a * Math.cos(theta) * radius * pointSharpness;
      const y = b * Math.sin(theta) * radius;

      // Brilliant cut depth
      const z = (v < 0.5) ? 
        0.2 * (1 - v * 2) : 
        -0.4 * ((v - 0.5) * 2) * c;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  diamond_pear: {
    name: "💎 Pear Cut - Teardrop Shape",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;  // Length
      const b = params.b ?? 1;    // Width
      const c = params.c ?? 1;    // Depth scale

      const t = u * Math.PI * 2;

      // Pear shape: rounded end + pointed end (Bézier blend)
      const radius = Math.sin(v * Math.PI);
      const pearFactor = (1 - Math.cos(t)) * 0.5; // 0 at pointed end, 1 at round end

      const x = a * Math.cos(t) * radius * (0.5 + 0.5 * pearFactor);
      const y = b * (Math.sin(t) - 0.3) * radius;

      // Brilliant cut depth
      const z = (v < 0.5) ? 
        0.2 * (1 - v * 2) : 
        -0.4 * ((v - 0.5) * 2) * c;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.5, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32 
    })
  },

  diamond_heart: {
    name: "💎 Heart Cut - Romantic Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 1;    // Size scale
      const b = params.b ?? 1.3;  // Height scale
      const c = params.c ?? 1;    // Depth scale

      const t = u * Math.PI * 2 - Math.PI; // Center at top

      // Parametric heart curve: x = sin³(t), y = cos(t) - c*cos(2t)
      const radius = Math.sin(v * Math.PI);
      const x = a * Math.pow(Math.sin(t), 3) * radius;
      const y= b * (Math.cos(t) - 0.4 * Math.cos(2 * t)) * radius;

      // Add V-notch at top
      const notchDepth = (t > -Math.PI/4 && t < Math.PI/4) ? 
        0.2 * Math.cos(t * 2) : 0;

      // Brilliant cut depth
      const z = (v < 0.5) ? 
        0.15 * (1 - v * 2) - notchDepth : 
        -0.3 * ((v - 0.5) * 2) * c;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 1.3, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 40 
    })
  },

  diamond_asscher: {
    name: "💎 Asscher Cut - Square Emerald with Step Terraces",
    equation: (u, v, params) => {
      const a = params.a ?? 1;  // Size scale
      const b = params.b ?? 1;  // Size scale (square)
      const c = params.c ?? 1;  // Depth scale

      // Square coordinates with 4-fold rotational symmetry
      const x = a * (u - 0.5);
      const y = b * (v - 0.5);

      // Step-cut terraces (fractal pattern with order-4 symmetry)
      const distFromCenter = Math.max(Math.abs(x), Math.abs(y));
      const numSteps = 12;
      const stepIndex = Math.floor(distFromCenter / (0.5 * a) * numSteps);
      const stepDepth = 0.04;

      // Mirror symmetry creates terrace effect
      const z = -stepIndex * stepDepth * c;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 64 
    })
  },

  // ============================================================================
  // AI ALGORITHM VISUALIZATIONS - Mathematical Foundations of Modern AI
  // ============================================================================

  ai_gradient_descent: {
    name: "🎯 Gradient Descent - Loss Surface θ_{t+1} = θ_t - α∇J(θ)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const x = a * (u - 0.5) * 4;
      const y = b * (v - 0.5) * 4;

      const loss = (x * x + y * y) / 8 - 0.5 * Math.cos(2 * Math.PI * x) - 0.5 * Math.cos(2 * Math.PI * y);

      const alpha = 0.1;
      const grad_x = x / 4 + Math.PI * Math.sin(2 * Math.PI * x);
      const grad_y = y / 4 + Math.PI * Math.sin(2 * Math.PI * y);

      const descent_effect = c * loss * (1 - alpha * Math.sqrt(grad_x * grad_x + grad_y * grad_y) * 0.1);
      const z = descent_effect;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 96 })
  },

  ai_sgd_momentum: {
    name: "🌊 SGD Momentum - v_t = βv_{t-1} + ∇J, θ_{t+1} = θ_t - αv_t",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.2;

      const beta = 0.9;
      const timestep = u;
      const theta = v * 2 * Math.PI;

      const gradient = Math.sin(timestep * Math.PI * 4);
      let velocity = 0;
      for (let t = 0; t <= timestep; t += 0.1) {
        const grad_t = Math.sin(t * Math.PI * 4);
        velocity = beta * velocity + grad_t;
      }

      const radius = a * (1 - 0.5 * Math.abs(velocity) * timestep);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * velocity * (1 - timestep);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.2, uSegments: 128, vSegments: 48 })
  },

  ai_adam_optimizer: {
    name: "⚡ Adam - m̂_t/√(v̂_t+ε), β₁=0.9, β₂=0.999",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const timestep = u;
      const theta = v * 2 * Math.PI;

      const beta1 = 0.9;
      const beta2 = 0.999;
      const epsilon = 1e-8;

      const gradient = Math.sin(timestep * Math.PI * 6) + 0.5 * Math.cos(timestep * Math.PI * 3);

      let m_t = 0;
      let v_t = 0;
      for (let t = 0; t <= timestep; t += 0.05) {
        const g_t = Math.sin(t * Math.PI * 6) + 0.5 * Math.cos(t * Math.PI * 3);
        m_t = beta1 * m_t + (1 - beta1) * g_t;
        v_t = beta2 * v_t + (1 - beta2) * g_t * g_t;
      }

      const t_step = Math.floor(timestep * 20) + 1;
      const m_hat = m_t / (1 - Math.pow(beta1, t_step));
      const v_hat = v_t / (1 - Math.pow(beta2, t_step));

      const adam_update = m_hat / (Math.sqrt(v_hat) + epsilon);

      const radius = a * (0.5 + 0.5 * Math.abs(m_hat));
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * adam_update;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 48 })
  },

  ai_random_forest: {
    name: "🌳 Random Forest - Ensemble Decision Trees",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.5;

      const branchCount = 8;
      const branch = Math.floor(u * branchCount);
      const localU = (u * branchCount) % 1;
      const angle = (branch / branchCount) * 2 * Math.PI;

      const radius = localU * a * v;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = c * localU * (1 - 0.5 * Math.sin(localU * Math.PI * 4));

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.5, uSegments: 96, vSegments: 32 })
  },

  ai_svm_kernel: {
    name: "📊 SVM - K(x,x')=exp(-γ||x-x'||²) RBF Kernel",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 0.8;

      const x = a * (u - 0.5) * 4;
      const y = b * (v - 0.5) * 4;

      const gamma = 0.5;

      const support_vectors = [
        [-1, -1], [1, -1], [-1, 1], [1, 1],
        [0, 2], [0, -2], [2, 0], [-2, 0]
      ];

      let decision_value = 0;
      for (const sv of support_vectors) {
        const dist_sq = (x - sv[0]) * (x - sv[0]) + (y - sv[1]) * (y - sv[1]);
        const kernel_value = Math.exp(-gamma * dist_sq);
        const alpha_y = (sv[0] * sv[1] > 0) ? 1 : -1;
        decision_value += alpha_y * kernel_value;
      }

      const margin = 1.0;
      const z = c * decision_value;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 0.8, uSegments: 96, vSegments: 96 })
  },

  ai_cnn_layers: {
    name: "🔲 CNN - Convolutional Neural Network Layers",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.2;

      const layers = 5;
      const layer = Math.floor(v * layers);
      const localV = (v * layers) % 1;

      const kernelSize = 3;
      const stride = u * kernelSize;

      const x = a * (u - 0.5);
      const y = b * (localV - 0.5) + layer * 0.3;
      const z = c * Math.sin(stride * Math.PI) * Math.cos(layer + u * Math.PI);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.2, uSegments: 96, vSegments: 60 })
  },

  ai_rnn_sequence: {
    name: "🔁 RNN - Recurrent Neural Network",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const timesteps = 8;
      const t = u * timesteps;
      const theta = v * 2 * Math.PI;

      const h_t = Math.tanh(Math.cos(t * Math.PI / 2));
      const radius = a * (0.5 + 0.5 * h_t);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * t / timesteps;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 48 })
  },

  ai_lstm_gates: {
    name: "🚪 LSTM - Long Short-Term Memory Gates",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.5;

      const t = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;

      const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
      const forget_gate = sigmoid(Math.cos(t));
      const input_gate = sigmoid(Math.sin(t));
      const output_gate = sigmoid(Math.cos(t + Math.PI / 2));

      const radius = a * (0.3 + 0.7 * forget_gate);
      const x = radius * Math.cos(phi) * input_gate;
      const y = radius * Math.sin(phi) * input_gate;
      const z = c * (u - 0.5) * output_gate;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.5, uSegments: 128, vSegments: 48 })
  },

  ai_transformer_attention: {
    name: "🎭 Transformer - softmax(QK^T/√d_k)V Multi-Head",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const heads = 8;
      const d_k = 64;
      const seq_len = 16;

      const query_pos = u * seq_len;
      const key_pos = v * seq_len;

      const head_idx = Math.floor((query_pos / seq_len) * heads);
      const head_angle = (head_idx / heads) * 2 * Math.PI;

      const q_vec = Math.cos(query_pos * Math.PI / seq_len);
      const k_vec = Math.cos(key_pos * Math.PI / seq_len);
      const qk_dot = q_vec * k_vec;

      const scaled_score = qk_dot / Math.sqrt(d_k);

      let exp_sum = 0;
      for (let i = 0; i < seq_len; i++) {
        const k_i = Math.cos(i * Math.PI / seq_len);
        exp_sum += Math.exp((q_vec * k_i) / Math.sqrt(d_k));
      }
      const attention_weight = Math.exp(scaled_score) / exp_sum;

      const radius = a * (0.3 + 0.7 * attention_weight);
      const x = radius * Math.cos(head_angle + query_pos * 0.1);
      const y = radius * Math.sin(head_angle + query_pos * 0.1);
      const z = c * attention_weight * Math.cos(key_pos * Math.PI / seq_len);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 128, vSegments: 128 })
  },

  ai_gan_adversarial: {
    name: "⚔️ GAN - min_G max_D [log D(x) + log(1-D(G(z)))]",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.2;

      const theta = u * 2 * Math.PI;
      const z_noise = v;

      const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

      const G_z_x = z_noise * Math.sin(theta * 3);
      const G_z_y = z_noise * Math.cos(theta * 3);
      const G_z = Math.sqrt(G_z_x * G_z_x + G_z_y * G_z_y);

      const real_data = Math.abs(Math.cos(theta));
      const D_x = sigmoid(5 * (real_data - 0.5));
      const D_G_z = sigmoid(5 * (G_z - 0.5));

      const discriminator_loss = -(Math.log(D_x + 1e-8) + Math.log(1 - D_G_z + 1e-8));
      const generator_loss = -Math.log(D_G_z + 1e-8);

      const minimax_value = discriminator_loss - generator_loss;

      const radius = a * (0.3 + 0.7 * D_G_z);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * minimax_value * 0.2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.2, uSegments: 96, vSegments: 48 })
  },

  ai_vae_latent: {
    name: "🔐 VAE - z = μ + σ⊙ε, KL = ½Σ(μ²+σ²-log(σ²)-1)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const data_x = a * (u - 0.5) * 4;
      const data_y = b * (v - 0.5) * 4;

      const mu_x = data_x * 0.8;
      const mu_y = data_y * 0.8;
      const log_var_x = -0.5 + 0.3 * Math.sin(u * Math.PI * 2);
      const log_var_y = -0.5 + 0.3 * Math.cos(v * Math.PI * 2);

      const sigma_x = Math.exp(0.5 * log_var_x);
      const sigma_y = Math.exp(0.5 * log_var_y);

      const epsilon_x = Math.sin(u * Math.PI * 6);
      const epsilon_y = Math.cos(v * Math.PI * 6);

      const z_x = mu_x + sigma_x * epsilon_x;
      const z_y = mu_y + sigma_y * epsilon_y;

      const kl_divergence = 0.5 * (
        mu_x * mu_x + mu_y * mu_y + 
        sigma_x * sigma_x + sigma_y * sigma_y - 
        log_var_x - log_var_y - 2
      );

      const x = z_x;
      const y = z_y;
      const z = c * kl_divergence * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 96 })
  },

  ai_diffusion_denoise: {
    name: "🌫️ Diffusion - x_t = √ᾱ_t·x_0 + √(1-ᾱ_t)·ε, DDPM",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.2;

      const timestep = u;
      const theta = v * 2 * Math.PI;

      const T = 1000;
      const t = Math.floor(timestep * T);

      const beta_start = 0.0001;
      const beta_end = 0.02;
      const beta_t = beta_start + (beta_end - beta_start) * (t / T);

      const alpha_t = 1 - beta_t;

      let alpha_bar_t = 1;
      for (let i = 0; i <= t; i++) {
        const beta_i = beta_start + (beta_end - beta_start) * (i / T);
        alpha_bar_t *= (1 - beta_i);
      }

      const sqrt_alpha_bar = Math.sqrt(alpha_bar_t);
      const sqrt_one_minus_alpha_bar = Math.sqrt(1 - alpha_bar_t);

      const x_0 = Math.cos(theta);
      const epsilon = Math.sin(theta * 3 + timestep * Math.PI);
      const x_t = sqrt_alpha_bar * x_0 + sqrt_one_minus_alpha_bar * epsilon;

      const radius = a * (0.5 + 0.5 * Math.abs(x_t));
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * (1 - timestep) * sqrt_alpha_bar + c * timestep * epsilon * 0.3;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1.2, uSegments: 128, vSegments: 64 })
  },

  ai_reinforcement_qlearning: {
    name: "🎮 Q-Learning - Value Function Landscape",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const x = a * (u - 0.5);
      const y = b * (v - 0.5);

      const gamma = 0.99;
      const reward = Math.exp(-(x * x + y * y) / 2);
      const q_value = reward + gamma * Math.max(
        Math.sin(x * Math.PI) * Math.cos(y * Math.PI),
        Math.cos(x * Math.PI) * Math.sin(y * Math.PI)
      );

      const z = c * q_value;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 96 })
  },

  ai_neural_activation: {
    name: "⚡ Neural Activation - ReLU/Sigmoid/Tanh",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const x_input = a * (u - 0.5) * 4;
      const theta = v * 2 * Math.PI;

      const relu = Math.max(0, x_input);
      const sigmoid = 1 / (1 + Math.exp(-x_input));
      const tanh = Math.tanh(x_input);

      const activation = (relu * 0.3 + sigmoid * 0.3 + tanh * 0.4);

      const radius = b * (0.3 + 0.7 * Math.abs(activation));
      const x = a * (u - 0.5);
      const y = radius * Math.cos(theta);
      const z = c * activation;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 96, vSegments: 48 })
  },

  ai_backpropagation: {
    name: "↩️ Backpropagation - Gradient Flow",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1.5;

      const layers = 6;
      const layer = v * layers;
      const neuron = u;

      const gradient = Math.exp(-layer / 2) * Math.cos(neuron * Math.PI * 4);
      const weight = Math.sin(layer * Math.PI / layers) * Math.cos(neuron * Math.PI * 2);

      const x = a * (neuron - 0.5);
      const y = b * (layer / layers - 0.5);
      const z = c * gradient * weight;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 96, vSegments: 72 })
  },

  ai_attention_mechanism: {
    name: "👁️ Attention Mechanism - Query-Key-Value",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const b = params.b ?? 2;
      const c = params.c ?? 1;

      const query_pos = u;
      const key_pos = v;

      const d_k = 64;
      const similarity = Math.exp(-Math.pow(query_pos - key_pos, 2) * d_k / 10);
      const attention_weight = similarity / (1 + Math.abs(query_pos - key_pos));

      const theta = query_pos * 2 * Math.PI;
      const phi = key_pos * 2 * Math.PI;

      const radius = a * (0.3 + 0.7 * attention_weight);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = c * attention_weight * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // AZTEC FIVE SUNS MYTHOLOGY - Celestial Objects
  // ============================================================================
  // Representing the Five Suns (Nahui-Ocelotl, Nahui-Ehecatl, Nahui-Quiahuitl, 
  // Nahui-Atl, Nahui-Ollin) - each with watchful eyeball center

  nahui_ocelotl: {
    name: "🐆 Nahui-Ocelotl - Jaguar Sun (Earth)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Layer 0: Central eyeball (u < 0.33)
      // Layer 1: Outer jaguar claws (u >= 0.33)
      const layer = u < 0.33 ? 0 : 1;

      if (layer === 0) {
        // EYEBALL CENTER - Dark watching eye
        const eyeU = u * 3;
        const eyeTheta = eyeU * 2 * Math.PI;
        const eyeRadius = a * 0.3;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // Iris detail - darker center
        const irisDetail = eyeU < 0.5 ? 0.7 : 1.0;
        const r = eyeRadius * irisDetail;

        return [
          r * sinPhi * Math.cos(eyeTheta),
          r * sinPhi * Math.sin(eyeTheta),
          r * cosPhi
        ];
      } else {
        // OUTER JAGUAR CLAWS - Organic, chaotic 4-fold symmetry
        const outerU = (u - 0.33) / 0.67;
        const clawTheta = outerU * 2 * Math.PI;

        // 4 jaguar claws (quadrants)
        const clawPattern = 1 + 0.6 * Math.abs(Math.sin(clawTheta * 4));

        // Organic chaos - earth element
        const earthChaos = 0.15 * Math.sin(clawTheta * 7) * Math.sin(phi * 5);

        const radius = a * (0.6 + 0.4 * Math.sin(phi)) * clawPattern + earthChaos;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        return [
          radius * sinPhi * Math.cos(clawTheta),
          radius * sinPhi * Math.sin(clawTheta),
          radius * cosPhi
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 2, uSegments: 120, vSegments: 72 })
  },

  nahui_ehecatl: {
    name: "💨 Nahui-Ehecatl - Wind Sun (Air)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const layer = u < 0.33 ? 0 : 1;

      if (layer === 0) {
        // EYEBALL CENTER - Bright watching eye
        const eyeU = u * 3;
        const eyeTheta = eyeU * 2 * Math.PI;
        const eyeRadius = a * 0.3;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const irisDetail = eyeU < 0.5 ? 0.7 : 1.0;
        const r = eyeRadius * irisDetail;

        return [
          r * sinPhi * Math.cos(eyeTheta),
          r * sinPhi * Math.sin(eyeTheta),
          r * cosPhi
        ];
      } else {
        // OUTER WIND SPIRALS - Airy curls radiating outward
        const outerU = (u - 0.33) / 0.67;
        const spiralTheta = outerU * 2 * Math.PI;

        // Spiral curl pattern - air flow
        const spiralIntensity = outerU * 2;
        const curlAngle = spiralTheta + spiralIntensity * Math.PI;

        // Wind turbulence
        const airTurbulence = 0.2 * Math.sin(curlAngle * 6) * Math.cos(phi * 8);

        const radius = a * (0.5 + 0.5 * outerU) * (1 + airTurbulence);

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        return [
          radius * sinPhi * Math.cos(curlAngle),
          radius * sinPhi * Math.sin(curlAngle),
          radius * cosPhi + airTurbulence * 0.3
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 2, uSegments: 120, vSegments: 72 })
  },

  nahui_quiahuitl: {
    name: "🔥 Nahui-Quiahuitl - Fire Sun (Rain of Fire)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const layer = u < 0.33 ? 0 : 1;

      if (layer === 0) {
        // EYEBALL CENTER - Glowing fire eye
        const eyeU = u * 3;
        const eyeTheta = eyeU * 2 * Math.PI;
        const eyeRadius = a * 0.3;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        // Glowing iris
        const irisGlow = eyeU < 0.5 ? 0.8 : 1.0;
        const r = eyeRadius * irisGlow;

        return [
          r * sinPhi * Math.cos(eyeTheta),
          r * sinPhi * Math.sin(eyeTheta),
          r * cosPhi
        ];
      } else {
        // OUTER FIRE SPIKES - Sharp radiating tessellated spikes
        const outerU = (u - 0.33) / 0.67;
        const spikeTheta = outerU * 2 * Math.PI;

        // Sharp spikes radiating (12 points)
        const spikePattern = 1 + 0.8 * Math.max(0, Math.sin(spikeTheta * 12));

        // Lava tessellation
        const tessellation = 0.1 * (Math.sin(spikeTheta * 24) * Math.sin(phi * 16));

        const radius = a * (0.6 + 0.4 * Math.sin(phi)) * spikePattern + tessellation;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        return [
          radius * sinPhi * Math.cos(spikeTheta),
          radius * sinPhi * Math.sin(spikeTheta),
          radius * cosPhi
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 2, uSegments: 144, vSegments: 72 })
  },

  nahui_atl: {
    name: "💧 Nahui-Atl - Water Sun (Water)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const layer = u < 0.33 ? 0 : 1;

      if (layer === 0) {
        // EYEBALL CENTER - Liquid eye
        const eyeU = u * 3;
        const eyeTheta = eyeU * 2 * Math.PI;
        const eyeRadius = a * 0.3;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const irisDetail = eyeU < 0.5 ? 0.7 : 1.0;
        const r = eyeRadius * irisDetail;

        return [
          r * sinPhi * Math.cos(eyeTheta),
          r * sinPhi * Math.sin(eyeTheta),
          r * cosPhi
        ];
      } else {
        // OUTER WATER WAVES - Wave symmetry with droplet patterns
        const outerU = (u - 0.33) / 0.67;
        const waveTheta = outerU * 2 * Math.PI;

        // Water wave ripples (8-fold symmetry)
        const wavePattern = Math.sin(waveTheta * 8 + phi * 4) * 0.3;

        // Droplet formations
        const droplets = 0.15 * Math.sin(waveTheta * 16) * Math.sin(phi * 12);

        const radius = a * (0.7 + 0.3 * Math.sin(phi)) + wavePattern + droplets;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        return [
          radius * sinPhi * Math.cos(waveTheta),
          radius * sinPhi * Math.sin(waveTheta),
          radius * cosPhi + wavePattern * 0.2
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 2, uSegments: 144, vSegments: 72 })
  },

  nahui_ollin: {
    name: "⚡ Nahui-Ollin - Movement Sun (Current Age)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const layer = u < 0.33 ? 0 : 1;

      if (layer === 0) {
        // EYEBALL CENTER - Vibrant watchful eye
        const eyeU = u * 3;
        const eyeTheta = eyeU * 2 * Math.PI;
        const eyeRadius = a * 0.3;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const irisDetail = eyeU < 0.5 ? 0.75 : 1.0;
        const r = eyeRadius * irisDetail;

        return [
          r * sinPhi * Math.cos(eyeTheta),
          r * sinPhi * Math.sin(eyeTheta),
          r * cosPhi
        ];
      } else {
        // OUTER ROTATING MANDALA - Interlocking gears, quaking rings
        const outerU = (u - 0.33) / 0.67;
        const mandalaTheta = outerU * 2 * Math.PI;

        // Interlocking gear teeth (15-point star for Moroccan connection)
        const gearTeeth = 1 + 0.4 * Math.sin(mandalaTheta * 15);

        // Quaking/vibration effect - perpetual motion
        const quake = 0.1 * Math.sin(mandalaTheta * 30 + phi * 20);

        // Rotating mandala rings
        const ringPattern = 1 + 0.2 * Math.sin(outerU * Math.PI * 4);

        const radius = a * (0.6 + 0.4 * Math.sin(phi)) * gearTeeth * ringPattern + quake;

        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        return [
          radius * sinPhi * Math.cos(mandalaTheta),
          radius * sinPhi * Math.sin(mandalaTheta),
          radius * cosPhi
        ];
      }
    },
    defaultParams: getCleanDefaults({ a: 2, uSegments: 144, vSegments: 72 })
  },

  // ============================================================================
  // CONVERGENCE MATHEMATICS - Linear Path Convergence
  // ============================================================================

  operations_convergence: {
    name: "⚡ Operations Convergence - 5-Fold Linear Convergence to φ Point",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const target = [0, 1.681 * b, 0];

      const operations = [
        { start: [5 * a, 0.681 * b, 0] },              // Addition: 0.681 + 1 = 1.681
        { start: [-5 * a, 0.8405 * b, 0] },            // Multiplication: 0.8405 × 2 = 1.681
        { start: [0, 16.81 * b, 5 * a] },              // Division: 16.81 ÷ 10 = 1.681
        { start: [5 * a, 1.681 * b, -5 * a] },         // Power: 1.681^1 = 1.681
        { start: [-5 * a, 2.825761 * b, -5 * a] }      // Square Root: √2.825761 = 1.681
      ];

      const pathIndex = Math.floor(u * operations.length);
      const clampedIndex = Math.min(pathIndex, operations.length - 1);
      const op = operations[clampedIndex];

      const t = v;

      const x = (1 - t) * op.start[0] + t * target[0];
      const y = (1 - t) * op.start[1] + t * target[1];
      const z = (1 - t) * op.start[2] + t * target[2];

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, 
      b: 1,
      uSegments: 100,
      vSegments: 50
    })
  },

  // ============================================================================
  // CRYPTOGRAPHIC ALGORITHMS - Mathematical Structure Visualization
  // Geometric rendering of internal cryptographic transformations
  // Color-coding: linear=blue, nonlinear=red, modular=gold, probabilistic=violet
  // ============================================================================

  aes_rijndael_cipher: {
    name: "🔐 AES Rijndael - 4×4 Block Cipher Matrix Operations",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;  // Scale
      const b = params.b ?? 1.0;  // Round intensity
      const c = params.c ?? 1.0;  // Transformation depth
      const d = params.d ?? 0.5;  // SubBytes nonlinearity
      const e = params.e ?? 1.0;  // ShiftRows rotation
      const f = params.f ?? 0.8;  // MixColumns diffusion
      const g = params.g ?? 0.3;  // AddRoundKey XOR
      const h = params.h ?? 10;   // Number of rounds (10, 12, or 14)

      // Map u,v to 4x4 block coordinates
      const blockRow = Math.floor(u * 4) % 4;
      const blockCol = Math.floor(v * 4) % 4;
      const localU = (u * 4) % 1;
      const localV = (v * 4) % 1;

      // Round progression (animated through parameter space)
      const round = localU;

      // SubBytes: S-box nonlinear substitution (red - nonlinear)
      const sBoxVal = Math.sin(d * blockRow * Math.PI) * Math.cos(d * blockCol * Math.PI);
      const subBytesZ = sBoxVal * (1 + round * 0.5);

      // ShiftRows: Cyclic row shifts (blue - linear)
      const shiftAmount = blockRow * e * 0.25;
      const shiftedCol = (blockCol + shiftAmount) % 4;
      const shiftX = Math.cos(shiftedCol * Math.PI / 2) * 0.3;

      // MixColumns: Matrix multiplication diffusion (blue - linear)
      const mixFactor = f * (Math.sin(blockRow * Math.PI / 4) + Math.cos(blockCol * Math.PI / 4));
      const mixY = mixFactor * (1 + round * 0.3);

      // AddRoundKey: XOR with round key (gold - modular)
      const keyXOR = g * Math.sin((blockRow + blockCol) * Math.PI * round);

      // Base position in 4x4 lattice
      const baseX = a * (blockCol - 1.5 + shiftX);
      const baseY = a * (blockRow - 1.5 + mixY);
      const baseZ = c * (subBytesZ + keyXOR);

      // Add round-dependent morphing
      const roundMorph = round * Math.sin(localV * Math.PI * 2);

      return [
        baseX + roundMorph * 0.2,
        baseY + roundMorph * 0.15,
        baseZ + roundMorph * 0.3
      ];
    },
    defaultParams: getCleanDefaults({
      a: 2.5, b: 1.0, c: 1.0, d: 0.5, e: 1.0, f: 0.8, g: 0.3, h: 10,
      uSegments: 128, vSegments: 128
    })
  },

  sha256_compression_function: {
    name: "🔐 SHA-256 - Bitwise Compression Function Spirals",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Radius scale
      const b = params.b ?? 1.5;  // Vertical stretch
      const c = params.c ?? 1.0;  // Spiral tightness
      const d = params.d ?? 8;    // Number of rounds (64 actual, 8 visual)
      const e = params.e ?? 0.5;  // Rotation amount (ROR)
      const f = params.f ?? 0.7;  // XOR wave intensity
      const g = params.g ?? 0.4;  // Modular addition
      const h = params.h ?? 2;    // Compression ratio

      // Toroidal base for message schedule
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;

      // Round progression through compression
      const round = u * d;
      const roundPhase = round % 1;

      // Bitwise rotations (ROR/ROL) - represented as helical twist
      const rotationAngle = e * round * Math.PI / 4;
      const rotX = Math.cos(rotationAngle);
      const rotY = Math.sin(rotationAngle);

      // XOR operations - wave interference patterns (blue - linear)
      const xorWave = f * (
        Math.sin(theta + round * Math.PI / 8) + 
        Math.sin(phi - round * Math.PI / 8)
      ) * 0.5;

      // Modular addition - golden spiral compression (gold - modular)
      const modAdd = g * Math.log(1 + round) / Math.log(1 + d);

      // Toroidal compression spiral
      const majorRadius = a * (1 - modAdd * 0.3);
      const minorRadius = (b / h) * (1 + xorWave * 0.3);

      const x = (majorRadius + minorRadius * Math.cos(phi)) * Math.cos(theta) * rotX;
      const y = (majorRadius + minorRadius * Math.cos(phi)) * Math.sin(theta) * rotY;
      const z = c * (minorRadius * Math.sin(phi) + round * 0.3);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.5, c: 1.0, d: 8, e: 0.5, f: 0.7, g: 0.4, h: 2,
      uSegments: 128, vSegments: 64
    })
  },

  elliptic_curve_cryptography: {
    name: "🔐 ECC - Elliptic Curve y²=x³+ax+b Point Addition",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;   // Curve scale
      const b = params.b ?? 1.0;   // Curve parameter a
      const c = params.c ?? 1.0;   // Curve parameter b
      const d = params.d ?? 0.5;   // Point addition rays
      const e = params.e ?? 1.0;   // Field visualization
      const f = params.f ?? 0.3;   // Modular field waves
      const p = params.g ?? 17;    // Prime field modulus (visualization)

      // Map u,v to elliptic curve domain
      const x = a * (u * 8 - 4);  // x range: -4 to 4
      // Elliptic curve equation: y² = x³ + ax + b
      const curveRHS = x * x * x + b * x + c;
      const ySquared = Math.max(0, curveRHS);  // Ensure non-negative
      const yBase = Math.sqrt(ySquared);

      // Two branches of the curve (± sqrt)
      const branch = v < 0.5 ? 1 : -1;
      const y = yBase * branch * e;

      // Point addition visualization - tangent line intersection
      const tangentAngle = d * Math.PI * u;
      const additionRay = Math.sin(tangentAngle) * 0.2;

      // Modular field structure (gold - modular)
      const fieldMod = f * Math.sin(x * Math.PI / p) * Math.cos(y * Math.PI / p);

      // Z represents the field-space height
      const z = fieldMod + additionRay;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 2.0, b: 1.0, c: 1.0, d: 0.5, e: 1.0, f: 0.3, g: 17,
      uSegments: 128, vSegments: 64
    })
  },

  keccak_sha3_sponge: {
    name: "🔐 Keccak (SHA-3) - Sponge Construction State Permutation",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;  // Cube size
      const b = params.b ?? 1.0;  // Absorption rate
      const c = params.c ?? 1.0;  // Capacity
      const d = params.d ?? 0.5;  // θ (theta) step intensity
      const e = params.e ?? 0.6;  // ρ (rho) rotation
      const f = params.f ?? 0.7;  // π (pi) permutation
      const g = params.g ?? 0.8;  // χ (chi) nonlinear
      const h = params.h ?? 0.4;  // ι (iota) round constant

      // 5×5 state array coordinates
      const stateX = Math.floor(u * 5) % 5;
      const stateY = Math.floor(v * 5) % 5;
      const localU = (u * 5) % 1;
      const localV = (v * 5) % 1;

      // Round progression
      const round = localU;

      // θ (theta): Column parity mixing (blue - linear)
      const thetaVal = d * (
        Math.sin((stateX - 1) * Math.PI / 5) + 
        Math.sin((stateX + 1) * Math.PI / 5)
      );

      // ρ (rho): Bit rotation per lane (blue - linear)
      const rhoRotation = e * ((stateX + 3 * stateY) % 64) / 64;
      const rhoAngle = rhoRotation * Math.PI * 2;

      // π (pi): Lane permutation (blue - linear)
      const piX = (stateX + 3 * stateY) % 5;
      const piY = stateX;

      // χ (chi): Nonlinear bitwise mixing (red - nonlinear)
      const chiVal = g * Math.sin(stateX * Math.PI / 5) * 
                     (1 - Math.cos(stateY * Math.PI / 5)) * 
                     Math.sin(round * Math.PI);

      // ι (iota): Round constant addition (gold - modular)
      const iotaVal = h * Math.sin(round * Math.PI * 24);

      // Sponge structure: absorb/squeeze volumetric representation
      const absorbPhase = round < 0.5 ? 1 : 0;
      const squeezePhase = round >= 0.5 ? 1 : 0;

      const x = a * (piX - 2 + Math.cos(rhoAngle) * 0.3);
      const y = a * (piY - 2 + Math.sin(rhoAngle) * 0.3);
      const z = (thetaVal + chiVal + iotaVal) * (absorbPhase * b + squeezePhase * c);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 2.5, b: 1.0, c: 1.0, d: 0.5, e: 0.6, f: 0.7, g: 0.8, h: 0.4,
      uSegments: 128, vSegments: 128
    })
  },

  lattice_kyber_ntru: {
    name: "🔐 Lattice-Based - Kyber/NTRU Polynomial Lattice Nodes",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Lattice spacing
      const b = params.b ?? 1.0;  // Polynomial degree intensity
      const c = params.c ?? 0.8;  // Modular reduction wave
      const d = params.d ?? 256;  // Polynomial degree (actual: 256, 512, 1024)
      const e = params.e ?? 3329; // Modulus q (Kyber uses 3329)
      const f = params.f ?? 0.5;  // Error distribution (violet - probabilistic)
      const g = params.g ?? 0.6;  // Ring structure
      const h = params.h ?? 1.2;  // Vibration amplitude

      // Polynomial coefficient index
      const coeffIndex = Math.floor(u * d) % d;
      const angle = (coeffIndex / d) * Math.PI * 2;

      // Ring polynomial structure (circular lattice)
      const ringRadius = a * (1 + g * 0.3);
      const baseX = ringRadius * Math.cos(angle);
      const baseY = ringRadius * Math.sin(angle);

      // Polynomial coefficient value (oscillating)
      const coeffValue = Math.sin(coeffIndex * Math.PI / 16) * 
                        Math.cos(v * Math.PI * 2);

      // Modular reduction visualization (gold - modular)
      const modReduction = c * Math.sin(coeffValue * Math.PI * e / 1000) * 
                          Math.cos(angle * 3);

      // Learning With Errors (LWE) - probabilistic noise (violet - probabilistic)
      const errorNoise = f * (
        Math.sin(coeffIndex * Math.PI / 7) * 
        Math.cos(v * Math.PI * 5) * 
        Math.sin(angle * 2)
      ) * 0.3;

      // Vibrating lattice nodes (security strength visualization)
      const vibration = h * Math.sin(v * Math.PI * 4 + angle) * 
                       Math.cos(coeffIndex * Math.PI / 32);

      const x = baseX + errorNoise;
      const y = baseY + modReduction;
      const z = b * (coeffValue + vibration);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.0, c: 0.8, d: 256, e: 3329, f: 0.5, g: 0.6, h: 1.2,
      uSegments: 128, vSegments: 64
    })
  },

  // ============================================================================
  // NESTED SPHERES & UNSOLVED MATHEMATICAL PROBLEMS
  // ============================================================================

  nested_spheres_golden: {
    name: "🔮 Nested Spheres - Golden Ratio Recursive Compression",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;   // Base radius R₀
      const b = params.b ?? 8.0;   // Number of nested layers
      const c = params.c ?? 0.618; // Golden ratio compression (φ⁻¹)
      const d = params.d ?? 1.0;   // Transparency/density visualization
      const e = params.e ?? 0;     // Rotation offset

      const PHI_INVERSE = 0.618033988749895; // 1/φ = (√5 - 1)/2
      const compressionRatio = Math.max(0.1, Math.min(0.99, c));
      const layers = Math.max(1, Math.min(20, Math.floor(b)));

      // Determine which layer this point belongs to
      const layerIndex = Math.floor(v * layers);
      const localV = (v * layers) % 1;

      // Calculate radius for this layer: Rₙ = R₀ × (compression)ⁿ
      const radius = a * Math.pow(compressionRatio, layerIndex);

      // Spherical coordinates
      const theta = u * Math.PI * 2 + e * Math.PI / 4;
      const phi = localV * Math.PI;

      // Sphere equation with golden ratio nesting
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      // Add subtle variation to show layer boundaries
      const layerViz = d * Math.sin(layerIndex * Math.PI) * 0.05;

      return [x + layerViz, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 5.0, b: 8.0, c: 0.618, d: 1.0, e: 0,
      uSegments: 64, vSegments: 64
    })
  },

  navier_stokes_turbulence: {
    name: "🌊 Navier-Stokes - Quantum Turbulence Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Flow scale
      const b = params.b ?? 1.5;  // Vorticity intensity
      const c = params.c ?? 0.8;  // Viscosity effect
      const d = params.d ?? 1.0;  // Energy cascade
      const e = params.e ?? 0;    // Time evolution

      // Simulate turbulent flow patterns
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Vortex structures (characteristic of Navier-Stokes turbulence)
      const vortexX = Math.sin(theta * 2) * Math.cos(phi * 3);
      const vortexY = Math.cos(theta * 3) * Math.sin(phi * 2);
      const vortexZ = Math.sin(theta + phi) * Math.cos(theta - phi);

      // Energy cascade (large eddies breaking into smaller ones)
      const cascade = d * (
        Math.sin(theta * 5 + e) * 0.3 +
        Math.sin(theta * 7 - e) * 0.2 +
        Math.sin(theta * 11) * 0.1
      );

      // Chaotic flow with viscosity damping
      const x = a * Math.sin(phi) * Math.cos(theta) * (1 + vortexX * b);
      const y = a * Math.sin(phi) * Math.sin(theta) * (1 + vortexY * b);
      const z = a * Math.cos(phi) * (1 + vortexZ * b) + cascade * Math.exp(-c * phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.5, c: 0.8, d: 1.0, e: 0,
      uSegments: 96, vSegments: 72
    })
  },

  protein_folding_landscape: {
    name: "🧬 Protein Folding - Energy Landscape Funnel",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;  // Landscape width
      const b = params.b ?? 3.0;  // Funnel depth
      const c = params.c ?? 1.5;  // Roughness (local minima)
      const d = params.d ?? 0.5;  // Entropy term
      const e = params.e ?? 0;    // Folding pathway

      // Energy funnel topology
      const theta = u * Math.PI * 2;
      const r = v * a;

      // Funnel shape (broad at top, narrow at bottom)
      const funnelRadius = a * (1 - v * 0.8);

      // Energy landscape with local minima (roughness)
      const energy = -b * v + c * (
        Math.sin(theta * 3) * Math.exp(-v * 2) +
        Math.sin(theta * 5 + v * Math.PI) * Math.exp(-v * 3) * 0.5
      );

      // Entropy contribution (disorder)
      const entropyTerm = d * Math.sin(theta * 7) * Math.sin(v * Math.PI * 2) * (1 - v);

      const x = funnelRadius * Math.cos(theta);
      const y = funnelRadius * Math.sin(theta);
      const z = energy + entropyTerm;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 4.0, b: 3.0, c: 1.5, d: 0.5, e: 0,
      uSegments: 128, vSegments: 96
    })
  },

  yang_mills_mass_gap: {
    name: "⚛️ Yang-Mills - Mass Gap Field Curvature",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Field strength scale
      const b = params.b ?? 1.0;  // Mass gap magnitude
      const c = params.c ?? 0.8;  // Gauge coupling
      const d = params.d ?? 1.2;  // Gluon field tension
      const e = params.e ?? 0;    // SU(3) phase

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Non-perturbative gauge field (color charge)
      const gluonField = d * (
        Math.sin(theta * 2 + e) * Math.cos(phi * 3) +
        Math.cos(theta * 3 - e) * Math.sin(phi * 2)
      );

      // Mass gap (energy difference from massless theory)
      const massGap = b * (1 - Math.cos(phi)) * Math.exp(-c * Math.abs(Math.sin(theta)));

      // Lattice field curvature (QCD confinement)
      const fieldCurvature = Math.sin(theta * 4) * Math.sin(phi * 4) * c;

      const x = a * Math.sin(phi) * Math.cos(theta) + gluonField * 0.3;
      const y = a * Math.sin(phi) * Math.sin(theta) + fieldCurvature * 0.3;
      const z = a * Math.cos(phi) + massGap;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.0, c: 0.8, d: 1.2, e: 0,
      uSegments: 96, vSegments: 72
    })
  },

  consciousness_wave_collapse: {
    name: "🧠 Consciousness - Quantum Wave Collapse Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Wavefunction extent
      const b = params.b ?? 1.5;  // Collapse intensity
      const c = params.c ?? 0.618; // Golden ratio attractor
      const d = params.d ?? 1.0;  // Observer effect strength
      const e = params.e ?? 0;    // Measurement time

      const theta = u * Math.PI * 2;
      const r = v * a;

      // Superposition state (before observation)
      const waveAmplitude = Math.exp(-r * 0.5) * Math.sin(r * Math.PI * 2);

      // Collapse to golden ratio eigenstate
      const collapseFunction = Math.exp(-Math.pow((v - c), 2) * b * 5);

      // Observer-dependent interference pattern
      const interference = d * (
        Math.cos(theta * 3 + e) * Math.sin(r * Math.PI * 4) +
        Math.sin(theta * 5 - e) * Math.cos(r * Math.PI * 3)
      ) * (1 - collapseFunction);

      const x = r * Math.cos(theta) + interference * 0.3;
      const y = r * Math.sin(theta) + interference * 0.3;
      const z = waveAmplitude * (1 - collapseFunction) + collapseFunction * c * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.5, c: 0.618, d: 1.0, e: 0,
      uSegments: 128, vSegments: 96
    })
  },

  riemann_zeta_zeros: {
    name: "🔢 Riemann Hypothesis - Zeta Zero Distribution",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;  // Critical line height
      const b = params.b ?? 1.0;  // Zero spacing
      const c = params.c ?? 0.5;  // Critical line position (Re=1/2)
      const d = params.d ?? 1.5;  // Prime correlation
      const e = params.e ?? 0;    // Frequency modulation

      // Critical line at Re(s) = 1/2
      const criticalLine = c;

      // Imaginary axis (where zeros are conjectured to lie)
      const imagPart = v * a * 10;

      // Approximate zero distribution (empirical)
      const zeroSpacing = b * (Math.log(imagPart + 1) / (2 * Math.PI));

      // Prime number resonance pattern
      const primeResonance = d * Math.sin(imagPart / Math.log(imagPart + 2));

      // Zeta function magnitude visualization
      const theta = u * Math.PI * 2;
      const magnitude = Math.abs(Math.sin(imagPart * 0.5 + e)) * zeroSpacing;

      const x = (criticalLine + magnitude * Math.cos(theta)) * a;
      const y = magnitude * Math.sin(theta) * a;
      const z = primeResonance + Math.sin(imagPart * 0.2) * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 4.0, b: 1.0, c: 0.5, d: 1.5, e: 0,
      uSegments: 128, vSegments: 128
    })
  },

  p_vs_np_complexity: {
    name: "💻 P vs NP - Computational Path Energy Model",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Search space size
      const b = params.b ?? 2.0;  // Exponential growth factor
      const c = params.c ?? 1.0;  // Polynomial path
      const d = params.d ?? 1.5;  // NP-complete barrier
      const e = params.e ?? 0;    // Verification ease

      // Problem size (n)
      const n = v * 10 + 1;

      // P complexity: polynomial time O(n^c)
      const pComplexity = c * Math.pow(n, 1.5) * 0.1;

      // NP complexity: exponential time O(b^n)
      const npComplexity = Math.min(10, Math.pow(b, n * 0.3));

      // Computational energy landscape
      const theta = u * Math.PI * 2;
      const energyGap = npComplexity - pComplexity;

      // Verification (NP) vs Solution (P) asymmetry
      const verificationEase = e * Math.exp(-n * 0.2);

      const x = a * (n / 11) * Math.cos(theta); // Represents problem size progression
      const y = a * (n / 11) * Math.sin(theta);
      const z = energyGap + verificationEase - d * Math.sin(n * 0.5);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 2.0, c: 1.0, d: 1.5, e: 0,
      uSegments: 96, vSegments: 96
    })
  },

  quantum_gravity_unified: {
    name: "🌌 Quantum Gravity - Unified Field Geometry",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Spacetime curvature scale
      const b = params.b ?? 1.0;  // Quantum discreteness
      const c = params.c ?? 0.8;  // Planck scale effects
      const d = params.d ?? 1.5;  // Graviton amplitude
      const e = params.e ?? 0;    // Unification phase

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Smooth GR curvature (continuous)
      const grCurvature = a * (1 + d * Math.sin(theta * 2) * Math.sin(phi));

      // Quantum discreteness (Planck length lattice)
      const planckLattice = b * (
        Math.floor(theta * 10) / 10 +
        Math.floor(phi * 10) / 10
      ) * 0.1;

      // Graviton field (spin-2 boson)
      const gravitonField = d * Math.sin(theta * 2 + e) * Math.cos(phi * 2 - e);

      // Unified geometry (smooth + discrete)
      const x = grCurvature * Math.sin(phi) * Math.cos(theta) + planckLattice;
      const y = grCurvature * Math.sin(phi) * Math.sin(theta) + planckLattice;
      const z = grCurvature * Math.cos(phi) + gravitonField;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.0, c: 0.8, d: 1.5, e: 0,
      uSegments: 96, vSegments: 72
    })
  },

  time_symmetry_breaking: {
    name: "⏱️ Time Symmetry Breaking - Entropic Phase Distortion",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Spatial scale
      const b = params.b ?? 1.5;  // Entropy increase rate
      const c = params.c ?? 1.0;  // Time-reversal asymmetry
      const d = params.d ?? 0.8;  // Thermodynamic arrow
      const e = params.e ?? 0;    // Quantum measurement

      const theta = u * Math.PI * 2;
      const time = v; // v represents time axis (0=past, 1=future)

      // Time-symmetric quantum laws (reversible)
      const quantumSymmetric = Math.sin(theta * 3 + e) * Math.cos(theta * 5 - e);

      // Entropy growth (irreversible, breaks time symmetry)
      const entropyGrowth = b * time * time;

      // Thermodynamic arrow visualization
      const arrowStrength = d * (1 - Math.exp(-time * 3));

      // Phase space distortion (increases with time)
      const phaseDistortion = c * Math.sin(theta * 4) * time;

      const radius = a + entropyGrowth;
      const x = radius * Math.cos(theta + phaseDistortion);
      const y = radius * Math.sin(theta + phaseDistortion);
      const z = arrowStrength + quantumSymmetric * (1 - time);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.5, c: 1.0, d: 0.8, e: 0,
      uSegments: 96, vSegments: 72
    })
  },

  homotopy_infinity_category: {
    name: "∞ Homotopy Type - ∞-Category Morphism Paths",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;  // Category dimension
      const b = params.b ?? 1.0;  // Morphism height
      const c = params.c ?? 1.5;  // Higher homotopy levels
      const d = params.d ?? 0.8;  // Path deformation
      const e = params.e ?? 0;    // Composition law

      // Path between objects (1-morphism)
      const pathParam = v;

      // Higher morphisms (2-morphisms, 3-morphisms, ...)
      const level = Math.floor(u * c * 5) % 5;
      const localU = (u * c * 5) % 1;

      // Homotopy path in space
      const theta = localU * Math.PI * 2 + e;

      // Path deformation
      const deformation = d * Math.sin(pathParam * Math.PI) * Math.sin(level * Math.PI / 5);

      // Height increases with morphism level
      const height = b * level;

      const radius = a + deformation;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = height + pathParam * b;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 3.0, b: 1.0, c: 1.5, d: 0.8, e: 0,
      uSegments: 96, vSegments: 96
    })
  },

  // ============================================================================
  // G MOD 6 SPECIAL MODELS - Six-State Rendering Engine
  // Hexagonal cycle system for graphics, animation, and spatial logic
  // ============================================================================

  gmod6_six_phase_cycle: {
    name: "🔄 Six-Phase Cycle - Reset→Growth→Decay",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const phaseAmplitude = params.b ?? 0.5;  // Phase intensity

      // Six-Phase Cycle Model:
      // 0: reset, 1: growth, 2: expansion, 3: contraction, 4: decay, 5: return
      // Creates breathing/pulsing animations

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Determine phase (0-5)
      const phase = Math.floor(theta * 6 / (2 * Math.PI)) % 6;

      // Phase-specific behavior
      let phaseEffect = 0;
      switch(phase) {
        case 0: phaseEffect = 0; break;                    // Reset (baseline)
        case 1: phaseEffect = 0.5 * phaseAmplitude; break; // Growth
        case 2: phaseEffect = 1.0 * phaseAmplitude; break; // Expansion (peak)
        case 3: phaseEffect = 0.7 * phaseAmplitude; break; // Contraction
        case 4: phaseEffect = 0.3 * phaseAmplitude; break; // Decay
        case 5: phaseEffect = 0.1 * phaseAmplitude; break; // Return
      }

      const r = scale * (0.6 + 0.4 * phaseEffect);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0.5,
      uSegments: 72, 
      vSegments: 54 
    })
  },

  gmod6_topology_selector: {
    name: "🔮 Topology Selector - 6 Mesh Types",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const blendFactor = params.b ?? 0.5;  // Blend between topologies

      // Topology Selector: Each state loads one of six mesh topologies
      // cube, sphere, torus, plane, cylinder, tetrahedron

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Topology index
      const topoIndex = Math.floor(theta * 6 / (2 * Math.PI)) % 6;

      // Generate different topological features
      let topoMod = 0;
      switch(topoIndex) {
        case 0: // Cube-like
          topoMod = Math.max(Math.abs(Math.cos(theta)), Math.abs(Math.sin(phi))) * 0.3;
          break;
        case 1: // Sphere-like (baseline)
          topoMod = 0;
          break;
        case 2: // Torus-like
          topoMod = Math.sin(theta * 2) * 0.25;
          break;
        case 3: // Plane-like (flattened)
          topoMod = -0.3 * Math.cos(phi);
          break;
        case 4: // Cylinder-like
          topoMod = 0.2 * (1 - Math.abs(Math.cos(phi)));
          break;
        case 5: // Tetrahedron-like
          topoMod = Math.sin(theta * 3) * Math.cos(phi * 2) * 0.25;
          break;
      }

      const r = scale * (0.7 + topoMod * blendFactor);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0.5,
      uSegments: 72, 
      vSegments: 54 
    })
  },

  gmod6_physics_impulse: {
    name: "⚡ Physics Impulse Cycle - 6 Directional Vibrations",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const impulseStrength = params.b ?? 0.4;  // Vibration intensity

      // Physics Impulse Model: 6 impulses form complete oscillation
      // Used for cloth, soft body, wave simulations

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Impulse direction (0-5)
      const impulseDir = Math.floor(theta * 6 / (2 * Math.PI)) % 6;

      // Six directional impulses (hexagonal directions)
      const impulseAngle = impulseDir * Math.PI / 3;  // 60° increments
      const impulseX = Math.cos(impulseAngle) * impulseStrength;
      const impulseY = Math.sin(impulseAngle) * impulseStrength;

      // Ripple from impulse
      const ripple = Math.sin(phi * 4 + impulseDir) * 0.1;

      const r = scale * (0.7 + ripple);

      const x = r * Math.sin(phi) * Math.cos(theta) + impulseX * Math.sin(phi);
      const y = r * Math.sin(phi) * Math.sin(theta) + impulseY * Math.sin(phi);
      const z = r * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0.4,
      uSegments: 72, 
      vSegments: 48 
    })
  },

  gmod6_pattern_generator: {
    name: "🎨 Pattern Generator - Braids, Tiles, Ripples",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const patternType = Math.floor(params.b ?? 0) % 6;  // 0-5 pattern types

      // Pattern Generator: Produces repeating structural patterns
      // braids, tiles, ripples, fractal seeds

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Determine pattern based on type
      let pattern = 0;
      switch(patternType) {
        case 0: // Braid pattern
          pattern = Math.sin(theta * 3) * Math.cos(phi * 2) * 0.3;
          break;
        case 1: // Tiling loop
          pattern = (Math.floor(theta * 4) % 2 + Math.floor(phi * 4) % 2) * 0.15 - 0.15;
          break;
        case 2: // Ripple pattern
          pattern = Math.sin(Math.sqrt(theta * theta + phi * phi) * 8) * 0.25;
          break;
        case 3: // Fractal seed
          pattern = Math.sin(theta * 6) * Math.sin(phi * 6) * Math.cos(theta * phi) * 0.3;
          break;
        case 4: // Weave pattern
          pattern = Math.sin(theta * 8) * 0.1 + Math.sin(phi * 8) * 0.1;
          break;
        case 5: // Crystal lattice
          pattern = Math.cos(theta * 4) * Math.cos(phi * 4) * 0.25;
          break;
      }

      const r = scale * (0.7 + pattern);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0,
      uSegments: 72, 
      vSegments: 54 
    })
  },

  gmod6_dimensional_cluster: {
    name: "🌌 Dimensional Cluster - 6 Layer Phasing",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const phaseShift = params.b ?? 0.3;  // Inter-layer phase

      // Dimensional Cluster: 6 states as 6 layers/dimensions
      // Creates tiered structures, portals, phasing effects

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Layer/dimension index
      const layer = Math.floor(theta * 6 / (2 * Math.PI)) % 6;

      // Each layer at different phase
      const layerPhase = layer * phaseShift;
      const layerR = 1 + layer * 0.05;  // Slightly different radii

      // Portal-like distortion between layers
      const portalEffect = Math.sin(theta * 6) * Math.exp(-Math.abs(theta * 6 % (Math.PI/3) - Math.PI/6)) * 0.2;

      const r = scale * (0.6 + 0.3 * layerR + portalEffect);

      const x = r * Math.sin(phi + layerPhase * 0.1) * Math.cos(theta);
      const y = r * Math.sin(phi + layerPhase * 0.1) * Math.sin(theta);
      const z = r * Math.cos(phi + layerPhase * 0.1);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0.3,
      uSegments: 72, 
      vSegments: 54 
    })
  },

  gmod6_vertex_group: {
    name: "🔷 Vertex Group Deformation - 6 Clusters",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const deformStrength = params.b ?? 0.4;  // Deformation intensity

      // Vertex Group: 6 repeating vertex clusters
      // Used for alternating deformation patterns

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Vertex cluster assignment
      const cluster = Math.floor(theta * 6 / (2 * Math.PI)) % 6;

      // Each cluster has unique deformation
      const clusterDeform = Math.sin((cluster + 1) * phi) * Math.cos(theta * (cluster + 1)) * deformStrength;

      // Cluster boundary smoothing
      const clusterBlend = Math.sin(theta * 6) * 0.05;

      const r = scale * (0.7 + clusterDeform * 0.3 + clusterBlend);

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, 
      b: 0.4,
      uSegments: 72, 
      vSegments: 54 
    })
  },

  // ============================================================================
  // NEWTON'S APPLE - Classic Physics Symbol
  // Mathematical representation of the iconic apple that inspired gravity theory
  // ============================================================================

  newtons_apple: {
    name: "🍎 Newton's Apple - Gravity Inspiration",
    description: "The apple that inspired Newton's theory of universal gravitation - parametric apple shape with stem",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const biteDepth = params.b ?? 0.3;
      const stemHeight = params.c ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Apple body - cardioid-like shape
      const r = scale * (1 - 0.1 * Math.cos(4 * theta)) * Math.sin(phi);
      
      // Add indentation at top (stem area)
      const topIndent = 0.3 * Math.exp(-10 * Math.pow(phi - 0.1, 2));
      
      // Add dimple at bottom
      const bottomDimple = 0.2 * Math.exp(-10 * Math.pow(phi - Math.PI + 0.1, 2));
      
      const modifiedR = r * (1 - topIndent - bottomDimple);
      
      // Optional bite mark
      const biteAngle = Math.PI * 0.5;
      const biteFactor = biteDepth * Math.exp(-5 * Math.pow(theta - biteAngle, 2)) * Math.exp(-3 * Math.pow(phi - Math.PI/2, 2));
      
      const x = (modifiedR - biteFactor) * Math.sin(phi) * Math.cos(theta);
      const y = scale * Math.cos(phi) * 1.1 + (phi < 0.2 ? stemHeight * (0.2 - phi) * 5 : 0);
      const z = (modifiedR - biteFactor) * Math.sin(phi) * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 0, c: 0.5,
      uSegments: 72, vSegments: 54 
    })
  },

  // ============================================================================
  // METATRON'S CUBE ENHANCED - Sacred Geometry Masterpiece
  // Contains all 5 Platonic solids and the Flower of Life pattern
  // ============================================================================

  metatrons_cube_enhanced: {
    name: "⬡ Metatron's Cube Enhanced - Sacred Geometry",
    description: "Sacred geometric figure containing all Platonic solids - interconnected circles and lines representing cosmic creation",
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const depth = params.b ?? 0.5;
      const complexity = params.c ?? 6;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      // Create 13-circle Metatron pattern with 3D depth
      const numCircles = Math.floor(complexity);
      
      // Central circle
      let x = 0, y = 0, z = 0;
      
      // Inner ring of 6 circles
      const innerAngle = Math.floor(u * 6) * Math.PI / 3;
      const innerRadius = scale * 0.5;
      
      // Outer ring of 6 circles
      const outerAngle = (Math.floor(u * 6) + 0.5) * Math.PI / 3;
      const outerRadius = scale;
      
      // Create interconnected mesh surface
      const circleSelect = Math.floor(v * 13);
      let cx = 0, cy = 0;
      
      if (circleSelect === 0) {
        cx = 0; cy = 0; // Center
      } else if (circleSelect <= 6) {
        const angle = (circleSelect - 1) * Math.PI / 3;
        cx = innerRadius * Math.cos(angle);
        cy = innerRadius * Math.sin(angle);
      } else {
        const angle = (circleSelect - 7 + 0.5) * Math.PI / 3;
        cx = outerRadius * Math.cos(angle);
        cy = outerRadius * Math.sin(angle);
      }
      
      const localTheta = u * Math.PI * 2;
      const circleR = scale * 0.3;
      
      x = cx + circleR * Math.cos(localTheta);
      y = cy + circleR * Math.sin(localTheta);
      z = depth * Math.sin(theta * 6) * Math.cos(phi * 6);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 0.5, c: 6,
      uSegments: 144, vSegments: 72 
    })
  },

  // ============================================================================
  // ANNULUS TORUS - Ring Within Ring (Detailed Wireframe Version)
  // Complex double-ring torus with intricate surface details matching OBJ model
  // ============================================================================

  annulus_torus: {
    name: "◎ Annulus Torus - Ring Within Ring",
    description: "A detailed torus with annular cross-section featuring surface ribbing, wave patterns, and mathematical precision",
    equation: (u, v, params) => {
      const majorRadius = params.a ?? 1.8;
      const outerMinor = params.b ?? 0.4;
      const innerMinor = params.c ?? 0.15;
      const twist = params.d ?? 0;
      const ribCount = params.e ?? 12;
      const ribDepth = params.f ?? 0.05;
      const waveFreq = params.g ?? 6;
      const waveAmp = params.h ?? 0.02;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      // Annular cross-section (ring within ring)
      const annulusRadius = (outerMinor + innerMinor) / 2;
      const tubeRadius = Math.abs(outerMinor - innerMinor) / 2 + 0.05;
      
      // Create the annulus cross-section with surface detail
      const ribbing = ribDepth * Math.sin(ribCount * theta) * Math.cos(ribCount * phi);
      const waveDetail = waveAmp * Math.sin(waveFreq * theta) * Math.sin(waveFreq * phi * 2);
      const surfaceDetail = ribbing + waveDetail;
      
      const r = annulusRadius + (tubeRadius + surfaceDetail) * Math.cos(phi);
      
      // Apply twist along the major circumference
      const twistedPhi = phi + twist * theta * 0.1;
      
      // Add subtle radial variation for organic feel
      const radialVar = 0.02 * Math.sin(8 * theta) * Math.cos(4 * phi);
      
      // Torus coordinates with detailed annular tube
      const x = (majorRadius + r * Math.cos(twistedPhi) + radialVar) * Math.cos(theta);
      const y = (majorRadius + r * Math.cos(twistedPhi) + radialVar) * Math.sin(theta);
      const z = r * Math.sin(twistedPhi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, b: 0.4, c: 0.15, d: 0, e: 12, f: 0.05, g: 6, h: 0.02,
      uSegments: 128, vSegments: 64 
    })
  }

};

function factorial(n: number): number {
  if (n <= 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

/**
 * SCIENTIFIC VALIDATION & ATTRIBUTION
 * 
 * All 34 discovered biological structures (2024) are scientifically validated with:
 * - Accurate microscopic dimensions from peer-reviewed literature
 * - Proper cellular/molecular characteristics
 * - Visualization scaling factors for 3D display
 * 
 * Author: Phillip Aguilar Ruiz III
 * Organization: UUON Foundation Inc.
 * Domain: www.uuonfoundation.com
 * Contact: phi1@uuonfoundation.com, philruiziii@gmail.com
 * Instagram: @uuon.foundation
 * YouTube: https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ
 * 3D Models: https://www.cgtrader.com/designers/uuon-foundation
 * 
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 * Product of UUON Foundation, no undocumented reproduction or any use without written consent.
 */

// Total: 581+ shapes in UNIFIED_SHAPES across 33+ categories including:
// - 36 BIOLOGICAL + 5 NANOMATERIALS + 10 WAVE SHAPES + 6 FRACTAL TIME & QUANTUM PHYSICS
// - 8 DIAMOND CUTS + 16 AI ALGORITHMS + 5 AZTEC FIVE SUNS
// - 15 MULTIDIMENSIONAL COMPLEX FRACTALS (Kuan Peng Extensions)
// - 5 CRYPTOGRAPHIC ALGORITHMS (AES, SHA-256, ECC, Keccak, Lattice-based) - Nov 11, 2025
// - 8 QUANTUM ENTANGLEMENT ALGORITHMS (Bell State, EPR, GHZ, W State, etc.) - Nov 11, 2025
// - 13 UNSOLVED MATHEMATICAL PROBLEMS (Nested Spheres, Navier-Stokes, Yang-Mills, Riemann, P vs NP, etc.) - Nov 12, 2025
// - 5 BLACK HOLE & MULTIVERSE MODELS (Gogberashvili, Gravastar, Photon Spheres, Nested Horizons, Dyson Binary) - Nov 12, 2025
// - 10 ADVANCED COMPUTATIONAL ALGORITHMS (AMR, Catmull-Clark, Poisson, Spectral, Level Set, DDG, FFT, RBF, Dual Contouring, PBD) - NEW Nov 18, 2025
// - 10 THEORY OF EVERYTHING CANDIDATES (Polyakov Action, M-Theory, LQG, SUSY, GUT, Standard Model) - NEW Nov 28, 2025
// - 18 TEN PERCENT SYSTEMS - Visible/Hidden Dynamics (Iceberg, DNA, EM Spectrum, Universe, Neural Networks, etc.) - NEW Nov 28, 2025
// - Plus molecular machines, human anatomy, quantum mechanics, physics equations, and more

// Merge Theory of Everything shapes into UNIFIED_SHAPES
Object.assign(UNIFIED_SHAPES, THEORY_OF_EVERYTHING_SHAPES);

// Merge 10% Systems shapes into UNIFIED_SHAPES
Object.assign(UNIFIED_SHAPES, TEN_PERCENT_SHAPES);

// Merge Life Sciences shapes (Molecular Biology, Microbiology, Botany, Zoology/Ecology)
Object.assign(UNIFIED_SHAPES, LIFE_SCIENCES_SHAPES);

// Merge Earth Sciences shapes (Geology, Oceanography, Meteorology)
Object.assign(UNIFIED_SHAPES, EARTH_SCIENCES_SHAPES);

// Merge Social Sciences shapes (Economics, Sociology, Political Science, Engineering)
Object.assign(UNIFIED_SHAPES, SOCIAL_SCIENCES_SHAPES);

// Merge Scientific Expansion shapes (Comprehensive interdisciplinary)
Object.assign(UNIFIED_SHAPES, SCIENTIFIC_EXPANSION_SHAPES);

// Merge Unified Master Equation shapes (dΨ/dt = F(Ψ))
Object.assign(UNIFIED_SHAPES, UNIFIED_MASTER_EQUATION_SHAPES);

// Merge Schrödinger Equation shapes (time-dependent, time-independent, QHO, particle-in-box)
Object.assign(UNIFIED_SHAPES, SCHRODINGER_EQUATIONS);

// Merge General Relativity shapes (Ricci, Riemann, geodesics, Lorentz, FLRW, BSSN, etc.)
Object.assign(UNIFIED_SHAPES, GENERAL_RELATIVITY_SHAPES);

// Merge G Mod 6 surfaces into UNIFIED_SHAPES
Object.assign(UNIFIED_SHAPES, GMOD6_SURFACES);

// Merge Topology & Differential Geometry shapes (34 shapes) - Nov 30, 2025
Object.assign(UNIFIED_SHAPES, TOPOLOGY_DIFFERENTIAL_SHAPES);

// Merge QPU & Quantum Computing shapes (40 shapes) - Nov 30, 2025
Object.assign(UNIFIED_SHAPES, QPU_QUANTUM_COMPUTING_SHAPES);

// Merge Fractal Analysis & TEM/SEM shapes (35 shapes) - Nov 30, 2025
Object.assign(UNIFIED_SHAPES, FRACTAL_ANALYSIS_SHAPES);

// Merge Ice Crystal & Snowflake shapes (16 shapes) - Dec 7, 2025
// 6-fold symmetric ice crystals, Koch fractals, dendrites, stellar plates
const convertedIceCrystals: Record<string, ParametricSurface> = {};
for (const [key, shape] of Object.entries(ICE_CRYSTAL_SHAPES)) {
  convertedIceCrystals[key] = {
    name: shape.name,
    description: shape.description,
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const p = params as unknown as Record<string, number>;
      return [shape.x(u, v, p), shape.y(u, v, p), shape.z(u, v, p)];
    },
    defaultParams: { a: 1, b: 1, c: 0.1, d: 3 }
  };
}
Object.assign(UNIFIED_SHAPES, convertedIceCrystals);
console.log(`❄️ Merged ${Object.keys(convertedIceCrystals).length} ice crystal shapes into UNIFIED_SHAPES`);

// Merge Fractal Iteration Formula shapes (18 shapes) - Dec 7, 2025
// Mandelbrot z² + c, cubic z³ + c, exponential eᶻ + c, burning ship, etc.
const convertedFractalIterations: Record<string, ParametricSurface> = {};
for (const [key, shape] of Object.entries(FRACTAL_SHAPE_IMPLEMENTATIONS)) {
  convertedFractalIterations[key] = {
    name: shape.name,
    description: shape.description,
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const p = params as unknown as Record<string, number>;
      return shape.getPosition(u, v, p);
    },
    defaultParams: { a: 2, b: 5, c: 50 }
  };
}
Object.assign(UNIFIED_SHAPES, convertedFractalIterations);
console.log(`∞ Merged ${Object.keys(convertedFractalIterations).length} fractal iteration shapes into UNIFIED_SHAPES`);

// Merge Dmension Pattern Codex shapes (40 shapes) - Dec 8, 2025
// Prime patterns, harmonic/golden ratio, figurate numbers, chaotic attractors,
// aperiodic sequences, modular cycles, exponential patterns, topological, bitwise
Object.assign(UNIFIED_SHAPES, DMENSION_PATTERN_CODEX);
console.log(`🔱 Merged ${Object.keys(DMENSION_PATTERN_CODEX).length} Dmension Pattern Codex shapes into UNIFIED_SHAPES`);

// Merge UUON-Mesh Engine shapes (12 shapes) - Dec 9, 2025
// Noise-reactive parametric 3D geometry with A/B/C morphological controls
// Emergent patterns, harmonic interference, curvature flow, symmetry lattices
Object.assign(UNIFIED_SHAPES, UUON_MESH_SHAPES);
console.log(`🌊 Merged ${UUON_MESH_SHAPE_COUNT} UUON-Mesh Engine shapes into UNIFIED_SHAPES`);

// Merge Harmony Wave Shapes (18 shapes) - Dec 9, 2025
// Musical harmony, symphony orchestration, wave dynamics, morphing, 4D projections, thermal cooling
Object.assign(UNIFIED_SHAPES, HARMONY_WAVE_SHAPES);
console.log(`🎵 Merged ${HARMONY_WAVE_SHAPE_COUNT} Harmony Wave shapes into UNIFIED_SHAPES`);

// Merge Atomic Structure Shapes (21 shapes) - Dec 9, 2025
// Bohr/Rutherford models, electron orbitals (s/p/d/f), molecular bonds, electron associations
Object.assign(UNIFIED_SHAPES, ATOMIC_STRUCTURE_SHAPES);
console.log(`⚛️ Merged ${ATOMIC_STRUCTURE_SHAPE_COUNT} Atomic Structure shapes into UNIFIED_SHAPES`);

// Merge Historical Algorithms (29 shapes) - Dec 9, 2025
// Euclidean algorithm, Archimedes' spiral, Fibonacci sequence, Newton's method, etc.
Object.assign(UNIFIED_SHAPES, HISTORICAL_ALGORITHMS);
console.log(`📜 Merged ${HISTORICAL_ALGORITHMS_COUNT} Historical Algorithm shapes into UNIFIED_SHAPES`);

// Merge Unified Theory of Everything Canvas (10 shapes) - Dec 9, 2025
// Complete unified field visualizations: quantum-gravity interface, four forces mandala,
// string landscape, holographic universe, supersymmetry, grand unification, complete universe fabric
Object.assign(UNIFIED_SHAPES, UNIFIED_TOE_CANVAS);
console.log(`🌌 Merged ${UNIFIED_TOE_CANVAS_COUNT} Unified TOE Canvas shapes into UNIFIED_SHAPES`);

// ============================================================================
// ADVANCED FRACTAL FORMULAS - Dec 10, 2025
// Higher-order polynomial & hybrid fractals with physics-meaningful defaults
// ============================================================================

const ADVANCED_FRACTAL_FORMULAS: Record<string, ParametricSurface> = {
  hexic_spirals: {
    name: "🌀 Hexic Spirals - z⁶ + c (6-fold symmetry)",
    description: "Julia set fractal with 6-fold rotational symmetry using z^6 + c iteration",
    equation: (u, v, params) => {
      const scale = params.a ?? 2.5;
      const maxIter = params.b ?? 50;
      const bailout = params.c ?? 4.0;
      const cx = params.d ?? -0.4;
      const cy = params.e ?? 0.1;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const zr2 = zr * zr;
        const zi2 = zi * zi;
        const zr4 = zr2 * zr2 - 6 * zr2 * zi2 + zi2 * zi2;
        const zi4 = 4 * zr * zi * (zr2 - zi2);
        const newZr = zr4 * zr2 - zi4 * zi2 - 15 * zr2 * zr2 * zi2 + 15 * zr2 * zi2 * zi2 + cx;
        const newZi = zr4 * zi2 + zi4 * zr2 + 6 * zr * zi * (zr4 - zi2 * zi2) + cy;
        zr = zr2 * zr2 * zr2 - 15 * zr2 * zr2 * zi2 + 15 * zr2 * zi2 * zi2 - zi2 * zi2 * zi2 + cx;
        zi = 6 * zr2 * zr2 * zr * zi - 20 * zr2 * zr * zi2 * zi + 6 * zr * zi2 * zi2 * zi + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.5, b: 50, c: 4.0, d: -0.4, e: 0.1,
      uSegments: 128, vSegments: 128 
    })
  },

  septic_vortex: {
    name: "🌪️ Septic Vortex - z⁷ + c (7-fold asymmetric)",
    description: "Julia set fractal with 7-fold asymmetric vortex patterns using z^7 + c",
    equation: (u, v, params) => {
      const scale = params.a ?? 2.0;
      const maxIter = params.b ?? 40;
      const bailout = params.c ?? 4.0;
      const cx = params.d ?? 0.3;
      const cy = params.e ?? -0.2;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const r = Math.sqrt(zr * zr + zi * zi);
        const theta = Math.atan2(zi, zr);
        const r7 = Math.pow(r, 7);
        const theta7 = theta * 7;
        zr = r7 * Math.cos(theta7) + cx;
        zi = r7 * Math.sin(theta7) + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2.5;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.0, b: 40, c: 4.0, d: 0.3, e: -0.2,
      uSegments: 128, vSegments: 128 
    })
  },

  octagonal_mandala: {
    name: "🔮 Octagonal Mandala - z⁸ + c (8-fold symmetry)",
    description: "Julia set fractal with perfect 8-fold symmetry using z^8 + c iteration",
    equation: (u, v, params) => {
      const scale = params.a ?? 1.8;
      const maxIter = params.b ?? 35;
      const bailout = params.c ?? 4.0;
      const cx = params.d ?? 0.28;
      const cy = params.e ?? 0.0;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const r = Math.sqrt(zr * zr + zi * zi);
        const theta = Math.atan2(zi, zr);
        const r8 = Math.pow(r, 8);
        const theta8 = theta * 8;
        zr = r8 * Math.cos(theta8) + cx;
        zi = r8 * Math.sin(theta8) + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 3.0;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, b: 35, c: 4.0, d: 0.28, e: 0.0,
      uSegments: 128, vSegments: 128 
    })
  },

  wave_energy_hybrid: {
    name: "⚡ Wave Energy Hybrid - z² + sin(z) + eᶻ + c",
    description: "Hybrid fractal combining polynomial, trigonometric, and exponential terms",
    equation: (u, v, params) => {
      const scale = params.a ?? 3.0;
      const maxIter = params.b ?? 30;
      const bailout = params.c ?? 10.0;
      const cx = params.d ?? -0.5;
      const cy = params.e ?? 0.3;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const zr2 = zr * zr - zi * zi;
        const zi2 = 2 * zr * zi;
        const sinZr = Math.sin(zr) * Math.cosh(zi);
        const sinZi = Math.cos(zr) * Math.sinh(zi);
        const expR = Math.exp(zr);
        const expZr = expR * Math.cos(zi);
        const expZi = expR * Math.sin(zi);
        zr = zr2 + sinZr + expZr * 0.1 + cx;
        zi = zi2 + sinZi + expZi * 0.1 + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2.0;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 3.0, b: 30, c: 10.0, d: -0.5, e: 0.3,
      uSegments: 100, vSegments: 100 
    })
  },

  spike_shell_armor: {
    name: "🦔 Spike Shell Armor - z³ + tan(z) + log(z²+1) + c",
    description: "Complex hybrid fractal with sharp spike patterns from tangent function",
    equation: (u, v, params) => {
      const scale = params.a ?? 2.5;
      const maxIter = params.b ?? 25;
      const bailout = params.c ?? 8.0;
      const cx = params.d ?? 0.2;
      const cy = params.e ?? -0.4;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const zr3 = zr * zr * zr - 3 * zr * zi * zi;
        const zi3 = 3 * zr * zr * zi - zi * zi * zi;
        const denom = Math.cos(2 * zr) + Math.cosh(2 * zi);
        const tanZr = denom !== 0 ? Math.sin(2 * zr) / denom : 0;
        const tanZi = denom !== 0 ? Math.sinh(2 * zi) / denom : 0;
        const logArg = zr * zr - zi * zi + 1;
        const logMag = Math.sqrt(logArg * logArg + (2 * zr * zi) * (2 * zr * zi));
        const logZr = logMag > 0 ? Math.log(logMag) * 0.5 : 0;
        const logZi = Math.atan2(2 * zr * zi, logArg);
        zr = zr3 + tanZr * 0.3 + logZr * 0.2 + cx;
        zi = zi3 + tanZi * 0.3 + logZi * 0.2 + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2.5;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.5, b: 25, c: 8.0, d: 0.2, e: -0.4,
      uSegments: 100, vSegments: 100 
    })
  },

  crystal_flame_fusion: {
    name: "🔥 Crystal Flame Fusion - z⁵ + z·eᶻ + sinh(z) + c",
    description: "Quintic polynomial with exponential and hyperbolic flame-like patterns",
    equation: (u, v, params) => {
      const scale = params.a ?? 2.2;
      const maxIter = params.b ?? 30;
      const bailout = params.c ?? 6.0;
      const cx = params.d ?? -0.3;
      const cy = params.e ?? 0.15;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const r = Math.sqrt(zr * zr + zi * zi);
        const theta = Math.atan2(zi, zr);
        const r5 = Math.pow(r, 5);
        const zr5 = r5 * Math.cos(5 * theta);
        const zi5 = r5 * Math.sin(5 * theta);
        const expR = Math.exp(zr);
        const zExpZr = (zr * expR * Math.cos(zi) - zi * expR * Math.sin(zi)) * 0.1;
        const zExpZi = (zr * expR * Math.sin(zi) + zi * expR * Math.cos(zi)) * 0.1;
        const sinhZr = Math.sinh(zr) * Math.cos(zi) * 0.2;
        const sinhZi = Math.cosh(zr) * Math.sin(zi) * 0.2;
        zr = zr5 + zExpZr + sinhZr + cx;
        zi = zi5 + zExpZi + sinhZi + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2.8;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.2, b: 30, c: 6.0, d: -0.3, e: 0.15,
      uSegments: 100, vSegments: 100 
    })
  },

  bio_organic_tissue: {
    name: "🧬 Bio-Organic Tissue - (z²+z³) + sin(z²) + e^(z/2) + c",
    description: "Organic cell-like patterns combining quadratic/cubic with sinusoidal and exponential growth",
    equation: (u, v, params) => {
      const scale = params.a ?? 2.8;
      const maxIter = params.b ?? 35;
      const bailout = params.c ?? 8.0;
      const cx = params.d ?? -0.2;
      const cy = params.e ?? 0.25;
      
      let zr = (u - 0.5) * scale * 2;
      let zi = (v - 0.5) * scale * 2;
      let iter = 0;
      
      while (zr * zr + zi * zi < bailout && iter < maxIter) {
        const zr2 = zr * zr - zi * zi;
        const zi2 = 2 * zr * zi;
        const zr3 = zr2 * zr - zi2 * zi;
        const zi3 = zr2 * zi + zi2 * zr;
        const sinArgR = zr2;
        const sinArgI = zi2;
        const sinZ2r = Math.sin(sinArgR) * Math.cosh(sinArgI) * 0.3;
        const sinZ2i = Math.cos(sinArgR) * Math.sinh(sinArgI) * 0.3;
        const halfZr = zr * 0.5;
        const halfZi = zi * 0.5;
        const expHalf = Math.exp(halfZr);
        const expZr = expHalf * Math.cos(halfZi) * 0.15;
        const expZi = expHalf * Math.sin(halfZi) * 0.15;
        zr = zr2 + zr3 * 0.5 + sinZ2r + expZr + cx;
        zi = zi2 + zi3 * 0.5 + sinZ2i + expZi + cy;
        iter++;
      }
      
      const height = (iter / maxIter) * 2.2;
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.8, b: 35, c: 8.0, d: -0.2, e: 0.25,
      uSegments: 100, vSegments: 100 
    })
  }
};

Object.assign(UNIFIED_SHAPES, ADVANCED_FRACTAL_FORMULAS);
console.log(`🔬 Merged ${Object.keys(ADVANCED_FRACTAL_FORMULAS).length} Advanced Fractal Formula shapes into UNIFIED_SHAPES`);

// PARAMETRIC LIBRARY PACK - 39+ foundational parametric forms
import { PARAMETRIC_LIBRARY_PACK } from './parametricLibraryPack';

// Convert parametric library pack to UNIFIED_SHAPES format
const convertedParametricLibrary: Record<string, any> = {};
for (const [key, shape] of Object.entries(PARAMETRIC_LIBRARY_PACK)) {
  convertedParametricLibrary[key] = {
    name: shape.name,
    description: shape.description,
    equation: shape.equation,
    defaultParams: shape.defaultParams
  };
}
Object.assign(UNIFIED_SHAPES, convertedParametricLibrary);
console.log(`📐 Merged ${Object.keys(convertedParametricLibrary).length} Parametric Library Pack shapes into UNIFIED_SHAPES`);

// Merge Complete Missing Shapes Library (includes mobius_strip, catenoid, helicoid, enneper_surface for Lexicon Engine)
Object.assign(UNIFIED_SHAPES, COMPLETE_MISSING_SHAPES);
console.log(`🔧 Merged ${Object.keys(COMPLETE_MISSING_SHAPES).length} Complete Missing Shapes (Lexicon-compatible) into UNIFIED_SHAPES`);

// Merge Thermal Engineering & Data Center Cooling Shapes
Object.assign(UNIFIED_SHAPES, THERMAL_ENGINEERING_SHAPES);
console.log(`🔥 Merged ${THERMAL_ENGINEERING_SHAPE_COUNT} Thermal Engineering & Data Center Cooling shapes into UNIFIED_SHAPES`);

// Merge Cross-Domain Hybrid Shapes - Publication Section 3.1
Object.assign(UNIFIED_SHAPES, CROSS_DOMAIN_HYBRID_SHAPES);
console.log(`🔗 Merged ${CROSS_DOMAIN_HYBRID_SHAPE_COUNT} Cross-Domain Hybrid Shapes into UNIFIED_SHAPES`);

// Merge 5D/6D Higher-Dimensional Shapes
import { FIVE_DIMENSIONAL_SHAPES, HIGHER_DIMENSIONAL_SHAPES } from './higherDimensionalShapes';
Object.assign(UNIFIED_SHAPES, FIVE_DIMENSIONAL_SHAPES);
Object.assign(UNIFIED_SHAPES, HIGHER_DIMENSIONAL_SHAPES);
const HIGHER_DIM_COUNT = Object.keys(FIVE_DIMENSIONAL_SHAPES).length + Object.keys(HIGHER_DIMENSIONAL_SHAPES).length;
console.log(`🔮 Merged ${HIGHER_DIM_COUNT} Higher-Dimensional (5D/6D+) shapes into UNIFIED_SHAPES`);

// Merge Higher-Dimensional Gaps (25 additional 4D/5D shapes including bitruncated-tesseract, duoprism-4d, etc.)
import { HIGHER_DIMENSIONAL_GAPS, HIGHER_DIMENSIONAL_GAPS_COUNT } from './higherDimensionalGaps';
Object.assign(UNIFIED_SHAPES, HIGHER_DIMENSIONAL_GAPS);
console.log(`🔮 Merged ${HIGHER_DIMENSIONAL_GAPS_COUNT} Higher-Dimensional Gaps (4D/5D advanced) into UNIFIED_SHAPES`);

// Merge 4D Specialized Shapes (4D Mobius, 4D Quantum Hall, etc.)
import { FOUR_DIMENSIONAL_4D_SHAPES } from './fourDimensional4DShapes';
Object.assign(UNIFIED_SHAPES, FOUR_DIMENSIONAL_4D_SHAPES);
console.log(`🧊 Merged ${Object.keys(FOUR_DIMENSIONAL_4D_SHAPES).length} Specialized 4D shapes into UNIFIED_SHAPES`);

// Merge Scientific Identity Shapes (ALAREX) - Chemistry, Nuclear, Biology, Medicine
Object.assign(UNIFIED_SHAPES, SCIENTIFIC_IDENTITY_SHAPES);
console.log(`🔬 Merged ${SCIENTIFIC_IDENTITY_SHAPE_COUNT} Scientific Identity (CIP/NIP/BIP/MIP) shapes into UNIFIED_SHAPES`);

// Merge Time Principle & Phenomenon Principle Shapes
Object.assign(UNIFIED_SHAPES, ALL_TIME_PHENOMENON_SHAPES);
const TIME_PHENOMENON_COUNT = Object.keys(TIME_PRINCIPLE_SHAPES).length + Object.keys(PHENOMENON_PRINCIPLE_SHAPES).length + Object.keys(UNIFIED_PRINCIPLE_SHAPES).length;
console.log(`⏱️ Merged ${TIME_PHENOMENON_COUNT} Time & Phenomenon Principle shapes into UNIFIED_SHAPES`);
console.log(`   🎁 Now Principle: Present as transformation operator where potential becomes form`);
console.log(`   🌟 Phenomenon Principle: Reality expressing through structure, energy, information`);

// Merge Linguistic Geometry Shapes (A-Z Letter Surfaces)
Object.assign(UNIFIED_SHAPES, LINGUISTIC_GEOMETRY_SHAPES);
console.log(`🔤 Merged ${Object.keys(LINGUISTIC_GEOMETRY_SHAPES).length} Linguistic Geometry (A-Z) shapes into UNIFIED_SHAPES`);
console.log(`   📖 Finding geometric meaning in words, letters, and expressions`);

// Merge Medical Imaging Shapes (CT, MRI, Volume Rendering, MPR, Displacement)
import { MEDICAL_IMAGING_SHAPES, MEDICAL_IMAGING_CATEGORIES } from './medicalImagingShapes';

const convertedMedicalImaging: Record<string, ParametricSurface> = {};
for (const [key, shape] of Object.entries(MEDICAL_IMAGING_SHAPES)) {
  convertedMedicalImaging[key] = {
    name: `🏥 ${shape.name}`,
    description: shape.description,
    equation: (u, v, params) => {
      const numericParams = Object.fromEntries(
        Object.entries(params).filter(([_, val]) => typeof val === 'number')
      ) as Record<string, number>;
      const result = shape.generate({
        ...shape.defaults,
        ...numericParams,
        u: u * Math.PI * 2 - Math.PI,
        v: v * Math.PI * 2 - Math.PI
      });
      return [result.x, result.y, result.z];
    },
    defaultParams: {
      a: shape.defaults.A ?? 1,
      b: shape.defaults.B ?? 1,
      c: shape.defaults.C ?? 1,
      d: shape.defaults.D ?? 0,
      e: shape.defaults.E ?? 0,
      f: shape.defaults.F ?? 1,
      g: shape.defaults.G ?? 0,
      x: shape.defaults.X ?? 1,
      y: shape.defaults.Y ?? 1,
      z: shape.defaults.Z ?? 1,
      uSegments: 64,
      vSegments: 64
    }
  };
}
Object.assign(UNIFIED_SHAPES, convertedMedicalImaging);
const MEDICAL_IMAGING_COUNT = Object.keys(MEDICAL_IMAGING_SHAPES).length;
console.log(`🏥 Merged ${MEDICAL_IMAGING_COUNT} Medical Imaging shapes into UNIFIED_SHAPES`);
console.log(`   📊 CT Imaging: Slice stacks, Hounsfield units, windowing`);
console.log(`   🧲 MRI Techniques: Signal intensity, DTI, tractography`);
console.log(`   📦 Volume Rendering: Ray casting, MIP, isosurfaces`);
console.log(`   ✂️ MPR: Coronal, sagittal, axial, oblique planes`);

// Merge Slinky Dynamics Shapes - Wave mechanics, spring physics, Lagrangian models
import { SLINKY_DYNAMICS_SHAPES } from './slinkyDynamicsShapes';
Object.assign(UNIFIED_SHAPES, SLINKY_DYNAMICS_SHAPES);
const SLINKY_COUNT = Object.keys(SLINKY_DYNAMICS_SHAPES).length;
console.log(`🔗 Merged ${SLINKY_COUNT} Slinky Dynamics shapes into UNIFIED_SHAPES`);
console.log(`   🌀 Time-Varying Helix, Longitudinal Waves, Compression Envelope`);
console.log(`   🚶 Walking Map, Lagrangian Model, Parametric Oscillator`);
console.log(`   💫 Soliton Waves, Distributed Mass-Spring, Gravity Drop`);

// Merge Rubik's Cube Dynamics Shapes - Group theory, permutations, state space
import { RUBIKS_CUBE_DYNAMICS_SHAPES } from './rubiksCubeDynamicsShapes';
Object.assign(UNIFIED_SHAPES, RUBIKS_CUBE_DYNAMICS_SHAPES);
const RUBIKS_COUNT = Object.keys(RUBIKS_CUBE_DYNAMICS_SHAPES).length;
console.log(`🎲 Merged ${RUBIKS_COUNT} Rubik's Cube Dynamics shapes into UNIFIED_SHAPES`);
console.log(`   🧊 Cube Lattice, Face Rotations, Slice Moves`);
console.log(`   📊 Permutation Cycles, Cayley Graph, State Space`);
console.log(`   🎯 God's Number (20), Commutators, Sexy Move Algorithm`);

// Merge NASA Planetary Shapes - Saturn with 8k textures and scientific data
import { NASA_PLANETARY_SHAPES, NASA_PLANETARY_SHAPE_COUNT } from './nasaPlanetaryShapes';
Object.assign(UNIFIED_SHAPES, NASA_PLANETARY_SHAPES);
console.log(`🪐 Merged ${NASA_PLANETARY_SHAPE_COUNT} NASA Planetary shapes into UNIFIED_SHAPES`);
console.log(`   🌍 Saturn: Oblate spheroid with 8k NASA texture`);
console.log(`   💍 Ring System: Radial disc with Cassini/Encke gaps`);
console.log(`   📐 Scientific: NASA/JPL validated characteristics`);

// Merge Evolutionary String Theory Shapes - Harmonic evolution, consciousness-energy spectrum
import { EVOLUTIONARY_STRING_THEORY_SHAPES, EVOLUTIONARY_STRING_THEORY_SHAPE_COUNT } from './evolutionaryStringTheoryShapes';
Object.assign(UNIFIED_SHAPES, EVOLUTIONARY_STRING_THEORY_SHAPES);
console.log(`🎵 Merged ${EVOLUTIONARY_STRING_THEORY_SHAPE_COUNT} Evolutionary String Theory shapes into UNIFIED_SHAPES`);
console.log(`   🎻 Harmonic Evolution: String-like vibrational patterns`);
console.log(`   Ω Singularity: Convergence toward infinite creativity`);
console.log(`   🌌 Three Realms: Non-dual, Potential, Spatiotemporal`);

// Merge EFV (Energy-Frequency-Variation) Shapes - Unified geometric control framework
import { EFV_SHAPES, EFV_SHAPE_COUNT } from './efvUnifiedShapes';
Object.assign(UNIFIED_SHAPES, EFV_SHAPES);
console.log(`⚡ Merged ${EFV_SHAPE_COUNT} EFV (Energy-Frequency-Variation) shapes into UNIFIED_SHAPES`);
console.log(`   🔋 Energy: Amplitude/displacement operators`);
console.log(`   🔄 Frequency: Temporal/iterative harmonic layers`);
console.log(`   🎲 Variation: Entropy and structural diversity`);
console.log(`   🌀 Single-Shape Principle: All formulas → one geometry`);

// Merge Φ³ Aureum Collection - Hidden golden ratio geometry
import { FOUNDERS_SIGNATURE_SHAPES, FOUNDERS_SIGNATURE_SHAPE_COUNT } from './foundersSignatureShape';
Object.assign(UNIFIED_SHAPES, FOUNDERS_SIGNATURE_SHAPES);
console.log(`🥚 Merged ${FOUNDERS_SIGNATURE_SHAPE_COUNT} Φ³ Aureum shapes into UNIFIED_SHAPES`);
console.log(`   ✨ Golden ratio tri-spiral geometry`);
console.log(`   🌀 r(θ) = R·Φ^(θ/2π), x = r·cos(3θ), y = r·sin(3θ)`);

// Merge Diatom Shapes - Biomimetic silica architectures (200+ million years of engineering)
import { DIATOM_SHAPES, DIATOM_SHAPE_COUNT } from './diatomShapes';
Object.assign(UNIFIED_SHAPES, DIATOM_SHAPES);
console.log(`🔬 Merged ${DIATOM_SHAPE_COUNT} Diatom (Biomimetic Architecture) shapes into UNIFIED_SHAPES`);
console.log(`   🌀 Radial Centric: Coscinodiscus, Arachnoidiscus - circular frustules`);
console.log(`   🚣 Pennate: Navicula - boat-shaped with raphe structures`);
console.log(`   📐 Polygonal: Triceratium - triangular with horn processes`);
console.log(`   🔗 Colonial: Chain-forming linked frustules`);

// Merge Missing 19 Higher-Dimensional Shapes - 5D polytopes, lattices, advanced 4D
Object.assign(UNIFIED_SHAPES, MISSING_19_SHAPES);
console.log(`🔮 Merged ${MISSING_19_SHAPE_COUNT} Missing Higher-Dimensional shapes into UNIFIED_SHAPES`);
console.log(`   📐 5D Polytopes: 5-simplex, 5-cube, 5-orthoplex, demipenteract, 5-sphere`);
console.log(`   🔗 Lattices: E6, E7, E8, Leech, Barnes-Wall`);
console.log(`   🧊 Advanced 4D: Grand Antiprism, Rectified/Truncated Tesseract`);

// Merge Alchemical Symbol Shapes - Ancient mystical symbols as 3D parametric surfaces
import { ALCHEMICAL_SYMBOL_SHAPES } from './alchemicalSymbolShapes';
const ALCHEMICAL_SYMBOL_COUNT = Object.keys(ALCHEMICAL_SYMBOL_SHAPES).length;
Object.assign(UNIFIED_SHAPES, ALCHEMICAL_SYMBOL_SHAPES);
console.log(`⚗️ Merged ${ALCHEMICAL_SYMBOL_COUNT} Alchemical Symbol shapes into UNIFIED_SHAPES`);
console.log(`   🔺 Four Elements: Fire, Water, Air, Earth`);
console.log(`   ☉ Celestial: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn`);
console.log(`   🥇 Metals: Gold, Silver, Copper, Iron, Tin, Lead, Platinum`);
console.log(`   🔴 Great Work: Nigredo, Albedo, Citrinitas, Rubedo, Philosopher's Stone`);

// Merge Minimal Surfaces Library - Research-grade surfaces from minimalsurfaces.blog
Object.assign(UNIFIED_SHAPES, ALL_MINIMAL_SURFACES);
console.log(`🎱 Merged ${ALL_MINIMAL_SURFACES_COUNT} Minimal Surfaces into UNIFIED_SHAPES`);
console.log(`   🎱 Spheres (${MINIMAL_SURFACES_SPHERE_COUNT}): Catenoid, Enneper, Jorge-Meeks k-Noids, López surfaces`);
console.log(`   🍩 Tori (${MINIMAL_SURFACES_TORI_COUNT}): Costa, Chen-Gackstatter, Costa-Hoffman-Karcher, Genus One Helicoid`);
console.log(`   🔮 Higher Genus (${MINIMAL_SURFACES_HIGHER_GENUS_COUNT}): Wohlgemuth, Weber-Wolf, Kapouleas, Yol's Catenoids`);

// Merge Chaos Theory Shapes - Strange attractors, bifurcations, and dynamical systems
Object.assign(UNIFIED_SHAPES, CHAOS_THEORY_SHAPES);
console.log(`🦋 Merged ${CHAOS_THEORY_SHAPE_COUNT} Chaos Theory shapes into UNIFIED_SHAPES`);
console.log(`   🌀 Attractors: Lorenz (butterfly), Rössler (spiral), Hénon, Duffing`);
console.log(`   📈 Dynamical Systems: Logistic Map, Van der Pol, Feigenbaum Bifurcation`);
console.log(`   📐 Fractal Dimensions: Hausdorff, Box-Counting, Correlation, Lyapunov`);
console.log(`   🔀 Chaos Theory: Sensitive Dependence, Chaos Transition, Strange Composite`);

// Merge Consciousness Mathematics Shapes - Constants, Chaos, Infinities mapped to human experience
Object.assign(UNIFIED_SHAPES, CONSCIOUSNESS_MATH_SHAPES);
console.log(`🧠 Merged ${CONSCIOUSNESS_MATH_SHAPE_COUNT} Consciousness Mathematics shapes into UNIFIED_SHAPES`);
console.log(`   🧬 Constants: Core Identity, Personality Constants (Feigenbaum of self)`);
console.log(`   🦋 Chaos: Butterfly Effect Life Path, Twin Divergence, Behavioral Attractors`);
console.log(`   ♾️ Infinities: Consciousness Recursion, Potential Field, Unconscious Depths`);
console.log(`   🕳️ Metaphors: Trauma Black Hole, Self Event Horizon, Free Will Paradox`);

// Merge Ancient Civilization Shapes - Egyptian and Greek museum-quality geometry
import { ANCIENT_CIVILIZATION_SHAPES, ANCIENT_EGYPTIAN_SHAPE_COUNT, ANCIENT_GREEK_SHAPE_COUNT, ANCIENT_CIVILIZATION_SHAPE_COUNT } from './ancientCivilizationShapes';
Object.assign(UNIFIED_SHAPES, ANCIENT_CIVILIZATION_SHAPES);
console.log(`🏛️ Merged ${ANCIENT_CIVILIZATION_SHAPE_COUNT} Ancient Civilization shapes into UNIFIED_SHAPES`);
console.log(`   🔺 Egyptian (${ANCIENT_EGYPTIAN_SHAPE_COUNT}): Pyramids, Hieroglyphs, Divine Figures, Obelisks`);
console.log(`   🏛️ Greek (${ANCIENT_GREEK_SHAPE_COUNT}): Columns, Temples, Sculptures, Vessels, Philosophy`);

// Merge IFS Fractals Registry - GPU raymarched IFS/Mandelbulb shapes
import { IFS_FRACTALS_REGISTRY, IFS_FRACTALS_REGISTRY_COUNT } from './ifsFractalsRegistry';
Object.assign(UNIFIED_SHAPES, IFS_FRACTALS_REGISTRY);
console.log(`🌀 Merged ${IFS_FRACTALS_REGISTRY_COUNT} IFS Fractal (GPU raymarched) shapes into UNIFIED_SHAPES`);
console.log(`   🧊 Platonic IFS: icosahedral (Φ-fold), octahedral (Oh), dodecahedral (Ih)`);
console.log(`   🌐 Mandelbulb: power-8 spherical iteration with 5 variants + cross-section`);
console.log(`   🔀 Menger–Kleinian v2: hybrid sphere-inversion + cubic fold with torsion twist`);

// PRE-COMPUTED SHAPE DEFAULTS MAP - Synchronous access for Parameter Authority
// This allows instant access to shape defaults without async loading
export const SHAPE_DEFAULTS_MAP: Record<string, Record<string, number>> = {};
for (const [key, shape] of Object.entries(UNIFIED_SHAPES)) {
  if (shape.defaultParams) {
    SHAPE_DEFAULTS_MAP[key] = shape.defaultParams as Record<string, number>;
  }
}

export default UNIFIED_SHAPES;