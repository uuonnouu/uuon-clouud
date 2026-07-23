/**
 * TISSUE STRUCTURES
 * Biological tissue organization at microscopic scale
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const TISSUE_STRUCTURES: Record<string, ParametricSurface> = {
  // Muscle sarcomere - contractile unit
  muscle_sarcomere: {
    name: "💪 Muscle Sarcomere",
    equation: (u, v, params) => {
      const length = params.a ?? 2.5; // Sarcomere length in micrometers
      const diameter = params.b ?? 1;
      const contraction = params.c ?? 0; // 0 = relaxed, 1 = contracted
      
      // Z-lines at ends, M-line in middle
      const position = u * length;
      const angle = v * 2 * Math.PI;
      
      // Thin (actin) and thick (myosin) filaments
      const zLinePos1 = 0;
      const zLinePos2 = length;
      const mLinePos = length / 2;
      
      // A-band (thick filaments) and I-band (thin filaments only)
      const thickFilamentZone = Math.abs(position - mLinePos) < (0.8 - contraction * 0.3) * length / 2;
      const radius = thickFilamentZone ? diameter * 0.5 : diameter * 0.4;
      
      // Hexagonal packing of filaments
      const filamentCount = 6;
      const filamentIndex = Math.floor(v * filamentCount);
      const filamentAngle = (filamentIndex * 2 * Math.PI / filamentCount) + angle * 0.2;
      const filamentRadius = 0.1;
      
      const x = position;
      const y = radius * Math.cos(filamentAngle) + filamentRadius * Math.cos(angle);
      const z = radius * Math.sin(filamentAngle) + filamentRadius * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2.5, b: 1, c: 0,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // Collagen triple helix - three stranded rope
  collagen_triple_helix: {
    name: "🧵 Collagen Triple Helix",
    equation: (u, v, params) => {
      const length = params.a ?? 5;
      const radius = params.b ?? 0.5;
      const pitch = params.c ?? 1;
      
      // Three strands
      const strandIndex = Math.floor(v * 3);
      const strandAngle = (strandIndex * 2 * Math.PI / 3);
      
      const t = u * 8 * Math.PI;
      const height = u * length;
      
      const strandRadius = 0.08;
      const localV = (v * 3) % 1;
      const circleAngle = localV * 2 * Math.PI;
      
      // Each strand follows helix
      const helixX = radius * Math.cos(t + strandAngle);
      const helixY = radius * Math.sin(t + strandAngle);
      
      const x = helixX + strandRadius * Math.cos(circleAngle) * Math.cos(t + strandAngle);
      const y = helixY + strandRadius * Math.cos(circleAngle) * Math.sin(t + strandAngle);
      const z = height + strandRadius * Math.sin(circleAngle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 5, b: 0.5, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 24
    }
  },

  // Bone trabeculae - spongy bone structure
  bone_trabeculae: {
    name: "🦴 Bone Trabeculae",
    equation: (u, v, params) => {
      const size = params.a ?? 3;
      const porosity = params.b ?? 0.6;
      const thickness = params.c ?? 0.15;
      
      // Create lattice structure
      const x = (u - 0.5) * size;
      const y = (v - 0.5) * size;
      
      // Gyroid-like surface for trabecular structure
      const freq = 2;
      const gyroid = Math.sin(x * freq) * Math.cos(y * freq) +
                     Math.sin(y * freq) * Math.cos(x * freq) +
                     Math.sin(x * freq) * Math.cos(x * freq);
      
      const z = gyroid * thickness * (1 - porosity);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 3, b: 0.6, c: 0.15,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 80
    }
  },

  // Tendon collagen fiber bundle
  tendon_fiber_bundle: {
    name: "🎯 Tendon Fiber Bundle",
    equation: (u, v, params) => {
      const length = params.a ?? 6;
      const bundleDiameter = params.b ?? 1;
      const crimp = params.c ?? 0.3; // Crimp wave amplitude
      
      // Multiple fibers in bundle
      const fiberCount = 7; // Central + 6 surrounding
      const fiberIndex = Math.floor(v * fiberCount);
      
      const ringRadius = fiberIndex === 0 ? 0 : bundleDiameter * 0.3;
      const fiberAngle = fiberIndex === 0 ? 0 : ((fiberIndex - 1) * 2 * Math.PI / 6);
      
      // Crimp wave (relaxed tendon has wavy pattern)
      const crimpWave = crimp * Math.sin(u * Math.PI * 6);
      
      const fiberThickness = 0.06;
      const localV = (v * fiberCount) % 1;
      const circleAngle = localV * 2 * Math.PI;
      
      const x = u * length;
      const y = ringRadius * Math.cos(fiberAngle) + fiberThickness * Math.cos(circleAngle) + crimpWave;
      const z = ringRadius * Math.sin(fiberAngle) + fiberThickness * Math.sin(circleAngle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 6, b: 1, c: 0.3,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 56
    }
  }
};
