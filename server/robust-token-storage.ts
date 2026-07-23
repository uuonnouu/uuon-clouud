
export class RobustTokenStorage {
  private static instance: RobustTokenStorage;
  private retryAttempts = 3;
  private retryDelay = 1000; // 1 second

  static getInstance(): RobustTokenStorage {
    if (!RobustTokenStorage.instance) {
      RobustTokenStorage.instance = new RobustTokenStorage();
    }
    return RobustTokenStorage.instance;
  }

  async saveTokenStockpile(stockpileData: any, attempt = 1): Promise<boolean> {
    try {
      console.log(`💾 Attempting to save token stockpile (attempt ${attempt}/${this.retryAttempts})`);
      
      // Validate stockpile data
      if (!stockpileData || typeof stockpileData !== 'object') {
        throw new Error('Invalid stockpile data format');
      }

      // Primary storage attempt
      const result = await this.primaryStorageAttempt(stockpileData);
      
      if (result.success) {
        console.log('✅ Token stockpile saved successfully');
        return true;
      }

      throw new Error(result.error || 'Primary storage failed');

    } catch (error) {
      console.warn(`⚠️ Token storage attempt ${attempt} failed:`, error.message);
      
      if (attempt < this.retryAttempts) {
        // Exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        console.log(`🔄 Retrying in ${delay}ms...`);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.saveTokenStockpile(stockpileData, attempt + 1);
      }

      // Final fallback - cache locally
      console.log('💾 Using fallback local cache storage');
      return this.fallbackStorage(stockpileData);
    }
  }

  private async primaryStorageAttempt(data: any): Promise<{success: boolean, error?: string}> {
    try {
      // Implement primary database storage
      const response = await fetch('/api/token-ecosystem/bulk-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        return { success: true };
      }

      return { success: false, error: `HTTP ${response.status}` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  private async fallbackStorage(data: any): Promise<boolean> {
    try {
      // Store in local cache/memory as fallback
      const cacheKey = `token_stockpile_${Date.now()}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        ...data,
        cached: true,
        timestamp: new Date().toISOString()
      }));
      
      console.log(`📦 Token data cached locally: ${cacheKey}`);
      return true;
    } catch (error) {
      console.error('❌ Even fallback storage failed:', error);
      return false;
    }
  }

  async syncCachedData(): Promise<void> {
    console.log('🔄 Syncing cached token data...');
    
    // Retrieve and sync any cached token data
    const cacheKeys = Object.keys(localStorage).filter(key => 
      key.startsWith('token_stockpile_')
    );

    for (const key of cacheKeys) {
      try {
        const cachedData = JSON.parse(localStorage.getItem(key) || '{}');
        const success = await this.primaryStorageAttempt(cachedData);
        
        if (success.success) {
          localStorage.removeItem(key);
          console.log(`✅ Synced and cleared cache: ${key}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to sync cached data: ${key}`, error);
      }
    }
  }
}

export const robustTokenStorage = RobustTokenStorage.getInstance();
