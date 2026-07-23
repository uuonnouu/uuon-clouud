/**
 * Request Optimizer - Batch request processing with configurable delays
 * Reduces API call frequency and improves performance
 */

interface BatchedRequest<T> {
  id: string;
  payload: T;
  resolve: (value: any) => void;
  reject: (error: any) => void;
  timestamp: number;
}

interface BatchConfig {
  maxBatchSize: number;
  maxWaitMs: number;
  minBatchInterval: number;
}

export class RequestOptimizer<T = any, R = any> {
  private static instances = new Map<string, RequestOptimizer>();
  private queue: BatchedRequest<T>[] = [];
  private batchTimer: ReturnType<typeof setTimeout> | null = null;
  private lastBatchTime = 0;
  private config: BatchConfig;
  private processor: (batch: T[]) => Promise<R[]>;
  
  constructor(
    processor: (batch: T[]) => Promise<R[]>,
    config: Partial<BatchConfig> = {}
  ) {
    this.processor = processor;
    this.config = {
      maxBatchSize: config.maxBatchSize ?? 10,
      maxWaitMs: config.maxWaitMs ?? 100,
      minBatchInterval: config.minBatchInterval ?? 50
    };
  }
  
  /**
   * Get or create a named optimizer instance
   */
  static getOrCreate<T, R>(
    name: string,
    processor: (batch: T[]) => Promise<R[]>,
    config?: Partial<BatchConfig>
  ): RequestOptimizer<T, R> {
    if (!this.instances.has(name)) {
      this.instances.set(name, new RequestOptimizer<T, R>(processor, config));
    }
    return this.instances.get(name) as RequestOptimizer<T, R>;
  }
  
  /**
   * Add a request to the batch queue
   */
  async add(payload: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const request: BatchedRequest<T> = {
        id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        payload,
        resolve,
        reject,
        timestamp: Date.now()
      };
      
      this.queue.push(request);
      
      // Check if batch is full
      if (this.queue.length >= this.config.maxBatchSize) {
        this.flush();
      } else {
        this.scheduleBatch();
      }
    });
  }
  
  /**
   * Schedule a batch processing
   */
  private scheduleBatch(): void {
    if (this.batchTimer) return;
    
    const timeSinceLastBatch = Date.now() - this.lastBatchTime;
    const delay = Math.max(
      this.config.minBatchInterval - timeSinceLastBatch,
      0
    );
    
    this.batchTimer = setTimeout(() => {
      this.flush();
    }, Math.min(delay + this.config.maxWaitMs, this.config.maxWaitMs));
  }
  
  /**
   * Process the current batch
   */
  async flush(): Promise<void> {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    
    if (this.queue.length === 0) return;
    
    const batch = this.queue.splice(0, this.config.maxBatchSize);
    this.lastBatchTime = Date.now();
    
    try {
      const payloads = batch.map(req => req.payload);
      const results = await this.processor(payloads);
      
      batch.forEach((request, index) => {
        if (results[index] !== undefined) {
          request.resolve(results[index]);
        } else {
          request.reject(new Error('No result for request'));
        }
      });
    } catch (error) {
      batch.forEach(request => request.reject(error));
    }
    
    // Process remaining items
    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }
  
  /**
   * Get queue statistics
   */
  getStats(): { queueSize: number; lastBatchTime: number } {
    return {
      queueSize: this.queue.length,
      lastBatchTime: this.lastBatchTime
    };
  }
  
  /**
   * Clear pending requests
   */
  clear(): void {
    if (this.batchTimer) {
      clearTimeout(this.batchTimer);
      this.batchTimer = null;
    }
    this.queue.forEach(req => req.reject(new Error('Queue cleared')));
    this.queue = [];
  }
}

/**
 * Create a debounced tracking optimizer
 */
export const trackingOptimizer = RequestOptimizer.getOrCreate<
  { event: string; data: any },
  void
>(
  'tracking',
  async (batch) => {
    // Batch tracking events - just log them for now
    if (batch.length > 0) {
      console.log(`📊 Batched ${batch.length} tracking events`);
    }
    return batch.map(() => undefined);
  },
  { maxBatchSize: 20, maxWaitMs: 2000, minBatchInterval: 500 }
);
