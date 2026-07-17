#!/usr/bin/env bash
# CLOUUD Observer Module — one-time setup. Run inside the Replit shell
# from the folder containing these files. Requires: git configured with
# your GitHub credentials (Replit's Git pane or a PAT).
set -e

REPO_NAME="clouud-observer"
GITHUB_USER="YOUR_GITHUB_USERNAME"   # <-- edit before running

echo "[1/5] Verify module runs"
python3 synchronicity.py
python3 nightly_review.py

echo "[2/5] Init repo"
git init -b main 2>/dev/null || true
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
EOF

echo "[3/5] Commit"
git add synchronicity.py nightly_review.py docs/ logs/ .gitignore
git commit -m "CLOUUD-OBS-001: observer model spec, classifier, log, nightly review job"

echo "[4/5] Push (create the empty repo on GitHub first, or use gh)"
git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git" 2>/dev/null || true
git push -u origin main

echo "[5/5] Schedule nightly review"
echo "In Replit: Deployments -> Scheduled -> command: python3 nightly_review.py"
echo "Suggested schedule: 0 3 * * *  (03:00 UTC nightly)"
echo "Done. The module now reviews the log unattended and reports to logs/review_reports.jsonl"
