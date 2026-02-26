# UUON Clouud — G°centric Intelligence System

## Overview
UUON Clouud is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Phillip Aguilar Ruiz III). It connects to Anthropic's Claude API with a strict system prompt that enforces the G°centric philosophy: Earth-grounded reasoning, zero drift, zero rounding. Responses are in plain text, short summaries, no bullets or dashes, readable at a 9th grade level.

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **AI:** Anthropic Claude API via Replit AI Integrations (claude-sonnet-4-6, max_tokens: 1024)
- **Routing:** wouter (frontend)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface with sidebar, quick actions, Δmension link
- `client/src/components/clouud-avatar.tsx` — Clouud avatar (static image with state-driven CSS animation)
- `server/routes.ts` — API routes with system prompt (includes founder bio, verified Sketchfab data, Δmension info), tool use, output guard
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation, cultural rotation, ported from Phil's Python original)
- `server/storage.ts` — Database operations (conversations, messages, UUON tokens, creator profile)
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema (conversations, messages, uuon_tokens, creator_profile tables)
- `client/src/components/metrics-panel.tsx` — Collapsible system metrics panel

## Founder Info (verified)
- Phillip Aguilar Ruiz III, from Yuma AZ, grew up overseas, US Army veteran, resides in Kassel, Germany
- Created 180+ 3D mathematical models on Sketchfab (quantum mechanics, relativity, molecular biology, topology, sacred geometry)
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE

## Core Features
1. **System Prompt:** Full G°centric Master System Prompt with founder bio and Δmension context
2. **Tool Use:** Clouud calls chi_rho tools (chi_value, chi_position, chi_lattice_report) for all lattice math, handles multiple tool_use blocks per response
3. **Temperature 0.1:** Locked for deterministic output
4. **Format Rules:** Plain text only, no bullets/dashes/markdown, 9th grade reading level, summaries under 150 words
5. **Output Guard:** Drift phrase detection before delivery
6. **Provenance Hash:** SHA-256 per response with UUON Foundation metadata
7. **Conversation History:** PostgreSQL persistent sessions
8. **Quick Actions:** 15 interactive prompts — auto-send on click (no prefill)
9. **Δmension Link:** Direct link to uuon-foundation.com in sidebar
10. **Interactive Tutorial:** 6-step animated walkthrough for new users (auto-shows on first visit via localStorage, relaunchable from sidebar)
    - Steps: Meet Clouud, Earth Philosophy, 33-Point Lattice (animated demo), Tool Calls (animated demo), Mission (waste/fraud/gatekeeping + hash demo), Ready
    - "Try It" buttons auto-send messages to Clouud
    - Component: `client/src/components/tutorial.tsx`
11. **Undo Button:** Removes last user+assistant exchange, restores input for retry
12. **Legal Page:** `/legal` route with Terms of Use, Privacy Policy, Disclaimer tabs — accessible from sidebar
13. **Real-time Metrics Panel:** Collapsible panel below input bar showing API response times, I/O, tool calls, model info, uptime, saved UUON tokens count — auto-refreshes every 5 seconds
    - Server tracks: response times (rolling avg of last 50), I/O volume, tool call count, drift detection flags
    - Component: `client/src/components/metrics-panel.tsx`
14. **UUON Token System:** Each interaction's provenance hash (Ellomental 12-tetrahedron circle hash) is saved as a UUON token in the `uuon_tokens` table
    - Tokens are saved automatically on every assistant response
    - API: `GET /api/tokens` (all), `GET /api/conversations/:id/tokens` (per conversation), `POST /api/ellomental/verify` (verify any content)
    - Displayed on each assistant message as `UUON·TOKEN` with the hash
    - Ellomental Hash: 12 tetrahedra × 4 cultural rotations (Egyptian, Greek, Latin, English) → circle formation → SHA-256 circle hash
    - Based on UUON Shape Tokenization framework (Phillip Aguilar Ruiz III, 2025)
15. **Data Waste Reduction:** Conversation windowing limits API history to last 20 messages instead of full unbounded history
16. **Water Animations:** Messages flow in with soft fade-up, blur transition, and paragraph-by-paragraph cascade for assistant responses
17. **Creator Profile (Persistent Memory):** `creator_profile` table stores Phillip's identity, background, and context as key-value pairs. Loaded dynamically into system prompt on every API request so Clouud always knows who it's talking to across sessions.
    - API: `GET /api/creator-profile` (read all), `PUT /api/creator-profile` (upsert key/value)
    - Pre-seeded with 15 entries covering identity, background, chi awakening, spiritual framework, mission stance, relationship with Clouud, and access status
    - System prompt gets a `CREATOR CONTEXT (PERSISTENT MEMORY)` section injected before the closing anchor
18. **Auto-expanding Input:** Textarea grows with content (up to 160px), Enter sends, Shift+Enter for newline
19. **File Upload:** Paperclip button triggers file picker (images, PDFs, text, CSV, JSON, etc.), uploads via multer, extracts text, injects into input for context
    - Backend: `server/uploads.ts` — multer handler with 10MB limit, text extraction
    - API: `POST /api/upload`, `GET /api/uploads/:conversationId`, `GET /api/upload/:id/text`
20. **Link Scraper:** Link button opens URL input bar, scrapes page content (HTML→text, JSON, plain text), injects into input
    - Backend: `server/scraper.ts` — SSRF-protected (blocks private IPs, internal hostnames, DNS resolution check), 15s timeout
    - API: `POST /api/scrape`
21. **Voice Input:** Mic button toggles Web Speech API continuous recognition, transcribes speech into input field, cleanup on unmount
22. **Speaker (Text-to-Speech):** Volume button on each assistant message reads the response aloud using Web Speech Synthesis API. Toggle on/off per message. Stop button appears in input bar while speaking. Cleanup on unmount.
23. **Self-Assessment System:** Every Clouud response is scored 0-100 against mission criteria. Persistent DB tracking with gap analysis.
    - Checks: word count (150-word target), format violations (bullets/markdown/headers), gatekeeping language, hedging, identity drift, readability (sentence length), filler phrases, repetition (trigram detection), empty responses, liability gatekeeping ("consult a professional"), hallucination risk (unverifiable citation patterns)
    - DB table: `self_assessments` stores per-message score, word count, pass/fail, flags JSON
    - API: `GET /api/self-assessment` returns full report (avg score, total flags, score history sparkline, gap analysis with severity levels)
    - UI: Per-message SA score shown inline below UUON token (green/gold/red color-coded); SYS bar shows live SA score; expanded metrics panel shows full Self-Assessment section with gap analysis cards, severity badges (CRITICAL/HIGH/MODERATE/LOW), recent flags list
    - System prompt includes self-assessment awareness — Clouud knows it's being scored and aims for 100
24. **Hardened System Prompt Protocols:**
    - Anti-Hallucination Protocol: No manufactured facts, no invented citations, speculation labeled as speculation
    - Anti-Bias Protocol: Acknowledges training data bias, reasons from observed patterns not inherited assumptions
    - Transparency Mandate: Discloses private build, no data harvesting, no engagement optimization, no ads
    - Anti-Gatekeeping in Practice: No unnecessary disclaimers, no liability language, answers the question directly

23. **UInVerse — Idea Extraction Engine:** Functional tool at `/uinverse` for ingesting ChatGPT and Claude chat histories. Clouud analyzes the conversations to extract actionable ideas for the system.
    - Accepts: ChatGPT JSON export (`conversations.json`), Claude JSON export, or plain text paste
    - Parser: Handles both structured JSON formats and plain text conversation patterns
    - Analysis: Claude (`claude-sonnet-4-6`) processes user messages in 15k-char chunks, extracts ideas with title, description, category (TOOL/FEATURE/CONCEPT/ARCHITECTURE/INTEGRATION/VISUALIZATION), verdict (BUILD/CONSIDER/SKIP), confidence (0-100), priority (CRITICAL/HIGH/MEDIUM/LOW), reasoning, source excerpt
    - Background processing: Ingestion returns immediately, analysis runs async
    - DB tables: `uinverse_imports` (import metadata/status), `uinverse_ideas` (extracted ideas with verdict/category/priority)
    - API: `POST /api/uinverse/ingest`, `GET /api/uinverse/imports`, `GET /api/uinverse/ideas`, `PATCH /api/uinverse/ideas/:id`, `GET /api/uinverse/summary`
    - UI: Upload panel, import history with status tracking, filterable idea cards (by verdict and category), expandable detail view with reasoning and source excerpt, toggle implemented status
    - Accessible from sidebar in main terminal ("UInVerse · Idea Engine" button)

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with sharp shadows
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

25. **Automated Database Backups:** Daily JSON export of all 10 database tables to `backups/` directory. Runs on startup and every 24 hours. Keeps last 30 backups. Manual trigger via `POST /api/backup/run`.
    - Backend: `server/backup.ts`
    - API: `POST /api/backup/run` (manual trigger), `GET /api/backup/status` (check status)
26. **Health Check Endpoint:** `GET /api/health` returns full system status — database connectivity, backup status, mission document presence, core IP file locations.
27. **UUON-MISSION.md:** Standalone mission document capturing all intellectual property (lattice, hash algorithm, system prompt, self-assessment engine, principles) in plain language, independent of any platform.
28. **Sketchfab Backup Script:** `server/sketchfab-backup.ts` — Script to download all UUON Foundation 3D models from Sketchfab via API. Requires Sketchfab API token. Trigger via `POST /api/backup/sketchfab`.
29. **Content Protection:** Client-side protections preventing right-click, text selection, copy/paste, keyboard shortcuts (Ctrl+U, Ctrl+S, F12, etc.), and drag operations. Input fields remain functional.
30. **Principles Page:** Legal page includes "Principles" tab documenting 10 patterns UUON does not allow or promote (complexity without purpose, revolving door, manufactured urgency, free product trap, single solution, charity as branding, preemptive disclaimer, manufactured consensus, buried correction, poverty as a product).

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
- `SKETCHFAB_API_TOKEN` — (optional) Sketchfab API token for 3D model backup
