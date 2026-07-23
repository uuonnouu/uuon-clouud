# UUON Token Ledger API

Public read endpoints — no authentication required.

## GET /api/health
```json
{"status":"ok","version":"2.0","chain":"Base Mainnet","genesis":"cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04"}
```

## GET /api/tokens
Query params: `category`, `limit` (max 200), `offset`

## GET /api/tokens/:tokenId
Returns token metadata, Merkle proof, on-chain record.

## GET /api/tokens/:tokenId/proof
Returns Merkle proof verifiable against genesis root.

## GET /api/shapes
Lists all 32 registered shapes with file references.

## GET /api/genesis
Returns genesis ledger — founding proof of chain.

## GET /api/stats
```json
{"totalSupply":10000000,"circulatingSupply":4000000,"treasuryReserve":6000000,"totalShapes":32}
```

Rate limit: 100 req/min per IP.
