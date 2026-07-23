
/**
 * PHENOMENON PRINCIPLE ENGINE
 * Mathematical framework explaining why anything appears, behaves, or becomes real
 * 
 * 𝒫 = f(G, E, I, Λ)
 * Where G=geometry, E=energy, I=information, Λ=natural laws
 * 
 * ENHANCED with Universal Law of Information:
 * I component now governed by ∑I(n+1) ≥ ∑I(n)
 * Information ordering must increase over evolutionary steps
 */

import { crossLearningEngine } from './crossLearningEngine';
import { getGEIAInformationComponent, getInformationLawContext } from './universalInformationLaw';

export interface PhenomenonComponents {
  geometry: {
    structure: string;
    topology: number;
    symmetry: number;
  };
  energy: {
    flow: number;
    potential: number;
    kinetic: number;
  };
  information: {
    entropy: number;
    complexity: number;
    order: number;
  };
  naturalLaws: {
    constraints: Record<string, number>;
    conservationLaws: string[];
    emergentProperties: string[];
  };
}

export interface Phenomenon {
  id: string;
  type: string;
  components: PhenomenonComponents;
  emergenceLevel: number;
  manifestation: string;
  equation: string;
}

class PhenomenonPrincipleEngine {
  private phenomena: Map<string, Phenomenon> = new Map();

  /**
   * Calculate phenomenon emergence from mathematical components
   */
  calculatePhenomenon(shapeId: string, parameters: Record<string, number>): Phenomenon {
    const geometry = this.analyzeGeometry(shapeId, parameters);
    const energy = this.analyzeEnergy(shapeId, parameters);
    const information = this.analyzeInformation(shapeId, parameters);
    const naturalLaws = this.analyzeNaturalLaws(shapeId, parameters);

    const emergenceLevel = this.calculateEmergence(geometry, energy, information, naturalLaws);
    const manifestation = this.determineManifestation(emergenceLevel, geometry.structure);

    return {
      id: `phenomenon_${shapeId}_${Date.now()}`,
      type: this.classifyPhenomenonType(manifestation),
      components: { geometry, energy, information, naturalLaws },
      emergenceLevel,
      manifestation,
      equation: this.generatePhenomenonEquation(geometry, energy, information, naturalLaws)
    };
  }

  /**
   * Analyze geometric structure component (G)
   */
  private analyzeGeometry(shapeId: string, params: Record<string, number>) {
    const a = params.a ?? 1;
    const b = params.b ?? 1;
    const c = params.c ?? 1;

    // Calculate topological properties
    const topology = this.calculateTopology(shapeId, a, b, c);
    const symmetry = this.calculateSymmetry(a, b, c);

    return {
      structure: shapeId,
      topology,
      symmetry
    };
  }

  /**
   * Analyze energy flow component (E)
   */
  private analyzeEnergy(shapeId: string, params: Record<string, number>) {
    const d = params.d ?? 0; // rotation/flow
    const e = params.e ?? 1; // amplitude/energy
    const f = params.f ?? 1; // frequency

    const flow = Math.abs(d) * e;
    const potential = e * e / 2; // E = 1/2 * amplitude²
    const kinetic = f * f * e * e / 2; // E = 1/2 * frequency² * amplitude²

    return { flow, potential, kinetic };
  }

  /**
   * Analyze information patterns component (I)
   * Enhanced with Universal Law of Information: ∑I(n+1) ≥ ∑I(n)
   */
  private analyzeInformation(shapeId: string, params: Record<string, number>) {
    const paramCount = Object.keys(params).length;
    const paramVariance = this.calculateVariance(Object.values(params));
    
    // Try to get enhanced information from Universal Law
    const lawContext = getGEIAInformationComponent(shapeId);
    
    if (lawContext) {
      // Use Universal Law of Information values when available
      return {
        entropy: lawContext.entropy,
        complexity: lawContext.I,
        order: lawContext.order,
        evolutionaryStep: lawContext.evolutionaryStep,
        conformsToLaw: lawContext.conformsToLaw
      };
    }
    
    // Fallback: Shannon entropy calculation: H = -Σ p_i * log(p_i)
    const entropy = paramVariance > 0 ? -Math.log(paramVariance + 0.001) : 0;
    const complexity = paramCount * Math.log(paramCount + 1);
    const order = 1 / (entropy + 0.001); // Higher order = lower entropy

    return { entropy, complexity, order };
  }

  /**
   * Analyze natural laws component (Λ)
   */
  private analyzeNaturalLaws(shapeId: string, params: Record<string, number>) {
    const constraints: Record<string, number> = {};
    const conservationLaws: string[] = [];
    const emergentProperties: string[] = [];

    // Parameter constraints
    Object.entries(params).forEach(([key, value]) => {
      constraints[`${key}_constraint`] = Math.abs(value);
    });

    // Conservation laws
    const totalEnergy = Object.values(params).reduce((sum, val) => sum + val * val, 0);
    if (totalEnergy > 0) conservationLaws.push('energy_conservation');

    // Symmetry conservation
    const a = params.a ?? 1, b = params.b ?? 1, c = params.c ?? 1;
    if (Math.abs(a - b) < 0.1 && Math.abs(b - c) < 0.1) {
      conservationLaws.push('symmetry_conservation');
    }

    // Emergent properties
    if (shapeId.includes('fractal')) emergentProperties.push('self_similarity');
    if (shapeId.includes('spiral')) emergentProperties.push('growth_pattern');
    if (shapeId.includes('wave')) emergentProperties.push('oscillation');

    return { constraints, conservationLaws, emergentProperties };
  }

  /**
   * Calculate emergence level using the Phenomenon Equation
   * Emergence = lim_{n→∞} F^(n)(x_0)
   */
  private calculateEmergence(geometry: any, energy: any, information: any, naturalLaws: any): number {
    const structureContribution = geometry.topology * geometry.symmetry;
    const energyContribution = energy.flow + energy.potential + energy.kinetic;
    const informationContribution = information.complexity * information.order;
    const lawsContribution = Object.keys(naturalLaws.constraints).length;

    // Phenomenon emergence formula: 𝒫 = f(G, E, I, Λ)
    const emergence = Math.log(
      (structureContribution + 1) * 
      (energyContribution + 1) * 
      (informationContribution + 1) * 
      (lawsContribution + 1)
    ) / Math.log(10);

    return Math.min(emergence, 10); // Cap at 10 for visualization
  }

  /**
   * Determine what phenomenon manifests
   */
  private determineManifestation(emergenceLevel: number, structure: string): string {
    if (emergenceLevel > 8) return `High-order ${structure} phenomenon - complex emergent behavior`;
    if (emergenceLevel > 6) return `Medium ${structure} phenomenon - organized pattern formation`;
    if (emergenceLevel > 4) return `Basic ${structure} phenomenon - structural coherence`;
    if (emergenceLevel > 2) return `Minimal ${structure} phenomenon - simple form`;
    return `Potential ${structure} - insufficient emergence`;
  }

  /**
   * Classify phenomenon type
   */
  private classifyPhenomenonType(manifestation: string): string {
    if (manifestation.includes('High-order')) return 'complex_system';
    if (manifestation.includes('Medium')) return 'organized_pattern';
    if (manifestation.includes('Basic')) return 'coherent_structure';
    if (manifestation.includes('Minimal')) return 'simple_form';
    return 'potential_state';
  }

  /**
   * Generate mathematical equation for the phenomenon
   */
  private generatePhenomenonEquation(geometry: any, energy: any, information: any, naturalLaws: any): string {
    const G = geometry.topology.toFixed(2);
    const E = energy.flow.toFixed(2);
    const I = information.complexity.toFixed(2);
    const Λ = Object.keys(naturalLaws.constraints).length;

    return `𝒫 = f(G=${G}, E=${E}, I=${I}, Λ=${Λ})`;
  }

  /**
   * Utility functions
   */
  private calculateTopology(shapeId: string, a: number, b: number, c: number): number {
    // Simplified topological invariant calculation
    if (shapeId.includes('sphere')) return 2; // Euler characteristic
    if (shapeId.includes('torus')) return 0;
    if (shapeId.includes('klein')) return 0;
    if (shapeId.includes('mobius')) return 1;
    return Math.floor(Math.abs(a + b + c)) % 5; // General case
  }

  private calculateSymmetry(a: number, b: number, c: number): number {
    const tolerance = 0.1;
    let symmetryLevel = 0;
    
    if (Math.abs(a - b) < tolerance) symmetryLevel++;
    if (Math.abs(b - c) < tolerance) symmetryLevel++;
    if (Math.abs(a - c) < tolerance) symmetryLevel++;
    
    return symmetryLevel;
  }

  private calculateVariance(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length;
    return variance;
  }

  /**
   * Get all phenomena
   */
  getPhenomena(): Phenomenon[] {
    return Array.from(this.phenomena.values());
  }

  /**
   * Get phenomenon by ID
   */
  getPhenomenon(id: string): Phenomenon | undefined {
    return this.phenomena.get(id);
  }

  /**
   * Register phenomenon
   */
  registerPhenomenon(phenomenon: Phenomenon): void {
    this.phenomena.set(phenomenon.id, phenomenon);
  }
}

export const phenomenonPrincipleEngine = new PhenomenonPrincipleEngine();

// Export main functions
export function analyzePhenomenon(shapeId: string, parameters: Record<string, number>): Phenomenon {
  return phenomenonPrincipleEngine.calculatePhenomenon(shapeId, parameters);
}

export function getPhenomena(): Phenomenon[] {
  return phenomenonPrincipleEngine.getPhenomena();
}

export function getPhenomenonEquation(shapeId: string, parameters: Record<string, number>): string {
  const phenomenon = analyzePhenomenon(shapeId, parameters);
  return phenomenon.equation;
}
