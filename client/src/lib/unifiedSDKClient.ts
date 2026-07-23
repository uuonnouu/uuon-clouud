/**
 * UNIFIED SDK CLIENT
 * Client-side integration for the unified SDK architecture
 * Replaces multiple API calls with single SDK interface
 */

export interface SDKResponse<T = any> {
  success: boolean;
  module: string;
  operation: string;
  result: T;
  metadata: {
    executionTime: number;
    cacheHit: boolean;
    securityLevel: string;
    timestamp: string;
  };
  error?: string;
}

export interface SDKRequestOptions {
  timeout?: number;
  retries?: number;
  caching?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export class UnifiedSDKClient {
  private baseUrl: string;
  private defaultOptions: SDKRequestOptions;
  private cache = new Map<string, any>();

  constructor(baseUrl: string = '/api/sdk', options: Partial<SDKRequestOptions> = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      timeout: 30000,
      retries: 3,
      caching: true,
      priority: 'normal',
      ...options
    };
  }

  // Generic method to call any SDK module operation
  async call<T = any>(
    module: string, 
    operation: string, 
    parameters: any = {}, 
    options: Partial<SDKRequestOptions> = {}
  ): Promise<SDKResponse<T>> {
    const mergedOptions = { ...this.defaultOptions, ...options };
    const cacheKey = `${module}_${operation}_${JSON.stringify(parameters)}`;

    // Check cache first
    if (mergedOptions.caching && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      return {
        ...cached,
        metadata: {
          ...cached.metadata,
          cacheHit: true
        }
      };
    }

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < mergedOptions.retries!; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/unified/${module}/${operation}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            parameters,
            options: mergedOptions
          }),
          signal: AbortSignal.timeout(mergedOptions.timeout!)
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result: SDKResponse<T> = await response.json();
        
        // Cache successful results
        if (result.success && mergedOptions.caching) {
          this.cache.set(cacheKey, result);
          
          // Auto-expire cache after 5 minutes
          setTimeout(() => {
            this.cache.delete(cacheKey);
          }, 5 * 60 * 1000);
        }

        return result;

      } catch (error) {
        lastError = error as Error;
        console.warn(`SDK call attempt ${attempt + 1} failed:`, error);
        
        // Wait before retrying (exponential backoff)
        if (attempt < mergedOptions.retries! - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    // If all retries failed, return error response
    return {
      success: false,
      module,
      operation,
      result: null as unknown as T,
      metadata: {
        executionTime: 0,
        cacheHit: false,
        securityLevel: 'unknown',
        timestamp: new Date().toISOString()
      },
      error: lastError?.message || 'All retry attempts failed'
    };
  }

  // Convenience methods for each module
  
  // Shape module operations
  async getShape(shapeId: string, options?: Partial<SDKRequestOptions>) {
    return this.call('shapes', 'get-shape', { shapeId }, options);
  }

  async listShapes(category?: string, limit?: number, options?: Partial<SDKRequestOptions>) {
    return this.call('shapes', 'list-shapes', { category, limit }, options);
  }

  async computeSurface(shapeId: string, parameters: any, resolution?: any, options?: Partial<SDKRequestOptions>) {
    return this.call('shapes', 'compute-surface', { shapeId, parameters, resolution }, options);
  }

  async getShapeDefaults(shapeId: string, options?: Partial<SDKRequestOptions>) {
    return this.call('shapes', 'get-defaults', { shapeId }, options);
  }

  async validateParameters(shapeId: string, parameters: any, options?: Partial<SDKRequestOptions>) {
    return this.call('shapes', 'validate-parameters', { shapeId, parameters }, options);
  }

  // Quantum module operations
  async createQuantumCircuit(qubits: number, gates: any[], options?: Partial<SDKRequestOptions>) {
    return this.call('quantum', 'quantum-circuit', { qubits, gates }, options);
  }

  async runQuantumAlgorithm(algorithm: string, parameters: any, options?: Partial<SDKRequestOptions>) {
    return this.call('quantum', 'run-algorithm', { algorithm, parameters }, options);
  }

  async getQuantumBackends(options?: Partial<SDKRequestOptions>) {
    return this.call('quantum', 'get-backends', {}, options);
  }

  // Physics module operations
  async simulatePhysics(simulation: any, options?: Partial<SDKRequestOptions>) {
    return this.call('physics', 'simulate-physics', simulation, options);
  }

  async calculateField(fieldType: string, parameters: any, options?: Partial<SDKRequestOptions>) {
    return this.call('physics', 'field-calculation', { fieldType, parameters }, options);
  }

  // Biology module operations
  async simulateProteinFolding(protein: any, options?: Partial<SDKRequestOptions>) {
    return this.call('biology', 'protein-folding', protein, options);
  }

  async analyzeDNA(sequence: string, options?: Partial<SDKRequestOptions>) {
    return this.call('biology', 'dna-analysis', { sequence }, options);
  }

  // Mathematics module operations
  async verifyProof(proof: any, options?: Partial<SDKRequestOptions>) {
    return this.call('mathematics', 'proof-verification', proof, options);
  }

  async solveEquation(equation: string, variables: any, options?: Partial<SDKRequestOptions>) {
    return this.call('mathematics', 'equation-solving', { equation, variables }, options);
  }

  // Export module operations
  async exportShape(shapeId: string, format: string, quality: string, options?: Partial<SDKRequestOptions>) {
    return this.call('export', 'export-shape', { shapeId, format, quality }, options);
  }

  async generateExportToken(shapeType: string, parameters: any, options?: Partial<SDKRequestOptions>) {
    return this.call('export', 'generate-token', { shapeType, parameters }, options);
  }

  // AI/ML module operations
  async recognizeShape(imageData: any, options?: Partial<SDKRequestOptions>) {
    return this.call('aiml', 'shape-recognition', { imageData }, options);
  }

  async optimizeParameters(shapeId: string, currentParams: any, target: any, options?: Partial<SDKRequestOptions>) {
    return this.call('aiml', 'parameter-optimization', { shapeId, currentParams, target }, options);
  }

  // Core module operations
  async validateData(data: any, operation: string, options?: Partial<SDKRequestOptions>) {
    return this.call('core', 'validate', { data, operation }, options);
  }

  async manageCache(action: string, key?: string, value?: any, options?: Partial<SDKRequestOptions>) {
    return this.call('core', 'cache', { action, key, value }, options);
  }

  // ============================================================================
  // LEGACY API FACADE - Provides SDK interface for legacy API endpoints
  // These methods route through the SDK but call legacy endpoints during transition
  // ============================================================================

  // Queens Bridge operations
  async queensBridgeHealth(): Promise<any> {
    return this.legacyCall('/api/queens-bridge/health', 'GET');
  }

  async queensBridgeSubmit(data: any): Promise<any> {
    return this.legacyCall('/api/queens-bridge/submit', 'POST', data);
  }

  async queensBridgeStatus(jobId: string): Promise<any> {
    return this.legacyCall(`/api/queens-bridge/status/${jobId}`, 'GET');
  }

  async queensBridgeOptimize(data: any): Promise<any> {
    return this.legacyCall('/api/queens-bridge/optimize', 'POST', data);
  }

  async queensBridgeQaoa(data: any): Promise<any> {
    return this.legacyCall('/api/queens-bridge/qaoa', 'POST', data);
  }

  // Hypercomputation operations
  async hypercomputationOracle(data: any): Promise<any> {
    return this.legacyCall('/api/hypercomputation/oracle', 'POST', data);
  }

  async hypercomputationZeno(data: any): Promise<any> {
    return this.legacyCall('/api/hypercomputation/zeno', 'POST', data);
  }

  async hypercomputationInfiniteTime(data: any): Promise<any> {
    return this.legacyCall('/api/hypercomputation/infinite-time', 'POST', data);
  }

  async hypercomputationMalamentHogarth(data: any): Promise<any> {
    return this.legacyCall('/api/hypercomputation/malament-hogarth', 'POST', data);
  }

  // Quantum formulas operations
  async getQuantumFormulas(): Promise<any> {
    return this.legacyCall('/api/quantum-formulas/formulas', 'GET');
  }

  async blochSphere(data: any): Promise<any> {
    return this.legacyCall('/api/quantum-formulas/bloch-sphere', 'POST', data);
  }

  async groverAlgorithm(data: any): Promise<any> {
    return this.legacyCall('/api/quantum-formulas/grover-algorithm', 'POST', data);
  }

  async errorCorrection(data: any): Promise<any> {
    return this.legacyCall('/api/quantum-formulas/error-correction', 'POST', data);
  }

  async quantumSensing(data: any): Promise<any> {
    return this.legacyCall('/api/quantum-formulas/sensing', 'POST', data);
  }

  // Token operations
  async mintToken(data: any): Promise<any> {
    return this.legacyCall('/api/tokens/mint', 'POST', data);
  }

  async getTokenStats(): Promise<any> {
    return this.legacyCall('/api/tokens/stats', 'GET');
  }

  // NFT operations
  async mintNFT(data: any): Promise<any> {
    return this.legacyCall('/api/nft/mint', 'POST', data);
  }

  // Sitemap operations
  async getSitemapHierarchy(): Promise<any> {
    return this.legacyCall('/api/sitemap-hierarchy', 'GET');
  }

  // Fused shapes operations
  async saveFusedShape(data: any): Promise<any> {
    return this.legacyCall('/api/uuon-fused-shapes', 'POST', data);
  }

  async getFusedShapes(): Promise<any> {
    return this.legacyCall('/api/uuon-fused-shapes', 'GET');
  }

  // Autonomous contract operations
  async getContractStatus(): Promise<any> {
    return this.legacyCall('/api/autonomous/uuon-contract-status', 'GET');
  }

  async generateContractToken(data: any): Promise<any> {
    return this.legacyCall('/api/autonomous/uuon-generate-token', 'POST', data);
  }

  async executeContract(data: any): Promise<any> {
    return this.legacyCall('/api/autonomous/uuon-execute-contract', 'POST', data);
  }

  // Proof testing operations
  async runProofTests(data: any): Promise<any> {
    return this.legacyCall('/api/uuon-proof/run-proof-tests', 'POST', data);
  }

  async generateCertificate(data: any): Promise<any> {
    return this.legacyCall('/api/uuon-proof/generate-certificate', 'POST', data);
  }

  // Symbol operations
  async getSymbols(): Promise<any> {
    return this.legacyCall('/api/uuon-symbols', 'GET');
  }

  async getSymbolCategories(): Promise<any> {
    return this.legacyCall('/api/uuon-symbol/categories', 'GET');
  }

  // PayPal operations
  async createPayPalOrder(data: any): Promise<any> {
    return this.legacyCall('/api/paypal/create-order', 'POST', data);
  }

  async checkPayPalOrder(orderId: string): Promise<any> {
    return this.legacyCall(`/api/paypal/check-order/${orderId}`, 'GET');
  }

  // Formula mapping operations
  async analyzeFormula(formulaId: string, data: any): Promise<any> {
    return this.legacyCall(`/api/formula-mapping/analyze/${formulaId}`, 'POST', data);
  }

  // Shape URL operations
  async getShapeUrls(): Promise<any> {
    return this.legacyCall('/api/shape-urls', 'GET');
  }

  // Attached assets operations
  async getAttachedAssets(): Promise<any> {
    return this.legacyCall('/api/ml-data/attached-assets', 'GET');
  }

  // Quantum computing panel operations
  async runQuantumComputation(data: any): Promise<any> {
    return this.legacyCall('/api/quantum/compute', 'POST', data);
  }

  async getQuantumAlgorithms(): Promise<any> {
    return this.legacyCall('/api/quantum/algorithms', 'GET');
  }

  // PR Testing operations
  async runPRTest(data: any): Promise<any> {
    return this.legacyCall('/api/pr-testing/run', 'POST', data);
  }

  // API Connectivity operations
  async checkApiConnectivity(): Promise<any> {
    return this.legacyCall('/api/connectivity/check', 'GET');
  }

  // NASA OSDR operations  
  async getNasaOsdrData(query: any): Promise<any> {
    return this.legacyCall('/api/nasa-osdr/search', 'POST', query);
  }

  // MetaMask operations
  async verifyWalletSignature(data: any): Promise<any> {
    return this.legacyCall('/api/wallet/verify', 'POST', data);
  }

  // Biblical analysis operations
  async analyzeBiblicalText(data: any): Promise<any> {
    return this.legacyCall('/api/biblical-analysis/analyze', 'POST', data);
  }

  // Changelog operations
  async getChangelog(): Promise<any> {
    return this.legacyCall('/api/changelog', 'GET');
  }

  // Storage optimization operations
  async optimizeStorage(data: any): Promise<any> {
    return this.legacyCall('/api/storage/optimize', 'POST', data);
  }

  // Media export operations
  async exportMedia(data: any): Promise<any> {
    return this.legacyCall('/api/media/export', 'POST', data);
  }

  // Texture upload operations
  async uploadTexture(data: any): Promise<any> {
    return this.legacyCall('/api/textures/upload', 'POST', data);
  }

  // Universal symbol operations
  async renderUniversalSymbol(data: any): Promise<any> {
    return this.legacyCall('/api/symbols/render', 'POST', data);
  }

  // Verification operations
  async verifyContent(data: any): Promise<any> {
    return this.legacyCall('/api/verify', 'POST', data);
  }

  // Live token tracker operations
  async getLiveTokenValue(): Promise<any> {
    return this.legacyCall('/api/tokens/live-value', 'GET');
  }

  // Export password operations
  async validateExportPassword(data: any): Promise<any> {
    return this.legacyCall('/api/export/validate-password', 'POST', data);
  }

  // Versatile export operations
  async versatileExport(data: any): Promise<any> {
    return this.legacyCall('/api/export/versatile', 'POST', data);
  }

  // System performance operations
  async getSystemPerformanceStatus(): Promise<any> {
    return this.legacyCall('/api/system-performance/status', 'GET');
  }

  async getSystemPerformanceMetrics(): Promise<any> {
    return this.legacyCall('/api/system-performance/metrics', 'GET');
  }

  async runSystemOptimization(): Promise<any> {
    return this.legacyCall('/api/system-performance/optimize', 'POST', {});
  }

  async getHealthSummary(): Promise<any> {
    return this.legacyCall('/api/system-performance/health-summary', 'GET');
  }

  // ============================================================================
  // LEGACY CALL HELPER - Wraps legacy API calls with SDK-style response
  // Made public so components can use it for endpoints not yet in SDK
  // ============================================================================
  async legacyCall(endpoint: string, method: string, body?: any): Promise<any> {
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(endpoint, options);
      const data = await response.json();
      
      return {
        success: response.ok,
        data,
        metadata: {
          endpoint,
          method,
          timestamp: new Date().toISOString(),
          legacyApi: true
        }
      };
    } catch (error: any) {
      console.error(`Legacy API call failed: ${endpoint}`, error);
      return {
        success: false,
        error: error?.message || 'Unknown error',
        metadata: {
          endpoint,
          method,
          timestamp: new Date().toISOString(),
          legacyApi: true
        }
      };
    }
  }

  // Utility methods
  async getHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error: any) {
      console.error('Health check failed:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  async discoverCapabilities(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/discover`);
      return await response.json();
    } catch (error: any) {
      console.error('Discovery failed:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  // Batch operations - call multiple operations in sequence
  async batch(operations: Array<{
    module: string;
    operation: string;
    parameters: any;
    options?: Partial<SDKRequestOptions>;
  }>): Promise<SDKResponse[]> {
    const results = [];
    
    for (const op of operations) {
      const result = await this.call(op.module, op.operation, op.parameters, op.options);
      results.push(result);
      
      // If any operation fails and has high priority, stop batch
      if (!result.success && op.options?.priority === 'high') {
        console.warn('High-priority operation failed, stopping batch execution');
        break;
      }
    }
    
    return results;
  }

  // Clear client-side cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Create singleton instance
export const sdkClient = new UnifiedSDKClient();

// Export convenience functions for direct use
export const getShape = (shapeId: string, options?: Partial<SDKRequestOptions>) => 
  sdkClient.getShape(shapeId, options);

export const computeSurface = (shapeId: string, parameters: any, resolution?: any, options?: Partial<SDKRequestOptions>) => 
  sdkClient.computeSurface(shapeId, parameters, resolution, options);

export const runQuantumAlgorithm = (algorithm: string, parameters: any, options?: Partial<SDKRequestOptions>) => 
  sdkClient.runQuantumAlgorithm(algorithm, parameters, options);

export const simulatePhysics = (simulation: any, options?: Partial<SDKRequestOptions>) => 
  sdkClient.simulatePhysics(simulation, options);

export const exportShape = (shapeId: string, format: string, quality: string, options?: Partial<SDKRequestOptions>) => 
  sdkClient.exportShape(shapeId, format, quality, options);

