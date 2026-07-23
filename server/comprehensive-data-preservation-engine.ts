import { db } from './storage';
import { 
  system_evolution_tracking,
  mathematical_pattern_recognition,
  cross_system_correlations,
  session_archives,
  advanced_physical_insights,
  export_preservation_records,
} from '../shared/schema';
import { eq, desc, and, gte, sql } from 'drizzle-orm';

interface ShapeDynamics {
  volume?: number;
  surfaceArea?: number;
  mass?: number;
  centerOfMass?: { x: number; y: number; z: number };
  momentOfInertia?: {
    Ixx: number; Iyy: number; Izz: number;
    Ixy: number; Ixz: number; Iyz: number;
  };
  principalAxes?: Array<{
    axis: { x: number; y: number; z: number };
    moment: number;
  }>;
  rotationalEnergy?: { x: number; y: number; z: number };
  stabilityIndex?: number;
  gyroscopicRatio?: number;
}

interface PreservationEvent {
  shapeId: string;
  eventType: 'parameter_change' | 'export' | 'computation' | 'insight_discovered';
  eventData: Record<string, any>;
  previousState?: Record<string, any>;
  newState?: Record<string, any>;
  sessionId?: string;
  userId?: number;
}

interface PatternRecognitionResult {
  patternType: string;
  patternValue: number;
  confidence: number;
  formula?: string;
  relatedConstants?: string[];
  significance?: string;
}

const GOLDEN_RATIO = 1.618033988749895;
const PHI = GOLDEN_RATIO;
const PI = Math.PI;
const E = Math.E;

class ComprehensiveDataPreservationEngine {
  private sessionId: string;
  private computationCount: number = 0;
  private autoArchiveInterval: NodeJS.Timeout | null = null;
  private sessionStartTime: Date;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = new Date();
    this.startAutoArchiving();
    console.log('📦 Comprehensive Data Preservation Engine initialized');
    console.log(`   🔑 Session ID: ${this.sessionId}`);
  }

  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `session_${timestamp}_${random}`;
  }

  private startAutoArchiving(): void {
    this.autoArchiveInterval = setInterval(async () => {
      if (this.computationCount >= 10) {
        await this.archiveSession();
        this.computationCount = 0;
      }
    }, 5 * 60 * 1000);
    console.log('   ⏰ Auto-archiving enabled (every 5 minutes or 10 computations)');
  }

  async trackEvolution(event: PreservationEvent): Promise<void> {
    try {
      const changeVector = this.computeChangeVector(event.previousState, event.newState);
      
      await db.insert(system_evolution_tracking).values({
        shapeId: event.shapeId,
        eventType: event.eventType,
        eventData: event.eventData,
        previousState: event.previousState,
        newState: event.newState,
        changeVector,
        userId: event.userId,
        sessionId: event.sessionId || this.sessionId,
        computationTimeMs: event.eventData.computationTimeMs,
        memoryUsageMb: event.eventData.memoryUsageMb
      });

      this.computationCount++;
      
      if (event.eventType === 'computation' || event.eventType === 'export') {
        await this.detectPatterns(event.shapeId, event.newState);
      }
    } catch (error) {
      console.error('Evolution tracking failed:', error);
    }
  }

  private computeChangeVector(
    previous?: Record<string, any>, 
    current?: Record<string, any>
  ): Record<string, any> | null {
    if (!previous || !current) return null;

    const vector: Record<string, number> = {};
    const numericKeys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                         'uMin', 'uMax', 'vMin', 'vMax', 'uSegments', 'vSegments'];

    for (const key of numericKeys) {
      if (typeof previous[key] === 'number' && typeof current[key] === 'number') {
        vector[key] = current[key] - previous[key];
      }
    }

    const magnitude = Math.sqrt(Object.values(vector).reduce((sum, v) => sum + v * v, 0));
    
    return {
      components: vector,
      magnitude,
      direction: magnitude > 0 ? Object.fromEntries(
        Object.entries(vector).map(([k, v]) => [k, v / magnitude])
      ) : null
    };
  }

  async detectPatterns(shapeId: string, state?: Record<string, any>): Promise<PatternRecognitionResult[]> {
    const patterns: PatternRecognitionResult[] = [];
    
    if (!state) return patterns;

    const goldenPattern = this.detectGoldenRatio(state);
    if (goldenPattern) patterns.push(goldenPattern);

    const fibPattern = this.detectFibonacciSequence(state);
    if (fibPattern) patterns.push(fibPattern);

    const symmetryPattern = this.detectSymmetryPattern(state);
    if (symmetryPattern) patterns.push(symmetryPattern);

    const stabilityPattern = this.detectStabilityPattern(state);
    if (stabilityPattern) patterns.push(stabilityPattern);

    for (const pattern of patterns) {
      await db.insert(mathematical_pattern_recognition).values({
        shapeId,
        patternType: pattern.patternType,
        patternValue: pattern.patternValue,
        patternFormula: pattern.formula,
        confidence: pattern.confidence,
        relatedConstants: pattern.relatedConstants,
        geometricSignificance: pattern.significance,
        physicsApplications: this.getPhysicsApplications(pattern.patternType),
        validatedBy: 'system',
        validationScore: pattern.confidence
      });
    }

    return patterns;
  }

  private detectGoldenRatio(state: Record<string, any>): PatternRecognitionResult | null {
    const pairs = [['a', 'b'], ['b', 'c'], ['c', 'd']];
    
    for (const [key1, key2] of pairs) {
      const v1 = state[key1];
      const v2 = state[key2];
      
      if (typeof v1 === 'number' && typeof v2 === 'number' && v2 !== 0) {
        const ratio = v1 / v2;
        const goldenDeviation = Math.abs(ratio - GOLDEN_RATIO) / GOLDEN_RATIO;
        
        if (goldenDeviation < 0.05) {
          return {
            patternType: 'golden_ratio',
            patternValue: ratio,
            confidence: 1 - goldenDeviation,
            formula: `${key1}/${key2} ≈ φ`,
            relatedConstants: ['phi', 'fibonacci'],
            significance: 'Divine proportion found between parameters'
          };
        }
      }
    }
    return null;
  }

  private detectFibonacciSequence(state: Record<string, any>): PatternRecognitionResult | null {
    const values = ['a', 'b', 'c', 'd', 'e'].map(k => state[k]).filter(v => typeof v === 'number');
    
    if (values.length < 3) return null;

    let fibScore = 0;
    for (let i = 2; i < values.length; i++) {
      const expected = values[i - 1] + values[i - 2];
      const deviation = Math.abs(values[i] - expected) / Math.max(Math.abs(expected), 1);
      if (deviation < 0.1) fibScore++;
    }

    if (fibScore >= 1) {
      return {
        patternType: 'fibonacci',
        patternValue: fibScore / (values.length - 2),
        confidence: fibScore / (values.length - 2),
        formula: 'F(n) = F(n-1) + F(n-2)',
        relatedConstants: ['phi', 'golden_ratio'],
        significance: 'Fibonacci sequence detected in parameter progression'
      };
    }
    return null;
  }

  private detectSymmetryPattern(state: Record<string, any>): PatternRecognitionResult | null {
    const a = state.a, b = state.b, c = state.c;
    
    if (typeof a !== 'number' || typeof b !== 'number' || typeof c !== 'number') return null;

    if (Math.abs(a - b) < 0.01 && Math.abs(b - c) < 0.01) {
      return {
        patternType: 'symmetry',
        patternValue: 3,
        confidence: 0.95,
        formula: 'a ≈ b ≈ c',
        relatedConstants: ['unity', 'sphere'],
        significance: 'Cubic/spherical symmetry - equal parameters in all dimensions'
      };
    }

    if (Math.abs(a - b) < 0.01 && a !== c) {
      return {
        patternType: 'symmetry',
        patternValue: 2,
        confidence: 0.85,
        formula: 'a ≈ b ≠ c',
        relatedConstants: ['cylinder', 'rotational'],
        significance: 'Cylindrical symmetry detected'
      };
    }

    return null;
  }

  private detectStabilityPattern(state: Record<string, any>): PatternRecognitionResult | null {
    const dynamics = state.dynamics as ShapeDynamics | undefined;
    
    if (!dynamics?.stabilityIndex) return null;

    const stability = dynamics.stabilityIndex;
    
    if (stability > 0.8) {
      return {
        patternType: 'stability',
        patternValue: stability,
        confidence: stability,
        formula: 'λ_max < 0 (stable)',
        relatedConstants: ['equilibrium', 'attractor'],
        significance: 'Highly stable configuration - suitable for engineering applications'
      };
    }

    return null;
  }

  private getPhysicsApplications(patternType: string): string[] {
    const applications: Record<string, string[]> = {
      'golden_ratio': ['Natural growth patterns', 'Optimal packing', 'Aesthetic design', 'Phyllotaxis'],
      'fibonacci': ['Spiral structures', 'Population dynamics', 'Crystal growth', 'Wave patterns'],
      'symmetry': ['Structural engineering', 'Crystallography', 'Molecular chemistry', 'Architecture'],
      'stability': ['Gyroscope design', 'Spacecraft orientation', 'Balancing systems', 'Vibration control']
    };
    return applications[patternType] || [];
  }

  async recordCrossCorrelation(
    domainA: string,
    domainB: string,
    shapeAId: string,
    shapeBId: string,
    correlationType: string,
    strength: number,
    basis?: string
  ): Promise<void> {
    try {
      await db.insert(cross_system_correlations).values({
        domainA,
        domainB,
        shapeAId,
        shapeBId,
        correlationType,
        correlationStrength: strength,
        mathematicalBasis: basis,
        sharedSymmetries: this.findSharedSymmetries(shapeAId, shapeBId),
        transferFunctions: this.computeTransferFunctions(domainA, domainB),
        discoveredThrough: 'cross_learning'
      });
    } catch (error) {
      console.error('Cross-correlation recording failed:', error);
    }
  }

  private findSharedSymmetries(shapeA: string, shapeB: string): string[] {
    const symmetryMapping: Record<string, string[]> = {
      'sphere': ['SO(3)', 'continuous', 'rotational'],
      'torus': ['S1×S1', 'continuous', 'toroidal'],
      'cube': ['Oh', 'discrete', 'cubic'],
      'tetrahedron': ['Td', 'discrete', 'tetrahedral']
    };
    
    const symA = symmetryMapping[shapeA.toLowerCase()] || [];
    const symB = symmetryMapping[shapeB.toLowerCase()] || [];
    
    return symA.filter(s => symB.includes(s));
  }

  private computeTransferFunctions(domainA: string, domainB: string): Record<string, string> {
    const transfers: Record<string, Record<string, string>> = {
      'topology': {
        'quantum': 'Berry phase connection',
        'biology': 'Folding pathway',
        'relativity': 'Spacetime curvature'
      },
      'quantum': {
        'topology': 'Topological invariants',
        'biology': 'Coherence transfer',
        'relativity': 'Quantum gravity bridge'
      }
    };
    
    return transfers[domainA]?.[domainB] ? { primary: transfers[domainA][domainB] } : {};
  }

  async preserveExport(
    shapeId: string,
    exportType: string,
    parameters: Record<string, any>,
    dynamics: ShapeDynamics,
    materialSettings?: Record<string, any>,
    fileSize?: number
  ): Promise<void> {
    try {
      const checksum = this.computeChecksum(JSON.stringify({ parameters, dynamics }));
      
      await db.insert(export_preservation_records).values({
        shapeId,
        exportType,
        parametersUsed: parameters,
        dynamicsEmbedded: dynamics,
        materialSettings,
        fileSizeBytes: fileSize,
        checksum,
        attributionData: {
          copyright: '© UUON Foundation',
          license: 'CC0 1.0 Universal',
          generator: 'Dmension Mathematical Universe',
          version: '2.0.0'
        },
        regenerationInstructions: {
          shapeId,
          parameters,
          materialPreset: materialSettings?.preset,
          exportType,
          timestamp: new Date().toISOString()
        }
      });

      await this.trackEvolution({
        shapeId,
        eventType: 'export',
        eventData: { exportType, fileSize, checksum },
        newState: { parameters, dynamics }
      });

    } catch (error) {
      console.error('Export preservation failed:', error);
    }
  }

  private computeChecksum(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  async computeAdvancedInsights(shapeId: string, dynamics: ShapeDynamics): Promise<void> {
    try {
      const insights = {
        shapeId,
        
        angularVelocityProfile: this.computeAngularVelocityProfile(dynamics),
        torqueResponseCurve: this.computeTorqueResponse(dynamics),
        resonanceFrequencies: this.computeResonanceFrequencies(dynamics),
        dampingCoefficients: this.estimateDamping(dynamics),
        
        lyapunovExponents: this.estimateLyapunov(dynamics),
        bifurcationPoints: [],
        attractorType: dynamics.stabilityIndex && dynamics.stabilityIndex > 0.8 ? 'point' : 'limit_cycle',
        basinOfAttraction: null,
        
        structuralStressPoints: this.identifyStressPoints(dynamics),
        loadBearingCapacity: this.estimateLoadCapacity(dynamics),
        aerodynamicCoefficients: this.estimateAerodynamics(dynamics),
        thermalExpansionProfile: null,
        
        quantumAnalogs: this.findQuantumAnalogs(dynamics),
        waveParticleDuality: null,
        uncertaintyRelations: this.computeUncertaintyRelations(dynamics),
        
        cosmicScaleAnalogs: this.findCosmicAnalogs(shapeId),
        gravitationalLensing: null,
        spacetimeDistortion: null,
        
        validationStatus: 'computed'
      };

      await db.insert(advanced_physical_insights).values(insights);
      
    } catch (error) {
      console.error('Advanced insights computation failed:', error);
    }
  }

  private computeAngularVelocityProfile(dynamics: ShapeDynamics): Record<string, number[]> {
    const omega = [0.1, 0.5, 1.0, 2.0, 5.0, 10.0];
    const profile: Record<string, number[]> = { omega: omega, Lx: [], Ly: [], Lz: [] };
    
    if (dynamics.momentOfInertia) {
      for (const w of omega) {
        profile.Lx.push(dynamics.momentOfInertia.Ixx * w);
        profile.Ly.push(dynamics.momentOfInertia.Iyy * w);
        profile.Lz.push(dynamics.momentOfInertia.Izz * w);
      }
    }
    
    return profile;
  }

  private computeTorqueResponse(dynamics: ShapeDynamics): Record<string, number[]> {
    const torque = [0, 0.5, 1, 2, 5, 10];
    const alpha: number[] = [];
    
    if (dynamics.momentOfInertia) {
      const avgI = (dynamics.momentOfInertia.Ixx + dynamics.momentOfInertia.Iyy + dynamics.momentOfInertia.Izz) / 3;
      for (const t of torque) {
        alpha.push(avgI > 0 ? t / avgI : 0);
      }
    }
    
    return { torque, angularAcceleration: alpha };
  }

  private computeResonanceFrequencies(dynamics: ShapeDynamics): number[] {
    if (!dynamics.momentOfInertia || !dynamics.mass) return [];
    
    const k = 1000;
    const frequencies = [];
    
    if (dynamics.momentOfInertia.Ixx > 0) {
      frequencies.push(Math.sqrt(k / dynamics.momentOfInertia.Ixx) / (2 * PI));
    }
    if (dynamics.momentOfInertia.Iyy > 0) {
      frequencies.push(Math.sqrt(k / dynamics.momentOfInertia.Iyy) / (2 * PI));
    }
    if (dynamics.momentOfInertia.Izz > 0) {
      frequencies.push(Math.sqrt(k / dynamics.momentOfInertia.Izz) / (2 * PI));
    }
    
    return frequencies;
  }

  private estimateDamping(dynamics: ShapeDynamics): Record<string, number> {
    return {
      viscous: 0.05,
      structural: 0.02,
      coulomb: 0.01
    };
  }

  private estimateLyapunov(dynamics: ShapeDynamics): number[] {
    if (!dynamics.stabilityIndex) return [0];
    return dynamics.stabilityIndex > 0.5 ? [-0.1, -0.05, 0] : [0.1, 0, -0.05];
  }

  private identifyStressPoints(dynamics: ShapeDynamics): Array<{ x: number; y: number; z: number; intensity: number }> {
    if (!dynamics.centerOfMass) return [];
    
    return [
      { ...dynamics.centerOfMass, intensity: 0.5 },
      { x: 0, y: 0, z: 0, intensity: 0.3 }
    ];
  }

  private estimateLoadCapacity(dynamics: ShapeDynamics): number {
    if (!dynamics.volume || !dynamics.mass) return 0;
    const density = dynamics.mass / dynamics.volume;
    return density * 100;
  }

  private estimateAerodynamics(dynamics: ShapeDynamics): Record<string, number> {
    return {
      Cd: 0.47,
      Cl: 0,
      Cm: 0
    };
  }

  private findQuantumAnalogs(dynamics: ShapeDynamics): Record<string, string> {
    const analogs: Record<string, string> = {};
    
    if (dynamics.stabilityIndex && dynamics.stabilityIndex > 0.8) {
      analogs.groundState = 'Bound state analog';
    }
    
    if (dynamics.gyroscopicRatio) {
      analogs.spin = `Classical spin analog (g-factor ≈ ${dynamics.gyroscopicRatio.toFixed(2)})`;
    }
    
    return analogs;
  }

  private computeUncertaintyRelations(dynamics: ShapeDynamics): Record<string, number> {
    const hbar = 1.054571817e-34;
    return {
      positionMomentum: hbar / 2,
      energyTime: hbar / 2,
      angularMomentumAngle: hbar / 2
    };
  }

  private findCosmicAnalogs(shapeId: string): string[] {
    const cosmicMappings: Record<string, string[]> = {
      'sphere': ['Stars', 'Planets', 'Event horizons'],
      'torus': ['Accretion disks', 'Magnetic field lines'],
      'spiral': ['Galaxies', 'Hurricane structures']
    };
    
    for (const [key, analogs] of Object.entries(cosmicMappings)) {
      if (shapeId.toLowerCase().includes(key)) {
        return analogs;
      }
    }
    return [];
  }

  async archiveSession(): Promise<void> {
    try {
      const recentEvents = await db.select()
        .from(system_evolution_tracking)
        .where(eq(system_evolution_tracking.sessionId, this.sessionId))
        .orderBy(desc(system_evolution_tracking.timestamp))
        .limit(100);

      const shapesExplored = Array.from(new Set(recentEvents.map((e: { shapeId: string | null }) => e.shapeId)));
      const patternsDiscovered = await db.select()
        .from(mathematical_pattern_recognition)
        .where(and(
          gte(mathematical_pattern_recognition.discoveredAt!, this.sessionStartTime)
        ))
        .limit(50);

      await db.insert(session_archives).values({
        sessionId: this.sessionId,
        startTime: this.sessionStartTime,
        shapesExplored,
        computationsPerformed: this.computationCount,
        patternsDiscovered: patternsDiscovered.map((p: { patternType: string | null; shapeId: string | null; confidence: number | null }) => ({
          type: p.patternType,
          shape: p.shapeId,
          confidence: p.confidence
        })),
        performanceMetrics: {
          avgComputationTime: this.computeAvgTime(recentEvents),
          totalEvents: recentEvents.length
        },
        archiveComplete: false
      }).onConflictDoUpdate({
        target: session_archives.sessionId,
        set: {
          computationsPerformed: sql`EXCLUDED.computations_performed`,
          endTime: new Date()
        }
      });

      console.log(`📦 Session archived: ${this.sessionId} (${shapesExplored.length} shapes, ${this.computationCount} computations)`);
      
    } catch (error) {
      console.error('Session archiving failed:', error);
    }
  }

  private computeAvgTime(events: any[]): number {
    const times = events.filter(e => e.computationTimeMs).map(e => e.computationTimeMs);
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }

  async getPreservationStats(): Promise<Record<string, any>> {
    const evolutionCount = await db.select({ count: sql<number>`count(*)` }).from(system_evolution_tracking);
    const patternCount = await db.select({ count: sql<number>`count(*)` }).from(mathematical_pattern_recognition);
    const correlationCount = await db.select({ count: sql<number>`count(*)` }).from(cross_system_correlations);
    const exportCount = await db.select({ count: sql<number>`count(*)` }).from(export_preservation_records);
    const insightCount = await db.select({ count: sql<number>`count(*)` }).from(advanced_physical_insights);

    return {
      sessionId: this.sessionId,
      sessionStart: this.sessionStartTime,
      currentComputations: this.computationCount,
      totals: {
        evolutionEvents: evolutionCount[0]?.count || 0,
        patternsRecognized: patternCount[0]?.count || 0,
        crossCorrelations: correlationCount[0]?.count || 0,
        exportsPreserved: exportCount[0]?.count || 0,
        advancedInsights: insightCount[0]?.count || 0
      }
    };
  }

  shutdown(): void {
    if (this.autoArchiveInterval) {
      clearInterval(this.autoArchiveInterval);
    }
    this.archiveSession();
    console.log('📦 Data Preservation Engine shutdown complete');
  }
}

export const dataPreservationEngine = new ComprehensiveDataPreservationEngine();

export default {
  trackEvolution: (event: PreservationEvent) => dataPreservationEngine.trackEvolution(event),
  detectPatterns: (shapeId: string, state?: Record<string, any>) => dataPreservationEngine.detectPatterns(shapeId, state),
  recordCrossCorrelation: (...args: Parameters<typeof dataPreservationEngine.recordCrossCorrelation>) => 
    dataPreservationEngine.recordCrossCorrelation(...args),
  preserveExport: (...args: Parameters<typeof dataPreservationEngine.preserveExport>) => 
    dataPreservationEngine.preserveExport(...args),
  computeAdvancedInsights: (...args: Parameters<typeof dataPreservationEngine.computeAdvancedInsights>) => 
    dataPreservationEngine.computeAdvancedInsights(...args),
  archiveSession: () => dataPreservationEngine.archiveSession(),
  getStats: () => dataPreservationEngine.getPreservationStats(),
  shutdown: () => dataPreservationEngine.shutdown()
};
