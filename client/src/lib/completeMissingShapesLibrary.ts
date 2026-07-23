/**
 * COMPLETE MISSING SHAPES LIBRARY
 * Comprehensive implementation of all 64+ missing shapes
 * December 2025 - Full Shape Recovery System
 * 
 * This library ensures 100% shape coverage with zero placeholders
 */

import { SurfaceParameters } from '../types/math';
import { JACOBIAN_TRANSFORMATION_SHAPES } from './jacobianTransformationShapes';
import { BABYLONIAN_ZODIAC_SHAPES } from './babylonianZodiacShapes';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 2, b: 2, c: 2, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

// ========================================
// BIOLOGICAL STRUCTURES
// ========================================

export const BIOLOGICAL_SHAPES: Record<string, ParametricSurface> = {
  
  dnaHelix: {
    name: "DNA Double Helix",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3, c = 4 } = params;
      const t = u * Math.PI * c;
      const phi = v * Math.PI * 2;
      
      const strand1_x = a * Math.cos(t);
      const strand1_y = a * Math.sin(t);
      
      const strand2_x = a * Math.cos(t + Math.PI);
      const strand2_y = a * Math.sin(t + Math.PI);
      
      const blend = v;
      const x = strand1_x * (1 - blend) + strand2_x * blend + b * Math.cos(phi);
      const y = strand1_y * (1 - blend) + strand2_y * blend + b * Math.sin(phi);
      const z = u * c * 2;
      
      return [x, y, z - c];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.3, c: 4 })
  },

  cellMembrane: {
    name: "Cell Membrane Bilayer",
    equation: (u, v, params) => {
      const { a = 3, b = 0.5, c = 0.1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const lipidWave = c * Math.sin(x * 3) * Math.cos(y * 3);
      const membrane = b * Math.sin(x * 8) * Math.sin(y * 8) * 0.05;
      const z = lipidWave + membrane;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 0.5, c: 0.1 })
  },

  proteinFolding: {
    name: "Protein Folding Structure",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 3 } = params;
      const theta = u * Math.PI * 4;
      const phi = v * Math.PI * 2;
      
      const radius = a + b * Math.sin(c * theta);
      const fold = 0.3 * Math.sin(5 * theta) * Math.cos(3 * phi);
      
      const x = (radius + fold) * Math.cos(theta) * Math.cos(phi);
      const y = (radius + fold) * Math.sin(theta) * Math.cos(phi);
      const z = (radius + fold) * Math.sin(phi) + theta / 3;
      
      return [x, y, z - Math.PI * 2];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 3 })
  },

  circular_disc: {
    name: "Mathematical Circular Disc",
    equation: (u, v, params) => {
      const a = Math.max(0.1, params.a ?? 1);
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const r = a * sinPhi;
      const biconcaveZ = a * 0.2 * (1 - 2.5 * Math.pow(sinPhi - 0.5, 2)) * Math.cos(phi);

      return [r * Math.cos(theta), r * Math.sin(theta), biconcaveZ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 0.4 })
  },

  multi_node_system: {
    name: "Multi-Node Mathematical System",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;
      const nodes = 4;
      const nodeDepth = 0.15 * Math.sin(nodes * theta) * Math.sin(2 * phi);
      r += nodeDepth;
      const granules = 0.02 * Math.sin(15 * theta) * Math.sin(15 * phi);
      r += granules;

      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi];
    },
    defaultParams: getCleanDefaults({ a: 1.2, f: 15 })
  },

  spherical_computation_unit: {
    name: "Spherical Computation Unit",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;
      const nodeBulge = 0.3 * Math.exp(-2 * Math.pow(phi - Math.PI/2, 2));
      r += nodeBulge;
      const smoothSurface = 0.01 * Math.sin(8 * theta) * Math.sin(6 * phi);
      r += smoothSurface;

      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi + nodeBulge * 0.5];
    },
    defaultParams: getCleanDefaults({ a: 0.9 })
  },

  curved_processing_unit: {
    name: "Curved Processing Unit",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;
      const kidneyIndent = 0.25 * Math.sin(theta) * Math.sin(2 * phi) * 
                          Math.exp(-Math.pow(theta - Math.PI, 2));
      r -= Math.abs(kidneyIndent);
      const irregularSurface = 0.03 * Math.sin(12 * theta) * Math.sin(8 * phi);
      r += irregularSurface;

      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi];
    },
    defaultParams: getCleanDefaults({ a: 1.5 })
  },

  adaptive_pattern_processor: {
    name: "Adaptive Pattern Processor",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      let r = a * sinPhi;
      const protrusions = 0.4 * Math.max(0, Math.sin(3 * theta) * Math.sin(phi));
      r += protrusions;
      const roughSurface = 0.05 * Math.sin(20 * theta) * Math.sin(15 * phi);
      r += roughSurface;

      return [r * Math.cos(theta), r * Math.sin(theta), a * cosPhi];
    },
    defaultParams: getCleanDefaults({ a: 1.3 })
  },

  mathematical_fragment: {
    name: "Mathematical Fragment",
    equation: (u, v, params) => {
      const a = params.a ?? 0.5;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const fragmentShape = a * sinPhi * (1 + 0.3 * Math.sin(6 * theta) * Math.sin(4 * phi));
      const irregularity = 0.1 * Math.sin(15 * theta) * Math.sin(12 * phi);

      return [
        (fragmentShape + irregularity) * Math.cos(theta),
        (fragmentShape + irregularity) * Math.sin(theta),
        a * cosPhi * 0.7
      ];
    },
    defaultParams: getCleanDefaults({ a: 0.5 })
  }
};

// ========================================
// TOPOLOGY & DIFFERENTIAL GEOMETRY
// ========================================

export const TOPOLOGY_SHAPES: Record<string, ParametricSurface> = {

  klein_bottle: {
    name: "Klein Bottle",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const r = a + b * Math.cos(phi / 2) * Math.sin(theta) - b * Math.sin(phi / 2) * Math.sin(2 * theta);
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      const z = c * (Math.sin(phi / 2) * Math.sin(theta) + Math.cos(phi / 2) * Math.sin(2 * theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  mobius_strip: {
    name: "Möbius Strip",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const width = (v - 0.5) * b;
      
      const x = (a + width * Math.cos(theta / 2)) * Math.cos(theta);
      const y = (a + width * Math.cos(theta / 2)) * Math.sin(theta);
      const z = c * width * Math.sin(theta / 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  boys_surface: {
    name: "Boy's Surface",
    equation: (u, v, params) => {
      const { a = 1.5, b = 1, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = a * (Math.cos(theta) * Math.sin(2 * phi) / 2 + Math.sqrt(2) * Math.sin(theta) * Math.cos(phi)) / 
                (1 - Math.sqrt(2) * Math.sin(theta) * Math.cos(theta) * Math.sin(3 * phi) / 2);
      const y = b * (Math.cos(theta) * Math.sin(2 * phi) / 2 - Math.sqrt(2) * Math.sin(theta) * Math.sin(phi)) /
                (1 - Math.sqrt(2) * Math.sin(theta) * Math.cos(theta) * Math.sin(3 * phi) / 2);
      const z = c * (Math.cos(theta) * Math.cos(theta) - Math.sqrt(2) * Math.sin(theta) * Math.cos(theta) * Math.cos(3 * phi)) /
                (1 - Math.sqrt(2) * Math.sin(theta) * Math.cos(theta) * Math.sin(3 * phi) / 2);
      
      return [x || 0, y || 0, z || 0];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 1 })
  },

  cross_cap: {
    name: "Cross-Cap Surface",
    equation: (u, v, params) => {
      const { a = 1.5, b = 1, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = a * Math.sin(theta) * Math.cos(phi);
      const y = b * Math.sin(theta) * Math.sin(phi);
      const z = c * Math.cos(theta) * Math.cos(2 * phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 1 })
  },

  roman_surface: {
    name: "Steiner Roman Surface",
    equation: (u, v, params) => {
      const { a = 1.5, b = 1, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const x = a * Math.sin(2 * theta) * Math.cos(phi) * Math.cos(phi);
      const y = b * Math.sin(2 * theta) * Math.sin(phi) * Math.cos(phi);
      const z = c * Math.sin(theta) * Math.sin(theta) * Math.sin(2 * phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 1 })
  },

  enneper_surface: {
    name: "Enneper Minimal Surface",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1 } = params;
      const uVal = (u - 0.5) * 3;
      const vVal = (v - 0.5) * 3;
      
      const x = a * uVal * (1 - uVal * uVal / 3 + vVal * vVal);
      const y = b * vVal * (1 - vVal * vVal / 3 + uVal * uVal);
      const z = c * (uVal * uVal - vVal * vVal);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1 })
  }
};

// ========================================
// COMPUTATIONAL & ALGORITHMIC SHAPES
// ========================================

export const COMPUTATIONAL_SHAPES: Record<string, ParametricSurface> = {

  neural_network_layer: {
    name: "Neural Network Layer",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 0.5 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const activation = Math.tanh(x * b) * Math.tanh(y * b);
      const layer = c * activation * Math.sin(x * 3) * Math.cos(y * 3);
      
      return [x, y, layer];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 0.5 })
  },

  gradient_descent_surface: {
    name: "Gradient Descent Optimization Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 2 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const loss = b * (Math.pow(x, 2) + Math.pow(y, 2)) + 
                   c * 0.5 * Math.sin(x * 2) * Math.cos(y * 2);
      
      return [x, y, loss];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 2 })
  },

  attention_mechanism: {
    name: "Transformer Attention Mechanism",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const attention = Math.exp(-(x * x + y * y) / (2 * b * b));
      const softmax = c * attention * Math.cos(x * 4) * Math.cos(y * 4);
      
      return [x, y, softmax];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  convolution_kernel: {
    name: "Convolution Kernel Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const gaussian = Math.exp(-(x * x + y * y) / (2 * b));
      const kernel = c * gaussian * (1 - (x * x + y * y) / b);
      
      return [x, y, kernel];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  backpropagation_flow: {
    name: "Backpropagation Gradient Flow",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 0.5 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const gradient = -b * 2 * x * Math.exp(-(x * x + y * y));
      const flow = c * Math.sin(x * 3) * gradient;
      
      return [x, y, flow];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 0.5 })
  }
};

// ========================================
// QUANTUM & PHYSICS SHAPES
// ========================================

export const QUANTUM_SHAPES: Record<string, ParametricSurface> = {

  wave_function_collapse: {
    name: "Wave Function Collapse",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const r = Math.sqrt(x * x + y * y);
      const psi = Math.exp(-r * r / (2 * b)) * Math.cos(r * c);
      
      return [x, y, psi];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  quantum_tunneling: {
    name: "Quantum Tunneling Barrier",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const barrier = b * Math.exp(-Math.pow(x, 2) / 0.5);
      const wave = c * Math.sin(x * 5) * Math.exp(-Math.abs(x - 1));
      
      return [x, y, barrier + wave * 0.3];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  spin_orbit_coupling: {
    name: "Spin-Orbit Coupling",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 0.5 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = a * (1 + b * Math.cos(2 * theta) * Math.sin(phi));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 0.5 })
  },

  bose_einstein_condensate: {
    name: "Bose-Einstein Condensate",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = a * Math.exp(-b * phi * phi / (Math.PI * Math.PI));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  fermi_surface: {
    name: "Fermi Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 0.3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = a * (1 + b * (Math.cos(4 * theta) + Math.cos(4 * phi)));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.3, c: 1 })
  }
};

// ========================================
// CRYPTOGRAPHIC & MATHEMATICAL SHAPES
// ========================================

export const CRYPTOGRAPHIC_SHAPES: Record<string, ParametricSurface> = {

  elliptic_curve_surface: {
    name: "Elliptic Curve Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const t = (v - 0.5) * 4;
      
      const y = Math.pow(Math.abs(x * x * x - x * b + c), 1/3) * (t > 0 ? 1 : -1);
      const z = t;
      
      return [x, y || 0, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  hash_function_distribution: {
    name: "Hash Function Distribution",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const hash1 = Math.sin(x * b) * Math.cos(y * b * 1.618);
      const hash2 = Math.sin(x * b * 2.3) * Math.cos(y * b * 0.7);
      const z = c * (hash1 * hash2 + hash1 + hash2) / 3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  modular_arithmetic_torus: {
    name: "Modular Arithmetic Torus",
    equation: (u, v, params) => {
      const { a = 2, b = 0.7, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const mod = 7;
      const modTheta = (theta * mod) % (Math.PI * 2);
      
      const x = (a + b * Math.cos(phi)) * Math.cos(modTheta);
      const y = (a + b * Math.cos(phi)) * Math.sin(modTheta);
      const z = c * b * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.7, c: 1 })
  }
};

// ========================================
// ADDITIONAL MATHEMATICAL SHAPES
// ========================================

export const ADDITIONAL_MATH_SHAPES: Record<string, ParametricSurface> = {

  seashell: {
    name: "Mathematical Seashell",
    equation: (u, v, params) => {
      const { a = 1, b = 0.1, c = 2 } = params;
      const theta = u * Math.PI * 4;
      const phi = v * Math.PI * 2;
      
      const r = Math.pow(Math.E, b * theta) * a;
      const x = r * Math.cos(theta) * (1 + Math.cos(phi));
      const y = r * Math.sin(theta) * (1 + Math.cos(phi));
      const z = r * Math.sin(phi) * c + theta * b * 2;
      
      return [x, y, z - 4];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.1, c: 2 })
  },

  saddle_surface: {
    name: "Hyperbolic Paraboloid",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = c * (x * x - y * y) * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  monkey_saddle: {
    name: "Monkey Saddle Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 0.3, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = c * b * (x * x * x - 3 * x * y * y);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 0.3, c: 1 })
  },

  dinis_surface: {
    name: "Dini's Surface",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3, c = 1 } = params;
      const theta = u * Math.PI * 4;
      const t = v * 0.9 + 0.05;
      
      const x = a * Math.cos(theta) * Math.sin(t);
      const y = a * Math.sin(theta) * Math.sin(t);
      const z = c * (Math.cos(t) + Math.log(Math.tan(t / 2))) + b * theta;
      
      return [x, y, z || 0];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.3, c: 1 })
  },

  catenoid: {
    name: "Catenoid Minimal Surface",
    equation: (u, v, params) => {
      const { a = 1, b = 2, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * b * 2;
      
      const r = a * Math.cosh(t);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 2, c: 1 })
  },

  helicoid: {
    name: "Helicoid Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 2 } = params;
      const theta = u * Math.PI * 2 * c;
      const r = (v - 0.5) * a * 2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = b * theta / (Math.PI * 2);
      
      return [x, y, z - c * b / 2];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 2 })
  },

  scherk_surface: {
    name: "Scherk Minimal Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const cosX = Math.cos(x * b);
      const cosY = Math.cos(y * b);
      const z = c * Math.log(Math.abs(cosX / cosY + 0.01));
      
      return [x, y, Math.max(-3, Math.min(3, z))];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  egg_carton: {
    name: "Egg Carton Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 3, c = 0.5 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = c * Math.sin(x * b) * Math.sin(y * b);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3, c: 0.5 })
  },

  horn: {
    name: "Mathematical Horn",
    equation: (u, v, params) => {
      const { a = 1, b = 3, c = 1 } = params;
      const theta = v * Math.PI * 2;
      const t = u * b;
      
      const r = a * Math.exp(-t * 0.3);
      const x = r * Math.cos(theta) * (1 + t * 0.1);
      const y = r * Math.sin(theta) * (1 + t * 0.1);
      const z = c * t;
      
      return [x, y, z - b * c / 2];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 3, c: 1 })
  },

  spring: {
    name: "Mathematical Spring",
    equation: (u, v, params) => {
      const { a = 0.3, b = 2, c = 4 } = params;
      const theta = u * Math.PI * 2 * c;
      const phi = v * Math.PI * 2;
      
      const x = (b + a * Math.cos(phi)) * Math.cos(theta);
      const y = (b + a * Math.cos(phi)) * Math.sin(theta);
      const z = a * Math.sin(phi) + theta / (Math.PI * 2);
      
      return [x, y, z - c / 2];
    },
    defaultParams: getCleanDefaults({ a: 0.3, b: 2, c: 4 })
  }
};

// ========================================
// FRACTAL & STRANGE ATTRACTOR SHAPES
// ========================================

export const FRACTAL_SHAPES: Record<string, ParametricSurface> = {

  julia_set_surface: {
    name: "Julia Set 3D Surface",
    equation: (u, v, params) => {
      const { a = 3, b = -0.4, c = 0.6 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      let zr = x, zi = y;
      const cr = b, ci = c;
      let iterations = 0;
      
      for (let i = 0; i < 20; i++) {
        const zr2 = zr * zr - zi * zi + cr;
        const zi2 = 2 * zr * zi + ci;
        zr = zr2;
        zi = zi2;
        if (zr * zr + zi * zi > 4) break;
        iterations++;
      }
      
      const z = iterations / 10;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: -0.4, c: 0.6 })
  },

  lorenz_attractor_surface: {
    name: "Lorenz Attractor Surface",
    equation: (u, v, params) => {
      const { a = 10, b = 28, c = 8/3 } = params;
      const t = u * 4;
      const s = (v - 0.5) * 2;
      
      let x = 1, y = 1, z = 1;
      const dt = 0.01;
      
      for (let i = 0; i < t * 100; i++) {
        const dx = a * (y - x);
        const dy = x * (b - z) - y;
        const dz = x * y - c * z;
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      return [x / 10 + s, y / 10, z / 10 - 2];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 28, c: 2.67 })
  },

};

// ========================================
// EXTENDED TOPOLOGY SHAPES
// ========================================

export const EXTENDED_TOPOLOGY: Record<string, ParametricSurface> = {
  
  figure8_knot: {
    name: "Figure-8 Knot",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3, c = 1 } = params;
      const t = u * Math.PI * 4;
      const phi = v * Math.PI * 2;
      
      const x = (2 + Math.cos(2 * t)) * Math.cos(3 * t);
      const y = (2 + Math.cos(2 * t)) * Math.sin(3 * t);
      const z = Math.sin(4 * t);
      
      const tube = b * Math.cos(phi);
      const tubeZ = b * Math.sin(phi);
      
      return [a * (x + tube * Math.cos(t)), a * (y + tube * Math.sin(t)), c * (z + tubeZ)];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.3, c: 1 })
  },

  genus2_surface: {
    name: "Genus 2 Surface (Double Torus)",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const r1 = a + b * Math.cos(phi);
      const r2 = a + b * Math.cos(phi + Math.PI);
      const blend = 0.5 + 0.5 * Math.cos(theta);
      
      const x = (r1 * blend + r2 * (1 - blend)) * Math.cos(theta);
      const y = (r1 * blend + r2 * (1 - blend)) * Math.sin(theta);
      const z = c * b * Math.sin(phi) * Math.sin(2 * theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  genus3_surface: {
    name: "Genus 3 Surface (Triple Torus)",
    equation: (u, v, params) => {
      const { a = 2, b = 0.4, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const lobes = 3;
      const r = a + b * Math.cos(phi) + 0.3 * Math.cos(lobes * theta);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * b * Math.sin(phi) * (1 + 0.3 * Math.sin(lobes * theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.4, c: 1 })
  },

  fiber_bundle: {
    name: "Fiber Bundle",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 2 } = params;
      const baseAngle = u * Math.PI * 2;
      const fiberParam = v;
      
      const baseX = a * Math.cos(baseAngle);
      const baseY = a * Math.sin(baseAngle);
      const fiberAngle = baseAngle * 2;
      
      const fiberX = b * Math.cos(fiberAngle) * fiberParam;
      const fiberY = b * Math.sin(fiberAngle) * fiberParam;
      const fiberZ = c * fiberParam;
      
      return [baseX + fiberX, baseY + fiberY, fiberZ - c / 2];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 2 })
  },

  homotopy_deformation: {
    name: "Homotopy Deformation",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const t = v;
      const theta = u * Math.PI * 2;
      
      const sphereX = a * Math.sin(Math.PI * t) * Math.cos(theta);
      const sphereY = a * Math.sin(Math.PI * t) * Math.sin(theta);
      const sphereZ = a * Math.cos(Math.PI * t);
      
      const torusX = (b + 0.3 * Math.cos(theta * 3)) * Math.cos(theta);
      const torusY = (b + 0.3 * Math.cos(theta * 3)) * Math.sin(theta);
      const torusZ = 0.3 * Math.sin(theta * 3);
      
      const blend = c * Math.sin(Math.PI * t);
      return [
        sphereX * (1 - blend) + torusX * blend,
        sphereY * (1 - blend) + torusY * blend,
        sphereZ * (1 - blend) + torusZ * blend
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  }
};

// ========================================
// UUON ROBOTICS & SYSTEMS SHAPES
// ========================================

export const UUON_SYSTEMS: Record<string, ParametricSurface> = {

  'uuon-motor-rotation': {
    name: "UUON Motor Rotation",
    equation: (u, v, params) => {
      const { a = 1.5, b = 0.3, c = 4 } = params;
      const theta = u * Math.PI * 2 * c;
      const phi = v * Math.PI * 2;
      
      const r = a + b * Math.cos(phi);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = b * Math.sin(phi) + theta / (Math.PI * 2) * 0.5;
      
      return [x, y, z - c * 0.25];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.3, c: 4 })
  },

  'uuon-servo-angle': {
    name: "UUON Servo Angle",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const angle = u * Math.PI;
      const r = v * a;
      
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = c * Math.sin(angle * 2) * v;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  'uuon-wheel-encoder': {
    name: "UUON Wheel Encoder",
    equation: (u, v, params) => {
      const { a = 2, b = 0.1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const encoderSlots = 32;
      const slotPattern = Math.sin(encoderSlots * theta) > 0 ? 1 : 0.9;
      const r = a * slotPattern;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * b * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.1, c: 1 })
  },

  'uuon-periodic-system': {
    name: "UUON Periodic System",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const periodic = Math.sin(x * b) * Math.cos(y * b) + Math.sin(x * b * 1.5) * Math.cos(y * b * 1.5);
      const z = c * periodic * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-oscillating-quant': {
    name: "UUON Oscillating Quantum",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = a * (1 + 0.3 * Math.sin(b * theta) * Math.sin(b * phi));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = c * r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-pid-controller': {
    name: "UUON PID Controller Response",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 2 } = params;
      const t = u * a;
      const s = (v - 0.5) * 2;
      
      const kp = 1, ki = 0.5, kd = 0.2;
      const response = 1 - Math.exp(-kp * t) * (Math.cos(ki * t * b) + kd * Math.sin(kd * t * b));
      const z = c * response * (1 + 0.1 * s);
      
      return [t - a / 2, s, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 2 })
  },

  'uuon-gyroscope-drift': {
    name: "UUON Gyroscope Drift",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const drift = 0.1 * theta;
      const r = a * (1 + drift * 0.05);
      const x = r * Math.sin(phi) * Math.cos(theta + drift);
      const y = r * Math.sin(phi) * Math.sin(theta + drift);
      const z = c * r * Math.cos(phi) + drift * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-accelerometer-3axis': {
    name: "UUON 3-Axis Accelerometer",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const ax = a * Math.sin(2 * theta);
      const ay = a * Math.sin(3 * theta);
      const az = a * Math.cos(2 * theta);
      
      const x = ax * Math.sin(phi) * b;
      const y = ay * Math.sin(phi) * b;
      const z = az * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-harmonic-cycle': {
    name: "UUON Harmonic Cycle",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      const r = a * (1 + 0.3 * Math.sin(b * theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * Math.sin(b * phi) * 0.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-sensor-sampling': {
    name: "UUON Sensor Sampling",
    equation: (u, v, params) => {
      const { a = 3, b = 8, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const sample = Math.floor(u * b) / b;
      const z = c * Math.sin(sample * 10) * Math.exp(-y * y);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 8, c: 1 })
  },

  'uuon-control-reset': {
    name: "UUON Control Reset",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const reset = (u < 0.1 || u > 0.9) ? 0 : 1;
      const r = a * reset * (1 + 0.2 * Math.sin(4 * theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * v * reset;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-rotation-state': {
    name: "UUON Rotation State",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 2 } = params;
      const theta = u * Math.PI * 2 * c;
      const phi = v * Math.PI;
      const r = a * Math.sin(phi);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = a * Math.cos(phi) * b;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 2 })
  },

  'uuon-strange-attractor-loop': {
    name: "UUON Strange Attractor Loop",
    equation: (u, v, params) => {
      const { a = 10, b = 28, c = 2.67 } = params;
      let x = 0.1, y = 0, z = 0;
      const t = u * 4;
      for (let i = 0; i < t * 50; i++) {
        const dx = a * (y - x) * 0.02;
        const dy = (x * (b - z) - y) * 0.02;
        const dz = (x * y - c * z) * 0.02;
        x += dx; y += dy; z += dz;
      }
      return [x / 15 + (v - 0.5) * 2, y / 15, z / 15 - 1];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 28, c: 2.67 })
  },

  'uuon-iteration-bound': {
    name: "UUON Iteration Bound",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      let iter = 0;
      let zr = x, zi = y;
      while (iter < b && zr * zr + zi * zi < 4) {
        const temp = zr * zr - zi * zi + x;
        zi = 2 * zr * zi + y;
        zr = temp;
        iter++;
      }
      return [x, y, c * iter / b];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  },

  'uuon-modular-fractal-gen': {
    name: "UUON Modular Fractal Generator",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const mod = ((Math.floor(x * b) + Math.floor(y * b)) % 2);
      const z = c * mod * Math.sin(x * y);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  'uuon-chaos-segment': {
    name: "UUON Chaos Segment",
    equation: (u, v, params) => {
      const { a = 3, b = 3.9, c = 1 } = params;
      let x = u;
      for (let i = 0; i < 10; i++) {
        x = b * x * (1 - x);
      }
      const y = (v - 0.5) * a * 2;
      return [(u - 0.5) * a * 2, y, c * x * 2 - 1];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3.9, c: 1 })
  },

  'uuon-discrete-dynamical': {
    name: "UUON Discrete Dynamical System",
    equation: (u, v, params) => {
      const { a = 2, b = 1.4, c = 0.3 } = params;
      let x = (u - 0.5) * 2, y = (v - 0.5) * 2;
      for (let i = 0; i < 5; i++) {
        const xNew = 1 - b * x * x + y;
        y = c * x;
        x = xNew;
      }
      return [x * a / 2, y * a / 2, (x + y) * 0.5];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1.4, c: 0.3 })
  },

  'uuon-celestial-phase': {
    name: "UUON Celestial Phase",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const phase = Math.sin(b * theta) * Math.cos(b * phi);
      const r = a * (1 + 0.2 * phase);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = c * r * Math.cos(phi);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-wave-interference': {
    name: "UUON Wave Interference",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const r1 = Math.sqrt((x - 1) * (x - 1) + y * y);
      const r2 = Math.sqrt((x + 1) * (x + 1) + y * y);
      const z = c * (Math.sin(r1 * b) + Math.sin(r2 * b)) * 0.5;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  'uuon-feedback-loop': {
    name: "UUON Feedback Loop",
    equation: (u, v, params) => {
      const { a = 2, b = 0.7, c = 1 } = params;
      const theta = u * Math.PI * 2;
      let r = a;
      for (let i = 0; i < 5; i++) {
        r = r * b + Math.sin(theta * (i + 1)) * 0.3;
      }
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * v;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.7, c: 1 })
  },

  'uuon-state-machine': {
    name: "UUON State Machine",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const state = Math.floor(u * b) % b;
      const theta = v * Math.PI * 2;
      const r = a * (1 + 0.2 * state);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * state / b;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-signal-filter': {
    name: "UUON Signal Filter",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const signal = Math.sin(x * b) * Math.sin(y * b);
      const filtered = signal > 0 ? signal : 0;
      return [x, y, c * filtered];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  'uuon-pwm-modulation': {
    name: "UUON PWM Modulation",
    equation: (u, v, params) => {
      const { a = 3, b = 10, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const duty = (Math.sin(x * 2) + 1) / 2;
      const pwm = (y * b % 1) < duty ? 1 : 0;
      return [x, y, c * pwm];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 10, c: 1 })
  },

  'uuon-trajectory-planner': {
    name: "UUON Trajectory Planner",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const t = u * Math.PI * 2;
      const s = v;
      const x = a * Math.cos(t) * (1 - s * 0.5);
      const y = a * Math.sin(t) * (1 - s * 0.5);
      const z = c * b * s;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-inverse-kinematics': {
    name: "UUON Inverse Kinematics",
    equation: (u, v, params) => {
      const { a = 1.5, b = 1, c = 1 } = params;
      const angle1 = u * Math.PI;
      const angle2 = v * Math.PI;
      const x = a * Math.cos(angle1) + b * Math.cos(angle1 + angle2);
      const y = a * Math.sin(angle1) + b * Math.sin(angle1 + angle2);
      const z = c * 0.5 * Math.sin(angle1 + angle2);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1, c: 1 })
  },

  'uuon-differential-drive': {
    name: "UUON Differential Drive",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const leftWheel = u * Math.PI * 2;
      const rightWheel = v * Math.PI * 2;
      const x = a * (Math.cos(leftWheel) + Math.cos(rightWheel)) / 2;
      const y = a * (Math.sin(leftWheel) + Math.sin(rightWheel)) / 2;
      const z = c * b * (leftWheel - rightWheel);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  'uuon-neural-activation': {
    name: "UUON Neural Activation",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const input = x * b;
      const relu = Math.max(0, input);
      const sigmoid = 1 / (1 + Math.exp(-input));
      const z = c * (relu * 0.3 + sigmoid * 0.7);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-memory-buffer': {
    name: "UUON Memory Buffer",
    equation: (u, v, params) => {
      const { a = 3, b = 8, c = 1 } = params;
      const addr = Math.floor(u * b);
      const data = Math.floor(v * b);
      const x = (addr / b - 0.5) * a * 2;
      const y = (data / b - 0.5) * a * 2;
      const z = c * ((addr + data) % 2);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 8, c: 1 })
  },

  'uuon-clock-sync': {
    name: "UUON Clock Synchronization",
    equation: (u, v, params) => {
      const { a = 2, b = 8, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      const clock1 = Math.sin(b * theta);
      const clock2 = Math.sin(b * phi + 0.5);
      const sync = clock1 * clock2;
      const r = a * (1 + 0.2 * sync);
      return [r * Math.cos(theta), r * Math.sin(theta), c * sync];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 8, c: 1 })
  },

  'uuon-power-management': {
    name: "UUON Power Management",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const load = (x * x + y * y) / (a * a);
      const power = b * (1 - Math.exp(-load * 2));
      return [x, y, c * power];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-thermal-model': {
    name: "UUON Thermal Model",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const heat = Math.exp(-(x * x + y * y) / (b * b));
      const z = c * heat;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-error-correction': {
    name: "UUON Error Correction",
    equation: (u, v, params) => {
      const { a = 3, b = 0.1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const noise = Math.sin(x * 20) * b;
      const signal = Math.sin(x * 3) * Math.cos(y * 3);
      const corrected = signal;
      return [x, y, c * corrected];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 0.1, c: 1 })
  },

  'uuon-data-compression': {
    name: "UUON Data Compression",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const quantized = Math.round(Math.sin(x * 2) * b) / b;
      const z = c * quantized * Math.cos(y);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  },

  'uuon-protocol-handler': {
    name: "UUON Protocol Handler",
    equation: (u, v, params) => {
      const { a = 3, b = 3, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const layer = Math.floor(v * b) / b;
      const packet = Math.sin(x * 5 * (layer + 1));
      return [x, y, c * packet * layer];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3, c: 1 })
  },

  'uuon-bus-arbiter': {
    name: "UUON Bus Arbiter",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const channel = Math.floor(u * b);
      const priority = Math.floor(v * b);
      const granted = channel === priority ? 1 : 0.3;
      const theta = u * Math.PI * 2;
      const r = a * granted;
      return [r * Math.cos(theta), r * Math.sin(theta), c * channel / b];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-interrupt-handler': {
    name: "UUON Interrupt Handler",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const interrupt = Math.abs(Math.sin(x * b)) > 0.9 ? 1 : 0;
      const z = c * interrupt + 0.1 * Math.sin(y * 3);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  'uuon-watchdog-timer': {
    name: "UUON Watchdog Timer",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 2 } = params;
      const t = u * c;
      const theta = v * Math.PI * 2;
      const timeout = t > b ? 0 : 1;
      const r = a * timeout * (1 - t / c);
      return [r * Math.cos(theta), r * Math.sin(theta), t];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 2 })
  },

  'uuon-bootloader-sequence': {
    name: "UUON Bootloader Sequence",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const stage = Math.floor(u * b);
      const progress = (u * b) - stage;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = c * (stage / b + progress * 0.1);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  },

  'uuon-firmware-update': {
    name: "UUON Firmware Update",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const progress = u;
      const flashing = Math.sin(progress * 20) > 0 ? 1 : 0.5;
      const z = c * progress * flashing * b;
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-calibration-routine': {
    name: "UUON Calibration Routine",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const offset = 0.1 * Math.sin(b * theta);
      const r = a * (1 + offset);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = c * r * Math.cos(phi);
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-diagnostic-mode': {
    name: "UUON Diagnostic Mode",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const test1 = Math.sin(x * 4);
      const test2 = Math.cos(y * 4);
      const pass = (test1 > 0 && test2 > 0) ? b : 0;
      return [x, y, c * pass];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-orbital-resonance': {
    name: "UUON Orbital Resonance",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2 * b;
      const phi = v * Math.PI;
      const resonance = Math.sin(b * theta) * Math.sin(2 * theta);
      const r = a * (1 + 0.3 * resonance);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-rotation-period': {
    name: "UUON Rotation Period",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const period = Math.sin(b * theta);
      const r = a * (1 + 0.2 * period);
      return [r * Math.cos(theta), r * Math.sin(theta), c * v * period];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-periodic-cosmic': {
    name: "UUON Periodic Cosmic",
    equation: (u, v, params) => {
      const { a = 2, b = 5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const cosmic = Math.sin(b * theta) * Math.cos(b * phi);
      const r = a * (1 + 0.25 * cosmic);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, c: 1 })
  },

  'uuon-energy-state-loop': {
    name: "UUON Energy State Loop",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const n = Math.floor(v * b) + 1;
      const energy = Math.pow(n, 2);
      const r = a * Math.sqrt(energy) / b;
      return [r * Math.cos(theta * n), r * Math.sin(theta * n), c * n / b];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-quantum-number-wrap': {
    name: "UUON Quantum Number Wrap",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const n = Math.floor(u * b) % b;
      const l = Math.floor(v * b) % (n + 1);
      const theta = u * Math.PI * 2;
      const r = a * (n + 1) / b;
      return [r * Math.cos(theta * l), r * Math.sin(theta * l), c * (n - l) / b];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-modular-symmetry-phys': {
    name: "UUON Modular Symmetry Physics",
    equation: (u, v, params) => {
      const { a = 2, b = 6, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const symmetry = Math.cos(b * theta);
      const r = a * (1 + 0.2 * symmetry);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 6, c: 1 })
  },

  'uuon-harmonic-energy-phase': {
    name: "UUON Harmonic Energy Phase",
    equation: (u, v, params) => {
      const { a = 3, b = 3, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const harmonic = Math.sin(b * x) * Math.cos(b * y) + Math.sin(2 * b * x) * Math.cos(2 * b * y) / 2;
      return [x, y, c * harmonic];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3, c: 1 })
  },

  'uuon-cosmic-cycle-segment': {
    name: "UUON Cosmic Cycle Segment",
    equation: (u, v, params) => {
      const { a = 2, b = 12, c = 1 } = params;
      const segment = Math.floor(u * b);
      const theta = (segment / b + v / b) * Math.PI * 2;
      const r = a * (1 + 0.1 * segment / b);
      return [r * Math.cos(theta), r * Math.sin(theta), c * segment / b];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 12, c: 1 })
  },

  'uuon-universal-symmetry': {
    name: "UUON Universal Symmetry",
    equation: (u, v, params) => {
      const { a = 2, b = 8, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const sym = Math.cos(b * theta) * Math.cos(b * phi);
      const r = a * (1 + 0.15 * sym);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 8, c: 1 })
  },

  'uuon-phi-phase-division': {
    name: "UUON Phi Phase Division",
    equation: (u, v, params) => {
      const { a = 2, b = 1.618, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const golden = Math.pow(b, Math.floor(u * 5)) / 10;
      const r = a * (1 + 0.2 * Math.sin(golden * theta));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1.618, c: 1 })
  },

  'uuon-galactic-rotation': {
    name: "UUON Galactic Rotation",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 0.5 } = params;
      const theta = u * Math.PI * 4;
      const r = a * (0.3 + v * 0.7);
      const spiral = theta * c;
      return [r * Math.cos(theta + spiral), r * Math.sin(theta + spiral), b * Math.sin(theta * 2) * v];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 0.5 })
  },

  'uuon-stellar-evolution': {
    name: "UUON Stellar Evolution",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const age = u;
      const r = a * (1 + 0.5 * age) * b;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-planck-quantization': {
    name: "UUON Planck Quantization",
    equation: (u, v, params) => {
      const { a = 3, b = 10, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const quantized = Math.round(Math.sqrt(x * x + y * y) * b) / b;
      return [x, y, c * quantized];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 10, c: 1 })
  },

  'uuon-dark-matter-halo': {
    name: "UUON Dark Matter Halo",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = a * (1 + b / (1 + Math.pow(phi, 2)));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-gravitational-lens': {
    name: "UUON Gravitational Lens",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const r = Math.sqrt(x * x + y * y);
      const lens = b / (r + 0.1);
      return [x * (1 + lens * 0.1), y * (1 + lens * 0.1), c * lens];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-cosmic-string': {
    name: "UUON Cosmic String",
    equation: (u, v, params) => {
      const { a = 0.2, b = 3, c = 5 } = params;
      const t = u * c;
      const theta = v * Math.PI * 2;
      const wiggle = a * Math.sin(b * t);
      return [wiggle * Math.cos(theta), wiggle * Math.sin(theta), t - c / 2];
    },
    defaultParams: getCleanDefaults({ a: 0.2, b: 3, c: 5 })
  },

  'uuon-event-horizon': {
    name: "UUON Event Horizon",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = a * b;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-spacetime-curvature': {
    name: "UUON Spacetime Curvature",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const r = Math.sqrt(x * x + y * y);
      const curve = -c * b / (r + 0.5);
      return [x, y, curve];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-wormhole-throat': {
    name: "UUON Wormhole Throat",
    equation: (u, v, params) => {
      const { a = 1, b = 2, c = 2 } = params;
      const theta = u * Math.PI * 2;
      const z = (v - 0.5) * c * 2;
      const r = a * Math.sqrt(1 + z * z / (b * b));
      return [r * Math.cos(theta), r * Math.sin(theta), z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 2, c: 2 })
  },

  'uuon-neutron-star-crust': {
    name: "UUON Neutron Star Crust",
    equation: (u, v, params) => {
      const { a = 2, b = 20, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const crust = 0.05 * Math.sin(b * theta) * Math.sin(b * phi);
      const r = a * (1 + crust);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 20, c: 1 })
  },

  'uuon-pulsar-beam': {
    name: "UUON Pulsar Beam",
    equation: (u, v, params) => {
      const { a = 0.3, b = 3, c = 3 } = params;
      const theta = u * Math.PI * 2;
      const t = v * c;
      const r = a * t;
      const wobble = 0.1 * Math.sin(b * theta);
      return [r * Math.cos(theta) + wobble, r * Math.sin(theta), t - c / 2];
    },
    defaultParams: getCleanDefaults({ a: 0.3, b: 3, c: 3 })
  },

  'uuon-magnetar-field': {
    name: "UUON Magnetar Field",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const field = Math.pow(Math.cos(phi), 2);
      const r = a * (1 + b * 0.1 * field);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-accretion-disk': {
    name: "UUON Accretion Disk",
    equation: (u, v, params) => {
      const { a = 3, b = 0.5, c = 0.2 } = params;
      const theta = u * Math.PI * 2;
      const r = b + v * (a - b);
      const z = c * Math.sin(theta * 3) * (1 - v);
      return [r * Math.cos(theta), r * Math.sin(theta), z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 0.5, c: 0.2 })
  },

  'uuon-quasar-jet': {
    name: "UUON Quasar Jet",
    equation: (u, v, params) => {
      const { a = 0.5, b = 5, c = 1 } = params;
      const t = u * b;
      const theta = v * Math.PI * 2;
      const r = a * (1 + t * 0.1);
      const twist = 0.5 * t;
      return [r * Math.cos(theta + twist), r * Math.sin(theta + twist), c * t - b * c / 2];
    },
    defaultParams: getCleanDefaults({ a: 0.5, b: 5, c: 1 })
  },

  'uuon-cosmic-void': {
    name: "UUON Cosmic Void",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = a * (1 - b * 0.5 * Math.exp(-phi * phi));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-inflation-field': {
    name: "UUON Inflation Field",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const inflation = Math.exp(b * (1 - phi));
      const r = a * inflation * 0.5;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-brane-collision': {
    name: "UUON Brane Collision",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const wave1 = Math.sin(x * 3);
      const wave2 = Math.sin(y * 3 + b);
      return [x, y, c * (wave1 + wave2) * 0.5];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-holographic-boundary': {
    name: "UUON Holographic Boundary",
    equation: (u, v, params) => {
      const { a = 2, b = 5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const holo = Math.sin(b * theta) * Math.sin(b * phi);
      const r = a;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * holo];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, c: 1 })
  },

  'uuon-entropy-gradient': {
    name: "UUON Entropy Gradient",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const entropy = b * (u + v) / 2;
      return [x, y, c * entropy];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-vacuum-fluctuation': {
    name: "UUON Vacuum Fluctuation",
    equation: (u, v, params) => {
      const { a = 3, b = 10, c = 0.5 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const fluct = Math.sin(b * x) * Math.sin(b * y) * Math.sin(b * (x + y));
      return [x, y, c * fluct];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 10, c: 0.5 })
  },

  'uuon-casimir-effect': {
    name: "UUON Casimir Effect",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const gap = 0.5;
      const force = -c * b / Math.pow(gap + Math.abs(y), 4);
      return [x, y, Math.max(-2, force)];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-hawking-radiation': {
    name: "UUON Hawking Radiation",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const emission = Math.exp(-phi * 2) * Math.sin(10 * theta);
      const r = a * (1 + 0.1 * emission);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-unruh-effect': {
    name: "UUON Unruh Effect",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const accel = b * x;
      const temp = c * Math.abs(accel);
      return [x, y, temp];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-fibonacci-modular': {
    name: "UUON Fibonacci Modular",
    equation: (u, v, params) => {
      const { a = 2, b = 13, c = 1 } = params;
      const fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
      const idx = Math.floor(u * 10) % 10;
      const theta = u * Math.PI * 2;
      const r = a * (fib[idx] % b) / b;
      return [r * Math.cos(theta), r * Math.sin(theta), c * v * fib[idx] / 55];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 13, c: 1 })
  },

  'uuon-golden-ratio-harmonics': {
    name: "UUON Golden Ratio Harmonics",
    equation: (u, v, params) => {
      const { a = 2, b = 1.618, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const harmonic = Math.sin(b * theta) * Math.sin(b * b * theta);
      const r = a * (1 + 0.2 * harmonic);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1.618, c: 1 })
  },

  'uuon-portal-value-cycle': {
    name: "UUON Portal Value Cycle",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const portal = Math.sin(b * theta) * Math.exp(-Math.pow(v - 0.5, 2) * 10);
      const r = a * (1 + 0.3 * portal);
      return [r * Math.cos(theta), r * Math.sin(theta), c * portal];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-multidim-index-loop': {
    name: "UUON Multidimensional Index Loop",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const idx = Math.floor(u * b) + Math.floor(v * b) * b;
      const theta = (idx / (b * b)) * Math.PI * 2;
      const r = a * (0.5 + 0.5 * Math.sin(idx));
      return [r * Math.cos(theta), r * Math.sin(theta), c * idx / (b * b)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-waveform-phase-index': {
    name: "UUON Waveform Phase Index",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const phase = Math.floor(u * b) * Math.PI / b;
      const wave = Math.sin(x * 3 + phase) * Math.cos(y * 3);
      return [x, y, c * wave];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  'uuon-3d-fractal-wrap': {
    name: "UUON 3D Fractal Wrap",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      let r = a;
      for (let i = 1; i <= 3; i++) {
        r += (0.3 / i) * Math.sin(b * i * theta) * Math.cos(b * i * phi);
      }
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-quantum-space-cycle': {
    name: "UUON Quantum Space Cycle",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const n = Math.floor(u * b) + 1;
      const theta = v * Math.PI * 2;
      const r = a * Math.sqrt(n) / Math.sqrt(b);
      const z = c * n / b;
      return [r * Math.cos(theta * n), r * Math.sin(theta * n), z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-toroidal-spherical-seg': {
    name: "UUON Toroidal Spherical Segment",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const blend = 0.5 + 0.5 * Math.sin(theta * 3);
      const rTorus = (a + b * Math.cos(phi)) * blend;
      const rSphere = a * (1 - blend);
      const r = rTorus + rSphere;
      return [r * Math.cos(theta), r * Math.sin(theta), c * b * Math.sin(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  'uuon-algorithmic-waveform': {
    name: "UUON Algorithmic Waveform",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      let wave = 0;
      for (let i = 1; i <= b; i++) {
        wave += Math.sin(i * x) * Math.cos(i * y) / i;
      }
      return [x, y, c * wave];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  },

  'uuon-hex-tetra-wrap': {
    name: "UUON Hex-Tetra Wrap",
    equation: (u, v, params) => {
      const { a = 2, b = 6, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const hex = Math.cos(b * theta);
      const tetra = Math.sin(4 * phi);
      const r = a * (1 + 0.15 * hex + 0.1 * tetra);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 6, c: 1 })
  },

  'uuon-prime-spiral': {
    name: "UUON Prime Spiral",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      const idx = Math.floor(u * 10) % 10;
      const theta = primes[idx] * b;
      const r = a * (idx + 1) / 10;
      return [r * Math.cos(theta), r * Math.sin(theta), c * v * primes[idx] / 29];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-chaos-attractor': {
    name: "UUON Chaos Attractor",
    equation: (u, v, params) => {
      const { a = 2, b = 10, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const chaos = Math.sin(b * x * y) * Math.cos(b * (x + y));
      return [x, y, c * chaos];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 10, c: 1 })
  },

  'uuon-symmetry-breaking': {
    name: "UUON Symmetry Breaking",
    equation: (u, v, params) => {
      const { a = 2, b = 0.1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const symmetry = Math.cos(4 * theta);
      const breaking = b * Math.sin(theta);
      const r = a * (1 + 0.2 * symmetry + breaking);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.1, c: 1 })
  },

  'uuon-quantum-tunneling': {
    name: "UUON Quantum Tunneling",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const barrier = Math.abs(x) < 0.5 ? b : 0;
      const tunnel = Math.exp(-Math.abs(x) * 2) * Math.sin(y * 5);
      return [x, y, c * (barrier * 0.5 + tunnel)];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  'uuon-spin-orbit': {
    name: "UUON Spin-Orbit Coupling",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const spin = Math.cos(b * theta);
      const orbit = Math.sin(2 * phi);
      const r = a * (1 + 0.2 * spin * orbit);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-topological-defect': {
    name: "UUON Topological Defect",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const defect = Math.atan2(Math.sin(theta), Math.cos(theta)) / Math.PI;
      const r = a * (1 + b * 0.2 * Math.abs(defect));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-phase-transition': {
    name: "UUON Phase Transition",
    equation: (u, v, params) => {
      const { a = 3, b = 0.5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const temp = y + b;
      const phase = temp > 0 ? Math.sin(x * 5) : x * x / 2;
      return [x, y, c * phase];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 0.5, c: 1 })
  },

  'uuon-crystalline-lattice': {
    name: "UUON Crystalline Lattice",
    equation: (u, v, params) => {
      const { a = 3, b = 8, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const lattice = Math.cos(b * x) + Math.cos(b * y) + Math.cos(b * (x + y));
      return [x, y, c * lattice / 3];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 8, c: 1 })
  },

  'uuon-superfluid-vortex': {
    name: "UUON Superfluid Vortex",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const r = a * v;
      const vortex = Math.sin(b * theta + r * 2);
      return [r * Math.cos(theta), r * Math.sin(theta), c * vortex * (1 - v)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 1 })
  },

  'uuon-monopole-field': {
    name: "UUON Monopole Field",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = a * (1 + b / (1 + phi * phi));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-dyon-field': {
    name: "UUON Dyon Field",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const electric = Math.sin(phi);
      const magnetic = Math.cos(2 * theta);
      const r = a * (1 + 0.2 * b * (electric + magnetic));
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-instanton': {
    name: "UUON Instanton",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const instanton = Math.exp(-phi * phi / (b * b));
      const r = a * (1 + 0.3 * instanton);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  'uuon-soliton-wave': {
    name: "UUON Soliton Wave",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const soliton = 1 / Math.cosh(b * x);
      return [x, y, c * soliton * Math.cos(y * 2)];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  'uuon-dynamic-visual-phase': {
    name: "UUON Dynamic Visual Phase",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const phase = Math.sin(b * theta + b * phi);
      const r = a * (1 + 0.3 * phase);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  'uuon-six-state-energy-ring': {
    name: "UUON Six-State Energy Ring",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const state = Math.floor(theta / (Math.PI / 3)) % 6;
      const energy = (state + 1) / 6;
      const r = (a + b * Math.cos(v * Math.PI * 2)) * energy;
      return [r * Math.cos(theta), r * Math.sin(theta), c * b * Math.sin(v * Math.PI * 2)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  bloch_sphere_dynamic: {
    name: "Bloch Sphere Dynamic",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const state = Math.sin(b * theta) * Math.cos(b * phi);
      const r = a * (1 + 0.1 * state);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  bell_state_correlation: {
    name: "Bell State Correlation",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const corr = Math.cos(x * 2) * Math.cos(y * 2) * b;
      return [x, y, c * corr];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  quantum_gate_rotation: {
    name: "Quantum Gate Rotation",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const gate = Math.cos(b * theta) * Math.sin(phi);
      const r = a * (1 + 0.2 * gate);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  decoherence_evolution: {
    name: "Decoherence Evolution",
    equation: (u, v, params) => {
      const { a = 2, b = 2, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const decay = Math.exp(-b * v);
      const r = a * (1 + 0.3 * Math.sin(theta * 4) * decay);
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 2, c: 1 })
  },

  fibonacci_anyon_braiding: {
    name: "Fibonacci Anyon Braiding",
    equation: (u, v, params) => {
      const { a = 2, b = 1.618, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const braid = Math.sin(b * theta * 3) * Math.cos(b * v * Math.PI * 2);
      const r = a * v;
      return [r * Math.cos(theta + braid), r * Math.sin(theta + braid), c * u * 3];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1.618, c: 1 })
  },

  quantum_neural_network: {
    name: "Quantum Neural Network",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const layer1 = Math.tanh(x * b);
      const layer2 = Math.tanh(y * b + layer1);
      return [x, y, c * layer2];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  },

  kerr_metric: {
    name: "Kerr Metric (Rotating Black Hole)",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const spin = b;
      const r = a * Math.sqrt(1 + spin * spin * Math.cos(phi) * Math.cos(phi));
      const ergosphere = r * (1 + 0.2 * spin * Math.sin(phi) * Math.sin(phi));
      return [ergosphere * Math.sin(phi) * Math.cos(theta), ergosphere * Math.sin(phi) * Math.sin(theta), c * ergosphere * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, c: 1 })
  },

  spacetime_curvature: {
    name: "Spacetime Curvature",
    equation: (u, v, params) => {
      const { a = 3, b = 2, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const r = Math.sqrt(x * x + y * y);
      const curve = -c * b / (r + 0.3);
      return [x, y, curve];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 2, c: 1 })
  },

  gravitational_wave_strain: {
    name: "Gravitational Wave Strain",
    equation: (u, v, params) => {
      const { a = 3, b = 3, c = 0.3 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const wave = Math.sin(b * (x + y)) * Math.cos(b * (x - y));
      return [x, y, c * wave];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3, c: 0.3 })
  },

  event_horizon_surface: {
    name: "Event Horizon Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = a * b;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  penrose_diagram: {
    name: "Penrose Diagram",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const conformal = Math.atan(x * b) * Math.atan(y * b);
      return [Math.atan(x * b) * 2, Math.atan(y * b) * 2, c * conformal * 0.5];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  quantum_foam_texture: {
    name: "Quantum Foam Texture",
    equation: (u, v, params) => {
      const { a = 3, b = 20, c = 0.3 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const foam = Math.sin(b * x) * Math.sin(b * y) * Math.sin(b * (x + y));
      return [x, y, c * foam];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 20, c: 0.3 })
  },

  dodecahedron: {
    name: "Dodecahedron Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const phi_gold = (1 + Math.sqrt(5)) / 2;
      const dodeca = 1 + 0.15 * (Math.cos(5 * theta) + Math.cos(3 * phi * phi_gold));
      const r = a * dodeca * b;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  octahedron: {
    name: "Octahedron Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const octa = Math.abs(Math.cos(theta)) + Math.abs(Math.sin(theta));
      const r = a * b / (octa * Math.abs(Math.sin(phi)) + Math.abs(Math.cos(phi)) + 0.001);
      const scale = Math.min(r, a * 2);
      return [scale * Math.sin(phi) * Math.cos(theta), scale * Math.sin(phi) * Math.sin(theta), c * scale * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  hyperboloid: {
    name: "Hyperboloid",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 2 } = params;
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * c * 2;
      const r = a * Math.sqrt(1 + t * t / (b * b));
      return [r * Math.cos(theta), r * Math.sin(theta), t];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 2 })
  },

  hemisphere: {
    name: "Hemisphere",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI / 2;
      const r = a * b;
      return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), c * r * Math.cos(phi)];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  }
};

// ========================================
// ADDITIONAL SCIENTIFIC SHAPES
// ========================================

export const SCIENTIFIC_SHAPES: Record<string, ParametricSurface> = {

  riemann_zeta_surface: {
    name: "Riemann Zeta Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const s = (u - 0.5) * a + 0.5;
      const t = (v - 0.5) * a * 4;
      
      let real = 0, imag = 0;
      for (let n = 1; n <= 10; n++) {
        const factor = Math.pow(n, -s);
        real += factor * Math.cos(-t * Math.log(n));
        imag += factor * Math.sin(-t * Math.log(n));
      }
      
      const z = c * Math.sqrt(real * real + imag * imag) * b;
      return [s * 2 - a - 1, t * 0.5, z || 0];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  gamma_function_surface: {
    name: "Gamma Function Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 1, c = 1 } = params;
      const x = (u - 0.2) * a;
      const y = (v - 0.5) * a * 2;
      
      const gammaApprox = Math.sqrt(2 * Math.PI / Math.max(0.1, x)) * 
                          Math.pow(x / Math.E, Math.max(0.1, x));
      const z = c * Math.log(Math.abs(gammaApprox) + 1) * b;
      
      return [x, y, Math.min(5, Math.max(-5, z || 0))];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, c: 1 })
  },

  bessel_function_surface: {
    name: "Bessel Function Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const r = Math.sqrt(x * x + y * y) * b;
      
      const j0 = r < 0.01 ? 1 : Math.sin(r) / r;
      const z = c * j0;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  legendre_polynomial: {
    name: "Legendre Polynomial Surface",
    equation: (u, v, params) => {
      const { a = 2, b = 4, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      const n = Math.floor(b);
      
      let P = 1;
      const x_leg = Math.cos(theta);
      for (let k = 1; k <= n; k++) {
        P = ((2 * k - 1) * x_leg * P - (k - 1) * P) / k;
      }
      
      const r = a * (1 + 0.3 * Math.abs(P));
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = c * r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 1 })
  },

  hermite_function: {
    name: "Hermite Function Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 3, c = 1 } = params;
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const n = Math.floor(b);
      
      const hermite = Math.exp(-(x * x + y * y) / 2) * Math.cos(n * x) * Math.cos(n * y);
      const z = c * hermite;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 3, c: 1 })
  },

  spherical_harmonics_y32: {
    name: "Spherical Harmonics Y(3,2)",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 1 } = params;
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);
      const Y32 = Math.sqrt(105 / (32 * Math.PI)) * sinTheta * sinTheta * cosTheta * Math.cos(2 * phi);
      
      const r = a * (1 + b * Y32);
      const x = r * sinTheta * Math.cos(phi);
      const y = r * sinTheta * Math.sin(phi);
      const z = c * r * cosTheta;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 1 })
  },

  chebyshev_surface: {
    name: "Chebyshev Polynomial Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 5, c = 1 } = params;
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      const n = Math.floor(b);
      
      const T = Math.cos(n * Math.acos(Math.max(-1, Math.min(1, x))));
      const U = Math.cos(n * Math.acos(Math.max(-1, Math.min(1, y))));
      const z = c * T * U;
      
      return [x * a, y * a, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 5, c: 1 })
  },

  laguerre_surface: {
    name: "Laguerre Polynomial Surface",
    equation: (u, v, params) => {
      const { a = 3, b = 4, c = 1 } = params;
      const x = u * a;
      const y = v * a;
      const n = Math.floor(b);
      
      const L = Math.exp(-x / 2) * Math.pow(x, n) / Math.pow(2, n);
      const z = c * L * Math.cos(y * 2);
      
      return [x - a / 2, y - a / 2, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 4, c: 1 })
  }
};

// ========================================
// CONSOLIDATED EXPORT
// ========================================

export const COMPLETE_MISSING_SHAPES: Record<string, ParametricSurface> = {
  ...BABYLONIAN_ZODIAC_SHAPES,
  ...BIOLOGICAL_SHAPES,
  ...TOPOLOGY_SHAPES,
  ...COMPUTATIONAL_SHAPES,
  ...QUANTUM_SHAPES,
  ...CRYPTOGRAPHIC_SHAPES,
  ...ADDITIONAL_MATH_SHAPES,
  ...FRACTAL_SHAPES,
  ...EXTENDED_TOPOLOGY,
  ...UUON_SYSTEMS,
  ...SCIENTIFIC_SHAPES,
  ...JACOBIAN_TRANSFORMATION_SHAPES
};

console.log(`🔧 Complete Missing Shapes Library loaded: ${Object.keys(COMPLETE_MISSING_SHAPES).length} implementations`);
console.log(`   𒀭 Babylonian Zodiac: ${Object.keys(BABYLONIAN_ZODIAC_SHAPES).length}`);
console.log(`   📊 Biological: ${Object.keys(BIOLOGICAL_SHAPES).length}`);
console.log(`   📐 Topology: ${Object.keys(TOPOLOGY_SHAPES).length}`);
console.log(`   💻 Computational: ${Object.keys(COMPUTATIONAL_SHAPES).length}`);
console.log(`   ⚛️ Quantum: ${Object.keys(QUANTUM_SHAPES).length}`);
console.log(`   🔐 Cryptographic: ${Object.keys(CRYPTOGRAPHIC_SHAPES).length}`);
console.log(`   ➕ Additional Math: ${Object.keys(ADDITIONAL_MATH_SHAPES).length}`);
console.log(`   🌀 Fractals: ${Object.keys(FRACTAL_SHAPES).length}`);
console.log(`   🔗 Extended Topology: ${Object.keys(EXTENDED_TOPOLOGY).length}`);
console.log(`   🤖 UUON Systems: ${Object.keys(UUON_SYSTEMS).length}`);
console.log(`   🔬 Scientific: ${Object.keys(SCIENTIFIC_SHAPES).length}`);
