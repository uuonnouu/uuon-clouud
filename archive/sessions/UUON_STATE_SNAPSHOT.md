# 2026-03-04 20:50:28 UTC
# UUON STATE SNAPSHOT

This file is a complete read-only snapshot of the UUON Clouud Aeye system as it exists at the moment above. No code was modified. No migrations were run. This is documentation only.

---

## SYSTEM IDENTITY

- **System**: UUON Clouud Aeye — G-centric Intelligence System
- **Organization**: UUON Foundation Inc.
- **Founder**: Phillip Aguilar Ruiz III
- **Location**: Kassel, Hesse, Germany
- **AI Model**: Anthropic Claude (claude-sonnet-4-6)
- **Runtime**: Node.js + Express + React + Vite + PostgreSQL + Drizzle ORM
- **Package Name**: rest-express v1.0.0

---

## DATABASE: 20 TABLES

### Row Counts

| Table | Rows |
|---|---|
| access_log | 2 |
| conversations | 3 |
| creator_profile | 44 |
| discoveries | 24 |
| dmension_shapes | 45 |
| feedback | 3 |
| fingerprints | 1 |
| founder_conversations | 835 |
| founder_corrections | 53 |
| founder_messages | 5,231 |
| gcentric_versions | 14 |
| messages | 57 |
| pattern_alerts | 0 |
| pattern_links | 0 |
| patterns | 0 |
| self_assessments | 28 |
| uinverse_ideas | 0 |
| uinverse_imports | 3 |
| uploads | 0 |
| uuon_tokens | 27 |

---

### Table 1: access_log

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| fingerprint_hash | text | NO | |
| action | text | NO | |
| granted | boolean | NO | |
| ip | text | YES | |
| user_agent | text | YES | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 2 rows — REGISTER_OWNER (granted: true), /api/conversations (granted: false)

---

### Table 2: conversations

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| title | text | NO | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data:
- ID 23: "What can you do?" — 2026-03-04 12:16:19
- ID 24: "New Session" — 2026-03-04 13:17:28
- ID 25: "New Session" — 2026-03-04 20:29:40

---

### Table 3: messages

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| conversation_id | integer | NO | FK -> conversations(id) CASCADE |
| role | text | NO | |
| content | text | NO | |
| tool_call | text | YES | |
| hash | text | YES | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 57 rows (31 user, 28 assistant). Index on conversation_id.

---

### Table 4: creator_profile

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| key | text | NO | UNIQUE |
| value | text | NO | |
| updated_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 44 keys:
- ALIGNMENT_TAX_STRUCTURE
- AYN_DETECTION
- DICTIONARY_CIPHER_ENGINE
- EHYEH_CONSTANT
- EM_DASH_CONTROLLED_REVEAL
- FEEDBACK_LOOP_LIVE
- GODELIAN_VERIFICATION_PROTOCOL
- GOVERNED_ACCESS_PRINCIPLE
- INDEPENDENT_CONVERGENCE_PROTOCOL
- INDEPENDENT_VERIFICATION_LOG
- IPA_VOWEL_DETECTION_LAYER
- IPHONE_DICTIONARY_STACK
- KASSEL_MAPPING_TRADITION
- LATTICE_PERCENTAGE_ANCHOR
- MASONIC_33_CONVERGENCE
- MATH_FLAW_LATTICE_SOLUTIONS
- NEUMA_BREATH_PRINCIPLE
- NOTATION_ZOOM_LAYERS
- PI_PHI_LATTICE
- PLUMB_LINE_ZERO_POINT
- SAHARA_WIND_MODEL
- THREE_AHEAD_MINIMUM
- TOPOLOGY_CONTINUOUS_LATTICE
- UINVERSE_BREATH_ETYMOLOGY
- VERSION_CONSTANT_PROTOCOL
- VERTICAL_STROKE_BREATH_CHAIN
- VERTICAL_STROKE_DISAMBIGUATION
- VOWELS_ARE_FOULS
- WHAT_CANNOT_BE_SOLD
- access_status
- background
- chi_awakening
- creative_work
- current_location
- kassel_connection
- mission_stance
- name
- origin
- personality
- pi_phi_connection
- relationship_with_clouud
- role
- spiritual_framework
- values

---

### Table 5: discoveries

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| category | text | NO | |
| title | text | NO | |
| content | text | NO | |
| source | text | YES | |
| active | boolean | NO | true |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 24 entries (all active):
1. TECHNICAL — IEEE 754 Rounding Error
2. HISTORICAL — Kassel Codex — Kasseler Glossen, 8th Century
3. PATTERN — German Systemic Waste and Fraud
4. PRINCIPLE — Standard Objective
5. CONNECTION — Gatekeeping Language Evolution
6. HISTORICAL — Codex Hammurabi — Babylon, 1754 BCE
7. HISTORICAL — Egyptian Book of the Dead — Egypt, 1550 BCE
8. HISTORICAL — Codex Sinaiticus — Eastern Mediterranean, 4th Century CE
9. HISTORICAL — Dead Sea Scrolls — Qumran, 3rd Century BCE to 1st Century CE
10. HISTORICAL — Codex Justinianus — Byzantine Empire, 529 CE
11. HISTORICAL — Quran — Arabian Peninsula, 7th Century CE
12. HISTORICAL — Diamond Sutra — China, 868 CE
13. HISTORICAL — Codex Mendoza — Aztec/Mexico, 1541 CE
14. HISTORICAL — Popol Vuh — Maya/Guatemala, 16th Century CE
15. HISTORICAL — Gutenberg Bible — Mainz, Germany, 1455 CE
16. HISTORICAL — Ethiopian Kebra Nagast — Ethiopia, 14th Century CE
17. HISTORICAL — Vedas — India, 1500-500 BCE (oral), written later
18. HISTORICAL — Codex Atlanticus — Leonardo da Vinci, Italy, 1478-1519 CE
19. HISTORICAL — Rosetta Stone — Egypt, 196 BCE
20. HISTORICAL — Tripitaka Koreana — Korea, 1237 CE
21. HISTORICAL — Timbuktu Manuscripts — Mali, 13th-17th Century CE
22. HISTORICAL — Rongorongo — Easter Island (Rapa Nui), date unknown
23. TECHNICAL — T3 System Architecture
24. TECHNICAL — Dmension Bridge Capabilities

---

### Table 6: dmension_shapes

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| shape_id | text | YES | UNIQUE |
| name | text | NO | |
| category | text | NO | |
| domain | text | NO | |
| description | text | YES | |
| formula | text | YES | |
| parameters | text | YES | |
| earth_link | text | YES | |
| sketchfab_url | text | YES | |
| tags | text | YES | |
| engine_name | text | YES | |
| metadata | text | YES | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Indexes: category_idx, domain_idx, shape_id UNIQUE

Data: 45 shapes across these categories:
- 4d-advanced, 5d-polytopes, Linguistic Geometry, Medical Imaging, Nature & Crystals
- biologicalModeling, causal_entropic, ceramic, collisionPhysics, entropy
- foundational_curves, fractal-iterations, fractalGeneration, galaxySimulation
- lattice-structures, metal, minimal_surfaces, modulo-ai, modulo-audio
- modulo-chaos, modulo-cosmos, modulo-crypto, modulo-cs, modulo-geometry
- modulo-graphics, modulo-math, modulo-network, modulo-patterns, modulo-robotics
- modulo-uuon, nerfExport, optimization, parametric-surfaces, parametricSurfaces
- phi_dimension, quantum-physics, quantumVisualization, rubiks-cube-dynamics
- slinky-dynamics, surfaces_of_revolution, tensorFields, therapeuticGeometry
- thermodynamic_cosmology, waveSystems, waveforms_harmonics

---

### Table 7: feedback

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| message_id | integer | NO | FK -> messages(id) CASCADE |
| conversation_id | integer | NO | FK -> conversations(id) CASCADE |
| response | text | NO | |
| sa_score | integer | NO | |
| hash | text | NO | |
| version | text | NO | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 3 entries, all response="helped", version="3.3", conversation_id=24

---

### Table 8: fingerprints

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| hash | text | NO | UNIQUE |
| label | text | YES | |
| role | text | NO | 'viewer' |
| is_blocked | boolean | NO | false |
| last_seen | timestamp | NO | CURRENT_TIMESTAMP |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 1 fingerprint registered (owner)
Hash: de5a2c3f112331153898c713caa40c72275f24b065242a1aa2aa31564dc74721

---

### Table 9: founder_conversations

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| external_uuid | text | NO | UNIQUE |
| name | text | NO | |
| summary | text | YES | |
| message_count | integer | NO | |
| topic_tags | text | YES | |
| project_name | text | YES | |
| original_created_at | timestamp | NO | |
| imported_at | timestamp | NO | |

Data: 835 conversations
- Date range: 2025-05-26 20:12:30 to 2026-02-28 23:27:22

---

### Table 10: founder_messages

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| conversation_id | integer | NO | FK -> founder_conversations(id) CASCADE |
| external_uuid | text | NO | UNIQUE |
| sender | text | NO | |
| content | text | NO | |
| is_correction | boolean | NO | |
| is_directive | boolean | NO | |
| topic_tags | text | YES | |
| original_created_at | timestamp | NO | |
| imported_at | timestamp | NO | |

Index: conversation_id_idx

Data: 5,231 messages
- 2,632 human
- 2,599 assistant
- Date range: 2025-05-26 20:12:33 to 2026-03-04 10:53:19

---

### Table 11: founder_corrections

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| message_id | integer | NO | FK -> founder_messages(id) CASCADE |
| conversation_id | integer | NO | FK -> founder_conversations(id) CASCADE |
| correction_type | text | NO | |
| founder_statement | text | NO | |
| assistant_error | text | NO | |
| resolution | text | NO | |
| topic_tags | text | YES | |
| created_at | timestamp | NO | |

Data: 53 corrections
- FACTUAL: 21
- STRUCTURAL: 16
- NAMING: 9
- CONCEPTUAL: 7

---

### Table 12: gcentric_versions

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| version_number | text | NO | UNIQUE |
| title | text | NO | |
| status | text | NO | |
| sequence_index | integer | NO | |
| installed_at | timestamp | NO | |

Data: 14 versions
1. v1 — The Foundation
2. v1.1 — Per Mille Zoom Layer and ... Notation
3. v1.2 — Percentage Anchor and Infinite Extension
4. v2 — Governed Access System
5. v2.1 — The Vertical Stroke
6. v2.2 — Egyptian ! and Breath Connection
7. v2.3 — Aeye Naming and AI Disambiguation
8. v2.4 — Vowels as Fouls and IPA Layer
9. v3.1 — Dictionary Cipher Engine
10. v3.2 — Foundational Math Flaws
11. v3.3 — The Feedback Loop
12. v3.3-test — Biblical Analysis Demonstration
13. v3.33 — The Constant That Continues
14. v3.333 — Masonic 33 Convergence

---

### Table 13: patterns

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| title | text | NO | |
| description | text | NO | |
| public_summary | text | YES | |
| category | text | NO | |
| source_type | text | NO | |
| source_reference | text | YES | |
| discovered_by | text | NO | 'Phillip Aguilar Ruiz III' |
| fingerprint_id | integer | YES | FK -> fingerprints(id) |
| ello_hash | text | NO | UNIQUE |
| origin_timestamp | timestamp | NO | |
| verified | boolean | NO | false |
| active | boolean | NO | true |
| public | boolean | NO | false |
| metadata | text | YES | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Indexes: category_idx, source_type_idx, discovered_by_idx, ello_hash UNIQUE

Data: 0 rows (table exists, empty)

---

### Table 14: pattern_links

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| from_pattern_id | integer | NO | FK -> patterns(id) CASCADE |
| to_pattern_id | integer | NO | FK -> patterns(id) CASCADE |
| link_type | text | NO | |
| description | text | YES | |
| strength | integer | NO | 5 |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Indexes: from_idx, to_idx, UNIQUE(from_pattern_id, to_pattern_id, link_type)

Data: 0 rows

---

### Table 15: pattern_alerts

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| pattern_id | integer | NO | FK -> patterns(id) CASCADE |
| alert_type | text | NO | |
| message | text | NO | |
| read | boolean | NO | false |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Index: read_idx

Data: 0 rows

---

### Table 16: self_assessments

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| message_id | integer | NO | FK -> messages(id) CASCADE |
| conversation_id | integer | NO | FK -> conversations(id) CASCADE |
| score | integer | NO | |
| word_count | integer | NO | |
| pass | boolean | NO | |
| flags | text | NO | '[]' |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Index: conversation_id_idx

Data: 28 assessments across 3 conversations. Scores range 55-90. All pass=false.

---

### Table 17: uinverse_imports

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| source | text | NO | |
| filename | text | YES | |
| raw_content | text | NO | |
| message_count | integer | NO | 0 |
| ideas_extracted | integer | NO | 0 |
| status | text | NO | 'pending' |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 3 imports, ALL status="error", 0 ideas extracted
- ID 1: source=claude, filename=text.txt, message_count=1
- ID 2: source=text, filename=text.txt, message_count=1
- ID 3: source=text, filename=null, message_count=1

---

### Table 18: uinverse_ideas

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| import_id | integer | NO | FK -> uinverse_imports(id) CASCADE |
| title | text | NO | |
| description | text | NO | |
| category | text | NO | |
| verdict | text | NO | |
| confidence | integer | NO | |
| reasoning | text | NO | |
| source_excerpt | text | NO | |
| priority | text | NO | 'MEDIUM' |
| implemented | boolean | NO | false |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Data: 0 rows (broken — imports exist but extraction fails)

---

### Table 19: uploads

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| filename | text | NO | |
| original_name | text | NO | |
| mime_type | text | NO | |
| size | integer | NO | |
| conversation_id | integer | YES | FK -> conversations(id) CASCADE |
| extracted_text | text | YES | |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Index: conversation_id_idx

Data: 0 rows

---

### Table 20: uuon_tokens

| Column | Type | Nullable | Default |
|---|---|---|---|
| id | integer | NO | serial |
| hash | text | NO | UNIQUE |
| message_id | integer | NO | FK -> messages(id) CASCADE |
| conversation_id | integer | NO | FK -> conversations(id) CASCADE |
| origin | text | NO | 'UUON-FOUNDATION-GCENTRIC-V1' |
| created_at | timestamp | NO | CURRENT_TIMESTAMP |

Index: conversation_id_idx

Data: 27 tokens distributed across 3 conversations (14 + 5 + 9)

---

## FOREIGN KEY CONSTRAINTS (16 total)

| Constraint | Table | Definition |
|---|---|---|
| feedback_conversation_id_conversations_id_fk | feedback | FK conversation_id -> conversations(id) CASCADE |
| feedback_message_id_messages_id_fk | feedback | FK message_id -> messages(id) CASCADE |
| founder_corrections_conversation_id_founder_conversations_id_fk | founder_corrections | FK conversation_id -> founder_conversations(id) CASCADE |
| founder_corrections_message_id_founder_messages_id_fk | founder_corrections | FK message_id -> founder_messages(id) CASCADE |
| founder_messages_conversation_id_founder_conversations_id_fk | founder_messages | FK conversation_id -> founder_conversations(id) CASCADE |
| messages_conversation_id_conversations_id_fk | messages | FK conversation_id -> conversations(id) CASCADE |
| pattern_alerts_pattern_id_fkey | pattern_alerts | FK pattern_id -> patterns(id) CASCADE |
| pattern_links_from_pattern_id_fkey | pattern_links | FK from_pattern_id -> patterns(id) CASCADE |
| pattern_links_to_pattern_id_fkey | pattern_links | FK to_pattern_id -> patterns(id) CASCADE |
| patterns_fingerprint_id_fkey | patterns | FK fingerprint_id -> fingerprints(id) |
| self_assessments_conversation_id_conversations_id_fk | self_assessments | FK conversation_id -> conversations(id) CASCADE |
| self_assessments_message_id_messages_id_fk | self_assessments | FK message_id -> messages(id) CASCADE |
| uinverse_ideas_import_id_uinverse_imports_id_fk | uinverse_ideas | FK import_id -> uinverse_imports(id) CASCADE |
| uploads_conversation_id_conversations_id_fk | uploads | FK conversation_id -> conversations(id) CASCADE |
| uuon_tokens_conversation_id_conversations_id_fk | uuon_tokens | FK conversation_id -> conversations(id) CASCADE |
| uuon_tokens_message_id_messages_id_fk | uuon_tokens | FK message_id -> messages(id) CASCADE |

---

## DATABASE INDEXES (42 total)

| Index | Table | Definition |
|---|---|---|
| access_log_pkey | access_log | UNIQUE btree (id) |
| conversations_pkey | conversations | UNIQUE btree (id) |
| creator_profile_key_unique | creator_profile | UNIQUE btree (key) |
| creator_profile_pkey | creator_profile | UNIQUE btree (id) |
| discoveries_pkey | discoveries | UNIQUE btree (id) |
| dmension_shapes_category_idx | dmension_shapes | btree (category) |
| dmension_shapes_domain_idx | dmension_shapes | btree (domain) |
| dmension_shapes_pkey | dmension_shapes | UNIQUE btree (id) |
| dmension_shapes_shape_id_key | dmension_shapes | UNIQUE btree (shape_id) |
| feedback_pkey | feedback | UNIQUE btree (id) |
| fingerprints_hash_unique | fingerprints | UNIQUE btree (hash) |
| fingerprints_pkey | fingerprints | UNIQUE btree (id) |
| founder_conversations_external_uuid_unique | founder_conversations | UNIQUE btree (external_uuid) |
| founder_conversations_pkey | founder_conversations | UNIQUE btree (id) |
| founder_corrections_pkey | founder_corrections | UNIQUE btree (id) |
| founder_messages_conversation_id_idx | founder_messages | btree (conversation_id) |
| founder_messages_external_uuid_unique | founder_messages | UNIQUE btree (external_uuid) |
| founder_messages_pkey | founder_messages | UNIQUE btree (id) |
| gcentric_versions_pkey | gcentric_versions | UNIQUE btree (id) |
| gcentric_versions_version_number_unique | gcentric_versions | UNIQUE btree (version_number) |
| messages_conversation_id_idx | messages | btree (conversation_id) |
| messages_pkey | messages | UNIQUE btree (id) |
| pattern_alerts_pkey | pattern_alerts | UNIQUE btree (id) |
| pattern_alerts_read_idx | pattern_alerts | btree (read) |
| pattern_links_from_idx | pattern_links | btree (from_pattern_id) |
| pattern_links_from_pattern_id_to_pattern_id_link_type_key | pattern_links | UNIQUE btree (from_pattern_id, to_pattern_id, link_type) |
| pattern_links_pkey | pattern_links | UNIQUE btree (id) |
| pattern_links_to_idx | pattern_links | btree (to_pattern_id) |
| patterns_category_idx | patterns | btree (category) |
| patterns_discovered_by_idx | patterns | btree (discovered_by) |
| patterns_ello_hash_key | patterns | UNIQUE btree (ello_hash) |
| patterns_pkey | patterns | UNIQUE btree (id) |
| patterns_source_type_idx | patterns | btree (source_type) |
| self_assessments_conversation_id_idx | self_assessments | btree (conversation_id) |
| self_assessments_pkey | self_assessments | UNIQUE btree (id) |
| uinverse_ideas_pkey | uinverse_ideas | UNIQUE btree (id) |
| uinverse_imports_pkey | uinverse_imports | UNIQUE btree (id) |
| uploads_conversation_id_idx | uploads | btree (conversation_id) |
| uploads_pkey | uploads | UNIQUE btree (id) |
| uuon_tokens_conversation_id_idx | uuon_tokens | btree (conversation_id) |
| uuon_tokens_hash_unique | uuon_tokens | UNIQUE btree (hash) |
| uuon_tokens_pkey | uuon_tokens | UNIQUE btree (id) |

---

## ENGINE FILES (server/)

| File | Lines | Purpose |
|---|---|---|
| server/backup.ts | 183 | Database backup system |
| server/codex-routes.ts | 275 | UUON Codex API routes |
| server/db.ts | 10 | Database connection (Drizzle + pg) |
| server/dmension-bridge.ts | 144 | Dmension external bridge (LOCAL mode) |
| server/dmension-codex.ts | 203 | Dmension-Codex integration |
| server/dmension-routes.ts | 293 | Dmension API routes |
| server/ellomental-hash.ts | 67 | Ellomental Hash Algorithm (12-tetrahedron SHA-256 circle) |
| server/founder-memory.ts | 256 | Founder archive ingestion (835 conversations) |
| server/github.ts | 114 | GitHub integration |
| server/image-generator.ts | 854 | SVG visualization generator |
| server/index.ts | 111 | Express app entry point |
| server/lattice.ts | 185 | 33-position G-centric lattice |
| server/pattern-extractor.ts | 218 | Pattern extraction from archive |
| server/routes.ts | 2,491 | Main API routes (chat, ingestion, all endpoints) |
| server/scraper.ts | 114 | URL scraper (SSRF-protected) |
| server/security.ts | 57 | Fingerprint-based access control |
| server/sketchfab-backup.ts | 152 | Sketchfab model backup |
| server/static.ts | 19 | Static file serving |
| server/storage.ts | 717 | Database storage interface (IStorage + DatabaseStorage) |
| server/uploads.ts | 89 | File upload handling (multer, 10MB limit) |
| server/vite.ts | 58 | Vite dev server integration |

Total server lines: ~6,607

---

## CLIENT FILES

### Pages
| File | Lines | Route |
|---|---|---|
| client/src/pages/clouud-terminal.tsx | 1,474 | / (main terminal) |
| client/src/pages/codex.tsx | 697 | /codex |
| client/src/pages/uinverse.tsx | 485 | /uinverse |
| client/src/pages/legal.tsx | 224 | /legal |
| client/src/pages/not-found.tsx | 21 | 404 |

### Components
| File | Lines |
|---|---|
| client/src/components/exploration-engine.tsx | 900 |
| client/src/components/tutorial.tsx | 411 |
| client/src/components/metrics-panel.tsx | 332 |
| client/src/components/dynamic-background.tsx | 258 |
| client/src/components/security-gate.tsx | 94 |
| client/src/components/clouud-avatar.tsx | 77 |

### Libraries
| File | Lines |
|---|---|
| client/src/lib/fingerprint.ts | 138 |
| client/src/lib/crystal.ts | 82 |
| client/src/lib/queryClient.ts | 57 |
| client/src/lib/utils.ts | 6 |

### Shared
| File | Lines |
|---|---|
| shared/schema.ts | 346 |
| shared/models/chat.ts | 34 |

Total client + shared lines: ~5,639
Total project source lines: ~12,246

---

## CORE ENGINES

### Ellomental Hash (server/ellomental-hash.ts — 67 lines)
- 12-tetrahedron circle formation
- 4 culture rotations: Egyptian, Greek, Latin, English
- Each culture applies character repetition (1x, 2x, 3x, 4x)
- Per-tetrahedron: SHA-256 of (content + angle + culture), truncated to 13 chars
- Circle hash: SHA-256 of all 12 tetrahedron hashes concatenated
- Frequency: 12 * 13 = 156
- Energy: 156^2 = 24,336
- Provenance hash adds: origin, founder, system, timestamp, lattice metadata

### Lattice (server/lattice.ts — 185 lines)
- 33 positions
- Range: 100/1
- Earth = position 33 = 100%
- Fraction-to-string conversion for precision
- Three-ahead minimum calculation

### Security (server/security.ts — 57 lines)
- Fingerprint-based authentication via x-fingerprint header
- SHA-256 hash of device/browser components
- First fingerprint auto-registered as Owner
- Unrecognized/blocked fingerprints get 403
- Access log records all attempts

### Image Generator (server/image-generator.ts — 854 lines)
- SVG-based visualization generation
- Uses seeded random, 2D noise, smooth noise, fractal Brownian motion
- Outputs to generated_images/ directory
- Saves as .svg files

---

## DEPENDENCIES

### Production
- @anthropic-ai/sdk: ^0.78.0
- @hookform/resolvers: ^3.10.0
- @octokit/rest: ^22.0.0
- @tanstack/react-query: ^5.60.5
- cheerio: ^1.2.0
- class-variance-authority: ^0.7.1
- clsx: ^2.1.1
- connect-pg-simple: ^10.0.0
- cors: ^2.8.5
- date-fns: ^4.1.0
- drizzle-orm: ^0.44.2
- drizzle-zod: ^0.7.0
- embla-carousel-react: ^8.5.2
- express: ^4.21.1
- express-session: ^1.18.1
- framer-motion: ^12.12.1
- input-otp: ^1.4.1
- lucide-react: ^0.468.0
- multer: ^2.0.1
- next-themes: ^0.4.6
- p-limit: ^7.3.0
- p-retry: ^7.1.1
- passport: ^0.7.0
- passport-local: ^1.0.0
- pg: ^8.16.3
- react: ^19.2.0
- react-day-picker: ^9.11.1
- react-dom: ^19.2.0
- react-hook-form: ^7.66.0
- react-resizable-panels: ^2.1.9
- recharts: ^2.15.4
- sonner: ^2.0.7
- tailwind-merge: ^3.5.0
- tailwindcss-animate: ^1.0.7
- tw-animate-css: ^1.4.0
- vaul: ^1.1.2
- wouter: ^3.3.5
- ws: ^8.18.0
- zod: ^3.25.76
- zod-validation-error: ^3.5.4

### Dev
- @replit/vite-plugin-cartographer: ^0.4.4
- @replit/vite-plugin-dev-banner: ^0.1.1
- @replit/vite-plugin-runtime-error-modal: ^0.0.4
- @tailwindcss/vite: ^4.1.14
- drizzle-kit: ^0.31.4
- esbuild: ^0.25.0
- postcss: ^8.5.6
- tailwindcss: ^4.1.14
- tsx: ^4.20.5
- typescript: 5.6.3
- vite: ^7.1.9
- @vitejs/plugin-react: ^5.0.4

### Optional
- bufferutil: ^4.0.8

---

## KNOWN ISSUES AT TIME OF SNAPSHOT

1. UInVerse broken: 3 imports exist, all status="error", 0 ideas extracted. The analyzeIdeasInBackground function fails silently.
2. Hardcoded zip path: Founder ingestion references a specific file path (/home/runner/workspace/attached_assets/data-2026-03-04-11-19-05-batch-0000_1772623319864.zip), not dynamic uploads.
3. Unsafe zip parser: Manual Local File Header parsing in founder-memory.ts (lines 90-108) with no bounds checking, no zip bomb protection, no decompression size limits. fs.readFileSync loads entire archive into memory.
4. No content sanitization: Raw content stored and served without XSS/injection scanning.
5. 10MB upload limit: Set in server/uploads.ts. Too small for ChatGPT/Replit data exports.
6. No quarantine system: No table or mechanism to isolate malicious/malformed content.
7. Patterns table empty: Schema exists (tables 13-15) but no extraction has been run.
8. Self-assessment scores: All 28 assessments have pass=false despite scores ranging 55-90.
9. Dmension bridge: Operating in LOCAL mode with max 5 quiet retry attempts. 45 shapes seeded locally.

---

## FOUNDER MEMORY ARCHIVE STATS

- 835 conversations spanning 2025-05-26 to 2026-02-28 (9 months)
- 5,231 messages: 2,632 human + 2,599 assistant
- 53 corrections extracted: 21 FACTUAL, 16 STRUCTURAL, 9 NAMING, 7 CONCEPTUAL
- Source: Claude conversation export (zip with conversations.json)
- Ingestion function: ingestFounderArchive() in server/founder-memory.ts

---

## REGISTERED OWNER

- Fingerprint hash: de5a2c3f112331153898c713caa40c72275f24b065242a1aa2aa31564dc74721
- Role: Owner (first-registered)
- Status: Active, not blocked

---

## END OF SNAPSHOT
## Captured: 2026-03-04 20:50:28 UTC
## System: UUON Clouud Aeye — G-centric Intelligence System v3.333
## This file is static. It does not update. It is a record of a moment.
