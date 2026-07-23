/**
 * WEATHER SYSTEMS & ATMOSPHERIC PHENOMENA
 * Hurricane structure, tornado vortex, cloud formations
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const WEATHER_SYSTEMS: Record<string, ParametricSurface> = {
  // Hurricane structure with eye wall and spiral bands
  hurricane_structure: {
    name: "🌀 Hurricane Structure",
    equation: (u, v, params) => {
      const outerRadius = params.a ?? 5;
      const eyeRadius = params.b ?? 0.8;
      const height = params.c ?? 3;
      
      const r = u * outerRadius;
      const angle = v * 2 * Math.PI;
      const spiralTurns = 3;
      
      // Logarithmic spiral for rain bands
      const spiralAngle = angle - spiralTurns * Math.log(r + 0.1);
      
      // Eye wall (strongest winds)
      const eyeWallPeak = Math.exp(-Math.pow((r - eyeRadius) / 0.3, 2));
      
      // Vertical structure (higher near eye wall)
      const verticalHeight = height * eyeWallPeak * (1 - Math.pow(u - 0.2, 2));
      
      const x = r * Math.cos(spiralAngle);
      const y = r * Math.sin(spiralAngle);
      const z = verticalHeight;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 5, b: 0.8, c: 3,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // Tornado vortex funnel
  tornado_vortex: {
    name: "🌪️ Tornado Vortex",
    equation: (u, v, params) => {
      const baseRadius = params.a ?? 0.5;
      const topRadius = params.b ?? 2;
      const height = params.c ?? 5;
      
      const z = u * height;
      const angle = v * 2 * Math.PI;
      
      // Funnel shape (wider at top, narrow at bottom)
      const radius = baseRadius + (topRadius - baseRadius) * u;
      
      // Spiral rotation (increases with height)
      const spiralAngle = angle + u * 4 * Math.PI;
      
      // Surface perturbations (turbulence)
      const turbulence = 0.1 * Math.sin(u * height * 10) * Math.cos(v * 8 * Math.PI);
      
      const x = (radius + turbulence) * Math.cos(spiralAngle);
      const y = (radius + turbulence) * Math.sin(spiralAngle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 0.5, b: 2, c: 5,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 32
    }
  },

  // Cumulonimbus anvil cloud
  cumulonimbus_anvil: {
    name: "☁️ Cumulonimbus Anvil",
    equation: (u, v, params) => {
      const baseWidth = params.a ?? 2;
      const anvilWidth = params.b ?? 5;
      const height = params.c ?? 4;
      
      const z = u * height;
      const angle = v * 2 * Math.PI;
      
      // Tapers up then spreads out (anvil shape)
      let radius;
      if (u < 0.7) {
        // Rising column
        radius = baseWidth * (1 - u * 0.3);
      } else {
        // Anvil spreading
        const anvilU = (u - 0.7) / 0.3;
        radius = baseWidth * 0.8 + (anvilWidth - baseWidth * 0.8) * anvilU;
      }
      
      // Billowing texture
      const billows = 0.2 * Math.sin(u * Math.PI * 5) * Math.cos(v * Math.PI * 8);
      
      const x = (radius + billows) * Math.cos(angle);
      const y = (radius + billows) * Math.sin(angle);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 5, c: 4,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Mammatus clouds (pouch-like structures)
  mammatus_clouds: {
    name: "🫧 Mammatus Clouds",
    equation: (u, v, params) => {
      const spacing = params.a ?? 1.5;
      const pouchDepth = params.b ?? 0.6;
      const baseHeight = params.c ?? 2;
      
      // Grid of pouches
      const gridX = Math.floor(u * 3);
      const gridY = Math.floor(v * 3);
      const localU = (u * 3) % 1;
      const localV = (v * 3) % 1;
      
      // Each pouch is a hanging bulge
      const centerDist = Math.sqrt(
        Math.pow(localU - 0.5, 2) + 
        Math.pow(localV - 0.5, 2)
      );
      
      const pouchProfile = pouchDepth * Math.exp(-centerDist * 6);
      
      const x = (gridX - 1.5) * spacing + (localU - 0.5) * spacing;
      const y = (gridY - 1.5) * spacing + (localV - 0.5) * spacing;
      const z = baseHeight - pouchProfile;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1.5, b: 0.6, c: 2,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 72, vSegments: 36
    }
  },

  // Lenticular wave clouds
  lenticular_cloud: {
    name: "🛸 Lenticular Cloud",
    equation: (u, v, params) => {
      const length = params.a ?? 4;
      const width = params.b ?? 2;
      const thickness = params.c ?? 0.4;
      
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      // Lens/disk shape
      const x = length * Math.cos(theta) * Math.sin(phi);
      const y = width * Math.sin(theta) * Math.sin(phi);
      const z = thickness * Math.cos(phi);
      
      // Smooth layered structure
      const layers = 0.05 * Math.sin(phi * 10);
      
      return [x, y, z + layers];
    },
    defaultParams: {
      a: 4, b: 2, c: 0.4,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 32
    }
  }
};
