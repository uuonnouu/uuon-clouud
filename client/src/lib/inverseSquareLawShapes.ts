/**
 * INVERSE SQUARE LAW SHAPES
 * Universal 1/r² field equations across physics domains
 * E = k(q/r²) template that appears in electromagnetism, gravity, waves, quantum mechanics
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

export const INVERSE_SQUARE_LAW_SHAPES: Record<string, ParametricSurface> = {

  coulomb_force_field: {
    name: "⚡ Coulomb's Law F = kq₁q₂/r²",
    equation: (u, v, params) => {
      const q1 = params.d ?? 1;
      const q2 = params.e ?? 1;
      const k_coulomb = params.f ?? 8.99;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const r_squared = x * x + y * y + 0.1;
      const r = Math.sqrt(r_squared);
      
      const force_magnitude = k_coulomb * q1 * q2 / r_squared;
      const z = force_magnitude * 0.1;
      
      return [x, y, Math.min(z, 3)];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 8.99, uSegments: 128, vSegments: 128 })
  },

  electric_field_point_charge: {
    name: "🔌 Electric Field E = kq/r²",
    equation: (u, v, params) => {
      const charge = params.d ?? 1;
      const k_coulomb = params.e ?? 8.99;
      const scale = params.f ?? 2;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r_squared = x * x + y * y + 0.05;
      
      const E_magnitude = k_coulomb * Math.abs(charge) / r_squared;
      const z = E_magnitude * 0.05 * Math.sign(charge);
      
      return [x, y, Math.max(-3, Math.min(z, 3))];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 8.99, f: 2, uSegments: 128, vSegments: 128 })
  },

  electric_potential_scalar: {
    name: "⚡ Electric Potential V = kq/r",
    equation: (u, v, params) => {
      const charge = params.d ?? 1;
      const k_coulomb = params.e ?? 8.99;
      const scale = params.f ?? 2;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const potential = k_coulomb * charge / r;
      const z = potential * 0.1;
      
      return [x, y, Math.max(-3, Math.min(z, 3))];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 8.99, f: 2, uSegments: 128, vSegments: 128 })
  },

  gravitational_field: {
    name: "🌍 Gravitational Field g = GM/r²",
    equation: (u, v, params) => {
      const mass = params.d ?? 5.97e24;
      const G = params.e ?? 6.674e-11;
      const scale = params.f ?? 2;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r_squared = x * x + y * y + 0.1;
      
      const g_magnitude = G * mass / r_squared;
      const normalized_g = Math.log10(g_magnitude + 1) * 0.5;
      
      return [x, y, Math.min(normalized_g, 3)];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 1, f: 2, uSegments: 128, vSegments: 128 })
  },

  gravitational_potential: {
    name: "🌌 Gravitational Potential Φ = -GM/r",
    equation: (u, v, params) => {
      const mass = params.d ?? 10;
      const G = params.e ?? 1;
      const scale = params.f ?? 2;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const potential = -G * mass / r;
      
      return [x, y, potential * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 10, e: 1, f: 2, uSegments: 128, vSegments: 128 })
  },

  central_force_field: {
    name: "🎯 Central Force F(r) = -k/r²",
    equation: (u, v, params) => {
      const k_constant = params.d ?? 1;
      const scale = params.e ?? 3;
      const rotation = params.f ?? 0;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r_squared = x * x + y * y + 0.05;
      
      const force = -k_constant / r_squared;
      const cos_rot = Math.cos(rotation * 0.1);
      const sin_rot = Math.sin(rotation * 0.1);
      
      const x_rot = x * cos_rot - y * sin_rot;
      const y_rot = x * sin_rot + y * cos_rot;
      
      return [x_rot, y_rot, force * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 3, f: 0, uSegments: 128, vSegments: 128 })
  },

  effective_potential_orbital: {
    name: "🛰️ Effective Potential V_eff = -k/r + L²/(2mr²)",
    equation: (u, v, params) => {
      const k_constant = params.d ?? 1;
      const angular_momentum = params.e ?? 1;
      const mass = params.f ?? 1;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const V_gravity = -k_constant / r;
      const V_centrifugal = (angular_momentum * angular_momentum) / (2 * mass * r * r);
      const V_eff = V_gravity + V_centrifugal;
      
      return [x, y, V_eff * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.5, f: 1, uSegments: 128, vSegments: 128 })
  },

  gauss_law_flux: {
    name: "📐 Gauss's Law ∮E·dA = Q/ε₀",
    equation: (u, v, params) => {
      const Q_enclosed = params.d ?? 1;
      const epsilon_0 = params.e ?? 8.85e-12;
      const radius = params.f ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const E_radial = Q_enclosed / (4 * Math.PI * epsilon_0 * radius * radius);
      const r = radius * (1 + E_radial * 0.001);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uSegments: 64, vSegments: 48 })
  },

  wave_intensity_falloff: {
    name: "🌊 Wave Intensity I ∝ 1/r²",
    equation: (u, v, params) => {
      const source_power = params.d ?? 1;
      const frequency = params.e ?? 2;
      const time = params.time ?? 0;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const intensity = source_power / (r * r);
      const wave = Math.sin(frequency * r - time * 2) * intensity;
      
      return [x, y, wave * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 1, time: 0, uSegments: 128, vSegments: 128 })
  },

  coulomb_quantum_potential: {
    name: "⚛️ Coulomb Potential (Quantum) V(r) = -ke²/r",
    equation: (u, v, params) => {
      const k_coulomb = params.d ?? 8.99;
      const e_charge = params.e ?? 1.6e-19;
      const scale = params.f ?? 2;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const V = -k_coulomb * e_charge * e_charge / r;
      const normalized_V = V * 1e19 * 0.3;
      
      return [x, y, Math.max(-3, normalized_V)];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uSegments: 128, vSegments: 128 })
  },

  greens_function_laplace: {
    name: "🔵 Green's Function G(r) = 1/(4πr)",
    equation: (u, v, params) => {
      const scale = params.d ?? 3;
      const amplitude = params.e ?? 1;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const G = amplitude / (4 * Math.PI * r);
      
      return [x, y, Math.min(G, 2)];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 128, vSegments: 128 })
  },

  source_sink_flow: {
    name: "💧 Source/Sink Flow v(r) ~ 1/r²",
    equation: (u, v, params) => {
      const source_strength = params.d ?? 1;
      const sink_strength = params.e ?? -0.5;
      const separation = params.f ?? 2;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      const r_source = Math.sqrt((x - separation) ** 2 + y * y) + 0.1;
      const r_sink = Math.sqrt((x + separation) ** 2 + y * y) + 0.1;
      
      const v_source = source_strength / (r_source * r_source);
      const v_sink = sink_strength / (r_sink * r_sink);
      
      const total_velocity = v_source + v_sink;
      
      return [x, y, total_velocity * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 1, e: -0.5, f: 1.5, uSegments: 128, vSegments: 128 })
  },

  radial_basis_function: {
    name: "🎯 Radial Basis Function φ(r) = 1/(r² + ε²)^(n/2)",
    equation: (u, v, params) => {
      const epsilon = params.d ?? 0.5;
      const n_power = params.e ?? 2;
      const scale = params.f ?? 3;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r_squared = x * x + y * y;
      
      const phi = 1 / Math.pow(r_squared + epsilon * epsilon, n_power / 2);
      
      return [x, y, phi * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 2, f: 3, uSegments: 128, vSegments: 128 })
  },

  information_entropy_decay: {
    name: "📊 Entropy/Influence Decay I(r) ~ 1/r^α",
    equation: (u, v, params) => {
      const alpha = params.d ?? 2;
      const amplitude = params.e ?? 1;
      const noise = params.f ?? 0.1;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const influence = amplitude / Math.pow(r, alpha);
      const fluctuation = Math.sin(r * 5 + x * 3) * noise;
      
      return [x, y, (influence + fluctuation) * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 0.1, uSegments: 128, vSegments: 128 })
  },

  multipole_expansion: {
    name: "🌀 Multipole Expansion Field",
    equation: (u, v, params) => {
      const monopole = params.d ?? 1;
      const dipole = params.e ?? 0.5;
      const quadrupole = params.f ?? 0.2;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      const theta = Math.atan2(y, x);
      
      const V_monopole = monopole / r;
      const V_dipole = dipole * Math.cos(theta) / (r * r);
      const V_quadrupole = quadrupole * (3 * Math.cos(2 * theta) - 1) / (r * r * r);
      
      const total = V_monopole + V_dipole + V_quadrupole;
      
      return [x, y, total * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.5, f: 0.2, uSegments: 128, vSegments: 128 })
  },

  elliptical_orbit_path: {
    name: "🌙 Elliptical Orbit (Kepler 1/r²)",
    equation: (u, v, params) => {
      const semi_major = params.d ?? 2;
      const eccentricity = params.e ?? 0.5;
      const focus_offset = params.f ?? 0;
      
      const theta = u * Math.PI * 2;
      const height = (v - 0.5) * 0.5;
      
      const r = semi_major * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
      
      const x = r * Math.cos(theta) + focus_offset;
      const y = r * Math.sin(theta);
      const z = height + 0.1 * Math.sin(theta * 3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 0, uSegments: 128, vSegments: 32 })
  },

  superposition_field: {
    name: "➕ Superposition E_total = Σ kqᵢ/rᵢ²",
    equation: (u, v, params) => {
      const q1 = params.d ?? 1;
      const q2 = params.e ?? -1;
      const separation = params.f ?? 2;
      
      const x = (u - 0.5) * 8;
      const y = (v - 0.5) * 8;
      
      const r1_squared = (x - separation) ** 2 + y * y + 0.05;
      const r2_squared = (x + separation) ** 2 + y * y + 0.05;
      
      const E1 = q1 / r1_squared;
      const E2 = q2 / r2_squared;
      const E_total = E1 + E2;
      
      return [x, y, E_total * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 1, e: -1, f: 1.5, uSegments: 128, vSegments: 128 })
  },

  gradient_potential_field: {
    name: "∇ Gradient E = -∇V (Field from Potential)",
    equation: (u, v, params) => {
      const charge = params.d ?? 1;
      const k = params.e ?? 1;
      const scale = params.f ?? 3;
      
      const x = (u - 0.5) * scale * 4;
      const y = (v - 0.5) * scale * 4;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      const V = k * charge / r;
      const E_mag = k * charge / (r * r);
      
      const streamline = Math.sin(Math.atan2(y, x) * 8) * 0.1;
      const z = V * 0.3 + streamline * E_mag * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 3, uSegments: 128, vSegments: 128 })
  }
};

export const INVERSE_SQUARE_LAW_CATEGORY = {
  id: 'inverse_square_laws',
  name: '⚡ Inverse Square Laws',
  icon: '⚡',
  description: 'Universal 1/r² field equations: Coulomb, gravity, waves, quantum potentials',
  shapes: Object.keys(INVERSE_SQUARE_LAW_SHAPES),
  engineDynamics: {
    primaryType: 'radial' as const,
    symmetryOrder: 1,
    influenceFactors: ['charge', 'mass', 'distance', 'energy']
  }
};
