#!/bin/bash
echo "############################################"
echo "PRE-PUBLIC SECURITY SCAN"
echo "Run this BEFORE making the repo public."
echo "############################################"

echo ""
echo "=== 1. Current .gitignore contents ==="
cat .gitignore 2>/dev/null || echo "NO .gitignore FOUND — this is a problem on its own."

echo ""
echo "=== 2. Is .env actually ignored, or is it tracked? ==="
git ls-files | grep -E '^\.env' && echo "  ^ WARNING: .env files are TRACKED IN GIT, not ignored!" || echo "  Clean — no .env files tracked."

echo ""
echo "=== 3. Scan CURRENT working tree for literal secrets ==="
grep -rEn "AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|gho_[a-zA-Z0-9]{30,}|postgres(ql)?://[^ \"']*:[^ \"']*@|mongodb(\+srv)?://[^ \"']*:[^ \"']*@|PRIVATE_KEY\s*[:=]\s*['\"]0x[a-fA-F0-9]|BEGIN (RSA |EC )?PRIVATE KEY|BRIDGE_SECRET\s*[:=]\s*['\"][a-zA-Z0-9]{8,}" \
  --include="*.ts" --include="*.js" --include="*.mjs" --include="*.json" --include="*.sh" --include="*.py" --include="*.sql" \
  --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.cache --exclude-dir=.config --exclude-dir=.upm --exclude-dir=.pythonlibs --exclude-dir=.local \
  . 2>/dev/null | grep -v "\.example\|\.bak\."

echo ""
echo "=== 4. CRITICAL: Scan FULL GIT HISTORY for secrets ever committed ==="
echo "(This catches secrets that were committed then deleted — still in history)"
git log --all -p 2>/dev/null | grep -nE "AKIA[0-9A-Z]{16}|sk-[a-zA-Z0-9]{20,}|ghp_[a-zA-Z0-9]{30,}|gho_[a-zA-Z0-9]{30,}|postgres(ql)?://[a-zA-Z0-9_]+:[a-zA-Z0-9!@#$%^&*]{6,}@|PRIVATE_KEY\s*[:=]\s*['\"]0x[a-fA-F0-9]{20,}|BEGIN (RSA |EC )?PRIVATE KEY" | head -30
echo "(If anything printed above, that secret is PERMANENTLY in your git history)"
echo "(Changing it now does NOT remove it from history — see note below)"

echo ""
echo "=== 5. D13MON4 trade secret check ==="
echo "README claims D13MON4 is a registered trade secret, never disclosed publicly."
echo "Confirming it's not actually sitting in a trackable path:"
find . -iname "*d13mon4*" -not -path "*/node_modules/*" -not -path "*/.git/*" 2>/dev/null
git ls-files | grep -i d13mon4

echo ""
echo "############################################"
echo "WHAT TO DO WITH THE RESULTS:"
echo " - Section 2/3 hits = fix .gitignore + rotate the exposed credential NOW"
echo " - Section 4 hits = the secret is in history FOREVER unless you rewrite"
echo "   history (git filter-repo) or just rotate the credential and accept"
echo "   the old (now-useless) value stays visible. Rotating is almost always"
echo "   the right call over history rewriting, which breaks all clones."
echo " - Section 5 hits = D13MON4 files exist and ARE tracked — do NOT make"
echo "   public until these are removed or moved to a private repo."
echo "############################################"