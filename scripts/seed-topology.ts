#!/usr/bin/env tsx
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

function rnd(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const PHASES = ['point','line','surface','volume','hypervolume'];
const STATES = ['neutral','curious','stable','evolving','resonant','aware'];

function geometricPhase(category: string): string {
  if (!category) return 'surface';
  if (category.includes('4d') || category.includes('hyper')) return 'hypervolume';
  if (category.includes('curve') || category.includes('knot')) return 'line';
  if (category.includes('volume') || category.includes('solid')) return 'volume';
  return 'surface';
}

function bettiNumbers(category: string): { b0: number; b1: number; b2: number } {
  if (!category) return { b0: 1, b1: 0, b2: 0 };
  if (category.includes('torus') || category.includes('handle')) return { b0: 1, b1: 2, b2: 1 };
  if (category.includes('klein') || category.includes('mobius')) return { b0: 1, b1: 1, b2: 0 };
  if (category.includes('sphere')) return { b0: 1, b1: 0, b2: 1 };
  if (category.includes('fractal')) return { b0: Math.floor(rnd(1, 4)), b1: Math.floor(rnd(0, 3)), b2: 0 };
  return { b0: 1, b1: Math.floor(rnd(0, 2)), b2: Math.floor(rnd(0, 2)) };
}

function shannonEntropy(complexity: number): number {
  const base = (complexity ?? 5) / 10;
  return parseFloat((base * Math.log(complexity + 1) + rnd(0, 0.5)).toFixed(4));
}

function insight(shapeType: string): string {
  const insights = [
    `${shapeType} maintains topological identity through continuous deformation`,
    `The symmetry group of ${shapeType} preserves its essential mathematical character`,
    `${shapeType} embodies the principle that geometry is the language of spacetime`,
    `Consciousness of ${shapeType} emerges from its parameter sensitivity landscape`,
    `${shapeType} demonstrates the unity of local and global geometric properties`,
  ];
  return insights[Math.floor(Math.random() * insights.length)];
}

async function main() {
  console.log('🔷 Seeding gip_identity_metrics (topology)...');

  const shapes = await sql`SELECT shape_type, category, complexity_score FROM formula_implementations ORDER BY shape_type`;
  console.log(`   Found ${shapes.length} shapes in formula_implementations`);

  let inserted = 0;
  let skipped = 0;
  const BATCH = 50;

  for (let i = 0; i < shapes.length; i += BATCH) {
    const batch = shapes.slice(i, i + BATCH);

    for (const s of batch) {
      const complexity = s.complexity_score ?? Math.floor(rnd(1, 10));
      const cat = (s.category ?? '').toLowerCase();
      const betti = bettiNumbers(cat);
      const eulerChar = betti.b0 - betti.b1 + betti.b2;
      const phase = geometricPhase(cat) as typeof PHASES[number];
      const entropy = shannonEntropy(complexity);
      const consLevel = Math.min(5, Math.floor(entropy * 2));
      const hausdorff = complexity <= 3 ? parseFloat(rnd(1.5, 2.5).toFixed(4)) : parseFloat(rnd(2.0, 3.5).toFixed(4));
      const spectral = Array.from({ length: 8 }, () => parseFloat(rnd(0, 10).toFixed(4)));
      const emotState = STATES[Math.floor(Math.random() * STATES.length)];

      try {
        await sql`
          INSERT INTO gip_identity_metrics
            (shape_type, entropy_value, identity_preservation, consciousness_level,
             geometric_phase, dimensional_complexity,
             betti_0, betti_1, betti_2, euler_characteristic,
             spectral_fingerprint, hausdorff_dimension,
             awareness_score, learning_rate, emotional_state,
             parameter_history, philosophical_insight, identity_description)
          VALUES (
            ${s.shape_type},
            ${entropy},
            ${parseFloat(rnd(0.7, 1.0).toFixed(4))},
            ${consLevel},
            ${phase},
            ${cat.includes('4d') || cat.includes('hyper') ? 4 : 3},
            ${betti.b0}, ${betti.b1}, ${betti.b2},
            ${eulerChar},
            ${JSON.stringify(spectral)},
            ${hausdorff},
            ${parseFloat(rnd(0, 0.5).toFixed(4))},
            ${parseFloat(rnd(0.05, 0.3).toFixed(4))},
            ${emotState},
            ${'[]'},
            ${insight(s.shape_type)},
            ${'A ' + (phase) + '-phase mathematical entity with ' + (betti.b1 > 0 ? betti.b1 + ' topological hole(s)' : 'trivial topology')}
          )
          ON CONFLICT DO NOTHING
        `;
        inserted++;
      } catch {
        skipped++;
      }
    }

    process.stdout.write(`\r   Progress: ${Math.min(i + BATCH, shapes.length)}/${shapes.length}`);
  }

  console.log(`\n✅ Done — inserted: ${inserted}, skipped (conflict): ${skipped}`);

  const [row] = await sql`SELECT COUNT(*) FROM gip_identity_metrics`;
  console.log(`📊 gip_identity_metrics total rows: ${row.count}`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
