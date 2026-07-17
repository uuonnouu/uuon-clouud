# Brain Compression System - Complete API Reference

## Base URL
```
http://localhost:5000/api/brain
```

---

## Compression Operations

### POST /brain/compress
**Compress a file and store compression rule**

#### Request
```json
{
  "filePath": "relative/path/to/file.md",
  "fileName": "file.md",
  "content": "... file content ..."
}
```

#### Response (200)
```json
{
  "ruleId": "parametric-xyz-12345",
  "ruleType": "parametric",
  "originalSize": 5000,
  "compressedSize": 250,
  "compressionRatio": 0.05,
  "stored": true
}
```

#### Response (400)
```json
{
  "error": "Missing filePath or content"
}
```

---

### POST /brain/reconstruct
**Reconstruct original content from stored rule**

#### Request
```json
{
  "ruleId": "parametric-xyz-12345"
}
```

#### Response (200)
```json
{
  "content": "... original file content ...",
  "size": 5000,
  "reconstructionTimeMs": 5
}
```

#### Response (404)
```json
{
  "error": "Rule not found or reconstruction failed"
}
```

---

## Inventory & Discovery

### GET /brain/inventory
**Get inventoried files from /Brain/raw**

#### Query Parameters
- `domain` (optional): Filter by domain (e.g., "3d-shapes", "mathematical")
- `priority` (optional): Filter by priority (HIGH, MEDIUM, LOW)

#### Request
```
GET /brain/inventory?domain=3d-shapes&priority=HIGH
```

#### Response (200)
```json
{
  "files": [
    {
      "filePath": "mathematical/E=mc2.md",
      "fileName": "E=mc2.md",
      "fileSize": 5000,
      "contentHash": "abc123...",
      "domain": "mathematical",
      "priority": "HIGH"
    },
    ...
  ],
  "stats": {
    "totalFiles": 250,
    "totalSize": 125000000,
    "byDomain": {
      "3d-shapes": 80,
      "mathematical": 50,
      "code": 40,
      ...
    },
    "byPriority": {
      "HIGH": 45,
      "MEDIUM": 120,
      "LOW": 85
    }
  },
  "count": 5
}
```

---

### POST /brain/scan
**Re-scan /Brain/raw directory**

#### Request
```
POST /brain/scan
```

#### Response (200)
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

## Metrics & Analytics

### GET /brain/metrics
**Get compression metrics by technique**

#### Request
```
GET /brain/metrics
```

#### Response (200)
```json
{
  "byTechnique": {
    "parametric": {
      "totalRules": 45,
      "successCount": 44,
      "failureCount": 1,
      "avgCompressionRatio": 0.015,
      "minCompressionRatio": 0.005,
      "maxCompressionRatio": 0.08,
      "avgReconstructionTimeMs": 8,
      "totalStorageSaved": 2250000,
      "fileCount": 45
    },
    "temporal": {
      "totalRules": 30,
      "successCount": 29,
      "failureCount": 1,
      "avgCompressionRatio": 0.12,
      ...
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

### GET /brain/dashboard
**Get comprehensive dashboard metrics**

#### Request
```
GET /brain/dashboard
```

#### Response (200)
```json
{
  "timestamp": "2026-07-08T12:34:56.000Z",
  "overall": {
    "totalFiles": 250,
    "totalOriginalSize": 125000000,
    "totalCompressedSize": 2500000,
    "compressionRatio": 0.02,
    "storageSavingsBytes": 122500000,
    "storageSavingsMB": 117.0,
    "storageSavingsGB": 0.114
  },
  "byTechnique": {
    "parametric": { ... },
    "temporal": { ... },
    ...
  },
  "performance": {
    "avgCompressionTimeMs": 45,
    "avgReconstructionTimeMs": 8,
    "topPerformer": "parametric",
    "worstPerformer": "constraints"
  },
  "costAnalysis": {
    "originalCostPerMonth": 2.875,
    "compressedCostPerMonth": 0.0575,
    "costSavingsPerMonth": 2.8175,
    "costSavingsPerYear": 33.81
  },
  "topFiles": [
    {
      "domain": "3d-shapes",
      "technique": "parametric",
      "originalSize": 50000,
      "compressedSize": 250,
      "compressionRatio": 0.005,
      "savings": 49750
    },
    ...
  ],
  "trends": {
    "compressionRatioTrend": "excellent",
    "volumeGrowth": "stable",
    "techniquePrefernce": "parametric"
  }
}
```

---

### GET /brain/technique/:technique/metrics
**Get metrics for specific technique**

#### Path Parameters
- `technique`: parametric | temporal | relationship | transformation | functional | constraints | deterministic

#### Request
```
GET /brain/technique/parametric/metrics
```

#### Response (200)
```json
{
  "name": "parametric",
  "totalRules": 45,
  "successCount": 44,
  "failureCount": 1,
  "successRate": 0.978,
  "avgCompressionRatio": 0.015,
  "minCompressionRatio": 0.005,
  "maxCompressionRatio": 0.08,
  "avgReconstructionTimeMs": 8,
  "totalStorageSaved": 2250000,
  "fileCount": 45,
  "topFile": {
    "ratio": 0.005,
    "savedBytes": 49750
  }
}
```

---

### GET /brain/distribution
**Get compression ratio distribution**

#### Request
```
GET /brain/distribution
```

#### Response (200)
```json
{
  "distribution": [
    {
      "range": "0-1%",
      "count": 50,
      "percentage": 25.0
    },
    {
      "range": "1-5%",
      "count": 80,
      "percentage": 40.0
    },
    {
      "range": "5-10%",
      "count": 40,
      "percentage": 20.0
    },
    {
      "range": "10-25%",
      "count": 20,
      "percentage": 10.0
    },
    {
      "range": "25-50%",
      "count": 10,
      "percentage": 5.0
    },
    {
      "range": "50-100%",
      "count": 0,
      "percentage": 0.0
    }
  ]
}
```

---

### GET /brain/domains
**Get metrics by domain**

#### Request
```
GET /brain/domains
```

#### Response (200)
```json
{
  "domains": [
    {
      "domain": "3d-shapes",
      "fileCount": 80,
      "totalOriginalSize": 40000000,
      "totalCompressedSize": 200000,
      "compressionRatio": 0.005,
      "topTechnique": "parametric"
    },
    {
      "domain": "mathematical",
      "fileCount": 50,
      "totalOriginalSize": 25000000,
      "totalCompressedSize": 500000,
      "compressionRatio": 0.02,
      "topTechnique": "parametric"
    },
    ...
  ]
}
```

---

### GET /brain/timeline
**Get performance timeline**

#### Query Parameters
- `hours` (optional): Number of hours to look back (default: 24)

#### Request
```
GET /brain/timeline?hours=24
```

#### Response (200)
```json
{
  "timeline": [
    {
      "timestamp": "2026-07-08T00:00",
      "compressionCount": 15,
      "avgRatio": 0.025,
      "avgTimeMs": 42
    },
    {
      "timestamp": "2026-07-08T01:00",
      "compressionCount": 20,
      "avgRatio": 0.022,
      "avgTimeMs": 38
    },
    ...
  ]
}
```

---

## System Status

### GET /brain/status
**Get overall Brain system status**

#### Request
```
GET /brain/status
```

#### Response (200)
```json
{
  "status": "operational",
  "inventory": {
    "totalFiles": 250,
    "totalSize": 125000000,
    "byDomain": {...},
    "byPriority": {...}
  },
  "summary": {
    "totalFiles": 250,
    "totalSize": 125000000,
    "compressedCount": 200,
    "compressedSize": 2500000,
    "compressionRatio": 0.02
  },
  "metrics": {
    "parametric": {...},
    "temporal": {...},
    ...
  },
  "ready": true
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required parameter"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting
- Global limit: 1000 requests/minute
- Per-endpoint limits may vary
- Rates reset hourly

---

## Common Compression Ratios

| Technique | Target | Example |
|-----------|--------|---------|
| Parametric | 0.01 (1%) | 3D shapes, formulas |
| Temporal | 0.12 (12%) | Version chains |
| Relationship | 0.004 (0.4%) | Large graphs |
| Transformation | 0.05 (5%) | Algorithm variants |
| Functional | 0.02 (2%) | Code files |
| Constraints | 0.3 (30%) | State machines |
| Deterministic | 0.0001 (0.01%) | Fractals |

---

## Example Workflows

### Complete Compression Workflow
```bash
# 1. Scan Brain directory
curl -X POST http://localhost:5000/api/brain/scan

# 2. Compress a file
curl -X POST http://localhost:5000/api/brain/compress \
  -H "Content-Type: application/json" \
  -d '{
    "filePath": "math/formula.md",
    "fileName": "formula.md",
    "content": "E = m * c^2"
  }' | jq -r '.ruleId' > rule.txt

# 3. Get metrics
curl http://localhost:5000/api/brain/dashboard | jq '.overall'

# 4. Reconstruct
curl -X POST http://localhost:5000/api/brain/reconstruct \
  -H "Content-Type: application/json" \
  -d "{\"ruleId\": \"$(cat rule.txt)\"}"
```

### Dashboard Monitoring
```bash
# Get comprehensive metrics
curl http://localhost:5000/api/brain/dashboard | jq .

# Check specific technique
curl http://localhost:5000/api/brain/technique/parametric/metrics

# Get distribution
curl http://localhost:5000/api/brain/distribution | jq '.distribution'

# Check domains
curl http://localhost:5000/api/brain/domains | jq '.domains'

# Performance timeline
curl 'http://localhost:5000/api/brain/timeline?hours=24'
```

---

## Response Times

| Endpoint | Typical | Max |
|----------|---------|-----|
| POST compress | 50ms | 200ms |
| POST reconstruct | 10ms | 50ms |
| GET metrics | 20ms | 100ms |
| GET dashboard | 100ms | 500ms |
| GET timeline | 50ms | 200ms |

---

**Brain Compression API v1.0**  
*Complete compression + analytics system for UUON*
