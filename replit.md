# UUON Clouud — G°centric Intelligence System

## Overview
UUON Clouud is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Philip Aguilar Ruiz III). It connects to Anthropic's Claude API with a strict system prompt that enforces the G°centric philosophy: Earth-grounded reasoning, zero drift, zero rounding. Responses are in plain text, short summaries, no bullets or dashes, readable at a 9th grade level.

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **AI:** Anthropic Claude API via Replit AI Integrations (claude-sonnet-4-6, max_tokens: 1024)
- **Routing:** wouter (frontend)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface with sidebar, quick actions, Δmension link
- `client/src/components/clouud-avatar.tsx` — Clouud avatar (static image with state-driven CSS animation)
- `client/src/components/metrics-panel.tsx` — Collapsible system metrics panel with 4-metric self-assessment
- `client/src/components/security-gate.tsx` — Fingerprint-based identity gate (wraps entire app)
- `server/routes.ts` — API routes with system prompt, tool use, output guard, self-assessment engine
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation)
- `server/storage.ts` — Database operations (conversations, messages, UUON tokens, creator profile, self-assessments)
- `server/security.ts` — Fingerprint hashing, verification middleware, security gate
- `server/scraper.ts` — SSRF-protected URL scraper
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema

## Founder Info (verified)
- Philip Aguilar Ruiz III, from Yuma AZ, grew up overseas, US Army veteran, resides in Kassel, Germany
- Created 180+ 3D mathematical models on Sketchfab
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE

## Core Features
1. **System Prompt:** Full G°centric Master System Prompt with founder bio and Δmension context
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
22. **Self-Assessment Engine (4-Metric):** Every response scored on 4 independent metrics:
    - **Mission Alignment** (0-100): Waste detection, hedging, filler, gatekeeping
    - **Response Quality** (0-100): Word count, readability, repetition
    - **Format Compliance** (0-100): Bullets, headers, markdown formatting
    - **Identity Integrity** (0-100): AI self-reference, system name leaks
    - Composite score = average of 4 metrics
    - DB: `self_assessments` table with per-metric columns
    - UI: Per-message inline sub-scores (M/Q/F/I), SYS bar compact display, expanded panel with SubScoreCard progress bars and gap analysis
23. **3-Layer Biometric Authentication:**
    - **Layer 1 — WebAuthn:** Platform biometric (fingerprint/Face ID via browser API), @simplewebauthn/server + @simplewebauthn/browser
    - **Layer 2 — Passphrase:** bcrypt-hashed (12 rounds), verified per session
    - **Layer 3 — Device Fingerprint:** Canvas/WebGL/Audio composite hash, session-bound, 30s integrity monitor
    - Per-session challenge scoping prevents cross-session replay
    - Protected API routes require all 3 layers verified (enforced in securityGate middleware)
    - Setup flow: first visit → register biometric + set passphrase; subsequent visits → authenticate all 3 layers
    - Session tokens stored in sessionStorage, auto-injected via global fetch interceptor in main.tsx
    - DB: `webauthn_credentials`, `owner_passphrase`, `auth_sessions`, `fingerprints`, `access_log`
    - Server: `server/auth.ts` (all auth endpoints), `server/security.ts` (enforceFullAuth middleware)
    - Client: `client/src/components/security-gate.tsx` (full 3-layer UI flow)

## DB Tables
- `conversations` — Chat sessions
- `messages` — User/assistant messages with hash
- `uuon_tokens` — Provenance tokens per message
- `creator_profile` — Persistent memory anchors (key, value, relevanceScore, updatedAt)
- `fingerprints` — Device fingerprints (hash, components, isOwner, blocked)
- `access_log` — Security access log
- `uploads` — File uploads with extracted text
- `self_assessments` — Per-message scores (composite, missionAlignment, responseQuality, formatCompliance, identityIntegrity, wordCount, pass, flags)
- `webauthn_credentials` — WebAuthn credential storage (credentialId, publicKey, counter, transports)
- `owner_passphrase` — Bcrypt-hashed owner passphrase
- `auth_sessions` — 3-layer auth sessions (token, fingerprintHash, layer flags, expiry)

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with sharp shadows
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
