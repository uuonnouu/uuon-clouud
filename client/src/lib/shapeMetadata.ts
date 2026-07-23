export interface ShapeMetadata {
  name: string;
  uuhat: string;
  uuhere: string;
  uuho: string;
  uuhen: string;
  uuhy: string;
  formula: string;
  keywords: string[];
  rootWords: string[];
  trending: string[];
  category: string;
}

const categoryMetadata: Record<string, Partial<ShapeMetadata>> = {
  'sacred-geometry': {
    uuhere: 'Found in ancient temples, religious architecture, natural formations, DNA helices, galaxy spirals, and flower petals',
    uuhen: 'Studied since ancient Egypt and Greece (3000 BCE), formalized by Pythagoras, applied in Renaissance art',
    uuhy: 'Sacred proportions optimize neural network architectures, compression algorithms, and aesthetic AI systems',
    trending: ['sacred geometry AI', 'golden ratio machine learning', 'fibonacci neural networks', 'geometric deep learning'],
    rootWords: ['sacr- (sacred)', 'geo- (earth)', 'metr- (measure)', 'ratio (reason)']
  },
  'cryptography': {
    uuhere: 'Blockchain networks, secure communications, digital signatures, password hashing, quantum-resistant systems',
    uuhen: 'Caesar cipher (100 BCE), Enigma (1918), RSA (1977), AES (2001), post-quantum (2022)',
    uuhy: 'Cryptographic geometry enables secure AI training, federated learning privacy, and homomorphic encryption',
    trending: ['post-quantum cryptography', 'zero-knowledge proofs', 'homomorphic encryption', 'lattice-based crypto'],
    rootWords: ['crypt- (hidden)', 'graph- (write)', 'cipher (zero)', 'hash (chop)']
  },
  'quantum-mechanics': {
    uuhere: 'Atomic orbitals, semiconductors, lasers, MRI machines, quantum computers, photosynthesis',
    uuhen: 'Planck (1900), Bohr (1913), Schrödinger (1926), Feynman (1948), quantum computing (1994)',
    uuhy: 'Quantum geometry powers quantum machine learning, quantum neural networks, and optimization algorithms',
    trending: ['quantum machine learning', 'quantum neural networks', 'variational quantum eigensolver', 'quantum supremacy'],
    rootWords: ['quant- (how much)', 'wave (vibration)', 'particle (small part)', 'super- (above)']
  },
  'quantum-gravity': {
    uuhere: 'Black hole singularities, Big Bang cosmology, Planck-scale physics, loop quantum gravity simulations',
    uuhen: 'Einstein (1915), Wheeler (1957), Hawking (1974), Loop QG (1986), String theory (1984)',
    uuhy: 'Quantum gravity insights inform spacetime neural networks and cosmological simulation frameworks',
    trending: ['loop quantum gravity', 'spin foam models', 'holographic principle', 'emergent spacetime'],
    rootWords: ['grav- (heavy)', 'quant- (amount)', 'space-time (4D fabric)', 'planck (smallest)']
  },
  'general-relativity': {
    uuhere: 'GPS satellites, gravitational wave detectors, black hole imaging, cosmological models',
    uuhen: 'Einstein (1915), Schwarzschild (1916), LIGO detection (2015), Event Horizon Telescope (2019)',
    uuhy: 'Relativistic corrections essential for satellite AI, autonomous navigation, and precision timing systems',
    trending: ['gravitational wave astronomy', 'black hole imaging', 'spacetime curvature', 'geodesic computation'],
    rootWords: ['relat- (carry back)', 'tensor (stretch)', 'curv- (bend)', 'metric (measure)']
  },
  'topology': {
    uuhere: 'Knot theory in DNA, topological insulators, network analysis, manifold learning, persistent homology',
    uuhen: 'Euler (1736), Poincaré (1895), topological data analysis (2000s), Nobel Prize in topology (2016)',
    uuhy: 'Topological data analysis revolutionizes ML feature extraction and dimensionality reduction',
    trending: ['topological data analysis', 'persistent homology', 'manifold learning', 'topological neural networks'],
    rootWords: ['topo- (place)', 'log- (study)', 'morph- (shape)', 'homeo- (similar)']
  },
  '4d-hyperdimensional': {
    uuhere: 'String theory extra dimensions, neural network embedding spaces, high-dimensional optimization',
    uuhen: 'Riemann (1854), Hinton (1880 tesseract), Kaluza-Klein (1921), modern ML embeddings (2010s)',
    uuhy: 'High-dimensional geometry is the foundation of word embeddings, GANs, and transformer architectures',
    trending: ['high-dimensional embeddings', 'hyperbolic neural networks', 'manifold hypothesis', '4D visualization'],
    rootWords: ['hyper- (beyond)', 'dimen- (measure)', 'poly- (many)', 'tope (place)']
  },
  'fractals': {
    uuhere: 'Coastlines, mountains, trees, blood vessels, stock markets, turbulence, antenna design',
    uuhen: 'Mandelbrot (1975), chaos theory (1960s), fractal compression (1988), L-systems (1968)',
    uuhy: 'Fractal geometry enables efficient neural architectures, texture synthesis, and chaos prediction',
    trending: ['fractal neural networks', 'chaos prediction', 'self-similarity AI', 'fractal image compression'],
    rootWords: ['fract- (broken)', 'iter- (repeat)', 'self-similar', 'recursive']
  },
  'molecular-biology': {
    uuhere: 'Protein folding, DNA replication, enzyme catalysis, drug design, CRISPR editing',
    uuhen: 'Watson-Crick (1953), protein structure (1958), AlphaFold (2020), CRISPR Nobel (2020)',
    uuhy: 'Molecular geometry drives AI drug discovery, protein design, and computational biology',
    trending: ['AlphaFold', 'protein structure prediction', 'molecular dynamics', 'AI drug discovery'],
    rootWords: ['mol- (mass)', 'bio- (life)', 'protein (first)', 'helix (spiral)']
  },
  'algorithms': {
    uuhere: 'Search engines, optimization, sorting, graph traversal, machine learning training',
    uuhen: 'Al-Khwarizmi (820 CE), Turing (1936), Dijkstra (1959), backpropagation (1986)',
    uuhy: 'Algorithm geometry visualizes complexity classes, optimization landscapes, and convergence',
    trending: ['algorithm visualization', 'complexity theory', 'optimization landscapes', 'neural architecture search'],
    rootWords: ['algo- (procedure)', 'rithm- (number)', 'compute (reckon)', 'heuristic (discover)']
  },
  'riemann_geometry': {
    uuhere: 'General relativity, differential geometry, manifold learning, geodesic computations',
    uuhen: 'Riemann (1854), Christoffel (1869), Ricci (1887), Levi-Civita (1917)',
    uuhy: 'Riemannian geometry underpins curved space ML, manifold learning, and geometric deep learning',
    trending: ['differential geometry ML', 'manifold learning', 'geometric deep learning', 'curvature computation'],
    rootWords: ['Riemann (boundary)', 'curv- (bend)', 'geo- (earth)', 'metric (measure)']
  },
  'theory-of-everything': {
    uuhere: 'Unified field theories, M-theory, supersymmetry, grand unified theories',
    uuhen: 'Maxwell EM unification (1865), Einstein GR (1915), unification attempts (1920-1955), String theory (1968), M-theory (1995)',
    uuhy: 'Unification geometry inspires unified AI architectures and multi-modal learning systems',
    trending: ['theory of everything', 'unified field theory', 'M-theory', 'supersymmetry'],
    rootWords: ['uni- (one)', 'theo- (god)', 'super- (above)', 'sym- (together)']
  },
  'uuon-acas': {
    uuhere: 'Autonomous verification systems, beacon networks, collective intelligence frameworks',
    uuhen: 'UUON Foundation (2024), ACAS protocol (2024), mathematical beacon systems (2025)',
    uuhy: 'UUON-ACAS enables trustless AI verification, autonomous collective systems, and decentralized intelligence',
    trending: ['autonomous verification', 'collective intelligence', 'decentralized AI', 'mathematical beacons'],
    rootWords: ['UU (U-squared)', 'ON (network)', 'ACAS (autonomous collective)', 'beacon (signal)']
  }
};

const shapeDefinitions: Record<string, ShapeMetadata> = {
  tesseract: {
    name: 'Tesseract (4D Hypercube)',
    uuhat: 'A four-dimensional analog of the cube - 8 cubic cells connected through 4D space, projected into 3D for visualization. From Greek "tessera" (four) and "aktis" (ray)',
    uuhere: 'Theoretical physics (Kaluza-Klein theory), computer graphics, neural network architectures, Marvel Cinematic Universe',
    uuho: 'Charles Howard Hinton coined "tesseract" (1888), building on work by Ludwig Schläfli (1852) who first described 4D polytopes',
    uuhen: 'Conceptualized 1852, named 1888, popularized in Flatland (1884), central to string theory (1984-present)',
    uuhy: 'High-dimensional geometry is the foundation of modern ML - word embeddings, attention mechanisms, and latent spaces all operate in high-D',
    formula: 'Vertices: (±1, ±1, ±1, ±1) projected via w-rotation',
    keywords: ['tesseract', '4D cube', 'hypercube', 'four dimensional', 'higher dimensions'],
    rootWords: ['tess- (four)', 'ract/ray (beam)', 'hyper- (beyond)', 'cube (six-sided)'],
    trending: ['4D visualization', 'higher dimensional computing', 'hyperdimensional AI'],
    category: '4d-hyperdimensional'
  },
  mobius_strip: {
    name: 'Möbius Strip',
    uuhat: 'A non-orientable surface with only one side and one boundary curve - walk along it and you return to start upside-down. From German "Streifen" (strip)',
    uuhere: 'Conveyor belt design (doubles lifespan), electronic resistors, molecular Möbius molecules, topology education',
    uuho: 'August Ferdinand Möbius and Johann Benedict Listing independently discovered it in 1858',
    uuhen: 'Discovered 1858, applied to engineering 1900s, Möbius molecules synthesized 2003',
    uuhy: 'Non-orientable surfaces model data manifolds in ML, especially for cyclic patterns and phase spaces',
    formula: 'x = (1 + (v/2)cos(u/2))cos(u), y = (1 + (v/2)cos(u/2))sin(u), z = (v/2)sin(u/2)',
    keywords: ['mobius strip', 'non-orientable', 'one-sided surface', 'topology', 'continuous loop'],
    rootWords: ['Möbius (surname)', 'strip (band)', 'topo- (place)', 'orient (east/direction)'],
    trending: ['topological materials', 'non-orientable AI', 'continuous learning'],
    category: 'topology'
  },
  klein_bottle: {
    name: 'Klein Bottle',
    uuhat: 'A non-orientable surface that passes through itself in 3D but exists without self-intersection in 4D - a bottle with no inside or outside',
    uuhere: 'Theoretical topology, fiber bundle mathematics, cosmological models of closed universes',
    uuho: 'Felix Klein (1882) conceived it as "Kleinsche Fläche" (Klein surface), mistranslated as "bottle" from German',
    uuhen: 'Described 1882, proven impossible to embed in 3D without self-intersection, 4D embedding well-understood',
    uuhy: 'Fiber bundle geometry underlies gauge theories in physics and hierarchical representations in deep learning',
    formula: 'Immersion requires 4D: parametric equations create self-intersecting 3D projection',
    keywords: ['klein bottle', 'non-orientable', 'no inside', 'topology', 'four dimensional'],
    rootWords: ['Klein (surname)', 'Fläche (surface)', 'bottle (container)', 'closed (no boundary)'],
    trending: ['4D topology', 'closed manifolds', 'topological deep learning'],
    category: 'topology'
  },
  torus: {
    name: 'Torus (Donut Shape)',
    uuhat: 'A surface of revolution generated by rotating a circle about an axis in its plane - topologically equivalent to a coffee cup. From Latin "torus" (cushion/swelling)',
    uuhere: 'Donut shapes, tokamak fusion reactors, tire inner tubes, particle accelerator beam paths, ring galaxies',
    uuho: 'Ancient Greek mathematicians studied it, Euler formalized (1760), modern applications in fusion physics',
    uuhen: 'Ancient geometry, Euler characteristic (1758), tokamak design (1950s), toroidal fusion (present)',
    uuhy: 'Toroidal geometry models periodic boundary conditions in neural networks and circular data representations',
    formula: 'x = (R + r×cos(v))×cos(u), y = (R + r×cos(v))×sin(u), z = r×sin(v)',
    keywords: ['torus', 'donut', 'toroidal', 'ring surface', 'periodic'],
    rootWords: ['tor- (swell/cushion)', 'revolution (turn around)', 'periodic (circle)'],
    trending: ['toroidal neural networks', 'fusion energy', 'periodic embeddings'],
    category: 'topology'
  },
  mandelbrot_3d: {
    name: 'Mandelbrot Set (3D)',
    uuhat: 'The boundary of the set of complex numbers c for which z² + c does not escape to infinity - infinitely complex from simple iteration',
    uuhere: 'Chaos theory, fractal art, antenna design, financial modeling, coastline measurement',
    uuho: 'Benoît Mandelbrot visualized it (1980), based on Julia and Fatou\'s work (1918-1920)',
    uuhen: 'Julia sets (1918), Mandelbrot visualization (1980), fractal geometry (1982), 3D extensions (1990s)',
    uuhy: 'Fractal self-similarity inspires recursive neural networks and multi-scale feature learning',
    formula: 'z_{n+1} = z_n² + c, where |z| < 2 defines the set boundary',
    keywords: ['mandelbrot', 'fractal', 'chaos', 'self-similar', 'infinite complexity'],
    rootWords: ['fract- (broken)', 'iter- (repeat)', 'complex (woven together)', 'escape (threshold)'],
    trending: ['fractal deep learning', 'chaos prediction AI', 'self-similar networks'],
    category: 'fractals'
  },
  dna_double_helix: {
    name: 'DNA Double Helix',
    uuhat: 'The twisted ladder structure of deoxyribonucleic acid - two polynucleotide chains forming the genetic code of all known life',
    uuhere: 'Every living cell, forensic analysis, genetic engineering, CRISPR technology, ancestry testing',
    uuho: 'Watson and Crick (1953) with crucial X-ray data from Rosalind Franklin and Maurice Wilkins',
    uuhen: 'Structure discovered 1953, genetic code cracked 1961, Human Genome Project completed 2003',
    uuhy: 'DNA geometry inspired sequence-to-structure ML models like AlphaFold that revolutionized biology',
    formula: 'Helix: x = r×cos(t), y = r×sin(t), z = c×t with base pair connections',
    keywords: ['DNA', 'double helix', 'genetic', 'nucleotide', 'base pairs'],
    rootWords: ['deoxy- (lacking oxygen)', 'ribo- (sugar)', 'nucleic (nucleus)', 'helix (spiral)'],
    trending: ['AlphaFold', 'genetic AI', 'CRISPR machine learning', 'protein prediction'],
    category: 'molecular-biology'
  },
  schwarzschild_metric: {
    name: 'Schwarzschild Metric',
    uuhat: 'The first exact solution to Einstein\'s field equations - describes spacetime geometry around a non-rotating black hole',
    uuhere: 'Black hole physics, GPS satellite corrections, gravitational wave templates, event horizon calculations',
    uuho: 'Karl Schwarzschild (1916) solved Einstein\'s equations while serving in WWI, months before his death',
    uuhen: 'Solution found 1916, black hole term coined 1967, Hawking radiation 1974, first image 2019',
    uuhy: 'Curved spacetime math informs geometric deep learning and relativistic neural network architectures',
    formula: 'ds² = -(1-r_s/r)dt² + (1-r_s/r)⁻¹dr² + r²dΩ², where r_s = 2GM/c²',
    keywords: ['schwarzschild', 'black hole', 'event horizon', 'spacetime', 'relativity'],
    rootWords: ['schwarz (black)', 'schild (shield)', 'metric (measure)', 'singularity (single point)'],
    trending: ['black hole AI', 'gravitational wave detection', 'spacetime neural networks'],
    category: 'general-relativity'
  },
  bloch_sphere: {
    name: 'Bloch Sphere',
    uuhat: 'Geometric representation of the pure state space of a two-level quantum system (qubit) - the fundamental unit of quantum information',
    uuhere: 'Quantum computers, NMR spectroscopy, quantum cryptography, quantum error correction',
    uuho: 'Felix Bloch (1946) developed it for nuclear magnetic resonance, now central to quantum computing',
    uuhen: 'Bloch equations (1946), qubit formalization (1995), quantum supremacy claims (2019)',
    uuhy: 'Quantum state geometry enables quantum machine learning and variational quantum eigensolvers',
    formula: '|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩ on unit sphere',
    keywords: ['bloch sphere', 'qubit', 'quantum state', 'superposition', 'quantum computing'],
    rootWords: ['Bloch (surname)', 'sphere (ball)', 'qubit (quantum bit)', 'super- (above)'],
    trending: ['quantum machine learning', 'variational quantum circuits', 'quantum advantage'],
    category: 'quantum-mechanics'
  },
  aes_sbox: {
    name: 'AES S-Box',
    uuhat: 'Substitution box used in the Advanced Encryption Standard - provides cryptographic non-linearity through multiplicative inverse in GF(2⁸)',
    uuhere: 'All modern encrypted communications, HTTPS, disk encryption, VPNs, banking systems worldwide',
    uuho: 'Joan Daemen and Vincent Rijmen created AES (Rijndael) in 1998, selected as NIST standard 2001',
    uuhen: 'DES (1977), AES competition (1997-2000), AES standardization (2001), ubiquitous adoption',
    uuhy: 'Cryptographic non-linearity parallels neural network activation functions - both create complex mappings',
    formula: 'S(x) = A × x⁻¹ + c in GF(2⁸), where A is affine transform matrix',
    keywords: ['AES', 'encryption', 'S-box', 'substitution', 'cryptography'],
    rootWords: ['cipher (code)', 'substitu- (replace)', 'crypto- (hidden)', 'standard (flag)'],
    trending: ['post-quantum AES', 'side-channel resistance', 'hardware encryption'],
    category: 'cryptography'
  },
  sha256_merkle: {
    name: 'SHA-256 Merkle Tree',
    uuhat: 'Hash tree structure where every leaf node is labeled with a cryptographic hash, enabling efficient and secure verification of data integrity',
    uuhere: 'Bitcoin blockchain, Git version control, certificate transparency, file systems (ZFS)',
    uuho: 'Ralph Merkle (1979) invented the tree structure, SHA-256 by NSA (2001), combined in Bitcoin (2008)',
    uuhen: 'Merkle trees (1979), SHA-2 family (2001), Bitcoin whitepaper (2008), blockchain boom (2017)',
    uuhy: 'Merkle proofs enable verifiable computation and zero-knowledge proofs in trustless AI systems',
    formula: 'H(H(leaf₁)||H(leaf₂)) up the tree, with 256-bit hashes',
    keywords: ['SHA256', 'merkle tree', 'hash', 'blockchain', 'verification'],
    rootWords: ['hash (chop)', 'Merkle (surname)', 'tree (branching)', 'crypto- (hidden)'],
    trending: ['blockchain AI', 'zero-knowledge ML', 'verifiable computation'],
    category: 'cryptography'
  },
  flower_of_life: {
    name: 'Flower of Life',
    uuhat: 'Sacred geometric pattern of overlapping circles forming a hexagonal flower pattern - contains Metatron\'s Cube and Platonic solids within it',
    uuhere: 'Ancient temple carvings worldwide, Osirian Temple (Egypt), Forbidden City (China), modern spiritual art',
    uuho: 'Ancient origins unknown (possibly 6000+ years), documented in many independent cultures',
    uuhen: 'Ancient Egypt (possibly 4000 BCE), Da Vinci studies (1500s), New Age revival (1980s)',
    uuhy: 'Tessellation patterns optimize neural network weight initialization and 2D convolution kernels',
    formula: 'Circles of radius r at hexagonal grid points: r×(cos(60°k), sin(60°k))',
    keywords: ['flower of life', 'sacred geometry', 'vesica piscis', 'hexagonal', 'circles'],
    rootWords: ['flower (bloom)', 'vesica (bladder)', 'piscis (fish)', 'sacred (holy)'],
    trending: ['geometric deep learning', 'tessellation networks', 'hexagonal convolutions'],
    category: 'sacred-geometry'
  },
  golden_spiral: {
    name: 'Golden Spiral (Fibonacci)',
    uuhat: 'A logarithmic spiral whose growth factor is the golden ratio φ ≈ 1.618 - appears throughout nature and aesthetics',
    uuhere: 'Nautilus shells, hurricane formation, galaxy arms, sunflower seeds, human ear cochlea',
    uuho: 'Fibonacci introduced the sequence (1202), golden ratio known since Euclid, spiral formalized later',
    uuhen: 'Fibonacci (1202), golden ratio in art (Renaissance), mathematical formalization (1800s)',
    uuhy: 'Golden ratio proportions optimize neural network architectures and image composition algorithms',
    formula: 'r = a × φ^(θ/90°), where φ = (1 + √5)/2 ≈ 1.618',
    keywords: ['golden spiral', 'fibonacci', 'golden ratio', 'logarithmic spiral', 'phi'],
    rootWords: ['aurum (gold)', 'spir- (coil)', 'ratio (reason)', 'log- (proportion)'],
    trending: ['golden ratio AI', 'aesthetic neural networks', 'natural proportion learning'],
    category: 'sacred-geometry'
  },
  wheeler_dewitt_equation: {
    name: 'Wheeler-DeWitt Equation',
    uuhat: 'The quantum equation of the universe - Schrödinger equation for spacetime itself, where time disappears as a fundamental variable',
    uuhere: 'Quantum cosmology, black hole interior models, multiverse theories, quantum gravity research',
    uuho: 'Bryce DeWitt (1967) derived it from John Wheeler\'s quantum gravity program',
    uuhen: 'Wheeler\'s program (1960s), DeWitt formulation (1967), ongoing research in quantum cosmology',
    uuhy: 'Timeless quantum mechanics inspires stateless AI architectures and atemporal reasoning systems',
    formula: 'Ĥ|Ψ⟩ = 0, where Ĥ is the Hamiltonian constraint of general relativity',
    keywords: ['wheeler dewitt', 'quantum cosmology', 'wave function', 'universe', 'timeless'],
    rootWords: ['quant- (amount)', 'cosmo- (universe)', 'wave (undulation)', 'constraint (bind)'],
    trending: ['quantum cosmology AI', 'timeless physics', 'wave function of universe'],
    category: 'quantum-gravity'
  },
  spin_network: {
    name: 'Spin Network',
    uuhat: 'A graph with edges labeled by quantum numbers representing the quantum states of spacetime in loop quantum gravity',
    uuhere: 'Loop quantum gravity research, quantum geometry, Planck-scale physics models',
    uuho: 'Roger Penrose (1971) invented them, Carlo Rovelli and Lee Smolin applied to quantum gravity (1995)',
    uuhen: 'Penrose spin networks (1971), Loop QG application (1995), spin foam evolution (2000s)',
    uuhy: 'Graph neural networks mirror spin network structure - both encode relational information geometrically',
    formula: 'State: |Γ, j_e, i_v⟩ with edges carrying SU(2) representations',
    keywords: ['spin network', 'loop quantum gravity', 'quantum geometry', 'Planck scale'],
    rootWords: ['spin (angular momentum)', 'network (web)', 'loop (closed path)', 'quantum (discrete)'],
    trending: ['graph neural networks', 'quantum gravity AI', 'relational learning'],
    category: 'quantum-gravity'
  },
  shape_of_universe: {
    name: 'Shape of the Universe - Enhanced Multi-Scale Model',
    uuhat: 'The ultimate mathematical visualization synthesizing quantum mechanics, general relativity, consciousness theory, lattice networks, fractal geometry, dark energy dynamics, and temporal field variations into a single coherent cosmic structure. Features 10+ interactive layers from Planck-scale quantum fluctuations to cosmic-scale dark energy expansion.',
    uuhere: 'Theoretical physics research, cosmological modeling, consciousness studies, unified field theory development, educational visualization of cosmic structure, meditation and contemplation aids',
    uuho: 'Developed by UUON Foundation (2024) integrating works of Einstein (relativity), Wheeler-DeWitt (quantum cosmology), Penrose (consciousness), Tegmark (mathematical universe), and various quantum gravity researchers',
    uuhen: 'Big Bang cosmology (1960s), Wheeler-DeWitt equation (1967), Loop Quantum Gravity (1990s), consciousness field theories (2000s), dark energy discovery (1998), UUON unified model (2024)',
    uuhy: 'Modern AI systems process information across multiple scales simultaneously - like consciousness fields interacting with quantum vacuum fluctuations while maintaining cosmic-scale coherence patterns',
    formula: 'Ψ_universe = Σ(cosmic_topology + quantum_fields + lattice_networks + fractal_structure + harmonic_resonance + dark_energy + consciousness_field + temporal_dynamics + unified_fields + dimensional_folding)',
    keywords: ['shape of universe', 'cosmic topology', 'quantum cosmology', 'consciousness field', 'dark energy', 'unified field theory', 'multi-scale physics'],
    rootWords: ['cosmo- (universe)', 'quant- (discrete)', 'conscious- (aware)', 'field (region of influence)', 'topology (shape properties)'],
    trending: ['quantum consciousness AI', 'cosmic neural networks', 'multi-scale field theory', 'universe simulation'],
    category: 'cosmic_topology'
  },
  shape_of_universe_unified: {
    name: 'Shape of the Universe - Unified',
    uuhat: 'The ultimate mathematical visualization synthesizing lattice structures, wave patterns, and energy flow - modulated by the golden ratio',
    uuhere: 'Cosmological research, unified field theory visualization, the signature shape of Δmension platform',
    uuho: 'Created by UUON Foundation as the flagship demonstration of mathematical universe visualization',
    uuhen: 'Developed 2024-2025, synthesizing centuries of mathematical physics into one coherent form',
    uuhy: 'Demonstrates how AI can visualize the most abstract mathematical concepts as tangible 3D objects',
    formula: 'Unified: Quantum + Relativity + Lattice + Wave + Golden Ratio modulation',
    keywords: ['shape of universe', 'unified theory', 'cosmic topology', 'ultimate shape'],
    rootWords: ['uni- (one)', 'verse (turn)', 'cosmos (order)', 'topology (place-study)'],
    trending: ['theory of everything', 'cosmic visualization', 'unified physics AI'],
    category: 'theory-of-everything'
  },
  acas_beacon_attractor: {
    name: 'ACAS Beacon Attractor',
    uuhat: 'An autonomous collective adaptive system beacon - mathematical proof of convergent collective behavior in decentralized systems',
    uuhere: 'Decentralized AI verification, autonomous swarm coordination, trustless consensus mechanisms',
    uuho: 'UUON Foundation (2024) - pioneering mathematical frameworks for autonomous collective intelligence',
    uuhen: 'Developed 2024-2025 as core infrastructure for UUON decentralized verification network',
    uuhy: 'Enables trustless AI coordination, verified autonomous behavior, and mathematical proof of collective convergence',
    formula: 'Attractor dynamics: dx/dt = f(x) + Σᵢ beacon_coupling(xᵢ)',
    keywords: ['ACAS', 'beacon', 'attractor', 'autonomous', 'collective'],
    rootWords: ['beacon (signal fire)', 'attract (draw toward)', 'autonomous (self-law)', 'collective (gather)'],
    trending: ['decentralized AI', 'swarm intelligence', 'trustless verification'],
    category: 'uuon-acas'
  }
};

export function getShapeMetadata(shapeType: string): ShapeMetadata | null {
  const shape = shapeDefinitions[shapeType];
  if (shape) return shape;

  const category = getCategoryForShape(shapeType);
  const catMeta = categoryMetadata[category] || {};

  return {
    name: formatShapeName(shapeType),
    uuhat: `A mathematical ${category.replace('-', ' ')} visualization - part of the Δmension Mathematical Universe library`,
    uuhere: catMeta.uuhere || 'Scientific research, mathematical visualization, educational applications',
    uuho: catMeta.uuho || 'Mathematicians and scientists throughout history, visualized by UUON Foundation',
    uuhen: catMeta.uuhen || 'Classical mathematics to modern computational geometry (ancient to 2025)',
    uuhy: catMeta.uuhy || 'Mathematical visualization powers AI understanding, ML model interpretability, and scientific discovery',
    formula: `Parametric surface: (x(u,v), y(u,v), z(u,v)) with shape-specific equations`,
    keywords: [shapeType, category, 'mathematics', '3D visualization', 'parametric surface'],
    rootWords: catMeta.rootWords || ['math- (learning)', 'geo- (earth)', 'metr- (measure)'],
    trending: catMeta.trending || ['3D visualization', 'mathematical AI', 'geometric deep learning'],
    category
  };
}

function formatShapeName(shapeType: string): string {
  return shapeType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function getCategoryForShape(shapeType: string): string {
  const categoryKeywords: Record<string, string[]> = {
    'cryptography': ['aes', 'sha', 'rsa', 'hash', 'cipher', 'encrypt', 'merkle', 'lattice', 'kyber', 'dilithium'],
    'quantum-mechanics': ['bloch', 'schrodinger', 'quantum', 'wave_function', 'orbital', 'superposition'],
    'quantum-gravity': ['wheeler', 'dewitt', 'spin_network', 'planck', 'loop_quantum', 'ashtekar'],
    'general-relativity': ['schwarzschild', 'einstein', 'kerr', 'metric', 'geodesic', 'spacetime'],
    'topology': ['mobius', 'klein', 'torus', 'knot', 'manifold', 'homeomorphism', 'annulus'],
    'classical-physics': ['newton', 'apple', 'gravity', 'pendulum', 'kepler', 'galileo'],
    '4d-hyperdimensional': ['tesseract', '24_cell', '120_cell', '600_cell', 'hypercube', 'polytope'],
    'fractals': ['mandelbrot', 'julia', 'sierpinski', 'menger', 'koch', 'fractal', 'chaos'],
    'molecular-biology': ['dna', 'protein', 'enzyme', 'ribosome', 'cell', 'membrane', 'mitochondria'],
    'sacred-geometry': ['flower', 'golden', 'fibonacci', 'metatron', 'vesica', 'seed_of_life', 'chakra'],
    'algorithms': ['sort', 'search', 'graph', 'tree', 'optimization', 'complexity'],
    'theory-of-everything': ['string', 'unified', 'shape_of_universe', 'm_theory'],
    'uuon-acas': ['uuon', 'acas', 'beacon']
  };

  const lowerType = shapeType.toLowerCase();
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => lowerType.includes(kw))) {
      return category;
    }
  }
  return 'mathematics';
}

export function generateSEODescription(meta: ShapeMetadata): string {
  return `${meta.name}: ${meta.uuhat.slice(0, 150)}. Explore this ${meta.category.replace('-', ' ')} visualization in 3D. Keywords: ${meta.keywords.slice(0, 5).join(', ')}.`;
}

export function generate5UUsHTML(meta: ShapeMetadata): string {
  return `
    <div class="five-uus">
      <div class="uu-item uu-what">
        <h3>UUhat Is It?</h3>
        <p>${meta.uuhat}</p>
        <div class="root-words">Root words: ${meta.rootWords.join(', ')}</div>
      </div>
      <div class="uu-item uu-where">
        <h3>UUhere Is It Found?</h3>
        <p>${meta.uuhere}</p>
      </div>
      <div class="uu-item uu-who">
        <h3>UUho Discovered It?</h3>
        <p>${meta.uuho}</p>
      </div>
      <div class="uu-item uu-when">
        <h3>UUhen Was It Discovered?</h3>
        <p>${meta.uuhen}</p>
      </div>
      <div class="uu-item uu-why">
        <h3>UUhy Does It Matter for AI/ML?</h3>
        <p>${meta.uuhy}</p>
        <div class="trending">Trending: ${meta.trending.join(' • ')}</div>
      </div>
    </div>
  `;
}

export { categoryMetadata, shapeDefinitions };
