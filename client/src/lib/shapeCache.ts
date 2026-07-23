
class ShapeCache {
  private cache = new Map<string, any>();
  private expiry = new Map<string, number>();
  private accessOrder = new Map<string, number>(); // LRU tracking
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 200; // Prevent memory bloat
  private readonly MEMORY_THRESHOLD = 100 * 1024 * 1024; // 100MB

  set(key: string, value: any, ttl = this.TTL) {
    // LRU eviction when cache is full
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictLeastRecentlyUsed();
    }
    
    // Memory-based eviction
    if (this.getEstimatedMemoryUsage() > this.MEMORY_THRESHOLD) {
      this.evictLargestItems();
    }
    
    this.cache.set(key, value);
    this.expiry.set(key, Date.now() + ttl);
    this.accessOrder.set(key, Date.now());
  }
  
  private evictLeastRecentlyUsed() {
    let oldestKey = '';
    let oldestTime = Date.now();
    
    for (const entry of Array.from(this.accessOrder.entries())) {
      const [key, time] = entry;
      if (time < oldestTime) {
        oldestTime = time;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.expiry.delete(oldestKey);
      this.accessOrder.delete(oldestKey);
    }
  }
  
  private evictLargestItems() {
    const items = Array.from(this.cache.entries())
      .map(([key, value]) => ({ 
        key, 
        size: JSON.stringify(value).length 
      }))
      .sort((a, b) => b.size - a.size);
    
    // Remove top 25% largest items
    const toRemove = Math.ceil(items.length * 0.25);
    for (let i = 0; i < toRemove; i++) {
      const key = items[i].key;
      this.cache.delete(key);
      this.expiry.delete(key);
      this.accessOrder.delete(key);
    }
  }
  
  private getEstimatedMemoryUsage(): number {
    let totalSize = 0;
    for (const value of Array.from(this.cache.values())) {
      totalSize += JSON.stringify(value).length * 2; // Rough estimate
    }
    return totalSize;
  }

  get(key: string) {
    const expiryTime = this.expiry.get(key);
    if (!expiryTime || Date.now() > expiryTime) {
      this.cache.delete(key);
      this.expiry.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  clear() {
    this.cache.clear();
    this.expiry.clear();
  }

  // Preload commonly used shapes
  async preloadCommonShapes() {
    const commonShapes = ['sphere', 'cube', 'torus', 'klein_bottle'];
    for (const shape of commonShapes) {
      if (!this.get(`shape-${shape}`)) {
        // Precompute shape data
        const shapeData = await this.computeShapeData(shape);
        this.set(`shape-${shape}`, shapeData);
      }
    }
  }

  private async computeShapeData(shapeType: string) {
    // This would compute expensive shape calculations upfront
    return {
      type: shapeType,
      computed: Date.now(),
      optimized: true
    };
  }

  // Memory cleanup
  cleanup() {
    const now = Date.now();
    for (const entry of Array.from(this.expiry.entries())) {
      const [key, expiryTime] = entry;
      if (now > expiryTime) {
        this.cache.delete(key);
        this.expiry.delete(key);
      }
    }
  }
}

export const shapeCache = new ShapeCache();

// Auto cleanup every 2 minutes with proper cleanup method
let shapeCacheCleanupInterval: ReturnType<typeof setInterval> | null = null;

export function startShapeCacheCleanup() {
  if (shapeCacheCleanupInterval) return;
  shapeCacheCleanupInterval = setInterval(() => {
    shapeCache.cleanup();
  }, 2 * 60 * 1000);
}

export function stopShapeCacheCleanup() {
  if (shapeCacheCleanupInterval) {
    clearInterval(shapeCacheCleanupInterval);
    shapeCacheCleanupInterval = null;
  }
}

// Start automatically but provide cleanup
startShapeCacheCleanup();

// Listen for memory pressure events and perform aggressive cleanup
if (typeof window !== 'undefined') {
  window.addEventListener('memoryPressure', ((event: CustomEvent) => {
    shapeCache.clear(); // Aggressive cleanup under memory pressure
  }) as EventListener);
}
