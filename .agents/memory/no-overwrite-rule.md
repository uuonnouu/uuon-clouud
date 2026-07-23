---
name: No-overwrite rule for README and published files
description: Never push README.md or other manually-maintained files to GitHub without explicit user approval. Never reset content the user has updated.
---

# No-Overwrite Rule

## The Rule
Never push README.md to GitHub without the user explicitly asking for it.
Never overwrite any file on GitHub that the user may have edited manually.
Never call the README or replit.md content "done" and push it automatically.

**Why:** The user has manually updated README.md and other docs multiple times. Automated pushes (force-push or Contents API) were silently overwriting their work with stale local versions. This caused repeated loss of their edits and extreme frustration.

**How to apply:**
- Before pushing ANY file to GitHub, check: "Did the user explicitly ask me to push this specific file?"
- If pushing a batch of files, exclude README.md, replit.md, and any docs unless user says so.
- If the README needs updating, SHOW the user the new content first and wait for approval before pushing.
- The live deployed app URL is: https://d-dmension-mathematical-universe-uuon-foundation.replit.app — do not change this without the user asking.
