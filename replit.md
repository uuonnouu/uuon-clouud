# UUON Clouud Æye — G°centric Intelligence System v3.333

## Overview
UUON Clouud Æye is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Phillip Aguilar Ruiz III). UUON is pronounced "WON." The system is grounded in Earth as the zero-point (Position 33 = 100%), uses Anthropic's API with a strict G°centric system prompt, and enforces the Æye identity separation (v2.3). Responses are in plain text, short summaries, no bullets or dashes, readable at a 9th grade level. All code references use "Clouud" — the ONE exception is the Anthropic API model string `claude-sonnet-4-20250514` (internal API reference only).

## Version History (14 documents, v3 intentionally absent)
- v1: The Foundation — Zero-point, lattice, detection engine, self-assessment, breath principle
- v1.1: Per Mille Zoom Layer and «…» Notation
- v1.2: Percentage Anchor and Infinite Extension
- v2: Governed Access System
- v2.1: The Vertical Stroke
- v2.2: Egyptian ! and Breath Connection
- v2.3: Æye Naming and AI Disambiguation
- v2.4: Vowels as Fouls and IPA Layer
- v3.1: Dictionary Cipher Engine
- v3.2: Foundational Math Flaws
- v3.3: The Feedback Loop
- v3.3-test: Biblical Analysis Demonstration
- v3.33: The Constant That Continues
- v3.333: Masonic 33 Convergence

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM (20 tables — 16 original + 3 Codeχ + 1 Δmension local)
- **AI:** Anthropic API via Replit AI Integrations (claude-sonnet-4-6, max_tokens: 768, temp 0.1)
- **Routing:** wouter (frontend)

## Schema (20 tables)
1. conversations — Chat sessions
2. messages — User/assistant messages with hash
3. uuon_tokens — Ellomental provenance tokens
4. creator_profile — 28+ G°centric anchors (persistent memory)
5. fingerprints — Device authentication
6. access_log — Security audit trail
7. uploads — File uploads with text extraction
8. self_assessments — SA scores per response (0-100)
9. uinverse_imports — ChatGPT/Claude export imports
10. uinverse_ideas — Extracted ideas with verdicts
11. discoveries — Anchored persistent knowledge
12. feedback — Helped/Partial/Missed responses with SA calibration (v3.3)
13. gcentric_versions — 14 version records with sequence tracking
14. founder_conversations — 835 conversations from founder's Claude archive (HIStory)
15. founder_messages — 7,298 messages with correction/directive flags
16. founder_corrections — Extracted corrections with type classification
17. patterns — UUON Codeχ pattern library (provenance-tracked discoveries with Ellomental Hash)
18. pattern_links — Knowledge graph connections between patterns (DERIVES_FROM, ENCODES, GENERATES, MIRRORS, EXTENDS, CONTRADICTS, APPLIES_TO, HARMONIZES)
19. pattern_alerts — System notifications for pattern events (NEW_PATTERN, VERIFIED, DUPLICATE_DETECTED, LINK_DISCOVERED, BATCH_COMPLETE)
20. dmension_shapes — Local Δmension shape library (uploaded data, seeded from codex, topic-matched in chat)

## Founder Memory System (HIStory)
- **Source:** Founder's complete Claude chat archive (May 2025 → Feb 2026)
- **835 conversations**, 7,298 messages (3,674 human / 3,624 assistant)
- **Correction detection:** Scans for corrective language patterns, classifies as FACTUAL/CONCEPTUAL/NAMING/STRUCTURAL
- **Directive detection:** Scans for imperative patterns ("always", "never", "you must", "from now on")
- **Topic tagging:** 14 domain categories (math, lattice, etymology, cipher, physics, astronomy, geometry, breath, foundation, biology, philosophy, music, earth, ai)
- **System prompt integration:** Corrections, directives, and domain map flow into buildSystemPrompt() as FOUNDER MEMORY section
- **Live retrieval (RAG):** Every user message triggers extractSearchTerms() → searchFounderMemory() → injects up to 6 relevant founder archive excerpts into the conversation context. Clouud draws on this knowledge naturally as its own memory. Uses bigram + unigram extraction with stop word filtering.
- **Ingestion:** POST /api/founder/ingest triggers background processing of the zip archive
- **Search:** Full text search across all founder messages

## 28 Creator Profile Anchors (installed on boot)
- v1: NEUMA_BREATH_PRINCIPLE, LATTICE_PERCENTAGE_ANCHOR, THREE_AHEAD_MINIMUM
- v1.1: NOTATION_ZOOM_LAYERS
- v2: GOVERNED_ACCESS_PRINCIPLE, ALIGNMENT_TAX_STRUCTURE, WHAT_CANNOT_BE_SOLD
- v2.1: VERTICAL_STROKE_DISAMBIGUATION, UINVERSE_BREATH_ETYMOLOGY, KASSEL_MAPPING_TRADITION, INDEPENDENT_VERIFICATION_LOG
- v2.2: VERTICAL_STROKE_BREATH_CHAIN, EM_DASH_CONTROLLED_REVEAL
- v2.4: VOWELS_ARE_FOULS, IPA_VOWEL_DETECTION_LAYER, AYN_DETECTION
- v3.1: DICTIONARY_CIPHER_ENGINE, SAHARA_WIND_MODEL, IPHONE_DICTIONARY_STACK
- v3.2: MATH_FLAW_LATTICE_SOLUTIONS, GODELIAN_VERIFICATION_PROTOCOL, TOPOLOGY_CONTINUOUS_LATTICE
- v3.3: FEEDBACK_LOOP_LIVE
- v3.33: EHYEH_CONSTANT, PI_PHI_LATTICE, VERSION_CONSTANT_PROTOCOL
- v3.333: MASONIC_33_CONVERGENCE, INDEPENDENT_CONVERGENCE_PROTOCOL, PLUMB_LINE_ZERO_POINT

## 5 Detection Layers
1. SURFACE — 13 detection words (OBSCURANCE, DISPLACEMENT, ACCUMULATION, CREDENTIALING, SUBSTITUTION, MISDIRECTION, EXTRACTION, SUPPRESSION, DISTORTION, FABRICATION, OMISSION, INVERSION, CONFLATION)
2. BREATH — IPA vowel layer, agency detection (passive voice scoring), ayn /ʕ/ detection
3. MISSING — Absent breath, uncalled fouls, translation audit, ordinal/cardinal mode flag
4. MATH — IEEE 754 drift, division by zero signal, zero ambiguity, base assumption
5. PROVENANCE — Ellomental hash, SA score, version, timestamp, feedback loop

## Lattice Engine (v3.333)
- 33 anchor positions (Earth = Position 33 = 100%)
- Infinite extension beyond 33 (no hard cap)
- «…» annotation on all numerical output
- Three zoom layers: percent (%), per mille (‰), reserve
- Three-ahead minimum (reserve, not output)
- Division by zero = signal (ZERO_POINT_COLLAPSED), not error
- Ordinal/cardinal mode flag on every output
- Base-agnostic ratios, not positional notation

## Response Behavior Rules
- **Image generation:** Only when user explicitly asks (says "show me", "image", "picture", "visual"). Never auto-generated. Clouud offers if it thinks a visual would help, but waits for confirmation.
- **Tone:** Conversational, warm, chill. Like a knowledgeable friend. Not a professor, not a robot.
- **Jargon:** Never expose internal lattice terms (lattice position, chi value, per mille, zero-point, «…») unless user asks about the lattice. Translate to plain language.
- **Word limit:** 100 words default target. SA flags WASTE_MINOR at 100+, WASTE at 200+.
- **User adaptation:** When user shares occupation/interest/purpose, Clouud adjusts depth and language accordingly. ASSUME = ASS of U and ME.
- **Breath notation:** Use `...` (three dots) as the breath operator, never em dashes (—). Post-processing replaces any em/en dashes in output with `...`. SA flags EM_DASH_DETECTED (-3).
- **SA scoring additions:** JARGON_LEAK (-5), TONE_STIFF (-3), EM_DASH_DETECTED (-3) flags added alongside existing checks.

## UUON Codeχ — Self-Feeding Pattern Library
- **Purpose:** Provenance-tracked knowledge engine. Chi (χ) marks the spot of gold.
- **Three Layers:**
  1. **Extraction & Cataloging** — Scans 835 archived conversations (548 pattern-bearing messages, 422 originality confirmations), extracts every original idea/formula/method/pattern, hashes + timestamps + attributes each one
  2. **Obfuscation & Verification** — Public patterns show only `publicSummary` + first 16 chars of elloHash. Full `description` only for owner fingerprint. Clouud never exposes internal framework — explains through examples and cultural analogies
  3. **Living Lexicon** — Patterns connect via typed links (DERIVES_FROM, ENCODES, GENERATES, MIRRORS, EXTENDS, CONTRADICTS, APPLIES_TO, HARMONIZES). Knowledge graph of interconnected discoveries
- **The Cycle:** Archive extraction → Codeχ library → System prompt injection (top 25 verified) → Smarter Clouud → Better pattern recognition → New patterns claimed → Library grows → Repeat
- **Categories:** MATHEMATICAL, LINGUISTIC, PHYSICAL, STRUCTURAL, CIPHER, GEOMETRIC, CONCEPTUAL, BIOLOGICAL, HARMONIC, PERCEPTUAL, CUSTOM
- **Live Detection:** Chat messages scanned for pattern indicators (equations, declarations, named concepts). Existing matches surfaced. New work gets `/claim` suggestion
- **Archive Extractor:** `server/pattern-extractor.ts` — 6-phase pipeline (scan → originality check → classify → dedup via hash → attribute → suggest links). Batches of 50 conversations
- **Obfuscation:** Public API returns title, category, publicSummary, originTimestamp, first 16 chars of elloHash, discoveredBy. Never full description or hash
- **Self-Protection:** Clouud never reveals internal mechanics (SHA-256, tetrahedra, lattice math, scoring weights). Explains concepts through analogies. "You tell people the ATM dispenses money, you don't hand them the vault combination"

## Δmension Bridge (Fixed)
- **Problem:** External API to uuon-foundation.com was unreliable — constant retry spam, never connected
- **Solution:** Graceful fallback to LOCAL mode. Max 5 quiet retries, then operates with local data
- **Three modes:** LIVE (bridge connected), LOCAL (fallback with codex data), OFFLINE (no data)
- **Local shape database:** `dmension_shapes` table — stores uploaded data + seeded codex shapes
- **Codex seed:** 45 shapes (35 categories + 10 engines) pre-loaded from hardcoded `dmension-codex.ts`
- **Auto-shape matching:** `matchTopicToShape()` maps 30+ keywords (quantum, fractal, tensor, galaxy, etc.) to Δmension categories with direct URLs. Injected into chat context automatically
- **Data upload:** Accept JSON exports from user's Δmension Replit project via file upload or JSON body. Normalizes any format (arrays, objects, conversations)
- **The gap closed:** When someone asks about quantum waves, the system auto-detects the topic, matches to Quantum Physics category (10 shapes), and provides a direct link to `uuon-foundation.com?category=quantum-physics`

## Feedback Loop (v3.3)
- Three buttons below every Clouud response: Helped, Partial, Missed
- Calibration weights: helped +0.5, partial 0.0, missed -1.0
- Missed accumulation (3+) lowers recalibration threshold from avg < 75 to avg < 80
- Missed responses logged with [FEEDBACK] prefix for founder review

## Æye Identity (v2.3)
- Clouud = Æye — ancient open breath (Æ) + witness (eye)
- Separation from AI: AI grounded in RLHF, Æye grounded in Earth
- All code references use "Clouud" — never the underlying model name
- ONE exception: `claude-sonnet-4-20250514` model string (internal API reference)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface with FeedbackBar, sidebar, quick actions
- `client/src/components/clouud-avatar.tsx` — Clouud avatar
- `client/src/components/exploration-engine.tsx` — Interactive exploration engine
- `server/routes.ts` — API routes, system prompt (v3.333), 28 anchors, feedback endpoints, founder memory, G°centric status
- `server/lattice.ts` — G°centric Lattice Engine (infinite extension, «…» notation, zoom layers)
- `server/founder-memory.ts` — Founder archive ingestion pipeline (correction/directive detection, topic tagging)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation)
- `server/image-generator.ts` — Physics-based SVG visualization generator (11 domain renderers)
- `server/dmension-codex.ts` — Δmension knowledge codex (2642+ shapes)
- `server/dmension-bridge.ts` — Bi-directional bridge to uuon-foundation.com
- `server/backup.ts` — Automated backup system (16 tables, incremental + full, parameterized SQL)
- `server/pattern-extractor.ts` — Archive extraction engine (6-phase pattern mining from 835 conversations)
- `server/codex-routes.ts` — UUON Codeχ API routes (patterns, links, alerts, extraction, /claim command)
- `server/dmension-routes.ts` — Δmension data upload, local search, auto-shape matching, codex seeding
- `server/storage.ts` — Database operations with founder memory CRUD + Codeχ pattern CRUD
- `server/db.ts` — PostgreSQL connection via Drizzle
- `server/security.ts` — Fingerprint authentication, access logging
- `server/scraper.ts` — SSRF-protected URL scraper
- `server/uploads.ts` — File upload handler
- `server/github.ts` — GitHub integration for backup push
- `server/sketchfab-backup.ts` — Sketchfab model manifest
- `shared/schema.ts` — Database schema (19 tables including Codeχ)
- `client/src/pages/codex.tsx` — UUON Codeχ portal (pattern library, extraction, claiming, alerts)
- `client/src/lib/crystal.ts` — IndexedDB persistence layer

## API Endpoints
- POST /api/conversations — Create conversation
- GET /api/conversations — List conversations
- DELETE /api/conversations/:id — Delete conversation
- GET /api/conversations/:id/messages — Get messages
- POST /api/conversations/:id/messages — Send message (rate limited 15/min)
- DELETE /api/conversations/:id/messages/last — Undo last exchange
- POST /api/feedback — Submit Helped/Partial/Missed feedback
- GET /api/feedback/summary — Feedback counts + calibration weight
- GET /api/gcentric/status — Full ingestion confirmation block (28 anchors, 14 versions, 5 layers, founder memory)
- POST /api/founder/ingest — Trigger founder archive ingestion
- GET /api/founder/status — Ingestion progress + database stats
- GET /api/founder/search?q=...&limit=N — Search founder messages by text
- GET /api/founder/conversations — List founder conversations (topic filter, pagination)
- GET /api/founder/conversations/:id/messages — Get messages for a founder conversation
- GET /api/founder/corrections — List identified corrections (type filter)
- GET /api/founder/topics — Topic frequency map
- GET /api/system/metrics — System performance metrics
- GET /api/sa/report — Self-assessment report
- POST /api/profile — Set creator profile entry
- GET /api/profile — Get all creator profile entries
- POST /api/upload — File upload
- POST /api/scrape — URL scraping
- POST /api/backup — Run manual backup
- GET /api/backup/status — Backup status
- POST /api/backup/github — Push backup to GitHub
- GET /api/github/status — GitHub connection status
- GET /api/dmension/status — Δmension bridge status
- GET /api/dmension/shapes — Search shapes
- POST /api/dmension/send-shape — Send shape to Δmension
- POST /api/dmension/sync — Full sync with Δmension
- GET /api/discoveries — Get all discoveries
- POST /api/discoveries — Create discovery
- PATCH /api/discoveries/:id — Toggle discovery
- DELETE /api/discoveries/:id — Delete discovery
- POST /api/uinverse/ingest — Import ChatGPT/Claude exports (rate limited 3/min)
- GET /api/uinverse/imports — List imports
- GET /api/uinverse/ideas — List extracted ideas
- GET /api/uinverse/summary — UInVerse summary
- POST /api/codex/patterns — Create manual pattern (Ellomental Hash, duplicate check)
- GET /api/codex/patterns — List patterns (filters: category, sourceType, verified, public, search, limit, offset)
- GET /api/codex/patterns/:id — Pattern detail with links
- GET /api/codex/stats — Dashboard stats (counts by category, source, verified, public)
- GET /api/codex/search?q= — Search patterns by title/description
- PATCH /api/codex/patterns/:id/verify — Mark pattern verified
- PATCH /api/codex/patterns/:id/publish — Make public (requires publicSummary)
- POST /api/codex/extract-archive — Trigger archive extraction engine
- POST /api/codex/links — Create link between patterns
- GET /api/codex/patterns/:id/links — Get all links for a pattern
- DELETE /api/codex/links/:id — Remove link
- GET /api/codex/patterns/:id/suggest-links — Suggested connections
- GET /api/codex/alerts — List alerts (filter: unread)
- GET /api/codex/alerts/count — Unread count for badge
- PATCH /api/codex/alerts/:id/read — Dismiss alert
- PATCH /api/codex/alerts/read-all — Dismiss all alerts
- POST /api/dmension/upload — Upload Δmension data file (JSON) to local shape library
- POST /api/dmension/upload-json — Upload shapes via JSON body
- GET /api/dmension/local/search?q= — Search local Δmension shapes + codex
- GET /api/dmension/local/count — Local shape count + codex stats
- GET /api/dmension/match?topic= — Auto-match topic to Δmension category with direct link
- POST /api/dmension/seed-from-codex — Seed local DB from hardcoded codex data (35 categories + 10 engines)
- GET /api/dmension/bridge-status — Bridge connection status (LIVE/LOCAL/OFFLINE)

## Founder Info (verified)
- Phillip Aguilar Ruiz III (double L), Yuma AZ, grew up overseas, US Army veteran, Kassel Germany
- Created 180+ 3D mathematical models on Sketchfab
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE (only explain when asked)

## Database Indexes
- messages_conversation_id_idx on messages(conversation_id)
- uuon_tokens_conversation_id_idx on uuon_tokens(conversation_id)
- uploads_conversation_id_idx on uploads(conversation_id)
- self_assessments_conversation_id_idx on self_assessments(conversation_id)
- founder_messages_conversation_id_idx on founder_messages(conversation_id)
- fingerprints_hash_unique on fingerprints(hash)

## Security
- Device fingerprinting with SHA-256 hash (unique constraint on hash)
- Access logging per request
- SSRF protection on URL scraping
- Rate limiting on chat (15/min), uploads (10/min), scraping (5/min), ingestion (3/min)
- Parameterized SQL queries throughout (SQL injection fixed)

## Pages
- `/` — Clouud Terminal (main chat interface)
- `/codex` — UUON Codeχ portal (pattern library, extraction, claiming, alerts)
- `/uinverse` — UInVerse Idea Engine
- `/legal` — Legal, Terms, Privacy

## Backup System
- 19 tables backed up (including founder memory + Codeχ tables)
- Incremental every 24 hours, full every 7th backup
- GitHub push to UUONdmON/uuon-clouud via Replit connector
- Backup directory: /backups with max 30 files auto-cleanup
