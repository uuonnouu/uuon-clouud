/**
 * Credit & Token Expiration Tracker
 * Tracks all credits, tokens, API keys, and their expiration dates
 * across all tools and services integrated with CLOUUD
 */

export interface CreditAccount {
  id: string;
  service: string; // "blockdaemon", "openrouter", "ollama", etc
  credentialType: "api_key" | "token" | "credits" | "subscription";
  name: string;
  value?: string; // encrypted if stored
  quantity?: number; // for credits
  unit?: string; // "tokens", "API calls", "JUNO", etc
  createdAt: Date;
  expiresAt?: Date;
  renewalDate?: Date;
  status: "active" | "expired" | "expiring_soon" | "inactive";
  alertSent: boolean;
  metadata?: Record<string, any>;
}

export interface AuditEvent {
  id: string;
  timestamp: Date;
  tool: string; // which tool generated this event
  action: string; // "api_call", "token_used", "credit_expired", etc
  details: string;
  resourcesConsumed?: {
    tokens?: number;
    credits?: number;
    apiCalls?: number;
  };
  status: "success" | "failed" | "warning";
  conversationId?: number;
}

export class CreditTracker {
  private credits: Map<string, CreditAccount> = new Map();
  private auditLog: AuditEvent[] = [];

  /**
   * Register a new credit/token/API key
   */
  registerCredit(account: Omit<CreditAccount, "id">): CreditAccount {
    const id = `cred_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullAccount: CreditAccount = {
      id,
      ...account,
      alertSent: false,
    };

    this.credits.set(id, fullAccount);
    this.logAudit({
      tool: "credit-tracker",
      action: "credit_registered",
      details: `${account.service} ${account.credentialType} registered: ${account.name}`,
      status: "success",
    });

    return fullAccount;
  }

  /**
   * Log an audit event (API call, token usage, etc)
   */
  logAudit(event: Omit<AuditEvent, "id" | "timestamp">): AuditEvent {
    const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const fullEvent: AuditEvent = {
      id,
      timestamp: new Date(),
      ...event,
    };

    this.auditLog.push(fullEvent);

    // Keep only last 10000 events in memory
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-10000);
    }

    return fullEvent;
  }

  /**
   * Check for expiring credentials and alert
   */
  checkExpiring(hoursThreshold: number = 24): CreditAccount[] {
    const now = new Date();
    const threshold = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);

    const expiring: CreditAccount[] = [];

    for (const account of this.credits.values()) {
      if (account.expiresAt && account.expiresAt <= threshold && !account.alertSent) {
        account.status = "expiring_soon";
        account.alertSent = true;
        expiring.push(account);

        this.logAudit({
          tool: "credit-tracker",
          action: "expiration_alert",
          details: `${account.service} ${account.name} expiring in ${hoursThreshold} hours`,
          status: "warning",
        });
      } else if (account.expiresAt && account.expiresAt < now) {
        account.status = "expired";
        this.logAudit({
          tool: "credit-tracker",
          action: "credit_expired",
          details: `${account.service} ${account.name} has expired`,
          status: "warning",
        });
      }
    }

    return expiring;
  }

  /**
   * Update credit usage
   */
  recordUsage(
    credentialId: string,
    used: number,
    tool: string
  ): { remaining: number; alert: boolean } {
    const account = this.credits.get(credentialId);
    if (!account || account.quantity === undefined) {
      throw new Error(`Credential ${credentialId} not found or has no quantity`);
    }

    const remaining = account.quantity - used;
    account.quantity = remaining;

    this.logAudit({
      tool,
      action: "token_used",
      details: `Used ${used} ${account.unit || "units"} from ${account.name}. Remaining: ${remaining}`,
      resourcesConsumed: { [account.unit || "tokens"]: used },
      status: remaining >= 0 ? "success" : "warning",
    });

    const alert = remaining < 10; // alert if less than 10% remaining
    if (alert) {
      account.status = "expiring_soon";
    }

    return { remaining, alert };
  }

  /**
   * Get all credentials
   */
  getAllCredentials(): CreditAccount[] {
    return Array.from(this.credits.values());
  }

  /**
   * Get audit log
   */
  getAuditLog(
    filter?: { tool?: string; action?: string; hours?: number }
  ): AuditEvent[] {
    let events = [...this.auditLog];

    if (filter?.hours) {
      const cutoff = new Date(Date.now() - filter.hours * 60 * 60 * 1000);
      events = events.filter((e) => e.timestamp > cutoff);
    }

    if (filter?.tool) {
      events = events.filter((e) => e.tool === filter.tool);
    }

    if (filter?.action) {
      events = events.filter((e) => e.action === filter.action);
    }

    return events;
  }

  /**
   * Generate expiration report
   */
  getExpirationReport(): {
    expired: CreditAccount[];
    expiring: CreditAccount[];
    active: CreditAccount[];
  } {
    const now = new Date();
    const expired: CreditAccount[] = [];
    const expiring: CreditAccount[] = [];
    const active: CreditAccount[] = [];

    for (const account of this.credits.values()) {
      if (!account.expiresAt) {
        active.push(account);
      } else if (account.expiresAt < now) {
        expired.push(account);
      } else if (
        account.expiresAt <
        new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      ) {
        expiring.push(account);
      } else {
        active.push(account);
      }
    }

    return { expired, expiring, active };
  }
}

export const creditTracker = new CreditTracker();
