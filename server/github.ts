import { Octokit } from '@octokit/rest'

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
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
        'Accept': 'application/json',
        'X-Replit-Token': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client — GitHub integration via Replit connector
export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function getGitHubStatus(): Promise<{
  connected: boolean;
  username?: string;
  error?: string;
}> {
  try {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.users.getAuthenticated();
    return { connected: true, username: data.login };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
}

export async function createPrivateRepo(
  repoName: string
): Promise<{ success: boolean; repoUrl?: string; error?: string }> {
  try {
    const octokit = await getUncachableGitHubClient();
    const { data } = await octokit.repos.createForAuthenticatedUser({
      name: repoName,
      private: true,
      description: "UUON Foundation Inc. — Clouud Intelligence System · G°centric Lattice · Ellomental Hash · Private backup repository",
      auto_init: false,
    });
    return { success: true, repoUrl: data.html_url };
  } catch (err: any) {
    if (err.status === 422) {
      return { success: false, error: `Repository '${repoName}' already exists` };
    }
    return { success: false, error: err.message };
  }
}

export async function pushBackupToGitHub(
  repoOwner: string,
  repoName: string,
  filePath: string,
  content: string,
  commitMessage: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const octokit = await getUncachableGitHubClient();

    let existingSha: string | undefined;
    try {
      const { data } = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path: filePath,
      });
      if (!Array.isArray(data) && data.type === "file") {
        existingSha = data.sha;
      }
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      message: commitMessage,
      content: Buffer.from(content).toString("base64"),
      ...(existingSha ? { sha: existingSha } : {}),
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
