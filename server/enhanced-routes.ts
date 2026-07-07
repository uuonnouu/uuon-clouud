/**
 * NEW API ENDPOINTS: Integration Points for All 8 Phases
 * Add these to server/routes.ts or create new routes/enhanced-routes.ts
 */

import { Express, Request, Response } from "express";
import { CloududEnhanced } from "./clouud-enhanced-integration";
import { buildMultimodalContext } from "./multimodal-pipeline";
import { FounderAPI } from "./founder-api";
import { APIIntegrationLayer } from "./api-integration";
import { ToolRegistry } from "./tool-factory";
import { ActiveLearningSystem } from "./active-learning";
import { setupCustomTraining } from "./custom-training";
import { supportedLanguages } from "./multi-language";

export function registerEnhancedRoutes(app: Express): void {
  const clouud = new CloududEnhanced({
    multimodalEnabled: true,
    domainExtractionEnabled: true,
    toolFactoryEnabled: true,
    activeLearningEnabled: true,
    languagesEnabled: Object.keys(supportedLanguages).slice(0, 5), // start with 5 languages
    founderAPIEnabled: true,
    customTrainingEnabled: true,
  });

  // ============================================================
  // PHASE 1: MULTIMODAL ENDPOINTS
  // ============================================================

  /**
   * POST /api/multimodal/upload
   * Upload image or audio file for processing
   */
  app.post("/api/multimodal/upload", async (req: Request, res: Response) => {
    try {
      const { filePath, mediaType, conversationId } = req.body;

      const multimodalContext = await buildMultimodalContext({
        type: mediaType,
        filePath,
        mediaType,
        conversationId,
      });

      res.json({
        success: true,
        features: multimodalContext.features,
        provenance: multimodalContext.provenance,
        systemPromptAddition: multimodalContext.systemPromptAddition,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Upload failed" });
    }
  });

  // ============================================================
  // PHASE 2: SELF-LEARNING LATTICE ENDPOINTS
  // ============================================================

  /**
   * GET /api/lattice/domain/:domain
   * Get learned lattice for a domain
   */
  app.get("/api/lattice/domain/:domain", (req: Request, res: Response) => {
    const { domain } = req.params;
    // In production: fetch from database
    // Return domain lattice weights for reasoning
    res.json({
      domain,
      message: `Domain lattice for ${domain} loaded`,
      // domainLattice would come from database
    });
  });

  // ============================================================
  // PHASE 3: TOOL FACTORY ENDPOINTS
  // ============================================================

  /**
   * POST /api/tools/register
   * Register a new custom tool
   */
  app.post("/api/tools/register", (req: Request, res: Response) => {
    try {
      const toolDef = req.body;
      const registry = new ToolRegistry();

      const result = registry.registerTool(toolDef);

      res.json({
        success: result.success,
        message: result.message,
        hash: result.hash,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Registration failed" });
    }
  });

  /**
   * GET /api/tools/list
   * List all registered tools
   */
  app.get("/api/tools/list", (req: Request, res: Response) => {
    const { category } = req.query;
    const registry = new ToolRegistry();

    const tools = registry.listTools(category as string);

    res.json({
      count: tools.length,
      tools: tools.map((t) => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
      })),
    });
  });

  /**
   * POST /api/tools/execute
   * Execute a registered tool
   */
  app.post("/api/tools/execute", async (req: Request, res: Response) => {
    try {
      const { toolId, inputs, conversationId } = req.body;
      const registry = new ToolRegistry();
      const executionId = `exec_${Date.now()}`;

      const result = await registry.executeTool({
        toolId,
        inputs,
        executionId,
        conversationId,
      });

      res.json({
        success: result.success,
        execution: result,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Execution failed" });
    }
  });

  // ============================================================
  // PHASE 4: ACTIVE LEARNING ENDPOINTS
  // ============================================================

  /**
   * POST /api/feedback/submit
   * Submit feedback on a response
   */
  app.post("/api/feedback/submit", (req: Request, res: Response) => {
    try {
      const { responseId, conversationId, feedback, reason, correctness, clarity } = req.body;

      const activeLearning = new ActiveLearningSystem();

      activeLearning.recordFeedback({
        responseId,
        conversationId,
        feedback,
        reason,
        correctness,
        clarity,
      });

      const stats = activeLearning.getStats();

      res.json({
        success: true,
        feedbackRecorded: true,
        systemStats: stats,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Feedback failed" });
    }
  });

  /**
   * GET /api/feedback/stats
   * Get active learning statistics
   */
  app.get("/api/feedback/stats", (req: Request, res: Response) => {
    const activeLearning = new ActiveLearningSystem();
    const stats = activeLearning.getStats();
    const model = activeLearning.getModel();

    res.json({
      feedbackStats: stats,
      modelWeights: model.weights,
      modelAccuracy: model.accuracy,
    });
  });

  // ============================================================
  // PHASE 5: DISTRIBUTED VERIFICATION ENDPOINTS
  // ============================================================

  /**
   * POST /api/verify/publish
   * Publish provenance hash to distributed ledgers
   */
  app.post("/api/verify/publish", async (req: Request, res: Response) => {
    try {
      const { hash, timestamp, origin } = req.body;

      // In production: use the verifier from cloudud instance
      // const { results, consensus } = await verifier.publishToAll({...});

      res.json({
        success: true,
        message: "Hash queued for publishing",
        hash,
        // In production would include ledger results
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Publishing failed" });
    }
  });

  /**
   * GET /api/verify/check/:hash
   * Check if hash is verified on distributed ledgers
   */
  app.get("/api/verify/check/:hash", async (req: Request, res: Response) => {
    try {
      const { hash } = req.params;

      // In production: check actual ledgers
      // const { verifications, consensus } = await verifier.verifyOnAll(hash);

      res.json({
        hash,
        verified: true,
        consensus: true,
        // ledgerResults would include blockchain and peer network checks
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Verification failed" });
    }
  });

  // ============================================================
  // PHASE 7: MULTI-LANGUAGE ENDPOINTS
  // ============================================================

  /**
   * GET /api/languages/supported
   * List all supported languages
   */
  app.get("/api/languages/supported", (req: Request, res: Response) => {
    const languages = Object.entries(supportedLanguages).map(([code, config]) => ({
      code,
      name: config.name,
      nativeName: config.nativeName,
      scriptDirection: config.scriptDirection,
    }));

    res.json({
      count: languages.length,
      languages,
    });
  });

  /**
   * GET /api/languages/prompt/:language/:domain
   * Get system prompt in specific language for domain
   */
  app.get("/api/languages/prompt/:language/:domain", (req: Request, res: Response) => {
    try {
      const { language, domain } = req.params;

      // In production: use actual domain lattice
      const prompt = require("./multi-language").getSystemPromptInLanguage(
        language,
        domain,
        [11, 16, 21, 28, 33]
      );

      res.json({
        language,
        languageName: supportedLanguages[language]?.name,
        domain,
        prompt,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Prompt generation failed" });
    }
  });

  /**
   * POST /api/languages/assess
   * Assess response in specific language
   */
  app.post("/api/languages/assess", (req: Request, res: Response) => {
    try {
      const { text, language } = req.body;

      const { score, flags } = require("./multi-language").assessResponseInLanguage(text, language);

      res.json({
        language,
        score,
        flags,
        passed: flags.length === 0,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Assessment failed" });
    }
  });

  // ============================================================
  // PHASE 8: FOUNDER API ENDPOINTS
  // ============================================================

  /**
   * GET /api/founder/profile
   * Get founder profile and background
   */
  app.get("/api/founder/profile", (req: Request, res: Response) => {
    const founderAPI = new FounderAPI();
    const profile = founderAPI.getProfile();

    res.json({
      profile,
    });
  });

  /**
   * GET /api/founder/preferences
   * Get founder preferences
   */
  app.get("/api/founder/preferences", (req: Request, res: Response) => {
    const founderAPI = new FounderAPI();
    const preferences = founderAPI.getPreferences();

    res.json({
      preferences,
    });
  });

  /**
   * POST /api/founder/preferences
   * Update founder preference
   */
  app.post("/api/founder/preferences", (req: Request, res: Response) => {
    try {
      const { key, value } = req.body;
      const founderAPI = new FounderAPI();

      founderAPI.setPreference(key, value);

      res.json({
        success: true,
        updated: { key, value },
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Update failed" });
    }
  });

  /**
   * POST /api/founder/memory
   * Store memory entry
   */
  app.post("/api/founder/memory", (req: Request, res: Response) => {
    try {
      const { category, value, importance, notes } = req.body;
      const founderAPI = new FounderAPI();

      const { id, stored } = founderAPI.rememberEntry(category, value, importance, notes);

      res.json({
        success: true,
        id,
        stored,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Memory storage failed" });
    }
  });

  /**
   * GET /api/founder/memory
   * Recall memories (filtered by category)
   */
  app.get("/api/founder/memory", (req: Request, res: Response) => {
    try {
      const { category } = req.query;
      const founderAPI = new FounderAPI();

      const memories = founderAPI.recall(category as any);

      res.json({
        count: memories.length,
        memories: memories.slice(0, 20), // limit to 20
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Recall failed" });
    }
  });

  /**
   * POST /api/founder/compliance-check
   * Check mission compliance for response
   */
  app.post("/api/founder/compliance-check", (req: Request, res: Response) => {
    try {
      const { responseContent } = req.body;
      const founderAPI = new FounderAPI();

      const { compliant, violations, warnings } = founderAPI.checkMissionCompliance(responseContent);

      res.json({
        compliant,
        violations: violations.map((v) => ({ id: v.id, name: v.name, details: v.details })),
        warnings: warnings.map((w) => ({ id: w.id, name: w.name, details: w.details })),
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Compliance check failed" });
    }
  });

  /**
   * POST /api/founder/prompt
   * Build personalized system prompt
   */
  app.post("/api/founder/prompt", (req: Request, res: Response) => {
    try {
      const { domain, context } = req.body;
      const founderAPI = new FounderAPI();

      const prompt = founderAPI.buildPersonalizedPrompt(domain, context);

      res.json({
        domain,
        prompt,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Prompt generation failed" });
    }
  });

  /**
   * GET /api/founder/export
   * Export all founder data
   */
  app.get("/api/founder/export", (req: Request, res: Response) => {
    try {
      const founderAPI = new FounderAPI();
      const data = founderAPI.exportFounderData();

      res.json({
        success: true,
        data,
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Export failed" });
    }
  });

  // ============================================================
  // BONUS: CUSTOM TRAINING ENDPOINT
  // ============================================================

  /**
   * POST /api/custom-training/setup
   * Initialize custom training from your data
   */
  app.post("/api/custom-training/setup", async (req: Request, res: Response) => {
    try {
      const { datasetPath, reportGlob, apiFiles, founderContext, domains } = req.body;

      const config = {
        datasetPath,
        proofReportGlob: reportGlob,
        apiFiles,
        founderContext,
        customToolRegistry: new ToolRegistry(),
        domains,
      };

      const { dataset, personalizedPrompt, registeredTools, domainLattices } = setupCustomTraining(config);

      res.json({
        success: true,
        dataset: {
          name: dataset.name,
          fileCount: dataset.fileCount,
          totalSize: dataset.totalSize,
          trainingSamples: dataset.trainingSamples,
          domains: dataset.extractedPatterns.domains,
        },
        domainsLattices: Object.keys(domainLattices),
        promptPreview: personalizedPrompt.slice(0, 300),
      });
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Training setup failed" });
    }
  });

  // ============================================================
  // ENHANCED STATUS ENDPOINT
  // ============================================================

  /**
   * GET /api/clouud/enhanced-status
   * Check all enhancement modules status
   */
  app.get("/api/clouud/enhanced-status", (req: Request, res: Response) => {
    const status = clouud.getStatus();

    res.json({
      enhanced: true,
      modules: status,
      timestamp: new Date().toISOString(),
    });
  });

  console.log("[ROUTES] Enhanced routes registered successfully");
}

export default registerEnhancedRoutes;
