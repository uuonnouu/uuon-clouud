import { SurfaceParameters } from '../types/math';

/**
 * NATIONAL MOTTOS & SLOGANS - ALGORITHMIC INTERPRETATIONS
 * 
 * Mathematical visualizations of foundational principles from national mottos,
 * representing collective decision-making, trust, unity, and liberty through
 * computational geometry and optimization algorithms.
 * 
 * Based on algorithmic interpretations of:
 * - "In God We Trust" - Bayesian Prior Framework
 * - "United We Stand, Divided We Fall" - Graph Connectivity
 * - "Don't Tread on Me" - Boundary Enforcement
 * - "Liberty and Justice for All" - Fair Allocation
 * - "Life, Liberty, and the Pursuit of Happiness" - Multi-Objective Optimization
 * - "One Nation, Indivisible" - Minimum Cut Problem
 * - "The Buck Stops Here" - Terminal Accountability
 * - "We the People" - Distributed Consensus
 * - "E Pluribus Unum" - Ensemble Learning
 * 
 * Product of UUON Foundation Inc.
 * Author: Phillip A. Ruiz III
 */

export interface ParametricSurface {
  name: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

function getCleanDefaults(overrides: Partial<SurfaceParameters> = {}): Partial<SurfaceParameters> {
  return {
    a: 1, b: 1, c: 1, d: 1,
    e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
    n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0, x: 0, y: 0, z: 0,
    uMin: 0, uMax: 1, vMin: 0, vMax: 1,
    uSegments: 96, vSegments: 72,
    ...overrides
  };
}

export const NATIONAL_MOTTO_ALGORITHMS: Record<string, ParametricSurface> = {
  
  // "IN GOD WE TRUST" - Bayesian Prior Framework
  in_god_we_trust_bayesian: {
    name: "🙏 In God We Trust - Bayesian Prior Trust Framework",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;      // Trust region radius
      const b = params.b ?? 1.5;      // Prior strength (α parameter)
      const c = params.c ?? 1.0;      // Evidence quality
      const d = params.d ?? 2.0;      // Posterior height
      const t = params.t ?? 0;        // Time for trust evolution
      
      const x = (u * 2 - 1) * a;
      const y = (v * 2 - 1) * a;
      
      // Trust region: ||x - x_trusted|| ≤ Δ
      const distFromCenter = Math.sqrt(x * x + y * y);
      const trustRadius = a * (1 + Math.sin(t * 0.5) * 0.2);
      
      // Bayesian posterior calculation visualization
      // P(H|D) = [P(D|H) · P(H)^α] / P(D)
      const prior = Math.exp(-distFromCenter * distFromCenter / (2 * b));
      const likelihood = c * Math.cos(distFromCenter * Math.PI / a);
      const posterior = (prior * Math.pow(Math.abs(likelihood), b)) * d;
      
      // Trust boundary visualization
      const boundaryEffect = distFromCenter < trustRadius ? 1.0 : Math.exp(-(distFromCenter - trustRadius));
      
      const z = posterior * boundaryEffect;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 1.5, c: 1.0, d: 2.0, uSegments: 80, vSegments: 80 })
  },

  // "UNITED WE STAND, DIVIDED WE FALL" - Graph Connectivity
  united_we_stand_graph: {
    name: "🤝 United We Stand - Graph Connectivity Strength",
    equation: (u, v, params) => {
      const a = params.a ?? 8;        // Number of nodes
      const b = params.b ?? 2.0;      // Connection strength
      const c = params.c ?? 1.0;      // Unity height multiplier
      const d = params.d ?? 0.3;      // Edge strength
      const t = params.t ?? 0;        // Time for network evolution
      
      const nodeCount = Math.max(4, Math.min(12, Math.floor(a)));
      
      // Map UV to space
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Generate node positions in circular unity formation
      const nodes: Array<[number, number]> = [];
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + t * 0.3;
        const radius = 2 + Math.sin(t * 0.7 + i) * 0.3;
        nodes.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
      }
      
      // Calculate connectivity strength (Fiedler value simulation)
      let totalConnectivity = 0;
      let minDist = Infinity;
      let closestNode = 0;
      
      // Find closest node and sum connectivity
      for (let i = 0; i < nodeCount; i++) {
        const dx = x - nodes[i][0];
        const dy = y - nodes[i][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist) {
          minDist = dist;
          closestNode = i;
        }
        
        // Edge connectivity contribution
        totalConnectivity += Math.exp(-dist * d) * b;
      }
      
      // United: high connectivity = high surface
      // Divided: low connectivity = fall (low surface)
      const z = totalConnectivity * c * (1 + Math.sin(t * 0.5) * 0.15);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, b: 2.0, c: 1.0, d: 0.3, uSegments: 72, vSegments: 72 })
  },

  // "DON'T TREAD ON ME" - Boundary Enforcement
  dont_tread_boundary: {
    name: "🐍 Don't Tread on Me - Boundary Defense & Penalty",
    equation: (u, v, params) => {
      const a = params.a ?? 3.0;      // Territory radius
      const b = params.b ?? 5.0;      // Penalty strength (ρ)
      const c = params.c ?? 2.0;      // Response exponent (n > 1)
      const d = params.d ?? 1.0;      // Boundary sharpness
      const t = params.t ?? 0;        // Time for defensive response
      
      const x = (u * 2 - 1) * a;
      const y = (v * 2 - 1) * a;
      
      // Territorial boundary (Voronoi-style)
      const distFromCenter = Math.sqrt(x * x + y * y);
      const territoryRadius = a * 0.7;
      
      // Boundary violation measurement
      const violation = Math.max(0, distFromCenter - territoryRadius);
      
      // Exact penalty function: P(x, ρ) = f(x) + ρ·max(0, g(x))
      // Disproportionate response (rattlesnake principle): Response ∝ |Violation|^n
      const penalty = b * Math.pow(violation, c);
      
      // Barrier method: -log(-g(x)) creates infinite barrier
      const barrierHeight = violation > 0 ? penalty : 0;
      
      // Defensive response animation
      const responseWave = Math.sin(t * 2 + distFromCenter * 2) * 0.3;
      
      // Height: safe inside territory, severe penalty for trespassing
      const z = -barrierHeight * d + (territoryRadius - distFromCenter) * 0.5 + responseWave;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 3.0, b: 5.0, c: 2.0, d: 1.0, uSegments: 80, vSegments: 80 })
  },

  // "LIBERTY AND JUSTICE FOR ALL" - Fair Allocation
  liberty_justice_fair_division: {
    name: "⚖️ Liberty and Justice - Fair Division Algorithm",
    equation: (u, v, params) => {
      const a = params.a ?? 6;        // Number of agents
      const b = params.b ?? 1.5;      // Justice (maximin) weight
      const c = params.c ?? 1.0;      // Liberty (choice) weight
      const d = params.d ?? 1.0;      // Nash social welfare balance
      const t = params.t ?? 0;        // Time for allocation evolution
      
      const agentCount = Math.max(3, Math.min(10, Math.floor(a)));
      
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Generate agent positions (envy-free allocation regions)
      const agents: Array<[number, number, number]> = [];
      for (let i = 0; i < agentCount; i++) {
        const angle = (i / agentCount) * Math.PI * 2 + t * 0.4;
        const radius = 2;
        const utility = (Math.sin(i * 2.3) * 0.5 + 0.5); // Random utility
        agents.push([Math.cos(angle) * radius, Math.sin(angle) * radius, utility]);
      }
      
      // Find closest agent (Voronoi partitioning for fair division)
      let minDist = Infinity;
      let allocatedUtility = 0;
      let allUtilities: number[] = [];
      
      for (let i = 0; i < agentCount; i++) {
        const dx = x - agents[i][0];
        const dy = y - agents[i][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        allUtilities.push(agents[i][2]);
        
        if (dist < minDist) {
          minDist = dist;
          allocatedUtility = agents[i][2];
        }
      }
      
      // Maximin principle (Rawlsian justice): maximize minimum utility
      const minUtility = Math.min(...allUtilities);
      
      // Nash social welfare: product of utilities (geometric mean for visualization)
      const nashWelfare = Math.pow(allUtilities.reduce((a, b) => a * b, 1), 1 / agentCount);
      
      // Combined: Liberty (individual choice) + Justice (fairness)
      const z = (allocatedUtility * c + minUtility * b) * d * (1 + Math.sin(t * 0.6) * 0.1);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 6, b: 1.5, c: 1.0, d: 1.0, uSegments: 72, vSegments: 72 })
  },

  // "LIFE, LIBERTY, AND THE PURSUIT OF HAPPINESS" - Multi-Objective Optimization
  life_liberty_happiness_pareto: {
    name: "🗽 Life, Liberty, Happiness - Pareto Optimality",
    equation: (u, v, params) => {
      const a = params.a ?? 1.5;      // Life (survival) weight
      const b = params.b ?? 1.0;      // Liberty (freedom) weight
      const c = params.c ?? 1.0;      // Happiness (pursuit) weight
      const d = params.d ?? 1.0;      // Lexicographic priority strength
      const t = params.t ?? 0;        // Time for pursuit evolution
      
      const x = (u * 2 - 1) * 3;
      const y = (v * 2 - 1) * 3;
      
      const radius = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Three objectives represented in 120° sectors
      // f1 = Life (survival/health)
      const life = Math.exp(-Math.pow((angle - 0) / 1.5, 2)) * (3 - radius) * a;
      
      // f2 = Liberty (freedom)
      const liberty = Math.exp(-Math.pow((angle - 2.094) / 1.5, 2)) * (3 - radius) * b;
      
      // f3 = Happiness (pursuit, not guarantee)
      // Dynamic programming: V(s,t) = max_a [R(s,a,t) + γ·V(s',t+1)]
      const happiness = Math.exp(-Math.pow((angle - 4.189) / 1.5, 2)) * 
                       (3 - radius) * c * (1 + Math.sin(t * 0.8 + radius) * 0.3);
      
      // Lexicographic ordering: Life > Liberty > Happiness
      let z = life * d;
      if (life > 0.5) {
        z += liberty * d * 0.7;
        if (liberty > 0.5) {
          z += happiness * d * 0.5;
        }
      }
      
      // Pareto frontier visualization (no objective improves without harming another)
      const paretoWave = Math.sin(t * 0.5 + angle * 3) * 0.2;
      
      return [x, y, z + paretoWave];
    },
    defaultParams: getCleanDefaults({ a: 1.5, b: 1.0, c: 1.0, d: 1.0, uSegments: 80, vSegments: 80 })
  },

  // "ONE NATION, INDIVISIBLE" - Minimum Cut Problem
  one_nation_indivisible_mincut: {
    name: "🇺🇸 One Nation Indivisible - Min-Cut Network Flow",
    equation: (u, v, params) => {
      const a = params.a ?? 12;       // Number of network nodes
      const b = params.b ?? 2.0;      // Edge capacity (connectivity strength)
      const c = params.c ?? 1.5;      // Fiedler value (spectral gap)
      const d = params.d ?? 1.0;      // Indivisibility measure
      const t = params.t ?? 0;        // Time for network strength
      
      const nodeCount = Math.max(6, Math.min(16, Math.floor(a)));
      
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Generate interconnected network nodes
      const nodes: Array<[number, number]> = [];
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2 + t * 0.2;
        const layer = Math.floor(i / 4);
        const radius = 1.5 + layer * 0.8;
        nodes.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
      }
      
      // Calculate min-cut capacity (resistance to division)
      let flowCapacity = 0;
      let minDistance = Infinity;
      
      for (let i = 0; i < nodeCount; i++) {
        const dx = x - nodes[i][0];
        const dy = y - nodes[i][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        minDistance = Math.min(minDistance, dist);
        
        // Edge connectivity: κ(G) = minimum edges to disconnect
        for (let j = i + 1; j < nodeCount; j++) {
          const ndx = nodes[j][0] - nodes[i][0];
          const ndy = nodes[j][1] - nodes[i][1];
          const edgeDist = Math.sqrt(ndx * ndx + ndy * ndy);
          
          if (edgeDist < 2.5) {
            const edgeWeight = Math.exp(-dist * 0.5) * Math.exp(-edgeDist * 0.3);
            flowCapacity += edgeWeight * b;
          }
        }
      }
      
      // Higher min-cut → more difficult to divide → higher indivisibility
      // Spectral gap λ2: Large gap means poor partitions only
      const z = flowCapacity * c * d * (1 + Math.sin(t * 0.4) * 0.15);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 12, b: 2.0, c: 1.5, d: 1.0, uSegments: 72, vSegments: 72 })
  },

  // "THE BUCK STOPS HERE" - Terminal Accountability
  buck_stops_here_accountability: {
    name: "💼 The Buck Stops Here - Terminal Decision Authority",
    equation: (u, v, params) => {
      const a = params.a ?? 4;        // Hierarchy levels
      const b = params.b ?? 2.0;      // Accountability accumulation
      const c = params.c ?? 0.8;      // Decay factor β
      const d = params.d ?? 1.5;      // Terminal authority strength
      const t = params.t ?? 0;        // Time for responsibility flow
      
      const levels = Math.max(2, Math.min(6, Math.floor(a)));
      
      const x = (u * 2 - 1) * 3;
      const y = (v * 2 - 1) * 3;
      
      const radius = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Hierarchical pyramid: decisions flow up to terminal point
      const levelHeight = 3 / levels;
      const currentLevel = Math.min(levels - 1, Math.floor(radius / levelHeight));
      
      // Recursive blame attribution (backward pass)
      // Accountability_i = ∂Loss/∂Decision_i + β·Σ Accountability_j
      let accountability = 0;
      for (let i = currentLevel; i < levels; i++) {
        const levelDecay = Math.pow(c, levels - 1 - i);
        accountability += b * levelDecay;
      }
      
      // Terminal level: β = 0 (no passing accountability forward)
      const isTerminal = currentLevel >= levels - 1;
      const terminalBonus = isTerminal ? d : 0;
      
      // Absorbing state in MDP: P(s_terminal | s_k) = 1
      const flowWave = Math.sin(t * 1.5 - radius * 2) * 0.3;
      
      const z = accountability + terminalBonus + flowWave;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 4, b: 2.0, c: 0.8, d: 1.5, uSegments: 72, vSegments: 72 })
  },

  // "WE THE PEOPLE" - Distributed Consensus
  we_the_people_consensus: {
    name: "👥 We the People - Distributed Consensus Algorithm",
    equation: (u, v, params) => {
      const a = params.a ?? 10;       // Number of voters
      const b = params.b ?? 1.5;      // Vote weight variation
      const c = params.c ?? 1.0;      // Consensus convergence rate
      const d = params.d ?? 2.0;      // Byzantine fault tolerance (f)
      const t = params.t ?? 0;        // Time for consensus formation
      
      const voterCount = Math.max(4, Math.min(16, Math.floor(a)));
      
      const x = (u * 2 - 1) * 4;
      const y = (v * 2 - 1) * 4;
      
      // Byzantine fault tolerance: n ≥ 3f + 1
      const faultTolerant = voterCount >= 3 * d + 1;
      
      // Generate voter positions with distributed authority
      const voters: Array<[number, number, number]> = [];
      for (let i = 0; i < voterCount; i++) {
        const angle = (i / voterCount) * Math.PI * 2 + Math.sin(t * 0.3 + i) * 0.5;
        const radius = 2 + Math.cos(t * 0.4 + i * 1.7) * 0.5;
        const weight = b * (0.5 + Math.sin(i * 3.7) * 0.5); // Stake/authority
        voters.push([Math.cos(angle) * radius, Math.sin(angle) * radius, weight]);
      }
      
      // Weighted vote aggregation
      // Decision = argmax_d Σ(w_i · 𝟙(vote_i = d))
      let totalWeight = 0;
      let weightedDecision = 0;
      
      for (let i = 0; i < voterCount; i++) {
        const dx = x - voters[i][0];
        const dy = y - voters[i][1];
        const influence = Math.exp(-(dx * dx + dy * dy) * 0.5);
        const contribution = voters[i][2] * influence;
        
        totalWeight += voters[i][2];
        weightedDecision += contribution;
      }
      
      // Consensus convergence: lim(t→∞) x_i(t) = x̄
      const consensus = weightedDecision * c;
      const convergenceWave = Math.sin(t * 0.5) * 0.2 * (faultTolerant ? 1 : 0.5);
      
      const z = consensus + convergenceWave;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 10, b: 1.5, c: 1.0, d: 2, uSegments: 72, vSegments: 72 })
  },

  // "E PLURIBUS UNUM" - Ensemble Learning (Out of Many, One)
  e_pluribus_unum_ensemble: {
    name: "🎯 E Pluribus Unum - Ensemble Aggregation Method",
    equation: (u, v, params) => {
      const a = params.a ?? 8;        // Number of ensemble members (K)
      const b = params.b ?? 1.0;      // Individual model strength
      const c = params.c ?? 1.5;      // Ensemble boost factor
      const d = params.d ?? 1.0;      // Attention weighting
      const t = params.t ?? 0;        // Time for model evolution
      
      const ensembleSize = Math.max(3, Math.min(12, Math.floor(a)));
      
      const x = (u * 2 - 1) * 3;
      const y = (v * 2 - 1) * 3;
      
      const radius = Math.sqrt(x * x + y * y);
      const angle = Math.atan2(y, x);
      
      // Sub-network outputs: f_k(x; θ_k)
      const subNetworks: number[] = [];
      let totalWeight = 0;
      
      for (let k = 0; k < ensembleSize; k++) {
        const kAngle = (k / ensembleSize) * Math.PI * 2;
        
        // Different perceptual features (color, texture, shape, etc.)
        const feature1 = Math.sin(radius * 2 + kAngle + t * 0.5) * b;
        const feature2 = Math.cos(angle * 3 + kAngle + t * 0.3) * b;
        const featureCombined = (feature1 + feature2) / 2;
        
        // Attention-based weighting: α_k(x)
        const attention = Math.exp(-Math.pow(angle - kAngle, 2) / 2) * d;
        
        subNetworks.push(featureCombined);
        totalWeight += attention;
      }
      
      // Unified prediction: y = Σ(w_k · f_k) or attention-based
      // y = Σ(α_k(x) · f_k(φ_k(x); θ_k))
      let ensemble = 0;
      for (let k = 0; k < ensembleSize; k++) {
        const kAngle = (k / ensembleSize) * Math.PI * 2;
        const attention = Math.exp(-Math.pow(angle - kAngle, 2) / 2) * d;
        ensemble += (attention / totalWeight) * subNetworks[k];
      }
      
      // Ensemble boost: many weak learners → strong predictor
      const z = ensemble * c * (1 + Math.sin(t * 0.6) * 0.15);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ a: 8, b: 1.0, c: 1.5, d: 1.0, uSegments: 80, vSegments: 80 })
  }
};
