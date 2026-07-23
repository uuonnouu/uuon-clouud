
/**
 * DATABASE ML LOADER
 * Client-side loader for ML models stored in database
 */

export class DatabaseMLLoader {
  private modelCache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadModel(modelName: string): Promise<any> {
    // Check if already cached
    if (this.modelCache.has(modelName)) {
      return this.modelCache.get(modelName);
    }

    // Check if already loading
    if (this.loadingPromises.has(modelName)) {
      return this.loadingPromises.get(modelName);
    }

    // Start loading
    const loadingPromise = this.fetchModelFromDatabase(modelName);
    this.loadingPromises.set(modelName, loadingPromise);

    try {
      const model = await loadingPromise;
      this.modelCache.set(modelName, model);
      this.loadingPromises.delete(modelName);
      return model;
    } catch (error) {
      this.loadingPromises.delete(modelName);
      throw error;
    }
  }

  private async fetchModelFromDatabase(modelName: string): Promise<any> {
    try {
      const response = await fetch(`/api/ml-data/uuon-load-model/${modelName}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load model: ${response.statusText}`);
      }

      const modelData = await response.arrayBuffer();
      
      // Convert to format expected by transformers
      const blob = new Blob([modelData]);
      const url = URL.createObjectURL(blob);

      console.log(`✅ Model loaded from database: ${modelName}`);
      return url;
    } catch (error) {
      console.error(`❌ Failed to load model ${modelName}:`, error);
      throw error;
    }
  }

  async loadTrainingEmbeddings(shapeType: string): Promise<number[][] | null> {
    try {
      const response = await fetch(`/api/ml-data/uuon-embeddings/${shapeType}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to load embeddings: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`📊 Loaded ${data.count} embeddings for ${shapeType}`);
      return data.embeddings;
    } catch (error) {
      console.error(`❌ Failed to load embeddings for ${shapeType}:`, error);
      return null;
    }
  }

  async loadAsset(assetName: string): Promise<string | null> {
    try {
      const response = await fetch(`/api/ml-data/uuon-load-asset/${assetName}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Failed to load asset: ${response.statusText}`);
      }

      const assetData = await response.arrayBuffer();
      const blob = new Blob([assetData]);
      const url = URL.createObjectURL(blob);

      console.log(`💾 Asset loaded from database: ${assetName}`);
      return url;
    } catch (error) {
      console.error(`❌ Failed to load asset ${assetName}:`, error);
      return null;
    }
  }

  async getStorageStats(): Promise<any> {
    try {
      const response = await fetch('/api/ml-data/uuon-storage-stats');
      const data = await response.json();
      return data.stats;
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }

  clearCache(): void {
    this.modelCache.clear();
    console.log('🧹 ML model cache cleared');
  }
}

export const databaseMLLoader = new DatabaseMLLoader();
