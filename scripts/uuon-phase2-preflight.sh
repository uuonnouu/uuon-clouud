#!/bin/bash
# ═══════════════════════════════════════════════════════
#  UUON Foundation — Phase II Pre-flight Script
#  Usage: bash scripts/uuon-phase2-preflight.sh
#  © UUON Foundation Inc. — Phillip Aguilar Ruiz III
# ═══════════════════════════════════════════════════════

PROD_DB="postgresql://neondb_owner:$PGPASSWORD@ep-square-mud-aqek3wfs.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3Dep-square-mud-aqek3wfs"

PASS=0; FAIL=0; WARN=0

ok()     { echo "  ✓ $1"; PASS=$((PASS+1)); }
fail()   { echo "  ✗ $1"; FAIL=$((FAIL+1)); }
warn()   { echo "  ⚠ $1"; WARN=$((WARN+1)); }
header() { echo ""; echo "── $1 ──────────────────────────────────────────"; }

check_env() {
  local name=$1
  local val
  val=$(printenv "$name" 2>/dev/null)
  if [ -n "$val" ]; then
    local len=${#val}
    ok "$name is set ($len chars)"
  else
    fail "$name is NOT set"
  fi
}

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  UUON Foundation — Phase II Pre-flight"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "═══════════════════════════════════════════════════════"

# ── 1. Environment Variables ──────────────────────────────
header "1. Environment Variables"
check_env PGPASSWORD
check_env DATABASE_URL
check_env PINATA_JWT
check_env PINATA_API_KEY
check_env PINATA_API_SECRET
check_env METAMASK_PRIVATE_KEY
check_env METAMASK_WALLET_ADDRESS
check_env THIRDWEB_CLIENT_ID
check_env THIRDWEB_SECRET_KEY

if grep -r "dev-only-uuon-2025-not-for-production" --include="*.ts" . 2>/dev/null | grep -v node_modules | grep -q .; then
  fail "CRITICAL: Hardcoded fallback secret found in source"
else
  ok "No hardcoded fallback secrets detected"
fi

# ── 2. Directory & Scripts ────────────────────────────────
header "2. Scripts & Files"
mkdir -p scripts
ok "scripts/ directory exists"

for f in scripts/sync-shape-registry.ts scripts/compute-merkle-root.ts scripts/pin-to-ipfs.ts scripts/anchor-base.ts; do
  [ -f "$f" ] && ok "$f exists" || warn "$f missing"
done

if [ -f "MERKLE_STATE_ROOT.json" ]; then
  ok "MERKLE_STATE_ROOT.json exists"
  MERKLE_ROOT=$(node -e "console.log(JSON.parse(require('fs').readFileSync('MERKLE_STATE_ROOT.json','utf8')).merkle_root)" 2>/dev/null)
  IPFS_CID=$(node -e "console.log(JSON.parse(require('fs').readFileSync('MERKLE_STATE_ROOT.json','utf8')).ipfs_cid||'')" 2>/dev/null)
  BASE_TX=$(node -e "console.log(JSON.parse(require('fs').readFileSync('MERKLE_STATE_ROOT.json','utf8')).base_tx_hash||'')" 2>/dev/null)
  ok "Merkle root: $MERKLE_ROOT"
  [ -n "$IPFS_CID" ] && ok "IPFS CID:    $IPFS_CID" || warn "Not yet pinned to IPFS"
  [ -n "$BASE_TX" ]  && ok "Base tx:     $BASE_TX"   || warn "Not yet anchored on Base"
else
  warn "MERKLE_STATE_ROOT.json not found"
  IPFS_CID=""
  BASE_TX=""
fi

# ── 3. Database ───────────────────────────────────────────
header "3. Database Connectivity"
echo "  Connecting to production DB..."

FORMULA_COUNT=$(psql "$PROD_DB" -t -c "SELECT COUNT(*) FROM formula_implementations;" 2>/dev/null | tr -d ' \n')
REGISTRY_COUNT=$(psql "$PROD_DB" -t -c "SELECT COUNT(*) FROM complete_shape_registry;" 2>/dev/null | tr -d ' \n')
LEDGER_COUNT=$(psql "$PROD_DB" -t -c "SELECT COUNT(*) FROM shape_token_ledger;" 2>/dev/null | tr -d ' \n')

if [ -n "$FORMULA_COUNT" ] && [ "$FORMULA_COUNT" -gt 0 ] 2>/dev/null; then
  ok "Production DB connected"
  ok "formula_implementations:  $FORMULA_COUNT rows"
  ok "complete_shape_registry:  $REGISTRY_COUNT rows"
  ok "shape_token_ledger:       $LEDGER_COUNT rows"
else
  fail "Production DB unreachable or empty"
fi

# ── 4. Registry Sync ──────────────────────────────────────
header "4. Shape Registry Sync"
if [ -n "$FORMULA_COUNT" ] && [ -n "$REGISTRY_COUNT" ] && [ "$FORMULA_COUNT" -gt 0 ] 2>/dev/null; then
  if [ "$REGISTRY_COUNT" -ge "$FORMULA_COUNT" ]; then
    ok "Registry complete — $REGISTRY_COUNT shapes registered"
  else
    MISSING=$((FORMULA_COUNT - REGISTRY_COUNT))
    warn "$MISSING shapes missing — run sync-shape-registry.ts"
  fi
fi

# ── 5. Node & Packages ────────────────────────────────────
header "5. Node & Packages"
NODE_VER=$(node --version 2>/dev/null)
ok "Node.js $NODE_VER"

for pkg in drizzle-orm ethers @neondatabase/serverless tsx; do
  [ -d "node_modules/$pkg" ] && ok "$pkg installed" || fail "$pkg NOT installed"
done

# ── 6. Pinata Auth ────────────────────────────────────────
header "6. Pinata / IPFS"
PINATA_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $PINATA_JWT" \
  "https://api.pinata.cloud/data/testAuthentication" 2>/dev/null)

[ "$PINATA_STATUS" = "200" ] && ok "Pinata API authenticated" || warn "Pinata returned $PINATA_STATUS"

if [ -n "$IPFS_CID" ]; then
  CID_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
    "https://gateway.pinata.cloud/ipfs/$IPFS_CID" 2>/dev/null)
  [ "$CID_STATUS" = "200" ] && ok "IPFS CID live: https://ipfs.io/ipfs/$IPFS_CID" || warn "IPFS gateway returned $CID_STATUS"
else
  warn "No IPFS CID to verify"
fi

# ── 7. Base Anchor ────────────────────────────────────────
header "7. Base Mainnet Anchor"
if [ -n "$BASE_TX" ]; then
  ok "Anchored: https://basescan.org/tx/$BASE_TX"
else
  warn "Not yet anchored — run anchor-base.ts"
fi

# ── Summary ───────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  PRE-FLIGHT SUMMARY"
echo "═══════════════════════════════════════════════════════"
echo "  ✓ Passed:   $PASS"
echo "  ⚠ Warnings: $WARN"
echo "  ✗ Failed:   $FAIL"
echo "═══════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
  echo "  Status: ACTION REQUIRED"
  exit 1
elif [ "$WARN" -gt 0 ]; then
  echo "  Status: WARNINGS — review before proceeding"
  exit 0
else
  echo "  Status: ALL CLEAR — Phase II foundation solid"
  exit 0
fi