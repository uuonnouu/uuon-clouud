# CLOUUD — Task Backlog

Living list. Checked = done this session. Unchecked = pending.

## DONE (this session)
- [x] Fix CORS (Railway + uuon.world whitelisted, duplicate removed)
- [x] Wire chat terminal via wouter router (was orphaned)
- [x] Repoint Dmension bridge to live Railway Clouud
- [x] Phase 0: clean file tree (delete debris, non-yours repos, dedup)
- [x] Port grader.py + probability_zone.py to TypeScript
- [x] Add grade_text, probability_zone, ellomental_verify to TOOLS array
- [x] Verified real grader works (SPLIT+LABELED on test text)

## IN PROGRESS
- [ ] **Deterministic honesty layer** — run grade_text/probability_zone in
      the route (not model discretion) so they can't be hallucinated.
      Model faked tool output; real code confirmed working. Fix via
      injectedContext hook already in the route.
- [ ] **Upgrade model** — swap llama-3.1-8b (weak tool-calling) for
      DeepSeek Chat v3 or similar. One env var: OPENROUTER_MODEL.

## PENDING — UI / features (user reported broken or wanted)
- [ ] **File upload broken** — paperclip in UI panel produces nothing.
      Endpoint /api/upload exists (server/uploads.ts) — wire to UI.
- [ ] **URL scraper broken** — link button produces nothing.
      Endpoint /api/scrape exists (rate-limited) — wire to UI + as tool.
- [ ] **Speaker/reader (TTS) broken** — audio button in UI does nothing.
- [ ] **Code generation + visualizer** — let Clouud create .html/.jsx/.py
      apps and render/preview them in the UI. (Artifact-style capability.)

## PENDING — build phases (from CLOUUD_MASTER_BUILD.md)
- [ ] Phase 3: retrieval layer (pgvector over corpus, search_my_writing tool)
- [ ] Phase 4: LoRA fine-tune on 835 conversations (voice layer)
- [ ] Phase 5: self-grading loop (grade drafts pre-response)
- [ ] Phase 6: public repo prep (API surface, no secrets)

## PENDING — housekeeping
- [ ] **Auto-deploy not firing** — user had to manually restart Railway
      deploy. Push doesn't trigger rebuild. Likely GitHub webhook broke
      after repo transfer to UUON-Foundation org. Check Railway Settings
      → Source (reconnect repo) + Deploy (branch = main, no narrow watch
      path). UNTIL FIXED: manually redeploy after every push before testing.
- [ ] Fix Brain Scanner path bug (:Brain/:Raw ENOENT on every boot)
- [ ] Investigate zero-width chars appended to every Clouud response
      (steganographic fingerprint or system-prompt append — audit before
      public launch since every response carries hidden data)
- [ ] Rewrite UUON architecture doc to match real stack (not TensorFlow/
      Kubernetes cosplay — map to actual trinity: voice/facts/honesty)

## NOTES
- Checkpoint tag: working-chat-2026-07-19 (rollback anytime)
- Two Railway services: Clouud (chat) + Dmension (shapes/Brain)
- UUON_CLOUD_URL set on both services (bridge live)
