/**
 * POLYMER CHAIN CONFIGURATIONS
 * Different conformational states of polymer molecules
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const POLYMER_CHAINS: Record<string, ParametricSurface> = {
  // Random coil - entropy-driven random walk
  random_coil: {
    name: "🎲 Random Coil",
    equation: (u, v, params) => {
      const segments = params.a ?? 50;
      const segmentLength = params.b ?? 0.2;
      const randomness = params.c ?? 1;
      
      // Deterministic "random" walk using sin/cos combinations
      const n = Math.floor(u * segments);
      const t = u * segments;
      
      // Pseudo-random angles using multiple frequencies
      const theta = Math.sin(t * 2.7) * Math.PI + Math.cos(t * 1.3) * randomness;
      const phi = Math.cos(t * 3.1) * Math.PI + Math.sin(t * 1.7) * randomness;
      
      // Accumulate position along random walk
      let x = 0, y = 0, z = 0;
      for (let i = 0; i < n; i++) {
        const ti = i / segments;
        const th = Math.sin(ti * segments * 2.7) * Math.PI;
        const ph = Math.cos(ti * segments * 3.1) * Math.PI;
        x += segmentLength * Math.sin(th) * Math.cos(ph);
        y += segmentLength * Math.sin(th) * Math.sin(ph);
        z += segmentLength * Math.cos(th);
      }
      
      // Tube thickness
      const tubeRadius = 0.05;
      const circleAngle = v * 2 * Math.PI;
      
      // Normal vector (simplified)
      const nx = Math.cos(circleAngle);
      const ny = Math.sin(circleAngle);
      
      return [
        x + tubeRadius * nx,
        y + tubeRadius * ny,
        z + tubeRadius * Math.sin(circleAngle)
      ];
    },
    defaultParams: {
      a: 50, b: 0.2, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 12
    }
  },

  // Extended chain - fully stretched polymer
  extended_chain: {
    name: "📏 Extended Chain",
    equation: (u, v, params) => {
      const length = params.a ?? 10;
      const tubeRadius = params.b ?? 0.08;
      const zigzag = params.c ?? 0.1; // Slight zigzag from bond angles
      
      const t = u;
      const angle = v * 2 * Math.PI;
      
      // Slight zigzag to represent bond angles
      const zigzagAngle = Math.sin(t * Math.PI * 20) * zigzag;
      
      const x = t * length;
      const y = tubeRadius * Math.cos(angle) + zigzagAngle;
      const z = tubeRadius * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 10, b: 0.08, c: 0.1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 12
    }
  },

  // Collapsed globule - compact state
  collapsed_globule: {
    name: "⚫ Collapsed Globule",
    equation: (u, v, params) => {
      const radius = params.a ?? 1;
      const compactness = params.b ?? 0.9;
      const surfaceRoughness = params.c ?? 0.15;
      
      // Spherical base with perturbations
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Surface roughness using spherical harmonics
      const roughness = surfaceRoughness * (
        Math.sin(3 * theta) * Math.cos(4 * phi) +
        Math.cos(5 * theta) * Math.sin(3 * phi)
      );
      
      const r = radius * compactness + roughness;
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 0.9, c: 0.15,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Worm-like chain - semi-flexible polymer
  worm_like_chain: {
    name: "🪱 Worm-Like Chain",
    equation: (u, v, params) => {
      const length = params.a ?? 8;
      const persistence = params.b ?? 2; // Persistence length
      const tubeRadius = 0.06;
      
      const t = u;
      const angle = v * 2 * Math.PI;
      
      // Path with gradual bending (persistence length controls stiffness)
      const bendFreq = 1 / persistence;
      const bendX = Math.sin(t * Math.PI * bendFreq * 3) * persistence * 0.3;
      const bendY = Math.cos(t * Math.PI * bendFreq * 2) * persistence * 0.3;
      
      const pathX = t * length + bendX;
      const pathY = bendY;
      const pathZ = Math.sin(t * Math.PI * bendFreq * 1.5) * persistence * 0.2;
      
      // Tube around path
      const x = pathX + tubeRadius * Math.cos(angle);
      const y = pathY + tubeRadius * Math.sin(angle);
      const z = pathZ;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 8, b: 2, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 12
    }
  }
};
