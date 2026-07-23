
/**
 * OBSERVABILITY AGENT
 * Tracks module usage, failures, and degraded behavior
 * Provides debug logs, validation reports, and health checks
 */

export interface MetricEvent {
  timestamp: number;
  module: string;
  operation: string;
  status: 'success' | 'error' | 'warning';
  duration: number;
  details?: any;
  userId?: string;
  sessionId?: string;
}

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  details: any;
  threshold?: {
    warning: number;
    critical: number;
  };
}

export interface ValidationRule {
  name: string;
  module: string;
  condition: (event: MetricEvent) => boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
}

export class ObservabilityAgent {
  private metrics: MetricEvent[] = [];
  private healthChecks: Map<string, HealthCheck> = new Map();
  private validationRules: Map<string, ValidationRule> = new Map();
  private alerts: Array<{ timestamp: number; rule: string; event: MetricEvent }> = [];
  private debugMode: boolean = process.env.NODE_ENV === 'development';

  constructor() {
    this.initializeHealthChecks();
    this.initializeValidationRules();
    this.startPeriodicHealthChecks();
  }

  private initializeHealthChecks(): void {
    // Module availability checks
    this.addHealthCheck('sdk-modules-available', {
      name: 'SDK Modules Available',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { modules: [] },
      threshold: { warning: 0.9, critical: 0.8 }
    });

    // Response time check
    this.addHealthCheck('response-time', {
      name: 'Average Response Time',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { averageMs: 0 },
      threshold: { warning: 1000, critical: 3000 }
    });

    // Error rate check
    this.addHealthCheck('error-rate', {
      name: 'Error Rate',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { percentage: 0 },
      threshold: { warning: 5, critical: 15 }
    });

    // Memory usage check
    this.addHealthCheck('memory-usage', {
      name: 'Memory Usage',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { usedMB: 0, totalMB: 0 },
      threshold: { warning: 500, critical: 800 }
    });

    // Database connectivity
    this.addHealthCheck('database-connectivity', {
      name: 'Database Connectivity',
      status: 'healthy',
      lastCheck: Date.now(),
      details: { connected: true, latencyMs: 0 }
    });
  }

  private initializeValidationRules(): void {
    // High error rate validation
    this.addValidationRule('high-error-rate', {
      name: 'High Error Rate',
      module: 'all',
      condition: (event) => event.status === 'error',
      severity: 'warning',
      message: 'High error rate detected'
    });

    // Slow response validation
    this.addValidationRule('slow-response', {
      name: 'Slow Response',
      module: 'all',
      condition: (event) => event.duration > 5000, // 5 seconds
      severity: 'warning',
      message: 'Operation took longer than expected'
    });

    // Module-specific validations
    this.addValidationRule('shape-computation-failure', {
      name: 'Shape Computation Failure',
      module: 'shapes',
      condition: (event) => event.operation === 'compute-surface' && event.status === 'error',
      severity: 'error',
      message: 'Shape computation failed'
    });

    this.addValidationRule('quantum-circuit-timeout', {
      name: 'Quantum Circuit Timeout',
      module: 'quantum',
      condition: (event) => event.operation === 'quantum-circuit' && event.duration > 10000,
      severity: 'critical',
      message: 'Quantum circuit operation timed out'
    });

    this.addValidationRule('export-size-limit', {
      name: 'Export Size Limit Exceeded',
      module: 'export',
      condition: (event) => event.details?.fileSize > 50 * 1024 * 1024, // 50MB
      severity: 'warning',
      message: 'Export file size exceeds recommended limit'
    });
  }

  // Metric Collection
  recordMetric(event: Omit<MetricEvent, 'timestamp'>): void {
    const fullEvent: MetricEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.metrics.push(fullEvent);

    // Apply validation rules
    this.validateEvent(fullEvent);

    // Debug logging
    if (this.debugMode) {
      this.logDebug(fullEvent);
    }

    // Cleanup old metrics (keep last 10,000)
    if (this.metrics.length > 10000) {
      this.metrics = this.metrics.slice(-10000);
    }
  }

  // Health Monitoring
  addHealthCheck(name: string, check: HealthCheck): void {
    this.healthChecks.set(name, check);
  }

  private async runHealthCheck(name: string): Promise<void> {
    const check = this.healthChecks.get(name);
    if (!check) return;

    try {
      const result = await this.executeHealthCheck(name);
      check.status = result.status;
      check.details = result.details;
      check.lastCheck = Date.now();

      this.healthChecks.set(name, check);

      if (result.status !== 'healthy') {
        console.warn(`⚠️ Health check '${name}' status: ${result.status}`, result.details);
      }

    } catch (error: any) {
      check.status = 'unhealthy';
      check.details = { error: error.message };
      check.lastCheck = Date.now();
      console.error(`❌ Health check '${name}' failed:`, error);
    }
  }

  private async executeHealthCheck(name: string): Promise<{ status: HealthCheck['status']; details: any }> {
    switch (name) {
      case 'sdk-modules-available':
        return this.checkModuleAvailability();
      
      case 'response-time':
        return this.checkResponseTime();
      
      case 'error-rate':
        return this.checkErrorRate();
      
      case 'memory-usage':
        return this.checkMemoryUsage();
      
      case 'database-connectivity':
        return this.checkDatabaseConnectivity();
      
      default:
        return { status: 'healthy', details: {} };
    }
  }

  // Specific Health Check Implementations
  private async checkModuleAvailability(): Promise<{ status: HealthCheck['status']; details: any }> {
    const availableModules = ['core', 'shapes', 'quantum', 'physics', 'biology', 'mathematics', 'export', 'aiml'];
    const expectedModules = ['core', 'shapes', 'quantum', 'physics', 'biology', 'mathematics', 'export', 'aiml'];
    
    const availability = availableModules.length / expectedModules.length;
    
    return {
      status: availability >= 0.9 ? 'healthy' : availability >= 0.8 ? 'degraded' : 'unhealthy',
      details: {
        available: availableModules,
        expected: expectedModules,
        availability: Math.round(availability * 100)
      }
    };
  }

  private async checkResponseTime(): Promise<{ status: HealthCheck['status']; details: any }> {
    const recentMetrics = this.metrics.slice(-100); // Last 100 operations
    const averageDuration = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.duration, 0) / recentMetrics.length 
      : 0;

    return {
      status: averageDuration < 1000 ? 'healthy' : averageDuration < 3000 ? 'degraded' : 'unhealthy',
      details: {
        averageMs: Math.round(averageDuration),
        sampleSize: recentMetrics.length
      }
    };
  }

  private async checkErrorRate(): Promise<{ status: HealthCheck['status']; details: any }> {
    const recentMetrics = this.metrics.slice(-100);
    const errorCount = recentMetrics.filter(m => m.status === 'error').length;
    const errorRate = recentMetrics.length > 0 ? (errorCount / recentMetrics.length) * 100 : 0;

    return {
      status: errorRate < 5 ? 'healthy' : errorRate < 15 ? 'degraded' : 'unhealthy',
      details: {
        percentage: Math.round(errorRate * 100) / 100,
        errorCount,
        totalCount: recentMetrics.length
      }
    };
  }

  private async checkMemoryUsage(): Promise<{ status: HealthCheck['status']; details: any }> {
    const memoryUsage = process.memoryUsage();
    const usedMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    const totalMB = Math.round(memoryUsage.heapTotal / 1024 / 1024);

    return {
      status: usedMB < 500 ? 'healthy' : usedMB < 800 ? 'degraded' : 'unhealthy',
      details: { usedMB, totalMB, rss: Math.round(memoryUsage.rss / 1024 / 1024) }
    };
  }

  private async checkDatabaseConnectivity(): Promise<{ status: HealthCheck['status']; details: any }> {
    try {
      const startTime = Date.now();
      // Database ping would go here
      const latency = Date.now() - startTime;
      
      return {
        status: 'healthy',
        details: { connected: true, latencyMs: latency }
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        details: { connected: false, error: error.message }
      };
    }
  }

  // Validation
  addValidationRule(name: string, rule: ValidationRule): void {
    this.validationRules.set(name, rule);
  }

  private validateEvent(event: MetricEvent): void {
    for (const [ruleName, rule] of this.validationRules) {
      if ((rule.module === 'all' || rule.module === event.module) && rule.condition(event)) {
        this.alerts.push({
          timestamp: Date.now(),
          rule: ruleName,
          event
        });

        this.logAlert(ruleName, rule, event);
      }
    }

    // Cleanup old alerts (keep last 1,000)
    if (this.alerts.length > 1000) {
      this.alerts = this.alerts.slice(-1000);
    }
  }

  // Logging and Debug
  private logDebug(event: MetricEvent): void {
    const icon = event.status === 'success' ? '✅' : event.status === 'error' ? '❌' : '⚠️';
    console.log(`${icon} [${event.module}/${event.operation}] ${event.duration}ms - ${event.status}`);
  }

  private logAlert(ruleName: string, rule: ValidationRule, event: MetricEvent): void {
    const severityIcon = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      critical: '🚨'
    };

    console.log(`${severityIcon[rule.severity]} ALERT [${ruleName}]: ${rule.message}`, {
      module: event.module,
      operation: event.operation,
      duration: event.duration,
      details: event.details
    });
  }

  // Periodic Tasks
  private startPeriodicHealthChecks(): void {
    // Run health checks every 5 minutes
    setInterval(async () => {
      for (const [name] of this.healthChecks) {
        await this.runHealthCheck(name);
      }
    }, 5 * 60 * 1000);

    console.log('🔍 Observability agent started - health checks every 5 minutes');
  }

  // Reporting
  getHealthReport(): any {
    const checks = Array.from(this.healthChecks.values());
    
    return {
      overall: this.calculateOverallHealth(),
      checks: checks.map(check => ({
        name: check.name,
        status: check.status,
        lastCheck: new Date(check.lastCheck).toISOString(),
        details: check.details
      })),
      summary: {
        healthy: checks.filter(c => c.status === 'healthy').length,
        degraded: checks.filter(c => c.status === 'degraded').length,
        unhealthy: checks.filter(c => c.status === 'unhealthy').length
      }
    };
  }

  getMetricsReport(timeframe: number = 24 * 60 * 60 * 1000): any { // Default: 24 hours
    const cutoff = Date.now() - timeframe;
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff);

    const byModule = recentMetrics.reduce((acc: any, m) => {
      if (!acc[m.module]) {
        acc[m.module] = { total: 0, success: 0, error: 0, warning: 0, avgDuration: 0 };
      }
      acc[m.module].total++;
      acc[m.module][m.status]++;
      return acc;
    }, {});

    // Calculate average durations
    Object.keys(byModule).forEach(module => {
      const moduleMetrics = recentMetrics.filter(m => m.module === module);
      byModule[module].avgDuration = Math.round(
        moduleMetrics.reduce((sum, m) => sum + m.duration, 0) / moduleMetrics.length
      );
    });

    return {
      timeframe: `${timeframe / (60 * 60 * 1000)} hours`,
      totalOperations: recentMetrics.length,
      byModule,
      topOperations: this.getTopOperations(recentMetrics),
      slowestOperations: this.getSlowestOperations(recentMetrics),
      recentAlerts: this.alerts.filter(a => a.timestamp >= cutoff).length
    };
  }

  getValidationReport(): any {
    const recentAlerts = this.alerts.slice(-100);
    const alertsByRule = recentAlerts.reduce((acc: any, alert) => {
      acc[alert.rule] = (acc[alert.rule] || 0) + 1;
      return acc;
    }, {});

    const alertsBySeverity = Array.from(this.validationRules.values()).reduce((acc: any, rule) => {
      const count = alertsByRule[Object.keys(alertsByRule).find(key => 
        this.validationRules.get(key)?.name === rule.name
      ) || ''] || 0;
      acc[rule.severity] = (acc[rule.severity] || 0) + count;
      return acc;
    }, {});

    return {
      rules: Array.from(this.validationRules.values()).map(rule => ({
        name: rule.name,
        module: rule.module,
        severity: rule.severity,
        triggered: alertsByRule[rule.name] || 0
      })),
      recentAlerts: recentAlerts.slice(-10),
      summary: {
        totalRules: this.validationRules.size,
        alertsBySeverity,
        totalAlerts: recentAlerts.length
      }
    };
  }

  // Helper Methods
  private calculateOverallHealth(): 'healthy' | 'degraded' | 'unhealthy' {
    const checks = Array.from(this.healthChecks.values());
    const unhealthy = checks.filter(c => c.status === 'unhealthy').length;
    const degraded = checks.filter(c => c.status === 'degraded').length;

    if (unhealthy > 0) return 'unhealthy';
    if (degraded > 0) return 'degraded';
    return 'healthy';
  }

  private getTopOperations(metrics: MetricEvent[]): Array<{ operation: string; count: number }> {
    const operations = metrics.reduce((acc: any, m) => {
      const key = `${m.module}/${m.operation}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(operations)
      .map(([operation, count]) => ({ operation, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getSlowestOperations(metrics: MetricEvent[]): Array<{ operation: string; duration: number }> {
    return metrics
      .map(m => ({ operation: `${m.module}/${m.operation}`, duration: m.duration }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }
}

export const observabilityAgent = new ObservabilityAgent();
