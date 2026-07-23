/**
 * ENTROPIC PRINCIPLES & ANTHROPIC COSMOLOGY
 * Advanced Theoretical Physics Visualizations
 * Causal Entropic Principle, Anthropic Reasoning, Thermodynamic Cosmology
 * © 2025 UUON Foundation Inc. - Proprietary Research
 */

import { SurfaceParameters } from '../types/math';

export interface EntropicShape {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
  category: 'anthropic' | 'entropy' | 'causal_entropic' | 'thermodynamic_cosmology' | 'information_entropy';
}

function getEntropicDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 128, vSegments: 64,
    ...overrides
  };
}

const k_B = 1.380649e-23;  // Boltzmann constant
const hbar = 1.054571817e-34;  // Reduced Planck constant
const c = 299792458;  // Speed of light
const G = 6.67430e-11;  // Gravitational constant
const PHI = (1 + Math.sqrt(5)) / 2;  // Golden ratio

export const ENTROPIC_PRINCIPLES: Record<string, EntropicShape> = {

  // ============================================================================
  // SECTION 1: ANTHROPIC PRINCIPLE VISUALIZATIONS
  // ============================================================================

  anthropic_principle_surface: {
    name: "👁️ Anthropic Principle: P(observer|Λ,Q) Parameter Landscape",
    category: 'anthropic',
    description: "Observer probability as function of cosmological constant Λ and density fluctuation Q",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const lambdaRange = params.e ?? 3;  // Cosmological constant range
      const qRange = params.f ?? 2;       // Density fluctuation range
      
      const lambda = (u / Math.PI - 1) * lambdaRange;  // Λ parameter
      const Q = (v / Math.PI - 0.5) * qRange;          // Q parameter
      
      // Anthropic probability - observers exist only in "Goldilocks" zone
      const lambda_optimal = 0;  // Our universe's Λ ≈ 0
      const Q_optimal = 0.5;     // Our universe's Q ≈ 10^-5 (scaled)
      
      // Gaussian probability landscape around habitable parameters
      const P_lambda = Math.exp(-lambda * lambda / 2);
      const P_Q = Math.exp(-(Q - Q_optimal) * (Q - Q_optimal) / 0.5);
      const P_observer = P_lambda * P_Q;
      
      return [
        scale * lambda,
        scale * Q,
        scale * P_observer * 2
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 3, f: 2, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI })
  },

  anthropic_fine_tuning: {
    name: "🎯 Anthropic Fine-Tuning: α, G, Λ Constraint Surface",
    category: 'anthropic',
    description: "Fine-structure constant α, gravitational constant G, cosmological constant Λ habitable region",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const sensitivity = params.e ?? 5;
      
      const alpha = u / Math.PI;  // Fine structure constant (normalized)
      const G_ratio = v / Math.PI;  // G ratio to observed value
      
      // Life-permitting region is extremely narrow
      const alpha_optimal = 1/137;  // Actual α ≈ 1/137
      const life_zone = Math.exp(-sensitivity * Math.pow(alpha - alpha_optimal * Math.PI, 2));
      const G_constraint = Math.exp(-sensitivity * Math.pow(G_ratio - 0.5, 2));
      
      const habitability = life_zone * G_constraint;
      
      // Create funnel shape showing narrow habitable zone
      const radius = scale * (1 + habitability * 2);
      
      return [
        radius * Math.cos(u) * Math.sin(v),
        radius * Math.sin(u) * Math.sin(v),
        scale * (habitability * 3 - 1)
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 5 })
  },

  multiverse_landscape: {
    name: "🌐 Multiverse Landscape: String Theory Vacua",
    category: 'anthropic',
    description: "The 10^500 string theory vacuum landscape with anthropically selected regions",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const valleys = params.e ?? 7;
      const ruggedness = params.f ?? 3;
      
      // Complex energy landscape with many local minima (vacua)
      const x = scale * (u / Math.PI - 1) * 3;
      const y = scale * (v / Math.PI - 0.5) * 3;
      
      // Multiple potential wells representing different vacua
      let potential = 0;
      for (let i = 0; i < valleys; i++) {
        const theta = (2 * Math.PI * i) / valleys;
        const cx = 2 * Math.cos(theta);
        const cy = 2 * Math.sin(theta);
        const dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
        potential += Math.exp(-dist * dist / ruggedness) * Math.cos(dist * 2);
      }
      
      // Central anthropic valley (our universe)
      potential += 2 * Math.exp(-(x * x + y * y) / 2);
      
      return [x, y, potential];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 7, f: 3, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI })
  },

  // ============================================================================
  // SECTION 2: ENTROPY VISUALIZATIONS
  // ============================================================================

  boltzmann_entropy_landscape: {
    name: "🔥 Boltzmann Entropy: S = k_B ln(Ω) Microstate Landscape",
    category: 'entropy',
    description: "Entropy as logarithm of microstate count - fundamental thermodynamic relation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const maxOmega = params.e ?? 10;  // Maximum microstate count (log scale)
      
      const theta = u;
      const omega = 1 + maxOmega * v / Math.PI;  // Number of microstates
      
      // S = k_B * ln(Ω) - entropy increases with microstates
      const entropy = Math.log(omega);
      const normalizedS = entropy / Math.log(maxOmega + 1);
      
      // Create spiral showing entropy growth
      const radius = scale * (0.5 + normalizedS * 2);
      const height = scale * normalizedS * 3;
      const spiralTwist = theta + normalizedS * 2 * Math.PI;
      
      return [
        radius * Math.cos(spiralTwist),
        radius * Math.sin(spiralTwist),
        height
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 10 })
  },

  entropy_production_flow: {
    name: "🌊 Entropy Production Flow: dS/dt ≥ 0 Irreversibility",
    category: 'entropy',
    description: "Second law visualization - entropy always increases in isolated systems",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const productionRate = params.e ?? 1.5;
      const dissipation = params.f ?? 0.8;
      
      const time = u / (2 * Math.PI) * 10;  // Time evolution
      const position = v / Math.PI - 0.5;
      
      // Entropy production rate (always positive)
      const dSdt = productionRate * (1 - Math.exp(-time));
      
      // Cumulative entropy
      const S_total = productionRate * (time + Math.exp(-time) - 1);
      
      // Flow visualization
      const flowX = position * scale * 3;
      const flowY = time * scale * 0.5;
      const flowZ = S_total * scale * 0.5 + dissipation * Math.sin(position * 5) * Math.exp(-time * 0.3);
      
      return [flowX, flowY, flowZ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 1.5, f: 0.8, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI })
  },

  bekenstein_hawking_entropy: {
    name: "⚫ Bekenstein-Hawking: S_BH = A/(4l_p²) Black Hole Entropy",
    category: 'entropy',
    description: "Black hole entropy proportional to event horizon area - information paradox origin",
    equation: (u, v, params) => {
      const mass = params.d ?? 2;  // Black hole mass (scaled)
      const scale = params.e ?? 1;
      
      // Schwarzschild radius: r_s = 2GM/c²
      const r_s = 2 * mass;
      
      // Entropy proportional to area: S = A/(4l_p²) = 4πr_s²/(4l_p²)
      const area = 4 * Math.PI * r_s * r_s;
      const entropy = area / 4;  // In Planck units
      
      // Create event horizon sphere with entropy-encoded texture
      const theta = u;
      const phi = v;
      
      // Hawking radiation waves emanating
      const hawkingWave = 0.1 * Math.sin(theta * 8) * Math.exp(-Math.abs(phi - Math.PI/2) * 2);
      const radius = r_s * scale * (1 + hawkingWave);
      
      return [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 1, uMax: 2 * Math.PI, vMax: Math.PI })
  },

  thermodynamic_arrow: {
    name: "⏰ Thermodynamic Arrow: Past → Future Entropy Flow",
    category: 'entropy',
    description: "Time's arrow emerges from entropy increase - connects thermodynamics to cosmology",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const arrowStrength = params.e ?? 2;
      const curvature = params.f ?? 1;
      
      const time = (u / Math.PI - 1) * 5;  // Time from past to future
      const transverse = (v / Math.PI - 0.5) * 2;
      
      // Entropy increases with time (arrow of time)
      const entropy = arrowStrength * (1 / (1 + Math.exp(-time)));  // Sigmoid growth
      
      // Arrow shape narrows toward low entropy (past), expands toward high entropy (future)
      const width = 0.3 + entropy * 0.5;
      
      const x = time * scale;
      const y = transverse * width * scale;
      const z = entropy * curvature * Math.cos(transverse * Math.PI / 2);
      
      return [x, y, z];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 2, f: 1, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI })
  },

  // ============================================================================
  // SECTION 3: CAUSAL ENTROPIC PRINCIPLE (CEP) - THE FUSION
  // ============================================================================

  causal_entropic_principle: {
    name: "🔮 Causal Entropic Principle: P(obs) ∝ ΔS_causal Maximum",
    category: 'causal_entropic',
    description: "THE FUSION: Observer probability proportional to total causal entropy production - combines anthropic reasoning with thermodynamics",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const causalWeight = params.e ?? 1.5;
      const entropicWeight = params.f ?? 2;
      const horizonSize = params.g ?? 3;
      
      const theta = u;
      const phi = v;
      
      // Causal horizon radius (observable universe boundary)
      const causalRadius = horizonSize * (1 + 0.2 * Math.sin(theta * 3) * Math.sin(phi * 2));
      
      // Entropy production within causal horizon
      const r = causalRadius * Math.sin(phi);
      const localEntropy = entropicWeight * Math.exp(-r * r / (causalRadius * causalRadius)) * (1 + r);
      
      // Observer probability (peaks where entropy production is maximized)
      const P_observer = causalWeight * localEntropy * Math.exp(-Math.pow(phi - Math.PI/2, 2));
      
      // Combined CEP surface - entropy-weighted probability landscape
      const radius = scale * (1 + P_observer * 0.5);
      
      return [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi) + localEntropy * 0.3
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 1.5, f: 2, g: 3 })
  },

  cep_universe_selection: {
    name: "🌌 CEP Universe Selection: Λ-Q Entropy Maximum",
    category: 'causal_entropic',
    description: "CEP prediction: our universe maximizes entropy production given cosmological constant Λ and fluctuation amplitude Q",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const lambda_range = params.e ?? 4;
      const Q_range = params.f ?? 3;
      
      // Cosmological parameters
      const Lambda = (u / Math.PI - 1) * lambda_range;  // Cosmological constant
      const Q = (v / Math.PI - 0.5) * Q_range;          // Density fluctuation amplitude
      
      // CEP entropy production function
      // High Λ → universe expands too fast → low structure formation → low entropy production
      // Low Λ → recollapse → insufficient time → low entropy production
      // Goldilocks Λ → maximum star/galaxy formation → maximum entropy
      
      const lambda_factor = Math.exp(-Lambda * Lambda / 2);
      
      // Q factor: too low → no structures, too high → black holes dominate
      const Q_optimal = 0.3;
      const Q_factor = Math.exp(-Math.pow(Q - Q_optimal, 2) / 0.3);
      
      // Total entropy production (CEP predicts this is maximized for our universe)
      const S_produced = lambda_factor * Q_factor * 3;
      
      // Star formation contribution
      const starFormation = 0.5 * Math.exp(-Lambda * Lambda) * Math.sin(Q * Math.PI);
      
      return [
        scale * Lambda,
        scale * Q,
        scale * (S_produced + starFormation)
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 4, f: 3, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI })
  },

  cep_entropy_observer_fusion: {
    name: "♾️ CEP Antropy-Entropy Fusion: ∫S·P(obs)dV Maximum",
    category: 'causal_entropic',
    description: "The ultimate fusion: Anthropic observer probability weighted by local entropy production integrated over causal volume",
    equation: (u, v, params) => {
      const scale = params.d ?? 2.5;
      const anthropicStrength = params.e ?? 1.5;
      const entropicStrength = params.f ?? 2;
      const fusionCoupling = params.g ?? 1;
      
      const theta = u;
      const radialPosition = v / Math.PI;  // 0 to 1
      
      // Anthropic probability density (life-permitting regions)
      const P_anthropic = anthropicStrength * Math.exp(-Math.pow(radialPosition - 0.5, 2) / 0.2);
      
      // Entropy production density (increases with cosmic structure)
      const S_production = entropicStrength * radialPosition * (1 - radialPosition) * 4;
      
      // CEP FUSION: weighted integral of entropy × observer probability
      const CEP_density = fusionCoupling * P_anthropic * S_production;
      
      // Create twisted torus representing the fusion
      const R = scale * (1 + CEP_density * 0.3);  // Major radius
      const r = scale * 0.4 * (1 + S_production * 0.2);  // Minor radius
      
      // Twist based on coupling strength
      const twist = fusionCoupling * theta;
      
      return [
        (R + r * Math.cos(v + twist)) * Math.cos(theta),
        (R + r * Math.cos(v + twist)) * Math.sin(theta),
        r * Math.sin(v + twist) + P_anthropic * 0.5
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2.5, e: 1.5, f: 2, g: 1, vMax: 2 * Math.PI })
  },

  // ============================================================================
  // SECTION 4: THERMODYNAMIC COSMOLOGY
  // ============================================================================

  cosmic_entropy_budget: {
    name: "📊 Cosmic Entropy Budget: S_CMB + S_BH + S_stars",
    category: 'thermodynamic_cosmology',
    description: "Total entropy of observable universe dominated by supermassive black holes",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u;
      const time = v / Math.PI;  // Cosmic time (0 = Big Bang, 1 = now)
      
      // Entropy components (relative scales)
      const S_CMB = 10 * (1 - Math.exp(-time * 3));  // CMB entropy (early dominant)
      const S_stars = 5 * time * time * Math.exp(-time);  // Stellar entropy
      const S_BH = 100 * Math.pow(time, 4);  // Black hole entropy (late dominant)
      
      const S_total = S_CMB + S_stars + S_BH;
      const normalizedS = S_total / 120;  // Normalize
      
      // Layered surface showing entropy components
      const layer = Math.floor(time * 3) % 3;
      const radius = scale * (1 + normalizedS);
      
      return [
        radius * Math.cos(theta) * (1 + 0.2 * Math.sin(layer * 2)),
        radius * Math.sin(theta) * (1 + 0.2 * Math.cos(layer * 2)),
        scale * time * 3 + 0.1 * S_BH / 100
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2 })
  },

  boltzmann_brain_probability: {
    name: "🧠 Boltzmann Brain: P(fluctuation) vs P(evolution)",
    category: 'thermodynamic_cosmology',
    description: "Random quantum fluctuation brains vs evolved life - CEP helps resolve this paradox",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const fluctuationScale = params.e ?? 5;
      
      const theta = u;
      const entropyLevel = v / Math.PI * 10;  // Entropy scale
      
      // Boltzmann brain probability (extremely rare thermal fluctuation)
      const P_brain = Math.exp(-fluctuationScale * entropyLevel);
      
      // Evolved observer probability (requires low initial entropy + structure)
      const P_evolved = Math.exp(-Math.pow(entropyLevel - 3, 2) / 4);
      
      // The ratio P_evolved/P_brain determines observer type
      const ratio = P_evolved / (P_brain + 0.001);
      
      // Create brain-like structure morphing to structured life
      const braininess = P_brain * 10;
      const structure = P_evolved * 2;
      
      const radius = scale * (1 + structure);
      const wobble = braininess * Math.sin(theta * 7) * Math.sin(v * 5);
      
      return [
        radius * Math.sin(v) * Math.cos(theta) + wobble * 0.1,
        radius * Math.sin(v) * Math.sin(theta) + wobble * 0.1,
        radius * Math.cos(v) + structure
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 5 })
  },

  heat_death_horizon: {
    name: "❄️ Heat Death Horizon: S → S_max Asymptotic",
    category: 'thermodynamic_cosmology',
    description: "Ultimate fate of universe - maximum entropy state where no work can be extracted",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const asymptoteRate = params.e ?? 0.5;
      
      const theta = u;
      const cosmicTime = v / Math.PI * 100;  // Cosmic time in billions of years
      
      // Entropy asymptotically approaches maximum
      const S_max = 10;
      const S_current = S_max * (1 - Math.exp(-asymptoteRate * cosmicTime / 10));
      
      // Temperature approaches absolute zero
      const T = 1 / (1 + cosmicTime);
      
      // Expanding, cooling, dying universe
      const radius = scale * (1 + cosmicTime * 0.1);
      const coldness = 1 - T;
      
      return [
        radius * Math.cos(theta) * (1 - coldness * 0.5),
        radius * Math.sin(theta) * (1 - coldness * 0.5),
        scale * S_current / S_max * 3 - scale
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 0.5 })
  },

  // ============================================================================
  // SECTION 5: INFORMATION ENTROPY
  // ============================================================================

  shannon_entropy_surface: {
    name: "📡 Shannon Entropy: H = -Σp_i log(p_i) Information",
    category: 'information_entropy',
    description: "Information-theoretic entropy - bits of uncertainty in a probability distribution",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const numStates = Math.floor(params.e ?? 8);
      
      const theta = u;
      const uniformity = v / Math.PI;  // 0 = peaked, 1 = uniform
      
      // Create probability distribution morphing from peaked to uniform
      let H = 0;  // Shannon entropy
      for (let i = 0; i < numStates; i++) {
        // Interpolate between delta function and uniform distribution
        const p_uniform = 1 / numStates;
        const p_peaked = (i === 0) ? 1 : 0;
        const p_i = p_peaked * (1 - uniformity) + p_uniform * uniformity + 0.001;
        
        if (p_i > 0) {
          H -= p_i * Math.log2(p_i);
        }
      }
      
      // Normalize to maximum entropy
      const H_max = Math.log2(numStates);
      const H_normalized = H / H_max;
      
      // Create surface
      const radius = scale * (0.5 + H_normalized * 1.5);
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        scale * uniformity * 2
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 8 })
  },

  von_neumann_entropy: {
    name: "⚛️ Von Neumann Entropy: S = -Tr(ρ ln ρ) Quantum",
    category: 'information_entropy',
    description: "Quantum mechanical entropy - entanglement measure for quantum systems",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const entanglement = params.e ?? 0.5;  // Entanglement parameter
      
      const theta = u;
      const phi = v;
      
      // Von Neumann entropy for two-qubit system
      // Maximum at maximum entanglement (Bell states)
      const lambda = entanglement * Math.sin(phi);  // Eigenvalue
      const S_vN = -(lambda * Math.log(lambda + 0.001) + (1 - lambda) * Math.log(1 - lambda + 0.001));
      
      // Create entangled quantum state visualization
      const radius = scale * (1 + S_vN * 0.5);
      
      // Quantum interference pattern
      const interference = 0.1 * Math.sin(theta * 4 + phi * 3) * S_vN;
      
      return [
        radius * Math.sin(phi) * Math.cos(theta) + interference,
        radius * Math.sin(phi) * Math.sin(theta) + interference,
        radius * Math.cos(phi) + S_vN * 0.5
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 0.5 })
  },

  holographic_entropy_bound: {
    name: "📦 Holographic Entropy Bound: S ≤ A/(4l_p²)",
    category: 'information_entropy',
    description: "Maximum entropy of any region bounded by its surface area - foundation of holographic principle",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const radiusParam = params.e ?? 1;
      
      const theta = u;
      const phi = v;
      
      // Bekenstein bound: S_max = 2πER/(ℏc)
      // Simplified to A/(4l_p²) for gravitational systems
      const R = radiusParam * scale;
      const area = 4 * Math.PI * R * R;
      const S_max = area / 4;  // In Planck units
      
      // Interior entropy (must not exceed boundary)
      const interiorEntropy = S_max * 0.8 * Math.sin(phi / 2);
      
      // Create bounded sphere with entropy gradient
      const entropyRatio = interiorEntropy / S_max;
      const radius = R * (1 - 0.1 * entropyRatio);
      
      return [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 1 })
  },

  causal_horizon_boundary: {
    name: "🔭 Causal Horizon: Observable Universe Entropy Boundary",
    category: 'causal_entropic',
    description: "The causal boundary of our observable universe - entropy can only be counted within this region",
    equation: (u, v, params) => {
      const scale = params.d ?? 3;
      const hubbleRadius = params.e ?? 2;  // Hubble radius (scaled)
      const expansion = params.f ?? 1.1;   // Expansion factor
      
      const theta = u;
      const phi = v;
      
      // Causal horizon expands with cosmic time
      const horizonRadius = hubbleRadius * scale;
      
      // Slight perturbations representing CMB anisotropies
      const anisotropy = 0.05 * Math.sin(theta * 5) * Math.sin(phi * 4);
      
      // Expansion creates redshift at boundary
      const redshiftFactor = 1 + expansion * Math.sin(phi);
      
      const radius = horizonRadius * (1 + anisotropy) / redshiftFactor;
      
      return [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ];
    },
    defaultParams: getEntropicDefaults({ d: 3, e: 2, f: 1.1 })
  },

  cosmological_constant_cep: {
    name: "Λ CEP Cosmological Constant: Entropy-Predicted Value",
    category: 'causal_entropic',
    description: "CEP prediction of cosmological constant Λ based on entropy maximization principle",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const precision = params.e ?? 3;
      
      const theta = u;
      const Lambda_normalized = (v / Math.PI - 0.5) * 4;  // -2 to 2
      
      // CEP predicts Λ ≈ observed value where entropy production is maximized
      // Too small Λ: recollapse before structures form
      // Too large Λ: expansion too fast, no structure formation
      const Lambda_optimal = 0.05;  // Observed Λ (normalized)
      
      // Entropy production function peaks at optimal Λ
      const S_production = Math.exp(-precision * Math.pow(Lambda_normalized - Lambda_optimal, 2));
      
      // Gaussian prediction surface
      const radius = scale * (0.5 + S_production * 2);
      const height = S_production * scale * 2;
      
      return [
        radius * Math.cos(theta),
        radius * Math.sin(theta),
        height
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 3 })
  },

  density_fluctuation_q_cep: {
    name: "Q CEP Density Fluctuation: Optimal Structure Formation",
    category: 'causal_entropic',
    description: "CEP prediction of primordial density fluctuation amplitude Q for maximum cosmic structure",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const sensitivity = params.e ?? 4;
      
      const theta = u;
      const Q_normalized = v / Math.PI;  // 0 to 1
      
      // Observed Q ≈ 10^-5 - just right for galaxy formation
      const Q_optimal = 0.2;  // Normalized optimal value
      
      // Too small Q: no structures, insufficient entropy production
      // Too large Q: primordial black holes dominate, different entropy budget
      
      const structureFormation = Math.exp(-sensitivity * Math.pow(Q_normalized - Q_optimal, 2));
      const blackHoleDominance = 0.3 * Q_normalized * Q_normalized;
      
      const entropyContribution = structureFormation - blackHoleDominance;
      
      const radius = scale * (0.5 + Math.max(0, entropyContribution) * 1.5);
      
      return [
        radius * Math.cos(theta) * Math.sin(v),
        radius * Math.sin(theta) * Math.sin(v),
        scale * entropyContribution * 2
      ];
    },
    defaultParams: getEntropicDefaults({ d: 2, e: 4 })
  }
};

console.log(`🌡️ Loaded ${Object.keys(ENTROPIC_PRINCIPLES).length} Entropic Principle visualizations 🔥♾️🧠`);
