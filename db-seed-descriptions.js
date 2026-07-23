import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

const descriptions = {
  'cryptography':             'Cryptographic mathematical surface encoding cipher and hash operations',
  'quantum-computing':        'Quantum computational geometry representing qubit operations and gate transforms',
  'quantum-mechanics':        'Quantum mechanical wave function surface encoding probability amplitudes',
  'quantum-gravity':          'Spacetime curvature geometry at the intersection of quantum and gravitational fields',
  'quantum-machine-learning': 'Hybrid quantum-classical optimization surface for machine learning algorithms',
  'theory-of-everything':     'Unified field geometry spanning all known fundamental forces and mathematical structures',
  'black-holes':              'Relativistic spacetime geometry encoding event horizon and singularity mathematics',
  '4d-hyperdimensional':      'Four-dimensional manifold projected into navigable 3D parametric surface',
  'general-relativity':       'Einstein field equation surface encoding spacetime curvature and mass-energy',
  'field-theory':             'Quantum field theory surface representing particle interaction and vacuum states',
  'tensor-algebra':           'Tensor manifold encoding multilinear algebraic transformation geometry',
  'topology':                 'Topological surface invariant under continuous deformation — shape without metric',
  'neural-networks':          'Neural network loss landscape and activation geometry surface',
  'algorithms':               'Algorithmic complexity surface encoding computational structure and efficiency',
  'fractals':                 'Self-similar recursive geometry with non-integer Hausdorff dimension',
  'wave-functions':           'Wave equation surface encoding interference, diffraction and superposition',
  'modulo-algorithms':        'Modular arithmetic surface encoding cyclic group and residue class geometry',
  'set-theory':               'Set-theoretic geometry encoding membership, union and intersection topology',
  'cosmology':                'Large-scale universe geometry encoding expansion, dark energy and cosmic structure',
  'entropic-principles':      'Thermodynamic entropy surface encoding information and disorder geometry',
  'molecular-biology':        'Biomolecular geometry encoding protein folding and DNA structural mathematics',
  'sacred-geometry':          'Ancient mathematical proportion surface encoding universal geometric ratios',
  'mathematical-art':         'Aesthetic mathematical surface at the intersection of art and pure geometry',
  'chakras':                  'Energy vortex geometry encoding harmonic resonance and field topology',
  'babylonian-zodiac':        'Ancient astronomical geometry encoding celestial mechanics and cycles',
  'uuon-acas':                'UUON Autonomous Computational Asset System — native protocol geometry',
  'basic':                    'Foundational mathematical surface — core geometric primitive',
  'general':                  'General mathematical surface encoding fundamental parametric geometry',
};

const shapes = await sql`
  SELECT id, category FROM complete_shape_registry 
  WHERE description IS NULL
`;

let updated = 0;
for (const shape of shapes) {
  const desc = descriptions[shape.category] ?? 'Mathematical surface encoding parametric geometry';
  await sql`
    UPDATE complete_shape_registry SET
      description = ${desc},
      updated_at = NOW()
    WHERE id = ${shape.id}
  `;
  updated++;
}

console.log(`Updated ${updated} shapes with descriptions`);

const check = await sql`
  SELECT COUNT(*) FILTER (WHERE description IS NULL) as still_missing
  FROM complete_shape_registry
`;
console.log('Still missing descriptions:', check[0].still_missing);

await sql.end();
