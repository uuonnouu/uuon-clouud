#!/bin/bash

# CLOUUD Terminal — Setup Complete Summary

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           ✅ CLOUUD TERMINAL AGENT — SETUP COMPLETE         ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


🎯 WHAT YOU HAVE

✅ Local CLOUUD API (http://localhost:5001)
✅ PostgreSQL Database (storing conversations)
✅ Full conversation history (no cutoffs)
✅ Credit & token tracking
✅ Audit logging
✅ GitHub repo sync ready
✅ Interactive CLI interface


═══════════════════════════════════════════════════════════════

⚡ QUICKEST WAY TO START

Copy and paste this ONCE in your terminal:

    source ~/.zshrc

Then just type:

    clouud

That's it. You'll be in the interactive CLOUUD agent menu.


═══════════════════════════════════════════════════════════════

🚀 IF ALIAS SETUP DIDN'T WORK

Use these commands directly:

    cd ~/uuon-c1ouud
    ./clouud-cli


═══════════════════════════════════════════════════════════════

📋 INTERACTIVE MENU OPTIONS

When you run: clouud

You'll see:

    1) New conversation         ← Create a task
    2) Send message            ← Chat with CLOUUD
    3) View conversation       ← See history
    4) List all conversations  ← All your tasks
    5) Search GitHub repos     ← Find your code
    6) Check system status     ← Health check
    7) View audit log          ← What was done
    8) Register credit         ← Track tokens
    9) Log JUNO transaction    ← Track blockchain
    0) Exit


═══════════════════════════════════════════════════════════════

✅ VERIFY IT'S WORKING

Run this quick test:

    cd ~/uuon-c1ouud
    bash verify-system.sh

Expected output:
    ✅ Docker containers
    ✅ CLOUUD API
    ✅ PostgreSQL
    ✅ Ollama (note: needs manual start)


═══════════════════════════════════════════════════════════════

🔧 NEXT SETUP STEPS (When Ready)

1. Start Ollama in a new terminal:
   ollama serve

2. Configure GitHub:
   cd ~/uuon-c1ouud
   cp .env.local.template .env.local
   nano .env.local
   # Add GITHUB_USER and GITHUB_TOKEN

3. Restart Docker:
   docker-compose restart clouud-prod

4. Sync your repos:
   curl -X POST http://localhost:5001/api/sync/github/pull-all


═══════════════════════════════════════════════════════════════

📚 DOCUMENTATION IN PROJECT

    START_HERE.md              ← 3-minute setup
    README_TERMINAL_AGENT.md   ← Full guide
    COMMANDS.md                ← All API endpoints
    RUN_THIS_NOW.txt           ← Quick reference


═══════════════════════════════════════════════════════════════

RIGHT NOW:

1. Activate alias:
   source ~/.zshrc

2. Type:
   clouud

3. Select menu option 1 or 2


═══════════════════════════════════════════════════════════════

                    ✨ Ready to build ✨

═══════════════════════════════════════════════════════════════

EOF
