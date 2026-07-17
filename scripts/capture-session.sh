#!/bin/bash
# UUON Foundation — Session Recovery Setup
# Automates Git + state capture for instant context restoration
# Run this after each productive session

set -e

PROJECT_ROOT="$(pwd)"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
SESSION_TAG="uuon-session-${TIMESTAMP}"

echo "=========================================="
echo "UUON Session State Capture"
echo "=========================================="
echo "Project: $PROJECT_ROOT"
echo "Session: $SESSION_TAG"
echo ""

# Step 1: Verify git repo
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git remote add origin https://github.com/UUON-Foundation/uuon-clouud 2>/dev/null || true
else
    echo "✅ Git repository exists"
fi

# Step 2: Create file checksums for integrity verification
echo ""
echo "📝 Generating file checksums..."
find . -type f \
    -not -path './.git/*' \
    -not -path './node_modules/*' \
    -not -path './dist/*' \
    -not -path './uploads/*' \
    -not -path './.DS_Store' \
    | xargs sha256sum > FILES.sha256
echo "✅ Checksums saved to FILES.sha256"

# Step 3: Create database snapshot (if PostgreSQL running)
if command -v pg_dump &> /dev/null; then
    echo ""
    echo "💾 Capturing PostgreSQL snapshot..."
    if pg_isready -h localhost -p 5433 -U clouud &> /dev/null; then
        PGPASSWORD=clouud pg_dump -h localhost -p 5433 -U clouud clouud > "backups/uuon-db-snapshot-${TIMESTAMP}.sql"
        echo "✅ Database snapshot: backups/uuon-db-snapshot-${TIMESTAMP}.sql"
    else
        echo "⚠️  PostgreSQL not accessible. Skipping database snapshot."
    fi
else
    echo "⚠️  pg_dump not found. Skipping database snapshot."
fi

# Step 4: Create SESSION_STATE.md (already done, just verify)
if [ -f "SESSION_STATE.md" ]; then
    echo "✅ SESSION_STATE.md exists"
else
    echo "⚠️  SESSION_STATE.md not found. Create manually or run: touch SESSION_STATE.md"
fi

# Step 5: Commit to git
echo ""
echo "📦 Committing to git..."
git add -A
git commit -m "Session $SESSION_TAG: Infrastructure + optimizations snapshot" --allow-empty
echo "✅ Commit created"

# Step 6: Create annotated tag for recovery
echo ""
echo "🏷️  Creating recovery tag: $SESSION_TAG"
git tag -a "$SESSION_TAG" -m "UUON session snapshot - $(date)" || echo "⚠️  Tag already exists"

# Step 7: Display recovery commands
echo ""
echo "=========================================="
echo "✅ Session State Captured"
echo "=========================================="
echo ""
echo "Recovery Commands (next session):"
echo "────────────────────────────────"
echo ""
echo "Option 1: Git restore"
echo "  git checkout $SESSION_TAG"
echo ""
echo "Option 2: Database restore"
echo "  PGPASSWORD=clouud psql -h localhost -p 5433 -U clouud clouud < backups/uuon-db-snapshot-${TIMESTAMP}.sql"
echo ""
echo "Option 3: Verify file integrity"
echo "  sha256sum -c FILES.sha256"
echo ""
echo "Option 4: Full push to remote"
echo "  git push origin main --tags"
echo ""
echo "Files captured:"
echo "  - All source code + configs"
echo "  - FILE checksums (FILES.sha256)"
echo "  - Database snapshot (if available)"
echo "  - SESSION_STATE.md documentation"
echo ""
