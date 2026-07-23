/**
 * THEORY OF EVERYTHING CANDIDATE SHAPES
 * Mathematical visualizations of leading ToE candidate frameworks
 * String Theory, M-Theory, Loop Quantum Gravity, Standard Model, Grand Unification
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface ToEShape {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
  framework: 'string_theory' | 'm_theory' | 'loop_quantum_gravity' | 'standard_model' | 'grand_unification' | 'supersymmetry';
}

function getToEDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 48, vSegments: 32,
    ...overrides
  };
}

export const THEORY_OF_EVERYTHING_SHAPES: Record<string, ToEShape> = {

  // ============================================================================
  // STRING THEORY / M-THEORY
  // ============================================================================

  polyakov_action_worldsheet: {
    name: "🎻 Polyakov Action: S = -T/2 ∫d²σ √(-h) h^αβ ∂_α X^μ ∂_β X_μ",
    framework: 'string_theory',
    description: "String worldsheet action - equivalent to Nambu-Goto but with auxiliary metric",
    equation: (u, v, params) => {
      const tension = params.d ?? 2.0;
      const worldsheetScale = params.e ?? 3.0;
      const oscillations = params.f ?? 4;
      const tau = params.g ?? 0;
      
      const sigma = u * 2 * Math.PI;
      const tauParam = v * Math.PI;
      
      const stringRadius = worldsheetScale * (1 + 0.3 * Math.sin(oscillations * sigma + tau));
      const worldsheetMetric = Math.sqrt(1 + 0.2 * Math.cos(oscillations * tauParam));
      
      const x = stringRadius * Math.cos(sigma) * Math.sin(tauParam);
      const y = stringRadius * Math.sin(sigma) * Math.sin(tauParam);
      const z = worldsheetScale * Math.cos(tauParam) * worldsheetMetric + 
                tension * 0.2 * Math.sin(2 * sigma) * Math.cos(3 * tauParam);
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 2.0, e: 3.0, f: 4,uSegments: 48, vSegments: 32 })
  },

  superstring_vibration_modes: {
    name: "🎵 Superstring Vibration Modes: X^μ = Σ α_n^μ e^(-inτ) cos(nσ)",
    framework: 'string_theory',
    description: "Closed string vibration modes - different modes give different particles",
    equation: (u, v, params) => {
      const baseRadius = params.d ?? 2.5;
      const mode1 = params.e ?? 2;
      const mode2 = params.f ?? 3;
      const mode3 = params.g ?? 0;
      const amplitude = params.e ?? 0;
      
      const sigma = u * 2 * Math.PI;
      const tau = v * Math.PI;
      
      const alpha1 = 0.3 * Math.cos(mode1 * sigma) * Math.exp(-0.1 * tau);
      const alpha2 = 0.2 * Math.cos(mode2 * sigma) * Math.exp(-0.15 * tau);
      const alpha3 = (mode3 !== 0 ? 0.15 : 0) * Math.cos(mode3 * sigma) * Math.exp(-0.2 * tau);
      
      const r = baseRadius * (1 + alpha1 + alpha2 + alpha3 + amplitude * 0.1);
      
      const x = r * Math.cos(sigma) * Math.sin(tau);
      const y = r * Math.sin(sigma) * Math.sin(tau);
      const z = baseRadius * Math.cos(tau) + (alpha1 - alpha2) * baseRadius * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 2.5, e: 2, f: 3, uSegments: 48, vSegments: 32 })
  },

  m_theory_11d_membrane: {
    name: "🌐 M-Theory 11D Membrane: M2-Brane in 11D Supergravity",
    framework: 'm_theory',
    description: "M2-brane membrane in 11-dimensional M-theory spacetime",
    equation: (u, v, params) => {
      const braneRadius = params.d ?? 3.0;
      const tension = params.e ?? 1.5;
      const dim11Effect = params.f ?? 0.5;
      const phase = params.g ?? 0;
      
      const sigma1 = u * 2 * Math.PI;
      const sigma2 = v * 2 * Math.PI;
      
      const baseX = Math.cos(sigma1) * (1 + 0.3 * Math.cos(sigma2));
      const baseY = Math.sin(sigma1) * (1 + 0.3 * Math.cos(sigma2));
      const baseZ = 0.5 * Math.sin(sigma2);
      
      const dim7to11 = dim11Effect * Math.sin(sigma1 * 3 + sigma2 * 2 + phase) * 0.2;
      const dim8 = dim11Effect * Math.cos(sigma1 * 2 - sigma2 * 3) * 0.15;
      
      const x = braneRadius * baseX + dim7to11;
      const y = braneRadius * baseY + dim8;
      const z = tension * baseZ + dim7to11 * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.0, e: 1.5, f: 0.5,uSegments: 48, vSegments: 48 })
  },

  // ============================================================================
  // LOOP QUANTUM GRAVITY
  // ============================================================================

  ashtekar_connection_reformulation: {
    name: "🔗 Ashtekar Connection: A^i_a = Γ^i_a + γK^i_a",
    framework: 'loop_quantum_gravity',
    description: "Ashtekar-Barbero connection - reformulation of GR as gauge theory",
    equation: (u, v, params) => {
      const scale = params.d ?? 3.0;
      const gamma = params.e ?? 0.2375;
      const curvature = params.f ?? 1.0;
      const extrinsicK = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const spinConnection = Math.sin(theta * 2) * Math.cos(phi);
      const extrinsicCurvature = extrinsicK * Math.cos(theta) * Math.sin(phi * 2);
      const ashtekarA = spinConnection + gamma * extrinsicCurvature;
      
      const r = scale * (1 + curvature * 0.2 * ashtekarA);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + gamma * spinConnection * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.0, e: 0.2375, f: 1.0,uSegments: 48, vSegments: 36 })
  },

  lqg_hamiltonian_constraint: {
    name: "⚙️ LQG Hamiltonian Constraint: Ĥ|ψ⟩ = 0",
    framework: 'loop_quantum_gravity',
    description: "Quantum Hamiltonian constraint - dynamics of quantum geometry",
    equation: (u, v, params) => {
      const amplitude = params.d ?? 2.5;
      const discreteness = params.e ?? 8;
      const constraintStrength = params.f ?? 1.0;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const spatialCurvature = Math.sin(discreteness * theta / 4) * Math.cos(discreteness * phi / 4);
      const extrinsicTerm = Math.cos(theta * 2 + phase) * Math.sin(phi);
      
      const constraint = constraintStrength * (spatialCurvature * spatialCurvature - extrinsicTerm * extrinsicTerm);
      const r = amplitude * (1 + 0.15 * constraint);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + constraint * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 2.5, e: 8, f: 1.0,uSegments: 48, vSegments: 32 })
  },

  // ============================================================================
  // STANDARD MODEL / ELECTROWEAK
  // ============================================================================

  qcd_gluon_field: {
    name: "🔴 QCD Gluon Field: L_QCD = -1/4 G^a_μν G^aμν + ψ̄(iγ^μD_μ - m)ψ",
    framework: 'standard_model',
    description: "Quantum Chromodynamics - SU(3) gauge field of strong interaction",
    equation: (u, v, params) => {
      const strength = params.d ?? 3.0;
      const colorCharge = params.e ?? 3;
      const coupling = params.f ?? 1.0;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const gluonField1 = Math.sin(colorCharge * theta + phase) * Math.cos(phi);
      const gluonField2 = Math.cos(colorCharge * theta - phase) * Math.sin(phi);
      const gluonField3 = Math.sin(2 * theta) * Math.cos(2 * phi);
      
      const fieldStrength = coupling * Math.sqrt(
        gluonField1 * gluonField1 + gluonField2 * gluonField2 + gluonField3 * gluonField3
      );
      
      const r = strength * (1 + 0.25 * fieldStrength);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + gluonField1 * 0.2;
      const y = r * Math.sin(phi) * Math.sin(theta) + gluonField2 * 0.2;
      const z = r * Math.cos(phi) + gluonField3 * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.0, e: 3, f: 1.0,uSegments: 48, vSegments: 36 })
  },

  electroweak_unification: {
    name: "⚡ Electroweak Unification: SU(2)_L × U(1)_Y → U(1)_EM",
    framework: 'standard_model',
    description: "Weinberg-Salam electroweak theory - unification above 100 GeV",
    equation: (u, v, params) => {
      const scale = params.d ?? 3.0;
      const weakAngle = params.e ?? 0.2312;
      const symmetryBreaking = params.f ?? 1.0;
      const energy = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const thetaW = weakAngle * Math.PI;
      
      const su2Field = Math.cos(thetaW) * Math.sin(2 * theta) * Math.cos(phi);
      const u1Field = Math.sin(thetaW) * Math.cos(theta) * Math.sin(phi);
      
      const wBoson = su2Field * (1 - symmetryBreaking * 0.3);
      const zBoson = (Math.cos(thetaW) * su2Field - Math.sin(thetaW) * u1Field);
      const photon = (Math.sin(thetaW) * su2Field + Math.cos(thetaW) * u1Field);
      
      const unificationBlend = energy !== 0 ? Math.exp(-energy) : 1;
      const r = scale * (1 + 0.2 * (wBoson * unificationBlend + zBoson * (1 - unificationBlend)));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + photon * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.0, e: 0.2312, f: 1.0,uSegments: 48, vSegments: 36 })
  },

  // ============================================================================
  // SUPERSYMMETRY
  // ============================================================================

  supersymmetry_transformation: {
    name: "🔄 SUSY Transform: δ_ε φ = ε̄ψ, δ_ε ψ = iσ^μ ε̄ ∂_μφ",
    framework: 'supersymmetry',
    description: "Supersymmetry - transformations connecting bosons and fermions",
    equation: (u, v, params) => {
      const scale = params.d ?? 3.0;
      const susyParameter = params.e ?? 1.0;
      const spinorComponent = params.f ?? 2;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const bosonField = Math.cos(theta) * Math.sin(phi);
      const fermionField = Math.sin(spinorComponent * theta + phase) * Math.cos(phi);
      
      const susyTransform = susyParameter * (bosonField * fermionField);
      const superpartnerMix = Math.sin(theta + phi) * 0.2;
      
      const r = scale * (1 + 0.15 * susyTransform + superpartnerMix);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + fermionField * 0.1;
      const y = r * Math.sin(phi) * Math.sin(theta) + bosonField * 0.1;
      const z = r * Math.cos(phi) + susyTransform * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.0, e: 1.0, f: 2,uSegments: 48, vSegments: 36 })
  },

  // ============================================================================
  // GRAND UNIFICATION / HOLOGRAPHY
  // ============================================================================

  grand_unified_theory_gut: {
    name: "🌈 Grand Unified Theory: SU(5) → SU(3) × SU(2) × U(1)",
    framework: 'grand_unification',
    description: "GUT symmetry breaking - unification of strong and electroweak forces",
    equation: (u, v, params) => {
      const scale = params.d ?? 3.5;
      const gutScale = params.e ?? 1e16;
      const su5Breaking = params.f ?? 1.0;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const su3Component = Math.sin(3 * theta + phase) * Math.cos(phi);
      const su2Component = Math.sin(2 * theta - phase) * Math.sin(phi);
      const u1Component = Math.cos(theta) * Math.cos(phi);
      
      const su5Unified = su3Component + su2Component + u1Component;
      
      const brokenSymmetry = su5Breaking * (
        Math.abs(su3Component) + 
        Math.abs(su2Component) * 0.8 + 
        Math.abs(u1Component) * 0.6
      );
      
      const r = scale * (1 + 0.15 * brokenSymmetry);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + su3Component * 0.15;
      const y = r * Math.sin(phi) * Math.sin(theta) + su2Component * 0.15;
      const z = r * Math.cos(phi) + u1Component * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 3.5, e: 1e16, f: 1.0,uSegments: 48, vSegments: 36 })
  },

  holographic_principle_boundary: {
    name: "📺 Holographic Principle: S_bulk = S_boundary / 4G",
    framework: 'grand_unification',
    description: "AdS/CFT - bulk physics encoded on lower-dimensional boundary",
    equation: (u, v, params) => {
      const bulkRadius = params.d ?? 4.0;
      const boundaryThickness = params.e ?? 0.1;
      const informationDensity = params.f ?? 1.0;
      const adsCurvature = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const boundaryField = Math.sin(5 * theta) * Math.cos(4 * phi) * informationDensity;
      const bulkReconstruction = Math.exp(-boundaryThickness * (1 - Math.cos(phi)));
      
      const adsWarping = adsCurvature !== 0 ? Math.cosh(adsCurvature * 0.5) : 1;
      
      const innerBulk = (bulkRadius - 1) * bulkReconstruction;
      const outerBoundary = bulkRadius * (1 + boundaryField * 0.1);
      
      const r = innerBulk + (outerBoundary - innerBulk) * (1 - boundaryThickness) / adsWarping;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + boundaryField * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getToEDefaults({ d: 4.0, e: 0.1, f: 1.0,uSegments: 48, vSegments: 36 })
  }
};

console.log(`🔬 Loaded ${Object.keys(THEORY_OF_EVERYTHING_SHAPES).length} Theory of Everything candidate visualizations 🌌⚛️🎻`);
