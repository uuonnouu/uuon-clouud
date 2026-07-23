/**
 * FRACTAL UV MAPPING ENGINE
 * 
 * Comprehensive UV coordinate generation system for 3D parametric surfaces
 * Supports multiple mapping modes including fractal-based UV patterns
 * 
 * Author: UUON Foundation Inc.
 * Integration: Three.js / @react-three/fiber / GLB Export
 */

import * as THREE from 'three';

export type UVMappingMode = 
  | 'spherical'
  | 'cylindrical' 
  | 'planar'
  | 'box'
  | 'fractal-mandelbrot'
  | 'fractal-julia'
  | 'fractal-perlin'
  | 'hexagonal'
  | 'toroidal'
  | 'polar'
  | 'triplanar';

export interface UVMappingOptions {
  mode: UVMappingMode;
  scale: number;
  offset: { u: number; v: number };
  rotation: number;
  fractalIterations?: number;
  fractalScale?: number;
  seamless?: boolean;
  aspect?: number;
}

export interface FractalUVResult {
  uvs: Float32Array;
  tangents?: Float32Array;
  metadata: {
    mode: UVMappingMode;
    vertexCount: number;
    hasSeamCorrection: boolean;
  };
}

const DEFAULT_OPTIONS: UVMappingOptions = {
  mode: 'spherical',
  scale: 1,
  offset: { u: 0, v: 0 },
  rotation: 0,
  fractalIterations: 8,
  fractalScale: 2,
  seamless: true,
  aspect: 1
};

export function generateFractalUVs(
  geometry: THREE.BufferGeometry,
  options: Partial<UVMappingOptions> = {}
): FractalUVResult {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const positionAttr = geometry.getAttribute('position');
  
  if (!positionAttr) {
    throw new Error('Geometry must have position attribute');
  }
  
  const vertexCount = positionAttr.count;
  const uvs = new Float32Array(vertexCount * 2);
  
  const positions = positionAttr.array as Float32Array;
  
  for (let i = 0; i < vertexCount; i++) {
    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    
    let u = 0, v = 0;
    
    switch (opts.mode) {
      case 'spherical':
        [u, v] = sphericalMapping(x, y, z);
        break;
      case 'cylindrical':
        [u, v] = cylindricalMapping(x, y, z);
        break;
      case 'planar':
        [u, v] = planarMapping(x, y, z);
        break;
      case 'box':
        [u, v] = boxMapping(x, y, z);
        break;
      case 'fractal-mandelbrot':
        [u, v] = mandelbrotMapping(x, y, z, opts.fractalIterations!, opts.fractalScale!);
        break;
      case 'fractal-julia':
        [u, v] = juliaMapping(x, y, z, opts.fractalIterations!, opts.fractalScale!);
        break;
      case 'fractal-perlin':
        [u, v] = perlinMapping(x, y, z, opts.fractalIterations!, opts.fractalScale!);
        break;
      case 'hexagonal':
        [u, v] = hexagonalMapping(x, y, z);
        break;
      case 'toroidal':
        [u, v] = toroidalMapping(x, y, z);
        break;
      case 'polar':
        [u, v] = polarMapping(x, y, z);
        break;
      case 'triplanar':
        [u, v] = triplanarMapping(x, y, z);
        break;
      default:
        [u, v] = sphericalMapping(x, y, z);
    }
    
    // Apply transformations
    [u, v] = applyUVTransform(u, v, opts);
    
    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }
  
  // Apply seam correction for seamless textures
  if (opts.seamless && (opts.mode === 'spherical' || opts.mode === 'cylindrical')) {
    correctSeams(uvs, positions, vertexCount);
  }
  
  return {
    uvs,
    metadata: {
      mode: opts.mode,
      vertexCount,
      hasSeamCorrection: opts.seamless ?? false
    }
  };
}

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

function sphericalMapping(x: number, y: number, z: number): [number, number] {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r === 0) return [0.5, 0.5];
  
  const theta = Math.atan2(y, x);
  const phi = Math.acos(Math.max(-1, Math.min(1, z / r)));
  
  const u = (theta + Math.PI) / (2 * Math.PI);
  const v = phi / Math.PI;
  
  return [u, v];
}

function cylindricalMapping(x: number, y: number, z: number): [number, number] {
  const theta = Math.atan2(y, x);
  const u = (theta + Math.PI) / (2 * Math.PI);
  const v = (z + 1) / 2;
  
  return [u, Math.max(0, Math.min(1, v))];
}

function planarMapping(x: number, y: number, _z: number): [number, number] {
  const u = (x + 1) / 2;
  const v = (y + 1) / 2;
  return [u, v];
}

function boxMapping(x: number, y: number, z: number): [number, number] {
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const absZ = Math.abs(z);
  
  let u: number, v: number;
  
  if (absX >= absY && absX >= absZ) {
    u = (z / absX + 1) / 2;
    v = (y / absX + 1) / 2;
  } else if (absY >= absX && absY >= absZ) {
    u = (x / absY + 1) / 2;
    v = (z / absY + 1) / 2;
  } else {
    u = (x / absZ + 1) / 2;
    v = (y / absZ + 1) / 2;
  }
  
  return [u, v];
}

function mandelbrotMapping(
  x: number, y: number, z: number,
  iterations: number, scale: number
): [number, number] {
  // Project 3D to 2D complex plane
  let real = x * scale;
  let imag = y * scale;
  
  const c_real = real;
  const c_imag = imag;
  
  let iter = 0;
  while (iter < iterations && real * real + imag * imag < 4) {
    const temp = real * real - imag * imag + c_real;
    imag = 2 * real * imag + c_imag;
    real = temp;
    iter++;
  }
  
  // Smooth coloring
  const smoothed = iter - Math.log2(Math.log2(real * real + imag * imag));
  const u = (smoothed / iterations) % 1;
  const v = Math.atan2(imag, real) / (2 * Math.PI) + 0.5;
  
  // Blend with z for 3D variation
  return [
    (u + z * 0.1) % 1,
    (v + z * 0.1) % 1
  ];
}

function juliaMapping(
  x: number, y: number, z: number,
  iterations: number, scale: number
): [number, number] {
  // Julia set constant (can be parameterized)
  const c_real = -0.7;
  const c_imag = 0.27;
  
  let real = x * scale;
  let imag = y * scale;
  
  let iter = 0;
  while (iter < iterations && real * real + imag * imag < 4) {
    const temp = real * real - imag * imag + c_real;
    imag = 2 * real * imag + c_imag;
    real = temp;
    iter++;
  }
  
  const u = iter / iterations;
  const v = (Math.atan2(imag, real) / Math.PI + 1) / 2;
  
  return [
    (u + z * 0.05) % 1,
    (v + z * 0.05) % 1
  ];
}

function perlinMapping(
  x: number, y: number, z: number,
  octaves: number, scale: number
): [number, number] {
  let noise = 0;
  let amplitude = 1;
  let frequency = scale;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    noise += perlinNoise3D(x * frequency, y * frequency, z * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  const normalizedNoise = (noise / maxValue + 1) / 2;
  
  // Create UV from noise + spherical coordinates
  const [baseU, baseV] = sphericalMapping(x, y, z);
  
  return [
    (baseU + normalizedNoise * 0.2) % 1,
    (baseV + normalizedNoise * 0.2) % 1
  ];
}

function hexagonalMapping(x: number, y: number, z: number): [number, number] {
  // Hexagonal grid mapping using axial coordinates
  const size = 0.5;
  
  // Convert to axial coordinates
  const q = (2/3 * x) / size;
  const r = (-1/3 * x + Math.sqrt(3)/3 * y) / size;
  
  // Cube coordinates
  const cubeX = q;
  const cubeZ = r;
  const cubeY = -cubeX - cubeZ;
  
  // Round to nearest hex
  let rx = Math.round(cubeX);
  let ry = Math.round(cubeY);
  let rz = Math.round(cubeZ);
  
  const xDiff = Math.abs(rx - cubeX);
  const yDiff = Math.abs(ry - cubeY);
  const zDiff = Math.abs(rz - cubeZ);
  
  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  }
  
  // Local position within hex
  const localX = cubeX - rx;
  const localY = cubeY - ry;
  
  const u = ((rx % 6) / 6 + localX * 0.1 + 0.5) % 1;
  const v = ((rz % 6) / 6 + localY * 0.1 + 0.5 + z * 0.1) % 1;
  
  return [u, v];
}

function toroidalMapping(x: number, y: number, z: number): [number, number] {
  // Torus-like wrapping
  const majorRadius = 1.5;
  
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);
  const phi = Math.atan2(z, r - majorRadius);
  
  const u = (theta + Math.PI) / (2 * Math.PI);
  const v = (phi + Math.PI) / (2 * Math.PI);
  
  return [u, v];
}

function polarMapping(x: number, y: number, z: number): [number, number] {
  const r = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);
  
  const u = r; // Radial distance as U
  const v = (theta + Math.PI) / (2 * Math.PI); // Angle as V
  
  return [Math.min(1, u), v];
}

function triplanarMapping(x: number, y: number, z: number): [number, number] {
  // Triplanar blending based on normal direction approximation
  const absX = Math.abs(x);
  const absY = Math.abs(y);
  const absZ = Math.abs(z);
  const total = absX + absY + absZ + 0.001;
  
  const weightX = absX / total;
  const weightY = absY / total;
  const weightZ = absZ / total;
  
  // Sample from each plane
  const uvX = [(z + 1) / 2, (y + 1) / 2];
  const uvY = [(x + 1) / 2, (z + 1) / 2];
  const uvZ = [(x + 1) / 2, (y + 1) / 2];
  
  // Blend
  const u = uvX[0] * weightX + uvY[0] * weightY + uvZ[0] * weightZ;
  const v = uvX[1] * weightX + uvY[1] * weightY + uvZ[1] * weightZ;
  
  return [u, v];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function applyUVTransform(
  u: number, v: number,
  options: UVMappingOptions
): [number, number] {
  // Apply scale
  u *= options.scale;
  v *= options.scale * options.aspect!;
  
  // Apply rotation
  if (options.rotation !== 0) {
    const cos = Math.cos(options.rotation);
    const sin = Math.sin(options.rotation);
    const cu = u - 0.5;
    const cv = v - 0.5;
    u = cu * cos - cv * sin + 0.5;
    v = cu * sin + cv * cos + 0.5;
  }
  
  // Apply offset
  u += options.offset.u;
  v += options.offset.v;
  
  // Wrap to [0, 1]
  u = ((u % 1) + 1) % 1;
  v = ((v % 1) + 1) % 1;
  
  return [u, v];
}

function correctSeams(
  uvs: Float32Array,
  positions: Float32Array,
  vertexCount: number
): void {
  // Find and correct seam discontinuities for spherical/cylindrical mapping
  for (let i = 0; i < vertexCount; i++) {
    const u = uvs[i * 2];
    
    // Check for seam wrap-around (u near 0 or 1)
    if (u < 0.1 || u > 0.9) {
      // Look at neighboring vertices to determine correct side
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      
      // Use position to determine which side of seam we should be on
      const angle = Math.atan2(y, x);
      if (angle < 0 && u > 0.5) {
        uvs[i * 2] = u - 1;
      } else if (angle > 0 && u < 0.5) {
        uvs[i * 2] = u + 1;
      }
    }
  }
}

// Simple 3D Perlin noise implementation
function perlinNoise3D(x: number, y: number, z: number): number {
  // Simplified noise function
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
  const noise1 = n - Math.floor(n);
  
  const m = Math.sin(x * 93.9898 + y * 67.345 + z * 89.234) * 23421.6312;
  const noise2 = m - Math.floor(m);
  
  const p = Math.sin(x * 45.2341 + y * 98.765 + z * 12.345) * 65432.1234;
  const noise3 = p - Math.floor(p);
  
  return (noise1 + noise2 + noise3) / 3 * 2 - 1;
}

// ============================================================================
// GEOMETRY INTEGRATION
// ============================================================================

export function applyFractalUVsToGeometry(
  geometry: THREE.BufferGeometry,
  options: Partial<UVMappingOptions> = {}
): THREE.BufferGeometry {
  const result = generateFractalUVs(geometry, options);
  
  geometry.setAttribute('uv', new THREE.BufferAttribute(result.uvs, 2));
  
  return geometry;
}

export function createUVMappedParametricGeometry(
  parametricFunction: (u: number, v: number) => THREE.Vector3,
  uSegments: number,
  vSegments: number,
  uvOptions: Partial<UVMappingOptions> = {}
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  
  const vertices: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const normals: number[] = [];
  
  // Generate vertices and initial UVs
  for (let j = 0; j <= vSegments; j++) {
    const v = j / vSegments;
    for (let i = 0; i <= uSegments; i++) {
      const u = i / uSegments;
      
      const point = parametricFunction(u, v);
      vertices.push(point.x, point.y, point.z);
      
      // Initial parametric UVs (will be remapped if fractal mode selected)
      uvs.push(u, v);
    }
  }
  
  // Generate indices for triangles
  for (let j = 0; j < vSegments; j++) {
    for (let i = 0; i < uSegments; i++) {
      const a = i + (uSegments + 1) * j;
      const b = i + (uSegments + 1) * (j + 1);
      const c = (i + 1) + (uSegments + 1) * (j + 1);
      const d = (i + 1) + (uSegments + 1) * j;
      
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }
  
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();
  
  // Apply fractal UV mapping if not using default parametric UVs
  if (uvOptions.mode && uvOptions.mode !== 'planar') {
    applyFractalUVsToGeometry(geometry, uvOptions);
  }
  
  return geometry;
}

// ============================================================================
// MODULO-BASED UV PATTERNS (From Master Algorithm List)
// ============================================================================

export const MODULO_UV_PATTERNS = {
  tiling: (u: number, v: number, tiles: number = 4): [number, number] => {
    return [(u * tiles) % 1, (v * tiles) % 1];
  },
  
  checker: (u: number, v: number, size: number = 8): [number, number] => {
    const cu = Math.floor(u * size) % 2;
    const cv = Math.floor(v * size) % 2;
    const checker = (cu + cv) % 2;
    return [u + checker * 0.001, v + checker * 0.001];
  },
  
  hexGrid: (u: number, v: number): [number, number] => {
    const col = Math.floor(u * 6);
    const row = Math.floor(v * 6);
    const offset = (row % 2) * 0.5 / 6;
    return [((u + offset) * 6) % 1, (v * 6) % 1];
  },
  
  spiral: (u: number, v: number, turns: number = 3): [number, number] => {
    const angle = u * 2 * Math.PI * turns;
    const radius = v;
    const su = (Math.cos(angle) * radius + 1) / 2;
    const sv = (Math.sin(angle) * radius + 1) / 2;
    return [su, sv];
  },
  
  radialSectors: (u: number, v: number, sectors: number = 6): [number, number] => {
    const angle = u * 2 * Math.PI;
    const sector = Math.floor(angle / (2 * Math.PI / sectors)) % sectors;
    const localAngle = (angle % (2 * Math.PI / sectors)) / (2 * Math.PI / sectors);
    return [localAngle, v];
  },
  
  wavePhase: (u: number, v: number, frequency: number = 4): [number, number] => {
    const phase = (u * frequency) % 1;
    const wave = Math.sin(phase * 2 * Math.PI) * 0.1;
    return [(u + wave) % 1, (v + wave * 0.5) % 1];
  },
  
  fractalLoop: (u: number, v: number, iterations: number = 4): [number, number] => {
    let fu = u, fv = v;
    for (let i = 0; i < iterations; i++) {
      const scale = Math.pow(2, i);
      fu = (fu * scale) % 1;
      fv = (fv * scale) % 1;
    }
    return [fu, fv];
  },
  
  colorCycle: (u: number, v: number, phases: number = 3): [number, number] => {
    const phase = Math.floor(u * phases) % phases;
    const localU = (u * phases) % 1;
    return [localU, (v + phase / phases) % 1];
  }
};

// ============================================================================
// EXPORT FOR GLB
// ============================================================================

export interface GLBUVExportData {
  uvs: Float32Array;
  uvs2?: Float32Array;
  tangents?: Float32Array;
  mappingMode: UVMappingMode;
  textureInfo: {
    wrap: 'repeat' | 'clamp' | 'mirror';
    minFilter: string;
    magFilter: string;
  };
}

export function prepareUVsForGLBExport(
  geometry: THREE.BufferGeometry,
  options: Partial<UVMappingOptions> = {}
): GLBUVExportData {
  const result = generateFractalUVs(geometry, options);
  
  return {
    uvs: result.uvs,
    mappingMode: result.metadata.mode,
    textureInfo: {
      wrap: 'repeat',
      minFilter: 'LinearMipmapLinearFilter',
      magFilter: 'LinearFilter'
    }
  };
}

export default {
  generateFractalUVs,
  applyFractalUVsToGeometry,
  createUVMappedParametricGeometry,
  prepareUVsForGLBExport,
  MODULO_UV_PATTERNS
};
