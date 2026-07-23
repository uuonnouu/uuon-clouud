/**
 * ASTRONOMICAL OBJECTS
 * Asteroids, planetary rings, and galaxy morphologies
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const ASTRONOMICAL_OBJECTS: Record<string, ParametricSurface> = {
  // Rubble pile asteroid
  rubble_pile_asteroid: {
    name: "☄️ Rubble Pile Asteroid",
    equation: (u, v, params) => {
      const size = params.a ?? 2;
      const roughness = params.b ?? 0.4;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Irregular shape using multiple spherical harmonics
      const r = size * (1 +
        roughness * 0.3 * Math.sin(3 * theta) * Math.cos(2 * phi) +
        roughness * 0.2 * Math.cos(5 * theta) * Math.sin(4 * phi) +
        roughness * 0.25 * Math.sin(2 * theta) * Math.cos(3 * phi) +
        roughness * 0.15 * Math.cos(4 * theta) * Math.sin(5 * phi)
      );
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 0.4, c: 1,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 80, vSegments: 32
    }
  },

  // Contact binary asteroid (two lobes touching)
  contact_binary_asteroid: {
    name: "🥜 Contact Binary Asteroid",
    equation: (u, v, params) => {
      const lobeSize = params.a ?? 1;
      const separation = params.b ?? 1.5;
      const roughness = params.c ?? 0.2;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Two lobes
      const lobe = u < 0.5 ? -1 : 1;
      const localU = u < 0.5 ? u * 2 : (u - 0.5) * 2;
      const localTheta = localU * Math.PI;
      
      // Rough surface
      const r = lobeSize * (1 + roughness * (
        Math.sin(3 * localTheta) * Math.cos(2 * phi) +
        Math.cos(4 * localTheta) * Math.sin(3 * phi)
      ));
      
      const x = lobe * separation / 2 + r * Math.sin(localTheta) * Math.cos(phi);
      const y = r * Math.sin(localTheta) * Math.sin(phi);
      const z = r * Math.cos(localTheta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 1, b: 1.5, c: 0.2,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // Elongated asteroid (Oumuamua-style)
  elongated_asteroid: {
    name: "🚀 Elongated Asteroid",
    equation: (u, v, params) => {
      const length = params.a ?? 6;
      const width = params.b ?? 1;
      const roughness = params.c ?? 0.15;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Cigar shape with variations
      const alongAxis = (u - 0.5) * length;
      const crossSection = width * Math.sin(theta) * (1 + roughness * Math.sin(5 * u * Math.PI));
      
      const x = alongAxis;
      const y = crossSection * Math.cos(phi);
      const z = crossSection * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 6, b: 1, c: 0.15,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 32
    }
  },

  // Saturn-style planetary ring
  planetary_ring: {
    name: "🪐 Planetary Ring",
    equation: (u, v, params) => {
      const innerRadius = params.a ?? 2;
      const outerRadius = params.b ?? 4;
      const thickness = params.c ?? 0.05;
      
      const radius = innerRadius + (outerRadius - innerRadius) * u;
      const angle = v * 2 * Math.PI;
      
      // Slight vertical variation (ring particles)
      const verticalVariation = thickness * (Math.sin(v * Math.PI * 100) * 0.5);
      
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const z = verticalVariation;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 2, b: 4, c: 0.05,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  },

  // Spiral galaxy
  spiral_galaxy: {
    name: "🌌 Spiral Galaxy",
    equation: (u, v, params) => {
      const diskRadius = params.a ?? 5;
      const armTightness = params.b ?? 2;
      const thickness = params.c ?? 0.3;
      
      const r = u * diskRadius;
      const spiralAngle = v * 2 * Math.PI + armTightness * Math.log(u + 0.1);
      
      // Spiral arms (logarithmic spiral)
      const armWidth = 0.3;
      const armIndex = Math.floor(v * 2); // 2 main arms
      const localAngle = spiralAngle + armIndex * Math.PI;
      
      // Density varies along arm
      const armDensity = Math.exp(-Math.pow((v * 2 - armIndex - 0.5) / armWidth, 2));
      
      // Vertical distribution (thin disk)
      const verticalProfile = thickness * Math.exp(-Math.pow(r / diskRadius, 2)) * (Math.random() - 0.5);
      
      const x = r * Math.cos(localAngle);
      const y = r * Math.sin(localAngle);
      const z = verticalProfile * armDensity;
      
      return [x, y, z];
    },
    defaultParams: {
      a: 5, b: 2, c: 0.3,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 48, vSegments: 48
    }
  },

  // Elliptical galaxy
  elliptical_galaxy: {
    name: "⚪ Elliptical Galaxy",
    equation: (u, v, params) => {
      const semiMajor = params.a ?? 3;
      const semiMinor = params.b ?? 2;
      const eccentricity = params.c ?? 0.7;
      
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      
      // Ellipsoidal distribution
      const r = 1 / Math.sqrt(
        Math.pow(Math.sin(theta) * Math.cos(phi) / semiMajor, 2) +
        Math.pow(Math.sin(theta) * Math.sin(phi) / semiMajor, 2) +
        Math.pow(Math.cos(theta) / semiMinor, 2)
      );
      
      const density = Math.exp(-r / semiMajor);
      
      const x = density * r * Math.sin(theta) * Math.cos(phi);
      const y = density * r * Math.sin(theta) * Math.sin(phi);
      const z = density * r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: {
      a: 3, b: 2, c: 0.7,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1,
      uSegments: 64, vSegments: 48
    }
  }
};
