/**
 * Shape Categorization System
 * Organizes 457 unique mathematical and biological shapes across 28 categories
 */

export interface ShapeCategory {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  shapes: string[];
  engineDynamics?: {
    primaryType: 'radial' | 'symmetry' | 'fractional' | 'toroidal' | 'hyperbolic' | 'wave' | 'crystalline' | 'biological' | 'quantum' | 'topological';
    symmetryOrder?: number;
    influenceFactors?: string[];
  };
}

import { PARAMETRIC_LIBRARY_CATEGORIES } from './parametricLibraryPack';

import {
  CLEAN_SURFACES,
  PARAMETRIC_SURFACES,
  EXCLUSIVE_SHAPES,
  NON_EUCLIDEAN_SHAPES,
  RIEMANN_SURFACES,
  EDUCATIONAL_SURFACES,
  TOPOLOGY_KNOTS,
  CATEGORY_THEORY,
  GROUP_THEORY,
  HISTORICAL_ALGORITHMS,
  MATHEMATICAL_CONSTANTS,
  UNIFIED_MATH_SYMBOLS,
  UNIVERSAL_MATHEMATICS,
  QUANTUM_PARAMETRIC_FUNCTIONS,
  MULTIDIMENSIONAL_FRACTALS,
  SACRED_GEOMETRY,
  ADVANCED_TOPOLOGICAL_SURFACES,
  REAL_WORLD_OBJECTS,
  NON_EUCLIDEAN_GEOMETRIES,
  MECHANICAL_SHAPES,
  WEATHER_SYSTEMS,
  SEQUENCE_PATTERNS,
  ASTRONOMICAL_OBJECTS,
  CONSCIOUSNESS_THEORY,
  EXTENDED_CRYSTALS,
  ADVANCED_PHYSICS_SIMS,
  HYDROGEN_ORBITALS,
  QUANTUM_GAP_SURFACES,
  NOISE_FUNCTIONS,
  DIFFERENTIAL_GROWTH,
  PROTEIN_STRUCTURES,
  ASTROPHYSICAL_PHENOMENA,
  VORONOI_SYSTEMS,
  HYPERCOMPUTATION_SURFACES,
  NATIONAL_MOTTO_ALGORITHMS,
  ADVANCED_PHYSICS_EQUATIONS,
  SCHRODINGER_EQUATIONS,
  HUMAN_ANATOMY_SHAPES,
  ATTRACTOR_SYSTEMS,
  NEURAL_LATTICE_ALGORITHMS,
  QUANTUM_COMPUTING_ALGORITHMS,
  DUAL_MIRROR_ENERGY_SYSTEM,
  POLYMER_CHAINS,
  TISSUE_STRUCTURES,
  GENERATIVE_ALGORITHMS,
  ENTANGLEMENT_ALGORITHMS,
  FINANCIAL_MATHEMATICS,
  DNA_STRUCTURES,
  CHAKRA_SHAPES,
  GENERAL_RELATIVITY_SHAPES,
  QUANTUM_GRAVITY_EQUATIONS,
  THEORY_OF_EVERYTHING_SHAPES,
  FOUR_DIMENSIONAL_SHAPES,
  TEN_PERCENT_SHAPES,
  SET_THEORY_SHAPES,
  ENTROPIC_PRINCIPLES,
  SCIENTIFIC_EXPANSION_SHAPES,
  MOLECULAR_BIOLOGY_SHAPES,
  BIOLOGICAL_SHAPE_IMPLEMENTATIONS,
  EARTH_SCIENCES_SHAPES,
  LIFE_SCIENCES_SHAPES,
  UNIFIED_SHAPES
} from '../lib/parametricSurfacesClean';

import { INTEGRATED_FORMULA_LIBRARIES } from './formulaIntegrationBridge';
import { COSMIC_HISTORY_GAPS } from './cosmicHistoryGaps';
import { BABYLONIAN_ZODIAC_SHAPES, BABYLONIAN_ZODIAC_CATEGORY } from './babylonianZodiacShapes';
import { MINIMAL_SURFACES_SPHERES_CATEGORY, MINIMAL_SURFACES_TORI_CATEGORY, MINIMAL_SURFACES_HIGHER_GENUS_CATEGORY } from './minimalSurfacesLibrary';
import { ICE_CRYSTAL_SHAPES, ICE_CRYSTAL_CATEGORY } from './iceCrystalShapes';
import { DMENSION_PATTERN_CODEX, DMENSION_PATTERN_CODEX_CATEGORY } from './dmensionPatternCodex';
import { UUON_MESH_SHAPES } from './uuonMeshEngine';
import { ANCIENT_EGYPTIAN_CATEGORY, ANCIENT_GREEK_CATEGORY } from './ancientCivilizationShapes';
import { BASIC_GEOMETRY_FORMULAS } from './basicGeometryFormulas';
import { TIME_TRAVEL_PHYSICS, TIME_TRAVEL_PHYSICS_CATEGORY } from './timeTravelPhysics';
import { SPACE_BIOLOGY_SHAPES, SPACE_BIOLOGY_CATEGORY } from './spaceBiologyShapes';
import { INVERSE_SQUARE_LAW_SHAPES, INVERSE_SQUARE_LAW_CATEGORY } from './inverseSquareLawShapes';

// Function to extract shape keys from library objects
function getShapeKeysFromLibrary(library: any): string[] {
  if (!library || typeof library !== 'object') return [];
  return Object.keys(library).filter(key => {
    const shape = library[key];
    return shape && typeof shape === 'object' && ('equation' in shape || 'x' in shape || 'geometry' in shape);
  });
}

// Build comprehensive shape categories from all libraries
// HIERARCHICAL ORDER: Rare Manifolds → DNA & Lattice → Basic 3D → Classical Math → Procedural → Biology → Physics → 4D → 5D → 6D+ → Quantum → AI → Chaotic
export const SHAPE_CATEGORIES = [
  // ============================================================================
  // RARE MANIFOLDS (PREMIER - FIRST POSITION)
  // The three rarest and most mathematically singular 3D manifolds
  // ============================================================================
  {
    id: 'rare_manifolds',
    name: '◆ Rare Manifolds',
    icon: '◆',
    description: 'The three rarest and most mathematically singular 3D manifolds known to topology: Weeks Manifold (smallest closed hyperbolic volume, vol≈0.9427), Poincaré Homology Sphere (unique non-trivial homology 3-sphere with binary icosahedral symmetry), and Seifert-Weber Space (hyperbolic dodecahedral space with 108° twist). These represent the extreme edges of 3D manifold theory.',
    engineDynamics: {
      primaryType: 'topological' as const,
      symmetryOrder: 5,
      influenceFactors: ['hyperbolic geometry', 'Dehn surgery', 'icosahedral symmetry', 'dodecahedral space', 'homology spheres']
    },
    shapes: [
      'weeks_manifold',
      'poincare_homology_sphere',
      'seifert_weber_space'
    ]
  },

  // ============================================================================
  // DNA & NODAL LATTICE STRUCTURES (FLAGSHIP - SECOND POSITION)
  // Multi-scale helical node networks with quantum coherence modeling
  // ============================================================================
  {
    id: 'dna_nodal_lattice',
    name: '🧬 DNA & Nodal Lattice Structures',
    icon: '🧬',
    description: 'DNA as 3D Nodal Lattice Networks: Each base pair acts as a connection node, phosphate backbones create helical pathways. Multi-scale hierarchies from molecular (2nm) to chromatin (11nm) to chromosome (30nm+). Parameters A-Z control lattice density, curvature, connectivity, and quantum coherence. Golden ratio harmonics (G=φ) for geometric encoding.',
    engineDynamics: {
      primaryType: 'biological',
      symmetryOrder: 2,
      influenceFactors: ['helical node networks', 'base pair nodes', 'phosphate backbone pathways', 'golden ratio harmonics', 'quantum coherence', 'epigenetic memory domains']
    },
    shapes: [
      // DNA Geometric Code - 3D Memory System
      'dna_geometric_code',
      
      // Classic Double Helix Forms
      'dna_double_helix',
      'dna_helix_detailed',
      'b_form_dna_helix',
      'a_dna_helix',
      'z_dna_helix',
      'dna_simple_helix',
      'dna_helix_organic',
      
      // Base Pairs & Molecular Components
      'adenine_thymine_pair',
      'guanine_cytosine_pair',
      'sugar_phosphate_backbone',
      'nucleotide',
      'dna_base_pairs',
      
      // Higher-Order Structures
      'dna_supercoil',
      'chromatin_fiber',
      'chromatin_superhelix',
      'nucleic_acid_double_helix',
      'metaphase_chromosome',
      'telomere',
      'centromere',
      'histone_octamer',
      'g_quadruplex',
      
      // RNA Structures
      'rna_single_helix',
      'trna_cloverleaf',
      'mrna_strand',
      'rrna_complex',
      'microrna',
      
      // Molecular Machinery
      'replication_fork',
      'transcription_bubble',
      'rna_polymerase',
      'spliceosome',
      'plasmid',
      'viral_capsid_dna',
      'crispr_cas9',
      
      // DNA-Lattice Fusion (Flagship)
      'unified_dna_lattice_matrix',
      'dna_lattice_crystalline_helix',
      'toroidal_dna_lattice',
      'quantum_dna_lattice',
      
      // Advanced DNA Structures (Cancer/Aging Research)
      'h_dna_triplex',
      'i_motif_dna',
      'holliday_junction',
      'dna_origami_tile',
      'topological_domain_tad',
      'r_loop_structure',
      'dna_trefoil_knot',
      'dna_catenane',
      'dna_nanotube',
      'cruciform_dna',
      
      // 2026 DNA Nanotechnology Systems
      'dna_data_storage',
      'dna_nanobot',
      'dna_nanophotonics',
      'cell_free_biomanufacturing',
      'dna_condensate',
      'dna_walker',
      
      // Helix-Inspired Structures
      'morphogenetic_spiral',
      'neural_pathway_helix',
      'magnetic_field_helix',
      'information_helix',
      'structural_helix',
      'electromagnetic_helix'
    ]
  },

  // ============================================================================
  // TIER 1: FOUNDATIONAL 3D (Simplest - Entry Point)
  // ============================================================================
  {
    id: 'welcome',
    name: '👋 Welcome',
    icon: '👋',
    description: 'Start here - essential shapes for getting started with Dmension.',
    shapes: [
      'uuon'
    ]
  },
  {
    id: 'basic',
    name: '🔷 Basic Geometry',
    icon: '🔷',
    description: 'Fundamental 3D geometric primitives, the building blocks of all mathematical visualization. Includes spheres, tori, cubes, cylinders, cones.',
    engineDynamics: {
      primaryType: 'radial',
      influenceFactors: ['Euclidean geometry', 'spherical coordinates', 'Platonic solids']
    },
    shapes: [
      'sphere',
      'square',
      'cube',
      'circle',
      'triangle',
      'cylinder',
      'equirectangular_sphere',
      'unit_sphere',
      'torus',
      'ellipsoid',
      'cone',
      'pseudosphere',
      'hyperbolic_paraboloid'
    ]
  },
  {
    id: 'basic_formulas',
    name: '📐 Basic Geometry Formulas',
    icon: '📐',
    description: 'Essential geometric formulas visualized as 3D parametric surfaces: Area (8), Perimeter (4), Volume (6), Surface Area (5), and Special formulas including Pythagorean theorem and Distance formula.',
    engineDynamics: {
      primaryType: 'radial',
      influenceFactors: ['Euclidean geometry', 'measurement', 'spatial reasoning']
    },
    shapes: [
      'area_rectangle',
      'area_square',
      'area_triangle',
      'area_circle',
      'area_trapezoid',
      'area_parallelogram',
      'area_rhombus',
      'area_ellipse',
      'perimeter_rectangle',
      'perimeter_square',
      'perimeter_triangle',
      'circumference_circle',
      'volume_cube',
      'volume_rectangular_prism',
      'volume_cylinder',
      'volume_sphere',
      'volume_cone',
      'volume_pyramid',
      'surface_area_cube',
      'surface_area_rectangular_prism',
      'surface_area_cylinder',
      'surface_area_sphere',
      'surface_area_cone',
      'pythagorean_theorem',
      'distance_formula'
    ]
  },

  // ============================================================================
  // TIER 2: CLASSICAL MATHEMATICS
  // ============================================================================
  {
    id: 'set_theory',
    name: '∅ Set Theory',
    icon: '∅',
    description: 'Abstract mathematical foundations - sets, relations, and operations.',
    engineDynamics: {
      primaryType: 'symmetry',
      influenceFactors: ['Boolean algebra', 'Venn diagrams', 'cardinality']
    },
    shapes: [
      'null_set_empty',
      'singleton_set',
      'finite_set',
      'infinite_set',
      'subset_relation',
      'power_set',
      'universal_set',
      'equivalent_sets',
      'equal_sets',
      'super_set',
      'venn_diagram_sets',
      'complement_set'
    ]
  },
  {
    id: 'riemann_geometry',
    name: 'R Riemann Geometry (1854)',
    icon: 'R',
    description: 'A 3D visualization system unifying Riemann\'s complete mathematical framework: metric tensors, geodesics, curvature.',
    engineDynamics: {
      primaryType: 'topological',
      influenceFactors: ['Gaussian curvature', 'geodesic flow', 'metric tensor']
    },
    shapes: [
      'riemann_curvature_surface',
      'ricci_curvature_surface',
      'scalar_curvature_surface',
      'christoffel_symbols_surface',
      'metric_tensor_riemann',
      'geodesic_flow_surface',
      'parallel_transport_surface',
      'exponential_map_surface',
      'sectional_curvature_surface',
      'weyl_tensor_surface',
      'laplace_beltrami_surface',
      'covariant_derivative_surface',
      'volume_form_surface',
      'square_root_riemann',
      'logarithm_riemann',
      'exponential_riemann',
      'nth_root_riemann',
      'elliptic_function'
    ]
  },
  {
    id: 'original_algorithms',
    name: '📜 Original Algorithms - History',
    icon: '📜',
    description: 'Historical algorithms from Euclid to Einstein.',
    shapes: [
      'euclidean_algorithm',
      'sieve_eratosthenes',
      'babylonian_square_root',
      'newton_raphson',
      'fibonacci_spiral_enhanced',
      'kepler_planetary_motion',
      'diffusion_heat_equation',
      'crystal_lattice_fcc',
      'binary_tree_traversal',
      'quicksort_partition_tree',
      'dna_replication_algorithm',
      'einstein_mass_energy'
    ]
  },
  {
    id: 'waves',
    name: '〰️ Wave Algorithms',
    icon: '〰️',
    description: 'Wave dynamics and harmonic motion.',
    engineDynamics: {
      primaryType: 'wave',
      influenceFactors: ['harmonic oscillation', 'wave superposition', 'Fourier analysis']
    },
    shapes: [
      'wave_displacement_plane',
      'wave_interference_plane',
      'electromagnetic_wave',
      'sound_wave',
      'brain_wave',
      'seismic_wave',
      'ocean_wave',
      'gravitational_wave',
      'cardiac_wave',
      'quantum_wave',
      'atmospheric_wave',
      'circadian_wave'
    ]
  },

  // ============================================================================
  // TIER 3: 4D GEOMETRY (Hyperdimensional)
  // ============================================================================
  {
    id: 'four_d_primitives',
    name: '🎯 4D Primitives & Projections',
    icon: '🎯',
    description: 'Educational 4D primitives with selectable projection methods. Use parameter G to switch: 0=Stereographic, 1=Orthographic, 2=Perspective. Demonstrates 4D→3D projection formulas and XY-ZW double rotation.',
    engineDynamics: {
      primaryType: 'hyperbolic',
      symmetryOrder: 4,
      influenceFactors: ['stereographic projection', 'orthographic projection', 'perspective projection', 'SO(4) rotation']
    },
    shapes: [
      'hypersphere_projectable',
      'tesseract_projectable',
      'sixteen_cell_projectable',
      'twentyfour_cell_projectable',
      'double_rotation_4d',
      'projection_comparison_4d'
    ]
  },
  {
    id: 'four_dimensional',
    name: '🔷 4D Polytopes & Hyperdimensional',
    icon: '🔷',
    description: 'Complete 4D mathematical universe: Regular polytopes (tesseract, 600-cell), Hopf fibrations, Calabi-Yau manifolds, exotic smooth structures. 40+ shapes spanning fundamental geometry to unsolved problems in 4D topology.',
    engineDynamics: {
      primaryType: 'hyperbolic',
      symmetryOrder: 4,
      influenceFactors: ['SO(4) rotation', 'quaternionic', 'stereographic projection']
    },
    shapes: [
      'hypersphere',
      'hypercube',
      'hypersimplex',
      'tesseract_4d',
      'four_sphere_hypersphere',
      'five_cell_4d_simplex',
      'sixteen_cell_cross_polytope',
      'twentyfour_cell',
      'onetwenty_cell',
      'sixhundred_cell',
      'duocylinder_4d_torus',
      'klein_bottle_4d',
      'clifford_torus_4d',
      'mobius_strip_4d',
      'hyperboloid_4d',
      'lissajous_knot_4d',
      'duoprism_square_triangle',
      'penrose_tiling_4d',
      'hopf_fibration_4d',
      'stereographic_projection_4d',
      'spinor_fibration_4d',
      'quaternionic_projective_line',
      'roman_surface_4d',
      'twisted_cubic_4d',
      'borromean_rings_4d',
      'kummer_surface_4d',
      'seifert_surface_4d',
      'calabi_yau_4d',
      'modular-surface-knots_4d',
      'ricci_flow_4d',
      'hyperbolic_limit_sets_4d',
      'instanton_moduli_4d',
      'cellular_automata_4d',
      'minimal_surface_4d',
      'exotic_smooth_4d',
      'zimmer_program_4d',
      'perfectoid-space_4d',
      'quantum-hall-droplet_4d',
      'seiberg_witten_monopole_4d',
      'percolation_cluster_4d'
    ]
  },

  // ============================================================================
  // TIER 4: 5D POLYTOPES
  // ============================================================================
  // 5D POLYTOPES - Second Hyperdimensional Category
  {
    id: 'five_dimensional',
    name: '5D Polytopes & Penteracts 🔶',
    icon: '🔶',
    description: '5D polytope family: penteract (5-cube with 32 vertices), 5-simplex (6 vertices), 5-orthoplex (10 vertices), demipenteract, 5-sphere, and product polytopes like cubinder and spherinder.',
    engineDynamics: {
      primaryType: 'hyperbolic',
      symmetryOrder: 5,
      influenceFactors: ['5D projection', 'penteract symmetry', 'cross-section slicing']
    },
    shapes: [
      'five_simplex_5d',
      'five_cube_penteract',
      'five_orthoplex_5d',
      'demipenteract_5d',
      'five_sphere_5d',
      'cubinder_5d',
      'spherinder_5d'
    ]
  },
  // HIGHER DIMENSIONAL (6D+) - Third Hyperdimensional Category
  {
    id: 'higher_dimensional',
    name: '6D+ & Exceptional Lattices 🌌',
    icon: '🌌',
    description: 'Higher-dimensional polytopes and exceptional structures: E₆, E₇, E₈ lattices (remarkable symmetries in 6D, 7D, 8D), Leech lattice (24D optimal sphere packing), n-simplexes, n-cubes, n-orthoplexes with configurable dimension, and Gosset 4₂₁ polytope.',
    engineDynamics: {
      primaryType: 'symmetry',
      symmetryOrder: 8,
      influenceFactors: ['E₈ exceptional symmetry', 'Leech lattice', 'sphere packing']
    },
    shapes: [
      'n_simplex_6d',
      'n_cube_6d',
      'n_orthoplex_6d',
      'e6_lattice',
      'e7_lattice',
      'e8_lattice',
      'leech_lattice_24d',
      'n_simplex_generic',
      'n_cube_generic',
      'n_orthoplex_generic',
      'gosset_polytope_8d'
    ]
  },
  // DIATOMS - Biomimetic Silica Architecture (200+ million years of engineering)
  {
    id: 'diatoms',
    name: '🔬 Diatoms (Biomimetic Architecture)',
    icon: '🔬',
    description: 'Mathematical models of microscopic silica-shelled algae (Bacillariophyta). 200+ million years of optimized engineering: radial symmetry, perforated structures, hierarchical organization. Victorian naturalists like Ernst Haeckel recognized these as living geometry proving universal design principles.',
    engineDynamics: {
      primaryType: 'biological',
      symmetryOrder: 12,
      influenceFactors: ['silica frustule', 'radial symmetry', 'hierarchical patterns', 'biomimetic engineering']
    },
    shapes: [
      'radial_centric_diatom',
      'pennate_diatom',
      'polygonal_diatom',
      'colonial_chain_diatom',
      'stellate_diatom',
      'diatom_frustule_complete',
      'coscinodiscus_diatom',
      'navicula_diatom',
      'triceratium_diatom',
      'arachnoidiscus_diatom'
    ]
  },
  // 🔱 DMENSION PATTERN CODEX - After Hyperdimensional Categories
  DMENSION_PATTERN_CODEX_CATEGORY,
  {
    id: 'mathematical-art',
    name: '🎨 Mathematical Art',
    icon: '🎨',
    description: 'Famous mathematical artworks by renowned artists like Hamid Naderi Yeganeh, rendered using complex parametric equations',
    engineDynamics: {
      primaryType: 'radial',
      influenceFactors: ['parametric curves', 'Fourier series', 'harmonic motion']
    },
    shapes: [
      'yeganeh-eagle'
    ]
  },
  {
    id: 'babylonian-zodiac',
    name: '𒀭 Babylonian Zodiac (2000 BCE)',
    icon: '𒀭',
    description: 'The 12 original zodiac constellations from ancient Babylon, mathematically reconstructed from cuneiform astronomical tablets',
    engineDynamics: {
      primaryType: 'radial',
      symmetryOrder: 12,
      influenceFactors: ['zodiacal ecliptic', 'celestial coordinates', 'ancient astronomy']
    },
    shapes: [
      'babylonian_aries_hired_man',
      'babylonian_taurus_bull_of_heaven',
      'babylonian_gemini_great_twins',
      'babylonian_cancer_crayfish',
      'babylonian_leo_lion',
      'babylonian_virgo_furrow',
      'babylonian_libra_scales',
      'babylonian_scorpio_scorpion',
      'babylonian_sagittarius_pabilsag',
      'babylonian_capricorn_goat_fish',
      'babylonian_aquarius_water_bearer',
      'babylonian_pisces_fish_string'
    ]
  },
  ANCIENT_EGYPTIAN_CATEGORY,
  ANCIENT_GREEK_CATEGORY,
  {
    id: 'uuon-mesh',
    name: 'UUON-Mesh Engine',
    icon: '🌊',
    description: 'Noise-reactive parametric 3D geometry system with A/B/C morphological controls',
    engineDynamics: {
      primaryType: 'wave',
      symmetryOrder: 6,
      influenceFactors: ['simplex noise', 'FBM', 'harmonic interference', 'curvature flow']
    },
    shapes: Object.keys(UUON_MESH_SHAPES)
  },
  {
    id: 'computational-biology',
    name: 'Computational Biology',
    icon: '🧬',
    engineDynamics: {
      primaryType: 'biological',
      influenceFactors: ['sequence alignment', 'protein folding', 'molecular dynamics']
    },
    shapes: [
      'needleman_wunsch_001',
      'smith_waterman_001',
      'blast_search_001',
      'hidden_markov_001',
      'debruijn_assembly_001',
      'molecular_dynamics_001',
      'monte_carlo_sampling_001',
      'dft_electron_density_001',
      'fast_multipole_001',
      'alphafold_prediction_001'
    ]
  },
  {
    id: 'universe',
    name: 'Shape of the Universe',
    icon: '🌌',
    shapes: [
      'shape_of_universe'
    ]
  },
  {
    id: 'theory_of_everything',
    name: 'Theory of Everything Candidates',
    icon: '🔬',
    description: 'A visualization system for unified physics theories. Renders string theory landscapes, M-theory branes, supersymmetric structures, and grand unified symmetry groups. Visualize Calabi-Yau manifolds, extra dimensions, and frameworks proposed to unify quantum mechanics with general relativity.',
    engineDynamics: {
      primaryType: 'quantum',
      influenceFactors: ['string theory', 'M-theory', 'supersymmetry', 'gauge unification']
    },
    shapes: [
      'polyakov_action_worldsheet',
      'superstring_vibration_modes',
      'm_theory_11d_membrane',
      'ashtekar_connection_reformulation',
      'lqg_hamiltonian_constraint',
      'qcd_gluon_field',
      'electroweak_unification',
      'supersymmetry_transformation',
      'grand_unified_theory_gut',
      'holographic_principle_boundary'
    ]
  },
  {
    id: 'ten_percent_systems',
    name: '10% Systems - Visible/Hidden Dynamics',
    icon: '🔮',
    shapes: [
      'iceberg_system',
      'dna_expression_system',
      'em_spectrum_system',
      'universe_distribution_system',
      'ocean_exploration_system',
      'neural_network_layers_system',
      'tree_root_crown_system',
      'quantum_superposition_system',
      'computer_processes_system',
      'thought_speech_system',
      'genetic_evolution_system',
      'consciousness_processing_system',
      'economic_activity_system',
      'social_data_system',
      'language_communication_system',
      'internet_infrastructure_system',
      'human_energy_system',
      'combined_ten_percent_master'
    ]
  },
  {
    id: 'general_relativity',
    name: 'General Relativity & Spacetime',
    icon: '🌌',
    description: 'A comprehensive visualization system for Einstein\'s field equations and spacetime geometry. Renders Schwarzschild metrics, Kerr black holes, gravitational lensing, frame dragging, and spacetime curvature as interactive 3D manifolds. Explore event horizons, gravitational time dilation, and how mass curves the fabric of spacetime.',
    engineDynamics: {
      primaryType: 'hyperbolic',
      influenceFactors: ['metric tensor', 'geodesic curvature', 'Schwarzschild radius', 'frame dragging']
    },
    shapes: [
      // I. Core Geometric Foundations
      'spacetime_interval_ds2',
      'metric_tensor_surface',
      'einstein_field_equations',
      'einstein_tensor_field',
      'ricci_scalar_curvature',
      'riemann_curvature_tensor',
      'christoffel_symbols_field',
      // II. Geodesics
      'geodesic_equation',
      'photon_geodesic_null',
      'proper_time_surface',
      // III. Stress-Energy
      'stress_energy_tensor',
      'energy_density_t00',
      // IV. Special Relativity
      'lorentz_factor_gamma',
      'lorentz_transformation',
      'sr_time_dilation',
      'length_contraction',
      // V. Gravitational Effects
      'gravitational_time_dilation',
      'gravitational_redshift',
      // VI. Major Metrics
      'minkowski_flat_spacetime',
      'schwarzschild_metric_spacetime',
      'kerr_rotating_black_hole',
      'flrw_cosmological_metric',
      'weak_field_approximation',
      // VII. Light Effects
      'gravitational_lensing',
      'light_deflection_angle',
      // VIII. Numerical Relativity (ADM Formalism)
      'adm_decomposition_3plus1',
      'extrinsic_curvature_kij',
      'hamiltonian_constraint',
      'momentum_constraint',
      // IX. BSSN Formalism (LIGO-level)
      'bssn_conformal_metric',
      'bssn_tracefree_extrinsic',
      'bssn_conformal_connection',
      'bssn_evolution_equations'
    ]
  },
  {
    id: 'quantum_gravity',
    name: 'Quantum Gravity & Planck Scale',
    icon: '🕸️',
    description: 'An advanced visualization platform for theoretical physics at the Planck scale (10⁻³⁵ meters). Renders loop quantum gravity spin networks, causal dynamical triangulations, string theory compactifications, and quantum foam. The first real-time 3D system unifying multiple quantum gravity approaches.',
    engineDynamics: {
      primaryType: 'quantum',
      influenceFactors: ['spin networks', 'Planck length', 'causal sets', 'holographic boundary']
    },
    shapes: [
      // Section 1: Quantum Gravity Core
      'discrete_spacetime_graph',
      'planck_units_visualization',
      'wheeler_dewitt_equation',
      'loop_quantum_area_spectrum',
      'loop_quantum_volume_spectrum',
      'spin_network_vertex',
      'spin_foam_amplitude',
      // Section 2: Emergent Spacetime / Holography
      'ryu_takayanagi_entropy',
      'tensor_network_spacetime',
      'ads_cft_correspondence',
      'holographic_boundary',
      // Section 3: String Theory / Higher Dimensions
      'nambu_goto_string',
      'extra_dimensions_10d',
      'kaluza_klein_compactification',
      'braneworld_model',
      // Section 4: Black Hole Physics
      'black_hole_interior',
      'hawking_radiation_spectrum',
      'information_paradox_surface',
      // Section 5: Cosmological Applications
      'quantum_cosmology_wave',
      'big_bang_singularity',
      'brane_tension_visualization',
      // Section 4: Quantum Cosmology
      'universe_wave_function',
      'wheeler_dewitt_minisuperspace',
      'quantum_tunneling_universe',
      'hartle_hawking_no_boundary',
      // Section 5: Causal Set Theory
      'causal_set_poset',
      'causal_volume_counting',
      'causal_set_sprinkling',
      // Section 7: Curvature Extensions
      'ricci_flow_evolution',
      'f_r_modified_gravity',
      'scalar_tensor_gravity',
      // Section 8: Information-Theoretic Universe
      'bekenstein_hawking_entropy',
      'landauer_principle',
      'information_energy',
      'universe_computation',
      'quantum_error_correction_geometry',
      // Section 9: Numerical Methods
      'discretized_einstein_hilbert',
      'regge_calculus_deficit',
      'finite_difference_curvature',
      'tensor_network_evolution',
      // Section 10: Engine Compatibility
      'lattice_spacetime_node',
      'tetrahedral_quantum_geometry',
      'harmonic_phi_geometry'
    ]
  },
  {
    id: 'cosmic_history_gaps',
    name: '9 Biggest Cosmic History Gaps',
    icon: '🌌',
    shapes: [
      // Gap 1: Pre-Inflationary Physics
      'scalar_field_inflation',
      'quantum_foam_structure',
      // Gap 2: Inflationary Mechanisms
      'cosmic_inflation_exponential',
      'primordial_gravitational_waves',
      'inflaton_potential_landscape',
      // Gap 3: Baryogenesis
      'electroweak_phase_transition',
      'sphaleron_transitions',
      'cp_violation_mechanisms',
      // Gap 4: Dark Matter Nature
      'dark_matter_halo_structure',
      'wimp_dark_matter_detection',
      'axion_field_oscillations',
      // Gap 5: Dark Energy Dynamics
      'phantom_dark_energy',
      'quintessence_field',
      // Gap 6: First Stars and Galaxies
      'primordial_star_formation',
      'cosmic_web_filaments',
      'reionization_bubbles',
      // Gap 7: SMBH Formation
      'supermassive_black_hole_formation',
      'quasar_accretion_disk',
      'primordial_black_hole_merger',
      // Gap 8: Galaxy Formation Efficiency
      'galaxy_formation_simulation',
      'stellar_feedback_mechanisms',
      'dwarf_galaxy_evolution',
      // Gap 9: Fine-Tuning and Anthropic
      'fine_tuning_parameters'
    ]
  },
  {
    id: 'entropic_principles',
    name: 'Entropic Principles & Anthropic Cosmology',
    icon: '🔥',
    engineDynamics: {
      primaryType: 'wave',
      influenceFactors: ['Boltzmann entropy', 'thermodynamic arrow', 'information entropy']
    },
    shapes: [
      // Anthropic Principle
      'anthropic_principle_surface',
      'anthropic_fine_tuning',
      'multiverse_landscape',
      // Entropy Visualizations
      'boltzmann_entropy_landscape',
      'entropy_production_flow',
      'thermodynamic_arrow',
      // Causal Entropic Principle (CEP) - The Fusion
      'causal_entropic_principle',
      'cep_universe_selection',
      'cep_entropy_observer_fusion',
      // Thermodynamic Cosmology
      'cosmic_entropy_budget',
      'boltzmann_brain_probability',
      'heat_death_horizon',
      // Information Entropy
      'shannon_entropy_surface',
      'von_neumann_entropy',
      'holographic_entropy_bound',
      'causal_horizon_boundary',
      'cosmological_constant_cep',
      'density_fluctuation_q_cep'
    ]
  },
  {
    id: 'field_theory',
    name: 'Field Theory & Physics Equations',
    icon: '⚛️',
    shapes: []
  },
  {
    id: 'tensor_algebra',
    name: 'Tensor Algebra & Linear Operators',
    icon: '🔢',
    shapes: [
      'rank_2_tensor_surface'
    ]
  },
  {
    id: 'number_theory',
    name: 'Number Theory & Prime Structures',
    icon: '🔢',
    shapes: []
  },
  {
    id: 'computational_complexity',
    name: 'Computational Complexity Theory',
    icon: '💡',
    shapes: []
  },
  {
    id: 'schrodinger',
    name: 'Schrödinger Equations ⚛️',
    icon: '⚛️',
    shapes: [
      'schrodinger_time_dependent',
      'schrodinger_time_independent',
      'hydrogen_orbital_1s',
      'hydrogen_orbital_2p',
      'hydrogen_orbital_3d',
      'hydrogen_orbital_4f',
      'hydrogen_orbital_5d',
      'hydrogen_orbital_6s',
      'p_orbital_x',
      'p_orbital_y',
      'p_orbital_z',
      'd_orbital_xy',
      'd_orbital_xz',
      'd_orbital_yz',
      'd_orbital_x2_y2',
      'd_orbital_z2',
      'f_orbital_z3',
      'f_orbital_xz2',
      'f_orbital_yz2',
      'f_orbital_xyz',
      'f_orbital_z_x2_y2',
      'f_orbital_x_x2_3y2',
      'f_orbital_y_3x2_y2',
      'quantum_harmonic_oscillator',
      'harmonic_oscillator_n2',
      'harmonic_oscillator_n3',
      'particle_in_box',
      'particle_box_n2',
      'particle_box_n3',
      'quantum_tunneling_barrier',
      'electron_spin_up',
      'electron_spin_down'
    ]
  },
  {
    id: 'relativity',
    name: 'General Relativity & Spacetime',
    icon: '⚫',
    shapes: [
      'schwarzschild_radius',
      'tesla_thread_tension',
      'thread_particle_network',
      'reissner_nordstrom_charged',
      'penrose_diagram_spacetime',
      'gravitational_wave_ripple',
      'ligo_binary_merger'
    ]
  },
  {
    id: 'advanced_math',
    name: '4D & Advanced Math',
    icon: '🔬',
    shapes: [
      'riemann_zeta_critical_line',
      'riemann_zeta_function',
      'euler_product_formula',
      'riemann_integral',
      'test_g_to_m_wave',
      'breather_surface',
      'richmond_surface',
      'bour_minimal_surface',
      'scherk_first_surface',
      'costa_minimal_surface',
      'henneberg_minimal_surface',
      'jeener_klein_bottle',
      'spartan_shield_300',
      'catalan_minimal_surface',
      'penrose_tiling_projection',
      'poincare_disk_hyperbolic',
      'voronoi_delaunay_surface',
      'apollonian_gasket',
      'hypercube_5d_projection',
      'lichtenberg_fractal',
      'spin_network_quantum',
      'calabi_yau_simplified',
      'hopf_fibration',
      'cosmic_fractal_expansion',
      'planck_scale_quantum',
      'fractal_time_spiral',
      'higher_dimensional_projection'
    ]
  },
  {
    id: 'topology_differential',
    name: 'Topology & Differential Geometry',
    icon: '🔄',
    description: 'A visualization system for abstract mathematical spaces and their properties. Renders Klein bottles, Möbius strips, tori, projective planes, and exotic manifolds. Explore homotopy groups, fiber bundles, knot theory, and continuous deformations, properties preserved under stretching and bending.',
    shapes: [
      'klein_bottle_immersion',
      'boy_surface_immersion',
      'roman_surface_steiner',
      'cross_cap_surface',
      'whitney_umbrella',
      'clebsch_cubic_surface',
      'kummer_surface',
      'barth_sextic',
      'genus_2_surface',
      'genus_3_surface',
      'torus_knot_2_3',
      'torus_knot_3_5',
      'trefoil_knot',
      'figure_eight_knot',
      'cinquefoil_knot',
      'granny_knot',
      'square_knot',
      'borromean_rings',
      'hopf_link',
      'whitehead_link',
      'knot_seifert_surface',
      'braid_group_representation',
      'lens_space_l_p_q',
      'connected_sum_surfaces',
      'covering_space_projection',
      'fundamental_group_visualization',
      'homology_group_chain',
      'cohomology_ring_structure',
      'de_rham_cohomology',
      'chern_class_surface',
      'pontryagin_class_field',
      'stiefel_whitney_class',
      'characteristic_class_bundle'
    ]
  },
  {
    id: 'biological',
    name: 'Biological Cells',
    icon: '🧬',
    description: 'A multi-scale visualization system for life sciences from molecular to organism level. Renders cellular organelles, protein folding structures, DNA/RNA molecular machines, and tissue architectures as living 3D structures spanning nanomaterials to complete anatomy systems.',
    shapes: [
      'red_blood_cell',
      'neutrophil',
      'lymphocyte',
      'monocyte',
      'macrophage',
      'platelet',
      'eosinophil',
      'basophil',
      'bacterial_cell',
      'bacteriophage',
      'coronavirus',
      'icosahedral_virus',
      'yeast_cell',
      'paramecium',
      'amoeba',
      'axon_with_myelin'
    ]
  },
  {
    id: 'organelles',
    name: 'Cellular Organelles',
    icon: '🔬',
    shapes: [
      'mitochondria',
      'nucleus',
      'rough_er',
      'golgi_apparatus',
      'lysosome',
      'ribosome',
      'peroxisome',
      'vacuole',
      'centrosome',
      'centriole',
      'nucleolus',
      'smooth_er',
      'chloroplast',
      'plant_cell_wall',
      'plant_vacuole'
    ]
  },
  {
    id: 'nanomaterials',
    name: 'Nanomaterials (1-100nm)',
    icon: '⚛️',
    shapes: [
      'liposome',
      'fullerene_c60',
      'dendrimer',
      'carbon_nanotube',
      'graphene_sheet'
    ]
  },
  {
    id: 'molecular',
    name: 'Molecular Machines & DNA',
    icon: '⚙️',
    shapes: [
      'atp_synthase',
      'kinesin',
      'ribosome_detailed',
      'proteasome',
      'microtubule_structure'
    ]
  },
  {
    id: 'biobots',
    name: 'Synthetic Biobots',
    icon: '🤖',
    shapes: [
      'muscle_powered_biobot',
      'ciliabot',
      'xenobot',
      'magneto_biobot',
      'light_responsive_biobot',
      'chemotactic_biobot',
      'sperm_hybrid_biobot',
      'hydrogel_scaffold_biobot',
      'anthrobot',
      'cardiac_biobot',
      'neuromuscular_biobot',
      'cortical_assembloid'
    ]
  },
  {
    id: 'tpms',
    name: 'TPMS Surfaces',
    icon: '🕸️',
    shapes: [
      'gyroid_tpms',
      'diamond_tpms',
      'primitive_tpms',
      'iws_tpms'
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Pathology',
    icon: '🏥',
    shapes: [
      'mini_olfactory_bulb',
      'breast_cancer_tissue'
    ]
  },
  {
    id: 'human_anatomy',
    name: 'Human Anatomy Systems',
    icon: '🫀',
    shapes: [
      // Cardiovascular (11)
      'heart_4_chambers',
      'heart_valves',
      'coronary_arteries',
      'cardiac_conduction',
      'aorta_arch',
      'vena_cava_network',
      'pulmonary_circulation',
      'capillary_bed',
      'lymphatic_vessel',
      'blood_pressure_wave',
      'cardiac_stent',
      // Nervous System (9)
      'cerebral_cortex',
      'cerebellum_layers',
      'hippocampus',
      'amygdala',
      'spinal_cord_section',
      'peripheral_nerve',
      'synapse_field',
      'glial_network',
      'neuromuscular_junction',
      // Respiratory (7)
      'lung_lobes',
      'bronchial_tree',
      'alveolar_sacs',
      'diaphragm_motion',
      'trachea_cilia',
      'pleural_cavity',
      'gas_exchange_membrane',
      // Digestive (9)
      'oral_cavity',
      'esophagus_peristalsis',
      'stomach_layers',
      'small_intestine_villi',
      'large_intestine',
      'liver_lobule',
      'pancreas_acini',
      'gallbladder',
      'digestive_enzymes',
      // Skeletal/Muscular (7)
      'vertebral_column',
      'rib_cage',
      'skull_vault',
      'pelvis_structure',
      'femur_section',
      'skeletal_muscle_fiber',
      'tendon_matrix',
      // Sensory Organs (7)
      'retina_layers',
      'optic_nerve',
      'cochlea_spiral',
      'semicircular_canals',
      'olfactory_epithelium',
      'taste_buds',
      'skin_receptors'
    ]
  },
  {
    id: 'ai_algorithms',
    name: 'AI & Machine Learning',
    icon: '🧠',
    description: 'A comprehensive visualization platform for artificial intelligence architectures. Renders neural network topologies, attention mechanisms, transformer architectures, and gradient descent landscapes as spatial networks. Visualize loss function surfaces, activation patterns, and deep learning optimization in real-time.',
    shapes: [
      'ai_gradient_descent',
      'ai_sgd_momentum',
      'ai_adam_optimizer',
      'ai_random_forest',
      'ai_svm_kernel',
      'ai_cnn_layers',
      'ai_rnn_sequence',
      'ai_lstm_gates',
      'ai_transformer_attention',
      'ai_gan_adversarial',
      'ai_vae_latent',
      'ai_diffusion_denoise',
      'ai_reinforcement_qlearning',
      'ai_neural_activation',
      'ai_backpropagation',
      'ai_attention_mechanism'
    ]
  },
  {
    id: 'l_systems',
    name: 'L-Systems (Fractals)',
    icon: '🌳',
    shapes: []
  },
  {
    id: 'noise_functions',
    name: 'Noise Functions',
    icon: '⛰️',
    shapes: [
      'perlin_terrain',
      'simplex_ocean_waves',
      'turbulent_clouds',
      'marble_surface',
      'wood_grain_surface'
    ]
  },
  {
    id: 'differential_growth',
    name: 'Differential Growth',
    icon: '🪸',
    shapes: [
      'coral_growth',
      'brain_cortex_folding',
      'lichen_expansion',
      'cellular_membrane',
      'reaction_diffusion_pattern'
    ]
  },
  {
    id: 'cosmic_chaos_studio',
    name: 'Cosmic Chaos Analysis Studio',
    icon: '🌌',
    shapes: [
      'chen_attractor',
      'halvorsen_attractor',
      'thomas_attractor',
      'aizawa_attractor',
      'dadras_attractor',
      'sprott_attractor',
      'three_scroll_attractor',
      'lyapunov_exponent_surface',
      'bifurcation_diagram',
      'strange_attractor_surface',
      'magnetic_field_lines',
      'gravity_well_deformation'
    ]
  },
  {
    id: 'neural_network_algorithms',
    name: 'Neural Network Algorithms',
    icon: '🧠',
    shapes: [
      'node_activation_map',
      'weighted_edge_mapping',
      'signal_propagation_surface',
      'activation_function_landscape',
      'gradient_flow_routing',
      'attention_weight_surface',
      'gating_mechanism_surface',
      'forward_propagation_surface',
      'backpropagation_gradient',
      'loss_function_landscape',
      'adam_optimizer_trajectory',
      'dropout_regularization',
      'batch_normalization_surface',
      'convolutional_kernel',
      'transformer_multihead_attention',
      'autoencoder_latent_space',
      'hopfield_energy_landscape'
    ]
  },
  {
    id: 'lattice_neural_algorithms',
    name: 'Lattice-Form Neural Networks',
    icon: '⬡',
    shapes: [
      'cubic_lattice_neural',
      'hexagonal_lattice_neural',
      'tetrahedral_lattice_connectivity',
      'lattice_wave_propagation',
      'lattice_resonance_mapping',
      'lattice_folding_surface',
      'fractal_lattice_growth',
      'lattice_turbine_nodes',
      'spiral_wave_propulsion',
      'adaptive_topology_reshape',
      'lattice_synchronization_wave'
    ]
  },
  {
    id: 'biological_neural_algorithms',
    name: 'Biological Neural Algorithms',
    icon: '🔬',
    shapes: [
      'stdp_plasticity_surface',
      'hebbian_learning_surface',
      'dendritic_branching',
      'calcium_wave_propagation',
      'neural_oscillation_surface',
      'spike_train_encoding'
    ]
  },
  {
    id: 'voronoi_tessellation',
    name: 'Voronoi & Tessellation',
    icon: '🔷',
    shapes: [
      'voronoi_diagram_3d',
      'weighted_voronoi',
      'centroidal_voronoi',
      'hexagonal_tiling',
      'penrose_tiling'
    ]
  },
  {
    id: 'diamonds',
    name: 'Diamond Cuts',
    icon: '💎',
    shapes: [
      'diamond_round_brilliant',
      'diamond_princess',
      'diamond_emerald',
      'diamond_oval',
      'diamond_marquise',
      'diamond_pear',
      'diamond_heart',
      'diamond_asscher'
    ]
  },
  {
    id: 'quantum_orbitals',
    name: 'Quantum Orbitals',
    icon: '⚛️',
    shapes: [
      'quantum_atom_complete',
      'hydrogen_1s_orbital',
      'hydrogen_2p_orbital',
      'hydrogen_3d_orbital'
    ]
  },
  {
    id: 'quantum_parametric',
    name: 'Quantum Parametric Functions',
    icon: '🔮',
    shapes: [
      'bloch_sphere_quantum',
      'bloch_state_trajectory',
      'quantum_superposition_cloud',
      'quantum_entanglement_field',
      'bell_state_surface',
      'entanglement_entropy_landscape',
      'schmidt_decomposition_visual',
      'quantum_circuit_3d_graph',
      'quantum_gate_unitary_surface',
      'vqe_energy_landscape',
      'vqe_parameter_gradient_field',
      'ansatz_layer_structure',
      'grover_probability_landscape',
      'grover_amplitude_amplification',
      'qft_frequency_spectrum',
      'qft_phase_accumulation',
      'qaoa_optimization_trajectory',
      'qaoa_cost_landscape',
      'quantum_time_evolution_trajectory',
      'trotterization_approximation',
      'tensor_network_mps',
      'tensor_network_peps',
      'nelder_mead_simplex',
      'decoherence_trajectory',
      'noise_channel_effect',
      'measurement_projection_surface',
      'quantum_probability_distribution',
      'operations_convergence'
    ]
  },
  {
    id: 'multidimensional_fractals',
    name: 'Multidimensional Fractals - Kuan Peng',
    icon: '🌀',
    shapes: [
      'mandelbrot_3d',
      'mandelbrot_3d_slice',
      'julia_3d_classic',
      'julia_3d_dragon',
      'julia_3d_spiral',
      'julia_3d_coral',
      'multibrot_3d_cubic',
      'multibrot_3d_quartic',
      'multibrot_3d_quintic',
      'burning_ship_3d',
      'mandelbrot_4d_projection',
      'julia_4d_projection',
      'mandelbox_3d',
      'newton_fractal_3d',
      'buddhabrot_3d'
    ]
  },
  {
    id: 'fractal_iterations',
    name: 'Fractal Iteration Formulas (70+)',
    icon: '∞',
    description: 'Polynomial, trigonometric, exponential, and physics-inspired iteration formulas. Visualize z² + c, z³ + c, eᶻ + c, Burning Ship, and more as 3D heightmaps.',
    shapes: [
      'fractal_mandelbrot_z2',
      'fractal_cubic_z3',
      'fractal_quartic_z4',
      'fractal_quintic_z5',
      'fractal_hexic_z6',
      'fractal_septic_z7',
      'fractal_octagonal_z8',
      'fractal_burning_ship',
      'fractal_trig_chaos',
      'fractal_hyper_spike',
      'fractal_exponential',
      'fractal_spiral_jets',
      'fractal_logarithmic',
      'fractal_self_feeding',
      'fractal_hyperbolic_flame',
      'fractal_energy_decay',
      'fractal_wave_interference',
      'fractal_potential_well',
      'hexic_spirals',
      'septic_vortex',
      'octagonal_mandala',
      'wave_energy_hybrid',
      'spike_shell_armor',
      'crystal_flame_fusion',
      'bio_organic_tissue'
    ]
  },
  {
    id: 'fractal_heightmaps',
    name: 'Fractal Height & Depth Maps',
    icon: '🏔️',
    shapes: [
      'mandelbrot_heightmap',
      'mandelbrot_depth_field',
      'julia_heightmap',
      'julia_depth_canyon',
      'burning_ship_heightmap',
      'multibrot_heightmap',
      'mandelbrot_layer_stack',
      'julia_layer_stack'
    ]
  },
  {
    id: 'aztec_mythology',
    name: 'Aztec Five Suns Mythology',
    icon: '☀️',
    shapes: [
      'nahui_ocelotl',
      'nahui_ehecatl',
      'nahui_quiahuitl',
      'nahui_atl',
      'nahui_ollin'
    ]
  },
  {
    id: 'advanced_algorithms',
    name: 'Advanced Computational Algorithms',
    icon: '⚙️',
    shapes: []
  },
  {
    id: 'astrophysical',
    name: 'Astrophysical Phenomena',
    icon: '🌌',
    shapes: [
      'gravity_well',
      'event_horizon',
      'black_hole_accretion_disk',
      'neutron_star',
      'relativistic_jet',
      'wormhole_throat',
      'kerr_black_hole',
      'gravitational_lens',
      'photon_sphere',
      'cosmic_string',
      'binary_star_system']
  },
  {
    id: 'protein_structures',
    name: 'Protein Folding Structures',
    icon: '🧬',
    shapes: [
      'alpha_helix',
      'beta_sheet',
      'tim_barrel',
      'rossmann_fold',
      'greek_key',
      'coiled_coil',
      'leucine_zipper'
    ]
  },
  {
    id: 'polymer_chains',
    name: 'Polymer Chain Configurations',
    icon: '🔗',
    shapes: [
      'random_coil',
      'extended_chain',
      'collapsed_globule',
      'worm_like_chain'
    ]
  },
  {
    id: 'tissue_structures',
    name: 'Tissue Structures',
    icon: '🫀',
    shapes: [
      'muscle_sarcomere',
      'collagen_triple_helix',
      'bone_trabeculae',
      'tendon_fiber_bundle',
      'actin_filament',
      'microtubule',
      'hemoglobin_quaternary',
      'antibody_y_structure',
      'myosin_motor_protein',
      'keratin_fiber',
      'elastin_network'
    ]
  },
  {
    id: 'extended_crystals',
    name: 'Extended Crystal Structures',
    icon: '💎',
    shapes: [
      'bcc_lattice',
      'hcp_lattice',
      'diamond_cubic',
      'quartz_crystal',
      'calcite_rhombohedron',
      'diamond_cubic_lattice',
      'hexagonal_close_packed',
      'body_centered_cubic',
      'simple_cubic_lattice',
      'wurtzite_structure',
      'rock_salt_structure',
      'perovskite_structure',
      'penrose_tiling_3d',
      'icosahedral_quasicrystal',
      'octahedral_quasicrystal',
      'dodecahedral_quasicrystal',
      'amorphous_glass_network'
    ]
  },
  {
    id: 'astronomical_objects',
    name: 'Astronomical Objects',
    icon: '☄️',
    shapes: [
      'rubble_pile_asteroid',
      'contact_binary_asteroid',
      'elongated_asteroid',
      'planetary_ring',
      'spiral_galaxy',
      'elliptical_galaxy'
    ]
  },
  {
    id: 'weather_systems',
    name: 'Weather Systems & Atmosphere',
    icon: '🌪️',
    shapes: [
      'hurricane_structure',
      'tornado_vortex',
      'cumulonimbus_anvil',
      'mammatus_clouds',
      'lenticular_cloud'
    ]
  },
  {
    id: 'mechanical_shapes',
    name: 'Industrial & Mechanical',
    icon: '⚙️',
    shapes: [
      'spur_gear',
      'helical_gear',
      'bevel_gear',
      'turbine_blade_axial',
      'centrifugal_impeller'
    ]
  },
  {
    id: 'cryptographic_algorithms',
    name: 'Cryptographic Algorithms 🔐',
    icon: '🔐',
    description: 'A 3D visualization system for modern cryptographic primitives. Renders elliptic curves (secp256k1, Ed25519), lattice-based cryptography, hash functions (SHA-256, Keccak), and zero-knowledge proofs as geometric objects. Explore RSA, digital signatures, and blockchain consensus as dynamic 3D flows.',
    shapes: [
      'aes_rijndael_cipher',
      'sha256_compression_function',
      'elliptic_curve_cryptography',
      'keccak_sha3_sponge',
      'lattice_kyber_ntru'
    ]
  },
  {
    id: 'quantum_entanglement',
    name: 'Quantum Entanglement Algorithms 🔗',
    icon: '🔗',
    shapes: [
      'bell_state_visualization',
      'epr_pair_trajectory',
      'quantum_correlation_field',
      'ghz_state_geometry',
      'w_state_geometry',
      'quantum_discord_surface',
      'quantum_teleportation_path'
    ]
  },
  {
    id: 'quantum_computing',
    name: 'QPU & Quantum Computing 💻⚛️',
    icon: '💻',
    description: 'A visualization system for quantum computing architectures and algorithms. Renders qubit states, quantum gates, entanglement networks, and error correction codes as spatial structures. Visualize Bloch spheres, Grover\'s search, Shor\'s algorithm, and variational eigensolvers. Integrates with IBM Quantum backends.',
    shapes: [
      'qubit_bloch_sphere',
      'qubit_state_vector',
      'quantum_superposition_state',
      'quantum_gate_pauli_x',
      'quantum_gate_pauli_y',
      'quantum_gate_pauli_z',
      'quantum_gate_hadamard',
      'quantum_gate_cnot',
      'quantum_gate_toffoli',
      'multi_qubit_tensor_product',
      'two_qubit_entangled_state',
      'three_qubit_ghz_state',
      'hamiltonian_energy_matrix',
      'unitary_time_evolution',
      'schrodinger_evolution_operator',
      'quantum_phase_rotation',
      'quantum_interference_pattern',
      'grover_search_algorithm',
      'shor_factorization_algorithm',
      'quantum_fourier_transform',
      'quantum_phase_estimation',
      'variational_quantum_eigensolver',
      'qaoa_optimization_surface',
      'quantum_annealing_landscape',
      'quantum_error_correction_code',
      'surface_code_lattice',
      'stabilizer_code_graph',
      'quantum_decoherence_trajectory',
      'noise_channel_visualization',
      'quantum_tomography_reconstruction',
      'density_matrix_visualization',
      'fidelity_metric_surface',
      'quantum_discord_geometry',
      'quantum_coherence_measure',
      'adiabatic_quantum_evolution',
      'quantum_walk_graph',
      'continuous_time_quantum_walk',
      'quantum_cellular_automaton',
      'topological_quantum_code']
  },
  {
    id: 'quantum_materials',
    name: 'Quantum Materials Science 🔬⚛️',
    icon: '🔬',
    shapes: []
  },
  {
    id: 'qubit_fundamentals',
    name: 'Qubit Fundamentals & Bloch Sphere',
    icon: '⚛️',
    shapes: [
      'qubit_superposition_state',
      'bloch_sphere_full',
      'computational_basis_states'
    ]
  },
  {
    id: 'multi_qubit_systems',
    name: 'Multi-Qubit Systems & Hilbert Space',
    icon: '⊗',
    shapes: [
      'two_qubit_product_state',
      'hilbert_space_dimension'
    ]
  },
  {
    id: 'quantum_entanglement_bell',
    name: 'Bell States & Entanglement Measures',
    icon: '🔔',
    shapes: [
      'bell_state_phi_plus',
      'bell_state_psi_minus',
      'concurrence_measure',
      'schmidt_decomposition'
    ]
  },
  {
    id: 'single_qubit_gates',
    name: 'Single-Qubit Quantum Gates',
    icon: '🎛️',
    shapes: [
      'pauli_x_gate',
      'pauli_y_gate',
      'pauli_z_gate',
      'hadamard_gate',
      'phase_gate_s',
      'phase_gate_t',
      'rotation_gate_rx',
      'rotation_gate_ry',
      'rotation_gate_rz'
    ]
  },
  {
    id: 'multi_qubit_gates',
    name: 'Multi-Qubit Quantum Gates',
    icon: '🔗',
    shapes: [
      'cnot_gate_surface',
      'controlled_z_gate',
      'swap_gate_surface',
      'toffoli_gate_surface'
    ]
  },
  {
    id: 'quantum_measurement_theory',
    name: 'Quantum Measurement Theory',
    icon: '📏',
    shapes: [
      'projective_measurement',
      'measurement_probability',
      'povm_measurement'
    ]
  },
  {
    id: 'quantum_decoherence',
    name: 'Quantum Decoherence & Relaxation',
    icon: '⏱️',
    shapes: [
      'density_matrix_pure',
      't1_relaxation',
      't2_dephasing',
      'bloch_vector_decay'
    ]
  },
  {
    id: 'quantum_noise_errors',
    name: 'Quantum Noise & Error Channels',
    icon: '🌫️',
    shapes: [
      'bit_flip_channel',
      'phase_flip_channel',
      'depolarizing_channel',
      'amplitude_damping'
    ]
  },
  {
    id: 'quantum_error_correction',
    name: 'Quantum Error Correction Codes',
    icon: '🛡️',
    shapes: [
      'three_qubit_code',
      'shor_nine_qubit',
      'stabilizer_code'
    ]
  },
  {
    id: 'quantum_algorithms_core',
    name: 'Core Quantum Algorithms',
    icon: '🔍',
    shapes: [
      'qft_surface',
      'grover_oracle',
      'grover_diffusion',
      'phase_estimation',
      'shor_period_finding',
      'vqe_energy_surface'
    ]
  },
  {
    id: 'qaoa_optimization',
    name: 'QAOA - Quantum Optimization',
    icon: '🎯',
    shapes: [
      'qaoa_mixer_hamiltonian'
    ]
  },
  {
    id: 'quantum_teleportation_protocol',
    name: 'Quantum Teleportation Protocol',
    icon: '📡',
    shapes: [
      'teleportation_protocol'
    ]
  },
  {
    id: 'adiabatic_annealing',
    name: 'Adiabatic & Quantum Annealing',
    icon: '🧲',
    shapes: [
      'adiabatic_evolution',
      'ising_model_energy'
    ]
  },
  {
    id: 'quantum_machine_learning',
    name: 'Quantum Machine Learning',
    icon: '🤖',
    shapes: [
      'quantum_kernel',
      'qnn_circuit',
      'parameter_shift_gradient'
    ]
  },
  {
    id: 'topological_quantum',
    name: 'Topological Quantum Computing',
    icon: '🌀',
    shapes: [
      'fibonacci_anyon',
      'anyon_braiding'
    ]
  },
  {
    id: 'quantum_sensing',
    name: 'Quantum Sensing & Metrology',
    icon: '🔬',
    shapes: [
      'heisenberg_limit',
      'ramsey_interferometry'
    ]
  },
  {
    id: 'quantum_communication',
    name: 'Quantum Communication & QKD',
    icon: '🔐',
    shapes: [
      'bb84_protocol',
      'entanglement_fidelity'
    ]
  },
  {
    id: 'physical_implementations',
    name: 'Physical Qubit Implementations',
    icon: '⚡',
    shapes: [
      'transmon_energy_levels',
      'ion_trap_rabi',
      'hom_interference'
    ]
  },
  {
    id: 'unified_dna_lattice',
    name: 'Unified DNA-Lattice Matrix (Flagship)',
    icon: '🧬🔷',
    shapes: [
      'energy_field_superposition',
      'vortex_lattice_fusion'
    ]
  },
  {
    id: 'dual_mirror_core',
    name: 'Dual Mirror Energy System',
    icon: '🔮',
    shapes: [
      'dual_mirror_complete',
      'resonance_coupling_surface',
      'four_corner_harmonic'
    ]
  },
  {
    id: 'lattice_crystalline',
    name: 'Lattice Mesh - Crystalline Grid',
    icon: '🔷',
    shapes: [
      'cubic_lattice_crystal',
      'lattice_energy_nodes'
    ]
  },
  {
    id: 'energy_flow_systems',
    name: 'Energy Flow & Vortex',
    icon: '⚡',
    shapes: [
      'energy_vortex_tube',
      'energy_particle_stream',
      'energy_cascade_surface'
    ]
  },
  {
    id: 'field_line_topology',
    name: 'Topological Field Lines',
    icon: '🌀',
    shapes: [
      'topological_field_spiral'
    ]
  },
  {
    id: 'harmonic_resonance',
    name: 'Harmonics & Resonance',
    icon: '🎵',
    shapes: [
      'standing_wave_pattern',
      'fractal_energy_field'
    ]
  },
  {
    id: 'plasma_electrical',
    name: 'Plasma & Electrical Systems',
    icon: '⚡',
    shapes: [
      'electrical_arc_discharge',
      'plasma_containment_field'
    ]
  },
  {
    id: 'energy_mesh_neural',
    name: 'Dense Energy Mesh',
    icon: '🕸️',
    shapes: [
      'energy_web_interconnect',
      'neural_lattice_coupling'
    ]
  },
  {
    id: 'extended_precision_constants',
    name: 'Extended Precision Constants (10⁻¹⁰⁰)',
    icon: '∞',
    shapes: []
  },
  {
    id: 'fractal_analysis',
    name: 'Fractal Analysis & TEM/SEM Imaging',
    icon: '🔍',
    shapes: [
      'box_counting_dimension',
      'minkowski_bouligand_dimension',
      'nested_squares_method_nsm',
      'perimeter_grid_method_pgm',
      'cumulative_intersection_method',
      'concentric_circles_fractal',
      'mass_fractal_dimension_df',
      'radius_of_gyration_rg',
      'fractal_prefactor_k0',
      'primary_particle_radius_a',
      'lacunarity_gap_analysis',
      'lacunarity_spectrum_surface',
      'dlca_aggregation_mechanism',
      'rlca_aggregation_mechanism',
      'pca_aggregation_mechanism',
      'diffusion_limited_cluster',
      'reaction_limited_cluster',
      'particle_cluster_aggregation',
      'mass_radius_relation_complete',
      'structural_coefficient_kg',
      'fractal_aggregate_structure',
      'tem_image_fractal_dimension',
      'sem_image_fractal_dimension',
      'gray_scale_intensity_fractal',
      'intensity_variation_function',
      'scale_invariant_aggregate',
      'heterogeneous_gap_distribution',
      'homogeneous_gap_distribution',
      'center_of_mass_calculation',
      'spatial_position_vector',
      'box_size_epsilon_scaling',
      'linear_regression_slope_df',
      'log_log_plot_fractal',
      'aggregate_boundary_intersection']
  },
  {
    id: 'chaos_theory',
    name: 'Chaos Theory & Strange Attractors 🦋',
    icon: '🦋',
    description: 'Dynamical systems exhibiting sensitive dependence on initial conditions - Lorenz, Rössler, Hénon, Van der Pol, Duffing, and Feigenbaum bifurcations',
    engineDynamics: {
      primaryType: 'fractional',
      influenceFactors: ['Lyapunov exponents', 'strange attractors', 'period-doubling', 'butterfly effect']
    },
    shapes: [
      // Classic Strange Attractors
      'logistic_map',
      'lyapunov_exponent',
      'lorenz_attractor',
      'lorenz_trajectory',
      'rossler_attractor',
      'rossler_spiral',
      'hausdorff_fractal',
      'box_counting_fractal',
      'correlation_dimension',
      'henon_map',
      'henon_basin',
      'van_der_pol',
      'van_der_pol_limit_cycle',
      'duffing_oscillator',
      'duffing_attractor',
      'feigenbaum_bifurcation',
      'feigenbaum_scaling',
      'chaos_transition',
      'strange_attractor_composite',
      'sensitive_dependence',
      // Master Equation: S_{n+1} = f(S_n) + δ
      'master_equation_stable',
      'master_equation_unstable',
      // Self-Reference: x = f(x)
      'self_reference_fixed_point',
      'recurrence_relation',
      'divergent_recursion',
      // Feedback Systems: y = Gy
      'positive_feedback_runaway',
      'negative_feedback_stable',
      // Lyapunov Stability: |f'(x*)| < 1
      'lyapunov_stable_basin',
      'lyapunov_unstable_saddle',
      // Delay & Causality
      'delay_differential',
      'causality_light_cone',
      // Recursion & Base Cases
      'well_founded_recursion',
      'stack_overflow_tower',
      // Entropy & Thermodynamics
      'entropy_growth',
      // Computational Patterns
      'temporal_dead_zone'
    ]
  },
  {
    id: 'consciousness_math',
    name: 'Consciousness Mathematics 🧠',
    icon: '🧠',
    description: 'Mathematical concepts mapped onto human consciousness - Constants (core identity), Chaos (unpredictability), and Infinities (boundless awareness)',
    engineDynamics: {
      primaryType: 'topological',
      influenceFactors: ['self-awareness', 'behavioral patterns', 'psychological spacetime', 'free will']
    },
    shapes: [
      'core_identity_constants',
      'behavioral_strange_attractor',
      'consciousness_recursion',
      'trauma_black_hole',
      'self_event_horizon',
      'butterfly_effect_life',
      'potential_infinity_field',
      'free_will_paradox',
      'emergent_complexity',
      'obsession_gravity_well',
      'love_grief_infinity',
      'twin_divergence',
      'unconscious_depths',
      'personality_constants',
      'consciousness_unified'
    ]
  },
  {
    id: 'unsolved_problems',
    name: 'Unsolved Mathematical Problems 🧩',
    icon: '🧩',
    shapes: [
      'nested_spheres_golden',
      'navier_stokes_turbulence',
      'protein_folding_landscape',
      'yang_mills_mass_gap',
      'consciousness_wave_collapse',
      'riemann_zeta_zeros',
      'p_vs_np_complexity',
      'quantum_gravity_unified',
      'time_symmetry_breaking',
      'homotopy_infinity_category']
  },
  {
    id: 'financial_ml',
    name: 'Financial & Machine Learning 💰🤖',
    icon: '📈',
    shapes: [
      'black_scholes_surface',
      'volatility_surface',
      'crypto_price_fractal',
      'monte_carlo_risk',
      'neural_loss_landscape',
      'gradient_descent_path',
      'attention_mechanism',
      'hash_avalanche_effect',
      'blockchain_merkle_tree',
      'kolmogorov_complexity',
      'quantum_information_flow'
    ]
  },
  {
    id: 'advanced_physics',
    name: 'Advanced Physics Simulations ⚛️',
    icon: '🔬',
    shapes: [
      'reynolds_vortex_street',
      'maxwell_field_lines',
      'lorentz_force_field',
      'tokamak_confinement',
      'magnetic_reconnection',
      'quantum_tunneling',
      'pauli_exclusion_states',
      'bose_einstein_condensate',
      'superconductor_vortex',
      'phonon_dispersion'
    ]
  },
  {
    id: 'consciousness',
    name: 'Consciousness & Cognition 🧠',
    icon: '💭',
    shapes: [
      'integrated_information_phi',
      'global_workspace_theory',
      'attention_selection_field',
      'predictive_processing',
      'free_energy_principle',
      'working_memory_dynamics',
      'neural_synchrony',
      'qualia_space'
    ]
  },
  {
    id: 'sequence_patterns',
    name: 'Mathematical Sequence Patterns 🔢',
    icon: '🔢',
    shapes: [
      'fibonacci_spiral',
      'multiplicative_fibonacci',
      'subtractive_sequence',
      'division_sequence',
      'square_root_sequence',
      'geometric_mean_sequence',
      'harmonic_mean_sequence',
      'modulo_sequence',
      'sine_wave_sequence',
      'logarithmic_sequence',
      'max_min_sequence',
      'absolute_difference',
      'tribonacci_sequence',
      'exponential_fibonacci',
      'xor_binary_sequence',
      'chebyshev_recurrence',
      'catalan_like_sequence',
      'collatz_inspired',
      'hilbert_curve_3d',
      'gaussian_distribution_3d',
      'fourier_series_surface',
      'wave_packet_3d',
      'riemann_zeta_surface'
    ]
  },
  {
    id: 'mathematical_constants',
    name: 'Mathematical Constants ∞',
    icon: '∞',
    shapes: [
      'golden_ratio',
      'pi_constant',
      'eulers_number',
      'pythagoras_constant',
      'sqrt_three',
      'sqrt_five',
      'euler_mascheroni',
      'catalan_constant',
      'apery_constant',
      'khinchin_constant',
      'feigenbaum_delta',
      'feigenbaum_alpha',
      'conway_constant',
      'mills_constant',
      'fine_structure',
      'ramanujan_soldner',
      'plastic_number',
      'silver_ratio',
      'bronze_ratio',
      'supergolden_ratio',
      'glaisher_kinkelin',
      'meissel_mertens',
      'twin_prime',
      'landau_ramanujan',
      'tribonacci_constant',
      'pell_constant',
      'omega_constant',
      'champernowne_constant',
      'phi_power_pi',
      'phi_times_pi',
      'phi_plus_pi',
      'phi_median_pi',
      'phi_mean_pi',
      'phi_divide_pi',
      'phi_minus_pi'
    ]
  },
  {
    id: 'unified_symbols',
    name: 'Unified Math Symbols & Emojis 🔣',
    icon: '🔣',
    shapes: [
      'coordinate_x_axis',
      'coordinate_y_axis',
      'coordinate_z_axis',
      'golden_ratio_spiral',
      'fire_emoji_mesh',
      'wave_emoji_mesh',
      'star_emoji_mesh',
      'spiral_emoji_mesh',
      'heart_emoji_mesh',
      'lightning_emoji_mesh',
      'diamond_emoji_mesh',
      'sine_wave_surface',
      'cosine_wave_surface',
      'tangent_wave_surface',
      'phi_constant_visualization',
      'ton_202_visualization',
      'ton_618_visualization'
    ]
  },
  {
    id: 'temporal_geometry',
    name: 'Temporal Geometry (Cross=Time) 🕰️',
    icon: '🕰️',
    shapes: [
      'cross_time_map',
      'time_plane_extrusion',
      'cube_net_fold',
      'temporal_mandala',
      'observer_anchor',
      'minkowski_spacetime_cross',
      'temporal_cube',
      'quantum_collapse_cross',
      'dimensional_gateway',
      'cartesian_origin'
    ]
  },
  {
    id: 'national_mottos',
    name: 'National Mottos & Slogans - Algorithmic Principles 🗽',
    icon: '🗽',
    shapes: [
      'in_god_we_trust_bayesian',
      'united_we_stand_graph',
      'dont_tread_boundary',
      'liberty_justice_fair_division',
      'life_liberty_happiness_pareto',
      'one_nation_indivisible_mincut',
      'buck_stops_here_accountability',
      'we_the_people_consensus',
      'e_pluribus_unum_ensemble'
    ]
  },
  {
    id: 'inverse_fishbowl_space',
    name: 'Inverse Fish-Bowl Space Model 🔮',
    icon: '🔮',
    shapes: []
  },
  {
    id: 'blockchain_consensus',
    name: 'Blockchain Consensus Mechanisms ⛓️',
    icon: '⛓️',
    shapes: [
      'proof_of_work',
      'proof_of_stake']
  },
  {
    id: 'blockchain_cryptographic',
    name: 'Cryptographic Primitives 🔐',
    icon: '🔐',
    shapes: [
      'elliptic_curve_crypto']
  },
  {
    id: 'blockchain_proof_systems',
    name: 'Zero-Knowledge Proof Systems 🔬',
    icon: '🔬',
    shapes: [
      'zk_snark']
  },
  {
    id: 'blockchain_layer2',
    name: 'Layer-2 & Scaling Solutions 🚀',
    icon: '🚀',
    shapes: []
  },
  {
    id: 'blockchain_privacy',
    name: 'Privacy Algorithms 🔒',
    icon: '🔒',
    shapes: []
  },
  {
    id: 'blockchain_post_quantum',
    name: 'Post-Quantum Cryptography 🌐',
    icon: '🌐',
    shapes: [
      'dilithium_signatures']
  },
  {
    id: 'chakras',
    name: 'Chakras & Healing Frequencies 🧘',
    icon: '🧘',
    shapes: [
      'chakra_root_muladhara',
      'chakra_sacral_svadhisthana',
      'chakra_solar_plexus_manipura',
      'chakra_heart_anahata',
      'chakra_throat_vishuddha',
      'chakra_third_eye_ajna',
      'chakra_crown_sahasrara',
      'chakra_full_alignment',
      'kundalini_spiral',
      'solfeggio_mandala'
    ]
  },
  // LIFE SCIENCES - Major Gaps Addressed
  {
    id: 'molecular_biology',
    name: "🧬 Molecular Biology",
    icon: '🧬',
    description: "Protein structures, CRISPR mechanisms, metabolic pathways",
    shapes: [
      "crispr_cas9_mechanism",
      "metabolic_pathway_network",
      "enzyme_kinetics_surface",
      "rna_secondary_structure",
      "ribosome_structure"
    ]
  },
  {
    id: 'microbiology',
    name: "🦠 Microbiology",
    icon: '🦠',
    description: "Bacterial growth, virus cycles, antibiotic resistance",
    shapes: [
      "bacterial_growth_curve",
      "virus_replication_cycle",
      "antibiotic_resistance_evolution",
      "microbiome_ecosystem",
      "biofilm_structure",
      "phage_therapy_dynamics"
    ]
  },
  {
    id: 'botany',
    name: "🌱 Botany & Plant Science",
    icon: '🌱',
    description: "Photosynthesis, plant hormones, root systems",
    shapes: [
      "photosynthesis_light_reactions",
      "plant_hormone_signaling",
      "root_system_architecture",
      "pollination_mechanism",
      "leaf_venation_pattern",
      "phloem_transport_system"
    ]
  },
  ICE_CRYSTAL_CATEGORY,
  TIME_TRAVEL_PHYSICS_CATEGORY,
  SPACE_BIOLOGY_CATEGORY,
  INVERSE_SQUARE_LAW_CATEGORY,
  MINIMAL_SURFACES_SPHERES_CATEGORY,
  MINIMAL_SURFACES_TORI_CATEGORY,
  MINIMAL_SURFACES_HIGHER_GENUS_CATEGORY,
  {
    id: 'zoology_ecology',
    name: "🐛 Zoology & Ecology",
    icon: '🐛',
    description: "Population dynamics, food webs, ecosystem energy flow",
    shapes: [
      "population_dynamics_model",
      "food_web_visualization",
      "migration_pattern_analysis",
      "ecosystem_energy_flow",
      "predator_prey_dynamics",
      "biodiversity_landscape"
    ]
  },

  // EARTH & ENVIRONMENTAL SCIENCES
  {
    id: 'geology',
    name: "🌍 Geology",
    icon: '🌍',
    description: "Plate tectonics, mineral growth, volcanic modeling",
    shapes: [
      "plate_tectonics_simulation",
      "mineral_crystal_growth",
      "volcanic_eruption_model",
      "sediment_layer_formation",
      "fault_system_dynamics",
      "mountain_building_process"
    ]
  },
  {
    id: 'oceanography',
    name: "🌊 Oceanography",
    icon: '🌊',
    description: "Ocean currents, tidal dynamics, marine ecosystems",
    shapes: [
      "ocean_current_system",
      "tidal_dynamics_model",
      "marine_ecosystem_model",
      "deep_sea_pressure_effects",
      "thermohaline_circulation",
      "coral_reef_structure"
    ]
  },
  {
    id: 'meteorology',
    name: "🌤️ Meteorology",
    icon: '🌤️',
    description: "Weather patterns, climate change, atmospheric circulation",
    shapes: [
      "weather_pattern_simulation",
      "climate_change_model",
      "atmospheric_circulation",
      "storm_formation_dynamics",
      "tornado_vortex_structure",
      "hurricane_eye_wall"
    ]
  },

  // SOCIAL SCIENCES & HUMANITIES
  {
    id: 'economics',
    name: "📊 Economics",
    icon: '📊',
    description: "Market dynamics, supply/demand, financial risk modeling",
    shapes: [
      "market_dynamics_visualization",
      "supply_demand_curves",
      "economic_network_analysis",
      "financial_risk_model",
      "inflation_dynamics_surface",
      "trade_flow_network"
    ]
  },
  {
    id: 'sociology',
    name: "👥 Sociology",
    icon: '👥',
    description: "Social networks, population migration, urban development",
    shapes: [
      "social_network_analysis",
      "population_migration_pattern",
      "urban_development_model",
      "cultural_diffusion_system",
      "demographic_transition_model",
      "social_mobility_landscape"
    ]
  },
  {
    id: 'political_science',
    name: "🏛️ Political Science",
    icon: '🏛️',
    description: "Voting systems, geopolitical modeling, policy impact",
    shapes: [
      "voting_system_analysis",
      "geopolitical_model",
      "policy_impact_visualization",
      "democratic_process_simulation",
      "power_distribution_network",
      "electoral_map_dynamics"
    ]
  },

  // APPLIED SCIENCES
  {
    id: 'industrial_engineering',
    name: "🏭 Industrial Engineering",
    icon: '🏭',
    description: "Manufacturing optimization, supply chains, quality control",
    shapes: [
      "manufacturing_optimization",
      "supply_chain_visualization",
      "quality_control_system",
      "lean_manufacturing_flow",
      "production_line_dynamics",
      "inventory_optimization_surface"
    ]
  },
  {
    id: 'civil_engineering',
    name: "🏗️ Civil Engineering",
    icon: '🏗️',
    description: "Structural analysis, traffic flow, urban planning",
    shapes: [
      "structural_load_analysis",
      "traffic_flow_optimization",
      "urban_planning_model",
      "infrastructure_resilience",
      "bridge_stress_distribution",
      "earthquake_response_model"
    ]
  },
  {
    id: 'aerospace_engineering',
    name: "✈️ Aerospace Engineering",
    icon: '✈️',
    description: "Aerodynamics, orbital mechanics, propulsion systems",
    shapes: [
      "aerodynamic_flow_visualization",
      "orbital_mechanics_model",
      "propulsion_system_model",
      "flight_path_optimization",
      "shock_wave_pattern",
      "spacecraft_trajectory"
    ]
  },

  // UNIFIED THEORY INTEGRATION
  {
    id: 'unified_master',
    name: "🌌 Unified Master Equation",
    icon: '🌌',
    description: "Core law of reality: dΨ/dt = F(Ψ) across all domains",
    shapes: [
      "unified_master_equation",
      "neuroscience_brain_state",
      "mathematics_structure_transform",
      "physics_matter_field_arrangement",
      "quantum_wavefunction_evolution",
      "information_entropy_flow",
      "consciousness_world_model"
    ]
  },
  // G MOD 6 PATTERNS - NEW CATEGORY
  {
    id: 'gmod6-patterns',
    name: '🔄 G Mod 6 Patterns',
    description: 'Modulo-6 mathematical cycles and hexagonal geometry',
    shapes: [
      'uuon_hexagonal_wave',
      'uuon_sixphase_cycle',
      'uuon_rotational_symmetry',
      'uuon_topology_selector',
      'uuon_hexagonal_lattice',
      'uuon_pattern_generator'
    ]
  },

  // HARMONY WAVE SHAPES - Animation-focused parametric surfaces
  {
    id: 'harmony_waves',
    name: '🎵 Harmony & Symphony',
    icon: '🎵',
    description: 'Musical harmony, wave dynamics, morphing transitions, and 4D rotations',
    engineDynamics: {
      primaryType: 'wave',
      symmetryOrder: 6,
      influenceFactors: ['harmonic ratios', 'wave interference', '4D projections']
    },
    shapes: [
      'harmonic_resonance_surface',
      'pythagorean_harmony_shell',
      'golden_harmonic_spiral',
      'symphony_wave_orchestration',
      'polyphonic_surface',
      'crescendo_diminuendo_surface',
      'wave_superposition_field',
      'standing_wave_resonator',
      'doppler_wave_surface',
      'sphere_to_torus_morph',
      'cube_to_sphere_morph',
      'wave_to_calm_morph',
      'hypersphere_4d_projection',
      'tesseract_4d_wireframe',
      'klein_bottle_4d_harmony',
      'hypercube_rotation_4d',
      'heat_diffusion_surface',
      'newton_cooling_curve',
      'entropy_flow_surface'
    ]
  },

  // ATOMIC STRUCTURE SHAPES - Electron orbitals and molecular bonds
  {
    id: 'atomic_structures',
    name: '⚛️ Atomic & Molecular',
    icon: '⚛️',
    description: 'Atomic models, electron orbitals (s/p/d/f), molecular bonds, and electron associations',
    engineDynamics: {
      primaryType: 'orbital',
      symmetryOrder: 4,
      influenceFactors: ['quantum numbers', 'electron density', 'bond order']
    },
    shapes: [
      'bohr_atom_shell',
      'rutherford_nucleus',
      'electron_probability_cloud',
      's_orbital',
      'p_orbital',
      'd_orbital',
      'f_orbital',
      'hybrid_sp3_orbital',
      'hybrid_sp2_orbital',
      'sigma_bond_surface',
      'pi_bond_surface',
      'covalent_bond_cloud',
      'electron_density_field',
      'valence_shell',
      'electron_spin_surface',
      'pauli_exclusion_shell',
      'aufbau_orbital_filling',
      'ionic_bond_field',
      'metallic_bond_sea',
      'hydrogen_bond_bridge',
      'molecular_orbital_antibonding'
    ]
  },

  // UNIFIED THEORY OF EVERYTHING CANVAS - Complete system visualizations
  {
    id: 'unified_toe_canvas',
    name: '🌌 Theory of Everything',
    icon: '🌌',
    description: 'Complete unified field visualizations showing all mathematical domains working together',
    engineDynamics: {
      primaryType: 'quantum' as const,
      symmetryOrder: 10,
      influenceFactors: ['quantum-gravity coupling', 'force unification', 'holographic principle']
    },
    shapes: [
      'toe_unified_field_manifold',
      'toe_quantum_gravity_interface',
      'toe_four_forces_mandala',
      'toe_string_landscape_multiverse',
      'toe_holographic_universe',
      'toe_supersymmetry_partners',
      'toe_grand_unified_gauge',
      'toe_information_entropy_cosmos',
      'toe_vacuum_energy_cosmological',
      'toe_complete_universe_fabric'
    ]
  },

  // THERMAL ENGINEERING & DATA CENTER COOLING - AI Infrastructure
  {
    id: 'thermal_engineering',
    name: '🔥 Thermal Engineering & Data Center Cooling',
    icon: '🔥',
    description: 'AI Infrastructure Thermal Engineering: 31 shapes including heat dissipation, PUE/COP efficiency, Navier-Stokes CFD, Reynolds turbulence, immersion cooling, heat exchangers, GPU power dynamics, exergy analysis, sustainability metrics (WUE/CUE), nonlinear COP models, and cross-domain mathematical DNA patterns',
    engineDynamics: {
      primaryType: 'wave' as const,
      symmetryOrder: 4,
      influenceFactors: ['heat_transfer', 'fluid_dynamics', 'thermodynamic_efficiency', 'CFD_simulation']
    },
    shapes: [
      'heat_dissipation_surface',
      'heat_flux_density',
      'sensible_heat_removal',
      'pue_efficiency_surface',
      'cop_coefficient_performance',
      'thermal_resistance_network',
      'junction_temperature_surface',
      'nusselt_convection_surface',
      'reynolds_flow_regime',
      'immersion_cooling_boiling',
      'heat_exchanger_effectiveness',
      'ntu_transfer_units',
      'navier_stokes_momentum',
      'hot_cold_aisle_containment',
      'direct_chip_liquid_cooling',
      'fan_affinity_laws',
      'cooling_tower_effectiveness',
      'rack_power_density_limit',
      'gpu_dynamic_power',
      'exergy_thermodynamic_analysis',
      'waste_heat_recovery',
      'phase_change_thermal_storage',
      'water_usage_effectiveness',
      'carbon_usage_effectiveness',
      'ehd_electrohydrodynamic_cooling',
      'polynomial_cop_surface',
      'rational_cop_model',
      'bezier_cop_curve',
      'unified_polar_field',
      'interference_enhanced_cooling',
      'spherical_harmonic_cop'
    ]
  },

  // CROSS-DOMAIN HYBRID SHAPES - Publication Section 3.1
  {
    id: 'cross_domain_hybrids',
    name: '🔗 Cross-Domain Mathematical Fusions',
    icon: '🔗',
    description: 'Cross-Domain Hybrid Shapes: 8 novel parametric surfaces fusing relativity×thermal, quantum×cooling, tensor×harmonics, and COP×Fourier. Implements Section 3.1 of "THE DMENSION SYSTEM" publication - emergent mathematics from domain fusion.',
    engineDynamics: {
      primaryType: 'wave' as const,
      symmetryOrder: 4,
      influenceFactors: ['relativity', 'quantum_physics', 'thermal_engineering', 'harmonic_analysis', 'tensor_algebra']
    },
    shapes: [
      'relativistic_thermal_curvature',
      'warped_cop_schwarzschild',
      'hawking_interference_cooling',
      'quantum_cooling_lattice',
      'christoffel_harmonic_field',
      'riemann_harmonic_surface',
      'harmonic_cop_fourier',
      'thermal_landscape_chebyshev'
    ]
  },

  // SLINKY DYNAMICS - Wave mechanics, spring physics, Lagrangian models
  {
    id: 'slinky_dynamics',
    name: '🔗 Slinky Dynamics',
    icon: '🔗',
    description: 'Slinky physics: time-varying helix, longitudinal waves, compression envelope, walking dynamics, Lagrangian mechanics, solitons, and parametric oscillators. A living wave system combining tension waves, gravity-induced collapse, nonlinear elasticity, and distributed mass-spring mechanics.',
    engineDynamics: {
      primaryType: 'wave' as const,
      symmetryOrder: 6,
      influenceFactors: ['spring_mechanics', 'wave_propagation', 'gravity', 'nonlinear_elasticity']
    },
    shapes: [
      'slinky_time_varying_helix',
      'slinky_compression_helix',
      'slinky_longitudinal_wave',
      'slinky_standing_wave',
      'slinky_compression_envelope',
      'slinky_tension_propagation',
      'slinky_walking_map',
      'slinky_stair_descent',
      'slinky_lagrangian_surface',
      'slinky_phase_space',
      'slinky_hamiltonian_flow',
      'slinky_parametric_oscillator',
      'slinky_resonance_zones',
      'slinky_soliton_wave',
      'slinky_nonlinear_wave',
      'slinky_torsional_mode',
      'slinky_coupled_modes',
      'slinky_distributed_spring',
      'slinky_wave_equation',
      'slinky_gravity_drop'
    ]
  },

  // RUBIK'S CUBE DYNAMICS - Group theory, permutations, state space
  {
    id: 'rubiks_cube_dynamics',
    name: "🎲 Rubik's Cube Dynamics",
    icon: '🎲',
    description: "Rubik's Cube group theory: 43 quintillion states, God's Number (20), permutation cycles, Cayley graphs, commutators, conjugates, and symmetry groups. Pure mathematics in toy form - combining abstract algebra, combinatorics, and spatial reasoning.",
    engineDynamics: {
      primaryType: 'symmetry' as const,
      symmetryOrder: 48,
      influenceFactors: ['group_theory', 'permutations', 'combinatorics', 'state_space']
    },
    shapes: [
      'rubiks_cube_lattice',
      'rubiks_cube_face',
      'rubiks_face_rotation',
      'rubiks_rotation_orbit',
      'rubiks_slice_move',
      'rubiks_permutation_cycle',
      'rubiks_cayley_graph',
      'rubiks_group_orbit',
      'rubiks_state_space',
      'rubiks_solve_path',
      'rubiks_gods_number',
      'rubiks_corner_orientation',
      'rubiks_edge_orientation',
      'rubiks_commutator',
      'rubiks_conjugate',
      'rubiks_sexy_move',
      'rubiks_symmetry_group',
      'rubiks_subgroup_structure',
      'rubiks_scramble_entropy',
      'rubiks_pattern_cube'
    ]
  },

  // NASA PLANETARY - External asset integration with 8k textures
  {
    id: 'nasa_planetary',
    name: '🪐 NASA Planetary',
    icon: '🪐',
    description: 'NASA planetary visualizations with 8k textures and validated scientific data. Saturn: 58,232 km equatorial radius, 0.0980 oblateness, 0.687 g/cm³ density. Ring system: D-E rings spanning 66,900-140,180 km, ~10m thick. Atmospheric composition: 96.3% H₂, 3.25% He. 146 moons including Titan. External asset integration test demonstrating texture application and scientific enhancement.',
    engineDynamics: {
      primaryType: 'radial' as const,
      symmetryOrder: 1,
      influenceFactors: ['planetary_science', 'orbital_mechanics', 'atmospheric_physics', 'ring_dynamics']
    },
    shapes: [
      'nasa_saturn',
      'nasa_saturn_rings',
      'nasa_saturn_complete'
    ]
  },

  // EVOLUTIONARY STRING THEORY - Harmonic evolution, consciousness-energy spectrum
  {
    id: 'evolutionary_string_theory',
    name: '🎵 Evolutionary String Theory',
    icon: '🎵',
    description: 'Evolution as harmonic string vibrations. Second harmonics (1/3 divisions) mark evolutionary leaps. 11D compactification with 6-7 dimensions as consciousness levels. Toroidal universe model. Three reality realms: Non-dual absolute, Potential relative, Spatiotemporal. Predicts Ω Singularity (~2217) where evolutionary acceleration converges toward infinite creativity.',
    engineDynamics: {
      primaryType: 'wave' as const,
      symmetryOrder: 11,
      influenceFactors: ['harmonic_evolution', 'consciousness_energy', 'string_vibration', 'dimensional_compactification']
    },
    shapes: [
      'evolutionary_harmonic_string',
      'omega_singularity_attractor',
      'consciousness_energy_spectrum',
      'toroidal_universe_model',
      'eleven_dimensional_compactification',
      'planck_scale_vibration',
      'phylogenetic_ontogenetic_harmony',
      'three_realms_manifold',
      'evolutionary_leap_surface',
      'universal_string_fundamental',
      'holographic_fractal_universe',
      'nondual_absolute_core',
      'entropic_syntropic_balance',
      'chakra_harmonic_spectrum',
      'implicate_explicate_holomovement',
      'spiral_of_fifths_evolution',
      'quantum_leap_discontinuity',
      'fractal_time_acceleration',
      'collective_memory_field'
    ]
  },

  // EFV (Energy-Frequency-Variation) System - Unified geometric control framework
  {
    id: 'efv_system',
    label: 'EFV System',
    name: '⚡ EFV System',
    icon: '⚡',
    description: 'Energy-Frequency-Variation formal analytical framework. Three orthogonal parameters control dynamic geometry: Energy (amplitude/displacement), Frequency (rate/iterations), Variation (entropy/diversity). Single-Shape Principle ensures all formulas resolve to one coherent geometric state through cumulative transformation.',
    engineDynamics: {
      primaryType: 'wave' as const,
      symmetryOrder: 3,
      influenceFactors: ['energy_amplitude', 'frequency_modulation', 'variation_entropy', 'configuration_space']
    },
    shapes: [
      'efv_amplitude_operator',
      'efv_frequency_modulator',
      'efv_variation_entropy',
      'efv_composite_transformation',
      'efv_configuration_space',
      'efv_emergent_stability',
      'efv_direction_field',
      'efv_bounded_variation'
    ]
  },

  // Φ³ Aureum Collection - Golden ratio geometry with triadic symmetry
  {
    id: 'phi3_aureum',
    label: 'Φ³ Aureum',
    name: '🥚 Φ³ Aureum',
    icon: '🥚',
    description: 'Golden ratio geometry with triadic symmetry. The growth constant Φ shapes radial expansion while threefold rotational symmetry (n=3) weaves intertwined spirals. r(θ) = R·Φ^(θ/2π), x = r·cos(3θ), y = r·sin(3θ). Forms that grow as nature grows.',
    engineDynamics: {
      primaryType: 'radial' as const,
      symmetryOrder: 3,
      influenceFactors: ['golden_ratio', 'triadic_symmetry', 'phi_growth', 'natural_proportion']
    },
    shapes: [
      'phi3_aureum_ovum',
      'phi3_aureum_helix',
      'phi3_aureum_manifold'
    ]
  },

  // AUTO-REGISTERED SHAPES - IMMUNE SYSTEM CATEGORY
  {
    id: 'miscellaneous',
    name: '🔧 Auto-Registered Shapes',
    icon: '🔧',
    description: 'System immune response - prevents crashes from unregistered shapes',
    shapes: []  // Will be populated dynamically by the validation system
  },

  // IFS FRACTALS — Raymarched iterated-function-system attractors (WebGL renderer swap)
  {
    id: 'ifs_fractals',
    name: '🌀 IFS Fractals',
    icon: '🌀',
    description: 'Iterated Function System fractals rendered via WebGL raymarching. Menger sponges, Mandelbox, Kleinian limit sets, and compound IFS attractors. A-Z bridge: A=camera distance, B=FOV, C=brightness.',
    engineDynamics: {
      primaryType: 'fractal',
      symmetryOrder: 3,
      influenceFactors: ['fold type', 'scale factor', 'offset', 'iteration depth', 'blend']
    },
    shapes: [
      'menger_sponge',
      'mandelbox_fractal',
      'kleinian_fractal',
      'lattice_fractal',
      'tetrahedral_fractal',
      'anisotropic_menger',
      'chaos_boundary_menger',
      'compound_ifs_blend',
      'icosahedral_ifs',
      'fractal_weave',
      'reaction_diffusion_ifs',
      'lsystem_ifs',
      // New raymarched engines
      'mandelbulb_raymarched',
      'platonic_icosa',
      'platonic_octa',
      'platonic_dodeca',
      'menger_kleinian_v2',
    ]
  },

  // PARAMETRIC LIBRARY PACK - 10 Master Categories (40+ shapes)
  ...PARAMETRIC_LIBRARY_CATEGORIES
].filter(category => category.shapes.length > 0); // Only include categories with shapes

console.log(`🔗 Shape categories reconnected: ${SHAPE_CATEGORIES.length} categories with ${SHAPE_CATEGORIES.reduce((total, cat) => total + cat.shapes.length, 0)} total shapes`);

// Dimensional Ordering System - Basic → 4D → 5D+ → Chaotic
// Each category gets a section (1-6) and priority within that section
const CATEGORY_DIMENSIONAL_ORDER: Record<string, { section: number; priority: number; sectionName: string }> = {
  // SECTION 0: Riemann Geometry (foundational mathematics)
  'riemann_geometry': { section: 0, priority: 1, sectionName: 'R Riemann Geometry' },

  // SECTION 1: Welcome & Basic 3D (simplest shapes)
  'welcome': { section: 1, priority: 1, sectionName: '🔷 Basic 3D' },
  'basic': { section: 1, priority: 2, sectionName: '🔷 Basic 3D' },
  'waves': { section: 1, priority: 3, sectionName: '🔷 Basic 3D' },
  'chakras': { section: 1, priority: 4, sectionName: '🔷 Basic 3D' },
  'diamonds': { section: 1, priority: 5, sectionName: '🔷 Basic 3D' },
  'extended_crystals': { section: 1, priority: 6, sectionName: '🔷 Basic 3D' },
  'mechanical_shapes': { section: 1, priority: 7, sectionName: '🔷 Basic 3D' },

  // SECTION 2: Mathematical 3D Surfaces
  'topology_differential': { section: 2, priority: 1, sectionName: '📐 Mathematical 3D' },
  'advanced_math': { section: 2, priority: 2, sectionName: '📐 Mathematical 3D' },
  'number_theory': { section: 2, priority: 3, sectionName: '📐 Mathematical 3D' },
  'set_theory': { section: 2, priority: 4, sectionName: '📐 Mathematical 3D' },
  'field_theory': { section: 2, priority: 5, sectionName: '📐 Mathematical 3D' },
  'tensor_algebra': { section: 2, priority: 6, sectionName: '📐 Mathematical 3D' },
  'mathematical_constants': { section: 2, priority: 7, sectionName: '📐 Mathematical 3D' },
  'unified_symbols': { section: 2, priority: 8, sectionName: '📐 Mathematical 3D' },
  'sequence_patterns': { section: 2, priority: 9, sectionName: '📐 Mathematical 3D' },
  'mathematical-art': { section: 2, priority: 10, sectionName: '📐 Mathematical 3D' },
  'gmod6-patterns': { section: 2, priority: 11, sectionName: '📐 Mathematical 3D' },
  'harmony_waves': { section: 2, priority: 12, sectionName: '📐 Mathematical 3D' },
  'atomic_structures': { section: 2, priority: 13, sectionName: '📐 Mathematical 3D' },
  'unified_toe_canvas': { section: 2, priority: 14, sectionName: '📐 Mathematical 3D' },

  // SECTION 3: Biological 3D
  'biological': { section: 3, priority: 1, sectionName: '🧬 Biological 3D' },
  'dna_helix_organic': { section: 3, priority: 2, sectionName: '🧬 Biological 3D' },
  'protein_structures': { section: 3, priority: 3, sectionName: '🧬 Biological 3D' },
  'molecular': { section: 3, priority: 4, sectionName: '🧬 Biological 3D' },
  'molecular_biology': { section: 3, priority: 5, sectionName: '🧬 Biological 3D' },
  'microbiology': { section: 3, priority: 6, sectionName: '🧬 Biological 3D' },
  'organelles': { section: 3, priority: 7, sectionName: '🧬 Biological 3D' },
  'tissue_structures': { section: 3, priority: 8, sectionName: '🧬 Biological 3D' },
  'polymer_chains': { section: 3, priority: 9, sectionName: '🧬 Biological 3D' },
  'human_anatomy': { section: 3, priority: 10, sectionName: '🧬 Biological 3D' },
  'medical': { section: 3, priority: 11, sectionName: '🧬 Biological 3D' },
  'tpms': { section: 3, priority: 12, sectionName: '🧬 Biological 3D' },
  'computational-biology': { section: 3, priority: 13, sectionName: '🧬 Biological 3D' },
  'biobots': { section: 3, priority: 14, sectionName: '🧬 Biological 3D' },
  'botany': { section: 3, priority: 15, sectionName: '🧬 Biological 3D' },
  'ice_crystals': { section: 3, priority: 16, sectionName: '🧬 Biological 3D' },
  'zoology_ecology': { section: 3, priority: 17, sectionName: '🧬 Biological 3D' },

  // SECTION 4: 4D Shapes & Spacetime
  'four_dimensional': { section: 4, priority: 1, sectionName: '🔮 4D Shapes' },
  'temporal_geometry': { section: 4, priority: 2, sectionName: '🔮 4D Shapes' },
  'relativity': { section: 4, priority: 3, sectionName: '🔮 4D Shapes' },
  'general_relativity': { section: 4, priority: 4, sectionName: '🔮 4D Shapes' },
  'babylonian-zodiac': { section: 4, priority: 5, sectionName: '🔮 4D Shapes' },
  'ancient_egyptian': { section: 4, priority: 6, sectionName: '🏛️ Ancient Civilizations' },
  'ancient_greek': { section: 4, priority: 7, sectionName: '🏛️ Ancient Civilizations' },

  // SECTION 5: 5D+ Higher Dimensions & Quantum
  'quantum_orbitals': { section: 5, priority: 1, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_parametric': { section: 5, priority: 2, sectionName: '⚛️ 5D+ Quantum' },
  'schrodinger': { section: 5, priority: 3, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_gravity': { section: 5, priority: 4, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_computing': { section: 5, priority: 5, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_entanglement': { section: 5, priority: 6, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_materials': { section: 5, priority: 7, sectionName: '⚛️ 5D+ Quantum' },
  'qubit_fundamentals': { section: 5, priority: 8, sectionName: '⚛️ 5D+ Quantum' },
  'multi_qubit_systems': { section: 5, priority: 9, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_entanglement_bell': { section: 5, priority: 10, sectionName: '⚛️ 5D+ Quantum' },
  'single_qubit_gates': { section: 5, priority: 11, sectionName: '⚛️ 5D+ Quantum' },
  'multi_qubit_gates': { section: 5, priority: 12, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_measurement_theory': { section: 5, priority: 13, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_decoherence': { section: 5, priority: 14, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_noise_errors': { section: 5, priority: 15, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_error_correction': { section: 5, priority: 16, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_algorithms_core': { section: 5, priority: 17, sectionName: '⚛️ 5D+ Quantum' },
  'qaoa_optimization': { section: 5, priority: 18, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_teleportation_protocol': { section: 5, priority: 19, sectionName: '⚛️ 5D+ Quantum' },
  'adiabatic_annealing': { section: 5, priority: 20, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_machine_learning': { section: 5, priority: 21, sectionName: '⚛️ 5D+ Quantum' },
  'topological_quantum': { section: 5, priority: 22, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_sensing': { section: 5, priority: 23, sectionName: '⚛️ 5D+ Quantum' },
  'quantum_communication': { section: 5, priority: 24, sectionName: '⚛️ 5D+ Quantum' },
  'physical_implementations': { section: 5, priority: 25, sectionName: '⚛️ 5D+ Quantum' },
  'theory_of_everything': { section: 5, priority: 26, sectionName: '⚛️ 5D+ Quantum' },
  'cosmic_history_gaps': { section: 5, priority: 27, sectionName: '⚛️ 5D+ Quantum' },
  'consciousness': { section: 5, priority: 28, sectionName: '⚛️ 5D+ Quantum' },
  'unified_master': { section: 5, priority: 29, sectionName: '⚛️ 5D+ Quantum' },
  'time-travel-physics': { section: 5, priority: 30, sectionName: '⚛️ 5D+ Quantum' },
  'space-biology': { section: 5, priority: 31, sectionName: '⚛️ 5D+ Quantum' },

  // SECTION 6: Chaotic & Complex Systems
  'multidimensional_fractals': { section: 6, priority: 1, sectionName: '🌀 Chaotic Systems' },
  'fractal_heightmaps': { section: 6, priority: 2, sectionName: '🌀 Chaotic Systems' },
  'fractal_iterations': { section: 6, priority: 2.5, sectionName: '🌀 Chaotic Systems' },
  'fractal_analysis': { section: 6, priority: 3, sectionName: '🌀 Chaotic Systems' },
  'cosmic_chaos_studio': { section: 6, priority: 4, sectionName: '🌀 Chaotic Systems' },
  'noise_functions': { section: 6, priority: 5, sectionName: '🌀 Chaotic Systems' },
  'differential_growth': { section: 6, priority: 6, sectionName: '🌀 Chaotic Systems' },
  'voronoi_tessellation': { section: 6, priority: 7, sectionName: '🌀 Chaotic Systems' },
  'entropic_principles': { section: 6, priority: 8, sectionName: '🌀 Chaotic Systems' },
  'weather_systems': { section: 6, priority: 9, sectionName: '🌀 Chaotic Systems' },
  'astrophysical': { section: 6, priority: 10, sectionName: '🌀 Chaotic Systems' },
  'astronomical_objects': { section: 6, priority: 11, sectionName: '🌀 Chaotic Systems' },
  'universe': { section: 6, priority: 12, sectionName: '🌀 Chaotic Systems' },
  'cosmic_topology': { section: 6, priority: 13, sectionName: '🌀 Chaotic Systems' },

  // SECTION 7: Engineering & Infrastructure
  'thermal_engineering': { section: 7, priority: 1, sectionName: '🔥 Engineering & Infrastructure' },
};

// Get sorted categories by dimensional complexity (Basic → 4D → 5D+ → Chaotic)
export function getCategoriesSortedByDimension(): ShapeCategory[] {
  return ([...SHAPE_CATEGORIES] as ShapeCategory[]).sort((a, b) => {
    const orderA = CATEGORY_DIMENSIONAL_ORDER[a.id] || { section: 99, priority: 99 };
    const orderB = CATEGORY_DIMENSIONAL_ORDER[b.id] || { section: 99, priority: 99 };

    if (orderA.section !== orderB.section) {
      return orderA.section - orderB.section;
    }
    return orderA.priority - orderB.priority;
  });
}

// Get section name for a category
export function getCategorySectionName(categoryId: string): string {
  return CATEGORY_DIMENSIONAL_ORDER[categoryId]?.sectionName || '📦 Other';
}

// Get categories grouped by section
export function getCategoriesGroupedBySection(): { section: string; categories: ShapeCategory[] }[] {
  const sorted = getCategoriesSortedByDimension();
  const groups: { section: string; categories: ShapeCategory[] }[] = [];

  let currentSection = '';
  for (const cat of sorted) {
    const sectionName = getCategorySectionName(cat.id);
    if (sectionName !== currentSection) {
      currentSection = sectionName;
      groups.push({ section: sectionName, categories: [] });
    }
    groups[groups.length - 1].categories.push(cat);
  }

  return groups;
}

// Helper function to get category for a shape
export function getCategoryForShape(shapeId: string): ShapeCategory | undefined {
  return (SHAPE_CATEGORIES as ShapeCategory[]).find(cat => cat.shapes.includes(shapeId));
}

// Helper function to get all shapes in order by category
export function getAllShapesOrdered(): string[] {
  return SHAPE_CATEGORIES.flatMap(cat => cat.shapes);
}

// Helper function to format shape name for display
// Properly capitalizes acronyms like DNA, RNA, CRISPR, TAD, UV, 3D, 4D, etc.
export function formatShapeName(shapeId: string): string {
  // Acronyms and special terms that should be fully capitalized
  const acronyms: Record<string, string> = {
    'dna': 'DNA',
    'edna': 'eDNA',
    'rna': 'RNA',
    'mrna': 'mRNA',
    'trna': 'tRNA',
    'rrna': 'rRNA',
    'snrna': 'snRNA',
    'sirna': 'siRNA',
    'crispr': 'CRISPR',
    'cas9': 'Cas9',
    'cas12': 'Cas12',
    'cas13': 'Cas13',
    'tad': 'TAD',
    'tads': 'TADs',
    'uv': 'UV',
    '3d': '3D',
    '4d': '4D',
    '5d': '5D',
    '6d': '6D',
    '7d': '7D',
    '8d': '8D',
    'em': 'EM',
    'nasa': 'NASA',
    'osdr': 'OSDR',
    'ai': 'AI',
    'bp': 'bp',
    'nm': 'nm',
    'api': 'API',
    'sdk': 'SDK',
    'nft': 'NFT',
    'glb': 'GLB',
    'gltf': 'glTF',
    'phi': 'Φ',
    'pi': 'π',
    'pdb': 'PDB',
    'atgc': 'ATGC',
  };
  
  return shapeId
    .split('_')
    .map(word => {
      const lower = word.toLowerCase();
      if (acronyms[lower]) {
        return acronyms[lower];
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

console.log('📊 Dimensional category ordering enabled: Basic 3D → 4D → 5D+ → Chaotic');