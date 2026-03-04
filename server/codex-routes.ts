import { Router, Request, Response } from "express";
import { storage } from "./storage";
import { ellomental } from "./ellomental-hash";
import { extractPatternsFromArchive } from "./pattern-extractor";
import { insertPatternSchema, insertPatternLinkSchema } from "@shared/schema";

export const codexRouter = Router();

let extractionInProgress = false;

codexRouter.post("/patterns", async (req: Request, res: Response) => {
  try {
    const { title, description, category, sourceType, sourceReference, discoveredBy, publicSummary } = req.body;
    if (!title || !description || !category) {
      return res.status(400).json({ error: "title, description, and category are required" });
    }

    const originTimestamp = new Date();
    const hashInput = `${title}|${description}|${discoveredBy || "Phillip Aguilar Ruiz III"}|${originTimestamp.toISOString()}`;
    const { circleHash } = ellomental(hashInput);

    const existing = await storage.checkDuplicateHash(circleHash);
    if (existing) {
      await storage.createPatternAlert({
        patternId: existing.id,
        alertType: "DUPLICATE_DETECTED",
        message: `Duplicate pattern detected: "${title}" matches existing pattern "${existing.title}"`,
      });
      return res.status(409).json({ error: "Duplicate pattern detected", existing });
    }

    const pattern = await storage.createPattern({
      title,
      description,
      publicSummary: publicSummary || null,
      category,
      sourceType: sourceType || "manual",
      sourceReference: sourceReference || null,
      discoveredBy: discoveredBy || "Phillip Aguilar Ruiz III",
      elloHash: circleHash,
      originTimestamp,
      verified: false,
      active: true,
      public: false,
      metadata: null,
    });

    await storage.createPatternAlert({
      patternId: pattern.id,
      alertType: "NEW_PATTERN",
      message: `New pattern claimed: "${title}" [${category}]`,
    });

    res.json(pattern);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/patterns", async (req: Request, res: Response) => {
  try {
    const { category, sourceType, verified, public: isPublic, page, limit, search } = req.query;

    if (search && typeof search === "string") {
      const results = await storage.searchPatterns(search);
      return res.json(results);
    }

    const filters: any = {};
    if (category) filters.category = category;
    if (sourceType) filters.sourceType = sourceType;
    if (verified === "true") filters.verified = true;
    if (verified === "false") filters.verified = false;
    if (isPublic === "true") filters.public = true;
    if (isPublic === "false") filters.public = false;
    filters.limit = parseInt(limit as string) || 50;
    filters.offset = ((parseInt(page as string) || 1) - 1) * filters.limit;

    const patterns = await storage.getPatterns(filters);

    const fingerprintHash = req.headers["x-fingerprint"] as string;
    let isOwner = false;
    if (fingerprintHash) {
      const fp = await storage.getFingerprint(fingerprintHash);
      isOwner = fp?.isOwner ?? false;
    }

    const safePatterns = patterns.map(p => {
      if (p.public && !isOwner) {
        return {
          id: p.id,
          title: p.title,
          publicSummary: p.publicSummary,
          category: p.category,
          discoveredBy: p.discoveredBy,
          elloHash: p.elloHash.slice(0, 16),
          originTimestamp: p.originTimestamp,
          verified: p.verified,
          public: p.public,
        };
      }
      return p;
    });

    res.json(safePatterns);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/patterns/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const pattern = await storage.getPatternById(id);
    if (!pattern) return res.status(404).json({ error: "Pattern not found" });

    const links = await storage.getPatternLinks(id);
    res.json({ ...pattern, links });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/stats", async (_req: Request, res: Response) => {
  try {
    const stats = await storage.getPatternStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (!q) return res.status(400).json({ error: "Search query required" });
    const results = await storage.searchPatterns(q);
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.patch("/patterns/:id/verify", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.verifyPattern(id);
    await storage.createPatternAlert({
      patternId: id,
      alertType: "VERIFIED",
      message: `Pattern #${id} verified by founder`,
    });
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.patch("/patterns/:id/publish", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { publicSummary } = req.body;
    await storage.togglePatternPublic(id, publicSummary);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.post("/extract-archive", async (_req: Request, res: Response) => {
  if (extractionInProgress) {
    return res.status(429).json({ error: "Extraction already in progress" });
  }
  extractionInProgress = true;
  try {
    const result = await extractPatternsFromArchive();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  } finally {
    extractionInProgress = false;
  }
});

codexRouter.post("/links", async (req: Request, res: Response) => {
  try {
    const { fromPatternId, toPatternId, linkType, description, strength } = req.body;
    if (!fromPatternId || !toPatternId || !linkType) {
      return res.status(400).json({ error: "fromPatternId, toPatternId, and linkType required" });
    }
    const link = await storage.createPatternLink({
      fromPatternId,
      toPatternId,
      linkType,
      description: description || null,
      strength: strength || 5,
    });
    await storage.createPatternAlert({
      patternId: fromPatternId,
      alertType: "LINK_DISCOVERED",
      message: `New link: Pattern #${fromPatternId} ${linkType} Pattern #${toPatternId}`,
    });
    res.json(link);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/patterns/:id/links", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const links = await storage.getPatternLinks(id);
    res.json(links);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.delete("/links/:id", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deletePatternLink(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/patterns/:id/suggest-links", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const suggestions = await storage.suggestLinks(id);
    res.json(suggestions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/alerts", async (req: Request, res: Response) => {
  try {
    const unread = req.query.unread === "true";
    const alerts = await storage.getPatternAlerts(unread);
    res.json(alerts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.get("/alerts/count", async (_req: Request, res: Response) => {
  try {
    const count = await storage.getUnreadAlertCount();
    res.json({ count });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.patch("/alerts/:id/read", async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await storage.markAlertRead(id);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

codexRouter.patch("/alerts/read-all", async (_req: Request, res: Response) => {
  try {
    await storage.markAllAlertsRead();
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
