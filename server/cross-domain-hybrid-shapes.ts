/**
 * CROSS-DOMAIN HYBRID SHAPES
 * Implements Section 3.1 from "THE DMENSION SYSTEM" publication
 * 
 * 4 Novel cross-domain mathematical fusions:
 * 1. Relativity × Thermal Polar Fields
 * 2. Quantum Gravity × Interference Cooling
 * 3. Tensor Algebra × Spherical Harmonics
 * 4. Polynomial COP × Harmonic Decomposition
 * 
 * @author UUON Foundation & Claude AI
 * @publication "THE DMENSION SYSTEM: A CROSS-DOMAIN COMPUTATIONAL MATHEMATICAL FRAMEWORK"
 * @date 2025
 */

export interface ShapeParams {
  a?: number;
  b?: number;
  c?: number;
  d?: number;
  e?: number;
  f?: number;
  g?: number;
  h?: number;
  time?: number;
  uMin?: number;
  uMax?: number;
  vMin?: number;
  vMax?: number;
  uSegments?: number;
  vSegments?: number;
  [key: string]: number | undefined;
}

function getCleanDefaults(overrides: Partial<ShapeParams>): ShapeParams {
  return {
    a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0, h: 1,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 64,
    ...overrides
  };
}

export const CROSS_DOMAIN_HYBRID_SHAPES: Record<string, {
  name: string;
  description: string;
  equation: (u: number, v: number, params: ShapeParams) => [number, number, number];
  defaultParams: ShapeParams;
  fusionDomains: string[];
  mathematicalDNA: string[];
  publicationReference: string;
}> = {

  // ============================================================================
  // 3.1.A: RELATIVITY × THERMAL POLAR FIELDS
  // "Curvature-driven cooling surfaces, warped-COP models, relativistic thermal gradients"
  // ============================================================================
  
  relativistic_thermal_curvature: {
    name: "🌌 Relativistic Thermal: g_μν × exp(-r/λ)×cos(nθ)",
    description: "Einstein curvature terms fused with thermal polar decay. Creates warped cooling surfaces where spacetime geometry influences heat transfer patterns.",
    equation: (u, v, params) => {
      const M = params.a ?? 2;
      const lambda = params.b ?? 3;
      const n = params.c ?? 2;
      const c = 1;
      const G = 1;
      const scale = params.d ?? 4;
      
      const theta = u * Math.PI * 2;
      const r_norm = v;
      const r = r_norm * scale + 0.5;
      
      const r_s = 2 * G * M / (c * c);
      const curvature_factor = 1 - r_s / Math.max(r, r_s + 0.1);
      
      const thermal_decay = Math.exp(-r / lambda);
      const angular_mode = Math.cos(n * theta);
      
      const warped_radius = r * Math.sqrt(Math.abs(curvature_factor)) * (1 + thermal_decay * angular_mode * 0.3);
      
      const x = warped_radius * Math.cos(theta);
      const y = warped_radius * Math.sin(theta);
      const z = thermal_decay * curvature_factor * 2 + angular_mode * curvature_factor * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 3, c: 2, d: 4, uSegments: 96, vSegments: 72 }),
    fusionDomains: ['general_relativity', 'thermal_engineering'],
    mathematicalDNA: ['exponential_decay', 'radial_symmetry', 'curvature_tensor'],
    publicationReference: 'Section 3.1.A: Relativity × Thermal Polar Fields'
  },

  warped_cop_schwarzschild: {
    name: "⚫ Warped COP: COP × (1 - r_s/r)^½",
    description: "Coefficient of Performance modulated by Schwarzschild metric. Efficiency changes near gravitational horizons - metaphor for extreme operating conditions.",
    equation: (u, v, params) => {
      const COP_base = params.a ?? 5;
      const M_mass = params.b ?? 1;
      const load = params.c ?? 0.5;
      const scale = params.d ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r_s = 2 * M_mass;
      const r = scale * (0.3 + Math.abs(load) * 0.7);
      
      const metric_factor = Math.sqrt(Math.max(0.01, 1 - r_s / Math.max(r, r_s + 0.1)));
      
      const COP_warped = COP_base * metric_factor * (1 - 0.5 * load * load);
      
      const radius = scale * (0.3 + COP_warped * 0.1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi) * metric_factor;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 1, c: 0.5, d: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 72 }),
    fusionDomains: ['general_relativity', 'thermal_engineering'],
    mathematicalDNA: ['schwarzschild_metric', 'efficiency_modulation'],
    publicationReference: 'Section 3.1.A: Warped COP Models'
  },

  // ============================================================================
  // 3.1.B: QUANTUM GRAVITY × INTERFERENCE COOLING
  // "Quantum-inspired cooling lattices, wave-modulated efficiency surfaces"
  // ============================================================================

  hawking_interference_cooling: {
    name: "🔥 Hawking-Interference: T_H × [1 + cos(k₁x)cos(k₂y)]",
    description: "Hawking radiation temperature spectrum fused with wave interference cooling. Quantum black hole thermodynamics meets optimized heat transfer.",
    equation: (u, v, params) => {
      const M = params.a ?? 2;
      const k1 = params.b ?? 4;
      const k2 = params.c ?? 4;
      const modDepth = params.d ?? 0.5;
      const scale = params.e ?? 4;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const r = Math.sqrt(x * x + y * y);
      
      const hbar = 1;
      const c = 1;
      const k_B = 1;
      const G = 1;
      const T_H = (hbar * c * c * c) / (8 * Math.PI * G * Math.max(M, 0.1) * k_B);
      
      const interference = 1 + modDepth * Math.cos(k1 * x) * Math.cos(k2 * y);
      
      const cooling_enhancement = T_H * interference;
      
      const radial_decay = Math.exp(-r * r / (2 * scale * scale));
      
      const z = cooling_enhancement * radial_decay * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 4, c: 4, d: 0.5, e: 4, uSegments: 128, vSegments: 128 }),
    fusionDomains: ['quantum_gravity', 'thermal_engineering'],
    mathematicalDNA: ['hawking_radiation', 'wave_interference', 'exponential_decay'],
    publicationReference: 'Section 3.1.B: Quantum Gravity × Interference Cooling'
  },

  quantum_cooling_lattice: {
    name: "🔷 Quantum Cooling Lattice: ψ² × COP × cos(kx)",
    description: "Probability amplitude modulated cooling efficiency. Creates lattice of optimal cooling points following quantum mechanical probability distributions.",
    equation: (u, v, params) => {
      const amplitude = params.a ?? 1;
      const COP = params.b ?? 5;
      const k = params.c ?? 6;
      const lattice_spacing = params.d ?? 1;
      const scale = params.e ?? 4;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const psi_real = Math.cos(k * x / lattice_spacing) * Math.cos(k * y / lattice_spacing);
      const psi_imag = Math.sin(k * x / lattice_spacing) * Math.sin(k * y / lattice_spacing);
      const probability = amplitude * (psi_real * psi_real + psi_imag * psi_imag);
      
      const modulated_COP = COP * probability;
      
      const z = modulated_COP * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 5, c: 6, d: 1, e: 4, uSegments: 128, vSegments: 128 }),
    fusionDomains: ['quantum_physics', 'thermal_engineering'],
    mathematicalDNA: ['wavefunction', 'probability_density', 'periodic_lattice'],
    publicationReference: 'Section 3.1.B: Quantum-Inspired Cooling Lattices'
  },

  // ============================================================================
  // 3.1.C: TENSOR ALGEBRA × SPHERICAL HARMONICS
  // "Tensor-harmonic hybrid fields, curvature tensors decomposed into Y_lm"
  // ============================================================================

  christoffel_harmonic_field: {
    name: "📐 Christoffel-Harmonic: Γᵃ_bc × Y_lm(θ,φ)",
    description: "Christoffel connection symbols decomposed into spherical harmonic modes. Creates shape generation using curvature tensor structure.",
    equation: (u, v, params) => {
      const gamma_scale = params.a ?? 1;
      const l = Math.floor(params.b ?? 2);
      const m = Math.floor(params.c ?? 1);
      const scale = params.d ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const Y_lm = Math.pow(Math.sin(phi), Math.abs(m)) * 
                   Math.cos(l * phi) * 
                   Math.cos(m * theta);
      
      const Gamma_r = gamma_scale * Math.cos(phi);
      const Gamma_theta = gamma_scale * Math.sin(theta) / Math.max(Math.sin(phi), 0.1);
      const Gamma_phi = gamma_scale * Math.cos(theta) * Math.sin(phi);
      
      const hybrid = Y_lm * (Gamma_r + 0.3 * Gamma_theta + 0.3 * Gamma_phi);
      
      const radius = scale * (0.5 + hybrid * 0.3);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 2, c: 1, d: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 }),
    fusionDomains: ['tensor_algebra', 'harmonic_analysis'],
    mathematicalDNA: ['christoffel_symbols', 'spherical_harmonics', 'curvature_tensor'],
    publicationReference: 'Section 3.1.C: Tensor Algebra × Spherical Harmonics'
  },

  riemann_harmonic_surface: {
    name: "🔶 Riemann-Harmonic: R_abcd × Σ c_lm Y_lm",
    description: "Riemann curvature tensor components expanded in spherical harmonic basis. Visualizes spacetime curvature through harmonic decomposition.",
    equation: (u, v, params) => {
      const c00 = params.a ?? 1;
      const c10 = params.b ?? 0.5;
      const c20 = params.c ?? 0.3;
      const c11 = params.d ?? 0.2;
      const curvature = params.e ?? 0.5;
      const scale = params.f ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const Y00 = 0.5 / Math.sqrt(Math.PI);
      const Y10 = Math.sqrt(3 / (4 * Math.PI)) * Math.cos(phi);
      const Y20 = Math.sqrt(5 / (16 * Math.PI)) * (3 * Math.cos(phi) * Math.cos(phi) - 1);
      const Y11 = -Math.sqrt(3 / (8 * Math.PI)) * Math.sin(phi) * Math.cos(theta);
      
      const harmonic_sum = c00 * Y00 + c10 * Y10 + c20 * Y20 + c11 * Y11;
      
      const R_component = curvature * (1 - Math.exp(-Math.sin(phi) * Math.sin(phi)));
      
      const hybrid = harmonic_sum * (1 + R_component);
      
      const radius = scale * (0.5 + hybrid * 0.4);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 0.5, c: 0.3, d: 0.2, e: 0.5, f: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 72 }),
    fusionDomains: ['tensor_algebra', 'harmonic_analysis', 'general_relativity'],
    mathematicalDNA: ['riemann_curvature', 'spherical_harmonics', 'tensor_decomposition'],
    publicationReference: 'Section 3.1.C: Tensor-Harmonic Hybrid Fields'
  },

  // ============================================================================
  // 3.1.D: POLYNOMIAL COP × HARMONIC DECOMPOSITION
  // "Ultra-smooth efficiency surfaces, harmonic thermal landscapes"
  // ============================================================================

  harmonic_cop_fourier: {
    name: "🎵 Harmonic COP: Σ aₙcos(nωL) × COP(L,T)",
    description: "COP polynomial rewritten as Fourier harmonic sum. Creates ultra-smooth efficiency surfaces with guaranteed continuity.",
    equation: (u, v, params) => {
      const a0 = params.a ?? 5;
      const a1 = params.b ?? 1;
      const a2 = params.c ?? 0.5;
      const a3 = params.d ?? 0.2;
      const omega = params.e ?? Math.PI;
      const scale = params.f ?? 4;
      
      const L = u;
      const T_norm = v;
      
      const harmonic_COP = a0 + 
                          a1 * Math.cos(1 * omega * L) +
                          a2 * Math.cos(2 * omega * L) +
                          a3 * Math.cos(3 * omega * L);
      
      const temperature_mod = 1 - 0.3 * (T_norm - 0.5) * (T_norm - 0.5);
      
      const COP_final = harmonic_COP * temperature_mod;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = COP_final * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5, b: 1, c: 0.5, d: 0.2, e: 3.14159, f: 4, uSegments: 96, vSegments: 72 }),
    fusionDomains: ['thermal_engineering', 'harmonic_analysis'],
    mathematicalDNA: ['fourier_series', 'polynomial_COP', 'continuity'],
    publicationReference: 'Section 3.1.D: Polynomial COP × Harmonic Decomposition'
  },

  thermal_landscape_chebyshev: {
    name: "🏔️ Thermal Landscape: T_n(x) × efficiency(y)",
    description: "Chebyshev polynomial thermal landscape. Minimizes oscillation (Runge phenomenon) for smooth efficiency interpolation.",
    equation: (u, v, params) => {
      const degree = Math.floor(params.a ?? 4);
      const amplitude = params.b ?? 3;
      const efficiency_base = params.c ?? 0.8;
      const scale = params.d ?? 4;
      
      const x_norm = 2 * u - 1;
      const y_norm = 2 * v - 1;
      
      let T_n = 0;
      for (let n = 0; n <= degree; n++) {
        const coeff = 1 / (n + 1);
        T_n += coeff * Math.cos(n * Math.acos(Math.max(-1, Math.min(1, x_norm))));
      }
      
      const efficiency = efficiency_base + 0.2 * Math.cos(Math.PI * y_norm);
      
      const landscape = T_n * efficiency * amplitude;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = landscape * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 3, c: 0.8, d: 4, uSegments: 96, vSegments: 72 }),
    fusionDomains: ['thermal_engineering', 'harmonic_analysis', 'approximation_theory'],
    mathematicalDNA: ['chebyshev_polynomial', 'efficiency_function', 'optimal_interpolation'],
    publicationReference: 'Section 3.1.D: Ultra-Smooth Efficiency Surfaces'
  }
};

export const CROSS_DOMAIN_HYBRID_SHAPE_COUNT = Object.keys(CROSS_DOMAIN_HYBRID_SHAPES).length;

export const CROSS_DOMAIN_CATEGORY = {
  id: 'cross_domain_hybrids',
  name: '🔗 Cross-Domain Mathematical Fusions',
  icon: '🔗',
  description: `Cross-Domain Hybrid Shapes: ${CROSS_DOMAIN_HYBRID_SHAPE_COUNT} novel parametric surfaces fusing relativity×thermal, quantum×cooling, tensor×harmonics, and COP×Fourier. Implements Section 3.1 of "THE DMENSION SYSTEM" publication - emergent mathematics from domain fusion.`,
  engineDynamics: {
    primaryType: 'hybrid' as const,
    symmetryOrder: 4,
    influenceFactors: ['relativity', 'quantum_physics', 'thermal_engineering', 'harmonic_analysis', 'tensor_algebra']
  },
  shapes: Object.keys(CROSS_DOMAIN_HYBRID_SHAPES)
};

export function generateHybridShapeReport(): string {
  let report = '═══════════════════════════════════════════════════════════════\n';
  report += '              CROSS-DOMAIN HYBRID SHAPES REPORT\n';
  report += '              DMENSION MATHEMATICAL UNIVERSE\n';
  report += '═══════════════════════════════════════════════════════════════\n\n';

  report += `Total Hybrid Shapes: ${CROSS_DOMAIN_HYBRID_SHAPE_COUNT}\n`;
  report += `Publication: "THE DMENSION SYSTEM: A CROSS-DOMAIN COMPUTATIONAL MATHEMATICAL FRAMEWORK"\n`;
  report += `Authors: UUON Foundation & Claude AI\n\n`;

  report += '───────────────────────────────────────────────────────────────\n';
  report += '                    FUSION CATEGORIES\n';
  report += '───────────────────────────────────────────────────────────────\n\n';

  const categories = {
    'Relativity × Thermal': ['relativistic_thermal_curvature', 'warped_cop_schwarzschild'],
    'Quantum × Cooling': ['hawking_interference_cooling', 'quantum_cooling_lattice'],
    'Tensor × Harmonics': ['christoffel_harmonic_field', 'riemann_harmonic_surface'],
    'COP × Fourier': ['harmonic_cop_fourier', 'thermal_landscape_chebyshev']
  };

  for (const [category, shapes] of Object.entries(categories)) {
    report += `${category}:\n`;
    for (const shapeId of shapes) {
      const shape = CROSS_DOMAIN_HYBRID_SHAPES[shapeId];
      if (shape) {
        report += `  • ${shape.name}\n`;
        report += `    DNA: ${shape.mathematicalDNA.join(', ')}\n`;
        report += `    Ref: ${shape.publicationReference}\n`;
      }
    }
    report += '\n';
  }

  return report;
}

export default CROSS_DOMAIN_HYBRID_SHAPES;
