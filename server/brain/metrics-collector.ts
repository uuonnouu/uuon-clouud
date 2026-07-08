import { db } from "../db";
import { brainRules, brainCompressionMetrics } from "../../shared/schema";
import { CompressionTechnique } from "./types";
import { eq } from "drizzle-orm";

/**
 * Brain Compression Metrics & Monitoring System
 * 
 * Provides real-time metrics collection and dashboard data:
 * - Per-technique compression ratios
 * - Storage savings calculations
 * - Performance tracking
 * - Trend analysis
 * - Cost projections
 */

export interface DashboardMetrics {
  timestamp: string;
  overall: {
    totalFiles: number;
    totalOriginalSize: number;
    totalCompressedSize: number;
    compressionRatio: number;
    storageSavingsBytes: number;
    storageSavingsMB: number;
    storageSavingsGB: number;
  };
  byTechnique: Record<CompressionTechnique, TechniqueMetrics>;
  performance: {
    avgCompressionTimeMs: number;
    avgReconstructionTimeMs: number;
    topPerformer: string;
    worstPerformer: string;
  };
  costAnalysis: {
    originalCostPerMonth: number; // at $0.023/GB
    compressedCostPerMonth: number;
    costSavingsPerMonth: number;
    costSavingsPerYear: number;
  };
  topFiles: Array<{
    domain: string;
    technique: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    savings: number;
  }>;
  trends: {
    compressionRatioTrend: string; // improving/stable/declining
    volumeGrowth: string; // growing/stable/shrinking
    techniquePrefernce: string; // which technique used most
  };
}

export interface TechniqueMetrics {
  name: CompressionTechnique;
  totalRules: number;
  successCount: number;
  failureCount: number;
  successRate: number;
  avgCompressionRatio: number;
  minCompressionRatio: number;
  maxCompressionRatio: number;
  avgReconstructionTimeMs: number;
  totalStorageSaved: number;
  fileCount: number;
  topFile: {
    ratio: number;
    savedBytes: number;
  } | null;
}

export class BrainMetricsCollector {
  /**
   * Collect comprehensive dashboard metrics
   */
  async collectDashboardMetrics(): Promise<DashboardMetrics> {
    const timestamp = new Date().toISOString();

    // Fetch all metrics
    const allMetrics = await db.query.brainCompressionMetrics.findMany();
    const allRules = await db.query.brainRules.findMany();

    // Build metrics object
    const byTechnique: Record<CompressionTechnique, TechniqueMetrics> = {} as any;

    for (const metric of allMetrics) {
      const techniqueRules = allRules.filter((r) => r.ruleType === metric.ruleType);

      byTechnique[metric.ruleType as CompressionTechnique] = {
        name: metric.ruleType as CompressionTechnique,
        totalRules: metric.totalRules,
        successCount: metric.successCount,
        failureCount: metric.failureCount,
        successRate: metric.successCount / (metric.totalRules || 1),
        avgCompressionRatio: parseFloat(metric.avgCompressionRatio),
        minCompressionRatio: parseFloat(metric.minCompressionRatio || "1"),
        maxCompressionRatio: parseFloat(metric.maxCompressionRatio || "0"),
        avgReconstructionTimeMs: metric.avgReconstructionTimeMs || 0,
        totalStorageSaved: metric.totalStorageSaved,
        fileCount: techniqueRules.length,
        topFile: this.findTopFile(techniqueRules),
      };
    }

    // Calculate overall metrics
    const totalOriginalSize = allRules.reduce((sum, r) => sum + r.originalSize, 0);
    const totalCompressedSize = allRules.reduce((sum, r) => sum + r.compressedSize, 0);
    const storageSavingsBytes = totalOriginalSize - totalCompressedSize;

    const overall = {
      totalFiles: allRules.length,
      totalOriginalSize,
      totalCompressedSize,
      compressionRatio: totalCompressedSize / (totalOriginalSize || 1),
      storageSavingsBytes,
      storageSavingsMB: storageSavingsBytes / (1024 * 1024),
      storageSavingsGB: storageSavingsBytes / (1024 * 1024 * 1024),
    };

    // Performance metrics
    const avgCompressionTimeMs =
      allRules.length > 0 ? allRules.reduce((sum, r) => sum + (r.metadata ? 0 : 0), 0) / allRules.length : 0;
    const avgReconstructionTimeMs =
      allRules.length > 0 ? allRules.reduce((sum, r) => sum + (r.reconstructionTimeMs || 0), 0) / allRules.length : 0;

    const performanceEntries = Object.entries(byTechnique);
    const topPerformer = performanceEntries.sort((a, b) => a[1].avgCompressionRatio - b[1].avgCompressionRatio)[0][0];
    const worstPerformer = performanceEntries.sort((a, b) => b[1].avgCompressionRatio - a[1].avgCompressionRatio)[0][0];

    // Cost analysis (AWS S3 @ $0.023/GB/month)
    const costPerGBMonth = 0.023;
    const originalCostPerMonth = (overall.totalOriginalSize / (1024 * 1024 * 1024)) * costPerGBMonth;
    const compressedCostPerMonth = (overall.totalCompressedSize / (1024 * 1024 * 1024)) * costPerGBMonth;
    const costSavingsPerMonth = originalCostPerMonth - compressedCostPerMonth;
    const costSavingsPerYear = costSavingsPerMonth * 12;

    // Top files by compression ratio
    const topFiles = allRules
      .sort((a, b) => {
        const aSavings = a.originalSize - a.compressedSize;
        const bSavings = b.originalSize - b.compressedSize;
        return bSavings - aSavings;
      })
      .slice(0, 10)
      .map((r) => ({
        domain: r.domain || "unknown",
        technique: r.ruleType,
        originalSize: r.originalSize,
        compressedSize: r.compressedSize,
        compressionRatio: r.compressedSize / r.originalSize,
        savings: r.originalSize - r.compressedSize,
      }));

    // Trends
    const trends = {
      compressionRatioTrend: this.analyzeTrend(byTechnique),
      volumeGrowth: "stable", // TODO: track over time
      techniquePrefernce: topPerformer,
    };

    return {
      timestamp,
      overall,
      byTechnique,
      performance: {
        avgCompressionTimeMs,
        avgReconstructionTimeMs,
        topPerformer,
        worstPerformer,
      },
      costAnalysis: {
        originalCostPerMonth,
        compressedCostPerMonth,
        costSavingsPerMonth,
        costSavingsPerYear,
      },
      topFiles,
      trends,
    };
  }

  /**
   * Get metrics for specific technique
   */
  async getTechniqueMetrics(technique: CompressionTechnique): Promise<TechniqueMetrics | null> {
    const metric = await db.query.brainCompressionMetrics.findFirst({
      where: (m) => eq(m.ruleType, technique),
    });

    if (!metric) return null;

    const rules = await db.query.brainRules.findMany({
      where: (r) => eq(r.ruleType, technique),
    });

    return {
      name: technique,
      totalRules: metric.totalRules,
      successCount: metric.successCount,
      failureCount: metric.failureCount,
      successRate: metric.successCount / (metric.totalRules || 1),
      avgCompressionRatio: parseFloat(metric.avgCompressionRatio),
      minCompressionRatio: parseFloat(metric.minCompressionRatio || "1"),
      maxCompressionRatio: parseFloat(metric.maxCompressionRatio || "0"),
      avgReconstructionTimeMs: metric.avgReconstructionTimeMs || 0,
      totalStorageSaved: metric.totalStorageSaved,
      fileCount: rules.length,
      topFile: this.findTopFile(rules),
    };
  }

  /**
   * Get compression ratio distribution
   */
  async getRatioDistribution(): Promise<
    Array<{
      range: string;
      count: number;
      percentage: number;
    }>
  > {
    const allRules = await db.query.brainRules.findMany();

    const ranges = {
      "0-1%": 0,
      "1-5%": 0,
      "5-10%": 0,
      "10-25%": 0,
      "25-50%": 0,
      "50-100%": 0,
    };

    for (const rule of allRules) {
      const ratio = (rule.compressedSize / rule.originalSize) * 100;

      if (ratio <= 1) ranges["0-1%"]++;
      else if (ratio <= 5) ranges["1-5%"]++;
      else if (ratio <= 10) ranges["5-10%"]++;
      else if (ratio <= 25) ranges["10-25%"]++;
      else if (ratio <= 50) ranges["25-50%"]++;
      else ranges["50-100%"]++;
    }

    const total = allRules.length;

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
      percentage: (count / total) * 100,
    }));
  }

  /**
   * Get files by domain
   */
  async getMetricsByDomain(): Promise<
    Array<{
      domain: string;
      fileCount: number;
      totalOriginalSize: number;
      totalCompressedSize: number;
      compressionRatio: number;
      topTechnique: string;
    }>
  > {
    const allRules = await db.query.brainRules.findMany();

    const byDomain: Record<string, any> = {};

    for (const rule of allRules) {
      const domain = rule.domain || "unknown";

      if (!byDomain[domain]) {
        byDomain[domain] = {
          fileCount: 0,
          totalOriginalSize: 0,
          totalCompressedSize: 0,
          techniques: {} as Record<string, number>,
        };
      }

      byDomain[domain].fileCount++;
      byDomain[domain].totalOriginalSize += rule.originalSize;
      byDomain[domain].totalCompressedSize += rule.compressedSize;
      byDomain[domain].techniques[rule.ruleType] = (byDomain[domain].techniques[rule.ruleType] || 0) + 1;
    }

    return Object.entries(byDomain).map(([domain, data]) => ({
      domain,
      fileCount: data.fileCount,
      totalOriginalSize: data.totalOriginalSize,
      totalCompressedSize: data.totalCompressedSize,
      compressionRatio: data.totalCompressedSize / (data.totalOriginalSize || 1),
      topTechnique: Object.entries(data.techniques).sort((a, b) => b[1] - a[1])[0][0],
    }));
  }

  /**
   * Get performance timeline
   */
  async getPerformanceTimeline(hours: number = 24): Promise<
    Array<{
      timestamp: string;
      compressionCount: number;
      avgRatio: number;
      avgTimeMs: number;
    }>
  > {
    const allRules = await db.query.brainRules.findMany();

    // Group by hour
    const timeline: Record<string, any> = {};

    for (const rule of allRules) {
      const date = new Date(rule.createdAt);
      const hourKey = date.toISOString().slice(0, 13) + ":00";

      if (!timeline[hourKey]) {
        timeline[hourKey] = {
          count: 0,
          totalRatio: 0,
          totalTime: 0,
        };
      }

      timeline[hourKey].count++;
      timeline[hourKey].totalRatio += rule.compressedSize / rule.originalSize;
      timeline[hourKey].totalTime += rule.reconstructionTimeMs || 0;
    }

    return Object.entries(timeline)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([timestamp, data]) => ({
        timestamp,
        compressionCount: data.count,
        avgRatio: data.totalRatio / data.count,
        avgTimeMs: data.totalTime / data.count,
      }));
  }

  /**
   * Helper: Find top file for technique
   */
  private findTopFile(
    rules: any[],
  ): {
    ratio: number;
    savedBytes: number;
  } | null {
    if (rules.length === 0) return null;

    const topRule = rules.reduce((best, current) => {
      const currentSavings = current.originalSize - current.compressedSize;
      const bestSavings = best.originalSize - best.compressedSize;
      return currentSavings > bestSavings ? current : best;
    });

    return {
      ratio: topRule.compressedSize / topRule.originalSize,
      savedBytes: topRule.originalSize - topRule.compressedSize,
    };
  }

  /**
   * Helper: Analyze compression trend
   */
  private analyzeTrend(byTechnique: Record<CompressionTechnique, TechniqueMetrics>): string {
    const avgRatios = Object.values(byTechnique).map((t) => t.avgCompressionRatio);
    const average = avgRatios.reduce((a, b) => a + b, 0) / (avgRatios.length || 1);

    if (average < 0.15) return "excellent";
    if (average < 0.3) return "improving";
    if (average < 0.5) return "stable";
    return "declining";
  }
}

export const metricsCollector = new BrainMetricsCollector();
