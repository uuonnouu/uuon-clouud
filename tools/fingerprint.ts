/**
 * UUON Dmension — Master Fingerprint
 * Computes a single SHA-256 hash covering all tokens in shape_token_ledger.
 *
 * How to recompute:
 *   1. source ~/workspace/.pgurl
 *   2. npx tsx tools/fingerprint.ts
 *
 * The output hash is stable as long as no rows are added, deleted, or modified.
 * Any change to any token produces a completely different hash.
 */

import { createHash } from "crypto";
import { Client } from "pg";

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const { rows } = await client.query(`
    SELECT
      token_id,
      shape_type,
      token_name,
      token_symbol,
      token_uri,
      owner_wallet_address,
      status,
      current_state_hash,
      on_chain_status,
      created_at
    FROM shape_token_ledger
    ORDER BY token_id ASC
  `);

  await client.end();

  if (rows.length === 0) {
    console.error("ERROR: no rows returned — check DATABASE_URL and table name");
    process.exit(1);
  }

  const leafHashes: string[] = rows.map((row) => {
    const leaf = [
      row.token_id,
      row.shape_type,
      row.token_name,
      row.token_symbol ?? "",
      row.token_uri ?? "",
      row.owner_wallet_address ?? "",
      row.status ?? "",
      row.current_state_hash ?? "",
      row.on_chain_status ?? "",
      row.created_at?.toISOString() ?? "",
    ].join("|");
    return createHash("sha256").update(leaf).digest("hex");
  });

  const master = createHash("sha256")
    .update(leafHashes.join("\n"))
    .digest("hex");

  console.log(`Token count : ${rows.length}`);
  console.log(`Master hash : ${master}`);
  console.log(`Computed at : ${new Date().toISOString()}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
