/**
 * ABOUT US SITEMAP - UUON Foundation
 * Comprehensive About pages with validated content from platform capabilities
 * Updated January 2026 with DNA Molecular Structures Library
 * © 2025-2026 UUON Foundation Inc. All Rights Reserved.
 */

import { Router } from 'express';

const router = Router();

// Primary and alternate domains for sitemap generation
const DOMAINS = {
  primary: 'https://uuon.world',
  alternate: 'https://dmension.replit.app'
};

const VALIDATED_PLATFORM_STATS = {
  parametricShapes: 2677,
  mathematicalEquations: 2302,
  waveAlgorithms: 183,
  shapeCategories: 150,
  proceduralMaterials: 49,
  exportFormats: 7,
  tpmsStructures: 27,
  latticeConfigurations: 30,
  vectorFieldAlgorithms: 387,
  dnaStructures: 56,
  dnaCategories: 12
};

// DNA Molecular Structures Library - January 2026 Publication
const DNA_LIBRARY = {
  title: 'DMENSION DNA Molecular Structures Library',
  version: '1.0',
  publishDate: 'January 2026',
  founder: 'Phillip Aguilar Ruiz III',
  organization: 'UUON Foundation Inc.',
  totalStructures: 56,
  totalCategories: 12,
  categories: [
    { name: 'DNA Geometric Code & Memory System', structures: 1, key: 'dna_geometric_code' },
    { name: 'Classic Double Helix Forms', structures: 4, key: 'classic_helix' },
    { name: 'Base Pair & Structural Components', structures: 4, key: 'base_pairs' },
    { name: 'Higher-Order DNA Structures', structures: 5, key: 'higher_order' },
    { name: 'RNA Structures', structures: 5, key: 'rna_structures' },
    { name: 'Chromosomal Structures', structures: 3, key: 'chromosomal' },
    { name: 'DNA/RNA Machinery', structures: 5, key: 'machinery' },
    { name: 'Genetic Elements', structures: 3, key: 'genetic_elements' },
    { name: 'Protein Structures', structures: 2, key: 'protein_structures' },
    { name: 'Advanced Non-B DNA Structures', structures: 10, key: 'non_b_dna' },
    { name: '2026 DNA Nanotechnology Systems', structures: 6, key: 'nanotechnology_2026' },
    { name: 'Cross-Disciplinary Helical Structures', structures: 8, key: 'cross_disciplinary' }
  ],
  applications: [
    'Molecular Biology Education',
    'Drug Development & Design',
    'Cancer Research',
    'Gene Therapy & CRISPR',
    'Nanotechnology & DNA Computing',
    'Biotechnology & Synthetic Biology',
    'Structural Biology Research',
    'Epigenetics & Chromatin Studies'
  ],
  keyStructures: [
    'B-form DNA Helix (Watson-Crick Standard)',
    'CRISPR-Cas9 Complex (2020 Nobel Prize)',
    'G-Quadruplex DNA (Cancer Drug Target)',
    'DNA Origami Tile (Nanotechnology)',
    'Programmable DNA Nanobot (2026)',
    'DNA Digital Data Storage (215 PB/gram)'
  ],
  references: [
    'Watson & Crick (1953) - DNA Structure',
    'Luger et al. (1997) - Nucleosome Structure',
    'Doudna & Charpentier (2014) - CRISPR-Cas9',
    'Lieberman-Aiden et al. (2009) - Hi-C Chromosome Conformation',
    'Seeman (1982) - DNA Nanotechnology Foundation'
  ]
};

const ABOUT_PAGES = {
  foundation: {
    title: 'About UUON Foundation Inc.',
    path: '/about',
    description: 'UUON Foundation Inc. is a high-end 3D creator specializing in the visualization of complex mathematical concepts, architectural "Intelligent Geometry," and advanced structural forms. Our work bridges theoretical physics/mathematics with tangible 3D structures.',
    priority: 1.0
  },
  mission: {
    title: 'Our Mission',
    path: '/about/mission',
    description: 'To democratize mathematical understanding by transforming abstract concepts into intuitive 3D visualizations accessible to everyone. We create identity for mathematical formulas through the Δmension Mathematical Universe.',
    priority: 0.95
  },
  founder: {
    title: 'Phillip Aguilar Ruiz III - Founder & Principal Lead',
    path: '/about/founder',
    description: 'Phillip Aguilar Ruiz III is the creator and principal lead of the UUON Foundation. As an independent researcher and digital architect, Ruiz operates at the leading edge of computational geometry and theoretical physics.',
    priority: 0.9
  },
  technology: {
    title: 'Our Technology',
    path: '/about/technology',
    description: `The Δmension platform governs over ${VALIDATED_PLATFORM_STATS.parametricShapes}+ parametric mathematical forms across ${VALIDATED_PLATFORM_STATS.shapeCategories}+ categories, including topology, physics, medicine, architecture, quantum mechanics, and hyperdimensional geometry.`,
    priority: 0.9
  },
  'intelligent-geometry': {
    title: 'Intelligent Geometry',
    path: '/about/intelligent-geometry',
    description: 'Our portfolio is built on "Intelligent Geometry"—the idea that 3D forms should be mathematically coherent and geodetically anchored. We integrate real-world physics formulas into digital assets.',
    priority: 0.85
  },
  lattice: {
    title: 'Lattice Structures & Nodal Topography',
    path: '/about/lattice-structures',
    description: `We create intricate 3D models including Face-Centered Cubic (FCC) Crystal Lattices, demonstrating how nodes and edges create high-efficiency structural frameworks. ${VALIDATED_PLATFORM_STATS.latticeConfigurations}+ lattice configurations available.`,
    priority: 0.85
  },
  surfaces: {
    title: 'Mathematical Surfaces',
    path: '/about/mathematical-surfaces',
    description: 'Our models include complex topologies such as Riemannian Volume Form Surfaces, Kuen Surfaces, Cross Caps, and Triply Periodic Minimal Surfaces (TPMS). These visualize how space-time or curved manifolds can be represented through geometry.',
    priority: 0.85
  },
  geodesic: {
    title: 'Geodesic Structures',
    path: '/about/geodesic',
    description: 'A major theme in our work is "bridging" concepts. We use the Geodesic Equation to model the shortest paths on curved surfaces, creating structures that are structurally smooth and quantum-orbital in appearance.',
    priority: 0.85
  },
  vector: {
    title: 'Vector Wave Algorithms',
    path: '/about/vector-algorithms',
    description: `Our platform includes ${VALIDATED_PLATFORM_STATS.vectorFieldAlgorithms} vector field algorithms for generating complex waves and vibrations with applications in fluid dynamics, audio processing, and scientific simulations.`,
    priority: 0.85
  },
  applications: {
    title: 'Applications & Impact',
    path: '/about/applications',
    description: 'Our models serve as a digital archive for HCISS 3D Digital Assets, used by engineers for cellular structure modeling and by designers seeking biologically authentic aesthetics. We provide a mathematical rulebook for next-generation 3D-printed infrastructure.',
    priority: 0.8
  },
  metrology: {
    title: 'Metrology & Geodesics',
    path: '/about/metrology',
    description: 'Our use of geodetical anchoring and Riemannian manifolds changes how we map and interact with physical space, enabling more precise satellite navigation and global environmental monitoring.',
    priority: 0.8
  },
  biotechnology: {
    title: 'Biotechnology Applications',
    path: '/about/biotechnology',
    description: `Our lattice-based structures mimic the internal geometry of bone and cellular walls. ${VALIDATED_PLATFORM_STATS.tpmsStructures} TPMS structures available for tissue engineering and bio-mimetic scaffolding applications.`,
    priority: 0.8
  },
  nanotechnology: {
    title: 'Nanotechnology & Material Science',
    path: '/about/nanotechnology',
    description: 'The nodal topography explored by UUON provides structural logic for self-assembling nanobots and smart surfaces. We demonstrate how to build maximum strength structures with minimum material.',
    priority: 0.8
  },
  infrastructure: {
    title: 'Futuristic Infrastructure',
    path: '/about/infrastructure',
    description: 'Our geodesic bridges and intelligent geometry shape the future of construction using Vector-based Graphic Statics, enabling structures that distribute stress perfectly and require significantly less traditional support.',
    priority: 0.8
  },
  'dna-structures': {
    title: 'DNA Molecular Structures Library',
    path: '/about/dna-structures',
    description: `The DMENSION DNA Molecular Structures Library comprises ${DNA_LIBRARY.totalStructures} parametric 3D models spanning ${DNA_LIBRARY.totalCategories} categories from fundamental biochemistry through cutting-edge 2026 nanotechnology applications. Research-grade mathematical specifications derived from published crystallographic and biophysical data.`,
    priority: 0.95
  },
  'dna-nanotechnology': {
    title: '2026 DNA Nanotechnology',
    path: '/about/dna-nanotechnology',
    description: 'Advanced 2026 DNA nanotechnology systems including DNA Digital Data Storage (215 PB/gram capacity), Programmable DNA Nanobots for precision drug delivery, DNA-Directed Nanophotonics, Cell-Free Biomanufacturing, and DNA Walking Motors.',
    priority: 0.9
  },
  'dna-research': {
    title: 'DNA Research Applications',
    path: '/about/dna-research',
    description: 'Research applications of DMENSION DNA structures for molecular biology education, drug development, cancer research, gene therapy, CRISPR visualization, epigenetics, and structural biology studies.',
    priority: 0.85
  },
  contact: {
    title: 'Contact UUON Foundation',
    path: '/about/contact',
    description: 'Connect with UUON Foundation Inc. for partnerships, research collaborations, licensing inquiries, and educational opportunities.',
    priority: 0.75
  }
};

router.get('/sitemap-about.xml', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Generate URLs for both domains with xhtml:link alternates
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.entries(ABOUT_PAGES).map(([key, page]) => `  <url>
    <loc>${DOMAINS.primary}${page.path}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.primary}${page.path}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.alternate}${page.path}"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
});

// DNA Structures specific sitemap
router.get('/sitemap-dna.xml', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  const dnaUrls = DNA_LIBRARY.categories.map((cat, index) => `  <url>
    <loc>${DOMAINS.primary}/dna/${cat.key}</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.primary}/dna/${cat.key}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.alternate}/dna/${cat.key}"/>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${0.9 - (index * 0.02)}</priority>
  </url>`).join('\n');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${DOMAINS.primary}/dna</loc>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.primary}/dna"/>
    <xhtml:link rel="alternate" hreflang="en" href="${DOMAINS.alternate}/dna"/>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.95</priority>
  </url>
${dnaUrls}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
});

router.get('/about-metadata', (req, res) => {
  res.json({
    success: true,
    organization: {
      name: 'UUON Foundation Inc.',
      fullName: 'Universally United Obscured Node Foundation Inc.',
      founded: 2025,
      founder: 'Phillip Aguilar Ruiz III',
      headquarters: 'Yuma, Arizona, USA',
      website: DOMAINS.primary,
      alternateWebsite: DOMAINS.alternate,
      sketchfab: 'https://sketchfab.com/uuon'
    },
    platform: {
      name: 'Δmension Mathematical Universe',
      altName: 'Dmension',
      description: 'A canonical geometry system that defines geometry as an ownable, regenerable mathematical object',
      stats: VALIDATED_PLATFORM_STATS
    },
    dnaLibrary: DNA_LIBRARY,
    expertise: [
      'Intelligent Geometry - mathematically coherent, geodetically anchored 3D forms',
      'Lattice Structures & Nodal Topography - structural optimization',
      'Mathematical Surfaces - Riemannian, Kuen, Cross Caps, TPMS',
      'Geodesic Structures - shortest paths on curved surfaces',
      'Vector Wave Algorithms - fluid dynamics, audio processing, simulations',
      'Biotechnology Applications - tissue engineering, bio-mimetic scaffolding',
      'Nanotechnology - self-assembling structures, smart surfaces',
      'Futuristic Infrastructure - 3D-printed bridges and buildings',
      'DNA Molecular Structures - 56 research-grade 3D models across 12 categories'
    ],
    applications: [
      'Metrology & Geodesics',
      'Biotechnology & Synthetic Biology',
      'Nanotechnology & Material Science',
      'Futuristic Infrastructure',
      'Educational Visualization',
      'Research & Development',
      'DNA Research & Drug Development',
      'Cancer Research & Gene Therapy'
    ],
    pages: ABOUT_PAGES,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://uuon.world/#organization',
      name: 'UUON Foundation Inc.',
      alternateName: 'Universally United Obscured Node',
      legalName: 'UUON Foundation Inc.',
      url: 'https://uuon.world',
      logo: {
        '@type': 'ImageObject',
        url: 'https://uuon.world/dmension-logo.png',
        width: 512,
        height: 512
      },
      image: 'https://uuon.world/og-mathematical-universe.jpg',
      foundingDate: '2025-01-01',
      foundingLocation: {
        '@type': 'Place',
        name: 'Yuma, Arizona, USA'
      },
      founder: {
        '@type': 'Person',
        name: 'Phillip Aguilar Ruiz III',
        jobTitle: 'Founder & Principal Lead',
        description: 'Independent researcher and digital architect at the leading edge of computational geometry and theoretical physics',
        sameAs: [
          'https://www.instagram.com/uuon.foundation',
          'https://sketchfab.com/uuon'
        ]
      },
      description: 'High-end 3D creator specializing in visualization of complex mathematical concepts, architectural Intelligent Geometry, and advanced structural forms. Platform governs 2,677+ parametric mathematical forms across 150+ categories.',
      areaServed: 'Global',
      sameAs: [
        'https://sketchfab.com/uuon',
        'https://www.instagram.com/uuon.foundation'
      ],
      knowsAbout: [
        'Mathematical Visualization',
        'Parametric Surfaces',
        'Intelligent Geometry',
        'Lattice Structures',
        'Nodal Topography',
        'Geodesic Structures',
        'TPMS',
        'Biotechnology',
        'Nanotechnology',
        'Vector Field Algorithms',
        'Computational Geometry',
        'DNA Molecular Structures',
        'DNA Nanotechnology',
        'CRISPR-Cas9 Visualization',
        'Molecular Biology',
        'Structural Biochemistry'
      ],
      keywords: 'mathematical visualization, parametric surfaces, intelligent geometry, lattice structures, TPMS, geodesic structures, 3D modeling, computational geometry, DNA structures, DNA nanotechnology, CRISPR, molecular biology'
    }
  });
});

// DNA Library dedicated endpoint
router.get('/dna-library', (req, res) => {
  res.json({
    success: true,
    library: DNA_LIBRARY,
    domains: DOMAINS,
    documentation: {
      overview: 'The DMENSION DNA Molecular Structures library comprises 56 parametric 3D models spanning fundamental biochemistry through cutting-edge 2026 nanotechnology applications.',
      scientificBasis: 'Each structure incorporates research-grade mathematical specifications derived from published crystallographic and biophysical data, enabling visualization and interactive exploration of molecular biology across scales from individual nucleotides (angstroms) to chromosomal organization (micrometers).',
      qualityAssurance: {
        accuracy: 'B-DNA specification: 10.5 bp/turn ± 0.05 (literature range: 10.4-10.6)',
        sources: 'Primary: Peer-reviewed crystallography papers (Nature, Science, Structure, Nucleic Acids Research)',
        validation: 'Visual comparison with published structural images, dimensional consistency across related structures'
      },
      exportFormatsAndApplications: {
        summary: 'Each export format reveals different aspects of DNA structures, serving distinct professional workflows and research applications.',
        formats: {
          glbStandard: {
            name: 'GLB Standard',
            perspective: 'Interactive 3D visualization with PBR materials',
            benefits: [
              'Medical Education: Real-time rotation and zoom for classroom demonstrations',
              'Drug Development: Visual docking site identification',
              'Patient Communication: Accessible 3D models for genetic counseling'
            ]
          },
          glbAnimated: {
            name: 'GLB Animated',
            perspective: 'Dynamic molecular motion and conformational changes',
            benefits: [
              'Research Presentations: Demonstrate helicase unwinding, replication fork progression',
              'CRISPR Visualization: Show Cas9 binding and cutting mechanisms',
              'Enzyme Dynamics: Illustrate polymerase movement along DNA strands'
            ]
          },
          glbBakedLighting: {
            name: 'GLB with Baked Lighting',
            perspective: 'Publication-quality renders with optimized shadows',
            benefits: [
              'Scientific Publications: Journal-ready molecular illustrations',
              'Textbook Graphics: Consistent lighting for educational materials',
              'Grant Proposals: Professional visuals for funding applications'
            ]
          },
          ply: {
            name: 'PLY Point Cloud',
            perspective: 'Raw geometric data for computational analysis',
            benefits: [
              'Bioinformatics: Surface area and volume calculations',
              'Machine Learning: Training data for molecular recognition algorithms',
              'Structural Analysis: Geometric comparisons between DNA conformations'
            ]
          },
          sketchfab: {
            name: 'Sketchfab Integration',
            perspective: 'Web-embeddable interactive 3D with annotations',
            benefits: [
              'Online Courses: Embedded 3D in learning management systems',
              'Museum Exhibits: Touch-free interactive displays',
              'Science Communication: Shareable molecular models on social platforms'
            ]
          },
          nerfNeural: {
            name: 'NeRF Neural Export',
            perspective: 'AI-ready neural radiance field representation',
            benefits: [
              'Virtual Reality: Photorealistic DNA environments for VR labs',
              'Augmented Reality: Overlay molecular structures on physical samples',
              'AI Training: Advanced visual models for molecular AI systems'
            ]
          },
          parametricJson: {
            name: 'Parametric JSON',
            perspective: 'Mathematical regeneration instructions',
            benefits: [
              'Computational Biology: Programmatic structure generation',
              'Custom Simulations: Parameter sweeps for molecular dynamics',
              'NFT/Blockchain: Verifiable mathematical identity for each structure'
            ]
          }
        },
        fieldBenefits: {
          molecularBiology: 'Interactive exploration of base pairing, major/minor grooves, and helical geometry enables deeper understanding of genetic information storage and transmission.',
          drugDevelopment: 'Precise 3D models facilitate virtual screening, binding pocket analysis, and structure-based drug design targeting DNA-protein interactions.',
          cancerResearch: 'Visualization of DNA damage, repair mechanisms, and chromosomal aberrations supports development of targeted therapies and diagnostic tools.',
          geneticEngineering: 'CRISPR-Cas9 and other gene editing tools benefit from accurate structural models for guide RNA design and off-target prediction.',
          nanotechnology: 'DNA origami and nanostructure designs leverage precise helical geometry for constructing molecular-scale devices and delivery systems.',
          education: 'Multi-format exports enable differentiated instruction from elementary school overviews to graduate-level structural analysis.',
          forensics: 'Accurate DNA structure visualization supports expert testimony and jury comprehension in legal proceedings.',
          syntheticBiology: 'Parametric models enable design of novel genetic circuits and artificial chromosomes with predictable structural properties.'
        }
      }
    }
  });
});

export default router;
