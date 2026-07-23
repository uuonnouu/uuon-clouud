
/**
 * BLOCKCHAIN & CRYPTOGRAPHIC ALGORITHMS ENGINE
 * Comprehensive visualization system for consensus mechanisms, cryptographic primitives,
 * and proof systems from the blockchain ecosystem
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';

export interface BlockchainAlgorithm {
  id: string;
  name: string;
  category: 'consensus' | 'cryptographic' | 'proof_systems' | 'layer2' | 'privacy' | 'post_quantum';
  description: string;
  equation: (u: number, v: number, params: SurfaceParameters) => [number, number, number];
  defaultParams: Partial<SurfaceParameters>;
}

/**
 * CONSENSUS MECHANISMS VISUALIZATIONS
 */
export const CONSENSUS_ALGORITHMS: BlockchainAlgorithm[] = [
  {
    id: 'proof_of_work',
    name: 'Proof of Work (PoW)',
    category: 'consensus',
    description: 'Sybil-resistant leader election requiring computational effort - visualized as mining difficulty waves',
    equation: (u, v, params) => {
      const difficulty = params.a ?? 2;
      const hashRate = params.b ?? 1;
      const blockTime = params.c ?? 10;
      
      // Mining difficulty surface with computational waves
      const difficultyWave = Math.sin(u * Math.PI * difficulty) * Math.cos(v * Math.PI * hashRate);
      const networkEffect = Math.exp(-((u - 0.5) ** 2 + (v - 0.5) ** 2) * blockTime);
      
      const x = u * 4 - 2;
      const y = v * 4 - 2;
      const z = difficultyWave * networkEffect * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 2, b: 1, c: 10, uSegments: 64, vSegments: 48 }
  },

  {
    id: 'proof_of_stake',
    name: 'Proof of Stake (PoS)',
    category: 'consensus',
    description: 'Stake-weighted validator selection with randomness beacon - geometric stake distribution',
    equation: (u, v, params) => {
      const stakeWeight = params.a ?? 1.5;
      const randomness = params.b ?? 0.8;
      const slashing = params.c ?? 0.5;
      
      // Stake distribution with VRF randomness
      const stakeField = Math.pow(Math.sin(u * Math.PI * 2), stakeWeight);
      const vrfRandomness = Math.sin(v * Math.PI * 4 + randomness * Math.PI);
      const slashingPenalty = 1 - slashing * Math.exp(-5 * ((u - 0.5) ** 2 + (v - 0.5) ** 2));
      
      const radius = 3 + stakeField * vrfRandomness;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      const x = radius * Math.sin(phi) * Math.cos(theta) * slashingPenalty;
      const y = radius * Math.sin(phi) * Math.sin(theta) * slashingPenalty;
      const z = radius * Math.cos(phi);
      
      return [x, y, z];
    },
    defaultParams: { a: 1.5, b: 0.8, c: 0.5 }
  },

  {
    id: 'pbft_consensus',
    name: 'Practical Byzantine Fault Tolerance (PBFT)',
    category: 'consensus',
    description: 'Three-phase consensus with pre-prepare, prepare, and commit phases',
    equation: (u, v, params) => {
      const nodes = params.a ?? 4; // 3f+1 nodes
      const faultyNodes = params.b ?? 1; // f faulty nodes
      const phase = params.c ?? 1; // Current phase
      
      // BFT network topology with fault tolerance visualization
      const nodeAngle = u * Math.PI * 2 * nodes;
      const phaseRadius = 2 + Math.sin(v * Math.PI * phase) * 0.5;
      const faultTolerance = Math.cos(nodeAngle / nodes) * (1 - faultyNodes / nodes);
      
      const x = phaseRadius * Math.cos(nodeAngle) * faultTolerance;
      const y = phaseRadius * Math.sin(nodeAngle) * faultTolerance;
      const z = Math.sin(v * Math.PI * 2) * Math.abs(faultTolerance);
      
      return [x, y, z];
    },
    defaultParams: { a: 4, b: 1, c: 3 }
  },

  {
    id: 'avalanche_consensus',
    name: 'Avalanche Consensus (Snow Family)',
    category: 'consensus',
    description: 'Metastable consensus through repeated sampling - probabilistic convergence surface',
    equation: (u, v, params) => {
      const sampleSize = params.a ?? 20;
      const confidence = params.b ?? 0.8;
      const threshold = params.c ?? 0.7;
      
      // Metastable dynamics with sampling convergence
      const samplingEffect = Math.tanh(sampleSize * (Math.sin(u * Math.PI * 2) + 1) / 2);
      const confidenceBuildup = Math.pow(confidence, 1 - v);
      const thresholdCrossing = Math.sin(v * Math.PI) > threshold ? 1 : 0.3;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = samplingEffect * confidenceBuildup * thresholdCrossing * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 20, b: 0.8, c: 0.7 }
  }
];

/**
 * CRYPTOGRAPHIC PRIMITIVES VISUALIZATIONS
 */
export const CRYPTOGRAPHIC_ALGORITHMS: BlockchainAlgorithm[] = [
  {
    id: 'merkle_tree',
    name: 'Merkle Tree Structure',
    category: 'cryptographic',
    description: 'Binary tree of cryptographic hashes with logarithmic proof paths',
    equation: (u, v, params) => {
      const treeDepth = params.a ?? 4;
      const leafCount = params.b ?? 16;
      const proofPath = params.c ?? 0.5;
      
      // Tree structure with branching factor
      const level = Math.floor(v * treeDepth);
      const position = u * Math.pow(2, level);
      const nodeValue = Math.sin(position * Math.PI / leafCount);
      
      // Height decreases with tree level
      const height = (treeDepth - level) / treeDepth;
      const pathHighlight = Math.abs(u - proofPath) < 0.1 ? 1.5 : 1;
      
      const x = (u - 0.5) * 4;
      const y = height * 3 * pathHighlight;
      const z = nodeValue * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 4, b: 16, c: 0.5 }
  },

  {
    id: 'sha256_visualization',
    name: 'SHA-256 Hash Function',
    category: 'cryptographic',
    description: 'Cryptographic hash avalanche effect - small input changes create large output differences',
    equation: (u, v, params) => {
      const rounds = params.a ?? 64;
      const avalanche = params.b ?? 2;
      const compression = params.c ?? 1;
      
      // Hash function avalanche effect
      const inputBit = Math.floor(u * 256);
      const hashRound = Math.floor(v * rounds);
      const avalancheEffect = Math.sin(inputBit * avalanche + hashRound * Math.PI / 32);
      const compressionFunction = Math.cos(inputBit / 8 + hashRound / 16) * compression;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const z = avalancheEffect * compressionFunction * 1.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 64, b: 2, c: 1 }
  },

  {
    id: 'elliptic_curve_crypto',
    name: 'Elliptic Curve Cryptography (ECC)',
    category: 'cryptographic',
    description: 'Elliptic curve over finite fields used for ECDSA and key agreement',
    equation: (u, v, params) => {
      const curveParam = params.a ?? 1.7; // Curve parameter
      const fieldSize = params.b ?? 256; // Field size bits
      const basePoint = params.c ?? 1; // Generator point multiplier
      
      // Elliptic curve: y² = x³ + ax + b (simplified for visualization)
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      
      // Map to elliptic curve surface
      const a = curveParam;
      const t = theta / (2 * Math.PI);
      const s = (Math.sin(phi) + 1) / 2;
      
      // Elliptic curve point generation
      const x = Math.cos(theta) * (2 + s * Math.sin(3 * theta));
      const y = Math.sin(theta) * (2 + s * Math.sin(3 * theta));
      const z = Math.sqrt(Math.abs(x * x * x + a * x + basePoint)) * Math.cos(phi);
      
      return [x, y, z * 0.5];
    },
    defaultParams: { a: 1.7, b: 256, c: 1 }
  },

  {
    id: 'vrf_visualization',
    name: 'Verifiable Random Function (VRF)',
    category: 'cryptographic',
    description: 'Pseudorandom output with verifiable proof - randomness with accountability',
    equation: (u, v, params) => {
      const secretKey = params.a ?? 42; // Secret key seed
      const input = params.b ?? 1; // VRF input
      const randomness = params.c ?? 1; // Output randomness
      
      // VRF output surface with verifiable randomness
      const vrfOutput = Math.sin(u * secretKey + input * Math.PI) * Math.cos(v * secretKey + input);
      const proofVerification = Math.sin(u * Math.PI * 2 + v * Math.PI * 2 + secretKey);
      const publicVerifiability = Math.abs(vrfOutput - proofVerification) < 0.1 ? 1.2 : 0.8;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = vrfOutput * randomness * publicVerifiability;
      
      return [x, y, z];
    },
    defaultParams: { a: 42, b: 1, c: 1 }
  }
];

/**
 * ZERO-KNOWLEDGE PROOF SYSTEMS
 */
export const PROOF_SYSTEMS: BlockchainAlgorithm[] = [
  {
    id: 'zk_snark',
    name: 'ZK-SNARK (Groth16)',
    category: 'proof_systems',
    description: 'Succinct non-interactive zero-knowledge proof with trusted setup',
    equation: (u, v, params) => {
      const circuitSize = params.a ?? 1000; // R1CS circuit size
      const setupTrust = params.b ?? 0.9; // Trusted setup parameter
      const succinctness = params.c ?? 0.1; // Proof size factor
      
      // Proof generation surface
      const witnessCommitment = Math.sin(u * Math.PI * 2 + circuitSize / 100);
      const setupPhase = Math.cos(v * Math.PI + setupTrust * Math.PI);
      const proofSize = Math.exp(-succinctness * 10 * v);
      
      const proofHeight = witnessCommitment * setupPhase * proofSize;
      
      const x = (u - 0.5) * 5;
      const y = (v - 0.5) * 5;
      const z = proofHeight * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 1000, b: 0.9, c: 0.1 }
  },

  {
    id: 'zk_stark',
    name: 'ZK-STARK',
    category: 'proof_systems',
    description: 'Scalable transparent zero-knowledge proof without trusted setup',
    equation: (u, v, params) => {
      const polyDegree = params.a ?? 1024; // Polynomial degree
      const transparency = params.b ?? 1; // No trusted setup
      const scalability = params.c ?? 0.8; // Scaling factor
      
      // FRI-based proof structure
      const polynomialTrace = Math.sin(u * polyDegree * Math.PI / 256);
      const merkleCommitment = Math.cos(v * Math.PI * 4);
      const proximityTest = Math.sin(u * v * Math.PI * scalability);
      
      const proofStructure = polynomialTrace * merkleCommitment + proximityTest * transparency;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const z = proofStructure * 1.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 1024, b: 1, c: 0.8 }
  },

  {
    id: 'bulletproofs',
    name: 'Bulletproofs Range Proofs',
    category: 'proof_systems',
    description: 'Short non-interactive range proofs for confidential transactions',
    equation: (u, v, params) => {
      const rangeBits = params.a ?? 64; // Bit range (e.g., 64-bit values)
      const innerProduct = params.b ?? 1; // Inner product argument
      const aggregation = params.c ?? 1; // Batch proof aggregation
      
      // Range proof structure with logarithmic size
      const commitment = Math.sin(u * Math.PI * 2);
      const rangeConstraint = Math.cos(v * Math.PI * rangeBits / 16);
      const proofCompactness = Math.log(rangeBits) / Math.log(2) / 10;
      
      const proofSurface = commitment * rangeConstraint * (1 + proofCompactness);
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = proofSurface * aggregation;
      
      return [x, y, z];
    },
    defaultParams: { a: 64, b: 1, c: 1 }
  }
];

/**
 * LAYER-2 AND SCALING SOLUTIONS
 */
export const LAYER2_ALGORITHMS: BlockchainAlgorithm[] = [
  {
    id: 'optimistic_rollup',
    name: 'Optimistic Rollup',
    category: 'layer2',
    description: 'Layer-2 scaling with fraud proofs and challenge periods',
    equation: (u, v, params) => {
      const batchSize = params.a ?? 1000; // Transactions per batch
      const challengePeriod = params.b ?? 7; // Days for challenge
      const fraudProofSize = params.c ?? 0.1; // Proof size factor
      
      // Rollup state transition surface
      const batchProcessing = Math.sin(u * Math.PI * batchSize / 100);
      const challengeWindow = Math.exp(-v * challengePeriod);
      const fraudDetection = Math.cos(u * v * Math.PI * 4) * fraudProofSize;
      
      const rollupHeight = batchProcessing * challengeWindow + fraudDetection;
      
      const x = (u - 0.5) * 5;
      const y = (v - 0.5) * 5;
      const z = rollupHeight * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 1000, b: 7, c: 0.1 }
  },

  {
    id: 'zk_rollup',
    name: 'ZK-Rollup',
    category: 'layer2',
    description: 'Layer-2 scaling with validity proofs for instant finality',
    equation: (u, v, params) => {
      const batchSize = params.a ?? 2000; // Higher throughput than optimistic
      const proofGenTime = params.b ?? 0.5; // Proof generation overhead
      const instantFinality = params.c ?? 1; // No challenge period
      
      // Validity proof surface
      const stateTransition = Math.sin(u * Math.PI * batchSize / 200);
      const proofGeneration = Math.cos(v * Math.PI * 2 * proofGenTime);
      const finalityConfidence = instantFinality;
      
      const zkHeight = stateTransition * proofGeneration * finalityConfidence;
      
      const x = (u - 0.5) * 5;
      const y = (v - 0.5) * 5;
      const z = zkHeight * 2.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 2000, b: 0.5, c: 1 }
  },

  {
    id: 'lightning_network',
    name: 'Lightning Network',
    category: 'layer2',
    description: 'Payment channel network with HTLC routing',
    equation: (u, v, params) => {
      const channelCapacity = params.a ?? 100; // Channel capacity units
      const routingHops = params.b ?? 3; // Average routing path length
      const liquidityDistribution = params.c ?? 0.8; // Network liquidity factor
      
      // Payment channel network topology
      const networkNodes = Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
      const routingPath = Math.sin(u * v * Math.PI * routingHops);
      const channelBalance = Math.cos(u * Math.PI) * channelCapacity / 20;
      
      const networkHeight = (networkNodes + routingPath) * liquidityDistribution + channelBalance;
      
      const x = (u - 0.5) * 6;
      const y = (v - 0.5) * 6;
      const z = networkHeight;
      
      return [x, y, z];
    },
    defaultParams: { a: 100, b: 3, c: 0.8 }
  }
];

/**
 * PRIVACY ALGORITHMS
 */
export const PRIVACY_ALGORITHMS: BlockchainAlgorithm[] = [
  {
    id: 'ring_signatures',
    name: 'Ring Signatures',
    category: 'privacy',
    description: 'Anonymous signatures within a group of possible signers',
    equation: (u, v, params) => {
      const ringSize = params.a ?? 11; // Number of possible signers
      const anonymitySet = params.b ?? 1; // Anonymity strength
      const unforgeability = params.c ?? 0.9; // Security parameter
      
      // Ring signature structure
      const ringPosition = Math.sin(u * Math.PI * 2 * ringSize / 4);
      const anonymityLevel = Math.cos(v * Math.PI * anonymitySet);
      const securityBound = Math.sin(u * v * Math.PI) * unforgeability;
      
      const ringHeight = ringPosition * anonymityLevel + securityBound;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = ringHeight * 1.5;
      
      return [x, y, z];
    },
    defaultParams: { a: 11, b: 1, c: 0.9 }
  },

  {
    id: 'stealth_addresses',
    name: 'Stealth Addresses',
    category: 'privacy',
    description: 'Unlinkable receiving addresses for transaction privacy',
    equation: (u, v, params) => {
      const scanKey = params.a ?? 1; // Scan key parameter
      const spendKey = params.b ?? 1; // Spend key parameter  
      const unlinkability = params.c ?? 0.95; // Privacy level
      
      // Stealth address generation surface
      const oneTimeAddress = Math.sin(u * Math.PI * scanKey) * Math.cos(v * Math.PI * spendKey);
      const publicUnlinkability = Math.sin(u * v * Math.PI * 2) * unlinkability;
      const recipientDetection = Math.cos(u * Math.PI * 3) * 0.5;
      
      const stealthHeight = oneTimeAddress + publicUnlinkability + recipientDetection;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = stealthHeight;
      
      return [x, y, z];
    },
    defaultParams: { a: 1, b: 1, c: 0.95 }
  }
];

/**
 * POST-QUANTUM ALGORITHMS
 */
export const POST_QUANTUM_ALGORITHMS: BlockchainAlgorithm[] = [
  {
    id: 'dilithium_signatures',
    name: 'Dilithium Post-Quantum Signatures',
    category: 'post_quantum',
    description: 'Lattice-based quantum-resistant digital signatures',
    equation: (u, v, params) => {
      const latticeRank = params.a ?? 256; // Lattice dimension
      const moduleError = params.b ?? 0.1; // Module-LWE error
      const quantumSecurity = params.c ?? 128; // Security bits against quantum attacks
      
      // Lattice-based signature structure
      const latticePoint = Math.sin(u * Math.PI * latticeRank / 32) * Math.cos(v * Math.PI * latticeRank / 32);
      const errorDistribution = Math.exp(-((u - 0.5) ** 2 + (v - 0.5) ** 2) / (2 * moduleError ** 2));
      const quantumResistance = Math.sin(u * v * Math.PI * quantumSecurity / 32);
      
      const signatureHeight = latticePoint * errorDistribution + quantumResistance * 0.5;
      
      const x = (u - 0.5) * 5;
      const y = (v - 0.5) * 5;
      const z = signatureHeight * 2;
      
      return [x, y, z];
    },
    defaultParams: { a: 256, b: 0.1, c: 128 }
  },

  {
    id: 'kyber_encryption',
    name: 'Kyber Post-Quantum Encryption',
    category: 'post_quantum',
    description: 'Lattice-based quantum-resistant public key encryption',
    equation: (u, v, params) => {
      const modulusSize = params.a ?? 3329; // Kyber modulus
      const errorBound = params.b ?? 2; // Error distribution bound
      const securityLevel = params.c ?? 256; // Post-quantum security level
      
      // Module learning with errors surface
      const moduleStructure = Math.sin(u * Math.PI * 2) * Math.cos(v * Math.PI * 2);
      const errorTerm = Math.sin(u * v * Math.PI * errorBound) * 0.3;
      const encryptionSurface = moduleStructure + errorTerm;
      
      const quantumSecurityFactor = Math.cos(u * securityLevel * Math.PI / 128) * 0.2;
      
      const x = (u - 0.5) * 4;
      const y = (v - 0.5) * 4;
      const z = encryptionSurface + quantumSecurityFactor;
      
      return [x, y, z];
    },
    defaultParams: { a: 3329, b: 2, c: 256 }
  }
];

/**
 * COMPLETE BLOCKCHAIN ALGORITHMS REGISTRY
 */
export const ALL_BLOCKCHAIN_ALGORITHMS: BlockchainAlgorithm[] = [
  ...CONSENSUS_ALGORITHMS,
  ...CRYPTOGRAPHIC_ALGORITHMS,
  ...PROOF_SYSTEMS,
  ...LAYER2_ALGORITHMS,
  ...PRIVACY_ALGORITHMS,
  ...POST_QUANTUM_ALGORITHMS
];

/**
 * Get blockchain algorithm by ID
 */
export function getBlockchainAlgorithm(id: string): BlockchainAlgorithm | undefined {
  return ALL_BLOCKCHAIN_ALGORITHMS.find(algo => algo.id === id);
}

/**
 * Get algorithms by category
 */
export function getAlgorithmsByCategory(category: BlockchainAlgorithm['category']): BlockchainAlgorithm[] {
  return ALL_BLOCKCHAIN_ALGORITHMS.filter(algo => algo.category === category);
}

/**
 * Generate algorithm visualization data
 */
export function generateAlgorithmVisualization(
  algorithm: BlockchainAlgorithm,
  customParams?: Partial<SurfaceParameters>
): THREE.BufferGeometry {
  const params = { ...algorithm.defaultParams, ...customParams };
  const uSegments = params.uSegments || 64;
  const vSegments = params.vSegments || 48;
  
  const vertices: number[] = [];
  const indices: number[] = [];
  
  // Generate surface points
  for (let i = 0; i <= uSegments; i++) {
    for (let j = 0; j <= vSegments; j++) {
      const u = i / uSegments;
      const v = j / vSegments;
      
      try {
        const [x, y, z] = algorithm.equation(u, v, params as SurfaceParameters);
        vertices.push(x, y, z);
      } catch (error) {
        // Fallback for invalid points
        vertices.push(0, 0, 0);
      }
    }
  }
  
  // Generate triangular faces
  for (let i = 0; i < uSegments; i++) {
    for (let j = 0; j < vSegments; j++) {
      const a = i * (vSegments + 1) + j;
      const b = a + vSegments + 1;
      const c = a + 1;
      const d = b + 1;
      
      indices.push(a, b, c);
      indices.push(b, d, c);
    }
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  
  return geometry;
}

/**
 * Algorithm performance metrics
 */
export interface AlgorithmMetrics {
  computationalComplexity: string;
  securityAssumptions: string[];
  quantumResistance: 'vulnerable' | 'resistant' | 'quantum_safe';
  scalability: 'low' | 'medium' | 'high';
  energyEfficiency: 'low' | 'medium' | 'high';
}

export const ALGORITHM_METRICS: Record<string, AlgorithmMetrics> = {
  proof_of_work: {
    computationalComplexity: 'O(2^difficulty)',
    securityAssumptions: ['Honest majority hash power', 'Random oracle model'],
    quantumResistance: 'vulnerable',
    scalability: 'low',
    energyEfficiency: 'low'
  },
  proof_of_stake: {
    computationalComplexity: 'O(n) validators',
    securityAssumptions: ['Honest majority stake', 'Weak subjectivity'],
    quantumResistance: 'vulnerable',
    scalability: 'high',
    energyEfficiency: 'high'
  },
  zk_snark: {
    computationalComplexity: 'O(|C|) setup, O(1) verification',
    securityAssumptions: ['Trusted setup', 'Bilinear map hardness'],
    quantumResistance: 'vulnerable',
    scalability: 'high',
    energyEfficiency: 'high'
  },
  dilithium_signatures: {
    computationalComplexity: 'O(n^3) key generation',
    securityAssumptions: ['Module-LWE', 'SIS'],
    quantumResistance: 'quantum_safe',
    scalability: 'medium',
    energyEfficiency: 'medium'
  }
};
