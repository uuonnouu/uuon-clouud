import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const del = await sql`DELETE FROM shape_token_ledger WHERE on_chain_contract IS NULL AND owner_wallet_address IS NULL RETURNING token_id`;
console.log("deleted from shape_token_ledger:", del.length);
const delE = await sql`DELETE FROM shape_token_energy WHERE token_id NOT IN (SELECT token_id FROM shape_token_ledger)`;
console.log("deleted from shape_token_energy:", delE.length);
const delM = await sql`DELETE FROM shape_token_metadata WHERE token_id NOT IN (SELECT token_id FROM shape_token_ledger)`;
console.log("deleted from shape_token_metadata:", delM.length);
