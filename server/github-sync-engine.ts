import { exec } from "child_process";
import { promisify } from "util";
import * as fs from "fs";
import * as path from "path";
import { storage } from "./storage";

const execAsync = promisify(exec);

/**
 * GitHub Repository Sync Engine
 * Pulls all repos from GitHub and indexes them as knowledge base
 */

export interface GitHubRepo {
  id: string;
  name: string;
  url: string;
  description: string;
  localPath: string;
  lastSyncedAt: Date;
  fileCount: number;
  topics: string[];
}

export interface RepoFile {
  repoId: string;
  repoName: string;
  filePath: string;
  content: string;
  language: string;
  sizeBytes: number;
  indexedAt: Date;
}

export class GitHubSyncEngine {
  private githubUser: string;
  private syncDir: string;
  private repos: Map<string, GitHubRepo> = new Map();

  constructor(githubUser: string, syncDir: string = "./github-sync") {
    this.githubUser = githubUser;
    this.syncDir = syncDir;
    if (!fs.existsSync(syncDir)) {
      fs.mkdirSync(syncDir, { recursive: true });
    }
  }

  /**
   * Fetch all repos from GitHub user
   */
  async listUserRepos(): Promise<GitHubRepo[]> {
    try {
      const response = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?per_page=100&type=all`,
        {
          headers: process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {},
        }
      );

      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

      const repos = (await response.json()) as any[];
      const repoList: GitHubRepo[] = repos.map((r) => ({
        id: `${r.id}`,
        name: r.name,
        url: r.clone_url,
        description: r.description || "",
        localPath: path.join(this.syncDir, r.name),
        lastSyncedAt: new Date(),
        fileCount: 0,
        topics: r.topics || [],
      }));

      for (const repo of repoList) {
        this.repos.set(repo.name, repo);
      }

      return repoList;
    } catch (error) {
      console.error("[GITHUB] Failed to list repos:", error);
      throw error;
    }
  }

  /**
   * Clone or pull all repos
   */
  async syncAllRepos(): Promise<{ cloned: string[]; updated: string[]; failed: string[] }> {
    const repos = await this.listUserRepos();
    const cloned: string[] = [];
    const updated: string[] = [];
    const failed: string[] = [];

    for (const repo of repos) {
      try {
        if (fs.existsSync(repo.localPath)) {
          // Pull existing repo
          await execAsync(`cd "${repo.localPath}" && git pull origin main || git pull origin master`);
          updated.push(repo.name);
          console.log(`[GITHUB] Updated: ${repo.name}`);
        } else {
          // Clone new repo
          await execAsync(`git clone "${repo.url}" "${repo.localPath}"`);
          cloned.push(repo.name);
          console.log(`[GITHUB] Cloned: ${repo.name}`);
        }
        repo.lastSyncedAt = new Date();
      } catch (error: any) {
        failed.push(repo.name);
        console.error(`[GITHUB] Failed to sync ${repo.name}:`, error.message);
      }
    }

    return { cloned, updated, failed };
  }

  /**
   * Index all repo files into knowledge base
   */
  async indexAllRepos(): Promise<{ indexed: number; skipped: number }> {
    let indexed = 0;
    let skipped = 0;

    for (const repo of this.repos.values()) {
      const fileCount = await this.indexRepo(repo);
      indexed += fileCount;
    }

    return { indexed, skipped };
  }

  /**
   * Index a single repo
   */
  async indexRepo(repo: GitHubRepo): Promise<number> {
    let count = 0;

    const walk = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        // Skip common directories
        if (file === "node_modules" || file === ".git" || file === "dist" || file === "build" || file === ".env") {
          continue;
        }

        if (stat.isDirectory()) {
          walk(filePath);
        } else if (this.isIndexableFile(file)) {
          const relPath = path.relative(repo.localPath, filePath);
          const content = fs.readFileSync(filePath, "utf-8");
          const language = this.getLanguage(file);

          // Store in knowledge base (simplified — would be in DB)
          console.log(`[INDEX] ${repo.name}/${relPath} (${language})`);
          count++;
        }
      }
    };

    walk(repo.localPath);
    repo.fileCount = count;
    return count;
  }

  /**
   * Search indexed repos
   */
  async searchRepos(query: string): Promise<RepoFile[]> {
    const results: RepoFile[] = [];
    const queryLower = query.toLowerCase();

    for (const repo of this.repos.values()) {
      const walk = (dir: string): void => {
        try {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (file === "node_modules" || file === ".git" || file === "dist" || file === "build") {
              continue;
            }

            if (stat.isDirectory()) {
              walk(filePath);
            } else if (this.isIndexableFile(file)) {
              const content = fs.readFileSync(filePath, "utf-8");
              if (content.toLowerCase().includes(queryLower)) {
                const relPath = path.relative(repo.localPath, filePath);
                results.push({
                  repoId: repo.id,
                  repoName: repo.name,
                  filePath: relPath,
                  content: content.substring(0, 5000),
                  language: this.getLanguage(file),
                  sizeBytes: stat.size,
                  indexedAt: new Date(),
                });
              }
            }
          }
        } catch (e) {
          // Skip inaccessible files
        }
      };

      walk(repo.localPath);
    }

    return results;
  }

  /**
   * Get all repos with their file counts
   */
  getRepoStats(): { name: string; files: number; url: string; description: string }[] {
    return Array.from(this.repos.values()).map((r) => ({
      name: r.name,
      files: r.fileCount,
      url: r.url,
      description: r.description,
    }));
  }

  private isIndexableFile(filename: string): boolean {
    const extensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".py",
      ".go",
      ".rs",
      ".java",
      ".cs",
      ".cpp",
      ".c",
      ".h",
      ".md",
      ".txt",
      ".json",
      ".yaml",
      ".yml",
      ".toml",
      ".sql",
      ".sh",
      ".dockerfile",
      ".env.example",
    ];
    const ext = path.extname(filename).toLowerCase();
    return extensions.includes(ext) && !filename.startsWith(".");
  }

  private getLanguage(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const langMap: Record<string, string> = {
      ".ts": "typescript",
      ".tsx": "typescript",
      ".js": "javascript",
      ".jsx": "javascript",
      ".py": "python",
      ".go": "go",
      ".rs": "rust",
      ".java": "java",
      ".cs": "csharp",
      ".cpp": "cpp",
      ".c": "c",
      ".md": "markdown",
      ".json": "json",
      ".yaml": "yaml",
      ".yml": "yaml",
      ".sql": "sql",
      ".sh": "bash",
      ".dockerfile": "dockerfile",
    };
    return langMap[ext] || "text";
  }
}

export const githubSync = new GitHubSyncEngine(process.env.GITHUB_USER || "");
