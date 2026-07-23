/**
 * PBR MICRODETAIL TEXTURE GENERATOR
 * 
 * Generates seamless, tileable normal and AO maps for glass and metal surfaces
 * Resolution: ≤2K (2048x2048) for GPU optimization
 * Style: Scientific cinematic realism with quantum precision
 * Output: Noise-free, HDR-ready textures for real-time PBR rendering
 */

import * as THREE from 'three';

interface MicrodetailConfig {
  resolution: number;
  scale: number;
  intensity: number;
}

/**
 * Generate high-quality 3D Perlin-style noise (optimized)
 */
function smoothNoise3D(x: number, y: number, z: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  
  const fx = x - ix;
  const fy = y - iy;
  const fz = z - iz;
  
  // Smooth interpolation curve (Hermite)
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const w = fz * fz * (3 - 2 * fz);
  
  // Hash function for pseudo-random gradients
  const hash = (xi: number, yi: number, zi: number) => {
    let n = xi * 374761393 + yi * 668265263 + zi * 1274126177;
    n = (n ^ (n >> 13)) * 1274126177;
    return (n ^ (n >> 16)) / 2147483648.0;
  };
  
  // Trilinear interpolation
  const c000 = hash(ix, iy, iz);
  const c001 = hash(ix, iy, iz + 1);
  const c010 = hash(ix, iy + 1, iz);
  const c011 = hash(ix, iy + 1, iz + 1);
  const c100 = hash(ix + 1, iy, iz);
  const c101 = hash(ix + 1, iy, iz + 1);
  const c110 = hash(ix + 1, iy + 1, iz);
  const c111 = hash(ix + 1, iy + 1, iz + 1);
  
  const c00 = c000 * (1 - u) + c100 * u;
  const c01 = c001 * (1 - u) + c101 * u;
  const c10 = c010 * (1 - u) + c110 * u;
  const c11 = c011 * (1 - u) + c111 * u;
  
  const c0 = c00 * (1 - v) + c10 * v;
  const c1 = c01 * (1 - v) + c11 * v;
  
  return c0 * (1 - w) + c1 * w;
}

/**
 * Fractal Brownian Motion for organic detail
 */
function fbm(x: number, y: number, z: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1.0;
  
  for (let i = 0; i < octaves; i++) {
    value += amplitude * smoothNoise3D(x * frequency, y * frequency, z * frequency);
    amplitude *= 0.5;
    frequency *= 2.0;
  }
  
  return value;
}

/**
 * Voronoi cell pattern for micro-bubbles and crystal structure
 */
function voronoi(x: number, y: number, scale: number = 1.0): number {
  const cellX = Math.floor(x * scale);
  const cellY = Math.floor(y * scale);
  
  let minDist = Infinity;
  
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const cx = cellX + dx;
      const cy = cellY + dy;
      
      // Pseudo-random point in cell
      const hash = (cx * 374761393 + cy * 668265263) & 0x7FFFFFFF;
      const px = cx + (hash / 2147483648.0);
      const py = cy + ((hash * 1274126177) / 2147483648.0 % 1);
      
      const dist = Math.sqrt((x * scale - px) ** 2 + (y * scale - py) ** 2);
      minDist = Math.min(minDist, dist);
    }
  }
  
  return minDist;
}

/**
 * Generate GLASS microdetail normal map
 * Features: wave patterns, micro-bubbles, thin refraction lines
 */
export function generateGlassNormalMap(config: MicrodetailConfig = {
  resolution: 2048,
  scale: 8.0,
  intensity: 0.15
}): THREE.Texture {
  const { resolution, scale, intensity } = config;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      // Wave patterns (subtle sine waves)
      const wave1 = Math.sin(u * Math.PI * 12 * scale) * 0.3;
      const wave2 = Math.sin(v * Math.PI * 8 * scale) * 0.3;
      const waves = (wave1 + wave2) * 0.5;
      
      // Micro-bubbles (Voronoi cells)
      const bubbles = voronoi(u, v, 32 * scale);
      const bubblePattern = Math.max(0, 1 - bubbles * 8) * 0.4;
      
      // Thin refraction lines (high-frequency noise)
      const refractionLines = fbm(u * 40 * scale, v * 40 * scale, 0, 3) * 0.2;
      
      // Combine patterns
      const height = (waves + bubblePattern + refractionLines) * intensity;
      
      // Convert to normal map (RGB = XYZ normal)
      const normalX = 0.5 + height * 0.3;
      const normalY = 0.5 + height * 0.3;
      const normalZ = 0.5 + 0.5; // Always pointing up
      
      const idx = (y * resolution + x) * 4;
      data[idx + 0] = normalX * 255;
      data[idx + 1] = normalY * 255;
      data[idx + 2] = normalZ * 255;
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

/**
 * Generate METAL microdetail normal map
 * Features: brushed texture, grooves, edge wear, anisotropic reflections
 */
export function generateMetalNormalMap(config: MicrodetailConfig = {
  resolution: 2048,
  scale: 10.0,
  intensity: 0.25
}): THREE.Texture {
  const { resolution, scale, intensity } = config;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      // Brushed texture (horizontal anisotropic lines)
      const brushedNoise = fbm(u * 60 * scale, v * 2 * scale, 0, 5);
      const brushed = brushedNoise * 0.7;
      
      // Micro-grooves (fine parallel lines)
      const grooves = Math.sin(u * Math.PI * 200 * scale) * 0.1;
      
      // Edge wear (Voronoi-based scratches)
      const scratches = voronoi(u, v, 20 * scale);
      const scratchPattern = (1 - Math.min(1, scratches * 10)) * 0.15;
      
      // Micro-surface roughness variation
      const roughnessVar = fbm(u * 30 * scale, v * 30 * scale, 0.5, 4) * 0.25;
      
      // Combine patterns
      const height = (brushed + grooves + scratchPattern + roughnessVar) * intensity;
      
      // Convert to normal map with anisotropic bias
      const normalX = 0.5 + height * 0.5; // Strong horizontal component
      const normalY = 0.5 + height * 0.1; // Weak vertical component
      const normalZ = 0.5 + 0.4;
      
      const idx = (y * resolution + x) * 4;
      data[idx + 0] = normalX * 255;
      data[idx + 1] = normalY * 255;
      data[idx + 2] = normalZ * 255;
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

/**
 * Generate GLASS ambient occlusion map
 * Subtle AO for micro-bubbles and wave valleys
 */
export function generateGlassAOMap(config: MicrodetailConfig = {
  resolution: 2048,
  scale: 8.0,
  intensity: 0.12
}): THREE.Texture {
  const { resolution, scale, intensity } = config;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      // AO from micro-bubbles
      const bubbles = voronoi(u, v, 32 * scale);
      const bubbleAO = Math.max(0, 1 - bubbles * 6) * intensity;
      
      // AO from wave valleys
      const waveAO = fbm(u * 12 * scale, v * 8 * scale, 0, 3) * intensity * 0.3;
      
      // Combine (1.0 = no occlusion, 0.0 = full occlusion)
      const ao = 1.0 - Math.min(0.3, bubbleAO + waveAO);
      
      const idx = (y * resolution + x) * 4;
      const val = ao * 255;
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

/**
 * Generate METAL ambient occlusion map
 * AO for grooves, scratches, and micro-cavities
 */
export function generateMetalAOMap(config: MicrodetailConfig = {
  resolution: 2048,
  scale: 10.0,
  intensity: 0.18
}): THREE.Texture {
  const { resolution, scale, intensity } = config;
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(resolution, resolution);
  const data = imageData.data;
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      // AO from grooves
      const grooveAO = Math.abs(Math.sin(u * Math.PI * 200 * scale)) * intensity * 0.4;
      
      // AO from scratches
      const scratches = voronoi(u, v, 20 * scale);
      const scratchAO = (1 - Math.min(1, scratches * 10)) * intensity * 0.5;
      
      // AO from surface roughness variation
      const roughnessAO = fbm(u * 30 * scale, v * 30 * scale, 0, 4) * intensity * 0.3;
      
      // Combine (1.0 = no occlusion, 0.0 = full occlusion)
      const ao = 1.0 - Math.min(0.4, grooveAO + scratchAO + roughnessAO);
      
      const idx = (y * resolution + x) * 4;
      const val = ao * 255;
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

/**
 * Texture cache to avoid regeneration
 */
const textureCache: Map<string, THREE.Texture> = new Map();

export function getGlassMicrodetailTextures() {
  if (!textureCache.has('glass_normal')) {
    textureCache.set('glass_normal', generateGlassNormalMap());
  }
  if (!textureCache.has('glass_ao')) {
    textureCache.set('glass_ao', generateGlassAOMap());
  }
  
  return {
    normalMap: textureCache.get('glass_normal')!,
    aoMap: textureCache.get('glass_ao')!
  };
}

export function getMetalMicrodetailTextures() {
  if (!textureCache.has('metal_normal')) {
    textureCache.set('metal_normal', generateMetalNormalMap());
  }
  if (!textureCache.has('metal_ao')) {
    textureCache.set('metal_ao', generateMetalAOMap());
  }
  
  return {
    normalMap: textureCache.get('metal_normal')!,
    aoMap: textureCache.get('metal_ao')!
  };
}
