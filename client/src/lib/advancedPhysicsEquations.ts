/**
 * ADVANCED PHYSICS EQUATIONS
 * General Relativity, Quantum Field Theory, and Theoretical Physics
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 0,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const ADVANCED_PHYSICS_EQUATIONS: Record<string, ParametricSurface> = {

  // ============================================================================
  // SCHWARZSCHILD METRIC - General Relativity
  // ============================================================================
  
  schwarzschild_radius: {
    name: "⚫ Schwarzschild Radius: rs = 2GM/c²",
    description: "Event horizon radius for non-rotating black hole",
    equation: (u, v, params) => {
      const M = params.a ?? 1;        // Mass (solar masses)
      const G = 1;                     // Gravitational constant (normalized)
      const c = 1;                     // Speed of light (normalized)
      const scale = params.b ?? 3;     // Visualization scale
      
      // Schwarzschild radius: rs = 2GM/c²
      const rs = (2 * G * M) / (c * c);
      
      // u and v are already in the user's UV range, use them directly
      const theta = u;
      const phi = v;
      
      // Event horizon sphere at Schwarzschild radius
      const radius = rs * scale;
      
      // Add quantum fluctuations at event horizon
      const quantumFlux = 0.05 * Math.sin(theta * 20) * Math.cos(phi * 15);
      const finalRadius = radius + quantumFlux;
      
      return [
        finalRadius * Math.sin(theta) * Math.cos(phi),
        finalRadius * Math.sin(theta) * Math.sin(phi),
        finalRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 96, vSegments: 72 })
  },

  schwarzschild_metric_spacetime: {
    name: "⚫ Schwarzschild Metric: ds² = -(1-rs/r)c²dt² + dr²/(1-rs/r) + r²dΩ²",
    description: "Spacetime geometry around spherical mass",
    equation: (u, v, params) => {
      const M = params.a ?? 2;         // Mass
      const scale = params.b ?? 10;    // Radial scale
      const curvature = params.c ?? 1; // Curvature intensity
      
      // Schwarzschild radius
      const rs = 2 * M;
      
      // u and v are already in the user's UV range, use them directly
      const r = u + rs * 1.5;
      const theta = v;
      
      // Metric coefficient: gtt = -(1 - rs/r)
      const gtt = -(1 - rs / r);
      
      // Spacetime curvature depth
      const depth = curvature * (rs / r) * 5;
      
      // Convert to Cartesian with depth showing curvature
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = depth;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 10, c: 1, uMin: 0, uMax: 10, vMin: 0, vMax: 2 * Math.PI, uSegments: 120, vSegments: 96 })
  },

  gravitational_time_dilation: {
    name: "⏰ Gravitational Time Dilation: t' = t√(1 - rs/r)",
    description: "Time slowdown near massive objects",
    equation: (u, v, params) => {
      const M = params.a ?? 2;         // Mass
      const scale = params.b ?? 10;    // Spatial scale
      const timeScale = params.c ?? 2; // Time dilation visualization scale
      
      const rs = 2 * M; // Schwarzschild radius
      
      // Position in space
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      // Distance from center
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Time dilation factor: √(1 - rs/r)
      const timeFactor = r > rs ? Math.sqrt(1 - rs / r) : 0;
      
      // Visualize as surface height
      const z = timeScale * (1 - timeFactor);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 10, c: 2, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // EINSTEIN EQUATION VARIANTS - Mathematical Shape Determination Guide
  // ============================================================================
  
  // SHAPE DETERMINATION METHODOLOGY:
  // Each Einstein variant creates a unique 3D parametric surface by mapping
  // the mathematical relationship onto spatial coordinates (x,y,z).
  // The "shape" is determined by how energy, mass, and light speed interact
  // geometrically when visualized as a continuous mathematical surface.

  einstein_mass_energy: {
    name: "⚛️ Einstein Mass Energy: E = mc² - Energy Spiral from Mass Point",
    description: "SHAPE MEANING: Energy radiates outward from central mass as expanding spiral. The surface shows how a small mass point generates enormous energy distributed through space. Height represents energy magnitude, radius shows energy propagation distance.",
    equation: (u, v, params) => {
      const M = params.a ?? 1;        // Mass (solar masses)
      const c = 1;                     // Speed of light (normalized)
      const scale = params.b ?? 3;     // Visualization scale
      
      const energy = M * c * c;       // E = mc²
      
      const theta = u * 2 * Math.PI;
      const radius = scale * Math.sqrt(energy) * v;
      const height = energy * v;
      
      // Energy spiral showing mass-to-energy conversion
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  einstein_energy_per_mass: {
    name: "⚛️ Einstein Energy Per Mass: E/m = c² - Constant Energy Density",
    description: "SHAPE MEANING: Uniform spherical surface showing that energy-per-unit-mass is constant (c²) regardless of total mass. The sphere radius equals c², demonstrating the fundamental energy density limit in relativity.",
    equation: (u, v, params) => {
      const c = params.b ?? 3;         // Speed of light
      const scale = params.a ?? 1;     // Visualization scale
      
      const energyPerMass = c * c;     // E/m = c²
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const radius = scale * Math.sqrt(energyPerMass);
      
      // Constant energy density sphere
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  einstein_mass_from_energy: {
    name: "⚛️ Einstein Mass From Energy: m = E/c² - Energy Compression Cone",
    description: "SHAPE MEANING: Inverted cone showing how energy compresses into mass. Wide energy base (top) narrows down to concentrated mass point (bottom). Demonstrates energy-to-mass conversion efficiency.",
    equation: (u, v, params) => {
      const E = params.a ?? 10;       // Energy input
      const c = params.b ?? 3;        // Speed of light
      const scale = params.c ?? 1.5;  // Visualization scale
      
      const mass = E / (c * c);       // m = E/c²
      
      const theta = u * 2 * Math.PI;
      const energyRadius = E * (1 - v) / 5;  // Energy spreads wide at top
      const height = v * mass * scale;       // Compresses to mass at bottom
      
      // Energy-to-mass compression cone
      return [
        energyRadius * Math.cos(theta),
        energyRadius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 3, c: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  einstein_multiplicative_form: {
    name: "⚛️ Einstein Multiplicative Form: E × m = m²c² - Mass-Energy Grid",
    description: "SHAPE MEANING: Grid surface showing the multiplicative relationship between energy and mass. Each grid point represents E×m coordinates, with height showing the squared mass term (m²c²). Visualizes the algebraic structure of the equation.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Mass
      const c = params.b ?? 3;         // Speed of light
      const scale = params.c ?? 1.8;   // Grid scale
      
      const energy = m * c * c;
      const product = energy * m;      // E × m
      const squaredMass = m * m * c * c; // m²c²
      
      const gridU = Math.floor(u * 10) / 10;
      const gridV = Math.floor(v * 10) / 10;
      
      const x = (gridU - 0.5) * scale * energy;
      const y = (gridV - 0.5) * scale * m;
      const z = squaredMass * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  einstein_absolute_magnitude: {
    name: "⚛️ Einstein Absolute Magnitude: |E| = |m|c² - Symmetric Energy Shell",
    description: "SHAPE MEANING: Double-shell structure showing positive and negative energy states. Inner shell represents matter (positive mass-energy), outer shell represents antimatter (negative mass-energy). Absolute value ensures both have equal magnitude.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Mass magnitude
      const c = params.b ?? 3;         // Speed of light
      const scale = params.c ?? 2;     // Shell separation
      
      const energyMagnitude = Math.abs(m) * c * c;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Dual shell: matter and antimatter
      const shellSelect = Math.floor(u * 2) % 2;
      const radius = scale * Math.sqrt(energyMagnitude) * (1 + shellSelect * 0.5);
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  einstein_tensor_product: {
    name: "⚛️ Einstein Tensor Product: E ⊗ m - Spacetime Curvature Field",
    description: "SHAPE MEANING: Curved surface representing spacetime geometry. The tensor product E⊗m creates field lines that bend space around mass. Curvature intensity shows how mass-energy warps the fabric of spacetime itself.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Mass
      const c = params.b ?? 3;         // Speed of light
      const fieldStrength = params.c ?? 2; // Curvature intensity
      
      const energy = m * c * c;
      
      const theta = u * 2 * Math.PI;
      const fieldRadius = v;
      
      // Tensor field creates spacetime curvature
      const radius = fieldStrength * (1 + fieldRadius * c / 3);
      const curvature = m * energy * fieldRadius * 0.1;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        curvature
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 })
  },

  einstein_dot_product: {
    name: "⚛️ Einstein Dot Product: E · m - Directional Energy Alignment",
    description: "SHAPE MEANING: Double cone showing directional alignment between energy and mass vectors. When aligned (parallel), maximum energy transfer occurs. When anti-aligned, minimum energy transfer. The cones show all possible alignment angles.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Mass magnitude
      const c = params.b ?? 3;         // Light vector magnitude
      const scale = params.c ?? 2;     // Visualization scale
      
      const angle = v * Math.PI;       // Alignment angle
      const dotProduct = m * c * c * Math.cos(angle);
      const energy = Math.abs(dotProduct);
      
      // Symmetric double cone showing directional alignment
      const theta = u * 2 * Math.PI;
      const radius = scale * Math.sin(angle);
      const height = scale * Math.cos(angle) * energy / 10 * Math.sign(Math.cos(angle));
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  einstein_exponential_form: {
    name: "⚛️ Einstein Exponential Form: E = mc²e^(kinetic) - Relativistic Corrections",
    description: "SHAPE MEANING: Exponential spiral showing how energy grows exponentially as particles approach light speed. The spiral expands rapidly, demonstrating why massive particles cannot reach light speed - infinite energy would be required.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Rest mass
      const c = params.b ?? 2;         // Speed of light
      const kinetic = params.c ?? 1.5; // Kinetic energy factor
      const scale = params.d ?? 2;     // Spiral scale
      
      const restEnergy = m * c * c;
      const relativisticFactor = Math.exp(kinetic * v);
      const totalEnergy = restEnergy * relativisticFactor;
      
      const theta = u * Math.PI * 2;
      const exponentialRadius = scale * Math.log(1 + totalEnergy);
      const height = v * totalEnergy * 0.1;
      
      // Exponential energy spiral
      return [
        exponentialRadius * Math.cos(theta),
        exponentialRadius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 2, c: 1.5, d: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  relativistic_energy_momentum: {
    name: "⚛️ Relativistic Energy-Momentum: E² = (pc)² + (mc²)² - Energy-Space Cone",
    description: "SHAPE MEANING: Hyperboloid cone in energy-momentum space. The cone shows the relationship between rest mass energy (mc²) and momentum energy (pc). As momentum increases, total energy follows the cone surface - this is the geometry of special relativity.",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Rest mass
      const c = params.b ?? 3;         // Speed of light
      const scale = params.c ?? 2;     // Scale factor
      
      const restEnergy = m * c * c;
      const momentum = u * 5 * c;      // Momentum varies with u
      const totalEnergy = Math.sqrt(restEnergy * restEnergy + momentum * momentum);
      
      // Visualize as cone in energy-momentum space
      const theta = v * 2 * Math.PI;
      const radius = momentum * scale / 5;
      const height = totalEnergy * scale / 10;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  // ============================================================================
  // TESLA EQUATION - Thread Tension Theory
  // ============================================================================
  
  tesla_thread_tension: {
    name: "⚡ Tesla Equation: TL = mc²",
    description: "Thread tension × length = mass-energy equivalence",
    equation: (u, v, params) => {
      const m = params.a ?? 1;         // Mass
      const c = 1;                      // Speed of light (normalized)
      const L = params.b ?? 2;         // Thread length
      const scale = params.d ?? 3;     // Visualization scale
      
      // TL = mc²
      const T = (m * c * c) / L;       // Tension
      
      // Visualize thread network
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Thread network with tension
      const radius = scale * (1 + 0.1 * Math.sin(theta * 10) * Math.cos(phi * 8));
      
      // Tension creates wave propagation
      const wave = 0.2 * Math.sin(theta * 15 + phi * 12) * T / 5;
      
      const finalRadius = radius + wave;
      
      return [
        finalRadius * Math.sin(theta) * Math.cos(phi),
        finalRadius * Math.sin(theta) * Math.sin(phi),
        finalRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 2, d: 3, uSegments: 120, vSegments: 96 })
  },

  thread_particle_network: {
    name: "🌐 Thread Particle Network (Flux Particle Theory)",
    description: "3D lattice network with tension propagating light",
    equation: (u, v, params) => {
      const tension = params.a ?? 1;    // Network tension
      const length = params.b ?? 0.1;   // Thread length (Ångström scale)
      const density = params.d ?? 10;   // Network density
      
      // 3D lattice structure
      const x = (u - 0.5) * density;
      const y = (v - 0.5) * density;
      
      // Network creates wave pattern
      const wave = tension * 0.3 * Math.sin(x * 8 / length) * Math.cos(y * 8 / length);
      
      // Vibrations travel through network (light)
      const z = wave;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.1, d: 10, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // KERR METRIC - Rotating Black Hole
  // ============================================================================
  
  kerr_rotating_black_hole: {
    name: "🌀 Kerr Metric: Rotating Black Hole with Frame Dragging",
    description: "ds² includes angular momentum term: 2aMrsin²θ/Σ dt dφ",
    equation: (u, v, params) => {
      const M = params.a ?? 2;         // Mass
      const a = params.h ?? 0.8;       // Spin parameter (0 to 1)
      const scale = params.b ?? 3;     // Scale
      
      // Kerr parameters
      const J = a * M;                  // Angular momentum
      
      // u and v are already in the user's UV range, use them directly
      const theta = u;
      const phi = v;
      
      // Kerr event horizon: r+ = M + √(M² - a²)
      const rPlus = M + Math.sqrt(M * M - a * a);
      
      // Ergosphere outer boundary: r = M + √(M² - a²cos²θ)
      const ergosphere = M + Math.sqrt(M * M - a * a * Math.cos(theta) * Math.cos(theta));
      
      // Frame dragging effect
      const frameDrag = a * Math.sin(theta) * 0.2 * Math.cos(phi * 3);
      
      const radius = scale * (ergosphere + frameDrag);
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, h: 0.8, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // EINSTEIN FIELD EQUATIONS
  // ============================================================================
  
  einstein_field_equations: {
    name: "🌌 Einstein Field Equations: Gμν + Λgμν = (8πG/c⁴)Tμν",
    description: "Spacetime curvature = energy-momentum density",
    equation: (u, v, params) => {
      const rho = params.a ?? 1;       // Energy density
      const Lambda = params.d ?? 0;    // Cosmological constant
      const scale = params.b ?? 8;     // Spatial scale
      const time = params.time || 0;   // Time evolution
      
      // Position
      const r = u * scale;
      const theta = v * 2 * Math.PI;
      
      // Energy-momentum creates curvature
      // Simplified: curvature ∝ energy density
      const curvature = -(rho / (r + 0.5)) * 3;
      
      // Cosmological constant contribution (dark energy) - enhanced visibility
      const cosmicTerm = Lambda * r * 0.15;
      
      // Time evolution: gravitational waves propagating outward
      const waveSpeed = 2;
      const waveAmplitude = 0.5;
      const gravitationalWave = waveAmplitude * Math.sin(r * 2 - time * waveSpeed);
      
      const depth = curvature + cosmicTerm + gravitationalWave;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = depth;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 8, d: 0, uSegments: 120, vSegments: 96 })
  },

  // ============================================================================
  // REISSNER-NORDSTRÖM METRIC - Charged Black Hole
  // ============================================================================
  
  reissner_nordstrom_charged: {
    name: "⚡ Reissner-Nordström: Charged Black Hole",
    description: "ds² term includes charge Q: (1 - 2M/r + Q²/r²)",
    equation: (u, v, params) => {
      const M = params.a ?? 2;         // Mass
      const Q = params.e ?? 0.5;       // Electric charge
      const scale = params.b ?? 3;     // Scale
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Inner and outer horizons
      const r_plus = M + Math.sqrt(M * M - Q * Q);
      const r_minus = M - Math.sqrt(M * M - Q * Q);
      
      // Metric coefficient with charge
      const radius = scale * r_plus;
      
      // Electric field visualization
      const electricField = Q * 0.3 * Math.sin(theta * 8) * Math.cos(phi * 6);
      
      const finalRadius = radius + electricField;
      
      return [
        finalRadius * Math.sin(theta) * Math.cos(phi),
        finalRadius * Math.sin(theta) * Math.sin(phi),
        finalRadius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, e: 0.5, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // PENROSE DIAGRAM - Causal Structure
  // ============================================================================
  
  penrose_diagram_spacetime: {
    name: "📐 Penrose Diagram: Conformal Spacetime Structure",
    description: "Compactified view of entire spacetime including infinity",
    equation: (u, v, params) => {
      const scale = params.a ?? 5;     // Spatial scale
      const time = params.c ?? 0;      // Time parameter
      
      // Conformal coordinates
      const U = (u - 0.5) * scale;     // Null coordinate u
      const V = (v - 0.5) * scale;     // Null coordinate v
      
      // Schwarzschild spacetime in Kruskal-Szekeres coordinates
      const r = Math.sqrt(U * U + V * V) + 0.1;
      const t = Math.atan2(V, U);
      
      // Event horizon at U = 0 or V = 0
      const horizon = Math.abs(U * V);
      
      // Singularity visualization
      const z = -2 / (r + 0.2) + time * 0.1;
      
      return [U, V, z];
    },
    defaultParams: getCleanDefaults({ a: 5, c: 0, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // GRAVITATIONAL WAVES
  // ============================================================================
  
  gravitational_wave_ripple: {
    name: "〰️ Gravitational Waves: h = A cos(2πft - kr)",
    description: "Ripples in spacetime fabric from accelerating masses",
    equation: (u, v, params) => {
      const amplitude = params.a ?? 0.5;  // Wave amplitude
      const frequency = params.k ?? 2;    // Wave frequency
      const time = params.c ?? 0;         // Time evolution
      const scale = params.b ?? 8;        // Spatial scale
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const r = Math.sqrt(x * x + y * y);
      
      // Gravitational wave: h ∝ cos(ωt - kr)
      const k = 2 * Math.PI / scale;      // Wave number
      const omega = 2 * Math.PI * frequency;
      
      const h = amplitude * Math.cos(omega * time - k * r) / (r + 1);
      
      return [x, y, h];
    },
    defaultParams: getCleanDefaults({ a: 0.5, b: 8, c: 0, k: 2, uSegments: 128, vSegments: 128 })
  },

  ligo_binary_merger: {
    name: "🌊 LIGO Binary Black Hole Merger Waveform",
    description: "Gravitational wave chirp signal: inspiral → merger → ringdown",
    equation: (u, v, params) => {
      const M1 = params.a ?? 30;       // Mass 1 (solar masses)
      const M2 = params.b ?? 30;       // Mass 2 (solar masses)
      const time = params.c ?? 0;      // Time parameter
      const distance = params.d ?? 5;  // Distance scale
      
      // Total mass and chirp mass
      const M = M1 + M2;
      const chirpMass = Math.pow(M1 * M2, 0.6) / Math.pow(M, 0.2);
      
      // Time to merger (simplified)
      const t_merge = 1;
      const t = (u - 0.5) * 2;
      
      // Frequency evolution (chirp)
      const f = t < t_merge ? 
        chirpMass * Math.pow(Math.abs(t_merge - t), -3/8) * 0.5 :
        chirpMass * 2;
      
      // Amplitude (decreases with distance)
      const h = t < t_merge ?
        (chirpMass / distance) * Math.pow(f, 2/3) :
        (chirpMass / distance) * Math.exp(-(t - t_merge) * 5);
      
      const x = t * 5;
      const y = (v - 0.5) * 4;
      const z = h * Math.sin(2 * Math.PI * f * (time + t));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 30, b: 30, c: 0, d: 5, uSegments: 128, vSegments: 64 })
  }

};

