import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);

const cols = await sql`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'shape_token_ledger' 
  ORDER BY ordinal_position
`;
console.log("shape_token_ledger columns ->", cols);

const sample = await sql`SELECT * FROM shape_token_ledger LIMIT 3`;
console.log("sample rows ->", JSON.stringify(sample, null, 2));

const sampleTokenIds = await sql`SELECT DISTINCT token_id FROM shape_token_ledger LIMIT 5`;
console.log("sample token_ids ->", sampleTokenIds);
