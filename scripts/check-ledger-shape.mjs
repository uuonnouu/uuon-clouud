import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const distinctTokens = await sql`SELECT COUNT(DISTINCT token_id) FROM shape_token_ledger`;
console.log("distinct token_id in ledger ->", distinctTokens[0].count);

const byType = await sql`SELECT transaction_type, COUNT(*) FROM shape_token_ledger GROUP BY transaction_type ORDER BY 2 DESC`;
console.log("ledger rows by transaction_type ->", byType);

const dateRange = await sql`SELECT MIN(created_at), MAX(created_at), COUNT(*) FROM shape_token_ledger`;
console.log("ledger date range ->", dateRange[0]);

const dupeCheck = await sql`SELECT token_id, COUNT(*) c FROM shape_token_ledger GROUP BY token_id ORDER BY c DESC LIMIT 5`;
console.log("top 5 token_ids by row count ->", dupeCheck);
