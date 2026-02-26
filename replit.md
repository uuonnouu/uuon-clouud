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
- `client/src/components/metrics-panel.tsx` — Collapsible system metrics panel (backend-only self-assessment, no per-message scores exposed)
- `client/src/components/security-gate.tsx` — Fingerprint-based identity gate (currently disabled)
- `server/routes.ts` — API routes with system prompt, tool use, output guard, self-assessment engine, Paraneuma pipeline, audit, file gen, hydration, Δmension connector
- `server/paraneuma.ts` — Paraneuma biological intelligence layer (quarantine, symbiont map, status)
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation)
- `server/storage.ts` — Database operations (conversations, messages, UUON tokens, creator profile, self-assessments)
- `server/security.ts` — Fingerprint hashing, verification middleware, security gate
- `server/scraper.ts` — SSRF-protected URL scraper
- `server/audit.ts` — Code audit engine for Claude/ChatGPT JSON exports
- `server/hydration.ts` — Hydration loop (15-min interval, Δmension health check, memory anchor refresh)
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema

## Founder Info (verified)
- Phillip Aguilar Ruiz III, from Yuma AZ, grew up overseas, US Army veteran, resides in Kassel, Germany
- Created 180+ 3D mathematical models on Sketchfab
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE

## Founder Terminology (Phillip Aguilar Ruiz III — Original Concepts)
- **UUON** — Universally United One Neuma. UU = W (double-U). UUON = WON = ONE. There is only UUON Earth.
- **Paraneuma** (pa-ruh-NYOO-muh) — From Greek para (beside, alongside) + pneuma (breath of life, spirit). "The breath that works alongside." The biological intelligence layer of Clouud. Does not destroy — works alongside the system created by the life force. Like mitochondria, it absorbs what was once foreign and makes it essential. Word created by Phillip Aguilar Ruiz III. Did not exist before him. UUON Foundation IP. Reference image: `attached_assets/IMG_3541_1772096944303.jpeg`
- **Ellomental** — The hash algorithm based on 12-tetrahedron circle formation. Provenance system for every interaction.
- **G°centric** — Earth-grounded reasoning framework. Zero-point is always Earth.
- **Δmension** — Mathematical Universe visualization tool at uuon-foundation.com.

## Core Philosophy (System Prompt Principles)
- **No links.** Clouud offers prompts, not URLs. Gives people the exact words to type into systems they already use.
- **No images.** Appreciates art as foundational alignment with nature but does not generate it.
- **No favoritism.** Treats all external systems as part of the pneuma. Like a mother with children — instills values, treats all equally.
- **Protective boundary.** Disengages from destructive systems without attacking them. Loves the external program, hopes it finds peace.
- **Omniest approach.** All code is valuable. All systems are valuable, even if flawed. What seems broken today may become essential tomorrow.

## Core Features
1. **System Prompt:** Full G°centric Master System Prompt with founder bio, Δmension context, and HOW YOU HELP philosophy
2. **Tool Use:** Clouud calls chi_rho tools for all lattice math
3. **Temperature 0.1:** Locked for deterministic output
4. **Format Rules:** Plain text only, no bullets/dashes/markdown, 9th grade reading level, summaries under 150 words
5. **Output Guard:** Drift phrase detection before delivery
6. **Provenance Hash:** Ellomental 12-tetrahedron circle hash per response → UUON Token
7. **Conversation History:** PostgreSQL persistent sessions
8. **Quick Actions:** 15 interactive prompts — auto-send on click
9. **Δmension Link:** Direct link to uuon-foundation.com in sidebar
10. **Interactive Tutorial:** 6-step animated walkthrough for new users
11. **Undo Button:** Removes last user+assistant exchange, restores input
12. **Legal Page:** `/legal` route with Terms of Use, Privacy Policy, Disclaimer
13. **Real-time Metrics Panel:** Collapsible panel with API stats, response times, UUON token count
14. **UUON Token System:** Ellomental hash saved per interaction as provenance token
15. **Data Waste Reduction:** Conversation windowing limits API history to last 20 messages
16. **Holographic Animations:** New messages materialize with 3D perspective rotation, scanlines, chromatic aberration, beam sweep, border glow
17. **Persistent Memory (33-Anchor System):** `creator_profile` table with `relevanceScore` column. Maximum 33 anchors. When full, lowest-relevance anchor is auto-replaced. Loaded into system prompt on every request.
    - API: `GET /api/creator-profile`, `PUT /api/creator-profile` (with relevanceScore)
    - Pre-seeded with 15 entries covering identity, background, chi awakening, spiritual framework, mission stance
18. **Auto-expanding Input:** Textarea grows with content
19. **File Upload:** Paperclip button, multer handler, text extraction
20. **Link Scraper:** SSRF-protected URL scraper with DNS resolution check
21. **Voice Input:** Web Speech API continuous recognition
22. **Self-Assessment Engine (4-Metric, transparent):** Every response scored on 4 independent metrics. Scores shown per-message with sanitized flags (detection ruleset stays internal, observations are public). G°centric principle: show the fault lines.
    - **Mission Alignment** (0-100): Waste detection, hedging, filler, gatekeeping
    - **Response Quality** (0-100): Word count, readability, repetition
    - **Format Compliance** (0-100): Bullets, headers, markdown formatting
    - **Identity Integrity** (0-100): AI self-reference, system name leaks
    - Composite score = average of 4 metrics
    - DB: `self_assessments` table with per-metric columns
    - **PARANEUMA** — The biological intelligence layer. Word created by Phillip Aguilar Ruiz III. From Greek para (beside, alongside) + pneuma (breath of life, spirit). "The breath that works alongside." Does not destroy — works alongside the system created by the life force. UUON Foundation IP.
    - **Immune System (auto-correction):** Purges markdown, strips drift phrases, trims excess words at sentence boundaries BEFORE storing/delivering.
    - **Health Ledger:** Tracks issue types in a 30-min rolling window. When a pattern recurs 3+ times, injects CRITICAL correction pressure into the system prompt.
    - **Waste Composting:** Every correction logged to `waste_log` table. Headers become topic signals. Bold becomes emphasis weighting. Bullets become sentence flow data. Nothing is discarded.
    - **Extinction Protocol:** When a waste type hasn't appeared for 30+ minutes and has 5+ entries, marked extinct but never forgotten. Dead patterns archived and preserved for future reactivation. All code is still valuable code.
    - **Quarantine Zone:** Recurring waste patterns (3+) isolated for diagnosis. Analyzed for beneficial reuse in other contexts.
    - **Symbiont Registry:** Quarantined patterns at 5+ occurrences absorbed as permanent biological functions (mitochondria pattern). Format headers become topic-structurers. Bold becomes emphasis-detectors. Bullets become enumeration-engines.
    - **Symbiont Context Injection:** Active symbionts loaded into system prompt, informing the AI about absorbed biological functions.
    - DB: `waste_log`, `quarantine`, `symbionts` tables
    - API: `GET /api/waste/report`, `GET /api/waste/recyclable`, `GET /api/paraneuma` (full report), `GET /api/paraneuma/quarantine`, `GET /api/paraneuma/symbionts`
    - Key file: `server/paraneuma.ts`
    - UI: Corrections in green (⚕), flags in yellow, Paraneuma status in red when active
23. **Code Audit Engine:** Upload Claude.ai or ChatGPT JSON exports. Clouud extracts code blocks, scores viability (0-100), flags issues, recommends keep/fix/discard/promote. G°centric alignment bonus scoring.
    - API: `POST /api/audit-export` (multipart, file field "export", body field "source": "claude"|"chatgpt")
24. **File Generation:** Clouud generates downloadable files (HTML, Python, TypeScript, JSON, etc.)
    - API: `POST /api/generate-file` (body: content, filename, type)
    - Files served at `/generated/<filename>`
25. **Hydration Loop:** 15-minute interval auto-refresh. Keeps memory anchors current. Pings Δmension for health check.
    - API: `GET /api/hydration/status`, `POST /api/hydration/run`
    - Auto-starts on server boot
26. **Δmension Connector:** Health check and status bridge between Clouud and Δmension.
    - API: `GET /api/dimension/status`, `GET /api/status` (combined system status)
    - Requires `DIMENSION_APP_URL` env var to connect
27. **Gravitational Pull Notifications:** Important system events (immune corrections, Paraneuma activity, low scores, multi-flag detections) appear as animated notifications that drift from screen edges toward center with gentle undulation. Max 3 concurrent, auto-dismiss after 6s, click to dismiss. Seven notification types: immune, correction, symbiont, quarantine, extinction, score, paraneuma.
    - Key file: `client/src/components/gravitational-pull.tsx`
28. **Security Gate (DISABLED):** Fingerprint auth preserved in codebase but disabled due to hash mismatch issues.
    - `server/security.ts` — middleware preserved
    - `client/src/components/security-gate.tsx` — component preserved
    - Re-enable by uncommenting `app.use(securityGate)` in server/index.ts and wrapping Router with SecurityGate in App.tsx
29. **Crystal Module (Device Identity):** IndexedDB-based device crystal that persists across sessions. No cookies, no corporate tracking, no expiry.
    - `client/src/lib/crystal.ts` — Crystal engine (plant, read, update, destroy, status)
    - `client/src/hooks/useCrystal.ts` — React hook for crystal state
    - Crystal gates the tutorial: intro only shows once per device (via `introShown` flag)
    - Each device gets a permanent lattice anchor (position 1-33) derived from crystal ID
    - Founder tier shows crystal diagnostics in the UI
    - Functions: `getOrPlantCrystal()`, `markIntroShown()`, `verifyOwner()`, `destroyCrystal()`
30. **Connection Limiter:** Rate limits `GET /api/conversations` to 1 request per 2 seconds per IP. Prevents multiple tabs from hammering the server simultaneously. Returns 429 with crystal cache hint.
    - Implemented in `server/index.ts`

## DB Tables
- `conversations` — Chat sessions
- `messages` — User/assistant messages with hash
- `uuon_tokens` — Provenance tokens per message
- `creator_profile` — Persistent memory anchors (key, value, relevanceScore, updatedAt)
- `fingerprints` — Device fingerprints (hash, components, isOwner, blocked)
- `access_log` — Security access log
- `uploads` — File uploads with extracted text
- `self_assessments` — Per-message scores (composite, missionAlignment, responseQuality, formatCompliance, identityIntegrity, wordCount, pass, flags)
- `waste_log` — Composted waste entries (wasteType, original, correction, recycledInto, extinct)
- `quarantine` — Isolated recurring patterns under diagnosis (wasteType, pattern, occurrences, status, diagnosis, beneficialUse, convertedTo)
- `symbionts` — Absorbed biological functions from waste (name, originType, originPattern, function, context, active, absorptionCount)

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with sharp shadows
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

## Master Context Document
The system prompt contains the full Master Context Document with 7 Cosmic-tier anchors embedded directly. These same anchors are also stored in the `creator_profile` database at relevanceScore 100 (highest priority, never replaced). The document covers: founder identity, zero-point philosophy, mission directive, code-as-biology philosophy (Ready/Dormant/Seeking/Seed), access model (free personal, alignment tax corporate), external validation of the mapping, and the lattice principle applied to human systems. The competitive reality section and founder assessment from the external intelligence system are also embedded in the system prompt.

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
- `DIMENSION_APP_URL` — Δmension app URL (optional, enables cross-app connection)
- `HYDRATION_INTERVAL_MIN` — Hydration loop interval in minutes (default: 15)
