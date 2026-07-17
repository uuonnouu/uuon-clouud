# Brain Compression System - Quick Start Guide

## Installation & Setup

### 1. Database Migration
Run these migrations in your PostgreSQL database:

```sql
-- Copy from BRAIN_COMPRESSION_IMPLEMENTATION_SUMMARY.md
-- Section: "Database Migrations"
```

### 2. Start the Server
```bash
cd uuon-clouud
npm install
npm run dev
```

Expected output:
```
[express] serving on port 5000
[Brain Service] Initializing...
[Brain Service] Inventory complete:
  Total files: 250
  Total size: 125.35 MB
  By domain: {3d-shapes: 80, mathematical: 50, ...}
  By priority: {HIGH: 45, MEDIUM: 120, LOW: 85}
[Brain Service] Brain Compression System ready
```

---

## First Test: Scan & Inventory

### Check System Status
```bash
curl http://localhost:5000/api/brain/status
```

Response should show:
- Total files scanned
- Distribution by domain
- Metrics placeholders (initially 0)

---

## Next: Compress a File

### Test on a Simple Mathematical File
```bash
curl -X POST http://localhost:5000/api/brain/compress \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "test/formula.md",
    "fileName": "formula.md",
    "content": "# E=mc²\n\nE = m * c^2\n\nWhere c = 299,792,458 m/s"
  }'
```

Expected response:
```json
{
  "ruleId": "parametric-...",
  "ruleType": "parametric",
  "originalSize": 48,
  "compressedSize": 240,
  "compressionRatio": 5.0,
  "stored": true
}
```

---

## Full Workflow: Compress → Reconstruct → Verify

### Step 1: Compress
```bash
curl -X POST http://localhost:5000/api/brain/compress \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "test/sample.md",
    "content": "Your test content here",
    "fileName": "sample.md"
  }' | jq -r '.ruleId' > rule_id.txt
```

### Step 2: Store Rule ID
```bash
RULE_ID=$(cat rule_id.txt)
echo "Saved rule: $RULE_ID"
```

### Step 3: Reconstruct
```bash
curl -X POST http://localhost:5000/api/brain/reconstruct \
  -H "Content-Type: application/json" \
  -d "{\"ruleId\": \"$(cat rule_id.txt)\"}"
```

### Step 4: Verify Hash
The reconstructed content should match the original byte-for-byte.

---

## Monitor Compression Metrics

### Real-time Metrics
```bash
curl http://localhost:5000/api/brain/metrics | jq .
```

Shows per-technique performance:
```json
{
  "byTechnique": {
    "parametric": {
      "totalRules": 5,
      "successCount": 4,
      "avgCompressionRatio": 0.05,
      "totalStorageSaved": 240000
    },
    ...
  },
  "summary": {
    "totalFiles": 250,
    "totalSize": 125000000,
    "compressedCount": 200,
    "compressedSize": 2500000,
    "compressionRatio": 0.02
  }
}
```

---

## Re-scan Brain Directory

If you add new files to /Brain/raw:

```bash
curl -X POST http://localhost:5000/api/brain/scan
```

Response:
```json
{
  "filesScanned": 252,
  "stats": {
    "totalFiles": 252,
    "totalSize": 126000000,
    "byDomain": {...},
    "byPriority": {...}
  },
  "message": "Scan complete"
}
```

---

## Run Unit Tests

```bash
cd uuon-clouud
npm run test  # If configured
# Or
npx ts-node server/brain/tests.ts
```

Expected output:
```
[Tests] Brain Compression System Test Suite
============================================================

[Test 1] Parametric Handler
  ✓ Parametric compression: 0.0250 ratio
    Original: 400 bytes
    Compressed: 10 bytes

[Test 2] Temporal Handler
  ✓ Temporal compression: 0.1200 ratio
    Versions detected: 3

... (all 7 handlers tested)
```

---

## Batch Compress All Brain Files

### Option 1: Via API (sequential)
```bash
# This would need a new endpoint or script
# For now: implement a batch compression worker
```

### Option 2: Via Script (to be created)
```bash
# Create: uuon-clouud/scripts/compress-brain.ts
# Run: npx ts-node scripts/compress-brain.ts
```

---

## Production Deployment

### Prerequisites
- PostgreSQL database set up
- Environment variables configured
- Network access to /Brain/raw

### Deploy
```bash
npm run build
npm run start
```

Monitor logs:
```bash
tail -f logs/brain.log
```

---

## Troubleshooting

### Issue: "Brain directory not found"
**Solution:** Verify `/Brain/raw` path exists
```bash
ls -la "/:Brain/:Raw"
```

### Issue: "Database connection error"
**Solution:** Check DATABASE_URL environment variable
```bash
echo $DATABASE_URL
```

### Issue: "Compression failed"
**Solution:** Check handler logs and ensure file is readable
```bash
curl http://localhost:5000/api/brain/status
# Look at error details in response
```

### Issue: "Hash mismatch on reconstruction"
**Solution:** Verify handler reconstruction logic
- Check console logs during reconstruction
- Run unit tests for specific handler
- Report issue with file that failed

---

## Performance Tips

### For Large Batches
```javascript
// Process files sequentially
for (const file of files) {
  await compress(file);
}

// Or parallel (max 10 concurrent)
const pLimit = require('p-limit');
const limit = pLimit(10);
const promises = files.map(f => limit(() => compress(f)));
await Promise.all(promises);
```

### Optimize Handlers
- Adjust `minCompressionThreshold` if needed
- Profile slow handlers
- Consider caching for repeated content

---

## Next Milestones

### This Week
- [ ] Verify database schema
- [ ] Test compression on HIGH priority files
- [ ] Collect baseline metrics

### Next Week
- [ ] Compress all 250 files
- [ ] Verify 100% correctness (hash matching)
- [ ] Generate metrics report

### Week After
- [ ] Optimize underperforming techniques
- [ ] Add caching layer
- [ ] Stress test with 1000 concurrent ops

### Phase 2 (Later)
- [ ] Blockchain integration
- [ ] Monetization layer
- [ ] Legal entity structure

---

## Key Files Reference

| File | Purpose |
|------|---------|
| server/brain/types.ts | Type definitions |
| server/brain/scanner.ts | File auditing |
| server/brain/service.ts | Main service logic |
| server/brain/routes.ts | REST API |
| server/brain/compression/parametric.ts | Handler 1 |
| server/brain/compression/temporal.ts | Handler 2 |
| server/brain/compression/relationship.ts | Handler 3 |
| server/brain/compression/transformation.ts | Handler 4 |
| server/brain/compression/functional.ts | Handler 5 |
| server/brain/compression/constraints.ts | Handler 6 |
| server/brain/compression/deterministic.ts | Handler 7 |
| shared/schema.ts | Database schema |
| BRAIN_COMPRESSION_README.md | Full documentation |
| BRAIN_COMPRESSION_CHECKLIST.md | Status tracking |

---

## Support & Documentation

- **Full README:** `BRAIN_COMPRESSION_README.md`
- **Implementation Details:** `BRAIN_COMPRESSION_IMPLEMENTATION_SUMMARY.md`
- **Status Checklist:** `BRAIN_COMPRESSION_CHECKLIST.md`
- **Quick Reference:** This file

---

**Ready to compress the Brain!** 🚀

Next step: Run `npm run dev` and test the system.
