/**
 * ENHANCED SITEMAP SEO METADATA SYSTEM
 * Comprehensive What/Who/Why/Where/When information for optimal SEO
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

export interface SitemapSEOMetadata {
  category: string;
  displayName: string;
  what: string;
  who: string;
  why: string;
  where: string;
  when: string;
  futureEnhancement: string;
  keywords: string[];
  jsonLdType: string;
  canonicalPath: string;
  priority: number;
  shapes: string[];
}

export const SITEMAP_SEO_METADATA: Record<string, SitemapSEOMetadata> = {
  'quantum-gravity': {
    category: 'quantum-gravity',
    displayName: 'Quantum Gravity & Planck Scale Physics',
    what: 'Interactive 3D visualizations of quantum gravity theories including Loop Quantum Gravity, String Theory, and Planck-scale phenomena. Mathematical surfaces representing Wheeler-DeWitt equations, spin networks, and spacetime foam.',
    who: 'Physicists, cosmologists, graduate students, science educators, and researchers exploring the fundamental nature of spacetime at quantum scales.',
    why: 'To provide intuitive visual understanding of the most abstract physics concepts, bridge quantum mechanics and general relativity, and enable hands-on exploration of theoretical frameworks.',
    where: 'Accessible globally via web browser - universities, research institutions, science museums, educational platforms, and individual study.',
    when: 'Available 24/7 for real-time interactive exploration. Updated with latest theoretical developments and new visualization algorithms.',
    futureEnhancement: 'Integration with quantum computing simulations, VR/AR immersive experiences, real-time collaboration for research teams, and AI-guided exploration paths.',
    keywords: ['quantum gravity', 'planck scale', 'string theory', 'loop quantum gravity', 'wheeler-dewitt', 'spacetime foam', 'spin networks', 'holographic principle'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/quantum-gravity',
    priority: 1.0,
    shapes: ['wheeler_dewitt_equation', 'spin_network_node', 'planck_length_lattice', 'holographic_screen', 'ads_cft_correspondence']
  },

  'general-relativity': {
    category: 'general-relativity',
    displayName: 'General Relativity & Curved Spacetime',
    what: 'Einstein field equation visualizations showing spacetime curvature, black hole geometries, gravitational waves, and cosmological models. Interactive exploration of Schwarzschild, Kerr, and FLRW metrics.',
    who: 'Astrophysicists, cosmology students, science communicators, and enthusiasts seeking to understand how mass curves spacetime.',
    why: 'To make abstract tensor mathematics tangible through 3D visualization, demonstrate gravitational phenomena, and support physics education.',
    where: 'Web-accessible platform for academic institutions, observatories, planetariums, and personal learning environments.',
    when: 'Continuously available with regular updates incorporating new gravitational wave observations and cosmological data.',
    futureEnhancement: 'Real-time integration with LIGO/Virgo gravitational wave data, spacecraft trajectory planning tools, and GPU-accelerated tensor field rendering.',
    keywords: ['general relativity', 'einstein field equations', 'black holes', 'gravitational waves', 'spacetime curvature', 'kerr metric', 'cosmology'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/general-relativity',
    priority: 1.0,
    shapes: ['einstein_field_equations', 'schwarzschild_metric', 'kerr_black_hole', 'gravitational_wave_pattern', 'riemann_curvature_tensor']
  },

  'theory-of-everything': {
    category: 'theory-of-everything',
    displayName: 'Theory of Everything Candidates',
    what: '10 leading unified field theory visualizations including M-Theory, Loop Quantum Gravity, Causal Set Theory, E8 Lattice, and Entropic Gravity. Mathematical surfaces representing the quest for ultimate unification.',
    who: 'Theoretical physicists, philosophy of science scholars, advanced physics students, and visionaries exploring fundamental reality.',
    why: 'To compare competing unification frameworks visually, inspire new theoretical insights, and democratize access to cutting-edge physics.',
    where: 'Global web platform connecting researchers, educators, and curious minds across continents.',
    when: 'Updated as new theoretical developments emerge from leading research institutions worldwide.',
    futureEnhancement: 'AI-assisted theory comparison tools, community-contributed visualization parameters, and citation network integration.',
    keywords: ['theory of everything', 'unified field theory', 'm-theory', 'e8 lattice', 'causal set theory', 'entropic gravity', 'grand unification'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/theory-of-everything',
    priority: 1.0,
    shapes: ['m_theory_11d_membrane', 'e8_lattice_structure', 'causal_set_spacetime', 'entropic_gravity_screen', 'loop_quantum_cosmos']
  },

  'quantum-mechanics': {
    category: 'quantum-mechanics',
    displayName: 'Quantum Mechanics & Wave Functions',
    what: 'Schrödinger equation solutions, wave function visualizations, quantum tunneling, entanglement patterns, and atomic orbital probability clouds in interactive 3D.',
    who: 'Physics students, chemistry learners, quantum computing researchers, and educators teaching quantum principles.',
    why: 'To transform abstract wave equations into intuitive visual experiences, support quantum literacy, and enable parameter experimentation.',
    where: 'Browser-based platform accessible in classrooms, laboratories, and homes worldwide.',
    when: 'Always available for self-paced learning with seasonal curriculum-aligned updates.',
    futureEnhancement: 'Integration with quantum simulators, entanglement visualization networks, and real quantum computer output rendering.',
    keywords: ['quantum mechanics', 'schrodinger equation', 'wave function', 'quantum tunneling', 'superposition', 'entanglement', 'atomic orbitals'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/quantum-mechanics',
    priority: 1.0,
    shapes: ['schrodinger_wave_3d', 'hydrogen_orbital_3d', 'quantum_tunneling_barrier', 'bell_state_entanglement', 'bloch_sphere']
  },

  'cryptography': {
    category: 'cryptography',
    displayName: 'Cryptographic Algorithms & Security',
    what: 'Visual representations of encryption algorithms including AES, RSA, Elliptic Curve, Zero-Knowledge Proofs, and Post-Quantum Cryptography. Interactive exploration of mathematical security.',
    who: 'Cybersecurity professionals, blockchain developers, cryptography students, and privacy-focused technologists.',
    why: 'To understand the mathematical foundations of digital security, visualize attack vectors, and explore post-quantum readiness.',
    where: 'Secure web platform for security teams, academic programs, and compliance training environments.',
    when: 'Regularly updated with NIST post-quantum standards and emerging cryptographic research.',
    futureEnhancement: 'Real-time vulnerability visualization, quantum attack simulation, and integration with hardware security modules.',
    keywords: ['cryptography', 'encryption', 'RSA', 'AES', 'elliptic curve', 'zero knowledge proofs', 'post-quantum', 'blockchain security'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/cryptography',
    priority: 0.95,
    shapes: ['aes_rijndael_cipher', 'elliptic_curve_addition', 'rsa_modular_exponent', 'zk_snark', 'dilithium_signatures']
  },

  'blockchain': {
    category: 'blockchain',
    displayName: 'Blockchain & Distributed Ledger',
    what: 'Consensus mechanism visualizations including Proof of Work, Proof of Stake, PBFT, and Layer 2 solutions. Interactive exploration of merkle trees, hash chains, and smart contract execution.',
    who: 'Web3 developers, fintech professionals, decentralization advocates, and blockchain architects.',
    why: 'To demystify distributed consensus, visualize transaction validation, and understand scaling solutions.',
    where: 'Accessible platform for developer communities, financial institutions, and blockchain education programs.',
    when: 'Updated with latest protocol upgrades, new consensus mechanisms, and DeFi innovations.',
    futureEnhancement: 'Live blockchain state visualization, cross-chain interoperability mapping, and MEV flow analysis.',
    keywords: ['blockchain', 'proof of work', 'proof of stake', 'consensus', 'merkle tree', 'smart contracts', 'layer 2', 'DeFi'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/blockchain',
    priority: 0.95,
    shapes: ['proof_of_work', 'proof_of_stake', 'merkle_tree', 'lightning_network', 'pbft_consensus']
  },

  'ai-ml': {
    category: 'ai-ml',
    displayName: 'AI & Machine Learning Algorithms',
    what: 'Neural network architectures, gradient descent landscapes, attention mechanisms, and generative model visualizations. Interactive exploration of transformer architectures and optimization surfaces.',
    who: 'ML engineers, AI researchers, data scientists, and students learning deep learning fundamentals.',
    why: 'To build intuition for neural network behavior, understand optimization dynamics, and visualize learned representations.',
    where: 'Web platform for AI labs, tech companies, online courses, and self-directed learners.',
    when: 'Continuously updated with state-of-the-art architectures and breakthrough algorithms.',
    futureEnhancement: 'Real-time training visualization, model interpretability tools, and integration with popular ML frameworks.',
    keywords: ['machine learning', 'neural networks', 'deep learning', 'transformers', 'gradient descent', 'attention mechanism', 'generative AI'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/ai-ml',
    priority: 0.95,
    shapes: ['gradient_descent_landscape', 'transformer_attention', 'cnn_feature_maps', 'lstm_gates', 'gan_latent_space']
  },

  'quantum-computing': {
    category: 'quantum-computing',
    displayName: 'Quantum Computing & Algorithms',
    what: 'Quantum circuit visualizations, qubit state representations, quantum algorithm animations, and error correction schemes. Interactive exploration of Grover, Shor, and variational algorithms.',
    who: 'Quantum software developers, physics researchers, computing pioneers, and quantum-curious technologists.',
    why: 'To understand quantum computational advantage, design quantum algorithms, and prepare for the quantum era.',
    where: 'Platform integrated with IBM Quantum, accessible for research teams and educational institutions.',
    when: 'Updated with latest quantum hardware capabilities and algorithm developments.',
    futureEnhancement: 'Direct quantum hardware execution, real-time decoherence visualization, and quantum-classical hybrid optimization.',
    keywords: ['quantum computing', 'qubits', 'quantum algorithms', 'shor algorithm', 'grover search', 'quantum error correction', 'NISQ'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/quantum-computing',
    priority: 0.95,
    shapes: ['bloch_sphere', 'quantum_circuit_3d', 'grover_amplitude', 'shor_period_finding', 'surface_code_lattice']
  },

  'molecular-biology': {
    category: 'molecular-biology',
    displayName: 'Molecular Biology & Biochemistry',
    what: 'DNA helix structures, protein folding landscapes, enzyme mechanisms, and cellular machinery visualizations. Interactive exploration of molecular dynamics and biochemical pathways.',
    who: 'Biologists, biochemistry students, pharmaceutical researchers, and medical professionals.',
    why: 'To understand life at the molecular level, visualize drug interactions, and support biomedical education.',
    where: 'Platform for universities, research hospitals, biotech companies, and science education.',
    when: 'Updated with PDB structure releases and new molecular insights from research.',
    futureEnhancement: 'AlphaFold integration, real-time molecular dynamics, and personalized medicine visualization.',
    keywords: ['molecular biology', 'DNA', 'protein folding', 'biochemistry', 'enzymes', 'cellular biology', 'drug design'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/molecular-biology',
    priority: 0.9,
    shapes: ['dna_double_helix', 'protein_alpha_helix', 'ribosome_structure', 'atp_synthase', 'cell_membrane']
  },

  'sacred-geometry': {
    category: 'sacred-geometry',
    displayName: 'Sacred Geometry & Golden Ratio',
    what: 'Flower of Life, Metatron\'s Cube, Fibonacci spirals, and Platonic solid visualizations. Mathematical patterns found in nature, art, and architecture throughout human history.',
    who: 'Artists, architects, spiritual seekers, mathematicians, and designers exploring universal patterns.',
    why: 'To discover mathematical harmony in nature, inspire creative works, and explore philosophical connections.',
    where: 'Platform for creative studios, meditation centers, educational institutions, and individual exploration.',
    when: 'Timeless patterns available continuously with artistic interpretation updates.',
    futureEnhancement: 'AR overlay for architecture, generative sacred art, and cultural pattern integration.',
    keywords: ['sacred geometry', 'golden ratio', 'fibonacci', 'flower of life', 'platonic solids', 'metatrons cube', 'phi'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/sacred-geometry',
    priority: 0.85,
    shapes: ['flower_of_life', 'metatrons_cube', 'fibonacci_spiral', 'golden_rectangle', 'sri_yantra']
  },

  'fractals': {
    category: 'fractals',
    displayName: 'Fractals & Chaos Theory',
    what: 'Mandelbrot sets, Julia sets, strange attractors, and self-similar structures. Interactive exploration of infinite complexity and deterministic chaos.',
    who: 'Mathematicians, generative artists, complexity scientists, and pattern enthusiasts.',
    why: 'To explore infinite mathematical beauty, understand chaotic systems, and create generative art.',
    where: 'Web platform for academic research, digital art creation, and mathematical education.',
    when: 'Always available with GPU-accelerated real-time rendering updates.',
    futureEnhancement: 'Real-time infinite zoom, fractal music generation, and chaos-based encryption visualization.',
    keywords: ['fractals', 'mandelbrot', 'julia set', 'chaos theory', 'strange attractors', 'self-similarity', 'lorenz attractor'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/fractals',
    priority: 0.9,
    shapes: ['mandelbrot_3d', 'julia_set_3d', 'lorenz_attractor', 'sierpinski_tetrahedron', 'menger_sponge', 'mandelbulb_raymarched', 'platonic_icosa', 'platonic_octa', 'platonic_dodeca', 'menger_kleinian_v2']
  },

  'topology': {
    category: 'topology',
    displayName: 'Topology & Differential Geometry',
    what: 'Klein bottles, Möbius strips, torus knots, and exotic manifolds. Interactive exploration of topological invariants and continuous transformations.',
    who: 'Topologists, geometry researchers, physics students, and mathematical artists.',
    why: 'To visualize abstract topological concepts, understand manifold theory, and explore mathematical surfaces.',
    where: 'Platform for mathematics departments, research groups, and educational outreach.',
    when: 'Continuously available with new surface discoveries and visualization techniques.',
    futureEnhancement: 'Topological data analysis tools, persistent homology visualization, and knot invariant calculators.',
    keywords: ['topology', 'klein bottle', 'mobius strip', 'manifolds', 'differential geometry', 'knot theory', 'torus'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/topology',
    priority: 0.9,
    shapes: ['klein_bottle', 'mobius_strip', 'trefoil_knot', 'boys_surface', 'cross_cap']
  },

  'human-anatomy': {
    category: 'human-anatomy',
    displayName: 'Human Anatomy & Physiology',
    what: 'Organ systems, skeletal structures, neural pathways, and cardiovascular networks in mathematical representation. Interactive exploration of human body geometry.',
    who: 'Medical students, healthcare professionals, anatomy educators, and biomedical engineers.',
    why: 'To support medical education, surgical planning visualization, and anatomical understanding.',
    where: 'Platform for medical schools, hospitals, clinics, and health education programs.',
    when: 'Updated with latest anatomical research and imaging techniques.',
    futureEnhancement: 'Patient-specific anatomy from scans, surgical simulation, and real-time physiological modeling.',
    keywords: ['human anatomy', 'medical visualization', 'organs', 'skeletal system', 'neural networks', 'cardiovascular'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/human-anatomy',
    priority: 0.9,
    shapes: ['heart_chambers', 'brain_surface', 'lung_bronchi', 'spinal_column', 'eye_structure']
  },

  'cosmology': {
    category: 'cosmology',
    displayName: 'Cosmology & Universe Structure',
    what: 'Cosmic web visualization, galaxy formation, dark matter halos, and universe evolution. Interactive exploration of cosmological simulations and large-scale structure.',
    who: 'Cosmologists, astronomers, astrophysics students, and space enthusiasts.',
    why: 'To understand the origin and fate of the universe, visualize cosmic structure, and explore dark matter/energy.',
    where: 'Platform for observatories, planetariums, space agencies, and public science engagement.',
    when: 'Updated with latest observations from James Webb, Euclid, and other space missions.',
    futureEnhancement: 'Real-time cosmological simulation, exoplanet system visualization, and multiverse exploration.',
    keywords: ['cosmology', 'cosmic web', 'galaxy formation', 'dark matter', 'big bang', 'universe structure', 'cosmic microwave background'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/cosmology',
    priority: 0.95,
    shapes: ['cosmic_web_filaments', 'dark_matter_halo', 'galaxy_spiral_arm', 'cmb_fluctuations', 'universe_expansion']
  },

  'set-theory': {
    category: 'set-theory',
    displayName: 'Set Theory & Mathematical Logic',
    what: 'Venn diagrams, power sets, ordinal hierarchies, and cardinality visualizations. Interactive exploration of foundational mathematics and logical structures.',
    who: 'Mathematicians, logicians, computer scientists, and students of mathematical foundations.',
    why: 'To understand the basis of modern mathematics, explore infinite sets, and visualize logical relationships.',
    where: 'Platform for mathematics departments, logic research groups, and foundational studies.',
    when: 'Always available for mathematical exploration and education.',
    futureEnhancement: 'Automated theorem proving visualization, category theory integration, and proof assistant connections.',
    keywords: ['set theory', 'mathematical logic', 'cardinality', 'ordinals', 'venn diagrams', 'infinity', 'ZFC axioms'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/set-theory',
    priority: 0.85,
    shapes: ['venn_intersection', 'power_set_lattice', 'ordinal_hierarchy', 'cantors_diagonal', 'russell_paradox']
  },

  'entropic-principles': {
    category: 'entropic-principles',
    displayName: 'Entropy & Thermodynamic Principles',
    what: 'Entropy production, Bekenstein-Hawking bounds, information thermodynamics, and maximum entropy surfaces. Interactive exploration of the second law and its cosmic implications.',
    who: 'Physicists, information theorists, thermodynamics researchers, and complexity scientists.',
    why: 'To understand the arrow of time, information-entropy connections, and the thermodynamic fate of the universe.',
    where: 'Platform for physics departments, research institutes, and interdisciplinary science programs.',
    when: 'Updated with latest developments in black hole thermodynamics and quantum information.',
    futureEnhancement: 'Quantum thermodynamics simulation, entropy flow visualization, and Maxwell demon experiments.',
    keywords: ['entropy', 'thermodynamics', 'bekenstein bound', 'information theory', 'second law', 'arrow of time'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/entropic-principles',
    priority: 0.9,
    shapes: ['entropy_production_flow', 'bekenstein_hawking_entropy', 'maxwell_demon', 'heat_engine_cycle', 'entropy_gradient']
  },

  'modulo-algorithms': {
    category: 'modulo-algorithms',
    displayName: 'Modular Arithmetic & Number Theory',
    what: 'Modular exponentiation, cyclic groups, congruence relations, and primality testing visualizations. Interactive exploration of number-theoretic algorithms foundational to cryptography.',
    who: 'Cryptographers, number theorists, computer scientists, and mathematics enthusiasts.',
    why: 'To understand the mathematics behind secure communications, explore prime number patterns, and visualize cyclic structures.',
    where: 'Platform for cryptography courses, security research, and mathematical exploration.',
    when: 'Continuously available with algorithm optimization updates.',
    futureEnhancement: 'Prime gap visualization, Riemann hypothesis exploration, and quantum-resistant algorithm testing.',
    keywords: ['modular arithmetic', 'number theory', 'prime numbers', 'cyclic groups', 'RSA mathematics', 'chinese remainder theorem'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/modulo-algorithms',
    priority: 0.85,
    shapes: ['modular_exponentiation', 'cyclic_group_generator', 'prime_spiral', 'fermat_factorization', 'euler_phi']
  },

  'neural-networks': {
    category: 'neural-networks',
    displayName: 'Neural Network Architectures',
    what: 'Convolutional, recurrent, transformer, and graph neural network visualizations. Interactive exploration of layer activations, weight matrices, and information flow.',
    who: 'Deep learning researchers, AI engineers, data scientists, and ML students.',
    why: 'To understand how neural networks learn, debug model behavior, and design new architectures.',
    where: 'Platform for AI labs, tech companies, research institutions, and online education.',
    when: 'Updated with latest architectural innovations and training techniques.',
    futureEnhancement: 'Live training visualization, architecture search tools, and neural scaling law exploration.',
    keywords: ['neural networks', 'deep learning', 'CNN', 'RNN', 'transformer', 'GAN', 'attention'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/neural-networks',
    priority: 0.95,
    shapes: ['cnn_convolution_layer', 'lstm_cell_structure', 'transformer_encoder', 'graph_neural_node', 'autoencoder_latent']
  },

  'gmod6-functions': {
    category: 'gmod6-functions',
    displayName: 'G Mod 6 Mathematical Engine',
    what: 'Six-state mathematical cycling system with hexagonal geometry, rotational symmetry, and pattern generation. Proprietary UUON Foundation algorithm for advanced mathematical exploration.',
    who: 'Mathematical researchers, pattern explorers, and users seeking novel computational frameworks.',
    why: 'To explore hexagonal mathematics, discover new symmetry patterns, and leverage proprietary UUON algorithms.',
    where: 'Exclusive platform feature for UUON Foundation mathematical research.',
    when: 'Available with premium access and continuous algorithm refinement.',
    futureEnhancement: 'Extended modular systems, crystallographic applications, and musical harmony generation.',
    keywords: ['gmod6', 'hexagonal mathematics', 'rotational symmetry', 'pattern generation', 'UUON algorithm'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/gmod6-functions',
    priority: 0.8,
    shapes: ['gmod6_six_phase_cycle', 'gmod6_hex_tessellation', 'gmod6_rotational_flower', 'gmod6_topology_selector']
  },

  'tensor-algebra': {
    category: 'tensor-algebra',
    displayName: 'Tensor Algebra & Multilinear Maps',
    what: 'Tensor field visualizations, multilinear algebra operations, and geometric algebra representations. Interactive exploration of tensors in physics and machine learning.',
    who: 'Physicists, engineers, ML researchers, and students of advanced mathematics.',
    why: 'To understand tensor operations visually, support physics research, and enhance ML interpretability.',
    where: 'Platform for engineering schools, physics departments, and AI research labs.',
    when: 'Continuously available with computational geometry updates.',
    futureEnhancement: 'Tensor network simulation, einsum visualization, and automatic differentiation display.',
    keywords: ['tensors', 'multilinear algebra', 'geometric algebra', 'tensor fields', 'contraction', 'covariance'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/tensor-algebra',
    priority: 0.85,
    shapes: ['tensor_contraction', 'metric_tensor_field', 'christoffel_symbols', 'ricci_tensor', 'stress_energy_tensor']
  },

  'wave-algorithms': {
    category: 'wave-algorithms',
    displayName: 'Wave Physics & Signal Processing',
    what: 'Fourier transforms, wave interference patterns, signal decomposition, and acoustic visualizations. Interactive exploration of wave mechanics and frequency analysis.',
    who: 'Signal processing engineers, acoustics researchers, physics students, and audio professionals.',
    why: 'To understand wave behavior, design filters, and visualize frequency domain transformations.',
    where: 'Platform for engineering schools, audio studios, and telecommunications research.',
    when: 'Updated with latest signal processing algorithms and visualization techniques.',
    futureEnhancement: 'Real-time audio visualization, quantum wave packet dynamics, and seismic wave modeling.',
    keywords: ['wave physics', 'fourier transform', 'signal processing', 'interference', 'acoustics', 'frequency analysis'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/wave-algorithms',
    priority: 0.85,
    shapes: ['fourier_series_3d', 'wave_interference', 'gaussian_wave_packet', 'standing_wave', 'doppler_shift']
  },

  '4d-hyperdimensional': {
    category: '4d-hyperdimensional',
    displayName: '4D Hyperdimensional Geometry',
    what: 'Tesseract projections, 4D polytopes, quaternion rotations, and higher-dimensional manifolds. Interactive exploration of geometry beyond three dimensions.',
    who: 'Mathematicians, physicists, computer scientists, and anyone curious about higher dimensions.',
    why: 'To visualize the fourth dimension, understand higher geometry, and explore mathematical spaces.',
    where: 'Platform for mathematics visualization, physics education, and dimensional exploration.',
    when: 'Always available with new projection techniques and rotation algorithms.',
    futureEnhancement: 'VR 4D immersion, 5D+ visualization, and Calabi-Yau manifold exploration.',
    keywords: ['4D geometry', 'hypercube', 'tesseract', 'quaternions', 'polytopes', 'higher dimensions'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/4d-hyperdimensional',
    priority: 0.9,
    shapes: ['tesseract', 'hypersphere_slice', '24_cell', '120_cell', 'quaternion_rotation']
  },

  'field-theory': {
    category: 'field-theory',
    displayName: 'Quantum Field Theory',
    what: 'Field excitation visualizations, Feynman diagram animations, and gauge field representations. Interactive exploration of particle physics and quantum electrodynamics.',
    who: 'Particle physicists, QFT students, high-energy researchers, and theoretical physics enthusiasts.',
    why: 'To understand quantum fields, visualize particle interactions, and explore the Standard Model.',
    where: 'Platform for particle physics labs, universities, and CERN outreach programs.',
    when: 'Updated with latest experimental results and theoretical developments.',
    futureEnhancement: 'LHC event visualization, beyond Standard Model exploration, and supersymmetry modeling.',
    keywords: ['quantum field theory', 'particle physics', 'feynman diagrams', 'gauge theory', 'QED', 'standard model'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/field-theory',
    priority: 0.9,
    shapes: ['higgs_field_vacuum', 'photon_propagator', 'qcd_flux_tube', 'electroweak_symmetry', 'fermion_field']
  },

  'parametric-exports': {
    category: 'parametric-exports',
    displayName: 'Parametric Export & Living Geometry',
    what: 'Revolutionary 3D export system that preserves mathematical formulas, parameters, and regeneration rules inside exported models. Transforms static triangle meshes into intelligent, editable mathematical objects with embedded equations, UV domains, and parameter snapshots.',
    who: 'CAD engineers, procedural artists, game developers, XR/AR/VR developers, AI/ML researchers, and anyone needing intelligent 3D assets that can be regenerated, edited, or animated programmatically.',
    why: 'To create "living geometry" instead of "dead meshes" - exported models that remember their mathematical origins, can be regenerated with different parameters, and integrate with AI/ML systems for structured understanding.',
    where: 'Web-based platform exporting to GLTF/GLB with embedded parametric data, Sketchfab integration, and universal compatibility with external 3D tools.',
    when: 'Available for all 1,761 shapes across 110 categories. Continuously enhanced with new parameter preservation techniques.',
    futureEnhancement: 'Bidirectional import/export workflows, real-time collaborative parametric editing, AI-driven parameter optimization, and integration with CAD/engineering software.',
    keywords: ['parametric export', 'living geometry', 'GLTF parametric', 'intelligent 3D models', 'regenerable meshes', 'formula preservation', 'CAD export', 'procedural assets', 'game dev assets', 'XR development', 'AI 3D training'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/parametric-exports',
    priority: 1.0,
    shapes: ['export_parametric_glb', 'living_geometry_system', 'formula_preservation', 'parameter_snapshot', 'regeneration_engine']
  },

  'mathematical-art': {
    category: 'mathematical-art',
    displayName: 'Mathematical Art & Famous Visualizations',
    what: 'Recreation of famous mathematical artworks using precise parametric equations. Includes Hamid Naderi Yeganeh\'s iconic Eagle using ~7,000 ellipses, and other mathematically-generated art pieces demonstrating the beauty of equations.',
    who: 'Artists, mathematicians, educators, museum curators, and anyone appreciating the intersection of mathematics and visual beauty.',
    why: 'To demonstrate that mathematics produces profound aesthetic beauty, inspire creativity through equations, and preserve mathematical art in interactive digital form.',
    where: 'Web platform for galleries, museums, educational institutions, and personal exploration of mathematical aesthetics.',
    when: 'Growing collection with new mathematical artworks added as they are discovered and implemented.',
    futureEnhancement: 'User-contributed mathematical art, high-resolution print exports, animation of artistic parameters, and gallery mode presentations.',
    keywords: ['mathematical art', 'yeganeh eagle', 'parametric art', 'equation art', 'generative art', 'mathematical beauty', 'ellipse art', 'trigonometric art'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/mathematical-art',
    priority: 0.95,
    shapes: ['yeganeh_eagle', 'mathematical_rose', 'butterfly_curve', 'heart_surface', 'infinity_ribbon']
  },

  'babylonian-zodiac': {
    category: 'babylonian-zodiac',
    displayName: 'Babylonian Zodiac (2000 BCE)',
    what: 'The 12 original zodiac constellations from ancient Babylon, mathematically reconstructed from cuneiform astronomical tablets. Each shape represents authentic Mesopotamian star patterns with historical accuracy.',
    who: 'Archaeoastronomers, historians, astrology researchers, museum educators, and anyone interested in ancient mathematical astronomy.',
    why: 'To preserve and visualize ancient Babylonian astronomical knowledge, connect modern mathematics with historical roots, and provide educational tools for understanding the origins of the zodiac.',
    where: 'Platform for museums, universities, history of science programs, and cultural heritage preservation.',
    when: 'Complete set of 12 zodiac shapes available, based on research from cuneiform tablet translations.',
    futureEnhancement: 'Egyptian, Greek, and Chinese zodiac comparisons, historical star position animations, and AR constellation viewing.',
    keywords: ['babylonian zodiac', 'ancient astronomy', 'cuneiform', 'mesopotamian science', 'archaeoastronomy', 'zodiac origins', 'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/babylonian-zodiac',
    priority: 0.9,
    shapes: ['babylonian_aries_hired_man', 'babylonian_taurus_bull_of_heaven', 'babylonian_gemini_great_twins', 'babylonian_cancer_crayfish', 'babylonian_leo_lion', 'babylonian_virgo_furrow', 'babylonian_libra_scales', 'babylonian_scorpio_scorpion', 'babylonian_sagittarius_pabilsag', 'babylonian_capricorn_goat_fish', 'babylonian_aquarius_water_bearer', 'babylonian_pisces_fish_string']
  },

  'founder': {
    category: 'founder',
    displayName: 'Phillip Aguilar Ruiz III - UUON Foundation Founder',
    what: 'Complete profile of the founder and CEO of UUON Foundation Inc., creator of the Δmension Mathematical Universe platform. Military veteran, philosopher, and mathematical universe architect.',
    who: 'Investors, partners, media, researchers, and anyone interested in the vision behind UUON Foundation Inc.',
    why: 'To provide transparency about the leadership, vision, and mission driving the development of revolutionary mathematical visualization technology.',
    where: 'Publicly accessible profile page at uuonfoundation.com and within the Δmension platform documentation.',
    when: 'Profile established December 2025. Updated as company milestones and achievements are reached.',
    futureEnhancement: 'Video interviews, speaking engagements calendar, published papers and patents, and interactive founder journey timeline.',
    keywords: ['Phillip Aguilar Ruiz', 'UUON Foundation', 'founder', 'CEO', 'mathematical universe', 'Yuma Arizona', 'military veteran', 'philosopher', 'parametric consciousness'],
    jsonLdType: 'Person',
    canonicalPath: '/docs/founder',
    priority: 0.9,
    shapes: []
  },

  'uuon-foundation': {
    category: 'uuon-foundation',
    displayName: 'UUON Foundation Inc. - About',
    what: 'UUON Foundation Inc. (Universally United Obscured Node) - the company behind Δmension Mathematical Universe. Creates identity for mathematical formulas through 3D visualization.',
    who: 'Potential partners, investors, researchers, educators, and technologists seeking to understand the company mission.',
    why: 'To democratize mathematical understanding by transforming abstract concepts into intuitive 3D visualizations accessible to everyone.',
    where: 'Headquarters vision spans digital platforms with plans for physical labs and research facilities.',
    when: 'Founded 2025. Operating as a digital-first mathematical visualization company.',
    futureEnhancement: 'Enterprise partnerships, academic collaborations, quantum computing integration, and global education initiatives.',
    keywords: ['UUON Foundation', 'Universally United Obscured Node', 'mathematical visualization', '3D mathematics', 'parametric surfaces', 'company', 'about'],
    jsonLdType: 'Organization',
    canonicalPath: '/docs/about',
    priority: 0.85,
    shapes: []
  },

  'thermal-engineering': {
    category: 'thermal-engineering',
    displayName: 'Thermal Engineering & Data Center Cooling',
    what: '31 parametric surface equations for AI infrastructure thermal management including heat dissipation (Q=P×(1-η)), PUE/COP efficiency metrics, Navier-Stokes CFD visualization, Reynolds turbulence modeling, immersion cooling dynamics, heat exchangers, GPU power profiles, exergy analysis, sustainability metrics (WUE/CUE), nonlinear COP models (polynomial/rational/Bezier), and cross-domain mathematical DNA patterns (unified polar, interference cooling, spherical harmonics). Real engineering formulas rendered as interactive 3D surfaces.',
    who: 'Data center engineers, thermal management specialists, HVAC professionals, AI infrastructure architects, sustainability officers, and mechanical engineers designing cooling systems for high-performance computing.',
    why: 'To provide visual understanding of complex thermal engineering equations, enable real-time parameter exploration for cooling system optimization, and bridge theoretical thermodynamics with practical data center design.',
    where: 'Web platform accessible for data center design teams, engineering firms, cloud providers, and academic thermal engineering programs worldwide.',
    when: 'Released January 2025. Updated with nonlinear cooling models, parametric COP functions, and advanced system identification methods.',
    futureEnhancement: 'Real-time BMS integration, CFD solver coupling, digital twin thermal modeling, predictive maintenance algorithms, and ML-based cooling optimization.',
    keywords: ['thermal engineering', 'data center cooling', 'PUE', 'COP', 'Navier-Stokes', 'Reynolds number', 'immersion cooling', 'heat exchanger', 'GPU cooling', 'exergy', 'WUE', 'CUE', 'sustainability', 'CFD', 'heat transfer'],
    jsonLdType: 'SoftwareApplication',
    canonicalPath: '/category/thermal-engineering',
    priority: 0.95,
    shapes: ['heat_dissipation_surface', 'heat_flux_density', 'sensible_heat_removal', 'pue_efficiency_surface', 'cop_coefficient_performance', 'thermal_resistance_network', 'junction_temperature_surface', 'nusselt_convection_surface', 'reynolds_flow_regime', 'immersion_cooling_boiling', 'heat_exchanger_effectiveness', 'ntu_transfer_units', 'navier_stokes_momentum', 'hot_cold_aisle_containment', 'direct_chip_liquid_cooling', 'fan_affinity_laws', 'cooling_tower_effectiveness', 'rack_power_density_limit', 'gpu_dynamic_power', 'exergy_thermodynamic_analysis', 'waste_heat_recovery', 'phase_change_thermal_storage', 'water_usage_effectiveness', 'carbon_usage_effectiveness', 'ehd_electrohydrodynamic_cooling', 'polynomial_cop_surface', 'rational_cop_model', 'bezier_cop_curve', 'unified_polar_field', 'interference_enhanced_cooling', 'spherical_harmonic_cop']
  },

  'publications': {
    category: 'publications',
    displayName: 'UUON Foundation & Claude AI Publications',
    what: 'Technical publications, implementation guides, and research papers co-authored by UUON Foundation Inc. and Claude AI (Anthropic). Covers thermal engineering, parametric mathematics, data center optimization, and mathematical visualization techniques.',
    who: 'Researchers, engineers, academics, and practitioners seeking authoritative technical documentation on advanced mathematical visualization and thermal engineering.',
    why: 'To provide comprehensive implementation guidance, share research findings, and establish thought leadership in mathematical visualization and AI infrastructure engineering.',
    where: 'Publicly accessible documentation platform integrated with the Δmension Mathematical Universe system.',
    when: 'Publication series launched January 2025. New publications added as research and implementations progress.',
    futureEnhancement: 'Peer review integration, citation tracking, DOI registration, academic database indexing, and interactive publication viewers.',
    keywords: ['UUON Foundation', 'Claude AI', 'publications', 'research papers', 'implementation guides', 'thermal engineering', 'mathematical visualization', 'technical documentation'],
    jsonLdType: 'CreativeWorkSeries',
    canonicalPath: '/publications',
    priority: 0.9,
    shapes: []
  }
};

export function generateEnhancedSitemapXML(metadata: SitemapSEOMetadata, baseUrl: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}${metadata.canonicalPath}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${metadata.priority}</priority>
    
    <!-- Enhanced SEO Metadata -->
    <seo:metadata xmlns:seo="https://uuon.org/sitemap-seo">
      <seo:displayName>${escapeXml(metadata.displayName)}</seo:displayName>
      
      <!-- What: Description of the category -->
      <seo:what>${escapeXml(metadata.what)}</seo:what>
      
      <!-- Who: Target audience -->
      <seo:who>${escapeXml(metadata.who)}</seo:who>
      
      <!-- Why: Purpose and value -->
      <seo:why>${escapeXml(metadata.why)}</seo:why>
      
      <!-- Where: Accessibility and deployment -->
      <seo:where>${escapeXml(metadata.where)}</seo:where>
      
      <!-- When: Availability and updates -->
      <seo:when>${escapeXml(metadata.when)}</seo:when>
      
      <!-- Future Enhancement: Technology roadmap -->
      <seo:futureEnhancement>${escapeXml(metadata.futureEnhancement)}</seo:futureEnhancement>
      
      <seo:keywords>${metadata.keywords.join(', ')}</seo:keywords>
      <seo:shapeCount>${metadata.shapes.length}</seo:shapeCount>
    </seo:metadata>
    
    <!-- JSON-LD Schema -->
    <script type="application/ld+json">
    ${generateJsonLd(metadata, baseUrl)}
    </script>
    
    <!-- Shape URLs -->
${metadata.shapes.map(shape => `    <xhtml:link rel="shape" href="${baseUrl}/shape/${shape}" />`).join('\n')}
  </url>
</urlset>`;
}

function generateJsonLd(metadata: SitemapSEOMetadata, baseUrl: string): string {
  const today = new Date().toISOString().split('T')[0];
  
  const baseSchema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": metadata.jsonLdType,
    "name": metadata.displayName,
    "headline": metadata.displayName,
    "description": metadata.what,
    "url": `${baseUrl}${metadata.canonicalPath}`,
    "inLanguage": "en-US",
    "datePublished": "2025-01-01",
    "dateModified": today,
    "author": {
      "@type": "Organization",
      "name": "UUON Foundation Inc.",
      "url": "https://uuon.world",
      "sameAs": [
        "https://sketchfab.com/uuon",
        "https://www.instagram.com/uuon.foundation"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "UUON Foundation Inc.",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/dmension-logo.png`,
        "width": 512,
        "height": 512
      }
    },
    "audience": {
      "@type": "Audience",
      "audienceType": metadata.who
    },
    "keywords": metadata.keywords.join(", "),
    "articleSection": metadata.category
  };

  if (metadata.jsonLdType === 'SoftwareApplication') {
    baseSchema.applicationCategory = "Scientific Visualization";
    baseSchema.operatingSystem = "Web Browser";
    baseSchema.offers = {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    };
    baseSchema.featureList = metadata.shapes.length > 0 
      ? `${metadata.shapes.length} interactive mathematical visualizations`
      : "Interactive mathematical visualization tools";
  }

  if (metadata.jsonLdType === 'Person') {
    baseSchema.jobTitle = "Founder & Principal Lead";
    baseSchema.worksFor = {
      "@type": "Organization",
      "name": "UUON Foundation Inc."
    };
  }

  if (metadata.jsonLdType === 'Organization') {
    baseSchema.foundingDate = "2025";
    baseSchema.areaServed = "Global";
    baseSchema.knowsAbout = metadata.keywords;
  }

  return JSON.stringify(baseSchema, null, 2);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateMasterSitemapIndex(baseUrl: string): string {
  const today = new Date().toISOString().split('T')[0];
  const categories = Object.keys(SITEMAP_SEO_METADATA);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categories.map(cat => `  <sitemap>
    <loc>${baseUrl}/sitemap-${cat}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')}
  
  <!-- Core System Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-shapes.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-formulas.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-api.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-products.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-documentation.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- Living Geometry & Parametric Export -->
  <sitemap>
    <loc>${baseUrl}/sitemap-parametric-exports.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-living-geometry.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- Special Collections -->
  <sitemap>
    <loc>${baseUrl}/sitemap-mathematical-art.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-babylonian-zodiac.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- UUON Foundation Publications -->
  <sitemap>
    <loc>${baseUrl}/sitemap-publications.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-thermal-engineering.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  
  <!-- About & Foundation -->
  <sitemap>
    <loc>${baseUrl}/sitemap-about.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

console.log('📊 Enhanced Sitemap SEO Metadata System loaded');
console.log(`✅ ${Object.keys(SITEMAP_SEO_METADATA).length} categories with comprehensive What/Who/Why/Where/When metadata`);
