/**
 * CPU-EFFICIENT DATABASE MANAGER
 * Optimizes database operations to reduce CPU usage in development and production
 */

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql } from 'drizzle-orm';
import { databaseMLOptimizer } from './database-ml-optimizer';
import os from 'os'; // Import the os module

interface UpdateBatch {
  id: string;
  priority: 'low' | 'medium' | 'high';
  operations: DatabaseOperation[];
  estimatedCPUCost: number;
  scheduledFor?: Date;
}

interface DatabaseOperation {
  type: 'insert' | 'update' | 'delete' | 'select';
  table: string;
  data: any;
  cpuCost: number;
}

export class CPUEfficientDatabaseManager {
  private connectionPool: any;
  private updateQueue: UpdateBatch[] = [];
  private isProcessing = false;
  private cpuUsageThreshold = 70; // Percentage
  private batchSize = 50;
  private processingInterval: NodeJS.Timeout | null = null;
  private maxConnections: number; // For connection pooling
  private connectionTimeout: number; // For connection timeout
  private queryCache: Map<string, any>; // For query result caching

  constructor() {
    this.initializeConnectionPool();
    this.startBackgroundProcessor();
  }

  private initializeConnectionPool() {
    const connectionString = process.env.DATABASE_URL!;

    // Optimized connection for CPU efficiency
    // Note: Neon serverless uses HTTP-based connections, pool settings managed at driver level
    this.connectionPool = neon(connectionString);

    // Configuration notes for CPU optimization:
    // - Development: 5 max connections, 1s delay scheduling
    // - Production: 10 max connections, intelligent batching
    // Enhanced connection pooling and query optimization
    const isProduction = process.env.NODE_ENV === 'production';
    this.maxConnections = isProduction ? 10 : Math.min(8, Math.max(3, Math.floor(os.cpus().length))); // Better scaling
    this.connectionTimeout = isProduction ? 15000 : 20000; // Faster production timeouts
    this.queryCache = new Map(); // Add query result caching

    const nodeEnv = process.env.NODE_ENV === 'production' ? 'Production' : 'Development';
    console.log(`🔧 CPU-efficient database connection initialized (${nodeEnv}, max logical operations: ${this.maxConnections}, timeout: ${this.connectionTimeout}ms)`);
  }

  // DEVELOPMENT MODE: Lazy loading with CPU throttling
  async scheduleUpdateForDevelopment(operation: DatabaseOperation): Promise<void> {
    const batch: UpdateBatch = {
      id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      priority: 'low',
      operations: [operation],
      estimatedCPUCost: operation.cpuCost,
      scheduledFor: new Date(Date.now() + 2000) // 2 second delay for development
    };

    this.updateQueue.push(batch);
    console.log(`📊 Development update scheduled: ${operation.type} on ${operation.table}`);
  }

  // PRODUCTION MODE: Batch processing with intelligent scheduling
  async scheduleUpdateForProduction(operations: DatabaseOperation[]): Promise<void> {
    const totalCPUCost = operations.reduce((sum, op) => sum + op.cpuCost, 0);

    const batch: UpdateBatch = {
      id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      priority: this.determinePriority(operations),
      operations,
      estimatedCPUCost: totalCPUCost,
      scheduledFor: await this.calculateOptimalExecutionTime(totalCPUCost)
    };

    // Insert batch in priority order
    const insertIndex = this.updateQueue.findIndex(b =>
      this.getPriorityValue(b.priority) < this.getPriorityValue(batch.priority)
    );

    if (insertIndex === -1) {
      this.updateQueue.push(batch);
    } else {
      this.updateQueue.splice(insertIndex, 0, batch);
    }

    console.log(`🚀 Production batch scheduled: ${operations.length} operations, CPU cost: ${totalCPUCost}`);
  }

  // CPU-AWARE SHAPE DATA UPDATES
  async updateShapeDataEfficiently(shapeId: string, shapeData: any): Promise<void> {
    const operation: DatabaseOperation = {
      type: 'update',
      table: 'shapes',
      data: { id: shapeId, ...shapeData },
      cpuCost: this.calculateCPUCost('update', shapeData)
    };

    if (process.env.NODE_ENV === 'development') {
      await this.scheduleUpdateForDevelopment(operation);
    } else {
      await this.scheduleUpdateForProduction([operation]);
    }
  }

  // BATCH SHAPE INSERTIONS (Production optimized)
  async batchInsertShapes(shapes: any[]): Promise<void> {
    const operations = shapes.map(shape => ({
      type: 'insert' as const,
      table: 'shapes',
      data: shape,
      cpuCost: this.calculateCPUCost('insert', shape)
    }));

    // Split into CPU-efficient batches
    const batches = this.splitIntoBatches(operations, this.batchSize);

    for (const batch of batches) {
      await this.scheduleUpdateForProduction(batch);
    }
  }

  // SMART BACKGROUND PROCESSOR
  private startBackgroundProcessor(): void {
    this.processingInterval = setInterval(async () => {
      if (this.isProcessing || this.updateQueue.length === 0) return;

      const currentCPUUsage = await this.getCurrentCPUUsage();

      // Only process if CPU usage is below threshold
      if (currentCPUUsage < this.cpuUsageThreshold) {
        await this.processNextBatch();
      } else {
        console.log(`⏳ CPU usage too high (${currentCPUUsage}%), delaying database operations`);
      }
    }, process.env.NODE_ENV === 'development' ? 3000 : 1000);
  }

  private async processNextBatch(): Promise<void> {
    this.isProcessing = true;

    try {
      // Get next batch that's ready for execution
      const batchIndex = this.updateQueue.findIndex(batch =>
        !batch.scheduledFor || batch.scheduledFor <= new Date()
      );

      if (batchIndex === -1) {
        this.isProcessing = false;
        return;
      }

      const batch = this.updateQueue[batchIndex];
      this.updateQueue.splice(batchIndex, 1);

      const startTime = Date.now();
      await this.executeBatch(batch);
      const executionTime = Date.now() - startTime;

      console.log(`✅ Batch ${batch.id} executed in ${executionTime}ms (${batch.operations.length} operations)`);
    } catch (error) {
      console.error('❌ Database batch execution failed:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async executeBatch(batch: UpdateBatch): Promise<void> {
    // Use drizzle directly with the neon connection pool
    const db = drizzle(this.connectionPool);

    // Group operations by type for optimal execution
    const groupedOps = this.groupOperationsByType(batch.operations);

    for (const [type, operations] of Object.entries(groupedOps)) {
      switch (type) {
        case 'insert':
          await this.executeInsertBatch(db, operations);
          break;
        case 'update':
          await this.executeUpdateBatch(db, operations);
          break;
        case 'delete':
          await this.executeDeleteBatch(db, operations);
          break;
        case 'select': // Add select case for potential future use or caching
          await this.executeSelectBatch(db, operations);
          break;
      }
    }
  }

  private async executeInsertBatch(db: any, operations: DatabaseOperation[]): Promise<void> {
    try {
      // Use batch insert for efficiency
      const values = operations.map(op => op.data);

      const tableName = operations[0]?.table;
      if (!tableName) {
        console.error('❌ No table name found for insert operations.');
        return;
      }

      // Import schema tables dynamically
      
      let targetTable;
      switch (tableName) {
        case 'formula_implementations':
          targetTable = formula_implementations;
          break;
        case 'shape_tokens':
          targetTable = shape_tokens;
          break;
        case 'mathematical_constants':
          targetTable = mathematical_constants;
          break;
          break;
        default:
          console.error(`❌ Unknown table: ${tableName}`);
          return;
      }

      await db.insert(targetTable).values(values);
      console.log(`📦 Batch inserted ${operations.length} records into ${tableName}`);
    } catch (error) {
      console.error('❌ Batch insert failed:', error);
      // Fallback to individual inserts for resilience
      for (const op of operations) {
        try {
          await this.executeIndividualInsert(db, op);
        } catch (individualError) {
          console.error(`❌ Individual insert failed for ${op.table}:`, individualError);
        }
      }
    }
  }

  private async executeIndividualInsert(db: any, operation: DatabaseOperation): Promise<void> {
    
    let targetTable;
    switch (operation.table) {
      case 'formula_implementations':
        targetTable = formula_implementations;
        break;
      case 'shape_tokens':
        targetTable = shape_tokens;
        break;
      case 'mathematical_constants':
        targetTable = mathematical_constants;
        break;
        break;
      default:
        throw new Error(`Unknown table: ${operation.table}`);
    }

    await db.insert(targetTable).values(operation.data);
  }

  private async executeUpdateBatch(db: any, operations: DatabaseOperation[]): Promise<void> {
    const { eq } = await import('drizzle-orm');
    
    for (const op of operations) {
      try {
        const recordId = op.data.id;

        if (!recordId) {
          console.error(`❌ Update failed: Missing 'id' for record in ${op.table}.`);
          continue;
        }

        let targetTable, idColumn;
        switch (op.table) {
          case 'formula_implementations':
            targetTable = formula_implementations;
            idColumn = formula_implementations.id;
            break;
          case 'shape_tokens':
            targetTable = shape_tokens;
            idColumn = shape_tokens.id;
            break;
          case 'mathematical_constants':
            targetTable = mathematical_constants;
            idColumn = mathematical_constants.id;
            break;
            break;
          default:
            console.error(`❌ Unknown table: ${op.table}`);
            continue;
        }

        await db.update(targetTable)
          .set(op.data)
          .where(eq(idColumn, recordId));
      } catch (error) {
        console.error(`❌ Update failed for ${op.table}:`, error);
      }
    }
  }

  private async executeDeleteBatch(db: any, operations: DatabaseOperation[]): Promise<void> {
    const { eq } = await import('drizzle-orm');
    
    for (const op of operations) {
      try {
        const recordId = op.data.id;

        if (!recordId) {
          console.error(`❌ Delete failed: Missing 'id' for record in ${op.table}.`);
          continue;
        }

        let targetTable, idColumn;
        switch (op.table) {
          case 'formula_implementations':
            targetTable = formula_implementations;
            idColumn = formula_implementations.id;
            break;
          case 'shape_tokens':
            targetTable = shape_tokens;
            idColumn = shape_tokens.id;
            break;
          case 'mathematical_constants':
            targetTable = mathematical_constants;
            idColumn = mathematical_constants.id;
            break;
            break;
          default:
            console.error(`❌ Unknown table: ${op.table}`);
            continue;
        }

        await db.delete(targetTable)
          .where(eq(idColumn, recordId));
      } catch (error) {
        console.error(`❌ Delete failed for ${op.table}:`, error);
      }
    }
  }

  // Add a placeholder for select operations, potentially for caching
  private async executeSelectBatch(db: any, operations: DatabaseOperation[]): Promise<void> {
    // This method can be expanded to handle select operations,
    // potentially populating the query cache.
    console.log(`ℹ️ Select operations encountered (not yet implemented for direct execution): ${operations.length}`);
    // Example: if operations[0].query is available, use it to fetch data
    // and populate this.queryCache.
  }

  // CPU USAGE MONITORING
  private async getCurrentCPUUsage(): Promise<number> {
    if (process.env.NODE_ENV === 'development') {
      // Simulated CPU usage for development
      return Math.random() * 50 + 20; // 20-70%
    }

    try {
      // Get actual CPU usage in production
      const startUsage = process.cpuUsage();
      // Simulate a small delay to measure CPU usage over time
      await new Promise(resolve => setTimeout(resolve, 100));
      const endUsage = process.cpuUsage(startUsage);

      // Calculate total CPU time used in the interval (user + system) in microseconds
      const totalUsageMicroseconds = endUsage.user + endUsage.system;
      // Convert to milliseconds
      const totalUsageMilliseconds = totalUsageMicroseconds / 1000;

      // Get system uptime in milliseconds
      const uptimeMilliseconds = os.uptime() * 1000;

      // Get total CPU time across all cores in milliseconds
      // This is a simplification, a more precise calculation might involve /proc/stat
      const totalSystemCpuTimeMilliseconds = uptimeMilliseconds * os.cpus().length;

      // Calculate CPU percentage. If totalSystemCpuTimeMilliseconds is 0 (e.g., very short uptime), default to 0.
      const cpuPercent = totalSystemCpuTimeMilliseconds > 0
        ? (totalUsageMilliseconds / totalSystemCpuTimeMilliseconds) * 100
        : 0;

      return Math.min(cpuPercent, 100);
    } catch (error) {
      console.error('❌ Error getting CPU usage:', error);
      return 50; // Default assumption on error
    }
  }

  private calculateCPUCost(operationType: string, data: any): number {
    // Estimate CPU cost based on operation type and data size
    const baseCosts: Record<string, number> = {
      'insert': 5,
      'update': 3,
      'delete': 2,
      'select': 1
    };

    const dataSize = JSON.stringify(data).length;
    // Scale factor: e.g., 1 point per 1KB of data
    const sizeFactor = Math.ceil(dataSize / 1000);

    // Base cost + cost proportional to data size
    return (baseCosts[operationType] || 3) + sizeFactor;
  }

  private determinePriority(operations: DatabaseOperation[]): 'low' | 'medium' | 'high' {
    const totalCost = operations.reduce((sum, op) => sum + op.cpuCost, 0);

    if (totalCost > 100) return 'high';
    if (totalCost > 50) return 'medium';
    return 'low';
  }

  private getPriorityValue(priority: string): number {
    const values: Record<string, number> = { low: 1, medium: 2, high: 3 };
    return values[priority] || 1;
  }

  private async calculateOptimalExecutionTime(cpuCost: number): Promise<Date> {
    const currentHour = new Date().getHours();
    let delay = 0;

    // Schedule high-cost operations during low-traffic hours (consider business hours)
    // Example: Avoid heavy processing during 8 AM to 6 PM if possible
    if (cpuCost > 75 && (currentHour >= 8 && currentHour <= 18)) {
      delay = 30000; // 30 second delay during business hours to offload
    }

    return new Date(Date.now() + delay);
  }

  private splitIntoBatches<T>(array: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < array.length; i += batchSize) {
      batches.push(array.slice(i, i + batchSize));
    }
    return batches;
  }

  private groupOperationsByType(operations: DatabaseOperation[]): Record<string, DatabaseOperation[]> {
    return operations.reduce((groups, op) => {
      if (!groups[op.type]) groups[op.type] = [];
      groups[op.type].push(op);
      return groups;
    }, {} as Record<string, DatabaseOperation[]>);
  }

  // CLEANUP AND SHUTDOWN
  async shutdown(): Promise<void> {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
    }

    // Process remaining urgent operations on shutdown
    const urgentBatches = this.updateQueue.filter(b => b.priority === 'high');
    console.log(`🔥 Shutting down: Processing ${urgentBatches.length} urgent batches.`);
    for (const batch of urgentBatches) {
      await this.executeBatch(batch);
    }

    console.log('🔧 CPU-efficient database manager shut down gracefully');
  }

  // STATISTICS AND MONITORING
  getQueueStats(): any {
    return {
      queueLength: this.updateQueue.length,
      priorityDistribution: this.updateQueue.reduce((dist, batch) => {
        dist[batch.priority] = (dist[batch.priority] || 0) + 1;
        return dist;
      }, {} as Record<string, number>),
      totalEstimatedCPUCost: this.updateQueue.reduce((sum, batch) => sum + batch.estimatedCPUCost, 0),
      isProcessing: this.isProcessing
    };
  }
}

export const cpuEfficientDBManager = new CPUEfficientDatabaseManager();