/**
 * EXTENDED CRYSTAL STRUCTURES
 * BCC, HCP, and common mineral lattices
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const EXTENDED_CRYSTALS: Record<string, ParametricSurface> = {
  // Body-Centered Cubic (BCC)
  bcc_lattice: {
    name: "⬛ BCC Lattice",
    equation: (u, v, params) => {
      const latticeConstant = params.a ?? 1;
      const atomRadius = params.b ?? 0.12;
      const cells = Math.floor(params.c ?? 2);
      
      const cellX = Math.floor(u * cells);
      const cellY = Math.floor(v * cells);
      const cellZ = 0;
      
      const localU = (u * cells) % 1;
      const localV = (v * cells) % 1;
      
      // BCC has atoms at corners + center
      const isCenter = localU > 0.4 && localU < 0.6 && localV > 0.4 && localV < 0.6;
      
      const theta = localU * Math.PI;
      const phi = localV * 2 * Math.PI;
      
      const atomX = cellX * latticeConstant + (isCenter ? 0.5 : 0) * latticeConstant;
      const atomY = cellY * latticeConstant + (isCenter ? 0.5 : 0) * latticeConstant;
      const atomZ = (isCenter ? 0.5 : 0) * latticeConstant;
      
      const x = atomX + atomRadius * Math.sin(theta) * Math.cos(phi);
      const y = atomY + atomRadius * Math.sin(theta) * Math.sin(phi);
      const z = atomZ + atomRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 0.12, c: 2,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 64
    }
  },

  // Hexagonal Close-Packed (HCP)
  hcp_lattice: {
    name: "⬡ HCP Lattice",
    equation: (u, v, params) => {
      const a = params.a ?? 1; // Lattice constant
      const cOverA = params.b ?? 1.633; // Ideal c/a ratio
      const atomRadius = params.c ?? 0.12;
      
      // Hexagonal layers
      const layer = Math.floor(u * 3);
      const localU = (u * 3) % 1;
      
      const angle = v * 2 * Math.PI / 6;
      const hexRadius = a;
      
      // Offset for ABAB stacking
      const offsetX = (layer % 2) * a * 0.5;
      const offsetY = (layer % 2) * a * Math.sqrt(3) / 6;
      
      const theta = localU * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const baseX = hexRadius * Math.cos(angle) + offsetX;
      const baseY = hexRadius * Math.sin(angle) + offsetY;
      const baseZ = layer * a * cOverA / 3;
      
      const x = baseX + atomRadius * Math.sin(theta) * Math.cos(phi);
      const y = baseY + atomRadius * Math.sin(theta) * Math.sin(phi);
      const z = baseZ + atomRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 1.633, c: 0.12,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 36
    }
  },

  // Diamond cubic lattice
  diamond_cubic: {
    name: "💎 Diamond Cubic",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const atomRadius = params.b ?? 0.1;
      
      // Two interpenetrating FCC lattices
      const sublattice = v < 0.5 ? 0 : 1;
      const localV = (v * 2) % 1;
      
      const cellX = Math.floor(u * 2);
      const cellY = Math.floor(localV * 2);
      
      const offset = sublattice * a * 0.25;
      
      const theta = u * Math.PI;
      const phi = localV * 2 * Math.PI;
      
      const x = cellX * a + offset + atomRadius * Math.sin(theta) * Math.cos(phi);
      const y = cellY * a + offset + atomRadius * Math.sin(theta) * Math.sin(phi);
      const z = offset + atomRadius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 0.1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Quartz crystal (hexagonal)
  quartz_crystal: {
    name: "🔮 Quartz Crystal",
    equation: (u, v, params) => {
      const size = params.a ?? 2;
      const prismHeight = params.b ?? 3;
      const pyramidHeight = params.c ?? 1;
      
      const height = (u - 0.5) * (prismHeight + 2 * pyramidHeight);
      const angle = v * 2 * Math.PI / 6; // Hexagonal
      
      // Hexagonal prism with pyramidal terminations
      let radius;
      if (Math.abs(height) > prismHeight / 2) {
        // Pyramid region
        const pyramidU = (Math.abs(height) - prismHeight / 2) / pyramidHeight;
        radius = size * (1 - pyramidU);
      } else {
        // Prism region
        radius = size;
      }
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 3, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 36
    }
  },

  // Calcite (rhombohedral)
  calcite_rhombohedron: {
    name: "📐 Calcite Crystal",
    equation: (u, v, params) => {
      const size = params.a ?? 2;
      
      // Rhombohedral shape (tilted cube)
      const tilt = Math.PI / 6;
      
      const faceIndex = Math.floor(v * 6);
      const localV = (v * 6) % 1;
      
      // Map to cube faces then tilt
      const cubeU = u;
      const cubeV = localV;
      
      let x, y, z;
      
      // Simple rhombohedron using transformed cube
      const s = (cubeU - 0.5) * size;
      const t = (cubeV - 0.5) * size;
      
      switch (faceIndex) {
        case 0: x = size/2; y = s; z = t; break;
        case 1: x = -size/2; y = s; z = t; break;
        case 2: y = size/2; x = s; z = t; break;
        case 3: y = -size/2; x = s; z = t; break;
        case 4: z = size/2; x = s; y = t; break;
        default: z = -size/2; x = s; y = t; break;
      }
      
      // Apply rhombohedral tilt
      const xRot = x;
      const yRot = y * Math.cos(tilt) - z * Math.sin(tilt);
      const zRot = y * Math.sin(tilt) + z * Math.cos(tilt);
      
      return [xRot, yRot, zRot];
    },
    defaultParams: {
      a: 2, b: 1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  }
};
