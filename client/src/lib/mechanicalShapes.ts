/**
 * INDUSTRIAL & MECHANICAL SHAPES
 * Gears, turbine blades, pump geometries
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const MECHANICAL_SHAPES: Record<string, ParametricSurface> = {
  // Spur gear
  spur_gear: {
    name: "⚙️ Spur Gear",
    equation: (u, v, params) => {
      const teeth = Math.floor(params.a ?? 20);
      const pitchRadius = params.b ?? 2;
      const toothHeight = params.c ?? 0.3;
      const thickness = 0.5;
      
      const z = (v - 0.5) * thickness;
      const angle = u * 2 * Math.PI;
      
      // Generate tooth profile
      const toothAngle = (2 * Math.PI) / teeth;
      const toothIndex = Math.floor((angle / (2 * Math.PI)) * teeth);
      const localAngle = angle - toothIndex * toothAngle;
      
      // Involute tooth profile (simplified)
      let radius;
      const toothWidth = toothAngle * 0.4;
      if (localAngle < toothWidth) {
        // Tooth
        const toothU = localAngle / toothWidth;
        radius = pitchRadius + toothHeight * Math.sin(toothU * Math.PI);
      } else {
        // Root
        radius = pitchRadius - toothHeight * 0.3;
      }
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 20, b: 2, c: 0.3,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 16
    }
  },

  // Helical gear
  helical_gear: {
    name: "🌀 Helical Gear",
    equation: (u, v, params) => {
      const teeth = Math.floor(params.a ?? 20);
      const pitchRadius = params.b ?? 2;
      const helixAngle = params.c ?? 0.5; // radians
      const toothHeight = 0.3;
      const thickness = 1;
      
      const z = (v - 0.5) * thickness;
      
      // Helix twist
      const helixTwist = z * helixAngle;
      const angle = u * 2 * Math.PI + helixTwist;
      
      // Tooth profile
      const toothAngle = (2 * Math.PI) / teeth;
      const toothIndex = Math.floor((angle / (2 * Math.PI)) * teeth);
      const localAngle = angle - toothIndex * toothAngle;
      
      let radius;
      const toothWidth = toothAngle * 0.4;
      if (localAngle < toothWidth) {
        const toothU = localAngle / toothWidth;
        radius = pitchRadius + toothHeight * Math.sin(toothU * Math.PI);
      } else {
        radius = pitchRadius - toothHeight * 0.3;
      }
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 20, b: 2, c: 0.5,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 24
    }
  },

  // Bevel gear
  bevel_gear: {
    name: "📐 Bevel Gear",
    equation: (u, v, params) => {
      const teeth = Math.floor(params.a ?? 16);
      const outerRadius = params.b ?? 2;
      const coneAngle = params.c ?? 0.7; // radians
      const toothHeight = 0.25;
      
      // Cone shape
      const radius = outerRadius * (1 - v * 0.6);
      const z = v * outerRadius * Math.sin(coneAngle);
      
      const angle = u * 2 * Math.PI;
      
      // Tooth profile on cone
      const toothAngle = (2 * Math.PI) / teeth;
      const toothIndex = Math.floor((angle / (2 * Math.PI)) * teeth);
      const localAngle = angle - toothIndex * toothAngle;
      
      let effectiveRadius;
      const toothWidth = toothAngle * 0.4;
      if (localAngle < toothWidth) {
        const toothU = localAngle / toothWidth;
        effectiveRadius = radius + toothHeight * (1 - v) * Math.sin(toothU * Math.PI);
      } else {
        effectiveRadius = radius - toothHeight * 0.3 * (1 - v);
      }
      
      const x = effectiveRadius * Math.cos(angle);
      const y = effectiveRadius * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 16, b: 2, c: 0.7,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 32
    }
  },

  // Turbine blade (axial)
  turbine_blade_axial: {
    name: "🌊 Turbine Blade (Axial)",
    equation: (u, v, params) => {
      const bladeLength = params.a ?? 3;
      const twist = params.b ?? 1; // Twist angle in radians
      const chord = params.c ?? 1; // Blade width
      
      const spanwise = v; // 0 at hub, 1 at tip
      const chordwise = u; // 0 at leading edge, 1 at trailing
      
      // Airfoil cross-section (simplified NACA profile)
      const thickness = 0.12 * chord * (
        0.2969 * Math.sqrt(chordwise) -
        0.1260 * chordwise -
        0.3516 * chordwise * chordwise +
        0.2843 * chordwise * chordwise * chordwise -
        0.1015 * chordwise * chordwise * chordwise * chordwise
      );
      
      // Twist varies along span
      const localTwist = twist * spanwise;
      
      const x = chordwise * chord;
      const yFlat = (u < 0.5 ? 1 : -1) * thickness;
      const z = spanwise * bladeLength;
      
      // Apply twist
      const y = yFlat * Math.cos(localTwist) - (chordwise - 0.5) * chord * Math.sin(localTwist);
      const xTwisted = x * Math.cos(localTwist) + yFlat * Math.sin(localTwist);
      
      return [xTwisted, y, z];
    },
    defaultParams: {
      a: 3, b: 1, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Centrifugal pump impeller
  centrifugal_impeller: {
    name: "💨 Centrifugal Impeller",
    equation: (u, v, params) => {
      const blades = Math.floor(params.a ?? 6);
      const outerRadius = params.b ?? 2.5;
      const innerRadius = params.c ?? 0.8;
      const thickness = 0.4;
      
      const bladeIndex = Math.floor(v * blades);
      const bladeAngle = (bladeIndex * 2 * Math.PI) / blades;
      const localV = (v * blades) % 1;
      
      // Radial position
      const r = innerRadius + (outerRadius - innerRadius) * u;
      
      // Blade curve (backward-curved)
      const bladeCurve = -0.8 * u;
      const angle = bladeAngle + bladeCurve;
      
      // Blade thickness
      const bladeThick = 0.08;
      const normalOffset = (localV - 0.5) * bladeThick;
      
      const x = r * Math.cos(angle) - normalOffset * Math.sin(angle);
      const y = r * Math.sin(angle) + normalOffset * Math.cos(angle);
      const z = (u - 0.5) * thickness;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 6, b: 2.5, c: 0.8,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  }
};
