/**
 * ΔMENSION PARAMETRIC LIBRARY PACK
 * ================================
 * Universal set of 39+ parametric forms organized into 10 master categories.
 * 
 * Categories with CHAOS-ORDERED Parameters (A-Z):
 * I.   Foundational Curves → D-E (lowest chaos)
 * II.  Surfaces of Revolution → F-G (low chaos)
 * III. Extrusions & Sweeps → H-I (low-medium)
 * IV.  Lofts & Interpolations → J-K (medium)
 * V.   Superquadrics & Superforms → L-M (medium-high)
 * VI.  Minimal Surfaces → N-O (topological)
 * VII. Waveforms & Harmonics → P-Q (wave dynamics)
 * VIII. Fractals & Noise → V-W (high chaos)
 * IX.  Special Structures → R-S (topological)
 * X.   Φ-Based Forms → T-U (golden ratio)
 * 
 * Global transforms: A-C (foundation)
 * Spatial offsets: X-Y (coordinate)
 * Chaos throttle: Z (maximum)
 * 
 * Compatible with:
 * - @react-three/fiber renderer
 * - SDF (Signed Distance Field) engines
 * - GLB/GLTF export pipeline
 * - UV morphing system
 * - Full A-Z parameter control system
 * 
 * @author Δmension Mathematical Universe
 * @version 2.0.0 - Chaos-Ordered Parameters
 */

import { getCleanDefaults, getCategoryDefaults } from '../types/shapes';

// Type definition for parametric surface
interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: any) => [number, number, number];
  defaultParams: any;
  category: string;
  description: string;
  engineDynamics?: string;
}

// ============================================================================
// I. FOUNDATIONAL CURVES (2D Parametric Curves as 3D Surfaces)
// ============================================================================

export const FOUNDATIONAL_CURVES: Record<string, ParametricSurface> = {
  
  parametric_line: {
    name: "📏 Line - Simplest Base Curve",
    category: "foundational_curves",
    description: "x=u, y=0 - The simplest parametric curve extended to surface",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 3;
      const b = params.e ?? 1;
      const c = params.f ?? 0.5;
      // D-E: Foundational curve controls (lowest chaos)
      const d_amplitude = params.d ?? 0;
      const e_curvature = params.e ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const x = (u - 0.5) * a * 2 * (1 + d_amplitude * 0.1);
      const y = (v - 0.5) * c + e_curvature * 0.1 * Math.sin(u * Math.PI);
      const z = z_chaos * 0.05 * Math.sin(u * v * Math.PI * 10);
      
      return [x * b, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 0.5, uSegments: 32, vSegments: 8 })
  },

  parametric_circle: {
    name: "⭕ Circle - Perfect Radial Symmetry",
    category: "foundational_curves",
    description: "x=r·cos(u), y=r·sin(u) - Perfect radial symmetry curve",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 2;
      const thickness = params.e ?? 0.2;
      const height = params.f ?? 0.1;
      // D-E: Foundational curve controls
      const d_amplitude = params.d ?? 0;
      const e_curvature = params.e ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI * 2;
      const offset = (v - 0.5) * thickness;
      const radiusMod = 1 + d_amplitude * 0.05 * Math.sin(theta * 4);
      const curveMod = e_curvature * 0.1 * Math.cos(theta * 2);
      
      const x = (r * radiusMod + offset) * Math.cos(theta);
      const y = (r * radiusMod + offset) * Math.sin(theta);
      const z = (v - 0.5) * height + curveMod + z_chaos * 0.02 * Math.sin(theta * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.2, f: 0.1, uSegments: 64, vSegments: 8 })
  },

  parametric_ellipse: {
    name: "🥚 Ellipse - Scaled Circle",
    category: "foundational_curves",
    description: "x=a·cos(u), y=b·sin(u) - Elliptical curve with independent axes",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const a_axis = params.d ?? 3;
      const b_axis = params.e ?? 1.5;
      const thickness = params.f ?? 0.2;
      
      const theta = u * Math.PI * 2;
      const offset = (v - 0.5) * thickness;
      
      const x = (a_axis + offset) * Math.cos(theta);
      const y = (b_axis + offset * 0.5) * Math.sin(theta);
      const z = (v - 0.5) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1.5, f: 0.2, uSegments: 64, vSegments: 8 })
  },

  archimedean_spiral: {
    name: "🌀 Archimedean Spiral - Evenly Expanding",
    category: "foundational_curves",
    description: "r = a + b·u - Evenly expanding spiral",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.5;
      const b = params.e ?? 2;
      const height = params.f ?? 1;
      const turns = params.d ?? 4;
      
      const theta = u * Math.PI * 2 * turns;
      const r = a + b * u;
      const thickness = (v - 0.5) * 0.2;
      
      const x = (r + thickness) * Math.cos(theta);
      const y = (r + thickness) * Math.sin(theta);
      const z = u * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 2, f: 1, uSegments: 128, vSegments: 8 })
  },

  logarithmic_spiral_curve: {
    name: "🐚 Logarithmic Spiral Curve - Golden Spiral Behavior",
    category: "foundational_curves",
    description: "r = a·e^(b·u) - Golden spiral / nautilus shell behavior",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 0.3;
      const b = params.e ?? 0.3;
      const height = params.f ?? 2;
      const turns = params.d ?? 3;
      
      const theta = u * Math.PI * 2 * turns;
      const r = a * Math.exp(b * theta);
      const thickness = (v - 0.5) * 0.15 * (1 + u);
      
      const x = (r + thickness) * Math.cos(theta);
      const y = (r + thickness) * Math.sin(theta);
      const z = u * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.3, e: 0.3, f: 2, uSegments: 128, vSegments: 12 })
  },

  lissajous_surface: {
    name: "∞ Lissajous Surface - Wave Interference Pattern",
    category: "foundational_curves",
    description: "x=A·sin(at+δ), y=B·sin(bt) - Wave interference pattern as surface",
    engineDynamics: "wave",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 2;
      const B = params.e ?? 2;
      const freq_a = params.f ?? 3;
      const freq_b = params.d ?? 2;
      const delta = params.e ?? Math.PI / 4;
      
      const t = u * Math.PI * 2;
      const thickness = (v - 0.5) * 0.3;
      
      const x = A * Math.sin(freq_a * t + delta);
      const y = B * Math.sin(freq_b * t);
      const z = thickness + Math.sin(t * 4) * 0.1;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 3, uSegments: 128, vSegments: 16 })
  },

  cycloid_surface: {
    name: "🎡 Cycloid Surface - Rolling Motion Geometry",
    category: "foundational_curves",
    description: "x=r(u−sin u), y=r(1−cos u) - Rolling circle geometry",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 1;
      const scale = params.e ?? 1;
      const cycles = params.f ?? 2;
      
      const t = u * Math.PI * 2 * cycles;
      const thickness = (v - 0.5) * 0.3;
      
      const x = r * (t - Math.sin(t)) * scale * 0.3;
      const y = r * (1 - Math.cos(t)) * scale;
      const z = thickness;
      
      return [x - 3, y - 1, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 2, uSegments: 128, vSegments: 8 })
  },

  trochoid_surface: {
    name: "⚙️ Trochoid Surface - Extended Rolling Geometry",
    category: "foundational_curves",
    description: "Extended cycloid with variable arm length",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const R = params.d ?? 2;
      const d = params.e ?? 1.5;
      const cycles = params.f ?? 3;
      
      const t = u * Math.PI * 2 * cycles;
      const thickness = (v - 0.5) * 0.2;
      
      const x = R * t - d * Math.sin(t);
      const y = R - d * Math.cos(t);
      const z = thickness;
      
      return [x * 0.2 - 2, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, f: 3, uSegments: 128, vSegments: 8 })
  }
};

// ============================================================================
// II. SURFACES OF REVOLUTION
// ============================================================================

export const SURFACES_OF_REVOLUTION: Record<string, ParametricSurface> = {

  revolution_sphere: {
    name: "🌐 Sphere - Perfect Symmetry Surface",
    category: "surfaces_of_revolution",
    description: "x=r·sin(u)·cos(v), y=r·sin(u)·sin(v), z=r·cos(u)",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 2;
      const squeeze_x = params.e ?? 1;
      const squeeze_y = params.f ?? 1;
      // F-G: Surfaces of revolution controls (low chaos)
      const f_radius = params.f ?? 0;
      const g_taper = params.g ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const radiusMod = 1 + f_radius * 0.02 + g_taper * 0.01 * Math.sin(theta * 3);
      
      const x = r * radiusMod * Math.sin(theta) * Math.cos(phi) * squeeze_x;
      const y = r * radiusMod * Math.sin(theta) * Math.sin(phi) * squeeze_y;
      const z = r * radiusMod * Math.cos(theta) + z_chaos * 0.02 * Math.sin(phi * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, g: 0, uSegments: 48, vSegments: 64 })
  },

  revolution_torus: {
    name: "🍩 Torus - Donut Loop Topology",
    category: "surfaces_of_revolution",
    description: "x=(R+r·cos u)·cos v, y=(R+r·cos u)·sin v, z=r·sin u",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const R = params.d ?? 2;
      const r = params.e ?? 0.7;
      const twist = params.f ?? 0;
      // F-G: Surfaces of revolution controls
      const f_radius = params.f ?? 0;
      const g_taper = params.g ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI * 2;
      
      const rMod = r * (1 + f_radius * 0.05) + g_taper * 0.02 * Math.sin(theta * 4);
      
      const x = (R + rMod * Math.cos(theta + twist * phi)) * Math.cos(phi);
      const y = (R + rMod * Math.cos(theta + twist * phi)) * Math.sin(phi);
      const z = rMod * Math.sin(theta + twist * phi) + z_chaos * 0.02 * Math.sin(phi * 6);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.7, f: 0, g: 0, uSegments: 48, vSegments: 64 })
  },

  revolution_cone: {
    name: "📐 Cone - Linear Taper Surface",
    category: "surfaces_of_revolution",
    description: "x=(1−v)r·cos u, y=(1−v)r·sin u, z=h·v",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 2;
      const h = params.e ?? 3;
      const taper = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      const radius = (1 - v * taper) * r;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = v * h;
      
      return [x, y, z - h/2];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 3, f: 1, uSegments: 48, vSegments: 32 })
  },

  revolution_paraboloid: {
    name: "📡 Paraboloid - Parabolic Revolution",
    category: "surfaces_of_revolution",
    description: "x=r·u·cos v, y=r·u·sin v, z=u²",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const height = params.e ?? 1;
      const curvature = params.f ?? 1;
      
      const theta = v * Math.PI * 2;
      const r = u * scale;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = Math.pow(u, 2) * curvature * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 1, uSegments: 32, vSegments: 64 })
  },

  revolution_hyperboloid: {
    name: "⏳ Hyperboloid - One Sheet Revolution",
    category: "surfaces_of_revolution",
    description: "Hyperboloid of one sheet - cooling tower shape",
    engineDynamics: "hyperbolic",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 1;
      const c = params.e ?? 2;
      const height = params.f ?? 3;
      
      const theta = v * Math.PI * 2;
      const t = (u - 0.5) * height;
      const r = a * Math.sqrt(1 + (t * t) / (c * c));
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = t;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, f: 3, uSegments: 32, vSegments: 64 })
  }
};

// ============================================================================
// III. EXTRUSIONS & SWEEPS
// ============================================================================

export const EXTRUSIONS_SWEEPS: Record<string, ParametricSurface> = {

  linear_extrude: {
    name: "📦 Linear Extrude - Wall-like Surfaces",
    category: "extrusions_sweeps",
    description: "x=Cx(u), y=Cy(u), z=v - Linear extrusion of curve",
    engineDynamics: "geometric",
    equation: (u: number, v: number, params: any) => {
      const width = params.d ?? 3;
      const height = params.e ?? 2;
      const waves = params.f ?? 2;
      
      const x = (u - 0.5) * width;
      const y = Math.sin(u * Math.PI * waves) * 0.5;
      const z = (v - 0.5) * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 2, uSegments: 64, vSegments: 16 })
  },

  helical_sweep: {
    name: "🧬 Helical Sweep - Threads & Springs",
    category: "extrusions_sweeps",
    description: "x=r·cos u, y=r·sin u, z=k·u - Helical thread geometry",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 1.5;
      const pitch = params.e ?? 0.5;
      const tube_r = params.f ?? 0.2;
      const turns = params.d ?? 4;
      
      const theta = u * Math.PI * 2 * turns;
      const phi = v * Math.PI * 2;
      
      const center_x = r * Math.cos(theta);
      const center_y = r * Math.sin(theta);
      const center_z = pitch * theta / (Math.PI * 2);
      
      const normal_x = Math.cos(theta);
      const normal_y = Math.sin(theta);
      
      const x = center_x + tube_r * Math.cos(phi) * normal_x;
      const y = center_y + tube_r * Math.cos(phi) * normal_y;
      const z = center_z + tube_r * Math.sin(phi);
      
      return [x, y, z - turns * pitch / 2];
    },
    defaultParams: getCleanDefaults({ d: 1.5, e: 0.5, f: 0.2, uSegments: 128, vSegments: 16 })
  },

  pipe_sweep: {
    name: "🔧 Pipe Sweep - Cables & Tendrils",
    category: "extrusions_sweeps",
    description: "S(u,v)=P(v)+R(v)C(u) - Sweep along path",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const path_scale = params.d ?? 3;
      const tube_r = params.e ?? 0.3;
      const waves = params.f ?? 2;
      
      const phi = v * Math.PI * 2;
      const t = u;
      
      const path_x = (t - 0.5) * path_scale;
      const path_y = Math.sin(t * Math.PI * waves) * 0.5;
      const path_z = Math.cos(t * Math.PI * waves * 0.5) * 0.3;
      
      const tangent_x = 1;
      const tangent_y = Math.cos(t * Math.PI * waves) * Math.PI * waves * 0.5;
      const len = Math.sqrt(tangent_x * tangent_x + tangent_y * tangent_y);
      
      const x = path_x + tube_r * Math.cos(phi) * (-tangent_y / len);
      const y = path_y + tube_r * Math.cos(phi) * (tangent_x / len);
      const z = path_z + tube_r * Math.sin(phi);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 0.3, f: 2, uSegments: 64, vSegments: 16 })
  }
};

// ============================================================================
// IV. LOFTS, SKINS & INTERPOLATIONS
// ============================================================================

export const LOFTS_INTERPOLATIONS: Record<string, ParametricSurface> = {

  loft_surface: {
    name: "🚗 Loft Surface - Smooth Profile Blend",
    category: "lofts_interpolations",
    description: "S(u,v)=Σ(wᵢ(v)·Cᵢ(u)) - Car bodies, organic forms",
    engineDynamics: "geometric",
    equation: (u: number, v: number, params: any) => {
      const width = params.d ?? 3;
      const height = params.e ?? 2;
      const morph = params.f ?? 1;
      
      const theta = u * Math.PI * 2;
      
      const r1 = 1;
      const r2 = 0.5 + 0.3 * Math.sin(theta * 2);
      const r = r1 * (1 - v) + r2 * v * morph;
      
      const x = r * Math.cos(theta) * width * 0.5;
      const y = r * Math.sin(theta);
      const z = (v - 0.5) * height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 2, f: 1, uSegments: 48, vSegments: 32 })
  },

  ruled_surface: {
    name: "📐 Ruled Surface - Architectural Panels",
    category: "lofts_interpolations",
    description: "S(u,v)=(1−v)C₁(u)+vC₂(u) - Linear interpolation",
    engineDynamics: "geometric",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const twist = params.e ?? 1;
      const height = params.f ?? 2;
      
      const theta1 = u * Math.PI * 2;
      const theta2 = u * Math.PI * 2 + twist * Math.PI;
      
      const x1 = Math.cos(theta1) * scale;
      const y1 = Math.sin(theta1) * scale;
      const z1 = -height / 2;
      
      const x2 = Math.cos(theta2) * scale * 0.5;
      const y2 = Math.sin(theta2) * scale * 0.5;
      const z2 = height / 2;
      
      const x = x1 * (1 - v) + x2 * v;
      const y = y1 * (1 - v) + y2 * v;
      const z = z1 * (1 - v) + z2 * v;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2, uSegments: 48, vSegments: 32 })
  }
};

// ============================================================================
// V. SUPERQUADRICS, SUPERFORMS & SUPERFAMILIES
// ============================================================================

export const SUPERQUADRICS_SUPERFORMS: Record<string, ParametricSurface> = {

  superellipse: {
    name: "🔷 Superellipse - Variable Curvature",
    category: "superquadrics",
    description: "x=a·cos^n(u), y=b·sin^n(u) - Squircle family",
    engineDynamics: "geometric",
    equation: (u: number, v: number, params: any) => {
      const a = params.d ?? 2;
      const b = params.e ?? 2;
      const n = params.f ?? 2.5;
      const height = params.d ?? 1;
      // L-M: Superquadric controls (medium-high chaos)
      const l_exponent = params.l ?? 0;
      const m_skew = params.m ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI * 2;
      const sign_cos = Math.sign(Math.cos(theta));
      const sign_sin = Math.sign(Math.sin(theta));
      
      const expMod = (n + l_exponent * 0.1) || 1;
      const skewMod = 1 + m_skew * 0.02 * Math.sin(theta * 3);
      
      const x = a * sign_cos * Math.pow(Math.abs(Math.cos(theta)), 2/(expMod || 1)) * skewMod;
      const y = b * sign_sin * Math.pow(Math.abs(Math.sin(theta)), 2/(expMod || 1)) * skewMod;
      const z = (v - 0.5) * height + z_chaos * 0.02 * Math.sin(theta * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 2.5, l: 0, m: 0, uSegments: 64, vSegments: 16 })
  },

  superquadric: {
    name: "🎲 Superquadric - SDF Compatible Form",
    category: "superquadrics",
    description: "Generalized superellipsoid for SDF & graphics",
    engineDynamics: "geometric",
    equation: (u: number, v: number, params: any) => {
      const A = params.d ?? 2;
      const B = params.e ?? 2;
      const n1 = params.f ?? 1;
      const n2 = params.d ?? 1;
      // L-M: Superquadric controls (medium-high chaos)
      const l_exponent = params.l ?? 0;
      const m_skew = params.m ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const eta = (u - 0.5) * Math.PI;
      const omega = v * Math.PI * 2;
      
      const n1Mod = n1 + l_exponent * 0.05;
      const n2Mod = n2 + m_skew * 0.05;
      
      const cos_eta = Math.cos(eta);
      const sin_eta = Math.sin(eta);
      const cos_omega = Math.cos(omega);
      const sin_omega = Math.sin(omega);
      
      const sign_ce = Math.sign(cos_eta);
      const sign_se = Math.sign(sin_eta);
      const sign_co = Math.sign(cos_omega);
      const sign_so = Math.sign(sin_omega);
      
      const x = A * sign_ce * Math.pow(Math.abs(cos_eta), n1Mod) * sign_co * Math.pow(Math.abs(cos_omega), n2Mod);
      const y = A * sign_ce * Math.pow(Math.abs(cos_eta), n1Mod) * sign_so * Math.pow(Math.abs(sin_omega), n2Mod);
      const z = B * sign_se * Math.pow(Math.abs(sin_eta), n1Mod) + z_chaos * 0.02 * Math.sin(omega * 6);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 2, f: 1, l: 0, m: 0, uSegments: 48, vSegments: 64 })
  },

  gielis_superformula: {
    name: "🌿 Gielis Superformula - Biological Organic Shapes",
    category: "superquadrics",
    description: "r=[|cos(mφ/4)/a|^n2 + |sin(mφ/4)/b|^n3]^(-1/n1) - Natural forms",
    engineDynamics: "biological",
    equation: (u: number, v: number, params: any) => {
      const a_param = params.d ?? 1;
      const b_param = params.e ?? 1;
      const m = params.f ?? 5;
      const n1 = params.d ?? 1;
      const n2 = params.e ?? 1;
      const n3 = params.f ?? 1;
      // L-M: Superquadric controls (medium-high chaos)
      const l_exponent = params.l ?? 0;
      const m_skew = params.m ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const phi = u * Math.PI * 2;
      const theta = v * Math.PI;
      
      const mMod = m + l_exponent * 0.2;
      const n1Mod = (n1 + m_skew * 0.1) || 1;
      
      const term1 = Math.pow(Math.abs(Math.cos(mMod * phi / 4) / (a_param || 1)), n2);
      const term2 = Math.pow(Math.abs(Math.sin(mMod * phi / 4) / (b_param || 1)), n3);
      const r_phi = Math.pow(term1 + term2, -1 / (n1Mod || 1));
      
      const term1_t = Math.pow(Math.abs(Math.cos(mMod * theta / 4) / (a_param || 1)), n2);
      const term2_t = Math.pow(Math.abs(Math.sin(mMod * theta / 4) / (b_param || 1)), n3);
      const r_theta = Math.pow(term1_t + term2_t, -1 / (n1Mod || 1));
      
      const r = r_phi * r_theta * (1 + z_chaos * 0.01 * Math.sin(phi * 8));
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 1, f: 5, l: 0, m: 0, uSegments: 64, vSegments: 48 })
  },

  supertoroid: {
    name: "🔮 Supertoroid - Torus + Superquadric Mix",
    category: "superquadrics",
    description: "Mix of torus with superquadric properties",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const R = params.d ?? 2;
      const r = params.e ?? 0.7;
      const n1 = params.f ?? 2;
      const n2 = params.d ?? 2;
      
      const eta = u * Math.PI * 2;
      const omega = v * Math.PI * 2;
      
      const sign_ce = Math.sign(Math.cos(eta));
      const sign_se = Math.sign(Math.sin(eta));
      const sign_co = Math.sign(Math.cos(omega));
      const sign_so = Math.sign(Math.sin(omega));
      
      const c_eta = sign_ce * Math.pow(Math.abs(Math.cos(eta)), 2/(n1 || 1));
      const s_eta = sign_se * Math.pow(Math.abs(Math.sin(eta)), 2/(n1 || 1));
      const c_omega = sign_co * Math.pow(Math.abs(Math.cos(omega)), 2/(n2 || 1));
      const s_omega = sign_so * Math.pow(Math.abs(Math.sin(omega)), 2/(n2 || 1));
      
      const x = (R + r * c_eta) * c_omega;
      const y = (R + r * c_eta) * s_omega;
      const z = r * s_eta;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.7, f: 2, uSegments: 48, vSegments: 64 })
  }
};

// ============================================================================
// VI. IMPLICIT → PARAMETRIC MAPS (Minimal Surfaces)
// ============================================================================

export const MINIMAL_SURFACES: Record<string, ParametricSurface> = {

  catenoid_minimal: {
    name: "🎺 Catenoid - Minimal Soap Film",
    category: "minimal_surfaces",
    description: "x=cosh(v)cos(u), y=cosh(v)sin(u), z=v",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 1;
      const height = params.e ?? 2;
      // N-O: Minimal surface controls (topological)
      const n_curvature = params.n ?? 0;
      const o_periodicity = params.o ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI * 2;
      const t = (v - 0.5) * height;
      
      const r = Math.cosh(t + n_curvature * 0.02) * scale;
      
      const x = r * Math.cos(theta) + o_periodicity * 0.02 * Math.sin(theta * 4);
      const y = r * Math.sin(theta) + o_periodicity * 0.02 * Math.cos(theta * 4);
      const z = t + z_chaos * 0.02 * Math.sin(theta * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 1, e: 2, n: 0, o: 0, uSegments: 48, vSegments: 32 })
  },

  helicoid_minimal: {
    name: "🌪️ Helicoid - Spiral Minimal Surface",
    category: "minimal_surfaces",
    description: "x=u·cos(v), y=u·sin(v), z=c·v",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const pitch = params.e ?? 0.5;
      const turns = params.f ?? 2;
      // N-O: Minimal surface controls (topological)
      const n_curvature = params.n ?? 0;
      const o_periodicity = params.o ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const r = (u - 0.5) * scale + n_curvature * 0.02 * Math.sin(v * Math.PI * 4);
      const theta = v * Math.PI * 2 * turns;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = pitch * theta + o_periodicity * 0.05 * Math.sin(theta * 3) + z_chaos * 0.03 * Math.sin(theta * 6);
      
      return [x, y, z - pitch * Math.PI * turns];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 2, n: 0, o: 0, uSegments: 32, vSegments: 64 })
  },

  enneper_minimal: {
    name: "🦋 Enneper Surface - Self-Intersecting Minimal",
    category: "minimal_surfaces",
    description: "x=u−u³/3+uv², y=v−v³/3+vu², z=u²−v²",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 0.5;
      const range = params.e ?? 1.5;
      // N-O: Minimal surface controls (topological)
      const n_curvature = params.n ?? 0;
      const o_periodicity = params.o ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const u_mapped = (u - 0.5) * range * 2;
      const v_mapped = (v - 0.5) * range * 2;
      
      const curveMod = 1 + n_curvature * 0.02;
      
      const x = scale * (u_mapped - u_mapped * u_mapped * u_mapped / 3 * curveMod + u_mapped * v_mapped * v_mapped);
      const y = scale * (v_mapped - v_mapped * v_mapped * v_mapped / 3 * curveMod + v_mapped * u_mapped * u_mapped);
      const z = scale * (u_mapped * u_mapped - v_mapped * v_mapped) + o_periodicity * 0.02 * Math.sin((u + v) * Math.PI * 4) + z_chaos * 0.02 * Math.sin(u * v * Math.PI * 10);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 1.5, n: 0, o: 0, uSegments: 48, vSegments: 48 })
  },

  gyroid_parametric: {
    name: "🔬 Gyroid - TPMS Lattice Structure",
    category: "minimal_surfaces",
    description: "sin(x)cos(y)+sin(y)cos(z)+sin(z)cos(x)=0 parametrized",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const frequency = params.e ?? 1;
      // N-O: Minimal surface controls (topological)
      const n_curvature = params.n ?? 0;
      const o_periodicity = params.o ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const freqMod = frequency + o_periodicity * 0.05;
      const x_coord = u * Math.PI * 2 * freqMod;
      const y_coord = v * Math.PI * 2 * freqMod;
      
      const implicit = Math.sin(x_coord) * Math.cos(y_coord) + 
                       Math.sin(y_coord) * Math.cos(x_coord * 0.5);
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      const z = implicit * scale * 0.3 * (1 + n_curvature * 0.02) + z_chaos * 0.02 * Math.sin(x_coord + y_coord);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, n: 0, o: 0, uSegments: 64, vSegments: 64 })
  }
};

// ============================================================================
// VII. WAVEFORMS & HARMONICS
// ============================================================================

export const WAVEFORMS_HARMONICS: Record<string, ParametricSurface> = {

  harmonic_plane: {
    name: "〰️ Harmonic Plane - Sinusoidal Surface",
    category: "waveforms_harmonics",
    description: "z=sin(au+bv) - Basic harmonic surface",
    engineDynamics: "wave",
    equation: (u: number, v: number, params: any) => {
      const freq_a = params.d ?? 4;
      const freq_b = params.e ?? 4;
      const amplitude = params.f ?? 0.5;
      const scale = params.d ?? 3;
      // P-Q: Waveform & harmonic controls (wave dynamics)
      const p_frequency = params.p ?? 0;
      const q_modulation = params.q ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const freqMod = 1 + p_frequency * 0.1;
      const modDepth = q_modulation * 0.1;
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const z = amplitude * Math.sin(freq_a * freqMod * u * Math.PI * 2 + freq_b * freqMod * v * Math.PI * 2) 
                + modDepth * Math.sin(u * v * Math.PI * 8)
                + z_chaos * 0.05 * Math.sin(u * v * Math.PI * 16);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 4, e: 4, f: 0.5, p: 0, q: 0, uSegments: 64, vSegments: 64 })
  },

  ripple_radial: {
    name: "💧 Ripple - Radial Harmonic",
    category: "waveforms_harmonics",
    description: "z=A·sin(k·√(x²+y²)) - Water ripple pattern",
    engineDynamics: "wave",
    equation: (u: number, v: number, params: any) => {
      const amplitude = params.d ?? 0.5;
      const frequency = params.e ?? 6;
      const scale = params.f ?? 3;
      const decay = params.d ?? 0.3;
      // P-Q: Waveform & harmonic controls (wave dynamics)
      const p_frequency = params.p ?? 0;
      const q_modulation = params.q ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const freqMod = frequency + p_frequency * 0.5;
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const r = Math.sqrt(x * x + y * y);
      
      const z = amplitude * Math.sin(freqMod * r) * Math.exp(-decay * r)
                + q_modulation * 0.05 * Math.sin(r * 3)
                + z_chaos * 0.02 * Math.sin(r * 12);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 0.5, e: 6, f: 3, p: 0, q: 0, uSegments: 64, vSegments: 64 })
  },

  standing_wave: {
    name: "🎵 Standing Wave - Interference Pattern",
    category: "waveforms_harmonics",
    description: "z=sin(ax)·sin(by) - Standing wave surface",
    engineDynamics: "wave",
    equation: (u: number, v: number, params: any) => {
      const freq_a = params.d ?? 3;
      const freq_b = params.e ?? 3;
      const amplitude = params.f ?? 0.5;
      const scale = params.d ?? 3;
      // P-Q: Waveform & harmonic controls (wave dynamics)
      const p_frequency = params.p ?? 0;
      const q_modulation = params.q ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const freqMod = 1 + p_frequency * 0.1;
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const z = amplitude * Math.sin(freq_a * freqMod * u * Math.PI) * Math.sin(freq_b * freqMod * v * Math.PI)
                + q_modulation * 0.05 * Math.cos((u + v) * Math.PI * 4)
                + z_chaos * 0.03 * Math.sin(u * v * Math.PI * 20);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 3, f: 0.5, p: 0, q: 0, uSegments: 64, vSegments: 64 })
  },

  spherical_harmonic: {
    name: "⚛️ Spherical Harmonic - Quantum Orbital Shape",
    category: "waveforms_harmonics",
    description: "Yₗᵐ(θ,φ) - Quantum orbital visualization",
    engineDynamics: "quantum",
    equation: (u: number, v: number, params: any) => {
      const l = Math.floor(params.d ?? 2);
      const m = Math.floor(params.e ?? 1);
      const scale = params.f ?? 2;
      
      const theta = v * Math.PI;
      const phi = u * Math.PI * 2;
      
      let Y_real = 0;
      if (l === 0) {
        Y_real = 0.5 * Math.sqrt(1 / Math.PI);
      } else if (l === 1) {
        if (m === 0) Y_real = 0.5 * Math.sqrt(3 / Math.PI) * Math.cos(theta);
        else Y_real = 0.5 * Math.sqrt(3 / Math.PI) * Math.sin(theta) * Math.cos(phi);
      } else if (l === 2) {
        if (m === 0) Y_real = 0.25 * Math.sqrt(5 / Math.PI) * (3 * Math.cos(theta) * Math.cos(theta) - 1);
        else if (m === 1) Y_real = 0.5 * Math.sqrt(15 / Math.PI) * Math.sin(theta) * Math.cos(theta) * Math.cos(phi);
        else Y_real = 0.25 * Math.sqrt(15 / Math.PI) * Math.sin(theta) * Math.sin(theta) * Math.cos(2 * phi);
      } else {
        Y_real = Math.sin(l * theta) * Math.cos(m * phi);
      }
      
      const r = scale * (1 + 0.5 * Math.abs(Y_real));
      
      const x = r * Math.sin(theta) * Math.cos(phi);
      const y = r * Math.sin(theta) * Math.sin(phi);
      const z = r * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1, f: 2, uSegments: 64, vSegments: 48 })
  }
};

// ============================================================================
// VIII. FRACTALS & NOISE PARAMETRICS
// ============================================================================

export const FRACTALS_NOISE: Record<string, ParametricSurface> = {

  fractal_heightmap: {
    name: "🏔️ Fractal Heightmap - Terrain Surface",
    category: "fractals_noise",
    description: "z=noise2D(u,v) - Procedural terrain",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 3;
      const amplitude = params.e ?? 1;
      const octaves = Math.floor(params.f ?? 4);
      const persistence = params.d ?? 0.5;
      // V-W: Fractal & noise controls (high chaos)
      const v_iterations = params.v ?? 0;
      const w_stochastic = params.w ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const octaveMod = Math.max(1, octaves + Math.floor(v_iterations * 0.1));
      
      let noise = 0;
      let amp = 1;
      let freq = 1;
      
      for (let i = 0; i < octaveMod; i++) {
        const nx = u * freq * 4 + i * 0.1 + w_stochastic * 0.01;
        const ny = v * freq * 4 + i * 0.2 + w_stochastic * 0.01;
        noise += amp * (Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453 % 1 - 0.5);
        amp *= persistence;
        freq *= 2;
      }
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const z = noise * amplitude + z_chaos * 0.02 * Math.sin(u * v * Math.PI * 20);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 4, v: 0, w: 0, uSegments: 64, vSegments: 64 })
  },

  ridged_fractal: {
    name: "⛰️ Ridged Fractal - Sharp Mountain Ridges",
    category: "fractals_noise",
    description: "z=|1−2|noise(u,v)|| - Sharp ridge formations",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 3;
      const amplitude = params.e ?? 1;
      const frequency = params.f ?? 3;
      const sharpness = params.d ?? 2;
      // V-W: Fractal & noise controls (high chaos)
      const v_iterations = params.v ?? 0;
      const w_stochastic = params.w ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const freqMod = frequency + v_iterations * 0.1;
      const nx = u * freqMod * 4 + w_stochastic * 0.01;
      const ny = v * freqMod * 4 + w_stochastic * 0.01;
      
      const noise = Math.sin(nx * 12.9898 + ny * 78.233) * 43758.5453 % 1;
      const ridged = Math.abs(1 - 2 * Math.abs(noise - 0.5));
      
      const x = (u - 0.5) * scale;
      const y = (v - 0.5) * scale;
      const z = Math.pow(ridged, sharpness) * amplitude + z_chaos * 0.03 * Math.sin(u * v * Math.PI * 16);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 3, e: 1, f: 3, v: 0, w: 0, uSegments: 64, vSegments: 64 })
  },

  fractal_sphere: {
    name: "🌍 Fractal Sphere - Noisy Planet",
    category: "fractals_noise",
    description: "(x,y,z)=normalize(x,y,z)(r+noise) - Planetary terrain",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const r = params.d ?? 2;
      const noise_amp = params.e ?? 0.3;
      const frequency = params.f ?? 5;
      
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      const nx = Math.sin(theta) * Math.cos(phi) * frequency;
      const ny = Math.sin(theta) * Math.sin(phi) * frequency;
      const nz = Math.cos(theta) * frequency;
      
      const noise = (Math.sin(nx * 12.9898 + ny * 78.233 + nz * 45.678) * 43758.5453 % 1 - 0.5) * 2;
      const radius = r + noise * noise_amp;
      
      const x = radius * Math.sin(theta) * Math.cos(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.3, f: 5, uSegments: 64, vSegments: 48 })
  },

  mandelbulb_distance: {
    name: "🔮 Mandelbulb - 3D Fractal Distance Field",
    category: "fractals_noise",
    description: "x=r^n·sin(θ)cos(φ), y=r^n·sin(θ)sin(φ), z=r^n·cos(θ)",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const power = params.d ?? 8;
      const scale = params.e ?? 2;
      const iterations = Math.floor(params.f ?? 5);
      
      const theta = u * Math.PI;
      const phi = v * Math.PI * 2;
      
      let x = Math.sin(theta) * Math.cos(phi) * scale;
      let y = Math.sin(theta) * Math.sin(phi) * scale;
      let z = Math.cos(theta) * scale;
      
      for (let i = 0; i < iterations; i++) {
        const r = Math.sqrt(x * x + y * y + z * z);
        if (r > 2) break;
        
        const theta_n = Math.acos(z / Math.max(0.0001, r));
        const phi_n = Math.atan2(y, x);
        
        const r_n = Math.pow(r, power);
        x = r_n * Math.sin(theta_n * power) * Math.cos(phi_n * power) + Math.sin(theta) * Math.cos(phi);
        y = r_n * Math.sin(theta_n * power) * Math.sin(phi_n * power) + Math.sin(theta) * Math.sin(phi);
        z = r_n * Math.cos(theta_n * power) + Math.cos(theta);
      }
      
      const final_r = Math.sqrt(x * x + y * y + z * z);
      const normalized_r = Math.min(final_r, 2) / 2;
      
      return [
        normalized_r * scale * Math.sin(theta) * Math.cos(phi),
        normalized_r * scale * Math.sin(theta) * Math.sin(phi),
        normalized_r * scale * Math.cos(theta)
      ];
    },
    defaultParams: getCleanDefaults({ d: 8, e: 2, f: 5, uSegments: 64, vSegments: 48 })
  }
};

// ============================================================================
// IX. SPECIAL PARAMETRIC STRUCTURES
// ============================================================================

export const SPECIAL_STRUCTURES: Record<string, ParametricSurface> = {

  mobius_strip_param: {
    name: "♾️ Möbius Strip - One-Sided Surface",
    category: "special_structures",
    description: "Non-orientable surface with single edge",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const R = params.d ?? 2;
      const width = params.e ?? 0.5;
      const twists = params.f ?? 1;
      // R-S: Special structures controls (topological twist)
      const r_twist = params.r ?? 0;
      const s_fold = params.s ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI * 2;
      const s = (v - 0.5) * width;
      const twistMod = twists + r_twist * 0.05;
      const half_theta = theta * twistMod / 2;
      
      const x = (R + s * Math.cos(half_theta)) * Math.cos(theta) + s_fold * 0.02 * Math.sin(theta * 4);
      const y = (R + s * Math.cos(half_theta)) * Math.sin(theta) + s_fold * 0.02 * Math.cos(theta * 4);
      const z = s * Math.sin(half_theta) + z_chaos * 0.02 * Math.sin(theta * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 1, r: 0, s: 0, uSegments: 64, vSegments: 16 })
  },

  klein_bottle_param: {
    name: "🍶 Klein Bottle - 4D Immersion",
    category: "special_structures",
    description: "Non-orientable closed surface - 4D object in 3D",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 1;
      // R-S: Special structures controls (topological twist)
      const r_twist = params.r ?? 0;
      const s_fold = params.s ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const u_mapped = u * Math.PI * 2;
      const v_mapped = v * Math.PI * 2;
      
      const cos_u = Math.cos(u_mapped);
      const sin_u = Math.sin(u_mapped);
      const cos_v = Math.cos(v_mapped);
      const sin_v = Math.sin(v_mapped);
      
      let x, y, z;
      
      if (u < 0.5) {
        const r = 4 * (1 - cos_u / 2) * (1 + r_twist * 0.02);
        x = 6 * cos_u * (1 + sin_u) + r * cos_u * cos_v;
        y = 16 * sin_u + r * sin_u * cos_v;
      } else {
        const r = 4 * (1 - cos_u / 2) * (1 + r_twist * 0.02);
        x = 6 * cos_u * (1 + sin_u) + r * cos_v * Math.cos(u_mapped - Math.PI);
        y = 16 * sin_u;
      }
      
      z = 4 * (1 - cos_u / 2) * sin_v + s_fold * 0.1 * Math.sin(u_mapped * 3);
      
      return [x * scale * 0.1 + z_chaos * 0.01 * Math.sin(v_mapped * 8), y * scale * 0.1, z * scale * 0.2];
    },
    defaultParams: getCleanDefaults({ d: 1, r: 0, s: 0, uSegments: 64, vSegments: 32 })
  },

  boys_surface: {
    name: "🎭 Boy's Surface - Non-Orientable Immersion",
    category: "special_structures",
    description: "Immersion of real projective plane in 3D",
    engineDynamics: "topological",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      // R-S: Special structures controls (topological twist)
      const r_twist = params.r ?? 0;
      const s_fold = params.s ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const u_mapped = u * Math.PI;
      const v_mapped = v * Math.PI * 2;
      
      const sqrt2 = Math.sqrt(2);
      const cos_u = Math.cos(u_mapped);
      const sin_u = Math.sin(u_mapped);
      const cos_v = Math.cos(v_mapped);
      const sin_v = Math.sin(v_mapped);
      const cos_2v = Math.cos(2 * v_mapped);
      const sin_2v = Math.sin(2 * v_mapped);
      
      const denom = 2 - sqrt2 * sin_u * sin_u * sin_u * sin_2v + r_twist * 0.01;
      
      const x = (sqrt2 * cos_u * cos_u * cos_2v + cos_u * sin_v) / denom + s_fold * 0.02 * Math.sin(u_mapped * 4);
      const y = (sqrt2 * cos_u * cos_u * sin_2v - cos_u * cos_v) / denom + s_fold * 0.02 * Math.cos(v_mapped * 4);
      const z = (3 * sin_u * sin_u) / denom - 1 + z_chaos * 0.02 * Math.sin(u_mapped * v_mapped * 8);
      
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return [0, 0, 0];
      }
      
      return [x * scale, y * scale, z * scale];
    },
    defaultParams: getCleanDefaults({ d: 2, r: 0, s: 0, uSegments: 64, vSegments: 64 })
  }
};

// ============================================================================
// X. PHI-BASED & CUSTOM ΔMENSION FORMS
// ============================================================================

const PHI = (1 + Math.sqrt(5)) / 2; // Golden ratio ≈ 1.618

export const PHI_DIMENSION_FORMS: Record<string, ParametricSurface> = {

  phi_harmonic_sphere: {
    name: "🌟 Φ-Harmonic Sphere - Golden Ratio Modulated",
    category: "phi_dimension",
    description: "r(θ,φ)=1+0.618·sin(3θ+φ) - Phi-modulated sphere",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const base_r = params.d ?? 2;
      const phi_amp = params.e ?? 0.5;
      const harmonic = params.f ?? 3;
      // T-U: Φ-based form controls (golden ratio dynamics)
      const t_golden = params.t ?? 0;
      const u_spiral = params.u ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const theta = u * Math.PI;
      const phi_angle = v * Math.PI * 2;
      
      const phiMod = PHI + t_golden * 0.02;
      const r = base_r * (1 + phi_amp * (1 / phiMod) * Math.sin(harmonic * theta + phi_angle))
                + u_spiral * 0.02 * Math.sin(theta * 5 + phi_angle * 3);
      
      const x = r * Math.sin(theta) * Math.cos(phi_angle);
      const y = r * Math.sin(theta) * Math.sin(phi_angle);
      const z = r * Math.cos(theta) + z_chaos * 0.02 * Math.sin(phi_angle * 8);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.5, f: 3, t: 0, u: 0, uSegments: 64, vSegments: 48 })
  },

  portal_vortex: {
    name: "🌀 Portal Vortex - Phi Spiral Gateway",
    category: "phi_dimension",
    description: "x=r·cos(uφ), y=r·sin(uφ), z=sin(vφ) - Vortex portal",
    engineDynamics: "radial",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const depth = params.e ?? 1.5;
      const twist = params.f ?? PHI;
      // T-U: Φ-based form controls (golden ratio dynamics)
      const t_golden = params.t ?? 0;
      const u_spiral = params.u ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const twistMod = twist + t_golden * 0.05;
      const r = (1 - v) * scale + 0.3 + u_spiral * 0.02 * Math.sin(v * Math.PI * 4);
      const theta = u * Math.PI * 2 * twistMod + v * Math.PI * twistMod;
      
      const x = r * Math.cos(theta);
      const y = r * Math.sin(theta);
      const z = Math.sin(v * Math.PI * PHI) * depth - depth * 0.5 + z_chaos * 0.03 * Math.sin(theta * 6);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.5, f: 1.618, t: 0, u: 0, uSegments: 64, vSegments: 48 })
  },

  dual_mirror_phi_pi: {
    name: "🔯 Dual-Mirrored Φ–π Map",
    category: "phi_dimension",
    description: "x=sin(uπ)+cos(vφ), y=cos(uπ)−sin(vφ), z=φ·sin(u+v)",
    engineDynamics: "symmetry",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const phi_weight = params.e ?? PHI;
      const pi_weight = params.f ?? Math.PI;
      // T-U: Φ-based form controls (golden ratio dynamics)
      const t_golden = params.t ?? 0;
      const u_spiral = params.u ?? 0;
      // Z: Chaos throttle
      const z_chaos = params.z ?? 0;
      
      const u_scaled = u * pi_weight;
      const v_scaled = v * (phi_weight + t_golden * 0.05);
      
      const x = (Math.sin(u_scaled) + Math.cos(v_scaled)) * scale * 0.5 + u_spiral * 0.02 * Math.sin(u * v * Math.PI * 6);
      const y = (Math.cos(u_scaled) - Math.sin(v_scaled)) * scale * 0.5 + u_spiral * 0.02 * Math.cos(u * v * Math.PI * 6);
      const z = phi_weight * Math.sin(u + v) * scale * 0.3 + z_chaos * 0.03 * Math.sin(u_scaled + v_scaled);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 1.618, f: 3.14159, t: 0, u: 0, uSegments: 64, vSegments: 64 })
  },

  time_cross_field: {
    name: "✝️ Time-Shifted Cross-Field",
    category: "phi_dimension",
    description: "Temporal geometry cross - map of time",
    engineDynamics: "wave",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      const time_shift = params.e ?? 0;
      const cross_depth = params.f ?? 0.5;
      
      const x = (u - 0.5) * scale * 2;
      const y = (v - 0.5) * scale * 2;
      
      const cross_x = Math.exp(-Math.pow(y, 2) * 5);
      const cross_y = Math.exp(-Math.pow(x, 2) * 5);
      const cross = Math.max(cross_x, cross_y);
      
      const z = cross * cross_depth * (1 + Math.sin(time_shift * Math.PI * 2) * 0.2);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0, f: 0.5, uSegments: 64, vSegments: 64 })
  },

  phi_pi_fusion: {
    name: "🔮 Φ-π Fusion Surface",
    category: "phi_dimension",
    description: "Unified golden ratio and pi relationship",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const scale = params.d ?? 2;
      
      const theta = u * Math.PI * 2;
      const phi_angle = v * Math.PI;
      
      const r_phi = 1 + 0.3 * Math.cos(PHI * theta);
      const r_pi = 1 + 0.2 * Math.sin(Math.PI * phi_angle);
      const r = scale * r_phi * r_pi;
      
      const x = r * Math.sin(phi_angle) * Math.cos(theta);
      const y = r * Math.sin(phi_angle) * Math.sin(theta);
      const z = r * Math.cos(phi_angle) * PHI / Math.PI;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, uSegments: 64, vSegments: 48 })
  },

  golden_spiral_torus: {
    name: "🌊 Golden Spiral Torus",
    category: "phi_dimension",
    description: "Torus modulated by golden spiral",
    engineDynamics: "fractional",
    equation: (u: number, v: number, params: any) => {
      const R = params.d ?? 2;
      const r = params.e ?? 0.6;
      const spiral_strength = params.f ?? 0.3;
      
      const theta = u * Math.PI * 2;
      const phi_angle = v * Math.PI * 2;
      
      const golden_mod = 1 + spiral_strength * Math.sin(PHI * theta + phi_angle);
      const tube_r = r * golden_mod;
      
      const x = (R + tube_r * Math.cos(theta)) * Math.cos(phi_angle);
      const y = (R + tube_r * Math.cos(theta)) * Math.sin(phi_angle);
      const z = tube_r * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ d: 2, e: 0.6, f: 0.3, uSegments: 64, vSegments: 48 })
  }
};

// ============================================================================
// COMBINED EXPORT - ALL PARAMETRIC LIBRARY SHAPES
// ============================================================================

export const PARAMETRIC_LIBRARY_PACK: Record<string, ParametricSurface> = {
  ...FOUNDATIONAL_CURVES,
  ...SURFACES_OF_REVOLUTION,
  ...EXTRUSIONS_SWEEPS,
  ...LOFTS_INTERPOLATIONS,
  ...SUPERQUADRICS_SUPERFORMS,
  ...MINIMAL_SURFACES,
  ...WAVEFORMS_HARMONICS,
  ...FRACTALS_NOISE,
  ...SPECIAL_STRUCTURES,
  ...PHI_DIMENSION_FORMS
};

// Category metadata for shape browser integration
export const PARAMETRIC_LIBRARY_CATEGORIES = [
  {
    id: 'foundational_curves',
    name: '📏 I. Foundational Curves',
    icon: '📏',
    description: '2D parametric curves extended to 3D surfaces - lines, circles, spirals',
    engineDynamics: { primaryType: 'radial' as const, influenceFactors: ['circle', 'spiral', 'cycloid'] },
    shapes: Object.keys(FOUNDATIONAL_CURVES)
  },
  {
    id: 'surfaces_of_revolution',
    name: '🌐 II. Surfaces of Revolution',
    icon: '🌐',
    description: 'Sphere, torus, cone, paraboloid - rotational symmetry surfaces',
    engineDynamics: { primaryType: 'radial' as const, influenceFactors: ['revolution', 'axial symmetry'] },
    shapes: Object.keys(SURFACES_OF_REVOLUTION)
  },
  {
    id: 'extrusions_sweeps',
    name: '🔧 III. Extrusions & Sweeps',
    icon: '🔧',
    description: 'Linear extrusions, helical sweeps, pipe geometry',
    engineDynamics: { primaryType: 'geometric' as const, influenceFactors: ['extrusion', 'sweep path'] },
    shapes: Object.keys(EXTRUSIONS_SWEEPS)
  },
  {
    id: 'lofts_interpolations',
    name: '🚗 IV. Lofts & Interpolations',
    icon: '🚗',
    description: 'Loft surfaces, ruled surfaces - smooth profile blending',
    engineDynamics: { primaryType: 'geometric' as const, influenceFactors: ['loft', 'interpolation'] },
    shapes: Object.keys(LOFTS_INTERPOLATIONS)
  },
  {
    id: 'superquadrics',
    name: '🎲 V. Superquadrics & Superforms',
    icon: '🎲',
    description: 'Superellipse, superquadric, Gielis superformula - biological forms',
    engineDynamics: { primaryType: 'biological' as const, influenceFactors: ['superformula', 'organic'] },
    shapes: Object.keys(SUPERQUADRICS_SUPERFORMS)
  },
  {
    id: 'minimal_surfaces',
    name: '🎺 VI. Minimal Surfaces',
    icon: '🎺',
    description: 'Catenoid, helicoid, Enneper, gyroid - soap film mathematics',
    engineDynamics: { primaryType: 'topological' as const, influenceFactors: ['minimal area', 'curvature'] },
    shapes: Object.keys(MINIMAL_SURFACES)
  },
  {
    id: 'waveforms_harmonics',
    name: '〰️ VII. Waveforms & Harmonics',
    icon: '〰️',
    description: 'Harmonic planes, ripples, spherical harmonics - wave physics',
    engineDynamics: { primaryType: 'wave' as const, influenceFactors: ['harmonic', 'interference'] },
    shapes: Object.keys(WAVEFORMS_HARMONICS)
  },
  {
    id: 'fractals_noise',
    name: '🏔️ VIII. Fractals & Noise',
    icon: '🏔️',
    description: 'Fractal terrain, ridged fractals, Mandelbulb - procedural geometry',
    engineDynamics: { primaryType: 'fractional' as const, influenceFactors: ['self-similarity', 'noise'] },
    shapes: Object.keys(FRACTALS_NOISE)
  },
  {
    id: 'special_structures',
    name: '♾️ IX. Special Structures',
    icon: '♾️',
    description: 'Möbius strip, Klein bottle, Boy\'s surface - topological oddities',
    engineDynamics: { primaryType: 'topological' as const, influenceFactors: ['non-orientable', 'immersion'] },
    shapes: Object.keys(SPECIAL_STRUCTURES)
  },
  {
    id: 'phi_dimension',
    name: '🌟 X. Φ-Based Δmension Forms',
    icon: '🌟',
    description: 'Golden ratio surfaces, phi-pi fusion, portal vortex - Δmension exclusives',
    engineDynamics: { primaryType: 'fractional' as const, influenceFactors: ['golden ratio', 'phi', 'pi'] },
    shapes: Object.keys(PHI_DIMENSION_FORMS)
  }
];

// Log library stats
console.log(`📐 Parametric Library Pack loaded: ${Object.keys(PARAMETRIC_LIBRARY_PACK).length} shapes across ${PARAMETRIC_LIBRARY_CATEGORIES.length} categories`);
console.log(`   I. Foundational Curves: ${Object.keys(FOUNDATIONAL_CURVES).length}`);
console.log(`   II. Surfaces of Revolution: ${Object.keys(SURFACES_OF_REVOLUTION).length}`);
console.log(`   III. Extrusions & Sweeps: ${Object.keys(EXTRUSIONS_SWEEPS).length}`);
console.log(`   IV. Lofts & Interpolations: ${Object.keys(LOFTS_INTERPOLATIONS).length}`);
console.log(`   V. Superquadrics: ${Object.keys(SUPERQUADRICS_SUPERFORMS).length}`);
console.log(`   VI. Minimal Surfaces: ${Object.keys(MINIMAL_SURFACES).length}`);
console.log(`   VII. Waveforms & Harmonics: ${Object.keys(WAVEFORMS_HARMONICS).length}`);
console.log(`   VIII. Fractals & Noise: ${Object.keys(FRACTALS_NOISE).length}`);
console.log(`   IX. Special Structures: ${Object.keys(SPECIAL_STRUCTURES).length}`);
console.log(`   X. Φ-Dimension Forms: ${Object.keys(PHI_DIMENSION_FORMS).length}`);
