#!/bin/bash
# ═══════════════════════════════════════════════════════
#  UUON Foundation — Publish State Root to GitHub
#  Pushes MERKLE_STATE_ROOT.json to UUON-State-Root repo
#
#  Usage: bash scripts/publish-state-root.sh
#
#  © UUON Foundation Inc. — Phillip Aguilar Ruiz III
# ═══════════════════════════════════════════════════════

set -e

REPO_URL="https://github.com/UUON-Foundation/UUON-State-Root.git"
COMMIT_MSG="UUON Phase II — State root anchor. 2154 shapes. Block 47259953. Merkle: 7d2295473f46552165f096b029d499cf74a3919638954567137672ded5d8d476"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  UUON State Root — GitHub Publish"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "═══════════════════════════════════════════════════════"

# Confirm file exists
if [ ! -f "MERKLE_STATE_ROOT.json" ]; then
  echo "  ✗ MERKLE_STATE_ROOT.json not found. Run compute-merkle-root.ts first."
  exit 1
fi

echo "  ✓ MERKLE_STATE_ROOT.json found"
echo ""

# Init git if not already
if [ ! -d ".git" ]; then
  echo "  Initializing git repo..."
  git init
  git branch -M main
fi

# Configure git identity if not set
GIT_NAME=$(git config user.name 2>/dev/null || echo "")
GIT_EMAIL=$(git config user.email 2>/dev/null || echo "")

if [ -z "$GIT_NAME" ]; then
  git config user.name "Phillip Aguilar Ruiz III"
  echo "  ✓ Git user.name set"
fi

if [ -z "$GIT_EMAIL" ]; then
  git config user.email "founder@uuonfoundation.com"
  echo "  ✓ Git user.email set"
fi

# Create README if it doesn't exist
if [ ! -f "README.md" ]; then
cat > README.md << 'EOF'
# UUON-State-Root

**UUON Foundation — Phase II State Root Anchor**

This repository contains the canonical Merkle state root for the UUON Mathematical Universe — a commitment to 2,154 parametric shapes anchored on Base mainnet and IPFS.

## What This Is

The `MERKLE_STATE_ROOT.json` file is a cryptographic commitment to the entire UUON shape registry at Phase II genesis. It contains:

- **Merkle root** — SHA-256 tree over all 2,154 registered shapes
- **IPFS CID** — permanent content address on IPFS
- **Base tx hash** — on-chain timestamp, Block 47259953
- **Genesis hash** — UUON Foundation genesis anchor

## Verification

Anyone can verify the state root by:
1. Fetching the IPFS CID
2. Checking the Base mainnet transaction
3. Recomputing the Merkle root from the shape registry

## Links

- IPFS: `https://ipfs.io/ipfs/bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy`
- Base: `https://basescan.org/tx/0x27e12c79a7871c315e2b862251dcf860a8d0db925323f9216cd70e9ccd196c5c`

## Copyright

© UUON Foundation Inc.  
Creator: Phillip Aguilar Ruiz III  
Phase II Genesis — June 2026
EOF
  echo "  ✓ README.md created"
fi

# Stage files
git add MERKLE_STATE_ROOT.json README.md
echo "  ✓ Files staged"

# Commit
git commit -m "$COMMIT_MSG" 2>/dev/null || echo "  ✓ Nothing new to commit (already committed)"

# Set remote
if git remote get-url origin > /dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi
echo "  ✓ Remote set: $REPO_URL"

# Push
echo ""
echo "  Pushing to GitHub..."
git push -u origin main

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  PUBLISHED"
echo "═══════════════════════════════════════════════════════"
echo "  Repo:   $REPO_URL"
echo "  File:   MERKLE_STATE_ROOT.json"
echo "  ✓ UUON Phase II state root is now public."
echo "  ✓ Authorship timestamp established."
echo "═══════════════════════════════════════════════════════"
echo ""