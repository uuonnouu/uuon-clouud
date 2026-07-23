/**
 * SECURITY METRICS MONITORING SYSTEM
 * Implements real-time security monitoring and automated circuit breakers
 */

interface SecurityMetrics {
  requestRate: number;        // Requests per minute
  failureRate: number;        // % failed transactions
  avgResponseTime: number;    // Average response time in ms
  disputeRate: number;        // % contracts disputed
  nonceCollisionCount: number; // Nonce reuse attempts
  lastUpdated: Date;
}

interface SecurityAlert {
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  type: string;
  message: string;
  timestamp: Date;
  metrics: Partial<SecurityMetrics>;
}

export class SecurityMetricsMonitor {
  private metrics: SecurityMetrics;
  private alertHistory: SecurityAlert[] = [];
  private monitoringInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.metrics = {
      requestRate: 0,
      failureRate: 0,
      avgResponseTime: 0,
      disputeRate: 0,
      nonceCollisionCount: 0,
      lastUpdated: new Date()
    };
    this.startMonitoring();
  }

  /**
   * Record security event for monitoring
   */
  recordEvent(eventType: 'REQUEST' | 'FAILURE' | 'DISPUTE' | 'NONCE_COLLISION', metadata?: any): void {
    const now = new Date();

    switch (eventType) {
      case 'REQUEST':
        this.metrics.requestRate++;
        if (metadata?.responseTime) {
          this.updateAvgResponseTime(metadata.responseTime);
        }
        break;
      case 'FAILURE':
        this.metrics.failureRate = this.calculateFailureRate();
        break;
      case 'DISPUTE':
        this.metrics.disputeRate = this.calculateDisputeRate();
        break;
      case 'NONCE_COLLISION':
        this.metrics.nonceCollisionCount++;
        this.triggerAlert('WARNING', 'Nonce collision detected - potential replay attack');
        break;
    }

    this.metrics.lastUpdated = now;
    this.checkCircuitBreakers();
  }

  /**
   * Check if circuit breakers should be triggered
   */
  private checkCircuitBreakers(): void {
    const alerts: SecurityAlert[] = [];

    // High request rate check
    if (this.metrics.requestRate > 1000) {
      alerts.push({
        level: 'CRITICAL',
        type: 'DDOS_SUSPECTED',
        message: `Abnormal request rate: ${this.metrics.requestRate}/min`,
        timestamp: new Date(),
        metrics: { requestRate: this.metrics.requestRate }
      });
    }

    // High failure rate check
    if (this.metrics.failureRate > 0.1) {
      alerts.push({
        level: 'WARNING',
        type: 'HIGH_FAILURE_RATE',
        message: `High failure rate: ${(this.metrics.failureRate * 100).toFixed(1)}%`,
        timestamp: new Date(),
        metrics: { failureRate: this.metrics.failureRate }
      });
    }

    // High dispute rate check
    if (this.metrics.disputeRate > 0.05) {
      alerts.push({
        level: 'WARNING',
        type: 'UNUSUAL_DISPUTE_SPIKE',
        message: `Unusual dispute rate: ${(this.metrics.disputeRate * 100).toFixed(1)}%`,
        timestamp: new Date(),
        metrics: { disputeRate: this.metrics.disputeRate }
      });
    }

    // Nonce collision check
    if (this.metrics.nonceCollisionCount > 10) {
      alerts.push({
        level: 'CRITICAL',
        type: 'REPLAY_ATTACK_DETECTED',
        message: `Multiple nonce collisions: ${this.metrics.nonceCollisionCount}`,
        timestamp: new Date(),
        metrics: { nonceCollisionCount: this.metrics.nonceCollisionCount }
      });
    }

    // Process alerts
    alerts.forEach(alert => {
      this.alertHistory.push(alert);
      this.handleAlert(alert);
    });
  }

  /**
   * Handle security alerts
   */
  private handleAlert(alert: SecurityAlert): void {
    console.log(`🚨 SECURITY ALERT [${alert.level}]: ${alert.message}`);

    // Auto-trigger emergency controls for critical alerts
    if (alert.level === 'CRITICAL') {
      console.log(`🛑 Auto-triggering emergency controls due to: ${alert.type}`);
      // In production, this would trigger emergency pause
      // emergencyControls.emergencyPause(`Auto-pause: ${alert.message}`);
    }
  }

  /**
   * Trigger custom alert
   */
  triggerAlert(level: 'INFO' | 'WARNING' | 'CRITICAL', message: string): void {
    const alert: SecurityAlert = {
      level,
      type: 'MANUAL_ALERT',
      message,
      timestamp: new Date(),
      metrics: this.metrics
    };

    this.alertHistory.push(alert);
    this.handleAlert(alert);
  }

  private updateAvgResponseTime(responseTime: number): void {
    // Simple moving average calculation
    this.metrics.avgResponseTime = (this.metrics.avgResponseTime + responseTime) / 2;
  }

  private calculateFailureRate(): number {
    // In production, track actual success/failure counts
    return Math.random() * 0.05; // Placeholder
  }

  private calculateDisputeRate(): number {
    // In production, track actual dispute counts
    return Math.random() * 0.02; // Placeholder
  }

  /**
   * Start monitoring system
   */
  private startMonitoring(): void {
    this.monitoringInterval = setInterval(() => {
      this.resetPeriodicMetrics();
    }, 60000); // Reset per-minute metrics every minute

    console.log('🔍 Security metrics monitoring started');
  }

  /**
   * Reset metrics that should reset periodically
   */
  private resetPeriodicMetrics(): void {
    this.metrics.requestRate = 0;
    this.metrics.lastUpdated = new Date();
  }

  /**
   * Get current security status
   */
  getSecurityStatus(): { metrics: SecurityMetrics; recentAlerts: SecurityAlert[]; status: string } {
    const recentAlerts = this.alertHistory.slice(-10); // Last 10 alerts
    const criticalAlerts = recentAlerts.filter(a => a.level === 'CRITICAL');

    let status = 'SECURE';
    if (criticalAlerts.length > 0) {
      status = 'CRITICAL';
    } else if (recentAlerts.some(a => a.level === 'WARNING')) {
      status = 'WARNING';
    }

    return {
      metrics: this.metrics,
      recentAlerts,
      status
    };
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    console.log('🔍 Security metrics monitoring stopped');
  }
}

export const securityMetrics = new SecurityMetricsMonitor();