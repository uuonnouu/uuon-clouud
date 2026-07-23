import postgres from "postgres";
const sql = postgres(process.env.DATABASE_URL);

// Category → base energy mapping based on mathematical complexity
const categoryEnergy = {
  'cryptography':              1000,
  'quantum-computing':         950,
  'quantum-mechanics':         940,
  'quantum-gravity':           980,
  'quantum-machine-learning':  960,
  'theory-of-everything':      999,
  'black-holes':               970,
  '4d-hyperdimensional':       930,
  'general-relativity':        920,
  'field-theory':              910,
  'tensor-algebra':            900,
  'topology':                  890,
  'neural-networks':           850,
  'algorithms':                800,
  'fractals':                  780,
  'wave-functions':            870,
  'modulo-algorithms':         760,
  'set-theory':                750,
  'cosmology':                 960,
  'entropic-principles':       880,
  'molecular-biology':         700,
  'sacred-geometry':           650,
  'mathematical-art':          600,
  'chakras':                   500,
  'babylonian-zodiac':         480,
  'uuon-acas':                 920,
  'basic':                     300,
  'general':                   300,
};

// USD value = energy * 0.01 as starting peg
const shapes = await sql`SELECT id, category FROM complete_shape_registry`;

let updated = 0;
for (const shape of shapes) {
  const energy = categoryEnergy[shape.category] ?? 300;
  const usd = parseFloat((energy * 0.01).toFixed(2));
  
  await sql`
    UPDATE complete_shape_registry SET
      base_energy = ${energy},
      asset_value_usd = ${usd},
      mint_status = 'pending',
      updated_at = NOW()
    WHERE id = ${shape.id}
  `;
  updated++;
}

console.log(`Updated ${updated} shapes with energy and USD values`);

// Verify
const check = await sql`
  SELECT 
    COUNT(*) as total,
    COUNT(*) FILTER (WHERE base_energy IS NOT NULL) as has_energy,
    COUNT(*) FILTER (WHERE asset_value_usd IS NOT NULL) as has_usd,
    AVG(base_energy)::numeric(10,2) as avg_energy
  FROM complete_shape_registry;
`;
console.log('Verification:', check[0]);

await sql.end();
