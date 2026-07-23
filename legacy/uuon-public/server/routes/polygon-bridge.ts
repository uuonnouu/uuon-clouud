/**
 * Polygon Bridge API — REST endpoints for smart contract management,
 * weekly report access, and on-chain token verification.
 */

import { Router, Request, Response } from 'express';
import {
  deployContract,
  getBridgeStatus,
  computeCurrentMerkleRoot,
  buildMerkleTree,
  pushMerkleRootToChain
} from '../polygonBridgeService.js';
import {
  generateWeeklyReport,
  getLatestReport,
  getAllReports,
  getReportBySequence
} from '../weeklyPublisher.js';
import crypto from 'crypto';
import { Pool } from 'pg';

const router = Router();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Status ──────────────────────────────────────────────────────────────────

/**
 * GET /api/polygon/status
 * Returns configuration state, contract address, and latest on-chain root.
 * Public endpoint — no auth required.
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await getBridgeStatus();
    const latestReport = getLatestReport();

    res.json({
      success: true,
      bridge: status,
      latest_report: latestReport
        ? {
            sequence: latestReport.report_sequence,
            week: latestReport.report_week,
            generated: latestReport.report_generated,
            merkle_root: latestReport.merkle_root,
            token_count: latestReport.total_tokens_minted,
            report_hash: latestReport.report_hash,
            polygon_tx: latestReport.polygon_tx_hash,
            explorer_url: latestReport.polygon_explorer_url
          }
        : null,
      setup: {
        needs: [
          !process.env.POLYGON_PRIVATE_KEY && 'Add POLYGON_PRIVATE_KEY secret (wallet with ~5 MATIC)',
          !process.env.POLYGON_CONTRACT_ADDRESS && 'Deploy contract via POST /api/polygon/deploy, then add POLYGON_CONTRACT_ADDRESS'
        ].filter(Boolean),
        polygon_rpc: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com (default)',
        docs: 'https://polygon.technology/developers'
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Deploy ──────────────────────────────────────────────────────────────────

/**
 * POST /api/polygon/deploy
 * Compiles and deploys the MerkleRootRegistry contract to Polygon.
 * Requires POLYGON_PRIVATE_KEY secret set.  One-time operation.
 */
router.post('/deploy', async (_req: Request, res: Response) => {
  try {
    if (!process.env.POLYGON_PRIVATE_KEY) {
      return res.status(400).json({
        success: false,
        error: 'POLYGON_PRIVATE_KEY not configured',
        instructions: [
          '1. Get a Polygon wallet with ~5 MATIC (for gas)',
          '2. Add POLYGON_PRIVATE_KEY to Replit Secrets (Settings → Secrets)',
          '3. Optionally set POLYGON_RPC_URL (default: https://polygon-rpc.com)',
          '4. Call this endpoint again — costs ~$2–5 one-time'
        ]
      });
    }

    const result = await deployContract();

    // Persist the address so /api/web3/setup-status can read it immediately
    // (before the user manually adds POLYGON_CONTRACT_ADDRESS to Replit Secrets)
    try {
      const { saveDeployedContractAddress } = await import('./web3-setup.js');
      saveDeployedContractAddress(result.address);
    } catch { /* non-fatal */ }

    res.json({
      success: true,
      contract_address: result.address,
      tx_hash: result.txHash,
      network: 'Polygon Mainnet',
      explorer_url: `https://polygonscan.com/address/${result.address}`,
      opensea_collection: 'https://opensea.io/collection/dmension-mathematical-universe',
      next_step: `Add POLYGON_CONTRACT_ADDRESS=${result.address} to Replit Secrets to make it permanent`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Weekly reports ──────────────────────────────────────────────────────────

/**
 * GET /api/polygon/weekly-report/latest
 * The most recent weekly report in bank-standard format.
 * Public — anyone can verify the Merkle root against the on-chain contract.
 */
router.get('/weekly-report/latest', (_req: Request, res: Response) => {
  const report = getLatestReport();
  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'No report generated yet',
      hint: 'Reports are generated every Monday 09:00 UTC, or POST /api/polygon/weekly-report/generate to trigger manually'
    });
  }
  res.json({ success: true, report });
});

/**
 * GET /api/polygon/weekly-report/all
 * All reports (up to 52 weeks / 1 year).
 */
router.get('/weekly-report/all', (_req: Request, res: Response) => {
  res.json({ success: true, reports: getAllReports(), count: getAllReports().length });
});

/**
 * GET /api/polygon/weekly-report/:seq
 * Specific report by sequence number.
 */
router.get('/weekly-report/:seq', (req: Request, res: Response) => {
  const seq = parseInt(req.params.seq);
  if (isNaN(seq)) return res.status(400).json({ success: false, error: 'Invalid sequence number' });
  const report = getReportBySequence(seq);
  if (!report) return res.status(404).json({ success: false, error: `Report #${seq} not found` });
  res.json({ success: true, report });
});

/**
 * POST /api/polygon/weekly-report/generate
 * Manually trigger report generation (admin / testing).
 */
router.post('/weekly-report/generate', async (_req: Request, res: Response) => {
  try {
    const report = await generateWeeklyReport();
    res.json({
      success: true,
      message: 'Weekly report generated',
      sequence: report.report_sequence,
      week: report.report_week,
      merkle_root: report.merkle_root,
      report_hash: report.report_hash,
      polygon_tx: report.polygon_tx_hash,
      explorer_url: report.polygon_explorer_url,
      full_report_url: `/api/polygon/weekly-report/${report.report_sequence}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Merkle root ─────────────────────────────────────────────────────────────

/**
 * GET /api/polygon/merkle-root
 * Compute and return the current Merkle root without publishing.
 */
router.get('/merkle-root', async (_req: Request, res: Response) => {
  try {
    const data = await computeCurrentMerkleRoot();
    res.json({ success: true, ...data, computed_at: new Date().toISOString() });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/polygon/push-root
 * Manually push current Merkle root to Polygon (requires wallet config).
 */
router.post('/push-root', async (_req: Request, res: Response) => {
  try {
    const { root, tokenCount, energyTotal } = await computeCurrentMerkleRoot();
    const reportUri = `${process.env.PUBLIC_URL || 'https://distinguished-rebirth-production.up.railway.app'}/api/polygon/weekly-report/latest`;
    const result = await pushMerkleRootToChain(root, tokenCount, energyTotal, reportUri);
    res.json({
      success: true,
      merkle_root: root,
      tx_hash: result.txHash,
      block_number: result.blockNumber,
      gas_used: result.gasUsed,
      explorer_url: `https://polygonscan.com/tx/${result.txHash}`
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── Token verification ──────────────────────────────────────────────────────

/**
 * GET /api/polygon/verify?token_id=...
 * Verify a specific token is included in the latest committed Merkle root.
 * Public — anyone can check any token without trusting the platform.
 */
router.get('/verify', async (req: Request, res: Response) => {
  const { token_id } = req.query;

  if (!token_id || typeof token_id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Provide token_id as query parameter',
      example: '/api/polygon/verify?token_id=YOUR_TOKEN_ID'
    });
  }

  try {
    // Fetch token metadata
    const { rows: [meta] } = await pool.query<{
      token_id: string; param_hash: string; energy_hash: string;
    }>(`
      SELECT stm.token_id, stm.param_hash,
             COALESCE(ste.energy_hash, 'none') AS energy_hash
      FROM shape_token_metadata stm
      LEFT JOIN shape_token_energy ste ON ste.token_id = stm.token_id
      WHERE stm.token_id = $1
    `, [token_id]);

    if (!meta) {
      return res.status(404).json({ success: false, error: `Token ${token_id} not found` });
    }

    // Derive leaf hash
    const leafHash = crypto.createHash('sha256')
      .update(meta.token_id + (meta.param_hash || '') + (meta.energy_hash || ''))
      .digest('hex');

    // Get all leaves for Merkle tree reconstruction
    const { rows: allTokens } = await pool.query<{
      token_id: string; param_hash: string; energy_hash: string;
    }>(`
      SELECT stm.token_id, stm.param_hash,
             COALESCE(ste.energy_hash, 'none') AS energy_hash
      FROM shape_token_metadata stm
      LEFT JOIN shape_token_energy ste ON ste.token_id = stm.token_id
    `);

    const leaves = allTokens.map(t =>
      crypto.createHash('sha256')
        .update(t.token_id + (t.param_hash || '') + (t.energy_hash || ''))
        .digest('hex')
    );

    const { root, proofs } = buildMerkleTree(leaves);
    const proof = proofs[leafHash] ?? [];

    const latestReport = getLatestReport();

    res.json({
      success: true,
      token_id,
      leaf_hash: '0x' + leafHash,
      merkle_proof: proof,
      current_root: root,
      committed_root: latestReport?.merkle_root ?? null,
      root_matches_report: latestReport ? root === latestReport.merkle_root : null,
      polygon_contract: process.env.POLYGON_CONTRACT_ADDRESS || null,
      polygon_explorer: process.env.POLYGON_CONTRACT_ADDRESS
        ? `https://polygonscan.com/address/${process.env.POLYGON_CONTRACT_ADDRESS}`
        : null,
      last_on_chain_tx: latestReport?.polygon_tx_hash ?? null,
      instructions: [
        '1. Call verifyTokenInclusion(leaf_hash, merkle_proof) on the Polygon contract',
        '2. A return value of true proves this token is in the committed ledger',
        '3. Anyone can verify — no trust in Δmension required'
      ]
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
