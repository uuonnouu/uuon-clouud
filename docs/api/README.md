
# Δmension API Documentation

## Overview
Complete API reference for the Mathematical Universe platform.

## Core Endpoints

### Shape Computation
- `POST /api/compute` - Generate 3D shape geometry
- `GET /api/shapes` - List available shapes
- `GET /api/shapes/{id}` - Get specific shape details

### Token System
- `POST /api/token-ecosystem/generate` - Generate tokens
- `GET /api/token-ecosystem/balance` - Check token balance

### Export System
- `POST /api/export` - Export shapes in various formats
- `GET /api/export/{id}` - Download exported file

## Authentication
All API endpoints require proper authentication headers.

## Rate Limits
- 1000 requests per hour for free tier
- Unlimited for premium users

## Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `429` - Rate Limited
- `500` - Server Error
