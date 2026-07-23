
/**
 * Development Mode Checker
 * Provides utilities to detect and handle development vs production environments
 */

export class DevelopmentModeChecker {
  static isDevelopment(): boolean {
    return !process.env.DATABASE_URL || process.env.NODE_ENV === 'development';
  }

  static isProduction(): boolean {
    return !!process.env.DATABASE_URL && process.env.NODE_ENV === 'production';
  }

  static checkDatabaseAvailable(): boolean {
    return !!process.env.DATABASE_URL;
  }

  static logEnvironmentStatus(): void {
    const mode = this.isDevelopment() ? 'DEVELOPMENT' : 'PRODUCTION';
    const dbStatus = this.checkDatabaseAvailable() ? 'CONNECTED' : 'DISCONNECTED';
    
    console.log(`🔧 Environment: ${mode} | Database: ${dbStatus}`);
    
    if (this.isDevelopment() && !this.checkDatabaseAvailable()) {
      console.log('💡 Token/Energy system will run in simulation mode');
      console.log('💡 Set DATABASE_URL to enable full functionality');
    }
  }

  static requireDatabase(operation: string): boolean {
    if (!this.checkDatabaseAvailable()) {
      console.warn(`⚠️ ${operation} requires DATABASE_URL - operation skipped in development`);
      return false;
    }
    return true;
  }
}

export const devModeChecker = new DevelopmentModeChecker();
