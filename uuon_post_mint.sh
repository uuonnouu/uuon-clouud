#!/bin/bash
# ═══════════════════════════════════════════════════════
#  UUON Foundation — Post-Mint Completion Script
#  Run after deploy-and-mint.ts completes all 2,154 shapes
#  © UUON Foundation Inc. — Phillip Aguilar Ruiz III
# ═══════════════════════════════════════════════════════

set -e

CONTRACT="0xa14c3015E6b9Ad30337bD72c94Dc236835f61165"
WALLET="0x425734a7fd13E9994b66a7909206007A1EF7030B"
IPFS_CID="bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy"
GENESIS="cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04"
RPC="https://mainnet.base.org"
WORKSPACE="/home/runner/workspace"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  UUON Post-Mint Verification & Deployment"
echo "═══════════════════════════════════════════════════════"
echo ""

# ── STEP 1: Verify contract has real code ────────────────
echo "► Step 1: Verifying contract..."
CODE=$(curl -s -X POST $RPC \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_getCode\",\"params\":[\"$CONTRACT\",\"latest\"],\"id\":1}" \
  | python3 -c "import sys,json; r=json.load(sys.stdin); print(len(r['result']))")

if [ "$CODE" -gt 4 ]; then
  echo "  ✓ Contract verified — code length: $CODE chars"
else
  echo "  ✗ FATAL: No contract code at $CONTRACT"
  exit 1
fi

# ── STEP 2: Check mint progress ──────────────────────────
echo ""
echo "► Step 2: Checking mint completion..."
if [ -f "$WORKSPACE/mint-progress.json" ]; then
  MINTED=$(python3 -c "import json; d=json.load(open('$WORKSPACE/mint-progress.json')); print(d['mintedCount'])")
  FAILED=$(python3 -c "import json; d=json.load(open('$WORKSPACE/mint-progress.json')); print(d['failedCount'])")
  echo "  Minted:  $MINTED / 2154"
  echo "  Failed:  $FAILED"
  if [ "$FAILED" -gt 0 ]; then
    echo "  ⚠ Warning: $FAILED shapes failed — consider rerunning mint"
  fi
else
  echo "  ⚠ No mint-progress.json found"
fi

# ── STEP 3: Verify contract on Base ─────────────────────
echo ""
echo "► Step 3: Checking token count on contract..."
SUPPLY=$(curl -s -X POST $RPC \
  -H "Content-Type: application/json" \
  -d "{\"jsonrpc\":\"2.0\",\"method\":\"eth_call\",\"params\":[{\"to\":\"$CONTRACT\",\"data\":\"0xab1c7fcf\"},\"latest\"],\"id\":1}" \
  | python3 -c "import sys,json; r=json.load(sys.stdin); v=r['result']; print(int(v,16) if v != '0x' else 'unknown')")
echo "  Next token ID to mint: $SUPPLY"
echo "  Basescan: https://basescan.org/address/$CONTRACT"

# ── STEP 4: Update MERKLE_STATE_ROOT.json ───────────────
echo ""
echo "► Step 4: Updating MERKLE_STATE_ROOT.json with new contract..."
python3 << PYEOF
import json, datetime

path = "$WORKSPACE/MERKLE_STATE_ROOT.json"
with open(path, 'r') as f:
    data = json.load(f)

data['nft_contract'] = "$CONTRACT"
data['nft_contract_chain'] = "Base mainnet"
data['nft_contract_basescan'] = "https://basescan.org/address/$CONTRACT"
data['nft_total_shapes'] = 2154
data['ipfs_metadata_base'] = "https://ipfs.io/ipfs/$IPFS_CID"
data['updated_at'] = datetime.datetime.utcnow().isoformat() + "Z"

with open(path, 'w') as f:
    json.dump(data, f, indent=2)

print("  ✓ MERKLE_STATE_ROOT.json updated")
print(f"  Contract added: $CONTRACT")
PYEOF

# ── STEP 5: Push updated state root to GitHub ───────────
echo ""
echo "► Step 5: Pushing updated state root to GitHub..."
cd $WORKSPACE

if git remote get-url origin 2>/dev/null | grep -q "UUON-State-Root"; then
  git add MERKLE_STATE_ROOT.json
  git commit -m "chore: add NFT contract address to state root — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  git push origin main
  echo "  ✓ GitHub updated"
else
  echo "  ⚠ Not in UUON-State-Root repo — skipping GitHub push"
  echo "  Manual: copy MERKLE_STATE_ROOT.json to your UUON-State-Root repo and push"
fi

# ── STEP 6: OpenSea collection check ────────────────────
echo ""
echo "► Step 6: OpenSea collection links..."
echo "  Collection: https://opensea.io/assets/base/$CONTRACT"
echo "  Token 1:    https://opensea.io/assets/base/$CONTRACT/1"
echo "  ℹ OpenSea indexes new collections within 30-60 minutes"
echo "  ℹ If blank, the base URI needs to be set via thirdweb SDK"

# ── STEP 7: Print next actions ──────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════"
echo "  POST-MINT COMPLETE"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Contract:    $CONTRACT"
echo "  Wallet:      $WALLET"
echo "  Genesis:     $GENESIS"
echo "  IPFS:        $IPFS_CID"
echo "  Shapes:      2154"
echo ""
echo "  Next steps:"
echo "  1. Check OpenSea in 30-60 min for collection indexing"
echo "  2. Deploy Engine Hub to GitHub Pages"
echo "  3. Deploy 3D Shape Explorer to GitHub Pages"
echo "  4. Recruit 5 validators for Phase II appchain"
echo ""
echo "  © UUON Foundation Inc. — Phillip Aguilar Ruiz III"
echo "═══════════════════════════════════════════════════════"