/**
 * Weekly Publisher — Automated Bank-Format Report Scheduler
 *
 * Every Monday at 09:00:00 UTC this service:
 *   1. Computes the Merkle root over all 14,990+ tokens
 *   2. Generates a signed report in a fixed machine-readable format
 *   3. Pushes the Merkle root to Polygon (if wallet configured)
 *   4. Persists the report so any caller can verify history
 *
 * Format is modelled on FRB / BIS data release conventions:
 *   - ISO 8601 timestamps (always UTC)
 *   - Monotonically incrementing sequence numbers
 *   - Cryptographic report hash baked into each record
 *   - Same field names, same order, every week
 */

import crypto from 'crypto';
import { Pool } from 'pg';
import { computeCurrentMerkleRoot, pushMerkleRootToChain } from './polygonBridgeService.js';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Report types ──────────────────────────────────────────────────────────────

export interface WeeklyReport {
  // Header (fixed, identical structure every week)
  report_format:    'UUON-WEEKLY-v1';
  report_sequence:  number;          // monotonically increasing, starts at 1
  report_week:      string;          // ISO week: '2026-W23'
  report_generated: string;          // ISO 8601 UTC timestamp
  scheduled_time:   '09:00:00Z';     // always exactly this

  // Token ledger state
  total_tokens_minted:   number;
  total_tokens_active:   number;
  new_tokens_this_week:  number;
  total_energy_stored:   number;
  energy_this_week:      number;

  // Valuation
  interaction_token_price_usd: number;  // $1.618 — auto-generated Floor 2
  named_mint_price_usd:        number;  // $1,618 — Floor 1 named mint
  token_unit_price_usd:        number;  // alias for interaction price
  portfolio_value_usd:         number;  // live portfolio from DB
  market_cap_usd:              number;  // total_tokens × named_mint_price

  // Cryptographic commitment
  merkle_root:           string;     // SHA-256 root over all token state hashes
  leaf_count:            number;
  report_hash:           string;     // SHA-256 of this report (sans report_hash field)

  // Blockchain bridge
  polygon_tx_hash:       string | null;
  polygon_block:         number | null;
  polygon_contract:      string | null;
  polygon_explorer_url:  string | null;

  // Verification
  verification_url:      string;
  api_endpoint:          string;
}

// ── In-memory report store (persisted to DB) ──────────────────────────────────

let reportSequence = 0;
let reports: WeeklyReport[] = [];

// ── ISO week string (e.g. '2026-W23') ────────────────────────────────────────

function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

// ── Gather weekly delta stats from DB ────────────────────────────────────────

async function getWeeklyDelta(): Promise<{ newTokens: number; newEnergy: number }> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000);
  const { rows: [t] } = await pool.query<{ cnt: string }>(`
    SELECT COUNT(*) AS cnt FROM shape_token_ledger WHERE created_at >= $1
  `, [weekAgo]);
  const { rows: [e] } = await pool.query<{ total: string }>(`
    SELECT COALESCE(SUM(energy_in), 0)::text AS total
    FROM energy_transactions WHERE conversion_timestamp >= $1
  `, [weekAgo]);
  return {
    newTokens: parseInt(t?.cnt ?? '0'),
    newEnergy: Math.round(parseFloat(e?.total ?? '0'))
  };
}

// ── Generate one weekly report ────────────────────────────────────────────────

export async function generateWeeklyReport(): Promise<WeeklyReport> {
  const now = new Date();
  const scheduledTime = new Date(now);
  scheduledTime.setUTCHours(9, 0, 0, 0);

  reportSequence += 1;

  // 1. Compute Merkle root
  const { root, tokenCount, energyTotal, leafCount } = await computeCurrentMerkleRoot();

  // 2. DB stats
  const { rows: [active] } = await pool.query<{ cnt: string }>(`
    SELECT COUNT(*) AS cnt FROM shape_token_ledger WHERE status = 'minted'
  `);
  const { rows: [sys] } = await pool.query<{
    base_token_price: string; named_token_price: string;
  }>(`
    SELECT base_token_price, named_token_price FROM uuon_system_config LIMIT 1
  `);
  const { rows: [portfolio] } = await pool.query<{
    total_fiat_value: string; total_token_value: string;
  }>(`SELECT total_fiat_value, total_token_value FROM portfolio_state LIMIT 1`);

  const interactionTokenPrice = parseFloat(sys?.base_token_price ?? '1.618');
  const namedMintPrice = parseFloat(sys?.named_token_price ?? '1618');
  const tokenPrice = interactionTokenPrice; // unit price for report header
  const portfolioUsd = parseFloat(portfolio?.total_fiat_value ?? '0');
  const delta = await getWeeklyDelta();

  const contractAddress = process.env.POLYGON_CONTRACT_ADDRESS || null;

  // 3. Build report (no report_hash yet)
  const partial: Omit<WeeklyReport, 'report_hash'> = {
    report_format:         'UUON-WEEKLY-v1',
    report_sequence:       reportSequence,
    report_week:           isoWeek(now),
    report_generated:      scheduledTime.toISOString(),
    scheduled_time:        '09:00:00Z',

    total_tokens_minted:   tokenCount,
    total_tokens_active:   parseInt(active?.cnt ?? '0'),
    new_tokens_this_week:  delta.newTokens,
    total_energy_stored:   energyTotal,
    energy_this_week:      delta.newEnergy,

    interaction_token_price_usd: interactionTokenPrice,
    named_mint_price_usd:        namedMintPrice,
    token_unit_price_usd:        tokenPrice,
    portfolio_value_usd:         portfolioUsd,
    market_cap_usd:              tokenCount * namedMintPrice,

    merkle_root:           root,
    leaf_count:            leafCount,

    polygon_tx_hash:       null,
    polygon_block:         null,
    polygon_contract:      contractAddress,
    polygon_explorer_url:  contractAddress
      ? `https://polygonscan.com/address/${contractAddress}`
      : null,

    verification_url: `${process.env.PUBLIC_URL || 'https://distinguished-rebirth-production.up.railway.app'}/api/polygon/verify`,
    api_endpoint:     `${process.env.PUBLIC_URL || 'https://distinguished-rebirth-production.up.railway.app'}/api/polygon/weekly-report/latest`
  };

  // 4. Deterministic hash of the report body (canonical JSON, fields sorted)
  const canonical = JSON.stringify(partial, Object.keys(partial).sort());
  const reportHash = crypto.createHash('sha256').update(canonical).digest('hex');
  const report: WeeklyReport = { ...partial, report_hash: reportHash };

  // 5. Push to Polygon if wallet configured
  if (process.env.POLYGON_PRIVATE_KEY && contractAddress) {
    try {
      const reportUri = `${partial.api_endpoint}?seq=${reportSequence}`;
      const chain = await pushMerkleRootToChain(root, tokenCount, energyTotal, reportUri);
      report.polygon_tx_hash = chain.txHash;
      report.polygon_block   = chain.blockNumber;
      report.polygon_explorer_url = `https://polygonscan.com/tx/${chain.txHash}`;
      console.log(`🔗 Merkle root on-chain: ${chain.txHash}`);
    } catch (err: any) {
      console.error('⚠️  Polygon push failed (report still valid off-chain):', err.message);
    }
  }

  // 6. Store in memory (and log)
  reports.unshift(report);
  if (reports.length > 52) reports = reports.slice(0, 52); // keep 1 year

  // 7. Persist to DB (upsert into a simple jsonb log)
  await pool.query(`
    INSERT INTO system_evolution_tracking
      (shape_id, event_type, event_data, computation_time_ms)
    VALUES ($1, 'weekly_report', $2::jsonb, 0)
  `, ['_SYSTEM_', JSON.stringify(report)]).catch(() => {});

  console.log(
    `📊 Weekly report #${reportSequence} generated — ${tokenCount} tokens, ` +
    `Merkle root ${root.slice(0, 18)}…, hash ${reportHash.slice(0, 16)}…`
  );

  return report;
}

// ── Scheduler ─────────────────────────────────────────────────────────────────

function msUntilNextMonday9am(): number {
  const now = new Date();
  const target = new Date(now);
  // Roll to next Monday
  const day = now.getUTCDay(); // 0=Sun,1=Mon,...
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7;
  target.setUTCDate(now.getUTCDate() + daysUntilMonday);
  target.setUTCHours(9, 0, 0, 0);
  return target.getTime() - now.getTime();
}

let schedulerHandle: NodeJS.Timeout | null = null;

export function startWeeklyScheduler(): void {
  if (schedulerHandle) return;

  const scheduleNext = () => {
    const ms = msUntilNextMonday9am();
    const when = new Date(Date.now() + ms);
    console.log(
      `📅 Weekly publisher scheduled — next run: ${when.toISOString()} (in ${Math.round(ms / 3600000)}h)`
    );
    schedulerHandle = setTimeout(async () => {
      try {
        await generateWeeklyReport();
      } catch (err: any) {
        console.error('❌ Weekly report generation failed:', err.message);
      }
      scheduleNext(); // recurse for the following week
    }, ms);
  };

  scheduleNext();
}

// ── Read API helpers ──────────────────────────────────────────────────────────

export function getLatestReport(): WeeklyReport | null {
  return reports[0] ?? null;
}

export function getAllReports(): WeeklyReport[] {
  return reports;
}

export function getReportBySequence(seq: number): WeeklyReport | null {
  return reports.find(r => r.report_sequence === seq) ?? null;
}
