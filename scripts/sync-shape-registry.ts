/**
 * UUON Foundation — Shape Registry Sync Script
 * Reconciles formula_implementations (1,544 rows) → complete_shape_registry (817 rows)
 * Join key: shape_type (UNIQUE on both tables)
 * No man left behind.
 *
 * Usage: npx tsx scripts/sync-shape-registry.ts
 * Safe to run multiple times — ON CONFLICT (shape_type) DO NOTHING
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const BATCH_SIZE = 100;

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) chunks.push(arr.slice(i, i + size));
  return chunks;
}

function slugUrl(shapeType: string): string {
  return "/shapes/" + shapeType.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function escape(val: string | null | undefined, maxLen = 500): string {
  if (!val) return "NULL";
  return `'${val.replace(/'/g, "''").substring(0, maxLen)}'`;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON Shape Registry Sync — Phase II Pre-flight");
  console.log("═══════════════════════════════════════════════════════\n");

  // Step 1: All implemented shapes
  console.log("► Fetching formula_implementations...");
  const implemented = await sql`
    SELECT id, shape_type, formula_name, category, subcategory,
           mathematical_foundation, security_level
    FROM formula_implementations
    ORDER BY id ASC
  `;
  console.log(`  Total implemented: ${implemented.length}\n`);

  // Step 2: All shape_types already registered
  console.log("► Fetching complete_shape_registry...");
  const existing = await sql`SELECT shape_type FROM complete_shape_registry`;
  const existingSet = new Set(existing.map((r: any) => r.shape_type));
  console.log(`  Already registered: ${existingSet.size}\n`);

  // Step 3: Missing
  const missing = implemented.filter((r: any) => !existingSet.has(r.shape_type));
  console.log(`► Missing shapes to sync: ${missing.length}`);

  if (missing.length === 0) {
    console.log("\n✓ Registry already complete. Nothing to do.");
    process.exit(0);
  }

  console.log(`\n  Inserting in batches of ${BATCH_SIZE}. Starting in 3s... (Ctrl+C to abort)\n`);
  await new Promise((r) => setTimeout(r, 3000));

  // Step 4: Batch insert
  const batches = chunkArray(missing, BATCH_SIZE);
  let totalInserted = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i] as any[];
    const now = new Date().toISOString();

    // Build rows as parameterized values
    const rows = batch.map((shape) => ({
      shape_type: shape.shape_type,
      display_name: shape.formula_name ?? shape.shape_type,
      category: shape.category ?? "general",
      subcategory: shape.subcategory ?? null,
      description: shape.mathematical_foundation ?? null,
      source: "formula_sync",
      priority: 0.8,
      seo_keywords: shape.category ? `${shape.category}, UUON, parametric surface` : "UUON, parametric surface",
      canonical_url: slugUrl(shape.shape_type),
      is_active: true,
      created_at: now,
      updated_at: now,
    }));

    try {
      // Insert one row at a time within the batch to use parameterized queries safely
      let batchInserted = 0;
      for (const row of rows) {
        const result = await sql`
          INSERT INTO complete_shape_registry
            (shape_type, display_name, category, subcategory, description,
             source, priority, seo_keywords, canonical_url, is_active, created_at, updated_at)
          VALUES
            (${row.shape_type}, ${row.display_name}, ${row.category}, ${row.subcategory},
             ${row.description}, ${row.source}, ${row.priority}, ${row.seo_keywords},
             ${row.canonical_url}, ${row.is_active}, ${row.created_at}, ${row.updated_at})
          ON CONFLICT (shape_type) DO NOTHING
        `;
        batchInserted++;
      }
      totalInserted += batchInserted;
      console.log(`  Batch ${String(i + 1).padStart(2, "0")}/${batches.length} | +${batchInserted} processed`);
    } catch (err) {
      console.error(`\n✗ Batch ${i + 1} failed:`, err);
      console.error(`  ${totalInserted} shapes inserted before failure.`);
      process.exit(1);
    }
  }

  // Step 5: Final verification
  console.log("\n► Verifying final count...");
  const finalCount = await sql`SELECT COUNT(*) as count FROM complete_shape_registry`;
  const total = parseInt((finalCount[0] as any).count);

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  SYNC COMPLETE");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Shapes processed:   ${totalInserted}`);
  console.log(`  Registry total:     ${total}`);
  console.log(`  Target:             ${implemented.length}`);

  if (total >= implemented.length) {
    console.log("\n  ✓ All shapes accounted for. Registry complete.");
    console.log("  ✓ Ready to compute Merkle state root.\n");
  } else {
    console.warn(`\n  ⚠ Still missing ${implemented.length - total} shapes. Check for shape_type conflicts.\n`);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});