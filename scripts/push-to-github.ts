/**
 * push-to-github.ts
 * Pushes the Δmension codebase to uuonnouu/dmension- on GitHub.
 * Uses GITHUB_TOKEN for authentication — no API rate limits.
 *
 * Run with: npx tsx scripts/push-to-github.ts
 *
 * Repo is hardcoded — no argument override to prevent accidental pushes
 * to the wrong repository.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Hardcoded — always pushes to uuonnouu/dmension- and nowhere else
const REPO_NAME = 'dmension-';

const STATUS_FILE = path.join(process.cwd(), '.local', 'last-push-status.json');

function writeStatus(data: {
  success: boolean;
  lastPushAt: string;
  commitSha: string;
  commitMsg: string;
  repo: string;
  error?: string;
}) {
  try {
    fs.mkdirSync(path.dirname(STATUS_FILE), { recursive: true });
    fs.writeFileSync(STATUS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch {
    // non-fatal — don't let status write failure break the push
  }
}

const GITHUB_USER = 'uuonnouu';
const REMOTE_URL = `https://${process.env.GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;

/** Strip credential-bearing substrings from error text before persisting. */
function sanitizeError(text: string): string {
  return text
    .replace(/https?:\/\/[^@\s]+@/g, 'https://***@')
    .replace(/ghp_[A-Za-z0-9]+/g, '***')
    .replace(/github_pat_[A-Za-z0-9_]+/g, '***')
    .slice(0, 400);
}

function run(cmd: string, opts: { stdio?: 'inherit' | 'pipe' } = {}) {
  return execSync(cmd, { stdio: opts.stdio ?? 'pipe', encoding: 'utf-8' });
}

async function ensureRepoExists(token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'dmension-push-script',
  };

  // Check if repo already exists
  const checkRes = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}`, { headers });

  if (checkRes.ok) {
    console.log(`✅ Repo already exists: ${GITHUB_USER}/${REPO_NAME}`);
    return;
  }

  if (checkRes.status !== 404) {
    const errMsg = sanitizeError(`Unexpected response checking repo (${checkRes.status})`);
    console.error(`❌ ${errMsg}`);
    writeStatus({ success: false, lastPushAt: new Date().toISOString(), commitSha: '', commitMsg: '', repo: `${GITHUB_USER}/${REPO_NAME}`, error: errMsg });
    process.exit(1);
  }

  // Repo doesn't exist — create it
  console.log(`📁 Repo not found. Creating private repo: ${GITHUB_USER}/${REPO_NAME}...`);
  const createRes = await fetch('https://api.github.com/user/repos', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: REPO_NAME,
      private: true,
      description: 'Δmension – Mathematical Universe codebase (private mirror)',
      auto_init: false,
    }),
  });

  if (!createRes.ok) {
    const errMsg = sanitizeError(`Failed to create repo (${createRes.status})`);
    console.error(`❌ ${errMsg}`);
    writeStatus({ success: false, lastPushAt: new Date().toISOString(), commitSha: '', commitMsg: '', repo: `${GITHUB_USER}/${REPO_NAME}`, error: errMsg });
    process.exit(1);
  }

  console.log(`✅ Private repo created: https://github.com/${GITHUB_USER}/${REPO_NAME}`);
}

async function push() {
  if (!process.env.GITHUB_TOKEN) {
    const errMsg = 'GITHUB_TOKEN is not set. Add it as a Replit secret.';
    console.error(`❌ ${errMsg}`);
    writeStatus({ success: false, lastPushAt: new Date().toISOString(), commitSha: '', commitMsg: '', repo: `${GITHUB_USER}/${REPO_NAME}`, error: errMsg });
    process.exit(1);
  }

  console.log(`\n🔐 Authenticated as: ${GITHUB_USER}`);
  console.log(`📦 Pushing to: ${GITHUB_USER}/${REPO_NAME}`);

  await ensureRepoExists(process.env.GITHUB_TOKEN!);

  // Ensure origin points to the right repo
  try {
    run(`git remote set-url origin ${REMOTE_URL}`);
  } catch {
    try {
      run(`git remote add origin ${REMOTE_URL}`);
    } catch {
      // remote already exists and is correct — ignore
    }
  }

  // Push main branch
  console.log('🚀 Running git push...');
  let sha = '';
  let commitMsg = '';
  try {
    const out = run(`git push origin main --progress 2>&1`, { stdio: 'pipe' });
    console.log(out || '✅ Already up to date.');
  } catch (err: any) {
    const msg = err.stdout?.toString() || err.stderr?.toString() || err.message;
    if (msg.includes('up to date') || msg.includes('up-to-date')) {
      console.log('✅ Already up to date.');
    } else {
      const errMsg = sanitizeError(msg);
      console.error('❌ Push failed:', errMsg);
      writeStatus({
        success: false,
        lastPushAt: new Date().toISOString(),
        commitSha: '',
        commitMsg: '',
        repo: `${GITHUB_USER}/${REPO_NAME}`,
        error: errMsg,
      });
      process.exit(1);
    }
  }

  // Get latest commit info
  sha  = run('git rev-parse --short HEAD').trim();
  commitMsg = run('git log -1 --pretty=%s').trim();
  const count = run('git rev-list --count HEAD').trim();

  writeStatus({
    success: true,
    lastPushAt: new Date().toISOString(),
    commitSha: sha,
    commitMsg,
    repo: `${GITHUB_USER}/${REPO_NAME}`,
  });

  console.log(`\n🎉 Done!`);
  console.log(`   🔗 https://github.com/${GITHUB_USER}/${REPO_NAME}`);
  console.log(`   📝 ${sha}: ${commitMsg}`);
  console.log(`   📊 ${count} commits on main\n`);
}

push().catch(err => {
  console.error('\n❌ Fatal:', err.message);
  writeStatus({
    success: false,
    lastPushAt: new Date().toISOString(),
    commitSha: '',
    commitMsg: '',
    repo: `${GITHUB_USER}/${REPO_NAME}`,
    error: err.message,
  });
  process.exit(1);
});
