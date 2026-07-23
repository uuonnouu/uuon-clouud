/**
 * Database Change Logger
 * Tracks all database operations for shapes, formulas, and assets
 * Makes it easy to search and track database-related changes
 */

export interface DatabaseLogEntry {
  timestamp: string;
  operation: 'LOAD' | 'CACHE_HIT' | 'CACHE_MISS' | 'FETCH' | 'ERROR' | 'SEED' | 'SYNC';
  target: string;
  source: 'database' | 'bundled' | 'cache' | 'api';
  details?: string;
  duration?: number;
  success: boolean;
}

class DatabaseChangeLogger {
  private static instance: DatabaseChangeLogger;
  private logs: DatabaseLogEntry[] = [];
  private maxLogs = 1000;
  private logPrefix = '[DB-SHAPES]';

  static getInstance(): DatabaseChangeLogger {
    if (!DatabaseChangeLogger.instance) {
      DatabaseChangeLogger.instance = new DatabaseChangeLogger();
    }
    return DatabaseChangeLogger.instance;
  }

  log(entry: Omit<DatabaseLogEntry, 'timestamp'>): void {
    const fullEntry: DatabaseLogEntry = {
      ...entry,
      timestamp: new Date().toISOString()
    };

    this.logs.push(fullEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    const icon = entry.success ? '✅' : '❌';
    const sourceIcon = this.getSourceIcon(entry.source);
    const opIcon = this.getOperationIcon(entry.operation);

    console.log(
      `${this.logPrefix} ${icon} ${opIcon} ${entry.operation} | ${sourceIcon} ${entry.source} | ${entry.target}${entry.details ? ` | ${entry.details}` : ''}${entry.duration ? ` | ${entry.duration}ms` : ''}`
    );
  }

  private getSourceIcon(source: string): string {
    const icons: Record<string, string> = {
      database: '🗄️',
      bundled: '📦',
      cache: '⚡',
      api: '🌐'
    };
    return icons[source] || '📋';
  }

  private getOperationIcon(operation: string): string {
    const icons: Record<string, string> = {
      LOAD: '📥',
      CACHE_HIT: '🎯',
      CACHE_MISS: '🔍',
      FETCH: '🌐',
      ERROR: '💥',
      SEED: '🌱',
      SYNC: '🔄'
    };
    return icons[operation] || '📋';
  }

  logDatabaseLoad(shapeType: string, fromDatabase: boolean, duration?: number): void {
    this.log({
      operation: 'LOAD',
      target: shapeType,
      source: fromDatabase ? 'database' : 'bundled',
      duration,
      success: true,
      details: fromDatabase ? 'Loaded from PostgreSQL' : 'Loaded from bundled TypeScript'
    });
  }

  logCacheHit(shapeType: string): void {
    this.log({
      operation: 'CACHE_HIT',
      target: shapeType,
      source: 'cache',
      success: true,
      details: 'Shape equation retrieved from memory cache'
    });
  }

  logCacheMiss(shapeType: string): void {
    this.log({
      operation: 'CACHE_MISS',
      target: shapeType,
      source: 'cache',
      success: true,
      details: 'Shape not in cache, fetching from source'
    });
  }

  logFetch(shapeType: string, success: boolean, duration?: number): void {
    this.log({
      operation: 'FETCH',
      target: shapeType,
      source: 'api',
      success,
      duration,
      details: success ? 'API fetch successful' : 'API fetch failed'
    });
  }

  logError(shapeType: string, error: string): void {
    this.log({
      operation: 'ERROR',
      target: shapeType,
      source: 'database',
      success: false,
      details: error
    });
  }

  logSync(shapesCount: number, source: 'database' | 'bundled'): void {
    this.log({
      operation: 'SYNC',
      target: `${shapesCount} shapes`,
      source,
      success: true,
      details: `Synchronized ${shapesCount} shapes from ${source}`
    });
  }

  getRecentLogs(count: number = 50): DatabaseLogEntry[] {
    return this.logs.slice(-count);
  }

  getLogsByOperation(operation: DatabaseLogEntry['operation']): DatabaseLogEntry[] {
    return this.logs.filter(log => log.operation === operation);
  }

  getLogsByTarget(target: string): DatabaseLogEntry[] {
    return this.logs.filter(log => log.target.includes(target));
  }

  getErrorLogs(): DatabaseLogEntry[] {
    return this.logs.filter(log => !log.success);
  }

  getStats(): {
    total: number;
    byOperation: Record<string, number>;
    bySource: Record<string, number>;
    successRate: number;
    avgDuration: number;
  } {
    const byOperation: Record<string, number> = {};
    const bySource: Record<string, number> = {};
    let successCount = 0;
    let totalDuration = 0;
    let durationCount = 0;

    this.logs.forEach(log => {
      byOperation[log.operation] = (byOperation[log.operation] || 0) + 1;
      bySource[log.source] = (bySource[log.source] || 0) + 1;
      if (log.success) successCount++;
      if (log.duration) {
        totalDuration += log.duration;
        durationCount++;
      }
    });

    return {
      total: this.logs.length,
      byOperation,
      bySource,
      successRate: this.logs.length > 0 ? (successCount / this.logs.length) * 100 : 0,
      avgDuration: durationCount > 0 ? totalDuration / durationCount : 0
    };
  }

  printStats(): void {
    const stats = this.getStats();
    console.log('\n' + this.logPrefix + ' ═══════════════════════════════════════');
    console.log(this.logPrefix + ' 📊 DATABASE SHAPE LOADING STATISTICS');
    console.log(this.logPrefix + ' ═══════════════════════════════════════');
    console.log(this.logPrefix + ` Total Operations: ${stats.total}`);
    console.log(this.logPrefix + ` Success Rate: ${stats.successRate.toFixed(1)}%`);
    console.log(this.logPrefix + ` Avg Duration: ${stats.avgDuration.toFixed(1)}ms`);
    console.log(this.logPrefix + ' By Source:');
    Object.entries(stats.bySource).forEach(([source, count]) => {
      console.log(this.logPrefix + `   ${this.getSourceIcon(source)} ${source}: ${count}`);
    });
    console.log(this.logPrefix + ' ═══════════════════════════════════════\n');
  }

  clear(): void {
    this.logs = [];
    console.log(this.logPrefix + ' 🧹 Logs cleared');
  }
}

export const dbLogger = DatabaseChangeLogger.getInstance();
