
import express from 'express';
import { databaseMLOptimizer } from '../database-ml-optimizer';

const router = express.Router();

// Get quantum research documents by category
router.get('/documents/:category?', async (req, res) => {
  try {
    const { category } = req.params;
    const documents = await databaseMLOptimizer.getAssetsByType(category || 'quantum_research');
    
    res.json({
      success: true,
      category: category || 'all_quantum',
      documents: documents.map(doc => ({
        name: doc.asset_name,
        type: doc.asset_type,
        size: doc.original_size,
        compressed_size: doc.compressed_size,
        metadata: JSON.parse(doc.metadata || '{}'),
        created_at: doc.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quantum research documents',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get specific quantum research document content
router.get('/document/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const document = await databaseMLOptimizer.getAsset(name);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    const metadata = JSON.parse(document.metadata || '{}');
    const mimeType = document.asset_type.includes('quantum') ? 'text/plain' : 'application/octet-stream';
    
    res.set({
      'Content-Type': mimeType,
      'Content-Length': document.asset_data.length,
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      'ETag': `"${name}"`,
      'X-Original-Size': metadata.originalSize || document.original_size,
      'X-Document-Type': document.asset_type
    });

    res.send(document.asset_data);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load quantum research document',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Search quantum research documents
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const documents = await databaseMLOptimizer.searchAssets(query, ['quantum_research', 'quantum_physics', 'quantum_algorithms', 'quantum_ml', 'quantum_computation']);
    
    res.json({
      success: true,
      query,
      results: documents.map(doc => ({
        name: doc.asset_name,
        type: doc.asset_type,
        relevance_score: doc.relevance_score || 1,
        metadata: JSON.parse(doc.metadata || '{}')
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Search failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as quantumResearchRoutes };
