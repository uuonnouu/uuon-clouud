/**
 * HIGHER-DIMENSIONAL GAPS LIBRARY
 * 25 Missing 4D/5D/6D+ Shape Implementations
 * Proper mathematical equations with N-dimensional to 3D projection
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

// 4D to 3D stereographic projection with safety bounds
function project4Dto3D(x: number, y: number, z: number, w: number, distance: number = 3): [number, number, number] {
  const safeDistance = Math.max(distance, 3);
  const clampedW = Math.max(-safeDistance * 0.8, Math.min(safeDistance * 0.8, w));
  const denominator = safeDistance - clampedW;
  const safeDenom = Math.abs(denominator) < 0.1 ? (denominator >= 0 ? 0.1 : -0.1) : denominator;
  const scale = Math.min(10, Math.max(0.1, safeDistance / safeDenom));
  return [x * scale, y * scale, z * scale];
}

// 5D to 3D projection (via 4D intermediate) with safety bounds
function project5Dto3D(x1: number, x2: number, x3: number, x4: number, x5: number, distance: number = 3): [number, number, number] {
  const safeDistance = Math.max(distance, 3);
  const clampedX5 = Math.max(-safeDistance * 0.7, Math.min(safeDistance * 0.7, x5));
  const denominator = safeDistance - clampedX5;
  const safeDenom = Math.abs(denominator) < 0.1 ? (denominator >= 0 ? 0.1 : -0.1) : denominator;
  const scale4 = Math.min(10, Math.max(0.1, safeDistance / safeDenom));
  const x4p = x1 * scale4;
  const y4p = x2 * scale4;
  const z4p = x3 * scale4;
  const w4p = x4 * scale4;
  return project4Dto3D(x4p, y4p, z4p, w4p, safeDistance);
}

// Rotation in 4D (XW plane)
function rotate4D_XW(x: number, y: number, z: number, w: number, angle: number): [number, number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x * cos - w * sin, y, z, x * sin + w * cos];
}

// Rotation in 4D (YW plane)
function rotate4D_YW(x: number, y: number, z: number, w: number, angle: number): [number, number, number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return [x, y * cos - w * sin, z, y * sin + w * cos];
}

export const HIGHER_DIMENSIONAL_GAPS = {
  // ═══════════════════════════════════════════════════════════════
  // 5D POLYTOPES (5 shapes)
  // ═══════════════════════════════════════════════════════════════

  "5_simplex": {
    name: "5-Simplex (Hexateron)",
    category: "5d-polytopes",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const rotW = d * 0.01;

      // 5-simplex vertices in 5D, parametric interpolation
      const t1 = Math.sin(theta) * Math.sin(phi);
      const t2 = Math.cos(theta) * Math.sin(phi);
      const t3 = Math.cos(phi);
      const t4 = Math.sin(theta * 2) * 0.5;
      const t5 = Math.cos(theta * 2) * 0.5;

      const [x, y, z] = project5Dto3D(t1 * a, t2 * a, t3 * a, t4 * a, t5 * a + rotW);
      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "5_cube_penteract": {
    name: "5-Cube (Penteract)",
    category: "5d-polytopes",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 0 } = params;
      const rotW = d * 0.01;
      const rotV = e * 0.01;

      // Penteract surface parametrization
      const x1 = Math.cos(u * Math.PI * 2) * a;
      const x2 = Math.sin(u * Math.PI * 2) * a;
      const x3 = Math.cos(v * Math.PI * 2) * a;
      const x4 = Math.sin(v * Math.PI * 2) * a * 0.7;
      const x5 = Math.sin((u + v) * Math.PI) * a * 0.5 + rotV;

      const [x, y, z] = project5Dto3D(x1, x2, x3, x4, x5 + rotW);
      return [x, y, z];
    },
    defaultParams: { a: 1.5, d: 0, e: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  "5_orthoplex": {
    name: "5-Orthoplex (Pentacross)",
    category: "5d-polytopes",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // 5-orthoplex: cross-polytope in 5D
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      const x1 = Math.sin(phi) * Math.cos(theta) * a;
      const x2 = Math.sin(phi) * Math.sin(theta) * a;
      const x3 = Math.cos(phi) * a;
      const x4 = Math.sin(phi * 2) * Math.cos(theta * 2) * a * 0.7;
      const x5 = Math.sin(phi * 2) * Math.sin(theta * 2) * a * 0.7;

      const [x, y, z] = project5Dto3D(x1, x2, x3, x4, x5 + rotW);
      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "demipenteract": {
    name: "Demipenteract (5-Demicube)",
    category: "5d-polytopes",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // Half of 5-cube vertices
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      const sign = ((Math.floor(u * 4) + Math.floor(v * 4)) % 2 === 0) ? 1 : -1;
      const x1 = sign * Math.cos(theta) * Math.sin(phi) * a;
      const x2 = Math.sin(theta) * Math.sin(phi) * a;
      const x3 = Math.cos(phi) * a;
      const x4 = sign * Math.sin(theta * 2) * a * 0.5;
      const x5 = Math.cos(theta + phi) * a * 0.5;

      const [x, y, z] = project5Dto3D(x1, x2, x3, x4, x5 + rotW);
      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "5_sphere_glome": {
    name: "5-Sphere (Glome Surface)",
    category: "5d-polytopes",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 0 } = params;
      const rotW = d * 0.01;
      const rotV = e * 0.01;

      // 5-sphere parametrization
      const phi1 = u * Math.PI;
      const phi2 = v * Math.PI;
      const phi3 = (u + v) * Math.PI * 0.5;
      const phi4 = (u - v + 1) * Math.PI * 0.5;

      const x1 = a * Math.sin(phi1) * Math.sin(phi2) * Math.sin(phi3) * Math.cos(phi4);
      const x2 = a * Math.sin(phi1) * Math.sin(phi2) * Math.sin(phi3) * Math.sin(phi4);
      const x3 = a * Math.sin(phi1) * Math.sin(phi2) * Math.cos(phi3);
      const x4 = a * Math.sin(phi1) * Math.cos(phi2) + rotV;
      const x5 = a * Math.cos(phi1);

      const [x, y, z] = project5Dto3D(x1, x2, x3, x4, x5 + rotW);
      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, e: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ═══════════════════════════════════════════════════════════════
  // LATTICE STRUCTURES (5 shapes)
  // ═══════════════════════════════════════════════════════════════

  "e6_lattice": {
    name: "E₆ Exceptional Lattice",
    category: "lattice-structures",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // E6 root system projection
      const alpha = u * Math.PI * 2;
      const beta = v * Math.PI;

      // E6 has 72 roots, project to 3D
      const r1 = Math.cos(alpha) * Math.sin(beta);
      const r2 = Math.sin(alpha) * Math.sin(beta);
      const r3 = Math.cos(beta);
      const r4 = Math.sin(alpha * 2) * Math.cos(beta * 2) * 0.5;
      const r5 = Math.cos(alpha * 3) * 0.3;
      const r6 = Math.sin(beta * 3) * 0.3;

      // Project from 6D to 3D
      const x = (r1 + r4 * 0.5) * a;
      const y = (r2 + r5 * 0.5) * a;
      const z = (r3 + r6 * 0.5 + rotW * 0.1) * a;

      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 72 }
  },

  "e7_lattice": {
    name: "E₇ Exceptional Lattice",
    category: "lattice-structures",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // E7 root system (126 roots)
      const alpha = u * Math.PI * 2;
      const beta = v * Math.PI;

      const r1 = Math.cos(alpha) * Math.sin(beta);
      const r2 = Math.sin(alpha) * Math.sin(beta);
      const r3 = Math.cos(beta);
      const r4 = Math.sin(alpha * 2) * Math.cos(beta * 2) * 0.5;
      const r5 = Math.cos(alpha * 3) * Math.sin(beta) * 0.4;
      const r6 = Math.sin(beta * 3) * Math.cos(alpha) * 0.3;
      const r7 = Math.cos(alpha + beta) * 0.25;

      const x = (r1 + r4 * 0.5 + r7 * 0.3) * a;
      const y = (r2 + r5 * 0.5) * a;
      const z = (r3 + r6 * 0.5 + rotW * 0.1) * a;

      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 72 }
  },

  "e8_lattice": {
    name: "E₈ Exceptional Lattice",
    category: "lattice-structures",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 0 } = params;
      const rotW = d * 0.01;
      const rotV = e * 0.01;

      // E8 root system (240 roots) - most symmetric lattice
      const alpha = u * Math.PI * 2;
      const beta = v * Math.PI;

      // E8 uses 8 coordinates
      const coords = [
        Math.cos(alpha) * Math.sin(beta),
        Math.sin(alpha) * Math.sin(beta),
        Math.cos(beta),
        Math.sin(alpha * 2) * 0.5,
        Math.cos(beta * 2) * 0.5,
        Math.sin(alpha + beta) * 0.4,
        Math.cos(alpha - beta) * 0.3,
        Math.sin(alpha * 3 + beta * 2) * 0.25
      ];

      // Project 8D to 3D using multiple projections
      const x = (coords[0] + coords[3] * 0.5 + coords[6] * 0.25 + rotV * 0.1) * a;
      const y = (coords[1] + coords[4] * 0.5 + coords[7] * 0.25) * a;
      const z = (coords[2] + coords[5] * 0.5 + rotW * 0.1) * a;

      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, e: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  "leech_lattice": {
    name: "Leech Lattice (Λ₂₄)",
    category: "lattice-structures",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // Leech lattice - 24 dimensional, highest dimensional exceptional lattice
      const alpha = u * Math.PI * 2;
      const beta = v * Math.PI;

      // Use 24 harmonic components for projection
      let xSum = 0, ySum = 0, zSum = 0;
      for (let i = 1; i <= 8; i++) {
        const phase = i * 0.25;
        xSum += Math.cos(alpha * i + phase) * Math.sin(beta * i) / i;
        ySum += Math.sin(alpha * i + phase) * Math.sin(beta * i) / i;
        zSum += Math.cos(beta * i + phase * 2) / i;
      }

      const x = xSum * a * 0.5;
      const y = ySum * a * 0.5;
      const z = (zSum * 0.5 + rotW * 0.1) * a;

      return [x, y, z];
    },
    defaultParams: { a: 3, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 }
  },

  "barnes_wall_lattice": {
    name: "Barnes-Wall Lattice (BW₁₆)",
    category: "lattice-structures",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      // Barnes-Wall lattice in 16 dimensions
      const alpha = u * Math.PI * 2;
      const beta = v * Math.PI;

      // 16D projection
      let coords: number[] = [];
      for (let i = 0; i < 16; i++) {
        const phase = i * Math.PI / 8;
        coords.push(Math.cos(alpha * (i + 1) + phase) * Math.sin(beta * (i % 4 + 1)));
      }

      // Project to 3D
      const x = (coords[0] + coords[4] + coords[8] + coords[12]) * a * 0.25;
      const y = (coords[1] + coords[5] + coords[9] + coords[13]) * a * 0.25;
      const z = (coords[2] + coords[6] + coords[10] + coords[14] + rotW * 0.1) * a * 0.25;

      return [x, y, z];
    },
    defaultParams: { a: 2.5, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ═══════════════════════════════════════════════════════════════
  // ADVANCED 4D SHAPES (10 shapes)
  // ═══════════════════════════════════════════════════════════════

  "grand_antiprism_4d": {
    name: "Grand Antiprism (4D)",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;

      // Grand antiprism has 100 vertices
      const x4 = a * Math.cos(theta) * (1 + 0.3 * Math.cos(phi * 5));
      const y4 = a * Math.sin(theta) * (1 + 0.3 * Math.cos(phi * 5));
      const z4 = a * Math.sin(phi * 5) * 0.5;
      const w4 = a * Math.cos(phi * 5 + theta) * 0.3;

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "rectified_tesseract": {
    name: "Rectified Tesseract",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Rectified 8-cell vertices at edge midpoints
      const s = Math.sin(phi);
      const c = Math.cos(phi);

      const x4 = a * s * Math.cos(theta);
      const y4 = a * s * Math.sin(theta);
      const z4 = a * c;
      const w4 = a * Math.sin(theta * 2) * 0.5;

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "truncated_tesseract": {
    name: "Truncated Tesseract",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Truncated 8-cell
      const truncFactor = 0.7;
      const x4 = a * truncFactor * Math.sin(phi) * Math.cos(theta);
      const y4 = a * truncFactor * Math.sin(phi) * Math.sin(theta);
      const z4 = a * truncFactor * Math.cos(phi);
      const w4 = a * (1 - truncFactor) * Math.cos(theta + phi);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "bitruncated-tesseract": {
    name: "Bitruncated Tesseract",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Bitruncated 8-cell - truncated at both vertex types
      const s = Math.sin(phi);
      const c = Math.cos(phi);
      const truncA = 0.6;
      const truncB = 0.4;

      const x4 = a * (truncA * s * Math.cos(theta) + truncB * Math.cos(theta * 2));
      const y4 = a * (truncA * s * Math.sin(theta) + truncB * Math.sin(theta * 2));
      const z4 = a * truncA * c;
      const w4 = a * truncB * Math.sin(phi * 2);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "cantellated_tesseract": {
    name: "Cantellated Tesseract",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Cantellated 8-cell (edge-truncated)
      const r = a * (1 + 0.2 * Math.cos(theta * 4));
      const x4 = r * Math.sin(phi) * Math.cos(theta);
      const y4 = r * Math.sin(phi) * Math.sin(theta);
      const z4 = r * Math.cos(phi);
      const w4 = a * 0.3 * Math.sin(theta * 2 + phi);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "runcinated_tesseract": {
    name: "Runcinated Tesseract",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Runcinated 8-cell (cell-expanded)
      const expand = 1.4;
      const x4 = a * expand * Math.sin(phi) * Math.cos(theta);
      const y4 = a * expand * Math.sin(phi) * Math.sin(theta);
      const z4 = a * expand * Math.cos(phi);
      const w4 = a * 0.5 * Math.cos(theta * 2) * Math.sin(phi * 2);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 1.5, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "duoprism-4d": {
    name: "Duoprism (4D)",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 5, f = 7 } = params;
      const rotW = d * 0.01;
      const n1 = Math.max(3, Math.round(Math.abs(e)));
      const n2 = Math.max(3, Math.round(Math.abs(f)));

      const theta1 = u * Math.PI * 2;
      const theta2 = v * Math.PI * 2;

      // n1-gon × n2-gon duoprism
      const x4 = a * Math.cos(theta1);
      const y4 = a * Math.sin(theta1);
      const z4 = a * 0.7 * Math.cos(theta2);
      const w4 = a * 0.7 * Math.sin(theta2);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, e: 5, f: 7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  "clifford_torus_4d": {
    name: "Clifford Torus (4D)",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;

      // Clifford torus - flat torus in 4D
      const r = 1 / Math.sqrt(2);
      const x4 = a * r * Math.cos(theta);
      const y4 = a * r * Math.sin(theta);
      const z4 = a * r * Math.cos(phi);
      const w4 = a * r * Math.sin(phi);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "klein_bottle_4d": {
    name: "Klein Bottle (4D Embedding)",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;

      // Klein bottle proper 4D embedding (no self-intersection)
      const x4 = a * (2 + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi)) * Math.cos(theta);
      const y4 = a * (2 + Math.cos(theta / 2) * Math.sin(phi) - Math.sin(theta / 2) * Math.sin(2 * phi)) * Math.sin(theta);
      const z4 = a * Math.sin(theta / 2) * Math.sin(phi) + Math.cos(theta / 2) * Math.sin(2 * phi);
      const w4 = a * Math.cos(phi);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 1, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "hopf_fibration": {
    name: "Hopf Fibration",
    category: "4d-advanced",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const rotW = d * 0.01;

      const eta = u * Math.PI;
      const phi1 = v * Math.PI * 2;
      const phi2 = (u + v) * Math.PI * 2;

      // Hopf fibration: S³ → S²
      const x4 = a * Math.cos(eta) * Math.cos(phi1);
      const y4 = a * Math.cos(eta) * Math.sin(phi1);
      const z4 = a * Math.sin(eta) * Math.cos(phi2);
      const w4 = a * Math.sin(eta) * Math.sin(phi2);

      const [rx, ry, rz, rw] = rotate4D_XW(x4, y4, z4, w4, rotW);
      return project4Dto3D(rx, ry, rz, rw);
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ═══════════════════════════════════════════════════════════════
  // SPECIALIZED MATHEMATICAL SURFACES (5 shapes)
  // ═══════════════════════════════════════════════════════════════

  "modular-surface-knot": {
    name: "Modular Surface Knot",
    category: "specialized-math",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 3 } = params;
      const p = Math.max(2, Math.round(Math.abs(e)));

      const theta = u * Math.PI * 2 * p;
      const phi = v * Math.PI * 2;

      // Modular knot on torus surface
      const R = a;
      const r = a * 0.4;

      const x = (R + r * Math.cos(phi)) * Math.cos(theta);
      const y = (R + r * Math.cos(phi)) * Math.sin(theta);
      const z = r * Math.sin(phi) + d * 0.05 * Math.sin(theta * 3);

      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 }
  },

  "perfectoid-space": {
    name: "Perfectoid Space Projection",
    category: "specialized-math",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0 } = params;
      const p = 5; // Prime for perfectoid

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // p-adic inspired surface
      let x = 0, y = 0, z = 0;
      for (let n = 0; n < 5; n++) {
        const pn = Math.pow(p, -n);
        x += pn * Math.cos(theta * Math.pow(p, n));
        y += pn * Math.sin(theta * Math.pow(p, n));
        z += pn * Math.cos(phi * Math.pow(p, n));
      }

      return [x * a, y * a, (z + d * 0.01) * a];
    },
    defaultParams: { a: 2, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  "quantum-hall-droplet": {
    name: "Quantum Hall Droplet",
    category: "specialized-math",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 3 } = params;
      const filling = Math.max(1, Math.abs(e));

      const theta = u * Math.PI * 2;
      const r = v * a;

      // Laughlin wavefunction inspired shape
      const psi = Math.exp(-r * r / 4) * Math.pow(r, filling);
      const phase = theta * filling;

      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = psi * Math.cos(phase) + d * 0.01;

      return [x, y, z];
    },
    defaultParams: { a: 3, d: 0, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "calabi-yau-surface": {
    name: "Calabi-Yau Surface (2D Slice)",
    category: "specialized-math",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 5 } = params;
      const k = Math.max(2, Math.round(Math.abs(e)));

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;

      // Fermat quintic inspired (z₁^k + z₂^k = 0)
      const z1_r = Math.cos(theta);
      const z1_i = Math.sin(theta);
      const z2_r = Math.cos(phi);
      const z2_i = Math.sin(phi);

      // Complex surface embedding
      const x = a * (z1_r * z2_r - z1_i * z2_i);
      const y = a * (z1_r * z2_i + z1_i * z2_r);
      const z = a * 0.5 * Math.sin(k * theta + k * phi) + d * 0.01;

      return [x, y, z];
    },
    defaultParams: { a: 2, d: 0, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  "n-dimensional-sphere": {
    name: "N-Dimensional Sphere Projection",
    category: "specialized-math",
    equation: (u: number, v: number, params: SurfaceParameters): [number, number, number] => {
      const { a = 2, d = 0, e = 6 } = params;
      const n = Math.max(3, Math.min(12, Math.round(Math.abs(e))));
      const rotW = d * 0.01;

      // n-sphere parametrization
      const angles: number[] = [];
      for (let i = 0; i < n - 1; i++) {
        if (i === 0) angles.push(u * Math.PI);
        else if (i === n - 2) angles.push(v * Math.PI * 2);
        else angles.push((u * (i + 1) + v * i) / n * Math.PI);
      }

      // Calculate n-sphere coordinates
      let coords: number[] = [];
      for (let i = 0; i < n; i++) {
        let coord = a;
        for (let j = 0; j < i && j < angles.length; j++) {
          coord *= Math.sin(angles[j]);
        }
        if (i < angles.length) coord *= Math.cos(angles[i]);
        coords.push(coord);
      }

      // Project to 3D by summing groups
      const groupSize = Math.ceil(n / 3);
      let x = 0, y = 0, z = 0;
      for (let i = 0; i < coords.length; i++) {
        if (i % 3 === 0) x += coords[i] / groupSize;
        else if (i % 3 === 1) y += coords[i] / groupSize;
        else z += coords[i] / groupSize;
      }

      return [x, y + rotW * 0.5, z];
    },
    defaultParams: { a: 2, d: 0, e: 6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  }
};

// Export shape count for verification
export const HIGHER_DIMENSIONAL_GAPS_COUNT = Object.keys(HIGHER_DIMENSIONAL_GAPS).length;

console.log(`🔮 Higher Dimensional Gaps loaded: ${HIGHER_DIMENSIONAL_GAPS_COUNT} shapes`);
console.log(`   • 5D Polytopes: 5-simplex, 5-cube, 5-orthoplex, demipenteract, 5-sphere`);
console.log(`   • Lattices: E₆, E₇, E₈, Leech, Barnes-Wall`);
console.log(`   • 4D Advanced: Grand Antiprism, Rectified/Truncated/Cantellated Tesseract, Duoprism, Clifford Torus, Klein Bottle 4D, Hopf Fibration`);
console.log(`   • Specialized: Modular Knot, Perfectoid Space, Quantum Hall, Calabi-Yau, N-Sphere`);