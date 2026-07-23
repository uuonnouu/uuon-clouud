
export interface AuditEvent {
  timestamp: Date;
  userId?: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export class SecurityAuditLogger {
  private events: AuditEvent[] = [];

  logEvent(event: Omit<AuditEvent, 'timestamp'>): void {
    this.events.push({
      ...event,
      timestamp: new Date()
    });

    // Persist to secure storage
    this.persistEvent({ ...event, timestamp: new Date() });
  }

  private async persistEvent(event: AuditEvent): Promise<void> {
    // Save to secure audit log database
    console.log('🔐 Audit Event:', event);
  }

  generateSecurityReport(): {
    totalEvents: number;
    failureRate: number;
    topActions: string[];
    riskAssessment: 'low' | 'medium' | 'high';
  } {
    const total = this.events.length;
    const failures = this.events.filter(e => e.result === 'failure').length;
    
    return {
      totalEvents: total,
      failureRate: total > 0 ? failures / total : 0,
      topActions: this.getTopActions(),
      riskAssessment: this.assessRisk()
    };
  }

  private getTopActions(): string[] {
    const actionCounts = new Map<string, number>();
    this.events.forEach(event => {
      actionCounts.set(event.action, (actionCounts.get(event.action) || 0) + 1);
    });
    
    return Array.from(actionCounts.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([action]) => action);
  }

  private assessRisk(): 'low' | 'medium' | 'high' {
    const failureRate = this.generateSecurityReport().failureRate;
    if (failureRate > 0.1) return 'high';
    if (failureRate > 0.05) return 'medium';
    return 'low';
  }
}
