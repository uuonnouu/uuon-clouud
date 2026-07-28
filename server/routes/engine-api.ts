import { Router, Request, Response } from 'express';
import { neon } from '@neondatabase/serverless';
import { db } from '../storage';
import { eq } from 'drizzle-orm';
import { computeSurfaceGeometry, SurfaceComputeRequest } from '../lib/shapes/shapeComputer';
import { requirePIEZ, requirePSENT } from '../../middleware/piez-middleware.mjs';

const router = Router();

const SHAPE_ID_ALIASES: Record<string, string> = {
  torus:       'torus_surface',
  sphere:      'sphere_surface',
  torus_basic: 'torus_surface',
  sphere_basic: 'sphere_surface',
  torus_surface: 'torus_surface',
  sphere_surface: 'sphere_surface',
};

function normalizeShapeId(id: string): string {
  return SHAPE_ID_ALIASES[id] ?? id;
}

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

const ENGINE_DEFAULTS: Record<string, Omit<SurfaceComputeRequest, 'shapeId' | 'parameters'>> = {
  quantum:    { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: 0,            vMax: Math.PI },
  relativity: { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: -Math.PI / 2, vMax: Math.PI / 2 },
  fractal:    { uSegments: 48, vSegments: 48, uMin: -2, uMax: 2,          vMin: -2,            vMax: 2 },
  modulo:     { uSegments: 64, vSegments: 48, uMin: 0, uMax: Math.PI * 2, vMin: 0,            vMax: Math.PI * 2 },
};

const ENGINE_TIER: Record<keyof typeof ENGINE_DEFAULTS, number> = {
  modulo: 0,
  relativity: 1,
  fractal: 2,
  quantum: 3,
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
    return !!gate;
  }
  if (/^PSENT-Balance\s/i.test(auth)) {
    const gate = await requirePSENT(req, res, tier);
    return !!gate;
  }

  res.status(401).json({
    error: 'Authorization required',
    accepted_formats: ['PIEZ-Balance 0x<wallet>', 'PSENT-Balance 0x<wallet>'],
  });
  return false;
}

async function renderShape(
  engineId: string,
  shapeList: typeof QUANTUM_SHAPES,
  req: Request,
  res: Response,
  engineKey: keyof typeof ENGINE_DEFAULTS,
) {
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

router.get('/relativity/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'relativity')) return;
  res.json({ engine: 'ENGINE_RELATIVITY', shapes: RELATIVITY_SHAPES, count: RELATIVITY_SHAPES.length });
});

router.post('/relativity/render', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'relativity')) return;
  await renderShape('ENGINE_RELATIVITY', RELATIVITY_SHAPES, req, res, 'relativity');
});

router.get('/fractal/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'fractal')) return;
  res.json({ engine: 'ENGINE_FRACTAL', shapes: FRACTAL_SHAPES, count: FRACTAL_SHAPES.length });
});

router.post('/fractal/render', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'fractal')) return;
  await renderShape('ENGINE_FRACTAL', FRACTAL_SHAPES, req, res, 'fractal');
});

router.get('/modulo/shapes', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'modulo')) return;
  res.json({ engine: 'ENGINE_MODULO', shapes: MODULO_SHAPES, count: MODULO_SHAPES.length });
});

router.post('/modulo/pattern', async (req: Request, res: Response) => {
  if (!await requireApiKey(req, res, 'modulo')) return;
  await renderShape('ENGINE_MODULO', MODULO_SHAPES, req, res, 'modulo');
});

export default router;

// ── PNG Render Endpoint ───────────────────────────────────────────────────
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

// ── Universal DB Render Endpoint ──────────────────────────────────────────
router.post('/render/universal', async (req: Request, res: Response) => {
  const { shapeId, uSegments = 80, vSegments = 80, uMin = 0, uMax = Math.PI * 2, vMin = 0, vMax = Math.PI * 2 } = req.body;
  if (!shapeId) return res.status(400).json({ error: 'shapeId required' });
  try {
    const DMENSION_DB = process.env.CLEAN_DB || process.env.DMENSION_DATABASE_URL;
    if (!DMENSION_DB) return res.status(500).json({ error: 'CLEAN_DB not configured' });
    const sql = neon(DMENSION_DB);
    const rows = await sql`
      SELECT equation_js, display_name, default_params
      FROM complete_shape_registry
      WHERE shape_type = ${shapeId}
      LIMIT 1
    `;
    if (!rows[0]?.equation_js) {
      return res.status(404).json({ error: `Shape '${shapeId}' not found in DB`, shapeId });
    }
    const fn = eval(`(${rows[0].equation_js})`);
    const vertices: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];
    const uStep = (uMax - uMin) / uSegments;
    const vStep = (vMax - vMin) / vSegments;
    for (let i = 0; i <= uSegments; i++) {
      for (let j = 0; j <= vSegments; j++) {
        const u = uMin + i * uStep;
        const v = vMin + j * vStep;
        const p = fn(u, v, {});
        vertices.push(p[0], p[1], p[2]);
        normals.push(0, 1, 0);
      }
    }
    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = a + 1;
        const c = a + (vSegments + 1);
        const d = c + 1;
        indices.push(a, b, d, a, d, c);
      }
    }
    res.json({
      success: true,
      shapeId,
      source: 'neon_db',
      displayName: rows[0].display_name ?? shapeId,
      vertices,
      normals,
      indices,
      vertexCount: vertices.length / 3,
      triangleCount: indices.length / 3
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message, shapeId });
  }
});

// ── HTML Render Endpoint ──────────────────────────────────────────────────
// POST /api/engines/render/html
// Body: { shapeId }
// Returns: self-contained Three.js HTML for animation_url (IPFS)
// No auth required — this is a public asset generation endpoint.

function generateHtmlRenderer(shape: {
  shape_type: string;
  equation_js: string;
  default_params: Record<string, number>;
  name?: string;
  description?: string;
}): string {
  const params = shape.default_params || { a: 1, b: 1, c: 1 };
  const paramsJson = JSON.stringify(params);
  const label = (shape.name || shape.shape_type).replace(/[^a-zA-Z0-9 _\-]/g, '');
  const desc = (shape.description || '').replace(/`/g, "'").slice(0, 200);
  const eqEscaped = shape.equation_js.replace(/\\/g, '\\\\').replace(/`/g, '\\`');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${label} — UUON Dmension</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#000;overflow:hidden;font-family:monospace}
canvas{display:block}
#label{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);color:#00ff88;font-size:12px;letter-spacing:2px;text-align:center;text-shadow:0 0 8px #00ff88;pointer-events:none}
#desc{position:fixed;top:12px;left:50%;transform:translateX(-50%);color:#ffffff44;font-size:10px;max-width:80vw;text-align:center;letter-spacing:1px;pointer-events:none}
</style>
</head>
<body>
<div id="desc">${desc}</div>
<div id="label">${label.toUpperCase()} &nbsp;&middot;&nbsp; UUON DMENSION</div>
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js"}}</script>
<script type="module">
import * as THREE from 'three';
const equationSrc = \`${eqEscaped}\`;
const params = ${paramsJson};
let shapeFn;
try { shapeFn = eval('(' + equationSrc + ')'); } catch(e) {
  shapeFn = (u,v,p)=>{const phi=u*Math.PI*2,theta=v*Math.PI;return{x:Math.sin(theta)*Math.cos(phi),y:Math.sin(theta)*Math.sin(phi),z:Math.cos(theta)};};
}
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.setClearColor(0x000000);
document.body.appendChild(renderer.domElement);
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(50,innerWidth/innerHeight,0.01,100);
camera.position.set(0,0,3.5);
scene.add(new THREE.AmbientLight(0xffffff,0.3));
const d1=new THREE.DirectionalLight(0x00ffaa,1.2);d1.position.set(3,5,3);scene.add(d1);
const d2=new THREE.DirectionalLight(0x4488ff,0.6);d2.position.set(-3,-2,2);scene.add(d2);
const SEGS=80;
const pos=[],idx=[],uv2=[];
function sample(u,v){try{const r=shapeFn(u,v,params);if(!r||isNaN(r.x))return null;return r;}catch{return null;}}
for(let j=0;j<=SEGS;j++)for(let i=0;i<=SEGS;i++){const u=i/SEGS,v=j/SEGS,p=sample(u,v)||{x:0,y:0,z:0};pos.push(p.x,p.y,p.z);uv2.push(u,v);}
for(let j=0;j<SEGS;j++)for(let i=0;i<SEGS;i++){const a=j*(SEGS+1)+i,b=a+1,c=a+(SEGS+1),d=c+1;idx.push(a,c,b,b,c,d);}
const geo=new THREE.BufferGeometry();
geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv2,2));
geo.setIndex(idx);geo.computeVertexNormals();
geo.computeBoundingBox();
const box=geo.boundingBox,ctr=new THREE.Vector3(),sz=new THREE.Vector3();
box.getCenter(ctr);box.getSize(sz);
const sc=2.0/Math.max(sz.x,sz.y,sz.z,0.001);
geo.translate(-ctr.x,-ctr.y,-ctr.z);
const solidMat=new THREE.MeshStandardMaterial({color:0x00ff88,metalness:0.2,roughness:0.5,side:THREE.DoubleSide,transparent:true,opacity:0.72});
const wireMat=new THREE.MeshBasicMaterial({color:0x00ffaa,wireframe:true,transparent:true,opacity:0.18});
const pivot=new THREE.Group();pivot.scale.setScalar(sc);scene.add(pivot);
pivot.add(new THREE.Mesh(geo,solidMat));pivot.add(new THREE.Mesh(geo,wireMat));
const ptPos=[];for(let k=0;k<300;k++)ptPos.push((Math.random()-.5)*8,(Math.random()-.5)*8,(Math.random()-.5)*8);
const ptGeo=new THREE.BufferGeometry();ptGeo.setAttribute('position',new THREE.Float32BufferAttribute(ptPos,3));
scene.add(new THREE.Points(ptGeo,new THREE.PointsMaterial({color:0x00ff88,size:0.015,transparent:true,opacity:0.4})));
let t=0;
(function animate(){requestAnimationFrame(animate);t+=0.004;pivot.rotation.y=t*.7;pivot.rotation.x=Math.sin(t*.3)*.3;solidMat.opacity=.65+Math.sin(t*1.2)*.08;renderer.render(scene,camera);})();
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
</script>
</body>
</html>`;
}

router.post('/render/html', async (req: Request, res: Response) => {
  const { shapeId } = req.body as { shapeId: string };
  if (!shapeId) return res.status(400).json({ error: 'shapeId required' });

  const DMENSION_DB = process.env.CLEAN_DB || process.env.DMENSION_DATABASE_URL;
  if (!DMENSION_DB) return res.status(500).json({ error: 'CLEAN_DB not configured' });

  try {
    const sql = neon(DMENSION_DB);
    const rows = await sql`
      SELECT shape_type, equation_js, default_params, display_name AS name, description
      FROM complete_shape_registry
      WHERE shape_type = ${shapeId} OR id::text = ${shapeId}
      LIMIT 1
    `;

    if (!rows[0]) {
      return res.status(404).json({ error: `Shape '${shapeId}' not found` });
    }
    if (!rows[0].equation_js) {
      return res.status(422).json({ error: `Shape '${shapeId}' has no equation_js` });
    }

    let defaultParams: Record<string, number> = {};
    try {
      defaultParams = typeof rows[0].default_params === 'string'
        ? JSON.parse(rows[0].default_params)
        : (rows[0].default_params || {});
    } catch { defaultParams = {}; }

    const html = generateHtmlRenderer({
      shape_type: rows[0].shape_type,
      equation_js: rows[0].equation_js,
      default_params: defaultParams,
      name: rows[0].name,
      description: rows[0].description,
    });

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Shape-Type', rows[0].shape_type);
    res.setHeader('X-Source', 'neon_db');
    return res.status(200).send(html);

  } catch (err: any) {
    return res.status(500).json({ error: err.message, shapeId });
  }
});