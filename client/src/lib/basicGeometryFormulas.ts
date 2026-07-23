/**
 * Basic Geometry Formulas - 25 Essential Geometric Formula Shapes
 * Visualizes area, perimeter, volume, surface area, and special formulas as 3D parametric surfaces
 * 
 * Full Parameter Response:
 * - A, B, C: Global scaling (foundational)
 * - D-F: Shape-specific dimensions
 * - G-I: Twist/rotation deformations
 * - J-L: Wave deformations
 * - M-O: Noise/roughness
 * - P-R: Amplitude modulation
 * - S-W: Advanced deformations
 * - X, Y, Z: Position offsets
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// Helper function to apply global transforms and deformations
function applyTransforms(
  x: number, y: number, z: number,
  u: number, v: number,
  params: SurfaceParameters
): [number, number, number] {
  const a = params.a ?? 1;
  const b = params.b ?? 1;
  const c = params.c ?? 1;
  
  // Apply deformations
  const g = (params.g ?? 0) * 0.02; // Twist X
  const h = (params.h ?? 0) * 0.02; // Twist Y
  const i = (params.i ?? 0) * 0.02; // Twist Z
  const j = (params.j ?? 0) * 0.05; // Wave amplitude
  const k = (params.k ?? 0) * 0.1;  // Wave frequency
  const l = (params.l ?? 0) * 0.05; // Secondary wave
  const m = (params.m ?? 0) * 0.03; // Noise X
  const n = (params.n ?? 0) * 0.03; // Noise Y
  const o = (params.o ?? 0) * 0.03; // Noise Z
  const p = (params.p ?? 0) * 0.02; // Radial pulse
  const q = (params.q ?? 0) * 0.02; // Angular distortion
  const r = (params.r ?? 0) * 0.02; // Spiral
  const s = (params.s ?? 0) * 0.01; // Shear XY
  const t = (params.t ?? 0) * 0.01; // Shear YZ
  const w = (params.w ?? 0) * 0.01; // Shear XZ
  
  // Twist deformations
  const twistAngle = g * z + h * x + i * y;
  const cosT = Math.cos(twistAngle);
  const sinT = Math.sin(twistAngle);
  let nx = x * cosT - y * sinT;
  let ny = x * sinT + y * cosT;
  let nz = z;
  
  // Wave deformations
  nx += j * Math.sin(k * ny + l * nz);
  ny += j * Math.sin(k * nz + l * nx);
  nz += j * Math.sin(k * nx + l * ny);
  
  // Noise deformations
  nx += m * Math.sin(u * 10 + v * 7);
  ny += n * Math.sin(v * 10 + u * 7);
  nz += o * Math.sin(u * 7 + v * 10);
  
  // Radial pulse
  const dist = Math.sqrt(nx * nx + ny * ny);
  const pulse = 1 + p * Math.sin(dist * 5);
  nx *= pulse;
  ny *= pulse;
  
  // Angular distortion
  const angle = Math.atan2(ny, nx);
  const angDist = q * Math.sin(angle * 4);
  nx += angDist * Math.cos(angle);
  ny += angDist * Math.sin(angle);
  
  // Spiral
  const spiralAngle = r * dist;
  const cosSp = Math.cos(spiralAngle);
  const sinSp = Math.sin(spiralAngle);
  const spx = nx * cosSp - ny * sinSp;
  const spy = nx * sinSp + ny * cosSp;
  nx = spx;
  ny = spy;
  
  // Shear
  nx += s * ny + w * nz;
  ny += t * nz;
  
  // Apply global scaling
  nx *= a;
  ny *= b;
  nz *= c;
  
  // Apply position offsets
  nx += (params.x ?? 0) * 0.1;
  ny += (params.y ?? 0) * 0.1;
  nz += (params.z ?? 0) * 0.1;
  
  return [nx, ny, nz];
}

export const BASIC_GEOMETRY_FORMULAS: Record<string, ParametricSurface> = {

  // ============================================================================
  // AREA FORMULAS (8 shapes) - 2D shapes visualized as 3D surfaces
  // ============================================================================

  area_rectangle: {
    name: 'Area: Rectangle (A = l × w)',
    equation: (u, v, params) => {
      const length = (params.d ?? 1) * 2;
      const width = (params.e ?? 1) * 1.5;
      const area = length * width;
      const x = u * length - length / 2;
      const y = v * width - width / 2;
      const z = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * area * 0.1;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, uSegments: 32, vSegments: 32 }
  },

  area_square: {
    name: 'Area: Square (A = s²)',
    equation: (u, v, params) => {
      const side = (params.d ?? 1) * 2;
      const area = side * side;
      const x = u * side - side / 2;
      const y = v * side - side / 2;
      const centerDist = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
      const z = (1 - centerDist) * area * 0.05;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 32, vSegments: 32 }
  },

  area_triangle: {
    name: 'Area: Triangle (A = ½bh)',
    equation: (u, v, params) => {
      const base = (params.d ?? 1) * 2;
      const height = (params.e ?? 1) * 2;
      const area = 0.5 * base * height;
      const t = Math.max(0, 1 - v);
      const x = (u - 0.5) * base * t;
      const y = v * height - height / 2;
      const z = t * Math.sin(u * Math.PI) * area * 0.05;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, uSegments: 32, vSegments: 32 }
  },

  area_circle: {
    name: 'Area: Circle (A = πr²)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const area = Math.PI * radius * radius;
      const r = radius * v;
      const theta = u * Math.PI * 2;
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = (1 - v * v) * area * 0.05;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 48, vSegments: 24 }
  },

  area_trapezoid: {
    name: 'Area: Trapezoid (A = ½(b₁+b₂)h)',
    equation: (u, v, params) => {
      const b1 = (params.d ?? 1) * 2;
      const b2 = (params.e ?? 0.6) * 2;
      const h = (params.f ?? 1) * 2;
      const area = 0.5 * (b1 + b2) * h;
      const width = b1 + (b2 - b1) * v;
      const x = (u - 0.5) * width;
      const y = v * h - h / 2;
      const z = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * area * 0.03;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.6, f: 1, uSegments: 32, vSegments: 32 }
  },

  area_parallelogram: {
    name: 'Area: Parallelogram (A = bh)',
    equation: (u, v, params) => {
      const base = (params.d ?? 1) * 2;
      const height = (params.f ?? 1) * 1.5;
      const shear = params.e ?? 0.3;
      const area = base * height;
      const x = u * base - base / 2 + v * shear;
      const y = v * height - height / 2;
      const z = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * area * 0.05;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.3, f: 1, uSegments: 32, vSegments: 32 }
  },

  area_rhombus: {
    name: 'Area: Rhombus (A = ½d₁d₂)',
    equation: (u, v, params) => {
      const d1 = (params.d ?? 1) * 2;
      const d2 = (params.e ?? 0.7) * 2;
      const area = 0.5 * d1 * d2;
      const t = u * 2 - 1;
      const s = v * 2 - 1;
      const x = (t + s) * d1 / 4;
      const y = (t - s) * d2 / 4;
      const dist = Math.abs(u - 0.5) + Math.abs(v - 0.5);
      const z = Math.max(0, 0.5 - dist) * area * 0.2;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.7, uSegments: 32, vSegments: 32 }
  },

  area_ellipse: {
    name: 'Area: Ellipse (A = πab)',
    equation: (u, v, params) => {
      const ea = params.d ?? 1.5;
      const eb = params.e ?? 1;
      const area = Math.PI * ea * eb;
      const theta = u * Math.PI * 2;
      const x = v * ea * Math.cos(theta);
      const y = v * eb * Math.sin(theta);
      const z = (1 - v * v) * area * 0.03;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 1, uSegments: 48, vSegments: 24 }
  },

  // ============================================================================
  // PERIMETER/CIRCUMFERENCE FORMULAS (4 shapes)
  // ============================================================================

  perimeter_rectangle: {
    name: 'Perimeter: Rectangle (P = 2(l+w))',
    equation: (u, v, params) => {
      const length = (params.d ?? 1) * 2;
      const width = (params.e ?? 1) * 1.5;
      const thickness = (params.f ?? 0.1) + 0.05;
      const t = u * 4;
      let x, y;
      if (t < 1) { x = t * length - length / 2; y = -width / 2; }
      else if (t < 2) { x = length / 2; y = -width / 2 + (t - 1) * width; }
      else if (t < 3) { x = length / 2 - (t - 2) * length; y = width / 2; }
      else { x = -length / 2; y = width / 2 - (t - 3) * width; }
      const z = (v - 0.5) * thickness;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 0.1, uSegments: 64, vSegments: 8 }
  },

  perimeter_square: {
    name: 'Perimeter: Square (P = 4s)',
    equation: (u, v, params) => {
      const side = (params.d ?? 1) * 2;
      const thickness = (params.e ?? 0.1) + 0.05;
      const t = u * 4;
      let x, y;
      if (t < 1) { x = t * side - side / 2; y = -side / 2; }
      else if (t < 2) { x = side / 2; y = -side / 2 + (t - 1) * side; }
      else if (t < 3) { x = side / 2 - (t - 2) * side; y = side / 2; }
      else { x = -side / 2; y = side / 2 - (t - 3) * side; }
      const z = (v - 0.5) * thickness;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.1, uSegments: 64, vSegments: 8 }
  },

  perimeter_triangle: {
    name: 'Perimeter: Triangle (P = a+b+c)',
    equation: (u, v, params) => {
      const base = (params.d ?? 1) * 2;
      const height = (params.e ?? 1) * 2;
      const thickness = (params.f ?? 0.1) + 0.05;
      const t = u * 3;
      let x, y;
      if (t < 1) { x = t * base - base / 2; y = -height / 2; }
      else if (t < 2) { x = base / 2 - (t - 1) * base / 2; y = -height / 2 + (t - 1) * height; }
      else { x = -(t - 2) * base / 2; y = height / 2 - (t - 2) * height; }
      const z = (v - 0.5) * thickness;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 0.1, uSegments: 48, vSegments: 8 }
  },

  circumference_circle: {
    name: 'Circumference: Circle (C = 2πr)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const thickness = (params.e ?? 0.1) + 0.05;
      const theta = u * Math.PI * 2;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (v - 0.5) * thickness;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.1, uSegments: 64, vSegments: 8 }
  },

  // ============================================================================
  // VOLUME FORMULAS (6 shapes) - True 3D representations
  // ============================================================================

  volume_cube: {
    name: 'Volume: Cube (V = s³)',
    equation: (u, v, params) => {
      const side = params.d ?? 1;
      const h = side / 2;
      const face = Math.floor(u * 6);
      const s = ((u * 6) % 1) * 2 - 1;  // [-1, 1] within face (u-axis)
      const t = v * 2 - 1;              // [-1, 1] within face (v-axis)
      let x, y, z;
      switch (face) {
        case 0: x = s * h; y = t * h; z =  h; break;  // top,    z=+h
        case 1: x = s * h; y = t * h; z = -h; break;  // bottom, z=−h
        case 2: x = s * h; y =  h;    z = t * h; break;  // front,  y=+h
        case 3: x = s * h; y = -h;    z = t * h; break;  // back,   y=−h
        case 4: x =  h;    y = s * h; z = t * h; break;  // right,  x=+h
        default: x = -h;   y = s * h; z = t * h; break;  // left,   x=−h
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 60, vSegments: 10 }
  },

  volume_rectangular_prism: {
    name: 'Volume: Rectangular Prism (V = lwh)',
    equation: (u, v, params) => {
      const lx = (params.d ?? 1.5) / 2;  // X half-length
      const ly = (params.e ?? 1)   / 2;  // Y half-width
      const lz = (params.f ?? 0.8) / 2;  // Z half-height
      const face = Math.floor(u * 6);
      const s = ((u * 6) % 1) * 2 - 1;  // [-1, 1] within face (u-axis)
      const t = v * 2 - 1;              // [-1, 1] within face (v-axis)
      let x, y, z;
      switch (face) {
        case 0: x = s * lx; y = t * ly; z =  lz; break;  // top,    z=+lz
        case 1: x = s * lx; y = t * ly; z = -lz; break;  // bottom, z=−lz
        case 2: x = s * lx; y =  ly;    z = t * lz; break;  // front,  y=+ly
        case 3: x = s * lx; y = -ly;    z = t * lz; break;  // back,   y=−ly
        case 4: x =  lx;    y = s * ly; z = t * lz; break;  // right,  x=+lx
        default: x = -lx;   y = s * ly; z = t * lz; break;  // left,   x=−lx
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 1, f: 0.8, uSegments: 60, vSegments: 10 }
  },

  volume_cylinder: {
    name: 'Volume: Cylinder (V = πr²h)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const height = params.e ?? 2;
      const theta = u * Math.PI * 2;
      const part = v < 0.1 ? 0 : v > 0.9 ? 2 : 1;
      let x, y, z;
      if (part === 0) {
        const r = v * 10 * radius;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = -height / 2;
      } else if (part === 2) {
        const r = (1 - v) * 10 * radius;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = height / 2;
      } else {
        x = radius * Math.cos(theta);
        y = radius * Math.sin(theta);
        z = (v - 0.5) * height;
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2, uSegments: 48, vSegments: 32 }
  },

  volume_sphere: {
    name: 'Volume: Sphere (V = 4/3πr³)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 48, vSegments: 32 }
  },

  volume_cone: {
    name: 'Volume: Cone (V = 1/3πr²h)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const height = params.e ?? 2;
      const theta = u * Math.PI * 2;
      const t = v;
      const r = radius * (1 - t);
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t * height - height / 2;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2, uSegments: 48, vSegments: 32 }
  },

  volume_pyramid: {
    name: 'Volume: Pyramid (V = 1/3Bh)',
    equation: (u, v, params) => {
      const base = params.d ?? 1;
      const height = params.e ?? 1.5;
      const t = v;
      const side = base * (1 - t);
      const edge = Math.floor(u * 4);
      const eu = (u * 4) % 1;
      let x, y;
      switch (edge) {
        case 0: x = side / 2; y = (eu - 0.5) * side; break;
        case 1: x = (0.5 - eu) * side; y = side / 2; break;
        case 2: x = -side / 2; y = (0.5 - eu) * side; break;
        default: x = (eu - 0.5) * side; y = -side / 2; break;
      }
      const z = t * height - height / 3;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1.5, uSegments: 32, vSegments: 32 }
  },

  // ============================================================================
  // SURFACE AREA FORMULAS (5 shapes)
  // ============================================================================

  surface_area_cube: {
    name: 'Surface Area: Cube (SA = 6s²)',
    equation: (u, v, params) => {
      const side = params.d ?? 1;
      const h = side / 2;                     // inner half-width
      const outer = h + (params.e ?? 0.02) + 0.01;  // slightly expanded face position
      const face = Math.floor(u * 6);
      const s = ((u * 6) % 1) * 2 - 1;  // [-1, 1] within face (u-axis)
      const t = v * 2 - 1;              // [-1, 1] within face (v-axis)
      let x, y, z;
      switch (face) {
        case 0: x = s * h; y = t * h; z =  outer; break;  // top,    z=+outer
        case 1: x = s * h; y = t * h; z = -outer; break;  // bottom, z=−outer
        case 2: x = s * h; y =  outer; z = t * h; break;  // front,  y=+outer
        case 3: x = s * h; y = -outer; z = t * h; break;  // back,   y=−outer
        case 4: x =  outer; y = s * h; z = t * h; break;  // right,  x=+outer
        default: x = -outer; y = s * h; z = t * h; break; // left,   x=−outer
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 0.02, uSegments: 60, vSegments: 10 }
  },

  surface_area_rectangular_prism: {
    name: 'Surface Area: Rectangular Prism (SA = 2(lw+lh+wh))',
    equation: (u, v, params) => {
      const lx = (params.d ?? 1.5) / 2;  // X half-length
      const ly = (params.e ?? 1)   / 2;  // Y half-width
      const lz = (params.f ?? 0.8) / 2;  // Z half-height
      const face = Math.floor(u * 6);
      const s = ((u * 6) % 1) * 2 - 1;  // [-1, 1] within face (u-axis)
      const t = v * 2 - 1;              // [-1, 1] within face (v-axis)
      let x, y, z;
      switch (face) {
        case 0: x = s * lx; y = t * ly; z =  lz; break;  // top,    z=+lz
        case 1: x = s * lx; y = t * ly; z = -lz; break;  // bottom, z=−lz
        case 2: x = s * lx; y =  ly;    z = t * lz; break;  // front,  y=+ly
        case 3: x = s * lx; y = -ly;    z = t * lz; break;  // back,   y=−ly
        case 4: x =  lx;    y = s * ly; z = t * lz; break;  // right,  x=+lx
        default: x = -lx;   y = s * ly; z = t * lz; break;  // left,   x=−lx
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1.5, e: 1, f: 0.8, uSegments: 60, vSegments: 10 }
  },

  surface_area_cylinder: {
    name: 'Surface Area: Cylinder (SA = 2πr(r+h))',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const height = params.e ?? 2;
      const theta = u * Math.PI * 2;
      let x, y, z;
      if (v < 0.2) {
        const r = v * 5 * radius;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = -height / 2;
      } else if (v > 0.8) {
        const r = (1 - v) * 5 * radius;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = height / 2;
      } else {
        x = radius * Math.cos(theta);
        y = radius * Math.sin(theta);
        z = ((v - 0.2) / 0.6 - 0.5) * height;
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2, uSegments: 48, vSegments: 32 }
  },

  surface_area_sphere: {
    name: 'Surface Area: Sphere (SA = 4πr²)',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, uSegments: 48, vSegments: 32 }
  },

  surface_area_cone: {
    name: 'Surface Area: Cone (SA = πr(r+l))',
    equation: (u, v, params) => {
      const radius = params.d ?? 1;
      const height = params.e ?? 2;
      const theta = u * Math.PI * 2;
      let x, y, z;
      if (v < 0.2) {
        const r = v * 5 * radius;
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = -height / 2;
      } else {
        const t = (v - 0.2) / 0.8;
        const r = radius * (1 - t);
        x = r * Math.cos(theta);
        y = r * Math.sin(theta);
        z = t * height - height / 2;
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2, uSegments: 48, vSegments: 32 }
  },

  // ============================================================================
  // SPECIAL FORMULAS (2 shapes)
  // ============================================================================

  pythagorean_theorem: {
    name: 'Pythagorean Theorem (a² + b² = c²)',
    equation: (u, v, params) => {
      const sideA = params.d ?? 1;
      const sideB = params.e ?? 1;
      const sideC = Math.sqrt(sideA * sideA + sideB * sideB);
      const thickness = (params.f ?? 0.1) + 0.05;
      const region = u < 0.33 ? 0 : u < 0.66 ? 1 : 2;
      let x, y, z;
      if (region === 0) {
        const lu = (u / 0.33);
        x = -sideC / 2 - 0.3 + lu * sideA;
        y = -sideB / 2 + v * sideA;
        z = thickness * Math.sin(lu * Math.PI) * Math.sin(v * Math.PI);
      } else if (region === 1) {
        const lu = ((u - 0.33) / 0.33);
        x = sideA / 2 + 0.3 + lu * sideB;
        y = -sideB / 2 + v * sideB;
        z = thickness * Math.sin(lu * Math.PI) * Math.sin(v * Math.PI);
      } else {
        const lu = ((u - 0.66) / 0.34);
        x = lu * sideC - sideC / 2;
        y = sideB / 2 + 0.5 + v * sideC;
        z = thickness * Math.sin(lu * Math.PI) * Math.sin(v * Math.PI);
      }
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 0.1, uSegments: 48, vSegments: 32 }
  },

  distance_formula: {
    name: 'Distance Formula (d = √((x₂-x₁)² + (y₂-y₁)²))',
    equation: (u, v, params) => {
      const x1 = 0, y1 = 0;
      const x2 = params.d ?? 1;
      const y2 = params.e ?? 1;
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const thickness = (params.f ?? 0.1) + 0.02;
      const t = u;
      const x = x1 + (x2 - x1) * t + (v - 0.5) * thickness * (y2 - y1) / dist;
      const y = y1 + (y2 - y1) * t - (v - 0.5) * thickness * (x2 - x1) / dist;
      const z = Math.sin(t * Math.PI) * 0.2;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 0.1, uSegments: 32, vSegments: 8 }
  }
};

export const BASIC_GEOMETRY_SHAPE_KEYS = Object.keys(BASIC_GEOMETRY_FORMULAS);
console.log(`📐 Basic Geometry Formulas loaded: ${BASIC_GEOMETRY_SHAPE_KEYS.length} shapes with full A-Z parameter response`);
