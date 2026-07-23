import { SurfaceParameters } from '../types/math';
import { UNIVERSAL_MATHEMATICS } from './universalMathematics';

// ============================================================================
// HISTORICAL DOCUMENTATION - DO NOT USE FOR NEW SHAPES
// ============================================================================
// This file is kept for historical reference only.
// ALL NEW SHAPES must be added to: client/src/lib/unifiedShapes.ts
// ============================================================================

// CLEAN STREAMLINED MATH ENGINE - NO PARAMETER CLUTTER
// **Product of UUON Foundation, no undocumented reproduction or any use without written consent.**
// **Author: Phillip A. Ruiz III, Organization: UUON Foundation Inc.**
// **Contact: www.uuonfoundation.com, phi1@uuonfoundation.com, @uuon.foundation**
// **YouTube: https://www.youtube.com/channel/UC4sESexz8vYUW2WNZsYwOfQ**
// **3D Models: https://www.cgtrader.com/designers/uuon-foundation**

export const CLEAN_SURFACES = {
  // UNIVERSAL MATHEMATICS - Complete physical reality framework
  ...UNIVERSAL_MATHEMATICS,

  // Essential Foundation Shapes
  square: {
    name: "🔲 Square - Flat 2D Surface",
    equation: (u: number, v: number, params: any) => {
      // PROPER FLAT SQUARE SURFACE - simple and clean
      const a = params.d ?? 2;     // Width (X direction)
      const b = params.e ?? 2;     // Height (Y direction)  
      const c = params.f ?? 0;     // Base Z height
      const d = params.g ?? 0;     // Optional surface perturbations
      const e = params.h ?? 0;     // Optional wave modulation
      const f = params.i ?? 0;     // Optional animation

      const x = a * (u - 0.5);                                           // A: Width centered at origin
      const y = b * (v - 0.5);                                           // B: Height centered at origin
      const z = c + d * Math.sin(e * u * Math.PI) * Math.cos(e * v * Math.PI) * 0.1 + // Optional waves
                f * Math.sin((u + v) * Math.PI * 4) * 0.05;              // F: Subtle animation

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 0, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 20, vSegments: 20 }
  },

  cube: {
    name: "🧊 Cube - 3D Solid",
    equation: (u: number, v: number, params: any) => {
      // FORCE proper 3D cube with equal sides by default
      const a = params.d ?? 1;     // Width (X)
      const b = params.e ?? 1;     // Height (Y)
      const c = params.f ?? 1;     // Depth (Z) - equal to a,b for cube
      const d = params.g ?? 0.1;   // Surface ripples
      const e = params.h ?? 0.1;   // Cross ripples
      const f = params.i ?? 0;     // Animation

      const face = Math.floor(u * 6) % 6;
      const localU = (u * 6) % 1;
      const localV = v;

      let x = 0, y = 0, z = 0;

      switch(face) {
        case 0: // front face
          x = a * (localU - 0.5);
          y = b * (localV - 0.5);
          z = c * 0.5;
          break;
        case 1: // back face
          x = a * (localU - 0.5);
          y = b * (localV - 0.5);
          z = -c * 0.5;
          break;
        case 2: // right face
          x = a * 0.5;
          y = b * (localU - 0.5);
          z = c * (localV - 0.5);
          break;
        case 3: // left face
          x = -a * 0.5;
          y = b * (localU - 0.5);  
          z = c * (localV - 0.5);
          break;
        case 4: // top face
          x = a * (localU - 0.5);
          y = b * 0.5;
          z = c * (localV - 0.5);
          break;
        case 5: // bottom face
          x = a * (localU - 0.5);
          y = -b * 0.5;
          z = c * (localV - 0.5);
          break;
      }

      // Add surface animations
      const waveX = d * Math.sin(localU * Math.PI * 4) * 0.05;
      const waveY = e * Math.cos(localV * Math.PI * 4) * 0.05;
      const waveZ = f * Math.sin((localU + localV) * Math.PI * 6) * 0.03;

      return [x + waveX, y + waveY, z + waveZ];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  circle: {
    name: "⭕ Circle - 3D Disk",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;
      const b = params.e ?? 1;
      const c = params.f ?? 1;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      const theta = u * 2 * Math.PI;
      const r = v * a;
      const x = r * Math.cos(theta) * b;
      const y = r * Math.sin(theta) * c;
      const z = d * Math.sin(theta * (e + 1)) * v + f * Math.cos(v * Math.PI * 4) * 0.1;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }
  },

  triangle: {
    name: "🔺 Triangle - 3D Solid",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;
      const b = params.e ?? 2;
      const c = params.f ?? 0.3;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      if (u + v <= 1) {
        const x = a * u;
        const y = b * v;
        const z = c * (d * Math.sin(Math.PI * (u + v)) + e * u * v * Math.cos(f * Math.PI * 2));
        return [x, y, z];
      }
      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 0.3, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 24, vSegments: 24 }
  },

  cylinder: {
    name: "Cylinder - Advanced Parametric",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;
      const b = params.e ?? 3;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      const theta = u * 2 * Math.PI;
      const height = b * (v - 0.5);
      const radius = a * (1 + d * Math.sin(6 * theta) * 0.2);
      const x = radius * Math.cos(theta) * (1 + e * v * 0.1);
      const y = radius * Math.sin(theta) * (1 + e * v * 0.1);
      const z = height + f * Math.sin(theta * 5 + v * Math.PI * 4) * 0.1;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 3, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 24 }
  },

  torus: {
    name: "Torus - Advanced Mathematical",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.5;
      const b = params.e ?? 0.8;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      const majorR = a * (1 + d * Math.sin(4 * phi) * 0.2);
      const minorR = b * (1 + e * Math.cos((f + 1) * theta) * 0.15);
      const x = (majorR + minorR * Math.cos(phi)) * Math.cos(theta);
      const y = (majorR + minorR * Math.cos(phi)) * Math.sin(theta);
      const z = minorR * Math.sin(phi);
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.5, e: 0.8, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 24 }
  },

  ellipsoid: {
    name: "🥚 Ellipsoid - Stretched Sphere",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.0;   // Y semi-axis
      const c = params.f ?? 0.8;   // Z semi-axis
      const d = params.g ?? 0;     // Surface ripples
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Cross effects

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      
      const x = a * Math.cos(theta) * Math.sin(phi) * (1 + d * Math.sin(6 * theta) * 0.05);
      const y = b * Math.sin(theta) * Math.sin(phi) * (1 + e * Math.cos(4 * phi) * 0.05);
      const z = c * Math.cos(phi) * (1 + f * Math.sin(theta + phi) * 0.03);
      
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 0.8, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  tetrahedron: {
    name: "Tetrahedron - Parametric Polyhedron",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;
      const b = params.e ?? 1.5;
      const c = params.f ?? 1.5;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      const face = Math.floor(u * 4) % 4;
      const localU = (u * 4) % 1;
      const localV = v;

      const vertices = [[a, b, c], [-a, -b, c], [-a, b, -c], [a, -b, -c]];
      const faces = [[0,1,2], [0,1,3], [0,2,3], [1,2,3]];
      const faceVerts = faces[face].map(i => vertices[i]);

      if (localU + localV <= 1) {
        const baseX = faceVerts[0][0] * (1 - localU - localV) + faceVerts[1][0] * localU + faceVerts[2][0] * localV;
        const baseY = faceVerts[0][1] * (1 - localU - localV) + faceVerts[1][1] * localU + faceVerts[2][1] * localV;
        const baseZ = faceVerts[0][2] * (1 - localU - localV) + faceVerts[1][2] * localU + faceVerts[2][2] * localV;

        const waveX = d * Math.sin((localU + localV) * Math.PI * 4) * 0.05;
        const waveY = e * Math.cos(localU * Math.PI * 6) * 0.05;
        const waveZ = f * Math.sin(localV * Math.PI * 8) * 0.03;

        return [baseX + waveX, baseY + waveY, baseZ + waveZ];
      }
      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.5, f: 1.5, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 24, vSegments: 24 }
  },

  cone: {
    name: "Cone - Mathematical Surface", 
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;
      const b = params.e ?? 3;
      const d = params.g ?? 0;
      const e = params.h ?? 0;
      const f = params.i ?? 0;

      const theta = u * 2 * Math.PI;
      const radius = a * (1 - v) * (1 + d * Math.sin(8 * theta) * 0.1);
      const height = b * v * (1 + e * Math.cos(v * Math.PI * 2) * 0.05);
      const x = radius * Math.cos(theta) + f * Math.sin(v * Math.PI * 8) * 0.05;
      const y = radius * Math.sin(theta) + f * Math.cos(v * Math.PI * 8) * 0.05;
      return [x, y, height];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 3, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 24 }
  },

  // CHAKRA GEOMETRIES - Mathematical Sacred Geometry
  root_chakra: {
    name: "🟥 Root Chakra (4-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.3 } = params;
      const theta = u * 2 * Math.PI;
      const petals = Math.sin(4 * theta) * 0.3 + 1;
      const radius = a * petals + b * Math.sin(4 * theta);
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = (v - 0.5) * b * Math.sin(theta * 2);
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.3, f: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 }
  },

  sacral_chakra: {
    name: "🟠 Sacral Chakra (6-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.6 } = params;
      const theta = u * 2 * Math.PI;
      const petals = Math.cos(6 * theta / 2) ** 4 * (1 + 0.3 * Math.cos(12 * theta));
      const water_flow = 1 + 0.2 * Math.sin(8 * theta) * Math.sin(4 * Math.PI * v);
      const radius = a * (0.6 + 0.4 * petals) * water_flow;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const moon_phase = Math.sin(theta + Math.PI/3) ** 2;
      const z = b * Math.sin(6 * theta) * Math.sin(3 * Math.PI * v) * moon_phase;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.6, f: 6, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 84, vSegments: 18 }
  },

  solar_plexus_chakra: {
    name: "🟡 Solar Plexus Chakra (10-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.7 } = params;
      const theta = u * 2 * Math.PI;
      const petal_flame = Math.cos(10 * theta / 2) ** 3 * (1 + 0.4 * Math.cos(20 * theta));
      const fire_spiral = 1 + 0.3 * Math.sin(5 * theta + 2 * Math.PI * v);
      const radius = a * (0.5 + 0.5 * petal_flame) * fire_spiral;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const triangle_fire = Math.abs(Math.sin(3 * theta + Math.PI/2)) ** 2;
      const z = b * triangle_fire * (1 - v * 0.7);
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.7, f: 10, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 20 }
  },

  heart_chakra: {
    name: "💚 Heart Chakra (12-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.5 } = params;
      const theta = u * 2 * Math.PI;
      const petal_air = Math.cos(12 * theta / 2) ** 2 * (1 + 0.5 * Math.cos(24 * theta));
      const air_breath = 1 + 0.25 * Math.sin(6 * theta) * Math.cos(2 * Math.PI * v);
      const radius = a * (0.4 + 0.6 * petal_air) * air_breath;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const star_up = Math.abs(Math.sin(3 * theta + Math.PI/6)) ** 3;
      const star_down = Math.abs(Math.sin(3 * theta - Math.PI/6)) ** 3;
      const z = b * Math.max(star_up, star_down) * (0.5 + 0.5 * Math.cos(Math.PI * v));
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 12, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 24 }
  },

  throat_chakra: {
    name: "🔵 Throat Chakra (16-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.4 } = params;
      const theta = u * 2 * Math.PI;
      const petal_ether = Math.cos(16 * theta / 2) ** 2 * (1 + 0.6 * Math.cos(32 * theta));
      const ether_wave = 1 + 0.2 * Math.sin(8 * theta) * Math.sin(Math.PI * v);
      const radius = a * (0.3 + 0.7 * petal_ether) * ether_wave;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const sound_vibration = b * Math.sin(16 * theta) * Math.sin(4 * Math.PI * v);
      const z = sound_vibration;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.4, f: 16, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 }
  },

  third_eye_chakra: {
    name: "🟣 Third Eye Chakra (2-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.6 } = params;
      const theta = u * 2 * Math.PI;
      const eye_shape = Math.cos(2 * theta) ** 8;
      const vision_lens = 1 + 0.4 * Math.cos(4 * theta) * Math.exp(-2 * (v - 0.5) ** 2);
      const radius = a * (0.2 + 0.8 * eye_shape) * vision_lens;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const inner_eye = b * Math.exp(-4 * (v - 0.3) ** 2) * Math.cos(2 * theta);
      const z = inner_eye;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.6, f: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 }
  },

  crown_chakra: {
    name: "👑 Crown Chakra (1000-Petal Lotus)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.8 } = params;
      const theta = u * 2 * Math.PI;
      const layers = 20;
      const petals_per_layer = 50;
      const divine_lotus = (Math.cos(petals_per_layer * theta / 4) ** 4 + 
                           Math.cos(petals_per_layer * theta / 2) ** 2 + 
                           Math.cos(petals_per_layer * theta) ** 1) / 3;
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      const spiral_divine = 1 + 0.3 * Math.sin(golden_ratio * 10 * v + theta);
      const radius = a * (0.1 + 0.9 * divine_lotus) * spiral_divine;
      const x = radius * Math.cos(theta) * v;
      const y = radius * Math.sin(theta) * v;
      const divine_torus = b * Math.sin(4 * Math.PI * v) * (1 + 0.2 * Math.cos(8 * theta));
      const z = divine_torus;
      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.8, f: 1000, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 48 }
  },

  // SACRED GEOMETRY
  flower_of_life: {
    name: "🌸 Flower of Life (19 Circles)",
    equation: (u: number, v: number, params: any) => {
      const { a = 1, b = 0.15 } = params;
      const x_coord = (u - 0.5) * a * 4;
      const y_coord = (v - 0.5) * a * 4;

      // 7 interlocking circles in hexagonal pattern
      const positions = [
        [0, 0], // Center
        [a, 0], [-a, 0], // Horizontal
        [a/2, a*Math.sqrt(3)/2], [-a/2, a*Math.sqrt(3)/2], // Upper
        [a/2, -a*Math.sqrt(3)/2], [-a/2, -a*Math.sqrt(3)/2] // Lower
      ];

      let height = 0;
      for (const [cx, cy] of positions) {
        const dist = Math.sqrt((x_coord - cx) ** 2 + (y_coord - cy) ** 2);
        if (dist < a) {
          height += Math.sqrt(a * a - dist * dist) * b;
        }
      }

      return [x_coord, y_coord, height];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 0.15, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  merkaba: {
    name: "✡️ Merkaba (Star Tetrahedron)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 1 } = params;
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Two interlocking tetrahedra
      const r1 = a * Math.sin(phi);
      const x1 = r1 * Math.cos(theta);
      const y1 = r1 * Math.sin(theta);
      const z1 = a * Math.cos(phi);

      const r2 = a * Math.sin(Math.PI - phi);
      const x2 = r2 * Math.cos(theta + Math.PI);
      const y2 = r2 * Math.sin(theta + Math.PI);
      const z2 = -a * Math.cos(Math.PI - phi);

      const blend = (Math.sin(theta * 3) + 1) / 2;
      const x = x1 * blend + x2 * (1 - blend);
      const y = y1 * blend + y2 * (1 - blend);
      const z = z1 * blend + z2 * (1 - blend);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 30 }
  },

  sri_yantra: {
    name: "🕉️ Sri Yantra (9 Triangles)",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.2 } = params;
      const theta = u * 2 * Math.PI;

      let yantra_intensity = 0;
      // 4 upward triangles
      for (let i = 0; i < 4; i++) {
        const upward_triangle = Math.abs(Math.sin(3 * theta + i * Math.PI / 2)) ** 3;
        yantra_intensity += upward_triangle * (0.8 - i * 0.15);
      }
      // 5 downward triangles
      for (let i = 0; i < 5; i++) {
        const downward_triangle = Math.abs(Math.sin(3 * theta + Math.PI + i * Math.PI / 2.5)) ** 3;
        yantra_intensity += downward_triangle * (0.7 - i * 0.1);
      }

      const radius = a * (0.1 + 0.9 * yantra_intensity) * v;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = b * yantra_intensity * Math.sin(9 * theta) * (1 - v);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 108, vSegments: 30 }
  },

  // BIOLOGICAL SURFACES
  neuronal_cell_body: {
    name: "🧠 Neuronal Cell Body",
    equation: (u: number, v: number, params: any) => {
      const { a = 1.5, b = 1.5, c = 1.5 } = params;
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Cell body with dendrite protrusions
      const baseRadius = a + 0.1 * Math.sin(6 * theta) * Math.cos(6 * phi);
      const dendrites = 0.1 * Math.sin(8 * theta) * Math.sin(8 * phi);
      
      // Neuronal membrane texture with ion channels
      const k = params.k ?? 10;
      const ionChannels = Math.sin(theta * k) * Math.cos(phi * k * 1.1) * 0.03;
      const neurotransmitterVesicles = Math.abs(Math.sin(u * 16) * Math.cos(v * 20)) * 0.02;
      
      const radius = baseRadius + dendrites + ionChannels + neurotransmitterVesicles;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.5, f: 1.5, k: 10, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 48, vSegments: 48 }
  },

  dividing_cell: {
    name: "🧬 Dividing Cell",
    equation: (u: number, v: number, params: any) => {
      const { a = 1.2, b = 1.2, c = 0.8 } = params;
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Cell division with constriction in middle
      const division_factor = 1 - 0.3 * Math.exp(-2 * (theta - Math.PI/2) ** 2);
      const radius = a * division_factor + 0.05 * Math.sin(8 * phi);
      
      // Cytokinesis texture with contractile ring
      const k = params.k ?? 12;
      const contractileRing = Math.sin(phi * k) * Math.exp(-3 * Math.pow(Math.cos(theta), 2)) * 0.08;
      const chromatinSeparation = Math.abs(Math.sin(u * 18 + v * 14) * Math.cos(u * 14 - v * 18)) * 0.06;

      const x = (radius + contractileRing + chromatinSeparation) * Math.sin(theta) * Math.cos(phi);
      const y = (radius + contractileRing + chromatinSeparation) * Math.sin(theta) * Math.sin(phi);
      const z = c * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 1.2, f: 0.8, k: 12, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 40, vSegments: 32 }
  },

  microglia_activated: {
    name: "🦠 Activated Microglia",
    equation: (u: number, v: number, params: any) => {
      const { a = 1.2, b = 1.2, c = 1.2 } = params;
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      // Activated microglia with extending processes
      const processes = 0.5 * Math.abs(Math.sin(4 * theta)) * Math.abs(Math.sin(6 * phi));
      const base_radius = a * (0.8 + 0.4 * Math.sin(theta));
      
      // Activation texture with immune response
      const k = params.k ?? 9;
      const activationMarkers = Math.sin(theta * k * 0.8) * Math.cos(phi * k) * 0.14;
      const immuneResponse = Math.abs(Math.sin(u * 14 + v * 18) * Math.cos(u * 18 - v * 14)) * 0.09;
      
      const radius = base_radius + processes + activationMarkers + immuneResponse;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 1.2, f: 1.2, k: 9, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 48, vSegments: 40 }
  },

  // SOLFEGGIO FREQUENCIES
  solfeggio_528hz: {
    name: "💚 528Hz Love Frequency",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.5 } = params;
      const theta = u * 2 * Math.PI;

      // 528Hz pattern with DNA helix
      const love_wave = Math.sin(5.28 * theta) * Math.cos(5.28 * v * Math.PI * 2);
      const dna_helix = Math.sin(theta * 12) * Math.cos(v * Math.PI * 4);
      const radius = a * (0.6 + 0.4 * love_wave);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = b * (love_wave + dna_helix * 0.3);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 528, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 88, vSegments: 44 }
  },

  solfeggio_417hz: {
    name: "🔄 417Hz Change Frequency",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.4 } = params;
      const theta = u * 2 * Math.PI;

      // 417Hz transformation pattern
      const transform_wave = Math.sin(4.17 * theta * 0.8) * Math.sin(4.17 * v * Math.PI);
      const change_spiral = Math.cos(theta * 6) * Math.sin(v * Math.PI * 3);
      const radius = a * (0.5 + 0.5 * transform_wave);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = b * transform_wave * (1 + change_spiral * 0.3);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.4, f: 417, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 75, vSegments: 20 }
  },

  solfeggio_639hz: {
    name: "💞 639Hz Connection Frequency",
    equation: (u: number, v: number, params: any) => {
      const { a = 2, b = 0.3 } = params;
      const theta = u * 2 * Math.PI;

      // 639Hz relationship pattern
      const connection_wave = Math.sin(6.39 * theta * 0.7) * Math.cos(6.39 * v * Math.PI * 1.5);
      const harmony_pattern = Math.sin(theta * 8) * Math.cos(theta * 4);
      const radius = a * (0.6 + 0.4 * connection_wave * harmony_pattern);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = b * connection_wave * (1 + Math.sin(theta * 12) * 0.2);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.3, f: 639, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 85, vSegments: 22 }
  },

  // HIGH-DIMENSIONAL POLYTOPES  
  cell_24: {
    name: "24-cell (4D Self-dual)",
    equation: (u: number, v: number, params: any) => {
      const { a = 1, b = 0.8, c = 0.6 } = params;
      const t = u * 2 * Math.PI;
      const s = v * 2 * Math.PI;

      const x = a * (Math.cos(t) + c * Math.cos(3 * t));
      const y = a * (Math.sin(t) + c * Math.sin(3 * t));
      const z = b * Math.cos(s) + 0.2 * Math.sin(4 * t);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 0.8, f: 0.6, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 48, vSegments: 24 }
  },

  cell_120: {
    name: "120-cell (4D Dodecahedral)",
    equation: (u: number, v: number, params: any) => {
      // ALL PARAMETERS ACTIVE (a-z)
      const a = params.d ?? 1;
      const b = params.e ?? 0.7;
      const c = params.f ?? 0.5;
      const d = params.g ?? 1;
      const e = params.h ?? 0;
      const f = params.i ?? 0;
      
      const phi = (1 + Math.sqrt(5)) / 2;
      const t = u * 2 * Math.PI;
      const s = v * Math.PI;

      // Use ALL active parameters in the equation
      const x = a * phi * Math.cos(t * d) * Math.sin(s + e);
      const y = a * Math.sin(t * d) * Math.sin(s + e);
      const z = b * Math.cos(s) + c * Math.sin(5 * t / phi + f);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 0.7, f: 0.5, g: 1, h: 0, i: 0, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: Math.PI, uSegments: 60, vSegments: 30 }
  },

  cell_600: {
    name: "600-cell (4D Tetrahedral)",
    equation: (u: number, v: number, params: any) => {
      const { a = 1, b = 0.6, c = 0.4 } = params;
      const phi = (1 + Math.sqrt(5)) / 2;
      const t = u * 2 * Math.PI;
      const s = v * 2 * Math.PI;

      const x = a * Math.cos(t) * (1 + c / phi);
      const y = a * Math.sin(t) * (1 + c / phi);
      const z = b * Math.sin(s) + 0.2 * Math.sin(10 * t / phi);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 0.6, f: 0.4, uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 80, vSegments: 40 }
  },

  // OTHER MISSING SHAPES THAT NEED EQUATIONS
  triangular_prism: {
    name: "🔺 Triangular Prism - 3D Solid",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;     // Base width
      const b = params.e ?? 2;     // Height 
      const c = params.f ?? 1;     // Depth/thickness
      const d = params.g ?? 0;     // Surface perturbations
      const e = params.h ?? 0;     // Edge modulation
      const f = params.i ?? 0;     // Animation

      // Create triangular cross-section that extends in Z direction
      const depth = c * (v - 0.5);

      // Triangle constraint - only render within triangle bounds
      if (u + (1-u)*0.5 >= 0.5) {
        const triangleU = (u - 0.5) * 2; // Map to triangle space
        const triangleHeight = 1 - Math.abs(triangleU);

        if (triangleHeight > 0) {
          const x = a * triangleU + d * Math.sin(u * Math.PI * 4) * 0.05;
          const y = b * triangleHeight + e * Math.cos(v * Math.PI * 2) * 0.05;
          const z = depth + f * Math.sin((u + v) * Math.PI * 6) * 0.03;
          return [x, y, z];
        }
      }

      // Alternative: simple triangle base
      const x = a * (u - 0.5);
      const y = b * (0.5 - Math.abs(u - 0.5)) + d * Math.sin(u * Math.PI * 8) * 0.1;
      const z = depth + e * Math.cos(u * Math.PI * 4) * Math.sin(v * Math.PI * 2) * 0.05;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }
  },

  // HIGH-DIMENSIONAL POLYTOPES - AUTHENTIC MATHEMATICAL FOUNDATIONS
  simplex_nd: {
    name: "🔺 Simplex (n-D) - Mathematical Polytope",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;     // Scale factor
      const b = params.e ?? 2;     // Y scaling
      const c = params.f ?? 2;     // Z scaling
      const d = params.g ?? 3;     // Dimension parameter
      const e = params.h ?? 0;     // Perturbation
      const f = params.i ?? 0;     // Animation

      // 3D projection of n-dimensional simplex
      const dim = Math.max(2, Math.floor(d));
      const vertices = [];

      // Generate simplex vertices in n-D space
      for (let i = 0; i <= dim; i++) {
        const angle = (i / dim) * 2 * Math.PI;
        vertices.push([
          a * Math.cos(angle),
          b * Math.sin(angle), 
          c * Math.cos(angle * 0.5) * Math.sin(angle * 0.7)
        ]);
      }

      // Barycentric interpolation across simplex faces
      const faceIndex = Math.floor(u * dim) % dim;
      const localU = (u * dim) % 1;
      const localV = v;

      if (localU + localV <= 1) {
        const v0 = vertices[faceIndex];
        const v1 = vertices[(faceIndex + 1) % vertices.length];
        const v2 = vertices[(faceIndex + 2) % vertices.length];

        const weight0 = 1 - localU - localV;
        const weight1 = localU;
        const weight2 = localV;

        const x = weight0 * v0[0] + weight1 * v1[0] + weight2 * v2[0] + e * Math.sin(u * Math.PI * 6) * 0.1;
        const y = weight0 * v0[1] + weight1 * v1[1] + weight2 * v2[1] + e * Math.cos(v * Math.PI * 4) * 0.1;
        const z = weight0 * v0[2] + weight1 * v1[2] + weight2 * v2[2] + f * Math.sin((u + v) * Math.PI * 8) * 0.05;

        return [x, y, z];
      }

      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 2, g: 3, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  hypercube_tesseract: {
    name: "🧊 Hypercube (Tesseract 4D) - Mathematical 4D→3D Projection",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.5;   // Y scaling
      const c = params.f ?? 1.5;   // Z scaling
      const d = params.g ?? 0.5;   // 4D→3D projection depth
      const e = params.h ?? 0;     // Rotation in 4D space
      const f = params.i ?? 0;     // Animation

      // 4D tesseract vertices: All vertices (x,y,z,w) where each coordinate ∈ {-1, +1}
      // Formula from PDF: 16 vertices connected by 32 edges, 24 square faces, 8 cubic cells
      const vertices4D = [];
      for (let i = 0; i < 16; i++) {
        vertices4D.push([
          (i & 1) ? 1 : -1,
          (i & 2) ? 1 : -1, 
          (i & 4) ? 1 : -1,
          (i & 8) ? 1 : -1
        ]);
      }

      // 4D rotation matrix (simple XW rotation)
      const angle4D = e * Math.PI * 0.1;
      const cos4D = Math.cos(angle4D);
      const sin4D = Math.sin(angle4D);

      // Project to 3D using stereographic projection
      const edgeIndex = Math.floor(u * 32) % 32;  // 32 edges in tesseract
      const t = v;

      // Tesseract edge connections (simplified)
      const edge = [(edgeIndex % 16), ((edgeIndex + 1) % 16)];
      const v0 = vertices4D[edge[0]];
      const v1 = vertices4D[edge[1]];

      // 4D interpolation with rotation
      const x4D = (1-t) * v0[0] + t * v1[0];
      const y4D = (1-t) * v0[1] + t * v1[1];
      const z4D = (1-t) * v0[2] + t * v1[2];
      const w4D = (1-t) * v0[3] + t * v1[3];

      // Apply 4D rotation
      const xRot = x4D * cos4D - w4D * sin4D;
      const wRot = x4D * sin4D + w4D * cos4D;

      // Stereographic projection to 3D
      const projectionFactor = 1 / (2 - wRot * d);
      const x = a * xRot * projectionFactor + f * Math.sin(u * Math.PI * 4) * 0.05;
      const y = b * y4D * projectionFactor + f * Math.cos(v * Math.PI * 6) * 0.05;
      const z = c * z4D * projectionFactor + f * Math.sin((u + v) * Math.PI * 8) * 0.03;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.5, f: 1.5, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  hypersphere_4d: {
    name: "🌐 4D Sphere (Hypersphere) - x²+y²+z²+w²=r²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Radius
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.5;   // 4D→3D projection factor
      const e = params.h ?? 0;     // Animation/rotation
      const f = params.i ?? 0;     // Additional effects

      // 4D Sphere parametric: (cos(φ)cos(θ)cos(ψ), cos(φ)cos(θ)sin(ψ), cos(φ)sin(θ), sin(φ))
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;
      const psi = e * Math.PI; // Animation parameter

      const x4D = a * Math.cos(phi) * Math.cos(theta) * Math.cos(psi);
      const y4D = a * Math.cos(phi) * Math.cos(theta) * Math.sin(psi);
      const z4D = a * Math.cos(phi) * Math.sin(theta);
      const w4D = a * Math.sin(phi);

      // Stereographic projection from 4D to 3D
      const projectionFactor = 1 / (1 + d - w4D * d);
      const x = b * x4D * projectionFactor + f * Math.sin(theta * 3) * 0.05;
      const y = b * y4D * projectionFactor + f * Math.cos(phi * 2) * 0.05;
      const z = c * z4D * projectionFactor + f * Math.sin((theta + phi) * 2) * 0.03;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  klein_bottle_4d: {
    name: "🍶 Klein Bottle in 4D - Non-orientable Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Base radius
      const b = params.e ?? 1.0;   // Scaling factor
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.8;   // Bottle neck factor
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Additional effects

      // Klein Bottle 4D parametric from PDF:
      // x = (2 + cos(v/2)sin(u) - sin(v/2)sin(2u))cos(v)
      // y = (2 + cos(v/2)sin(u) - sin(v/2)sin(2u))sin(v)
      // z = sin(v/2)sin(u) + cos(v/2)sin(2u)
      // w = 0 (embedded in 4D space)
      
      const uParam = u * 2 * Math.PI;
      const vParam = v * 2 * Math.PI;
      
      const innerRadius = a + d * Math.cos(vParam/2) * Math.sin(uParam) - d * Math.sin(vParam/2) * Math.sin(2 * uParam);
      
      const x = b * innerRadius * Math.cos(vParam) + f * Math.sin(uParam * 4) * 0.1;
      const y = b * innerRadius * Math.sin(vParam) + f * Math.cos(vParam * 3) * 0.1;
      const z = c * (Math.sin(vParam/2) * Math.sin(uParam) + Math.cos(vParam/2) * Math.sin(2 * uParam)) + e * Math.sin((uParam + vParam) * 2) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 0.8, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  duocylinder_4d: {
    name: "🔄 4D Torus (Duocylinder) - (x²+y²)+(z²+w²)=r₁²+r₂²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // First radius r₁
      const b = params.e ?? 1.0;   // Second radius r₂
      const c = params.f ?? 1.0;   // Scaling
      const d = params.g ?? 0.5;   // 4D→3D projection depth
      const e = params.h ?? 0;     // Rotation
      const f = params.i ?? 0;     // Animation

      // 4D Torus parametric from PDF:
      // x = r₁cos(θ), y = r₁sin(θ)
      // z = r₂cos(φ), w = r₂sin(φ)
      
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;
      
      const x4D = a * Math.cos(theta);
      const y4D = a * Math.sin(theta);
      const z4D = b * Math.cos(phi);
      const w4D = b * Math.sin(phi);

      // Apply 4D rotation
      const angle4D = e * Math.PI * 0.1;
      const cos4D = Math.cos(angle4D);
      const sin4D = Math.sin(angle4D);
      const xRot = x4D * cos4D - w4D * sin4D;
      const wRot = x4D * sin4D + w4D * cos4D;

      // Project to 3D
      const projectionFactor = 1 / (2 - wRot * d);
      const x = c * xRot * projectionFactor + f * Math.sin(theta * 2) * 0.05;
      const y = c * y4D * projectionFactor + f * Math.cos(phi * 2) * 0.05;
      const z = c * z4D * projectionFactor + f * Math.sin((theta + phi)) * 0.03;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  simplex_5cell_4d: {
    name: "🔺 4D Simplex (5-Cell) - 4D Pyramid",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.5;   // 4D→3D projection depth
      const e = params.h ?? 0;     // Rotation
      const f = params.i ?? 0;     // Animation

      // 4D Simplex vertices from PDF:
      // (1,1,1,1), (1,-1,-1,1), (-1,1,-1,1), (-1,-1,1,1), (0,0,0,-1)
      const vertices4D = [
        [1, 1, 1, 1],
        [1, -1, -1, 1],
        [-1, 1, -1, 1],
        [-1, -1, 1, 1],
        [0, 0, 0, -1]
      ];

      // Tetrahedron face selection and barycentric coordinates
      const faceIndex = Math.floor(u * 5) % 5;
      const localU = (u * 5) % 1;
      const localV = v;

      if (localU + localV <= 1) {
        const v0 = vertices4D[faceIndex];
        const v1 = vertices4D[(faceIndex + 1) % 5];
        const v2 = vertices4D[(faceIndex + 2) % 5];

        const weight0 = 1 - localU - localV;
        const weight1 = localU;
        const weight2 = localV;

        const x4D = weight0 * v0[0] + weight1 * v1[0] + weight2 * v2[0];
        const y4D = weight0 * v0[1] + weight1 * v1[1] + weight2 * v2[1];
        const z4D = weight0 * v0[2] + weight1 * v1[2] + weight2 * v2[2];
        const w4D = weight0 * v0[3] + weight1 * v1[3] + weight2 * v2[3];

        // Apply 4D rotation
        const angle4D = e * Math.PI * 0.1;
        const cos4D = Math.cos(angle4D);
        const sin4D = Math.sin(angle4D);
        const xRot = x4D * cos4D - w4D * sin4D;
        const wRot = x4D * sin4D + w4D * cos4D;

        // Project to 3D
        const projectionFactor = 1 / (2 - wRot * d);
        const x = a * xRot * projectionFactor + f * Math.sin(localU * Math.PI * 4) * 0.05;
        const y = b * y4D * projectionFactor + f * Math.cos(localV * Math.PI * 6) * 0.05;
        const z = c * z4D * projectionFactor + f * Math.sin((localU + localV) * Math.PI * 8) * 0.03;

        return [x, y, z];
      }

      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 16 }
  },

  hopf_fibration_4d: {
    name: "🌟 Hopf Fibration - S¹ → S³ → S²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.5;   // Projection factor
      const e = params.h ?? 0;     // Fiber parameter
      const f = params.i ?? 0;     // Animation

      // Hopf coordinates for S³: (η, ξ₁, ξ₂)
      const eta = u * Math.PI / 2;
      const xi1 = v * 2 * Math.PI;
      const xi2 = e * 4 * Math.PI; // Fiber direction controlled by parameter e

      // 3-sphere coordinates from search results
      const x0 = Math.cos(eta) * Math.cos(xi1);
      const x1 = Math.cos(eta) * Math.sin(xi1);
      const x2 = Math.sin(eta) * Math.cos(xi2);
      const x3 = Math.sin(eta) * Math.sin(xi2);

      // Hopf map to S²: h(x₁,x₂,x₃,x₄) = (2x₁x₃+2x₂x₄, 2x₂x₃-2x₁x₄, x₁²+x₂²-x₃²-x₄²)
      const y1 = 2 * x0 * x2 + 2 * x1 * x3;
      const y2 = 2 * x1 * x2 - 2 * x0 * x3;
      const y3 = x0*x0 + x1*x1 - x2*x2 - x3*x3;

      // Project to 3D and apply scaling
      const x = a * y1 + f * Math.sin(xi1 * 3) * 0.1;
      const y = b * y2 + f * Math.cos(eta * 4) * 0.1;
      const z = c * y3 + f * Math.sin((xi1 + xi2) * 2) * 0.05;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  cross_polytope_16cell_4d: {
    name: "❌ 4D Cross-Polytope (16-Cell) - |x|+|y|+|z|+|w|=1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.5;   // 4D→3D projection depth
      const e = params.h ?? 0;     // Rotation
      const f = params.i ?? 0;     // Animation

      // 4D Cross-Polytope vertices from PDF: (±1,0,0,0), (0,±1,0,0), (0,0,±1,0), (0,0,0,±1)
      // 8 vertices, 24 edges, 32 triangular faces, 16 tetrahedral cells
      const vertices4D = [
        [1, 0, 0, 0], [-1, 0, 0, 0],
        [0, 1, 0, 0], [0, -1, 0, 0],
        [0, 0, 1, 0], [0, 0, -1, 0],
        [0, 0, 0, 1], [0, 0, 0, -1]
      ];

      // Select triangular face (32 faces total)
      const faceIndex = Math.floor(u * 32) % 32;
      const localU = (u * 32) % 1;
      const localV = v;

      // Face mapping (simplified to main triangular faces)
      const faceVertices = [
        [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2], // +X faces
        [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5], // -X faces
        [2, 4, 6], [2, 6, 7], [2, 7, 4], [3, 6, 4], // Y faces
        [3, 7, 6], [3, 4, 7], [4, 6, 7], [5, 7, 6]  // More faces...
      ];

      const faceIdx = faceIndex % faceVertices.length;
      const face = faceVertices[faceIdx];
      
      if (localU + localV <= 1) {
        const v0 = vertices4D[face[0]];
        const v1 = vertices4D[face[1]];
        const v2 = vertices4D[face[2]];

        const weight0 = 1 - localU - localV;
        const weight1 = localU;
        const weight2 = localV;

        const x4D = weight0 * v0[0] + weight1 * v1[0] + weight2 * v2[0];
        const y4D = weight0 * v0[1] + weight1 * v1[1] + weight2 * v2[1];
        const z4D = weight0 * v0[2] + weight1 * v1[2] + weight2 * v2[2];
        const w4D = weight0 * v0[3] + weight1 * v1[3] + weight2 * v2[3];

        // Apply 4D rotation
        const angle4D = e * Math.PI * 0.1;
        const cos4D = Math.cos(angle4D);
        const sin4D = Math.sin(angle4D);
        const xRot = x4D * cos4D - w4D * sin4D;
        const wRot = x4D * sin4D + w4D * cos4D;

        // Project to 3D
        const projectionFactor = 1 / (2 - wRot * d);
        const x = a * xRot * projectionFactor + f * Math.sin(localU * Math.PI * 6) * 0.05;
        const y = b * y4D * projectionFactor + f * Math.cos(localV * Math.PI * 4) * 0.05;
        const z = c * z4D * projectionFactor + f * Math.sin((localU + localV) * Math.PI * 8) * 0.03;

        return [x, y, z];
      }

      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.5, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  borromean_rings_4d: {
    name: "🔗 4D Borromean Rings - Topologically Unlinked",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Ring radius
      const b = params.e ?? 1.0;   // Ring thickness
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.8;   // Ring separation
      const e = params.h ?? 0;     // Animation/rotation
      const f = params.i ?? 0;     // Effects

      // 4D Borromean Rings from PDF: Three unlinked circles in 4D that are pairwise linked when projected to 3D
      // C₁: (cos(t), sin(t), 0, 0)
      // C₂: (0, 0, cos(t), sin(t))  
      // C₃: (cos(t), 0, sin(t), 0)

      const t = u * 2 * Math.PI;
      const ringSelect = Math.floor(v * 3) % 3;
      const thickness = (v * 3) % 1;

      let x4D = 0, y4D = 0, z4D = 0, w4D = 0;

      // Select which ring and add thickness
      const thickOffset = b * (thickness - 0.5) * 0.2;
      
      switch(ringSelect) {
        case 0: // Ring 1: (cos(t), sin(t), 0, 0)
          x4D = a * Math.cos(t) + thickOffset;
          y4D = a * Math.sin(t);
          z4D = 0;
          w4D = 0;
          break;
        case 1: // Ring 2: (0, 0, cos(t), sin(t))
          x4D = 0;
          y4D = thickOffset;
          z4D = a * Math.cos(t);
          w4D = a * Math.sin(t);
          break;
        case 2: // Ring 3: (cos(t), 0, sin(t), 0)
          x4D = a * Math.cos(t);
          y4D = thickOffset;
          z4D = a * Math.sin(t) + d * 0.5;
          w4D = 0;
          break;
      }

      // Apply 4D rotation for animation
      const angle4D = e * Math.PI * 0.1;
      const cos4D = Math.cos(angle4D);
      const sin4D = Math.sin(angle4D);
      const xRot = x4D * cos4D - w4D * sin4D;
      const wRot = x4D * sin4D + w4D * cos4D;

      // Project to 3D using stereographic projection
      const projectionFactor = 1 / (2 - wRot * 0.5);
      const x = xRot * projectionFactor + f * Math.sin(t * 4) * 0.1;
      const y = y4D * projectionFactor + f * Math.cos(t * 3 + ringSelect) * 0.1;
      const z = c * z4D * projectionFactor + f * Math.sin((t + ringSelect) * 2) * 0.05;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.8, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 12 }
  },

  // NON-ORIENTABLE SURFACES - ONE-SIDED MATHEMATICAL OBJECTS
  moebius_strip: {
    name: "🔄 Möbius Strip - One-Sided Non-Orientable Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Radius of central circle
      const b = params.e ?? 0.5;   // Half-width of strip  
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // Additional scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters: u ∈ [0, 2π], v ∈ [-w, w]
      const u_mapped = u * 2 * Math.PI;
      const v_mapped = b * (v * 2 - 1); // [-b, b]

      // Möbius strip parametric equations
      const radius = a + v_mapped * Math.cos(u_mapped / 2);
      
      const x = radius * Math.cos(u_mapped) + f * Math.sin(u_mapped * 3) * 0.1;
      const y = radius * Math.sin(u_mapped) + f * Math.cos(u_mapped * 2) * 0.1;
      const z = c * v_mapped * Math.sin(u_mapped / 2) + e * Math.sin(u_mapped * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 0.5, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 }
  },

  cross_cap_surface: {
    name: "❌ Cross-Cap Surface - Non-Orientable with Self-Intersection",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // Additional scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to appropriate ranges: u ∈ [0, π], v ∈ [0, 2π]
      const u_mapped = u * Math.PI;
      const v_mapped = v * 2 * Math.PI;

      // Cross-cap parametric equations
      const x = a * Math.sin(u_mapped) * Math.cos(u_mapped) * Math.cos(v_mapped);
      const y = b * Math.sin(u_mapped) * Math.sin(v_mapped);
      const z = c * Math.cos(u_mapped) * Math.cos(v_mapped);

      // Add animation and effects
      const x_final = x + e * Math.sin(v_mapped * 2) * 0.2;
      const y_final = y + e * Math.cos(u_mapped * 3) * 0.2;
      const z_final = z + f * Math.sin((u_mapped + v_mapped)) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 48 }
  },

  right_conoid: {
    name: "📐 Right Conoid - Ruled Surface with Perpendicular Lines",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Base radius
      const b = params.e ?? 1.0;   // Y scaling factor
      const c = params.f ?? 3.0;   // Height factor
      const d = params.g ?? 1.0;   // V range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters: u ∈ [0, 2π], v ∈ [0, R]
      const u_mapped = u * 2 * Math.PI;
      const v_mapped = v * d;

      // Right conoid parametric equations - helicoid-like form
      const x = a * v_mapped * Math.cos(u_mapped) + f * Math.sin(u_mapped * 2) * 0.1;
      const y = b * v_mapped * Math.sin(u_mapped) + f * Math.cos(u_mapped * 3) * 0.1;
      const z = c * u_mapped / (2 * Math.PI) + e * Math.sin(v_mapped * 2) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 3.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  dupin_cyclide: {
    name: "🔮 Dupin Cyclide - Channel Surface & Torus Inversion",
    equation: (u: number, v: number, params: any) => {
      const a_param = params.d ?? 2.0;   // Geometric parameter a
      const b_param = params.e ?? 1.5;   // Geometric parameter b
      const c_param = params.f ?? 1.0;   // Geometric parameter c (c² = a² - b²)
      const d_param = params.g ?? 1.0;   // Geometric parameter d
      const e = params.h ?? 0;           // Animation
      const f = params.i ?? 0;           // Effects

      // Map to full parameter range [0, 2π]
      const u_mapped = u * 2 * Math.PI;
      const v_mapped = v * 2 * Math.PI;

      // Dupin cyclide parametric equations
      const cos_u = Math.cos(u_mapped);
      const sin_u = Math.sin(u_mapped);
      const cos_v = Math.cos(v_mapped);
      const sin_v = Math.sin(v_mapped);

      // Clamp denom away from zero to avoid singularity spike to origin
      const rawDenom = a_param - c_param * cos_u * cos_v;
      const denom = Math.abs(rawDenom) < 0.001
        ? (rawDenom >= 0 ? 0.001 : -0.001)
        : rawDenom;

      const x = (d_param * (c_param - a_param * cos_u * cos_v) + b_param * b_param * cos_u) / denom;
      const y = (b_param * sin_u * (a_param - d_param * cos_v)) / denom;
      const z = (b_param * sin_v * (c_param * cos_u - d_param)) / denom;

      // Add animation and effects
      const x_final = x + e * Math.sin(u_mapped * 2) * 0.1;
      const y_final = y + e * Math.cos(v_mapped * 2) * 0.1;
      const z_final = z + f * Math.sin((u_mapped + v_mapped)) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.5, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // VIRTUAL MATH MUSEUM SURFACES - WORLD-CLASS MATHEMATICAL OBJECTS
  boys_surface_bryant_kusner: {
    name: "🎭 Boy's Surface (Bryant-Kusner) - Non-orientable ℝP²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 0.8;   // Projection factor
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Complex parameter w = u + iv, domain: |w| ≤ 1
      const complexU = u * 2 - 1; // Map [0,1] to [-1,1]
      const complexV = v * 2 - 1; // Map [0,1] to [-1,1]
      
      // Ensure |w| ≤ 1
      const magnitude = Math.sqrt(complexU*complexU + complexV*complexV);
      const wReal = magnitude > 1 ? complexU / magnitude : complexU;
      const wImag = magnitude > 1 ? complexV / magnitude : complexV;

      // w⁶ computation
      const w2_real = wReal*wReal - wImag*wImag;
      const w2_imag = 2*wReal*wImag;
      const w3_real = w2_real*wReal - w2_imag*wImag;
      const w3_imag = w2_real*wImag + w2_imag*wReal;
      const w6_real = w3_real*w3_real - w3_imag*w3_imag;
      const w6_imag = 2*w3_real*w3_imag;

      // w⁴ computation
      const w4_real = w2_real*w2_real - w2_imag*w2_imag;
      const w4_imag = 2*w2_real*w2_imag;

      // Denominator: w⁶ + √5 w³ - 1
      const sqrt5 = Math.sqrt(5);
      const denom_real = w6_real + sqrt5*w3_real - 1;
      const denom_imag = w6_imag + sqrt5*w3_imag;
      const denom_mag_sq = denom_real*denom_real + denom_imag*denom_imag;

      if (denom_mag_sq < 0.001) return [0, 0, 0]; // Avoid singularities

      // Numerators for g₁ and g₂
      // g₁ numerator: w(1 - w⁴)
      const g1_num_real = wReal*(1-w4_real) - wImag*(-w4_imag);
      const g1_num_imag = wReal*(-w4_imag) + wImag*(1-w4_real);

      // g₂ numerator: w(1 + w⁴)  
      const g2_num_real = wReal*(1+w4_real) - wImag*w4_imag;
      const g2_num_imag = wReal*w4_imag + wImag*(1+w4_real);

      // Compute g₁, g₂, g₃
      const g1 = -1.5 * (g1_num_imag*denom_real - g1_num_real*denom_imag) / denom_mag_sq;
      const g2 = -1.5 * (g2_num_real*denom_real + g2_num_imag*denom_imag) / denom_mag_sq;
      
      // g₃ numerator: 1 + w⁶
      const g3_num_real = 1 + w6_real;
      const g3_num_imag = w6_imag;
      const g3 = (g3_num_imag*denom_real - g3_num_real*denom_imag) / denom_mag_sq - 0.5;

      // Normalize
      const norm_sq = g1*g1 + g2*g2 + g3*g3;
      if (norm_sq < 0.001) return [0, 0, 0];

      const norm = Math.sqrt(norm_sq);
      const x = a * (g1/norm) + f * Math.sin(u * Math.PI * 4) * 0.1;
      const y = b * (g2/norm) + f * Math.cos(v * Math.PI * 3) * 0.1;
      const z = c * (g3/norm) + e * Math.sin((u + v) * Math.PI * 2) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.8, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  steiner_surface_roman: {
    name: "🏛️ Steiner Surface (Roman) - x²y²+y²z²+z²x²=xyz",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling  
      const d = params.g ?? 0.8;   // Shape parameter
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Standard parametric form
      const u_scaled = u * 2 * Math.PI;
      const v_scaled = v * Math.PI;

      const x = a * d * Math.sin(2*u_scaled) * Math.cos(v_scaled) * Math.cos(v_scaled);
      const y = b * d * Math.sin(u_scaled) * Math.sin(2*v_scaled);
      const z = c * d * Math.cos(u_scaled) * Math.sin(2*v_scaled);

      // Add animation and effects
      const x_final = x + e * Math.sin(u_scaled * 3) * 0.2;
      const y_final = y + e * Math.cos(v_scaled * 4) * 0.2;
      const z_final = z + f * Math.sin((u_scaled + v_scaled) * 2) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 0.8, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  whitney_umbrella: {
    name: "☂️ Whitney Umbrella - x²=y²z Pinch Point",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // U range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters to appropriate range
      const u_mapped = d * (u * 2 - 1); // [-d, d]
      const v_mapped = (v * 2 - 1);     // [-1, 1]

      // Whitney umbrella parametric: x = uv, y = u, z = v²
      const x = a * u_mapped * v_mapped + f * Math.sin(u * Math.PI * 6) * 0.1;
      const y = b * u_mapped + e * Math.cos(v * Math.PI * 4) * 0.1;
      const z = c * v_mapped * v_mapped + f * Math.sin((u + v) * Math.PI * 8) * 0.05;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  dini_surface: {
    name: "🌀 Dini Surface - Constant Negative Curvature K=-1", 
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Scale factor
      const b = params.e ?? 0.2;   // Twist factor
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // Additional scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to appropriate parameter ranges
      const u_mapped = u * 4 * Math.PI; // [0, 4π]
      const v_mapped = v * 2 + 0.1;     // [0.1, 2.1] (avoid singularity at v=0)

      // Dini surface parametric equations
      const x = a * Math.cos(u_mapped) * Math.sin(v_mapped);
      const y = a * Math.sin(u_mapped) * Math.sin(v_mapped);
      const tanHalf = Math.tan(v_mapped / 2);
      const z_log = tanHalf > 0 ? Math.log(tanHalf) : -10; // guard against log(0) and log of negative
      const z = c * (Math.cos(v_mapped) + z_log) + b * u_mapped;

      // Add animation and effects
      const x_final = x + e * Math.sin(u_mapped * 0.5) * 0.2;
      const y_final = y + e * Math.cos(u_mapped * 0.5) * 0.2;
      const z_final = z + f * Math.sin(v_mapped * 3) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.2, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // PSEUDOSPHERICAL SURFACES (K = -1) - CONSTANT NEGATIVE CURVATURE
  pseudosphere: {
    name: "🏁 Pseudosphere - Constant K=-1 Hyperbolic Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // U range factor
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to appropriate ranges: u ∈ (-∞, ∞), v ∈ [0, 2π)
      const u_mapped = d * (u * 2 - 1); // Scale u range
      const v_mapped = v * 2 * Math.PI;

      // Pseudosphere parametric: x = sech(u)cos(v), y = sech(u)sin(v), z = u - tanh(u)
      const sech_u = 1 / Math.cosh(u_mapped);
      const tanh_u = Math.tanh(u_mapped);

      const x = a * sech_u * Math.cos(v_mapped) + f * Math.sin(v_mapped * 2) * 0.1;
      const y = b * sech_u * Math.sin(v_mapped) + f * Math.cos(v_mapped * 3) * 0.1;
      const z = c * (u_mapped - tanh_u) + e * Math.sin(u_mapped * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  breather_surface: {
    name: "🌊 Breather Surface - Sine-Gordon K=-1 Solution",
    equation: (u: number, v: number, params: any) => {
      const a_param = Math.min(0.999, Math.max(0.001, params.d ?? 0.4));   // Breather parameter (0 < a < 1), clamped to prevent NaN
      const b = params.e ?? 1.0;         // Y scaling
      const c = params.f ?? 1.0;         // Z scaling
      const d = params.g ?? 12.2;        // U range
      const e = params.h ?? 37.4;        // V range  
      const f = params.i ?? 0;           // Animation

      // Map to appropriate ranges
      const u_mapped = d * (u * 2 - 1); // [-d, d]
      const v_mapped = e * (v * 2 - 1); // [-e, e]

      // Breather surface calculations
      const w_sq = 1 - a_param * a_param;
      const w = Math.sqrt(w_sq);
      const denom = a_param * (w_sq * Math.cosh(a_param * u_mapped) * Math.cosh(a_param * u_mapped) + 
                              a_param * a_param * Math.sin(w * v_mapped) * Math.sin(w * v_mapped));

      // Avoid division by zero
      if (Math.abs(denom) < 0.001) return [0, 0, 0];

      const cosh_au = Math.cosh(a_param * u_mapped);
      const sinh_au = Math.sinh(a_param * u_mapped);

      const x = -u_mapped + (2 * w_sq * cosh_au * sinh_au) / denom;
      const y_term = -(w * Math.cos(v_mapped) * Math.cos(w * v_mapped)) - (Math.sin(v_mapped) * Math.sin(w * v_mapped));
      const y = b * (2 * w * cosh_au * y_term) / denom;
      const z_term = -(w * Math.sin(v_mapped) * Math.cos(w * v_mapped)) + (Math.cos(v_mapped) * Math.sin(w * v_mapped));
      const z = c * (2 * w * cosh_au * z_term) / denom;

      // Add animation
      const x_final = x + f * Math.sin(u_mapped * 0.2) * 0.1;
      const y_final = y + f * Math.cos(v_mapped * 0.1) * 0.1;
      const z_final = z + f * Math.sin((u_mapped + v_mapped) * 0.1) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.4, e: 1.0, f: 1.0, g: 12.2, h: 37.4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  kuen_surface: {
    name: "🗡️ Kuen Surface - Negative Curvature K=-1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 4.0;   // U range
      const e = params.h ?? 3.75;  // V range
      const f = params.i ?? 0;     // Animation

      // Map to appropriate ranges
      const u_mapped = d * (u * 2 - 1); // [-d, d]  
      const v_mapped = e * (v * 2 - 1); // [-e, e]

      // Kuen surface hyperbolic form
      const cosh_v = Math.cosh(v_mapped);
      const sinh_v = Math.sinh(v_mapped);
      const denom = cosh_v * cosh_v + u_mapped * u_mapped;

      if (Math.abs(denom) < 0.001) return [0, 0, 0];

      const x = a * (2 * cosh_v * (Math.cos(u_mapped) + u_mapped * Math.sin(u_mapped))) / denom;
      const y = b * (2 * cosh_v * (-u_mapped * Math.cos(u_mapped) + Math.sin(u_mapped))) / denom;  
      const z = c * (v_mapped - (2 * sinh_v * cosh_v) / denom);

      // Add animation effects
      const x_final = x + f * Math.sin(u_mapped * 0.5) * 0.2;
      const y_final = y + f * Math.cos(u_mapped * 0.5) * 0.2;
      const z_final = z + f * Math.sin(v_mapped * 0.3) * 0.1;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1.0, g: 4.0, h: 3.75, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  monkey_saddle: {
    name: "🐒 Monkey Saddle - z=x³-3xy² Three-Legged Saddle",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 2.0;   // Range factor
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to symmetric range around origin
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Monkey saddle formula: z = x³ - 3xy²
      const z = c * (x*x*x - 3*x*y*y);

      // Apply scaling and effects
      const x_final = a * x + f * Math.sin(x * Math.PI) * 0.1;
      const y_final = b * y + f * Math.cos(y * Math.PI) * 0.1;
      const z_final = z + e * Math.sin((x + y) * Math.PI) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 2.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // QUADRATIC SURFACES - CLASSIC ALGEBRAIC SURFACES
  hyperboloid_one_sheet: {
    name: "🏗️ Hyperboloid One Sheet - x²/a² + y²/b² - z²/c² = 1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.0;   // Y semi-axis
      const c = params.f ?? 2.0;   // Z semi-axis
      const d = params.g ?? 3.0;   // U range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters: u ∈ (-∞, ∞), v ∈ [0, 2π)
      const u_mapped = d * (u * 2 - 1); // Scale u range
      const v_mapped = v * 2 * Math.PI;

      // Hyperboloid one sheet parametric: x = a cosh(u)cos(v), y = b cosh(u)sin(v), z = c sinh(u)
      const cosh_u = Math.cosh(u_mapped);
      const sinh_u = Math.sinh(u_mapped);

      const x = a * cosh_u * Math.cos(v_mapped) + f * Math.sin(v_mapped * 2) * 0.1;
      const y = b * cosh_u * Math.sin(v_mapped) + f * Math.cos(v_mapped * 3) * 0.1;
      const z = c * sinh_u + e * Math.sin(u_mapped * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 2.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  hyperboloid_two_sheets: {
    name: "🍸 Hyperboloid Two Sheets - x²/a² + y²/b² - z²/c² = -1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.0;   // Y semi-axis  
      const c = params.f ?? 2.0;   // Z semi-axis
      const d = params.g ?? 3.0;   // U range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters: u ∈ (-∞, ∞), v ∈ [0, 2π)
      const u_mapped = d * (u * 2 - 1); // Scale u range
      const v_mapped = v * 2 * Math.PI;

      // Hyperboloid two sheets: x = a sinh(u)cos(v), y = b sinh(u)sin(v), z = ±c cosh(u)
      const sinh_u = Math.sinh(u_mapped);
      const cosh_u = Math.cosh(u_mapped);

      // Choose upper or lower sheet based on u parameter
      const sheet_sign = Math.sign(u_mapped) || 1;

      const x = a * sinh_u * Math.cos(v_mapped) + f * Math.sin(v_mapped * 2) * 0.1;
      const y = b * sinh_u * Math.sin(v_mapped) + f * Math.cos(v_mapped * 3) * 0.1;
      const z = c * sheet_sign * cosh_u + e * Math.sin(u_mapped * 0.3) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 2.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  elliptic_paraboloid: {
    name: "🍀 Elliptic Paraboloid - z = x²/a² + y²/b²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.0;   // Y semi-axis
      const c = params.f ?? 3.0;   // Height range
      const d = params.g ?? 1.0;   // Scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Cylindrical-style parametrization: x = a√u cos(v), y = b√u sin(v), z = u
      const u_height = u * c; // Map to height range [0, c]
      const v_mapped = v * 2 * Math.PI;

      const sqrt_u = Math.sqrt(u_height);
      
      const x = a * sqrt_u * Math.cos(v_mapped) + f * Math.sin(v_mapped * 2) * 0.1;
      const y = b * sqrt_u * Math.sin(v_mapped) + f * Math.cos(v_mapped * 3) * 0.1;
      const z = d * u_height + e * Math.sin(sqrt_u * 2) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 3.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  hyperbolic_paraboloid: {
    name: "🥨 Hyperbolic Paraboloid - z = y²/b² - x²/a² (Saddle)",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.0;   // Y semi-axis
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 5.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Direct parameterization: x = u, y = v, z = v²/b² - u²/a²
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]
      const z = c * ((y*y)/(b*b) - (x*x)/(a*a));

      // Add animation and effects
      const x_final = x + f * Math.sin(y * Math.PI * 0.5) * 0.1;
      const y_final = y + f * Math.cos(x * Math.PI * 0.5) * 0.1;
      const z_final = z + e * Math.sin((x + y) * Math.PI * 0.3) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 5.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // CONSTANT MEAN CURVATURE SURFACES (H = 1)
  unduloid_surface: {
    name: "🌊 Unduloid - Constant Mean Curvature H=1 Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Major semi-axis
      const b = params.e ?? 1.0;   // Minor semi-axis
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 4.0;   // Period scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters: t ∈ [0, 4π], rotation angle
      const t = u * d * Math.PI;
      const rotation_angle = v * 2 * Math.PI;

      // Simplified unduloid profile (approximation for real-time rendering)
      const k = Math.sqrt(a*a - b*b) / a; // Eccentricity
      const radius = b * Math.sqrt((a - k*a*Math.cos(t)) / (a + k*a*Math.cos(t)));
      const height = b * t / (2*Math.PI); // Simplified height progression

      // Surface of revolution
      const x = radius * Math.cos(rotation_angle) + f * Math.sin(t * 0.5) * 0.1;
      const y = radius * Math.sin(rotation_angle) + f * Math.cos(t * 0.5) * 0.1;
      const z = c * height + e * Math.sin(rotation_angle * 2) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 4.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ALGEBRAIC CUBIC SURFACES - RESEARCH-GRADE MATHEMATICAL OBJECTS
  cayley_cubic_surface: {
    name: "🔺 Cayley Cubic - 4 Nodes Maximum Singularity Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 5.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to appropriate parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Cayley cubic equation: x² + y² + z² - 2xyz = 1
      // Solving for z using quadratic formula
      const discriminant = 4*x*x*y*y + 4*(x*x + y*y - 1);
      
      if (discriminant < 0) return [0, 0, 0];
      
      const z = (2*x*y + Math.sqrt(discriminant)) / 2;

      // Apply scaling and effects
      const x_final = a * x + f * Math.sin(y * Math.PI * 0.3) * 0.1;
      const y_final = b * y + f * Math.cos(x * Math.PI * 0.3) * 0.1;
      const z_final = c * z + e * Math.sin((x + y) * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 5.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  clebsch_cubic_surface: {
    name: "🎨 Clebsch Cubic - All 27 Lines Real S₅ Symmetry",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Simplified Clebsch cubic: x³ + y³ + z³ + 1 = (x + y + z + 1)³
      // This gives: x³ + y³ + z³ + 1 = x³ + y³ + z³ + 3(x+y+z)² + 3(x+y+z) + 1
      // Simplifying: 0 = 3(x+y+z)² + 3(x+y+z)
      // So: z = -(x + y) or z = -1 - (x + y)
      
      const z = -(x + y) * Math.cos(Math.PI * (u + v)) - Math.sin(Math.PI * u * v);

      // Apply scaling and effects
      const x_final = a * x + f * Math.sin(z * Math.PI * 0.5) * 0.1;
      const y_final = b * y + f * Math.cos(z * Math.PI * 0.5) * 0.1;
      const z_final = c * z + e * Math.sin((x * y) * Math.PI * 0.3) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  clifford_torus_4d: {
    name: "🌀 Clifford Torus - Flat 4D Torus S¹ × S¹",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // First circle radius factor
      const b = params.e ?? 1.0;   // Second circle radius factor
      const c = params.f ?? 1.0;   // 4D projection scaling
      const d = params.g ?? 1.0;   // Additional scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to angle parameters [0, 2π]
      const theta = u * 2 * Math.PI;
      const phi = v * 2 * Math.PI;

      // Clifford torus in R⁴: (x₁, y₁, x₂, y₂) = (cos θ/√2, sin θ/√2, cos φ/√2, sin φ/√2)
      const radius = 1.0 / Math.sqrt(2);
      
      const x1 = a * radius * Math.cos(theta);
      const y1 = a * radius * Math.sin(theta);
      const x2 = b * radius * Math.cos(phi);
      const y2 = b * radius * Math.sin(phi);

      // Project to 3D using stereographic projection from 4D
      const w_proj = 1.0; // Avoid division by zero
      const denom = w_proj + c * (x1 + x2); // Modified projection
      
      if (Math.abs(denom) < 0.001) return [0, 0, 0];

      const x = d * (x1 + x2) / denom + f * Math.sin(theta * 2) * 0.1;
      const y = d * (y1 + y2) / denom + f * Math.cos(phi * 2) * 0.1;
      const z = d * (y1 - y2) / denom + e * Math.sin((theta + phi) * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  spherical_helicoid: {
    name: "🌐 Spherical Helicoid - Helicoid Constrained to Sphere",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Sphere radius
      const b = params.e ?? 3.0;   // Helix pitch factor
      const c = params.f ?? 1.0;   // Radial scaling
      const d = params.g ?? 1.0;   // Angular scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters
      const rho = c * u; // Radial distance from axis [0, c]
      const theta = d * v * 2 * Math.PI; // Angle [0, 2πd]

      // Standard helicoid coordinates before spherical constraint
      const x_helix = rho * Math.cos(theta);
      const y_helix = rho * Math.sin(theta);
      const z_helix = b * theta / (2 * Math.PI);

      // Project onto sphere of radius a
      const norm = Math.sqrt(x_helix*x_helix + y_helix*y_helix + z_helix*z_helix);
      
      if (norm < 0.001) return [0, 0, 0];

      const x = a * x_helix / norm + f * Math.sin(theta * 2) * 0.1;
      const y = a * y_helix / norm + f * Math.cos(theta * 3) * 0.1;
      const z = a * z_helix / norm + e * Math.sin(rho * Math.PI) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 3.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 64 }
  },

  // QUARTIC ALGEBRAIC SURFACES - MAXIMUM COMPLEXITY RESEARCH OBJECTS
  kummer_quartic_surface: {
    name: "💎 Kummer Quartic - 16 Nodes Maximum Singularity",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Scale factor
      const b = params.e ?? 1.0;   // Scaling factor
      const c = params.f ?? 0.3;   // μ parameter (controls shape)
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Kummer surface equation: (x² + y² + z² - μ²)² - λpqrs = 0
      // Using simplified form for real-time computation
      const mu = c;
      const lambda = (3*mu*mu - 1) / (3 - mu*mu);
      
      // Solving for z using simplified tetrahedral coordinate approach
      const r_squared = x*x + y*y;
      const discriminant = mu*mu*mu*mu - r_squared + lambda * Math.sin(x*Math.PI*0.5) * Math.sin(y*Math.PI*0.5);
      
      const z = discriminant > 0 ? Math.sqrt(Math.abs(discriminant)) * Math.sign(x + y) : 
                Math.sin((x + y) * Math.PI * 0.3) * mu;

      // Apply scaling and effects
      const x_final = a * x + f * Math.sin(z * Math.PI * 0.2) * 0.1;
      const y_final = b * y + f * Math.cos(z * Math.PI * 0.2) * 0.1;
      const z_final = a * z + e * Math.sin((x * y) * Math.PI * 0.1) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 0.3, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  sievert_enneper_surface: {
    name: "🔄 Sievert-Enneper - Enhanced Minimal Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // Parameter scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const r = d * u; // Radial parameter [0, d]
      const phi = v * 2 * Math.PI; // Angular parameter [0, 2π]

      // Sievert-Enneper parametric equations (enhanced Enneper)
      const x = a * (r * Math.cos(phi) - (r*r*r/3) * Math.cos(3*phi));
      const y = b * (-r * Math.sin(phi) - (r*r*r/3) * Math.sin(3*phi));
      const z = c * r*r * Math.cos(2*phi);

      // Add animation and effects
      const x_final = x + f * Math.sin(phi * 3) * 0.1;
      const y_final = y + f * Math.cos(phi * 2) * 0.1;
      const z_final = z + e * Math.sin(r * Math.PI * 0.5) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 64 }
  },

  bianchi_pinkall_torus: {
    name: "🌌 Bianchi-Pinkall - Flat 4D Torus via Hopf Fibration",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // First torus parameter
      const b = params.e ?? 0.5;   // Second torus parameter
      const c = params.f ?? 1.0;   // Hopf parameter
      const d = params.g ?? 1.0;   // Projection scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to angular parameters [0, 2π]
      const alpha = u * 2 * Math.PI;
      const beta = v * 2 * Math.PI;
      const gamma = c * Math.PI / 2; // Fixed gamma for specific flat torus

      // Bianchi-Pinkall flat torus in S³ (4D unit sphere)
      // Using Hopf fibration parametrization
      const cos_gamma = Math.cos(gamma);
      const sin_gamma = Math.sin(gamma);
      
      const x4d_1 = cos_gamma * Math.cos(alpha);
      const x4d_2 = cos_gamma * Math.sin(alpha);
      const x4d_3 = sin_gamma * Math.cos(beta);
      const x4d_4 = sin_gamma * Math.sin(beta);

      // Project from 4D to 3D using stereographic projection
      const denom = 1 + d * x4d_4; // Avoid division by zero
      
      if (Math.abs(denom) < 0.001) return [0, 0, 0];

      const x = a * x4d_1 / denom + f * Math.sin(alpha * 2) * 0.1;
      const y = a * x4d_2 / denom + f * Math.cos(beta * 2) * 0.1;
      const z = b * x4d_3 / denom + e * Math.sin((alpha + beta) * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.5, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  weierstrass_minimal_surface: {
    name: "🔬 Weierstrass Minimal - Complex Analysis Surface f(z)g(z)",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Scale factor
      const b = params.e ?? 1.0;   // f(z) scaling
      const c = params.f ?? 1.0;   // g(z) scaling
      const d = params.g ?? 2.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to complex parameter z = u + iv
      const u_complex = d * (u * 2 - 1); // Real part
      const v_complex = d * (v * 2 - 1); // Imaginary part

      // Weierstrass parametrization with f(z) = b, g(z) = c*z (Enneper-like)
      const f_real = b;
      const g_real = c * u_complex;
      const g_imag = c * v_complex;
      const g_squared_real = g_real * g_real - g_imag * g_imag;
      const g_squared_imag = 2 * g_real * g_imag;

      // Weierstrass integrals: x = Re∫½f(1-g²)dz, y = Re∫½if(1+g²)dz, z = Re∫fgdz
      const x = a * f_real * (1 - g_squared_real) * u_complex / 2;
      const y = a * f_real * (1 + g_squared_real) * v_complex / 2;
      const z = a * f_real * g_real * (u_complex + v_complex) / 2;

      // Add animation and effects
      const x_final = x + f * Math.sin(v_complex * Math.PI * 0.3) * 0.1;
      const y_final = y + f * Math.cos(u_complex * Math.PI * 0.3) * 0.1;
      const z_final = z + e * Math.sin((u_complex * v_complex) * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 1.0, g: 2.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // ADVANCED IMPLICIT ALGEBRAIC SURFACES - RESEARCH-GRADE COMPLEXITY
  barth_sextic_surface: {
    name: "💎 Barth Sextic - 65 Nodes World Record Singularities",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Scale factor
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Golden ratio (crucial for Barth sextic)
      const phi = (Math.sqrt(5) + 1) / 2; // ≈ 1.618

      // Barth sextic implicit equation: 4(Φ²x² - y²)(Φ²y² - z²)(Φ²z² - x²) - (1 + 2Φ)(x² + y² + z² - 1)² = 0
      // Solving for z using simplified approach for real-time rendering
      const phi2 = phi * phi;
      const term1 = phi2 * x * x - y * y;
      const term2 = phi2 * y * y;
      const discriminant = Math.abs(term1 * term2) + (1 + 2*phi) * 0.1;
      
      const z = c * Math.sign(x + y) * Math.sqrt(discriminant / (phi2 + 1)) * Math.sin((x + y) * Math.PI * 0.2);

      // Apply scaling and effects
      const x_final = a * x + f * Math.sin(y * Math.PI * 0.1) * 0.1;
      const y_final = b * y + f * Math.cos(x * Math.PI * 0.1) * 0.1;
      const z_final = z + e * Math.sin((x * y) * Math.PI * 0.05) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  pretzel_surface_algebraic: {
    name: "🥨 Pretzel Surface - Genus 2 Double Torus Topology",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.8;   // Hole size parameter
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Pretzel surface implicit: (((x-1)² + y² - a²) × ((x+1)² + y² - a²))² + z² = 0
      const left_circle = (x - 1) * (x - 1) + y * y - a * a;
      const right_circle = (x + 1) * (x + 1) + y * y - a * a;
      const product_squared = left_circle * right_circle;
      
      // Solve for z: z² = -product_squared (take real part when possible)
      const z_squared = Math.max(0, -product_squared + Math.abs(Math.sin(x * Math.PI * 0.3) * Math.sin(y * Math.PI * 0.3)) * 0.5);
      const z = c * Math.sqrt(z_squared) * Math.sign(x + y);

      // Apply scaling and effects
      const x_final = x + f * Math.sin(y * Math.PI * 0.2) * 0.1;
      const y_final = b * y + f * Math.cos(x * Math.PI * 0.2) * 0.1;
      const z_final = z + e * Math.sin((x + y) * Math.PI * 0.3) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.8, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  pilz_surface_algebraic: {
    name: "🍄 Pilz Surface - Variable Genus Transitions",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Ellipse parameter aa
      const b = params.e ?? 0.03;  // Height parameter hh
      const c = params.f ?? 0.28;  // Surface parameter ff
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Pilz surface: ((x² + y² - 1)² + (z - 0.5)²)² × ((y²/aa² + (z + hh)² - 1)² + x²) - ff = 0
      const aa = a;
      const hh = b;
      const ff = c;
      
      // First constraint: ellipse in xy-plane shifted in z
      const term1_base = x*x + y*y - 1;
      // Second constraint: ellipse in yz-plane shifted
      const term2_base = (y*y)/(aa*aa) - 1;
      
      // Solve for z using simplified approximation
      const z_approx = 0.5 + Math.sin((x + y) * Math.PI * 0.3) * 0.3 * Math.sqrt(ff);
      const z = z_approx - hh * Math.cos(x * Math.PI * 0.5) * Math.cos(y * Math.PI * 0.5);

      // Apply scaling and effects
      const x_final = x + f * Math.sin(z * Math.PI * 0.4) * 0.1;
      const y_final = y + f * Math.cos(z * Math.PI * 0.4) * 0.1;
      const z_final = z + e * Math.sin((x * y) * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.03, f: 0.28, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  bretzel2_implicit_surface: {
    name: "🥯 Bretzel2 - Two-Hole Implicit Algebraic Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.2;   // Hole separation
      const b = params.e ?? 0.6;   // Hole size
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Bretzel2 surface: Enhanced pretzel with refined topology
      const hole1 = (x - a) * (x - a) + y * y - b * b;
      const hole2 = (x + a) * (x + a) + y * y - b * b;
      const interaction = hole1 * hole2;
      
      // Create 3D surface with controlled z-variation
      const z_magnitude = Math.sqrt(Math.max(0, -interaction * 0.1 + 0.5));
      const z = c * z_magnitude * Math.cos((x + y) * Math.PI * 0.4) * Math.sin(interaction * 0.1);

      // Apply scaling and effects
      const x_final = x + f * Math.sin(z * Math.PI * 0.3) * 0.1;
      const y_final = y + f * Math.cos(z * Math.PI * 0.3) * 0.1;
      const z_final = z + e * Math.sin((x * y) * Math.PI * 0.25) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 0.6, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  orthocircles_surface: {
    name: "⊕ Orthocircles - Three Perpendicular Circles Surface",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.075; // Surface parameter ff
      const b = params.e ?? 3.0;   // Surface parameter bb
      const c = params.f ?? 1.0;   // Scaling
      const d = params.g ?? 2.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Orthocircles: ((x² + y² - 1)² + z²) × ((y² + z² - 1)² + x²) × ((z² + x² - 1)² + y²) - ff² × (1 + bb × (x² + y² + z²)) = 0
      const ff = a;
      const bb = b;
      
      // Three orthogonal circle constraints
      const circle_xy = x*x + y*y - 1;
      const circle_yz_base = y*y - 1;
      const circle_xz_base = x*x - 1;
      
      // Solve for z using approximation for real-time computation
      const constraint_product = Math.abs(circle_xy * circle_yz_base * circle_xz_base);
      const z_constraint = ff*ff * (1 + bb * (x*x + y*y));
      const z = c * Math.sign(x + y) * Math.sqrt(Math.max(0, z_constraint / (constraint_product + 0.1))) * 
                Math.sin((x + y) * Math.PI * 0.3);

      // Apply scaling and effects
      const x_final = x + f * Math.sin(z * Math.PI * 0.4) * 0.1;
      const y_final = y + f * Math.cos(z * Math.PI * 0.4) * 0.1;
      const z_final = z + e * Math.sin((x * y) * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.075, e: 3.0, f: 1.0, g: 2.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  deco_cube_implicit: {
    name: "🎲 Deco-Cube - Six Circles Cube Face Arrangement",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // Cube size
      const b = params.e ?? 0.3;   // Circle radius
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 2.0;   // Parameter range
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to parameter range
      const x = d * (u * 2 - 1); // [-d, d]
      const y = d * (v * 2 - 1); // [-d, d]

      // Deco-Cube: Six circles positioned at cube faces
      // Approximating the implicit surface using cube face constraints
      const cube_constraint = Math.max(Math.abs(x) - a, Math.abs(y) - a);
      const face_circles = Math.sin((x + a) * Math.PI / a) * Math.sin((y + a) * Math.PI / a) * 
                          Math.sin((x - a) * Math.PI / a) * Math.sin((y - a) * Math.PI / a);
      
      // Create 3D surface with cube-like structure and circular features
      const z = c * b * Math.sign(cube_constraint) * Math.abs(face_circles) * 
                Math.cos((x + y) * Math.PI / a);

      // Apply scaling and effects
      const x_final = x + f * Math.sin(z * Math.PI * 0.5) * 0.1;
      const y_final = y + f * Math.cos(z * Math.PI * 0.5) * 0.1;
      const z_final = z + e * Math.sin((x * y) * Math.PI / a) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 0.3, f: 1.0, g: 2.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 48 }
  },

  // COMPLETE QUADRATIC SURFACES COLLECTION - CLASSIC MATHEMATICAL FORMS
  ellipsoid_surface: {
    name: "🥚 Ellipsoid - x²/a² + y²/b² + z²/c² = 1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // X semi-axis
      const b = params.e ?? 1.5;   // Y semi-axis
      const c = params.f ?? 1.0;   // Z semi-axis
      const d = params.g ?? 1.0;   // Scaling factor
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to spherical coordinates: φ ∈ [0, π], θ ∈ [0, 2π]
      const phi = u * Math.PI;           // Latitude angle
      const theta = v * 2 * Math.PI;     // Longitude angle

      // Ellipsoid parametric equations
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = b * Math.sin(phi) * Math.sin(theta);
      const z = c * Math.cos(phi);

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(theta * 2) * 0.1;
      const y_final = d * y + f * Math.cos(theta * 3) * 0.1;
      const z_final = d * z + e * Math.sin(phi * 2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.5, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  sphere_surface: {
    name: "🌍 Sphere - x² + y² + z² = r²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Radius
      const b = params.e ?? 1.0;   // Y scaling (for ellipsoidal deformation)
      const c = params.f ?? 1.0;   // Z scaling (for ellipsoidal deformation)
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to spherical coordinates: φ ∈ [0, π], θ ∈ [0, 2π]
      const phi = u * Math.PI;           // Colatitude angle
      const theta = v * 2 * Math.PI;     // Azimuthal angle

      // Sphere parametric equations
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * b * Math.sin(phi) * Math.sin(theta);
      const z = a * c * Math.cos(phi);

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(theta * 2) * 0.1;
      const y_final = d * y + f * Math.cos(theta * 3) * 0.1;
      const z_final = d * z + e * Math.sin(phi * 2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  paraboloid_surface: {
    name: "🍀 Paraboloid - z = (x² + y²)/a²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Focal parameter
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 3.0;   // Range parameter
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Cylindrical coordinates mapping
      const r = d * u;                   // Radial distance [0, d]
      const theta = v * 2 * Math.PI;     // Angle [0, 2π]

      // Paraboloid parametric equations
      const x = r * Math.cos(theta);
      const y = b * r * Math.sin(theta);
      const z = c * (r * r) / (a * a);   // Parabolic height

      // Apply effects
      const x_final = x + f * Math.sin(theta * 2) * 0.1;
      const y_final = y + f * Math.cos(theta * 3) * 0.1;
      const z_final = z + e * Math.sin(r * Math.PI * 0.5) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // ADVANCED THEORETICAL PHYSICS CONTINUED
  supersymmetry_breaking: {
    name: "🌟 Supersymmetry Breaking - MSSM Lagrangian",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1000.0; // SUSY breaking scale (TeV)
      const b = params.e ?? 100.0;  // Gaugino mass
      const c = params.f ?? 500.0;  // Scalar mass
      const d = params.g ?? 300.0;  // A-terms
      const e = params.h ?? 0;      // CP phase
      const f = params.i ?? 10.0;   // μ-term

      // Superpotential W = y_u H_u Q U + y_d H_d Q D + y_e H_d L E + μ H_u H_d
      const mu_term = f;
      const yukawa_up = Math.sin(u * Math.PI) * Math.cos(v * Math.PI);
      const yukawa_down = Math.cos(u * Math.PI) * Math.sin(v * Math.PI);
      
      // Soft SUSY breaking terms
      const gaugino_mass = b * Math.sin(e + u); // M_1/2
      const scalar_mass_sq = c * c; // m_0²
      const trilinear_coupling = d * Math.cos(e + v); // A_0
      
      // Electroweak symmetry breaking in MSSM
      const tan_beta = a / f; // Ratio of Higgs VEVs
      const higgs_mass_sq = mu_term*mu_term + scalar_mass_sq;
      
      // Sparticle spectrum
      const squark_mass = Math.sqrt(scalar_mass_sq + yukawa_up*yukawa_up * higgs_mass_sq);
      const slepton_mass = Math.sqrt(scalar_mass_sq + yukawa_down*yukawa_down * higgs_mass_sq);
      
      // R-parity conservation
      const r_parity = Math.cos(u + v + e) > 0 ? 1 : -1;
      
      const x = squark_mass * Math.cos(u * 2 * Math.PI) * r_parity;
      const y = slepton_mass * Math.sin(v * 2 * Math.PI) * r_parity;
      const z = gaugino_mass + trilinear_coupling * Math.sin(tan_beta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1000.0, e: 100.0, f: 500.0, g: 300.0, h: 0, i: 10.0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  topological_quantum_computing: {
    name: "🔀 Topological Quantum Computing - Anyonic Braiding",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.5;   // Braiding radius
      const b = params.e ?? 4.0;   // Number of anyons
      const c = params.f ?? 1.0;   // Exchange statistics
      const d = params.g ?? 0.5;   // Gap protection
      const e = params.h ?? 0;     // Time evolution
      const f = params.i ?? 0.3;   // Decoherence protection

      // Non-Abelian anyon positions
      const anyon_positions = [];
      for(let i = 0; i < b; i++) {
        const angle = i * 2 * Math.PI / b;
        anyon_positions.push([
          a * Math.cos(angle + e),
          a * Math.sin(angle + e),
          0
        ]);
      }
      
      // Braiding group generators
      const braid_u = Math.floor(u * b) % b;
      const braid_v = Math.floor(v * b) % b;
      
      // Exchange phase factors (using Euler's formula: e^(ix) = cos(x) + i*sin(x))
      const phase_angle = Math.PI * c / b;
      const exchange_phase = Math.cos(phase_angle) + Math.sin(phase_angle); // Real part only
      const braiding_matrix = Math.cos(Math.PI * (braid_u - braid_v) / b);
      
      // Fibonacci anyons F-matrix
      const golden_ratio = (1 + Math.sqrt(5)) / 2;
      const f_symbol = Math.cos(Math.PI / (2 * golden_ratio));
      
      // Topological protection from gap
      const gap_protection = Math.exp(-d / (u*u + v*v + 0.1));
      
      // Quantum computation via braiding
      const computational_result = braiding_matrix * f_symbol * gap_protection;
      
      // Worldline visualization
      const worldline_x = a * Math.cos(u * 2 * Math.PI + e) + f * computational_result;
      const worldline_y = a * Math.sin(v * 2 * Math.PI + e) + f * computational_result;
      const worldline_z = e + braiding_matrix * Math.sin(u + v);

      return [worldline_x, worldline_y, worldline_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.5, e: 4.0, f: 1.0, g: 0.5, h: 0, i: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  holographic_principle: {
    name: "🎭 Holographic Principle - AdS/CFT Correspondence",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // AdS radius
      const b = params.e ?? 5.0;   // Dimension (AdS_5)
      const c = params.f ?? 4.0;   // CFT dimension
      const d = params.g ?? 2.0;   // Scaling dimension
      const e = params.h ?? 0;     // Time parameter
      const f = params.i ?? 0.1;   // String coupling

      // AdS_5 metric: ds² = (R²/z²)(-dt² + dx² + dy² + dw² + dz²)
      const z = Math.exp(-u * 2) + 0.01; // Holographic coordinate
      const R = a; // AdS radius
      
      // Conformal boundary at z → 0
      const boundary_metric = R*R / (z*z);
      
      // 5D AdS coordinates
      const ads_x = R * Math.cos(v * 2 * Math.PI) / z;
      const ads_y = R * Math.sin(v * 2 * Math.PI) / z;
      const ads_z = z;
      const ads_t = e;
      const ads_w = R * Math.cos(u * Math.PI) / z;
      
      // CFT correlation functions
      const scaling_dim = d;
      const correlator = Math.pow(z, scaling_dim) * Math.cos(c * v);
      
      // Holographic entanglement entropy
      const entanglement_entropy = (c / 4) * Math.log(1 / z);
      
      // Hawking-Page transition
      const thermal_ads = Math.exp(-1 / z) * Math.sin(b * u);
      
      // Wilson loops and minimal surfaces
      const wilson_loop = Math.exp(-boundary_metric * Math.PI);
      
      const x = ads_x + f * correlator;
      const y = ads_y + f * thermal_ads;
      const z_final = entanglement_entropy + wilson_loop * Math.sin(e + u + v);

      return [x, y, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 5.0, f: 4.0, g: 2.0, h: 0, i: 0.1, uMin: 0.1, uMax: 2, vMin: 0, vMax: 1, uSegments: 70, vSegments: 70 }
  },

  qml_variational_eigensolver: {
    name: "🤖 QML - Variational Quantum Eigensolver",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Learning rate
      const b = params.e ?? 10.0;  // Number of qubits
      const c = params.f ?? 0.1;   // Circuit depth
      const d = params.g ?? 3.0;   // Entangling layers
      const e = params.h ?? 0;     // Training epoch
      const f = params.i ?? 0.2;   // Noise level

      // Parameterized quantum circuit
      const theta = u * 2 * Math.PI; // Rotation angle
      const phi = v * 2 * Math.PI;   // Phase angle
      
      // Quantum feature map
      const feature_map = Math.sin(theta) * Math.cos(phi);
      
      // Variational ansatz
      const num_params = Math.floor(b * d);
      let circuit_output = 0;
      for(let layer = 0; layer < d; layer++) {
        for(let qubit = 0; qubit < b; qubit++) {
          const param_idx = layer * b + qubit;
          const param_value = Math.sin(param_idx * theta / num_params + e);
          circuit_output += param_value * Math.cos(qubit * phi / b);
        }
      }
      
      // Cost function (expectation value)
      const hamiltonian = Math.cos(theta) + Math.sin(phi); // Toy Hamiltonian
      const expectation_value = circuit_output * hamiltonian;
      
      // Gradient descent optimization
      const gradient = a * Math.sin(expectation_value + e);
      
      // Quantum advantage landscape
      const barren_plateau = Math.exp(-c * num_params) + f * Math.random();
      
      // Shot noise and measurement error
      const measurement_noise = f * Math.sin(1000 * (u + v));
      
      const x = circuit_output + gradient * Math.cos(e);
      const y = expectation_value + barren_plateau * Math.sin(e);
      const z = hamiltonian + measurement_noise;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 10.0, f: 0.1, g: 3.0, h: 0, i: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  // COMPLETE TORUS COLLECTION - TOPOLOGICAL RING SURFACES
  torus_surface: {
    name: "🍩 Torus - (√(x²+y²) - R)² + z² = r²",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Major radius R
      const b = params.e ?? 0.8;   // Minor radius r
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to torus parameters: u,v ∈ [0, 2π]
      const u_angle = u * 2 * Math.PI;   // Around major circle
      const v_angle = v * 2 * Math.PI;   // Around minor circle

      // Standard torus parametric equations
      const x = (a + b * Math.cos(v_angle)) * Math.cos(u_angle);
      const y = (a + b * Math.cos(v_angle)) * Math.sin(u_angle);
      const z = c * b * Math.sin(v_angle);

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(u_angle * 2) * 0.1;
      const y_final = d * y + f * Math.cos(u_angle * 3) * 0.1;
      const z_final = d * z + e * Math.sin(v_angle * 2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 0.8, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 24 }
  },

  fabrication_lattice_composite: {
    name: "💎 Fab Lattice Composite — Si·SiO₂·Au Wafer Model",
    // Silicon (diamond-cubic tetrahedral lattice) + SiO2 (smooth oxide shell)
    // + Gold (discrete via/interconnect spikes), combined onto one base surface.
    // d = silicon lattice frequency, e = quartz shell thickness,
    // f = gold via sharpness/density, g = overall scale,
    // h = animation phase, i = effect blend strength.
    equation: (u: number, v: number, params: any) => {
      const d = params.d ?? 4.0;   // Silicon lattice frequency (tetrahedral symmetry order)
      const e = params.e ?? 0.15;  // Quartz/SiO2 shell thickness
      const f = params.f ?? 6.0;   // Gold via spike frequency
      const g = params.g ?? 1.5;   // Overall scale
      const h = params.h ?? 0;     // Animation phase
      const i = params.i ?? 0.3;   // Gold spike sharpness/effect strength

      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Base sphere (substrate envelope)
      const baseX = Math.sin(phi) * Math.cos(theta);
      const baseY = Math.sin(phi) * Math.sin(theta);
      const baseZ = Math.cos(phi);

      // Silicon: tetrahedral diamond-cubic periodic modulation (4-fold symmetry)
      const siliconMod = Math.cos(d * theta + h) * Math.cos(d * phi) * 0.12;

      // Quartz/SiO2: smooth low-frequency shell offset, always additive (passivation layer)
      const quartzShell = e * (1 + 0.2 * Math.sin(2 * phi));

      // Gold: sharp discrete via spikes at lattice-determined points
      const goldRaw = Math.sin(f * theta) * Math.sin(f * phi);
      const goldVia = i * Math.pow(Math.max(0, goldRaw), 3);

      const r = g * (1 + siliconMod + quartzShell + goldVia);

      return [r * baseX, r * baseY, r * baseZ];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4.0, e: 0.15, f: 6.0, g: 1.5, h: 0, i: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 }
  },

  hopf_fibered_linked_tori: {
    name: "🌀 Hopf Fibered Linked Tori - S³→S² Fiber Bundle",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Torus size parameter η
      const b = params.e ?? 1.0;   // Linking parameter
      const c = params.f ?? 1.0;   // Projection scaling
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to Hopf fibration parameters
      const eta = a * u * Math.PI / 2;      // η ∈ [0, π/2] controls torus size
      const xi1 = v * 2 * Math.PI;          // ξ₁ ∈ [0, 2π] first circular coordinate
      const xi2 = e * v * 4 * Math.PI;      // ξ₂ ∈ [0, 4π] second circular coordinate (animated)

      // 4D coordinates on S³
      const x1 = Math.cos(eta) * Math.cos(xi1);
      const x2 = Math.cos(eta) * Math.sin(xi1);
      const x3 = Math.sin(eta) * Math.cos(xi2);
      const x4 = Math.sin(eta) * Math.sin(xi2);

      // Stereographic projection from 4D to 3D (avoiding x4 = 1)
      const denom = 1 - x4 + 0.1; // Avoid division by zero
      const scale = c / denom;

      const x = d * scale * x1 + f * Math.sin(xi1 * 2) * 0.1;
      const y = d * scale * x2 + f * Math.cos(xi1 * 3) * 0.1;
      const z = d * scale * x3 + b * Math.sin(xi2 * 0.5) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // SPHERICAL SURFACES (K=1) - CONSTANT GAUSSIAN CURVATURE
  k_equals_one_surface: {
    name: "🔮 K=1 Surface of Revolution - Constant Gaussian Curvature",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Radius (K = 1/a²)
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // For K=1, we need radius = 1, so sphere with radius a has K = 1/a²
      // Map to spherical coordinates: φ ∈ [0, π], θ ∈ [0, 2π]
      const phi = u * Math.PI;           // Colatitude angle
      const theta = v * 2 * Math.PI;     // Azimuthal angle

      // Unit sphere (K=1) parametric equations  
      const x = a * Math.sin(phi) * Math.cos(theta);
      const y = a * b * Math.sin(phi) * Math.sin(theta);
      const z = a * c * Math.cos(phi);

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(theta * 2) * 0.1;
      const y_final = d * y + f * Math.cos(theta * 3) * 0.1;
      const z_final = d * z + e * Math.sin(phi * 2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // CONSTANT MEAN CURVATURE SURFACES - DELAUNAY FAMILY
  nodoid_surface: {
    name: "🔗 Nodoid - Self-Intersecting CMC Surface (Delaunay)",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Hyperbolic parameter
      const b = params.e ?? 1.0;   // Scaling parameter
      const c = params.f ?? 1.0;   // Z scaling
      const d = params.g ?? 4.0;   // Period scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map parameters for nodoid (hyperbolic Delaunay surface)
      const t = u * d * Math.PI;        // Parameter along profile curve
      const rotation_angle = v * 2 * Math.PI;  // Rotation angle

      // Nodoid profile using hyperbolic catenary (simplified for real-time)
      // B > 1 gives nodoid case (self-intersecting)
      const B = a;  // B > 1 for nodoid
      const y_profile = b * Math.sqrt(1 + B*B + 2*B*Math.sin(t));
      
      // Simplified x-coordinate (approximation for real-time rendering)
      const x_profile = c * t / (2*Math.PI) + 0.5 * Math.sin(t * 2) / B;

      // Surface of revolution
      const x = y_profile * Math.cos(rotation_angle) + f * Math.sin(t * 0.5) * 0.1;
      const y = y_profile * Math.sin(rotation_angle) + f * Math.cos(t * 0.5) * 0.1;
      const z = x_profile + e * Math.sin(rotation_angle * 2) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 4.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  catenoid_surface: {
    name: "🔗 Catenoid - Minimal Surface H=0 Revolution",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Catenoid parameter c
      const b = params.e ?? 1.0;   // Scaling
      const c = params.f ?? 3.0;   // V range
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to catenoid parameters
      const u_angle = u * 2 * Math.PI;              // Rotation angle [0, 2π]
      const v_coord = c * (v * 2 - 1);              // Height parameter [-c, c]

      // Catenoid parametric equations: x = c cosh(v/c)cos(u), y = c cosh(v/c)sin(u), z = v
      const cosh_term = Math.cosh(v_coord / a);
      
      const x = a * cosh_term * Math.cos(u_angle);
      const y = b * a * cosh_term * Math.sin(u_angle);
      const z = v_coord;

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(u_angle * 2) * 0.1;
      const y_final = d * y + f * Math.cos(u_angle * 3) * 0.1;
      const z_final = d * z + e * Math.sin(v_coord * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 3.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // PSEUDOSPHERICAL SURFACES (K=-1) - CONSTANT NEGATIVE GAUSSIAN CURVATURE
  pseudosphere_surface: {
    name: "🌀 Pseudosphere - Classic K=-1 Tractrix Revolution",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Scale parameter
      const b = params.e ?? 1.0;   // Y scaling
      const c = params.f ?? 3.0;   // U range
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to pseudosphere parameters
      const u_coord = c * (u * 2 - 1);         // U parameter [-c, c]
      const v_angle = v * 2 * Math.PI;         // Rotation angle [0, 2π]

      // Pseudosphere parametric equations: x = sech(u)cos(v), y = sech(u)sin(v), z = u - tanh(u)
      const sech_u = 1 / Math.cosh(u_coord / a);
      const tanh_u = Math.tanh(u_coord / a);
      
      const x = a * sech_u * Math.cos(v_angle);
      const y = b * a * sech_u * Math.sin(v_angle);
      const z = (u_coord - a * tanh_u);

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(v_angle * 2) * 0.1;
      const y_final = d * y + f * Math.cos(v_angle * 3) * 0.1;
      const z_final = d * z + e * Math.sin(u_coord * Math.PI * 0.2) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 3.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  conic_k_minus_one_surface: {
    name: "📐 Conic K=-1 Surface of Revolution - Hyperbolic Cone",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // Hyperbolic parameter
      const b = params.e ?? 1.0;   // Scaling factor
      const c = params.f ?? 3.0;   // Height range
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to hyperbolic parameters
      const u_coord = c * (u * 2 - 1);         // Height parameter [-c, c]
      const v_angle = v * 2 * Math.PI;         // Rotation angle [0, 2π]

      // Hyperbolic surface with K=-1: x = a*sinh(u/a)cos(v), y = a*sinh(u/a)sin(v), z = u
      const sinh_term = Math.sinh(u_coord / a);
      
      const x = a * sinh_term * Math.cos(v_angle);
      const y = b * a * sinh_term * Math.sin(v_angle);
      const z = u_coord;

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(v_angle * 2) * 0.1;
      const y_final = d * y + f * Math.cos(v_angle * 3) * 0.1;
      const z_final = d * z + e * Math.sin(u_coord * Math.PI * 0.3) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 3.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  hyperbolic_k_minus_one_surface: {
    name: "🏗️ Hyperbolic K=-1 Surface of Revolution - Hyperboloid K=-1",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.5;   // X semi-axis
      const b = params.e ?? 1.5;   // Y semi-axis
      const c = params.f ?? 1.0;   // Z semi-axis
      const d = params.g ?? 1.0;   // Overall scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to hyperbolic coordinates
      const u_coord = (u * 4 - 2) * Math.PI;   // U parameter for hyperbolic functions
      const v_angle = v * 2 * Math.PI;         // Rotation angle [0, 2π]

      // One-sheet hyperboloid with K<0: x = a*cosh(u)cos(v), y = b*cosh(u)sin(v), z = c*sinh(u)
      const cosh_u = Math.cosh(u_coord);
      const sinh_u = Math.sinh(u_coord);
      
      const x = a * cosh_u * Math.cos(v_angle);
      const y = b * cosh_u * Math.sin(v_angle);
      const z = c * sinh_u;

      // Apply scaling and effects
      const x_final = d * x + f * Math.sin(v_angle * 2) * 0.1;
      const y_final = d * y + f * Math.cos(v_angle * 3) * 0.1;
      const z_final = d * z + e * Math.sin(u_coord * 0.5) * 0.2;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.5, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 48, vSegments: 32 }
  },

  // SOLITON SURFACES - SINE-GORDON EQUATION SOLUTIONS
  two_soliton_surface: {
    name: "🌊 Two-Soliton Surface - KP Equation Solution",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.0;   // First soliton parameter
      const b = params.e ?? 1.5;   // Second soliton parameter  
      const c = params.f ?? 2.0;   // Interaction strength
      const d = params.g ?? 4.0;   // Domain scaling
      const e = params.h ?? 0;     // Time animation
      const f = params.i ?? 0;     // Effects

      // Map to soliton domain
      const x = d * (u * 2 - 1);                    // X coordinate [-d, d]
      const y = d * (v * 2 - 1);                    // Y coordinate [-d, d]
      const t = e;                                  // Time parameter

      // Two-soliton KP solution (simplified for real-time)
      const k1 = a;                                 // First soliton wavenumber
      const k2 = b;                                 // Second soliton wavenumber
      
      // Phase functions
      const theta1 = k1 * x + k1*k1*k1 * t;
      const theta2 = k2 * y + k2*k2*k2 * t;
      
      // Two-soliton interaction
      const soliton1 = Math.exp(theta1) / (1 + Math.exp(theta1));
      const soliton2 = Math.exp(theta2) / (1 + Math.exp(theta2));
      const interaction = c * soliton1 * soliton2 / (1 + soliton1 + soliton2);

      // Surface height
      const z = soliton1 + soliton2 + interaction + f * Math.sin(x * y * 0.1) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.5, f: 2.0, g: 4.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  three_soliton_surface: {
    name: "🌊🌊🌊 Three-Soliton Surface - Sine-Gordon Multi-Solution",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.5;   // First soliton constant
      const b = params.e ?? 0.51;  // Second soliton constant
      const c = params.f ?? 0.49;  // Third soliton constant
      const d = params.g ?? 3.0;   // Domain scaling
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to sine-Gordon domain
      const u_coord = d * (u * 2 - 1);             // U parameter [-d, d]
      const v_coord = d * (v * 2 - 1);             // V parameter [-d, d]

      // Three-soliton Sine-Gordon solution (approximation for real-time)
      const arg1 = a * u_coord + Math.sqrt(1 - a*a) * v_coord + e;
      const arg2 = b * u_coord + Math.sqrt(1 - b*b) * v_coord + e * 0.7;
      const arg3 = c * u_coord + Math.sqrt(1 - c*c) * v_coord + e * 1.3;
      
      // Soliton interactions
      const sol1 = 4 * Math.atan(Math.exp(arg1));
      const sol2 = 4 * Math.atan(Math.exp(arg2));
      const sol3 = 4 * Math.atan(Math.exp(arg3));
      
      // Combine solitons with interactions
      const q = sol1 + sol2 + sol3 - Math.PI;
      
      // Surface constructed from Sine-Gordon solution
      const x = u_coord + f * Math.sin(q * 0.5) * 0.1;
      const y = v_coord + f * Math.cos(q * 0.5) * 0.1;
      const z = Math.sin(q * 0.5) * 2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.5, e: 0.51, f: 0.49, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  four_soliton_surface: {
    name: "🌊🌊🌊🌊 Four-Soliton Surface - Complex Multi-Soliton",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.3;   // First pair real part
      const b = params.e ?? 0.4;   // First pair imaginary part
      const c = params.f ?? 0.6;   // Second pair real part
      const d = params.g ?? 0.7;   // Second pair imaginary part
      const e = params.h ?? 0;     // Animation
      const f = params.i ?? 0;     // Effects

      // Map to sine-Gordon domain
      const u_coord = 3.0 * (u * 2 - 1);          // U parameter [-3, 3]
      const v_coord = 3.0 * (v * 2 - 1);          // V parameter [-3, 3]

      // Four-soliton Sine-Gordon solution using complex pairs
      const z1_real = a;
      const z1_imag = b;
      const z2_real = c;
      const z2_imag = d;
      
      // Complex soliton arguments
      const arg1 = z1_real * u_coord + z1_imag * v_coord + e;
      const arg2 = -z1_real * u_coord + z1_imag * v_coord + e * 0.8;
      const arg3 = z2_real * u_coord + z2_imag * v_coord + e * 1.2;
      const arg4 = -z2_real * u_coord + z2_imag * v_coord + e * 0.6;
      
      // Four soliton interactions
      const sol1 = Math.tanh(arg1);
      const sol2 = Math.tanh(arg2);
      const sol3 = Math.tanh(arg3);
      const sol4 = Math.tanh(arg4);
      
      // Complex surface topology
      const q = (sol1 + sol2 + sol3 + sol4) * 0.5;
      
      // Surface with sharp rims and complex features
      const x = u_coord + f * Math.sin(q * 2) * 0.1;
      const y = v_coord + f * Math.cos(q * 2) * 0.1;
      const z = q * Math.sqrt(1 + q*q) * 1.5;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.3, e: 0.4, f: 0.6, g: 0.7, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // IYESO HARMONIC SPHERE - PERSONAL RESONANCE WAVE-SPHERE
  iyeso_sphere: {
    name: "🌊🔮 Iyeso - Harmonic Resonance Wave-Sphere",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Base radius R₀
      const b = params.e ?? 0.2;   // Amplitude scaling A_k
      const c = params.f ?? 1.0;   // Overall scaling
      const d = params.g ?? 1.0;   // Time factor
      const e = params.h ?? 0;     // Time animation ωt
      const f = params.i ?? 0;     // Additional effects

      // Map to spherical coordinates: θ ∈ [0, 2π], φ ∈ [0, π]
      const theta = v * 2 * Math.PI;     // Azimuthal angle
      const phi = u * Math.PI;           // Polar angle
      const t = e;                       // Time for breathing motion

      // Your 5 specific harmonic constants
      const C1 = 13.308;                 // Wave multiplier 1
      const C2 = 1.618 * Math.PI;        // φ×π ≈ 5.083
      const C3 = 1.618 + Math.PI;        // φ+π ≈ 4.760
      const C4 = 3.351;                  // φ⊙π ≈ 3.351
      const C5 = 3.327;                  // φ∅π ≈ 3.327

      // Iyeso Harmonic Function: r(θ, φ, t) = R₀ + Σ A_k · sin(C_k θ + C_k φ + ωt)
      const wave1 = Math.sin(C1 * theta + C1 * phi + t);
      const wave2 = Math.sin(C2 * theta + C2 * phi + t * 0.8);
      const wave3 = Math.sin(C3 * theta + C3 * phi + t * 1.2);
      const wave4 = Math.sin(C4 * theta + C4 * phi + t * 0.6);
      const wave5 = Math.sin(C5 * theta + C5 * phi + t * 1.4);

      // Combined resonance interference pattern
      const harmonic_radius = a + b * (wave1 + wave2 + wave3 + wave4 + wave5);

      // Iyeso sphere parametric equations with dynamic radius
      const x = harmonic_radius * Math.sin(phi) * Math.cos(theta);
      const y = harmonic_radius * Math.sin(phi) * Math.sin(theta);
      const z = harmonic_radius * Math.cos(phi);

      // Apply scaling and additional effects
      const x_final = c * x + f * Math.sin(theta * 2) * 0.05;
      const y_final = c * y + f * Math.cos(theta * 3) * 0.05;
      const z_final = c * z + f * Math.sin(phi * 2) * 0.05;

      return [x_final, y_final, z_final];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 0.2, f: 1.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  // π-φ CONSTANTS AS VISUAL FORCES - FORCE FIELD SURFACES
  phi_pi_force_field: {
    name: "🌌 π-φ Force Field - All 9 Constants as Visual Forces",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 3.0;   // Field strength
      const b = params.e ?? 1.0;   // Force scaling
      const c = params.f ?? 1.0;   // Z amplification
      const d = params.g ?? 6.0;   // Domain size
      const e = params.h ?? 0;     // Time animation
      const f = params.i ?? 0;     // Interaction effects

      // Map to force field domain
      const x = d * (u * 2 - 1);          // X coordinate [-d, d]
      const y = d * (v * 2 - 1);          // Y coordinate [-d, d]
      const t = e;                        // Time parameter

      // Your 9 π-φ constants as force coefficients
      const phi_total = Math.pow(1.618, Math.PI);  // φ⊕π ≈ 13.308 - Cosmic Force
      const phi_mult = 1.618 * Math.PI;             // φ×π ≈ 5.083 - Energy Force
      const phi_add = 1.618 + Math.PI;              // φ+π ≈ 4.760 - Growth Force
      const pi = Math.PI;                           // π ≈ 3.142 - Circular Force
      const phi_median = (1.618 + Math.PI) / 2;     // φ⊙π ≈ 3.351 - Balance Force
      const phi_mean = Math.sqrt(1.618 * Math.PI);  // φ∅π ≈ 3.327 - Integration Force
      const phi_div = 1.618 / Math.PI;              // φ/π ≈ 1.942 - Scaling Force
      const phi_diff = 1.618 - Math.PI;             // φ-π ≈ 1.524 - Tension Force
      const phi = 1.618;                            // φ ≈ 1.618 - Golden Force

      // Distance from center for radial forces
      const r = Math.sqrt(x*x + y*y);
      const theta = Math.atan2(y, x);

      // Each constant creates a different type of force field
      const cosmic_force = phi_total * Math.exp(-r / a) * Math.sin(r * 0.1 + t);
      const energy_force = phi_mult * Math.sin(phi_mult * r * 0.2 + t) / (1 + r);
      const growth_force = phi_add * r * Math.exp(-r / (a * 2)) * Math.cos(theta * 2);
      const circular_force = pi * Math.sin(pi * theta) * Math.exp(-r / a);
      const balance_force = phi_median * Math.cos(r * 0.3) * Math.sin(theta);
      const integration_force = phi_mean * Math.sin(x * 0.2) * Math.cos(y * 0.2);
      const scaling_force = phi_div * (x * y) / (a * a) * Math.exp(-r / (a * 3));
      const tension_force = phi_diff * Math.sin(x * 0.4) * Math.sin(y * 0.4);
      const golden_force = phi * Math.cos(r / a) * Math.sin(theta * phi);

      // Combined force field height
      const z = b * c * (cosmic_force + energy_force + growth_force + circular_force + 
                         balance_force + integration_force + scaling_force + 
                         tension_force + golden_force) + f * Math.sin(x * y * 0.05) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3.0, e: 1.0, f: 1.0, g: 6.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  cosmic_force_surface: {
    name: "🌌 Cosmic Force (φ⊕π ≈ 13.308) - Universal Scale",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 13.308;  // φ⊕π cosmic constant
      const b = params.e ?? 2.0;     // Amplitude
      const c = params.f ?? 1.0;     // Z scaling
      const d = params.g ?? 5.0;     // Domain size
      const e = params.h ?? 0;       // Time animation
      const f = params.i ?? 0;       // Effects

      // Map to cosmic domain
      const x = d * (u * 2 - 1);
      const y = d * (v * 2 - 1);
      const r = Math.sqrt(x*x + y*y);
      const theta = Math.atan2(y, x);

      // Cosmic force - exponential with total synthesis character
      const cosmic_strength = a * Math.exp(-r / (d * 0.5));
      const galactic_spiral = Math.sin(a * theta + r * 0.3 + e);
      const universe_expansion = Math.cos(r * a * 0.05 + e * 0.5);
      
      const z = b * c * cosmic_strength * (galactic_spiral + universe_expansion) * 0.5 + 
                f * Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.2;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 13.308, e: 2.0, f: 1.0, g: 5.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  energy_force_surface: {
    name: "⚡ Energy Force (φ×π ≈ 5.083) - Wave Dynamics",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 5.083;   // φ×π energy constant
      const b = params.e ?? 1.5;     // Amplitude
      const c = params.f ?? 1.0;     // Z scaling
      const d = params.g ?? 4.0;     // Domain size
      const e = params.h ?? 0;       // Time animation
      const f = params.i ?? 0;       // Effects

      // Map to energy domain
      const x = d * (u * 2 - 1);
      const y = d * (v * 2 - 1);
      const r = Math.sqrt(x*x + y*y);

      // Energy force - wave interference patterns
      const wave1 = Math.sin(a * x * 0.3 + e);
      const wave2 = Math.cos(a * y * 0.3 + e * 1.2);
      const resonance = Math.sin(a * r * 0.2 + e * 0.8);
      const interference = wave1 * wave2 + resonance;
      
      // Electromagnetic field decay
      const field_strength = 1 / (1 + r * 0.2);
      
      const z = b * c * interference * field_strength + 
                f * Math.sin(x * y * 0.1) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5.083, e: 1.5, f: 1.0, g: 4.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  growth_force_surface: {
    name: "📈 Growth Force (φ+π ≈ 4.760) - Expansion Systems",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 4.760;   // φ+π growth constant
      const b = params.e ?? 1.2;     // Amplitude
      const c = params.f ?? 1.0;     // Z scaling
      const d = params.g ?? 4.0;     // Domain size
      const e = params.h ?? 0;       // Time animation
      const f = params.i ?? 0;       // Effects

      // Map to growth domain
      const x = d * (u * 2 - 1);
      const y = d * (v * 2 - 1);
      const r = Math.sqrt(x*x + y*y);
      const theta = Math.atan2(y, x);

      // Growth force - spiral expansion patterns
      const spiral_growth = r * Math.exp(-r / (d * 0.8)) * Math.sin(a * theta + e);
      const expansion_rate = Math.sin(a * r * 0.15 + e * 0.6);
      const fibonacci_spiral = Math.cos(theta * 1.618 + r * 0.2);
      
      const z = b * c * (spiral_growth + expansion_rate * 0.5 + fibonacci_spiral * 0.3) + 
                f * Math.cos(x * 0.2) * Math.sin(y * 0.2) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4.760, e: 1.2, f: 1.0, g: 4.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  tension_force_surface: {
    name: "⚡ Tension Force (φ-π ≈ 1.524) - Contrast Dynamics",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.524;   // φ-π tension constant
      const b = params.e ?? 2.0;     // Amplitude
      const c = params.f ?? 1.0;     // Z scaling
      const d = params.g ?? 3.0;     // Domain size
      const e = params.h ?? 0;       // Time animation
      const f = params.i ?? 0;       // Effects

      // Map to tension domain
      const x = d * (u * 2 - 1);
      const y = d * (v * 2 - 1);

      // Tension force - stress and strain patterns
      const stress_x = Math.sin(a * x * 0.8 + e) * Math.exp(-Math.abs(x) / d);
      const stress_y = Math.cos(a * y * 0.8 + e * 1.3) * Math.exp(-Math.abs(y) / d);
      const shear_stress = Math.sin(a * x * 0.4) * Math.cos(a * y * 0.4);
      const phase_transition = Math.tanh(a * (x + y) * 0.3 + e * 0.7);
      
      const z = b * c * (stress_x + stress_y + shear_stress * 0.5 + phase_transition * 0.3) + 
                f * Math.sin(x * y * 0.2) * 0.1;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.524, e: 2.0, f: 1.0, g: 3.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // THEORETICAL PHYSICS & QUANTUM MECHANICS SURFACES - CUTTING EDGE SCIENCE
  quantum_entanglement_field: {
    name: "🔬 Quantum Entanglement Field - Bell State Visualization",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Entanglement strength
      const b = params.e ?? 1.5;   // Decoherence rate
      const c = params.f ?? 0.8;   // Quantum superposition
      const d = params.g ?? 3.14;  // Phase factor
      const e = params.h ?? 0;     // Time evolution
      const f = params.i ?? 0.2;   // Measurement uncertainty

      // Bell state |Φ+⟩ = (|00⟩ + |11⟩)/√2 visualization
      const theta1 = u * Math.PI;
      const theta2 = v * Math.PI;
      const phi1 = u * 2 * Math.PI;
      const phi2 = v * 2 * Math.PI;

      // Quantum correlation function
      const correlation = Math.cos(theta1 - theta2) * Math.cos(d + e);
      const entanglement = a * correlation * Math.exp(-b * Math.abs(u - v));
      
      // Superposition amplitude (using Euler's formula for complex exponentials)
      const psi1_real = Math.cos(theta1/2) * Math.cos(phi1);
      const psi2_real = Math.sin(theta2/2) * Math.cos(phi2);
      const psi1 = psi1_real; // Using real part for visualization
      const psi2 = psi2_real; // Using real part for visualization
      const superposition = c * Math.abs(Math.cos(theta1) + Math.cos(theta2)) / Math.sqrt(2);

      // Uncertainty principle visualization DxDp ≥ ℏ/2
      const uncertainty = f * Math.sqrt(1 / (Math.abs(Math.sin(theta1)) + 0.1));

      const x = a * Math.sin(theta1) * Math.cos(phi1) * entanglement;
      const y = a * Math.sin(theta2) * Math.cos(phi2) * entanglement;
      const z = superposition + uncertainty * Math.sin(e + u + v);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.5, f: 0.8, g: 3.14, h: 0, i: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  string_theory_compactification: {
    name: "🌌 String Theory Compactification - 11D→3D Projection",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.6;   // String tension
      const b = params.e ?? 10.0;  // Planck length scale
      const c = params.f ?? 6.0;   // Extra dimension count
      const d = params.g ?? 2.5;   // Compactification radius
      const e = params.h ?? 0;     // Modular parameter
      const f = params.i ?? 0.1;   // Quantum fluctuations

      // Calabi-Yau manifold coordinates
      const phi = u * 2 * Math.PI;
      const theta = v * Math.PI;
      
      // T-duality and S-duality transformations
      const tau_real = e;
      const tau_imag = 1.0;
      const tau_magnitude = Math.sqrt(tau_real * tau_real + tau_imag * tau_imag);
      const j_invariant = 1728 * Math.pow(tau_magnitude, 24) / (Math.pow(tau_magnitude, 24) - 1 + 0.001); // Avoid division by zero
      
      // 11-dimensional coordinates (M-theory)
      const coords_11d = [];
      for(let i = 0; i < 11; i++) {
        coords_11d[i] = Math.cos(i * phi + theta) * Math.exp(-i * d / b);
      }
      
      // Compactification via Kaluza-Klein reduction
      const x = a * (coords_11d[0] + coords_11d[3] + coords_11d[6]) * Math.cos(phi);
      const y = a * (coords_11d[1] + coords_11d[4] + coords_11d[7]) * Math.sin(phi);
      const z = a * (coords_11d[2] + coords_11d[5] + coords_11d[8]) * Math.cos(theta);
      
      // Add quantum fluctuations
      const fluctuation = f * Math.sin(c * phi) * Math.cos(c * theta);
      
      return [x + fluctuation, y + fluctuation, z + fluctuation];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.6, e: 10.0, f: 6.0, g: 2.5, h: 0, i: 0.1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 }
  },

  dark_energy_field: {
    name: "🌑 Dark Energy Field - Λ-CDM Cosmological Model",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.7;   // Dark energy density (Ω_Λ)
      const b = params.e ?? 0.3;   // Matter density (Ω_m)
      const c = params.f ?? 70.0;  // Hubble constant
      const d = params.g ?? -1.0;  // Equation of state w
      const e = params.h ?? 0;     // Time parameter
      const f = params.i ?? 0.05;  // Perturbation amplitude

      // Friedmann equation solutions
      const scale_factor = Math.exp(e * Math.sqrt(a) * c / 100);
      const H_t = c * Math.sqrt(a / Math.pow(scale_factor, 3*(1+d)) + b / Math.pow(scale_factor, 3));
      
      // Dark energy equation of state P = wρc²
      const pressure = d * a * Math.pow(scale_factor, -3*(1+d));
      const density = a * Math.pow(scale_factor, -3*(1+d));
      
      // Cosmic web structure
      const r = Math.sqrt(u*u + v*v);
      const theta = Math.atan2(v, u);
      
      // Large-scale structure formation
      const growth_factor = Math.exp(-a * e) * Math.pow(scale_factor, b);
      const density_contrast = f * Math.sin(10 * r) * growth_factor;
      
      // Accelerated expansion visualization
      const x = scale_factor * r * Math.cos(theta) * (1 + density_contrast);
      const y = scale_factor * r * Math.sin(theta) * (1 + density_contrast);
      const z = pressure * Math.sin(c * e) + density_contrast * Math.cos(H_t * e);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.7, e: 0.3, f: 70.0, g: -1.0, h: 0, i: 0.05, uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 100, vSegments: 100 }
  },

  quantum_chromodynamics_flux: {
    name: "🎨 QCD Flux Tubes - Strong Force Confinement",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1.2;   // Strong coupling αₛ
      const b = params.e ?? 0.2;   // QCD scale Λ_QCD
      const c = params.f ?? 3.0;   // Color charge factor
      const d = params.g ?? 1.0;   // Gluon field strength
      const e = params.h ?? 0;     // Gauge parameter
      const f = params.i ?? 0.8;   // Confinement radius

      // SU(3) color symmetry
      const gellmann_matrices = 8; // 8 gluons
      const color_angle = u * 2 * Math.PI / 3; // R,G,B symmetry
      
      // QCD potential V(r) = -4αₛ/(3r) + σr (Coulomb + linear)
      const r = Math.sqrt(u*u + v*v) + 0.1;
      const coulomb_term = -4 * a / (3 * r);
      const linear_term = b * r; // String tension
      const qcd_potential = coulomb_term + linear_term;
      
      // Gluon field tensor F_μν
      const field_strength = d * Math.sin(c * color_angle) * Math.exp(-r / f);
      
      // Flux tube between quarks
      const tube_radius = Math.sqrt(b * r); // Flux tube expansion
      const flux_density = Math.exp(-r*r / (2 * f*f));
      
      // Wilson loop area law
      const wilson_loop = Math.exp(-b * Math.PI * tube_radius*tube_radius);
      
      const x = tube_radius * Math.cos(color_angle) * flux_density;
      const y = tube_radius * Math.sin(color_angle) * flux_density;
      const z = qcd_potential * field_strength + wilson_loop * Math.sin(gellmann_matrices * e);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 0.2, f: 3.0, g: 1.0, h: 0, i: 0.8, uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 80, vSegments: 80 }
  },

  higgs_field_vacuum: {
    name: "⚡ Higgs Field Vacuum - Spontaneous Symmetry Breaking",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 246.0; // Higgs VEV (GeV)
      const b = params.e ?? 125.0; // Higgs mass (GeV)
      const c = params.f ?? 0.1;   // Coupling strength
      const d = params.g ?? 1.0;   // Self-interaction λ
      const e = params.h ?? 0;     // Gauge parameter
      const f = params.i ?? 0.2;   // Quantum corrections

      // Higgs potential V(φ) = μ²φ² + λφ⁴
      const phi = Math.sqrt(u*u + v*v); // Higgs field magnitude
      const mu_squared = -Math.pow(b, 2); // Negative mass squared
      const lambda = d;
      const higgs_potential = mu_squared * phi*phi + lambda * Math.pow(phi, 4);
      
      // Vacuum expectation value
      const vev = a / Math.sqrt(2);
      const vacuum_stability = phi - vev;
      
      // Goldstone bosons (eaten by W,Z)
      const goldstone1 = Math.cos(u * 2 * Math.PI);
      const goldstone2 = Math.sin(v * 2 * Math.PI);
      const goldstone3 = Math.cos((u + v) * Math.PI);
      
      // Electroweak symmetry breaking
      const ew_breaking = Math.exp(-Math.abs(vacuum_stability) / vev);
      
      // Mexican hat potential visualization
      const radial_distance = Math.abs(phi - vev);
      const x = vev * Math.cos(u * 2 * Math.PI) + c * goldstone1 * ew_breaking;
      const y = vev * Math.sin(v * 2 * Math.PI) + c * goldstone2 * ew_breaking;
      const z = higgs_potential / 1000 + f * goldstone3 * Math.sin(e + u + v);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 246.0, e: 125.0, f: 0.1, g: 1.0, h: 0, i: 0.2, uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 80, vSegments: 80 }
  },

  schwarzschild_geometry: {
    name: "🕳️ Schwarzschild Geometry - Black Hole Spacetime",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2.0;   // Schwarzschild radius rs = 2GM/c²
      const b = params.e ?? 1.0;   // Mass parameter M
      const c = params.f ?? 1.0;   // Speed of light
      const d = params.g ?? 1.0;   // Time coordinate scaling
      const e = params.h ?? 0;     // Time parameter
      const f = params.i ?? 0.1;   // Tidal effects

      // Schwarzschild metric coordinates
      const r = Math.exp(u) * a; // Radial coordinate (logarithmic to avoid singularity)
      const theta = v * Math.PI;
      const phi = u * 2 * Math.PI;
      
      // Schwarzschild radius
      const rs = a;
      
      // Metric coefficients
      const g_tt = -(1 - rs/r); // Time dilation
      const g_rr = 1 / (1 - rs/r); // Radial stretching
      const g_theta = r*r;
      const g_phi = r*r * Math.sin(theta)*Math.sin(theta);
      
      // Avoid singularity at r = rs
      if (r <= rs * 1.1) {
        return [0, 0, 0];
      }
      
      // Curvature tensor components
      const ricci_scalar = 0; // Vacuum solution
      const weyl_curvature = rs*rs*rs / (r*r*r*r*r*r);
      
      // Geodesic paths (light rays and particle trajectories)
      const deflection_angle = 4 * b / r; // Light bending
      
      // Embedded surface visualization
      const embedding_z = 2 * Math.sqrt(rs * (r - rs)); // Flamm's paraboloid
      
      const x = Math.sqrt(Math.abs(g_rr)) * r * Math.sin(theta) * Math.cos(phi);
      const y = Math.sqrt(Math.abs(g_rr)) * r * Math.sin(theta) * Math.sin(phi);
      const z = embedding_z + f * weyl_curvature * Math.sin(e + deflection_angle);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 1.0, g: 1.0, h: 0, i: 0.1, uMin: 0.1, uMax: 3, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40 }
  },

  quantum_error_correction: {
    name: "🔧 Quantum Error Correction - Stabilizer Codes",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 7.0;   // Code distance [7,1,3] Steane code
      const b = params.e ?? 3.0;   // Error correction threshold
      const c = params.f ?? 0.1;   // Decoherence rate
      const d = params.g ?? 4.0;   // Stabilizer generators
      const e = params.h ?? 0;     // Error syndrome
      const f = params.i ?? 0.2;   // Logical qubit protection

      // Steane code stabilizers
      const stabilizers = [
        [1,0,0,1,0,0,1], // X-type
        [0,1,0,1,0,1,0],
        [0,0,1,0,1,1,1],
        [1,0,0,0,1,0,1], // Z-type
        [0,1,0,0,1,1,0],
        [0,0,1,1,0,1,0]
      ];
      
      // Qubit positions on 3D lattice
      const qubit_x = Math.floor(u * a) % a;
      const qubit_y = Math.floor(v * a) % a;
      const qubit_z = Math.floor((u + v) * a) % a;
      
      // Error syndrome calculation
      let syndrome = 0;
      for(let i = 0; i < stabilizers.length; i++) {
        syndrome += stabilizers[i][qubit_x % 7] * Math.sin(i * Math.PI / d);
      }
      
      // Error probability
      const error_prob = c * Math.exp(-Math.abs(syndrome));
      
      // Logical qubit state fidelity
      const fidelity = 1 - error_prob;
      
      // Surface code visualization
      const surface_height = fidelity * Math.cos(syndrome + e);
      
      // Threshold theorem visualization
      const threshold = Math.exp(-b * error_prob);
      
      const x = a * (u - 0.5) + f * Math.sin(syndrome * Math.PI);
      const y = a * (v - 0.5) + f * Math.cos(syndrome * Math.PI);
      const z = surface_height + threshold * Math.sin(d * (u + v));

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 7.0, e: 3.0, f: 0.1, g: 4.0, h: 0, i: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 50 }
  },

  // HIGH-VALUE MATHEMATICAL SURFACES WITH FULL A-F PARAMETER CONTROL
  nautilus_shell: {
    name: "🐚 Nautilus Shell - Mathematical Surface",
    equation: (u: number, v: number, params: any) => {
      const theta = u;
      const phi = v;

      // Full A-F mathematical parameter control
      const radius = params.d * Math.exp(params.e * theta * 0.15);                  // A,B: Exponential growth
      const chamber = params.f * Math.sin(params.g * theta + phi * 0.5);            // C,D: Chamber modulation
      const spiral = params.h * Math.cos(theta * 2 + phi);                         // E: Cross spiral
      const texture = params.i * Math.sin(theta * 5) * Math.cos(phi * 3) * 0.1;    // F: Shell texture

      const baseX = (radius + chamber + spiral * 0.2) * Math.cos(theta);
      const baseY = (radius + chamber + spiral * 0.2) * Math.sin(theta);
      const baseZ = phi * params.f * 0.3 + Math.sin(theta * 3) * params.g * 0.15 + texture;

      return [baseX, baseY, baseZ];
    },
    defaults: { 
      a: 1.5, e: 2.0, f: 1.2, g: 1.5, h: 0.8, i: 0.6,
      uMin: 0, uMax: 4 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 96, vSegments: 48 
    }
  },

  enneper_surface: {
    name: "🌀 Enneper's Surface - Clean", 
    equation: (u: number, v: number, params: any) => {
      const x = params.d * (u - u*u*u/3 + u*v*v) + params.g * Math.sin(u);
      const y = params.e * (v - v*v*v/3 + u*u*v) + params.g * Math.cos(v);
      const z = params.f * (u*u - v*v);

      return [x, y, z];
    },
    defaults: { 
      a: 1.0, e: 1.0, f: 1.0, g: 0.3,
      uMin: -2, uMax: 2, vMin: -2, vMax: 2, uSegments: 60, vSegments: 60 
    }
  },

  flower_of_life_3d: {
    name: "🌸 3D Flower of Life - Clean",
    equation: (u: number, v: number, params: any) => {
      const circleIndex = Math.floor(u * params.f) % Math.floor(params.f);
      const theta = (u * params.f) % 1 * 2 * Math.PI;
      const phi = v * 2 * Math.PI;

      let centerX = 0, centerY = 0;
      if (circleIndex > 0) {
        const hexAngle = (circleIndex - 1) * Math.PI / 3;
        centerX = params.d * Math.cos(hexAngle);
        centerY = params.d * Math.sin(hexAngle);
      }

      const x = centerX + params.e * Math.cos(theta);
      const y = centerY + params.e * Math.sin(theta);
      const z = params.g * Math.sin(phi) + Math.cos(theta * 6);

      return [x, y, z];
    },
    defaults: { 
      a: 1.0, e: 1.0, f: 6.0, g: 0.6,
      uMin: 0, uMax: 2 * Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 100, vSegments: 50 
    }
  },

  catenoid: {
    name: "⏳ Catenoid - Clean",
    equation: (u: number, v: number, params: any) => {
      const theta = u;
      const w = v;
      const radius = params.d * Math.cosh(params.e * w) + params.f * Math.sin(params.g * theta);

      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta); 
      const z = w;

      return [x, y, z];
    },
    defaults: { 
      a: 1.0, e: 1.0, f: 0.5, g: 1.0,
      uMin: 0, uMax: 2 * Math.PI, vMin: -2, vMax: 2, uSegments: 50, vSegments: 80 
    }
  },

  helicoid: {
    name: "🌪️ Helicoid - Clean",
    equation: (u: number, v: number, params: any) => {
      const rho = u;
      const theta = v;

      const x = (rho + params.f * Math.sin(params.g * theta)) * Math.cos(theta);
      const y = (rho + params.f * Math.sin(params.g * theta)) * Math.sin(theta);
      const z = params.d * theta + params.e * Math.sin(rho);

      return [x, y, z];
    },
    defaults: { 
      a: 0.5, e: 1.0, f: 1.0, g: 0.3,
      uMin: 0, uMax: 2 * Math.PI, vMin: -2, vMax: 2, uSegments: 60, vSegments: 80 
    }
  },

  // ADVANCED 4D POLYTOPES AND MANIFOLDS - MISSING SHAPES
  calabi_yau: {
    name: "🌌 Calabi-Yau Manifold - 6D Projection",
    equation: (u: number, v: number, params: any) => {
      const theta = u * 2 * Math.PI;
      const phi = v * Math.PI;

      // Calabi-Yau manifold projection with full A-F control
      const r1 = params.d * (2 + Math.cos(3 * theta + params.g * phi));           // A,D: Primary manifold
      const r2 = params.e * (1 + Math.sin(2 * phi + params.h * theta));           // B,E: Secondary manifold
      const modulation = params.f * Math.cos(5 * theta) * Math.sin(3 * phi);      // C: Cross modulation
      const animation = params.i * Math.sin(theta + phi * 2) * 0.1;               // F: Animation layer

      const x = (r1 + modulation) * Math.cos(theta) * Math.sin(phi);
      const y = (r1 + modulation) * Math.sin(theta) * Math.sin(phi);
      const z = (r2 + animation) * Math.cos(phi);

      return [x, y, z];
    },
    defaults: { 
      a: 2.0, e: 1.5, f: 0.5, g: 2, h: 3, i: 1,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 
    }
  },

  cell_120_advanced: {
    name: "🔬 120-Cell Polytope - 4D Projection (Advanced)", 
    equation: (u: number, v: number, params: any) => {
      const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
      const theta = u * 2 * Math.PI;
      const psi = v * Math.PI;

      // 120-cell polytope projection with full A-F parameter control
      const r = params.d * (phi + Math.cos(params.g * theta));                    // A,D: Golden ratio scaling
      const modulation = params.e * Math.sin(params.h * psi) * 0.3;               // B,E: 4D modulation
      const complexity = params.f * Math.cos(3 * theta) * Math.sin(2 * psi);      // C: Dodecahedral complexity
      const animation = params.i * Math.sin(theta * phi + psi) * 0.1;             // F: Animation

      const x = (r + modulation) * Math.cos(theta) * Math.sin(psi);
      const y = (r + modulation) * Math.sin(theta) * Math.sin(psi);
      const z = (r + complexity + animation) * Math.cos(psi);

      return [x, y, z];
    },
    defaults: { 
      a: 1.8, e: 0.6, f: 0.4, g: 5, h: 3, i: 2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 90, vSegments: 60 
    }
  },

  grand_120_cell: {
    name: "🌟 Grand 120-Cell - Star Polytope",
    equation: (u: number, v: number, params: any) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const theta = u * 2 * Math.PI;
      const psi = v * 2 * Math.PI;

      // Grand stellated 120-cell with full A-F mathematical control
      const r1 = params.d * (phi * 2 + Math.cos(params.g * theta * 2));           // A,D: Stellated radius
      const r2 = params.e * (1 + Math.sin(params.h * psi / phi));                 // B,E: Golden modulation
      const star = params.f * Math.cos(5 * theta) * Math.sin(5 * psi);            // C: Star pattern
      const anim = params.i * Math.sin(theta * phi + psi * phi) * 0.15;           // F: Golden animation

      const x = (r1 + star) * Math.cos(theta) * Math.sin(psi);
      const y = (r1 + star) * Math.sin(theta) * Math.sin(psi);
      const z = (r2 + anim) * Math.cos(psi);

      return [x, y, z];
    },
    defaults: { 
      a: 2.2, e: 1.2, f: 0.8, g: 3, h: 5, i: 2,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 80 
    }
  },

  grand_stellated_120_cell: {
    name: "⭐ Grand Stellated 120-Cell - Ultimate",
    equation: (u: number, v: number, params: any) => {
      const phi = (1 + Math.sqrt(5)) / 2;
      const theta = u * 2 * Math.PI;
      const psi = v * 2 * Math.PI;

      // Ultimate stellated form with maximum A-F control
      const base = params.d * phi * 2;                                             // A: Golden base
      const spike = params.e * Math.cos(params.g * theta * 3);                    // B,D: Spike pattern
      const star = params.f * Math.sin(params.h * psi * 2) * 1.5;                 // C,E: Star intensity
      const morph = params.i * Math.cos(theta * phi) * Math.sin(psi * phi) * 0.3; // F: Morphing

      const radius = base + spike + star + morph;

      const x = radius * Math.cos(theta) * Math.sin(psi);
      const y = radius * Math.sin(theta) * Math.sin(psi);
      const z = radius * Math.cos(psi);

      return [x, y, z];
    },
    defaults: { 
      a: 2.5, e: 1.5, f: 1.0, g: 4, h: 6, i: 3,
      uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 90 
    }
  },

  // BIOLOGICAL CELL AND TISSUE MODELING SHAPES
  spherical_stem_cell: {
    name: "🧬 Spherical Stem Cell (hiPSCs)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r = params.d ?? 1;                                    // A: Cell radius (5-10μm)
      const surface_noise = params.g * Math.sin(6 * phi) * 0.05; // D: Membrane irregularities
      const pulsation = params.h * Math.sin(theta * 3) * 0.02;   // E: Cell pulsation
      
      // Smooth pluripotent membrane texture with fractal microvillus patterns
      const k = params.k ?? 15;
      const microvilli = Math.sin(theta * k) * Math.cos(phi * k) * 0.015;
      const fractalMembrane = Math.abs(Math.sin(u * 25) * Math.cos(v * 25)) * 0.01;
      const lipidRaft = Math.sin(phi * 8) * Math.cos(theta * 6) * 0.008;

      const radius = r + surface_noise + pulsation + microvilli + fractalMembrane + lipidRaft;

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 0.05, h: 0.05, i: 0, k: 15 }
  },

  ellipsoidal_neural_precursor: {
    name: "🧠 Ellipsoidal Neural Precursor (NPCs)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const a = params.d ?? 0.8;  // 8μm width
      const b = params.e ?? 0.6;  // 6μm height
      const c = params.f ?? 1.0;  // 10μm length (elongated)
      const deform = params.g * Math.sin(4 * phi) * 0.1; // D: Deformation

      const x = a * Math.sin(theta) * Math.cos(phi) + deform;
      const y = b * Math.sin(theta) * Math.sin(phi);
      const z = c * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.8, e: 0.6, f: 1.0, g: 0.1, h: 0.1, i: 0 }
  },

  neuronal_cell_body_detailed: {
    name: "🔬 Neuronal Cell Body (Membrane) - Detailed",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r = params.d ?? 1.5;                                           // A: Base radius (12-20μm)
      const membrane_ripples = params.g * Math.sin(params.h * phi) * 0.1;  // D,E: Membrane irregularities
      const surface_bumps = params.i * Math.sin(params.h * theta) * 0.1;   // F,E: Surface perturbations
      
      // Rough endoplasmic reticulum and Nissl body texture
      const k = params.k ?? 12;
      const nisslBodies = Math.sin(theta * k * 0.8) * Math.cos(phi * k * 1.2) * 0.08;
      const roughER = Math.abs(Math.sin(u * 18) * Math.cos(v * 22)) * 0.05;
      const ribosomes = Math.sin(phi * 15 + theta * 18) * 0.02;
      const dendriticSpines = Math.cos(theta * 10) * Math.sin(phi * 8) * 0.04;

      const radius = r * (1 + membrane_ripples + surface_bumps + nisslBodies * 0.01 + roughER + ribosomes + dendriticSpines);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.5, f: 1.5, g: 0.1, h: 6, i: 6, k: 12 }
  },

  dendritic_branches: {
    name: "🌿 Dendritic Branches (Fractal Tree)",
    equation: (u: number, v: number, params: any) => {
      const t = u;
      const branch_angle = v * 2 * Math.PI;

      const L = params.d ?? 2;                           // A: Branch length
      const branch_decay = params.e ?? 0.7;             // B: Branch decay factor
      const angle_var = params.g ?? 30;                 // D: Angle variation (degrees)
      const azimuth_var = params.h ?? 60;               // E: Azimuth variation

      // Fractal branching pattern
      const theta = (angle_var * Math.PI / 180) * Math.sin(branch_angle * 2);
      const phi = branch_angle + (azimuth_var * Math.PI / 180) * Math.cos(branch_angle);

      const branch_radius = params.f * (1 - t) * 0.3;   // C: Branch thickness taper

      const x = L * Math.cos(theta) * Math.cos(phi) * t + branch_radius * Math.cos(branch_angle);
      const y = L * Math.cos(theta) * Math.sin(phi) * t + branch_radius * Math.sin(branch_angle);
      const z = L * Math.sin(theta) * t;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.7, f: 0.3, g: 30, h: 60, i: 1 }
  },

  axon_with_myelin: {
    name: "🔗 Axon with Myelin Sheath",
    equation: (u: number, v: number, params: any) => {
      const t = u;
      const theta = v * 2 * Math.PI;

      const path_length = params.d ?? 2;                // A: Axon length
      const r_axon = params.e ?? 0.05;                  // B: Axon core radius (0.5-2μm)
      const r_myelin_base = params.f ?? 0.15;           // C: Myelin thickness
      const segments = params.g ?? 10;                  // D: Number of myelin segments
      const node_gaps = params.h ?? 0.2;                // E: Nodes of Ranvier gaps
      const wraps = params.i ?? 100;                    // F: Myelin wrap frequency

      // Segmented myelin sheath
      const segment_pos = Math.floor(t * segments) / segments;
      const is_node = Math.sin(t * segments * Math.PI) > 0.8; // Nodes of Ranvier
      const myelin_thickness = is_node ? r_axon : r_myelin_base * (1 + node_gaps * Math.sin(wraps * t));

      const x = path_length * t;
      const y = myelin_thickness * Math.cos(theta);
      const z = myelin_thickness * Math.sin(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.05, f: 0.15, g: 10, h: 0.2, i: 100 }
  },

  oligodendrocyte_star: {
    name: "⭐ Oligodendrocyte (Star-shaped)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r_body = params.d ?? 1;                     // A: Central body radius
      const num_processes = params.g ?? 8;              // D: Number of processes (8-12)
      const process_length = params.h ?? 25;            // E: Process length (20-50μm)

      // Star-shaped with radiating processes
      const process_factor = Math.max(0, Math.cos(num_processes * phi / 2));
      const radius = r_body + process_length * process_factor * Math.sin(theta);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 10, f: 0.8, g: 8, h: 25, i: 1 }
  },

  microglia_ramified: {
    name: "🌲 Microglia Ramified (Resting)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r_base = params.d ?? 0.8;                   // A: Base radius
      const branch_complexity = params.g ?? 0.3;        // D: Branching complexity
      const branch_freq = params.h ?? 2;                // E: Branch frequency
      const process_density = params.i ?? 4;            // F: Process density

      // Highly branched ramified state using fractal-like surface
      const ramification = branch_complexity * (
        Math.sin(branch_freq * theta * 3) * Math.cos(process_density * phi * 2) +
        Math.sin(process_density * phi * 3) * Math.cos(branch_freq * theta * 2)
      );
      
      // Ramified process texture with surveillance domain
      const k = params.k ?? 10;
      const branchTexture = Math.sin(theta * k) * Math.cos(phi * k * 0.7) * 0.12;
      const fractalBranching = Math.abs(Math.sin(u * 20 + v * 16) * Math.cos(u * 16 - v * 20)) * 0.08;
      const filopodia = Math.sin(phi * 18) * Math.cos(theta * 14) * 0.06;
      const surveillanceDomain = Math.cos(theta * 5 + phi * 7) * 0.05;

      const radius = r_base * (1 + ramification + branchTexture + fractalBranching + filopodia + surveillanceDomain);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.8, e: 0.8, f: 0.8, g: 0.3, h: 2, i: 4, k: 10 }
  },

  microglia_activated_detailed: {
    name: "🔴 Microglia Activated (Amoeboid) - Detailed",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r_base = params.d ?? 1.2;                   // A: Expanded radius
      const deformation = params.g ?? 0.5;              // D: Amoeboid deformation
      const noise_freq = params.h ?? 0.1;               // E: Surface noise frequency
      const blob_factor = params.i ?? 0.2;              // F: Blob-like irregularities

      // Amoeboid activated state with irregular surface
      const surface_noise = deformation * (
        Math.sin(theta * 5 + phi * 3) * noise_freq +
        Math.cos(theta * 3 + phi * 5) * blob_factor
      );
      
      // Phagocytic surface with membrane ruffling
      const k = params.k ?? 8;
      const membraneRuffles = Math.sin(theta * k * 1.2) * Math.cos(phi * k * 0.9) * 0.18;
      const phagocyticCup = Math.abs(Math.sin(u * 14 + v * 18) * Math.cos(u * 18 - v * 14)) * 0.12;
      const pseudopods = Math.sin(phi * 12 + theta * 9) * 0.15;
      const activationBumps = Math.cos(theta * 7) * Math.sin(phi * 11) * 0.1;

      const radius = r_base * (1 + surface_noise + membraneRuffles + phagocyticCup + pseudopods + activationBumps);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 1.2, f: 1.2, g: 0.5, h: 0.1, i: 0.2, k: 8 }
  },

  brain_organoid: {
    name: "🧠 Brain Organoid (Deformed Sphere)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const R = params.d ?? 3;                          // A: Base organoid radius (0.5-2mm)
      const deform1 = params.g ?? 0.2;                  // D: First harmonic deformation
      const deform2 = params.h ?? 0.1;                  // E: Second harmonic deformation
      const growth_pattern = params.i ?? 2;             // F: Growth pattern complexity

      // Spherical harmonics deformation Y₂² and Y₄⁴
      const Y22 = Math.sin(theta) * Math.sin(theta) * Math.cos(2 * phi);
      const Y44 = Math.sin(theta) * Math.sin(theta) * Math.sin(theta) * Math.sin(theta) * Math.cos(4 * phi);

      const radius = R * (1 + deform1 * Y22 + deform2 * Y44 + 
                         growth_pattern * 0.05 * Math.sin(3 * theta) * Math.cos(3 * phi));

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 3, f: 3, g: 0.2, h: 0.1, i: 2 }
  },

  // Complete the remaining biological cells
  cell_density_gaussian: {
    name: "📊 Cell Density (Gaussian Distribution)",
    equation: (u: number, v: number, params: any) => {
      const r = u * (params.d ?? 2);
      const theta = v * Math.PI;
      const phi = u * 2 * Math.PI;

      const r0 = params.e ?? 2;                          // B: Radius of maximum density
      const sigma = params.g ?? 0.5;                     // D: Density falloff parameter
      const angular_var = params.h ?? 4;                 // E: Angular variation frequency
      const amplitude = params.i ?? 1;                   // F: Angular variation amplitude

      // Gaussian density distribution ρ(r,θ,φ) = ρ₀ * exp(-(r-r₀)²/2σ²) * (1 + A*cos(nθ))
      const density = Math.exp(-Math.pow(r - r0, 2) / (2 * sigma * sigma)) * 
                     (1 + amplitude * Math.cos(angular_var * theta));

      const height = params.f * density;                 // C: Height scaling

      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      const z = height;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 1, g: 0.5, h: 4, i: 1 }
  },

  dividing_cell_detailed: {
    name: "🔄 Dividing Cell (Mitosis) - Detailed",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const r_base = params.d ?? 1.2;                    // A: Base cell radius
      const constriction = params.g ?? 0.3;              // D: Division constriction
      const division_plane = params.h ?? 2;              // E: Division plane sharpness

      // Cell division with constriction at the middle
      const z_factor = Math.cos(theta);
      const constriction_factor = 1 - constriction * Math.exp(-division_plane * z_factor * z_factor);
      
      // Mitotic spindle and chromatin condensation texture
      const k = params.k ?? 14;
      const mitoticSpindle = Math.sin(theta * k * 0.5) * Math.cos(phi * 2) * 0.08;
      const chromatinCondensation = Math.abs(Math.sin(u * 22 + v * 18) * Math.cos(u * 18 - v * 22)) * 0.1;
      const cleavageFurrow = Math.sin(phi * 16) * Math.exp(-4 * z_factor * z_factor) * 0.12;
      const actinRing = Math.cos(theta * 1 + phi * 12) * Math.exp(-3 * z_factor * z_factor) * 0.06;

      const radius = r_base * (constriction_factor + mitoticSpindle + chromatinCondensation + cleavageFurrow + actinRing);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = params.f * Math.cos(theta);               // C: Cell elongation

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 1.2, f: 0.8, g: 0.3, h: 2, i: 1, k: 14 }
  },

  differentiation_transition: {
    name: "🔀 Differentiation Transition",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;

      const a = params.d ?? 1;                           // A: Initial state radius
      const b = params.e ?? 1.2;                         // B: Final state width
      const c = params.f ?? 1.4;                         // C: Final state height
      const transition = params.g ?? 0.7;                // D: Transition factor (0-1)

      // Morphology interpolation: M(t) = M_initial * (1-α(t)) + M_final * α(t)
      const alpha = transition;
      const radius_x = a * (1 - alpha) + b * alpha;
      const radius_z = a * (1 - alpha) + c * alpha;

      const shape_modulation = params.h * Math.sin(4 * phi) * 0.1; // E: Shape variation

      const x = radius_x * Math.sin(theta) * Math.cos(phi) + shape_modulation;
      const y = radius_x * Math.sin(theta) * Math.sin(phi);
      const z = radius_z * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 1.2, f: 1.4, g: 0.7, h: 0.5, i: 0.3 }
  },

  cortical_layer: {
    name: "🏗️ Cortical Layer (Tissue Structure)",
    equation: (u: number, v: number, params: any) => {
      const x = u * (params.d ?? 4);                       // A: Layer width
      const y = v * (params.e ?? 4);                       // B: Layer depth

      const wave_x = params.g ?? 2;                      // D: X-direction wave frequency
      const wave_y = params.h ?? 2;                      // E: Y-direction wave frequency
      const amplitude = params.i ?? 1;                   // F: Wave amplitude

      // Layered structure: z_layer(x,y) = z₀ + A*sin(2π*x/λ_x)*sin(2π*y/λ_y)
      const z = params.f * 0.5 + amplitude * Math.sin(2 * Math.PI * x / wave_x) * 
                                              Math.sin(2 * Math.PI * y / wave_y);

      return [x - params.d * 0.5, y - params.e * 0.5, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 4, f: 0.5, g: 2, h: 2, i: 1 }
  },

  vascular_network: {
    name: "🩸 Vascular Network (Blood Vessels)",
    equation: (u: number, v: number, params: any) => {
      const t = u;
      const theta = v * 2 * Math.PI;

      const L = params.d ?? 3;                           // A: Vessel length
      const r0 = params.e ?? 0.3;                        // B: Initial radius
      const taper = params.g ?? 0.4;                     // D: Radius taper factor
      const branch_freq = params.i ?? 8;                 // F: Branching frequency

      // Branching blood vessels with radius taper: r(t,n) = r₀ * (1-t)^β
      const radius = r0 * Math.pow(1 - t, taper) * (1 + params.h * Math.sin(branch_freq * t) * 0.1);

      // Curved vessel path
      const path_curve = params.f ?? 0.1;                // C: Path curvature

      const x = L * t;
      const y = radius * Math.cos(theta) + path_curve * Math.sin(2 * Math.PI * t);
      const z = radius * Math.sin(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 0.3, f: 0.1, g: 0.4, h: 1, i: 8 }
  },



  // CAPILLARY WAVE SYSTEMS - Advanced Wave Algorithms
  capillary_wave_001: {
    name: "🌊 CAPILLARY-001: Linear Capillary Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k = params.e ?? 2.0;          // Wave number
      const sigma = params.f ?? 0.073;    // Surface tension (N/m, water at 20°C)
      const rho = params.g ?? 1000;       // Fluid density (kg/m³, water)
      const g = params.h ?? 9.81;        // Gravitational acceleration
      const t = params.i ?? 0;           // Time parameter for animation

      // Map parametric coordinates to physical space
      const x = (u - 0.5) * 10;          // X coordinate [-5, 5]
      const y = (v - 0.5) * 10;          // Y coordinate [-5, 5]

      // Capillary dispersion relation: ω² = (σ/ρ)k³ + gk
      const omega_squared = (sigma / rho) * Math.pow(k, 3) + g * k;
      const omega = Math.sqrt(omega_squared);

      // Capillary wave equation: C₁(x,y,t) = A sin(kx + ωt)
      const wave_phase = k * x + omega * t;
      const z = A * Math.sin(wave_phase);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 0.073, g: 1000, h: 9.81, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  circular_capillary_001: {
    name: "🌊 CIRCULAR-CAP-001: Bessel Function Capillary Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k = params.e ?? 1.5;          // Wave number
      const omega = params.f ?? 3.0;      // Angular frequency
      const t = params.i ?? 0;           // Time parameter

      // Map to cylindrical coordinates
      const x = (u - 0.5) * 8;           // X coordinate [-4, 4]
      const y = (v - 0.5) * 8;           // Y coordinate [-4, 4]
      const r = Math.sqrt(x * x + y * y); // Radial distance

      // Bessel function J₀(kr) approximation for circular waves
      const kr = k * r;
      let J0_kr;
      if (kr === 0) {
        J0_kr = 1.0;
      } else if (kr < 3) {
        // Power series approximation for small arguments
        const z = kr * kr / 4;
        J0_kr = 1 - z + z*z/4 - z*z*z/36;
      } else {
        // Asymptotic approximation for large arguments
        J0_kr = Math.sqrt(2 / (Math.PI * kr)) * Math.cos(kr - Math.PI/4);
      }

      // Circular capillary wave: C₂(x,y,t) = A J₀(kr) sin(ωt)
      const z = A * J0_kr * Math.sin(omega * t);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.5, f: 3.0, g: 1.0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  surface_tension_001: {
    name: "🌊 SURFACE-TENSION-001: Exponentially Decaying Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k = params.e ?? 1.0;          // Wave number
      const omega = params.f ?? 2.0;      // Angular frequency
      const decay_rate = params.g ?? 0.5; // Decay rate parameter
      const t = params.i ?? 0;           // Time parameter

      // Map parametric coordinates to physical space
      const x = (u - 0.5) * 12;          // X coordinate [-6, 6]
      const y = (v - 0.5) * 12;          // Y coordinate [-6, 6]
      const r = Math.sqrt(x * x + y * y); // Radial distance for decay

      // Surface tension wave: C₃(x,y,t) = A e^(-kr) cos(kx + ωt)
      const exponential_decay = Math.exp(-decay_rate * r);
      const wave_phase = k * x + omega * t;
      const z = A * exponential_decay * Math.cos(wave_phase);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 2.0, g: 0.5, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  faraday_wave_001: {
    name: "🌊 FARADAY-001: Parametric Faraday Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k_x = params.e ?? 2.0;        // X-direction wave number
      const k_y = params.f ?? 2.0;        // Y-direction wave number
      const Omega = params.g ?? 4.0;      // Driving frequency Ω
      const damping = params.h ?? 0.1;    // Damping coefficient
      const t = params.i ?? 0;           // Time parameter

      // Map parametric coordinates to physical space
      const x = (u - 0.5) * 6;           // X coordinate [-3, 3]
      const y = (v - 0.5) * 6;           // Y coordinate [-3, 3]

      // Faraday instability: subharmonic response at Ω/2
      // Standing wave pattern from counterpropagating waves
      const subharmonic_freq = Omega / 2;
      
      // Standing wave structure: cos(kx)cos(ky) for rectangular pattern
      const standing_wave_x = Math.cos(k_x * x);
      const standing_wave_y = Math.cos(k_y * y);
      const spatial_pattern = standing_wave_x * standing_wave_y;
      
      // Temporal evolution with damping envelope
      const damped_amplitude = Math.exp(-damping * Math.abs(t));
      const temporal_modulation = damped_amplitude * Math.cos(subharmonic_freq * t);
      
      // Faraday wave: z = A * cos(k_x*x) * cos(k_y*y) * exp(-γt) * cos(Ω*t/2)
      const z = A * spatial_pattern * temporal_modulation;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 2.0, g: 4.0, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  marangoni_wave_001: {
    name: "🌊 MARANGONI-001: Marangoni Convection Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k = params.e ?? 2.0;          // Wave number magnitude
      const gradient_strength = params.f ?? 1.0; // Temperature gradient strength
      const Ma = params.g ?? 100;         // Marangoni number
      const Ra = params.h ?? 1000;        // Rayleigh number
      const t = params.i ?? 0;           // Time parameter

      // Map parametric coordinates to physical space
      const x = (u - 0.5) * 8;           // X coordinate [-4, 4]
      const y = (v - 0.5) * 8;           // Y coordinate [-4, 4]

      // Hexagonal pattern using 3-mode superposition at 60° angles
      // Wave vectors: e1=(1,0), e2=(-1/2, √3/2), e3=(-1/2, -√3/2)
      const k1_x = k, k1_y = 0;                    // Mode 1: 0°
      const k2_x = -k/2, k2_y = k * Math.sqrt(3)/2;  // Mode 2: 120°
      const k3_x = -k/2, k3_y = -k * Math.sqrt(3)/2; // Mode 3: 240°

      // Phase for each mode
      const phase1 = k1_x * x + k1_y * y;
      const phase2 = k2_x * x + k2_y * y;
      const phase3 = k3_x * x + k3_y * y;

      // Hexagonal pattern from 3-mode superposition
      const mode1 = Math.cos(phase1);
      const mode2 = Math.cos(phase2);
      const mode3 = Math.cos(phase3);
      const hex_pattern = (mode1 + mode2 + mode3) / 3;

      // Temperature gradient envelope (Gaussian decay from center)
      const r_squared = x*x + y*y;
      const thermal_envelope = gradient_strength * Math.exp(-0.1 * r_squared);

      // Marangoni characteristic frequency: ω_M = √(Ma/Ra) * k_c
      const k_critical = Math.PI / Math.sqrt(2);
      const omega_m = Math.sqrt(Ma / Ra) * k_critical;
      const time_evolution = Math.cos(omega_m * t);

      // Marangoni convection wave: z = A * Σ_i cos(k_i·r) * ∇T * cos(ω_M*t)
      const z = A * hex_pattern * thermal_envelope * time_evolution;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 1.0, g: 100, h: 1000, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // ELECTROMAGNETIC WAVE MODELS - UUON Foundation Wave Vector Catalog
  em_plane_wave_001: {
    name: "📡 EM-PLANE-001: Electromagnetic Plane Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const k_x = params.e ?? 2.0;        // Wave vector x-component
      const k_y = params.f ?? 1.0;        // Wave vector y-component  
      const k_z = params.g ?? 0.5;        // Wave vector z-component
      const omega = params.h ?? 3.0;      // Angular frequency ω
      const t = params.i ?? 0;           // Time parameter

      // Map parametric coordinates to 3D space
      const x = (u - 0.5) * 10;          // X coordinate [-5, 5]
      const y = (v - 0.5) * 10;          // Y coordinate [-5, 5]
      const z = 0;                       // Z-plane visualization

      // Plane wave: EM₁(x,y,z,t) = A sin(k·r - ωt)
      const k_dot_r = k_x * x + k_y * y + k_z * z;
      const wave_phase = k_dot_r - omega * t;
      const field_amplitude = A * Math.sin(wave_phase);

      // Height represents field strength
      const wave_z = field_amplitude;

      return [x, y, wave_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 1.0, g: 0.5, h: 3.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  tem_mode_001: {
    name: "📡 TEM-001: Transverse Electromagnetic Mode",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Field amplitude
      const Z0 = params.e ?? 376.730313668;  // Free space impedance (Ω)
      const beta = params.f ?? 2.0;       // Propagation constant
      const freq = params.g ?? 1.0;       // Frequency scaling
      const phase = params.h ?? 0;        // Phase shift
      const t = params.i ?? 0;           // Time parameter

      // Map to cylindrical coordinates for waveguide
      const r = u * 3;                    // Radial coordinate [0, 3]
      const theta = v * 2 * Math.PI;      // Angular coordinate [0, 2π]

      // TEM₀₀ mode has no cutoff frequency, uniform field
      const field_pattern = 1.0;          // Uniform transverse field
      const z_propagation = Math.cos(beta * r + freq * t + phase);
      
      // Convert to Cartesian for visualization
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = A * field_pattern * z_propagation;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 377, f: 2.0, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40 }
  },

  te_mode_001: {
    name: "📡 TE-001: Transverse Electric Mode TE₁₀",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Field amplitude
      const a_guide = params.e ?? 2.0;    // Waveguide width
      const b_guide = params.f ?? 1.0;    // Waveguide height
      const beta = params.g ?? 1.5;       // Propagation constant
      const freq = params.h ?? 2.0;       // Frequency
      const t = params.i ?? 0;           // Time parameter

      // Map to rectangular waveguide coordinates
      const x = u * a_guide;              // X: [0, a]
      const y = v * b_guide;              // Y: [0, b]

      // TE₁₀ mode: dominant mode in rectangular waveguide
      // Hz = A₀ sin(πx/a) exp(jβz - jωt)
      const mode_profile = Math.sin(Math.PI * x / a_guide);
      const propagation = Math.cos(beta * y - freq * t);
      
      const z = A * mode_profile * propagation;

      return [x - a_guide/2, y - b_guide/2, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 1.0, g: 1.5, h: 2.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  tm_mode_001: {
    name: "📡 TM-001: Transverse Magnetic Mode TM₁₁",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Field amplitude
      const a_guide = params.e ?? 2.0;    // Waveguide width
      const b_guide = params.f ?? 2.0;    // Waveguide height
      const beta = params.g ?? 2.0;       // Propagation constant
      const freq = params.h ?? 2.5;       // Frequency
      const t = params.i ?? 0;           // Time parameter

      // Map to rectangular waveguide coordinates
      const x = u * a_guide;              // X: [0, a]
      const y = v * b_guide;              // Y: [0, b]

      // TM₁₁ mode: lowest TM mode
      // Ez = A₀ sin(πx/a) sin(πy/b) exp(jβz - jωt)
      const mode_x = Math.sin(Math.PI * x / a_guide);
      const mode_y = Math.sin(Math.PI * y / b_guide);
      const propagation = Math.cos(beta * (x + y) * 0.5 - freq * t);
      
      const z = A * mode_x * mode_y * propagation;

      return [x - a_guide/2, y - b_guide/2, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2.0, f: 2.0, g: 2.0, h: 2.5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  gaussian_beam_001: {
    name: "📡 GAUSSIAN-BEAM-001: Gaussian Laser Beam",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Peak amplitude
      const w0 = params.e ?? 1.0;         // Beam waist
      const lambda = params.f ?? 0.63;    // Wavelength (μm)
      const z_R = params.g ?? 2.0;        // Rayleigh range
      const k = params.h ?? 10.0;         // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to beam coordinates
      const x = (u - 0.5) * 6;           // Transverse x [-3, 3]
      const y = (v - 0.5) * 6;           // Transverse y [-3, 3]
      const z_prop = 0;                   // Propagation distance

      // Gaussian beam parameters
      const rho_squared = x*x + y*y;      // Radial distance squared
      const w_z = w0 * Math.sqrt(1 + (z_prop/z_R)**2);  // Beam width
      const R_z = z_prop * (1 + (z_R/z_prop)**2);       // Radius of curvature
      
      // Gaussian intensity profile
      const gaussian_profile = Math.exp(-2 * rho_squared / (w_z * w_z));
      const phase = k * z_prop - Math.atan(z_prop / z_R) + k * rho_squared / (2 * R_z);
      
      // Gaussian beam field
      const field = A * (w0 / w_z) * gaussian_profile * Math.cos(phase - k * 3e8 * t);

      return [x, y, field];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 0.63, g: 2.0, h: 10.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  hermite_gaussian_001: {
    name: "📡 HERMITE-GAUSS-001: Hermite-Gaussian Modes",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Amplitude
      const w0 = params.e ?? 1.0;         // Beam waist
      const m = Math.floor(params.f) || 1; // Mode index m
      const n = Math.floor(params.g) || 1; // Mode index n
      const k = params.h ?? 5.0;          // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to beam coordinates
      const x = (u - 0.5) * 4;           // Transverse x [-2, 2]
      const y = (v - 0.5) * 4;           // Transverse y [-2, 2]

      // Hermite polynomials (approximated for low orders)
      const xi_x = Math.sqrt(2) * x / w0;
      const xi_y = Math.sqrt(2) * y / w0;
      
      let H_m, H_n;
      // Simplified Hermite polynomials for m,n = 0,1,2
      switch(m % 3) {
        case 0: H_m = 1; break;
        case 1: H_m = 2 * xi_x; break;
        case 2: H_m = 4 * xi_x * xi_x - 2; break;
        default: H_m = 1;
      }
      switch(n % 3) {
        case 0: H_n = 1; break;
        case 1: H_n = 2 * xi_y; break;
        case 2: H_n = 4 * xi_y * xi_y - 2; break;
        default: H_n = 1;
      }

      // Gaussian envelope
      const gaussian = Math.exp(-(x*x + y*y) / (w0 * w0));
      
      // Hermite-Gaussian mode
      const HG_mode = A * H_m * H_n * gaussian * Math.cos(k * t);

      return [x, y, HG_mode];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1, g: 1, h: 5.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  laguerre_gaussian_001: {
    name: "📡 LAGUERRE-GAUSS-001: Laguerre-Gaussian Modes",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Amplitude
      const w0 = params.e ?? 1.0;         // Beam waist
      const p = Math.floor(params.f) || 0; // Radial mode index
      const l = Math.floor(params.g) || 1; // Azimuthal mode index
      const k = params.h ?? 5.0;          // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to cylindrical coordinates
      const x = (u - 0.5) * 4;           // X [-2, 2]
      const y = (v - 0.5) * 4;           // Y [-2, 2]
      const r = Math.sqrt(x*x + y*y);    // Radial coordinate
      const phi = Math.atan2(y, x);      // Azimuthal angle

      // Laguerre polynomial L_p^|l| (approximated)
      const rho = 2 * r * r / (w0 * w0);
      let L_p;
      switch(p % 3) {
        case 0: L_p = 1; break;
        case 1: L_p = 1 - rho; break;
        case 2: L_p = 1 - 2*rho + rho*rho/2; break;
        default: L_p = 1;
      }

      // Gaussian envelope
      const gaussian = Math.exp(-r*r / (w0 * w0));
      
      // Radial part with Laguerre polynomial
      const radial = Math.pow(Math.sqrt(2) * r / w0, Math.abs(l)) * L_p;
      
      // Azimuthal part
      const azimuthal = Math.cos(l * phi);
      
      // Complete LG mode
      const LG_mode = A * radial * azimuthal * gaussian * Math.cos(k * t);

      return [x, y, LG_mode];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 0, g: 1, h: 5.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  spherical_harmonics_001: {
    name: "📡 SPHERICAL-HARM-001: Spherical Harmonics",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Amplitude
      const l = Math.floor(params.e) || 1; // Degree l
      const m = Math.floor(params.f) || 0; // Order m (|m| ≤ l)
      const radius = params.g ?? 2.0;     // Sphere radius
      const omega = params.h ?? 2.0;      // Frequency
      const t = params.i ?? 0;           // Time parameter

      // Map to spherical coordinates
      const theta = u * Math.PI;          // Polar angle [0, π]
      const phi = v * 2 * Math.PI;        // Azimuthal angle [0, 2π]

      // Ensure |m| ≤ l
      const m_clamped = Math.max(-l, Math.min(l, m));
      
      // Simplified spherical harmonics for low l values
      let Y_lm;
      const cos_theta = Math.cos(theta);
      const sin_theta = Math.sin(theta);
      
      if (l === 0) {
        Y_lm = 1 / Math.sqrt(4 * Math.PI);
      } else if (l === 1) {
        switch(m_clamped) {
          case -1: Y_lm = Math.sqrt(3/(8*Math.PI)) * sin_theta * Math.sin(phi); break;
          case 0:  Y_lm = Math.sqrt(3/(4*Math.PI)) * cos_theta; break;
          case 1:  Y_lm = -Math.sqrt(3/(8*Math.PI)) * sin_theta * Math.cos(phi); break;
          default: Y_lm = cos_theta;
        }
      } else if (l === 2) {
        switch(m_clamped) {
          case 0:  Y_lm = Math.sqrt(5/(16*Math.PI)) * (3*cos_theta*cos_theta - 1); break;
          case 1:  Y_lm = -Math.sqrt(15/(8*Math.PI)) * sin_theta * cos_theta * Math.cos(phi); break;
          case 2:  Y_lm = Math.sqrt(15/(32*Math.PI)) * sin_theta * sin_theta * Math.cos(2*phi); break;
          default: Y_lm = (3*cos_theta*cos_theta - 1);
        }
      } else {
        // Fallback for higher l values
        Y_lm = Math.pow(sin_theta, Math.abs(m_clamped)) * Math.cos(m_clamped * phi);
      }

      // Time evolution
      const time_factor = Math.cos(omega * t);
      
      // Spherical harmonic field
      const field_strength = A * Y_lm * time_factor;
      
      // Convert to Cartesian coordinates
      const r_field = radius + field_strength * 0.3;
      const x = r_field * sin_theta * Math.cos(phi);
      const y = r_field * sin_theta * Math.sin(phi);
      const z = r_field * cos_theta;

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 2, f: 1, g: 2.0, h: 2.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  // ACOUSTIC WAVE MODELS - UUON Foundation Wave Vector Catalog
  acoustic_pressure_001: {
    name: "🔊 ACOUSTIC-001: Acoustic Pressure Wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Pressure amplitude (Pa)
      const c = params.e ?? 343;          // Sound speed (m/s)
      const freq = params.f ?? 1000;      // Frequency (Hz)
      const k = params.g ?? 18.3;         // Wave number k = 2πf/c
      const density = params.h ?? 1.225;   // Air density (kg/m³)
      const t = params.i ?? 0;           // Time parameter

      // Map to 3D space
      const x = (u - 0.5) * 10;          // X coordinate [-5, 5]
      const y = (v - 0.5) * 10;          // Y coordinate [-5, 5]
      const z = 0;                       // Z-plane

      // Acoustic pressure wave: p(r,t) = A cos(kr - ωt)
      const r = Math.sqrt(x*x + y*y + z*z) + 0.1; // Distance from source
      const omega = 2 * Math.PI * freq;
      const pressure = A * Math.cos(k * r - omega * t);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 343, f: 1000, g: 18.3, h: 1.225, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // DISABLED: Produces NaN errors - needs geometric depth fix
  // particle_velocity_001: {
  //   name: "🔊 PARTICLE-VEL-001: Acoustic Particle Velocity",
  //   equation: (u: number, v: number, params: any) => {
  //     const A = params.d ?? 0.01;
  //     const c = params.e ?? 343;
  //     const freq = params.f ?? 1000;
  //     const k = params.g ?? 18.3;
  //     const rho = params.h ?? 1.225;
  //     const t = params.i ?? 0;
  //     const x = (u - 0.5) * 8;
  //     const y = (v - 0.5) * 8;
  //     const r = Math.sqrt(x*x + y*y) + 0.1;
  //     const omega = 2 * Math.PI * freq;
  //     const velocity = (A / (rho * c)) * Math.sin(k * r - omega * t);
  //     return [x, y, velocity * 10];
  //   },
  //   defaults: { a: 1, b: 1, c: 1, d: 0.01, e: 343, f: 1000, g: 18.3, h: 1.225, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  // },

  monopole_source_001: {
    name: "🔊 MONOPOLE-001: Acoustic Monopole Source",
    equation: (u: number, v: number, params: any) => {
      const Q = params.d ?? 1.0;          // Source strength (m³/s)
      const rho = params.e ?? 1.225;      // Density (kg/m³)
      const c = params.f ?? 343;          // Sound speed (m/s)
      const freq = params.g ?? 800;       // Frequency (Hz)
      const k = params.h ?? 14.6;         // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to 3D space
      const x = (u - 0.5) * 6;           // X coordinate [-3, 3]
      const y = (v - 0.5) * 6;           // Y coordinate [-3, 3]

      // Monopole pressure field: p = (ρcQ/4πr) e^(ikr - iωt)
      const r = Math.sqrt(x*x + y*y) + 0.1;
      const omega = 2 * Math.PI * freq;
      
      // Monopole radiation
      const amplitude = (rho * c * Q) / (4 * Math.PI * r);
      const pressure = amplitude * Math.cos(k * r - omega * t);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.225, f: 343, g: 800, h: 14.6, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  dipole_source_001: {
    name: "🔊 DIPOLE-001: Acoustic Dipole Source",
    equation: (u: number, v: number, params: any) => {
      const F = params.d ?? 1.0;          // Dipole strength (N)
      const rho = params.e ?? 1.225;      // Density (kg/m³)
      const c = params.f ?? 343;          // Sound speed (m/s)
      const freq = params.g ?? 800;       // Frequency (Hz)
      const k = params.h ?? 14.6;         // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to 3D space
      const x = (u - 0.5) * 6;           // X coordinate [-3, 3]
      const y = (v - 0.5) * 6;           // Y coordinate [-3, 3]

      // Dipole pressure field with directivity
      const r = Math.sqrt(x*x + y*y) + 0.1;
      const theta = Math.atan2(y, x);     // Angle for directivity
      const omega = 2 * Math.PI * freq;
      
      // Dipole directivity: cos(θ)
      const directivity = Math.cos(theta);
      const amplitude = (F * k) / (4 * Math.PI * rho * c * c * r);
      const pressure = amplitude * directivity * Math.cos(k * r - omega * t);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.225, f: 343, g: 800, h: 14.6, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  quadrupole_source_001: {
    name: "🔊 QUADRUPOLE-001: Acoustic Quadrupole Source",
    equation: (u: number, v: number, params: any) => {
      const T = params.d ?? 1.0;          // Quadrupole strength
      const rho = params.e ?? 1.225;      // Density (kg/m³)
      const c = params.f ?? 343;          // Sound speed (m/s)
      const freq = params.g ?? 1200;      // Frequency (Hz)
      const k = params.h ?? 21.9;         // Wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to 3D space
      const x = (u - 0.5) * 6;           // X coordinate [-3, 3]
      const y = (v - 0.5) * 6;           // Y coordinate [-3, 3]

      // Quadrupole pressure field
      const r = Math.sqrt(x*x + y*y) + 0.1;
      const theta = Math.atan2(y, x);
      const omega = 2 * Math.PI * freq;
      
      // Quadrupole directivity: cos(2θ)
      const directivity = Math.cos(2 * theta);
      const amplitude = (T * k * k) / (4 * Math.PI * rho * Math.pow(c, 3) * r);
      const pressure = amplitude * directivity * Math.cos(k * r - omega * t);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.225, f: 343, g: 1200, h: 21.9, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  waveguide_modes_001: {
    name: "🔊 WAVEGUIDE-001: Acoustic Waveguide Modes",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Mode amplitude
      const a = params.e ?? 1.0;          // Waveguide radius
      const m = Math.floor(params.f) || 1; // Azimuthal mode number
      const n = Math.floor(params.g) || 0; // Radial mode number
      const k_z = params.h ?? 10.0;       // Axial wave number
      const t = params.i ?? 0;           // Time parameter

      // Map to cylindrical coordinates
      const r = u * a;                    // Radial coordinate [0, a]
      const phi = v * 2 * Math.PI;        // Azimuthal angle [0, 2π]

      // Simplified waveguide mode
      const bessel_approx = (n === 0) ? 1 : Math.pow(r/a, n); // Simplified Bessel function
      const azimuthal = Math.cos(m * phi);
      const axial = Math.cos(k_z * r + 2 * Math.PI * t);
      
      const pressure = A * bessel_approx * azimuthal * axial;

      // Convert to Cartesian
      const x = r * Math.cos(phi);
      const y = r * Math.sin(phi);
      
      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1, g: 0, h: 10.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 40 }
  },

  room_acoustics_001: {
    name: "🔊 ROOM-ACOUSTICS-001: Room Acoustic Response",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Source amplitude
      const RT60 = params.e ?? 1.2;       // Reverberation time (s)
      const room_L = params.f ?? 8;       // Room length (m)
      const room_W = params.g ?? 6;       // Room width (m)
      const absorption = params.h ?? 0.2; // Absorption coefficient
      const t = params.i ?? 0;           // Time parameter

      // Map to room coordinates
      const x = u * room_L;               // X: [0, L]
      const y = v * room_W;               // Y: [0, W]

      // Room modes (simplified)
      const mode_x = Math.sin(Math.PI * x / room_L);
      const mode_y = Math.sin(Math.PI * y / room_W);
      
      // Exponential decay for reverberation
      const decay = Math.exp(-absorption * t * 6.91 / RT60); // -60dB decay
      
      // Multiple reflections approximation
      const reflections = 1 + 0.3 * Math.cos(2 * Math.PI * t * 3) * decay;
      
      const pressure = A * mode_x * mode_y * reflections * decay;

      return [x - room_L/2, y - room_W/2, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.2, f: 8, g: 6, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 48 }
  },

  // PLASMA WAVE MODELS - UUON Foundation Wave Vector Catalog
  langmuir_waves_001: {
    name: "⚡ LANGMUIR-001: Langmuir Plasma Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const wp = params.e ?? 8.98e9;      // Plasma frequency (rad/s)
      const k = params.f ?? 1000;         // Wave number (m⁻¹)
      const Te = params.g ?? 11600;       // Electron temperature (K)
      const lambda_D = params.h ?? 7.4e-5; // Debye length (m)
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates
      const x = (u - 0.5) * 0.01;        // X coordinate (meters)
      const y = (v - 0.5) * 0.01;        // Y coordinate (meters)

      // Langmuir frequency: ω = ωp√(1 + 3k²λD²)
      const omega_L = wp * Math.sqrt(1 + 3 * k*k * lambda_D*lambda_D);
      
      // Electric field oscillation
      const E_field = A * Math.sin(k * x - omega_L * t * 1e-9); // Scaled time

      return [x * 1000, y * 1000, E_field]; // Scale to mm for visualization
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 8.98e9, f: 1000, g: 11600, h: 7.4e-5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  ion_acoustic_waves_001: {
    name: "⚡ ION-ACOUSTIC-001: Ion Acoustic Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const cs = params.e ?? 9800;        // Ion sound speed (m/s)
      const k = params.f ?? 100;          // Wave number (m⁻¹)
      const Ti = params.g ?? 1160;        // Ion temperature (K)
      const Te = params.h ?? 11600;       // Electron temperature (K)
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates
      const x = (u - 0.5) * 0.1;         // X coordinate (m)
      const y = (v - 0.5) * 0.1;         // Y coordinate (m)

      // Ion acoustic frequency: ω = k*cs
      const omega_ia = k * cs;
      
      // Density perturbation
      const density_pert = A * Math.cos(k * x - omega_ia * t * 1e-6); // Scaled time

      return [x * 1000, y * 1000, density_pert]; // Scale to mm
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 9800, f: 100, g: 1160, h: 11600, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  alfven_waves_001: {
    name: "⚡ ALFVEN-001: Alfvén Magnetohydrodynamic Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const vA = params.e ?? 1e6;         // Alfvén velocity (m/s)
      const B0 = params.f ?? 1e-4;        // Magnetic field strength (T)
      const k = params.g ?? 10;           // Wave number (m⁻¹)
      const rho = params.h ?? 1e-12;      // Plasma density (kg/m³)
      const t = params.i ?? 0;           // Time parameter

      // Map to magnetoplasma coordinates
      const x = (u - 0.5) * 1;           // X coordinate (m)
      const y = (v - 0.5) * 1;           // Y coordinate (m)

      // Alfvén frequency: ω = k*vA
      const omega_A = k * vA;
      
      // Magnetic field perturbation (circular polarization)
      const B_perp_x = A * Math.cos(k * x - omega_A * t * 1e-6);
      const B_perp_y = A * Math.sin(k * x - omega_A * t * 1e-6);
      const B_magnitude = Math.sqrt(B_perp_x*B_perp_x + B_perp_y*B_perp_y);

      return [x, y, B_magnitude];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1e6, f: 1e-4, g: 10, h: 1e-12, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  magnetosonic_waves_001: {
    name: "⚡ MAGNETOSONIC-001: Magnetosonic Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const cs = params.e ?? 9800;        // Sound speed (m/s)
      const vA = params.f ?? 1e6;         // Alfvén velocity (m/s)
      const k = params.g ?? 50;           // Wave number (m⁻¹)
      const theta = params.h ?? 0.785;    // Propagation angle (rad)
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates
      const x = (u - 0.5) * 0.5;         // X coordinate (m)
      const y = (v - 0.5) * 0.5;         // Y coordinate (m)

      // Fast magnetosonic speed
      const vms_fast = Math.sqrt((cs*cs + vA*vA + Math.sqrt((cs*cs + vA*vA)*(cs*cs + vA*vA) - 4*cs*cs*vA*vA*Math.cos(theta)*Math.cos(theta))) / 2);
      
      // Magnetosonic frequency
      const omega_ms = k * vms_fast;
      
      // Pressure perturbation
      const pressure = A * Math.sin(k * (x * Math.cos(theta) + y * Math.sin(theta)) - omega_ms * t * 1e-6);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 9800, f: 1e6, g: 50, h: 0.785, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  whistler_waves_001: {
    name: "⚡ WHISTLER-001: Whistler Mode Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const wc = params.e ?? 1.76e11;     // Electron cyclotron frequency (rad/s)
      const wp = params.f ?? 8.98e9;      // Plasma frequency (rad/s)
      const k = params.g ?? 1000;         // Wave number (m⁻¹)
      const c = params.h ?? 3e8;          // Speed of light (m/s)
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates
      const x = (u - 0.5) * 0.01;        // X coordinate (m)
      const y = (v - 0.5) * 0.01;        // Y coordinate (m)

      // Whistler dispersion relation (simplified)
      const omega_w = (k * c * wp) / Math.sqrt(wc * (wc - wp));
      
      // Right-hand circularly polarized wave
      const E_x = A * Math.cos(k * x - omega_w * t * 1e-12);
      const E_y = A * Math.sin(k * x - omega_w * t * 1e-12);
      const E_magnitude = Math.sqrt(E_x*E_x + E_y*E_y);

      return [x * 1000, y * 1000, E_magnitude]; // Scale to mm
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.76e11, f: 8.98e9, g: 1000, h: 3e8, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  lower_hybrid_waves_001: {
    name: "⚡ LOWER-HYBRID-001: Lower Hybrid Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const wci = params.e ?? 1.91e8;     // Ion cyclotron frequency (rad/s)
      const wp = params.f ?? 8.98e9;      // Plasma frequency (rad/s)
      const k_perp = params.g ?? 2000;    // Perpendicular wave number (m⁻¹)
      const mi_me = params.h ?? 1836;     // Ion/electron mass ratio
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates  
      const x = (u - 0.5) * 0.005;       // X coordinate (m)
      const y = (v - 0.5) * 0.005;       // Y coordinate (m)

      // Lower hybrid frequency
      const wlh = wci * Math.sqrt(1 + wp*wp/(wci*wci*mi_me));
      
      // Electric field with finite k_perp effects
      const kperp_rho = k_perp * 0.001; // k_perp * ion gyroradius (simplified)
      const E_field = A * Math.exp(-kperp_rho*kperp_rho) * Math.sin(k_perp * y - wlh * t * 1e-8);

      return [x * 1000, y * 1000, E_field]; // Scale to mm
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.91e8, f: 8.98e9, g: 2000, h: 1836, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  electron_cyclotron_001: {
    name: "⚡ ELECTRON-CYCLOTRON-001: Electron Cyclotron Waves",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;          // Wave amplitude
      const wce = params.e ?? 1.76e11;    // Electron cyclotron frequency (rad/s)
      const wp = params.f ?? 8.98e9;      // Plasma frequency (rad/s)
      const k_perp = params.g ?? 5000;    // Perpendicular wave number (m⁻¹)
      const n = Math.floor(params.h) || 2; // Harmonic number
      const t = params.i ?? 0;           // Time parameter

      // Map to plasma coordinates
      const x = (u - 0.5) * 0.002;       // X coordinate (m)
      const y = (v - 0.5) * 0.002;       // Y coordinate (m)

      // Electron cyclotron harmonic frequency
      const omega_ech = n * wce * Math.sqrt(1 - wp*wp/(n*n*wce*wce));
      
      // Bernstein mode (electrostatic)
      const r = Math.sqrt(x*x + y*y);
      const theta = Math.atan2(y, x);
      const bessel_approx = Math.exp(-k_perp*k_perp * 0.001*0.001 / 2) * Math.cos(n * theta);
      
      const E_field = A * bessel_approx * Math.cos(omega_ech * t * 1e-12);

      return [x * 1000, y * 1000, E_field]; // Scale to mm
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.76e11, f: 8.98e9, g: 5000, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // COMPUTATIONAL FLUID DYNAMICS - Navier-Stokes Based Methods
  navier_stokes_001: {
    name: "🌊 NAVIER-STOKES-001: Navier-Stokes Equation",
    equation: (u: number, v: number, params: any) => {
      const U = params.d ?? 1.0;           // Characteristic velocity (m/s)
      const nu = params.e ?? 1e-6;         // Kinematic viscosity (m²/s)
      const Re = params.f ?? 1000;         // Reynolds number
      const L = params.g ?? 1.0;           // Characteristic length (m)
      const dp_dx = params.h ?? -1.0;      // Pressure gradient (Pa/m)
      const t = params.i ?? 0;            // Time parameter

      // Map to flow field coordinates
      const x = (u - 0.5) * L;            // X coordinate
      const y = (v - 0.5) * L;            // Y coordinate

      // Simplified 2D Navier-Stokes solution (Poiseuille flow with perturbations)
      // ∂u/∂t + (u·∇)u = -∇p/ρ + ν∇²u
      const y_normalized = y / (L/2);      // Normalize y to [-1, 1]
      const base_flow = U * (1 - y_normalized*y_normalized); // Parabolic profile

      // Add temporal and spatial perturbations
      const temporal = 1 + 0.1 * Math.sin(2 * Math.PI * t);
      const convective = 1 - 0.05 * (base_flow / U) * Math.cos(Math.PI * x / L);
      const viscous = Math.exp(-Math.abs(y_normalized) * Re / 1000);

      const velocity = base_flow * temporal * convective * viscous;

      return [x, y, velocity];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1e-6, f: 1000, g: 1.0, h: -1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 }
  },

  incompressible_001: {
    name: "🌊 INCOMPRESSIBLE-001: Incompressible Flow (∇·u = 0)",
    equation: (u: number, v: number, params: any) => {
      const U = params.d ?? 1.0;           // Velocity scale (m/s)
      const psi_max = params.e ?? 1.0;     // Stream function amplitude
      const m = Math.floor(params.f) || 1; // Mode number x
      const n = Math.floor(params.g) || 1; // Mode number y
      const omega = params.h ?? 1.0;       // Vorticity strength
      const t = params.i ?? 0;            // Time parameter

      // Map to flow domain
      const x = u * 2 * Math.PI;          // X: [0, 2π]
      const y = v * 2 * Math.PI;          // Y: [0, 2π]

      // Stream function ψ for incompressible flow
      // u = ∂ψ/∂y, v = -∂ψ/∂x ensures ∇·u = 0
      const psi = psi_max * Math.sin(m * x) * Math.sin(n * y) * Math.cos(omega * t);
      
      // Velocity components from stream function
      const u_vel = n * psi_max * Math.sin(m * x) * Math.cos(n * y) * Math.cos(omega * t);
      const v_vel = -m * psi_max * Math.cos(m * x) * Math.sin(n * y) * Math.cos(omega * t);
      
      const velocity_magnitude = Math.sqrt(u_vel*u_vel + v_vel*v_vel);

      return [x - Math.PI, y - Math.PI, velocity_magnitude];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 1, g: 1, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  simple_algorithm_001: {
    name: "🌊 SIMPLE-001: SIMPLE Pressure-Velocity Algorithm",
    equation: (u: number, v: number, params: any) => {
      const p_ref = params.d ?? 1.0;       // Reference pressure (Pa)
      const alpha_p = params.e ?? 0.3;     // Pressure under-relaxation
      const alpha_u = params.f ?? 0.7;     // Velocity under-relaxation
      const iter = params.g ?? 5;          // Iteration number
      const residual = params.h ?? 0.01;   // Convergence residual
      const t = params.i ?? 0;            // Time parameter

      // Map to computational grid
      const i = Math.floor(u * 20);        // Grid index i
      const j = Math.floor(v * 20);        // Grid index j
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;

      // SIMPLE iteration: P* = P^n + α_p * P'
      const p_guess = p_ref * (1 + 0.1 * Math.sin(Math.PI * i / 10) * Math.cos(Math.PI * j / 10));
      const p_correction = alpha_p * residual * Math.exp(-iter * 0.1);
      const pressure = p_guess + p_correction * Math.cos(2 * Math.PI * t);

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.3, f: 0.7, g: 5, h: 0.01, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40 }
  },

  piso_algorithm_001: {
    name: "🌊 PISO-001: PISO Unsteady Flow Algorithm",
    equation: (u: number, v: number, params: any) => {
      const dt = params.d ?? 0.01;         // Time step (s)
      const U = params.e ?? 1.0;           // Velocity scale (m/s)
      const corrector = params.f ?? 2;     // Number of corrector steps
      const CFL = params.g ?? 0.5;         // Courant number
      const pressure_iter = params.h ?? 3; // Pressure correction iterations
      const t = params.i ?? 0;            // Time parameter

      // Map to flow field
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;

      // PISO predictor-corrector sequence
      // Predictor: solve momentum without pressure
      const u_star = U * Math.sin(Math.PI * x / 2) * Math.cos(Math.PI * t / dt);
      
      // Corrector steps: multiple pressure corrections
      let pressure_correction = 0;
      for (let k = 1; k <= corrector; k++) {
        pressure_correction += (1/k) * Math.cos(k * Math.PI * y / 2) * Math.sin(k * 2 * Math.PI * t);
      }
      
      const velocity = u_star * (1 + 0.1 * pressure_correction);

      return [x, y, velocity];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.01, e: 1.0, f: 2, g: 0.5, h: 3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  mac_method_001: {
    name: "🌊 MAC-001: Marker-and-Cell Method",
    equation: (u: number, v: number, params: any) => {
      const dx = params.d ?? 0.1;          // Grid spacing x (m)
      const dy = params.e ?? 0.1;          // Grid spacing y (m)
      const dt = params.f ?? 0.01;         // Time step (s)
      const marker_density = params.g ?? 4; // Markers per cell
      const U = params.h ?? 1.0;           // Velocity scale
      const t = params.i ?? 0;            // Time parameter

      // Map to staggered MAC grid
      const x = u * 5;                     // Physical x coordinate
      const y = v * 5;                     // Physical y coordinate

      // Staggered grid: u at (i+1/2, j), v at (i, j+1/2), p at (i, j)
      const i = Math.floor(x / dx);
      const j = Math.floor(y / dy);
      
      // Marker particles tracking
      const marker_x = x + 0.1 * Math.sin(2 * Math.PI * t) * Math.cos(i);
      const marker_y = y + 0.1 * Math.cos(2 * Math.PI * t) * Math.sin(j);
      
      // Free surface tracking with markers
      const surface_height = 2.5 + 0.3 * Math.sin(Math.PI * marker_x / 5) * Math.cos(2 * Math.PI * t);
      const fluid_fraction = (marker_y < surface_height) ? 1.0 : 0.0;

      const velocity = U * fluid_fraction * Math.sin(Math.PI * marker_x / 5);

      return [x - 2.5, y - 2.5, velocity];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.1, e: 0.1, f: 0.01, g: 4, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 50, vSegments: 50 }
  },

  simpler_algorithm_001: {
    name: "🌊 SIMPLER-001: SIMPLER Algorithm",
    equation: (u: number, v: number, params: any) => {
      const p_ref = params.d ?? 1.0;       // Reference pressure
      const alpha_p = params.e ?? 1.0;     // Pressure relaxation (no under-relaxation)
      const alpha_u = params.f ?? 0.8;     // Velocity under-relaxation
      const guess_quality = params.g ?? 0.9; // Initial guess quality
      const convergence = params.h ?? 0.001; // Convergence tolerance
      const t = params.i ?? 0;            // Time parameter

      // Map to computational domain
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;

      // SIMPLER: better initial pressure guess from continuity
      const div_u = 0.1 * Math.sin(Math.PI * x) * Math.cos(Math.PI * y); // Divergence of velocity
      const p_guess = p_ref - div_u / 0.1;  // Pressure from continuity equation
      
      // Direct pressure calculation (no under-relaxation needed)
      const pressure = p_guess * guess_quality * (1 + convergence * Math.sin(2 * Math.PI * t));

      return [x, y, pressure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 0.8, g: 0.9, h: 0.001, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  simplec_algorithm_001: {
    name: "🌊 SIMPLEC-001: SIMPLEC Algorithm",
    equation: (u: number, v: number, params: any) => {
      const alpha_p = params.d ?? 0.3;     // Pressure under-relaxation
      const alpha_u = params.e ?? 0.7;     // Velocity under-relaxation
      const consistency = params.f ?? 0.9; // SIMPLEC consistency factor
      const ap_u = params.g ?? 100;        // Momentum equation coefficient
      const neighbor_sum = params.h ?? 80; // Sum of neighbor coefficients
      const t = params.i ?? 0;            // Time parameter

      // Map to flow field
      const x = (u - 0.5) * 2;
      const y = (v - 0.5) * 2;

      // SIMPLEC: improved velocity interpolation
      // ap_u_bar = ap_u - sum(an_u) for consistency
      const ap_u_bar = ap_u * consistency;
      const velocity_correction = alpha_u / (ap_u_bar + neighbor_sum * (1 - alpha_u));
      
      // Enhanced pressure-velocity coupling
      const base_velocity = Math.sin(Math.PI * x) * Math.cos(Math.PI * y);
      const velocity = base_velocity * (1 + velocity_correction * Math.sin(2 * Math.PI * t));

      return [x, y, velocity];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.3, e: 0.7, f: 0.9, g: 100, h: 80, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  fractional_step_001: {
    name: "🌊 FRACTIONAL-STEP-001: Fractional Step Method",
    equation: (u: number, v: number, params: any) => {
      const dt = params.d ?? 0.01;         // Time step (s)
      const nu = params.e ?? 1e-6;         // Kinematic viscosity
      const U = params.f ?? 1.0;           // Velocity scale
      const p_scale = params.g ?? 1.0;     // Pressure scale
      const step = Math.floor(params.h) || 1; // Step number (1=momentum, 2=projection)
      const t = params.i ?? 0;            // Time parameter

      // Map to domain
      const x = (u - 0.5) * 2 * Math.PI;
      const y = (v - 0.5) * 2 * Math.PI;

      if (step === 1) {
        // Step 1: Solve momentum equation without pressure
        const u_star = U * Math.sin(x) * Math.cos(y) * Math.exp(-nu * t / dt);
        return [x / Math.PI - 1, y / Math.PI - 1, u_star];
      } else {
        // Step 2: Projection step - solve for pressure
        const phi = p_scale * Math.sin(2*x) * Math.sin(2*y) * (1 - Math.exp(-t / dt));
        return [x / Math.PI - 1, y / Math.PI - 1, phi];
      }
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.01, e: 1e-6, f: 1.0, g: 1.0, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  projection_method_001: {
    name: "🌊 PROJECTION-001: Projection Method",
    equation: (u: number, v: number, params: any) => {
      const dt = params.d ?? 0.01;         // Time step
      const rho = params.e ?? 1.0;         // Density
      const U = params.f ?? 1.0;           // Velocity scale
      const L = params.g ?? 1.0;           // Length scale
      const poisson_iter = params.h ?? 10; // Poisson iterations
      const t = params.i ?? 0;            // Time parameter

      // Map to computational domain
      const x = (u - 0.5) * L;
      const y = (v - 0.5) * L;

      // Projection operator: P = I - dt∇(∇⁻²∇·)
      // Helmholtz decomposition: u = u_div_free + ∇φ
      const div_u = 0.1 * Math.sin(2*Math.PI*x/L) * Math.cos(2*Math.PI*y/L);
      
      // Solve Poisson equation for pressure correction
      const phi_correction = -(div_u * dt / rho) / (4 * Math.PI * Math.PI / (L * L));
      
      // Project to divergence-free space
      const u_projected = U * (Math.cos(Math.PI*x/L) - phi_correction * 2*Math.PI/L);
      const final_velocity = u_projected * Math.cos(2 * Math.PI * t);

      return [x, y, final_velocity];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.01, e: 1.0, f: 1.0, g: 1.0, h: 10, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  artificial_compressibility_001: {
    name: "🌊 ART-COMPRESS-001: Artificial Compressibility",
    equation: (u: number, v: number, params: any) => {
      const beta = params.d ?? 1.0;        // Artificial compressibility parameter
      const U = params.e ?? 1.0;           // Velocity scale
      const dt = params.f ?? 0.01;         // Pseudo time step
      const c_artificial = params.g ?? 10; // Artificial sound speed
      const relaxation = params.h ?? 0.8;  // Relaxation factor
      const t = params.i ?? 0;            // Time parameter

      // Map to flow domain
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;

      // Artificial compressibility: ∂p/∂τ + β∇·u = 0
      // where τ is pseudo time and β is artificial compressibility
      const div_u = U * Math.PI * (Math.cos(Math.PI*x/3) - Math.sin(Math.PI*y/3));
      
      // Pseudo time evolution
      const tau = t * dt * c_artificial / 3; // Pseudo time
      const pressure = -beta * div_u * (1 - Math.exp(-tau)) * relaxation;
      
      const pressure_evolution = pressure * Math.cos(Math.PI * t);

      return [x, y, pressure_evolution];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 0.01, g: 10, h: 0.8, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  // LATTICE BOLTZMANN METHODS - CFD Mesoscopic Simulation
  lbm_basic_001: {
    name: "🔷 LBM-001: Lattice Boltzmann Method Basic",
    equation: (u: number, v: number, params: any) => {
      const tau = params.d ?? 0.6;         // Relaxation time
      const dt = params.e ?? 1.0;          // Time step
      const dx = params.f ?? 1.0;          // Lattice spacing
      const rho_0 = params.g ?? 1.0;       // Reference density
      const u_max = params.h ?? 0.1;       // Maximum velocity
      const t = params.i ?? 0;            // Time parameter

      // Map to lattice coordinates
      const x = Math.floor(u * 20);        // Lattice x [0, 19]
      const y = Math.floor(v * 20);        // Lattice y [0, 19]

      // LBM evolution: f_i(x+e_i*dt, t+dt) = f_i(x,t) + Ω_i
      // Simplified collision term: Ω_i = -(f_i - f_i^eq)/tau
      const omega = 1.0 / tau;             // Collision frequency

      // Velocity field (Poiseuille flow)
      const u_vel = u_max * 4 * (v - 0.5) * (1 - (v - 0.5)) * Math.cos(2 * Math.PI * t);
      const v_vel = 0;

      // Equilibrium distribution (BGK approximation)
      const rho = rho_0 * (1 + 0.1 * Math.sin(Math.PI * x / 20) * Math.cos(Math.PI * y / 20));
      const f_eq = rho * (1 + 3 * u_vel + 1.5 * u_vel * u_vel);

      return [x - 10, y - 10, f_eq];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.6, e: 1.0, f: 1.0, g: 1.0, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 40, vSegments: 40 }
  },

  d2q9_lattice_001: {
    name: "🔷 D2Q9-001: D2Q9 Lattice Configuration",
    equation: (u: number, v: number, params: any) => {
      const w0 = params.d ?? 4/9;          // Weight for rest particle
      const w1 = params.e ?? 1/9;          // Weight for cardinal directions
      const w2 = params.f ?? 1/36;         // Weight for diagonal directions
      const cs = params.g ?? 1/Math.sqrt(3); // Speed of sound
      const Ma = params.h ?? 0.1;          // Mach number
      const t = params.i ?? 0;            // Time parameter

      // Map to D2Q9 velocity directions
      const directions = [
        [0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], // Rest + 4 cardinal
        [1, 1], [-1, 1], [-1, -1], [1, -1]        // 4 diagonal
      ];
      
      const i = Math.floor(u * 3);         // 3x3 grid
      const j = Math.floor(v * 3);         // 3x3 grid
      const idx = i * 3 + j;               // Linear index

      if (idx < 9) {
        const [ex, ey] = directions[idx];
        const weight = (idx === 0) ? w0 : (Math.abs(ex) + Math.abs(ey) === 1) ? w1 : w2;
        
        // Macroscopic velocity
        const ux = Ma * cs * Math.sin(Math.PI * u) * Math.cos(2 * Math.PI * t);
        const uy = Ma * cs * Math.cos(Math.PI * v) * Math.sin(2 * Math.PI * t);
        
        // D2Q9 equilibrium distribution
        const eu = ex * ux + ey * uy;
        const f_eq = weight * (1 + 3*eu + 4.5*eu*eu - 1.5*(ux*ux + uy*uy));
        
        return [ex * 2, ey * 2, f_eq * 10]; // Scale for visualization
      }
      
      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4/9, e: 1/9, f: 1/36, g: 0.577, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 9, vSegments: 9 }
  },

  d3q19_lattice_001: {
    name: "🔷 D3Q19-001: D3Q19 Lattice Configuration",
    equation: (u: number, v: number, params: any) => {
      const w0 = params.d ?? 1/3;          // Weight for rest particle
      const w1 = params.e ?? 1/18;         // Weight for face-centered
      const w2 = params.f ?? 1/36;         // Weight for edge-centered
      const rho = params.g ?? 1.0;         // Density
      const vel_scale = params.h ?? 0.1;   // Velocity scale
      const t = params.i ?? 0;            // Time parameter

      // Map to 3D lattice (project to 2D for visualization)
      const i = Math.floor(u * 4) - 1;     // Lattice x [-1, 2]
      const j = Math.floor(v * 4) - 1;     // Lattice y [-1, 2]
      const k = Math.floor(t * 4) - 1;     // Lattice z [-1, 2] (from time)

      // D3Q19 velocity vectors (19 directions in 3D)
      const valid_directions = [
        [0,0,0], [1,0,0], [-1,0,0], [0,1,0], [0,-1,0], [0,0,1], [0,0,-1], // 7: rest + faces
        [1,1,0], [-1,-1,0], [1,-1,0], [-1,1,0],                            // 4: xy edges
        [1,0,1], [-1,0,-1], [1,0,-1], [-1,0,1],                            // 4: xz edges  
        [0,1,1], [0,-1,-1], [0,1,-1], [0,-1,1]                             // 4: yz edges
      ];

      // Check if current position corresponds to valid D3Q19 direction
      for (let idx = 0; idx < valid_directions.length; idx++) {
        const [ex, ey, ez] = valid_directions[idx];
        if (i === ex && j === ey) {
          let weight;
          if (idx === 0) weight = w0;                    // Rest
          else if (idx <= 6) weight = w1;                // Face-centered
          else weight = w2;                              // Edge-centered
          
          // 3D velocity field
          const ux = vel_scale * Math.sin(Math.PI * u) * Math.cos(2 * Math.PI * t);
          const uy = vel_scale * Math.cos(Math.PI * v) * Math.sin(2 * Math.PI * t);
          const uz = vel_scale * Math.sin(Math.PI * t);
          
          const eu = ex*ux + ey*uy + ez*uz;
          const u_sq = ux*ux + uy*uy + uz*uz;
          const f_eq = rho * weight * (1 + 3*eu + 4.5*eu*eu - 1.5*u_sq);
          
          return [i * 2, j * 2, f_eq * 5];
        }
      }
      
      return [0, 0, 0];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1/3, e: 1/18, f: 1/36, g: 1.0, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 8, vSegments: 8 }
  },

  bgk_collision_001: {
    name: "🔷 BGK-001: BGK Collision Operator",
    equation: (u: number, v: number, params: any) => {
      const tau = params.d ?? 0.7;         // BGK relaxation time
      const nu = params.e ?? (tau - 0.5)/3; // Kinematic viscosity
      const rho_0 = params.f ?? 1.0;       // Reference density  
      const u_0 = params.g ?? 0.1;         // Reference velocity
      const omega = params.h ?? 1/tau;     // Collision frequency
      const t = params.i ?? 0;            // Time parameter

      // Map to flow field
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;

      // BGK collision: Ω_i = -ω(f_i - f_i^eq)
      // Macroscopic quantities
      const rho = rho_0 * (1 + 0.05 * Math.sin(Math.PI * x / 2) * Math.cos(Math.PI * y / 2));
      const ux = u_0 * Math.sin(Math.PI * y / 2) * Math.cos(2 * Math.PI * t);
      const uy = 0;

      // Current distribution function (simplified)
      const f_current = rho * 0.25 * (1 + 3 * ux);
      
      // Equilibrium distribution
      const f_eq = rho * 0.25 * (1 + 3 * ux + 4.5 * ux * ux - 1.5 * (ux * ux + uy * uy));
      
      // BGK collision term
      const collision = -omega * (f_current - f_eq);
      
      // Post-collision distribution
      const f_new = f_current + collision;

      return [x, y, f_new];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.7, e: 0.067, f: 1.0, g: 0.1, h: 1.43, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  mrt_collision_001: {
    name: "🔷 MRT-001: Multiple Relaxation Time Collision",
    equation: (u: number, v: number, params: any) => {
      const s_rho = params.d ?? 1.0;       // Relaxation rate for density
      const s_e = params.e ?? 1.2;         // Relaxation rate for energy
      const s_eps = params.f ?? 1.2;       // Relaxation rate for energy square
      const s_nu = params.g ?? 1.0;        // Relaxation rate for viscosity
      const s_pi = params.h ?? 1.4;        // Relaxation rate for stress
      const t = params.i ?? 0;            // Time parameter

      // Map to computational domain
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;

      // MRT collision in moment space: |m⟩' = |m⟩ - S(|m⟩ - |m^eq⟩)
      // Moment space variables
      const rho = 1.0 + 0.1 * Math.sin(Math.PI * x) * Math.cos(Math.PI * y);
      const jx = 0.1 * rho * Math.cos(Math.PI * y) * Math.sin(2 * Math.PI * t);
      const jy = 0.05 * rho * Math.sin(Math.PI * x) * Math.cos(2 * Math.PI * t);
      
      // Higher-order moments
      const e = -2 * rho + 3 * (jx*jx + jy*jy) / rho;    // Energy mode
      const eps = rho - 3 * (jx*jx + jy*jy) / rho;        // Energy square mode
      const qx = -jx;                                      // Heat flux x
      const qy = -jy;                                      // Heat flux y
      const pxx = (jx*jx - jy*jy) / rho;                  // Stress component
      const pxy = (jx*jy) / rho;                          // Shear stress

      // MRT collision with different relaxation rates
      const e_collision = s_e * e * Math.cos(2 * Math.PI * t);
      const eps_collision = s_eps * eps;
      const stress_collision = s_pi * (pxx + pxy) * 0.5;
      
      // Total collision effect
      const mrt_collision = e_collision + eps_collision + stress_collision;

      return [x, y, mrt_collision];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.2, f: 1.2, g: 1.0, h: 1.4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  d3q27_lattice_001: {
    name: "🔷 D3Q27-001: D3Q27 Lattice Configuration",
    equation: (u: number, v: number, params: any) => {
      const w0 = params.d ?? 8/27;         // Weight for rest particle
      const w1 = params.e ?? 2/27;         // Weight for face neighbors  
      const w2 = params.f ?? 1/54;         // Weight for edge neighbors
      const w3 = params.g ?? 1/216;        // Weight for corner neighbors
      const vel_amplitude = params.h ?? 0.1; // Velocity amplitude
      const t = params.i ?? 0;            // Time parameter

      // Map to 3x3x3 lattice (project to 2D)
      const i = Math.floor(u * 3);         // Lattice i [0, 2]
      const j = Math.floor(v * 3);         // Lattice j [0, 2]
      const k = Math.floor(t * 3) % 3;     // Lattice k [0, 2] from time

      // D3Q27: 27 velocity directions in 3D
      const ex = i - 1;                    // Velocity x-component [-1, 1]
      const ey = j - 1;                    // Velocity y-component [-1, 1]
      const ez = k - 1;                    // Velocity z-component [-1, 1]

      // Weight selection based on lattice distance
      let weight;
      const distance = Math.abs(ex) + Math.abs(ey) + Math.abs(ez);
      if (distance === 0) weight = w0;      // Rest particle
      else if (distance === 1) weight = w1; // Face neighbors
      else if (distance === 2) weight = w2; // Edge neighbors
      else weight = w3;                     // Corner neighbors

      // 3D velocity field
      const ux = vel_amplitude * Math.sin(Math.PI * u) * Math.cos(2 * Math.PI * t);
      const uy = vel_amplitude * Math.cos(Math.PI * v) * Math.sin(2 * Math.PI * t);  
      const uz = vel_amplitude * Math.sin(Math.PI * (u + v)) * Math.cos(Math.PI * t);

      // D3Q27 equilibrium distribution
      const eu = ex*ux + ey*uy + ez*uz;
      const u_sq = ux*ux + uy*uy + uz*uz;
      const f_eq = weight * (1 + 3*eu + 4.5*eu*eu - 1.5*u_sq);

      return [ex * 2, ey * 2, f_eq * 10];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8/27, e: 2/27, f: 1/54, g: 1/216, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 9, vSegments: 9 }
  },

  cascaded_collision_001: {
    name: "🔷 CASCADED-001: Cascaded Collision Operator",
    equation: (u: number, v: number, params: any) => {
      const tau_s = params.d ?? 0.6;       // Shear relaxation time
      const tau_b = params.e ?? 0.8;       // Bulk relaxation time
      const Ma = params.f ?? 0.1;          // Mach number
      const Re = params.g ?? 100;          // Reynolds number
      const cascade_order = Math.floor(params.h) || 3; // Cascade order
      const t = params.i ?? 0;            // Time parameter

      // Map to flow domain
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;

      // Cascaded collision: progressive relaxation of moment space
      const rho = 1.0 + 0.05 * Math.sin(Math.PI * x / 2) * Math.cos(Math.PI * y / 2);
      const ux = Ma * Math.sin(Math.PI * y / 2) * Math.cos(2 * Math.PI * t);
      const uy = Ma * Math.cos(Math.PI * x / 2) * Math.sin(2 * Math.PI * t);

      // Central moments in moving frame
      let collision_effect = 0;
      for (let order = 1; order <= cascade_order; order++) {
        const tau_order = tau_s + (tau_b - tau_s) * (order - 1) / (cascade_order - 1);
        const moment = Math.pow(ux*ux + uy*uy, order/2) / Math.pow(Re, order/2);
        const relaxation = (1 - 1/tau_order) * moment;
        collision_effect += relaxation * Math.cos(order * Math.PI * t);
      }

      // Cascaded collision result
      const f_cascaded = rho * (1 + 3*(ux + uy)) * (1 - collision_effect);

      return [x, y, f_cascaded];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.6, e: 0.8, f: 0.1, g: 100, h: 3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  entropic_collision_001: {
    name: "🔷 ENTROPIC-001: Entropic Collision Operator", 
    equation: (u: number, v: number, params: any) => {
      const alpha = params.d ?? 2.0;       // Entropic stabilization parameter
      const beta = params.e ?? 1.0;        // Entropy weight
      const tau = params.f ?? 0.7;         // Relaxation time
      const H_target = params.g ?? -1.8;   // Target entropy
      const stability = params.h ?? 0.1;   // Stability parameter
      const t = params.i ?? 0;            // Time parameter

      // Map to computational domain
      const x = (u - 0.5) * 3;
      const y = (v - 0.5) * 3;

      // Entropic LBM: maximize entropy while preserving mass/momentum
      const rho = 1.0 + 0.1 * Math.sin(Math.PI * x) * Math.cos(Math.PI * y);
      const ux = 0.1 * Math.cos(Math.PI * y) * Math.sin(2 * Math.PI * t);
      const uy = 0.1 * Math.sin(Math.PI * x) * Math.cos(2 * Math.PI * t);

      // Current distribution (simplified)
      const f = rho * 0.25 * (1 + 3*ux + 3*uy);
      
      // Equilibrium distribution
      const f_eq = rho * 0.25 * (1 + 3*ux + 3*uy + 4.5*(ux*ux + uy*uy) - 1.5*(ux*ux + uy*uy));
      
      // Entropy calculation: H = -∑ f_i ln(f_i)
      const entropy = -f * Math.log(Math.max(f, 1e-10));
      
      // Entropic collision with entropy constraint
      const entropy_factor = Math.exp(alpha * (entropy - H_target));
      const omega_entropic = (1/tau) * entropy_factor / (1 + beta * entropy_factor);
      
      // Entropic collision step
      const f_entropic = f + omega_entropic * (f_eq - f) * (1 + stability * Math.sin(4 * Math.PI * t));

      return [x, y, f_entropic];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2.0, e: 1.0, f: 0.7, g: -1.8, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 60, vSegments: 60 }
  },

  twophase_lbm_001: {
    name: "🔷 TWOPHASE-LBM-001: Two-Phase Lattice Boltzmann",
    equation: (u: number, v: number, params: any) => {
      const sigma = params.d ?? 0.1;       // Surface tension
      const rho_l = params.e ?? 1.0;       // Liquid density
      const rho_g = params.f ?? 0.1;       // Gas density
      const G = params.g ?? -2.0;          // Interaction strength
      const interface_width = params.h ?? 0.3; // Interface width
      const t = params.i ?? 0;            // Time parameter

      // Map to domain with two phases
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;

      // Phase field (order parameter)
      const r = Math.sqrt(x*x + y*y);
      const phi = Math.tanh((2 - r + 0.3 * Math.sin(4 * Math.PI * t)) / interface_width);
      
      // Density from phase field
      const rho = 0.5 * ((rho_l + rho_g) + (rho_l - rho_g) * phi);
      
      // Surface tension force (proportional to gradient of phi)
      const grad_phi_x = -(r - 2) * x / (r * interface_width) * (1 - phi*phi);
      const grad_phi_y = -(r - 2) * y / (r * interface_width) * (1 - phi*phi);
      const surface_force = sigma * Math.sqrt(grad_phi_x*grad_phi_x + grad_phi_y*grad_phi_y);
      
      // Velocity field with surface tension effects
      const ux = 0.1 * grad_phi_x / rho * Math.cos(2 * Math.PI * t);
      const uy = 0.1 * grad_phi_y / rho * Math.sin(2 * Math.PI * t);
      
      // Two-phase distribution function
      const f_twophase = rho * (1 + 3*(ux + uy) + G * phi*phi) + surface_force;

      return [x, y, f_twophase];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.1, e: 1.0, f: 0.1, g: -2.0, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  thermal_lbm_001: {
    name: "🔷 THERMAL-LBM-001: Thermal Lattice Boltzmann", 
    equation: (u: number, v: number, params: any) => {
      const Pr = params.d ?? 0.7;          // Prandtl number
      const Ra = params.e ?? 1000;         // Rayleigh number
      const T_hot = params.f ?? 1.0;       // Hot temperature
      const T_cold = params.g ?? 0.0;      // Cold temperature
      const alpha = params.h ?? 0.1;       // Thermal diffusivity
      const t = params.i ?? 0;            // Time parameter

      // Map to thermal domain
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;

      // Temperature field (Rayleigh-Bénard convection)
      const T_base = T_cold + (T_hot - T_cold) * (0.5 - y/4);
      const T_perturbation = 0.1 * Math.sin(Math.PI * x / 2) * Math.exp(-y*y/2) * Math.sin(2 * Math.PI * t);
      const T = T_base + T_perturbation;
      
      // Buoyancy-driven velocity (natural convection)
      const g_beta_dT = (Ra * alpha * alpha) / (Pr * 16) * (T - (T_hot + T_cold)/2);
      const ux = 0.1 * Math.sin(Math.PI * y / 2) * Math.cos(2 * Math.PI * t);
      const uy = g_beta_dT * Math.sin(Math.PI * x / 2);
      
      // Thermal distribution function (temperature-based)
      const rho = 1.0;  // Constant density (Boussinesq approximation)
      const f_thermal = T * rho * (1 + 3*(ux + uy)) * Math.exp(-alpha * t);
      
      // Heat conduction effects
      const heat_diffusion = alpha * (T_hot - T_cold) * Math.exp(-((x*x + y*y)/(2*alpha*alpha)));
      
      const total_thermal = f_thermal + heat_diffusion;

      return [x, y, total_thermal];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.7, e: 1000, f: 1.0, g: 0.0, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // FFT OCEAN WAVE SIMULATION - Advanced Ocean Surface Modeling
  fft_ocean_basic_001: {
    name: "🌊 FFT-OCEAN-001: FFT Ocean Surface η(x,t) = Σ h̃(k,t) e^(ik·x)",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 0.02;          // Wave amplitude
      const L = params.e ?? 50;            // Wind length scale (m)
      const wind_speed = params.f ?? 10;   // Wind speed (m/s)
      const g = params.g ?? 9.81;          // Gravity (m/s²)
      const resolution = params.h ?? 8;    // Frequency resolution
      const t = params.i ?? 0;            // Time parameter

      // Map to ocean surface coordinates
      const x = (u - 0.5) * L;            // X coordinate
      const y = (v - 0.5) * L;            // Y coordinate

      // FFT Ocean: η(x,t) = Σ h̃(k,t) e^(ik·x)
      let eta = 0;                         // Surface elevation
      
      // Discrete fourier modes
      for (let kx_i = -resolution; kx_i <= resolution; kx_i++) {
        for (let ky_i = -resolution; ky_i <= resolution; ky_i++) {
          if (kx_i === 0 && ky_i === 0) continue;
          
          // Wave vector k
          const kx = 2 * Math.PI * kx_i / L;
          const ky = 2 * Math.PI * ky_i / L;
          const k_mag = Math.sqrt(kx*kx + ky*ky);
          
          // Dispersion relation: ω = √(gk)
          const omega = Math.sqrt(g * k_mag);
          
          // Phillips spectrum approximation
          const phillips = A * Math.exp(-1 / (k_mag*L*wind_speed/g)**2) / (k_mag**4);
          
          // Complex amplitude
          const phase = kx*x + ky*y - omega*t;
          const h_tilde = Math.sqrt(phillips) * Math.cos(phase);
          
          eta += h_tilde;
        }
      }

      return [x, y, eta];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.02, e: 50, f: 10, g: 9.81, h: 8, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  fft_evolution_001: {
    name: "🌊 FFT-EVOLUTION-001: Wave Evolution h̃(k,t) = h̃₀(k) e^(iωt) + h̃₀*(-k) e^(-iωt)",
    equation: (u: number, v: number, params: any) => {
      const h0_amplitude = params.d ?? 0.1;  // Initial amplitude
      const phase_speed = params.e ?? 5;     // Phase speed
      const group_speed = params.f ?? 2.5;   // Group speed
      const damping = params.g ?? 0.01;      // Wave damping
      const nonlinearity = params.h ?? 0.1;  // Nonlinear factor
      const t = params.i ?? 0;              // Time parameter

      // Map to wavenumber domain
      const kx = (u - 0.5) * 10;            // Wavenumber x
      const ky = (v - 0.5) * 10;            // Wavenumber y
      const k = Math.sqrt(kx*kx + ky*ky) + 0.1;

      // Dispersion relation
      const omega = Math.sqrt(9.81 * k);     // Deep water: ω = √(gk)
      
      // Initial spectrum h̃₀(k)
      const h0_k = h0_amplitude * Math.exp(-k*k / 4) * Math.cos(Math.PI * k / 5);
      
      // Time evolution: h̃(k,t) = h̃₀(k) e^(iωt) + h̃₀*(-k) e^(-iωt)
      const h0_minus_k = h0_amplitude * Math.exp(-k*k / 4) * Math.cos(-Math.PI * k / 5); // h̃₀(-k)*
      
      // Complex evolution
      const forward_wave = h0_k * Math.cos(omega * t) * Math.exp(-damping * t);
      const backward_wave = h0_minus_k * Math.cos(-omega * t) * Math.exp(-damping * t);
      
      // Nonlinear corrections
      const nonlinear_term = nonlinearity * forward_wave * backward_wave * Math.sin(2 * omega * t);
      
      const h_tilde = forward_wave + backward_wave + nonlinear_term;

      return [kx, ky, h_tilde * 10]; // Scale for visualization
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.1, e: 5, f: 2.5, g: 0.01, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  phillips_spectrum_001: {
    name: "🌊 PHILLIPS-001: Phillips Spectrum P(k) = A/|k|⁴ exp(-1/(kL)²)",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 0.008;          // Phillips constant
      const wind_speed = params.e ?? 15;    // Wind speed (m/s)
      const g = params.f ?? 9.81;           // Gravity (m/s²)
      const wind_dir = params.g ?? 0;       // Wind direction (radians)
      const suppression = params.h ?? 0.001; // Small wave suppression
      const t = params.i ?? 0;             // Time parameter

      // Map to wavenumber space
      const kx = (u - 0.5) * 20;           // Wavenumber x
      const ky = (v - 0.5) * 20;           // Wavenumber y
      const k = Math.sqrt(kx*kx + ky*ky) + 1e-6;

      // Wind length scale L = U²/g
      const L = wind_speed * wind_speed / g;
      
      // Wave direction relative to wind
      const wave_dir = Math.atan2(ky, kx);
      const theta = wave_dir - wind_dir;
      
      // Phillips spectrum: P(k) = A/|k|⁴ exp(-1/(kL)²)
      const k4_term = 1 / (k*k*k*k);
      const exponential = Math.exp(-1 / ((k*L) * (k*L)));
      
      // Directional factor (waves align with wind)
      const directional = Math.max(0, Math.cos(theta))**2;
      
      // Small wave suppression
      const cutoff = Math.exp(-k*k * suppression);
      
      // Time modulation for visualization
      const temporal = 1 + 0.1 * Math.sin(2 * Math.PI * t) * Math.exp(-k / 10);
      
      const phillips_spectrum = A * k4_term * exponential * directional * cutoff * temporal;

      return [kx, ky, phillips_spectrum * 1000]; // Scale for visibility
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.008, e: 15, f: 9.81, g: 0, h: 0.001, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 80 }
  },

  // DISABLED: Produces NaN errors - needs geometric depth fix
  // jonswap_spectrum_001: {
  //   name: "🌊 JONSWAP-001: JONSWAP Spectrum Enhancement",
  //   equation: (u: number, v: number, params: any) => {
  //     return [0, 0, 0];  // Disabled
  //   },
  //   defaults: { a: 1, b: 1, c: 1, d: 2, e: 8, f: 3.3, g: 0.07, h: 0.09, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  // },

  pierson_moskowitz_001: {
    name: "🌊 PIERSON-001: Pierson-Moskowitz Fully Developed Seas",
    equation: (u: number, v: number, params: any) => {
      const U19 = params.d ?? 20;           // Wind speed at 19.5m (m/s)
      const alpha = params.e ?? 0.0081;     // Empirical constant
      const beta = params.f ?? 0.74;        // Peak frequency parameter
      const g = params.g ?? 9.81;           // Gravity (m/s²)
      const fetch = params.h ?? 1000;       // Fetch length (km)
      const t = params.i ?? 0;             // Time parameter

      // Map to frequency space
      const f = (u * 2 + 0.1);             // Frequency (Hz)
      const x = (v - 0.5) * fetch * 1000;  // Distance along fetch (m)

      // Fully developed sea conditions
      const fp = beta * g / (2 * Math.PI * U19); // Peak frequency
      
      // Pierson-Moskowitz spectrum: S(f) = α g²/(2π)⁴ f⁻⁵ exp(-β(fp/f)⁴)
      const frequency_term = Math.pow(2*Math.PI*f, -5);
      const exponential = Math.exp(-beta * Math.pow(fp/f, 4));
      const S_PM = alpha * g*g * frequency_term * exponential;
      
      // Fetch-limited growth (for non-fully developed seas)
      const dimensionless_fetch = g * fetch * 1000 / (U19 * U19);
      const fetch_factor = Math.min(1, Math.pow(dimensionless_fetch / 2.2e4, 0.33));
      
      // Wave age parameter
      const wave_age = 1.2 * U19 / (g / (2*Math.PI*fp));
      const age_factor = Math.min(1, wave_age / 1.2);
      
      // Spatial evolution along fetch
      const spatial_growth = 1 - Math.exp(-x / (fetch * 500));
      
      // Time-varying fully developed spectrum
      const temporal_variation = 1 + 0.15 * Math.sin(2*Math.PI*f*t/10) * Math.exp(-f/fp);
      
      const pierson_moskowitz = S_PM * fetch_factor * age_factor * spatial_growth * temporal_variation;

      return [f * 5 - 2.5, x / 1000, pierson_moskowitz * 10000];
    },
    defaults: { a: 1, b: 1, c: 1, d: 20, e: 0.0081, f: 0.74, g: 9.81, h: 1000, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  tma_shallow_001: {
    name: "🌊 TMA-001: TMA Shallow Water Spectrum",
    equation: (u: number, v: number, params: any) => {
      const Hs = params.d ?? 1.5;           // Significant wave height (m)
      const Tp = params.e ?? 6;             // Peak period (s)
      const depth = params.f ?? 10;         // Water depth (m)
      const gamma = params.g ?? 3.3;        // JONSWAP peak enhancement
      const g = params.h ?? 9.81;           // Gravity (m/s²)
      const t = params.i ?? 0;             // Time parameter

      // Map to frequency space
      const f = (u * 1.5 + 0.05);          // Frequency (Hz)
      const kh_space = (v - 0.5) * 10;     // kh parameter space

      // Wavenumber from dispersion relation: ω² = gk tanh(kh)
      const omega = 2 * Math.PI * f;
      const k = omega*omega / (g * Math.tanh(omega*omega * depth / g)); // Approximate
      const kh = k * depth;
      
      // Base JONSWAP spectrum
      const fp = 1 / Tp;
      const alpha = 0.0081;
      const S_JONSWAP = alpha * g*g / Math.pow(2*Math.PI*f, 5) * Math.exp(-1.25 * Math.pow(fp/f, 4));
      
      // JONSWAP enhancement
      const sigma = (f <= fp) ? 0.07 : 0.09;
      const enhancement = Math.pow(gamma, Math.exp(-0.5 * Math.pow((f-fp)/(sigma*fp), 2)));
      const S_enhanced = S_JONSWAP * enhancement;
      
      // TMA shallow water transformation: Φ(ω,h) = 2kh/sinh(2kh)
      let phi_TMA;
      if (kh < 0.1) {
        phi_TMA = 1;                        // Deep water limit
      } else if (kh > 3) {
        phi_TMA = 2*kh / Math.sinh(2*kh);   // Shallow water formula
      } else {
        // Intermediate depth
        phi_TMA = 2*kh / Math.sinh(2*kh);
      }
      
      // TMA spectrum
      const S_TMA = S_enhanced * phi_TMA;
      
      // Depth-dependent modulation
      const depth_effect = 1 + 0.3 * Math.sin(kh) * Math.exp(-kh/5);
      
      // Temporal shallow water effects
      const shallow_oscillation = 1 + 0.2 * Math.cos(2*Math.PI*f*t) * Math.exp(-depth/20);
      
      const tma_spectrum = S_TMA * depth_effect * shallow_oscillation;

      return [f * 10 - 5, kh, tma_spectrum * 1000];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 6, f: 10, g: 3.3, h: 9.81, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  bretschneider_001: {
    name: "🌊 BRETSCHNEIDER-001: Bretschneider Spectrum",
    equation: (u: number, v: number, params: any) => {
      const Hs = params.d ?? 3;             // Significant wave height (m)
      const Ts = params.e ?? 7;             // Significant period (s)
      const A = params.f ?? 0.11;           // Bretschneider constant A
      const B = params.g ?? 0.44;           // Bretschneider constant B
      const spread = params.h ?? 2;         // Directional spreading
      const t = params.i ?? 0;             // Time parameter

      // Map to frequency-direction space
      const f = (u * 2 + 0.02);            // Frequency (Hz)
      const theta = (v - 0.5) * Math.PI;    // Direction (radians)

      // Bretschneider parameters
      const fs = 1 / Ts;                    // Significant frequency
      
      // Bretschneider spectrum: S(f) = A Hs² Ts f⁻⁵ exp(-B(Ts f)⁻⁴)
      const frequency_factor = Math.pow(f, -5);
      const exponential = Math.exp(-B * Math.pow(Ts * f, -4));
      const S_Bretschneider = A * Hs*Hs * Ts * frequency_factor * exponential;
      
      // Alternative form using significant frequency
      const alternative_form = (5/16) * Hs*Hs * Math.pow(fs/f, 5) * Math.exp(-1.25 * Math.pow(fs/f, 4));
      
      // Use the more appropriate form based on frequency range
      const spectrum_base = (f < fs) ? S_Bretschneider : alternative_form;
      
      // Directional distribution (cos²ˢ model)
      const directional_factor = Math.pow(Math.max(0, Math.cos(theta)), 2*spread) / Math.PI;
      
      // 2D spectrum
      const S_2D = spectrum_base * directional_factor;
      
      // Storm development factor
      const storm_factor = 1 + 0.4 * Math.sin(Math.PI * f / (2*fs)) * Math.cos(2*Math.PI*t);
      
      // Wind gustiness effect
      const gust_effect = 1 + 0.1 * Math.sin(8*Math.PI*f*t) * Math.exp(-f/(3*fs));
      
      const bretschneider_final = S_2D * storm_factor * gust_effect;

      return [f * 8 - 4, theta * 6, bretschneider_final * 100];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 7, f: 0.11, g: 0.44, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  directional_spread_001: {
    name: "🌊 DIRECTIONAL-001: Directional Spreading Function",
    equation: (u: number, v: number, params: any) => {
      const s = params.d ?? 4;              // Spreading parameter
      const theta_mean = params.e ?? 0;     // Mean wave direction (radians)
      const asymmetry = params.f ?? 0.1;    // Asymmetry parameter
      const bimodal = params.g ?? 0;        // Bimodal factor
      const swell_dir = params.h ?? Math.PI/3; // Secondary (swell) direction
      const t = params.i ?? 0;             // Time parameter

      // Map to directional space
      const theta = (u - 0.5) * 4 * Math.PI; // Direction (-2π to 2π)
      const f = v * 2;                      // Frequency (0 to 2 Hz)

      // Angular difference from mean direction
      const delta_theta = theta - theta_mean;
      
      // Wrapped cosine function (periodic in 2π)
      const cos_delta = Math.cos(delta_theta);
      
      // Standard cos²ˢ spreading function
      const D_standard = Math.pow(Math.max(0, cos_delta), 2*s);
      
      // Asymmetric modification
      const asymmetric_factor = 1 + asymmetry * Math.sin(delta_theta);
      
      // Bimodal spreading (wind seas + swell)
      const swell_delta = theta - swell_dir;
      const D_swell = Math.pow(Math.max(0, Math.cos(swell_delta)), 2*(s+1));
      const bimodal_spread = (1 - bimodal) * D_standard + bimodal * D_swell;
      
      // Frequency-dependent spreading (higher freq = more directional)
      const freq_dependent_s = s * (1 + f/2);
      const D_freq_dep = Math.pow(Math.max(0, cos_delta), 2*freq_dependent_s);
      
      // Time-varying wind direction
      const wind_shift = 0.3 * Math.sin(2*Math.PI*t/10);
      const shifted_delta = delta_theta - wind_shift;
      const D_temporal = Math.pow(Math.max(0, Math.cos(shifted_delta)), 2*s);
      
      // Combined directional function
      const D_combined = bimodal_spread * asymmetric_factor * (0.7 * D_freq_dep + 0.3 * D_temporal);
      
      // Normalize
      const D_normalized = D_combined / Math.PI;

      return [theta, f * 4, D_normalized * 10];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0, f: 0.1, g: 0, h: 1.047, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  // HIGH-ORDER SPECTRAL METHODS - Advanced Nonlinear Wave Simulation
  hos_potential_001: {
    name: "🌊 HOS-POTENTIAL-001: HOS Potential Field ∇²φ = 0",
    equation: (u: number, v: number, params: any) => {
      const phi_amplitude = params.d ?? 1.0;  // Potential amplitude
      const steepness = params.e ?? 0.3;      // Wave steepness
      const depth = params.f ?? 20;           // Water depth
      const nonlinear_order = Math.floor(params.g) || 3; // HOS order
      const kappa = params.h ?? 2;            // Wavenumber
      const t = params.i ?? 0;               // Time parameter

      // Map to spatial coordinates
      const x = (u - 0.5) * 10;
      const z = (v - 0.5) * depth;

      // HOS potential: ∇²φ = 0 in fluid domain
      // φ(x,z,t) = Σₙ φₙ(x,t) Zₙ(z) where Zₙ satisfies vertical structure
      
      let phi_total = 0;
      
      // High-order expansion in steepness
      for (let n = 1; n <= nonlinear_order; n++) {
        const omega = Math.sqrt(9.81 * kappa * Math.tanh(kappa * depth));
        
        // Vertical structure function
        const Z_n = Math.cosh(kappa * (z + depth)) / Math.cosh(kappa * depth);
        
        // Horizontal component with nonlinear corrections
        const phi_n = phi_amplitude * Math.pow(steepness, n) * Math.cos(n * (kappa * x - omega * t)) / n;
        
        // Add nonlinear interaction terms
        const interaction = (n > 1) ? Math.sin((n-1) * (kappa * x - omega * t)) * Math.pow(steepness, n-1) : 0;
        
        phi_total += phi_n * Z_n + 0.1 * interaction * Z_n;
      }

      return [x, z, phi_total];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.3, f: 20, g: 3, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  hos_kinematic_001: {
    name: "🌊 HOS-KINEMATIC-001: Kinematic Boundary ∂φ/∂n = ∂η/∂t",
    equation: (u: number, v: number, params: any) => {
      const eta_amplitude = params.d ?? 0.5;   // Surface elevation amplitude
      const omega = params.e ?? 2;             // Wave frequency
      const k = params.f ?? 1;                 // Wavenumber
      const nonlinearity = params.g ?? 0.2;    // Nonlinear strength
      const hos_order = Math.floor(params.h) || 4; // HOS expansion order
      const t = params.i ?? 0;                // Time parameter

      // Map to surface coordinates
      const x = (u - 0.5) * 8;
      const time_phase = v * 2 * Math.PI;      // Phase variation

      // HOS kinematic condition: ∂φ/∂n = ∂η/∂t on free surface
      let eta = 0;      // Surface elevation
      let phi_n = 0;    // Normal derivative of potential
      
      // High-order expansion: η = Σₙ ηₙ, φ = Σₙ φₙ
      for (let n = 1; n <= hos_order; n++) {
        // nth-order surface elevation
        const eta_n = eta_amplitude * Math.pow(nonlinearity, n-1) * Math.cos(n * (k*x - omega*t) + time_phase) / n;
        
        // nth-order potential normal derivative
        const dphi_dn_n = omega * eta_amplitude * Math.pow(nonlinearity, n-1) * Math.sin(n * (k*x - omega*t) + time_phase);
        
        // Nonlinear coupling between orders
        if (n > 1) {
          const coupling = 0.5 * k * eta_amplitude * Math.pow(nonlinearity, n) * 
                          Math.sin((n-1) * (k*x - omega*t)) * Math.cos(k*x - omega*t);
          phi_n += coupling;
        }
        
        eta += eta_n;
        phi_n += dphi_dn_n;
      }
      
      // Kinematic consistency check: ∂η/∂t should equal ∂φ/∂n
      const deta_dt = omega * eta_amplitude * Math.sin(k*x - omega*t + time_phase);
      const kinematic_residual = phi_n - deta_dt;

      return [x, eta, kinematic_residual];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.5, e: 2, f: 1, g: 0.2, h: 4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  hos_dynamic_001: {
    name: "🌊 HOS-DYNAMIC-001: Dynamic Boundary ∂φ/∂t + ½|∇φ|² + gη = 0",
    equation: (u: number, v: number, params: any) => {
      const phi_t = params.d ?? 1.0;          // ∂φ/∂t amplitude
      const velocity_scale = params.e ?? 0.5;  // |∇φ| scale
      const g = params.f ?? 9.81;             // Gravity
      const eta_scale = params.g ?? 0.3;      // Surface elevation scale
      const nonlinear_strength = params.h ?? 0.4; // Nonlinear coupling
      const t = params.i ?? 0;               // Time parameter

      // Map to surface coordinates
      const x = (u - 0.5) * 6;
      const phase_space = (v - 0.5) * 2 * Math.PI;

      // HOS dynamic boundary condition: ∂φ/∂t + ½|∇φ|² + gη = 0
      
      // Linear terms
      const phi_partial_t = phi_t * Math.sin(x - 2*t + phase_space);
      const eta = eta_scale * Math.cos(x - 2*t + phase_space);
      const gravitational_term = g * eta;
      
      // Nonlinear velocity term: ½|∇φ|²
      const u_velocity = velocity_scale * Math.cos(x - 2*t);
      const v_velocity = velocity_scale * Math.sin(x - 2*t) * 0.5;
      const velocity_squared = 0.5 * (u_velocity*u_velocity + v_velocity*v_velocity);
      
      // Higher-order nonlinear corrections
      const nonlinear_correction = nonlinear_strength * Math.pow(eta, 2) * Math.sin(2*(x - 2*t));
      const cubic_term = 0.1 * nonlinear_strength * Math.pow(eta, 3) * Math.cos(3*(x - 2*t));
      
      // Pressure correction (Bernoulli's equation extension)
      const pressure_correction = -0.5 * velocity_squared * eta;
      
      // Complete dynamic condition
      const dynamic_residual = phi_partial_t + velocity_squared + gravitational_term + 
                              nonlinear_correction + cubic_term + pressure_correction;
      
      // Temporal modulation
      const temporal_envelope = 1 + 0.2 * Math.cos(0.5 * t) * Math.exp(-Math.abs(x)/10);

      return [x, eta, dynamic_residual * temporal_envelope];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.5, f: 9.81, g: 0.3, h: 0.4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 }
  },

  zakharov_001: {
    name: "🌊 ZAKHAROV-001: Zakharov Formulation Variables",
    equation: (u: number, v: number, params: any) => {
      const a_amplitude = params.d ?? 0.8;     // Surface amplitude variable
      const b_amplitude = params.e ?? 0.6;     // Surface potential variable
      const omega0 = params.f ?? 1.5;          // Fundamental frequency
      const k0 = params.g ?? 1.0;              // Fundamental wavenumber
      const coupling = params.h ?? 0.3;        // Nonlinear coupling strength
      const t = params.i ?? 0;                // Time parameter

      // Map to Fourier mode space
      const k = (u - 0.5) * 8;                // Wavenumber
      const omega = (v - 0.5) * 6 + omega0;   // Frequency

      // Zakharov variables: a(k,t) = surface amplitude, b(k,t) = surface potential
      const dispersion = Math.sqrt(9.81 * Math.abs(k));
      
      // Linear Zakharov evolution
      const phase = k * 5 - omega * t;
      const a_linear = a_amplitude * Math.exp(-0.1 * t) * Math.cos(phase);
      const b_linear = b_amplitude * Math.exp(-0.1 * t) * Math.sin(phase);
      
      // Nonlinear Zakharov terms: cubic interactions
      const k1 = k * 0.7;
      const k2 = k * 0.3;
      const omega1 = Math.sqrt(9.81 * Math.abs(k1));
      const omega2 = Math.sqrt(9.81 * Math.abs(k2));
      
      // Three-wave interaction terms
      const interaction_a = coupling * a_amplitude * b_amplitude * 
                           Math.cos((k1-k2)*5 - (omega1-omega2)*t) * 
                           Math.sin(k*5 - omega*t);
      
      const interaction_b = coupling * a_amplitude * a_amplitude * 
                           Math.sin(2*k1*5 - 2*omega1*t) * 
                           Math.cos(k*5 - omega*t);
      
      // Four-wave interactions (higher order)
      const four_wave = 0.1 * coupling * Math.pow(a_amplitude, 3) * 
                       Math.cos(3*k*5 - 3*omega*t);
      
      // Complete Zakharov variables
      const a_total = a_linear + interaction_a + four_wave;
      const b_total = b_linear + interaction_b;
      
      // Energy conserving formulation
      const energy_conserving_factor = Math.exp(-0.01 * (a_total*a_total + b_total*b_total));
      
      const zakharov_field = (a_total + b_total) * energy_conserving_factor;

      return [k, omega - omega0, zakharov_field];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.8, e: 0.6, f: 1.5, g: 1.0, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  exponential_convergence_001: {
    name: "🌊 EXP-CONV-001: Exponential Convergence Rate",
    equation: (u: number, v: number, params: any) => {
      const max_order = Math.floor(params.d) || 8;  // Maximum HOS order
      const convergence_rate = params.e ?? 0.8;     // Convergence parameter
      const base_amplitude = params.f ?? 1.0;       // Base wave amplitude
      const spectral_accuracy = params.g ?? 1e-12;  // Target accuracy
      const k = params.h ?? 2;                      // Wavenumber
      const t = params.i ?? 0;                     // Time parameter

      // Map to spatial and order space
      const x = (u - 0.5) * 8;
      const order = Math.floor(v * max_order) + 1;

      // Exponential convergence: error ~ exp(-αN) where N is HOS order
      const theoretical_error = Math.exp(-convergence_rate * order);
      
      // HOS series: η = Σₙ ηₙ with exponentially decreasing terms
      let eta_order = base_amplitude * Math.pow(convergence_rate, order-1) * 
                      Math.cos(order * (k*x - Math.sqrt(9.81*k)*t));
      
      // Spectral accuracy demonstration
      if (theoretical_error < spectral_accuracy) {
        eta_order *= 1e-10; // Machine precision reached
      }
      
      // Convergence acceleration techniques
      const acceleration_factor = 1 + 0.5 * Math.exp(-order/3);  // Padé approximation effect
      const accelerated_eta = eta_order * acceleration_factor;
      
      // Richardson extrapolation effect
      const richardson_correction = (order > 1) ? 
        0.1 * Math.pow(convergence_rate, order) * Math.sin(k*x - Math.sqrt(9.81*k)*t) : 0;
      
      // Gibbs phenomenon suppression
      const gibbs_filter = Math.exp(-Math.pow(order/max_order, 4));
      
      // Final convergent series term
      const convergent_term = (accelerated_eta + richardson_correction) * gibbs_filter;
      
      // Error bounds visualization
      const error_bound = theoretical_error * base_amplitude;

      return [x, order, convergent_term + error_bound];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 0.8, f: 1.0, g: 1e-12, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 16 }
  },

  dommermuth_yue_001: {
    name: "🌊 DOMMERMUTH-YUE-001: Dommermuth-Yue Method",
    equation: (u: number, v: number, params: any) => {
      const steepness = params.d ?? 0.25;       // Wave steepness ka
      const depth_ratio = params.e ?? 0.5;     // kh (wavenumber × depth)
      const time_step = params.f ?? 0.01;      // Dt for time stepping
      const filter_strength = params.g ?? 0.9; // Aliasing filter
      const hos_order = Math.floor(params.h) || 6; // HOS truncation order
      const t = params.i ?? 0;                // Time parameter

      // Map to computational domain
      const x = (u - 0.5) * 2 * Math.PI;      // Periodic domain [0, 2π]
      const z_normalized = v;                  // Normalized depth [0, 1]

      // Dommermuth-Yue transformation variables
      const sigma = z_normalized;             // σ = (z + h)/η where η is surface
      
      // Base wave field
      const k = 2;  // Fundamental wavenumber
      const omega = Math.sqrt(9.81 * k * Math.tanh(k * depth_ratio * 10));
      const eta_base = steepness * Math.cos(k*x - omega*t);
      
      // Dommermuth-Yue vertical transformation
      // φ(x,z,t) = Σₙ φₙ(x,t) Tₙ(σ) where Tₙ are Chebyshev polynomials
      let phi_total = 0;
      
      for (let n = 0; n < hos_order; n++) {
        // Chebyshev polynomial of first kind
        const T_n = Math.cos(n * Math.acos(2*sigma - 1));
        
        // Modal coefficient with nonlinear evolution
        const phi_n = steepness * Math.pow(steepness, n) * Math.cos(k*x - omega*t + n*Math.PI/4) / (n + 1);
        
        // Anti-aliasing filter (2/3 rule)
        const filter = (n < 2*hos_order/3) ? 1 : Math.exp(-Math.pow((n - 2*hos_order/3)/(hos_order/3), 4));
        
        phi_total += phi_n * T_n * filter;
      }
      
      // Time stepping stability (Dommermuth-Yue uses 4th-order Runge-Kutta)
      const stability_factor = 1 - 0.1 * Math.sin(omega * t) * Math.exp(-t * 0.1);
      
      // Surface elevation with nonlinear correction
      const eta_corrected = eta_base * (1 + 0.5 * steepness * Math.cos(2*(k*x - omega*t)));
      
      // Combined field showing both potential and surface
      const combined_field = phi_total * stability_factor + eta_corrected * (1 - sigma);

      return [x, sigma * 2 - 1, combined_field];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.25, e: 0.5, f: 0.01, g: 0.9, h: 6, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  west_implementation_001: {
    name: "🌊 WEST-001: West et al. Implementation",
    equation: (u: number, v: number, params: any) => {
      const epsilon = params.d ?? 0.2;         // Nonlinearity parameter
      const delta = params.e ?? 0.3;           // Dispersion parameter
      const spectral_modes = Math.floor(params.f) || 32; // Number of modes
      const evolution_time = params.g ?? 1.0;  // Evolution time scale
      const damping = params.h ?? 0.05;        // Numerical damping
      const t = params.i ?? 0;                // Time parameter

      // Map to spectral domain
      const k_mode = Math.floor((u - 0.5) * spectral_modes * 2); // Mode number
      const physical_x = (v - 0.5) * 4 * Math.PI;                // Physical space

      // West et al. uses pseudo-spectral approach with FFT
      let surface_elevation = 0;
      
      // Multi-mode representation
      for (let m = -spectral_modes/2; m <= spectral_modes/2; m++) {
        if (m === 0) continue;
        
        const k_m = m;
        const omega_m = Math.sqrt(9.81 * Math.abs(k_m) * (1 + delta * k_m * k_m));
        
        // West implementation: careful treatment of aliasing
        const phase = k_m * physical_x - omega_m * t;
        const amplitude = epsilon * Math.exp(-0.5 * k_m * k_m) / Math.abs(k_m);
        
        // Nonlinear interaction (West's cubic terms)
        const cubic_interaction = epsilon * epsilon * epsilon * 
                                 Math.cos(3 * phase) * Math.exp(-Math.abs(k_m) * damping);
        
        // Anti-aliasing (West uses 2/3 rule)
        const aliasing_filter = (Math.abs(k_m) < 2 * spectral_modes / 3) ? 1 : 0;
        
        surface_elevation += (amplitude * Math.cos(phase) + cubic_interaction) * aliasing_filter;
      }
      
      // West's stability enhancement
      const stability_correction = Math.exp(-damping * t * evolution_time);
      
      // Highlighting specific mode if viewing mode space
      const mode_contribution = (k_mode >= -spectral_modes/2 && k_mode <= spectral_modes/2) ?
        epsilon * Math.exp(-0.5 * k_mode * k_mode) * Math.cos(k_mode * 2 - Math.sqrt(9.81 * Math.abs(k_mode)) * t) : 0;

      return [physical_x, k_mode, (surface_elevation * stability_correction + mode_contribution) * 0.5];
    },
    defaults: { a: 1, b: 1, c: 1, d: 0.2, e: 0.3, f: 32, g: 1.0, h: 0.05, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  ducrozet_method_001: {
    name: "🌊 DUCROZET-001: Ducrozet et al. Method",
    equation: (u: number, v: number, params: any) => {
      const M = Math.floor(params.d) || 5;     // HOS order M
      const dealiasing = params.e ?? 0.67;     // Dealiasing threshold (2/3 rule)
      const ramp_function = params.f ?? 0.1;   // Ramp function parameter
      const stability_param = params.g ?? 0.02; // Stability parameter
      const relaxation_zone = params.h ?? 0.2; // Relaxation zone width
      const t = params.i ?? 0;                // Time parameter

      // Map to computational grid
      const xi = (u - 0.5) * 2 * Math.PI;     // Horizontal coordinate [0, 2π]
      const eta_tilde = (v - 0.5) * 3;        // Normalized vertical coordinate

      // Ducrozet's method: HOS with improved stability
      const k0 = 1;
      const omega0 = Math.sqrt(9.81 * k0);
      
      // Multi-order surface representation
      let eta_surface = 0;
      let phi_surface = 0;
      
      for (let m = 1; m <= M; m++) {
        const k_m = m * k0;
        const omega_m = Math.sqrt(9.81 * k_m);
        
        // Ducrozet's modified amplitudes for stability
        const amplitude_factor = Math.pow(0.8, m-1) * Math.exp(-stability_param * m * m);
        
        // Surface elevation terms
        const eta_m = amplitude_factor * Math.cos(k_m * xi - omega_m * t) / m;
        
        // Surface potential terms
        const phi_m = amplitude_factor * Math.sin(k_m * xi - omega_m * t) / (m * omega_m);
        
        // Ducrozet's ramp function to prevent startup transients
        const ramp = Math.tanh(ramp_function * t);
        
        eta_surface += eta_m * ramp;
        phi_surface += phi_m * ramp;
      }
      
      // Ducrozet's dealiasing procedure
      const mode_cutoff = M * dealiasing;
      const filter_function = (M <= mode_cutoff) ? 1 : Math.exp(-Math.pow((M - mode_cutoff)/(M - mode_cutoff), 4));
      
      // Relaxation zone (Ducrozet's boundary treatment)
      const x_normalized = xi / (2 * Math.PI);
      let relaxation_factor = 1;
      if (x_normalized < relaxation_zone) {
        relaxation_factor = Math.pow(x_normalized / relaxation_zone, 2);
      } else if (x_normalized > 1 - relaxation_zone) {
        relaxation_factor = Math.pow((1 - x_normalized) / relaxation_zone, 2);
      }
      
      // Combined field with Ducrozet improvements
      const ducrozet_field = (eta_surface + 0.5 * phi_surface) * filter_function * relaxation_factor;
      
      // Visualization of method efficiency
      const efficiency_metric = filter_function * relaxation_factor * Math.exp(-stability_param * t);

      return [xi, eta_tilde, ducrozet_field + efficiency_metric];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 0.67, f: 0.1, g: 0.02, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 60 }
  },

  // PSEUDOSPECTRAL METHODS - Spectral Collocation for Differential Equations
  chebyshev_collocation_001: {
    name: "📐 CHEBYSHEV-001: Chebyshev Pseudospectral Method",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 16;       // Number of collocation points
      const wave_amplitude = params.e ?? 1.0;     // Solution amplitude
      const frequency = params.f ?? 2;            // Wave frequency
      const damping = params.g ?? 0.1;            // Damping coefficient
      const expansion_order = Math.floor(params.h) || 8; // Chebyshev expansion order
      const t = params.i ?? 0;                   // Time parameter

      // Map to Chebyshev domain [-1, 1]
      const xi = (u - 0.5) * 2;  // Computational coordinate
      const mode_index = Math.floor(v * N);

      // Chebyshev-Gauss-Lobatto points
      const x_cgl = Math.cos(Math.PI * mode_index / N);
      
      // Chebyshev polynomial evaluation T_n(x)
      const chebyshev = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        
        let T0 = 1;
        let T1 = x;
        let Tn = 0;
        
        for (let i = 2; i <= n; i++) {
          Tn = 2 * x * T1 - T0;
          T0 = T1;
          T1 = Tn;
        }
        
        return Tn;
      };

      // Pseudospectral solution: u(x,t) = Σₙ aₙ(t) Tₙ(x)
      let u_solution = 0;
      
      for (let n = 0; n <= expansion_order; n++) {
        // Modal amplitude with temporal evolution
        const a_n = wave_amplitude * Math.exp(-damping * n * n * t) * 
                   Math.cos(frequency * Math.sqrt(n + 1) * t) / (n + 1);
        
        // Chebyshev mode contribution
        const T_n = chebyshev(n, xi);
        u_solution += a_n * T_n;
      }

      // Spectral differentiation matrix action (for visualization)
      const derivative_approx = expansion_order > 1 ? 
        Math.sin(frequency * xi - t) * wave_amplitude : 0;

      // Collocation point residual
      const collocation_residual = Math.abs(u_solution - derivative_approx) * 
                                   Math.exp(-Math.pow(xi - x_cgl, 2) / 0.1);

      return [xi, mode_index / N, u_solution + 0.3 * collocation_residual];
    },
    defaults: { a: 1, b: 1, c: 1, d: 16, e: 1.0, f: 2, g: 0.1, h: 8, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 32 }
  },

  legendre_collocation_001: {
    name: "📐 LEGENDRE-001: Legendre Pseudospectral Method",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 12;        // Number of Gauss-Lobatto points
      const amplitude = params.e ?? 0.8;           // Solution amplitude
      const alpha = params.f ?? 1.5;               // Equation parameter α
      const beta = params.g ?? 0.5;                // Equation parameter β
      const poly_order = Math.floor(params.h) || 10; // Polynomial expansion order
      const t = params.i ?? 0;                    // Time parameter

      // Map to Legendre domain [-1, 1]
      const x = (u - 0.5) * 2;
      const gauss_index = Math.floor(v * N);

      // Legendre polynomial evaluation P_n(x) using Bonnet's recursion
      const legendre = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        
        let P0 = 1;
        let P1 = x;
        let Pn = 0;
        
        for (let k = 2; k <= n; k++) {
          Pn = ((2*k - 1) * x * P1 - (k - 1) * P0) / k;
          P0 = P1;
          P1 = Pn;
        }
        
        return Pn;
      };

      // Gauss-Legendre-Lobatto points (approximation)
      const xi_gll = Math.cos(Math.PI * gauss_index / (N - 1));

      // Pseudospectral solution expansion
      let u_spectral = 0;
      
      for (let n = 0; n <= poly_order; n++) {
        // Modal coefficient with physics
        const c_n = amplitude * Math.exp(-alpha * n * t) * 
                   Math.sin(beta * n * Math.PI + t) / Math.sqrt(n + 1);
        
        // Legendre polynomial basis
        const P_n = legendre(n, x);
        u_spectral += c_n * P_n;
      }

      // Gauss-Lobatto quadrature weight (for integration accuracy)
      const weight_gll = (gauss_index === 0 || gauss_index === N - 1) ? 
        2 / (N * (N - 1)) : 2 / (N * (N - 1) * Math.pow(legendre(N - 1, xi_gll), 2));

      // Solution with quadrature weight visualization
      const weighted_solution = u_spectral * (1 + 0.2 * weight_gll * N);

      return [x, gauss_index / (N - 1), weighted_solution];
    },
    defaults: { a: 1, b: 1, c: 1, d: 12, e: 0.8, f: 1.5, g: 0.5, h: 10, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 24 }
  },

  fourier_collocation_001: {
    name: "📐 FOURIER-COLL-001: Fourier Spectral Collocation",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 32;        // Number of Fourier modes
      const amplitude = params.e ?? 1.2;           // Wave amplitude
      const wavenumber = params.f ?? 3;            // Fundamental wavenumber
      const dispersion = params.g ?? 0.3;          // Dispersion parameter
      const aliasing_threshold = params.h ?? 0.67; // 2/3 dealiasing rule
      const t = params.i ?? 0;                    // Time parameter

      // Periodic domain [0, 2π]
      const x = u * 2 * Math.PI;
      const mode = Math.floor((v - 0.5) * N * 2);  // Mode number from -N to N

      // Fourier spectral solution: u(x,t) = Σₖ ûₖ(t) exp(ikx)
      let u_fourier_real = 0;
      let u_fourier_imag = 0;
      
      for (let k = -N/2; k <= N/2; k++) {
        if (k === 0) continue;
        
        // Dispersion relation ω(k)
        const omega_k = Math.sqrt(Math.abs(k) * wavenumber) * (1 + dispersion * k * k);
        
        // Modal amplitude (exponential decay for high modes)
        const u_k = amplitude * Math.exp(-0.1 * k * k / (N * N));
        
        // Dealiasing filter (2/3 rule)
        const filter = (Math.abs(k) <= N * aliasing_threshold) ? 1 : 0;
        
        // Complex exponential: exp(i(kx - ωt))
        const phase = k * x - omega_k * t;
        u_fourier_real += u_k * Math.cos(phase) * filter;
        u_fourier_imag += u_k * Math.sin(phase) * filter;
      }

      // Magnitude of complex solution
      const u_magnitude = Math.sqrt(u_fourier_real * u_fourier_real + u_fourier_imag * u_fourier_imag);

      // Highlight specific mode if in mode space
      const mode_contribution = (mode >= -N/2 && mode <= N/2) ?
        amplitude * Math.exp(-0.1 * mode * mode / (N * N)) * 
        Math.cos(mode * 0.5 - Math.sqrt(Math.abs(mode) * wavenumber) * t) : 0;

      return [x, mode, u_magnitude + 0.5 * mode_contribution];
    },
    defaults: { a: 1, b: 1, c: 1, d: 32, e: 1.2, f: 3, g: 0.3, h: 0.67, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  hermite_collocation_001: {
    name: "📐 HERMITE-001: Hermite Pseudospectral (Unbounded Domain)",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 10;         // Number of Hermite modes
      const amplitude = params.e ?? 1.0;            // Solution amplitude
      const diffusion = params.f ?? 0.5;            // Diffusion coefficient
      const source_strength = params.g ?? 0.3;      // Source term strength
      const scaling = params.h ?? 2.0;              // Domain scaling
      const t = params.i ?? 0;                     // Time parameter

      // Map to unbounded domain via scaling
      const x = (u - 0.5) * scaling * 10;
      const mode_n = Math.floor(v * N);

      // Hermite polynomial H_n(x) using physicists' definition
      const hermite = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return 2 * x;
        
        let H0 = 1;
        let H1 = 2 * x;
        let Hn = 0;
        
        for (let k = 2; k <= n; k++) {
          Hn = 2 * x * H1 - 2 * (k - 1) * H0;
          H0 = H1;
          H1 = Hn;
        }
        
        return Hn;
      };

      // Weight function for Hermite basis
      const weight = Math.exp(-x * x / (2 * scaling * scaling));

      // Hermite spectral expansion with Gaussian weight
      let u_hermite = 0;
      
      for (let n = 0; n < N; n++) {
        // Time-dependent modal coefficients  
        // Factorial approximation for normalization
        const factorial_n = n <= 1 ? 1 : n * (n - 1); // Simplified for performance
        const a_n = amplitude * Math.exp(-diffusion * n * t) * 
                   (1 + source_strength * Math.sin(n * Math.PI / N + t)) / 
                   Math.sqrt(Math.pow(2, n) * factorial_n * Math.sqrt(Math.PI));
        
        // Hermite polynomial basis
        const H_n = hermite(n, x / scaling);
        u_hermite += a_n * H_n * weight;
      }

      // Normalize solution
      const normalized_solution = u_hermite / (1 + Math.abs(u_hermite) * 0.1);

      return [x, mode_n, normalized_solution];
    },
    defaults: { a: 1, b: 1, c: 1, d: 10, e: 1.0, f: 0.5, g: 0.3, h: 2.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 20 }
  },

  laguerre_collocation_001: {
    name: "📐 LAGUERRE-001: Laguerre Pseudospectral (Semi-Infinite)",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 12;         // Number of Laguerre modes
      const amplitude = params.e ?? 0.8;            // Solution amplitude
      const decay_rate = params.f ?? 1.0;           // Exponential decay rate
      const oscillation = params.g ?? 2.0;          // Oscillation frequency
      const alpha = params.h ?? 0;                  // Laguerre parameter α
      const t = params.i ?? 0;                     // Time parameter

      // Map to semi-infinite domain [0, ∞)
      const x = u * 15;  // Scale to [0, 15] for visualization
      const mode_n = Math.floor(v * N);

      // Generalized Laguerre polynomial L_n^α(x)
      const laguerre = (n: number, alpha: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return 1 + alpha - x;
        
        let L0 = 1;
        let L1 = 1 + alpha - x;
        let Ln = 0;
        
        for (let k = 2; k <= n; k++) {
          Ln = ((2*k - 1 + alpha - x) * L1 - (k - 1 + alpha) * L0) / k;
          L0 = L1;
          L1 = Ln;
        }
        
        return Ln;
      };

      // Laguerre weight function
      const weight = Math.pow(x, alpha) * Math.exp(-x);

      // Laguerre spectral expansion
      let u_laguerre = 0;
      
      for (let n = 0; n < N; n++) {
        // Time-dependent coefficients with decay
        const c_n = amplitude * Math.exp(-decay_rate * n * t) * 
                   Math.cos(oscillation * Math.sqrt(n + 1) * t) / (n + 1);
        
        // Laguerre polynomial basis
        const L_n = laguerre(n, alpha, x);
        u_laguerre += c_n * L_n * weight;
      }

      // Solution normalization for visualization
      const solution = u_laguerre / (1 + x * 0.05);

      return [x, mode_n, solution];
    },
    defaults: { a: 1, b: 1, c: 1, d: 12, e: 0.8, f: 1.0, g: 2.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 24 }
  },

  rational_chebyshev_001: {
    name: "📐 RATIONAL-CHEB-001: Rational Chebyshev Functions",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 10;          // Number of rational modes
      const amplitude = params.e ?? 1.0;             // Solution amplitude
      const decay_length = params.f ?? 3.0;          // Characteristic decay length
      const oscillation_freq = params.g ?? 1.5;      // Oscillation frequency
      const mapping_param = params.h ?? 1.0;         // Mapping parameter L
      const t = params.i ?? 0;                      // Time parameter

      // Map to semi-infinite domain using rational map
      const y = (u - 0.5) * 20;  // Extended domain
      const x = mapping_param * y / (1 + Math.abs(y)); // Rational mapping to (-L, L)
      const mode_n = Math.floor(v * N);

      // Rational Chebyshev function TL_n(y) = T_n(x/L)
      const chebyshev_T = (n: number, xi: number): number => {
        if (Math.abs(xi) > 1) {
          // Use hyperbolic form for |x| > 1
          return Math.cosh(n * Math.acosh(Math.abs(xi))) * Math.sign(xi);
        }
        return Math.cos(n * Math.acos(xi));
      };

      // Rational Chebyshev spectral expansion
      let u_rational = 0;
      
      for (let n = 0; n < N; n++) {
        // Modal coefficients with exponential decay
        const a_n = amplitude * Math.exp(-n / decay_length) * 
                   Math.sin(oscillation_freq * n + t) / Math.sqrt(n + 1);
        
        // Rational Chebyshev function
        const TL_n = chebyshev_T(n, x / mapping_param);
        
        // Weight function for semi-infinite domain
        const weight_n = Math.exp(-Math.abs(y) / (2 * decay_length));
        
        u_rational += a_n * TL_n * weight_n;
      }

      // Algebraic decay envelope
      const envelope = 1 / (1 + Math.pow(Math.abs(y) / decay_length, 2));

      return [y, mode_n, u_rational * envelope];
    },
    defaults: { a: 1, b: 1, c: 1, d: 10, e: 1.0, f: 3.0, g: 1.5, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 20 }
  },

  sinc_collocation_001: {
    name: "📐 SINC-COLL-001: Sinc Pseudospectral Method",
    equation: (u: number, v: number, params: any) => {
      const N = Math.floor(params.d) || 32;          // Number of sinc basis functions
      const amplitude = params.e ?? 1.0;             // Solution amplitude
      const bandwidth = params.f ?? Math.PI;         // Bandwidth parameter
      const decay_rate = params.g ?? 0.1;            // Decay rate
      const mesh_spacing = params.h ?? 0.2;          // h: sinc mesh spacing
      const t = params.i ?? 0;                      // Time parameter

      // Computational domain
      const x = (u - 0.5) * 10;
      const grid_index = Math.floor((v - 0.5) * N * 2);

      // Sinc function: sinc(x) = sin(πx)/(πx)
      const sinc = (x: number): number => {
        if (Math.abs(x) < 1e-10) return 1;
        const px = Math.PI * x;
        return Math.sin(px) / px;
      };

      // Sinc basis function S(k,h)(x) = sinc((x - kh)/h)
      const sinc_basis = (x: number, k: number, h: number): number => {
        return sinc((x - k * h) / h);
      };

      // Sinc pseudospectral interpolation
      let u_sinc = 0;
      
      for (let k = -N/2; k <= N/2; k++) {
        // Grid point value with temporal evolution
        const u_k = amplitude * Math.exp(-decay_rate * k * k * mesh_spacing * mesh_spacing * t) *
                   Math.cos(bandwidth * k * mesh_spacing - t) / (1 + Math.abs(k) * 0.1);
        
        // Sinc cardinal function
        const S_k = sinc_basis(x, k, mesh_spacing);
        u_sinc += u_k * S_k;
      }

      // Conformal map enhancement for semi-infinite domains
      const phi = Math.exp(-Math.abs(x) / 5);  // Conformal mapping factor
      const enhanced_solution = u_sinc * (1 + 0.3 * phi);

      // Grid point indicator
      const grid_point_indicator = (grid_index >= -N/2 && grid_index <= N/2) ?
        0.1 * Math.exp(-Math.pow((x - grid_index * mesh_spacing) / mesh_spacing, 2)) : 0;

      return [x, grid_index * 0.1, enhanced_solution + grid_point_indicator];
    },
    defaults: { a: 1, b: 1, c: 1, d: 32, e: 1.0, f: Math.PI, g: 0.1, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  // SPECTRAL ELEMENT METHODS - hp-FEM with Spectral Accuracy
  gauss_lobatto_legendre_001: {
    name: "🔬 GLL-001: Gauss-Lobatto-Legendre Spectral Elements",
    equation: (u: number, v: number, params: any) => {
      const N_elements = Math.floor(params.d) || 4;    // Number of elements
      const poly_order = Math.floor(params.e) || 8;    // Polynomial order per element
      const amplitude = params.f ?? 1.0;               // Solution amplitude
      const wave_freq = params.g ?? 2.0;               // Wave frequency
      const continuity = params.h ?? 1.0;              // C^0 continuity enforcement
      const t = params.i ?? 0;                        // Time parameter

      // Physical domain subdivision
      const total_domain = 2 * Math.PI;
      const element_size = total_domain / N_elements;
      const x_global = u * total_domain;
      
      // Determine which element we're in
      const element_id = Math.floor(x_global / element_size);
      const x_local = (x_global - element_id * element_size) / element_size; // [0,1]
      const xi = 2 * x_local - 1; // Map to [-1,1] for GLL points

      // GLL nodes (approximation using Chebyshev)
      const gll_node = Math.floor(v * (poly_order + 1));
      const xi_gll = Math.cos(Math.PI * gll_node / poly_order);

      // Lagrange interpolation at GLL points
      const lagrange_gll = (n: number, x: number): number => {
        let L = 1;
        const nodes = [];
        for (let i = 0; i <= poly_order; i++) {
          nodes.push(Math.cos(Math.PI * i / poly_order));
        }
        
        for (let j = 0; j <= poly_order; j++) {
          if (j !== n) {
            L *= (x - nodes[j]) / (nodes[n] - nodes[j]);
          }
        }
        return L;
      };

      // Spectral element solution
      let u_sem = 0;
      for (let p = 0; p <= poly_order; p++) {
        // Nodal values with wave solution
        const node_value = amplitude * Math.sin(wave_freq * (element_id * element_size + (p / poly_order) * element_size) - t);
        
        // Lagrange basis at GLL nodes
        const L_p = lagrange_gll(p, xi);
        u_sem += node_value * L_p;
      }

      // C^0 continuity at element boundaries
      const boundary_correction = (x_local < 0.1 || x_local > 0.9) ? 
        continuity * Math.exp(-Math.pow((x_local - Math.round(x_local)) / 0.1, 2)) : 0;

      return [x_global, element_id + x_local, u_sem + 0.1 * boundary_correction];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 8, f: 1.0, g: 2.0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 40 }
  },

  gauss_radau_legendre_001: {
    name: "🔬 GRL-001: Gauss-Radau-Legendre Spectral Elements",
    equation: (u: number, v: number, params: any) => {
      const N_elem = Math.floor(params.d) || 6;        // Number of elements
      const P = Math.floor(params.e) || 6;             // Polynomial degree
      const amplitude = params.f ?? 0.8;               // Wave amplitude
      const boundary_flux = params.g ?? 0.5;           // Boundary flux parameter
      const upwind_param = params.h ?? 0.3;            // Upwinding parameter
      const t = params.i ?? 0;                        // Time parameter

      // Domain decomposition
      const L = 4 * Math.PI;
      const h = L / N_elem;
      const x = u * L;
      
      const elem = Math.floor(x / h);
      const x_e = (x - elem * h) / h; // Local coordinate [0,1]
      const r = 2 * x_e - 1;          // Radau coordinate [-1,1]

      // Gauss-Radau-Legendre points (left Radau: includes r=-1)
      const radau_point = Math.floor(v * (P + 1));
      // Approximate Radau points (left endpoint included)
      const r_radau = radau_point === 0 ? -1 : Math.cos(Math.PI * (radau_point - 0.5) / P);

      // Legendre polynomial
      const legendre_P = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        let P0 = 1, P1 = x, Pn = 0;
        for (let k = 2; k <= n; k++) {
          Pn = ((2*k - 1) * x * P1 - (k - 1) * P0) / k;
          P0 = P1;
          P1 = Pn;
        }
        return Pn;
      };

      // Radau basis functions
      let u_radau = 0;
      for (let i = 0; i <= P; i++) {
        // Modal coefficients
        const c_i = amplitude * legendre_P(i, 0.5) * Math.cos(i * Math.PI / P - t) / (i + 1);
        
        // Radau-Legendre basis
        const phi_i = i === 0 ? (1 - r) / 2 : legendre_P(i, r) - legendre_P(i, -1);
        u_radau += c_i * phi_i;
      }

      // Upwind flux at element boundary (Radau has point at boundary)
      const flux_correction = (x_e < 0.05) ? 
        upwind_param * boundary_flux * (u_radau + amplitude) : 0;

      return [x, elem + x_e, u_radau + flux_correction];
    },
    defaults: { a: 1, b: 1, c: 1, d: 6, e: 6, f: 0.8, g: 0.5, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 72, vSegments: 36 }
  },

  gauss_legendre_001: {
    name: "🔬 GL-001: Gauss-Legendre Spectral Elements",
    equation: (u: number, v: number, params: any) => {
      const n_elem = Math.floor(params.d) || 8;        // Number of elements
      const order = Math.floor(params.e) || 5;         // Gauss quadrature order
      const amplitude = params.f ?? 1.2;               // Solution amplitude
      const diffusion = params.g ?? 0.2;               // Diffusion coefficient
      const source = params.h ?? 0.4;                  // Source term
      const t = params.i ?? 0;                        // Time parameter

      // Element mesh
      const domain_length = 3 * Math.PI;
      const h_elem = domain_length / n_elem;
      const x_phys = u * domain_length;
      
      const e = Math.floor(x_phys / h_elem);
      const x_loc = (x_phys - e * h_elem) / h_elem;
      const s = 2 * x_loc - 1; // Standard element [-1,1]

      // Gauss-Legendre quadrature points (interior only, no boundary points)
      const quad_pt = Math.floor(v * order);
      
      // Approximate GL points using roots of Legendre polynomial
      const gauss_point = (k: number, n: number): number => {
        // Approximation for visualization
        return Math.cos(Math.PI * (k + 0.5) / n);
      };
      const s_gauss = gauss_point(quad_pt, order);

      // Legendre basis
      const P_n = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        let p0 = 1, p1 = x;
        for (let i = 2; i <= n; i++) {
          const p2 = ((2*i - 1) * x * p1 - (i - 1) * p0) / i;
          p0 = p1;
          p1 = p2;
        }
        return p1;
      };

      // Gauss-Legendre spectral element expansion
      let u_gl = 0;
      for (let k = 0; k < order; k++) {
        // Time-dependent coefficients with diffusion and source
        const coeff = amplitude * Math.exp(-diffusion * k * k * t) * 
                     (Math.sin(k * Math.PI / order - t) + source * Math.cos(k));
        
        u_gl += coeff * P_n(k, s) / (k + 1);
      }

      // Quadrature weight visualization
      const gauss_weight = Math.sqrt(1 - s_gauss * s_gauss) * 0.2;

      return [x_phys, e + x_loc, u_gl * (1 + gauss_weight)];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 5, f: 1.2, g: 0.2, h: 0.4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 30 }
  },

  mortar_element_001: {
    name: "🔬 MORTAR-001: Mortar Spectral Element Method",
    equation: (u: number, v: number, params: any) => {
      const n_coarse = Math.floor(params.d) || 3;      // Coarse mesh elements
      const n_fine = Math.floor(params.e) || 9;        // Fine mesh elements  
      const poly_deg = Math.floor(params.f) || 6;      // Polynomial degree
      const coupling = params.g ?? 0.8;                // Mortar coupling strength
      const contrast = params.h ?? 2.0;                // Solution contrast
      const t = params.i ?? 0;                        // Time parameter

      // Two-scale domain decomposition
      const x = u * 4 * Math.PI;
      const interface_pos = 2 * Math.PI; // Mortar interface

      // Determine if we're in coarse or fine region
      const in_fine_region = x > interface_pos;
      const n_elem = in_fine_region ? n_fine : n_coarse;
      const region_start = in_fine_region ? interface_pos : 0;
      const region_length = in_fine_region ? 2 * Math.PI : interface_pos;
      
      const h = region_length / n_elem;
      const x_region = x - region_start;
      const elem = Math.floor(x_region / h);
      const xi = 2 * (x_region - elem * h) / h - 1;

      // Spectral basis
      const chebyshev = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        let T0 = 1, T1 = x;
        for (let i = 2; i <= n; i++) {
          const T2 = 2 * x * T1 - T0;
          T0 = T1;
          T1 = T2;
        }
        return T1;
      };

      // Solution with mesh contrast
      let u_mortar = 0;
      for (let p = 0; p <= poly_deg; p++) {
        const scale = in_fine_region ? 1.0 : contrast;
        const coeff = scale * Math.sin(p * Math.PI / poly_deg - t) / (p + 1);
        u_mortar += coeff * chebyshev(p, xi);
      }

      // Mortar coupling at interface
      const dist_to_interface = Math.abs(x - interface_pos);
      const mortar_coupling = dist_to_interface < 0.3 ? 
        coupling * Math.exp(-Math.pow(dist_to_interface / 0.1, 2)) * 
        Math.sin(4 * (x - interface_pos) - t) : 0;

      return [x, v * 2, u_mortar + mortar_coupling];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 9, f: 6, g: 0.8, h: 2.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 32 }
  },

  hp_sem_001: {
    name: "🔬 HP-SEM-001: hp-Adaptive Spectral Element Method",
    equation: (u: number, v: number, params: any) => {
      const base_elements = Math.floor(params.d) || 4;   // Base h-refinement
      const min_order = Math.floor(params.e) || 3;       // Minimum polynomial order
      const max_order = Math.floor(params.f) || 12;      // Maximum polynomial order
      const refinement_threshold = params.g ?? 0.5;      // Refinement threshold
      const amplitude = params.h ?? 1.0;                 // Solution amplitude
      const t = params.i ?? 0;                          // Time parameter

      // Physical domain
      const L = 3 * Math.PI;
      const x = u * L;

      // hp-adaptive strategy: refine where solution gradient is large
      const solution_gradient = Math.abs(amplitude * Math.cos(3 * x - 2 * t));
      const needs_refinement = solution_gradient > refinement_threshold;

      // h-refinement: split elements where needed
      const h_level = needs_refinement ? 2 : 1;
      const n_elem = base_elements * h_level;
      const h = L / n_elem;
      
      const elem_id = Math.floor(x / h);
      const xi = 2 * ((x - elem_id * h) / h) - 1;

      // p-refinement: increase polynomial order where needed
      const p_order = needs_refinement ? max_order : min_order;

      // Legendre spectral basis with adaptive order
      const legendre = (n: number, x: number): number => {
        if (n === 0) return 1;
        if (n === 1) return x;
        let L0 = 1, L1 = x;
        for (let k = 2; k <= n; k++) {
          const L2 = ((2*k - 1) * x * L1 - (k - 1) * L0) / k;
          L0 = L1;
          L1 = L2;
        }
        return L1;
      };

      // hp-adaptive spectral expansion
      let u_hp = 0;
      for (let p = 0; p <= p_order; p++) {
        const modal_coeff = amplitude * Math.exp(-0.05 * p * p) * 
                           Math.sin(p * Math.PI / p_order - t) / (p + 1);
        u_hp += modal_coeff * legendre(p, xi);
      }

      // Refinement indicator visualization
      const refinement_indicator = needs_refinement ? 0.2 * solution_gradient : 0;

      return [x, elem_id / n_elem, u_hp + refinement_indicator];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 3, f: 12, g: 0.5, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  // DISABLED: Produces NaN errors - needs geometric depth fix
  // dg_spectral_001: {
  //   name: "🔬 DG-SPECTRAL-001: Discontinuous Galerkin Spectral Method",
  //   equation: (u: number, v: number, params: any) => {
  //     return [0, 0, 0];  // Disabled
  //   },
  //   defaults: { a: 1, b: 1, c: 1, d: 8, e: 5, f: 0.5, g: 1.0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  // },

  // WAVELET METHODS - Multi-Resolution Analysis
  daubechies_wavelet_001: {
    name: "🌊 DAUBECHIES-001: Daubechies Wavelet Transform",
    equation: (u: number, v: number, params: any) => {
      const wavelet_order = Math.floor(params.d) || 4;  // Daubechies order (D4, D6, D8...)
      const scale_j = Math.floor(params.e) || 3;        // Scale level j
      const translation_k = Math.floor(params.f) || 0;  // Translation parameter k
      const amplitude = params.g ?? 1.0;                // Amplitude
      const decomposition_levels = Math.floor(params.h) || 4; // Decomposition levels
      const t = params.i ?? 0;                         // Time parameter

      // Wavelet coordinates
      const x = (u - 0.5) * 8;
      const j = Math.floor(v * decomposition_levels); // Current scale level

      // Daubechies wavelet approximation (using Mexican hat as proxy for visualization)
      // Real Daubechies wavelets require FIR filter coefficients
      const daubechies_approx = (x: number, j: number, k: number): number => {
        const scale = Math.pow(2, j / 2);
        const shifted_x = Math.pow(2, j) * x - k;
        
        // Approximation using oscillating exponential decay
        const order_factor = wavelet_order / 4;
        const psi = Math.exp(-shifted_x * shifted_x / (2 * order_factor)) * 
                   Math.cos(Math.PI * shifted_x * order_factor) * scale;
        
        return psi;
      };

      // Multi-resolution wavelet decomposition
      let wavelet_sum = 0;
      for (let level = 0; level <= decomposition_levels; level++) {
        for (let k = -4; k <= 4; k++) {
          const coeff = amplitude * Math.exp(-0.1 * level) * 
                       Math.sin(level * Math.PI / decomposition_levels + k * 0.5 - t) / (level + 1);
          
          wavelet_sum += coeff * daubechies_approx(x, level, k);
        }
      }

      // Current scale visualization
      const current_scale = daubechies_approx(x, j, translation_k);

      return [x, j, wavelet_sum * 0.3 + current_scale * 0.5];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 3, f: 0, g: 1.0, h: 4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 32 }
  },

  biorthogonal_wavelet_001: {
    name: "🌊 BIORTHOGONAL-001: Biorthogonal Wavelet (bior3.5)",
    equation: (u: number, v: number, params: any) => {
      const decomp_order = Math.floor(params.d) || 3;   // Decomposition filter order
      const recon_order = Math.floor(params.e) || 5;    // Reconstruction filter order
      const scale = Math.floor(params.f) || 2;          // Dyadic scale 2^j
      const amplitude = params.g ?? 0.8;                // Amplitude
      const symmetry = params.h ?? 1.0;                 // Symmetry parameter
      const t = params.i ?? 0;                         // Time parameter

      const x = u * 10 - 5;
      const level = Math.floor(v * 4);

      // Biorthogonal scaling function (symmetric)
      const phi_bior = (x: number, order: number): number => {
        // B-spline approximation for biorthogonal scaling
        const t_shift = Math.abs(x);
        if (t_shift >= order) return 0;
        
        let bspline = 1;
        for (let k = 0; k < order; k++) {
          bspline *= Math.max(0, 1 - Math.abs(t_shift - k) / order);
        }
        return bspline;
      };

      // Biorthogonal wavelet function
      const psi_bior = (x: number, d_order: number, r_order: number): number => {
        // Difference of shifted scaling functions
        const phi_sum = phi_bior(x, d_order) - phi_bior(x - 1, d_order);
        return phi_sum * symmetry;
      };

      // Multi-scale decomposition
      let bior_decomp = 0;
      for (let j = 0; j <= 3; j++) {
        const scale_j = Math.pow(2, j);
        for (let k = -2; k <= 2; k++) {
          const coeff = amplitude * Math.exp(-0.2 * j) * 
                       Math.cos(j * Math.PI / 3 + k - t) / (j + 1);
          
          bior_decomp += coeff * psi_bior(scale_j * x - k, decomp_order, recon_order) / Math.sqrt(scale_j);
        }
      }

      // Perfect reconstruction visualization
      const reconstruction = phi_bior(x / Math.pow(2, level), recon_order);

      return [x, level * 0.5, bior_decomp + 0.3 * reconstruction];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 5, f: 2, g: 0.8, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 24 }
  },

  coiflet_wavelet_001: {
    name: "🌊 COIFLETS-001: Coiflet Wavelet Family",
    equation: (u: number, v: number, params: any) => {
      const coif_order = Math.floor(params.d) || 2;     // Coiflet order (coif1, coif2, ...)
      const vanishing_moments = params.e ?? 2;          // Vanishing moments
      const scale_param = params.f ?? 1.5;              // Scale parameter
      const amplitude = params.g ?? 1.0;                // Amplitude
      const detail_level = Math.floor(params.h) || 3;   // Detail coefficient level
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const j = Math.floor(v * 5);

      // Coiflet wavelet approximation
      // Coiflets have vanishing moments for both wavelet and scaling function
      const coiflet_psi = (x: number, N: number): number => {
        // Compact support [-3N+1, 3N-2]
        const support_width = 3 * N;
        if (Math.abs(x) > support_width) return 0;
        
        // Symmetric oscillating function with vanishing moments
        let psi = 0;
        for (let m = 0; m < N; m++) {
          const phase = Math.PI * (m + 1) * x / support_width;
          psi += Math.pow(-1, m) * Math.exp(-x * x / (2 * support_width)) * 
                Math.cos(phase);
        }
        
        return psi * Math.sqrt(support_width);
      };

      // Coiflet scaling function with vanishing moments
      const coiflet_phi = (x: number, N: number, moments: number): number => {
        const support = 3 * N - 1;
        if (Math.abs(x) > support) return 0;
        
        // Approximate with smooth function having required moments
        let phi = Math.exp(-x * x / (2 * support));
        
        // Enforce vanishing moments
        for (let k = 1; k <= moments; k++) {
          phi *= (1 - Math.pow(x / support, 2 * k));
        }
        
        return phi;
      };

      // Wavelet decomposition
      let coif_sum = 0;
      for (let level = 0; level <= detail_level; level++) {
        const s = Math.pow(2, level);
        const coeff = amplitude * Math.exp(-0.15 * level) * 
                     Math.sin(level * Math.PI / detail_level - t) / Math.sqrt(s);
        
        coif_sum += coeff * coiflet_psi((x * s) / scale_param, coif_order);
      }

      // Scaling function contribution
      const approx_coeff = coiflet_phi(x / Math.pow(2, j), coif_order, Math.floor(vanishing_moments));

      return [x, j * 0.4, coif_sum + 0.3 * approx_coeff];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 2, f: 1.5, g: 1.0, h: 3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 30 }
  },

  battle_lemarie_001: {
    name: "🌊 BATTLE-LEMARIE-001: Battle-Lemarié Wavelet",
    equation: (u: number, v: number, params: any) => {
      const spline_order = Math.floor(params.d) || 3;   // Cubic spline (order 3)
      const scale_j = Math.floor(params.e) || 2;        // Scale level
      const orthogonality = params.f ?? 1.0;            // Orthogonality parameter
      const amplitude = params.g ?? 0.9;                // Amplitude
      const frequency = params.h ?? 2.0;                // Frequency modulation
      const t = params.i ?? 0;                         // Time parameter

      const x = u * 8 - 4;
      const level = Math.floor(v * 4);

      // Battle-Lemarié scaling function (B-spline based)
      const bl_phi = (x: number, m: number): number => {
        // Centered B-spline of order m
        const support = (m + 1) / 2;
        if (Math.abs(x) > support) return 0;
        
        let N_m = 1;
        for (let k = 0; k <= m; k++) {
          const binom = 1; // Simplified binomial coefficient
          N_m *= Math.max(0, 1 - Math.abs(x + (m + 1)/2 - k) / support);
        }
        return N_m;
      };

      // Battle-Lemarié wavelet via finite differences
      const bl_psi = (x: number, m: number): number => {
        // Orthogonal wavelet from B-spline
        let psi = 0;
        for (let k = -m; k <= m; k++) {
          const h_k = Math.pow(-1, k) * Math.exp(-k * k / (2 * m)); // Filter coefficients
          psi += h_k * bl_phi(2 * x - k, m);
        }
        return psi * Math.sqrt(2);
      };

      // Multi-resolution analysis
      let bl_decomp = 0;
      for (let j = 0; j <= 3; j++) {
        const s = Math.pow(2, j);
        for (let k = -3; k <= 3; k++) {
          const coeff = amplitude * orthogonality * 
                       Math.exp(-0.1 * j * j) * 
                       Math.sin(frequency * (j + k) * Math.PI / 6 - t) / (j + 1);
          
          bl_decomp += coeff * bl_psi(s * x - k, spline_order) / Math.sqrt(s);
        }
      }

      // Scaling approximation at current level
      const scaling = bl_phi(x / Math.pow(2, level), spline_order) * 0.4;

      return [x, level * 0.5, bl_decomp + scaling];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 2, f: 1.0, g: 0.9, h: 2.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 32 }
  },

  mexican_hat_wavelet_001: {
    name: "🌊 MEXICAN-HAT-001: Ricker/Mexican Hat Wavelet",
    equation: (u: number, v: number, params: any) => {
      const sigma = params.d ?? 1.0;                    // Width parameter σ
      const scale_range = params.e ?? 3.0;              // Scale range
      const amplitude = params.f ?? 1.0;                // Amplitude
      const translation = params.g ?? 0;                // Translation
      const frequency_mod = params.h ?? 1.0;            // Frequency modulation
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const a = 0.1 + v * scale_range; // Continuous scale parameter

      // Mexican Hat wavelet: ψ(x) = (1 - x²/σ²) exp(-x²/2σ²)
      const mexican_hat = (x: number, scale: number, sig: number): number => {
        const x_scaled = (x - translation) / scale;
        const x_norm = x_scaled / sig;
        const gaussian = Math.exp(-x_norm * x_norm / 2);
        const second_derivative = (1 - x_norm * x_norm);
        
        return second_derivative * gaussian / Math.sqrt(scale);
      };

      // Continuous wavelet transform
      let cwt = 0;
      const signal_points = 32;
      for (let k = 0; k < signal_points; k++) {
        const x_k = (k / signal_points - 0.5) * 10;
        // Test signal (sum of sines with different frequencies)
        const signal_k = amplitude * (
          Math.sin(frequency_mod * x_k - t) + 
          0.5 * Math.sin(3 * frequency_mod * x_k - 2 * t)
        );
        
        const wavelet_k = mexican_hat(x - x_k, a, sigma);
        cwt += signal_k * wavelet_k / signal_points;
      }

      // Direct Mexican hat at current scale
      const direct_wavelet = mexican_hat(x, a, sigma);

      return [x, a, cwt + 0.5 * direct_wavelet];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 3.0, f: 1.0, g: 0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 80, vSegments: 40 }
  },

  meyer_wavelet_001: {
    name: "🌊 MEYER-001: Meyer Wavelet (Smooth Frequency Localized)",
    equation: (u: number, v: number, params: any) => {
      const frequency_bound = params.d ?? 2 * Math.PI / 3; // Frequency bound
      const smoothness = params.e ?? 1.0;                  // Smoothing parameter
      const scale = params.f ?? 1.0;                       // Scale
      const amplitude = params.g ?? 1.0;                   // Amplitude
      const decomp_levels = Math.floor(params.h) || 4;     // Decomposition levels
      const t = params.i ?? 0;                            // Time parameter

      const x = (u - 0.5) * 8;
      const j = Math.floor(v * decomp_levels);

      // Meyer auxiliary function ν(x)
      const meyer_nu = (x: number): number => {
        if (x <= 0) return 0;
        if (x >= 1) return 1;
        // Smooth transition: ν(x) = x⁴(35 - 84x + 70x² - 20x³)
        return x * x * x * x * (35 - 84 * x + 70 * x * x - 20 * x * x * x);
      };

      // Meyer wavelet in frequency domain (approximated in time)
      const meyer_psi = (x: number, omega_bound: number): number => {
        // Fourier synthesis approximation
        let psi_real = 0;
        let psi_imag = 0;
        
        const N_freq = 16;
        for (let n = -N_freq; n <= N_freq; n++) {
          const omega = n * Math.PI / 4;
          
          // Meyer frequency domain: |ψ̂(ω)| based on ν function
          let psi_hat = 0;
          const omega_abs = Math.abs(omega);
          
          if (omega_abs >= omega_bound && omega_abs <= 2 * omega_bound) {
            const arg = (omega_abs / omega_bound - 1);
            psi_hat = Math.sqrt(2) * Math.sin(Math.PI / 2 * meyer_nu(arg));
          } else if (omega_abs >= omega_bound / 2 && omega_abs < omega_bound) {
            const arg = (2 * omega_abs / omega_bound - 1);
            psi_hat = Math.sqrt(2) * Math.cos(Math.PI / 2 * meyer_nu(arg));
          }
          
          // Inverse Fourier transform
          psi_real += psi_hat * Math.cos(omega * x) / N_freq;
          psi_imag += psi_hat * Math.sin(omega * x) / N_freq;
        }
        
        return Math.sqrt(psi_real * psi_real + psi_imag * psi_imag);
      };

      // Multi-scale Meyer wavelet decomposition
      let meyer_sum = 0;
      for (let level = 0; level <= decomp_levels; level++) {
        const s = Math.pow(2, level);
        const omega_j = frequency_bound / s;
        
        const coeff = amplitude * smoothness * 
                     Math.exp(-0.1 * level) * 
                     Math.cos(level * Math.PI / decomp_levels - t) / Math.sqrt(s);
        
        meyer_sum += coeff * meyer_psi(x * s / scale, omega_j);
      }

      // Current scale wavelet
      const current_wavelet = meyer_psi(x / Math.pow(2, j) / scale, frequency_bound) * 0.4;

      return [x, j * 0.5, meyer_sum + current_wavelet];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2 * Math.PI / 3, e: 1.0, f: 1.0, g: 1.0, h: 4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 32 }
  },

  // ============================================================================
  // COMPUTATIONAL CHEMISTRY & BIOINFORMATICS ALGORITHMS
  // ============================================================================

  // NEEDLEMAN-WUNSCH GLOBAL ALIGNMENT - Dynamic Programming Surface
  needleman_wunsch_001: {
    name: "🧬 NEEDLEMAN-WUNSCH: Global DNA/Protein Alignment Matrix",
    equation: (u: number, v: number, params: any) => {
      const seq_length = params.d ?? 20;
      const gap_penalty = -1;
      const match_bonus = 2;
      const mismatch_penalty = -1;
      
      const i = Math.floor(u * seq_length);
      const j = Math.floor(v * seq_length);
      
      const match_score = Math.cos(i + j) > 0.3 ? match_bonus : mismatch_penalty;
      const diagonal = (i > 0 && j > 0) ? match_score : 0;
      const horizontal = i > 0 ? gap_penalty : 0;
      const vertical = j > 0 ? gap_penalty : 0;
      
      const dp_value = Math.max(diagonal, horizontal, vertical, 0);
      const alignment_path = Math.sin(u * Math.PI) * Math.sin(v * Math.PI) * 0.2;
      
      return [u * 4 - 2, v * 4 - 2, dp_value * 0.5 + alignment_path];
    },
    defaults: { a: 1, b: 1, c: 1, d: 20, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // SMITH-WATERMAN LOCAL ALIGNMENT - Subsequence Matching
  smith_waterman_001: {
    name: "🎯 SMITH-WATERMAN: Local Sequence Alignment Hotspots",
    equation: (u: number, v: number, params: any) => {
      const search_window = params.d ?? 10;
      const threshold = 3;
      const sensitivity = 2;
      const noise_level = 0.1;
      
      const center_u = 0.5;
      const center_v = 0.5;
      
      const dist_from_hotspot = Math.sqrt(
        Math.pow(u - center_u, 2) + Math.pow(v - center_v, 2)
      );
      
      const local_score = Math.max(0, threshold - dist_from_hotspot * search_window) * sensitivity;
      const background_pattern = Math.sin(u * 15) * Math.cos(v * 12) * noise_level;
      const alignment_strength = Math.exp(-dist_from_hotspot * 8);
      
      return [u * 6 - 3, v * 6 - 3, local_score + background_pattern + alignment_strength];
    },
    defaults: { a: 1, b: 1, c: 1, d: 10, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // BLAST HEURISTIC SEARCH - Seed-and-Extend Algorithm
  blast_search_001: {
    name: "🚀 BLAST: High-Speed Database Search Patterns",
    equation: (u: number, v: number, params: any) => {
      const word_size = params.d ?? 11;
      const extend_threshold = 40;
      const search_radius = 0.2;
      const hit_density = 8;
      
      const seed_x = Math.sin(u * hit_density) * 0.5 + 0.5;
      const seed_y = Math.cos(v * hit_density) * 0.5 + 0.5;
      
      const extension_wave = Math.exp(-Math.pow(u - seed_x, 2) / (2 * search_radius * search_radius)) *
                            Math.exp(-Math.pow(v - seed_y, 2) / (2 * search_radius * search_radius));
      
      const search_intensity = extension_wave * extend_threshold * 0.1;
      const database_structure = Math.sin(u * word_size) * Math.cos(v * word_size) * 0.3;
      
      return [u * 8 - 4, v * 8 - 4, search_intensity + database_structure];
    },
    defaults: { a: 1, b: 1, c: 1, d: 11, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // HIDDEN MARKOV MODELS - State Transition Visualization
  hidden_markov_001: {
    name: "🔄 HIDDEN MARKOV MODEL: Gene Prediction State Chains",
    equation: (u: number, v: number, params: any) => {
      const num_states = params.d ?? 5;
      const transition_prob = 0.7;
      const emission_var = 0.5;
      
      const state_u = Math.floor(u * num_states);
      const state_v = Math.floor(v * num_states);
      
      const state_value = Math.sin(state_u) * Math.cos(state_v);
      const transition_strength = Math.exp(-Math.abs(state_u - state_v) * (1 - transition_prob));
      
      const emission_pattern = Math.exp(-Math.pow(u - 0.5, 2) / emission_var) * 
                              Math.sin(v * Math.PI * 2);
      
      const markov_surface = state_value * transition_strength + emission_pattern * 0.5;
      
      return [u * 5 - 2.5, v * 5 - 2.5, markov_surface];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 25, vSegments: 25 }
  },

  // DE BRUIJN GRAPH ASSEMBLY - K-mer Graph Network
  debruijn_assembly_001: {
    name: "🧩 DE BRUIJN GRAPH: Genome Assembly K-mer Network",
    equation: (u: number, v: number, params: any) => {
      const k_mer_size = params.d ?? 7;
      const coverage = 30;
      const error_rate = 0.01;
      const graph_density = 12;
      
      const node_u = Math.sin(u * graph_density) * 0.4 + u;
      const node_v = Math.cos(v * graph_density) * 0.4 + v;
      
      const edge_strength = Math.exp(-Math.pow(node_u - u, 2) - Math.pow(node_v - v, 2)) * coverage * 0.1;
      const assembly_path = Math.sin(u * k_mer_size) * Math.cos(v * k_mer_size);
      
      const error_correction = (1 - error_rate) * Math.cos(u * 20) * Math.sin(v * 15) * 0.1;
      
      return [u * 6 - 3, v * 6 - 3, edge_strength + assembly_path + error_correction];
    },
    defaults: { a: 1, b: 1, c: 1, d: 7, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // MOLECULAR DYNAMICS - Atomic Motion Simulation
  molecular_dynamics_001: {
    name: "⚛️ MOLECULAR DYNAMICS: Protein Folding Simulation",
    equation: (u: number, v: number, params: any) => {
      const temperature = params.d ?? 300;
      const force_constant = 1000;
      const damping = 0.1;
      
      const atom_x = u + 0.1 * Math.sin(u * 10);
      const atom_y = v + 0.1 * Math.cos(v * 10);
      
      const lennard_jones = Math.pow(Math.max(0.01, atom_x - 0.5), -12) - 2 * Math.pow(Math.max(0.01, atom_x - 0.5), -6);
      const thermal_motion = Math.sqrt(temperature * 0.01) * Math.sin(u * 20) * 0.1;
      
      const folding_progress = Math.exp(-Math.pow(u - 0.5, 2) - Math.pow(v - 0.5, 2)) * 
                              Math.sin(u * Math.PI);
      
      return [atom_x * 4 - 2, atom_y * 4 - 2, 
              (lennard_jones * 0.01 + thermal_motion + folding_progress) * (1 - damping)];
    },
    defaults: { a: 1, b: 1, c: 1, d: 300, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // MONTE CARLO CONFORMATIONAL SAMPLING
  monte_carlo_sampling_001: {
    name: "🎲 MONTE CARLO: Conformational Space Exploration",
    equation: (u: number, v: number, params: any) => {
      const num_trials = params.d ?? 1000;
      const acceptance_ratio = 0.4;
      const energy_barrier = 5;
      const exploration_temp = 1;
      
      const energy_landscape = Math.sin(u * 6) * Math.cos(v * 6) * energy_barrier;
      const boltzmann_factor = Math.exp(-energy_landscape / exploration_temp);
      const acceptance_prob = Math.min(1, boltzmann_factor * acceptance_ratio);
      
      const sampling_intensity = acceptance_prob * Math.sin(u * num_trials * 0.01);
      
      return [u * 5 - 2.5, v * 5 - 2.5, sampling_intensity + energy_landscape * 0.2];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1000, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // DENSITY FUNCTIONAL THEORY - Electron Density Visualization
  dft_electron_density_001: {
    name: "🌊 DFT: Quantum Electron Density Surface",
    equation: (u: number, v: number, params: any) => {
      const orbital_energy = params.d ?? -13.6;
      const exchange_corr = 0.8;
      const basis_size = 20;
      
      const psi_1s = Math.exp(-Math.sqrt((u-0.3)*(u-0.3) + (v-0.5)*(v-0.5)) * 4);
      const psi_2p = (u-0.7) * Math.exp(-Math.sqrt((u-0.7)*(u-0.7) + (v-0.5)*(v-0.5)) * 2);
      
      const electron_density = psi_1s * psi_1s + psi_2p * psi_2p;
      
      const xc_potential = exchange_corr * Math.pow(Math.max(0.001, electron_density), 1/3);
      
      const scf_correction = Math.sin(u * basis_size) * Math.cos(v * basis_size) * 0.1;
      
      return [u * 4 - 2, v * 4 - 2, 
              (electron_density + xc_potential * 0.3 + scf_correction) * Math.abs(orbital_energy) * 0.1];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // FAST MULTIPOLE METHOD - Long-range Interaction Optimization
  fast_multipole_001: {
    name: "⚡ FAST MULTIPOLE: O(N) Electrostatic Interactions",
    equation: (u: number, v: number, params: any) => {
      const num_particles = params.d ?? 1000000;
      const multipole_order = 8;
      const box_size = 1.0;
      const cutoff_radius = 0.3;
      
      const tree_level = Math.floor(Math.log2(1 + u * multipole_order));
      const box_index = Math.floor(u * Math.pow(2, tree_level));
      
      const multipole_coeff = Math.sin(tree_level) * Math.cos(box_index);
      
      const distance = Math.sqrt(u*u + v*v);
      const interaction_type = distance < cutoff_radius ? 1 : 0;
      
      const complexity_reduction = Math.log(num_particles) / num_particles * 1000;
      const efficiency_surface = multipole_coeff * complexity_reduction * 
                                 (1 + interaction_type * Math.sin(u * 20));
      
      return [u * box_size * 4 - 2, v * box_size * 4 - 2, efficiency_surface];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1000000, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // ALPHAFOLD STRUCTURE PREDICTION - Deep Learning Architecture
  alphafold_prediction_001: {
    name: "🤖 ALPHAFOLD: AI Protein Structure Prediction",
    equation: (u: number, v: number, params: any) => {
      const sequence_length = params.d ?? 200;
      const attention_heads = 16;
      const confidence_score = 0.9;
      const msa_depth = 1000;
      
      const attention_pattern = Math.exp(-Math.pow(u - v, 2) * 4) * 
                               Math.sin(u * attention_heads) * 
                               Math.cos(v * attention_heads);
      
      const residue_i = Math.floor(u * sequence_length);
      const residue_j = Math.floor(v * sequence_length);
      const predicted_distance = Math.abs(residue_i - residue_j) + 
                                Math.sin((residue_i + residue_j) * 0.1) * 2;
      
      const structure_confidence = confidence_score * attention_pattern * 
                                  Math.exp(-predicted_distance * 0.1);
      
      const network_depth = Math.sin(u * 10) * Math.cos(v * 10) * Math.log(msa_depth) * 0.1;
      
      return [u * 6 - 3, v * 6 - 3, structure_confidence + network_depth];
    },
    defaults: { a: 1, b: 1, c: 1, d: 200, e: 1, f: 1, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 32, vSegments: 32 }
  },

  // CIRCULAR RIPPLE PROPAGATION - Water Wave Patterns
  circular_ripple_001: {
    name: "💧 RIPPLE-001: Basic Circular Ripple Pattern",
    equation: (u: number, v: number, params: any) => {
      const frequency = params.d ?? 5;                  // Wave frequency
      const amplitude = params.e ?? 1.0;                // Wave amplitude
      const decay_rate = params.f ?? 0.3;               // Radial decay
      const phase_velocity = params.g ?? 1.0;           // Phase velocity
      const num_sources = Math.floor(params.h) || 1;    // Number of sources
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;

      // Single source at origin
      const r = Math.sqrt(x * x + y * y);
      
      // Circular wave equation: u(r,t) = A/√r cos(kr - ωt)
      const k = frequency;
      const omega = phase_velocity * k;
      
      // Avoid singularity at r=0
      const r_safe = Math.max(r, 0.1);
      const geometric_spreading = 1 / Math.sqrt(r_safe);
      const decay = Math.exp(-decay_rate * r);
      
      const ripple = amplitude * geometric_spreading * decay * 
                    Math.cos(k * r - omega * t);

      return [x, y, ripple];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 1.0, f: 0.3, g: 1.0, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  bessel_ripple_001: {
    name: "💧 BESSEL-RIPPLE-001: Bessel Function Ripple (J₀)",
    equation: (u: number, v: number, params: any) => {
      const wavenumber = params.d ?? 3;                 // Wavenumber k
      const amplitude = params.e ?? 1.2;                // Amplitude
      const order = Math.floor(params.f) || 0;          // Bessel order n
      const time_freq = params.g ?? 1.0;                // Temporal frequency
      const modulation = params.h ?? 0.2;               // Amplitude modulation
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Bessel function J_n(kr) approximation using series
      const bessel_J = (n: number, z: number): number => {
        if (z === 0) return n === 0 ? 1 : 0;
        
        const MAX_ITER = 20;
        let sum = 0;
        
        for (let m = 0; m < MAX_ITER; m++) {
          const numerator = Math.pow(-1, m) * Math.pow(z / 2, 2 * m + n);
          
          // Factorial approximation
          let denom = 1;
          for (let k = 1; k <= m; k++) denom *= k;
          for (let k = 1; k <= m + n; k++) denom *= k;
          
          sum += numerator / denom;
        }
        
        return sum;
      };

      // Standing wave pattern: u(r,t) = A J_n(kr) cos(ωt)
      const kr = wavenumber * r;
      const J_n = bessel_J(order, kr);
      const temporal = Math.cos(time_freq * t);
      
      const bessel_ripple = amplitude * J_n * temporal * (1 + modulation * Math.sin(2 * t));

      return [x, y, bessel_ripple];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 1.2, f: 0, g: 1.0, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  multi_source_ripple_001: {
    name: "💧 MULTI-SOURCE-001: Multiple Source Interference",
    equation: (u: number, v: number, params: any) => {
      const n_sources = Math.floor(params.d) || 3;      // Number of sources
      const frequency = params.e ?? 4;                  // Wave frequency
      const amplitude = params.f ?? 0.8;                // Amplitude per source
      const source_radius = params.g ?? 3;              // Source distribution radius
      const decay = params.h ?? 0.2;                    // Decay rate
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Distribute sources in circular pattern
      let total_ripple = 0;
      
      for (let i = 0; i < n_sources; i++) {
        const angle = (2 * Math.PI * i) / n_sources;
        const x_source = source_radius * Math.cos(angle);
        const y_source = source_radius * Math.sin(angle);
        
        const dx = x - x_source;
        const dy = y - y_source;
        const r = Math.sqrt(dx * dx + dy * dy);
        const r_safe = Math.max(r, 0.1);
        
        // Each source creates circular waves
        const phase_offset = (i / n_sources) * Math.PI; // Phase difference
        const ripple_i = (amplitude / Math.sqrt(r_safe)) * 
                        Math.exp(-decay * r) * 
                        Math.cos(frequency * r - 2 * t + phase_offset);
        
        total_ripple += ripple_i;
      }

      // Normalize
      const normalized = total_ripple / Math.sqrt(n_sources);

      return [x, y, normalized];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 4, f: 0.8, g: 3, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  damped_ripple_001: {
    name: "💧 DAMPED-RIPPLE-001: Viscously Damped Ripple",
    equation: (u: number, v: number, params: any) => {
      const frequency = params.d ?? 6;                  // Spatial frequency
      const amplitude = params.e ?? 1.5;                // Initial amplitude
      const viscosity = params.f ?? 0.4;                // Viscous damping coefficient
      const dispersion = params.g ?? 0.1;               // Dispersion parameter
      const group_velocity = params.h ?? 0.8;           // Group velocity
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      const r = Math.sqrt(x * x + y * y);

      // Damped wave equation with viscosity
      // u(r,t) = A exp(-νt) exp(-αr) cos(kr - ωt)
      const k = frequency;
      const omega = Math.sqrt(k) * (1 + dispersion * k * k); // Dispersive relation
      
      const temporal_damping = Math.exp(-viscosity * t);
      const spatial_damping = Math.exp(-viscosity * r / 2);
      const geometric_decay = 1 / Math.sqrt(Math.max(r, 0.1));
      
      const damped_wave = amplitude * temporal_damping * spatial_damping * 
                         geometric_decay * Math.cos(k * r - omega * t);

      // Group velocity envelope
      const envelope = Math.exp(-Math.pow((r - group_velocity * t) / 2, 2));

      return [x, y, damped_wave * (0.7 + 0.3 * envelope)];
    },
    defaults: { a: 1, b: 1, c: 1, d: 6, e: 1.5, f: 0.4, g: 0.1, h: 0.8, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  power_law_decay_001: {
    name: "💧 POWER-DECAY-001: Power Law Decay Ripple",
    equation: (u: number, v: number, params: any) => {
      const frequency = params.d ?? 5;                  // Wave frequency
      const amplitude = params.e ?? 1.0;                // Amplitude
      const decay_exponent = params.f ?? 1.5;           // Power law exponent α
      const anisotropy = params.g ?? 0.3;               // Directional anisotropy
      const phase_velocity = params.h ?? 1.2;           // Phase velocity
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Power law decay: u ∝ r^(-α)
      const r_safe = Math.max(r, 0.1);
      const power_decay = Math.pow(r_safe, -decay_exponent);
      
      // Anisotropic propagation (directional dependency)
      const directional_factor = 1 + anisotropy * Math.cos(2 * theta);
      
      const k = frequency;
      const omega = phase_velocity * k;
      
      const ripple = amplitude * power_decay * directional_factor * 
                    Math.cos(k * r - omega * t);

      return [x, y, ripple];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 1.0, f: 1.5, g: 0.3, h: 1.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  bessel_j1_dipole_001: {
    name: "💧 BESSEL-J1-001: Bessel J₁ Dipole Pattern",
    equation: (u: number, v: number, params: any) => {
      const wavenumber = params.d ?? 4;                 // Wavenumber
      const amplitude = params.e ?? 1.0;                // Amplitude
      const dipole_strength = params.f ?? 1.5;          // Dipole moment
      const rotation = params.g ?? 0;                   // Dipole orientation
      const frequency = params.h ?? 1.0;                // Temporal frequency
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      
      // Rotate coordinates
      const x_rot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const y_rot = x * Math.sin(rotation) + y * Math.cos(rotation);
      
      const r = Math.sqrt(x_rot * x_rot + y_rot * y_rot);
      const theta = Math.atan2(y_rot, x_rot);

      // Bessel J₁ approximation
      const bessel_J1 = (z: number): number => {
        if (z === 0) return 0;
        
        const MAX_ITER = 15;
        let sum = 0;
        
        for (let m = 0; m < MAX_ITER; m++) {
          const term = Math.pow(-1, m) * Math.pow(z / 2, 2 * m + 1) / 
                      (factorial_approx(m) * factorial_approx(m + 1));
          sum += term;
        }
        
        return sum;
      };

      const factorial_approx = (n: number): number => {
        if (n <= 1) return 1;
        let f = 1;
        for (let i = 2; i <= n; i++) f *= i;
        return f;
      };

      // Dipole radiation pattern: u ∝ J₁(kr) cos(θ) cos(ωt)
      const kr = wavenumber * r;
      const J1 = bessel_J1(kr);
      const angular = Math.cos(theta); // Dipole pattern
      const temporal = Math.cos(frequency * t);
      
      const dipole_field = amplitude * dipole_strength * J1 * angular * temporal;

      return [x, y, dipole_field];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 1.0, f: 1.5, g: 0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  neumann_ripple_001: {
    name: "💧 NEUMANN-001: Neumann Function Ripple (Y₀)",
    equation: (u: number, v: number, params: any) => {
      const wavenumber = params.d ?? 3;                 // Wavenumber
      const amplitude = params.e ?? 0.5;                // Amplitude (reduced for Y₀)
      const cutoff_radius = params.f ?? 0.5;            // Inner cutoff radius
      const blend_factor = params.g ?? 0.8;             // J₀/Y₀ blend
      const frequency = params.h ?? 1.0;                // Temporal frequency
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      const r = Math.sqrt(x * x + y * y);

      // Bessel Y₀ (Neumann function) approximation
      const bessel_Y0 = (z: number): number => {
        if (z < cutoff_radius) {
          // Use J₀ near singularity
          return bessel_J0(z);
        }
        
        // Asymptotic approximation for Y₀(z)
        // Y₀(z) ≈ √(2/πz) sin(z - π/4) for large z
        const asymptotic = Math.sqrt(2 / (Math.PI * z)) * 
                          Math.sin(z - Math.PI / 4);
        
        // Near-field correction
        const near_field = (2 / Math.PI) * (Math.log(z / 2) + 0.5772); // Euler's constant
        
        // Blend based on radius
        const weight = Math.tanh((z - cutoff_radius) / 0.5);
        return asymptotic * weight + near_field * (1 - weight);
      };

      const bessel_J0 = (z: number): number => {
        let sum = 0;
        for (let m = 0; m < 15; m++) {
          const term = Math.pow(-1, m) * Math.pow(z / 2, 2 * m) / 
                      Math.pow(factorial_approx(m), 2);
          sum += term;
        }
        return sum;
      };

      const factorial_approx = (n: number): number => {
        if (n <= 1) return 1;
        let f = 1;
        for (let i = 2; i <= Math.min(n, 10); i++) f *= i;
        return f;
      };

      const kr = wavenumber * r;
      const Y0 = bessel_Y0(kr);
      const J0 = bessel_J0(kr);
      
      // Blend Bessel functions
      const combined = blend_factor * Y0 + (1 - blend_factor) * J0;
      const temporal = Math.cos(frequency * t);
      
      const neumann_ripple = amplitude * combined * temporal;

      return [x, y, neumann_ripple];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 0.5, f: 0.5, g: 0.8, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  hankel_transform_001: {
    name: "💧 HANKEL-001: Hankel Transform Representation",
    equation: (u: number, v: number, params: any) => {
      const max_frequency = params.d ?? 5;              // Maximum spatial frequency
      const amplitude = params.e ?? 1.0;                // Amplitude
      const spectrum_width = params.f ?? 2.0;           // Spectral width
      const phase_modulation = params.g ?? 0.5;         // Phase modulation
      const num_modes = Math.floor(params.h) || 16;     // Number of Hankel modes
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;
      const r = Math.sqrt(x * x + y * y);

      // Hankel transform: f(r) = ∫₀^∞ F(k) J₀(kr) k dk
      // Discrete approximation
      let hankel_sum = 0;
      
      for (let n = 0; n < num_modes; n++) {
        const k_n = (n + 1) * max_frequency / num_modes;
        
        // Spectral amplitude (Gaussian spectrum)
        const F_k = Math.exp(-Math.pow((k_n - max_frequency/2) / spectrum_width, 2));
        
        // Bessel J₀ approximation
        const kr = k_n * r;
        let J0 = 0;
        for (let m = 0; m < 10; m++) {
          const factorial_m = m <= 1 ? 1 : m * (m - 1);
          J0 += Math.pow(-1, m) * Math.pow(kr / 2, 2 * m) / 
               (factorial_m * factorial_m || 1);
        }
        
        // Time-dependent phase
        const omega_k = Math.sqrt(k_n);
        const phase = omega_k * t + phase_modulation * Math.sin(k_n);
        
        hankel_sum += F_k * J0 * k_n * Math.cos(phase) / num_modes;
      }

      const hankel_field = amplitude * hankel_sum;

      return [x, y, hankel_field];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 1.0, f: 2.0, g: 0.5, h: 16, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  // INTERFERENCE PATTERN ALGORITHMS
  superposition_001: {
    name: "🌈 SUPERPOSITION-001: Wave Superposition I₁(x,t) = A₁sin(k₁x - ω₁t) + A₂sin(k₂x - ω₂t)",
    equation: (u: number, v: number, params: any) => {
      const A1 = params.d ?? 1.0;                       // Amplitude 1
      const A2 = params.e ?? 0.8;                       // Amplitude 2
      const k1 = params.f ?? 5;                         // Wavenumber 1
      const k2 = params.g ?? 7;                         // Wavenumber 2
      const omega1 = params.h ?? 3;                     // Angular frequency 1
      const omega2 = params.i ?? 4;                     // Angular frequency 2
      const t = params.g ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = v * 2 - 1;

      // I₁(x,t) = A₁sin(k₁x - ω₁t) + A₂sin(k₂x - ω₂t)
      const wave1 = A1 * Math.sin(k1 * x - omega1 * t);
      const wave2 = A2 * Math.sin(k2 * x - omega2 * t);
      const superposition = wave1 + wave2;

      return [x, y, superposition];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 0.8, f: 5, g: 7, h: 3, i: 4, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 40 }
  },

  beat_pattern_001: {
    name: "🌈 BEAT-PATTERN-001: Beat Waves I₂(x,t) = 2A cos(Dk x/2) sin(k̄x - ω̄t)",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;                        // Amplitude
      const k1 = params.e ?? 8;                         // Wavenumber 1
      const k2 = params.f ?? 10;                        // Wavenumber 2
      const omega1 = params.g ?? 5;                     // Angular frequency 1
      const omega2 = params.h ?? 6;                     // Angular frequency 2
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = v * 2 - 1;

      // Beat parameters
      const delta_k = k1 - k2;                          // Dk
      const k_bar = (k1 + k2) / 2;                      // k̄
      const omega_bar = (omega1 + omega2) / 2;          // ω̄

      // I₂(x,t) = 2A cos(Dk x/2) sin(k̄x - ω̄t)
      const envelope = 2 * A * Math.cos(delta_k * x / 2);
      const carrier = Math.sin(k_bar * x - omega_bar * t);
      const beat_wave = envelope * carrier;

      return [x, y, beat_wave];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 8, f: 10, g: 5, h: 6, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 40 }
  },

  standing_wave_001: {
    name: "🌈 STANDING-WAVE-001: 1D Standing Wave I₃(x,t) = A sin(kx) cos(ωt)",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.2;                        // Amplitude
      const k = params.e ?? 4;                          // Wavenumber
      const omega = params.f ?? 2;                      // Angular frequency
      const num_modes = Math.floor(params.g) || 1;      // Number of modes
      const phase_shift = params.h ?? 0;                // Phase shift
      const t = params.i ?? 0;                         // Time parameter

      const x = u * 2 * Math.PI;
      const y = v * 2 - 1;

      // I₃(x,t) = A sin(kx) cos(ωt)
      const spatial = A * Math.sin(k * x + phase_shift);
      const temporal = Math.cos(omega * t);
      const standing_wave = spatial * temporal;

      return [x, y, standing_wave];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.2, e: 4, f: 2, g: 1, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 40 }
  },

  standing_2d_001: {
    name: "🌈 2D-STANDING-001: 2D Standing Wave I₄(x,y,t) = sin(kₓx)sin(kᵧy)cos(ωt)",
    equation: (u: number, v: number, params: any) => {
      const kx = params.d ?? 3;                         // x wavenumber
      const ky = params.e ?? 4;                         // y wavenumber
      const omega = params.f ?? 2;                      // Angular frequency
      const amplitude = params.g ?? 1.0;                // Amplitude
      const mode_x = Math.floor(params.h) || 1;         // x mode number
      const mode_y = Math.floor(params.i) || 1;         // y mode number
      const t = params.g ?? 0;                         // Time parameter

      const x = u * Math.PI * 2;
      const y = v * Math.PI * 2;

      // I₄(x,y,t) = sin(kₓx)sin(kᵧy)cos(ωt)
      const spatial_x = Math.sin(kx * mode_x * x);
      const spatial_y = Math.sin(ky * mode_y * y);
      const temporal = Math.cos(omega * t);
      const standing_2d = amplitude * spatial_x * spatial_y * temporal;

      return [x, y, standing_2d];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 4, f: 2, g: 1.0, h: 1, i: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 100, vSegments: 100 }
  },

  young_double_slit_001: {
    name: "🌈 YOUNG-DOUBLE-001: Young's Double Slit I₅(x,y) = |A₁e^(ik₁r₁) + A₂e^(ik₂r₂)|²",
    equation: (u: number, v: number, params: any) => {
      const A1 = params.d ?? 1.0;                       // Amplitude source 1
      const A2 = params.e ?? 1.0;                       // Amplitude source 2
      const k = params.f ?? 15;                         // Wavenumber
      const slit_separation = params.g ?? 2;            // Slit separation distance
      const wavelength = params.h ?? 0.5;               // Wavelength
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Two slit positions
      const y1 = slit_separation / 2;
      const y2 = -slit_separation / 2;

      // Distances from each slit
      const r1 = Math.sqrt(x * x + (y - y1) * (y - y1));
      const r2 = Math.sqrt(x * x + (y - y2) * (y - y2));

      // Complex amplitudes: A₁e^(ik₁r₁) + A₂e^(ik₂r₂)
      const phase1 = k * r1 - 2 * Math.PI * t;
      const phase2 = k * r2 - 2 * Math.PI * t;

      const real = A1 * Math.cos(phase1) + A2 * Math.cos(phase2);
      const imag = A1 * Math.sin(phase1) + A2 * Math.sin(phase2);

      // I₅(x,y) = |A₁e^(ik₁r₁) + A₂e^(ik₂r₂)|²
      const intensity = real * real + imag * imag;

      return [x, y, Math.sqrt(intensity)];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 1.0, f: 15, g: 2, h: 0.5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  lloyds_mirror_001: {
    name: "🌈 LLOYDS-001: Lloyd's Mirror Interference",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;                        // Source amplitude
      const k = params.e ?? 10;                         // Wavenumber
      const source_height = params.f ?? 3;              // Source height above mirror
      const mirror_reflection = params.g ?? -1.0;       // Mirror reflection coefficient
      const phase_shift = params.h ?? Math.PI;          // Phase shift on reflection
      const t = params.i ?? 0;                         // Time parameter

      const x = u * 15;
      const y = (v - 0.5) * 10;

      // Source position
      const x_source = 0;
      const y_source = source_height;

      // Direct wave from source
      const r_direct = Math.sqrt((x - x_source) ** 2 + (y - y_source) ** 2);
      const phase_direct = k * r_direct - 2 * Math.PI * t;

      // Virtual image (mirror reflection)
      const y_virtual = -source_height;
      const r_reflected = Math.sqrt((x - x_source) ** 2 + (y - y_virtual) ** 2);
      const phase_reflected = k * r_reflected - 2 * Math.PI * t + phase_shift;

      // Interference pattern
      const direct = A * Math.cos(phase_direct) / Math.sqrt(r_direct + 1);
      const reflected = mirror_reflection * A * Math.cos(phase_reflected) / Math.sqrt(r_reflected + 1);

      const lloyds = direct + reflected;

      return [x, y, lloyds];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 10, f: 3, g: -1.0, h: Math.PI, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 100 }
  },

  fresnel_double_mirror_001: {
    name: "🌈 FRESNEL-DOUBLE-001: Fresnel Double Mirror",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;                        // Amplitude
      const k = params.e ?? 12;                         // Wavenumber
      const mirror_angle = params.f ?? 0.1;             // Mirror angle (radians)
      const source_distance = params.g ?? 5;            // Source distance
      const coherence = params.h ?? 0.9;                // Coherence factor
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Two virtual sources from mirror reflections
      const x1 = -source_distance * Math.sin(mirror_angle);
      const y1 = source_distance * Math.cos(mirror_angle);
      const x2 = source_distance * Math.sin(mirror_angle);
      const y2 = source_distance * Math.cos(mirror_angle);

      // Distances
      const r1 = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
      const r2 = Math.sqrt((x - x2) ** 2 + (y - y2) ** 2);

      // Phases
      const phi1 = k * r1 - 2 * Math.PI * t;
      const phi2 = k * r2 - 2 * Math.PI * t;

      // Fresnel double mirror interference
      const wave1 = A * Math.cos(phi1) / Math.sqrt(r1 + 1);
      const wave2 = coherence * A * Math.cos(phi2) / Math.sqrt(r2 + 1);

      return [x, y, wave1 + wave2];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 12, f: 0.1, g: 5, h: 0.9, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  michelson_interferometer_001: {
    name: "🌈 MICHELSON-001: Michelson Interferometer",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;                        // Beam amplitude
      const k = params.e ?? 20;                         // Wavenumber
      const path_diff = params.f ?? 0.5;                // Path difference
      const tilt_x = params.g ?? 0.05;                  // Mirror tilt in x
      const tilt_y = params.h ?? 0.03;                  // Mirror tilt in y
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 10;
      const y = (v - 0.5) * 10;

      // Beam from arm 1 (reference)
      const phase1 = -2 * Math.PI * t;

      // Beam from arm 2 (with path difference and tilt)
      const optical_path = path_diff + tilt_x * x + tilt_y * y;
      const phase2 = k * optical_path - 2 * Math.PI * t;

      // Interference
      const beam1 = A * Math.cos(phase1);
      const beam2 = A * Math.cos(phase2);

      // Intensity pattern
      const intensity = (beam1 + beam2) ** 2;

      return [x, y, Math.sqrt(intensity) - 1];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 20, f: 0.5, g: 0.05, h: 0.03, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  mach_zehnder_001: {
    name: "🌈 MACH-ZEHNDER-001: Mach-Zehnder Interferometer",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 1.0;                        // Input amplitude
      const k = params.e ?? 15;                         // Wavenumber
      const phase_modulation = params.f ?? 0;           // Phase modulation
      const splitting_ratio = params.g ?? 0.5;          // Beam splitter ratio
      const arm_length_diff = params.h ?? 1.0;          // Arm length difference
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Split amplitudes
      const A1 = A * Math.sqrt(splitting_ratio);
      const A2 = A * Math.sqrt(1 - splitting_ratio);

      // Arm 1 (reference arm)
      const phase1 = -2 * Math.PI * t;

      // Arm 2 (with phase modulation and path difference)
      const phase2 = k * arm_length_diff + phase_modulation * Math.sin(x) - 2 * Math.PI * t;

      // Recombination
      const E1 = A1 * Math.exp(0); // Reference
      const E2_real = A2 * Math.cos(phase2);
      const E2_imag = A2 * Math.sin(phase2);

      // Total field
      const E_real = A1 * Math.cos(phase1) + E2_real;
      const E_imag = A1 * Math.sin(phase1) + E2_imag;

      const mach_zehnder = Math.sqrt(E_real ** 2 + E_imag ** 2);

      return [x, y, mach_zehnder];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 15, f: 0, g: 0.5, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  fabry_perot_001: {
    name: "🌈 FABRY-PEROT-001: Fabry-Pérot Etalon",
    equation: (u: number, v: number, params: any) => {
      const finesse = params.d ?? 20;                   // Finesse F
      const FSR = params.e ?? 1.0;                      // Free spectral range
      const cavity_length = params.f ?? 5;              // Cavity length
      const reflectivity = params.g ?? 0.9;             // Mirror reflectivity R
      const incident_angle = params.h ?? 0;             // Incident angle
      const t = params.i ?? 0;                         // Time parameter

      const freq = u * 3;  // Frequency axis
      const y = v * 2 - 1;

      // Phase difference δ = 4πnL/λ
      const wavelength = FSR / freq;
      const delta = (4 * Math.PI * cavity_length) / (wavelength + 0.1) + 
                   incident_angle * Math.sin(2 * Math.PI * t);

      // Airy function transmission
      const F_coeff = (4 * reflectivity) / ((1 - reflectivity) ** 2);
      const denominator = 1 + F_coeff * Math.sin(delta / 2) ** 2;
      const transmission = 1 / denominator;

      // Fabry-Pérot resonances
      const fabry_perot = transmission * finesse / 10;

      return [freq, y, fabry_perot];
    },
    defaults: { a: 1, b: 1, c: 1, d: 20, e: 1.0, f: 5, g: 0.9, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 40 }
  },

  // MOIRÉ AND PATTERN GENERATION
  moire_001: {
    name: "🎨 MOIRE-001: Basic Moiré M₁(x,y) = sin(k₁x) × sin(k₂x + α)",
    equation: (u: number, v: number, params: any) => {
      const k1 = params.d ?? 10;                        // First frequency
      const k2 = params.e ?? 11;                        // Second frequency
      const alpha = params.f ?? 0.3;                    // Phase offset
      const amplitude = params.g ?? 1.0;                // Amplitude
      const rotation = params.h ?? 0;                   // Pattern rotation
      const t = params.i ?? 0;                         // Time parameter

      const x_raw = (u - 0.5) * 15;
      const y_raw = (v - 0.5) * 15;

      // Rotate
      const x = x_raw * Math.cos(rotation) - y_raw * Math.sin(rotation);
      const y = x_raw * Math.sin(rotation) + y_raw * Math.cos(rotation);

      // M₁(x,y) = sin(k₁x) × sin(k₂x + α)
      const pattern1 = Math.sin(k1 * x + t);
      const pattern2 = Math.sin(k2 * x + alpha + t);
      const moire = amplitude * pattern1 * pattern2;

      return [x_raw, y_raw, moire];
    },
    defaults: { a: 1, b: 1, c: 1, d: 10, e: 11, f: 0.3, g: 1.0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  moire_2d_001: {
    name: "🎨 2D-MOIRE-001: 2D Moiré M₂(x,y) = cos(k₁x + k₂y) × cos(k₃x + k₄y)",
    equation: (u: number, v: number, params: any) => {
      const k1 = params.d ?? 8;                         // First x frequency
      const k2 = params.e ?? 6;                         // First y frequency
      const k3 = params.f ?? 9;                         // Second x frequency
      const k4 = params.g ?? 7;                         // Second y frequency
      const amplitude = params.h ?? 1.0;                // Amplitude
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // M₂(x,y) = cos(k₁x + k₂y) × cos(k₃x + k₄y)
      const grating1 = Math.cos(k1 * x + k2 * y + t);
      const grating2 = Math.cos(k3 * x + k4 * y - t);
      const moire_2d = amplitude * grating1 * grating2;

      return [x, y, moire_2d];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 6, f: 9, g: 7, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  radial_moire_001: {
    name: "🎨 RADIAL-PATTERN-001: Radial Moiré M₃(r,θ) = sin(mrθ) × sin(kr)",
    equation: (u: number, v: number, params: any) => {
      const m = Math.floor(params.d) || 12;             // Angular frequency
      const k = params.e ?? 5;                          // Radial frequency
      const amplitude = params.f ?? 1.0;                // Amplitude
      const phase_r = params.g ?? 0;                    // Radial phase
      const phase_theta = params.h ?? 0;                // Angular phase
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // M₃(r,θ) = sin(mrθ) × sin(kr)
      const angular = Math.sin(m * theta + phase_theta + t);
      const radial = Math.sin(k * r + phase_r);
      const radial_moire = amplitude * angular * radial;

      return [x, y, radial_moire];
    },
    defaults: { a: 1, b: 1, c: 1, d: 12, e: 5, f: 1.0, g: 0, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  aliasing_pattern_001: {
    name: "🎨 ALIASING-001: Aliasing Patterns M₄(x,y)",
    equation: (u: number, v: number, params: any) => {
      const sampling_freq = params.d ?? 20;             // Sampling frequency
      const signal_freq = params.e ?? 45;               // Signal frequency
      const amplitude = params.f ?? 1.0;                // Amplitude
      const nyquist_ratio = params.g ?? 2.5;            // Nyquist ratio
      const pattern_type = Math.floor(params.h) || 0;   // Pattern type
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Continuous signal
      const continuous = Math.sin(signal_freq * x - 2 * Math.PI * t);

      // Sampled signal (creates aliasing when signal_freq > nyquist)
      const nyquist = sampling_freq / 2;
      const aliased_freq = signal_freq > nyquist ? 
        Math.abs(signal_freq - sampling_freq * Math.round(signal_freq / sampling_freq)) : 
        signal_freq;

      const sampled = Math.sin(aliased_freq * x - 2 * Math.PI * t);

      // Sampling function (Dirac comb approximation)
      const comb = Math.sin(sampling_freq * Math.PI * x) > 0.9 ? 1 : 0;

      // Aliasing pattern
      const aliasing = amplitude * (continuous * 0.3 + sampled * 0.7) * (0.5 + 0.5 * comb);

      return [x, y, aliasing];
    },
    defaults: { a: 1, b: 1, c: 1, d: 20, e: 45, f: 1.0, g: 2.5, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 64 }
  },

  beat_frequency_pattern_001: {
    name: "🎨 BEAT-FREQ-001: Beat Frequency Patterns M₅(x,y)",
    equation: (u: number, v: number, params: any) => {
      const f1 = params.d ?? 15;                        // Frequency 1
      const f2 = params.e ?? 16;                        // Frequency 2
      const amplitude = params.f ?? 1.0;                // Amplitude
      const directional_angle = params.g ?? 0.785;      // π/4
      const modulation = params.h ?? 0.5;               // Modulation depth
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 20;
      const y = (v - 0.5) * 20;

      // Beat frequency components
      const f_beat = Math.abs(f1 - f2);
      const f_avg = (f1 + f2) / 2;

      // Directional propagation
      const x_dir = x * Math.cos(directional_angle) + y * Math.sin(directional_angle);

      // M₅(x,y) = beat frequency pattern
      const carrier = Math.sin(2 * Math.PI * f_avg * x_dir / 10 - t);
      const envelope = Math.cos(2 * Math.PI * f_beat * x_dir / 10);
      const beat_pattern = amplitude * carrier * (1 + modulation * envelope);

      return [x, y, beat_pattern];
    },
    defaults: { a: 1, b: 1, c: 1, d: 15, e: 16, f: 1.0, g: 0.785, h: 0.5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  chirp_interference_001: {
    name: "🎨 CHIRP-INTERFERENCE-001: Chirp Interference M₆(x,y)",
    equation: (u: number, v: number, params: any) => {
      const f0 = params.d ?? 5;                         // Starting frequency
      const chirp_rate = params.e ?? 3;                 // Frequency sweep rate
      const amplitude = params.f ?? 1.0;                // Amplitude
      const interference_angle = params.g ?? Math.PI/6; // Interference angle
      const sweep_direction = params.h ?? 1;            // Sweep direction
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;
      const r = Math.sqrt(x * x + y * y);

      // Linear chirp: f(x) = f₀ + βx
      const freq_chirp1 = f0 + chirp_rate * x * sweep_direction;
      const chirp1 = Math.sin(2 * Math.PI * freq_chirp1 * x / 10 - t);

      // Interference pattern from angled chirp
      const x_rot = x * Math.cos(interference_angle) - y * Math.sin(interference_angle);
      const freq_chirp2 = f0 + chirp_rate * x_rot;
      const chirp2 = Math.sin(2 * Math.PI * freq_chirp2 * x_rot / 10 + t);

      // M₆(x,y) = chirp interference
      const chirp_interference = amplitude * (chirp1 + chirp2) / 2;

      return [x, y, chirp_interference];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 3, f: 1.0, g: Math.PI/6, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  // GEOMETRIC PATTERNS
  tessellation_001: {
    name: "🔶 TESSELLATION-001: Regular Tessellation Pattern GP₁",
    equation: (u: number, v: number, params: any) => {
      const pattern_type = Math.floor(params.d) || 3;  // 3=triangular, 4=square, 6=hexagonal
      const scale = params.e ?? 2;                      // Pattern scale
      const amplitude = params.f ?? 0.5;                // Height variation
      const rotation = params.g ?? 0;                   // Pattern rotation
      const depth_mod = params.h ?? 0.3;                // Depth modulation
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Rotate coordinates
      const x_rot = x * Math.cos(rotation) - y * Math.sin(rotation);
      const y_rot = x * Math.sin(rotation) + y * Math.cos(rotation);

      // Generate tessellation based on pattern type
      let tess_z = 0;
      if (pattern_type === 3) {
        // Triangular tessellation
        tess_z = amplitude * (Math.sin(x_rot * scale) + Math.sin(-0.5 * x_rot * scale + Math.sqrt(3)/2 * y_rot * scale) + 
                             Math.sin(-0.5 * x_rot * scale - Math.sqrt(3)/2 * y_rot * scale));
      } else if (pattern_type === 4) {
        // Square tessellation
        tess_z = amplitude * Math.sin(x_rot * scale) * Math.sin(y_rot * scale);
      } else {
        // Hexagonal tessellation
        const hex1 = Math.sin(x_rot * scale);
        const hex2 = Math.sin(-0.5 * x_rot * scale + Math.sqrt(3)/2 * y_rot * scale);
        const hex3 = Math.sin(-0.5 * x_rot * scale - Math.sqrt(3)/2 * y_rot * scale);
        tess_z = amplitude * (hex1 + hex2 + hex3) / 3;
      }

      tess_z += depth_mod * Math.cos(2 * t);

      return [x, y, tess_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 6, e: 2, f: 0.5, g: 0, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  islamic_pattern_001: {
    name: "🕌 ISLAMIC-001: Islamic Geometric Pattern GP₂",
    equation: (u: number, v: number, params: any) => {
      const symmetry = Math.floor(params.d) || 8;       // Rotational symmetry
      const star_points = Math.floor(params.e) || 12;   // Star points
      const amplitude = params.f ?? 0.6;                // Pattern amplitude
      const interlace = params.g ?? 3;                  // Interlacing frequency
      const detail = params.h ?? 2;                     // Detail level
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Islamic star pattern with rotational symmetry
      const star_pattern = Math.sin(star_points * theta + t);
      const radial_pattern = Math.cos(symmetry * r);
      const interlacing = Math.sin(interlace * r + symmetry * theta);
      
      // Layered geometric pattern
      const pattern_z = amplitude * (
        0.4 * star_pattern * radial_pattern +
        0.3 * interlacing +
        0.3 * Math.sin(detail * theta) * Math.cos(detail * r)
      );

      return [x, y, pattern_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 12, f: 0.6, g: 3, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  celtic_knot_001: {
    name: "🍀 CELTIC-001: Celtic Knot Pattern GP₃",
    equation: (u: number, v: number, params: any) => {
      const knot_frequency = params.d ?? 4;             // Knot frequency
      const amplitude = params.e ?? 0.8;                // Knot amplitude
      const weave_density = params.f ?? 3;              // Weave density
      const strand_width = params.g ?? 0.5;             // Strand width
      const depth = params.h ?? 0.3;                    // Depth variation
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Celtic interlacing pattern
      const knot_x = Math.sin(knot_frequency * x) * Math.cos(weave_density * y);
      const knot_y = Math.cos(weave_density * x) * Math.sin(knot_frequency * y);
      
      // Create over-under weaving effect
      const weave = Math.sin(knot_x * 5 + t) > Math.cos(knot_y * 5 - t) ? 1 : -1;
      
      // Strand modulation
      const strand = Math.exp(-Math.pow((knot_x - knot_y) / strand_width, 2));
      
      const celtic_z = amplitude * weave * strand + depth * Math.sin(2 * t);

      return [x, y, celtic_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0.8, f: 3, g: 0.5, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  penrose_tiling_001: {
    name: "🔸 PENROSE-001: Penrose Aperiodic Tiling GP₄",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;                      // Pattern scale
      const amplitude = params.e ?? 0.5;                // Height amplitude
      const phi = (1 + Math.sqrt(5)) / 2;               // Golden ratio
      const rotation_angle = params.f ?? 0;             // Rotation
      const modulation = params.g ?? 0.2;               // Modulation factor
      const t = params.h ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Penrose tiling uses golden ratio for aperiodic pattern
      const angle1 = Math.atan2(y, x);
      const angle2 = angle1 + 2 * Math.PI / 5;
      const angle3 = angle1 + 4 * Math.PI / 5;
      
      const r = Math.sqrt(x * x + y * y);
      
      // Rhombus pattern with golden ratio
      const pattern1 = Math.sin(scale * r * Math.cos(5 * angle1) / phi);
      const pattern2 = Math.sin(scale * r * Math.cos(5 * angle2) / phi);
      const pattern3 = Math.sin(scale * r * Math.cos(5 * angle3) / phi);
      
      const penrose_z = amplitude * (pattern1 + pattern2 + pattern3) / 3 + 
                       modulation * Math.cos(r + t);

      return [x, y, penrose_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 2, e: 0.5, f: 0, g: 0.2, h: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  voronoi_diagram_001: {
    name: "🔷 VORONOI-DIAGRAM-001: Voronoi Cellular Pattern GP₅",
    equation: (u: number, v: number, params: any) => {
      const num_cells = Math.floor(params.d) || 12;    // Number of cells
      const amplitude = params.e ?? 1.0;                // Height amplitude
      const smoothness = params.f ?? 0.5;               // Edge smoothness
      const seed = params.g ?? 42;                      // Random seed
      const animation = params.h ?? 0.3;                // Animation factor
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Generate pseudo-random cell centers
      const random = (i: number) => {
        const val = Math.sin(i * 12.9898 + seed) * 43758.5453;
        return val - Math.floor(val);
      };

      let min_dist = Infinity;
      let second_dist = Infinity;

      // Find two closest cell centers
      for (let i = 0; i < num_cells; i++) {
        const cx = (random(i * 2) - 0.5) * 12 + animation * Math.sin(t + i);
        const cy = (random(i * 2 + 1) - 0.5) * 12 + animation * Math.cos(t + i);
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        
        if (dist < min_dist) {
          second_dist = min_dist;
          min_dist = dist;
        } else if (dist < second_dist) {
          second_dist = dist;
        }
      }

      // Voronoi cell edge detection
      const edge_dist = second_dist - min_dist;
      const voronoi_z = amplitude * Math.exp(-edge_dist / smoothness);

      return [x, y, voronoi_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 12, e: 1.0, f: 0.5, g: 42, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  delaunay_triangulation_001: {
    name: "🔺 DELAUNAY-001: Delaunay Triangulation GP₆",
    equation: (u: number, v: number, params: any) => {
      const num_points = Math.floor(params.d) || 10;   // Number of vertices
      const amplitude = params.e ?? 0.8;                // Height variation
      const seed = params.f ?? 42;                      // Random seed
      const edge_emphasis = params.g ?? 2;              // Edge emphasis
      const smoothing = params.h ?? 0.4;                // Smoothing factor
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      const random = (i: number) => {
        const val = Math.sin(i * 12.9898 + seed) * 43758.5453;
        return val - Math.floor(val);
      };

      // Find closest three points (approximate Delaunay)
      const distances: number[] = [];
      for (let i = 0; i < num_points; i++) {
        const px = (random(i * 2) - 0.5) * 10;
        const py = (random(i * 2 + 1) - 0.5) * 10;
        const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
        distances.push(dist);
      }

      distances.sort((a, b) => a - b);
      const triangle_func = Math.exp(-distances[0] / smoothing) + 
                           Math.exp(-distances[1] / smoothing) + 
                           Math.exp(-distances[2] / smoothing);
      
      const delaunay_z = amplitude * triangle_func / 3 + 
                        (amplitude / edge_emphasis) * Math.sin(t);

      return [x, y, delaunay_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 10, e: 0.8, f: 42, g: 2, h: 0.4, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  maze_generation_001: {
    name: "🌀 MAZE-001: Procedural Maze Pattern GP₇",
    equation: (u: number, v: number, params: any) => {
      const grid_size = Math.floor(params.d) || 8;     // Maze grid size
      const amplitude = params.e ?? 1.0;                // Wall height
      const wall_thickness = params.f ?? 0.3;           // Wall thickness
      const seed = params.g ?? 42;                      // Random seed
      const complexity = params.h ?? 0.5;               // Maze complexity
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Grid position
      const grid_x = Math.floor(x + 6) % grid_size;
      const grid_y = Math.floor(y + 6) % grid_size;
      
      // Pseudo-random maze generation
      const random = (gx: number, gy: number) => {
        const val = Math.sin(gx * 127.1 + gy * 311.7 + seed) * 43758.5453;
        return val - Math.floor(val);
      };

      const has_wall = random(grid_x, grid_y) < complexity;
      
      // Wall distance function
      const fx = Math.abs((x + 6) % 1 - 0.5);
      const fy = Math.abs((y + 6) % 1 - 0.5);
      const wall_dist = Math.min(fx, fy);
      
      const is_wall = wall_dist < wall_thickness && has_wall;
      const maze_z = is_wall ? amplitude : 0.1 * Math.sin(t);

      return [x, y, maze_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 1.0, f: 0.3, g: 42, h: 0.5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  truchet_tiles_001: {
    name: "🎲 TRUCHET-001: Truchet Tile Pattern GP₈",
    equation: (u: number, v: number, params: any) => {
      const grid_size = params.d ?? 5;                  // Tile grid size
      const amplitude = params.e ?? 0.8;                // Pattern amplitude
      const tile_type = Math.floor(params.f) || 0;     // Tile type (0-3)
      const seed = params.g ?? 42;                      // Random seed
      const smoothness = params.h ?? 0.1;               // Edge smoothness
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Grid coordinates
      const gx = Math.floor(x * grid_size / 15 + 0.5);
      const gy = Math.floor(y * grid_size / 15 + 0.5);
      
      // Local tile coordinates
      const tx = (x * grid_size / 15) - gx;
      const ty = (y * grid_size / 15) - gy;

      // Pseudo-random tile rotation
      const random = (i: number, j: number) => {
        const val = Math.sin(i * 12.9898 + j * 78.233 + seed) * 43758.5453;
        return Math.floor((val - Math.floor(val)) * 4);
      };

      const rotation = random(gx, gy);
      
      // Rotate tile coordinates
      let rtx = tx, rty = ty;
      for (let r = 0; r < rotation; r++) {
        const temp = rtx;
        rtx = -rty;
        rty = temp;
      }

      // Truchet pattern (diagonal arc)
      const arc_dist = Math.abs(Math.sqrt(rtx * rtx + rty * rty) - 0.5);
      const truchet_z = amplitude * Math.exp(-arc_dist / smoothness) * Math.cos(t);

      return [x, y, truchet_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 0.8, f: 0, g: 42, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  aperiodic_tiling_001: {
    name: "🔶 APERIODIC-001: Aperiodic Tiling Pattern GP₉",
    equation: (u: number, v: number, params: any) => {
      const frequency1 = params.d ?? 3;                 // First frequency
      const frequency2 = params.e ?? Math.sqrt(5);      // Second frequency (irrational)
      const amplitude = params.f ?? 0.6;                // Pattern amplitude
      const phase_shift = params.g ?? 0;                // Phase shift
      const modulation = params.h ?? 0.3;               // Modulation depth
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Aperiodic pattern using irrational ratio
      const pattern1 = Math.sin(frequency1 * x + phase_shift);
      const pattern2 = Math.sin(frequency2 * x * Math.sqrt(2));
      const pattern3 = Math.sin(frequency1 * y);
      const pattern4 = Math.sin(frequency2 * y / Math.sqrt(3));
      
      // Combine patterns for aperiodicity
      const aperiodic_z = amplitude * (
        0.25 * pattern1 * pattern3 +
        0.25 * pattern2 * pattern4 +
        0.5 * Math.sin((pattern1 + pattern2) * (pattern3 + pattern4))
      ) + modulation * Math.cos(t);

      return [x, y, aperiodic_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: Math.sqrt(5), f: 0.6, g: 0, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  quasicrystal_pattern_001: {
    name: "💎 QUASICRYSTAL-001: Quasicrystal Pattern GP₁₀",
    equation: (u: number, v: number, params: any) => {
      const symmetry = Math.floor(params.d) || 5;      // Rotational symmetry (5, 8, 12)
      const amplitude = params.e ?? 0.8;                // Pattern amplitude
      const frequency = params.f ?? 2;                  // Wave frequency
      const sharpness = params.g ?? 3;                  // Pattern sharpness
      const modulation = params.h ?? 0.2;               // Modulation factor
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Quasicrystal sum of plane waves
      let quasi_sum = 0;
      for (let i = 0; i < symmetry; i++) {
        const angle = (2 * Math.PI * i) / symmetry;
        const kx = frequency * Math.cos(angle);
        const ky = frequency * Math.sin(angle);
        quasi_sum += Math.cos(kx * x + ky * y + t);
      }

      // Apply non-linear transformation for sharpness
      const quasi_z = amplitude * Math.pow(Math.abs(quasi_sum / symmetry), sharpness) * 
                     Math.sign(quasi_sum) + modulation * Math.sin(2 * t);

      return [x, y, quasi_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 5, e: 0.8, f: 2, g: 3, h: 0.2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  symmetry_group_001: {
    name: "🔄 SYMMETRY-001: Crystallographic Symmetry GP₁₁",
    equation: (u: number, v: number, params: any) => {
      const symmetry_type = Math.floor(params.d) || 4; // Symmetry order
      const amplitude = params.e ?? 0.7;                // Pattern amplitude
      const lattice_const = params.f ?? 2;              // Lattice constant
      const mirror_planes = Math.floor(params.g) || 2;  // Mirror planes
      const rotation_center = params.h ?? 0;            // Rotation center
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Rotational symmetry
      const rotational = Math.cos(symmetry_type * theta + rotation_center);
      
      // Mirror symmetry
      let mirror_sum = 0;
      for (let i = 0; i < mirror_planes; i++) {
        const mirror_angle = (Math.PI * i) / mirror_planes;
        const reflected_theta = 2 * mirror_angle - theta;
        mirror_sum += Math.cos(symmetry_type * reflected_theta);
      }
      
      // Lattice periodicity
      const lattice = Math.sin(lattice_const * x) * Math.sin(lattice_const * y);
      
      const symmetry_z = amplitude * (0.4 * rotational + 0.3 * mirror_sum / mirror_planes + 
                                      0.3 * lattice) * Math.cos(t);

      return [x, y, symmetry_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0.7, f: 2, g: 2, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  wallpaper_group_001: {
    name: "🖼️ WALLPAPER-001: Wallpaper Group Pattern GP₁₂",
    equation: (u: number, v: number, params: any) => {
      const group_type = Math.floor(params.d) || 4;    // Wallpaper group (1-17)
      const amplitude = params.e ?? 0.8;                // Pattern amplitude
      const period_x = params.f ?? 3;                   // X period
      const period_y = params.g ?? 3;                   // Y period
      const glide_reflect = params.h ?? 0;              // Glide reflection
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Fundamental domain
      const px = (x % period_x + period_x) % period_x;
      const py = (y % period_y + period_y) % period_y;

      // p4m wallpaper group (square symmetry with mirrors)
      const base_pattern = Math.sin(2 * Math.PI * px / period_x) * 
                          Math.cos(2 * Math.PI * py / period_y);
      
      // Mirror symmetry
      const mirror_x = Math.sin(2 * Math.PI * (period_x - px) / period_x) * 
                      Math.cos(2 * Math.PI * py / period_y);
      const mirror_y = Math.sin(2 * Math.PI * px / period_x) * 
                      Math.cos(2 * Math.PI * (period_y - py) / period_y);
      
      // Glide reflection
      const glide = Math.sin(2 * Math.PI * (px + glide_reflect) / period_x) * 
                   Math.cos(2 * Math.PI * (py + 0.5) / period_y);

      const wallpaper_z = amplitude * (0.4 * base_pattern + 0.2 * mirror_x + 
                                       0.2 * mirror_y + 0.2 * glide) * Math.cos(t);

      return [x, y, wallpaper_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0.8, f: 3, g: 3, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 150, vSegments: 150 }
  },

  // GPU SHADER ALGORITHMS (Simulated in CPU for visualization)
  vs_wave_displacement_001: {
    name: "⚡ VS-WAVE-001: Vertex Shader Wave Displacement GPU₁",
    equation: (u: number, v: number, params: any) => {
      const wave_amplitude = params.d ?? 1.0;           // Displacement amplitude
      const wave_frequency = params.e ?? 4;             // Wave frequency
      const phase_speed = params.f ?? 1.0;              // Phase velocity
      const vertex_offset = params.g ?? 0;              // Vertex offset
      const normal_influence = params.h ?? 0.5;         // Normal influence
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Vertex displacement (GPU vertex shader simulation)
      const displacement = wave_amplitude * Math.sin(wave_frequency * r - phase_speed * t + vertex_offset);
      
      // Normal-based displacement
      const nx = -x / (r + 0.1);
      const ny = -y / (r + 0.1);
      const normal_disp = normal_influence * displacement;

      const vs_z = displacement + normal_disp * (nx + ny) / 2;

      return [x, y, vs_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.0, e: 4, f: 1.0, g: 0, h: 0.5, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  fs_wave_rendering_001: {
    name: "⚡ FS-WAVE-001: Fragment Shader Wave Rendering GPU₂",
    equation: (u: number, v: number, params: any) => {
      const wave_count = Math.floor(params.d) || 4;    // Number of waves
      const amplitude = params.e ?? 0.8;                // Fragment amplitude
      const frequency = params.f ?? 3;                  // Wave frequency
      const phase_offset = params.g ?? 0;               // Phase offset
      const color_mod = params.h ?? 1.0;                // Color modulation
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;

      // Multi-wave fragment shader simulation
      let fragment_value = 0;
      for (let i = 0; i < wave_count; i++) {
        const angle = (2 * Math.PI * i) / wave_count;
        const dir_x = Math.cos(angle);
        const dir_y = Math.sin(angle);
        const wave_coord = x * dir_x + y * dir_y;
        fragment_value += Math.sin(frequency * wave_coord - t + phase_offset * i);
      }

      const fs_z = amplitude * fragment_value / wave_count * color_mod;

      return [x, y, fs_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0.8, f: 3, g: 0, h: 1.0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  cs_fft_implementation_001: {
    name: "⚡ CS-FFT-001: Compute Shader FFT GPU₃",
    equation: (u: number, v: number, params: any) => {
      const fft_size = Math.floor(params.d) || 16;     // FFT size
      const amplitude = params.e ?? 1.0;                // Amplitude
      const frequency_bands = Math.floor(params.f) || 8;// Frequency bands
      const spectral_power = params.g ?? 2;             // Spectral power
      const phase_shift = params.h ?? 0;                // Phase shift
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;

      // Simulated FFT compute shader (spatial frequency decomposition)
      let fft_sum = 0;
      for (let k = 0; k < frequency_bands; k++) {
        const kx = k * Math.cos(k);
        const ky = k * Math.sin(k);
        const spatial_freq = x * kx + y * ky;
        const spectral_component = Math.pow(Math.abs(Math.cos(spatial_freq / fft_size + t)), spectral_power);
        fft_sum += spectral_component * Math.cos(k * phase_shift);
      }

      const fft_z = amplitude * fft_sum / frequency_bands;

      return [x, y, fft_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 16, e: 1.0, f: 8, g: 2, h: 0, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  ts_wave_detail_001: {
    name: "⚡ TS-WAVE-001: Tessellation Shader Wave Detail GPU₄",
    equation: (u: number, v: number, params: any) => {
      const tess_level = Math.floor(params.d) || 4;    // Tessellation level
      const amplitude = params.e ?? 0.9;                // Detail amplitude
      const frequency = params.f ?? 6;                  // Detail frequency
      const adaptive_factor = params.g ?? 0.5;          // Adaptive tessellation
      const edge_length = params.h ?? 2;                // Edge length target
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Tessellation level based on curvature (adaptive)
      const curvature = Math.abs(Math.cos(frequency * r));
      const adaptive_tess = tess_level * (1 + adaptive_factor * curvature);
      
      // Detail from tessellation
      const detail = amplitude * Math.sin(adaptive_tess * r - t) / (1 + r * r / edge_length);

      return [x, y, detail];
    },
    defaults: { a: 1, b: 1, c: 1, d: 4, e: 0.9, f: 6, g: 0.5, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  gs_wave_generation_001: {
    name: "⚡ GS-WAVE-001: Geometry Shader Wave Generation GPU₅",
    equation: (u: number, v: number, params: any) => {
      const primitive_count = Math.floor(params.d) || 6;// Primitives per invocation
      const amplitude = params.e ?? 1.0;                // Generation amplitude
      const expansion = params.f ?? 0.5;                // Geometry expansion
      const rotation = params.g ?? 0;                   // Primitive rotation
      const extrusion = params.h ?? 0.3;                // Extrusion amount
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Geometry shader: generate new primitives
      let geom_sum = 0;
      for (let i = 0; i < primitive_count; i++) {
        const prim_angle = theta + rotation + (2 * Math.PI * i) / primitive_count;
        const prim_r = r * (1 + expansion * Math.sin(primitive_count * prim_angle + t));
        geom_sum += Math.cos(prim_r) * extrusion;
      }

      const gs_z = amplitude * geom_sum / primitive_count;

      return [x, y, gs_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 6, e: 1.0, f: 0.5, g: 0, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  hs_adaptive_tess_001: {
    name: "⚡ HS-ADAPTIVE-001: Hull Shader Adaptive Tessellation GPU₆",
    equation: (u: number, v: number, params: any) => {
      const min_tess = params.d ?? 1;                   // Minimum tessellation
      const max_tess = params.e ?? 8;                   // Maximum tessellation
      const amplitude = params.f ?? 0.8;                // Amplitude
      const distance_factor = params.g ?? 5;            // Distance-based factor
      const curvature_weight = params.h ?? 2;           // Curvature weight
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Adaptive tessellation based on distance and curvature
      const distance_tess = max_tess / (1 + r / distance_factor);
      const curvature = Math.abs(Math.sin(curvature_weight * r));
      const adaptive_level = Math.max(min_tess, Math.min(max_tess, distance_tess * (1 + curvature)));
      
      const hs_z = amplitude * Math.sin(adaptive_level * r - t) / (1 + r);

      return [x, y, hs_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, e: 8, f: 0.8, g: 5, h: 2, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  ds_displacement_001: {
    name: "⚡ DS-DISPLACEMENT-001: Domain Shader Displacement GPU₇",
    equation: (u: number, v: number, params: any) => {
      const displacement_scale = params.d ?? 1.5;       // Displacement scale
      const amplitude = params.e ?? 1.0;                // Amplitude
      const frequency = params.f ?? 4;                  // Frequency
      const barycentric_weight = params.g ?? 0.5;       // Barycentric weight
      const normal_offset = params.h ?? 0.3;            // Normal offset
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Domain shader displacement (barycentric interpolation)
      const bary_u = u;
      const bary_v = v;
      const bary_w = 1 - u - v;
      
      const displacement = displacement_scale * Math.sin(frequency * r - t);
      const bary_disp = barycentric_weight * (bary_u + bary_v + bary_w) * displacement;
      
      const ds_z = amplitude * (displacement + bary_disp) + normal_offset * Math.cos(t);

      return [x, y, ds_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1.5, e: 1.0, f: 4, g: 0.5, h: 0.3, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  mesh_shader_001: {
    name: "⚡ MESH-SHADER-001: Mesh Shader Generation GPU₈",
    equation: (u: number, v: number, params: any) => {
      const meshlet_size = Math.floor(params.d) || 8;  // Meshlet size
      const amplitude = params.e ?? 1.0;                // Amplitude
      const procedural_freq = params.f ?? 3;            // Procedural frequency
      const culling_threshold = params.g ?? 0.3;        // Culling threshold
      const lod_factor = params.h ?? 1;                 // LOD factor
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 15;
      const y = (v - 0.5) * 15;
      const r = Math.sqrt(x * x + y * y);

      // Mesh shader: procedural meshlet generation
      const meshlet_id = Math.floor(r / meshlet_size);
      const meshlet_local = r % meshlet_size;
      
      // Procedural mesh generation
      const mesh_wave = Math.sin(procedural_freq * meshlet_local + meshlet_id - t);
      
      // LOD-based amplitude
      const lod_amplitude = amplitude / (1 + lod_factor * meshlet_id);
      
      // Culling (set to 0 if below threshold)
      const culled = Math.abs(mesh_wave) > culling_threshold ? mesh_wave : 0;
      
      const mesh_z = lod_amplitude * culled;

      return [x, y, mesh_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 8, e: 1.0, f: 3, g: 0.3, h: 1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  task_shader_001: {
    name: "⚡ TASK-SHADER-001: Task Shader Work Distribution GPU₉",
    equation: (u: number, v: number, params: any) => {
      const workgroup_size = Math.floor(params.d) || 32;// Workgroup size
      const amplitude = params.e ?? 0.9;                // Amplitude
      const dispatch_pattern = Math.floor(params.f) || 4;// Dispatch pattern
      const workload_balance = params.g ?? 0.5;         // Workload balance
      const thread_offset = params.h ?? 0.1;            // Thread offset
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);

      // Task shader: workload distribution
      const workgroup_id = Math.floor(r / workgroup_size * 10);
      const thread_id = (r * 100) % workgroup_size;
      
      // Distributed work pattern
      const work_pattern = Math.sin(dispatch_pattern * workgroup_id + thread_offset * thread_id - t);
      
      // Balanced workload
      const balance_factor = 1 + workload_balance * Math.sin(workgroup_id);
      
      const task_z = amplitude * work_pattern * balance_factor;

      return [x, y, task_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 32, e: 0.9, f: 4, g: 0.5, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  rt_shader_001: {
    name: "⚡ RT-SHADER-001: Ray Tracing Shader GPU₁₀",
    equation: (u: number, v: number, params: any) => {
      const ray_bounces = Math.floor(params.d) || 3;   // Ray bounces
      const amplitude = params.e ?? 1.0;                // Amplitude
      const reflection_coeff = params.f ?? 0.7;         // Reflection coefficient
      const refraction_index = params.g ?? 1.5;         // Refraction index
      const absorption = params.h ?? 0.1;               // Absorption
      const t = params.i ?? 0;                         // Time parameter

      const x = (u - 0.5) * 12;
      const y = (v - 0.5) * 12;
      const r = Math.sqrt(x * x + y * y);
      const theta = Math.atan2(y, x);

      // Ray tracing simulation: recursive bounces
      let ray_contribution = 0;
      let energy = 1.0;
      
      for (let bounce = 0; bounce < ray_bounces; bounce++) {
        const bounce_angle = theta + bounce * Math.PI / 4;
        const bounce_dist = r + bounce;
        
        // Reflection/refraction
        const reflection = reflection_coeff * Math.cos(bounce_dist - t);
        const refraction = (1 - reflection_coeff) * Math.sin(bounce_dist * refraction_index - t);
        
        energy *= (1 - absorption);
        ray_contribution += energy * (reflection + refraction);
      }

      const rt_z = amplitude * ray_contribution / ray_bounces;

      return [x, y, rt_z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 3, e: 1.0, f: 0.7, g: 1.5, h: 0.1, i: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 120, vSegments: 120 }
  },

  icosahedron: {
    name: "🔲 Icosahedron (20 faces)",
    equation: (u: number, v: number, params: any) => {
      const theta = u * Math.PI;
      const phi = v * 2 * Math.PI;
      const scale = params.d ?? 1;

      // Icosahedral surface approximation
      const ico_freq = 5; // Icosahedral symmetry
      const ico_modulation = Math.sin(ico_freq * theta) * Math.cos(ico_freq * phi) * 0.2;
      const radius = scale * (1 + ico_modulation);

      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);

      return [x, y, z];
    },
    defaults: { a: 1, b: 1, c: 1, d: 1, uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI, uSegments: 40, vSegments: 40 }
  },

};

export function getCleanSurface(type: string) {
  return CLEAN_SURFACES[type as keyof typeof CLEAN_SURFACES] || null;
}