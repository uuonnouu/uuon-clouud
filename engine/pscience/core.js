/**
 * pscience-perception-engine — core/pscience-pipeline.js
 * PROPRIETARY — USAL-1.0 — Phillip Aguilar Ruiz III / UUON Foundation Inc.
 *
 * DEPLOYMENT: NOT committed to public GitHub repo.
 * Served from https://uuon.world/engine/pscience/core.js via uuon-clouud.
 * Loaded at runtime by index.html shell.
 *
 * Original name: ψcience. Character substitution ψ→pscience due to
 * GitHub repo name restriction. 2025-08-02 UTC.
 */

'use strict';

const P_DIM = {
  perception:  { sym: 'Pₚ', weight: 1.0 },
  pattern:     { sym: 'Pₐ', weight: 0.9 },
  perspective: { sym: 'Pᵥ', weight: 0.85 },
  probability: { sym: 'Pᵦ', weight: 0.95 },
  provenance:  { sym: 'Pₒ', weight: 0.8 },
  projection:  { sym: 'Pⱼ', weight: 0.75 },
  process:     { sym: 'Pᵈ', weight: 0.88 },
};

function PSCIENCE_entropy(hypotheses) {
  const total = hypotheses.reduce((s, h) => s + h.confidence, 0);
  if (total === 0) return 0;
  return -hypotheses.reduce((s, h) => {
    const p = h.confidence / total;
    return s + (p > 0 ? p * Math.log2(p) : 0);
  }, 0);
}

function PSCIENCE_overlap(hA, hB) {
  const cA = hA.confidence, cB = hB.confidence;
  const dot = cA * cB;
  const normA = Math.sqrt(cA * cA), normB = Math.sqrt(cB * cB);
  const cos = (normA * normB > 0) ? dot / (normA * normB) : 0;
  return cos * cos;
}

function PSCIENCE_informationDensity(hypothesis, peers) {
  const overlapSum = peers.reduce((s, peer) => {
    if (peer.id === hypothesis.id) return s;
    return s + PSCIENCE_overlap(hypothesis, peer);
  }, 0);
  return overlapSum * (hypothesis.bse_rank || hypothesis.entropy || 0.5);
}

function PSCIENCE_collapse(hypotheses, tau) {
  const H = PSCIENCE_entropy(hypotheses);
  const decay = Math.exp(-H * tau);
  const scored = hypotheses.map(h => ({
    ...h,
    collapse_score: PSCIENCE_informationDensity(h, hypotheses) * decay,
  }));
  scored.sort((a, b) => b.collapse_score - a.collapse_score);
  return {
    winner: scored[0],
    ranked: scored,
    entropy_pre: H,
    entropy_post: PSCIENCE_entropy([scored[0]]),
    decay_factor: decay,
    tau,
  };
}

function PSCIENCE_expand(input, params) {
  params = params || {};
  const k   = params.k   || 5;
  const tau = params.tau || 0.3;
  const now = new Date().toISOString();
  const hypotheses = Array.from({ length: k }, function(_, i) {
    return {
      id:             'h-' + Date.now() + '-' + i,
      interpretation: 'candidate-' + (i + 1),
      confidence:     Math.max(0.1, Math.min(0.95, 0.8 - i * 0.12 + (Math.random() - 0.5) * 0.1)),
      provenance: {
        origin:     typeof input === 'string' ? input.slice(0, 64) : 'raw',
        timestamp:  now,
        transforms: ['expand'],
        engine:     'pscience-v1.0.0',
      },
      invariants:  [],
      entropy:     0,
      bse_rank:    0.5,
      overlap:     {},
    };
  });
  hypotheses.forEach(function(h) { h.entropy = PSCIENCE_entropy(hypotheses); });
  return { field_id: 'field-' + Date.now(), hypotheses: hypotheses, tau: tau, status: 'superposition' };
}

window.PSCIENCE = {
  expand:             PSCIENCE_expand,
  collapse:           PSCIENCE_collapse,
  entropy:            PSCIENCE_entropy,
  overlap:            PSCIENCE_overlap,
  informationDensity: PSCIENCE_informationDensity,
  dimensions:         P_DIM,
  version:            '1.0.0',
};

console.log('[pscience] core ready — ψcience v1.0.0 · USAL-1.0 · Phillip Aguilar Ruiz III');
/**
 * pscience-perception-engine — core/pscience-invariants.js
 * PROPRIETARY — USAL-1.0 — Phillip Aguilar Ruiz III / UUON Foundation Inc.
 * DO NOT COMMIT. Served from uuon.world/engine/pscience/core.js
 */
'use strict';
function PSCIENCE_detectInvariants(hypotheses) {
  if (!hypotheses || hypotheses.length < 2) return [];
  const threshold = 0.7;
  return hypotheses.filter(function(h) { return h.confidence >= threshold; }).map(function(h) { return h.interpretation; });
}
if (window.PSCIENCE) { window.PSCIENCE.detectInvariants = PSCIENCE_detectInvariants; }
/**
 * pscience-perception-engine — core/pscience-provenance.js
 * PROPRIETARY — USAL-1.0 — Phillip Aguilar Ruiz III / UUON Foundation Inc.
 * Implements Pₒ (Provenance) dimension. Every hypothesis carries full transform history.
 * DO NOT COMMIT. Served from uuon.world/engine/pscience/core.js
 */
'use strict';
function PSCIENCE_recordTransform(hypothesis, operation, engineId) {
  return Object.assign({}, hypothesis, {
    provenance: Object.assign({}, hypothesis.provenance, {
      transforms: (hypothesis.provenance.transforms || []).concat([operation]),
      engine: engineId || hypothesis.provenance.engine,
      timestamp: new Date().toISOString(),
    }),
  });
}
function PSCIENCE_provenanceSeed(fieldId, winner, proof) {
  return {
    field_id:   fieldId,
    winner_id:  winner.id,
    proof:      proof,
    provenance: winner.provenance,
    invariants: winner.invariants,
    timestamp:  new Date().toISOString(),
    engine:     'pscience-v1.0.0',
    license:    'USAL-1.0',
    author:     'Phillip Aguilar Ruiz III',
  };
}
if (window.PSCIENCE) {
  window.PSCIENCE.recordTransform = PSCIENCE_recordTransform;
  window.PSCIENCE.provenanceSeed  = PSCIENCE_provenanceSeed;
}
