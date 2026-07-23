/**
 * DATABASE ML OPTIMIZER
 * Utilizes production database to manage heavy ML/AI data and reduce deployment size
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, text, serial, integer, real, jsonb } from "drizzle-orm/pg-core";
import { eq, lt, desc, sql } from 'drizzle-orm';
import crypto from 'crypto';
import zlib from 'zlib';
import { promisify } from 'util';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

const connectionString = process.env.DATABASE_URL!;
const neonSql = neon(connectionString, {
  connectionTimeoutMillis: 3000,
  maxLifetimeMillis: 30000,
  maxConnections: 1,
  idleTimeoutMillis: 15000
});
const db = drizzle(neonSql);

// Helper function to get the database instance
function getDb() {
  if (!connectionString) {
    console.warn("⚠️ DATABASE_URL is not set - ML optimizer running in development mode");
    return null;
  }
  try {
    return drizzle(neon(connectionString));
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return null;
  }
}


// ML Data Storage Tables (using text with base64 encoding for binary data)
export const ml_model_cache = pgTable("ml_model_cache", {
  id: serial("id").primaryKey(),
  model_name: text("model_name").notNull().unique(),
  model_type: text("model_type").notNull(), // 'transformers', 'onnx', 'tensor'
  model_data: text("model_data").notNull(), // Base64 encoded compressed data
  metadata: jsonb("metadata").notNull(),
  compression_ratio: real("compression_ratio").notNull(),
  access_count: integer("access_count").notNull().default(0),
  last_accessed: text("last_accessed").notNull(),
  created_at: text("created_at").notNull()
});

export const ai_training_embeddings = pgTable("ai_training_embeddings", {
  id: serial("id").primaryKey(),
  shape_type: text("shape_type").notNull(),
  embedding_data: text("embedding_data").notNull(), // Base64 encoded
  training_metadata: jsonb("training_metadata").notNull(),
  performance_metrics: jsonb("performance_metrics").notNull(),
  model_version: text("model_version").notNull(),
  created_at: text("created_at").notNull()
});

export const ml_asset_storage = pgTable("ml_asset_storage", {
  id: serial("id").primaryKey(),
  asset_name: text("asset_name").notNull().unique(),
  asset_type: text("asset_type").notNull(), // 'model', 'texture', 'audio'
  compressed_data: text("compressed_data").notNull(), // Base64 encoded
  original_size: integer("original_size").notNull(),
  compressed_size: integer("compressed_size").notNull(),
  checksum: text("checksum").notNull(),
  metadata: jsonb("metadata").notNull(),
  created_at: text("created_at").notNull()
});

export class DatabaseMLOptimizer {
  private compressionCache = new Map<string, Buffer>();
  private modelCache = new Map<string, any>();

  // 1. Store ML models in database instead of bundling
  async storeMLModel(modelName: string, modelType: string, modelBuffer: Buffer): Promise<string> {
    try {
      // Compress model data
      const compressed = await this.compressData(modelBuffer);
      const compressionRatio = modelBuffer.length / compressed.length;

      const checksum = crypto.createHash('sha256').update(modelBuffer).digest('hex');

      await db.insert(ml_model_cache).values({
        model_name: modelName,
        model_type: modelType,
        model_data: compressed.toString('base64'),
        metadata: {
          originalSize: modelBuffer.length,
          compressedSize: compressed.length,
          checksum,
          timestamp: new Date().toISOString()
        },
        compression_ratio: compressionRatio,
        last_accessed: new Date().toISOString(),
        created_at: new Date().toISOString()
      }).onConflictDoUpdate({
        target: ml_model_cache.model_name,
        set: {
          model_data: compressed.toString('base64'),
          metadata: {
            originalSize: modelBuffer.length,
            compressedSize: compressed.length,
            checksum,
            timestamp: new Date().toISOString()
          },
          compression_ratio: compressionRatio,
          last_accessed: new Date().toISOString()
        }
      });

      console.log(`📦 ML Model stored in database: ${modelName} (${compressionRatio.toFixed(2)}x compression)`);
      return checksum;
    } catch (error) {
      console.error('Failed to store ML model:', error);
      throw error;
    }
  }

  // 2. Lazy load models from database
  async loadMLModel(modelName: string): Promise<Buffer | null> {
    try {
      // Check memory cache first
      if (this.modelCache.has(modelName)) {
        return this.modelCache.get(modelName);
      }

      const result = await db.select()
        .from(ml_model_cache)
        .where(eq(ml_model_cache.model_name, modelName))
        .limit(1);

      if (result.length === 0) {
        console.warn(`ML Model not found in database: ${modelName}`);
        return null;
      }

      const modelData = result[0];

      // Decompress model data (stored as base64 string)
      const decompressed = await this.decompressData(Buffer.from(modelData.model_data, 'base64'));

      // Update access statistics
      await db.update(ml_model_cache)
        .set({
          access_count: modelData.access_count + 1,
          last_accessed: new Date().toISOString()
        })
        .where(eq(ml_model_cache.id, modelData.id));

      // Cache in memory for quick access
      this.modelCache.set(modelName, decompressed);

      console.log(`🔄 ML Model loaded from database: ${modelName}`);
      return decompressed;
    } catch (error) {
      console.error('Failed to load ML model:', error);
      return null;
    }
  }

  // 3. Store AI training data and embeddings
  async storeTrainingEmbeddings(shapeType: string, embeddings: number[][], metadata: any): Promise<void> {
    try {
      const embeddingBuffer = Buffer.from(JSON.stringify(embeddings));
      const compressed = await this.compressData(embeddingBuffer);

      await db.insert(ai_training_embeddings).values({
        shape_type: shapeType,
        embedding_data: compressed.toString('base64'),
        training_metadata: metadata,
        performance_metrics: {
          embeddingCount: embeddings.length,
          dimensionality: embeddings[0]?.length || 0,
          compressionRatio: embeddingBuffer.length / compressed.length
        },
        model_version: '1.0',
        created_at: new Date().toISOString()
      });

      console.log(`🧠 Training embeddings stored for ${shapeType}: ${embeddings.length} vectors`);
    } catch (error) {
      console.error('Failed to store training embeddings:', error);
    }
  }

  // 4. Retrieve training data on demand
  async getTrainingEmbeddings(shapeType: string): Promise<number[][] | null> {
    try {
      const result = await db.select()
        .from(ai_training_embeddings)
        .where(eq(ai_training_embeddings.shape_type, shapeType))
        .orderBy(desc(ai_training_embeddings.id))
        .limit(1);

      if (result.length === 0) return null;

      const compressed = Buffer.from(result[0].embedding_data, 'base64');
      const decompressed = await this.decompressData(compressed);
      const embeddings = JSON.parse(decompressed.toString());

      console.log(`📊 Retrieved ${embeddings.length} training embeddings for ${shapeType}`);
      return embeddings;
    } catch (error) {
      console.error('Failed to retrieve training embeddings:', error);
      return null;
    }
  }

  // 5. Store large assets with compression
  async storeAsset(name: string, type: string, data: Buffer, metadata: Record<string, any> = {}): Promise<string> {
    try {
      const checksum = this.generateChecksum(data);
      const compressed = this.compressBuffer(data);

      // Enhanced type detection for filename-based classification
      const finalType = this.determineAssetType(
        metadata.originalName ? '.' + metadata.originalName.split('.').pop() : '',
        name
      ) || type;

      await db.insert(ml_asset_storage).values({
        asset_name: name,
        asset_type: finalType,
        asset_data: compressed,
        checksum,
        metadata: JSON.stringify(metadata),
        original_size: data.length,
        compressed_size: compressed.length,
        created_at: new Date(),
        last_accessed: new Date()
      }).onConflictDoUpdate({
        target: ml_asset_storage.asset_name,
        set: {
          asset_data: compressed,
          checksum,
          metadata: JSON.stringify(metadata),
          original_size: data.length,
          compressed_size: compressed.length,
          updated_at: new Date()
        }
      });

      console.log(`📦 Asset stored: ${name} (${finalType}) - ${(data.length / 1024).toFixed(2)}KB -> ${(compressed.length / 1024).toFixed(2)}KB`);
      return checksum;
    } catch (error) {
      console.error('Failed to store asset:', error);
      throw error;
    }
  }

  // 6. Lazy load assets
  async loadAsset(assetName: string): Promise<Buffer | null> {
    try {
      if (this.compressionCache.has(assetName)) {
        return this.compressionCache.get(assetName)!;
      }

      const result = await db.select()
        .from(ml_asset_storage)
        .where(eq(ml_asset_storage.asset_name, assetName))
        .limit(1);

      if (result.length === 0) return null;

      const compressed = Buffer.from(result[0].compressed_data, 'base64');
      const decompressed = await this.decompressData(compressed);

      this.compressionCache.set(assetName, decompressed);
      return decompressed;
    } catch (error) {
      console.error('Failed to load asset:', error);
      return null;
    }
  }

  // 7. Clean up old/unused data
  async cleanupOldData(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

      // Remove old unused models
      const unusedModels = await db.select()
        .from(ml_model_cache)
        .where(lt(ml_model_cache.last_accessed, thirtyDaysAgo));

      for (const model of unusedModels) {
        if (model.access_count < 5) { // Only remove rarely accessed models
          await db.delete(ml_model_cache).where(eq(ml_model_cache.id, model.id));
          console.log(`🗑️ Removed unused ML model: ${model.model_name}`);
        }
      }

      // Clean memory cache
      this.modelCache.clear();
      this.compressionCache.clear();

      console.log('🧹 Database ML cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  // 8. Get storage statistics with space utilization
  async getStorageStats(): Promise<any> {
    try {
      const modelStats = await db.select({
        count: sql`COUNT(*)`,
        totalOriginal: sql`SUM(CAST(metadata->>'originalSize' AS INTEGER))`,
        totalCompressed: sql`SUM(LENGTH(model_data))`
      }).from(ml_model_cache);

      const assetStats = await db.select({
        count: sql`COUNT(*)`,
        totalOriginal: sql`SUM(original_size)`,
        totalCompressed: sql`SUM(compressed_size)`
      }).from(ml_asset_storage);

      const embeddingStats = await db.select({
        count: sql`COUNT(*)`,
        totalSize: sql`SUM(LENGTH(embedding_data))`
      }).from(ai_training_embeddings);

      const modelOriginal = Number(modelStats[0].totalOriginal) || 0;
      const modelCompressed = Number(modelStats[0].totalCompressed) || 0;
      const assetOriginal = Number(assetStats[0].totalOriginal) || 0;
      const assetCompressed = Number(assetStats[0].totalCompressed) || 0;
      const embeddingSize = Number(embeddingStats[0].totalSize) || 0;

      const totalUsedSpace = modelCompressed + assetCompressed + embeddingSize;
      const maxDatabaseSize = 10 * 1024 * 1024 * 1024; // 10GB limit per Replit docs
      const spaceUtilization = (totalUsedSpace / maxDatabaseSize) * 100;
      const remainingSpace = maxDatabaseSize - totalUsedSpace;

      return {
        models: {
          count: modelStats[0].count,
          originalSize: modelOriginal,
          compressedSize: modelCompressed,
          compressionRatio: modelOriginal / (modelCompressed || 1)
        },
        assets: {
          count: assetStats[0].count,
          originalSize: assetOriginal,
          compressedSize: assetCompressed,
          compressionRatio: assetOriginal / (assetCompressed || 1)
        },
        embeddings: {
          count: embeddingStats[0].count,
          totalSize: embeddingSize
        },
        totalSavings: (modelOriginal + assetOriginal) - (modelCompressed + assetCompressed),
        databaseUtilization: {
          totalUsedSpace,
          remainingSpace,
          spaceUtilizationPercent: spaceUtilization,
          canStoreMore: remainingSpace > 100 * 1024 * 1024, // >100MB remaining
          recommendedActions: this.getStorageRecommendations(spaceUtilization, remainingSpace)
        }
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { error: 'Failed to retrieve stats' };
    }
  }

  // Add methods for asset management and search
  // Clear cache when needed
  clearCache() {
    this.compressionCache.clear();
    this.modelCache.clear();
  }

  // Get assets by category
  async getAssetsByCategory(category: string): Promise<any[]> {
    const db = getDb();
    if (!db) return [];

    try {
      const assets = await db.select().from(ml_asset_storage)
        .where(sql`metadata->>'category' = ${category}`);

      return assets;
    } catch (error) {
      console.error('Failed to get assets by category:', error);
      return [];
    }
  }

  // Search assets by name or metadata
  async searchAssets(query: string, category?: string): Promise<any[]> {
    const db = getDb();
    if (!db) return [];

    try {
      let whereClause = sql`(asset_name ILIKE ${`%${query}%`} OR metadata->>'originalName' ILIKE ${`%${query}%`})`;

      if (category) {
        whereClause = sql`${whereClause} AND metadata->>'category' = ${category}`;
      }

      const assets = await db.select().from(ml_asset_storage).where(whereClause);

      return assets.map(asset => {
        const metadata = asset.metadata as { originalName?: string; migrationDate?: string };
        return {
          name: asset.asset_name,
          type: asset.asset_type,
          originalName: metadata.originalName,
          size: asset.original_size,
          migrationDate: metadata.migrationDate,
          loadUrl: `/api/ml-data/load-asset/${asset.asset_name}`
        };
      });
    } catch (error) {
      console.error('Failed to search assets:', error);
      return [];
    }
  }


  private async compressData(data: Buffer): Promise<Buffer> {
    try {
      // Use gzip compression (built into Node.js)
      const compressed = await gzip(data, { level: 9 });
      return Buffer.from(compressed);
    } catch (error) {
      console.warn('Compression failed, using original data:', error);
      return data;
    }
  }

  private async decompressData(compressed: Buffer): Promise<Buffer> {
    try {
      const decompressed = await gunzip(compressed);
      return Buffer.from(decompressed);
    } catch (error) {
      console.warn('Decompression failed, returning original:', error);
      return compressed;
    }
  }

  private getStorageRecommendations(utilizationPercent: number, remainingBytes: number): string[] {
    const recommendations = [];

    if (utilizationPercent < 10) {
      recommendations.push('📈 Excellent space available - consider storing more training data');
      recommendations.push('🔄 Move development assets and build artifacts to database');
    } else if (utilizationPercent < 50) {
      recommendations.push('✅ Good space utilization - continue current strategy');
      recommendations.push('📊 Consider storing preprocessed datasets for faster ML training');
    } else if (utilizationPercent < 80) {
      recommendations.push('⚠️ Monitor space usage - approaching 80% capacity');
      recommendations.push('🗑️ Schedule cleanup of unused models and assets');
    } else {
      recommendations.push('🚨 High space utilization - immediate cleanup recommended');
      recommendations.push('🔄 Archive old training data and remove unused models');
    }

    const remainingGB = (remainingBytes / 1024 / 1024 / 1024).toFixed(2);
    recommendations.push(`💾 ${remainingGB}GB remaining of 10GB database limit`);

    return recommendations;
  }

  private determineAssetType(extension: string, filename?: string): string {
    const typeMap: { [key: string]: string } = {
      '.txt': 'text',
      '.md': 'text',
      '.json': 'text',
      '.png': 'image',
      '.jpg': 'image',
      '.jpeg': 'image',
      '.obj': '3d_model',
      '.glb': '3d_model',
      '.gltf': '3d_model',
      '.mp3': 'audio',
      '.wav': 'audio',
      '.pdf': 'document'
    };

    // Special handling for quantum research documents
    if (filename) {
      if (filename.includes('QAOA') || filename.includes('quantum')) {
        return 'quantum_research';
      }
      if (filename.includes('Nishimori') || filename.includes('phase-transition')) {
        return 'quantum_physics';
      }
      if (filename.includes('Heisenberg') || filename.includes('VQE')) {
        return 'quantum_algorithms';
      }
      if (filename.includes('kernel') || filename.includes('classification')) {
        return 'quantum_ml';
      }
      if (filename.includes('Krylov') || filename.includes('diagonalization')) {
        return 'quantum_computation';
      }
    }

    return typeMap[extension] || 'binary';
  }

  // Dummy methods to satisfy the current structure before they are implemented
  private generateChecksum(data: Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  private compressBuffer(data: Buffer): string {
    // In a real implementation, this would compress and return base64 string
    // For now, just returning as base64 to match the expected type
    return data.toString('base64');
  }
}

export const databaseMLOptimizer = new DatabaseMLOptimizer();