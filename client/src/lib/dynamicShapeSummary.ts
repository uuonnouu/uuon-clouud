/**
 * DYNAMIC SHAPE SUMMARY GENERATOR
 * Generates meaningful educational content for any shape based on its category,
 * formula, and metadata. Ensures the Learn tab shows relevant info for all 2,307 shapes.
 */

import { SHAPE_CATEGORIES } from './shapeCategories';

interface ShapeSummary {
  origin: string;
  function: string;
  applications: string;
  future: string;
}

const CATEGORY_CONTEXTS: Record<string, {
  domain: string;
  era: string;
  field: string;
  applications: string[];
  futureDirections: string[];
}> = {
  "4D Hyperdimensional": {
    domain: "higher-dimensional mathematics",
    era: "19th-20th century mathematicians exploring dimensions beyond 3D",
    field: "topology and theoretical physics",
    applications: ["AI/ML high-dimensional data visualization", "quantum computing state spaces", "string theory compactification"],
    futureDirections: ["neural network latent space navigation", "4D printing technology", "virtual reality dimensional exploration"]
  },
  "Fractals": {
    domain: "fractal geometry and chaos theory",
    era: "Benoit Mandelbrot's 1975 fractal geometry revolution",
    field: "dynamical systems and self-similarity",
    applications: ["procedural terrain generation", "antenna design", "data compression", "nature simulation"],
    futureDirections: ["infinite procedural worlds", "fractal-based AI architectures", "quantum fractal computing"]
  },
  "Biological": {
    domain: "mathematical biology and biophysics",
    era: "molecular biology discoveries from Watson-Crick to CRISPR",
    field: "structural biology and systems biology",
    applications: ["drug design", "protein engineering", "medical imaging", "synthetic biology"],
    futureDirections: ["AI-driven drug discovery", "DNA data storage", "engineered organisms", "precision medicine"]
  },
  "Atomic Structure": {
    domain: "quantum mechanics and atomic physics",
    era: "early 20th century quantum revolution",
    field: "atomic physics and quantum chemistry",
    applications: ["spectroscopy", "materials science", "semiconductor design", "quantum computing"],
    futureDirections: ["room-temperature superconductors", "quantum sensors", "atomic-scale manufacturing"]
  },
  "Quantum": {
    domain: "quantum physics and information theory",
    era: "from Planck's 1900 quantum hypothesis to modern quantum computing",
    field: "quantum mechanics and quantum information",
    applications: ["quantum cryptography", "quantum sensing", "quantum simulation", "quantum computing"],
    futureDirections: ["fault-tolerant quantum computers", "quantum internet", "quantum AI/ML"]
  },
  "Cosmology": {
    domain: "cosmology and general relativity",
    era: "Einstein's 1915 general relativity to modern cosmological observations",
    field: "astrophysics and theoretical physics",
    applications: ["GPS satellite corrections", "gravitational wave detection", "black hole imaging", "universe mapping"],
    futureDirections: ["unified physics theories", "interstellar navigation", "dark matter detection", "universe simulation"]
  },
  "Theory of Everything": {
    domain: "theoretical physics unification",
    era: "ongoing quest from Maxwell to string theory",
    field: "high-energy physics and mathematical physics",
    applications: ["particle accelerator design", "fundamental constants prediction", "cosmological modeling"],
    futureDirections: ["complete physics unification", "new particle discovery", "controlled fusion", "space propulsion"]
  },
  "Topology": {
    domain: "algebraic and differential topology",
    era: "from Euler's 1736 bridges to modern knot theory",
    field: "pure mathematics with physics applications",
    applications: ["data analysis", "molecular biology", "quantum error correction", "computer graphics"],
    futureDirections: ["topological quantum computing", "topological data analysis", "metamaterial design"]
  },
  "Minimal Surfaces": {
    domain: "differential geometry and calculus of variations",
    era: "Lagrange's 1762 minimal surface equation",
    field: "geometric analysis and materials science",
    applications: ["architecture", "soap film physics", "membrane biology", "3D printing optimization"],
    futureDirections: ["biomimetic structures", "lightweight aerospace design", "tissue engineering scaffolds"]
  },
  "Cryptographic": {
    domain: "mathematical cryptography and number theory",
    era: "from ancient ciphers to post-quantum cryptography",
    field: "information security and computational complexity",
    applications: ["secure communications", "blockchain", "digital signatures", "password protection"],
    futureDirections: ["post-quantum cryptography", "homomorphic encryption", "zero-knowledge proofs"]
  },
  "Time Principle": {
    domain: "temporal philosophy and physics",
    era: "exploring the nature of time from ancient philosophy to modern physics",
    field: "metaphysics and theoretical physics",
    applications: ["understanding causality", "temporal modeling", "consciousness studies", "decision theory"],
    futureDirections: ["temporal computing", "causality analysis", "AI temporal reasoning"]
  },
  "Phenomenon Principle": {
    domain: "GEIA framework for reality manifestation",
    era: "synthesis of geometry, energy, information, and natural laws",
    field: "mathematical philosophy and systems theory",
    applications: ["complex systems modeling", "emergence prediction", "pattern recognition"],
    futureDirections: ["unified phenomenon modeling", "consciousness simulation", "reality engineering"]
  },
  "Linguistic Geometry": {
    domain: "geometric semantics and phonetic topology",
    era: "bridging ancient letter mysticism with modern mathematical linguistics",
    field: "computational linguistics and geometric algebra",
    applications: ["visual typography", "semantic analysis", "language learning", "poetry visualization"],
    futureDirections: ["geometric NLP", "universal language encoding", "cross-cultural communication"]
  },
  "UUON Systems": {
    domain: "proprietary algorithmic mathematics",
    era: "UUON Foundation advanced mathematical research",
    field: "computational complexity and cryptographic security",
    applications: ["secure token systems", "advanced encryption", "mathematical identity verification"],
    futureDirections: ["quantum-resistant systems", "consciousness-aware computing", "universal mathematical framework"]
  },
  "Riemann Geometry": {
    domain: "differential geometry and tensor calculus",
    era: "Riemann's 1854 revolutionary geometry lecture",
    field: "mathematical physics and general relativity",
    applications: ["GPS navigation", "gravitational physics", "machine learning on manifolds", "medical imaging"],
    futureDirections: ["quantum gravity", "AI geometric reasoning", "autonomous navigation"]
  },
  "Waveforms": {
    domain: "harmonic analysis and signal processing",
    era: "from Fourier's 1807 heat equation to modern DSP",
    field: "applied mathematics and engineering",
    applications: ["audio processing", "telecommunications", "medical diagnostics", "seismology"],
    futureDirections: ["quantum signal processing", "brain-computer interfaces", "holographic displays"]
  },
  "Sacred Geometry": {
    domain: "mathematical patterns in nature and ancient traditions",
    era: "ancient civilizations to modern pattern mathematics",
    field: "mathematical aesthetics and natural form analysis",
    applications: ["architectural design", "art creation", "meditation tools", "natural pattern analysis"],
    futureDirections: ["biomimetic design", "consciousness research", "universal pattern recognition"]
  },
  "Attractors": {
    domain: "dynamical systems and chaos theory",
    era: "Lorenz's 1963 weather modeling discoveries",
    field: "nonlinear dynamics and complexity science",
    applications: ["weather prediction", "economic modeling", "population dynamics", "neural network design"],
    futureDirections: ["climate modeling", "AI chaos control", "complex system prediction"]
  },
  "Ice Crystals": {
    domain: "crystallography and thermodynamics",
    era: "from Kepler's 1611 snowflake observations to modern materials science",
    field: "condensed matter physics and meteorology",
    applications: ["weather forecasting", "cryogenics", "food preservation", "climate science"],
    futureDirections: ["ice nucleation control", "cryopreservation", "atmospheric engineering"]
  },
  "Thermal Engineering": {
    domain: "heat transfer and thermodynamics",
    era: "industrial revolution to modern data center cooling",
    field: "mechanical engineering and thermal physics",
    applications: ["cooling systems", "heat exchangers", "thermal management", "energy efficiency"],
    futureDirections: ["quantum thermal devices", "zero-energy cooling", "thermal computing"]
  },
  "Scientific Identity": {
    domain: "ALAREX framework for scientific identity chains",
    era: "unifying chemical, nuclear, biological, and medical identity principles",
    field: "interdisciplinary science and identity mathematics",
    applications: ["scientific verification", "cross-domain research", "identity authentication"],
    futureDirections: ["unified science framework", "automated discovery", "identity-based computing"]
  },
  "EFV System": {
    domain: "Energy-Frequency-Variation analytical framework",
    era: "modern geometric control theory synthesizing amplitude, iteration, and entropy",
    field: "dynamic geometry and computational visualization",
    applications: ["procedural animation", "generative design", "scientific simulation", "real-time graphics"],
    futureDirections: ["adaptive mesh systems", "physics-based AI", "emergent structure synthesis"]
  },
  "Evolutionary String Theory": {
    domain: "Beyond Darwin harmonic evolution theory",
    era: "José Díez Faixat's research connecting musical harmonics to evolutionary patterns",
    field: "theoretical biology and consciousness studies",
    applications: ["evolutionary pattern analysis", "consciousness mapping", "temporal acceleration modeling"],
    futureDirections: ["Omega Point prediction", "cross-domain harmonic resonance", "evolutionary forecasting"]
  },
  "Medical Imaging": {
    domain: "diagnostic radiology and medical visualization",
    era: "from Röntgen's 1895 X-rays to modern MRI and CT technology",
    field: "biomedical engineering and diagnostic medicine",
    applications: ["disease diagnosis", "surgical planning", "treatment monitoring", "anatomical research"],
    futureDirections: ["AI-assisted diagnosis", "real-time 3D imaging", "personalized medicine"]
  },
  "Slinky Dynamics": {
    domain: "wave mechanics and spring physics",
    era: "from Hooke's 1676 spring law to modern soliton physics",
    field: "mechanical physics and wave propagation",
    applications: ["wave demonstration", "shock absorption", "acoustic design", "mechanical engineering"],
    futureDirections: ["metamaterial springs", "wave energy harvesting", "acoustic cloaking"]
  },
  "Rubiks Cube": {
    domain: "group theory and combinatorics",
    era: "Ernő Rubik's 1974 puzzle inspiring decades of mathematical research",
    field: "algebra and computational complexity",
    applications: ["algorithm teaching", "group theory education", "robotics benchmarking", "AI puzzles"],
    futureDirections: ["quantum game theory", "AI speedcubing", "cryptographic puzzles"]
  },
  "Φ³ Aureum": {
    domain: "phi-governed logarithmic geometry with triadic symmetry",
    era: "golden ratio mathematics from ancient Greece to modern complexity theory",
    field: "mathematical aesthetics and natural growth patterns",
    applications: ["natural form generation", "architectural proportions", "growth modeling", "aesthetic design"],
    futureDirections: ["phi-based AI architectures", "natural growth simulation", "consciousness geometry"]
  },
  "Diatoms": {
    domain: "biomimetic silica architecture and microscopic engineering",
    era: "200+ million years of evolution, studied intensively since Ernst Haeckel's 1904 illustrations",
    field: "biomimetics, materials science, and nanotechnology",
    applications: ["lightweight structural design", "aerospace engineering", "nanotechnology", "solar cell optimization", "filtration systems"],
    futureDirections: ["bio-inspired nanotechnology", "silica-based computing", "room-temperature glass fabrication", "hierarchical metamaterials"]
  },
  "Space Biology": {
    domain: "space life sciences and astrobiology",
    era: "from early Skylab experiments to ISS long-duration research and commercial spaceflight",
    field: "aerospace medicine, molecular biology, and NASA OSDR research",
    applications: ["astronaut health monitoring", "radiation countermeasures", "microgravity therapeutics", "life support systems"],
    futureDirections: ["Mars mission health protocols", "space-grown organs", "hibernation technology", "multi-generational spaceflight"]
  },
  "IFS Fractals": {
    domain: "iterated function systems, GPU raymarching, and fractal geometry",
    era: "from Karl Menger's 1926 sponge construction and Benoit Mandelbrot's 1975 fractal geometry to Daniel White and Paul Nylander's 2009 Mandelbulb",
    field: "computational fractal geometry, dynamical systems, and real-time GPU rendering",
    applications: ["procedural world generation", "visual effects and CGI", "antenna and RF design", "nature simulation", "scientific visualization of chaos"],
    futureDirections: ["real-time 4K fractal streaming", "AI-driven attractor discovery", "fractal-based neural architectures", "infinite procedural metaverse environments"]
  },
  "🌀 IFS Fractals": {
    domain: "iterated function systems, GPU raymarching, and fractal geometry",
    era: "from Karl Menger's 1926 sponge construction and Benoit Mandelbrot's 1975 fractal geometry to Daniel White and Paul Nylander's 2009 Mandelbulb",
    field: "computational fractal geometry, dynamical systems, and real-time GPU rendering",
    applications: ["procedural world generation", "visual effects and CGI", "antenna and RF design", "nature simulation", "scientific visualization of chaos"],
    futureDirections: ["real-time 4K fractal streaming", "AI-driven attractor discovery", "fractal-based neural architectures", "infinite procedural metaverse environments"]
  }
};

function findShapeCategory(shapeType: string): string | null {
  for (const category of SHAPE_CATEGORIES) {
    if (category.shapes.includes(shapeType)) {
      return (category as any).label || category.name;
    }
  }
  
  const lowerShape = shapeType.toLowerCase();
  if (lowerShape.includes('menger') || lowerShape.includes('mandelbox') || lowerShape.includes('kleinian') ||
      lowerShape.includes('lsystem_ifs') || lowerShape.includes('reaction_diffusion_ifs') ||
      lowerShape.includes('fractal_weave') || lowerShape.includes('compound_ifs') ||
      lowerShape.includes('icosahedral_ifs') || lowerShape.includes('tetrahedral_fractal') ||
      lowerShape.includes('lattice_fractal') || lowerShape.includes('anisotropic') ||
      lowerShape.includes('chaos_boundary') || lowerShape.includes('mandelbulb') ||
      lowerShape.includes('platonic_icosa') || lowerShape.includes('platonic_octa') ||
      lowerShape.includes('platonic_dodeca') || lowerShape.includes('menger_kleinian')) return "IFS Fractals";
  if (lowerShape.includes('fractal') || lowerShape.includes('mandel') || lowerShape.includes('julia')) return "Fractals";
  if (lowerShape.includes('quantum') || lowerShape.includes('qubit') || lowerShape.includes('wave')) return "Quantum";
  if (lowerShape.includes('dna') || lowerShape.includes('protein') || lowerShape.includes('cell')) return "Biological";
  if (lowerShape.includes('atom') || lowerShape.includes('orbital') || lowerShape.includes('electron')) return "Atomic Structure";
  if (lowerShape.includes('4d') || lowerShape.includes('hyper') || lowerShape.includes('tesseract')) return "4D Hyperdimensional";
  if (lowerShape.includes('torus') || lowerShape.includes('mobius') || lowerShape.includes('klein')) return "Topology";
  if (lowerShape.includes('crypto') || lowerShape.includes('hash') || lowerShape.includes('cipher')) return "Cryptographic";
  if (lowerShape.includes('riemann') || lowerShape.includes('curvature') || lowerShape.includes('geodesic')) return "Riemann Geometry";
  if (lowerShape.includes('attractor') || lowerShape.includes('lorenz') || lowerShape.includes('chaos')) return "Attractors";
  if (lowerShape.includes('time') || lowerShape.includes('temporal') || lowerShape.includes('now')) return "Time Principle";
  if (lowerShape.includes('phenomenon') || lowerShape.includes('geia') || lowerShape.includes('emergence')) return "Phenomenon Principle";
  if (lowerShape.includes('letter_') || lowerShape.includes('linguistic')) return "Linguistic Geometry";
  if (lowerShape.includes('uuon') || lowerShape.includes('tesla') || lowerShape.includes('d13mon')) return "UUON Systems";
  if (lowerShape.includes('wave') || lowerShape.includes('harmonic') || lowerShape.includes('fourier')) return "Waveforms";
  if (lowerShape.includes('ice') || lowerShape.includes('snow') || lowerShape.includes('crystal')) return "Ice Crystals";
  if (lowerShape.includes('thermal') || lowerShape.includes('heat') || lowerShape.includes('cooling')) return "Thermal Engineering";
  if (lowerShape.includes('black_hole') || lowerShape.includes('universe') || lowerShape.includes('cosmic')) return "Cosmology";
  if (lowerShape.includes('einstein') || lowerShape.includes('unified') || lowerShape.includes('toe')) return "Theory of Everything";
  if (lowerShape.includes('minimal') || lowerShape.includes('soap') || lowerShape.includes('catenoid')) return "Minimal Surfaces";
  if (lowerShape.includes('sacred') || lowerShape.includes('golden') || lowerShape.includes('phi')) return "Sacred Geometry";
  if (lowerShape.includes('identity') || lowerShape.includes('cip') || lowerShape.includes('alarex')) return "Scientific Identity";
  if (lowerShape.includes('phi3') || lowerShape.includes('aureum')) return "Φ³ Aureum";
  if (lowerShape.includes('diatom') || lowerShape.includes('frustule') || lowerShape.includes('coscinodiscus') || lowerShape.includes('navicula') || lowerShape.includes('triceratium') || lowerShape.includes('arachnoidiscus')) return "Diatoms";
  
  return null;
}

function formatShapeName(shapeType: string): string {
  return shapeType
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function generateDynamicSummary(
  shapeType: string, 
  formula?: string, 
  description?: string
): ShapeSummary {
  const category = findShapeCategory(shapeType);
  const context = category ? CATEGORY_CONTEXTS[category] : null;
  const displayName = formatShapeName(shapeType);
  
  if (context) {
    const appList = context.applications.slice(0, 3).join(', ');
    const futureList = context.futureDirections.slice(0, 2).join(' and ');
    
    return {
      origin: `The ${displayName} emerges from ${context.domain}, with roots in ${context.era}. It represents a key concept in ${context.field}, connecting mathematical abstraction to observable phenomena.`,
      function: description 
        ? `${description} This ${category} structure is defined by parametric equations that encode its geometric properties, symmetries, and topological characteristics within ${context.field}.`
        : `This ${category} structure maps 2D parameters (u,v) to 3D coordinates (x,y,z), encoding geometric properties and mathematical relationships central to ${context.field}.`,
      applications: `${displayName} finds practical use in ${appList}. Its mathematical structure enables precise modeling and simulation across ${context.field} and related disciplines.`,
      future: `Advances in ${futureList} continue to expand applications. AI-driven mathematical discovery may reveal new connections and unexpected properties of this form.`
    };
  }
  
  return {
    origin: `The ${displayName} is part of Dmension's library of 2,307 parametric equations. It belongs to a rich tradition of mathematical form discovery spanning ancient civilizations to modern computational mathematics.`,
    function: description 
      ? `${description} The shape is defined by parametric equations mapping 2D parameters to 3D coordinates, encoding geometric properties, symmetries, and topological characteristics.`
      : `This shape is defined by parametric equations that map 2D parameters (u,v) to 3D coordinates (x,y,z). These equations encode geometric properties, symmetries, and topological characteristics.`,
    applications: `Mathematical surfaces like ${displayName} find use in scientific visualization, computer graphics, engineering design, educational demonstrations, and artistic expression across many fields.`,
    future: `Advances in computing, 3D printing, and virtual reality continue to expand applications. AI-driven mathematical discovery may reveal new surface families with unexpected properties.`
  };
}

export function getShapeSummary(
  shapeType: string,
  existingSummaries: Record<string, ShapeSummary>,
  formula?: string,
  description?: string
): ShapeSummary {
  if (existingSummaries[shapeType]) {
    return existingSummaries[shapeType];
  }
  
  return generateDynamicSummary(shapeType, formula, description);
}
