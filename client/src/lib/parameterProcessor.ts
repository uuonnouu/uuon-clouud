/**
 * PARAMETER SYSTEM ARCHITECTURE - Stable Mathematical Controls
 * Maintains mathematical integrity with predictable geometric operations
 * 
 * CATEGORIES (13 parameters a-m):
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 * 🔷 CORE GEOMETRY (a-c) - Base shape dimensions
 *    a: X-AXIS SCALE - Width/horizontal dimension
 *    b: Y-AXIS SCALE - Height/vertical dimension  
 *    c: Z-AXIS SCALE - Depth/forward dimension
 * 
 * 🔺 MATHEMATICAL CONSTANTS (d-e):
 *    d: PHI (φ) - Golden ratio transformation (1.618...)
 *    e: PI (π) - Circular/wave transformation (3.14159...)
 * 
 * 📐 GEOMETRIC OPERATIONS (f-m):
 *    f: O(n) LINEAR - Linear complexity scaling factor
 *    g: TESSELLATION - Polygon subdivision level
 *    h: MIRROR X - Axis reflection on X plane
 *    i: MIRROR Y - Axis reflection on Y plane
 *    j: MIRROR Z - Axis reflection on Z plane
 *    k: INTERNAL - Shape manipulation from center outward
 *    l: EXTERNAL - Shape manipulation from edges inward
 *    m: SMOOTHNESS - Parametric curve transition quality
 * 
 * 🎨 VISUAL (o-q) - Appearance ONLY (metalness, texture, color hue)
 * ⚡ SIMULATION (r-w) - Physics simulation and environmental interactions
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 */

import { applyGenerativeToGeometry } from './generativeTransforms';

// Parameter role constants - 13 stable mathematical parameters
export const GEOMETRY_PARAMS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm'] as const;
export const VISUAL_PARAMS = ['o', 'p', 'q'] as const;
export const SIMULATION_PARAMS = ['r', 's', 't', 'u', 'v', 'w'] as const;
export const RESERVED_PARAMS = ['n', 'x', 'y', 'z'] as const; // n reserved for future use

export interface SeparatedParams {
  // GEOMETRY: ALL a-n parameters go to equation functions (n = Sphere Morph)
  equationParams: Record<string, number>;
  
  // VISUAL: Material properties ONLY (o-q)
  visual: {
    opacity: number;        // Fixed at 1.0 (fully opaque) - not controllable
    metalness: number;      // o (0-1) 
    roughness: number;      // derived from o (1-o)
    textureIndex: number;   // p (integer index)
    hue: number;           // q (0-360 degrees)
  };
  
  // SIMULATION: Physics properties
  simulation: {
    mass: number;          // r
    friction: number;      // s
    restitution: number;   // t (bounciness)
    gravityInfluence: number; // u
    linearDamping: number; // v
    timeScale: number;     // w
  };
}

/**
 * Stabilize critical geometry parameters to prevent shape collapse
 * CRITICAL: f (Frequency) must be >= 0.01 or shapes break
 * h and l use tighter ranges [0.1-3]
 * 
 * SHAPE-SPECIFIC SCALING: Normalizes wildly different shape scales (nanometers to cosmic)
 * so all shapes work with similar parameter ranges. This makes interaction predictable.
 */
export function stabilizeParameters(params: Record<string, number>, shapeType?: string): Record<string, number> {
  const stabilized = { ...params };
  
  // Clamp f (Frequency) only if EXACTLY zero to prevent division by zero
  // Use 0.00001 threshold (5-decimal precision) to eliminate "mushy" dead zones
  // Values like 0.00001 through 0.009 should work normally
  if (stabilized.f !== undefined && stabilized.f === 0) {
    stabilized.f = 0.00001; // Minimum non-zero value
  }
  
  // Apply shape-specific scaling to normalize size ranges across different shape categories
  // This ensures micro (cells) and macro (cosmic) shapes all work with similar parameter values
  if (shapeType) {
    const scale = getShapeScale(shapeType);
    
    // Apply scale to primary parameters - this normalizes the effective size
    if (stabilized.a !== undefined) stabilized.a *= scale;
    if (stabilized.b !== undefined) stabilized.b *= scale;
    if (stabilized.c !== undefined) stabilized.c *= scale;
  }
  
  return stabilized;
}

/**
 * Get appropriate scale factor for different shape types
 * This normalizes sizes so all shapes work predictably with similar parameter ranges
 */
function getShapeScale(shapeType: string): number {
  // Micro shapes (need scaling up to be visible)
  if (shapeType.includes('cell') || shapeType.includes('microglia') || 
      shapeType.includes('neural') || shapeType.includes('olfactory')) {
    return 10; // Scale up tiny biological structures (nanometer scale)
  }
  
  // Macro/cosmic shapes (need scaling down to fit viewport)
  if (shapeType.includes('cosmic') || shapeType.includes('galaxy') ||
      shapeType.includes('universe') || shapeType.includes('spacetime')) {
    return 0.1; // Scale down massive cosmic structures (parsec scale)
  }
  
  // Mathematical surfaces (often very small)
  if (shapeType.includes('surface') || shapeType.includes('minimal') ||
      shapeType.includes('riemann') || shapeType.includes('klein')) {
    return 5; // Scale up mathematical surfaces (unit scale)
  }
  
  // Default scale for normal shapes (meter scale)
  return 1;
}

/**
 * Apply Parameter Blanket - Separates parameters into strict categories
 * 
 * CRITICAL: This ensures that:
 * - ALL geometry params (a-n) reach equation functions (n = Sphere Morph)
 * - Visual params (o-q) ONLY affect material appearance
 * - Simulation params (r-w) ONLY affect physics
 */
export function applyParameterBlanket(
  shapeType: string, 
  rawParams: Record<string, number>
): SeparatedParams {
  // Stabilize parameters first to prevent collapse
  const stabilizedParams = stabilizeParameters(rawParams, shapeType);
  const equationParams: Record<string, number> = {};
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 1: Extract ALL geometry parameters (a-n, where n = Sphere Morph)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  GEOMETRY_PARAMS.forEach(letter => {
    if (stabilizedParams[letter] !== undefined) {
      equationParams[letter] = stabilizedParams[letter];
    }
  });
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 1.5: Apply GENERATIVE TRANSFORMATIONS (g-j → procedural geometry)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Transform g-j parameters using non-linear generative algorithms
  // (turbulence, recursion, phase coupling, entropy gradient)
  // CRITICAL: Pass ONLY geometry params to prevent visual/simulation pollution
  const geometryOnlyParams: Record<string, number> = {};
  GEOMETRY_PARAMS.forEach(letter => {
    if (stabilizedParams[letter] !== undefined) {
      geometryOnlyParams[letter] = stabilizedParams[letter];
    }
  });
  
  // Apply generative transformation (this will process g-j and add modifiers)
  const generativeParams = applyGenerativeToGeometry(geometryOnlyParams);
  
  // Replace equationParams with generatively transformed geometry params
  // This ensures g-j are processed into _turbulence*, _recursion*, etc.
  Object.keys(equationParams).forEach(key => delete equationParams[key]);
  Object.assign(equationParams, generativeParams);
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 2: Extract VISUAL parameters (o-q ONLY)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // CRITICAL: These affect appearance ONLY, NEVER geometry!
  // Opacity is fixed at 1.0 (fully opaque)
  const visual = {
    opacity: 1.0,
    metalness: Math.max(0, Math.min(1, stabilizedParams.o ?? 0.3)),
    roughness: Math.max(0, Math.min(1, 1 - (stabilizedParams.o ?? 0.3))),
    textureIndex: Math.floor(stabilizedParams.p ?? 0),
    hue: (stabilizedParams.q ?? 200) % 360
  };
  
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 3: Extract SIMULATION parameters (r-w)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const simulation = {
    mass: stabilizedParams.r ?? 1.0,
    friction: stabilizedParams.s ?? 0.5,
    restitution: stabilizedParams.t ?? 0.3,
    gravityInfluence: stabilizedParams.u ?? 1.0,
    linearDamping: stabilizedParams.v ?? 0.1,
    timeScale: stabilizedParams.w ?? 1.0
  };
  
  return {
    equationParams,
    visual,
    simulation
  };
}

/**
 * Get material properties from visual parameters ONLY
 * CRITICAL: Visual params NEVER affect geometry
 */
export function getMaterialProperties(visual: SeparatedParams['visual']) {
  // Approved texture paths from /public/textures (ONLY use textures that exist!)
  const APPROVED_TEXTURES = [
    '/textures/asphalt.png',
    '/textures/grass.png', 
    '/textures/sand.jpg',
    '/textures/sky.png',
    '/textures/wood.jpg'
  ];
  
  // Map texture index to approved texture (with wrapping)
  const textureIndex = Math.abs(visual.textureIndex) % APPROVED_TEXTURES.length;
  const texturePath = APPROVED_TEXTURES[textureIndex];
  
  // Convert hue to RGB color
  const hueToRgb = (h: number): [number, number, number] => {
    const s = 0.7; // saturation
    const l = 0.5; // lightness
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    return [(r + m), (g + m), (b + m)];
  };
  
  const [r, g, b] = hueToRgb(visual.hue);
  
  return {
    color: { r, g, b },
    opacity: visual.opacity,
    metalness: visual.metalness,
    roughness: visual.roughness,
    texturePath,
    transparent: visual.opacity < 1
  };
}

/**
 * Parameter ranges and defaults - ENHANCED PARAMETERS A-M WITH GEOMETRIC TRANSFORMATIONS
 */
export const PARAMETER_RANGES = {
  // 🔷 CORE GEOMETRY (A-C) - Base shape dimensions aligned with PARAMETER_SPECS
  // Negative values create mirrored/inverted shapes
  a: { min: -25, max: 25, default: 1.0, category: 'geometry', label: 'X-Axis Scale', step: 0.00001 },
  b: { min: -25, max: 25, default: 1.0, category: 'geometry', label: 'Y-Axis Scale', step: 0.00001 },
  c: { min: -25, max: 25, default: 1.0, category: 'geometry', label: 'Z-Axis Scale', step: 0.00001 },
  
  // 🌀 TRANSFORMATION PARAMETERS (D-M) - Aligned with PARAMETER_SPECS ranges (-180 to 180)
  d: { min: -180, max: 180, default: 0, category: 'geometry', label: 'PHI (φ) • Foundational Curve', step: 0.00001 },
  e: { min: -180, max: 180, default: 0, category: 'geometry', label: 'PI (π) • Foundational Curve', step: 0.00001 },
  f: { min: -180, max: 180, default: 0, category: 'geometry', label: 'RIPPLE • Surface Revolution', step: 0.00001 },
  g: { min: -180, max: 180, default: 0, category: 'geometry', label: 'FREQUENCY • Surface Revolution', step: 0.00001 },
  h: { min: -180, max: 180, default: 0, category: 'geometry', label: 'EXTRUSION • Sweep Path', step: 0.00001 },
  i: { min: -180, max: 180, default: 0, category: 'geometry', label: 'SWEEP • Extrusion Depth', step: 0.00001 },
  j: { min: -180, max: 180, default: 0, category: 'geometry', label: 'LOFT • Interpolation', step: 0.00001 },
  k: { min: -180, max: 180, default: 0, category: 'geometry', label: 'BLEND • Loft Curve', step: 0.00001 },
  l: { min: -180, max: 180, default: 0, category: 'geometry', label: 'SUPERQUAD • Exponent', step: 0.00001 },
  m: { min: -180, max: 180, default: 0, category: 'geometry', label: 'POWER • Superquadric', step: 0.00001 },
  
  // 🎨 MINIMAL SURFACES & VISUAL (N-Q) - Aligned with PARAMETER_SPECS
  n: { min: -180, max: 180, default: 0, category: 'geometry', label: 'MINIMAL • Topological', step: 0.00001 },
  o: { min: -180, max: 180, default: 0, category: 'geometry', label: 'SURFACE • Minimal', step: 0.00001 },
  p: { min: -180, max: 180, default: 0, category: 'geometry', label: 'WAVE • Waveform', step: 0.00001 },
  q: { min: -180, max: 180, default: 0, category: 'geometry', label: 'HARMONIC • Wave Dynamics', step: 0.00001 },
  
  // 🔀 SPECIAL STRUCTURES & PHI-BASED (R-W) - Aligned with PARAMETER_SPECS
  r: { min: -180, max: 180, default: 0, category: 'geometry', label: 'SPECIAL • Topological Twist', step: 0.00001 },
  s: { min: -180, max: 180, default: 0, category: 'geometry', label: 'STRUCTURE • Special Form', step: 0.00001 },
  t: { min: -180, max: 180, default: 0, category: 'geometry', label: 'PHI • Golden Ratio', step: 0.00001 },
  u: { min: -180, max: 180, default: 0, category: 'geometry', label: 'GOLDEN • Φ-Based', step: 0.00001 },
  v: { min: -180, max: 180, default: 0, category: 'geometry', label: 'FRACTAL • High Chaos', step: 0.00001 },
  w: { min: -180, max: 180, default: 0, category: 'geometry', label: 'NOISE • Fractal Pattern', step: 0.00001 },
  
  // 🔄 UNIVERSAL AXIS OFFSETS (x-z) - Post-transform 3D translation
  x: { min: -10, max: 10, default: 1, category: 'offset', label: 'X Axis Offset', step: 0.00001 },
  y: { min: -10, max: 10, default: 1, category: 'offset', label: 'Y Axis Offset', step: 0.00001 },
  z: { min: -10, max: 10, default: 1, category: 'offset', label: 'Z Axis Offset', step: 0.00001 },
  
  // 🔄 TRANSFORM CONTROLS - Rotation (degrees)
  rotationX: { min: 0, max: 360, default: 0, category: 'transform', label: 'Rotate X', step: 1 },
  rotationY: { min: 0, max: 360, default: 0, category: 'transform', label: 'Rotate Y', step: 1 },
  rotationZ: { min: 0, max: 360, default: 0, category: 'transform', label: 'Rotate Z', step: 1 },
  
  // 📐 AUTO-SCALE - Size normalization
  targetScale: { min: 0.5, max: 10, default: 3, category: 'transform', label: 'Target Scale', step: 0.1 }
};

/**
 * Get default values for all parameters
 */
export function getParameterDefaults(): Record<string, number> {
  const defaults: Record<string, number> = {};
  Object.entries(PARAMETER_RANGES).forEach(([key, range]) => {
    defaults[key] = range.default;
  });
  return defaults;
}

/**
 * Validate parameter value within range
 */
export function validateParameterRange(param: string, value: number): number {
  const range = PARAMETER_RANGES[param as keyof typeof PARAMETER_RANGES];
  if (!range) return value;
  return Math.max(range.min, Math.min(range.max, value));
}

/**
 * Validate parameter boundaries - ensures no cross-contamination
 */
export function validateParameterBoundaries(params: Record<string, number>): string[] {
  const warnings: string[] = [];
  
  // Check for reserved params being used
  RESERVED_PARAMS.forEach(letter => {
    if (params[letter] !== undefined && params[letter] !== 0) {
      warnings.push(`⚠️ Reserved parameter '${letter}' should not be used`);
    }
  });
  
  return warnings;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BACKWARD COMPATIBILITY - Legacy API Support
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface FullParameters {
  a: number; b: number; c: number; d: number;
  e: number; f: number; g: number;
  h: number; i: number; j: number;
  k: number; l: number; m: number;
  n: number; o: number; p: number; q: number;
  r: number; s: number; t: number;
  u: number; v: number; w: number;
  x: number; y: number; z: number;
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use applyParameterBlanket instead
 */
export function applyParameterTransforms(
  baseGeometry: [number, number, number],
  params: FullParameters
): [number, number, number] {
  // Just return the base geometry unchanged for now
  // Transform params will be applied at mesh level
  return baseGeometry;
}
