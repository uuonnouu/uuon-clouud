
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function analyzeDatabaseUsage() {
  console.log('📊 ANALYZING DATABASE USAGE (5GB BREAKDOWN)\n');
  
  try {
    // Check ML model storage
    const mlModels = await sql`
      SELECT 
        COUNT(*) as count,
        SUM(LENGTH(model_data)) / 1024 / 1024 as size_mb,
        AVG(compression_ratio) as avg_compression
      FROM ml_model_cache
    `.catch(() => [{ count: 0, size_mb: 0, avg_compression: 0 }]);

    // Check asset storage
    const assetStorage = await sql`
      SELECT 
        COUNT(*) as count,
        SUM(compressed_size) / 1024 / 1024 as compressed_mb,
        SUM(original_size) / 1024 / 1024 as original_mb
      FROM ml_asset_storage
    `.catch(() => [{ count: 0, compressed_mb: 0, original_mb: 0 }]);

    // Check embeddings
    const embeddings = await sql`
      SELECT 
        COUNT(*) as count,
        SUM(LENGTH(embedding_data)) / 1024 / 1024 as size_mb
      FROM ai_training_embeddings
    `.catch(() => [{ count: 0, size_mb: 0 }]);

    // Check shape data
    const shapes = await sql`
      SELECT 
        COUNT(*) as count,
        SUM(LENGTH(COALESCE(formula_implementation, ''))) / 1024 / 1024 as formulas_mb
      FROM formula_implementations
    `.catch(() => [{ count: 0, formulas_mb: 0 }]);

    // Check token data
    const tokens = await sql`
      SELECT 
        COUNT(*) as count,
        SUM(LENGTH(COALESCE(token_data, ''))) / 1024 / 1024 as tokens_mb
      FROM shape_tokens
    `.catch(() => [{ count: 0, tokens_mb: 0 }]);

    console.log('🔍 DATABASE STORAGE BREAKDOWN:');
    console.log('═══════════════════════════════════');
    
    const mlSize = Number(mlModels[0]?.size_mb || 0);
    const assetSize = Number(assetStorage[0]?.compressed_mb || 0);
    const embeddingSize = Number(embeddings[0]?.size_mb || 0);
    const shapeSize = Number(shapes[0]?.formulas_mb || 0);
    const tokenSize = Number(tokens[0]?.tokens_mb || 0);
    const totalAnalyzed = mlSize + assetSize + embeddingSize + shapeSize + tokenSize;

    console.log(`📦 ML Models: ${mlSize.toFixed(1)}MB (${mlModels[0]?.count || 0} models)`);
    console.log(`🖼️ Asset Storage: ${assetSize.toFixed(1)}MB (${assetStorage[0]?.count || 0} assets)`);
    console.log(`🧠 AI Embeddings: ${embeddingSize.toFixed(1)}MB (${embeddings[0]?.count || 0} embeddings)`);
    console.log(`📐 Shape Formulas: ${shapeSize.toFixed(1)}MB (${shapes[0]?.count || 0} shapes)`);
    console.log(`🪙 Token Data: ${tokenSize.toFixed(1)}MB (${tokens[0]?.count || 0} tokens)`);
    console.log(`📊 Analyzed Total: ${totalAnalyzed.toFixed(1)}MB`);
    console.log(`❓ Unaccounted: ${(5000 - totalAnalyzed).toFixed(1)}MB (indexes, metadata, other)`);

    console.log('\n🎯 SPACE OPTIMIZATION RECOMMENDATIONS:');
    console.log('═══════════════════════════════════════');
    
    if (mlSize > 1000) {
      console.log('• Clean up unused ML models (>1GB detected)');
    }
    if (assetSize > 2000) {
      console.log('• Review asset compression ratios (>2GB detected)');
    }
    if (embeddingSize > 500) {
      console.log('• Archive old training embeddings (>500MB detected)');
    }
    
    const originalAssetSize = Number(assetStorage[0]?.original_mb || 0);
    const compressionRatio = originalAssetSize > 0 ? originalAssetSize / assetSize : 1;
    console.log(`• Current compression ratio: ${compressionRatio.toFixed(2)}x`);
    console.log(`• Space saved by compression: ${(originalAssetSize - assetSize).toFixed(1)}MB`);

  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.log('\n🔍 LIKELY CAUSES FOR 5GB USAGE:');
    console.log('• Auto-migration of attached_assets/ folder');
    console.log('• ML models stored for deployment optimization');
    console.log('• Compressed textures and 3D models');
    console.log('• Mathematical shape embeddings and training data');
    console.log('• Token economy blockchain data');
  }
}

analyzeDatabaseUsage().catch(console.error);
