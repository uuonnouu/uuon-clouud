
import { Router } from 'express';
import { dbLoader } from '../database-loader';
import { SITEMAP_SEO_METADATA, generateEnhancedSitemapXML, generateMasterSitemapIndex } from '../sitemapSEOMetadata';

const router = Router();

// Generate comprehensive sitemap for all shapes
router.get('/generate-shape-sitemaps', async (req, res) => {
  try {
    const allShapes = await dbLoader.getAllFormulas();
    const baseUrl = req.hostname ? `https://${req.hostname}` : (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0].trim()}` : 'https://uuon.world');
    
    // Group shapes by category for organized sitemaps
    const shapesByCategory: Record<string, any[]> = {};
    
    allShapes.forEach(shape => {
      const category = shape.category || 'uncategorized';
      if (!shapesByCategory[category]) {
        shapesByCategory[category] = [];
      }
      shapesByCategory[category].push(shape);
    });

    // Generate main shapes sitemap
    const mainShapesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allShapes.map(shape => `  <url>
    <loc>${baseUrl}/shapes/${shape.shape_type}</loc>
    <lastmod>${shape.updated_at || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    // Generate category-specific sitemaps
    const categorySitemaps: Record<string, string> = {};
    
    Object.entries(shapesByCategory).forEach(([category, shapes]) => {
      categorySitemaps[category] = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${shapes.map(shape => `  <url>
    <loc>${baseUrl}/shapes/${shape.shape_type}</loc>
    <lastmod>${shape.updated_at || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
    });

    // Update sitemap index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-all-shapes.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
${Object.keys(categorySitemaps).map(category => `  <sitemap>
    <loc>${baseUrl}/sitemap-${category}-shapes.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

    res.json({
      success: true,
      message: `Generated sitemaps for ${allShapes.length} shapes across ${Object.keys(shapesByCategory).length} categories`,
      stats: {
        totalShapes: allShapes.length,
        categories: Object.keys(shapesByCategory).length,
        shapesByCategory: Object.fromEntries(
          Object.entries(shapesByCategory).map(([cat, shapes]) => [cat, shapes.length])
        )
      },
      sitemaps: {
        index: sitemapIndex,
        mainShapes: mainShapesSitemap,
        categories: categorySitemaps
      }
    });
  } catch (error) {
    console.error('Error generating shape sitemaps:', error);
    res.status(500).json({ error: 'Failed to generate shape sitemaps' });
  }
});

// Serve individual shape sitemaps
router.get('/sitemap-all-shapes.xml', async (req, res) => {
  try {
    const allShapes = await dbLoader.getAllFormulas();
    const baseUrl = req.hostname ? `https://${req.hostname}` : (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0].trim()}` : 'https://uuon.world');
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allShapes.map(shape => `  <url>
    <loc>${baseUrl}/shapes/${shape.shape_type}</loc>
    <lastmod>${shape.updated_at || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving shapes sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Dynamic category-specific sitemaps from database
router.get('/sitemap-:category-shapes.xml', async (req, res) => {
  try {
    const category = req.params.category;
    const categoryShapes = await dbLoader.getShapesByCategory(category);
    const baseUrl = req.hostname ? `https://${req.hostname}` : (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0].trim()}` : 'https://uuon.world');
    
    if (categoryShapes.length === 0) {
      return res.status(404).send('Category not found');
    }
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${categoryShapes.map(shape => `  <url>
    <loc>${baseUrl}/shapes/${shape.shape_type}</loc>
    <lastmod>${shape.updated_at || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error serving category sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Enhanced SEO Sitemap Index with What/Who/Why/Where/When
router.get('/sitemap-seo-index.xml', (req, res) => {
  const baseUrl = req.hostname ? `https://${req.hostname}` : (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0].trim()}` : 'https://uuon.world');
  const sitemapIndex = generateMasterSitemapIndex(baseUrl);
  res.set('Content-Type', 'application/xml');
  res.send(sitemapIndex);
});

// Individual Enhanced SEO Category Sitemaps
router.get('/sitemap-seo-:category.xml', (req, res) => {
  const category = req.params.category;
  const baseUrl = req.hostname ? `https://${req.hostname}` : (process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0].trim()}` : 'https://uuon.world');
  
  const metadata = SITEMAP_SEO_METADATA[category];
  if (!metadata) {
    return res.status(404).send(`Category '${category}' not found in SEO metadata`);
  }
  
  const sitemap = generateEnhancedSitemapXML(metadata, baseUrl);
  res.set('Content-Type', 'application/xml');
  res.send(sitemap);
});

// SEO Metadata API endpoint for all categories
router.get('/api/seo-metadata', (req, res) => {
  res.json({
    success: true,
    totalCategories: Object.keys(SITEMAP_SEO_METADATA).length,
    categories: Object.entries(SITEMAP_SEO_METADATA).map(([key, meta]) => ({
      category: key,
      displayName: meta.displayName,
      shapeCount: meta.shapes.length,
      priority: meta.priority,
      what: meta.what.substring(0, 200) + '...',
      who: meta.who,
      canonicalPath: meta.canonicalPath
    }))
  });
});

// Generate Publication Summary for each category
router.get('/api/seo-publication/:category', (req, res) => {
  const category = req.params.category;
  const metadata = SITEMAP_SEO_METADATA[category];
  
  if (!metadata) {
    return res.status(404).json({ error: `Category '${category}' not found` });
  }
  
  const publication = {
    title: metadata.displayName,
    abstract: metadata.what,
    
    // The 5 W's
    what: {
      title: 'What is This?',
      content: metadata.what
    },
    who: {
      title: 'Who is This For?',
      content: metadata.who
    },
    why: {
      title: 'Why Does This Matter?',
      content: metadata.why
    },
    where: {
      title: 'Where Can You Access This?',
      content: metadata.where
    },
    when: {
      title: 'When is This Available?',
      content: metadata.when
    },
    
    // Future Vision
    futureEnhancement: {
      title: 'Future Technology Enhancement',
      content: metadata.futureEnhancement
    },
    
    // SEO Data
    seo: {
      keywords: metadata.keywords,
      canonicalUrl: `https://uuon.world${metadata.canonicalPath}`,
      jsonLdType: metadata.jsonLdType,
      priority: metadata.priority
    },
    
    // Shapes included
    shapes: {
      count: metadata.shapes.length,
      featured: metadata.shapes.slice(0, 5),
      allShapes: metadata.shapes
    },
    
    // Generated metadata
    generated: new Date().toISOString(),
    version: '2.0'
  };
  
  res.json({
    success: true,
    publication
  });
});

// Generate All Publications Summary
router.get('/api/seo-publications', (req, res) => {
  const publications = Object.entries(SITEMAP_SEO_METADATA).map(([key, meta]) => ({
    category: key,
    title: meta.displayName,
    abstract: meta.what.substring(0, 300) + '...',
    targetAudience: meta.who,
    purpose: meta.why.substring(0, 200) + '...',
    futureVision: meta.futureEnhancement.substring(0, 150) + '...',
    shapeCount: meta.shapes.length,
    priority: meta.priority,
    keywords: meta.keywords.slice(0, 5),
    canonicalPath: meta.canonicalPath
  }));
  
  res.json({
    success: true,
    totalCategories: publications.length,
    totalShapes: publications.reduce((sum, p) => sum + p.shapeCount, 0),
    publications,
    generated: new Date().toISOString()
  });
});

console.log('🗺️ Enhanced SEO Sitemap routes configured with What/Who/Why/Where/When metadata');

export { router as sitemapRoutes };
