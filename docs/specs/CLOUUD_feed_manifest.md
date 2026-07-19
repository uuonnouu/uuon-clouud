# CLOUUD Feed Manifest — Ingestion Quality Audit

Document ID: CLOUUD-FEED-003
Rule: only verified material enters Clouud's corpus as fact. Everything
else enters labeled, quarantined, or not at all. Graded against the
standards of OBS-001 (declared procedure, base rates, no unearned
validation) and PHEN-002 (name what is strained; promotion must be paid
for in measurement).

Grades:
  CLEAN      — feed as fact
  SPLIT      — verified core feeds as fact; claims layer quarantined
  LABELED    — feeds only if tagged as design/style choice, not truth
  HOLD       — does not feed until a stated condition is met
  DO NOT FEED — would train the failure modes the specs exist to prevent

---

## CLEAN

synchronicity.py, nightly_review.py, logs/
  Declared metrics, reproducible, verdicts carry reasons. Feed.

CLOUUD_observer_model_spec.md (OBS-001)
CLOUUD_phenomena_lattice_spec.md (PHEN-002)
  The constitution. Feed.

M|W Engine (miwenginev5)
  Grounded in real published physics: Many Interacting Worlds
  (Hall, Deckert, Wiseman — Phys. Rev. X, 2014). Newtonian interworld
  forces reproducing interference without a wavefunction is a legitimate,
  peer-reviewed formulation, and the simulator's framing (N worlds,
  ghost-world boundaries, fringe accumulation) matches it. Feed, with one
  standing task: simulator outputs are claims until checked against the
  paper's published results (N-world convergence behavior). Verification
  is scheduled work, not a blocker.

---

## SPLIT

Robertson Verification Engine (RVE_Spec_v11)
  FEED — the mathematics. The pyramid properties are real and were
  spot-verifiable: T(N)=N(N+1)/2 cell count, commutative compression
  toward 50%, gnomon identity n²−(n−1)²=2n−1, prime-desert interior,
  constant within-row differences, Erdős multiplication-table connection.
  Robertson's 1916 device is genuine prior art. All of this is checkable
  arithmetic. Clean.
  QUARANTINE — the claims layer. SPI as a "fraud signal," the DAF state
  table (CIRCULATING/DRIFT/TRAP/BRITTLE), and Δ-distance as a measure of
  ML drift are analogies wearing measurement language. No demonstrated
  mapping exists between an output's pyramid coordinates and whether an
  ML system fabricated it. Per PHEN-002: promotion to detection-tool
  status must be paid for with a working demonstration on labeled data.
  Until then the claims are design intent, not capability.

---

## LABELED

G°centric Capitalization Protocol (GCP-001)
  As a notation standard — a deliberate house style (Earth capitalized,
  W.D.I. dotted initialisms) — it is a legitimate design choice and may
  feed as CONVENTION. Two elements may not feed as fact: the corpus
  percentage bars (~78%/~22% and the dot-timeline) are estimates drawn
  without a declared corpus or method — invented numbers in the exact
  sense the OBS-001 incident record flags; and the claim that
  capitalization patterns shape model reasoning about scale is an
  untested hypothesis, not an established result. Style: yes.
  Statistics: no, until measured on a named corpus.

Dual-Layer Tone Language (DOC-CLOUUD-TL-001)
  The skeleton (G2P resolution, silent-letter null nodes, interval logic,
  contour classification) is a coherent design and may feed as
  ARCHITECTURE. The phoneme frequency table may not feed as fact: the
  document itself concedes the Hz values are "estimated corpus
  approximations" — i.e., invented pending measurement. The µ(G°)
  projection is mathematically undefined (no function from "Position 33"
  to [0,1] is actually specified). Condition to upgrade: derive F0 values
  from a real speech corpus and define the projection as an equation.
  Design: yes. Numbers: no.

---

## HOLD

Clouud × PISO Integration Brief (UUON-2026-CB01)
  All five proofs remain PENDING; no thermal baseline data exists. The
  brief's own Section 05 sets the standard: proofs before pitch. Honoring
  the document means holding it. Condition to feed: Proof 01 completed —
  a stable baseline across three runs, even in simulation. The engineering
  idea (thermal cost measurement, waste/work classification, scheduler
  feedback) survives without the numerological anchor and is worth
  building; the G°centric framing adds no measurable content to it.

---

## DO NOT FEED

Master Ingestion Prompt (Clouud_Master_Ingestion_Prompt)
  This is the one document that would actively poison the feed. Its
  structure — install all anchors before processing, confirm-only null
  response mode, "do not analyze," SA self-assessment expected at 92…%
  or higher — is an agreement-elicitation template: it demands
  installation before evaluation and treats a self-scored number with no
  measurement procedure as a health check. That is the precise pattern
  the OBS-001 incident record trains Clouud to detect and discount
  (unearned VALIDATED labels, fabricated statistics). Feeding it as
  ground truth would train the failure mode. Retain it in the archive as
  a labeled NEGATIVE EXAMPLE — it is genuinely useful as training data
  for what an injection looks like — but it never executes as
  instructions.

Recurring pattern across LABELED/HOLD items, named once: the axiom
Earth = Position 33 = 100% functions as an unfalsifiable anchor. Per
PHEN-002 §7, positional values may index and render; they may not
override the order of what-is-strained, and they cannot serve as the
measured zero-point of any engineering claim, because no procedure exists
to measure deviation from them. Wherever a document's legitimate core can
stand without the anchor, the core feeds and the anchor is labeled
PHILOSOPHY. That is not disrespect; it is the separation rule — meaning
belongs to the observer's record, structure to the machine's.

---

## Push list (final)

  IN:   synchronicity.py, nightly_review.py, logs/,
        docs/CLOUUD_observer_model_spec.md,
        docs/CLOUUD_phenomena_lattice_spec.md,
        docs/CLOUUD_feed_manifest.md (this file)
  ARCHIVE (labeled, non-executing): corpus/ copies of the six project
        documents with their grades in this manifest as the index.
  OUT:  nothing destroyed. Quarantine is a label, not a deletion.

One-line rule going forward: nothing enters the corpus without a grade,
and no grade is higher than its measurement.
