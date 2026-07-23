import { SurfaceParameters } from '../types/math';
import { MATHEMATICAL_CONSTANTS } from './mathematicalConstants';
import { piPhiEngine, getCosmicConstant, getEnergyConstant, getGrowthConstant } from './piPhiConstantsEngine';

// **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
// **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
// **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**
// **YouTube: https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ**
// **3D Models: https://www.cgtrader.com/designers/uuon-foundation**

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

export const PARAMETRIC_SURFACES: Record<string, ParametricSurface> = {
  // ALL POLYGON SERIES COMPLETELY REMOVED - NO MORE TRIANGLES, PENTAGONS, HEXAGONS, ETC.

  // Essential basic shapes only
  sphere: {
    name: "Sphere",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1 } = params;
      const x = a * Math.cos(u) * Math.sin(v);
      const y = b * Math.sin(u) * Math.sin(v);
      const z = c * Math.cos(v);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, c: 1, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }
  },

  cube: {
    name: "Cube",
    equation: (u, v, params) => {
      const a = params.a ?? 1;  // X half-width
      const c = params.c ?? 1;  // Y half-width
      const d = params.d ?? 1;  // Z half-width
      // u ∈ [0,1] maps to 6 faces: floor(u×6) = face index 0–5
      const face = Math.floor(u * 6) % 6;
      const s = ((u * 6) % 1) * 2 - 1;  // [-1, 1] position within face (u-axis)
      const t = v * 2 - 1;              // [-1, 1] position within face (v-axis)

      // 6-face explicit switch — each face is a perfectly flat rectangle, no poles
      // b parameter intentionally unused (no roundness to tune on a flat-faced cube)
      switch (face) {
        case 0: return [+a,  c * t, d * s] as [number, number, number];  // right,  x=+a
        case 1: return [-a,  c * t, d * s] as [number, number, number];  // left,   x=-a
        case 2: return [a * s, +c,  d * t] as [number, number, number];  // front,  y=+c
        case 3: return [a * s, -c,  d * t] as [number, number, number];  // back,   y=-c
        case 4: return [a * s, c * t, +d] as [number, number, number];   // top,    z=+d
        default: return [a * s, c * t, -d] as [number, number, number];  // bottom, z=-d
      }
    },
    // uSegments must be a multiple of 6 (60 = 10 per face); uMax:1 so u is normalised [0,1]
    defaultParams: { a: 1, c: 1, d: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 10 }
  },

  cylinder: {
    name: "Cylinder",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const x = a * Math.cos(u);
      const y = a * Math.sin(u);
      const z = (v - 0.5) * 2 * b;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 1 }
  },

  torus: {
    name: "Torus",
    equation: (u, v, params) => {
      const { a = 1, b = 0.3 } = params;
      const x = (a + b * Math.cos(v)) * Math.cos(u);
      const y = (a + b * Math.cos(v)) * Math.sin(u);
      const z = b * Math.sin(v);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 0.3, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI }
  },

  square: {
    name: "Square",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const side = Math.floor(u * 4) % 4;
      const t = (u * 4) % 1;

      const corners = [
        [a, a], [-a, a], [-a, -a], [a, -a]
      ];

      const current = corners[side];
      const next = corners[(side + 1) % 4];

      const x = current[0] + t * (next[0] - current[0]);
      const y = current[1] + t * (next[1] - current[1]);
      const z = (v - 0.5) * 0.1;

      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 4, vMin: 0, vMax: 1 }
  },

  tetrahedron: {
    name: "Tetrahedron",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const vertices = [
        [a, a, a], [a, -a, -a], [-a, a, -a], [-a, -a, a]
      ];

      const face = Math.floor(u * 4) % 4;
      const s = (u * 4) % 1;
      const t = v;

      const faceIndices = [
        [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]
      ];

      const indices = faceIndices[face];
      const v1 = vertices[indices[0]];
      const v2 = vertices[indices[1]];
      const v3 = vertices[indices[2]];

      const x = v1[0] * (1 - s - t) + v2[0] * s + v3[0] * t;
      const y = v1[1] * (1 - s - t) + v2[1] * s + v3[1] * t;
      const z = v1[2] * (1 - s - t) + v2[2] * s + v3[2] * t;

      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 4, vMin: 0, vMax: 1 }
  },

  cone: {
    name: "Cone",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const x = a * v * Math.cos(u);
      const y = a * v * Math.sin(u);
      const z = (1 - v) * b;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 1 }
  },

  icosahedron: {
    name: "Icosahedron",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const phi = (1 + Math.sqrt(5)) / 2;

      const vertices = [
        [0, a, a * phi], [0, -a, a * phi], [0, a, -a * phi], [0, -a, -a * phi],
        [a, a * phi, 0], [-a, a * phi, 0], [a, -a * phi, 0], [-a, -a * phi, 0],
        [a * phi, 0, a], [a * phi, 0, -a], [-a * phi, 0, a], [-a * phi, 0, -a]
      ];

      const face = Math.floor(u * 20) % 20;
      const s = (u * 20) % 1;
      const t = v;

      const faceIndices = [
        [0, 1, 8], [0, 8, 4], [0, 4, 5], [0, 5, 10], [0, 10, 1],
        [1, 10, 7], [1, 7, 6], [1, 6, 8], [8, 6, 9], [8, 9, 4],
        [4, 9, 2], [4, 2, 5], [5, 2, 11], [5, 11, 10], [10, 11, 7],
        [7, 11, 3], [7, 3, 6], [6, 3, 9], [9, 3, 2], [2, 3, 11]
      ];

      const indices = faceIndices[face];
      const v1 = vertices[indices[0]];
      const v2 = vertices[indices[1]];
      const v3 = vertices[indices[2]];

      const x = v1[0] * (1 - s - t) + v2[0] * s + v3[0] * t;
      const y = v1[1] * (1 - s - t) + v2[1] * s + v3[1] * t;
      const z = v1[2] * (1 - s - t) + v2[2] * s + v3[2] * t;

      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 20, vMin: 0, vMax: 1 }
  },

  dodecahedron: {
    name: "Dodecahedron",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const phi = (1 + Math.sqrt(5)) / 2;

      const vertices = [
        [a, a, a], [a, a, -a], [a, -a, a], [a, -a, -a],
        [-a, a, a], [-a, a, -a], [-a, -a, a], [-a, -a, -a],
        [0, a/phi, a*phi], [0, a/phi, -a*phi], [0, -a/phi, a*phi], [0, -a/phi, -a*phi],
        [a/phi, a*phi, 0], [-a/phi, a*phi, 0], [a/phi, -a*phi, 0], [-a/phi, -a*phi, 0],
        [a*phi, 0, a/phi], [a*phi, 0, -a/phi], [-a*phi, 0, a/phi], [-a*phi, 0, -a/phi]
      ];

      const face = Math.floor(u * 12) % 12;
      const s = (u * 12) % 1;
      const t = v;

      const faceIndices = [
        [0, 8, 4, 13, 12], [0, 12, 1, 9, 8], [0, 16, 2, 10, 8],
        [1, 17, 3, 11, 9], [2, 14, 6, 18, 10], [3, 15, 7, 19, 11],
        [4, 18, 6, 15, 13], [5, 19, 7, 15, 13], [4, 8, 10, 18, 13],
        [5, 9, 11, 19, 13], [6, 14, 2, 16, 18], [7, 15, 3, 17, 19]
      ].map(face => face.slice(0, 3)); // Use only first 3 vertices for triangulation

      const indices = faceIndices[face];
      const v1 = vertices[indices[0]];
      const v2 = vertices[indices[1]];
      const v3 = vertices[indices[2]];

      const x = v1[0] * (1 - s - t) + v2[0] * s + v3[0] * t;
      const y = v1[1] * (1 - s - t) + v2[1] * s + v3[1] * t;
      const z = v1[2] * (1 - s - t) + v2[2] * s + v3[2] * t;

      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 12, vMin: 0, vMax: 1 }
  },

  octahedron: {
    name: "Octahedron",
    equation: (u, v, params) => {
      const { a = 1 } = params;

      const vertices = [
        [a, 0, 0], [-a, 0, 0], [0, a, 0], [0, -a, 0], [0, 0, a], [0, 0, -a]
      ];

      const face = Math.floor(u * 8) % 8;
      const s = (u * 8) % 1;
      const t = v;

      const faceIndices = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
        [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]
      ];

      const indices = faceIndices[face];
      const v1 = vertices[indices[0]];
      const v2 = vertices[indices[1]];
      const v3 = vertices[indices[2]];

      const x = v1[0] * (1 - s - t) + v2[0] * s + v3[0] * t;
      const y = v1[1] * (1 - s - t) + v2[1] * s + v3[1] * t;
      const z = v1[2] * (1 - s - t) + v2[2] * s + v3[2] * t;

      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 8, vMin: 0, vMax: 1 }
  },

  ellipsoid: {
    name: "Ellipsoid",
    equation: (u, v, params) => {
      const { a = 1, b = 1.5, c = 0.8 } = params;
      const x = a * Math.cos(u) * Math.sin(v);
      const y = b * Math.sin(u) * Math.sin(v);
      const z = c * Math.cos(v);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1.5, c: 0.8, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI }
  },

  paraboloid: {
    name: "Paraboloid",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const x = u * Math.cos(v);
      const y = u * Math.sin(v);
      const z = a * u * u / b;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 2, vMin: 0, vMax: 2 * Math.PI }
  },

  hyperboloid: {
    name: "Hyperboloid",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1 } = params;
      const x = a * Math.cosh(u) * Math.cos(v);
      const y = b * Math.cosh(u) * Math.sin(v);
      const z = c * Math.sinh(u);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, c: 1, uMin: -1, uMax: 1, vMin: 0, vMax: 2 * Math.PI }
  },

  hemisphere: {
    name: "Hemisphere",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const x = a * Math.cos(u) * Math.sin(v);
      const y = a * Math.sin(u) * Math.sin(v);
      const z = a * Math.cos(v);
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI / 2 }
  }
};

export default PARAMETRIC_SURFACES;