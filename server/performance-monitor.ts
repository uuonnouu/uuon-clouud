
import { Router, Request, Response } from 'express';
import { performance, PerformanceObserver } from 'perf_hooks';

const router = Router();

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  responseTime: number;
  timestamp: string;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
}

class PerformanceTracker {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 requests
  
  constructor() {
    // Set up performance observer
    const obs = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.startsWith('api-request-')) {
          // Performance entry processing
        }
      }
    });
    obs.observe({ entryTypes: ['measure'] });
  }
  
  addMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    // Cleanup more aggressively
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-Math.floor(this.maxMetrics * 0.8));
    }
  }
  
  getMetrics(limit = 100) {
    return this.metrics.slice(-limit);
  }
  
  getAverageResponseTime(endpoint?: string) {
    const filtered = endpoint 
      ? this.metrics.filter(m => m.endpoint === endpoint)
      : this.metrics;
    
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.responseTime, 0);
    return sum / filtered.length;
  }
  
  getSlowestEndpoints(limit = 10) {
    const endpointAvgs = new Map<string, { total: number; count: number }>();
    
    this.metrics.forEach(metric => {
      const key = `${metric.method} ${metric.endpoint}`;
      const current = endpointAvgs.get(key) || { total: 0, count: 0 };
      endpointAvgs.set(key, {
        total: current.total + metric.responseTime,
        count: current.count + 1
      });
    });
    
    return Array.from(endpointAvgs.entries())
      .map(([endpoint, data]) => ({
        endpoint,
        avgResponseTime: data.total / data.count,
        requestCount: data.count
      }))
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
      .slice(0, limit);
  }
}

const performanceTracker = new PerformanceTracker();

// Middleware to track performance
export const performanceMiddleware = (req: Request, res: Response, next: Function) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const responseTime = performance.now() - start;
    
    const metric: PerformanceMetrics = {
      endpoint: req.path,
      method: req.method,
      responseTime,
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      memoryUsage: process.memoryUsage()
    };
    
    performanceTracker.addMetric(metric);
  });
  
  next();
};

// Get performance metrics
router.get('/performance', (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 100;
  
  res.json({
    success: true,
    metrics: performanceTracker.getMetrics(limit),
    averageResponseTime: performanceTracker.getAverageResponseTime(),
    slowestEndpoints: performanceTracker.getSlowestEndpoints(),
    timestamp: new Date().toISOString()
  });
});

// Get performance statistics
router.get('/performance/stats', (req: Request, res: Response) => {
  const endpoint = req.query.endpoint as string;
  
  res.json({
    success: true,
    averageResponseTime: performanceTracker.getAverageResponseTime(endpoint),
    slowestEndpoints: performanceTracker.getSlowestEndpoints(),
    totalRequests: performanceTracker.getMetrics().length,
    timestamp: new Date().toISOString()
  });
});

export { router as performanceRoutes, performanceTracker };
