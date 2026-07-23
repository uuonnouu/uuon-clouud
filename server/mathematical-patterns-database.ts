export interface MathematicalPattern {
  equations: string[];
  properties: string[];
  applications: string[];
  fieldOfStudy: string[];
  scientificBenefit: string;
  parameterMeaning: Record<string, string>;
}

// Cache mathematical constants
const CACHED_CONSTANTS = {
  PI: Math.PI,
  TWO_PI: 2 * Math.PI,
  HALF_PI: Math.PI / 2,
  GOLDEN_RATIO: (1 + Math.sqrt(5)) / 2,
  E: Math.E
};

export const MATHEMATICAL_PATTERNS: Record<string, MathematicalPattern> = {
  // BASIC GEOMETRY
  sphere: {
    equations: [
      'x(u,v) = a·sin(v)·cos(u)',
      'y(u,v) = a·sin(v)·sin(u)',
      'z(u,v) = a·cos(v)',
      'Implicit: x² + y² + z² = a²',
      'Surface area: 4πa²',
      'Volume: (4/3)πa³'
    ],
    properties: [
      'Perfect rotational symmetry in all axes',
      'Minimal surface area for given volume',
      'Constant Gaussian curvature K = 1/a²',
      'All points equidistant from center',
      'Zero mean curvature except at center'
    ],
    applications: [
      'Planetary models and celestial mechanics',
      'Atomic orbital visualization',
      'Meditation and consciousness geometry',
      'Bubble physics and surface tension',
      'Geographic projections'
    ],
    fieldOfStudy: [
      'Differential Geometry',
      'Theoretical Physics',
      'Sacred Geometry',
      'Astronomy',
      'Quantum Mechanics'
    ],
    scientificBenefit: 'Foundational shape for understanding symmetry, curvature, and minimal surfaces. Essential for modeling physical phenomena from atoms to galaxies.',
    parameterMeaning: {
      a: 'Radius - controls overall sphere size',
      u: 'Azimuthal angle (0 to 2π) - longitude',
      v: 'Polar angle (0 to π) - latitude'
    }
  },

  cube: {
    equations: [
      'Face equations: x = ±a/2, y = ±a/2, z = ±a/2',
      'Vertices: 8 corners at (±a/2, ±a/2, ±a/2)',
      'Edges: 12 segments of length a',
      'Faces: 6 squares of area a²',
      'Volume: a³',
      'Surface area: 6a²'
    ],
    properties: [
      'Six-fold rotational symmetry',
      'Three perpendicular reflection planes',
      'Regular hexahedron (Platonic solid)',
      'Dual polyhedron of octahedron',
      'Euler characteristic χ = 2'
    ],
    applications: [
      'Crystallography and cubic lattices',
      'Computer graphics and voxel rendering',
      'Architectural design and space division',
      'Educational geometry foundation',
      'Rubik\'s cube mathematics'
    ],
    fieldOfStudy: [
      'Euclidean Geometry',
      'Group Theory',
      'Crystallography',
      'Computer Science',
      'Architecture'
    ],
    scientificBenefit: 'Fundamental for understanding 3D space, symmetry groups, and tessellation. Critical in crystal structure analysis and computational geometry.',
    parameterMeaning: {
      a: 'Edge length - defines cube dimensions',
      b: 'Width scaling (X-axis)',
      c: 'Height scaling (Y-axis)',
      d: 'Depth scaling (Z-axis)'
    }
  },

  torus: {
    equations: [
      'x(u,v) = (R + r·cos(v))·cos(u)',
      'y(u,v) = (R + r·cos(v))·sin(u)',
      'z(u,v) = r·sin(v)',
      'Major radius R (a), minor radius r (b)',
      'Surface area: 4π²Rr',
      'Volume: 2π²Rr²'
    ],
    properties: [
      'Genus-1 topology (one hole)',
      'Non-simply connected surface',
      'Gaussian curvature K = cos(v)/(r(R + r·cos(v)))',
      'Rotational symmetry about Z-axis',
      'Meridian and parallel circles'
    ],
    applications: [
      'Plasma confinement in tokamak reactors',
      'Electromagnetic coil design',
      'Energy flow and circulation patterns',
      'Topological data analysis',
      'Knot theory foundations'
    ],
    fieldOfStudy: [
      'Topology',
      'Plasma Physics',
      'Differential Geometry',
      'Energy Systems',
      'Knot Theory'
    ],
    scientificBenefit: 'Essential for nuclear fusion research (tokamak design), understanding circulation in fluid dynamics, and topological classification of surfaces.',
    parameterMeaning: {
      a: 'Major radius R - distance from torus center to tube center',
      b: 'Minor radius r - tube thickness',
      u: 'Toroidal angle (0 to 2π)',
      v: 'Poloidal angle (0 to 2π)'
    }
  },

  klein_bottle: {
    equations: [
      'x = (a + b·cos(v/2)·sin(u) - b·sin(v/2)·sin(2u))·cos(v)',
      'y = (a + b·cos(v/2)·sin(u) - b·sin(v/2)·sin(2u))·sin(v)',
      'z = b·sin(v/2)·sin(u) + b·cos(v/2)·sin(2u)',
      '4D immersion: Self-intersection in 3D',
      'Euler characteristic: χ = 0'
    ],
    properties: [
      'Non-orientable surface (no inside/outside)',
      'One-sided surface like Möbius strip',
      'Requires 4D space for true embedding',
      'Self-intersection in 3D projection',
      'Closed non-orientable 2-manifold'
    ],
    applications: [
      'Topology education and visualization',
      'Non-orientable manifold research',
      'Consciousness expansion geometry',
      'Abstract mathematical art',
      'Fiber bundle theory'
    ],
    fieldOfStudy: [
      'Topology',
      'Differential Geometry',
      'Abstract Mathematics',
      'Consciousness Studies',
      'Higher-Dimensional Geometry'
    ],
    scientificBenefit: 'Demonstrates non-orientability and higher-dimensional concepts. Critical for understanding manifold theory and topological invariants.',
    parameterMeaning: {
      a: 'Figure-8 loop major radius',
      b: 'Bottle width',
      u: 'Figure-8 parameter (0 to π)',
      v: 'Rotation parameter (0 to 2π)'
    }
  },

  moebius_strip: {
    equations: [
      'x(u,v) = (R + v·cos(u/2))·cos(u)',
      'y(u,v) = (R + v·cos(u/2))·sin(u)',
      'z(u,v) = v·sin(u/2)',
      'Edge: Single continuous boundary',
      'Half-twist parameterization'
    ],
    properties: [
      'Non-orientable surface with boundary',
      'Single continuous edge',
      'One-sided surface',
      'Euler characteristic: χ = 0',
      'Boundary is unknotted circle'
    ],
    applications: [
      'Conveyor belt design (continuous loop)',
      'Electronic circuit topology',
      'Infinity symbolism',
      'Topological consciousness models',
      'Recycling system optimization'
    ],
    fieldOfStudy: [
      'Topology',
      'Engineering Design',
      'Industrial Automation',
      'Philosophy of Mathematics',
      'Consciousness Research'
    ],
    scientificBenefit: 'Practical applications in industrial conveyor systems. Fundamental example of non-orientability and topological paradoxes.',
    parameterMeaning: {
      a: 'Strip radius (major radius)',
      u: 'Angle parameter (0 to 1)',
      v: 'Width parameter (0 to 1)'
    }
  },

  // MEDICAL TPMS SCAFFOLDS
  gyroid_tpms: {
    equations: [
      'sin(2πx/λ)·cos(2πy/λ) + sin(2πy/λ)·cos(2πz/λ) + sin(2πz/λ)·cos(2πx/λ) = k·t',
      'Minimal surface equation: H = 0 (zero mean curvature)',
      'Triply periodic in X, Y, Z directions',
      'Symmetry group: I4₁32 (cubic)',
      'Level set: F(x,y,z) = constant'
    ],
    properties: [
      'Zero mean curvature everywhere',
      'Triply periodic minimal surface',
      'Interpenetrating networks',
      'High surface area to volume ratio',
      'Mechanically isotropic'
    ],
    applications: [
      'Bone tissue scaffolds (spinal cages, hip implants)',
      'Osseointegration-optimized implants',
      'Load-bearing orthopedic devices',
      'Energy absorption structures',
      'Cell adhesion and proliferation'
    ],
    fieldOfStudy: [
      'Biomedical Engineering',
      'Tissue Engineering',
      'Orthopedic Surgery',
      'Materials Science',
      'Additive Manufacturing'
    ],
    scientificBenefit: 'Superior cell adhesion, vascularization, and bone ingrowth. Optimal 60-70% porosity mimics trabecular bone. Clinically proven for spinal fusion and hip replacements.',
    parameterMeaning: {
      a: 'Lattice period length',
      b: 'Porosity coefficient (controls pore size)',
      c: 'Surface thickness offset',
      u: 'X spatial parameter (0 to 1)',
      v: 'Y spatial parameter (0 to 1)'
    }
  },

  diamond_tpms: {
    equations: [
      'cos(2πx/λ)·cos(2πy/λ)·cos(2πz/λ) - sin(2πx/λ)·sin(2πy/λ)·sin(2πz/λ) = k·t',
      'Schwarz Diamond (D-surface)',
      'Symmetry: Cubic Im3m space group',
      'Highest mechanical strength among TPMS'
    ],
    properties: [
      'Maximum compressive strength',
      'Cubic symmetry structure',
      'Interconnected pore network',
      'Excellent load distribution',
      'Anisotropic mechanical properties'
    ],
    applications: [
      'Load-bearing intervertebral cages',
      'Knee and hip prosthetics',
      'High-stress orthopedic implants',
      'Dental implants',
      'Spinal fusion devices'
    ],
    fieldOfStudy: [
      'Orthopedic Engineering',
      'Biomechanics',
      'Implant Design',
      'Materials Engineering',
      '3D Printing/Additive Manufacturing'
    ],
    scientificBenefit: 'Highest compressive strength among TPMS structures. Ideal for load-bearing applications with 70% porosity for optimal bone ingrowth and blood vessel formation.',
    parameterMeaning: {
      a: 'Unit cell size',
      b: 'Porosity control parameter',
      c: 'Thickness parameter',
      u: 'X spatial parameter (0 to 1)',
      v: 'Y spatial parameter (0 to 1)'
    }
  },

  primitive_tpms: {
    equations: [
      'cos(2πx/λ) + cos(2πy/λ) + cos(2πz/λ) = k·t',
      'Schwarz P-surface (Primitive)',
      'Simplest TPMS geometry',
      'Fast fabrication due to simple equation'
    ],
    properties: [
      'Simplest minimal surface structure',
      'Cubic primitive lattice',
      'Uniform pore distribution',
      'Isotropic mechanical properties',
      'Easy to manufacture'
    ],
    applications: [
      'Cortical bone replacement',
      'Cranial implants',
      'General orthopedic scaffolds',
      'Rapid prototyping applications',
      'Educational medical models'
    ],
    fieldOfStudy: [
      'Biomedical Engineering',
      'Bone Tissue Engineering',
      'Regenerative Medicine',
      'Rapid Prototyping',
      'Clinical Medicine'
    ],
    scientificBenefit: 'Mimics natural cortical bone density at 60% porosity. Fastest to manufacture among TPMS. Excellent for general-purpose bone scaffolds and seamless integration.',
    parameterMeaning: {
      a: 'Lattice constant',
      b: 'Porosity factor parameter',
      c: 'Surface offset parameter',
      u: 'X spatial parameter (0 to 1)',
      v: 'Y spatial parameter (0 to 1)'
    }
  },

  iws_tpms: {
    equations: [
      '2·(cos(2πx/λ)·cos(2πy/λ) + cos(2πy/λ)·cos(2πz/λ) + cos(2πz/λ)·cos(2πx/λ)) - (cos(4πx/λ) + cos(4πy/λ) + cos(4πz/λ)) = k·t',
      'I-Wrapped Package Graph (IWS)',
      'Complex interconnected network',
      'Advanced tissue engineering surface'
    ],
    properties: [
      'Complex pore interconnectivity',
      'High surface area',
      'Optimal for vascularization',
      'Graduated pore sizes',
      'Enhanced cell migration pathways'
    ],
    applications: [
      'Vascular tissue engineering',
      'Blood vessel formation scaffolds',
      'Soft tissue regeneration',
      'Complex organ scaffolds',
      'Angiogenesis promotion'
    ],
    fieldOfStudy: [
      'Vascular Engineering',
      'Tissue Regeneration',
      'Angiogenesis Research',
      'Soft Tissue Engineering',
      'Regenerative Medicine'
    ],
    scientificBenefit: 'Superior vascularization support with 68% porosity. Optimal for blood vessel formation and nutrient flow. Advanced tissue engineering applications.',
    parameterMeaning: {
      a: 'Network period',
      b: 'Porosity coefficient',
      c: 'Pore sizing parameter',
      u: 'X spatial parameter (0 to 1)',
      v: 'Y spatial parameter (0 to 1)'
    }
  },

  // TOPOLOGY & KNOT THEORY
  trefoil_knot: {
    equations: [
      'x(t) = sin(t) + 2·sin(2t)',
      'y(t) = cos(t) - 2·cos(2t)',
      'z(t) = -sin(3t)',
      'Parametric: t ∈ [0, 2π]',
      'Knot notation: 3₁ (simplest non-trivial knot)'
    ],
    properties: [
      'Three-fold rotational symmetry',
      'Unknotting number: 1',
      'Bridge number: 2',
      'Crossing number: 3',
      'Chiral (non-superimposable on mirror image)'
    ],
    applications: [
      'DNA topology and supercoiling',
      'Protein folding patterns',
      'Knot theory mathematics',
      'Molecular chirality studies',
      'Quantum entanglement visualization'
    ],
    fieldOfStudy: [
      'Knot Theory',
      'Molecular Biology',
      'Biochemistry',
      'Topology',
      'Quantum Physics'
    ],
    scientificBenefit: 'Models DNA supercoiling and protein folding. Essential for understanding molecular topology and chirality in biochemistry.',
    parameterMeaning: {
      a: 'Knot size scaling',
      u: 'Parameter t (0 to 1, maps to 0-2π)',
      v: 'Tube thickness parameter'
    }
  },

  // HIGHER DIMENSIONS
  tesseract_4d: {
    equations: [
      '4D vertices: 16 at (±1, ±1, ±1, ±1)',
      'Edges: 32 segments',
      'Faces: 24 squares',
      'Cells: 8 cubes',
      'Stereographic projection: (x,y,z) = (X/(1-W), Y/(1-W), Z/(1-W))'
    ],
    properties: [
      'Regular 8-cell (Platonic analog in 4D)',
      'Hypervolume: (2a)⁴ = 16a⁴',
      'Hypersurface area: 8a³',
      'Dual polytope: 16-cell',
      'Symmetry group: BC₄'
    ],
    applications: [
      'Space-time visualization',
      'Consciousness expansion geometry',
      'Higher-dimensional mathematics education',
      'Quantum computing qubit visualization',
      'Theoretical physics models'
    ],
    fieldOfStudy: [
      'Higher-Dimensional Geometry',
      'Theoretical Physics',
      'Consciousness Studies',
      'Quantum Computing',
      'Mathematics Education'
    ],
    scientificBenefit: 'Essential for understanding 4D space-time in relativity. Visualizes higher-dimensional concepts critical for modern physics and consciousness research.',
    parameterMeaning: {
      a: 'Edge length in 4D space',
      b: 'Rotation angle W-axis',
      c: 'Projection distance parameter',
      u: 'Rotation parameter (0 to 1)',
      v: 'Orientation parameter (0 to 1)'
    }
  },

  // CELLULAR ORGANELLES
  mitochondria: {
    equations: [
      'r(θ,φ) = b·sin(φ)·[1 + 0.08·|sin(18φ)|·sin(5.4θ)]',
      'x = r·cos(θ), y = r·sin(θ), z = a·cos(φ)·2.5',
      'θ = u·2π (azimuthal), φ = v·π (polar)',
      'Elongated ellipsoid: aspect ratio 2.5:1',
      'Cristae ridges: 18 folds with 0.08 depth modulation'
    ],
    properties: [
      'Elongated ellipsoidal double-membrane structure',
      'Cristae folds: 15-20 inner membrane ridges',
      'ATP production organelle (powerhouse of cell)',
      'Size: 1-10μm length, 0.5-1μm diameter',
      'Surface area enhanced by cristae folding'
    ],
    applications: [
      'Cellular energy metabolism visualization',
      'Mitochondrial disease diagnosis',
      'Aging and longevity research',
      'Pharmaceutical targeting of metabolic disorders',
      'Bio-inspired energy systems'
    ],
    fieldOfStudy: [
      'Cell Biology',
      'Biochemistry',
      'Biophysics',
      'Medicine',
      'Bioengineering'
    ],
    scientificBenefit: 'Models energy production organelle essential for aerobic respiration. Critical for understanding metabolic diseases, aging, and cellular energetics.',
    parameterMeaning: {
      a: 'Length axis scaling factor (controls elongation)',
      b: 'Radial width scaling (controls thickness)',
      u: 'Azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1)'
    }
  },

  nucleus: {
    equations: [
      'r(θ,φ) = a·sin(φ)·[1 + 0.08·sin(12θ)·sin(10φ)]',
      'x = r·cos(θ), y = r·sin(θ), z = a·cos(φ)',
      'θ = u·2π (azimuthal), φ = v·π (polar)',
      'Chromatin texture: amplitude 0.08 at 12×10 frequencies',
      'Spherical base with surface modulation for nuclear pores'
    ],
    properties: [
      'Largest cellular organelle (10-20μm diameter)',
      'Double membrane nuclear envelope',
      'Contains genetic material (DNA/chromatin)',
      'Nuclear pore complexes for transport',
      'Nucleolus visible as dense region'
    ],
    applications: [
      'Genetics and gene expression studies',
      'Cancer cell nucleus morphology analysis',
      'Epigenetics visualization',
      'Chromatin organization research',
      'Nuclear medicine imaging'
    ],
    fieldOfStudy: [
      'Cell Biology',
      'Genetics',
      'Molecular Biology',
      'Cancer Research',
      'Medicine'
    ],
    scientificBenefit: 'Models cellular control center containing genetic information. Essential for understanding gene regulation, cell division, and genetic diseases.',
    parameterMeaning: {
      a: 'Nuclear radius (controls overall size)',
      u: 'Azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1)'
    }
  },

  golgi_apparatus: {
    equations: [
      'x = a·(u-0.5)·[1 + 0.15·sin(6θ)]',
      'y = b·(v-0.5)·[1 + 0.12·cos(5φ)]',
      'z = c·layerIndex + 0.1·sin(8θ)·cos(6φ)',
      'θ = u·2π, φ = v·2π',
      'Stacked layers: 4-8 cisternae with curved edges'
    ],
    properties: [
      'Stacked membrane cisternae (4-8 layers)',
      'Cis face (receiving) and trans face (shipping)',
      'Protein modification and sorting organelle',
      'Size: 1-3μm across, 0.5-1μm height',
      'Dynamic vesicle formation at edges'
    ],
    applications: [
      'Protein trafficking pathway studies',
      'Glycosylation and post-translational modifications',
      'Secretory cell function analysis',
      'Golgi disease mechanisms',
      'Intracellular transport modeling'
    ],
    fieldOfStudy: [
      'Cell Biology',
      'Biochemistry',
      'Molecular Biology',
      'Physiology',
      'Medicine'
    ],
    scientificBenefit: 'Models protein processing and sorting organelle. Critical for understanding secretory pathways and glycosylation in cellular function.',
    parameterMeaning: {
      a: 'Cisterna width (X dimension)',
      b: 'Cisterna depth (Y dimension)',
      c: 'Layer spacing (Z stacking)',
      u: 'Horizontal parameter (0 to 1)',
      v: 'Vertical parameter (0 to 1)'
    }
  },

  axon_with_myelin: {
    equations: [
      'x = a·u (linear axon trajectory)',
      'y = r(u)·cos(θ), z = r(u)·sin(θ)',
      'r(u) = (sin(d·u·π) > 0.8) ? b : c·[1 + e·sin(100u)]',
      'θ = v·2π (circumferential angle)',
      'Nodes of Ranvier at: sin(d·u·π) > 0.8'
    ],
    properties: [
      'Segmented myelin sheath structure',
      'Nodes of Ranvier: unmyelinated gaps (1-2μm)',
      'Internodal segments: 0.2-2mm length',
      'Saltatory conduction of action potentials',
      'Myelin wraps: 10-150 layers around axon'
    ],
    applications: [
      'Neural signal transmission modeling',
      'Multiple sclerosis and demyelination diseases',
      'Action potential propagation studies',
      'Neural prosthetics design',
      'Nerve regeneration research'
    ],
    fieldOfStudy: [
      'Neuroscience',
      'Neurophysiology',
      'Neurology',
      'Biophysics',
      'Medicine'
    ],
    scientificBenefit: 'Models myelinated nerve fiber enabling rapid signal transmission. Essential for understanding neural communication and demyelination disorders.',
    parameterMeaning: {
      a: 'Axon total length',
      b: 'Axon core radius at nodes (0.05 default)',
      c: 'Myelin sheath thickness (0.15 default)',
      d: 'Number of myelin segments (10 default)',
      e: 'Myelin wrap modulation (0.2 default)',
      u: 'Length parameter (0 to 1)',
      v: 'Circumferential parameter (0 to 1)'
    }
  },

  diamond_round_brilliant: {
    equations: [
      'Crown: pavilion depth = 0.43·diameter',
      'Table size = 0.53·diameter',
      'Crown angle = 34.5°, Pavilion angle = 40.75°',
      '57-58 facets total (Tolkowsky proportions)',
      'Light return optimization: critical angle refraction'
    ],
    properties: [
      '57-58 facets for maximum brilliance',
      'Tolkowsky ideal proportions (1919)',
      'Total internal reflection maximization',
      'Refractive index n=2.417 (diamond)',
      'Critical angle θc = 24.4° for diamond-air interface'
    ],
    applications: [
      'Gemology and diamond grading',
      'Optical design and light trapping',
      'Jewelry design and valuation',
      'Ray tracing simulations',
      'Photonics and light management'
    ],
    fieldOfStudy: [
      'Gemology',
      'Optics',
      'Materials Science',
      'Jewelry Design',
      'Photonics'
    ],
    scientificBenefit: 'Models optimal facet arrangement for maximum light return and brilliance. Foundation for understanding optical properties and gemstone cutting.',
    parameterMeaning: {
      a: 'Diamond diameter',
      b: 'Crown height ratio',
      c: 'Pavilion depth ratio',
      d: 'Table size ratio'
    }
  },

  hydrogen_1s_orbital: {
    equations: [
      'ψ₁ₛ(r) = (1/√π)·(1/a₀)^(3/2)·exp(-r/a₀)',
      'Probability density: P(r) = |ψ₁ₛ|² = (1/πa₀³)·exp(-2r/a₀)',
      'Visualization: r = u·4a, ρ = r + exp(-r/a)·2a (Bohr radius a₀ = 0.529 Å)',
      'Spherical coordinates: θ = v·π, φ = u·2π'
    ],
    properties: [
      'Ground state of hydrogen atom',
      'Spherically symmetric (s-orbital)',
      'No angular nodes (l=0)',
      'Quantum numbers: n=1, l=0, m=0',
      'Maximum probability at nucleus'
    ],
    applications: [
      'Quantum chemistry foundation',
      'Atomic orbital theory',
      'Chemical bonding models',
      'Spectroscopy analysis',
      'Quantum mechanics education'
    ],
    fieldOfStudy: [
      'Quantum Mechanics',
      'Atomic Physics',
      'Chemistry',
      'Physical Chemistry',
      'Quantum Chemistry'
    ],
    scientificBenefit: 'Models fundamental quantum state of simplest atom. Essential for understanding wave-particle duality and quantum mechanical foundations.',
    parameterMeaning: {
      a: 'Orbital size scaling (default 1.5 Bohr radii)',
      u: 'Radial/azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1)'
    }
  },

  hydrogen_2p_orbital: {
    equations: [
      'ψ₂p(r,θ) ∝ r·exp(-r/2a₀)·cos(θ)',
      'Probability: P(r,θ) = r²·exp(-r/a₀)·cos²(θ)',
      'Visualization: r = u·8a, ρ = r + sign·P(r,θ)·3a',
      'Dumbbell lobes: sign changes at θ = π/2',
      'Quantum numbers: n=2, l=1, m=0 (p_z orientation)'
    ],
    properties: [
      'First excited state with angular momentum',
      'Dumbbell-shaped probability distribution',
      'One nodal plane at z=0',
      'Angular quantum number l=1',
      'Three degenerate p orbitals (px, py, pz)'
    ],
    applications: [
      'Chemical bond formation (sp, sp², sp³)',
      'Molecular orbital theory',
      'Valence bond theory',
      'Transition metal chemistry',
      'Spectroscopy (p→s transitions)'
    ],
    fieldOfStudy: [
      'Quantum Chemistry',
      'Molecular Physics',
      'Inorganic Chemistry',
      'Spectroscopy',
      'Materials Science'
    ],
    scientificBenefit: 'Models directional bonding in chemistry. Critical for understanding covalent bonds, molecular geometry, and electronic transitions.',
    parameterMeaning: {
      a: 'Orbital size scaling (default 1.8 Bohr radii)',
      u: 'Radial/azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1, creates lobes)'
    }
  },

  hydrogen_3d_orbital: {
    equations: [
      'ψ₃d(r,θ) ∝ r²·exp(-r/3a₀)·(3cos²θ - 1)',
      'Probability: P(r,θ) = r⁴·exp(-2r/3a₀)·(3cos²θ - 1)²',
      'Visualization: r = u·12a, ρ = r + sign·√P(r,θ)·2a',
      'Four-lobe cloverleaf pattern from angular term',
      'Quantum numbers: n=3, l=2, m=0 (d_z² orbital)'
    ],
    properties: [
      'Second excited state with high angular momentum',
      'Cloverleaf (four-lobe) probability distribution',
      'Two conical nodal surfaces',
      'Angular quantum number l=2',
      'Five degenerate d orbitals'
    ],
    applications: [
      'Transition metal chemistry and catalysis',
      'Crystal field theory',
      'Coordination compounds',
      'Magnetic properties of materials',
      'Advanced spectroscopy (d-d transitions)'
    ],
    fieldOfStudy: [
      'Inorganic Chemistry',
      'Solid State Physics',
      'Materials Science',
      'Catalysis',
      'Magnetism'
    ],
    scientificBenefit: 'Models complex bonding in transition metals. Essential for understanding catalysis, magnetism, and colored coordination compounds.',
    parameterMeaning: {
      a: 'Orbital size scaling (default 2.0 Bohr radii)',
      u: 'Radial/azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1, creates 4 lobes)'
    }
  },

  lysosome: {
    equations: [
      'r(θ,φ) = a·sin(φ)·[1 + 0.04·sin(25θ)·sin(20φ) + 0.02·sin(15θ + 12φ) + 0.05·exp(-3(φ - π/2)²)]',
      'x = r·cos(θ), y = r·sin(θ), z = a·cos(φ)',
      'θ = u·2π, φ = v·π',
      'Enzyme granules: sin(25θ)·sin(20φ)',
      'Dense acidic core: exp(-3(φ - π/2)²)'
    ],
    properties: [
      'Membrane-bound digestive organelle',
      'Acidic interior pH 4.5-5.0',
      'Contains 50+ hydrolytic enzymes',
      'Size: 0.1-1.2μm diameter',
      'Single-membrane vesicle structure'
    ],
    applications: [
      'Lysosomal storage disease research',
      'Cellular autophagy studies',
      'Drug delivery systems',
      'Cancer cell death mechanisms',
      'Aging and cellular recycling'
    ],
    fieldOfStudy: [
      'Cell Biology',
      'Medicine',
      'Biochemistry',
      'Pharmacology',
      'Pathology'
    ],
    scientificBenefit: 'Models cellular waste disposal and recycling system. Critical for understanding storage diseases, autophagy, and cellular homeostasis.',
    parameterMeaning: {
      a: 'Lysosome diameter (default 0.4)',
      u: 'Azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1)'
    }
  },

  ribosome: {
    equations: [
      'r(θ,φ) = a·sin(φ) + L(φ) + S(φ) + gap(φ)',
      'L(φ) = 0.08·exp(-8(φ - 0.7π)²) for φ > π/2 (large subunit)',
      'S(φ) = 0.06·exp(-8(φ - 0.3π)²) for φ < π/2 (small subunit)',
      'gap(φ) = -0.02 for |φ - π/2| < 0.2 (interface/mRNA tunnel)',
      'θ = u·2π, φ = v·π'
    ],
    properties: [
      'Two-subunit molecular machine (60S + 40S)',
      'Size: 20-30nm (eukaryotic 80S ribosome)',
      'Protein synthesis factory',
      'rRNA and protein complex',
      'Interface creates mRNA/tRNA binding sites'
    ],
    applications: [
      'Protein synthesis mechanism studies',
      'Antibiotic development (targets bacterial ribosomes)',
      'Translation regulation research',
      'Genetic code decoding',
      'Ribosomal disease diagnosis'
    ],
    fieldOfStudy: [
      'Molecular Biology',
      'Biochemistry',
      'Structural Biology',
      'Pharmacology',
      'Medicine'
    ],
    scientificBenefit: 'Models universal protein synthesis machinery. Essential for understanding translation, antibiotic action, and genetic diseases.',
    parameterMeaning: {
      a: 'Ribosome overall size (default 0.15)',
      u: 'Azimuthal parameter (0 to 1)',
      v: 'Polar parameter (0 to 1, controls subunit position)'
    }
  }
};

export function getMathematicalPattern(shapeId: string): MathematicalPattern | null {
  return MATHEMATICAL_PATTERNS[shapeId] || null;
}

export function getAllPatternIds(): string[] {
  return Object.keys(MATHEMATICAL_PATTERNS);
}
