import { neon } from "@neondatabase/serverless";
import fs from "fs";
const sql = neon(process.env.DATABASE_URL);

const ledger = await sql`SELECT * FROM shape_token_ledger WHERE on_chain_contract IS NULL AND owner_wallet_address IS NULL`;
fs.writeFileSync("/tmp/backup-shape_token_ledger.json", JSON.stringify(ledger));
console.log("backed up shape_token_ledger rows:", ledger.length);

const energy = await sql`SELECT * FROM shape_token_energy`;
fs.writeFileSync("/tmp/backup-shape_token_energy.json", JSON.stringify(energy));
console.log("backed up shape_token_energy rows:", energy.length);

const meta = await sql`SELECT * FROM shape_token_metadata`;
fs.writeFileSync("/tmp/backup-shape_token_metadata.json", JSON.stringify(meta));
console.log("backed up shape_token_metadata rows:", meta.length);
