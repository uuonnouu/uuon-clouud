import { SurfaceParameters } from '../types/math';

/**
 * NEURAL NETWORK + LATTICE ALGORITHMS LIBRARY
 * 
 * Comprehensive visualization of neural network dynamics,
 * lattice-form neural algorithms, core digital neural networks,
 * and biological neural processes.
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
    a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 96,
    ...overrides
  };
}

export const NEURAL_LATTICE_ALGORITHMS: Record<string, ParametricSurface> = {

  // ============================================================================
  // NEURAL NETWORK REPRESENTATION ALGORITHMS
  // ============================================================================

  node_activation_map: {
    name: "🧠 Node Activation Map - Neural Network",
    equation: (u, v, params) => {
      const layers = Math.floor(params.d ?? 5);
      const nodesPerLayer = Math.floor(params.e ?? 8);
      const activationStrength = params.f ?? 1;
      const connectionDensity = params.g ?? 0.5;
      
      const layerIndex = Math.floor(u * layers);
      const nodeIndex = Math.floor(v * nodesPerLayer);
      
      const x = (layerIndex - layers / 2) * 0.5;
      const y = (nodeIndex - nodesPerLayer / 2) * 0.3;
      
      const activation = Math.tanh(Math.sin(u * 10 + v * 5) * activationStrength);
      const z = activation * 0.5 + connectionDensity * Math.sin(u * v * 20) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 8, f: 1, uSegments: 64, vSegments: 64 })
  },

  weighted_edge_mapping: {
    name: "🔗 Weighted Edge Mapping - Synaptic Weights",
    equation: (u, v, params) => {
      const weightScale = params.d ?? 1;
      const edgeDensity = params.e ?? 4;
      const curvature = params.f ?? 0.5;
      
      const angle = u * Math.PI * 2;
      const radius = 0.3 + v * 0.7;
      
      const x = radius * Math.cos(angle * edgeDensity);
      const y = radius * Math.sin(angle * edgeDensity);
      
      const weight = weightScale * Math.sin(u * 8) * Math.cos(v * 6);
      const z = weight * curvature + Math.sin(angle * 3) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 4, f: 0.5, uSegments: 80, vSegments: 40 })
  },

  signal_propagation_surface: {
    name: "⚡ Signal Propagation - Neural Transmission",
    equation: (u, v, params) => {
      const speed = params.d ?? 2;
      const decay = params.e ?? 0.5;
      const amplitude = params.f ?? 1;
      const t = params.g ?? 0;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const r = Math.sqrt(x * x + y * y);
      const wave = amplitude * Math.exp(-decay * r) * Math.sin(speed * r - t * 2);
      
      return [x, y, wave];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 1, uSegments: 96, vSegments: 96 })
  },

  activation_function_landscape: {
    name: "📈 Activation Functions - ReLU/Sigmoid/Tanh",
    equation: (u, v, params) => {
      const funcType = Math.floor(params.d ?? 0) % 4;
      const scale = params.e ?? 1;
      
      const x = (u - 0.5) * 4 * scale;
      const y = (v - 0.5) * 4 * scale;
      const input = x + y * 0.5;
      
      let z: number;
      switch (funcType) {
        case 0: z = Math.max(0, input); break;
        case 1: z = 1 / (1 + Math.exp(-input)); break;
        case 2: z = Math.tanh(input); break;
        case 3: z = input > 0 ? input : 0.01 * input; break;
        default: z = Math.tanh(input);
      }
      
      return [x * 0.5, y * 0.5, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, uSegments: 64, vSegments: 64 })
  },

  gradient_flow_routing: {
    name: "🌊 Gradient Flow - Backpropagation Paths",
    equation: (u, v, params) => {
      const flowStrength = params.d ?? 1;
      const layerCount = Math.floor(params.e ?? 4);
      const gradientMagnitude = params.f ?? 0.5;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      let gradient = 0;
      for (let l = 1; l <= layerCount; l++) {
        gradient += Math.sin(l * x) * Math.cos(l * y) / l;
      }
      
      const z = flowStrength * gradient * gradientMagnitude;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 4, f: 0.5, uSegments: 80, vSegments: 80 })
  },

  attention_weight_surface: {
    name: "👁️ Attention Weights - Transformer Mechanism",
    equation: (u, v, params) => {
      const heads = Math.floor(params.d ?? 8);
      const queryScale = params.e ?? 1;
      const keyScale = params.f ?? 1;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let attention = 0;
      for (let h = 0; h < heads; h++) {
        const phase = (h / heads) * Math.PI * 2;
        const query = Math.sin(x * queryScale * 3 + phase);
        const key = Math.cos(y * keyScale * 3 + phase);
        attention += query * key / heads;
      }
      
      const softmax = Math.exp(attention) / (1 + Math.exp(attention));
      
      return [x, y, softmax * 0.8];
    },
    defaultParams: getCleanDefaults({ d: 8, e: 1, f: 1, uSegments: 64, vSegments: 64 })
  },

  gating_mechanism_surface: {
    name: "🚪 Gating Mechanism - LSTM/GRU Gates",
    equation: (u, v, params) => {
      const forgetGate = params.d ?? 0.5;
      const inputGate = params.e ?? 0.5;
      const outputGate = params.f ?? 0.5;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const sigmoid = (val: number) => 1 / (1 + Math.exp(-val));
      
      const f = sigmoid(x * 3) * forgetGate;
      const i = sigmoid(y * 3) * inputGate;
      const o = sigmoid((x + y) * 2) * outputGate;
      
      const cellState = f * Math.sin(x * 2) + i * Math.tanh(y * 2);
      const z = o * Math.tanh(cellState);
      
      return [x, y, z * 0.8];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 0.5, f: 0.5, uSegments: 64, vSegments: 64 })
  },

  // ============================================================================
  // LATTICE-FORM NEURAL ALGORITHMS
  // ============================================================================

  cubic_lattice_neural: {
    name: "🧊 Cubic Lattice - Neural Node Placement",
    equation: (u, v, params) => {
      const size = Math.floor(params.d ?? 5);
      const spacing = params.e ?? 0.4;
      const activation = params.f ?? 0.5;
      
      const i = Math.floor(u * size);
      const j = Math.floor(v * size);
      const k = Math.floor((u + v) * size / 2) % size;
      
      const x = (i - size / 2) * spacing;
      const y = (j - size / 2) * spacing;
      const z = (k - size / 2) * spacing * activation;
      
      return [x, y, z + activation * Math.sin(i + j) * 0.1];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 0.4, f: 0.5, uSegments: 32, vSegments: 32 })
  },

  hexagonal_lattice_neural: {
    name: "⬡ Hexagonal Lattice - Efficient Neural Packing",
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const layers = Math.floor(params.e ?? 4);
      const activation = params.f ?? 0.5;
      
      const angle = u * Math.PI * 2;
      const layerIndex = Math.floor(v * layers);
      const layerRadius = radius * (1 + layerIndex * 0.3);
      
      const hexOffset = (layerIndex % 2) * Math.PI / 6;
      const x = layerRadius * Math.cos(angle * 6 + hexOffset) / 6;
      const y = layerRadius * Math.sin(angle * 6 + hexOffset) / 6;
      const z = v * activation + Math.sin(angle * 3) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 4, f: 0.5, uSegments: 48, vSegments: 24 })
  },

  tetrahedral_lattice_connectivity: {
    name: "🔺 Tetrahedral Lattice - Neural Connectivity",
    equation: (u, v, params) => {
      const scale = params.d ?? 1;
      const connectivity = params.e ?? 0.8;
      
      const sqrt2 = Math.sqrt(2);
      const sqrt3 = Math.sqrt(3);
      
      const i = Math.floor(u * 4);
      const j = Math.floor(v * 4);
      
      const baseX = (i + (j % 2) * 0.5) * scale * 0.5;
      const baseY = j * sqrt3 / 2 * scale * 0.5;
      const baseZ = ((i + j) % 2) * sqrt2 / 2 * scale * 0.5;
      
      const activation = connectivity * Math.sin(u * 10 + v * 10);
      
      return [baseX - 1, baseY - 1, baseZ + activation * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.8, uSegments: 32, vSegments: 32 })
  },

  lattice_wave_propagation: {
    name: "🌊 Lattice Wave Propagation - Signal Diffusion",
    equation: (u, v, params) => {
      const waveSpeed = params.d ?? 2;
      const damping = params.e ?? 0.3;
      const t = params.g ?? 0;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      const r = Math.sqrt(x * x + y * y);
      
      const wave = Math.exp(-damping * r) * Math.sin(waveSpeed * r - t);
      const latticeEffect = Math.cos(x * 5) * Math.cos(y * 5) * 0.1;
      
      return [x, y, wave + latticeEffect];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.3, uSegments: 80, vSegments: 80 })
  },

  lattice_resonance_mapping: {
    name: "🔔 Lattice Resonance - Harmonic Mapping",
    equation: (u, v, params) => {
      const frequency = params.d ?? 3;
      const modes = Math.floor(params.e ?? 4);
      const amplitude = params.f ?? 0.5;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let resonance = 0;
      for (let m = 1; m <= modes; m++) {
        for (let n = 1; n <= modes; n++) {
          resonance += Math.sin(m * Math.PI * u) * Math.sin(n * Math.PI * v) / (m * n);
        }
      }
      
      return [x, y, resonance * amplitude * frequency / 10];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 4, f: 0.5, uSegments: 64, vSegments: 64 })
  },

  lattice_folding_surface: {
    name: "📐 Lattice Folding - Dimensional Reduction",
    equation: (u, v, params) => {
      const foldAngle = params.d ?? 0.5;
      const foldCount = Math.floor(params.e ?? 3);
      const depth = params.f ?? 0.5;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let z = 0;
      for (let i = 1; i <= foldCount; i++) {
        const foldLine = Math.sin(i * u * Math.PI);
        z += foldAngle * foldLine * depth / i;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 3, f: 0.5, uSegments: 64, vSegments: 64 })
  },

  fractal_lattice_growth: {
    name: "🌿 Fractal Lattice Growth - Self-Similar Neural",
    equation: (u, v, params) => {
      const iterations = Math.floor(params.d ?? 4);
      const scale = params.e ?? 2;
      const branching = params.f ?? 0.7;
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      for (let i = 0; i < iterations; i++) {
        const newX = Math.sin(y * scale) - branching * Math.cos(x * scale);
        const newY = Math.cos(x * scale) + branching * Math.sin(y * scale);
        z += Math.sin(x * y) / Math.pow(scale, i + 1);
        x = newX * 0.5;
        y = newY * 0.5;
      }
      
      return [x, y, z * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, f: 0.7, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // CORE DIGITAL NEURAL-NETWORK ALGORITHMS
  // ============================================================================

  forward_propagation_surface: {
    name: "➡️ Forward Propagation - Layer-by-Layer",
    equation: (u, v, params) => {
      const layers = Math.floor(params.d ?? 5);
      const neurons = Math.floor(params.e ?? 8);
      const bias = params.f ?? 0.1;
      
      const layerPos = u * layers;
      const neuronPos = v * neurons;
      
      const x = (layerPos - layers / 2) * 0.4;
      const y = (neuronPos - neurons / 2) * 0.25;
      
      let activation = Math.tanh(x + bias);
      for (let l = 0; l < Math.floor(layerPos); l++) {
        activation = Math.tanh(activation * 0.9 + bias);
      }
      
      return [x, y, activation * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 8, f: 0.1, uSegments: 48, vSegments: 48 })
  },

  backpropagation_gradient: {
    name: "⬅️ Backpropagation - Gradient Surface",
    equation: (u, v, params) => {
      const learningRate = params.d ?? 0.01;
      const errorScale = params.e ?? 1;
      const momentum = params.f ?? 0.9;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const error = Math.sin(x * 2) * Math.cos(y * 2) * errorScale;
      const gradient = -learningRate * error;
      const momentumTerm = momentum * Math.sin(x + y);
      
      return [x, y, (gradient + momentumTerm) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.01, e: 1, f: 0.9, uSegments: 64, vSegments: 64 })
  },

  loss_function_landscape: {
    name: "📉 Loss Function - Optimization Landscape",
    equation: (u, v, params) => {
      const lossType = Math.floor(params.d ?? 0) % 3;
      const scale = params.e ?? 1;
      const noise = params.f ?? 0.1;
      
      const x = (u - 0.5) * 4 * scale;
      const y = (v - 0.5) * 4 * scale;
      
      let loss: number;
      switch (lossType) {
        case 0:
          loss = x * x + y * y;
          break;
        case 1:
          loss = Math.sin(x) * Math.sin(y) + x * x / 10 + y * y / 10;
          break;
        case 2:
          loss = (1 - x) * (1 - x) + 100 * (y - x * x) * (y - x * x);
          loss = Math.log(1 + loss) * 0.1;
          break;
        default:
          loss = x * x + y * y;
      }
      
      loss += noise * Math.sin(x * 10) * Math.cos(y * 10);
      
      return [x * 0.5, y * 0.5, Math.min(loss, 2) * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 0, e: 1, f: 0.1, uSegments: 80, vSegments: 80 })
  },

  adam_optimizer_trajectory: {
    name: "🎯 Adam Optimizer - Adaptive Moment Path",
    equation: (u, v, params) => {
      const beta1 = params.d ?? 0.9;
      const beta2 = params.e ?? 0.999;
      const epsilon = params.f ?? 1e-8;
      
      const t = u * 100;
      const theta = v * Math.PI * 4;
      
      let m = 0, v_adam = 0;
      let x = Math.cos(theta);
      let y = Math.sin(theta);
      
      for (let i = 1; i <= Math.floor(t); i++) {
        const g = Math.sin(i * 0.1) * 0.1;
        m = beta1 * m + (1 - beta1) * g;
        v_adam = beta2 * v_adam + (1 - beta2) * g * g;
        const mHat = m / (1 - Math.pow(beta1, i));
        const vHat = v_adam / (1 - Math.pow(beta2, i));
        x -= 0.01 * mHat / (Math.sqrt(vHat) + epsilon);
        y -= 0.01 * mHat / (Math.sqrt(vHat) + epsilon);
      }
      
      return [x * 0.5, y * 0.5, (1 - u) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.9, e: 0.999, f: 1e-8, uSegments: 80, vSegments: 32 })
  },

  dropout_regularization: {
    name: "💧 Dropout - Regularization Pattern",
    equation: (u, v, params) => {
      const dropoutRate = params.d ?? 0.5;
      const gridSize = Math.floor(params.e ?? 10);
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const cellX = Math.floor(u * gridSize);
      const cellY = Math.floor(v * gridSize);
      const hash = Math.sin(cellX * 12.9898 + cellY * 78.233) * 43758.5453;
      const keep = (hash - Math.floor(hash)) > dropoutRate;
      
      const z = keep ? Math.sin(u * 10) * Math.cos(v * 10) * 0.3 : 0;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 10, uSegments: 64, vSegments: 64 })
  },

  batch_normalization_surface: {
    name: "📊 Batch Normalization - Standardization",
    equation: (u, v, params) => {
      const gamma = params.d ?? 1;
      const beta = params.e ?? 0;
      const epsilon = params.f ?? 1e-5;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const rawValue = Math.sin(x * 3) * Math.cos(y * 3);
      const mean = 0;
      const variance = 0.5;
      
      const normalized = (rawValue - mean) / Math.sqrt(variance + epsilon);
      const z = gamma * normalized + beta;
      
      return [x, y, z * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0, f: 1e-5, uSegments: 64, vSegments: 64 })
  },

  convolutional_kernel: {
    name: "🔲 Convolutional Kernel - Feature Extraction",
    equation: (u, v, params) => {
      const kernelSize = Math.floor(params.d ?? 3);
      const stride = Math.floor(params.e ?? 1);
      const padding = Math.floor(params.f ?? 0);
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let convOutput = 0;
      for (let ki = 0; ki < kernelSize; ki++) {
        for (let kj = 0; kj < kernelSize; kj++) {
          const weight = Math.sin((ki - 1) * Math.PI / 2) * Math.cos((kj - 1) * Math.PI / 2);
          const inputVal = Math.sin((u + ki * 0.1) * 10) * Math.cos((v + kj * 0.1) * 10);
          convOutput += weight * inputVal;
        }
      }
      
      return [x, y, convOutput / (kernelSize * kernelSize) * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0, uSegments: 64, vSegments: 64 })
  },

  transformer_multihead_attention: {
    name: "🔀 Transformer - Multi-Head Attention",
    equation: (u, v, params) => {
      const numHeads = Math.floor(params.d ?? 8);
      const dModel = Math.floor(params.e ?? 64);
      const seqLength = Math.floor(params.f ?? 16);
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let attention = 0;
      for (let h = 0; h < numHeads; h++) {
        const headOffset = h * Math.PI * 2 / numHeads;
        const Q = Math.sin(u * seqLength + headOffset);
        const K = Math.cos(v * seqLength + headOffset);
        const score = Q * K / Math.sqrt(dModel / numHeads);
        attention += Math.exp(score);
      }
      
      attention = attention / numHeads;
      const softmaxed = attention / (1 + attention);
      
      return [x, y, softmaxed * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 8, e: 64, f: 16, uSegments: 64, vSegments: 64 })
  },

  autoencoder_latent_space: {
    name: "🗜️ Autoencoder - Latent Space Manifold",
    equation: (u, v, params) => {
      const latentDim = Math.floor(params.d ?? 3);
      const compressionRatio = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = Math.sin(phi) * Math.cos(theta * latentDim) * compressionRatio;
      const y = Math.sin(phi) * Math.sin(theta * latentDim) * compressionRatio;
      const z = Math.cos(phi) * compressionRatio;
      
      const bottleneck = Math.tanh(x * x + y * y + z * z);
      
      return [x, y, z + bottleneck * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.5, uSegments: 64, vSegments: 32 })
  },

  hopfield_energy_landscape: {
    name: "🧲 Hopfield Network - Energy Landscape",
    equation: (u, v, params) => {
      const numPatterns = Math.floor(params.d ?? 3);
      const temperature = params.e ?? 0.5;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      
      let energy = 0;
      for (let p = 0; p < numPatterns; p++) {
        const patternX = Math.cos(p * Math.PI * 2 / numPatterns) * 1.5;
        const patternY = Math.sin(p * Math.PI * 2 / numPatterns) * 1.5;
        const dist = Math.sqrt((x - patternX) ** 2 + (y - patternY) ** 2);
        energy -= Math.exp(-dist * dist / temperature);
      }
      
      return [x * 0.4, y * 0.4, energy * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.5, uSegments: 80, vSegments: 80 })
  },

  // ============================================================================
  // BIOLOGICAL NEURAL ALGORITHMS
  // ============================================================================

  stdp_plasticity_surface: {
    name: "⚡ STDP - Spike-Timing Dependent Plasticity",
    equation: (u, v, params) => {
      const tauPlus = params.d ?? 20;
      const tauMinus = params.e ?? 20;
      const aPlus = params.f ?? 1;
      const aMinus = 0.8;
      
      const deltaT = (u - 0.5) * 100;
      const x = deltaT * 0.02;
      const y = (v - 0.5) * 2;
      
      let deltaW: number;
      if (deltaT > 0) {
        deltaW = aPlus * Math.exp(-deltaT / tauPlus);
      } else {
        deltaW = -aMinus * Math.exp(deltaT / tauMinus);
      }
      
      return [x, y, deltaW * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 20, e: 20, f: 1, uSegments: 80, vSegments: 40 })
  },

  hebbian_learning_surface: {
    name: "🔗 Hebbian Learning - Fire Together Wire Together",
    equation: (u, v, params) => {
      const learningRate = params.d ?? 0.1;
      const decay = params.e ?? 0.01;
      
      const preActivity = Math.sin(u * Math.PI * 4);
      const postActivity = Math.sin(v * Math.PI * 4);
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      const weightChange = learningRate * preActivity * postActivity - decay;
      
      return [x, y, weightChange * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 0.1, e: 0.01, uSegments: 64, vSegments: 64 })
  },

  dendritic_branching: {
    name: "🌳 Dendritic Branching - Neural Tree Structure",
    equation: (u, v, params) => {
      const branchLevels = Math.floor(params.d ?? 4);
      const spreadAngle = params.e ?? 0.5;
      const length = params.f ?? 0.5;
      
      let x = 0, y = 0, z = 0;
      let currentAngle = v * Math.PI * 2;
      let currentLength = length;
      
      for (let level = 0; level < branchLevels; level++) {
        const progress = u * branchLevels - level;
        if (progress < 0) break;
        if (progress > 1) progress === 1;
        
        const branchChoice = Math.floor(v * Math.pow(2, level)) % 2;
        currentAngle += (branchChoice * 2 - 1) * spreadAngle;
        
        x += Math.cos(currentAngle) * currentLength * Math.min(progress, 1);
        y += Math.sin(currentAngle) * currentLength * Math.min(progress, 1);
        z += currentLength * 0.2 * Math.min(progress, 1);
        
        currentLength *= 0.7;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 0.5, f: 0.5, uSegments: 64, vSegments: 64 })
  },

  calcium_wave_propagation: {
    name: "🌊 Calcium Wave - Intracellular Signaling",
    equation: (u, v, params) => {
      const waveSpeed = params.d ?? 2;
      const diffusion = params.e ?? 0.3;
      const amplitude = params.f ?? 1;
      const t = params.g ?? 0;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      const r = Math.sqrt(x * x + y * y);
      
      const wave = amplitude * Math.exp(-diffusion * r) * 
                   Math.sin(waveSpeed * r - t) * 
                   (1 + 0.3 * Math.sin(r * 10));
      
      return [x, y, wave * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.3, f: 1, uSegments: 80, vSegments: 80 })
  },

  neural_oscillation_surface: {
    name: "〰️ Neural Oscillations - Theta/Alpha/Gamma Rhythms",
    equation: (u, v, params) => {
      const theta = params.d ?? 6;
      const alpha = params.e ?? 10;
      const gamma = params.f ?? 40;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      const t = u * 10;
      
      const thetaWave = 0.5 * Math.sin(2 * Math.PI * theta * t / 100);
      const alphaWave = 0.3 * Math.sin(2 * Math.PI * alpha * t / 100);
      const gammaWave = 0.2 * Math.sin(2 * Math.PI * gamma * t / 100);
      
      const z = (thetaWave + alphaWave + gammaWave) * (1 + 0.5 * Math.cos(y * 2));
      
      return [x, y, z * 0.6];
    },
    defaultParams: getCleanDefaults({ d: 6, e: 10, f: 40, uSegments: 96, vSegments: 48 })
  },

  spike_train_encoding: {
    name: "📶 Spike Train - Temporal Pattern Encoding",
    equation: (u, v, params) => {
      const firingRate = params.d ?? 50;
      const refractoryPeriod = params.e ?? 2;
      const threshold = params.f ?? 0.5;
      
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;
      
      const membrane = Math.sin(u * firingRate) + Math.sin(v * firingRate * 0.7);
      const spike = membrane > threshold ? 1 : 0;
      const refractory = Math.exp(-Math.abs(membrane - threshold) / refractoryPeriod);
      
      return [x, y, spike * refractory * 0.5];
    },
    defaultParams: getCleanDefaults({ d: 50, e: 2, f: 0.5, uSegments: 128, vSegments: 64 })
  },

  // ============================================================================
  // NEURAL-LATTICE PROPULSION ENGINE (CONCEPTUAL)
  // ============================================================================

  lattice_turbine_nodes: {
    name: "⚙️ Lattice Turbine Nodes - Rotational Propulsion",
    equation: (u, v, params) => {
      const turbineCount = Math.floor(params.d ?? 6);
      const rotationSpeed = params.e ?? 2;
      const thrust = params.f ?? 0.5;
      const t = params.g ?? 0;
      
      const turbineIndex = Math.floor(u * turbineCount);
      const turbineAngle = (turbineIndex / turbineCount) * Math.PI * 2;
      const bladeAngle = v * Math.PI * 2 + rotationSpeed * t;
      
      const radius = 0.3 + v * 0.5;
      const x = Math.cos(turbineAngle) * 0.8 + Math.cos(bladeAngle) * radius * 0.3;
      const y = Math.sin(turbineAngle) * 0.8 + Math.sin(bladeAngle) * radius * 0.3;
      const z = thrust * Math.sin(bladeAngle * 3) * 0.2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 6, e: 2, f: 0.5, uSegments: 48, vSegments: 32 })
  },

  spiral_wave_propulsion: {
    name: "🌀 Spiral Wave Propulsion - Energy Flow",
    equation: (u, v, params) => {
      const spiralTightness = params.d ?? 3;
      const amplitude = params.e ?? 0.5;
      const propagationSpeed = params.f ?? 2;
      const t = params.g ?? 0;
      
      const theta = u * Math.PI * 4;
      const r = 0.1 + v * 0.9;
      
      const x = r * Math.cos(theta + spiralTightness * v);
      const y = r * Math.sin(theta + spiralTightness * v);
      const z = amplitude * Math.sin(propagationSpeed * (r - t));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.5, f: 2, uSegments: 80, vSegments: 40 })
  },

  adaptive_topology_reshape: {
    name: "🔄 Adaptive Topology - Dynamic Reshaping",
    equation: (u, v, params) => {
      const morphFactor = params.d ?? 0.5;
      const complexity = Math.floor(params.e ?? 3);
      const stability = params.f ?? 0.8;
      
      let x = (u - 0.5) * 2;
      let y = (v - 0.5) * 2;
      let z = 0;
      
      for (let i = 1; i <= complexity; i++) {
        const freq = i * 2;
        const morph = morphFactor * Math.sin(freq * x) * Math.cos(freq * y);
        x += morph * 0.1 / i;
        y += morph * 0.1 / i;
        z += stability * Math.sin(freq * (x + y)) / (i * i);
      }
      
      return [x, y, z * 0.3];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 3, f: 0.8, uSegments: 80, vSegments: 80 })
  },

  lattice_synchronization_wave: {
    name: "📡 Lattice Synchronization - Coherence Wave",
    equation: (u, v, params) => {
      const couplingStrength = params.d ?? 0.5;
      const oscillators = Math.floor(params.e ?? 8);
      const naturalFreq = params.f ?? 1;
      const t = params.g ?? 0;
      
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      
      let phase = 0;
      for (let i = 0; i < oscillators; i++) {
        const oscPhase = (i / oscillators) * Math.PI * 2;
        const coupling = couplingStrength * Math.sin(oscPhase - naturalFreq * t);
        phase += coupling;
      }
      
      const sync = Math.cos(phase / oscillators + x * 3 + y * 3);
      
      return [x, y, sync * 0.4];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 8, f: 1, uSegments: 64, vSegments: 64 })
  }
};

export default NEURAL_LATTICE_ALGORITHMS;
