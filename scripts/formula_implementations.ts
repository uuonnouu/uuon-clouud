/**
 * UUON Foundation — Create formula_implementations table in Neon
 * This table is required by the Dmension app's database-loader.ts
 * Run once to create the missing table and sync from complete_shape_registry
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { neon } from "@neondatabase/serverless";

const DB_URL = process.env.DATABASE_URL!;
const sql = neon(DB_URL);

async function main() {
  console.log("Creating formula_implementations table...");

  // Create the table matching what database-loader.ts expects
  await sql`
    CREATE TABLE IF NOT EXISTS formula_implementations (
      id SERIAL PRIMARY KEY,
      shape_type VARCHAR(255) UNIQUE NOT NULL,
      formula_name VARCHAR(255),
      category VARCHAR(255),
      subcategory VARCHAR(255),
      description TEXT,
      formula_display TEXT,
      equation TEXT,
      parameters JSONB DEFAULT '{}',
      complexity_score INTEGER DEFAULT 3,
      priority INTEGER DEFAULT 1,
      seo_keywords TEXT[],
      is_active BOOLEAN DEFAULT TRUE,
      source VARCHAR(255) DEFAULT 'registry',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
  console.log("✓ Table created");

  // Sync from complete_shape_registry
  const shapes = await sql`SELECT * FROM complete_shape_registry`;
  console.log(`Syncing ${shapes.length} shapes...`);

  let inserted = 0;
  let skipped = 0;

  for (const shape of shapes) {
    try {
      await sql`
        INSERT INTO formula_implementations (
          shape_type, formula_name, category, subcategory,
          description, is_active, source
        ) VALUES (
          ${shape.shape_type},
          ${shape.display_name || shape.shape_type},
          ${shape.category || "general"},
          ${shape.subcategory || null},
          ${shape.description || null},
          ${shape.is_active ?? true},
          'registry'
        )
        ON CONFLICT (shape_type) DO NOTHING
      `;
      inserted++;
    } catch (e: any) {
      skipped++;
    }
  }

  // Verify
  const count =
    await sql`SELECT COUNT(*) as total FROM formula_implementations`;
  const categories = await sql`
    SELECT category, COUNT(*)::integer as count 
    FROM formula_implementations 
    GROUP BY category 
    ORDER BY count DESC 
    LIMIT 10
  `;

  console.log("\n═══════════════════════════════════════════════════");
  console.log("  formula_implementations table ready");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Total rows: ${(count[0] as any).total}`);
  console.log(`  Inserted:   ${inserted}`);
  console.log(`  Skipped:    ${skipped}`);
  console.log("\n  Top categories:");
  categories.forEach((r: any) => console.log(`    ${r.count}  ${r.category}`));
  console.log("═══════════════════════════════════════════════════");
}

main().catch(console.error);
