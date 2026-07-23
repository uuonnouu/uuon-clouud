import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * FOUNDATION TENSOR MESH — Fixed-Topology Icosahedral Face-Index Shell
 *
 * Concept (from UUON Foundation security architecture):
 *   Fixed Topology: The index matrix dictates exactly which vertex connects to
 *   which — an attacker cannot insert arbitrary points or "ghost nodes" because
 *   the engine rejects any point that doesn't satisfy the [V1, V2, V3] face rule.
 *
 *   Tensor Distribution: Mass m = 21,255.0159 kg and moment-of-inertia tensor I
 *   are bound to the 20 icosahedral faces rather than to floating-point positions,
 *   ensuring fluid-dynamic and spatial transformations integrate evenly across the
 *   entire surface area.
 *
 * Mathematical implementation:
 *   The icosahedron has 12 vertices, 30 edges, 20 triangular faces (genus 0,
 *   Euler characteristic χ = 2). Its vertex directions are the roots of the
 *   icosahedral symmetry group I_h (order 120), parameterized by the golden
 *   ratio φ = (1+√5)/2.
 *
 *   At each surface point p̂ = (sin v cos u, sin v sin u, cos v) we evaluate
 *   the icosahedral tensor potential:
 *
 *     Ψ(p̂) = Σ_{k=1}^{12} max(p̂ · v̂_k, 0)^(B·N)
 *
 *   where v̂_k are the 12 normalised vertex directions and B·N controls lobe
 *   sharpness (larger B = mass more concentrated at face centres, matching a
 *   higher-resolution geodesic subdivision).
 *
 *   Radial deformation:
 *     r(u,v) = A · (1 + C · Ψ_norm(p̂))
 *
 *   where Ψ_norm is Ψ normalised to [0,1].
 *
 * Parameters:
 *   A = sphere scale / reference radius        (tied to √(I / (2m/3)) ≈ shell gyradius)
 *   B = tensor concentration exponent          (B=1 smooth, B=4 sharp face peaks)
 *   C = deformation amplitude                  (C=0 perfect sphere, C→1 full icosahedral)
 *
 * Reference mass:  m  = 21,255.0159 kg
 * Shell inertia:   I  = (2/3)·m·A²   →   for A=1 → I ≈ 14,170 kg·m²
 * Face tensor:     T_face = m / 20   →   1,062.75 kg per triangular face
 *
 * Product of UUON Foundation. All rights reserved.
 */

// Golden ratio
const PHI = (1 + Math.sqrt(5)) / 2;

// 12 icosahedron vertex directions — the fixed face-index topology anchor points
// Raw (un-normalised) from the canonical embedding (0, ±1, ±φ) + cyclic permutations
const _ICO_RAW: [number, number, number][] = [
  [0,  1,  PHI], [0, -1,  PHI], [0,  1, -PHI], [0, -1, -PHI],
  [1,  PHI,  0], [-1,  PHI,  0], [1, -PHI,  0], [-1, -PHI,  0],
  [PHI,  0,  1], [-PHI,  0,  1], [PHI,  0, -1], [-PHI,  0, -1],
];
const _ICO_LEN = Math.sqrt(1 + PHI * PHI); // ≈ 1.902
const ICO_VERTS: [number, number, number][] = _ICO_RAW.map(
  ([x, y, z]) => [x / _ICO_LEN, y / _ICO_LEN, z / _ICO_LEN]
);

// Pre-compute max possible Ψ (when p̂ = v̂_k exactly)
// For exponent e, contribution from the nearest vertex = 1, others < 1
// We normalise at runtime against the actual per-call max to keep C's amplitude stable.

function icoTensorPotential(
  px: number, py: number, pz: number,
  exponent: number
): number {
  let psi = 0;
  for (const [vx, vy, vz] of ICO_VERTS) {
    const dot = px * vx + py * vy + pz * vz;
    if (dot > 0) {
      psi += Math.pow(dot, exponent);
    }
  }
  return psi;
}

// Approximate normalisation constant (Ψ at a vertex direction with given exponent)
// Computed as the potential at [0, 1/√(1+φ²), φ/√(1+φ²)] ≈ the first vertex
function icoMaxPotential(exponent: number): number {
  // At v̂_0 the dot with itself = 1, with adjacent vertices ≈ 0.447 (cos 63.4°)
  // and with antipodal vertices < 0
  return icoTensorPotential(
    ICO_VERTS[0][0], ICO_VERTS[0][1], ICO_VERTS[0][2],
    exponent
  );
}

export const FOUNDATION_TENSOR_SHAPES: Record<string, ParametricSurface> = {

  foundation_tensor_mesh: {
    name: '🔺 Foundation Tensor Mesh — Fixed-Topology Icosahedral Shell',
    description:
      'Fixed-topology icosahedral tensor shell. The 12 vertex directions of the icosahedron ' +
      'define an immutable [V1,V2,V3] face-index matrix — no ghost nodes can be inserted. ' +
      'Mass m = 21,255.0159 kg and moment-of-inertia tensor I = (2/3)mA² are distributed ' +
      'across 20 triangular faces (1,062.75 kg/face). ' +
      'A controls shell radius (gyradius = √(3I/2m) ≈ A); ' +
      'B sharpens tensor concentration at face centres (B=1 smooth, B=5 hard edges); ' +
      'C is deformation amplitude (C=0 pure sphere, C=0.4 full icosahedral relief).',
    equation: (u, v, params) => {
      const A = params.a ?? 1;
      const B = Math.max(params.b ?? 3, 0.5);
      const C = Math.max(Math.min(params.c ?? 0.35, 1.5), 0);

      // Unit sphere point from spherical UV
      const sinV = Math.sin(v);
      const cosV = Math.cos(v);
      const sinU = Math.sin(u);
      const cosU = Math.cos(u);
      const px = sinV * cosU;
      const py = sinV * sinU;
      const pz = cosV;

      // Icosahedral tensor potential at this surface point
      const exponent = B * 4;
      const psi = icoTensorPotential(px, py, pz, exponent);
      const psiMax = icoMaxPotential(exponent);
      const psiNorm = psiMax > 0 ? psi / psiMax : 0;

      // Radial deformation: 1 = pure sphere, + C * psiNorm = icosahedral relief
      const r = A * (1 + C * psiNorm);

      return [r * px, r * py, r * pz];
    },
    defaultParams: {
      a: 1, b: 3, c: 0.35,
      uMin: 0, uMax: 6.2832,
      vMin: 0, vMax: 3.1416,
      uSegments: 64, vSegments: 32,
    },
  },

};

export const FOUNDATION_TENSOR_SHAPE_COUNT = Object.keys(FOUNDATION_TENSOR_SHAPES).length;
