/**
 * UNIFIED SCIENTIFIC IDENTITY PRINCIPLES (ALAREX)
 * © 2025 UUON Foundation Inc. - Proprietary
 * 
 * Implements the 4 Scientific Identity Principles:
 * 1. Chemical Identity Principle (CIP) - Molecular geometry, reactions, orbitals
 * 2. Nuclear Identity Principle (NIP) - Binding energy, decay, nucleon configurations
 * 3. Biological Identity Principle (BIP) - Cellular patterns, growth, Turing systems
 * 4. Medical Identity Principle (MIP) - Drug binding, pharmacokinetics, imaging
 * 
 * Mathematical Foundation:
 * Identity = U(N -> C -> B -> M) - Unified chain from nuclear to medical
 * 
 * Reference: "Unified Scientific Identity Principles" LaTeX Document
 */

import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ScientificIdentityShape {
  name: string;
  description: string;
  domain: 'chemical' | 'nuclear' | 'biological' | 'medical' | 'unified';
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  scientificBasis: string;
  formulaReference: string;
}

// =============================================================================
// CHEMICAL IDENTITY PRINCIPLE (CIP)
// "Atoms act as points; bonds as lines; molecules as geometric structures"
// =============================================================================

const CHEMICAL_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {
  
  schrodinger_wavefunction: {
    name: "⚛️ Schrodinger Wavefunction: Hψ = Eψ",
    description: "Quantum mechanical wavefunction visualization. The probability amplitude of finding an electron at position r.",
    domain: 'chemical',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const n = Math.floor((params.b ?? 1) * 3) + 1;
      const l = Math.floor((params.c ?? 0.5) * n);
      const amplitude = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = scale * (0.3 + 0.7 * v);
      
      const radialPart = Math.exp(-r / (n * 0.5)) * Math.pow(r, l);
      const angularPart = Math.cos(l * theta) * Math.sin(phi);
      const psi = radialPart * angularPart * amplitude;
      
      const x = r * Math.sin(phi) * Math.cos(theta) * (1 + psi * 0.3);
      const y = r * Math.sin(phi) * Math.sin(theta) * (1 + psi * 0.3);
      const z = r * Math.cos(phi) * (1 + psi * 0.3);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Quantum mechanics, Schrodinger equation",
    formulaReference: "Hψ = Eψ"
  },

  molecular_stability_surface: {
    name: "🧪 Molecular Stability: E_mol = min U(x₁...xₙ)",
    description: "Potential energy surface showing molecular stability minima. Visualizes how molecular energy varies with atomic positions.",
    domain: 'chemical',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const wellDepth = params.b ?? 2;
      const separation = params.c ?? 1;
      const anharmonicity = params.d ?? 0.3;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const r1 = Math.sqrt((x + separation) ** 2 + y ** 2);
      const r2 = Math.sqrt((x - separation) ** 2 + y ** 2);
      
      const morse1 = wellDepth * (1 - Math.exp(-r1)) ** 2;
      const morse2 = wellDepth * (1 - Math.exp(-r2)) ** 2;
      
      const interaction = -wellDepth * 0.5 * Math.exp(-(r1 * r2) / separation);
      const anharmonic = anharmonicity * (x ** 4 + y ** 4) * 0.01;
      
      const z = (morse1 + morse2 + interaction + anharmonic) - wellDepth;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 64, vSegments: 64 }),
    scientificBasis: "Potential energy surface, molecular optimization",
    formulaReference: "E_mol = min{x_i} U(x_1,...,x_n)"
  },

  reaction_kinetics_flow: {
    name: "⚗️ Reaction Dynamics: dC/dt = R(C,T,P)",
    description: "Chemical reaction kinetics visualization. Shows concentration evolution through reaction coordinate space.",
    domain: 'chemical',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const rateConstant = params.b ?? 1;
      const temperature = params.c ?? 1;
      const pressure = params.d ?? 1;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const t = v * 10;
      
      const k = rateConstant * Math.exp(-1 / temperature);
      const concentration = Math.exp(-k * t);
      const product = 1 - concentration;
      
      const flowX = concentration * Math.cos(theta + time);
      const flowY = concentration * Math.sin(theta + time);
      const flowZ = product * pressure;
      
      const r = scale * (0.3 + 0.7 * (concentration + product * 0.3));
      
      const x = r * (1 + flowX * 0.2) * Math.cos(theta);
      const y = r * (1 + flowY * 0.2) * Math.sin(theta);
      const z = scale * (v - 0.5) * 2 + flowZ * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 64, vSegments: 48 }),
    scientificBasis: "Chemical kinetics, Arrhenius equation",
    formulaReference: "dC_i/dt = R_i(C, T, P)"
  },

  molecular_orbital_hybridization: {
    name: "🔬 Molecular Orbital Hybridization",
    description: "sp3 and sp2 orbital hybridization visualization showing electron density lobes.",
    domain: 'chemical',
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const hybridType = params.b ?? 3;
      const lobeSize = params.c ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let numLobes = Math.floor(hybridType) + 1;
      numLobes = Math.min(4, Math.max(2, numLobes));
      
      let r = scale * 0.3;
      for (let i = 0; i < numLobes; i++) {
        const lobeAngle = (i / numLobes) * Math.PI * 2;
        const lobePhi = Math.PI / 2;
        
        const dx = Math.sin(phi) * Math.cos(theta) - Math.sin(lobePhi) * Math.cos(lobeAngle);
        const dy = Math.sin(phi) * Math.sin(theta) - Math.sin(lobePhi) * Math.sin(lobeAngle);
        const dz = Math.cos(phi) - Math.cos(lobePhi);
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        r += lobeSize * Math.exp(-dist * 3);
      }
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "LCAO-MO theory, orbital hybridization",
    formulaReference: "ψ_hybrid = Σc_i φ_i"
  },

  covalent_bond_surface: {
    name: "🔗 Covalent Bond Electron Density",
    description: "Electron density distribution between bonded atoms showing sigma and pi bond character.",
    domain: 'chemical',
    equation: (u, v, params) => {
      const bondLength = params.a ?? 2;
      const sigma = params.b ?? 1;
      const pi = params.c ?? 0;
      
      const theta = u * Math.PI * 2;
      const s = (v - 0.5) * bondLength * 2;
      
      const atom1Dist = Math.abs(s + bondLength / 2);
      const atom2Dist = Math.abs(s - bondLength / 2);
      
      const sigmaDensity = Math.exp(-atom1Dist * sigma) + Math.exp(-atom2Dist * sigma);
      const midpointFactor = 1 + 0.5 * Math.exp(-Math.abs(s) * 2);
      
      const piDensity = pi * Math.sin(theta) ** 2 * Math.exp(-Math.abs(s) * 0.5);
      
      const r = (sigmaDensity * midpointFactor + piDensity) * 0.5;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = s;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 48, vSegments: 64 }),
    scientificBasis: "Molecular orbital theory, electron density",
    formulaReference: "ρ(r) = |ψ(r)|²"
  }
};

// =============================================================================
// NUCLEAR IDENTITY PRINCIPLE (NIP)
// "Nucleons combine under strong force interactions to form nuclei"
// =============================================================================

const NUCLEAR_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {

  binding_energy_curve: {
    name: "☢️ Nuclear Binding Energy: E_b = [Zm_p + Nm_n - m_nuc]c²",
    description: "Semi-empirical mass formula visualization showing binding energy per nucleon across the nuclear chart.",
    domain: 'nuclear',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const volume = params.b ?? 15.8;
      const surface = params.c ?? 18.3;
      const coulomb = params.d ?? 0.71;
      
      const Z = Math.floor(u * 100) + 1;
      const N = Math.floor(v * 150) + 1;
      const A = Z + N;
      
      const volumeTerm = volume * A;
      const surfaceTerm = -surface * Math.pow(A, 2 / 3);
      const coulombTerm = -coulomb * Z * (Z - 1) / Math.pow(A, 1 / 3);
      const asymmetryTerm = -23.2 * Math.pow(N - Z, 2) / A;
      
      const bindingEnergy = volumeTerm + surfaceTerm + coulombTerm + asymmetryTerm;
      const bePerNucleon = bindingEnergy / A;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = bePerNucleon * 0.3 - 4;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 64, vSegments: 64 }),
    scientificBasis: "Semi-empirical mass formula, nuclear binding",
    formulaReference: "E_b = [Zm_p + Nm_n - m_nucleus]c²"
  },

  radioactive_decay_cascade: {
    name: "⚡ Radioactive Decay: N(t) = N₀e^(-λt)",
    description: "Exponential decay visualization showing radioactive decay chains and daughter nuclei formation.",
    domain: 'nuclear',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const lambda = params.b ?? 0.5;
      const initialN = params.c ?? 1;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const t = v * 10;
      
      const N = initialN * Math.exp(-lambda * (t + time * 0.1));
      const daughter = initialN * (1 - Math.exp(-lambda * t));
      
      const decayWave = Math.sin(t * lambda * Math.PI * 2) * 0.2;
      
      const r = scale * (0.3 + N * 0.7 + decayWave);
      const spiralAngle = theta + t * lambda;
      
      const x = r * Math.cos(spiralAngle);
      const y = r * Math.sin(spiralAngle);
      const z = scale * (v - 0.5) * 2 - daughter * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Radioactive decay law, exponential decay",
    formulaReference: "N(t) = N_0 e^(-λt)"
  },

  nucleon_shell_model: {
    name: "🔵 Nuclear Shell Model",
    description: "Nuclear shell structure showing magic numbers and nucleon energy levels.",
    domain: 'nuclear',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const shellNumber = params.b ?? 3;
      const spinOrbit = params.c ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const magicNumbers = [2, 8, 20, 28, 50, 82, 126];
      const shell = Math.floor(shellNumber * 5) + 1;
      
      let r = scale * 0.3;
      for (let n = 1; n <= shell; n++) {
        const shellRadius = n * 0.3;
        const l = n - 1;
        const orbitalShape = Math.abs(Math.cos(l * theta)) ** 0.5;
        
        const spinFactor = 1 + spinOrbit * Math.sin(phi * (2 * l + 1)) * 0.1;
        
        r += shellRadius * orbitalShape * spinFactor * Math.exp(-Math.abs(phi - Math.PI / 2) * 0.5);
      }
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Nuclear shell model, magic numbers",
    formulaReference: "E_n = ℏω(2n + l + 3/2) + V_ls·l·s"
  },

  strong_force_potential: {
    name: "💪 Strong Force Yukawa Potential",
    description: "Nuclear strong force visualization using Yukawa meson-exchange potential.",
    domain: 'nuclear',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const coupling = params.b ?? 1;
      const mesonMass = params.c ?? 1;
      
      const theta = u * Math.PI * 2;
      const r = v * scale * 2 + 0.1;
      
      const yukawa = -coupling * Math.exp(-mesonMass * r) / r;
      const repulsiveCore = coupling * 10 * Math.exp(-r * 5);
      
      const potential = yukawa + repulsiveCore;
      
      const surfaceR = Math.abs(potential) * 0.5 + 0.3;
      
      const x = surfaceR * Math.cos(theta);
      const y = surfaceR * Math.sin(theta);
      const z = (v - 0.5) * scale * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 48, vSegments: 64 }),
    scientificBasis: "Yukawa potential, meson exchange",
    formulaReference: "V(r) = -g² e^(-mr)/r"
  },

  isotope_valley_stability: {
    name: "🏔️ Valley of Nuclear Stability",
    description: "Nuclear chart visualization showing the valley of stability where beta-stable nuclei reside.",
    domain: 'nuclear',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const asymmetry = params.b ?? 1;
      
      const Z = u * 100;
      const N = v * 150;
      
      const stabilityLine = 0.485 * Z + 0.004 * Z * Z;
      const deviation = N - stabilityLine;
      
      const valleyDepth = -asymmetry * 2 * Math.exp(-deviation * deviation / (20 * Z + 10));
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = valleyDepth;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 64, vSegments: 64 }),
    scientificBasis: "Nuclear stability, beta decay",
    formulaReference: "N_stable ≈ Z(1 + 0.015A^(2/3))"
  }
};

// =============================================================================
// BIOLOGICAL IDENTITY PRINCIPLE (BIP)
// "Cells represent points; lineages form pathways; organisms become structures"
// =============================================================================

const BIOLOGICAL_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {

  iterative_development: {
    name: "🧬 Iterative Development: x_{n+1} = F(x_n)",
    description: "Cellular development through iterative mapping. Shows how simple rules create complex biological patterns.",
    domain: 'biological',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const r_param = params.b ?? 3.5;
      const iterations = Math.floor((params.c ?? 0.5) * 20) + 5;
      
      const theta = u * Math.PI * 2;
      let x_n = v;
      
      for (let i = 0; i < iterations; i++) {
        x_n = r_param * x_n * (1 - x_n);
      }
      
      const bifurcation = Math.sin(x_n * Math.PI * 4);
      const r = scale * (0.3 + x_n * 0.7 + bifurcation * 0.1);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = scale * (v - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 64 }),
    scientificBasis: "Logistic map, developmental biology",
    formulaReference: "x_{n+1} = F(x_n)"
  },

  turing_pattern_formation: {
    name: "🦓 Turing Pattern: ∂u/∂t = D∇²u + f(u,v)",
    description: "Reaction-diffusion pattern formation. Models animal coat patterns, embryonic development, and morphogenesis.",
    domain: 'biological',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const diffusionU = params.b ?? 1;
      const diffusionV = params.c ?? 0.5;
      const feedRate = params.d ?? 0.055;
      const killRate = params.e ?? 0.062;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const spatialFreq = 4;
      const pattern1 = Math.sin(spatialFreq * theta) * Math.cos(spatialFreq * phi);
      const pattern2 = Math.cos(spatialFreq * 1.5 * theta) * Math.sin(spatialFreq * 0.7 * phi);
      
      const activator = 0.5 + pattern1 * diffusionU * 0.3;
      const inhibitor = 0.5 + pattern2 * diffusionV * 0.3;
      
      const reaction = feedRate * (1 - activator) - killRate * activator * inhibitor * inhibitor;
      
      const r = scale * (0.8 + (activator - inhibitor) * 0.3 + reaction * Math.sin(time) * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Turing morphogenesis, reaction-diffusion",
    formulaReference: "∂u/∂t = D_u∇²u + f(u,v)"
  },

  cellular_growth_spiral: {
    name: "🌀 Cellular Growth Spiral",
    description: "Fibonacci-like growth patterns in biological systems. Models phyllotaxis, shell growth, and tissue development.",
    domain: 'biological',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const phi_ratio = params.b ?? 1.618;
      const growthRate = params.c ?? 0.1;
      
      const theta = u * Math.PI * 8;
      const t = v;
      
      const r = scale * growthRate * Math.exp(theta / (2 * Math.PI * phi_ratio));
      const height = t * scale * 2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height - scale;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 128, vSegments: 32 }),
    scientificBasis: "Phyllotaxis, golden ratio growth",
    formulaReference: "r(θ) = ae^(bθ)"
  },

  neural_network_topology: {
    name: "🧠 Neural Network Topology",
    description: "Biological neural network structure showing dendritic branching and synaptic connectivity.",
    domain: 'biological',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const branchingFactor = params.b ?? 3;
      const connectivity = params.c ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const layer = Math.floor(v * 5);
      const nodeInLayer = v * 5 - layer;
      
      const layerRadius = scale * (0.2 + layer * 0.3);
      const nodeAngle = theta + nodeInLayer * Math.PI * 2 / branchingFactor;
      
      const dendrite = Math.sin(theta * branchingFactor) * connectivity * 0.3;
      const axon = Math.cos(v * Math.PI * 4) * 0.2;
      
      const r = layerRadius + dendrite;
      
      const x = r * Math.cos(nodeAngle);
      const y = r * Math.sin(nodeAngle);
      const z = scale * (v - 0.5) * 2 + axon;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 64 }),
    scientificBasis: "Neuroscience, dendritic morphology",
    formulaReference: "∫∫ w_ij·f(x_j)dA"
  },

  cell_membrane_dynamics: {
    name: "🔴 Cell Membrane Lipid Bilayer",
    description: "Phospholipid bilayer dynamics showing membrane fluidity and protein channels.",
    domain: 'biological',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const fluidity = params.b ?? 0.5;
      const proteinDensity = params.c ?? 0.3;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const membrane = Math.sin(theta * 8 + time) * fluidity * 0.05;
      const protein = proteinDensity * Math.exp(-((theta % 1) ** 2 + (phi - Math.PI / 2) ** 2) * 10);
      
      const r = scale * (1 + membrane + protein * 0.2);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 96, vSegments: 48 }),
    scientificBasis: "Cell biology, membrane dynamics",
    formulaReference: "D = kT/(6πηr)"
  }
};

// =============================================================================
// MEDICAL IDENTITY PRINCIPLE (MIP)
// "Medicine applies chemical, nuclear, and biological rules to maintain function"
// =============================================================================

const MEDICAL_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {

  drug_receptor_binding: {
    name: "💊 Drug-Receptor Binding: K_d = [D][R]/[DR]",
    description: "Ligand-receptor binding equilibrium. Visualizes drug affinity and receptor occupancy.",
    domain: 'medical',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const kd = params.b ?? 1;
      const drugConc = params.c ?? 2;
      const receptorDensity = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const occupancy = drugConc / (drugConc + kd);
      const bindingSite = Math.exp(-((phi - Math.PI / 2) ** 2) * 5);
      
      const bound = occupancy * bindingSite * receptorDensity;
      const conformationalChange = Math.sin(theta * 4) * bound * 0.2;
      
      const r = scale * (0.8 + bound * 0.4 + conformationalChange);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Pharmacology, receptor binding theory",
    formulaReference: "K_d = [D][R]/[DR]"
  },

  pharmacokinetics_curve: {
    name: "📈 Pharmacokinetics: dE/dt = k_a·D - k_e·E",
    description: "Drug absorption and elimination dynamics. Shows plasma concentration over time.",
    domain: 'medical',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const ka = params.b ?? 1;
      const ke = params.c ?? 0.2;
      const dose = params.d ?? 1;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const t = v * 24;
      
      const E = (ka * dose / (ka - ke)) * (Math.exp(-ke * t) - Math.exp(-ka * t));
      const concentration = Math.max(0, E);
      
      const cMax = ka * dose / (ka - ke) * Math.pow(ke / ka, ke / (ka - ke));
      const normalized = concentration / (cMax + 0.001);
      
      const r = scale * (0.3 + normalized * 0.7);
      const spiral = theta + t * 0.1 + time * 0.05;
      
      const x = r * Math.cos(spiral);
      const y = r * Math.sin(spiral);
      const z = scale * (v - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 64 }),
    scientificBasis: "Pharmacokinetics, ADME",
    formulaReference: "dE/dt = k_a·D - k_e·E"
  },

  nuclear_imaging_decay: {
    name: "🔬 Nuclear Imaging: I(t) = I₀e^(-λt)",
    description: "Nuclear medicine imaging dynamics. Shows radiotracer distribution and decay in tissue.",
    domain: 'medical',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const lambda = params.b ?? 0.1;
      const initialIntensity = params.c ?? 1;
      const uptake = params.d ?? 0.5;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const decay = Math.exp(-lambda * (time + v * 10));
      const I = initialIntensity * decay;
      
      const organUptake = uptake * Math.exp(-((phi - Math.PI / 2) ** 2 + (theta - Math.PI) ** 2) * 2);
      const hotspot = I * (1 + organUptake * 3);
      
      const r = scale * (0.7 + hotspot * 0.5);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Nuclear medicine, PET/SPECT imaging",
    formulaReference: "I(t) = I_0·e^(-λt)"
  },

  therapeutic_dose_response: {
    name: "💉 Dose-Response Curve (Hill Equation)",
    description: "Sigmoidal dose-response relationship. Shows EC50 and therapeutic window.",
    domain: 'medical',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const ec50 = params.b ?? 1;
      const hillCoeff = params.c ?? 2;
      const emax = params.d ?? 1;
      
      const dose = Math.pow(10, (u - 0.5) * 4);
      const effect = emax * Math.pow(dose, hillCoeff) / (Math.pow(ec50, hillCoeff) + Math.pow(dose, hillCoeff));
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = effect * scale * 0.5 + Math.sin(v * Math.PI * 2) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 64, vSegments: 32 }),
    scientificBasis: "Pharmacodynamics, Hill equation",
    formulaReference: "E = E_max·D^n/(EC50^n + D^n)"
  },

  cardiac_electrical_propagation: {
    name: "❤️ Cardiac Electrical Propagation",
    description: "Action potential wavefront propagation through cardiac tissue. Models ECG and arrhythmias.",
    domain: 'medical',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const conductionVelocity = params.b ?? 1;
      const refractoryPeriod = params.c ?? 0.3;
      const time = params.time ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const wavePosition = (time * conductionVelocity) % (2 * Math.PI);
      const distFromWave = Math.abs(theta - wavePosition);
      
      const actionPotential = Math.exp(-distFromWave * 3) * (1 - Math.exp(-distFromWave / refractoryPeriod));
      const depolarization = actionPotential * Math.sin(phi);
      
      const r = scale * (0.8 + depolarization * 0.4);
      
      const heartX = r * Math.sin(phi) * Math.cos(theta) * (1 + 0.2 * Math.cos(2 * phi));
      const heartY = r * Math.sin(phi) * Math.sin(theta);
      const heartZ = r * Math.cos(phi) * 1.3;
      
      return [heartX, heartY, heartZ];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Cardiac electrophysiology, action potentials",
    formulaReference: "∂V/∂t = D∇²V + I_ion"
  }
};

// =============================================================================
// UNIFIED SCIENTIFIC IDENTITY
// "Identity = U(N -> C -> B -> M)"
// =============================================================================

const UNIFIED_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {

  unified_scientific_identity: {
    name: "🌐 Unified Scientific Identity: U(N→C→B→M)",
    description: "The complete chain from nuclear physics to chemistry to biology to medicine. All scientific domains unified.",
    domain: 'unified',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const nuclear = params.b ?? 1;
      const chemical = params.c ?? 1;
      const biological = params.d ?? 1;
      const medical = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const N = nuclear * Math.exp(-v * 2);
      const C = chemical * Math.sin(theta * 2) * N;
      const B = biological * Math.cos(phi * 3) * (C + 0.3);
      const M = medical * (N + C + B) / 3;
      
      const identity = (N + C + B + M) / 4;
      
      const r = scale * (0.5 + identity * 0.8);
      
      const x = r * Math.sin(phi) * Math.cos(theta) * (1 + N * 0.1);
      const y = r * Math.sin(phi) * Math.sin(theta) * (1 + C * 0.1);
      const z = r * Math.cos(phi) * (1 + B * 0.1) + M * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Unified scientific identity, emergent complexity",
    formulaReference: "Identity = U(N → C → B → M)"
  },

  emergence_hierarchy: {
    name: "🔺 Emergence Hierarchy Surface",
    description: "How complexity emerges at each scientific level, from nuclear to medical applications.",
    domain: 'unified',
    equation: (u, v, params) => {
      const scale = params.a ?? 3;
      const emergenceFactor = params.b ?? 2;
      
      const theta = u * Math.PI * 2;
      const level = v * 4;
      
      const complexity = Math.pow(emergenceFactor, level);
      const normalized = complexity / Math.pow(emergenceFactor, 4);
      
      const levelModulation = Math.sin(theta * (1 + level * 2)) * 0.2;
      
      const r = scale * (0.3 + normalized * 0.7 + levelModulation);
      const height = scale * (v - 0.5) * 2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Emergent complexity, hierarchical organization",
    formulaReference: "C(n) = k^n"
  },

  cross_domain_bridge: {
    name: "🌉 Cross-Domain Bridge Manifold",
    description: "Mathematical bridge connecting all scientific identity principles into a unified framework.",
    domain: 'unified',
    equation: (u, v, params) => {
      const scale = params.a ?? 4;
      const coupling = params.b ?? 1;
      const symmetry = params.c ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const domain1 = Math.sin(theta * 2) * coupling;
      const domain2 = Math.cos(theta * 3) * coupling * 0.5;
      const domain3 = Math.sin(phi * 2) * symmetry;
      const domain4 = Math.cos(phi * 3) * symmetry * 0.5;
      
      const bridge = (domain1 + domain2 + domain3 + domain4) / 4;
      const interference = Math.sin(theta * phi * 2) * 0.1;
      
      const r = scale * (0.7 + bridge * 0.4 + interference);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1, b: 1, c: 1, x: 1, y: 1, z: 1, uSegments: 72, vSegments: 48 }),
    scientificBasis: "Cross-domain mathematics, unified frameworks",
    formulaReference: "B = ∫∫ Σ D_i(u,v) dudv"
  }
};

// =============================================================================
// MERGED EXPORT
// =============================================================================

export const SCIENTIFIC_IDENTITY_SHAPES: Record<string, ScientificIdentityShape> = {
  ...CHEMICAL_IDENTITY_SHAPES,
  ...NUCLEAR_IDENTITY_SHAPES,
  ...BIOLOGICAL_IDENTITY_SHAPES,
  ...MEDICAL_IDENTITY_SHAPES,
  ...UNIFIED_IDENTITY_SHAPES
};

export const SCIENTIFIC_IDENTITY_SHAPE_COUNT = Object.keys(SCIENTIFIC_IDENTITY_SHAPES).length;

export const SCIENTIFIC_IDENTITY_CATEGORIES = {
  chemical: Object.keys(CHEMICAL_IDENTITY_SHAPES),
  nuclear: Object.keys(NUCLEAR_IDENTITY_SHAPES),
  biological: Object.keys(BIOLOGICAL_IDENTITY_SHAPES),
  medical: Object.keys(MEDICAL_IDENTITY_SHAPES),
  unified: Object.keys(UNIFIED_IDENTITY_SHAPES)
};

console.log(`🔬 Scientific Identity Shapes loaded: ${SCIENTIFIC_IDENTITY_SHAPE_COUNT} shapes`);
console.log(`   ⚛️ Chemical (CIP): ${Object.keys(CHEMICAL_IDENTITY_SHAPES).length}`);
console.log(`   ☢️ Nuclear (NIP): ${Object.keys(NUCLEAR_IDENTITY_SHAPES).length}`);
console.log(`   🧬 Biological (BIP): ${Object.keys(BIOLOGICAL_IDENTITY_SHAPES).length}`);
console.log(`   💊 Medical (MIP): ${Object.keys(MEDICAL_IDENTITY_SHAPES).length}`);
console.log(`   🌐 Unified Identity: ${Object.keys(UNIFIED_IDENTITY_SHAPES).length}`);

export default SCIENTIFIC_IDENTITY_SHAPES;
