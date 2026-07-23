import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

try {
  const ps = await sql`SELECT * FROM portfolio_state`;
  console.log("portfolio_state ->", JSON.stringify(ps, null, 2));
} catch (e) { console.log("portfolio_state error:", e.message); }

try {
  const tml = await sql`SELECT * FROM token_minting_log`;
  console.log("token_minting_log ->", JSON.stringify(tml, null, 2));
} catch (e) { console.log("token_minting_log error:", e.message); }

try {
  const utm = await sql`SELECT * FROM uuon_token_metadata`;
  console.log("uuon_token_metadata ->", JSON.stringify(utm, null, 2));
} catch (e) { console.log("uuon_token_metadata error:", e.message); }
