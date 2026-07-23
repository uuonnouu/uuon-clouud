/**
 * SDK MIGRATION HELPER
 * Assists in transitioning from legacy API calls to unified SDK
 * Provides compatibility layer and migration tracking
 */

import { sdkClient, UnifiedSDKClient } from './unifiedSDKClient';

interface LegacyAPICall {
  endpoint: string;
  method: string;
  body?: any;
  params?: any;
}

interface SDKMigrationMapping {
  legacyEndpoint: string;
  sdkModule: string;
  sdkOperation: string;
  parameterMapping?: (legacyParams: any) => any;
  responseMapping?: (sdkResponse: any) => any;
}

export class SDKMigrationHelper {
  private migrationMappings: SDKMigrationMapping[] = [
    // Shape API migrations
    {
      legacyEndpoint: '/api/shapes/:shapeName/defaults',
      sdkModule: 'shapes',
      sdkOperation: 'get-defaults',
      parameterMapping: (params) => ({ shapeId: params.shapeName })
    },
    {
      legacyEndpoint: '/api/shapes/:shapeName/formula',
      sdkModule: 'shapes', 
      sdkOperation: 'get-shape',
      parameterMapping: (params) => ({ shapeId: params.shapeName }),
      responseMapping: (response) => ({
        success: response.success,
        shape: response.result?.shapeId,
        formula: response.result?.formula,
        timestamp: response.metadata?.timestamp
      })
    },
    {
      legacyEndpoint: '/api/shapes',
      sdkModule: 'shapes',
      sdkOperation: 'list-shapes'
    },
    {
      legacyEndpoint: '/api/shapes/category/:category',
      sdkModule: 'shapes',
      sdkOperation: 'list-shapes',
      parameterMapping: (params) => ({ category: params.category })
    },

    // Quantum API migrations
    {
      legacyEndpoint: '/api/quantum/circuits',
      sdkModule: 'quantum',
      sdkOperation: 'quantum-circuit'
    },
    {
      legacyEndpoint: '/api/quantum/algorithms/:algorithm',
      sdkModule: 'quantum',
      sdkOperation: 'run-algorithm',
      parameterMapping: (params) => ({ algorithm: params.algorithm })
    },
    {
      legacyEndpoint: '/api/quantum/backends',
      sdkModule: 'quantum',
      sdkOperation: 'get-backends'
    },

    // Export API migrations
    {
      legacyEndpoint: '/api/export/shape',
      sdkModule: 'export',
      sdkOperation: 'export-shape'
    },
    {
      legacyEndpoint: '/api/export/tokens',
      sdkModule: 'export',
      sdkOperation: 'generate-token'
    }
  ];

  private migrationStats = {
    totalCalls: 0,
    migratedCalls: 0,
    legacyCalls: 0,
    failedMigrations: 0
  };

  constructor(private sdk: UnifiedSDKClient = sdkClient) {
    console.log('🔄 SDK Migration Helper initialized');
    console.log(`📊 ${this.migrationMappings.length} legacy endpoints mapped for migration`);
  }

  // Main migration method - attempts to convert legacy call to SDK call
  async migrateAPICall(legacyCall: LegacyAPICall): Promise<any> {
    this.migrationStats.totalCalls++;

    const mapping = this.findMigrationMapping(legacyCall.endpoint);
    
    if (!mapping) {
      console.warn(`⚠️ No SDK migration available for ${legacyCall.endpoint}`);
      this.migrationStats.legacyCalls++;
      return await this.executeLegacyCall(legacyCall);
    }

    try {
      console.log(`🔄 Migrating ${legacyCall.endpoint} → SDK ${mapping.sdkModule}/${mapping.sdkOperation}`);
      
      // Transform parameters if mapping provided
      let parameters = legacyCall.body || legacyCall.params || {};
      if (mapping.parameterMapping) {
        parameters = mapping.parameterMapping(parameters);
      }

      // Call SDK
      const sdkResponse = await this.sdk.call(
        mapping.sdkModule,
        mapping.sdkOperation,
        parameters
      );

      // Transform response if mapping provided
      let finalResponse = sdkResponse;
      if (mapping.responseMapping && sdkResponse.success) {
        finalResponse = mapping.responseMapping(sdkResponse);
      }

      this.migrationStats.migratedCalls++;
      console.log(`✅ Successfully migrated ${legacyCall.endpoint}`);
      
      return finalResponse;

    } catch (error) {
      console.error(`❌ Migration failed for ${legacyCall.endpoint}:`, error);
      this.migrationStats.failedMigrations++;
      
      // Fallback to legacy call
      console.log(`🔙 Falling back to legacy API for ${legacyCall.endpoint}`);
      return await this.executeLegacyCall(legacyCall);
    }
  }

  // Smart call method - automatically chooses SDK or legacy based on availability
  async smartCall(endpoint: string, options: {
    method?: string;
    body?: any;
    params?: any;
    preferSDK?: boolean;
  } = {}): Promise<any> {
    const legacyCall: LegacyAPICall = {
      endpoint,
      method: options.method || 'GET',
      body: options.body,
      params: options.params
    };

    // If SDK migration is preferred and available, use it
    if (options.preferSDK !== false) {
      const mapping = this.findMigrationMapping(endpoint);
      if (mapping) {
        return await this.migrateAPICall(legacyCall);
      }
    }

    // Otherwise, use legacy call
    return await this.executeLegacyCall(legacyCall);
  }

  // Legacy API call execution (fallback)
  private async executeLegacyCall(call: LegacyAPICall): Promise<any> {
    this.migrationStats.legacyCalls++;
    
    try {
      const response = await fetch(call.endpoint, {
        method: call.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: call.body ? JSON.stringify(call.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Legacy API call failed for ${call.endpoint}:`, error);
      throw error;
    }
  }

  private findMigrationMapping(endpoint: string): SDKMigrationMapping | undefined {
    // Simple pattern matching - in production, use more sophisticated routing
    return this.migrationMappings.find(mapping => {
      const pattern = mapping.legacyEndpoint.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(endpoint);
    });
  }

  // Migration statistics and monitoring
  getMigrationStats(): any {
    const successRate = this.migrationStats.totalCalls > 0 
      ? (this.migrationStats.migratedCalls / this.migrationStats.totalCalls) * 100 
      : 0;

    return {
      ...this.migrationStats,
      successRate: Math.round(successRate * 100) / 100,
      availableMigrations: this.migrationMappings.length,
      timestamp: new Date().toISOString()
    };
  }

  // Generate migration report
  generateMigrationReport(): string {
    const stats = this.getMigrationStats();
    
    return `
🔄 SDK MIGRATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Total API Calls: ${stats.totalCalls}
✅ Successfully Migrated: ${stats.migratedCalls}
🔙 Legacy Fallbacks: ${stats.legacyCalls}
❌ Failed Migrations: ${stats.failedMigrations}
📈 Success Rate: ${stats.successRate}%

🎯 Available Migrations: ${stats.availableMigrations}
⏰ Report Generated: ${stats.timestamp}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }

  // Enable automatic migration for specific endpoints
  enableAutoMigration(endpoints: string[]): void {
    console.log(`🔄 Enabling auto-migration for ${endpoints.length} endpoints`);
    
    // Intercept fetch calls and automatically migrate
    const originalFetch = window.fetch;
    
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      const url = input.toString();
      
      if (endpoints.some(endpoint => url.includes(endpoint))) {
        console.log(`🔄 Auto-migrating intercepted call to ${url}`);
        
        try {
          const result = await this.smartCall(url, {
            method: init?.method || 'GET',
            body: init?.body ? JSON.parse(init.body as string) : undefined,
            preferSDK: true
          });
          
          // Convert SDK response back to fetch Response format
          return new Response(JSON.stringify(result), {
            status: result.success ? 200 : 500,
            headers: { 'Content-Type': 'application/json' }
          });
          
        } catch (error) {
          console.error('Auto-migration failed, using original fetch:', error);
        }
      }
      
      // Use original fetch for non-migrated endpoints
      return originalFetch(input, init);
    };
  }

  // Disable auto-migration (restore original fetch)
  disableAutoMigration(): void {
    // This is a simplified approach - in production, you'd want more robust restoration
    console.log('🔄 Auto-migration disabled - manual migration still available');
  }

  // Test migration for a specific endpoint
  async testMigration(endpoint: string, testParameters: any = {}): Promise<{
    success: boolean;
    sdkAvailable: boolean;
    legacyWorking: boolean;
    performanceComparison?: any;
  }> {
    console.log(`🧪 Testing migration for ${endpoint}`);
    
    const mapping = this.findMigrationMapping(endpoint);
    const sdkAvailable = !!mapping;
    
    let legacyWorking = false;
    let sdkWorking = false;
    let legacyTime = 0;
    let performanceComparison: any = {};

    // Test legacy API
    try {
      const legacyStart = Date.now();
      await this.executeLegacyCall({
        endpoint,
        method: 'GET',
        params: testParameters
      });
      legacyTime = Date.now() - legacyStart;
      legacyWorking = true;
      performanceComparison.legacy = legacyTime;
    } catch (error) {
      console.warn('Legacy API test failed:', error);
    }

    // Test SDK if available
    if (mapping) {
      try {
        const sdkStart = Date.now();
        const params = mapping.parameterMapping ? mapping.parameterMapping(testParameters) : testParameters;
        await this.sdk.call(mapping.sdkModule, mapping.sdkOperation, params);
        const sdkTime = Date.now() - sdkStart;
        sdkWorking = true;
        performanceComparison.sdk = sdkTime;
        performanceComparison.improvement = legacyWorking && legacyTime > 0 ? 
          Math.round(((legacyTime - sdkTime) / legacyTime) * 100) : null;
      } catch (error) {
        console.warn('SDK test failed:', error);
      }
    }

    return {
      success: sdkAvailable && sdkWorking,
      sdkAvailable,
      legacyWorking,
      performanceComparison: Object.keys(performanceComparison).length > 0 ? performanceComparison : undefined
    };
  }
}

// Create singleton instance
export const migrationHelper = new SDKMigrationHelper();

// Convenience functions for common migration patterns
export const migrateShapeAPI = (shapeName: string, operation: string, params: any = {}) => {
  return migrationHelper.smartCall(`/api/shapes/${shapeName}/${operation}`, {
    method: 'GET',
    params,
    preferSDK: true
  });
};

export const migrateQuantumAPI = (operation: string, params: any = {}) => {
  return migrationHelper.smartCall(`/api/quantum/${operation}`, {
    method: 'POST',
    body: params,
    preferSDK: true
  });
};

export const migrateExportAPI = (operation: string, params: any = {}) => {
  return migrationHelper.smartCall(`/api/export/${operation}`, {
    method: 'POST',
    body: params,
    preferSDK: true
  });
};

