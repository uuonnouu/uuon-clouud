/**
 * HYBRID SECURITY CONFIGURATION
 * Defines which shapes are computed server-side for IP protection
 * © 2025 UUON Foundation Inc. - Proprietary
 */

/**
 * High-value proprietary shapes protected by server-side computation
 * These shapes represent competitive IP and are computed on server only
 */
export const PROTECTED_SHAPES = new Set<string>([
  // ============================================================================
  // QUANTUM MECHANICS - Advanced Orbitals (NEW - 10 shapes)
  // ============================================================================
  'hydrogen_orbital_4f',
  'hydrogen_orbital_5d',
  'hydrogen_orbital_6s',
  'quantum_tunneling_barrier',
  'electron_spin_up',
  'electron_spin_down',
  'harmonic_oscillator_n2',
  'harmonic_oscillator_n3',
  'particle_box_n2',
  'particle_box_n3',

  // ============================================================================
  // ADVANCED BIOLOGY - Molecular Structures (NEW - 8 shapes)
  // ============================================================================
  'actin_filament',
  'microtubule',
  'collagen_triple_helix',
  'hemoglobin_quaternary',
  'antibody_y_structure',
  'myosin_motor_protein',
  'keratin_fiber',
  'elastin_network',

  // ============================================================================
  // CRYSTALLOGRAPHY - Advanced Lattices (NEW - 12 shapes)
  // ============================================================================
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
  'amorphous_glass_network',

  // ============================================================================
  // RIEMANN HYPOTHESIS - Millennium Prize Problem (4 shapes)
  // ============================================================================
  'riemann_zeta_critical_line',
  'riemann_zeta_zero_pattern',
  'riemann_prime_staircase',
  'riemann_explicit_formula',

  // ============================================================================
  // HUMAN ANATOMY - High-Value Medical Visualizations (50 shapes)
  // ============================================================================
  'heart_full',
  'brain_cortex',
  'brain_hippocampus',
  'brain_cerebellum',
  'lung_alveoli',
  'kidney_nephron',
  'liver_lobule',
  'stomach_lining',
  'small_intestine_villi',
  'large_intestine_haustra',
  'spleen_red_pulp',
  'pancreas_islets',
  'thyroid_follicles',
  'adrenal_cortex',
  'pituitary_anterior',
  'bone_osteon',
  'bone_trabeculae',
  'cartilage_matrix',
  'tendon_collagen',
  'ligament_crimp',
  // 'skeletal_muscle_fiber', // REMOVED: Shape exists client-side only, doesn't need server rendering
  'cardiac_muscle_fiber',
  'smooth_muscle_fiber',
  'neuron_dendrites',
  'neuron_axon',
  'synapse_structure',
  'glial_astrocyte',
  'eye_retina_layers',
  'eye_lens_fibers',
  'ear_cochlea_spiral',
  'ear_semicircular_canal',
  'skin_epidermis_layers',
  'skin_dermis_papillae',
  'hair_follicle_bulb',
  'nail_matrix',
  'tooth_enamel_prisms',
  'tooth_dentin_tubules',
  'blood_vessel_endothelium',
  'capillary_network',
  'lymph_node_cortex',
  'spinal_cord_segments',
  'vertebra_centrum',
  'intervertebral_disc',
  'rib_cross_section',
  'skull_suture',
  'pelvis_acetabulum',
  'knee_meniscus',
  'shoulder_rotator_cuff',
  'wrist_carpal_tunnel',
  'hand_metacarpal',
  'foot_metatarsal',

  // ============================================================================
  // MOLECULAR MACHINES & DNA (43 shapes)
  // ============================================================================
  'atp_synthase',
  'kinesin',
  'ribosome_detailed',
  'proteasome',
  'dna_helix_detailed',
  'a_dna_helix',
  'z_dna_helix',
  'dna_supercoil',
  'chromatin_fiber',
  'chromatin_superhelix',
  'trna_cloverleaf',
  'mrna_strand',
  'rrna_complex',
  'microrna',
  'metaphase_chromosome',
  'telomere',
  'centromere',
  'replication_fork',
  'transcription_bubble',
  'rna_polymerase',
  'spliceosome',
  'viral_capsid_dna',
  'crispr_cas9',
  'histone_octamer',
  'g_quadruplex',
  'protein_alpha_helix',
  'protein_beta_sheet',
  'microtubule_structure',

  // ============================================================================
  // ADVANCED PHYSICS - Proprietary Algorithms (27 shapes)
  // ============================================================================
  'einstein_mass_energy',
  'einstein_energy_per_mass',
  'einstein_mass_from_energy',
  'einstein_multiplicative_form',
  'einstein_absolute_magnitude',
  'einstein_tensor_product',
  'einstein_dot_product',
  'einstein_exponential_form',
  'relativistic_energy_momentum',
  'quantum_energy_frequency',
  'thermal_energy_boltzmann',
  'newton_force_acceleration',
  'momentum_force_law',
  'work_energy_theorem',
  'gravitational_force_law',
  'lorentz_electromagnetic_force',
  'schwarzschild_metric_spacetime',
  'kerr_rotating_black_hole',
  'einstein_field_equations',
  'reissner_nordstrom_charged',
  'penrose_diagram_spacetime',
  'gravitational_wave_ripple',
  'ligo_binary_merger',
  'tesla_thread_tension',
  'thread_particle_network',

  // ============================================================================
  // SYNTHETIC BIOBOTS (12 shapes)
  // ============================================================================
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
  'cortical_assembloid',

  // ============================================================================
  // CRYPTOGRAPHIC ALGORITHMS - Mathematical Structure Visualizations (5 shapes)
  // ============================================================================
  'aes_rijndael_cipher',
  'sha256_compression_function',
  'elliptic_curve_cryptography',
  'keccak_sha3_sponge',
  'lattice_kyber_ntru',

  // ============================================================================
  // QUANTUM ENTANGLEMENT ALGORITHMS - Non-Local Quantum Correlations (8 shapes)
  // ============================================================================
  'bell_state_visualization',
  'epr_pair_trajectory',
  'quantum_correlation_field',
  'ghz_state_geometry',
  'w_state_geometry',
  'quantum_discord_surface',
  'quantum_teleportation_path',
  'entanglement_entropy_landscape',
  
  // ============================================================================
  // ADVANCED PHYSICS EQUATIONS - General Relativity & Quantum Field Theory (15 shapes)
  // ============================================================================
  'schwarzschild_radius',
  'schwarzschild_metric_spacetime',
  'gravitational_time_dilation',
  'einstein_mass_energy',
  'einstein_energy_per_mass',
  'einstein_mass_from_energy',
  'einstein_multiplicative_form',
  'einstein_absolute_magnitude',
  'einstein_tensor_product',
  'einstein_dot_product',
  'kerr_rotating_black_hole',
  'einstein_field_equations',
  'reissner_nordstrom_charged',
  'penrose_diagram_spacetime',
  'gravitational_wave_ripple',

  // ============================================================================
  // QUANTUM GRAVITY CORE - Planck Scale Physics (15 shapes) 
  // ============================================================================
  'discrete_spacetime_graph',
  'planck_units_visualization', 
  'wheeler_dewitt_equation',
  'loop_quantum_area_spectrum',
  'loop_quantum_volume_spectrum',
  'spin_network_vertex',
  'spin_foam_amplitude',
  'ryu_takayanagi_entropy',
  'tensor_network_spacetime',
  'ads_cft_correspondence',
  'holographic_boundary',
  'nambu_goto_string',
  'extra_dimensions_10d',
  'kaluza_klein_compactification',
  'brane_tension_visualization'
]);

/**
 * Check if a shape requires server-side computation
 */
export function isProtectedShape(shapeId: string): boolean {
  return PROTECTED_SHAPES.has(shapeId);
}

/**
 * Get count of protected shapes
 */
export function getProtectedShapeCount(): number {
  return PROTECTED_SHAPES.size;
}

/**
 * Security metadata for logging
 */
export const SECURITY_CONFIG = {
  totalShapes: 444,
  protectedShapes: PROTECTED_SHAPES.size,
  clientShapes: 444 - PROTECTED_SHAPES.size,
  protectionLevel: 'HYBRID',
  lastUpdated: '2025-11-11'
} as const;
