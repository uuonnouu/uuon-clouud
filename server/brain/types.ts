// Brain Compression System Types

export type CompressionTechnique = 
  | "parametric"
  | "temporal" 
  | "relationship"
  | "transformation"
  | "functional"
  | "constraints"
  | "deterministic";

export interface CompressionResult {
  ruleId: string;
  ruleType: CompressionTechnique;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number; // 0.05 = 5% = 95% compression
  ruleContent: RuleContent;
  domain: string;
  metadata: Record<string, any>;
}

export interface RuleContent {
  originalHash?: string; // sha256 of original content, set at compression time
  originalContent?: string; // verbatim original — source of truth for exact reconstruction
  seed?: string | number | Record<string, any>;
  generator?: string; // function code or name
  params?: Record<string, any>;
  base?: string; // for temporal/transformation
  deltas?: Array<Record<string, any>>; // temporal deltas
  edges?: Array<[string, string]>; // relationship edges
  rules?: Record<string, any>; // functional rules
  bounds?: Record<string, any>; // constraints
  reproductionFn?: string; // deterministic reproduction function
}

export interface ReconstructionResult {
  content: string;
  reconstructionTimeMs: number;
  verified: boolean;
  contentHash: string;
}

export interface CompressionMetrics {
  ruleType: CompressionTechnique;
  totalRules: number;
  successCount: number;
  failureCount: number;
  avgCompressionRatio: number;
  minCompressionRatio: number;
  maxCompressionRatio: number;
  avgReconstructionTimeMs: number;
  totalStorageSaved: number; // bytes
}

export interface BrainFileMetadata {
  filePath: string;
  fileName: string;
  fileSize: number;
  contentHash: string;
  domain?: string;
  priority?: "HIGH" | "MEDIUM" | "LOW";
}

export interface CompressionHandler {
  name: CompressionTechnique;
  canHandle(content: string, metadata: BrainFileMetadata): boolean;
  compress(content: string, metadata: BrainFileMetadata): Promise<CompressionResult>;
  reconstruct(ruleContent: RuleContent): Promise<ReconstructionResult>;
}
