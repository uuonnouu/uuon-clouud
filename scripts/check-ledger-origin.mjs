import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const statusBreakdown = await sql`SELECT on_chain_status, status, COUNT(*) c FROM shape_token_ledger GROUP BY on_chain_status, status ORDER BY c DESC`;
console.log("status breakdown ->", statusBreakdown);

const nonNullContract = await sql`SELECT COUNT(*) FROM shape_token_ledger WHERE on_chain_contract IS NOT NULL`;
console.log("rows with a real on_chain_contract ->", nonNullContract[0].count);

const nonNullOwner = await sql`SELECT COUNT(*) FROM shape_token_ledger WHERE owner_wallet_address IS NOT NULL`;
console.log("rows with an owner wallet ->", nonNullOwner[0].count);

const timeClusters = await sql`
  SELECT date_trunc('hour', created_at) AS hr, COUNT(*) 
  FROM shape_token_ledger 
  GROUP BY hr ORDER BY hr
`;
console.log("rows per hour ->", timeClusters);

const shapeTypeBreakdown = await sql`SELECT shape_type, COUNT(*) c FROM shape_token_ledger GROUP BY shape_type ORDER BY c DESC LIMIT 10`;
console.log("top shape_types in ledger ->", shapeTypeBreakdown);
