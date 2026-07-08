import crypto from "crypto";
import { parametricHandler } from "./parametric";
import { temporalHandler } from "./temporal";
import { relationshipHandler } from "./relationship";
import { transformationHandler } from "./transformation";
import { functionalHandler } from "./functional";
import { constraintsHandler } from "./constraints";
import { deterministicHandler } from "./deterministic";
import { CompressionHandler, CompressionResult, BrainFileMetadata, CompressionTechnique } from "../types";

/**
 * Brain Compression Pipeline Orchestrator
 * 
 * Coordinates all compression handlers and selects the best technique
 * for each piece of content.
 * 
 * Strategy:
 * 1. Load all handlers (parametric, temporal, relationship, etc.)
 * 2. For each file: test which handlers apply (canHandle)
 * 3. Run all applicable handlers in parallel
 * 4. Select handler with best compression ratio
 * 5. Store rule in database
 */

export class CompressionOrchestrator {
  private handlers: CompressionHandler[] = [];
  private minCompressionThreshold = 0.9; // Don't store if compression < 10%

  constructor() {
    // Register all 7 compression handlers
    this.handlers = [
      parametricHandler,
      temporalHandler,
      relationshipHandler,
      transformationHandler,
      functionalHandler,
      constraintsHandler,
      deterministicHandler,
    ];
  }

  /**
   * Compress a single file
   * Returns the best compression result among applicable handlers
   */
  async compressFile(content: string, metadata: BrainFileMetadata): Promise<CompressionResult | null> {
    // Find applicable handlers
    const applicableHandlers = this.handlers.filter((h) => h.canHandle(content, metadata));

    if (applicableHandlers.length === 0) {
      // No handler applies; store as-is
      return this.createFallbackResult(content, metadata);
    }

    // Run all applicable handlers in parallel
    const results = await Promise.all(applicableHandlers.map((h) => h.compress(content, metadata)));

    // Select best result (lowest compression ratio)
    let bestResult = results[0];
    for (const result of results) {
      if (result.compressionRatio < bestResult.compressionRatio) {
        bestResult = result;
      }
    }

    // Check if compression is worth it
    if (bestResult.compressionRatio > this.minCompressionThreshold) {
      return this.createFallbackResult(content, metadata);
    }

    return bestResult;
  }

  /**
   * Compress multiple files (batch operation)
   * Returns array of compression results
   */
  async compressFiles(files: Array<{ content: string; metadata: BrainFileMetadata }>): Promise<CompressionResult[]> {
    return Promise.all(files.map((f) => this.compressFile(f.content, f.metadata)));
  }

  /**
   * Get handler by name
   */
  getHandler(name: CompressionTechnique): CompressionHandler | null {
    return this.handlers.find((h) => h.name === name) || null;
  }

  /**
   * Create fallback result when no compression is beneficial
   */
  private createFallbackResult(content: string, metadata: BrainFileMetadata): CompressionResult {
    const contentHash = crypto.createHash("sha256").update(content).digest("hex");

    return {
      ruleId: `fallback-${metadata.fileName}-${Date.now()}`,
      ruleType: "deterministic",
      originalSize: metadata.fileSize,
      compressedSize: metadata.fileSize,
      compressionRatio: 1.0,
      ruleContent: {
        seed: contentHash,
        generator: "identity",
        params: { noCompression: true },
      },
      domain: metadata.domain || "uncompressed",
      metadata: {
        reason: "No beneficial compression found",
        contentHash,
      },
    };
  }

  /**
   * Register a custom handler
   */
  registerHandler(handler: CompressionHandler): void {
    // Remove if already exists
    this.handlers = this.handlers.filter((h) => h.name !== handler.name);
    this.handlers.push(handler);
  }

  /**
   * Get all registered handlers
   */
  getHandlers(): CompressionHandler[] {
    return [...this.handlers];
  }

  /**
   * Set minimum compression threshold (ratio must be <= this)
   */
  setMinCompressionThreshold(ratio: number): void {
    this.minCompressionThreshold = ratio;
  }
}

export const orchestrator = new CompressionOrchestrator();
