/**
 * UNIVERSAL PARAMETER VALIDATION SYSTEM
 * Prevents crashes from extreme parameter values
 * Ensures mathematical stability across all 314 shapes
 */

import { SurfaceParameters } from '../types/math';

export interface ParameterLimits {
  min: number;
  max: number;
  default: number;
  warningThreshold?: number; // Optional: warn when approaching limits
}

// Define safe ranges for all parameters
export const PARAMETER_LIMITS: Partial<Record<keyof SurfaceParameters, ParameterLimits | null>> = {
  // CORE AXIS PARAMETERS (A-D): 3D Parametric System
  // A = X-axis (width), B = Y-axis (height), C = Z-axis (depth), D = Twist
  a: { min: 1, max: 20, default: 1 },
  b: { min: 1, max: 20, default: 1 },
  c: { min: 1, max: 20, default: 1 },
  d: { min: -1000, max: 1000, default: 0 },

  // GEOMETRIC TRANSFORMATION PARAMETERS (E-M): Pure transformations
  // E: Rotation, F: Twist, G: Deformation, H: Curvature, I: Taper, J: Bulge, K: Frequency, L: Amplitude, M: Phase
  e: { min: -1000, max: 1000, default: 0 },
  f: { min: -1000, max: 1000, default: 0 },
  g: { min: -1000, max: 1000, default: 0 },
  h: { min: -1000, max: 1000, default: 0 },
  i: { min: -1000, max: 1000, default: 0 },
  j: { min: -1000, max: 1000, default: 0 },
  k: { min: -1000, max: 1000, default: 0 },
  l: { min: -1000, max: 1000, default: 0 },
  m: { min: -1000, max: 1000, default: 0 },

  // Advanced parameters (N-Z) - lower limits for stability
  n: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  o: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  p: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  q: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  r: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  s: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  t: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  u: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  v: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  w: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  x: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  y: { min: 0, max: 10, default: 0, warningThreshold: 5 },
  z: { min: 0, max: 10, default: 0, warningThreshold: 5 },

  // UV domain parameters - Extended to ±180° for full unfolding/meshing capability
  // Controls surface sampling range for shape roll-out and expansion
  uMin: { min: -180, max: 180, default: 0 },
  uMax: { min: -180, max: 180, default: 1 },
  vMin: { min: -180, max: 180, default: 0 },
  vMax: { min: -180, max: 180, default: 1 },

  // Tessellation parameters - mesh density control (horizontal/vertical)
  uSegments: { min: 5, max: 360, default: 360 },
  vSegments: { min: 5, max: 360, default: 360 },
};

/**
 * Clamps a value to safe range with minimal warnings
 */
export function clampParameter(
  paramName: keyof SurfaceParameters,
  value: number,
  warn: boolean = false
): number {
  const limits = PARAMETER_LIMITS[paramName];

  if (!limits) return value; // Non-numeric parameter

  // Check for invalid values only
  if (!isFinite(value) || isNaN(value)) {
    return limits.default;
  }

  // Allow full range without clamping for most parameters
  if (Math.abs(value) < 10000) {
    return value; // Allow much wider range
  }

  // Only clamp extreme values that could break rendering
  const clamped = Math.max(limits.min, Math.min(limits.max, value));
  return clamped;
}

/**
 * Validates and clamps all parameters in a SurfaceParameters object
 */
export function validateParameters(params: SurfaceParameters): SurfaceParameters {
  const validated = { ...params };

  // Preserve existing settings - don't override if user has set values
  const preservedSettings = getPreservedSettings();

  // Use PARAMETER_LIMITS directly as the constraints
  (Object.keys(PARAMETER_LIMITS) as Array<keyof SurfaceParameters>).forEach(key => {
    const limits = PARAMETER_LIMITS[key];
    let value = validated[key];

    // Check if this parameter should be preserved and is a number
    if (limits && preservedSettings.has(key) && typeof value === 'number') {
      // Don't override user's current settings
      return;
    }

    if (!limits) return; // Non-numeric parameter or no limits defined

    // Use default value if the parameter is not a number or undefined
    if (typeof value !== 'number' || !isFinite(value) || isNaN(value)) {
      value = limits.default;
    }

    // Apply constraints only if not preserving
    const clamped = Math.max(limits.min, Math.min(limits.max, value));
    (validated as any)[key] = clamped;
  });

  // UV PARAMETERS ARE NOW INDEPENDENT - NO AUTO-CORRECTION
  // User has full control, parameters don't affect geometry anymore (only texture mapping)
  // Fixed mathematical domains are used for actual surface generation

  // Just warn if values are unusual, but DON'T auto-fix them
  if (validated.uMax !== undefined && validated.uMin !== undefined && validated.uMax <= validated.uMin) {
    console.warn(`⚠️ Note: uMax (${validated.uMax}) is <= uMin (${validated.uMin}). This is allowed for surface unfolding effects.`);
  }

  if (validated.vMax !== undefined && validated.vMin !== undefined && validated.vMax <= validated.vMin) {
    console.warn(`⚠️ Note: vMax (${validated.vMax}) is <= vMin (${validated.vMin}). This is allowed for surface unfolding effects.`);
  }

  // Ensure segments are integers
  if (typeof validated.uSegments === 'number') {
    validated.uSegments = Math.round(validated.uSegments);
  }
  if (typeof validated.vSegments === 'number') {
    validated.vSegments = Math.round(validated.vSegments);
  }


  return validated;
}

// Settings preservation system
const preservedParameterKeys = new Set<keyof SurfaceParameters>();
const userModifiedParameters = new Map<string, number>();

export function preserveUserSettings(paramKey: keyof SurfaceParameters, value: number): void {
  preservedParameterKeys.add(paramKey);
  userModifiedParameters.set(paramKey, value);
}

export function getPreservedSettings(): Set<keyof SurfaceParameters> {
  return preservedParameterKeys;
}

export function clearPreservedSettings(): void {
  preservedParameterKeys.clear();
  userModifiedParameters.clear();
}

export function isParameterUserModified(paramKey: keyof SurfaceParameters): boolean {
  return preservedParameterKeys.has(paramKey);
}

/**
 * Get safe default value for a parameter
 */
export function getParameterDefault(paramName: keyof SurfaceParameters): number {
  const limits = PARAMETER_LIMITS[paramName];
  return limits?.default ?? 0;
}

/**
 * Check if parameters are within safe operating range
 */
export function areParametersSafe(params: SurfaceParameters): boolean {
  let allSafe = true;

  (Object.keys(PARAMETER_LIMITS) as Array<keyof SurfaceParameters>).forEach(key => {
    const limits = PARAMETER_LIMITS[key];
    if (limits && typeof params[key] === 'number') {
      const value = params[key] as number;
      if (!isFinite(value) || isNaN(value) || value < limits.min || value > limits.max) {
        allSafe = false;
      }
    }
  });

  return allSafe;
}

