/**
 * Perspective Mathematics Engine
 * 
 * "The universe is infinite geometry - each number base, each plane, 
 * each perspective reveals a unique piece of π"
 * 
 * This engine implements the philosophy that:
 * - Internal geometry is as important as external topology
 * - All math formulas contribute to infinite possible shapes
 * - Different bases (binary, decimal, φ, π, e) reveal different cosmic truths
 * - Each plane/perspective offers one piece of the puzzle
 */

// Uses internal algorithm utilities for advanced mathematical operations

// Universal Mathematical Constants with Cosmic Precision
export const COSMIC_CONSTANTS = {
  PI: 3.14159265358979323846264338327950288419716939937510,
  PHI: 1.61803398874989484820458683436563811772030917980576,
  E: 2.71828182845904523536028747135266249775724709369995,
  SQRT2: 1.41421356237309504880168872420969807856967187537694,
  SQRT3: 1.73205080756887729352744634150587236694280525381038,
  SQRT5: 2.23606797749978969640917366873127623544061835961152,
  PLANCK: 6.62607015e-34,
  FINE_STRUCTURE: 0.0072973525693,
  GOLDEN_ANGLE: 2.39996322972865332223155550663361385188228656453242,
};

// Number Base Systems - Each reveals different cosmic patterns
export interface BaseSystem {
  name: string;
  base: number;
  symbol: string;
  cosmicMeaning: string;
  convert: (decimal: number) => string;
  toDecimal: (value: string) => number;
  geometricSignificance: string;
}

export const BASE_SYSTEMS: Record<string, BaseSystem> = {
  binary: {
    name: 'Binary',
    base: 2,
    symbol: '₂',
    cosmicMeaning: 'Duality - Light/Dark, Wave/Particle, 0/1',
    convert: (n: number) => Math.floor(n).toString(2),
    toDecimal: (s: string) => parseInt(s, 2),
    geometricSignificance: 'Defines all digital geometry, quantum states, spin orientations'
  },
  ternary: {
    name: 'Ternary',
    base: 3,
    symbol: '₃',
    cosmicMeaning: 'Trinity - Past/Present/Future, Matter/Energy/Space',
    convert: (n: number) => Math.floor(n).toString(3),
    toDecimal: (s: string) => parseInt(s, 3),
    geometricSignificance: 'Triangular tessellations, 3-body dynamics, color spaces'
  },
  quaternary: {
    name: 'Quaternary',
    base: 4,
    symbol: '₄',
    cosmicMeaning: 'Four Forces - Gravity, EM, Strong, Weak',
    convert: (n: number) => Math.floor(n).toString(4),
    toDecimal: (s: string) => parseInt(s, 4),
    geometricSignificance: 'DNA base pairs, quaternion rotations, spacetime dimensions'
  },
  quinary: {
    name: 'Quinary',
    base: 5,
    symbol: '₅',
    cosmicMeaning: 'Pentagonal Symmetry - Life, Phi, Five Platonic Solids',
    convert: (n: number) => Math.floor(n).toString(5),
    toDecimal: (s: string) => parseInt(s, 5),
    geometricSignificance: 'Pentagon/pentagram, golden ratio, organic forms'
  },
  senary: {
    name: 'Senary',
    base: 6,
    symbol: '₆',
    cosmicMeaning: 'Hexagonal Perfection - Honeycomb, Carbon, Snowflakes',
    convert: (n: number) => Math.floor(n).toString(6),
    toDecimal: (s: string) => parseInt(s, 6),
    geometricSignificance: 'Most efficient packing, graphene structure, benzene rings'
  },
  octal: {
    name: 'Octal',
    base: 8,
    symbol: '₈',
    cosmicMeaning: 'Octave - Musical harmony, 8-fold path, cubic symmetry',
    convert: (n: number) => Math.floor(n).toString(8),
    toDecimal: (s: string) => parseInt(s, 8),
    geometricSignificance: 'Octahedron, cube vertices, musical intervals'
  },
  decimal: {
    name: 'Decimal',
    base: 10,
    symbol: '₁₀',
    cosmicMeaning: 'Human Scale - Ten fingers, decimal system of measurement',
    convert: (n: number) => n.toString(10),
    toDecimal: (s: string) => parseFloat(s),
    geometricSignificance: 'Standard scientific notation, human-scale geometry'
  },
  duodecimal: {
    name: 'Duodecimal',
    base: 12,
    symbol: '₁₂',
    cosmicMeaning: 'Cosmic Cycles - 12 months, zodiac signs, hours',
    convert: (n: number) => {
      const digits = '0123456789AB';
      let result = '';
      let num = Math.floor(Math.abs(n));
      if (num === 0) return '0';
      while (num > 0) {
        result = digits[num % 12] + result;
        num = Math.floor(num / 12);
      }
      return n < 0 ? '-' + result : result;
    },
    toDecimal: (s: string) => {
      const digits = '0123456789AB';
      return s.split('').reduce((acc, char) => acc * 12 + digits.indexOf(char.toUpperCase()), 0);
    },
    geometricSignificance: 'Dodecahedron, icosahedron, celestial mechanics'
  },
  hexadecimal: {
    name: 'Hexadecimal',
    base: 16,
    symbol: '₁₆',
    cosmicMeaning: 'Digital Universe - 16 million colors, 4D hypercube vertices',
    convert: (n: number) => Math.floor(n).toString(16).toUpperCase(),
    toDecimal: (s: string) => parseInt(s, 16),
    geometricSignificance: 'Tesseract vertices, RGB color space, memory addressing'
  },
  phi: {
    name: 'Phi-nary (Golden)',
    base: COSMIC_CONSTANTS.PHI,
    symbol: 'φ',
    cosmicMeaning: 'Golden Ratio - Self-similar growth, spirals, beauty',
    convert: (n: number) => {
      const phi = COSMIC_CONSTANTS.PHI;
      let result = [];
      let remaining = Math.abs(n);
      for (let power = 10; power >= -10; power--) {
        const phiPower = Math.pow(phi, power);
        if (remaining >= phiPower * 0.999) {
          result.push(`φ^${power}`);
          remaining -= phiPower;
        }
      }
      return result.length > 0 ? result.join(' + ') : '0';
    },
    toDecimal: (s: string) => {
      const phi = COSMIC_CONSTANTS.PHI;
      const matches = s.match(/φ\^(-?\d+)/g) || [];
      return matches.reduce((sum, m) => {
        const power = parseInt(m.replace('φ^', ''));
        return sum + Math.pow(phi, power);
      }, 0);
    },
    geometricSignificance: 'Fibonacci spirals, phyllotaxis, nautilus shells'
  },
  pi: {
    name: 'Pi-ary (Circular)',
    base: COSMIC_CONSTANTS.PI,
    symbol: 'π',
    cosmicMeaning: 'Circularity - Cycles, orbits, waves, rotation',
    convert: (n: number) => {
      const pi = COSMIC_CONSTANTS.PI;
      const coefficient = n / pi;
      if (Math.abs(coefficient - Math.round(coefficient)) < 0.001) {
        return `${Math.round(coefficient)}π`;
      }
      return `${coefficient.toFixed(6)}π`;
    },
    toDecimal: (s: string) => {
      const match = s.match(/(-?[\d.]+)π/);
      return match ? parseFloat(match[1]) * COSMIC_CONSTANTS.PI : 0;
    },
    geometricSignificance: 'All circular/spherical geometry, wave functions, orbits'
  },
  e: {
    name: 'Natural (Euler)',
    base: COSMIC_CONSTANTS.E,
    symbol: 'e',
    cosmicMeaning: 'Natural Growth - Exponentials, compound interest, decay',
    convert: (n: number) => {
      if (n <= 0) return 'undefined';
      const lnN = Math.log(n);
      return `e^${lnN.toFixed(6)}`;
    },
    toDecimal: (s: string) => {
      const match = s.match(/e\^(-?[\d.]+)/);
      return match ? Math.exp(parseFloat(match[1])) : 0;
    },
    geometricSignificance: 'Exponential spirals, radioactive decay curves, population growth'
  }
};

// Perspective Planes - Each offers a unique view of reality
export interface PerspectivePlane {
  name: string;
  dimensions: number;
  normalVector: [number, number, number];
  cosmicMeaning: string;
  transform: (x: number, y: number, z: number) => [number, number, number];
  inverseTransform: (x: number, y: number, z: number) => [number, number, number];
}

export const PERSPECTIVE_PLANES: Record<string, PerspectivePlane> = {
  xy: {
    name: 'XY Plane (Horizontal)',
    dimensions: 2,
    normalVector: [0, 0, 1],
    cosmicMeaning: 'The ground plane - foundation of physical reality',
    transform: (x, y, z) => [x, y, 0],
    inverseTransform: (x, y, _) => [x, y, 0]
  },
  xz: {
    name: 'XZ Plane (Frontal)',
    dimensions: 2,
    normalVector: [0, 1, 0],
    cosmicMeaning: 'The wall plane - barriers and passages',
    transform: (x, y, z) => [x, 0, z],
    inverseTransform: (x, _, z) => [x, 0, z]
  },
  yz: {
    name: 'YZ Plane (Sagittal)',
    dimensions: 2,
    normalVector: [1, 0, 0],
    cosmicMeaning: 'The side plane - left/right symmetry of life',
    transform: (x, y, z) => [0, y, z],
    inverseTransform: (_, y, z) => [0, y, z]
  },
  xyz_diagonal: {
    name: 'Diagonal Plane (111)',
    dimensions: 2,
    normalVector: [1/Math.sqrt(3), 1/Math.sqrt(3), 1/Math.sqrt(3)],
    cosmicMeaning: 'Equal contribution from all dimensions - balance',
    transform: (x, y, z) => {
      const sum = (x + y + z) / 3;
      return [x - sum, y - sum, z - sum];
    },
    inverseTransform: (x, y, z) => [x, y, z]
  },
  golden_spiral: {
    name: 'Golden Spiral Plane',
    dimensions: 2,
    normalVector: [0, COSMIC_CONSTANTS.PHI, 1],
    cosmicMeaning: 'The plane of natural growth and beauty',
    transform: (x, y, z) => {
      const phi = COSMIC_CONSTANTS.PHI;
      const r = Math.sqrt(x*x + y*y + z*z);
      const theta = Math.atan2(y, x);
      const goldenTheta = theta * phi;
      return [r * Math.cos(goldenTheta), r * Math.sin(goldenTheta), z / phi];
    },
    inverseTransform: (x, y, z) => {
      const phi = COSMIC_CONSTANTS.PHI;
      const theta = Math.atan2(y, x) / phi;
      const r = Math.sqrt(x*x + y*y);
      return [r * Math.cos(theta), r * Math.sin(theta), z * phi];
    }
  },
  time_cone: {
    name: 'Light Cone (Spacetime)',
    dimensions: 3,
    normalVector: [0, 0, 1],
    cosmicMeaning: 'The boundary between past and future - causality',
    transform: (x, y, z) => {
      const t = z; // z as time dimension
      const r = Math.sqrt(x*x + y*y);
      const coneRadius = Math.abs(t);
      const scale = coneRadius > 0 ? Math.min(r / coneRadius, 1) : 0;
      return [x * scale, y * scale, t];
    },
    inverseTransform: (x, y, t) => [x, y, t]
  },
  hyperbolic: {
    name: 'Hyperbolic Plane',
    dimensions: 2,
    normalVector: [0, 0, 1],
    cosmicMeaning: 'Infinite expansion - the shape of the universe',
    transform: (x, y, z) => {
      const r = Math.sqrt(x*x + y*y);
      const scale = r > 0 ? Math.tanh(r) / r : 1;
      return [x * scale, y * scale, z];
    },
    inverseTransform: (x, y, z) => {
      const r = Math.sqrt(x*x + y*y);
      const scale = r > 0 ? Math.atanh(Math.min(r, 0.999)) / r : 1;
      return [x * scale, y * scale, z];
    }
  },
  spherical: {
    name: 'Spherical Surface',
    dimensions: 2,
    normalVector: [0, 0, 1],
    cosmicMeaning: 'Unity and completeness - all points equidistant from center',
    transform: (x, y, z) => {
      const r = Math.sqrt(x*x + y*y + z*z) || 1;
      return [x/r, y/r, z/r];
    },
    inverseTransform: (x, y, z) => [x, y, z]
  }
};

// Cosmic Precision Levels - Each decimal place reveals more truth
export interface PrecisionLevel {
  decimals: number;
  name: string;
  scale: string;
  cosmicMeaning: string;
  physicalExample: string;
}

export const PRECISION_LEVELS: PrecisionLevel[] = [
  { decimals: 0, name: 'Unity', scale: '1', cosmicMeaning: 'Wholeness, the One', physicalExample: 'One atom, one galaxy' },
  { decimals: 1, name: 'Deci', scale: '10⁻¹', cosmicMeaning: 'First division of unity', physicalExample: 'Human hand span' },
  { decimals: 2, name: 'Centi', scale: '10⁻²', cosmicMeaning: 'Hundred-fold detail', physicalExample: 'Fingernail thickness' },
  { decimals: 3, name: 'Milli', scale: '10⁻³', cosmicMeaning: 'Thousand-fold precision', physicalExample: 'Thickness of paper' },
  { decimals: 6, name: 'Micro', scale: '10⁻⁶', cosmicMeaning: 'Cellular scale of life', physicalExample: 'Bacteria, red blood cells' },
  { decimals: 9, name: 'Nano', scale: '10⁻⁹', cosmicMeaning: 'Molecular architecture', physicalExample: 'DNA helix width' },
  { decimals: 12, name: 'Pico', scale: '10⁻¹²', cosmicMeaning: 'Atomic bond lengths', physicalExample: 'Wavelength of gamma rays' },
  { decimals: 15, name: 'Femto', scale: '10⁻¹⁵', cosmicMeaning: 'Nuclear diameter', physicalExample: 'Proton radius' },
  { decimals: 18, name: 'Atto', scale: '10⁻¹⁸', cosmicMeaning: 'Quark confinement', physicalExample: 'Time for light to cross atom' },
  { decimals: 21, name: 'Zepto', scale: '10⁻²¹', cosmicMeaning: 'Quantum foam scale', physicalExample: 'Neutrino mass equivalent' },
  { decimals: 24, name: 'Yocto', scale: '10⁻²⁴', cosmicMeaning: 'Approaching Planck scale', physicalExample: 'Approaching limits of measurement' },
  { decimals: 35, name: 'Planck', scale: '10⁻³⁵', cosmicMeaning: 'The quantum of space itself', physicalExample: 'Planck length - smallest meaningful distance' }
];

// Formula-to-Shape Relationships
export interface FormulaShapeMapping {
  formula: string;
  description: string;
  shapes: string[];
  cosmicPrinciple: string;
}

export const FORMULA_SHAPE_MAPPINGS: FormulaShapeMapping[] = [
  {
    formula: 'x² + y² + z² = r²',
    description: 'Sphere equation - perfect symmetry in all directions',
    shapes: ['sphere', 'ellipsoid', 'orbital', 'atom'],
    cosmicPrinciple: 'Isotropy - the universe looks the same in all directions'
  },
  {
    formula: 'z = sin(x)cos(y)',
    description: 'Wave interference - the foundation of all matter',
    shapes: ['wave', 'interference_pattern', 'quantum_wave'],
    cosmicPrinciple: 'Wave-particle duality - matter is frozen light'
  },
  {
    formula: 'r = a(1 - e·cos(θ))',
    description: 'Conic sections - paths of celestial bodies',
    shapes: ['ellipse', 'parabola', 'hyperbola', 'orbit'],
    cosmicPrinciple: 'Gravity curves spacetime into conic sections'
  },
  {
    formula: 'Fₙ = Fₙ₋₁ + Fₙ₋₂',
    description: 'Fibonacci sequence - growth pattern of life',
    shapes: ['fibonacci_spiral', 'golden_spiral', 'phyllotaxis'],
    cosmicPrinciple: 'Life grows by adding the past to the present'
  },
  {
    formula: 'ds² = -c²dt² + dx² + dy² + dz²',
    description: 'Minkowski metric - the shape of spacetime',
    shapes: ['light_cone', 'worldline', 'spacetime_interval'],
    cosmicPrinciple: 'Space and time are woven together as spacetime'
  },
  {
    formula: 'ψ = Ae^(i(kx - ωt))',
    description: 'Wave function - probability amplitude of existence',
    shapes: ['quantum_state', 'probability_cloud', 'orbital'],
    cosmicPrinciple: 'Reality is probability until observed'
  },
  {
    formula: 'E = mc²',
    description: 'Mass-energy equivalence - matter is concentrated energy',
    shapes: ['photon', 'electron', 'annihilation'],
    cosmicPrinciple: 'Mass and energy are the same thing'
  },
  {
    formula: '∇²φ = 4πGρ',
    description: 'Poisson equation - how mass creates gravity',
    shapes: ['gravitational_well', 'potential_field', 'geodesic'],
    cosmicPrinciple: 'Mass tells spacetime how to curve'
  },
  {
    formula: 'S = k·ln(W)',
    description: 'Boltzmann entropy - the arrow of time',
    shapes: ['entropy_flow', 'heat_death', 'information'],
    cosmicPrinciple: 'Disorder always increases - the universe has a direction'
  },
  {
    formula: 'eiπ + 1 = 0',
    description: 'Euler identity - unity of fundamental constants',
    shapes: ['euler_spiral', 'complex_plane', 'unity'],
    cosmicPrinciple: 'All of mathematics is connected at the deepest level'
  }
];

// Internal Geometry ↔ External Topology Relationships
export interface GeometryTopologyBridge {
  internalProperty: string;
  externalManifestation: string;
  mathematicalLink: string;
  example: string;
}

export const GEOMETRY_TOPOLOGY_BRIDGES: GeometryTopologyBridge[] = [
  {
    internalProperty: 'Gaussian Curvature (K)',
    externalManifestation: 'Surface bending behavior',
    mathematicalLink: 'K = κ₁ × κ₂ (product of principal curvatures)',
    example: 'Sphere (K>0), Saddle (K<0), Cylinder (K=0)'
  },
  {
    internalProperty: 'Euler Characteristic (χ)',
    externalManifestation: 'Number of holes in surface',
    mathematicalLink: 'χ = V - E + F = 2 - 2g (g = genus)',
    example: 'Sphere χ=2, Torus χ=0, Double torus χ=-2'
  },
  {
    internalProperty: 'Metric Tensor (gᵢⱼ)',
    externalManifestation: 'Distance measurement on surface',
    mathematicalLink: 'ds² = gᵢⱼdxⁱdxʲ',
    example: 'Flat space vs curved spacetime'
  },
  {
    internalProperty: 'Christoffel Symbols (Γ)',
    externalManifestation: 'Parallel transport paths',
    mathematicalLink: 'Γⁱⱼₖ = ½gⁱˡ(∂ⱼgₖˡ + ∂ₖgⱼˡ - ∂ˡgⱼₖ)',
    example: 'Why objects curve in gravity'
  },
  {
    internalProperty: 'Riemann Tensor (R)',
    externalManifestation: 'Tidal forces, spacetime curvature',
    mathematicalLink: 'R = dΓ + Γ∧Γ',
    example: 'Spaghettification near black holes'
  },
  {
    internalProperty: 'Holonomy Group',
    externalManifestation: 'What happens when you walk in a loop',
    mathematicalLink: 'Rotation accumulated over closed path',
    example: 'Triangle on sphere has angle sum > 180°'
  }
];

// Generate shape from any base system
export function generateBaseShape(
  value: number,
  base: BaseSystem,
  resolution: number = 64
): { positions: number[], normals: number[], uvs: number[] } {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  
  const baseValue = base.base;
  const converted = base.convert(value);
  
  // Create geometry based on the base's characteristics
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const u = (i / resolution) * Math.PI * 2;
      const v = (j / resolution) * Math.PI;
      
      // Modulate radius by base
      const baseModulation = 1 + 0.3 * Math.sin(u * baseValue) * Math.cos(v * baseValue);
      const r = baseModulation;
      
      // Spherical to Cartesian with base modulation
      const x = r * Math.sin(v) * Math.cos(u);
      const y = r * Math.sin(v) * Math.sin(u);
      const z = r * Math.cos(v);
      
      positions.push(x, y, z);
      
      // Compute normal (radial for sphere-like shapes)
      const len = Math.sqrt(x*x + y*y + z*z) || 1;
      normals.push(x/len, y/len, z/len);
      
      // UV coordinates
      uvs.push(i / resolution, j / resolution);
    }
  }
  
  return { positions, normals, uvs };
}

// Transform point through perspective plane
export function applyPerspective(
  point: [number, number, number],
  plane: PerspectivePlane
): [number, number, number] {
  return plane.transform(point[0], point[1], point[2]);
}

// Get precision level for a value
export function getPrecisionLevel(value: number): PrecisionLevel {
  if (value === 0) return PRECISION_LEVELS[0];
  
  const absValue = Math.abs(value);
  const orderOfMagnitude = Math.floor(Math.log10(absValue));
  const decimalsNeeded = -orderOfMagnitude;
  
  // Find the appropriate precision level
  for (let i = PRECISION_LEVELS.length - 1; i >= 0; i--) {
    if (decimalsNeeded >= PRECISION_LEVELS[i].decimals) {
      return PRECISION_LEVELS[i];
    }
  }
  
  return PRECISION_LEVELS[0];
}

// Express a value in multiple bases
export function multiBaseExpression(value: number): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const [key, base] of Object.entries(BASE_SYSTEMS)) {
    try {
      result[key] = `${base.convert(value)}${base.symbol}`;
    } catch (e) {
      result[key] = 'undefined';
    }
  }
  
  return result;
}

// Find formulas that generate a specific shape type
export function getFormulasForShape(shapeName: string): FormulaShapeMapping[] {
  return FORMULA_SHAPE_MAPPINGS.filter(mapping => 
    mapping.shapes.some(s => shapeName.toLowerCase().includes(s.toLowerCase()))
  );
}

// Calculate the "cosmic weight" of a number based on its relationship to fundamental constants
export function cosmicWeight(value: number): { constant: string; relationship: string; significance: number } {
  const constants = [
    { name: 'π', value: COSMIC_CONSTANTS.PI },
    { name: 'φ', value: COSMIC_CONSTANTS.PHI },
    { name: 'e', value: COSMIC_CONSTANTS.E },
    { name: '√2', value: COSMIC_CONSTANTS.SQRT2 },
    { name: '√3', value: COSMIC_CONSTANTS.SQRT3 },
    { name: '√5', value: COSMIC_CONSTANTS.SQRT5 },
  ];
  
  let bestMatch = { constant: 'none', relationship: 'unique', significance: 0 };
  
  for (const c of constants) {
    // Check for multiples
    const ratio = value / c.value;
    if (Math.abs(ratio - Math.round(ratio)) < 0.001 && Math.abs(ratio) < 100) {
      const sig = 1 - Math.abs(ratio - Math.round(ratio));
      if (sig > bestMatch.significance) {
        bestMatch = { constant: c.name, relationship: `${Math.round(ratio)} × ${c.name}`, significance: sig };
      }
    }
    
    // Check for fractions
    const inverse = c.value / value;
    if (Math.abs(inverse - Math.round(inverse)) < 0.001 && Math.abs(inverse) < 100 && Math.abs(inverse) > 1) {
      const sig = 1 - Math.abs(inverse - Math.round(inverse));
      if (sig > bestMatch.significance) {
        bestMatch = { constant: c.name, relationship: `${c.name} / ${Math.round(inverse)}`, significance: sig };
      }
    }
    
    // Check for powers
    if (value > 0 && c.value > 0) {
      const logRatio = Math.log(value) / Math.log(c.value);
      if (Math.abs(logRatio - Math.round(logRatio)) < 0.01 && Math.abs(logRatio) < 10) {
        const sig = 1 - Math.abs(logRatio - Math.round(logRatio));
        if (sig > bestMatch.significance) {
          bestMatch = { constant: c.name, relationship: `${c.name}^${Math.round(logRatio)}`, significance: sig };
        }
      }
    }
  }
  
  return bestMatch;
}

// Generate the "Piece of π" - a unique perspective on a shape
export function generatePieceOfPi(
  shapeId: string,
  parameters: { a: number; b: number; c: number; d?: number; e?: number; f?: number },
  perspectiveIndex: number = 0
): {
  perspective: PerspectivePlane;
  base: BaseSystem;
  formula: FormulaShapeMapping | null;
  cosmicInsight: string;
  precisionLevel: PrecisionLevel;
} {
  const perspectives = Object.values(PERSPECTIVE_PLANES);
  const bases = Object.values(BASE_SYSTEMS);
  
  // Safe index calculation - handle negative values
  const safeIndex = Math.abs(Math.floor(parameters.a || 0)) % bases.length;
  const perspectiveIdx = Math.abs(perspectiveIndex) % perspectives.length;
  
  const perspective = perspectives[perspectiveIdx] || perspectives[0];
  const base = bases[safeIndex] || bases[0];
  
  const formulas = getFormulasForShape(shapeId);
  const formula = formulas.length > 0 ? formulas[0] : null;
  
  const combinedValue = (parameters.a || 0) + (parameters.b || 0) * COSMIC_CONSTANTS.PHI + (parameters.c || 0) * COSMIC_CONSTANTS.PI;
  const precisionLevel = getPrecisionLevel(1 / Math.max(Math.abs(combinedValue), 0.001));
  
  const cosmic = cosmicWeight(combinedValue);
  const cosmicInsight = cosmic.significance > 0.5 
    ? `This configuration resonates with ${cosmic.relationship}, suggesting ${perspective?.cosmicMeaning?.toLowerCase() || 'harmony'}`
    : `Unique configuration in ${perspective?.name || 'perspective'}, revealing ${base?.cosmicMeaning?.toLowerCase() || 'mathematical truth'}`;
  
  return {
    perspective,
    base,
    formula,
    cosmicInsight,
    precisionLevel
  };
}

