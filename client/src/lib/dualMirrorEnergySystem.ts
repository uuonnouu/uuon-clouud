import { SurfaceParameters } from '../types/math';

/**
 * DUAL MIRROR ENERGY SYSTEM
 * 
 * A hybrid visualization combining:
 * 1. DNA Helix (Cyan/Blue) - The organic, flowing spiral structure
 * 2. Lattice Mesh (Magenta/Purple) - The crystalline cubic grid structure
 * 
 * Four Properties Working Together:
 * 1. FREQUENCY - Controls oscillation rate and system speed (param A)
 * 2. ENERGY - Power level flowing through the system (param B)
 * 3. WAVES - Wave amplitude that modulates the structure (param C)
 * 4. RESONANCE - Harmonic synchronization between systems (param D)
 * 
 * Features:
 * - Energy particles flowing through tubular vortex
 * - Topological field lines creating spiral pathways
 * - DNA helix responding to wave patterns and frequency
 * - Lattice resonating with energy levels
 * - Dense energy mesh interconnecting both systems
 * 
 * Algorithms utilized:
 * - Fractal energy dispersion (Perlin-like noise)
 * - Four-corner harmonic foundation (tetrahedral symmetry)
 * - Wave-lattice coupling equations
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1.5, e: 0.6, f: 0.8, g: 1.2,
    h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 128, vSegments: 64,
    ...overrides
  };
}

const PHI = (1 + Math.sqrt(5)) / 2;

function fractalNoise(x: number, y: number, z: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * Math.sin(x * frequency) * Math.cos(y * frequency) * Math.sin(z * frequency + x * 0.5);
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

function tetrahedralHarmonic(x: number, y: number, z: number, resonance: number): number {
  const corners = [
    [1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]
  ];
  
  let energy = 0;
  for (const [cx, cy, cz] of corners) {
    const dist = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy) + (z - cz) * (z - cz));
    energy += Math.exp(-dist * resonance) * Math.cos(dist * PHI);
  }
  
  return energy / 4;
}

export const DUAL_MIRROR_ENERGY_SYSTEM: Record<string, ParametricSurface> = {

  // ============================================================================
  // ULTIMATE UNIFIED DNA-LATTICE SYSTEM (Flagship Model)
  // ============================================================================

  unified_dna_lattice_matrix: {
    name: "Unified DNA-Lattice Matrix - Ultimate Energy System",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const theta = u * Math.PI * 6;
      const t = v;
      const height = 8;
      
      const helixRadius = 1.8 + waves * Math.sin(theta * frequency) * 0.4;
      const helixX = Math.cos(theta) * helixRadius;
      const helixZ = Math.sin(theta) * helixRadius;
      const helixY = (t - 0.5) * height;
      
      const latticeFreq = resonance * 3;
      const latticeX = Math.sin(helixX * latticeFreq) * 0.25 * energy;
      const latticeZ = Math.cos(helixZ * latticeFreq) * 0.25 * energy;
      const latticeY = Math.sin((helixX + helixZ) * latticeFreq * 0.5) * 0.15 * energy;
      
      const fieldStrength = tetrahedralHarmonic(helixX * 0.3, helixY * 0.1, helixZ * 0.3, resonance);
      const fieldMod = fieldStrength * waves * 0.2;
      
      const energyFlow = Math.sin(theta * frequency * 2 + t * Math.PI * 4) * 0.12;
      const noiseLayer = fractalNoise(helixX * 0.5, helixY * 0.2, helixZ * 0.5, 3) * waves * 0.08;
      
      const x = helixX + latticeX + fieldMod + energyFlow + noiseLayer;
      const y = helixY + latticeY;
      const z = helixZ + latticeZ + fieldMod + energyFlow + noiseLayer;
      
      return [x * 0.35, y * 0.18, z * 0.35];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 64 })
  },

  dna_lattice_crystalline_helix: {
    name: "DNA-Lattice Crystalline Helix - Hybrid Structure",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const strand = Math.floor(v * 3);
      const localV = (v * 3) % 1;
      
      const theta = u * Math.PI * 5 + strand * Math.PI * 2 / 3;
      const heightRange = 10;
      const baseY = (u - 0.5) * heightRange;
      
      const helixRadius = 2.0 + Math.sin(u * Math.PI * frequency * 4) * waves * 0.3;
      
      const crystalOffset = Math.sin(theta * resonance * 2) * 0.3 * energy;
      const crystalLayer = Math.cos(localV * Math.PI * 2) * 0.2 * energy;
      
      const radius = helixRadius + crystalOffset + crystalLayer;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = baseY + Math.sin(theta * frequency) * 0.2;
      
      const pulse = Math.sin(u * Math.PI * frequency * 8) * waves * 0.1;
      
      return [(x + pulse) * 0.28, y * 0.15, (z + pulse) * 0.28];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 30 })
  },

  energy_field_superposition: {
    name: "Energy Field Superposition - DNA + Lattice Waves",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      const dnaWave = Math.sin(x * frequency * 1.5) * Math.exp(-y * y * 0.1) * waves;
      const latticeWave = Math.sin(x * resonance * 2) * Math.sin(y * resonance * 2) * energy;
      const harmonicWave = Math.sin((x + y) * PHI) * Math.sin((x - y) * PHI) * 0.3;
      
      const interference = dnaWave + latticeWave * 0.7 + harmonicWave;
      const fractalLayer = fractalNoise(x * 0.5, y * 0.5, interference * 0.3, 3) * waves * 0.2;
      
      const z = interference + fractalLayer;
      
      return [x * 0.18, z * 0.35, y * 0.18];
    },
    defaultParams: getCleanDefaults({ uSegments: 120, vSegments: 120 })
  },

  toroidal_dna_lattice: {
    name: "Toroidal DNA-Lattice Ring - Circular Fusion",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const majorRadius = 2.5;
      const minorRadius = 0.8;
      
      const dnaModulation = Math.sin(theta * frequency * 8) * 0.15 * waves;
      const latticeModulation = Math.sin(phi * resonance * 4) * Math.sin(theta * resonance * 4) * 0.1 * energy;
      
      const r = minorRadius + dnaModulation + latticeModulation;
      
      const x = (majorRadius + r * Math.cos(phi)) * Math.cos(theta);
      const y = r * Math.sin(phi);
      const z = (majorRadius + r * Math.cos(phi)) * Math.sin(theta);
      
      const pulse = Math.sin(theta * frequency * 4 + phi * 2) * 0.05;
      
      return [(x + pulse) * 0.22, y * 0.22, (z + pulse) * 0.22];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 50 })
  },

  vortex_lattice_fusion: {
    name: "Vortex-Lattice Fusion - Spiral Grid Energy",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const theta = u * Math.PI * 8;
      const t = v;
      
      const spiralRadius = 0.3 + t * 2.5;
      const vortexX = Math.cos(theta) * spiralRadius;
      const vortexZ = Math.sin(theta) * spiralRadius;
      const vortexY = (t - 0.5) * 6 + Math.sin(theta * frequency * 0.5) * 0.3;
      
      const latticeX = Math.floor(vortexX * resonance * 2) / (resonance * 2);
      const latticeZ = Math.floor(vortexZ * resonance * 2) / (resonance * 2);
      const latticeBlend = 0.3 * energy;
      
      const x = vortexX * (1 - latticeBlend) + latticeX * latticeBlend;
      const z = vortexZ * (1 - latticeBlend) + latticeZ * latticeBlend;
      const y = vortexY + Math.sin(theta * frequency * 2) * waves * 0.15;
      
      return [x * 0.28, y * 0.18, z * 0.28];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 48 })
  },

  quantum_dna_lattice: {
    name: "Quantum DNA-Lattice - Probabilistic Structure",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const theta = u * Math.PI * 4;
      const psi = v * Math.PI;
      
      const probability = Math.pow(Math.sin(psi), 2);
      const quantumPhase = Math.cos(theta * frequency * 2) * probability;
      
      const helixR = 1.5 + waves * 0.4 * Math.sin(theta * 2);
      const latticeR = 0.5 * energy * (1 + Math.sin(theta * resonance * 3));
      
      const blendFactor = 0.5 + 0.5 * Math.sin(psi);
      const finalR = helixR * blendFactor + latticeR * (1 - blendFactor);
      
      const x = Math.cos(theta) * finalR * (1 + quantumPhase * 0.2);
      const y = (v - 0.5) * 8 + Math.sin(theta * frequency) * 0.3;
      const z = Math.sin(theta) * finalR * (1 + quantumPhase * 0.2);
      
      return [x * 0.32, y * 0.15, z * 0.32];
    },
    defaultParams: getCleanDefaults({ uSegments: 150, vSegments: 60 })
  },

  // ============================================================================
  // CORE DUAL MIRROR SYSTEM
  // ============================================================================

  dual_mirror_complete: {
    name: "Dual Mirror Energy System - Complete",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      const resonance = params.g ?? 1.2;
      
      const theta = u * Math.PI * 4;
      const t = v;
      const height = 5;
      
      const helixRadius = 1.5 + waves * Math.sin(theta * frequency) * 0.3;
      const helixX = Math.cos(theta) * helixRadius;
      const helixZ = Math.sin(theta) * helixRadius;
      const helixY = (t - 0.5) * height;
      
      const latticeModX = Math.sin(helixX * resonance) * 0.2 * energy;
      const latticeModZ = Math.cos(helixZ * resonance) * 0.2 * energy;
      
      const energyPulse = Math.sin(theta * frequency * 2 + t * Math.PI * 4) * waves * 0.15;
      
      const x = helixX + latticeModX + energyPulse;
      const y = helixY;
      const z = helixZ + latticeModZ + energyPulse;
      
      return [x * 0.5, y * 0.2, z * 0.5];
    },
    defaultParams: getCleanDefaults({ uSegments: 128, vSegments: 48 })
  },

  // ============================================================================
  // DNA HELIX COMPONENT (Cyan/Blue - Organic Spiral)
  // ============================================================================

  dna_helix_organic: {
    name: "DNA Helix - Organic Spiral Structure",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const waves = params.f ?? 0.8;
      
      const strand = Math.floor(v * 2);
      const t = (v % 0.5) * 2;
      
      const theta = u * Math.PI * 4 + strand * Math.PI;
      const radius = 1.5 + waves * Math.sin(u * Math.PI * 8 * frequency) * 0.2;
      
      const height = 10;
      const y = (u - 0.5) * height;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      
      const breathe = 1 + Math.sin(u * Math.PI * 2 * frequency) * waves * 0.1;
      
      return [x * breathe * 0.3, y * 0.15, z * breathe * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 150, vSegments: 8 })
  },

  dna_base_pairs: {
    name: "DNA Base Pairs - Connecting Rungs",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      
      const pairIndex = Math.floor(u * 20);
      const alongPair = v;
      
      const theta = pairIndex * Math.PI / 5;
      const y = (pairIndex / 20 - 0.5) * 10;
      
      const radius = 1.5 * (1 - alongPair * 0.1);
      const angle = theta + alongPair * Math.PI;
      
      const x = Math.cos(angle) * radius * alongPair;
      const z = Math.sin(angle) * radius * alongPair;
      
      const pulse = Math.sin(pairIndex * frequency + alongPair * Math.PI) * energy * 0.1;
      
      return [x * 0.3, y * 0.15 + pulse, z * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 20, vSegments: 10 })
  },

  // ============================================================================
  // LATTICE MESH COMPONENT (Magenta/Purple - Crystalline Grid)
  // ============================================================================

  cubic_lattice_crystal: {
    name: "Cubic Lattice - Crystalline Grid Structure",
    equation: (u, v, params) => {
      const resonance = params.g ?? 1.2;
      const energy = (params.e ?? 60) / 100;
      
      const gridSize = 8;
      const divisions = 7;
      const spacing = gridSize / divisions;
      const offset = gridSize / 2;
      
      const xi = Math.floor(u * divisions);
      const yi = Math.floor(v * divisions);
      const zi = Math.floor((u + v) * 0.5 * divisions) % divisions;
      
      const isEdge = xi === 0 || xi === divisions - 1 || 
                     yi === 0 || yi === divisions - 1;
      
      const px = xi * spacing - offset;
      const py = yi * spacing - offset;
      const pz = zi * spacing - offset;
      
      const vibration = Math.sin((xi + yi + zi) * resonance) * energy * 0.1;
      
      const x = px + vibration;
      const y = py + vibration * 0.5;
      const z = pz + vibration;
      
      return [x * 0.15, y * 0.15, z * 0.15];
    },
    defaultParams: getCleanDefaults({ uSegments: 49, vSegments: 49 })
  },

  lattice_energy_nodes: {
    name: "Lattice Energy Nodes - Charged Points",
    equation: (u, v, params) => {
      const energy = (params.e ?? 60) / 100;
      const resonance = params.g ?? 1.2;
      
      const nodeAngle = u * Math.PI * 2;
      const nodeHeight = (v - 0.5) * 8;
      
      const layers = 8;
      const nodesPerLayer = 8;
      
      const layer = Math.floor(v * layers);
      const nodeIdx = Math.floor(u * nodesPerLayer);
      
      const radius = 4 + Math.sin(layer * resonance) * energy;
      const angle = nodeIdx * Math.PI * 2 / nodesPerLayer + layer * 0.3;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (layer - layers / 2) * 1.2;
      
      const charge = Math.sin((layer + nodeIdx) * resonance) * 0.2;
      
      return [(x + charge) * 0.12, y * 0.15, (z + charge) * 0.12];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // ENERGY FLOW SYSTEMS
  // ============================================================================

  energy_vortex_tube: {
    name: "Energy Vortex Tube - Central Flow",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      
      const theta = v * Math.PI * 8;
      const t = u;
      
      const radius = 0.3 + energy * 0.2;
      const spiralTight = 4 + frequency * 2;
      
      const tubeRadius = radius * (1 + Math.sin(t * Math.PI * spiralTight) * 0.3);
      
      const x = Math.cos(theta) * tubeRadius;
      const z = Math.sin(theta) * tubeRadius;
      const y = (t - 0.5) * 10;
      
      const flow = Math.sin(theta * frequency + t * Math.PI * 4) * 0.1;
      
      return [x * 0.3 + flow, y * 0.15, z * 0.3 + flow];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 50 })
  },

  energy_particle_stream: {
    name: "Energy Particle Stream - Flowing Spheres",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      
      const particleIdx = Math.floor(u * 100);
      const particlePhase = v;
      
      const angle = particleIdx * PHI * Math.PI * 2;
      const height = (particleIdx / 100 - 0.5) * 10;
      
      const baseRadius = 0.5 + energy * 1.5;
      const radius = baseRadius + Math.sin(particleIdx * 0.1 + particlePhase * frequency * 4) * waves * 0.3;
      
      const x = Math.cos(angle + particlePhase * frequency) * radius;
      const z = Math.sin(angle + particlePhase * frequency) * radius;
      const y = height + Math.sin(particlePhase * Math.PI * 2) * 0.2;
      
      return [x * 0.3, y * 0.15, z * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 10 })
  },

  // ============================================================================
  // FIELD LINE SYSTEMS
  // ============================================================================

  topological_field_spiral: {
    name: "Topological Field Lines - Spiral Pathways",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const resonance = params.g ?? 1.2;
      
      const fieldLine = Math.floor(v * 12);
      const t = u;
      
      const baseAngle = fieldLine * Math.PI * 2 / 12;
      const theta = baseAngle + t * Math.PI * 4 * frequency;
      
      const radius = 0.5 + t * 3 + Math.sin(t * Math.PI * resonance * 2) * 0.5;
      const height = (t - 0.5) * 8;
      
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const y = height;
      
      return [x * 0.2, y * 0.15, z * 0.2];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 12 })
  },

  magnetic_field_lines: {
    name: "Magnetic Field Lines - Dipole Configuration",
    equation: (u, v, params) => {
      const energy = (params.e ?? 60) / 100;
      
      const lineIdx = Math.floor(v * 16);
      const t = u * 2 - 1;
      
      const startAngle = lineIdx * Math.PI * 2 / 16;
      const spread = Math.abs(t);
      
      const radius = 2 * spread * (1 + energy * 0.3);
      const height = Math.sign(t) * (1 - spread * spread) * 4;
      
      const x = Math.cos(startAngle) * radius;
      const z = Math.sin(startAngle) * radius;
      const y = height;
      
      return [x * 0.25, y * 0.2, z * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 50, vSegments: 16 })
  },

  // ============================================================================
  // HARMONICS & RESONANCE
  // ============================================================================

  four_corner_harmonic: {
    name: "Four-Corner Harmonic Foundation",
    equation: (u, v, params) => {
      const resonance = params.g ?? 1.2;
      const energy = (params.e ?? 60) / 100;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const z = tetrahedralHarmonic(x, y, 0, resonance) * energy;
      
      return [x * 0.25, z * 0.4, y * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  resonance_coupling_surface: {
    name: "Resonance Coupling - DNA-Lattice Interface",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const resonance = params.g ?? 1.2;
      const waves = params.f ?? 0.8;
      
      const theta = u * Math.PI * 4;
      const phi = v * Math.PI * 2;
      
      const helixComponent = Math.sin(theta * frequency) * 0.5;
      const latticeComponent = Math.cos(phi * resonance * 2) * 0.5;
      
      const radius = 2 + waves * (helixComponent + latticeComponent);
      
      const x = Math.cos(theta) * Math.sin(phi) * radius;
      const y = Math.cos(phi) * radius;
      const z = Math.sin(theta) * Math.sin(phi) * radius;
      
      return [x * 0.25, y * 0.25, z * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 40 })
  },

  standing_wave_pattern: {
    name: "Standing Wave Pattern - Harmonic Nodes",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const waves = params.f ?? 0.8;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      
      const wave1 = Math.sin(x * frequency * 2) * Math.sin(y * frequency * 2);
      const wave2 = Math.sin(x * frequency * 3) * Math.sin(y * frequency * 3);
      
      const z = (wave1 + wave2 * 0.5) * waves;
      
      return [x * 0.15, z * 0.3, y * 0.15];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // FRACTAL ENERGY DISPERSION
  // ============================================================================

  fractal_energy_field: {
    name: "Fractal Energy Field - Multi-Scale Dispersion",
    equation: (u, v, params) => {
      const energy = (params.e ?? 60) / 100;
      const waves = params.f ?? 0.8;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const noise = fractalNoise(x * 2, y * 2, 0, 4);
      const z = noise * energy * waves;
      
      return [x * 0.25, z * 0.4, y * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 100 })
  },

  energy_cascade_surface: {
    name: "Energy Cascade - Downward Flow",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      
      const level = Math.floor(u * 5);
      const t = (u * 5) % 1;
      const angle = v * Math.PI * 2;
      
      const baseRadius = 0.5 + level * 0.4;
      const radius = baseRadius + Math.sin(t * Math.PI * 2 * frequency) * 0.2 * energy;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = -level * 0.8 + t * 0.8;
      
      return [x * 0.3, y * 0.2, z * 0.3];
    },
    defaultParams: getCleanDefaults({ uSegments: 50, vSegments: 32 })
  },

  // ============================================================================
  // ELECTRICAL ARC SYSTEMS
  // ============================================================================

  electrical_arc_discharge: {
    name: "Electrical Arc Discharge - Lightning Paths",
    equation: (u, v, params) => {
      const energy = (params.e ?? 60) / 100;
      const frequency = params.d ?? 1.5;
      
      const arcIdx = Math.floor(v * 20);
      const t = u;
      
      const startAngle = arcIdx * Math.PI * 2 / 20;
      const endAngle = startAngle + Math.PI * 0.3;
      
      const angle = startAngle + (endAngle - startAngle) * t;
      const radius = 3 + Math.sin(t * Math.PI) * 0.5;
      
      const jitter = Math.sin(t * frequency * 20 + arcIdx) * 0.2 * energy;
      
      const x = Math.cos(angle) * radius + jitter;
      const z = Math.sin(angle) * radius + jitter;
      const y = (Math.random() - 0.5) * 0.1 + Math.sin(t * Math.PI * 2) * 0.3;
      
      return [x * 0.2, y * 0.2, z * 0.2];
    },
    defaultParams: getCleanDefaults({ uSegments: 50, vSegments: 20 })
  },

  plasma_containment_field: {
    name: "Plasma Containment Field - Toroidal Trap",
    equation: (u, v, params) => {
      const energy = (params.e ?? 60) / 100;
      const frequency = params.d ?? 1.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const majorRadius = 2;
      const minorRadius = 0.6 + energy * 0.3;
      
      const wobble = Math.sin(theta * frequency * 5 + phi * 3) * 0.1 * energy;
      const r = minorRadius + wobble;
      
      const x = (majorRadius + r * Math.cos(phi)) * Math.cos(theta);
      const y = r * Math.sin(phi);
      const z = (majorRadius + r * Math.cos(phi)) * Math.sin(theta);
      
      return [x * 0.25, y * 0.25, z * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 80, vSegments: 40 })
  },

  // ============================================================================
  // DENSE ENERGY MESH
  // ============================================================================

  energy_web_interconnect: {
    name: "Energy Web - Dense Interconnection Mesh",
    equation: (u, v, params) => {
      const resonance = params.g ?? 1.2;
      const waves = params.f ?? 0.8;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      const mesh = Math.sin(x * resonance * 3) * Math.sin(y * resonance * 3) +
                   Math.sin(x * resonance * 5) * Math.sin(y * resonance * 5) * 0.5;
      
      const z = mesh * waves * 0.3;
      
      return [x * 0.25, z * 0.4, y * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 100, vSegments: 100 })
  },

  neural_lattice_coupling: {
    name: "Neural-Lattice Coupling - Synaptic Bridge",
    equation: (u, v, params) => {
      const frequency = params.d ?? 1.5;
      const energy = (params.e ?? 60) / 100;
      const resonance = params.g ?? 1.2;
      
      const synapse = Math.floor(u * 50);
      const t = v;
      
      const sourceAngle = synapse * PHI * 0.5;
      const targetAngle = sourceAngle + Math.PI * resonance * 0.3;
      
      const sourceRadius = 1 + Math.sin(synapse * 0.2) * 0.3;
      const targetRadius = 2 + Math.sin(synapse * 0.3) * 0.5;
      
      const radius = sourceRadius + (targetRadius - sourceRadius) * t;
      const angle = sourceAngle + (targetAngle - sourceAngle) * t;
      
      const height = (synapse / 50 - 0.5) * 6;
      const pulse = Math.sin(t * Math.PI * frequency * 4) * energy * 0.1;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = height + pulse;
      
      return [x * 0.25, y * 0.15, z * 0.25];
    },
    defaultParams: getCleanDefaults({ uSegments: 50, vSegments: 20 })
  }
};

export default DUAL_MIRROR_ENERGY_SYSTEM;
