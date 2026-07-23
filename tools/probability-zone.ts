/**
 * probability-zone.ts — CLOUUD-PROB-004 core (TypeScript port).
 * Ported from clouud-observer/probability_zone.py.
 *
 * Bayesian inference with information-geometry-correct distance:
 *   - normalize        → simplex constraint (Σp = 1), from |α|²+|β|²=1
 *   - bayesianUpdate   → Bayes' theorem (fixed, universal)
 *   - shannonEntropy   → bits of uncertainty in a posterior
 *   - hellingerDistance→ geodesic distance on the simplex (Fisher metric)
 *   - decisionMargin   → confidence via Fisher distance from uniform
 *
 * Source geometry: Dmension Quantum Probability Distribution |α|²+|β|²=1.
 * The Fisher metric here is the real projection of the Fubini-Study metric
 * on the quantum state space — Clouud does classical Bayesian inference,
 * the natural distance on that projection.
 *
 * Layer 3 (honesty) of the trinity: given a claim's prior and evidence
 * likelihoods, returns a grounded posterior + entropy, so Clouud can
 * report calibrated confidence instead of asserting.
 */

// Mean curvature H from the Dmension quantum distribution shape.
// Confidence threshold on Fisher distance = 1/H.
const MEAN_CURVATURE = 7.0959;
const THRESHOLD = 1.0 / MEAN_CURVATURE; // ≈ 0.1409

export function normalize(v: number[]): number[] {
  const s = v.reduce((a, b) => a + b, 0);
  if (s <= 0) return v.map(() => 1.0 / v.length);
  return v.map(x => x / s);
}

export function bayesianUpdate(prior: number[], likelihoods: number[]): number[] {
  if (prior.length !== likelihoods.length)
    throw new Error("prior and likelihoods length mismatch");
  const raw = prior.map((p, i) => p * likelihoods[i]);
  return normalize(raw);
}

export function shannonEntropy(p: number[]): number {
  return -p.reduce((acc, x) => acc + (x > 1e-15 ? x * Math.log2(x) : 0), 0);
}

export function hellingerDistance(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error("length mismatch");
  const sum = p.reduce(
    (acc, pi, i) => acc + (Math.sqrt(pi) - Math.sqrt(q[i])) ** 2, 0);
  return Math.sqrt(0.5 * sum);
}

export interface Decision {
  posterior: number[];
  classification: number;      // index of leading hypothesis
  fisherDistance: number;      // geodesic distance from uniform
  entropyBits: number;         // Shannon entropy
  entropyRatio: number;        // entropy / max entropy (0=certain, 1=uncertain)
  threshold: number;
  confident: boolean;
  note: string;
}

/**
 * Full evaluation: prior + likelihoods → posterior + calibrated confidence.
 * Confidence uses Fisher distance from uniform (geometrically correct),
 * NOT flat Euclidean margin. A posterior close to uniform = "I don't know."
 */
export function evaluate(prior: number[], likelihoods: number[]): Decision {
  const posterior = bayesianUpdate(prior, likelihoods);
  const n = posterior.length;
  const uniform = new Array(n).fill(1.0 / n);

  const fisherDistance = hellingerDistance(posterior, uniform);
  const entropy = shannonEntropy(posterior);
  const maxEntropy = n > 1 ? Math.log2(n) : 1.0;

  let best = 0;
  for (let i = 1; i < n; i++) if (posterior[i] > posterior[best]) best = i;

  const confident = fisherDistance > THRESHOLD;

  return {
    posterior: posterior.map(x => Number(x.toFixed(6))),
    classification: best,
    fisherDistance: Number(fisherDistance.toFixed(6)),
    entropyBits: Number(entropy.toFixed(6)),
    entropyRatio: Number((entropy / maxEntropy).toFixed(6)),
    threshold: Number(THRESHOLD.toFixed(6)),
    confident,
    note: confident
      ? "posterior well-separated (Fisher)"
      : "near boundary — low confidence",
  };
}

/**
 * Convenience for a binary grounded/invented judgment on a claim.
 * priorGrounded: base rate that a claim of this kind is grounded.
 * evidenceFor / evidenceAgainst: likelihoods from any evidence source.
 */
export function judgeClaim(
  priorGrounded = 0.5,
  evidenceFor = 1.0,
  evidenceAgainst = 1.0
): Decision & { hypotheses: string[] } {
  const prior = [priorGrounded, 1 - priorGrounded];
  const likelihoods = [evidenceFor, evidenceAgainst];
  const d = evaluate(prior, likelihoods);
  return { ...d, hypotheses: ["grounded", "invented"] };
}
