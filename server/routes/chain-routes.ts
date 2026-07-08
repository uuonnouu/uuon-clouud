/**
 * Chain Validation Routes
 * 
 * Endpoints for verifying audit chain integrity, checking status, and generating reports.
 */

import type { Express, Request, Response } from 'express';
import { storage } from '../storage';
import { verifyChain, generateChainReport, exportChainForBlockchain } from '../audit-chain';
import { requireAuth } from '../middleware/auth';

export function registerChainRoutes(app: Express): void {
  /**
   * GET /api/chain/status
   * Returns current chain state: length, last hash, sequence number
   */
  app.get('/api/chain/status', async (_req: Request, res: Response) => {
    try {
      const lastEntry = await storage.getLastAuditChainEntry();
      const totalEntries = await storage.getAuditChainSize();

      res.json({
        status: 'active',
        chainLength: totalEntries,
        lastEntry: lastEntry ? {
          sequence: lastEntry.sequenceNumber,
          chainId: lastEntry.chainId,
          timestamp: lastEntry.timestamp,
          path: lastEntry.path,
          statusCode: lastEntry.statusCode,
        } : null,
        lastHash: lastEntry?.chainId || null,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/chain/verify?limit=100
   * Verify chain integrity for last N entries
   * Returns tampered entries and integrity score
   */
  app.get('/api/chain/verify', async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 1000;
      const entries = await storage.getAuditChainEntries(limit);

      const verification = verifyChain(entries);

      res.json({
        verification,
        entriesChecked: entries.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/chain/verify/:sequenceStart/:sequenceEnd
   * Verify a specific range of the chain
   */
  app.get('/api/chain/verify/:sequenceStart/:sequenceEnd', async (req: Request, res: Response) => {
    try {
      const start = parseInt(req.params.sequenceStart);
      const end = parseInt(req.params.sequenceEnd);

      if (isNaN(start) || isNaN(end) || start > end) {
        return res.status(400).json({ error: 'Invalid sequence range' });
      }

      const entries = await storage.getAuditChainEntriesBySequence(start, end);

      if (entries.length === 0) {
        return res.status(404).json({ error: 'No entries found in range' });
      }

      const verification = verifyChain(entries);

      res.json({
        range: { start, end },
        verification,
        entriesChecked: entries.length,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/chain/report
   * Generate comprehensive chain report with signature
   * Returns blockchain-ready format
   */
  app.get('/api/chain/report', async (req: Request, res: Response) => {
    try {
      const entries = await storage.getAuditChainEntries(10000);

      const report = generateChainReport(entries, {
        reportedAt: new Date().toISOString(),
        reportedBy: (req as any).userId || 'anonymous',
        environment: process.env.NODE_ENV,
      });

      res.json(report);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/chain/export-blockchain
   * Export chain in Merkle tree format for blockchain anchoring
   * Phase 5B preparation
   */
  app.get('/api/chain/export-blockchain', async (req: Request, res: Response) => {
    try {
      const entries = await storage.getAuditChainEntries(100000);

      const blockchainExport = exportChainForBlockchain(entries);

      res.json({
        blockchain: blockchainExport,
        format: 'merkle-tree',
        ready: true,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * GET /api/chain/health
   * Diagnostic endpoint for chain health
   * Used for monitoring and PMCs
   */
  app.get('/api/chain/health', async (_req: Request, res: Response) => {
    try {
      const lastEntry = await storage.getLastAuditChainEntry();
      const totalEntries = await storage.getAuditChainSize();
      const recentEntries = await storage.getAuditChainEntries(100);

      const verification = verifyChain(recentEntries);

      const health = {
        status: verification.valid ? 'healthy' : 'compromised',
        chainLength: totalEntries,
        recentIntegrity: verification.integrityScore,
        lastHash: lastEntry?.chainId || null,
        lastSequence: lastEntry?.sequenceNumber || 0,
        issuesDetected: verification.issues.length,
        issues: verification.issues.slice(0, 5), // First 5 issues
        timestamp: new Date().toISOString(),
      };

      const statusCode = health.status === 'healthy' ? 200 : 400;
      res.status(statusCode).json(health);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * POST /api/chain/diagnose
   * Full diagnostic scan (admin only, recommended)
   * WARNING: May be slow on large chains
   */
  app.post('/api/chain/diagnose', requireAuth, async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.body.limit || '5000');
      const entries = await storage.getAuditChainEntries(limit);

      const verification = verifyChain(entries);

      const diagnostic = {
        timestamp: new Date().toISOString(),
        scanDepth: entries.length,
        maxLimit: limit,
        verification,
        recommendations: [] as string[],
      };

      // Generate recommendations based on findings
      if (!verification.valid) {
        diagnostic.recommendations.push('Chain integrity compromised — investigate tampered entries');
        if (verification.firstTamperedAt) {
          diagnostic.recommendations.push(`Tampering detected starting at entry ${verification.firstTamperedAt}`);
        }
      }

      if (verification.integrityScore < 50) {
        diagnostic.recommendations.push('Critical: More than 50% of entries are invalid');
      }

      if (verification.chainLength > 100000) {
        diagnostic.recommendations.push('Consider archiving old chain entries for performance');
      }

      if (verification.issues.length > 0) {
        diagnostic.recommendations.push(`Address ${verification.issues.length} issues in chain`);
      } else {
        diagnostic.recommendations.push('Chain is operating normally');
      }

      res.json(diagnostic);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
