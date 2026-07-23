import { SurfaceParameters } from '../types/math';

/**
 * ATTRACTOR SYSTEMS LIBRARY
 * 
 * Strange attractors and force-field based deformations that create
 * complex, chaotic patterns through simple deterministic rules.
 * 
 * Attractors are mathematical systems that tend toward specific patterns
 * in phase space, creating beautiful fractal-like structures.
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
    d: 1, e: 1, f: 1, g: 1,
    h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const ATTRACTOR_SYSTEMS: Record<string, ParametricSurface> = {
  
  // ============================================================================
  // LORENZ ATTRACTOR - The Famous Butterfly
  // Discovered by Edward Lorenz (1963) studying atmospheric convection
  // dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz
  // Standard parameters: σ=10, ρ=28, β=8/3
  // ============================================================================
  lorenz_attractor_tube: {
    name: "🦋 Lorenz Attractor Tube - Chaotic Butterfly",
    equation: (u, v, params) => {
      const sigma = params.d ?? 10;
      const rho = params.e ?? 28;
      const beta = params.f ?? 2.667;
      const scale = params.g ?? 0.07;
      const tubeSize = params.h ?? 0.25;
      
      const totalSteps = 500;
      const dt = 0.02;
      
      let x = 0.1;
      let y = 0.0;
      let z = 0.0;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = sigma * (y - x);
        const dy = x * (rho - z) - y;
        const dz = x * y - beta * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const zCentered = z - (rho - 1);
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        zCentered * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 10, e: 28, f: 2.667, g: 0.07, h: 0.25,
      uSegments: 64, vSegments: 8 
    })
  },

  // ============================================================================
  // RÖSSLER ATTRACTOR - Spiral Chaos
  // Simpler than Lorenz but still chaotic
  // dx/dt = -y-z, dy/dt = x+ay, dz/dt = b+z(x-c)
  // Standard parameters: a=0.2, b=0.2, c=5.7
  // ============================================================================
  rossler_attractor_tube: {
    name: "🌀 Rössler Attractor Tube - Spiral Chaos",
    equation: (u, v, params) => {
      const a = params.d ?? 0.2;
      const b = params.e ?? 0.2;
      const c = params.f ?? 5.7;
      const scale = params.g ?? 0.15;
      const tubeSize = params.h ?? 0.2;
      
      const totalSteps = 400;
      const dt = 0.04;
      
      let x = 1.0;
      let y = 1.0;
      let z = 0.0;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = -y - z;
        const dy = x + a * y;
        const dz = b + z * (x - c);
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 0.2, e: 0.2, f: 5.7, g: 0.15, h: 0.2,
      uSegments: 200, vSegments: 8 
    })
  },

  // MAGNETIC FIELD LINES: Dipole field visualization
  magnetic_field_lines: {
    name: "🧲 Magnetic Field - Dipole Lines",
    equation: (u, v, params) => {
      const a = params.d ?? 2.0;     // Field extent
      const b = params.e ?? 1.0;     // Pole strength
      const c = params.f ?? 1.0;     // Field line density
      const d = params.g ?? 0.5;     // Pole separation
      const e = params.h ?? 0;       // Field rotation
      const g = params.g ?? 0.2;     // Turbulence (field irregularity)
      const h = params.h ?? 3;       // Field line count
      
      const lineCount = Math.max(1, Math.min(12, Math.floor(h)));
      const lineIndex = Math.floor(u * lineCount);
      const t = v;
      
      // Field line starting angle
      const startAngle = (lineIndex / lineCount) * Math.PI * 2;
      const startRadius = 0.1 + c * 0.1;
      
      // Trace field line from north to south pole
      let x = startRadius * Math.cos(startAngle);
      let y = startRadius * Math.sin(startAngle);
      let z = d;
      
      // Simulate field line path
      for (let step = 0; step < 50; step++) {
        const progress = step / 50;
        if (progress > t) break;
        
        // Distance from poles
        const distNorth = Math.sqrt(x * x + y * y + (z - d) ** 2);
        const distSouth = Math.sqrt(x * x + y * y + (z + d) ** 2);
        
        // Field direction (simplified dipole)
        const fx = -x * b / (distNorth ** 2 + 0.1) + x * b / (distSouth ** 2 + 0.1);
        const fy = -y * b / (distNorth ** 2 + 0.1) + y * b / (distSouth ** 2 + 0.1);
        const fz = -(z - d) * b / (distNorth ** 2 + 0.1) - (z + d) * b / (distSouth ** 2 + 0.1);
        
        // Move along field
        x += fx * 0.1 * a / 50;
        y += fy * 0.1 * a / 50;
        z += fz * 0.1 * a / 50;
        
        // Add turbulence
        if (g > 0) {
          x += g * Math.sin(step * 0.5 + startAngle) * 0.02;
          y += g * Math.cos(step * 0.5 + startAngle) * 0.02;
        }
      }
      
      // Apply rotation
      const cosR = Math.cos(e);
      const sinR = Math.sin(e);
      const rx = x * cosR - y * sinR;
      const ry = x * sinR + y * cosR;
      
      return [rx, ry, z];
    },
    defaultParams: getCleanDefaults({ d: 2.0, e: 1.0, f: 1.0, g: 0.5, h: 8, uSegments: 96, vSegments: 64 })
  },

  // GRAVITY WELL: Spacetime curvature deformation
  gravity_well_deformation: {
    name: "⚫ Gravity Well - Spacetime Curvature",
    equation: (u, v, params) => {
      const a = params.d ?? 3.0;     // Grid size
      const b = params.e ?? 1.5;     // Well depth
      const c = params.f ?? 0.8;     // Well radius
      const d = params.g ?? 1.0;     // Secondary mass
      const e = params.h ?? 2.0;     // Secondary position
      const g = params.g ?? 0.1;     // Turbulence (quantum fluctuations)
      const h = params.h ?? 2;       // Number of masses
      
      const massCount = Math.max(1, Math.min(4, Math.floor(h)));
      
      const x = (u - 0.5) * a;
      const y = (v - 0.5) * a;
      
      let z = 0;
      
      // Primary mass at center
      const dist1 = Math.sqrt(x * x + y * y);
      if (dist1 > 0.01) {
        z -= b / (1 + dist1 / c);
      } else {
        z -= b;
      }
      
      // Secondary masses
      if (massCount > 1) {
        for (let i = 1; i < massCount; i++) {
          const angle = (i / (massCount - 1)) * Math.PI * 2;
          const mx = e * Math.cos(angle);
          const my = e * Math.sin(angle);
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
          
          if (dist > 0.01) {
            z -= (b * d) / (1 + dist / (c * 0.5));
          }
        }
      }
      
      // Quantum fluctuations
      if (g > 0) {
        z += g * Math.sin(x * 20) * Math.cos(y * 15) * 0.1;
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3.0, e: 1.5, f: 0.8, g: 1.0, h: 2.0, uSegments: 128, vSegments: 128 })
  },

  // ============================================================================
  // CHEN ATTRACTOR - Double-Scroll Chaos
  // Discovered by Guanrong Chen (1999)
  // dx/dt = a(y-x), dy/dt = (c-a)x - xz + cy, dz/dt = xy - bz
  // Standard parameters: a=35, b=3, c=28
  // ============================================================================
  chen_attractor: {
    name: "🌌 Chen Attractor - Double-Scroll Chaos",
    equation: (u, v, params) => {
      const a = params.d ?? 35;
      const b = params.e ?? 3;
      const c = params.f ?? 28;
      const scale = params.g ?? 0.04;
      const tubeSize = params.h ?? 0.3;
      
      const totalSteps = 10000;
      const dt = 0.002;
      
      let x = -0.1;
      let y = 0.5;
      let z = -0.6;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = a * (y - x);
        const dy = (c - a) * x - x * z + c * y;
        const dz = x * y - b * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        (z - 25) * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 35, e: 3, f: 28, g: 0.04, h: 0.3,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // HALVORSEN ATTRACTOR - Symmetric Chaos
  // dx/dt = -ax - 4y - 4z - y², dy/dt = -ay - 4z - 4x - z²
  // dz/dt = -az - 4x - 4y - x²
  // Standard: a = 1.89
  // ============================================================================
  halvorsen_attractor: {
    name: "🔄 Halvorsen Attractor - Symmetric Chaos",
    equation: (u, v, params) => {
      const a = params.d ?? 1.89;
      const scale = params.g ?? 0.15;
      const tubeSize = params.h ?? 0.15;
      
      const totalSteps = 8000;
      const dt = 0.005;
      
      let x = -1.48;
      let y = -1.51;
      let z = 2.04;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = -a * x - 4 * y - 4 * z - y * y;
        const dy = -a * y - 4 * z - 4 * x - z * z;
        const dz = -a * z - 4 * x - 4 * y - x * x;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 1.89, g: 0.15, h: 0.15,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // THOMAS ATTRACTOR - Slow Manifold Chaos
  // dx/dt = sin(y) - bx, dy/dt = sin(z) - by, dz/dt = sin(x) - bz
  // Standard: b = 0.208186 (exhibits slow-fast dynamics)
  // ============================================================================
  thomas_attractor: {
    name: "🌀 Thomas Attractor - Slow Manifold",
    equation: (u, v, params) => {
      const b = params.d ?? 0.208186;
      const scale = params.g ?? 0.4;
      const tubeSize = params.h ?? 0.08;
      
      const totalSteps = 20000;
      const dt = 0.05;
      
      let x = 1.1;
      let y = 1.1;
      let z = -0.01;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = Math.sin(y) - b * x;
        const dy = Math.sin(z) - b * y;
        const dz = Math.sin(x) - b * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 0.208186, g: 0.4, h: 0.08,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // AIZAWA ATTRACTOR - Toroidal Chaos
  // Complex 6-parameter system with beautiful toroidal structure
  // ============================================================================
  aizawa_attractor: {
    name: "🍩 Aizawa Attractor - Toroidal Chaos",
    equation: (u, v, params) => {
      const a = params.d ?? 0.95;
      const b = params.e ?? 0.7;
      const c = params.f ?? 0.6;
      const d = params.g ?? 3.5;
      const e = params.h ?? 0.25;
      const f = params.i ?? 0.1;
      const scale = 0.5;
      const tubeSize = 0.05;
      
      const totalSteps = 15000;
      const dt = 0.01;
      
      let x = 0.1;
      let y = 0.0;
      let z = 0.0;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = (z - b) * x - d * y;
        const dy = d * x + (z - b) * y;
        const dz = c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * x * x * x;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 0.95, e: 0.7, f: 0.6, g: 3.5, h: 0.25, i: 0.1,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // DADRAS ATTRACTOR - Multi-Wing Chaos
  // Creates beautiful multi-wing butterfly patterns
  // ============================================================================
  dadras_attractor: {
    name: "🦋 Dadras Attractor - Multi-Wing Butterfly",
    equation: (u, v, params) => {
      const a = params.d ?? 3;
      const b = params.e ?? 2.7;
      const c = params.f ?? 1.7;
      const d = params.g ?? 2;
      const e = params.h ?? 9;
      const scale = 0.08;
      const tubeSize = 0.15;
      
      const totalSteps = 12000;
      const dt = 0.005;
      
      let x = 0.1;
      let y = 0.03;
      let z = 0.0;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = y - a * x + b * y * z;
        const dy = c * y - x * z + z;
        const dz = d * x * y - e * z;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 3, e: 2.7, f: 1.7, g: 2, h: 9,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // SPROTT ATTRACTOR - Minimal Chaos
  // Simplest possible chaotic system (Sprott B)
  // dx/dt = yz, dy/dt = x - y, dz/dt = 1 - xy
  // ============================================================================
  sprott_attractor: {
    name: "⚡ Sprott Attractor - Minimal Chaos",
    equation: (u, v, params) => {
      const scale = params.g ?? 0.3;
      const tubeSize = params.h ?? 0.05;
      
      const totalSteps = 15000;
      const dt = 0.01;
      
      let x = 0.63;
      let y = 0.47;
      let z = -0.54;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = y * z;
        const dy = x - y;
        const dz = 1 - x * y;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      g: 0.3, h: 0.05,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // THREE-SCROLL UNIFIED CHAOTIC SYSTEM (TSUCS)
  // Creates three intertwined scrolls
  // ============================================================================
  three_scroll_attractor: {
    name: "📜 Three-Scroll Unified Chaotic System",
    equation: (u, v, params) => {
      const a = params.d ?? 40;
      const b = params.e ?? 0.833;
      const c = params.f ?? 20;
      const d = params.g ?? 0.5;
      const e = params.h ?? 0.65;
      const scale = 0.02;
      const tubeSize = 0.3;
      
      const totalSteps = 10000;
      const dt = 0.001;
      
      let x = 0.29;
      let y = -0.25;
      let z = -0.59;
      
      const targetStep = Math.floor(u * totalSteps);
      
      for (let i = 0; i < targetStep; i++) {
        const dx = a * (y - x) + d * x * z;
        const dy = c * y - x * z;
        const dz = b * z + x * y - e * x * x;
        
        x += dx * dt;
        y += dy * dt;
        z += dz * dt;
      }
      
      const tubeAngle = v * 2 * Math.PI;
      
      return [
        (x + tubeSize * Math.cos(tubeAngle)) * scale,
        (y + tubeSize * Math.sin(tubeAngle)) * scale,
        z * scale
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 40, e: 0.833, f: 20, g: 0.5, h: 0.65,
      uSegments: 200, vSegments: 8 
    })
  },

  // ============================================================================
  // LYAPUNOV EXPONENT VISUALIZATION
  // Shows chaos sensitivity (positive = chaos, negative = stable)
  // ============================================================================
  lyapunov_exponent_surface: {
    name: "📊 Lyapunov Exponent - Chaos Measure",
    equation: (u, v, params) => {
      const a = params.d ?? 3.5;  // r_min
      const b = params.e ?? 4.0;  // r_max
      const iterations = Math.floor(params.f ?? 100);
      const scale = params.g ?? 2;
      
      const r = a + u * (b - a);
      const x0 = v;
      
      let x = x0;
      let lyapunov = 0;
      
      // Compute Lyapunov exponent for logistic map
      for (let i = 0; i < iterations; i++) {
        const derivative = Math.abs(r - 2 * r * x);
        if (derivative > 0) {
          lyapunov += Math.log(derivative);
        }
        x = r * x * (1 - x);
        if (x < 0 || x > 1) break;
      }
      
      lyapunov /= iterations;
      
      return [
        (u - 0.5) * scale,
        (v - 0.5) * scale,
        Math.max(-2, Math.min(2, lyapunov)) * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 3.5, e: 4.0, f: 100, g: 2,
      uSegments: 128, vSegments: 128 
    })
  },

  // ============================================================================
  // BIFURCATION DIAGRAM - Period Doubling to Chaos
  // Visualizes route to chaos through period-doubling
  // ============================================================================
  bifurcation_diagram: {
    name: "🌳 Bifurcation Diagram - Route to Chaos",
    equation: (u, v, params) => {
      const rMin = params.d ?? 2.5;
      const rMax = params.e ?? 4.0;
      const warmup = Math.floor(params.f ?? 100);
      const samples = Math.floor(params.g ?? 50);
      const scale = params.h ?? 2;
      
      const r = rMin + u * (rMax - rMin);
      let x = 0.5;
      
      // Warm up
      for (let i = 0; i < warmup; i++) {
        x = r * x * (1 - x);
      }
      
      // Sample attractor
      const sampleIndex = Math.floor(v * samples);
      for (let i = 0; i < sampleIndex; i++) {
        x = r * x * (1 - x);
      }
      
      return [
        (u - 0.5) * scale,
        x * scale - scale / 2,
        (r - 3) * 0.3
      ];
    },
    defaultParams: getCleanDefaults({ 
      d: 2.5, e: 4.0, f: 100, g: 50, h: 2,
      uSegments: 128, vSegments: 64 
    })
  },

  // STRANGE ATTRACTOR: Generic chaotic surface
  strange_attractor_surface: {
    name: "🎭 Strange Attractor - Chaotic Surface",
    equation: (u, v, params) => {
      const a = params.d ?? 1.5;     // Scale
      const b = params.e ?? 2.5;     // System parameter 1
      const c = params.f ?? 1.8;     // System parameter 2
      const d = params.g ?? 0.9;     // System parameter 3
      const e = params.h ?? 0;       // Phase offset
      const g = params.g ?? 0.3;     // Turbulence
      const h = params.h ?? 30;      // Iterations
      
      const steps = Math.max(10, Math.min(100, Math.floor(h)));
      
      // Initialize state
      let x = u - 0.5;
      let y = v - 0.5;
      let z = 0;
      
      // Iterate strange attractor map
      for (let i = 0; i < steps; i++) {
        const xnew = Math.sin(b * y + e) + c * Math.sin(b * x + e);
        const ynew = Math.sin(c * x + e) + d * Math.sin(c * y + e);
        const znew = Math.sin(x * y + e);
        
        x = xnew;
        y = ynew;
        z += znew / steps;
        
        // Add chaotic perturbation
        if (g > 0) {
          x += g * Math.sin(i * 0.3) * 0.05;
          y += g * Math.cos(i * 0.4) * 0.05;
        }
      }
      
      return [x * a, y * a, z * a];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 2.5, f: 1.8, g: 0.9, h: 30, uSegments: 96, vSegments: 96 })
  }
};
