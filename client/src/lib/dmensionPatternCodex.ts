/**
 * 🔱 DMENSION PATTERN CODEX
 * Master Collection of 40 Mathematical Pattern Visualizations
 * Full 360° Parametric Surface Models
 * 
 * All patterns rendered as complete 3D parametric surfaces using
 * spherical, toroidal, and heightfield coordinate systems for
 * maximum visual impact and mathematical accuracy.
 */

import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

// ============================================================================
// 1️⃣ PRIME PATTERNS (5 shapes)
// Visualization of prime number distributions and properties
// ============================================================================

const PRIME_PATTERNS: Record<string, ParametricSurface> = {
  
  ulam_spiral: {
    name: "🌀 Ulam Spiral - Prime Distribution Vortex",
    description: "Integers spiral outward, primes marked as peaks creating diagonal clusters",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const intensity = params.e ?? 2;
      const layers = params.f ?? 8;
      
      const theta = u * Math.PI * 2 * layers;
      const phi = v * Math.PI;
      const r = scale * (0.5 + v * 0.5);
      
      // Ulam spiral: n = floor(theta * layers)
      const n = Math.floor(theta * 10) + 1;
      const isPrimeLike = (n % 2 !== 0 && n % 3 !== 0 && n > 1) || n === 2 || n === 3;
      const primeHeight = isPrimeLike ? intensity * 0.3 : 0;
      
      // Spiral coordinates
      const spiralR = r * (1 + 0.1 * Math.sin(theta * 6));
      const x = spiralR * Math.sin(phi) * Math.cos(theta);
      const y = spiralR * Math.sin(phi) * Math.sin(theta);
      const z = spiralR * Math.cos(phi) + primeHeight * Math.sin(n * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 2, f: 8, uSegments: 128, vSegments: 64 })
  },

  euler_prime_quadratic: {
    name: "📐 Euler Prime Quadratic - n² + n + 41",
    description: "Euler's famous prime-generating polynomial visualized as surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;
      const curvature = params.e ?? 1.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Euler's formula: n² + n + 41
      const n = v * 40;
      const eulerValue = n * n + n + 41;
      const normalizedEuler = Math.log(eulerValue + 1) / 10;
      
      // Create parabolic surface with prime streaks
      const baseR = scale * (1 + curvature * 0.2 * normalizedEuler);
      const x = baseR * Math.sin(phi) * Math.cos(theta);
      const y = baseR * Math.sin(phi) * Math.sin(theta);
      const z = baseR * Math.cos(phi) * (1 + 0.3 * Math.sin(normalizedEuler * Math.PI * 4));
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 1.5, uSegments: 96, vSegments: 64 })
  },

  twin_primes: {
    name: "👯 Twin Primes - (p, p+2) Lattice Pairs",
    description: "Twin prime pairs visualized as paired surface oscillations",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const separation = params.e ?? 0.5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Twin prime pattern: double peaks
      const twinWave = Math.sin(theta * 11) * Math.sin(theta * 13);
      const pairBump = Math.cos(phi * 7) * separation;
      
      const r = scale * (1 + 0.15 * twinWave + 0.1 * pairBump);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 0.5, uSegments: 128, vSegments: 64 })
  },

  mersenne_primes: {
    name: "🔢 Mersenne Primes - 2ⁿ - 1 Binary Spikes",
    description: "Mersenne primes (2^n - 1) as high-energy spikes on binary surface",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;
      const spikeHeight = params.e ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Mersenne pattern: 2^n - 1 for n = 2, 3, 5, 7, 13...
      const mersennePowers = [2, 3, 5, 7, 13];
      let mersenneSpike = 0;
      for (const p of mersennePowers) {
        mersenneSpike += Math.exp(-Math.pow(theta * 8 - p, 2) * 2) * spikeHeight;
      }
      
      const r = scale * (1 + 0.1 * mersenneSpike);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + mersenneSpike * 0.3 * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 2, uSegments: 128, vSegments: 64 })
  },

  sophie_germain_primes: {
    name: "🔐 Sophie Germain Primes - Dual Prime Stabilizers",
    description: "Primes p where 2p+1 is also prime, creating dual stabilizing patterns",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const dualAmplitude = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Sophie Germain pattern: p and 2p+1 both prime
      // Creates interleaved wave pattern
      const primaryWave = Math.sin(theta * 5) * Math.sin(phi * 3);
      const secondaryWave = Math.sin(theta * 11) * Math.cos(phi * 5);
      const dualPattern = primaryWave + 0.5 * secondaryWave * dualAmplitude;
      
      const r = scale * (1 + 0.1 * dualPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 96, vSegments: 64 })
  }
};

// ============================================================================
// 2️⃣ HARMONIC / GOLDEN RATIO PATTERNS (4 shapes)
// Fibonacci-related sequences and harmonic constants
// ============================================================================

const HARMONIC_PATTERNS: Record<string, ParametricSurface> = {

  lucas_numbers: {
    name: "🌻 Lucas Numbers - Fibonacci's Harmonic Cousin",
    description: "Lucas sequence (2,1,3,4,7,11...) with same φ ratio as Fibonacci",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const phi_ratio = (1 + Math.sqrt(5)) / 2; // Golden ratio
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Lucas spiral pattern
      const n = v * 10;
      const lucasApprox = Math.pow(phi_ratio, n) + Math.pow(-phi_ratio, -n);
      const lucasNorm = Math.log(Math.abs(lucasApprox) + 1) / 5;
      
      const spiralR = scale * (1 + 0.2 * lucasNorm * Math.sin(theta * phi_ratio * 3));
      const x = spiralR * Math.sin(phi) * Math.cos(theta * phi_ratio);
      const y = spiralR * Math.sin(phi) * Math.sin(theta * phi_ratio);
      const z = spiralR * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  pell_numbers: {
    name: "🔷 Pell Numbers - √2 Diagonal Lattice",
    description: "Pell sequence tied to √2, creating octagonal symmetry",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const octagonalStrength = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const sqrt2 = Math.sqrt(2);
      
      // Pell sequence modulation: 8-fold symmetry
      const pellPattern = Math.cos(theta * 8) * octagonalStrength;
      const diagonalWave = Math.sin((theta + phi) * sqrt2 * 4);
      
      const r = scale * (1 + 0.1 * pellPattern + 0.05 * diagonalWave);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 128, vSegments: 64 })
  },

  silver_ratio_octagonal: {
    name: "🥈 Silver Ratio - 1 + √2 Octagonal Harmony",
    description: "Silver ratio (δs = 1 + √2) in folding and quasiperiodic tilings",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const foldIntensity = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const silverRatio = 1 + Math.sqrt(2);
      
      // Octagonal folding pattern
      const foldPattern = Math.cos(theta * 8 * silverRatio) * foldIntensity;
      const quasiPeriodic = Math.sin(theta * silverRatio * 5) * Math.cos(phi * silverRatio * 3);
      
      const r = scale * (1 + 0.12 * foldPattern + 0.08 * quasiPeriodic);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 128, vSegments: 64 })
  },

  harmonic_engine_constant: {
    name: "⚡ 6.6 Harmonic Engine - Universal Metaconstant",
    description: "H = (F + φ + π + √3) / 4 ≈ 1.651 ≈ φ cross-constant convergence",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const resonance = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Universal harmonic constant
      const fibonacci = 1.618033988749;
      const piVal = Math.PI;
      const sqrt3 = Math.sqrt(3);
      const H = (fibonacci + fibonacci + piVal + sqrt3) / 4; // ≈ 1.651
      
      // Multi-constant resonance
      const resonancePattern = 
        Math.sin(theta * fibonacci * 3) * 0.4 +
        Math.cos(theta * piVal) * 0.3 +
        Math.sin(phi * sqrt3 * 2) * 0.3;
      
      const r = scale * (1 + resonance * 0.15 * resonancePattern);
      const x = r * Math.sin(phi) * Math.cos(theta * H);
      const y = r * Math.sin(phi) * Math.sin(theta * H);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 96, vSegments: 64 })
  }
};

// ============================================================================
// 3️⃣ GEOMETRIC NUMBER FAMILIES (6 shapes)
// Figurate numbers: triangular, square, pentagonal, etc.
// ============================================================================

const GEOMETRIC_NUMBER_PATTERNS: Record<string, ParametricSurface> = {

  triangular_numbers: {
    name: "🔺 Triangular Numbers - T(n) = n(n+1)/2",
    description: "Dot patterns forming perfect triangles, stacked into 3D",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const layers = params.f ?? 6;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Triangular number modulation: T(n) = n(n+1)/2
      const n = v * layers;
      const Tn = n * (n + 1) / 2;
      const triPattern = Math.sin(theta * 3) * (Tn / 20);
      
      const r = scale * (1 + 0.1 * triPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + Tn * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, f: 6, uSegments: 96, vSegments: 64 })
  },

  square_numbers: {
    name: "⬜ Square Numbers - S(n) = n²",
    description: "Grid-based geometric scaling in perfect squares",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Square number grid pattern
      const gridU = Math.floor(u * 8);
      const gridV = Math.floor(v * 8);
      const squareN = (gridU + 1) * (gridV + 1);
      const squarePattern = Math.cos(theta * 4) * Math.cos(phi * 4);
      
      const r = scale * (1 + 0.1 * squarePattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  pentagonal_numbers: {
    name: "⬠ Pentagonal Numbers - P(n) = n(3n-1)/2",
    description: "Polygonal radial expansion with 5-fold symmetry",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Pentagonal symmetry
      const pentPattern = Math.cos(theta * 5) * 0.15;
      const n = v * 8;
      const Pn = n * (3 * n - 1) / 2;
      
      const r = scale * (1 + pentPattern + 0.02 * Math.log(Pn + 1));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  hexagonal_numbers: {
    name: "⬡ Hexagonal Numbers - H(n) = n(2n-1)",
    description: "Honeycomb and circle packing geometry",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Hexagonal honeycomb pattern
      const hexPattern = Math.cos(theta * 6) * 0.12;
      const honeycomb = Math.sin(theta * 6 + phi * 3) * 0.08;
      
      const r = scale * (1 + hexPattern + honeycomb);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  tetrahedral_numbers: {
    name: "🔻 Tetrahedral Numbers - Tet(n) = n(n+1)(n+2)/6",
    description: "3D stacking creating perfect volumetric growth",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Tetrahedral 4-fold + 3-fold symmetry
      const tetPattern = Math.cos(theta * 4) * Math.sin(phi * 3) * 0.15;
      const n = v * 6;
      const TetN = n * (n + 1) * (n + 2) / 6;
      
      const r = scale * (1 + tetPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + 0.01 * Math.log(TetN + 1);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, uSegments: 96, vSegments: 64 })
  },

  octahedral_numbers: {
    name: "💎 Octahedral Numbers - Oct(n) = n(2n²+1)/3",
    description: "Tetrahedral dual with symmetric 3D expansion",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Octahedral 8-fold symmetry
      const octPattern = (Math.cos(theta * 4) + Math.cos(phi * 4)) * 0.1;
      
      const r = scale * (1 + octPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  }
};

// ============================================================================
// 4️⃣ DIGITAL / MIRROR / DECIMAL PATTERNS (6 shapes)
// Repunits, Kaprekar, Armstrong numbers
// ============================================================================

const DIGITAL_PATTERNS: Record<string, ParametricSurface> = {

  repunit_generator: {
    name: "1️⃣ Repunit Generator - R(n) = (10ⁿ-1)/9",
    description: "Numbers made of all 1s: 1, 11, 111, 1111...",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const waves = params.e ?? 3;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Repunit wave: repeating 1s pattern
      const repunitWave = Math.sin(theta * waves * 11) * 0.1;
      const onesPattern = Math.cos(phi * 11) * 0.05;
      
      const r = scale * (1 + repunitWave + onesPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 3, uSegments: 128, vSegments: 64 })
  },

  repunit_square_identity: {
    name: "🔲 Repunit Square - 111...1² = 123...n...321",
    description: "Mirror symmetry: (111)² = 12321, digit palindrome",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Palindrome pattern: builds up and back down
      const palindrome = Math.abs(Math.sin(theta * Math.PI));
      const mirrorSymmetry = Math.cos(2 * theta) * Math.cos(2 * phi);
      
      const r = scale * (1 + 0.15 * palindrome + 0.1 * mirrorSymmetry);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  kaprekar_constant: {
    name: "🔄 Kaprekar Constant - 6174 Attractor",
    description: "Digit dynamics collapse to fixed point 6174",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const attractorStrength = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Attractor basin: converges to center
      const dist = Math.sqrt(Math.pow(u - 0.5, 2) + Math.pow(v - 0.5, 2));
      const attractorPull = Math.exp(-dist * 5 * attractorStrength);
      const kaprekarSpiral = Math.sin(theta * 6.174) * (1 - attractorPull);
      
      const r = scale * (1 + 0.1 * kaprekarSpiral);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + attractorPull * scale * 0.3;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 96, vSegments: 64 })
  },

  digital_root: {
    name: "🔢 Digital Root - dr(n) = 1 + (n-1) mod 9",
    description: "Modulo-9 invariance creating cyclic core identity",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // 9-fold cyclic pattern (digital root cycles 1-9)
      const cyclicPattern = Math.cos(theta * 9) * 0.12;
      const rootWave = Math.sin(phi * 9) * 0.08;
      
      const r = scale * (1 + cyclicPattern + rootWave);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  cyclic_142857: {
    name: "🔁 Cyclic 142857 - 1/7 Repeating Orbit",
    description: "Perfect repeating decimal orbit under multiplication mod 7",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // 7-fold cyclic symmetry (142857 has period 6, divisor 7)
      const cyclicOrbit = Math.cos(theta * 7) * 0.15;
      const orbitTrail = Math.sin(theta * 6 - phi * 2) * 0.1;
      
      const r = scale * (1 + cyclicOrbit + orbitTrail);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  armstrong_numbers: {
    name: "💪 Armstrong Numbers - Self-Sum-of-Powers",
    description: "n = Σ(digit^k) fixed-point symmetry (153 = 1³+5³+3³)",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Armstrong pattern: power-law spikes
      const powerSpikes = Math.pow(Math.abs(Math.sin(theta * 5)), 3) * 0.2;
      const selfReference = Math.cos(theta * 3) * Math.cos(phi * 3) * 0.1;
      
      const r = scale * (1 + powerSpikes + selfReference);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  }
};

// ============================================================================
// 5️⃣ CHAOTIC PATTERNS (3 shapes)
// Iterative and orbital dynamics
// ============================================================================

const CHAOTIC_PATTERNS: Record<string, ParametricSurface> = {

  collatz_map: {
    name: "🌪️ Collatz Map - 3n+1 Attractor Curves",
    description: "Chaotic halving and tripling converging to universal attractor",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const chaos = params.e ?? 1;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Collatz-like branching: odd/even split
      const n = Math.floor(v * 20) + 1;
      const collatzBranch = (n % 2 === 0) ? 0.5 : 1.5;
      const chaoticWave = Math.sin(theta * n * 0.3) * chaos * 0.2;
      
      const r = scale * collatzBranch * (1 + chaoticWave);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * (0.5 + 0.5 * collatzBranch);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 1, uSegments: 128, vSegments: 64 })
  },

  recaman_sequence: {
    name: "🎵 Recamán Sequence - Harmonic Leap Arches",
    description: "Jumps forward or back by n, creating arch loops",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const archHeight = params.e ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Recamán-like arches: alternating leaps
      const n = v * 15;
      const leap = Math.abs(Math.sin(n * 0.7)) * archHeight;
      const archPattern = Math.sin(theta * 5) * leap * 0.2;
      
      const r = scale * (1 + archPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) + leap * 0.3 * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 2, uSegments: 96, vSegments: 64 })
  },

};

// ============================================================================
// 6️⃣ APERIODIC SYMMETRY SEQUENCES (3 shapes)
// Never-repeating symmetric patterns
// ============================================================================

const APERIODIC_PATTERNS: Record<string, ParametricSurface> = {

  thue_morse: {
    name: "📊 Thue-Morse - Bitwise Symmetric Texture",
    description: "Start 0, flip bits and append: 0,01,0110,01101001...",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Thue-Morse pattern: popcount parity
      const n = Math.floor(u * 32) + Math.floor(v * 32) * 32;
      let count = 0;
      let temp = n;
      while (temp > 0) { count += temp & 1; temp >>= 1; }
      const thueMorse = (count % 2 === 0) ? 1 : -1;
      
      const texturePattern = thueMorse * 0.1;
      const r = scale * (1 + texturePattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  l_system_fractal: {
    name: "🌿 L-System - Recursive Symbol Growth",
    description: "F → F+F--F+F recursive fractal plants and spirals",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const iterations = params.e ?? 3;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // L-system branching pattern
      const branchAngle = Math.PI / 6;
      let pattern = 0;
      for (let i = 1; i <= iterations; i++) {
        pattern += Math.sin(theta * Math.pow(2, i) + branchAngle * i) / i;
      }
      pattern *= 0.1;
      
      const r = scale * (1 + pattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 3, uSegments: 128, vSegments: 64 })
  },

  rudin_shapiro: {
    name: "📉 Rudin-Shapiro - Anti-Correlated Fractal",
    description: "a(n) = (-1)^s(n) where s(n) = overlapping 11-bit pairs",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Rudin-Shapiro: count overlapping 11 pairs
      const n = Math.floor(u * 64) + Math.floor(v * 64) * 64;
      let pairs = 0;
      let temp = n;
      let prev = 0;
      while (temp > 0) {
        const bit = temp & 1;
        if (prev === 1 && bit === 1) pairs++;
        prev = bit;
        temp >>= 1;
      }
      const rudinShapiro = (pairs % 2 === 0) ? 1 : -1;
      
      const antiPattern = rudinShapiro * 0.08;
      const r = scale * (1 + antiPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  }
};

// ============================================================================
// 7️⃣ EXPANSION & MODULAR CYCLE PATTERNS (3 shapes)
// ============================================================================

const MODULAR_PATTERNS: Record<string, ParametricSurface> = {

  egyptian_fractions: {
    name: "🏺 Egyptian Fractions - Harmonic Decomposition",
    description: "p/q = 1/a + 1/b + ... splitting energy",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Egyptian fraction pattern: harmonic series bumps
      let harmonic = 0;
      for (let k = 1; k <= 6; k++) {
        harmonic += Math.sin(theta * k) / k;
      }
      harmonic *= 0.1;
      
      const r = scale * (1 + harmonic);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  modular_cycles: {
    name: "🔄 Modular Cycles - n mod m Loops",
    description: "Residues form loops, grids, and repeating sequences",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const modulus = Math.max(2, Math.floor(params.e ?? 7));
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Modular cycle pattern
      const n = Math.floor(u * 50);
      const residue = n % modulus;
      const cyclePattern = Math.cos(theta * modulus) * (residue / modulus) * 0.15;
      
      const r = scale * (1 + cyclePattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 7, uSegments: 128, vSegments: 64 })
  },

  repeating_decimals: {
    name: "♾️ Repeating Decimals - Period Structure",
    description: "period(1/p) = min k: 10^k ≡ 1 (mod p)",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const prime = Math.max(3, Math.floor(params.e ?? 7));
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Repeating decimal period pattern
      const period = prime - 1; // Approximation for full reptend primes
      const decimalWave = Math.sin(theta * period) * 0.12;
      const periodBands = Math.cos(phi * period * 0.5) * 0.08;
      
      const r = scale * (1 + decimalWave + periodBands);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 7, uSegments: 128, vSegments: 64 })
  }
};

// ============================================================================
// 8️⃣ EXPONENTIAL / CONSTANT / COSMIC PATTERNS (4 shapes)
// ============================================================================

const EXPONENTIAL_PATTERNS: Record<string, ParametricSurface> = {

  mersenne_form: {
    name: "⚡ Mersenne Form - 2ⁿ - 1 Binary Burst",
    description: "Binary geometric burst pattern",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const exponent = params.e ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Binary burst: 2^n growth
      const burst = Math.pow(2, v * exponent) / Math.pow(2, exponent);
      const binaryPattern = Math.cos(theta * 8) * burst * 0.15;
      
      const r = scale * (1 + binaryPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 5, uSegments: 96, vSegments: 64 })
  },

  repunit_exponential: {
    name: "📈 Repunit Exponential - (10ⁿ-1)/9 Growth",
    description: "Base-10 analog of binary repunits",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Base-10 exponential growth
      const n = v * 6;
      const repunit = (Math.pow(10, n) - 1) / 9;
      const normRepunit = Math.log10(repunit + 1) / 6;
      const growthPattern = Math.sin(theta * 10) * normRepunit * 0.15;
      
      const r = scale * (1 + growthPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  logarithmic_spiral_pattern: {
    name: "🌀 Logarithmic Spiral Pattern - r = e^(kθ)",
    description: "Constant-angle growth: galaxies, shells, storms",
    equation: (u, v, params) => {
      const scale = params.d ?? 3;
      const growthRate = params.e ?? 0.3;
      
      const theta = u * Math.PI * 4; // Multiple turns
      const phi = v * Math.PI;
      
      // Logarithmic spiral: r = e^(k*theta)
      const spiralR = Math.exp(growthRate * theta);
      const normalizedR = spiralR / Math.exp(growthRate * Math.PI * 4);
      
      // Create 3D shell from spiral
      const r = scale * (0.3 + 0.7 * normalizedR);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi) * (1 + 0.5 * normalizedR);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.3, uSegments: 128, vSegments: 64 })
  },

  pi_circle_lattice: {
    name: "🥧 Pi Circle Lattice - C = 2πr",
    description: "Continuous circular symmetry, primary rotation constant",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const harmonics = params.e ?? 3;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Pi-based circular harmonics
      let piPattern = 0;
      for (let h = 1; h <= harmonics; h++) {
        piPattern += Math.sin(theta * Math.PI * h) / h;
      }
      piPattern *= 0.1;
      
      const r = scale * (1 + piPattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 3, uSegments: 128, vSegments: 64 })
  }
};

// ============================================================================
// 9️⃣ TOPOLOGICAL NUMBER PATTERNS (3 shapes)
// ============================================================================

const TOPOLOGICAL_PATTERNS: Record<string, ParametricSurface> = {

  partition_function: {
    name: "🧩 Partition Function - p(n) Integer Sums",
    description: "Ways to sum integers to n: combinatorial surface topology",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Partition-like growth pattern
      const n = v * 20 + 1;
      // Approximation: p(n) ~ exp(π√(2n/3)) / (4n√3)
      const partitionApprox = Math.exp(Math.PI * Math.sqrt(2 * n / 3)) / (4 * n * Math.sqrt(3));
      const normPartition = Math.log(partitionApprox + 1) / 10;
      
      const surfacePattern = Math.sin(theta * 5) * normPartition * 0.2;
      const r = scale * (1 + surfacePattern);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 96, vSegments: 64 })
  },

  knot_invariants: {
    name: "🪢 Knot Invariants - Crossing Patterns",
    description: "Loop topology encoded via crossings and transformations",
    equation: (u, v, params) => {
      const scale = params.d ?? 4;
      const crossings = params.e ?? 3;
      
      const theta = u * Math.PI * 2;
      const t = v * Math.PI * 2;
      
      // Trefoil-like knot invariant pattern
      const knotR = scale * (0.5 + 0.3 * Math.cos(crossings * theta));
      const x = knotR * Math.cos(theta) * (1 + 0.5 * Math.cos(t));
      const y = knotR * Math.sin(theta) * (1 + 0.5 * Math.cos(t));
      const z = scale * 0.5 * Math.sin(t) + scale * 0.3 * Math.sin(crossings * theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 3, uSegments: 128, vSegments: 64 })
  },

  polytope_coordinates: {
    name: "🔷 Polytope Coordinates - n-Dimensional Vectors",
    description: "Higher-dimensional geometry encoded in numeric coordinate sets",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const dimensions = Math.max(3, Math.floor(params.e ?? 4));
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Multi-dimensional projection pattern
      let projection = 0;
      for (let d = 1; d <= dimensions; d++) {
        projection += Math.cos(theta * d) * Math.sin(phi * d) / d;
      }
      projection *= 0.1;
      
      const r = scale * (1 + projection);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 4, uSegments: 96, vSegments: 64 })
  }
};

// ============================================================================
// 🔟 BITWISE / BINARY PATTERNS (3 shapes)
// ============================================================================

const BITWISE_PATTERNS: Record<string, ParametricSurface> = {

  gray_code: {
    name: "🔀 Gray Code - G(n) = n ⊕ (n>>1)",
    description: "One-bit-change minimal transitions, smooth binary paths",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Gray code pattern: minimal bit transitions
      const n = Math.floor(u * 64);
      const gray = n ^ (n >> 1);
      const grayNorm = gray / 64;
      const smoothPath = Math.sin(theta * 6 + grayNorm * Math.PI) * 0.1;
      
      const r = scale * (1 + smoothPath);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, uSegments: 128, vSegments: 64 })
  },

  binary_repunits: {
    name: "🔢 Binary Repunits - 111...1₂ = 2ⁿ - 1",
    description: "Binary symmetry analogous to Mersenne primes",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const bits = params.e ?? 8;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Binary repunit: all 1s in binary
      const n = Math.floor(v * bits);
      const repunit = Math.pow(2, n) - 1;
      const normRepunit = repunit / (Math.pow(2, bits) - 1);
      const binaryWave = Math.cos(theta * 8) * normRepunit * 0.15;
      
      const r = scale * (1 + binaryWave);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 8, uSegments: 96, vSegments: 64 })
  },

  xor_maps: {
    name: "⊕ XOR Maps - f(n) = n ⊕ k",
    description: "Structured toggling patterns via exclusive OR",
    equation: (u, v, params) => {
      const scale = params.d ?? 5;
      const xorKey = Math.floor(params.e ?? 42);
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // XOR pattern visualization
      const n = Math.floor(u * 128) + Math.floor(v * 128) * 128;
      const xored = n ^ xorKey;
      const popcount = (xored).toString(2).split('1').length - 1;
      const xorPattern = (popcount / 14) * 0.15; // Max ~14 bits
      
      const r = scale * (1 + xorPattern * Math.sin(theta * 4));
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 5, e: 42, uSegments: 128, vSegments: 64 })
  }
};

// ============================================================================
// EXPORT: Unified Dmension Pattern Codex
// ============================================================================

export const DMENSION_PATTERN_CODEX: Record<string, ParametricSurface> = {
  // 1️⃣ Prime Patterns (5)
  ...PRIME_PATTERNS,
  // 2️⃣ Harmonic Patterns (4)
  ...HARMONIC_PATTERNS,
  // 3️⃣ Geometric Number Patterns (6)
  ...GEOMETRIC_NUMBER_PATTERNS,
  // 4️⃣ Digital Patterns (6)
  ...DIGITAL_PATTERNS,
  // 5️⃣ Chaotic Patterns (3)
  ...CHAOTIC_PATTERNS,
  // 6️⃣ Aperiodic Patterns (3)
  ...APERIODIC_PATTERNS,
  // 7️⃣ Modular Patterns (3)
  ...MODULAR_PATTERNS,
  // 8️⃣ Exponential Patterns (4)
  ...EXPONENTIAL_PATTERNS,
  // 9️⃣ Topological Patterns (3)
  ...TOPOLOGICAL_PATTERNS,
  // 🔟 Bitwise Patterns (3)
  ...BITWISE_PATTERNS
};

// Category definition for shape browser
export const DMENSION_PATTERN_CODEX_CATEGORY = {
  id: 'dmension_pattern_codex',
  name: '🔱 Dmension Pattern Codex',
  icon: '🔱',
  description: 'Master collection of 40 mathematical pattern visualizations: prime distributions, harmonic ratios, figurate numbers, chaotic attractors, aperiodic sequences, modular cycles, and bitwise transformations. Full 360° parametric surfaces.',
  engineDynamics: {
    primaryType: 'fractional' as const,
    influenceFactors: ['prime numbers', 'golden ratio', 'chaos theory', 'modular arithmetic', 'bitwise operations']
  },
  shapes: Object.keys(DMENSION_PATTERN_CODEX)
};

// Pattern group metadata for UI
export const PATTERN_GROUPS = [
  { id: 'prime', name: '1️⃣ Prime Patterns', count: 5, shapes: Object.keys(PRIME_PATTERNS) },
  { id: 'harmonic', name: '2️⃣ Harmonic/Golden', count: 4, shapes: Object.keys(HARMONIC_PATTERNS) },
  { id: 'geometric', name: '3️⃣ Geometric Numbers', count: 6, shapes: Object.keys(GEOMETRIC_NUMBER_PATTERNS) },
  { id: 'digital', name: '4️⃣ Digital/Mirror', count: 6, shapes: Object.keys(DIGITAL_PATTERNS) },
  { id: 'chaotic', name: '5️⃣ Chaotic', count: 3, shapes: Object.keys(CHAOTIC_PATTERNS) },
  { id: 'aperiodic', name: '6️⃣ Aperiodic', count: 3, shapes: Object.keys(APERIODIC_PATTERNS) },
  { id: 'modular', name: '7️⃣ Modular Cycles', count: 3, shapes: Object.keys(MODULAR_PATTERNS) },
  { id: 'exponential', name: '8️⃣ Exponential/Cosmic', count: 4, shapes: Object.keys(EXPONENTIAL_PATTERNS) },
  { id: 'topological', name: '9️⃣ Topological', count: 3, shapes: Object.keys(TOPOLOGICAL_PATTERNS) },
  { id: 'bitwise', name: '🔟 Bitwise/Binary', count: 3, shapes: Object.keys(BITWISE_PATTERNS) }
];

console.log(`🔱 Dmension Pattern Codex loaded: ${Object.keys(DMENSION_PATTERN_CODEX).length} patterns across ${PATTERN_GROUPS.length} groups`);
