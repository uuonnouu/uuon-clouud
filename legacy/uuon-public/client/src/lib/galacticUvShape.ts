import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * GALACTIC UV COORDINATE SPHERE
 * 
 * Implements the IAU-standard J2000 Equatorial → Galactic coordinate
 * transformation as a 3D parametric surface.
 * 
 * The Python reference (celestial_xyz_to_galactic_uv) takes an equatorial
 * XYZ vector and returns normalised flat UV galactic coordinates [0,1].
 * 
 * This shape inverts that pipeline:
 *   (u, v) = galactic (longitude l, latitude b)
 *   → galactic unit sphere point (xg, yg, zg)
 *   → apply R_G^T (transpose = inverse for orthogonal IAU matrix)
 *   → equatorial XYZ output scaled by A
 *
 * A = sphere radius / scale
 * B = galactic disk warp amplitude (B=0 → perfect sphere; B>0 → oblate galactic disk)
 * C = disk scale height (controls how quickly the disk warp falls off with latitude)
 *
 * UV domain:
 *   u ∈ [-π, π]      galactic longitude  l  (-180° to +180°, centre of galaxy at l=0)
 *   v ∈ [-π/2, π/2]  galactic latitude   b  (-90° south pole to +90° north pole)
 *
 * Product of UUON Foundation. All rights reserved.
 */

// IAU standard rotation matrix: J2000 equatorial → galactic (Blaauw et al. 1960 / Hipparcos)
// Source: celestial_xyz_to_galactic_uv reference implementation
const R_G = [
  [-0.05487556, -0.87343709, -0.48383502],
  [ 0.49410943, -0.44482963,  0.74698225],
  [-0.86766615, -0.19807637,  0.45598378],
];

// R_G^T = inverse of R_G (orthogonal matrix: R^{-1} = R^T)
// Transforms galactic XYZ → equatorial XYZ
const R_G_T = [
  [R_G[0][0], R_G[1][0], R_G[2][0]],
  [R_G[0][1], R_G[1][1], R_G[2][1]],
  [R_G[0][2], R_G[1][2], R_G[2][2]],
];

function matVec3(M: number[][], v: [number, number, number]): [number, number, number] {
  return [
    M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
    M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
    M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2],
  ];
}

export const GALACTIC_UV_SHAPES: Record<string, ParametricSurface> = {

  galactic_uv_sphere: {
    name: '🌌 Galactic UV Coordinate Sphere — IAU J2000 Transform',
    description:
      'Parametric sphere built on the IAU standard galactic coordinate system. ' +
      'Each surface point (u = galactic longitude l, v = galactic latitude b) is ' +
      'rotated by R_G^T into J2000 equatorial XYZ. The galactic plane (b=0) runs ' +
      'through the equator of the rendered sphere. A scales the sphere radius; ' +
      'B adds a galactic-disk oblate warp (B=0 perfect sphere, B>0 disk-like); ' +
      'C controls how quickly the warp tapers off above/below the plane.',
    equation: (u, v, params) => {
      const A = params.a ?? 1;
      const B = params.b ?? 0.3;
      const C = Math.max(params.c ?? 2, 0.01);

      // u = galactic longitude l, v = galactic latitude b
      const l = u;
      const b = v;

      // Radial warp: disk inflation near galactic plane, taper toward poles
      const diskWarp = 1 + B * Math.exp(-C * Math.abs(b));
      const r = A * diskWarp;

      // Galactic unit sphere → cartesian galactic XYZ
      const cosB = Math.cos(b);
      const xg = r * cosB * Math.cos(l);
      const yg = r * cosB * Math.sin(l);
      const zg = r * Math.sin(b);

      // Rotate into J2000 equatorial frame using R_G^T
      const [xe, ye, ze] = matVec3(R_G_T, [xg, yg, zg]);

      return [xe, ye, ze];
    },
    defaultParams: {
      a: 1, b: 0.3, c: 2,
      // Full galactic longitude sweep [-π, π] × latitude [-π/2, π/2]
      uMin: -3.14159, uMax: 3.14159,
      vMin: -1.5708,  vMax: 1.5708,
      uSegments: 64, vSegments: 32,
    },
  },

};

export const GALACTIC_UV_SHAPE_COUNT = Object.keys(GALACTIC_UV_SHAPES).length;
