/**
 * QUANTUM ENTANGLEMENT ALGORITHMS
 * Mathematical visualization of quantum entanglement states and correlations
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';
import { ParametricSurface, getCleanDefaults } from '../types/shapes';

export const ENTANGLEMENT_ALGORITHMS: Record<string, ParametricSurface> = {
  
  bell_state_visualization: {
    name: "🔗 Bell State Entanglement - Maximally Entangled Qubits",
    equation: (u, v, params) => {
      const a = params.a ?? 1;    // Radius
      const b = params.b ?? 0.5;  // Coupling strength
      const c = params.c ?? 0;    // Phase offset
      const d = params.d ?? 1;    // Modulation
      
      const theta1 = u * 2 * Math.PI;
      const theta2 = v * 2 * Math.PI;
      
      // Quantum correlation between entangled particles
      const correlation = Math.cos(theta1 - theta2 + c);
      const r = a + b * correlation;
      
      const x = r * Math.cos(theta1) * d;
      const y = r * Math.sin(theta2) * d;
      const z = correlation;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 0.5, c: 0, d: 1,
      uSegments: 64, vSegments: 64 
    })
  },

  epr_pair_trajectory: {
    name: "🌀 EPR Pair Trajectory - Entangled Particle Paths",
    equation: (u, v, params) => {
      const a = params.a ?? 2;  // Separation distance
      const b = params.b ?? 1;  // Spin amplitude
      const c = params.c ?? 0;  // Time evolution
      const d = params.d ?? 1;  // Twist
      
      const phase = u * 2 * Math.PI;
      const spinPhase = v * Math.PI;
      
      // First particle trajectory
      const particle1X = a * Math.cos(phase + c);
      const particle1Y = a * Math.sin(phase + c);
      const particle1Z = b * Math.sin(spinPhase);
      
      // Entangled particle (opposite but correlated)
      const sign = v < 0.5 ? 1 : -1;
      const twist = d * v;
      
      const x = particle1X * sign + twist * Math.cos(phase);
      const y = particle1Y * sign + twist * Math.sin(phase);
      const z = particle1Z * sign;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 1, c: 0, d: 1,
      uSegments: 80, vSegments: 40 
    })
  },

  quantum_correlation_field: {
    name: "⚛️ Quantum Correlation Field - Non-Local Correlations",
    equation: (u, v, params) => {
      const a = params.a ?? 1;    // Entanglement strength
      const b = params.b ?? 2;    // Field size
      const c = params.c ?? 0.5;  // Decay rate
      const d = params.d ?? 1;    // Oscillation
      
      const x = (u - 0.5) * b * 2;
      const y = (v - 0.5) * b * 2;
      const distance = Math.sqrt(x*x + y*y);
      
      // Quantum correlation decreases with distance but never vanishes
      const correlation = a * Math.exp(-distance * c);
      const oscillation = Math.cos(x * y * d);
      const z = correlation * oscillation;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 2, c: 0.5, d: 1,
      uSegments: 100, vSegments: 100 
    })
  },

  ghz_state_geometry: {
    name: "🎭 GHZ State - 3-Particle Entanglement",
    equation: (u, v, params) => {
      const a = params.a ?? 1;    // Radius
      const b = params.b ?? 0.8;  // Coupling
      const c = params.c ?? 1;    // Symmetry order
      const d = params.d ?? 2;    // Height modulation
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Three-way correlation
      const correlation = Math.cos(c * theta) * Math.cos(c * phi);
      const r = a + b * correlation;
      
      const x = r * Math.cos(theta) * Math.sin(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = d * Math.cos(phi) + correlation;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1, b: 0.8, c: 1, d: 2,
      uSegments: 64, vSegments: 64 
    })
  },

  w_state_geometry: {
    name: "🔺 W State - Symmetric 3-Qubit Entanglement",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;  // Base radius
      const b = params.b ?? 0.6;  // Modulation amplitude
      const c = params.c ?? 3;    // Symmetry (3-fold)
      const d = params.d ?? 1;    // Vertical scale
      
      const theta = u * 2 * Math.PI;
      const height = (v - 0.5) * 2;
      
      // Symmetric three-way entanglement
      const symmetry = Math.cos(c * theta) + Math.cos(c * (theta + 2*Math.PI/3)) + Math.cos(c * (theta + 4*Math.PI/3));
      const r = a + b * symmetry / 3;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = d * height + symmetry * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.5, b: 0.6, c: 3, d: 1,
      uSegments: 90, vSegments: 40 
    })
  },

  quantum_discord_surface: {
    name: "💫 Quantum Discord - Quantum vs Classical Correlation",
    equation: (u, v, params) => {
      const a = params.a ?? 2;    // Scale
      const b = params.b ?? 1;    // Quantum advantage
      const c = params.c ?? 0.5;  // Classical mixing
      const d = params.d ?? 3;    // Frequency
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Quantum discord: quantum correlation beyond classical
      const classical = c * (Math.cos(d * x) + Math.cos(d * y));
      const quantum = b * Math.sqrt(Math.abs(Math.sin(d * x * y)));
      const discord = quantum - classical;
      
      const z = discord;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 1, c: 0.5, d: 3,
      uSegments: 80, vSegments: 80 
    })
  },

  quantum_teleportation_path: {
    name: "📡 Quantum Teleportation - Entanglement-Assisted Transfer",
    equation: (u, v, params) => {
      const a = params.a ?? 3;    // Distance
      const b = params.b ?? 1;    // Fidelity
      const c = params.c ?? 2;    // Entanglement resource
      const d = params.d ?? 0.5;  // Classical channel
      
      const progress = u;
      const channel = v;
      
      // Alice to Bob via entangled channel
      const alice = 0;
      const bob = a;
      const position = alice + progress * (bob - alice);
      
      // Entanglement-assisted path (curved through higher dimension)
      const entanglementPath = c * Math.sin(progress * Math.PI);
      const classicalPath = d * (channel - 0.5) * 2;
      
      const x = position;
      const y = entanglementPath + classicalPath;
      const z = b * Math.sin(progress * Math.PI); // Fidelity over transfer
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 1, c: 2, d: 0.5,
      uSegments: 60, vSegments: 30 
    })
  },

  entanglement_entropy_landscape: {
    name: "🌋 Entanglement Entropy - Von Neumann Entropy Landscape",
    equation: (u, v, params) => {
      const a = params.a ?? 2;    // Scale
      const b = params.b ?? 1.5;  // Max entropy
      const c = params.c ?? 0.8;  // Purity parameter
      const d = params.d ?? 4;    // Oscillation
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      const r = Math.sqrt(x*x + y*y);
      
      // Von Neumann entropy landscape
      const purity = c * Math.exp(-r * 0.5);
      const entropy = -purity * Math.log(purity + 0.001) - (1-purity) * Math.log(1-purity + 0.001);
      const oscillation = Math.sin(d * (x + y));
      
      const z = b * entropy + oscillation * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: 1.5, c: 0.8, d: 4,
      uSegments: 80, vSegments: 80 
    })
  }

};
