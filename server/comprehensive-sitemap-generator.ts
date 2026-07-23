import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const connectionString = process.env.DATABASE_URL!;
const sql = neon(connectionString);

const BASE_URL = 'https://uuon.world';
const OUTPUT_DIR = 'client/public';
const DIST_OUTPUT_DIR = 'dist/public';

interface ShapeRecord {
  shape_type: string;
  display_name: string;
  category: string;
  subcategory: string;
  priority: number;
  canonical_url: string;
  seo_keywords: string;
}

async function getAllShapesFromRegistry(): Promise<ShapeRecord[]> {
  const result = await sql`
    SELECT shape_type, display_name, category, subcategory, priority, canonical_url, seo_keywords
    FROM complete_shape_registry
    WHERE is_active = true
    ORDER BY category, shape_type
  `;
  return result as ShapeRecord[];
}

async function getAllShapesFromFormulas(): Promise<ShapeRecord[]> {
  const result = await sql`
    SELECT shape_type, formula_name, category, subcategory, 0.8 as priority
    FROM formula_implementations
    ORDER BY category, shape_type
  `;
  return result.map(r => ({
    shape_type: r.shape_type,
    display_name: r.formula_name || r.shape_type,
    category: r.category || 'uncategorized',
    subcategory: r.subcategory || r.category,
    priority: 0.8,
    canonical_url: `/shape/${r.shape_type}`,
    seo_keywords: r.formula_name || r.shape_type
  })) as ShapeRecord[];
}

function generateSitemapXML(shapes: ShapeRecord[], category?: string): string {
  const filteredShapes = category 
    ? shapes.filter(s => s.category === category)
    : shapes;
  
  const today = new Date().toISOString().split('T')[0];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${filteredShapes.map(shape => `  <url>
    <loc>${BASE_URL}/shape/${shape.shape_type}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${shape.priority || 0.8}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function generateSitemapIndex(categories: string[], additionalSitemaps: string[] = []): string {
  const today = new Date().toISOString().split('T')[0];
  
  const categorySitemaps = categories.map(cat => `  <sitemap>
    <loc>${BASE_URL}/sitemap-${cat}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`);
  
  const additionalSitemapEntries = additionalSitemaps.map(name => `  <sitemap>
    <loc>${BASE_URL}/${name}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`);
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/sitemap-all-shapes.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
${categorySitemaps.join('\n')}
${additionalSitemapEntries.join('\n')}
</sitemapindex>`;
}

function generateMainSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/explore', priority: 0.9, changefreq: 'daily' },
    { loc: '/categories', priority: 0.9, changefreq: 'weekly' },
    { loc: '/formulas', priority: 0.8, changefreq: 'weekly' },
    { loc: '/export', priority: 0.8, changefreq: 'weekly' },
    { loc: '/about', priority: 0.7, changefreq: 'monthly' },
    { loc: '/documentation', priority: 0.7, changefreq: 'weekly' },
    { loc: '/api-docs', priority: 0.6, changefreq: 'weekly' },
    { loc: '/tutorials', priority: 0.8, changefreq: 'weekly' },
    { loc: '/gallery', priority: 0.8, changefreq: 'daily' },
    { loc: '/community', priority: 0.7, changefreq: 'daily' },
    { loc: '/research', priority: 0.8, changefreq: 'weekly' },
    { loc: '/enterprise', priority: 0.7, changefreq: 'monthly' }
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
}

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateComprehensiveSitemaps() {
  console.log('🗺️ Starting comprehensive sitemap generation...\n');
  
  const registryShapes = await getAllShapesFromRegistry();
  const formulaShapes = await getAllShapesFromFormulas();
  
  const shapeMap = new Map<string, ShapeRecord>();
  
  formulaShapes.forEach(shape => {
    shapeMap.set(shape.shape_type, shape);
  });
  
  registryShapes.forEach(shape => {
    shapeMap.set(shape.shape_type, shape);
  });
  
  const allShapes = Array.from(shapeMap.values());
  console.log(`📊 Total unique shapes: ${allShapes.length}`);
  
  const categories = [...new Set(allShapes.map(s => s.category))].sort();
  console.log(`📁 Categories: ${categories.length}`);
  
  ensureDirectoryExists(OUTPUT_DIR);
  ensureDirectoryExists(DIST_OUTPUT_DIR);
  
  const mainSitemap = generateMainSitemap();
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap.xml'), mainSitemap);
  fs.writeFileSync(path.join(DIST_OUTPUT_DIR, 'sitemap.xml'), mainSitemap);
  console.log('✅ Generated sitemap.xml (main pages)');
  
  const allShapesSitemap = generateSitemapXML(allShapes);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-all-shapes.xml'), allShapesSitemap);
  fs.writeFileSync(path.join(DIST_OUTPUT_DIR, 'sitemap-all-shapes.xml'), allShapesSitemap);
  console.log(`✅ Generated sitemap-all-shapes.xml (${allShapes.length} shapes)`);
  
  const categoryStats: Record<string, number> = {};
  for (const category of categories) {
    const categorySitemap = generateSitemapXML(allShapes, category);
    const categoryShapeCount = allShapes.filter(s => s.category === category).length;
    categoryStats[category] = categoryShapeCount;
    
    fs.writeFileSync(path.join(OUTPUT_DIR, `sitemap-${category}.xml`), categorySitemap);
    fs.writeFileSync(path.join(DIST_OUTPUT_DIR, `sitemap-${category}.xml`), categorySitemap);
  }
  console.log(`✅ Generated ${categories.length} category sitemaps`);
  
  const additionalSitemaps = [
    'sitemap-enterprise.xml',
    'sitemap-tutorials.xml',
    'sitemap-research.xml',
    'sitemap-api.xml'
  ];
  
  const sitemapIndex = generateSitemapIndex(categories, additionalSitemaps);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'sitemap-index.xml'), sitemapIndex);
  fs.writeFileSync(path.join(DIST_OUTPUT_DIR, 'sitemap-index.xml'), sitemapIndex);
  console.log('✅ Generated sitemap-index.xml');
  
  console.log('\n📊 SITEMAP GENERATION SUMMARY');
  console.log('═══════════════════════════════════════════');
  console.log(`Total Shapes Indexed: ${allShapes.length}`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Sitemaps Generated: ${categories.length + 4}`);
  console.log('\n📁 Category Breakdown:');
  Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count} shapes`);
    });
  
  console.log('\n✅ Sitemap generation complete!');
  console.log(`📍 Output: ${OUTPUT_DIR} and ${DIST_OUTPUT_DIR}`);
  
  return {
    totalShapes: allShapes.length,
    categories: categories.length,
    sitemapsGenerated: categories.length + 4
  };
}

generateComprehensiveSitemaps().catch(console.error);
