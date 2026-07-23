/**
 * LATTICE NETWORK ENGINE
 * Advanced Auxetic Lattice System for Mathematical Object Networking
 * Based on UUON Foundation Lattice Technology
 * 
 * Integrates with existing Δmension Mathematical Universe platform
 */

import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';
import { apiRequest } from './queryClient';

export interface LatticeNode {
  id: string;
  position: THREE.Vector3;
  originalPosition: THREE.Vector3;
  value: number;
  energy: number;
  matter: number;
  momentum: THREE.Vector3;
  connections: string[];
  mathematicalObject?: string; // Shape type from our 502+ catalog
  cryptographicHash?: string;
  timestamp?: string;
  d13mon4Hash?: string;
  harmonicResonance?: number;
  tetrahedronData?: any;
}

export interface LatticeParams {
  type: 'hybrid' | 'uniform' | 'gradient' | 'quantum';
  angle: number;
  thickness: number;
  density: number;
  size: number;
  spacing: number;
}

export interface MatterEnergyAlgorithm {
  name: 'planck-resonance' | 'quantum-foam' | 'torsion-field';
  dimensionConstant: number;
  energyFlux: number;
  matterDensity: number;
  fieldCoupling: 'weak' | 'standard' | 'strong' | 'resonant';
}

export class LatticeNetworkEngine {
  private scene: THREE.Scene;
  private latticeGroup: THREE.Group;
  private energyFlowGroup: THREE.Group;
  private momentumGroup: THREE.Group;
  private nodeRegistry: Map<string, LatticeNode> = new Map();
  private quantumFoamParticles: any[] = [];
  private torsionSpirals: any[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.latticeGroup = new THREE.Group();
    this.energyFlowGroup = new THREE.Group();
    this.momentumGroup = new THREE.Group();

    scene.add(this.latticeGroup);
    scene.add(this.energyFlowGroup);
    scene.add(this.momentumGroup);
  }

  /**
   * Generate lattice network that can host mathematical objects
   */
  generateMathematicalLattice(
    params: LatticeParams,
    mathematicalObjects: string[] = []
  ): void {
    this.clearLattice();

    const { size, spacing, type, angle, thickness } = params;
    let objectIndex = 0;

    for (let x = -size; x <= size; x++) {
      for (let y = -size; y <= size; y++) {
        for (let z = -size; z <= size; z++) {
          const position = new THREE.Vector3(x * spacing, y * spacing, z * spacing);
          const nodeId = `${x},${y},${z}`;

          // Assign mathematical object if available
          const mathObject = mathematicalObjects[objectIndex % mathematicalObjects.length];
          objectIndex++;

          const node: LatticeNode = {
            id: nodeId,
            position: position.clone(),
            originalPosition: position.clone(),
            value: 0,
            energy: 0.5,
            matter: 0.5,
            momentum: new THREE.Vector3(0, 0, 0),
            connections: [],
            mathematicalObject: mathObject,
          };

          this.nodeRegistry.set(nodeId, node);
          this.createNodeVisualization(node, type, angle, thickness);
        }
      }
    }

    this.createNodeConnections();
  }

  /**
   * Apply spatial cryptographic tokenization with D13MON4 geometric hashing
   */
  async generateSpatialTokens(
    latitude: number,
    longitude: number,
    dimensionalOffset: number = 0.0
  ): Promise<void> {
    const phi = 1.618033988749;
    const pi = Math.PI;
    const sqrt3 = Math.sqrt(3);
    const timestamp = new Date().toISOString();

    for (const [nodeId, node] of Array.from(this.nodeRegistry)) {
      const coords = nodeId.split(',').map(Number);
      const [x, y, z] = coords;

      // Create dimensional entropy string
      const entropy = `${x * phi + y * pi + z * sqrt3 + dimensionalOffset}:${timestamp}:${latitude},${longitude}`;
      const encoder = new TextEncoder();
      const data = encoder.encode(entropy);

      try {
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Generate D13MON4 geometric hash via server API (algorithm never ships to client)
        const hashRes = await apiRequest('POST', '/api/d13mon4/hash', { inputText: entropy });
        const d13mon4Result = await hashRes.json();
        const resonanceRes = await apiRequest('POST', '/api/d13mon4/harmonic-resonance', { hash: d13mon4Result.circle_hash });
        const { resonance: harmonicResonance } = await resonanceRes.json();

        node.cryptographicHash = hashHex;
        node.d13mon4Hash = d13mon4Result.circle_hash;
        node.harmonicResonance = harmonicResonance;
        node.tetrahedronData = d13mon4Result.tetrahedra;
        node.timestamp = timestamp;

        // Update visual representation based on both hashes
        this.updateNodeCryptographicVisualization(node);
      } catch (error) {
        console.warn('Crypto API not available, using fallback hash');
        node.cryptographicHash = this.fallbackHash(entropy);
      }
    }
  }

  /**
   * Apply matter-energy algorithms to the lattice
   */
  applyMatterEnergyAlgorithm(algorithm: MatterEnergyAlgorithm): void {
    this.clearEnergyVisualization();

    for (const [nodeId, node] of Array.from(this.nodeRegistry)) {
      switch (algorithm.name) {
        case 'planck-resonance':
          this.applyPlanckResonance(node, algorithm);
          break;
        case 'quantum-foam':
          this.applyQuantumFoam(node, algorithm);
          break;
        case 'torsion-field':
          this.applyTorsionField(node, algorithm);
          break;
      }

      this.updateNodeEnergyVisualization(node);
    }

    this.createEnergyFlowLines();
  }

  /**
   * Host mathematical objects on lattice nodes
   */
  hostMathematicalObject(nodeId: string, shapeType: string, parameters: SurfaceParameters): void {
    const node = this.nodeRegistry.get(nodeId);
    if (!node) return;

    node.mathematicalObject = shapeType;

    // Create small preview of mathematical object at node
    this.createMathObjectPreview(node, shapeType, parameters);
  }

  /**
   * Connect lattice network to existing mathematical visualization system
   */
  connectToMathSystem(
    mathVisualizerRef: any,
    onNodeSelect?: (nodeId: string, mathObject: string) => void
  ): void {
    // Add click handlers for node selection
    this.addNodeInteractivity(onNodeSelect);

    // Sync with main math visualizer
    if (mathVisualizerRef && mathVisualizerRef.current) {
      // Integration points with your existing system
    }
  }

  // Private methods for lattice operations
  private createNodeVisualization(node: LatticeNode, type: string, angle: number, thickness: number): void {
    const geometry = new THREE.SphereGeometry(thickness * 1.5, 16, 16);
    const material = new THREE.MeshPhongMaterial({
      color: 0x4fc3f7,
      shininess: 80,
      transparent: true,
      opacity: 0.8
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(node.position);
    sphere.userData = { nodeId: node.id };

    this.latticeGroup.add(sphere);

    // Store reference for updates
    (node as any).meshObject = sphere;
  }

  private createNodeConnections(): void {
    // Create connections between nearby nodes
    for (const [nodeId, node] of Array.from(this.nodeRegistry)) {
      node.connections = [];

      for (const [otherId, otherNode] of Array.from(this.nodeRegistry)) {
        if (nodeId === otherId) continue;

        const distance = node.position.distanceTo(otherNode.position);
        if (distance < 12) { // Adjust connection threshold
          node.connections.push(otherId);
        }
      }
    }
  }

  private applyPlanckResonance(node: LatticeNode, algorithm: MatterEnergyAlgorithm): void {
    const distFromCenter = node.position.length();
    const normalizedDist = Math.min(distFromCenter / 50, 1);

    node.energy = (1 - normalizedDist * 0.8) * algorithm.dimensionConstant / 4.0;
    node.matter = algorithm.matterDensity * (0.5 + Math.random() * 0.5);
  }

  private applyQuantumFoam(node: LatticeNode, algorithm: MatterEnergyAlgorithm): void {
    node.energy = Math.random() * algorithm.dimensionConstant / 4.0;
    node.matter = Math.random() * algorithm.matterDensity;

    // Create quantum foam particles
    this.createQuantumFoamParticles(node.position, node.energy);
  }

  private applyTorsionField(node: LatticeNode, algorithm: MatterEnergyAlgorithm): void {
    const angle = Math.atan2(node.position.y, node.position.x);
    const radius = Math.sqrt(node.position.x * node.position.x + node.position.y * node.position.y);

    node.energy = (0.5 + 0.5 * Math.sin(angle * 3 + radius * 0.1)) * algorithm.dimensionConstant / 4.0;
    node.matter = algorithm.matterDensity * (0.5 + 0.5 * Math.cos(angle * 2));

    if (node.energy > 0.7) {
      this.createTorsionSpiral(node.position);
    }
  }

  private createQuantumFoamParticles(position: THREE.Vector3, energy: number): void {
    const particleCount = Math.floor(energy * 10) + 5;
    const radius = 3;

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const r = radius * Math.random();

      const x = position.x + r * Math.sin(phi) * Math.cos(theta);
      const y = position.y + r * Math.sin(phi) * Math.sin(theta);
      const z = position.z + r * Math.cos(phi);

      const particleGeometry = new THREE.SphereGeometry(0.05 + Math.random() * 0.1, 8, 8);
      const particleMaterial = new THREE.MeshPhongMaterial({
        color: 0x4fc3f7,
        emissive: 0x4fc3f7,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.7
      });

      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.position.set(x, y, z);

      this.energyFlowGroup.add(particle);
      this.quantumFoamParticles.push({
        object: particle,
        center: position.clone(),
        radius: r,
        theta,
        phi,
        speed: 0.01 + Math.random() * 0.02
      });
    }
  }

  private createTorsionSpiral(position: THREE.Vector3): void {
    const points = [];
    const turns = 3;
    const pointsPerTurn = 20;
    const totalPoints = turns * pointsPerTurn;
    const radius = 5;
    const height = 8;

    for (let i = 0; i < totalPoints; i++) {
      const t = i / totalPoints;
      const angle = turns * Math.PI * 2 * t;
      const r = radius * (1 - 0.5 * t);

      const x = position.x + r * Math.cos(angle);
      const y = position.y + r * Math.sin(angle);
      const z = position.z + height * t;

      points.push(new THREE.Vector3(x, y, z));
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeometry = new THREE.TubeGeometry(curve, totalPoints, 0.05, 8, false);
    const tubeMaterial = new THREE.MeshPhongMaterial({
      color: 0xff3366,
      emissive: 0xff3366,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7
    });

    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    this.energyFlowGroup.add(tube);

    this.torsionSpirals.push({
      object: tube,
      center: position.clone(),
      rotation: 0,
      speed: 0.01 + Math.random() * 0.01
    });
  }

  private updateNodeEnergyVisualization(node: LatticeNode): void {
    const meshObject = (node as any).meshObject;
    if (!meshObject || !meshObject.material) return;

    const energyColor = new THREE.Color(0x4fc3f7);
    const matterColor = new THREE.Color(0xff3366);
    const resultColor = new THREE.Color().copy(matterColor).lerp(energyColor, node.energy);

    if (meshObject.material.color) {
      meshObject.material.color.copy(resultColor);
    }
    if (meshObject.material.emissive) {
      meshObject.material.emissive.copy(energyColor);
      meshObject.material.emissiveIntensity = node.energy * 0.5;
    }
    meshObject.material.needsUpdate = true;

    const scale = 0.8 + node.matter * 0.4;
    meshObject.scale.set(scale, scale, scale);
  }

  private updateNodeCryptographicVisualization(node: LatticeNode): void {
    const meshObject = (node as any).meshObject;
    if (!meshObject || !meshObject.material || !node.cryptographicHash) return;

    const hashColor = new THREE.Color(
      parseInt(node.cryptographicHash.substr(0, 2), 16) / 255,
      parseInt(node.cryptographicHash.substr(2, 2), 16) / 255,
      parseInt(node.cryptographicHash.substr(4, 2), 16) / 255
    );

    if (meshObject.material.emissive) {
      meshObject.material.emissive.copy(hashColor);
      meshObject.material.emissiveIntensity = 0.7;
    }
    meshObject.material.needsUpdate = true;
  }

  private createEnergyFlowLines(): void {
    for (const [nodeId, node] of Array.from(this.nodeRegistry)) {
      for (const connId of node.connections) {
        const connNode = this.nodeRegistry.get(connId);
        if (!connNode) continue;

        const energyDiff = Math.abs(node.energy - connNode.energy);
        if (energyDiff > 0.2) {
          const material = new THREE.LineBasicMaterial({
            color: 0x4fc3f7,
            opacity: Math.min(energyDiff * 2, 1),
            transparent: true
          });

          const geometry = new THREE.BufferGeometry().setFromPoints([
            node.position,
            connNode.position
          ]);
          const line = new THREE.Line(geometry, material);

          this.energyFlowGroup.add(line);
        }
      }
    }
  }

  private createMathObjectPreview(node: LatticeNode, shapeType: string, parameters: SurfaceParameters): void {
    // Create small mathematical object preview at node location
    // This would integrate with your existing shape generation system
  }

  private addNodeInteractivity(onNodeSelect?: (nodeId: string, mathObject: string) => void): void {
    // Add raycasting and click handlers for node selection
  }

  private fallbackHash(input: string): string {
    // Simple hash function fallback for environments without crypto API
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private clearLattice(): void {
    this.latticeGroup.clear();
    this.clearEnergyVisualization();
    this.nodeRegistry.clear();
  }

  private clearEnergyVisualization(): void {
    this.energyFlowGroup.clear();
    this.quantumFoamParticles = [];
    this.torsionSpirals = [];
  }

  // Animation update method
  updateAnimation(): void {
    // Update quantum foam particles
    for (const particle of this.quantumFoamParticles) {
      particle.theta += particle.speed;

      const x = particle.center.x + particle.radius * Math.sin(particle.phi) * Math.cos(particle.theta);
      const y = particle.center.y + particle.radius * Math.sin(particle.phi) * Math.sin(particle.theta);
      const z = particle.center.z + particle.radius * Math.cos(particle.phi);

      particle.object.position.set(x, y, z);

      const scale = 0.8 + 0.4 * Math.sin(Date.now() * 0.003);
      particle.object.scale.set(scale, scale, scale);
    }

    // Update torsion spirals
    for (const spiral of this.torsionSpirals) {
      spiral.rotation += spiral.speed;
      spiral.object.rotation.z = spiral.rotation;

      const intensity = 0.3 + 0.2 * Math.sin(Date.now() * 0.001);
      spiral.object.material.emissiveIntensity = intensity;
    }
  }
}

export default LatticeNetworkEngine;