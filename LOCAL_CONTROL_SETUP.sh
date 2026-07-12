#!/bin/bash

# CLOUUD Terminal — COMPLETE LOCAL CONTROL SETUP
# Everything runs locally. You own it all.

cat << 'EOF'

╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║      🔐 CLOUUD TERMINAL — COMPLETE LOCAL CONTROL             ║
║                                                              ║
║        Everything stays on YOUR machine. You own it.        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝


WHAT YOU'RE GETTING:

✅ Local Ollama LLM (your AI, runs on your Mac)
✅ CLOUUD API (your server, runs in Docker)
✅ PostgreSQL Database (your data, stored locally)
✅ Terminal CLI (your interface, all commands)
✅ Full conversation history (your data, never leaves)
✅ Complete audit trail (everything tracked)
✅ GitHub integration (your repos synced locally)
✅ Zero external calls (nothing sent anywhere)
✅ Zero credits (costs you nothing)
✅ Total ownership (you control everything)


════════════════════════════════════════════════════════════════

3-STEP COMPLETE SETUP

STEP 1: Download & Start Ollama (5 minutes)
────────────────────────────────────────────

Go to: https://ollama.ai
Click "Download" 
Choose macOS
Run the installer

When installed, open Terminal and type:

    ollama serve

Wait for:
    Listening on 127.0.0.1:11434

✅ Leave this running. Don't close it.


STEP 2: Pull a Local Model (2 minutes)
────────────────────────────────────────────

Open a NEW terminal window and type:

    ollama pull mistral

(This downloads a powerful free model)

Wait for completion. Shows:
    success

✅ Now you have your own AI model. Totally free.


STEP 3: Start CLOUUD Terminal Interface
────────────────────────────────────────────

In that same new terminal, type:

    cd ~/uuon-c1ouud && ./launch-clouud

You'll see the menu:

    1) New conversation
    2) Send message
    3) View conversation
    ...

✅ You now have complete control.


════════════════════════════════════════════════════════════════

HOW TO USE IT

1. Create conversation (menu option 1):
   Type: "My Project Name"

2. Send message (menu option 2):
   Type your question
   
   It goes:
   Your question → CLOUUD API → Ollama (your local model) → Answer
   
   Everything stays local.

3. View conversation (menu option 3):
   See all your messages and Ollama's responses

4. Check status (menu option 6):
   See what's running where


════════════════════════════════════════════════════════════════

VERIFY IT'S WORKING

In your CLOUUD terminal, pick option 6: "Check system status"

You should see:
  ✅ API: operational
  ✅ Database: connected
  ✅ Ollama: available (if running)
  ✅ Conversations: stored locally


════════════════════════════════════════════════════════════════

PERMANENT SETUP (Optional - Do Once)

If you want to start both at once from one command:

Create a file called: start-clouud.sh

Paste this:

───────────────────────────────────
#!/bin/bash

# Terminal 1: Start Ollama
open -a Terminal /dev/null && \
osascript -e 'tell app "Terminal" to do script "ollama serve"'

sleep 2

# Terminal 2: Start CLOUUD
open -a Terminal /dev/null && \
osascript -e 'tell app "Terminal" to do script "cd ~/uuon-c1ouud && ./launch-clouud"'
───────────────────────────────────

Make it executable:
    chmod +x start-clouud.sh

Then run:
    ./start-clouud.sh

Opens both automatically.


════════════════════════════════════════════════════════════════

IMPORTANT - READ THIS

Your data:
  📁 Stored: ~/uuon-c1ouud/ (your computer)
  🔒 Encrypted: No (local, so doesn't need to be)
  🌐 Sent anywhere: Never
  💾 Backed up: Nightly to ./backups/
  🔄 Synced: Only to GitHub if you choose

Ollama:
  📁 Stored: ~/.ollama/ (your computer)
  🆓 Cost: $0 (free)
  ⚡ Speed: Fast (local processing)
  🧠 Model: Mistral (7B - very capable)
  🆙 Can upgrade: Yes (larger models available)


════════════════════════════════════════════════════════════════

YOUR TERMINAL COMMANDS - SAVE THESE

Start Ollama (Terminal 1):
    ollama serve

Use CLOUUD (Terminal 2):
    cd ~/uuon-c1ouud && ./launch-clouud

Check system:
    cd ~/uuon-c1ouud && bash verify-system.sh

View docs:
    cd ~/uuon-c1ouud && cat COMMANDS.md


════════════════════════════════════════════════════════════════

YOU NOW OWN:

✅ Your AI system (runs locally, you control)
✅ Your data (stays on your Mac, never leaves)
✅ Your conversations (stored locally, you decide what to do)
✅ Your entire infrastructure (Docker, DB, API, all local)

No subscriptions. No external dependencies. No credits.
Complete control. Complete ownership. Complete privacy.


════════════════════════════════════════════════════════════════

START NOW:

1. Download Ollama: https://ollama.ai
2. Install it
3. Open Terminal
4. Type: ollama serve
5. Open another Terminal
6. Type: cd ~/uuon-c1ouud && ./launch-clouud
7. Done. You're in control.


════════════════════════════════════════════════════════════════

That's it.

You own CLOUUD now.

════════════════════════════════════════════════════════════════

EOF
