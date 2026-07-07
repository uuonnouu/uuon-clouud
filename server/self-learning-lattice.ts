import { chiValue, chiPosition } from "./lattice";

/**
 * Self-Learning Lattice: Adaptive 33-point framework
 * 
 * Problem: Fixed lattice works for general reasoning, but domains need specialization
 * Solution: Extract frequent lattice positions from feedback data → learn domain grids
 * 
 * Example:
 * - Medical imaging: brightness/contrast positions appear frequently → domain lattice emphasizes those
 * - Legal documents: complexity/length positions matter → different domain lattice
 * - Code review: readability/complexity matter → yet another lattice
 * 
 * Mechanism:
 * 1. Collect feedback (Helped/Partial/Missed) → extract lattice positions
 * 2. Identify clusters of "successful" positions
 * 3. Create domain lattice: reweight the 33 positions based on success rate
 * 4. Apply domain lattice to future reasoning in that domain
 */

export interface FeedbackEntry {
  responseId: string;
  latticePositions: Record<string, number>; // property -> position
  feedback: "helped" | "partial" | "missed";
  domain: string;
  timestamp: string;
}

export interface DomainLatticeWeights {
  domain: string;
  basePositions: number[]; // 1-33
  weights: Record<number, number>; // position -> success weight (0-1)
  success_rate: number; // overall success % in this domain
  sample_size: number;
  lastUpdated: string;
}

/**
 * Extract lattice positions from a response's analysis
 */
export function extractLatticePositions(analysisData: Record<string, number>): number[] {
  return Object.values(analysisData).filter((v) => v >= 1 && v <= 33);
}

/**
 * Build domain lattice from accumulated feedback
 * High success rate at certain positions → reweight those positions
 */
export function buildDomainLattice(
  feedbackHistory: FeedbackEntry[],
  domain: string
): DomainLatticeWeights {
  if (feedbackHistory.length === 0) {
    // No domain lattice yet → use uniform weights
    const uniform: Record<number, number> = {};
    for (let i = 1; i <= 33; i++) {
      uniform[i] = 1.0 / 33;
    }
    return {
      domain,
      basePositions: Array.from({ length: 33 }, (_, i) => i + 1),
      weights: uniform,
      success_rate: 0,
      sample_size: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Count successes per position
  const positionSuccesses: Record<number, number> = {};
  const positionCounts: Record<number, number> = {};

  for (const entry of feedbackHistory) {
    const positions = Object.values(entry.latticePositions).filter((v) => v >= 1 && v <= 33);
    const isSuccess = entry.feedback === "helped";

    for (const pos of positions) {
      positionCounts[pos] = (positionCounts[pos] || 0) + 1;
      if (isSuccess) {
        positionSuccesses[pos] = (positionSuccesses[pos] || 0) + 1;
      }
    }
  }

  // Calculate success rates per position
  const weights: Record<number, number> = {};
  for (let pos = 1; pos <= 33; pos++) {
    const count = positionCounts[pos] || 0;
    const successes = positionSuccesses[pos] || 0;
    weights[pos] = count > 0 ? successes / count : 0.5; // default to 0.5 if no data
  }

  // Normalize weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalized: Record<number, number> = {};
  for (let pos = 1; pos <= 33; pos++) {
    normalized[pos] = weights[pos] / (totalWeight || 1);
  }

  const totalSuccesses = Object.values(positionSuccesses).reduce((a, b) => a + b, 0);
  const success_rate = feedbackHistory.length > 0 ? totalSuccesses / feedbackHistory.length : 0;

  return {
    domain,
    basePositions: Array.from({ length: 33 }, (_, i) => i + 1),
    weights: normalized,
    success_rate,
    sample_size: feedbackHistory.length,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Apply domain lattice to reasoning:
 * Suggest positions that have high success weight in this domain
 */
export function applyDomainLattice(
  domainLattice: DomainLatticeWeights,
  queryContext: string
): { suggestedPositions: number[]; rationale: string } {
  // Sort positions by success weight
  const sorted = Object.entries(domainLattice.weights)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // top 5

  const suggestedPositions = sorted.map(([pos]) => Number(pos));
  const weights = sorted.map(([, w]) => w.toFixed(2)).join(", ");

  return {
    suggestedPositions,
    rationale: `In domain "${domainLattice.domain}", positions ${suggestedPositions.join(
      ", "
    )} have highest success rates (weights: ${weights}). Domain success rate: ${(domainLattice.success_rate * 100).toFixed(1)}%.`,
  };
}

/**
 * Adaptive reasoning: use domain lattice to guide response generation
 */
export function buildAdaptiveSystemPrompt(
  baseDomainLattice: DomainLatticeWeights,
  query: string
): string {
  const { suggestedPositions, rationale } = applyDomainLattice(baseDomainLattice, query);

  const positionDetails = suggestedPositions
    .map((pos) => {
      const val = chiValue(pos, 1);
      return `Position ${pos}: ${val.rational} (${val.float.toFixed(3)})`;
    })
    .join("\n");

  return `
[DOMAIN-ADAPTIVE REASONING]
Domain: "${baseDomainLattice.domain}"
${rationale}

Recommended lattice positions for this query:
${positionDetails}

When responding, ground your reasoning at one of these positions.
This domain has ${(baseDomainLattice.success_rate * 100).toFixed(1)}% success rate.
Adapt your response style accordingly.
`;
}

/**
 * Active lattice learning: update domain lattice on new feedback
 */
export function updateDomainLatticeWithFeedback(
  currentLattice: DomainLatticeWeights,
  newFeedback: FeedbackEntry
): DomainLatticeWeights {
  // Incremental update: blend old weights with new feedback
  const oldWeights = currentLattice.weights;
  const newPositions = Object.values(newFeedback.latticePositions).filter((v) => v >= 1 && v <= 33);
  const isSuccess = newFeedback.feedback === "helped";

  const updatedWeights: Record<number, number> = { ...oldWeights };

  // Exponential moving average: new feedback gets 20% weight
  const alpha = 0.2;

  for (let pos = 1; pos <= 33; pos++) {
    const wasUsed = newPositions.includes(pos);
    const newSignal = wasUsed && isSuccess ? 1 : wasUsed && newFeedback.feedback === "missed" ? 0 : 0.5;

    updatedWeights[pos] = (1 - alpha) * oldWeights[pos] + alpha * newSignal;
  }

  // Normalize
  const totalWeight = Object.values(updatedWeights).reduce((a, b) => a + b, 0);
  for (let pos = 1; pos <= 33; pos++) {
    updatedWeights[pos] /= totalWeight || 1;
  }

  const oldSuccess = currentLattice.success_rate * currentLattice.sample_size;
  const newSuccess = isSuccess ? oldSuccess + 1 : oldSuccess;
  const newTotal = currentLattice.sample_size + 1;

  return {
    ...currentLattice,
    weights: updatedWeights,
    success_rate: newTotal > 0 ? newSuccess / newTotal : 0,
    sample_size: newTotal,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Database schema for domain lattices
 */
export const domainLatticeSchema = {
  domain_lattices: `
    CREATE TABLE IF NOT EXISTS domain_lattices (
      id SERIAL PRIMARY KEY,
      domain VARCHAR(255) UNIQUE NOT NULL,
      weights JSONB NOT NULL,
      success_rate NUMERIC(5, 4) DEFAULT 0,
      sample_size INTEGER DEFAULT 0,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  feedback_history: `
    CREATE TABLE IF NOT EXISTS feedback_history (
      id SERIAL PRIMARY KEY,
      response_id VARCHAR(255) NOT NULL,
      domain VARCHAR(255) NOT NULL,
      lattice_positions JSONB NOT NULL,
      feedback VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (domain) REFERENCES domain_lattices(domain)
    )
  `,
};

/**
 * Example usage
 */
export const exampleDomainLattices = {
  medical_imaging: {
    domain: "medical_imaging",
    description: "Radiology report generation from medical images",
    frequentPositions: [5, 8, 12, 15, 18, 22, 25, 28, 31, 33],
    meaning: "Medical domain emphasizes positions associated with precision, clarity, structured analysis",
  },
  legal_documents: {
    domain: "legal_documents",
    description: "Contract analysis and legal memo generation",
    frequentPositions: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33],
    meaning: "Legal domain emphasizes positions associated with rigor, completeness, citation density",
  },
  code_review: {
    domain: "code_review",
    description: "Software code analysis and review suggestions",
    frequentPositions: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32],
    meaning: "Code domain emphasizes positions associated with clarity, efficiency, maintainability",
  },
  creative_writing: {
    domain: "creative_writing",
    description: "Fiction, poetry, creative content generation",
    frequentPositions: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31],
    meaning: "Creative domain emphasizes positions associated with nuance, evocation, variation",
  },
};

export default {
  buildDomainLattice,
  applyDomainLattice,
  buildAdaptiveSystemPrompt,
  updateDomainLatticeWithFeedback,
  extractLatticePositions,
};
