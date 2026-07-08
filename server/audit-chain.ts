/**
 * PHASE 5A: Audit Chain Linking
 * 
 * Tamper-proof audit chain using cryptographic linking.
 * Each audit entry links to the previous one, creating an immutable sequence.
 * 
 * Architecture:
 * - Chain ID: hash(prevHash + currentData + timestamp)
 * - Enables detection of any tampering
 * - Blockchain-ready for Phase 5B anchoring to Polygon
 */

import crypto from 'crypto';

export interface ChainEntry {
  id: string; // Database row ID
  chainId: string; // Unique chain link hash
  prevChainHash: string | null; // Hash of previous entry (null for first entry)
  currentHash: string; // Hash of this entry's data
  timestamp: string;
  method: string;
  path: string;
  userId?: string;
  statusCode: number;
  ip: string;
  duration: number;
  sequenceNumber: number; // Position in chain (1, 2, 3...)
}

export interface ChainVerificationResult {
  valid: boolean;
  integrityScore: number; // 0-100%
  chainLength: number;
  lastHash: string;
  firstHash: string;
  tamperedEntries: number[];
  issues: string[];
  firstTamperedAt?: number;
  timestamp: string;
}

/**
 * Generate chain hash for an entry
 * Formula: SHA256(prevHash + currentDataHash + timestamp + sequenceNumber)
 */
export function generateChainHash(
  prevChainHash: string | null,
  entryData: any,
  sequenceNumber: number
): string {
  const dataHash = crypto.createHash('sha256')
    .update(JSON.stringify(entryData))
    .digest('hex');

  const chainInput = [
    prevChainHash || 'GENESIS',
    dataHash,
    new Date().toISOString(),
    String(sequenceNumber),
  ].join('|');

  return crypto.createHash('sha256')
    .update(chainInput)
    .digest('hex');
}

/**
 * Verify that a chain entry's hash is correct
 */
export function verifyChainLink(
  entry: ChainEntry,
  expectedPrevHash: string | null
): { valid: boolean; reason?: string } {
  // Verify previous hash matches
  if (entry.prevChainHash !== expectedPrevHash) {
    return {
      valid: false,
      reason: `Previous hash mismatch. Expected: ${expectedPrevHash}, Got: ${entry.prevChainHash}`,
    };
  }

  // Reconstruct the entry data (everything except chainId and hashes)
  const entryData = {
    timestamp: entry.timestamp,
    method: entry.method,
    path: entry.path,
    userId: entry.userId,
    statusCode: entry.statusCode,
    ip: entry.ip,
    duration: entry.duration,
    sequenceNumber: entry.sequenceNumber,
  };

  // Recompute expected chain hash
  const expectedChainHash = generateChainHash(
    entry.prevChainHash,
    entryData,
    entry.sequenceNumber
  );

  if (entry.chainId !== expectedChainHash) {
    return {
      valid: false,
      reason: `Chain hash mismatch. Expected: ${expectedChainHash}, Got: ${entry.chainId}`,
    };
  }

  return { valid: true };
}

/**
 * Verify entire chain from head back to genesis
 * Returns tampered entries and integrity score
 */
export function verifyChain(entries: ChainEntry[]): ChainVerificationResult {
  const timestamp = new Date().toISOString();
  
  if (entries.length === 0) {
    return {
      valid: true,
      integrityScore: 100,
      chainLength: 0,
      lastHash: '',
      firstHash: '',
      tamperedEntries: [],
      issues: ['Chain is empty'],
      timestamp,
    };
  }

  const tamperedEntries: number[] = [];
  const issues: string[] = [];

  // Sort by sequence number to verify chain order
  const sorted = [...entries].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  // Verify sequence is continuous (no gaps)
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i + 1].sequenceNumber !== sorted[i].sequenceNumber + 1) {
      issues.push(`Gap in sequence at entry ${sorted[i].sequenceNumber}`);
    }
  }

  // Verify each link in the chain
  let expectedPrevHash = null;
  for (const entry of sorted) {
    const verification = verifyChainLink(entry, expectedPrevHash);

    if (!verification.valid) {
      tamperedEntries.push(entry.sequenceNumber);
      issues.push(`Entry ${entry.sequenceNumber}: ${verification.reason}`);
    }

    expectedPrevHash = entry.chainId;
  }

  const integrityScore = ((sorted.length - tamperedEntries.length) / sorted.length) * 100;
  const firstTamperedAt = tamperedEntries.length > 0 ? tamperedEntries[0] : undefined;

  return {
    valid: tamperedEntries.length === 0 && issues.length === 0,
    integrityScore,
    chainLength: sorted.length,
    lastHash: sorted[sorted.length - 1].chainId,
    firstHash: sorted[0].chainId,
    tamperedEntries,
    issues,
    firstTamperedAt,
    timestamp,
  };
}

/**
 * Generate a tamper-proof chain report for audit purposes
 * Can be used for compliance, internal audits, blockchain anchoring
 */
export function generateChainReport(
  entries: ChainEntry[],
  reportMetadata?: Record<string, any>
): {
  reportId: string;
  timestamp: string;
  verification: ChainVerificationResult;
  metadata?: Record<string, any>;
  signature: string;
} {
  const verification = verifyChain(entries);
  const reportId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  const reportContent = {
    reportId,
    timestamp,
    verification,
    metadata: reportMetadata || {},
    chainLength: entries.length,
    dateRange: entries.length > 0 ? {
      start: entries[0].timestamp,
      end: entries[entries.length - 1].timestamp,
    } : null,
  };

  const signature = crypto.createHash('sha256')
    .update(JSON.stringify(reportContent))
    .digest('hex');

  return {
    reportId,
    timestamp,
    verification,
    metadata: reportMetadata,
    signature,
  };
}

/**
 * Export chain in blockchain-ready format
 * Each entry includes prev hash for Merkle tree construction
 */
export function exportChainForBlockchain(entries: ChainEntry[]): {
  entries: Array<{
    sequence: number;
    chainId: string;
    prevHash: string | null;
    timestamp: string;
    path: string;
    statusCode: number;
  }>;
  merkleRoot: string;
  timestamp: string;
} {
  const sorted = [...entries].sort((a, b) => a.sequenceNumber - b.sequenceNumber);

  // Build Merkle tree from chain hashes
  let hashes = sorted.map(e => e.chainId);
  while (hashes.length > 1) {
    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const combined = hashes[i] + (hashes[i + 1] || hashes[i]);
      const hash = crypto.createHash('sha256')
        .update(combined)
        .digest('hex');
      nextLevel.push(hash);
    }
    hashes = nextLevel;
  }

  const merkleRoot = hashes[0] || '';

  return {
    entries: sorted.map(e => ({
      sequence: e.sequenceNumber,
      chainId: e.chainId,
      prevHash: e.prevChainHash,
      timestamp: e.timestamp,
      path: e.path,
      statusCode: e.statusCode,
    })),
    merkleRoot,
    timestamp: new Date().toISOString(),
  };
}
