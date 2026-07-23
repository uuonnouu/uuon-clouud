/**
 * LIGHTWEIGHT PARAMETER VALIDATOR
 * Ultra-efficient parameter validation with minimal computational overhead
 * Optimized for reduced CPU usage and memory footprint
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

const PARAM_RANGES = {
  min: -1000,
  max: 1000,
  segments: { min: 3, max: 512 }
};

export function validateParametersLightweight(params: any): ValidationResult {
  const errors: string[] = [];

  if (params.uSegments && (params.uSegments < 3 || params.uSegments > 512)) {
    errors.push('U segments must be between 3-512');
  }
  
  if (params.vSegments && (params.vSegments < 3 || params.vSegments > 512)) {
    errors.push('V segments must be between 3-512');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function isValidNumber(value: any): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

export function clampSegments(segments: number): number {
  return Math.max(3, Math.min(512, Math.round(segments)));
}

export function sanitizeForRendering(params: any): Record<string, any> {
  return {
    ...params,
    uSegments: clampSegments(params.uSegments || 32),
    vSegments: clampSegments(params.vSegments || 32),
    a: isValidNumber(params.a) ? params.a : 1,
    b: isValidNumber(params.b) ? params.b : 1,
    c: isValidNumber(params.c) ? params.c : 1
  };
}

export function preserveUserSettings(key: string, value: number): void {
  try {
    sessionStorage.setItem(`param_${key}`, value.toString());
  } catch (e) {
    // Silently fail for performance
  }
}
