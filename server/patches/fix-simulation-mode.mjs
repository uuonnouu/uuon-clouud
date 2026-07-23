/**
 * UUON Foundation — patches/fix-simulation-mode.mjs
 *
 * Patches two CRITICAL vulnerabilities from ARCHITECTURE_REVIEW.md:
 *
 *   [C-4] Silent simulation mode — tokenLedgerService.ts returns in-memory
 *         tokens when DATABASE_URL is absent, indistinguishable from real
 *         tokens. Callers (including the mint endpoint) cannot tell the
 *         difference. A user could believe tokens were minted on-chain
 *         when they were not.
 *
 *   [C-6] No input validation on POST /api/token-ledger/mint — shapeType
 *         and tokenName passed raw to mintToken() and into PostgreSQL.
 *         No length limits, no character validation, no allowlist check.
 *
 * This script:
 *   1. Validates DATABASE_URL at startup — hard-fails if absent
 *   2. Exports a startup guard to add to server/index.ts
 *   3. Exports a validation middleware for the mint endpoint
 *   4. Exports a hard-fail DB connector (no silent fallback)
 *   5. Runs a self-test to confirm behavior
 *
 * Drop-in imports for your Express server:
 *
 *   import { assertDatabaseReady, validateMintInput }
 *     from './patches/fix-simulation-mode.mjs';
 *
 *   // In server startup (before any route registration):
 *   assertDatabaseReady();
 *
 *   // On the mint route:
 *   router.post('/mint', validateMintInput, async (req, res) => { ... });
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { neon } from '@neondatabase/serverless';
import { createHash } from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// PATCH C-4: Hard-fail startup guard
// Replaces the silent fallback in tokenLedgerService.ts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * assertDatabaseReady()
 *
 * Call this at the top of server/index.ts BEFORE registering any routes.
 * If DATABASE_URL is absent, the process exits immediately with a clear
 * error — no simulation mode, no silent fallback, no fake tokens.
 *
 * This replaces the previous behavior where missing DATABASE_URL caused
 * tokenLedgerService to return in-memory tokens indistinguishable from
 * real on-chain tokens.
 */
export function assertDatabaseReady() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error('\n' + '═'.repeat(68));
    console.error('  FATAL — DATABASE_URL not set');
    console.error('═'.repeat(68));
    console.error('');
    console.error('  The server cannot start without a database connection.');
    console.error('  Previously, missing DATABASE_URL caused the token ledger');
    console.error('  to return in-memory (simulated) tokens that appeared');
    console.error('  identical to real on-chain tokens. This is a critical');
    console.error('  security vulnerability [C-4] that has been patched.');
    console.error('');
    console.error('  To fix:');
    console.error('    1. Set DATABASE_URL in your Railway environment variables');
    console.error('    2. Or create a .env file: DATABASE_URL=postgres://...');
    console.error('    3. Neon DB: ep-curly-unit-atlt2cb4');
    console.error('');
    console.error('═'.repeat(68) + '\n');
    process.exit(1);
  }

  // Also validate UUON_TOKEN_SECRET — patches C-1 (hardcoded fallback HMAC key)
  const secret = process.env.UUON_TOKEN_SECRET;
  if (!secret || secret === 'dev-only-uuon-2025-not-for-production') {
    console.error('\n' + '═'.repeat(68));
    console.error('  FATAL — UUON_TOKEN_SECRET not set or uses default value');
    console.error('═'.repeat(68));
    console.error('');
    console.error('  The HMAC signing key for token energy signatures is either');
    console.error('  missing or set to the publicly known development default.');
    console.error('  Every token minted with this key is cryptographically');
    console.error('  compromised. [C-1]');
    console.error('');
    console.error('  To fix:');
    console.error('    Generate a strong secret:');
    console.error('    node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    console.error('    Set UUON_TOKEN_SECRET=<64-byte-hex> in Railway environment');
    console.error('');
    console.error('═'.repeat(68) + '\n');
    process.exit(1);
  }

  console.log('[startup] ✅ DATABASE_URL confirmed (C-4 patch active)');
  console.log('[startup] ✅ UUON_TOKEN_SECRET confirmed (C-1 patch active)');
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH C-4b: Safe DB connector (no silent fallback)
// Drop this in wherever you currently call neon(DATABASE_URL)
// ─────────────────────────────────────────────────────────────────────────────

let _sql = null;

/**
 * getSafeSQL()
 *
 * Returns a Neon tagged-template client.
 * Hard-fails if DATABASE_URL is not set — no simulation mode.
 *
 * Usage: const sql = getSafeSQL();
 *        const rows = await sql`SELECT...`;
 */
export function getSafeSQL() {
  if (_sql) return _sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      '[C-4 patch] DATABASE_URL not set. ' +
      'getSafeSQL() refuses to return a simulated client. ' +
      'Set DATABASE_URL and restart the server.'
    );
  }

  _sql = neon(url);
  return _sql;
}

// ─────────────────────────────────────────────────────────────────────────────
// PATCH C-6: Input validation middleware for /api/token-ledger/mint
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Shape type allowlist from formula_implementations.
 * Loaded once at first request, cached in memory.
 * Refreshed every 5 minutes in case new shapes are added.
 */
let _allowlist = null;
let _allowlistLoadedAt = 0;
const ALLOWLIST_TTL_MS = 5 * 60 * 1000;

async function getShapeAllowlist() {
  const now = Date.now();
  if (_allowlist && now - _allowlistLoadedAt < ALLOWLIST_TTL_MS) {
    return _allowlist;
  }

  try {
    const sql = getSafeSQL();
    const rows = await sql`SELECT shape_type FROM formula_implementations WHERE shape_type IS NOT NULL`;
    _allowlist = new Set(rows.map(r => r.shape_type));
    _allowlistLoadedAt = now;
    return _allowlist;
  } catch (err) {
    console.error('[validateMintInput] Could not load shape allowlist:', err.message);
    return null; // Non-fatal: fall through to other validations
  }
}

// Validation rules
const SHAPE_TYPE_REGEX  = /^[a-z0-9_\-]{1,120}$/;
const TOKEN_NAME_REGEX  = /^[\w\s\-\.]{1,200}$/;
const WALLET_REGEX      = /^0x[0-9a-fA-F]{40}$/;
const MAX_QUANTITY      = 100;

/**
 * validateMintInput(req, res, next)
 *
 * Express middleware — validates all inputs on POST /api/token-ledger/mint.
 * Replaces the direct pass-through of raw request body fields to mintToken().
 *
 * Validates:
 *   - shapeType: format + allowlist check against formula_implementations
 *   - tokenName: format + length
 *   - quantity:  number, 1–100
 *   - recipient: optional wallet address format
 *
 * Attaches req.validatedMint with sanitized values if valid.
 */
export async function validateMintInput(req, res, next) {
  const body = req.body ?? {};
  const errors = [];

  // ── shapeType ─────────────────────────────────────────────────────────────
  const rawShapeType = body.shapeType ?? body.shape_type ?? '';
  if (!rawShapeType) {
    errors.push({ field: 'shapeType', message: 'Required.' });
  } else if (!SHAPE_TYPE_REGEX.test(rawShapeType)) {
    errors.push({
      field: 'shapeType',
      message: 'Must be 1–120 lowercase alphanumeric characters, underscores, or hyphens.',
      received: rawShapeType.slice(0, 40),
    });
  } else {
    // Allowlist check
    const allowlist = await getShapeAllowlist();
    if (allowlist && !allowlist.has(rawShapeType)) {
      errors.push({
        field: 'shapeType',
        message: `"${rawShapeType}" is not a recognized shape type in formula_implementations.`,
        hint: 'Use GET /api/essential-shapes to list valid shape types.',
      });
    }
  }

  // ── tokenName ─────────────────────────────────────────────────────────────
  const rawTokenName = body.tokenName ?? body.token_name ?? '';
  if (rawTokenName && !TOKEN_NAME_REGEX.test(rawTokenName)) {
    errors.push({
      field: 'tokenName',
      message: 'Must be 1–200 characters: letters, numbers, spaces, hyphens, underscores, periods.',
      received: rawTokenName.slice(0, 40),
    });
  }

  // ── quantity ──────────────────────────────────────────────────────────────
  const rawQty = body.quantity ?? body.amount ?? 1;
  const quantity = parseInt(rawQty, 10);
  if (isNaN(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
    errors.push({
      field: 'quantity',
      message: `Must be a whole number between 1 and ${MAX_QUANTITY}.`,
      received: rawQty,
    });
  }

  // ── recipient (optional) ──────────────────────────────────────────────────
  const rawRecipient = body.recipient ?? body.wallet_address ?? '';
  if (rawRecipient && !WALLET_REGEX.test(rawRecipient)) {
    errors.push({
      field: 'recipient',
      message: 'Must be a valid Ethereum address (0x + 40 hex characters).',
      received: rawRecipient.slice(0, 10) + '...',
    });
  }

  // ── Return errors ─────────────────────────────────────────────────────────
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'validation_failed',
      message: `${errors.length} validation error(s) on mint request.`,
      errors,
      docs: '/api',
    });
  }

  // ── Attach sanitized values ───────────────────────────────────────────────
  req.validatedMint = {
    shapeType:  rawShapeType.toLowerCase().trim(),
    tokenName:  (rawTokenName || rawShapeType).trim(),
    quantity:   quantity,
    recipient:  rawRecipient || null,
  };

  next();
}

// ─────────────────────────────────────────────────────────────────────────────
// BONUS: Simulation mode detector
// Use this to audit whether any existing tokens were minted in sim mode
// ─────────────────────────────────────────────────────────────────────────────

/**
 * detectSimulatedTokens(sql)
 *
 * Queries shape_token_ledger for tokens that were likely minted in
 * simulation mode (no tx_hash, no block_number, on_chain_status = 'pending'
 * for more than 24 hours).
 *
 * Returns an array of suspicious token records for manual review.
 */
export async function detectSimulatedTokens() {
  const sql = getSafeSQL();
  const rows = await sql`
    SELECT
      token_id,
      shape_type,
      on_chain_status,
      created_at,
      tx_hash,
      block_number,
      EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 AS hours_old
    FROM shape_token_ledger
    WHERE (tx_hash IS NULL OR tx_hash = '')
      AND (block_number IS NULL OR block_number = 0)
      AND on_chain_status IN ('pending', 'simulated', 'unknown')
      AND created_at < NOW() - INTERVAL '24 hours'
    ORDER BY created_at DESC
    LIMIT 200
  `;

  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// SELF-TEST
// ─────────────────────────────────────────────────────────────────────────────

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('\n=== fix-simulation-mode.mjs self-test ===\n');

  // Test 1: assertDatabaseReady with no DB URL
  console.log('Test 1: assertDatabaseReady() without DATABASE_URL');
  const savedUrl = process.env.DATABASE_URL;
  delete process.env.DATABASE_URL;
  delete process.env.UUON_TOKEN_SECRET;

  // Temporarily override process.exit for testing
  let exitCode = null;
  const origExit = process.exit;
  process.exit = (code) => { exitCode = code; throw new Error(`EXIT:${code}`); };

  try {
    assertDatabaseReady();
    console.log('  ❌ FAIL: Should have exited');
  } catch (err) {
    if (err.message.startsWith('EXIT:')) {
      console.log(`  ✅ PASS: Hard-failed with exit code ${exitCode} (no silent fallback)`);
    } else {
      console.log('  ❌ FAIL: Unexpected error:', err.message);
    }
  }

  process.exit = origExit;
  process.env.DATABASE_URL = savedUrl;

  // Test 2: validateMintInput — invalid shapeType
  console.log('\nTest 2: validateMintInput() with malicious shapeType');
  const mockReq = {
    body: {
      shapeType: "'; DROP TABLE formula_implementations; --",
      tokenName: 'test',
      quantity: 1,
    }
  };
  const mockRes = {
    status(code) { this._code = code; return this; },
    json(body) {
      if (this._code === 400 && body.error === 'validation_failed') {
        console.log('  ✅ PASS: SQL injection blocked, 400 returned');
        console.log('  Errors:', JSON.stringify(body.errors, null, 2).split('\n').map(l => '    ' + l).join('\n'));
      } else {
        console.log('  ❌ FAIL: Expected 400 validation_failed, got:', this._code, body.error);
      }
    },
  };

  await validateMintInput(mockReq, mockRes, () => {
    console.log('  ❌ FAIL: next() was called — validation should have blocked this');
  });

  // Test 3: validateMintInput — valid input
  console.log('\nTest 3: validateMintInput() with valid input');
  const validReq = {
    body: {
      shapeType: 'sha256_compression_function',
      tokenName: 'My SHA-256 Shape',
      quantity: 1,
    }
  };
  let nextCalled = false;
  const passRes = {
    status(code) { this._code = code; return this; },
    json(body) { console.log('  ❌ FAIL: Unexpected rejection:', body); },
  };

  await validateMintInput(validReq, passRes, () => {
    nextCalled = true;
    console.log('  ✅ PASS: Valid input passed validation');
    console.log('  validatedMint:', JSON.stringify(validReq.validatedMint));
  });

  console.log('\n=== All tests complete ===\n');
  console.log('Add to server/index.ts:');
  console.log('  import { assertDatabaseReady, validateMintInput } from "./patches/fix-simulation-mode.mjs";');
  console.log('  assertDatabaseReady(); // Call before registerRoutes()');
  console.log('  // On mint route: router.post("/mint", validateMintInput, handler)');
  console.log('');
}