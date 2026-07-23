/**
 * UUON Foundation — Merkle State Root Computation
 * Computes a deterministic Merkle root over the complete_shape_registry.
 * This root anchors the entire shape database to the chain.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx scripts/compute-merkle-root.ts
 *
 * Output:
 *   - Merkle root hash (SHA-256)
 *   - Total shapes committed
 *   - Timestamp
 *   - Ready to anchor on Base via tokenLedgerService
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { createHash } from "crypto";
import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("FATAL: DATABASE_URL is not set.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// ── Merkle Tree ───────────────────────────────────────────────────────────────

function sha256(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function buildMerkleTree(leaves: string[]): string {
  if (leaves.length === 0) throw new Error("Cannot build Merkle tree from empty leaves.");
  if (leaves.length === 1) return leaves[0];

  const next: string[] = [];
  for (let i = 0; i < leaves.length; i += 2) {
    const left = leaves[i];
    const right = i + 1 < leaves.length ? leaves[i + 1] : leaves[i]; // duplicate last if odd
    next.push(sha256(left + right));
  }
  return buildMerkleTree(next);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n=== UUON Merkle State Root — Phase III Equation Anchor ===\n");

  // Fetch from formula_implementations — equation DNA, not display names
  console.log("► Fetching formula_implementations (equation DNA)...");
  const shapes = await sql`
    SELECT
      shape_type,
      display_name,
      category,
      equation_x,
      equation_y,
      equation_z,
      default_parameters,
      verified,
      source_file
    FROM formula_implementations
    WHERE equation_x IS NOT NULL
    ORDER BY shape_type ASC
  `;
  console.log(`  Total shapes with equations: ${shapes.length}\n`);

  // Build leaf hashes — equation DNA is the content, not display names
  console.log("► Computing leaf hashes (equation DNA)...");
  const leaves = (shapes as any[]).map((row) => {
    const canonical = JSON.stringify({
      shape_type: row.shape_type,
      equation_x: row.equation_x,
      equation_y: row.equation_y,
      equation_z: row.equation_z,
      default_parameters: row.default_parameters ?? null,
      verified: row.verified,
    });
    return sha256(canonical);
  });
  console.log(`  Leaf hashes computed: ${leaves.length}\n`);

  // Build Merkle tree
  console.log("► Building Merkle tree...");
  const merkleRoot = buildMerkleTree(leaves);
  const timestamp = new Date().toISOString();
  const stateHash = sha256(`${merkleRoot}:${timestamp}:${shapes.length}`);

  console.log("═══════════════════════════════════════════════════════");
  console.log("  MERKLE STATE ROOT — UUON FOUNDATION");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Shapes committed:  ${shapes.length}`);
  console.log(`  Merkle root:       ${merkleRoot}`);
  console.log(`  State hash:        ${stateHash}`);
  console.log(`  Timestamp:         ${timestamp}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("\n  ✓ Root computed. Ready to anchor on-chain.");
  console.log("  ✓ Publish this root to Base contract or IPFS MANIFEST.\n");

  // Write to a local manifest file for anchoring
  const manifest = {
    version: "2.0",
    network: "UUON Foundation — Phase II",
    shapes_committed: shapes.length,
    merkle_root: merkleRoot,
    state_hash: stateHash,
    timestamp,
    anchor_target: "Base mainnet + IPFS",
    genesis_hash: "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
    copyright: "© UUON Foundation Inc. — Phillip Aguilar Ruiz III",
  };

  const fs = await import("fs");
  fs.writeFileSync(
    "MERKLE_STATE_ROOT.json",
    JSON.stringify(manifest, null, 2),
    "utf8"
  );

  console.log("  ✓ Written to MERKLE_STATE_ROOT.json\n");
  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});