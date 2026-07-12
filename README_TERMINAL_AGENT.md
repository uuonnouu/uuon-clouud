# 🚀 CLOUUD Terminal Agent — Ready to Run

## System Status ✅

```
✅ Docker: clouud-prod (App), clouud-db (Database) — RUNNING
✅ API: http://localhost:5001 — OPERATIONAL  
✅ PostgreSQL: Connected and ready
✅ Ollama: Ready (needs manual start)
✅ Conversations: 1 stored, no cutoffs
✅ GitHub Sync: Ready (needs config)
```

---

## What You Need to Do NOW

### 1️⃣ Start Ollama (Terminal Window 1)

```bash
ollama serve
```

**Expected output:**
```
time=2026-07-12T... level=INFO msg="Listening on" address=[::]:11434
```

### 2️⃣ Configure GitHub Access (Terminal Window 2)

```bash
# Copy template
cp .env.local.template .env.local

# Edit with your GitHub username and token
nano .env.local
```

**Edit these lines:**
```
GITHUB_USER=your_github_username_here
GITHUB_TOKEN=ghp_your_personal_access_token_here
```

**Get GitHub token:**
- Go to: https://github.com/settings/tokens
- Click "Generate new token"
- Select `repo` scope only
- Copy the token value

**Save and exit:** `Ctrl+O` → Enter → `Ctrl+X`

### 3️⃣ Restart Docker to Load Config

```bash
docker-compose restart clouud-prod

# Wait 5 seconds for restart
sleep 5

# Verify
bash verify-system.sh
```

### 4️⃣ Sync Your GitHub Repos (One-time, ~1 minute)

```bash
# Trigger sync
curl -X POST http://localhost:5001/api/sync/github/pull-all

# Monitor progress (in another window)
watch -n 1 'curl http://localhost:5001/api/sync/github/stats | jq ".repos"'
```

### 5️⃣ Test Your First Agent Interaction

```bash
# Create conversation
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Terminal Test"}' | jq '.'

# You should get back something like:
# { "id": 2, "title": "Terminal Test", "createdAt": "2026-07-12T..." }

# Send message (use the ID from above, e.g., 2)
curl -X POST http://localhost:5001/api/conversations/2/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"What files are in my GitHub repos?"}' | jq '.assistantMessage.content'
```

---

## Verify Everything Works

```bash
# Quick check (30 seconds)
bash verify-system.sh

# Full diagnostic (2 minutes)
bash health-check.sh
```

---

## Commands You'll Use Most

```bash
# Create new conversation
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Your Project Name"}'

# Send message to CLOUUD
curl -X POST http://localhost:5001/api/conversations/ID/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"Your question here"}'

# Search your GitHub repos
curl "http://localhost:5001/api/sync/github/search?q=keyword"

# View audit log (what tools used what resources)
curl http://localhost:5001/api/audit-log | jq '.entries[-10:]'

# List all conversations
curl http://localhost:5001/api/conversations | jq '.[] | {id, title}'
```

---

## Key Files

| File | Purpose |
|------|---------|
| `COMMANDS.md` | All API commands reference |
| `TERMINAL_AGENT_SETUP.md` | Detailed setup documentation |
| `TERMINAL_AGENT_QUICK_START.md` | Quick start guide |
| `.env.local.template` | Environment config template |
| `verify-system.sh` | Quick 30-second health check |
| `health-check.sh` | Full diagnostic (run if issues) |
| `juno_purchase_guide.md` | How to buy JUNO token |
| `blockdaemon_setup.md` | Validator setup tracking |
| `docker-compose.yml` | Docker configuration |

---

## Troubleshooting

### "API not responding"
```bash
# Check if running
docker ps | grep clouud-prod

# If not running, check logs
docker logs clouud-prod | tail -20

# Restart
docker-compose restart clouud-prod
```

### "Ollama connection failed"
```bash
# Start Ollama
ollama serve

# In another window, verify
curl http://localhost:11434/api/tags
```

### "GitHub sync failed"
```bash
# Verify env vars are set
docker exec clouud-prod sh -c 'echo $GITHUB_USER'

# Check token is valid
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/user
```

### "Database connection error"
```bash
# Verify database is running
docker ps | grep clouud-db

# Test connection
docker exec clouud-db psql -U clouud -d clouud -c "SELECT 1"

# If fails, reset
docker-compose down -v
docker-compose up -d
```

---

## Your Terminal Agent is Now:

✅ **Fast** — No network latency, local processing  
✅ **Cheap** — Ollama is free, no API costs  
✅ **Private** — Everything stays on your machine  
✅ **Unlimited** — No conversation cutoffs or token limits  
✅ **Knowledgeable** — Full access to all your GitHub repos  
✅ **Tracked** — Complete audit trail of all usage  

---

## Next Steps

1. Start Ollama: `ollama serve`
2. Configure GitHub: `nano .env.local`
3. Restart Docker: `docker-compose restart clouud-prod`
4. Sync repos: `curl -X POST http://localhost:5001/api/sync/github/pull-all`
5. Test: `bash verify-system.sh`

Then use CLOUUD from your terminal for all your development tasks.

**You're ready. Go build.**
