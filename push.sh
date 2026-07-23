#!/bin/bash
set -euo pipefail

# Pre-flight: verify GITHUB_TOKEN is set and valid before doing anything
if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "❌ GITHUB_TOKEN secret is not set. Add it in Replit Secrets (repo scope required)."
  exit 1
fi

AUTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user)

if [ "$AUTH_STATUS" != "200" ]; then
  echo "❌ GITHUB_TOKEN is invalid or expired (HTTP $AUTH_STATUS). Regenerate it on GitHub with 'repo' scope."
  exit 1
fi

echo "✅ GitHub credentials verified"
echo "📦 Committing and pushing to GitHub..."

git add -A
git commit -m "${1:-Update: $(date '+%Y-%m-%d %H:%M')}" || echo "ℹ️  Nothing new to commit."

if [ "${PUSH_TO_GITHUB:-}" = "1" ]; then
  echo "🚀 Pushing via git push (direct mode)..."
  REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
  # Strip any existing credentials from the URL and inject the token
  CLEAN_URL=$(echo "$REMOTE_URL" | sed 's|https://[^@]*@|https://|')
  AUTHED_URL=$(echo "$CLEAN_URL" | sed "s|https://github.com|https://x-access-token:${GITHUB_TOKEN}@github.com|")
  git push "$AUTHED_URL" HEAD:main
  echo "✅ Done (direct git push)"
else
  echo "🚀 Pushing via file-by-file uploader..."
  npx tsx scripts/push-to-github.ts dmension-private
  echo "✅ Done"
fi
