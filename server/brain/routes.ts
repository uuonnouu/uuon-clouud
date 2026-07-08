import { Express, Request, Response } from "express";
import { brainService } from "./service";
import { brainScanner } from "./scanner";
import { metricsCollector } from "./metrics-collector";

/**
 * Brain Compression API Routes
 * 
 * Endpoints:
 * - POST /api/brain/compress - Compress a file
 * - POST /api/brain/reconstruct - Reconstruct from rule
 * - GET /api/brain/inventory - List all inventoried files
 * - GET /api/brain/metrics - Get compression metrics
 * - POST /api/brain/scan - Re-scan Brain directory
 * - GET /api/brain/dashboard - Full metrics dashboard
 * - GET /api/brain/technique/:technique/metrics - Per-technique metrics
 * - GET /api/brain/distribution - Compression ratio distribution
 * - GET /api/brain/domains - Metrics by domain
 * - GET /api/brain/timeline - Performance timeline
 */

export async function registerBrainRoutes(app: Express): Promise<void> {
  /**
   * POST /api/brain/compress
   * Compress a file and store the rule
   */
  app.post("/api/brain/compress", async (req: Request, res: Response) => {
    try {
      const { filePath, content, fileName } = req.body;

      if (!filePath || !content) {
        return res.status(400).json({ error: "Missing filePath or content" });
      }

      const result = await brainService.compressFile(content, {
        filePath,
        fileName: fileName || filePath.split("/").pop() || "unknown",
        fileSize: Buffer.byteLength(content, "utf-8"),
        contentHash: "",
      });

      if (!result) {
        return res.status(500).json({ error: "Compression failed" });
      }

      return res.json({
        ruleId: result.ruleId,
        ruleType: result.ruleType,
        originalSize: result.originalSize,
        compressedSize: result.compressedSize,
        compressionRatio: result.compressionRatio,
        stored: true,
      });
    } catch (error) {
      console.error("[Brain API] Compression error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * POST /api/brain/reconstruct
   * Reconstruct content from stored rule
   */
  app.post("/api/brain/reconstruct", async (req: Request, res: Response) => {
    try {
      const { ruleId } = req.body;

      if (!ruleId) {
        return res.status(400).json({ error: "Missing ruleId" });
      }

      const content = await brainService.reconstructRule(ruleId);

      if (!content) {
        return res.status(404).json({ error: "Rule not found or reconstruction failed" });
      }

      return res.json({
        content,
        size: Buffer.byteLength(content, "utf-8"),
      });
    } catch (error) {
      console.error("[Brain API] Reconstruction error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/inventory
   * Get brain file inventory
   */
  app.get("/api/brain/inventory", async (req: Request, res: Response) => {
    try {
      const { domain, priority } = req.query;

      let files = brainScanner.getInventory();

      if (domain) {
        files = files.filter((f) => f.domain === domain);
      }

      if (priority) {
        files = files.filter((f) => f.priority === priority);
      }

      const stats = brainScanner.getStats();

      return res.json({
        files,
        stats,
        count: files.length,
      });
    } catch (error) {
      console.error("[Brain API] Inventory error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/metrics
   * Get compression metrics by technique
   */
  app.get("/api/brain/metrics", async (req: Request, res: Response) => {
    try {
      const metrics = await brainService.getMetrics();
      const summary = await brainService.getInventorySummary();

      return res.json({
        byTechnique: metrics,
        summary,
      });
    } catch (error) {
      console.error("[Brain API] Metrics error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * POST /api/brain/scan
   * Re-scan Brain directory
   */
  app.post("/api/brain/scan", async (req: Request, res: Response) => {
    try {
      console.log("[Brain API] Re-scanning Brain directory...");

      const inventory = await brainScanner.scan();
      const stats = brainScanner.getStats();

      return res.json({
        filesScanned: inventory.length,
        stats,
        message: "Scan complete",
      });
    } catch (error) {
      console.error("[Brain API] Scan error:", error);
      return res.status(500).json({ error: "Scan failed" });
    }
  });

  /**
   * GET /api/brain/status
   * Get overall Brain system status
   */
  app.get("/api/brain/status", async (req: Request, res: Response) => {
    try {
      const stats = brainScanner.getStats();
      const summary = await brainService.getInventorySummary();
      const metrics = await brainService.getMetrics();

      return res.json({
        status: "operational",
        inventory: stats,
        summary,
        metrics,
        ready: true,
      });
    } catch (error) {
      console.error("[Brain API] Status error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/dashboard
   * Get comprehensive dashboard metrics
   */
  app.get("/api/brain/dashboard", async (req: Request, res: Response) => {
    try {
      const dashboardMetrics = await metricsCollector.collectDashboardMetrics();
      return res.json(dashboardMetrics);
    } catch (error) {
      console.error("[Brain API] Dashboard error:", error);
      return res.status(500).json({ error: "Failed to collect metrics" });
    }
  });

  /**
   * GET /api/brain/technique/:technique/metrics
   * Get metrics for specific compression technique
   */
  app.get("/api/brain/technique/:technique/metrics", async (req: Request, res: Response) => {
    try {
      const { technique } = req.params;
      const techniqueMetrics = await metricsCollector.getTechniqueMetrics(technique as any);

      if (!techniqueMetrics) {
        return res.status(404).json({ error: "Technique not found" });
      }

      return res.json(techniqueMetrics);
    } catch (error) {
      console.error("[Brain API] Technique metrics error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/distribution
   * Get compression ratio distribution
   */
  app.get("/api/brain/distribution", async (req: Request, res: Response) => {
    try {
      const distribution = await metricsCollector.getRatioDistribution();
      return res.json({ distribution });
    } catch (error) {
      console.error("[Brain API] Distribution error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/domains
   * Get metrics by domain
   */
  app.get("/api/brain/domains", async (req: Request, res: Response) => {
    try {
      const domains = await metricsCollector.getMetricsByDomain();
      return res.json({ domains });
    } catch (error) {
      console.error("[Brain API] Domains error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  /**
   * GET /api/brain/timeline
   * Get performance timeline
   */
  app.get("/api/brain/timeline", async (req: Request, res: Response) => {
    try {
      const { hours = "24" } = req.query;
      const timeline = await metricsCollector.getPerformanceTimeline(parseInt(hours as string) || 24);
      return res.json({ timeline });
    } catch (error) {
      console.error("[Brain API] Timeline error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  console.log("[Brain Routes] Registered successfully");
}
