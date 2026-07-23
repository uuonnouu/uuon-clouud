/**
 * Atomic Structure & Electron Association Formulas
 * ================================================
 * 
 * Mathematical visualizations of atomic and molecular structures:
 * - Bohr/Rutherford atomic models
 * - Electron orbital probability distributions (s, p, d, f)
 * - Molecular bonding surfaces (sigma, pi, hybridization)
 * - Electron density and association patterns
 * 
 * Parameters mapped to quantum mechanics:
 * - A: Scale factor (Bohr radius multiplier)
 * - B: Principal quantum number n (energy level)
 * - C: Effective nuclear charge Zeff
 * - D: Angular momentum quantum number l
 * - E: Magnetic quantum number m
 * - F: Orbital lobe intensity
 * - G: Phase/spin visualization
 * - H: Bond order
 * - I: Hybridization factor
 * 
 * © 2025 UUON Foundation Inc.
 */

import type { SurfaceParameters } from '../types/math';
import type { ParametricSurface } from './unifiedShapes';

const PI = Math.PI;
const TWO_PI = 2 * Math.PI;

// Bohr radius in angstroms (scaled for visualization)
const BOHR_RADIUS = 0.529;

// Spherical harmonic helper functions
function sphericalHarmonic(l: number, m: number, theta: number, phi: number): number {
  const absM = Math.abs(m);
  
  // Associated Legendre polynomial approximation
  let legendre = 1;
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sin(theta);
  
  if (l === 0) {
    legendre = 1;
  } else if (l === 1) {
    if (absM === 0) legendre = cosTheta;
    else legendre = -sinTheta;
  } else if (l === 2) {
    if (absM === 0) legendre = 0.5 * (3 * cosTheta * cosTheta - 1);
    else if (absM === 1) legendre = -3 * sinTheta * cosTheta;
    else legendre = 3 * sinTheta * sinTheta;
  } else if (l === 3) {
    if (absM === 0) legendre = 0.5 * cosTheta * (5 * cosTheta * cosTheta - 3);
    else if (absM === 1) legendre = -1.5 * sinTheta * (5 * cosTheta * cosTheta - 1);
    else if (absM === 2) legendre = 15 * sinTheta * sinTheta * cosTheta;
    else legendre = -15 * sinTheta * sinTheta * sinTheta;
  }
  
  // Angular part with phase
  const angular = m >= 0 ? Math.cos(m * phi) : Math.sin(absM * phi);
  
  return legendre * angular;
}

// Radial wavefunction approximation
function radialWavefunction(n: number, l: number, r: number, zeff: number): number {
  const rho = 2 * zeff * r / (n * BOHR_RADIUS);
  const normalization = Math.exp(-rho / 2);
  
  // Laguerre polynomial approximation
  let laguerre = 1;
  if (n - l - 1 >= 1) laguerre = 1 - rho / (n - l);
  if (n - l - 1 >= 2) laguerre = 1 - 2 * rho / (n - l) + rho * rho / (2 * (n - l) * (n - l - 1));
  
  return normalization * Math.pow(rho, l) * laguerre;
}

export const ATOMIC_STRUCTURE_SHAPES: Record<string, ParametricSurface> = {
  
  // ========== ATOMIC MODELS ==========
  
  bohr_atom_shell: {
    name: "Bohr Atom Shell",
    description: "Bohr's planetary model with quantized electron shells",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const n = Math.floor(params.b ?? 2); // Principal quantum number (shell)
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Shell radius proportional to n²
      const shellRadius = a * n * n * BOHR_RADIUS * c;
      
      const x = shellRadius * Math.sin(phi) * Math.cos(theta);
      const y = shellRadius * Math.sin(phi) * Math.sin(theta);
      const z = shellRadius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 2, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  rutherford_nucleus: {
    name: "Rutherford Nucleus",
    description: "Dense nuclear core with proton/neutron clustering",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 0.5;
      const z = params.b ?? 6; // Atomic number (protons)
      const n = params.c ?? 6; // Neutron number
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Nuclear radius ~ A^(1/3) where A = Z + N
      const massNumber = z + n;
      const nuclearRadius = a * Math.pow(massNumber, 1/3) * 0.1;
      
      // Add nucleon structure variation
      const nucleonBump = 0.1 * Math.sin(5 * theta) * Math.sin(3 * phi);
      const r = nuclearRadius * (1 + nucleonBump);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const zCoord = r * Math.cos(phi);
      
      return [x, y, zCoord];
    },
    defaultParams: { a: 0.5, b: 6, c: 6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  electron_probability_cloud: {
    name: "Electron Probability Cloud",
    description: "Quantum mechanical electron probability distribution",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const n = Math.max(1, Math.floor(params.b ?? 1)); // Principal quantum number
      const l = Math.min(n - 1, Math.max(0, Math.floor(params.d ?? 0))); // Angular momentum
      const m = Math.max(-l, Math.min(l, Math.floor(params.e ?? 0))); // Magnetic
      const zeff = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Base radius with quantum probability modulation
      const Ylm = sphericalHarmonic(l, m, phi, theta);
      const probability = Math.abs(Ylm);
      
      const baseRadius = a * n * n * BOHR_RADIUS;
      const r = baseRadius * (0.5 + 0.5 * probability);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const zCoord = r * Math.cos(phi);
      
      return [x, y, zCoord];
    },
    defaultParams: { a: 1.5, b: 2, c: 1, d: 1, e: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ========== ELECTRON ORBITALS ==========
  
  s_orbital: {
    name: "S Orbital (l=0)",
    description: "Spherical s orbital - ground state electron distribution",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const n = Math.max(1, Math.floor(params.b ?? 1)); // Principal quantum number
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // s orbital is spherically symmetric
      const radius = a * n * BOHR_RADIUS * c;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  p_orbital: {
    name: "P Orbital (l=1)",
    description: "Dumbbell-shaped p orbital with two lobes",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const n = Math.max(2, Math.floor(params.b ?? 2));
      const m = Math.floor(params.e ?? 0); // -1, 0, or 1 for px, py, pz
      const intensity = params.f ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // P orbital angular part |Y_1,m|²
      let angularPart: number;
      const clampedM = Math.max(-1, Math.min(1, m));
      
      if (clampedM === 0) {
        // pz: cos²(θ)
        angularPart = Math.abs(Math.cos(phi));
      } else if (clampedM === 1 || clampedM === -1) {
        // px, py: sin²(θ)
        angularPart = Math.abs(Math.sin(phi));
      } else {
        angularPart = Math.abs(Math.cos(phi));
      }
      
      const baseRadius = a * n * BOHR_RADIUS;
      const r = baseRadius * angularPart * intensity;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 2, c: 1, e: 0, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  d_orbital: {
    name: "D Orbital (l=2)",
    description: "Cloverleaf d orbital with four lobes",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const n = Math.max(3, Math.floor(params.b ?? 3));
      const m = Math.floor(params.e ?? 0); // -2 to 2
      const intensity = params.f ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      const cosTheta = Math.cos(phi);
      const sinTheta = Math.sin(phi);
      const clampedM = Math.max(-2, Math.min(2, m));
      
      let angularPart: number;
      
      if (clampedM === 0) {
        // dz²: (3cos²θ - 1)²
        angularPart = Math.abs(3 * cosTheta * cosTheta - 1) * 0.5;
      } else if (Math.abs(clampedM) === 1) {
        // dxz, dyz
        angularPart = Math.abs(sinTheta * cosTheta);
      } else {
        // dx²-y², dxy
        angularPart = sinTheta * sinTheta * Math.abs(Math.cos(2 * theta));
      }
      
      const baseRadius = a * n * BOHR_RADIUS;
      const r = baseRadius * (0.3 + angularPart * intensity);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 3, c: 1, e: 2, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  f_orbital: {
    name: "F Orbital (l=3)",
    description: "Complex f orbital with eight lobes",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const n = Math.max(4, Math.floor(params.b ?? 4));
      const m = Math.floor(params.e ?? 0); // -3 to 3
      const intensity = params.f ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      const cosTheta = Math.cos(phi);
      const sinTheta = Math.sin(phi);
      const clampedM = Math.max(-3, Math.min(3, m));
      
      let angularPart: number;
      
      if (clampedM === 0) {
        // fz³
        angularPart = Math.abs(cosTheta * (5 * cosTheta * cosTheta - 3)) * 0.3;
      } else if (Math.abs(clampedM) === 1) {
        angularPart = Math.abs(sinTheta * (5 * cosTheta * cosTheta - 1)) * 0.4;
      } else if (Math.abs(clampedM) === 2) {
        angularPart = sinTheta * sinTheta * Math.abs(cosTheta) * Math.abs(Math.cos(2 * theta));
      } else {
        angularPart = Math.pow(sinTheta, 3) * Math.abs(Math.sin(3 * theta));
      }
      
      const baseRadius = a * n * BOHR_RADIUS;
      const r = baseRadius * (0.2 + angularPart * intensity);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 4, c: 1, e: 3, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  hybrid_sp3_orbital: {
    name: "SP3 Hybrid Orbital",
    description: "Tetrahedral sp³ hybridization (carbon in methane)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.2;
      const c = params.c ?? 1;
      const hybridization = params.i ?? 1; // Hybridization strength
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Tetrahedral angle: 109.5°
      const tetraAngle = 109.5 * PI / 180;
      
      // Four lobes pointing to tetrahedral vertices
      const cosTheta = Math.cos(phi);
      const sinTheta = Math.sin(phi);
      
      // Combine s and p character
      const sComponent = 0.25;
      const pComponent = 0.75 * hybridization;
      
      // Create four-fold tetrahedral symmetry
      const lobe1 = Math.abs(cosTheta + Math.cos(tetraAngle));
      const lobe2 = Math.abs(sinTheta * Math.cos(theta - TWO_PI/3));
      const lobe3 = Math.abs(sinTheta * Math.cos(theta + TWO_PI/3));
      const lobe4 = Math.abs(sinTheta * Math.cos(theta));
      
      const angularPart = sComponent + pComponent * Math.max(lobe1, lobe2, lobe3, lobe4);
      
      const baseRadius = a * BOHR_RADIUS * c;
      const r = baseRadius * angularPart;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.2, b: 2, c: 1, i: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  hybrid_sp2_orbital: {
    name: "SP2 Hybrid Orbital",
    description: "Trigonal planar sp² hybridization (carbon in ethylene)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.2;
      const c = params.c ?? 1;
      const hybridization = params.i ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      const sinTheta = Math.sin(phi);
      const cosTheta = Math.cos(phi);
      
      // Three lobes in plane at 120° angles
      const lobe1 = Math.abs(sinTheta * Math.cos(theta));
      const lobe2 = Math.abs(sinTheta * Math.cos(theta - TWO_PI/3));
      const lobe3 = Math.abs(sinTheta * Math.cos(theta + TWO_PI/3));
      
      // p orbital perpendicular to plane
      const pzComponent = Math.abs(cosTheta) * 0.3;
      
      const sComponent = 0.33;
      const pComponent = 0.67 * hybridization;
      
      const angularPart = sComponent + pComponent * Math.max(lobe1, lobe2, lobe3) + pzComponent;
      
      const baseRadius = a * BOHR_RADIUS * c;
      const r = baseRadius * angularPart;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.2, b: 2, c: 1, i: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ========== MOLECULAR BONDS ==========
  
  sigma_bond_surface: {
    name: "Sigma Bond Surface",
    description: "Axial electron density overlap in covalent sigma bond",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const bondLength = params.h ?? 1.5; // Bond length
      const bondOrder = params.h ?? 1;
      
      const t = (u - 0.5) * 2; // -1 to 1 along bond axis
      const theta = v * TWO_PI;
      
      // Electron density concentrated along bond axis
      const axialPosition = t * bondLength * a;
      const radialDensity = Math.exp(-Math.abs(t) * 2) * bondOrder * 0.5;
      
      const x = radialDensity * Math.cos(theta);
      const y = radialDensity * Math.sin(theta);
      const z = axialPosition;
      
      return [x, y, z];
    },
    defaultParams: { a: 1, h: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  pi_bond_surface: {
    name: "Pi Bond Surface",
    description: "Lateral electron overlap in pi bonds (double/triple bonds)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const bondLength = params.h ?? 1.5;
      const bondOrder = Math.min(2, Math.max(1, params.h ?? 1));
      
      const t = (u - 0.5) * 2;
      const theta = v * TWO_PI;
      
      const axialPosition = t * bondLength * a;
      
      // Pi bond has node along axis, density above/below
      const lateralDensity = Math.abs(Math.sin(theta)) * Math.exp(-Math.abs(t) * 1.5) * bondOrder * 0.4;
      const radialOffset = 0.3 * a;
      
      const x = (radialOffset + lateralDensity) * Math.cos(theta);
      const y = (radialOffset + lateralDensity) * Math.sin(theta);
      const z = axialPosition;
      
      return [x, y, z];
    },
    defaultParams: { a: 1, h: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  covalent_bond_cloud: {
    name: "Covalent Bond Cloud",
    description: "Shared electron pair density between atoms",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const bondLength = params.h ?? 2;
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Two-center electron distribution
      const t = Math.cos(phi);
      const offset = bondLength * 0.5 * a;
      
      // Electron density peaks between nuclei
      const bondingDensity = Math.exp(-Math.abs(t) * 0.5);
      const radius = a * c * (0.3 + 0.7 * bondingDensity);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1, c: 1, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  // ========== ELECTRON ASSOCIATION ==========
  
  electron_density_field: {
    name: "Electron Density Field",
    description: "Radial electron density distribution around nucleus",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const n = Math.max(1, Math.floor(params.b ?? 2)); // Shell number
      const zeff = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Radial probability density peaks at n² × a₀/Zeff
      const peakRadius = a * n * n * BOHR_RADIUS / zeff;
      
      // Modulate by radial probability
      const modulation = 1 + 0.2 * Math.sin(n * phi) * Math.cos(n * theta);
      const r = peakRadius * modulation;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 2, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  valence_shell: {
    name: "Valence Shell",
    description: "Outermost electron shell determining chemical properties",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const valenceElectrons = Math.max(1, Math.min(8, Math.floor(params.b ?? 4)));
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Valence shell with electron localization
      const baseRadius = a * BOHR_RADIUS * c * 3;
      
      // Create bumps for each valence electron
      const electronAngle = TWO_PI / valenceElectrons;
      let electronDensity = 0;
      for (let i = 0; i < valenceElectrons; i++) {
        const targetAngle = i * electronAngle;
        const angularDist = Math.abs(theta - targetAngle);
        electronDensity += Math.exp(-angularDist * angularDist * 2);
      }
      
      const r = baseRadius * (0.8 + 0.2 * electronDensity);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 4, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  electron_spin_surface: {
    name: "Electron Spin Surface",
    description: "Visualization of electron spin angular momentum",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const spinUp = params.g ?? 1; // +1/2 or -1/2 spin
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Spin creates magnetic moment along z-axis
      const spinDirection = spinUp >= 0 ? 1 : -1;
      const baseRadius = a * BOHR_RADIUS * c;
      
      // Deform based on spin orientation
      const spinDeformation = 0.3 * spinDirection * Math.cos(phi);
      const r = baseRadius * (1 + spinDeformation);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + spinDirection * 0.2 * a;
      
      return [x, y, z];
    },
    defaultParams: { a: 1, c: 1, g: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  pauli_exclusion_shell: {
    name: "Pauli Exclusion Shell",
    description: "Electron configuration respecting Pauli exclusion principle",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const electronCount = Math.max(1, Math.min(18, Math.floor(params.b ?? 10)));
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Determine shell occupancy: 2, 8, 8, 18...
      let shell = 1;
      let remaining = electronCount;
      let shellRadius = 0;
      
      if (remaining <= 2) { shell = 1; shellRadius = 1; }
      else if (remaining <= 10) { shell = 2; shellRadius = 4; remaining -= 2; }
      else { shell = 3; shellRadius = 9; remaining -= 10; }
      
      const baseRadius = a * shellRadius * BOHR_RADIUS * c * 0.5;
      
      // Electron pair localization
      const pairFactor = 1 + 0.15 * Math.sin(remaining * theta) * Math.cos(remaining * phi);
      const r = baseRadius * pairFactor;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 10, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  aufbau_orbital_filling: {
    name: "Aufbau Orbital Filling",
    description: "Progressive electron orbital occupation by energy",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const electrons = Math.max(1, Math.min(36, Math.floor(params.b ?? 18)));
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Aufbau order: 1s, 2s, 2p, 3s, 3p, 4s, 3d, 4p...
      const orbitalEnergies = [1, 2, 2.5, 3, 3.5, 4, 3.8, 4.5];
      const orbitalCapacities = [2, 2, 6, 2, 6, 2, 10, 6];
      
      let level = 0;
      let remaining = electrons;
      for (let i = 0; i < orbitalCapacities.length && remaining > 0; i++) {
        if (remaining <= orbitalCapacities[i]) {
          level = orbitalEnergies[i];
          break;
        }
        remaining -= orbitalCapacities[i];
        level = orbitalEnergies[i];
      }
      
      const baseRadius = a * level * BOHR_RADIUS * c;
      
      // Orbital shape modulation
      const orbitalShape = 1 + 0.1 * Math.cos(level * phi) * Math.sin(level * theta);
      const r = baseRadius * orbitalShape;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 18, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  ionic_bond_field: {
    name: "Ionic Bond Field",
    description: "Electrostatic attraction between oppositely charged ions",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.5;
      const charge1 = params.b ?? 1; // Cation charge
      const charge2 = params.c ?? -1; // Anion charge
      const separation = params.h ?? 3;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Electric field equipotential surface
      const cosTheta = Math.cos(phi);
      const sinTheta = Math.sin(phi);
      
      // Dipole-like field
      const fieldStrength = Math.abs(charge1 * charge2);
      const polarization = cosTheta * separation * 0.2;
      
      const baseRadius = a * Math.sqrt(fieldStrength);
      const r = baseRadius * (1 + polarization);
      
      const x = r * sinTheta * Math.cos(theta);
      const y = r * sinTheta * Math.sin(theta);
      const z = r * cosTheta;
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 1, c: -1, h: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  metallic_bond_sea: {
    name: "Metallic Bond Sea",
    description: "Delocalized electron sea in metallic bonding",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const electronDensity = params.b ?? 1;
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      // Uniform electron sea with lattice modulation
      const latticeSpacing = 2;
      const latticeModulation = 0.1 * (
        Math.cos(latticeSpacing * theta * 3) + 
        Math.cos(latticeSpacing * phi * 3)
      );
      
      const baseRadius = a * electronDensity * c;
      const r = baseRadius * (1 + latticeModulation);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  hydrogen_bond_bridge: {
    name: "Hydrogen Bond Bridge",
    description: "Weak electrostatic hydrogen bonding between molecules",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const bondStrength = params.b ?? 0.5;
      const c = params.c ?? 1;
      
      const t = (u - 0.5) * 2;
      const theta = v * TWO_PI;
      
      // Weak, directional bond with asymmetric electron density
      const axialPosition = t * a * 2;
      
      // Hydrogen bond is asymmetric - stronger near electronegative atom
      const asymmetry = 0.3 * (1 - t);
      const radialDensity = (0.2 + asymmetry) * bondStrength * c;
      
      const x = radialDensity * Math.cos(theta);
      const y = radialDensity * Math.sin(theta);
      const z = axialPosition;
      
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 0.5, c: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  molecular_orbital_antibonding: {
    name: "Antibonding Molecular Orbital",
    description: "Destructive interference antibonding orbital with nodal plane",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1.2;
      const separation = params.h ?? 2;
      const c = params.c ?? 1;
      
      const theta = u * TWO_PI;
      const phi = v * PI;
      
      const cosTheta = Math.cos(phi);
      const sinTheta = Math.sin(phi);
      
      // Antibonding has node between atoms
      const nodeFactor = Math.abs(Math.sin(PI * cosTheta));
      const lobeIntensity = Math.abs(cosTheta);
      
      const baseRadius = a * BOHR_RADIUS * c * separation;
      const r = baseRadius * (0.3 + 0.7 * lobeIntensity * nodeFactor);
      
      const x = r * sinTheta * Math.cos(theta);
      const y = r * sinTheta * Math.sin(theta);
      const z = r * cosTheta;
      
      return [x, y, z];
    },
    defaultParams: { a: 1.2, c: 1, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  }
};

// Log loading
console.log('⚛️ Atomic Structure Shapes loaded: ' + Object.keys(ATOMIC_STRUCTURE_SHAPES).length + ' shapes');
console.log('   🔬 Atomic: Bohr shell, Rutherford nucleus, probability cloud');
console.log('   🌐 Orbitals: s, p, d, f + sp²/sp³ hybridization');
console.log('   🔗 Bonds: Sigma, pi, covalent, ionic, metallic, hydrogen');
console.log('   ⚡ Electron: Density field, valence shell, spin, Pauli exclusion');

export const ATOMIC_STRUCTURE_SHAPE_COUNT = Object.keys(ATOMIC_STRUCTURE_SHAPES).length;

export default ATOMIC_STRUCTURE_SHAPES;
