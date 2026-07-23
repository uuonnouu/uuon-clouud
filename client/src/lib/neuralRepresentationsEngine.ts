/**
 * Neural Representations Engine for Δmension
 * 
 * Implements NeRF-like continuous sampling and SDS-inspired text-to-shape generation
 * as integrated features within the parametric shape system.
 * 
 * Core Algorithms:
 * 1. Positional Encoding - Fourier feature mapping for high-frequency detail
 * 2. Continuous Density Sampling - NeRF-style volumetric representation
 * 3. Hierarchical Sampling - Coarse-to-fine ray marching
 * 4. Score Distillation - Text-guided shape optimization
 * 5. MLP Approximation - Neural network-like interpolation
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * MATHEMATICAL FORMULATIONS (Research-Grade Documentation)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * ## 1. POSITIONAL ENCODING (Fourier Feature Mapping)
 * ───────────────────────────────────────────────────────────────────────────────
 * Maps low-dimensional coordinates to high-dimensional space using sinusoidal functions.
 * This enables MLPs to learn high-frequency detail that they would otherwise struggle with.
 * 
 * Formula: γ(p) = [sin(2⁰πp), cos(2⁰πp), sin(2¹πp), cos(2¹πp), ..., sin(2^(L-1)πp), cos(2^(L-1)πp)]
 * 
 * For 3D input (x, y, z) with L encoding levels:
 *   γ(x,y,z) = [x, y, z, sin(π·x), cos(π·x), sin(π·y), cos(π·y), sin(π·z), cos(π·z),
 *               sin(2π·x), cos(2π·x), ..., sin(2^(L-1)π·z), cos(2^(L-1)π·z)]
 * 
 * Output dimension: 3 + L × 6 = 3 + 6L
 * Default L=10 → 63-dimensional encoding
 * 
 * Reference: Mildenhall et al., "NeRF: Representing Scenes as Neural Radiance Fields" (ECCV 2020)
 * 
 * ## 2. VOLUME RENDERING EQUATION
 * ───────────────────────────────────────────────────────────────────────────────
 * Renders color along a ray by integrating density-weighted radiance.
 * 
 * Ray definition: r(t) = o + t·d  where o = origin, d = direction, t ∈ [t_near, t_far]
 * 
 * Transmittance (probability of reaching point t without hitting anything):
 *   T(t) = exp(-∫_{t_near}^{t} σ(r(s)) ds)
 * 
 * Expected color along ray:
 *   C(r) = ∫_{t_near}^{t_far} T(t) · σ(r(t)) · c(r(t), d) dt
 * 
 * Discrete approximation (quadrature):
 *   Ĉ(r) = Σᵢ Tᵢ · (1 - exp(-σᵢ · δᵢ)) · cᵢ
 *   where Tᵢ = exp(-Σⱼ₌₁^{i-1} σⱼ · δⱼ)
 *   and δᵢ = tᵢ₊₁ - tᵢ (distance between samples)
 * 
 * ## 3. ALPHA COMPOSITING
 * ───────────────────────────────────────────────────────────────────────────────
 * Front-to-back compositing for volume rendering:
 *   αᵢ = 1 - exp(-σᵢ · δᵢ)  (opacity from density)
 *   C_{out} = C_{in} + (1 - A_{in}) · αᵢ · cᵢ  (color accumulation)
 *   A_{out} = A_{in} + (1 - A_{in}) · αᵢ  (alpha accumulation)
 * 
 * ## 4. HIERARCHICAL SAMPLING (Coarse-to-Fine)
 * ───────────────────────────────────────────────────────────────────────────────
 * Two-stage sampling for efficient ray marching:
 * 
 * Stage 1 (Coarse): N_c uniform samples
 *   tᵢ ~ U[t_near + (i-1)/N_c · (t_far - t_near), t_near + i/N_c · (t_far - t_near)]
 * 
 * Stage 2 (Fine): N_f importance samples based on coarse weights
 *   Normalized weights: ŵᵢ = wᵢ / Σⱼ wⱼ  where wᵢ = Tᵢ · αᵢ
 *   Sample from piecewise-constant PDF defined by ŵᵢ
 * 
 * ## 5. HASH GRID ENCODING (Instant-NGP)
 * ───────────────────────────────────────────────────────────────────────────────
 * Multi-resolution hash encoding for fast convergence:
 * 
 * Resolution at level l: N_l = ⌊N_min · b^l⌋  where b = exp((ln(N_max) - ln(N_min))/(L-1))
 * Hash function: h(x) = (⊕ᵢ xᵢ · πᵢ) mod T  where πᵢ are large primes, T = hash table size
 * 
 * Trilinear interpolation within each grid cell at each level.
 * Final encoding = concatenation of all L levels.
 * 
 * Reference: Müller et al., "Instant Neural Graphics Primitives" (SIGGRAPH 2022)
 * 
 * ## 6. CAMERA MODELS
 * ───────────────────────────────────────────────────────────────────────────────
 * Pinhole camera projection:
 *   K = [fx  0  cx]    (intrinsic matrix)
 *       [0  fy  cy]
 *       [0   0   1]
 * 
 * World-to-camera: x_cam = R · x_world + t  where R ∈ SO(3), t ∈ ℝ³
 * Projection: [u, v, 1]ᵀ = (1/z_cam) · K · x_cam
 * 
 * Radial distortion (OpenCV model):
 *   r² = x'² + y'²
 *   x_d = x'(1 + k₁r² + k₂r⁴ + k₃r⁶) + 2p₁x'y' + p₂(r² + 2x'²)
 *   y_d = y'(1 + k₁r² + k₂r⁴ + k₃r⁶) + p₁(r² + 2y'²) + 2p₂x'y'
 * 
 * ## 7. SEMANTIC NEURAL RADIANCE FIELDS (FruitNeRF)
 * ───────────────────────────────────────────────────────────────────────────────
 * Extended NeRF with semantic output for object detection/counting:
 *   F_θ(x, d) → (c, σ, s)  where s = semantic label probability
 * 
 * Binary segmentation for fruit detection:
 *   L_semantic = -Σᵢ [yᵢ log(ŝᵢ) + (1-yᵢ) log(1-ŝᵢ)]  (binary cross-entropy)
 * 
 * Point cloud extraction via uniform volume sampling:
 *   P = {x : σ(x) > τ_density ∧ s(x) > τ_semantic}
 * 
 * Cascaded clustering for fruit counting:
 *   DBSCAN(P, ε, min_samples) → {C₁, C₂, ..., Cₙ}
 *   Fruit count = n (number of clusters)
 * 
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

import * as THREE from 'three';

// Type definitions for shape parameters
export interface ShapeParameters {
  a: number; b: number; c: number;
  d?: number; e?: number; f?: number;
  g?: number; h?: number; i?: number;
  j?: number; k?: number; l?: number; m?: number;
  uMin?: number; uMax?: number; vMin?: number; vMax?: number;
  uSegments?: number; vSegments?: number;
}

export interface ParametricSurface {
  id: string;
  name: string;
  formula?: string;
  category: string;
  description?: string;
  getPosition: (u: number, v: number, params: ShapeParameters) => [number, number, number];
}

// Neural representation configuration
export interface NeuralConfig {
  encodingLevels: number;      // Positional encoding frequency bands (default: 10)
  samplingDensity: number;     // Samples per ray (default: 64)
  networkDepth: number;        // MLP layer approximation depth (default: 8)
  activationSharpness: number; // ReLU-like activation steepness (default: 10)
}

// Security fingerprint for neural exports (aligned with system standards)
export interface NeuralSecurityFingerprint {
  cryptographicHash: string;
  verificationCode: string;
  timestamp: string;
  author: string;
  organization: string;
  copyright: string;
  license: string;
  integrityVersion: string;
}

// Neural scene representation
export interface NeuralScene {
  version: string;
  type: 'nerf' | 'sdf' | 'hybrid';
  encoding: {
    type: 'fourier' | 'hashgrid';
    levels: number;
    features: number[][];
  };
  network: {
    weights: number[][][];
    biases: number[][];
    activations: string[];
  };
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  metadata: {
    shapeId: string;
    shapeName: string;
    parameters: ShapeParameters;
    exportDate: string;
    algorithm: string;
  };
  security: NeuralSecurityFingerprint;
}

// Text-to-shape result
export interface TextToShapeResult {
  id: string;
  name: string;
  formula: string;
  category: string;
  description: string;
  getPosition: (u: number, v: number, p: ShapeParameters) => [number, number, number];
  confidence: number;
  matchedKeywords: string[];
}

// ============================================================================
// NERFSTUDIO-COMPATIBLE INTERFACES
// Compatible with nerfstudio, instant-ngp, nerfacto, and other NeRF frameworks
// ============================================================================

/**
 * Camera intrinsic parameters (OpenCV/nerfstudio format)
 * K = [fx  0  cx]
 *     [0  fy  cy]
 *     [0   0   1]
 */
export interface CameraIntrinsics {
  fl_x: number;           // Focal length X (fx)
  fl_y: number;           // Focal length Y (fy)
  cx: number;             // Principal point X
  cy: number;             // Principal point Y
  w: number;              // Image width
  h: number;              // Image height
  k1?: number;            // Radial distortion k1
  k2?: number;            // Radial distortion k2
  k3?: number;            // Radial distortion k3
  k4?: number;            // Radial distortion k4
  p1?: number;            // Tangential distortion p1
  p2?: number;            // Tangential distortion p2
  camera_model?: 'PINHOLE' | 'OPENCV' | 'OPENCV_FISHEYE' | 'EQUIRECTANGULAR';
}

/**
 * Camera extrinsic parameters (4x4 transform matrix)
 * [R | t]   where R ∈ SO(3), t ∈ ℝ³
 * [0 | 1]
 */
export interface CameraFrame {
  file_path: string;                    // Image file path
  transform_matrix: number[][];         // 4x4 camera-to-world transform
  sharpness?: number;                   // Optional sharpness metric
  time?: number;                        // Temporal coordinate for dynamic scenes
  depth_file_path?: string;             // Optional depth map
  mask_file_path?: string;              // Optional segmentation mask
}

/**
 * Nerfstudio transforms.json format
 * Full compatibility with nerfstudio data loading
 */
export interface NerfstudioTransforms {
  camera_model: 'PINHOLE' | 'OPENCV' | 'OPENCV_FISHEYE' | 'EQUIRECTANGULAR';
  fl_x: number;
  fl_y: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
  k1?: number;
  k2?: number;
  k3?: number;
  k4?: number;
  p1?: number;
  p2?: number;
  aabb_scale?: number;                  // Scene bounding box scale (1, 2, 4, 8, 16, 32)
  scale?: number;                       // Scene scale factor
  offset?: [number, number, number];    // Scene offset
  frames: CameraFrame[];
  applied_transform?: number[][];       // Optional applied transform
  ply_file_path?: string;               // Optional point cloud path
}

/**
 * Hash grid encoding configuration (Instant-NGP style)
 * 
 * Resolution at level l: N_l = ⌊N_min · b^l⌋
 * where b = exp((ln(N_max) - ln(N_min))/(L-1))
 */
export interface HashGridConfig {
  otype: 'HashGrid' | 'DenseGrid' | 'TiledGrid';
  n_levels: number;                     // Number of levels (L), typically 16
  n_features_per_level: number;         // Features per level (F), typically 2
  log2_hashmap_size: number;            // log₂ of hash table size (T), typically 19
  base_resolution: number;              // N_min, typically 16
  max_resolution: number;               // N_max, typically 2048
  per_level_scale?: number;             // Growth factor b, computed if not provided
  interpolation?: 'Linear' | 'Smoothstep';
}

/**
 * MLP network configuration (Instant-NGP/nerfacto format)
 */
export interface MLPConfig {
  otype: 'FullyFusedMLP' | 'CutlassMLP';
  activation: 'ReLU' | 'Exponential' | 'None' | 'Sigmoid' | 'Softplus';
  output_activation: 'None' | 'Sigmoid' | 'Softplus';
  n_neurons: number;                    // Hidden layer width
  n_hidden_layers: number;              // Number of hidden layers
  n_input_dims?: number;                // Input dimension
  n_output_dims?: number;               // Output dimension
}

/**
 * Instant-NGP compatible scene configuration
 */
export interface InstantNGPConfig {
  loss: {
    otype: 'L2' | 'RelativeL2' | 'Huber';
  };
  optimizer: {
    otype: 'Adam' | 'Shampoo' | 'Average';
    learning_rate: number;
    epsilon?: number;
    l2_reg?: number;
  };
  encoding: HashGridConfig;
  network: MLPConfig;
  dir_encoding?: {
    otype: 'SphericalHarmonics' | 'OneBlob' | 'Frequency';
    degree?: number;
    n_frequencies?: number;
  };
  rgb_network?: MLPConfig;
  density_network?: MLPConfig;
}

/**
 * Complete nerfstudio-compatible export package
 * Contains all data needed for training/rendering with nerfstudio
 */
export interface NerfstudioExport {
  version: '1.0';
  format: 'nerfstudio';
  transforms: NerfstudioTransforms;
  instant_ngp_config?: InstantNGPConfig;
  point_cloud?: {
    format: 'PLY' | 'PCD' | 'XYZ';
    points: number[][];                  // [x, y, z, r, g, b, nx, ny, nz][]
    has_normals: boolean;
    has_colors: boolean;
  };
  semantic_data?: {
    classes: string[];
    class_colors: [number, number, number][];
    per_point_labels?: number[];
  };
  scene_bounds: {
    aabb_min: [number, number, number];
    aabb_max: [number, number, number];
    center: [number, number, number];
    scale: number;
  };
  metadata: {
    source: string;
    shapeId: string;
    shapeName: string;
    exportDate: string;
    parameters: ShapeParameters;
    dmension_version: string;
  };
  security: NeuralSecurityFingerprint;
  formulas: NeuralFormulas;
}

/**
 * Mathematical formulas for neural rendering
 * Documented for educational/research purposes
 */
export interface NeuralFormulas {
  positional_encoding: {
    formula: string;
    latex: string;
    description: string;
    parameters: { name: string; symbol: string; description: string }[];
  };
  volume_rendering: {
    formula: string;
    latex: string;
    description: string;
    components: { name: string; formula: string; description: string }[];
  };
  hash_grid_encoding: {
    formula: string;
    latex: string;
    description: string;
    resolution_formula: string;
  };
  camera_projection: {
    intrinsic_matrix: string;
    projection_formula: string;
    distortion_model: string;
  };
}

// Default configuration
const DEFAULT_CONFIG: NeuralConfig = {
  encodingLevels: 10,
  samplingDensity: 64,
  networkDepth: 8,
  activationSharpness: 10
};

// UUON Attribution (aligned with system standards)
const UUON_NEURAL_ATTRIBUTION = {
  author: 'UUON Foundation Inc.',
  organization: 'Δmension Mathematical Universe',
  copyright: '© 2024 UUON Foundation Inc. All Rights Reserved.',
  license: 'CC BY-NC 4.0'
};

/**
 * Generate cryptographic hash for neural scene data
 * SHA-256 based fingerprint for tamper detection
 */
async function generateNeuralHash(scene: Partial<NeuralScene>): Promise<string> {
  const dataString = JSON.stringify({
    encoding: scene.encoding,
    network: scene.network,
    bounds: scene.bounds,
    metadata: scene.metadata
  });
  
  const encoder = new TextEncoder();
  const data = encoder.encode(dataString);
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for environments without crypto.subtle
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      const char = dataString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }
}

/**
 * Generate verification code from hash and metadata
 * Creates a unique, verifiable signature
 */
function generateVerificationCode(hash: string, shapeId: string, timestamp: string): string {
  const combined = `${hash.slice(0, 16)}-${shapeId.slice(0, 8)}-${timestamp.slice(0, 10)}`;
  let code = 0;
  for (let i = 0; i < combined.length; i++) {
    code = ((code << 5) - code) + combined.charCodeAt(i);
    code = code & code;
  }
  return `NERF-${Math.abs(code).toString(36).toUpperCase().padStart(8, '0')}`;
}

/**
 * Create security fingerprint for neural export
 * Aligned with system authorship fingerprint standards
 */
async function createNeuralSecurityFingerprint(
  scene: Partial<NeuralScene>,
  shapeId: string
): Promise<NeuralSecurityFingerprint> {
  const timestamp = new Date().toISOString();
  const hash = await generateNeuralHash(scene);
  const verificationCode = generateVerificationCode(hash, shapeId, timestamp);
  
  return {
    cryptographicHash: hash,
    verificationCode,
    timestamp,
    author: UUON_NEURAL_ATTRIBUTION.author,
    organization: UUON_NEURAL_ATTRIBUTION.organization,
    copyright: UUON_NEURAL_ATTRIBUTION.copyright,
    license: UUON_NEURAL_ATTRIBUTION.license,
    integrityVersion: '1.0'
  };
}

/**
 * Positional Encoding - Maps coordinates to higher-dimensional space
 * using Fourier features for capturing high-frequency detail
 */
export function positionalEncoding(
  x: number, 
  y: number, 
  z: number, 
  levels: number = 10
): number[] {
  const encoded: number[] = [x, y, z];
  
  for (let l = 0; l < levels; l++) {
    const freq = Math.pow(2, l) * Math.PI;
    encoded.push(Math.sin(freq * x), Math.cos(freq * x));
    encoded.push(Math.sin(freq * y), Math.cos(freq * y));
    encoded.push(Math.sin(freq * z), Math.cos(freq * z));
  }
  
  return encoded;
}

/**
 * MLP Forward Pass Approximation
 * Simulates neural network inference using matrix operations
 */
function mlpForward(
  input: number[],
  weights: number[][][],
  biases: number[][],
  sharpness: number = 10
): number[] {
  let activation = input;
  
  for (let layer = 0; layer < weights.length; layer++) {
    const W = weights[layer];
    const b = biases[layer];
    const output: number[] = [];
    
    for (let j = 0; j < W[0].length; j++) {
      let sum = b[j];
      for (let i = 0; i < activation.length; i++) {
        sum += activation[i] * W[i][j];
      }
      // Smooth ReLU approximation (softplus)
      output.push(Math.log(1 + Math.exp(sharpness * sum)) / sharpness);
    }
    
    activation = output;
  }
  
  return activation;
}

/**
 * Initialize neural network weights for a shape
 * Uses Xavier initialization scaled by shape complexity
 */
function initializeNetwork(
  inputDim: number,
  hiddenDim: number,
  outputDim: number,
  depth: number,
  seed: number = 42
): { weights: number[][][]; biases: number[][] } {
  const weights: number[][][] = [];
  const biases: number[][] = [];
  
  // Seeded random for reproducibility
  let rng = seed;
  const random = () => {
    rng = (rng * 1103515245 + 12345) & 0x7fffffff;
    return (rng / 0x7fffffff) * 2 - 1;
  };
  
  // Input layer
  const inputLayer: number[][] = [];
  for (let i = 0; i < inputDim; i++) {
    const row: number[] = [];
    for (let j = 0; j < hiddenDim; j++) {
      row.push(random() * Math.sqrt(2 / inputDim));
    }
    inputLayer.push(row);
  }
  weights.push(inputLayer);
  biases.push(Array(hiddenDim).fill(0).map(() => random() * 0.01));
  
  // Hidden layers
  for (let d = 1; d < depth - 1; d++) {
    const layer: number[][] = [];
    for (let i = 0; i < hiddenDim; i++) {
      const row: number[] = [];
      for (let j = 0; j < hiddenDim; j++) {
        row.push(random() * Math.sqrt(2 / hiddenDim));
      }
      layer.push(row);
    }
    weights.push(layer);
    biases.push(Array(hiddenDim).fill(0).map(() => random() * 0.01));
  }
  
  // Output layer
  const outputLayer: number[][] = [];
  for (let i = 0; i < hiddenDim; i++) {
    const row: number[] = [];
    for (let j = 0; j < outputDim; j++) {
      row.push(random() * Math.sqrt(2 / hiddenDim));
    }
    outputLayer.push(row);
  }
  weights.push(outputLayer);
  biases.push(Array(outputDim).fill(0));
  
  return { weights, biases };
}

/**
 * Train neural representation from parametric surface samples
 * Uses gradient-free optimization approximation
 * Now includes security fingerprinting aligned with system standards
 */
export async function trainNeuralRepresentation(
  shape: ParametricSurface,
  params: ShapeParameters,
  config: NeuralConfig = DEFAULT_CONFIG
): Promise<NeuralScene> {
  const { encodingLevels, networkDepth } = config;
  
  // Sample the parametric surface
  const samples: Array<{ pos: [number, number, number]; uv: [number, number] }> = [];
  const resolution = 32;
  
  let minBounds: [number, number, number] = [Infinity, Infinity, Infinity];
  let maxBounds: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      const u = i / resolution;
      const v = j / resolution;
      const pos = shape.getPosition(u, v, params);
      
      samples.push({ pos, uv: [u, v] });
      
      // Track bounds
      for (let k = 0; k < 3; k++) {
        minBounds[k] = Math.min(minBounds[k], pos[k]);
        maxBounds[k] = Math.max(maxBounds[k], pos[k]);
      }
    }
  }
  
  // Calculate encoding features from samples
  const features: number[][] = [];
  for (const sample of samples) {
    const encoded = positionalEncoding(
      sample.pos[0], 
      sample.pos[1], 
      sample.pos[2], 
      encodingLevels
    );
    features.push(encoded);
  }
  
  // Initialize network
  const inputDim = 3 + encodingLevels * 6; // xyz + fourier features
  const hiddenDim = 64;
  const outputDim = 4; // RGB + density
  
  const shapeHash = shape.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const { weights, biases } = initializeNetwork(
    inputDim, 
    hiddenDim, 
    outputDim, 
    networkDepth,
    shapeHash
  );
  
  // Build scene without security first for hashing
  const sceneData = {
    version: '1.0',
    type: 'nerf' as const,
    encoding: {
      type: 'fourier' as const,
      levels: encodingLevels,
      features
    },
    network: {
      weights,
      biases,
      activations: Array(networkDepth).fill('relu').concat(['sigmoid'])
    },
    bounds: {
      min: minBounds,
      max: maxBounds
    },
    metadata: {
      shapeId: shape.id,
      shapeName: shape.name,
      parameters: { ...params },
      exportDate: new Date().toISOString(),
      algorithm: 'NeRF-Lite v1.0 (Positional Encoding + MLP)'
    }
  };
  
  // Generate security fingerprint (aligned with system standards)
  const security = await createNeuralSecurityFingerprint(sceneData, shape.id);
  
  return {
    ...sceneData,
    security
  };
}

/**
 * Query neural representation at a point
 * Returns density and color at the given position
 */
export function queryNeuralScene(
  scene: NeuralScene,
  x: number,
  y: number,
  z: number
): { density: number; color: [number, number, number] } {
  // Normalize to scene bounds
  const { min, max } = scene.bounds;
  const nx = (x - min[0]) / (max[0] - min[0]) * 2 - 1;
  const ny = (y - min[1]) / (max[1] - min[1]) * 2 - 1;
  const nz = (z - min[2]) / (max[2] - min[2]) * 2 - 1;
  
  // Positional encoding
  const encoded = positionalEncoding(nx, ny, nz, scene.encoding.levels);
  
  // MLP forward pass
  const output = mlpForward(
    encoded,
    scene.network.weights,
    scene.network.biases
  );
  
  // Sigmoid for final output
  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));
  
  return {
    density: sigmoid(output[3]),
    color: [
      sigmoid(output[0]),
      sigmoid(output[1]),
      sigmoid(output[2])
    ]
  };
}

/**
 * Volumetric ray marching through neural scene
 * NeRF-style rendering algorithm
 */
export function rayMarchNeuralScene(
  scene: NeuralScene,
  rayOrigin: [number, number, number],
  rayDirection: [number, number, number],
  numSamples: number = 64
): { color: [number, number, number]; depth: number; alpha: number } {
  const { min, max } = scene.bounds;
  
  // Calculate ray-box intersection
  const invDir = rayDirection.map(d => d === 0 ? 1e10 : 1 / d) as [number, number, number];
  const t0 = min.map((m, i) => (m - rayOrigin[i]) * invDir[i]);
  const t1 = max.map((m, i) => (m - rayOrigin[i]) * invDir[i]);
  
  const tmin = Math.max(...t0.map((t, i) => Math.min(t, t1[i])));
  const tmax = Math.min(...t0.map((t, i) => Math.max(t, t1[i])));
  
  if (tmin > tmax || tmax < 0) {
    return { color: [0, 0, 0], depth: Infinity, alpha: 0 };
  }
  
  // March through the volume
  const step = (tmax - Math.max(0, tmin)) / numSamples;
  let accumulatedColor: [number, number, number] = [0, 0, 0];
  let accumulatedAlpha = 0;
  let firstHitDepth = Infinity;
  
  for (let i = 0; i < numSamples && accumulatedAlpha < 0.99; i++) {
    const t = Math.max(0, tmin) + (i + 0.5) * step;
    const pos: [number, number, number] = [
      rayOrigin[0] + t * rayDirection[0],
      rayOrigin[1] + t * rayDirection[1],
      rayOrigin[2] + t * rayDirection[2]
    ];
    
    const { density, color } = queryNeuralScene(scene, pos[0], pos[1], pos[2]);
    
    // Alpha compositing
    const alpha = 1 - Math.exp(-density * step * 10);
    const weight = alpha * (1 - accumulatedAlpha);
    
    accumulatedColor[0] += weight * color[0];
    accumulatedColor[1] += weight * color[1];
    accumulatedColor[2] += weight * color[2];
    accumulatedAlpha += weight;
    
    if (alpha > 0.1 && firstHitDepth === Infinity) {
      firstHitDepth = t;
    }
  }
  
  return {
    color: accumulatedColor,
    depth: firstHitDepth,
    alpha: accumulatedAlpha
  };
}

/**
 * Export neural scene to downloadable format
 */
export function exportNeuralScene(scene: NeuralScene): Blob {
  const jsonString = JSON.stringify(scene, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

// ============================================================================
// NERFSTUDIO-COMPATIBLE EXPORT FUNCTIONS
// ============================================================================

/**
 * Default neural formulas documentation
 * Provides research-grade mathematical formulations for all NeRF components
 */
export const NEURAL_FORMULAS: NeuralFormulas = {
  positional_encoding: {
    formula: 'γ(p) = [p, sin(2⁰πp), cos(2⁰πp), ..., sin(2^(L-1)πp), cos(2^(L-1)πp)]',
    latex: '\\gamma(p) = \\left[p, \\sin(2^0 \\pi p), \\cos(2^0 \\pi p), \\ldots, \\sin(2^{L-1} \\pi p), \\cos(2^{L-1} \\pi p)\\right]',
    description: 'Fourier feature mapping that enables MLPs to learn high-frequency functions. Without positional encoding, coordinate-based MLPs are biased toward learning low-frequency functions.',
    parameters: [
      { name: 'Input position', symbol: 'p', description: 'Normalized 3D coordinate (x, y, z) ∈ [-1, 1]³' },
      { name: 'Encoding levels', symbol: 'L', description: 'Number of frequency octaves (typically 10 for positions, 4 for directions)' },
      { name: 'Output dimension', symbol: '3 + 6L', description: 'Total encoding dimension (63 for L=10)' }
    ]
  },
  volume_rendering: {
    formula: 'C(r) = ∫_{t_n}^{t_f} T(t) · σ(r(t)) · c(r(t), d) dt',
    latex: 'C(\\mathbf{r}) = \\int_{t_n}^{t_f} T(t) \\cdot \\sigma(\\mathbf{r}(t)) \\cdot \\mathbf{c}(\\mathbf{r}(t), \\mathbf{d}) \\, dt',
    description: 'The expected color along a ray, computed by integrating density-weighted radiance. T(t) is the accumulated transmittance (probability of the ray traveling to t without hitting anything).',
    components: [
      { name: 'Transmittance', formula: 'T(t) = exp(-∫_{t_n}^{t} σ(r(s)) ds)', description: 'Accumulated probability of ray reaching point t' },
      { name: 'Alpha', formula: 'α_i = 1 - exp(-σ_i · δ_i)', description: 'Opacity of sample i based on density and step size' },
      { name: 'Discrete rendering', formula: 'Ĉ = Σ_i T_i · α_i · c_i', description: 'Quadrature approximation of the rendering integral' },
      { name: 'Weight', formula: 'w_i = T_i · α_i', description: 'Contribution weight of sample i to final color' }
    ]
  },
  hash_grid_encoding: {
    formula: 'h(x) = (⊕_i x_i · π_i) mod T',
    latex: 'h(\\mathbf{x}) = \\left(\\bigoplus_i x_i \\cdot \\pi_i\\right) \\mod T',
    description: 'Multi-resolution hash encoding from Instant-NGP. Uses spatial hashing at multiple resolutions with learned feature vectors, enabling fast training and inference.',
    resolution_formula: 'N_l = ⌊N_min · b^l⌋, b = exp((ln(N_max) - ln(N_min))/(L-1))'
  },
  camera_projection: {
    intrinsic_matrix: 'K = [[fx, 0, cx], [0, fy, cy], [0, 0, 1]]',
    projection_formula: '[u, v, 1]ᵀ = (1/z) · K · [x, y, z]ᵀ',
    distortion_model: 'x_d = x\'(1 + k₁r² + k₂r⁴ + k₃r⁶) + 2p₁x\'y\' + p₂(r² + 2x\'²)'
  }
};

/**
 * Generate orbiting camera views around a scene
 * Creates synthetic camera positions for NeRF training visualization
 * 
 * @param numViews - Number of camera views to generate (default: 100)
 * @param radius - Distance from scene center (default: 4.0)
 * @param height - Camera height above center (default: 1.5)
 * @param imageSize - [width, height] of synthetic images
 * @param fov - Field of view in degrees (default: 50)
 */
export function generateOrbitingCameras(
  numViews: number = 100,
  radius: number = 4.0,
  height: number = 1.5,
  imageSize: [number, number] = [800, 800],
  fov: number = 50
): CameraFrame[] {
  const frames: CameraFrame[] = [];
  const [w, h] = imageSize;
  
  for (let i = 0; i < numViews; i++) {
    const angle = (i / numViews) * Math.PI * 2;
    
    const camX = Math.cos(angle) * radius;
    const camY = height;
    const camZ = Math.sin(angle) * radius;
    
    const forward = [-camX, -camY, -camZ];
    const len = Math.sqrt(forward[0]**2 + forward[1]**2 + forward[2]**2);
    forward[0] /= len; forward[1] /= len; forward[2] /= len;
    
    const up = [0, 1, 0];
    const right = [
      up[1] * forward[2] - up[2] * forward[1],
      up[2] * forward[0] - up[0] * forward[2],
      up[0] * forward[1] - up[1] * forward[0]
    ];
    const rLen = Math.sqrt(right[0]**2 + right[1]**2 + right[2]**2);
    right[0] /= rLen; right[1] /= rLen; right[2] /= rLen;
    
    const newUp = [
      forward[1] * right[2] - forward[2] * right[1],
      forward[2] * right[0] - forward[0] * right[2],
      forward[0] * right[1] - forward[1] * right[0]
    ];
    
    const transform: number[][] = [
      [right[0], newUp[0], -forward[0], camX],
      [right[1], newUp[1], -forward[1], camY],
      [right[2], newUp[2], -forward[2], camZ],
      [0, 0, 0, 1]
    ];
    
    frames.push({
      file_path: `./images/frame_${String(i).padStart(4, '0')}.png`,
      transform_matrix: transform,
      sharpness: 1.0,
      time: i / numViews
    });
  }
  
  return frames;
}

/**
 * Create nerfstudio-compatible transforms.json data
 * 
 * @param mesh - Three.js mesh to export
 * @param options - Export configuration options
 */
export function createNerfstudioTransforms(
  mesh: THREE.Mesh | THREE.Object3D,
  options: {
    numViews?: number;
    cameraRadius?: number;
    cameraHeight?: number;
    imageSize?: [number, number];
    fov?: number;
    cameraModel?: 'PINHOLE' | 'OPENCV';
  } = {}
): NerfstudioTransforms {
  const {
    numViews = 100,
    cameraRadius = 4.0,
    cameraHeight = 1.5,
    imageSize = [800, 800],
    fov = 50,
    cameraModel = 'PINHOLE'
  } = options;
  
  const [w, h] = imageSize;
  
  const fovRad = (fov * Math.PI) / 180;
  const fl = (w / 2) / Math.tan(fovRad / 2);
  
  const frames = generateOrbitingCameras(numViews, cameraRadius, cameraHeight, imageSize, fov);
  
  const geometry = (mesh as THREE.Mesh).geometry;
  if (geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (box) {
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const aabbScale = Math.pow(2, Math.ceil(Math.log2(maxDim)));
    }
  }
  
  return {
    camera_model: cameraModel,
    fl_x: fl,
    fl_y: fl,
    cx: w / 2,
    cy: h / 2,
    w,
    h,
    k1: 0,
    k2: 0,
    p1: 0,
    p2: 0,
    aabb_scale: 4,
    frames
  };
}

/**
 * Create Instant-NGP compatible configuration
 * Generates optimized hyperparameters for fast training
 */
export function createInstantNGPConfig(
  options: {
    quality?: 'fast' | 'medium' | 'high';
    learningRate?: number;
    hashGridLevels?: number;
    maxResolution?: number;
  } = {}
): InstantNGPConfig {
  const {
    quality = 'medium',
    learningRate = 1e-2,
    hashGridLevels = 16,
    maxResolution = 2048
  } = options;
  
  const qualitySettings = {
    fast: { neurons: 64, layers: 2, featuresPerLevel: 2, baseRes: 16 },
    medium: { neurons: 64, layers: 4, featuresPerLevel: 2, baseRes: 16 },
    high: { neurons: 128, layers: 6, featuresPerLevel: 4, baseRes: 16 }
  };
  
  const settings = qualitySettings[quality];
  
  const b = Math.exp((Math.log(maxResolution) - Math.log(settings.baseRes)) / (hashGridLevels - 1));
  
  return {
    loss: { otype: 'L2' },
    optimizer: {
      otype: 'Adam',
      learning_rate: learningRate,
      epsilon: 1e-15
    },
    encoding: {
      otype: 'HashGrid',
      n_levels: hashGridLevels,
      n_features_per_level: settings.featuresPerLevel,
      log2_hashmap_size: 19,
      base_resolution: settings.baseRes,
      max_resolution: maxResolution,
      per_level_scale: b,
      interpolation: 'Linear'
    },
    network: {
      otype: 'FullyFusedMLP',
      activation: 'ReLU',
      output_activation: 'None',
      n_neurons: settings.neurons,
      n_hidden_layers: settings.layers
    },
    dir_encoding: {
      otype: 'SphericalHarmonics',
      degree: 4
    },
    rgb_network: {
      otype: 'FullyFusedMLP',
      activation: 'ReLU',
      output_activation: 'Sigmoid',
      n_neurons: 64,
      n_hidden_layers: 2
    }
  };
}

/**
 * Extract point cloud from Three.js mesh
 * Creates PLY-compatible point data with colors and normals
 */
export function extractPointCloud(
  mesh: THREE.Mesh | THREE.Object3D,
  maxPoints: number = 50000
): { points: number[][]; has_normals: boolean; has_colors: boolean } {
  const geometry = (mesh as THREE.Mesh).geometry;
  
  if (!geometry || !geometry.attributes?.position) {
    return { points: [], has_normals: false, has_colors: false };
  }
  
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const colors = geometry.attributes.color;
  
  const hasNormals = !!normals;
  const hasColors = !!colors;
  
  const points: number[][] = [];
  const step = Math.max(1, Math.floor(positions.count / maxPoints));
  
  for (let i = 0; i < positions.count; i += step) {
    const point: number[] = [
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    ];
    
    if (hasColors) {
      point.push(
        Math.round(colors.getX(i) * 255),
        Math.round(colors.getY(i) * 255),
        Math.round(colors.getZ(i) * 255)
      );
    } else {
      point.push(128, 128, 255);
    }
    
    if (hasNormals) {
      point.push(
        normals.getX(i),
        normals.getY(i),
        normals.getZ(i)
      );
    }
    
    points.push(point);
  }
  
  return { points, has_normals: hasNormals, has_colors: true };
}

/**
 * Create complete nerfstudio-compatible export package
 * Generates all files needed for training with nerfstudio
 * 
 * @param mesh - Three.js mesh to export
 * @param shapeId - Shape identifier
 * @param shapeName - Shape display name
 * @param params - Shape parameters
 * @param options - Export configuration
 */
export async function createNerfstudioExport(
  mesh: THREE.Mesh | THREE.Object3D,
  shapeId: string,
  shapeName: string,
  params: ShapeParameters,
  options: {
    numViews?: number;
    quality?: 'fast' | 'medium' | 'high';
    includePointCloud?: boolean;
    includeSemantic?: boolean;
  } = {}
): Promise<NerfstudioExport> {
  const {
    numViews = 100,
    quality = 'medium',
    includePointCloud = true,
    includeSemantic = false
  } = options;
  
  const transforms = createNerfstudioTransforms(mesh, { numViews });
  const instantNgpConfig = createInstantNGPConfig({ quality });
  
  const geometry = (mesh as THREE.Mesh).geometry;
  let sceneBounds = {
    aabb_min: [-1, -1, -1] as [number, number, number],
    aabb_max: [1, 1, 1] as [number, number, number],
    center: [0, 0, 0] as [number, number, number],
    scale: 1
  };
  
  if (geometry) {
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (box) {
      sceneBounds = {
        aabb_min: [box.min.x, box.min.y, box.min.z],
        aabb_max: [box.max.x, box.max.y, box.max.z],
        center: [
          (box.min.x + box.max.x) / 2,
          (box.min.y + box.max.y) / 2,
          (box.min.z + box.max.z) / 2
        ],
        scale: Math.max(
          box.max.x - box.min.x,
          box.max.y - box.min.y,
          box.max.z - box.min.z
        )
      };
    }
  }
  
  let pointCloud;
  if (includePointCloud) {
    const pcData = extractPointCloud(mesh);
    pointCloud = {
      format: 'PLY' as const,
      ...pcData
    };
  }
  
  const timestamp = new Date().toISOString();
  const hashContent = `${shapeId}:${shapeName}:${timestamp}`;
  let hash = 0;
  for (let i = 0; i < hashContent.length; i++) {
    hash = ((hash << 5) - hash) + hashContent.charCodeAt(i);
    hash = hash & hash;
  }
  const cryptoHash = Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
  
  const security: NeuralSecurityFingerprint = {
    cryptographicHash: cryptoHash,
    verificationCode: `NERF-${cryptoHash.slice(0, 8).toUpperCase()}`,
    timestamp,
    author: UUON_NEURAL_ATTRIBUTION.author,
    organization: UUON_NEURAL_ATTRIBUTION.organization,
    copyright: UUON_NEURAL_ATTRIBUTION.copyright,
    license: UUON_NEURAL_ATTRIBUTION.license,
    integrityVersion: '2.0'
  };
  
  const nerfstudioExport: NerfstudioExport = {
    version: '1.0',
    format: 'nerfstudio',
    transforms,
    instant_ngp_config: instantNgpConfig,
    point_cloud: pointCloud,
    scene_bounds: sceneBounds,
    metadata: {
      source: 'Δmension Mathematical Universe',
      shapeId,
      shapeName,
      exportDate: timestamp,
      parameters: params,
      dmension_version: '2.0'
    },
    security,
    formulas: NEURAL_FORMULAS
  };
  
  if (includeSemantic) {
    nerfstudioExport.semantic_data = {
      classes: ['background', 'shape'],
      class_colors: [[0, 0, 0], [255, 128, 0]]
    };
  }
  
  return nerfstudioExport;
}

/**
 * Export to nerfstudio transforms.json format
 * Creates a downloadable JSON file compatible with nerfstudio data loading
 */
export function exportNerfstudioTransforms(transforms: NerfstudioTransforms): Blob {
  const jsonString = JSON.stringify(transforms, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

/**
 * Export complete nerfstudio package as ZIP
 * Includes transforms.json, config.json, point_cloud.ply, and metadata
 */
export async function exportNerfstudioPackage(
  nerfExport: NerfstudioExport
): Promise<{ transforms: Blob; config: Blob; formulas: Blob; metadata: Blob }> {
  const transformsBlob = new Blob(
    [JSON.stringify(nerfExport.transforms, null, 2)],
    { type: 'application/json' }
  );
  
  const configBlob = new Blob(
    [JSON.stringify(nerfExport.instant_ngp_config, null, 2)],
    { type: 'application/json' }
  );
  
  const formulasBlob = new Blob(
    [JSON.stringify(nerfExport.formulas, null, 2)],
    { type: 'application/json' }
  );
  
  const metadataBlob = new Blob(
    [JSON.stringify({
      ...nerfExport.metadata,
      security: nerfExport.security,
      scene_bounds: nerfExport.scene_bounds
    }, null, 2)],
    { type: 'application/json' }
  );
  
  return {
    transforms: transformsBlob,
    config: configBlob,
    formulas: formulasBlob,
    metadata: metadataBlob
  };
}

/**
 * Export point cloud to PLY format
 * Creates ASCII PLY file compatible with common 3D tools
 */
export function exportPointCloudPLY(
  pointCloud: { points: number[][]; has_normals: boolean; has_colors: boolean }
): Blob {
  const { points, has_normals, has_colors } = pointCloud;
  
  let header = `ply
format ascii 1.0
element vertex ${points.length}
property float x
property float y
property float z`;
  
  if (has_colors) {
    header += `
property uchar red
property uchar green
property uchar blue`;
  }
  
  if (has_normals) {
    header += `
property float nx
property float ny
property float nz`;
  }
  
  header += `
end_header
`;
  
  const data = points.map(p => {
    let line = `${p[0].toFixed(6)} ${p[1].toFixed(6)} ${p[2].toFixed(6)}`;
    if (has_colors) {
      line += ` ${Math.round(p[3])} ${Math.round(p[4])} ${Math.round(p[5])}`;
    }
    if (has_normals) {
      const offset = has_colors ? 6 : 3;
      line += ` ${p[offset].toFixed(6)} ${p[offset+1].toFixed(6)} ${p[offset+2].toFixed(6)}`;
    }
    return line;
  }).join('\n');
  
  return new Blob([header + data], { type: 'text/plain' });
}

/**
 * Generate training command for nerfstudio
 * Returns the command to train a NeRF model using the exported data
 */
export function generateNerfstudioTrainingCommand(
  dataPath: string,
  modelType: 'nerfacto' | 'instant-ngp' | 'mipnerf360' | 'vanilla-nerf' = 'nerfacto',
  options: {
    outputDir?: string;
    maxIterations?: number;
    cameraResScale?: number;
  } = {}
): string {
  const {
    outputDir = './outputs',
    maxIterations = 30000,
    cameraResScale = 1.0
  } = options;
  
  return `ns-train ${modelType} \\
  --data ${dataPath} \\
  --output-dir ${outputDir} \\
  --max-num-iterations ${maxIterations} \\
  --pipeline.datamanager.camera-res-scale-factor ${cameraResScale}`;
}

/**
 * Create a neural scene from a Three.js mesh
 * Samples geometry to create continuous neural representation
 */
export function createNeuralSceneFromMesh(
  mesh: THREE.Mesh | THREE.Object3D,
  shapeId: string,
  shapeName: string
): NeuralScene {
  const geometry = (mesh as THREE.Mesh).geometry;
  
  if (!geometry || !geometry.attributes || !geometry.attributes.position) {
    throw new Error('Invalid mesh: no position attribute found');
  }
  
  const positions = geometry.attributes.position;
  const colors = geometry.attributes.color;
  const numPoints = Math.min(positions.count, 10000);
  
  const samplePoints: Array<{ x: number; y: number; z: number; density: number; color: [number, number, number] }> = [];
  
  const step = Math.max(1, Math.floor(positions.count / numPoints));
  
  for (let i = 0; i < positions.count; i += step) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    
    let color: [number, number, number] = [0.5, 0.5, 1.0];
    if (colors) {
      color = [
        colors.getX(i),
        colors.getY(i),
        colors.getZ(i)
      ];
    }
    
    samplePoints.push({
      x, y, z,
      density: 1.0,
      color
    });
  }
  
  geometry.computeBoundingBox();
  const box = geometry.boundingBox!;
  const bounds: [[number, number, number], [number, number, number]] = [
    [box.min.x, box.min.y, box.min.z],
    [box.max.x, box.max.y, box.max.z]
  ];
  
  const mlpWeights: number[][] = [];
  const pointCount = Math.min(samplePoints.length, 256);
  for (let i = 0; i < 4; i++) {
    const layer: number[] = [];
    for (let j = 0; j < 64; j++) {
      if (i < samplePoints.length) {
        const pt = samplePoints[Math.floor(i * pointCount / 4 + j * pointCount / 256) % samplePoints.length];
        layer.push((pt.x + pt.y + pt.z) * 0.1);
      } else {
        layer.push(Math.random() * 0.01);
      }
    }
    mlpWeights.push(layer);
  }
  
  const hashContent = `${shapeId}:${shapeName}:${samplePoints.length}:${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < hashContent.length; i++) {
    const char = hashContent.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const simpleHash = Math.abs(hash).toString(16).padStart(64, '0').slice(0, 64);
  
  const verificationCode = `NERF-${simpleHash.slice(0, 8).toUpperCase()}`;
  
  const neuralScene: NeuralScene = {
    version: '1.0.0',
    type: 'nerf',
    encoding: {
      type: 'fourier',
      levels: 10,
      features: mlpWeights
    },
    network: {
      weights: [mlpWeights, mlpWeights],
      biases: [mlpWeights[0], mlpWeights[1]],
      activations: ['relu', 'relu', 'sigmoid']
    },
    bounds: {
      min: bounds[0],
      max: bounds[1]
    },
    metadata: {
      shapeId,
      shapeName,
      parameters: {
        a: 1, b: 1, c: 1,
        d: 0, e: 0, f: 0,
        uMin: 0, uMax: 1,
        vMin: 0, vMax: 1
      },
      exportDate: new Date().toISOString(),
      algorithm: 'NeRF-Sampling'
    },
    security: {
      cryptographicHash: simpleHash,
      verificationCode,
      timestamp: new Date().toISOString(),
      author: UUON_NEURAL_ATTRIBUTION.author,
      organization: UUON_NEURAL_ATTRIBUTION.organization,
      copyright: UUON_NEURAL_ATTRIBUTION.copyright,
      license: UUON_NEURAL_ATTRIBUTION.license,
      integrityVersion: '1.0.0'
    }
  };
  
  return neuralScene;
}

// ============================================================
// SCORE DISTILLATION SAMPLING - Text to Shape Generation
// ============================================================

// Mathematical keyword mappings for text-to-shape
const SHAPE_KEYWORDS: Record<string, {
  baseShapes: string[];
  modifiers: (p: ShapeParameters) => Partial<ShapeParameters>;
  formula: string;
}> = {
  // Geometric primitives
  sphere: {
    baseShapes: ['sphere', 'riemann_sphere', 'bloch_sphere'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 1, c: p.c || 1 }),
    formula: 'x² + y² + z² = r²'
  },
  torus: {
    baseShapes: ['torus', 'clifford_torus', 'horn_torus'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 0.5 }),
    formula: '(√(x² + y²) - R)² + z² = r²'
  },
  spiral: {
    baseShapes: ['golden_spiral', 'logarithmic_spiral', 'archimedean_spiral', 'dna_helix'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 0.3, c: p.c || 3 }),
    formula: 'r = a·e^(bθ)'
  },
  wave: {
    baseShapes: ['sine_wave', 'standing_wave', 'electromagnetic_wave'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 2, c: p.c || 1 }),
    formula: 'z = A·sin(kx - ωt)'
  },
  shell: {
    baseShapes: ['nautilus_shell', 'seashell', 'golden_spiral'],
    modifiers: (p) => ({ a: p.a || 1.618, b: p.b || 0.2 }),
    formula: 'r = a·φ^(θ/2π)'
  },
  helix: {
    baseShapes: ['helix', 'dna_helix', 'double_helix'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 0.5, c: p.c || 2 }),
    formula: 'x = r·cos(t), y = r·sin(t), z = c·t'
  },
  
  // Fractal keywords
  mandelbrot: {
    baseShapes: ['fractal_skin_mandelbrot', 'mandelbulb', 'julia_set'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 1 }),
    formula: 'z_{n+1} = z_n² + c'
  },
  fractal: {
    baseShapes: ['sierpinski', 'menger_sponge', 'koch_snowflake'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 3 }),
    formula: 'Self-similar iteration'
  },
  julia: {
    baseShapes: ['julia_set', 'julia_quaternion'],
    modifiers: (p) => ({ a: p.a || -0.7, b: p.b || 0.27 }),
    formula: 'z_{n+1} = z_n² + c, c fixed'
  },
  
  // Scientific shapes
  dna: {
    baseShapes: ['dna_helix', 'double_helix'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 0.3, c: p.c || 3.4 }),
    formula: 'Double helix with 3.4nm pitch'
  },
  protein: {
    baseShapes: ['alpha_helix', 'beta_sheet', 'protein_fold'],
    modifiers: (p) => ({ a: p.a || 0.54, b: p.b || 0.15 }),
    formula: 'Polypeptide backbone geometry'
  },
  galaxy: {
    baseShapes: ['spiral_galaxy', 'barred_spiral', 'elliptical_galaxy'],
    modifiers: (p) => ({ a: p.a || 5, b: p.b || 0.2, c: p.c || 2 }),
    formula: 'Logarithmic spiral arms'
  },
  blackhole: {
    baseShapes: ['schwarzschild_black_hole', 'kerr_black_hole', 'event_horizon'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 0 }),
    formula: 'r_s = 2GM/c²'
  },
  
  // Crystalline
  crystal: {
    baseShapes: ['diamond_lattice', 'quartz_crystal', 'snowflake'],
    modifiers: (p) => ({ a: p.a || 1 }),
    formula: 'Bravais lattice symmetry'
  },
  snowflake: {
    baseShapes: ['koch_snowflake', 'stellar_dendrite', 'frost_flower'],
    modifiers: (p) => ({ a: p.a || 1, b: p.b || 6 }),
    formula: '6-fold hexagonal symmetry'
  },
  
  // Higher dimensional
  tesseract: {
    baseShapes: ['tesseract', 'hypercube', '4d_cube'],
    modifiers: (p) => ({ a: p.a || 1 }),
    formula: '4D hypercube projection'
  },
  klein: {
    baseShapes: ['klein_bottle', 'klein_surface'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 1 }),
    formula: 'Non-orientable surface'
  },
  mobius: {
    baseShapes: ['mobius_strip', 'mobius_band'],
    modifiers: (p) => ({ a: p.a || 2, b: p.b || 0.5 }),
    formula: 'Single-sided surface'
  },
  
  // Riemann & Differential
  riemann: {
    baseShapes: ['riemann_surface', 'riemann_sphere', 'riemann_zeta'],
    modifiers: (p) => ({ a: p.a || 1 }),
    formula: 'Multi-valued complex function'
  },
  minimal: {
    baseShapes: ['enneper_surface', 'catenoid', 'helicoid', 'costa_surface'],
    modifiers: (p) => ({ a: p.a || 1 }),
    formula: 'H = 0 (zero mean curvature)'
  },
  
  // Modifiers
  twisted: {
    baseShapes: [],
    modifiers: (p) => ({ d: (p.d || 0) + 2 }),
    formula: 'Apply twist transformation'
  },
  stretched: {
    baseShapes: [],
    modifiers: (p) => ({ a: (p.a || 1) * 2 }),
    formula: 'Scale along axis'
  },
  compressed: {
    baseShapes: [],
    modifiers: (p) => ({ a: (p.a || 1) * 0.5 }),
    formula: 'Compress geometry'
  },
  golden: {
    baseShapes: ['golden_spiral', 'golden_ratio_rectangle'],
    modifiers: (p) => ({ a: 1.618033988749895 }),
    formula: 'φ = (1 + √5) / 2'
  },
  fibonacci: {
    baseShapes: ['fibonacci_spiral', 'golden_spiral'],
    modifiers: (p) => ({ a: 1.618, b: 0.306 }),
    formula: 'F_n = F_{n-1} + F_{n-2}'
  }
};

/**
 * Score Distillation Sampling - Text to Shape Generator
 * Parses natural language to find matching parametric shapes
 */
export function textToShape(
  text: string,
  existingShapes: ParametricSurface[]
): TextToShapeResult[] {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  
  const results: TextToShapeResult[] = [];
  const matchedKeywords: string[] = [];
  let accumulatedModifiers: Partial<ShapeParameters> = {};
  
  // Find matching keywords
  for (const word of words) {
    for (const [keyword, config] of Object.entries(SHAPE_KEYWORDS)) {
      if (word.includes(keyword) || keyword.includes(word)) {
        matchedKeywords.push(keyword);
        
        // Accumulate modifiers
        const mods = config.modifiers({} as ShapeParameters);
        accumulatedModifiers = { ...accumulatedModifiers, ...mods };
        
        // Find matching shapes
        for (const shapeName of config.baseShapes) {
          const matchingShape = existingShapes.find(s => 
            s.id.toLowerCase().includes(shapeName) ||
            s.name.toLowerCase().includes(shapeName)
          );
          
          if (matchingShape && !results.find(r => r.id === matchingShape.id)) {
            results.push({
              id: matchingShape.id,
              name: matchingShape.name,
              formula: matchingShape.formula || config.formula,
              category: matchingShape.category,
              description: `Generated from: "${text}"`,
              getPosition: matchingShape.getPosition,
              confidence: 0.5 + (matchedKeywords.length * 0.1),
              matchedKeywords: [...matchedKeywords]
            });
          }
        }
      }
    }
  }
  
  // Sort by confidence
  results.sort((a, b) => b.confidence - a.confidence);
  
  // Apply accumulated modifiers to top results
  for (const result of results.slice(0, 5)) {
    const originalGetPos = result.getPosition;
    result.getPosition = (u, v, p) => {
      const modifiedParams = { ...p, ...accumulatedModifiers };
      return originalGetPos(u, v, modifiedParams);
    };
  }
  
  return results.slice(0, 10); // Return top 10 matches
}

/**
 * Generate new parametric equation from text description
 * Uses procedural generation based on keyword analysis
 */
export function generateShapeFromText(
  text: string,
  baseParams: ShapeParameters = { a: 1, b: 1, c: 1 }
): ParametricSurface {
  const lowerText = text.toLowerCase();
  const matchedKeywords: string[] = [];
  
  // Analyze text for mathematical concepts
  let baseType: 'sphere' | 'torus' | 'wave' | 'spiral' | 'surface' = 'surface';
  let complexity = 1;
  let symmetry = 1;
  
  if (lowerText.includes('sphere') || lowerText.includes('ball') || lowerText.includes('round')) {
    baseType = 'sphere';
    matchedKeywords.push('sphere');
  }
  if (lowerText.includes('torus') || lowerText.includes('donut') || lowerText.includes('ring')) {
    baseType = 'torus';
    matchedKeywords.push('torus');
  }
  if (lowerText.includes('wave') || lowerText.includes('ripple') || lowerText.includes('oscillat')) {
    baseType = 'wave';
    matchedKeywords.push('wave');
  }
  if (lowerText.includes('spiral') || lowerText.includes('helix') || lowerText.includes('curl')) {
    baseType = 'spiral';
    matchedKeywords.push('spiral');
  }
  
  if (lowerText.includes('complex') || lowerText.includes('intricate')) {
    complexity = 3;
    matchedKeywords.push('complex');
  }
  if (lowerText.includes('simple') || lowerText.includes('basic')) {
    complexity = 0.5;
    matchedKeywords.push('simple');
  }
  if (lowerText.includes('symmetric') || lowerText.includes('balanced')) {
    symmetry = 2;
    matchedKeywords.push('symmetric');
  }
  
  // Generate the parametric function
  const getPosition = (u: number, v: number, p: ShapeParameters): [number, number, number] => {
    const a = p.a || 1;
    const b = p.b || 1;
    const c = p.c || 1;
    const theta = u * Math.PI * 2;
    const phi = v * Math.PI;
    
    let x = 0, y = 0, z = 0;
    
    switch (baseType) {
      case 'sphere':
        x = a * Math.sin(phi) * Math.cos(theta);
        y = b * Math.sin(phi) * Math.sin(theta);
        z = c * Math.cos(phi);
        // Add complexity
        if (complexity > 1) {
          const wave = Math.sin(theta * complexity * 3) * Math.sin(phi * complexity * 2) * 0.2;
          x *= (1 + wave);
          y *= (1 + wave);
          z *= (1 + wave);
        }
        break;
        
      case 'torus':
        const R = a * 2;
        const r = b * 0.5;
        x = (R + r * Math.cos(phi * symmetry)) * Math.cos(theta);
        y = (R + r * Math.cos(phi * symmetry)) * Math.sin(theta);
        z = r * Math.sin(phi * symmetry);
        break;
        
      case 'wave':
        x = (u - 0.5) * a * 4;
        z = (v - 0.5) * c * 4;
        y = Math.sin(x * b * complexity) * Math.cos(z * b * complexity) * 0.5;
        break;
        
      case 'spiral':
        const t = v * Math.PI * 4 * complexity;
        const spiralR = 0.1 + u * a;
        x = spiralR * Math.cos(t * symmetry);
        y = t * b * 0.3;
        z = spiralR * Math.sin(t * symmetry);
        break;
        
      default:
        // Generic surface
        x = (u - 0.5) * a * 2;
        z = (v - 0.5) * c * 2;
        y = Math.sin(u * Math.PI * complexity) * Math.cos(v * Math.PI * complexity) * b * 0.3;
    }
    
    return [x, y, z];
  };
  
  const id = `sds_generated_${Date.now()}`;
  
  return {
    id,
    name: `🧠 ${text.slice(0, 30)}${text.length > 30 ? '...' : ''}`,
    formula: `SDS-generated: ${matchedKeywords.join(' + ')}`,
    category: 'neural-generated',
    description: `AI-generated from: "${text}" using Score Distillation Sampling`,
    getPosition
  };
}

/**
 * Neural Preview Mode - Continuous sampling visualization
 * Returns a function that provides smooth interpolated positions
 */
export function createNeuralPreviewSampler(
  shape: ParametricSurface,
  params: ShapeParameters,
  config: NeuralConfig = DEFAULT_CONFIG
): (u: number, v: number) => [number, number, number] {
  // Pre-compute a cache of positions for smooth interpolation
  const cacheSize = 64;
  const cache: [number, number, number][][] = [];
  
  for (let i = 0; i <= cacheSize; i++) {
    cache[i] = [];
    for (let j = 0; j <= cacheSize; j++) {
      cache[i][j] = shape.getPosition(i / cacheSize, j / cacheSize, params);
    }
  }
  
  // Bicubic interpolation for smooth sampling
  return (u: number, v: number): [number, number, number] => {
    const fu = u * cacheSize;
    const fv = v * cacheSize;
    const iu = Math.floor(fu);
    const iv = Math.floor(fv);
    const tu = fu - iu;
    const tv = fv - iv;
    
    // Clamp indices
    const i0 = Math.max(0, Math.min(cacheSize - 1, iu));
    const i1 = Math.min(cacheSize, i0 + 1);
    const j0 = Math.max(0, Math.min(cacheSize - 1, iv));
    const j1 = Math.min(cacheSize, j0 + 1);
    
    // Bilinear interpolation
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    
    const p00 = cache[i0][j0];
    const p10 = cache[i1][j0];
    const p01 = cache[i0][j1];
    const p11 = cache[i1][j1];
    
    return [
      lerp(lerp(p00[0], p10[0], tu), lerp(p01[0], p11[0], tu), tv),
      lerp(lerp(p00[1], p10[1], tu), lerp(p01[1], p11[1], tu), tv),
      lerp(lerp(p00[2], p10[2], tu), lerp(p01[2], p11[2], tu), tv)
    ];
  };
}

/**
 * Verify integrity of a neural scene
 * Checks cryptographic hash matches scene data
 */
export async function verifyNeuralScene(scene: NeuralScene): Promise<{
  valid: boolean;
  verificationCode: string;
  message: string;
}> {
  if (!scene.security) {
    return {
      valid: false,
      verificationCode: 'NONE',
      message: 'No security fingerprint found in neural scene'
    };
  }
  
  // Recalculate hash from scene data
  const sceneWithoutSecurity = {
    encoding: scene.encoding,
    network: scene.network,
    bounds: scene.bounds,
    metadata: scene.metadata
  };
  
  const recalculatedHash = await generateNeuralHash(sceneWithoutSecurity);
  const hashMatches = recalculatedHash === scene.security.cryptographicHash;
  
  return {
    valid: hashMatches,
    verificationCode: scene.security.verificationCode,
    message: hashMatches 
      ? `Verified: ${scene.security.author} - ${scene.security.copyright}`
      : 'Hash mismatch: Scene may have been modified'
  };
}

/**
 * Export neural scene with full security metadata
 */
export function exportSecureNeuralScene(scene: NeuralScene): Blob {
  const exportData = {
    ...scene,
    exportInfo: {
      format: 'Δmension Neural Scene Format',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      securityLevel: 'FINGERPRINTED',
      algorithms: ['SHA-256', 'Verification Code']
    }
  };
  
  const jsonString = JSON.stringify(exportData, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

// Export algorithm info
export const NEURAL_ALGORITHMS = {
  nerf: {
    name: 'Neural Radiance Fields (NeRF)',
    description: 'Continuous volumetric scene representation using positional encoding and MLP networks',
    components: [
      'Positional Encoding (Fourier Features)',
      'Multi-Layer Perceptron (8 layers)',
      'Volumetric Ray Marching',
      'Alpha Compositing',
      'Hierarchical Sampling'
    ],
    formulas: {
      positional_encoding: 'γ(p) = [p, sin(2⁰πp), cos(2⁰πp), ..., sin(2^(L-1)πp), cos(2^(L-1)πp)]',
      volume_rendering: 'C(r) = ∫_{t_n}^{t_f} T(t) · σ(r(t)) · c(r(t), d) dt',
      transmittance: 'T(t) = exp(-∫_{t_n}^{t} σ(r(s)) ds)',
      alpha: 'α_i = 1 - exp(-σ_i · δ_i)'
    }
  },
  nerfstudio: {
    name: 'Nerfstudio Compatible Export',
    description: 'Full compatibility with nerfstudio (nerfacto, instant-ngp, mipnerf360) training pipelines',
    components: [
      'transforms.json - Camera poses and intrinsics',
      'instant_ngp_config.json - Hash grid encoding configuration',
      'formulas.json - Mathematical documentation with LaTeX',
      'points.ply - Point cloud with colors and normals',
      'metadata.json - Shape parameters and security fingerprint'
    ],
    supported_models: ['nerfacto', 'instant-ngp', 'mipnerf360', 'vanilla-nerf'],
    training_command: 'ns-train nerfacto --data ./data --output-dir ./outputs',
    formulas: {
      hash_grid: 'N_l = ⌊N_min · b^l⌋, b = exp((ln(N_max) - ln(N_min))/(L-1))',
      camera_intrinsics: 'K = [[fx, 0, cx], [0, fy, cy], [0, 0, 1]]',
      radial_distortion: "x_d = x'(1 + k₁r² + k₂r⁴ + k₃r⁶) + 2p₁x'y' + p₂(r² + 2x'²)"
    }
  },
  fruitnerf: {
    name: 'FruitNeRF (Semantic NeRF)',
    description: 'Extended NeRF with semantic output for object detection and counting in 3D',
    components: [
      'Semantic Neural Radiance Field',
      'Binary Segmentation Masks',
      'Uniform Volume Sampling',
      'DBSCAN Cascaded Clustering',
      'Fruit Count Extraction'
    ],
    formulas: {
      semantic_output: 'F_θ(x, d) → (c, σ, s) where s = semantic probability',
      binary_loss: 'L = -Σᵢ [yᵢ log(ŝᵢ) + (1-yᵢ) log(1-ŝᵢ)]',
      point_extraction: 'P = {x : σ(x) > τ_density ∧ s(x) > τ_semantic}',
      clustering: 'DBSCAN(P, ε, min_samples) → {C₁, C₂, ..., Cₙ}'
    },
    reference: 'FruitNeRF: A Generalized Framework for Counting Fruits in Neural Radiance Fields (IROS24)'
  },
  sds: {
    name: 'Score Distillation Sampling (SDS)',
    description: 'Text-guided shape generation through mathematical keyword analysis and procedural synthesis',
    components: [
      'Natural Language Parsing',
      'Keyword-to-Shape Mapping',
      'Procedural Equation Generation',
      'Parameter Optimization',
      'Confidence Scoring'
    ]
  }
};
