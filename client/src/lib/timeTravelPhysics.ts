/**
 * Time Travel Physics Formulas - Mathematical Foundations of Temporal Engineering
 * 
 * Based on real physics:
 * - Einstein Field Equations for spacetime curvature
 * - Quantum Field Theory for exotic energy
 * - Causal Structure Theory for consistency
 * - General Relativity Solutions for CTCs
 * 
 * Categories:
 * - Closed Timelike Curves (CTCs): Gödel Universe, Kerr Black Hole
 * - Traversable Wormholes: Morris-Thorne, Alcubierre Warp Drive
 * - Topological Time Machines: Cosmic String Machine
 * - Quantum Time Travel: Quantum Loop Amplitudes, Novikov Self-Consistency
 * - Exotic Matter Engineering: Negative Energy Fields, Chronology Protection, Tipler Cylinder
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function applyTransforms(
  x: number, y: number, z: number,
  u: number, v: number,
  params: SurfaceParameters
): [number, number, number] {
  const a = params.a ?? 1;
  const b = params.b ?? 1;
  const c = params.c ?? 1;
  
  const g = (params.g ?? 0) * 0.02;
  const h = (params.h ?? 0) * 0.02;
  const i = (params.i ?? 0) * 0.02;
  const j = (params.j ?? 0) * 0.05;
  const k = (params.k ?? 0) * 0.1;
  const l = (params.l ?? 0) * 0.05;
  const m = (params.m ?? 0) * 0.03;
  const n = (params.n ?? 0) * 0.03;
  const o = (params.o ?? 0) * 0.03;
  const p = (params.p ?? 0) * 0.02;
  const q = (params.q ?? 0) * 0.02;
  const r = (params.r ?? 0) * 0.02;
  const s = (params.s ?? 0) * 0.01;
  const t = (params.t ?? 0) * 0.01;
  const w = (params.w ?? 0) * 0.01;
  
  const twistAngle = g * z + h * x + i * y;
  const cosT = Math.cos(twistAngle);
  const sinT = Math.sin(twistAngle);
  let nx = x * cosT - y * sinT;
  let ny = x * sinT + y * cosT;
  let nz = z;
  
  nx += j * Math.sin(k * ny + l * nz);
  ny += j * Math.sin(k * nz + l * nx);
  nz += j * Math.sin(k * nx + l * ny);
  
  nx += m * Math.sin(u * 10 + v * 7);
  ny += n * Math.sin(v * 10 + u * 7);
  nz += o * Math.sin(u * 7 + v * 10);
  
  const dist = Math.sqrt(nx * nx + ny * ny);
  const pulse = 1 + p * Math.sin(dist * 5);
  nx *= pulse;
  ny *= pulse;
  
  const angle = Math.atan2(ny, nx);
  const angDist = q * Math.sin(angle * 4);
  nx += angDist * Math.cos(angle);
  ny += angDist * Math.sin(angle);
  
  const spiralAngle = r * dist;
  const cosSp = Math.cos(spiralAngle);
  const sinSp = Math.sin(spiralAngle);
  const spx = nx * cosSp - ny * sinSp;
  const spy = nx * sinSp + ny * cosSp;
  nx = spx;
  ny = spy;
  
  nx += s * ny + w * nz;
  ny += t * nz;
  
  nx *= a;
  ny *= b;
  nz *= c;
  
  nx += (params.x ?? 0) * 0.1;
  ny += (params.y ?? 0) * 0.1;
  nz += (params.z ?? 0) * 0.1;
  
  return [nx, ny, nz];
}

export const TIME_TRAVEL_PHYSICS: Record<string, ParametricSurface> = {

  // ============================================================================
  // CLOSED TIMELIKE CURVES (CTCs)
  // ============================================================================

  godel_universe_ctc: {
    name: 'Gödel Universe CTC (Rotating Universe)',
    equation: (u, v, params) => {
      const omega = (params.d ?? 1) * 0.5; // Rotation velocity
      const radius = params.e ?? 2;
      const cosmicScale = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = (v - 0.5) * Math.PI;
      
      // Gödel metric: ds² = a²[-(dt + e^x dz)² + dx² + ½e^(2x)dz² + dy²]
      const ctcRadius = radius * (1 + 0.3 * Math.sin(omega * theta * 3));
      const temporalTwist = omega * Math.sin(phi * 2) * 0.5;
      
      const x = ctcRadius * Math.cos(theta + temporalTwist) * Math.cos(phi);
      const y = ctcRadius * Math.sin(theta + temporalTwist) * Math.cos(phi);
      const z = ctcRadius * Math.sin(phi) * cosmicScale + Math.sin(theta * omega * 5) * 0.2;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2, f: 1, uSegments: 64, vSegments: 48 }
  },

  kerr_black_hole_ctc: {
    name: 'Kerr Black Hole Frame Dragging',
    equation: (u, v, params) => {
      const spinParam = (params.d ?? 0.9) * 0.99; // a/M (spin parameter)
      const mass = params.e ?? 1;
      const ergoRadius = params.f ?? 1.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Kerr metric ergosphere: r_ergo = M + √(M² - a²cos²θ)
      const ergo = mass + Math.sqrt(Math.max(0.01, mass * mass - spinParam * spinParam * Math.pow(Math.cos(phi), 2)));
      const frameDrag = spinParam * Math.sin(phi) * 0.5;
      
      // Ring singularity at r=0, θ=π/2
      const ringEffect = Math.exp(-Math.pow(phi - Math.PI/2, 2) * 5) * spinParam * 0.3;
      const r = ergoRadius * ergo * (1 + ringEffect);
      
      const x = r * Math.sin(phi) * Math.cos(theta + frameDrag);
      const y = r * Math.sin(phi) * Math.sin(theta + frameDrag);
      const z = r * Math.cos(phi) * (1 - spinParam * 0.3);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.9, e: 1, f: 1.5, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // TRAVERSABLE WORMHOLES
  // ============================================================================

  morris_thorne_wormhole: {
    name: 'Morris-Thorne Wormhole (Exotic Matter)',
    equation: (u, v, params) => {
      const throatRadius = params.d ?? 0.5;
      const length = params.e ?? 3;
      const exoticEnergy = params.f ?? 1; // Negative energy density parameter
      
      const theta = u * Math.PI * 2;
      const l = (v - 0.5) * length * 2;
      
      // Morris-Thorne metric: ds² = -dt² + dl² + (b₀² + l²)(dθ² + sin²θ dφ²)
      // Shape function b(l) = b₀ (throat radius)
      const r = Math.sqrt(throatRadius * throatRadius + l * l) * (1 + exoticEnergy * 0.1 * Math.sin(l * 2));
      
      // Flare-out condition: db/dl < 1 at throat
      const flare = 1 + 0.2 * Math.exp(-l * l);
      
      const x = r * flare * Math.cos(theta);
      const y = r * flare * Math.sin(theta);
      const z = l;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 3, f: 1, uSegments: 64, vSegments: 48 }
  },

  alcubierre_warp_drive: {
    name: 'Alcubierre Warp Bubble',
    equation: (u, v, params) => {
      const bubbleRadius = params.d ?? 1.5;
      const warpFactor = params.e ?? 2; // v_s (ship velocity)
      const thickness = params.f ?? 0.3;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Alcubierre metric: ds² = -dt² + (dx - v_s f(r_s) dt)² + dy² + dz²
      // f(r) = (tanh(σ(r+R)) - tanh(σ(r-R))) / (2tanh(σR))
      const sigma = 1 / thickness;
      
      // Warp bubble shape with spacetime compression/expansion
      const frontCompression = 1 - 0.3 * warpFactor * Math.cos(phi) * Math.exp(-Math.pow(phi - 0, 2) * 2);
      const rearExpansion = 1 + 0.3 * warpFactor * Math.cos(phi) * Math.exp(-Math.pow(phi - Math.PI, 2) * 2);
      const bubbleShape = bubbleRadius * (frontCompression * rearExpansion);
      
      // Energy shell visualization
      const energyShell = 1 + 0.1 * Math.sin(theta * 8) * Math.sin(phi * 4);
      
      const x = bubbleShape * energyShell * Math.sin(phi) * Math.cos(theta);
      const y = bubbleShape * energyShell * Math.sin(phi) * Math.sin(theta);
      const z = bubbleShape * Math.cos(phi) * (1 + warpFactor * 0.2);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 2, f: 0.3, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // TOPOLOGICAL TIME MACHINES
  // ============================================================================

  cosmic_string_machine: {
    name: 'Cosmic String Time Machine',
    equation: (u, v, params) => {
      const stringTension = params.d ?? 1; // Gμ (string tension)
      const velocity = params.e ?? 0.8; // String velocity
      const separation = params.f ?? 2;
      
      const theta = u * Math.PI * 2;
      const z_coord = (v - 0.5) * 4;
      
      // Conical deficit angle: Δ = 8πGμ
      const deficit = 8 * Math.PI * stringTension * 0.01;
      
      // Two moving cosmic strings create CTC region
      const string1_x = separation * 0.5 * Math.cos(velocity * z_coord * 0.5);
      const string1_y = separation * 0.5 * Math.sin(velocity * z_coord * 0.5);
      const string2_x = -separation * 0.5 * Math.cos(velocity * z_coord * 0.5);
      const string2_y = -separation * 0.5 * Math.sin(velocity * z_coord * 0.5);
      
      // Visualize the spacetime around strings
      const r = 0.8 + 0.3 * Math.sin(theta * 2 + z_coord);
      const conicalDeform = 1 - deficit * Math.cos(theta * 2);
      
      const x = r * conicalDeform * Math.cos(theta) + 0.2 * Math.sin(z_coord * 3);
      const y = r * conicalDeform * Math.sin(theta) + 0.2 * Math.cos(z_coord * 3);
      const z = z_coord;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.8, f: 2, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // QUANTUM TIME TRAVEL
  // ============================================================================

  quantum_loop_amplitudes: {
    name: 'Quantum Loop Amplitudes (Many-Worlds)',
    equation: (u, v, params) => {
      const branches = Math.floor((params.d ?? 5) + 3); // Number of worldlines
      const amplitude = params.e ?? 1;
      const interference = params.f ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4; // Temporal coordinate
      
      // Feynman path integral visualization
      // Sum over histories: Σ exp(iS/ℏ)
      let sumX = 0, sumY = 0;
      for (let n = 1; n <= branches; n++) {
        const phase = theta + (2 * Math.PI * n) / branches;
        const pathAmplitude = amplitude / n;
        sumX += pathAmplitude * Math.cos(phase + t * n * 0.5);
        sumY += pathAmplitude * Math.sin(phase + t * n * 0.5);
      }
      
      // Interference pattern
      const interferencePattern = 1 + interference * Math.cos(theta * branches);
      
      const x = sumX * interferencePattern;
      const y = sumY * interferencePattern;
      const z = t + 0.2 * Math.sin(theta * branches);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 5, e: 1, f: 0.5, uSegments: 64, vSegments: 48 }
  },

  novikov_self_consistency: {
    name: 'Novikov Self-Consistency Principle',
    equation: (u, v, params) => {
      const loopRadius = params.d ?? 1.5;
      const consistency = params.e ?? 1; // How strongly paradoxes are prevented
      const temporalDepth = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      // Self-consistent loop: past and future must agree
      // Visualize as interlocking temporal loops
      const majorR = loopRadius;
      const minorR = 0.4 * consistency;
      
      // Torus-like structure representing closed causal loop
      const causalLoop = majorR + minorR * Math.cos(phi);
      
      // Consistency constraint creates smooth transitions
      const smoothing = 1 + 0.2 * Math.sin(theta * 2) * Math.sin(phi * 3) * consistency;
      
      const x = causalLoop * smoothing * Math.cos(theta);
      const y = causalLoop * smoothing * Math.sin(theta);
      const z = minorR * Math.sin(phi) * temporalDepth;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 1, f: 1, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // EXOTIC MATTER ENGINEERING
  // ============================================================================

  negative_energy_field: {
    name: 'Negative Energy Field (Casimir Effect)',
    equation: (u, v, params) => {
      const plateSpacing = params.d ?? 0.5;
      const fieldStrength = params.e ?? 1;
      const quantumFlux = params.f ?? 1;
      
      const x_coord = (u - 0.5) * 3;
      const y_coord = (v - 0.5) * 3;
      
      // Casimir energy density: E = -π²ℏc / (720a⁴)
      // Negative energy between plates
      const plateRegion = Math.exp(-Math.pow(x_coord, 2) / plateSpacing);
      const negativeEnergy = -fieldStrength * plateRegion;
      
      // Quantum vacuum fluctuations
      const fluctuations = quantumFlux * 0.1 * (
        Math.sin(x_coord * 10) * Math.sin(y_coord * 10) +
        Math.sin(x_coord * 7 + y_coord * 3) * 0.5
      );
      
      const x = x_coord;
      const y = y_coord;
      const z = negativeEnergy + fluctuations;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 1, f: 1, uSegments: 64, vSegments: 64 }
  },

  chronology_protection: {
    name: 'Chronology Protection (Hawking Conjecture)',
    equation: (u, v, params) => {
      const barrierStrength = params.d ?? 2;
      const horizonRadius = params.e ?? 1.5;
      const quantumBack = params.f ?? 1; // Quantum backreaction
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Chronology horizon: where CTCs would form
      const chronologyHorizon = horizonRadius * (1 + 0.2 * Math.sin(phi * 3));
      
      // Hawking's conjecture: vacuum energy diverges at horizon
      const energyBarrier = barrierStrength * Math.exp(-Math.pow(phi - Math.PI/2, 2) * quantumBack);
      
      // Protective bubble preventing paradoxes
      const r = chronologyHorizon * (1 + energyBarrier * 0.3 * Math.sin(theta * 4));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * (1 - energyBarrier * 0.1);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 2, e: 1.5, f: 1, uSegments: 64, vSegments: 48 }
  },

  tipler_cylinder: {
    name: 'Tipler Cylinder (Rotating Time Machine)',
    equation: (u, v, params) => {
      const cylinderRadius = params.d ?? 0.8;
      const cylinderLength = params.e ?? 4;
      const angularVelocity = params.f ?? 2; // Must exceed c/2 for CTCs
      
      const theta = u * Math.PI * 2;
      const z_coord = (v - 0.5) * cylinderLength;
      
      // Tipler metric: infinite rotating cylinder
      // Frame dragging creates CTCs outside certain radius
      const frameDrag = angularVelocity * 0.1 * z_coord;
      
      // Cylinder with helical grooves showing rotation
      const helicalGroove = 0.05 * Math.sin(theta * 8 + z_coord * 3);
      const r = cylinderRadius + helicalGroove;
      
      // Ergosphere-like region
      const ergoEffect = 1 + 0.1 * Math.sin(angularVelocity * theta);
      
      const x = r * ergoEffect * Math.cos(theta + frameDrag);
      const y = r * ergoEffect * Math.sin(theta + frameDrag);
      const z = z_coord;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.8, e: 4, f: 2, uSegments: 64, vSegments: 48 }
  },

  // ============================================================================
  // ADDITIONAL TIME TRAVEL GEOMETRIES
  // ============================================================================

  van_stockum_dust: {
    name: 'Van Stockum Dust (Rotating Cylinder CTCs)',
    equation: (u, v, params) => {
      const dustDensity = params.d ?? 1;
      const rotation = params.e ?? 1.5;
      const radius = params.f ?? 1.2;
      
      const theta = u * Math.PI * 2;
      const z_coord = (v - 0.5) * 3;
      
      // Van Stockum solution: rigidly rotating dust
      const dustProfile = dustDensity * Math.exp(-Math.pow(z_coord, 2) * 0.5);
      const r = radius * (1 + 0.2 * dustProfile);
      const twist = rotation * z_coord * 0.3;
      
      const x = r * Math.cos(theta + twist);
      const y = r * Math.sin(theta + twist);
      const z = z_coord;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1.5, f: 1.2, uSegments: 64, vSegments: 48 }
  },

  time_crystal_structure: {
    name: 'Time Crystal (Temporal Periodicity)',
    equation: (u, v, params) => {
      const period = params.d ?? 1;
      const amplitude = params.e ?? 0.5;
      const latticeSize = params.f ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Time crystal: breaks time-translation symmetry
      const temporalOscillation = amplitude * Math.sin(theta * period * 4);
      const spatialLattice = Math.sin(theta * 6) * Math.sin(phi * 6) * 0.2;
      
      const r = latticeSize * (1 + temporalOscillation + spatialLattice);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * (1 + temporalOscillation * 0.5);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.5, f: 2, uSegments: 64, vSegments: 48 }
  },

  grandfather_paradox_manifold: {
    name: 'Grandfather Paradox Manifold',
    equation: (u, v, params) => {
      const paradoxStrength = params.d ?? 1;
      const resolution = params.e ?? 0.5; // How universe resolves paradox
      const branches = params.f ?? 3;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      // Branching worldlines at paradox point
      const branchPoint = Math.exp(-t * t * 2);
      const numBranches = Math.floor(branches) + 2;
      
      let x = 0, y = 0;
      for (let n = 0; n < numBranches; n++) {
        const branchAngle = (2 * Math.PI * n) / numBranches;
        const branchWeight = branchPoint * resolution / numBranches;
        x += branchWeight * Math.cos(theta + branchAngle + t * paradoxStrength);
        y += branchWeight * Math.sin(theta + branchAngle + t * paradoxStrength);
      }
      
      const mainPath = (1 - branchPoint) * (1 + 0.3 * Math.sin(theta * 2));
      x += mainPath * Math.cos(theta);
      y += mainPath * Math.sin(theta);
      const z = t;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.5, f: 3, uSegments: 64, vSegments: 48 }
  },

  temporal_flux_capacitor: {
    name: 'Temporal Flux Field',
    equation: (u, v, params) => {
      const fluxDensity = params.d ?? 1.21; // 1.21 gigawatts reference
      const fieldRadius = params.e ?? 1.5;
      const oscillation = params.f ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Three-lobed flux field
      const lobePattern = 1 + 0.4 * Math.cos(theta * 3) * Math.sin(phi);
      const fluxLines = 0.15 * Math.sin(theta * 12 + phi * 6) * fluxDensity;
      
      const r = fieldRadius * lobePattern + fluxLines;
      const temporalRipple = 0.1 * Math.sin(oscillation * (theta + phi) * 4);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + temporalRipple;
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.21, e: 1.5, f: 2, uSegments: 64, vSegments: 48 }
  },

  bootstrap_paradox_loop: {
    name: 'Bootstrap Paradox Loop',
    equation: (u, v, params) => {
      const loopSize = params.d ?? 1.5;
      const causalTwist = params.e ?? 1;
      const informationFlow = params.f ?? 0.5;
      
      const theta = u * Math.PI * 4; // Double loop
      const s = v;
      
      // Möbius-like structure representing self-caused information
      const twist = causalTwist * Math.PI * s;
      const r = loopSize + informationFlow * Math.cos(twist);
      
      const x = r * Math.cos(theta / 2);
      const y = r * Math.sin(theta / 2);
      const z = informationFlow * Math.sin(twist) + 0.3 * Math.sin(theta);
      
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 1, f: 0.5, uSegments: 128, vSegments: 32 }
  }
};

export const TIME_TRAVEL_PHYSICS_KEYS = Object.keys(TIME_TRAVEL_PHYSICS);
console.log(`🕰️ Time Travel Physics loaded: ${TIME_TRAVEL_PHYSICS_KEYS.length} formulas with full A-Z parameter response`);

export const TIME_TRAVEL_PHYSICS_CATEGORY = {
  id: 'time-travel-physics',
  name: '🕰️ Time Travel Physics',
  icon: '🕰️',
  description: 'Mathematical foundations of temporal engineering: CTCs, wormholes, warp drives, and chronology protection based on Einstein Field Equations and Quantum Field Theory.',
  shapes: TIME_TRAVEL_PHYSICS_KEYS,
  engineDynamics: {
    primaryType: 'quantum' as const,
    symmetryOrder: 4,
    influenceFactors: ['spacetime_curvature', 'exotic_matter', 'frame_dragging', 'causal_structure']
  }
};
