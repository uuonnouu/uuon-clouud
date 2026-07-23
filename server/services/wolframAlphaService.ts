import axios from 'axios';

interface WolframQueryResult {
  success: boolean;
  data?: any;
  plaintext?: string;
  image?: string;
  error?: string;
  cached?: boolean;
  quantumVariation?: number;
  blendRatio?: string;
  [key: string]: any;
}

class WolframAlphaService {
  private apiKey: string;
  private cache: Map<string, { result: WolframQueryResult; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 3600000; // 1 hour

  constructor() {
    this.apiKey = process.env.WOLFRAM_ALPHA_APP_ID || '';
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  async query(input: string): Promise<WolframQueryResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Wolfram Alpha API key not configured'
      };
    }

    // Check cache first
    const cached = this.getFromCache(input);
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      // Use Simple API for faster responses
      const url = `https://api.wolframalpha.com/v1/result`;
      const response = await axios.get(url, {
        params: {
          appid: this.apiKey,
          i: input
        },
        timeout: 10000 // 10 second timeout
      });

      const result: WolframQueryResult = {
        success: true,
        plaintext: response.data
      };

      this.saveToCache(input, result);
      return result;
    } catch (error: any) {
      console.error('Wolfram Alpha API error:', error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async queryFull(input: string): Promise<WolframQueryResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        error: 'Wolfram Alpha API key not configured'
      };
    }

    const cached = this.getFromCache(input);
    if (cached) {
      return { ...cached, cached: true };
    }

    try {
      // Use Full Results API for detailed mathematical analysis
      const url = `https://api.wolframalpha.com/v2/query`;
      const response = await axios.get(url, {
        params: {
          appid: this.apiKey,
          input: input,
          format: 'plaintext,image',
          output: 'json'
        },
        timeout: 15000
      });

      const result: WolframQueryResult = {
        success: true,
        data: response.data
      };

      this.saveToCache(input, result);
      return result;
    } catch (error: any) {
      console.error('Wolfram Alpha Full API error:', error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  private getFromCache(key: string): WolframQueryResult | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const age = Date.now() - cached.timestamp;
    if (age > this.CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }

    return cached.result;
  }

  private saveToCache(key: string, result: WolframQueryResult): void {
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const wolframAlphaService = new WolframAlphaService();
