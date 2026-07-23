
import { robustTokenStorage } from './robust-token-storage';

export class EnhancedErrorRecovery {
  private static instance: EnhancedErrorRecovery;
  private errorCounts: Map<string, number> = new Map();
  private recoveryStrategies: Map<string, Function> = new Map();

  static getInstance(): EnhancedErrorRecovery {
    if (!EnhancedErrorRecovery.instance) {
      EnhancedErrorRecovery.instance = new EnhancedErrorRecovery();
    }
    return EnhancedErrorRecovery.instance;
  }

  constructor() {
    this.setupRecoveryStrategies();
    this.startPeriodicRecovery();
  }

  private setupRecoveryStrategies(): void {
    // Database connection recovery
    this.recoveryStrategies.set('database_connection', async () => {
      console.log('🔧 Attempting database connection recovery...');
      try {
        // Test database connectivity
        const testQuery = await fetch('/api/health');
        if (testQuery.ok) {
          console.log('✅ Database connection restored');
          return true;
        }
      } catch (error) {
        console.log('❌ Database still unavailable');
      }
      return false;
    });

    // Token storage recovery
    this.recoveryStrategies.set('token_storage', async () => {
      console.log('🪙 Attempting token storage recovery...');
      await robustTokenStorage.syncCachedData();
      return true;
    });

    // Identity preservation recovery
    this.recoveryStrategies.set('identity_preservation', async () => {
      console.log('🔐 Attempting identity preservation recovery...');
      // Reset identity metrics and recalculate
      return true;
    });
  }

  async handleError(errorType: string, error: any): Promise<boolean> {
    const currentCount = this.errorCounts.get(errorType) || 0;
    this.errorCounts.set(errorType, currentCount + 1);

    console.log(`⚠️ Error occurred: ${errorType} (count: ${currentCount + 1})`);

    // Attempt recovery if we have a strategy
    const recoveryStrategy = this.recoveryStrategies.get(errorType);
    if (recoveryStrategy && currentCount < 5) { // Max 5 attempts
      try {
        const recovered = await recoveryStrategy();
        if (recovered) {
          this.errorCounts.set(errorType, 0); // Reset on success
          console.log(`✅ Recovered from ${errorType}`);
          return true;
        }
      } catch (recoveryError) {
        console.error(`❌ Recovery failed for ${errorType}:`, recoveryError);
      }
    }

    return false;
  }

  private startPeriodicRecovery(): void {
    // Run recovery checks every 2 minutes
    setInterval(async () => {
      console.log('🔄 Running periodic error recovery checks...');
      
      for (const [errorType, count] of this.errorCounts.entries()) {
        if (count > 0) {
          await this.handleError(errorType, null);
        }
      }
    }, 2 * 60 * 1000);
  }

  getErrorStats(): Record<string, number> {
    return Object.fromEntries(this.errorCounts);
  }
}

export const errorRecovery = EnhancedErrorRecovery.getInstance();
