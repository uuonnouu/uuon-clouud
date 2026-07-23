/**
 * UV ENVIRONMENTAL PRESETS
 * Quick UV configurations for different observational contexts
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface UVPreset {
  name: string;
  description: string;
  icon: string;
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
  uSegments: number;
  vSegments: number;
  // Additional environmental parameters
  environmentalContext: {
    scale: 'cosmic' | 'planetary' | 'neural';
    tension: number; // Mesh tension (0-1)
    curvature: number; // Surface curvature emphasis
  };
}

/**
 * COSMIC ENVIRONMENT
 * Large-scale universal structures - galaxies, black holes, spacetime curvature
 * High UV range for expansive cosmic phenomena
 */
export const COSMIC_PRESET: UVPreset = {
  name: 'Cosmic',
  description: 'Universal scale - galaxies, black holes, spacetime',
  icon: '🌌',
  uMin: -12.566, // -4π for cosmic expansion
  uMax: 12.566,  // 4π
  vMin: -6.283,  // -2π
  vMax: 6.283,   // 2π
  uSegments: 128, // High detail for cosmic structures
  vSegments: 96,
  environmentalContext: {
    scale: 'cosmic',
    tension: 0.2,    // Low tension for flowing spacetime
    curvature: 1.8   // Emphasized curvature for gravitational effects
  }
};

/**
 * EARTH/PLANETARY ENVIRONMENT - TIME-AWARE
 * Planetary scale - weather systems, geological structures, oceans
 * ENHANCED: Responds to real-world time cycles (tides, seasons, day/night)
 */
export const EARTH_PRESET: UVPreset = {
  name: 'Earth',
  description: 'Planetary scale - TIME-AWARE: tides, seasons, day/night cycles',
  icon: '🌍',
  uMin: -6.283,  // -2π for global coverage
  uMax: 6.283,   // 2π (full spherical wrap)
  vMin: -3.14159, // -π
  vMax: 3.14159,  // π
  uSegments: 96,  // Moderate detail for planetary features
  vSegments: 64,
  environmentalContext: {
    scale: 'planetary',
    tension: 0.5,    // Moderate tension for geological features
    curvature: 1.2   // Natural planetary curvature
  }
};

/**
 * NEURAL/INTERNAL ENVIRONMENT
 * Microscopic/neural scale - brain structures, synapses, molecular interactions
 * Fine-grained UV control for detailed internal structures
 */
export const NEURAL_PRESET: UVPreset = {
  name: 'Neural',
  description: 'Brain/cellular scale - neurons, synapses, molecular structures',
  icon: '🧠',
  uMin: 0,       // Start at origin for precision
  uMax: 2.0,     // Limited range for fine detail
  vMin: 0,
  vMax: 1.5708,  // π/2 for quarter-sphere precision
  uSegments: 64,  // High local detail
  vSegments: 48,
  environmentalContext: {
    scale: 'neural',
    tension: 0.85,   // High tension for tight neural networks
    curvature: 0.6   // Subtle curvature for organic structures
  }
};

/**
 * All environmental presets
 */
export const UV_ENVIRONMENTAL_PRESETS: UVPreset[] = [
  COSMIC_PRESET,
  EARTH_PRESET,
  NEURAL_PRESET
];

/**
 * Apply UV preset to current parameters
 */
export function applyUVPreset(
  currentParams: SurfaceParameters,
  preset: UVPreset
): SurfaceParameters {
  return {
    ...currentParams,
    uMin: preset.uMin,
    uMax: preset.uMax,
    vMin: preset.vMin,
    vMax: preset.vMax,
    uSegments: preset.uSegments,
    vSegments: preset.vSegments,
    // Apply environmental scaling to A/B/C parameters
    a: (currentParams.a || 1) * getEnvironmentalScale(preset.environmentalContext.scale),
    b: (currentParams.b || 1) * getEnvironmentalScale(preset.environmentalContext.scale),
    c: (currentParams.c || 1) * getEnvironmentalScale(preset.environmentalContext.scale),
  };
}

/**
 * Get scale multiplier based on environmental context
 */
function getEnvironmentalScale(scale: 'cosmic' | 'planetary' | 'neural'): number {
  switch (scale) {
    case 'cosmic':
      return 2.5;  // 2.5x larger for cosmic structures
    case 'planetary':
      return 1.0;  // Standard scale
    case 'neural':
      return 0.4;  // 0.4x smaller for neural/cellular detail
    default:
      return 1.0;
  }
}

/**
 * Get preset by name
 */
export function getUVPresetByName(name: string): UVPreset | undefined {
  return UV_ENVIRONMENTAL_PRESETS.find(preset => 
    preset.name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Create custom UV preset based on environmental parameters
 */
export function createCustomUVPreset(
  scale: 'cosmic' | 'planetary' | 'neural',
  tension: number = 0.5,
  detailLevel: 'low' | 'medium' | 'high' = 'medium'
): Partial<SurfaceParameters> {
  const baseRange = scale === 'cosmic' ? 12.566 : 
                    scale === 'planetary' ? 6.283 : 2.0;
  
  const segments = detailLevel === 'low' ? 32 :
                   detailLevel === 'medium' ? 64 : 128;
  
  return {
    uMin: scale === 'neural' ? 0 : -baseRange,
    uMax: baseRange,
    vMin: scale === 'neural' ? 0 : -baseRange / 2,
    vMax: baseRange / 2,
    uSegments: segments,
    vSegments: Math.floor(segments * 0.75)
  };
}

/**
 * UV MESH TENSION CONTROL
 * Applies tension to mesh by modulating UV domain and segments
 */
export interface MeshTensionConfig {
  tension: number;  // 0 = relaxed, 1 = maximum tension
  preserveTopology: boolean;
  smoothingIterations: number;
}

export function applyMeshTension(
  params: SurfaceParameters,
  config: MeshTensionConfig
): SurfaceParameters {
  const { tension, preserveTopology } = config;
  
  // Tension modulates UV range - higher tension = tighter sampling
  const tensionFactor = 1 - (tension * 0.3); // Max 30% reduction
  
  const uRange = (params.uMax ?? 1) - (params.uMin ?? 0);
  const vRange = (params.vMax ?? 1) - (params.vMin ?? 0);
  
  if (preserveTopology) {
    // Increase segments instead of changing UV range
    return {
      ...params,
      uSegments: Math.floor((params.uSegments || 64) * (1 + tension * 0.5)),
      vSegments: Math.floor((params.vSegments || 48) * (1 + tension * 0.5))
    };
  } else {
    // Modulate UV range for tension effect
    const uCenter = ((params.uMin ?? 0) + (params.uMax ?? 1)) / 2;
    const vCenter = ((params.vMin ?? 0) + (params.vMax ?? 1)) / 2;
    
    return {
      ...params,
      uMin: uCenter - (uRange / 2) * tensionFactor,
      uMax: uCenter + (uRange / 2) * tensionFactor,
      vMin: vCenter - (vRange / 2) * tensionFactor,
      vMax: vCenter + (vRange / 2) * tensionFactor,
    };
  }
}
