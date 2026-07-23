import { Router, Request, Response } from 'express';

const router = Router();

// ── Golden-ratio icosahedral vertex directions (unit vectors) ─────────────
const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_NORM = Math.sqrt(1 + PHI * PHI);
const ICO_VERTICES: [number, number, number][] = [
  [ 0,  1,  PHI], [ 0, -1,  PHI], [ 0,  1, -PHI], [ 0, -1, -PHI],
  [ 1,  PHI,  0], [-1,  PHI,  0], [ 1, -PHI,  0], [-1, -PHI,  0],
  [ PHI,  0,  1], [-PHI,  0,  1], [ PHI,  0, -1], [-PHI,  0, -1],
].map(([x, y, z]) => [x / ICO_NORM, y / ICO_NORM, z / ICO_NORM] as [number, number, number]);

// 20 triangular faces (vertex-index triples)
const ICO_FACES: [number, number, number][] = [
  [0,1,8],[0,8,4],[0,4,5],[0,5,9],[0,9,1],
  [1,6,8],[8,6,10],[8,10,4],[4,10,2],[4,2,5],
  [5,2,11],[5,11,9],[9,11,7],[9,7,1],[1,7,6],
  [3,6,7],[3,7,11],[3,11,2],[3,2,10],[3,10,6],
];

const MASS_KG       = 21_255.0159;
const FACE_COUNT    = 20;
const FACE_MASS_KG  = MASS_KG / FACE_COUNT;

function faceCenter(fi: number): [number, number, number] {
  const [i0, i1, i2] = ICO_FACES[fi];
  return [
    (ICO_VERTICES[i0][0] + ICO_VERTICES[i1][0] + ICO_VERTICES[i2][0]) / 3,
    (ICO_VERTICES[i0][1] + ICO_VERTICES[i1][1] + ICO_VERTICES[i2][1]) / 3,
    (ICO_VERTICES[i0][2] + ICO_VERTICES[i1][2] + ICO_VERTICES[i2][2]) / 3,
  ];
}

// r(p̂) = A · (1 + C · Ψ_norm),  Ψ = Σ max(p̂·v̂_k, 0)^(4B)
function computeRadius(px: number, py: number, pz: number, A: number, B: number, C: number): number {
  const len = Math.sqrt(px * px + py * py + pz * pz) || 1;
  const nx = px / len, ny = py / len, nz = pz / len;
  let psi = 0;
  for (const [vx, vy, vz] of ICO_VERTICES) {
    const dot = nx * vx + ny * vy + nz * vz;
    if (dot > 0) psi += Math.pow(dot, 4 * Math.max(0.1, B));
  }
  const psiNorm = psi / 12;
  return A * (1 + C * psiNorm);
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/foundation/shapes
// ─────────────────────────────────────────────────────────────────────────────
router.get('/shapes', (_req: Request, res: Response) => {
  res.json({
    success: true,
    count: 2,
    shapes: [
      {
        id: 'foundation_tensor_mesh',
        name: 'Foundation Tensor Mesh',
        category: 'welcome',
        description: 'Fixed-topology icosahedral tensor shell with distributed mass and inertia tensors.',
        formula: 'r(p̂) = A·(1 + C·Ψ_norm),  Ψ = Σ max(p̂·v̂_k, 0)^(4B),  k=1..12',
        parameters: { A: { label: 'Shell Radius', default: 1 }, B: { label: 'Tensor Concentration', default: 1 }, C: { label: 'Deformation Amplitude', default: 0.35 } },
        topology: { vertices: 12, faces: 20, euler_characteristic: 2, genus: 0, orientable: true, closed: true },
        physics: { mass_kg: MASS_KG, face_mass_kg: FACE_MASS_KG, inertia_formula: 'I = (2/3)·m·A²' },
      },
      {
        id: 'galactic_uv_sphere',
        name: 'Galactic UV Coordinate Sphere',
        category: 'welcome',
        description: 'IAU standard galactic coordinate sphere — R_G^T maps (l, b) galactic to J2000 equatorial XYZ.',
        formula: '[xe,ye,ze] = R_G^T · [r·cos(b)·cos(l), r·cos(b)·sin(l), r·sin(b)]',
        parameters: { A: { label: 'Sphere Radius', default: 1 }, B: { label: 'Disk Warp', default: 0 }, C: { label: 'Scale Height', default: 1 } },
        topology: { orientable: true, closed: true },
        coordinate_system: { standard: 'IAU J2000', matrix: 'Blaauw 1960', galactic_centre: 'l=0, b=0' },
      },
    ],
    endpoints: {
      tensor:   'GET /api/foundation/tensor/:shape',
      topology: 'GET /api/foundation/topology/:shape',
      compute:  'POST /api/foundation/compute',
    },
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/foundation/tensor/:shape
// Face-by-face mass & inertia distribution (Foundation Tensor Mesh only)
// ─────────────────────────────────────────────────────────────────────────────
router.get('/tensor/:shape', (req: Request, res: Response) => {
  const { shape } = req.params;
  const A = parseFloat(String(req.query.A || '1'));

  if (shape !== 'foundation_tensor_mesh') {
    return res.status(404).json({ success: false, error: 'Tensor distribution only available for foundation_tensor_mesh' });
  }

  const inertia_scalar = (2 / 3) * MASS_KG * A * A;

  const faces = ICO_FACES.map(([v1, v2, v3], i) => {
    const [cx, cy, cz] = faceCenter(i);
    return {
      face_index: i,
      vertices: [v1, v2, v3],
      centroid: { x: cx * A, y: cy * A, z: cz * A },
      mass_kg: FACE_MASS_KG,
      inertia_contribution: inertia_scalar / FACE_COUNT,
    };
  });

  res.json({
    success: true,
    shape: 'foundation_tensor_mesh',
    A,
    total_mass_kg: MASS_KG,
    total_inertia_scalar: inertia_scalar,
    inertia_formula: 'I = (2/3)·m·A²',
    face_count: FACE_COUNT,
    face_mass_kg: FACE_MASS_KG,
    faces,
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/foundation/topology/:shape
// Fixed V1/V2/V3 index matrix + Euler characteristic
// ─────────────────────────────────────────────────────────────────────────────
router.get('/topology/:shape', (req: Request, res: Response) => {
  const { shape } = req.params;

  if (shape === 'foundation_tensor_mesh') {
    return res.json({
      success: true,
      shape: 'foundation_tensor_mesh',
      topology_type: 'icosahedral',
      vertex_count: 12,
      edge_count: 30,
      face_count: 20,
      euler_characteristic: 2,
      genus: 0,
      orientable: true,
      closed: true,
      note: 'Fixed topology — ghost nodes rejected at construction; no V outside this index is admitted.',
      vertex_directions: ICO_VERTICES.map(([x, y, z], i) => ({ index: i, x, y, z })),
      face_index_matrix: ICO_FACES.map(([v1, v2, v3], i) => ({ face: i, V1: v1, V2: v2, V3: v3 })),
    });
  }

  if (shape === 'galactic_uv_sphere') {
    return res.json({
      success: true,
      shape: 'galactic_uv_sphere',
      topology_type: 'sphere',
      orientable: true,
      closed: true,
      coordinate_system: 'IAU J2000 galactic → equatorial',
      rotation_matrix: 'Blaauw 1960 R_G (3×3 orthonormal)',
      R_G_rows: [
        [-0.054876, -0.873437, -0.483835],
        [ 0.494109, -0.444830,  0.746982],
        [-0.867666, -0.198076,  0.455984],
      ],
      note: 'R_G^T is applied — input is galactic (l,b), output is equatorial XYZ.',
    });
  }

  return res.status(404).json({ success: false, error: `Shape '${shape}' not found in foundation API` });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/foundation/compute
// Evaluate r(p̂) for a direction vector and A/B/C parameters
// Body: { shape, px, py, pz, A, B, C }
//   OR  { shape, sample_count, A, B, C }  → sphere-sample N points
// ─────────────────────────────────────────────────────────────────────────────
router.post('/compute', (req: Request, res: Response) => {
  const { shape = 'foundation_tensor_mesh', A = 1, B = 1, C = 0.35 } = req.body;

  if (shape !== 'foundation_tensor_mesh') {
    return res.status(400).json({ success: false, error: 'Compute endpoint currently supports foundation_tensor_mesh' });
  }

  const a = parseFloat(String(A));
  const b = parseFloat(String(B));
  const c = parseFloat(String(C));

  // Single point query
  if (req.body.px !== undefined) {
    const px = parseFloat(String(req.body.px));
    const py = parseFloat(String(req.body.py || 0));
    const pz = parseFloat(String(req.body.pz || 0));
    const r  = computeRadius(px, py, pz, a, b, c);
    return res.json({ success: true, shape, A: a, B: b, C: c, direction: { px, py, pz }, radius: r });
  }

  // Sphere-sample mode
  const count = Math.min(parseInt(String(req.body.sample_count || 20)), 500);
  const samples: { px: number; py: number; pz: number; radius: number }[] = [];
  for (let i = 0; i < count; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / count);
    const phi   = Math.PI * (1 + Math.sqrt(5)) * i;
    const px = Math.sin(theta) * Math.cos(phi);
    const py = Math.sin(theta) * Math.sin(phi);
    const pz = Math.cos(theta);
    samples.push({ px, py, pz, radius: computeRadius(px, py, pz, a, b, c) });
  }

  res.json({
    success: true,
    shape,
    A: a, B: b, C: c,
    sample_count: count,
    inertia_scalar: (2 / 3) * MASS_KG * a * a,
    samples,
  });
});

export default router;
