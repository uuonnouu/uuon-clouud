/**
 * FIXED MATHEMATICAL DOMAINS
 * 
 * Each parametric shape has a FIXED mathematical domain that defines
 * its correct geometry. UV parameters (uMin, uMax, vMin, vMax) should
 * ONLY affect texture mapping, NOT the actual surface generation.
 * 
 * This prevents objects from growing/shrinking when UV parameters change.
 */

export interface MathematicalDomain {
  uMin: number;
  uMax: number;
  vMin: number;
  vMax: number;
}

/**
 * Fixed mathematical domains for all shape types
 * These are the CORRECT ranges for generating each shape's geometry
 */
export const FIXED_MATHEMATICAL_DOMAINS: Record<string, MathematicalDomain> = {
  // Basic shapes - mathematically correct domains
  sphere: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI },
  torus: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2 },
  cylinder: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1 },
  cone: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: 1 },
  cube: { uMin: -1, uMax: 1, vMin: -1, vMax: 1 },
  
  // Advanced topology
  klein_bottle: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2 },
  mobius_strip: { uMin: 0, uMax: Math.PI * 2, vMin: -0.5, vMax: 0.5 },
  trefoil_knot: { uMin: 0, uMax: Math.PI * 2, vMin: 0, vMax: Math.PI * 2 },
  
  // Most shapes use standard parametric domain
  default: { uMin: 0, uMax: 1, vMin: 0, vMax: 1 }
};

/**
 * Get the fixed mathematical domain for a shape
 * This is the domain that should ALWAYS be used for geometry generation
 */
export function getFixedDomain(shapeType: string): MathematicalDomain {
  return FIXED_MATHEMATICAL_DOMAINS[shapeType] || FIXED_MATHEMATICAL_DOMAINS.default;
}

/**
 * Check if user UV parameters differ from mathematical domain
 * This helps detect when UV is being used for "surface unfolding" effects
 */
export function isUVDomainModified(
  shapeType: string,
  userUMin: number,
  userUMax: number,
  userVMin: number,
  userVMax: number
): boolean {
  const fixed = getFixedDomain(shapeType);
  const tolerance = 0.01;
  
  return (
    Math.abs(userUMin - fixed.uMin) > tolerance ||
    Math.abs(userUMax - fixed.uMax) > tolerance ||
    Math.abs(userVMin - fixed.vMin) > tolerance ||
    Math.abs(userVMax - fixed.vMax) > tolerance
  );
}
