export const DMENSION_CATEGORIES = [
  { id: "fractal-iterations", name: "Fractal Iterations", count: 23, domain: "mathematics", earthLink: "Coastlines, fern leaves, river deltas, lightning — nature repeats patterns at every scale" },
  { id: "quantum-physics", name: "Quantum Physics", count: 10, domain: "physics", earthLink: "The behavior of light, how atoms bond, why metals conduct — quantum rules run the physical world" },
  { id: "4d-advanced", name: "4D Advanced Projections", count: 10, domain: "mathematics", earthLink: "Shadows of higher dimensions — like how a 3D object casts a 2D shadow, 4D objects cast 3D shadows" },
  { id: "Medical Imaging", name: "Medical Imaging", count: 20, domain: "science", earthLink: "CT scans, MRI, ultrasound — seeing inside the body without cutting it open" },
  { id: "Linguistic Geometry", name: "Linguistic Geometry", count: 26, domain: "mathematics", earthLink: "Language has shape. Sentence structure follows geometric rules. Grammar is topology." },
  { id: "slinky-dynamics", name: "Slinky Dynamics", count: 20, domain: "physics", earthLink: "Spring mechanics, wave propagation, energy transfer — the physics of how forces travel through connected systems" },
  { id: "rubiks-cube-dynamics", name: "Rubik's Cube Dynamics", count: 20, domain: "mathematics", earthLink: "Group theory in your hands — every rotation is a mathematical operation, every solve is an algorithm" },
  { id: "modulo-uuon", name: "Modulo UUON", count: 16, domain: "mathematics", earthLink: "UUON's original modular arithmetic shapes — clock math made visible, the foundation of cryptography" },
  { id: "modulo-graphics", name: "Modulo Graphics", count: 24, domain: "mathematics", earthLink: "When you wrap numbers around a circle, hidden patterns appear — the same patterns that govern orbits and seasons" },
  { id: "modulo-math", name: "Modulo Mathematics", count: 14, domain: "mathematics", earthLink: "The math of remainders. Time zones, music scales, and computer memory all run on modular arithmetic." },
  { id: "modulo-cs", name: "Modulo Computer Science", count: 13, domain: "technology", earthLink: "Hash tables, checksums, load balancing — modular arithmetic is the backbone of every computer system" },
  { id: "modulo-ai", name: "Modulo AI", count: 7, domain: "technology", earthLink: "Neural network weights, attention mechanisms, transformer architectures — visualized as mathematical surfaces" },
  { id: "modulo-cosmos", name: "Modulo Cosmos", count: 7, domain: "physics", earthLink: "Planetary orbits, galaxy formation, dark matter halos — cosmic patterns expressed in modular geometry" },
  { id: "modulo-crypto", name: "Modulo Cryptography", count: 9, domain: "technology", earthLink: "Elliptic curves, hash functions, zero-knowledge proofs — the math that secures every digital transaction" },
  { id: "modulo-audio", name: "Modulo Audio", count: 11, domain: "science", earthLink: "Sound waves, harmonics, Fourier transforms — every sound you hear is a sum of simple waves" },
  { id: "modulo-robotics", name: "Modulo Robotics", count: 9, domain: "technology", earthLink: "Inverse kinematics, PID control, path planning — the math that makes machines move like living things" },
  { id: "modulo-network", name: "Modulo Networks", count: 7, domain: "technology", earthLink: "Internet routing, graph theory, distributed systems — how information flows through connected networks" },
  { id: "modulo-geometry", name: "Modulo Geometry", count: 10, domain: "mathematics", earthLink: "When geometry meets modular arithmetic — spirals, rosettes, and star polygons emerge from simple rules" },
  { id: "modulo-patterns", name: "Modulo Patterns", count: 12, domain: "mathematics", earthLink: "Wallpaper groups, Islamic tiling, crystallographic symmetry — nature's decorative intelligence" },
  { id: "modulo-chaos", name: "Modulo Chaos", count: 5, domain: "physics", earthLink: "Strange attractors, butterfly effects, deterministic chaos — predictable equations that create unpredictable behavior" },
  { id: "optimization", name: "Optimization", count: 16, domain: "mathematics", earthLink: "Finding the best solution — gradient descent, simulated annealing, genetic algorithms. How nature solves problems." },
  { id: "Nature & Crystals", name: "Nature & Crystals", count: 16, domain: "science", earthLink: "Snowflakes, quartz, diamond lattices — atoms self-organize into perfect geometric structures" },
  { id: "metal", name: "Metallurgy", count: 9, domain: "science", earthLink: "Crystal grain boundaries, alloy microstructures, phase diagrams — the hidden geometry inside every metal" },
  { id: "ceramic", name: "Ceramics", count: 8, domain: "science", earthLink: "Zirconia lattices, piezoelectric crystals, thermal barriers — advanced materials engineered at the atomic level" },
  { id: "phi_dimension", name: "Phi Dimension", count: 6, domain: "mathematics", earthLink: "The golden ratio in sunflowers, nautilus shells, galaxy arms — phi is nature's favorite proportion" },
  { id: "causal_entropic", name: "Causal Entropic Forces", count: 6, domain: "physics", earthLink: "Systems that maximize future freedom of action naturally produce intelligent behavior — entropy as intelligence" },
  { id: "thermodynamic_cosmology", name: "Thermodynamic Cosmology", count: 3, domain: "physics", earthLink: "The universe as a heat engine — from Big Bang to heat death, everything follows thermodynamic laws" },
  { id: "lattice-structures", name: "Lattice Structures", count: 5, domain: "mathematics", earthLink: "Repeating patterns in space — from atomic crystals to city grids, lattices organize everything" },
  { id: "5d-polytopes", name: "5D Polytopes", count: 5, domain: "mathematics", earthLink: "Geometric objects in five dimensions — projected into 3D so human eyes can see impossible shapes" },
  { id: "entropy", name: "Entropy Systems", count: 4, domain: "physics", earthLink: "Disorder always increases — but life, intelligence, and structure are local islands of order in a sea of entropy" },
  { id: "foundational_curves", name: "Foundational Curves", count: 8, domain: "mathematics", earthLink: "Lissajous figures, cycloids, cardioids — the fundamental curves that describe planetary motion, gear teeth, and sound waves" },
  { id: "surfaces_of_revolution", name: "Surfaces of Revolution", count: 5, domain: "mathematics", earthLink: "Spin a curve around an axis and watch a vase, a bell, or a satellite dish appear — engineering from pure math" },
  { id: "parametric-surfaces", name: "Parametric Surfaces", count: 5, domain: "mathematics", earthLink: "Two parameters, three coordinates — the language that describes every curved surface in the universe" },
  { id: "waveforms_harmonics", name: "Waveforms & Harmonics", count: 4, domain: "physics", earthLink: "Every complex wave is a sum of simple ones — Fourier's insight that revolutionized music, radio, and medicine" },
  { id: "minimal_surfaces", name: "Minimal Surfaces", count: 4, domain: "mathematics", earthLink: "Soap bubbles find the smallest surface automatically — nature solves calculus of variations in real time" },
] as const;

export const DMENSION_ENGINES = {
  fractalGeneration: {
    name: "Fractal Generation Engine",
    description: "Iterative function systems that produce self-similar geometry at every scale",
    shapes: ["mandelbrot", "julia_set", "sierpinski_triangle", "koch_snowflake", "barnsley_fern", "menger_sponge"],
    earthApplication: "Modeling coastlines, tree branching, river networks, blood vessels, lightning paths"
  },
  tensorFields: {
    name: "Tensor Field Visualization",
    count: 82,
    description: "Riemann curvature tensors, Christoffel symbols, metric tensors — the mathematics of curved spacetime rendered as interactive 3D surfaces",
    shapes: ["multi_qubit_tensor_product", "einstein_tensor_product", "metric_tensor_surface", "riemann_harmonic_surface"],
    fusionDomains: ["tensor_algebra", "harmonic_analysis", "general_relativity"],
    mathematicalDNA: ["curvature_tensor", "christoffel_symbols", "spherical_harmonics", "riemann_curvature", "tensor_decomposition"],
    earthApplication: "GPS satellite corrections, gravitational lensing prediction, earthquake wave propagation modeling"
  },
  nerfExport: {
    name: "Neural Radiance Field Export",
    count: 11,
    description: "Any mathematical shape can be exported as a NeRF dataset — Fourier-encoded neural network weights that reconstruct the shape from any viewing angle",
    formats: ["nerfstudio", "instant_ngp", "nerf_json"],
    earthApplication: "Photorealistic 3D reconstruction from 2D images, architectural preservation, archaeological digitization"
  },
  collisionPhysics: {
    name: "Collision Operator Systems",
    count: 14,
    description: "BGK, MRT, cascaded, and entropic collision operators from lattice Boltzmann methods — the math of fluid dynamics at the molecular level",
    shapes: ["uuon_brane_collision", "bgk_collision_001", "mrt_collision_001", "cascaded_collision_001", "entropic_collision_001", "uuon_hash_collision"],
    earthApplication: "Aerodynamic simulation, blood flow modeling, weather prediction, pollution dispersion"
  },
  galaxySimulation: {
    name: "Galaxy & Cosmic Systems",
    count: 14,
    description: "Spiral galaxy formation, elliptical galaxy models, dwarf galaxy evolution, black hole mergers, stellar feedback mechanisms",
    shapes: ["spiral_galaxy", "elliptical_galaxy", "galaxy_formation_simulation", "dwarf_galaxy_evolution", "primordial_black_hole_merger"],
    earthApplication: "Understanding cosmic evolution, modeling gravitational interactions, visualizing dark matter distribution"
  },
  quantumVisualization: {
    name: "Quantum Mechanics Visualization",
    count: 502,
    description: "Wave functions, probability densities, Bloch spheres, quantum entanglement, superposition states — the invisible world made visible",
    earthApplication: "Quantum computing education, molecular orbital visualization, spectroscopy training"
  },
  therapeuticGeometry: {
    name: "Therapeutic Geometry",
    count: 107,
    description: "Sacred geometry, healing frequencies, consciousness research shapes — geometry designed for PTSD therapy and meditative applications",
    earthApplication: "Mental health treatment, meditation aids, therapeutic visualization for trauma recovery"
  },
  waveSystems: {
    name: "Wave & Field Systems",
    count: 336,
    description: "Electromagnetic waves, gravitational waves, acoustic waves, quantum wave functions — every type of wave the universe produces",
    earthApplication: "Communication systems, sonar, seismology, musical instrument design, medical ultrasound"
  },
  biologicalModeling: {
    name: "Biological Structure Modeling",
    count: 61,
    description: "DNA helices, protein folding, cell membranes, neural networks, molecular dynamics — life's architecture",
    earthApplication: "Drug design, genetic research, biomimetic engineering, medical education"
  },
  parametricSurfaces: {
    name: "Parametric Surface Engine",
    count: 102,
    description: "The core rendering engine — any mathematical equation with two parameters mapped to three-dimensional space. Real-time WebGL rendering with adjustable parameters.",
    earthApplication: "Industrial design, architectural modeling, engineering simulation, educational mathematics"
  },
} as const;

export const PUBLICATION_SECTIONS = [
  { ref: "3.1.A", title: "Relativity × Thermal Polar Fields", domain: "Cross-domain fusion of general relativity and thermal engineering" },
  { ref: "3.1.B", title: "Quantum Gravity × Interference Cooling", domain: "Quantum-inspired cooling lattice models" },
  { ref: "3.1.C", title: "Tensor Algebra × Spherical Harmonics", domain: "Curvature tensor decomposition in harmonic basis" },
  { ref: "3.1.D", title: "Polynomial COP × Harmonic Decomposition", domain: "Ultra-smooth efficiency surface modeling" },
] as const;

export const DMENSION_STATS = {
  totalShapes: 2642,
  totalCategories: 35,
  totalEngines: 10,
  tensorFieldCount: 82,
  nerfCapable: true,
  collisionOperators: 14,
  galaxyModels: 14,
  quantumShapes: 502,
  therapeuticShapes: 107,
  waveSystems: 336,
  biologicalModels: 61,
  publicationSections: 4,
  fusionDomains: ["tensor_algebra", "harmonic_analysis", "general_relativity", "quantum_physics", "thermal_engineering", "approximation_theory"],
  mathematicalDNA: ["curvature_tensor", "christoffel_symbols", "spherical_harmonics", "riemann_curvature", "exponential_decay", "radial_symmetry", "fourier_series", "wavefunction", "probability_density"],
  renderingTech: "WebGL 2.0 + Three.js",
  exportFormats: ["STL", "OBJ", "GLTF", "PLY", "NeRF/Nerfstudio"],
};

export function searchDmensionShapes(query: string): { category: string; name: string; earthLink: string; domain: string }[] {
  const lower = query.toLowerCase();
  const results: { category: string; name: string; earthLink: string; domain: string }[] = [];

  for (const cat of DMENSION_CATEGORIES) {
    const nameMatch = cat.name.toLowerCase().includes(lower);
    const domainMatch = cat.domain.toLowerCase().includes(lower);
    const earthMatch = cat.earthLink.toLowerCase().includes(lower);
    if (nameMatch || domainMatch || earthMatch) {
      results.push({ category: cat.id, name: cat.name, earthLink: cat.earthLink, domain: cat.domain });
    }
  }

  for (const [key, engine] of Object.entries(DMENSION_ENGINES)) {
    const nameMatch = engine.name.toLowerCase().includes(lower);
    const descMatch = engine.description.toLowerCase().includes(lower);
    const appMatch = engine.earthApplication.toLowerCase().includes(lower);
    if (nameMatch || descMatch || appMatch) {
      results.push({ category: key, name: engine.name, earthLink: engine.earthApplication, domain: "engine" });
    }
  }

  return results.slice(0, 8);
}

export function getDmensionContextForPrompt(): string {
  return `Δmension contains ${DMENSION_STATS.totalShapes} interactive 3D mathematical shapes across ${DMENSION_STATS.totalCategories} categories. Key engines: ${Object.values(DMENSION_ENGINES).map(e => e.name).join(", ")}. Rendering: ${DMENSION_STATS.renderingTech}. Export formats: ${DMENSION_STATS.exportFormats.join(", ")}. Tensor fields: ${DMENSION_STATS.tensorFieldCount} shapes. NeRF export: supported. Collision operators: ${DMENSION_STATS.collisionOperators}. Galaxy simulations: ${DMENSION_STATS.galaxyModels}. Publication-grade mathematical DNA patterns available.`;
}

export function getEarthImpactModel(domain: string): {
  reductionTarget: string;
  mechanism: string;
  dmensionConnection: string;
  measurable: string;
} {
  const models: Record<string, { reductionTarget: string; mechanism: string; dmensionConnection: string; measurable: string }> = {
    energy: {
      reductionTarget: "Thermal waste in computing infrastructure",
      mechanism: "COP (Coefficient of Performance) optimization using Δmension's thermal engineering shapes — Schwarzschild metric efficiency models, Chebyshev polynomial interpolation for smooth cooling curves",
      dmensionConnection: "Publication Section 3.1.A: Relativity × Thermal Polar Fields — 31 shapes including heat dissipation, PUE/COP efficiency, Navier-Stokes CFD",
      measurable: "PUE (Power Usage Effectiveness) reduction from industry average 1.58 to target 1.1"
    },
    education: {
      reductionTarget: "Gatekeeping in mathematical understanding",
      mechanism: "Free interactive 3D visualization of concepts that usually require graduate-level abstraction — making tensor fields, quantum mechanics, and topology tangible",
      dmensionConnection: "2642+ shapes spanning parametric surfaces, fractals, quantum systems, 4D projections — each with adjustable parameters for self-directed learning",
      measurable: "Concepts that take semesters to grasp become explorable in minutes through interactive geometry"
    },
    waste: {
      reductionTarget: "Material waste through structural optimization",
      mechanism: "Minimal surfaces (soap film mathematics) and lattice structures optimize material distribution — maximum strength with minimum material, nature's engineering principle",
      dmensionConnection: "TPMS/Minimal Surfaces, lattice structures, Nature & Crystals categories — biomimetic structural patterns",
      measurable: "Topology optimization can reduce material usage 30-60% while maintaining structural integrity"
    },
    health: {
      reductionTarget: "Barriers to therapeutic intervention",
      mechanism: "107 therapeutic geometry shapes designed for PTSD recovery, meditative states, and consciousness research — geometry as medicine",
      dmensionConnection: "Sacred geometry library, therapeutic shape categories, consciousness research platform — free and accessible",
      measurable: "Visual-geometric therapy as accessible complement to traditional treatment, zero cost to end user"
    },
    fraud: {
      reductionTarget: "Opacity in scientific communication",
      mechanism: "Making mathematical formulas visible and interactive eliminates the gatekeeping of abstract notation — if you can see it, you can question it",
      dmensionConnection: "Every Δmension shape is generated from real equations, not AI or manual sculpting — verifiable mathematical provenance",
      measurable: "Transparency through visualization — every equation visible, every parameter adjustable, every claim testable"
    },
  };

  return models[domain] || models.waste;
}
