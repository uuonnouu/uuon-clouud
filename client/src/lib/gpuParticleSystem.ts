import * as THREE from 'three';

export interface ParticleSystemConfig {
  maxParticles: number;
  particleSize: number;
  useInstancing: boolean;
  usePointCloud: boolean;
  enablePooling: boolean;
  color: THREE.Color | number;
  emissive?: THREE.Color | number;
  emissiveIntensity?: number;
  opacity?: number;
  blending?: THREE.Blending;
}

export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  active: boolean;
}

export class GPUParticleSystem {
  private config: ParticleSystemConfig;
  private particles: Particle[] = [];
  private particlePool: Particle[] = [];
  private instancedMesh: THREE.InstancedMesh | null = null;
  private pointCloud: THREE.Points | null = null;
  private geometry: THREE.BufferGeometry | null = null;
  private material: THREE.Material | null = null;
  private dummy: THREE.Object3D = new THREE.Object3D();
  private activeCount: number = 0;

  constructor(config: Partial<ParticleSystemConfig> = {}) {
    this.config = {
      maxParticles: config.maxParticles || 10000,
      particleSize: config.particleSize || 0.02,
      useInstancing: config.useInstancing !== false,
      usePointCloud: config.usePointCloud || false,
      enablePooling: config.enablePooling !== false,
      color: config.color || 0x00ff88,
      emissive: config.emissive || 0x003311,
      emissiveIntensity: config.emissiveIntensity || 0.3,
      opacity: config.opacity || 1.0,
      blending: config.blending || THREE.NormalBlending
    };

    this.initializePool();
  }

  private initializePool(): void {
    if (this.config.enablePooling) {
      for (let i = 0; i < this.config.maxParticles; i++) {
        this.particlePool.push({
          position: new THREE.Vector3(),
          velocity: new THREE.Vector3(),
          life: 0,
          maxLife: 1,
          size: this.config.particleSize,
          color: new THREE.Color(this.config.color),
          active: false
        });
      }
    }
  }

  private getParticleFromPool(): Particle | null {
    if (this.config.enablePooling) {
      for (const particle of this.particlePool) {
        if (!particle.active) {
          particle.active = true;
          return particle;
        }
      }
      return null;
    }
    
    if (this.particles.length < this.config.maxParticles) {
      const particle: Particle = {
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
        size: this.config.particleSize,
        color: new THREE.Color(this.config.color),
        active: true
      };
      this.particles.push(particle);
      return particle;
    }
    return null;
  }

  private returnParticleToPool(particle: Particle): void {
    particle.active = false;
    particle.life = 0;
  }

  createFromGeometry(geometry: THREE.BufferGeometry): THREE.Object3D {
    const positions = geometry.attributes.position;
    if (!positions) {
      console.error('GPUParticleSystem: No position attribute in geometry');
      return new THREE.Object3D();
    }

    const pointCount = Math.min(positions.count, this.config.maxParticles);
    console.log(`🎮 GPUParticleSystem: Creating ${pointCount} particles (GPU-accelerated)`);

    if (this.config.usePointCloud) {
      return this.createPointCloud(geometry, pointCount);
    } else {
      return this.createInstancedMesh(geometry, pointCount);
    }
  }

  private createPointCloud(sourceGeometry: THREE.BufferGeometry, pointCount: number): THREE.Points {
    const positions = sourceGeometry.attributes.position;
    const colors = new Float32Array(pointCount * 3);
    const sizes = new Float32Array(pointCount);
    
    const baseColor = new THREE.Color(this.config.color);
    
    for (let i = 0; i < pointCount; i++) {
      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
      sizes[i] = this.config.particleSize * 50;
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(
      new Float32Array(positions.array.slice(0, pointCount * 3)), 3
    ));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    this.material = new THREE.PointsMaterial({
      size: this.config.particleSize * 50,
      vertexColors: true,
      transparent: this.config.opacity < 1,
      opacity: this.config.opacity,
      blending: this.config.blending,
      sizeAttenuation: true,
      depthWrite: false
    });

    this.pointCloud = new THREE.Points(this.geometry, this.material);
    this.pointCloud.name = 'GPUParticleSystem_Points';
    this.pointCloud.frustumCulled = false;

    console.log('✅ Point cloud created (lowest CPU usage)');
    return this.pointCloud;
  }

  private createInstancedMesh(sourceGeometry: THREE.BufferGeometry, pointCount: number): THREE.InstancedMesh {
    const positions = sourceGeometry.attributes.position;
    
    const sphereGeometry = new THREE.SphereGeometry(this.config.particleSize, 6, 4);
    
    const instanceMaterial = new THREE.MeshStandardMaterial({
      color: this.config.color,
      metalness: 0.5,
      roughness: 0.3,
      emissive: this.config.emissive,
      emissiveIntensity: this.config.emissiveIntensity,
      transparent: this.config.opacity < 1,
      opacity: this.config.opacity
    });

    this.instancedMesh = new THREE.InstancedMesh(sphereGeometry, instanceMaterial, pointCount);
    this.instancedMesh.name = 'GPUParticleSystem_Instanced';
    this.instancedMesh.frustumCulled = false;

    for (let i = 0; i < pointCount; i++) {
      this.dummy.position.set(
        positions.array[i * 3],
        positions.array[i * 3 + 1],
        positions.array[i * 3 + 2]
      );
      this.dummy.updateMatrix();
      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }
    this.instancedMesh.instanceMatrix.needsUpdate = true;

    console.log('✅ Instanced mesh created (GPU-accelerated, low CPU)');
    return this.instancedMesh;
  }

  update(deltaTime: number): void {
    if (this.config.enablePooling) {
      const activeParticles = this.particlePool.filter(p => p.active);
      this.activeCount = activeParticles.length;

      for (const particle of activeParticles) {
        particle.life -= deltaTime;
        if (particle.life <= 0) {
          this.returnParticleToPool(particle);
        } else {
          particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
        }
      }

      this.syncToGPU();
    }
  }

  private syncToGPU(): void {
    if (this.instancedMesh) {
      const activeParticles = this.config.enablePooling 
        ? this.particlePool.filter(p => p.active) 
        : this.particles;

      for (let i = 0; i < activeParticles.length; i++) {
        const particle = activeParticles[i];
        this.dummy.position.copy(particle.position);
        this.dummy.scale.setScalar(particle.size / this.config.particleSize);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
      }
      this.instancedMesh.instanceMatrix.needsUpdate = true;
      this.instancedMesh.count = activeParticles.length;
    }

    if (this.pointCloud && this.geometry) {
      const positions = this.geometry.attributes.position as THREE.BufferAttribute;
      const activeParticles = this.config.enablePooling 
        ? this.particlePool.filter(p => p.active) 
        : this.particles;

      for (let i = 0; i < activeParticles.length; i++) {
        const particle = activeParticles[i];
        positions.setXYZ(i, particle.position.x, particle.position.y, particle.position.z);
      }
      positions.needsUpdate = true;
    }
  }

  emit(position: THREE.Vector3, velocity: THREE.Vector3, life: number = 1): Particle | null {
    const particle = this.getParticleFromPool();
    if (particle) {
      particle.position.copy(position);
      particle.velocity.copy(velocity);
      particle.life = life;
      particle.maxLife = life;
      this.activeCount++;
    }
    return particle;
  }

  emitBurst(center: THREE.Vector3, count: number, spread: number = 1, life: number = 1): void {
    for (let i = 0; i < count; i++) {
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread
      );
      this.emit(center.clone(), velocity, life);
    }
  }

  getActiveCount(): number {
    return this.activeCount;
  }

  getMaxParticles(): number {
    return this.config.maxParticles;
  }

  dispose(): void {
    if (this.geometry) this.geometry.dispose();
    if (this.material) this.material.dispose();
    if (this.instancedMesh) {
      this.instancedMesh.geometry.dispose();
      if (this.instancedMesh.material instanceof THREE.Material) {
        this.instancedMesh.material.dispose();
      }
    }
    this.particles = [];
    this.particlePool = [];
    console.log('🧹 GPUParticleSystem disposed');
  }

  exportToPLY(): string {
    const activeParticles = this.config.enablePooling 
      ? this.particlePool.filter(p => p.active) 
      : this.particles;

    let ply = `ply
format ascii 1.0
element vertex ${activeParticles.length}
property float x
property float y
property float z
property uchar red
property uchar green
property uchar blue
end_header
`;

    for (const particle of activeParticles) {
      const r = Math.floor(particle.color.r * 255);
      const g = Math.floor(particle.color.g * 255);
      const b = Math.floor(particle.color.b * 255);
      ply += `${particle.position.x.toFixed(6)} ${particle.position.y.toFixed(6)} ${particle.position.z.toFixed(6)} ${r} ${g} ${b}\n`;
    }

    return ply;
  }

  exportToBinary(): ArrayBuffer {
    const activeParticles = this.config.enablePooling 
      ? this.particlePool.filter(p => p.active) 
      : this.particles;

    const buffer = new ArrayBuffer(activeParticles.length * 24);
    const view = new DataView(buffer);
    
    let offset = 0;
    for (const particle of activeParticles) {
      view.setFloat32(offset, particle.position.x, true); offset += 4;
      view.setFloat32(offset, particle.position.y, true); offset += 4;
      view.setFloat32(offset, particle.position.z, true); offset += 4;
      view.setFloat32(offset, particle.color.r, true); offset += 4;
      view.setFloat32(offset, particle.color.g, true); offset += 4;
      view.setFloat32(offset, particle.color.b, true); offset += 4;
    }

    return buffer;
  }
}

export function createOptimizedParticleExport(
  geometry: THREE.BufferGeometry,
  format: 'ply' | 'binary' | 'glb' = 'ply'
): { data: string | ArrayBuffer; filename: string; mimeType: string } {
  const positions = geometry.attributes.position;
  if (!positions) {
    throw new Error('Geometry has no position attribute');
  }

  const pointCount = positions.count;
  console.log(`📦 Exporting ${pointCount} points as ${format.toUpperCase()}`);

  if (format === 'ply') {
    let ply = `ply
format ascii 1.0
comment GPU Particle System Export
element vertex ${pointCount}
property float x
property float y
property float z
end_header
`;
    for (let i = 0; i < pointCount; i++) {
      ply += `${positions.getX(i).toFixed(6)} ${positions.getY(i).toFixed(6)} ${positions.getZ(i).toFixed(6)}\n`;
    }
    return { data: ply, filename: 'particles.ply', mimeType: 'application/octet-stream' };
  }

  if (format === 'binary') {
    const buffer = new ArrayBuffer(pointCount * 12);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < pointCount; i++) {
      view.setFloat32(offset, positions.getX(i), true); offset += 4;
      view.setFloat32(offset, positions.getY(i), true); offset += 4;
      view.setFloat32(offset, positions.getZ(i), true); offset += 4;
    }
    return { data: buffer, filename: 'particles.bin', mimeType: 'application/octet-stream' };
  }

  throw new Error(`Unsupported format: ${format}`);
}

export default GPUParticleSystem;
