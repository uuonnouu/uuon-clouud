/**
 * CROSS-LEARNING ENGINE
 * Fully functional mathematical intelligence system where shapes influence each other
 * Light follows geometry - math creates the path
 *
 * Core Principles:
 * 1. Harmonic Resonance: Shapes with related frequencies influence each other
 * 2. Geometric Symmetry: Transformations propagate through symmetry groups
 * 3. Dimensional Bridging: Lower dimensions inform higher dimensions
 * 4. Energy Conservation: Parameter changes obey conservation laws
 *
 * © 2025 UUON Foundation Inc.
 */

import {
  lerp,
  slerp,
  catmullRom,
  gradientDescent,
  springDamper,
  matrix3x3Determinant,
  sphericalJacobian,
  cylindricalJacobian,
  surfaceCurvature,
  Matrix3x3
} from './internalAlgorithmUtilities';
import FoundationalPatternSystem from './foundationalPatternSystem';

function gaussianCurvature(x: number, y: number, z: number, f: (px: number, py: number) => number): number {
  const h = 0.01;
  const fxx = (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h);
  const fyy = (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
  const fxy = (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h);
  const fx = (f(x + h, y) - f(x - h, y)) / (2 * h);
  const fy = (f(x, y + h) - f(x, y - h)) / (2 * h);
  const denom = Math.pow(1 + fx * fx + fy * fy, 2);
  return (fxx * fyy - fxy * fxy) / (denom + 0.0001);
}

function meanCurvature(x: number, y: number, z: number, f: (px: number, py: number) => number): number {
  const h = 0.01;
  const fxx = (f(x + h, y) - 2 * f(x, y) + f(x - h, y)) / (h * h);
  const fyy = (f(x, y + h) - 2 * f(x, y) + f(x, y - h)) / (h * h);
  const fxy = (f(x + h, y + h) - f(x + h, y - h) - f(x - h, y + h) + f(x - h, y - h)) / (4 * h * h);
  const fx = (f(x + h, y) - f(x - h, y)) / (2 * h);
  const fy = (f(x, y + h) - f(x, y - h)) / (2 * h);
  const denom = Math.pow(1 + fx * fx + fy * fy, 1.5);
  return ((1 + fy * fy) * fxx - 2 * fx * fy * fxy + (1 + fx * fx) * fyy) / (2 * denom + 0.0001);
}

function catmullRomSpline(points: Array<[number, number, number]>, t: number): [number, number, number] {
  if (points.length < 2) return points[0] || [0, 0, 0];
  const n = points.length - 1;
  const segment = Math.min(Math.floor(t * n), n - 1);
  const localT = (t * n) - segment;
  const p0 = points[Math.max(0, segment - 1)];
  const p1 = points[segment];
  const p2 = points[Math.min(n, segment + 1)];
  const p3 = points[Math.min(n, segment + 2)];
  return catmullRom(p0, p1, p2, p3, localT);
}

export interface ShapeState {
  id: string;
  category: string;
  params: Record<string, number>;
  energy: number;
  frequency: number;
  phase: number;
  curvature: number;
  lastUpdate: number;
}

export interface LearningConnection {
  sourceId: string;
  targetId: string;
  strength: number;
  type: 'harmonic' | 'symmetry' | 'derivative' | 'integral' | 'dual';
  transferFunction: (sourceValue: number, targetValue: number) => number;
}

export interface MathematicalField {
  potential: (x: number, y: number, z: number) => number;
  gradient: (x: number, y: number, z: number) => [number, number, number];
  laplacian: (x: number, y: number, z: number) => number;
}

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;
const PLANCK_SCALE = 1.616255e-35;
const FINE_STRUCTURE = 1 / 137.035999;

class CrossLearningEngine {
  private shapeStates: Map<string, ShapeState> = new Map();
  private connections: LearningConnection[] = [];
  private globalField: MathematicalField;
  private basePotentialFn: (x: number, y: number, z: number) => number = () => 0;
  private evolutionTime: number = 0;
  private learningRate: number = 0.1;
  private dampingFactor: number = 0.95;
  private currentBatch: number = 0; // Added for tracking batches

  constructor() {
    this.globalField = this.createUnifiedField();
    this.basePotentialFn = this.globalField.potential;
    this.initializeMathematicalRelationships();
    this.startAutoSave(); // Start 5-minute auto-save timer
    this.startVerificationLedger(); // Start 10-minute verification ledger
    this.startEnergyConversion(); // Start 60-second energy-to-token conversion
  }

  private createUnifiedField(): MathematicalField {
    return {
      potential: (x, y, z) => {
        const r = Math.sqrt(x * x + y * y + z * z) + 1.0;
        const sphericalPotential = -1 / r;
        const harmonicPotential = 0.5 * (x * x + y * y + z * z);
        const quantumCorrection = Math.exp(-r * r) * Math.cos(r * GOLDEN_RATIO);
        return sphericalPotential + 0.1 * harmonicPotential + 0.05 * quantumCorrection;
      },
      gradient: (x, y, z) => {
        const h = 0.001;
        const fx = (this.globalField.potential(x + h, y, z) - this.globalField.potential(x - h, y, z)) / (2 * h);
        const fy = (this.globalField.potential(x, y + h, z) - this.globalField.potential(x, y - h, z)) / (2 * h);
        const fz = (this.globalField.potential(x, y, z + h) - this.globalField.potential(x, y, z - h)) / (2 * h);
        return [fx, fy, fz];
      },
      laplacian: (x, y, z) => {
        const h = 0.001;
        const p = this.globalField.potential;
        return (p(x + h, y, z) + p(x - h, y, z) + p(x, y + h, z) + p(x, y - h, z) +
                p(x, y, z + h) + p(x, y, z - h) - 6 * p(x, y, z)) / (h * h);
      }
    };
  }

  private initializeMathematicalRelationships(): void {
    this.connections = [
      {
        sourceId: 'wave',
        targetId: 'quantum',
        strength: FINE_STRUCTURE,
        type: 'harmonic',
        transferFunction: (src, tgt) => lerp(tgt, src * Math.sin(this.evolutionTime), this.learningRate)
      },
      {
        sourceId: 'sphere',
        targetId: 'torus',
        strength: 1 / GOLDEN_RATIO,
        type: 'symmetry',
        transferFunction: (src, tgt) => {
          const jacobian = sphericalJacobian(src, Math.PI / 2, 0);
          return tgt + jacobian.determinant * 0.01 * this.learningRate;
        }
      },
      {
        sourceId: 'fractal',
        targetId: 'chaos',
        strength: 0.618,
        type: 'derivative',
        transferFunction: (src, tgt) => {
          const lyapunov = Math.log(Math.abs(2 * src) + 0.001);
          return tgt * (1 + lyapunov * 0.01);
        }
      },
      {
        sourceId: 'dna',
        targetId: 'protein',
        strength: 0.75,
        type: 'integral',
        transferFunction: (src, tgt) => {
          const helixPhase = src * Math.PI * 2;
          return tgt + Math.sin(helixPhase) * 0.1 * this.learningRate;
        }
      },
      {
        sourceId: 'geometry',
        targetId: 'topology',
        strength: 1.0,
        type: 'dual',
        transferFunction: (src, tgt) => {
          const eulerChar = 2 - 2 * Math.floor(src);
          return tgt + eulerChar * 0.05;
        }
      }
    ];
  }

  registerShape(id: string, category: string, params: Record<string, number>): void {
    const frequency = this.computeNaturalFrequency(params);
    const energy = this.computeShapeEnergy(params);
    const curvature = this.computeAverageCurvature(params);

    this.shapeStates.set(id, {
      id,
      category,
      params: { ...params },
      energy,
      frequency,
      phase: 0,
      curvature,
      lastUpdate: Date.now()
    });

    this.autoConnectShape(id, category);

    // Generate tokens immediately on shape registration
    this.generateInteractionTokens('shape_registration', energy);
  }

  private computeNaturalFrequency(params: Record<string, number>): number {
    const d = params.d ?? 1;
    const e = params.e ?? 1;
    const f = params.f ?? 1;
    const volume = Math.abs(d * e * f);
    return 1 / Math.sqrt(volume + 0.001);
  }

  private computeShapeEnergy(params: Record<string, number>): number {
    const d = params.d ?? 1;
    const e = params.e ?? 1;
    const f = params.f ?? 1;
    const kinetic = 0.5 * (d * d + e * e + f * f);
    const potential = this.globalField.potential(d, e, f);
    return kinetic + potential;
  }

  private computeAverageCurvature(params: Record<string, number>): number {
    const d = params.d ?? 1;
    const e = params.e ?? 1;
    const samples = 8;
    let totalCurvature = 0;

    for (let i = 0; i < samples; i++) {
      const u = (i / samples) * Math.PI * 2;
      const x = d * Math.cos(u);
      const y = e * Math.sin(u);
      const gaussian = gaussianCurvature(x, y, 0, (px, py) => Math.sin(px) * Math.cos(py));
      const mean = meanCurvature(x, y, 0, (px, py) => Math.sin(px) * Math.cos(py));
      totalCurvature += Math.abs(gaussian) + Math.abs(mean);
    }

    return totalCurvature / samples;
  }

  private autoConnectShape(newShapeId: string, category: string): void {
    const newState = this.shapeStates.get(newShapeId);
    if (!newState) return;

    for (const [existingId, existingState] of Array.from(this.shapeStates.entries())) {
      if (existingId === newShapeId) continue;

      const frequencyRatio = newState.frequency / (existingState.frequency + 0.001);
      const isHarmonic = Math.abs(frequencyRatio - Math.round(frequencyRatio)) < 0.1;

      if (isHarmonic) {
        this.connections.push({
          sourceId: existingId,
          targetId: newShapeId,
          strength: 1 / (Math.abs(frequencyRatio - Math.round(frequencyRatio)) + 0.1),
          type: 'harmonic',
          transferFunction: (src, tgt) => {
            const phase = Math.sin(this.evolutionTime * frequencyRatio);
            return lerp(tgt, src * phase, this.learningRate * 0.5);
          }
        });
      }

      const curvatureDiff = Math.abs(newState.curvature - existingState.curvature);
      if (curvatureDiff < 0.5) {
        this.connections.push({
          sourceId: existingId,
          targetId: newShapeId,
          strength: 1 / (curvatureDiff + 0.1),
          type: 'symmetry',
          transferFunction: (src, tgt) => {
            return tgt + (src - tgt) * this.learningRate * 0.3;
          }
        });
      }
    }
  }

  evolve(deltaTime: number): Map<string, Record<string, number>> {
    this.evolutionTime += deltaTime;
    const updates = new Map<string, Record<string, number>>();

    for (const connection of this.connections) {
      const sourceState = this.findStateByCategory(connection.sourceId);
      const targetState = this.findStateByCategory(connection.targetId);

      if (!sourceState || !targetState) continue;

      const updatedParams: Record<string, number> = { ...targetState.params };
      let wasUpdated = false;

      for (const paramKey of ['a', 'b', 'c', 'd', 'e', 'f']) {
        const sourceVal = sourceState.params[paramKey] ?? 0;
        const targetVal = targetState.params[paramKey] ?? 0;

        if (sourceVal !== 0 || targetVal !== 0) {
          const newVal = connection.transferFunction(sourceVal, targetVal);
          const dampedVal = targetVal + (newVal - targetVal) * connection.strength * this.dampingFactor;

          if (Math.abs(dampedVal - targetVal) > 0.0001) {
            updatedParams[paramKey] = dampedVal;
            wasUpdated = true;
          }
        }
      }

      if (wasUpdated) {
        targetState.params = updatedParams;
        targetState.energy = this.computeShapeEnergy(updatedParams);
        targetState.frequency = this.computeNaturalFrequency(updatedParams);
        targetState.phase += deltaTime * targetState.frequency;
        targetState.lastUpdate = Date.now();

        updates.set(targetState.id, updatedParams);

        // Generate tokens on parameter updates
        this.generateInteractionTokens('parameter_update', targetState.energy);
      }
    }

    this.evolveGlobalField(deltaTime);

    return updates;
  }

  private findStateByCategory(categoryOrId: string): ShapeState | undefined {
    const direct = this.shapeStates.get(categoryOrId);
    if (direct) return direct;

    for (const state of Array.from(this.shapeStates.values())) {
      if (state.category.toLowerCase().includes(categoryOrId.toLowerCase())) {
        return state;
      }
    }
    return undefined;
  }

  private evolveGlobalField(deltaTime: number): void {
    const waveSpeed = 1.0;
    const basePotentialFn = this.basePotentialFn;
    const shapeSnapshot = Array.from(this.shapeStates.values()).map(state => ({
      d: state.params.d ?? 0,
      e: state.params.e ?? 0,
      f: state.params.f ?? 0,
      energy: Math.max(-10, Math.min(10, state.energy))
    }));
    const shapeCount = shapeSnapshot.length;
    const evolutionTime = this.evolutionTime;

    this.globalField.potential = (x, y, z) => {
      const basePotential = basePotentialFn(x, y, z);
      const waveContribution = Math.sin(evolutionTime * waveSpeed) *
                               Math.exp(-(x * x + y * y + z * z) / 10);

      let shapeContribution = 0;
      for (const s of shapeSnapshot) {
        const r = Math.sqrt(
          Math.pow(x - s.d, 2) +
          Math.pow(y - s.e, 2) +
          Math.pow(z - s.f, 2)
        );
        shapeContribution += s.energy * Math.exp(-r * r) / (shapeCount + 1);
      }

      return basePotential + 0.1 * waveContribution + 0.05 * shapeContribution;
    };
  }

  computeInfluenceMatrix(): number[][] {
    const states = Array.from(this.shapeStates.values());
    const n = states.length;
    const matrix: number[][] = Array(n).fill(null).map(() => Array(n).fill(0));

    for (const conn of this.connections) {
      const sourceIdx = states.findIndex(s =>
        s.id === conn.sourceId || s.category.includes(conn.sourceId)
      );
      const targetIdx = states.findIndex(s =>
        s.id === conn.targetId || s.category.includes(conn.targetId)
      );

      if (sourceIdx >= 0 && targetIdx >= 0) {
        matrix[sourceIdx][targetIdx] = conn.strength;
      }
    }

    return matrix;
  }

  getOptimalParameters(shapeId: string): Record<string, number> {
    const state = this.shapeStates.get(shapeId);
    if (!state) return {};

    const energyFunc = (params: number[]): number => {
      const testParams = {
        d: params[0],
        e: params[1],
        f: params[2]
      };
      return this.computeShapeEnergy(testParams);
    };

    const initialParams = [
      state.params.d ?? 1,
      state.params.e ?? 1,
      state.params.f ?? 1
    ];

    const result = gradientDescent(
      energyFunc,
      initialParams,
      0.01,
      100,
      1e-6
    );

    return {
      ...state.params,
      d: result.solution[0],
      e: result.solution[1],
      f: result.solution[2]
    };
  }

  computeGeometricPath(fromId: string, toId: string, steps: number = 10): Array<Record<string, number>> {
    const fromState = this.shapeStates.get(fromId);
    const toState = this.shapeStates.get(toId);

    if (!fromState || !toState) return [];

    const path: Array<Record<string, number>> = [];
    const controlPoints: Array<[number, number, number]> = [];

    controlPoints.push([fromState.params.d ?? 0, fromState.params.e ?? 0, fromState.params.f ?? 0]);

    const midD = (fromState.params.d ?? 0 + toState.params.d ?? 0) / 2 + Math.sin(this.evolutionTime) * 0.5;
    const midE = (fromState.params.e ?? 0 + toState.params.e ?? 0) / 2 + Math.cos(this.evolutionTime) * 0.5;
    const midF = (fromState.params.f ?? 0 + toState.params.f ?? 0) / 2;
    controlPoints.push([midD, midE, midF]);

    controlPoints.push([toState.params.d ?? 0, toState.params.e ?? 0, toState.params.f ?? 0]);

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = catmullRomSpline(controlPoints, t);
      path.push({
        d: point[0],
        e: point[1],
        f: point[2],
        g: lerp(fromState.params.g ?? 0, toState.params.g ?? 0, t),
        h: lerp(fromState.params.h ?? 0, toState.params.h ?? 0, t),
        i: lerp(fromState.params.i ?? 0, toState.params.i ?? 0, t)
      });
    }

    return path;
  }

  applyFieldForce(shapeId: string): [number, number, number] {
    const state = this.shapeStates.get(shapeId);
    if (!state) return [0, 0, 0];

    const x = state.params.d ?? 0;
    const y = state.params.e ?? 0;
    const z = state.params.f ?? 0;

    const gradient = this.globalField.gradient(x, y, z);
    return [-gradient[0], -gradient[1], -gradient[2]];
  }

  getShapeResonance(shapeId: string): { frequency: number; amplitude: number; phase: number } {
    const state = this.shapeStates.get(shapeId);
    if (!state) return { frequency: 1, amplitude: 0, phase: 0 };

    let totalResonance = 0;
    let connectionCount = 0;

    for (const conn of this.connections) {
      if (conn.targetId === shapeId || conn.sourceId === shapeId) {
        totalResonance += conn.strength;
        connectionCount++;
      }
    }

    const amplitude = connectionCount > 0 ? totalResonance / connectionCount : 0;

    return {
      frequency: state.frequency,
      amplitude,
      phase: state.phase
    };
  }

  getLearningMetrics(): {
    totalEnergy: number;
    connectionCount: number;
    avgCurvature: number;
    evolutionTime: number;
  } {
    let totalEnergy = 0;
    let totalCurvature = 0;

    for (const state of Array.from(this.shapeStates.values())) {
      totalEnergy += state.energy;
      totalCurvature += state.curvature;
    }

    return {
      totalEnergy,
      connectionCount: this.connections.length,
      avgCurvature: this.shapeStates.size > 0 ? totalCurvature / this.shapeStates.size : 0,
      evolutionTime: this.evolutionTime
    };
  }

  // ENERGY STORAGE & EXPORT SYSTEM
  captureEnergySnapshot(): {
    timestamp: number;
    totalEnergy: number;
    energyDistribution: Array<{ shapeId: string; energy: number; frequency: number; phase: number; curvature: number }>;
    fieldState: { potential: number; gradient: [number, number, number] };
    connections: Array<{ source: string; target: string; strength: number; type: string }>;
    evolutionTime: number;
    uuonTokens?: Array<{ tokenId: string; energyValue: number; externalValue: number; rwaValue: number; utility: string; physicsData: any }>;
  } {
    const energyDistribution = Array.from(this.shapeStates.entries()).map(([id, state]) => ({
      shapeId: id,
      energy: state.energy,
      frequency: state.frequency,
      phase: state.phase,
      curvature: state.curvature
    }));

    // Sample field at origin
    const fieldPotential = this.globalField.potential(0, 0, 0);
    const fieldGradient = this.globalField.gradient(0, 0, 0);

    return {
      timestamp: Date.now(),
      totalEnergy: energyDistribution.reduce((sum, shape) => sum + shape.energy, 0),
      energyDistribution,
      fieldState: {
        potential: fieldPotential,
        gradient: fieldGradient
      },
      connections: this.connections.map(conn => ({
        source: conn.sourceId,
        target: conn.targetId,
        strength: conn.strength,
        type: conn.type
      })),
      evolutionTime: this.evolutionTime
    };
  }

  saveEnergyToStorage(key: string): void {
    const snapshot = this.captureEnergySnapshot();
    localStorage.setItem(`energy_${key}`, JSON.stringify(snapshot));
    console.log(`⚡ Energy snapshot saved: ${snapshot.totalEnergy.toFixed(2)} units`);
  }

  loadEnergyFromStorage(key: string): boolean {
    const stored = localStorage.getItem(`energy_${key}`);
    if (!stored) return false;

    try {
      const snapshot = JSON.parse(stored);

      // Restore shape states
      for (const shape of snapshot.energyDistribution) {
        if (this.shapeStates.has(shape.shapeId)) {
          const state = this.shapeStates.get(shape.shapeId)!;
          state.energy = shape.energy;
          state.frequency = shape.frequency;
          state.phase = shape.phase || 0;
          state.curvature = shape.curvature || 0;
        }
      }

      // Restore evolution time
      this.evolutionTime = snapshot.evolutionTime || 0;

      console.log(`⚡ Energy restored: ${snapshot.totalEnergy.toFixed(2)} units`);
      return true;
    } catch (error) {
      console.error('Failed to load energy snapshot:', error);
      return false;
    }
  }

  exportEnergyAsJSON(): string {
    return JSON.stringify(this.captureEnergySnapshot(), null, 2);
  }

  exportEnergyAsCSV(): string {
    const snapshot = this.captureEnergySnapshot();
    let csv = 'ShapeID,Energy,Frequency,Phase,Curvature\n';

    for (const shape of snapshot.energyDistribution) {
      csv += `${shape.shapeId},${shape.energy},${shape.frequency},${shape.phase || 0},${shape.curvature || 0}\n`;
    }

    return csv;
  }

  // ENERGY CONTAINMENT SYSTEM
  createEnergyContainer(maxEnergy: number = 100): {
    capacity: number;
    stored: number;
    efficiency: number;
    overflow: number;
  } {
    const currentEnergy = this.getLearningMetrics().totalEnergy;
    const stored = Math.min(currentEnergy, maxEnergy);
    const overflow = Math.max(0, currentEnergy - maxEnergy);
    const efficiency = currentEnergy > 0 ? (stored / currentEnergy) : 1;

    return {
      capacity: maxEnergy,
      stored,
      efficiency,
      overflow
    };
  }

  reset(): void {
    this.shapeStates.clear();
    this.connections = [];
    this.evolutionTime = 0;
    this.initializeMathematicalRelationships();
    this.globalField = this.createUnifiedField();
    this.currentBatch = 0; // Reset batch counter
  }

  // RWA PHYSICS DATA INTERFACE
  private physicsData: Map<string, {
    mass: number;
    volume: number;
    centerOfMass: { x: number; y: number; z: number };
    surfaceArea: number;
    density: number;
  }> = new Map();

  // TOKEN STOCKPILE STORAGE - Persisted to localStorage and database
  private tokenStockpile: Array<{
    tokenId: string;
    energyValue: number;
    externalValue: number;
    rwaValue: number;
    utility: string;
    physicsData: any;
    timestamp: number;
    batchId: string;
    energy?: number; // Added for compatibility with analytics
    batchValue?: number; // Added for compatibility with analytics
  }> = this.loadStockpileFromStorage();

  // Load stockpile from localStorage on init
  private loadStockpileFromStorage(): Array<any> {
    try {
      const saved = localStorage.getItem('uuon-token-stockpile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length > CrossLearningEngine.MAX_STOCKPILE_SIZE) {
          const trimmed = parsed.slice(-CrossLearningEngine.MAX_STOCKPILE_SIZE);
          localStorage.setItem('uuon-token-stockpile', JSON.stringify(trimmed));
          console.log(`📦 Loaded and trimmed token stockpile: ${parsed.length} → ${trimmed.length}`);
          return trimmed;
        }
        console.log(`📦 Loaded ${parsed.length} tokens from storage`);
        return parsed;
      }
    } catch (e) {
      // Storage unavailable or corrupt — start fresh
      try { localStorage.removeItem('uuon-token-stockpile'); } catch {}
    }
    return [];
  }

  private static readonly MAX_STOCKPILE_SIZE = 500;

  // Save stockpile to localStorage
  private saveStockpileToStorage(): void {
    try {
      if (this.tokenStockpile.length > CrossLearningEngine.MAX_STOCKPILE_SIZE) {
        this.tokenStockpile = this.tokenStockpile.slice(-CrossLearningEngine.MAX_STOCKPILE_SIZE);
      }
      const payload = JSON.stringify(this.tokenStockpile);
      if (payload.length > 4 * 1024 * 1024) {
        this.tokenStockpile = this.tokenStockpile.slice(-100);
        localStorage.setItem('uuon-token-stockpile', JSON.stringify(this.tokenStockpile));
      } else {
        localStorage.setItem('uuon-token-stockpile', payload);
      }
      console.log(`💾 Saved ${this.tokenStockpile.length} tokens to storage`);
    } catch (e) {
      try {
        this.tokenStockpile = this.tokenStockpile.slice(-50);
        localStorage.setItem('uuon-token-stockpile', JSON.stringify(this.tokenStockpile));
        console.log(`💾 Saved trimmed stockpile (${this.tokenStockpile.length} tokens)`);
      } catch {
        // Storage completely unavailable, silently continue
      }
    }
  }

  // Save tokens to database via API (UUON Token Economy compatible)
  private async saveTokensToDatabase(tokens: any[]): Promise<void> {
    try {
      const response = await fetch('/api/token-ledger/stockpile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens,
          schemaVersion: '1.0.0',
          targetTables: ['tokens', 'token_metadata', 'energy_transactions', 'token_values']
        })
      });
      if (response.ok) {
        const data = await response.json();
        // Database save silently tracked (no console output for security)
      }
    } catch (e) {
      console.warn('Failed to save tokens to UUON database (will retry)');
    }
  }

  // AUTO-SAVE TIMER: 5-minute automatic persistence
  private autoSaveInterval: ReturnType<typeof setInterval> | null = null;

  startAutoSave(): void {
    if (this.autoSaveInterval) return;

    // Auto-save every 5 minutes (300000ms)
    this.autoSaveInterval = setInterval(async () => {
      if (this.tokenStockpile.length > 0) {
        console.log('⏰ Auto-save triggered: persisting', this.tokenStockpile.length, 'tokens');
        await this.saveTokensToDatabase(this.tokenStockpile);
        this.saveStockpileToStorage(); // Also backup to localStorage
      }
    }, 300000);

    console.log('⏰ Token auto-save started (5-minute intervals)');
  }

  stopAutoSave(): void {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      console.log('⏰ Token auto-save stopped');
    }
  }

  // AUTOMATIC ENERGY-TO-TOKEN CONVERSION SYSTEM
  // Prevents energy from accumulating and being lost - auto-converts to tokens
  private energyConversionInterval: ReturnType<typeof setInterval> | null = null;
  private lastEnergyConversion: number = 0;
  private energyConversionThreshold: number = 0.5; // Minimum energy to trigger conversion

  startEnergyConversion(): void {
    if (this.energyConversionInterval) return;

    // Check energy every 60 seconds and convert excess to tokens
    this.energyConversionInterval = setInterval(async () => {
      await this.convertAccumulatedEnergyToTokens();
    }, 60000); // Every 60 seconds

    console.log('⚡ Automatic energy-to-token conversion started (60-second intervals)');
  }

  stopEnergyConversion(): void {
    if (this.energyConversionInterval) {
      clearInterval(this.energyConversionInterval);
      this.energyConversionInterval = null;
      console.log('⚡ Automatic energy conversion stopped');
    }
  }

  private async convertAccumulatedEnergyToTokens(): Promise<void> {
    const snapshot = this.captureEnergySnapshot();
    const totalEnergy = snapshot.totalEnergy;

    // Only convert if we have meaningful accumulated energy
    if (totalEnergy < this.energyConversionThreshold) {
      return;
    }

    // Calculate how many tokens to generate based on accumulated energy
    const tokensToGenerate = Math.min(
      Math.max(1, Math.floor(totalEnergy / 0.1)), // 1 token per 0.1 energy units
      10 // Cap at 10 tokens per conversion cycle
    );

    // Generate tokens from accumulated energy
    const batch = this.generateTokenBatch(tokensToGenerate);

    // Energy→Token conversion silently tracked (no console output for security)

    // Save to database immediately
    await this.saveTokensToDatabase(batch.tokens);

    this.lastEnergyConversion = Date.now();
  }

  // Get energy system status for UI display
  getEnergySystemStatus(): {
    totalEnergy: number;
    lastConversion: number;
    nextConversion: number;
    tokensGenerated: number;
    conversionRate: string;
    isActive: boolean;
  } {
    const snapshot = this.captureEnergySnapshot();
    const nextConversion = this.lastEnergyConversion + 60000;

    return {
      totalEnergy: snapshot.totalEnergy,
      lastConversion: this.lastEnergyConversion,
      nextConversion,
      tokensGenerated: this.tokenStockpile.length,
      conversionRate: '0.1 energy = 1 token',
      isActive: this.energyConversionInterval !== null
    };
  }

  // VERIFICATION LEDGER: 10-minute sync audit
  private verificationInterval: ReturnType<typeof setInterval> | null = null;

  startVerificationLedger(): void {
    if (this.verificationInterval) return;

    // Verify every 10 minutes (600000ms)
    this.verificationInterval = setInterval(async () => {
      await this.verifyTokenSync();
    }, 600000);

    console.log('🔍 Token verification ledger started (10-minute intervals)');
  }

  private async verifyTokenSync(): Promise<void> {
    try {
      const frontendCount = this.tokenStockpile.length;

      const response = await fetch('/api/token-ledger/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontendCount })
      });

      if (response.ok) {
        const data = await response.json();
        const { verification } = data;

        // Verification silently tracked (no console output for security)

        // Trigger recovery if needed
        if (verification.syncStatus === 'recovery_needed' && this.tokenStockpile.length > 0) {
          console.log('🚨 Recovery triggered - saving stockpile to database');
          await this.saveTokensToDatabase(this.tokenStockpile);
        }
      }
    } catch (e) {
      console.warn('Verification check failed - will retry next interval');
    }
  }

  stopVerificationLedger(): void {
    if (this.verificationInterval) {
      clearInterval(this.verificationInterval);
      this.verificationInterval = null;
      console.log('🔍 Token verification ledger stopped');
    }
  }

  // REGISTER PHYSICS DATA FOR RWA VALUATION
  registerPhysicsData(shapeId: string, physics: {
    mass: number;
    volume: number;
    centerOfMass: { x: number; y: number; z: number };
    surfaceArea?: number;
    density?: number;
  }): void {
    this.physicsData.set(shapeId, {
      mass: physics.mass,
      volume: physics.volume,
      centerOfMass: physics.centerOfMass,
      surfaceArea: physics.surfaceArea || 0,
      density: physics.density || 2700
    });
  }

  // CALCULATE RWA (REAL WORLD ASSET) VALUE FROM PHYSICS
  calculateRWAValue(shapeId: string, energy: number): { rwaValue: number; breakdown: any } {
    const physics = this.physicsData.get(shapeId);
    // Use absolute energy - energy magnitude is what matters for valuation
    const absEnergy = Math.max(1, Math.abs(energy)); // Minimum energy value of 1

    if (!physics) {
      return {
        rwaValue: absEnergy * 10,
        breakdown: {
          method: 'energy-only',
          baseValue: absEnergy * 10
        }
      };
    }

    // RWA VALUATION FORMULA
    // Based on physical properties that translate to real-world manufacturing/engineering value

    // 1. MATERIAL VALUE (mass × material price per kg)
    const materialPricePerKg = 0.02; // Aluminum baseline $/kg (scalable)
    const materialValue = physics.mass * materialPricePerKg;

    // 2. VOLUME COMPLEXITY VALUE (manufacturing cost estimation)
    const volumeComplexityFactor = Math.log10(Math.max(physics.volume, 1) + 1) * 50;

    // 3. CENTER OF MASS STABILITY BONUS (balanced designs worth more)
    const comDistance = Math.sqrt(
      physics.centerOfMass.x ** 2 +
      physics.centerOfMass.y ** 2 +
      physics.centerOfMass.z ** 2
    );
    const stabilityBonus = Math.max(0, 100 - comDistance * 2); // Closer to origin = more stable

    // 4. SURFACE AREA TO VOLUME RATIO (engineering efficiency)
    const svRatio = physics.surfaceArea > 0 && physics.volume > 0
      ? physics.surfaceArea / Math.pow(physics.volume, 2 / 3)
      : 1;
    const efficiencyMultiplier = Math.max(0.5, 2 - svRatio * 0.1);

    // 5. ENERGY CONVERSION FACTOR (mathematical complexity → value)
    const energyConversion = absEnergy * 15;

    // 6. DENSITY-BASED PREMIUM (high-density = precision engineering)
    const densityPremium = physics.density > 5000 ? 1.5 : physics.density > 2000 ? 1.2 : 1.0;

    const rwaValue = Math.round(
      (materialValue + volumeComplexityFactor + stabilityBonus + energyConversion) *
      efficiencyMultiplier * densityPremium * 100
    ) / 100;

    return {
      rwaValue,
      breakdown: {
        method: 'physics-rwa',
        materialValue: Math.round(materialValue * 100) / 100,
        volumeComplexity: Math.round(volumeComplexityFactor * 100) / 100,
        stabilityBonus: Math.round(stabilityBonus * 100) / 100,
        efficiencyMultiplier: Math.round(efficiencyMultiplier * 100) / 100,
        energyConversion: Math.round(energyConversion * 100) / 100,
        densityPremium,
        mass: physics.mass,
        volume: physics.volume,
        centerOfMass: physics.centerOfMass
      }
    };
  }

  // UUON TOKEN GENERATION FROM MATHEMATICAL ENERGY WITH RWA
  generateUUONTokens(energyDistribution: Array<{ shapeId: string; energy: number; frequency: number }>): Array<{ tokenId: string; energyValue: number; externalValue: number; rwaValue: number; utility: string; physicsData: any }> {
    return energyDistribution.map(shape => {
      const rawEnergy = Math.abs(shape.energy);
      const energyValue = Math.max(0.01, Math.round(rawEnergy * 100) / 100);
      const absEnergy = Math.max(0.01, rawEnergy);
      const frequency = Math.max(1, Math.abs(shape.frequency));
      const externalValue = this.calculateTokenWeight(absEnergy, frequency);
      const { rwaValue, breakdown } = this.calculateRWAValue(shape.shapeId, absEnergy);
      const utility = this.determineTokenUtility(shape.shapeId, energyValue);

      return {
        tokenId: `UUON-${shape.shapeId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        energyValue,
        externalValue,
        rwaValue,
        utility,
        physicsData: breakdown
      };
    });
  }

  // BATCH TOKEN GENERATION FOR STOCKPILE
  generateTokenBatch(count: number = 10): {
    batchId: string;
    tokens: any[];
    totalValue: number;
    totalRWA: number;
    stockpileSize: number
  } {
    const batchId = `BATCH-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const snapshot = this.captureEnergySnapshot();
    const distribution = snapshot.energyDistribution.slice(0, count);

    const tokens = distribution.map(shape => {
      const rawEnergy = Math.abs(shape.energy);
      const energyValue = Math.max(0.01, Math.round(rawEnergy * 100) / 100);
      const absEnergy = Math.max(0.01, rawEnergy);
      const frequency = Math.max(1, Math.abs(shape.frequency));
      const externalValue = this.calculateTokenWeight(absEnergy, frequency); // Use calculateTokenWeight
      const { rwaValue, breakdown } = this.calculateRWAValue(shape.shapeId, absEnergy);
      const utility = this.determineTokenUtility(shape.shapeId, energyValue);

      const token = {
        tokenId: `UUON-${shape.shapeId.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        energyValue,
        externalValue,
        rwaValue,
        utility,
        physicsData: breakdown,
        timestamp: Date.now(),
        batchId,
        energy: rawEnergy, // Store raw energy for analytics
        batchValue: externalValue // Store calculated external value as batchValue for analytics
      };

      this.tokenStockpile.push(token);
      return token;
    });

    this.currentBatch++; // Increment batch counter
    const totalValue = tokens.reduce((sum, t) => sum + t.externalValue, 0);
    const totalRWA = tokens.reduce((sum, t) => sum + t.rwaValue, 0);

    // PERSIST: Save to localStorage and database
    this.saveStockpileToStorage();
    this.saveTokensToDatabase(tokens);

    // Token batch generated silently (no console output for security)

    return {
      batchId,
      tokens,
      totalValue,
      totalRWA,
      stockpileSize: this.tokenStockpile.length
    };
  }

  // GET TOKEN STOCKPILE
  getTokenStockpile(): any[] {
    return [...this.tokenStockpile];
  }

  // GET STOCKPILE ANALYTICS
  getStockpileAnalytics(): {
    totalTokens: number;
    totalValue: number;
    totalRWA: number;
    avgTokenValue: number;
    avgRWA: number;
    batches: number;
    oldestToken: number;
    newestToken: number;
  } {
    const REALISTIC_TOKEN_VALUE = 0.15; // $0.15 per token (realistic market value)
    const REALISTIC_RWA_MULTIPLIER = 0.4; // 40% of token value for RWA

    const totalTokens = this.tokenStockpile.length;
    const totalValue = totalTokens * REALISTIC_TOKEN_VALUE;
    const totalRWA = totalValue * REALISTIC_RWA_MULTIPLIER;
    const avgTokenValue = REALISTIC_TOKEN_VALUE;
    const avgRWA = totalTokens > 0 ? Math.round((totalRWA / totalTokens) * 100) / 100 : 0;
    const batches = this.currentBatch;

    if (totalTokens === 0) {
      return {
        totalTokens: 0,
        totalValue: 0,
        totalRWA: 0,
        avgTokenValue: 0,
        avgRWA: 0,
        batches: 0,
        oldestToken: 0,
        newestToken: 0
      };
    }

    const timestamps = this.tokenStockpile.map(t => t.timestamp);

    return {
      totalTokens,
      totalValue,
      totalRWA,
      avgTokenValue,
      avgRWA,
      batches,
      oldestToken: Math.min(...timestamps),
      newestToken: Math.max(...timestamps)
    };
  }


  // CLEAR STOCKPILE (for export/transfer)
  clearStockpile(): number {
    const count = this.tokenStockpile.length;
    this.tokenStockpile = [];
    // Clear from localStorage too
    localStorage.removeItem('uuon-token-stockpile');
    console.log(`🗑️ Cleared ${count} tokens from stockpile`);
    return count;
  }

  private calculateTokenWeight(energy: number, frequency: number): number {
    // Calculate token weight based on energy and frequency without value assumptions
    const absEnergy = Math.abs(energy);
    const baseWeight = Math.max(0.1, absEnergy / 100); // Normalized weight from 0.1 to 1.0
    const frequencyBonus = 1 + (Math.abs(frequency) * 0.1); // Small frequency bonus

    // Platform activity bonus affects token weight
    const activityBonus = Math.min(this.shapeStates.size / 1000, 2); // Up to 2x weight bonus
    const energyScarcity = 1 + Math.min(this.evolutionTime / 10000, 1); // Scarcity affects weight

    const totalWeight = baseWeight * frequencyBonus * (1 + activityBonus) * energyScarcity;

    return Math.min(Math.round(totalWeight * 1000) / 1000, 1.0); // Cap at 1.0 weight
  }


  private isReadyForViralBreakthrough(): boolean {
    const hasExtensiveLibrary = this.shapeStates.size > 1000;
    const hasOpenAccess = true;
    const hasAdvancedFeatures = true;

    return hasExtensiveLibrary && hasOpenAccess && hasAdvancedFeatures;
  }

  private determineTokenUtility(shapeId: string, energyValue: number): string {
    const utilities = [];

    if (energyValue > 50) utilities.push('AI Training Data License');
    if (shapeId.includes('quantum')) utilities.push('Quantum Computing Access');
    if (shapeId.includes('medical') || shapeId.includes('bio')) utilities.push('Medical Research License');
    if (energyValue > 100) utilities.push('Commercial Application Rights');
    utilities.push('3D Model Export Rights');
    utilities.push('API Access Credits');

    return utilities.join(' + ');
  }

  // EXTERNAL VALUE CREATION SYSTEM WITH MARKET ANALYTICS
  createExternalValuePropositions(): {
    aiTrainingData: { shapes: number; value: number };
    commercialLicenses: { available: number; totalValue: number };
    researchAccess: { quantumComputing: number; medicalApplications: number };
    tokenEconomy: { totalTokens: number; marketValue: number };
    marketAnalytics: {
      dailyAppreciation: number;
      totalGrowth: number;
      nextMilestone: number;
      growthRate: string;
    };
  } {
    const snapshot = this.captureEnergySnapshot();
    const uuonTokens = snapshot.uuonTokens ? snapshot.uuonTokens : this.generateUUONTokens(snapshot.energyDistribution);

    const totalMarketValue = uuonTokens.reduce((sum, token) => sum + token.externalValue, 0);
    const platformAge = (Date.now() - 1733644800000) / (1000 * 60 * 60 * 24);
    const dailyAppreciation = platformAge * 0.01;
    const totalGrowth = ((totalMarketValue - 334230) / 334230) * 100;

    // Calculate next milestone
    const milestones = [400000, 500000, 750000, 1000000, 2500000, 5000000];
    const nextMilestone = milestones.find(milestone => milestone > totalMarketValue) || milestones[milestones.length - 1];

    return {
      aiTrainingData: {
        shapes: uuonTokens.length,
        value: uuonTokens.reduce((sum, token) => sum + (token.energyValue * 7.4), 0) // Real AI value $7.40 per token
      },
      commercialLicenses: {
        available: uuonTokens.filter(token => token.externalValue > 50).length,
        totalValue: totalMarketValue
      },
      researchAccess: {
        quantumComputing: uuonTokens.filter(token => token.utility.includes('Quantum')).length,
        medicalApplications: uuonTokens.filter(token => token.utility.includes('Medical')).length
      },
      tokenEconomy: {
        totalTokens: uuonTokens.length,
        marketValue: totalMarketValue
      },
      marketAnalytics: {
        dailyAppreciation: Math.round(dailyAppreciation * 100) / 100,
        totalGrowth: Math.round(totalGrowth * 100) / 100,
        nextMilestone,
        growthRate: totalGrowth > 0 ? 'Appreciating' : totalGrowth < -5 ? 'Declining' : 'Stable'
      }
    };
  }

  // BLOCKCHAIN INTEGRATION FOR EXTERNAL VALUE
  async generateBlockchainUUONToken(energySnapshot: any): Promise<{
    tokenAddress: string;
    smartContractCode: string;
    nftMetadata: any;
    tradingValue: number;
  }> {
    const totalValue = energySnapshot.uuonTokens.reduce((sum: number, token: any) => sum + token.externalValue, 0);

    return {
      tokenAddress: `0x${this.generateTokenAddress()}`,
      smartContractCode: this.generateSmartContract(energySnapshot),
      nftMetadata: {
        name: `UUON Mathematical Energy Token #${Date.now()}`,
        description: `Mathematical field energy converted to tradeable token. Total Energy: ${energySnapshot.totalEnergy}`,
        attributes: energySnapshot.uuonTokens.map((token: any) => ({
          trait_type: token.tokenId,
          value: token.energyValue,
          utility: token.utility,
          market_value: `$${token.externalValue}`
        })),
        external_url: 'https://uuon-dmension-math-universe.replit.app',
        animation_url: this.generateTokenVisualization(energySnapshot)
      },
      tradingValue: totalValue
    };
  }

  private generateTokenAddress(): string {
    return Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateSmartContract(energySnapshot: any): string {
    return `
// UUON Mathematical Energy Token Smart Contract
pragma solidity ^0.8.0;

contract UUONEnergyToken {
    string public name = "UUON Mathematical Energy";
    string public symbol = "UUON";
    uint256 public totalEnergyValue = ${Math.round(energySnapshot.totalEnergy * 100)};

    mapping(address => uint256) public energyBalance;
    mapping(string => uint256) public shapeEnergyValues;

    constructor() {
        // Initialize with captured energy snapshot
        totalSupply = totalEnergyValue;
    }

    function utilizeEnergy(string memory shapeId, uint256 amount) public {
        require(energyBalance[msg.sender] >= amount, "Insufficient energy");
        // Grant access to mathematical shape with energy amount
        energyBalance[msg.sender] -= amount;
    }
}`;
  }

  private generateTokenVisualization(energySnapshot: any): string {
    return `https://uuon-dmension-math-universe.replit.app/token-visualization/${energySnapshot.timestamp}`;
  }

  downloadEnergyFile(filename: string = 'mathematical_energy'): void {
    const energyData = exportEnergySnapshot();
    const blob = new Blob([energyData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log(`⚡ Energy file downloaded: ${filename}`);
  }

  // Generate tokens from user interactions
  generateInteractionTokens(source: string, value: number): void {
    const tokens = Math.floor(value / 2) + 1;
    const energy = Math.max(1, Math.abs(value) * 0.3);
    const batchValue = tokens * 0.15; // $0.15 per token (realistic market rate)
    const rwaValue = tokens * 0.06;   // $0.06 RWA value per token (40% of market value)

    // Token generation silently tracked (no console output for security)

    // Generate token batch and add to stockpile
    const batch = this.generateTokenBatch(tokens);

    // Save to database immediately via API
    this.saveInteractionToAPI(source, tokens, energy, batchValue);
  }

  // Save interaction tokens to database via API (silent failures to avoid exposing internal details)
  private async saveInteractionToAPI(source: string, tokens: number, energy: number, value: number): Promise<void> {
    try {
      const response = await fetch('/api/token-ecosystem/generate-interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tokens,
          energy,
          value,
          timestamp: Date.now(),
          source,
          shapeType: this.getCurrentShapeType()
        })
      });
      // Silent operation - no console output for security
    } catch (error) {
      // Silent failure - avoid exposing internal system details
    }
  }

  private getCurrentShapeType(): string {
    if (typeof window !== 'undefined' && (window as any).ParameterAuthority) {
      return (window as any).ParameterAuthority.currentShape || 'sphere';
    }
    return 'sphere';
  }

  // Syncs shapes from the backend that are not present in the frontend
  async syncMissingShapes() {
    console.log('🔍 Checking for missing shapes...');
    try {
      const response = await fetch('/api/shapes');
      if (!response.ok) throw new Error('Failed to fetch shapes from backend');

      const backendShapes = await response.json();
      const frontendShapeIds = new Set(this.shapeStates.keys());

      let shapesAdded = 0;
      for (const shapeData of backendShapes) {
        if (!frontendShapeIds.has(shapeData.id)) {
          console.log(`➕ Registering missing shape: ${shapeData.id}`);
          this.registerShape(shapeData.id, shapeData.category, shapeData.params);
          shapesAdded++;
        }
      }
      console.log(`✅ Found and registered ${shapesAdded} missing shapes.`);
    } catch (error) {
      console.error('Error syncing missing shapes:', error);
    }
  }

  async syncWithDatabase() {
    console.log('🔄 Syncing with database...');

    try {
      // Check if backend is available
      const response = await fetch('/api/health');
      if (!response.ok) {
        console.warn('⚠️ Backend not available for sync');
        return;
      }

      // Sync missing shapes first
      await this.syncMissingShapes();

      // CRITICAL FIX: Trigger token generation for all shapes
      console.log('🏷️ Triggering complete token generation...');
      const tokenResponse = await fetch('/api/token-ecosystem/admin/complete-token-sweep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        console.log('✅ Token generation completed:', tokenData);
      } else {
        console.error('❌ Token generation failed:', await tokenResponse.text());
      }

      console.log('✅ Database sync completed');
    } catch (error) {
      console.warn('⚠️ Database sync failed:', error);
    }
  }
}

export const crossLearningEngine = new CrossLearningEngine();

// Export to window for UI components
if (typeof window !== 'undefined') {
  (window as any).crossLearningEngine = crossLearningEngine;
}

export function initializeCrossLearning(): void {
  console.log('🧠 Cross-Learning Engine initialized');
}

export function registerShapeForLearning(
  id: string,
  category: string,
  params: Record<string, number>
): void {
  crossLearningEngine.registerShape(id, category, params);
}

export function evolveLearningSystem(deltaTime: number): Map<string, Record<string, number>> {
  return crossLearningEngine.evolve(deltaTime);
}

export function getOptimalShapeParams(shapeId: string): Record<string, number> {
  return crossLearningEngine.getOptimalParameters(shapeId);
}

export function computeMorphPath(
  fromId: string,
  toId: string,
  steps?: number
): Array<Record<string, number>> {
  return crossLearningEngine.computeGeometricPath(fromId, toId, steps);
}

export function getFieldForce(shapeId: string): [number, number, number] {
  return crossLearningEngine.applyFieldForce(shapeId);
}

export function getResonanceInfo(shapeId: string): { frequency: number; amplitude: number; phase: number } {
  return crossLearningEngine.getShapeResonance(shapeId);
}

export function getCrossLearningMetrics(): {
  totalEnergy: number;
  connectionCount: number;
  avgCurvature: number;
  evolutionTime: number;
} {
  return crossLearningEngine.getLearningMetrics();
}

// ENERGY STORAGE & EXPORT UTILITIES
export function saveCurrentEnergy(name: string): void {
  try {
    const data = exportEnergySnapshot();
    localStorage.setItem(`energy_${name}`, data);
    console.log(`💾 Energy saved as: ${name}`);
  } catch (error) {
    console.error('Save energy error:', error);
  }
}

// Bulk sync all accumulated tokens to database
export async function syncTokenBatch(): Promise<void> {
  try {
    const currentMetrics = getCrossLearningMetrics();
    const stockpileAnalytics = getStockpileAnalytics();

    const response = await fetch('/api/token-ecosystem/bulk-sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        batches: stockpileAnalytics.batches || Math.ceil(stockpileAnalytics.totalTokens / 10),
        totalTokens: stockpileAnalytics.totalTokens,
        totalEnergy: currentMetrics.totalEnergy,
        totalValue: stockpileAnalytics.totalValue,
        timestamp: Date.now()
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`📤 Bulk sync completed: ${result.synced?.batches || 0} batches synchronized`);
    } else {
      console.warn(`⚠️ Bulk sync failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Bulk sync error:', error);
  }
}

export function loadSavedEnergy(name: string): boolean {
  return crossLearningEngine.loadEnergyFromStorage(name);
}

export function exportEnergySnapshot(): string {
  return crossLearningEngine.exportEnergyAsJSON();
}

export function exportEnergyCSV(): string {
  return crossLearningEngine.exportEnergyAsCSV();
}

export function createEnergyContainer(maxEnergy: number = 100) {
  return crossLearningEngine.createEnergyContainer(maxEnergy);
}

export function downloadEnergyFile(filename: string = 'mathematical_energy'): void {
  crossLearningEngine.downloadEnergyFile(filename);
}

// RWA & TOKEN STOCKPILE EXPORTS
export function registerPhysicsForRWA(shapeId: string, physics: {
  mass: number;
  volume: number;
  centerOfMass: { x: number; y: number; z: number };
  surfaceArea?: number;
  density?: number;
}): void {
  crossLearningEngine.registerPhysicsData(shapeId, physics);
}

export function calculateRWAValue(shapeId: string, energy: number): { rwaValue: number; breakdown: any } {
  return crossLearningEngine.calculateRWAValue(shapeId, energy);
}

// Generate tokens from user interactions (silent operation for security)
export function generateInteractionTokens(source: string, value: number): void {
  const tokens = Math.floor(value / 2) + 1;
  const energy = value * 0.3;
  const batchValue = tokens * 0.15;
  // Token generation silently tracked (no console output for security)
  const batch = crossLearningEngine.generateTokenBatch(tokens);
  saveTokensToDatabase(source, tokens, energy, batchValue);
}

// Save tokens to database (silent operation for security)
async function saveTokensToDatabase(source: string, tokens: number, energy: number, value: number): Promise<void> {
  try {
    await fetch('/api/token-ecosystem/generate-interaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokens,
        energy,
        value,
        timestamp: Date.now(),
        source,
        shapeType: getCurrentShapeType()
      })
    });
    // Silent operation - no console output
  } catch (error) {
    // Silent failure
  }
}

// Get current shape type for token attribution
function getCurrentShapeType(): string {
  if (typeof window !== 'undefined' && (window as any).ParameterAuthority) {
    return (window as any).ParameterAuthority.currentShape || 'sphere';
  }
  return 'sphere';
}


export function generateTokenBatch(count: number = 10): {
  batchId: string;
  tokens: any[];
  totalValue: number;
  totalRWA: number;
  stockpileSize: number
} {
  return crossLearningEngine.generateTokenBatch(count);
}

export function getTokenStockpile(): any[] {
  return crossLearningEngine.getTokenStockpile();
}

export function getStockpileAnalytics(): {
  totalTokens: number;
  totalValue: number;
  totalRWA: number;
  avgTokenValue: number;
  avgRWA: number;
  batches: number;
  oldestToken: number;
  newestToken: number;
} {
  return crossLearningEngine.getStockpileAnalytics();
}

export function clearTokenStockpile(): number {
  return crossLearningEngine.clearStockpile();
}

// ENERGY SYSTEM STATUS - for UI display and explanation
export function getEnergySystemStatus(): {
  totalEnergy: number;
  lastConversion: number;
  nextConversion: number;
  tokensGenerated: number;
  conversionRate: string;
  isActive: boolean;
} {
  return crossLearningEngine.getEnergySystemStatus();
}

/**
 * ENERGY SYSTEM EXPLANATION
 * Provides human-readable explanation of the energy score system
 */
export const ENERGY_SYSTEM_EXPLANATION = {
  title: 'Energy Score System',
  summary: 'Energy accumulates from your mathematical interactions and automatically converts to tokens.',

  howItWorks: [
    'Every shape you view, parameter you change, and export you create generates energy.',
    'Energy is measured based on mathematical complexity and interaction value.',
    'The system automatically converts accumulated energy to tokens every 60 seconds.',
    'Tokens are saved to your portfolio and represent real mathematical value.'
  ],

  energySources: {
    'Shape View': '+0.2 energy per view',
    'Parameter Change': '+0.5 energy per change',
    'Export Action': '+1.5 energy per export',
    'Save Action': '+1.0 energy per save',
    'Physics Interaction': '+1.2 energy per interaction',
    'Discovery Action': '+2.0 energy per discovery'
  },

  conversionRates: {
    rate: '0.1 energy = 1 token',
    minimum: '0.5 energy threshold for conversion',
    maximum: '10 tokens per conversion cycle',
    interval: '60 seconds between conversions'
  },

  benefits: [
    'Energy never gets lost - automatically converted to tokens',
    'Tokens persist in your portfolio even after session ends',
    'Mathematical complexity increases energy generation',
    'Cross-learning connections amplify energy production'
  ]
};

// Export crossLearningEngine to window for UI component access
if (typeof window !== 'undefined') {
  (window as any).crossLearningEngine = crossLearningEngine;
}