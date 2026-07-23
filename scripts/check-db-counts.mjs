import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const fi = await sql`SELECT COUNT(*) FROM formula_implementations`;
console.log("formula_implementations ->", fi[0].count);

const fiEq = await sql`SELECT COUNT(*) FROM formula_implementations WHERE equation_x IS NOT NULL`;
console.log("formula_implementations (with equations) ->", fiEq[0].count);

const csr = await sql`SELECT COUNT(*) FROM complete_shape_registry`;
console.log("complete_shape_registry ->", csr[0].count);

const stl = await sql`SELECT COUNT(*) FROM shape_token_ledger`;
console.log("shape_token_ledger ->", stl[0].count);

const ste = await sql`SELECT COUNT(*) FROM shape_token_energy`;
console.log("shape_token_energy ->", ste[0].count);

const stm = await sql`SELECT COUNT(*) FROM shape_token_metadata`;
console.log("shape_token_metadata ->", stm[0].count);

const stt = await sql`SELECT COUNT(*) FROM shape_token_transactions`;
console.log("shape_token_transactions ->", stt[0].count);
