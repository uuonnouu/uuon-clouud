
/**
 * BLOCKCHAIN ALGORITHMS INTEGRATION
 * Seamless integration with existing UUON Foundation mathematical visualization platform
 */

import { SurfaceParameters } from '../types/math';
import { BlockchainAlgorithm, ALL_BLOCKCHAIN_ALGORITHMS } from './blockchainAlgorithmsEngine';

/**
 * Convert blockchain algorithm to standard shape format
 */
export function blockchainToStandardShape(algorithm: BlockchainAlgorithm): any {
  return {
    id: algorithm.id,
    name: algorithm.name,
    category: `blockchain_${algorithm.category}`,
    description: algorithm.description,
    equation: algorithm.equation,
    defaultParams: {
      type: algorithm.id,
      ...algorithm.defaultParams
    },
    tags: ['blockchain', 'cryptography', algorithm.category],
    complexity: getComplexityLevel(algorithm),
    educationalLevel: getEducationalLevel(algorithm)
  };
}

/**
 * Register blockchain algorithms with shape registry
 */
export function registerBlockchainShapes(): any[] {
  return ALL_BLOCKCHAIN_ALGORITHMS.map(blockchainToStandardShape);
}

/**
 * Get algorithm complexity level for UI filtering
 */
function getComplexityLevel(algorithm: BlockchainAlgorithm): 'beginner' | 'intermediate' | 'advanced' {
  const advancedCategories = ['proof_systems', 'post_quantum'];
  const intermediateCategories = ['cryptographic', 'layer2', 'privacy'];
  
  if (advancedCategories.includes(algorithm.category)) return 'advanced';
  if (intermediateCategories.includes(algorithm.category)) return 'intermediate';
  return 'beginner';
}

/**
 * Get educational level recommendation
 */
function getEducationalLevel(algorithm: BlockchainAlgorithm): string {
  const levels: Record<string, string> = {
    consensus: 'Computer Science / Distributed Systems',
    cryptographic: 'Mathematics / Cryptography',
    proof_systems: 'Advanced Mathematics / Theoretical CS',
    layer2: 'Blockchain Engineering',
    privacy: 'Cryptography / Security',
    post_quantum: 'Advanced Cryptography / Quantum Computing'
  };
  
  return levels[algorithm.category] || 'General Computer Science';
}

/**
 * Enhanced parameter mapping for blockchain visualizations
 */
export function enhanceBlockchainParameters(
  algorithm: BlockchainAlgorithm, 
  baseParams: SurfaceParameters
): SurfaceParameters {
  // Add blockchain-specific parameter enhancements
  const enhanced = { ...baseParams };
  
  // Consensus algorithms get time-based animation
  if (algorithm.category === 'consensus') {
    enhanced.t = Date.now() / 1000; // Real-time parameter
    enhanced.animationSpeed = 0.5;
  }
  
  // Cryptographic algorithms get security-based coloring
  if (algorithm.category === 'cryptographic') {
    enhanced.securityLevel = Math.min(enhanced.a || 1, 5); // 1-5 security levels
  }
  
  // Proof systems get complexity visualization
  if (algorithm.category === 'proof_systems') {
    enhanced.proofSize = Math.log(enhanced.a || 1) / 10; // Logarithmic proof size
    enhanced.verificationTime = 1 / (enhanced.b || 1); // Inverse verification complexity
  }
  
  return enhanced;
}

/**
 * Generate educational metadata for blockchain algorithms
 */
export function generateEducationalMetadata(algorithm: BlockchainAlgorithm): any {
  return {
    learningObjectives: generateLearningObjectives(algorithm),
    prerequisites: generatePrerequisites(algorithm),
    difficulty: getComplexityLevel(algorithm),
    estimatedStudyTime: estimateStudyTime(algorithm),
    relatedConcepts: generateRelatedConcepts(algorithm),
    practicalApplications: generatePracticalApplications(algorithm)
  };
}

function generateLearningObjectives(algorithm: BlockchainAlgorithm): string[] {
  const objectives: Record<string, string[]> = {
    consensus: [
      'Understand distributed consensus challenges',
      'Compare trade-offs between different consensus mechanisms',
      'Analyze security assumptions and failure modes'
    ],
    cryptographic: [
      'Master cryptographic primitives and their properties',
      'Understand security proofs and assumptions',
      'Apply cryptographic tools to blockchain systems'
    ],
    proof_systems: [
      'Comprehend zero-knowledge proof concepts',
      'Compare different proof system trade-offs',
      'Design privacy-preserving protocols'
    ]
  };
  
  return objectives[algorithm.category] || ['Understand basic blockchain concepts'];
}

function generatePrerequisites(algorithm: BlockchainAlgorithm): string[] {
  const prerequisites: Record<string, string[]> = {
    consensus: ['Basic distributed systems', 'Network protocols', 'Byzantine failures'],
    cryptographic: ['Number theory', 'Group theory', 'Basic cryptography'],
    proof_systems: ['Advanced mathematics', 'Complexity theory', 'Cryptographic proofs'],
    post_quantum: ['Quantum computing basics', 'Lattice cryptography', 'Advanced algebra']
  };
  
  return prerequisites[algorithm.category] || ['Basic computer science'];
}

function estimateStudyTime(algorithm: BlockchainAlgorithm): string {
  const times: Record<string, string> = {
    consensus: '2-4 hours',
    cryptographic: '3-6 hours',
    proof_systems: '6-12 hours',
    layer2: '4-8 hours',
    privacy: '4-8 hours',
    post_quantum: '8-16 hours'
  };
  
  return times[algorithm.category] || '2-4 hours';
}

function generateRelatedConcepts(algorithm: BlockchainAlgorithm): string[] {
  // Generate related mathematical and computer science concepts
  const related: Record<string, string[]> = {
    consensus: ['Game theory', 'Fault tolerance', 'Leader election'],
    cryptographic: ['Elliptic curves', 'Hash functions', 'Digital signatures'],
    proof_systems: ['Interactive proofs', 'Circuit complexity', 'Polynomial commitments']
  };
  
  return related[algorithm.category] || [];
}

function generatePracticalApplications(algorithm: BlockchainAlgorithm): string[] {
  const applications: Record<string, string[]> = {
    consensus: ['Cryptocurrency networks', 'Distributed databases', 'Consensus protocols'],
    cryptographic: ['Digital wallets', 'Secure communication', 'Authentication systems'],
    proof_systems: ['Privacy coins', 'Verifiable computation', 'Anonymous voting']
  };
  
  return applications[algorithm.category] || [];
}

/**
 * Export all blockchain algorithms as shape registry entries
 */
export const BLOCKCHAIN_SHAPE_REGISTRY = registerBlockchainShapes();

/**
 * Algorithm search and filtering utilities
 */
export class BlockchainAlgorithmSearch {
  static searchByKeyword(keyword: string): BlockchainAlgorithm[] {
    const term = keyword.toLowerCase();
    return ALL_BLOCKCHAIN_ALGORITHMS.filter(algo =>
      algo.name.toLowerCase().includes(term) ||
      algo.description.toLowerCase().includes(term) ||
      algo.category.toLowerCase().includes(term)
    );
  }
  
  static filterByComplexity(level: 'beginner' | 'intermediate' | 'advanced'): BlockchainAlgorithm[] {
    return ALL_BLOCKCHAIN_ALGORITHMS.filter(algo => 
      getComplexityLevel(algo) === level
    );
  }
  
  static filterByCategory(category: BlockchainAlgorithm['category']): BlockchainAlgorithm[] {
    return ALL_BLOCKCHAIN_ALGORITHMS.filter(algo => algo.category === category);
  }
  
  static getRecommendedNext(currentAlgorithm: BlockchainAlgorithm): BlockchainAlgorithm[] {
    // Recommend related algorithms from same or related categories
    const sameCategory = this.filterByCategory(currentAlgorithm.category)
      .filter(algo => algo.id !== currentAlgorithm.id);
    
    const relatedCategories = this.getRelatedCategories(currentAlgorithm.category);
    const relatedAlgos = relatedCategories.flatMap(category => 
      this.filterByCategory(category)
    );
    
    return [...sameCategory.slice(0, 2), ...relatedAlgos.slice(0, 3)];
  }
  
  private static getRelatedCategories(category: BlockchainAlgorithm['category']): BlockchainAlgorithm['category'][] {
    const relations: Record<BlockchainAlgorithm['category'], BlockchainAlgorithm['category'][]> = {
      consensus: ['cryptographic', 'layer2'],
      cryptographic: ['consensus', 'privacy', 'post_quantum'],
      proof_systems: ['cryptographic', 'privacy', 'layer2'],
      layer2: ['consensus', 'proof_systems'],
      privacy: ['cryptographic', 'proof_systems'],
      post_quantum: ['cryptographic', 'proof_systems']
    };
    
    return relations[category] || [];
  }
}
