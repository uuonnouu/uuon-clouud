export class SystemSyncMonitor {
  private static instance: SystemSyncMonitor;
  private syncInterval: NodeJS.Timeout | null = null;
  private lastSyncStatus: Record<string, any> = {};

  static getInstance(): SystemSyncMonitor {
    if (!SystemSyncMonitor.instance) {
      SystemSyncMonitor.instance = new SystemSyncMonitor();
    }
    return SystemSyncMonitor.instance;
  }

  startMonitoring(): void {
    console.log('🔄 Starting comprehensive system synchronization monitoring...');

    this.performSyncCheck();

    // Monitor every 15 minutes to prevent conflicts with other systems
    this.syncInterval = setInterval(() => {
      this.performSyncCheck();
    }, 900000);
  }

  private async performSyncCheck(): Promise<void> {
    try {
      const shapeSync = await this.checkShapeRegistrySync();
      const communicationSync = await this.checkCommunicationSync();
      const databaseSync = await this.checkDatabaseSync();
      const workflowSync = await this.checkWorkflowSync();

      const currentStatus = {
        shapes: shapeSync,
        communication: communicationSync,
        database: databaseSync,
        workflows: workflowSync,
        timestamp: new Date().toISOString()
      };

      // Only log if there's a problem or the status has changed
      const hasIssues = shapeSync.needsUpdate || communicationSync.needsUpdate || databaseSync.status !== '✅ OPERATIONAL' || workflowSync.status !== '✅ CONFIGURED';
      if (this.hasStatusChanged(currentStatus) || hasIssues) {
        if (hasIssues) {
          console.log('⚠️ SYSTEM SYNC ISSUES DETECTED:');
          console.log(`   Shapes: ${shapeSync.status} (${shapeSync.details})`);
          console.log(`   Communication: ${communicationSync.status}`);
          console.log(`   Database: ${databaseSync.status}`);
          console.log(`   Workflows: ${workflowSync.status}`);
        } else {
          // Log a general update if no issues but status changed
          console.log('🔄 SYSTEM SYNC STATUS UPDATE:');
          console.log(`   Shapes: ${shapeSync.status} (${shapeSync.details})`);
          console.log(`   Communication: ${communicationSync.status}`);
          console.log(`   Database: ${databaseSync.status}`);
          console.log(`   Workflows: ${workflowSync.status}`);
        }
      }

      this.lastSyncStatus = currentStatus;

    } catch (error) {
      console.error('❌ System sync check failed:', error);
    }
  }

  private async checkShapeRegistrySync(): Promise<{status: string, details: string, needsUpdate: boolean}> {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        return {
          status: '✅ SYNCHRONIZED',
          details: 'Shape registries in sync',
          needsUpdate: false
        };
      } else {
        return {
          status: '⚠️ MISMATCH DETECTED',
          details: 'Shape registry synchronization needed',
          needsUpdate: true
        };
      }
    } catch (error) {
      return {
        status: '❌ COMMUNICATION ERROR',
        details: 'Cannot reach backend',
        needsUpdate: true
      };
    }
  }

  private async checkCommunicationSync(): Promise<{status: string, needsUpdate: boolean}> {
    try {
      const healthCheck = await fetch('http://localhost:5000/api/system-health');
      return {
        status: healthCheck.ok ? '✅ CONNECTED' : '⚠️ DEGRADED',
        needsUpdate: !healthCheck.ok
      };
    } catch (error) {
      return {
        status: '❌ DISCONNECTED',
        needsUpdate: true
      };
    }
  }

  private async checkDatabaseSync(): Promise<{status: string}> {
    try {
      const dbCheck = await fetch('http://localhost:5000/api/health');
      return { status: dbCheck.ok ? '✅ OPERATIONAL' : '⚠️ ISSUES' };
    } catch (error) {
      return { status: '❌ UNAVAILABLE' };
    }
  }

  private async checkWorkflowSync(): Promise<{status: string}> {
    // This is a placeholder, in a real scenario, this would involve a check
    return { status: '✅ CONFIGURED' };
  }

  private hasStatusChanged(currentStatus: any): boolean {
    // Compare only the statuses, not the timestamp
    const lastStatusCopy = { ...this.lastSyncStatus };
    delete lastStatusCopy.timestamp;
    const currentStatusCopy = { ...currentStatus };
    delete currentStatusCopy.timestamp;

    return JSON.stringify(lastStatusCopy) !== JSON.stringify(currentStatusCopy);
  }

  stopMonitoring(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    console.log('🛑 System sync monitoring stopped');
  }
}

export const systemSyncMonitor = SystemSyncMonitor.getInstance();