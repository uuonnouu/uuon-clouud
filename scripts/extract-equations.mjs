import { neon } from '@neondatabase/serverless';
import { readFileSync, readdirSync } from 'fs';

const sql = neon(process.env.DATABASE_URL);
const libDir = './client/src/lib';
const files = readdirSync(libDir).filter(f => f.endsWith('.ts'));
const skipKeys = new Set(['name','equation','defaults','params','x','y','z','a','b','c','u','v','const','let','var','if','return','type','import','export','default','true','false','null','undefined','this','new','class','function','async','await','for','while','do','switch','case','break','continue','try','catch','throw','from','of','in']);
const shapeMap = new Map();

for (const file of files) {
  try {
    const content = readFileSync(libDir + '/' + file, 'utf8');
    const regex = /(?:^|\n)\s{0,6}(?:['"`])?([a-z][a-z0-9_-]{2,})(?:['"`])?\s*:\s*\{/g;
    let m;
    while ((m = regex.exec(content)) !== null) {
      const key = m[1];
      if (skipKeys.has(key)) continue;
      const block = content.slice(m.index, m.index + 2000);
      if (!block.includes('equation') && !block.includes('return [')) continue;
      const ret = block.match(/return\s*\[\s*([^,\]]+),\s*([^,\]]+),\s*([^\]]+)\]/);
      if (!ret) continue;
      const nameMatch = block.match(/name\s*:\s*['"`]([^'"`]{2,80})['"`]/);
      const catMatch = file.match(/([a-z]+(?:Shapes|Engine|Algorithms|Surfaces|Functions|Mathematics|Theory|Systems|Equations|Structures|Objects|Curves|Manifolds|Patterns))/i);
      const snakeKey = key.replace(/-/g, '_');
      const data = {
        shape_type: snakeKey,
        display_name: nameMatch ? nameMatch[1].replace(/^[\W]+/, '').trim().slice(0, 200) : key.replace(/_/g, ' '),
        equation_x: ret[1].trim().slice(0, 500),
        equation_y: ret[2].trim().slice(0, 500),
        equation_z: ret[3].trim().slice(0, 500),
        source_file: file,
        category: catMatch ? catMatch[1].toLowerCase().replace(/(shapes|engine|algorithms|surfaces|functions|mathematics|theory|systems|equations|structures|objects|curves|manifolds|patterns)/,'').trim() || 'general' : 'general'
      };
      shapeMap.set(snakeKey, data);
    }
  } catch(e) {}
}

console.log('Shapes found in source:', shapeMap.size);
const all = [...shapeMap.values()];
let inserted = 0, skipped = 0;

for (let i = 0; i < all.length; i += 50) {
  const batch = all.slice(i, i + 50);
  for (const s of batch) {
    try {
      await sql`
        INSERT INTO formula_implementations
          (shape_type, display_name, equation_x, equation_y, equation_z, source_file, category, verified, updated_at)
        VALUES
          (${s.shape_type}, ${s.display_name}, ${s.equation_x}, ${s.equation_y}, ${s.equation_z}, ${s.source_file}, ${s.category}, TRUE, NOW())
        ON CONFLICT (shape_type) DO UPDATE SET
          equation_x   = EXCLUDED.equation_x,
          equation_y   = EXCLUDED.equation_y,
          equation_z   = EXCLUDED.equation_z,
          display_name = COALESCE(formula_implementations.display_name, EXCLUDED.display_name),
          source_file  = EXCLUDED.source_file,
          verified     = TRUE,
          updated_at   = NOW()
      `;
      inserted++;
    } catch(e) { skipped++; }
  }
  if (i % 500 === 0) process.stdout.write(`\r  Progress: ${i}/${all.length}`);
}

const final = await sql`
  SELECT COUNT(*) as total, COUNT(equation_x) as has_eq,
    COUNT(*) FILTER (WHERE verified = TRUE) as verified
  FROM formula_implementations
`;
console.log('\n✓ Inserted/updated:', inserted, '| Skipped:', skipped);
console.log('✓ Total shapes:', final[0].total);
console.log('✓ With equations:', final[0].has_eq);
console.log('✓ Verified:', final[0].verified);
