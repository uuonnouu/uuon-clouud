import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * VECTOR FIELDS — Mathematical Force Fields as Surface Deformations
 * 
 * Each shape maps the UV grid to an XY plane where Z encodes field strength.
 * The surface geometry IS the field — not a color map of it.
 * 
 * A = field strength / amplitude
 * B = frequency / wave number
 * C = decay rate / damping constant
 * 
 * Product of UUON Foundation. All rights reserved.
 */

export const VECTOR_FIELD_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // GRAVITY WELL — Newtonian gravitational potential surface
  // Z = -A / (r² + C)  where r = √(u²+v²)
  // ============================================================================
  vf_gravity_well: {
    name: "🌌 Gravity Well — Newtonian Potential Field",
    description: "Z = -A / ((u/B)² + v² + C) — Gravitational potential surface. A controls well depth, B is mass eccentricity (B=1 circular; B>1 stretches along u), C is the softening radius preventing the singularity at r=0.",
    equation: (u, v, params) => {
      const A = params.a ?? 2;
      const B = Math.max(params.b ?? 1, 0.1);
      const C = Math.max(params.c ?? 0.5, 0.01);
      const x = u;
      const y = v;
      const ue = u / B;
      const r2 = ue * ue + v * v;
      const z = -A / (r2 + C);
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 1, c: 0.5,
      uMin: -3, uMax: 3, vMin: -3, vMax: 3,
      uSegments: 40, vSegments: 40
    }
  },

  // ============================================================================
  // DIPOLE FIELD — Classical magnetic/electric dipole potential
  // Z = A·cos(θ) / max(r², ε)  where θ = atan2(v,u)
  // ============================================================================
  vf_dipole_field: {
    name: "⚡ Dipole Field — Multipole Potential",
    description: "Z = A·cos(B·θ) / max(r², C²) — Multipole potential surface. B=1 gives a dipole (2 lobes), B=2 quadrupole (4 lobes), B=3 octupole (6 lobes). A is field strength, C is origin softening radius.",
    equation: (u, v, params) => {
      const A = params.a ?? 2;
      const B = Math.round(Math.max(params.b ?? 1, 1));
      const C = Math.max(params.c ?? 0.3, 0.01);
      const x = u;
      const y = v;
      const r2 = Math.max(u * u + v * v, C * C);
      const theta = Math.atan2(v, u);
      const z = A * Math.cos(B * theta) / r2;
      const zClamped = Math.max(-4, Math.min(4, z));
      return [x, y, zClamped];
    },
    defaultParams: {
      a: 2, b: 1, c: 0.3,
      uMin: -2.5, uMax: 2.5, vMin: -2.5, vMax: 2.5,
      uSegments: 40, vSegments: 40
    }
  },

  // ============================================================================
  // STANDING WAVE — Decaying 2D interference pattern
  // Z = A·sin(B·u)·cos(B·v)·e^(-C·r)
  // ============================================================================
  vf_standing_wave: {
    name: "〰️ Standing Wave — Decaying Interference Field",
    description: "Z = A·sin(B·u)·cos(B·v)·e^(−C·r) — A 2D interference pattern with exponential radial decay. A is amplitude, B is spatial frequency (node spacing), C is decay rate. Physically models acoustic standing waves or optical interference with absorption.",
    equation: (u, v, params) => {
      const A = params.a ?? 1.5;
      const B = params.b ?? 2;
      const C = Math.max(params.c ?? 0.3, 0);
      const x = u;
      const y = v;
      const r = Math.sqrt(u * u + v * v);
      const z = A * Math.sin(B * u) * Math.cos(B * v) * Math.exp(-C * r);
      return [x, y, z];
    },
    defaultParams: {
      a: 1.5, b: 2, c: 0.3,
      uMin: -4, uMax: 4, vMin: -4, vMax: 4,
      uSegments: 48, vSegments: 48
    }
  },

  // ============================================================================
  // VORTEX SHEET — Angular momentum surface with radial decay
  // Z = A·atan2(v,u)/π · e^(-C·r)
  // ============================================================================
  vf_vortex_sheet: {
    name: "🌀 Vortex Sheet — Angular Momentum Surface",
    description: "Z = A·(B·atan2(v,u)/π) · e^(−C·r) — Encodes angular momentum as surface height. B is the winding number (B=1 single vortex, B=2 double, B=3 triple). A is vortex strength, C is radial decay. Models atmospheric vortices and quantum vortices in Bose-Einstein condensates.",
    equation: (u, v, params) => {
      const A = params.a ?? 1.5;
      const B = params.b ?? 1;
      const C = Math.max(params.c ?? 0.4, 0);
      const x = u;
      const y = v;
      const r = Math.sqrt(u * u + v * v);
      const phase = B * Math.atan2(v, u) / Math.PI;
      const decay = Math.exp(-C * r);
      const z = A * phase * decay;
      return [x, y, z];
    },
    defaultParams: {
      a: 1.5, b: 1, c: 0.4,
      uMin: -3, uMax: 3, vMin: -3, vMax: 3,
      uSegments: 44, vSegments: 44
    }
  },

  // ============================================================================
  // QUANTUM PROBABILITY WELL — Hydrogen 1s-like probability envelope
  // Z = A·sinc(B·r)²  where sinc(x) = sin(x)/x
  // ============================================================================
  vf_quantum_probability_well: {
    name: "⚛️ Quantum Probability Well — 1s Orbital Envelope",
    description: "Z = A·sinc(B·r)²·e^(−C·r) — Probability amplitude surface. The sinc² envelope creates concentric rings of decreasing probability; C adds a Gaussian decay (larger C = more localized orbital). A is peak density, B is radial frequency (controls ring spacing).",
    equation: (u, v, params) => {
      const A = params.a ?? 2;
      const B = params.b ?? 1.5;
      const C = Math.max(params.c ?? 0, 0);
      const x = u;
      const y = v;
      const r = Math.sqrt(u * u + v * v);
      const br = B * r;
      const sinc = Math.abs(br) < 1e-6 ? 1 : Math.sin(br) / br;
      const z = A * sinc * sinc * Math.exp(-C * r);
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 1.5, c: 0.15,
      uMin: -5, uMax: 5, vMin: -5, vMax: 5,
      uSegments: 44, vSegments: 44
    }
  },

  // ============================================================================
  // LORENZ FIELD SLICE — Cross-section of the Lorenz strange attractor
  // Z = A·(u·v - C·u) / (B + u²+v²)  — Lorenz dz/dt evaluated over XY
  // ============================================================================
  vf_lorenz_slice: {
    name: "🦋 Lorenz Field Slice — Strange Attractor Cross-Section",
    description: "Z = A·(u·v − C·u) / (B + r²) — The Lorenz dz/dt field on the z=0 plane. A scales the field magnitude, B controls field localization (larger B = wider, softer field), C sets β (Lorenz dissipation constant, canonical ≈ 2.67). Where Z > 0 the attractor spirals up; Z < 0 folds back — tracing butterfly topology.",
    equation: (u, v, params) => {
      const A = params.a ?? 1.5;
      const B = Math.max(params.b ?? 1, 0.01);
      const beta = Math.max(params.c ?? 2.667, 0.1);
      const x = u;
      const y = v;
      const r2 = u * u + v * v;
      const lorenzDz = u * v - beta * u;
      const z = A * lorenzDz / (B + r2);
      return [x, y, z];
    },
    defaultParams: {
      a: 1.5, b: 1, c: 2.667,
      uMin: -3, uMax: 3, vMin: -3, vMax: 3,
      uSegments: 44, vSegments: 44
    }
  }
};

export const VECTOR_FIELD_SHAPE_COUNT = Object.keys(VECTOR_FIELD_SHAPES).length;
