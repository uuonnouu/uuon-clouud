/**
 * UV MORPHING & EVOLUTION ENGINE
 * Transforms shapes using UV domain parameters for real-time morphing
 * Makes U/V controls actually powerful and functional
 * © 2025 UUON Foundation Inc.
 */

import { SurfaceParameters } from '../types/math';

export interface UVMorphConfig {
  mode: 'twist' | 'wave' | 'spiral' | 'ripple' | 'vortex' | 'breathe' | 'unfold' | 'fold';
  intensity: number; // 0-1
  frequency: number; //  Oscillation speed
  phase: number;     // Animation phase (time-based)
}

/**
 * EARTH TIME-AWARE MORPHING
 * Uses real-world time cycles for dynamic transformations
 */
export function getEarthTimeParameters(): {
  hourOfDay: number;     // 0-23
  dayOfYear: number;     // 1-365
  moonPhase: number;     // 0-1 (new moon to full moon)
  season: 'spring' | 'summer' | 'fall' | 'winter';
  tideStrength: number;  // 0-1
} {
  const now = new Date();
  const hourOfDay = now.getHours() + now.getMinutes() / 60;
  
  // Day of year calculation
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Approximate moon phase (29.53 day cycle)
  const newMoonRef = new Date(2000, 0, 6).getTime(); // Known new moon
  const daysSinceRef = (now.getTime() - newMoonRef) / oneDay;
  const moonPhase = (daysSinceRef % 29.53) / 29.53;
  
  // Season determination (Northern Hemisphere)
  let season: 'spring' | 'summer' | 'fall' | 'winter';
  if (dayOfYear >= 80 && dayOfYear < 172) season = 'spring';
  else if (dayOfYear >= 172 && dayOfYear < 266) season = 'summer';
  else if (dayOfYear >= 266 && dayOfYear < 355) season = 'fall';
  else season = 'winter';
  
  // Tide strength (combines solar and lunar gravitational pull)
  const solarTide = Math.abs(Math.sin(hourOfDay * Math.PI / 12));
  const lunarTide = Math.abs(Math.cos(moonPhase * Math.PI * 2));
  const tideStrength = (solarTide * 0.3 + lunarTide * 0.7);
  
  return { hourOfDay, dayOfYear, moonPhase, season, tideStrength };
}

/**
 * Apply Earth time-based UV morphing
 */
export function applyEarthTimeMorphing(params: SurfaceParameters): SurfaceParameters {
  const time = getEarthTimeParameters();
  
  // Tidal wave effect on UV range
  const tidalModulation = time.tideStrength * 0.3;
  
  // Seasonal variation in curvature
  const seasonalScale = {
    spring: 1.1,  // Expansion
    summer: 1.2,  // Maximum expansion
    fall: 1.0,    // Neutral
    winter: 0.9   // Contraction
  }[time.season];
  
  // Day/night cycle affects tension
  const dayNightTension = Math.sin(time.hourOfDay * Math.PI / 12) * 0.2 + 0.8;
  
  return {
    ...params,
    uMin: (params.uMin ?? 0) * (1 + tidalModulation),
    uMax: (params.uMax ?? 1) * (1 + tidalModulation),
    vMin: (params.vMin ?? 0) * seasonalScale,
    vMax: (params.vMax ?? 1) * seasonalScale,
    // Adjust geometric parameters
    a: (params.a ?? 1) * dayNightTension,
    b: (params.b ?? 1) * dayNightTension,
    c: (params.c ?? 1) * dayNightTension,
  };
}

/**
 * UV TWIST MORPHING
 * Twists shape along UV coordinates
 */
export function uvTwistMorph(params: SurfaceParameters, intensity: number): SurfaceParameters {
  const twistFactor = intensity * 2 * Math.PI;
  
  return {
    ...params,
    d: (params.d ?? 0) + twistFactor,
    // Modulate UV range to create twist effect
    uMax: (params.uMax ?? 1) + Math.sin(twistFactor) * 0.5,
    vMax: (params.vMax ?? 1) + Math.cos(twistFactor) * 0.5,
  };
}

/**
 * UV WAVE MORPHING
 * Creates undulating wave patterns across surface
 */
export function uvWaveMorph(params: SurfaceParameters, frequency: number, amplitude: number): SurfaceParameters {
  return {
    ...params,
    e: (params.e ?? 0) + amplitude,
    f: (params.f ?? 1) * (1 + frequency),
    // Wave modulation in UV space
    uSegments: Math.max(32, Math.floor((params.uSegments || 64) * (1 + frequency * 0.5))),
    vSegments: Math.max(32, Math.floor((params.vSegments || 48) * (1 + frequency * 0.5))),
  };
}

/**
 * UV SPIRAL MORPHING
 * Creates spiral/vortex effect
 */
export function uvSpiralMorph(params: SurfaceParameters, turns: number): SurfaceParameters {
  const spiralAngle = turns * 2 * Math.PI;
  
  return {
    ...params,
    d: (params.d ?? 0) + spiralAngle * 0.5,
    g: (params.g ?? 1) + Math.abs(Math.sin(spiralAngle)),
    // Spiral expansion in UV domain
    uMax: (params.uMax ?? 1) * (1 + turns * 0.2),
    vMax: (params.vMax ?? 1) * (1 + turns * 0.2),
  };
}

/**
 * UV RIPPLE MORPHING
 * Concentric ripple waves from center
 */
export function uvRippleMorph(params: SurfaceParameters, wavelength: number, amplitude: number): SurfaceParameters {
  return {
    ...params,
    h: (params.h ?? 0) + amplitude * 2,
    i: (params.i ?? 0) + amplitude * 2,
    // Ripple requires fine tessellation
    uSegments: Math.max(64, params.uSegments || 64),
    vSegments: Math.max(64, params.vSegments || 48),
  };
}

/**
 * UV VORTEX MORPHING
 * Spiraling vortex with compression
 */
export function uvVortexMorph(params: SurfaceParameters, strength: number): SurfaceParameters {
  return {
    ...params,
    d: (params.d ?? 0) + strength * 3,
    j: (params.j ?? 0) + strength,
    k: (params.k ?? 0) - strength * 0.5,
    // Vortex compression
    uMin: (params.uMin ?? 0) * (1 - strength * 0.2),
    uMax: (params.uMax ?? 1) * (1 + strength * 0.3),
  };
}

/**
 * UV BREATHE MORPHING
 * Pulsating expansion/contraction
 */
export function uvBreatheMorph(params: SurfaceParameters, phase: number): SurfaceParameters {
  const breatheScale = 1 + Math.sin(phase * Math.PI * 2) * 0.2;
  
  return {
    ...params,
    a: (params.a ?? 1) * breatheScale,
    b: (params.b ?? 1) * breatheScale,
    c: (params.c ?? 1) * breatheScale,
    // Synchronize UV breathing
    uMax: (params.uMax ?? 1) * breatheScale,
    vMax: (params.vMax ?? 1) * breatheScale,
  };
}

/**
 * UV UNFOLD MORPHING
 * Unfolds/unwraps the surface
 */
export function uvUnfoldMorph(params: SurfaceParameters, progress: number): SurfaceParameters {
  // Progress from 0 (folded) to 1 (fully unfolded)
  const unfoldRange = progress * 2;
  
  return {
    ...params,
    uMin: (params.uMin ?? 0) - unfoldRange,
    uMax: (params.uMax ?? 1) + unfoldRange,
    vMin: (params.vMin ?? 0) - unfoldRange * 0.5,
    vMax: (params.vMax ?? 1) + unfoldRange * 0.5,
    // Increase detail during unfold
    uSegments: Math.floor((params.uSegments || 64) * (1 + progress * 0.5)),
    vSegments: Math.floor((params.vSegments || 48) * (1 + progress * 0.5)),
  };
}

/**
 * UV FOLD MORPHING
 * Folds/compresses the surface
 */
export function uvFoldMorph(params: SurfaceParameters, foldLevel: number): SurfaceParameters {
  // Fold level from 0 (normal) to 1 (maximum fold)
  const compression = 1 - foldLevel * 0.6;
  
  return {
    ...params,
    uMin: (params.uMin ?? 0) * compression,
    uMax: (params.uMax ?? 1) * compression,
    vMin: (params.vMin ?? 0) * compression,
    vMax: (params.vMax ?? 1) * compression,
    l: (params.l ?? 0) + foldLevel * 2,
    m: (params.m ?? 1) * (1 - foldLevel * 0.3),
  };
}

/**
 * COMBINED UV MORPHING
 * Apply multiple morphing effects
 */
export function applyUVMorphing(
  params: SurfaceParameters,
  morphConfig: UVMorphConfig
): SurfaceParameters {
  let morphed = { ...params };
  
  switch (morphConfig.mode) {
    case 'twist':
      morphed = uvTwistMorph(morphed, morphConfig.intensity);
      break;
    case 'wave':
      morphed = uvWaveMorph(morphed, morphConfig.frequency, morphConfig.intensity);
      break;
    case 'spiral':
      morphed = uvSpiralMorph(morphed, morphConfig.intensity * 5);
      break;
    case 'ripple':
      morphed = uvRippleMorph(morphed, morphConfig.frequency, morphConfig.intensity);
      break;
    case 'vortex':
      morphed = uvVortexMorph(morphed, morphConfig.intensity);
      break;
    case 'breathe':
      morphed = uvBreatheMorph(morphed, morphConfig.phase);
      break;
    case 'unfold':
      morphed = uvUnfoldMorph(morphed, morphConfig.intensity);
      break;
    case 'fold':
      morphed = uvFoldMorph(morphed, morphConfig.intensity);
      break;
  }
  
  return morphed;
}

/**
 * EVOLUTIONARY UV PARAMETERS
 * Evolve shape over time using UV domain
 */
export interface EvolutionState {
  generation: number;
  fitness: number;
  mutations: number;
}

export function evolveUVParameters(
  params: SurfaceParameters,
  targetFitness: (p: SurfaceParameters) => number,
  generations: number = 10
): { evolved: SurfaceParameters; state: EvolutionState } {
  let current = { ...params };
  let bestFitness = targetFitness(current);
  let mutations = 0;
  
  for (let gen = 0; gen < generations; gen++) {
    // Mutate UV parameters
    const mutated = {
      ...current,
      uMin: current.uMin + (Math.random() - 0.5) * 0.2,
      uMax: current.uMax + (Math.random() - 0.5) * 0.2,
      vMin: current.vMin + (Math.random() - 0.5) * 0.2,
      vMax: current.vMax + (Math.random() - 0.5) * 0.2,
      uSegments: Math.max(16, Math.floor(current.uSegments + (Math.random() - 0.5) * 10)),
      vSegments: Math.max(16, Math.floor(current.vSegments + (Math.random() - 0.5) * 10)),
    };
    
    const newFitness = targetFitness(mutated);
    
    if (newFitness > bestFitness) {
      current = mutated;
      bestFitness = newFitness;
      mutations++;
    }
  }
  
  return {
    evolved: current,
    state: {
      generation: generations,
      fitness: bestFitness,
      mutations
    }
  };
}
