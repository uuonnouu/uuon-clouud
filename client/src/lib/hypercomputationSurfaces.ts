
/**
 * HYPERCOMPUTATION MATHEMATICAL SURFACES
 * Visual representations of theoretical computing models beyond Church-Turing thesis
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 48,
    ...overrides
  };
}

export const HYPERCOMPUTATION_SURFACES: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // ORACLE MACHINE VISUALIZATION
  // ============================================================================
  
  oracle_black_box: {
    name: "🔮 Oracle Black Box - Uncomputable Problem Solver",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Box size
      const b = params.b ?? 1.0;     // Mystery depth
      const c = params.c ?? 0.5;     // Oracle energy
      const d = params.d ?? 10;      // Query frequency
      const e = params.e ?? 0;       // Animation time
      
      // Create mysterious black box with impossible geometries
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Base structure - impossible cube that folds through itself
      const cubeX = a * Math.sin(phi) * Math.cos(theta);
      const cubeY = a * Math.sin(phi) * Math.sin(theta);  
      const cubeZ = a * Math.cos(phi);
      
      // Oracle emanations - impossible energy patterns
      const oracleField = Math.sin(d * theta) * Math.cos(d * phi);
      const mysteryDepth = b * oracleField * Math.sin(e * Math.PI);
      
      // Uncomputable perturbations
      const impossibleX = cubeX + c * Math.sin(mysteryDepth * 10) * 0.3;
      const impossibleY = cubeY + c * Math.cos(mysteryDepth * 8) * 0.3;
      const impossibleZ = cubeZ + mysteryDepth;
      
      return [impossibleX, impossibleY, impossibleZ];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.0, c: 0.5, d: 10, e: 0, uSegments: 64, vSegments: 48 })
  },

  turing_jump_hierarchy: {
    name: "🪜 Turing Jump Hierarchy - Computational Power Ladder",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;     // Hierarchy height
      const b = params.b ?? 0.5;     // Level thickness
      const c = params.c ?? 1.0;     // Complexity scaling
      const d = params.d ?? 5;       // Number of levels
      const e = params.e ?? 0;       // Animation
      
      // Create stepped hierarchy representing increasing computational power
      const levels = Math.floor(d);
      const currentLevel = Math.floor(v * levels);
      const levelProgress = (v * levels) - currentLevel;
      
      // Each level can solve problems the previous level cannot
      const theta = u * 2 * Math.PI;
      const radius = c * (1 + currentLevel * 0.3);
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * (currentLevel / levels) + b * levelProgress + 
                e * Math.sin(theta * (currentLevel + 1)) * 0.1;
      
      // Add complexity perturbations showing undecidability gaps
      const undecidableGap = Math.sin(currentLevel * Math.PI) * 0.2;
      
      return [x + undecidableGap, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 0.5, c: 1.0, d: 5, e: 0, uSegments: 64, vSegments: 32 })
  },

  // ============================================================================
  // ZENO MACHINE (ACCELERATED TURING MACHINE)
  // ============================================================================
  
  zeno_machine_spiral: {
    name: "⚡ Zeno Machine Spiral - Infinite Steps in Finite Time",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Spiral radius
      const b = params.b ?? 0.5;     // Acceleration factor
      const c = params.c ?? 3.0;     // Vertical compression
      const d = params.d ?? 10;      // Steps parameter
      const e = params.e ?? 0;       // Time animation
      
      // Geometric series visualization: 1 + 1/2 + 1/4 + 1/8 + ... = 2
      const stepCount = d * u;  // Number of computational steps
      const stepTime = Math.pow(0.5, stepCount); // Each step takes half the time
      
      // Accelerating spiral - infinite rotations in finite time
      const theta = stepCount * 2 * Math.PI;
      const radiusFactor = a * (1 - stepTime); // Approaches limit
      
      const x = radiusFactor * Math.cos(theta) * (1 + e * Math.sin(stepCount) * 0.1);
      const y = radiusFactor * Math.sin(theta) * (1 + e * Math.cos(stepCount) * 0.1);
      const z = c * (v - 0.5) + b * Math.sin(stepCount * Math.PI) * stepTime;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 0.5, c: 3.0, d: 10, e: 0, uSegments: 48, vSegments: 32 })
  },

  accelerated_computation_surface: {
    name: "🌪️ Accelerated Computation Surface - Time Compression",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Base scale
      const b = params.b ?? 1.0;     // Compression rate
      const c = params.c ?? 0.5;     // Wave amplitude
      const d = params.d ?? 20;      // Frequency multiplier
      const e = params.e ?? 0;       // Animation
      
      // Time compression surface - each layer represents doubled computation speed
      const timeLayer = Math.floor(v * 10) / 10;
      const compressionFactor = Math.pow(2, timeLayer * 5);
      
      const theta = u * 2 * Math.PI;
      const fastOscillation = Math.sin(theta * d * compressionFactor);
      
      const x = a * Math.cos(theta) * (1 + c * fastOscillation / compressionFactor);
      const y = a * Math.sin(theta) * (1 + c * fastOscillation / compressionFactor);
      const z = b * timeLayer + e * Math.sin(compressionFactor * 0.1) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.0, c: 0.5, d: 20, e: 0, uSegments: 48, vSegments: 48 })
  },

  // ============================================================================
  // INFINITE TIME TURING MACHINE
  // ============================================================================
  
  infinite_time_manifold: {
    name: "♾️ Infinite Time Manifold - Transfinite Computation",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Manifold scale
      const b = params.b ?? 1.5;     // Ordinal progression
      const c = params.c ?? 1.0;     // Limit behavior
      const d = params.d ?? 0.618;   // Golden ratio ordinals
      const e = params.e ?? 0;       // Animation
      
      // Map u,v to transfinite ordinals (simplified)
      const ordinal = u * 100; // Finite ordinals
      const limitOrdinal = v; // Approach to limit ordinals
      
      // Transfinite manifold with limit suprema
      const theta = ordinal * Math.PI / 50;
      const phi = limitOrdinal * 2 * Math.PI;
      
      // Ordinal hierarchy visualization
      const ordinalRadius = a * Math.sqrt(ordinal + 1) / 10;
      const limitEffect = c * Math.pow(limitOrdinal, d);
      
      const x = ordinalRadius * Math.cos(theta) * (1 + limitEffect);
      const y = ordinalRadius * Math.sin(theta) * (1 + limitEffect);
      const z = b * Math.log(ordinal + 1) + e * Math.sin(phi * 5) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.5, c: 1.0, d: 0.618, e: 0, uSegments: 80, vSegments: 40 })
  },

  transfinite_ordinal_tower: {
    name: "🗼 Transfinite Ordinal Tower - ω, ω², ω^ω Hierarchy",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;     // Tower base radius
      const b = params.b ?? 4.0;     // Tower height
      const c = params.c ?? 0.3;     // Level thickness
      const d = params.d ?? 3;       // Ordinal levels (ω, ω², ω^ω)
      const e = params.e ?? 0;       // Animation
      
      // Ordinal hierarchy: ω < ω² < ω^ω < ε₀
      const levels = Math.floor(d);
      const currentLevel = Math.floor(v * levels);
      const levelProgress = (v * levels) - currentLevel;
      
      // Each level represents exponentially higher computational power
      const ordinalPower = Math.pow(2, currentLevel + 1);
      const theta = u * 2 * Math.PI * ordinalPower / 10;
      
      const radius = a * (1 + currentLevel * 0.4);
      const height = b * currentLevel / levels + c * levelProgress;
      
      // Cantor normal form perturbations
      const cantorOscillation = Math.sin(theta / ordinalPower) * Math.cos(currentLevel * Math.PI);
      
      const x = radius * Math.cos(theta) + e * cantorOscillation * 0.1;
      const y = radius * Math.sin(theta) + e * cantorOscillation * 0.1;
      const z = height + cantorOscillation * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 4.0, c: 0.3, d: 3, e: 0, uSegments: 64, vSegments: 24 })
  },

  // ============================================================================
  // MALAMENT-HOGARTH SPACETIME
  // ============================================================================
  
  malament_hogarth_spacetime: {
    name: "🌌 Malament-Hogarth Spacetime - Relativistic Hypercomputation",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;     // Spacetime curvature
      const b = params.b ?? 2.0;     // Event horizon proximity
      const c = params.c ?? 1.0;     // Time dilation effect
      const d = params.d ?? 0.9;     // Speed of light fraction
      const e = params.e ?? 0;       // Animation
      
      // Curved spacetime where infinite proper time = finite coordinate time
      const coordinateTime = u; // External observer time
      const radialDistance = v * b; // Distance from singular region
      
      // Schwarzschild-like metric with computational region
      const rs = 1.0; // Schwarzschild radius (computational horizon)
      const metricFactor = Math.sqrt(Math.max(0.01, 1 - rs / (radialDistance + 0.1)));
      
      // Time dilation visualization
      const properTime = coordinateTime / metricFactor;
      const timeDilation = c * (1 - metricFactor);
      
      // Spacetime manifold coordinates
      const theta = coordinateTime * 2 * Math.PI;
      const phi = radialDistance * Math.PI;
      
      const x = a * radialDistance * Math.sin(phi) * Math.cos(theta);
      const y = a * radialDistance * Math.sin(phi) * Math.sin(theta);
      const z = a * radialDistance * Math.cos(phi) + timeDilation + 
                e * Math.sin(properTime * Math.PI) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 2.0, c: 1.0, d: 0.9, e: 0, uSegments: 64, vSegments: 48 })
  },

  computational_light_cone: {
    name: "🔺 Computational Light Cone - Causal Hypercomputation",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Light cone opening
      const b = params.b ?? 3.0;     // Computational depth
      const c = params.c ?? 1.0;     // Speed of light
      const d = params.d ?? 0.5;     // Information density
      const e = params.e ?? 0;       // Animation
      
      // Light cone in Minkowski spacetime with computational regions
      const time = u * b; // Time coordinate
      const space = (v - 0.5) * a; // Spatial coordinate
      
      // Light cone constraint: |space| ≤ c * time
      const lightConeRadius = c * time;
      const actualRadius = Math.abs(space);
      
      // Only render inside light cone
      if (actualRadius <= lightConeRadius || time <= 0) {
        const phi = Math.sign(space) * Math.acos(actualRadius / (lightConeRadius + 0.01));
        
        // Computational density varies with spacetime position
        const computationalField = d * Math.sin(time * Math.PI) * Math.cos(space * Math.PI);
        
        const x = actualRadius * Math.cos(phi);
        const y = actualRadius * Math.sin(phi);
        const z = time + computationalField + e * Math.sin((time + space) * Math.PI) * 0.1;
        
        return [x, y, z];
      }
      
      return [0, 0, 0]; // Outside light cone
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 3.0, c: 1.0, d: 0.5, e: 0, uSegments: 48, vSegments: 32 })
  },

  // ============================================================================
  // UNDECIDABLE PROBLEM LANDSCAPES
  // ============================================================================
  
  halting_problem_landscape: {
    name: "🛑 Halting Problem Landscape - Undecidable Terrain",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;     // Landscape scale
      const b = params.b ?? 2.0;     // Problem complexity
      const c = params.c ?? 1.0;     // Undecidability factor
      const d = params.d ?? 50;      // Program encoding density
      const e = params.e ?? 0;       // Animation
      
      // Map (u,v) to program encodings
      const programX = (u - 0.5) * a * 2;
      const programY = (v - 0.5) * a * 2;
      const programEncoding = Math.floor(Math.abs(programX * programY * d)) % 1000;
      
      // Halting problem terrain - undecidable regions create impossible landscapes
      let haltingHeight;
      if (programEncoding % 2 === 0) {
        // Program halts - smooth terrain
        haltingHeight = b * Math.sin(programX) * Math.cos(programY);
      } else if (programEncoding % 3 === 0) {
        // Program doesn't halt - chaotic terrain
        haltingHeight = b * Math.sin(programX * 5) * Math.sin(programY * 3);
      } else {
        // Undecidable region - impossible geometry
        haltingHeight = c * Math.tan(programX + programY) * 0.1;
        haltingHeight = Math.max(-2, Math.min(2, haltingHeight)); // Clamp
      }
      
      const x = programX;
      const y = programY; 
      const z = haltingHeight + e * Math.sin((u + v) * Math.PI * 10) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 2.0, c: 1.0, d: 50, e: 0, uSegments: 48, vSegments: 48 })
  },

  // ============================================================================
  // SUPER-RECURSIVE ALGORITHMS
  // ============================================================================
  
  super_recursive_surface: {
    name: "🚀 Super-Recursive Surface - Beyond Primitive Recursion",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Base scale
      const b = params.b ?? 1.5;     // Ackermann factor
      const c = params.c ?? 0.5;     // Growth rate
      const d = params.d ?? 3;       // Recursion depth
      const e = params.e ?? 0;       // Animation
      
      // Super-recursive function visualization (simplified Ackermann-like)
      const m = Math.floor(u * d) + 1;
      const n = Math.floor(v * d) + 1;
      
      // Simplified super-exponential growth
      let result = 1;
      for (let i = 0; i < Math.min(m, 5); i++) {
        result = Math.pow(result + n, c + 1);
        result = Math.min(result, 100); // Prevent overflow
      }
      
      const growthFactor = Math.log(result + 1);
      const theta = (u + v) * Math.PI;
      
      const x = a * Math.cos(theta) * growthFactor / 10;
      const y = a * Math.sin(theta) * growthFactor / 10;
      const z = b * growthFactor + e * Math.sin(theta * 5) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.5, c: 0.5, d: 3, e: 0, uSegments: 48, vSegments: 48 })
  },

  // ============================================================================
  // QUANTUM HYPERCOMPUTATION HYBRID
  // ============================================================================
  
  quantum_oracle_hybrid: {
    name: "⚛️ Quantum Oracle Hybrid - Superposition Hypercomputation",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Quantum amplitude
      const b = params.b ?? 1.0;     // Oracle coupling
      const c = params.c ?? 0.5;     // Entanglement factor
      const d = params.d ?? 8;       // Qubit count
      const e = params.e ?? 0;       // Animation
      
      // Quantum superposition of computational states
      const qubits = Math.floor(d);
      const stateSpace = Math.pow(2, Math.min(qubits, 10)); // Limit to prevent overflow
      
      const quantumPhase = u * 2 * Math.PI * stateSpace / 100;
      const oraclePhase = v * 2 * Math.PI;
      
      // Superposition amplitude
      const amplitude = a * Math.cos(quantumPhase) * Math.sin(oraclePhase);
      const oracleEntanglement = b * c * Math.sin(quantumPhase + oraclePhase);
      
      // Quantum-Oracle hybrid geometry
      const theta = quantumPhase;
      const phi = oraclePhase;
      
      const x = amplitude * Math.sin(phi) * Math.cos(theta);
      const y = amplitude * Math.sin(phi) * Math.sin(theta);
      const z = amplitude * Math.cos(phi) + oracleEntanglement + 
                e * Math.sin((quantumPhase + oraclePhase) * 0.5) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.0, c: 0.5, d: 8, e: 0, uSegments: 64, vSegments: 48 })
  }
};

// Export all hypercomputation surfaces
export function getHypercomputationSurface(name: string): ParametricSurface | undefined {
  return HYPERCOMPUTATION_SURFACES[name];
}

export function getAllHypercomputationSurfaceNames(): string[] {
  return Object.keys(HYPERCOMPUTATION_SURFACES);
}
