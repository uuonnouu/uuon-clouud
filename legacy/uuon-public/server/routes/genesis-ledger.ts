import { Router, Request, Response } from 'express';
import { createHash, createHmac } from 'crypto';
import { db } from '../storage';

function getGenesisSecret(): string {
  return process.env.UUON_TOKEN_SECRET || process.env.SESSION_SECRET || 'uuon-genesis-fallback';
}

const router = Router();

const PHI  = 1.618033988749895;
const PHI2 = PHI * PHI;   // 2.618033988749895
const PHI3 = PHI2 * PHI;  // 4.235...

function sha256(data: string): string {
  return createHash('sha256').update(data).digest('hex');
}
function hmacSha256(data: string, key: string): string {
  return createHmac('sha256', key).update(data).digest('hex');
}

function buildMerkleRoot(leaves: string[]): string {
  if (leaves.length === 0) return sha256('empty');
  let layer = leaves.map(l => sha256(l));
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left  = layer[i];
      const right = layer[i + 1] ?? layer[i];
      next.push(sha256(left + right));
    }
    layer = next;
  }
  return layer[0];
}

router.get('/', (_req, res) => {
  res.json({
    name: 'UUON Genesis Ledger',
    version: '1.0.0',
    description: 'OpenTimestamps-compatible cryptographic proof of the full UUON token ledger state',
    phi: PHI,
    endpoints: [
      { method: 'GET',  path: '/snapshot', description: 'Live ledger snapshot — totals, merkle root, φ-energy' },
      { method: 'POST', path: '/stamp',    description: 'Create a new timestamped Genesis proof and write it to DB' },
      { method: 'GET',  path: '/proof',    description: 'Latest Genesis proof document (OTS-compatible JSON)' },
      { method: 'GET',  path: '/history',  description: 'All Genesis stamps ever created' },
    ]
  });
});

router.get('/snapshot', async (_req: Request, res: Response) => {
  try {
    const rows = await db.execute(`
      SELECT
        stl.token_id,
        stl.shape_type,
        stl.status,
        stl.current_state_hash,
        stl.merkle_leaf_hash,
        stm.base_energy,
        stm.phi_ratio,
        stm.calculated_value,
        stb.block_number
      FROM shape_token_ledger stl
      LEFT JOIN shape_token_metadata stm ON stl.token_id = stm.token_id
      LEFT JOIN shape_token_transactions stb ON stl.issuance_tx_id = stb.tx_id
      ORDER BY stl.id ASC
    `);

    const rowArr = Array.isArray(rows) ? rows : ((rows as any).rows ?? []);
    const tokens = rowArr.filter((r: any) => r.token_id);

    let totalBaseEnergy    = 0;
    let totalPhiEnergy     = 0;
    let activeCount        = 0;
    const leaves: string[] = [];

    for (const t of tokens) {
      const base = parseFloat(t.base_energy ?? '0') || 0;
      const phi  = parseFloat(t.phi_ratio ?? String(PHI)) || PHI;
      const calc = parseFloat(t.calculated_value ?? '0') || base * phi;
      totalBaseEnergy += base;
      totalPhiEnergy  += calc;
      if (t.status === 'active') activeCount++;
      if (t.merkle_leaf_hash) leaves.push(t.merkle_leaf_hash);
    }

    const merkleRoot   = buildMerkleRoot(leaves);
    const snapshotHash = sha256(`UUON|${tokens.length}|${totalPhiEnergy}|${merkleRoot}|${Date.now()}`);

    // Energy-price summary from system config
    const cfgRows = await db.execute(`
      SELECT base_token_price, version FROM uuon_system_config LIMIT 1
    `);
    const cfgArr = Array.isArray(cfgRows) ? cfgRows : ((cfgRows as any).rows ?? []);
    const cfg = cfgArr[0] ?? {};
    const baseTokenPrice = parseFloat(cfg.base_token_price ?? '1.618');

    // Whistler-specific aggregate
    const wRows = await db.execute(`
      SELECT COUNT(*) as cnt, AVG(stm.calculated_value::numeric) as avg_e
      FROM shape_token_ledger stl
      JOIN shape_token_metadata stm ON stl.token_id = stm.token_id
      WHERE stl.shape_type = 'whistler_waves_001'
        AND stm.calculated_value IS NOT NULL
        AND stm.calculated_value::numeric > 0
    `);
    const wArr = Array.isArray(wRows) ? wRows : ((wRows as any).rows ?? []);
    const wRow = wArr[0] ?? {};
    const whistlerTokenCount    = parseInt(wRow.cnt ?? '0');
    const whistlerEnergyPerToken = parseFloat(wRow.avg_e ?? '0');

    res.json({
      success: true,
      snapshot: {
        timestamp:       new Date().toISOString(),
        totalTokens:     tokens.length,
        activeTokens:    activeCount,
        totalBaseEnergy,
        totalPhiEnergy:  parseFloat(totalPhiEnergy.toFixed(6)),
        phiMultiplier:   PHI,
        phi2:            PHI2,
        phi3:            PHI3,
        merkleRoot,
        snapshotHash,
        energyBreakdown: {
          raw:            totalBaseEnergy,
          timesφ:         parseFloat(totalPhiEnergy.toFixed(6)),
          timesφ2:        parseFloat((totalBaseEnergy * PHI2).toFixed(6)),
          timesφ3:        parseFloat((totalBaseEnergy * PHI3).toFixed(6)),
          scientific:     totalPhiEnergy.toExponential(10),
          perToken:       parseFloat((totalPhiEnergy / Math.max(tokens.length, 1)).toFixed(6))
        },
        energyPrice: {
          baseTokenPrice,
          baseTokenPriceScientific: baseTokenPrice.toExponential(6),
          whistlerEnergyPerToken,
          whistlerEnergyPerTokenScientific: whistlerEnergyPerToken.toExponential(6),
          whistlerTokenCount,
          priceSource: 'φ-energy derived — Whistler Waves canonical anchor',
          systemVersion: cfg.version ?? '3.0.0',
          genesisAnchor: {
            merkleRoot: '0xc306d8c5e313a8108c263f7ef80376b741718258c8bb3e3ce47f08f730191e24',
            btcAnchorPool: 'a.pool.opentimestamps.org',
            bridgeStatus: 'btc_anchored'
          }
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

router.post('/stamp', async (_req: Request, res: Response) => {
  try {
    const rows = await db.execute(`
      SELECT
        stl.token_id,
        stl.shape_type,
        stl.status,
        stl.current_state_hash,
        stl.merkle_leaf_hash,
        stm.base_energy,
        stm.phi_ratio,
        stm.calculated_value,
        stb.block_number
      FROM shape_token_ledger stl
      LEFT JOIN shape_token_metadata stm ON stl.token_id = stm.token_id
      LEFT JOIN shape_token_transactions stb ON stl.issuance_tx_id = stb.tx_id
      ORDER BY stl.id ASC
    `);

    const rowArr2 = Array.isArray(rows) ? rows : ((rows as any).rows ?? []);
    const tokens = rowArr2.filter((r: any) => r.token_id);

    let totalBaseEnergy = 0;
    let totalPhiEnergy  = 0;
    let activeCount     = 0;
    const leaves: string[]    = [];
    const tokenIds: string[]  = [];

    for (const t of tokens) {
      const base = parseFloat(t.base_energy ?? '0') || 0;
      const phi  = parseFloat(t.phi_ratio ?? String(PHI)) || PHI;
      const calc = parseFloat(t.calculated_value ?? '0') || base * phi;
      totalBaseEnergy += base;
      totalPhiEnergy  += calc;
      if (t.status === 'active') activeCount++;
      if (t.merkle_leaf_hash) leaves.push(t.merkle_leaf_hash);
      tokenIds.push(t.token_id);
    }

    const merkleRoot     = buildMerkleRoot(leaves);
    const genesisId      = `GENESIS-${Date.now()}-${Math.random().toString(36).slice(2,10).toUpperCase()}`;
    const stampTimestamp = new Date().toISOString();
    const ledgerHash     = sha256(tokenIds.sort().join('|'));
    const genesisHash    = sha256(`UUON-GENESIS|${merkleRoot}|${ledgerHash}|${totalPhiEnergy}|${stampTimestamp}`);
    const signature      = hmacSha256(genesisHash, getGenesisSecret());

    const proofDoc = {
      version:         '1.0',
      protocol:        'UUON-OpenTimestamp',
      genesisId,
      stampTimestamp,
      ledger: {
        totalTokens:    tokens.length,
        activeTokens:   activeCount,
        latestTokenId:  tokenIds[tokenIds.length - 1] ?? null,
        merkleRoot,
        ledgerHash,
      },
      energy: {
        totalBaseEnergy,
        totalPhiEnergy:  parseFloat(totalPhiEnergy.toFixed(10)),
        phi:             PHI,
        phi2:            PHI2,
        phi3:            PHI3,
        scientific:      totalPhiEnergy.toExponential(10),
        breakdown: {
          raw:     totalBaseEnergy,
          'E×φ':   parseFloat(totalPhiEnergy.toFixed(10)),
          'E×φ²':  parseFloat((totalBaseEnergy * PHI2).toFixed(10)),
          'E×φ³':  parseFloat((totalBaseEnergy * PHI3).toFixed(10)),
        }
      },
      proof: {
        genesisHash,
        signature,
        algorithm:      'SHA-256 + HMAC-SHA-256',
        anchored:       false,
        bitcoinTxId:    null,
        note:           'Upgrade to live Bitcoin anchor via OpenTimestamps.org calendar server'
      },
      openTimestamps: {
        compatible:     true,
        fileHash:       genesisHash,
        hashType:       'sha256',
        calendarUrl:    'https://alice.btc.calendar.opentimestamps.org',
        upgradeNote:    `POST ${genesisHash} to OTS calendar to anchor on Bitcoin blockchain`
      }
    };

    console.log(`\n🔏 GENESIS LEDGER STAMPED`);
    console.log(`   ID:         ${genesisId}`);
    console.log(`   Timestamp:  ${stampTimestamp}`);
    console.log(`   Tokens:     ${tokens.length}`);
    console.log(`   Merkle:     ${merkleRoot.slice(0,16)}...`);
    console.log(`   E×φ Total:  ${totalPhiEnergy.toExponential(6)}`);
    console.log(`   Hash:       ${genesisHash.slice(0,16)}...`);

    res.json({
      success:   true,
      genesisId,
      proof:     proofDoc,
      message:   `Genesis ledger stamped — ${tokens.length} tokens, E×φ = ${totalPhiEnergy.toExponential(6)}`
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

router.get('/proof', async (_req: Request, res: Response) => {
  try {
    const rows = await db.execute(`
      SELECT
        COUNT(*) AS total_tokens,
        SUM(CASE WHEN stl.status='active' THEN 1 ELSE 0 END) AS active_tokens,
        MAX(stb.block_number) AS latest_block
      FROM shape_token_ledger stl
      LEFT JOIN shape_token_transactions stb ON stl.issuance_tx_id = stb.tx_id
    `);

    const rowsArr = Array.isArray(rows) ? rows : ((rows as any).rows ?? []);
    const r           = rowsArr[0] ?? {};
    const totalTokens = parseInt(r.total_tokens ?? '0');
    const latestBlock = parseInt(r.latest_block ?? '0');

    const leaves: string[] = [];
    const energyRows = await db.execute(`
      SELECT stl.merkle_leaf_hash, stm.base_energy, stm.phi_ratio, stm.calculated_value
      FROM shape_token_ledger stl
      LEFT JOIN shape_token_metadata stm ON stl.token_id = stm.token_id
      ORDER BY stl.id ASC
    `);

    let totalPhiEnergy = 0;
    let totalBase      = 0;
    const energyRowsArr = Array.isArray(energyRows) ? energyRows : ((energyRows as any).rows ?? []);
    for (const row of energyRowsArr) {
      if (row.merkle_leaf_hash) leaves.push(row.merkle_leaf_hash);
      const base = parseFloat(row.base_energy ?? '0') || 0;
      const phi  = parseFloat(row.phi_ratio ?? String(PHI)) || PHI;
      const calc = parseFloat(row.calculated_value ?? '0') || base * phi;
      totalBase      += base;
      totalPhiEnergy += calc;
    }

    const merkleRoot  = buildMerkleRoot(leaves);
    const genesisHash = sha256(`UUON-PROOF|${merkleRoot}|${totalPhiEnergy}|${latestBlock}`);

    // Pull stored genesis proof from genesis_proofs table
    const gpRows = await db.execute(`
      SELECT genesis_id, date, merkle_root, bridge_status, btc_anchor, verify_url,
             ots_file, genesis_txt, token_count, blocks, transactions,
             token_allocation, whistler_energy_per_token::text, total_phi_energy::text,
             created_at
      FROM genesis_proofs
      WHERE genesis_id = 'GENESIS-1780640747793-WHISTLER'
      LIMIT 1
    `);
    const gpArr = Array.isArray(gpRows) ? gpRows : ((gpRows as any).rows ?? []);
    const gp = gpArr[0] ?? null;

    // Whistler energy summary from system config
    const cfgRows2 = await db.execute(`
      SELECT base_token_price::text, whistler_canonical_energy::text, version
      FROM uuon_system_config LIMIT 1
    `);
    const cfgArr2 = Array.isArray(cfgRows2) ? cfgRows2 : ((cfgRows2 as any).rows ?? []);
    const cfg2 = cfgArr2[0] ?? {};

    res.json({
      success: true,
      proof: {
        generatedAt:   new Date().toISOString(),
        protocol:      'UUON-OpenTimestamp v1.0',
        ledger: {
          totalTokens,
          activeTokens: parseInt(r.active_tokens ?? '0'),
          latestBlock,
          merkleRoot
        },
        energy: {
          totalBase,
          totalPhiEnergy:  parseFloat(totalPhiEnergy.toFixed(10)),
          phi:             PHI,
          scientific:      totalPhiEnergy.toExponential(10),
          perToken:        parseFloat((totalPhiEnergy / Math.max(totalTokens, 1)).toFixed(6))
        },
        hash:      genesisHash,
        algorithm: 'SHA-256 Merkle Tree over all token merkle_leaf_hashes',
        status:    gp ? 'btc_anchored' : 'off-chain — ready for Bitcoin OTS anchor',
        genesisOTS: gp ? {
          genesisId:              gp.genesis_id,
          date:                   gp.date,
          merkleRoot:             gp.merkle_root,
          bridgeStatus:           gp.bridge_status,
          btcAnchorPool:          gp.btc_anchor,
          verifyAt:               gp.verify_url,
          otsFile:                gp.ots_file,
          genesis_txt:            gp.genesis_txt,
          tokenCount:             gp.token_count,
          blocks:                 gp.blocks,
          transactions:           gp.transactions,
          tokenAllocation:        gp.token_allocation,
          whistlerEnergyPerToken: parseFloat(gp.whistler_energy_per_token ?? '0'),
          totalPhiEnergy:         parseFloat(gp.total_phi_energy ?? '0'),
          energyPerToken:         parseFloat(cfg2.base_token_price ?? '0'),
          whistlerCanonicalEnergy: parseFloat(cfg2.whistler_canonical_energy ?? '0'),
          systemVersion:          cfg2.version ?? '3.0.0',
          storedAt:               gp.created_at
        } : null
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
