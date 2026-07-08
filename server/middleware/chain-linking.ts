/**
 * Chain Linking Middleware
 * 
 * Integrates audit chain into request pipeline.
 * After each audit entry is created, it's automatically linked to the previous entry.
 */

import type { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { generateChainHash } from '../audit-chain';

// Cache the last chain hash to avoid repeated DB queries
let cachedLastChainHash: { hash: string | null; timestamp: number } = {
  hash: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 5000; // Cache for 5 seconds

/**
 * Get the last chain hash from cache or DB
 */
async function getLastChainHash(): Promise<string | null> {
  const now = Date.now();
  
  // Use cache if fresh
  if (now - cachedLastChainHash.timestamp < CACHE_TTL_MS) {
    return cachedLastChainHash.hash;
  }

  try {
    const lastEntry = await storage.getLastAuditChainEntry();
    const hash = lastEntry?.chainId || null;
    
    cachedLastChainHash = {
      hash,
      timestamp: now,
    };

    return hash;
  } catch (error) {
    console.error('[CHAIN] Error retrieving last chain hash:', error);
    return null;
  }
}

/**
 * Invalidate cache (call when new entry is created)
 */
function invalidateCache(): void {
  cachedLastChainHash.timestamp = 0;
}

/**
 * Create a new chain entry linked to the previous one
 */
export async function createChainEntry(auditLogData: any): Promise<{
  chainId: string;
  prevChainHash: string | null;
  currentHash: string;
}> {
  try {
    // Get the previous chain hash
    const prevChainHash = await getLastChainHash();

    // Get the next sequence number
    const sequenceNumber = await storage.getAuditChainSequenceNumber();

    // Generate chain hash
    const chainId = generateChainHash(prevChainHash, auditLogData, sequenceNumber);

    // Store in database
    const entry = await storage.createAuditChainEntry({
      chainId,
      prevChainHash,
      currentHash: chainId,
      timestamp: auditLogData.timestamp,
      method: auditLogData.method,
      path: auditLogData.path,
      userId: auditLogData.userId,
      statusCode: auditLogData.statusCode,
      ip: auditLogData.ip,
      duration: auditLogData.duration,
      sequenceNumber,
    });

    // Invalidate cache
    invalidateCache();

    return {
      chainId,
      prevChainHash,
      currentHash: chainId,
    };
  } catch (error) {
    console.error('[CHAIN] Error creating chain entry:', error);
    throw error;
  }
}

/**
 * Middleware: Attach chain information to request for downstream use
 */
export function chainLinkingMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Store original json method
  const originalJson = res.json;

  // Wrap json method to capture response
  res.json = function (body: any, ...args: any[]) {
    // Store response data for chain linking (if needed by subsequent middleware)
    (res as any).chainData = body;
    return originalJson.apply(res, [body, ...args]);
  };

  res.on('finish', async () => {
    try {
      // Skip logging for certain paths
      const skipPaths = ['/health', '/metrics', '/alive'];
      if (skipPaths.some(p => req.path.includes(p))) {
        return;
      }

      // Prepare audit data
      const auditData = {
        timestamp: new Date().toISOString(),
        method: req.method,
        path: req.path,
        userId: (req as any).userId,
        statusCode: res.statusCode,
        ip: req.ip || 'unknown',
        duration: res.getHeader('X-Response-Time') || 0,
      };

      // Create chain entry
      await createChainEntry(auditData);
    } catch (error) {
      console.error('[CHAIN] Error in chain linking middleware:', error);
      // Don't fail the request if chain linking fails
    }
  });

  next();
}

/**
 * Export for manual chain entry creation (e.g., triggered by specific events)
 */
export { createChainEntry as linkAuditToChain };
