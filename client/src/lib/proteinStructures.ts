/**
 * PROTEIN FOLDING STRUCTURES - AlphaFold Inspired Models
 * Common protein folds and secondary structures
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const PROTEIN_STRUCTURES: Record<string, ParametricSurface> = {
  // Alpha helix - right-handed helical structure (3.6 residues per turn)
  alpha_helix: {
    name: "🧬 Alpha Helix",
    equation: (u, v, params) => {
      const radius = params.a ?? 0.5;
      const pitch = params.b ?? 0.54; // Rise per residue
      const turns = params.c ?? 5;
      const backbone_radius = 0.1;
      
      const t = u * turns * 2 * Math.PI;
      const height = u * turns * pitch * 3.6;
      
      // Main helix backbone
      const x = radius * Math.cos(t) + backbone_radius * Math.cos(v * 2 * Math.PI) * Math.cos(t);
      const y = radius * Math.sin(t) + backbone_radius * Math.cos(v * 2 * Math.PI) * Math.sin(t);
      const z = height + backbone_radius * Math.sin(v * 2 * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 0.5, b: 0.54, c: 5,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 16
    }
  },

  // Beta sheet - pleated sheet structure
  beta_sheet: {
    name: "📄 Beta Sheet",
    equation: (u, v, params) => {
      const width = params.a ?? 3;
      const strands = Math.floor(params.b ?? 5);
      const amplitude = params.c ?? 0.3;
      
      const strandWidth = width / strands;
      const strandIndex = Math.floor(v * strands);
      const localV = (v * strands) - strandIndex;
      
      // Pleated structure (alternating up/down)
      const pleat = amplitude * Math.sin(u * Math.PI * 6);
      const direction = (strandIndex % 2 === 0) ? 1 : -1; // Antiparallel
      
      const x = direction * (u - 0.5) * width;
      const y = (strandIndex - strands/2) * strandWidth;
      const z = pleat * Math.cos(localV * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 3, b: 5, c: 0.3,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // TIM barrel (triose phosphate isomerase) - 8-fold alpha/beta barrel
  tim_barrel: {
    name: "🛢️ TIM Barrel",
    equation: (u, v, params) => {
      const radius = params.a ?? 2;
      const height = params.b ?? 4;
      const folds = 8; // Classic TIM barrel has 8 alpha/beta repeats
      
      const angle = u * 2 * Math.PI;
      const z = (v - 0.5) * height;
      
      // Alternating alpha helices (outer) and beta strands (inner)
      const foldAngle = Math.floor(u * folds) * (2 * Math.PI / folds);
      const localU = (u * folds) % 1;
      
      const isHelix = localU < 0.5;
      const r = isHelix ? radius * 1.2 : radius * 0.8;
      const ripple = isHelix ? 0.2 * Math.sin(v * Math.PI * 4) : 0;
      
      const x = (r + ripple) * Math.cos(angle);
      const y = (r + ripple) * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 4, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    }
  },

  // Rossmann fold - classic nucleotide binding fold
  rossmann_fold: {
    name: "🔄 Rossmann Fold",
    equation: (u, v, params) => {
      const size = params.a ?? 2;
      
      // Parallel beta sheet core
      const sheetX = (u - 0.5) * size * 2;
      const sheetY = (v - 0.5) * size;
      const sheetZ = 0.2 * Math.sin(u * Math.PI * 3) * Math.cos(v * Math.PI * 2);
      
      // Flanking alpha helices
      const helixOffset = Math.sin(u * Math.PI) * 0.5;
      
      const x = sheetX;
      const y = sheetY + helixOffset;
      const z = sheetZ;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Greek key motif - antiparallel beta sheet pattern
  greek_key: {
    name: "🗝️ Greek Key Motif",
    equation: (u, v, params) => {
      const size = params.a ?? 1.5;
      
      // Four-stranded antiparallel beta sheet
      const strand = Math.floor(v * 4);
      const localV = (v * 4) % 1;
      
      // Create the characteristic fold-back pattern
      const path = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 }
      ];
      
      const p1 = path[strand];
      const p2 = path[(strand + 1) % 4];
      
      const x = (p1.x + (p2.x - p1.x) * localV) * size;
      const y = u * size * 2 - size;
      const z = strand * 0.3 + 0.1 * Math.sin(localV * Math.PI);
      
      return [x, z, y];
    },
    defaultParams: {
      a: 1.5, b: 1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32
    }
  },

  // Coiled coil - two or three intertwined helices
  coiled_coil: {
    name: "🌀 Coiled Coil",
    equation: (u, v, params) => {
      const helices = Math.floor(params.a ?? 2); // 2 or 3 helices
      const radius = params.b ?? 0.5;
      const supercoilRadius = params.c ?? 1;
      const pitch = 1.5;
      
      const helixIndex = Math.floor(v * helices);
      const angleOffset = (helixIndex * 2 * Math.PI) / helices;
      
      const t = u * 8 * Math.PI;
      const supercoilT = u * 2 * Math.PI;
      
      // Individual helix
      const helixX = radius * Math.cos(t);
      const helixY = radius * Math.sin(t);
      const helixZ = u * pitch * 8;
      
      // Supercoil around central axis
      const x = supercoilRadius * Math.cos(supercoilT + angleOffset) + helixX * Math.cos(supercoilT + angleOffset);
      const y = supercoilRadius * Math.sin(supercoilT + angleOffset) + helixX * Math.sin(supercoilT + angleOffset);
      const z = helixZ + helixY;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 0.5, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 24
    }
  },

  // Leucine zipper - DNA binding protein motif
  leucine_zipper: {
    name: "🔐 Leucine Zipper",
    equation: (u, v, params) => {
      const separation = params.a ?? 1;
      const pitch = params.b ?? 2;
      const helixRadius = 0.3;
      
      // Two parallel helices
      const side = v < 0.5 ? -1 : 1;
      const localV = v < 0.5 ? v * 2 : (v - 0.5) * 2;
      
      const t = u * 6 * Math.PI;
      const height = u * pitch * 6;
      
      // Helices closer at top (DNA binding)
      const dynamicSeparation = separation * (1 - u * 0.3);
      
      const x = side * dynamicSeparation / 2 + helixRadius * Math.cos(localV * 2 * Math.PI) * Math.cos(t) * 0.3;
      const y = helixRadius * Math.sin(t) + helixRadius * Math.cos(localV * 2 * Math.PI) * Math.sin(t) * 0.3;
      const z = height + helixRadius * Math.sin(localV * 2 * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 2, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 24
    }
  }
};
