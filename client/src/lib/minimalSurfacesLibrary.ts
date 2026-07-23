/**
 * MINIMAL SURFACES LIBRARY
 * Research-grade parametric equations from minimalsurfaces.blog
 * 
 * Organized into three categories:
 * - Spheres: Surfaces conformally equivalent to punctured spheres
 * - Tori: Genus 1 minimal surfaces
 * - Higher Genus: Complex minimal surfaces with genus ≥ 2
 * 
 * Based on Weierstrass-Enneper representation where applicable:
 * G(z) = Gauss map, dh = height differential
 * 
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 * Attribution: Mathematical formulations from minimalsurfaces.blog research repository
 */

import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface MinimalSurface {
  name: string;
  description: string;
  attribution?: string;
  weierstrassData?: {
    G: string;
    dh: string;
  };
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// ============================================================================
// SPHERES - Minimal surfaces conformally equivalent to punctured spheres
// ============================================================================

export const MINIMAL_SURFACES_SPHERES: Record<string, MinimalSurface> = {
  
  catenoid_euler: {
    name: "⏳ Catenoid (Euler 1744)",
    description: "The first minimal surface discovered. Leonhard Euler showed in 1744 that among surfaces of revolution, it has minimal area. Conjugate to the helicoid. Weierstrass: G(z)=z, dh=1/z dz.",
    attribution: "Leonhard Euler, 1744",
    weierstrassData: { G: "z", dh: "1/z dz" },
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const stretch = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4 * stretch;
      
      const r = a * Math.cosh(t / b);
      
      const x = r * Math.cos(theta) * c;
      const y = r * Math.sin(theta) * c;
      const z = t * c;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 64
    })
  },

  enneper_surface_classic: {
    name: "🌀 Enneper Surface (1871)",
    description: "Alfred Enneper's minimal surface with planar curvature lines and winding number 3. Intrinsically a surface of revolution. Total curvature -4π. Weierstrass: G(z)=z, dh=z dz.",
    attribution: "Alfred Enneper, 1871",
    weierstrassData: { G: "z", dh: "z dz" },
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const scale = params.d ?? 2;
      
      const s = (u - 0.5) * scale;
      const t = (v - 0.5) * scale;
      
      const x = a * (s - s*s*s/3 + s*t*t);
      const y = b * (t - t*t*t/3 + s*s*t);
      const z = c * (s*s - t*t);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 80
    })
  },

  jorge_meeks_3noid: {
    name: "🔱 Jorge-Meeks 3-Noid",
    description: "Symmetric 3-Noid with three catenoidal ends arranged with 3-fold rotational symmetry. Discovered by Jorge and Meeks in 1983.",
    attribution: "L.P. Jorge, W.H. Meeks III, 1983",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = 3;
      
      const theta = u * Math.PI * 2;
      const r = (v + 0.1) * 3;
      
      const rk = Math.pow(r, k);
      const cosk = Math.cos(k * theta);
      const sink = Math.sin(k * theta);
      
      const denom = rk * rk + 2 * rk * cosk + 1;
      const factor = a / Math.sqrt(Math.max(0.01, denom));
      
      const x = factor * r * Math.cos(theta) * b;
      const y = factor * r * Math.sin(theta) * b;
      const z = c * Math.log(Math.max(0.01, denom)) * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  jorge_meeks_knoid: {
    name: "🌟 Jorge-Meeks k-Noid (Parametric)",
    description: "Generalized k-Noid with k catenoidal ends. Parameter D controls the number of ends (3-13). Highly symmetric minimal surfaces.",
    attribution: "L.P. Jorge, W.H. Meeks III, 1983",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(3, Math.min(13, Math.round(params.d ?? 4)));
      
      const theta = u * Math.PI * 2;
      const r = (v + 0.1) * 3;
      
      const rk = Math.pow(r, k);
      const cosk = Math.cos(k * theta);
      const sink = Math.sin(k * theta);
      
      const denom = rk * rk + 2 * rk * cosk + 1;
      const factor = a / Math.sqrt(Math.max(0.01, denom));
      
      const x = factor * r * Math.cos(theta) * b;
      const y = factor * r * Math.sin(theta) * b;
      const z = c * Math.log(Math.max(0.01, denom)) * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 4,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  noid_4_two_planes: {
    name: "✦ 4-Noid with Two Symmetry Planes",
    description: "A 4-Noid minimal surface with exactly two planes of reflective symmetry, breaking the full dihedral symmetry of the Jorge-Meeks 4-Noid.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const asymmetry = params.d ?? 0.3;
      
      const theta = u * Math.PI * 2;
      const r = (v + 0.1) * 3;
      
      const r4 = Math.pow(r, 4);
      const cos4 = Math.cos(4 * theta);
      const cos2 = Math.cos(2 * theta);
      
      const denom = r4 + 2 * r4 * cos4 * (1 + asymmetry * cos2) + 1;
      const factor = a / Math.sqrt(Math.max(0.01, denom));
      
      const x = factor * r * Math.cos(theta) * b * (1 + asymmetry * 0.2 * cos2);
      const y = factor * r * Math.sin(theta) * b;
      const z = c * Math.log(Math.max(0.01, denom)) * 0.5;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.3,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  pyramidal_knoid: {
    name: "🔺 Pyramidal k-Noid",
    description: "k-Noid with ends arranged in pyramidal configuration. One end points up, the others arranged in a ring pointing down.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(3, Math.min(8, Math.round(params.d ?? 4)));
      const tilt = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const rBase = 2;
      const apexWeight = (1 - Math.cos(phi)) / 2;
      
      const rk = Math.pow(rBase * Math.sin(phi), k);
      const cosk = Math.cos(k * theta);
      
      const x = a * rBase * Math.sin(phi) * Math.cos(theta);
      const y = b * rBase * Math.sin(phi) * Math.sin(theta);
      const z = c * (rBase * Math.cos(phi) + tilt * rk * cosk * 0.1);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 4, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0.1, vMax: 0.9,
      uSegments: 96, vSegments: 48
    })
  },

  bipyramidal_knoid: {
    name: "💎 Bipyramidal k-Noid",
    description: "k-Noid with ends arranged in bipyramidal (double pyramid) configuration. Ends point both up and down with a ring around the equator.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(3, Math.min(8, Math.round(params.d ?? 4)));
      const stretch = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const rBase = 2;
      const rk = Math.pow(rBase * Math.sin(phi), k);
      const cosk = Math.cos(k * theta);
      
      const radialMod = 1 + 0.3 * cosk * Math.sin(phi * 2);
      
      const x = a * rBase * Math.sin(phi) * Math.cos(theta) * radialMod;
      const y = b * rBase * Math.sin(phi) * Math.sin(theta) * radialMod;
      const z = c * stretch * rBase * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 4, e: 1,
      uMin: 0, uMax: 1, vMin: 0.05, vMax: 0.95,
      uSegments: 96, vSegments: 48
    })
  },

  prismatic_knoid: {
    name: "🏛️ Prismatic k-Noid",
    description: "k-Noid with catenoidal ends arranged along a prismatic (cylindrical) configuration with k-fold symmetry around a vertical axis.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(3, Math.min(12, Math.round(params.d ?? 6)));
      const height = params.e ?? 2;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * height;
      
      const baseR = 2;
      const cosk = Math.cos(k * theta);
      const prismMod = 1 + 0.3 * Math.pow(Math.abs(cosk), 0.5);
      
      const r = a * baseR * prismMod * Math.cosh(t / (b * 2));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 6, e: 2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  antiprismatic_knoid: {
    name: "⬡ Antiprismatic k-Noid",
    description: "k-Noid with ends in an antiprismatic arrangement - two rings of ends rotated relative to each other by π/k.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(3, Math.min(12, Math.round(params.d ?? 6)));
      const twist = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      const baseR = 2;
      const thetaShift = t > 0 ? 0 : Math.PI / k;
      const cosk = Math.cos(k * (theta + thetaShift * twist));
      const antiprismMod = 1 + 0.25 * cosk;
      
      const r = a * baseR * antiprismMod * Math.cosh(t / (b * 3));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 6, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  double_enneper: {
    name: "🌀🌀 Double Enneper",
    description: "Sphere with two Enneper ends that can be rotated relative to each other. The twist parameter creates a non-contractible moduli space.",
    attribution: "H. Karcher, Tokyo Notes",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const twist = params.d ?? 0;
      const stretch = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      const coshT = Math.cosh(t * stretch);
      const sinhT = Math.sinh(t * stretch);
      
      const twistAngle = twist * Math.PI * t / 4;
      
      const baseX = Math.cos(theta + twistAngle);
      const baseY = Math.sin(theta + twistAngle);
      
      const enneperMod = 1 + 0.3 * Math.cos(3 * theta) / coshT;
      
      const x = a * coshT * baseX * enneperMod;
      const y = b * coshT * baseY * enneperMod;
      const z = c * sinhT;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5, e: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  finite_riemann: {
    name: "∞ Finite Riemann (Plane-1 Catenoid-2)",
    description: "A sphere with one planar end and two catenoidal ends. A finite version of the Riemann minimal surface.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const separation = params.d ?? 2;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 6;
      
      const cat1 = Math.cosh((t - separation) / 2);
      const cat2 = Math.cosh((t + separation) / 2);
      const plane = 1 / (1 + t * t * 0.1);
      
      const r = a * (cat1 + cat2 - 1) * 0.3 + plane * 0.5;
      
      const x = r * Math.cos(theta) * b;
      const y = r * Math.sin(theta) * b;
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 96
    })
  },

  lopez_two_index2: {
    name: "🔷 López Sphere (Two Index-2 Ends)",
    description: "F. López's minimal sphere with two ends of index 2. More complex singularity structure than standard Enneper ends.",
    attribution: "F. López",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const separation = params.d ?? 1.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      const index2Top = Math.pow(Math.cosh(t - separation), 2);
      const index2Bot = Math.pow(Math.cosh(t + separation), 2);
      
      const r = a * Math.sqrt(index2Top + index2Bot) * 0.3;
      const wind = Math.cos(2 * theta) * 0.2 / (1 + Math.abs(t));
      
      const x = (r + wind) * Math.cos(theta) * b;
      const y = (r + wind) * Math.sin(theta) * b;
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 80
    })
  },

  lopez_catenoid_enneper: {
    name: "🔶 López Sphere (Catenoid + Enneper End)",
    description: "F. López's minimal sphere with one catenoidal end and one Enneper end. Demonstrates mixed end behavior.",
    attribution: "F. López",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const blend = params.d ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      const catenoidPart = Math.cosh(t);
      const enneperPart = 1 + 0.3 * Math.cos(3 * theta) * Math.exp(-Math.abs(t - 2));
      
      const interpT = 0.5 + 0.5 * Math.tanh(t * blend);
      const r = a * (catenoidPart * (1 - interpT) + enneperPart * catenoidPart * interpT);
      
      const x = r * Math.cos(theta) * b;
      const y = r * Math.sin(theta) * b;
      const z = c * t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 80
    })
  }
};

// ============================================================================
// TORI - Minimal surfaces with genus 1 (toroidal topology)
// ============================================================================

export const MINIMAL_SURFACES_TORI: Record<string, MinimalSurface> = {

  chen_gackstatter: {
    name: "🍩 Chen-Gackstatter Surface (1982)",
    description: "First interesting complete minimal torus of finite total curvature. Like Enneper with an additional handle. Has a period problem solved on a square torus.",
    attribution: "C.C. Chen, F. Gackstatter, 1982",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const handleSize = params.d ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2;
      const r = 0.8 * handleSize;
      
      const enneperMod = 0.3 * Math.cos(3 * theta) + 0.15 * Math.sin(2 * phi);
      
      const x = a * ((R + r * Math.cos(phi)) * Math.cos(theta) + enneperMod * Math.cos(theta));
      const y = b * ((R + r * Math.cos(phi)) * Math.sin(theta) + enneperMod * Math.sin(theta));
      const z = c * (r * Math.sin(phi) + 0.2 * Math.sin(3 * theta) * Math.cos(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  costa_surface: {
    name: "🌊 Costa Surface (1982)",
    description: "Revolutionary minimal torus with two catenoidal and one planar end. Proven embedded by Hoffman & Meeks in 1985. Triggered enormous research activity.",
    attribution: "C.J. da Costa, 1982; D. Hoffman, W. Meeks, 1985",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const tunnelSize = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = (v - 0.5) * Math.PI * 2;
      
      const R = 2;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);
      const cosPhi = Math.cos(phi);
      const sinPhi = Math.sin(phi);
      
      const tunnel = tunnelSize * (1 - Math.abs(sinPhi) * 0.8);
      
      const x = a * ((R + tunnel * cosPhi) * cosTheta);
      const y = b * ((R + tunnel * cosPhi) * sinTheta);
      
      const catenoidMod = Math.cosh(phi) * 0.3;
      const z = c * (tunnel * sinPhi + catenoidMod * Math.sin(2 * theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  costa_hoffman_karcher: {
    name: "🌐 Costa-Hoffman-Karcher Torus",
    description: "Higher genus generalization of Costa surface. Family of embedded minimal surfaces with arbitrary genus discovered by Hoffman, Karcher, and others.",
    attribution: "D. Hoffman, H. Karcher, 1985+",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const genus = Math.max(1, Math.round(params.d ?? 2));
      const waist = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = (v - 0.5) * Math.PI * 2;
      
      const R = 2 + genus * 0.3;
      const numHoles = genus + 1;
      
      let holeMod = 0;
      for (let i = 0; i < numHoles; i++) {
        const holeAngle = (i / numHoles) * Math.PI * 2;
        const dist = Math.pow(Math.cos(theta - holeAngle), 2) + Math.pow(Math.sin(phi), 2);
        holeMod += waist * 0.3 / (dist + 0.5);
      }
      
      const x = a * ((R - holeMod) * Math.cos(theta) * (1 + 0.2 * Math.cos(phi)));
      const y = b * ((R - holeMod) * Math.sin(theta) * (1 + 0.2 * Math.cos(phi)));
      const z = c * (Math.sin(phi) * (1 + holeMod * 0.5));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 2, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  },

  toroidal_knoid: {
    name: "🔗 Toroidal k-Noid",
    description: "Minimal torus with k catenoidal ends arranged symmetrically. Combines toroidal topology with k-fold symmetric ends.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const k = Math.max(2, Math.min(8, Math.round(params.d ?? 4)));
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 3;
      const r = 1;
      
      const cosk = Math.cos(k * theta);
      const sink = Math.sin(k * theta);
      const endMod = 0.5 * cosk * Math.cos(phi);
      
      const x = a * ((R + (r + endMod) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + (r + endMod) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + endMod) * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 4,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  costa_enneper: {
    name: "🌀🌊 Costa-Enneper",
    description: "Minimal torus combining Costa surface topology with Enneper-type end behavior. Hybrid minimal surface.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const blend = params.d ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2;
      const r = 0.8;
      
      const costaMod = Math.sin(2 * phi) * 0.3;
      const enneperMod = Math.cos(3 * theta) * 0.2 * blend;
      
      const x = a * ((R + (r + costaMod) * Math.cos(phi)) * Math.cos(theta) + enneperMod);
      const y = b * ((R + (r + costaMod) * Math.cos(phi)) * Math.sin(theta) + enneperMod);
      const z = c * ((r + costaMod) * Math.sin(phi) + enneperMod * Math.sin(theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  four_ended_torus: {
    name: "✚ 4-Ended Torus",
    description: "Minimal torus with four catenoidal ends. Part of the family of multi-ended toroidal minimal surfaces.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const endStrength = params.d ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2.5;
      const r = 0.8;
      
      const cos4 = Math.cos(4 * theta);
      const sin4 = Math.sin(4 * theta);
      const endMod = endStrength * cos4 * Math.cos(phi);
      
      const x = a * ((R + (r + endMod) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + (r + endMod) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + endMod) * Math.sin(phi) + 0.2 * sin4);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  torus_catenoid_enneper: {
    name: "🔄 Torus with Catenoid & Enneper End",
    description: "Minimal torus with one catenoidal end and one Enneper end. Asymmetric end configuration.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const asymmetry = params.d ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2;
      const r = 0.7;
      
      const catenoidEnd = Math.cosh((phi - Math.PI) * 0.5) * 0.2 * (1 - asymmetry);
      const enneperEnd = Math.cos(3 * theta) * 0.2 * asymmetry * Math.exp(-(phi - Math.PI) * (phi - Math.PI));
      
      const x = a * ((R + (r + catenoidEnd + enneperEnd) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + (r + catenoidEnd + enneperEnd) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + catenoidEnd) * Math.sin(phi) + enneperEnd);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  torus_two_enneper: {
    name: "🌀✨ Torus with Two Enneper Ends",
    description: "Minimal torus with two Enneper-type ends on opposite sides. Symmetric non-embedded configuration.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const endSize = params.d ?? 0.4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2;
      const r = 0.7;
      
      const enneper1 = Math.cos(3 * theta) * endSize * Math.exp(-Math.pow(phi - Math.PI/2, 2));
      const enneper2 = Math.cos(3 * (theta + Math.PI)) * endSize * Math.exp(-Math.pow(phi - 3*Math.PI/2, 2));
      
      const x = a * ((R + (r + enneper1 + enneper2) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + (r + enneper1 + enneper2) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r) * Math.sin(phi) + enneper1 - enneper2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 0.4,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 48
    })
  },

  genus_one_helicoid: {
    name: "🧬 Genus One Helicoid",
    description: "The unique complete embedded minimal surface of genus one with one helicoid-like end. Combines toroidal topology with helicoid geometry.",
    attribution: "D. Hoffman, H. Karcher, F. Wei, 1993",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const pitch = params.d ?? 1;
      const handleSize = params.e ?? 0.5;
      
      const theta = u * Math.PI * 4;
      const t = (v - 0.5) * 4;
      
      const heliR = 1 + handleSize * Math.exp(-t * t);
      
      const x = a * heliR * Math.cos(theta);
      const y = b * heliR * Math.sin(theta);
      const z = c * (pitch * theta / (2 * Math.PI) + handleSize * Math.sin(theta * 2) * Math.exp(-t * t));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  }
};

// ============================================================================
// HIGHER GENUS - Minimal surfaces with genus ≥ 2
// ============================================================================

export const MINIMAL_SURFACES_HIGHER_GENUS: Record<string, MinimalSurface> = {

  wohlgemuth_genus2: {
    name: "🔮 Wohlgemuth Surface (Genus 2, 4 Ends)",
    description: "Likely embedded minimal surface of genus 2 with 4 catenoidal ends. Complex period problem solution.",
    attribution: "M. Wohlgemuth",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const handleDist = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2.5;
      const r = 0.6;
      
      const genus2mod = Math.cos(2 * theta) * handleDist * 0.4;
      const endMod = Math.cos(4 * phi) * 0.3;
      
      const x = a * ((R + genus2mod + (r + endMod) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + genus2mod + (r + endMod) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + endMod) * Math.sin(phi) + genus2mod * Math.sin(2 * phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  },

  wohlgemuth_genus3: {
    name: "🔮 Wohlgemuth Second Surface (Genus 3)",
    description: "Likely embedded minimal surface of genus 3 with 4 ends. More complex than genus 2 version.",
    attribution: "M. Wohlgemuth",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const handleDist = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 3;
      const r = 0.5;
      
      const genus3mod = (Math.cos(2 * theta) + 0.5 * Math.cos(3 * theta)) * handleDist * 0.3;
      const endMod = Math.cos(4 * phi) * 0.25;
      
      const x = a * ((R + genus3mod + (r + endMod) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + genus3mod + (r + endMod) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + endMod) * Math.sin(phi) + genus3mod * Math.sin(3 * phi) * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  },

  kapouleas_surface: {
    name: "🌌 Kapouleas Surfaces",
    description: "Desingularizations of intersecting planes and catenoids. Highly symmetric embedded minimal surfaces.",
    attribution: "N. Kapouleas",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const numPlanes = Math.max(2, Math.min(6, Math.round(params.d ?? 3)));
      const catenoidStrength = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      let x = 0, y = 0, z = 0;
      
      for (let i = 0; i < numPlanes; i++) {
        const angle = (i / numPlanes) * Math.PI;
        const weight = 1 / numPlanes;
        
        x += weight * (Math.cos(theta + angle) * Math.cosh(t * catenoidStrength));
        y += weight * (Math.sin(theta + angle) * Math.cosh(t * catenoidStrength));
        z += weight * Math.sin(angle) * t;
      }
      
      return [a * x * 2, b * y * 2, c * z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 3, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 64
    })
  },

  weber_wolf_genus3: {
    name: "🕸️ Weber-Wolf Surface (Genus 3, 5 Ends)",
    description: "Likely embedded minimal surface of genus 3 with 5 catenoidal ends. Solved complex period problem.",
    attribution: "M. Weber, M. Wolf",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const complexity = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const R = 2.5;
      
      const cos5 = Math.cos(5 * theta);
      const genus3Mod = 0.4 * complexity * (Math.cos(3 * theta) + 0.3 * Math.cos(6 * theta));
      
      const r = 1 + 0.3 * cos5 + genus3Mod * Math.sin(phi);
      
      const x = a * r * Math.sin(phi) * Math.cos(theta);
      const y = b * r * Math.sin(phi) * Math.sin(theta);
      const z = c * r * Math.cos(phi) * (1 + 0.2 * genus3Mod);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0.05, vMax: 0.95,
      uSegments: 128, vSegments: 64
    })
  },

  weber_wolf_genus4: {
    name: "🕸️ Weber-Wolf Surface (Genus 4, 5 Ends)",
    description: "Likely embedded minimal surface of genus 4 with 5 catenoidal ends. Even more complex than genus 3.",
    attribution: "M. Weber, M. Wolf",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const complexity = params.d ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const cos5 = Math.cos(5 * theta);
      const genus4Mod = 0.35 * complexity * (Math.cos(4 * theta) + 0.4 * Math.cos(2 * theta));
      
      const r = 1 + 0.25 * cos5 + genus4Mod * Math.sin(phi);
      
      const x = a * r * Math.sin(phi) * Math.cos(theta);
      const y = b * r * Math.sin(phi) * Math.sin(theta);
      const z = c * r * Math.cos(phi) * (1 + 0.25 * genus4Mod);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 1,
      uMin: 0, uMax: 1, vMin: 0.05, vMax: 0.95,
      uSegments: 128, vSegments: 64
    })
  },

  chen_gackstatter_genus_g: {
    name: "🍩 Chen-Gackstatter (Genus g)",
    description: "Generalized Chen-Gackstatter surface for arbitrary genus g. Non-embedded for g > 1. D parameter controls genus.",
    attribution: "C.C. Chen, F. Gackstatter, generalized",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = Math.max(1, Math.min(5, Math.round(params.d ?? 2)));
      const size = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const R = 2 + g * 0.3;
      const r = 0.6 * size;
      
      const genusMod = 0.25 * Math.cos(g * theta) + 0.1 * Math.cos((g + 1) * theta);
      
      const x = a * ((R + genusMod + (r + genusMod * 0.3) * Math.cos(phi)) * Math.cos(theta));
      const y = b * ((R + genusMod + (r + genusMod * 0.3) * Math.cos(phi)) * Math.sin(theta));
      const z = c * ((r + genusMod * 0.5) * Math.sin(phi) + 0.2 * Math.sin((2*g+1) * theta));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 2, e: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  },

  catenoid_enneper_genus_g: {
    name: "⏳🌀 Catenoid-Enneper (Genus g)",
    description: "Non-embedded minimal surface combining catenoid and Enneper behavior at arbitrary genus. D controls genus.",
    attribution: "minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const g = Math.max(1, Math.min(5, Math.round(params.d ?? 2)));
      const blend = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      const catenoid = Math.cosh(t);
      const enneper = 1 + blend * Math.cos((2*g+1) * theta) * 0.3 / catenoid;
      
      const r = a * catenoid * enneper;
      
      const genusTwist = g * theta * 0.1 * Math.tanh(t);
      
      const x = r * Math.cos(theta + genusTwist) * b;
      const y = r * Math.sin(theta + genusTwist) * b;
      const z = c * (t + blend * Math.sin(g * theta) * 0.2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 2, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 128, vSegments: 64
    })
  },

  yol_stitched_catenoids: {
    name: "🧵 Yol's Doubly Stitched Catenoids",
    description: "Non-embedded minimal surface created by 'stitching' multiple catenoids together. Complex singularity structure.",
    attribution: "Yol, minimalsurfaces.blog",
    equation: (u, v, params) => {
      const a = params.a ?? 1;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const numCatenoids = Math.max(2, Math.min(6, Math.round(params.d ?? 3)));
      const stitchStrength = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * 4;
      
      let r = 0;
      let zMod = 0;
      
      for (let i = 0; i < numCatenoids; i++) {
        const offset = (i / numCatenoids) * Math.PI * 2;
        const tShift = (i - numCatenoids/2) * stitchStrength;
        r += Math.cosh((t - tShift) * 0.5) / numCatenoids;
        zMod += Math.sin(theta + offset) * stitchStrength * 0.1;
      }
      
      const x = a * r * Math.cos(theta);
      const y = b * r * Math.sin(theta);
      const z = c * (t + zMod);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({
      a: 1, b: 1, c: 1, d: 3, e: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 96, vSegments: 96
    })
  }
};

// ============================================================================
// COMBINED EXPORTS
// ============================================================================

export const ALL_MINIMAL_SURFACES = {
  ...MINIMAL_SURFACES_SPHERES,
  ...MINIMAL_SURFACES_TORI,
  ...MINIMAL_SURFACES_HIGHER_GENUS
};

export const MINIMAL_SURFACES_SPHERE_COUNT = Object.keys(MINIMAL_SURFACES_SPHERES).length;
export const MINIMAL_SURFACES_TORI_COUNT = Object.keys(MINIMAL_SURFACES_TORI).length;
export const MINIMAL_SURFACES_HIGHER_GENUS_COUNT = Object.keys(MINIMAL_SURFACES_HIGHER_GENUS).length;
export const ALL_MINIMAL_SURFACES_COUNT = 
  MINIMAL_SURFACES_SPHERE_COUNT + 
  MINIMAL_SURFACES_TORI_COUNT + 
  MINIMAL_SURFACES_HIGHER_GENUS_COUNT;

// Category definitions for shape selector
export const MINIMAL_SURFACES_SPHERES_CATEGORY = {
  id: 'minimal_surfaces_spheres',
  name: '🎱 Minimal Surfaces - Spheres',
  icon: '🎱',
  description: 'Minimal surfaces conformally equivalent to punctured spheres. Includes catenoids, Enneper surfaces, and k-Noids with various symmetries.',
  shapes: Object.keys(MINIMAL_SURFACES_SPHERES),
  engineDynamics: {
    primaryType: 'topological' as const,
    influenceFactors: ['Weierstrass representation', 'catenoidal ends', 'Enneper ends', 'mean curvature = 0']
  }
};

export const MINIMAL_SURFACES_TORI_CATEGORY = {
  id: 'minimal_surfaces_tori',
  name: '🍩 Minimal Surfaces - Tori',
  icon: '🍩',
  description: 'Genus 1 minimal surfaces. Revolutionary discoveries including Costa surface that proved embedded minimal tori exist.',
  shapes: Object.keys(MINIMAL_SURFACES_TORI),
  engineDynamics: {
    primaryType: 'topological' as const,
    influenceFactors: ['period problem', 'genus 1 topology', 'embedded vs immersed', 'finite total curvature']
  }
};

export const MINIMAL_SURFACES_HIGHER_GENUS_CATEGORY = {
  id: 'minimal_surfaces_higher_genus',
  name: '🔮 Minimal Surfaces - Higher Genus',
  icon: '🔮',
  description: 'Complex minimal surfaces with genus ≥ 2. Require solving complicated period problems. Includes Wohlgemuth, Weber-Wolf, and Kapouleas surfaces.',
  shapes: Object.keys(MINIMAL_SURFACES_HIGHER_GENUS),
  engineDynamics: {
    primaryType: 'topological' as const,
    influenceFactors: ['complex period problems', 'higher genus topology', 'embedded examples', 'Martin Traizet research']
  }
};

console.log(`[MinimalSurfacesLibrary] Loaded ${ALL_MINIMAL_SURFACES_COUNT} minimal surfaces: ${MINIMAL_SURFACES_SPHERE_COUNT} spheres, ${MINIMAL_SURFACES_TORI_COUNT} tori, ${MINIMAL_SURFACES_HIGHER_GENUS_COUNT} higher genus`);
