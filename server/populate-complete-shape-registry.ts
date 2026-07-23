import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

const ALL_SHAPE_CATEGORIES = [
  {
    id: 'mathematical-art',
    name: 'Mathematical Art',
    shapes: ['yeganeh-eagle']
  },
  {
    id: 'babylonian-zodiac',
    name: 'Babylonian Zodiac',
    shapes: [
      'babylonian_aries_hired_man', 'babylonian_taurus_bull_of_heaven', 'babylonian_gemini_great_twins',
      'babylonian_cancer_crayfish', 'babylonian_leo_lion', 'babylonian_virgo_furrow',
      'babylonian_libra_scales', 'babylonian_scorpio_scorpion', 'babylonian_sagittarius_pabilsag',
      'babylonian_capricorn_goat_fish', 'babylonian_aquarius_water_bearer', 'babylonian_pisces_fish_string'
    ]
  },
  {
    id: 'basic',
    name: 'Basic Shapes',
    shapes: [
      'sphere', 'cube', 'cylinder', 'cone', 'torus', 'tetrahedron', 'octahedron', 'icosahedron', 'dodecahedron',
      'square', 'circle', 'triangle', 'rectangle', 'pentagon', 'hexagon', 'oval', 'star_3d', 'diamond', 'heart_shape',
      'triangular_prism', 'square_prism', 'pentagonal_prism', 'hexagonal_prism', 'heptagonal_prism',
      'octagonal_prism', 'nonagonal_prism', 'decagonal_prism', 'hendecagonal_prism', 'dodecagonal_prism'
    ]
  },
  {
    id: 'topology',
    name: 'Topology & Knots',
    shapes: [
      'klein_bottle', 'trefoil_knot', 'figure8_knot', 'mobius_strip', 'cross_cap', 'boy_surface',
      'genus2_surface', 'genus3_surface', 'fiber_bundle', 'homotopy_deformation', 'seifert_surface',
      'torus_knot_2_3', 'torus_knot_3_5', 'borromean_rings', 'hopf_link', 'whitehead_link',
      'chinese_button_knot', 'solomon_knot', 'endless_knot', 'celtic_knot'
    ]
  },
  {
    id: 'fractals',
    name: 'Fractals',
    shapes: [
      'mandelbrot_3d', 'julia_3d', 'sierpinski_tetrahedron', 'menger_sponge', 'koch_snowflake_3d',
      'mandelbulb_raymarched', 'platonic_icosa', 'platonic_octa', 'platonic_dodeca', 'menger_kleinian_v2',
      'dragon_curve_3d', 'hilbert_curve_3d', 'peano_curve_3d', 'apollonian_gasket', 'barnsley_fern_3d',
      'cantor_dust_3d', 'levy_c_curve', 'gosper_curve', 'moore_curve', 'lindenmayer_tree',
      'strange_attractor', 'lorenz_attractor', 'rossler_attractor', 'chen_attractor', 'halvorsen_attractor'
    ]
  },
  {
    id: 'quantum-mechanics',
    name: 'Quantum Mechanics',
    shapes: [
      'hydrogen_1s', 'hydrogen_2s', 'hydrogen_2p', 'hydrogen_3s', 'hydrogen_3p', 'hydrogen_3d',
      'schrodinger_wave', 'wave_function', 'probability_density', 'quantum_tunneling', 'quantum_well',
      'spin_state', 'bloch_sphere', 'qubit_state', 'entanglement_state', 'superposition_state',
      'wave_packet', 'momentum_space', 'phase_space', 'wigner_function', 'husimi_distribution'
    ]
  },
  {
    id: 'quantum-gravity',
    name: 'Quantum Gravity',
    shapes: [
      'spin_foam', 'spin_network', 'loop_quantum_gravity', 'planck_scale_geometry', 'causal_dynamical_triangulation',
      'regge_calculus', 'twistor_space', 'penrose_diagram', 'black_hole_entropy', 'holographic_principle',
      'ads_cft', 'bulk_boundary', 'entanglement_wedge', 'ryu_takayanagi', 'quantum_extremal_surface',
      'string_landscape', 'flux_compactification', 'moduli_stabilization', 'swampland', 'distance_conjecture'
    ]
  },
  {
    id: 'general-relativity',
    name: 'General Relativity',
    shapes: [
      'schwarzschild_metric', 'kerr_metric', 'reissner_nordstrom', 'kerr_newman', 'friedmann_metric',
      'de_sitter_space', 'anti_de_sitter', 'minkowski_space', 'penrose_carter_diagram', 'light_cone_structure',
      'geodesic_deviation', 'riemann_tensor', 'ricci_tensor', 'weyl_tensor', 'einstein_tensor',
      'gravitational_wave', 'gravitational_lensing', 'frame_dragging', 'ergosphere', 'event_horizon',
      'singularity', 'wormhole', 'einstein_rosen_bridge', 'closed_timelike_curve', 'godel_universe'
    ]
  },
  {
    id: 'cryptography',
    name: 'Cryptography',
    shapes: [
      'elliptic_curve_secp256k1', 'elliptic_curve_p256', 'elliptic_curve_ed25519', 'rsa_modular_exponentiation',
      'diffie_hellman_key_exchange', 'aes_sbox', 'sha256_compression', 'merkle_tree', 'hash_chain',
      'digital_signature', 'zero_knowledge_proof', 'commitment_scheme', 'secret_sharing', 'threshold_signature',
      'homomorphic_encryption', 'lattice_based_crypto', 'ntru_lattice', 'kyber_lattice', 'dilithium_signature',
      'rainbow_signature', 'sphincs_signature', 'post_quantum_crypto', 'quantum_key_distribution', 'bb84_protocol'
    ]
  },
  {
    id: 'molecular-biology',
    name: 'Molecular Biology',
    shapes: [
      'dna_double_helix', 'rna_single_strand', 'protein_alpha_helix', 'protein_beta_sheet', 'protein_folding',
      'lipid_bilayer', 'cell_membrane', 'phospholipid', 'cholesterol', 'glycoprotein',
      'ribosome', 'mitochondria', 'endoplasmic_reticulum', 'golgi_apparatus', 'lysosome',
      'nucleus', 'nucleolus', 'chromatin', 'chromosome', 'centromere',
      'microtubule', 'actin_filament', 'intermediate_filament', 'motor_protein', 'ion_channel'
    ]
  },
  {
    id: '4d-hyperdimensional',
    name: '4D Hyperdimensional',
    shapes: [
      'tesseract', 'hypersphere', 'pentachoron', 'hexadecachoron', 'icositetrachoron',
      'hecatonicosachoron', 'hexacosichoron', 'grand_antiprism', 'rectified_tesseract', 'bitruncated-tesseract',
      'runcitruncated_tesseract', 'omnitruncated_tesseract', 'duoprism_4_4', 'duoprism_3_6', 'duocylinder',
      'clifford_torus_4d', 'hopf_fibration', 'quaternion_rotation', 'so4_rotation', 'spinor_4d'
    ]
  },
  {
    id: 'sacred-geometry',
    name: 'Sacred Geometry',
    shapes: [
      'flower_of_life', 'seed_of_life', 'tree_of_life', 'metatrons_cube', 'sri_yantra',
      'vesica_piscis', 'golden_spiral', 'fibonacci_spiral', 'merkaba', 'platonic_solids_nested',
      'fruit_of_life', 'egg_of_life', 'genesis_pattern', 'torus_field', 'vector_equilibrium',
      '64_tetrahedron_grid', 'isotropic_vector_matrix', 'jitterbug', 'cubeoctahedron', 'rhombic_dodecahedron'
    ]
  },
  {
    id: 'theory-of-everything',
    name: 'Theory of Everything',
    shapes: [
      'm_theory', 'string_theory', 'loop_quantum_gravity_toe', 'e8_theory', 'causal_fermion_system',
      'twistor_theory', 'noncommutative_geometry', 'causal_set_theory', 'asymptotic_safety', 'emergent_gravity',
      'entropic_gravity', 'shape_dynamics', 'relative_locality', 'doubly_special_relativity', 'deformed_special_relativity',
      'holographic_universe', 'simulation_hypothesis', 'mathematical_universe', 'it_from_bit', 'participatory_universe'
    ]
  },
  {
    id: 'algorithms',
    name: 'Algorithms',
    shapes: [
      'bubble_sort_viz', 'quick_sort_viz', 'merge_sort_viz', 'heap_sort_viz', 'radix_sort_viz',
      'binary_search_tree', 'avl_tree', 'red_black_tree', 'b_tree', 'trie',
      'hash_table', 'bloom_filter', 'skip_list', 'segment_tree', 'fenwick_tree',
      'dijkstra_path', 'bellman_ford', 'floyd_warshall', 'a_star_search', 'dfs_bfs_graph'
    ]
  },
  {
    id: 'chakras',
    name: 'Chakras & Energy',
    shapes: [
      'root_chakra', 'sacral_chakra', 'solar_plexus_chakra', 'heart_chakra', 'throat_chakra',
      'third_eye_chakra', 'crown_chakra', 'kundalini_energy', 'aura_field', 'meridian_system',
      'prana_vortex', 'chi_flow', 'energy_body', 'subtle_body', 'causal_body'
    ]
  },
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    shapes: [
      'perceptron', 'multilayer_perceptron', 'convolutional_layer', 'pooling_layer', 'fully_connected',
      'recurrent_cell', 'lstm_cell', 'gru_cell', 'attention_mechanism', 'transformer_block',
      'residual_block', 'inception_module', 'dense_block', 'unet_architecture', 'gan_generator',
      'autoencoder', 'variational_autoencoder', 'diffusion_model', 'neural_ode', 'graph_neural_network'
    ]
  },
  {
    id: 'quantum-computing',
    name: 'Quantum Computing',
    shapes: [
      'qubit', 'hadamard_gate', 'pauli_x_gate', 'pauli_y_gate', 'pauli_z_gate',
      'cnot_gate', 'toffoli_gate', 'fredkin_gate', 'swap_gate', 'controlled_phase',
      'quantum_fourier_transform', 'grover_oracle', 'shor_factoring', 'vqe_circuit', 'qaoa_circuit',
      'quantum_error_correction', 'surface_code', 'stabilizer_state', 'magic_state', 'quantum_supremacy'
    ]
  },
  {
    id: 'cosmology',
    name: 'Cosmology',
    shapes: [
      'big_bang', 'cosmic_inflation', 'cmb_power_spectrum', 'baryon_acoustic_oscillations', 'dark_matter_halo',
      'dark_energy_field', 'cosmic_web', 'galaxy_cluster', 'void_structure', 'filament_structure',
      'hubble_expansion', 'cosmic_horizon', 'particle_horizon', 'event_horizon_cosmology', 'multiverse_bubble',
      'eternal_inflation', 'cyclic_universe', 'big_bounce', 'big_rip', 'heat_death'
    ]
  },
  {
    id: 'black-holes',
    name: 'Black Holes',
    shapes: [
      'schwarzschild_black_hole', 'kerr_black_hole', 'reissner_nordstrom_bh', 'kerr_newman_bh', 'primordial_black_hole',
      'stellar_black_hole', 'intermediate_black_hole', 'supermassive_black_hole', 'ultramassive_black_hole', 'hawking_radiation',
      'accretion_disk', 'relativistic_jet', 'photon_sphere', 'innermost_stable_orbit', 'penrose_process',
      'black_hole_merger', 'ringdown', 'quasi_normal_modes', 'information_paradox', 'firewall_paradox'
    ]
  },
  {
    id: 'modulo-algorithms',
    name: 'Modulo Algorithms',
    shapes: [
      'mod_2_binary', 'mod_3_ternary', 'mod_5_quinary', 'mod_6_hexary', 'mod_7_septenary',
      'mod_8_octal', 'mod_9_nonary', 'mod_10_decimal', 'mod_12_duodecimal', 'mod_16_hexadecimal',
      'mod_60_sexagesimal', 'mod_360_degrees', 'chinese_remainder', 'fermat_little', 'euler_totient',
      'quadratic_residue', 'legendre_symbol', 'jacobi_symbol', 'kronecker_symbol', 'primitive_root'
    ]
  },
  {
    id: 'wave-functions',
    name: 'Wave Functions',
    shapes: [
      'sine_wave', 'cosine_wave', 'tangent_wave', 'sawtooth_wave', 'square_wave',
      'triangle_wave', 'pulse_wave', 'gaussian_wave', 'soliton_wave', 'standing_wave',
      'traveling_wave', 'spherical_wave', 'cylindrical_wave', 'plane_wave', 'wave_superposition',
      'wave_interference', 'wave_diffraction', 'wave_refraction', 'wave_reflection', 'wave_dispersion'
    ]
  },
  {
    id: 'tensor-algebra',
    name: 'Tensor Algebra',
    shapes: [
      'rank_0_scalar', 'rank_1_vector', 'rank_2_matrix', 'rank_3_tensor', 'rank_4_tensor',
      'metric_tensor', 'stress_energy_tensor', 'electromagnetic_tensor', 'riemann_curvature', 'ricci_curvature',
      'christoffel_symbols', 'covariant_derivative', 'lie_derivative', 'killing_vector', 'geodesic_equation',
      'parallel_transport', 'holonomy', 'curvature_2_form', 'torsion_tensor', 'contorsion_tensor'
    ]
  },
  {
    id: 'field-theory',
    name: 'Field Theory',
    shapes: [
      'scalar_field', 'vector_field', 'spinor_field', 'gauge_field', 'yang_mills_field',
      'higgs_field', 'electromagnetic_field', 'gravitational_field', 'weak_field', 'strong_field',
      'inflaton_field', 'quintessence_field', 'axion_field', 'dilaton_field', 'moduli_field',
      'topological_field', 'conformal_field', 'chiral_field', 'supersymmetric_field', 'string_field'
    ]
  },
  {
    id: 'set-theory',
    name: 'Set Theory',
    shapes: [
      'empty_set', 'singleton_set', 'finite_set', 'infinite_set', 'countable_set',
      'uncountable_set', 'union_venn', 'intersection_venn', 'difference_venn', 'complement_venn',
      'subset_relation', 'proper_subset', 'power_set', 'cartesian_product', 'ordinal_number',
      'cardinal_number', 'transfinite_ordinal', 'continuum_cardinality', 'axiom_of_choice', 'well_ordering'
    ]
  },
  {
    id: 'entropic-principles',
    name: 'Entropic Principles',
    shapes: [
      'boltzmann_entropy', 'shannon_entropy', 'von_neumann_entropy', 'renyi_entropy', 'tsallis_entropy',
      'thermodynamic_arrow', 'cosmological_arrow', 'psychological_arrow', 'radiative_arrow', 'quantum_arrow',
      'entropy_production', 'maximum_entropy', 'minimum_entropy', 'entropy_gradient', 'entropy_fluctuation',
      'information_entropy', 'entanglement_entropy', 'black_hole_entropy_viz', 'holographic_entropy', 'area_law'
    ]
  },
  {
    id: 'uuon-acas',
    name: 'UUON ACAS Systems',
    shapes: [
      'acas_beacon_primary', 'acas_beacon_secondary', 'acas_network_node', 'acas_grid_cell', 'acas_quantum_state',
      'uuon_foundation_logo', 'uuon_token_symbol', 'uuon_network_topology', 'uuon_consensus_mechanism', 'uuon_validator_node',
      'acas_collision_avoidance', 'acas_trajectory_prediction', 'acas_resolution_advisory', 'acas_traffic_alert', 'acas_surveillance',
      'uuon_smart_contract', 'uuon_governance_dao'
    ]
  },
  {
    id: 'quantum-machine-learning',
    name: 'Quantum Machine Learning',
    shapes: [
      'quantum_kernel', 'quantum_feature_map', 'variational_circuit', 'parametric_gate', 'ansatz_layer',
      'quantum_classifier', 'quantum_regressor', 'quantum_autoencoder', 'quantum_gan', 'quantum_boltzmann',
      'barren_plateau', 'expressibility', 'entangling_capacity', 'trainability', 'quantum_advantage',
      'hybrid_classical_quantum', 'noise_resilient_circuit', 'error_mitigated_vqe', 'quantum_natural_gradient', 'quantum_fisher'
    ]
  }
];

function formatDisplayName(shapeType: string): string {
  return shapeType
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// [Content replaced by F-H6 fix - see temp file for reference]
// F-H6: Transaction-wrapped, batched population
async function populateCompleteShapeRegistry() {
  console.log('🔄 Starting complete shape registry population (F-H6: transactional batching)...');
  
  const timestamp = new Date().toISOString();
  let totalInserted = 0;
  let totalSkipped = 0;
  const batchSize = 100;
  let batch: any[] = [];

  try {
    // F-H6: Begin transaction
    await sql`BEGIN`;

    for (const category of ALL_SHAPE_CATEGORIES) {
      console.log(`📂 Processing category: ${category.name} (${category.shapes.length} shapes)`);
      
      for (const shapeType of category.shapes) {
        const displayName = formatDisplayName(shapeType);
        const canonicalUrl = `/shape/${shapeType}`;
        const seoKeywords = `${displayName}, ${category.name}, mathematical visualization, 3D geometry, parametric surface`;
        
        batch.push({
          shapeType,
          displayName,
          categoryId: category.id,
          categoryName: category.name,
          description: `${displayName} - ${category.name} mathematical visualization`,
          seoKeywords,
          canonicalUrl,
          timestamp
        });

        // F-H6: Flush batch every 100 rows
        if (batch.length >= batchSize) {
          await flushBatch(batch, timestamp);
          totalInserted += batch.length;
          batch = [];
        }
      }
    }

    // F-H6: Flush remaining rows
    if (batch.length > 0) {
      await flushBatch(batch, timestamp);
      totalInserted += batch.length;
    }

    // F-H6: Commit transaction
    await sql`COMMIT`;

    console.log(`\n✅ Population complete!`);
    console.log(`   📊 Inserted/Updated: ${totalInserted}`);
    console.log(`   📁 Categories: ${ALL_SHAPE_CATEGORIES.length}`);
    
    const countResult = await sql`SELECT COUNT(*) as total FROM complete_shape_registry`;
    console.log(`   📈 Total in registry: ${countResult[0].total}`);

  } catch (error: any) {
    console.error(`❌ Transaction failed, rolling back:`, error.message);
    try {
      await sql`ROLLBACK`;
    } catch (rollbackError) {
      console.error('❌ Rollback failed:', rollbackError);
    }
    throw error;
  }
}

// F-H6: Batch insert helper
async function flushBatch(batch: any[], timestamp: string) {
  if (batch.length === 0) return;
  
  const values = batch.map(row => `(
    ${sql.from(row.shapeType)},
    ${sql.from(row.displayName)},
    ${sql.from(row.categoryId)},
    ${sql.from(row.categoryName)},
    ${sql.from(row.description)},
    'frontend',
    0.8,
    ${sql.from(row.seoKeywords)},
    ${sql.from(row.canonicalUrl)},
    true,
    ${sql.from(timestamp)},
    ${sql.from(timestamp)}
  )`).join(',');

  await sql`
    INSERT INTO complete_shape_registry (
      shape_type, display_name, category, subcategory, description,
      source, priority, seo_keywords, canonical_url, is_active,
      created_at, updated_at
    ) VALUES ${sql(values)}
    ON CONFLICT (shape_type) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      category = EXCLUDED.category,
      updated_at = EXCLUDED.updated_at
  `;
}

populateCompleteShapeRegistry().catch(console.error);
