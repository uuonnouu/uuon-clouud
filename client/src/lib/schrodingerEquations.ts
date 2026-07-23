/**
 * SCHRÖDINGER EQUATION VISUALIZATIONS
 * Time-dependent and time-independent forms
 * Wave function visualizations for quantum mechanics
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

export const SCHRODINGER_EQUATIONS: Record<string, ParametricSurface> = {

  // Time-dependent Schrödinger equation wave function visualization
  schrodinger_time_dependent: {
    name: "⚛️ Schrödinger Time-Dependent: iℏ∂Ψ/∂t = ĤΨ",
    description: "Wave function Ψ(r,t) evolution over time showing probability amplitude",
    equation: (u, v, params) => {
      const a = params.a ?? 2;      // Spatial scale
      const b = params.b ?? 1;      // Wave amplitude
      const c = params.c ?? 1;      // Time parameter
      const d = params.d ?? 3;      // Quantum number n
      const e = params.e ?? 2;      // Quantum number l
      
      // Position in space (r)
      const x = (u - 0.5) * a * 4;
      const y = (v - 0.5) * a * 4;
      
      // Radial distance
      const r = Math.sqrt(x*x + y*y);
      
      // Wave function magnitude |Ψ|² (probability density)
      // Simplified hydrogen-like wave function
      const n = Math.floor(Math.abs(d)) + 1;
      const l = Math.floor(Math.abs(e)) % n;
      
      // Radial component (simplified Laguerre polynomial approximation)
      const rho = 2 * r / (n * a);
      const radialPart = Math.pow(rho, l) * Math.exp(-rho) * (1 + Math.cos(n * rho));
      
      // Angular component (spherical harmonics approximation)
      const theta = Math.atan2(y, x);
      const angularPart = Math.cos(l * theta);
      
      // Time evolution phase
      const energyLevel = -1 / (n * n); // Energy eigenvalue (atomic units)
      const timePhase = c * energyLevel;
      const timeFactor = Math.cos(timePhase);
      
      // Final wave function amplitude
      const psi = b * radialPart * angularPart * timeFactor;
      
      return [x, y, psi];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, c: 0, d: 3, e: 2, uSegments: 128, vSegments: 128 })
  },

  // Time-independent Schrödinger equation: ĤΨ = EΨ
  schrodinger_time_independent: {
    name: "⚛️ Schrödinger Time-Independent: ĤΨ = EΨ",
    description: "Stationary state wave functions (energy eigenstates)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;      // Spatial scale
      const b = params.b ?? 1;      // Amplitude
      const d = params.d ?? 1;      // Quantum number n
      const e = params.e ?? 0;      // Quantum number l
      const f = params.f ?? 0;      // Quantum number m
      
      // Spherical coordinates
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const n = Math.max(1, Math.floor(Math.abs(d)));
      const l = Math.max(0, Math.min(n-1, Math.floor(Math.abs(e))));
      const m = Math.max(-l, Math.min(l, Math.floor(f)));
      
      // Radial coordinate scaled by quantum numbers
      const r = a * (n + l);
      
      // Spherical harmonics (simplified)
      const angularFactor = Math.pow(Math.sin(theta), Math.abs(m)) * Math.cos(m * phi);
      
      // Radial function (simplified Laguerre)
      const rho = 2 * r / (n * a);
      const radialFactor = Math.pow(rho, l) * Math.exp(-rho/2);
      
      // Wave function magnitude
      const psi = b * radialFactor * angularFactor;
      
      // Convert to Cartesian with wave function as radius
      const radius = r + psi;
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 0.5, d: 2, e: 1, f: 0, uSegments: 96, vSegments: 72 })
  },

  // Hydrogen atom orbitals (solutions to Schrödinger equation)
  hydrogen_orbital_1s: {
    name: "⚛️ Hydrogen 1s Orbital (Schrödinger Solution)",
    description: "Ground state: Ψ₁ₛ = (1/√π)a₀^(-3/2)e^(-r/a₀)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;      // Bohr radius scale
      const b = params.b ?? 1;      // Probability amplitude
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Radial distance
      const r = a * Math.sin(theta);
      
      // 1s orbital wave function: Ψ = e^(-r/a₀)
      const waveFunction = Math.exp(-r / a);
      
      // Probability density |Ψ|²
      const probDensity = waveFunction * waveFunction;
      
      // Visualize as radius modulation
      const radius = r + b * probDensity * 2;
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 1, uSegments: 80, vSegments: 64 })
  },

  hydrogen_orbital_2p: {
    name: "⚛️ Hydrogen 2p Orbital (Schrödinger Solution)",
    description: "First excited state with angular momentum: Ψ₂ₚ ∝ r·e^(-r/2a₀)·cosθ",
    equation: (u, v, params) => {
      const a = params.a ?? 3;      // Bohr radius scale
      const b = params.b ?? 1;      // Amplitude
      const d = params.d ?? 0;      // m quantum number (-1, 0, 1)
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (1 + 0.5 * Math.sin(theta));
      
      // 2p radial function: R(r) = r·e^(-r/2a₀)
      const radialFunction = (r / a) * Math.exp(-r / (2 * a));
      
      // Angular part (spherical harmonics Y₁ₘ)
      const m = Math.floor(d) % 3 - 1; // -1, 0, or 1
      let angularFunction;
      
      if (m === 0) {
        // 2pz: cosθ
        angularFunction = Math.cos(theta);
      } else if (m === 1) {
        // 2px: sinθ·cosφ
        angularFunction = Math.sin(theta) * Math.cos(phi);
      } else {
        // 2py: sinθ·sinφ
        angularFunction = Math.sin(theta) * Math.sin(phi);
      }
      
      const waveFunction = radialFunction * angularFunction;
      const probDensity = waveFunction * waveFunction;
      
      const radius = r + b * probDensity * 3;
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, d: 0, uSegments: 96, vSegments: 72 })
  },

  hydrogen_orbital_3d: {
    name: "⚛️ Hydrogen 3d Orbital (Schrödinger Solution)",
    description: "Second excited state: Ψ₃ₐ ∝ r²·e^(-r/3a₀)·Y₂ₘ(θ,φ)",
    equation: (u, v, params) => {
      const a = params.a ?? 4;      // Bohr radius scale
      const b = params.b ?? 1;      // Amplitude
      const d = params.d ?? 0;      // m quantum number
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const r = a * (1 + 0.3 * Math.sin(2 * theta));
      
      // 3d radial function: R(r) = r²·e^(-r/3a₀)
      const radialFunction = Math.pow(r / a, 2) * Math.exp(-r / (3 * a));
      
      // Angular part (spherical harmonics Y₂ₘ)
      const m = Math.floor(d) % 5 - 2; // -2, -1, 0, 1, 2
      
      // Simplified d-orbital shapes
      let angularFunction;
      if (m === 0) {
        // 3dz²
        angularFunction = 3 * Math.pow(Math.cos(theta), 2) - 1;
      } else if (Math.abs(m) === 1) {
        // 3dxz or 3dyz
        angularFunction = Math.sin(theta) * Math.cos(theta) * (m > 0 ? Math.cos(phi) : Math.sin(phi));
      } else {
        // 3dx²-y² or 3dxy
        angularFunction = Math.pow(Math.sin(theta), 2) * (m > 0 ? Math.cos(2*phi) : Math.sin(2*phi));
      }
      
      const waveFunction = radialFunction * angularFunction;
      const probDensity = Math.abs(waveFunction);
      
      const radius = r + b * probDensity * 2;
      
      return [
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 1, d: 0, uSegments: 120, vSegments: 96 })
  },

  // Quantum harmonic oscillator (1D Schrödinger solution)
  quantum_harmonic_oscillator: {
    name: "⚛️ Quantum Harmonic Oscillator Wave Functions",
    description: "Solutions to Schrödinger equation for SHO: Ψₙ(x) ∝ Hₙ(x)e^(-x²/2)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;      // Spatial scale
      const b = params.b ?? 1;      // Amplitude
      const d = params.d ?? 0;      // Quantum number n
      
      const n = Math.max(0, Math.floor(Math.abs(d)));
      
      // Position
      const x = (u - 0.5) * a * 4;
      const y = (v - 0.5) * a * 2;
      
      // Hermite polynomial approximation for wave function
      let hermite;
      if (n === 0) hermite = 1;
      else if (n === 1) hermite = 2 * x;
      else if (n === 2) hermite = 4 * x * x - 2;
      else if (n === 3) hermite = 8 * Math.pow(x, 3) - 12 * x;
      else hermite = Math.cos(n * x); // Approximation for higher n
      
      // Wave function: Ψₙ(x) = Hₙ(x)·e^(-x²/2)
      const waveFunction = hermite * Math.exp(-x * x / (2 * a * a));
      
      // Probability density
      const probDensity = waveFunction * waveFunction;
      
      const z = b * probDensity;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, d: 2, uSegments: 128, vSegments: 64 })
  },

  // Particle in a box (infinite square well)
  particle_in_box: {
    name: "⚛️ Particle in a Box (Infinite Square Well)",
    description: "Schrödinger solution: Ψₙ(x) = √(2/L)·sin(nπx/L)",
    equation: (u, v, params) => {
      const a = params.a ?? 3;      // Box length
      const b = params.b ?? 1;      // Amplitude
      const d = params.d ?? 1;      // Quantum number n
      
      const n = Math.max(1, Math.floor(Math.abs(d)));
      
      const x = u * a;
      const y = (v - 0.5) * a * 0.5;
      
      // Wave function: Ψₙ(x) = sin(nπx/L)
      const waveFunction = Math.sin(n * Math.PI * u);
      
      // Probability density |Ψₙ|²
      const probDensity = waveFunction * waveFunction;
      
      const z = b * probDensity;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3, b: 1, d: 3, uSegments: 128, vSegments: 32 })
  },

  // Wigner quasi-probability distribution W(x,p) in quantum phase space
  wigner_function: {
    name: "⚛️ Wigner Function W(x,p) — Quantum Phase-Space Distribution",
    description: "Wigner quasi-probability distribution: W(x,p) = (1/πℏ)∫Ψ*(x+y)Ψ(x-y)e^(2ipy/ℏ)dy shown as a phase-space surface",
    equation: (u, v, params) => {
      const a = params.a ?? 2;      // Phase-space scale
      const b = params.b ?? 1;      // Amplitude
      const c = params.c ?? 1;      // Spread / squeezing parameter
      const d = params.d ?? 0;      // Coherent state displacement (x₀)
      const e = params.e ?? 0;      // Coherent state displacement (p₀)
      
      // Map u,v onto phase space (x, p)
      const x = (u - 0.5) * a * 4;
      const p = (v - 0.5) * a * 4;
      
      // Displaced coherent-state Wigner function:
      // W(x,p) = (2/πℏ) * exp(-2c*(x-x₀)² - 2*(p-p₀)²/c)
      const dx = x - d;
      const dp = p - e;
      const sigma = Math.max(0.01, c);
      const exponent = -2 * sigma * dx * dx - 2 * dp * dp / sigma;
      
      // Include quantum interference fringes for n=1 superposition state
      const fringes = Math.cos(2 * d * p) * Math.exp(-d * d * 0.5);
      const W = b * (Math.exp(exponent) + 0.4 * fringes * Math.exp(-0.5 * (x * x + p * p)));
      
      return [x, p, W];
    },
    defaultParams: getCleanDefaults({
      a: 2, b: 1, c: 1, d: 1, e: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 96
    })
  },

  // Bell Inequality CHSH — quantum correlations exceeding classical bound
  bell_inequality_chsh: {
    name: "⚛️ Bell Inequality CHSH — Quantum Correlation Surface",
    description: "CHSH quantum correlation E(θ₁,θ₂)=cos(2(θ₁-θ₂)) showing quantum violation of the classical bound |S|≤2 (quantum max 2√2≈2.828)",
    equation: (u, v, params) => {
      const a = params.a ?? 1;      // Correlation amplitude
      const b = params.b ?? 1;      // Frequency (entanglement visibility)
      const c = params.c ?? 1;      // Height scale
      
      // θ₁ and θ₂ are measurement angles for the two-qubit singlet state
      const theta1 = u * Math.PI * 2;   // Alice's measurement angle
      const theta2 = v * Math.PI * 2;   // Bob's measurement angle
      
      // Quantum singlet-state correlation function:
      // E(θ₁,θ₂) = -cos(2(θ₁ - θ₂))
      const correlation = -Math.cos(b * 2 * (theta1 - theta2));
      
      // CHSH operator value at this angle pair (one of the 4 terms):
      // S = E(a,b) - E(a,b') + E(a',b) + E(a',b')
      // Visualise the full correlation landscape; peak |S_max|=2√2 visible as saddle ridges
      const chshContrib = Math.cos(b * (theta1 - theta2)) + 0.3 * Math.cos(b * 2 * theta1);
      
      // Map angular space onto Cartesian surface
      const r = a * (1 + 0.35 * correlation);
      const x = r * Math.cos(theta1);
      const y = r * Math.sin(theta1);
      const z = c * chshContrib;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 2, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 96
    })
  }

};

console.log(`📐 Loaded ${Object.keys(SCHRODINGER_EQUATIONS).length} Schrödinger equation visualizations 🌊⚛️💫`);
