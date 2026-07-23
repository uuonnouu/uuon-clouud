/**
 * IFS FRACTALS REGISTRY
 * UNIFIED_SHAPES entries for all IFS/raymarched fractal shapes.
 *
 * These shapes are rendered via WebGL GPU raymarching (not CPU parametric tessellation).
 * The `equation` field is a stub — it is never called for IFS shapes because the
 * IFSRenderer component intercepts them before ParametricSurface kicks in.
 *
 * A-Z bridge (from shapeCategories.ts docs):
 *   A = camera distance (dv)
 *   B = field of view    (fov)
 *   C = brightness       (bright)
 *
 * defaultParams mirrors IFS_SHAPE_PRESETS from ifsStore.ts so that the AI assistant,
 * formula display, and export metadata all pull the same values the renderer uses.
 */

import { SurfaceParameters } from '../types/math';

interface ParametricSurface {
  name: string;
  description?: string;
  formulaType?: string;
  category?: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

const GPU_STUB = (_u: number, _v: number, _p: SurfaceParameters): [number, number, number] => [0, 0, 0];

export const IFS_FRACTALS_REGISTRY: Record<string, ParametricSurface> = {

  menger_sponge: {
    name: '🌀 Menger Sponge',
    description: 'Classic IFS fractal constructed by iteratively removing the central third of each face cube. Hausdorff dimension ≈ 2.727. Infinite surface area, zero volume. Created by Karl Menger (1926). GPU raymarched with fold-based IFS engine.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.4, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  mandelbox_fractal: {
    name: '🌀 Mandelbox Fractal',
    description: 'Box-fold IFS attractor discovered by Tom Lowe (2010). Combines ball-fold and box-fold transforms to create a bulbous compound fractal with a rich interior structure. Scale factor controls self-similarity.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  kleinian_fractal: {
    name: '🌀 Kleinian Fractal',
    description: 'Iterated sphere-inversion attractor from Kleinian group theory (19th-century complex analysis). Conformal map creates bubble/limit-set geometry with infinite recursive depth. Stable below fold-scale 1.85.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  lattice_fractal: {
    name: '🌀 Lattice Fractal',
    description: 'Periodic-wrapping IFS attractor that folds space into a cubic unit cell on each iteration. Creates infinite, repeating compound lattice structures reminiscent of crystal symmetry groups.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.4, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  tetrahedral_fractal: {
    name: '🌀 Tetrahedral Fractal',
    description: 'Td-symmetry IFS attractor (24-element symmetry group). Mirrors into the fundamental tetrahedral domain on each fold, producing 4-fold angular compound forms with icosahedral-adjacent structure.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.4, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  anisotropic_menger: {
    name: '🌀 Anisotropic Menger',
    description: 'Menger sponge variant with non-uniform offset parameters (ox≠oy≠oz), breaking the three-axis symmetry to produce stretched, directional fractal geometry. Hausdorff dimension shifts with anisotropy.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.4, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  chaos_boundary_menger: {
    name: '🌀 Chaos Boundary Menger',
    description: 'Menger sponge operated at the edge of its stable attractor basin. High iteration depth and near-critical scale parameters expose the fractal boundary between order and chaos. Orbit trapping highlights the Julia-set-like boundary.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  compound_ifs_blend: {
    name: '🌀 Compound IFS Blend',
    description: 'Weighted interpolation between two IFS attractor types (Menger and Mandelbox). The blend parameter smoothly morphs between attractor basins, revealing the topological transition landscape between fractal families.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  icosahedral_ifs: {
    name: '🌀 Icosahedral IFS',
    description: 'Ih-symmetry IFS attractor (120-element symmetry group). Fold planes derived from golden-ratio (Φ) icosahedral mirror planes. Produces quasicrystalline attractors with 5-fold axes, structurally adjacent to virus capsids and fullerenes.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  fractal_weave: {
    name: '🌀 Fractal Weave',
    description: 'IFS-based textile weave simulation. Warp and weft thread paths are generated by iterating IFS fold maps, creating fractal thread intersections at multiple scales. Thread radius and float length are independently controllable.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 3.0, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  reaction_diffusion_ifs: {
    name: '🌀 Reaction-Diffusion IFS',
    description: 'Turing reaction-diffusion system (feed/kill kinetics) used to seed an IFS fold attractor. The RD pattern creates an inhomogeneous initial condition that the IFS then iterates into 3D fractal geometry. Inspired by Alan Turing\'s 1952 morphogenesis paper.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 4.5, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  lsystem_ifs: {
    name: '🌀 L-System IFS',
    description: 'Lindenmayer system (plant growth grammar) blended with an IFS fold attractor. Branch geometry is generated by recursive L-system rewriting rules while the IFS adds fractal self-similarity at each branching level. Supports vascular, neural, mycelium, and crystal growth types.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.5, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  // ── 5 New Raymarched Engines ─────────────────────────────────────────────

  mandelbulb_raymarched: {
    name: '🌀 Mandelbulb',
    description: 'True 3D analogue of the Mandelbrot set, discovered by Daniel White and Paul Nylander (2009). Uses a spherical-coordinate power-8 iteration: z → z^n + c. Produces organic bulbous spikes with infinite self-similar detail. Supports 5 variants (Standard, Spikey, Slicey, Hilly, Smooth) and cross-section slicing. GPU raymarched via distance-estimator (DE) algorithm.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 2.6, b: 58, c: 1.2, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  platonic_icosa: {
    name: '🌀 Platonic Icosahedral IFS',
    description: 'Iterated Function System driven by Ih icosahedral fold symmetry (120-element group), with fold size scaled by the golden ratio Φ ≈ 0.618. Creates compound icosahedral attractors with 5-fold quasicrystalline symmetry — adjacent to fullerene C60 and virus capsid geometry.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  platonic_octa: {
    name: '🌀 Platonic Octahedral IFS',
    description: 'IFS attractor with Oh octahedral fold symmetry (48-element group). Absolute-value and coordinate-sort operations reduce each point to the fundamental octahedral domain, producing highly symmetric cross-shaped compound attractors with 8-fold structure.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.5, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  platonic_dodeca: {
    name: '🌀 Platonic Dodecahedral IFS',
    description: 'IFS attractor with Ih dodecahedral fold symmetry (120-element group). Mirror planes derived from combined cubic and icosahedral normals produce 5-fold pentagonal compound forms with 12-face self-similar structure. Close relative of the icosahedral attractor with distinct interior geometry.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

  menger_kleinian_v2: {
    name: '🌀 Menger–Kleinian v2',
    description: 'Hybrid IFS combining Kleinian sphere-inversion folds (conformal group) with Menger cubic folding. A per-iteration torsion twist (twist parameter) rotates the attractor domain, breaking cubic symmetry. Orbit trapping with a sphere container highlights the fractal boundary between the two attractor basins. Enhanced over the original Kleinian fractal with added twist, trap, and higher raymarch resolution.',
    formulaType: 'ifs_raymarched',
    category: 'ifs_fractals',
    equation: GPU_STUB,
    defaultParams: { a: 5.0, b: 55, c: 1.6, x: 1, y: 1, z: 1, uSegments: 32, vSegments: 32 },
  },

};

export const IFS_FRACTALS_REGISTRY_COUNT = Object.keys(IFS_FRACTALS_REGISTRY).length;
