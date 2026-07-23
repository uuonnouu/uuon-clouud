import { SurfaceParameters } from '../types/math';
import { ParametricSurface } from '../types/shapes';

/**
 * ADVANCED PHYSICS SIMULATIONS
 * Cutting-edge physics visualization algorithms
 * Author: UUON Foundation Inc.
 */

export const ADVANCED_PHYSICS_SIMS: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // FLUID DYNAMICS
  // ============================================================================
  
  navier_stokes_turbulence: {
    name: "🌊 Navier-Stokes Turbulence",
    equation: (u, v, params) => {
      const { a = 2, b = 3, c = 0.5 } = params;
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const t = a;
      
      // Turbulent flow patterns
      const vortex1 = Math.exp(-((x-1)*(x-1) + (y-0.5)*(y-0.5)) / 0.5);
      const vortex2 = Math.exp(-((x+1)*(x+1) + (y+0.5)*(y+0.5)) / 0.5);
      const flow = vortex1 - vortex2 + c * Math.sin(b * x) * Math.cos(b * y);
      
      return [x, y, flow * 2];
    },
    defaultParams: { a: 2, b: 3, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  reynolds_vortex_street: {
    name: "🌀 Reynolds Vortex Street",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 4 } = params;
      const x = u * 10 - 5;
      const y = v * 4 - 2;
      
      // Karman vortex street
      const freq = c;
      const decay = Math.exp(-Math.abs(y) * b);
      const vortices = Math.sin(freq * x) * Math.cos(freq * y * 2) * decay;
      const flow = a * vortices * (1 + 0.3 * Math.sin(x * 0.5));
      
      return [x, y, flow];
    },
    defaultParams: { a: 2, b: 0.5, c: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  // ============================================================================
  // ELECTROMAGNETIC FIELDS
  // ============================================================================
  
  maxwell_field_lines: {
    name: "⚡ Maxwell Electromagnetic Field",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const theta = u * 2 * Math.PI;
      const r = v * 3;
      
      // Dipole field pattern
      const Br = a * Math.cos(theta) / Math.pow(r + 0.5, 2);
      const Bt = b * Math.sin(theta) / Math.pow(r + 0.5, 3);
      const fieldStrength = Math.sqrt(Br*Br + Bt*Bt);
      
      return [r * Math.cos(theta), r * Math.sin(theta), fieldStrength * c];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  lorentz_force_field: {
    name: "🧲 Lorentz Force Visualization",
    equation: (u, v, params) => {
      const { a = 1, b = 2, c = 0.5 } = params;
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      // Crossed E and B fields
      const E = [a, 0, 0];
      const B = [0, 0, b];
      const v_charge = [Math.cos(x), Math.sin(y), 0];
      
      // F = q(E + v × B)
      const force_z = c * (E[0] + v_charge[0] * B[2] - v_charge[2] * B[0]);
      
      return [x, y, force_z * 2];
    },
    defaultParams: { a: 1, b: 2, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ============================================================================
  // PLASMA PHYSICS
  // ============================================================================
  
  tokamak_confinement: {
    name: "☢️ Tokamak Plasma Confinement",
    equation: (u, v, params) => {
      const { a = 2, b = 0.5, c = 5 } = params;
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Toroidal magnetic confinement
      const R = a;
      const r = b * (1 + 0.2 * Math.cos(c * theta));
      
      const x = (R + r * Math.cos(theta)) * Math.cos(phi);
      const y = (R + r * Math.cos(theta)) * Math.sin(phi);
      const z = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 0.5, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 }
  },

  magnetic_reconnection: {
    name: "⚛️ Magnetic Reconnection Event",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      // X-point reconnection topology
      const psi = a * x * y * Math.exp(-(x*x + y*y) * 0.3);
      const perturbation = b * Math.sin(c * x) * Math.sin(c * y);
      
      return [x, y, psi + perturbation];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  // ============================================================================
  // QUANTUM MECHANICS
  // ============================================================================
  
  quantum_tunneling: {
    name: "🚇 Quantum Tunneling Barrier",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 3 } = params;
      const x = (u - 0.5) * 6;
      const E = v * 5;
      
      // Tunneling probability through barrier
      const barrier = a * (Math.abs(x) < 1 ? 3 : 0);
      const waveInc = Math.sin(c * x) * Math.exp(-0.1 * x * x);
      const waveTrans = Math.exp(-b * Math.abs(x - 2));
      const probability = E > barrier ? waveInc : waveTrans;
      
      return [x, E, probability + barrier * 0.3];
    },
    defaultParams: { a: 2, b: 1, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 }
  },

  pauli_exclusion_states: {
    name: "🎭 Pauli Exclusion Principle",
    equation: (u, v, params) => {
      const { a = 1, b = 2, c = 3 } = params;
      const n = Math.floor(u * 4) + 1;
      const spin = v < 0.5 ? 1 : -1;
      
      // Energy levels with spin states
      const energy = a * n * n;
      const spinSplit = b * spin * 0.1;
      const occupation = Math.exp(-c * (n - 2) * (n - 2));
      
      return [n + spin * 0.2, energy + spinSplit, occupation];
    },
    defaultParams: { a: 1, b: 2, c: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 16, vSegments: 8 }
  },

  // ============================================================================
  // RELATIVITY
  // ============================================================================
  
  kerr_black_hole: {
    name: "🌀 Kerr Rotating Black Hole",
    equation: (u, v, params) => {
      const { a = 0.5, b = 2, c = 1 } = params;
      const theta = v * Math.PI;
      const phi = u * 2 * Math.PI;
      const r = b;
      
      // Kerr metric with rotation parameter a
      const rho2 = r * r + a * a * Math.cos(theta) * Math.cos(theta);
      const scale = Math.sqrt(rho2);
      
      const x = scale * Math.sin(theta) * Math.cos(phi);
      const y = scale * Math.sin(theta) * Math.sin(phi);
      const z = scale * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: { a: 0.5, b: 2, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  gravitational_lensing: {
    name: "🔭 Gravitational Light Bending",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 0.5 } = params;
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      // Einstein ring effect
      const r = Math.sqrt(x * x + y * y) + 0.1;
      const deflection = a * b / r;
      const lensing = c * deflection * Math.exp(-r * r * 0.2);
      
      return [x, y, lensing];
    },
    defaultParams: { a: 2, b: 1, c: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  // ============================================================================
  // CONDENSED MATTER
  // ============================================================================
  
  bose_einstein_condensate: {
    name: "❄️ Bose-Einstein Condensate",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 0.1 } = params;
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      // BEC ground state wavefunction
      const trap = a * (x * x + y * y);
      const density = b * Math.exp(-trap * c);
      const phase = Math.sin(x * 3) * Math.cos(y * 3) * 0.1;
      
      return [x, y, density + phase];
    },
    defaultParams: { a: 2, b: 1, c: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  superconductor_vortex: {
    name: "⚡ Superconductor Flux Vortex",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = 5 } = params;
      const theta = u * 2 * Math.PI;
      const r = v * 3;
      
      // Abrikosov vortex lattice
      const flux = a * Math.log(r + 0.1) * Math.cos(c * theta);
      const order = b * (1 - Math.exp(-r * r));
      
      return [r * Math.cos(theta), r * Math.sin(theta), flux * order];
    },
    defaultParams: { a: 2, b: 1, c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  phonon_dispersion: {
    name: "🎵 Phonon Dispersion Relation",
    equation: (u, v, params) => {
      const { a = 2, b = 1, c = Math.PI } = params;
      const k = (u - 0.5) * 2 * c;
      const branch = Math.floor(v * 3);
      
      // Acoustic and optical phonon branches
      const omega = branch === 0 ? 
                   a * Math.abs(Math.sin(k / 2)) :
                   b + a * Math.abs(Math.cos(k / 2));
      
      return [k, branch, omega];
    },
    defaultParams: { a: 2, b: 1, c: Math.PI, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 12 }
  }
};
