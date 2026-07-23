
/**
 * DEPLOYMENT ASSET LOADER
 * Loads assets from database storage instead of bundled files
 */

class DeploymentAssetLoader {
  private assetCache = new Map<string, any>();
  private loadingPromises = new Map<string, Promise<any>>();

  async loadAsset(assetPath: string): Promise<any> {
    // Check cache first
    if (this.assetCache.has(assetPath)) {
      return this.assetCache.get(assetPath);
    }

    // Check if already loading
    if (this.loadingPromises.has(assetPath)) {
      return this.loadingPromises.get(assetPath);
    }

    // Start loading
    const loadingPromise = this.doLoadAsset(assetPath);
    this.loadingPromises.set(assetPath, loadingPromise);

    try {
      const asset = await loadingPromise;
      this.assetCache.set(assetPath, asset);
      return asset;
    } finally {
      this.loadingPromises.delete(assetPath);
    }
  }

  private async doLoadAsset(assetPath: string): Promise<any> {
    try {
      // Check if this is a stub file (indicating asset was moved to database)
      const stubResponse = await fetch(assetPath + '.stub');
      if (stubResponse.ok) {
        const stubData = await stubResponse.json();
        console.log(`📦 Loading ${assetPath} from database storage`);
        
        // Load from database
        const response = await fetch(stubData.loadUrl);
        if (!response.ok) {
          throw new Error(`Failed to load asset from database: ${response.statusText}`);
        }
        
        return response;
      }
      
      // Fall back to normal loading
      const response = await fetch(assetPath);
      if (!response.ok) {
        throw new Error(`Failed to load asset: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      console.warn(`⚠️ Failed to load asset ${assetPath}:`, error);
      throw error;
    }
  }

  // Preload critical assets
  async preloadCriticalAssets() {
    const criticalAssets = [
      '/textures/sky.png',
      '/sounds/background.mp3'
    ];

    const preloadPromises = criticalAssets.map(asset => 
      this.loadAsset(asset).catch(error => 
        console.warn(`Failed to preload ${asset}:`, error)
      )
    );

    await Promise.allSettled(preloadPromises);
    console.log('✅ Critical assets preloaded');
  }

  clearCache() {
    this.assetCache.clear();
    this.loadingPromises.clear();
  }
}

export const deploymentAssetLoader = new DeploymentAssetLoader();
