/**
 * CLIENT-SIDE UNIFIED MATH SYMBOLS
 * Mirrors backend unified math system for frontend shape selection
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

// Helper function to create default parameters
const getDefaults = (params: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> => ({
  a: 2, b: 2, c: 2, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
  n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
  uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64,
  ...params
});

// GEOMETRY SYMBOLS
export const GEOMETRY_SYMBOLS: Record<string, ParametricSurface> = {
  coordinate_x_axis: {
    name: "📏 X-Axis Coordinate Line",
    equation: (u, v, params) => {
      const length = params.a ?? 5;
      const x = (u - 0.5) * length * 2;
      const thickness = 0.05;
      return [x, Math.cos(v * Math.PI * 2) * thickness, Math.sin(v * Math.PI * 2) * thickness];
    },
    defaultParams: getDefaults({ a: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },
  
  coordinate_y_axis: {
    name: "📏 Y-Axis Coordinate Line",
    equation: (u, v, params) => {
      const length = params.b ?? 5;
      const y = (u - 0.5) * length * 2;
      const thickness = 0.05;
      return [Math.cos(v * Math.PI * 2) * thickness, y, Math.sin(v * Math.PI * 2) * thickness];
    },
    defaultParams: getDefaults({ b: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },
  
  coordinate_z_axis: {
    name: "📏 Z-Axis Coordinate Line",
    equation: (u, v, params) => {
      const length = params.c ?? 5;
      const z = (u - 0.5) * length * 2;
      const thickness = 0.05;
      return [Math.cos(v * Math.PI * 2) * thickness, Math.sin(v * Math.PI * 2) * thickness, z];
    },
    defaultParams: getDefaults({ c: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  golden_ratio_spiral: {
    name: "φ Golden Ratio Spiral (Time-Rotating)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const time = params.time || 0;  // Time parameter for rotation
      const phi = 1.618033988749;
      const angle = u * Math.PI * 4 + time * 0.5;  // Rotate with time
      const spiralRadius = Math.pow(phi, v * 2);
      
      const x = a * spiralRadius * Math.cos(angle) / 5;
      const y = a * spiralRadius * Math.sin(angle) / 5;
      const z = (v - 0.5) * phi * 2;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 5, time: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  }
};

// EMOJI 3D MESHES
export const EMOJI_3D_MESHES: Record<string, ParametricSurface> = {
  fire_emoji_mesh: {
    name: "🔥 Fire Volumetric Flame",
    equation: (u, v, params) => {
      const intensity = params.a ?? 2;
      const flicker = params.d ?? 0.3;
      
      const theta = u * Math.PI * 2;
      const height = v;
      
      // Flame shape with turbulence
      const baseRadius = (1 - height) * intensity;
      const turbulence = Math.sin(theta * 5 + height * 10) * flicker * (1 - height);
      const radius = Math.max(0.1, baseRadius + turbulence);
      
      const x = radius * Math.cos(theta);
      const y = height * intensity * 2;
      const z = radius * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, d: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 })
  },

  wave_emoji_mesh: {
    name: "🌊 Wave Sinusoidal Surface (Time-Evolving)",
    equation: (u, v, params) => {
      const lambda = params.a ?? 2;
      const omega = params.b ?? 1;
      const amplitude = params.c ?? 1;
      const time = params.time || 0;  // Time parameter for wave animation
      
      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      // 2D wave propagation with time
      const z = amplitude * Math.sin(x * lambda - time) * Math.cos(y * omega - time * 0.5);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, b: 1, c: 1, time: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  star_emoji_mesh: {
    name: "⭐ Star Parametric Shape",
    equation: (u, v, params) => {
      const baseR = params.a ?? 2;
      const points = 5;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Star shape in polar coordinates
      const r = baseR * (1 + 0.3 * Math.sin(points * theta));
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  spiral_emoji_mesh: {
    name: "🌀 Logarithmic Spiral",
    equation: (u, v, params) => {
      const a = params.a ?? 0.2;
      const scale = params.b ?? 2;
      
      const theta = u * Math.PI * 6;
      const r = scale * Math.exp(a * theta);
      const thickness = v * 0.1;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = theta * 0.3 + Math.cos(v * Math.PI * 2) * thickness;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 0.2, b: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 })
  },

  heart_emoji_mesh: {
    name: "❤️ Heart Cardioid Shape",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Heart shape parametric equations
      const x = scale * Math.sin(theta) * Math.cos(phi) * Math.sin(phi);
      const y = scale * (Math.cos(theta) * Math.sin(phi) - 0.5);
      const z = scale * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  lightning_emoji_mesh: {
    name: "⚡ Lightning Bolt",
    equation: (u, v, params) => {
      const height = params.a ?? 3;
      const segments = 8;
      
      const segmentIndex = Math.floor(u * segments);
      const localU = (u * segments) - segmentIndex;
      
      // Zigzag pattern
      const offset = (segmentIndex % 2) * 0.5 - 0.25;
      const x = offset + (Math.random() - 0.5) * 0.1;
      const y = u * height;
      const z = Math.sin(v * Math.PI * 2) * 0.05;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 8 })
  },

  diamond_emoji_mesh: {
    name: "💎 Diamond Gem",
    equation: (u, v, params) => {
      const size = params.a ?? 2;
      const facets = 8;
      
      const theta = u * Math.PI * 2;
      const height = (v - 0.5) * 2;
      
      // Diamond cut shape
      const radius = size * (1 - Math.abs(height)) * (1 + 0.1 * Math.cos(facets * theta));
      
      const x = radius * Math.cos(theta);
      const y = height * size;
      const z = radius * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  }
};

// TRIGONOMETRY WAVE FUNCTIONS
export const TRIG_WAVE_FUNCTIONS: Record<string, ParametricSurface> = {
  sine_wave_surface: {
    name: "〰️ Sine Wave Function (Time-Evolving)",
    equation: (u, v, params) => {
      const frequency = params.a ?? 2;
      const amplitude = params.b ?? 1;
      const time = params.time || 0;  // Time parameter for wave propagation
      
      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      // Wave propagates with time
      const z = amplitude * Math.sin(x * frequency - time * Math.PI);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, b: 1, time: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  cosine_wave_surface: {
    name: "〰️ Cosine Wave Function",
    equation: (u, v, params) => {
      const frequency = params.a ?? 2;
      const amplitude = params.b ?? 1;
      
      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      const z = amplitude * Math.cos(x * frequency);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, b: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  tangent_wave_surface: {
    name: "〰️ Tangent Wave Function",
    equation: (u, v, params) => {
      const frequency = params.a ?? 1;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 10;
      const z = Math.min(3, Math.max(-3, Math.tan(x * frequency)));
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  }
};

// SPECIAL MATHEMATICAL CONSTANTS
export const SPECIAL_CONSTANTS: Record<string, ParametricSurface> = {
  phi_constant_visualization: {
    name: "φ PHI Golden Ratio (1.618)",
    equation: (u, v, params) => {
      const a = params.a ?? 5;
      const phi = 1.618033988749;
      const angle = u * Math.PI * 2;
      const spiralRadius = Math.pow(phi, v * 3);
      
      const x = a * spiralRadius * Math.cos(angle) / 5;
      const y = a * spiralRadius * Math.sin(angle) / 5;
      const z = (v - 0.5) * phi * 2;
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 })
  },

  ton_202_visualization: {
    name: "TON 202 Constant (1.202)",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const tonValue = 1.202;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const r = scale * tonValue;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  },

  ton_618_visualization: {
    name: "TON 618 Constant (1.618)",
    equation: (u, v, params) => {
      const scale = params.a ?? 2;
      const tonValue = 1.618;
      
      const theta = u * Math.PI * 2;
      const height = (v - 0.5) * 4;
      
      const r = scale * tonValue * (1 - Math.abs(height) / 4);
      const x = r * Math.cos(theta);
      const y = height;
      const z = r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getDefaults({ a: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1 })
  }
};

// COMBINED EXPORT
export const UNIFIED_MATH_SYMBOLS = {
  ...GEOMETRY_SYMBOLS,
  ...EMOJI_3D_MESHES,
  ...TRIG_WAVE_FUNCTIONS,
  ...SPECIAL_CONSTANTS
};
