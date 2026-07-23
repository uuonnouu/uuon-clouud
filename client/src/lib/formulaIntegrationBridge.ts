
/**
 * FORMULA INTEGRATION BRIDGE
 * Connects all mathematical libraries to frontend shape registry
 * Fixes "formulas missing" issue by bridging backend->frontend
 */

import { GENERAL_RELATIVITY_SHAPES } from './generalRelativityShapes';
import { SET_THEORY_SHAPES } from './setTheoryShapes';

import { QUANTUM_GRAVITY_EQUATIONS } from './quantumGravityEquations';

import { ENTROPIC_PRINCIPLES } from './entropicPrinciples';
import { ADVANCED_PHYSICS_EQUATIONS } from './advancedPhysicsEquations';
import { WAVE_ALGORITHMS_SHAPES } from './waveAlgorithmsEngine';
import { TENSOR_ALGEBRA_SHAPES } from './tensorAlgebraEngine';
import { FIELD_THEORY_SHAPES } from './fieldTheoryEngine';
import { JACOBIAN_TRANSFORMATION_SHAPES } from './jacobianTransformationShapes';
import { IFS_FRACTALS_REGISTRY } from './ifsFractalsRegistry';
import { SurfaceParameters } from '../types/math';

// Bridge all mathematical libraries to unified system
export const INTEGRATED_FORMULA_LIBRARIES = {
  
  // GENERAL RELATIVITY & SPACETIME (24 shapes)
  ...GENERAL_RELATIVITY_SHAPES,
  
  // SET THEORY & LOGIC (12 shapes)  
  ...SET_THEORY_SHAPES,
  
  // ENTROPIC PRINCIPLES (19 shapes)
  ...ENTROPIC_PRINCIPLES,
  
  // ADVANCED PHYSICS (20 shapes)
  ...ADVANCED_PHYSICS_EQUATIONS,
  
  // WAVE ALGORITHMS (15 shapes)
  ...WAVE_ALGORITHMS_SHAPES,
  
  // TENSOR ALGEBRA (18 shapes)
  ...TENSOR_ALGEBRA_SHAPES,
  
  // FIELD THEORY (16 shapes)
  ...FIELD_THEORY_SHAPES,
  
  // QUANTUM GRAVITY & PLANCK SCALE (21 shapes)
  ...QUANTUM_GRAVITY_EQUATIONS,
  
  // JACOBIAN & COORDINATE TRANSFORMATIONS (18 shapes)
  ...JACOBIAN_TRANSFORMATION_SHAPES,

  // IFS FRACTALS — GPU raymarched, equation is a GPU_STUB (never called by CPU renderer)
  ...IFS_FRACTALS_REGISTRY

};

// Formula metadata for proper display
export const FORMULA_METADATA = {
  
  // General Relativity formulas
  spacetime_interval_ds2: {
    displayName: "Spacetime Interval ds²",
    formula: "ds² = g_μν dx^μ dx^ν",
    description: "Infinitesimal spacetime distance in curved geometry"
  },
  
  ricci_scalar_curvature: {
    displayName: "Ricci Scalar R",
    formula: "R = g^μν R_μν",
    description: "Trace of Ricci tensor - total spacetime curvature"
  },
  
  einstein_field_equations: {
    displayName: "Einstein Field Equations", 
    formula: "G_μν + Λg_μν = (8πG/c⁴)T_μν",
    description: "Spacetime curvature equals energy-momentum"
  },
  
  schwarzschild_metric_spacetime: {
    displayName: "Schwarzschild Metric",
    formula: "ds² = -(1-r_s/r)dt² + (1-r_s/r)⁻¹dr² + r²dΩ²", 
    description: "Black hole spacetime geometry"
  },
  
  // Set Theory formulas
  infinite_set: {
    displayName: "Infinite Set ℵ₀",
    formula: "|ℕ| = ℵ₀",
    description: "Countably infinite cardinal number"
  },
  
  power_set: {
    displayName: "Power Set 𝒫(A)",
    formula: "|𝒫(A)| = 2^|A|",
    description: "Set of all subsets"
  },
  
  // Tensor Algebra formulas
  rank_2_tensor_surface: {
    displayName: "Rank-2 Tensor T^μν", 
    formula: "T^μν = A^μ ⊗ B^ν",
    description: "Tensor product of two vectors"
  },
  
  christoffel_symbols_field: {
    displayName: "Christoffel Symbols Γ^λ_μν",
    formula: "Γ^λ_μν = ½g^λρ(∂_μg_νρ + ∂_νg_μρ - ∂_ρg_μν)",
    description: "Connection coefficients for covariant derivatives"
  },
  
  // Field Theory formulas
  dirac_equation: {
    displayName: "Dirac Equation",
    formula: "(iγ^μ∂_μ - m)ψ = 0", 
    description: "Relativistic wave equation for fermions"
  },
  
  // Wave Algorithms
  fourier_transform_surface: {
    displayName: "Fourier Transform",
    formula: "F(ω) = ∫ f(t)e^(-iωt)dt",
    description: "Frequency domain representation"
  },
  
  lissajous_curves: {
    displayName: "Lissajous Curves", 
    formula: "x = A sin(at + δ), y = B sin(bt)",
    description: "Parametric curves from harmonic motion"
  },
  
  // Quantum Gravity formulas
  wheeler_dewitt_equation: {
    displayName: "Wheeler-DeWitt Equation",
    formula: "Ĥ|Ψ⟩ = 0",
    description: "The fundamental equation of quantum cosmology - universe wave function"
  },
  
  planck_units_visualization: {
    displayName: "Planck Units",
    formula: "lₚ = √(ℏG/c³) ≈ 1.616×10⁻³⁵ m",
    description: "Fundamental scales where quantum gravity dominates"
  },
  
  spin_network_vertex: {
    displayName: "Spin Network Vertex",
    formula: "|Γ, jₑ, iᵥ⟩ with SU(2) representations",
    description: "Building blocks of quantum geometry in loop quantum gravity"
  },
  
  ryu_takayanagi_entropy: {
    displayName: "Ryu-Takayanagi Formula",
    formula: "S = Area/4G",
    description: "Holographic entropy relating bulk geometry to boundary information"
  },
  
  hawking_radiation_spectrum: {
    displayName: "Hawking Radiation",
    formula: "T = ℏc³/8πGkM",
    description: "Quantum thermal radiation from black hole event horizons"
  },
  
  // Jacobian Transformation formulas
  cascading_coordinate_surface: {
    displayName: "Cascading Coordinate Surface",
    formula: "u=x+y+z, uv=y+z, uvw=z → ∂(x,y,z)/∂(u,v,w)",
    description: "Visualization of cascading sum coordinate transformation"
  },
  
  jacobian_determinant_field: {
    displayName: "Jacobian Determinant Field",
    formula: "J = det(∂xᵢ/∂uⱼ)",
    description: "Scalar field showing local volume scaling factor"
  },
  
  spherical_jacobian_shell: {
    displayName: "Spherical Jacobian Shell",
    formula: "J = r²sin(θ)",
    description: "Volume element in spherical coordinates"
  },
  
  cylindrical_jacobian_helix: {
    displayName: "Cylindrical Jacobian Helix",
    formula: "J = r",
    description: "Volume element in cylindrical coordinates"
  },
  
  volume_scaling_manifold: {
    displayName: "Volume Scaling Manifold",
    formula: "J[(u,v,w)/(x,y,z)] = 4",
    description: "Transformation where u=yz/x, v=zx/y, w=xy/z"
  },
  
  gaussian_curvature_surface: {
    displayName: "Gaussian Curvature Surface",
    formula: "K = (LN - M²)/(EG - F²)",
    description: "Intrinsic curvature from first and second fundamental forms"
  },
  
  mean_curvature_flow: {
    displayName: "Mean Curvature Flow",
    formula: "H = (EN + GL - 2FM)/(2(EG - F²))",
    description: "Average of principal curvatures at each point"
  },
  
  riemann_curvature_manifold: {
    displayName: "Riemann Curvature Manifold",
    formula: "Rⁱⱼₖₗ = ∂ₖΓⁱⱼₗ - ∂ₗΓⁱⱼₖ + ΓⁱₘₖΓᵐⱼₗ - ΓⁱₘₗΓᵐⱼₖ",
    description: "Full curvature tensor of a Riemannian manifold"
  },
  
  metric_tensor_surface: {
    displayName: "Metric Tensor Surface",
    formula: "ds² = gᵢⱼ dxⁱ dxʲ",
    description: "Distance measurement on curved surfaces"
  },
  
  christoffel_symbol_flow: {
    displayName: "Christoffel Symbol Flow",
    formula: "Γⁱⱼₖ = ½gⁱᵐ(∂ⱼgₘₖ + ∂ₖgⱼₘ - ∂ₘgⱼₖ)",
    description: "Connection coefficients for parallel transport"
  },

  // THREE-FORMULA HYBRID EXTENSIONS - Advanced Mathematical Combinations
  wave_energy_hybrid: {
    displayName: "Wave-Energy Mandala",
    formula: "z² + sin(z) + e^z + c",
    description: "Living mandalas with energy jets - polynomial + waves + exponential bursts"
  },
  
  spike_shell_armor: {
    displayName: "Spike-Shell Architecture",
    formula: "z³ + tan(z) + log(z²+1) + c",
    description: "Armored spiral structures with defensive spikes - cubic + tangent + logarithmic"
  },
  
  crystal_flame_fusion: {
    displayName: "Crystal-Flame Hybrid",
    formula: "z⁵ + z·e^z + sinh(z) + c",
    description: "Crystalline structures with flame energy flows - pentagonal + exponential spirals + hyperbolic"
  },
  
  bio_organic_tissue: {
    displayName: "Bio-Organic Fractal Tissue",
    formula: "(z²+z³) + sin(z²) + e^(z/2) + c",
    description: "Living tissue-like fractals with organic growth - dual polynomial + wave interference + soft divergence"
  }
  
};

// Get formula metadata
export function getFormulaMetadata(shapeKey: string) {
  return FORMULA_METADATA[shapeKey as keyof typeof FORMULA_METADATA] || {
    displayName: shapeKey.replace(/_/g, ' ').toUpperCase(),
    formula: "Mathematical formula",
    description: "Advanced mathematical visualization"
  };
}

// Check if shape has formula
export function hasFormula(shapeKey: string): boolean {
  return shapeKey in INTEGRATED_FORMULA_LIBRARIES;
}

// Get shape function
export function getShapeFunction(shapeKey: string) {
  const shape = INTEGRATED_FORMULA_LIBRARIES[shapeKey as keyof typeof INTEGRATED_FORMULA_LIBRARIES];
  return shape?.equation || null;
}

// Get default parameters
export function getShapeDefaults(shapeKey: string): Partial<SurfaceParameters> {
  const shape = INTEGRATED_FORMULA_LIBRARIES[shapeKey as keyof typeof INTEGRATED_FORMULA_LIBRARIES];
  return shape?.defaultParams || {};
}

console.log(`🔗 Formula Integration Bridge loaded: ${Object.keys(INTEGRATED_FORMULA_LIBRARIES).length} formulas connected`);
