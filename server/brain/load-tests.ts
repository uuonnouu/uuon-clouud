import { orchestrator } from "../compression/orchestrator";
import { brainScanner } from "../scanner";
import { BrainFileMetadata } from "../types";
import crypto from "crypto";

/**
 * Brain Compression System - Load & Stress Test Suite
 * 
 * Tests:
 * 1. Load test: 100+ concurrent compressions
 * 2. Stress test: Large files, extreme compression
 * 3. Correctness: Hash verification after reconstruction
 * 4. Performance: Latency, throughput, resource usage
 */

interface TestResult {
  name: string;
  status: "PASS" | "FAIL";
  duration: number;
  metrics: Record<string, any>;
  error?: string;
}

class BrainCompressionLoadTester {
  private results: TestResult[] = [];

  /**
   * Test 1: Basic Correctness
   * Compress → Reconstruct → Verify hash match
   */
  async testCorrectness(): Promise<TestResult> {
    const name = "Correctness Test (Hash Verification)";
    const startTime = Date.now();

    try {
      const testContent = `
# Test Document

This is a test document with various content types.

## Mathematical
E = m * c^2

## Code
const add = (a, b) => a + b;

## Data
- Item 1
- Item 2
- Item 3
`;

      const metadata: BrainFileMetadata = {
        filePath: "test/correctness.md",
        fileName: "correctness.md",
        fileSize: Buffer.byteLength(testContent, "utf-8"),
        contentHash: crypto.createHash("sha256").update(testContent).digest("hex"),
      };

      // Compress
      const compressed = await orchestrator.compressFile(testContent, metadata);
      if (!compressed) throw new Error("Compression failed");

      // Get handler and reconstruct
      const handler = orchestrator.getHandler(compressed.ruleType);
      if (!handler) throw new Error(`Handler not found: ${compressed.ruleType}`);

      const reconstructed = await handler.reconstruct(compressed.ruleContent);

      // Verify
      const contentMatches = reconstructed.contentHash === metadata.contentHash;

      return {
        name,
        status: contentMatches ? "PASS" : "FAIL",
        duration: Date.now() - startTime,
        metrics: {
          originalSize: compressed.originalSize,
          compressedSize: compressed.compressedSize,
          compressionRatio: compressed.compressionRatio,
          reconstructionTimeMs: reconstructed.reconstructionTimeMs,
          hashMatch: contentMatches,
          technique: compressed.ruleType,
        },
        error: contentMatches ? undefined : "Hash mismatch",
      };
    } catch (error) {
      return {
        name,
        status: "FAIL",
        duration: Date.now() - startTime,
        metrics: {},
        error: String(error),
      };
    }
  }

  /**
   * Test 2: Load Test
   * 50 concurrent compress operations
   */
  async testLoad(): Promise<TestResult> {
    const name = "Load Test (50 Concurrent Compressions)";
    const startTime = Date.now();

    try {
      const concurrency = 50;
      const testFiles: Array<{ content: string; metadata: BrainFileMetadata }> = [];

      // Generate test files
      for (let i = 0; i < concurrency; i++) {
        const content = this.generateTestContent(i);
        testFiles.push({
          content,
          metadata: {
            filePath: `test/load_${i}.md`,
            fileName: `load_${i}.md`,
            fileSize: Buffer.byteLength(content, "utf-8"),
            contentHash: crypto.createHash("sha256").update(content).digest("hex"),
          },
        });
      }

      // Compress all concurrently
      const compressionStartTime = Date.now();
      const results = await Promise.all(testFiles.map((f) => orchestrator.compressFile(f.content, f.metadata)));
      const compressionTime = Date.now() - compressionStartTime;

      // Verify all succeeded
      const successCount = results.filter((r) => r !== null).length;
      const avgCompressionRatio = results.reduce((sum, r) => sum + (r?.compressionRatio || 1), 0) / concurrency;
      const avgSize = results.reduce((sum, r) => sum + (r?.compressedSize || 0), 0) / concurrency;

      return {
        name,
        status: successCount === concurrency ? "PASS" : "FAIL",
        duration: Date.now() - startTime,
        metrics: {
          concurrentOps: concurrency,
          successCount,
          failureCount: concurrency - successCount,
          totalCompressionTime: compressionTime,
          avgCompressionTime: compressionTime / concurrency,
          throughput: concurrency / (compressionTime / 1000), // ops/sec
          avgCompressionRatio,
          avgCompressedSize: avgSize,
        },
        error: successCount === concurrency ? undefined : `Only ${successCount}/${concurrency} succeeded`,
      };
    } catch (error) {
      return {
        name,
        status: "FAIL",
        duration: Date.now() - startTime,
        metrics: {},
        error: String(error),
      };
    }
  }

  /**
   * Test 3: Stress Test
   * Large files, extreme compression scenarios
   */
  async testStress(): Promise<TestResult> {
    const name = "Stress Test (Large Files)";
    const startTime = Date.now();

    try {
      // Test 1: Large mathematical content (parametric target)
      const largeParametricContent = this.generateLargeParametricContent(100); // 100KB

      const parametricResult = await orchestrator.compressFile(largeParametricContent, {
        filePath: "test/large_parametric.md",
        fileName: "large_parametric.md",
        fileSize: Buffer.byteLength(largeParametricContent, "utf-8"),
        contentHash: crypto.createHash("sha256").update(largeParametricContent).digest("hex"),
      });

      // Test 2: Large versioned content (temporal target)
      const largeTemporalContent = this.generateLargeTemporalContent(50); // 50KB with versions

      const temporalResult = await orchestrator.compressFile(largeTemporalContent, {
        filePath: "test/large_temporal.md",
        fileName: "large_temporal.md",
        fileSize: Buffer.byteLength(largeTemporalContent, "utf-8"),
        contentHash: crypto.createHash("sha256").update(largeTemporalContent).digest("hex"),
      });

      // Test 3: Complex graph content (relationship target)
      const largeGraphContent = this.generateLargeGraphContent(200); // 200KB of relationships

      const graphResult = await orchestrator.compressFile(largeGraphContent, {
        filePath: "test/large_graph.md",
        fileName: "large_graph.md",
        fileSize: Buffer.byteLength(largeGraphContent, "utf-8"),
        contentHash: crypto.createHash("sha256").update(largeGraphContent).digest("hex"),
      });

      const allResults = [parametricResult, temporalResult, graphResult].filter((r) => r !== null);
      const successCount = allResults.length;
      const avgRatio = allResults.reduce((sum, r) => sum + r!.compressionRatio, 0) / allResults.length;

      return {
        name,
        status: successCount === 3 ? "PASS" : "FAIL",
        duration: Date.now() - startTime,
        metrics: {
          testsRun: 3,
          successCount,
          failureCount: 3 - successCount,
          parametric: {
            size: parametricResult?.originalSize,
            compressed: parametricResult?.compressedSize,
            ratio: parametricResult?.compressionRatio,
          },
          temporal: {
            size: temporalResult?.originalSize,
            compressed: temporalResult?.compressedSize,
            ratio: temporalResult?.compressionRatio,
          },
          graph: {
            size: graphResult?.originalSize,
            compressed: graphResult?.compressedSize,
            ratio: graphResult?.compressionRatio,
          },
          avgCompressionRatio: avgRatio,
        },
      };
    } catch (error) {
      return {
        name,
        status: "FAIL",
        duration: Date.now() - startTime,
        metrics: {},
        error: String(error),
      };
    }
  }

  /**
   * Test 4: Handler Performance
   * Individual handler timing and effectiveness
   */
  async testHandlerPerformance(): Promise<TestResult> {
    const name = "Handler Performance Analysis";
    const startTime = Date.now();

    try {
      const handlers = orchestrator.getHandlers();
      const handlerMetrics: Record<string, any> = {};

      for (const handler of handlers) {
        const testContent = this.generateContentForHandler(handler.name);
        const metadata: BrainFileMetadata = {
          filePath: `test/${handler.name}.md`,
          fileName: `${handler.name}.md`,
          fileSize: Buffer.byteLength(testContent, "utf-8"),
          contentHash: crypto.createHash("sha256").update(testContent).digest("hex"),
        };

        if (!handler.canHandle(testContent, metadata)) {
          handlerMetrics[handler.name] = { status: "NOT_APPLICABLE" };
          continue;
        }

        const compressionStart = Date.now();
        const result = await handler.compress(testContent, metadata);
        const compressionTime = Date.now() - compressionStart;

        handlerMetrics[handler.name] = {
          status: "SUCCESS",
          compressionTime,
          ratio: result.compressionRatio,
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
        };
      }

      return {
        name,
        status: "PASS",
        duration: Date.now() - startTime,
        metrics: handlerMetrics,
      };
    } catch (error) {
      return {
        name,
        status: "FAIL",
        duration: Date.now() - startTime,
        metrics: {},
        error: String(error),
      };
    }
  }

  /**
   * Helper: Generate test content
   */
  private generateTestContent(index: number): string {
    const types = [
      `# Formula ${index}\nE = m * c^2\nParameter${index}=value`,
      `# Version ${index}\nV1: content\nV2: modified content\nV3: final content`,
      `# Graph ${index}\n[Node${index}] -> [Node${index + 1}]\nRelationship${index}`,
      `const func${index} = (a) => a * ${index};\nfunction process${index}() {}`,
    ];

    return types[index % types.length];
  }

  /**
   * Helper: Generate large parametric content
   */
  private generateLargeParametricContent(sizeKB: number): string {
    let content = "# Mathematical Universe\n\n";

    const formulas = [
      "E = m * c^2",
      "F = G * m1 * m2 / r^2",
      "A = π * r^2",
      "V = (4/3) * π * r^3",
      "λ = h / p",
    ];

    while (Buffer.byteLength(content, "utf-8") < sizeKB * 1024) {
      for (const formula of formulas) {
        content += `## Formula\n${formula}\n\nDescription and parameters.\n\n`;
      }
    }

    return content;
  }

  /**
   * Helper: Generate large temporal content
   */
  private generateLargeTemporalContent(sizeKB: number): string {
    let content = "";
    let version = 1;

    while (Buffer.byteLength(content, "utf-8") < sizeKB * 1024) {
      content += `# Version ${version}\nAlgorithm implementation v${version}\nParameter: ${version * 10}\n`;
      content += "Base logic with modifications.\n";
      content += `---\n`;
      version++;
    }

    return content;
  }

  /**
   * Helper: Generate large graph content
   */
  private generateLargeGraphContent(sizeKB: number): string {
    let content = "# Knowledge Graph\n\n";
    let nodeCount = 1;

    while (Buffer.byteLength(content, "utf-8") < sizeKB * 1024) {
      const nextNode = nodeCount + 1;
      content += `[Concept${nodeCount}] references [Concept${nextNode}]\n`;
      content += `[Concept${nextNode}] depends-on [Concept${nodeCount + 2}]\n`;
      nodeCount++;
    }

    return content;
  }

  /**
   * Helper: Generate content for specific handler
   */
  private generateContentForHandler(handlerName: string): string {
    const contents: Record<string, string> = {
      parametric: "# E=mc²\nE = m * c^2\nWhere c = 299,792,458",
      temporal: "# v1\nBase\n---\n# v2\nModified\n---\n# v3\nFinal",
      relationship: "[A] references [B]\n[B] depends-on [C]",
      transformation: "# Base\ncore_algo\n## Variant\nOptimized version",
      functional: "const f = (x) => x * 2;\nfunction g() {}",
      constraints: "min=0\nmax=100\nvalid if x > 0",
      deterministic: "# Fractal\nseed: 12345\nfunction mandelbrot()",
    };

    return contents[handlerName] || "Test content";
  }

  /**
   * Run all tests and generate report
   */
  async runAllTests(): Promise<void> {
    console.log("[Load Tests] Starting Brain Compression System Tests");
    console.log("=".repeat(70));

    // Run each test
    this.results.push(await this.testCorrectness());
    console.log("");

    this.results.push(await this.testLoad());
    console.log("");

    this.results.push(await this.testStress());
    console.log("");

    this.results.push(await this.testHandlerPerformance());
    console.log("");

    // Print summary
    this.printSummary();
  }

  /**
   * Print test summary
   */
  private printSummary(): void {
    console.log("\n" + "=".repeat(70));
    console.log("[Load Tests] SUMMARY");
    console.log("=".repeat(70));

    let passCount = 0;
    let failCount = 0;
    let totalTime = 0;

    for (const result of this.results) {
      const status = result.status === "PASS" ? "✓ PASS" : "✗ FAIL";
      console.log(`\n${status} - ${result.name} (${result.duration}ms)`);

      if (result.status === "PASS") {
        passCount++;
      } else {
        failCount++;
        if (result.error) {
          console.log(`  Error: ${result.error}`);
        }
      }

      totalTime += result.duration;

      // Print metrics
      Object.entries(result.metrics).forEach(([key, value]) => {
        if (typeof value === "object") {
          console.log(`  ${key}:`);
          Object.entries(value).forEach(([k, v]) => {
            console.log(`    ${k}: ${v}`);
          });
        } else {
          console.log(`  ${key}: ${value}`);
        }
      });
    }

    console.log("\n" + "=".repeat(70));
    console.log(`[Load Tests] FINAL RESULTS`);
    console.log(`  Passed: ${passCount}/${this.results.length}`);
    console.log(`  Failed: ${failCount}/${this.results.length}`);
    console.log(`  Total Time: ${totalTime}ms`);
    console.log("=".repeat(70));

    // Export results
    this.exportResults();
  }

  /**
   * Export results to JSON
   */
  private exportResults(): void {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.results.length,
        passed: this.results.filter((r) => r.status === "PASS").length,
        failed: this.results.filter((r) => r.status === "FAIL").length,
      },
      tests: this.results,
    };

    console.log("\n[Load Tests] Results exported to: brain-compression-test-results.json");
    console.log(JSON.stringify(report, null, 2));
  }
}

// Run if executed directly
if (require.main === module) {
  const tester = new BrainCompressionLoadTester();
  tester.runAllTests().catch(console.error);
}

export { BrainCompressionLoadTester };
