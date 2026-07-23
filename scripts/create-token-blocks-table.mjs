import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS token_blocks (
    block_number BIGINT PRIMARY KEY,
    block_hash TEXT NOT NULL,
    previous_block_hash TEXT,
    transaction_count INTEGER NOT NULL DEFAULT 1,
    block_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;
console.log("✅ token_blocks table created (or already existed)");

const check = await sql`SELECT COUNT(*) FROM token_blocks`;
console.log("token_blocks row count:", check[0].count);