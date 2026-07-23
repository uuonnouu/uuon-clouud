import express from 'express';

const router = express.Router();

export interface SitemapNode {
  id: string;
  type: 'root' | 'category' | 'subcategory' | 'algorithm' | 'engine' | 'asset' | 'endpoint' | 'license' | 'documentation';
  title: string;
  abstractId: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    lastModified: string;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    canonicalUrl: string;
    breadcrumb: string[];
  };
  references?: {
    algorithms?: string[];
    engines?: string[];
    assets?: string[];
    documentation?: string;
  };
  licensing?: {
    tier: string;
    abstractPurchaseInfo: string;
    documentationLink: string;
  };
  endpoint?: {
    method: string;
    inputSchema: Record<string, string>;
    outputSchema: Record<string, string>;
    categoryMapping: string[];
  };
  asset?: {
    type: 'image' | 'video';
    altText: string;
    caption: string;
    previewUrl: string;
  };
  children?: SitemapNode[];
}

const BASE_URL = 'https://uuon.world';

function generateSitemapHierarchy(): SitemapNode {
  const now = new Date().toISOString().split('T')[0];

  return {
    id: 'home',
    type: 'root',
    title: 'Home',
    abstractId: 'ROOT_HOME',
    seo: {
      title: 'Dmension Mathematical Universe - 1356+ Interactive 3D Shapes',
      description: 'Revolutionary mathematical visualization platform with parametric surfaces, fractals, quantum systems, and therapeutic geometry.',
      keywords: ['mathematical visualization', '3D shapes', 'parametric surfaces', 'fractals', 'quantum physics'],
      lastModified: now,
      changeFrequency: 'daily',
      canonicalUrl: BASE_URL,
      breadcrumb: ['Home']
    },
    children: [
      generateCategoriesBranch(now),
      generateApiBranch(now),
      generateProductsBranch(now),
      generateDocumentationBranch(now)
    ]
  };
}

function generateCategoriesBranch(now: string): SitemapNode {
  return {
    id: 'categories',
    type: 'category',
    title: 'Categories',
    abstractId: 'BRANCH_CATEGORIES',
    seo: {
      title: 'Shape Categories - Dmension Mathematical Universe',
      description: 'Explore 87+ categories of mathematical shapes including physics, mathematics, biology, cryptography, and more.',
      keywords: ['shape categories', 'mathematical categories', 'physics shapes', 'geometry'],
      lastModified: now,
      changeFrequency: 'weekly',
      canonicalUrl: `${BASE_URL}/categories`,
      breadcrumb: ['Home', 'Categories']
    },
    children: [
      {
        id: 'physics',
        type: 'subcategory',
        title: 'Physics',
        abstractId: 'CATEGORY_PHYSICS',
        seo: {
          title: 'Physics Visualizations - Quantum, Relativity, Particle Physics',
          description: 'Interactive 3D visualizations of quantum mechanics, general relativity, particle physics, and wave functions.',
          keywords: ['physics visualization', 'quantum mechanics', 'relativity', 'particle physics', 'wave functions'],
          lastModified: now,
          changeFrequency: 'weekly',
          canonicalUrl: `${BASE_URL}/categories/physics`,
          breadcrumb: ['Home', 'Categories', 'Physics']
        },
        children: [
          {
            id: 'physics-algorithms',
            type: 'category',
            title: 'Algorithms',
            abstractId: 'PHYSICS_ALGORITHMS',
            seo: {
              title: 'Physics Algorithms - Mathematical Formulas',
              description: 'Core physics algorithms: Schrödinger equations, wave functions, field equations.',
              keywords: ['physics algorithms', 'schrodinger', 'wave functions'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/physics/algorithms`,
              breadcrumb: ['Home', 'Categories', 'Physics', 'Algorithms']
            },
            children: [
              { id: 'algo-schrodinger', type: 'algorithm', title: 'Schrödinger Equation', abstractId: 'ALGO_SCHRODINGER', seo: { title: 'Schrödinger Equation Visualization', description: 'Interactive 3D visualization of quantum wave functions.', keywords: ['schrodinger', 'quantum', 'wave function'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/schrodinger`, breadcrumb: ['Home', 'Categories', 'Physics', 'Algorithms', 'Schrödinger'] } },
              { id: 'algo-einstein', type: 'algorithm', title: 'Einstein Field Equations', abstractId: 'ALGO_EINSTEIN_FIELD', seo: { title: 'Einstein Field Equations Visualization', description: 'Spacetime curvature and gravitational field visualization.', keywords: ['einstein', 'relativity', 'spacetime'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/einstein-field`, breadcrumb: ['Home', 'Categories', 'Physics', 'Algorithms', 'Einstein Field'] } },
              { id: 'algo-maxwell', type: 'algorithm', title: 'Maxwell Equations', abstractId: 'ALGO_MAXWELL', seo: { title: 'Maxwell Equations Visualization', description: 'Electromagnetic field and wave propagation visualization.', keywords: ['maxwell', 'electromagnetic', 'waves'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/maxwell`, breadcrumb: ['Home', 'Categories', 'Physics', 'Algorithms', 'Maxwell'] } }
            ]
          },
          {
            id: 'physics-engines',
            type: 'category',
            title: 'Engines',
            abstractId: 'PHYSICS_ENGINES',
            seo: {
              title: 'Physics Rendering Engines',
              description: 'Specialized engines for rendering physics simulations.',
              keywords: ['physics engine', 'rendering', 'simulation'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/physics/engines`,
              breadcrumb: ['Home', 'Categories', 'Physics', 'Engines']
            },
            children: [
              { id: 'engine-quantum', type: 'engine', title: 'Quantum Renderer', abstractId: 'ENGINE_QUANTUM', seo: { title: 'Quantum Physics Rendering Engine', description: 'High-performance engine for quantum visualizations.', keywords: ['quantum engine', 'renderer'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/engine/quantum`, breadcrumb: ['Home', 'Categories', 'Physics', 'Engines', 'Quantum'] }, references: { algorithms: ['ALGO_SCHRODINGER', 'ALGO_MAXWELL'] } },
              { id: 'engine-relativity', type: 'engine', title: 'Relativity Engine', abstractId: 'ENGINE_RELATIVITY', seo: { title: 'General Relativity Rendering Engine', description: 'Engine for spacetime and gravitational visualizations including Schwarzschild metric, Kerr black holes, and gravitational waves. Feeds QueensBridge for quantum circuit generation.', keywords: ['relativity engine', 'spacetime', 'schwarzschild', 'gravitational waves', 'einstein'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/engine/relativity`, breadcrumb: ['Home', 'Categories', 'Physics', 'Engines', 'Relativity'] }, references: { algorithms: ['ALGO_EINSTEIN_FIELD', 'ALGO_SCHWARZSCHILD', 'ALGO_GRAVITATIONAL_WAVE'], engines: ['ENGINE_QUEENS_BRIDGE'] } }
            ]
          },
          {
            id: 'physics-assets',
            type: 'category',
            title: 'Assets',
            abstractId: 'PHYSICS_ASSETS',
            seo: {
              title: 'Physics Visual Assets',
              description: 'Images and videos showcasing physics visualizations.',
              keywords: ['physics assets', 'visualizations', 'images'],
              lastModified: now,
              changeFrequency: 'weekly',
              canonicalUrl: `${BASE_URL}/categories/physics/assets`,
              breadcrumb: ['Home', 'Categories', 'Physics', 'Assets']
            },
            children: [
              { id: 'asset-quantum-preview', type: 'asset', title: 'Quantum Wave Preview', abstractId: 'ASSET_QUANTUM_WAVE', seo: { title: 'Quantum Wave Function Preview', description: 'Preview image of quantum wave visualization.', keywords: ['quantum preview', 'wave'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/asset/quantum-wave`, breadcrumb: ['Home', 'Categories', 'Physics', 'Assets', 'Quantum Wave'] }, asset: { type: 'image', altText: 'Quantum wave function visualization', caption: 'Interactive quantum wave function rendered by ENGINE_QUANTUM', previewUrl: '/textures/quantum-preview.jpg' }, references: { engines: ['ENGINE_QUANTUM'] } },
              { id: 'asset-relativity-preview', type: 'asset', title: 'Relativity Spacetime Preview', abstractId: 'ASSET_RELATIVITY_PREVIEW', seo: { title: 'General Relativity Spacetime Visualization Preview', description: 'Preview image of Schwarzschild metric and spacetime curvature visualization.', keywords: ['relativity preview', 'schwarzschild', 'spacetime curvature', 'black hole'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/asset/relativity-spacetime`, breadcrumb: ['Home', 'Categories', 'Physics', 'Assets', 'Relativity Spacetime'] }, asset: { type: 'image', altText: 'Schwarzschild metric spacetime curvature visualization', caption: 'General relativity and gravitational field rendered by ENGINE_RELATIVITY, bridgeable to quantum circuits via ENGINE_QUEENS_BRIDGE', previewUrl: '/textures/relativity-preview.jpg' }, references: { engines: ['ENGINE_RELATIVITY', 'ENGINE_QUEENS_BRIDGE'] } },
              { id: 'asset-blackhole-video', type: 'asset', title: 'Black Hole Animation', abstractId: 'ASSET_BLACKHOLE_VIDEO', seo: { title: 'Black Hole Visualization Video', description: 'Animated visualization of spacetime curvature.', keywords: ['black hole', 'animation'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/asset/blackhole`, breadcrumb: ['Home', 'Categories', 'Physics', 'Assets', 'Black Hole'] }, asset: { type: 'video', altText: 'Black hole spacetime curvature animation', caption: 'Gravitational lensing rendered by ENGINE_RELATIVITY', previewUrl: '/videos/blackhole-preview.mp4' }, references: { engines: ['ENGINE_RELATIVITY'] } }
            ]
          }
        ]
      },
      {
        id: 'mathematics',
        type: 'subcategory',
        title: 'Mathematics',
        abstractId: 'CATEGORY_MATH',
        seo: {
          title: 'Mathematics Visualizations - Geometry, Topology, Fractals',
          description: 'Interactive 3D visualizations of parametric surfaces, fractals, topology, and sacred geometry.',
          keywords: ['mathematics visualization', 'geometry', 'topology', 'fractals', 'sacred geometry'],
          lastModified: now,
          changeFrequency: 'weekly',
          canonicalUrl: `${BASE_URL}/categories/mathematics`,
          breadcrumb: ['Home', 'Categories', 'Mathematics']
        },
        children: [
          {
            id: 'math-algorithms',
            type: 'category',
            title: 'Algorithms',
            abstractId: 'MATH_ALGORITHMS',
            seo: {
              title: 'Mathematical Algorithms',
              description: 'Core mathematical algorithms: fractals, parametric equations, modulo operations.',
              keywords: ['math algorithms', 'fractals', 'parametric'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/mathematics/algorithms`,
              breadcrumb: ['Home', 'Categories', 'Mathematics', 'Algorithms']
            },
            children: [
              { id: 'algo-mandelbrot', type: 'algorithm', title: 'Mandelbrot Set', abstractId: 'ALGO_MANDELBROT', seo: { title: 'Mandelbrot Set Visualization', description: 'Interactive 3D Mandelbrot fractal visualization.', keywords: ['mandelbrot', 'fractal'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/mandelbrot`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Algorithms', 'Mandelbrot'] } },
              { id: 'algo-gmod6', type: 'algorithm', title: 'G Mod 6 Engine', abstractId: 'ALGO_GMOD6', seo: { title: 'G Mod 6 Modulo Algorithm', description: 'Six-state energy ring mathematical model.', keywords: ['gmod6', 'modulo', 'hexagonal'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/gmod6`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Algorithms', 'G Mod 6'] } },
              { id: 'algo-fibonacci', type: 'algorithm', title: 'Fibonacci Spiral', abstractId: 'ALGO_FIBONACCI', seo: { title: 'Fibonacci Spiral Visualization', description: 'Golden ratio spiral and Fibonacci sequence visualization.', keywords: ['fibonacci', 'golden ratio', 'spiral'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/fibonacci`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Algorithms', 'Fibonacci'] } }
            ]
          },
          {
            id: 'math-engines',
            type: 'category',
            title: 'Engines',
            abstractId: 'MATH_ENGINES',
            seo: {
              title: 'Mathematical Rendering Engines',
              description: 'Specialized engines for mathematical visualizations.',
              keywords: ['math engine', 'fractal renderer'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/mathematics/engines`,
              breadcrumb: ['Home', 'Categories', 'Mathematics', 'Engines']
            },
            children: [
              { id: 'engine-fractal', type: 'engine', title: 'Fractal Engine', abstractId: 'ENGINE_FRACTAL', seo: { title: 'Fractal Rendering Engine', description: 'High-performance fractal generation and rendering.', keywords: ['fractal engine', 'mandelbrot'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/engine/fractal`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Engines', 'Fractal'] }, references: { algorithms: ['ALGO_MANDELBROT', 'ALGO_FIBONACCI'] } },
              { id: 'engine-modulo', type: 'engine', title: 'Modulo Engine', abstractId: 'ENGINE_MODULO', seo: { title: 'Modulo Algorithm Engine', description: '150 modulo algorithms for cyclic mathematical patterns.', keywords: ['modulo engine', 'gmod6'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/engine/modulo`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Engines', 'Modulo'] }, references: { algorithms: ['ALGO_GMOD6'] } }
            ]
          },
          {
            id: 'math-assets',
            type: 'category',
            title: 'Assets',
            abstractId: 'MATH_ASSETS',
            seo: {
              title: 'Mathematics Visual Assets',
              description: 'Images and videos showcasing mathematical visualizations.',
              keywords: ['math assets', 'fractal images'],
              lastModified: now,
              changeFrequency: 'weekly',
              canonicalUrl: `${BASE_URL}/categories/mathematics/assets`,
              breadcrumb: ['Home', 'Categories', 'Mathematics', 'Assets']
            },
            children: [
              { id: 'asset-fractal-preview', type: 'asset', title: 'Fractal Gallery', abstractId: 'ASSET_FRACTAL_GALLERY', seo: { title: 'Fractal Visualization Gallery', description: 'Collection of fractal visualization previews.', keywords: ['fractal gallery'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/asset/fractal-gallery`, breadcrumb: ['Home', 'Categories', 'Mathematics', 'Assets', 'Fractal Gallery'] }, asset: { type: 'image', altText: 'Mandelbrot and Julia set fractals', caption: 'High-resolution fractals rendered by ENGINE_FRACTAL', previewUrl: '/textures/fractal-preview.jpg' }, references: { engines: ['ENGINE_FRACTAL'] } }
            ]
          }
        ]
      },
      {
        id: 'cryptography',
        type: 'subcategory',
        title: 'Cryptography',
        abstractId: 'CATEGORY_CRYPTO',
        seo: {
          title: 'Cryptography Visualizations - AES, RSA, Elliptic Curves',
          description: 'Interactive 3D visualizations of cryptographic algorithms and security systems.',
          keywords: ['cryptography visualization', 'AES', 'RSA', 'elliptic curves'],
          lastModified: now,
          changeFrequency: 'weekly',
          canonicalUrl: `${BASE_URL}/categories/cryptography`,
          breadcrumb: ['Home', 'Categories', 'Cryptography']
        },
        children: [
          {
            id: 'crypto-algorithms',
            type: 'category',
            title: 'Algorithms',
            abstractId: 'CRYPTO_ALGORITHMS',
            seo: {
              title: 'Cryptographic Algorithms',
              description: 'Core cryptographic algorithm visualizations.',
              keywords: ['crypto algorithms', 'encryption'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/cryptography/algorithms`,
              breadcrumb: ['Home', 'Categories', 'Cryptography', 'Algorithms']
            },
            children: [
              { id: 'algo-aes', type: 'algorithm', title: 'AES Encryption', abstractId: 'ALGO_AES', seo: { title: 'AES Encryption Visualization', description: 'Advanced Encryption Standard block cipher visualization.', keywords: ['aes', 'encryption'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/aes`, breadcrumb: ['Home', 'Categories', 'Cryptography', 'Algorithms', 'AES'] } },
              { id: 'algo-rsa', type: 'algorithm', title: 'RSA Encryption', abstractId: 'ALGO_RSA', seo: { title: 'RSA Public Key Visualization', description: 'RSA public key cryptography visualization.', keywords: ['rsa', 'public key'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/rsa`, breadcrumb: ['Home', 'Categories', 'Cryptography', 'Algorithms', 'RSA'] } },
              { id: 'algo-ecc', type: 'algorithm', title: 'Elliptic Curve', abstractId: 'ALGO_ECC', seo: { title: 'Elliptic Curve Cryptography', description: 'ECC point multiplication visualization.', keywords: ['elliptic curve', 'ecc'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/ecc`, breadcrumb: ['Home', 'Categories', 'Cryptography', 'Algorithms', 'ECC'] } }
            ]
          }
        ]
      },
      {
        id: 'ai-ml',
        type: 'subcategory',
        title: 'AI & Machine Learning',
        abstractId: 'CATEGORY_AI_ML',
        seo: {
          title: 'AI/ML Visualizations - Neural Networks, Transformers',
          description: 'Interactive 3D visualizations of neural networks, attention mechanisms, and ML algorithms.',
          keywords: ['AI visualization', 'neural networks', 'transformers', 'machine learning'],
          lastModified: now,
          changeFrequency: 'weekly',
          canonicalUrl: `${BASE_URL}/categories/ai-ml`,
          breadcrumb: ['Home', 'Categories', 'AI & ML']
        },
        children: [
          {
            id: 'aiml-algorithms',
            type: 'category',
            title: 'Algorithms',
            abstractId: 'AIML_ALGORITHMS',
            seo: {
              title: 'AI/ML Algorithms',
              description: 'Neural network and machine learning algorithm visualizations.',
              keywords: ['ai algorithms', 'neural networks'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/ai-ml/algorithms`,
              breadcrumb: ['Home', 'Categories', 'AI & ML', 'Algorithms']
            },
            children: [
              { id: 'algo-transformer', type: 'algorithm', title: 'Transformer Attention', abstractId: 'ALGO_TRANSFORMER', seo: { title: 'Transformer Attention Visualization', description: 'Multi-head attention mechanism visualization.', keywords: ['transformer', 'attention'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/transformer`, breadcrumb: ['Home', 'Categories', 'AI & ML', 'Algorithms', 'Transformer'] } },
              { id: 'algo-cnn', type: 'algorithm', title: 'CNN Layers', abstractId: 'ALGO_CNN', seo: { title: 'Convolutional Neural Network', description: 'CNN layer and filter visualization.', keywords: ['cnn', 'convolutional'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/cnn`, breadcrumb: ['Home', 'Categories', 'AI & ML', 'Algorithms', 'CNN'] } }
            ]
          }
        ]
      },
      {
        id: 'dna-molecular',
        type: 'subcategory',
        title: 'DNA & Molecular Biology',
        abstractId: 'CATEGORY_DNA',
        seo: {
          title: 'DNA Molecular Structures - 56 Research-Grade 3D Models',
          description: 'Interactive 3D visualizations of DNA, RNA, CRISPR-Cas9, chromosomes, and 2026 nanotechnology structures.',
          keywords: ['DNA visualization', 'molecular biology', 'CRISPR', 'RNA', 'chromosomes', 'nanotechnology', 'double helix'],
          lastModified: now,
          changeFrequency: 'weekly',
          canonicalUrl: `${BASE_URL}/categories/dna`,
          breadcrumb: ['Home', 'Categories', 'DNA & Molecular Biology']
        },
        children: [
          {
            id: 'dna-structures',
            type: 'category',
            title: 'DNA Structures',
            abstractId: 'DNA_STRUCTURES',
            seo: {
              title: 'DNA Structure Library - 56 Parametric Models',
              description: 'Research-grade 3D DNA structures: B-form, A-form, Z-form helices, base pairs, and higher-order structures.',
              keywords: ['DNA structures', 'double helix', 'B-DNA', 'A-DNA', 'Z-DNA'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/dna/structures`,
              breadcrumb: ['Home', 'Categories', 'DNA', 'Structures']
            },
            children: [
              { id: 'dna-double-helix', type: 'algorithm', title: 'DNA Double Helix', abstractId: 'ALGO_DNA_HELIX', seo: { title: 'DNA Double Helix Visualization', description: 'Classic Watson-Crick B-form DNA double helix with 10.5 bp/turn accuracy.', keywords: ['DNA helix', 'double helix', 'Watson-Crick'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/dna-helix`, breadcrumb: ['Home', 'Categories', 'DNA', 'Structures', 'Double Helix'] } },
              { id: 'dna-base-pairs', type: 'algorithm', title: 'Base Pairs (A-T, G-C)', abstractId: 'ALGO_BASE_PAIRS', seo: { title: 'DNA Base Pair Visualization', description: 'Adenine-Thymine and Guanine-Cytosine hydrogen bonding visualization.', keywords: ['base pairs', 'adenine', 'thymine', 'guanine', 'cytosine'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/base-pairs`, breadcrumb: ['Home', 'Categories', 'DNA', 'Structures', 'Base Pairs'] } },
              { id: 'dna-chromatin', type: 'algorithm', title: 'Chromatin Fiber', abstractId: 'ALGO_CHROMATIN', seo: { title: 'Chromatin Fiber Visualization', description: 'Higher-order DNA packaging with nucleosome arrays.', keywords: ['chromatin', 'nucleosome', 'histone'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/chromatin`, breadcrumb: ['Home', 'Categories', 'DNA', 'Structures', 'Chromatin'] } },
              { id: 'dna-g-quadruplex', type: 'algorithm', title: 'G-Quadruplex', abstractId: 'ALGO_G_QUADRUPLEX', seo: { title: 'G-Quadruplex DNA Visualization', description: 'Four-stranded guanine-rich DNA structure visualization.', keywords: ['G-quadruplex', 'telomere', 'guanine'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/g-quadruplex`, breadcrumb: ['Home', 'Categories', 'DNA', 'Structures', 'G-Quadruplex'] } }
            ]
          },
          {
            id: 'rna-structures',
            type: 'category',
            title: 'RNA Structures',
            abstractId: 'RNA_STRUCTURES',
            seo: {
              title: 'RNA Structure Library - tRNA, mRNA, rRNA',
              description: 'Interactive 3D RNA structures including transfer RNA, messenger RNA, and ribosomal RNA.',
              keywords: ['RNA structures', 'tRNA', 'mRNA', 'rRNA', 'microRNA'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/dna/rna`,
              breadcrumb: ['Home', 'Categories', 'DNA', 'RNA']
            },
            children: [
              { id: 'rna-trna', type: 'algorithm', title: 'tRNA Cloverleaf', abstractId: 'ALGO_TRNA', seo: { title: 'tRNA Cloverleaf Visualization', description: 'Transfer RNA 3D structure with anticodon loop.', keywords: ['tRNA', 'transfer RNA', 'anticodon'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/trna`, breadcrumb: ['Home', 'Categories', 'DNA', 'RNA', 'tRNA'] } },
              { id: 'rna-mrna', type: 'algorithm', title: 'mRNA Strand', abstractId: 'ALGO_MRNA', seo: { title: 'mRNA Strand Visualization', description: 'Messenger RNA structure with codons.', keywords: ['mRNA', 'messenger RNA', 'codons'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/mrna`, breadcrumb: ['Home', 'Categories', 'DNA', 'RNA', 'mRNA'] } },
              { id: 'rna-microrna', type: 'algorithm', title: 'microRNA', abstractId: 'ALGO_MICRORNA', seo: { title: 'microRNA Visualization', description: 'Small regulatory RNA structure.', keywords: ['microRNA', 'miRNA', 'gene regulation'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/microrna`, breadcrumb: ['Home', 'Categories', 'DNA', 'RNA', 'microRNA'] } }
            ]
          },
          {
            id: 'dna-machinery',
            type: 'category',
            title: 'DNA/RNA Machinery',
            abstractId: 'DNA_MACHINERY',
            seo: {
              title: 'DNA/RNA Machinery - CRISPR, Polymerases, Spliceosomes',
              description: 'Molecular machines that process DNA and RNA including CRISPR-Cas9, polymerases, and spliceosomes.',
              keywords: ['CRISPR', 'Cas9', 'polymerase', 'spliceosome', 'replication fork'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/dna/machinery`,
              breadcrumb: ['Home', 'Categories', 'DNA', 'Machinery']
            },
            children: [
              { id: 'dna-crispr', type: 'algorithm', title: 'CRISPR-Cas9', abstractId: 'ALGO_CRISPR', seo: { title: 'CRISPR-Cas9 Gene Editing Visualization', description: 'CRISPR-Cas9 gene editing complex with guide RNA.', keywords: ['CRISPR', 'Cas9', 'gene editing', 'guide RNA'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/crispr`, breadcrumb: ['Home', 'Categories', 'DNA', 'Machinery', 'CRISPR'] } },
              { id: 'dna-replication-fork', type: 'algorithm', title: 'Replication Fork', abstractId: 'ALGO_REPLICATION_FORK', seo: { title: 'DNA Replication Fork Visualization', description: 'Active DNA replication with leading and lagging strands.', keywords: ['replication fork', 'DNA replication', 'helicase'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/replication-fork`, breadcrumb: ['Home', 'Categories', 'DNA', 'Machinery', 'Replication Fork'] } },
              { id: 'dna-spliceosome', type: 'algorithm', title: 'Spliceosome', abstractId: 'ALGO_SPLICEOSOME', seo: { title: 'Spliceosome Visualization', description: 'RNA splicing complex removing introns.', keywords: ['spliceosome', 'RNA splicing', 'introns'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/spliceosome`, breadcrumb: ['Home', 'Categories', 'DNA', 'Machinery', 'Spliceosome'] } }
            ]
          },
          {
            id: 'dna-nanotechnology',
            type: 'category',
            title: '2026 DNA Nanotechnology',
            abstractId: 'DNA_NANOTECH',
            seo: {
              title: '2026 DNA Nanotechnology - Digital Storage, Nanobots, Origami',
              description: 'Cutting-edge DNA nanotechnology structures for digital storage, nanomedicine, and molecular computing.',
              keywords: ['DNA nanotechnology', 'DNA origami', 'nanobots', 'DNA storage', 'nanomedicine'],
              lastModified: now,
              changeFrequency: 'weekly',
              canonicalUrl: `${BASE_URL}/categories/dna/nanotechnology`,
              breadcrumb: ['Home', 'Categories', 'DNA', 'Nanotechnology']
            },
            children: [
              { id: 'dna-digital-storage', type: 'algorithm', title: 'DNA Digital Storage', abstractId: 'ALGO_DNA_STORAGE', seo: { title: 'DNA Digital Data Storage Visualization', description: 'DNA-based data storage encoding binary information in nucleotide sequences.', keywords: ['DNA storage', 'data storage', 'digital DNA'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/dna-storage`, breadcrumb: ['Home', 'Categories', 'DNA', 'Nanotechnology', 'Digital Storage'] } },
              { id: 'dna-nanobot', type: 'algorithm', title: 'DNA Nanobot', abstractId: 'ALGO_DNA_NANOBOT', seo: { title: 'DNA Nanobot Visualization', description: 'Programmable DNA nanorobot for targeted drug delivery.', keywords: ['DNA nanobot', 'nanomedicine', 'drug delivery'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/dna-nanobot`, breadcrumb: ['Home', 'Categories', 'DNA', 'Nanotechnology', 'Nanobot'] } },
              { id: 'dna-origami', type: 'algorithm', title: 'DNA Origami', abstractId: 'ALGO_DNA_ORIGAMI', seo: { title: 'DNA Origami Visualization', description: 'Self-assembling DNA nanostructures with designed shapes.', keywords: ['DNA origami', 'nanostructures', 'self-assembly'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/dna-origami`, breadcrumb: ['Home', 'Categories', 'DNA', 'Nanotechnology', 'Origami'] } },
              { id: 'dna-walking-motor', type: 'algorithm', title: 'DNA Walking Motor', abstractId: 'ALGO_DNA_MOTOR', seo: { title: 'DNA Walking Motor Visualization', description: 'Molecular motor that walks along DNA tracks.', keywords: ['DNA motor', 'molecular motor', 'nanotechnology'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/dna-motor`, breadcrumb: ['Home', 'Categories', 'DNA', 'Nanotechnology', 'Walking Motor'] } }
            ]
          },
          {
            id: 'dna-chromosomal',
            type: 'category',
            title: 'Chromosomal Structures',
            abstractId: 'DNA_CHROMOSOMAL',
            seo: {
              title: 'Chromosomal Structures - Metaphase, Telomeres, Centromeres',
              description: 'Large-scale chromosomal organization including metaphase chromosomes, telomeres, and centromeres.',
              keywords: ['chromosomes', 'metaphase', 'telomere', 'centromere', 'TAD'],
              lastModified: now,
              changeFrequency: 'monthly',
              canonicalUrl: `${BASE_URL}/categories/dna/chromosomal`,
              breadcrumb: ['Home', 'Categories', 'DNA', 'Chromosomal']
            },
            children: [
              { id: 'dna-metaphase', type: 'algorithm', title: 'Metaphase Chromosome', abstractId: 'ALGO_METAPHASE', seo: { title: 'Metaphase Chromosome Visualization', description: 'Fully condensed chromosome during cell division.', keywords: ['metaphase', 'chromosome', 'cell division'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/metaphase`, breadcrumb: ['Home', 'Categories', 'DNA', 'Chromosomal', 'Metaphase'] } },
              { id: 'dna-telomere', type: 'algorithm', title: 'Telomere', abstractId: 'ALGO_TELOMERE', seo: { title: 'Telomere Visualization', description: 'Protective chromosome end caps with TTAGGG repeats.', keywords: ['telomere', 'chromosome ends', 'aging'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/telomere`, breadcrumb: ['Home', 'Categories', 'DNA', 'Chromosomal', 'Telomere'] } },
              { id: 'dna-tad', type: 'algorithm', title: 'Topological Domain (TAD)', abstractId: 'ALGO_TAD', seo: { title: 'Topologically Associating Domain Visualization', description: 'TAD chromosomal organization and 3D genome architecture.', keywords: ['TAD', 'topological domain', '3D genome', 'chromatin'], lastModified: now, changeFrequency: 'monthly', canonicalUrl: `${BASE_URL}/algorithm/tad`, breadcrumb: ['Home', 'Categories', 'DNA', 'Chromosomal', 'TAD'] } }
            ]
          }
        ]
      }
    ]
  };
}

function generateApiBranch(now: string): SitemapNode {
  return {
    id: 'api',
    type: 'category',
    title: 'API',
    abstractId: 'BRANCH_API',
    seo: {
      title: 'API Endpoints - Dmension Mathematical Universe',
      description: 'RESTful API endpoints for shape generation, computation, and export.',
      keywords: ['api', 'endpoints', 'rest', 'shape generation'],
      lastModified: now,
      changeFrequency: 'monthly',
      canonicalUrl: `${BASE_URL}/api`,
      breadcrumb: ['Home', 'API']
    },
    children: [
      {
        id: 'endpoint-shapes',
        type: 'endpoint',
        title: 'Shape Generation',
        abstractId: 'ENDPOINT_SHAPES',
        seo: {
          title: 'Shape Generation API',
          description: 'Generate parametric 3D shapes via API.',
          keywords: ['shape api', 'generation'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/api/shapes`,
          breadcrumb: ['Home', 'API', 'Shapes']
        },
        endpoint: {
          method: 'POST',
          inputSchema: { shapeType: 'string', parameters: 'object' },
          outputSchema: { geometry: 'BufferGeometry', metadata: 'object' },
          categoryMapping: ['CATEGORY_MATH', 'CATEGORY_PHYSICS']
        }
      },
      {
        id: 'endpoint-export',
        type: 'endpoint',
        title: 'GLB Export',
        abstractId: 'ENDPOINT_EXPORT',
        seo: {
          title: 'GLB Export API',
          description: 'Export shapes to GLB format with UV coordinates.',
          keywords: ['glb export', '3d export'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/api/export`,
          breadcrumb: ['Home', 'API', 'Export']
        },
        endpoint: {
          method: 'POST',
          inputSchema: { shapeId: 'string', options: 'ExportOptions' },
          outputSchema: { glbData: 'ArrayBuffer', filename: 'string' },
          categoryMapping: ['ENGINE_FRACTAL', 'ENGINE_QUANTUM']
        }
      },
      {
        id: 'endpoint-compute',
        type: 'endpoint',
        title: 'Secure Compute',
        abstractId: 'ENDPOINT_COMPUTE',
        seo: {
          title: 'Secure Compute API',
          description: 'Server-side shape computation for proprietary algorithms.',
          keywords: ['secure compute', 'server-side'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/api/compute`,
          breadcrumb: ['Home', 'API', 'Compute']
        },
        endpoint: {
          method: 'POST',
          inputSchema: { algorithmId: 'string', params: 'object' },
          outputSchema: { vertices: 'Float32Array', normals: 'Float32Array' },
          categoryMapping: ['ALGO_SCHRODINGER', 'ALGO_EINSTEIN_FIELD']
        }
      }
    ]
  };
}

function generateProductsBranch(now: string): SitemapNode {
  return {
    id: 'products',
    type: 'category',
    title: 'Products & Licensing',
    abstractId: 'BRANCH_PRODUCTS',
    seo: {
      title: 'Products & Licensing - Dmension',
      description: 'Commercial licenses for engines, algorithms, and enterprise features.',
      keywords: ['licensing', 'products', 'enterprise'],
      lastModified: now,
      changeFrequency: 'monthly',
      canonicalUrl: `${BASE_URL}/products`,
      breadcrumb: ['Home', 'Products & Licensing']
    },
    children: [
      {
        id: 'license-quantum',
        type: 'license',
        title: 'Quantum Engine License',
        abstractId: 'LICENSE_QUANTUM',
        seo: {
          title: 'Quantum Engine Commercial License',
          description: 'Commercial license for quantum physics visualization engine.',
          keywords: ['quantum license', 'commercial'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/products/quantum-license`,
          breadcrumb: ['Home', 'Products & Licensing', 'Quantum Engine']
        },
        licensing: {
          tier: 'Enterprise',
          abstractPurchaseInfo: 'Contact sales for enterprise pricing',
          documentationLink: '/docs/quantum-engine'
        },
        references: { engines: ['ENGINE_QUANTUM'] }
      },
      {
        id: 'license-fractal',
        type: 'license',
        title: 'Fractal Engine License',
        abstractId: 'LICENSE_FRACTAL',
        seo: {
          title: 'Fractal Engine Commercial License',
          description: 'Commercial license for fractal generation engine.',
          keywords: ['fractal license', 'commercial'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/products/fractal-license`,
          breadcrumb: ['Home', 'Products & Licensing', 'Fractal Engine']
        },
        licensing: {
          tier: 'Professional',
          abstractPurchaseInfo: 'Monthly or annual subscription available',
          documentationLink: '/docs/fractal-engine'
        },
        references: { engines: ['ENGINE_FRACTAL'] }
      },
      {
        id: 'license-modulo',
        type: 'license',
        title: 'Modulo Engine License',
        abstractId: 'LICENSE_MODULO',
        seo: {
          title: 'Modulo Engine Commercial License',
          description: 'Commercial license for 150 modulo algorithms.',
          keywords: ['modulo license', 'gmod6'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/products/modulo-license`,
          breadcrumb: ['Home', 'Products & Licensing', 'Modulo Engine']
        },
        licensing: {
          tier: 'Standard',
          abstractPurchaseInfo: 'One-time purchase or subscription',
          documentationLink: '/docs/modulo-engine'
        },
        references: { engines: ['ENGINE_MODULO'] }
      },
      {
        id: 'license-relativity',
        type: 'license',
        title: 'Relativity Engine License',
        abstractId: 'LICENSE_RELATIVITY',
        seo: {
          title: 'Relativity Engine Commercial License',
          description: 'Commercial license for general relativity and spacetime visualization engine. Includes Schwarzschild metric, Kerr black holes, Einstein field equations, gravitational waves, and QueensBridge quantum circuit export.',
          keywords: ['relativity license', 'general relativity', 'spacetime', 'schwarzschild', 'gravitational waves', 'commercial'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/products/relativity-license`,
          breadcrumb: ['Home', 'Products & Licensing', 'Relativity Engine']
        },
        licensing: {
          tier: 'Professional',
          abstractPurchaseInfo: 'Monthly or annual subscription available',
          documentationLink: '/docs/relativity-engine'
        },
        references: { engines: ['ENGINE_RELATIVITY'] }
      }
    ]
  };
}

function generateDocumentationBranch(now: string): SitemapNode {
  return {
    id: 'documentation',
    type: 'category',
    title: 'Documentation',
    abstractId: 'BRANCH_DOCS',
    seo: {
      title: 'Documentation - Dmension Mathematical Universe',
      description: 'Complete documentation for categories, APIs, and engines.',
      keywords: ['documentation', 'docs', 'guides'],
      lastModified: now,
      changeFrequency: 'weekly',
      canonicalUrl: `${BASE_URL}/docs`,
      breadcrumb: ['Home', 'Documentation']
    },
    children: [
      {
        id: 'docs-physics',
        type: 'documentation',
        title: 'Physics Documentation',
        abstractId: 'DOCS_PHYSICS',
        seo: {
          title: 'Physics Category Documentation',
          description: 'Complete guide to physics visualizations and engines.',
          keywords: ['physics docs', 'quantum guide'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/physics`,
          breadcrumb: ['Home', 'Documentation', 'Physics']
        },
        references: { documentation: 'CATEGORY_PHYSICS' }
      },
      {
        id: 'docs-relativity',
        type: 'documentation',
        title: 'Relativity Engine Documentation',
        abstractId: 'DOCS_RELATIVITY',
        seo: {
          title: 'Relativity Engine Documentation - Dmension',
          description: 'Complete guide to the General Relativity visualization engine: Schwarzschild metric, Kerr black holes, Einstein field equations, gravitational waves, and QueensBridge quantum circuit export.',
          keywords: ['relativity docs', 'schwarzschild guide', 'general relativity engine', 'queensbridge', 'quantum circuit'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/relativity-engine`,
          breadcrumb: ['Home', 'Documentation', 'Relativity Engine']
        },
        references: { documentation: 'ENGINE_RELATIVITY' }
      },
      {
        id: 'docs-mathematics',
        type: 'documentation',
        title: 'Mathematics Documentation',
        abstractId: 'DOCS_MATH',
        seo: {
          title: 'Mathematics Category Documentation',
          description: 'Complete guide to mathematical visualizations and fractals.',
          keywords: ['math docs', 'fractal guide'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/mathematics`,
          breadcrumb: ['Home', 'Documentation', 'Mathematics']
        },
        references: { documentation: 'CATEGORY_MATH' }
      },
      {
        id: 'docs-api',
        type: 'documentation',
        title: 'API Documentation',
        abstractId: 'DOCS_API',
        seo: {
          title: 'API Reference Documentation',
          description: 'Complete API reference for all endpoints.',
          keywords: ['api docs', 'api reference'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/api`,
          breadcrumb: ['Home', 'Documentation', 'API']
        },
        references: { documentation: 'BRANCH_API' }
      },
      {
        id: 'docs-founder',
        type: 'documentation',
        title: 'Founder Profile',
        abstractId: 'DOCS_FOUNDER',
        seo: {
          title: 'Phillip Aguilar Ruiz III - UUON Foundation Founder',
          description: 'Complete profile of the founder and CEO of UUON Foundation Inc., Mathematical Universe Architect.',
          keywords: ['founder', 'UUON Foundation', 'Phillip Aguilar Ruiz', 'mathematical universe', 'CEO'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/founder`,
          breadcrumb: ['Home', 'Documentation', 'Founder']
        },
        references: { documentation: 'FOUNDER_PROFILE' }
      },
      {
        id: 'docs-about',
        type: 'documentation',
        title: 'About UUON Foundation',
        abstractId: 'DOCS_ABOUT',
        seo: {
          title: 'About UUON Foundation Inc.',
          description: 'Learn about UUON Foundation Inc. - Universally United Obscured Node - the company behind Dmension Mathematical Universe.',
          keywords: ['UUON Foundation', 'about', 'company', 'mission', 'vision'],
          lastModified: now,
          changeFrequency: 'monthly',
          canonicalUrl: `${BASE_URL}/docs/about`,
          breadcrumb: ['Home', 'Documentation', 'About']
        },
        references: { documentation: 'ABOUT_UUON' }
      }
    ]
  };
}

router.get('/', (req, res) => {
  try {
    const hierarchy = generateSitemapHierarchy();
    res.json({
      success: true,
      hierarchy,
      meta: {
        totalNodes: countNodes(hierarchy),
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap hierarchy'
    });
  }
});

function countNodes(node: SitemapNode): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

export { router as sitemapHierarchyRouter };
