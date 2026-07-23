/**
 * UUON-Mesh Engine - Noise-Reactive Parametric 3D Geometry System
 * **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
 * **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
 * 
 * TECHNICAL DOCUMENTATION:
 * UUON-Mesh is a noise-reactive, parametric 3D geometry engine.
 * It constructs true mesh structures using vertex/edge/surface generation driven by 
 * user parameters A, B, and C. Noise is applied directly to geometric positions, 
 * enabling dynamic deformation that produces complex, emergent forms.
 * 
 * Unlike traditional texture-based systems, UUON-Mesh reveals structural patterns 
 * within randomness, highlighting symmetry, curvature flow, harmonic interference, 
 * and natural geometric tendencies.
 * 
 * The engine supports continuous morphing, harmonic shaping, and multi-parameter 
 * modulation, enabling generation of shapes and patterns beyond typical visual perception.
 * 
 * Optimized for: generative art, scientific visualization, geometric exploration, 
 * and advanced spatial pattern discovery.
 */

import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// TON Harmonic Constants
const TON_A = 1.202;  // Apéry's constant reference
const TON_B = 1.618;  // Golden ratio φ
const TON_C = 1.256;  // Harmonic scaling factor

// Permutation table for gradient noise
const PERM = (() => {
  const p = [151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,
    8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,
    57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,
    65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,
    164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,
    207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,
    221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,
    218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,
    107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,
    205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  const perm = new Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
})();

// 3D gradient vectors (12 directions)
const GRAD3 = [
  [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
  [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
  [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
];

// Proper 3D Simplex noise implementation
function simplexNoise3D(x: number, y: number, z: number, seed: number = 0): number {
  // Apply seed offset
  x += seed * 17.3;
  y += seed * 31.7;
  z += seed * 47.1;
  
  const F3 = 1.0 / 3.0;
  const G3 = 1.0 / 6.0;
  
  // Skew input space
  const s = (x + y + z) * F3;
  const i = Math.floor(x + s);
  const j = Math.floor(y + s);
  const k = Math.floor(z + s);
  
  // Unskew cell origin
  const t = (i + j + k) * G3;
  const X0 = i - t;
  const Y0 = j - t;
  const Z0 = k - t;
  
  // Distances from cell origin
  const x0 = x - X0;
  const y0 = y - Y0;
  const z0 = z - Z0;
  
  // Determine simplex traversal order
  let i1: number, j1: number, k1: number;
  let i2: number, j2: number, k2: number;
  
  if (x0 >= y0) {
    if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
    else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
    else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
  } else {
    if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
    else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
    else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
  }
  
  // Offsets for corners 1-3
  const x1 = x0 - i1 + G3;
  const y1 = y0 - j1 + G3;
  const z1 = z0 - k1 + G3;
  const x2 = x0 - i2 + 2.0 * G3;
  const y2 = y0 - j2 + 2.0 * G3;
  const z2 = z0 - k2 + 2.0 * G3;
  const x3 = x0 - 1.0 + 3.0 * G3;
  const y3 = y0 - 1.0 + 3.0 * G3;
  const z3 = z0 - 1.0 + 3.0 * G3;
  
  // Hash coordinates for gradient indices
  const ii = i & 255;
  const jj = j & 255;
  const kk = k & 255;
  
  const gi0 = PERM[ii + PERM[jj + PERM[kk]]] % 12;
  const gi1 = PERM[ii + i1 + PERM[jj + j1 + PERM[kk + k1]]] % 12;
  const gi2 = PERM[ii + i2 + PERM[jj + j2 + PERM[kk + k2]]] % 12;
  const gi3 = PERM[ii + 1 + PERM[jj + 1 + PERM[kk + 1]]] % 12;
  
  // Contribution from each corner
  let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
  
  let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
  if (t0 >= 0) {
    t0 *= t0;
    n0 = t0 * t0 * (GRAD3[gi0][0]*x0 + GRAD3[gi0][1]*y0 + GRAD3[gi0][2]*z0);
  }
  
  let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
  if (t1 >= 0) {
    t1 *= t1;
    n1 = t1 * t1 * (GRAD3[gi1][0]*x1 + GRAD3[gi1][1]*y1 + GRAD3[gi1][2]*z1);
  }
  
  let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
  if (t2 >= 0) {
    t2 *= t2;
    n2 = t2 * t2 * (GRAD3[gi2][0]*x2 + GRAD3[gi2][1]*y2 + GRAD3[gi2][2]*z2);
  }
  
  let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
  if (t3 >= 0) {
    t3 *= t3;
    n3 = t3 * t3 * (GRAD3[gi3][0]*x3 + GRAD3[gi3][1]*y3 + GRAD3[gi3][2]*z3);
  }
  
  // Sum contributions and scale to [-1, 1]
  return 32.0 * (n0 + n1 + n2 + n3);
}

// Fractal Brownian Motion for layered noise
function fbm(x: number, y: number, z: number, octaves: number = 4, persistence: number = 0.5): number {
  let total = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    total += simplexNoise3D(x * frequency, y * frequency, z * frequency, i) * amplitude;
    maxValue += amplitude;
    amplitude *= persistence;
    frequency *= 2;
  }
  
  return total / maxValue;
}

// Harmonic wave interference pattern
function harmonicInterference(u: number, v: number, A: number, B: number, C: number): number {
  const h1 = Math.sin(u * A * Math.PI) * Math.cos(v * B * Math.PI);
  const h2 = Math.sin(u * B * Math.PI + v * A * Math.PI);
  const h3 = Math.cos((u + v) * C * Math.PI);
  return (h1 + h2 + h3) / 3;
}

// Curvature flow function
function curvatureFlow(u: number, v: number, intensity: number): [number, number, number] {
  const curl_x = Math.sin(v * Math.PI * 2) * intensity;
  const curl_y = Math.cos(u * Math.PI * 2) * intensity;
  const curl_z = Math.sin((u + v) * Math.PI) * intensity;
  return [curl_x, curl_y, curl_z];
}

/**
 * UUON-Mesh Shapes Collection
 * Each shape demonstrates noise-reactive parametric geometry with A/B/C modulation
 */
export const UUON_MESH_SHAPES: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // EMERGENT NOISE FIELD - Pure noise-reactive mesh structure
  // ============================================================================
  uuon_emergent_noise_field: {
    name: "🌊 UUON Emergent Noise Field",
    description: "Pure noise-reactive mesh revealing hidden patterns within randomness",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 5;
      const noiseIntensity = params.e ?? 1;
      
      // Base grid coordinates
      const baseX = (u - 0.5) * scale * 2;
      const baseY = (v - 0.5) * scale * 2;
      
      // Multi-octave noise displacement
      const noiseX = fbm(u * A, v * B, 0, 4) * noiseIntensity;
      const noiseY = fbm(u * B, v * A, 1, 4) * noiseIntensity;
      const noiseZ = fbm(u * C, v * C, 2, 5) * noiseIntensity * 2;
      
      // Apply A/B/C morphological controls
      const x = baseX + noiseX * C;
      const y = baseY + noiseY * C;
      const z = noiseZ * A * B;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 5, e: 1,
      uSegments: 128, vSegments: 128
    })
  },

  // ============================================================================
  // HARMONIC INTERFERENCE SHELL - Wave pattern emergence
  // ============================================================================
  uuon_harmonic_shell: {
    name: "🔔 UUON Harmonic Interference Shell",
    description: "Standing wave patterns create emergent structural forms",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const radius = params.d ?? 4;
      const waveDepth = params.e ?? 0.5;
      
      // Spherical base with harmonic modulation
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Harmonic interference creates standing wave patterns
      const harmonic = harmonicInterference(u, v, A, B, C);
      const noise = fbm(u * 3, v * 3, harmonic, 3) * 0.3;
      
      // Radius modulated by harmonics + noise
      const r = radius * (1 + waveDepth * harmonic + noise * C * 0.1);
      
      // Spherical coordinates
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 0.5,
      uSegments: 96, vSegments: 64
    })
  },

  // ============================================================================
  // CURVATURE FLOW MANIFOLD - Geometric flow patterns
  // ============================================================================
  uuon_curvature_flow: {
    name: "🌀 UUON Curvature Flow Manifold",
    description: "Reveals natural geometric tendencies through curvature dynamics",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const flowIntensity = params.e ?? 1;
      
      // Torus base for flow visualization
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      const R = scale;
      const r = scale * 0.4;
      
      // Base torus position
      let x = (R + r * Math.cos(phi)) * Math.cos(theta);
      let y = (R + r * Math.cos(phi)) * Math.sin(theta);
      let z = r * Math.sin(phi);
      
      // Apply curvature flow displacement
      const [flowX, flowY, flowZ] = curvatureFlow(u, v, flowIntensity * A);
      
      // Add noise-reactive deformation
      const noise = fbm(x * 0.2, y * 0.2, z * 0.2, 4) * B;
      
      x += flowX + noise * C * 0.3;
      y += flowY + noise * C * 0.3;
      z += flowZ + noise * C * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 1,
      uSegments: 96, vSegments: 48
    })
  },

  // ============================================================================
  // SYMMETRY EMERGENCE LATTICE - Hidden symmetry revelation
  // ============================================================================
  uuon_symmetry_lattice: {
    name: "💠 UUON Symmetry Emergence Lattice",
    description: "Noise-modulated lattice revealing hidden symmetry patterns",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 5;
      const symmetryOrder = Math.max(3, Math.floor(params.e ?? 6));
      
      // Create symmetry axes
      const angle = u * Math.PI * 2;
      const radialDist = v;
      
      // Apply rotational symmetry
      const symAngle = Math.floor(angle / (Math.PI * 2 / symmetryOrder)) * (Math.PI * 2 / symmetryOrder);
      const localAngle = angle - symAngle;
      
      // Base radial position with A/B modulation
      const baseRadius = scale * radialDist * (1 + 0.2 * Math.sin(localAngle * symmetryOrder * A));
      
      // Noise displacement respecting symmetry
      const symmetricNoise = fbm(
        Math.cos(symAngle) * radialDist,
        Math.sin(symAngle) * radialDist,
        radialDist * B, 3
      ) * C;
      
      const x = baseRadius * Math.cos(angle);
      const y = baseRadius * Math.sin(angle);
      const z = symmetricNoise * scale * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 5, e: 6,
      uSegments: 128, vSegments: 64
    })
  },

  // ============================================================================
  // ORGANIC EMERGENCE SURFACE - Beyond-perception organic forms
  // ============================================================================
  uuon_organic_emergence: {
    name: "🧬 UUON Organic Emergence Surface",
    description: "Emergent organic structures from noise-reactive geometry",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const organicDepth = params.e ?? 1;
      
      // Spherical base
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Multiple noise layers for organic complexity
      const noise1 = fbm(u * 2 * A, v * 2 * B, 0, 4);
      const noise2 = fbm(u * 4 * B, v * 4 * A, noise1, 3);
      const noise3 = fbm(noise1, noise2, u + v, 2);
      
      // Organic modulation
      const organicFactor = 1 + organicDepth * (
        0.3 * noise1 + 
        0.2 * noise2 + 
        0.1 * noise3
      ) * C;
      
      const r = scale * organicFactor;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 1,
      uSegments: 96, vSegments: 64
    })
  },

  // ============================================================================
  // INTERFERENCE PATTERN MEMBRANE - Wave superposition visualization
  // ============================================================================
  uuon_interference_membrane: {
    name: "〰️ UUON Interference Pattern Membrane",
    description: "Multiple wave sources creating interference pattern geometry",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 6;
      const waveSources = Math.max(2, Math.floor(params.e ?? 4));
      
      // Base grid
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      // Multiple wave sources
      let z = 0;
      for (let i = 0; i < waveSources; i++) {
        const sourceAngle = (i / waveSources) * Math.PI * 2;
        const sourceX = Math.cos(sourceAngle) * scale * 0.3;
        const sourceY = Math.sin(sourceAngle) * scale * 0.3;
        
        const dist = Math.sqrt((x - sourceX) ** 2 + (y - sourceY) ** 2);
        const wave = Math.sin(dist * A * 2 + i * B);
        z += wave / waveSources;
      }
      
      // Add noise-reactive detail
      const noise = fbm(x * 0.3, y * 0.3, z, 3) * C * 0.3;
      z = z * C + noise;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 6, e: 4,
      uSegments: 128, vSegments: 128
    })
  },

  // ============================================================================
  // MORPHOLOGICAL ATTRACTOR - Strange attractor-like emergent form
  // ============================================================================
  uuon_morphological_attractor: {
    name: "🎯 UUON Morphological Attractor",
    description: "Strange attractor-like patterns from noise field dynamics",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 3;
      const iterations = params.e ?? 5;
      
      // Initial position from UV
      let x = (u - 0.5) * scale;
      let y = (v - 0.5) * scale;
      let z = 0;
      
      // Attractor-like iteration with noise perturbation
      for (let i = 0; i < iterations; i++) {
        const nx = Math.sin(y * A + i) * B + fbm(x, y, i, 2) * 0.5;
        const ny = Math.cos(x * B + i) * A + fbm(y, x, i, 2) * 0.5;
        const nz = Math.sin(x * y * C) + fbm(x, z, i, 2) * 0.3;
        
        x = x * 0.7 + nx * 0.3;
        y = y * 0.7 + ny * 0.3;
        z = z * 0.7 + nz * 0.3;
      }
      
      return [x * scale, y * scale, z * scale * C];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 3, e: 5,
      uSegments: 128, vSegments: 128
    })
  },

  // ============================================================================
  // DIMENSION FOLD SURFACE - 4D projection with noise folding
  // ============================================================================
  uuon_dimension_fold: {
    name: "📐 UUON Dimension Fold Surface",
    description: "Higher-dimensional folding revealed through noise modulation",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const foldDepth = params.e ?? 1;
      
      // 4D coordinates
      const w = Math.sin(u * Math.PI * 2 * A);
      const theta = v * Math.PI * 2;
      
      // 4D torus-like structure
      const R1 = scale;
      const R2 = scale * 0.5;
      const R3 = scale * 0.25;
      
      // Project from 4D with noise-reactive folding
      const noise4D = fbm(u * 2, v * 2, w, 4) * foldDepth;
      
      const x = (R1 + (R2 + R3 * Math.cos(theta * B)) * Math.cos(w * Math.PI)) * Math.cos(u * Math.PI * 2);
      const y = (R1 + (R2 + R3 * Math.cos(theta * B)) * Math.cos(w * Math.PI)) * Math.sin(u * Math.PI * 2);
      const z = (R2 + R3 * Math.cos(theta * B)) * Math.sin(w * Math.PI) + noise4D * C;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 1,
      uSegments: 96, vSegments: 64
    })
  },

  // ============================================================================
  // FRACTAL NOISE BLOOM - Self-similar noise patterns
  // ============================================================================
  uuon_fractal_bloom: {
    name: "🌸 UUON Fractal Noise Bloom",
    description: "Self-similar fractal patterns emerging from layered noise",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const bloomLayers = Math.max(2, Math.floor(params.e ?? 4));
      
      // Radial bloom structure
      const theta = u * Math.PI * 2;
      const r = v * scale;
      
      // Self-similar noise at multiple scales
      let displacement = 0;
      for (let i = 0; i < bloomLayers; i++) {
        const freq = Math.pow(2, i) * A;
        const amp = 1 / Math.pow(2, i * B * 0.5);
        displacement += fbm(
          Math.cos(theta) * r * freq * 0.1,
          Math.sin(theta) * r * freq * 0.1,
          i * C, 3
        ) * amp;
      }
      
      const x = r * Math.cos(theta) * (1 + displacement * 0.2);
      const y = r * Math.sin(theta) * (1 + displacement * 0.2);
      const z = displacement * C;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 4,
      uSegments: 128, vSegments: 64
    })
  },

  // ============================================================================
  // PERCEPTUAL THRESHOLD MESH - Beyond visual perception structures
  // ============================================================================
  uuon_perceptual_threshold: {
    name: "👁️ UUON Perceptual Threshold Mesh",
    description: "Geometric structures at the edge of visual perception",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const thresholdIntensity = params.e ?? 1;
      
      // Klein bottle-like base for non-orientable perception
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      // Non-orientable surface with threshold noise
      const r = scale * (1 - Math.cos(phi) / 2);
      const baseX = r * Math.cos(theta);
      const baseY = r * Math.sin(theta);
      const baseZ = scale * Math.sin(phi) * (1 + Math.cos(theta) / 2);
      
      // Threshold noise - reveals hidden structure
      const threshold = 0.5;
      const rawNoise = fbm(u * A * 3, v * B * 3, theta * C, 5);
      const thresholdNoise = rawNoise > threshold ? (rawNoise - threshold) * 2 : 0;
      
      // Apply threshold modulation
      const x = baseX + thresholdNoise * thresholdIntensity * Math.cos(theta);
      const y = baseY + thresholdNoise * thresholdIntensity * Math.sin(theta);
      const z = baseZ + thresholdNoise * thresholdIntensity * C;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 1,
      uSegments: 96, vSegments: 64
    })
  },

  // ============================================================================
  // COHERENCE FIELD - Pattern coherence emerging from noise
  // ============================================================================
  uuon_coherence_field: {
    name: "✨ UUON Coherence Field",
    description: "Coherent patterns spontaneously emerging from noise fields",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 5;
      const coherenceStrength = params.e ?? 1;
      
      // Grid base
      const gridX = (u - 0.5) * scale * 2;
      const gridY = (v - 0.5) * scale * 2;
      
      // Coherence through noise alignment
      const noiseAngle = fbm(u * A, v * B, 0, 3) * Math.PI * 2;
      const noiseMag = fbm(u * B, v * A, 1, 3);
      
      // Aligned displacement creates coherent flow
      const dx = Math.cos(noiseAngle) * noiseMag * coherenceStrength;
      const dy = Math.sin(noiseAngle) * noiseMag * coherenceStrength;
      const dz = fbm(gridX * 0.2, gridY * 0.2, noiseAngle, 4) * C;
      
      return [gridX + dx, gridY + dy, dz];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 5, e: 1,
      uSegments: 128, vSegments: 128
    })
  },

  // ============================================================================
  // RESONANCE CAVITY - Acoustic-like resonance visualization
  // ============================================================================
  uuon_resonance_cavity: {
    name: "🔊 UUON Resonance Cavity",
    description: "Acoustic resonance patterns in 3D wire-mesh geometry",
    equation: (u, v, params) => {
      const A = params.a ?? TON_A;
      const B = params.b ?? TON_B;
      const C = params.c ?? TON_C;
      const scale = params.d ?? 4;
      const modes = Math.max(1, Math.floor(params.e ?? 3));
      
      // Cylindrical cavity base
      const theta = u * Math.PI * 2;
      const height = (v - 0.5) * scale * 2;
      
      // Resonance modes (standing waves)
      let resonance = 0;
      for (let m = 1; m <= modes; m++) {
        for (let n = 1; n <= modes; n++) {
          const modeFreq = Math.sqrt(m * m + n * n);
          resonance += Math.sin(m * theta * A) * Math.cos(n * height * B / scale) / (m * n);
        }
      }
      
      // Cavity wall with resonance modulation
      const baseRadius = scale * (1 + 0.2 * resonance);
      
      // Add noise texture
      const noise = fbm(theta, height * 0.5, resonance, 3) * C * 0.1;
      const r = baseRadius + noise;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: TON_A, b: TON_B, c: TON_C,
      d: 4, e: 3,
      uSegments: 96, vSegments: 48
    })
  }
};

// Export count for documentation
export const UUON_MESH_SHAPE_COUNT = Object.keys(UUON_MESH_SHAPES).length;
