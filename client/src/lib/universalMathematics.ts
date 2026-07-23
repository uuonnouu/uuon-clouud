
/**
 * UNIVERSAL MATHEMATICS ENGINE
 * Complete mathematical framework of physical reality as 3D visualizations
 * Based on "Mathematician's Guide to Universal Mathematics"
 */

import { SurfaceParameters } from '../types/math';

export const UNIVERSAL_MATHEMATICS = {
  // I. FUNDAMENTAL CONSTANTS SURFACES
  physical_constants_landscape: {
    name: "🌌 Physical Constants Landscape",
    equation: (u: number, v: number, params: any) => {
      const c = 299792458; // Speed of light
      const h_bar = 1.054571817e-34; // Reduced Planck constant
      const G = 6.67430e-11; // Gravitational constant
      const k_B = 1.380649e-23; // Boltzmann constant
      const e = 1.602176634e-19; // Elementary charge
      
      // Create landscape based on fundamental constants
      const x = params.a * (u * 2 - 1) * 10;
      const y = params.b * (v * 2 - 1) * 10;
      
      // Height represents relationship between constants
      const planck_surface = Math.exp(-((x - 3)**2 + (y - 0)**2) / 2) * h_bar * 1e35;
      const light_surface = Math.exp(-((x + 3)**2 + (y - 0)**2) / 3) * c * 1e-8;
      const gravity_surface = Math.exp(-((x)**2 + (y - 3)**2) / 4) * G * 1e12;
      
      const z = params.c * (planck_surface + light_surface + gravity_surface);
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 0.5, d: 1, e: 0, f: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // II. SPACETIME STRUCTURE
  einstein_field_equations: {
    name: "🌠 Einstein Field Equations - Spacetime Curvature",
    equation: (u: number, v: number, params: any) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Einstein tensor components visualization
      const G_00 = params.a; // Energy density
      const G_11 = params.b; // Pressure x
      const G_22 = params.c; // Pressure y
      const G_33 = params.d; // Pressure z
      const Lambda = params.e; // Cosmological constant
      
      // Ricci curvature representation
      const ricci_scalar = G_00 - G_11 - G_22 - G_33;
      const curvature = 1 + ricci_scalar * 0.1;
      
      // Spacetime surface with curvature
      const r = curvature + Lambda * 0.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + params.f * Math.sin(theta * 4) * 0.1;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 0.3, c: 0.3, d: 0.3, e: 0.1, f: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  schwarzschild_metric: {
    name: "🕳️ Schwarzschild Black Hole Metric",
    equation: (u: number, v: number, params: any) => {
      const r = params.a * (1 + u * 4); // Radial coordinate
      const theta = v * Math.PI;
      const phi = u * 2 * Math.PI;
      
      const M = params.b; // Mass parameter
      const rs = 2 * M; // Schwarzschild radius (units where G=c=1)
      
      // Metric coefficient g_rr = 1/(1-rs/r)
      const g_rr = r > rs * 1.1 ? 1 / (1 - rs/r) : 10; // Avoid singularity
      
      // Embed the metric curvature in 3D
      const curvature_factor = Math.sqrt(Math.abs(g_rr - 1)) * params.c;
      const embedding_r = r + curvature_factor;
      
      const x = embedding_r * Math.sin(theta) * Math.cos(phi);
      const y = embedding_r * Math.sin(theta) * Math.sin(phi);
      const z = embedding_r * Math.cos(theta) + params.d * Math.sin(phi * 3) * 0.1;
      
      return [x, y, z];
    },
    defaults: { a: 2, b: 1, c: 0.5, d: 0.1, e: 0, f: 0, uMin: 0.1, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  // III. QUANTUM MECHANICS
  schrodinger_equation: {
    name: "🌊 Schrödinger Wave Function",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 5;
      const y = params.b * (v * 2 - 1) * 5;
      const t = params.e; // Time parameter
      
      // Quantum harmonic oscillator wave functions
      const n = Math.floor(params.c * 5); // Quantum number
      const omega = params.d; // Angular frequency
      
      // Hermite polynomials (approximated)
      let H_n = 1;
      if (n === 1) H_n = 2 * x;
      else if (n === 2) H_n = 4 * x * x - 2;
      else if (n === 3) H_n = 8 * x * x * x - 12 * x;
      
      // Wave function
      const psi_real = H_n * Math.exp(-(x*x + y*y) / (2 * params.a)) * Math.cos(omega * t);
      const psi_imag = H_n * Math.exp(-(x*x + y*y) / (2 * params.a)) * Math.sin(omega * t);
      
      // Probability density |ψ|²
      const probability = psi_real * psi_real + psi_imag * psi_imag;
      const z = params.f * probability;
      
      return [x, y, z];
    },
    defaults: { a: 2, b: 2, c: 1, d: 1, e: 0, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  heisenberg_uncertainty: {
    name: "🔬 Heisenberg Uncertainty Principle",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 3;
      const p = params.b * (v * 2 - 1) * 3; // Momentum
      
      const hbar = 1.054571817e-34;
      const delta_x = Math.abs(x) + params.c;
      const delta_p = Math.abs(p) + params.d;
      
      // Uncertainty relation: Δx·Δp ≥ ℏ/2
      const uncertainty_product = delta_x * delta_p;
      const minimum_uncertainty = hbar / 2;
      
      // Surface height shows where uncertainty principle is violated (impossible regions)
      const violation = uncertainty_product < minimum_uncertainty * 1e34 ? 10 : 0;
      const allowed_height = uncertainty_product * 1e33;
      
      const z = params.e * (allowed_height + violation) + params.f * Math.sin(x + p);
      
      return [x, p, z];
    },
    defaults: { a: 1, b: 1, c: 0.1, d: 0.1, e: 0.1, f: 0.05, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  // IV. ELECTROMAGNETIC THEORY
  maxwell_equations_field: {
    name: "⚡ Maxwell's Electromagnetic Field",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 4;
      const y = params.b * (v * 2 - 1) * 4;
      const t = params.e; // Time
      const c = 299792458; // Speed of light
      
      // Electric field components
      const E_x = params.c * Math.sin(x - c * t) * Math.cos(y);
      const E_y = params.c * Math.cos(x - c * t) * Math.sin(y);
      
      // Magnetic field (from ∇×E = -∂B/∂t)
      const B_z = params.d * (Math.cos(x - c * t) * Math.cos(y) + Math.sin(x - c * t) * Math.sin(y));
      
      // Field magnitude
      const field_magnitude = Math.sqrt(E_x*E_x + E_y*E_y + B_z*B_z);
      
      // Poynting vector direction (energy flow)
      const z = params.f * field_magnitude + Math.sin((x + y) * 0.5) * 0.2;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 0, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // V. THERMODYNAMICS
  entropy_landscape: {
    name: "🌡️ Entropy and Information Landscape",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 5;
      const y = params.b * (v * 2 - 1) * 5;
      
      const k_B = 1.380649e-23;
      const T = params.c * 300; // Temperature in Kelvin
      
      // Boltzmann entropy: S = k_B * ln(Ω)
      const omega = Math.exp(x*x + y*y); // Number of microstates
      const S_boltzmann = k_B * Math.log(omega);
      
      // Shannon entropy: H = -Σ p_i * log(p_i)
      const p1 = Math.exp(-x*x) / (Math.exp(-x*x) + Math.exp(-y*y) + 1e-10);
      const p2 = Math.exp(-y*y) / (Math.exp(-x*x) + Math.exp(-y*y) + 1e-10);
      const H_shannon = -(p1 * Math.log2(p1 + 1e-10) + p2 * Math.log2(p2 + 1e-10));
      
      // Free energy landscape: F = U - TS
      const U = params.d * (x*x + y*y); // Internal energy
      const F = U - T * S_boltzmann * 1e23;
      
      const z = params.e * F + params.f * H_shannon;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 1e-5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  // VI. COSMOLOGY
  friedmann_universe: {
    name: "🌌 Friedmann-Lemaître Universe Evolution",
    equation: (u: number, v: number, params: any) => {
      const t = u * params.a * 14; // Time in billion years
      const theta = v * 2 * Math.PI;
      
      // Density parameters
      const Omega_m = params.b; // Matter density
      const Omega_Lambda = params.c; // Dark energy density
      const Omega_k = 1 - Omega_m - Omega_Lambda; // Curvature
      
      const H_0 = 70; // Hubble constant km/s/Mpc
      
      // Scale factor evolution (approximate)
      const a_t = Math.pow(t / 14, 2/3) * (Omega_m > 0.5 ? 1 : Math.exp((t - 14) * Omega_Lambda * 0.1));
      
      // Cosmic radius at time t
      const R = a_t * params.d;
      
      // Universe surface
      const x = R * Math.cos(theta);
      const y = R * Math.sin(theta);
      const z = params.e * (Omega_Lambda - Omega_m) * t + params.f * Math.sin(theta * 3) * 0.1;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 0.3, c: 0.7, d: 3, e: 0.1, f: 0.2, uMin: 0.1, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 48 }
  },

  // VII. PARTICLE PHYSICS
  standard_model_lagrangian: {
    name: "🔬 Standard Model Lagrangian Density",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 3;
      const y = params.b * (v * 2 - 1) * 3;
      
      // Field components
      const phi = x + y; // Higgs field
      const psi = Math.sin(x) * Math.cos(y); // Fermionic field
      const A = Math.cos(x + y); // Gauge field
      
      // Lagrangian terms
      const kinetic = 0.5 * (Math.cos(phi)**2 + Math.sin(psi)**2); // Kinetic terms
      const potential = params.c * (phi*phi - params.d)**2; // Higgs potential
      const yukawa = params.e * psi * phi; // Yukawa coupling
      const gauge = -0.25 * A * A; // Gauge field strength
      
      const L = kinetic - potential + yukawa + gauge;
      const z = params.f * L;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 0.25, d: 1, e: 0.1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  // VIII. STRING THEORY
  string_worldsheet: {
    name: "🎵 String Theory Worldsheet",
    equation: (u: number, v: number, params: any) => {
      const sigma = u * 2 * Math.PI; // Spatial string coordinate
      const tau = v * params.a; // Time coordinate
      
      // String embedding coordinates X^μ
      const X_0 = params.b * tau; // Time dimension
      const X_1 = params.c * Math.cos(sigma + params.d * tau); // X dimension
      const X_2 = params.c * Math.sin(sigma + params.d * tau); // Y dimension
      const X_3 = params.e * Math.sin(2 * sigma) * Math.cos(params.f * tau); // Z dimension
      
      // Project to 3D (using spatial dimensions)
      const x = X_1;
      const y = X_2;  
      const z = X_3;
      
      return [x, y, z];
    },
    defaults: { a: 2, b: 1, c: 2, d: 1, e: 0.5, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 30 }
  },

  // IX. GENERAL MATHEMATICAL STRUCTURES
  riemann_curvature_tensor: {
    name: "📐 Riemann Curvature Tensor Components",
    equation: (u: number, v: number, params: any) => {
      const x = params.a * (u * 2 - 1) * 2;
      const y = params.b * (v * 2 - 1) * 2;
      
      // Approximate Riemann tensor components for a 2D surface
      const g_xx = 1 + params.c * x * x;
      const g_yy = 1 + params.d * y * y;
      const g_xy = params.e * x * y;
      
      // Christoffel symbols (simplified)
      const Gamma_xx_x = params.c * x / g_xx;
      const Gamma_yy_y = params.d * y / g_yy;
      
      // Riemann curvature (one component)
      const R_xyxy = Gamma_xx_x * Gamma_yy_y - (params.e)**2;
      
      // Gaussian curvature
      const K = R_xyxy / (g_xx * g_yy - g_xy * g_xy);
      
      const z = params.f * K + Math.sin(x + y) * 0.1;
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 0.2, d: 0.2, e: 0.1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 50 }
  }
};

// Category information
export const UNIVERSAL_MATHEMATICS_INFO = {
  category: "Universal Mathematics",
  description: "Complete mathematical framework of physical reality - from quantum mechanics to cosmology",
  totalShapes: Object.keys(UNIVERSAL_MATHEMATICS).length,
  difficulty: "Graduate Level",
  domains: [
    "Fundamental Constants",
    "Spacetime & Relativity", 
    "Quantum Mechanics",
    "Electromagnetic Theory",
    "Thermodynamics & Statistics",
    "Cosmology",
    "Particle Physics",
    "String Theory",
    "Mathematical Structures"
  ]
};

export function getUniversalMathematicsShape(shapeName: string) {
  return UNIVERSAL_MATHEMATICS[shapeName as keyof typeof UNIVERSAL_MATHEMATICS];
}

export function getAllUniversalMathematicsShapes() {
  return Object.entries(UNIVERSAL_MATHEMATICS).map(([key, shape]) => ({
    id: key,
    ...shape
  }));
}
