
/**
 * EMERGENCY CONTROLS SYSTEM
 * Addresses security audit requirement for emergency pause and circuit breakers
 */

export class EmergencyControls {
  private emergencyPaused: boolean = false;
  private circuitBreakerThresholds = {
    maxRequestsPerMinute: 1000,
    maxFailureRate: 0.5, // 50% failure rate triggers circuit breaker
    maxConcurrentRequests: 100
  };
  private metrics = {
    requestsThisMinute: 0,
    failures: 0,
    successes: 0,
    concurrentRequests: 0,
    resetTime: Date.now() + 60000
  };

  /**
   * Emergency pause - immediately stops all operations
   */
  emergencyPause(reason: string): void {
    this.emergencyPaused = true;
    console.log(`🚨 EMERGENCY PAUSE ACTIVATED: ${reason}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    // In production, this would:
    // - Stop all beacon broadcasting
    // - Reject all incoming requests
    // - Pause escrow contract interactions
    // - Send alerts to administrators
  }

  /**
   * Resume operations after emergency pause
   */
  resumeOperations(authorizedBy: string): boolean {
    if (!this.emergencyPaused) {
      return false;
    }

    this.emergencyPaused = false;
    console.log(`✅ Operations resumed by: ${authorizedBy}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    
    return true;
  }

  /**
   * Circuit breaker - automatic protection against cascade failures
   */
  checkCircuitBreaker(): { allowed: boolean; reason?: string } {
    if (this.emergencyPaused) {
      return { allowed: false, reason: 'Emergency pause active' };
    }

    const now = Date.now();
    
    // Reset metrics every minute
    if (now > this.metrics.resetTime) {
      this.metrics = {
        requestsThisMinute: 0,
        failures: 0,
        successes: 0,
        concurrentRequests: this.metrics.concurrentRequests,
        resetTime: now + 60000
      };
    }

    // Check thresholds
    if (this.metrics.requestsThisMinute > this.circuitBreakerThresholds.maxRequestsPerMinute) {
      return { allowed: false, reason: 'Request rate limit exceeded' };
    }

    if (this.metrics.concurrentRequests > this.circuitBreakerThresholds.maxConcurrentRequests) {
      return { allowed: false, reason: 'Too many concurrent requests' };
    }

    const totalRequests = this.metrics.failures + this.metrics.successes;
    if (totalRequests > 10) { // Only check after minimum sample size
      const failureRate = this.metrics.failures / totalRequests;
      if (failureRate > this.circuitBreakerThresholds.maxFailureRate) {
        return { allowed: false, reason: 'Failure rate too high' };
      }
    }

    return { allowed: true };
  }

  /**
   * Record request metrics for circuit breaker
   */
  recordRequest(success: boolean): void {
    this.metrics.requestsThisMinute++;
    this.metrics.concurrentRequests++;
    
    if (success) {
      this.metrics.successes++;
    } else {
      this.metrics.failures++;
    }
  }

  /**
   * Complete request (reduce concurrent count)
   */
  completeRequest(): void {
    this.metrics.concurrentRequests = Math.max(0, this.metrics.concurrentRequests - 1);
  }

  /**
   * Get system status
   */
  getStatus(): any {
    return {
      emergencyPaused: this.emergencyPaused,
      metrics: this.metrics,
      thresholds: this.circuitBreakerThresholds,
      systemHealth: this.metrics.concurrentRequests < this.circuitBreakerThresholds.maxConcurrentRequests ? 'healthy' : 'stressed'
    };
  }
}

export const emergencyControls = new EmergencyControls();
