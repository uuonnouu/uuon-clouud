/**
 * HARMONY WAVE SHAPES LIBRARY
 * Advanced animation-focused parametric surfaces for harmony, symphony, 
 * wave dynamics, morphing, and 4D projections
 * 
 * These shapes are designed to test and visualize:
 * - Musical harmony and symphony patterns
 * - Wave interference and superposition
 * - Smooth morphing transformations
 * - 4D hyperdimensional projections with XYZ rotations
 * 
 * © 2025 UUON Foundation Inc.
 */

import type { SurfaceParameters } from '../types/math';
import type { ParametricSurface } from './unifiedShapes';

// Golden ratio for harmonic proportions
const PHI = 1.618033988749895;
const PI = Math.PI;

export const HARMONY_WAVE_SHAPES: Record<string, ParametricSurface> = {
  
  // ═══════════════════════════════════════════════════════════════
  // HARMONY SHAPES - Musical frequency ratios as geometry
  // ═══════════════════════════════════════════════════════════════
  
  harmonic_resonance_surface: {
    name: "Harmonic Resonance Surface",
    description: "Standing wave patterns based on musical harmonic ratios (1:2:3:4:5)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? PHI;
      const c = params.c ?? 1;
      const d = params.d ?? 1; // Fundamental frequency
      const e = params.e ?? 2; // 2nd harmonic
      const f = params.f ?? 3; // 3rd harmonic
      const g = params.g ?? 0; // Phase offset
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Harmonic series: fundamental + overtones
      const fundamental = Math.sin(d * theta + g);
      const second = 0.5 * Math.sin(e * theta + g * 1.5);
      const third = 0.33 * Math.sin(f * theta + g * 2);
      const harmonic = fundamental + second + third;
      
      const r = a * (1 + 0.3 * harmonic);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + harmonic * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: PHI, c: 1, d: 1, e: 2, f: 3, g: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  pythagorean_harmony_shell: {
    name: "Pythagorean Harmony Shell",
    description: "Surface based on Pythagorean musical intervals (octave, fifth, fourth)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1;   // Octave ratio 2:1
      const e = params.e ?? 1.5; // Fifth ratio 3:2
      const f = params.f ?? 1.333; // Fourth ratio 4:3
      
      const theta = u * PI * 2;
      const t = v * PI * 2;
      
      // Pythagorean intervals create interference patterns
      const octave = Math.sin(d * 2 * theta);
      const fifth = Math.sin(e * theta) * Math.cos(f * t);
      const fourth = Math.cos(f * theta) * Math.sin(e * t);
      
      const r = a * (1 + 0.2 * (octave + fifth + fourth) / 3);
      const x = r * Math.cos(theta) * (1 + 0.3 * Math.cos(t)) * b;
      const y = r * Math.sin(theta) * (1 + 0.3 * Math.cos(t)) * b;
      const z = r * 0.5 * Math.sin(t) * c + octave * 0.3;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 1, e: 1.5, f: 1.333, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  golden_harmonic_spiral: {
    name: "Golden Harmonic Spiral",
    description: "Fibonacci-based harmonic spiral with phi-ratio frequencies",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 1;
      const b = params.b ?? PHI;
      const c = params.c ?? 0.5;
      const d = params.d ?? 5; // Spiral turns
      const e = params.e ?? 0.1; // Growth rate
      const f = params.f ?? 3; // Harmonic order
      
      const theta = u * PI * 2 * d;
      const phi = v * PI;
      
      // Golden spiral with harmonic modulation
      const r = a * Math.exp(e * theta / PI) * (1 + 0.2 * Math.sin(f * theta));
      const harmonic = Math.sin(b * theta) * Math.cos(f * phi);
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = c * theta / PI + harmonic * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 0.3, b: PHI, c: 0.3, d: 5, e: 0.1, f: 3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 128, vSegments: 32 }
  },

  // ═══════════════════════════════════════════════════════════════
  // SYMPHONY SHAPES - Multi-wave orchestration
  // ═══════════════════════════════════════════════════════════════
  
  symphony_wave_orchestration: {
    name: "Symphony Wave Orchestration",
    description: "Multiple wave frequencies combining like instruments in an orchestra",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1;   // Bass frequency
      const e = params.e ?? 2;   // Mid frequency
      const f = params.f ?? 4;   // Treble frequency
      const g = params.g ?? 8;   // High frequency
      const h = params.h ?? 0;   // Phase conductor
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Symphony: bass + mid + treble + high like an orchestra
      const bass = Math.sin(d * theta + h) * 0.4;
      const mid = Math.sin(e * theta + h * 1.5) * 0.3;
      const treble = Math.sin(f * theta + h * 2) * 0.2;
      const high = Math.sin(g * theta + h * 3) * 0.1;
      const symphony = bass + mid + treble + high;
      
      const r = a * (1 + symphony * 0.5);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + symphony;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 1, e: 2, f: 4, g: 8, h: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  polyphonic_surface: {
    name: "Polyphonic Surface",
    description: "Multiple independent melodies weaving through 3D space",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1.5;
      const c = params.c ?? 1;
      const d = params.d ?? 3; // Voice 1 frequency
      const e = params.e ?? 5; // Voice 2 frequency
      const f = params.f ?? 7; // Voice 3 frequency
      
      const theta = u * PI * 2;
      const t = v * PI * 2;
      
      // Three independent melodic voices
      const voice1 = Math.sin(d * theta) * Math.cos(t);
      const voice2 = Math.sin(e * theta + PI/3) * Math.cos(t + PI/4);
      const voice3 = Math.sin(f * theta + 2*PI/3) * Math.cos(t + PI/2);
      const polyphony = (voice1 + voice2 + voice3) / 3;
      
      const x = a * Math.cos(theta) * (1 + 0.3 * voice1);
      const y = b * Math.sin(theta) * (1 + 0.3 * voice2);
      const z = c * Math.sin(t) + polyphony;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1.5, c: 1, d: 3, e: 5, f: 7, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  crescendo_diminuendo_surface: {
    name: "Crescendo Diminuendo Surface",
    description: "Wave amplitude that grows and fades like musical dynamics",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 4; // Frequency
      const e = params.e ?? 2; // Crescendo rate
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Crescendo (grow) then diminuendo (fade)
      const envelope = Math.sin(phi * e) * Math.sin(phi); // Bell curve envelope
      const wave = Math.sin(d * theta) * envelope;
      
      const r = a * (1 + wave * 0.5);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 4, e: 2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  // ═══════════════════════════════════════════════════════════════
  // WAVE DYNAMICS - Interference and superposition
  // ═══════════════════════════════════════════════════════════════
  
  wave_superposition_field: {
    name: "Wave Superposition Field",
    description: "Multiple waves combining through constructive and destructive interference",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 3; // Wave 1 frequency
      const e = params.e ?? 5; // Wave 2 frequency
      const f = params.f ?? 0; // Phase difference
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Two waves with phase difference creating interference
      const wave1 = Math.sin(d * theta);
      const wave2 = Math.sin(e * theta + f);
      const superposition = (wave1 + wave2) / 2;
      
      const r = a * (1 + 0.4 * superposition);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + superposition * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 3, e: 5, f: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  standing_wave_resonator: {
    name: "Standing Wave Resonator",
    description: "Nodes and antinodes of a standing wave pattern",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 4; // Number of nodes
      const e = params.e ?? 1; // Amplitude
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Standing wave: 2*sin(kx)*cos(wt) simplified
      const standing = Math.sin(d * theta) * Math.cos(d * phi);
      
      const r = a * (1 + e * 0.3 * Math.abs(standing));
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + standing * e * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 4, e: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  doppler_wave_surface: {
    name: "Doppler Wave Surface",
    description: "Frequency shift visualization like sound from a moving source",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 5; // Base frequency
      const e = params.e ?? 0.5; // Velocity factor
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Doppler effect: frequency changes based on angle
      const velocity = e * Math.cos(theta);
      const dopplerFreq = d / (1 - velocity);
      const wave = Math.sin(dopplerFreq * phi);
      
      const r = a * (1 + 0.2 * wave);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + wave * 0.3;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 5, e: 0.3, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  // ═══════════════════════════════════════════════════════════════
  // MORPHING SHAPES - Smooth transformations
  // ═══════════════════════════════════════════════════════════════
  
  sphere_to_torus_morph: {
    name: "Sphere to Torus Morph",
    description: "Smooth transition from sphere to torus controlled by parameter D",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // Morph factor: 0=sphere, 1=torus
      const e = params.e ?? 0.5; // Torus tube radius
      
      const theta = u * PI * 2;
      const phi = v * PI * 2;
      
      const morphT = Math.max(0, Math.min(1, d));
      
      // Sphere coordinates
      const sx = a * Math.sin(phi/2) * Math.cos(theta);
      const sy = a * Math.sin(phi/2) * Math.sin(theta);
      const sz = a * Math.cos(phi/2);
      
      // Torus coordinates
      const tx = (a + e * Math.cos(phi)) * Math.cos(theta);
      const ty = (a + e * Math.cos(phi)) * Math.sin(theta);
      const tz = e * Math.sin(phi);
      
      // Linear interpolation morph
      const x = (1 - morphT) * sx + morphT * tx;
      const y = (1 - morphT) * sy + morphT * ty;
      const z = (1 - morphT) * sz + morphT * tz;
      
      return [x * b, y * b, z * c];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 0, e: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  cube_to_sphere_morph: {
    name: "Cube to Sphere Morph",
    description: "Smooth transition from cube to sphere controlled by parameter D",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // Morph factor: 0=cube, 1=sphere
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      const morphT = Math.max(0, Math.min(1, d));
      
      // Sphere coordinates (normalized)
      const sx = Math.sin(phi) * Math.cos(theta);
      const sy = Math.sin(phi) * Math.sin(theta);
      const sz = Math.cos(phi);
      
      // Cube coordinates (superquadric with high exponent)
      const n = 0.1 + (1 - morphT) * 5; // Sharp edges when low morph
      const signX = sx >= 0 ? 1 : -1;
      const signY = sy >= 0 ? 1 : -1;
      const signZ = sz >= 0 ? 1 : -1;
      
      const cx = signX * Math.pow(Math.abs(sx), n);
      const cy = signY * Math.pow(Math.abs(sy), n);
      const cz = signZ * Math.pow(Math.abs(sz), n);
      
      const x = a * ((1 - morphT) * cx + morphT * sx) * b;
      const y = a * ((1 - morphT) * cy + morphT * sy) * b;
      const z = a * ((1 - morphT) * cz + morphT * sz) * c;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 0, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  wave_to_calm_morph: {
    name: "Wave to Calm Morph",
    description: "Turbulent waves smoothing to calm surface - thermal cooling visualization",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1; // Turbulence: 1=waves, 0=calm (cooling)
      const e = params.e ?? 5; // Wave frequency
      const f = params.f ?? 0.5; // Wave amplitude
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      const turbulence = Math.max(0, Math.min(1, d));
      
      // Turbulent wave pattern
      const waves = Math.sin(e * theta) * Math.cos(e * phi) * 
                    Math.sin(e * 1.5 * theta) * f;
      
      // Apply turbulence factor (0 = no waves = cooled down)
      const r = a * (1 + waves * turbulence);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c + waves * turbulence * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 1, e: 5, f: 0.5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  // ═══════════════════════════════════════════════════════════════
  // 4D PROJECTIONS - Hyperdimensional with XYZ rotations
  // ═══════════════════════════════════════════════════════════════
  
  hypersphere_4d_projection: {
    name: "Hypersphere 4D Projection",
    description: "4D hypersphere (3-sphere) projected to 3D with XYZ rotation control",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // W-rotation angle (4D)
      const x_rot = params.x ?? 0; // X-axis rotation
      const y_rot = params.y ?? 0; // Y-axis rotation
      const z_rot = params.z ?? 0; // Z-axis rotation
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // 4D hypersphere parametrization
      const w_angle = d * PI / 180;
      const x4 = Math.sin(phi) * Math.sin(theta) * Math.cos(w_angle);
      const y4 = Math.sin(phi) * Math.sin(theta) * Math.sin(w_angle);
      const z4 = Math.sin(phi) * Math.cos(theta);
      const w4 = Math.cos(phi);
      
      // Stereographic projection from 4D to 3D
      const scale = 1 / (1 - w4 * 0.3);
      let x = x4 * scale * a;
      let y = y4 * scale * a;
      let z = z4 * scale * a;
      
      // Apply XYZ rotations
      const cx = Math.cos(x_rot * PI / 180), sx = Math.sin(x_rot * PI / 180);
      const cy = Math.cos(y_rot * PI / 180), sy = Math.sin(y_rot * PI / 180);
      const cz = Math.cos(z_rot * PI / 180), sz = Math.sin(z_rot * PI / 180);
      
      // Rotate around X
      let y1 = y * cx - z * sx;
      let z1 = y * sx + z * cx;
      y = y1; z = z1;
      
      // Rotate around Y
      let x1 = x * cy + z * sy;
      z1 = -x * sy + z * cy;
      x = x1; z = z1;
      
      // Rotate around Z
      x1 = x * cz - y * sz;
      y1 = x * sz + y * cz;
      
      return [x1 * b, y1 * b, z * c];
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0, x: 1, y: 1, z: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  tesseract_4d_wireframe: {
    name: "Tesseract 4D Wireframe",
    description: "4D hypercube projected to 3D with rotation in W dimension",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // W-rotation
      const e = params.e ?? 0.3; // Inner cube scale
      const x_rot = params.x ?? 0;
      const y_rot = params.y ?? 0;
      const z_rot = params.z ?? 0;
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      const w_angle = d * PI / 180;
      
      // Tesseract as two nested cubes with connecting edges
      const outer = 1;
      const inner = e;
      
      // Use parametric position to move along tesseract edges
      const edge = Math.floor(u * 16) % 16;
      const t = (u * 16) % 1;
      
      // Simplified tesseract visualization using superquadric
      const n = 0.3;
      const signT = Math.sin(theta) >= 0 ? 1 : -1;
      const signP = Math.cos(phi) >= 0 ? 1 : -1;
      
      // W-dimension modulation
      const wFactor = 0.5 + 0.5 * Math.cos(w_angle);
      
      let x = a * signT * Math.pow(Math.abs(Math.sin(theta)), n) * wFactor;
      let y = a * Math.pow(Math.abs(Math.cos(theta)), n) * Math.sin(phi) * wFactor;
      let z = a * signP * Math.pow(Math.abs(Math.cos(phi)), n);
      
      // Apply XYZ rotations
      const cx = Math.cos(x_rot * PI / 180), sx = Math.sin(x_rot * PI / 180);
      const cy = Math.cos(y_rot * PI / 180), sy = Math.sin(y_rot * PI / 180);
      const cz = Math.cos(z_rot * PI / 180), sz = Math.sin(z_rot * PI / 180);
      
      let y1 = y * cx - z * sx;
      let z1 = y * sx + z * cx;
      y = y1; z = z1;
      
      let x1 = x * cy + z * sy;
      z1 = -x * sy + z * cy;
      x = x1; z = z1;
      
      x1 = x * cz - y * sz;
      y1 = x * sz + y * cz;
      
      return [x1 * b, y1 * b, z * c];
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0, e: 0.5, x: 1, y: 1, z: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  klein_bottle_4d_harmony: {
    name: "Klein Bottle 4D Harmony",
    description: "Klein bottle requiring 4D to avoid self-intersection, with XYZ rotation",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // 4D rotation
      const x_rot = params.x ?? 0;
      const y_rot = params.y ?? 0;
      const z_rot = params.z ?? 0;
      
      const theta = u * PI * 2;
      const phi = v * PI * 2;
      
      // Figure-8 Klein bottle parametrization
      const r = 1;
      const w_angle = d * PI / 180;
      
      let x = (r + Math.cos(theta/2) * Math.sin(phi) - Math.sin(theta/2) * Math.sin(2*phi)) * Math.cos(theta);
      let y = (r + Math.cos(theta/2) * Math.sin(phi) - Math.sin(theta/2) * Math.sin(2*phi)) * Math.sin(theta);
      let z = Math.sin(theta/2) * Math.sin(phi) + Math.cos(theta/2) * Math.sin(2*phi);
      
      // 4D twist
      const w = Math.sin(w_angle) * 0.5;
      x *= (1 + w);
      y *= (1 - w);
      
      // Apply XYZ rotations
      const cx = Math.cos(x_rot * PI / 180), sx = Math.sin(x_rot * PI / 180);
      const cy = Math.cos(y_rot * PI / 180), sy = Math.sin(y_rot * PI / 180);
      const cz = Math.cos(z_rot * PI / 180), sz = Math.sin(z_rot * PI / 180);
      
      let y1 = y * cx - z * sx;
      let z1 = y * sx + z * cx;
      y = y1; z = z1;
      
      let x1 = x * cy + z * sy;
      z1 = -x * sy + z * cy;
      x = x1; z = z1;
      
      x1 = x * cz - y * sz;
      y1 = x * sz + y * cz;
      
      return [x1 * a * b, y1 * a * b, z * a * c];
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0, x: 1, y: 1, z: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  },

  hypercube_rotation_4d: {
    name: "Hypercube Rotation 4D",
    description: "Animated 4D hypercube with full SO(4) rotation control",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 0; // XW rotation
      const e = params.e ?? 0; // YW rotation
      const f = params.f ?? 0; // ZW rotation
      const x_rot = params.x ?? 0;
      const y_rot = params.y ?? 0;
      const z_rot = params.z ?? 0;
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      // Create a hypercube surface using superquadric approximation
      const n = 0.25;
      const sth = Math.sin(theta);
      const cth = Math.cos(theta);
      const sph = Math.sin(phi);
      const cph = Math.cos(phi);
      
      // 4D coordinates
      let x4 = Math.sign(sph * cth) * Math.pow(Math.abs(sph * cth), n);
      let y4 = Math.sign(sph * sth) * Math.pow(Math.abs(sph * sth), n);
      let z4 = Math.sign(cph) * Math.pow(Math.abs(cph), n);
      let w4 = 0.5; // W coordinate
      
      // Apply 4D rotations (XW, YW, ZW planes)
      const dRad = d * PI / 180;
      const eRad = e * PI / 180;
      const fRad = f * PI / 180;
      
      // XW rotation
      let x_new = x4 * Math.cos(dRad) - w4 * Math.sin(dRad);
      let w_new = x4 * Math.sin(dRad) + w4 * Math.cos(dRad);
      x4 = x_new; w4 = w_new;
      
      // YW rotation
      let y_new = y4 * Math.cos(eRad) - w4 * Math.sin(eRad);
      w_new = y4 * Math.sin(eRad) + w4 * Math.cos(eRad);
      y4 = y_new; w4 = w_new;
      
      // ZW rotation
      let z_new = z4 * Math.cos(fRad) - w4 * Math.sin(fRad);
      w_new = z4 * Math.sin(fRad) + w4 * Math.cos(fRad);
      z4 = z_new;
      
      // Project to 3D
      const perspective = 2 / (2 - w4);
      let x = x4 * perspective * a;
      let y = y4 * perspective * a;
      let z = z4 * perspective * a;
      
      // Apply XYZ rotations
      const cx = Math.cos(x_rot * PI / 180), sx = Math.sin(x_rot * PI / 180);
      const cy = Math.cos(y_rot * PI / 180), sy = Math.sin(y_rot * PI / 180);
      const cz = Math.cos(z_rot * PI / 180), sz = Math.sin(z_rot * PI / 180);
      
      let y1 = y * cx - z * sx;
      let z1 = y * sx + z * cx;
      y = y1; z = z1;
      
      let x1 = x * cy + z * sy;
      z1 = -x * sy + z * cy;
      x = x1; z = z1;
      
      x1 = x * cz - y * sz;
      y1 = x * sz + y * cz;
      
      return [x1 * b, y1 * b, z * c];
    },
    defaultParams: { a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, x: 1, y: 1, z: 1, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  // ═══════════════════════════════════════════════════════════════
  // THERMAL DYNAMICS - Cooling formulas
  // ═══════════════════════════════════════════════════════════════
  
  heat_diffusion_surface: {
    name: "Heat Diffusion Surface",
    description: "Fourier heat equation visualization - temperature spreading over time",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1; // Time (higher = more diffused/cooled)
      const e = params.e ?? 0.1; // Thermal diffusivity
      const f = params.f ?? 3; // Initial heat distribution modes
      
      const x = (u - 0.5) * 4 * a;
      const y_coord = (v - 0.5) * 4 * a;
      
      // Heat equation solution: T(x,t) = sum of exponential decay modes
      const time = Math.max(0.01, d);
      let temperature = 0;
      for (let n = 1; n <= f; n++) {
        const decay = Math.exp(-e * n * n * time);
        temperature += decay * Math.sin(n * PI * u) * Math.sin(n * PI * v) / n;
      }
      
      const z = temperature * c * 2;
      
      return [x * b, y_coord * b, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 0.1, e: 0.1, f: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  newton_cooling_curve: {
    name: "Newton Cooling Curve",
    description: "Exponential cooling law: T(t) = T_ambient + (T_0 - T_ambient) * e^(-kt)",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1; // Initial temperature excess
      const e = params.e ?? 0.5; // Cooling rate k
      const f = params.f ?? 0; // Ambient temperature offset
      
      const theta = u * PI * 2;
      const time = v * 5; // Time axis
      
      // Newton's law of cooling
      const temperature = f + d * Math.exp(-e * time);
      
      const r = a * (0.5 + 0.5 * temperature / d);
      const x = r * Math.cos(theta) * b;
      const y = r * Math.sin(theta) * b;
      const z = time * c * 0.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 1, e: 0.5, f: 0.2, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 64, vSegments: 64 }
  },

  entropy_flow_surface: {
    name: "Entropy Flow Surface",
    description: "Thermodynamic entropy increasing toward equilibrium",
    equation: (u: number, v: number, params: SurfaceParameters) => {
      const a = params.a ?? 2;
      const b = params.b ?? 1;
      const c = params.c ?? 1;
      const d = params.d ?? 1; // Order parameter (1=ordered, 0=maximum entropy)
      const e = params.e ?? 3; // Pattern complexity
      
      const theta = u * PI * 2;
      const phi = v * PI;
      
      const order = Math.max(0, Math.min(1, d));
      
      // Ordered pattern (low entropy)
      const pattern = Math.sin(e * theta) * Math.cos(e * phi);
      
      // Apply order factor (higher order = more pattern, lower = random/smooth)
      const noise = (Math.sin(17 * theta) * Math.cos(23 * phi)) * 0.1;
      const surface = order * pattern + (1 - order) * noise;
      
      const r = a * (1 + 0.3 * surface);
      const x = r * Math.sin(phi) * Math.cos(theta) * b;
      const y = r * Math.sin(phi) * Math.sin(theta) * b;
      const z = r * Math.cos(phi) * c;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 1, d: 1, e: 5, uMin: 0, uMax: 1, vMin: 0, vMax: 1, uSegments: 96, vSegments: 48 }
  }
};

export const HARMONY_WAVE_SHAPE_COUNT = Object.keys(HARMONY_WAVE_SHAPES).length;
console.log(`🎵 Harmony Wave Shapes loaded: ${HARMONY_WAVE_SHAPE_COUNT} shapes`);
console.log(`   🎶 Harmony: Musical frequency ratios as geometry`);
console.log(`   🎼 Symphony: Multi-wave orchestration surfaces`);
console.log(`   🌊 Waves: Interference and superposition`);
console.log(`   🔄 Morphing: Smooth transformation shapes`);
console.log(`   📐 4D: Hyperdimensional projections with XYZ rotation`);
console.log(`   🌡️ Thermal: Cooling and entropy dynamics`);
