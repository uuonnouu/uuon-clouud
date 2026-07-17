# CLOUUD Terminal Agent Setup Guide
**Status**: Complete local integration — Ollama + GitHub + Full History

## What This Does

Your local CLOUUD becomes a **completely self-sufficient agent**:
- ✅ All conversations stored locally (no cloud dependency)
- ✅ Full GitHub repo access as knowledge base
- ✅ Ollama runs locally (no API costs)
- ✅ Complete audit trail of all tool usage
- ✅ Credit/token tracking across all tools
- ✅ No conversation cutoffs (full history)

## Prerequisites

1. **Ollama installed locally**
   ```bash
   brew install ollama  # macOS
   # or download from https://ollama.ai
   ```

2. **Model downloaded**
   ```bash
   ollama pull neural-chat:7b
   # or your preferred model
   ```

3. **Ollama running**
   ```bash
   ollama serve
   # Runs on http://localhost:11434
   ```

4. **Docker & Docker Compose**
   ```bash
   docker --version
   docker-compose --version
   ```

5. **GitHub Personal Access Token**
   - Go to https://github.com/settings/tokens
   - Create token with `repo` scope
   - Copy token value

## Setup Steps

### Step 1: Configure Environment
```bash
cp .env.local.template .env.local

# Edit .env.local with:
GITHUB_USER=your_github_username
GITHUB_TOKEN=your_github_pat_token
OLLAMA_MODEL=neural-chat:7b  # or your model
```

### Step 2: Start CLOUUD System
```bash
# In terminal window 1: Start Ollama
ollama serve

# In terminal window 2: Start CLOUUD
docker-compose up -d

# Verify health
curl http://localhost:5001/api/health | jq '.status'
# Expected: "operational"
```

### Step 3: Sync Your GitHub Repos (One-time)
```bash
# List your repos
curl http://localhost:5001/api/sync/github/list | jq '.'

# Pull all repos + index them
curl -X POST http://localhost:5001/api/sync/github/pull-all

# Check sync progress
curl http://localhost:5001/api/sync/github/stats | jq '.'
```

### Step 4: Export Conversation History
```bash
# Export all conversations from here
curl -X POST http://localhost:5001/api/export/conversations | jq '.'

# Generate Ollama knowledge base (text file)
curl -X POST http://localhost:5001/api/export/ollama-context | jq '.'

# Files saved to:
# - ./backups/conversations-export.json
# - ./backups/ollama-knowledge-base.txt
```

## Using Local CLOUUD

### Start a Conversation
```bash
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task"}'
# Returns: conversation ID
```

### Send Message
```bash
curl -X POST http://localhost:5001/api/conversations/1/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"What are the key files in my blockchain project?"}'
```

### Search Your GitHub Repos
```bash
curl "http://localhost:5001/api/sync/github/search?q=validator"
```

### Check Token/Credit Usage
```bash
curl http://localhost:5001/api/credits/all | jq '.'
```

### View Audit Log
```bash
curl "http://localhost:5001/api/audit-log?hours=24" | jq '.entries[-10:]'
```

## How It Works

### Conversation Flow
1. You ask a question in your local CLOUUD
2. System checks GitHub knowledge base for relevant files
3. Checks your conversation history for context
4. Sends to Ollama (running locally)
5. Response comes back with no external dependency
6. Stored in local PostgreSQL database
7. Logged to audit trail

### GitHub as Knowledge Base
- All repos cloned to `./github-sync/`
- Files indexed and searchable
- When you ask a question, system searches your repos first
- Includes code, markdown, configs as context

### No Conversation Cutoff
- `MAX_HISTORY_MESSAGES = 0` = send entire conversation
- Every message ever sent is available to the AI
- No token limits on history (only on response)

## Troubleshooting

### Ollama not connecting
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# If fails, start Ollama:
ollama serve
```

### GitHub sync failing
```bash
# Check token is valid
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user

# Check env vars
echo $GITHUB_USER
echo $GITHUB_TOKEN
```

### CLOUUD container won't start
```bash
# Check logs
docker logs clouud-prod

# Restart
docker-compose restart clouud-prod

# Full rebuild
docker-compose down
docker-compose up -d --build
```

### PostgreSQL permission denied
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

## API Endpoints Reference

**Sync & Knowledge**
- `POST /api/sync/github/list` — List your GitHub repos
- `POST /api/sync/github/pull-all` — Sync all repos
- `GET /api/sync/github/search?q=term` — Search repos
- `GET /api/sync/github/stats` — Repo statistics

**Export/Backup**
- `POST /api/export/conversations` — Export all conversations
- `POST /api/export/ollama-context` — Generate knowledge base file

**Conversation Management**
- `POST /api/conversations` — Create conversation
- `POST /api/conversations/:id/messages` — Send message
- `GET /api/conversations/:id/messages` — Get conversation

**Credits & Audit**
- `POST /api/credits/register` — Register new credit
- `GET /api/credits/all` — List all credits
- `GET /api/credits/report` — Credit expiration report
- `POST /api/audit/log` — Log event
- `GET /api/audit-log` — View audit trail

**Blockchain**
- `POST /api/blockchain/transaction` — Log transaction
- `GET /api/blockchain/transactions` — View all transactions

## Next Steps

1. ✅ Start Ollama + CLOUUD
2. ✅ Sync GitHub repos
3. ✅ Export conversations from here
4. ✅ Create your first task in terminal CLOUUD
5. ✅ System will search your repos + history automatically

Your terminal agent is now **completely self-contained and unlimited**.

---

**Remember**: Your local system is:
- Faster (no network latency)
- Cheaper (Ollama free, no API costs)
- Private (all data stays local)
- Unlimited (no conversation cutoffs)
