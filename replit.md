# UUON Clouud — G°centric Intelligence System

## Overview
UUON Clouud is the intelligence interface for the G°centric Lattice System, built by UUON Foundation Inc. (founded by Phillip Ruiz). It connects to Anthropic's Claude API with a strict system prompt that enforces the G°centric philosophy: Earth-grounded reasoning, zero drift, zero rounding.

## Architecture
- **Frontend:** React + TypeScript + Tailwind CSS v4 + Framer Motion
- **Backend:** Express.js + TypeScript
- **Database:** PostgreSQL via Drizzle ORM
- **AI:** Anthropic Claude API via Replit AI Integrations (claude-sonnet-4-6)
- **Routing:** wouter (frontend)

## Key Files
- `client/src/pages/clouud-terminal.tsx` — Main chat interface
- `server/routes.ts` — API routes with system prompt, tool use, output guard
- `server/lattice.ts` — G°centric Lattice Engine (33-point, rational math)
- `server/storage.ts` — Database operations (conversations, messages)
- `server/db.ts` — PostgreSQL connection via Drizzle
- `shared/schema.ts` — Database schema (conversations, messages tables)

## Core Features
1. **System Prompt:** The full G°centric Master System Prompt is embedded in the API call
2. **Tool Use:** Clouud never computes lattice math internally — it calls `chi_rho` tools (chi_value, chi_position, chi_lattice_report) and speaks the result
3. **Temperature 0.1:** Locked for deterministic, persona-stable output
4. **Output Guard:** Every response is checked for "drift phrases" before delivery
5. **Provenance Hash:** Every AI response gets a SHA-256 hash with UUON Foundation metadata
6. **Conversation History:** Persistent chat sessions stored in PostgreSQL

## Design System
- **Palette:** Deep Navy (#030811), UUON Gold (#f0b93b), Atmosphere Blue (#4a8cd4)
- **Typography:** Space Grotesk (display), DM Sans (body), JetBrains Mono (code/data)
- **Style:** Digital Brutalism with sharp shadows, matrix-inspired grid overlays

## Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (auto-set)
- `AI_INTEGRATIONS_ANTHROPIC_API_KEY` — Anthropic API key (via Replit integration)
- `AI_INTEGRATIONS_ANTHROPIC_BASE_URL` — Anthropic base URL (via Replit integration)
