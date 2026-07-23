import { ParametricSurface, getCleanDefaults } from '../types/shapes';
import { EnhancedProjections, Point4D } from './enhancedProjections';

interface Point5D {
  x: number;
  y: number;
  z: number;
  w: number;
  v: number;
}

interface PointND {
  coords: number[];
}

function project5Dto4D(p: Point5D, time: number): Point4D {
  const angle = time * 0.3;
  const cos5 = Math.cos(angle);
  const sin5 = Math.sin(angle);
  
  return {
    x: p.x * cos5 - p.v * sin5,
    y: p.y,
    z: p.z,
    w: p.w * cos5 + p.v * sin5
  };
}

function projectNDto4D(p: PointND, time: number): Point4D {
  const n = p.coords.length;
  if (n <= 4) {
    return {
      x: p.coords[0] || 0,
      y: p.coords[1] || 0,
      z: p.coords[2] || 0,
      w: p.coords[3] || 0
    };
  }
  
  let result: Point4D = { x: 0, y: 0, z: 0, w: 0 };
  const baseAngle = time * 0.2;
  
  for (let i = 0; i < n; i++) {
    const phase = (i / n) * Math.PI * 2 + baseAngle;
    const weight = p.coords[i];
    
    if (i < 4) {
      if (i === 0) result.x += weight;
      if (i === 1) result.y += weight;
      if (i === 2) result.z += weight;
      if (i === 3) result.w += weight;
    } else {
      result.x += weight * Math.cos(phase) * 0.3;
      result.y += weight * Math.sin(phase) * 0.3;
      result.z += weight * Math.cos(phase * 1.5) * 0.3;
      result.w += weight * Math.sin(phase * 1.5) * 0.3;
    }
  }
  
  return result;
}

export const FIVE_DIMENSIONAL_SHAPES: Record<string, ParametricSurface> = {

  five_simplex_5d: {
    name: "🔺 5-Simplex (Hexateron) - 6 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const faceIndex = Math.floor(u * 6) % 6;
      const localU = (u * 6) % 1;
      const localV = v;
      
      const sqrt2 = Math.sqrt(2);
      const sqrt3 = Math.sqrt(3);
      const sqrt5 = Math.sqrt(5);
      const sqrt10 = Math.sqrt(10);
      
      const vertices: Point5D[] = [
        { x: 1/sqrt2, y: 1/sqrt2/sqrt3, z: 1/sqrt2/sqrt3/2, w: 1/sqrt5/2, v: 1/sqrt10/2 },
        { x: -1/sqrt2, y: 1/sqrt2/sqrt3, z: 1/sqrt2/sqrt3/2, w: 1/sqrt5/2, v: 1/sqrt10/2 },
        { x: 0, y: -2/sqrt2/sqrt3, z: 1/sqrt2/sqrt3/2, w: 1/sqrt5/2, v: 1/sqrt10/2 },
        { x: 0, y: 0, z: -3/sqrt2/sqrt3/2, w: 1/sqrt5/2, v: 1/sqrt10/2 },
        { x: 0, y: 0, z: 0, w: -4/sqrt5/2, v: 1/sqrt10/2 },
        { x: 0, y: 0, z: 0, w: 0, v: -5/sqrt10/2 }
      ];
      
      const v1 = vertices[faceIndex];
      const v2 = vertices[(faceIndex + 1) % 6];
      const v3 = vertices[(faceIndex + 2) % 6];
      
      const point5D: Point5D = {
        x: v1.x * (1 - localU - localV) + v2.x * localU + v3.x * localV,
        y: v1.y * (1 - localU - localV) + v2.y * localU + v3.y * localV,
        z: v1.z * (1 - localU - localV) + v2.z * localU + v3.z * localV,
        w: v1.w * (1 - localU - localV) + v2.w * localU + v3.w * localV,
        v: v1.v * (1 - localU - localV) + v2.v * localU + v3.v * localV
      };
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 2 * point3D.x, a * 2 * point3D.y, a * 2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  five_cube_penteract: {
    name: "🔷 5-Cube (Penteract) - 32 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const cellIndex = Math.floor(u * 10) % 10;
      const faceIndex = Math.floor((u * 10 % 1) * 6) % 6;
      const localU = ((u * 10 % 1) * 6) % 1;
      const localV = v;
      
      const coord1 = (localU * 2 - 1);
      const coord2 = (localV * 2 - 1);
      
      let point5D: Point5D = { x: 0, y: 0, z: 0, w: 0, v: 0 };
      
      const fixedCoord = (cellIndex < 5) ? 1 : -1;
      const fixedAxis = cellIndex % 5;
      
      switch(fixedAxis) {
        case 0:
          point5D = { x: fixedCoord, y: coord1, z: coord2, w: Math.sin(time * 0.2), v: Math.cos(time * 0.2) };
          break;
        case 1:
          point5D = { x: coord1, y: fixedCoord, z: coord2, w: Math.sin(time * 0.2), v: Math.cos(time * 0.2) };
          break;
        case 2:
          point5D = { x: coord1, y: coord2, z: fixedCoord, w: Math.sin(time * 0.2), v: Math.cos(time * 0.2) };
          break;
        case 3:
          point5D = { x: coord1, y: coord2, z: Math.sin(time * 0.2), w: fixedCoord, v: Math.cos(time * 0.2) };
          break;
        case 4:
          point5D = { x: coord1, y: coord2, z: Math.sin(time * 0.2), w: Math.cos(time * 0.2), v: fixedCoord };
          break;
      }
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 64 })
  },

  five_orthoplex_5d: {
    name: "✖️ 5-Orthoplex (Pentacross) - 10 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const vertices: Point5D[] = [
        { x: 1, y: 0, z: 0, w: 0, v: 0 },
        { x: -1, y: 0, z: 0, w: 0, v: 0 },
        { x: 0, y: 1, z: 0, w: 0, v: 0 },
        { x: 0, y: -1, z: 0, w: 0, v: 0 },
        { x: 0, y: 0, z: 1, w: 0, v: 0 },
        { x: 0, y: 0, z: -1, w: 0, v: 0 },
        { x: 0, y: 0, z: 0, w: 1, v: 0 },
        { x: 0, y: 0, z: 0, w: -1, v: 0 },
        { x: 0, y: 0, z: 0, w: 0, v: 1 },
        { x: 0, y: 0, z: 0, w: 0, v: -1 }
      ];
      
      const faceIndex = Math.floor(u * 32) % 32;
      const localU = (u * 32) % 1;
      const localV = v;
      
      const v1Index = faceIndex % 10;
      const v2Index = (faceIndex + 2) % 10;
      const v3Index = (faceIndex + 4) % 10;
      
      const vert1 = vertices[v1Index];
      const vert2 = vertices[v2Index];
      const vert3 = vertices[v3Index];
      
      const bary1 = 1 - localU - localV * 0.5;
      const bary2 = localU;
      const bary3 = localV * 0.5;
      
      const point5D: Point5D = {
        x: vert1.x * bary1 + vert2.x * bary2 + vert3.x * bary3,
        y: vert1.y * bary1 + vert2.y * bary2 + vert3.y * bary3,
        z: vert1.z * bary1 + vert2.z * bary2 + vert3.z * bary3,
        w: vert1.w * bary1 + vert2.w * bary2 + vert3.w * bary3,
        v: vert1.v * bary1 + vert2.v * bary2 + vert3.v * bary3
      };
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.3, 0.4, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 64 })
  },

  demipenteract_5d: {
    name: "💎 Demipenteract (5D Half-Cube) - 16 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const vertices: Point5D[] = [];
      for (let i = 0; i < 32; i++) {
        const bits = [
          (i & 1) ? 1 : -1,
          (i & 2) ? 1 : -1,
          (i & 4) ? 1 : -1,
          (i & 8) ? 1 : -1,
          (i & 16) ? 1 : -1
        ];
        const evenParity = (bits.filter(b => b === 1).length) % 2 === 0;
        if (evenParity) {
          vertices.push({ x: bits[0], y: bits[1], z: bits[2], w: bits[3], v: bits[4] });
        }
      }
      
      const faceIndex = Math.floor(u * 16) % 16;
      const localU = (u * 16) % 1;
      const localV = v;
      
      const v1 = vertices[faceIndex % vertices.length];
      const v2 = vertices[(faceIndex + 1) % vertices.length];
      const v3 = vertices[(faceIndex + 2) % vertices.length];
      
      const point5D: Point5D = {
        x: v1.x * (1 - localU) * (1 - localV) + v2.x * localU * (1 - localV) + v3.x * localV,
        y: v1.y * (1 - localU) * (1 - localV) + v2.y * localU * (1 - localV) + v3.y * localV,
        z: v1.z * (1 - localU) * (1 - localV) + v2.z * localU * (1 - localV) + v3.z * localV,
        w: v1.w * (1 - localU) * (1 - localV) + v2.w * localU * (1 - localV) + v3.w * localV,
        v: v1.v * (1 - localU) * (1 - localV) + v2.v * localU * (1 - localV) + v3.v * localV
      };
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.28, 0.38, 0.32);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 0.8 * point3D.x, a * 0.8 * point3D.y, a * 0.8 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  },

  five_sphere_5d: {
    name: "🌐 5-Sphere (S⁴) - Hypersphere Boundary",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const phi1 = u * Math.PI;
      const phi2 = v * Math.PI;
      const phi3 = time * 0.2;
      const phi4 = time * 0.15;
      
      const point5D: Point5D = {
        x: Math.cos(phi1),
        y: Math.sin(phi1) * Math.cos(phi2),
        z: Math.sin(phi1) * Math.sin(phi2) * Math.cos(phi3),
        w: Math.sin(phi1) * Math.sin(phi2) * Math.sin(phi3) * Math.cos(phi4),
        v: Math.sin(phi1) * Math.sin(phi2) * Math.sin(phi3) * Math.sin(phi4)
      };
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  cubinder_5d: {
    name: "📦 Cubinder (Cube × Interval)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const cubeU = u * 6;
      const faceIndex = Math.floor(cubeU) % 6;
      const localU = cubeU % 1;
      const localV = v;
      
      const coord1 = (localU * 2 - 1);
      const coord2 = (localV * 2 - 1);
      const intervalPos = Math.sin(u * Math.PI * 2 + time * 0.3);
      
      let point5D: Point5D = { x: 0, y: 0, z: 0, w: 0, v: intervalPos };
      
      switch(faceIndex) {
        case 0: point5D.x = 1; point5D.y = coord1; point5D.z = coord2; break;
        case 1: point5D.x = -1; point5D.y = coord1; point5D.z = coord2; break;
        case 2: point5D.x = coord1; point5D.y = 1; point5D.z = coord2; break;
        case 3: point5D.x = coord1; point5D.y = -1; point5D.z = coord2; break;
        case 4: point5D.x = coord1; point5D.y = coord2; point5D.z = 1; break;
        case 5: point5D.x = coord1; point5D.y = coord2; point5D.z = -1; break;
      }
      point5D.w = intervalPos * 0.5;
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.22, 0.32, 0.28);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  },

  spherinder_5d: {
    name: "🔮 Spherinder (Sphere × Interval)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const intervalPos = Math.sin(u * Math.PI * 4 + time * 0.25);
      
      const point5D: Point5D = {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
        w: intervalPos * 0.7,
        v: intervalPos * 0.3
      };
      
      const point4D = project5Dto4D(point5D, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.2 * point3D.x, a * 1.2 * point3D.y, a * 1.2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  }
};

export const HIGHER_DIMENSIONAL_SHAPES: Record<string, ParametricSurface> = {

  n_simplex_6d: {
    name: "🔺 6-Simplex (Heptapeton) - 7 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = 6;
      
      const vertices: PointND[] = [];
      for (let i = 0; i <= n; i++) {
        const coords = new Array(n).fill(0);
        if (i < n) {
          coords[i] = 1;
        } else {
          for (let j = 0; j < n; j++) coords[j] = -1/n;
        }
        vertices.push({ coords });
      }
      
      const faceIndex = Math.floor(u * (n + 1)) % (n + 1);
      const localU = (u * (n + 1)) % 1;
      const localV = v;
      
      const v1 = vertices[faceIndex];
      const v2 = vertices[(faceIndex + 1) % (n + 1)];
      const v3 = vertices[(faceIndex + 2) % (n + 1)];
      
      const resultCoords = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        resultCoords[i] = v1.coords[i] * (1 - localU - localV * 0.5) + 
                         v2.coords[i] * localU + 
                         v3.coords[i] * localV * 0.5;
      }
      
      const point4D = projectNDto4D({ coords: resultCoords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.38, 0.32);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  },

  n_cube_6d: {
    name: "🔷 6-Cube (Hexeract) - 64 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = 6;
      
      const faceIndex = Math.floor(u * 12) % 12;
      const localU = (u * 12) % 1;
      const localV = v;
      
      const coord1 = localU * 2 - 1;
      const coord2 = localV * 2 - 1;
      
      const coords = new Array(n).fill(0);
      const fixedAxis = faceIndex % n;
      const fixedSign = faceIndex < n ? 1 : -1;
      
      coords[fixedAxis] = fixedSign;
      coords[(fixedAxis + 1) % n] = coord1;
      coords[(fixedAxis + 2) % n] = coord2;
      coords[(fixedAxis + 3) % n] = Math.sin(time * 0.2);
      coords[(fixedAxis + 4) % n] = Math.cos(time * 0.2);
      coords[(fixedAxis + 5) % n] = Math.sin(time * 0.15);
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.2, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 64 })
  },

  n_orthoplex_6d: {
    name: "✖️ 6-Orthoplex (Hexacross) - 12 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = 6;
      
      const vertices: PointND[] = [];
      for (let i = 0; i < n; i++) {
        const coordsPos = new Array(n).fill(0);
        const coordsNeg = new Array(n).fill(0);
        coordsPos[i] = 1;
        coordsNeg[i] = -1;
        vertices.push({ coords: coordsPos }, { coords: coordsNeg });
      }
      
      const faceIndex = Math.floor(u * 2 * n) % (2 * n);
      const localU = (u * 2 * n) % 1;
      const localV = v;
      
      const v1 = vertices[faceIndex];
      const v2 = vertices[(faceIndex + 2) % (2 * n)];
      const v3 = vertices[(faceIndex + 4) % (2 * n)];
      
      const resultCoords = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        resultCoords[i] = v1.coords[i] * (1 - localU - localV * 0.3) + 
                         v2.coords[i] * localU + 
                         v3.coords[i] * localV * 0.3;
      }
      
      const point4D = projectNDto4D({ coords: resultCoords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.28, 0.4, 0.35);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.3 * point3D.x, a * 1.3 * point3D.y, a * 1.3 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 64 })
  },

  e6_lattice: {
    name: "⚛️ E₆ Exceptional Lattice (6D)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const root1 = [1, -1, 0, 0, 0, 0];
      const root2 = [0, 1, -1, 0, 0, 0];
      const root3 = [0, 0, 1, -1, 0, 0];
      const root4 = [0, 0, 0, 1, -1, 0];
      const root5 = [0, 0, 0, 1, 1, 0];
      const root6 = [-0.5, -0.5, -0.5, -0.5, -0.5, Math.sqrt(3)/2];
      
      const t = time * 0.3;
      const coords = new Array(6).fill(0);
      for (let i = 0; i < 6; i++) {
        coords[i] = root1[i] * Math.sin(theta) * Math.sin(phi) +
                   root2[i] * Math.cos(theta) * Math.sin(phi) +
                   root3[i] * Math.cos(phi) +
                   root4[i] * Math.sin(theta + t) * 0.5 +
                   root5[i] * Math.cos(theta + t) * 0.5 +
                   root6[i] * Math.sin(phi + t) * 0.5;
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.3, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.2 * point3D.x, a * 1.2 * point3D.y, a * 1.2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  e7_lattice: {
    name: "⚛️ E₇ Exceptional Lattice (7D)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const coords = new Array(7).fill(0);
      
      for (let i = 0; i < 7; i++) {
        const phase = (i / 7) * Math.PI * 2;
        coords[i] = Math.sin(theta + phase) * Math.sin(phi) * Math.cos(phase + time * 0.2) +
                   Math.cos(theta + phase) * Math.cos(phi) * Math.sin(phase + time * 0.15);
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.18, 0.32, 0.28);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.2 * point3D.x, a * 1.2 * point3D.y, a * 1.2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 96, vSegments: 96 })
  },

  e8_lattice: {
    name: "⚛️ E₈ Exceptional Lattice (8D) - 240 Roots",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const coords = new Array(8).fill(0);
      
      for (let i = 0; i < 8; i++) {
        const phase = (i / 8) * Math.PI * 2;
        const amplitude = 1 - 0.1 * i / 8;
        coords[i] = amplitude * (
          Math.sin(theta + phase) * Math.sin(phi) +
          0.5 * Math.cos(2 * theta + phase + time * 0.1) * Math.cos(phi)
        );
      }
      
      const evenSum = coords.reduce((a, b) => a + b, 0);
      const integerPart = Math.abs(evenSum - Math.round(evenSum));
      if (integerPart > 0.25) {
        for (let i = 0; i < 8; i++) coords[i] *= 0.8;
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.12, 0.28, 0.24);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.3 * point3D.x, a * 1.3 * point3D.y, a * 1.3 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 96 })
  },

  leech_lattice_24d: {
    name: "🌌 Leech Lattice (24D) - Sphere Packing",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const coords = new Array(24).fill(0);
      
      for (let i = 0; i < 24; i++) {
        const phase = (i / 24) * Math.PI * 2;
        const layer = Math.floor(i / 8);
        const inLayer = i % 8;
        
        coords[i] = Math.sin(theta + phase) * Math.sin(phi + layer * 0.5) * 
                   Math.cos(inLayer * Math.PI / 4 + time * 0.08) * 
                   (1 - layer * 0.15);
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.1, 0.25, 0.2);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 96 })
  },

  n_simplex_generic: {
    name: "🔺 N-Simplex (Configurable Dimension)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = Math.floor(params.b ?? 5);
      
      const vertices: PointND[] = [];
      for (let i = 0; i <= n; i++) {
        const coords = new Array(n).fill(-1 / Math.sqrt(2 * (n + 1)));
        if (i < n) {
          coords[i] = Math.sqrt((n + 1) / (2 * n));
        }
        vertices.push({ coords });
      }
      
      const faceIndex = Math.floor(u * (n + 1)) % (n + 1);
      const localU = (u * (n + 1)) % 1;
      const localV = v;
      
      const v1 = vertices[faceIndex];
      const v2 = vertices[(faceIndex + 1) % (n + 1)];
      const v3 = vertices[(faceIndex + 2) % (n + 1)];
      
      const resultCoords = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        resultCoords[i] = v1.coords[i] * (1 - localU - localV * 0.5) + 
                         v2.coords[i] * localU + 
                         v3.coords[i] * localV * 0.5;
      }
      
      const point4D = projectNDto4D({ coords: resultCoords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.22, 0.35, 0.3);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.5 * point3D.x, a * 1.5 * point3D.y, a * 1.5 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 96, vSegments: 64 })
  },

  n_cube_generic: {
    name: "🔷 N-Cube (Configurable Dimension)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = Math.floor(params.b ?? 5);
      
      const faceIndex = Math.floor(u * 2 * n) % (2 * n);
      const localU = (u * 2 * n) % 1;
      const localV = v;
      
      const coord1 = localU * 2 - 1;
      const coord2 = localV * 2 - 1;
      
      const coords = new Array(n).fill(0);
      const fixedAxis = faceIndex % n;
      const fixedSign = faceIndex < n ? 1 : -1;
      
      coords[fixedAxis] = fixedSign;
      for (let i = 1; i < n; i++) {
        const axis = (fixedAxis + i) % n;
        if (i === 1) coords[axis] = coord1;
        else if (i === 2) coords[axis] = coord2;
        else coords[axis] = Math.sin(time * 0.1 * i + i);
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.18, 0.32, 0.28);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * point3D.x, a * point3D.y, a * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 128, vSegments: 64 })
  },

  n_orthoplex_generic: {
    name: "✖️ N-Orthoplex (Configurable Cross-Polytope)",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      const n = Math.floor(params.b ?? 5);
      
      const vertices: PointND[] = [];
      for (let i = 0; i < n; i++) {
        const coordsPos = new Array(n).fill(0);
        const coordsNeg = new Array(n).fill(0);
        coordsPos[i] = 1;
        coordsNeg[i] = -1;
        vertices.push({ coords: coordsPos }, { coords: coordsNeg });
      }
      
      const faceIndex = Math.floor(u * 2 * n) % (2 * n);
      const localU = (u * 2 * n) % 1;
      const localV = v;
      
      const v1 = vertices[faceIndex];
      const v2 = vertices[(faceIndex + 2) % (2 * n)];
      const v3 = vertices[(faceIndex + 4) % (2 * n)];
      
      const resultCoords = new Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        resultCoords[i] = v1.coords[i] * (1 - localU - localV * 0.3) + 
                         v2.coords[i] * localU + 
                         v3.coords[i] * localV * 0.3;
      }
      
      const point4D = projectNDto4D({ coords: resultCoords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.25, 0.38, 0.32);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.2 * point3D.x, a * 1.2 * point3D.y, a * 1.2 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, b: 5, e: 0, uSegments: 96, vSegments: 64 })
  },

  gosset_polytope_8d: {
    name: "💎 Gosset 4₂₁ Polytope (8D) - 240 Vertices",
    equation: (u, v, params) => {
      const a = params.a ?? 2;
      const time = params.e ?? 0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const coords = new Array(8).fill(0);
      
      const permutations = [
        [1, 1, 0, 0, 0, 0, 0, 0],
        [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5]
      ];
      
      for (let i = 0; i < 8; i++) {
        const phase = (i / 8) * Math.PI * 2;
        coords[i] = permutations[0][i] * Math.sin(theta + phase) * Math.sin(phi) +
                   permutations[1][i] * Math.cos(theta + phase) * Math.cos(phi) +
                   0.3 * Math.sin(2 * theta + phase + time * 0.15);
      }
      
      const point4D = projectNDto4D({ coords }, time);
      const [q1, q2] = EnhancedProjections.animatedRotation(time * 0.15, 0.3, 0.25);
      const point3D = EnhancedProjections.rotateAndProject(point4D, q1, q2, 'stereographic');
      
      return [a * 1.3 * point3D.x, a * 1.3 * point3D.y, a * 1.3 * point3D.z];
    },
    defaultParams: getCleanDefaults({ a: 2, e: 0, uSegments: 128, vSegments: 96 })
  }
};
