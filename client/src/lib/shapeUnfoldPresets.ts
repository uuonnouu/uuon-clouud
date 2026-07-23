/**
 * Shape Unfold Presets
 * 
 * Optimized UV domain parameters for fully unfolding complex shapes
 * including helixes, vortexes, twisted surfaces, and Riemann surfaces.
 * 
 * These presets ensure shapes display their complete mathematical structure
 * rather than appearing partially rolled or compressed.
 */

import { SurfaceParameters } from '../types/math';

// Shape categories that require extended UV domains for full unfolding
export const UNFOLD_CATEGORIES = {
  // Helical structures - need extended vMax for full spiral reveal
  helix: {
    keywords: ['helix', 'dna', 'spiral', 'coil', 'coiled', 'screw'],
    preset: { vMin: 0, vMax: 4, uMin: 0, uMax: 2, vSegments: 96 }
  },
  
  // Riemann surfaces - multi-sheeted, need extended domain
  riemann: {
    keywords: ['riemann', 'branch', 'sheet', 'logarithm', 'sqrt', 'root'],
    preset: { vMin: 0, vMax: 2, uMin: -1, uMax: 2, uSegments: 64, vSegments: 64 }
  },
  
  // Vortex/Tornado shapes - need cylindrical unfolding
  vortex: {
    keywords: ['vortex', 'tornado', 'whirl', 'cyclone', 'funnel'],
    preset: { vMin: 0, vMax: 3, uMin: 0, uMax: 2, vSegments: 72 }
  },
  
  // Twisted surfaces - need extended twist reveal
  twisted: {
    keywords: ['twist', 'mobius', 'klein', 'trefoil', 'knot'],
    preset: { vMin: 0, vMax: 2, uMin: 0, uMax: 2, uSegments: 64, vSegments: 64 }
  },
  
  // Torus varieties - full wrap around
  torus: {
    keywords: ['torus', 'donut', 'ring', 'horn', 'spindle'],
    preset: { vMin: 0, vMax: 1, uMin: 0, uMax: 1, uSegments: 48, vSegments: 48 }
  },
  
  // Spherical harmonics - need full sphere coverage
  spherical: {
    keywords: ['spherical', 'harmonic', 'bloch', 'sphere'],
    preset: { vMin: 0, vMax: 1, uMin: 0, uMax: 1, uSegments: 64, vSegments: 64 }
  },
  
  // Wave surfaces - extended domain for multiple periods
  wave: {
    keywords: ['wave', 'ripple', 'oscillat', 'soliton', 'breather'],
    preset: { vMin: -2, vMax: 2, uMin: -2, uMax: 2, uSegments: 64, vSegments: 64 }
  },
  
  // Minimal surfaces - need balanced domains
  minimal: {
    keywords: ['enneper', 'catenoid', 'helicoid', 'costa', 'scherk', 'gyroid'],
    preset: { vMin: -1, vMax: 1, uMin: -1, uMax: 1, uSegments: 64, vSegments: 64 }
  },
  
  // Fractal surfaces - extended domain for self-similarity
  fractal: {
    keywords: ['mandel', 'julia', 'sierp', 'koch', 'menger', 'fractal'],
    preset: { vMin: -2, vMax: 2, uMin: -2, uMax: 2, uSegments: 128, vSegments: 128 }
  },
  
  // Hyperbolic surfaces - extended for full curvature display
  hyperbolic: {
    keywords: ['hyperbol', 'pseudosphere', 'tractrix', 'dini'],
    preset: { vMin: 0, vMax: 3, uMin: 0, uMax: 2, uSegments: 64, vSegments: 64 }
  },
  
  // Seashell/Nautilus - logarithmic spiral expansion
  shell: {
    keywords: ['shell', 'nautilus', 'conch', 'snail'],
    preset: { vMin: 0, vMax: 6, uMin: 0, uMax: 2, vSegments: 128 }
  },
  
  // Galaxy/Cosmic structures - extended spiral arms
  cosmic: {
    keywords: ['galaxy', 'cosmic', 'nebula', 'stellar', 'accretion'],
    preset: { vMin: 0, vMax: 4, uMin: 0, uMax: 2, vSegments: 96 }
  },
  
  // Protein folding - extended for full structure
  protein: {
    keywords: ['protein', 'alpha_helix', 'beta_sheet', 'collagen', 'fold'],
    preset: { vMin: 0, vMax: 3, uMin: 0, uMax: 2, vSegments: 72 }
  }
};

/**
 * Get optimized unfold parameters for a shape based on its ID/name
 */
export function getUnfoldPreset(shapeId: string): Partial<SurfaceParameters> | null {
  const shapeLower = shapeId.toLowerCase();
  
  for (const [category, config] of Object.entries(UNFOLD_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (shapeLower.includes(keyword)) {
        return config.preset;
      }
    }
  }
  
  return null;
}

/**
 * Apply unfold preset to existing parameters
 * Only overrides UV domain if shape matches an unfold category
 */
export function applyUnfoldPreset(
  shapeId: string, 
  currentParams: SurfaceParameters
): SurfaceParameters {
  const preset = getUnfoldPreset(shapeId);
  
  if (!preset) {
    return currentParams;
  }
  
  // Merge preset into current params, preserving other settings
  return {
    ...currentParams,
    ...preset
  };
}

/**
 * Check if a shape should use extended UV domain
 */
export function shouldUnfold(shapeId: string): boolean {
  return getUnfoldPreset(shapeId) !== null;
}

/**
 * Get the category name for a shape
 */
export function getShapeCategory(shapeId: string): string | null {
  const shapeLower = shapeId.toLowerCase();
  
  for (const [category, config] of Object.entries(UNFOLD_CATEGORIES)) {
    for (const keyword of config.keywords) {
      if (shapeLower.includes(keyword)) {
        return category;
      }
    }
  }
  
  return null;
}

/**
 * Algorithm documentation for neural engine
 */
export const UNFOLD_ALGORITHMS = {
  name: 'Shape Unfold Engine',
  description: 'Automatic UV domain optimization for complete shape visualization',
  algorithms: [
    {
      name: 'Keyword Pattern Matching',
      description: 'Identifies shape category from name/ID using keyword sets'
    },
    {
      name: 'UV Domain Extension',
      description: 'Expands uMin/uMax/vMin/vMax to reveal hidden structure'
    },
    {
      name: 'Segment Optimization',
      description: 'Increases mesh density for smooth unfolded surfaces'
    },
    {
      name: 'Category-Specific Presets',
      description: 'Applies mathematically-optimal settings per shape family'
    }
  ],
  categories: Object.keys(UNFOLD_CATEGORIES).length,
  totalKeywords: Object.values(UNFOLD_CATEGORIES).reduce((sum, cat) => sum + cat.keywords.length, 0)
};
