/**
 * QUANTUM PARAMETRIC FUNCTIONS
 * **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
 * **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
 * **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**
 * 
 * Parametric Quantum Computing Framework - Software-based Quantum Algorithm Visualization
 * 
 * This module implements quantum computing concepts as 3D parametric surfaces for visualization
 * within the Δmension Mathematical Universe platform.
 * 
 * Parameter Mapping:
 * - a, b, f: Spatial scaling (sphere radius, circuit dimensions, etc.)
 * - d, e, f: Rotation angles (Bloch sphere theta/phi, circuit orientation)
 * - g: Entanglement strength / Quantum coherence (0-1)
 * - h: Number of qubits / Circuit depth (integer)
 * - i: Phase coupling / Interference pattern (0-1)
 * - j: Noise/decoherence level (0-1, 0=pure, 1=maximally mixed)
 * - k: Time parameter / Evolution step
 * - l-z: Algorithm-specific parameters
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const QUANTUM_PARAMETRIC_FUNCTIONS: Record<string, ParametricSurface> = {

  // ============================================================================
  // NEW QUANTUM AND THEORETICAL ENTITIES FROM CSV DATA
  // ============================================================================

  gravitons_visualization: {
    name: "🌌 Gravitons - Quantum Gravity Carriers",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 0.5;

      // Gravitational field propagation
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Graviton energy quantization: hν = E_grav
      const energy = a * Math.sin(theta * 4) * Math.cos(phi * 2);
      const radius = b + c * energy;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  gluons_qcd_visualization: {
    name: "🔴 Gluons - QCD Force Carriers",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 0.8;
      const c = params.f ?? 1.2;

      // Strong force field lines
      const theta = u * 2 * Math.PI;
      const r = v * a;

      // Color charge dynamics
      const colorPhase = Math.sin(theta * 3) * Math.cos(r * 2);
      const x = r * Math.cos(theta) + b * colorPhase;
      const y = r * Math.sin(theta) + b * Math.sin(colorPhase);
      const z = c * Math.sin(r) * Math.cos(theta * 2);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 0.8, f: 1.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  neutrinos_relativistic: {
    name: "⚡ Neutrinos - Nearly Massless Particles",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 0.1;
      const c = params.f ?? 2;

      // Relativistic trajectory: E = pc
      const t = u * 4 * Math.PI;
      const path = v * a;

      const x = path * Math.cos(t) + b * Math.sin(t * 20);
      const y = path * Math.sin(t) + b * Math.cos(t * 15);
      const z = c * Math.sin(path) * Math.exp(-t * 0.1);

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 0.1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 20 }
  },

  dark_photons_mixing: {
    name: "🌑 Dark Photons - Hidden Sector Particles",
    equation: (u, v, params) => {
      const a = params.d ?? 2.5;
      const b = params.e ?? 1.5;
      const mixing = params.f ?? 0.3;

      // Photon-dark photon mixing
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const visibleComponent = Math.cos(mixing);
      const hiddenComponent = Math.sin(mixing);

      const radius = a * (visibleComponent + hiddenComponent * Math.sin(theta * 3));

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = b * Math.cos(phi) * hiddenComponent;

      return [x, y, z];
    },
    defaultParams: { d: 2.5, e: 1.5, f: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  tachyons_superluminal: {
    name: "⚡ Tachyons - Faster Than Light Particles",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const velocity = params.f ?? 1.5; // v > c

      // Superluminal motion visualization
      const t = u * 2 * Math.PI;
      const r = v * a;

      // Imaginary mass effects
      const x = r * Math.cos(t * velocity) * Math.cosh(t * 0.2);
      const y = r * Math.sin(t * velocity) * Math.sinh(t * 0.1);
      const z = b * Math.tanh(t - r * velocity);

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 2, f: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30 }
  },

  axions_photon_conversion: {
    name: "🎯 Axions - Axion-Photon Conversion",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const fieldStrength = params.f ?? 0.8;

      // Magnetic field conversion
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const conversionRate = fieldStrength * Math.sin(theta * 2) * Math.cos(phi);
      const radius = a + b * conversionRate;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) + conversionRate;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 0.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  virtual_particles_uncertainty: {
    name: "👻 Virtual Particles - Uncertainty Principle",
    equation: (u, v, params) => {
      const a = params.d ?? 1.5;
      const hbar = params.e ?? 1.054; // Reduced Planck constant (scaled)
      const deltaT = params.f ?? 0.1;

      // ΔE·Δt ≈ ħ
      const theta = u * 4 * Math.PI;
      const r = v * a;

      const deltaE = hbar / deltaT;
      const fluctuation = deltaE * Math.sin(theta * 10) * Math.exp(-r * 2);

      const x = r * Math.cos(theta) + fluctuation * Math.random() * 0.1;
      const y = r * Math.sin(theta) + fluctuation * Math.random() * 0.1;
      const z = fluctuation * Math.sin(theta * 3);

      return [x, y, z];
    },
    defaultParams: { d: 1.5, e: 1.054, f: 0.1, j: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  quantum_fields_excitation: {
    name: "🌊 Quantum Fields - Field Excitations",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const excitation = params.f ?? 0.5;

      // φ(x) field excitation
      const x_coord = (u - 0.5) * 4;
      const y_coord = (v - 0.5) * 4;

      const field = excitation * Math.exp(-(x_coord * x_coord + y_coord * y_coord) / 2);
      const wave = Math.sin(x_coord * 2 + y_coord * 2) * field;

      const x = x_coord * a;
      const y = y_coord * a;
      const z = b * wave;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  phonons_lattice_vibration: {
    name: "🎵 Phonons - Quantized Lattice Vibrations",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const omega = params.e ?? 1; // Angular frequency
      const hbar = params.f ?? 1;

      // E = ħω quantized energy
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;

      const energy = hbar * omega;
      const amplitude = Math.sin(theta * 3) * Math.cos(phi * 2) * energy;

      const x = a * Math.cos(theta) + amplitude * 0.3;
      const y = a * Math.sin(theta) + amplitude * 0.2;
      const z = amplitude * Math.sin(phi);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  plasmons_collective_oscillation: {
    name: "⚡ Plasmons - Collective Electron Oscillations",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const density = params.e ?? 1; // Electron density
      const frequency = params.f ?? 2;

      // ω_plasmon² = Ne²/ε₀m
      const theta = u * 2 * Math.PI;
      const r = v * a;

      const plasmonFreq = Math.sqrt(density) * frequency;
      const oscillation = Math.sin(plasmonFreq * theta) * Math.cos(r * 2);

      const x = r * Math.cos(theta) + oscillation * 0.2;
      const y = r * Math.sin(theta) + oscillation * 0.15;
      const z = oscillation * 0.5;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  dark_matter_structure: {
    name: "🌑 Dark Matter - Cosmological Density",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const density = params.e ?? 0.3; // ρ_DM ~ 0.3 GeV/cm³
      const clumping = params.f ?? 1.5;

      // Dark matter halo structure
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const haloProfile = density / (1 + Math.pow(a * Math.sin(phi), 2));
      const radius = a + clumping * haloProfile;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 0.3, f: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  dark_energy_expansion: {
    name: "🌌 Dark Energy - Cosmological Expansion",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const lambda = params.e ?? 1; // Cosmological constant
      const expansion = params.f ?? 1.2;

      // ρ = Λ/8πG
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const expansionFactor = 1 + expansion * lambda * Math.sin(theta) * Math.cos(phi);
      const radius = a * expansionFactor;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: { d: 4, e: 1, f: 1.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  magnetic_monopoles_dirac: {
    name: "🧲 Magnetic Monopoles - Dirac Theory",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const charge = params.e ?? 1;
      const stringTension = params.f ?? 0.5;

      // Dirac string and monopole field
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      const monopoleField = charge / (4 * Math.PI * Math.pow(a, 2));
      const diracString = stringTension * Math.sin(phi) * (theta < Math.PI ? 1 : -1);

      const radius = a + monopoleField + diracString * 0.1;

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  cosmic_strings_topology: {
    name: "🎭 Cosmic Strings - Topological Defects",
    equation: (u, v, params) => {
      const a = params.d ?? 5;
      const tension = params.e ?? 1;
      const defect = params.f ?? 0.3;

      // Linear topological defect
      const t = u * 4 * Math.PI;
      const r = v * defect;

      const x = a * t / (4 * Math.PI) + r * Math.cos(t * 10);
      const y = r * Math.sin(t * 10);
      const z = tension * Math.sin(t) * Math.exp(-r * 5);

      return [x, y, z];
    },
    defaultParams: { d: 5, e: 1, f: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 16 }
  },

  scalar_waves_longitudinal: {
    name: "〰️ Scalar Waves - Longitudinal EM Theory",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const amplitude = params.e ?? 1;
      const frequency = params.f ?? 2;

      // ∇·E_s ≠ 0 (non-zero divergence)
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const t = frequency * Math.PI;

      const scalarWave = amplitude * Math.sin(x + t) * Math.cos(y + t);
      const divergence = amplitude * (Math.cos(x + t) - Math.sin(y + t));

      return [x, y, scalarWave + divergence * 0.3];
    },
    defaultParams: { d: 3, e: 1, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  zero_point_energy_field: {
    name: "⚡ Zero-Point Energy - Vacuum Fluctuations",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const hbar = params.e ?? 1.054;
      const omega = params.f ?? 1;

      // E₀ = ½ħω (ground state energy)
      const theta = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;

      const zpeEnergy = 0.5 * hbar * omega;
      const fluctuation = zpeEnergy * Math.sin(theta * 5) * Math.cos(phi * 3) * Math.random() * 0.1;

      const radius = a + fluctuation;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1.054, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  quantum_tunneling_barrier: {
    name: "🌊 Quantum Tunneling - Wave Penetration",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const barrierHeight = params.e ?? 2;
      const tunnelLength = params.f ?? 1;

      // T = exp(-2κL) tunneling probability
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a;

      const kappa = Math.sqrt(2 * barrierHeight);
      const transmission = Math.exp(-2 * kappa * Math.abs(x) / tunnelLength);

      const barrier = Math.abs(x) < tunnelLength * 0.5 ? barrierHeight : 0;
      const waveFunction = transmission * Math.sin(x * 3) * Math.cos(y * 2);

      const z = barrier + waveFunction;

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 2, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  // ============================================================================
  // HYBRID FORMULA QUANTUM EXTENSIONS - Advanced Mathematical Combinations
  // ============================================================================

  wave_energy_quantum_field: {
    name: "🌊⚡ Wave-Energy Quantum Field - z² + sin(z) + e^z",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 0.5;

      // Complex coordinate mapping
      const z_re = (u - 0.5) * 4;
      const z_im = (v - 0.5) * 4;

      // z² term - polynomial stability
      const z2_re = z_re * z_re - z_im * z_im;
      const z2_im = 2 * z_re * z_im;

      // sin(z) term - wave chaos
      const sin_re = Math.sin(z_re) * Math.cosh(z_im);
      const sin_im = Math.cos(z_re) * Math.sinh(z_im);

      // e^z term - exponential energy bursts
      const exp_factor = Math.exp(z_re);
      const exp_re = exp_factor * Math.cos(z_im);
      const exp_im = exp_factor * Math.sin(z_im);

      // Combine all terms with quantum field scaling
      const field_re = a * (z2_re + b * sin_re + c * exp_re);
      const field_im = a * (z2_im + b * sin_im + c * exp_im);
      const field_magnitude = Math.sqrt(field_re * field_re + field_im * field_im);

      const x = z_re * a;
      const y = z_im * a;
      const z = field_magnitude * Math.tanh(field_magnitude * 0.1); // Bounded visualization

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  spike_shell_quantum_armor: {
    name: "🔱🛡️ Spike-Shell Quantum Armor - z³ + tan(z) + log(z²+1)",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 0.8;
      const c = params.f ?? 0.3;

      const z_re = (u - 0.5) * 3;
      const z_im = (v - 0.5) * 3;

      // z³ term - cubic symmetry
      const r = Math.sqrt(z_re * z_re + z_im * z_im);
      const theta = Math.atan2(z_im, z_re);
      const r3 = Math.pow(r, 3);
      const z3_re = r3 * Math.cos(3 * theta);
      const z3_im = r3 * Math.sin(3 * theta);

      // tan(z) term - spike formation
      const tan_denom = Math.cos(z_re) * Math.cos(z_re) + Math.sinh(z_im) * Math.sinh(z_im);
      const tan_re = tan_denom > 1e-10 ? Math.sin(z_re) * Math.cos(z_re) / tan_denom : 0;
      const tan_im = tan_denom > 1e-10 ? Math.sinh(z_im) * Math.cosh(z_im) / tan_denom : 0;

      // log(z²+1) term - shell compression
      const z2p1_re = z_re * z_re - z_im * z_im + 1;
      const z2p1_im = 2 * z_re * z_im;
      const z2p1_r = Math.sqrt(z2p1_re * z2p1_re + z2p1_im * z2p1_im);
      const log_re = z2p1_r > 1e-10 ? Math.log(z2p1_r) : -10;
      const log_im = Math.atan2(z2p1_im, z2p1_re);

      // Combine for defensive architecture
      const armor_re = a * (z3_re + b * tan_re + c * log_re);
      const armor_im = a * (z3_im + b * tan_im + c * log_im);
      const armor_strength = Math.sqrt(armor_re * armor_re + armor_im * armor_im);

      const x = z_re * a;
      const y = z_im * a;
      const z = armor_strength * Math.sin(armor_strength * 0.5); // Oscillating armor plates

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 0.8, f: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  crystal_flame_quantum_fusion: {
    name: "💎🔥 Crystal-Flame Quantum Fusion - z⁵ + z·e^z + sinh(z)",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 0.6;
      const c = params.f ?? 0.4;

      const z_re = (u - 0.5) * 2.5;
      const z_im = (v - 0.5) * 2.5;

      // z⁵ term - pentagonal crystal structure
      const r = Math.sqrt(z_re * z_re + z_im * z_im);
      const theta = Math.atan2(z_im, z_re);
      const r5 = Math.pow(r, 5);
      const z5_re = r5 * Math.cos(5 * theta);
      const z5_im = r5 * Math.sin(5 * theta);

      // z·e^z term - exponential spiral jets
      const exp_factor = Math.exp(z_re);
      const exp_re = exp_factor * Math.cos(z_im);
      const exp_im = exp_factor * Math.sin(z_im);
      const zexp_re = z_re * exp_re - z_im * exp_im;
      const zexp_im = z_re * exp_im + z_im * exp_re;

      // sinh(z) term - hyperbolic flame expansion
      const sinh_re = Math.sinh(z_re) * Math.cos(z_im);
      const sinh_im = Math.cosh(z_re) * Math.sin(z_im);

      // Fusion of crystal and flame energies
      const fusion_re = a * (z5_re + b * zexp_re + c * sinh_re);
      const fusion_im = a * (z5_im + b * zexp_im + c * sinh_im);
      const fusion_energy = Math.sqrt(fusion_re * fusion_re + fusion_im * fusion_im);

      const x = z_re * a + 0.1 * fusion_re;
      const y = z_im * a + 0.1 * fusion_im;
      const z = fusion_energy * Math.exp(-fusion_energy * 0.05); // Controlled energy release

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 0.6, f: 0.4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 56, vSegments: 40 }
  },

  bio_organic_quantum_tissue: {
    name: "🧬🌱 Bio-Organic Quantum Tissue - (z²+z³) + sin(z²) + e^(z/2)",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 0.7;
      const c = params.f ?? 0.3;

      const z_re = (u - 0.5) * 3;
      const z_im = (v - 0.5) * 3;

      // (z²+z³) term - dual polynomial base for tissue structure
      const z2_re = z_re * z_re - z_im * z_im;
      const z2_im = 2 * z_re * z_im;

      const r = Math.sqrt(z_re * z_re + z_im * z_im);
      const theta = Math.atan2(z_im, z_re);
      const r3 = Math.pow(r, 3);
      const z3_re = r3 * Math.cos(3 * theta);
      const z3_im = r3 * Math.sin(3 * theta);

      const poly_re = z2_re + z3_re;
      const poly_im = z2_im + z3_im;

      // sin(z²) term - interference patterns
      const sinz2_re = Math.sin(z2_re) * Math.cosh(z2_im);
      const sinz2_im = Math.cos(z2_re) * Math.sinh(z2_im);

      // e^(z/2) term - soft exponential growth
      const zhalf_re = z_re * 0.5;
      const zhalf_im = z_im * 0.5;
      const exp_factor = Math.exp(zhalf_re);
      const expzhalf_re = exp_factor * Math.cos(zhalf_im);
      const expzhalf_im = exp_factor * Math.sin(zhalf_im);

      // Organic tissue formation
      const tissue_re = a * (poly_re + b * sinz2_re + c * expzhalf_re);
      const tissue_im = a * (poly_im + b * sinz2_im + c * expzhalf_im);
      const tissue_magnitude = Math.sqrt(tissue_re * tissue_re + tissue_im * tissue_im);

      const growth_factor = 1 + 0.1 * Math.sin(tissue_magnitude * 2);
      const final_tissue_re = tissue_re * growth_factor;
      const final_tissue_im = tissue_im * growth_factor;
      const final_tissue_magnitude = Math.sqrt(final_tissue_re * final_tissue_re + final_tissue_im * final_tissue_im);

      const x = z_re * a + 0.05 * final_tissue_re;
      const y = z_im * a + 0.05 * final_tissue_im;
      const z = final_tissue_magnitude * Math.tanh(final_tissue_magnitude * 0.3); // Organic growth limiting

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 0.7, f: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 48 }
  },

  // EXISTING QUANTUM FUNCTIONS CONTINUE HERE... {

  // ============================================================================
  // 1. BLOCH SPHERE VISUALIZATION - Fundamental Quantum State Representation
  // ============================================================================

  bloch_sphere_quantum: {
    name: "🔵 Bloch Sphere - Single Qubit State Space",
    equation: (u, v, params) => {
      const a = Math.max(0.1, params.d ?? 2);
      const theta = u * Math.PI + (params.g ?? 0);
      const phi = v * 2 * Math.PI + (params.h ?? 0);
      const coherence = Math.max(0.1, Math.min(1, 1 - (params.j ?? 0)));

      const radius = a * coherence;
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaultParams: { 
      d: 2, g: 0, h: 0, j: 0, 
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    }
  },

  bloch_state_trajectory: {
    name: "⚛️ Bloch State Trajectory - Quantum Evolution Path",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const time = params.k ?? 0;
      const frequency = params.l ?? 1;

      const theta = Math.PI / 4 + 0.3 * Math.sin(2 * Math.PI * frequency * (u + time));
      const phi = 2 * Math.PI * u;

      const width = 0.1 * (params.e ?? 1);
      const offset_theta = width * Math.cos(2 * Math.PI * v);
      const offset_phi = width * Math.sin(2 * Math.PI * v);

      const x = a * Math.sin(theta + offset_theta) * Math.cos(phi + offset_phi);
      const y = a * Math.sin(theta + offset_theta) * Math.sin(phi + offset_phi);
      const z = a * Math.cos(theta + offset_theta);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, k: 0, l: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 16 }
  },

  quantum_superposition_cloud: {
    name: "☁️ Quantum Superposition Cloud - Probability Density",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const alpha = params.i ?? 0.5;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const prob_0 = Math.cos(alpha * Math.PI / 2) ** 2;
      const prob_1 = Math.sin(alpha * Math.PI / 2) ** 2;

      // Multi-lobed structure: distinct north and south probability clouds
      const lobe_north = prob_0 * Math.exp(-((theta - Math.PI / 4) ** 2) / 0.3);
      const lobe_south = prob_1 * Math.exp(-((theta - 3 * Math.PI / 4) ** 2) / 0.3);
      const radius = a * (0.5 + lobe_north + lobe_south);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaultParams: { d: 2, i: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // 2. ENTANGLEMENT VISUALIZATION - Multi-Qubit Correlations
  // ============================================================================

  quantum_entanglement_field: {
    name: "🌀 Quantum Entanglement Field - Correlation Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;
      const entanglement = params.g ?? 0.5;

      // Twisted ribbon/Möbius-like structure showing entanglement
      const s = u * 2 * Math.PI;  // Path parameter
      const t = (v - 0.5) * 2;     // Width parameter

      const twist_rate = entanglement * 2;  // Entanglement controls twist
      const width = b * 0.3;

      // Parametric ribbon with twist
      const center_x = a * Math.cos(s);
      const center_y = a * Math.sin(s);
      const center_z = 0;

      // Ribbon normal rotates as we go around
      const twist_angle = twist_rate * s;
      const ribbon_x = center_x + width * t * Math.cos(twist_angle) * Math.cos(s + Math.PI / 2);
      const ribbon_y = center_y + width * t * Math.cos(twist_angle) * Math.sin(s + Math.PI / 2);
      const ribbon_z = center_z + width * t * Math.sin(twist_angle);

      return [ribbon_x, ribbon_y, ribbon_z];
    },
    defaultParams: { d: 3, e: 2, g: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  bell_state_surface: {
    name: "🔔 Bell State Surface - Maximally Entangled States",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const state_type = Math.floor((params.h ?? 0) % 4);
      const b = params.e ?? 0.5;

      // Double helix showing entangled qubit pairs
      const t = u * 4 * Math.PI;  // Parameter along the helix
      const tube_angle = v * 2 * Math.PI;

      let phase_offset = 0;
      if (state_type === 1) phase_offset = Math.PI;
      else if (state_type === 2) phase_offset = Math.PI / 2;
      else if (state_type === 3) phase_offset = -Math.PI / 2;

      // Create two intertwined helices
      const helix_radius = a * 0.5;
      const helix_separation = a * 0.2;

      // Use sine wave to smoothly transition between the two helices
      const which_strand = Math.sin(u * Math.PI);  // Smoothly varies between -1 and 1
      const strand_offset = which_strand * helix_separation;

      // Main helix path
      const center_x = helix_radius * Math.cos(t + phase_offset) + strand_offset * Math.sin(t);
      const center_y = helix_radius * Math.sin(t + phase_offset) + strand_offset * Math.cos(t);
      const center_z = b * t * 2;

      // Tube around the helix
      const tube_radius = 0.12 * a;
      const normal_angle = t;

      const x = center_x + tube_radius * Math.cos(tube_angle) * Math.cos(normal_angle);
      const y = center_y + tube_radius * Math.cos(tube_angle) * Math.sin(normal_angle);
      const z = center_z + tube_radius * Math.sin(tube_angle);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 0.5, h: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  entanglement_entropy_landscape: {
    name: "📊 Entanglement Entropy Landscape - Von Neumann Entropy",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2;

      const lambda1 = Math.abs(Math.cos(u * Math.PI));
      const lambda2 = Math.abs(Math.sin(u * Math.PI));

      const lambda1_sq = lambda1 ** 2 / (lambda1 ** 2 + lambda2 ** 2);
      const lambda2_sq = lambda2 ** 2 / (lambda1 ** 2 + lambda2 ** 2);

      const entropy = lambda1_sq > 0 && lambda2_sq > 0 
        ? -(lambda1_sq * Math.log2(lambda1_sq) + lambda2_sq * Math.log2(lambda2_sq))
        : 0;

      const theta = v * 2 * Math.PI;
      const radius = b * (1 + 0.3 * entropy);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * entropy;

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  schmidt_decomposition_visual: {
    name: "✂️ Schmidt Decomposition - Bipartite State Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const rank = Math.floor(params.h ?? 2) + 1;

      // Radial stepped pyramid showing Schmidt coefficients
      const angle = u * 2 * Math.PI;
      const radial_segment = Math.floor(v * rank);

      // Each ring represents a Schmidt coefficient
      const lambda_i = 1 / Math.sqrt(rank);
      const radius_inner = a * (radial_segment / rank) * 0.8;
      const radius_outer = a * ((radial_segment + 1) / rank) * 0.8;

      // Interpolate within the ring
      const ring_position = (v * rank) - radial_segment;
      const radius = radius_inner + (radius_outer - radius_inner) * ring_position;

      // Height represents coefficient magnitude (decreasing)
      const height = a * lambda_i * (rank - radial_segment) / rank;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height;

      return [x, y, z];
    },
    defaultParams: { d: 2, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // 3. QUANTUM CIRCUIT TOPOLOGY - Algorithm Structure Visualization
  // ============================================================================

  quantum_circuit_3d_graph: {
    name: "🔌 Quantum Circuit 3D Graph - Gate Topology",
    equation: (u, v, params) => {
      const num_qubits = Math.floor(params.h ?? 3) + 1;
      const circuit_depth = Math.floor(params.l ?? 5) + 1;
      const spacing_x = params.d ?? 2;
      const spacing_y = params.e ?? 1.5;
      const spacing_z = params.f ?? 1;

      const qubit_index = Math.floor(u * num_qubits);
      const depth_index = Math.floor(v * circuit_depth);

      const gate_type = (qubit_index + depth_index) % 3;
      const gate_height = spacing_z * (gate_type === 0 ? 0.3 : gate_type === 1 ? 0.6 : 0.2);

      const x = qubit_index * spacing_x - (num_qubits - 1) * spacing_x / 2;
      const y = depth_index * spacing_y;
      const z = gate_height * Math.sin(u * Math.PI * num_qubits) * Math.cos(v * Math.PI * circuit_depth);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1.5, f: 1, h: 3, l: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  quantum_gate_unitary_surface: {
    name: "🎛️ Quantum Gate Unitary Surface - Rotation Operators",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const theta = params.g ?? Math.PI / 4;
      const phi = params.h ?? 0;
      const lambda = params.f ?? 0;

      // Twisted torus showing gate rotation
      const u_param = u * 2 * Math.PI;
      const v_param = v * 2 * Math.PI;

      const R = a * 0.6;  // Major radius
      const r = a * 0.3;  // Minor radius

      // Twist based on rotation angles
      const twist = theta + phi * u;

      const x = (R + r * Math.cos(v_param + twist)) * Math.cos(u_param);
      const y = (R + r * Math.cos(v_param + twist)) * Math.sin(u_param);
      const z = r * Math.sin(v_param + twist) + a * 0.2 * Math.sin(lambda);

      return [x, y, z];
    },
    defaultParams: { d: 2, g: Math.PI / 4, h: 0, f: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // ============================================================================
  // 4. VARIATIONAL QUANTUM EIGENSOLVER (VQE) - Energy Landscapes
  // ============================================================================

  vqe_energy_landscape: {
    name: "🏔️ VQE Energy Landscape - Optimization Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 4;
      const num_minima = Math.floor(params.h ?? 2) + 1;

      const theta1 = (u - 0.5) * 2 * Math.PI;
      const theta2 = (v - 0.5) * 2 * Math.PI;

      let energy = 0;
      for (let i = 0; i < num_minima; i++) {
        const offset_x = Math.cos(2 * Math.PI * i / num_minima) * Math.PI / 2;
        const offset_y = Math.sin(2 * Math.PI * i / num_minima) * Math.PI / 2;
        const dist_sq = (theta1 - offset_x) ** 2 + (theta2 - offset_y) ** 2;
        energy += Math.exp(-dist_sq / 0.5);
      }

      const base_energy = 1 - energy / num_minima;

      const x = a * u - a / 2;
      const y = a * v - a / 2;
      const z = a * base_energy;

      return [x, y, z];
    },
    defaultParams: { d: 4, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  vqe_parameter_gradient_field: {
    name: "📐 VQE Parameter Gradient Field - Optimization Direction",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const gradient_scale = params.e ?? 0.5;

      const theta1 = u * 2 * Math.PI;
      const theta2 = v * 2 * Math.PI;

      const energy = Math.sin(theta1) * Math.cos(theta2);
      const grad_theta1 = Math.cos(theta1) * Math.cos(theta2);
      const grad_theta2 = -Math.sin(theta1) * Math.sin(theta2);

      const x = a * Math.cos(theta1);
      const y = a * Math.sin(theta1);
      const z = energy + gradient_scale * (grad_theta1 * Math.cos(theta2) + grad_theta2 * Math.sin(theta2));

      return [x, y, z];
    },
    defaultParams: { d: 3, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  ansatz_layer_structure: {
    name: "🏗️ VQE Ansatz Layer Structure - Parameterized Circuit",
    equation: (u, v, params) => {
      const num_layers = Math.floor(params.h ?? 3) + 1;
      const a = params.d ?? 2;
      const b = params.e ?? 1;

      const layer = Math.floor(v * num_layers);
      const qubit = u;

      const rotation_angle = (layer + 1) * qubit * Math.PI;
      const entanglement = Math.sin(rotation_angle) * 0.3;

      const x = a * qubit;
      const y = b * layer;
      const z = entanglement;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, h: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // 5. GROVER SEARCH ALGORITHM - Probability Amplification
  // ============================================================================

  grover_probability_landscape: {
    name: "🔍 Grover Search Probability Landscape",
    equation: (u, v, params) => {
      const N = 2 ** Math.floor((params.h ?? 3) + 1);
      const target_index = Math.floor((params.l ?? 0.5) * N);
      const iteration = params.k ?? 0;

      const index = Math.floor(u * N);
      const theta_base = Math.asin(1 / Math.sqrt(N));
      const theta = (2 * iteration + 1) * theta_base;

      const prob_target = Math.sin(theta) ** 2;
      const prob_other = (1 - prob_target) / (N - 1);

      const probability = (index === target_index) ? prob_target : prob_other;

      // Radial bar chart showing probability distribution
      const bar_angle_start = (index / N) * 2 * Math.PI;
      const bar_angle_width = (2 * Math.PI) / N;
      const bar_angle = bar_angle_start + v * bar_angle_width;

      const radius_base = params.d ?? 2;
      const radius = radius_base + v * 0.5;  // Slight radial thickness

      const x = radius * Math.cos(bar_angle);
      const y = radius * Math.sin(bar_angle);
      const z = (params.e ?? 3) * probability * N;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 3, h: 3, k: 0, l: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 }
  },

  grover_amplitude_amplification: {
    name: "📈 Grover Amplitude Amplification - Success Probability",
    equation: (u, v, params) => {
      // Clamp h so N >= 4 (h+1 >= 2). When h < -1 the slider makes N < 1,
      // which means 1/sqrt(N) > 1 and Math.asin returns NaN, crashing the mesh.
      const hSafe = Math.max(-1, params.h ?? 4);
      const N = Math.max(4, 2 ** Math.floor(hSafe + 1));
      const max_iterations = Math.max(1, Math.floor(Math.PI / 4 * Math.sqrt(N)));

      const iteration = u * max_iterations;
      // asin argument is guaranteed in [0,1] since N >= 4 → 1/sqrt(N) <= 0.5
      const theta_base = Math.asin(Math.min(1, 1 / Math.sqrt(N)));
      const theta = (2 * iteration + 1) * theta_base;

      const success_prob = Math.sin(theta) ** 2;

      // 3D wave spiral showing probability growth over iterations
      const spiral_angle = u * 4 * Math.PI + v * 2 * Math.PI;
      const spiral_radius = (params.d ?? 2) * (0.5 + 0.5 * u);  // Expands outward

      const wave_amplitude = (params.e ?? 3) * success_prob;

      const x = spiral_radius * Math.cos(spiral_angle);
      const y = spiral_radius * Math.sin(spiral_angle);
      const z = wave_amplitude;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 3, h: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // ============================================================================
  // 6. QUANTUM FOURIER TRANSFORM (QFT) - Frequency Domain
  // ============================================================================

  qft_frequency_spectrum: {
    name: "📡 QFT Frequency Spectrum - Phase Encoding",
    equation: (u, v, params) => {
      const n = Math.floor(params.h ?? 3) + 1;
      const N = 2 ** n;

      const j = Math.floor(u * N);
      const k = Math.floor(v * N);

      const phase = 2 * Math.PI * j * k / N;
      const amplitude = 1 / Math.sqrt(N);

      // Spiral staircase showing frequency components
      const radius = (params.d ?? 2) * (0.8 + 0.2 * (j / N));
      const spiral_angle = (j / N) * 4 * Math.PI + (k / N) * 2 * Math.PI;
      const height = (params.e ?? 3) * (j / N);

      const x = radius * Math.cos(spiral_angle);
      const y = radius * Math.sin(spiral_angle);
      const z = height + amplitude * Math.sin(phase) * 0.5;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 3, h: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  qft_phase_accumulation: {
    name: "🌊 QFT Phase Accumulation - Hierarchical Structure",
    equation: (u, v, params) => {
      const n = Math.floor(params.h ?? 4) + 1;
      const qubit_j = Math.floor(u * n);

      const phase_contribution = v * 2 * Math.PI;
      const accumulated_phase = (phase_contribution / (2 ** (qubit_j + 1)));

      // Helical tower with discrete levels for each qubit
      const level_height = (params.e ?? 2) / n;
      const base_height = qubit_j * level_height;
      const level_progress = (u * n) - qubit_j;
      const height = base_height + level_progress * level_height;

      const radius = params.d ?? 2;
      const helix_angle = accumulated_phase + u * 2 * Math.PI;

      const x = radius * Math.cos(helix_angle);
      const y = radius * Math.sin(helix_angle);
      const z = height;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 2, h: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // ============================================================================
  // 7. QUANTUM APPROXIMATE OPTIMIZATION (QAOA) - Discrete Optimization
  // ============================================================================

  qaoa_optimization_trajectory: {
    name: "🎯 QAOA Optimization Trajectory - Parameter Evolution",
    equation: (u, v, params) => {
      const p = Math.floor(params.h ?? 2) + 1;
      const iteration = u;

      const gamma = iteration * Math.PI;
      const beta = iteration * Math.PI / 2;

      const cost = Math.sin(gamma) * Math.cos(beta);

      // 3D helical path showing parameter optimization
      const helix_angle = iteration * 4 * Math.PI;
      const radius = (params.d ?? 2) * (1 - 0.5 * iteration);  // Converges inward

      // Tube radius varies with cost function
      const tube_radius = 0.2 * (params.e ?? 1) * (1 + cost);
      const tube_angle = v * 2 * Math.PI;

      const x = radius * Math.cos(helix_angle) + tube_radius * Math.cos(tube_angle);
      const y = radius * Math.sin(helix_angle) + tube_radius * Math.sin(tube_angle);
      const z = (params.e ?? 2) * iteration;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 2, h: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  qaoa_cost_landscape: {
    name: "🗻 QAOA Cost Landscape - Combinatorial Surface",
    equation: (u, v, params) => {
      const gamma = u * 2 * Math.PI;
      const beta = v * Math.PI;

      // Multi-frequency interference for dramatic peaks and valleys
      const problem_term = Math.sin(gamma) + 0.3 * Math.sin(3 * gamma);
      const mixer_term = Math.cos(beta) + 0.2 * Math.cos(2 * beta);

      const expectation = problem_term * mixer_term;

      const a = params.d ?? 3;
      const x = a * u - a / 2;
      const y = a * v - a / 2;
      const z = a * expectation * 0.8;

      return [x, y, z];
    },
    defaultParams: { d: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // ============================================================================
  // 8. QUANTUM TIME EVOLUTION - Dynamic Systems
  // ============================================================================

  quantum_time_evolution_trajectory: {
    name: "⏱️ Quantum Time Evolution - State Trajectory",
    equation: (u, v, params) => {
      const time = params.k ?? 0;
      const frequency = params.l ?? 1;

      const theta_0 = Math.PI / 4;
      const phi_0 = 0;

      const theta = theta_0 + 0.3 * Math.sin(2 * Math.PI * frequency * (time + u));
      const phi = phi_0 + 2 * Math.PI * frequency * (time + u);

      const tube_radius = 0.1 * (params.e ?? 1);
      const tube_angle = v * 2 * Math.PI;

      const a = params.d ?? 2;
      const x = a * Math.sin(theta) * Math.cos(phi) + tube_radius * Math.cos(tube_angle) * Math.cos(phi);
      const y = a * Math.sin(theta) * Math.sin(phi) + tube_radius * Math.cos(tube_angle) * Math.sin(phi);
      const z = a * Math.cos(theta) + tube_radius * Math.sin(tube_angle);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, k: 0, l: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 16 }
  },

  trotterization_approximation: {
    name: "⚙️ Trotterization Approximation - Step Evolution",
    equation: (u, v, params) => {
      const n_steps = Math.floor(params.h ?? 5) + 1;
      const step_index = Math.floor(u * n_steps);

      const exact_evolution = Math.sin(u * Math.PI);
      const approx_evolution = Math.sin((step_index / n_steps) * Math.PI);
      const error = exact_evolution - approx_evolution;

      const angle = v * 2 * Math.PI;
      const radius = params.d ?? 2;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (params.e ?? 1) * (exact_evolution + error * 0.5);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, h: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // 9. TENSOR NETWORK STRUCTURES - Hierarchical Representations
  // ============================================================================

  tensor_network_mps: {
    name: "⛓️ Matrix Product State (MPS) - Tensor Chain",
    equation: (u, v, params) => {
      const n = Math.floor(params.h ?? 5) + 1;
      const chi = Math.floor(params.l ?? 2) + 1;

      const site_index = Math.floor(u * n);
      const bond_param = v;

      const bond_strength = Math.sin(bond_param * Math.PI) / chi;

      const a = params.d ?? 2;
      const b = params.e ?? 1;

      const x = a * site_index / n;
      const y = b * bond_strength;
      const z = b * Math.cos(bond_param * Math.PI) * 0.5;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, h: 5, l: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  tensor_network_peps: {
    name: "🕸️ Projected Entangled Pair States (PEPS) - 2D Network",
    equation: (u, v, params) => {
      const grid_size = Math.floor(params.h ?? 4) + 2;

      const i = Math.floor(u * grid_size);
      const j = Math.floor(v * grid_size);

      const entanglement_x = Math.sin(i * Math.PI / grid_size);
      const entanglement_y = Math.sin(j * Math.PI / grid_size);
      const local_tensor = entanglement_x * entanglement_y;

      const a = params.d ?? 2;
      const x = a * (i / grid_size - 0.5);
      const y = a * (j / grid_size - 0.5);
      const z = (params.e ?? 1) * local_tensor;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, h: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // ============================================================================
  // 10. OPTIMIZATION ALGORITHMS - Landscape Navigation
  // ============================================================================

  nelder_mead_simplex: {
    name: "🔺 Nelder-Mead Simplex - Derivative-Free Optimization",
    equation: (u, v, params) => {
      const iteration = params.k ?? 0;
      const n_vertices = 3;

      const vertex_index = Math.floor(u * n_vertices);
      const param_index = v;

      const base_x = vertex_index * 0.5;
      const base_y = param_index * 0.5;

      const shrink_factor = Math.exp(-iteration * 0.1);

      const a = params.d ?? 2;
      const x = a * (base_x - 0.5) * shrink_factor;
      const y = a * (base_y - 0.5) * shrink_factor;
      const z = (params.e ?? 1) * Math.sin(base_x * Math.PI) * Math.cos(base_y * Math.PI);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, k: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  adam_optimizer_trajectory: {
    name: "🚀 Adam Optimizer Trajectory - Adaptive Learning",
    equation: (u, v, params) => {
      const iteration = u;
      const beta1 = params.i ?? 0.9;
      const beta2 = params.j ?? 0.999;

      const momentum = (1 - beta1 ** iteration) / (1 - beta1);
      const variance = (1 - beta2 ** iteration) / (1 - beta2);

      const adaptive_step = momentum / (Math.sqrt(variance) + 1e-8);

      const angle = v * 2 * Math.PI;
      const radius = (params.d ?? 2) * adaptive_step;

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = (params.e ?? 1) * iteration;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, i: 0.9, j: 0.999, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ============================================================================
  // 11. QUANTUM NOISE AND DECOHERENCE - Error Visualization
  // ============================================================================

  decoherence_trajectory: {
    name: "💫 Decoherence Trajectory - State Decay",
    equation: (u, v, params) => {
      const time = u;
      const decoherence_rate = params.j ?? 0.1;

      const coherence = Math.exp(-decoherence_rate * time * 10);

      const theta = Math.PI / 4;
      const phi = 2 * Math.PI * time;

      const tube_radius = 0.1 * (params.e ?? 1) * (1 - coherence);
      const tube_angle = v * 2 * Math.PI;

      const a = params.d ?? 2;
      const radius = a * coherence;

      const x = radius * Math.sin(theta) * Math.cos(phi) + tube_radius * Math.cos(tube_angle);
      const y = radius * Math.sin(theta) * Math.sin(phi) + tube_radius * Math.sin(tube_angle);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, j: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 16 }
  },

  noise_channel_effect: {
    name: "📉 Quantum Noise Channel - State Mixing",
    equation: (u, v, params) => {
      const noise_prob = params.j ?? 0.1;

      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const pure_state_radius = params.d ?? 2;
      const mixed_state_radius = pure_state_radius * (1 - noise_prob);

      // Fractal-like perturbations showing noise effects
      const perturbation = noise_prob * 0.3 * (
        Math.sin(5 * theta) * Math.cos(5 * phi) +
        0.3 * Math.sin(10 * theta) * Math.cos(10 * phi)
      );

      const effective_radius = mixed_state_radius + perturbation;

      const x = effective_radius * Math.sin(theta) * Math.cos(phi);
      const y = effective_radius * Math.sin(theta) * Math.sin(phi);
      const z = effective_radius * Math.cos(theta);

      return [x, y, z];
    },
    defaultParams: { d: 2, j: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // ============================================================================
  // 12. QUANTUM MEASUREMENT - Projection and Collapse
  // ============================================================================

  measurement_projection_surface: {
    name: "📏 Quantum Measurement Projection - State Collapse",
    equation: (u, v, params) => {
      const measurement_basis = params.h ?? 0;

      // Cone/funnel shape showing measurement collapse
      const height_param = u;  // 0 at top (pure state), 1 at bottom (measured)
      const angle = v * 2 * Math.PI;

      const basis_angle = measurement_basis * Math.PI / 4;

      // Cone expands from point (superposition) to circle (classical outcomes)
      const a = params.d ?? 2;
      const radius = a * height_param * (1 - 0.3 * Math.cos(basis_angle));

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = a * (1 - height_param);  // Height decreases as we measure

      return [x, y, z];
    },
    defaultParams: { d: 2, h: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  quantum_probability_distribution: {
    name: "📊 Quantum Probability Distribution - Measurement Outcomes",
    equation: (u, v, params) => {
      const n = Math.floor(params.h ?? 3) + 1;
      const N = 2 ** n;

      const outcome = Math.floor(u * N);
      const alpha = params.i ?? 0.5;

      const amplitude_0 = Math.cos(alpha * Math.PI / 2);
      const amplitude_1 = Math.sin(alpha * Math.PI / 2);

      const bit_pattern = outcome.toString(2).padStart(n, '0');
      let probability = 1;
      for (let i = 0; i < n; i++) {
        probability *= (bit_pattern[i] === '0') ? amplitude_0 ** 2 : amplitude_1 ** 2;
      }

      // 3D histogram with rectangular bars
      const bar_width = (2 * Math.PI) / N;
      const bar_angle_start = (outcome / N) * 2 * Math.PI;
      const bar_angle = bar_angle_start + (v * bar_width);

      const radius_inner = (params.d ?? 2) * 0.8;
      const radius_outer = (params.d ?? 2) * 1.0;
      const radius = radius_inner + (v * (radius_outer - radius_inner));

      const x = radius * Math.cos(bar_angle);
      const y = radius * Math.sin(bar_angle);
      const z = (params.e ?? 3) * probability * N;

      return [x, y, z];
    },
    defaultParams: { d: 2, e: 3, h: 3, i: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 }
  }

};

export function getQuantumSurface(name: string): ParametricSurface | undefined {
  return QUANTUM_PARAMETRIC_FUNCTIONS[name];
}

export function getAllQuantumSurfaceNames(): string[] {
  return Object.keys(QUANTUM_PARAMETRIC_FUNCTIONS);
}