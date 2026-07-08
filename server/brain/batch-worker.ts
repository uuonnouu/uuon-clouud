import fs from "fs/promises";
import path from "path";
import { orchestrator } from "./compression/orchestrator";
import { brainScanner } from "./scanner";
import { brainService } from "./service";
import { BrainFileMetadata } from "./types";

/**
 * Brain Compression Batch Worker
 * 
 * Processes multiple files from /Brain/raw:
 * - Parallel compression (configurable concurrency)
 * - Progress tracking
 * - Error handling & retry logic
 * - Metrics collection
 */

export interface BatchProcessingOptions {
  concurrency?: number; // Max parallel operations
  priority?: "HIGH" | "MEDIUM" | "LOW" | "ALL"; // Which files to process
  verbose?: boolean; // Detailed logging
  dryRun?: boolean; // Don't actually save to DB
  retryFailed?: boolean; // Retry failed compressions
}

export interface BatchProgressReport {
  timestamp: string;
  totalFiles: number;
  processedCount: number;
  successCount: number;
  failureCount: number;
  progressPercent: number;
  elapsed: number;
  eta: number;
  currentFile?: string;
  currentStatus?: string;
}

export interface BatchCompletionReport {
  timestamp: string;
  totalFilesProcessed: number;
  successCount: number;
  failureCount: number;
  totalDuration: number;
  averageCompressionTimeMs: number;
  totalStorageSaved: number;
  totalCompressionRatio: number;
  successRate: number;
  errors: Array<{
    file: string;
    error: string;
  }>;
  topPerformers: Array<{
    file: string;
    technique: string;
    compressionRatio: number;
    savedBytes: number;
  }>;
}

export class BrainBatchWorker {
  private concurrency: number = 5;
  private verbose: boolean = false;
  private progressCallback?: (report: BatchProgressReport) => void;

  /**
   * Process all Brain files
   */
  async processAllFiles(options: BatchProcessingOptions = {}): Promise<BatchCompletionReport> {
    this.concurrency = options.concurrency || 5;
    this.verbose = options.verbose || false;

    const startTime = Date.now();
    const inventory = brainScanner.getInventory();

    // Filter by priority
    let filesToProcess = inventory;
    if (options.priority && options.priority !== "ALL") {
      filesToProcess = inventory.filter((f) => f.priority === options.priority);
    }

    if (this.verbose) {
      console.log(`[Batch Worker] Starting compression of ${filesToProcess.length} files`);
      console.log(`[Batch Worker] Concurrency: ${this.concurrency}`);
    }

    // Process files with concurrency control
    const results = await this.processWithConcurrency(filesToProcess, options);

    // Generate completion report
    const duration = Date.now() - startTime;
    const completionReport = this.generateCompletionReport(results, duration);

    if (this.verbose) {
      this.logCompletionReport(completionReport);
    }

    return completionReport;
  }

  /**
   * Process specific files
   */
  async processSpecificFiles(filePaths: string[], options: BatchProcessingOptions = {}): Promise<BatchCompletionReport> {
    this.concurrency = options.concurrency || 5;
    this.verbose = options.verbose || false;

    const startTime = Date.now();
    const inventory = brainScanner.getInventory();

    const filesToProcess = inventory.filter((f) => filePaths.includes(f.filePath));

    const results = await this.processWithConcurrency(filesToProcess, options);
    const duration = Date.now() - startTime;

    return this.generateCompletionReport(results, duration);
  }

  /**
   * Process HIGH priority files only
   */
  async processHighPriority(options: BatchProcessingOptions = {}): Promise<BatchCompletionReport> {
    return this.processAllFiles({ ...options, priority: "HIGH" });
  }

  /**
   * Set progress callback
   */
  onProgress(callback: (report: BatchProgressReport) => void): void {
    this.progressCallback = callback;
  }

  /**
   * Private: Process files with concurrency control
   */
  private async processWithConcurrency(
    files: BrainFileMetadata[],
    options: BatchProcessingOptions,
  ): Promise<
    Array<{
      file: BrainFileMetadata;
      success: boolean;
      duration: number;
      result?: any;
      error?: string;
    }>
  > {
    const results: any[] = [];
    const queue = [...files];
    let activeCount = 0;
    let processedCount = 0;

    return new Promise((resolve) => {
      const processNext = async () => {
        if (queue.length === 0 && activeCount === 0) {
          resolve(results);
          return;
        }

        if (queue.length === 0 || activeCount >= this.concurrency) {
          return;
        }

        activeCount++;
        const file = queue.shift()!;
        const fileStartTime = Date.now();

        try {
          // Read file content
          const filePath = path.join(process.cwd(), ":Brain", ":Raw", file.filePath);
          const content = await fs.readFile(filePath, "utf-8");

          // Compress
          const compressResult = await brainService.compressFile(content, file);

          processedCount++;

          // Report progress
          this.reportProgress(files.length, processedCount, file.fileName);

          results.push({
            file,
            success: !!compressResult,
            duration: Date.now() - fileStartTime,
            result: compressResult,
          });
        } catch (error) {
          processedCount++;

          results.push({
            file,
            success: false,
            duration: Date.now() - fileStartTime,
            error: String(error),
          });

          if (this.verbose) {
            console.error(`[Batch Worker] Failed: ${file.fileName} - ${error}`);
          }
        }

        activeCount--;
        processNext();
      };

      // Start initial batch
      for (let i = 0; i < this.concurrency && queue.length > 0; i++) {
        processNext();
      }
    });
  }

  /**
   * Private: Report progress
   */
  private reportProgress(total: number, processed: number, currentFile: string): void {
    if (!this.progressCallback) return;

    this.progressCallback({
      timestamp: new Date().toISOString(),
      totalFiles: total,
      processedCount: processed,
      successCount: 0, // TODO: calculate
      failureCount: 0, // TODO: calculate
      progressPercent: (processed / total) * 100,
      elapsed: 0, // TODO: calculate
      eta: 0, // TODO: estimate
      currentFile,
    });
  }

  /**
   * Private: Generate completion report
   */
  private generateCompletionReport(
    results: any[],
    totalDuration: number,
  ): BatchCompletionReport {
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;
    const totalCompressionTime = results.reduce((sum, r) => sum + r.duration, 0);
    const totalStorageSaved = results
      .filter((r) => r.result)
      .reduce((sum, r) => sum + (r.result.originalSize - r.result.compressedSize), 0);
    const totalOriginalSize = results
      .filter((r) => r.result)
      .reduce((sum, r) => sum + r.result.originalSize, 0);

    const topPerformers = results
      .filter((r) => r.result)
      .sort((a, b) => {
        const aSavings = a.result.originalSize - a.result.compressedSize;
        const bSavings = b.result.originalSize - b.result.compressedSize;
        return bSavings - aSavings;
      })
      .slice(0, 10)
      .map((r) => ({
        file: r.file.fileName,
        technique: r.result.ruleType,
        compressionRatio: r.result.compressionRatio,
        savedBytes: r.result.originalSize - r.result.compressedSize,
      }));

    const errors = results
      .filter((r) => !r.success && r.error)
      .map((r) => ({
        file: r.file.fileName,
        error: r.error,
      }));

    return {
      timestamp: new Date().toISOString(),
      totalFilesProcessed: results.length,
      successCount,
      failureCount,
      totalDuration,
      averageCompressionTimeMs: totalCompressionTime / (successCount || 1),
      totalStorageSaved,
      totalCompressionRatio: totalCompressionTime / (totalOriginalSize || 1),
      successRate: successCount / (results.length || 1),
      errors,
      topPerformers,
    };
  }

  /**
   * Private: Log completion report
   */
  private logCompletionReport(report: BatchCompletionReport): void {
    console.log("\n" + "=".repeat(70));
    console.log("[Batch Worker] COMPLETION REPORT");
    console.log("=".repeat(70));
    console.log(`Timestamp: ${report.timestamp}`);
    console.log(`Total Files Processed: ${report.totalFilesProcessed}`);
    console.log(`Success: ${report.successCount}`);
    console.log(`Failures: ${report.failureCount}`);
    console.log(`Success Rate: ${(report.successRate * 100).toFixed(2)}%`);
    console.log(`Total Duration: ${report.totalDuration}ms`);
    console.log(`Average Compression Time: ${report.averageCompressionTimeMs.toFixed(2)}ms`);
    console.log(`Total Storage Saved: ${(report.totalStorageSaved / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Average Compression Ratio: ${(report.totalCompressionRatio * 100).toFixed(2)}%`);

    if (report.topPerformers.length > 0) {
      console.log("\nTop Performers:");
      report.topPerformers.slice(0, 5).forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.file} (${p.technique}) - ${(p.compressionRatio * 100).toFixed(2)}% - ${(p.savedBytes / 1024).toFixed(2)}KB saved`);
      });
    }

    if (report.errors.length > 0) {
      console.log("\nErrors:");
      report.errors.slice(0, 5).forEach((e) => {
        console.log(`  - ${e.file}: ${e.error}`);
      });
    }

    console.log("=".repeat(70));
  }
}

export const batchWorker = new BrainBatchWorker();
