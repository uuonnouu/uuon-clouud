
import { Router } from 'express';
import { sitemapFramework } from '../sitemap-framework';

const router = Router();

// Generate complete sitemap ecosystem
router.get('/generate-complete-ecosystem', async (req, res) => {
  try {
    const ecosystem = sitemapFramework.generateCompleteSitemapEcosystem();
    
    res.json({
      success: true,
      message: 'Complete sitemap ecosystem generated',
      ecosystem,
      stats: {
        totalSitemaps: Object.keys(ecosystem).length,
        generatedAt: new Date().toISOString(),
        framework: 'UnifiedSitemapFramework v1.0'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap ecosystem'
    });
  }
});

// Generate specific sitemap type
router.get('/generate/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const ecosystem = sitemapFramework.generateCompleteSitemapEcosystem();
    
    if (!ecosystem[type as keyof typeof ecosystem]) {
      return res.status(404).json({
        success: false,
        error: 'Sitemap type not found',
        availableTypes: Object.keys(ecosystem)
      });
    }

    res.set('Content-Type', 'application/xml');
    res.send(ecosystem[type as keyof typeof ecosystem]);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate sitemap'
    });
  }
});

// Auto-generate for new entity
router.post('/auto-generate', async (req, res) => {
  try {
    const entity = req.body;
    
    const result = await sitemapFramework.autoGenerateForNewEntity(entity);
    
    res.json({
      success: true,
      message: 'Auto-generated sitemap components for new entity',
      result,
      abstractId: `${entity.type.toUpperCase()}_${entity.id}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to auto-generate sitemap components'
    });
  }
});

// SEO metadata generation
router.get('/seo-metadata/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    
    const metadata = sitemapFramework.generateSEOMetadata(type, id);
    
    res.json({
      success: true,
      metadata,
      abstractId: `${type.toUpperCase()}_${id}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate SEO metadata'
    });
  }
});

export { router as sitemapFrameworkRoutes };
