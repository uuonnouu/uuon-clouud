/**
 * GENERATIVE TRANSFORMATION SYSTEM
 * 
 * Transforms parameters g-j from harmonic controls into non-linear generative enhancers
 * that create emergent complexity through turbulence, recursion, phase coupling, and entropy.
 * 
 * These transformations enable parametric equations to generate truly organic,
 * unpredictable forms from simple mathematical foundations.
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

// Universal Constants for non-linear transformations
const PHI = 1.6180339887;           // Golden Ratio
const PI = 3.1415926536;            // Pi
const E = 2.7182818285;             // Euler's Number
const SQRT2 = 1.4142135624;         // Pythagoras Constant

export interface GenerativeParams {
  turbulenceCoefficient: number;    // g: 0-1 (0=smooth, 1=chaotic)
  recursiveDepth: number;            // h: 1-10 (iteration count)
  phaseCoupling: number;             // i: 0-1 (0=independent, 1=coupled)
  entropyGradient: number;           // j: 0-1 (0=uniform, 1=random)
}

export interface GeometryModifiers {
  turbulentDisplacement: {
    xOffset: number;
    yOffset: number;
    zOffset: number;
    frequency: number;
  };
  recursionModifier: {
    depth: number;
    decayFactor: number;
  };
  couplingFactors: {
    uvInteraction: number;
    phaseShift: number;
  };
  entropyField: {
    randomness: number;
    gradientStrength: number;
  };
}

/**
 * Extract generative parameters from raw g-j values
 */
export function extractGenerativeParams(params: Record<string, number>): GenerativeParams {
  return {
    turbulenceCoefficient: Math.max(0, Math.min(1, params.g ?? 0)),
    recursiveDepth: Math.max(1, Math.min(10, Math.round(Math.abs(params.h ?? 1)))),
    phaseCoupling: Math.max(0, Math.min(1, params.i ?? 0)),
    entropyGradient: Math.max(0, Math.min(1, params.j ?? 0))
  };
}

/**
 * TURBULENCE COEFFICIENT (g): Non-linear chaotic distortion
 * Uses compound sine waves and fractal noise to create organic irregularity
 * 
 * 0.0 = Perfectly smooth geometry
 * 0.3 = Subtle organic variation
 * 0.5 = Noticeable turbulent flow
 * 0.8 = Strong chaotic displacement
 * 1.0 = Maximum turbulence
 */
function applyTurbulenceCoefficient(
  coefficient: number,
  u: number,
  v: number
): { xOffset: number; yOffset: number; zOffset: number; frequency: number } {
  if (coefficient === 0) {
    return { xOffset: 0, yOffset: 0, zOffset: 0, frequency: 1 };
  }
  
  // Multi-frequency turbulence (non-linear combination)
  const freq1 = 5.0 * PHI;
  const freq2 = 7.0 * SQRT2;
  const freq3 = 11.0 / PI;
  
  // Compound sine waves for chaotic behavior
  const turb1 = Math.sin(u * freq1) * Math.cos(v * freq1 * 0.7);
  const turb2 = Math.sin(u * freq2 * 1.3) * Math.cos(v * freq2 * 0.9);
  const turb3 = Math.sin(u * freq3 * 0.8) * Math.cos(v * freq3 * 1.1);
  
  // Non-linear mixing
  const xOffset = (turb1 + turb2 * 0.5 + turb3 * 0.25) * coefficient;
  const yOffset = (turb2 + turb3 * 0.5 + turb1 * 0.25) * coefficient;
  const zOffset = (turb3 + turb1 * 0.5 + turb2 * 0.25) * coefficient;
  
  // Frequency increases with turbulence
  const frequency = 1.0 + coefficient * 3.0;
  
  return { xOffset, yOffset, zOffset, frequency };
}

/**
 * RECURSIVE DEPTH (h): Self-similar fractal iteration
 * Each level adds exponentially more detail and complexity
 * 
 * 1 = No recursion (base form)
 * 3 = Moderate detail (2^3 = 8x complexity)
 * 5 = High detail (2^5 = 32x complexity)
 * 7 = Very high (2^7 = 128x complexity)
 * 10 = Maximum (2^10 = 1024x complexity)
 */
function getRecursionModifier(depth: number): { depth: number; decayFactor: number } {
  // Exponential decay to prevent explosion
  const decayFactor = Math.pow(PHI, -depth / 3);
  
  return {
    depth,
    decayFactor
  };
}

/**
 * PHASE COUPLING (i): Non-linear interaction between u and v parameters
 * Creates emergent patterns through parameter interdependence
 * 
 * 0.0 = Independent u,v (standard parametric)
 * 0.3 = Weak coupling (subtle warping)
 * 0.5 = Moderate coupling (visible interaction)
 * 0.8 = Strong coupling (highly interdependent)
 * 1.0 = Maximum coupling (fully entangled)
 */
function applyPhaseCoupling(
  coupling: number,
  u: number,
  v: number
): { uvInteraction: number; phaseShift: number } {
  if (coupling === 0) {
    return { uvInteraction: 0, phaseShift: 0 };
  }
  
  // Non-linear u-v interaction
  // Creates interference patterns
  const interaction = Math.sin(u * PI * 2) * Math.cos(v * PI * 2) * coupling;
  
  // Phase shift based on coupling strength
  // Higher coupling = more dramatic phase shifts
  const phaseShift = (u + v) * coupling * PI;
  
  return {
    uvInteraction: interaction,
    phaseShift
  };
}

/**
 * ENTROPY GRADIENT (j): Progressive randomness field
 * Increases non-uniformly across surface, creating order-to-chaos transitions
 * 
 * 0.0 = Perfect order (deterministic)
 * 0.3 = Subtle variation (organic feel)
 * 0.5 = Balanced chaos (natural randomness)
 * 0.8 = High entropy (strong randomness)
 * 1.0 = Maximum entropy (nearly random)
 */
function applyEntropyGradient(
  entropy: number,
  u: number,
  v: number
): { randomness: number; gradientStrength: number } {
  if (entropy === 0) {
    return { randomness: 0, gradientStrength: 0 };
  }
  
  // Pseudo-random but deterministic (based on position)
  const seed = u * 12.9898 + v * 78.233;
  const noise = Math.sin(seed) * 43758.5453;
  const pseudoRandom = noise - Math.floor(noise);
  
  // Gradient: entropy increases toward edges
  const distance = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2);
  const gradientStrength = distance * entropy;
  
  // Non-linear randomness scaling
  const randomness = pseudoRandom * entropy * (1 + gradientStrength);
  
  return {
    randomness,
    gradientStrength
  };
}

/**
 * Apply all generative transformations
 */
export function applyGenerativeTransformations(
  params: Record<string, number>,
  u: number = 0.5,
  v: number = 0.5
): GeometryModifiers {
  const generative = extractGenerativeParams(params);
  
  return {
    turbulentDisplacement: applyTurbulenceCoefficient(generative.turbulenceCoefficient, u, v),
    recursionModifier: getRecursionModifier(generative.recursiveDepth),
    couplingFactors: applyPhaseCoupling(generative.phaseCoupling, u, v),
    entropyField: applyEntropyGradient(generative.entropyGradient, u, v)
  };
}

/**
 * Apply generative modifiers to geometry parameters
 * This modifies a, b, c, d parameters based on generative transforms
 * 
 * Note: Unlike harmonic transforms which modify statically,
 * generative transforms are position-dependent (u,v)
 */
export function applyGenerativeToGeometry(
  equationParams: Record<string, number>,
  u: number = 0.5,
  v: number = 0.5
): Record<string, number> {
  const modifiers = applyGenerativeTransformations(equationParams, u, v);
  const modified = { ...equationParams };
  
  // Store generative modifiers for use in equations
  modified._turbulenceX = modifiers.turbulentDisplacement.xOffset;
  modified._turbulenceY = modifiers.turbulentDisplacement.yOffset;
  modified._turbulenceZ = modifiers.turbulentDisplacement.zOffset;
  modified._turbulenceFreq = modifiers.turbulentDisplacement.frequency;
  
  modified._recursionDepth = modifiers.recursionModifier.depth;
  modified._recursionDecay = modifiers.recursionModifier.decayFactor;
  
  modified._uvInteraction = modifiers.couplingFactors.uvInteraction;
  modified._phaseShift = modifiers.couplingFactors.phaseShift;
  
  modified._entropy = modifiers.entropyField.randomness;
  modified._entropyGradient = modifiers.entropyField.gradientStrength;
  
  // Keep g-j in params for shapes that want direct access
  // (unlike harmonic which deleted them)
  
  return modified;
}

/**
 * Backward compatibility: Export with harmonic names
 * This allows existing code to work without modification
 */
export interface HarmonicParams extends GenerativeParams {
  harmonicRatio: number;      // Maps to turbulenceCoefficient
  tessellation: number;       // Maps to recursiveDepth
  sacredProportion: number;   // Maps to phaseCoupling
  organicBalance: number;     // Maps to entropyGradient
}

export function extractHarmonicParams(params: Record<string, number>): HarmonicParams {
  const gen = extractGenerativeParams(params);
  return {
    harmonicRatio: gen.turbulenceCoefficient,
    tessellation: gen.recursiveDepth,
    sacredProportion: gen.phaseCoupling,
    organicBalance: gen.entropyGradient,
    turbulenceCoefficient: gen.turbulenceCoefficient,
    recursiveDepth: gen.recursiveDepth,
    phaseCoupling: gen.phaseCoupling,
    entropyGradient: gen.entropyGradient
  };
}

export function applyHarmonicTransformations(params: Record<string, number>): GeometryModifiers {
  return applyGenerativeTransformations(params);
}

export function applyHarmonicToGeometry(
  equationParams: Record<string, number>
): Record<string, number> {
  // For static harmonic transforms, use center point (0.5, 0.5)
  return applyGenerativeToGeometry(equationParams, 0.5, 0.5);
}
