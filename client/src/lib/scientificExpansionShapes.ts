import { SurfaceParameters } from '../types/math';

/**
 * SCIENTIFIC EXPANSION SHAPES - Comprehensive Life, Earth, Social Sciences & Engineering
 * Product of UUON Foundation - Phillip A. Ruiz III
 * 
 * Categories:
 * - Life Sciences: Molecular Biology, Microbiology, Botany, Zoology/Ecology
 * - Earth Sciences: Geology, Oceanography, Meteorology
 * - Social Sciences: Economics, Sociology, Political Science
 * - Applied Engineering: Industrial, Civil, Aerospace
 * - Bioinformatics Algorithms: Sequence alignment, ML models
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// ============================================================================
// UNIFIED EQUATION OF WHOLENESS - The Master Visualization
// dΨ/dt = F(Ψ) = G + Q + I + S
// ============================================================================

export const UNIFIED_WHOLENESS: Record<string, ParametricSurface> = {
  unified_wholeness_equation: {
    name: "🌌 Unified Equation of Wholeness - dΨ/dt = F(Ψ)",
    equation: (u, v, params) => {
      const a = params.d ?? 3;      // Ψ state amplitude
      const b = params.e ?? 2;      // F generative rule intensity
      const c = params.f ?? 1;      // Evolution speed
      const d = params.g ?? 0.5;    // G (geometry) contribution
      const e = params.h ?? 0.4;    // Q (quantum) contribution
      const f = params.i ?? 0.3;    // I (information) contribution
      const g = params.g ?? 0.25;   // S (self-organization) contribution
      const h = params.h ?? 0.2;    // φ golden ratio modulation
      const i = params.i ?? 0.15;   // π harmonic curvature
      const j = params.j ?? 0.1;    // λ computation wavelength
      const k = params.k ?? 0.08;   // Ω emergence scale
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi_angle = v * Math.PI;
      const phi_golden = (1 + Math.sqrt(5)) / 2;
      
      // =================================================================
      // Ψ - THE UNIVERSAL STATE
      // Ψ = (geometry, matter, energy, information, algorithm, consciousness)
      // =================================================================
      const psi_base = a * (1 + 0.2 * Math.sin(3 * theta) * Math.cos(2 * phi_angle));
      
      // =================================================================
      // G - GEOMETRIC/PHYSICAL DYNAMICS (Relativity + Classical Mechanics)
      // =================================================================
      const G_geometry = d * (
        Math.sin(theta) * Math.cos(phi_angle) * 
        (1 + 0.3 * Math.sin(4 * theta + time * 0.02)) +
        0.2 * Math.cos(3 * theta) * Math.sin(2 * phi_angle) * phi_golden
      );
      
      // =================================================================
      // Q - QUANTUM EVOLUTION (Schrödinger Dynamics)
      // iħ dΨ/dt = HΨ → probability amplitude
      // =================================================================
      const psi_quantum = Math.exp(-0.5 * Math.pow(phi_angle - Math.PI/2, 2));
      const Q_quantum = e * (
        psi_quantum * Math.cos(2 * theta + time * 0.05) +
        0.3 * Math.sin(theta) * Math.sin(theta) * Math.cos(2 * theta) +  // d-orbital
        0.2 * Math.sin(5 * theta) * Math.cos(3 * phi_angle)  // interference
      );
      
      // =================================================================
      // I - INFORMATION/ENTROPY DYNAMICS
      // Shannon entropy minimization/maximization
      // =================================================================
      const entropy_flow = Math.sin(6 * theta + 4 * phi_angle) * 
                          Math.cos(3 * theta - 2 * phi_angle);
      const I_information = f * (
        entropy_flow + 
        0.25 * Math.sin(8 * theta) * Math.cos(8 * phi_angle) +  // data lattice
        0.15 * Math.sin(time * 0.03 + theta * 2)  // computation wave
      );
      
      // =================================================================
      // S - SELF-ORGANIZATION/EMERGENCE (Consciousness, Life)
      // Predictive model update + emergence
      // =================================================================
      const emergence_pattern = Math.sin(7 * theta) * Math.sin(5 * phi_angle) * 
                               Math.cos(time * 0.01 + theta);
      const S_selforg = g * (
        emergence_pattern +
        0.3 * Math.tanh(2 * Math.sin(4 * theta) * Math.cos(3 * phi_angle)) +
        0.2 * Math.sin(Math.PI * u) * Math.sin(Math.PI * v)  // Turing pattern
      );
      
      // =================================================================
      // UUON INTEGRATION: Gφ + Qπ + Iλ + SΩ
      // =================================================================
      const uuon_harmonic = 
        h * phi_golden * Math.sin(theta * phi_golden) +
        i * Math.PI * 0.1 * Math.cos(theta * Math.PI / 4) +
        j * Math.sin(theta * 2 * Math.PI) +
        k * Math.cos(theta + phi_angle) * 0.5;
      
      // =================================================================
      // F(Ψ) - THE GENERATIVE RULE combining all dynamics
      // dΨ/dt = G + Q + I + S (evolution equation)
      // =================================================================
      const F_psi = G_geometry + Q_quantum + I_information + S_selforg + uuon_harmonic;
      
      // Total radius with evolution
      const evolvedRadius = psi_base * (1 + b * 0.2 * F_psi);
      
      // Spherical to Cartesian with evolutionary flow
      let x = evolvedRadius * Math.sin(phi_angle) * Math.cos(theta);
      let y = evolvedRadius * Math.sin(phi_angle) * Math.sin(theta);
      let z = evolvedRadius * Math.cos(phi_angle);
      
      // Apply time evolution (dΨ/dt flow)
      const evolution = c * 0.05 * Math.sin(time * 0.02);
      x += evolution * Math.cos(theta);
      y += evolution * Math.sin(theta);
      
      // Golden spiral modulation
      z += 0.02 * h * Math.sin(theta * phi_golden + phi_angle);
      
      return [x, y, z];
    },
    defaultParams: { 
      d: 3, e: 2, f: 1, g: 0.5, h: 0.4, i: 0.3, j: 0.1, k: 0.08,
      l: 0, m: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 192, vSegments: 144
    }
  },

  classical_hamiltonian_flow: {
    name: "⚙️ Classical Hamiltonian Flow - dq/dt = ∂H/∂p",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const q = (u - 0.5) * 4 * a;
      const p = (v - 0.5) * 4 * b;
      
      const H = 0.5 * p * p + 0.5 * c * q * q + 0.1 * q * q * q * q;
      const dqdt = p;
      const dpdt = -c * q - 0.4 * q * q * q;
      
      const x = q;
      const y = p;
      const z = H * 0.3 + d * 0.1 * Math.sin(time * 0.05);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  schrodinger_evolution: {
    name: "⚛️ Schrödinger Evolution - iħ∂Ψ/∂t = HΨ",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const psi_real = Math.exp(-a * phi * phi) * Math.cos(b * theta + time * 0.1);
      const psi_imag = Math.exp(-a * phi * phi) * Math.sin(b * theta + time * 0.1);
      const probability = psi_real * psi_real + psi_imag * psi_imag;
      
      const r = c * (1 + probability);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * psi_imag;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  entropy_flow_dynamics: {
    name: "🔥 Entropy Flow - dS/dt > 0",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const entropy = -Math.log(Math.max(0.01, 0.5 + 0.4 * Math.cos(2 * theta) * Math.sin(phi)));
      const r = a * (1 + b * 0.2 * entropy) + c * 0.1 * Math.sin(3 * theta + time * 0.02);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * Math.sin(time * 0.03);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  predictive_consciousness: {
    name: "🧠 Predictive Consciousness - World Model",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const prediction = Math.sin(3 * theta) * Math.cos(2 * phi);
      const sensory = Math.sin(5 * theta + time * 0.05) * Math.sin(4 * phi);
      const error = Math.abs(prediction - sensory * 0.1);
      const update = 0.9 * prediction + 0.1 * sensory;
      
      const r = a * (1 + b * 0.15 * update - c * 0.05 * error);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * error;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// MOLECULAR BIOLOGY - CRISPR, Protein Folding, Metabolic Networks
// ============================================================================

export const MOLECULAR_BIOLOGY_SHAPES: Record<string, ParametricSurface> = {
  crispr_cas9_mechanism: {
    name: "🧬 CRISPR-Cas9 Mechanism - Gene Editing Complex",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 4 * Math.PI;
      const phi = v * Math.PI;
      
      const dnaHelix1 = Math.sin(theta) * Math.cos(phi * 0.5);
      const dnaHelix2 = Math.cos(theta + Math.PI) * Math.cos(phi * 0.5);
      
      const cas9Bulge = Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.3) * 
                        (1 + 0.5 * Math.sin(3 * theta + time * 0.1));
      
      const r = a * (0.5 + 0.3 * dnaHelix1 + 0.3 * dnaHelix2 + b * cas9Bulge);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta) + c * 0.2 * Math.sin(theta * 2);
      const z = r * Math.cos(phi) + d * 0.1 * cas9Bulge;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 128, vSegments: 96 }
  },

  protein_structure_prediction: {
    name: "🔬 Protein Structure Prediction - AlphaFold",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 6 * Math.PI;
      const t = v;
      
      const alphaHelix = Math.sin(theta) * Math.exp(-t * 0.3);
      const betaSheet = Math.cos(3 * theta) * Math.sin(t * Math.PI);
      const randomCoil = 0.3 * Math.sin(5 * theta) * Math.cos(7 * t * Math.PI);
      
      const x = a * (t - 0.5) * 3;
      const y = b * (alphaHelix + 0.5 * betaSheet);
      const z = c * (0.5 * betaSheet + randomCoil) + d * 0.1 * Math.sin(time * 0.05);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 128, vSegments: 64 }
  },

  metabolic_pathway_network: {
    name: "🔄 Metabolic Pathway Network - Biochemical Flows",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const glycolysis = Math.sin(theta) * Math.cos(phi);
      const krebs = Math.sin(2 * theta + phi) * Math.cos(theta - phi);
      const oxphos = Math.sin(3 * theta) * Math.cos(2 * phi);
      
      const metabolicFlow = 0.4 * glycolysis + 0.35 * krebs + 0.25 * oxphos;
      const r = a * (1 + b * 0.3 * metabolicFlow);
      
      const x = r * Math.cos(theta) * (1 + c * 0.3 * Math.cos(phi));
      const y = r * Math.sin(theta) * (1 + c * 0.3 * Math.cos(phi));
      const z = r * 0.5 * Math.sin(phi) + d * 0.1 * Math.sin(time * 0.02);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 96 }
  },

  enzyme_kinetics_michaelis: {
    name: "⚗️ Enzyme Kinetics - Michaelis-Menten",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const S = u * 10 * a;
      const Km = 2 * b;
      const Vmax = 5 * c;
      
      const V = (Vmax * S) / (Km + S);
      
      const theta = v * 2 * Math.PI;
      const r = 0.2 + 0.1 * Math.sin(4 * theta);
      
      const x = S * 0.3;
      const y = V * 0.5 + r * Math.cos(theta) * 0.3;
      const z = r * Math.sin(theta) * 0.3 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  gene_regulatory_network: {
    name: "🧬 Gene Regulatory Network - Transcription Factors",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const activator = Math.sin(3 * theta) * Math.cos(2 * phi);
      const repressor = Math.cos(4 * theta) * Math.sin(3 * phi);
      const expression = Math.max(0, activator - 0.5 * repressor);
      
      const r = a * (1 + b * 0.3 * expression);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * 0.2 * expression + d * 0.1 * Math.sin(time * 0.03);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// MICROBIOLOGY - Bacterial Growth, Virus Replication, Microbiome
// ============================================================================

export const MICROBIOLOGY_SHAPES: Record<string, ParametricSurface> = {
  bacterial_growth_logistic: {
    name: "🦠 Bacterial Growth - Logistic Curve",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const t = u * 10;
      const r_growth = 0.5 * b;
      const K = 10 * c;
      const N0 = 0.1;
      
      const N = K / (1 + ((K - N0) / N0) * Math.exp(-r_growth * t));
      
      const theta = v * 2 * Math.PI;
      const radius = 0.2 * a * (N / K);
      
      const x = t * 0.3 - 1.5;
      const y = radius * Math.cos(theta);
      const z = N * 0.15 + radius * Math.sin(theta) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  virus_replication_cycle: {
    name: "🦠 Virus Replication Cycle - Lytic Phase",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const capsid = 1 + 0.1 * Math.sin(5 * theta) * Math.sin(4 * phi);
      const budding = 0.2 * Math.exp(-Math.pow(phi - Math.PI * 0.3, 2) / 0.1);
      
      const r = a * capsid * (1 + b * budding);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * budding + d * 0.1 * Math.sin(time * 0.05);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  antibiotic_resistance_mechanism: {
    name: "💊 Antibiotic Resistance - Efflux Pump",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const membrane = 1 + 0.05 * Math.sin(8 * theta);
      const pumpChannel = 0.3 * Math.exp(-Math.pow(theta - Math.PI, 2) / 0.3) *
                         Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.5);
      const effluxFlow = pumpChannel * Math.sin(5 * (phi - time * 0.1));
      
      const r = a * membrane * (1 - b * 0.2 * pumpChannel);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * 0.3 * effluxFlow + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  microbiome_ecosystem: {
    name: "🌿 Microbiome Ecosystem - Species Diversity",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const species1 = Math.sin(3 * theta) * Math.cos(2 * phi);
      const species2 = Math.cos(5 * theta) * Math.sin(3 * phi);
      const species3 = Math.sin(7 * theta + phi) * Math.cos(theta - phi);
      
      const diversity = 0.4 * species1 + 0.35 * species2 + 0.25 * species3;
      const r = a * (1 + b * 0.25 * diversity);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * 0.15 * Math.abs(diversity) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// BOTANY / PLANT SCIENCE
// ============================================================================

export const BOTANY_SHAPES: Record<string, ParametricSurface> = {
  photosynthesis_light_reactions: {
    name: "🌱 Photosynthesis Light Reactions - Chloroplast",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const thylakoid = Math.sin(8 * phi) * 0.15;
      const stroma = 1 + 0.05 * Math.sin(3 * theta);
      const lightCapture = Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.5) *
                          (1 + 0.3 * Math.sin(4 * theta + time * 0.1));
      
      const r = a * stroma * (1 + b * thylakoid);
      const r2 = r * (1 + 0.2 * c * lightCapture);
      
      const x = r2 * Math.sin(phi) * Math.cos(theta);
      const y = r2 * Math.sin(phi) * Math.sin(theta);
      const z = r2 * Math.cos(phi) * 0.4 + d * 0.1 * lightCapture;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  plant_hormone_signaling: {
    name: "🌿 Plant Hormone Signaling - Auxin Transport",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const auxinGradient = Math.exp(-2 * t) * (1 + 0.3 * Math.sin(3 * theta));
      const cellElongation = t * (1 + 0.5 * auxinGradient);
      
      const r = a * 0.3 * (1 + b * 0.2 * auxinGradient);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * cellElongation * 3 - 1.5 + d * 0.1 * Math.sin(time * 0.03);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  },

  root_system_architecture: {
    name: "🌳 Root System Architecture - Fractal Branching",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 4 * Math.PI;
      const t = v;
      
      const mainRoot = Math.exp(-t * 0.5);
      const lateralRoots = 0.3 * Math.sin(5 * theta) * Math.exp(-t * 0.3) * t;
      const rootHairs = 0.1 * Math.sin(15 * theta) * Math.exp(-t * 0.2) * t * t;
      
      const r = a * 0.2 * (mainRoot + b * lateralRoots + c * 0.5 * rootHairs);
      
      const x = r * Math.cos(theta) * (1 + 0.5 * t);
      const y = r * Math.sin(theta) * (1 + 0.5 * t);
      const z = -t * 3 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 128, vSegments: 48 }
  },

  pollination_mechanism: {
    name: "🌸 Pollination Mechanism - Pollen-Stigma Interaction",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const petalShape = 1 + 0.3 * Math.cos(5 * theta) * Math.sin(phi);
      const stigma = 0.5 * Math.exp(-Math.pow(phi - 0.2, 2) / 0.1);
      const pollenTube = 0.2 * Math.exp(-Math.pow(phi - 0.5, 2) / 0.2) *
                        (1 + 0.3 * Math.sin(8 * theta + time * 0.1));
      
      const r = a * petalShape * (1 + b * 0.2 * (stigma + pollenTube));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * 0.5 * stigma + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// ZOOLOGY / ECOLOGY
// ============================================================================

export const ZOOLOGY_ECOLOGY_SHAPES: Record<string, ParametricSurface> = {
  population_dynamics_lotka: {
    name: "🐺 Population Dynamics - Lotka-Volterra",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const t = u * 20;
      const prey0 = 1;
      const pred0 = 0.5;
      const alpha = 0.1 * a;
      const beta = 0.02 * b;
      const gamma = 0.3;
      const delta = 0.01 * c;
      
      const prey = prey0 * Math.exp(alpha * Math.sin(t * 0.3));
      const predator = pred0 * Math.exp(beta * Math.cos(t * 0.3 + 0.5));
      
      const theta = v * 2 * Math.PI;
      const r = 0.1 + 0.05 * Math.sin(3 * theta);
      
      const x = t * 0.15 - 1.5;
      const y = prey * 0.3 + r * Math.cos(theta);
      const z = predator * 0.4 + r * Math.sin(theta) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 32 }
  },

  food_web_network: {
    name: "🕸️ Food Web - Trophic Network",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const trophicLevel = v;
      
      const producers = Math.sin(6 * theta) * (1 - trophicLevel);
      const consumers = Math.sin(4 * theta + Math.PI/4) * trophicLevel * (1 - trophicLevel);
      const predators = Math.sin(2 * theta + Math.PI/2) * trophicLevel * trophicLevel;
      
      const r = a * (0.5 + 0.3 * producers + 0.4 * b * consumers + 0.3 * c * predators);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = trophicLevel * 3 - 1.5 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  },

  migration_pattern_analysis: {
    name: "🦅 Migration Patterns - Seasonal Movement",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const t = u * 4 * Math.PI;
      const season = v * 2 * Math.PI;
      
      const latitude = Math.sin(season + time * 0.02) * a;
      const longitude = t * 0.5 + 0.3 * Math.sin(3 * t);
      const flockDensity = 0.5 + 0.3 * Math.sin(2 * season) * Math.cos(t);
      
      const x = longitude * b;
      const y = latitude;
      const z = c * 0.5 * flockDensity * Math.sin(t * 0.5) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  },

  ecosystem_energy_flow: {
    name: "🌍 Ecosystem Energy Flow - Trophic Cascade",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const solarInput = Math.cos(phi) * Math.max(0, Math.cos(phi));
      const primaryProd = solarInput * 0.01;
      const secondaryProd = primaryProd * 0.1;
      const tertiaryProd = secondaryProd * 0.1;
      
      const energyFlow = a * (primaryProd + b * secondaryProd + c * tertiaryProd);
      const r = 1 + energyFlow;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * energyFlow;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// GEOLOGY
// ============================================================================

export const GEOLOGY_SHAPES: Record<string, ParametricSurface> = {
  plate_tectonics_simulation: {
    name: "🌍 Plate Tectonics - Mantle Convection",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const mantleConvection = Math.sin(3 * theta + time * 0.01) * Math.cos(2 * phi);
      const plateBoundary = 0.1 * (Math.sin(8 * theta) + Math.sin(6 * phi));
      const subduction = 0.2 * Math.exp(-Math.pow(theta - Math.PI, 2) / 0.3) *
                        Math.cos(phi);
      
      const r = a * (1 + b * 0.1 * mantleConvection + c * 0.15 * plateBoundary);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * subduction;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  mineral_crystal_growth: {
    name: "💎 Mineral Crystal Growth - Lattice Formation",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const hexagonal = Math.abs(Math.sin(3 * theta)) * 0.3;
      const cubicFaces = Math.abs(Math.sin(2 * theta) * Math.sin(2 * phi));
      const growth = 1 + 0.2 * Math.pow(Math.sin(phi), 2);
      
      const r = a * growth * (1 + b * hexagonal * 0.5 + c * cubicFaces * 0.3);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  volcanic_eruption_model: {
    name: "🌋 Volcanic Eruption - Magma Chamber",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const coneShape = (1 - t) * (1 - t);
      const craterRim = Math.exp(-Math.pow(t - 0.95, 2) / 0.01) * 0.3;
      const magmaPlume = Math.exp(-Math.pow(theta - Math.PI, 2) / 0.5) *
                        Math.max(0, t - 0.8) * 3 * (1 + 0.5 * Math.sin(time * 0.2));
      
      const r = a * (coneShape + craterRim);
      const x = r * b * Math.cos(theta);
      const y = r * b * Math.sin(theta);
      const z = t * 3 * c + magmaPlume + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  },

  sediment_layer_formation: {
    name: "🏔️ Sediment Layers - Stratigraphic Column",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const x_pos = (u - 0.5) * 4 * a;
      const depth = v * 3;
      
      const sandstone = 0.1 * Math.sin(8 * v * Math.PI);
      const shale = 0.05 * Math.sin(15 * v * Math.PI + 0.5);
      const limestone = 0.08 * Math.sin(6 * v * Math.PI + 1);
      
      const layers = b * sandstone + c * shale + 0.5 * limestone;
      const erosion = 0.1 * Math.sin(3 * u * Math.PI) * (1 - v);
      
      const x = x_pos;
      const y = layers + erosion;
      const z = -depth + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 64 }
  }
};

// ============================================================================
// OCEANOGRAPHY
// ============================================================================

export const OCEANOGRAPHY_SHAPES: Record<string, ParametricSurface> = {
  ocean_current_systems: {
    name: "🌊 Ocean Currents - Thermohaline Circulation",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const gulfStream = 0.3 * Math.exp(-Math.pow(phi - Math.PI/3, 2) / 0.1) *
                        Math.sin(theta + time * 0.02);
      const kuroshio = 0.25 * Math.exp(-Math.pow(phi - Math.PI/3, 2) / 0.1) *
                      Math.cos(theta - Math.PI/2 + time * 0.02);
      const antarctic = 0.2 * Math.exp(-Math.pow(phi - 2.5, 2) / 0.2) * Math.sin(2 * theta);
      
      const r = a * (1 + b * gulfStream + c * kuroshio + 0.5 * antarctic);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  tidal_dynamics: {
    name: "🌙 Tidal Dynamics - Lunar Gravitational Pull",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const lunarTide = 0.15 * Math.cos(2 * theta + time * 0.05);
      const solarTide = 0.07 * Math.cos(2 * theta + time * 0.02);
      const springNeap = 0.05 * Math.cos(time * 0.01) * Math.cos(2 * theta);
      
      const r = a * (1 + b * lunarTide + c * solarTide + springNeap);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * Math.sin(time * 0.03);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  marine_ecosystem_model: {
    name: "🐠 Marine Ecosystem - Pelagic Zones",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const depth = v;
      
      const epipelagic = Math.exp(-depth * 2) * (1 + 0.3 * Math.sin(4 * theta));
      const mesopelagic = Math.exp(-Math.pow(depth - 0.3, 2) / 0.1);
      const bathypelagic = Math.exp(-Math.pow(depth - 0.7, 2) / 0.1) * 0.5;
      
      const biomass = a * (epipelagic + b * 0.5 * mesopelagic + c * 0.3 * bathypelagic);
      const r = 0.5 + biomass * 0.3;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -depth * 3 + 1.5 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  },

  deep_sea_pressure: {
    name: "🌊 Deep Sea Pressure - Hadal Zone",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const depth = v;
      
      const pressure = depth * depth * 10;
      const compression = 1 / (1 + 0.1 * pressure);
      const trenchWalls = 0.3 * Math.sin(6 * theta) * depth;
      
      const r = a * compression * (1 + b * 0.2 * trenchWalls);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -depth * 4 * c + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  }
};

// ============================================================================
// METEOROLOGY
// ============================================================================

export const METEOROLOGY_SHAPES: Record<string, ParametricSurface> = {
  weather_pattern_simulation: {
    name: "🌤️ Weather Patterns - High/Low Pressure",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const highPressure = 0.2 * Math.exp(-Math.pow(theta - Math.PI/2, 2) / 0.5) *
                          Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.5);
      const lowPressure = -0.15 * Math.exp(-Math.pow(theta - 3*Math.PI/2, 2) / 0.3) *
                         Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.3);
      const jetStream = 0.1 * Math.sin(4 * theta + time * 0.03) * 
                       Math.exp(-Math.pow(phi - Math.PI/3, 2) / 0.1);
      
      const r = a * (1 + b * highPressure + c * lowPressure);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * jetStream;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  climate_change_model: {
    name: "🌡️ Climate Change - Temperature Anomaly",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const baseTemp = Math.cos(phi);
      const warming = 0.2 * (1 + 0.5 * time * 0.001);
      const polarAmplification = 0.3 * Math.exp(-Math.pow(phi, 2) / 0.3) +
                                0.3 * Math.exp(-Math.pow(phi - Math.PI, 2) / 0.3);
      
      const tempAnomaly = baseTemp + b * warming + c * polarAmplification;
      const r = a * (1 + 0.1 * tempAnomaly);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * tempAnomaly;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  atmospheric_circulation: {
    name: "🌬️ Atmospheric Circulation - Hadley Cells",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const hadleyCell = Math.sin(3 * phi) * Math.cos(theta + time * 0.01);
      const ferrelCell = 0.7 * Math.sin(3 * (phi - Math.PI/3)) * Math.cos(theta);
      const polarCell = 0.5 * Math.sin(3 * (phi - 2*Math.PI/3)) * Math.cos(theta);
      
      const circulation = b * hadleyCell + c * ferrelCell + 0.5 * polarCell;
      const r = a * (1 + 0.15 * circulation);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * circulation;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  storm_formation_dynamics: {
    name: "🌀 Storm Formation - Cyclone Structure",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 4 * Math.PI + time * 0.1;
      const r_base = v * 2;
      
      const eyeWall = Math.exp(-Math.pow(r_base - 0.3, 2) / 0.05) * 0.5;
      const spiralArms = 0.2 * Math.sin(3 * theta - r_base * 5);
      const convection = 0.15 * Math.sin(8 * theta) * r_base;
      
      const height = a * (eyeWall + b * spiralArms + c * 0.5 * convection);
      const r = r_base * 1.5;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 128, vSegments: 48 }
  }
};

// ============================================================================
// ECONOMICS
// ============================================================================

export const ECONOMICS_SHAPES: Record<string, ParametricSurface> = {
  market_dynamics: {
    name: "📈 Market Dynamics - Price Discovery",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const t = u * 10;
      const asset = v;
      
      const trend = 0.3 * Math.sin(t * 0.3);
      const volatility = 0.15 * Math.sin(5 * t + asset * Math.PI) * Math.cos(3 * t);
      const meanReversion = -0.1 * trend;
      
      const price = a * (1 + b * trend + c * volatility + meanReversion);
      const volume = 0.3 + 0.2 * Math.abs(volatility);
      
      const x = t * 0.3 - 1.5;
      const y = asset * 2 - 1;
      const z = price * 0.5 + d * 0.1 * Math.sin(time * 0.02);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  supply_demand_curves: {
    name: "📊 Supply/Demand - Market Equilibrium",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const quantity = u * 4;
      const curve = v;
      
      const supply = a * (0.5 + 0.3 * quantity);
      const demand = a * (2 - 0.3 * quantity);
      const price = curve * demand + (1 - curve) * supply;
      
      const equilibrium = Math.exp(-Math.pow(quantity - 2.5, 2) / 0.5);
      
      const x = quantity * b - 2;
      const y = price * c * 0.5;
      const z = equilibrium * 0.5 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  economic_network_analysis: {
    name: "🌐 Economic Network - Trade Flows",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const tradeFlow = Math.sin(4 * theta) * Math.cos(3 * phi);
      const gdpWeight = 1 + 0.2 * Math.sin(2 * theta + phi);
      const tariffBarrier = 0.1 * Math.abs(Math.sin(6 * theta));
      
      const r = a * gdpWeight * (1 + b * 0.2 * tradeFlow - c * 0.1 * tariffBarrier);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * tradeFlow;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  financial_risk_model: {
    name: "⚠️ Financial Risk - VaR Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const confidence = 0.9 + 0.09 * u;
      const timeHorizon = v * 5;
      
      const volatility = 0.2 * b;
      const var_value = a * volatility * Math.sqrt(timeHorizon) * 
                       (-2.33 + 2.33 * Math.sqrt(1 - confidence));
      const cvar = var_value * (1 + c * 0.3);
      
      const theta = v * 2 * Math.PI;
      const r = 0.2 + 0.1 * Math.sin(4 * theta);
      
      const x = (confidence - 0.95) * 20;
      const y = timeHorizon * 0.4 - 1;
      const z = Math.abs(var_value) * 0.5 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  }
};

// ============================================================================
// SOCIOLOGY
// ============================================================================

export const SOCIOLOGY_SHAPES: Record<string, ParametricSurface> = {
  social_network_analysis: {
    name: "👥 Social Network - Connection Graph",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const degree = 1 + 0.3 * Math.sin(5 * theta) * Math.cos(4 * phi);
      const clustering = 0.2 * Math.sin(3 * theta + phi);
      const centrality = 0.15 * Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.3);
      
      const r = a * (degree + b * clustering + c * centrality);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * centrality;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  population_migration_patterns: {
    name: "🚶 Population Migration - Demographic Flow",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const ruralUrban = Math.sin(theta + time * 0.01) * 
                        Math.exp(-Math.pow(phi - Math.PI/2, 2) / 0.5);
      const crossBorder = 0.3 * Math.sin(3 * theta) * Math.cos(2 * phi);
      const seasonal = 0.2 * Math.sin(4 * theta) * Math.sin(time * 0.02);
      
      const r = a * (1 + b * 0.2 * ruralUrban + c * 0.15 * crossBorder);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * seasonal;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  urban_development_model: {
    name: "🏙️ Urban Development - City Growth",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const r_base = v * 2;
      
      const downtown = Math.exp(-r_base * r_base / 0.3);
      const suburbs = 0.5 * Math.exp(-Math.pow(r_base - 1, 2) / 0.3);
      const sprawl = 0.3 * Math.exp(-Math.pow(r_base - 1.5, 2) / 0.5);
      const radialRoads = 0.1 * Math.abs(Math.sin(6 * theta));
      
      const density = a * (downtown + b * suburbs + c * sprawl);
      const x = r_base * Math.cos(theta) * 1.5;
      const y = r_base * Math.sin(theta) * 1.5;
      const z = density + d * 0.1 * radialRoads;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  },

  cultural_diffusion_system: {
    name: "🌍 Cultural Diffusion - Idea Spread",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const originPoint = Math.exp(-Math.pow(theta - Math.PI, 2) / 0.5 - 
                                  Math.pow(phi - Math.PI/2, 2) / 0.5);
      const diffusionWave = Math.sin(3 * theta + 2 * phi - time * 0.05) * 
                           (1 - originPoint);
      const barriers = 0.1 * Math.abs(Math.sin(8 * theta));
      
      const r = a * (1 + b * 0.3 * originPoint + c * 0.2 * diffusionWave - 0.05 * barriers);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * diffusionWave;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// POLITICAL SCIENCE
// ============================================================================

export const POLITICAL_SCIENCE_SHAPES: Record<string, ParametricSurface> = {
  voting_system_analysis: {
    name: "🗳️ Voting Systems - Electoral Geometry",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const plurality = Math.abs(Math.sin(3 * theta)) * 0.3;
      const proportional = 0.25 * (1 + 0.2 * Math.sin(5 * theta));
      const ranked = 0.2 * Math.sin(4 * theta + phi);
      
      const r = a * (1 + b * plurality + c * proportional + 0.5 * ranked);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  geopolitical_model: {
    name: "🌐 Geopolitical Model - Power Distribution",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const powerCenter1 = Math.exp(-Math.pow(theta - Math.PI/2, 2) / 0.5);
      const powerCenter2 = Math.exp(-Math.pow(theta - 3*Math.PI/2, 2) / 0.5);
      const influence = 0.3 * Math.sin(2 * theta) * Math.cos(phi);
      
      const r = a * (1 + b * 0.3 * powerCenter1 + c * 0.25 * powerCenter2 + 0.1 * influence);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * influence;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  policy_impact_visualization: {
    name: "📋 Policy Impact - Effect Propagation",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const sector = u * 2 * Math.PI;
      const timeline = v;
      
      const directEffect = Math.exp(-timeline * 2) * Math.sin(sector);
      const indirectEffect = Math.exp(-timeline) * Math.sin(2 * sector + 0.5) * 0.7;
      const feedback = Math.sin(3 * sector - time * 0.02) * timeline * 0.3;
      
      const impact = a * (b * directEffect + c * indirectEffect + feedback);
      const r = 0.5 + 0.3 * Math.abs(impact);
      
      const x = r * Math.cos(sector);
      const y = r * Math.sin(sector);
      const z = timeline * 3 - 1.5 + d * 0.1 * impact;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  },

  democratic_process_simulation: {
    name: "🏛️ Democratic Process - Deliberation Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const consensus = 0.5 + 0.3 * Math.cos(time * 0.02);
      const polarization = 0.3 * Math.abs(Math.sin(2 * theta));
      const deliberation = Math.sin(3 * theta + phi + time * 0.01);
      
      const r = a * (consensus + b * 0.2 * deliberation - c * 0.15 * polarization);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1 * deliberation;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// INDUSTRIAL ENGINEERING
// ============================================================================

export const INDUSTRIAL_ENGINEERING_SHAPES: Record<string, ParametricSurface> = {
  manufacturing_optimization: {
    name: "🏭 Manufacturing Optimization - Process Flow",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const station = u * 5;
      const throughput = v;
      
      const bottleneck = Math.exp(-Math.pow(station - 2.5, 2) / 0.5);
      const efficiency = 0.7 + 0.2 * Math.sin(station * 2) * throughput;
      const waste = 0.1 * (1 - efficiency) * Math.sin(5 * station);
      
      const flow = a * efficiency * (1 - b * 0.3 * bottleneck);
      const theta = v * 2 * Math.PI;
      const r = 0.2 + 0.1 * Math.sin(4 * theta);
      
      const x = station * 0.5 - 1.25;
      const y = flow * c + r * Math.cos(theta) * 0.2;
      const z = r * Math.sin(theta) * 0.2 + d * 0.1 * waste;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  supply_chain_visualization: {
    name: "📦 Supply Chain - Logistics Network",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const tier = v;
      
      const suppliers = Math.sin(8 * theta) * (1 - tier);
      const manufacturers = Math.sin(4 * theta + Math.PI/4) * tier * (1 - tier) * 2;
      const distributors = Math.sin(6 * theta + Math.PI/2) * tier * tier;
      
      const r = a * (0.5 + 0.2 * b * suppliers + 0.3 * c * manufacturers + 0.2 * distributors);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = tier * 3 - 1.5 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  },

  quality_control_systems: {
    name: "✅ Quality Control - Six Sigma",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const measurement = (u - 0.5) * 6 * a;
      const sigma = b;
      
      const normalDist = Math.exp(-measurement * measurement / (2 * sigma * sigma));
      const ucl = 3 * sigma;
      const lcl = -3 * sigma;
      const inControl = measurement > lcl && measurement < ucl ? 1 : 0;
      
      const theta = v * 2 * Math.PI;
      const r = 0.1 + 0.05 * Math.sin(4 * theta);
      
      const x = measurement * 0.3;
      const y = normalDist * c + r * Math.cos(theta) * 0.2;
      const z = r * Math.sin(theta) * 0.2 + d * 0.1 * inControl;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  lean_manufacturing_flow: {
    name: "🔄 Lean Manufacturing - Value Stream",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const process = u * 6;
      const phi = v * 2 * Math.PI;
      
      const valueAdd = Math.sin(process * 0.5) * (1 + 0.3 * Math.sin(time * 0.02));
      const waste = 0.2 * Math.abs(Math.sin(3 * process));
      const flow = 1 - waste * 0.5;
      
      const r = 0.3 * a * flow;
      const x = process * 0.4 - 1.2;
      const y = r * b * Math.cos(phi);
      const z = r * c * Math.sin(phi) + valueAdd * 0.3 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  }
};

// ============================================================================
// CIVIL ENGINEERING
// ============================================================================

export const CIVIL_ENGINEERING_SHAPES: Record<string, ParametricSurface> = {
  structural_load_analysis: {
    name: "🏗️ Structural Load - Stress Distribution",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const x_pos = (u - 0.5) * 4 * a;
      const y_pos = (v - 0.5) * 4 * b;
      
      const pointLoad = Math.exp(-(x_pos * x_pos + y_pos * y_pos) / (c * c));
      const bendingMoment = x_pos * x_pos * 0.1;
      const shear = Math.abs(x_pos) * 0.05;
      
      const deflection = -0.3 * pointLoad * (1 - Math.abs(x_pos) / 2);
      
      const x = x_pos;
      const y = y_pos;
      const z = deflection + d * 0.1 * (bendingMoment + shear);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 64 }
  },

  traffic_flow_optimization: {
    name: "🚗 Traffic Flow - Network Optimization",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const road = u * 4;
      const lane = v;
      
      const density = 0.5 + 0.3 * Math.sin(road * 2 + time * 0.05);
      const speed = 1 - 0.8 * density * density;
      const flow = density * speed;
      const congestion = Math.max(0, density - 0.7);
      
      const theta = lane * 2 * Math.PI;
      const r = 0.2 * a * (1 + b * 0.3 * flow);
      
      const x = road * 0.7 - 1.4;
      const y = r * Math.cos(theta);
      const z = r * Math.sin(theta) + c * 0.3 * speed - d * 0.2 * congestion;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  urban_planning_model: {
    name: "🏙️ Urban Planning - Zoning Model",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const x_pos = (u - 0.5) * 4 * a;
      const y_pos = (v - 0.5) * 4 * b;
      
      const downtown = Math.exp(-(x_pos * x_pos + y_pos * y_pos) / 1) * 2;
      const commercial = 0.8 * Math.exp(-Math.pow(Math.sqrt(x_pos * x_pos + y_pos * y_pos) - 1, 2) / 0.3);
      const residential = 0.5 * Math.exp(-Math.pow(Math.sqrt(x_pos * x_pos + y_pos * y_pos) - 2, 2) / 0.5);
      
      const height = downtown + c * commercial + 0.5 * residential;
      
      const x = x_pos;
      const y = y_pos;
      const z = height + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 64 }
  },

  infrastructure_resilience: {
    name: "🌉 Infrastructure Resilience - Network Robustness",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const redundancy = 1 + 0.2 * Math.sin(4 * theta) * Math.cos(3 * phi);
      const failurePoint = 0.15 * Math.exp(-Math.pow(theta - Math.PI, 2) / 0.3);
      const recovery = 0.1 * Math.sin(5 * theta + phi);
      
      const r = a * redundancy * (1 - b * failurePoint + c * 0.5 * recovery);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  }
};

// ============================================================================
// AEROSPACE ENGINEERING
// ============================================================================

export const AEROSPACE_ENGINEERING_SHAPES: Record<string, ParametricSurface> = {
  aerodynamic_flow: {
    name: "✈️ Aerodynamic Flow - Airfoil Pressure",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const chord = u;
      const span = (v - 0.5) * 2;
      
      const thickness = 0.12 * Math.sin(Math.PI * chord) * (1 - 0.3 * span * span);
      const camber = 0.04 * chord * (1 - chord);
      const pressureTop = -0.5 * a * (1 - chord) * Math.exp(-chord * 2);
      const pressureBottom = 0.3 * a * chord * (1 - chord);
      
      const x = chord * 2 * b - 1;
      const y = span * c;
      const z = thickness + camber + d * 0.1 * (pressureTop - pressureBottom);
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  orbital_mechanics: {
    name: "🛰️ Orbital Mechanics - Kepler Ellipse",
    equation: (u, v, params) => {
      const a = params.d ?? 2;  // Semi-major axis
      const b = params.e ?? 1;  // Eccentricity factor
      const c = params.f ?? 1;  // Inclination
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const trueAnomaly = u * 2 * Math.PI + time * 0.02;
      const e = 0.3 * b;  // Eccentricity
      
      const r_orbit = a * (1 - e * e) / (1 + e * Math.cos(trueAnomaly));
      const inclination = c * 0.3;
      
      const theta = v * 2 * Math.PI;
      const r_tube = 0.1;
      
      const x_orbit = r_orbit * Math.cos(trueAnomaly);
      const y_orbit = r_orbit * Math.sin(trueAnomaly) * Math.cos(inclination);
      const z_orbit = r_orbit * Math.sin(trueAnomaly) * Math.sin(inclination);
      
      const x = x_orbit + r_tube * Math.cos(theta) * 0.3;
      const y = y_orbit + r_tube * Math.sin(theta) * 0.3;
      const z = z_orbit + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 24 }
  },

  propulsion_system_model: {
    name: "🚀 Propulsion System - Thrust Vector",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const nozzle = Math.exp(-Math.pow(t - 0.2, 2) / 0.02) * (1 - t);
      const exhaust = Math.max(0, t - 0.2) * Math.exp(-(t - 0.2) * 0.5);
      const turbulence = 0.1 * Math.sin(10 * theta + time * 0.2) * exhaust;
      
      const r = a * 0.3 * (nozzle + b * 0.8 * exhaust * (1 + 0.3 * Math.sin(5 * t)));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t * 4 * c - 0.8 + d * turbulence;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 48 }
  },

  flight_path_optimization: {
    name: "🛫 Flight Path - Great Circle Route",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const progress = u;
      const lat1 = 0.7, lon1 = -2.1;  // Origin
      const lat2 = 0.9, lon2 = 0.1;    // Destination
      
      const lat = lat1 + (lat2 - lat1) * progress + 
                 0.1 * b * Math.sin(progress * Math.PI);  // Great circle deviation
      const lon = lon1 + (lon2 - lon1) * progress;
      const altitude = 0.1 + 0.3 * c * Math.sin(progress * Math.PI);  // Cruise altitude
      
      const r = a * (1 + altitude);
      const theta = v * 0.2 - 0.1;  // Path width
      
      const x = r * Math.cos(lat) * Math.cos(lon + theta);
      const y = r * Math.cos(lat) * Math.sin(lon + theta);
      const z = r * Math.sin(lat) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 16 }
  }
};

// ============================================================================
// BIOINFORMATICS ALGORITHMS
// ============================================================================

export const BIOINFORMATICS_ALGORITHMS: Record<string, ParametricSurface> = {
  needleman_wunsch_alignment: {
    name: "🧬 Needleman-Wunsch - Global Alignment Matrix",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const i = Math.floor(u * 10);
      const j = Math.floor(v * 10);
      
      const match = (i + j) % 3 === 0 ? 2 : -1;
      const gapPenalty = -2;
      const score = match * (1 + 0.1 * Math.sin(i + j));
      
      const x = u * 3 * a - 1.5;
      const y = v * 3 * b - 1.5;
      const z = score * 0.2 * c + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 32, vSegments: 32 }
  },

  smith_waterman_local: {
    name: "🔍 Smith-Waterman - Local Alignment",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const i = u * 10;
      const j = v * 10;
      
      const localMatch = Math.max(0, 2 * Math.sin(i * 0.5) * Math.cos(j * 0.5));
      const hotspot = Math.exp(-Math.pow(i - 5, 2) / 2 - Math.pow(j - 5, 2) / 2);
      
      const x = u * 3 * a - 1.5;
      const y = v * 3 * b - 1.5;
      const z = (localMatch + c * hotspot) * 0.3 + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 32, vSegments: 32 }
  },

  blast_heuristic_search: {
    name: "⚡ BLAST - Seed-and-Extend Search",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const seedHit = Math.exp(-Math.pow(t - 0.3, 2) / 0.02) * (1 + 0.5 * Math.sin(5 * theta));
      const extension = t > 0.3 ? Math.exp(-(t - 0.3) * 2) : 0;
      const eValue = Math.exp(-t * 3);
      
      const r = a * 0.3 * (seedHit + b * extension);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t * 3 * c - 0.5 + d * 0.1 * eValue;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 32 }
  },

  hidden_markov_model: {
    name: "📊 Hidden Markov Model - State Transitions",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const state = Math.floor(v * 4);
      
      const emission = Math.sin(theta * (state + 1)) * 0.3;
      const transition = Math.cos(theta * 2 + state * Math.PI / 2) * 0.2;
      
      const r = a * (0.5 + b * 0.3 * Math.abs(emission));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = state * 0.7 * c - 1 + transition + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 64, vSegments: 16 }
  },

  debruijn_graph_assembly: {
    name: "🔗 De Bruijn Graph - Genome Assembly",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 4 * Math.PI;
      const t = v;
      
      const kmer = Math.sin(theta * 3) * Math.cos(t * Math.PI);
      const overlap = 0.3 * Math.sin(theta * 5 + t * 2);
      const coverage = 1 + 0.2 * Math.sin(theta * 2);
      
      const r = a * 0.3 * coverage * (1 + b * 0.2 * kmer);
      const spiral = t * 2;
      
      const x = r * Math.cos(theta) * (1 + 0.3 * t);
      const y = r * Math.sin(theta) * (1 + 0.3 * t);
      const z = spiral * c + d * 0.1 * overlap;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 128, vSegments: 32 }
  },

  markov_state_model: {
    name: "🔄 Markov State Model - Conformational Dynamics",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const time = params.time ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const state1 = Math.exp(-Math.pow(theta - Math.PI/2, 2) / 0.5);
      const state2 = Math.exp(-Math.pow(theta - 3*Math.PI/2, 2) / 0.5);
      const transition = Math.sin(time * 0.05) * 0.5 + 0.5;
      
      const r = a * (1 + b * 0.3 * (state1 * (1 - transition) + state2 * transition));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + c * 0.2 * (state1 - state2) + d * 0.1;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 72 }
  },

  graph_neural_network_mol: {
    name: "🧠 Graph Neural Network - Molecular Property",
    equation: (u, v, params) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const layer = v;
      
      const atomFeatures = Math.sin(5 * theta) * (1 - layer);
      const bondFeatures = Math.sin(3 * theta + layer * Math.PI) * 0.5;
      const messagePass = Math.cos(4 * theta) * layer * 0.7;
      const aggregation = (atomFeatures + bondFeatures + messagePass) / 3;
      
      const r = a * (0.5 + b * 0.3 * Math.abs(aggregation));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = layer * 3 * c - 1.5 + d * 0.1 * aggregation;
      
      return [x, y, z];
    },
    defaultParams: { d: 2, e: 1, f: 1, g: 0, uSegments: 96, vSegments: 48 }
  }
};

// Combine all shapes into a single export
export const SCIENTIFIC_EXPANSION_SHAPES: Record<string, ParametricSurface> = {
  ...UNIFIED_WHOLENESS,
  ...MOLECULAR_BIOLOGY_SHAPES,
  ...MICROBIOLOGY_SHAPES,
  ...BOTANY_SHAPES,
  ...ZOOLOGY_ECOLOGY_SHAPES,
  ...GEOLOGY_SHAPES,
  ...OCEANOGRAPHY_SHAPES,
  ...METEOROLOGY_SHAPES,
  ...ECONOMICS_SHAPES,
  ...SOCIOLOGY_SHAPES,
  ...POLITICAL_SCIENCE_SHAPES,
  ...INDUSTRIAL_ENGINEERING_SHAPES,
  ...CIVIL_ENGINEERING_SHAPES,
  ...AEROSPACE_ENGINEERING_SHAPES,
  ...BIOINFORMATICS_ALGORITHMS
};
