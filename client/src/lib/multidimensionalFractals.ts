/**
 * Multidimensional Fractal Shapes
 * 
 * Based on Kuan Peng's (彭宽) mathematical framework for extending complex numbers
 * to 3D, 4D, and higher dimensional spaces.
 * 
 * Reference: https://pengkuanonmaths.blogspot.com/2022/02/extending-complex-number-to-spaces-with.html
 * Author: Kuan Peng (彭宽)
 * 
 * These fractals use the 3D and 4D complex number system where:
 * - 3D: z = r * e^(i*θi) * e^(j*θj)
 * - 4D: z = r * e^(i*θi) * e^(j*θj) * e^(k*θk)
 */

import { SurfaceParameters } from '../types/math';
import { Complex3D, Complex4D, FractalComputer } from './multidimensionalComplex';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 48, vSegments: 48,
    ...overrides
  };
}

/**
 * Sample fractal isosurface using marching cubes approach
 * Returns points on the fractal boundary
 */
function sampleFractalBoundary(
  computeFunc: (x: number, y: number, z: number) => number,
  range: number,
  threshold: number
): number[][] {
  const points: number[][] = [];
  const samples = 32;
  const step = (range * 2) / samples;
  
  for (let ix = 0; ix < samples; ix++) {
    for (let iy = 0; iy < samples; iy++) {
      for (let iz = 0; iz < samples; iz++) {
        const x = -range + ix * step;
        const y = -range + iy * step;
        const z = -range + iz * step;
        
        const value = computeFunc(x, y, z);
        
        if (Math.abs(value - threshold) < 0.1) {
          points.push([x, y, z]);
        }
      }
    }
  }
  
  return points;
}

export const MULTIDIMENSIONAL_FRACTALS: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // 3D MANDELBROT SETS
  // ============================================================================
  
  mandelbrot_3d: {
    name: "🌀 3D Mandelbrot Set - Kuan Peng Extension",
    equation: (u, v, params) => {
      const a = Math.max(0.1, params.a ?? 2);
      const maxIter = Math.max(1, Math.min(100, Math.floor(params.d ?? 20)));
      const bailout = Math.max(2, params.e ?? 4);
      const scale = Math.max(0.1, params.b ?? 1.5);
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const r = scale;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.mandelbrot3D(c, maxIter, bailout);
      
      const t = Math.max(0, Math.min(1, result.iterations / maxIter));
      const radius = a * (0.5 + t * 0.5);
      
      return [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, d: 20, e: 4, b: 1.5,
      uSegments: 64, vSegments: 48 
    })
  },

  mandelbrot_3d_slice: {
    name: "🔪 3D Mandelbrot Cross-Section",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const maxIter = Math.floor(params.d ?? 25);
      const bailout = params.e ?? 4;
      const sliceHeight = params.f ?? 0;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = sliceHeight;
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.mandelbrot3D(c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const height = t * 0.5;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, d: 25, e: 4, f: 0,
      uSegments: 96, vSegments: 96 
    })
  },

  // ============================================================================
  // 3D JULIA SETS
  // ============================================================================
  
  julia_3d_classic: {
    name: "🎭 3D Julia Set - Classic Parameters",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;
      const maxIter = Math.floor(params.d ?? 20);
      const bailout = params.e ?? 4;
      const cx = params.f ?? -0.4;
      const cy = params.g ?? 0.6;
      const cz = params.h ?? 0.0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(cx, cy, cz);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const scale = 0.8 + t * 0.4;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, d: 20, e: 4,
      f: -0.4, g: 0.6, h: 0.0,
      uSegments: 64, vSegments: 48 
    })
  },

  julia_3d_dragon: {
    name: "🐉 3D Julia Dragon",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const maxIter = Math.floor(params.d ?? 18);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(-0.8, 0.156, 0.2);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const scale = 0.7 + t * 0.5;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.5, d: 18, e: 4,
      uSegments: 72, vSegments: 54 
    })
  },

  julia_3d_spiral: {
    name: "🌪️ 3D Julia Spiral",
    equation: (u, v, params) => {
      const a = params.a ?? 1.6;
      const maxIter = Math.floor(params.d ?? 22);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(0.285, 0.01, -0.3);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const scale = 0.75 + t * 0.45;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.6, d: 22, e: 4,
      uSegments: 64, vSegments: 48 
    })
  },

  julia_3d_coral: {
    name: "🪸 3D Julia Coral",
    equation: (u, v, params) => {
      const a = params.a ?? 1.4;
      const maxIter = Math.floor(params.d ?? 24);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(-0.162, -0.648, 0.1);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const scale = 0.8 + t * 0.4;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.4, d: 24, e: 4,
      uSegments: 80, vSegments: 60 
    })
  },

  // ============================================================================
  // MULTIBROT VARIATIONS (Higher Powers)
  // ============================================================================
  
  multibrot_3d_cubic: {
    name: "🎲 3D Cubic Mandelbrot (z³+c)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;
      const maxIter = Math.floor(params.d ?? 16);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = Math.sin(u * Math.PI) * Math.cos(v * Math.PI) * a * 0.5;
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.multibrot3D(
        new Complex3D(0, 0, 0),
        c,
        3,
        maxIter,
        bailout
      );
      
      const t = result.iterations / maxIter;
      const height = t * 0.6;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, d: 16, e: 4,
      uSegments: 80, vSegments: 80 
    })
  },

  multibrot_3d_quartic: {
    name: "⬛ 3D Quartic Mandelbrot (z⁴+c)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.6;
      const maxIter = Math.floor(params.d ?? 14);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2) * a * 0.3;
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.multibrot3D(
        new Complex3D(0, 0, 0),
        c,
        4,
        maxIter,
        bailout
      );
      
      const t = result.iterations / maxIter;
      const height = t * 0.5;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.6, d: 14, e: 4,
      uSegments: 72, vSegments: 72 
    })
  },

  multibrot_3d_quintic: {
    name: "⭐ 3D Quintic Mandelbrot (z⁵+c)",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const maxIter = Math.floor(params.d ?? 12);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = a * (0.3 + Math.abs(Math.sin(theta * 2.5)) * 0.7);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.multibrot3D(
        new Complex3D(0, 0, 0),
        c,
        5,
        maxIter,
        bailout
      );
      
      const t = result.iterations / maxIter;
      const scale = 0.8 + t * 0.4;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.5, d: 12, e: 4,
      uSegments: 80, vSegments: 60 
    })
  },

  // ============================================================================
  // BURNING SHIP 3D
  // ============================================================================
  
  burning_ship_3d: {
    name: "🔥 3D Burning Ship Fractal",
    equation: (u, v, params) => {
      const a = params.a ?? 1.8;
      const maxIter = Math.floor(params.d ?? 20);
      const bailout = params.e ?? 4;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      
      let zx = 0, zy = 0, zz = 0;
      let iter = 0;
      
      while (iter < maxIter && (zx*zx + zy*zy + zz*zz) < bailout) {
        const absX = Math.abs(zx);
        const absY = Math.abs(zy);
        const absZ = Math.abs(zz);
        
        const newX = absX * absX - absY * absY - absZ * absZ + x;
        const newY = 2 * absX * absY + y;
        const newZ = 2 * absX * absZ;
        
        zx = newX;
        zy = newY;
        zz = newZ;
        iter++;
      }
      
      const t = iter / maxIter;
      const height = t * 0.6;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.8, d: 20, e: 4,
      uSegments: 96, vSegments: 96 
    })
  },

  // ============================================================================
  // 4D PROJECTIONS
  // ============================================================================
  
  mandelbrot_4d_projection: {
    name: "🌐 4D Mandelbrot Projection to 3D",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;
      const maxIter = Math.floor(params.d ?? 16);
      const bailout = params.e ?? 4;
      const wSlice = params.f ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      const w = wSlice;
      
      const c = Complex4D.fromCartesian(x, y, z, w);
      const result = FractalComputer.mandelbrot4D(c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const scale = 0.7 + t * 0.5;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.5, d: 16, e: 4, f: 0,
      uSegments: 64, vSegments: 48 
    })
  },

  julia_4d_projection: {
    name: "🎪 4D Julia Set Projection",
    equation: (u, v, params) => {
      const a = params.a ?? 1.4;
      const maxIter = Math.floor(params.d ?? 18);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      const w = 0;
      
      let z4d = Complex4D.fromCartesian(x, y, z, w);
      const c = Complex4D.fromCartesian(-0.3, 0.5, 0.4, 0.2);
      
      let iter = 0;
      while (iter < maxIter && z4d.modulus() < bailout) {
        z4d = z4d.square().add(c);
        iter++;
      }
      
      const projected = z4d.projectTo3D();
      const cart = projected.toCartesian();
      
      const t = iter / maxIter;
      const scale = 0.7 + t * 0.4;
      
      return [
        cart.h * scale,
        cart.i * scale,
        cart.j * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.4, d: 18, e: 4,
      uSegments: 72, vSegments: 54 
    })
  },

  // ============================================================================
  // MANDELBOX VARIATIONS
  // ============================================================================
  
  mandelbox_3d: {
    name: "📦 3D Mandelbox Fractal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const scale = params.b ?? -1.5;
      const maxIter = Math.floor(params.d ?? 8);
      const foldingLimit = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let x = a * Math.sin(phi) * Math.cos(theta);
      let y = a * Math.sin(phi) * Math.sin(theta);
      let z = a * Math.cos(phi);
      
      const cx = x, cy = y, cz = z;
      
      for (let i = 0; i < maxIter; i++) {
        if (x > foldingLimit) x = 2 * foldingLimit - x;
        else if (x < -foldingLimit) x = -2 * foldingLimit - x;
        
        if (y > foldingLimit) y = 2 * foldingLimit - y;
        else if (y < -foldingLimit) y = -2 * foldingLimit - y;
        
        if (z > foldingLimit) z = 2 * foldingLimit - z;
        else if (z < -foldingLimit) z = -2 * foldingLimit - z;
        
        const r2 = x * x + y * y + z * z;
        
        if (r2 < 0.25) {
          x *= 4;
          y *= 4;
          z *= 4;
        } else if (r2 < 1) {
          const temp = 1 / r2;
          x *= temp;
          y *= temp;
          z *= temp;
        }
        
        x = scale * x + cx;
        y = scale * y + cy;
        z = scale * z + cz;
      }
      
      return [x * 0.3, y * 0.3, z * 0.3];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, b: -1.5, d: 8, e: 1,
      uSegments: 64, vSegments: 48 
    })
  },

  // ============================================================================
  // NEWTON FRACTALS 3D
  // ============================================================================
  
  newton_fractal_3d: {
    name: "🔬 3D Newton Fractal (z³-1)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const maxIter = Math.floor(params.d ?? 20);
      const tolerance = params.e ?? 0.001;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let x = a * Math.sin(phi) * Math.cos(theta);
      let y = a * Math.sin(phi) * Math.sin(theta);
      let z = a * Math.cos(phi);
      
      let iter = 0;
      
      while (iter < maxIter) {
        const r2 = x*x + y*y + z*z;
        if (r2 < tolerance) break;
        
        const r = Math.sqrt(r2);
        const r3 = r * r2;
        
        const fx = r3 - 1;
        const dfx = 3 * r2;
        
        if (Math.abs(dfx) < tolerance) break;
        
        const ratio = fx / dfx;
        x -= ratio * x / r;
        y -= ratio * y / r;
        z -= ratio * z / r;
        
        iter++;
      }
      
      const t = iter / maxIter;
      const scale = 0.5 + t * 0.5;
      
      return [
        x * scale,
        y * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, d: 20, e: 0.001,
      uSegments: 72, vSegments: 54 
    })
  },

  // ============================================================================
  // BUDDHABROT 3D (Statistical Rendering)
  // ============================================================================
  
  buddhabrot_3d: {
    name: "🧘 3D Buddhabrot Fractal",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const maxIter = Math.floor(params.d ?? 30);
      const bailout = params.e ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = (u - 0.5) * a * 2;
      const y = (v - 0.5) * a * 2;
      const z = Math.sin(theta) * Math.cos(phi) * a * 0.3;
      
      const c = Complex3D.fromCartesian(x, y, z);
      let z3d = new Complex3D(0, 0, 0);
      
      const path: number[][] = [];
      let iter = 0;
      
      while (iter < maxIter && z3d.modulus() < bailout) {
        z3d = z3d.square().add(c);
        const cart = z3d.toCartesian();
        path.push([cart.h, cart.i, cart.j]);
        iter++;
      }
      
      if (z3d.modulus() >= bailout && path.length > 5) {
        const idx = Math.floor(v * path.length);
        const point = path[Math.min(idx, path.length - 1)];
        return [point[0] * 0.5, point[1] * 0.5, point[2] * 0.5];
      }
      
      return [x * 0.3, y * 0.3, z * 0.3];
    },
    defaultParams: getCleanDefaults({ 
      a: 2, d: 30, e: 4,
      uSegments: 96, vSegments: 96 
    })
  },

  // ============================================================================
  // HEIGHT-MAPPED FRACTAL TERRAINS
  // ============================================================================

  mandelbrot_heightmap: {
    name: "🏔️ Mandelbrot Height Terrain",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const heightScale = params.c ?? 2;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      const offsetX = params.f ?? -0.5;
      const offsetY = params.g ?? 0;
      
      const x = (u - 0.5) * rangeX + offsetX;
      const y = (v - 0.5) * rangeY + offsetY;
      const z = 0;
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.mandelbrot3D(c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const height = t * heightScale;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 2, d: 50, e: 4,
      f: -0.5, g: 0,
      uSegments: 128, vSegments: 128 
    })
  },

  mandelbrot_depth_field: {
    name: "🌊 Mandelbrot Depth Field",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const depthScale = params.c ?? 1.5;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      const layerDepth = params.h ?? 0;
      
      const x = (u - 0.5) * rangeX - 0.5;
      const y = (v - 0.5) * rangeY;
      const z = layerDepth;
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.mandelbrot3D(c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const depth = t * depthScale;
      
      return [x, y, -depth];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 1.5, d: 50, e: 4, h: 0,
      uSegments: 96, vSegments: 96 
    })
  },

  julia_heightmap: {
    name: "🗻 Julia Set Height Terrain",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const heightScale = params.c ?? 2;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      const cx = params.f ?? -0.4;
      const cy = params.g ?? 0.6;
      const cz = params.h ?? 0.0;
      
      const x = (u - 0.5) * rangeX;
      const y = (v - 0.5) * rangeY;
      const z = 0;
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(cx, cy, cz);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const height = t * heightScale;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 2, d: 50, e: 4,
      f: -0.4, g: 0.6, h: 0.0,
      uSegments: 128, vSegments: 128 
    })
  },

  julia_depth_canyon: {
    name: "🏜️ Julia Depth Canyon",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const depthScale = params.c ?? 2.5;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      const cx = params.f ?? 0.285;
      const cy = params.g ?? 0.01;
      const cz = params.h ?? 0.0;
      
      const x = (u - 0.5) * rangeX;
      const y = (v - 0.5) * rangeY;
      const z = 0;
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(cx, cy, cz);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const depth = (1 - t) * depthScale;
      
      return [x, y, -depth];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 2.5, d: 50, e: 4,
      f: 0.285, g: 0.01, h: 0.0,
      uSegments: 128, vSegments: 128 
    })
  },

  burning_ship_heightmap: {
    name: "⛰️ Burning Ship Height Terrain",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const heightScale = params.c ?? 2;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      
      const x = (u - 0.5) * rangeX - 0.5;
      const y = (v - 0.5) * rangeY - 0.5;
      const z = 0;
      
      const c = Complex3D.fromCartesian(x, y, z);
      let z3d = new Complex3D(0, 0, 0);
      
      let iter = 0;
      while (iter < maxIter && z3d.modulus() < bailout) {
        const cart = z3d.toCartesian();
        z3d = Complex3D.fromCartesian(
          Math.abs(cart.h),
          Math.abs(cart.i),
          Math.abs(cart.j)
        );
        z3d = z3d.square().add(c);
        iter++;
      }
      
      const t = iter / maxIter;
      const height = t * heightScale;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 2, d: 50, e: 4,
      uSegments: 96, vSegments: 96 
    })
  },

  multibrot_heightmap: {
    name: "🏔️ Multibrot Height Landscape",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 3;
      const rangeY = params.b ?? 3;
      const heightScale = params.c ?? 2;
      const power = params.k ?? 3;
      const maxIter = Math.floor(params.d ?? 50);
      const bailout = params.e ?? 4;
      
      const x = (u - 0.5) * rangeX - 0.5;
      const y = (v - 0.5) * rangeY;
      const z = 0;
      
      const c = Complex3D.fromCartesian(x, y, z);
      let z3d = new Complex3D(0, 0, 0);
      
      let iter = 0;
      while (iter < maxIter && z3d.modulus() < bailout) {
        z3d = z3d.power(power).add(c);
        iter++;
      }
      
      const t = iter / maxIter;
      const height = t * heightScale;
      
      return [x, y, height];
    },
    defaultParams: getCleanDefaults({ 
      a: 3, b: 3, c: 2, d: 50, e: 4, k: 3,
      uSegments: 96, vSegments: 96 
    })
  },

  // ============================================================================
  // LAYERED DEPTH SLICES
  // ============================================================================

  mandelbrot_layer_stack: {
    name: "📚 Mandelbrot Layered Depth Stack",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 2.5;
      const rangeY = params.b ?? 2.5;
      const numLayers = Math.floor(params.l ?? 5);
      const layerSpacing = params.m ?? 0.3;
      const maxIter = Math.floor(params.d ?? 40);
      const bailout = params.e ?? 4;
      
      const layerIndex = Math.floor(v * numLayers);
      const vLocal = (v * numLayers) - layerIndex;
      
      const x = (u - 0.5) * rangeX - 0.5;
      const y = (vLocal - 0.5) * rangeY;
      const z = layerIndex * layerSpacing - (numLayers * layerSpacing / 2);
      
      const c = Complex3D.fromCartesian(x, y, z);
      const result = FractalComputer.mandelbrot3D(c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const offset = t * 0.2;
      
      return [x + offset, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.5, b: 2.5, d: 40, e: 4,
      l: 5, m: 0.3,
      uSegments: 96, vSegments: 96 
    })
  },

  julia_layer_stack: {
    name: "🎚️ Julia Layered Depth Stack",
    equation: (u, v, params) => {
      const rangeX = params.a ?? 2.5;
      const rangeY = params.b ?? 2.5;
      const numLayers = Math.floor(params.l ?? 5);
      const layerSpacing = params.m ?? 0.3;
      const maxIter = Math.floor(params.d ?? 40);
      const bailout = params.e ?? 4;
      const cx = params.f ?? -0.4;
      const cy = params.g ?? 0.6;
      const cz = params.h ?? 0.0;
      
      const layerIndex = Math.floor(v * numLayers);
      const vLocal = (v * numLayers) - layerIndex;
      
      const x = (u - 0.5) * rangeX;
      const y = (vLocal - 0.5) * rangeY;
      const z = layerIndex * layerSpacing - (numLayers * layerSpacing / 2);
      
      const z0 = Complex3D.fromCartesian(x, y, z);
      const c = Complex3D.fromCartesian(cx, cy, cz);
      const result = FractalComputer.julia3D(z0, c, maxIter, bailout);
      
      const t = result.iterations / maxIter;
      const offset = t * 0.2;
      
      return [x, y + offset, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 2.5, b: 2.5, d: 40, e: 4,
      f: -0.4, g: 0.6, h: 0.0,
      l: 5, m: 0.3,
      uSegments: 96, vSegments: 96 
    })
  }
};
