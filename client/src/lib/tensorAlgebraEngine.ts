
/**
 * TENSOR ALGEBRA & LINEAR OPERATORS LIBRARY
 * Advanced tensor operations and linear algebra visualizations
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

export const TENSOR_ALGEBRA_SHAPES: Record<string, ParametricSurface> = {

  rank_2_tensor_surface: {
    name: "📐 Rank-2 Tensor T^μν = A^μ ⊗ B^ν",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Tensor scale
      const e = params.e ?? 1;     // Component strength
      const f = params.f ?? 1;     // Z-scale
      
      // Tensor components
      const mu = Math.floor(u * 4) % 4;    // μ index (0,1,2,3)
      const nu = Math.floor(v * 4) % 4;    // ν index (0,1,2,3)
      
      // Vector A^μ components
      const A = [1, Math.cos(u * Math.PI), Math.sin(u * Math.PI), u - 0.5];
      
      // Vector B^ν components  
      const B = [1, Math.cos(v * Math.PI), Math.sin(v * Math.PI), v - 0.5];
      
      // Tensor product T^μν = A^μ ⊗ B^ν
      const tensorComponent = A[mu] * B[nu] * e;
      
      const x = u * d * 2 - d;
      const y = v * d * 2 - d; 
      const z = f * tensorComponent;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  christoffel_symbols_field: {
    name: "📐 Christoffel Symbols Γ^λ_μν",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;  // Field scale
      const curvature = params.e ?? 1; // Curvature strength
      const f = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Simplified connection coefficients for sphere
      const Gamma_theta_theta_r = -curvature / scale;
      const Gamma_phi_phi_r = -curvature * Math.sin(phi) * Math.sin(phi) / scale;
      const Gamma_theta_phi_phi = Math.cos(phi) * Math.sin(phi) * curvature;
      
      // Combine connection effects
      const connectionField = Gamma_theta_theta_r + Gamma_phi_phi_r + Gamma_theta_phi_phi;
      
      const r = scale * (1 + connectionField * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * f + connectionField * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  covariant_derivative: {
    name: "📐 Covariant Derivative ∇_μ V^ν",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const e = params.e ?? 1;     // Vector magnitude
      const f = params.f ?? 1;     // Derivative scale
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Vector field V^ν
      const Vx = e * Math.sin(u * Math.PI * 2);
      const Vy = e * Math.cos(v * Math.PI * 2);
      
      // Partial derivative ∂_μ V^ν
      const dVx_dx = e * Math.PI * 2 * Math.cos(u * Math.PI * 2);
      const dVy_dy = -e * Math.PI * 2 * Math.sin(v * Math.PI * 2);
      
      // Connection term (simplified)
      const connection = 0.1 * (Vx + Vy);
      
      // Covariant derivative = partial + connection
      const covDerivative = (dVx_dx + dVy_dy + connection) * f;
      
      const z = covDerivative;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 96 })
  },

  metric_tensor_surface: {
    name: "📐 Metric Tensor g_μν",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Spatial scale
      const curvature = params.e ?? 1; // Curvature parameter
      const f = params.f ?? 1;     // Height scale
      
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      // Metric components for curved space
      const g_tt = -(1 - curvature * 0.1);  // Time-time component
      const g_rr = 1 / (1 - curvature * 0.1); // Radial-radial component  
      const g_theta_theta = d * d;          // Angular component
      const g_phi_phi = d * d * Math.sin(theta) * Math.sin(theta);
      
      // Metric determinant
      const det_g = Math.abs(g_tt * g_rr * g_theta_theta * g_phi_phi);
      const metric_curvature = Math.sqrt(det_g) - 1;
      
      const r = d * (1 + metric_curvature * 0.1);
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta) * f + metric_curvature * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  riemann_tensor_field: {
    name: "📐 Riemann Curvature Tensor R^ρ_σμν",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Field scale
      const curvature = params.e ?? 1; // Curvature strength
      const f = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Riemann tensor components (simplified)
      const R_0101 = curvature * Math.sin(theta) * Math.cos(phi);
      const R_0202 = curvature * Math.cos(theta * 2) * Math.sin(phi);
      const R_0303 = curvature * Math.sin(theta + phi);
      const R_1212 = curvature * Math.cos(theta) * Math.cos(phi);
      
      // Total curvature
      const totalCurvature = (R_0101 + R_0202 + R_0303 + R_1212) * 0.25;
      
      const r = d * (1 + totalCurvature * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * f + totalCurvature * 0.4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  einstein_tensor_field: {
    name: "📐 Einstein Tensor G_μν = R_μν - ½Rg_μν",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const matter = params.e ?? 1; // Matter density
      const f = params.f ?? 1;     // Z-scale
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Matter distribution
      const T_00 = matter * Math.exp(-r * r / (d * 0.5)); // Energy density
      
      // Einstein tensor G_μν = (8πG/c⁴)T_μν
      const G_const = 8 * Math.PI * 0.1; // Scaled gravitational constant
      const G_00 = G_const * T_00;
      
      // Curvature from matter
      const curvature = G_00 * r * 0.5;
      
      const z = f * curvature;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 96 })
  },

  weyl_tensor: {
    name: "📐 Weyl Tensor C_μνρσ - Traceless Curvature",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const tidal = params.e ?? 1; // Tidal force strength
      const f = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Weyl tensor (traceless part of Riemann)
      // Represents tidal forces and gravitational waves
      const C_0101 = tidal * Math.sin(theta * 2) * Math.cos(phi * 2);
      const C_0202 = tidal * Math.cos(theta * 2) * Math.sin(phi * 2);
      const C_1212 = tidal * Math.sin(theta + phi);
      
      // Traceless combination
      const weyl_trace = (C_0101 + C_0202 + C_1212) / 3;
      const C_traceless = C_0101 - weyl_trace;
      
      const r = d * (1 + C_traceless * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * f + C_traceless * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  stress_energy_tensor: {
    name: "📐 Stress-Energy Tensor T_μν",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Scale
      const density = params.e ?? 2; // Energy density
      const pressure = params.f ?? 1; // Pressure
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Energy density T_00 = ρ
      const T_00 = density * Math.exp(-r * r);
      
      // Pressure T_ii = P  
      const T_11 = pressure * Math.exp(-r * r * 0.5);
      const T_22 = T_11;
      const T_33 = T_11;
      
      // Energy flux T_0i (simplified)
      const T_01 = 0.1 * density * x * Math.exp(-r * r);
      
      // Total stress-energy effect
      const stress_energy = T_00 + (T_11 + T_22 + T_33) / 3 + Math.abs(T_01);
      
      const z = stress_energy * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 96, vSegments: 96 })
  },

  parallel_transport: {
    name: "📐 Parallel Transport Along Curve",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Path scale
      const curvature = params.e ?? 1; // Spacetime curvature
      const f = params.f ?? 1;     // Vector magnitude
      
      // Curve parameter
      const t = u;
      
      // Path in curved space
      const curve_x = d * Math.cos(t * Math.PI * 2);
      const curve_y = d * Math.sin(t * Math.PI * 2);
      const curve_z = 0;
      
      // Vector being transported
      const pathIndex = v;
      
      // Parallel transport equation: dV/dt + Γ(V,dγ/dt) = 0
      // Simplified: vector rotates due to curvature
      const transport_angle = t * curvature * 0.5;
      
      // Transported vector
      const V_x = f * Math.cos(transport_angle) * pathIndex;
      const V_y = f * Math.sin(transport_angle) * pathIndex;
      const V_z = f * 0.2 * Math.sin(t * Math.PI * 4) * pathIndex;
      
      return [curve_x + V_x, curve_y + V_y, curve_z + V_z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 128, vSegments: 32 })
  },

  tensor_contraction: {
    name: "📐 Tensor Contraction T^μ_μ",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const e = params.e ?? 1;     // Tensor magnitude
      const f = params.f ?? 1;     // Contraction scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Mixed tensor T^μ_ν components
      const T_00 = e * Math.sin(theta);
      const T_11 = e * Math.cos(phi);  
      const T_22 = e * Math.sin(theta + phi);
      const T_33 = e * Math.cos(theta - phi);
      
      // Trace (contraction): T = T^μ_μ = T^0_0 + T^1_1 + T^2_2 + T^3_3
      const trace = T_00 + T_11 + T_22 + T_33;
      
      const r = d * (1 + trace * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * f + trace * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  gradient_field: {
    name: "📐 Gradient Vector Field ∇f",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Field scale
      const steepness = params.e ?? 2; // Gradient steepness
      const f = params.f ?? 1;     // Arrow scale
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Scalar field f(x,y) = steepness * (x² + y²)
      const scalarField = steepness * (x * x + y * y) / (d * d);
      
      // Gradient ∇f = (∂f/∂x, ∂f/∂y)
      const grad_x = 2 * steepness * x / (d * d);
      const grad_y = 2 * steepness * y / (d * d);
      const grad_magnitude = Math.sqrt(grad_x * grad_x + grad_y * grad_y);
      
      // Visualize as height field with gradient vectors
      const z = scalarField * 0.1 + grad_magnitude * f * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 64, vSegments: 64 })
  },

  divergence_field: {
    name: "📐 Divergence ∇·V - Vector Field Sources",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Field scale
      const strength = params.e ?? 1; // Field strength  
      const f = params.f ?? 1;     // Height scale
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Vector field V = (V_x, V_y)
      const V_x = strength * x;
      const V_y = strength * y;
      
      // Divergence ∇·V = ∂V_x/∂x + ∂V_y/∂y
      const div_V = strength + strength; // = 2 * strength (constant)
      
      // Add some variation
      const div_variation = 0.5 * Math.sin(x * 2) * Math.cos(y * 2);
      const total_divergence = div_V + div_variation;
      
      const z = f * total_divergence;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  curl_field_3d: {
    name: "📐 Curl ∇×V - Vector Field Rotation",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Field scale
      const rotation = params.e ?? 1; // Rotation strength
      const f = params.f ?? 1;     // Z-scale
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Vector field V = (-y, x, 0) (circular flow)
      const V_x = -rotation * y;
      const V_y = rotation * x;
      const V_z = 0;
      
      // Curl ∇×V = (∂V_z/∂y - ∂V_y/∂z, ∂V_x/∂z - ∂V_z/∂x, ∂V_y/∂x - ∂V_x/∂y)
      const curl_x = 0; // ∂V_z/∂y - ∂V_y/∂z = 0
      const curl_y = 0; // ∂V_x/∂z - ∂V_z/∂x = 0  
      const curl_z = rotation - (-rotation); // ∂V_y/∂x - ∂V_x/∂y = 2*rotation
      
      // Magnitude of curl
      const curl_magnitude = Math.sqrt(curl_x*curl_x + curl_y*curl_y + curl_z*curl_z);
      
      const z = f * curl_magnitude * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  laplacian_operator: {
    name: "📐 Laplacian ∇²f = ∂²f/∂x² + ∂²f/∂y²",
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Scale
      const amplitude = params.e ?? 2; // Wave amplitude
      const frequency = params.f ?? 1; // Wave frequency
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Function f(x,y) = amplitude * sin(frequency*x) * cos(frequency*y)
      const scalarFunc = amplitude * Math.sin(frequency * x) * Math.cos(frequency * y);
      
      // Second derivatives
      const d2f_dx2 = -amplitude * frequency * frequency * Math.sin(frequency * x) * Math.cos(frequency * y);
      const d2f_dy2 = -amplitude * frequency * frequency * Math.sin(frequency * x) * Math.cos(frequency * y);
      
      // Laplacian ∇²f = ∂²f/∂x² + ∂²f/∂y²
      const laplacian = d2f_dx2 + d2f_dy2;
      
      const z = scalarFunc * 0.3 + laplacian * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 128, vSegments: 128 })
  },

  tensor_field_lines: {
    name: "📐 Tensor Field Lines - Eigenvector Trajectories", 
    equation: (u, v, params) => {
      const d = params.d ?? 4;     // Field scale
      const anisotropy = params.e ?? 1; // Field anisotropy
      const f = params.f ?? 1;     // Line density
      
      // Field line parameter
      const t = u * Math.PI * 4;
      const lineIndex = Math.floor(v * 8) / 8;
      
      // Tensor field with eigenvectors
      const eigendir1_x = Math.cos(t * 0.5 + lineIndex * Math.PI / 4);
      const eigendir1_y = Math.sin(t * 0.5 + lineIndex * Math.PI / 4);
      
      // Field line follows eigenvector direction
      const integral_x = d * Math.cos(t) * (1 + anisotropy * eigendir1_x * 0.3);
      const integral_y = d * Math.sin(t) * (1 + anisotropy * eigendir1_y * 0.3);
      const integral_z = f * Math.sin(t * 2) * lineIndex;
      
      return [integral_x, integral_y, integral_z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 128, vSegments: 16 })
  },

  hodge_dual_operator: {
    name: "📐 Hodge Dual ⋆ω - Differential Forms",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const form_strength = params.e ?? 1; // Form magnitude
      const f = params.f ?? 1;     // Dual scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // 1-form ω = f(x)dx in 2D
      const omega_x = form_strength * Math.cos(theta);
      const omega_y = form_strength * Math.sin(phi);
      
      // Hodge dual ⋆ω in 2D: (A dx + B dy) → A dy - B dx  
      const dual_x = omega_y;  // Coefficient of dx in dual
      const dual_y = -omega_x; // Coefficient of dy in dual
      
      // Visualize as twisted surface
      const r = d * (1 + (dual_x + dual_y) * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * f + (dual_x * dual_y) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  lie_derivative: {
    name: "📐 Lie Derivative L_X Y - Flow Along Vector Field",
    equation: (u, v, params) => {
      const d = params.d ?? 3;     // Scale
      const flow = params.e ?? 1;  // Flow strength
      const time = params.f ?? 0;  // Flow time parameter
      
      const x = (u - 0.5) * d * 2;
      const y = (v - 0.5) * d * 2;
      
      // Vector field X (flow generator)
      const X_x = flow * (-y);  // Rotation flow
      const X_y = flow * x;
      
      // Vector field Y to be differentiated
      const Y_x = Math.cos(x + y);
      const Y_y = Math.sin(x - y);
      
      // Lie derivative L_X Y = [X, Y] (simplified)
      // Flow of Y along X for time t
      const flowed_x = x + X_x * time * 0.1;
      const flowed_y = y + X_y * time * 0.1;
      
      // Evaluate Y at flowed point
      const Y_flowed_x = Math.cos(flowed_x + flowed_y);
      const Y_flowed_y = Math.sin(flowed_x - flowed_y);
      
      // Lie derivative (difference)
      const lie_deriv_magnitude = Math.sqrt((Y_flowed_x - Y_x)**2 + (Y_flowed_y - Y_y)**2);
      
      const z = lie_deriv_magnitude;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0, uSegments: 96, vSegments: 96 })
  }

};

console.log(`📐 Loaded ${Object.keys(TENSOR_ALGEBRA_SHAPES).length} Tensor Algebra visualizations 🔧📊🎯`);
