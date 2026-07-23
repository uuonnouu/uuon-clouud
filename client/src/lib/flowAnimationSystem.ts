/**
 * UNIVERSAL FLOW ANIMATION SYSTEM
 * Provides wave propagation effects for tubular, helical, and linear structures
 * Inspired by the axon_with_myelin nerve signal propagation
 */

import { SurfaceType } from '../types/math';

export interface FlowAnimationConfig {
  enabled: boolean;
  speed: number;  // 0.1x to 10x multiplier
  waveFrequency: number;  // How many waves along the structure
  waveAmplitude: number;  // Wave intensity
  direction: 'forward' | 'reverse' | 'bidirectional';
}

/**
 * Shapes that support flow animation (propagation effects)
 * Categorized by type for better organization
 */
export const FLOW_CAPABLE_SHAPES: Record<string, {
  category: string;
  flowType: 'neural' | 'molecular' | 'wave' | 'astrophysical' | 'biological';
  defaultFrequency: number;
  defaultAmplitude: number;
}> = {
  // ===== NEURAL STRUCTURES =====
  'axon_with_myelin': {
    category: 'Nervous System',
    flowType: 'neural',
    defaultFrequency: 3,
    defaultAmplitude: 0.1
  },
  'peripheral_nerve': {
    category: 'Nervous System',
    flowType: 'neural',
    defaultFrequency: 2.5,
    defaultAmplitude: 0.08
  },
  'myelinated_nerve': {
    category: 'Nervous System',
    flowType: 'neural',
    defaultFrequency: 3,
    defaultAmplitude: 0.1
  },
  'unmyelinated_nerve': {
    category: 'Nervous System',
    flowType: 'neural',
    defaultFrequency: 2,
    defaultAmplitude: 0.06
  },
  
  // ===== CARDIOVASCULAR STRUCTURES =====
  'blood_pressure_wave': {
    category: 'Cardiovascular',
    flowType: 'biological',
    defaultFrequency: 1.5,
    defaultAmplitude: 0.15
  },
  
  // ===== DIGESTIVE STRUCTURES =====
  'esophagus_peristalsis': {
    category: 'Digestive',
    flowType: 'biological',
    defaultFrequency: 1.2,
    defaultAmplitude: 0.12
  },
  
  // ===== DNA & MOLECULAR STRUCTURES =====
  'protein_alpha_helix': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 4,
    defaultAmplitude: 0.05
  },
  'protein_beta_sheet': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 3,
    defaultAmplitude: 0.04
  },
  'chromatin_super_helix': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 2,
    defaultAmplitude: 0.06
  },
  'carbon_nanotube': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 5,
    defaultAmplitude: 0.03
  },
  'microtubules': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 3.5,
    defaultAmplitude: 0.05
  },
  'neural_pathways': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 2.5,
    defaultAmplitude: 0.08
  },
  'dna_double_helix': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 4,
    defaultAmplitude: 0.04
  },
  'dna_a_helix': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 3.5,
    defaultAmplitude: 0.04
  },
  'dna_z_helix': {
    category: 'DNA Structures',
    flowType: 'molecular',
    defaultFrequency: 4.5,
    defaultAmplitude: 0.05
  },
  
  // ===== WAVE STRUCTURES =====
  'em_plane_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 6,
    defaultAmplitude: 0.2
  },
  'acoustic_pressure_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 4,
    defaultAmplitude: 0.15
  },
  'seismic_p_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 2,
    defaultAmplitude: 0.18
  },
  'seismic_s_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 2.5,
    defaultAmplitude: 0.16
  },
  'ocean_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 1.5,
    defaultAmplitude: 0.25
  },
  'quantum_wave': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 8,
    defaultAmplitude: 0.1
  },
  'magnetic_field_helix': {
    category: 'Wave Phenomena',
    flowType: 'wave',
    defaultFrequency: 3,
    defaultAmplitude: 0.12
  },
  
  // ===== ASTROPHYSICAL STRUCTURES =====
  'relativistic_jet': {
    category: 'Astrophysical Phenomena',
    flowType: 'astrophysical',
    defaultFrequency: 2,
    defaultAmplitude: 0.2
  },
  'cosmic_string': {
    category: 'Astrophysical Phenomena',
    flowType: 'astrophysical',
    defaultFrequency: 1.5,
    defaultAmplitude: 0.15
  },
  'wormhole_throat': {
    category: 'Astrophysical Phenomena',
    flowType: 'astrophysical',
    defaultFrequency: 2.5,
    defaultAmplitude: 0.1
  },
  'black_hole_accretion_disk': {
    category: 'Astrophysical Phenomena',
    flowType: 'astrophysical',
    defaultFrequency: 1,
    defaultAmplitude: 0.12
  }
};

/**
 * Check if a shape supports flow animation
 */
export function isFlowCapable(shapeType: SurfaceType): boolean {
  return shapeType in FLOW_CAPABLE_SHAPES;
}

/**
 * Get flow configuration for a specific shape
 */
export function getFlowConfig(shapeType: SurfaceType): typeof FLOW_CAPABLE_SHAPES[string] | null {
  return FLOW_CAPABLE_SHAPES[shapeType] || null;
}

/**
 * Calculate flow animation value at a given point
 * This generates the traveling wave effect
 * 
 * @param position - Position along the structure (0-1)
 * @param time - Current animation time
 * @param config - Flow animation configuration
 * @returns Wave value (-amplitude to +amplitude)
 */
export function calculateFlowWave(
  position: number,
  time: number,
  config: FlowAnimationConfig
): number {
  if (!config.enabled) return 0;
  
  const frequency = config.waveFrequency;
  const amplitude = config.waveAmplitude;
  const speed = config.speed;
  
  // Create traveling wave: sin(2π * frequency * position - speed * time)
  let wave = Math.sin(2 * Math.PI * frequency * position - speed * time);
  
  // For bidirectional flow, create interference pattern
  if (config.direction === 'bidirectional') {
    const reverseWave = Math.sin(2 * Math.PI * frequency * position + speed * time);
    wave = (wave + reverseWave) / 2;
  } else if (config.direction === 'reverse') {
    wave = Math.sin(2 * Math.PI * frequency * position + speed * time);
  }
  
  return wave * amplitude;
}

/**
 * Apply flow animation to a 3D point
 * Modulates position based on flow parameters
 * 
 * @param x - X coordinate
 * @param y - Y coordinate  
 * @param z - Z coordinate
 * @param u - U parameter (typically position along structure)
 * @param v - V parameter (typically angular position)
 * @param time - Animation time
 * @param config - Flow configuration
 * @param axis - Primary flow axis ('x', 'y', or 'z')
 * @returns Modified [x, y, z] coordinates
 */
export function applyFlowAnimation(
  x: number,
  y: number,
  z: number,
  u: number,
  v: number,
  time: number,
  config: FlowAnimationConfig,
  axis: 'x' | 'y' | 'z' = 'z'
): [number, number, number] {
  const wave = calculateFlowWave(u, time, config);
  
  // Apply wave along specified axis
  switch (axis) {
    case 'x':
      return [x + wave, y, z];
    case 'y':
      return [x, y + wave, z];
    case 'z':
    default:
      return [x, y, z + wave];
  }
}

/**
 * Get default flow configuration for a shape
 */
export function getDefaultFlowConfig(shapeType: SurfaceType): FlowAnimationConfig {
  const shapeConfig = getFlowConfig(shapeType);
  
  if (!shapeConfig) {
    return {
      enabled: false,
      speed: 1,
      waveFrequency: 3,
      waveAmplitude: 0.1,
      direction: 'forward'
    };
  }
  
  return {
    enabled: true,
    speed: 1,
    waveFrequency: shapeConfig.defaultFrequency,
    waveAmplitude: shapeConfig.defaultAmplitude,
    direction: 'forward'
  };
}

/**
 * Get all flow-capable shapes grouped by category
 */
export function getFlowShapesByCategory(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  Object.entries(FLOW_CAPABLE_SHAPES).forEach(([shapeName, config]) => {
    if (!grouped[config.category]) {
      grouped[config.category] = [];
    }
    grouped[config.category].push(shapeName);
  });
  
  return grouped;
}
