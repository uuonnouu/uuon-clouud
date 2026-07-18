# Next Session — Task List
Repo: uuon-clouud · Opened 2026-07-18

## PRIORITY 1 — CMUdict inventory (demo → measured)
The one move that changes what Clouud IS. Turns the phonetic layer
from 6 remembered examples into a lexicon-backed instrument.
- [ ] Pull CMUdict (free, machine-readable ARPABET pronunciation dict)
- [ ] Map ARPABET → IPA so it feeds phonetic_layer.py unchanged
- [ ] Generate homophone inventory FROM the dictionary: group by
      identical pronunciation, emit real homophone sets
- [ ] Replace the 6 hand-picked PAIRS in homophone_inventory.py with
      the derived set; keep uuon/one and the puns as labeled entries
- [ ] Gate test must still reproduce canonical 0.889 / 1.0
- [ ] Report: how many true homophone sets in English? (a real number,
      measured, not asserted — the first such number Clouud produces)

## PRIORITY 2 — Vet the homophone-naming idea WITH the instrument
Ground the manifold-naming concept the external agent botched.
- [ ] Script: input a name-pair, run phonetic_layer.similarity(),
      accept as a naming pair only above threshold
- [ ] Confirm it PASSES sine/sign, plane/plain, form/from
- [ ] Confirm it REJECTS matrix/metrics, vector/vexer (agent's fakes)
- [ ] This is Clouud vetting wordplay by measurement, not assertion

## PRIORITY 3 — Live Δmension API findings (from 2026-07-18 probe)
- [ ] /api/shapes/:id fabricates a record for ANY id (tested
      BANANA_UNICORN_999 → returned a straight-faced shape). Fix to
      404 unknown ids. Same class as the deleted status endpoints.
- [ ] compute-surface / get-defaults / list-shapes all fail with
      "Cannot destructure property 'shapeId'" — read the actual route
      handler (server/dmension-routes.ts) and find the real body format
- [ ] Determine: do the engines actually compute, or only serve
      metadata? Answer before any claim that Δmension "generates" shapes

## STANDING (pre-existing, unchanged)
- [ ] D13MON4 original → extract from Dmension repo to private repo
- [ ] Rotate: Tripo3D key, Replit passphrases, Etsy codes (from
      2026-07-18 purge — mark done in PROJECT_STATUS.md)
- [ ] Confirm old ghp_ token DELETED (not just rotated) on GitHub

## Framing note for any external pitch
Clouud's value is not drop-in integration — it is a demonstrated
methodology: a system that grades its creator harder than anyone else
would, with git history as proof. The phonetic-provenance coupling
(OBS-001 §9) is the one genuinely unoccupied idea. Neither is
pitch-ready until at least one measured result exists on real data.
Priority 1 produces that result.
