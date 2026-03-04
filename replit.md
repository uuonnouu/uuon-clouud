# UUON Clouud — G°centric Intelligence System

## Overview
UUON Clouud is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Phillip Aguilar Ruiz III). UUON is pronounced "WON." It connects to Anthropic's Claude API with a strict system prompt that enforces the G°centric philosophy: Earth-grounded reasoning, zero drift, zero rounding. Responses are in plain text, short summaries, no bullets or dashes, readable at a 9th grade level. Founder info is only shared when specifically asked.

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **AI:** Anthropic Claude API via Replit AI Integrations (claude-sonnet-4-6, max_tokens: 768)
- **Routing:** wouter (frontend)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface with sidebar, quick actions, Δmension link, image display
- `client/src/components/clouud-avatar.tsx` — Clouud avatar (static image with state-driven CSS animation)
- `client/src/components/exploration-engine.tsx` — Interactive geometric exploration engine (empty state), Earth enhancement themed shapes
- `server/routes.ts` — API routes with system prompt, tool use (lattice, visualize, generate_image, explore_dmension, earth_impact), output guard
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation)
- `server/image-generator.ts` — Physics-based SVG visualization generator (11 domain renderers: galaxy collision, tensor fields, wave interference, fractal spirals, fluid flow, entropy reduction, molecular bonds, growth patterns, lattice grids, network topology, geomorphology, universal)
- `server/dmension-codex.ts` — Δmension knowledge codex (2642+ shapes, 35 categories, 10 engines, search, Earth impact models)
- `server/dmension-bridge.ts` — Bi-directional bridge to uuon-foundation.com
- `server/backup.ts` — Automated backup system (11 tables, incremental + full, parameterized SQL)
- `server/storage.ts` — Database operations (IStorage interface, DatabaseStorage implementation)
- `server/db.ts` — PostgreSQL connection via Drizzle
- `server/security.ts` — Fingerprint authentication, access logging, security gate middleware
- `server/scraper.ts` — SSRF-protected URL scraper with DNS validation
- `server/uploads.ts` — File upload handler (multer, 10MB limit, text extraction)
- `server/github.ts` — GitHub integration via Replit connector (backup push, repo management)
- `server/sketchfab-backup.ts` — Sketchfab model manifest and download backup
- `shared/schema.ts` — Database schema (11 tables)
- `client/src/lib/crystal.ts` — IndexedDB persistence layer (Crystal system)
- `client/src/components/metrics-panel.tsx` — Collapsible system metrics panel

## Founder Info (verified)
- Phillip Aguilar Ruiz III (double L), Yuma AZ, grew up overseas, US Army veteran, Kassel Germany
- Created 180+ 3D mathematical models on Sketchfab
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE (only explain when asked)

## Core Features
1. **System Prompt:** Earth-grounded, mission-first identity. Founder name not in main identity — only shared when asked. Grounded language, Earth analogies, no jargon.
2. **Quick Links:** AI generates 2-3 tappable follow-up prompts `[>>text>>]` at end of every response, parsed and rendered as clickable buttons
3. **Tool Use:** Lattice tools (chi_value, chi_position, chi_lattice_report), visualize_concept (Δmension), generate_image (physics-based SVG), explore_dmension (search 2642+ shapes), earth_impact (waste reduction models)
4. **Image Generation:** `generate_image` tool creates physics-based SVG visualizations with 11 domain-specific renderers. Auto-detects domain from concept keywords. Pending images tracked in memory (max 100, auto-cleanup), polled by frontend, displayed inline.
5. **Δmension Codex:** Full knowledge of Δmension's architecture — 2642+ shapes, 35 categories, 10 engines (Fractal, Tensor Field, NeRF Export, Collision Physics, Galaxy Simulation, Quantum, Therapeutic, Wave Systems, Biological, Parametric). Publication-grade mathematical DNA. Searchable via API.
6. **Earth Impact Models:** Measurable waste reduction targets for energy (PUE 1.58→1.1), education (free interactive 3D), waste (topology optimization 30-60%), health (107 therapeutic shapes at zero cost), fraud (verifiable mathematical provenance).
7. **Exploration Engine:** Interactive empty state with orbiting geometric shapes (Energy, Patterns, Systems, Life, Enhance), particle effects, CSS-animated orbit rings
8. **Providence Orb:** hashingIntensity (0→1 over 12 tetrahedra) drives golden glow on UUON logo
9. **Speaker (TTS):** Chunked speech synthesis with Chrome keep-alive fix, per-message and auto-speak modes
10. **Format Rules:** Plain text only, no bullets/dashes/markdown, under 150 words, 9th grade level
11. **Provenance Hash:** SHA-256 per response via Ellomental Hash Algorithm
12. **Self-Assessment:** 0-100 scoring per response against mission criteria
13. **Δmension Bridge:** Two-way connection to uuon-foundation.com. Clouud = brain, Δmension = eyes. Context injection when discussing shapes, tensors, NeRF, collisions, galaxies.
14. **UInVerse:** Idea extraction from ChatGPT/Claude exports at `/uinverse`
15. **Voice Input:** Web Speech API continuous recognition
16. **File Upload & URL Scraping:** Upload files or scrape URLs for context
17. **Conversation History:** PostgreSQL persistent sessions with windowing (last 12 messages)
18. **Content Protection:** Anti-copy, anti-inspect protections
19. **Automated Backups:** Daily JSON export (11 tables including discoveries) + GitHub push to UUONdmON/uuon-clouud
20. **Discoveries System:** Persistent knowledge anchoring via `/save` command or REST API. Active discoveries injected into system prompt for cross-session memory.

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with glassmorphism, sharp shadows, animated particles
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

## Machine Learning & Processing Architecture

### Current ML/AI Processing Pipeline
The system uses a multi-stage AI processing pipeline centered on Anthropic's Claude API:

**1. Conversation Processing (server/routes.ts)**
- Model: `claude-sonnet-4-6`, temperature 0.1, max_tokens 768
- System prompt: ~5000 tokens of structured instructions including identity, reasoning hierarchy, format rules
- Dynamic prompt injection: Creator profile, active discoveries, recalibration warnings appended at runtime
- Smart history windowing: First message + tool-result messages + last 12 exchanges (prevents context bloat)
- Tool use loop: Iterative tool calling until `stop_reason !== "tool_use"` (supports chained tool calls)

**2. Tool Execution Layer (5 tools)**
- `chi_value` / `chi_position` / `chi_lattice_report` — G°centric Lattice math (server/lattice.ts)
  - 33-point rational arithmetic system mapping values 0-100 across 3 tiers (Earth, Orbital √, Cosmic ∛)
  - No floating-point rounding — all calculations use rational fractions (num/den with GCD reduction)
- `visualize_concept` — Sends shape parameters to Δmension for 3D rendering
- `generate_image` — Physics-based SVG generation with 11 domain renderers (server/image-generator.ts)
  - Domain auto-detection from prompt keywords (regex matching)
  - Seeded pseudo-random number generator for deterministic output
  - Fractal Brownian Motion (fBm) noise for organic textures
  - Each renderer produces procedural SVG with gradients, filters, and layered elements
- `explore_dmension` — Full-text search across 2642+ shapes, 35 categories, 10 engines
- `earth_impact` — Structured waste reduction models for 5 domains

**3. Self-Assessment Engine (server/routes.ts, assessResponse function)**
- Post-response scoring: 0-100 scale with 11 assessment categories
- Categories: WASTE (word count, hedging, filler), FORMAT (bullets, headers, markdown), APPROVAL_DRIFT, IDENTITY_BREACH, NEUTRALITY_LOOP, LIABILITY_LOOP, GATEKEEPING, HALLUCINATION_RISK, SCALE_LOOP, EXTERNAL_LINK, READABILITY, REPETITION, EMPTY
- Trigram repetition detection (findRepeatedPhrases)
- Recalibration system: 5-response rolling window, auto-injects warning into system prompt when avg score < 75
- All scores persisted to `self_assessments` table for historical analysis
- Gap analysis: Categorizes flags by severity (CRITICAL > 50%, HIGH > 20%, MODERATE > 10%, LOW)

**4. UInVerse Idea Extraction (server/routes.ts, analyzeIdeasInBackground)**
- Background async processing of imported ChatGPT/Claude conversation exports
- Parser supports: ChatGPT JSON export format, Claude JSON export format, plain text role-labeled format
- Chunks user messages into 15KB segments for API processing
- Claude analyzes each chunk for actionable ideas, classifying by:
  - Category: TOOL, FEATURE, CONCEPT, ARCHITECTURE, INTEGRATION, VISUALIZATION
  - Verdict: BUILD, CONSIDER, SKIP
  - Confidence: 0-100
  - Priority: CRITICAL, HIGH, MEDIUM, LOW
- Results persisted to `uinverse_ideas` table with source excerpts

**5. Provenance & Hashing (server/ellomental-hash.ts)**
- Ellomental Hash Algorithm: 12-tetrahedron circle formation
- Each tetrahedron: position (0-11), angle (i × 30°), culture rotation (Egyptian, Greek, Latin, English)
- Culture processing: character repetition (1×, 2×, 3×, 4× per culture)
- Individual tetrahedron hashes: SHA-256, truncated to 13 hex chars
- Circle hash: SHA-256 of concatenated 12 tetrahedron hashes (156 char input → 64 char output)
- Every AI response hashed and stored as UUON Token for provenance chain

### Δmension Mathematical Universe Integration

**Shape Library (server/dmension-codex.ts)**
- 2642+ interactive 3D mathematical shapes
- 35 categories spanning: Fractal Iterations (23), Quantum Physics (10), 4D Advanced (10), Medical Imaging (20), Linguistic Geometry (26), Slinky Dynamics (20), Rubik's Cube Dynamics (20), Modulo series (UUON 16, Graphics 24, Math 14, CS 13, AI 7, Cosmos 7, Crypto 9, Audio 11, Robotics 9, Networks 7, Geometry 10, Patterns 12, Chaos 5), Optimization (16), Nature & Crystals (16), Metallurgy (9), Ceramics (8), Phi Dimension (6), Causal Entropic Forces (6), Thermodynamic Cosmology (3), Lattice Structures (5), 5D Polytopes (5), Entropy Systems (4), Foundational Curves (8), Surfaces of Revolution (5), Parametric Surfaces (5), Waveforms & Harmonics (4), Minimal Surfaces (4)

**10 Rendering Engines:**
1. Fractal Generation — Mandelbrot, Julia, Sierpinski, Koch, Barnsley, Menger
2. Tensor Field Visualization (82 shapes) — Riemann curvature, Christoffel symbols, metric tensors
3. Neural Radiance Field Export (11) — NeRF/Nerfstudio/instant-ngp format export
4. Collision Operator Systems (14) — BGK, MRT, cascaded, entropic lattice Boltzmann
5. Galaxy & Cosmic Systems (14) — Spiral/elliptical galaxy formation, black hole mergers
6. Quantum Mechanics (502) — Wave functions, probability densities, Bloch spheres
7. Therapeutic Geometry (107) — Sacred geometry, healing frequencies, PTSD therapy
8. Wave & Field Systems (336) — EM waves, gravitational waves, acoustic, quantum
9. Biological Modeling (61) — DNA, protein folding, cell membranes, neural networks
10. Parametric Surface Engine (102) — Core WebGL renderer for arbitrary parametric equations

**Mathematical DNA patterns:** curvature_tensor, christoffel_symbols, spherical_harmonics, riemann_curvature, exponential_decay, radial_symmetry, fourier_series, wavefunction, probability_density

**Publication-grade cross-domain fusion sections:**
- 3.1.A: Relativity × Thermal Polar Fields
- 3.1.B: Quantum Gravity × Interference Cooling
- 3.1.C: Tensor Algebra × Spherical Harmonics
- 3.1.D: Polynomial COP × Harmonic Decomposition

**Bridge Protocol (server/dmension-bridge.ts)**
- Bi-directional REST bridge to uuon-foundation.com
- Connection monitor: 30s retry interval, 120 max attempts, latency tracking
- Endpoints: shape send/receive, ML data exchange, full sync, sent log
- Headers: X-Bridge-Secret authentication, X-Source-App identification
- 15s timeout per request with AbortSignal

### Image Generation Physics (server/image-generator.ts)

**11 Domain-Specific Renderers:**
1. Galaxy Collision — Spiral arms (parametric), tidal bridge particles, dual nuclei
2. Tensor Field — Grid-based vector field with fBm noise perturbation, curvature rings
3. Wave Interference — Multi-source circular wave superposition, amplitude mapping
4. Fractal Spiral — Golden angle (2.39996 rad) phyllotaxis, logarithmic spirals
5. Fluid Flow — Streamline integration through fBm noise field, 80 streamlines × 80-140 steps
6. Entropy Reduction — Chaos-to-order visual transition (left: random particles, right: hexagonal lattice)
7. Molecular Bonds — Atom nodes with electron cloud gradients, bond lines
8. Growth Pattern — Recursive tree branching (depth 10), L-system inspired, root network
9. Lattice Grid — Hexagonal tessellation with distance-based intensity, radial symmetry lines
10. Network Topology — 80 nodes with proximity-based edge connections, hub detection
11. Geomorphology — Terrain visualization with geological layering
12. Universal (fallback) — Adaptive renderer combining elements based on concept

**Rendering Pipeline:**
- Deterministic seeded PRNG from concept hash → reproducible output
- Dual color palette per domain (2 palette variations, randomly selected)
- SVG structure: defs (gradients, filters, blurs) → atmosphere (background, 600 stars, nebulae) → domain-specific elements → concept label overlay
- Noise functions: 2D value noise → smooth interpolation → fractal Brownian motion (6 octaves)
- Output: SVG file saved to `generated_images/` directory, served via Express static middleware

### Data Processing & Storage

**Database Schema (11 tables, shared/schema.ts):**
1. `conversations` — Chat sessions (id, title, createdAt)
2. `messages` — Chat messages (id, conversationId FK, role, content, toolCall JSON, hash, createdAt)
3. `uuon_tokens` — Provenance tokens (id, hash UNIQUE, messageId FK, conversationId FK, origin, createdAt)
4. `creator_profile` — Key-value persistent memory (id, key UNIQUE, value, updatedAt)
5. `fingerprints` — Device identity (id, hash, components JSON, isOwner, blocked, lastSeen, createdAt)
6. `access_log` — Security audit trail (id, fingerprintHash, action, granted, ip, userAgent, createdAt)
7. `uploads` — File attachments (id, filename, originalName, mimeType, size, conversationId FK, extractedText, createdAt)
8. `self_assessments` — Response quality scores (id, messageId FK, conversationId FK, score, wordCount, pass, flags JSON, createdAt)
9. `uinverse_imports` — External chat imports (id, source, filename, rawContent, messageCount, ideasExtracted, status, createdAt)
10. `uinverse_ideas` — Extracted ideas (id, importId FK, title, description, category, verdict, confidence, reasoning, sourceExcerpt, priority, implemented, createdAt)
11. `discoveries` — Persistent knowledge anchors (id, category, title, content, source, active, createdAt)

**Backup System (server/backup.ts):**
- 11 tables backed up (all tables including discoveries)
- Incremental backups: Only new rows from large tables (messages, self_assessments, uuon_tokens, uinverse_ideas, access_log) since last backup timestamp
- Full backup: Every 7th scheduled run
- Parameterized SQL queries (no string interpolation)
- Max 30 backup files retained, oldest auto-deleted
- GitHub push via Replit connector integration

### Metrics & Monitoring

**System Metrics (in-memory, server/routes.ts):**
- totalRequests, totalTokensIn, totalTokensOut, totalToolCalls, totalDriftFlags
- Rolling response time history (last 50), average calculation
- Uptime tracking, last request timestamp
- Exposed via GET /api/metrics (polled every 15s by frontend)

**Self-Assessment Report (PostgreSQL, server/storage.ts):**
- Historical average score across all assessments
- Score history (last 50 reversed for chronological display)
- Flag categorization and frequency counting
- Gap analysis with severity levels (CRITICAL/HIGH/MODERATE/LOW)

### Security Layer

**Fingerprint Authentication (server/security.ts):**
- SHA-256 hash of sorted device component key-value pairs
- First registration auto-promoted to owner
- Owner verified on subsequent visits, non-owner access denied
- Blocked fingerprint list with immediate rejection
- All access attempts logged with IP, user-agent, action, grant status

**SSRF Protection (server/scraper.ts):**
- URL protocol whitelist (HTTP/HTTPS only)
- Blocked hostname list (localhost, 127.0.0.1, metadata.google.internal, link-local)
- DNS resolution check against private IP ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x)
- 15s request timeout with AbortController

**Input Validation:**
- Route parameter validation via `parseId()` helper (NaN rejection with 400 response)
- Request body validation for required fields
- Rate limiting: chat 15/min, upload 10/min, scrape 5/min, ingest 3/min
- File upload: 10MB limit, MIME type whitelist

## Performance & Optimization (Master Diagnostic v1.0 Applied)
- History window: Smart windowing — first message + tool results + last 12 exchanges (reduced from flat 20)
- Max tokens: 768 (reduced from 1024)
- Metrics polling: 15s interval
- Particle cap: 15 max
- Orbit rings: 2 CSS-animated (reduced from 3 Framer Motion)
- API logging: trimmed, no JSON body dumps, metrics/assessment excluded
- **Database indexes:** 10 indexes on messages(conversation_id, created_at), self_assessments(message_id, conversation_id), uuon_tokens(conversation_id), access_log(fingerprint_hash, created_at), uploads(conversation_id), uinverse_ideas(import_id), discoveries(active)
- **Rate limiting:** express-rate-limit on chat (15/min), upload (10/min), scrape (5/min), ingest (3/min)
- **Self-assessment async:** Decoupled from response pipeline — runs after response delivery
- **Self-assessment trend awareness:** 5-response rolling window, auto-recalibration injected to system prompt when avg < 75 (checkRecalibration reads without pushing, trackScore pushes after response)
- **Drift detection expanded:** 17 phrases including "certainly", "absolutely", "happy to help", "as an ai", "as a language model"
- **Crystal system (IndexedDB):** Replaces localStorage for tutorial state, auto-speak, session count. Module: `client/src/lib/crystal.ts`
- **Image polling cleanup:** All setInterval refs tracked, cleared on component unmount. Pending image array auto-cleaned at 100 entries.
- **Async file operations:** Image generator and backup use fs/promises (writeFile, mkdir, readdir, unlink)
- **Incremental backups:** Daily incrementals (only new rows since last backup), full backup every 7th run
- **Speech synthesis cleanup:** onvoiceschanged listener cleared on unmount to prevent memory leaks
- **Conversation switch guard:** Response callbacks check if user switched conversations mid-request, discarding stale updates

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
- `DMENSION_API_URL` — Δmension Mathematical Universe URL (https://uuon-foundation.com)
- `UUON_BRIDGE_SECRET` — Shared secret for Δmension bridge authentication

## API Endpoints Reference

### Chat & Conversations
- `GET /api/conversations` — List all conversations
- `POST /api/conversations` — Create new conversation
- `DELETE /api/conversations/:id` — Delete conversation (cascades)
- `GET /api/conversations/:id/messages` — Get conversation messages
- `POST /api/conversations/:id/messages` — Send message, get AI response
- `DELETE /api/conversations/:id/messages/last` — Undo last exchange

### Provenance & Assessment
- `GET /api/tokens` — All UUON provenance tokens
- `GET /api/conversations/:id/tokens` — Tokens for conversation
- `POST /api/ellomental/verify` — Verify content hash
- `GET /api/lattice/report` — Full 33-point lattice report
- `GET /api/lattice/value/:position` — Lattice value at position (query: tier)
- `GET /api/self-assessment` — Assessment report with gap analysis
- `GET /api/metrics` — System performance metrics

### Δmension
- `GET /api/dmension/codex` — Full codex (stats, categories, engines)
- `GET /api/dmension/search?q=` — Search shapes
- `GET /api/dmension/impact/:domain` — Earth impact model
- `GET /api/dmension/status` — Bridge connection status
- `GET /api/dmension/diagnostic` — Multi-endpoint probe
- `GET /api/dmension/shapes` — Pull shapes from Δmension
- `GET /api/dmension/ml-updates` — Pull ML updates
- `POST /api/dmension/send-shape` — Push shape to Δmension
- `POST /api/dmension/send-ml` — Push ML data to Δmension
- `POST /api/dmension/sync` — Full bidirectional sync
- `GET /api/dmension/log` — View sent log

### UInVerse
- `GET /api/uinverse/summary` — Import/idea statistics
- `GET /api/uinverse/imports` — List imports
- `GET /api/uinverse/imports/:id` — Import detail with ideas
- `POST /api/uinverse/ingest` — Ingest chat export
- `GET /api/uinverse/ideas` — List ideas (query: importId)
- `PATCH /api/uinverse/ideas/:id` — Mark idea implemented

### Discoveries
- `GET /api/discoveries` — All discoveries
- `POST /api/discoveries` — Create discovery (category, title, content, source)
- `PATCH /api/discoveries/:id` — Toggle active/inactive
- `DELETE /api/discoveries/:id` — Delete discovery

### Images
- `GET /api/images/pending` — Pending image generations
- `GET /api/images/status/:id` — Image generation status
- `POST /api/images/generate/:id` — Trigger generation

### System
- `GET /api/health` — Full system health check
- `POST /api/backup/run` — Trigger manual backup
- `GET /api/backup/status` — Backup status
- `POST /api/backup/sketchfab` — Backup Sketchfab models
- `GET /api/github/status` — GitHub connection status
- `POST /api/github/create-repo` — Create private backup repo
- `POST /api/github/push-backup` — Push backup to GitHub

### Auth
- `POST /api/auth/register-fingerprint` — Register device fingerprint
- `GET /api/auth/status` — Owner registration status
- `GET /api/auth/access-log` — Access audit log

### Uploads
- `POST /api/upload` — Upload file
- `GET /api/uploads/:conversationId` — Files for conversation
- `GET /api/upload/:id/text` — Extracted text from upload
- `POST /api/scrape` — Scrape URL for context
