// ============================================================================
// HISTORICAL DOCUMENTATION - DO NOT USE FOR NEW SHAPES
// ============================================================================
// This file is kept for historical reference only.
// ALL NEW SHAPES must be added to: client/src/lib/unifiedShapes.ts
// ============================================================================

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// Educational Mathematical Surfaces - Making Math Dope for Kids™
export const EDUCATIONAL_SURFACES: Record<string, ParametricSurface> = {
  // PHASE 1: FOUNDATION SHAPES (K-2)
  circle: {
    name: "Circle",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const theta = u * 2 * Math.PI;
      const x = a * Math.cos(theta);
      const y = a * Math.sin(theta);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  square: {
    name: "Square",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      // Create square outline
      const side = Math.floor(u * 4) % 4;
      const t = (u * 4) % 1;
      const vertices = [[-a, -a], [a, -a], [a, a], [-a, a]];
      const v1 = vertices[side];
      const v2 = vertices[(side + 1) % 4];
      const x = v1[0] + t * (v2[0] - v1[0]);
      const y = v1[1] + t * (v2[1] - v1[1]);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 4, vMin: 0, vMax: 1 }
  },

  triangle: {
    name: "Triangle",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      // Create triangle outline
      const side = Math.floor(u * 3) % 3;
      const t = (u * 3) % 1;
      const sqrt3 = Math.sqrt(3);
      const vertices = [[a, 0], [-a/2, a*sqrt3/2], [-a/2, -a*sqrt3/2]];
      const v1 = vertices[side];
      const v2 = vertices[(side + 1) % 3];
      const x = v1[0] + t * (v2[0] - v1[0]);
      const y = v1[1] + t * (v2[1] - v1[1]);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 3, vMin: 0, vMax: 1 }
  },

  rectangle: {
    name: "Rectangle",
    equation: (u, v, params) => {
      const { a = 1, b = 0.6 } = params;
      const side = Math.floor(u * 4) % 4;
      const t = (u * 4) % 1;
      const vertices = [[-a, -b], [a, -b], [a, b], [-a, b]];
      const v1 = vertices[side];
      const v2 = vertices[(side + 1) % 4];
      const x = v1[0] + t * (v2[0] - v1[0]);
      const y = v1[1] + t * (v2[1] - v1[1]);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 0.6, uMin: 0, uMax: 4, vMin: 0, vMax: 1 }
  },

  oval: {
    name: "Oval",
    equation: (u, v, params) => {
      const { a = 1, b = 0.6 } = params;
      const theta = u * 2 * Math.PI;
      const x = a * Math.cos(theta);
      const y = b * Math.sin(theta);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 0.6, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  // PHASE 2: BASIC 3D SHAPES (3-4)
  pentagon: {
    name: "Pentagon",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const side = Math.floor(u * 5) % 5;
      const t = (u * 5) % 1;
      const vertices = [];
      for (let i = 0; i < 5; i++) {
        const angle = i * 2 * Math.PI / 5;
        vertices.push([a * Math.cos(angle), a * Math.sin(angle)]);
      }
      const v1 = vertices[side];
      const v2 = vertices[(side + 1) % 5];
      const x = v1[0] + t * (v2[0] - v1[0]);
      const y = v1[1] + t * (v2[1] - v1[1]);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 5, vMin: 0, vMax: 1 }
  },

  hexagon: {
    name: "Hexagon",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const side = Math.floor(u * 6) % 6;
      const t = (u * 6) % 1;
      const vertices = [];
      for (let i = 0; i < 6; i++) {
        const angle = i * 2 * Math.PI / 6;
        vertices.push([a * Math.cos(angle), a * Math.sin(angle)]);
      }
      const v1 = vertices[side];
      const v2 = vertices[(side + 1) % 6];
      const x = v1[0] + t * (v2[0] - v1[0]);
      const y = v1[1] + t * (v2[1] - v1[1]);
      const z = 0;
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 6, vMin: 0, vMax: 1 }
  },

  sphere: {
    name: "Sphere",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const phi = v * Math.PI;
      const theta = u * 2 * Math.PI;
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * Math.sin(phi) * Math.sin(theta);
      const z = a * Math.cos(phi);
      return [x, y, z];
    },
    defaultParams: { a: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  cube: {
    name: "Cube",
    equation: (u, v, params) => {
      const { a = 1 } = params;
      const face = Math.floor(u * 6) % 6;
      const s = (u * 6) % 1;
      const t = v;

      switch (face) {
        case 0: return [a, (s - 0.5) * 2 * a, (t - 0.5) * 2 * a];
        case 1: return [-a, (s - 0.5) * 2 * a, (t - 0.5) * 2 * a];
        case 2: return [(s - 0.5) * 2 * a, a, (t - 0.5) * 2 * a];
        case 3: return [(s - 0.5) * 2 * a, -a, (t - 0.5) * 2 * a];
        case 4: return [(s - 0.5) * 2 * a, (t - 0.5) * 2 * a, a];
        case 5: return [(s - 0.5) * 2 * a, (t - 0.5) * 2 * a, -a];
        default: return [0, 0, 0];
      }
    },
    defaultParams: { a: 1, uMin: 0, uMax: 6, vMin: 0, vMax: 1 }
  },

  cylinder: {
    name: "Cylinder",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const theta = u * 2 * Math.PI;
      const x = a * Math.cos(theta);
      const y = a * Math.sin(theta);
      const z = (v - 0.5) * 2 * b;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  cone: {
    name: "Cone",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const theta = u * 2 * Math.PI;
      const radius = a * (1 - v);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = b * v;
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  // PHASE 3: ADVANCED SURFACES
  torus: {
    name: "Torus",
    equation: (u, v, params) => {
      const { a = 2, b = 1 } = params;
      const phi = u * 2 * Math.PI;
      const theta = v * 2 * Math.PI;
      const x = (a + b * Math.cos(theta)) * Math.cos(phi);
      const y = (a + b * Math.cos(theta)) * Math.sin(phi);
      const z = b * Math.sin(theta);
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  // PHASE 4: MATHEMATICAL ART
  paraboloid: {
    name: "Paraboloid",
    equation: (u, v, params) => {
      const { a = 1, b = 1 } = params;
      const x = (u - 0.5) * 4 * a;
      const y = (v - 0.5) * 4 * a;
      const z = b * (x*x + y*y) / (4*a*a);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  },

  wave_surface: {
    name: "Wave Surface",
    equation: (u, v, params) => {
      const { a = 1, b = 1, c = 1 } = params;
      const x = (u - 0.5) * 4 * a;
      const y = (v - 0.5) * 4 * a;
      const z = b * Math.sin(c * x) * Math.cos(c * y);
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 0.5, c: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
  }
};

export function getEducationalSurface(type: string): ParametricSurface | null {
  return EDUCATIONAL_SURFACES[type] || null;
}

export function getEducationalDefaults(type: string): Partial<SurfaceParameters> {
  const surface = EDUCATIONAL_SURFACES[type];
  return surface ? surface.defaultParams : {};
}