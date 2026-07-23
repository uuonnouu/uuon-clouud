
/**
 * ELECTROMAGNETIC FIELD RENDERER
 * Advanced visualization system for Maxwell's equations and electromagnetic phenomena
 * Handles real-time field line rendering, wave propagation, and field interactions
 */

import * as THREE from 'three';
import { SurfaceParameters } from '../types/math';
import { maxwellFieldEngine, ELECTROMAGNETIC_CONSTANTS, FieldVector } from './maxwellFieldTheory';

export interface ElectromagneticVisualizationConfig {
  showElectricField: boolean;
  showMagneticField: boolean;
  showFieldLines: boolean;
  showEnergyDensity: boolean;
  fieldLineCount: number;
  animationSpeed: number;
  fieldStrength: number;
  transparency: number;
}

export class ElectromagneticFieldRenderer {
  private scene: THREE.Scene;
  private fieldLinesMaterial: THREE.LineBasicMaterial;
  private electricFieldMaterial: THREE.MeshBasicMaterial;
  private magneticFieldMaterial: THREE.MeshBasicMaterial;
  private energyDensityMaterial: THREE.MeshBasicMaterial;
  
  private electricFieldLines: THREE.Group;
  private magneticFieldLines: THREE.Group;
  private energyVisualization: THREE.Group;
  
  private animationTime: number = 0;
  
  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.initializeMaterials();
    this.initializeFieldGroups();
  }
  
  private initializeMaterials(): void {
    // Electric field - blue
    this.electricFieldMaterial = new THREE.MeshBasicMaterial({
      color: 0x0080ff,
      transparent: true,
      opacity: 0.7
    });
    
    // Magnetic field - red
    this.magneticFieldMaterial = new THREE.MeshBasicMaterial({
      color: 0xff4040,
      transparent: true,
      opacity: 0.7
    });
    
    // Energy density - yellow/gold
    this.energyDensityMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.5
    });
    
    // Field lines
    this.fieldLinesMaterial = new THREE.LineBasicMaterial({
      color: 0x40ff40,
      transparent: true,
      opacity: 0.8
    });
  }
  
  private initializeFieldGroups(): void {
    this.electricFieldLines = new THREE.Group();
    this.magneticFieldLines = new THREE.Group();
    this.energyVisualization = new THREE.Group();
    
    this.scene.add(this.electricFieldLines);
    this.scene.add(this.magneticFieldLines);
    this.scene.add(this.energyVisualization);
  }
  
  /**
   * Render electromagnetic wave propagation
   */
  renderElectromagneticWave(
    params: SurfaceParameters,
    config: ElectromagneticVisualizationConfig
  ): void {
    this.clearPreviousRender();
    
    const waveLength = 4;
    const amplitude = params.a ?? 1;
    const frequency = params.b ?? 1;
    const time = this.animationTime * config.animationSpeed;
    
    // Create wave geometry
    const wavePoints: THREE.Vector3[] = [];
    const electricFieldVectors: THREE.Vector3[] = [];
    const magneticFieldVectors: THREE.Vector3[] = [];
    
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * waveLength - waveLength / 2;
      const wavePhase = 2 * Math.PI * x / waveLength - frequency * time;
      
      // Electric field (oscillates in Y)
      const E_y = amplitude * Math.sin(wavePhase);
      
      // Magnetic field (oscillates in Z, perpendicular to E)
      const B_z = amplitude * Math.cos(wavePhase) / ELECTROMAGNETIC_CONSTANTS.C;
      
      wavePoints.push(new THREE.Vector3(x, 0, 0));
      electricFieldVectors.push(new THREE.Vector3(x, E_y, 0));
      magneticFieldVectors.push(new THREE.Vector3(x, 0, B_z));
    }
    
    // Render electric field
    if (config.showElectricField) {
      this.renderFieldVectors(electricFieldVectors, this.electricFieldMaterial, 'electric');
    }
    
    // Render magnetic field  
    if (config.showMagneticField) {
      this.renderFieldVectors(magneticFieldVectors, this.magneticFieldMaterial, 'magnetic');
    }
    
    // Render energy density
    if (config.showEnergyDensity) {
      this.renderEnergyDensity(wavePoints, electricFieldVectors, magneticFieldVectors);
    }
  }
  
  /**
   * Render field lines from point charges
   */
  renderElectricFieldLines(
    charges: Array<{ pos: FieldVector; q: number }>,
    config: ElectromagneticVisualizationConfig
  ): void {
    if (!config.showFieldLines) return;
    
    charges.forEach(charge => {
      const fieldLines = this.calculateElectricFieldLines(charge, config.fieldLineCount);
      
      fieldLines.forEach(line => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line);
        const fieldLine = new THREE.Line(geometry, this.fieldLinesMaterial);
        this.electricFieldLines.add(fieldLine);
      });
    });
  }
  
  /**
   * Render magnetic field lines (dipole pattern)
   */
  renderMagneticFieldLines(
    dipoles: Array<{ pos: FieldVector; moment: FieldVector }>,
    config: ElectromagneticVisualizationConfig
  ): void {
    if (!config.showFieldLines) return;
    
    dipoles.forEach(dipole => {
      const fieldLines = this.calculateMagneticFieldLines(dipole, config.fieldLineCount);
      
      fieldLines.forEach(line => {
        const geometry = new THREE.BufferGeometry().setFromPoints(line);
        const fieldLine = new THREE.Line(geometry, this.fieldLinesMaterial);
        this.magneticFieldLines.add(fieldLine);
      });
    });
  }
  
  /**
   * Render Faraday induction visualization
   */
  renderFaradayInduction(
    loopRadius: number,
    magneticField: (time: number) => number,
    config: ElectromagneticVisualizationConfig
  ): void {
    const time = this.animationTime * config.animationSpeed;
    const B_field = magneticField(time);
    const dB_dt = config.fieldStrength * Math.cos(time); // Derivative for induced field
    
    // Conducting loop
    const loopGeometry = new THREE.RingGeometry(loopRadius - 0.02, loopRadius + 0.02, 32);
    const loopMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
    const loop = new THREE.Mesh(loopGeometry, loopMaterial);
    this.electricFieldLines.add(loop);
    
    // Induced electric field (circular)
    if (config.showElectricField && Math.abs(dB_dt) > 0.01) {
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * 2 * Math.PI;
        const x = loopRadius * Math.cos(angle);
        const y = loopRadius * Math.sin(angle);
        
        // Electric field vector (tangential to loop)
        const E_magnitude = Math.abs(dB_dt) * loopRadius / 2;
        const E_x = -E_magnitude * Math.sin(angle) * 0.5;
        const E_y = E_magnitude * Math.cos(angle) * 0.5;
        
        const arrowGeometry = new THREE.ConeGeometry(0.02, 0.1, 8);
        const arrow = new THREE.Mesh(arrowGeometry, this.electricFieldMaterial);
        arrow.position.set(x, y, 0);
        arrow.lookAt(x + E_x, y + E_y, 0);
        this.electricFieldLines.add(arrow);
      }
    }
  }
  
  /**
   * Calculate electric field lines from a point charge
   */
  private calculateElectricFieldLines(
    charge: { pos: FieldVector; q: number },
    lineCount: number
  ): THREE.Vector3[][] {
    const fieldLines: THREE.Vector3[][] = [];
    const maxDistance = 3;
    const stepSize = 0.05;
    
    for (let i = 0; i < lineCount; i++) {
      const angle1 = (i / lineCount) * 2 * Math.PI;
      const angle2 = Math.acos(1 - 2 * Math.random()); // Random spherical distribution
      
      const startDir = new THREE.Vector3(
        Math.sin(angle2) * Math.cos(angle1),
        Math.sin(angle2) * Math.sin(angle1),
        Math.cos(angle2)
      );
      
      const line: THREE.Vector3[] = [];
      let currentPos = new THREE.Vector3(
        charge.pos.x + startDir.x * 0.1,
        charge.pos.y + startDir.y * 0.1,
        charge.pos.z + startDir.z * 0.1
      );
      
      // Trace field line
      for (let step = 0; step < maxDistance / stepSize; step++) {
        line.push(currentPos.clone());
        
        // Calculate field direction
        const r = currentPos.clone().sub(new THREE.Vector3(charge.pos.x, charge.pos.y, charge.pos.z));
        const rMag = r.length();
        
        if (rMag < 0.01 || rMag > maxDistance) break;
        
        const fieldDir = r.normalize();
        if (charge.q < 0) fieldDir.multiplyScalar(-1); // Reverse for negative charges
        
        currentPos.add(fieldDir.multiplyScalar(stepSize));
      }
      
      if (line.length > 2) {
        fieldLines.push(line);
      }
    }
    
    return fieldLines;
  }
  
  /**
   * Calculate magnetic field lines for a dipole
   */
  private calculateMagneticFieldLines(
    dipole: { pos: FieldVector; moment: FieldVector },
    lineCount: number
  ): THREE.Vector3[][] {
    const fieldLines: THREE.Vector3[][] = [];
    const maxDistance = 2;
    const stepSize = 0.03;
    
    // Create field lines starting from north and south poles
    for (let i = 0; i < lineCount; i++) {
      const phi = (i / lineCount) * 2 * Math.PI;
      
      // Start from north pole
      const startPos = new THREE.Vector3(
        dipole.pos.x + 0.1 * Math.cos(phi),
        dipole.pos.y + 0.1 * Math.sin(phi),
        dipole.pos.z + 0.5
      );
      
      const line = this.traceMagneticFieldLine(startPos, dipole, stepSize, maxDistance);
      if (line.length > 2) {
        fieldLines.push(line);
      }
    }
    
    return fieldLines;
  }
  
  /**
   * Trace a single magnetic field line
   */
  private traceMagneticFieldLine(
    startPos: THREE.Vector3,
    dipole: { pos: FieldVector; moment: FieldVector },
    stepSize: number,
    maxDistance: number
  ): THREE.Vector3[] {
    const line: THREE.Vector3[] = [];
    let currentPos = startPos.clone();
    
    for (let step = 0; step < maxDistance / stepSize; step++) {
      line.push(currentPos.clone());
      
      // Calculate magnetic field direction (simplified dipole field)
      const r = currentPos.clone().sub(new THREE.Vector3(dipole.pos.x, dipole.pos.y, dipole.pos.z));
      const rMag = r.length();
      
      if (rMag < 0.05 || rMag > maxDistance) break;
      
      // Simplified magnetic dipole field calculation
      const moment = new THREE.Vector3(dipole.moment.x, dipole.moment.y, dipole.moment.z);
      const rDotM = r.dot(moment);
      
      const B = r.clone().multiplyScalar(3 * rDotM / (rMag * rMag)).sub(moment);
      B.normalize();
      
      currentPos.add(B.multiplyScalar(stepSize));
    }
    
    return line;
  }
  
  /**
   * Render field vectors as arrows
   */
  private renderFieldVectors(
    vectors: THREE.Vector3[],
    material: THREE.Material,
    fieldType: string
  ): void {
    vectors.forEach((vector, index) => {
      if (index % 5 === 0) { // Subsample for performance
        const arrowGeometry = new THREE.ConeGeometry(0.02, 0.1, 8);
        const arrow = new THREE.Mesh(arrowGeometry, material);
        
        arrow.position.copy(vector);
        
        if (fieldType === 'electric') {
          arrow.lookAt(vector.x, vector.y + 0.1, vector.z);
          this.electricFieldLines.add(arrow);
        } else if (fieldType === 'magnetic') {
          arrow.lookAt(vector.x, vector.y, vector.z + 0.1);
          this.magneticFieldLines.add(arrow);
        }
      }
    });
  }
  
  /**
   * Render energy density visualization
   */
  private renderEnergyDensity(
    positions: THREE.Vector3[],
    electricField: THREE.Vector3[],
    magneticField: THREE.Vector3[]
  ): void {
    positions.forEach((pos, index) => {
      if (index < electricField.length && index < magneticField.length) {
        const E = electricField[index];
        const B = magneticField[index];
        
        // Energy density: u = (ε₀E² + B²/μ₀)/2
        const E_magnitude = E.length();
        const B_magnitude = B.length();
        const energyDensity = 0.5 * (
          ELECTROMAGNETIC_CONSTANTS.EPSILON_0 * E_magnitude * E_magnitude +
          B_magnitude * B_magnitude / ELECTROMAGNETIC_CONSTANTS.MU_0
        );
        
        if (energyDensity > 0.01) {
          const sphereGeometry = new THREE.SphereGeometry(0.02 * Math.sqrt(energyDensity), 8, 6);
          const energySphere = new THREE.Mesh(sphereGeometry, this.energyDensityMaterial);
          energySphere.position.copy(pos);
          this.energyVisualization.add(energySphere);
        }
      }
    });
  }
  
  /**
   * Update animation
   */
  update(deltaTime: number): void {
    this.animationTime += deltaTime;
  }
  
  /**
   * Clear previous render
   */
  private clearPreviousRender(): void {
    this.electricFieldLines.clear();
    this.magneticFieldLines.clear();
    this.energyVisualization.clear();
  }
  
  /**
   * Set visibility of field components
   */
  setVisibility(config: ElectromagneticVisualizationConfig): void {
    this.electricFieldLines.visible = config.showElectricField;
    this.magneticFieldLines.visible = config.showMagneticField;
    this.energyVisualization.visible = config.showEnergyDensity;
    
    // Update material transparency
    this.electricFieldMaterial.opacity = config.transparency;
    this.magneticFieldMaterial.opacity = config.transparency;
    this.energyDensityMaterial.opacity = config.transparency * 0.7;
  }
  
  /**
   * Dispose of resources
   */
  dispose(): void {
    this.electricFieldLines.clear();
    this.magneticFieldLines.clear();
    this.energyVisualization.clear();
    
    this.electricFieldMaterial.dispose();
    this.magneticFieldMaterial.dispose();
    this.energyDensityMaterial.dispose();
    this.fieldLinesMaterial.dispose();
  }
}

console.log('⚡ Electromagnetic Field Renderer initialized');
console.log('   • Real-time field line visualization');
console.log('   • Wave propagation rendering');
console.log('   • Energy density mapping');
