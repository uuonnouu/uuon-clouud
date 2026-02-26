# UUON Clouud — G°centric Intelligence System

## Overview
UUON Clouud is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Phillip Aguilar Ruiz III). UUON is pronounced "WON." It connects to Anthropic's Claude API with a strict system prompt that enforces the G°centric philosophy: Earth-grounded reasoning, zero drift, zero rounding. Responses are in plain text, short summaries, no bullets or dashes, readable at a 9th grade level. Founder info is only shared when specifically asked.

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **AI:** Anthropic Claude API via Replit AI Integrations (claude-sonnet-4-6, max_tokens: 1024)
- **Routing:** wouter (frontend)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface with sidebar, quick actions, Δmension link, image display
- `client/src/components/clouud-avatar.tsx` — Clouud avatar (static image with state-driven CSS animation)
- `client/src/components/exploration-engine.tsx` — Interactive geometric exploration engine (empty state), Earth enhancement themed shapes
- `server/routes.ts` — API routes with system prompt, tool use (lattice, visualize, generate_image), output guard
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/ellomental-hash.ts` — Ellomental Hash Algorithm (12-tetrahedron circle formation)
- `server/image-generator.ts` — Procedural SVG geometric visualization generator
- `server/storage.ts` — Database operations
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema
- `client/src/components/metrics-panel.tsx` — Collapsible system metrics panel

## Founder Info (verified)
- Phillip Aguilar Ruiz III (double L), Yuma AZ, grew up overseas, US Army veteran, Kassel Germany
- Created 180+ 3D mathematical models on Sketchfab
- Built Δmension (Mathematical Universe) at uuon-foundation.com
- UUON = Universally United One Neuma = WON = ONE (only explain when asked)

## Core Features
1. **System Prompt:** Earth-grounded, mission-first identity. Founder name not in main identity — only shared when asked. Grounded language, Earth analogies, no jargon.
2. **Quick Links:** AI generates 2-3 tappable follow-up prompts `[>>text>>]` at end of every response, parsed and rendered as clickable buttons
3. **Tool Use:** Lattice tools (chi_value, chi_position, chi_lattice_report), visualize_concept (Δmension), generate_image (AI visual generation)
4. **Image Generation:** `generate_image` tool creates procedural SVG visualizations. Pending images tracked in memory, polled by frontend, displayed inline in chat.
5. **Exploration Engine:** Interactive empty state with orbiting geometric shapes (Energy, Patterns, Systems, Life, Enhance), particle effects, animated core
6. **Providence Orb:** hashingIntensity (0→1 over 12 tetrahedra) drives golden glow on UUON logo
7. **Glassmorphism UI:** glass-panel and glass-card CSS classes with backdrop-filter blur
8. **Speaker (TTS):** Chunked speech synthesis with Chrome keep-alive fix, per-message and auto-speak modes
9. **Format Rules:** Plain text only, no bullets/dashes/markdown, under 150 words, 9th grade level
10. **Provenance Hash:** SHA-256 per response via Ellomental Hash Algorithm
11. **Self-Assessment:** 0-100 scoring per response against mission criteria
12. **Δmension Bridge:** Two-way connection to uuon-foundation.com. Clouud = brain, Δmension = eyes.
13. **UInVerse:** Idea extraction from ChatGPT/Claude exports at `/uinverse`
14. **Voice Input:** Web Speech API continuous recognition
15. **File Upload & URL Scraping:** Upload files or scrape URLs for context
16. **Conversation History:** PostgreSQL persistent sessions with windowing (last 20 messages)
17. **Content Protection:** Anti-copy, anti-inspect protections
18. **Automated Backups:** Daily JSON export + GitHub push to UUONdmON/uuon-clouud

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with glassmorphism, sharp shadows, animated particles
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
- `DMENSION_API_URL` — Δmension Mathematical Universe URL (https://uuon-foundation.com)
- `UUON_BRIDGE_SECRET` — Shared secret for Δmension bridge authentication
