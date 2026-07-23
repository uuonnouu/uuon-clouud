import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL);
try {
  const c = await sql`SELECT COUNT(*) FROM shape_tokens`;
  console.log("shape_tokens ->", c[0].count);
  const sample = await sql`SELECT * FROM shape_tokens LIMIT 3`;
  console.log(JSON.stringify(sample, null, 2));
} catch (e) { console.log("shape_tokens MISSING or error:", e.message); }
