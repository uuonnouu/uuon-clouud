import { db } from "../db";
import { brainRules, brainInventory, brainCompressionMetrics, InsertBrainRule, InsertBrainInventoryEntry } from "../../shared/schema";
import { orchestrator } from "./compression/orchestrator";
import { brainScanner } from "./scanner";
import { BrainFileMetadata, CompressionResult, CompressionTechnique } from "./types";
import crypto from "crypto";
import { eq, and } from "drizzle-orm";

/**
 * Brain Compression Service
 * 
 * Orchestrates the entire compression pipeline:
 * 1. Scan Brain directory
 * 2. Compress files using best technique
 * 3. Store rules in database
 * 4. Track metrics
 * 5. Provide reconstruction on demand
 */

export class BrainCompressionService {
  /**
   * Initialize: scan and inventory all Brain files
   */
  async initialize(): Promise<void> {
    console.log("[Brain Service] Initializing...");

    try {
      const inventory = await brainScanner.scan();
      const stats = brainScanner.getStats();

      console.log("[Brain Service] Inventory complete:");
      console.log(`  Total files: ${stats.totalFiles}`);
      console.log(`  Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  By domain:`, stats.byDomain);
      console.log(`  By priority:`, stats.byPriority);

      // Store inventory in database
      for (const file of inventory) {
        await this.addToInventory(file);
      }
    } catch (error) {
      console.error("[Brain Service] Initialization error:", error);
    }
  }

  /**
   * Add file to inventory
   */
  private async addToInventory(metadata: BrainFileMetadata): Promise<void> {
    try {
      await db.insert(brainInventory).values({
        filePath: metadata.filePath,
        fileName: metadata.fileName,
        fileSize: metadata.fileSize,
        contentHash: metadata.contentHash,
        domain: metadata.domain,
        priority: metadata.priority,
      } as InsertBrainInventoryEntry);
    } catch (error) {
      // File may already exist; silently continue
    }
  }

  /**
   * Compress a single file
   * Returns compression result with storage
   */
  async compressFile(content: string, metadata: BrainFileMetadata): Promise<CompressionResult | null> {
    try {
      const result = await orchestrator.compressFile(content, metadata);

      if (!result) {
        return null;
      }

      // Store rule in database
      await this.storeRule(result);

      // Update inventory with rule reference
      await this.updateInventoryWithRule(metadata.filePath, result);

      return result;
    } catch (error) {
      console.error("[Brain Service] Compression error:", error);
      return null;
    }
  }

  /**
   * Reconstruct content from stored rule
   */
  async reconstructRule(ruleId: string): Promise<string | null> {
    try {
      // Fetch rule
      const rule = await db.query.brainRules.findFirst({
        where: (rules) => eq(rules.ruleId, ruleId),
      });

      if (!rule) {
        console.error(`[Brain Service] Rule not found: ${ruleId}`);
        return null;
      }

      // Get handler
      const handler = orchestrator.getHandler(rule.ruleType as CompressionTechnique);
      if (!handler) {
        console.error(`[Brain Service] Handler not found: ${rule.ruleType}`);
        return null;
      }

      // Reconstruct
      const ruleContent = JSON.parse(rule.ruleContent);
      const result = await handler.reconstruct(ruleContent);

      // Verify correctness
      if (result.contentHash !== rule.contentHash) {
        console.warn(`[Brain Service] Hash mismatch after reconstruction: ${ruleId}`);
      }

      return result.content;
    } catch (error) {
      console.error("[Brain Service] Reconstruction error:", error);
      return null;
    }
  }

  /**
   * Get compression metrics
   */
  async getMetrics(): Promise<Record<CompressionTechnique, any>> {
    const metrics: any = {};

    try {
      const allMetrics = await db.query.brainCompressionMetrics.findMany();

      for (const m of allMetrics) {
        metrics[m.ruleType] = {
          totalRules: m.totalRules,
          successCount: m.successCount,
          failureCount: m.failureCount,
          avgCompressionRatio: parseFloat(m.avgCompressionRatio),
          totalStorageSaved: m.totalStorageSaved,
        };
      }
    } catch (error) {
      console.error("[Brain Service] Error fetching metrics:", error);
    }

    return metrics;
  }

  /**
   * Get inventory summary
   */
  async getInventorySummary(): Promise<{
    totalFiles: number;
    totalSize: number;
    compressedCount: number;
    compressedSize: number;
    compressionRatio: number;
  }> {
    try {
      const all = await db.query.brainInventory.findMany();

      const totalSize = all.reduce((sum, f) => sum + f.fileSize, 0);
      const compressed = all.filter((f) => f.compressed);
      const compressedSize = compressed.reduce((sum, f) => sum + f.fileSize, 0);

      return {
        totalFiles: all.length,
        totalSize,
        compressedCount: compressed.length,
        compressedSize,
        compressionRatio: compressedSize / (totalSize || 1),
      };
    } catch (error) {
      console.error("[Brain Service] Error getting summary:", error);
      return {
        totalFiles: 0,
        totalSize: 0,
        compressedCount: 0,
        compressedSize: 0,
        compressionRatio: 1,
      };
    }
  }

  /**
   * Private: Store rule in database
   */
  private async storeRule(result: CompressionResult): Promise<void> {
    try {
      const ruleInsert: InsertBrainRule = {
        ruleId: result.ruleId,
        sourceFile: result.metadata?.sourceFile || "unknown",
        ruleType: result.ruleType,
        ruleContent: JSON.stringify(result.ruleContent),
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio.toString(),
        contentHash: result.metadata?.contentHash || "",
        domain: result.domain,
        metadata: JSON.stringify(result.metadata || {}),
      };

      await db.insert(brainRules).values(ruleInsert);

      // Update metrics
      await this.updateMetrics(result.ruleType, result.compressionRatio);
    } catch (error) {
      console.error("[Brain Service] Error storing rule:", error);
    }
  }

  /**
   * Private: Update inventory with rule reference
   */
  private async updateInventoryWithRule(filePath: string, result: CompressionResult): Promise<void> {
    try {
      const rule = await db.query.brainRules.findFirst({
        where: (r) => eq(r.ruleId, result.ruleId),
      });

      if (rule) {
        await db
          .update(brainInventory)
          .set({
            compressed: true,
            ruleId: rule.id,
          })
          .where(eq(brainInventory.filePath, filePath));
      }
    } catch (error) {
      console.error("[Brain Service] Error updating inventory:", error);
    }
  }

  /**
   * Private: Update compression metrics
   */
  private async updateMetrics(ruleType: CompressionTechnique, compressionRatio: number): Promise<void> {
    try {
      const existing = await db.query.brainCompressionMetrics.findFirst({
        where: (m) => eq(m.ruleType, ruleType),
      });

      if (existing) {
        // Update existing metrics
        const newSuccess = existing.successCount + 1;
        const oldAvg = parseFloat(existing.avgCompressionRatio);
        const newAvg = (oldAvg * existing.totalRules + compressionRatio) / newSuccess;

        await db
          .update(brainCompressionMetrics)
          .set({
            totalRules: existing.totalRules + 1,
            successCount: newSuccess,
            avgCompressionRatio: newAvg.toString(),
            minCompressionRatio:
              compressionRatio < parseFloat(existing.minCompressionRatio || "1")
                ? compressionRatio.toString()
                : existing.minCompressionRatio,
            maxCompressionRatio:
              compressionRatio > parseFloat(existing.maxCompressionRatio || "0")
                ? compressionRatio.toString()
                : existing.maxCompressionRatio,
          })
          .where(eq(brainCompressionMetrics.ruleType, ruleType));
      } else {
        // Create new metrics entry
        await db.insert(brainCompressionMetrics).values({
          ruleType,
          totalRules: 1,
          successCount: 1,
          failureCount: 0,
          avgCompressionRatio: compressionRatio.toString(),
          minCompressionRatio: compressionRatio.toString(),
          maxCompressionRatio: compressionRatio.toString(),
          totalStorageSaved: 0,
        });
      }
    } catch (error) {
      console.error("[Brain Service] Error updating metrics:", error);
    }
  }
}

export const brainService = new BrainCompressionService();
