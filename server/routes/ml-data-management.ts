import { Router } from 'express';
import { databaseMLOptimizer } from '../database-ml-optimizer';
import multer from 'multer';
import { readFileSync } from 'fs';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 }, fileFilter: (req, file, cb) => { const allowed = ["model/gltf+json", "model/gltf-binary"]; if (allowed.includes(file.mimetype)) cb(null, true); else cb(new Error("Invalid MIME")); } });

// Store ML model in database
router.post('/uuon-store-model', upload.single('model'), async (req, res) => {
  try {
    const { modelName, modelType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No model file provided' });
    }

    const checksum = await databaseMLOptimizer.storeMLModel(
      modelName, 
      modelType, 
      req.file.buffer
    );

    res.json({
      success: true,
      checksum,
      message: `Model ${modelName} stored successfully`
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to store model',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Load ML model from database
router.get('/uuon-load-model/:modelName', async (req, res) => {
  try {
    const { modelName } = req.params;
    const modelBuffer = await databaseMLOptimizer.loadMLModel(modelName);

    if (!modelBuffer) {
      return res.status(404).json({ error: 'Model not found' });
    }

    res.set({
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${modelName}.bin"`
    });
    res.send(modelBuffer);
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to load model',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Store training embeddings
router.post('/uuon-store-embeddings', async (req, res) => {
  try {
    const { shapeType, embeddings, metadata } = req.body;

    await databaseMLOptimizer.storeTrainingEmbeddings(shapeType, embeddings, metadata);

    res.json({
      success: true,
      message: `Embeddings stored for ${shapeType}`
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to store embeddings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Retrieve training embeddings
router.get('/uuon-embeddings/:shapeType', async (req, res) => {
  try {
    const { shapeType } = req.params;
    const embeddings = await databaseMLOptimizer.getTrainingEmbeddings(shapeType);

    if (!embeddings) {
      return res.status(404).json({ error: 'Embeddings not found' });
    }

    res.json({
      success: true,
      shapeType,
      embeddings,
      count: embeddings.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to retrieve embeddings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Store large assets
router.post('/uuon-store-asset', upload.single('asset'), async (req, res) => {
  try {
    const { assetName, assetType, metadata } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'No asset file provided' });
    }

    const parsedMetadata = metadata ? JSON.parse(metadata) : {};
    const checksum = await databaseMLOptimizer.storeAsset(
      assetName,
      assetType,
      req.file.buffer,
      parsedMetadata
    );

    res.json({
      success: true,
      checksum,
      message: `Asset ${assetName} stored successfully`
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to store asset',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Load asset from database (for deployment optimization)
router.get('/uuon-load-asset/:assetName', async (req, res) => {
  try {
    const assetName = decodeURIComponent(req.params.assetName);
    const assetData = await databaseMLOptimizer.loadAsset(assetName);

    if (!assetData) {
      return res.status(404).json({
        success: false,
        error: 'Asset not found in database storage'
      });
    }

    // Set appropriate headers based on file extension
    const ext = assetName.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'glb': 'model/gltf-binary',
      'gltf': 'model/gltf+json',
      'mp3': 'audio/mpeg',
      'ogg': 'audio/ogg',
      'wav': 'audio/wav'
    };

    const mimeType = mimeTypes[ext as keyof typeof mimeTypes] || 'application/octet-stream';

    res.set({
      'Content-Type': mimeType,
      'Content-Length': assetData.length,
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      'ETag': `"${assetName}"`
    });

    res.send(assetData);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to load asset from database',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get current database storage usage
router.get('/uuon-storage-stats', async (req, res) => {
  try {
    const stats = await databaseMLOptimizer.getStorageStats();
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to get storage stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Clean up old data
router.post('/uuon-cleanup', async (req, res) => {
  try {
    await databaseMLOptimizer.cleanupOldData();
    res.json({
      success: true,
      message: 'Cleanup completed successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Migrate existing assets to database
router.post('/uuon-migrate-assets', async (req, res) => {
  try {
    const migrationResults = [];

    // Migrate models
    const modelPaths = [
      { name: 'distilgpt2', path: './models/distilgpt2.bin', type: 'transformers' },
      { name: 'distilbert-sentiment', path: './models/sentiment.bin', type: 'transformers' },
      { name: 'onnx-model', path: './models/model.onnx', type: 'onnx' }
    ];

    for (const model of modelPaths) {
      try {
        const buffer = readFileSync(model.path);
        const checksum = await databaseMLOptimizer.storeMLModel(model.name, model.type, buffer);
        migrationResults.push({
          name: model.name,
          status: 'success',
          checksum,
          size: buffer.length
        });
      } catch (error) {
        migrationResults.push({
          name: model.name,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Migrate assets
    const assetPaths = [
      { name: 'texture-grass', path: './client/public/textures/grass.png', type: 'texture' },
      { name: 'texture-wood', path: './client/public/textures/wood.jpg', type: 'texture' },
      { name: 'sound-background', path: './client/public/sounds/background.mp3', type: 'audio' }
    ];

    for (const asset of assetPaths) {
      try {
        const buffer = readFileSync(asset.path);
        const checksum = await databaseMLOptimizer.storeAsset(asset.name, asset.type, buffer);
        migrationResults.push({
          name: asset.name,
          status: 'success',
          checksum,
          size: buffer.length
        });
      } catch (error) {
        migrationResults.push({
          name: asset.name,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    res.json({
      success: true,
      message: 'Migration completed',
      results: migrationResults,
      summary: {
        total: migrationResults.length,
        successful: migrationResults.filter(r => r.status === 'success').length,
        failed: migrationResults.filter(r => r.status === 'failed').length
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Migration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export { router as mlDataManagementRoutes };