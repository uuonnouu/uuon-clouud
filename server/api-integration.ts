/**
 * API Integration: Connect Clouud to your custom APIs and data sources
 * 
 * This layer:
 * 1. Fetches data from your APIs in real-time
 * 2. Normalizes responses to lattice format
 * 3. Caches results for performance
 * 4. Tracks API usage and latency
 * 5. Creates verifiable tool records
 */

import crypto from "crypto";

/**
 * API Configuration
 */
export interface APIConfig {
  name: string;
  baseUrl: string;
  endpoints: Array<{
    path: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    description: string;
    params?: Record<string, string>;
    requiresAuth?: boolean;
  }>;
  auth?: {
    type: "bearer" | "apikey" | "basic" | "none";
    token?: string;
    header?: string;
  };
  cacheTTL?: number; // seconds
}

/**
 * API Response Wrapper
 */
export interface APIResponse {
  endpoint: string;
  method: string;
  status: number;
  data: Record<string, any>;
  latticeMapping: Record<string, number>;
  executionTime: number;
  hash: string;
  timestamp: string;
}

/**
 * API Cache
 */
interface CacheEntry {
  data: APIResponse;
  expiresAt: number;
}

export class APIIntegrationLayer {
  private configs: Map<string, APIConfig> = new Map();
  private cache: Map<string, CacheEntry> = new Map();
  private usage: Map<string, { calls: number; totalTime: number; errors: number }> = new Map();

  /**
   * Register API configuration
   */
  registerAPI(config: APIConfig): void {
    this.configs.set(config.name, config);
    this.usage.set(config.name, { calls: 0, totalTime: 0, errors: 0 });
  }

  /**
   * Call API endpoint
   */
  async callAPI(apiName: string, endpoint: string, params?: Record<string, any>): Promise<APIResponse> {
    const config = this.configs.get(apiName);
    if (!config) {
      throw new Error(`API ${apiName} not registered`);
    }

    // Check cache
    const cacheKey = `${apiName}:${endpoint}:${JSON.stringify(params || {})}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const startTime = Date.now();
    const url = new URL(endpoint, config.baseUrl);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, String(value));
      }
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // Add authentication
      if (config.auth?.type === "bearer" && config.auth.token) {
        headers["Authorization"] = `Bearer ${config.auth.token}`;
      } else if (config.auth?.type === "apikey" && config.auth.token) {
        headers[config.auth.header || "X-API-Key"] = config.auth.token;
      }

      const response = await fetch(url.toString(), {
        method: endpoint.split(":")[0] || "GET",
        headers,
        timeout: 30000,
      });

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      // Map response to lattice
      const latticeMapping = this.mapResponseToLattice(data);

      const result: APIResponse = {
        endpoint,
        method: "GET",
        status: response.status,
        data,
        latticeMapping,
        executionTime,
        hash: crypto
          .createHash("sha256")
          .update(JSON.stringify(data))
          .digest("hex")
          .slice(0, 16),
        timestamp: new Date().toISOString(),
      };

      // Cache result
      if (config.cacheTTL) {
        this.cache.set(cacheKey, {
          data: result,
          expiresAt: Date.now() + config.cacheTTL * 1000,
        });
      }

      // Track usage
      const stats = this.usage.get(apiName)!;
      stats.calls += 1;
      stats.totalTime += executionTime;

      return result;
    } catch (err) {
      const stats = this.usage.get(apiName)!;
      stats.errors += 1;

      throw new Error(`API call failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  /**
   * Map API response to lattice positions
   */
  private mapResponseToLattice(data: Record<string, any>): Record<string, number> {
    const LATTICE_POINTS = 33;
    const mapping: Record<string, number> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "number") {
        mapping[key] = Math.max(1, Math.min(33, Math.round((Math.abs(value) / 100) * LATTICE_POINTS)));
      } else if (typeof value === "string") {
        mapping[key] = 1 + (value.length % LATTICE_POINTS);
      } else if (typeof value === "boolean") {
        mapping[key] = value ? 33 : 1;
      } else if (Array.isArray(value)) {
        mapping[key] = Math.min(value.length, LATTICE_POINTS);
      }
    }

    return mapping;
  }

  /**
   * Get API usage statistics
   */
  getUsage(apiName: string): { calls: number; avgTime: number; errorRate: number } | null {
    const stats = this.usage.get(apiName);
    if (!stats) return null;

    return {
      calls: stats.calls,
      avgTime: stats.calls > 0 ? stats.totalTime / stats.calls : 0,
      errorRate: stats.calls > 0 ? stats.errors / stats.calls : 0,
    };
  }

  /**
   * Clear cache
   */
  clearCache(apiName?: string): void {
    if (apiName) {
      const keysToDelete = Array.from(this.cache.keys()).filter((k) => k.startsWith(`${apiName}:`));
      for (const key of keysToDelete) {
        this.cache.delete(key);
      }
    } else {
      this.cache.clear();
    }
  }
}

/**
 * Pre-configured common data sources
 */
export const commonDataSources: Record<string, APIConfig> = {
  openweather: {
    name: "OpenWeather",
    baseUrl: "https://api.openweathermap.org/data/2.5",
    endpoints: [
      {
        path: "weather",
        method: "GET",
        description: "Get current weather",
        params: { q: "city", appid: "api_key" },
      },
      {
        path: "forecast",
        method: "GET",
        description: "Get weather forecast",
        params: { q: "city", appid: "api_key" },
      },
    ],
    auth: { type: "apikey", header: "appid" },
  },

  github: {
    name: "GitHub",
    baseUrl: "https://api.github.com",
    endpoints: [
      {
        path: "repos/{owner}/{repo}",
        method: "GET",
        description: "Get repository info",
      },
      {
        path: "users/{username}",
        method: "GET",
        description: "Get user profile",
      },
      {
        path: "repos/{owner}/{repo}/issues",
        method: "GET",
        description: "List issues",
      },
    ],
    auth: { type: "bearer" },
  },

  crunchbase: {
    name: "Crunchbase",
    baseUrl: "https://api.crunchbase.com/v4",
    endpoints: [
      {
        path: "entities/companies",
        method: "POST",
        description: "Search companies",
      },
      {
        path: "entities/people",
        method: "POST",
        description: "Search people",
      },
    ],
    auth: { type: "bearer" },
  },

  nytimes: {
    name: "New York Times",
    baseUrl: "https://api.nytimes.com/svc",
    endpoints: [
      {
        path: "search/v2/articlesearch.json",
        method: "GET",
        description: "Search articles",
        params: { q: "query", "api-key": "key" },
      },
    ],
  },

  stripe: {
    name: "Stripe",
    baseUrl: "https://api.stripe.com/v1",
    endpoints: [
      {
        path: "charges",
        method: "GET",
        description: "List charges",
      },
      {
        path: "customers",
        method: "GET",
        description: "List customers",
      },
      {
        path: "invoices",
        method: "GET",
        description: "List invoices",
      },
    ],
    auth: { type: "bearer" },
  },

  uuon_foundation: {
    name: "UUON Foundation",
    baseUrl: "http://localhost:5000",
    endpoints: [
      {
        path: "api/chat",
        method: "POST",
        description: "Send message to Clouud",
      },
      {
        path: "api/self-assessment",
        method: "GET",
        description: "Get self-assessment report",
      },
      {
        path: "api/lattice",
        method: "GET",
        description: "Query lattice values",
      },
    ],
  },
};

/**
 * Database schema for API integration
 */
export const apiIntegrationSchema = {
  api_calls: `
    CREATE TABLE IF NOT EXISTS api_calls (
      id SERIAL PRIMARY KEY,
      api_name VARCHAR(255) NOT NULL,
      endpoint VARCHAR(255) NOT NULL,
      method VARCHAR(10) NOT NULL,
      status INTEGER,
      response_data JSONB,
      lattice_mapping JSONB,
      execution_time INTEGER,
      response_hash VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  api_usage: `
    CREATE TABLE IF NOT EXISTS api_usage (
      api_name VARCHAR(255) PRIMARY KEY,
      total_calls INTEGER DEFAULT 0,
      total_time BIGINT DEFAULT 0,
      error_count INTEGER DEFAULT 0,
      avg_time NUMERIC(10, 2),
      last_called TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

export default {
  APIIntegrationLayer,
  commonDataSources,
};
