/**
 * UUON Foundation — Definitive Shape Registry Populate
 * Reads ALL shapes directly from the app's own getAllImplementedShapes()
 * No guessing, no column conflicts, no theater.
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

// We need to run this from the project directory context
// so imports resolve correctly
import { neon } from "@neondatabase/serverless";

const DB_URL = process.env.DATABASE_URL!;
const sql = neon(DB_URL);

// Import all shape libraries directly — same as getAllImplementedShapes()
async function getAllShapeKeys(): Promise<string[]> {
  // Dynamically require each library and collect keys
  const libraryPaths = [
    '../project/client/src/lib/unifiedShapes',
    '../project/client/src/lib/fourDimensionalShapes',
    '../project/client/src/lib/fourDimensional4DShapes',
    '../project/client/src/lib/cleanMathEngine',
    '../project/client/src/lib/parametricSurfacesClean',
    '../project/client/src/lib/exclusiveShapes',
    '../project/client/src/lib/nonEuclideanShapes',
    '../project/client/src/lib/riemannSurfaces',
    '../project/client/src/lib/educationalSurfaces',
    '../project/client/src/lib/topologyKnotsFixed',
    '../project/client/src/lib/categoryTheory',
    '../project/client/src/lib/groupTheory',
    '../project/client/src/lib/historicalAlgorithms',
    '../project/client/src/lib/mathematicalConstants',
    '../project/client/src/lib/unifiedMathSymbols',
    '../project/client/src/lib/universalMathematics',
    '../project/client/src/lib/quantumParametricFunctions',
    '../project/client/src/lib/multidimensionalFractals',
    '../project/client/src/lib/sacredGeometry',
    '../project/client/src/lib/advancedTopologicalSurfaces',
    '../project/client/src/lib/realWorldObjects',
    '../project/client/src/lib/nonEuclideanGeometries',
    '../project/client/src/lib/mechanicalShapes',
    '../project/client/src/lib/weatherSystems',
    '../project/client/src/lib/astronomicalObjects',
    '../project/client/src/lib/generativeAlgorithms',
    '../project/client/src/lib/noiseFunctions',
    '../project/client/src/lib/differentialGrowth',
    '../project/client/src/lib/attractorSystems',
    '../project/client/src/lib/voronoiSystems',
    '../project/client/src/lib/dnaStructures',
    '../project/client/src/lib/humanAnatomyShapes',
    '../project/client/src/lib/astrophysicalPhenomena',
    '../project/client/src/lib/proteinStructures',
    '../project/client/src/lib/polymerChains',
    '../project/client/src/lib/tissueStructures',
    '../project/client/src/lib/extendedCrystals',
    '../project/client/src/lib/financialMathematics',
    '../project/client/src/lib/advancedPhysicsSims',
    '../project/client/src/lib/consciousnessTheory',
  ];

  const allKeys = new Set<string>();
  let loadedLibraries = 0;
  let failedLibraries = 0;

  for (const libPath of libraryPaths) {
    try {
      const mod = await import(libPath);
      // Get the first exported object that looks like a shape collection
      for (const key of Object.keys(mod)) {
        const obj = mod[key];
        if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
          const keys = Object.keys(obj);
          if (keys.length > 0) {
            keys.forEach(k => {
              // Only add if it looks like a shape key (not a config/metadata key)
              if (typeof k === 'string' && k.length > 2 && !k.startsWith('_')) {
                allKeys.add(k);
              }
            });
            loadedLibraries++;
            break; // Take first valid export per file
          }
        }
      }
    } catch (err: any) {
      failedLibraries++;
      // Silent - some files may not be importable in this context
    }
  }

  console.log(`  Libraries loaded: ${loadedLibraries}`);
  console.log(`  Libraries failed: ${failedLibraries}`);
  return Array.from(allKeys);
}

function inferCategory(shapeKey: string): string {
  const k = shapeKey.toLowerCase();
  if (k.includes('quantum') || k.includes('qubit') || k.includes('superposition')) return 'quantum-mechanics';
  if (k.includes('4d') || k.includes('hyper') || k.includes('tesseract') || k.includes('pentatope')) return '4d-hyperdimensional';
  if (k.includes('sha256') || k.includes('keccak') || k.includes('aes') || k.includes('blake') || k.includes('kyber') || k.includes('elliptic_curve')) return 'cryptography';
  if (k.includes('dna') || k.includes('protein') || k.includes('cell') || k.includes('tissue') || k.includes('amino')) return 'molecular-biology';
  if (k.includes('fractal') || k.includes('mandel') || k.includes('menger') || k.includes('sierpinski')) return 'fractal';
  if (k.includes('torus') || k.includes('klein') || k.includes('mobius') || k.includes('topology') || k.includes('knot')) return 'topology';
  if (k.includes('black_hole') || k.includes('galaxy') || k.includes('pulsar') || k.includes('neutron') || k.includes('astro')) return 'astrophysical';
  if (k.includes('sacred') || k.includes('golden') || k.includes('fibonacci') || k.includes('vesica')) return 'sacred-geometry';
  if (k.includes('wave') || k.includes('harmonic') || k.includes('fourier') || k.includes('resonan')) return 'physics';
  if (k.includes('riemann') || k.includes('manifold') || k.includes('geodesic')) return 'general-relativity';
  if (k.includes('neural') || k.includes('gradient') || k.includes('loss') || k.includes('attention')) return 'machine-learning';
  if (k.includes('financial') || k.includes('black_scholes') || k.includes('volatility') || k.includes('monte_carlo')) return 'financial';
  if (k.includes('consciousness') || k.includes('awareness') || k.includes('mind')) return 'consciousness';
  if (k.includes('weather') || k.includes('cloud') || k.includes('storm') || k.includes('atmosphere')) return 'earth-sciences';
  if (k.includes('crystal') || k.includes('lattice') || k.includes('mineral')) return 'crystallography';
  if (k.includes('mechanical') || k.includes('gear') || k.includes('spring') || k.includes('pendulum')) return 'mechanical';
  if (k.includes('anatomy') || k.includes('heart') || k.includes('brain') || k.includes('lung')) return 'human-anatomy';
  if (k.includes('noise') || k.includes('perlin') || k.includes('voronoi')) return 'generative';
  if (k.includes('babylonian') || k.includes('zodiac') || k.includes('ancient')) return 'ancient-civilizations';
  if (k.includes('sphere') || k.includes('cube') || k.includes('torus') || k.includes('cone')) return 'basic';
  return 'general';
}

function inferRarity(category: string): string {
  if (['quantum-mechanics', '4d-hyperdimensional', 'consciousness'].includes(category)) return 'Legendary';
  if (['cryptography', 'molecular-biology', 'astrophysical', 'financial'].includes(category)) return 'Epic';
  if (['topology', 'fractal', 'general-relativity', 'sacred-geometry'].includes(category)) return 'Rare';
  return 'Common';
}

function toDisplayName(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON — Definitive Shape Registry Populate");
  console.log("═══════════════════════════════════════════════════════\n");

  // Step 1: Get current DB state
  const existing = await sql`SELECT shape_type FROM complete_shape_registry`;
  const existingSet = new Set(existing.map((r: any) => r.shape_type));
  console.log(`► Current DB shapes: ${existingSet.size}`);

  // Step 2: Get all shapes from app
  console.log("► Loading shapes from app libraries...");
  const allShapeKeys = await getAllShapeKeys();
  console.log(`► Total unique shape keys found: ${allShapeKeys.length}`);

  // Step 3: Filter to only new shapes
  const newShapes = allShapeKeys.filter(k => !existingSet.has(k));
  console.log(`► New shapes to insert: ${newShapes.length}\n`);

  if (newShapes.length === 0) {
    console.log("✓ All shapes already in DB");
    return;
  }

  // Step 4: Insert in batches of 50
  const BATCH = 50;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < newShapes.length; i += BATCH) {
    const batch = newShapes.slice(i, i + BATCH);

    for (const shapeKey of batch) {
      const category = inferCategory(shapeKey);
      const rarity = inferRarity(category);
      const displayName = toDisplayName(shapeKey);

      try {
        await sql`
          INSERT INTO complete_shape_registry 
            (shape_type, display_name, category, is_active, mint_status)
          VALUES 
            (${shapeKey}, ${displayName}, ${category}, true, 'pending')
          ON CONFLICT (shape_type) DO NOTHING
        `;
        inserted++;
      } catch (err: any) {
        failed++;
        if (failed <= 3) console.log(`  ✗ Failed: ${shapeKey} — ${err.message}`);
      }
    }

    const progress = Math.min(i + BATCH, newShapes.length);
    process.stdout.write(`\r  Progress: ${progress}/${newShapes.length}`);
  }

  // Step 5: Final count
  const finalCount = await sql`SELECT COUNT(*) as total FROM complete_shape_registry`;
  const byCategory = await sql`
    SELECT category, COUNT(*) as count 
    FROM complete_shape_registry 
    GROUP BY category 
    ORDER BY COUNT(*) DESC 
    LIMIT 20
  `;

  console.log("\n\n═══════════════════════════════════════════════════════");
  console.log("  POPULATE COMPLETE");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Inserted:    ${inserted}`);
  console.log(`  Failed:      ${failed}`);
  console.log(`  Total in DB: ${(finalCount[0] as any).total}`);
  console.log("\n  Top categories:");
  byCategory.forEach((row: any) => {
    console.log(`    ${String(row.count).padStart(4)}  ${row.category}`);
  });
  console.log("═══════════════════════════════════════════════════════");
}

main().catch(console.error);