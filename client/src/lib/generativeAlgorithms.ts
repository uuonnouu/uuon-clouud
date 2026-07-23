import { SurfaceParameters } from '../types/math';

/**
 * GENERATIVE ALGORITHMS - L-SYSTEMS LIBRARY
 * 
 * Grammar-based generative systems for creating fractal plant-like structures,
 * space-filling curves, and organic patterns through recursive string rewriting.
 * 
 * L-Systems (Lindenmayer Systems) use production rules to generate complex
 * structures from simple axioms, mimicking biological growth patterns.
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

export const GENERATIVE_ALGORITHMS: Record<string, ParametricSurface> = {
  
  // L-TREE: Classic branching tree structure
  // Axiom: F, Rule: F -> F[+F]F[-F]F
  l_tree: {
    name: "🌳 L-Tree - Fractal Branching System",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;     // Branch length scale
      const b = params.b ?? 0.7;     // Branch reduction factor
      const c = params.c ?? 1.0;     // Vertical growth
      const d = params.d ?? 25;      // Branch angle (degrees)
      const e = params.e ?? 0;       // Azimuthal rotation
      const f = params.f ?? 0;       // Twist factor
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 3;       // Recursive depth (1-6)
      
      // Limit recursion depth
      const depth = Math.max(1, Math.min(6, Math.floor(h)));
      
      // Traverse tree structure using u,v
      const branchIndex = Math.floor(u * Math.pow(2, depth));
      const branchPosition = v;
      
      // Calculate branch path using binary tree structure
      let x = 0, y = 0, z = 0;
      let angle = 0;
      let currentLength = Math.max(0.1, a);
      
      for (let level = 0; level < depth; level++) {
        const bit = (branchIndex >> (depth - level - 1)) & 1;
        const branchAngle = (bit === 0 ? -Math.max(5, Math.min(90, d)) : Math.max(5, Math.min(90, d))) * Math.PI / 180;
        
        // Apply rotation with bounds
        angle += branchAngle + Math.max(-180, Math.min(180, e)) * Math.PI / 180;
        
        // Calculate segment with bounds checking
        const segmentLength = Math.max(0, currentLength * Math.max(0, Math.min(1, branchPosition)));
        x += segmentLength * Math.sin(angle);
        z += segmentLength * Math.cos(angle);
        y += segmentLength * Math.max(0.1, c) * 0.5;
        
        // Prevent infinite growth
        if (Math.abs(x) > 50 || Math.abs(y) > 50 || Math.abs(z) > 50) {
          break;
        }
        
        // Add controlled turbulence
        if (g > 0) {
          const turbulenceAmount = Math.max(0, Math.min(1, g));
          x += turbulenceAmount * Math.sin(u * 10 + level) * 0.1;
          z += turbulenceAmount * Math.cos(v * 10 + level) * 0.1;
        }
        
        // Reduce branch length with minimum threshold
        currentLength *= Math.max(0.1, Math.min(0.9, b));
      }
      
      // Add twist
      if (f !== 0) {
        const twist = f * branchPosition;
        const tx = x * Math.cos(twist) - z * Math.sin(twist);
        const tz = x * Math.sin(twist) + z * Math.cos(twist);
        x = tx;
        z = tz;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.7, c: 1.0, d: 25, h: 3, uSegments: 64, vSegments: 32 })
  },

  // FRACTAL BUSH: Dense branching structure
  // Multiple branches per node creating bushy appearance
  fractal_bush: {
    name: "🌿 Fractal Bush - Dense Branching Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 1.2;     // Size scale
      const b = params.b ?? 0.65;    // Branch shrink factor
      const c = params.c ?? 0.8;     // Height compression
      const d = params.d ?? 30;      // Primary angle
      const e = params.e ?? 120;     // Secondary angle offset
      const f = params.f ?? 0;       // Spiral twist
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 4;       // Recursive depth
      
      const depth = Math.max(1, Math.min(5, Math.floor(h)));
      
      // Three branches per node
      const branchCount = 3;
      const totalBranches = Math.pow(branchCount, depth);
      const branchIndex = Math.floor(u * totalBranches) % totalBranches;
      const t = v;
      
      let x = 0, y = 0, z = 0;
      let currentSize = a;
      
      for (let level = 0; level < depth; level++) {
        const branch = Math.floor(branchIndex / Math.pow(branchCount, depth - level - 1)) % branchCount;
        
        // Three-way branching
        const angleOffset = (branch - 1) * (e * Math.PI / 180);
        const theta = (d * Math.PI / 180) + angleOffset;
        const phi = u * 2 * Math.PI + f * level;
        
        // Add turbulent displacement
        const turbulence = g * Math.sin(u * 20 + level * 3) * Math.cos(v * 15 + level * 2) * 0.1;
        
        x += currentSize * t * Math.sin(theta) * Math.cos(phi) + turbulence;
        z += currentSize * t * Math.sin(theta) * Math.sin(phi) + turbulence;
        y += currentSize * t * Math.cos(theta) * c;
        
        currentSize *= b;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.2, b: 0.65, c: 0.8, d: 30, e: 120, h: 4, uSegments: 128, vSegments: 48 })
  },

  // HILBERT CURVE 3D: Space-filling curve in three dimensions
  hilbert_3d_curve: {
    name: "🔷 Hilbert 3D - Space-Filling Curve",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Cube size
      const b = params.b ?? 1.0;     // Thickness
      const c = params.c ?? 1.0;     // Z-depth scale
      const d = params.d ?? 1.0;     // Smoothing factor
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 3;       // Iteration depth
      
      const order = Math.max(1, Math.min(5, Math.floor(h)));
      const n = Math.pow(2, order);
      const totalPoints = n * n * n;
      
      // Map u to position along curve
      const index = Math.floor(u * totalPoints);
      
      // Hilbert 3D mapping function
      function hilbert3D(i: number, order: number): [number, number, number] {
        let x = 0, y = 0, z = 0;
        for (let s = 1; s < (1 << order); s *= 2) {
          const rx = 1 & (i / 2);
          const ry = 1 & (i ^ rx);
          const rz = 1 & (i / 4);
          
          if (ry === 0) {
            if (rx === 1) {
              x = s - 1 - x;
              y = s - 1 - y;
            }
            [x, y] = [y, x];
          }
          
          x += s * rx;
          y += s * ry;
          z += s * rz;
          i = Math.floor(i / 4);
        }
        return [x, y, z];
      }
      
      let [hx, hy, hz] = hilbert3D(index, order);
      
      // Normalize to [-1, 1]
      hx = (hx / n - 0.5) * 2 * a;
      hy = (hy / n - 0.5) * 2 * a;
      hz = (hz / n - 0.5) * 2 * a * c;
      
      // Add thickness tube around curve
      const tubeRadius = b * 0.05;
      const tubeAngle = v * 2 * Math.PI;
      hx += tubeRadius * Math.cos(tubeAngle);
      hy += tubeRadius * Math.sin(tubeAngle);
      
      // Add turbulence
      if (g > 0) {
        hx += g * Math.sin(u * 50 + hz) * 0.05;
        hy += g * Math.cos(u * 50 + hz) * 0.05;
        hz += g * Math.sin(v * 30 + hx) * 0.05;
      }
      
      return [hx, hy, hz];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 1.0, c: 1.0, h: 3, uSegments: 128, vSegments: 16 })
  },

  // DRAGON CURVE: Classic fractal curve with self-similarity
  dragon_curve_3d: {
    name: "🐉 Dragon Curve - Self-Similar Fractal",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;     // Size scale
      const b = params.b ?? 0.1;     // Thickness
      const c = params.c ?? 0.5;     // Z-elevation factor
      const d = params.d ?? 90;      // Turn angle
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 10;      // Iterations
      
      const iterations = Math.max(1, Math.min(15, Math.floor(h)));
      
      // Generate dragon curve sequence
      let sequence = '1';
      for (let i = 0; i < iterations; i++) {
        let next = sequence + '1';
        for (let j = sequence.length - 1; j >= 0; j--) {
          next += sequence[j] === '1' ? '0' : '1';
        }
        sequence = next;
      }
      
      const index = Math.floor(u * sequence.length);
      const t = v;
      
      // Trace path
      let x = 0, y = 0, z = 0;
      let angle = 0;
      const stepSize = a / Math.sqrt(sequence.length);
      
      for (let i = 0; i <= index && i < sequence.length; i++) {
        const turn = sequence[i] === '1' ? 1 : -1;
        angle += turn * (d * Math.PI / 180);
        
        const step = stepSize * t;
        x += step * Math.cos(angle);
        y += step * Math.sin(angle);
        z += step * Math.sin(i * 0.5) * c;
        
        // Turbulence
        if (g > 0) {
          x += g * Math.sin(i * 0.5 + u * 10) * 0.05;
          y += g * Math.cos(i * 0.5 + v * 10) * 0.05;
        }
      }
      
      // Add tube thickness
      const tubeAngle = v * 2 * Math.PI;
      x += b * Math.cos(tubeAngle) * 0.5;
      y += b * Math.sin(tubeAngle) * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.1, c: 0.5, d: 90, h: 10, uSegments: 96, vSegments: 16 })
  },

  // ALGAE GROWTH: Organic growth pattern using L-system
  // Axiom: A, Rules: A -> AB, B -> A
  algae_growth: {
    name: "🦠 Algae Growth - Fibonacci Expansion",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;     // Cell size
      const b = params.b ?? 0.618;   // Golden ratio factor
      const c = params.c ?? 1.0;     // Height variation
      const d = params.d ?? 137.5;   // Golden angle (degrees)
      const e = params.e ?? 0;       // Spiral tightness
      const g = params.g ?? 0;       // Turbulence
      const h = params.h ?? 8;       // Generation count
      
      const generations = Math.max(1, Math.min(12, Math.floor(h)));
      
      // Generate Fibonacci-like sequence (A -> AB, B -> A)
      let cellCount = 1;
      for (let i = 0; i < generations; i++) {
        cellCount = Math.floor(cellCount * b + 1);
      }
      
      const cellIndex = Math.floor(u * cellCount);
      const cellPhase = v;
      
      // Phyllotaxis arrangement (sunflower seed pattern)
      const angle = cellIndex * (d * Math.PI / 180);
      const radius = a * Math.sqrt(cellIndex + e);
      
      let x = radius * Math.cos(angle);
      let y = radius * Math.sin(angle);
      let z = c * Math.sin(cellIndex * 0.5) * cellPhase;
      
      // Add organic variation
      x += a * 0.3 * Math.cos(cellPhase * 2 * Math.PI);
      y += a * 0.3 * Math.sin(cellPhase * 2 * Math.PI);
      
      // Turbulence
      if (g > 0) {
        x += g * Math.sin(cellIndex * 0.8 + angle) * 0.2;
        y += g * Math.cos(cellIndex * 0.8 - angle) * 0.2;
        z += g * Math.sin(cellIndex * 1.2) * 0.1;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.0, b: 0.618, c: 1.0, d: 137.5, h: 8, uSegments: 64, vSegments: 32 })
  }
};
