export interface ParameterManifest {
  activeParams: string[];
  labels: Record<string, string>;
}

export const PARAMETER_MANIFESTS: Record<string, ParameterManifest> = {
  sphere: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Radius', b: 'Pole Scale', c: 'Equator Scale' },
  },
  torus: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Major Radius', b: 'Tube Radius', c: 'Tube Scale', d: 'Twist' },
  },
  klein_bottle: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Bottle Scale', b: 'Inner Radius', c: 'Neck Width', d: 'Crossover' },
  },
  mobius_strip: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Strip Width', b: 'Loop Radius', c: 'Twist Count' },
  },
  trefoil_knot: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Knot Radius', b: 'Tube Radius', c: 'P Winds', d: 'Q Winds', e: 'Tube Detail' },
  },
  figure_eight_knot: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Scale', b: 'Tube Radius', c: 'Knot Complexity' },
  },
  hopf_fibration: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Base Radius', b: 'Fiber Width', c: 'Phase Angle', d: 'Fiber Count' },
  },
  clifford_torus: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Major Radius', b: 'Minor Radius', c: 'Projection Scale' },
  },
  boys_surface: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Surface Scale', b: 'Deformation', c: 'Smoothness' },
  },
  calabi_yau_manifold: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Scale', b: 'Complex Phase', c: 'Compactification', d: 'Curvature', e: 'Dimension Fold' },
  },
  mandelbulb: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Power N', b: 'Scale', c: 'Bailout Radius', d: 'Iterations' },
  },
  rossler_attractor: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'A Parameter', b: 'B Parameter', c: 'C Parameter', d: 'Time Scale' },
  },
  julia_set_3d: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Real c', b: 'Imaginary c', c: 'Exponent', d: 'Bailout' },
  },
  hydrogen_1s_orbital: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Bohr Radius', b: 'Density Cutoff', c: 'Shell Scale' },
  },
  hydrogen_2p_orbital: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Orbital Scale', b: 'Lobe Size', c: 'Angular Momentum', d: 'Magnetic Quantum' },
  },
  schrodinger_time_dependent: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Wave Frequency', b: 'Amplitude', c: 'Wave Number', d: 'Time Step', e: 'Phase Shift' },
  },
  qubit_bloch_sphere: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Theta θ', b: 'Phi φ', c: 'Sphere Radius' },
  },
  wheeler_dewitt_equation: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Scale Factor', b: 'Spatial Curvature', c: 'Λ Constant', d: 'Potential V' },
  },
  schwarzschild_metric_spacetime: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Schwarzschild Radius', b: 'Time Range', c: 'Radial Extent', d: 'Embedding Depth' },
  },
  gravitational_wave: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Wave Amplitude', b: 'Frequency', c: 'Propagation Speed', d: 'Polarization', e: 'Decay Rate' },
  },
  kerr_rotating_black_hole: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Spin Parameter', b: 'Mass M', c: 'Angular Momentum', d: 'Observer Inclination' },
  },
  wormhole_einstein_rosen: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Throat Radius', b: 'Wormhole Length', c: 'Flare Exponent', d: 'Exotic Matter' },
  },
  dna_double_helix: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Helix Radius', b: 'Rise per Turn', c: 'Groove Width', d: 'Backbone Offset', e: 'Turn Count' },
  },
  flower_of_life: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Circle Radius', b: 'Ring Count', c: 'Overlap Factor' },
  },
  sri_yantra: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Overall Scale', b: 'Triangle Size', c: 'Bindu Radius', d: 'Petal Layers' },
  },
  tesseract: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Cell Size', b: 'W-Rotation', c: 'Perspective Depth', d: 'Edge Thickness', e: 'Projection Mode' },
  },
  diffusion_model: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'Diffusion Rate', b: 'Noise Scale', c: 'Time Steps', d: 'Temperature', e: 'Drift' },
  },
  superstring_vibration_modes: {
    activeParams: ['a', 'b', 'c', 'd', 'e'],
    labels: { a: 'String Tension', b: 'Vibration Mode N', c: 'Amplitude', d: 'Compactification Radius', e: 'Coupling Constant' },
  },
  elliptic_curve_cryptography: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Coefficient a', b: 'Coefficient b', c: 'Field Parameter', d: 'Point Multiplier' },
  },

  // ── Minimal & classic surfaces ──────────────────────────────────────────
  helicoid: {
    activeParams: ['d', 'e', 'f', 'g'],
    labels: { d: 'Pitch (Height)', e: 'Radius', f: 'Wave Amplitude', g: 'Wave Frequency' },
  },
  catenoid: {
    activeParams: ['d', 'e', 'f', 'g'],
    labels: { d: 'Neck Radius', e: 'Cosh Scale', f: 'Wave Amplitude', g: 'Wave Frequency' },
  },
  breather_surface: {
    activeParams: ['d', 'e', 'f', 'g', 'h'],
    labels: { d: 'Breather Param a (0–1)', e: 'Y Scale', f: 'Z Scale', g: 'U Range', h: 'V Range' },
  },
  dini_surface: {
    activeParams: ['d', 'e', 'f', 'g'],
    labels: { d: 'Scale Factor a', e: 'Twist Factor b', f: 'Z Scale', g: 'Additional Scale' },
  },
  pseudosphere: {
    activeParams: ['d', 'e', 'f', 'g'],
    labels: { d: 'Scale Factor', e: 'Y Scale', f: 'Z Scale', g: 'U Range' },
  },
  enneper_surface: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'X Scale', b: 'Y Scale', c: 'Height Scale' },
  },
  roman_surface: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'X Scale', b: 'Y Scale', c: 'Z Scale' },
  },
  costa_minimal_surface: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Surface Scale', b: 'Y Scale', c: 'Z Scale', d: 'Tunnel Size' },
  },
  costa_surface: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Surface Scale', b: 'Y Scale', c: 'Z Scale', d: 'Tunnel Size' },
  },

  // ── Non-Euclidean ───────────────────────────────────────────────────────
  hyperbolic_paraboloid: {
    activeParams: ['a', 'b', 'c', 'g', 'h'],
    labels: { a: 'Range Scale', b: 'XY Scale', c: 'Height Scale', g: 'X Divisor', h: 'Y Divisor' },
  },

  // ── Knots ───────────────────────────────────────────────────────────────
  torus_knot_general: {
    activeParams: ['a', 'b', 'c', 'g', 'h'],
    labels: { a: 'Knot Radius', b: 'Tube Radius', c: 'Height Scale', g: 'P Winds', h: 'Q Winds' },
  },

  // ── Corrected lorenz (a=scale, b=sigma mult, c=rho mult) ────────────────
  lorenz_attractor: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Scale', b: 'Sigma σ Multiplier', c: 'Rho ρ Multiplier' },
  },

  // ── Superquadrics ───────────────────────────────────────────────────────
  superquadric: {
    activeParams: ['d', 'e', 'f', 'l', 'm'],
    labels: { d: 'A Semi-Axis', e: 'B Semi-Axis', f: 'N1 East-West', l: 'L Exponent', m: 'M Skew' },
  },
  superellipsoid: {
    activeParams: ['a', 'b', 'c', 'l', 'm'],
    labels: { a: 'X Radius', b: 'Y Radius', c: 'Z Radius', l: 'E1 Exponent', m: 'E2 Exponent' },
  },

  // ── 4D / Cube aliases ───────────────────────────────────────────────────
  cube: {
    activeParams: ['a', 'b', 'c', 'd'],
    labels: { a: 'Width', b: 'Height', c: 'Depth', d: 'Bevel' },
  },
  cylinder: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Radius', b: 'Height', c: 'Cap Scale' },
  },
  cone: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'Base Radius', b: 'Height', c: 'Apex Scale' },
  },
  ellipsoid: {
    activeParams: ['a', 'b', 'c'],
    labels: { a: 'X Radius', b: 'Y Radius', c: 'Z Radius' },
  },
  torus_knot: {
    activeParams: ['a', 'b', 'c', 'g', 'h'],
    labels: { a: 'Knot Radius', b: 'Tube Radius', c: 'Height', g: 'P Winds', h: 'Q Winds' },
  },
};

export function getManifest(shapeType: string): ParameterManifest | null {
  if (!shapeType) return null;
  return PARAMETER_MANIFESTS[shapeType] ?? null;
}
