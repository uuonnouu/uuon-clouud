/**
 * Space Biology Shapes - NASA OSDR Research Visualizations
 * 
 * Based on real space biology research:
 * - Microgravity effects on cellular structures
 * - Radiation damage to DNA
 * - Bone density loss and muscle atrophy
 * - Circadian rhythm disruption
 * - Immune system changes
 * - Plant gravitropism
 * - Fluid shift patterns
 */

import { SurfaceParameters } from '../types/math';

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function applyTransforms(
  x: number, y: number, z: number,
  u: number, v: number,
  params: SurfaceParameters
): [number, number, number] {
  const a = params.a ?? 1;
  const b = params.b ?? 1;
  const c = params.c ?? 1;
  
  const g = (params.g ?? 0) * 0.02;
  const h = (params.h ?? 0) * 0.02;
  const i = (params.i ?? 0) * 0.02;
  const j = (params.j ?? 0) * 0.05;
  const k = (params.k ?? 0) * 0.1;
  const l = (params.l ?? 0) * 0.05;
  const m = (params.m ?? 0) * 0.03;
  const n = (params.n ?? 0) * 0.03;
  const o = (params.o ?? 0) * 0.03;
  const p = (params.p ?? 0) * 0.02;
  const q = (params.q ?? 0) * 0.02;
  const r = (params.r ?? 0) * 0.02;
  const s = (params.s ?? 0) * 0.01;
  const t = (params.t ?? 0) * 0.01;
  const w = (params.w ?? 0) * 0.01;
  
  const twistAngle = g * z + h * x + i * y;
  const cosT = Math.cos(twistAngle);
  const sinT = Math.sin(twistAngle);
  let nx = x * cosT - y * sinT;
  let ny = x * sinT + y * cosT;
  let nz = z;
  
  nx += j * Math.sin(k * ny + l * nz);
  ny += j * Math.sin(k * nz + l * nx);
  nz += j * Math.sin(k * nx + l * ny);
  
  nx += m * Math.sin(u * 10 + v * 7);
  ny += n * Math.sin(v * 10 + u * 7);
  nz += o * Math.sin(u * 7 + v * 10);
  
  const dist = Math.sqrt(nx * nx + ny * ny);
  const pulse = 1 + p * Math.sin(dist * 5);
  nx *= pulse;
  ny *= pulse;
  
  const angle = Math.atan2(ny, nx);
  const angDist = q * Math.sin(angle * 4);
  nx += angDist * Math.cos(angle);
  ny += angDist * Math.sin(angle);
  
  const spiralAngle = r * dist;
  const cosSp = Math.cos(spiralAngle);
  const sinSp = Math.sin(spiralAngle);
  const spx = nx * cosSp - ny * sinSp;
  const spy = nx * sinSp + ny * cosSp;
  nx = spx;
  ny = spy;
  
  nx += s * ny + w * nz;
  ny += t * nz;
  
  const ox = params.x ?? 0;
  const oy = params.y ?? 0;
  const oz = params.z ?? 0;
  
  return [nx * a + ox, ny * b + oy, nz * c + oz];
}

export const SPACE_BIOLOGY_SHAPES: Record<string, ParametricSurface> = {
  microgravity_cell_structure: {
    name: "Microgravity Cell Structure",
    equation: (u, v, params) => {
      const d = params.d ?? 0.3;
      const e = params.e ?? 4;
      const f = params.f ?? 3;
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const r = (1 + d * Math.sin(e * theta)) * Math.exp(-0.1 * Math.abs(Math.sin(theta)));
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi) * (1 + 0.1 * Math.cos(f * phi));
      const z = r * Math.cos(theta);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 4, f: 3 }
  },

  radiation_dna_damage: {
    name: "Radiation DNA Damage Model",
    equation: (u, v, params) => {
      const d = params.d ?? 0.2;
      const e = params.e ?? 0.15;
      const f = params.f ?? 3;
      const theta = u * 4 * Math.PI;
      const damage = d * Math.sin(f * theta) * (v > 0.4 && v < 0.6 ? 1 : 0);
      const x = Math.cos(theta) + damage;
      const y = Math.sin(theta) * (1 + e * Math.cos(v * 6));
      const z = theta / (2 * Math.PI) + v * 0.2;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.2, e: 0.15, f: 3 }
  },

  bone_density_loss: {
    name: "Bone Density Loss Surface",
    equation: (u, v, params) => {
      const d = params.d ?? 0.3;
      const e = params.e ?? 0.2;
      const f = params.f ?? 4;
      const density = 1 - d * u;
      const noiseX = Math.sin(u * 20) * Math.cos(v * 15) * 0.1;
      const noiseY = Math.cos(u * 18) * Math.sin(v * 22) * e;
      const x = (u * 2 - 1) * (1 + noiseX);
      const y = (v * 2 - 1) * (1 + noiseY);
      const pore = Math.sin(u * f * Math.PI) * Math.sin(v * f * Math.PI);
      const z = 0.3 * density * pore;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 0.2, f: 4 }
  },

  muscle_atrophy_fiber: {
    name: "Muscle Atrophy Fiber",
    equation: (u, v, params) => {
      const d = params.d ?? 0.4;
      const e = params.e ?? 0.15;
      const f = params.f ?? 6;
      const theta = u * 2 * Math.PI;
      const atrophy = 1 - d * v;
      const r = atrophy * (1 + e * Math.sin(f * theta));
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = v * 2;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.4, e: 0.15, f: 6 }
  },

  circadian_rhythm_wave: {
    name: "Circadian Rhythm Disruption",
    equation: (u, v, params) => {
      const d = params.d ?? 0.1;
      const e = params.e ?? 0.3;
      const t = u * 48;
      const phase = v * Math.PI;
      const disruption = Math.exp(-d * Math.abs(phase));
      const x = t / 24;
      const y = Math.sin(2 * Math.PI * t / 24 + phase) * disruption;
      const z = (v - 0.5);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 0.1, e: 0.3 }
  },

  immune_cell_response: {
    name: "Immune Cell Response Surface",
    equation: (u, v, params) => {
      const d = params.d ?? 0.5;
      const e = params.e ?? 2;
      const t = u * 10;
      const N0 = 0.1;
      const growth = d;
      const K = e;
      const N = N0 * Math.exp(growth * t) / (1 + (Math.exp(growth * t) - 1) * N0 / K);
      const x = (u * 2 - 1);
      const y = (v * 2 - 1);
      const z = N * (1 + 0.2 * Math.sin(v * 4 * Math.PI));
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 2 }
  },

  vestibular_otolith: {
    name: "Vestibular Otolith Model",
    equation: (u, v, params) => {
      const d = params.d ?? 0.15;
      const e = params.e ?? 0.1;
      const f = params.f ?? 0.2;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const rx = (1 + d * Math.sin(5 * theta) * Math.sin(3 * phi));
      const ry = (1 + e * Math.cos(4 * theta));
      const rz = 0.7 * (1 + f * Math.sin(6 * phi));
      const x = rx * Math.sin(phi) * Math.cos(theta);
      const y = ry * Math.sin(phi) * Math.sin(theta);
      const z = rz * Math.cos(phi);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.15, e: 0.1, f: 0.2 }
  },

  plant_gravitropism: {
    name: "Plant Gravitropism Response",
    equation: (u, v, params) => {
      const d = params.d ?? 0.5;
      const e = params.e ?? 0.1;
      const t = u * 2 * Math.PI;
      const curvature = d * (1 - Math.exp(-2 * u));
      const angle = v * 2 * Math.PI;
      const x = Math.sin(t) + curvature * Math.cos(t);
      const y = 0.3 * Math.cos(angle) * (1 + e * u);
      const z = 2 * u * (1 - 0.3 * curvature);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.5, e: 0.1 }
  },

  fluid_shift_distribution: {
    name: "Cephalad Fluid Shift",
    equation: (u, v, params) => {
      const d = params.d ?? 0.3;
      const theta = u * 2 * Math.PI;
      const height = v * 2 - 1;
      const fluidShift = 1 + d * (0.5 - Math.abs(height)) * 2;
      const x = fluidShift * Math.cos(theta) * 0.4;
      const y = fluidShift * Math.sin(theta) * 0.3;
      const z = height;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 2, d: 0.3 }
  },

  cosmic_ray_track: {
    name: "Cosmic Ray Particle Track",
    equation: (u, v, params) => {
      const d = params.d ?? 0.1;
      const f = params.f ?? 8;
      const trackZ = u * 3;
      const spread = d * Math.sqrt(trackZ);
      const angle = v * 2 * Math.PI;
      const x = spread * Math.cos(angle + f * trackZ * 0.1);
      const y = spread * Math.sin(angle + f * trackZ * 0.1);
      const z = trackZ;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.1, f: 8 }
  },

  spaceflight_gene_expression: {
    name: "Gene Expression Heatmap Surface",
    equation: (u, v, params) => {
      const d = params.d ?? 1;
      const e = params.e ?? 2;
      const foldChange = Math.sin(u * d * 10) * Math.cos(v * e * 8) +
                        0.5 * Math.sin(u * 15 + v * 12);
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;
      const z = 0.5 * foldChange;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 1, e: 2 }
  },

  telomere_dynamics: {
    name: "Telomere Length Dynamics",
    equation: (u, v, params) => {
      const d = params.d ?? 0.3;
      const e = params.e ?? 0.4;
      const flight = u < 0.3 ? d * Math.sin(u * Math.PI / 0.3) : 0;
      const recovery = u > 0.7 ? -e * Math.sin((u - 0.7) * Math.PI / 0.3) : 0;
      const baseline = 0.5;
      const x = (u - 0.5) * 2;
      const y = baseline + flight + recovery + 0.05 * Math.sin(v * 10);
      const z = (v - 0.5) * 0.5;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3, e: 0.4 }
  },

  iss_orbit_radiation: {
    name: "ISS Orbital Radiation Field",
    equation: (u, v, params) => {
      const d = params.d ?? 0.3;
      const theta = u * 2 * Math.PI;
      const inclination = 51.6 * Math.PI / 180;
      const x = 2 * Math.cos(theta) * Math.cos(v * inclination);
      const y = 2 * Math.sin(theta);
      const saa = Math.exp(-((theta - 4.5) ** 2) / 0.5);
      const z = (v - 0.5 + d * saa);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.3 }
  },

  protein_crystallization: {
    name: "Microgravity Protein Crystal",
    equation: (u, v, params) => {
      const d = params.d ?? 0.1;
      const e = params.e ?? 0.1;
      const f = params.f ?? 0.15;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const facetX = 1 + d * Math.abs(Math.sin(3 * theta)) * Math.abs(Math.sin(2 * phi));
      const facetY = 1 + e * Math.abs(Math.cos(3 * theta)) * Math.abs(Math.sin(2 * phi));
      const facetZ = 1 + f * Math.abs(Math.cos(4 * phi));
      const x = facetX * Math.sin(phi) * Math.cos(theta);
      const y = facetY * Math.sin(phi) * Math.sin(theta);
      const z = facetZ * Math.cos(phi);
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.1, e: 0.1, f: 0.15 }
  },

  cardiac_remodeling: {
    name: "Cardiac Remodeling Surface",
    equation: (u, v, params) => {
      const d = params.d ?? 0.2;
      const e = params.e ?? 0.15;
      const theta = u * 2 * Math.PI;
      const height = v;
      const r = (1 - 0.3 * height) * (1 + d * Math.sin(2 * theta));
      const ry = 0.8 * (1 - 0.3 * height) * (1 + e * Math.cos(2 * theta));
      const x = r * Math.cos(theta);
      const y = ry * Math.sin(theta);
      const z = 1.5 * height;
      return applyTransforms(x, y, z, u, v, params);
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0.2, e: 0.15 }
  }
};

export const SPACE_BIOLOGY_CATEGORY = {
  id: 'space-biology',
  name: "🚀 Space Biology (NASA OSDR)",
  icon: '🚀',
  description: "Space biology and physiological adaptation shapes based on NASA OSDR research",
  shapes: Object.keys(SPACE_BIOLOGY_SHAPES)
};

export function getSpaceBiologyShape(name: string): ParametricSurface | undefined {
  return SPACE_BIOLOGY_SHAPES[name];
}
