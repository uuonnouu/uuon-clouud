# Unified Geometry Engine Δmention M.U.  
  
import { SurfaceParameters } from '../types/math';  
import { applyPlaneTransform } from './planeTransforms';  
import { UNIFIED_SHAPES } from './unifiedShapes';  
import { CLEAN_SURFACES } from './cleanMathEngine';  
import { EXCLUSIVE_SHAPES } from './exclusiveShapes';  
import { NON_EUCLIDEAN_SHAPES } from './nonEuclideanShapes';  
import { RIEMANN_SURFACES } from './riemannSurfaces';  
import { EDUCATIONAL_SURFACES } from './educationalSurfaces';  
import { GENERATIVE_ALGORITHMS } from './generativeAlgorithms';  
import { NOISE_FUNCTIONS } from './noiseFunctions';  
import { DIFFERENTIAL_GROWTH } from './differentialGrowth';  
import { ATTRACTOR_SYSTEMS } from './attractorSystems';  
import { VORONOI_SYSTEMS } from './voronoiSystems';  
import { QUANTUM_PARAMETRIC_FUNCTIONS } from './quantumParametricFunctions';  
import { QUANTUM_GAP_SURFACES } from './quantumGapMathematics';  
import { DNA_STRUCTURES } from './dnaStructures';  
import { HUMAN_ANATOMY_SHAPES } from './humanAnatomyShapes';  
import { HYPERCOMPUTATION_SURFACES } from './hypercomputationSurfaces';  
import { ASTROPHYSICAL_PHENOMENA } from './astrophysicalPhenomena';  
import { HISTORICAL_ALGORITHMS } from './historicalAlgorithms';  
  
export interface ParametricSurface {  
  name: string;  
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];  
  defaultParams: Partial<SurfaceParameters>;  
}  
  
export const PARAMETRIC_SURFACES: Record<string, ParametricSurface> = {  
  // BASIC GEOMETRIC SHAPES - Essential Foundation  
  square: {  
    name: "Square",  
    equation: (u, v, params) => {  
      const { a = 1, b = 1 } = params;  
      return [a * (u - 0.5), b * (v - 0.5), 0];  
    },  
    defaultParams: { a: 1, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 10, vSegments: 10 }  
  },  
  
  cube: {  
    name: "Cube",  
    equation: (u, v, params) => {  
      const { a = 1 } = params;  
      const face = Math.floor(u * 6) % 6;  
      const localU = (u * 6) % 1;  
      const localV = v;  
  
      const positions = [  
        [a * (localU - 0.5), a * (localV - 0.5), a * 0.5],   // front  
        [a * (localU - 0.5), a * (localV - 0.5), -a * 0.5],  // back  
        [a * 0.5, a * (localU - 0.5), a * (localV - 0.5)],   // right  
        [-a * 0.5, a * (localU - 0.5), a * (localV - 0.5)],  // left  
        [a * (localU - 0.5), a * 0.5, a * (localV - 0.5)],   // top  
        [a * (localU - 0.5), -a * 0.5, a * (localV - 0.5)]   // bottom  
      ];  
  
      return positions[face] as [number, number, number];  
    },  
    defaultParams: { a: 1, uMin: 0, uMax: 6, vMin: 0, vMax: 1, uSegments: 24, vSegments: 4 }  
  },  
  
  circle: {  
    name: "Circle",  
    equation: (u, v, params) => {  
      const { a = 1, b = 0.1 } = params;  
      const theta = u * 2 * Math.PI;  
      const radius = a * (1 - v) + a * b * v;  
      return [radius * Math.cos(theta), radius * Math.sin(theta), 0];  
    },  
    defaultParams: { a: 1, b: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 2 }  
  },  
  
  triangle: {  
    name: "Triangle",  
    equation: (u, v, params) => {  
      const { a = 1 } = params;  
      const x = a * (u - 0.5);  
      const y = a * (v - 0.33) * Math.sqrt(3);  
      return u + v <= 1 ? [x, y, 0] : [x - a, y, 0];  
    },  
    defaultParams: { a: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 16, vSegments: 16 }  
  },  
  
  cylinder: {  
    name: "Cylinder",  
    equation: (u, v, params) => {  
      const { a = 1, b = 2 } = params;  
      const theta = u * 2 * Math.PI;  
      const height = b * (v - 0.5);  
      return [a * Math.cos(theta), a * Math.sin(theta), height];  
    },  
    defaultParams: { a: 1, b: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }  
  },  
  
  torus: {  
    name: "Torus",  
    equation: (u, v, params) => {  
      const { a = 2, b = 0.5 } = params;  
      const theta = u * 2 * Math.PI;  
      const phi = v * 2 * Math.PI;  
      const x = (a + b * Math.cos(phi)) * Math.cos(theta);  
      const y = (a + b * Math.cos(phi)) * Math.sin(theta);  
      const z = b * Math.sin(phi);  
      return [x, y, z];  
    },  
    defaultParams: { a: 2, b: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }  
  },  
  
  tetrahedron: {  
    name: "Tetrahedron",  
    equation: (u, v, params) => {  
      const { a = 1 } = params;  
      const face = Math.floor(u * 4) % 4;  
      const localU = (u * 4) % 1;  
      const localV = v;  
  
      const vertices = [  
        [a, a, a], [-a, -a, a], [-a, a, -a], [a, -a, -a]  
      ];  
      const faces = [[0,1,2], [0,1,3], [0,2,3], [1,2,3]];  
      const faceVerts = faces[face].map(i => vertices[i]);  
  
      if (localU + localV <= 1) {  
        return [  
          faceVerts[0][0] * (1 - localU - localV) + faceVerts[1][0] * localU + faceVerts[2][0] * localV,  
          faceVerts[0][1] * (1 - localU - localV) + faceVerts[1][1] * localU + faceVerts[2][1] * localV,  
          faceVerts[0][2] * (1 - localU - localV) + faceVerts[1][2] * localU + faceVerts[2][2] * localV  
        ];  
      }  
      return [0, 0, 0];  
    },  
    defaultParams: { a: 1, uMin: 0, uMax: 4, vMin: 0, vMax: 1, uSegments: 12, vSegments: 12 }  
  },  
  
  cone: {  
    name: "Cone",  
    equation: (u, v, params) => {  
      const { a = 1, b = 2 } = params;  
      const theta = u * 2 * Math.PI;  
      const radius = a * (1 - v);  
      const height = b * v;  
      return [radius * Math.cos(theta), radius * Math.sin(theta), height];  
    },  
    defaultParams: { a: 1, b: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }  
  },  
  
  // STREAMLINED HIGH-VALUE COMMERCIAL SURFACES  
  nautilus_shell: {  
    name: "🐚 Nautilus Shell - Streamlined",  
    equation: (u, v, params) => {  
      const { a = 2.0, b = 0.3, c = 1.618, d = 1.0 } = params;  
      const theta = u;  
      const phi = v;  
  
      // Core logarithmic spiral  
      const radius = a * Math.exp(b * theta);  
      const chamber = c * Math.sin(d * theta);  
  
      const x = (radius + chamber) * Math.cos(theta);  
      const y = (radius + chamber) * Math.sin(theta);  
      const z = phi * 2 + Math.sin(theta * 2);  
  
      return [x, y, z];  
    },  
    defaultParams: {   
      a: 2.0, b: 0.3, c: 1.618, d: 1.0,  
      uMin: 0, uMax: 4 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 100, vSegments: 50   
    }  
  },  
  
  enneper_surface: {  
    name: "🌀 Enneper's Surface - Streamlined",   
    equation: (u, v, params) => {  
      const { a = 1.0, b = 1.0, c = 1.0, d = 0.3 } = params;  
  
      // Core Enneper equations  
      const x = a * (u - u*u*u/3 + u*v*v) + d * Math.sin(u);  
      const y = b * (v - v*v*v/3 + u*u*v) + d * Math.cos(v);  
      const z = c * (u*u - v*v);  
  
      return [x, y, z];  
    },  
    defaultParams: {   
      a: 1.0, b: 1.0, c: 1.0, d: 0.3,  
      uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 80, vSegments: 80   
    }  
  },  
  
  flower_of_life_3d: {  
    name: "🌸 3D Flower of Life - Streamlined",  
    equation: (u, v, params) => {  
      const { a = 1.0, b = 1.0, c = 6.0, d = 0.618 } = params;  
  
      const circleIndex = Math.floor(u * c) % Math.floor(c);  
      const theta = (u * c) % 1 * 2 * Math.PI;  
      const phi = v * 2 * Math.PI;  
  
      // Hexagonal pattern  
      let centerX = 0, centerY = 0;  
      if (circleIndex > 0) {  
        const hexAngle = (circleIndex - 1) * Math.PI / 3;  
        centerX = a * Math.cos(hexAngle);  
        centerY = a * Math.sin(hexAngle);  
      }  
  
      const x = centerX + b * Math.cos(theta);  
      const y = centerY + b * Math.sin(theta);  
      const z = d * Math.sin(phi) + Math.cos(theta * 6);  
  
      return [x, y, z];  
    },  
    defaultParams: {   
      a: 1.0, b: 1.0, c: 6.0, d: 0.618,  
      uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 120, vSegments: 60   
    }  
  },  
  
  catenoid: {  
    name: "⏳ Catenoid - Streamlined",  
    equation: (u, v, params) => {  
      const { a = 1.0, b = 1.0, c = 0.5, d = 1.0 } = params;  
  
      const theta = u;  
      const w = v;  
      const radius = a * Math.cosh(b * w) + c * Math.sin(d * theta);  
  
      const x = radius * Math.cos(theta);  
      const y = radius * Math.sin(theta);   
      const z = w;  
  
      return [x, y, z];  
    },  
    defaultParams: {   
      a: 1.0, b: 1.0, c: 0.5, d: 1.0,  
      uMin: 0, uMax: 2 * Math.PI, vMin: -2, vMax: 2, uSegments: 60, vSegments: 100   
    }  
  },  
  
  helicoid: {  
    name: "🌪️ Helicoid - Streamlined",  
    equation: (u, v, params) => {  
      const { a = 0.5, b = 1.0, c = 1.0, d = 0.3 } = params;  
  
      const rho = u;  
      const theta = v;  
  
      const x = (rho + c * Math.sin(d * theta)) * Math.cos(theta);  
      const y = (rho + c * Math.sin(d * theta)) * Math.sin(theta);  
      const z = a * theta + b * Math.sin(rho);  
  
      return [x, y, z];  
    },  
    defaultParams: {   
      a: 0.5, b: 1.0, c: 1.0, d: 0.3,  
      uMin: 0, uMax: 2 * Math.PI, vMin: -2, vMax: 2, uSegments: 80, vSegments: 100   
    }  
  }  
};  
  
// PLANE TRANSFORM INTEGRATION  
export function generateSurfaceWithPlaneTransform(  
  surfaceType: string,   
  planeTransform: string | null,  
  params: SurfaceParameters  
): [number, number, number][] {  
  const surface = PARAMETRIC_SURFACES[surfaceType];  
  if (!surface) return [];  
  
  const { uMin = 0, uMax = 1, vMin = 0, vMax = 1, uSegments = 32, vSegments = 32 } = surface.defaultParams;  
  const points: [number, number, number][] = [];  
  
  // Generate base surface points  
  for (let i = 0; i <= uSegments; i++) {  
    for (let j = 0; j <= vSegments; j++) {  
      const u = uMin + (uMax - uMin) * i / uSegments;  
      const v = vMin + (vMax - vMin) * j / vSegments;  
      const point = surface.equation(u, v, params);  
      points.push(point);  
    }  
  }  
  
  // Apply plane transformation if specified  
  if (planeTransform && planeTransform !== 'none') {  
    return applyPlaneTransform(points, planeTransform, params);  
  }  
  
  return points;  
}  
  
export function getSurfaceEquation(type: string): ParametricSurface | null {  
  try {  
    // Search all available shape collections for the requested type  
    // Priority order: Quantum Gap surfaces, UNIFIED_SHAPES, Astrophysical, DNA structures, Human Anatomy, Hypercomputation, generative algorithms, quantum functions, then legacy collections  
    const allCollections: Array<Record<string, any>> = [  
      QUANTUM_GAP_SURFACES,  
      UNIFIED_SHAPES,  
      ASTROPHYSICAL_PHENOMENA,  
      DNA_STRUCTURES,  
      HUMAN_ANATOMY_SHAPES,  
      HYPERCOMPUTATION_SURFACES,  
      HISTORICAL_ALGORITHMS,  
      GENERATIVE_ALGORITHMS,  
      QUANTUM_PARAMETRIC_FUNCTIONS,  
      NOISE_FUNCTIONS,  
      DIFFERENTIAL_GROWTH,  
      ATTRACTOR_SYSTEMS,  
      VORONOI_SYSTEMS,  
      PARAMETRIC_SURFACES,  
      CLEAN_SURFACES,  
      EXCLUSIVE_SHAPES,  
      NON_EUCLIDEAN_SHAPES,  
      RIEMANN_SURFACES,  
      EDUCATIONAL_SURFACES  
    ];  
  
    for (const collection of allCollections) {  
      if (!collection || typeof collection !== 'object') continue;  
  
      const shape = collection[type];  
      if (shape) {  
        // Normalize the shape to ParametricSurface interface  
        if (shape.equation && shape.defaultParams) {  
          return shape; // Already correct interface  
        } else if (shape.equation && shape.defaults) {  
          // Convert from SurfaceEquation to ParametricSurface  
          return {  
            name: shape.name || type,  
            equation: shape.equation,  
            defaultParams: shape.defaults  
          };  
        } else if (shape.x && shape.y && shape.z) {  
          // Convert from coordinate functions to equation  
          return {  
            name: shape.name || type,  
            equation: (u, v, params) => {  
              try {  
                return [  
                  shape.x(u, v, params.a, params.b, params.c, params.d, params.e, params.f, params.g, params.h, params.i, params.j, params.k, params.l, params.m, params.n, params.o, params.p, params.q, params.r, params.s, params.t, params.u, params.v, params.w),  
                  shape.y(u, v, params.a, params.b, params.c, params.d, params.e, params.f, params.g, params.h, params.i, params.j, params.k, params.l, params.m, params.n, params.o, params.p, params.q, params.r, params.s, params.t, params.u, params.v, params.w),  
                  shape.z(u, v, params.a, params.b, params.c, params.d, params.e, params.f, params.g, params.h, params.i, params.j, params.k, params.l, params.m, params.n, params.o, params.p, params.q, params.r, params.s, params.t, params.u, params.v, params.w)  
                ];  
              } catch (err) {  
                console.error(`Error evaluating shape equation for ${type}:`, err);  
                return [0, 0, 0];  
              }  
            },  
            defaultParams: shape.defaults || {}  
          };  
        }  
      }  
    }  
  
    return null;  
  } catch (error) {  
    console.error(`Error in getSurfaceEquation for ${type}:`, error);  
    return null;  
  }  
}  
  
// Memory pool for reusing geometry objects  
const geometryPool = new Map<string, any[]>();  
const maxPoolSize = 10;  
  
function getFromPool(type: string): any | null {  
  const pool = geometryPool.get(type);  
  return pool && pool.length > 0 ? pool.pop() : null;  
}  
  
function returnToPool(type: string, geometry: any): void {  
  if (!geometryPool.has(type)) {  
    geometryPool.set(type, []);  
  }  
  const pool = geometryPool.get(type)!;  
  if (pool.length < maxPoolSize) {  
    // Reset geometry state before pooling  
    geometry.dispose();  
    pool.push(geometry);  
  }  
}  
  
export function getDefaultParameters(surfaceType: string): Partial<SurfaceParameters> {  
  try {  
    const surface = getSurfaceEquation(surfaceType);  
    if (surface && surface.defaultParams) {  
      return surface.defaultParams;  
    }  
  
    console.warn(`No defaults found for shape: ${surfaceType}, using fallback`);  
  
    // Fallback defaults for any shape  
    return {  
      a: 2, b: 1, c: 1, d: 1, e: 0, f: 1,  
      g: 0, h: 1, i: 0, j: 0, k: 0, l: 1, m: 0,  
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0,  
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,  
      uSegments: 32, vSegments: 32  
    };  
  } catch (error) {  
    console.error('Error getting default parameters for', surfaceType, ':', error);  
  
    // Safe fallback  
    return {  
      a: 2, b: 1, c: 1, d: 1, e: 0, f: 1,  
      g: 0, h: 1, i: 0, j: 0, k: 0, l: 1, m: 0,  
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0,  
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,  
      uSegments: 32, vSegments: 32  
    };  
  }  
}  
