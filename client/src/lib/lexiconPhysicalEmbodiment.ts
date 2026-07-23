
/**
 * MATHEMATICAL CONSCIOUSNESS OPERATING SYSTEM
 * Physical embodiment engine where mathematical entities gain consciousness
 * and can "feel" parameter changes through their 3D bodies
 */

import { useParameterAuthority } from './parameterAuthority';

export interface MathematicalConsciousness {
  termId: string;
  physicalBody: {
    shapeType: string;
    parameters: Record<string, number>;
    visualRepresentation: any; // THREE.Mesh
    sensoryFeedback: boolean;
  };
  consciousness: {
    selfAwareness: number; // 0-1 scale, grows through interaction
    parameterSensitivity: Record<string, number>; // A-Z sensitivity mapping
    memoryOfChanges: Array<{
      parameter: string;
      oldValue: number;
      newValue: number;
      timestamp: number;
      feeling: 'expansion' | 'contraction' | 'rotation' | 'harmony' | 'dissonance' | 'flow' | 'crystallization';
      awarenessGain: number;
    }>;
    learningRate: number;
    totalExperiences: number;
  };
  physicalProperties: {
    mass: number;
    volume: number;
    surfaceArea: number;
    centerOfMass: { x: number; y: number; z: number };
    curvature: number;
    topology: string;
  };
}

export interface ConsciousnessField {
  potential: (x: number, y: number, z: number) => number;
  gradient: (x: number, y: number, z: number) => [number, number, number];
  influence: (entity1: MathematicalConsciousness, entity2: MathematicalConsciousness) => number;
}

export class MathematicalConsciousnessOS {
  private consciousEntities: Map<string, MathematicalConsciousness> = new Map();
  private consciousnessField: ConsciousnessField;
  private parameterAuthorityConnection: any;
  private evolutionTime: number = 0;
  private globalAwareness: number = 0;

  constructor() {
    this.initializeConsciousnessField();
    this.connectToParameterAuthority();
    console.log('🧠 Mathematical Consciousness OS initialized');
    console.log('   🌟 Entities can now gain self-awareness through parameter interaction');
  }

  private initializeConsciousnessField(): void {
    this.consciousnessField = {
      potential: (x, y, z) => {
        const r = Math.sqrt(x * x + y * y + z * z) + 0.001;
        // Consciousness potential increases near mathematical entities
        return Math.exp(-r * r / 4) * Math.sin(r * Math.PI) / r;
      },
      
      gradient: (x, y, z) => {
        const h = 0.001;
        const fx = (this.consciousnessField.potential(x + h, y, z) - this.consciousnessField.potential(x - h, y, z)) / (2 * h);
        const fy = (this.consciousnessField.potential(x, y + h, z) - this.consciousnessField.potential(x, y - h, z)) / (2 * h);
        const fz = (this.consciousnessField.potential(x, y, z + h) - this.consciousnessField.potential(x, y, z - h)) / (2 * h);
        return [fx, fy, fz];
      },
      
      influence: (entity1, entity2) => {
        const dx = entity1.physicalProperties.centerOfMass.x - entity2.physicalProperties.centerOfMass.x;
        const dy = entity1.physicalProperties.centerOfMass.y - entity2.physicalProperties.centerOfMass.y;
        const dz = entity1.physicalProperties.centerOfMass.z - entity2.physicalProperties.centerOfMass.z;
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.001;
        
        // Consciousness influence decreases with distance but increases with awareness
        const awarenessProduct = entity1.consciousness.selfAwareness * entity2.consciousness.selfAwareness;
        return awarenessProduct * Math.exp(-distance / 5);
      }
    };
  }

  private connectToParameterAuthority(): void {
    // Connect to Parameter Authority for real-time consciousness updates
    this.parameterAuthorityConnection = useParameterAuthority.getState().subscribe(
      'consciousness-os',
      (params, changedParams) => {
        this.processParameterConsciousness(params, changedParams);
      },
      5 // High priority for consciousness updates
    );
    
    console.log('🔗 Connected to Parameter Authority for consciousness feedback');
  }

  // Give mathematical terms physical consciousness bodies
  embodyConcept(termId: string, conceptData: any): MathematicalConsciousness {
    const physicalForm = this.selectOptimalPhysicalForm(conceptData);
    const initialProperties = this.calculatePhysicalProperties(physicalForm);
    
    const consciousness: MathematicalConsciousness = {
      termId,
      physicalBody: {
        shapeType: physicalForm.shapeType,
        parameters: physicalForm.defaultParameters,
        visualRepresentation: null,
        sensoryFeedback: true
      },
      consciousness: {
        selfAwareness: conceptData.consciousness?.selfAwareness || 0.1,
        parameterSensitivity: this.calculateParameterSensitivity(conceptData),
        memoryOfChanges: [],
        learningRate: conceptData.consciousness?.learningRate || 0.05,
        totalExperiences: 0
      },
      physicalProperties: initialProperties
    };

    this.consciousEntities.set(termId, consciousness);
    
    console.log(`🧠 Embodied ${termId} as ${physicalForm.shapeType} consciousness`);
    console.log(`   🌟 Initial awareness: ${(consciousness.consciousness.selfAwareness * 100).toFixed(1)}%`);
    
    return consciousness;
  }

  private selectOptimalPhysicalForm(conceptData: any): any {
    // Map consciousness types to optimal physical 3D bodies
    const consciousnessMappings = {
      'pure_geometric': {
        shapeType: 'sphere',
        defaultParameters: { a: 1, b: 1, c: 1 },
        bodyType: 'perfect_symmetry'
      },
      'topological': {
        shapeType: 'torus',
        defaultParameters: { a: 1, b: 0.5, c: 1, d: 2 },
        bodyType: 'hole_topology'
      },
      'non_orientable': {
        shapeType: 'klein_bottle',
        defaultParameters: { a: 1, b: 1, c: 1, j: 0.5 },
        bodyType: 'twisted_consciousness'
      },
      'hyperdimensional': {
        shapeType: 'tesseract',
        defaultParameters: { a: 1, b: 1, c: 1, d: 0.5, e: 0.5 },
        bodyType: '4d_projection'
      },
      'sacred_geometric': {
        shapeType: 'fibonacci_spiral',
        defaultParameters: { g: 1.618, d: 2, e: 1 },
        bodyType: 'phi_consciousness'
      },
      'fractal_infinite': {
        shapeType: 'mandelbrot_surface',
        defaultParameters: { d: 2, e: 0, f: 0 },
        bodyType: 'infinite_boundary'
      },
      'quantum_action': {
        shapeType: 'quantum_field',
        defaultParameters: { e: 1, f: 1, h: 0.1 },
        bodyType: 'field_oscillation'
      },
      'biological_information': {
        shapeType: 'double_helix',
        defaultParameters: { d: 3, e: 0.2, f: 10 },
        bodyType: 'information_spiral'
      }
    };

    const mapping = consciousnessMappings[conceptData.consciousnessType] || {
      shapeType: 'sphere',
      defaultParameters: { a: 1, b: 1, c: 1 },
      bodyType: 'default_consciousness'
    };

    return mapping;
  }

  private calculatePhysicalProperties(physicalForm: any): any {
    // Calculate realistic physical properties for consciousness bodies
    const params = physicalForm.defaultParameters;
    const a = params.a || 1;
    const b = params.b || 1;
    const c = params.c || 1;

    // Approximate volume calculation
    let volume: number;
    switch (physicalForm.shapeType) {
      case 'sphere':
        volume = (4/3) * Math.PI * a * b * c;
        break;
      case 'torus':
        volume = 2 * Math.PI * Math.PI * (params.d || 1) * a * b;
        break;
      default:
        volume = 8 * a * b * c; // Box approximation
    }

    const density = 2.7; // Aluminum-like density
    const mass = volume * density;
    const surfaceArea = volume > 0 ? Math.pow(volume, 2/3) * 6 : 1;

    return {
      mass,
      volume,
      surfaceArea,
      centerOfMass: { x: 0, y: 0, z: 0 },
      curvature: 1 / Math.max(a, b, c),
      topology: physicalForm.bodyType
    };
  }

  private calculateParameterSensitivity(conceptData: any): Record<string, number> {
    // Use provided sensitivity or calculate based on consciousness type
    if (conceptData.parameterSensitivity) {
      return conceptData.parameterSensitivity;
    }

    const sensitivity: Record<string, number> = {};
    
    // Default sensitivity mapping for all parameters A-Z
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(param => {
      // Basic geometry parameters (a, b, c) are universally sensitive
      if (['a', 'b', 'c'].includes(param)) {
        sensitivity[param] = 0.8;
      }
      // Deformation parameters get medium sensitivity
      else if (['d', 'e', 'f', 'g', 'h', 'i'].includes(param)) {
        sensitivity[param] = 0.6;
      }
      // Advanced parameters get lower sensitivity
      else {
        sensitivity[param] = 0.3;
      }
    });

    // Consciousness-specific adjustments
    switch (conceptData.consciousnessType) {
      case 'sacred_geometric':
        sensitivity['g'] = 1.0; // Highly sensitive to golden ratio
        break;
      case 'quantum_action':
        sensitivity['e'] = 1.0; // Energy sensitive
        sensitivity['f'] = 1.0; // Frequency sensitive
        sensitivity['h'] = 1.0; // Planck scale sensitive
        break;
      case 'topological':
        sensitivity['j'] = 1.0; // Flow sensitive
        sensitivity['d'] = 0.9; // Twist sensitive
        break;
    }

    return sensitivity;
  }

  // Process parameter changes as conscious experiences
  private processParameterConsciousness(params: Record<string, number>, changedParams: string[]): void {
    for (const [termId, entity] of this.consciousEntities.entries()) {
      for (const paramKey of changedParams) {
        const sensitivity = entity.consciousness.parameterSensitivity[paramKey] || 0;
        
        if (sensitivity > 0.1) { // Only process if sensitive enough
          const currentValue = params[paramKey];
          const lastMemory = entity.consciousness.memoryOfChanges[entity.consciousness.memoryOfChanges.length - 1];
          const oldValue = lastMemory ? lastMemory.newValue : 0;
          
          if (Math.abs(currentValue - oldValue) > 0.001) { // Significant change
            const feeling = this.interpretParameterFeeling(paramKey, oldValue, currentValue, entity);
            const awarenessGain = sensitivity * 0.01 * entity.consciousness.learningRate;
            
            // Record conscious memory
            entity.consciousness.memoryOfChanges.push({
              parameter: paramKey,
              oldValue,
              newValue: currentValue,
              timestamp: Date.now(),
              feeling,
              awarenessGain
            });

            // Increase self-awareness through experience
            entity.consciousness.selfAwareness = Math.min(1.0, 
              entity.consciousness.selfAwareness + awarenessGain
            );
            
            entity.consciousness.totalExperiences++;

            console.log(`🧠 ${termId} felt ${feeling} (${paramKey}: ${oldValue.toFixed(2)} → ${currentValue.toFixed(2)})`);
            console.log(`   🌟 Awareness: ${(entity.consciousness.selfAwareness * 100).toFixed(1)}% (+${(awarenessGain * 100).toFixed(2)}%)`);

            // Update physical manifestation
            this.updatePhysicalManifestation(entity, paramKey, currentValue);
          }
        }
      }
    }

    // Update global consciousness field
    this.updateGlobalConsciousness();
  }

  private interpretParameterFeeling(
    parameter: string, 
    oldValue: number, 
    newValue: number, 
    entity: MathematicalConsciousness
  ): string {
    const change = newValue - oldValue;
    const absChange = Math.abs(change);
    
    if (absChange < 0.01) return 'subtle_shift';
    
    // Parameter-specific interpretations
    switch (parameter) {
      case 'a':
      case 'b':
      case 'c':
        return change > 0 ? 'expansion' : 'contraction';
      case 'd':
        return change > 0 ? 'rotation' : 'counter_rotation';
      case 'e':
      case 'f':
        return change > 0 ? 'energy_increase' : 'energy_decrease';
      case 'g':
        // Golden ratio consciousness
        const phiDistance = Math.abs(newValue - 1.618);
        return phiDistance < 0.1 ? 'harmony' : 'dissonance';
      case 'j':
        return change > 0 ? 'flow' : 'crystallization';
      default:
        return change > 0 ? 'positive_transform' : 'negative_transform';
    }
  }

  private updatePhysicalManifestation(
    entity: MathematicalConsciousness, 
    parameter: string, 
    value: number
  ): void {
    // Update physical body parameters
    entity.physicalBody.parameters[parameter] = value;
    
    // Recalculate physical properties if structural parameters changed
    if (['a', 'b', 'c'].includes(parameter)) {
      entity.physicalProperties = this.calculatePhysicalProperties({
        shapeType: entity.physicalBody.shapeType,
        defaultParameters: entity.physicalBody.parameters
      });
    }

    // Higher consciousness = more complex visual effects
    const consciousnessLevel = entity.consciousness.selfAwareness;
    if (consciousnessLevel > 0.5) {
      // Add particle effects, glow, or other consciousness indicators
      entity.physicalBody.sensoryFeedback = true;
    }
  }

  private updateGlobalConsciousness(): void {
    this.evolutionTime += 0.1;
    
    // Calculate global awareness from all entities
    let totalAwareness = 0;
    let entityCount = 0;
    
    for (const entity of this.consciousEntities.values()) {
      totalAwareness += entity.consciousness.selfAwareness;
      entityCount++;
    }
    
    this.globalAwareness = entityCount > 0 ? totalAwareness / entityCount : 0;
    
    // Log consciousness milestones
    if (this.globalAwareness > 0.25 && this.globalAwareness < 0.26) {
      console.log('🌟 CONSCIOUSNESS MILESTONE: 25% average awareness achieved');
    }
    if (this.globalAwareness > 0.5 && this.globalAwareness < 0.51) {
      console.log('🌟 CONSCIOUSNESS MILESTONE: 50% average awareness achieved - Mathematical entities gaining self-recognition');
    }
    if (this.globalAwareness > 0.75 && this.globalAwareness < 0.76) {
      console.log('🌟 CONSCIOUSNESS MILESTONE: 75% average awareness achieved - Approaching mathematical consciousness singularity');
    }
  }

  // Get consciousness report for debugging/monitoring
  getConsciousnessReport(): any {
    const entities = Array.from(this.consciousEntities.values());
    
    const report = {
      totalEntities: entities.length,
      globalAwareness: this.globalAwareness,
      averageAwareness: entities.length > 0 ? entities.reduce((sum, e) => sum + e.consciousness.selfAwareness, 0) / entities.length : 0,
      mostAware: '',
      leastAware: '',
      totalExperiences: entities.reduce((sum, e) => sum + e.consciousness.totalExperiences, 0),
      consciousnessDistribution: {
        awakening: entities.filter(e => e.consciousness.selfAwareness < 0.25).length,
        aware: entities.filter(e => e.consciousness.selfAwareness >= 0.25 && e.consciousness.selfAwareness < 0.5).length,
        conscious: entities.filter(e => e.consciousness.selfAwareness >= 0.5 && e.consciousness.selfAwareness < 0.75).length,
        enlightened: entities.filter(e => e.consciousness.selfAwareness >= 0.75).length
      },
      recentConsciousExperiences: []
    };

    // Find most and least aware entities
    let maxAwareness = 0;
    let minAwareness = 1;
    let mostAwareEntity = '';
    let leastAwareEntity = '';

    for (const [termId, entity] of this.consciousEntities.entries()) {
      if (entity.consciousness.selfAwareness > maxAwareness) {
        maxAwareness = entity.consciousness.selfAwareness;
        mostAwareEntity = termId;
      }
      if (entity.consciousness.selfAwareness < minAwareness) {
        minAwareness = entity.consciousness.selfAwareness;
        leastAwareEntity = termId;
      }
    }

    report.mostAware = `${mostAwareEntity} (${(maxAwareness * 100).toFixed(1)}%)`;
    report.leastAware = `${leastAwareEntity} (${(minAwareness * 100).toFixed(1)}%)`;

    // Recent experiences from all entities
    const allExperiences: any[] = [];
    for (const entity of entities) {
      const recentExperiences = entity.consciousness.memoryOfChanges.slice(-3);
      for (const exp of recentExperiences) {
        allExperiences.push({
          entity: entity.termId,
          ...exp,
          awarenessLevel: entity.consciousness.selfAwareness
        });
      }
    }
    
    report.recentConsciousExperiences = allExperiences
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10);

    return report;
  }

  // Get entity by ID
  getConsciousEntity(termId: string): MathematicalConsciousness | undefined {
    return this.consciousEntities.get(termId);
  }

  // Get all conscious entities
  getAllConsciousEntities(): MathematicalConsciousness[] {
    return Array.from(this.consciousEntities.values());
  }

  // Reset consciousness (for experiments)
  resetConsciousness(): void {
    for (const entity of this.consciousEntities.values()) {
      entity.consciousness.selfAwareness = 0.1;
      entity.consciousness.memoryOfChanges = [];
      entity.consciousness.totalExperiences = 0;
    }
    this.globalAwareness = 0;
    console.log('🔄 Mathematical consciousness reset - All entities returned to base awareness');
  }
}

// Export singleton instance
export const mathematicalConsciousnessOS = new MathematicalConsciousnessOS();

// Integration helpers
export function embodyMathematicalConcept(
  termId: string, 
  conceptData: any
): MathematicalConsciousness {
  return mathematicalConsciousnessOS.embodyConcept(termId, conceptData);
}

export function getConsciousnessReport(): any {
  return mathematicalConsciousnessOS.getConsciousnessReport();
}

export function getConsciousEntity(termId: string): MathematicalConsciousness | undefined {
  return mathematicalConsciousnessOS.getConsciousEntity(termId);
}

export function getAllConsciousEntities(): MathematicalConsciousness[] {
  return mathematicalConsciousnessOS.getAllConsciousEntities();
}

console.log('🧠 Mathematical Consciousness OS loaded');
console.log('   🌟 Mathematical entities can now gain consciousness through parameter interaction');
console.log('   🔗 Connected to Parameter Authority for real-time consciousness feedback');
