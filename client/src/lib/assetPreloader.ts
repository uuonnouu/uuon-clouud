
class AssetPreloader {
  private preloadQueue: string[] = [];
  private loadedAssets = new Set<string>();
  private loadingAssets = new Set<string>();

  // Preload critical assets based on usage patterns
  preloadCriticalAssets() {
    const criticalAssets = [
      '/textures/earth-map.webp',
      '/models/saturn.glb',
      '/textures/8k-saturn.jpg'
    ];

    criticalAssets.forEach(asset => {
      this.preloadAsset(asset);
    });
  }

  private async preloadAsset(assetPath: string) {
    if (this.loadedAssets.has(assetPath) || this.loadingAssets.has(assetPath)) {
      return;
    }

    this.loadingAssets.add(assetPath);

    try {
      if (assetPath.endsWith('.webp') || assetPath.endsWith('.jpg') || assetPath.endsWith('.png')) {
        await this.preloadImage(assetPath);
      } else if (assetPath.endsWith('.glb') || assetPath.endsWith('.gltf')) {
        await this.preloadModel(assetPath);
      }
      
      this.loadedAssets.add(assetPath);
    } catch (error) {
      console.warn(`Failed to preload asset: ${assetPath}`, error);
    } finally {
      this.loadingAssets.delete(assetPath);
    }
  }

  private preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }

  private preloadModel(src: string): Promise<void> {
    return fetch(src)
      .then(response => response.blob())
      .then(() => {});
  }
}

export const assetPreloader = new AssetPreloader();
