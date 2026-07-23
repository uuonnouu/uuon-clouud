import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
const cols = await sql`
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'formula_implementations' 
  ORDER BY ordinal_position
`;
console.log(JSON.stringify(cols, null, 2));
