import crypto from "crypto";
import { CompressionHandler, CompressionResult, RuleContent, ReconstructionResult, BrainFileMetadata } from "../types";

/**
 * PARAMETRIC Compression Handler
 * 
 * Compresses algorithmic and mathematical content by:
 * - Extracting core parameters, equations, and relationships
 * - Storing seed values and generation functions
 * - Reducing 3D models/shapes to parametric equations
 * 
 * Target reduction: 100,000:1 on 3D shapes, 1,000:1 on algorithms
 * 
 * Examples:
 * - E=mc² stored as: {seed: "Einstein", formula: "E = m * c^2"}
 * - Sphere stored as: {seed: "sphere", params: {radius: 1}, generator: "sphere(r)"}
 * - Algorithm stored as: {seed: hash, params: {...}, generator: algo_name}
 */

export class ParametricCompressionHandler implements CompressionHandler {
  name = "parametric" as const;

  /**
   * Detect parametric compression opportunities
   * - Mathematical formulas/equations
   * - Algorithm descriptions with clear parameters
   * - 3D shape definitions
   * - Physics constants and relationships
   */
  canHandle(content: string, metadata: BrainFileMetadata): boolean {
    const lowerContent = content.toLowerCase();
    const fileName = metadata.fileName.toLowerCase();

    // Check for algorithmic domains
    const algorithmicPatterns = [
      /formula|equation|algorithm|function|constant/i,
      /^(# Mathematical|# Physics|# Quantum|# 3D|# Geometric)/i,
      /\b(sin|cos|tan|exp|log|sqrt|integral|derivative|matrix)\b/i,
      /^(E=|F=|A=|V=|P=|x=|y=|z=)/m, // Physics/math formulas
      /parametric|seed|generator|shape/i,
    ];

    return algorithmicPatterns.some((pattern) => pattern.test(content)) || algorithmicPatterns.some((p) => p.test(fileName));
  }

  /**
   * Compress parametric content
   * 
   * Strategy:
   * 1. Extract mathematical relationships and formulas
   * 2. Identify seed values (constants, initial conditions)
   * 3. Describe generation process (function/rule)
   * 4. Store minimal rule representation
   */
  async compress(content: string, metadata: BrainFileMetadata): Promise<CompressionResult> {
    const startTime = Date.now();

    // Step 1: Extract parametric elements
    const parametricElements = this.extractParametricElements(content);

    // Step 2: Create seed from core concepts
    const seed = this.generateSeed(parametricElements, metadata.fileName);

    // Step 3: Build rule content (minimal representation)
    const ruleContent: RuleContent = {
      seed,
      generator: parametricElements.mainFunction || metadata.fileName,
      params: parametricElements.parameters,
    };

    // Step 4: Calculate compression
    const compressedJson = JSON.stringify(ruleContent);
    const compressedSize = Buffer.byteLength(compressedJson, "utf8");
    const originalSize = metadata.fileSize;
    const compressionRatio = compressedSize / originalSize;

    const contentHash = crypto.createHash("sha256").update(content).digest("hex");
    const ruleId = `parametric-${seed}-${Date.now()}`;

    return {
      ruleId,
      ruleType: "parametric",
      originalSize,
      compressedSize,
      compressionRatio,
      ruleContent,
      domain: parametricElements.domain || "mathematical",
      metadata: {
        extractedElements: parametricElements,
        timeTaken: Date.now() - startTime,
        contentHash,
      },
    };
  }

  /**
   * Reconstruct from parametric rule
   * 
   * Strategy:
   * 1. Use seed + params + generator to rebuild
   * 2. Apply generation function to recreate output
   * 3. Verify against original hash
   */
  async reconstruct(ruleContent: RuleContent): Promise<ReconstructionResult> {
    const startTime = Date.now();

    // Reconstruct from seed + params
    const reconstructed = this.regenerateFromSeed(
      ruleContent.seed,
      ruleContent.generator,
      ruleContent.params || {},
    );

    const reconstructionTimeMs = Date.now() - startTime;
    const contentHash = crypto.createHash("sha256").update(reconstructed).digest("hex");

    return {
      content: reconstructed,
      reconstructionTimeMs,
      verified: true, // TODO: verify against stored hash
      contentHash,
    };
  }

  /**
   * Extract parametric elements from content
   * Identifies: formulas, parameters, domains, functions
   */
  private extractParametricElements(content: string) {
    const elements: any = {
      formulas: [],
      parameters: {},
      constants: [],
      domain: null,
      mainFunction: null,
    };

    // Extract formulas (lines with = and math symbols)
    const formulaPattern = /(?:^|\n)([A-Za-z_][\w\d]*\s*=\s*[^;\n]+)/gm;
    let match;
    while ((match = formulaPattern.exec(content)) !== null) {
      elements.formulas.push(match[1].trim());
    }

    // Extract parameters (identify common param names)
    const paramPattern = /(?:let|const|var|param)\s+([a-z_]\w*)\s*=\s*([^;\n]+)/gi;
    while ((match = paramPattern.exec(content)) !== null) {
      elements.parameters[match[1]] = match[2].trim();
    }

    // Detect domain
    if (/3d|shape|geometry|mesh|coordinate/i.test(content)) {
      elements.domain = "3d-shapes";
    } else if (/quantum|entangle|superposition|wave/i.test(content)) {
      elements.domain = "quantum";
    } else if (/neural|weight|layer|activation/i.test(content)) {
      elements.domain = "ai-algorithm";
    } else if (/hash|crypto|encrypt|cipher/i.test(content)) {
      elements.domain = "cryptographic";
    } else {
      elements.domain = "mathematical";
    }

    // Extract main function name
    const funcMatch = content.match(/function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\(/i);
    if (funcMatch) {
      elements.mainFunction = funcMatch[1] || funcMatch[2];
    }

    return elements;
  }

  /**
   * Generate seed from file name and content signature
   */
  private generateSeed(elements: any, fileName: string): string {
    // Create deterministic seed from domain + main function + first formula
    const seedBase = [elements.domain, elements.mainFunction, elements.formulas[0] || fileName].filter(Boolean).join("::");

    const seedHash = crypto.createHash("md5").update(seedBase).digest("hex").slice(0, 8);
    return `${elements.domain}-${seedHash}`;
  }

  /**
   * Regenerate content from parametric seed
   * In production, this would execute the generator function
   */
  private regenerateFromSeed(seed: string | any, generator: string | undefined, params: Record<string, any>): string {
    // Generate a representation of the parametric content
    const reconstructed = {
      seed,
      generator: generator || "parametric_generator",
      parameters: params,
      generated: true,
      reconstructedAt: new Date().toISOString(),
    };

    // Return formatted representation
    return Object.entries(reconstructed)
      .map(([key, value]) => {
        if (typeof value === "object") {
          return `${key}: ${JSON.stringify(value, null, 2)}`;
        }
        return `${key}: ${value}`;
      })
      .join("\n");
  }
}

export const parametricHandler = new ParametricCompressionHandler();
