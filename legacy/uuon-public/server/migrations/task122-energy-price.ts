/**
 * Migration: Task 122 — Wire energy-derived price into token system
 *
 * Idempotent — safe to run on every startup.
 * Uses ALTER TABLE … IF NOT EXISTS / ADD COLUMN IF NOT EXISTS so re-runs are safe.
 *
 * Operations (in dependency order):
 *  1. Schema: add whistler_canonical_energy column, fix base_token_price precision,
 *             create genesis_proofs table
 *  2. Data:   update uuon_system_config with Whistler canonical values
 *  3. Data:   insert genesis OTS proof into genesis_proofs (ON CONFLICT DO NOTHING)
 *  4. Data:   insert genesis sentinel into shape_token_ledger (FK anchor)
 *  5. Data:   upsert genesis proof row in shape_token_state_roots
 *  6. Data:   populate token_values from uuon_tokens → uuon_shapes → shape energy avg
 */

import { db } from '../storage';
import { sql } from 'drizzle-orm';

const WHISTLER_AVG_ENERGY      = '27177268333335706450000'; // 2.7177×10²²  (Whistler per-token average)
const WHISTLER_CANONICAL_ENERGY = '27637886000000000000000'; // 2.7637886×10²² (original spec anchor)
const GENESIS_MERKLE_ROOT =
  '0xc306d8c5e313a8108c263f7ef80376b741718258c8bb3e3ce47f08f730191e24';

export async function runTask122Migration(): Promise<void> {
  const log = (msg: string) => console.log(`[task122-migration] ${msg}`);
  try {
    // ── 1a. Fix base_token_price precision (real → numeric) ──────────────────
    await db.execute(sql`
      ALTER TABLE uuon_system_config
        ALTER COLUMN base_token_price TYPE numeric USING base_token_price::numeric
    `).catch(() => {}); // no-op if already numeric

    // ── 1b. Add whistler_canonical_energy column ──────────────────────────────
    await db.execute(sql`
      ALTER TABLE uuon_system_config
        ADD COLUMN IF NOT EXISTS whistler_canonical_energy numeric
    `);
    log('✓ uuon_system_config schema ready');

    // ── 1c. Create genesis_proofs table ───────────────────────────────────────
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS genesis_proofs (
        id                        serial PRIMARY KEY,
        genesis_id                text NOT NULL UNIQUE,
        date                      text NOT NULL,
        merkle_root               text NOT NULL,
        bridge_status             text NOT NULL DEFAULT 'btc_anchored',
        btc_anchor                text,
        verify_url                text,
        ots_file                  text,
        genesis_txt               jsonb,
        token_count               integer,
        blocks                    integer,
        transactions              integer,
        token_allocation          jsonb,
        whistler_energy_per_token numeric,
        total_phi_energy          numeric,
        created_at                timestamp DEFAULT NOW(),
        updated_at                timestamp DEFAULT NOW()
      )
    `);
    log('✓ genesis_proofs table ready');

    // ── 2. Canonical system config values ─────────────────────────────────────
    await db.execute(sql`
      UPDATE uuon_system_config
      SET base_token_price          = ${WHISTLER_AVG_ENERGY}::numeric,
          whistler_canonical_energy  = ${WHISTLER_CANONICAL_ENERGY}::numeric,
          version                    = '3.0.0',
          updated_at                 = NOW()
      WHERE id = 1
    `);
    log(`✓ uuon_system_config — base_token_price=${WHISTLER_AVG_ENERGY}, whistler_canonical=${WHISTLER_CANONICAL_ENERGY}, v3.0.0`);

    // ── 3. Genesis proof in genesis_proofs ────────────────────────────────────
    const genesisTxt = {
      version:     '1.0',
      protocol:    'UUON-OpenTimestamp',
      chain:       'UUON Chain (Dmension / UUON Foundation)',
      tokenAllocation: {
        SOCIAL_IMPACT_RESERVE: 115,
        UUON_CHAIN_OPERATIONS: 1,
        DMENSION_FOUNDER:      1,
        PUBLIC_GIFT:           1,
      },
      btcAnchor: {
        pool:      'a.pool.opentimestamps.org',
        verifyAt:  'https://opentimestamps.org',
        otsFile:   'uuon-chain-genesis_1780640747793.ots',
      },
      whistlerWaves: {
        shapeType:       'whistler_waves_001',
        tokenCount:      120,
        energyPerToken:  WHISTLER_AVG_ENERGY,
        canonicalEnergy: WHISTLER_CANONICAL_ENERGY,
        phi:             1.618033988749895,
      },
    };

    await db.execute(sql`
      INSERT INTO genesis_proofs (
        genesis_id, date, merkle_root, bridge_status, btc_anchor, verify_url, ots_file,
        genesis_txt, token_count, blocks, transactions, token_allocation,
        whistler_energy_per_token, total_phi_energy
      ) VALUES (
        'GENESIS-1780640747793-WHISTLER',
        '2026-06-05T04:42:25.659Z',
        ${GENESIS_MERKLE_ROOT},
        'btc_anchored',
        'a.pool.opentimestamps.org',
        'https://opentimestamps.org',
        'uuon-chain-genesis_1780640747793.ots',
        ${JSON.stringify(genesisTxt)}::jsonb,
        118, 12335, 14986,
        ${JSON.stringify(genesisTxt.tokenAllocation)}::jsonb,
        ${WHISTLER_AVG_ENERGY}::numeric,
        3261272200000284774000000
      )
      ON CONFLICT (genesis_id) DO NOTHING
    `);
    log('✓ genesis proof in genesis_proofs');

    // ── 4. Genesis sentinel in shape_token_ledger (FK anchor for step 5) ─────
    await db.execute(sql`
      INSERT INTO shape_token_ledger
        (token_id, shape_type, token_name, token_symbol, status,
         current_state_hash, merkle_leaf_hash)
      VALUES (
        'GENESIS-WHISTLER-ORIGIN',
        'whistler_waves_001',
        'UUON Chain Genesis Anchor',
        'UUON', 'active',
        'c306d8c5e313a8108c263f7ef80376b741718258c8bb3e3ce47f08f730191e24',
        'c306d8c5e313a8108c263f7ef80376b741718258c8bb3e3ce47f08f730191e24'
      )
      ON CONFLICT (token_id) DO NOTHING
    `);

    // ── 5. Genesis OTS proof in shape_token_state_roots ──────────────────────
    await db.execute(sql`
      INSERT INTO shape_token_state_roots
        (token_id, state_leaf_hash, state_merkle_root,
         bridge_status, bridge_tx_hash, merkle_proof)
      VALUES (
        'GENESIS-WHISTLER-ORIGIN',
        'c306d8c5e313a8108c263f7ef80376b741718258c8bb3e3ce47f08f730191e24',
        ${GENESIS_MERKLE_ROOT},
        'btc_anchored',
        'a.pool.opentimestamps.org',
        ${JSON.stringify(genesisTxt)}::jsonb
      )
      ON CONFLICT (token_id) DO UPDATE
        SET state_merkle_root = EXCLUDED.state_merkle_root,
            bridge_status     = EXCLUDED.bridge_status,
            merkle_proof      = EXCLUDED.merkle_proof,
            updated_at        = NOW()
    `);
    log('✓ genesis OTS proof in shape_token_state_roots');

    // ── 6. Populate token_values (per-token via uuon_tokens → shape energy) ──
    //
    // token_values.token_id FK → uuon_tokens.id.
    // Bridge: uuon_tokens → uuon_shapes (shape_type) → avg(shape_token_metadata)
    // so each UUON token gets the per-shape φ-energy value.
    // Falls back to φ = 1.618… for shapes with no energy data.
    await db.execute(sql`
      INSERT INTO token_values
        (id, token_id, uuon_value, rwa_value, market_price, total_fiat_value)
      SELECT
        UPPER(REPLACE(SUBSTRING(MD5('tv:' || ut.id), 1, 26), '-', '0')) AS id,
        ut.id                                                             AS token_id,
        COALESCE(se.avg_calc, 1.618033988749895)                         AS uuon_value,
        COALESCE(se.avg_calc * 1.618033988749895,
                 1.618033988749895 * 1.618033988749895)                  AS rwa_value,
        0.15                                                              AS market_price,
        COALESCE(se.avg_calc, 1.618033988749895) * 0.15                  AS total_fiat_value
      FROM uuon_tokens ut
      LEFT JOIN uuon_shapes us ON ut.shape_id = us.id
      LEFT JOIN (
        SELECT stl.shape_type,
               AVG(stm.calculated_value::numeric) AS avg_calc
        FROM shape_token_ledger stl
        JOIN shape_token_metadata stm ON stl.token_id = stm.token_id
        WHERE stm.calculated_value IS NOT NULL
          AND stm.calculated_value::numeric > 0
        GROUP BY stl.shape_type
      ) se ON us.type = se.shape_type
      ON CONFLICT (id) DO UPDATE
        SET uuon_value       = EXCLUDED.uuon_value,
            rwa_value        = EXCLUDED.rwa_value,
            total_fiat_value = EXCLUDED.total_fiat_value
    `);

    const cntRows = await db.execute(sql`SELECT COUNT(*) AS cnt FROM token_values`);
    const cnt = parseInt(
      (Array.isArray(cntRows) ? cntRows : (cntRows as any).rows ?? [])[0]?.cnt ?? '0',
    );
    log(`✓ token_values — ${cnt} rows`);

    log('✅ all steps complete');
  } catch (err) {
    console.error('[task122-migration] ❌ error (non-fatal):', err);
  }
}
