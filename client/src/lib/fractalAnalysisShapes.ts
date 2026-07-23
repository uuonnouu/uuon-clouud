import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

/**
 * FRACTAL ANALYSIS & TEM/SEM IMAGING SHAPES
 * 35 Fractal Dimension & Imaging Visualizations
 * 
 * Author: UUON Foundation Inc.
 * These shapes were previously placeholders - now fully implemented
 */

export const FRACTAL_ANALYSIS_SHAPES: Record<string, {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}> = {

  box_counting_dimension: {
    name: "📦 Box Counting Dimension",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const dimension = params.e ?? 1.5;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const boxSize = 0.1;
      const boxX = Math.floor(x / boxSize) * boxSize;
      const boxZ = Math.floor(z / boxSize) * boxSize;
      
      const fractalHeight = Math.pow(Math.abs(boxX * boxZ + 0.1), 1 / dimension);
      const noise = Math.sin(x * 10) * Math.cos(z * 10) * 0.1;
      
      const y = scale * 0.3 * (fractalHeight + noise);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  minkowski_bouligand_dimension: {
    name: "📐 Minkowski-Bouligand Dimension",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const dim = params.e ?? 1.8;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const epsilon = 0.05;
      const r = Math.sqrt(x * x + z * z);
      
      const sausage = Math.pow(r + epsilon, 2 - dim);
      const y = scale * 0.3 * sausage * Math.exp(-r * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  nested_squares_method_nsm: {
    name: "⬜ Nested Squares Method",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const levels = Math.floor(params.e ?? 4);
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      let height = 0;
      for (let l = 1; l <= levels; l++) {
        const boxSize = 1 / Math.pow(2, l);
        const inBox = (Math.abs(x % (boxSize * 2)) < boxSize) && (Math.abs(z % (boxSize * 2)) < boxSize);
        height += inBox ? boxSize : 0;
      }
      
      const y = scale * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 128 })
  },

  perimeter_grid_method_pgm: {
    name: "🔲 Perimeter Grid Method",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const gridRes = Math.floor(params.e ?? 8);
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const gridX = Math.floor((u + 0.5) * gridRes) / gridRes;
      const gridZ = Math.floor((v + 0.5) * gridRes) / gridRes;
      
      const perimeter = Math.sin(gridX * Math.PI * 4) * Math.cos(gridZ * Math.PI * 4);
      const y = scale * 0.3 * perimeter;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  cumulative_intersection_method: {
    name: "➕ Cumulative Intersection",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const circles = Math.floor(params.e ?? 5);
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      let intersections = 0;
      for (let c = 1; c <= circles; c++) {
        const r = c / circles;
        const dist = Math.sqrt(x * x + z * z);
        if (Math.abs(dist - r * 2) < 0.1) {
          intersections += 1 / c;
        }
      }
      
      const y = scale * 0.3 * intersections;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  concentric_circles_fractal: {
    name: "⭕ Concentric Circles Fractal",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const rings = Math.floor(params.e ?? 8);
      
      const theta = u * 2 * Math.PI;
      const r = v * 2;
      
      let fractalMod = 0;
      for (let n = 1; n <= rings; n++) {
        fractalMod += Math.sin(n * Math.PI * r) / n;
      }
      
      const x = scale * r * Math.cos(theta);
      const y = scale * 0.3 * fractalMod;
      const z = scale * r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 48 })
  },

  mass_fractal_dimension_df: {
    name: "⚖️ Mass Fractal Df",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = params.e ?? 1.8;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const r = Math.pow(Math.sin(phi) + 0.1, 1 / df);
      
      const x = scale * r * Math.sin(phi) * Math.cos(theta);
      const y = scale * r * Math.sin(phi) * Math.sin(theta);
      const z = scale * r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  radius_of_gyration_rg: {
    name: "🔄 Radius of Gyration Rg",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const Rg = params.e ?? 1;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const massDistribution = Math.exp(-Math.pow(Math.sin(phi), 2) / (2 * Rg * Rg));
      
      const r = scale * (0.5 + 0.5 * massDistribution);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  fractal_prefactor_k0: {
    name: "🔢 Fractal Prefactor k₀",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const k0 = params.e ?? 1.3;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const prefactorMod = k0 * (1 + 0.2 * Math.sin(4 * theta) * Math.sin(3 * phi));
      
      const r = scale * (0.5 + 0.3 * prefactorMod);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  primary_particle_radius_a: {
    name: "⚫ Primary Particle Radius",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const particleRadius = params.e ?? 0.1;
      const nParticles = Math.floor(params.f ?? 20);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let surface = 1;
      for (let i = 0; i < nParticles; i++) {
        const pTheta = (i / nParticles) * 2 * Math.PI;
        const pPhi = Math.PI / 2 + 0.3 * Math.sin(i);
        const dist = Math.acos(Math.sin(phi) * Math.sin(pPhi) * Math.cos(theta - pTheta) + Math.cos(phi) * Math.cos(pPhi));
        surface += particleRadius * Math.exp(-dist * dist / (particleRadius * particleRadius));
      }
      
      const r = scale * surface * 0.5;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.2, f: 12, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  lacunarity_gap_analysis: {
    name: "🕳️ Lacunarity Gap Analysis",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const lacunarity = params.e ?? 1.5;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const gaps = Math.sin(x * lacunarity * 3) * Math.sin(z * lacunarity * 3);
      const gapVariance = Math.pow(gaps, 2) * lacunarity;
      
      const y = scale * 0.3 * gapVariance;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  lacunarity_spectrum_surface: {
    name: "🌈 Lacunarity Spectrum",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const scaleRange = params.e ?? 3;
      
      const boxScale = Math.pow(2, u * scaleRange);
      const position = v * 2 * Math.PI;
      
      const lacunarityAtScale = 1 + 0.5 * Math.exp(-boxScale / 2) * (1 + Math.sin(position));
      
      const x = scale * boxScale / Math.pow(2, scaleRange);
      const y = scale * lacunarityAtScale * 0.5;
      const z = scale * (v - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 })
  },

  dlca_aggregation_mechanism: {
    name: "🔗 DLCA Aggregation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = 1.78;
      
      const theta = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const branchR = Math.pow(1 + theta / (4 * Math.PI), 1 / df);
      const randomWalk = 0.2 * (Math.sin(theta * 5) + Math.sin(phi * 3));
      
      const r = scale * (0.3 * branchR + randomWalk * 0.5);
      
      const x = r * Math.cos(theta) * (1 + 0.3 * Math.sin(phi));
      const y = r * Math.sin(theta) * (1 + 0.3 * Math.cos(phi));
      const z = scale * 0.5 * Math.sin(phi) * branchR;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.78, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  rlca_aggregation_mechanism: {
    name: "🧲 RLCA Aggregation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = 2.1;
      
      const theta = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const denseCore = Math.pow(1 + theta / (4 * Math.PI), 1 / df);
      const compact = 0.1 * Math.sin(theta * 8) * Math.cos(phi * 4);
      
      const r = scale * (0.4 * denseCore + compact);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = scale * 0.3 * Math.sin(phi) * denseCore;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  pca_aggregation_mechanism: {
    name: "📍 PCA Aggregation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = 3.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const solidCore = Math.pow(Math.sin(phi) + 0.5, 1 / df);
      
      const r = scale * solidCore;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 3.0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  diffusion_limited_cluster: {
    name: "🌿 Diffusion Limited Cluster",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const branches = Math.floor(params.e ?? 5);
      
      const theta = u * 2 * Math.PI;
      const r = v * 2;
      
      let branchMod = 0;
      for (let b = 1; b <= branches; b++) {
        branchMod += Math.pow(Math.cos(b * theta), 2) / b;
      }
      
      const dla = r * (1 + 0.5 * branchMod);
      
      const x = scale * dla * Math.cos(theta);
      const y = scale * 0.2 * r * (1 + branchMod);
      const z = scale * dla * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  reaction_limited_cluster: {
    name: "⚗️ Reaction Limited Cluster",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const compactness = 1 + 0.1 * Math.sin(6 * theta) * Math.cos(4 * phi);
      
      const r = scale * compactness * Math.sin(phi);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = scale * compactness * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  particle_cluster_aggregation: {
    name: "🔘 Particle-Cluster Aggregation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const nClusters = Math.floor(params.e ?? 4);
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      let clusterMod = 1;
      for (let c = 0; c < nClusters; c++) {
        const cTheta = (c / nClusters) * 2 * Math.PI;
        clusterMod += 0.2 * Math.exp(-Math.pow(theta - cTheta, 2) * 2);
      }
      
      const r = scale * clusterMod * Math.sin(phi) * 0.8;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = scale * clusterMod * Math.cos(phi) * 0.8;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  mass_radius_relation_complete: {
    name: "📊 Mass-Radius Relation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = params.e ?? 1.8;
      
      const r = u * 2;
      const angle = v * 2 * Math.PI;
      
      const mass = Math.pow(r + 0.1, df);
      
      const x = scale * r * Math.cos(angle);
      const y = scale * mass * 0.3;
      const z = scale * r * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 72 })
  },

  structural_coefficient_kg: {
    name: "🏗️ Structural Coefficient kg",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const kg = params.e ?? 1.2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const structural = 1 + (kg - 1) * Math.pow(Math.sin(phi), 2);
      
      const r = scale * structural * 0.8;
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 1.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  fractal_aggregate_structure: {
    name: "🧱 Fractal Aggregate",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const Df = params.e ?? 1.8;
      const Np = Math.floor(params.f ?? 50);
      
      const theta = u * 4 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const rg = Math.pow(Np, 1 / Df);
      const aggregate = rg * (1 + 0.3 * Math.sin(theta * 3) * Math.cos(phi * 2));
      
      const x = scale * aggregate * 0.2 * Math.cos(theta);
      const y = scale * aggregate * 0.2 * Math.sin(theta) * Math.cos(phi);
      const z = scale * aggregate * 0.2 * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.8, f: 50, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  tem_image_fractal_dimension: {
    name: "🔬 TEM Fractal Dimension",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const resolution = params.e ?? 10;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      let intensity = 0;
      for (let f = 1; f <= 4; f++) {
        intensity += Math.sin(f * x * resolution / 4) * Math.cos(f * z * resolution / 4) / f;
      }
      
      const y = scale * 0.3 * intensity;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 128 })
  },

  sem_image_fractal_dimension: {
    name: "🔭 SEM Fractal Dimension",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const magnification = params.e ?? 5;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      let surface = 0;
      for (let f = 1; f <= 5; f++) {
        const freq = f * magnification / 5;
        surface += Math.sin(freq * x) * Math.sin(freq * z) / Math.pow(f, 0.5);
      }
      
      const y = scale * 0.4 * surface;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 128 })
  },

  gray_scale_intensity_fractal: {
    name: "🎨 Grayscale Intensity Fractal",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const levels = Math.floor(params.e ?? 8);
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      let intensity = 0;
      for (let l = 0; l < levels; l++) {
        const phase = l * Math.PI / levels;
        intensity += Math.sin(x * (l + 1) + phase) * Math.cos(z * (l + 1) + phase) / (l + 1);
      }
      
      const normalizedIntensity = (intensity + 1) / 2;
      const y = scale * 0.3 * normalizedIntensity;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  intensity_variation_function: {
    name: "📈 Intensity Variation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const variance = params.e ?? 0.5;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const baseIntensity = Math.sin(x * 2) * Math.cos(z * 2);
      const variation = variance * Math.sin(x * 5) * Math.sin(z * 5);
      
      const y = scale * 0.3 * (baseIntensity + variation);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  scale_invariant_aggregate: {
    name: "♾️ Scale-Invariant Aggregate",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = params.e ?? 1.8;
      
      const theta = u * 4 * Math.PI;
      const level = v;
      
      const scaleFactor = Math.pow(3, level * 3);
      const r = scale * Math.pow(level + 0.1, 1 / df);
      
      const x = r * Math.cos(theta) * (1 + 0.3 * Math.sin(theta * scaleFactor / 10));
      const y = scale * level * 2;
      const z = r * Math.sin(theta) * (1 + 0.3 * Math.cos(theta * scaleFactor / 10));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 })
  },

  heterogeneous_gap_distribution: {
    name: "🔳 Heterogeneous Gaps",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const gapVariability = params.e ?? 2;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const gap1 = Math.sin(x * gapVariability) * Math.sin(z * gapVariability);
      const gap2 = Math.sin(x * gapVariability * 2.5) * Math.sin(z * gapVariability * 1.5);
      const gaps = gap1 + 0.5 * gap2;
      
      const y = scale * 0.3 * gaps;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  homogeneous_gap_distribution: {
    name: "⬜ Homogeneous Gaps",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const gapSize = params.e ?? 0.2;
      
      const x = (u - 0.5) * 4 * scale;
      const z = (v - 0.5) * 4 * scale;
      
      const uniformGaps = Math.sin(x / gapSize * Math.PI) * Math.sin(z / gapSize * Math.PI);
      
      const y = scale * 0.3 * uniformGaps;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 96 })
  },

  center_of_mass_calculation: {
    name: "⚖️ Center of Mass",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const massDistribution = 1 + 0.5 * Math.sin(3 * theta) * Math.sin(2 * phi);
      const centroid = Math.sin(phi) * massDistribution;
      
      const r = scale * (0.5 + 0.3 * centroid);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 })
  },

  spatial_position_vector: {
    name: "📍 Spatial Position Vector",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      
      const t = u;
      const phi = v * 2 * Math.PI;
      
      const posX = t * Math.cos(2 * Math.PI * t * 3);
      const posY = t;
      const posZ = t * Math.sin(2 * Math.PI * t * 3);
      
      const tubeR = 0.1;
      
      const x = scale * (posX + tubeR * Math.cos(phi));
      const y = scale * posY;
      const z = scale * (posZ + tubeR * Math.sin(phi));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 24 })
  },

  box_size_epsilon_scaling: {
    name: "📏 Box Size ε Scaling",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const epsilonRange = params.e ?? 3;
      
      const epsilon = Math.pow(2, -u * epsilonRange);
      const count = v;
      
      const logEpsilon = -u * epsilonRange;
      const logN = count * epsilonRange * 1.8;
      
      const x = scale * logEpsilon;
      const y = scale * logN * 0.3;
      const z = scale * (count - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 })
  },

  linear_regression_slope_df: {
    name: "📉 Linear Regression Df",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const df = params.e ?? 1.8;
      
      const logEpsilon = (u - 0.5) * 4;
      const logN = df * logEpsilon;
      
      const scatter = 0.2 * Math.sin(u * 20) * (v - 0.5);
      
      const x = scale * logEpsilon;
      const y = scale * (logN + scatter) * 0.4;
      const z = scale * (v - 0.5) * 2;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.8, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 })
  },

  log_log_plot_fractal: {
    name: "📊 Log-Log Fractal Plot",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const dimension = params.e ?? 1.5;
      
      const logX = (u - 0.5) * 4;
      const logY = dimension * logX;
      
      const dataPoint = Math.abs(Math.sin(u * 30)) < 0.5 ? 0.1 : 0;
      
      const x = scale * logX;
      const y = scale * (logY + dataPoint) * 0.4;
      const z = scale * (v - 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 })
  },

  aggregate_boundary_intersection: {
    name: "🔲 Aggregate Boundary",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const roughness = params.e ?? 0.3;
      
      const theta = u * 2 * Math.PI;
      const z = (v - 0.5) * 2 * scale;
      
      let boundary = 1;
      for (let n = 1; n <= 5; n++) {
        boundary += roughness * Math.sin(n * theta) / n;
      }
      
      const r = scale * boundary * 0.6;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 24 })
  }

};

export default FRACTAL_ANALYSIS_SHAPES;
