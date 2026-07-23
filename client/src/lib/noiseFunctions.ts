import { SurfaceParameters } from '../types/math';

/**
 * NOISE FUNCTIONS LIBRARY
 * 
 * Procedural noise-based surfaces using Perlin and Simplex algorithms
 * for creating organic, natural-looking terrain, textures, and patterns.
 * 
 * Noise functions are fundamental to procedural generation, providing
 * controlled randomness that appears natural and coherent.
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// Clean defaults helper
function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

// Simple 2D Perlin-like noise implementation
function noise2D(x: number, y: number): number {
  // Ensure finite input values
  if (!isFinite(x) || !isFinite(y)) return 0;
  
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  const u = fade(x);
  const v = fade(y);
  
  // Hash coordinates with bounds checking
  const A = Math.abs((X + Y * 57) * 113) % 65536;
  const B = Math.abs((X + 1 + Y * 57) * 113) % 65536;
  const C = Math.abs((X + (Y + 1) * 57) * 113) % 65536;
  const D = Math.abs((X + 1 + (Y + 1) * 57) * 113) % 65536;
  
  const result = lerp(v,
    lerp(u, grad(A, x, y), grad(B, x - 1, y)),
    lerp(u, grad(C, x, y - 1), grad(D, x - 1, y - 1))
  );
  
  // Clamp result to reasonable bounds
  return Math.max(-1, Math.min(1, result));
}

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t: number, a: number, b: number): number {
  return a + t * (b - a);
}

function grad(hash: number, x: number, y: number): number {
  const h = hash & 3;
  const u = h < 2 ? x : y;
  const v = h < 2 ? y : x;
  return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
}

// Fractal Brownian Motion - layered noise
function fbm(x: number, y: number, octaves: number): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;
  
  for (let i = 0; i < octaves; i++) {
    value += noise2D(x * frequency, y * frequency) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  
  return value / maxValue;
}

// Turbulence - absolute value of noise
function turbulence(x: number, y: number, size: number): number {
  let value = 0;
  let initialSize = size;
  
  while (size >= 1) {
    value += Math.abs(noise2D(x / size, y / size)) * size;
    size /= 2;
  }
  
  return value / initialSize;
}

export const NOISE_FUNCTIONS: Record<string, ParametricSurface> = {
  
  // PERLIN TERRAIN: Classic heightmap terrain
  perlin_terrain: {
    name: "⛰️ Perlin Terrain - Procedural Landscape",
    equation: (u, v, params) => {
      const a = params.a ?? 4.0;     // Terrain size
      const b = params.b ?? 1.0;     // Height amplitude
      const c = params.c ?? 1.0;     // Height scale
      const d = params.d ?? 5.0;     // Frequency
      const e = params.e ?? 0;       // Offset X
      const f = params.f ?? 0;       // Offset Y
      const g = params.g ?? 0.5;     // Turbulence amount
      const h = params.h ?? 6;       // Octaves (detail level)
      
      const octaves = Math.max(1, Math.min(8, Math.floor(h)));
      
      // Map to terrain coordinates
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Generate multi-octave noise
      const noiseValue = fbm(x * d + e, y * d + f, octaves);
      
      // Add turbulence
      let height = noiseValue * b * c;
      if (g > 0) {
        const turb = turbulence(x * d + e, y * d + f, 32) * g * 0.3;
        height += turb;
      }
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ a: 4.0, b: 1.0, c: 1.0, d: 5.0, g: 0.5, h: 6, uSegments: 128, vSegments: 128 })
  },

  // SIMPLEX OCEAN: Wave-based ocean surface
  simplex_ocean_waves: {
    name: "🌊 Simplex Ocean - Dynamic Waves",
    equation: (u, v, params) => {
      const a = params.a ?? 5.0;     // Ocean size
      const b = params.b ?? 0.5;     // Wave height
      const c = params.c ?? 1.0;     // Wave complexity
      const d = params.d ?? 3.0;     // Wave frequency
      const e = params.e ?? 0;       // Time offset
      const g = params.g ?? 0.3;     // Turbulence (foam)
      const h = params.h ?? 5;       // Detail octaves
      
      const octaves = Math.max(1, Math.min(8, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Base wave pattern
      const wave1 = Math.sin(x * d + e) * Math.cos(y * d * 0.7 + e * 0.8);
      const wave2 = Math.sin(x * d * 1.3 - e * 0.5) * Math.cos(y * d * 1.1 - e * 0.6);
      
      // Layered noise for detail
      const detail = fbm(x * 2 + e * 0.1, y * 2 + e * 0.1, octaves);
      
      // Combine waves
      let z = (wave1 + wave2) * 0.5 * b;
      z += detail * b * 0.3 * c;
      
      // Add foam turbulence
      if (g > 0) {
        const foam = turbulence(x * 8 + e, y * 8 + e, 16) * g * 0.2;
        z += foam;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 5.0, b: 0.5, c: 1.0, d: 3.0, g: 0.3, h: 5, uSegments: 128, vSegments: 128 })
  },

  // TURBULENT CLOUDS: Volumetric cloud formation
  turbulent_clouds: {
    name: "☁️ Turbulent Clouds - Volumetric Formation",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;     // Cloud field size
      const b = params.b ?? 0.8;     // Height variation
      const c = params.c ?? 1.5;     // Puffiness
      const d = params.d ?? 4.0;     // Density frequency
      const e = params.e ?? 0;       // Wind drift
      const g = params.g ?? 0.8;     // Turbulence intensity
      const h = params.h ?? 6;       // Detail octaves
      
      const octaves = Math.max(1, Math.min(8, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Base cloud density
      const density = fbm(x * d + e, y * d + e * 0.7, octaves);
      
      // Turbulent displacement
      const turbX = turbulence(x * 3 + e, y * 3 + e, 32) * g * 0.5;
      const turbY = turbulence(x * 3.5 + e, y * 2.5 + e, 32) * g * 0.5;
      
      // Cloud puffiness (vertical displacement)
      const puff = Math.abs(density) * c;
      const z = (density + turbX * 0.5) * b + puff;
      
      // Apply turbulent offset to position
      const finalX = x + turbX * 0.3;
      const finalY = y + turbY * 0.3;
      
      return [finalX, finalY, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 0.8, c: 1.5, d: 4.0, g: 0.8, h: 6, uSegments: 96, vSegments: 96 })
  },

  // MARBLE TEXTURE: Marble-like swirl patterns
  marble_surface: {
    name: "🎨 Marble Surface - Swirled Texture",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;     // Pattern size
      const b = params.b ?? 0.3;     // Height depth
      const c = params.c ?? 1.0;     // Vein intensity
      const d = params.d ?? 8.0;     // Vein frequency
      const e = params.e ?? 0;       // Pattern rotation
      const g = params.g ?? 0.6;     // Turbulence (veining)
      const h = params.h ?? 5;       // Octaves
      
      const octaves = Math.max(1, Math.min(8, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Rotate coordinates
      const cosR = Math.cos(e);
      const sinR = Math.sin(e);
      const rx = x * cosR - y * sinR;
      const ry = x * sinR + y * cosR;
      
      // Create marble veins using turbulence
      const turbValue = turbulence(rx * 2, ry * 2, 64) * g;
      const pattern = Math.sin((rx + turbValue) * d);
      
      // Add fine detail
      const detail = fbm(rx * 5, ry * 5, octaves) * 0.2;
      
      // Combine for height
      const z = (pattern * c + detail) * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.5, b: 0.3, c: 1.0, d: 8.0, g: 0.6, h: 5, uSegments: 128, vSegments: 128 })
  },

  // WOOD GRAIN: Natural wood texture pattern
  wood_grain_surface: {
    name: "🪵 Wood Grain - Natural Texture",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Grain size
      const b = params.b ?? 0.15;    // Grain depth
      const c = params.c ?? 1.0;     // Ring intensity
      const d = params.d ?? 12.0;    // Ring frequency
      const e = params.e ?? 0;       // Grain direction
      const g = params.g ?? 0.4;     // Turbulence (knots)
      const h = params.h ?? 4;       // Detail octaves
      
      const octaves = Math.max(1, Math.min(6, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Rotate for grain direction
      const cosR = Math.cos(e);
      const sinR = Math.sin(e);
      const rx = x * cosR - y * sinR;
      const ry = x * sinR + y * cosR;
      
      // Distance from center (tree rings)
      const distance = Math.sqrt(rx * rx + ry * ry * 0.5);
      
      // Add turbulence for irregular rings and knots
      const turb = turbulence(rx * 3, ry * 3, 32) * g;
      const rings = Math.sin((distance + turb) * d);
      
      // Fine grain texture
      const grain = fbm(rx * 20, ry * 20, octaves) * 0.1;
      
      // Combine patterns
      const z = (rings * c + grain) * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 0.15, c: 1.0, d: 12.0, g: 0.4, h: 4, uSegments: 128, vSegments: 128 })
  }
};
