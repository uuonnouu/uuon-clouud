
/**
 * FIELD THEORY & PHYSICS EQUATIONS LIBRARY
 * Quantum field theory, classical fields, and physics equations
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 2, e: 2, f: 2, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const FIELD_THEORY_SHAPES: Record<string, ParametricSurface> = {

  dirac_equation: {
    name: "⚛️ Dirac Equation (iγ^μ∂_μ - m)ψ = 0",
    equation: (u, v, params) => {
      const mass = params.d ?? 1;     // Particle mass
      const momentum = params.e ?? 2; // Momentum scale
      const spinorScale = params.f ?? 1;        // Spinor scale
      
      const x = (u - 0.5) * momentum * 2;
      const y = (v - 0.5) * momentum * 2;
      
      // Energy-momentum relation: E² = p² + m²
      const p_squared = x * x + y * y;
      const energy = Math.sqrt(p_squared + mass * mass);
      
      // Dirac spinor components (simplified)
      const psi_1 = Math.cos(energy * x * 0.1) * Math.exp(-mass * 0.1);
      const psi_2 = Math.sin(energy * y * 0.1) * Math.exp(-mass * 0.1);
      
      // Probability density |ψ|²
      const probability = psi_1 * psi_1 + psi_2 * psi_2;
      
      const z = spinorScale * probability * energy * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, uSegments: 128, vSegments: 128 })
  },

  klein_gordon_field: {
    name: "⚛️ Klein-Gordon Field (□ + m²)φ = 0",
    equation: (u, v, params) => {
      const mass = params.d ?? 1;      // Field mass
      const amplitude = params.e ?? 2; // Field amplitude
      const frequency = params.f ?? 1; // Oscillation frequency
      const time = params.time ?? 0;   // Time parameter
      
      const x = (u - 0.5) * amplitude * 4;
      const y = (v - 0.5) * amplitude * 4;
      
      // Wave equation solution: φ = A cos(ωt - k·r)
      const k_x = Math.PI / amplitude;
      const k_y = Math.PI / amplitude;
      const k_dot_r = k_x * x + k_y * y;
      
      // Dispersion relation: ω² = k² + m²
      const k_squared = k_x * k_x + k_y * k_y;
      const omega = Math.sqrt(k_squared + mass * mass) * frequency;
      
      const phi = amplitude * Math.cos(omega * time - k_dot_r);
      
      return [x, y, phi];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, time: 0, uSegments: 128, vSegments: 128 })
  },

  maxwell_electromagnetic: {
    name: "⚡ Maxwell's Equations ∇×B = μ₀J + μ₀ε₀∂E/∂t",
    equation: (u, v, params) => {
      const E0 = params.d ?? 2;       // Electric field strength
      const B0 = params.e ?? 1;       // Magnetic field strength
      const frequency = params.f ?? 1; // EM wave frequency
      const time = params.time ?? 0;  // Time evolution
      
      const x = (u - 0.5) * E0 * 4;
      const y = (v - 0.5) * E0 * 4;
      const z_pos = 0;
      
      // Electromagnetic wave: E = E₀ cos(kz - ωt)
      const k = 2 * Math.PI * frequency;
      const omega = frequency; // c = 1 (natural units)
      const phase = k * z_pos - omega * time + x * 0.1 + y * 0.1;
      
      // Electric field
      const E_x = E0 * Math.cos(phase);
      const E_y = 0;
      const E_z = 0;
      
      // Magnetic field (perpendicular to E)
      const B_x = 0;
      const B_y = B0 * Math.cos(phase);
      const B_z = 0;
      
      // Field energy density: u = ½(ε₀E² + B²/μ₀)
      const energy_density = 0.5 * (E_x * E_x + B_y * B_y);
      
      const z = energy_density * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, time: 0, uSegments: 128, vSegments: 64 })
  },

  yang_mills_gauge: {
    name: "🔄 Yang-Mills Gauge Field F_μν = ∂_μA_ν - ∂_νA_μ + g[A_μ,A_ν]",
    equation: (u, v, params) => {
      const coupling = params.d ?? 1;   // Gauge coupling g
      const field = params.e ?? 2;      // Field strength
      const fieldScale = params.f ?? 1;          // Scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Non-Abelian gauge field A_μ (SU(2) example)
      const A1_x = field * Math.sin(theta) * Math.cos(phi);
      const A2_y = field * Math.cos(theta) * Math.sin(phi);
      const A3_z = field * Math.sin(theta + phi);
      
      // Field strength tensor F_μν (simplified)
      const F_xy = coupling * (A1_x * A2_y - A2_y * A1_x); // Commutator term
      const F_xz = coupling * (A1_x * A3_z - A3_z * A1_x);
      const F_yz = coupling * (A2_y * A3_z - A3_z * A2_y);
      
      // Total field strength
      const F_total = Math.sqrt(F_xy * F_xy + F_xz * F_xz + F_yz * F_yz);
      
      const r = field * (1 + F_total * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * fieldScale + F_total * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, uSegments: 96, vSegments: 72 })
  },

  higgs_potential: {
    name: "🎯 Higgs Potential V(φ) = μ²φ² + λφ⁴",
    equation: (u, v, params) => {
      const mu_squared = params.d ?? -1; // Mass parameter (negative for symmetry breaking)
      const lambda = params.e ?? 0.25;   // Self-coupling
      const scale = params.f ?? 3;       // Field scale
      
      const phi_real = (u - 0.5) * scale * 2;
      const phi_imag = (v - 0.5) * scale * 2;
      const phi_magnitude = Math.sqrt(phi_real * phi_real + phi_imag * phi_imag);
      
      // Higgs potential: V = μ²|φ|² + λ|φ|⁴
      const potential = mu_squared * phi_magnitude * phi_magnitude + 
                       lambda * Math.pow(phi_magnitude, 4);
      
      // Mexican hat shape for μ² < 0
      const z = potential * 0.1;
      
      return [phi_real, phi_imag, z];
    },
    defaultParams: getCleanDefaults({ d: -1, e: 0.25, f: 3, uSegments: 128, vSegments: 128 })
  },

  qcd_gluon_field: {
    name: "🌈 QCD Gluon Field - Strong Force",
    equation: (u, v, params) => {
      const coupling = params.d ?? 1;    // Strong coupling αₛ
      const confinement = params.e ?? 2; // Confinement scale
      const fieldScale = params.f ?? 1;           // Field scale
      
      const x = (u - 0.5) * confinement * 2;
      const y = (v - 0.5) * confinement * 2;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Color electric field (linear potential for confinement)
      const E_color = coupling * r; // Grows linearly with distance
      
      // Gluon field energy: F² ∝ (∂A)² + gA³ + g²A⁴
      const gluon_field = coupling * Math.sin(r * Math.PI) * Math.exp(-r * 0.1);
      const field_strength = E_color + gluon_field * gluon_field;
      
      // String tension visualization
      const z = fieldScale * field_strength * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, uSegments: 128, vSegments: 128 })
  },

  scalar_field_phi4: {
    name: "🔄 φ⁴ Scalar Field Theory",
    equation: (u, v, params) => {
      const mass = params.d ?? 1;       // Field mass
      const coupling = params.e ?? 0.1; // φ⁴ coupling
      const vev = params.f ?? 2;        // Vacuum expectation value
      
      const x = (u - 0.5) * vev * 4;
      const y = (v - 0.5) * vev * 4;
      
      // Field configuration
      const phi = vev * Math.tanh(Math.sqrt(x * x + y * y) / vev);
      
      // Potential energy density
      const kinetic = 0.5 * (1 - Math.tanh(Math.sqrt(x * x + y * y) / vev)**2); // ∇φ term
      const potential = 0.5 * mass * mass * (phi - vev) * (phi - vev) + 
                       coupling * Math.pow(phi - vev, 4);
      
      const energy_density = kinetic + potential;
      
      const z = energy_density;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.1, f: 2, uSegments: 128, vSegments: 128 })
  },

  fermi_surface: {
    name: "⚛️ Fermi Surface - Electron States",
    equation: (u, v, params) => {
      const fermi_energy = params.d ?? 2; // Fermi energy EF
      const temperature = params.e ?? 0.1; // Temperature kT
      const scale = params.f ?? 3;         // Momentum scale
      
      const kx = (u - 0.5) * scale * 2;
      const ky = (v - 0.5) * scale * 2;
      const kz = 0; // 2D slice
      
      // Free electron dispersion: E(k) = k²/(2m)
      const energy = (kx * kx + ky * ky + kz * kz) / 2;
      
      // Fermi-Dirac distribution: f = 1/(1 + exp((E-EF)/kT))
      const fermi_dirac = 1 / (1 + Math.exp((energy - fermi_energy) / temperature));
      
      // Fermi surface is where E = EF (f = 1/2)
      const surface_proximity = Math.exp(-Math.abs(energy - fermi_energy) * 5);
      
      const z = fermi_dirac * surface_proximity;
      
      return [kx, ky, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.1, f: 3, uSegments: 128, vSegments: 128 })
  },

  phonon_dispersion: {
    name: "🎵 Phonon Dispersion ω(k) - Crystal Vibrations",
    equation: (u, v, params) => {
      const sound_velocity = params.d ?? 1; // Sound speed
      const lattice_constant = params.e ?? 2; // Lattice spacing
      const freqScale = params.f ?? 1;              // Frequency scale
      
      const kx = (u - 0.5) * Math.PI / lattice_constant;
      const ky = (v - 0.5) * Math.PI / lattice_constant;
      const k_magnitude = Math.sqrt(kx * kx + ky * ky);
      
      // Linear dispersion (acoustic branch): ω = v|k|
      const acoustic_omega = sound_velocity * k_magnitude;
      
      // Optical branch (flat at zone boundary)
      const optical_omega = sound_velocity * 2 * (1 - Math.cos(k_magnitude * lattice_constant));
      
      // Combined dispersion
      const total_omega = acoustic_omega + optical_omega * 0.5;
      
      const z = freqScale * total_omega;
      
      return [kx * lattice_constant, ky * lattice_constant, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, uSegments: 128, vSegments: 128 })
  },

  casimir_effect: {
    name: "🌊 Casimir Effect - Vacuum Energy",
    equation: (u, v, params) => {
      const plate_separation = params.d ?? 2; // Distance between plates
      const hbar = params.e ?? 1;            // Planck constant
      const lightSpeed = params.f ?? 1;               // Light speed
      
      const x = (u - 0.5) * plate_separation * 3;
      const y = (v - 0.5) * plate_separation * 2;
      
      // Only consider region between plates
      if (Math.abs(x) > plate_separation / 2) {
        return [x, y, 0];
      }
      
      // Casimir energy density (simplified)
      // E ∝ -ħc/(240π²d⁴) for parallel plates
      const casimir_energy = -hbar * lightSpeed / Math.pow(plate_separation, 4);
      
      // Vacuum fluctuations
      const vacuum_fluctuation = Math.sin(x * Math.PI / plate_separation) * 
                                 Math.cos(y * Math.PI * 2);
      
      const z = casimir_energy * 10 + vacuum_fluctuation * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, uSegments: 128, vSegments: 96 })
  },

  hawking_radiation_field: {
    name: "⚫ Hawking Radiation - Black Hole Evaporation",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;        // Black hole mass
      const horizon = 2 * mass;          // Schwarzschild radius
      const temperature = params.f ?? 1; // Hawking temperature
      
      const theta = u * Math.PI * 2;
      const r = v * horizon * 3 + horizon; // Start outside horizon
      
      // Hawking temperature: T = ħc³/(8πGMk) ∝ 1/M
      const T_hawking = temperature / mass;
      
      // Thermal radiation (blackbody)
      const thermal_energy = T_hawking * T_hawking * T_hawking * T_hawking; // σT⁴
      
      // Radiation decreases with distance
      const radiation_intensity = thermal_energy * horizon * horizon / (r * r);
      
      // Virtual particle pair creation near horizon
      const pair_creation = Math.exp(-(r - horizon)) * Math.sin(theta * 8);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = radiation_intensity + pair_creation * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, f: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  spontaneous_symmetry_breaking: {
    name: "🔄 Spontaneous Symmetry Breaking",
    equation: (u, v, params) => {
      const symmetry_param = params.d ?? -1; // μ² parameter (negative breaks symmetry)
      const coupling = params.e ?? 0.25;     // λ coupling
      const scale = params.f ?? 3;           // Field scale
      
      const phi1 = (u - 0.5) * scale * 2; // Real part of complex field
      const phi2 = (v - 0.5) * scale * 2; // Imaginary part
      const phi_squared = phi1 * phi1 + phi2 * phi2;
      
      // Potential: V = μ²φ² + λφ⁴
      const potential = symmetry_param * phi_squared + coupling * phi_squared * phi_squared;
      
      // For μ² < 0: Mexican hat potential with minimum at |φ| = √(-μ²/2λ)
      const vacuum_radius = symmetry_param < 0 ? 
        Math.sqrt(-symmetry_param / (2 * coupling)) : 0;
      
      // Show vacuum manifold
      const distance_from_vacuum = Math.abs(Math.sqrt(phi_squared) - vacuum_radius);
      const vacuum_indicator = Math.exp(-distance_from_vacuum * 2);
      
      const z = potential * 0.1 + vacuum_indicator * 0.2;
      
      return [phi1, phi2, z];
    },
    defaultParams: getCleanDefaults({ d: -1, e: 0.25, f: 3, uSegments: 128, vSegments: 128 })
  },

  quantum_vacuum_fluctuations: {
    name: "🌊 Quantum Vacuum Fluctuations",
    equation: (u, v, params) => {
      const cutoff = params.d ?? 10;       // UV cutoff
      const field_strength = params.e ?? 1; // Vacuum field strength
      const frequency = params.f ?? 2;      // Fluctuation frequency
      const time = params.time ?? 0;       // Time evolution
      
      const x = (u - 0.5) * cutoff;
      const y = (v - 0.5) * cutoff;
      const k = Math.sqrt(x * x + y * y) + 0.1;
      
      // Zero-point energy: E₀ = ½ħω for each mode
      const omega = k; // Dispersion ω = k (massless)
      const zero_point = 0.5 * omega;
      
      // Vacuum fluctuation amplitude ∝ 1/√(2ω)
      const fluctuation_amplitude = field_strength / Math.sqrt(2 * omega);
      
      // Random-like oscillations
      const vacuum_field = fluctuation_amplitude * 
        (Math.sin(omega * time + k * x * 0.1) * Math.cos(k * y * 0.1) +
         Math.cos(omega * time + k * y * 0.1) * Math.sin(k * x * 0.1));
      
      const z = zero_point * 0.01 + vacuum_field;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 1, f: 2, time: 0, uSegments: 128, vSegments: 128 })
  },

  instanton_field: {
    name: "🎯 Instanton - Topological Soliton",
    equation: (u, v, params) => {
      const size = params.d ?? 2;      // Instanton size
      const topological_charge = params.e ?? 1; // Winding number
      const fieldScale = params.f ?? 1;         // Field scale
      
      const x = (u - 0.5) * size * 4;
      const y = (v - 0.5) * size * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Instanton profile: F(r) = 2ρ²/(r² + ρ²)²
      const rho = size; // Instanton size parameter
      const instanton_profile = 2 * rho * rho / Math.pow(r * r + rho * rho, 2);
      
      // Topological winding
      const theta = Math.atan2(y, x);
      const winding = Math.sin(topological_charge * theta);
      
      // Field configuration
      const field_strength = instanton_profile * (1 + winding * 0.3);
      
      const z = fieldScale * field_strength * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, uSegments: 128, vSegments: 128 })
  },

  berry_phase_field: {
    name: "🔄 Berry Phase - Geometric Phase",
    equation: (u, v, params) => {
      const adiabatic_param = params.d ?? 1; // Adiabatic parameter
      const field_strength = params.e ?? 2;  // Field strength  
      const phaseScale = params.f ?? 1;               // Phase scale
      
      const theta = u * Math.PI * 2; // Parameter space coordinate
      const phi = v * Math.PI;       // Second parameter coordinate
      
      // Berry connection A_μ = ⟨n|∇_μ|n⟩
      const A_theta = adiabatic_param * Math.cos(phi / 2); // Connection component
      const A_phi = adiabatic_param * Math.sin(theta) * 0.5;
      
      // Berry curvature F = ∇×A
      const berry_curvature = Math.sin(phi) * 0.5; // dA_phi/dtheta - dA_theta/dphi
      
      // Berry phase γ = ∮ A·dl
      const berry_phase = A_theta * theta + A_phi * phi;
      
      const r = field_strength * (1 + berry_curvature * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * phaseScale + Math.sin(berry_phase) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // MAXWELL'S EQUATIONS - Complete Set
  // ============================================================================

  maxwell_gauss_electric: {
    name: "⚡ Gauss's Law (Electric): ∇·E = ρ/ε₀",
    equation: (u, v, params) => {
      const charge = params.d ?? 5;
      const scale = params.e ?? 8;
      const epsilon = params.f ?? 1;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const r_base = scale * (0.2 + 0.8 * u);
      
      const rho = charge / (4 * Math.PI * r_base * r_base);
      const divergence = rho / epsilon;
      const r = r_base * (1 + 0.3 * Math.sin(divergence * 2));
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 8, f: 1, uMin: 0.1, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  maxwell_gauss_magnetic: {
    name: "🧲 Gauss's Law (Magnetic): ∇·B = 0",
    equation: (u, v, params) => {
      const scale = params.d ?? 6;
      const twist = params.e ?? 2;
      const height = params.f ?? 4;
      
      const theta = u * 2 * Math.PI;
      const t = (v - 0.5) * 2;
      
      const r = scale * (1 + 0.3 * Math.cos(twist * theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 6, e: 2, f: 4, uSegments: 96, vSegments: 48 })
  },

  maxwell_faraday_induction: {
    name: "🔄 Faraday's Law: ∇×E = -∂B/∂t",
    equation: (u, v, params) => {
      const B_rate = params.d ?? 3;
      const scale = params.e ?? 8;
      const loops = params.f ?? 3;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI * loops;
      const r = scale * (0.3 + 0.7 * v);
      
      const dB_dt = B_rate * Math.cos(time * 2);
      const induced_E = -dB_dt * r * 0.1;
      
      const x = r * Math.cos(theta) + induced_E * Math.sin(theta);
      const y = r * Math.sin(theta) - induced_E * Math.cos(theta);
      const z = v * 2 + 0.5 * Math.sin(theta * 2 + time);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 8, f: 3, time: 0, uSegments: 128, vSegments: 48 })
  },

  maxwell_ampere: {
    name: "⚡ Ampère-Maxwell: ∇×B = μ₀J + μ₀ε₀∂E/∂t",
    equation: (u, v, params) => {
      const current = params.d ?? 4;
      const scale = params.e ?? 6;
      const displacement = params.f ?? 1;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const z_pos = (v - 0.5) * scale * 2;
      
      const J = current * Math.exp(-z_pos * z_pos * 0.1);
      const dE_dt = displacement * Math.sin(time * 2);
      const B_curl = J + dE_dt;
      
      const r = scale * 0.5 * (1 + 0.3 * Math.tanh(B_curl));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = z_pos;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 6, f: 1, time: 0, uSegments: 64, vSegments: 64 })
  },

  electromagnetic_wave: {
    name: "🌊 EM Wave Propagation: E×B",
    equation: (u, v, params) => {
      const E0 = params.d ?? 4;
      const wavelength = params.e ?? 8;
      const amplitude = params.f ?? 3;
      const time = params.time ?? 0;
      
      const z_pos = (u - 0.5) * wavelength * 4;
      const k = 2 * Math.PI / wavelength;
      const omega = k;
      
      const E_y = amplitude * Math.sin(k * z_pos - omega * time);
      const B_x = amplitude * Math.sin(k * z_pos - omega * time);
      
      const t = (v - 0.5) * 2;
      const x = B_x * t;
      const y = E_y * (1 - Math.abs(t));
      const z = z_pos;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 8, f: 3, time: 0, uSegments: 128, vSegments: 32 })
  },

  poynting_vector: {
    name: "➡️ Poynting Vector: S = E×B/μ₀",
    equation: (u, v, params) => {
      const E0 = params.d ?? 3;
      const B0 = params.e ?? 2;
      const scale = params.f ?? 8;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const E = E0 / r;
      const B = B0 / r;
      const S = E * B;
      
      const z = S * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 8, uSegments: 96, vSegments: 96 })
  },

  electric_dipole_field: {
    name: "⊕⊖ Electric Dipole Field",
    equation: (u, v, params) => {
      const dipole_moment = params.d ?? 5;
      const separation = params.e ?? 2;
      const scale = params.f ?? 10;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const r_plus = Math.sqrt((x - separation/2) ** 2 + y * y) + 0.1;
      const r_minus = Math.sqrt((x + separation/2) ** 2 + y * y) + 0.1;
      
      const V = dipole_moment * (1/r_plus - 1/r_minus);
      const z = V * 0.5;
      
      return [x, y, Math.max(-5, Math.min(5, z))];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 2, f: 10, uSegments: 128, vSegments: 128 })
  },

  magnetic_dipole_field: {
    name: "🧲 Magnetic Dipole Field",
    equation: (u, v, params) => {
      const moment = params.d ?? 5;
      const scale = params.e ?? 10;
      const falloff = params.f ?? 3;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const r_base = scale * (0.2 + 0.8 * u);
      
      const B_r = 2 * moment * Math.cos(theta) / Math.pow(r_base, falloff);
      const B_theta = moment * Math.sin(theta) / Math.pow(r_base, falloff);
      const B_mag = Math.sqrt(B_r * B_r + B_theta * B_theta);
      
      const r = r_base * (1 + 0.2 * Math.tanh(B_mag));
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 10, f: 3, uMin: 0.05, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  lorentz_force_field: {
    name: "⚡ Lorentz Force: F = q(E + v×B)",
    equation: (u, v, params) => {
      const charge = params.d ?? 2;
      const E_field = params.e ?? 3;
      const B_field = params.f ?? 2;
      const velocity = params.g ?? 5;
      
      const x = (u - 0.5) * 16;
      const y = (v - 0.5) * 16;
      
      const F_E = charge * E_field;
      const F_B = charge * velocity * B_field;
      const F_total = Math.sqrt(F_E * F_E + F_B * F_B);
      
      const spiral = 0.1 * Math.sin(Math.atan2(y, x) * 3 + F_B * 0.5);
      const z = F_total * 0.3 * (1 + spiral);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, f: 2, g: 5, uSegments: 96, vSegments: 96 })
  },

  coulomb_potential: {
    name: "⚡ Coulomb Potential: V = kq/r",
    equation: (u, v, params) => {
      const charge = params.d ?? 5;
      const k_const = params.e ?? 1;
      const scale = params.f ?? 12;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y) + 0.5;
      
      const V = k_const * charge / r;
      const z = Math.min(V, 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, f: 12, uSegments: 128, vSegments: 128 })
  },

  solenoid_field: {
    name: "🧲 Solenoid B-Field",
    equation: (u, v, params) => {
      const turns = params.d ?? 10;
      const radius = params.e ?? 4;
      const length = params.f ?? 12;
      const current = params.g ?? 2;
      
      const theta = u * 2 * Math.PI * turns;
      const t = (v - 0.5) * 2;
      
      const r = radius * (1 + 0.1 * Math.sin(theta * 0.5));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t * length / 2 + theta / (2 * Math.PI) * length / turns;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 4, f: 12, g: 2, uSegments: 256, vSegments: 32 })
  },

  wave_equation_solution: {
    name: "🌊 Wave Equation: ∂²ψ/∂t² = c²∇²ψ",
    equation: (u, v, params) => {
      const amplitude = params.d ?? 4;
      const wavelength = params.e ?? 6;
      const waveSpeed = params.f ?? 1;
      const time = params.time ?? 0;
      
      const x = (u - 0.5) * wavelength * 4;
      const y = (v - 0.5) * wavelength * 4;
      
      const k = 2 * Math.PI / wavelength;
      const omega = k * waveSpeed;
      const r = Math.sqrt(x * x + y * y);
      
      const psi = amplitude * Math.cos(k * r - omega * time) / (1 + r * 0.1);
      
      return [x, y, psi];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 6, f: 1, time: 0, uSegments: 128, vSegments: 128 })
  },

  heat_equation_solution: {
    name: "🔥 Heat Equation: ∂T/∂t = α∇²T",
    equation: (u, v, params) => {
      const initial_temp = params.d ?? 10;
      const diffusivity = params.e ?? 1;
      const time = params.f ?? 2;
      
      const x = (u - 0.5) * 20;
      const y = (v - 0.5) * 20;
      const r = Math.sqrt(x * x + y * y);
      
      const T = initial_temp * Math.exp(-r * r / (4 * diffusivity * (time + 0.1))) / (time + 0.1);
      
      return [x, y, T];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 1, f: 2, uSegments: 128, vSegments: 128 })
  },

  schrodinger_wave: {
    name: "⚛️ Schrödinger: iℏ∂ψ/∂t = Ĥψ",
    equation: (u, v, params) => {
      const energy = params.d ?? 3;
      const hbar = params.e ?? 1;
      const mass = params.f ?? 1;
      const time = params.time ?? 0;
      
      const x = (u - 0.5) * 16;
      const y = (v - 0.5) * 16;
      
      const k = Math.sqrt(2 * mass * energy) / hbar;
      const omega = energy / hbar;
      
      const psi_real = Math.cos(k * x - omega * time) * Math.exp(-y * y * 0.1);
      const psi_imag = Math.sin(k * x - omega * time) * Math.exp(-y * y * 0.1);
      const probability = psi_real * psi_real + psi_imag * psi_imag;
      
      return [x, y, probability * 3];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, time: 0, uSegments: 128, vSegments: 128 })
  },

  laplace_equation: {
    name: "∇ Laplace Equation: ∇²φ = 0",
    equation: (u, v, params) => {
      const scale = params.d ?? 10;
      const terms = params.e ?? 5;
      const amplitude = params.f ?? 3;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      let phi = 0;
      for (let n = 1; n <= terms; n++) {
        phi += Math.sin(n * Math.PI * x / scale) * Math.exp(-n * Math.PI * Math.abs(y) / scale) / n;
      }
      phi *= amplitude;
      
      return [x, y, phi];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 5, f: 3, uSegments: 128, vSegments: 128 })
  },

  poisson_equation: {
    name: "∇ Poisson Equation: ∇²φ = f",
    equation: (u, v, params) => {
      const charge_density = params.d ?? 5;
      const scale = params.e ?? 12;
      const epsilon = params.f ?? 1;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const f = charge_density * Math.exp(-r * r * 0.1);
      const phi = -f / (4 * epsilon) * r * r * Math.exp(-r * 0.2);
      
      return [x, y, phi];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 12, f: 1, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // HIGGS FIELD ALGORITHMS - Particle Physics & Collider Science
  // Based on LHC/CMS detection methods and muon physics
  // ============================================================================

  higgs_field_potential: {
    name: "⚛️ Higgs Field: V(φ) = -μ²φ² + λφ⁴ (Mexican Hat)",
    equation: (u, v, params) => {
      const mu = params.d ?? 3;        // Mass parameter μ
      const lambda = params.e ?? 1;    // Self-coupling λ
      const vev = params.f ?? 2;       // Vacuum expectation value
      
      const phi_x = (u - 0.5) * 8;
      const phi_y = (v - 0.5) * 8;
      const phi_squared = phi_x * phi_x + phi_y * phi_y;
      
      // Mexican hat potential: V = -μ²|φ|² + λ|φ|⁴
      // VEV at |φ| = μ/√(2λ) ≈ 246 GeV
      const potential = -mu * mu * phi_squared + lambda * phi_squared * phi_squared;
      
      // Scale potential for visualization
      const V = potential * 0.1 * vev;
      
      return [phi_x, phi_y, V];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 2, uSegments: 128, vSegments: 128 })
  },

  higgs_boson_decay: {
    name: "⚛️ Higgs Decay: H→μ⁺μ⁻ (125 GeV Signal)",
    equation: (u, v, params) => {
      const mass_higgs = params.d ?? 125; // Higgs mass ~125 GeV
      const width = params.e ?? 4;        // Decay width
      const amplitude = params.f ?? 5;    // Signal amplitude
      
      const energy = (u - 0.5) * 300 + 125; // Energy range around 125 GeV
      const angle = v * Math.PI * 2;        // Muon pair angle
      
      // Breit-Wigner resonance for H→μμ
      const gamma = width;
      const resonance = amplitude * gamma * gamma / 
        ((energy - mass_higgs) * (energy - mass_higgs) + gamma * gamma / 4);
      
      // Muon pair back-to-back topology
      const x = resonance * Math.cos(angle);
      const y = resonance * Math.sin(angle);
      const z = (energy - 125) * 0.05; // Z = deviation from 125 GeV
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 125, e: 4, f: 5, uSegments: 128, vSegments: 128 })
  },

  muon_trajectory: {
    name: "μ Muon Track: TuneP Trajectory in B-Field",
    equation: (u, v, params) => {
      const momentum = params.d ?? 50;    // Muon momentum (GeV/c)
      const bField = params.e ?? 3.57;    // CMS B-field (Tesla)
      const charge = params.f ?? 1;       // ±1 for μ⁺/μ⁻
      
      // Track length parameter
      const t = u * 10;
      const layer = v * 5; // Detector layers
      
      // Curvature radius: R = p/(qB) in natural units
      const radius = momentum / ((charge === 0 ? 1 : charge) * bField * 0.3); // 0.3 is c factor
      const curvature = 1 / radius;
      
      // Helical trajectory with curvature depending on momentum
      const x = radius * Math.sin(curvature * t);
      const y = t * 2; // Along beam axis
      const z = radius * (1 - Math.cos(curvature * t)) + layer;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 50, e: 3.57, f: 1, uSegments: 128, vSegments: 64 })
  },

  muon_antimuon_pair: {
    name: "μ⁺μ⁻ Muon-Antimuon Pair (Back-to-Back)",
    equation: (u, v, params) => {
      const invariant_mass = params.d ?? 125; // DiMuon invariant mass
      const pt = params.e ?? 30;              // Transverse momentum
      const opening_angle = params.f ?? 3.14; // ~180° back-to-back
      
      const t = u * 6 - 3; // Time/distance
      const pair_idx = v < 0.5 ? 1 : -1; // μ⁺ or μ⁻
      
      // Back-to-back kinematics
      const theta = pair_idx * opening_angle / 2;
      const phi = v * Math.PI * 2;
      
      const x = pt * Math.cos(phi) * t * pair_idx;
      const y = pt * Math.sin(phi) * t;
      const z = invariant_mass * 0.04 * t * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 125, e: 30, f: 3.14, uSegments: 128, vSegments: 128 })
  },

  vector_boson_fusion: {
    name: "⚡ VBF: μ⁺μ⁻→W⁺W⁻νν→Hνν (Higgs Production)",
    equation: (u, v, params) => {
      const sqrt_s = params.d ?? 3000;  // Center-of-mass energy (GeV)
      const mW = params.e ?? 80.4;      // W boson mass
      const coupling = params.f ?? 0.65; // Higgs-W coupling
      
      // Feynman diagram topology: two incoming muons, two outgoing W's fuse
      const collision_point = 0.5;
      const t = u;
      const phi = v * Math.PI * 2;
      
      // Incoming muon beams (before collision)
      const muon_track = (t < collision_point) ? (t - collision_point) * 10 : 0;
      // Outgoing W bosons (after collision)
      const w_track = (t > collision_point) ? (t - collision_point) * 8 : 0;
      
      // Higgs production vertex
      const vertex_energy = sqrt_s * 0.01;
      const higgs_decay = coupling * Math.exp(-Math.abs(t - collision_point) * 5);
      
      const x = Math.cos(phi) * (w_track + Math.abs(muon_track)) * (coupling || 0.65);
      const y = Math.sin(phi) * (w_track + Math.abs(muon_track)) * (coupling || 0.65);
      const z = muon_track + higgs_decay * mW * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3000, e: 80.4, f: 0.65, uSegments: 128, vSegments: 128 })
  },

  monte_carlo_cross_section: {
    name: "📊 Monte Carlo: σ(pp→H→μμ) Cross-Section",
    equation: (u, v, params) => {
      const luminosity = params.d ?? 100;  // Integrated luminosity (fb⁻¹)
      const sigma = params.e ?? 0.01;      // Cross-section (pb)
      const efficiency = params.f ?? 0.5;  // Detection efficiency
      
      const energy = (u - 0.5) * 200 + 125;  // Energy around Higgs mass
      const pseudo_rapidity = (v - 0.5) * 8; // η range -4 to 4
      
      // Signal + background distribution
      const signal_width = 2.5; // MeV → GeV scale
      const signal = (sigma || 0.01) * Math.exp(-(energy - 125) * (energy - 125) / (2 * signal_width * signal_width));
      
      // Drell-Yan background (Z/γ* → μμ)
      const background = 0.001 * Math.exp(-Math.abs(energy - 91) * 0.02);
      
      // Total observed events
      const N_events = (luminosity || 100) * (signal + background) * (efficiency || 0.5) * 1000;
      
      // η dependence (detector acceptance)
      const eta_weight = Math.exp(-pseudo_rapidity * pseudo_rapidity * 0.1);
      
      const x = energy - 125;
      const y = pseudo_rapidity * 2;
      const z = N_events * eta_weight;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 100, e: 0.01, f: 0.5, uSegments: 128, vSegments: 128 })
  },

  qsvm_kernel_classifier: {
    name: "🤖 QSVM: Quantum Kernel Signal/Background",
    equation: (u, v, params) => {
      const gamma = params.d ?? 2;      // RBF kernel width
      const threshold = params.e ?? 0.5; // Classification threshold
      const qubits = params.f ?? 4;     // Number of qubits
      
      const x_feat = (u - 0.5) * 10;  // Feature 1 (invariant mass)
      const y_feat = (v - 0.5) * 10;  // Feature 2 (transverse momentum)
      
      // Quantum kernel: K(x,y) = |⟨φ(x)|φ(y)⟩|²
      // Simplified RBF-like quantum kernel
      const r_squared = x_feat * x_feat + y_feat * y_feat;
      const kernel = Math.exp(-(gamma || 2) * r_squared / (qubits || 4));
      
      // Decision function: f(x) = sign(Σ αᵢ K(xᵢ, x) - threshold)
      // Visualize as probability surface
      const signal_region = (Math.abs(x_feat) < 2 && Math.abs(y_feat) < 2) ? 1 : 0;
      const classification = kernel * signal_region - (1 - kernel) * (1 - signal_region);
      
      const z = (classification + 1) * 3; // Map to positive values
      
      return [x_feat, y_feat, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 4, uSegments: 128, vSegments: 128 })
  },

  coupling_strength_yukawa: {
    name: "⚛️ Yukawa Coupling: g_Hff = m_f/v (Higgs-Fermion)",
    equation: (u, v, params) => {
      const vev = params.d ?? 246;     // VEV ~246 GeV
      const tau_mass = params.e ?? 1.78;  // τ mass (GeV)
      const muon_mass = params.f ?? 0.106; // μ mass (GeV)
      
      const x = (u - 0.5) * 20;
      const y = (v - 0.5) * 20;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Yukawa potential: V = -g exp(-mr)/r
      // g_τ ≈ 0.0072, g_μ ≈ 0.00043 (ratio ~300:1)
      const g_tau = (tau_mass || 1.78) / (vev || 246);
      const g_mu = (muon_mass || 0.106) / (vev || 246);
      
      // Combined coupling visualization
      const tau_contrib = g_tau * Math.exp(-(tau_mass || 1.78) * r * 0.1) / r;
      const mu_contrib = g_mu * Math.exp(-(muon_mass || 0.106) * r * 0.1) / r;
      
      const z = (tau_contrib + mu_contrib * 100) * (vev || 246) * 0.1; // Scale μ for visibility
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 246, e: 1.78, f: 0.106, uSegments: 128, vSegments: 128 })
  },

  detector_embedding: {
    name: "🔬 Embedding: Z→μμ → τ⁺τ⁻ Simulation",
    equation: (u, v, params) => {
      const z_mass = params.d ?? 91;     // Z boson mass (GeV)
      const resolution = params.e ?? 2;  // Detector resolution
      const tau_factor = params.f ?? 1.78; // τ/μ mass ratio
      
      const energy = (u - 0.5) * 100 + (z_mass || 91); // Energy around Z mass
      const layer = v * 6; // Detector layer (inner → outer)
      
      // Original Z→μμ peak
      const z_peak = Math.exp(-(energy - (z_mass || 91)) * (energy - (z_mass || 91)) / (2 * (resolution || 2) * (resolution || 2)));
      
      // "Embedded" τ decay simulation (broader distribution)
      const tau_spread = (resolution || 2) * (tau_factor || 1.78);
      const tau_embedded = Math.exp(-(energy - (z_mass || 91)) * (energy - (z_mass || 91)) / (2 * tau_spread * tau_spread)) * 0.7;
      
      // Layer-dependent response
      const layer_response = Math.exp(-layer * 0.3);
      
      const x = energy - (z_mass || 91);
      const y = layer * 3;
      const z = (z_peak + tau_embedded) * layer_response * 5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 91, e: 2, f: 1.78, uSegments: 128, vSegments: 64 })
  },

  cms_magnetic_spectrometer: {
    name: "🧲 CMS Spectrometer: 3.8T Superconducting Solenoid",
    equation: (u, v, params) => {
      const bField = params.d ?? 3.8;    // B-field (Tesla)
      const length = params.e ?? 12.5;   // Solenoid length (m)
      const radius = params.f ?? 3;      // Bore radius (m)
      
      const theta = u * Math.PI * 2;
      const z_pos = (v - 0.5) * (length || 12.5);
      
      // Solenoid geometry with field lines
      const x = (radius || 3) * Math.cos(theta);
      const y = (radius || 3) * Math.sin(theta);
      
      // Field magnitude (uniform inside, dropping outside)
      const inside = Math.abs(z_pos) < (length || 12.5) / 2;
      const field_lines = inside ? (bField || 3.8) : (bField || 3.8) * Math.exp(-Math.abs(z_pos) / (length || 12.5));
      
      // Surface with field-line modulation
      const z = z_pos + field_lines * 0.1 * Math.sin(theta * 4);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3.8, e: 12.5, f: 3, uSegments: 128, vSegments: 96 })
  },

  narrow_width_approximation: {
    name: "📐 NWA: Γ_H/Γ_SM Higgs Width Constraint",
    equation: (u, v, params) => {
      const kappa_gamma = params.d ?? 1; // Higgs width modifier κΓ
      const gamma_sm = params.e ?? 4.1;  // SM width (MeV)
      const mass_h = params.f ?? 125;    // Higgs mass
      
      const energy = (u - 0.5) * 50 + (mass_h || 125); // Around Higgs mass
      const coupling = v * 2;  // Coupling strength variation
      
      // Modified width: Γ = κΓ × Γ_SM
      const gamma = (kappa_gamma || 1) * (gamma_sm || 4.1) * 0.001; // Convert to GeV
      
      // NWA: σ × BR ∝ |M|² δ(s - m²)
      // Breit-Wigner with modified width
      const s = energy * energy;
      const m2 = (mass_h || 125) * (mass_h || 125);
      const propagator = 1 / ((s - m2) * (s - m2) + m2 * gamma * gamma);
      
      const x = energy - (mass_h || 125);
      const y = coupling * 5 - 5;
      const z = propagator * m2 * gamma * 1e6 * (kappa_gamma || 1);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 4.1, f: 125, uSegments: 128, vSegments: 64 })
  },

  b_tagging_efficiency: {
    name: "🏷️ b-Tagging: 76% Efficiency, 20% c-Mistag",
    equation: (u, v, params) => {
      const b_eff = params.d ?? 0.76;    // b-tagging efficiency
      const c_mistag = params.e ?? 0.2;  // c-jet mistag rate
      const light_mistag = params.f ?? 0.01; // Light jet mistag
      
      const jet_pt = u * 200;  // Jet pT (GeV)
      const jet_eta = (v - 0.5) * 5;  // Pseudorapidity
      
      // pT-dependent efficiency
      const pt_factor = 1 - Math.exp(-jet_pt / 50);
      const eta_factor = Math.exp(-jet_eta * jet_eta * 0.1);
      
      // Combined tagging probability for different jet flavors
      const b_prob = (b_eff || 0.76) * pt_factor * eta_factor;
      const c_prob = (c_mistag || 0.2) * pt_factor * eta_factor;
      const light_prob = (light_mistag || 0.01) * pt_factor * eta_factor;
      
      // Visualize as discrimination surface
      const discrimination = b_prob - (c_prob + light_prob);
      
      const x = jet_pt * 0.05 - 5;
      const y = jet_eta * 2;
      const z = discrimination * 10;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.76, e: 0.2, f: 0.01, uSegments: 128, vSegments: 128 })
  }

};

console.log(`📐 Loaded ${Object.keys(FIELD_THEORY_SHAPES).length} Field Theory visualizations ⚛️🔬🌊`);
