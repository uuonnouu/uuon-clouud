// GitHub Integration — uses Replit GitHub connector
// Primary account: uuon (UUONdmON)
import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (
    connectionSettings &&
    connectionSettings.settings.expires_at &&
    new Date(connectionSettings.settings.expires_at).getTime() > Date.now()
  ) {
    return connectionSettings.settings.access_token;
  }

  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY
    ? 'repl ' + process.env.REPL_IDENTITY
    : process.env.WEB_REPL_RENEWAL
    ? 'depl ' + process.env.WEB_REPL_RENEWAL
    : null;

  if (!xReplitToken) {
    throw new Error('X-Replit-Token not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        Accept: 'application/json',
        'X-Replit-Token': xReplitToken,
      },
    }
  )
    .then((res) => res.json())
    .then((data) => data.items?.[0]);

  const accessToken =
    connectionSettings?.settings?.access_token ||
    connectionSettings?.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected. Ensure the GitHub connector is active in Replit.');
  }
  return accessToken;
}

// WARNING: Never cache this client — tokens expire.
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

// Get the authenticated GitHub user (should be: uuon)
export async function getGitHubUser() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}

// List all repos for the authenticated user
export async function listRepos() {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: 'updated',
    per_page: 50,
  });
  return data;
}

// Create a new GitHub repository
export async function createRepo(
  name: string,
  description: string,
  isPrivate: boolean = true  // default to private for IP protection
) {
  const octokit = await getUncachableGitHubClient();
  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    description,
    private: isPrivate,
    auto_init: true,
  });
  return data;
}

// Push or update a single file in a repository
export async function upsertFile(
  owner: string,
  repo: string,
  filePath: string,
  content: string,
  message: string
) {
  const octokit = await getUncachableGitHubClient();

  // Check if file already exists (need its SHA to update)
  let sha: string | undefined;
  try {
    const existing = await octokit.rest.repos.getContent({ owner, repo, path: filePath });
    if (!Array.isArray(existing.data) && existing.data.type === 'file') {
      sha = existing.data.sha;
    }
  } catch {
    // File doesn't exist yet — fine, will create it
  }

  const { data } = await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message,
    content: Buffer.from(content).toString('base64'),
    ...(sha ? { sha } : {}),
  });
  return data;
}