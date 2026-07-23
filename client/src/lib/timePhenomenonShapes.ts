/**
 * TIME PRINCIPLE & PHENOMENON PRINCIPLE SHAPES
 * GEIA CORE MATHEMATICAL FRAMEWORK
 * 
 * Named after Gaia/Geia (Earth), representing the living, breathing mathematical
 * universe where geometry, energy, information, and natural laws converge.
 * 
 * Two foundational philosophical frameworks for understanding reality:
 * 
 * THE NOW PRINCIPLE (Time Principle):
 * "Time is the boundary where potential becomes form."
 * The present moment as the conversion point between past (fixed pattern) 
 * and future (unfixed possibility). Now is the universal transformation 
 * operator where potential becomes form.
 * 
 * THE PHENOMENON PRINCIPLE (GEIA):
 * "A phenomenon is reality expressing itself through structure, energy, and information."
 * 
 * GEIA EQUATION: P = f(G, E, I, Λ)
 * Where:
 *   G = Geometry/Structure (2,281+ mathematical shapes in Dmension)
 *   E = Energy flows (Cross-Learning Engine energy system)
 *   I = Information patterns (Mathematical Consciousness OS + Token metadata)
 *   Λ = Natural laws (Parameter Authority + Physics-aware constraints)
 * 
 * PERFECT PLATFORM ALIGNMENT:
 * - Structure (G): 2,281+ parametric visualizations with geometric forms
 * - Energy (E): Cross-learning engine with energy capture/storage systems
 * - Information (I): Mathematical Consciousness OS + shape token ecosystem
 * - Natural Laws (Λ): Parameter Authority + physics-aware systems
 * 
 * Mathematical Formulations:
 * - Differential Boundary: Present = lim(Δt→0) dReality/dt
 * - Probability Collapse: Now = Collapse(Ψ_future) → Ψ_real
 * - Algorithmic Commit: Now(x) = f(x_{t-1}) → x_t
 * - Flow Operator: Reality(t) = F(Potential, Laws)
 * - Phenomenon Field: P(x,t) = Φ(S(x), E(x,t), I(x), Λ)
 * - Emergence: lim(n→∞) F^(n)(x_0)
 * - Phenomenon Condition: S ≠ 0, E ≠ 0, I ≠ 0
 */

import type { ParametricSurface } from './unifiedShapes';

// =============================================================================
// TIME PRINCIPLE SHAPES (The Now Principle)
// =============================================================================

/**
 * Differential Boundary Surface
 * Present = lim(Δt→0) dReality/dt
 * The infinitely thin slice where reality changes
 */
const differentialBoundarySurface: ParametricSurface = {
  name: "Differential Boundary (Present Moment)",
  category: "Time Principle",
  formula: "Present = lim(Δt→0) dReality/dt",
  description: "The infinitely thin slice where reality changes, the differential boundary between past and future",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 0.5;
    const t = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const deltaT = 0.001;
    const pastRadius = A * (1 + D * Math.sin(3 * t - deltaT));
    const futureRadius = A * (1 + D * Math.sin(3 * t + deltaT));
    const presentRadius = (pastRadius + futureRadius) / 2;
    return presentRadius * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 0.5;
    const t = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const presentRadius = A * (1 + D * Math.sin(3 * t));
    return presentRadius * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const E = params.E ?? 1;
    const t = u * Math.PI;
    const derivative = Math.cos(3 * t) * 3;
    return C * (t - Math.PI / 2) + E * derivative * 0.2;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 0.5, E: 0.3 }
};

/**
 * Probability Collapse Surface
 * Now = Collapse(Ψ_future) → Ψ_real
 * Like quantum measurement but generalized
 */
const probabilityCollapseSurface: ParametricSurface = {
  name: "Probability Collapse (Quantum Now)",
  category: "Time Principle",
  formula: "Now = Collapse(Ψ_future) → Ψ_real",
  description: "The present as a constant measurement event, collapsing probability into reality",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const superposition = Math.sin(D * theta) * Math.cos(D * phi);
    const collapsed = Math.tanh(superposition * 2);
    const blend = Math.pow(Math.sin(theta / 2), 2);
    const radius = A * (1 + 0.3 * (superposition * (1 - blend) + collapsed * blend));
    return radius * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const superposition = Math.sin(D * theta) * Math.cos(D * phi);
    const collapsed = Math.tanh(superposition * 2);
    const blend = Math.pow(Math.sin(theta / 2), 2);
    const radius = A * (1 + 0.3 * (superposition * (1 - blend) + collapsed * blend));
    return radius * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const superposition = Math.sin(D * theta) * Math.cos(D * phi);
    const collapsed = Math.tanh(superposition * 2);
    const blend = Math.pow(Math.sin(theta / 2), 2);
    const radius = A * (1 + 0.3 * (superposition * (1 - blend) + collapsed * blend));
    return radius * Math.cos(theta) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 3 }
};

/**
 * Algorithmic Commit Flow
 * Now(x) = f(x_{t-1}) → x_t
 * The commit step between states
 */
const algorithmicCommitFlow: ParametricSurface = {
  name: "Algorithmic Commit (State Transition)",
  category: "Time Principle",
  formula: "Now(x) = f(x_{t-1}) → x_t",
  description: "The present as a computational commit step between past and future states",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 5;
    const t = u * 4 * Math.PI;
    const s = v * 2 - 1;
    let x_prev = 0.1;
    const iterations = Math.floor(t / (Math.PI / 2)) % 8;
    for (let i = 0; i < iterations; i++) {
      x_prev = Math.sin(x_prev * D + i * 0.5);
    }
    return A * (t / (2 * Math.PI) - 1) * B + x_prev * 0.3;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 5;
    const t = u * 4 * Math.PI;
    const s = v * 2 - 1;
    let x_current = 0.1;
    const iterations = Math.floor(t / (Math.PI / 2)) % 8;
    for (let i = 0; i <= iterations; i++) {
      x_current = Math.sin(x_current * D + i * 0.5);
    }
    return A * s * B + x_current * 0.5;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const D = params.D ?? 5;
    const t = u * 4 * Math.PI;
    const s = v * 2 - 1;
    let commit_value = 0.1;
    const iterations = Math.floor(t / (Math.PI / 2)) % 8;
    for (let i = 0; i <= iterations; i++) {
      commit_value = Math.sin(commit_value * D + i * 0.5);
    }
    return C * commit_value * (1 + 0.2 * Math.sin(s * Math.PI));
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 80, vSegments: 40,
  defaultParams: { A: 1, B: 1, C: 1, D: 5 }
};

/**
 * Flow Operator Manifold
 * Reality(t) = F(Potential, Laws)
 * The execution of the universal function
 */
const flowOperatorManifold: ParametricSurface = {
  name: "Flow Operator (Reality Function)",
  category: "Time Principle",
  formula: "Reality(t) = F(Potential, Laws)",
  description: "The present as the execution of the universal function transforming potential into reality",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1;
    const potential = u * 2 * Math.PI;
    const law = v * Math.PI;
    const F_operator = Math.sin(D * potential) * Math.cos(E * law);
    return A * (1 + 0.3 * F_operator) * Math.cos(potential) * Math.sin(law) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1;
    const potential = u * 2 * Math.PI;
    const law = v * Math.PI;
    const F_operator = Math.sin(D * potential) * Math.cos(E * law);
    return A * (1 + 0.3 * F_operator) * Math.sin(potential) * Math.sin(law) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1;
    const potential = u * 2 * Math.PI;
    const law = v * Math.PI;
    const F_operator = Math.sin(D * potential) * Math.cos(E * law);
    return A * (1 + 0.3 * F_operator) * Math.cos(law) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 2, E: 1 }
};

/**
 * Past-Present-Future Ribbon
 * Visualizes the continuous flow from fixed past through active present to potential future
 */
const pastPresentFutureRibbon: ParametricSurface = {
  name: "Past-Present-Future Ribbon",
  category: "Time Principle",
  formula: "Time = Past(fixed) → Present(active) → Future(potential)",
  description: "The continuous ribbon of time flowing from crystallized past through active present into potential future",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const t = u * 4 * Math.PI - 2 * Math.PI;
    const width = (v - 0.5) * 2;
    const pastFactor = Math.max(0, -t / (2 * Math.PI));
    const futureFactor = Math.max(0, t / (2 * Math.PI));
    const presentFactor = 1 - Math.abs(t) / (2 * Math.PI);
    const presentFocus = Math.max(0, presentFactor);
    const turbulence = pastFactor * 0.1 + presentFocus * 0.5 + futureFactor * 0.3;
    return A * (t / Math.PI + Math.sin(D * t) * turbulence * 0.3) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const t = u * 4 * Math.PI - 2 * Math.PI;
    const width = (v - 0.5) * 2;
    const presentFactor = 1 - Math.abs(t) / (2 * Math.PI);
    const presentFocus = Math.max(0, presentFactor);
    const ribbonWidth = 0.3 + presentFocus * 0.5;
    return A * width * ribbonWidth * B + Math.cos(D * t) * presentFocus * 0.2;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const D = params.D ?? 3;
    const t = u * 4 * Math.PI - 2 * Math.PI;
    const width = (v - 0.5) * 2;
    const presentFactor = 1 - Math.abs(t) / (2 * Math.PI);
    const presentFocus = Math.max(0, presentFactor);
    return C * (Math.sin(t) * 0.3 + presentFocus * Math.sin(D * width * Math.PI) * 0.3);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 100, vSegments: 30,
  defaultParams: { A: 1, B: 1, C: 1, D: 3 }
};

/**
 * Temporal Engine Core
 * The engine that drives all temporal transformations
 */
const temporalEngineCore: ParametricSurface = {
  name: "Temporal Engine Core",
  category: "Time Principle",
  formula: "T_engine = ∂/∂t × Φ(state)",
  description: "The core mechanism that drives temporal transformations, the engine of existence",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 4;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const r = A * (1 + 0.3 * Math.sin(D * theta) * Math.cos(D * phi));
    const gear1 = 0.15 * Math.sin(6 * theta + phi);
    const gear2 = 0.1 * Math.cos(8 * theta - 2 * phi);
    return (r + gear1 + gear2) * Math.cos(theta) * (0.5 + 0.5 * Math.sin(phi)) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 4;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const r = A * (1 + 0.3 * Math.sin(D * theta) * Math.cos(D * phi));
    const gear1 = 0.15 * Math.sin(6 * theta + phi);
    const gear2 = 0.1 * Math.cos(8 * theta - 2 * phi);
    return (r + gear1 + gear2) * Math.sin(theta) * (0.5 + 0.5 * Math.sin(phi)) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 4;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const temporal_flow = Math.sin(phi) * 0.5;
    const engine_pulse = 0.2 * Math.sin(D * theta) * Math.sin(D * phi);
    return C * (temporal_flow + engine_pulse);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 80, vSegments: 80,
  defaultParams: { A: 1, B: 1, C: 1, D: 4 }
};

/**
 * Now Moment Crystallization
 * The instant where potential crystallizes into form
 */
const nowMomentCrystallization: ParametricSurface = {
  name: "Now Moment (Crystallization Point)",
  category: "Time Principle",
  formula: "Now = Crystallize(Potential) → Form",
  description: "The present moment where potential crystallizes into actual structure",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 6;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const crystal = Math.abs(Math.sin(D * theta) * Math.cos(D * phi));
    const smooth = Math.sin(theta);
    const blend = Math.pow(Math.cos(theta - Math.PI / 2), 4);
    const radius = A * (smooth * (1 - blend) + crystal * blend * 0.3 + smooth * blend * 0.7);
    return radius * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 6;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const crystal = Math.abs(Math.sin(D * theta) * Math.cos(D * phi));
    const smooth = Math.sin(theta);
    const blend = Math.pow(Math.cos(theta - Math.PI / 2), 4);
    const radius = A * (smooth * (1 - blend) + crystal * blend * 0.3 + smooth * blend * 0.7);
    return radius * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 6;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const crystal = Math.abs(Math.sin(D * theta) * Math.cos(D * phi));
    const smooth = Math.sin(theta);
    const blend = Math.pow(Math.cos(theta - Math.PI / 2), 4);
    const radius = A * (smooth * (1 - blend) + crystal * blend * 0.3 + smooth * blend * 0.7);
    return radius * Math.cos(theta) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 80, vSegments: 80,
  defaultParams: { A: 1, B: 1, C: 1, D: 6 }
};

// =============================================================================
// PHENOMENON PRINCIPLE SHAPES
// =============================================================================

/**
 * Phenomenon Field Surface
 * P(x,t) = Φ(S(x), E(x,t), I(x), Λ)
 * The complete phenomenon field equation
 */
const phenomenonFieldSurface: ParametricSurface = {
  name: "Phenomenon Field (Complete Form)",
  category: "Phenomenon Principle",
  formula: "P(x,t) = Φ(S(x), E(x,t), I(x), Λ)",
  description: "The unified phenomenon field where structure, energy, information, and natural laws interact",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1.5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = Math.sin(D * theta);
    const Energy = Math.cos(E * phi);
    const I = 0.5 + 0.5 * Math.sin(3 * theta + 2 * phi);
    const Lambda = 1 + 0.2 * Math.sin(5 * theta * phi);
    const P = A * (1 + 0.3 * S * Energy * I) * Lambda;
    return P * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1.5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = Math.sin(D * theta);
    const Energy = Math.cos(E * phi);
    const I = 0.5 + 0.5 * Math.sin(3 * theta + 2 * phi);
    const Lambda = 1 + 0.2 * Math.sin(5 * theta * phi);
    const P = A * (1 + 0.3 * S * Energy * I) * Lambda;
    return P * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 1.5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = Math.sin(D * theta);
    const Energy = Math.cos(E * phi);
    const I = 0.5 + 0.5 * Math.sin(3 * theta + 2 * phi);
    const Lambda = 1 + 0.2 * Math.sin(5 * theta * phi);
    const P = A * (1 + 0.3 * S * Energy * I) * Lambda;
    return P * Math.cos(theta) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 2, E: 1.5 }
};

/**
 * Structure-Energy-Information Intersection
 * The phenomenon exists only when S ≠ 0, E ≠ 0, I ≠ 0
 */
const structureEnergyInformationIntersection: ParametricSurface = {
  name: "Structure-Energy-Information Intersection",
  category: "Phenomenon Principle",
  formula: "Phenomenon ⟺ (S ≠ 0) ∧ (E ≠ 0) ∧ (I ≠ 0)",
  description: "The intersection of structure, energy, and information where phenomena manifest",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = 0.8 + 0.2 * Math.cos(3 * theta);
    const E_factor = 0.8 + 0.2 * Math.sin(3 * phi);
    const I_factor = 0.8 + 0.2 * Math.cos(2 * theta + 2 * phi);
    const intersection = S * E_factor * I_factor;
    const r = A * intersection;
    return r * (Math.cos(theta) * (1 + 0.3 * Math.cos(phi))) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = 0.8 + 0.2 * Math.cos(3 * theta);
    const E_factor = 0.8 + 0.2 * Math.sin(3 * phi);
    const I_factor = 0.8 + 0.2 * Math.cos(2 * theta + 2 * phi);
    const intersection = S * E_factor * I_factor;
    const r = A * intersection;
    return r * (Math.sin(theta) * (1 + 0.3 * Math.cos(phi))) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const S = 0.8 + 0.2 * Math.cos(3 * theta);
    const E_factor = 0.8 + 0.2 * Math.sin(3 * phi);
    const I_factor = 0.8 + 0.2 * Math.cos(2 * theta + 2 * phi);
    const intersection = S * E_factor * I_factor;
    return A * intersection * Math.sin(phi) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

/**
 * Emergence Limit Surface
 * Emergence = lim(n→∞) F^(n)(x_0)
 * The mathematical birth of phenomena
 */
const emergenceLimitSurface: ParametricSurface = {
  name: "Emergence Limit (Iterative Birth)",
  category: "Phenomenon Principle",
  formula: "Emergence = lim(n→∞) F^(n)(x₀)",
  description: "The emergence of phenomena through iterative application of transformation functions",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3.5;
    const iterations = 8;
    let x = u * 2 - 1;
    let y_val = v * 2 - 1;
    for (let n = 0; n < iterations; n++) {
      const x_new = Math.sin(D * x) - y_val * 0.5;
      const y_new = Math.cos(D * y_val) + x * 0.5;
      x = x_new * 0.8;
      y_val = y_new * 0.8;
    }
    return A * x * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3.5;
    const iterations = 8;
    let x = u * 2 - 1;
    let y_val = v * 2 - 1;
    for (let n = 0; n < iterations; n++) {
      const x_new = Math.sin(D * x) - y_val * 0.5;
      const y_new = Math.cos(D * y_val) + x * 0.5;
      x = x_new * 0.8;
      y_val = y_new * 0.8;
    }
    return A * y_val * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 3.5;
    const iterations = 8;
    let x = u * 2 - 1;
    let y_val = v * 2 - 1;
    let z_val = 0;
    for (let n = 0; n < iterations; n++) {
      const x_new = Math.sin(D * x) - y_val * 0.5;
      const y_new = Math.cos(D * y_val) + x * 0.5;
      z_val += Math.sqrt(x * x + y_val * y_val) * 0.1;
      x = x_new * 0.8;
      y_val = y_new * 0.8;
    }
    return A * z_val * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 80, vSegments: 80,
  defaultParams: { A: 1, B: 1, C: 1, D: 3.5 }
};

/**
 * Energy Flow Field
 * dX/dt = V(X,t)
 * The driving force of phenomena
 */
const energyFlowField: ParametricSurface = {
  name: "Energy Flow Field (Change Driver)",
  category: "Phenomenon Principle",
  formula: "dX/dt = V(X,t)",
  description: "The energy flow that drives all phenomenal change, the force behind manifestation",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const t = u * 2 * Math.PI;
    const X = v * 2 - 1;
    const V = D * Math.sin(t) * Math.exp(-X * X);
    return A * (t / Math.PI - 1 + V * 0.3) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const t = u * 2 * Math.PI;
    const X = v * 2 - 1;
    const V = D * Math.sin(t) * Math.exp(-X * X);
    const dX_dt = V * Math.cos(t * 2);
    return A * (X + dX_dt * 0.2) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const D = params.D ?? 2;
    const t = u * 2 * Math.PI;
    const X = v * 2 - 1;
    const V = D * Math.sin(t) * Math.exp(-X * X);
    return C * V * 0.5;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 2 }
};

/**
 * Information Entropy Surface
 * H = -Σ p_i log(p_i)
 * The pattern inside the phenomenon
 */
const informationEntropySurface: ParametricSurface = {
  name: "Information Entropy (Order Pattern)",
  category: "Phenomenon Principle",
  formula: "H = -Σ pᵢ log(pᵢ)",
  description: "Shannon entropy surface showing information patterns within phenomena",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const p = 0.5 + 0.4 * Math.sin(3 * theta) * Math.cos(2 * phi);
    const p_clamped = Math.max(0.01, Math.min(0.99, p));
    const H = -(p_clamped * Math.log(p_clamped) + (1 - p_clamped) * Math.log(1 - p_clamped));
    const r = A * (1 + 0.3 * H);
    return r * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const p = 0.5 + 0.4 * Math.sin(3 * theta) * Math.cos(2 * phi);
    const p_clamped = Math.max(0.01, Math.min(0.99, p));
    const H = -(p_clamped * Math.log(p_clamped) + (1 - p_clamped) * Math.log(1 - p_clamped));
    const r = A * (1 + 0.3 * H);
    return r * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const p = 0.5 + 0.4 * Math.sin(3 * theta) * Math.cos(2 * phi);
    const p_clamped = Math.max(0.01, Math.min(0.99, p));
    const H = -(p_clamped * Math.log(p_clamped) + (1 - p_clamped) * Math.log(1 - p_clamped));
    const r = A * (1 + 0.3 * H);
    return r * Math.cos(theta) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

/**
 * Structural Topology Surface
 * S = Topology + Geometry
 * What something is allowed to be
 */
const structuralTopologySurface: ParametricSurface = {
  name: "Structural Topology (Allowed Form)",
  category: "Phenomenon Principle",
  formula: "S = Topology + Geometry",
  description: "The structural constraints that define what phenomena are allowed to manifest",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const topology = (2 + Math.cos(phi)) * Math.cos(theta);
    const geometry = 0.2 * Math.sin(D * theta) * Math.cos(D * phi);
    return A * (topology * 0.3 + geometry) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const theta = u * 2 * Math.PI;
    const phi = v * 2 * Math.PI;
    const topology = (2 + Math.cos(phi)) * Math.sin(theta);
    const geometry = 0.2 * Math.sin(D * theta) * Math.sin(D * phi);
    return A * (topology * 0.3 + geometry) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 2;
    const phi = v * 2 * Math.PI;
    const theta = u * 2 * Math.PI;
    const topology = Math.sin(phi);
    const geometry = 0.1 * Math.sin(D * theta + D * phi);
    return A * (topology * 0.3 + geometry) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 2 }
};

/**
 * Natural Laws Constraint Manifold
 * Lambda: The governing physical/biological laws
 */
const naturalLawsConstraintManifold: ParametricSurface = {
  name: "Natural Laws Manifold (Λ Constraints)",
  category: "Phenomenon Principle",
  formula: "Λ = Physical/Biological Laws",
  description: "The manifold of natural law constraints governing phenomenal manifestation",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const gravity_like = Math.exp(-theta);
    const electromagnetic_like = Math.sin(D * phi);
    const strong_like = Math.exp(-5 * Math.pow(theta - 0.5, 2));
    const weak_like = 0.1 * Math.sin(10 * theta) * Math.exp(-theta);
    const Lambda = 1 + 0.2 * (gravity_like + electromagnetic_like * 0.3 + strong_like * 0.2 + weak_like);
    return A * Lambda * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const gravity_like = Math.exp(-theta);
    const electromagnetic_like = Math.sin(D * phi);
    const strong_like = Math.exp(-5 * Math.pow(theta - 0.5, 2));
    const weak_like = 0.1 * Math.sin(10 * theta) * Math.exp(-theta);
    const Lambda = 1 + 0.2 * (gravity_like + electromagnetic_like * 0.3 + strong_like * 0.2 + weak_like);
    return A * Lambda * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 3;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const gravity_like = Math.exp(-theta);
    const electromagnetic_like = Math.sin(D * phi);
    const strong_like = Math.exp(-5 * Math.pow(theta - 0.5, 2));
    const weak_like = 0.1 * Math.sin(10 * theta) * Math.exp(-theta);
    const Lambda = 1 + 0.2 * (gravity_like + electromagnetic_like * 0.3 + strong_like * 0.2 + weak_like);
    return A * Lambda * Math.cos(theta) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 3 }
};

// =============================================================================
// UNIFIED TIME-PHENOMENON SHAPES
// =============================================================================

/**
 * Reality Manifestation Engine
 * Combines Time Principle (Now) with Phenomenon Principle (What Appears)
 */
const realityManifestationEngine: ParametricSurface = {
  name: "Reality Manifestation Engine",
  category: "Unified Principles",
  formula: "Reality = Now(Phenomenon(S,E,I,Λ))",
  description: "The unified engine combining temporal transformation with phenomenal manifestation",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 3;
    const t = u * 2 * Math.PI;
    const space = v * 2 * Math.PI;
    const now_operator = Math.sin(t);
    const phenomenon = Math.sin(D * space) * Math.cos(E * t);
    const reality = now_operator * phenomenon;
    const r = A * (1 + 0.3 * reality);
    return r * Math.cos(t) * Math.sin(space) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 3;
    const t = u * 2 * Math.PI;
    const space = v * 2 * Math.PI;
    const now_operator = Math.sin(t);
    const phenomenon = Math.sin(D * space) * Math.cos(E * t);
    const reality = now_operator * phenomenon;
    const r = A * (1 + 0.3 * reality);
    return r * Math.sin(t) * Math.sin(space) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 2;
    const E = params.E ?? 3;
    const t = u * 2 * Math.PI;
    const space = v * 2 * Math.PI;
    const now_operator = Math.sin(t);
    const phenomenon = Math.sin(D * space) * Math.cos(E * t);
    const reality = now_operator * phenomenon;
    const r = A * (1 + 0.3 * reality);
    return r * Math.cos(space) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 2, E: 3 }
};

/**
 * Consciousness Perception Layer
 * Perception = Sampling(Present)
 */
const consciousnessPerceptionLayer: ParametricSurface = {
  name: "Consciousness Perception Layer",
  category: "Unified Principles",
  formula: "Perception = Sample(Present, Consciousness)",
  description: "The layer where consciousness samples the present moment to perceive reality",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const consciousness_field = Math.sin(theta) * Math.cos(phi);
    const sample_points = Math.floor(D * 4);
    const quantized_theta = Math.floor(theta * sample_points) / sample_points * Math.PI;
    const quantized_phi = Math.floor(phi * sample_points) / sample_points * 2 * Math.PI;
    const blend = 0.7;
    const perceived_r = A * (1 + 0.2 * consciousness_field);
    const x_continuous = perceived_r * Math.sin(theta) * Math.cos(phi);
    const x_sampled = perceived_r * Math.sin(quantized_theta) * Math.cos(quantized_phi);
    return (x_continuous * (1 - blend) + x_sampled * blend) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const consciousness_field = Math.sin(theta) * Math.cos(phi);
    const sample_points = Math.floor(D * 4);
    const quantized_theta = Math.floor(theta * sample_points) / sample_points * Math.PI;
    const quantized_phi = Math.floor(phi * sample_points) / sample_points * 2 * Math.PI;
    const blend = 0.7;
    const perceived_r = A * (1 + 0.2 * consciousness_field);
    const y_continuous = perceived_r * Math.sin(theta) * Math.sin(phi);
    const y_sampled = perceived_r * Math.sin(quantized_theta) * Math.sin(quantized_phi);
    return (y_continuous * (1 - blend) + y_sampled * blend) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 5;
    const theta = u * Math.PI;
    const phi = v * 2 * Math.PI;
    const consciousness_field = Math.sin(theta) * Math.cos(phi);
    const sample_points = Math.floor(D * 4);
    const quantized_theta = Math.floor(theta * sample_points) / sample_points * Math.PI;
    const blend = 0.7;
    const perceived_r = A * (1 + 0.2 * consciousness_field);
    const z_continuous = perceived_r * Math.cos(theta);
    const z_sampled = perceived_r * Math.cos(quantized_theta);
    return (z_continuous * (1 - blend) + z_sampled * blend) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1, D: 5 }
};

/**
 * Universal Operating System Layer
 * The active layer of the universe's operating system
 */
const universalOperatingSystemLayer: ParametricSurface = {
  name: "Universal Operating System",
  category: "Unified Principles",
  formula: "Universe_OS = Active_Layer(Now, Phenomena)",
  description: "The present as the active layer of the universe's operating system, like a rendering loop",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 4;
    const t = u * 2 * Math.PI;
    const layer = v * Math.PI;
    const render_frame = Math.sin(D * t);
    const process_layer = Math.cos(3 * layer);
    const os_state = render_frame * process_layer;
    const r = A * (1 + 0.2 * os_state);
    return r * Math.cos(t) * (0.5 + 0.5 * Math.sin(layer)) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const D = params.D ?? 4;
    const t = u * 2 * Math.PI;
    const layer = v * Math.PI;
    const render_frame = Math.sin(D * t);
    const process_layer = Math.cos(3 * layer);
    const os_state = render_frame * process_layer;
    const r = A * (1 + 0.2 * os_state);
    return r * Math.sin(t) * (0.5 + 0.5 * Math.sin(layer)) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const D = params.D ?? 4;
    const t = u * 2 * Math.PI;
    const layer = v * Math.PI;
    const render_frame = Math.sin(D * t);
    const process_layer = Math.cos(3 * layer);
    const os_state = render_frame * process_layer;
    return A * (0.5 * Math.cos(layer) + 0.2 * os_state) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 80, vSegments: 40,
  defaultParams: { A: 1, B: 1, C: 1, D: 4 }
};

// =============================================================================
// EXPORT ALL SHAPES
// =============================================================================

export const TIME_PRINCIPLE_SHAPES: Record<string, ParametricSurface> = {
  'differential-boundary': differentialBoundarySurface,
  'probability-collapse': probabilityCollapseSurface,
  'algorithmic-commit': algorithmicCommitFlow,
  'flow-operator': flowOperatorManifold,
  'past-present-future': pastPresentFutureRibbon,
  'temporal-engine': temporalEngineCore,
  'now-crystallization': nowMomentCrystallization,
};

export const PHENOMENON_PRINCIPLE_SHAPES: Record<string, ParametricSurface> = {
  'phenomenon-field': phenomenonFieldSurface,
  'sei-intersection': structureEnergyInformationIntersection,
  'emergence-limit': emergenceLimitSurface,
  'energy-flow-field': energyFlowField,
  'information-entropy': informationEntropySurface,
  'structural-topology': structuralTopologySurface,
  'natural-laws-manifold': naturalLawsConstraintManifold,
};

export const UNIFIED_PRINCIPLE_SHAPES: Record<string, ParametricSurface> = {
  'reality-manifestation': realityManifestationEngine,
  'consciousness-perception': consciousnessPerceptionLayer,
  'universal-os': universalOperatingSystemLayer,
};

export const ALL_TIME_PHENOMENON_SHAPES: Record<string, ParametricSurface> = {
  ...TIME_PRINCIPLE_SHAPES,
  ...PHENOMENON_PRINCIPLE_SHAPES,
  ...UNIFIED_PRINCIPLE_SHAPES,
};

console.log(`⏱️ Time Principle Shapes loaded: ${Object.keys(TIME_PRINCIPLE_SHAPES).length} shapes`);
console.log(`   📍 Differential Boundary, Probability Collapse, Algorithmic Commit`);
console.log(`   🔄 Flow Operator, Past-Present-Future, Temporal Engine, Now Crystallization`);
console.log(`🌟 Phenomenon Principle Shapes loaded: ${Object.keys(PHENOMENON_PRINCIPLE_SHAPES).length} shapes`);
console.log(`   📐 Structure-Energy-Information, Emergence Limit, Energy Flow`);
console.log(`   📊 Information Entropy, Structural Topology, Natural Laws`);
console.log(`🔮 Unified Principle Shapes loaded: ${Object.keys(UNIFIED_PRINCIPLE_SHAPES).length} shapes`);
console.log(`   💫 Reality Manifestation, Consciousness Perception, Universal OS`);
