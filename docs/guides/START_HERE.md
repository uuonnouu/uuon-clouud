# 🎯 START HERE — Terminal CLOUUD Agent

## Your System is Running ✅

```
CLOUUD API:     http://localhost:5001 ✅
PostgreSQL:     Running ✅  
Ollama:         Needs start
GitHub Sync:    Needs config
```

---

## 3-Step Startup (5 Minutes)

### Step 1: Start Ollama
```bash
ollama serve
```
(Keep this running in a terminal window)

### Step 2: Configure & Restart
```bash
cp .env.local.template .env.local
nano .env.local
# Add your GITHUB_USER and GITHUB_TOKEN

docker-compose restart clouud-prod
sleep 5
bash verify-system.sh
```

### Step 3: Sync Your Repos
```bash
curl -X POST http://localhost:5001/api/sync/github/pull-all
```

Done. Now use CLOUUD.

---

## Quick Test

```bash
# Create conversation
curl -X POST http://localhost:5001/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}' | jq '.id'

# Send message (replace ID with result from above)
curl -X POST http://localhost:5001/api/conversations/2/messages \
  -H "Content-Type: application/json" \
  -d '{"content":"What do I have in my repos?"}' | jq '.assistantMessage.content'
```

---

## Full Docs

- `README_TERMINAL_AGENT.md` — Start here
- `COMMANDS.md` — All API commands
- `TERMINAL_AGENT_SETUP.md` — Detailed setup
- `health-check.sh` — System diagnostics

---

**That's it. You're ready to build.**
