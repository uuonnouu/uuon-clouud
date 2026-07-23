#!/usr/bin/env node
/**
 * UUON Foundation — Database Health Check
 * server/db-health.ts
 *
 * Run from workspace root:
 *   npx ts-node server/db-health.ts
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('\n❌ DATABASE_URL not set in Replit Secrets\n');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runHealthCheck() {
  console.log('\n═══════════════════════════════════════════');
  console.log('  UUON Foundation — Database Health Check');
  console.log('═══════════════════════════════════════════\n');

  const start = Date.now();

  // Step 1: Ping
  console.log('1. Testing connectivity...');
  try {
    await sql`SELECT 1`;
    const ms = Date.now() - start;
    console.log(`   ✅ Connected  (${ms}ms)`);
    if (ms > 500) console.log(`   ⚠️  Cold start — normal, retry in 1s`);
  } catch (err: any) {
    console.error(`   ❌ ${err.message}`);
    process.exit(1);
  }

  // Step 2: Table counts — using tagged template literals only (no .query())
  console.log('\n2. Table counts...\n');

  const tables = [
    { name: 'complete_shape_registry', min: 817    },
    { name: 'formula_implementations', min: 1544   },
    { name: 'shape_token_ledger',      min: 1  },
    { name: 'shape_tokens',            min: 100    },
    { name: 'shape_token_energy',      min: 1      },
  ];

  for (const t of tables) {
    try {
      // Tagged template — works with all @neondatabase/serverless versions
      const rows = await sql`SELECT COUNT(*)::int as count FROM ${sql(t.name)}`;
      const count: number = rows[0].count;
      const icon = count >= t.min ? '✅' : '⚠️ ';
      console.log(`   ${icon} ${t.name.padEnd(32)} ${count.toLocaleString().padStart(10)} rows`);
    } catch (err: any) {
      console.log(`   ❌ ${t.name.padEnd(32)} ${err.message}`);
    }
  }

  // Step 3: First energy record
  console.log('\n3. Genesis integrity...');
  try {
    const rows = await sql`
      SELECT token_id, energy_hash
      FROM shape_token_energy
      ORDER BY id ASC
      LIMIT 1
    `;
    if (rows.length) {
      console.log(`   ✅ token_id:    ${rows[0].token_id}`);
      console.log(`   ✅ energy_hash: ${rows[0].energy_hash}`);
    } else {
      console.log(`   ⚠️  No energy records`);
    }
  } catch (err: any) {
    console.log(`   ❌ ${err.message}`);
  }

  // Step 4: Secrets
  console.log('\n4. Replit Secrets...\n');
  const secrets = [
    'DATABASE_URL',
    'UUON_TOKEN_SECRET',
    'UUON_GENESIS_SECRET',
    'THIRDWEB_SECRET_KEY',
    'PINATA_JWT',
    'PRIVATE_KEY',
  ];
  for (const k of secrets) {
    console.log(`   ${process.env[k] ? '✅' : '❌'} ${k}`);
  }

  const total = Date.now() - start;
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  Done in ${total}ms`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`\n  DB is working when you see:`);
  console.log(`  ✅ Connected  + ✅ on complete_shape_registry\n`);
}

runHealthCheck().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});