/**
 * GENERAL RELATIVITY & SPACETIME PHYSICS LIBRARY
 * 
 * Comprehensive 3D visualizations of Einstein's equations and spacetime geometry
 * Based on the mathematical framework of General Relativity
 * 
 * NOTE: Some shapes already exist in other libraries:
 * - schwarzschild_metric_spacetime, kerr_rotating_black_hole (advancedPhysicsEquations.ts)
 * - einstein_field_equations, einstein_tensor_field, stress_energy_tensor (unifiedShapes.ts)
 * - metric_tensor_surface, christoffel_symbols_field, ricci_tensor_surface (unifiedShapes.ts)
 * - gravitational_time_dilation, gravitational_lensing (advancedPhysicsEquations.ts)
 * 
 * This library adds the MISSING shapes from the GR framework.
 * 
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
    a: 1, b: 1, c: 1,
    d: 2, e: 2, f: 2, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const GENERAL_RELATIVITY_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // I. CORE GEOMETRIC FOUNDATIONS
  // ============================================================================

  spacetime_interval_ds2: {
    name: "📐 Spacetime Interval ds² = g_μν dx^μ dx^ν",
    equation: (u, v, params) => {
      const a = params.d ?? 3;     // Scale
      const b = params.e ?? 1;     // Time component weight
      const c = params.f ?? 1;     // Space component weight
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Visualize the light cone structure of spacetime interval
      // ds² < 0 (timelike), ds² = 0 (lightlike), ds² > 0 (spacelike)
      const t = (v - 0.5) * 2;  // Time coordinate
      const r = u * a;           // Radial spatial coordinate
      
      // Minkowski interval: ds² = -c²dt² + dr²
      const ds2 = -b * t * t + c * r * r;
      
      // Create cone-like visualization
      const coneRadius = Math.abs(t) * a * 0.8;
      const x = coneRadius * Math.cos(theta);
      const y = coneRadius * Math.sin(theta);
      const z = t * a + ds2 * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  ricci_scalar_curvature: {
    name: "📐 Ricci Scalar R = g^μν R_μν - Curvature Magnitude",
    equation: (u, v, params) => {
      const a = params.d ?? 3;     // Base radius
      const b = params.e ?? 1;     // Curvature intensity
      const c = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Ricci scalar represents total curvature at a point
      // For a sphere of radius R: R = 2/R² (positive curvature)
      // For flat space: R = 0
      // For saddle: R < 0
      
      const gaussianCurvature = Math.sin(phi * 2) * Math.cos(theta * 2);
      const ricciScalar = b * (Math.sin(theta * 3) * Math.sin(phi * 2) + gaussianCurvature);
      
      const r = a * (1 + ricciScalar * 0.3);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c + ricciScalar * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  riemann_curvature_tensor: {
    name: "📐 Riemann Tensor R^α_βγδ - Full Curvature Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 3;     // Scale
      const b = params.e ?? 1;     // Curvature magnitude
      const c = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Riemann tensor has 20 independent components in 4D
      // Visualize as a twisted manifold showing parallel transport failure
      
      // Simulate curvature components
      const R_0123 = Math.sin(theta) * Math.cos(phi);
      const R_0213 = Math.cos(theta * 2) * Math.sin(phi);
      const R_0312 = Math.sin(theta + phi);
      
      const curvature = b * (R_0123 + R_0213 * 0.5 + R_0312 * 0.3);
      
      // Create twisted surface showing curvature effects
      const twist = curvature * 0.3;
      const r = a * (1 + Math.abs(curvature) * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta + twist);
      const y = r * Math.sin(phi) * Math.sin(theta + twist);
      const z = r * Math.cos(phi) * c + curvature * 0.4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 72 })
  },

  // ============================================================================
  // II. GEODESICS (Object and Light Paths)
  // ============================================================================

  geodesic_equation: {
    name: "📐 Geodesic Equation d²x^α/dτ² + Γ^α_βγ dx^β dx^γ = 0",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Path scale
      const b = params.e ?? 1;     // Curvature strength
      const c = params.f ?? 1;     // Z-amplitude
      
      // Geodesic path through curved spacetime
      const tau = u * Math.PI * 4;  // Proper time
      const pathIndex = v;          // Different geodesic paths
      
      // Simulate geodesic deviation in curved space
      const curvature = b * Math.sin(tau * 0.5);
      const deviation = pathIndex * 0.5;
      
      // Curved path (geodesic bends due to spacetime curvature)
      const x = a * Math.cos(tau) * (1 + deviation);
      const y = a * Math.sin(tau) * (1 + deviation);
      const z = c * (curvature * Math.sin(tau * 2) + pathIndex * 2 - 1);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 128, vSegments: 32 })
  },

  photon_geodesic_null: {
    name: "📐 Photon Geodesic ds² = 0 - Null Light Path",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const b = params.e ?? 2;     // Mass (affects bending)
      const c = params.f ?? 1;     // Z-scale
      
      const angle = u * Math.PI * 2;
      const radius = v * a + 0.5;  // Impact parameter
      
      // Light bending near massive object
      // Deflection angle α = 4GM/(bc²) for weak field
      const rs = 2 * b * 0.3;  // Schwarzschild radius (scaled)
      const deflection = rs / (radius + 0.1);
      
      // Light path curves around mass
      const bentAngle = angle + deflection * Math.sin(angle);
      
      const x = radius * Math.cos(bentAngle);
      const y = radius * Math.sin(bentAngle);
      const z = c * deflection * Math.cos(angle * 2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 96, vSegments: 48 })
  },

  proper_time_surface: {
    name: "📐 Proper Time dτ = √(-ds²)/c",
    equation: (u, v, params) => {
      const a = params.d ?? 3;     // Scale
      const b = params.e ?? 1;     // Gravitational strength
      const c = params.f ?? 1;     // Z-scale
      
      const theta = u * Math.PI * 2;
      const r = v * a + 0.3;
      
      // Proper time slows near massive objects
      // dτ/dt = √(1 - rs/r)
      const rs = 2 * b * 0.5;
      const timeDilation = Math.sqrt(Math.max(0.01, 1 - rs / r));
      
      // Visualize as surface where height = proper time rate
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * timeDilation * 2 - 1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 2, uSegments: 64, vSegments: 48 })
  },

  // ============================================================================
  // III. STRESS-ENERGY (Matter and Energy)
  // ============================================================================

  energy_density_t00: {
    name: "📐 Energy Density ρ = T₀₀ - Local Rest Frame",
    equation: (u, v, params) => {
      const a = params.d ?? 3;     // Scale
      const b = params.e ?? 1;     // Density peak
      const c = params.f ?? 1;     // Z-scale
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Gaussian energy density distribution (like a star or planet)
      const r2 = x * x + y * y;
      const rho = b * Math.exp(-r2 / (a * 0.5));
      
      // Add smaller secondary density peaks
      const rho2 = 0.3 * b * Math.exp(-((x - 1) * (x - 1) + (y - 0.5) * (y - 0.5)) / 0.3);
      
      const z = c * (rho + rho2) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // IV. SPECIAL RELATIVITY (Local Simulations)
  // ============================================================================

  lorentz_factor_gamma: {
    name: "📐 Lorentz Factor γ = 1/√(1 - v²/c²)",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const c_light = params.e ?? 1;  // Speed of light (normalized)
      const zScale = params.f ?? 2;
      
      const velocity = u * 0.99 * c_light;  // v from 0 to 0.99c
      const angle = v * Math.PI * 2;
      
      // Lorentz factor: γ = 1/√(1 - v²/c²)
      const gamma = 1 / Math.sqrt(Math.max(0.01, 1 - (velocity * velocity) / (c_light * c_light)));
      
      // Visualize as surface rising asymptotically as v → c
      const x = velocity * a * Math.cos(angle);
      const y = velocity * a * Math.sin(angle);
      const z = Math.min(gamma, 10) * zScale;  // Cap for visualization
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 96, vSegments: 32 })
  },

  lorentz_transformation: {
    name: "📐 Lorentz Transform t' = γ(t - vx/c²), x' = γ(x - vt)",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const beta = params.e ?? 0.6;  // v/c ratio
      const c = params.f ?? 1;
      
      // Original coordinates
      const t = (u - 0.5) * a * 2;
      const x_orig = (v - 0.5) * a * 2;
      
      // Lorentz transformation
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const t_prime = gamma * (t - beta * x_orig);
      const x_prime = gamma * (x_orig - beta * t);
      
      // Show transformation as surface warping
      const x = x_orig;
      const y = t;
      const z = c * (t_prime - t) + (x_prime - x_orig) * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.6, f: 1, uSegments: 64, vSegments: 64 })
  },

  sr_time_dilation: {
    name: "📐 Time Dilation t' = γt (Special Relativity)",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const maxBeta = params.e ?? 0.95;  // Maximum v/c
      const c = params.f ?? 2;
      
      const beta = u * maxBeta;  // v/c from 0 to maxBeta
      const angle = v * Math.PI * 2;
      
      // Time dilation factor
      const gamma = 1 / Math.sqrt(Math.max(0.01, 1 - beta * beta));
      
      // Clock ticks slower by factor γ
      const properTime = 1;  // Original time
      const dilatedTime = gamma * properTime;
      
      const r = beta * a;
      const x = r * Math.cos(angle);
      const y = r * Math.sin(angle);
      const z = c * (dilatedTime - 1);  // Height shows time dilation
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.95, f: 1, uSegments: 96, vSegments: 32 })
  },

  length_contraction: {
    name: "📐 Length Contraction L' = L/γ",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Original length
      const maxBeta = params.e ?? 0.95;
      const c = params.f ?? 1;
      
      const beta = u * maxBeta;  // v/c
      const position = v;  // Position along rod
      
      const gamma = 1 / Math.sqrt(Math.max(0.01, 1 - beta * beta));
      const contractedLength = a / gamma;
      
      // Show rod contracting as velocity increases
      const x = position * contractedLength - contractedLength / 2;
      const y = beta * a;  // Y-axis = velocity
      const z = c * (1 - 1 / gamma) * 2;  // Z shows contraction amount
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 0.95, f: 1, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // V. GRAVITATIONAL TIME EFFECTS
  // ============================================================================

  gravitational_redshift: {
    name: "📐 Gravitational Redshift ν_obs = ν_emit √(1 - rs/r)",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const M = params.e ?? 2;     // Mass
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const r = v * a + 0.5;  // Radial distance
      
      const rs = 2 * M * 0.3;  // Schwarzschild radius
      const redshiftFactor = Math.sqrt(Math.max(0.01, 1 - rs / r));
      
      // Wavelength stretches (redshift) as light climbs out of gravity well
      const wavelengthStretch = 1 / redshiftFactor;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * (wavelengthStretch - 1);  // Height = redshift amount
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 2, uSegments: 64, vSegments: 48 })
  },

  // ============================================================================
  // VI. MAJOR METRICS FOR RENDERING
  // ============================================================================

  minkowski_flat_spacetime: {
    name: "📐 Minkowski Metric ds² = -c²dt² + dx² + dy² + dz²",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const b = params.e ?? 1;     // Time axis scale
      const c = params.f ?? 1;
      
      // Flat spacetime - visualize as grid with light cones
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Add subtle wave to show it's a surface (flat otherwise)
      const flatness = Math.sin(u * Math.PI * 4) * Math.cos(v * Math.PI * 4) * 0.05;
      const z = c * flatness;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  flrw_cosmological_metric: {
    name: "📐 FLRW Metric - Expanding Universe a(t)",
    equation: (u, v, params) => {
      const a0 = params.d ?? 3;    // Current scale factor
      const H = params.e ?? 0.5;   // Hubble parameter (expansion rate)
      const k = params.f ?? 0;     // Curvature: 0=flat, 1=closed, -1=open
      
      const theta = u * Math.PI * 2;
      const chi = v * Math.PI;  // Comoving radial coordinate
      
      // Scale factor evolution a(t) - simplified
      const t = v * 2;  // Cosmic time
      const scaleFactor = a0 * Math.exp(H * t);  // de Sitter expansion
      
      // Comoving coordinates with curvature
      let r_comoving;
      if (Math.abs(k) < 0.01) {
        r_comoving = chi;  // Flat
      } else if (k > 0) {
        r_comoving = Math.sin(chi);  // Closed (spherical)
      } else {
        r_comoving = Math.sinh(chi);  // Open (hyperbolic)
      }
      
      // Physical radius = a(t) × comoving radius
      const r_physical = scaleFactor * r_comoving;
      
      const x = r_physical * Math.cos(theta);
      const y = r_physical * Math.sin(theta);
      const z = scaleFactor - a0;  // Height shows expansion
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.3, f: 0, uSegments: 64, vSegments: 48 })
  },

  weak_field_approximation: {
    name: "📐 Weak Field g₀₀ ≈ -(1 + 2Φ/c²) - Newtonian Limit",
    equation: (u, v, params) => {
      const a = params.d ?? 4;     // Scale
      const M = params.e ?? 2;     // Mass (Newtonian potential source)
      const c = params.f ?? 1;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Newtonian potential Φ = -GM/r
      const r = Math.sqrt(x * x + y * y) + 0.3;
      const phi_newton = -M / r;
      
      // Metric perturbation h₀₀ ≈ 2Φ/c²
      const g00_perturbation = 2 * phi_newton * 0.2;
      
      // Visualize potential well
      const z = c * phi_newton;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 1, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // VII. LIGHT AND VISUAL EFFECTS
  // ============================================================================

  light_deflection_angle: {
    name: "📐 Deflection Angle α = 4GM/(bc²)",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;
      const M = params.e ?? 2;     // Mass
      const c_param = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const b_impact = v * scale + 0.5;  // Impact parameter
      
      // Deflection angle (weak field): α = 4GM/(bc²)
      const alpha = 4 * M * 0.2 / b_impact;
      
      // Light ray path with deflection
      const deflectedTheta = theta + alpha * Math.sin(theta);
      
      const x = b_impact * Math.cos(deflectedTheta);
      const y = b_impact * Math.sin(deflectedTheta);
      const z = c_param * alpha;  // Height = deflection magnitude
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 2, uSegments: 64, vSegments: 48 })
  },

  // ============================================================================
  // VIII. NUMERICAL RELATIVITY FORMALISMS
  // ============================================================================

  adm_decomposition_3plus1: {
    name: "📐 ADM 3+1 Decomposition - Lapse α, Shift β^i, 3-metric γ_ij",
    equation: (u, v, params) => {
      const scale = params.d ?? 3;
      const lapse = params.e ?? 1;    // α: lapse function
      const shift = params.f ?? 0.2;  // β: shift magnitude
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // ADM decomposes 4D spacetime into 3D spatial slices + time
      // ds² = -α²dt² + γ_ij(dx^i + β^i dt)(dx^j + β^j dt)
      
      // Spatial slice (3-geometry)
      const r = scale;
      
      // Lapse controls time flow rate between slices
      const lapseEffect = lapse * (1 + 0.2 * Math.sin(theta * 2));
      
      // Shift moves coordinates between slices
      const shiftX = shift * Math.cos(phi);
      const shiftY = shift * Math.sin(phi);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + shiftX;
      const y = r * Math.sin(phi) * Math.sin(theta) + shiftY;
      const z = r * Math.cos(phi) * lapseEffect;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0.2, uSegments: 64, vSegments: 48 })
  },

  extrinsic_curvature_kij: {
    name: "📐 Extrinsic Curvature K_ij - Embedding Curvature",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1;     // Curvature strength
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // K_ij describes how 3D spatial slice curves in 4D spacetime
      // K_ij = (1/2α)(−∂_t γ_ij + ∇_i β_j + ∇_j β_i)
      
      // Simulate extrinsic curvature as surface embedding
      const K_trace = b * Math.sin(theta * 2) * Math.cos(phi);
      const K_shear = 0.3 * b * Math.cos(theta * 3) * Math.sin(phi * 2);
      
      const r = a * (1 + (K_trace + K_shear) * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c + K_trace * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 72, vSegments: 54 })
  },

  hamiltonian_constraint: {
    name: "📐 Hamiltonian Constraint R + K² - K_ij K^ij = 16πρ",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const rho = params.e ?? 1;   // Energy density
      const c = params.f ?? 1;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      // Hamiltonian constraint must be satisfied on each slice
      // R (3D Ricci scalar) + K² - K_ij K^ij = 16πρ
      
      const r = Math.sqrt(x * x + y * y) + 0.1;
      
      // Energy density distribution
      const density = rho * Math.exp(-r * r / 2);
      
      // Constraint equation determines allowed curvature
      const ricci3D = density * 16 * Math.PI * 0.05;
      
      const z = c * (ricci3D + density * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1, f: 2, uSegments: 96, vSegments: 96 })
  },

  momentum_constraint: {
    name: "📐 Momentum Constraint ∇_j(K^ij - γ^ij K) = 8πj^i",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const j_momentum = params.e ?? 1;  // Momentum density
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Momentum constraint relates extrinsic curvature to matter momentum
      // ∇_j(K^ij - γ^ij K) = 8π j^i
      
      // Visualize momentum flow on spatial slice
      const momentumFlow = j_momentum * Math.sin(theta) * Math.cos(phi);
      const curvatureGradient = 0.5 * Math.cos(theta * 2) * Math.sin(phi);
      
      const r = a * (1 + momentumFlow * 0.15);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c + curvatureGradient * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 72, vSegments: 54 })
  },

  // ============================================================================
  // IX. LIGO-LEVEL BSSN FORMALISM
  // ============================================================================

  bssn_conformal_metric: {
    name: "📐 BSSN Conformal Metric γ̃_ij = e^(-4φ) γ_ij",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const conformalFactor = params.e ?? 0.5;  // φ
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // BSSN splits metric: γ_ij = e^(4φ) γ̃_ij where det(γ̃) = 1
      // Conformal factor φ absorbs volume information
      
      const e4phi = Math.exp(4 * conformalFactor * Math.sin(theta) * Math.cos(phi) * 0.3);
      const r_conformal = a;  // Unit determinant conformal metric
      const r_physical = r_conformal * Math.pow(e4phi, 0.25);
      
      const x = r_physical * Math.sin(phi) * Math.cos(theta);
      const y = r_physical * Math.sin(phi) * Math.sin(theta);
      const z = r_physical * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.5, f: 1, uSegments: 72, vSegments: 54 })
  },

  bssn_tracefree_extrinsic: {
    name: "📐 BSSN Trace-Free Ã_ij = e^(-4φ)(K_ij - γ_ij K/3)",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1;     // Ã magnitude
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi_coord = v * Math.PI;
      
      // Trace-free part of extrinsic curvature
      // Ã_ij has zero trace (Ã^i_i = 0)
      
      // l=2 spherical harmonic pattern (like gravitational waves)
      const A_plus = b * Math.sin(phi_coord) * Math.sin(phi_coord) * Math.cos(2 * theta);
      const A_cross = b * Math.sin(phi_coord) * Math.sin(phi_coord) * Math.sin(2 * theta);
      
      const r = a * (1 + (A_plus + A_cross) * 0.15);
      
      const x = r * Math.sin(phi_coord) * Math.cos(theta);
      const y = r * Math.sin(phi_coord) * Math.sin(theta);
      const z = r * Math.cos(phi_coord) * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 72, vSegments: 54 })
  },

  bssn_conformal_connection: {
    name: "📐 BSSN Conformal Connection Γ̃^i = γ̃^jk Γ̃^i_jk",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const connectionStrength = params.e ?? 1;
      const c = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Conformal connection functions
      // Γ̃^i encodes derivative information of conformal metric
      
      const Gamma_r = connectionStrength * Math.sin(theta) * Math.cos(phi);
      const Gamma_theta = connectionStrength * Math.cos(theta * 2) * Math.sin(phi);
      const Gamma_phi = connectionStrength * Math.sin(theta + phi);
      
      const connectionMag = Math.sqrt(Gamma_r * Gamma_r + Gamma_theta * Gamma_theta + Gamma_phi * Gamma_phi);
      
      const r = a * (1 + connectionMag * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c + Gamma_r * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, uSegments: 72, vSegments: 54 })
  },

  bssn_evolution_equations: {
    name: "📐 BSSN Evolution - ∂_t φ, ∂_t γ̃_ij, ∂_t K, ∂_t Ã_ij",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const evolutionRate = params.e ?? 1;  // Time evolution speed
      const c = params.f ?? 1;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // BSSN evolution equations govern how fields change in time
      // ∂_t φ = -α K/6 + β^i ∂_i φ + ∂_i β^i/6
      // ∂_t γ̃_ij = -2α Ã_ij + ...
      // ∂_t K = -∇²α + α(Ã_ij Ã^ij + K²/3) + ...
      // ∂_t Ã_ij = e^(-4φ)[−∇_i∇_j α + α R_ij] + ...
      
      // Simulate time evolution with wave-like patterns
      const evolutionPhase = time * evolutionRate * 0.1;
      const wave = Math.sin(theta * 2 + evolutionPhase) * Math.cos(phi);
      
      const r = a * (1 + wave * 0.2 * Math.sin(evolutionPhase));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * c + wave * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 1, time: 0, uSegments: 72, vSegments: 54 })
  }

};

// Log loaded shapes
console.log(`📐 Loaded ${Object.keys(GENERAL_RELATIVITY_SHAPES).length} General Relativity visualizations 🌌⚫🔭`);
