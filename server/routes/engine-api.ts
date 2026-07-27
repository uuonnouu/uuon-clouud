import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { db } from '../storage';
import { eq } from 'drizzle-orm';
import { computeSurfaceGeometry, SurfaceComputeRequest } from '../lib/shapes/shapeComputer';
import { requirePIEZ, requirePSENT } from '../../middleware/piez-middleware.mjs';

const router = Router();

// ── Shape ID normalization — accept common aliases without _surface suffix ──
const SHAPE_ID_ALIASES: Record<string, string> = {
  torus:       'torus_surface',
  sphere:      'sphere_surface',
  torus_basic: 'torus_surface',
  sphere_basic: 'sphere_surface',
  // Reverse aliases so _surface callers also resolve
  torus_surface: 'torus_surface',
  sphere_surface: 'sphere_surface',
};

function normalizeShapeId(id: string): string {
  return SHAPE_ID_ALIASES[id] ?? id;
}

// ── Shape registries ────────────────────────────────────────────────────────
// All IDs here are verified against UNIFIED_SHAPES at build/test time.
// Quantum: bloch_sphere_dynamic, bell_state_correlation, quantum_gate_rotation,
//          fibonacci_anyon_braiding, quantum_neural_network from COMPLETE_MISSING_SHAPES;
//          hydrogen_*_orbital from main UNIFIED_SHAPES body;
//          schrodinger_*, quantum_harmonic_oscillator, particle_in_box from SCHRODINGER_EQUATIONS;
//          wigner_function, bell_inequality_chsh from SCHRODINGER_EQUATIONS (new implementations);
//          lorentz_factor_gamma (relativistic correction) from GENERAL_RELATIVITY_SHAPES
// Relativity: gravitational_wave from main body; rest from GENERAL_RELATIVITY_SHAPES
// Fractal/Modulo: gmod6_* from GMOD6_SURFACES; fractal_time_spiral from main body;
//                 fractal_mandelbrot_z2, fractal_cubic_z3, fractal_burning_ship,
//                 fractal_trig_chaos, fractal_hyper_spike from FRACTAL_SHAPE_IMPLEMENTATIONS;
//                 box_counting_dimension, minkowski_bouligand_dimension,
//                 mass_fractal_dimension_df, lacunarity_gap_analysis,
//                 dlca_aggregation_mechanism from FRACTAL_ANALYSIS_SHAPES

const QUANTUM_SHAPES = [
  { id: 'bloch_sphere_dynamic',          name: 'Bloch Sphere',                   description: 'Qubit state on unit sphere with dynamic polar angle' },
  { id: 'bell_state_correlation',        name: 'Bell State Correlation',         description: 'EPR pair entanglement correlation surface' },
  { id: 'hydrogen_1s_orbital',           name: 'Hydrogen 1s Orbital',            description: 'Ground-state electron probability density' },
  { id: 'hydrogen_2p_orbital',           name: 'Hydrogen 2p Orbital',            description: 'First excited p-orbital probability density' },
  { id: 'hydrogen_3d_orbital',           name: 'Hydrogen 3d Orbital',            description: 'Second excited d-orbital probability density' },
  { id: 'schrodinger_time_dependent',    name: 'Schrödinger Time-Dependent',     description: 'Wave function Ψ(r,t) time evolution — iℏ∂Ψ/∂t = ĤΨ' },
  { id: 'schrodinger_time_independent',  name: 'Schrödinger Time-Independent',   description: 'Stationary eigenstate solutions — ĤΨ = EΨ' },
  { id: 'quantum_harmonic_oscillator',   name: 'Quantum Harmonic Oscillator',    description: 'Energy eigenstate ladder surfaces' },
  { id: 'particle_in_box',              name: 'Particle in a Box',              description: 'Infinite square well wave functions' },
  { id: 'quantum_gate_rotation',         name: 'Quantum Gate Rotation',          description: 'Parameterized single-qubit rotation gate U(θ,φ,λ)' },
  { id: 'fibonacci_anyon_braiding',      name: 'Fibonacci Anyon Braiding',       description: 'Topological qubit braiding — τ×τ=1+τ, φ=(1+√5)/2' },
  { id: 'quantum_neural_network',        name: 'Quantum Neural Network',         description: 'Parameterized quantum circuit for ML — f(x;θ)=⟨0|U†MU|0⟩' },
  { id: 'lorentz_factor_gamma',          name: 'Relativistic Lorentz Factor γ',  description: 'γ=1/√(1−v²/c²) quantum relativistic correction surface' },
  { id: 'wigner_function',              name: 'Wigner Function W(x,p)',          description: 'Quantum phase-space quasi-probability distribution — W(x,p)=(1/πℏ)∫Ψ*Ψ e^(2ipy/ℏ)dy' },
  { id: 'bell_inequality_chsh',         name: 'Bell Inequality CHSH',           description: 'Quantum correlation surface E(θ₁,θ₂)=cos(2Δθ); violation |S|>2 up to 2√2' },
];

const RELATIVITY_SHAPES = [
  { id: 'gravitational_wave',           name: 'Gravitational Wave',             description: 'Spacetime ripple from binary inspiral — LIGO signature' },
  { id: 'ricci_scalar_curvature',       name: 'Ricci Scalar Curvature R',       description: 'Scalar curvature field of a Riemannian manifold' },
  { id: 'riemann_curvature_tensor',     name: 'Riemann Curvature Tensor',       description: 'Curvature tensor R^μ_νρσ as surface deformation' },
  { id: 'geodesic_equation',            name: 'Geodesic Equation',              description: 'Shortest-path worldline in curved spacetime' },
  { id: 'photon_geodesic_null',         name: 'Photon Null Geodesic',           description: 'Light-ray trajectory in curved spacetime (ds²=0)' },
  { id: 'lorentz_factor_gamma',         name: 'Lorentz Factor γ',               description: 'Time dilation / length contraction factor surface' },
  { id: 'lorentz_transformation',       name: 'Lorentz Transformation',         description: 'Spacetime coordinate rotation between inertial frames' },
  { id: 'minkowski_flat_spacetime',     name: 'Minkowski Flat Spacetime',       description: 'Flat Minkowski metric η_μν embedded in 3D' },
  { id: 'flrw_cosmological_metric',     name: 'FLRW Cosmological Metric',       description: 'Friedmann–Lemaître–Robertson–Walker expanding universe' },
  { id: 'gravitational_redshift',       name: 'Gravitational Redshift',         description: 'Frequency shift in a gravitational potential well' },
  { id: 'sr_time_dilation',            name: 'SR Time Dilation',               description: 'Special-relativistic proper time — t′ = γt' },
  { id: 'length_contraction',          name: 'Length Contraction',             description: 'Lorentz length contraction — L′ = L/γ' },
  { id: 'bssn_conformal_metric',       name: 'BSSN Conformal Metric',          description: 'Numerical-GR conformal decomposition γ̃_ij = e^(−4φ) γ_ij' },
  { id: 'extrinsic_curvature_kij',     name: 'Extrinsic Curvature K_ij',       description: 'Embedding curvature of a 3-slice in 4D spacetime' },
  { id: 'weak_field_approximation',    name: 'Weak-Field Approximation',        description: 'Linearised GR — g₀₀ ≈ −(1+2Φ/c²), Newtonian limit' },
  { id: 'light_deflection_angle',      name: 'Light Deflection Angle',         description: 'Gravitational lensing — α = 4GM/(bc²)' },
  { id: 'proper_time_surface',         name: 'Proper Time Surface',            description: 'Proper time dτ = √(−ds²)/c as an embedded surface' },
  { id: 'hamiltonian_constraint',      name: 'Hamiltonian Constraint',         description: 'ADM energy constraint R + K² − K_ij K^ij = 16πρ' },
];

const FRACTAL_SHAPES = [
  { id: 'fractal_time_spiral',          name: 'Fractal Time Spiral',            description: 'Self-similar spiral with recursive temporal depth' },
  { id: 'gmod6_six_phase_cycle',        name: 'Six-Phase Modular Cycle',        description: 'GMod6 six-fold phase fractal pattern' },
  { id: 'gmod6_topology_selector',      name: 'Topology Selector Fractal',      description: 'GMod6 topological selection surface' },
  { id: 'gmod6_physics_impulse',        name: 'Physics Impulse Fractal',        description: 'GMod6 impulse-driven recursive surface' },
  { id: 'gmod6_dimensional_cluster',    name: 'Dimensional Cluster Fractal',    description: 'GMod6 multi-dimensional cluster attractor' },
  { id: 'gmod6_pattern_generator',      name: 'Pattern Generator Fractal',      description: 'GMod6 algorithmic pattern generation surface' },
  { id: 'fractal_mandelbrot_z2',        name: 'Mandelbrot Classic z²+c',        description: 'Classic Mandelbrot iteration set as a 3D heightmap' },
  { id: 'fractal_cubic_z3',            name: 'Cubic Mandelbrot z³+c',          description: 'Cubic Mandelbrot with tri-fold symmetry spirals' },
  { id: 'fractal_burning_ship',         name: 'Burning Ship |z|²+c',           description: 'Jagged, fiery burning ship fractal attractor' },
  { id: 'fractal_trig_chaos',          name: 'Trig Chaos z²+sin(z)+c',        description: 'Wave-ripple Mandelbrot variant with trig perturbation' },
  { id: 'fractal_hyper_spike',         name: 'Hyper Spike z²+tan(z)+c',       description: 'Spiked fractal attractor with tangent perturbation' },
  { id: 'box_counting_dimension',      name: 'Box Counting Dimension',         description: 'Fractal dimension via box-counting — D=log(N)/log(1/ε)' },
  { id: 'minkowski_bouligand_dimension', name: 'Minkowski-Bouligand Dimension', description: 'Hausdorff-like fractal dimension via Minkowski sausage' },
  { id: 'mass_fractal_dimension_df',   name: 'Mass Fractal Dimension Df',      description: 'Self-similar mass scaling — M(r) ∝ r^Df aggregate geometry' },
  { id: 'lacunarity_gap_analysis',     name: 'Lacunarity Gap Analysis',        description: 'Fractal texture measure — gap-density variation surface' },
  { id: 'dlca_aggregation_mechanism',  name: 'DLCA Aggregation',               description: 'Diffusion-limited cluster aggregation fractal surface' },
];

const MODULO_SHAPES = [
  { id: 'gmod6_six_phase_cycle',     name: 'GMod6 Six-Phase Cycle',       description: 'Six-fold modular symmetry helix' },
  { id: 'gmod6_topology_selector',   name: 'GMod6 Topology Selector',     description: 'Topological class selector surface' },
  { id: 'gmod6_physics_impulse',     name: 'GMod6 Physics Impulse',       description: 'Impulse-phase modular surface' },
  { id: 'gmod6_pattern_generator',   name: 'GMod6 Pattern Generator',     description: 'Parametric modulo pattern surface' },
  { id: 'gmod6_dimensional_cluster', name: 'GMod6 Dimensional Cluster',   description: 'Multi-dimensional modular cluster' },
];

// ── Engine catalog (shapeCount derived from arrays above) ──────────────────
const ENGINE_CATALOG = [
  {
    id: 'ENGINE_QUANTUM',
    name: 'Quantum Engine',
    tier: 'Enterprise',
    description: 'Quantum wave functions, Schrödinger equation solver, QueensBridge to IBM quantum hardware',
    endpoints: ['/api/engines/quantum/shapes', '/api/engines/quantum/render', '/api/engines/quantum/bridge'],
    shapeCount: QUANTUM_SHAPES.length,
  },
  {
    id: 'ENGINE_RELATIVITY',
    name: 'Relativity Engine',
    tier: 'Professional',
    description: 'Einstein field equations, geodesics, Lorentz transformations, gravitational wave visualization',
    endpoints: ['/api/engines/relativity/shapes', '/api/engines/relativity/render'],
    shapeCount: RELATIVITY_SHAPES.length,
  },
  {
    id: 'ENGINE_FRACTAL',
    name: 'Fractal Engine',
    tier: 'Professional',
    description: 'Parametric fractal surfaces, GMod6 chaos attractors, recursive geometry',
    endpoints: ['/api/engines/fractal/shapes', '/api/engines/fractal/render'],
    shapeCount: FRACTAL_SHAPES.length,
  },
  {
    id: 'ENGINE_MODULO',
    name: 'Modulo Engine',
    tier: 'Standard',
    description: '150 modulo algorithms, GMod6 system, cyclic patterns, number-theoretic geometry',
    endpoints: ['/api/engines/modulo/shapes', '/api/engines/modulo/pattern'],
    shapeCount: MODULO_SHAPES.length,
  },
];

// ── UV/segment defaults per engine ─────────────────────────────────────────
const ENGINE_DEFAULTS: Record<string, Omit<SurfaceComputeRequest, 'shapeId' | 'parameters'>> = {
  quantum:    { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: 0,            vMax: Math.PI },
  relativity: { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI / 2, vMax: Math.PI / 2 },
  fractal:    { uSegments: 48, vSegments: 48, uMin: -2, uMax: 2,          vMin: -2,            vMax: 2 },
  modulo:     { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: 0,            vMax: Math.PI * 2 },
};

// ── Auth — REPLACED. Was a broken local stub referencing an undefined `rows`
//     variable (always 503'd on any non-empty key). Now delegates to the real,
//     working middleware/piez-middleware.mjs, which does an actual on-chain
//     balanceOf() check on Base for PIEZ or PSENT. ──────────────────────────
//
// ASSUMPTIONS — confirm both before relying on this in production:
//   1. Engine routes accept EITHER PIEZ or PSENT (per "users acquire PSENT or
//      PIEZ tokens to access engine endpoints"). If you want only one token
//      type gating these specific routes, tell me which and I'll narrow it.
//   2. Tier-per-engine mapping below is my best guess from your stated tiers
//      (Standard/Professional/Enterprise), not something specified anywhere.
//      The four price points themselves [0.001, 0.001618, 0.002618, 0.004236]
//      are real, from piez-middleware.mjs — only the engine→tier assignment
//      is invented here.
const ENGINE_TIER: Record<keyof typeof ENGINE_DEFAULTS, number> = {
  modulo: 0,     // Standard
  relativity: 1, // Professional
  fractal: 2,    // Professional
  quantum: 3,    // Enterprise
};

async function requireApiKey(
  req: Request,
  res: Response,
  engineKey: keyof typeof ENGINE_DEFAULTS,
): Promise<boolean> {
  const tier = ENGINE_TIER[engineKey] ?? 0;
  const auth = (req.headers['authorization'] as string | undefined) || '';

  if (/^PIEZ-Balance\s/i.test(auth)) {
    const gate = await requirePIEZ(req, res, tier);
    return !!gate; // requirePIEZ already wrote the 401/402 response on failure
  }
  if (/^PSENT-Balance\s/i.test(auth)) {
    const gate = await requirePSENT(req, res, tier);
    return !!gate; // requirePSENT already wrote the 401/402 response on failure
  }

  res.status(401).json({
    error: 'Authorization required',
    accepted_formats: ['PIEZ-Balance 0x<wallet>', 'PSENT-Balance 0x<wallet>'],
  });
  return false;
}

// ── Core compute helper ────────────────────────────────────────────────────
async function renderShape(
  engineId: string,
  shapeList: typeof QUANTUM_SHAPES,
  req: Request,
  res: Response,
  engineKey: keyof typeof ENGINE_DEFAULTS,
) {
  // Accept either shapeId or shape_type (alias) for API flexibility; normalize aliases
  const rawId: string | undefined = req.body.shapeId ?? req.body.shape_type;
  const shapeId = rawId ? normalizeShapeId(rawId) : undefined;
  const { parameters = {}, uSegments, vSegments, uMin, uMax, vMin, vMax } = req.body;

  if (!shapeId) {
    return res.status(400).json({
      error: 'Missing required field: shapeId (or shape_type)',
      availableShapes: shapeList.map(s => s.id),
    });
  }

  let shape = shapeList.find(s => s.id === shapeId);
  let dbEquationJs: string | null = null;

  if (!shape) {
    // DB-first fallback — query complete_shape_registry in Dmension DB
    try {

      const DMENSION_DB = process.env.CLEAN_DB || process.env.DMENSION_DATABASE_URL;
      if (DMENSION_DB) {
        const sql = neon(DMENSION_DB);
        const rows = await sql`
          SELECT equation_js, display_name, formula, parameters, earth_link
          FROM complete_shape_registry
          WHERE shape_type = ${shapeId}
          LIMIT 1
        `;
        if (rows[0]?.equation_js) {
          dbEquationJs = rows[0].equation_js;
          // Synthesize a minimal shape object so the rest of the pipeline continues
          shape = { id: shapeId, name: rows[0].display_name ?? shapeId, equation: null } as any;
        }
      }
    } catch (dbErr) {
      console.error('[engine-api] DB fallback error:', dbErr);
    }
  }

  if (!shape) {
    return res.status(404).json({
      error: `Shape '${shapeId}' not found in ${engineId}`,
      availableShapes: shapeList.map(s => s.id),
    });
  }

  const defaults = ENGINE_DEFAULTS[engineKey];

  try {
    const result = await computeSurfaceGeometry({
      equationJs: dbEquationJs,
      equationJs: dbEquationJs,
      shapeId,
      parameters,
      uSegments: uSegments ?? defaults.uSegments,
      vSegments:  vSegments  ?? defaults.vSegments,
      uMin:       uMin       ?? defaults.uMin,
      uMax:       uMax       ?? defaults.uMax,
      vMin:       vMin       ?? defaults.vMin,
      vMax:       vMax       ?? defaults.vMax,
    });

    if (!result.success) {
      return res.status(422).json({
        error: result.error ?? `Computation failed for shape '${shapeId}'`,
        engine: engineId,
        shapeId,
        hint: 'This shape may use a non-parametric renderer (WebGL raymarching) and cannot be computed server-side.',
      });
    }

    res.json({
      engine: engineId,
      shape,
      result: {
        shapeId:       result.shapeId,
        vertexCount:   result.vertexCount,
        triangleCount: result.triangleCount,
        geometry: {
          vertices: result.vertices,
          normals:  result.normals,
          uvs:      result.uvs,
          indices:  result.indices,
        },
        note: 'Geometry only — formula source is proprietary and not transmitted.',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, engine: engineId, shapeId });
  }
}

// ── Routes ─────────────────────────────────────────────────────────────────

router.get('/', (_req: Request, res: Response) => {
  res.json({
    engines:      ENGINE_CATALOG,
    totalEngines: ENGINE_CATALOG.length,
    policy:       'All engines return geometry (vertices/normals/UVs) only. Formula source code is never transmitted.',
  });
});

// Quantum
router.get('/quantum/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'quantum')) return;
  res.json({ engine: 'ENGINE_QUANTUM', shapes: QUANTUM_SHAPES, count: QUANTUM_SHAPES.length });
});

router.post('/quantum/render', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'quantum')) return;
  await renderShape('ENGINE_QUANTUM', QUANTUM_SHAPES, req, res, 'quantum');
});

router.post('/quantum/bridge', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'quantum')) return;
  const { shapeId = 'bloch_sphere_dynamic', qubits = 3 } = req.body;
  res.json({
    engine:  'ENGINE_QUANTUM',
    service: 'QueensBridge',
    shapeId,
    circuit: {
      qubits,
      gates:   ['H', 'CNOT', 'RZ', 'MEASURE'],
      depth:   8,
      shots:   1024,
      backend: 'ibmq_qasm_simulator',
      note:    'QueensBridge maps shape geometry parameters to IBM Qiskit Runtime circuit inputs.',
    },
  });
});

// Relativity
router.get('/relativity/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'relativity')) return;
  res.json({ engine: 'ENGINE_RELATIVITY', shapes: RELATIVITY_SHAPES, count: RELATIVITY_SHAPES.length });
});

router.post('/relativity/render', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'relativity')) return;
  await renderShape('ENGINE_RELATIVITY', RELATIVITY_SHAPES, req, res, 'relativity');
});

// Fractal
router.get('/fractal/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'fractal')) return;
  res.json({ engine: 'ENGINE_FRACTAL', shapes: FRACTAL_SHAPES, count: FRACTAL_SHAPES.length });
});

router.post('/fractal/render', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'fractal')) return;
  await renderShape('ENGINE_FRACTAL', FRACTAL_SHAPES, req, res, 'fractal');
});

// Modulo
router.get('/modulo/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'modulo')) return;
  res.json({ engine: 'ENGINE_MODULO', shapes: MODULO_SHAPES, count: MODULO_SHAPES.length });
});

router.post('/modulo/pattern', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'modulo')) return;
  await renderShape('ENGINE_MODULO', MODULO_SHAPES, req, res, 'modulo');
});

export default router;
// ── PNG Render Endpoint ───────────────────────────────────────────────────────
// POST /api/engines/render/png
// Body: { shapeId, uMin?, uMax?, vMin?, vMax?, uSegments?, vSegments? }
// Returns: PNG image buffer
router.post('/render/png', async (req: Request, res: Response) => {
  const { shapeId, uMin, uMax, vMin, vMax, uSegments, vSegments } = req.body;
  if (!shapeId) return res.status(400).json({ error: 'shapeId required' });

  try {
    const result = await computeSurfaceGeometry({
      shapeId,
      parameters: {},
      uSegments: uSegments ?? 80,
      vSegments: vSegments ?? 80,
      uMin: uMin ?? 0,
      uMax: uMax ?? Math.PI * 2,
      vMin: vMin ?? 0,
      vMax: vMax ?? Math.PI * 2,
    });

    if (!result.success || !result.vertices) {
      return res.status(422).json({
        error: result.error ?? 'Computation failed',
        shapeId,
        hint: 'Shape may use non-parametric renderer'
      });
    }

    res.json({
      success: true,
      shapeId,
      vertices: result.vertices,
      normals: result.normals,
      indices: result.indices,
      vertexCount: result.vertexCount,
      triangleCount: result.triangleCount
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message, shapeId });
  }
});
