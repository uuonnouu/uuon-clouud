import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const ADDITIONAL_SHAPES = [
  { category: 'ten_percent_systems', name: '10% Systems', shapes: [
    'iceberg_system', 'dna_expression_system', 'em_spectrum_system', 'universe_distribution_system',
    'ocean_exploration_system', 'neural_network_layers_system', 'tree_root_crown_system',
    'quantum_superposition_system', 'computer_processes_system', 'thought_speech_system',
    'genetic_evolution_system', 'consciousness_processing_system', 'economic_activity_system',
    'social_data_system', 'language_communication_system', 'internet_infrastructure_system',
    'human_energy_system', 'combined_ten_percent_master'
  ]},
  { category: 'general_relativity', name: 'General Relativity', shapes: [
    'spacetime_interval_ds2', 'metric_tensor_surface', 'einstein_field_equations', 'einstein_tensor_field',
    'ricci_scalar_curvature', 'riemann_curvature_tensor', 'christoffel_symbols_field', 'geodesic_equation',
    'photon_geodesic_null', 'proper_time_surface', 'stress_energy_tensor', 'energy_density_t00',
    'lorentz_factor_gamma', 'lorentz_transformation', 'sr_time_dilation', 'length_contraction',
    'gravitational_time_dilation', 'gravitational_redshift', 'minkowski_flat_spacetime',
    'schwarzschild_metric_spacetime', 'kerr_rotating_black_hole', 'flrw_cosmological_metric',
    'weak_field_approximation', 'gravitational_lensing', 'light_deflection_angle', 'adm_decomposition_3plus1',
    'extrinsic_curvature_kij', 'hamiltonian_constraint', 'momentum_constraint', 'bssn_conformal_metric',
    'bssn_tracefree_extrinsic', 'bssn_conformal_connection', 'bssn_evolution_equations'
  ]},
  { category: 'quantum_gravity', name: 'Quantum Gravity', shapes: [
    'discrete_spacetime_graph', 'planck_units_visualization', 'wheeler_dewitt_equation', 'loop_quantum_area_spectrum',
    'loop_quantum_volume_spectrum', 'spin_network_vertex', 'spin_foam_amplitude', 'ryu_takayanagi_entropy',
    'tensor_network_spacetime', 'ads_cft_correspondence', 'holographic_boundary', 'nambu_goto_string',
    'extra_dimensions_10d', 'kaluza_klein_compactification', 'braneworld_model', 'black_hole_interior',
    'hawking_radiation_spectrum', 'information_paradox_surface', 'quantum_cosmology_wave', 'big_bang_singularity',
    'multiverse_landscape', 'brane_tension_visualization', 'universe_wave_function', 'wheeler_dewitt_minisuperspace',
    'quantum_tunneling_universe', 'hartle_hawking_no_boundary', 'causal_set_poset', 'causal_volume_counting',
    'causal_set_sprinkling', 'ricci_flow_evolution', 'f_r_modified_gravity', 'scalar_tensor_gravity',
    'bekenstein_hawking_entropy', 'landauer_principle', 'universe_computation', 'quantum_error_correction_geometry',
    'discretized_einstein_hilbert', 'regge_calculus_deficit', 'finite_difference_curvature', 'tensor_network_evolution',
    'lattice_spacetime_node', 'tetrahedral_quantum_geometry', 'harmonic_phi_geometry'
  ]},
  { category: 'cosmic_history_gaps', name: 'Cosmic History Gaps', shapes: [
    'scalar_field_inflation', 'quantum_foam_structure', 'cosmic_inflation_exponential', 'primordial_gravitational_waves',
    'inflaton_potential_landscape', 'electroweak_phase_transition', 'sphaleron_transitions', 'cp_violation_mechanisms',
    'dark_matter_halo_structure', 'wimp_dark_matter_detection', 'axion_field_oscillations', 'phantom_dark_energy',
    'quintessence_field', 'primordial_star_formation', 'cosmic_web_filaments', 'reionization_bubbles',
    'supermassive_black_hole_formation', 'quasar_accretion_disk', 'primordial_black_hole_merger',
    'galaxy_formation_simulation', 'stellar_feedback_mechanisms', 'dwarf_galaxy_evolution', 'fine_tuning_parameters'
  ]},
  { category: 'entropic_principles', name: 'Entropic Principles', shapes: [
    'anthropic_principle_surface', 'anthropic_fine_tuning', 'boltzmann_entropy_landscape', 'entropy_production_flow',
    'thermodynamic_arrow', 'causal_entropic_principle', 'cep_universe_selection', 'cep_entropy_observer_fusion',
    'cosmic_entropy_budget', 'boltzmann_brain_probability', 'heat_death_horizon', 'shannon_entropy_surface',
    'von_neumann_entropy', 'holographic_entropy_bound', 'causal_horizon_boundary', 'cosmological_constant_cep',
    'density_fluctuation_q_cep'
  ]},
  { category: 'original_algorithms', name: 'Original Algorithms', shapes: [
    'euclidean_algorithm', 'sieve_eratosthenes', 'babylonian_square_root', 'newton_raphson',
    'fibonacci_spiral_enhanced', 'kepler_planetary_motion', 'diffusion_heat_equation', 'crystal_lattice_fcc',
    'binary_tree_traversal', 'quicksort_partition_tree', 'dna_replication_algorithm', 'einstein_mass_energy',
    'einstein_energy_per_mass', 'einstein_mass_from_energy', 'einstein_multiplicative_form', 'einstein_absolute_magnitude',
    'einstein_tensor_product', 'einstein_dot_product', 'einstein_exponential_form', 'relativistic_energy_momentum',
    'quantum_energy_frequency', 'thermal_energy_boltzmann', 'newton_force_acceleration', 'momentum_force_law',
    'work_energy_theorem', 'gravitational_force_law', 'lorentz_electromagnetic_force'
  ]},
  { category: 'waves', name: 'Wave Algorithms', shapes: [
    'electromagnetic_wave', 'sound_wave', 'brain_wave', 'seismic_wave', 'ocean_wave', 'gravitational_wave',
    'cardiac_wave', 'quantum_wave', 'atmospheric_wave', 'circadian_wave'
  ]},
  { category: 'set_theory', name: 'Set Theory', shapes: [
    'null_set_empty', 'singleton_set', 'finite_set', 'infinite_set', 'subset_relation', 'power_set',
    'universal_set', 'equivalent_sets', 'equal_sets', 'super_set', 'venn_diagram_sets', 'complement_set'
  ]},
  { category: 'schrodinger', name: 'Schrödinger Equations', shapes: [
    'schrodinger_time_dependent', 'schrodinger_time_independent', 'hydrogen_orbital_1s', 'hydrogen_orbital_2p',
    'hydrogen_orbital_3d', 'hydrogen_orbital_4f', 'hydrogen_orbital_5d', 'hydrogen_orbital_6s',
    'p_orbital_x', 'p_orbital_y', 'p_orbital_z', 'd_orbital_xy', 'd_orbital_xz', 'd_orbital_yz',
    'd_orbital_x2_y2', 'd_orbital_z2', 'f_orbital_z3', 'f_orbital_xz2', 'f_orbital_yz2', 'f_orbital_xyz',
    'f_orbital_z_x2_y2', 'f_orbital_x_x2_3y2', 'f_orbital_y_3x2_y2', 'quantum_harmonic_oscillator',
    'harmonic_oscillator_n2', 'harmonic_oscillator_n3'
  ]},
  { category: 'e8_theory', name: 'E8 Theory of Everything', shapes: [
    'e8_root_system', 'e8_dynkin_diagram', 'e8_coxeter_plane', 'e8_standard_model', 'e8_fermion_spectrum',
    'e8_gauge_bosons', 'e8_triality', 'e8_unification', 'e8_symmetry_breaking'
  ]},
  { category: 'cosmological_structures', name: 'Cosmological Structures', shapes: [
    'cosmic_web', 'large_scale_structure', 'galaxy_cluster', 'void_structure', 'filament_structure',
    'great_attractor', 'laniakea_supercluster', 'virgo_cluster', 'coma_cluster', 'shapley_concentration'
  ]},
  { category: 'particle_physics', name: 'Particle Physics', shapes: [
    'quark', 'lepton', 'boson', 'fermion', 'hadron', 'baryon', 'meson', 'neutrino', 'photon_particle',
    'gluon', 'w_boson', 'z_boson', 'higgs_boson', 'graviton', 'top_quark', 'bottom_quark', 'charm_quark',
    'strange_quark', 'up_quark', 'down_quark', 'electron_particle', 'muon', 'tau', 'electron_neutrino',
    'muon_neutrino', 'tau_neutrino'
  ]},
  { category: 'differential_geometry', name: 'Differential Geometry', shapes: [
    'minimal_surface', 'catenoid', 'helicoid', 'enneper_surface', 'scherk_surface', 'costa_surface',
    'schwarz_p_surface', 'schwarz_d_surface', 'gyroid', 'lidinoid', 'neovius_surface', 'riemann_surface',
    'boys_surface', 'roman_surface', 'steiner_surface', 'cayley_cubic', 'kummer_surface', 'togliatti_quintic'
  ]},
  { category: 'algebraic_geometry', name: 'Algebraic Geometry', shapes: [
    'algebraic_curve', 'elliptic_curve', 'hyperelliptic_curve', 'modular_curve', 'shimura_variety',
    'grassmannian', 'flag_variety', 'schubert_variety', 'fano_variety', 'calabi_yau_manifold',
    'k3_surface', 'enriques_surface', 'abelian_variety', 'jacobian_variety', 'picard_variety'
  ]},
  { category: 'supersymmetry', name: 'Supersymmetry', shapes: [
    'superfield', 'superspace', 'supermultiplet', 'susy_partner', 'selectron', 'smuon', 'stau',
    'squark', 'gluino', 'wino', 'zino', 'higgsino', 'neutralino', 'chargino', 'gravitino', 'axino'
  ]}
];

async function addMoreShapes() {
  const timestamp = new Date().toISOString();
  let added = 0;
  
  for (const category of ADDITIONAL_SHAPES) {
    console.log(`📂 Adding ${category.name}: ${category.shapes.length} shapes`);
    
    for (const shapeType of category.shapes) {
      try {
        const displayName = shapeType.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        await sql`
          INSERT INTO complete_shape_registry (
            shape_type, display_name, category, subcategory, description,
            source, priority, seo_keywords, canonical_url, is_active, created_at, updated_at
          ) VALUES (
            ${shapeType}, ${displayName}, ${category.category}, ${category.name},
            ${`${displayName} - ${category.name} mathematical visualization`},
            'frontend', 0.8, ${`${displayName}, ${category.name}, mathematical visualization`},
            ${`/shape/${shapeType}`}, true, ${timestamp}, ${timestamp}
          ) ON CONFLICT (shape_type) DO NOTHING
        `;
        added++;
      } catch (e) {}
    }
  }
  
  console.log(`✅ Added ${added} shapes`);
  const count = await sql`SELECT COUNT(*) as total FROM complete_shape_registry`;
  console.log(`📊 Total shapes: ${count[0].total}`);
}

addMoreShapes().catch(console.error);
