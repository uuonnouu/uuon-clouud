/**
 * LINGUISTIC GEOMETRY ENGINE
 * Finding Geometric Meaning in Words, Letters, and Expressions
 * 
 * CORE PRINCIPLE: Every letter has an inherent geometric structure that can be
 * visualized mathematically. Words combine letter geometries into compound surfaces.
 * 
 * GEIA INTEGRATION:
 *   G = Geometry (letter shapes, visual forms)
 *   E = Energy (rhythm, cadence, phonetic flow)
 *   I = Information (semantic meaning, ordinal value)
 *   Λ = Laws (grammar rules, phonetic constraints)
 * 
 * LETTER MAPPING SYSTEM:
 * - Ordinal Position: A=1, B=2, ... Z=26 (determines complexity)
 * - Phonetic Class: Vowels (smooth/flowing) vs Consonants (angular/structured)
 * - Visual Shape: Letter appearance informs surface topology
 * - Sacred Geometry: Ancient traditions inform parameter relationships
 * 
 * @author UUON Foundation
 * @system Dmension Mathematical Universe
 */

import type { ParametricSurface } from './unifiedShapes';

interface LetterGeometry {
  letter: string;
  ordinal: number;
  phonetic: 'vowel' | 'consonant';
  visualClass: 'angular' | 'curved' | 'mixed' | 'vertical' | 'horizontal';
  frequency: number;
  surface: ParametricSurface;
}

const PHI = 1.618033988749895;
const TAU = 2 * Math.PI;

const createLetterSurface = (
  letter: string,
  ordinal: number,
  phonetic: 'vowel' | 'consonant',
  visualClass: string,
  surfaceGenerator: (u: number, v: number, params: Record<string, number>) => { x: number; y: number; z: number }
): ParametricSurface => {
  const normalizedOrdinal = ordinal / 26;
  const complexity = phonetic === 'vowel' ? 2 + ordinal * 0.2 : 3 + ordinal * 0.3;
  
  return {
    name: `Letter ${letter} (Linguistic Geometry)`,
    category: "Linguistic Geometry",
    formula: `Letter_${letter}(u,v) = f(ordinal=${ordinal}, phonetic=${phonetic})`,
    description: `Geometric embodiment of the letter ${letter}, ordinal position ${ordinal}, ${phonetic} class`,
    x: (u, v, params) => surfaceGenerator(u, v, params).x,
    y: (u, v, params) => surfaceGenerator(u, v, params).y,
    z: (u, v, params) => surfaceGenerator(u, v, params).z,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 64,
    defaultParams: { A: 1, B: 1, C: 1, D: normalizedOrdinal * 5, E: complexity }
  };
};

const LETTER_A: ParametricSurface = {
  name: "Letter A (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "A(u,v) = Pyramid/Apex form, ordinal=1, vowel",
  description: "The letter A as a pointed apex form, representing beginnings and ascension",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const height = v;
    const radius = A * (1 - height) * 0.8;
    return radius * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const height = v;
    const radius = A * (1 - height) * 0.8;
    return radius * Math.sin(theta) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return v * 2 * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_B: ParametricSurface = {
  name: "Letter B (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "B(u,v) = Double-bulge form, ordinal=2, consonant",
  description: "The letter B as a double-bulge surface, representing duality and containment",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const phi = v * TAU;
    const bulge1 = 0.4 + 0.3 * Math.sin(phi);
    const bulge2 = 0.4 + 0.3 * Math.sin(phi + Math.PI);
    const r = A * (theta < Math.PI / 2 ? bulge1 : bulge2);
    return r * Math.sin(theta) * Math.cos(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const phi = v * TAU;
    const bulge = 0.4 + 0.3 * Math.sin(phi * 2);
    return A * bulge * Math.sin(theta) * Math.sin(phi) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const theta = u * Math.PI;
    return C * Math.cos(theta);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_C: ParametricSurface = {
  name: "Letter C (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "C(u,v) = Open arc form, ordinal=3, consonant",
  description: "The letter C as an open crescent arc, representing reception and openness",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 1.5 * Math.PI + 0.25 * Math.PI;
    const width = (v - 0.5) * 0.4;
    const r = A * (1 + width);
    return r * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 1.5 * Math.PI + 0.25 * Math.PI;
    const width = (v - 0.5) * 0.4;
    const r = A * (1 + width);
    return r * Math.sin(theta) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v - 0.5) * C * 0.5;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 32,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_D: ParametricSurface = {
  name: "Letter D (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "D(u,v) = Half-dome form, ordinal=4, consonant",
  description: "The letter D as a half-dome structure, representing doorways and direction",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI - Math.PI / 2;
    const phi = v * Math.PI;
    return A * Math.cos(theta) * Math.sin(phi) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI - Math.PI / 2;
    const phi = v * Math.PI;
    return A * Math.sin(theta) * Math.sin(phi) * B * 0.5;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const phi = v * Math.PI;
    return C * Math.cos(phi);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_E: ParametricSurface = {
  name: "Letter E (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "E(u,v) = Triple-wave form, ordinal=5, vowel",
  description: "The letter E as three horizontal waves, most common letter representing energy",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    return t * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    const layer = Math.floor(v * 3);
    const wave = 0.2 * Math.sin(t * 3 * Math.PI);
    return (layer * 0.3 - 0.3 + wave) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const t = u * 2 - 1;
    return C * 0.1 * Math.sin(t * 5 * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_F: ParametricSurface = {
  name: "Letter F (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "F(u,v) = Flag/branch form, ordinal=6, consonant",
  description: "The letter F as a vertical stem with branches, representing forward motion",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    const branch = v > 0.6 ? (1 - v) * 2 : 0;
    return (t * 0.3 + branch * 0.5) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const t = u * 2 - 1;
    return C * 0.1 * Math.sin(t * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 32, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_G: ParametricSurface = {
  name: "Letter G (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "G(u,v) = Spiral with hook, ordinal=7, consonant",
  description: "The letter G as a spiral with inward hook, representing gathering and growth",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 1.75 * Math.PI;
    const hook = u > 0.8 ? (u - 0.8) * 2 : 0;
    const r = A * (0.8 + 0.2 * (1 - u) - hook * 0.3);
    return r * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * 1.75 * Math.PI;
    const r = A * (0.8 + 0.2 * (1 - u));
    return r * Math.sin(theta) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v - 0.5) * C * 0.3;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 32,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_H: ParametricSurface = {
  name: "Letter H (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "H(u,v) = Bridge/portal form, ordinal=8, consonant",
  description: "The letter H as a bridge structure, representing connection and harmony",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    const bridge = Math.abs(v - 0.5) < 0.1 ? 1 : 0;
    const pillar = Math.abs(t) > 0.8 ? 1 : 0;
    return t * A * B * (pillar + bridge * 0.5);
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const arch = Math.exp(-Math.pow((v - 0.5) * 4, 2)) * 0.2;
    return C * arch;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_I: ParametricSurface = {
  name: "Letter I (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "I(u,v) = Vertical axis form, ordinal=9, vowel",
  description: "The letter I as a pure vertical axis, representing individuality and identity",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const r = 0.1 * A;
    return r * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const r = 0.1 * A;
    return r * Math.sin(theta) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v * 2 - 1) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 32, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_J: ParametricSurface = {
  name: "Letter J (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "J(u,v) = Hook descent form, ordinal=10, consonant",
  description: "The letter J as a descending hook, representing journey and joy",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const hookPhase = v < 0.3 ? (0.3 - v) * 3 : 0;
    const r = 0.1 * A + hookPhase * 0.3;
    return r * Math.cos(theta + hookPhase * Math.PI) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const hookPhase = v < 0.3 ? (0.3 - v) * 3 : 0;
    const r = 0.1 * A + hookPhase * 0.3;
    return r * Math.sin(theta + hookPhase * Math.PI) * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v * 2 - 1) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 32, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_K: ParametricSurface = {
  name: "Letter K (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "K(u,v) = Angular divergence form, ordinal=11, consonant",
  description: "The letter K as diverging rays, representing kinetic energy and action",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    const diagonal = v > 0.5 ? (v - 0.5) * 2 * t : (0.5 - v) * 2 * t;
    return (0.1 + Math.abs(diagonal) * 0.8) * Math.sign(diagonal || 1) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const t = u * 2 - 1;
    return C * 0.1 * Math.sin(t * 2 * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_L: ParametricSurface = {
  name: "Letter L (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "L(u,v) = Right-angle foundation form, ordinal=12, consonant",
  description: "The letter L as a grounded right angle, representing logic and learning",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const base = v < 0.15 ? u : 0;
    return base * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.05 * Math.sin(u * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 32, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_M: ParametricSurface = {
  name: "Letter M (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "M(u,v) = Mountain peaks form, ordinal=13, consonant",
  description: "The letter M as twin mountain peaks, representing majesty and matter",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (u * 2 - 1) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const peaks = Math.abs(Math.sin(u * 2 * Math.PI));
    return (v * peaks * 0.8 + (1 - peaks) * v * 0.2) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const depth = Math.sin(u * 2 * Math.PI) * 0.1;
    return C * depth * v;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_N: ParametricSurface = {
  name: "Letter N (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "N(u,v) = Diagonal bridge form, ordinal=14, consonant",
  description: "The letter N as a diagonal connection, representing nature and new",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const diagonal = v;
    const edge = u < 0.1 || u > 0.9 ? 1 : diagonal;
    return (u * 2 - 1) * edge * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.05;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_O: ParametricSurface = {
  name: "Letter O (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "O(u,v) = Torus/ring form, ordinal=15, vowel",
  description: "The letter O as a perfect torus, representing wholeness and origin",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const phi = v * TAU;
    const R = 0.7 * A;
    const r = 0.3 * A;
    return (R + r * Math.cos(phi)) * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const phi = v * TAU;
    const R = 0.7 * A;
    const r = 0.3 * A;
    return (R + r * Math.cos(phi)) * Math.sin(theta) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const phi = v * TAU;
    const r = 0.3 * A;
    return r * Math.sin(phi) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_P: ParametricSurface = {
  name: "Letter P (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "P(u,v) = Stem with bulb form, ordinal=16, consonant",
  description: "The letter P as a vertical stem with thought bulb, representing power and purpose",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const bulb = v > 0.5 ? Math.sin((v - 0.5) * Math.PI) * 0.4 : 0;
    return (0.1 + bulb) * Math.cos(theta) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const bulb = v > 0.5 ? Math.sin((v - 0.5) * Math.PI) * 0.4 : 0;
    return (0.1 + bulb) * Math.sin(theta) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v * 2 - 1) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_Q: ParametricSurface = {
  name: "Letter Q (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "Q(u,v) = Circle with tail form, ordinal=17, consonant",
  description: "The letter Q as a circle with descending tail, representing questions and quest",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const phi = v * TAU;
    const R = 0.7 * A;
    const r = 0.2 * A;
    const tail = u > 0.7 && v < 0.3 ? (0.7 - v) * 0.5 : 0;
    return ((R + r * Math.cos(phi)) * Math.cos(theta) + tail) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const phi = v * TAU;
    const R = 0.7 * A;
    const r = 0.2 * A;
    const tail = u > 0.7 && v < 0.3 ? -(0.7 - v) * 0.5 : 0;
    return ((R + r * Math.cos(phi)) * Math.sin(theta) + tail) * B;
  },
  z: (u, v, params) => {
    const A = params.A ?? 1;
    const C = params.C ?? 1;
    const phi = v * TAU;
    const r = 0.2 * A;
    return r * Math.sin(phi) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_R: ParametricSurface = {
  name: "Letter R (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "R(u,v) = Stem with leg form, ordinal=18, consonant",
  description: "The letter R as a stem with extending leg, representing reason and reach",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const bulb = v > 0.5 ? Math.sin((v - 0.5) * Math.PI) * 0.3 : 0;
    const leg = v < 0.4 ? (0.4 - v) * u * 0.8 : 0;
    return (0.1 + bulb + leg) * Math.cos(theta) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * TAU;
    const bulb = v > 0.5 ? Math.sin((v - 0.5) * Math.PI) * 0.3 : 0;
    return (0.1 + bulb) * Math.sin(theta) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v * 2 - 1) * C;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_S: ParametricSurface = {
  name: "Letter S (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "S(u,v) = Serpentine wave form, ordinal=19, consonant",
  description: "The letter S as a flowing serpentine wave, representing spirit and synthesis",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = v * 2 - 1;
    const wave = 0.5 * Math.sin(t * Math.PI);
    return wave * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const t = v * 2 - 1;
    return C * 0.2 * Math.cos(t * Math.PI) * (u * 2 - 1);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 32, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_T: ParametricSurface = {
  name: "Letter T (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "T(u,v) = Cross/tau form, ordinal=20, consonant",
  description: "The letter T as the tau cross, representing truth and time",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const crossbar = v > 0.85 ? (u * 2 - 1) : 0;
    const stem = Math.abs(u - 0.5) < 0.1 ? 0.1 : 0;
    return (crossbar + stem * (u * 2 - 1)) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.05;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_U: ParametricSurface = {
  name: "Letter U (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "U(u,v) = Vessel/cup form, ordinal=21, vowel",
  description: "The letter U as a receiving vessel, representing unity and understanding",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const r = 0.8 + v * 0.2;
    return A * r * Math.cos(theta) * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const theta = u * Math.PI;
    const depth = Math.sin(theta) * 0.5;
    return (v * 2 - 1 + depth * (1 - v)) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return (v - 0.5) * C * 0.3;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_V: ParametricSurface = {
  name: "Letter V (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "V(u,v) = Convergent valley form, ordinal=22, consonant",
  description: "The letter V as converging lines, representing victory and vision",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const spread = 1 - v;
    return (u * 2 - 1) * spread * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.05 * Math.sin(u * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_W: ParametricSurface = {
  name: "Letter W (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "W(u,v) = Double-valley wave form, ordinal=23, consonant",
  description: "The letter W as double valleys, representing wisdom and waves",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (u * 2 - 1) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const wave = Math.abs(Math.sin(u * 2 * Math.PI));
    return (v * wave + (1 - wave) * v * 0.3) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.1 * Math.sin(u * 4 * Math.PI) * v;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_X: ParametricSurface = {
  name: "Letter X (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "X(u,v) = Crossing/intersection form, ordinal=24, consonant",
  description: "The letter X as crossing lines, representing the unknown and intersection",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = u * 2 - 1;
    const cross1 = v * t;
    const cross2 = (1 - v) * t;
    return (cross1 - cross2) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    const center = Math.exp(-Math.pow(v - 0.5, 2) * 16);
    return C * center * 0.2;
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_Y: ParametricSurface = {
  name: "Letter Y (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "Y(u,v) = Branching form, ordinal=25, consonant",
  description: "The letter Y as a branching fork, representing yield and yearning",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const branch = v > 0.5 ? (v - 0.5) * 2 * (u * 2 - 1) : 0;
    return branch * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.05 * Math.sin(u * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

const LETTER_Z: ParametricSurface = {
  name: "Letter Z (Linguistic Geometry)",
  category: "Linguistic Geometry",
  formula: "Z(u,v) = Zigzag lightning form, ordinal=26, consonant",
  description: "The letter Z as zigzag lightning, representing zenith and zeal",
  x: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    const t = v * 2 - 1;
    const zigzag = v < 0.33 ? 1 : (v > 0.66 ? 1 : -t);
    return zigzag * (u * 0.2) * A * B;
  },
  y: (u, v, params) => {
    const A = params.A ?? 1;
    const B = params.B ?? 1;
    return (v * 2 - 1) * A * B;
  },
  z: (u, v, params) => {
    const C = params.C ?? 1;
    return C * 0.1 * Math.sin(v * 3 * Math.PI);
  },
  uMin: 0, uMax: 1, vMin: 0, vMax: 1,
  uSegments: 64, vSegments: 64,
  defaultParams: { A: 1, B: 1, C: 1 }
};

export const LETTER_SHAPES: Record<string, ParametricSurface> = {
  'letter-a': LETTER_A,
  'letter-b': LETTER_B,
  'letter-c': LETTER_C,
  'letter-d': LETTER_D,
  'letter-e': LETTER_E,
  'letter-f': LETTER_F,
  'letter-g': LETTER_G,
  'letter-h': LETTER_H,
  'letter-i': LETTER_I,
  'letter-j': LETTER_J,
  'letter-k': LETTER_K,
  'letter-l': LETTER_L,
  'letter-m': LETTER_M,
  'letter-n': LETTER_N,
  'letter-o': LETTER_O,
  'letter-p': LETTER_P,
  'letter-q': LETTER_Q,
  'letter-r': LETTER_R,
  'letter-s': LETTER_S,
  'letter-t': LETTER_T,
  'letter-u': LETTER_U,
  'letter-v': LETTER_V,
  'letter-w': LETTER_W,
  'letter-x': LETTER_X,
  'letter-y': LETTER_Y,
  'letter-z': LETTER_Z,
};

export const LETTER_METADATA: Record<string, { ordinal: number; phonetic: 'vowel' | 'consonant'; meaning: string }> = {
  'A': { ordinal: 1, phonetic: 'vowel', meaning: 'beginnings, apex, ascension' },
  'B': { ordinal: 2, phonetic: 'consonant', meaning: 'duality, containment, body' },
  'C': { ordinal: 3, phonetic: 'consonant', meaning: 'reception, openness, crescent' },
  'D': { ordinal: 4, phonetic: 'consonant', meaning: 'doorway, direction, dome' },
  'E': { ordinal: 5, phonetic: 'vowel', meaning: 'energy, existence, expression' },
  'F': { ordinal: 6, phonetic: 'consonant', meaning: 'forward, flag, foundation' },
  'G': { ordinal: 7, phonetic: 'consonant', meaning: 'gathering, growth, generation' },
  'H': { ordinal: 8, phonetic: 'consonant', meaning: 'harmony, connection, bridge' },
  'I': { ordinal: 9, phonetic: 'vowel', meaning: 'individuality, identity, axis' },
  'J': { ordinal: 10, phonetic: 'consonant', meaning: 'journey, joy, hook' },
  'K': { ordinal: 11, phonetic: 'consonant', meaning: 'kinetic, action, divergence' },
  'L': { ordinal: 12, phonetic: 'consonant', meaning: 'logic, learning, foundation' },
  'M': { ordinal: 13, phonetic: 'consonant', meaning: 'majesty, matter, mountains' },
  'N': { ordinal: 14, phonetic: 'consonant', meaning: 'nature, new, diagonal' },
  'O': { ordinal: 15, phonetic: 'vowel', meaning: 'wholeness, origin, cycle' },
  'P': { ordinal: 16, phonetic: 'consonant', meaning: 'power, purpose, thought' },
  'Q': { ordinal: 17, phonetic: 'consonant', meaning: 'question, quest, mystery' },
  'R': { ordinal: 18, phonetic: 'consonant', meaning: 'reason, reach, extension' },
  'S': { ordinal: 19, phonetic: 'consonant', meaning: 'spirit, synthesis, serpentine' },
  'T': { ordinal: 20, phonetic: 'consonant', meaning: 'truth, time, cross' },
  'U': { ordinal: 21, phonetic: 'vowel', meaning: 'unity, understanding, vessel' },
  'V': { ordinal: 22, phonetic: 'consonant', meaning: 'victory, vision, convergence' },
  'W': { ordinal: 23, phonetic: 'consonant', meaning: 'wisdom, waves, double' },
  'X': { ordinal: 24, phonetic: 'consonant', meaning: 'unknown, intersection, crossing' },
  'Y': { ordinal: 25, phonetic: 'consonant', meaning: 'yield, yearning, branch' },
  'Z': { ordinal: 26, phonetic: 'consonant', meaning: 'zenith, zeal, lightning' },
};

export function wordToGeometry(word: string): {
  surfaces: ParametricSurface[];
  composition: { letter: string; ordinal: number; weight: number }[];
  semanticEnergy: number;
  phonetichBalance: number;
} {
  const letters = word.toUpperCase().split('').filter(c => /[A-Z]/.test(c));
  const surfaces: ParametricSurface[] = [];
  const composition: { letter: string; ordinal: number; weight: number }[] = [];
  
  let vowelCount = 0;
  let consonantCount = 0;
  let totalOrdinal = 0;
  
  letters.forEach((letter, index) => {
    const meta = LETTER_METADATA[letter];
    if (meta) {
      const shapeKey = `letter-${letter.toLowerCase()}`;
      const surface = LETTER_SHAPES[shapeKey];
      if (surface) {
        surfaces.push(surface);
      }
      
      const weight = 1 / (index + 1);
      composition.push({ letter, ordinal: meta.ordinal, weight });
      totalOrdinal += meta.ordinal;
      
      if (meta.phonetic === 'vowel') vowelCount++;
      else consonantCount++;
    }
  });
  
  const semanticEnergy = totalOrdinal / (letters.length * 13.5);
  const phoneticBalance = vowelCount / Math.max(1, vowelCount + consonantCount);
  
  return {
    surfaces,
    composition,
    semanticEnergy,
    phonetichBalance: phoneticBalance
  };
}

export function createWordSurface(word: string): ParametricSurface {
  const analysis = wordToGeometry(word);
  const letters = word.toUpperCase().split('').filter(c => /[A-Z]/.test(c));
  
  return {
    name: `Word: "${word}" (Linguistic Geometry)`,
    category: "Linguistic Geometry",
    formula: `Word(u,v) = Blend(${letters.join(', ')})`,
    description: `Geometric composition of the word "${word}" with ${letters.length} letters, semantic energy ${(analysis.semanticEnergy * 100).toFixed(1)}%`,
    x: (u, v, params) => {
      const A = params.A ?? 1;
      const B = params.B ?? 1;
      let x = 0;
      letters.forEach((letter, i) => {
        const meta = LETTER_METADATA[letter];
        if (meta) {
          const phase = (i / letters.length) * TAU;
          const weight = 1 / (i + 1);
          x += weight * Math.sin(u * TAU + phase) * (meta.ordinal / 26);
        }
      });
      return x * A * B;
    },
    y: (u, v, params) => {
      const A = params.A ?? 1;
      const B = params.B ?? 1;
      let y = 0;
      letters.forEach((letter, i) => {
        const meta = LETTER_METADATA[letter];
        if (meta) {
          const phase = (i / letters.length) * TAU;
          const weight = 1 / (i + 1);
          y += weight * Math.cos(v * TAU + phase) * (meta.ordinal / 26);
        }
      });
      return y * A * B;
    },
    z: (u, v, params) => {
      const C = params.C ?? 1;
      let z = 0;
      letters.forEach((letter, i) => {
        const meta = LETTER_METADATA[letter];
        if (meta) {
          const isVowel = meta.phonetic === 'vowel' ? 1 : 0.5;
          z += isVowel * Math.sin((u + v) * Math.PI * (i + 1)) * 0.2;
        }
      });
      return z * C;
    },
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 64,
    defaultParams: { A: 1, B: 1, C: 1 }
  };
}

export const LINGUISTIC_GEOMETRY_SHAPES = LETTER_SHAPES;

/**
 * UNIVERSAL CHARACTER GEOMETRY
 * Extends Linguistic Geometry to ALL Unicode scripts using browser-native APIs
 * No external translation services required - uses Unicode properties directly
 */

interface UnicodeCharacterInfo {
  char: string;
  codePoint: number;
  script: string;
  normalizedOrdinal: number;
  isVowel: boolean;
  visualClass: 'curved' | 'angular' | 'complex' | 'symbolic';
}

const SCRIPT_RANGES: Record<string, { start: number; end: number; style: 'curved' | 'angular' | 'complex' | 'symbolic' }> = {
  'Latin': { start: 0x0041, end: 0x007A, style: 'angular' },
  'Greek': { start: 0x0370, end: 0x03FF, style: 'curved' },
  'Cyrillic': { start: 0x0400, end: 0x04FF, style: 'angular' },
  'Hebrew': { start: 0x0590, end: 0x05FF, style: 'symbolic' },
  'Arabic': { start: 0x0600, end: 0x06FF, style: 'curved' },
  'Devanagari': { start: 0x0900, end: 0x097F, style: 'curved' },
  'Thai': { start: 0x0E00, end: 0x0E7F, style: 'curved' },
  'CJK': { start: 0x4E00, end: 0x9FFF, style: 'complex' },
  'Hiragana': { start: 0x3040, end: 0x309F, style: 'curved' },
  'Katakana': { start: 0x30A0, end: 0x30FF, style: 'angular' },
  'Korean': { start: 0xAC00, end: 0xD7AF, style: 'complex' },
  'Emoji': { start: 0x1F600, end: 0x1F64F, style: 'symbolic' },
};

const VOWEL_PATTERNS = /[aeiouàáâãäåæèéêëìíîïòóôõöùúûüαεηιοωаеёиоуыэюяאעاوي]/i;

export function analyzeUnicodeCharacter(char: string): UnicodeCharacterInfo {
  const codePoint = char.codePointAt(0) || 0;
  
  let script = 'Unknown';
  let visualClass: 'curved' | 'angular' | 'complex' | 'symbolic' = 'angular';
  
  for (const [scriptName, range] of Object.entries(SCRIPT_RANGES)) {
    if (codePoint >= range.start && codePoint <= range.end) {
      script = scriptName;
      visualClass = range.style;
      break;
    }
  }
  
  const rangeInfo = SCRIPT_RANGES[script] || { start: 0, end: 127 };
  const rangeSize = rangeInfo.end - rangeInfo.start + 1;
  const normalizedOrdinal = ((codePoint - rangeInfo.start) / rangeSize) * 26 + 1;
  
  const isVowel = VOWEL_PATTERNS.test(char);
  
  return {
    char,
    codePoint,
    script,
    normalizedOrdinal: Math.max(1, Math.min(26, normalizedOrdinal)),
    isVowel,
    visualClass
  };
}

export function universalWordToGeometry(text: string): {
  characters: UnicodeCharacterInfo[];
  scripts: string[];
  semanticEnergy: number;
  phoneticBalance: number;
  surface: ParametricSurface;
} {
  const characters: UnicodeCharacterInfo[] = [];
  const scripts = new Set<string>();
  
  for (const char of text) {
    if (/\s/.test(char)) continue;
    const info = analyzeUnicodeCharacter(char);
    characters.push(info);
    scripts.add(info.script);
  }
  
  const vowelCount = characters.filter(c => c.isVowel).length;
  const totalOrdinal = characters.reduce((sum, c) => sum + c.normalizedOrdinal, 0);
  
  const semanticEnergy = totalOrdinal / (characters.length * 13.5) || 0;
  const phoneticBalance = vowelCount / Math.max(1, characters.length);
  
  const surface = createUniversalSurface(text, characters);
  
  return {
    characters,
    scripts: Array.from(scripts),
    semanticEnergy,
    phoneticBalance,
    surface
  };
}

function createUniversalSurface(text: string, chars: UnicodeCharacterInfo[]): ParametricSurface {
  const scriptStyle = chars[0]?.visualClass || 'angular';
  
  return {
    name: `Universal: "${text}" (${chars.length} chars)`,
    category: "Linguistic Geometry",
    formula: `Universal(u,v) = Blend(${chars.map(c => c.script).join(', ')})`,
    description: `Geometric composition of "${text}" using Unicode properties across ${new Set(chars.map(c => c.script)).size} script(s)`,
    x: (u, v, params) => {
      const A = params.A ?? 1;
      const B = params.B ?? 1;
      let x = 0;
      chars.forEach((char, i) => {
        const phase = (i / chars.length) * TAU;
        const weight = 1 / (i + 1);
        const curveModifier = char.visualClass === 'curved' ? Math.sin(u * TAU * 2) : 1;
        x += weight * Math.sin(u * TAU + phase) * (char.normalizedOrdinal / 26) * curveModifier;
      });
      return x * A * B;
    },
    y: (u, v, params) => {
      const A = params.A ?? 1;
      const B = params.B ?? 1;
      let y = 0;
      chars.forEach((char, i) => {
        const phase = (i / chars.length) * TAU;
        const weight = 1 / (i + 1);
        const complexModifier = char.visualClass === 'complex' ? 1.5 : 1;
        y += weight * Math.cos(v * TAU + phase) * (char.normalizedOrdinal / 26) * complexModifier;
      });
      return y * A * B;
    },
    z: (u, v, params) => {
      const C = params.C ?? 1;
      let z = 0;
      chars.forEach((char, i) => {
        const vowelBoost = char.isVowel ? 1.2 : 0.8;
        const symbolicLift = char.visualClass === 'symbolic' ? 0.3 : 0;
        z += vowelBoost * Math.sin((u + v) * Math.PI * (i + 1)) * 0.15 + symbolicLift;
      });
      return z * C;
    },
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 64, vSegments: 64,
    defaultParams: { A: 1, B: 1, C: 1 }
  };
}

export function getDeviceLanguage(): string {
  if (typeof navigator !== 'undefined') {
    return navigator.language || 'en';
  }
  return 'en';
}

console.log(`🔤 Linguistic Geometry Engine loaded: 26 letter shapes`);
console.log(`   📖 A-Z parametric surfaces with phonetic/ordinal properties`);
console.log(`   🔗 Word composition: wordToGeometry() and createWordSurface()`);
console.log(`   🌍 GEIA Integration: G=letters, E=rhythm, I=meaning, Λ=grammar`);
console.log(`🌐 Universal Character Geometry: All Unicode scripts supported`);
console.log(`   📜 Latin, Greek, Cyrillic, Hebrew, Arabic, CJK, Korean, Thai...`);
