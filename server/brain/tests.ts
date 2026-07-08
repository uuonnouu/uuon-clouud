import { parametricHandler } from "../compression/parametric";
import { temporalHandler } from "../compression/temporal";
import { relationshipHandler } from "../compression/relationship";
import { transformationHandler } from "../compression/transformation";
import { functionalHandler } from "../compression/functional";
import { constraintsHandler } from "../compression/constraints";
import { deterministicHandler } from "../compression/deterministic";
import { BrainFileMetadata } from "../types";

/**
 * Brain Compression System Test Suite
 * 
 * Tests each compression technique with sample content
 */

const sampleMetadata: BrainFileMetadata = {
  filePath: "test/sample.md",
  fileName: "sample.md",
  fileSize: 1000,
  contentHash: "test123",
};

async function runTests() {
  console.log("[Tests] Brain Compression System Test Suite");
  console.log("=".repeat(60));

  // Test 1: Parametric
  console.log("\n[Test 1] Parametric Handler");
  try {
    const parametricContent = `
# E=mc²

Einstein's famous equation:
E = m * c^2

Where:
- E = energy
- m = mass
- c = speed of light (299,792,458 m/s)

This formula shows that mass and energy are interchangeable.
`;

    const result = await parametricHandler.compress(parametricContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(parametricContent, "utf-8"),
    });

    console.log(`  ✓ Parametric compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Original: ${result?.originalSize} bytes`);
    console.log(`    Compressed: ${result?.compressedSize} bytes`);
  } catch (e) {
    console.log(`  ✗ Parametric error: ${e}`);
  }

  // Test 2: Temporal
  console.log("\n[Test 2] Temporal Handler");
  try {
    const temporalContent = `
# Algorithm v1.0
Base algorithm implementation

---

# Algorithm v1.1
Updated with optimization
Parameter tweaks applied

---

# Algorithm v1.2
Performance improvements
Bug fixes included
`;

    const result = await temporalHandler.compress(temporalContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(temporalContent, "utf-8"),
    });

    console.log(`  ✓ Temporal compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Versions detected: ${result?.metadata?.versionCount}`);
  } catch (e) {
    console.log(`  ✗ Temporal error: ${e}`);
  }

  // Test 3: Relationship
  console.log("\n[Test 3] Relationship Handler");
  try {
    const relationshipContent = `
# Knowledge Graph

[E] depends-on [m] and [c]
[Algorithm] references [Optimization]
[Pattern1] → [Pattern2]
[Pattern2] related-to [Pattern3]

Relationships:
- E links to energy
- m links to mass
- c links to constant
`;

    const result = await relationshipHandler.compress(relationshipContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(relationshipContent, "utf-8"),
    });

    console.log(`  ✓ Relationship compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Nodes: ${result?.metadata?.nodeCount}, Edges: ${result?.metadata?.edgeCount}`);
  } catch (e) {
    console.log(`  ✗ Relationship error: ${e}`);
  }

  // Test 4: Transformation
  console.log("\n[Test 4] Transformation Handler");
  try {
    const transformationContent = `
# Base Algorithm
function core_algorithm(x) {
  return x * 2;
}

## Variant: Optimized
Optimized version with caching
parameter_cache = true

## Variant: Parallel
Parallelized implementation
threads = 4
`;

    const result = await transformationHandler.compress(transformationContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(transformationContent, "utf-8"),
    });

    console.log(`  ✓ Transformation compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Variations: ${result?.metadata?.variationCount}`);
  } catch (e) {
    console.log(`  ✗ Transformation error: ${e}`);
  }

  // Test 5: Functional
  console.log("\n[Test 5] Functional Handler");
  try {
    const functionalContent = `
const add = (a, b) => a + b;

async function fetchData(url) {
  const response = await fetch(url);
  return response.json();
}

function* generator() {
  yield 1;
  yield 2;
  yield 3;
}

class Calculator {
  multiply(x, y) {
    return x * y;
  }
}
`;

    const result = await functionalHandler.compress(functionalContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(functionalContent, "utf-8"),
    });

    console.log(`  ✓ Functional compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Functions: ${result?.metadata?.functionCount}`);
  } catch (e) {
    console.log(`  ✗ Functional error: ${e}`);
  }

  // Test 6: Constraints
  console.log("\n[Test 6] Constraints Handler");
  try {
    const constraintsContent = `
# Validation Rules

Minimum value: 1
Maximum value: 100

Valid if:
- value > 0
- value < 101
- value is integer

State transitions:
- IDLE -> RUNNING
- RUNNING -> STOPPED
- STOPPED -> IDLE
`;

    const result = await constraintsHandler.compress(constraintsContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(constraintsContent, "utf-8"),
    });

    console.log(`  ✓ Constraints compression: ${result?.compressionRatio.toFixed(4)} ratio`);
  } catch (e) {
    console.log(`  ✗ Constraints error: ${e}`);
  }

  // Test 7: Deterministic
  console.log("\n[Test 7] Deterministic Handler");
  try {
    const deterministicContent = `
# Mandelbrot Generator

function mandelbrot(seed, iterations) {
  // Deterministic fractal generation
  const result = generateFractal(seed, iterations);
  return result;
}

seed: 12345
iterations: 1000
`;

    const result = await deterministicHandler.compress(deterministicContent, {
      ...sampleMetadata,
      fileSize: Buffer.byteLength(deterministicContent, "utf-8"),
    });

    console.log(`  ✓ Deterministic compression: ${result?.compressionRatio.toFixed(4)} ratio`);
    console.log(`    Seed: ${result?.metadata?.seed?.slice(0, 8)}...`);
  } catch (e) {
    console.log(`  ✗ Deterministic error: ${e}`);
  }

  console.log("\n" + "=".repeat(60));
  console.log("[Tests] All handler tests complete");
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
