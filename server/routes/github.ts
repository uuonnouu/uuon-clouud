import express from 'express';
import fs from 'fs';
import path from 'path';
import {
  getGitHubUser,
  listRepos,
  createRepo,
  upsertFile,
  getUncachableGitHubClient,
} from '../services/githubService';

const WORKSPACE = process.cwd();
const STATUS_FILE = path.join(WORKSPACE, '.local', 'last-push-status.json');

// File types to include in the repo push
const INCLUDE_EXT = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.json', '.md',
  '.css', '.html', '.toml', '.yml', '.yaml',
  '.sh', '.mjs', '.cjs', '.sql', '.env.example'
]);

// Directories to never push (secrets, build output, deps)
const EXCLUDE_DIRS = [
  'node_modules', '.git', 'dist', '.cache',
  '.local', 'exports', '.upm', '.config'
];

const MAX_SIZE = 900_000; // 900KB per file max

// ── Helpers ──────────────────────────────────────────────────────────────────

function collectSourceFiles(dir: string): string[] {
  const results: string[] = [];
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.relative(WORKSPACE, full);
    if (EXCLUDE_DIRS.some(x => rel.startsWith(x) || e.name === x)) continue;
    if (e.isDirectory()) {
      results.push(...collectSourceFiles(full));
    } else if (e.isFile() && INCLUDE_EXT.has(path.extname(e.name).toLowerCase())) {
      if (fs.statSync(full).size <= MAX_SIZE) results.push(rel);
    }
  }
  return results;
}

async function ghFetch(token: string, method: string, endpoint: string, body?: any) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`${method} ${endpoint} → ${res.status}: ${t.slice(0, 200)}`);
  }
  return res.json();
}

// ── Router ───────────────────────────────────────────────────────────────────

const router = express.Router();

// GET /api/github/push-status — last push result written by push-to-github.ts
// Returns flat shape: { found, success, lastPushAt, commitSha, commitMsg, repo, error }
router.get('/push-status', (req, res) => {
  try {
    if (!fs.existsSync(STATUS_FILE)) {
      return res.json({ found: false });
    }
    const raw = fs.readFileSync(STATUS_FILE, 'utf-8');
    const data = JSON.parse(raw);
    // Sanitize error field before returning to client
    const safeError = data.error
      ? String(data.error)
          .replace(/https?:\/\/[^@\s]+@/g, 'https://***@')
          .replace(/ghp_[A-Za-z0-9]+/g, '***')
          .replace(/github_pat_[A-Za-z0-9_]+/g, '***')
          .slice(0, 300)
      : undefined;
    res.json({
      found: true,
      success: Boolean(data.success),
      lastPushAt: data.lastPushAt ?? null,
      commitSha: data.commitSha ?? '',
      commitMsg: data.commitMsg ?? '',
      repo: data.repo ?? '',
      ...(safeError ? { error: safeError } : {}),
    });
  } catch (err: any) {
    res.status(500).json({ found: false, error: 'Failed to read push status' });
  }
});

// GET /api/github/user — confirm who is connected (should be: uuon)
router.get('/user', async (req, res) => {
  try {
    const user = await getGitHubUser();
    res.json({
      success: true,
      login: user.login,
      name: user.name,
      avatar: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      note: 'Primary account for Δmension IP: uuon',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/github/repos — list repos under connected account
router.get('/repos', async (req, res) => {
  try {
    const repos = await listRepos();
    res.json({
      success: true,
      count: repos.length,
      repos: repos.map((r) => ({
        name: r.name,
        fullName: r.full_name,
        url: r.html_url,
        private: r.private,
        description: r.description,
        updatedAt: r.updated_at,
      })),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/github/create-repo — create a new repo
// Body: { name, description, private }
router.post('/create-repo', async (req, res) => {
  try {
    const { name, description = '', private: isPrivate = true } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, error: 'Repository name is required' });
    }
    const repo = await createRepo(name, description, isPrivate);
    res.json({
      success: true,
      message: `Repository "${repo.full_name}" created successfully`,
      repoName: repo.name,
      fullName: repo.full_name,
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      private: repo.private,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/github/push-file — push a single file
// Body: { owner, repo, path, content, message }
router.post('/push-file', async (req, res) => {
  try {
    const { owner, repo, path, content, message = 'Update from Δmension' } = req.body;
    if (!owner || !repo || !path || !content) {
      return res.status(400).json({
        success: false,
        error: 'owner, repo, path, and content are required',
      });
    }
    const result = await upsertFile(owner, repo, path, content, message);
    res.json({
      success: true,
      message: `File "${path}" pushed to ${owner}/${repo}`,
      commitUrl: result.commit?.html_url,
      sha: result.content?.sha,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// In-memory job tracker for background pushes
const pushJobs = new Map<string, { status: string; progress: number; total: number; error?: string; result?: any }>();

// POST /api/github/push-full-repo
// Creates private repo under uuon and pushes ALL source files asynchronously.
// Responds immediately with a jobId. Poll GET /api/github/push-progress/:jobId for status.
// Body: { repoName } — defaults to "dmension-api"
router.post('/push-full-repo', async (req, res) => {
  const repoName: string = req.body.repoName || 'dmension-api';
  const jobId = `push-${Date.now()}`;
  pushJobs.set(jobId, { status: 'running', progress: 0, total: 0 });

  // Respond immediately — client can poll for progress
  res.json({ success: true, jobId, message: `Push started for "${repoName}". Poll /api/github/push-progress/${jobId}` });

  // Run the actual work in the background
  setImmediate(async () => {
  const job = pushJobs.get(jobId)!;
  try {
    // Get token from Replit GitHub connector
    const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
    const xReplitToken = process.env.REPL_IDENTITY
      ? 'repl ' + process.env.REPL_IDENTITY
      : process.env.WEB_REPL_RENEWAL
      ? 'depl ' + process.env.WEB_REPL_RENEWAL
      : null;

    let token: string;
    if (hostname && xReplitToken) {
      const data: any = await fetch(
        `https://${hostname}/api/v2/connection?include_secrets=true&connector_names=github`,
        {
          headers: {
            Accept: 'application/json',
            'X-Replit-Token': xReplitToken,
          },
        }
      ).then(r => r.json());
      const settings = data.items?.[0];
      token =
        settings?.settings?.access_token ||
        settings?.settings?.oauth?.credentials?.access_token;
    } else {
      token = process.env.GITHUB_TOKEN || '';
    }

    if (!token) throw new Error('GitHub token not available — check Replit connector');

    // Confirm authenticated user
    const user: any = await ghFetch(token, 'GET', '/user');
    const owner: string = user.login; // Will be: uuon

    // Create private repo (skip if already exists)
    let repo: any;
    try {
      repo = await ghFetch(token, 'POST', '/user/repos', {
        name: repoName,
        description: 'Δmension Mathematical Universe API — UUON Foundation Inc. © 2025',
        private: true,  // ALWAYS private — this is commercial IP
        auto_init: true,
      });
    } catch (err: any) {
      if (err.message.includes('422') || err.message.includes('already exists')) {
        // Repo exists — fetch it and continue
        repo = await ghFetch(token, 'GET', `/repos/${owner}/${repoName}`);
      } else {
        throw err;
      }
    }

    // Get current HEAD commit and tree
    const refData: any = await ghFetch(
      token, 'GET', `/repos/${owner}/${repoName}/git/ref/heads/main`
    );
    const baseSha: string = refData.object.sha;
    const baseCommit: any = await ghFetch(
      token, 'GET', `/repos/${owner}/${repoName}/git/commits/${baseSha}`
    );
    const baseTreeSha: string = baseCommit.tree.sha;

    // Collect all source files from workspace
    const files = collectSourceFiles(WORKSPACE);
    const allBlobs: { path: string; sha: string }[] = [];
    const skipped: string[] = [];

    // Upload file blobs in parallel batches of 25
    const BLOB_BATCH = 25;
    for (let i = 0; i < files.length; i += BLOB_BATCH) {
      const batch = files.slice(i, i + BLOB_BATCH);
      await Promise.all(
        batch.map(async (relPath) => {
          const fullPath = path.join(WORKSPACE, relPath);
          let content: string;
          let encoding: 'utf-8' | 'base64' = 'utf-8';
          try {
            content = fs.readFileSync(fullPath, 'utf-8');
          } catch {
            content = fs.readFileSync(fullPath).toString('base64');
            encoding = 'base64';
          }
          try {
            const blob: any = await ghFetch(
              token, 'POST', `/repos/${owner}/${repoName}/git/blobs`,
              { content, encoding }
            );
            allBlobs.push({ path: relPath, sha: blob.sha });
            job.progress = allBlobs.length;
          } catch {
            skipped.push(relPath);
          }
        })
      );
    }

    // Commit in chunks of 200 files (GitHub tree limit)
    const TREE_CHUNK = 200;
    let currentParentSha = baseSha;
    let currentTreeSha = baseTreeSha;
    let lastCommitSha = baseSha;
    const chunks = Math.ceil(allBlobs.length / TREE_CHUNK);

    for (let c = 0; c < chunks; c++) {
      const chunk = allBlobs.slice(c * TREE_CHUNK, (c + 1) * TREE_CHUNK);
      const treeItems = chunk.map(b => ({
        path: b.path,
        mode: '100644',
        type: 'blob',
        sha: b.sha,
      }));

      const newTree: any = await ghFetch(
        token, 'POST', `/repos/${owner}/${repoName}/git/trees`,
        { base_tree: currentTreeSha, tree: treeItems }
      );

      const newCommit: any = await ghFetch(
        token, 'POST', `/repos/${owner}/${repoName}/git/commits`,
        {
          message: `🔒 Δmension snapshot ${c + 1}/${chunks} — ${chunk.length} files [UUON Foundation Inc.]`,
          tree: newTree.sha,
          parents: [currentParentSha],
        }
      );

      currentParentSha = newCommit.sha;
      currentTreeSha = newTree.sha;
      lastCommitSha = newCommit.sha;
    }

    // Update main branch to point at final commit
    await ghFetch(
      token, 'PATCH', `/repos/${owner}/${repoName}/git/refs/heads/main`,
      { sha: lastCommitSha, force: true }
    );

    const result = {
      repoUrl: repo.html_url,
      cloneUrl: repo.clone_url,
      owner,
      repoName,
      filesPushed: allBlobs.length,
      filesSkipped: skipped.length,
      commits: chunks,
      commitSha: lastCommitSha,
    };

    // Write status file for /push-status endpoint
    fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
    fs.writeFileSync(STATUS_FILE, JSON.stringify({
      success: true,
      lastPushAt: new Date().toISOString(),
      commitSha: lastCommitSha,
      commitMsg: `Δmension snapshot — ${allBlobs.length} files`,
      repo: `${owner}/${repoName}`,
    }));

    job.status = 'done';
    job.result = result;
  } catch (err: any) {
    const job = pushJobs.get(jobId);
    if (job) { job.status = 'error'; job.error = err.message; }
    fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
    fs.writeFileSync(STATUS_FILE, JSON.stringify({ success: false, error: err.message }));
  }
  }); // end setImmediate
});

// GET /api/github/push-progress/:jobId — poll background push job status
router.get('/push-progress/:jobId', (req, res) => {
  const job = pushJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ success: false, error: 'Job not found' });
  res.json({
    success: true,
    status: job.status,       // 'running' | 'done' | 'error'
    progress: job.progress,
    total: job.total,
    ...(job.result ? { result: job.result } : {}),
    ...(job.error ? { error: job.error } : {}),
  });
});

export default router;
