/**
 * Φ³ AUREUM COLLECTION - Hidden Founder's Signature
 * 
 * A phi-driven tri-spiral golden geometry with global coherence.
 * The mathematical DNA encoded within - discoverable only by those who seek.
 * 
 * Hidden Encoding:
 * Φ = (1 + √5) / 2 (Golden Ratio - the growth constant)
 * ³ = Threefold symmetry (the triadic principle)
 * Aureum = Latin "golden" (the scale of value)
 * 
 * r(θ) = R · Φ^(θ / 2π)
 * x(θ) = r(θ) · cos(3θ)
 * y(θ) = r(θ) · sin(3θ)
 * 
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from "../types/math";
import { ParametricSurface } from "../types/shapes";

const PHI = (1 + Math.sqrt(5)) / 2;

const DEFAULT_PARAMS: Partial<SurfaceParameters> = {
  a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1,
  k: 1, l: 1, m: 1, n: 1, o: 1, p: 1, q: 1, r: 1, s: 1, t: 1,
  u: 1, v: 1, w: 1, x: 1, y: 1, z: 1,
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 96, vSegments: 64
};

function getDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return { ...DEFAULT_PARAMS, ...overrides };
}

export const FOUNDERS_SIGNATURE_SHAPES: Record<string, ParametricSurface> = {
  phi3_aureum_ovum: {
    name: "🥚 Φ³ Aureum Ovum",
    description: "Φ³ Aureum is a phi-governed, threefold-symmetric logarithmic system expressed across closed, open, and manifold states. This Ovum represents the closed state - a golden egg topology where Φ shapes radial expansion and triadic symmetry (n=3) weaves three intertwined spirals. r(θ) = R·Φ^(θ/2π), x = r·cos(3θ), y = r·sin(3θ).",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const R = params.d ?? 2;
      const n = params.e ?? 3;
      const eggHeight = params.f ?? 3;
      const spiralTurns = params.g ?? 4;
      const goldenIntensity = params.h ?? 1;
      
      const theta = u * 2 * Math.PI * spiralTurns;
      const phi_v = v * Math.PI;
      
      const r_spiral = R * Math.pow(PHI, (theta / (2 * Math.PI)) * goldenIntensity * 0.3);
      const r_normalized = Math.min(r_spiral, R * 2);
      
      const eggFactor = 1 + 0.3 * Math.cos(phi_v);
      const triSpiral = 0.15 * Math.sin(n * theta) * (1 - Math.abs(Math.cos(phi_v)));
      
      const baseRadius = R * Math.sin(phi_v) * eggFactor;
      const radius = baseRadius + triSpiral * r_normalized * 0.2;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = eggHeight * Math.cos(phi_v) * (1 + 0.2 * (1 - v));
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 2, e: 3, f: 3, g: 4, h: 1 })
  },

  phi3_aureum_helix: {
    name: "🌀 Φ³ Aureum Helix",
    description: "Φ³ Aureum is a phi-governed, threefold-symmetric logarithmic system expressed across closed, open, and manifold states. This Helix represents the open state - pure phi-driven tri-spiral projection where r(θ) = R·Φ^(θ/2π). The golden ratio unfolds through threefold rotational symmetry, expanding according to nature's most elegant proportion.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const R = params.d ?? 1;
      const n = params.e ?? 3;
      const turns = params.f ?? 6;
      const height = params.g ?? 4;
      
      const theta = u * 2 * Math.PI * turns;
      const t = v;
      
      const r = R * Math.pow(PHI, theta / (2 * Math.PI));
      const r_bounded = Math.min(r, R * 8);
      
      const x = r_bounded * Math.cos(n * theta);
      const y = r_bounded * Math.sin(n * theta);
      const z = (t - 0.5) * height + 0.1 * Math.sin(n * theta);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 1, e: 3, f: 6, g: 4 })
  },

  phi3_aureum_manifold: {
    name: "✨ Φ³ Aureum Manifold",
    description: "Φ³ Aureum is a phi-governed, threefold-symmetric logarithmic system expressed across closed, open, and manifold states. This Manifold represents the complete unified state - blending ovum topology with tri-spiral dynamics. The morphFactor blends spherical and phi-exponential radii while coherence modulates triadic symmetry amplitude.",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const R = params.d ?? 3;
      const n = params.e ?? 3;
      const morphFactor = params.f ?? 0.5;
      const coherence = params.g ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const r_phi = R * Math.pow(PHI, (theta / (2 * Math.PI)) * 0.5);
      const r_sphere = R * Math.sin(phi);
      const r_blend = r_sphere * (1 - morphFactor) + r_phi * morphFactor * 0.3;
      
      const triSymmetry = coherence * 0.2 * Math.sin(n * theta) * Math.sin(phi);
      const radius = r_blend + triSymmetry;
      
      const goldenEggZ = R * Math.cos(phi) * (1 + 0.25 * (1 - v));
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = goldenEggZ + 0.1 * triSymmetry;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ d: 3, e: 3, f: 0.5, g: 1 })
  }
};

export const FOUNDERS_SIGNATURE_SHAPE_COUNT = Object.keys(FOUNDERS_SIGNATURE_SHAPES).length;
