import { SurfaceParameters } from '../types/math';

/**
 * DIFFERENTIAL GROWTH LIBRARY
 * 
 * Cellular expansion and reaction-diffusion algorithms that simulate
 * biological growth patterns, membrane formation, and organic structures.
 * 
 * These algorithms model how cells push against each other, creating
 * natural folding patterns seen in brains, corals, and living tissues.
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// Clean defaults helper
function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 48, vSegments: 36,
    ...overrides
  };
}

export const DIFFERENTIAL_GROWTH: Record<string, ParametricSurface> = {
  
  // CORAL GROWTH: Branching organic structure with differential expansion
  coral_growth: {
    name: "🪸 Coral Growth - Differential Expansion",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;     // Overall scale
      const b = params.b ?? 0.8;     // Branch thickness
      const c = params.c ?? 1.2;     // Vertical growth
      const d = params.d ?? 3.0;     // Branch density
      const e = params.e ?? 0;       // Growth time
      const g = params.g ?? 0.5;     // Turbulence/irregularity
      const h = params.h ?? 4;       // Growth iterations
      
      const iterations = Math.max(1, Math.min(6, Math.floor(h)));
      
      // Spiral growth pattern
      const theta = u * Math.PI * 2 * Math.max(0.1, d);
      const radius = v * Math.max(0.1, a);
      
      // Differential growth - cells push outward
      let x = 0, y = 0, z = 0;
      let currentRadius = 0;
      
      for (let i = 0; i < iterations; i++) {
        const layerAngle = theta + i * 0.5 + e;
        const growthRate = 1.0 + Math.sin(theta * 2 + i) * 0.3;
        
        currentRadius += (radius / iterations) * Math.max(0.1, growthRate);
        
        // Prevent runaway growth
        if (currentRadius > radius * 2) {
          currentRadius = radius * 2;
        }
        
        // Branching displacement
        const branchOffset = Math.sin(theta * Math.max(0.1, d) + i * 2) * b * (i / iterations);
        
        x = currentRadius * Math.cos(layerAngle) + branchOffset * Math.cos(layerAngle + Math.PI / 2);
        y = currentRadius * Math.sin(layerAngle) + branchOffset * Math.sin(layerAngle + Math.PI / 2);
        z += (radius / iterations) * c;
        
        // Add organic irregularity with bounds
        if (g > 0) {
          x += Math.max(-0.5, Math.min(0.5, g * Math.sin(theta * 5 + i * 3 + e) * 0.1));
          y += Math.max(-0.5, Math.min(0.5, g * Math.cos(theta * 5 + i * 3 + e) * 0.1));
          z += Math.max(-0.2, Math.min(0.2, g * Math.sin(layerAngle * 3) * 0.05));
        }
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 0.8, c: 1.2, d: 3.0, g: 0.5, h: 4, uSegments: 48, vSegments: 32 })
  },

  // BRAIN CORTEX: Folding pattern mimicking cerebral cortex
  brain_cortex_folding: {
    name: "🧠 Brain Cortex - Gyri and Sulci Folding",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Brain size
      const b = params.b ?? 0.5;     // Fold depth
      const c = params.c ?? 1.0;     // Fold complexity
      const d = params.d ?? 6.0;     // Fold frequency
      const e = params.e ?? 0;       // Development stage
      const g = params.g ?? 0.7;     // Turbulence (irregularity)
      const h = params.h ?? 5;       // Recursion depth
      
      const depth = Math.max(1, Math.min(7, Math.floor(h)));
      
      // Start with sphere
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      let radius = a;
      
      // Add gyri (ridges) and sulci (grooves)
      for (let i = 0; i < depth; i++) {
        const freq = d * Math.pow(2, i / 2);
        const amp = b / (i + 1);
        
        // Create folding pattern
        const fold = Math.sin(theta * freq + e) * Math.cos(phi * freq * 0.7 + e);
        radius += fold * amp * c;
        
        // Add irregularity
        if (g > 0) {
          const irregular = Math.sin(theta * freq * 1.3 + i) * Math.cos(phi * freq * 1.7 + i);
          radius += irregular * amp * g * 0.3;
        }
      }
      
      // Convert to Cartesian
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 0.5, c: 1.0, d: 6.0, g: 0.7, h: 5, uSegments: 48, vSegments: 48 })
  },

  // LICHEN EXPANSION: Radial growth with irregular edges
  lichen_expansion: {
    name: "🍃 Lichen Expansion - Radial Colony Growth",
    equation: (u, v, params) => {
      const a = params.a ?? 2.0;     // Colony size
      const b = params.b ?? 0.2;     // Thickness variation
      const c = params.c ?? 1.0;     // Edge complexity
      const d = params.d ?? 8.0;     // Lobe count
      const e = params.e ?? 0;       // Growth time
      const g = params.g ?? 0.6;     // Turbulence (edge irregularity)
      const h = params.h ?? 4;       // Detail levels
      
      const levels = Math.max(1, Math.min(6, Math.floor(h)));
      
      const angle = u * Math.PI * 2;
      const radiusBase = v * a;
      
      // Add lobed structure
      let radius = radiusBase;
      for (let i = 0; i < levels; i++) {
        const freq = d * (i + 1);
        const amp = (c / (i + 1)) * 0.3;
        radius += Math.sin(angle * freq + e + i) * amp;
      }
      
      // Edge irregularity (growth variability)
      if (g > 0) {
        const edgeTurb = Math.sin(angle * 12 + e) * Math.cos(angle * 7 + e * 1.3);
        radius += edgeTurb * g * 0.4 * radiusBase;
      }
      
      // Convert to position
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      // Height variation (thickness)
      const height = b * Math.sin(angle * 3) * Math.cos(radiusBase * 5) * (1 - v);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.0, b: 0.2, c: 1.0, d: 8.0, g: 0.6, h: 4, uSegments: 48, vSegments: 48 })
  },

  // CELLULAR MEMBRANE: Lipid bilayer with protein channels
  cellular_membrane: {
    name: "🔬 Cellular Membrane - Lipid Bilayer",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;     // Membrane area
      const b = params.b ?? 0.15;    // Membrane thickness
      const c = params.c ?? 0.5;     // Fluidity (undulation)
      const d = params.d ?? 5.0;     // Wave frequency
      const e = params.e ?? 0;       // Time/motion
      const g = params.g ?? 0.3;     // Turbulence (thermal motion)
      const h = params.h ?? 3;       // Detail octaves
      
      const octaves = Math.max(1, Math.min(5, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Base membrane undulation
      let z = 0;
      let amplitude = c;
      let frequency = d;
      
      for (let i = 0; i < octaves; i++) {
        z += Math.sin(x * frequency + e) * Math.cos(y * frequency * 0.8 + e * 0.9) * amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }
      
      // Add thermal fluctuations
      if (g > 0) {
        const thermal = Math.sin(x * 20 + e * 2) * Math.cos(y * 15 + e * 1.5) * g * 0.1;
        z += thermal;
      }
      
      // Protein channel bumps (embedded proteins)
      const channelDensity = 3;
      for (let cx = -1; cx <= 1; cx++) {
        for (let cy = -1; cy <= 1; cy++) {
          const channelX = cx * (a / channelDensity);
          const channelY = cy * (a / channelDensity);
          const dist = Math.sqrt((x - channelX) ** 2 + (y - channelY) ** 2);
          if (dist < 0.3) {
            z += (0.3 - dist) * b * 2;
          }
        }
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 0.15, c: 0.5, d: 5.0, g: 0.3, h: 3, uSegments: 48, vSegments: 48 })
  },

  // REACTION-DIFFUSION: Turing pattern formation
  reaction_diffusion_pattern: {
    name: "🔀 Reaction-Diffusion - Turing Pattern",
    equation: (u, v, params) => {
      const a = params.a ?? 2.5;     // Pattern size
      const b = params.b ?? 0.4;     // Pattern height
      const c = params.c ?? 1.0;     // Complexity
      const d = params.d ?? 8.0;     // Spot frequency
      const e = params.e ?? 0;       // Evolution time
      const g = params.g ?? 0.5;     // Turbulence
      const h = params.h ?? 4;       // Pattern iterations
      
      const iterations = Math.max(1, Math.min(6, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      // Simulated reaction-diffusion (spots and stripes)
      let concentration = 0;
      
      for (let i = 0; i < iterations; i++) {
        const freq = d * (i + 1) * 0.7;
        const activator = Math.sin(x * freq + e) * Math.cos(y * freq + e);
        const inhibitor = Math.sin(x * freq * 0.6 + e * 0.8) * Math.cos(y * freq * 0.6 + e * 0.8);
        
        // Activator-inhibitor dynamics
        concentration += (activator - inhibitor * 0.5) * c / (i + 1);
      }
      
      // Add turbulence for organic appearance
      if (g > 0) {
        const turb = Math.sin(x * 15 + e) * Math.cos(y * 12 + e) * g * 0.3;
        concentration += turb;
      }
      
      // Convert to height
      const z = concentration * b;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 2.5, b: 0.4, c: 1.0, d: 8.0, g: 0.5, h: 4, uSegments: 48, vSegments: 48 })
  }
};
