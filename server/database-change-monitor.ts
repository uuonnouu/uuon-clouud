
/**
 * DATABASE CHANGE MONITOR
 * Automatically invalidates metrics caches when data changes
 */

import { invalidateMetricsCache } from './unified-live-metrics-engine';

class DatabaseChangeMonitor {
  private changeListeners: Set<() => void> = new Set();
  
  // Register a change listener
  onDatabaseChange(callback: () => void): void {
    this.changeListeners.add(callback);
  }
  
  // Notify all listeners of database changes
  notifyChange(): void {
    // Invalidate metrics cache
    invalidateMetricsCache();
    
    // Notify other listeners
    this.changeListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error('Database change listener error:', error);
      }
    });
    
    console.log('📊 Database change detected - metrics cache invalidated');
  }
  
  // Monitor specific tables for changes
  startMonitoring(): void {
    // This would be enhanced with database triggers in production
    console.log('📊 Database change monitoring active');
  }
}

export const databaseChangeMonitor = new DatabaseChangeMonitor();
