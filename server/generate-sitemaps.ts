import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as fs from 'fs';
import { formula_implementations } from '@shared/schema';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);
const db = drizzle(sql);

async function generateSitemaps() {
  const baseUrl = 'https://uuon.world';
  
  const allShapes = await db.select().from(formula_implementations);
  
  console.log(`📊 Found ${allShapes.length} shapes in database`);
  
  const shapesByCategory: Record<string, any[]> = {};
  allShapes.forEach(shape => {
    const category = shape.category || 'uncategorized';
    if (!shapesByCategory[category]) {
      shapesByCategory[category] = [];
    }
    shapesByCategory[category].push(shape);
  });
  
  const mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allShapes.map(shape => `  <url>
    <loc>${baseUrl}/shape/${shape.shape_type}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  
  fs.writeFileSync('client/public/sitemap-369-shapes.xml', mainSitemap);
  console.log('✅ Generated sitemap-369-shapes.xml');
  
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-369-shapes.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
${Object.keys(shapesByCategory).map(category => `  <sitemap>
    <loc>${baseUrl}/sitemap-${category}.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
  
  fs.writeFileSync('client/public/sitemap-index.xml', sitemapIndex);
  console.log('✅ Generated sitemap-index.xml');
  
  for (const [category, shapes] of Object.entries(shapesByCategory)) {
    const categorySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shapes.map(shape => `  <url>
    <loc>${baseUrl}/shape/${shape.shape_type}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    
    fs.writeFileSync(`client/public/sitemap-${category}.xml`, categorySitemap);
    console.log(`✅ Generated sitemap-${category}.xml (${shapes.length} shapes)`);
  }
  
  console.log(`\n🎯 SITEMAP GENERATION COMPLETE!`);
  console.log(`📊 Total shapes: ${allShapes.length}`);
  console.log(`📂 Categories: ${Object.keys(shapesByCategory).length}`);
  console.log(`📄 Sitemaps generated: ${Object.keys(shapesByCategory).length + 2}`);
}

generateSitemaps().catch(console.error);
