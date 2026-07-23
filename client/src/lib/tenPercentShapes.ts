/**
 * 10% SYSTEMS - VISIBLE/HIDDEN DYNAMICS
 * Universal pattern: Complex systems have ~10% visible and ~90% hidden layers
 * S = V + H where V ≈ 0.10 and H ≈ 0.90 of total system
 * © 2025 UUON Foundation Inc. / CargoEU
 */

import { SurfaceParameters } from '../types/math';

export interface TenPercentShape {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
  system: 'physical' | 'biological' | 'computational' | 'cognitive' | 'social' | 'quantum';
}

function getTenPercentDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 128, vSegments: 64,
    ...overrides
  };
}

export const TEN_PERCENT_SHAPES: Record<string, TenPercentShape> = {

  // ============================================================================
  // 1. ICEBERG SYSTEM - Buoyancy Equilibrium
  // V = ρ_air / ρ_ice, H = 1 - V
  // ============================================================================
  iceberg_system: {
    name: "🧊 Iceberg System: V = ρ_air/ρ_ice, H = 1-V",
    system: 'physical',
    description: "Archimedes principle - 10% visible, 90% submerged mass",
    equation: (u, v, params) => {
      const scale = params.d ?? 3.0;
      const visibleRatio = params.e ?? 0.1;
      const irregularity = params.f ?? 0.3;
      const waterlineShift = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const waterline = 0.5 + waterlineShift * 0.1;
      const isVisible = phi < waterline * Math.PI;
      
      const densityFactor = isVisible ? 1.0 : 0.92;
      const noise = irregularity * (
        Math.sin(5 * theta) * 0.1 + 
        Math.cos(3 * phi + 2 * theta) * 0.15 +
        Math.sin(7 * theta + phi) * 0.05
      );
      
      const baseRadius = scale * (1 + noise);
      const compressionBelow = isVisible ? 1.0 : (1.2 + 0.3 * (phi / Math.PI - waterline));
      
      const r = baseRadius * densityFactor * compressionBelow;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (isVisible ? visibleRatio * 3 : 1.0);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 0.3,uSegments: 96, vSegments: 64 })
  },

  // ============================================================================
  // 2. DNA EXPRESSION SYSTEM
  // E = f(TF, epigenetic_marks), R = 1 - E
  // ============================================================================
  dna_expression_system: {
    name: "🧬 DNA Expression: E = f(TF, epigenetics), R = 1-E",
    system: 'biological',
    description: "Gene expression - 10% expressed, 90% regulatory/silent",
    equation: (u, v, params) => {
      const helixRadius = params.d ?? 2.0;
      const helixPitch = params.e ?? 1.5;
      const expressionRate = params.f ?? 0.1;
      const epigeneticPhase = params.g ?? 0;
      
      const t = u * 4 * Math.PI;
      const s = v * 2 * Math.PI;
      
      const isExpressed = (Math.sin(t * 0.5 + epigeneticPhase) + 1) / 2 < expressionRate;
      const expressionGlow = isExpressed ? 1.3 : 0.8;
      
      const baseX = helixRadius * Math.cos(t);
      const baseY = helixRadius * Math.sin(t);
      const baseZ = helixPitch * t / (2 * Math.PI);
      
      const groove = 0.3 * Math.cos(s);
      const bulgeFactor = isExpressed ? 0.4 : 0.2;
      
      const x = (baseX + groove * Math.cos(t)) * expressionGlow;
      const y = (baseY + groove * Math.sin(t)) * expressionGlow;
      const z = baseZ + bulgeFactor * Math.sin(s * 2);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 2.0, e: 1.5, f: 0.1,uMax: 4 * Math.PI, vMax: 2 * Math.PI, uSegments: 128, vSegments: 48 })
  },

  // ============================================================================
  // 3. ELECTROMAGNETIC SPECTRUM SYSTEM
  // V = λ ∈ [380nm, 740nm], T = λ ∈ [10^-12m, 10^4m]
  // ============================================================================
  em_spectrum_system: {
    name: "📡 EM Spectrum: V = [380-740nm] / T = [10⁻¹²-10⁴m]",
    system: 'physical',
    description: "Visible light is 0.0035% of full EM spectrum",
    equation: (u, v, params) => {
      const radius = params.d ?? 3.0;
      const visibleBand = params.e ?? 0.1;
      const waveAmplitude = params.f ?? 0.5;
      const frequency = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const spectrumPos = v;
      
      const visibleCenter = 0.5;
      const distFromVisible = Math.abs(spectrumPos - visibleCenter);
      const isVisible = distFromVisible < visibleBand / 2;
      
      const wavelengthFactor = Math.pow(spectrumPos + 0.1, 0.5);
      const wavePhase = theta * (1 + frequency * 0.1);
      
      const radialMod = isVisible ? 1.2 : 0.8;
      const r = radius * radialMod * (1 + waveAmplitude * 0.1 * Math.sin(wavePhase * 5));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = radius * (spectrumPos - 0.5) * 2 + waveAmplitude * Math.sin(wavePhase) * wavelengthFactor;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 0.5,vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  // ============================================================================
  // 4. UNIVERSE DISTRIBUTION SYSTEM
  // Ω_total = Ω_baryonic(5%) + Ω_dark_matter(27%) + Ω_dark_energy(68%)
  // ============================================================================
  universe_distribution_system: {
    name: "🌌 Universe: Ω_baryon(5%) + Ω_DM(27%) + Ω_DE(68%)",
    system: 'physical',
    description: "Cosmic matter-energy: 5% visible, 95% dark matter/energy",
    equation: (u, v, params) => {
      const scale = params.d ?? 4.0;
      const baryonicFraction = params.e ?? 0.05;
      const darkMatterFraction = params.f ?? 0.27;
      const expansion = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const darkEnergyFraction = 1 - baryonicFraction - darkMatterFraction;
      
      const baryonicLayer = scale * baryonicFraction * 3;
      const dmLayer = scale * darkMatterFraction;
      const deLayer = scale * darkEnergyFraction * 0.3;
      
      const cosmicWeb = 0.2 * Math.sin(5 * theta) * Math.cos(3 * phi);
      const voidStructure = 0.15 * Math.sin(7 * theta + 2 * phi);
      
      const baseR = baryonicLayer + dmLayer * (0.5 + 0.5 * Math.cos(phi)) + deLayer;
      const r = baseR * (1 + cosmicWeb + voidStructure + expansion * 0.1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = scale * Math.cos(phi) * (1 + darkEnergyFraction * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 4.0, e: 0.05, f: 0.27,uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 5. OCEAN EXPLORATION SYSTEM
  // E = A_explored / A_total ≈ 5%, U = 1 - E ≈ 95%
  // ============================================================================
  ocean_exploration_system: {
    name: "🌊 Ocean Exploration: E = A_explored/A_total ≈ 5%",
    system: 'physical',
    description: "Ocean mapping - 5-10% explored, 90-95% unmapped depths",
    equation: (u, v, params) => {
      const oceanRadius = params.d ?? 4.0;
      const exploredFraction = params.e ?? 0.05;
      const depthVariation = params.f ?? 1.5;
      const currentPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const depth = v;
      
      const isExplored = depth < exploredFraction * 3;
      
      const surfaceWaves = 0.2 * Math.sin(5 * theta + currentPhase) * (1 - depth);
      const abyssalPlains = depthVariation * 0.3 * Math.sin(3 * theta) * depth;
      const trenchFormation = 0.4 * Math.pow(Math.sin(theta * 2), 4) * depth;
      
      const explorationGlow = isExplored ? 1.1 : 0.85;
      
      const r = oceanRadius * explorationGlow * (1 + surfaceWaves - trenchFormation);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -oceanRadius * depth * (1 + abyssalPlains);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 4.0, e: 0.05, f: 1.5,vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  // ============================================================================
  // 6. NEURAL NETWORK LAYERS SYSTEM
  // y = f(Wₙf(Wₙ₋₁...f(W₁x))), O₀ = 10%, H = 90%
  // ============================================================================
  neural_network_layers_system: {
    name: "🧠 Neural Network: Output(10%) vs Hidden(90%)",
    system: 'computational',
    description: "ML forward propagation - output layer vs hidden computation",
    equation: (u, v, params) => {
      const networkSize = params.d ?? 3.0;
      const layerCount = Math.floor(params.e ?? 5);
      const activationStrength = params.f ?? 1.0;
      const weightPhase = params.g ?? 0;
      
      const neuronPos = u * 2 * Math.PI;
      const layerDepth = v;
      
      const isOutputLayer = layerDepth > 0.9;
      
      const layer = Math.floor(layerDepth * layerCount);
      const neuronsInLayer = 8 + layer * 4;
      
      const activation = activationStrength * (1 / (1 + Math.exp(-3 * (layerDepth - 0.5))));
      
      const weight = Math.sin(neuronPos * neuronsInLayer + layer + weightPhase);
      const connectionDensity = 0.3 * Math.cos(neuronPos * 3 + layerDepth * 5);
      
      const outputScale = isOutputLayer ? 1.5 : 0.8 + 0.4 * layerDepth;
      
      const r = networkSize * outputScale * (1 + connectionDensity * 0.2);
      
      const x = r * Math.cos(neuronPos) * (1 + weight * 0.15);
      const y = r * Math.sin(neuronPos) * (1 + weight * 0.15);
      const z = networkSize * (layerDepth - 0.5) * 2 * activation;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 5, f: 1.0,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 7. TREE ROOT-CROWN SYSTEM
  // C = f(light, CO2) ≈ 10%, R = f(water, nutrients) ≈ 90%
  // ============================================================================
  tree_root_crown_system: {
    name: "🌳 Tree Root-Crown: Canopy(10%) vs Roots(90%)",
    system: 'biological',
    description: "Tree growth partitioning - visible canopy vs root network",
    equation: (u, v, params) => {
      const treeScale = params.d ?? 3.0;
      const crownRatio = params.e ?? 0.3;
      const rootDensity = params.f ?? 1.5;
      const windPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const verticalPos = v * 2 - 1;
      
      const isCanopy = verticalPos > 0;
      
      let r: number, z: number;
      
      if (isCanopy) {
        const canopyHeight = verticalPos / crownRatio;
        const leafDensity = Math.exp(-canopyHeight * 0.5);
        const windSway = 0.1 * Math.sin(theta * 2 + windPhase) * canopyHeight;
        r = treeScale * (0.5 + 0.8 * Math.sin(Math.PI * verticalPos / crownRatio)) * leafDensity;
        r += windSway;
        z = treeScale * verticalPos * 1.5;
      } else {
        const rootDepth = -verticalPos;
        const taproot = Math.exp(-Math.abs(Math.sin(theta * 4)) * 2);
        const lateralRoots = rootDensity * 0.3 * Math.sin(theta * 8 + rootDepth * 5);
        const mycorrhizae = 0.15 * Math.cos(theta * 12) * rootDepth;
        r = treeScale * (0.1 + rootDepth * 0.8 + lateralRoots + mycorrhizae) * (1 + taproot * 0.3);
        z = -treeScale * rootDepth * rootDensity;
      }
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.3, f: 1.5,vMin: 0, vMax: 1, uSegments: 96, vSegments: 64 })
  },

  // ============================================================================
  // 8. QUANTUM SUPERPOSITION SYSTEM
  // |ψ_obs⟩ = projection(ψ, basis), |ψ_hidden⟩ = ψ - ψ_obs
  // ============================================================================
  quantum_superposition_system: {
    name: "⚛️ Quantum Superposition: |ψ_obs⟩(10%) vs |ψ_hidden⟩(90%)",
    system: 'quantum',
    description: "Collapsed observable state vs uncollapsed superposition",
    equation: (u, v, params) => {
      const stateAmplitude = params.d ?? 3.0;
      const collapseProb = params.e ?? 0.1;
      const coherenceLength = params.f ?? 2.0;
      const measurementPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const probabilityDensity = Math.pow(Math.cos(phi / 2), 2);
      const isCollapsed = probabilityDensity > (1 - collapseProb);
      
      const psi_real = Math.cos(theta + measurementPhase) * Math.sin(phi);
      const psi_imag = Math.sin(theta + measurementPhase) * Math.sin(phi);
      const superposition = Math.sqrt(psi_real * psi_real + psi_imag * psi_imag);
      
      const interference = 0.2 * Math.cos(coherenceLength * theta) * Math.sin(coherenceLength * phi);
      
      const collapseFactor = isCollapsed ? 1.4 : 0.8;
      const r = stateAmplitude * collapseFactor * (superposition + interference);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = stateAmplitude * Math.cos(phi) * (1 + (isCollapsed ? 0.3 : -0.1));
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 2.0,uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 9. COMPUTER MEMORY PROCESSES SYSTEM
  // U = visible_processes ≈ 10%, S = kernel + scheduler + I/O ≈ 90%
  // ============================================================================
  computer_processes_system: {
    name: "💻 Computer Processes: User(10%) vs Kernel(90%)",
    system: 'computational',
    description: "Visible apps vs background OS operations",
    equation: (u, v, params) => {
      const systemScale = params.d ?? 3.0;
      const userProcessRatio = params.e ?? 0.1;
      const schedulerCycles = params.f ?? 4;
      const ioPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const memoryLevel = v;
      
      const isUserSpace = memoryLevel > (1 - userProcessRatio);
      
      const schedulerWave = Math.sin(schedulerCycles * theta + ioPhase);
      const ioActivity = 0.2 * Math.cos(8 * theta) * (1 - memoryLevel);
      const memoryManager = 0.15 * Math.sin(5 * theta + memoryLevel * 3);
      
      const kernelDensity = isUserSpace ? 0.3 : 1.0;
      
      const r = systemScale * (0.5 + memoryLevel * 0.5) * kernelDensity;
      const rMod = r * (1 + schedulerWave * 0.1 + ioActivity + memoryManager);
      
      const x = rMod * Math.cos(theta);
      const y = rMod * Math.sin(theta);
      const z = systemScale * (memoryLevel - 0.5) * 2 * (isUserSpace ? 1.2 : 0.9);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 4,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 10. THOUGHT-TO-SPEECH SYSTEM
  // S = f(filter(thoughts)) ≈ 10%, C = total_thoughts ≈ 90%
  // ============================================================================
  thought_speech_system: {
    name: "💭 Thought-to-Speech: Spoken(10%) vs Internal(90%)",
    system: 'cognitive',
    description: "Expressed speech vs internal cognition",
    equation: (u, v, params) => {
      const mindScale = params.d ?? 3.0;
      const speechRatio = params.e ?? 0.1;
      const thoughtComplexity = params.f ?? 3;
      const articulationPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const cognitiveDepth = v;
      
      const isSpoken = cognitiveDepth > (1 - speechRatio);
      
      const thoughtStreams = thoughtComplexity * Math.sin(5 * theta + cognitiveDepth * 4);
      const filterProcess = Math.sin(3 * theta + articulationPhase) * (1 - cognitiveDepth);
      const articulation = isSpoken ? 0.3 * Math.cos(theta * 7) : 0;
      
      const expressionFactor = isSpoken ? 1.5 : 0.7 + 0.3 * cognitiveDepth;
      
      const r = mindScale * expressionFactor * (1 + thoughtStreams * 0.1 + filterProcess * 0.1);
      
      const x = r * Math.cos(theta) * (1 + articulation);
      const y = r * Math.sin(theta) * (1 + articulation);
      const z = mindScale * (cognitiveDepth - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 3,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 11. GENETIC EVOLUTION SYSTEM
  // P = f(G, E, epistasis) ≈ 10%, G_total = full genome ≈ 90% unexpressed
  // ============================================================================
  genetic_evolution_system: {
    name: "🔬 Genetic Evolution: Phenotype(10%) vs Genotype(90%)",
    system: 'biological',
    description: "Expressed phenotype vs non-expressed genomic space",
    equation: (u, v, params) => {
      const genomeScale = params.d ?? 3.5;
      const phenotypeRatio = params.e ?? 0.1;
      const epistasis = params.f ?? 0.5;
      const developmentalNoise = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const genomicPos = v;
      
      const isPhenotype = Math.sin(genomicPos * 10 + theta * 0.5) > (1 - phenotypeRatio * 2);
      
      const geneInteraction = epistasis * 0.2 * Math.sin(7 * theta + genomicPos * 5);
      const envEffect = 0.15 * Math.cos(3 * theta + developmentalNoise);
      const mutationLandscape = 0.1 * Math.sin(11 * theta) * Math.cos(7 * genomicPos);
      
      const expressionBulge = isPhenotype ? 1.3 : 0.9;
      
      const r = genomeScale * expressionBulge * (1 + geneInteraction + mutationLandscape);
      
      const x = r * Math.cos(theta) * (1 + envEffect);
      const y = r * Math.sin(theta) * (1 + envEffect);
      const z = genomeScale * (genomicPos - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.5, e: 0.1, f: 0.5,vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // 12. CONSCIOUSNESS PROCESSING SYSTEM
  // C = working_memory ≈ 10%, S = subconscious_integration ≈ 90%
  // ============================================================================
  consciousness_processing_system: {
    name: "🧠 Consciousness: Working Memory(10%) vs Subconscious(90%)",
    system: 'cognitive',
    description: "Conscious processing vs background perceptual integration",
    equation: (u, v, params) => {
      const consciousnessScale = params.d ?? 3.0;
      const awarenessRatio = params.e ?? 0.1;
      const integrationDepth = params.f ?? 2.0;
      const attentionFocus = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const mentalDepth = v;
      
      const isConscious = mentalDepth > (1 - awarenessRatio);
      
      const attentionSpotlight = Math.exp(-Math.pow(theta - attentionFocus, 2) * 0.5);
      const subconscious = integrationDepth * 0.2 * Math.sin(6 * theta + mentalDepth * 4);
      const workingMemory = isConscious ? 0.3 * Math.cos(theta * 4) : 0;
      
      const awarenessFactor = isConscious ? 1.4 : 0.8;
      
      const r = consciousnessScale * awarenessFactor * (1 + subconscious + attentionSpotlight * 0.3);
      
      const x = r * Math.cos(theta) * (1 + workingMemory);
      const y = r * Math.sin(theta) * (1 + workingMemory);
      const z = consciousnessScale * (mentalDepth - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 2.0,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 13. ECONOMIC ACTIVITY SYSTEM
  // E_visible = reported ≈ 10-15%, E_hidden = informal + shadow ≈ 85-90%
  // ============================================================================
  economic_activity_system: {
    name: "💰 Economic Activity: Reported(15%) vs Shadow(85%)",
    system: 'social',
    description: "Visible economy vs unreported/informal transactions",
    equation: (u, v, params) => {
      const economyScale = params.d ?? 3.5;
      const formalRatio = params.e ?? 0.15;
      const marketVolatility = params.f ?? 0.3;
      const businessCycle = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const economicLayer = v;
      
      const isFormal = economicLayer > (1 - formalRatio);
      
      const marketCycles = marketVolatility * Math.sin(4 * theta + businessCycle);
      const informalFlow = 0.2 * Math.cos(7 * theta) * (1 - economicLayer);
      const shadowTransactions = 0.15 * Math.sin(11 * theta + economicLayer * 3);
      
      const visibilityFactor = isFormal ? 1.4 : 0.75;
      
      const r = economyScale * visibilityFactor * (1 + marketCycles + informalFlow);
      
      const x = r * Math.cos(theta) * (1 + shadowTransactions);
      const y = r * Math.sin(theta) * (1 + shadowTransactions);
      const z = economyScale * (economicLayer - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.5, e: 0.15, f: 0.3,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 14. SOCIAL DATA SYSTEM
  // B = expressed_actions ≈ 10%, H = internal_states ≈ 90%
  // ============================================================================
  social_data_system: {
    name: "👥 Social Data: Expressed(10%) vs Internal(90%)",
    system: 'social',
    description: "Visible behavior vs hidden internal states",
    equation: (u, v, params) => {
      const socialScale = params.d ?? 3.0;
      const expressionRatio = params.e ?? 0.1;
      const socialComplexity = params.f ?? 2.0;
      const interactionPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const socialDepth = v;
      
      const isExpressed = socialDepth > (1 - expressionRatio);
      
      const socialNetwork = socialComplexity * 0.15 * Math.sin(5 * theta + interactionPhase);
      const internalState = 0.2 * Math.cos(8 * theta + socialDepth * 3);
      const behaviorPattern = isExpressed ? 0.25 * Math.sin(theta * 6) : 0;
      
      const visibilityFactor = isExpressed ? 1.35 : 0.8;
      
      const r = socialScale * visibilityFactor * (1 + socialNetwork + internalState);
      
      const x = r * Math.cos(theta) * (1 + behaviorPattern);
      const y = r * Math.sin(theta) * (1 + behaviorPattern);
      const z = socialScale * (socialDepth - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 2.0,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 15. LANGUAGE COMMUNICATION SYSTEM
  // M_explicit = spoken_words ≈ 10%, M_implicit = tone + gesture ≈ 90%
  // ============================================================================
  language_communication_system: {
    name: "🗣️ Language: Explicit(10%) vs Implicit(90%)",
    system: 'cognitive',
    description: "Spoken words vs tone, gesture, timing, inference",
    equation: (u, v, params) => {
      const languageScale = params.d ?? 3.0;
      const explicitRatio = params.e ?? 0.1;
      const prosodyAmplitude = params.f ?? 0.5;
      const gesturePhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const messageDepth = v;
      
      const isExplicit = messageDepth > (1 - explicitRatio);
      
      const tonalContour = prosodyAmplitude * 0.2 * Math.sin(3 * theta + messageDepth * 2);
      const gestureLayer = 0.25 * Math.cos(5 * theta + gesturePhase);
      const timingRhythm = 0.15 * Math.sin(7 * theta) * (1 - messageDepth);
      const inferencePattern = 0.1 * Math.cos(11 * theta + messageDepth * 4);
      
      const clarityFactor = isExplicit ? 1.4 : 0.75;
      
      const r = languageScale * clarityFactor * (1 + tonalContour + gestureLayer * (1 - messageDepth));
      
      const x = r * Math.cos(theta) * (1 + timingRhythm);
      const y = r * Math.sin(theta) * (1 + inferencePattern);
      const z = languageScale * (messageDepth - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 0.5,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 16. INTERNET INFRASTRUCTURE SYSTEM
  // F = apps + UI ≈ 10%, H = protocols + routing + DNS ≈ 90%
  // ============================================================================
  internet_infrastructure_system: {
    name: "🌐 Internet: UI Layer(10%) vs Infrastructure(90%)",
    system: 'computational',
    description: "User-facing apps vs protocols, routing, DNS, packets",
    equation: (u, v, params) => {
      const networkScale = params.d ?? 3.5;
      const uiLayerRatio = params.e ?? 0.1;
      const packetDensity = params.f ?? 3;
      const routingPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const networkLayer = v;
      
      const isUI = networkLayer > (1 - uiLayerRatio);
      
      const packetFlow = packetDensity * 0.1 * Math.sin(8 * theta + routingPhase);
      const dnsResolution = 0.15 * Math.cos(5 * theta + networkLayer * 3);
      const tcpHandshake = 0.12 * Math.sin(12 * theta) * (1 - networkLayer);
      const routingTable = 0.1 * Math.cos(7 * theta + networkLayer * 5);
      
      const layerVisibility = isUI ? 1.4 : 0.7 + 0.3 * networkLayer;
      
      const r = networkScale * layerVisibility * (1 + packetFlow + dnsResolution);
      
      const x = r * Math.cos(theta) * (1 + tcpHandshake);
      const y = r * Math.sin(theta) * (1 + routingTable);
      const z = networkScale * (networkLayer - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.5, e: 0.1, f: 3,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // 17. HUMAN ENERGY USE SYSTEM
  // W = mechanical_output ≈ 5-10%, M = cellular_metabolism ≈ 90-95%
  // ============================================================================
  human_energy_system: {
    name: "⚡ Human Energy: Mechanical(10%) vs Metabolic(90%)",
    system: 'biological',
    description: "Physical movement vs cellular maintenance, repair, ion pumps",
    equation: (u, v, params) => {
      const energyScale = params.d ?? 3.0;
      const mechanicalRatio = params.e ?? 0.1;
      const metabolicRate = params.f ?? 1.5;
      const activityPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const energyLayer = v;
      
      const isMechanical = energyLayer > (1 - mechanicalRatio);
      
      const muscleContraction = isMechanical ? 0.3 * Math.sin(theta * 4 + activityPhase) : 0;
      const atpProduction = metabolicRate * 0.15 * Math.sin(6 * theta + energyLayer * 3);
      const ionPumps = 0.1 * Math.cos(10 * theta) * (1 - energyLayer);
      const heatDissipation = 0.12 * Math.sin(8 * theta + energyLayer * 2);
      
      const outputFactor = isMechanical ? 1.4 : 0.8;
      
      const r = energyScale * outputFactor * (1 + atpProduction + ionPumps);
      
      const x = r * Math.cos(theta) * (1 + muscleContraction);
      const y = r * Math.sin(theta) * (1 + heatDissipation);
      const z = energyScale * (energyLayer - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 3.0, e: 0.1, f: 1.5,vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 })
  },

  // ============================================================================
  // MASTER EQUATION: COMBINED 10% ALGORITHM
  // S_total = (S × α) + (S × (1-α)) where α ∈ [0.01, 0.10]
  // ============================================================================
  combined_ten_percent_master: {
    name: "🔮 Master 10% Algorithm: S = V(α) + H(1-α)",
    system: 'physical',
    description: "Universal visible/hidden dynamics - all observed reality is projection of deeper system",
    equation: (u, v, params) => {
      const systemScale = params.d ?? 4.0;
      const alpha = params.e ?? 0.1;
      const hiddenDominance = params.f ?? 0.9;
      const phaseShift = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const systemDepth = v;
      
      const visibleThreshold = 1 - alpha;
      const isVisible = systemDepth > visibleThreshold;
      
      const visibilityRatio = alpha;
      const hiddenRatio = 1 - alpha;
      
      const visibleContribution = isVisible ? 
        systemScale * (1 + 0.4 * Math.sin(5 * theta + phaseShift)) : 
        systemScale * 0.3;
      
      const hiddenContribution = hiddenDominance * (
        Math.sin(3 * theta + systemDepth * 4) * 0.2 +
        Math.cos(7 * theta + systemDepth * 2) * 0.15 +
        Math.sin(11 * theta) * 0.1
      );
      
      const activationLaw = systemScale * (
        isVisible ? visibilityRatio * 3 : hiddenRatio * 0.5
      );
      
      const r = (visibleContribution + hiddenContribution + activationLaw) * 0.5;
      
      const surfaceEfficiency = isVisible ? 1.3 : 0.85;
      const deepEfficiency = 1 + hiddenDominance * 0.2 * (1 - systemDepth);
      
      const x = r * surfaceEfficiency * Math.cos(theta);
      const y = r * deepEfficiency * Math.sin(theta);
      const z = systemScale * (systemDepth - 0.5) * 2 * (isVisible ? 1.2 : 0.9);
      
      return [x, y, z];
    },
    defaultParams: getTenPercentDefaults({ d: 4.0, e: 0.1, f: 0.9,vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  }
};

export const TEN_PERCENT_SHAPE_LIST = Object.keys(TEN_PERCENT_SHAPES);
