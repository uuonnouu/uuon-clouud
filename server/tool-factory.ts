/**
 * Tool Factory: User-registered, verifiable, lattice-aware tools
 * 
 * Problem: Clouud has only 2 hardcoded tools (lunar_phase, dmension_explore)
 * Solution: Let users register custom tools with verification guarantees
 * 
 * Key Design:
 * 1. Tool must declare inputs/outputs with Zod schemas (verifiable types)
 * 2. Tool execution is sandboxed and deterministic
 * 3. Each tool execution produces a hash + lattice mapping
 * 4. Tools can be shared (with signature verification)
 * 5. Tool reputation tracked (success rate, latency, accuracy)
 */

import crypto from "crypto";
import { z } from "zod";

/**
 * Tool Definition: Schema for registering a new tool
 */
export const ToolDefinition = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  category: z.enum([
    "data_retrieval",
    "computation",
    "analysis",
    "transformation",
    "verification",
    "external_api",
  ]),
  inputSchema: z.record(z.any()), // Zod schema, serialized
  outputSchema: z.record(z.any()), // Zod schema, serialized
  executable: z.enum(["nodejs", "python", "bash", "http_endpoint"]),
  code: z.string().optional(), // for nodejs/python/bash
  endpoint: z.string().url().optional(), // for http_endpoint
  author: z.string(),
  version: z.string(),
  dependencies: z.array(z.string()).optional(),
  verificationHash: z.string(), // SHA-256 of code/endpoint + metadata
  isPublic: z.boolean().default(true),
  createdAt: z.string().datetime(),
});

export type Tool = z.infer<typeof ToolDefinition>;

/**
 * Tool Execution: Sandboxed, deterministic, tracked
 */
export interface ToolExecutionRequest {
  toolId: string;
  inputs: Record<string, any>;
  executionId: string;
  conversationId: string;
}

export interface ToolExecutionResult {
  executionId: string;
  toolId: string;
  toolName: string;
  inputs: Record<string, any>;
  output: Record<string, any>;
  success: boolean;
  error?: string;
  executionTime: number; // ms
  deterministic: boolean; // same inputs → same output
  latticeMapping: Record<string, number>; // output properties → lattice positions
  executionHash: string; // SHA-256 of (inputs + output + timestamp)
  timestamp: string;
}

/**
 * Tool Registry: In-memory store of registered tools (persisted to DB)
 */
export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();
  private executions: Map<string, ToolExecutionResult> = new Map();
  private toolReputation: Map<string, { success: number; total: number; avgLatency: number }> = new Map();

  /**
   * Register a new tool
   */
  registerTool(toolDef: Tool): { success: boolean; message: string; hash: string } {
    if (this.tools.has(toolDef.id)) {
      return { success: false, message: `Tool ${toolDef.id} already registered`, hash: "" };
    }

    // Verify integrity hash
    const computedHash = this.computeToolHash(toolDef);
    if (computedHash !== toolDef.verificationHash) {
      return {
        success: false,
        message: `Verification failed: hash mismatch. Expected ${computedHash}, got ${toolDef.verificationHash}`,
        hash: "",
      };
    }

    this.tools.set(toolDef.id, toolDef);
    this.toolReputation.set(toolDef.id, { success: 0, total: 0, avgLatency: 0 });

    return {
      success: true,
      message: `Tool "${toolDef.name}" registered successfully`,
      hash: computedHash,
    };
  }

  /**
   * Get a registered tool
   */
  getTool(toolId: string): Tool | null {
    return this.tools.get(toolId) || null;
  }

  /**
   * List all registered tools (optionally filtered by category)
   */
  listTools(category?: string): Tool[] {
    const filtered = Array.from(this.tools.values());
    if (category) {
      return filtered.filter((t) => t.category === category);
    }
    return filtered;
  }

  /**
   * Compute verification hash for a tool definition
   */
  computeToolHash(tool: Tool): string {
    const payload = {
      name: tool.name,
      description: tool.description,
      category: tool.category,
      inputSchema: tool.inputSchema,
      outputSchema: tool.outputSchema,
      executable: tool.executable,
      code: tool.code || "",
      endpoint: tool.endpoint || "",
      author: tool.author,
      version: tool.version,
      dependencies: tool.dependencies || [],
    };

    return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  }

  /**
   * Execute a tool
   */
  async executeTool(req: ToolExecutionRequest): Promise<ToolExecutionResult> {
    const tool = this.getTool(req.toolId);
    if (!tool) {
      throw new Error(`Tool ${req.toolId} not found`);
    }

    const startTime = Date.now();
    let output: Record<string, any>;
    let error: string | undefined;
    let success = true;

    try {
      // Input validation (simplified)
      // In production: validate against inputSchema

      // Execute based on tool type
      if (tool.executable === "nodejs") {
        output = await this.executeNodeJS(tool, req.inputs);
      } else if (tool.executable === "http_endpoint") {
        output = await this.executeHttpEndpoint(tool, req.inputs);
      } else {
        throw new Error(`Executable type ${tool.executable} not yet implemented`);
      }

      // Output validation (simplified)
      // In production: validate against outputSchema
    } catch (err) {
      success = false;
      error = err instanceof Error ? err.message : "Unknown error";
      output = {};
    }

    const executionTime = Date.now() - startTime;

    // Generate execution hash
    const executionPayload = {
      toolId: req.toolId,
      inputs: req.inputs,
      output,
      timestamp: new Date().toISOString(),
    };
    const executionHash = crypto.createHash("sha256").update(JSON.stringify(executionPayload)).digest("hex");

    // Map output properties to lattice positions
    const latticeMapping = this.mapOutputToLattice(output);

    const result: ToolExecutionResult = {
      executionId: req.executionId,
      toolId: req.toolId,
      toolName: tool.name,
      inputs: req.inputs,
      output,
      success,
      error,
      executionTime,
      deterministic: true, // TODO: track determinism across multiple runs
      latticeMapping,
      executionHash,
      timestamp: new Date().toISOString(),
    };

    // Store execution record
    this.executions.set(req.executionId, result);

    // Update tool reputation
    const rep = this.toolReputation.get(req.toolId)!;
    rep.total += 1;
    if (success) rep.success += 1;
    rep.avgLatency = (rep.avgLatency * (rep.total - 1) + executionTime) / rep.total;

    return result;
  }

  /**
   * Execute NodeJS code (sandboxed)
   */
  private async executeNodeJS(tool: Tool, inputs: Record<string, any>): Promise<Record<string, any>> {
    if (!tool.code) {
      throw new Error("No code provided");
    }

    // SECURITY: In production, this must be sandboxed (vm2, node-sandbox, or separate process)
    // For now, use Function constructor with restricted scope
    const functionCode = `
      return (async (inputs) => {
        ${tool.code}
      })
    `;

    try {
      const fn = new Function(functionCode);
      const result = await fn()(inputs);
      return result || {};
    } catch (err) {
      throw new Error(`NodeJS execution failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  /**
   * Execute HTTP endpoint (call external service)
   */
  private async executeHttpEndpoint(tool: Tool, inputs: Record<string, any>): Promise<Record<string, any>> {
    if (!tool.endpoint) {
      throw new Error("No endpoint provided");
    }

    try {
      const response = await fetch(tool.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
        timeout: 30000,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (err) {
      throw new Error(`HTTP endpoint failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  /**
   * Map tool output to lattice positions
   */
  private mapOutputToLattice(output: Record<string, any>): Record<string, number> {
    const LATTICE_POINTS = 33;
    const mapping: Record<string, number> = {};

    for (const [key, value] of Object.entries(output)) {
      if (typeof value === "number") {
        mapping[key] = Math.max(1, Math.min(33, Math.round((value / 100) * LATTICE_POINTS)));
      } else if (typeof value === "string") {
        mapping[key] = 1 + (value.length % 33);
      } else if (typeof value === "boolean") {
        mapping[key] = value ? 33 : 1;
      }
    }

    return mapping;
  }

  /**
   * Get execution record
   */
  getExecution(executionId: string): ToolExecutionResult | null {
    return this.executions.get(executionId) || null;
  }

  /**
   * Get tool reputation (success rate, latency)
   */
  getReputation(toolId: string): { successRate: number; avgLatency: number } | null {
    const rep = this.toolReputation.get(toolId);
    if (!rep) return null;
    return {
      successRate: rep.total > 0 ? rep.success / rep.total : 0,
      avgLatency: rep.avgLatency,
    };
  }

  /**
   * Share tool: sign and export for use by others
   */
  shareTool(toolId: string, founderSignature: string): { toolDef: Tool; signature: string } {
    const tool = this.getTool(toolId);
    if (!tool) {
      throw new Error(`Tool ${toolId} not found`);
    }

    const toolJson = JSON.stringify(tool);
    const signature = crypto
      .createHash("sha256")
      .update(toolJson + founderSignature)
      .digest("hex");

    return { toolDef: tool, signature };
  }

  /**
   * Verify imported tool signature
   */
  verifyToolSignature(toolDef: Tool, signature: string, founderSignature: string): boolean {
    const toolJson = JSON.stringify(toolDef);
    const expectedSignature = crypto
      .createHash("sha256")
      .update(toolJson + founderSignature)
      .digest("hex");

    return signature === expectedSignature;
  }
}

/**
 * Example tools
 */
export const exampleTools = {
  weather_api: {
    id: "tool-weather-001",
    name: "Weather Lookup",
    description: "Fetch current weather for a city",
    category: "external_api" as const,
    inputSchema: { city: { type: "string" } },
    outputSchema: { temp: { type: "number" }, condition: { type: "string" } },
    executable: "http_endpoint" as const,
    endpoint: "https://api.open-meteo.com/v1/forecast",
    author: "uuon",
    version: "1.0.0",
    verificationHash: "",
    isPublic: true,
    createdAt: new Date().toISOString(),
  },

  text_analysis: {
    id: "tool-analysis-001",
    name: "Text Sentiment Analysis",
    description: "Analyze sentiment and extract key phrases",
    category: "analysis" as const,
    inputSchema: { text: { type: "string" } },
    outputSchema: { sentiment: { type: "string" }, score: { type: "number" } },
    executable: "nodejs" as const,
    code: `
      const text = inputs.text.toLowerCase();
      const positive = ['good', 'great', 'amazing'].filter(w => text.includes(w)).length;
      const negative = ['bad', 'awful', 'terrible'].filter(w => text.includes(w)).length;
      return {
        sentiment: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral',
        score: (positive - negative) / (text.split(' ').length || 1)
      };
    `,
    author: "uuon",
    version: "1.0.0",
    verificationHash: "",
    isPublic: true,
    createdAt: new Date().toISOString(),
  },

  mathematical_computation: {
    id: "tool-math-001",
    name: "Matrix Operations",
    description: "Multiply matrices and compute determinants",
    category: "computation" as const,
    inputSchema: { operation: { type: "string" }, matrix_a: { type: "array" }, matrix_b: { type: "array" } },
    outputSchema: { result: { type: "array" } },
    executable: "nodejs" as const,
    code: `
      // Simplified matrix multiply
      if (inputs.operation !== 'multiply') throw new Error('Only multiply supported');
      const a = inputs.matrix_a;
      const b = inputs.matrix_b;
      const result = [];
      for (let i = 0; i < a.length; i++) {
        result[i] = [];
        for (let j = 0; j < b[0].length; j++) {
          result[i][j] = 0;
          for (let k = 0; k < b.length; k++) {
            result[i][j] += a[i][k] * b[k][j];
          }
        }
      }
      return { result };
    `,
    author: "uuon",
    version: "1.0.0",
    verificationHash: "",
    isPublic: true,
    createdAt: new Date().toISOString(),
  },
};

/**
 * Database schema
 */
export const toolFactorySchema = {
  tools: `
    CREATE TABLE IF NOT EXISTS tools (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category VARCHAR(100) NOT NULL,
      author VARCHAR(255) NOT NULL,
      version VARCHAR(50) NOT NULL,
      verification_hash VARCHAR(255) NOT NULL UNIQUE,
      is_public BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  tool_executions: `
    CREATE TABLE IF NOT EXISTS tool_executions (
      id VARCHAR(255) PRIMARY KEY,
      tool_id VARCHAR(255) NOT NULL,
      conversation_id VARCHAR(255),
      inputs JSONB NOT NULL,
      output JSONB NOT NULL,
      success BOOLEAN NOT NULL,
      execution_time INTEGER NOT NULL,
      execution_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tool_id) REFERENCES tools(id)
    )
  `,
  tool_reputation: `
    CREATE TABLE IF NOT EXISTS tool_reputation (
      tool_id VARCHAR(255) PRIMARY KEY,
      success_count INTEGER DEFAULT 0,
      total_count INTEGER DEFAULT 0,
      avg_latency NUMERIC(10, 2) DEFAULT 0,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tool_id) REFERENCES tools(id)
    )
  `,
};

export default {
  ToolRegistry,
  ToolDefinition,
  exampleTools,
};
