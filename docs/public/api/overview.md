
# Δmension API Documentation

## Public API Endpoints

### Shape Information
```
GET /api/health
GET /api/shapes/:category
```

### Mathematical Verification
```
POST /api/verify-surface
POST /api/verify-batch
```

### System Status
```
GET /api/system-status
```

## Authentication

API access requires valid authentication tokens. Contact support for access.

## Rate Limits

- Public endpoints: 100 requests/hour
- Authenticated endpoints: 1000 requests/hour

## Response Format

All responses follow standard JSON format:
```json
{
  "success": true,
  "data": {...},
  "timestamp": "2025-11-30T13:52:38.245Z"
}
```

---
For complete API documentation, see the interactive API explorer.
