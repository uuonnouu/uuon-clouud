#!/usr/bin/env tsx
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function randVec(dims: number): number[] {
  const v: number[] = [];
  for (let i = 0; i < dims; i++) v.push(parseFloat(rnd(-1, 1).toFixed(6)));
  return v;
}

const SYMMETRY_TYPES = ['spherical','axial','bilateral','tetrahedral','octahedral','icosahedral','translational','none'];
const TOPOLOGY_SIGS = ['S2','T2','K2','RP2','S1xS1','S3','D3','open','closed'];
const CATEGORIES = ['topology','minimal_surface','quadric','parametric','fractal','quantum','biological','algebraic'];

async function main() {
  console.log('🔷 Seeding shape_embeddings...');

  const shapes = await sql`SELECT shape_type, category, complexity_score FROM formula_implementations ORDER BY shape_type`;
  console.log(`   Found ${shapes.length} shapes in formula_implementations`);

  let inserted = 0;
  let skipped = 0;
  const BATCH = 50;

  for (let i = 0; i < shapes.length; i += BATCH) {
    const batch = shapes.slice(i, i + BATCH);
    const now = new Date().toISOString();

    for (const s of batch) {
      const complexity = s.complexity_score ?? Math.floor(rnd(1, 10));
      const catIdx = Math.floor(Math.random() * CATEGORIES.length);
      const embedding = randVec(128);
      const mathFeatures = {
        category: s.category ?? CATEGORIES[catIdx],
        complexity: complexity,
        curvature_type: ['positive','negative','zero','mixed'][Math.floor(Math.random()*4)],
        orientable: Math.random() > 0.2,
        compact: Math.random() > 0.3,
        genus: Math.floor(rnd(0, 4)),
        dimension: Math.random() > 0.85 ? 4 : 3,
        symmetry_order: Math.floor(rnd(1, 24)),
      };
      const curvatureProfile = {
        gaussian_curvature: parseFloat(rnd(-2, 2).toFixed(4)),
        mean_curvature: parseFloat(rnd(-1, 1).toFixed(4)),
        principal_curvatures: [parseFloat(rnd(-2, 2).toFixed(4)), parseFloat(rnd(-2, 2).toFixed(4))],
      };
      const paramSensitivity = {
        a: parseFloat(rnd(0.1, 1).toFixed(3)),
        b: parseFloat(rnd(0.1, 1).toFixed(3)),
        c: parseFloat(rnd(0.1, 1).toFixed(3)),
      };

      try {
        await sql`
          INSERT INTO shape_embeddings
            (shape_type, embedding_vector, mathematical_features, symmetry_signature,
             topology_signature, curvature_profile, equation_complexity, parameter_sensitivity,
             created_at, updated_at)
          VALUES (
            ${s.shape_type},
            ${JSON.stringify(embedding)},
            ${JSON.stringify(mathFeatures)},
            ${SYMMETRY_TYPES[Math.floor(Math.random() * SYMMETRY_TYPES.length)]},
            ${TOPOLOGY_SIGS[Math.floor(Math.random() * TOPOLOGY_SIGS.length)]},
            ${JSON.stringify(curvatureProfile)},
            ${complexity},
            ${JSON.stringify(paramSensitivity)},
            ${now}, ${now}
          )
          ON CONFLICT (shape_type) DO NOTHING
        `;
        inserted++;
      } catch {
        skipped++;
      }
    }

    process.stdout.write(`\r   Progress: ${Math.min(i + BATCH, shapes.length)}/${shapes.length}`);
  }

  console.log(`\n✅ Done — inserted: ${inserted}, skipped (conflict): ${skipped}`);

  const [row] = await sql`SELECT COUNT(*) FROM shape_embeddings WHERE embedding_vector IS NOT NULL`;
  console.log(`📊 shape_embeddings total rows: ${row.count}`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
