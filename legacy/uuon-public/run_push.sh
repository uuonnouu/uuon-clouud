#!/bash
echo "📦 Setting secure origin parameters..."
git remote remove origin 2>/dev/null
git remote add origin https://github.com
echo "🚀 Broadcasting direct push to main branch..."
git push origin main --force
