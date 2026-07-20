import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { BrainFileMetadata } from "../types";

/**
 * Brain File Scanner
 *
 * Audits /Brain/raw directory:
 * - Scans all files
 * - Extracts metadata (size, hash, domain)
 * - Builds inventory for compression targeting
 * - Identifies high-priority files for first pass
 *
 * Path resolution order:
 *   1. BRAIN_PATH env var (explicit override)
 *   2. One directory above cwd (monorepo layout: CLOUUD/:Brain/:Raw)
 *   3. cwd-relative fallback (Replit/single-root layout)
 */

function resolveBrainPath(): string {
  if (process.env.BRAIN_PATH) return process.env.BRAIN_PATH;
  // Monorepo: server runs from uuon-clouud/, Brain is at ../
  const monorepoPath = path.join(process.cwd(), "..", "Brain", "Raw");
  return monorepoPath;
}

export class BrainFileScanner {
  private brainPath: string;
  private inventory: BrainFileMetadata[] = [];

  constructor(brainPath: string = resolveBrainPath()) {
    this.brainPath = brainPath;
  }

  /**
   * Scan the Brain directory and build inventory
   */
  async scan(): Promise<BrainFileMetadata[]> {
    console.log(`[Brain Scanner] Scanning: ${this.brainPath}`);

    try {
      const files = await this.scanDirectory(this.brainPath);
      console.log(`[Brain Scanner] Found ${files.length} files`);

      this.inventory = files;
      return files;
    } catch (error) {
      console.error("[Brain Scanner] Error scanning directory:", error);
      return [];
    }
  }

  /**
   * Recursively scan directory
   */
  private async scanDirectory(dirPath: string, baseDir = dirPath): Promise<BrainFileMetadata[]> {
    const files: BrainFileMetadata[] = [];

    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        // Skip hidden files and common non-content files
        if (entry.name.startsWith(".") || entry.name === "node_modules") {
          continue;
        }

        if (entry.isDirectory()) {
          const subFiles = await this.scanDirectory(fullPath, baseDir);
          files.push(...subFiles);
        } else if (entry.isFile()) {
          const metadata = await this.extractFileMetadata(fullPath, baseDir);
          if (metadata) {
            files.push(metadata);
          }
        }
      }
    } catch (error) {
      console.error(`[Brain Scanner] Error scanning ${dirPath}:`, error);
    }

    return files;
  }

  /**
   * Extract metadata from a single file
   */
  private async extractFileMetadata(filePath: string, baseDir: string): Promise<BrainFileMetadata | null> {
    try {
      const stat = await fs.stat(filePath);
      const content = await fs.readFile(filePath, "utf-8").catch(() => "");

      // Skip very large files (> 10MB)
      if (stat.size > 10 * 1024 * 1024) {
        console.warn(`[Brain Scanner] Skipping large file: ${filePath} (${stat.size} bytes)`);
        return null;
      }

      const contentHash = crypto.createHash("sha256").update(content).digest("hex");
      const relativePath = path.relative(baseDir, filePath);
      const fileName = path.basename(filePath);
      const domain = this.inferDomain(fileName, content);

      return {
        filePath: relativePath,
        fileName,
        fileSize: stat.size,
        contentHash,
        domain,
        priority: this.prioritizeFile(fileName, content),
      };
    } catch (error) {
      console.error(`[Brain Scanner] Error extracting metadata from ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Infer content domain from file name and content
   */
  private inferDomain(fileName: string, content: string): string {
    const lowerName = fileName.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (/3d|shape|geometry|mesh|dmension/.test(lowerName)) return "3d-shapes";
    if (/hash|crypto|cipher|encrypt/.test(lowerName)) return "cryptographic";
    if (/quantum|entangle|superposition/.test(lowerName)) return "quantum";
    if (/neural|ai|ml|model|layer|weight/.test(lowerName)) return "ai-algorithm";
    if (/physics|force|energy|particle/.test(lowerName)) return "physics";
    if (/math|formula|equation|algorithm/.test(lowerName)) return "mathematical";

    if (/function|class|const|let|var|import/.test(lowerContent)) return "code";
    if (/3d|geometry|shape|mesh|vertex/.test(lowerContent)) return "3d-shapes";
    if (/quantum|entangle|wave|superposition/.test(lowerContent)) return "quantum";
    if (/neural|activation|layer|weight/.test(lowerContent)) return "ai-algorithm";
    if (/hash|crypto|cipher|encrypt/.test(lowerContent)) return "cryptographic";

    return "general-knowledge";
  }

  /**
   * Determine priority for compression (HIGH, MEDIUM, LOW)
   */
  private prioritizeFile(fileName: string, content: string): "HIGH" | "MEDIUM" | "LOW" {
    const size = Buffer.byteLength(content, "utf-8");
    if (size > 50000) return "HIGH";
    if (size > 10000) return "MEDIUM";
    return "LOW";
  }

  getStats() {
    const stats = {
      totalFiles: this.inventory.length,
      totalSize: this.inventory.reduce((sum, f) => sum + f.fileSize, 0),
      byDomain: {} as Record<string, number>,
      byPriority: {} as Record<string, number>,
    };

    for (const file of this.inventory) {
      if (file.domain) stats.byDomain[file.domain] = (stats.byDomain[file.domain] || 0) + 1;
      if (file.priority) stats.byPriority[file.priority] = (stats.byPriority[file.priority] || 0) + 1;
    }

    return stats;
  }

  getFilesByDomain(domain: string): BrainFileMetadata[] {
    return this.inventory.filter((f) => f.domain === domain);
  }

  getFilesByPriority(priority: "HIGH" | "MEDIUM" | "LOW"): BrainFileMetadata[] {
    return this.inventory.filter((f) => f.priority === priority);
  }

  getInventory(): BrainFileMetadata[] {
    return [...this.inventory];
  }
}

export const brainScanner = new BrainFileScanner();
