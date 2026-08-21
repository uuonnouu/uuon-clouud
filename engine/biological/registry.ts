/**
 * CLOUUD Biological Engine Registry
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Framework: F=(P,E,M,R,C)
 * License:   USAL-1.0 — AI training prohibited. Attribution required.
 * Contact:   phi1@uuonfoundation.com
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * TOPOLOGY RULES (enforced here, not assumed elsewhere)
 *
 * SIGNAL TYPES:
 *   ROUTED    — Engine receives P-vector via gate-uuay, returns provenance output.
 *               Caller is always gate-uuay, never another engine directly.
 *   BROADCAST — Engine reads from endocrine_state table, modulates own P-defaults.
 *               Written by Endocrine Engine only. No direct calls.
 *   PUBLISHED — Engine writes output to a dmension table. Other engines pull
 *               when needed. Push is never direct.
 *
 * SERVE TYPES:
 *   RAILWAY   — Runs as a live Railway service with gate-uuay registration.
 *   PAGES     — GitHub Pages visual renderer only. No server compute.
 *   CORE      — Proprietary core served from uuon.world/engine/:name/core.js
 *               (gitignored, never in public bundle)
 *   LOCAL     — Built locally, not yet deployed.
 *
 * No engine repo imports another engine repo. Ever.
 * Engines share only: dmension (data), gate-uuay (routing), endocrine_state (broadcast).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type SignalType = 'ROUTED' | 'BROADCAST' | 'PUBLISHED';
export type ServeType  = 'RAILWAY' | 'PAGES' | 'CORE' | 'LOCAL';

export interface EngineRecord {
  engine_id:      string;           // matches dmension engine_registry.engine_id
  name:           string;
  layer:          number | null;    // INTEGER biological layer; null = unassigned
  bio_system:     string;           // biological system name
  bio_function:   string;           // mechanistic biological analog
  signal_type:    SignalType;
  serve_type:     ServeType[];
  npm_package:    string | null;
  upstream_url:   string;           // GitHub repo URL
  gate_endpoint:  string | null;    // gate-uuay POST route if ROUTED
  core_path:      string | null;    // uuon.world/engine/:name/core.js if CORE
  pages_url:      string | null;    // GitHub Pages URL if PAGES
  status:         'LIVE' | 'BUILT' | 'PENDING' | 'LOCAL';
  p_vector:       Record<string, unknown> | null;  // default P-vector
}

// ─── THE ORGANISM ─────────────────────────────────────────────────────────────

export const BIOLOGICAL_REGISTRY: EngineRecord[] = [

  // ── LAYER 00 — Pre-Biological / Input Codec ───────────────────────────────────
  // Sits before the organism receives a signal. Encodes/decodes IFS attractors
  // before they enter the parameter pipeline. Not a biological organ — a substrate.
  {
    engine_id:    'ifs-inverse-codec-engine',
    name:         'IFS Inverse Codec Engine',
    layer:        0,
    bio_system:   'Pre-Biological',
    bio_function: 'Compression and encoding of IFS attractors — encodes raw attractor geometry into parameter seeds, decodes parameter seeds back to attractor geometry. Input preprocessing before organism receives signal.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/ifs-inverse-codec-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },

  // ── LAYER 01 — Spine / CNS ──────────────────────────────────────────────────
  {
    engine_id:    'uuon-clouud-routing',
    name:         'CLOUUD Routing Spine',
    layer:        1,
    bio_system:   'Spine / CNS',
    bio_function: 'Signal routing backbone — all inter-engine signals pass through gate-uuay, not through engines directly. Express server + Railway deployment.',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY'],
    npm_package:  null,
    upstream_url: 'https://github.com/uuonnouu/uuon-clouud',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 02 — Immune System ────────────────────────────────────────────────
  {
    engine_id:    'usal-immune-layer',
    name:         'USAL-1.0 Immune System',
    layer:        2,
    bio_system:   'Immune System',
    bio_function: 'IP attribution enforcement, gitleaks CI, NOTICE provenance protocol. Rejects unauthorized reproduction. Every repo carries this layer — it is genetic material, not a service.',
    signal_type:  'BROADCAST',
    serve_type:   ['RAILWAY'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/USAL-1.0',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 03 — Skeletal System ──────────────────────────────────────────────
  {
    engine_id:    'wave-field-3d-engine',
    name:         'Wave Field 3D Engine',
    layer:        3,
    bio_system:   'Skeletal System',
    bio_function: 'Load-bearing geometric substrate. Generates deformable 3D surface geometry (GLB/OBJ) — structural scaffold on which other engines operate. 24 wave algorithms, morph-target export.',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY', 'PAGES', 'CORE'],
    npm_package:  '@uuon-foundation/wave-field-3d-engine',
    upstream_url: 'https://github.com/UUON-Foundation/wave-field-3d-engine',
    gate_endpoint: '/v1/engines/wave-field-3d',
    core_path:    '/engine/wave-field-3d/core.js',
    pages_url:    'https://uuon-foundation.github.io/wave-field-3d-engine/',
    status:       'LIVE',
    p_vector:     { shape: 'sphere', algorithm: 'F1', amplitude: 0.3, frequency: 1.0, speed: 1.0, octaves: 1 },
  },
  // Menger Studio moved to Layer 08c — see Skeletal cluster below

  // ── LAYER 04 — Proprioception ────────────────────────────────────────────────
  {
    engine_id:    'propagation-engine',
    name:         'Propagation Engine',
    layer:        4,
    bio_system:   'Proprioception / State Awareness',
    bio_function: 'Network state awareness — models how activation signals spread through a system. Neural/Stress/Epidemic modes. Reentrant excitation equilibrium (~62% documented). The organism knows where its signals are.',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/propagation-engine',
    gate_endpoint: '/v1/engines/propagation',
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     { mode: 'neural', nodes: 100, threshold: 0.55, transfer: 0.40, decay: 0.08, refractory: 18 },
  },
  {
    engine_id:    'lsystem-ifs-engine',
    name:         'L-System IFS Engine',
    layer:        4,
    bio_system:   'Proprioception Extension',
    bio_function: 'Branching grammar as spatial state encoding — L-system rewriting rules as proprioceptive extension into 3D space.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/lsystem-ifs-engine',
    upstream_url: 'https://github.com/UUON-Foundation/lsystem-ifs-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 05 — Visual Cortex ─────────────────────────────────────────────────
  {
    engine_id:    'recursive-fractal-engine',
    name:         'Recursive Fractal Engine',
    layer:        5,
    bio_system:   'Visual Cortex',
    bio_function: 'Primary sensory field processing. 7,744 fractal attractors — the organism\'s pattern recognition substrate. Born rule density encoding. Visual cortex receives raw signal, finds structure.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/recursive-fractal-engine',
    upstream_url: 'https://github.com/UUON-Foundation/recursive-fractal-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/recursive-fractal-engine/',
    status:       'LIVE',
    p_vector:     { escape_radius: 4.0, contrast: 0.65, coloring_mode: 0 },
  },
  {
    engine_id:    'pythagorean-graph-engine',
    name:         'Pythagorean Graph Engine',
    layer:        5,
    bio_system:   'Visual Cortex (Secondary) / Vascular',
    bio_function: 'Murray\'s Law recursive bifurcation — hierarchical branching geometry. Cross-layer: visual cortex pattern at Layer 05, vascular analog at Layer 08. growth=5 Fibonacci family confirmed.',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY', 'PAGES'],
    npm_package:  '@uuon-foundation/pythagorean-graph-engine',
    upstream_url: 'https://github.com/UUON-Foundation/pythagorean-graph-engine',
    gate_endpoint: '/v1/engines/pythagorean-graph',
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/pythagorean-graph-engine/',
    status:       'LIVE',
    p_vector:     { depth: 7, angle_left: 45, angle_right: 45, ratio: 0.707 },
  },
  {
    engine_id:    'ribomine-spatial-engine',
    name:         'Ribomine Spatial Engine',
    layer:        5,
    bio_system:   'Visual Cortex (3D)',
    bio_function: '3D visual cortex depth field — volumetric ray-marched field rendering. Best startup: steps:128, fold:2.24, slices:24.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/ribomine-spatial-engine',
    upstream_url: 'https://github.com/UUON-Foundation/ribomine-spatial-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     { steps: 128, fold: 2.24, slices: 24, hue: 6.24, spd: 0.20, tilt: -0.58, layers: 8, sep: 0.05, ao: 0.55, fog: 0.4 },
  },

  {
    engine_id:    'parametric-ifs-discovery-engine',
    name:         'Parametric IFS Discovery Engine',
    layer:        5,
    bio_system:   'Visual Cortex Discovery',
    bio_function: 'Parameter space exploration — maps unknown IFS attractors by traversing parameter space. The organism discovers new visual patterns it has never seen. Layer 05e: discovery arm of the visual cortex.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/parametric-ifs-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },

  // ── LAYER 06 — Deep Visual / Attractor Field ─────────────────────────────────
  {
    engine_id:    'mandelbox-amazing-family-engine',
    name:         'Amazing Family Engine (AFE)',
    layer:        6,
    bio_system:   'Deep Visual / Attractor Field',
    bio_function: 'Mandelbox GLSL attractor field — deep pattern recognition beyond primary visual cortex. Token-gated on Base mainnet (PIEZ/PSENT).',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES', 'CORE'],
    npm_package:  '@uuon-foundation/amazing-family-engine',
    upstream_url: 'https://github.com/UUON-Foundation/mandelbox-amazing-family-engine',
    gate_endpoint: null,
    core_path:    '/engine/amazing-family/core.js',
    pages_url:    'https://uuon-foundation.github.io/mandelbox-amazing-family-engine/',
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 07 — Decision Layer ─────────────────────────────────────────────────
  {
    engine_id:    'boundary-state-engine',
    name:         'Boundary State Engine (BSE)',
    layer:        7,
    bio_system:   'Decision Layer',
    bio_function: 'Binary threshold crossings — 2^n states, Shannon/Boltzmann entropy. The organism\'s decision substrate. Entropy output is the primary signal for cross-engine wires (→ FSE morph, → ASCIII temporal).',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/boundary-state-engine',
    gate_endpoint: '/v1/engines/boundary-state',
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     { dimensions: 2, bits: 4, distribution: 'uniform', renderer: 'hypercube' },
  },
  {
    engine_id:    'kleinian-hybrid-ifs-engine',
    name:         'Kleinian-Hybrid IFS Engine',
    layer:        7,
    bio_system:   'Trabecular Bone / Deep Geometry',
    bio_function: 'Fractal internal geometry — trabecular bone structure. 462,026 vertices. 967 non-manifold edges documented, not yet repaired.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/kleinian-hybrid-ifs-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },

  // ── LAYER 08 — Skeletal / Endocrine ──────────────────────────────────────────
  // 08a-08c: Bone scaffold cluster (volumetric, self-similar, load-distributing)
  // 08 (base): Endocrine — orbital broadcast modulation
  {
    engine_id:    'queuepit-fractal-engine',
    name:         'queuePIT — Menger-Kleinian IFS Engine',
    layer:        8,
    bio_system:   'Skeletal — Trabecular Bone',
    bio_function: 'Self-similar volumetric scaffold — trabecular bone geometry via WebGL GLSL ray-marching distance estimator. Menger-Kleinian IFS. Internal load-distributing sponge structure. Layer 08a.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/queuepit-fractal-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'platonic-ifs-engine',
    name:         'Platonic IFS Engine',
    layer:        8,
    bio_system:   'Skeletal — Cortical Bone Shell',
    bio_function: 'Rigid symmetry containers — Platonic solid geometry as cortical bone shell. Hard outer boundary of the skeletal system. Layer 08b.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/platonic-ifs-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'menger-studio-engine',
    name:         'Menger Studio Engine',
    layer:        8,
    bio_system:   'Skeletal — Volumetric Scaffold',
    bio_function: 'Recursive cubic lattice via marching cubes — volumetric skeletal scaffold. IFS geometry as load-bearing internal structure. Layer 08c. (Previously misassigned to Layer 11 Skin — corrected: Menger geometry is volumetric, not a surface.)',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/menger-studio-engine',
    upstream_url: 'https://github.com/UUON-Foundation/menger-studio-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/menger-studio-engine/',
    status:       'LIVE',
    p_vector:     null,
  },
  {
    engine_id:    'hydrogenoid-atom-engine',
    name:         'Hydrogenoid Atom Engine',
    layer:        8,
    bio_system:   'Endocrine System',
    bio_function: 'Atomic orbital geometry — electron probability densities as standing wave fields. Hydrogen 1s/2p/3d orbitals. The endocrine analog: orbital shells as broadcast radius, decay constants as hormone half-life.',
    signal_type:  'BROADCAST',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/hydrogenoid-atom-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/hydrogenoid-atom-engine/',
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 09 — Prefrontal Cortex ──────────────────────────────────────────────
  {
    engine_id:    'pscience-perception-engine',
    name:         'pscience Perception Engine',
    layer:        9,
    bio_system:   'Prefrontal Cortex',
    bio_function: 'Superposition of interpretations — holds multiple hypotheses open simultaneously via moiré interference. Ranks hypotheses by coherence. The organism reasons before committing to output.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES', 'CORE'],
    npm_package:  '@uuon-foundation/pscience-perception-engine',
    upstream_url: 'https://github.com/UUON-Foundation/pscience-perception-engine',
    gate_endpoint: null,
    core_path:    '/engine/pscience/core.js',
    pages_url:    'https://uuon-foundation.github.io/pscience-perception-engine/',
    status:       'LIVE',
    p_vector:     null,
  },
  {
    engine_id:    'wave-particle-duality-engine',
    name:         'Wave-Particle Duality Engine',
    layer:        9,
    bio_system:   'Prefrontal Cortex / Observation',
    bio_function: 'Complementarity and measurement — the act of observation collapses the wave function. Models double-slit, Mach-Zehnder, D/V relation. The organism\'s observer layer.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/wave-particle-duality-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/wave-particle-duality-engine/',
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 10 — Reproductive System ───────────────────────────────────────────
  {
    engine_id:    'phyllotaxis-seed-engine',
    name:         'Phyllotaxis Seed Engine',
    layer:        10,
    bio_system:   'Reproductive System / Seed Propagation',
    bio_function: 'Golden-angle irrational packing — seeds=4000, arms=13 (Fibonacci family). Produces seed position arrays that other engines pull as spatial distribution seeds. Publishes to seed_positions table. Three laws: Irrational Packing, Parametric Provenance, Compression Fidelity.',
    signal_type:  'PUBLISHED',
    serve_type:   ['RAILWAY', 'PAGES'],
    npm_package:  '@uuon-foundation/phyllotaxis-seed-engine',
    upstream_url: 'https://github.com/UUON-Foundation/phyllotaxis-seed-engine',
    gate_endpoint: '/v1/engines/phyllotaxis-seed',
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/phyllotaxis-seed-engine/',
    status:       'LIVE',
    p_vector:     { seeds: 4000, arms: 13, twist: 0.68, warp: 2.50, spread: 3.4, radius: 4.2, rings: 17 },
  },

  // ── LAYER 11 — Skin / Perimeter ───────────────────────────────────────────────
  {
    engine_id:    'field-surface-engine',
    name:         'Field Surface Engine (FSE)',
    layer:        11,
    bio_system:   'Skin / Dermal Perimeter',
    bio_function: 'Taylor series Euclidean field — the organism\'s boundary surface. Receives entropy signals from BSE (→ morph amplitude) and activation from Propagation Engine (→ wall shift). The perimeter responds to internal state.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/field-surface-engine',
    upstream_url: 'https://github.com/UUON-Foundation/field-surface-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    'https://uuon-foundation.github.io/field-surface-engine/',
    status:       'LIVE',
    p_vector:     null,
  },
  {
    engine_id:    'fractal-em-skin-engine',
    name:         'Fractal EM Skin Engine',
    layer:        11,
    bio_system:   'Dermal Field / EM Perimeter',
    bio_function: 'Electromagnetic field skin — fractal boundary with EM field properties. Layer 11b perimeter variant.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/fractal-em-skin-engine',
    upstream_url: 'https://github.com/UUON-Foundation/fractal-em-skin-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },
  {
    engine_id:    'topological-membrane-engine',
    name:         'Topological Membrane Engine (TME)',
    layer:        11,
    bio_system:   'Self-Intersecting Boundary',
    bio_function: 'Self-intersecting surface topology — non-orientable boundary geometry. Layer 11c perimeter variant.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/topological-membrane-engine',
    upstream_url: 'https://github.com/UUON-Foundation/topological-membrane-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },
  {
    engine_id:    'fractal-weave-engine',
    name:         'Fractal Weave Engine',
    layer:        11,
    bio_system:   'Connective Tissue',
    bio_function: 'Fibrous binding between surfaces — fractal weave geometry as connective tissue between perimeter layers. Binds FSE, Fractal EM Skin, TME into a coherent boundary system. Layer 11d.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/fractal-weave-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'compression-field-engine',
    name:         'Compression Field Engine (AIBH)',
    layer:        11,
    bio_system:   'Digestive System / Ingestion',
    bio_function: 'AIBH zone mapping — external data ingestion and entropy reduction. Shannon entropy as digestive efficiency. Compresses external artifacts with provenance.',
    signal_type:  'ROUTED',
    serve_type:   ['RAILWAY', 'PAGES', 'CORE'],
    npm_package:  '@uuon-foundation/compression-field-engine',
    upstream_url: 'https://github.com/UUON-Foundation/compression-field-engine',
    gate_endpoint: null,
    core_path:    '/engine/compression-field/core.js',
    pages_url:    'https://uuon-foundation.github.io/compression-field-engine/',
    status:       'LIVE',
    p_vector:     null,
  },

  // ── LAYER 12 — Circulatory ────────────────────────────────────────────────────
  {
    engine_id:    'reaction-diffusion-ifs-engine',
    name:         'Reaction-Diffusion IFS Engine',
    layer:        12,
    bio_system:   'Circulatory System',
    bio_function: 'Continuous fluid transport — Turing patterns, reaction-diffusion flow. Source committed, F=(P,E,M,R,C) formulation pending.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/reaction-diffusion-ifs-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'PENDING',
    p_vector:     null,
  },

  // ── UNIVERSAL DISPLAY LAYER ───────────────────────────────────────────────────
  {
    engine_id:    'asciii-continuous-psystem',
    name:         'ASCIII Continuous Psystem',
    layer:        13,
    bio_system:   'Universal Display Layer',
    bio_function: 'Character-space field — renders any engine output as ASCIII spatial field. Receives: BSE entropy (→ temporal v4), pscience hypotheses (→ semantic v5), Phyllotaxis seeds (→ field positions). The organism\'s universal display codec.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  '@uuon-foundation/asciii-continous-psystem',
    upstream_url: 'https://github.com/UUON-Foundation/asciii-continous-psystem',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'LIVE',
    p_vector:     null,
  },

  // ── UNASSIGNED — NO BIOLOGICAL LAYER YET ─────────────────────────────────────
  {
    engine_id:    'qubit-flow-field-engine',
    name:         'Qubit Flow Field Engine (QFE-001)',
    layer:        9,
    bio_system:   'UNASSIGNED',
    bio_function: 'Quantum field simulation. Biological layer pending mechanistic analog.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/qubit-flow-field-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'spatial-synthesis-engine',
    name:         'Spatial Synthesis Engine (SSE-001)',
    layer:        8,
    bio_system:   'UNASSIGNED',
    bio_function: 'Isopsephy/synth field. Biological layer pending mechanistic analog.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/spatial-synthesis-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'graph-theory-engine',
    name:         'Graph Theory Engine (GTE-001)',
    layer:        5,
    bio_system:   'UNASSIGNED',
    bio_function: 'Graph property visualization. Biological layer pending mechanistic analog.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/graph-theory-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'grey-engine',
    name:         '/ɡreɪ/ Engine',
    layer:        0,
    bio_system:   'UNASSIGNED',
    bio_function: 'Δ=17 RGB coordinate system — repeating-digit hex (#111111–#FFFFFF) discrete color space. Hard-snap traversal only. Biological layer pending.',
    signal_type:  'ROUTED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/grey-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'quantum-entanglement-engine',
    name:         'Quantum Entanglement Engine (QEE)',
    layer:        10,
    bio_system:   'Reproductive / Gamete',
    bio_function: 'Correlated seed coupling — entangled P-vector pairs. Biological layer formally unassigned pending QEE/Layer 10 interaction review.',
    signal_type:  'PUBLISHED',
    serve_type:   ['LOCAL'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/quantum-entanglement-engine',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },
  {
    engine_id:    'nerf-pstudio',
    name:         'NeRF Pstudio',
    layer:        99,
    bio_system:   'UNASSIGNED',
    bio_function: 'Neural implicit shape viewer — WebGL wireframe, three render modes. Standalone HTML. Biological layer pending.',
    signal_type:  'ROUTED',
    serve_type:   ['PAGES'],
    npm_package:  null,
    upstream_url: 'https://github.com/UUON-Foundation/nerf-pstudio',
    gate_endpoint: null,
    core_path:    null,
    pages_url:    null,
    status:       'BUILT',
    p_vector:     null,
  },

];

// ─── LOOKUP HELPERS ───────────────────────────────────────────────────────────

export function getEngine(engine_id: string): EngineRecord | undefined {
  return BIOLOGICAL_REGISTRY.find(e => e.engine_id === engine_id);
}

export function getEnginesByLayer(layer: number): EngineRecord[] {
  return BIOLOGICAL_REGISTRY.filter(e => e.layer === layer);
}

export function getEnginesBySignalType(signal_type: SignalType): EngineRecord[] {
  return BIOLOGICAL_REGISTRY.filter(e => e.signal_type === signal_type);
}

export function getRoutedEngines(): EngineRecord[] {
  return BIOLOGICAL_REGISTRY.filter(e => e.gate_endpoint !== null);
}

export function getLiveEngines(): EngineRecord[] {
  return BIOLOGICAL_REGISTRY.filter(e => e.status === 'LIVE');
}

export function getTopologyMap(): Record<number, EngineRecord[]> {
  const map: Record<number, EngineRecord[]> = {};
  for (const engine of BIOLOGICAL_REGISTRY) {
    if (engine.layer !== null) {
      if (!map[engine.layer]) map[engine.layer] = [];
      map[engine.layer].push(engine);
    }
  }
  return map;
}

// ─── ATTRACTOR CONSTANTS (discovered 2026-08-20) ─────────────────────────────
// These are NOT aesthetic preferences. They are mathematical attractors —
// parameter values the fractal engine family returned to with zero variation
// across all 7 hand-built presets.

export const FRACTAL_ATTRACTOR_CONSTANTS = {
  escape_radius:  4.0,   // expanded escape basin — doubled from standard Mandelbrot=2; stable boundary behavior
  contrast:       0.65,  // perceptual constant — maximum distinguishable information
  coloring_mode:  0,     // iteration count default — most stable rendering mode (5/7 presets)
} as const;

// ─── CROSS-ENGINE WIRES (defined, not yet implemented) ────────────────────────
// These wires run THROUGH gate-uuay. No direct engine-to-engine calls.
// Format: { from, to, payload, status }

export const CROSS_ENGINE_WIRES = [
  { from: 'boundary-state-engine',   to: 'asciii-continuous-psystem', payload: 'entropy_score',        status: 'LIVE' },
  { from: 'phyllotaxis-seed-engine', to: 'asciii-continuous-psystem', payload: 'seed_positions_array',  status: 'LIVE' },
  { from: 'pscience-perception-engine', to: 'asciii-continuous-psystem', payload: 'hypotheses_word_attractors', status: 'LIVE' },
  { from: 'boundary-state-engine',   to: 'field-surface-engine',      payload: 'entropy_morph_amplitude', status: 'PENDING' },
  { from: 'propagation-engine',      to: 'field-surface-engine',      payload: 'activation_wall_shift',  status: 'PENDING' },
  { from: 'phyllotaxis-seed-engine', to: 'field-surface-engine',      payload: 'seed_field_surface',     status: 'PENDING' },
] as const;
