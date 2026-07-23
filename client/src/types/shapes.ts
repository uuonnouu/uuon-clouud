/**
 * SHARED SHAPE TYPES
 * Isolated types to prevent circular dependencies
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from './math';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
  engineDynamics?: string;
  chaosCategory?: string;
}

/**
 * CHAOS-ORDERED PARAMETER DEFAULTS
 * Parameters A-Z ordered from least chaotic to most chaotic:
 * A-C: Global transforms (foundation)
 * D-E: Foundational curves (lowest chaos)
 * F-G: Surfaces of revolution (low chaos)
 * H-I: Extrusions & sweeps (low-medium)
 * J-K: Lofts & interpolations (medium)
 * L-M: Superquadrics (medium-high)
 * N-O: Minimal surfaces (topological)
 * P-Q: Waveforms & harmonics (wave)
 * R-S: Special structures (topological)
 * T-U: Φ-based forms (golden ratio)
 * V-W: Fractals & noise (high chaos)
 * X-Y: Spatial offsets (coordinate)
 * Z: Chaos throttle (maximum)
 */
export function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  const { a, b, c, x, y, z, ...safeOverrides } = overrides;
  return {
    // Foundational curves (D-E) - lowest chaos
    d: 0, e: 0,
    // Surfaces of revolution (F-G) - low chaos
    f: 0, g: 0,
    // Extrusions & sweeps (H-I) - low-medium chaos
    h: 0, i: 0,
    // Lofts & interpolations (J-K) - medium chaos
    j: 0, k: 0,
    // Superquadrics (L-M) - medium-high chaos
    l: 0, m: 0,
    // Minimal surfaces (N-O) - topological
    n: 0, o: 0,
    // Waveforms & harmonics (P-Q) - wave dynamics
    p: 0, q: 0,
    // Special structures (R-S) - topological twist
    r: 0, s: 0,
    // Φ-based forms (T-U) - golden ratio
    t: 0, u: 0,
    // Fractals & noise (V-W) - high chaos
    v: 0, w: 0,
    // UV domain defaults - Range -100 to 100 for lighter meshing
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...safeOverrides,
    // FOUNDATIONAL PARAMETERS - Always enforced as 1.00000 (cannot be overridden)
    a: 1, b: 1, c: 1,
    x: 1, y: 1, z: 1,
  };
}

/**
 * Get category-specific defaults for chaos-ordered parameters
 */
export function getCategoryDefaults(category: string, overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  const base = getCleanDefaults();
  
  const categoryDefaults: Record<string, Partial<SurfaceParameters>> = {
    'foundational_curves': { d: 1, e: 0.5 },
    'surfaces_of_revolution': { f: 1, g: 0.5 },
    'extrusions_sweeps': { h: 1, i: 0.5 },
    'lofts_interpolations': { j: 0.5, k: 0.5 },
    'superquadrics': { l: 2, m: 0.5 },
    'minimal_surfaces': { n: 0.5, o: 0.5 },
    'waveforms_harmonics': { p: 2, q: 0.5 },
    'special_structures': { r: 1, s: 0.5 },
    'phi_dimension_forms': { t: 1.618, u: 0.5 },
    'fractals_noise': { v: 3, w: 0.5 },
    'chaos_maximum': { z: 1 }
  };
  
  return {
    ...base,
    ...(categoryDefaults[category] || {}),
    ...overrides
  };
}
