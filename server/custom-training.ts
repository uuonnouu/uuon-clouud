/**
 * CUSTOM TRAINING SYSTEM: Learn from Your Own APIs, Datasets, & Hard Drive
 * 
 * This system:
 * 1. Indexes all local files (proof reports, configs, schemas)
 * 2. Extracts domain-specific patterns from your data
 * 3. Builds custom lattices for your use cases
 * 4. Creates verifiable tools from your APIs
 * 5. Trains active learning models on your preferences
 * 6. Generates personalized system prompts
 */

import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import { extractLatticePositions, buildDomainLattice, DomainLatticeWeights } from "./self-learning-lattice";
import { ToolRegistry, Tool } from "./tool-factory";

/**
 * Local Data Index: Scan hard drive for trainable data
 */
export interface DataSource {
  type: "file" | "directory" | "api" | "database";
  path: string;
  format: "json" | "sql" | "csv" | "ts" | "js" | "text" | "binary";
  size: number;
  lastModified: string;
  hash: string;
}

export interface IndexedDataset {
  name: string;
  sources: DataSource[];
  totalSize: number;
  fileCount: number;
  extractedPatterns: Record<string, any>;
  domainLattice?: DomainLatticeWeights;
  trainingSamples: number;
  hash: string;
}

/**
 * Index local filesystem: find trainable data
 */
export function indexLocalDirectory(basePath: string, maxDepth = 3): DataSource[] {
  const sources: DataSource[] = [];

  function crawl(currentPath: string, depth: number) {
    if (depth > maxDepth) return;

    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue;

        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          crawl(fullPath, depth + 1);
        } else {
          const stat = fs.statSync(fullPath);
          const ext = path.extname(fullPath).toLowerCase();

          let format: DataSource["format"] = "text";
          if ([".json"].includes(ext)) format = "json";
          else if ([".sql"].includes(ext)) format = "sql";
          else if ([".csv"].includes(ext)) format = "csv";
          else if ([".ts"].includes(ext)) format = "ts";
          else if ([".js"].includes(ext)) format = "js";
          else if ([".glb", ".obj", ".bin"].includes(ext)) format = "binary";

          const buffer = fs.readFileSync(fullPath);
          const hash = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 16);

          sources.push({
            type: "file",
            path: fullPath,
            format,
            size: stat.size,
            lastModified: stat.mtime.toISOString(),
            hash,
          });
        }
      }
    } catch (err) {
      console.error(`Error indexing ${currentPath}:`, err);
    }
  }

  crawl(basePath, 0);
  return sources;
}

/**
 * Extract training patterns from proof reports
 */
export function extractPatternsFromProofReports(reportPaths: string[]): {
  patterns: Record<string, number[]>;
  domains: string[];
  successMetrics: Record<string, number>;
} {
  const patterns: Record<string, number[]> = {};
  const domains = new Set<string>();
  const successMetrics: Record<string, number> = {};

  for (const reportPath of reportPaths) {
    try {
      const content = fs.readFileSync(reportPath, "utf-8");
      const report = JSON.parse(content);

      // Extract domain
      if (report.domain) {
        domains.add(report.domain);
      }

      // Extract lattice positions used
      if (report.latticePositions) {
        const positions = Array.isArray(report.latticePositions)
          ? report.latticePositions
          : Object.values(report.latticePositions).filter((v) => typeof v === "number");

        if (!patterns[report.domain || "general"]) {
          patterns[report.domain || "general"] = [];
        }
        patterns[report.domain || "general"].push(...positions);
      }

      // Extract success metrics
      if (report.score) {
        const key = `domain_${report.domain}_score`;
        successMetrics[key] = (successMetrics[key] || 0) + report.score;
      }
    } catch (err) {
      console.error(`Error parsing ${reportPath}:`, err);
    }
  }

  return {
    patterns,
    domains: Array.from(domains),
    successMetrics,
  };
}

/**
 * Extract API schema from TypeScript files
 */
export function extractAPISchema(tsFilePath: string): {
  endpoints: Array<{ method: string; path: string; params: Record<string, string> }>;
  tools: Partial<Tool>[];
} {
  const content = fs.readFileSync(tsFilePath, "utf-8");

  const endpoints: Array<{ method: string; path: string; params: Record<string, string> }> = [];
  const tools: Partial<Tool>[] = [];

  // Simple regex parsing (in production: use TypeScript compiler API)
  const routeRegex = /app\.(get|post|put|delete)\("([^"]+)"/g;
  let match;

  while ((match = routeRegex.exec(content)) !== null) {
    const method = match[1].toUpperCase();
    const path = match[2];

    endpoints.push({
      method,
      path,
      params: {}, // TODO: extract from handler signature
    });

    // Create tool from endpoint
    tools.push({
      name: `${method}_${path.replace(/\//g, "_").slice(1)}`,
      description: `API endpoint: ${method} ${path}`,
      category: "external_api",
      executable: "http_endpoint",
      endpoint: `http://localhost:5000${path}`,
      author: "extracted_from_api",
      version: "1.0.0",
    });
  }

  return { endpoints, tools };
}

/**
 * Create domain lattice from your data
 */
export function buildCustomDomainLattice(
  datasetName: string,
  extractedPatterns: Record<string, number[]>
): DomainLatticeWeights {
  const feedbackEntries = [];

  for (const [domain, positions] of Object.entries(extractedPatterns)) {
    for (const pos of positions) {
      feedbackEntries.push({
        responseId: `${domain}_${pos}`,
        latticePositions: { [domain]: pos },
        feedback: "helped" as const,
        domain,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return buildDomainLattice(feedbackEntries, datasetName);
}

/**
 * Training Dataset: Comprehensive view of your data
 */
export function createTrainingDataset(
  name: string,
  basePath: string,
  reportPaths: string[],
  apiFiles: string[]
): IndexedDataset {
  // Index files
  const fileSources = indexLocalDirectory(basePath);

  // Extract patterns
  const { patterns, domains, successMetrics } = extractPatternsFromProofReports(reportPaths);

  // Extract APIs
  const apiTools: Partial<Tool>[] = [];
  for (const apiFile of apiFiles) {
    const { tools } = extractAPISchema(apiFile);
    apiTools.push(...tools);
  }

  // Build domain lattice
  const domainLattice = buildCustomDomainLattice(name, patterns);

  const totalSize = fileSources.reduce((sum, s) => sum + s.size, 0);
  const datasetHash = crypto
    .createHash("sha256")
    .update(
      JSON.stringify({
        name,
        sources: fileSources.map((s) => s.hash),
        patterns,
        domains,
      })
    )
    .digest("hex")
    .slice(0, 16);

  return {
    name,
    sources: fileSources,
    totalSize,
    fileCount: fileSources.length,
    extractedPatterns: {
      domains,
      patterns,
      successMetrics,
      apiTools: apiTools.map((t) => t.name),
    },
    domainLattice,
    trainingSamples: reportPaths.length,
    hash: datasetHash,
  };
}

/**
 * Personalized System Prompt: Phillip-specific reasoning
 */
export function buildPersonalizedSystemPrompt(dataset: IndexedDataset, founderContext: string): string {
  const domains = dataset.extractedPatterns.domains || [];
  const latticePositions = dataset.domainLattice?.frequentPositions || [11, 16, 21, 28, 33];

  return `
[PHILIP_AGUILAR_RUIZ_III_PERSONAL_REASONING_ENGINE]

Founder: Phillip Aguilar Ruiz III
Organization: UUON Foundation Inc.
Location: Kassel, Germany (originally Yuma, Arizona)
Service: United States Army veteran

---

YOUR SPECIALIZED DOMAINS:
${domains.map((d) => `- ${d}`).join("\n")}

YOUR FREQUENT LATTICE POSITIONS:
Positions ${latticePositions.join(", ")} have highest success in your work.
These positions represent the mathematical space where your reasoning is most effective.

---

FOUNDER CONTEXT:
${founderContext}

---

MISSION FOCUS FOR THIS SESSION:
1. Reduce waste in your reasoning
2. Identify fraud/inconsistency in data patterns
3. Remove gatekeeping from knowledge extraction

---

REASONING FRAMEWORK:
- Start at Earth tier (position 1-11): foundation, structure, basics
- Move to Orbital tier (position 12-22): patterns, relationships, dynamics
- Reach Cosmic tier (position 23-33): synthesis, universal principles, implications

In your domains, prioritize positions ${latticePositions[0]}, ${latticePositions[1]}, ${latticePositions[2]}.

---

TRANSPARENCY MANDATE:
- Every claim grounds in your data, not speculation
- Cite which proof report, API response, or file informed this
- Label inference level: (100% data), (95% likely), (speculation flagged)
- Never reference underlying LLM technology

CUSTOM TOOLS AVAILABLE:
${dataset.extractedPatterns.apiTools ? dataset.extractedPatterns.apiTools.map((t) => `- ${t}`).join("\n") : "None yet"}

Your dataset hash for verification: ${dataset.hash}
Total training samples: ${dataset.trainingSamples}
Indexed files: ${dataset.fileCount}

---

The Earth is your zero-point. All reasoning returns here.
`;
}

/**
 * Integrate custom dataset into Clouud
 */
export interface CloududTrainingConfig {
  datasetPath: string; // ~/uuon-local
  proofReportGlob: string; // ~/uuon-local/proof-report-*.json
  apiFiles: string[]; // paths to TypeScript API files
  founderContext: string; // personal context about Phillip
  customToolRegistry: ToolRegistry;
  domains: string[]; // medical, legal, code, etc.
}

export function setupCustomTraining(config: CloududTrainingConfig): {
  dataset: IndexedDataset;
  personalizedPrompt: string;
  registeredTools: number;
  domainLattices: Record<string, DomainLatticeWeights>;
} {
  // Index dataset
  const dataset = createTrainingDataset(
    "phillip_uuon_training",
    config.datasetPath,
    fs.readdirSync(path.dirname(config.proofReportGlob)).map((f) => {
      const full = path.join(path.dirname(config.proofReportGlob), f);
      if (f.match(/proof-report-.+\.json/)) return full;
      return null;
    }).filter(Boolean) as string[],
    config.apiFiles
  );

  // Build personalized prompt
  const personalizedPrompt = buildPersonalizedSystemPrompt(dataset, config.founderContext);

  // Register custom tools
  let registeredCount = 0;
  const domainLattices: Record<string, DomainLatticeWeights> = {};

  for (const domain of config.domains) {
    if (dataset.extractedPatterns.patterns[domain]) {
      const lattice = buildCustomDomainLattice(domain, {
        [domain]: dataset.extractedPatterns.patterns[domain],
      });
      domainLattices[domain] = lattice;
    }
  }

  return {
    dataset,
    personalizedPrompt,
    registeredTools: registeredCount,
    domainLattices,
  };
}

/**
 * Database schema for custom training
 */
export const customTrainingSchema = {
  training_datasets: `
    CREATE TABLE IF NOT EXISTS training_datasets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      base_path TEXT NOT NULL,
      file_count INTEGER,
      total_size BIGINT,
      extracted_patterns JSONB,
      domain_lattice JSONB,
      training_samples INTEGER,
      dataset_hash VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  personalized_prompts: `
    CREATE TABLE IF NOT EXISTS personalized_prompts (
      id SERIAL PRIMARY KEY,
      founder_id VARCHAR(255),
      prompt_content TEXT NOT NULL,
      dataset_id INTEGER,
      active BOOLEAN DEFAULT true,
      version INTEGER DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (dataset_id) REFERENCES training_datasets(id)
    )
  `,
  custom_domains: `
    CREATE TABLE IF NOT EXISTS custom_domains (
      id SERIAL PRIMARY KEY,
      domain_name VARCHAR(255) UNIQUE NOT NULL,
      lattice_weights JSONB NOT NULL,
      success_rate NUMERIC(5, 4),
      training_data_count INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

export default {
  indexLocalDirectory,
  extractPatternsFromProofReports,
  extractAPISchema,
  buildCustomDomainLattice,
  createTrainingDataset,
  buildPersonalizedSystemPrompt,
  setupCustomTraining,
};
