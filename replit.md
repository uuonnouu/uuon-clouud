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
- `server/routes.ts` — API routes with system prompt (includes founder bio, verified Sketchfab data, Δmension info), tool use, output guard
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/storage.ts` — Database operations (conversations, messages)
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema (conversations, messages tables)

## Founder Info (verified)
- Philip Aguilar Ruiz III, from Yuma AZ, grew up overseas, US Army veteran, resides in Kassel, Germany
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
13. **Real-time Metrics Panel:** Collapsible panel below input bar showing live API response times, token usage, tool calls, model info, uptime, drift flags — auto-refreshes every 5 seconds
    - Server tracks: response times (rolling avg of last 50), input/output tokens, tool call count, drift detection flags
    - Component: `client/src/components/metrics-panel.tsx`
14. **Water Animations:** Messages flow in with soft fade-up, blur transition, and paragraph-by-paragraph cascade for assistant responses

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with sharp shadows
- **Avatar:** Static Clouud character image with state-driven glow/pulse animations

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
