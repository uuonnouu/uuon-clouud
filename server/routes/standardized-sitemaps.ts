
import { Router } from 'express';
import { StandardizedSitemapGenerator } from '../sitemap-framework-generator';

const router = Router();
const generator = new StandardizedSitemapGenerator();

// Generate all standardized sitemaps
router.get('/generate-standardized-sitemaps', async (req, res) => {
  try {
    await generator.generateAllSitemaps();
    res.json({
      success: true,
      message: 'Standardized sitemap framework generated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating standardized sitemaps:', error);
    res.status(500).json({ 
      error: 'Failed to generate standardized sitemaps',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Serve standardized sitemaps
router.get('/sitemap-:type.xml', async (req, res) => {
  try {
    const type = req.params.type;
    const validTypes = ['index', 'categories', 'algorithms', 'engines', 'assets', 'api', 'products', 'documentation'];
    
    if (!validTypes.includes(type)) {
      return res.status(404).json({ error: 'Invalid sitemap type' });
    }
    
    const fs = require('fs');
    const filePath = `client/public/sitemap-${type}.xml`;
    
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.sendFile(require('path').resolve(filePath));
    } else {
      res.status(404).json({ error: 'Sitemap not found' });
    }
  } catch (error) {
    console.error('Error serving sitemap:', error);
    res.status(500).json({ error: 'Failed to serve sitemap' });
  }
});

// Get sitemap framework metadata
router.get('/sitemap-metadata', async (req, res) => {
  try {
    const framework = await generator.generateSitemapFramework();
    
    res.json({
      success: true,
      framework: {
        categories: framework.categories.length,
        algorithms: framework.algorithms.length,
        engines: framework.engines.length,
        assets: framework.assets.length,
        api: framework.api.length,
        products: framework.products.length,
        documentation: framework.documentation.length
      },
      generated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting sitemap metadata:', error);
    res.status(500).json({ error: 'Failed to get sitemap metadata' });
  }
});

export { router as standardizedSitemapRoutes };
