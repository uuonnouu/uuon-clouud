/**
 * SHAPE INFO SYSTEM
 * Provides comprehensive shape information including formulas and sensitivity levels
 * Uses the ShapeSensitivityEngine for accurate formula and classification data
 * 
 * © 2025 UUON Foundation Inc.
 */

import { 
  getShapeSensitivity, 
  getShapeFormula, 
  SensitivityLevel,
  ShapeSensitivityProfile 
} from './shapeSensitivityEngine';

export interface ShapeInfo {
  name: string;
  description: string;
  mathBasis: string;
  parameters: string[];
  category: string;
  sensitivity: SensitivityLevel;
  dampingFactor: number;
  recommendedScale: 'micro' | 'meso' | 'macro';
}

const SHAPE_DESCRIPTIONS: Record<string, { description: string; parameters: string[] }> = {
  sphere: { description: 'Perfect 3D sphere with all points equidistant from center', parameters: ['radius (a)', 'position (b,c)', 'deformation (d,e,f)'] },
  cube: { description: 'Regular hexahedron with 6 square faces', parameters: ['size (a)', 'position (b,c)', 'rotation (d,e,f)'] },
  torus: { description: 'Donut-shaped surface of revolution', parameters: ['major radius (a)', 'minor radius (b)', 'twist (c)'] },
  cylinder: { description: 'Circular cross-section extended along axis', parameters: ['radius (a)', 'height (b)', 'segments (c)'] },
  cone: { description: 'Circular base tapering to apex point', parameters: ['radius (a)', 'height (b)', 'apex (c)'] },
  
  shape_of_universe: { description: 'Unified mathematical structure of cosmic topology', parameters: ['cosmic scale (a)', 'quantum depth (b)', 'lattice (c)', 'wave (d)', 'energy (e)'] },
  
  lorenz_attractor: { description: 'Strange attractor demonstrating chaos theory', parameters: ['σ sigma (a)', 'ρ rho (b)', 'β beta (c)'] },
  rossler_attractor: { description: 'Chaotic attractor with simpler structure', parameters: ['a', 'b', 'c'] },
  mandelbrot_fractal: { description: 'Complex plane fractal iteration boundary', parameters: ['iterations (a)', 'zoom (b)', 'center (c,d)'] },
  julia_fractal: { description: 'Connected Julia set fractal visualization', parameters: ['c_real (a)', 'c_imag (b)', 'iterations (c)'] },
  mandelbulb: { description: '3D Mandelbrot extension with spherical coordinates', parameters: ['power (a)', 'iterations (b)', 'bailout (c)'] },
  
  klein_bottle: { description: 'Non-orientable surface with no boundary', parameters: ['scale (a)', 'segments (b)', 'twist (c)'] },
  mobius_strip: { description: 'Single-sided surface with half-twist', parameters: ['radius (a)', 'width (b)', 'twists (c)'] },
  trefoil_knot: { description: 'Simplest non-trivial knot with 3 crossings', parameters: ['scale (a)', 'thickness (b)', 'segments (c)'] },
  
  dna_double_helix: { description: 'Watson-Crick DNA structure with base pairs', parameters: ['radius (a)', 'pitch (b)', 'turns (c)'] },
  protein_fold: { description: 'Alpha helix and beta sheet secondary structure', parameters: ['backbone (a)', 'sidechain (b)', 'folding (c)'] },
  cell_membrane: { description: 'Lipid bilayer phospholipid arrangement', parameters: ['curvature (a)', 'thickness (b)', 'fluidity (c)'] },
  
  hydrogen_orbital: { description: 'Electron probability cloud for hydrogen atom', parameters: ['n quantum (a)', 'l angular (b)', 'm magnetic (c)'] },
  bloch_sphere: { description: 'Quantum state representation on unit sphere', parameters: ['theta (a)', 'phi (b)', 'purity (c)'] },
  wave_function: { description: 'Schrödinger equation probability amplitude', parameters: ['energy (a)', 'mass (b)', 'potential (c)'] },
  
  schwarzschild_metric: { description: 'Static black hole spacetime geometry', parameters: ['mass (a)', 'radius (b)', 'time (c)'] },
  kerr_black_hole: { description: 'Rotating black hole with frame dragging', parameters: ['mass (a)', 'spin (b)', 'radius (c)'] },
  gravitational_wave: { description: 'Ripples in spacetime from accelerating masses', parameters: ['amplitude (a)', 'frequency (b)', 'polarization (c)'] },
  
  elliptic_curve: { description: 'Algebraic curve used in modern cryptography', parameters: ['a coefficient', 'b coefficient', 'modulus'] },
  aes_sbox: { description: 'AES substitution box transformation', parameters: ['input (a)', 'affine (b)', 'inverse (c)'] },
  
  gradient_descent: { description: 'Optimization trajectory on loss surface', parameters: ['learning rate (a)', 'momentum (b)', 'steps (c)'] },
  neural_network: { description: 'Layered activation function composition', parameters: ['layers (a)', 'neurons (b)', 'activation (c)'] },
  loss_surface: { description: 'Multi-dimensional optimization landscape', parameters: ['dimensions (a)', 'minima (b)', 'curvature (c)'] },
  transformer_attention: { description: 'Self-attention mechanism visualization', parameters: ['heads (a)', 'dimension (b)', 'softmax (c)'] },
  
  tesseract: { description: '4D hypercube with 8 cubic cells', parameters: ['size (a)', 'rotation4D (b)', 'projection (c)'] },
  hypersphere: { description: '4D sphere in higher dimensional space', parameters: ['radius (a)', 'w-axis (b)', 'projection (c)'] },
  calabi_yau: { description: 'Compact Kähler manifold for string theory', parameters: ['complex (a)', 'dimension (b)', 'curvature (c)'] },
  
  golden_spiral: { description: 'Fibonacci-based logarithmic spiral', parameters: ['scale (a)', 'growth (b)', 'turns (c)'] },
  euler_identity: { description: 'Beautiful relationship: e^(iπ) + 1 = 0', parameters: ['real (a)', 'imaginary (b)', 'phase (c)'] },
  riemann_zeta: { description: 'Complex function with prime number connection', parameters: ['real part (a)', 'imaginary (b)', 'terms (c)'] },
  
  maxwell_field: { description: 'Electromagnetic field line visualization', parameters: ['E field (a)', 'B field (b)', 'charge (c)'] },
  higgs_field: { description: 'Scalar field with Mexican hat potential', parameters: ['mu (a)', 'lambda (b)', 'vev (c)'] },
  
  bekenstein_hawking_entropy: { description: 'Black hole entropy proportional to area', parameters: ['area (a)', 'planck (b)', 'k_B (c)'] },
  boltzmann_entropy: { description: 'Statistical mechanics entropy definition', parameters: ['microstates (a)', 'k_B (b)', 'temperature (c)'] },
  
  heart_anatomy: { description: 'Four-chambered cardiac pump structure', parameters: ['size (a)', 'valves (b)', 'contraction (c)'] },
  brain_cortex: { description: 'Cerebral cortex with gyri and sulci', parameters: ['folding (a)', 'thickness (b)', 'regions (c)'] },
  lung_bronchi: { description: 'Fractal branching airway structure', parameters: ['generations (a)', 'diameter (b)', 'angles (c)'] },
  
  galaxy_spiral: { description: 'Logarithmic spiral arm structure', parameters: ['arms (a)', 'pitch (b)', 'bar (c)'] },
  supernova_remnant: { description: 'Expanding shell from stellar explosion', parameters: ['radius (a)', 'velocity (b)', 'density (c)'] },
  
  m_theory_11d_membrane: { description: '11-dimensional membrane in M-theory', parameters: ['dimensions (a)', 'tension (b)', 'coupling (c)'] },
  string_vibration: { description: 'Vibrating string modes in string theory', parameters: ['tension (a)', 'mode (b)', 'amplitude (c)'] }
};

function formatShapeName(shapeType: string): string {
  return shapeType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getDefaultDescription(shapeType: string): string {
  const profile = getShapeSensitivity(shapeType);
  const categoryDescriptions: Record<string, string> = {
    quantum: 'Quantum mechanical visualization',
    biology: 'Biological structure model',
    anatomy: 'Anatomical system visualization',
    fractal: 'Fractal pattern with self-similarity',
    cosmology: 'Cosmological structure model',
    cryptography: 'Cryptographic algorithm visualization',
    ml: 'Machine learning algorithm visualization',
    topology: 'Topological surface or manifold',
    relativity: 'General relativity spacetime structure',
    entropy: 'Thermodynamic entropy visualization',
    string: 'String theory mathematical structure',
    '4d': 'Higher-dimensional geometric object',
    chaos: 'Chaotic dynamical system',
    basic: 'Fundamental geometric shape',
    mathematical: 'Mathematical parametric surface'
  };
  
  return categoryDescriptions[profile.category] || 'Mathematical parametric surface';
}

function getDefaultParameters(shapeType: string): string[] {
  const profile = getShapeSensitivity(shapeType);
  
  const categoryParams: Record<string, string[]> = {
    quantum: ['energy (a)', 'wavelength (b)', 'probability (c)'],
    biology: ['scale (a)', 'complexity (b)', 'variation (c)'],
    anatomy: ['size (a)', 'curvature (b)', 'detail (c)'],
    fractal: ['iterations (a)', 'zoom (b)', 'complexity (c)'],
    cosmology: ['scale (a)', 'density (b)', 'curvature (c)'],
    cryptography: ['key (a)', 'rounds (b)', 'block (c)'],
    ml: ['layers (a)', 'neurons (b)', 'learning rate (c)'],
    topology: ['genus (a)', 'twist (b)', 'scale (c)'],
    relativity: ['mass (a)', 'radius (b)', 'time (c)'],
    entropy: ['temperature (a)', 'states (b)', 'energy (c)'],
    string: ['tension (a)', 'dimensions (b)', 'coupling (c)'],
    '4d': ['w-axis (a)', 'projection (b)', 'rotation (c)'],
    chaos: ['parameter (a)', 'iterations (b)', 'initial (c)'],
    basic: ['size (a)', 'position (b)', 'rotation (c)']
  };
  
  return categoryParams[profile.category] || ['scale (a)', 'amplitude (b)', 'frequency (c)'];
}

export function getShapeInfo(shapeName: string, _params?: any): ShapeInfo {
  const shapeLower = shapeName.toLowerCase();
  const profile = getShapeSensitivity(shapeName);
  const storedInfo = SHAPE_DESCRIPTIONS[shapeLower];
  
  return {
    name: formatShapeName(shapeName),
    description: storedInfo?.description || getDefaultDescription(shapeName),
    mathBasis: getShapeFormula(shapeName),
    parameters: storedInfo?.parameters || getDefaultParameters(shapeName),
    category: profile.category,
    sensitivity: profile.level,
    dampingFactor: profile.dampingFactor,
    recommendedScale: profile.recommendedScale
  };
}

export function getShapeMathBasis(shapeName: string): string {
  return getShapeFormula(shapeName);
}

export function getShapeDescription(shapeName: string): string {
  const shapeLower = shapeName.toLowerCase();
  return SHAPE_DESCRIPTIONS[shapeLower]?.description || getDefaultDescription(shapeName);
}

export function getShapeSensitivityInfo(shapeName: string): ShapeSensitivityProfile {
  return getShapeSensitivity(shapeName);
}
