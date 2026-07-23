import { SurfaceParameters } from '../types/math';
import { getCleanDefaults } from '../types/shapes';

export interface ParametricSurface {
  name: string;
  description?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * ALCHEMICAL SYMBOLS LIBRARY
 * Mathematical models of historical alchemy symbols as 3D parametric surfaces
 * 
 * Alchemy symbols encode ancient knowledge of elements, planets, and substances.
 * This library translates these mystical 2D glyphs into parametric 3D geometries.
 * 
 * Categories:
 * - Four Classical Elements: Fire, Water, Air, Earth
 * - Celestial Bodies: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, etc.
 * - Metals & Minerals: Gold, Silver, Copper, Iron, Lead, etc.
 * - Alchemical Substances: Aqua Regia, Cinnabar, Saltpeter, Vitriol, etc.
 * 
 * Each symbol is represented as a 3D surface that captures the essence of
 * the original glyph while providing depth and mathematical structure.
 */

export const ALCHEMICAL_SYMBOL_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // FOUR CLASSICAL ELEMENTS
  // ============================================================================
  
  alchemy_fire: {
    name: "🔺 Fire (Alchemy)",
    description: "Upward-pointing triangle representing fire - the element of transformation, energy, and passion. Associated with choleric temperament.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v;
      const baseRadius = a * (1 - h);
      const triangleMod = 1 + 0.3 * Math.cos(3 * theta);
      const r = baseRadius * triangleMod * b;
      const flameWave = c * Math.sin(6 * theta + d) * (1 - h);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * 2 + flameWave;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_water: {
    name: "🔻 Water (Alchemy)",
    description: "Downward-pointing triangle representing water - the element of emotion, intuition, and fluidity. Associated with phlegmatic temperament.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v;
      const baseRadius = a * h;
      const triangleMod = 1 + 0.3 * Math.cos(3 * theta);
      const r = baseRadius * triangleMod * b;
      const ripple = c * Math.sin(8 * theta + d) * h;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -h * 2 + ripple;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_air: {
    name: "🔺̶ Air (Alchemy)",
    description: "Upward-pointing triangle with horizontal line - representing air, the element of intellect, communication, and breath. Associated with sanguine temperament.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.12;
      const d = params.d ?? 0.5;
      
      const theta = u * 2 * Math.PI;
      const h = v;
      const baseRadius = a * (1 - h);
      const triangleMod = 1 + 0.3 * Math.cos(3 * theta);
      const barHeight = d;
      const bar = (Math.abs(h - barHeight) < 0.08) ? c : 0;
      const r = baseRadius * triangleMod * b + bar;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.12, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_earth: {
    name: "🔻̶ Earth (Alchemy)",
    description: "Downward-pointing triangle with horizontal line - representing earth, the element of stability, physicality, and grounding. Associated with melancholic temperament.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.12;
      const d = params.d ?? 0.5;
      
      const theta = u * 2 * Math.PI;
      const h = v;
      const baseRadius = a * h;
      const triangleMod = 1 + 0.3 * Math.cos(3 * theta);
      const barHeight = d;
      const bar = (Math.abs(h - barHeight) < 0.08) ? c : 0;
      const r = baseRadius * triangleMod * b + bar;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = -h * 2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.12, d: 0.5,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  // ============================================================================
  // CELESTIAL BODIES - PLANETS AND LUMINARIES
  // ============================================================================

  alchemy_sun: {
    name: "☉ Sun (Alchemy)",
    description: "Circle with central dot - the alchemical symbol for gold, representing perfection, consciousness, and the masculine principle.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 8.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const centralDot = c * Math.exp(-((phi - Math.PI/2) ** 2) * 10);
      const rays = 1 + 0.1 * Math.sin(d * theta);
      const radius = a * b * Math.sin(phi) * rays + centralDot;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 8.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_moon: {
    name: "☽ Moon (Alchemy)",
    description: "Crescent shape - the alchemical symbol for silver, representing reflection, intuition, and the feminine principle.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.6;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const outerR = a * b;
      const innerR = a * b * c;
      const offset = 0.4;
      const outer = outerR * Math.sin(phi);
      const innerCut = innerR * Math.sin(phi);
      const cutAmount = Math.max(0, innerCut - offset * Math.cos(theta));
      const radius = outer - cutAmount * 0.5;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.6, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_mercury: {
    name: "☿ Mercury (Alchemy)",
    description: "Circle with crescent and cross - quicksilver symbol, representing transformation, communication, and the bridge between worlds.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 3 - 1;
      let r: number;
      
      if (h > 0.5) {
        const crescentPhase = (h - 0.5) / 1.0;
        const horn = 1 + 0.4 * Math.sin(theta) * crescentPhase;
        r = a * b * c * horn * (1 - (h - 0.5));
      } else if (h > -0.3) {
        r = a * b * (0.4 + 0.1 * Math.sin(4 * theta));
      } else {
        const crossPhase = (-0.3 - h) / 0.7;
        r = a * b * 0.15 * (1 + Math.abs(Math.cos(2 * theta)) * crossPhase);
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 48 
    })
  },

  alchemy_venus: {
    name: "♀ Venus (Alchemy)",
    description: "Circle with cross below - copper symbol, representing love, beauty, harmony, and the feminine divine.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.5;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      let r: number;
      
      if (h > 0) {
        const phi = h * Math.PI;
        r = a * b * 0.5 * Math.sin(phi);
      } else {
        const crossPhase = -h / 0.5;
        const crossWidth = 0.15 * (1 + Math.abs(Math.cos(2 * theta)) * c);
        r = a * b * crossWidth * (1 - crossPhase * 0.3);
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.5, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_mars: {
    name: "♂ Mars (Alchemy)",
    description: "Circle with arrow pointing upper-right - iron symbol, representing action, aggression, and masculine energy.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.4;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      let r: number;
      
      if (h < 0.5) {
        const phi = (h + 0.5) * Math.PI;
        r = a * b * 0.4 * Math.sin(phi);
      } else {
        const arrowPhase = (h - 0.5) / 0.5;
        const arrowDir = Math.cos(theta - Math.PI/4);
        const arrowWidth = 0.1 + 0.15 * Math.max(0, arrowDir) * c;
        r = a * b * arrowWidth * (1 - arrowPhase * 0.5);
      }
      
      const x = r * Math.cos(theta) + h * 0.3 + d;
      const y = r * Math.sin(theta) + h * 0.3;
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.4, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_jupiter: {
    name: "♃ Jupiter (Alchemy)",
    description: "Stylized numeral 4 or cross with crescent - tin symbol, representing expansion, abundance, and wisdom.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const crescent = Math.sin(theta) > 0.5 ? c * (1 - Math.abs(h)) : 0;
      const crossBar = Math.abs(h) < 0.15 ? 0.3 : 0.1;
      const vertical = Math.abs(Math.sin(theta)) < 0.2 ? 0.2 : 0;
      const r = a * b * (crossBar + crescent + vertical);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_saturn: {
    name: "♄ Saturn (Alchemy)",
    description: "Cross with curved tail - lead symbol, representing limitation, structure, time, and discipline.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 1;
      let r: number;
      
      if (h > 0.5) {
        const tailPhase = (h - 0.5) / 1.0;
        const curl = c * Math.sin(tailPhase * Math.PI);
        r = a * b * (0.15 + curl * Math.cos(theta));
      } else {
        const crossWidth = Math.abs(Math.sin(2 * theta)) > 0.7 ? 0.25 : 0.12;
        r = a * b * crossWidth;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_uranus: {
    name: "♅ Uranus (Alchemy)",
    description: "Circle with dot and arrow above - representing innovation, rebellion, and sudden change.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.5;
      let r: number;
      
      if (h < 0.8 && h > -0.2) {
        const phi = (h + 0.2) * Math.PI;
        r = a * b * 0.35 * Math.sin(phi);
        const dot = c * Math.exp(-((h - 0.3) ** 2) * 20);
        r += dot;
      } else if (h >= 0.8) {
        const arrowPhase = (h - 0.8) / 0.7;
        r = a * b * 0.12 * (1 - arrowPhase * 0.3);
      } else {
        r = a * b * 0.08;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_neptune: {
    name: "♆ Neptune (Alchemy)",
    description: "Trident shape - representing the depths of the unconscious, dreams, and illusion.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.4;
      const d = params.d ?? 3.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.5;
      const prongs = Math.floor(d);
      const prongPattern = 1 + c * Math.abs(Math.cos(prongs * theta / 2));
      let r: number;
      
      if (h > 0.5) {
        r = a * b * 0.15 * prongPattern * (1 - (h - 0.5) * 0.3);
      } else {
        r = a * b * 0.12;
      }
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.4, d: 3.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 48 
    })
  },

  // ============================================================================
  // NOBLE METALS
  // ============================================================================

  alchemy_gold: {
    name: "🥇 Gold (Aurum)",
    description: "Perfect circle with central point - the philosopher's goal, representing perfection, immortality, and enlightenment.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const centralPoint = c * Math.exp(-((phi - Math.PI/2) ** 2) * 15);
      const purity = 1.0;
      const radius = a * b * Math.sin(phi) * purity + centralPoint;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_silver: {
    name: "🥈 Silver (Argentum)",
    description: "Crescent moon - lunar metal representing purity, reflection, and the feminine.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.5;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const outerR = a * b;
      const crescentCut = c * Math.max(0, Math.cos(theta - Math.PI/4));
      const radius = outerR * Math.sin(phi) * (1 - crescentCut * 0.4);
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.5, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_copper: {
    name: "🔶 Copper (Cuprum)",
    description: "Venus symbol - associated with Cyprus and the goddess of beauty.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.5;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.2 - 0.7;
      let r: number;
      
      if (h > 0) {
        const phi = h * Math.PI / 1.5;
        r = a * b * 0.45 * Math.sin(phi);
      } else {
        const crossArms = Math.abs(Math.sin(2 * theta));
        r = a * b * 0.12 * (1 + crossArms * c);
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.5, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_iron: {
    name: "⚔️ Iron (Ferrum)",
    description: "Mars symbol - the metal of war and industry, representing strength and determination.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.35;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.2 - 0.7;
      let r: number;
      
      if (h < 0.3) {
        const phi = (h + 0.7) * Math.PI;
        r = a * b * 0.4 * Math.sin(phi);
      } else {
        const arrowPhase = (h - 0.3) / 0.9;
        const arrowShape = Math.max(0, Math.cos(theta - Math.PI/4));
        r = a * b * (0.1 + arrowShape * c * (1 - arrowPhase));
      }
      
      const x = r * Math.cos(theta) + h * 0.25 + d;
      const y = r * Math.sin(theta) + h * 0.25;
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.35, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_tin: {
    name: "🔧 Tin (Stannum)",
    description: "Jupiter symbol - the metal of expansion and good fortune.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const crescent = Math.sin(theta) > 0.3 ? c * (1 - Math.abs(h) * 0.5) : 0;
      const cross = Math.abs(Math.sin(2 * theta)) > 0.8 ? 0.2 : 0.1;
      const r = a * b * (cross + crescent);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_lead: {
    name: "⬛ Lead (Plumbum)",
    description: "Saturn symbol with scythe - the base metal of time and gravity, starting point of transmutation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.35;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 1;
      let r: number;
      
      if (h > 0.3) {
        const curvePhase = (h - 0.3) / 1.2;
        const scythe = c * Math.sin(curvePhase * Math.PI);
        r = a * b * (0.12 + scythe * Math.cos(theta));
      } else {
        const crossShape = Math.abs(Math.sin(2 * theta)) > 0.6 ? 0.22 : 0.1;
        r = a * b * crossShape;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.35, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_platinum: {
    name: "💎 Platinum",
    description: "Combination of sun and moon symbols - the incorruptible metal bridging solar and lunar qualities.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.4;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const sunCore = 0.2 * Math.exp(-((phi - Math.PI/2) ** 2) * 12);
      const moonCrescent = c * Math.max(0, Math.sin(theta)) * (1 - Math.abs(phi - Math.PI/2));
      const radius = a * b * Math.sin(phi) + sunCore + moonCrescent * 0.2;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.4, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  // ============================================================================
  // ALCHEMICAL SUBSTANCES AND COMPOUNDS
  // ============================================================================

  alchemy_sulfur: {
    name: "🔥 Sulfur (Brimstone)",
    description: "Triangle with cross below - one of the three primes, representing the soul and combustibility.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.8;
      let r: number;
      
      if (h > 0) {
        const triangleBase = 1 - h / 1.2;
        const triangleMod = 1 + 0.25 * Math.cos(3 * theta);
        r = a * b * triangleBase * triangleMod * 0.5;
      } else {
        const crossWidth = Math.abs(Math.sin(2 * theta)) > 0.7 ? 0.2 : 0.08;
        r = a * b * crossWidth * c * 5;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 48 
    })
  },

  alchemy_salt: {
    name: "⭕ Salt",
    description: "Circle with horizontal line - one of the three primes, representing the body and crystallization.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.12;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const equatorBar = Math.abs(phi - Math.PI/2) < 0.15 ? c : 0;
      const radius = a * b * Math.sin(phi) + equatorBar;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.12, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_aqua_regia: {
    name: "👑 Aqua Regia",
    description: "Combination of nitric and hydrochloric acids - the royal water that dissolves gold.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 5.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const crowdPoints = Math.floor(d);
      const crownPattern = Math.abs(Math.sin(crowdPoints * theta / 2));
      const acid = c * (1 + 0.5 * Math.sin(8 * theta));
      const r = a * b * (0.4 + crownPattern * 0.2 * (1 - Math.abs(h)) + acid * Math.abs(h) * 0.3);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 5.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_cinnabar: {
    name: "🔴 Cinnabar",
    description: "Mercury sulfide - the red ore from which mercury is extracted, used in vermillion pigment.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 6.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const crystalline = 1 + c * Math.sin(d * theta) * Math.sin(d * phi);
      const radius = a * b * Math.sin(phi) * crystalline;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 6.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_vitriol: {
    name: "⚗️ Vitriol",
    description: "Sulfuric acid - VITRIOL: Visit the Interior of the Earth and Rectify what you find.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 7.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const spiralTwist = c * theta / (2 * Math.PI);
      const alembic = 0.5 - 0.3 * Math.abs(h);
      const sevenFold = 1 + 0.1 * Math.sin(d * theta);
      const r = a * b * alembic * sevenFold;
      
      const x = r * Math.cos(theta + spiralTwist);
      const y = r * Math.sin(theta + spiralTwist);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 7.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_quicksilver: {
    name: "💧 Quicksilver",
    description: "Liquid mercury - the living silver that flows and transforms, essential to transmutation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const liquidWobble = 1 + c * Math.sin(5 * theta + d) * Math.sin(3 * phi);
      const droplet = a * b * Math.sin(phi) * liquidWobble;
      const gravity = 0.9 + 0.1 * Math.cos(phi);
      const radius = droplet * gravity;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi) * 0.9;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_arsenic: {
    name: "☠️ Arsenic",
    description: "The king of poisons - used in transmutation attempts despite its deadly nature.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const skull = 0.4 + c * Math.cos(2 * theta) * (1 - h * h);
      const crossbones = Math.abs(h) > 0.5 ? 0.15 * Math.abs(Math.sin(2 * theta)) : 0;
      const r = a * b * (skull + crossbones);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_antimony: {
    name: "⚒️ Antimony",
    description: "The wolf metal - used to purify gold, eating away impurities.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const wolfCross = Math.abs(Math.sin(2 * theta)) * c;
      const orb = a * b * Math.sin(phi);
      const radius = orb * (1 + wolfCross * (1 - Math.abs(Math.cos(phi))));
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_borax: {
    name: "🧊 Borax",
    description: "The flux stone - used in metallurgy to purify metals and in glassmaking.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 4.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const crystal = 1 + c * Math.cos(d * theta) * Math.cos(d * phi);
      const facets = Math.max(0.8, Math.abs(Math.cos(3 * theta)));
      const radius = a * b * Math.sin(phi) * crystal * facets;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 4.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_saltpeter: {
    name: "💥 Saltpeter",
    description: "Potassium nitrate - essential component of gunpowder and purification processes.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 6.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const needleCrystal = 1 + c * Math.abs(Math.sin(d * theta)) * Math.sin(phi);
      const explosive = 1 + 0.1 * Math.sin(12 * theta) * Math.sin(8 * phi);
      const radius = a * b * Math.sin(phi) * needleCrystal * explosive;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 6.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_sal_ammoniac: {
    name: "🌀 Sal Ammoniac",
    description: "Ammonium chloride - volatile salt used in sublimation and purification.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const volatile = 1 + c * Math.sin(4 * theta) * Math.cos(4 * phi);
      const sublimation = a * b * Math.sin(phi) * volatile;
      const spiralRise = 0.1 * theta / (2 * Math.PI);
      
      const x = sublimation * Math.cos(theta);
      const y = sublimation * Math.sin(theta);
      const z = a * Math.cos(phi) + spiralRise + d;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_lime: {
    name: "⚪ Lime (Calcium Oxide)",
    description: "Quickite - caustic calcium oxide used in mortar and chemical processes.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const chalky = 1 + c * (Math.random() * 0.5 + 0.5) * Math.sin(8 * theta);
      const radius = a * b * Math.sin(phi) * chalky;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_brass: {
    name: "🔔 Brass",
    description: "Copper-zinc alloy - representing the union of Venus and Jupiter metals.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const venusComponent = 0.5 + 0.2 * Math.sin(theta);
      const jupiterComponent = 0.5 + 0.2 * Math.cos(2 * theta);
      const alloy = (venusComponent + jupiterComponent) * 0.5;
      const radius = a * b * Math.sin(phi) * alloy * (1 + c);
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_steel: {
    name: "⚔️ Steel",
    description: "Iron-carbon alloy - Mars metal refined and strengthened through fire.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.08;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const forged = 1 + c * Math.sin(6 * theta) * Math.sin(4 * phi);
      const tempered = Math.max(0.9, 1 - 0.1 * Math.abs(Math.sin(3 * theta)));
      const radius = a * b * Math.sin(phi) * forged * tempered;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.08, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_glass: {
    name: "🔮 Glass",
    description: "Vitrified silica - transparent solid representing clarity and transformation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.05;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const clarity = 1 + c * Math.sin(12 * theta) * Math.sin(8 * phi);
      const vessel = a * b * Math.sin(phi) * clarity;
      const hollow = 0.95;
      const radius = vessel * hollow;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.05, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_crystal: {
    name: "💎 Crystal",
    description: "Quartz or gemstone - the geometric perfection of nature's laboratory.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 6.0;
      const d = params.d ?? 0.3;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const sides = Math.floor(c);
      const facetAngle = (2 * Math.PI) / sides;
      const facetMod = 1 + d * Math.cos(sides * theta);
      const taper = 1 - Math.abs(h) * 0.6;
      const r = a * b * 0.5 * facetMod * taper;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 6.0, d: 0.3,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_oil: {
    name: "🛢️ Oil",
    description: "Volatile essences - representing spirit extracted from matter.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const dropShape = Math.sqrt(1 - h * h);
      const viscous = 1 + c * Math.sin(3 * theta) * (1 - Math.abs(h));
      const r = a * b * 0.5 * dropShape * viscous;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a * 0.8 - 0.2;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_vinegar: {
    name: "🍶 Vinegar",
    description: "Acetic acid - the sharp spirit of fermentation and dissolution.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      let r: number;
      
      if (h > 0.8) {
        r = a * b * 0.15 * (1 + c * Math.sin(4 * theta));
      } else if (h > -0.3) {
        const body = 0.4 - 0.1 * h;
        r = a * b * body * (1 + c * Math.sin(6 * theta) * 0.5);
      } else {
        const base = 0.35 + (h + 0.3) * 0.2;
        r = a * b * base;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_wax: {
    name: "🕯️ Wax",
    description: "Beeswax or tallow - malleable medium for seals and candles.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.5;
      const candleBody = 0.25 + c * Math.sin(2 * h);
      const drips = Math.max(0, 0.1 * Math.sin(5 * theta + h * 3));
      const r = a * b * (candleBody + drips);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_tartar: {
    name: "🍷 Tartar",
    description: "Potassium bitartrate - the crystalline residue of wine fermentation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 5.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const tartarCrystal = 1 + c * Math.cos(d * theta) * Math.sin(d * phi);
      const layered = 1 + 0.1 * Math.sin(8 * phi);
      const radius = a * b * Math.sin(phi) * tartarCrystal * layered;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 5.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_philosophers_stone: {
    name: "🔴 Philosopher's Stone",
    description: "The Magnum Opus - legendary substance capable of transmuting base metals to gold and granting immortality.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const rubedo = 1 + c * Math.sin(3 * theta) * Math.sin(5 * phi);
      const perfection = 1 + 0.15 * Math.cos(7 * theta + d);
      const innerFire = 0.2 * Math.exp(-((phi - Math.PI/2) ** 2) * 5);
      const radius = a * b * Math.sin(phi) * rubedo * perfection + innerFire;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 36 
    })
  },

  alchemy_ouroboros: {
    name: "🐍 Ouroboros",
    description: "The serpent eating its tail - symbol of eternal return, unity of beginning and end.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      const majorR = a * b;
      const minorR = majorR * c;
      const bodyThickness = minorR * (1 + 0.3 * Math.sin(6 * theta));
      const head = theta > 5.5 ? 1.3 : 1.0;
      const tail = theta < 0.5 ? 0.7 : 1.0;
      const r = majorR + bodyThickness * Math.cos(phi) * head * tail;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = bodyThickness * Math.sin(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 96, vSegments: 24 
    })
  },

  alchemy_caduceus: {
    name: "⚕️ Caduceus",
    description: "Mercury's staff with twin serpents - symbol of transformation, commerce, and medicine.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 3.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 3 - 1;
      const staffRadius = 0.08;
      const serpentWrap = c * Math.sin(d * Math.PI * h + theta);
      const serpentR = 0.2 + serpentWrap * (1 - Math.abs(h) * 0.3);
      const wings = h > 0.8 ? 0.3 * Math.abs(Math.sin(2 * theta)) : 0;
      const r = a * b * (staffRadius + serpentR * 0.3 + wings);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 3.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 72, vSegments: 48 
    })
  },

  alchemy_athanor: {
    name: "🔥 Athanor",
    description: "The alchemical furnace - self-feeding digestion oven for slow, steady transformation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.5;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.5;
      let r: number;
      
      if (h > 1.2) {
        const chimney = 0.15 * (1 - (h - 1.2) * 0.5);
        r = a * b * chimney;
      } else if (h > 0.3) {
        const dome = c * Math.sqrt(1 - ((h - 0.75) / 0.45) ** 2);
        r = a * b * dome;
      } else {
        const base = 0.5 - 0.1 * Math.abs(h - 0.15);
        r = a * b * base;
      }
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.5, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_alembic: {
    name: "⚗️ Alembic",
    description: "Distillation apparatus - the vessel of purification and separation.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.6;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2.5 - 0.5;
      let r: number;
      
      if (h > 1.0) {
        const spout = 0.1 * (1 + (h - 1.0) * 0.5);
        const bend = Math.sin((h - 1.0) * 2);
        r = a * b * spout;
      } else if (h > 0.2) {
        const bulb = c * Math.sin((h - 0.2) / 0.8 * Math.PI);
        r = a * b * bulb;
      } else {
        const neck = 0.2 + 0.1 * h;
        r = a * b * neck;
      }
      
      const x = r * Math.cos(theta) + (h > 1.0 ? (h - 1.0) * 0.3 : 0) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.6, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 48 
    })
  },

  alchemy_crucible: {
    name: "🫕 Crucible",
    description: "The melting pot - vessel for transformation through extreme heat.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.8;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 1.5 - 0.5;
      const bowlProfile = 0.3 + c * 0.3 * (h + 0.5);
      const lip = h > 0.8 ? 0.05 : 0;
      const r = a * b * (bowlProfile + lip);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.8, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  // ============================================================================
  // ALCHEMICAL PROCESSES
  // ============================================================================

  alchemy_nigredo: {
    name: "⚫ Nigredo (Blackening)",
    description: "First stage of the Great Work - putrefaction, dissolution, death of matter.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const decay = 1 - c * Math.sin(5 * theta) * Math.sin(7 * phi);
      const darkness = 0.8 + 0.2 * Math.cos(3 * theta);
      const radius = a * b * Math.sin(phi) * decay * darkness;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi) * 0.9;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_albedo: {
    name: "⚪ Albedo (Whitening)",
    description: "Second stage - purification, washing, the white stone emerges.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const purity = 1 + c * Math.sin(8 * theta) * Math.sin(6 * phi);
      const clarity = 1.0;
      const radius = a * b * Math.sin(phi) * purity * clarity;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_citrinitas: {
    name: "🟡 Citrinitas (Yellowing)",
    description: "Third stage - solar dawn, spiritual awakening, approaching gold.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const dawn = 1 + c * Math.sin(4 * theta);
      const radiance = 1 + 0.15 * Math.cos(6 * phi);
      const rays = 0.1 * Math.max(0, Math.sin(8 * theta)) * Math.sin(phi);
      const radius = a * b * Math.sin(phi) * dawn * radiance + rays;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_rubedo: {
    name: "🔴 Rubedo (Reddening)",
    description: "Final stage - the red stone, perfection achieved, union of opposites.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const perfection = 1 + c * Math.sin(3 * theta) * Math.sin(3 * phi);
      const innerFire = 0.15 * Math.exp(-((phi - Math.PI/2) ** 2) * 8);
      const completion = 1 + 0.1 * Math.cos(5 * theta);
      const radius = a * b * Math.sin(phi) * perfection * completion + innerFire;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  // ============================================================================
  // ADDITIONAL SUBSTANCES FROM THE CHART
  // ============================================================================

  alchemy_aqua_vitae: {
    name: "🍷 Aqua Vitae",
    description: "Water of life - distilled alcohol, the spirit of wine.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      const flask = 0.3 + 0.15 * Math.sin(h * Math.PI) * (1 + c);
      const spirit = 1 + 0.1 * Math.sin(4 * theta);
      const r = a * b * flask * spirit;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  alchemy_caput_mortuum: {
    name: "💀 Caput Mortuum",
    description: "Dead head - worthless residue left after distillation, also a purple pigment.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const skull = a * b * Math.sin(phi) * (1 + c * Math.cos(2 * theta) * Math.sin(phi));
      const eyeSockets = phi > 0.4 && phi < 0.8 && Math.abs(Math.cos(theta)) > 0.5 ? -0.1 : 0;
      const radius = skull + eyeSockets;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_cerussa: {
    name: "⬜ Cerussa (White Lead)",
    description: "Lead carbonate - the white lead used in paint and cosmetics.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.08;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const powder = 1 + c * Math.sin(10 * theta) * Math.sin(8 * phi);
      const radius = a * b * Math.sin(phi) * powder;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.08, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_camphire: {
    name: "🌿 Camphire (Henna)",
    description: "Camphor or henna plant - aromatic substance used in alchemy and medicine.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 5.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const leaves = 1 + c * Math.cos(d * theta) * Math.sin(3 * phi);
      const aromatic = 1 + 0.1 * Math.sin(7 * theta);
      const radius = a * b * Math.sin(phi) * leaves * aromatic;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 5.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_ashes: {
    name: "🔘 Ashes",
    description: "Calcined remains - the fixed salt remaining after burning.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v - 0.5;
      const pile = 0.4 * Math.exp(-h * h * 3) * (1 + c * Math.sin(6 * theta));
      const scattered = 0.1 * Math.sin(8 * theta + 4 * h);
      const r = a * b * (pile + scattered * Math.abs(h));
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a * 0.5;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_gravel: {
    name: "🪨 Gravel",
    description: "Small stones - used in filtration and as a symbol of the prima materia.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 6.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const stones = 1 + c * Math.sin(d * theta) * Math.sin(d * phi);
      const irregular = 1 + 0.1 * Math.cos(11 * theta) * Math.cos(7 * phi);
      const radius = a * b * Math.sin(phi) * stones * irregular;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 6.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_lye: {
    name: "🧪 Lye",
    description: "Potassium hydroxide - caustic alkali used in soap making and purification.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      const caustic = 0.35 + 0.1 * h * (1 + c);
      const corrosive = 1 + 0.05 * Math.sin(12 * theta);
      const r = a * b * caustic * corrosive;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  alchemy_magnet: {
    name: "🧲 Magnet",
    description: "Lodestone - the magnetic stone representing attraction and polarity.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.2;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 1;
      const horseshoe = 0.4 * (1 - Math.abs(h) * 0.3);
      const poles = c * Math.abs(Math.cos(theta)) * (Math.abs(h) > 0.7 ? 1 : 0);
      const fieldLines = 0.1 * Math.sin(4 * theta) * (1 - Math.abs(h));
      const r = a * b * (horseshoe + poles + fieldLines);
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.2, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  alchemy_manure: {
    name: "🌱 Manure",
    description: "Organic matter - representing putrefaction and the nigredo stage.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.3;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v - 0.3;
      const mound = 0.5 * Math.exp(-h * h * 2) * (1 + c * Math.sin(5 * theta));
      const organic = 1 + 0.15 * Math.sin(7 * theta + 3 * h);
      const r = a * b * mound * organic;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a * 0.6;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.3, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_soap: {
    name: "🧼 Soap",
    description: "Saponified fat - symbol of purification and the albedo stage.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 1.5 - 0.5;
      const bar = 0.4 * (1 + c * Math.cos(4 * theta));
      const smooth = 1.0;
      const r = a * b * bar * smooth;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  alchemy_soot: {
    name: "⬛ Soot",
    description: "Carbon residue - black powder left from incomplete combustion.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.25;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const particles = 1 + c * Math.sin(9 * theta) * Math.sin(7 * phi);
      const carbon = 0.9 + 0.1 * Math.cos(5 * theta);
      const radius = a * b * Math.sin(phi) * particles * carbon;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.25, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_sugar: {
    name: "🍬 Sugar",
    description: "Sweet crystals - representing the sweetness of the completed work.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.15;
      const d = params.d ?? 4.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const crystalline = 1 + c * Math.cos(d * theta) * Math.cos(d * phi);
      const faceted = Math.max(0.9, Math.abs(Math.cos(6 * theta)));
      const radius = a * b * Math.sin(phi) * crystalline * faceted;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi);

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.15, d: 4.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  },

  alchemy_urine: {
    name: "💛 Urine",
    description: "Human urine - surprisingly important in alchemy for extracting phosphorus.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.1;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const h = v * 2 - 0.5;
      const flask = 0.3 + 0.15 * Math.sin((h + 0.5) * Math.PI) * (1 + c);
      const liquid = 1 + 0.05 * Math.sin(6 * theta);
      const r = a * b * flask * liquid;
      
      const x = r * Math.cos(theta) + d;
      const y = r * Math.sin(theta);
      const z = h * a;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.1, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 36 
    })
  },

  alchemy_eggshells: {
    name: "🥚 Eggshells",
    description: "Calcined eggshells - source of pure calcium carbite.",
    equation: (u, v, params) => {
      const a = params.a ?? 1.0;
      const b = params.b ?? 1.0;
      const c = params.c ?? 0.08;
      const d = params.d ?? 0.0;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const eggShape = a * b * Math.sin(phi) * (1 + 0.2 * Math.cos(phi));
      const shell = 1 + c * Math.sin(12 * theta) * Math.sin(8 * phi);
      const radius = eggShape * shell;
      
      const x = radius * Math.cos(theta) + d;
      const y = radius * Math.sin(theta);
      const z = a * Math.cos(phi) * 1.1;

      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ 
      a: 1.0, b: 1.0, c: 0.08, d: 0.0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, 
      uSegments: 64, vSegments: 32 
    })
  }
};

export const ALCHEMICAL_CATEGORY = {
  id: 'alchemical-symbols',
  name: '⚗️ Alchemical Symbols',
  description: 'Ancient symbols of elements, planets, metals, and mystical substances from medieval alchemy',
  shapes: Object.keys(ALCHEMICAL_SYMBOL_SHAPES)
};

console.log(`⚗️ Alchemical Symbol Shapes loaded: ${Object.keys(ALCHEMICAL_SYMBOL_SHAPES).length} shapes`);
console.log('   🔺 Four Elements: Fire, Water, Air, Earth');
console.log('   ☉ Celestial Bodies: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune');
console.log('   🥇 Metals: Gold, Silver, Copper, Iron, Tin, Lead, Platinum');
console.log('   ⚗️ Substances: Sulfur, Salt, Aqua Regia, Cinnabar, Vitriol, Quicksilver, and more');
console.log('   🔴 Great Work Stages: Nigredo, Albedo, Citrinitas, Rubedo');
console.log('   🐍 Mystical: Philosopher\'s Stone, Ouroboros, Caduceus, Athanor, Alembic, Crucible');
