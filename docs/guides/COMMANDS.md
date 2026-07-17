# CLOUUD Terminal Agent — Commands to Run

## Quick 30-Second Verification

```bash
# 1. Check Docker is running
docker ps | grep clouud

# 2. Check API is responding
curl http://localhost:5001/api/health | jq '.status'
# Expected: "operational"

# 3. Check database is connected
curl http://localhost:5001/api/health | jq '.components.database.status'
# Expected: "connected"

# 4. Check conversations are storing
curl http://localhost:5001/api/conversations | jq 'length'
# Expected: number >= 0
```

## Full System Check

```bash
# Run the comprehensive health check
bash health-check.sh

# Or the quick version
bash verify-system.sh
```

## Setup Commands (One-Time)

```bash
# 1. Copy environment template
cp .env.local.template .env.local

# 2. Edit .env.local with your values
nano .env.local
# Add:
# - GITHUB_USER=your_github_username
# - GITHUB_TOKEN=your_github_pat_token
# - OLLAMA_MODEL=neural-chat:7b (or your model)

# 3. Restart Docker to load new env
docker-compose restart clouud-prod

# 4. Verify restart
docker logs clouud-prod | tail -20
# Should show: "serving on port 5001"
```

## GitHub Integration Setup

```bash
# 1. Verify GitHub is configured
curl http://localhost:5001/api/sync/github/stats

# 2. List all your repos
curl -X POST http://localhost:5001/api/sync/github/list

# 3. Clone and index all repos (one-time, can take a minute)
curl -X POST http://localhost:5001/api/sync/github/pull-all

# 4. Watch progress
watch curl http://localhost:5001/api/sync/github/stats

# 5. Search your repos
curl "http://localhost:5001/api/sync/github/search?q=validator"
```

## Export Your Conversation History

```bash
# 1. Export all conversations as JSON
curl -X POST http://localhost:5001/api/export/conversations | jq '.'

# 2. Generate knowledge base for Ollama
curl -X POST http://localhost:5001/api/export/ollama-context | jq '.'

# Files saved to:
# - ./backups/conversations-export.json
# - ./backups/ollama-knowledge-base.txt
```

## Start Using CLOUUD

```bash
# 1. Create a conversation
CONV_ID=$(curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"My Project"}' | jq '.id')

echo "Conversation ID: $CONV_ID"

# 2. Send a message
curl -X POST http://localhost:5001/api/conversations/$CONV_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"What files are in my repos?"}' \
  | jq '.assistantMessage.content'

# 3. View all messages in conversation
curl http://localhost:5001/api/conversations/$CONV_ID/messages | jq '.[]'

# 4. Check audit log
curl http://localhost:5001/api/audit-log | jq '.entries[-5:]'
```

## Blockchain & Credits

```bash
# 1. Register JUNO credits
curl -X POST http://localhost:5001/api/credits/register \
  -H "Content-Type: application/json" \
  -d '{
    "service": "blockdaemon",
    "credentialType": "credits",
    "name": "JUNO Validator",
    "quantity": 1000,
    "unit": "API calls",
    "expiresAt": "2026-08-12T00:00:00Z"
  }' | jq '.'

# 2. View all credits
curl http://localhost:5001/api/credits/all | jq '.credentials'

# 3. Check expiration report
curl http://localhost:5001/api/credits/report | jq '.'

# 4. Log JUNO transaction
curl -X POST http://localhost:5001/api/blockchain/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "type": "purchase",
    "asset": "JUNO",
    "amount": "100",
    "source": "Osmosis",
    "destination": "blockdaemon",
    "txHash": "tx_hash_here"
  }' | jq '.'

# 5. View transactions
curl "http://localhost:5001/api/blockchain/transactions?asset=JUNO" | jq '.transactions'
```

## Monitoring & Logs

```bash
# 1. Watch container logs
docker logs -f clouud-prod

# 2. Watch database logs
docker logs -f clouud-db

# 3. Check Docker stats
docker stats clouud-prod clouud-db

# 4. View recent audit events
curl "http://localhost:5001/api/audit-log?hours=1" | jq '.entries[-10:]'

# 5. Filter audit by tool
curl "http://localhost:5001/api/audit-log?tool=github" | jq '.entries'
```

## Restart/Rebuild Commands

```bash
# 1. Soft restart (keeps data)
docker-compose restart

# 2. Full rebuild from source
docker-compose down
docker-compose up -d --build

# 3. Hard reset (deletes database)
docker-compose down -v
docker-compose up -d

# 4. Check system status after restart
sleep 5 && bash verify-system.sh
```

## Required Services to Start Manually

```bash
# In a new terminal, start Ollama
ollama serve

# Watch it load
# Should see: "Listening on 127.0.0.1:11434"

# Verify Ollama is ready
curl http://localhost:11434/api/tags | jq '.models | length'
```

## All Endpoints Quick Reference

```bash
# Health & Status
GET  /api/health                                # System status
GET  /api/metrics                               # Performance metrics

# Conversations
POST /api/conversations                         # Create conversation
GET  /api/conversations                         # List all
GET  /api/conversations/:id/messages            # Get messages
POST /api/conversations/:id/messages            # Send message

# GitHub Sync
POST /api/sync/github/list                      # List your repos
POST /api/sync/github/pull-all                  # Clone & index all
GET  /api/sync/github/search?q=term             # Search repos
GET  /api/sync/github/stats                     # Repo statistics

# Export
POST /api/export/conversations                  # Export all conversations
POST /api/export/ollama-context                 # Generate knowledge base

# Credits & Tokens
POST /api/credits/register                      # Register new credit
GET  /api/credits/all                           # List credits
GET  /api/credits/report                        # Expiration report
POST /api/credits/use                           # Record usage

# Audit Logging
GET  /api/audit-log                             # View audit trail
POST /api/audit/log                             # Log event

# Blockchain
POST /api/blockchain/transaction                # Log transaction
GET  /api/blockchain/transactions               # View transactions

# Feedback
POST /api/feedback                              # Rate response
GET  /api/feedback/summary                      # Feedback statistics
```

---

## Troubleshooting

```bash
# If containers won't start
docker-compose logs

# If API won't respond
curl -v http://localhost:5001/api/health

# If database won't connect
docker exec clouud-db psql -U clouud -d clouud -c "SELECT 1"

# If Ollama won't connect
curl -v http://localhost:11434/api/tags

# If GitHub sync fails
docker exec clouud-prod sh -c 'echo $GITHUB_USER $GITHUB_TOKEN'
```

---

**Start with:** `bash verify-system.sh`  
**Full check:** `bash health-check.sh`  
**Create conversation:** See "Start Using CLOUUD" section
