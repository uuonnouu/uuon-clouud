import type { SurfaceParameters } from './parametricSurfaces';

/**
 * EVOLUTIONARY STRING THEORY SHAPES
 * "A String Theory of Evolution" - Harmonic Theory of Evolution
 * 
 * Core Thesis: Evolution follows harmonic patterns like vibrating strings
 * Uses "second harmonics" (1/3 divisions) to predict evolutionary leaps
 * Predicts Ω Singularity around year 2217
 * 
 * Three Reality Realms:
 * 1. Non-dual absolute reality - Pure undifferentiated consciousness/energy
 * 2. Potential relative reality - Spectrum of energy-consciousness balances
 * 3. Spatiotemporal relative reality - Our manifested universe
 * 
 * Mathematical Framework:
 * - Planck scale vibrations (10^-35 m)
 * - 9-11 dimensional space (6-7 compactified)
 * - Harmonic frequency ratios
 * - Toroidal universe model
 */

export interface EvolutionaryStringShape {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  description?: string;
}

function getDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 48,
    ...overrides
  };
}

export const EVOLUTIONARY_STRING_THEORY_SHAPES: Record<string, EvolutionaryStringShape> = {

  evolutionary_harmonic_string: {
    name: "🎵 Evolutionary Harmonic String",
    description: "Evolution as vibrating string - different harmonics produce different evolutionary stages. Second harmonics (1/3 divisions) mark major evolutionary leaps like musical overtones creating species diversity.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const baseFreq = params.d ?? 1;
      const harmonic2 = params.e ?? 3;
      const harmonic3 = params.f ?? 5;
      const amplitude = params.g ?? 0.5;
      const phase = params.h ?? 0;
      
      const sigma = u * 2 * Math.PI;
      const tau = v * Math.PI;
      
      const fundamental = Math.sin(baseFreq * sigma + phase);
      const secondHarmonic = (amplitude / harmonic2) * Math.sin(harmonic2 * sigma + phase);
      const thirdHarmonic = (amplitude / harmonic3) * Math.sin(harmonic3 * sigma + phase);
      
      const evolutionaryWave = fundamental + secondHarmonic + thirdHarmonic;
      const radius = 2 + 0.5 * evolutionaryWave;
      
      const x = radius * Math.cos(sigma) * Math.sin(tau);
      const y = radius * Math.sin(sigma) * Math.sin(tau);
      const z = 2 * Math.cos(tau) + 0.3 * evolutionaryWave;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 1, e: 3, f: 5, g: 0.5 })
  },

  omega_singularity_attractor: {
    name: "Ω Omega Singularity Attractor",
    description: "The Ω Singularity (~2217): Point of infinite creativity where evolutionary acceleration converges. All harmonic series collapse into unified consciousness-energy state.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const convergenceRate = params.d ?? 2;
      const singularityStrength = params.e ?? 3;
      const spiralTurns = params.f ?? 5;
      const timeToSingularity = params.g ?? 0;
      
      const theta = u * 2 * Math.PI * spiralTurns;
      const phi = v * Math.PI;
      
      const t = 1 - v;
      const attractor = Math.exp(-convergenceRate * t * t);
      const spiral = 1 + (1 - attractor) * 2;
      
      const r = spiral * Math.sin(phi) * (1 + 0.2 * Math.sin(singularityStrength * theta));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = 3 * Math.cos(phi) * attractor + (1 - attractor) * v * 2;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 5 })
  },

  consciousness_energy_spectrum: {
    name: "💫 Consciousness-Energy Spectrum",
    description: "Potential relative reality: The spectrum between pure energy and pure consciousness. Evolution moves along this gradient, balancing matter and mind in harmonic ratios.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const energyBias = params.d ?? 1;
      const consciousnessBias = params.e ?? 1;
      const coupling = params.f ?? 2;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const energy = energyBias * (1 - t);
      const consciousness = consciousnessBias * t;
      const balance = energy * consciousness * coupling;
      
      const r = 2 + 0.5 * Math.sin(coupling * theta + phase) * balance;
      
      const x = r * Math.cos(theta) * (1 + 0.3 * energy);
      const y = r * Math.sin(theta) * (1 + 0.3 * consciousness);
      const z = (t - 0.5) * 4 + 0.2 * Math.sin(4 * theta) * balance;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 1, e: 1, f: 2 })
  },

  toroidal_universe_model: {
    name: "🍩 Toroidal Universe Model",
    description: "Doughnut-shaped universe topology where evolution spirals through cycles. Inner dimension represents consciousness depth, outer represents spatial expansion.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const majorRadius = params.d ?? 3;
      const minorRadius = params.e ?? 1;
      const twist = params.f ?? 0;
      const evolutionPhase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const twistedPhi = phi + twist * theta;
      
      const r = majorRadius + minorRadius * Math.cos(twistedPhi);
      const evolutionWarp = 1 + 0.1 * Math.sin(3 * theta + evolutionPhase);
      
      const x = r * Math.cos(theta) * evolutionWarp;
      const y = r * Math.sin(theta) * evolutionWarp;
      const z = minorRadius * Math.sin(twistedPhi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 1, f: 0 })
  },

  eleven_dimensional_compactification: {
    name: "🔮 11D Compactification Manifold",
    description: "String theory's 11 dimensions with 6-7 compactified. Extra dimensions exist as potential consciousness levels, each vibrating at different evolutionary frequencies.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const visibleScale = params.d ?? 3;
      const compactScale = params.e ?? 0.3;
      const dim5 = params.f ?? 1;
      const dim6 = params.g ?? 1;
      const dim7 = params.h ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const compact5 = compactScale * Math.sin(dim5 * theta * 2) * Math.cos(dim5 * phi * 3);
      const compact6 = compactScale * Math.cos(dim6 * theta * 3) * Math.sin(dim6 * phi * 2);
      const compact7 = compactScale * Math.sin(dim7 * (theta + phi) * 2);
      
      const r = visibleScale * (1 + 0.1 * (compact5 + compact6 + compact7));
      
      const x = r * Math.sin(phi) * Math.cos(theta) + compact5;
      const y = r * Math.sin(phi) * Math.sin(theta) + compact6;
      const z = r * Math.cos(phi) + compact7;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 0.3, f: 1, g: 1, h: 1 })
  },

  planck_scale_vibration: {
    name: "⚛️ Planck Scale Vibration (10⁻³⁵m)",
    description: "Fundamental vibration at Planck scale - the smallest possible vibration creating all matter. All particles are different notes from this universal string.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const planckAmplitude = params.d ?? 0.5;
      const frequency = params.e ?? 10;
      const mode = params.f ?? 3;
      const quantumFuzz = params.g ?? 0.1;
      
      const sigma = u * 2 * Math.PI;
      const tau = v * Math.PI;
      
      const vibration = planckAmplitude * Math.sin(frequency * sigma) * Math.cos(mode * tau);
      const quantum = quantumFuzz * (Math.sin(17 * sigma) * Math.cos(13 * tau));
      
      const r = 2 + vibration + quantum;
      
      const x = r * Math.sin(tau) * Math.cos(sigma);
      const y = r * Math.sin(tau) * Math.sin(sigma);
      const z = r * Math.cos(tau) + 0.2 * vibration;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 0.5, e: 10, f: 3, g: 0.1 })
  },

  phylogenetic_ontogenetic_harmony: {
    name: "🧬 Phylogeny-Ontogeny Harmonic",
    description: "Same harmonic pattern in species evolution (phylogeny) and individual development (ontogeny). Fractal self-similarity across biological scales.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const phyloScale = params.d ?? 3;
      const ontoScale = params.e ?? 1;
      const harmonicOrder = params.f ?? 3;
      const recursionDepth = params.g ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let phylo = 0;
      let onto = 0;
      for (let n = 1; n <= recursionDepth + 1; n++) {
        phylo += (1 / n) * Math.sin(n * harmonicOrder * theta);
        onto += (1 / n) * Math.cos(n * harmonicOrder * phi);
      }
      
      const r = phyloScale + ontoScale * phylo * onto;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.3 * (phylo + onto);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 1, f: 3, g: 2 })
  },

  three_realms_manifold: {
    name: "🌌 Three Realms Manifold",
    description: "Non-dual absolute (center), Potential relative (middle), Spatiotemporal (outer) - the three reality levels unified in one surface. Consciousness descends from unity to multiplicity.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const absoluteRadius = params.d ?? 0.5;
      const potentialRadius = params.e ?? 1.5;
      const spatiotemporalRadius = params.f ?? 3;
      const blending = params.g ?? 0.5;
      
      const theta = u * 2 * Math.PI;
      const level = v;
      
      let r: number;
      if (level < 0.33) {
        r = absoluteRadius + (potentialRadius - absoluteRadius) * (level / 0.33);
      } else if (level < 0.66) {
        r = potentialRadius + (spatiotemporalRadius - potentialRadius) * ((level - 0.33) / 0.33);
      } else {
        r = spatiotemporalRadius;
      }
      
      const ripple = blending * Math.sin(6 * theta) * Math.sin(3 * Math.PI * level);
      r += ripple * 0.2;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (level - 0.5) * 4 + ripple;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 0.5, e: 1.5, f: 3, g: 0.5 })
  },

  evolutionary_leap_surface: {
    name: "🚀 Evolutionary Leap Surface",
    description: "Second harmonics (1/3 divisions) mark evolutionary leaps. Surface shows punctuated equilibrium - long stable periods interrupted by rapid harmonic transitions.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const stabilityPeriod = params.d ?? 5;
      const leapMagnitude = params.e ?? 2;
      const leapFrequency = params.f ?? 3;
      const damping = params.g ?? 0.2;
      
      const theta = u * 2 * Math.PI;
      const time = v;
      
      const stability = Math.sin(stabilityPeriod * theta);
      const leaps = leapMagnitude * Math.pow(Math.sin(leapFrequency * Math.PI * time), 8);
      
      const r = 2 + 0.3 * stability + 0.5 * leaps;
      const z = time * 4 - 2 + damping * leaps * Math.sin(4 * theta);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 5, e: 2, f: 3, g: 0.2 })
  },

  universal_string_fundamental: {
    name: "🎻 Universal String Fundamental",
    description: "All particles as vibrations of single fundamental string. Different vibrational modes = different particles. Electron, quark, photon - all the same string, different music.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const tension = params.d ?? 2;
      const mode1 = params.e ?? 1;
      const mode2 = params.f ?? 2;
      const mode3 = params.g ?? 3;
      
      const sigma = u * 2 * Math.PI;
      const tau = v * Math.PI;
      
      const electron = 0.3 * Math.sin(mode1 * sigma) * Math.cos(mode1 * tau);
      const quark = 0.2 * Math.sin(mode2 * sigma) * Math.cos(mode2 * tau);
      const photon = 0.15 * Math.sin(mode3 * sigma) * Math.cos(mode3 * tau);
      
      const r = tension * (1 + electron + quark + photon);
      
      const x = r * Math.sin(tau) * Math.cos(sigma);
      const y = r * Math.sin(tau) * Math.sin(sigma);
      const z = tension * Math.cos(tau) + 0.3 * (electron - quark + photon);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 1, f: 2, g: 3 })
  },

  holographic_fractal_universe: {
    name: "🔬 Holographic Fractal Universe",
    description: "Information encoded on boundary contains entire volume. Each part contains the whole - fractal holographic principle where consciousness permeates all scales equally.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const boundaryScale = params.d ?? 3;
      const fractalDepth = params.e ?? 3;
      const holographicInfo = params.f ?? 2;
      const phase = params.g ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let fractal = 0;
      for (let n = 1; n <= fractalDepth; n++) {
        fractal += (1 / Math.pow(2, n)) * Math.sin(Math.pow(holographicInfo, n) * theta + phase);
      }
      
      const r = boundaryScale * (1 + 0.2 * fractal);
      const boundary = 0.1 * Math.sin(8 * theta) * Math.sin(4 * phi);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + boundary;
      const y = r * Math.sin(phi) * Math.sin(theta) + boundary;
      const z = r * Math.cos(phi) + 0.2 * fractal;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 3, f: 2 })
  },

  nondual_absolute_core: {
    name: "☯️ Non-Dual Absolute Core",
    description: "Pure undifferentiated consciousness/energy before manifestation. The singularity from which all reality emanates - beyond space, time, and duality.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const coreIntensity = params.d ?? 2;
      const emanationRate = params.e ?? 3;
      const unity = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const core = Math.exp(-emanationRate * phi);
      const radiance = coreIntensity * (1 - core) * unity;
      
      const r = 0.5 + radiance * Math.sin(phi);
      const spiral = 0.1 * (1 - core) * Math.sin(6 * theta);
      
      const x = r * Math.sin(phi) * Math.cos(theta) + spiral;
      const y = r * Math.sin(phi) * Math.sin(theta) + spiral;
      const z = coreIntensity * Math.cos(phi) * core + (1 - core) * (phi - Math.PI / 2);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 1 })
  },

  entropic_syntropic_balance: {
    name: "⚡ Entropic-Syntropic Balance",
    description: "Beyond Darwin Addendum 7: The dance between entropy (disorder) and syntropy (order creation). Evolution moves against entropy by creating increasingly complex structures through syntropic pull toward Omega.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const entropyStrength = params.d ?? 2;
      const syntropyStrength = params.e ?? 3;
      const balance = params.f ?? 0.5;
      const timeFlow = params.g ?? 1;
      
      const theta = u * 2 * Math.PI;
      const t = v;
      
      const entropy = entropyStrength * Math.exp(-t * 2) * Math.sin(5 * theta);
      const syntropy = syntropyStrength * (1 - Math.exp(-t * 3)) * Math.cos(3 * theta);
      
      const r = 2 + balance * (syntropy - entropy);
      const spiralUp = timeFlow * t * 4;
      
      const x = r * Math.cos(theta + spiralUp * 0.5);
      const y = r * Math.sin(theta + spiralUp * 0.5);
      const z = spiralUp - 2 + 0.3 * (syntropy + entropy);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 0.5, g: 1 })
  },

  chakra_harmonic_spectrum: {
    name: "🌈 Chakra Harmonic Spectrum",
    description: "Beyond Darwin chakra research: Seven energy centers as harmonic resonance points along the spine, each vibrating at increasing frequencies. Maps to evolutionary consciousness levels.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const spineLength = params.d ?? 4;
      const chakraIntensity = params.e ?? 1;
      const resonance = params.f ?? 7;
      
      const theta = u * 2 * Math.PI;
      const level = v;
      
      const chakraLevel = Math.floor(level * resonance);
      const chakraPhase = (level * resonance) % 1;
      const chakraRadius = chakraIntensity * (0.5 + 0.3 * Math.sin(chakraPhase * Math.PI));
      const harmonic = Math.pow(3, chakraLevel / 7);
      
      const r = chakraRadius * (1 + 0.2 * Math.sin(harmonic * theta));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (level - 0.5) * spineLength + 0.1 * Math.sin(7 * Math.PI * level);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 4, e: 1, f: 7 })
  },

  implicate_explicate_holomovement: {
    name: "🔄 Implicate-Explicate Holomovement",
    description: "David Bohm's holomovement visualized: Reality constantly unfolds from implicate (hidden) order to explicate (manifest) order and back. Toroidal flow between potential and actual.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const flowRate = params.d ?? 2;
      const implicitDepth = params.e ?? 1;
      const explicitExpansion = params.f ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const majorR = explicitExpansion * 2;
      const minorR = implicitDepth;
      
      const torusR = majorR + minorR * Math.cos(phi);
      const flowSpiral = flowRate * 0.1 * (theta + phi);
      
      const x = torusR * Math.cos(theta + flowSpiral);
      const y = torusR * Math.sin(theta + flowSpiral);
      const z = minorR * Math.sin(phi) + 0.2 * Math.sin(3 * theta) * Math.cos(2 * phi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 1, f: 2 })
  },

  spiral_of_fifths_evolution: {
    name: "🎼 Spiral of Fifths Evolution",
    description: "Pythagorean circle of fifths as evolutionary spiral. Musical harmonics map to evolutionary stages - each fifth (3:2 ratio) represents a harmonic leap in consciousness complexity.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const spiralExpansion = params.d ?? 0.3;
      const fifthRatio = params.e ?? 1.5;
      const turns = params.f ?? 12;
      
      const angle = u * 2 * Math.PI * turns;
      const height = v;
      
      const r = 1 + spiralExpansion * angle / (2 * Math.PI);
      const fifthModulation = 0.2 * Math.sin(angle * fifthRatio);
      
      const x = (r + fifthModulation) * Math.cos(angle);
      const y = (r + fifthModulation) * Math.sin(angle);
      const z = (height - 0.5) * 4 + 0.1 * Math.sin(12 * angle);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 0.3, e: 1.5, f: 12 })
  },

  quantum_leap_discontinuity: {
    name: "⚡ Quantum Leap Discontinuity",
    description: "Evolutionary quantum leaps - discontinuous jumps between stable states. Like electrons jumping orbitals, evolution makes sudden jumps between harmonic plateaus.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const plateauCount = params.d ?? 5;
      const jumpIntensity = params.e ?? 0.5;
      const quantization = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const level = v;
      
      const quantizedLevel = Math.floor(level * plateauCount) / plateauCount;
      const transitionPhase = (level * plateauCount) % 1;
      const jumpCurve = transitionPhase < 0.1 ? Math.pow(transitionPhase * 10, 2) * jumpIntensity : 
                        transitionPhase > 0.9 ? Math.pow((1 - transitionPhase) * 10, 2) * jumpIntensity : 0;
      
      const r = 2 + quantization * (quantizedLevel * 2 + jumpCurve);
      const ripple = 0.1 * Math.sin(8 * theta) * (1 - jumpCurve);
      
      const x = (r + ripple) * Math.cos(theta);
      const y = (r + ripple) * Math.sin(theta);
      const z = (quantizedLevel - 0.5) * 4 + jumpCurve;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 5, e: 0.5, f: 1 })
  },

  fractal_time_acceleration: {
    name: "⏰ Fractal Time Acceleration",
    description: "Beyond Darwin key insight: Each evolutionary stage takes 1/3 the time of the previous. Fractal time compression toward Omega Point where change becomes instantaneous.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const compressionRatio = params.d ?? 3;
      const stages = params.e ?? 8;
      const acceleration = params.f ?? 1;
      
      const theta = u * 2 * Math.PI;
      const progress = v;
      
      let cumulativeTime = 0;
      let stageSize = 1;
      for (let i = 0; i < stages; i++) {
        if (progress > cumulativeTime && progress <= cumulativeTime + stageSize / Math.pow(compressionRatio, stages)) {
          break;
        }
        cumulativeTime += stageSize / Math.pow(compressionRatio, i);
        stageSize /= compressionRatio;
      }
      
      const timeCompression = Math.pow(compressionRatio, progress * stages * acceleration);
      const r = 3 - progress * 2;
      const spiral = progress * 4 * Math.PI;
      
      const x = r * Math.cos(theta + spiral);
      const y = r * Math.sin(theta + spiral);
      const z = progress * 4 - 2 + 0.2 * Math.log(1 + timeCompression);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 8, f: 1 })
  },

  collective_memory_field: {
    name: "🧠 Collective Memory Field",
    description: "Morphic field of collective memory accumulating at fundamental level. Each evolutionary achievement is encoded in the field, making future evolution easier.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const fieldStrength = params.d ?? 3;
      const memoryLayers = params.e ?? 5;
      const accumulation = params.f ?? 2;
      
      const theta = u * 2 * Math.PI;
      const depth = v;
      
      let memoryDensity = 0;
      for (let layer = 1; layer <= memoryLayers; layer++) {
        memoryDensity += (1 / layer) * Math.sin(layer * theta + layer * Math.PI * depth);
      }
      memoryDensity *= (1 - Math.exp(-accumulation * depth));
      
      const r = fieldStrength * (1 + 0.2 * memoryDensity);
      
      const x = r * Math.sin(depth * Math.PI) * Math.cos(theta);
      const y = r * Math.sin(depth * Math.PI) * Math.sin(theta);
      const z = r * Math.cos(depth * Math.PI) + 0.3 * memoryDensity;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 5, f: 2 })
  }
};

export const EVOLUTIONARY_STRING_THEORY_SHAPE_COUNT = Object.keys(EVOLUTIONARY_STRING_THEORY_SHAPES).length;

console.log(`🎵 Evolutionary String Theory Shapes loaded: ${EVOLUTIONARY_STRING_THEORY_SHAPE_COUNT} shapes`);
console.log(`   🎻 Harmonic Evolution: String-like vibrational patterns in evolution`);
console.log(`   Ω Singularity: Convergence toward infinite creativity (~2217)`);
console.log(`   🌌 Three Realms: Non-dual, Potential, Spatiotemporal`);
console.log(`   🔮 11D Compactification: Extra dimensions as consciousness levels`);
console.log(`   🍩 Toroidal Universe: Doughnut-shaped cosmic topology`);
