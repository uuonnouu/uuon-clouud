
import { Router } from 'express';
import { dbLoader } from '../database-loader';

const router = Router();

// Individual shape page route
router.get('/shape/:shapeType', async (req, res) => {
  try {
    const { shapeType } = req.params;
    
    // Get shape data from database
    const formula = await dbLoader.getShapeFormula(shapeType);
    const presets = await dbLoader.getShapePresets(shapeType);
    const metadata = await dbLoader.getShapeMetadata(shapeType);
    
    if (!formula) {
      return res.status(404).json({ 
        error: 'Shape not found',
        availableShapes: await dbLoader.getAllShapeTypes()
      });
    }

    // Generate static shape page HTML
    const shapePageHTML = generateShapePageHTML({
      shapeType,
      formula,
      presets,
      metadata
    });

    res.send(shapePageHTML);
  } catch (error) {
    console.error('Error serving shape page:', error);
    res.status(500).json({ error: 'Failed to load shape page' });
  }
});

// API endpoint for shape data
router.get('/api/shape-data/:shapeType', async (req, res) => {
  try {
    const { shapeType } = req.params;
    
    const [formula, presets, metadata, defaults] = await Promise.all([
      dbLoader.getShapeFormula(shapeType),
      dbLoader.getShapePresets(shapeType),
      dbLoader.getShapeMetadata(shapeType),
      dbLoader.getShapeDefaults(shapeType)
    ]);

    if (!formula) {
      return res.status(404).json({ error: 'Shape not found' });
    }

    res.json({
      success: true,
      shape: {
        type: shapeType,
        name: formula.formula_name,
        category: formula.category,
        description: formula.implementation_notes,
        equation: {
          x: formula.equation_x_formula,
          y: formula.equation_y_formula,
          z: formula.equation_z_formula
        },
        defaults,
        presets,
        metadata,
        complexity: formula.complexity_score,
        therapeutic: formula.therapeutic_classification
      }
    });
  } catch (error) {
    console.error('Error getting shape data:', error);
    res.status(500).json({ error: 'Failed to get shape data' });
  }
});

// Omni-Proofs page route
router.get('/proofs', async (req, res) => {
  try {
    const allFormulas = await dbLoader.getAllFormulas();
    
    // Group by category
    const categories: Record<string, any[]> = {};
    allFormulas.forEach(formula => {
      if (!categories[formula.category]) {
        categories[formula.category] = [];
      }
      categories[formula.category].push(formula);
    });

    const proofCategories = [
      { name: 'cryptography', displayName: 'Cryptographic Proofs', icon: '🔐' },
      { name: 'algorithms', displayName: 'Algorithm Verification', icon: '🧠' },
      { name: 'quantum-mechanics', displayName: 'Quantum Proofs', icon: '⚛️' },
      { name: 'quantum-gravity', displayName: 'Quantum Gravity Proofs', icon: '∞' },
      { name: 'general-relativity', displayName: 'Relativistic Proofs', icon: '🌌' },
      { name: 'theory-of-everything', displayName: 'Unification Proofs', icon: '⚡' },
      { name: 'topology', displayName: 'Topological Proofs', icon: '📦' },
      { name: '4d-hyperdimensional', displayName: 'Higher-Dimensional Proofs', icon: '⭐' },
      { name: 'fractals', displayName: 'Fractal & Chaos Proofs', icon: '🔬' },
      { name: 'molecular-biology', displayName: 'Biological Proofs', icon: '🧬' },
      { name: 'sacred-geometry', displayName: 'Sacred Geometry Proofs', icon: '🛡️' },
      { name: 'uuon-acas', displayName: 'UUON-ACAS Verification', icon: '📡' }
    ];

    const totalProofs = Object.values(categories).reduce((sum, arr) => sum + arr.length, 0);

    const html = generateOmniProofsPageHTML(proofCategories, categories, totalProofs);
    res.send(html);
  } catch (error) {
    console.error('Error serving proofs page:', error);
    res.status(500).json({ error: 'Failed to load proofs page' });
  }
});

// Proof category page
router.get('/proofs/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const formulas = await dbLoader.getShapesByCategory(category);
    
    if (!formulas || formulas.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const html = generateProofCategoryPageHTML(category, formulas);
    res.send(html);
  } catch (error) {
    console.error('Error serving proof category page:', error);
    res.status(500).json({ error: 'Failed to load proof category page' });
  }
});

// Individual proof page (alias for shape page)
router.get('/proof/:shapeType', async (req, res) => {
  req.params.shapeType = req.params.shapeType;
  const { shapeType } = req.params;
  
  try {
    const formula = await dbLoader.getShapeFormula(shapeType);
    const presets = await dbLoader.getShapePresets(shapeType);
    const metadata = await dbLoader.getShapeMetadata(shapeType);
    
    if (!formula) {
      return res.status(404).json({ error: 'Proof not found' });
    }

    const shapePageHTML = generateShapePageHTML({ shapeType, formula, presets, metadata });
    res.send(shapePageHTML);
  } catch (error) {
    console.error('Error serving proof page:', error);
    res.status(500).json({ error: 'Failed to load proof page' });
  }
});

// Generate all shape URLs for sitemap
router.get('/api/shape-urls', async (req, res) => {
  try {
    const allShapes = await dbLoader.getAllFormulas();
    const shapeUrls = allShapes.map(shape => ({
      url: `/shape/${shape.shape_type}`,
      name: shape.formula_name,
      category: shape.category,
      lastModified: shape.updated_at
    }));

    res.json({
      success: true,
      count: shapeUrls.length,
      shapes: shapeUrls
    });
  } catch (error) {
    console.error('Error getting shape URLs:', error);
    res.status(500).json({ error: 'Failed to get shape URLs' });
  }
});

function getShapeMetadata(shapeType: string, category: string) {
  const categoryMeta: Record<string, any> = {
    'sacred-geometry': {
      uuhere: 'Found in ancient temples, religious architecture, natural formations, DNA helices, galaxy spirals, and flower petals',
      uuhen: 'Studied since ancient Egypt and Greece (3000 BCE), formalized by Pythagoras, applied in Renaissance art',
      uuhy: 'Sacred proportions optimize neural network architectures, compression algorithms, and aesthetic AI systems',
      trending: ['sacred geometry AI', 'golden ratio machine learning', 'geometric deep learning'],
      rootWords: ['sacr- (sacred)', 'geo- (earth)', 'metr- (measure)']
    },
    'cryptography': {
      uuhere: 'Blockchain networks, secure communications, digital signatures, password hashing, quantum-resistant systems',
      uuhen: 'Caesar cipher (100 BCE), Enigma (1918), RSA (1977), AES (2001), post-quantum (2022)',
      uuhy: 'Cryptographic geometry enables secure AI training, federated learning privacy, and homomorphic encryption',
      trending: ['post-quantum cryptography', 'zero-knowledge proofs', 'lattice-based crypto'],
      rootWords: ['crypt- (hidden)', 'graph- (write)', 'cipher (zero)']
    },
    'quantum-mechanics': {
      uuhere: 'Atomic orbitals, semiconductors, lasers, MRI machines, quantum computers, photosynthesis',
      uuhen: 'Planck (1900), Bohr (1913), Schrödinger (1926), quantum computing (1994)',
      uuhy: 'Quantum geometry powers quantum machine learning, quantum neural networks, and optimization algorithms',
      trending: ['quantum machine learning', 'quantum neural networks', 'quantum supremacy'],
      rootWords: ['quant- (how much)', 'wave (vibration)', 'super- (above)']
    },
    'quantum-gravity': {
      uuhere: 'Black hole singularities, Big Bang cosmology, Planck-scale physics, loop quantum gravity simulations',
      uuhen: 'Einstein (1915), Wheeler (1957), Hawking (1974), Loop QG (1986)',
      uuhy: 'Quantum gravity insights inform spacetime neural networks and cosmological simulation frameworks',
      trending: ['loop quantum gravity', 'holographic principle', 'emergent spacetime'],
      rootWords: ['grav- (heavy)', 'quant- (amount)', 'planck (smallest)']
    },
    'general-relativity': {
      uuhere: 'GPS satellites, gravitational wave detectors, black hole imaging, cosmological models',
      uuhen: 'Einstein (1915), Schwarzschild (1916), LIGO (2015), Event Horizon Telescope (2019)',
      uuhy: 'Relativistic corrections essential for satellite AI, autonomous navigation, and precision timing',
      trending: ['gravitational wave astronomy', 'black hole imaging', 'spacetime curvature'],
      rootWords: ['relat- (carry back)', 'tensor (stretch)', 'metric (measure)']
    },
    'topology': {
      uuhere: 'Knot theory in DNA, topological insulators, network analysis, manifold learning',
      uuhen: 'Euler (1736), Poincaré (1895), topological data analysis (2000s)',
      uuhy: 'Topological data analysis revolutionizes ML feature extraction and dimensionality reduction',
      trending: ['topological data analysis', 'persistent homology', 'manifold learning'],
      rootWords: ['topo- (place)', 'log- (study)', 'morph- (shape)']
    },
    '4d-hyperdimensional': {
      uuhere: 'String theory extra dimensions, neural network embedding spaces, high-dimensional optimization',
      uuhen: 'Riemann (1854), Hinton tesseract (1880), modern ML embeddings (2010s)',
      uuhy: 'High-dimensional geometry is the foundation of word embeddings, GANs, and transformer architectures',
      trending: ['high-dimensional embeddings', 'hyperbolic neural networks', '4D visualization'],
      rootWords: ['hyper- (beyond)', 'dimen- (measure)', 'poly- (many)']
    },
    'fractals': {
      uuhere: 'Coastlines, mountains, blood vessels, stock markets, turbulence, antenna design',
      uuhen: 'Mandelbrot (1975), chaos theory (1960s), fractal compression (1988)',
      uuhy: 'Fractal geometry enables efficient neural architectures, texture synthesis, and chaos prediction',
      trending: ['fractal neural networks', 'chaos prediction', 'self-similarity AI'],
      rootWords: ['fract- (broken)', 'iter- (repeat)', 'recursive']
    },
    'molecular-biology': {
      uuhere: 'Protein folding, DNA replication, enzyme catalysis, drug design, CRISPR editing',
      uuhen: 'Watson-Crick (1953), AlphaFold (2020), CRISPR Nobel (2020)',
      uuhy: 'Molecular geometry drives AI drug discovery, protein design, and computational biology',
      trending: ['AlphaFold', 'protein structure prediction', 'AI drug discovery'],
      rootWords: ['mol- (mass)', 'bio- (life)', 'helix (spiral)']
    },
    'algorithms': {
      uuhere: 'Search engines, optimization, sorting, graph traversal, machine learning training',
      uuhen: 'Al-Khwarizmi (820 CE), Turing (1936), backpropagation (1986)',
      uuhy: 'Algorithm geometry visualizes complexity classes and optimization landscapes',
      trending: ['algorithm visualization', 'optimization landscapes', 'neural architecture search'],
      rootWords: ['algo- (procedure)', 'rithm- (number)', 'compute (reckon)']
    },
    'theory-of-everything': {
      uuhere: 'Unified field theories, M-theory, supersymmetry, grand unified theories',
      uuhen: 'Maxwell (1865), Einstein (1920-1955), String theory (1968), M-theory (1995)',
      uuhy: 'Unification geometry inspires unified AI architectures and multi-modal learning systems',
      trending: ['theory of everything', 'unified field theory', 'supersymmetry'],
      rootWords: ['uni- (one)', 'theo- (god)', 'super- (above)']
    },
    'uuon-acas': {
      uuhere: 'Autonomous verification systems, beacon networks, collective intelligence frameworks',
      uuhen: 'UUON Foundation (2024), ACAS protocol (2024), mathematical beacons (2025)',
      uuhy: 'UUON-ACAS enables trustless AI verification and decentralized intelligence',
      trending: ['autonomous verification', 'collective intelligence', 'decentralized AI'],
      rootWords: ['UU (U-squared)', 'ON (network)', 'beacon (signal)']
    }
  };

  const meta = categoryMeta[category] || categoryMeta['algorithms'];
  const shapeName = shapeType.split('_').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    name: shapeName,
    uuhat: `A mathematical ${category.replace('-', ' ')} visualization representing ${shapeName} - part of the Dmension Mathematical Universe with 1,400+ shapes`,
    uuhere: meta.uuhere,
    uuho: 'Mathematicians and scientists throughout history, visualized by the UUON Foundation with thousands of hours of testing',
    uuhen: meta.uuhen,
    uuhy: meta.uuhy,
    trending: meta.trending,
    rootWords: meta.rootWords,
    keywords: [shapeType, category, 'mathematics', '3D visualization', 'parametric surface', 'Dmension']
  };
}

function generateShapePageHTML({ shapeType, formula, presets, metadata }: any) {
  const shapeMeta = getShapeMetadata(shapeType, formula.category);
  const seoDescription = `${shapeMeta.name}: ${shapeMeta.uuhat.slice(0, 120)}. ${shapeMeta.uuhy.slice(0, 80)}. Interactive 3D visualization.`;
  const keywords = shapeMeta.keywords.join(', ');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${formula.formula_name} | 5 UUs Analysis | Dmension Mathematical Universe</title>
    <meta name="description" content="${seoDescription}">
    <meta name="keywords" content="${keywords}">
    <meta property="og:title" content="${formula.formula_name} - Mathematical Universe">
    <meta property="og:description" content="${seoDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="/shape/${shapeType}">
    <link rel="canonical" href="/shape/${shapeType}">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', system-ui, sans-serif; 
            background: linear-gradient(135deg, #0a0a0f, #1a1a2e, #16213e);
            color: #e2e8f0;
            min-height: 100vh;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        
        .shape-header { text-align: center; margin-bottom: 2rem; }
        .shape-title {
            font-size: 2.5rem;
            font-weight: 800;
            background: linear-gradient(135deg, #00d4ff, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        .shape-category {
            display: inline-block;
            background: rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(0, 212, 255, 0.4);
            padding: 0.4rem 1rem;
            border-radius: 2rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            color: #00d4ff;
        }

        .viewer-cta {
            background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(168, 85, 247, 0.1));
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 1rem;
            padding: 2rem;
            margin: 2rem 0;
            text-align: center;
        }
        .launch-btn {
            background: linear-gradient(135deg, #00d4ff, #a855f7);
            border: none;
            padding: 1rem 2.5rem;
            border-radius: 0.5rem;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            text-decoration: none;
            display: inline-block;
        }
        .launch-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);
        }

        /* 5 UUs Section */
        .five-uus-section {
            margin: 3rem 0;
        }
        .five-uus-title {
            font-size: 1.8rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 1.5rem;
            background: linear-gradient(90deg, #00d4ff, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .five-uus-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
        }
        .uu-card {
            background: rgba(30, 30, 50, 0.6);
            border-radius: 1rem;
            padding: 1.5rem;
            border-left: 4px solid;
            transition: transform 0.2s;
        }
        .uu-card:hover { transform: translateY(-3px); }
        .uu-card.uu-what { border-color: #00d4ff; }
        .uu-card.uu-where { border-color: #10b981; }
        .uu-card.uu-who { border-color: #f59e0b; }
        .uu-card.uu-when { border-color: #ec4899; }
        .uu-card.uu-why { border-color: #a855f7; }
        
        .uu-card h3 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        .uu-card.uu-what h3 { color: #00d4ff; }
        .uu-card.uu-where h3 { color: #10b981; }
        .uu-card.uu-who h3 { color: #f59e0b; }
        .uu-card.uu-when h3 { color: #ec4899; }
        .uu-card.uu-why h3 { color: #a855f7; }
        
        .uu-card p { color: #cbd5e1; font-size: 0.95rem; }
        .root-words, .trending {
            margin-top: 0.75rem;
            font-size: 0.8rem;
            color: #94a3b8;
            font-style: italic;
        }

        /* Formula Section */
        .formula-section {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 1rem;
            padding: 2rem;
            margin: 2rem 0;
            border: 1px solid rgba(0, 212, 255, 0.2);
        }
        .formula-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #00d4ff;
            margin-bottom: 1rem;
        }
        .equation {
            font-family: 'Courier New', monospace;
            background: rgba(0, 0, 0, 0.4);
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            margin: 0.5rem 0;
            border-left: 3px solid #00d4ff;
            font-size: 0.9rem;
            overflow-x: auto;
        }
        .meta-info {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .meta-item {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 0.5rem;
        }
        .meta-item strong { color: #00d4ff; }

        /* Keywords for SEO */
        .keywords-section {
            background: rgba(168, 85, 247, 0.1);
            border: 1px solid rgba(168, 85, 247, 0.3);
            border-radius: 1rem;
            padding: 1.5rem;
            margin: 2rem 0;
        }
        .keyword-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.75rem;
        }
        .keyword-tag {
            background: rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(0, 212, 255, 0.3);
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.8rem;
            color: #00d4ff;
        }

        .back-link {
            text-align: center;
            margin-top: 2rem;
        }

        @media (max-width: 768px) {
            .shape-title { font-size: 1.8rem; }
            .five-uus-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="shape-header">
            <h1 class="shape-title">${formula.formula_name}</h1>
            <span class="shape-category">${formula.category.replace('-', ' ')}</span>
        </header>

        <div class="viewer-cta">
            <h2 style="color: #fff; margin-bottom: 1rem;">Interactive 3D Visualization</h2>
            <p style="color: #94a3b8; margin-bottom: 1.5rem;">Experience this mathematical shape in full 3D with real-time parameter control</p>
            <a href="/?shape=${shapeType}" class="launch-btn">Launch Interactive Viewer</a>
        </div>

        <!-- THE 5 UUs - UUON Foundation Framework -->
        <section class="five-uus-section">
            <h2 class="five-uus-title">The 5 UUs Analysis</h2>
            <div class="five-uus-grid">
                <div class="uu-card uu-what">
                    <h3>🔍 UUhat Is It?</h3>
                    <p>${shapeMeta.uuhat}</p>
                    <div class="root-words"><strong>Root Words:</strong> ${shapeMeta.rootWords.join(', ')}</div>
                </div>
                <div class="uu-card uu-where">
                    <h3>🌍 UUhere Is It Found?</h3>
                    <p>${shapeMeta.uuhere}</p>
                </div>
                <div class="uu-card uu-who">
                    <h3>👤 UUho Discovered It?</h3>
                    <p>${shapeMeta.uuho}</p>
                </div>
                <div class="uu-card uu-when">
                    <h3>📅 UUhen Was It Discovered?</h3>
                    <p>${shapeMeta.uuhen}</p>
                </div>
                <div class="uu-card uu-why">
                    <h3>🤖 UUhy Does It Matter for AI/ML?</h3>
                    <p>${shapeMeta.uuhy}</p>
                    <div class="trending"><strong>Trending:</strong> ${shapeMeta.trending.join(' • ')}</div>
                </div>
            </div>
        </section>

        <!-- Mathematical Formula -->
        <section class="formula-section">
            <h3 class="formula-title">Mathematical Equations</h3>
            <div class="equation"><strong>x(u,v)</strong> = ${formula.equation_x_formula || 'Parametric x component'}</div>
            <div class="equation"><strong>y(u,v)</strong> = ${formula.equation_y_formula || 'Parametric y component'}</div>
            <div class="equation"><strong>z(u,v)</strong> = ${formula.equation_z_formula || 'Parametric z component'}</div>
            
            <div class="meta-info">
                <div class="meta-item">
                    <strong>Complexity:</strong> ${formula.complexity_score || 5}/10
                </div>
                ${formula.therapeutic_classification ? `
                <div class="meta-item">
                    <strong>Therapeutic:</strong> ${formula.therapeutic_classification}
                </div>
                ` : ''}
                ${formula.mathematical_foundation ? `
                <div class="meta-item">
                    <strong>Foundation:</strong> ${formula.mathematical_foundation}
                </div>
                ` : ''}
            </div>
        </section>

        <!-- SEO Keywords -->
        <section class="keywords-section">
            <h4 style="color: #a855f7; margin-bottom: 0.5rem;">Related Topics & Keywords</h4>
            <div class="keyword-tags">
                ${shapeMeta.keywords.map((kw: string) => `<span class="keyword-tag">${kw}</span>`).join('')}
                ${shapeMeta.trending.map((t: string) => `<span class="keyword-tag">${t}</span>`).join('')}
            </div>
        </section>

        <div class="back-link">
            <a href="/" class="launch-btn">← Explore All 1,400+ Shapes</a>
        </div>
    </div>

    <script>
        window.SHAPE_DATA = ${JSON.stringify({
          shapeType,
          formula: formula.formula_name,
          category: formula.category,
          defaults: typeof formula.default_parameters === 'string' 
            ? JSON.parse(formula.default_parameters || '{}') 
            : (formula.default_parameters || {}),
          metadata: shapeMeta
        })};
    </script>
</body>
</html>
  `;
}

function generateOmniProofsPageHTML(proofCategories: any[], categories: Record<string, any[]>, totalProofs: number) {
  const narratives: Record<string, { story: string; future: string; impact: string }> = {
    'cryptography': {
      story: 'From ancient ciphers to quantum-resistant lattices, cryptography shields civilization. These proofs don\'t just secure data—they enable trust without authority.',
      future: 'Zero-knowledge proofs will let you prove facts without revealing secrets—age without birthdate, funds without balance, votes without choice.',
      impact: 'Every Bitcoin, every HTTPS, every digital signature relies on these mathematical certainties.'
    },
    'algorithms': {
      story: 'Algorithms are computation\'s DNA. These proofs establish what can be computed and what remains forever beyond reach.',
      future: 'Understanding P vs NP could break all encryption—or prove perfect security possible.',
      impact: 'From Google search to autonomous vehicles, every intelligent system runs on proven foundations.'
    },
    'quantum-mechanics': {
      story: 'Reality at smallest scales defies intuition. Particles exist in superposition; entanglement spans galaxies instantly.',
      future: 'Quantum computers will simulate molecules for drugs, break encryption while enabling unbreakable new forms.',
      impact: 'MRI, lasers, semiconductors—quantum mechanics powers the modern world.'
    },
    'quantum-gravity': {
      story: 'At the Planck scale, space becomes quantized. These proofs attempt to unify Einstein with quantum uncertainty.',
      future: 'Understanding quantum gravity could reveal how to manipulate spacetime or explain black hole interiors.',
      impact: 'Resolving the information paradox would change our understanding of reality.'
    },
    'general-relativity': {
      story: 'Einstein showed gravity is spacetime curvature. These proofs predicted black holes decades before observation.',
      future: 'Gravitational wave astronomy detects colliding black holes and neutron stars.',
      impact: 'Without relativistic corrections, GPS would drift 10km daily.'
    },
    'theory-of-everything': {
      story: 'String theory, loop quantum gravity—humanity\'s attempts to write one equation explaining all of reality.',
      future: 'A verified ToE would be humanity\'s greatest achievement—understanding why the universe exists.',
      impact: 'Even failed attempts yield transformative mathematics.'
    },
    'topology': {
      story: 'Topology studies properties preserved when shapes are stretched but not torn. A coffee cup equals a donut.',
      future: 'Topological quantum computing uses anyons for error-free calculations.',
      impact: 'DNA topology determines how genetic information is read.'
    },
    '4d-hyperdimensional': {
      story: 'Mathematics reveals 4D, 10D, infinite dimensions. These proofs map the tesseract and polytopes we see through projection.',
      future: 'String theory requires 10+ dimensions—hidden dimensions curled at every point.',
      impact: 'Machine learning uses high-dimensional spaces; your phone\'s neural nets operate in thousands of dimensions.'
    },
    'fractals': {
      story: 'Fractals reveal infinite complexity from simple rules. Mandelbrot\'s boundary has infinite length in finite area.',
      future: 'Understanding chaos means understanding weather limits, market crashes, ecosystem tipping points.',
      impact: 'Fractal antennas in phones, coastline measurement, heartbeat analysis.'
    },
    'molecular-biology': {
      story: 'Life is mathematics made flesh. DNA stores information more densely than any technology.',
      future: 'AlphaFold revolutionized proteins. Next: designing novel proteins, editing genomes with precision.',
      impact: 'Every drug, vaccine, and disease understanding flows from molecular mathematics.'
    },
    'sacred-geometry': {
      story: 'The golden ratio appears in galaxies and DNA alike. Not mystical—mathematical necessities life discovered.',
      future: 'Biomimetic design uses nature\'s solutions: hexagonal honeycombs, logarithmic spirals.',
      impact: 'Architecture and art that resonates often uses these proportions unconsciously.'
    },
    'uuon-acas': {
      story: 'UUON-ACAS: autonomous systems verifying through mathematical beacons. Consciousness may have geometric structure.',
      future: 'Decentralized autonomous organizations, AI governance, collective intelligence without central authority.',
      impact: 'E Pluribus Unum—how independent agents converge to unified behavior. The mathematics of civilization.'
    }
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni-Proof Index - ${totalProofs} Mathematical Verification Algorithms</title>
    <meta name="description" content="Comprehensive index of ${totalProofs} mathematical proof algorithms across ${proofCategories.length} categories. Each proof represents humanity's deepest understanding of reality.">
    <meta property="og:title" content="Omni-Proof Index - Mathematical Verification Algorithms">
    <meta property="og:description" content="${totalProofs} proof algorithms covering cryptography, quantum mechanics, relativity, and more.">
    <link rel="canonical" href="/proofs">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', system-ui, sans-serif; 
            background: linear-gradient(135deg, #0f0f0f, #1a1a2e, #16213e);
            color: white;
            min-height: 100vh;
            line-height: 1.6;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        header { text-align: center; margin-bottom: 3rem; }
        h1 { 
            font-size: 2.5rem; 
            background: linear-gradient(90deg, #00d4ff, #a855f7, #ec4899);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        .subtitle { color: #9ca3af; font-size: 1.1rem; }
        .total-count { color: #00d4ff; font-size: 1.2rem; margin-top: 0.5rem; }
        .intro-box {
            background: rgba(30, 30, 50, 0.6);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 2rem;
        }
        .intro-box h2 { color: #00d4ff; margin-bottom: 1rem; }
        .intro-box p { color: #d1d5db; margin-bottom: 0.5rem; }
        .category-card {
            background: rgba(30, 30, 50, 0.4);
            border: 1px solid rgba(107, 114, 128, 0.3);
            border-radius: 12px;
            margin-bottom: 1rem;
            overflow: hidden;
        }
        .category-header {
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            transition: background 0.3s;
        }
        .category-header:hover { background: rgba(107, 114, 128, 0.1); }
        .category-info { display: flex; align-items: center; gap: 1rem; }
        .category-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: linear-gradient(135deg, #00d4ff, #a855f7);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
        }
        .category-name { font-size: 1.1rem; font-weight: 600; }
        .category-count { color: #9ca3af; font-size: 0.9rem; }
        .count-badge {
            background: rgba(0, 212, 255, 0.1);
            color: #00d4ff;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
        }
        .category-content { padding: 0 1.5rem 1.5rem; display: none; }
        .category-content.active { display: block; }
        .narrative-box {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1rem;
        }
        .narrative-box.story { border-left: 3px solid #a855f7; }
        .narrative-box.future { border-left: 3px solid #00d4ff; }
        .narrative-box.impact { border-left: 3px solid #ec4899; }
        .narrative-box h4 { margin-bottom: 0.5rem; }
        .narrative-box.story h4 { color: #a855f7; }
        .narrative-box.future h4 { color: #00d4ff; }
        .narrative-box.impact h4 { color: #ec4899; }
        .narrative-box p { color: #d1d5db; font-size: 0.9rem; }
        .proof-links h4 { color: #9ca3af; margin-bottom: 1rem; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.1em; }
        .proof-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.5rem; }
        .proof-link {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 0.75rem;
            background: rgba(107, 114, 128, 0.1);
            border-radius: 8px;
            color: #d1d5db;
            text-decoration: none;
            transition: all 0.2s;
            font-size: 0.9rem;
        }
        .proof-link:hover { background: rgba(107, 114, 128, 0.2); color: #00d4ff; }
        .proof-link span { text-overflow: ellipsis; overflow: hidden; white-space: nowrap; }
        footer { text-align: center; margin-top: 3rem; color: #6b7280; font-size: 0.9rem; }
        footer a { color: #00d4ff; }
        .chevron { transition: transform 0.3s; }
        .chevron.open { transform: rotate(90deg); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>OMNI-PROOF INDEX</h1>
            <p class="subtitle">Mathematical Verification Algorithms & Discovery Narratives</p>
            <p class="total-count">${totalProofs} Proof Algorithms Across ${proofCategories.length} Categories</p>
        </header>

        <div class="intro-box">
            <h2>The Real Story</h2>
            <p>These are not mere visualizations—they are <strong style="color: #a855f7">mathematical certainties</strong> that govern the universe. Each proof represents humanity's deepest understanding of reality.</p>
            <p><strong style="color: #00d4ff">Dmension</strong> transforms these abstract truths into visual explorations. Click any category to reveal its proofs and their world-changing implications.</p>
        </div>

        ${proofCategories.map(cat => {
          const shapes = categories[cat.name] || [];
          const narrative = narratives[cat.name] || { story: '', future: '', impact: '' };
          return `
        <div class="category-card">
            <div class="category-header" onclick="toggleCategory('${cat.name}')">
                <div class="category-info">
                    <div class="category-icon">${cat.icon}</div>
                    <div>
                        <div class="category-name">${cat.displayName}</div>
                        <div class="category-count">${shapes.length} mathematical proofs</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span class="count-badge">${shapes.length} proofs</span>
                    <span class="chevron" id="chevron-${cat.name}">▶</span>
                </div>
            </div>
            <div class="category-content" id="content-${cat.name}">
                ${narrative.story ? `
                <div class="narrative-box story">
                    <h4>The Story</h4>
                    <p>${narrative.story}</p>
                </div>
                <div class="narrative-box future">
                    <h4>What This Will Change</h4>
                    <p>${narrative.future}</p>
                </div>
                <div class="narrative-box impact">
                    <h4>Scientific Impact</h4>
                    <p>${narrative.impact}</p>
                </div>
                ` : ''}
                <div class="proof-links">
                    <h4>Direct Links to Each Proof:</h4>
                    <div class="proof-grid">
                        ${shapes.map(shape => `
                        <a href="/shape/${shape.shape_type}" class="proof-link">
                            <span>${shape.shape_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</span>
                            <span>→</span>
                        </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
          `;
        }).join('')}

        <footer>
            <p>Dmension Mathematical Universe | ${totalProofs} Verification Algorithms | <a href="/sitemap-omni-proofs.xml">Omni-Proof Sitemap</a></p>
        </footer>
    </div>
    <script>
        function toggleCategory(name) {
            const content = document.getElementById('content-' + name);
            const chevron = document.getElementById('chevron-' + name);
            content.classList.toggle('active');
            chevron.classList.toggle('open');
        }
    </script>
</body>
</html>
  `;
}

function generateProofCategoryPageHTML(category: string, formulas: any[]) {
  const displayName = category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${displayName} - ${formulas.length} Proof Algorithms</title>
    <meta name="description" content="Explore ${formulas.length} mathematical proof algorithms in ${displayName}. Each represents verified mathematical truth.">
    <link rel="canonical" href="/proofs/${category}">
    <style>
        body { 
            font-family: 'Inter', system-ui, sans-serif; 
            background: linear-gradient(135deg, #0f0f0f, #1a1a2e, #16213e);
            color: white;
            min-height: 100vh;
            margin: 0;
        }
        .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
        h1 { color: #00d4ff; margin-bottom: 1rem; }
        .breadcrumb { color: #9ca3af; margin-bottom: 2rem; }
        .breadcrumb a { color: #00d4ff; text-decoration: none; }
        .proof-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; }
        .proof-card {
            background: rgba(30, 30, 50, 0.4);
            border: 1px solid rgba(107, 114, 128, 0.3);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.3s;
        }
        .proof-card:hover { border-color: #00d4ff; transform: translateY(-2px); }
        .proof-card h3 { color: white; margin-bottom: 0.5rem; }
        .proof-card p { color: #9ca3af; font-size: 0.9rem; margin-bottom: 1rem; }
        .proof-card a {
            display: inline-block;
            background: linear-gradient(90deg, #00d4ff, #a855f7);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 6px;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="breadcrumb">
            <a href="/proofs">← All Proofs</a> / ${displayName}
        </div>
        <h1>${displayName}</h1>
        <p style="color: #9ca3af; margin-bottom: 2rem;">${formulas.length} proof algorithms in this category</p>
        
        <div class="proof-grid">
            ${formulas.map(f => `
            <div class="proof-card">
                <h3>${f.shape_type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</h3>
                <p>${(f.implementation_notes || 'Mathematical verification algorithm').substring(0, 150)}...</p>
                <a href="/shape/${f.shape_type}">Explore Proof →</a>
            </div>
            `).join('')}
        </div>
    </div>
</body>
</html>
  `;
}

export { router as shapePageRoutes };
