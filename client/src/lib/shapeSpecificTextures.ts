/**
 * SHAPE-SPECIFIC MATHEMATICAL TEXTURE GENERATION SYSTEM
 * 
 * Generates unique PBR texture maps (albedo, normal, roughness, metallic, occlusion)
 * based on the mathematical foundation of each shape category.
 * 
 * Key Features:
 * - Category-specific mathematical patterns
 * - Unique seed multipliers using mathematical constants (π, φ, e, √2)
 * - Parameter-driven texture variation
 * - Full PBR material support for GLB/GLTF exports
 */

import * as THREE from 'three';

export type ShapeCategoryType = 
  | 'universe' | 'basic' | 'waves' | 'field_theory' | 'tensor_algebra'
  | 'number_theory' | 'complexity' | 'fractals' | 'quantum' | 'schrodinger'
  | 'entanglement' | 'relativity' | 'cryptography' | 'biological' | 'cellular'
  | 'molecular' | 'protein' | 'anatomical' | 'crystal' | 'sacred' | 'ai_ml'
  | 'diamond' | 'hyperdimensional' | 'minimal' | 'riemann' | 'sequences'
  | 'cosmological' | 'mesh_processing' | 'blackholes' | 'default';

export interface ShapeTextureParams {
  shapeId: string;
  category: ShapeCategoryType;
  parameters: Record<string, number>;
  resolution?: number;
}

export interface PBRTextureSet {
  albedoMap: THREE.Texture;
  normalMap: THREE.Texture;
  roughnessMap: THREE.Texture;
  metallicMap: THREE.Texture;
  aoMap: THREE.Texture;
}

const GOLDEN_RATIO = 1.618033988749895;
const EULER_NUMBER = 2.718281828459045;
const PI = 3.141592653589793;
const SQRT2 = 1.4142135623730951;

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function smoothNoise2D(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  
  const hash = (xi: number, yi: number) => {
    let n = (xi * 374761393 + yi * 668265263 + Math.floor(seed * 1274126177)) & 0x7FFFFFFF;
    n = (n ^ (n >> 13)) * 1274126177;
    return ((n ^ (n >> 16)) & 0x7FFFFFFF) / 0x7FFFFFFF;
  };
  
  const c00 = hash(ix, iy);
  const c10 = hash(ix + 1, iy);
  const c01 = hash(ix, iy + 1);
  const c11 = hash(ix + 1, iy + 1);
  
  const c0 = c00 * (1 - u) + c10 * u;
  const c1 = c01 * (1 - u) + c11 * u;
  
  return c0 * (1 - v) + c1 * v;
}

function fbm(x: number, y: number, seed: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1.0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise2D(x * frequency, y * frequency, seed + i * 100);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return value;
}

function voronoi(x: number, y: number, scale: number, seed: number): number {
  const cellX = Math.floor(x * scale);
  const cellY = Math.floor(y * scale);
  
  let minDist = Infinity;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = cellX + dx;
      const cy = cellY + dy;
      
      const hash = ((cx * 374761393 + cy * 668265263 + Math.floor(seed * 1000)) & 0x7FFFFFFF) / 0x7FFFFFFF;
      const px = cx + hash;
      const py = cy + ((hash * 1274126177) % 1);
      
      const dist = Math.sqrt((x * scale - px) ** 2 + (y * scale - py) ** 2);
      minDist = Math.min(minDist, dist);
    }
  }
  
  return minDist;
}

function computeParameterHash(params: Record<string, number>): number {
  let hash = 0;
  const keys = Object.keys(params).sort();
  for (const key of keys) {
    const val = params[key] || 0;
    hash = (hash * 31 + val * 17) % 10000;
  }
  return hash / 10000;
}

function getCategoryMultipliers(category: ShapeCategoryType): {
  albedoMult: number;
  normalMult: number;
  roughnessMult: number;
  metallicMult: number;
  aoMult: number;
} {
  const categoryMultipliers: Record<ShapeCategoryType, {
    albedoMult: number;
    normalMult: number;
    roughnessMult: number;
    metallicMult: number;
    aoMult: number;
  }> = {
    universe: { albedoMult: 1.0, normalMult: GOLDEN_RATIO, roughnessMult: EULER_NUMBER, metallicMult: PI, aoMult: SQRT2 },
    basic: { albedoMult: 1.1, normalMult: 1.5, roughnessMult: 2.3, metallicMult: 2.9, aoMult: 1.3 },
    waves: { albedoMult: 1.2, normalMult: PI * 0.5, roughnessMult: EULER_NUMBER * 0.8, metallicMult: 2.5, aoMult: 1.7 },
    field_theory: { albedoMult: PI, normalMult: EULER_NUMBER, roughnessMult: GOLDEN_RATIO, metallicMult: SQRT2 * 2, aoMult: 1.9 },
    tensor_algebra: { albedoMult: SQRT2, normalMult: PI * 0.7, roughnessMult: 2.1, metallicMult: 3.3, aoMult: 1.5 },
    number_theory: { albedoMult: GOLDEN_RATIO * 0.9, normalMult: 1.8, roughnessMult: 2.7, metallicMult: 3.1, aoMult: 1.4 },
    complexity: { albedoMult: 1.3, normalMult: 2.1, roughnessMult: EULER_NUMBER * 1.1, metallicMult: PI * 0.9, aoMult: 1.6 },
    fractals: { albedoMult: GOLDEN_RATIO, normalMult: GOLDEN_RATIO * 1.2, roughnessMult: PI * 0.6, metallicMult: 2.8, aoMult: SQRT2 },
    quantum: { albedoMult: EULER_NUMBER * 0.7, normalMult: PI * 0.8, roughnessMult: GOLDEN_RATIO * 1.5, metallicMult: 3.5, aoMult: 1.8 },
    schrodinger: { albedoMult: PI * 0.5, normalMult: EULER_NUMBER * 0.9, roughnessMult: 2.4, metallicMult: 3.2, aoMult: SQRT2 * 1.1 },
    entanglement: { albedoMult: GOLDEN_RATIO * 1.1, normalMult: PI * 0.6, roughnessMult: EULER_NUMBER, metallicMult: 2.7, aoMult: 1.9 },
    relativity: { albedoMult: EULER_NUMBER, normalMult: SQRT2 * 1.3, roughnessMult: PI * 0.7, metallicMult: GOLDEN_RATIO * 2, aoMult: 1.7 },
    cryptography: { albedoMult: 1.7, normalMult: 2.3, roughnessMult: 3.1, metallicMult: EULER_NUMBER * 1.2, aoMult: PI * 0.5 },
    biological: { albedoMult: 0.8, normalMult: 1.3, roughnessMult: 1.9, metallicMult: 0.5, aoMult: 2.1 },
    cellular: { albedoMult: 0.9, normalMult: 1.4, roughnessMult: 2.0, metallicMult: 0.4, aoMult: 2.3 },
    molecular: { albedoMult: 1.1, normalMult: GOLDEN_RATIO * 0.8, roughnessMult: 1.8, metallicMult: 0.6, aoMult: 1.9 },
    protein: { albedoMult: 0.95, normalMult: 1.5, roughnessMult: 2.2, metallicMult: 0.3, aoMult: 2.0 },
    anatomical: { albedoMult: 0.85, normalMult: 1.2, roughnessMult: 1.7, metallicMult: 0.2, aoMult: 2.4 },
    crystal: { albedoMult: 1.4, normalMult: SQRT2, roughnessMult: 0.8, metallicMult: GOLDEN_RATIO * 2.5, aoMult: 1.2 },
    sacred: { albedoMult: GOLDEN_RATIO * 1.2, normalMult: PI * 0.4, roughnessMult: 1.5, metallicMult: 2.2, aoMult: SQRT2 * 0.9 },
    ai_ml: { albedoMult: 1.5, normalMult: 2.0, roughnessMult: 2.8, metallicMult: 3.0, aoMult: 1.6 },
    diamond: { albedoMult: 1.8, normalMult: SQRT2 * 1.5, roughnessMult: 0.3, metallicMult: GOLDEN_RATIO * 3, aoMult: 0.9 },
    hyperdimensional: { albedoMult: PI * 0.8, normalMult: EULER_NUMBER * 1.1, roughnessMult: GOLDEN_RATIO, metallicMult: SQRT2 * 2.2, aoMult: 1.5 },
    minimal: { albedoMult: 1.2, normalMult: 1.6, roughnessMult: 2.5, metallicMult: 2.0, aoMult: 1.3 },
    riemann: { albedoMult: EULER_NUMBER * 0.8, normalMult: PI * 0.5, roughnessMult: GOLDEN_RATIO * 1.3, metallicMult: 2.6, aoMult: 1.8 },
    sequences: { albedoMult: GOLDEN_RATIO * 0.7, normalMult: 1.9, roughnessMult: 2.6, metallicMult: 2.4, aoMult: 1.4 },
    cosmological: { albedoMult: PI * 0.6, normalMult: EULER_NUMBER * 0.7, roughnessMult: 2.2, metallicMult: 3.4, aoMult: 2.0 },
    mesh_processing: { albedoMult: 1.3, normalMult: 1.7, roughnessMult: 2.4, metallicMult: 2.8, aoMult: 1.5 },
    blackholes: { albedoMult: 0.5, normalMult: EULER_NUMBER, roughnessMult: PI * 0.4, metallicMult: 4.0, aoMult: 2.5 },
    default: { albedoMult: 1.0, normalMult: GOLDEN_RATIO, roughnessMult: EULER_NUMBER, metallicMult: PI, aoMult: SQRT2 }
  };
  
  return categoryMultipliers[category] || categoryMultipliers.default;
}

function generateAlbedoTexture(
  resolution: number,
  category: ShapeCategoryType,
  baseSeed: number,
  paramHash: number
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  const mults = getCategoryMultipliers(category);
  const seed = baseSeed * mults.albedoMult + paramHash * 1000;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      let pattern = 0;
      
      switch (category) {
        case 'biological':
        case 'cellular':
        case 'protein':
        case 'anatomical':
          const cellPattern = voronoi(u, v, 15 + paramHash * 5, seed);
          const membrane = 1 - Math.min(1, cellPattern * 4);
          pattern = membrane * 0.6 + fbm(u * 8, v * 8, seed, 3) * 0.4;
          break;
          
        case 'crystal':
        case 'diamond':
          const facets = Math.abs(Math.sin(u * PI * 12 * (1 + paramHash)) * Math.cos(v * PI * 12 * (1 + paramHash)));
          const sparkle = voronoi(u, v, 25, seed) < 0.1 ? 1 : 0;
          pattern = facets * 0.7 + sparkle * 0.3;
          break;
          
        case 'fractals':
          let fractalVal = 0;
          for (let i = 0; i < 5; i++) {
            const scale = Math.pow(GOLDEN_RATIO, i);
            fractalVal += fbm(u * scale * 4, v * scale * 4, seed + i * 50, 2) / scale;
          }
          pattern = fractalVal * 0.5 + 0.5;
          break;
          
        case 'quantum':
        case 'schrodinger':
        case 'entanglement':
          const waveFunction = Math.sin(u * PI * 8) * Math.cos(v * PI * 8) * 0.5 + 0.5;
          const probability = fbm(u * 12, v * 12, seed, 4);
          const interference = Math.sin((u + v) * PI * 16) * 0.3 + 0.7;
          pattern = waveFunction * 0.4 + probability * 0.3 + interference * 0.3;
          break;
          
        case 'waves':
          const wave1 = Math.sin(u * PI * 10 + paramHash * PI) * 0.5 + 0.5;
          const wave2 = Math.cos(v * PI * 8 + paramHash * PI * 0.5) * 0.5 + 0.5;
          const harmonic = Math.sin((u + v) * PI * 20) * 0.3 + 0.7;
          pattern = wave1 * 0.4 + wave2 * 0.4 + harmonic * 0.2;
          break;
          
        case 'sacred':
          const spiralAngle = Math.atan2(v - 0.5, u - 0.5);
          const spiralDist = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          const goldenSpiral = Math.sin(spiralAngle * 8 + spiralDist * PI * 10 * GOLDEN_RATIO) * 0.5 + 0.5;
          const mandala = Math.abs(Math.sin(spiralAngle * 6)) * Math.cos(spiralDist * PI * 8);
          pattern = goldenSpiral * 0.6 + mandala * 0.4;
          break;
          
        case 'cryptography':
          const grid = Math.floor(u * 16) + Math.floor(v * 16) * 16;
          const rand = seededRandom(seed + grid);
          const bit = rand() > 0.5 ? 0.8 : 0.2;
          const noise = fbm(u * 20, v * 20, seed, 2) * 0.2;
          pattern = bit + noise;
          break;
          
        case 'hyperdimensional':
          const proj4D = Math.sin(u * PI * 6) * Math.cos(v * PI * 6) * 
                         Math.sin((u + v) * PI * 4) * 0.5 + 0.5;
          const rotation = fbm(u * 8 + paramHash, v * 8 + paramHash, seed, 4);
          pattern = proj4D * 0.5 + rotation * 0.5;
          break;
          
        case 'blackholes':
        case 'cosmological':
          const radial = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          const eventHorizon = Math.exp(-radial * 8) * 0.8;
          const accretion = Math.sin(Math.atan2(v - 0.5, u - 0.5) * 12 + radial * 20) * 0.3 + 0.7;
          const hawking = fbm(u * 30, v * 30, seed, 3) * 0.2;
          pattern = eventHorizon * 0.5 + accretion * 0.3 + hawking * 0.2;
          break;
          
        case 'relativity':
          const spacetimeCurve = Math.sin(u * PI * 4) * Math.sin(v * PI * 4);
          const timeDilation = 1 / (1 + Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2) * 2);
          pattern = spacetimeCurve * 0.4 + timeDilation * 0.6;
          break;
          
        default:
          pattern = fbm(u * 10, v * 10, seed, 4) * 0.6 + 
                    Math.sin(u * PI * 8) * Math.cos(v * PI * 8) * 0.2 + 0.5;
      }
      
      pattern = Math.max(0, Math.min(1, pattern));
      
      const idx = (y * resolution + x) * 4;
      data[idx + 0] = Math.floor(pattern * 255);
      data[idx + 1] = Math.floor(pattern * 255);
      data[idx + 2] = Math.floor(pattern * 255);
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  
  return texture;
}

function generateNormalTexture(
  resolution: number,
  category: ShapeCategoryType,
  baseSeed: number,
  paramHash: number
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  const mults = getCategoryMultipliers(category);
  const seed = baseSeed * mults.normalMult + paramHash * 2000;
  
  const heightMap: number[][] = [];
  for (let y = 0; y < resolution; y++) {
    heightMap[y] = [];
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      let height = 0;
      
      switch (category) {
        case 'biological':
        case 'cellular':
          const cellDist = voronoi(u, v, 12, seed);
          height = Math.pow(cellDist, 0.5) * 0.8 + fbm(u * 15, v * 15, seed, 3) * 0.2;
          break;
          
        case 'crystal':
        case 'diamond':
          const facetNoise = Math.abs(Math.sin(u * PI * 20) * Math.cos(v * PI * 20));
          const sharpEdge = voronoi(u, v, 8, seed);
          height = facetNoise * 0.6 + (1 - sharpEdge) * 0.4;
          break;
          
        case 'fractals':
          height = 0;
          for (let i = 0; i < 6; i++) {
            const scale = Math.pow(2, i);
            height += fbm(u * scale * 3, v * scale * 3, seed + i * 77, 2) / scale;
          }
          height = height * 0.5 + 0.5;
          break;
          
        case 'waves':
          height = Math.sin(u * PI * 12 + v * PI * 4) * 0.4 +
                   Math.cos(u * PI * 6 - v * PI * 8) * 0.3 +
                   fbm(u * 8, v * 8, seed, 2) * 0.3;
          break;
          
        case 'quantum':
        case 'schrodinger':
          const psi = Math.sin(u * PI * 10) * Math.sin(v * PI * 10);
          const density = psi * psi;
          height = density * 0.7 + fbm(u * 20, v * 20, seed, 3) * 0.3;
          break;
          
        case 'hyperdimensional':
          const w = Math.sin((u + v) * PI * 3);
          height = Math.sin(u * PI * 8 + w) * Math.cos(v * PI * 8 + w) * 0.6 +
                   fbm(u * 10, v * 10, seed, 4) * 0.4;
          break;
          
        case 'blackholes':
          const r = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          const theta = Math.atan2(v - 0.5, u - 0.5);
          const schwarz = 1 / (r + 0.1);
          height = Math.sin(theta * 8 + r * 30) * schwarz * 0.1 + fbm(u * 15, v * 15, seed, 3) * 0.3;
          break;
          
        default:
          height = fbm(u * 12, v * 12, seed, 4);
      }
      
      heightMap[y][x] = height;
    }
  }
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const x1 = (x - 1 + resolution) % resolution;
      const x2 = (x + 1) % resolution;
      const y1 = (y - 1 + resolution) % resolution;
      const y2 = (y + 1) % resolution;
      
      const dX = (heightMap[y][x2] - heightMap[y][x1]) * 2;
      const dY = (heightMap[y2][x] - heightMap[y1][x]) * 2;
      
      const normalX = -dX;
      const normalY = -dY;
      const normalZ = 1;
      
      const len = Math.sqrt(normalX * normalX + normalY * normalY + normalZ * normalZ);
      
      const idx = (y * resolution + x) * 4;
      data[idx + 0] = Math.floor((normalX / len * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((normalY / len * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((normalZ / len * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  
  return texture;
}

function generateRoughnessTexture(
  resolution: number,
  category: ShapeCategoryType,
  baseSeed: number,
  paramHash: number
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  const mults = getCategoryMultipliers(category);
  const seed = baseSeed * mults.roughnessMult + paramHash * 3000;
  
  const categoryRoughness: Record<ShapeCategoryType, { base: number; variation: number }> = {
    universe: { base: 0.4, variation: 0.3 },
    basic: { base: 0.5, variation: 0.2 },
    waves: { base: 0.3, variation: 0.4 },
    field_theory: { base: 0.35, variation: 0.3 },
    tensor_algebra: { base: 0.4, variation: 0.25 },
    number_theory: { base: 0.45, variation: 0.2 },
    complexity: { base: 0.5, variation: 0.35 },
    fractals: { base: 0.6, variation: 0.3 },
    quantum: { base: 0.25, variation: 0.4 },
    schrodinger: { base: 0.3, variation: 0.35 },
    entanglement: { base: 0.2, variation: 0.5 },
    relativity: { base: 0.35, variation: 0.3 },
    cryptography: { base: 0.55, variation: 0.25 },
    biological: { base: 0.7, variation: 0.2 },
    cellular: { base: 0.75, variation: 0.15 },
    molecular: { base: 0.5, variation: 0.25 },
    protein: { base: 0.65, variation: 0.2 },
    anatomical: { base: 0.8, variation: 0.15 },
    crystal: { base: 0.1, variation: 0.15 },
    sacred: { base: 0.35, variation: 0.25 },
    ai_ml: { base: 0.45, variation: 0.3 },
    diamond: { base: 0.05, variation: 0.1 },
    hyperdimensional: { base: 0.3, variation: 0.35 },
    minimal: { base: 0.4, variation: 0.2 },
    riemann: { base: 0.35, variation: 0.3 },
    sequences: { base: 0.45, variation: 0.25 },
    cosmological: { base: 0.4, variation: 0.4 },
    mesh_processing: { base: 0.5, variation: 0.2 },
    blackholes: { base: 0.15, variation: 0.6 },
    default: { base: 0.5, variation: 0.3 }
  };
  
  const roughnessConfig = categoryRoughness[category] || categoryRoughness.default;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      let variation = 0;
      
      switch (category) {
        case 'crystal':
        case 'diamond':
          const facet = voronoi(u, v, 10, seed);
          variation = facet < 0.15 ? -0.05 : fbm(u * 30, v * 30, seed, 2) * 0.1;
          break;
          
        case 'biological':
        case 'cellular':
          const cell = voronoi(u, v, 8, seed);
          variation = cell * 0.3 - 0.1 + fbm(u * 12, v * 12, seed, 3) * 0.2;
          break;
          
        case 'fractals':
          variation = 0;
          for (let i = 0; i < 4; i++) {
            variation += fbm(u * Math.pow(2, i) * 5, v * Math.pow(2, i) * 5, seed + i * 33, 2) / Math.pow(2, i);
          }
          variation = variation * 0.5 - 0.25;
          break;
          
        case 'blackholes':
          const radius = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          variation = Math.exp(-radius * 5) * 0.5 - 0.3;
          break;
          
        default:
          variation = (fbm(u * 15, v * 15, seed, 4) - 0.5) * roughnessConfig.variation;
      }
      
      const roughness = Math.max(0, Math.min(1, roughnessConfig.base + variation));
      
      const idx = (y * resolution + x) * 4;
      const val = Math.floor(roughness * 255);
      data[idx + 0] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  
  return texture;
}

function generateMetallicTexture(
  resolution: number,
  category: ShapeCategoryType,
  baseSeed: number,
  paramHash: number
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  const mults = getCategoryMultipliers(category);
  const seed = baseSeed * mults.metallicMult + paramHash * 4000;
  
  const categoryMetallic: Record<ShapeCategoryType, { base: number; variation: number }> = {
    universe: { base: 0.5, variation: 0.3 },
    basic: { base: 0.3, variation: 0.2 },
    waves: { base: 0.2, variation: 0.3 },
    field_theory: { base: 0.4, variation: 0.25 },
    tensor_algebra: { base: 0.45, variation: 0.2 },
    number_theory: { base: 0.35, variation: 0.15 },
    complexity: { base: 0.4, variation: 0.3 },
    fractals: { base: 0.3, variation: 0.4 },
    quantum: { base: 0.5, variation: 0.35 },
    schrodinger: { base: 0.45, variation: 0.3 },
    entanglement: { base: 0.55, variation: 0.35 },
    relativity: { base: 0.5, variation: 0.25 },
    cryptography: { base: 0.7, variation: 0.2 },
    biological: { base: 0.05, variation: 0.1 },
    cellular: { base: 0.0, variation: 0.05 },
    molecular: { base: 0.15, variation: 0.15 },
    protein: { base: 0.0, variation: 0.05 },
    anatomical: { base: 0.0, variation: 0.02 },
    crystal: { base: 0.8, variation: 0.15 },
    sacred: { base: 0.4, variation: 0.3 },
    ai_ml: { base: 0.6, variation: 0.25 },
    diamond: { base: 0.9, variation: 0.08 },
    hyperdimensional: { base: 0.55, variation: 0.3 },
    minimal: { base: 0.35, variation: 0.2 },
    riemann: { base: 0.4, variation: 0.25 },
    sequences: { base: 0.3, variation: 0.2 },
    cosmological: { base: 0.6, variation: 0.35 },
    mesh_processing: { base: 0.4, variation: 0.2 },
    blackholes: { base: 0.85, variation: 0.15 },
    default: { base: 0.4, variation: 0.3 }
  };
  
  const metallicConfig = categoryMetallic[category] || categoryMetallic.default;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      let variation = 0;
      
      switch (category) {
        case 'crystal':
        case 'diamond':
          const facetEdge = voronoi(u, v, 12, seed);
          variation = facetEdge < 0.1 ? 0.1 : fbm(u * 25, v * 25, seed, 2) * 0.08;
          break;
          
        case 'cryptography':
          const gridX = Math.floor(u * 8);
          const gridY = Math.floor(v * 8);
          const cellSeed = seededRandom(seed + gridX * 17 + gridY * 31);
          variation = (cellSeed() > 0.5 ? 0.15 : -0.1);
          break;
          
        case 'blackholes':
          const r = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          variation = r < 0.15 ? 0.1 : -r * 0.3;
          break;
          
        case 'biological':
        case 'cellular':
        case 'protein':
        case 'anatomical':
          variation = fbm(u * 20, v * 20, seed, 3) * 0.05;
          break;
          
        default:
          const modular = Math.sin(u * PI * 10 + seed) * Math.cos(v * PI * 10 + seed) * 0.5 + 0.5;
          variation = (modular - 0.5) * metallicConfig.variation + 
                      (fbm(u * 12, v * 12, seed, 3) - 0.5) * metallicConfig.variation * 0.5;
      }
      
      const metallic = Math.max(0, Math.min(1, metallicConfig.base + variation));
      
      const idx = (y * resolution + x) * 4;
      const val = Math.floor(metallic * 255);
      data[idx + 0] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  
  return texture;
}

function generateAOTexture(
  resolution: number,
  category: ShapeCategoryType,
  baseSeed: number,
  paramHash: number
): THREE.Texture {
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  const mults = getCategoryMultipliers(category);
  const seed = baseSeed * mults.aoMult + paramHash * 5000;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      let ao = 1.0;
      
      switch (category) {
        case 'biological':
        case 'cellular':
          const cellDist = voronoi(u, v, 10, seed);
          const cellAO = Math.max(0, 1 - cellDist * 3) * 0.4;
          ao = 1 - cellAO - fbm(u * 15, v * 15, seed, 3) * 0.15;
          break;
          
        case 'crystal':
        case 'diamond':
          const edge = voronoi(u, v, 8, seed);
          ao = 0.85 + edge * 0.15;
          break;
          
        case 'fractals':
          let fractalAO = 0;
          for (let i = 0; i < 4; i++) {
            fractalAO += fbm(u * Math.pow(2, i) * 6, v * Math.pow(2, i) * 6, seed + i * 22, 2) / Math.pow(1.8, i);
          }
          ao = 0.7 + fractalAO * 0.25;
          break;
          
        case 'blackholes':
          const radius = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
          ao = 0.3 + Math.min(0.7, radius * 2);
          break;
          
        case 'hyperdimensional':
          const fold = Math.abs(Math.sin(u * PI * 8) * Math.cos(v * PI * 8));
          ao = 0.6 + fold * 0.3 + fbm(u * 10, v * 10, seed, 3) * 0.1;
          break;
          
        case 'waves':
          const waveDepth = Math.abs(Math.sin(u * PI * 10) * Math.sin(v * PI * 8));
          ao = 0.75 + waveDepth * 0.2;
          break;
          
        default:
          const baseAO = fbm(u * 12, v * 12, seed, 4);
          const cavities = voronoi(u, v, 15, seed) < 0.2 ? 0.2 : 0;
          ao = 0.85 - cavities + (baseAO - 0.5) * 0.2;
      }
      
      ao = Math.max(0, Math.min(1, ao));
      
      const idx = (y * resolution + x) * 4;
      const val = Math.floor(ao * 255);
      data[idx + 0] = val;
      data[idx + 1] = val;
      data[idx + 2] = val;
      data[idx + 3] = 255;
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.LinearSRGBColorSpace;
  texture.needsUpdate = true;
  
  return texture;
}

export function getCategoryFromShapeId(shapeId: string): ShapeCategoryType {
  const categoryMappings: Record<string, ShapeCategoryType> = {
    'shape_of_universe': 'universe',
    'square': 'basic', 'cube': 'basic', 'circle': 'basic', 'sphere': 'basic', 
    'torus': 'basic', 'cylinder': 'basic', 'cone': 'basic', 'ellipsoid': 'basic',
    
    'electromagnetic_wave': 'waves', 'sound_wave': 'waves', 'quantum_wave': 'waves',
    'gravitational_wave': 'waves', 'ocean_wave': 'waves', 'brain_wave': 'waves',
    
    'yang_mills_field': 'field_theory', 'dirac_equation': 'field_theory',
    'maxwell_equations': 'field_theory', 'klein_gordon_equation': 'field_theory',
    
    'mandelbrot_3d': 'fractals', 'julia_3d': 'fractals', 'burning_ship_3d': 'fractals',
    'mandelbox_3d': 'fractals', 'newton_fractal_3d': 'fractals',
    
    'hydrogen_orbital': 'quantum', 'schrodinger': 'schrodinger',
    'bell_state': 'entanglement', 'epr_pair': 'entanglement',
    
    'schwarzschild': 'blackholes', 'kerr': 'blackholes', 'penrose_diagram': 'blackholes',
    
    'mitochondria': 'cellular', 'nucleus': 'cellular', 'ribosome': 'cellular',
    'golgi_apparatus': 'cellular', 'lysosome': 'cellular',
    
    'red_blood_cell': 'biological', 'neuron': 'biological', 'platelet': 'biological',
    
    'dna_double_helix': 'molecular', 'protein': 'protein', 'hemoglobin': 'protein',
    
    'tesseract': 'hyperdimensional', 'hypersphere': 'hyperdimensional', 
    '5_cell': 'hyperdimensional', '16_cell': 'hyperdimensional', '24_cell': 'hyperdimensional',
    
    'diamond': 'diamond', 'crystal': 'crystal',
    
    'aes_rijndael': 'cryptography', 'sha256': 'cryptography', 'elliptic_curve': 'cryptography',
    
    'flower_of_life': 'sacred', 'metatrons_cube': 'sacred', 'sri_yantra': 'sacred',
    
    'ai_gradient_descent': 'ai_ml', 'ai_neural': 'ai_ml', 'ai_transformer': 'ai_ml',
  };
  
  for (const [key, cat] of Object.entries(categoryMappings)) {
    if (shapeId.toLowerCase().includes(key.toLowerCase())) {
      return cat;
    }
  }
  
  if (shapeId.includes('tensor') || shapeId.includes('covariant') || shapeId.includes('christoffel')) {
    return 'tensor_algebra';
  }
  if (shapeId.includes('prime') || shapeId.includes('riemann_zeta')) {
    return 'number_theory';
  }
  if (shapeId.includes('fibonacci') || shapeId.includes('sequence')) {
    return 'sequences';
  }
  if (shapeId.includes('schwarzschild') || shapeId.includes('black_hole') || shapeId.includes('gravastar')) {
    return 'blackholes';
  }
  if (shapeId.includes('cell') || shapeId.includes('organelle')) {
    return 'cellular';
  }
  if (shapeId.includes('blood') || shapeId.includes('tissue') || shapeId.includes('bio')) {
    return 'biological';
  }
  if (shapeId.includes('4d') || shapeId.includes('hyper') || shapeId.includes('tesseract')) {
    return 'hyperdimensional';
  }
  
  return 'default';
}

export function generateShapeSpecificPBRTextures(params: ShapeTextureParams): PBRTextureSet {
  const { shapeId, category, parameters, resolution = 1024 } = params;
  
  const paramHash = computeParameterHash(parameters);
  
  let baseSeed = 0;
  for (let i = 0; i < shapeId.length; i++) {
    baseSeed = (baseSeed * 31 + shapeId.charCodeAt(i)) % 100000;
  }
  baseSeed = baseSeed / 100000;
  
  console.log(`🎨 Generating shape-specific PBR textures for: ${shapeId} (category: ${category})`);
  
  return {
    albedoMap: generateAlbedoTexture(resolution, category, baseSeed, paramHash),
    normalMap: generateNormalTexture(resolution, category, baseSeed, paramHash),
    roughnessMap: generateRoughnessTexture(resolution, category, baseSeed, paramHash),
    metallicMap: generateMetallicTexture(resolution, category, baseSeed, paramHash),
    aoMap: generateAOTexture(resolution, category, baseSeed, paramHash)
  };
}

const textureCache: Map<string, PBRTextureSet> = new Map();

export function getCachedShapeTextures(shapeId: string, category: ShapeCategoryType, parameters: Record<string, number>, resolution: number = 1024): PBRTextureSet {
  const paramHash = computeParameterHash(parameters);
  const cacheKey = `${shapeId}_${category}_${paramHash}_${resolution}`;
  
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey)!;
  }
  
  const textures = generateShapeSpecificPBRTextures({
    shapeId,
    category,
    parameters,
    resolution
  });
  
  if (textureCache.size > 50) {
    const firstKey = textureCache.keys().next().value;
    if (firstKey) {
      const oldTextures = textureCache.get(firstKey);
      if (oldTextures) {
        oldTextures.albedoMap.dispose();
        oldTextures.normalMap.dispose();
        oldTextures.roughnessMap.dispose();
        oldTextures.metallicMap.dispose();
        oldTextures.aoMap.dispose();
      }
      textureCache.delete(firstKey);
    }
  }
  
  textureCache.set(cacheKey, textures);
  return textures;
}

export function disposeAllCachedTextures(): void {
  textureCache.forEach((textures) => {
    textures.albedoMap.dispose();
    textures.normalMap.dispose();
    textures.roughnessMap.dispose();
    textures.metallicMap.dispose();
    textures.aoMap.dispose();
  });
  textureCache.clear();
  console.log('🧹 Disposed all cached shape-specific textures');
}
