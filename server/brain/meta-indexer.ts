import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

/**
 * Brain Meta-Indexer
 * 
 * Catalogs ALL .md files across the entire UUON system:
 * - /Brain/raw (200+ files)
 * - /uuon-clouud (documentation)
 * - /uuon.world (monorepo docs)
 * 
 * Creates unified index for cross-document analysis
 */

export interface DocumentMetadata {
  filePath: string;
  fileName: string;
  fileSize: number;
  contentHash: string;
  headers: string[];
  concepts: string[];
  links: string[];
  wordCount: number;
  estimatedValue: "HIGH" | "MEDIUM" | "LOW";
}

export interface UnifiedIndex {
  timestamp: string;
  totalFiles: number;
  totalSize: number;
  documents: Map<string, DocumentMetadata>;
  concepts: Map<string, number>; // concept → frequency
  relationships: Map<string, Set<string>>; // doc1 → [linked docs]
  conceptDependencies: Map<string, string[]>; // core concepts
  searchIndex: Map<string, string[]>; // searchterm → [files]
}

export class BrainMetaIndexer {
  private index: UnifiedIndex = {
    timestamp: new Date().toISOString(),
    totalFiles: 0,
    totalSize: 0,
    documents: new Map(),
    concepts: new Map(),
    relationships: new Map(),
    conceptDependencies: new Map(),
    searchIndex: new Map(),
  };

  /**
   * Scan all .md files across entire system
   */
  async scanAll(): Promise<UnifiedIndex> {
    console.log("[Meta-Indexer] Starting comprehensive scan...");

    const paths = [
      path.join(process.cwd(), ":Brain", ":Raw"),
      path.join(process.cwd(), "uuon-clouud"),
      path.join(process.cwd(), "uuon.world"),
    ];

    for (const dirPath of paths) {
      await this.scanDirectory(dirPath);
    }

    // Post-processing
    await this.buildConceptMap();
    await this.buildRelationships();
    await this.identifyCoreConcepts();

    console.log(`[Meta-Indexer] Scan complete: ${this.index.totalFiles} files, ${(this.index.totalSize / 1024 / 1024).toFixed(2)} MB`);

    return this.index;
  }

  /**
   * Recursively scan directory for .md files
   */
  private async scanDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip hidden and system directories
        if (entry.name.startsWith(".") || ["node_modules", "dist", "build"].includes(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          await this.scanDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
          const metadata = await this.extractDocumentMetadata(fullPath);
          if (metadata) {
            this.index.documents.set(metadata.filePath, metadata);
            this.index.totalFiles++;
            this.index.totalSize += metadata.fileSize;
          }
        }
      }
    } catch (error) {
      console.error(`[Meta-Indexer] Error scanning ${dirPath}:`, error);
    }
  }

  /**
   * Extract metadata from a single .md file
   */
  private async extractDocumentMetadata(filePath: string): Promise<DocumentMetadata | null> {
    try {
      const content = await fs.readFile(filePath, "utf-8");
      const stat = await fs.stat(filePath);

      // Extract headers
      const headerMatch = content.match(/^#+\s+(.+)$/gm) || [];
      const headers = headerMatch.map((h) => h.replace(/^#+\s+/, "").trim());

      // Extract concepts (capitalized words, technical terms)
      const concepts = this.extractConcepts(content);

      // Extract links (markdown links, file references)
      const links = this.extractLinks(content);

      // Word count
      const wordCount = content.split(/\s+/).length;

      // Estimate value (importance)
      const estimatedValue = this.estimateValue(content, headers, links);

      const relativePath = path.relative(process.cwd(), filePath);

      return {
        filePath: relativePath,
        fileName: path.basename(filePath),
        fileSize: stat.size,
        contentHash: crypto.createHash("sha256").update(content).digest("hex"),
        headers,
        concepts,
        links,
        wordCount,
        estimatedValue,
      };
    } catch (error) {
      console.error(`[Meta-Indexer] Error extracting metadata from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Extract unique concepts from content
   */
  private extractConcepts(content: string): string[] {
    const concepts = new Set<string>();

    // Extract technical terms (capitalized, multi-word, code-like)
    const patterns = [
      /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g, // Capitalized phrases
      /`([^`]+)`/g, // Code blocks
      /\*\*([^*]+)\*\*/g, // Bold text
      /^##\s+(.+)$/gm, // Headers
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const term = match[1].trim();
        if (term.length > 3 && term.length < 100) {
          concepts.add(term);
        }
      }
    }

    return Array.from(concepts).slice(0, 100); // Limit to top 100
  }

  /**
   * Extract links from content
   */
  private extractLinks(content: string): string[] {
    const links = new Set<string>();

    // Markdown links: [text](link)
    const markdownLinks = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    markdownLinks.forEach((link) => {
      const match = link.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) links.add(match[2]);
    });

    // HTML links
    const htmlLinks = content.match(/href=["']([^"']+)["']/g) || [];
    htmlLinks.forEach((link) => {
      const match = link.match(/href=["']([^"']+)["']/);
      if (match) links.add(match[1]);
    });

    return Array.from(links);
  }

  /**
   * Estimate document value
   */
  private estimateValue(content: string, headers: string[], links: string[]): "HIGH" | "MEDIUM" | "LOW" {
    const size = content.length;
    const incomingLinks = links.length;
    const headerCount = headers.length;

    // HIGH: large, well-structured, many links
    if (size > 10000 && headerCount > 5 && incomingLinks > 3) return "HIGH";

    // MEDIUM: medium size or good structure
    if (size > 3000 || headerCount > 3) return "MEDIUM";

    // LOW: small files
    return "LOW";
  }

  /**
   * Build concept frequency map
   */
  private async buildConceptMap(): Promise<void> {
    for (const doc of this.index.documents.values()) {
      for (const concept of doc.concepts) {
        this.index.concepts.set(concept, (this.index.concepts.get(concept) || 0) + 1);
      }

      // Build search index
      for (const concept of doc.concepts) {
        if (!this.index.searchIndex.has(concept)) {
          this.index.searchIndex.set(concept, []);
        }
        this.index.searchIndex.get(concept)!.push(doc.filePath);
      }
    }
  }

  /**
   * Build document relationships
   */
  private async buildRelationships(): Promise<void> {
    for (const [filePath, doc] of this.index.documents) {
      const relatedDocs = new Set<string>();

      // Find documents with shared concepts
      for (const concept of doc.concepts) {
        const relatedFiles = this.index.searchIndex.get(concept) || [];
        relatedFiles.forEach((f) => {
          if (f !== filePath) relatedDocs.add(f);
        });
      }

      // Find linked documents
      for (const link of doc.links) {
        const linkedDoc = Array.from(this.index.documents.keys()).find((f) =>
          f.includes(link.replace(/\..*$/, "").split("/").pop() || ""),
        );
        if (linkedDoc) relatedDocs.add(linkedDoc);
      }

      this.index.relationships.set(filePath, relatedDocs);
    }
  }

  /**
   * Identify core concepts (those appearing in 30%+ of docs)
   */
  private async identifyCoreConcepts(): Promise<void> {
    const threshold = this.index.totalFiles * 0.3;

    // Sort concepts by frequency
    const sorted = Array.from(this.index.concepts.entries())
      .filter(([, count]) => count >= threshold)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50); // Top 50 core concepts

    sorted.forEach(([concept]) => {
      const dependents: string[] = [];

      // Find which documents depend on this concept
      for (const [filePath, doc] of this.index.documents) {
        if (doc.concepts.includes(concept)) {
          dependents.push(filePath);
        }
      }

      this.index.conceptDependencies.set(concept, dependents);
    });
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalFiles: number;
    totalSize: number;
    concepts: number;
    coreConcepts: number;
    averageRelationships: number;
    highValueDocs: number;
  } {
    let totalRelationships = 0;
    let highValueCount = 0;

    for (const doc of this.index.documents.values()) {
      totalRelationships += doc.links.length;
      if (doc.estimatedValue === "HIGH") highValueCount++;
    }

    return {
      totalFiles: this.index.totalFiles,
      totalSize: this.index.totalSize,
      concepts: this.index.concepts.size,
      coreConcepts: this.index.conceptDependencies.size,
      averageRelationships: totalRelationships / (this.index.totalFiles || 1),
      highValueDocs: highValueCount,
    };
  }

  /**
   * Export index for compression
   */
  exportForCompression(): {
    coreConcepts: string[];
    relationships: { [key: string]: string[] };
    documentHashes: { [key: string]: string };
  } {
    return {
      coreConcepts: Array.from(this.index.conceptDependencies.keys()),
      relationships: Object.fromEntries(
        Array.from(this.index.relationships).map(([doc, related]) => [doc, Array.from(related)]),
      ),
      documentHashes: Object.fromEntries(
        Array.from(this.index.documents).map(([path, doc]) => [path, doc.contentHash]),
      ),
    };
  }
}

export const metaIndexer = new BrainMetaIndexer();
