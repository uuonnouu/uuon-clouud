import * as THREE from 'three';
import { LightingSettings } from '../stores/lightingStore';

export interface BakingOptions {
  method: 'vertex_colors' | 'emissive' | 'both';
  ambientOcclusion: boolean;
  intensity: number;
}

const DEFAULT_BAKING_OPTIONS: BakingOptions = {
  method: 'vertex_colors',
  ambientOcclusion: true,
  intensity: 1.0
};

export class LightingBaker {
  private lighting: LightingSettings;
  private options: BakingOptions;

  constructor(lighting: LightingSettings, options: Partial<BakingOptions> = {}) {
    this.lighting = lighting;
    this.options = { ...DEFAULT_BAKING_OPTIONS, ...options };
  }

  bakeLightingToMesh(mesh: THREE.Mesh): THREE.Mesh {
    const geometry = mesh.geometry.clone();
    const material = mesh.material as THREE.MeshStandardMaterial;
    
    if (this.options.method === 'vertex_colors' || this.options.method === 'both') {
      this.bakeToVertexColors(geometry, mesh);
    }
    
    const bakedMaterial = this.createBakedMaterial(material);
    
    const bakedMesh = new THREE.Mesh(geometry, bakedMaterial);
    bakedMesh.position.copy(mesh.position);
    bakedMesh.rotation.copy(mesh.rotation);
    bakedMesh.scale.copy(mesh.scale);
    bakedMesh.name = mesh.name || 'baked_mesh';
    
    return bakedMesh;
  }

  private bakeToVertexColors(geometry: THREE.BufferGeometry, mesh: THREE.Mesh): void {
    const positions = geometry.attributes.position;
    const normals = geometry.attributes.normal;
    
    if (!normals) {
      geometry.computeVertexNormals();
    }
    
    const normalAttr = geometry.attributes.normal;
    const vertexCount = positions.count;
    const colors = new Float32Array(vertexCount * 3);
    
    const keyLightDir = new THREE.Vector3(
      this.lighting.keyLightX,
      this.lighting.keyLightY,
      this.lighting.keyLightZ
    ).normalize();
    
    const keyLightColor = new THREE.Color(this.lighting.keyLightColor);
    const fillLightColor = new THREE.Color(this.lighting.fillLightColor);
    const rimLightColor = new THREE.Color(this.lighting.rimLightColor);
    const ambientColor = new THREE.Color(this.lighting.ambientColor);
    
    const fillLightDir = new THREE.Vector3(-keyLightDir.x, keyLightDir.y * 0.5, -keyLightDir.z).normalize();
    const rimLightDir = new THREE.Vector3(-keyLightDir.x, -0.2, -keyLightDir.z).normalize();
    
    const worldNormal = new THREE.Vector3();
    const finalColor = new THREE.Color();
    
    for (let i = 0; i < vertexCount; i++) {
      worldNormal.set(
        normalAttr.getX(i),
        normalAttr.getY(i),
        normalAttr.getZ(i)
      );
      
      mesh.localToWorld(worldNormal);
      worldNormal.normalize();
      
      const ambient = ambientColor.clone().multiplyScalar(this.lighting.ambientIntensity);
      
      const keyDot = Math.max(0, worldNormal.dot(keyLightDir));
      const keyContrib = keyLightColor.clone().multiplyScalar(keyDot * this.lighting.keyLightIntensity);
      
      const fillDot = Math.max(0, worldNormal.dot(fillLightDir));
      const fillContrib = fillLightColor.clone().multiplyScalar(fillDot * this.lighting.fillLightIntensity);
      
      const rimDot = Math.pow(Math.max(0, 1 - Math.abs(worldNormal.dot(keyLightDir))), 2);
      const rimContrib = rimLightColor.clone().multiplyScalar(rimDot * this.lighting.rimLightIntensity);
      
      finalColor.set(0, 0, 0);
      finalColor.add(ambient);
      finalColor.add(keyContrib);
      finalColor.add(fillContrib);
      finalColor.add(rimContrib);
      
      finalColor.multiplyScalar(this.options.intensity);
      
      finalColor.r = Math.min(1, finalColor.r);
      finalColor.g = Math.min(1, finalColor.g);
      finalColor.b = Math.min(1, finalColor.b);
      
      colors[i * 3] = finalColor.r;
      colors[i * 3 + 1] = finalColor.g;
      colors[i * 3 + 2] = finalColor.b;
    }
    
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  }

  private createBakedMaterial(originalMaterial: THREE.MeshStandardMaterial): THREE.MeshStandardMaterial {
    const bakedMaterial = originalMaterial.clone();
    
    if (this.options.method === 'vertex_colors' || this.options.method === 'both') {
      bakedMaterial.vertexColors = true;
    }
    
    if (this.options.method === 'emissive' || this.options.method === 'both') {
      const emissiveIntensity = (
        this.lighting.ambientIntensity * 0.3 +
        this.lighting.keyLightIntensity * 0.4 +
        this.lighting.fillLightIntensity * 0.2 +
        this.lighting.rimLightIntensity * 0.1
      ) * this.options.intensity;
      
      const avgColor = new THREE.Color(this.lighting.keyLightColor);
      avgColor.lerp(new THREE.Color(this.lighting.ambientColor), 0.3);
      
      bakedMaterial.emissive = avgColor;
      bakedMaterial.emissiveIntensity = emissiveIntensity * 0.5;
    }
    
    bakedMaterial.metalness = Math.max(0, bakedMaterial.metalness - 0.2);
    bakedMaterial.roughness = Math.min(1, bakedMaterial.roughness + 0.1);
    
    return bakedMaterial;
  }

  static bakeSceneForExport(
    scene: THREE.Scene | THREE.Group,
    lighting: LightingSettings,
    options: Partial<BakingOptions> = {}
  ): THREE.Scene {
    const baker = new LightingBaker(lighting, options);
    const bakedScene = new THREE.Scene();
    bakedScene.name = 'baked_export_scene';
    
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        const bakedMesh = baker.bakeLightingToMesh(object);
        bakedScene.add(bakedMesh);
      }
    });
    
    console.log(`🔆 Lighting baked to ${bakedScene.children.length} meshes`);
    return bakedScene;
  }
}

export function createBakedExportMaterial(
  baseMaterial: THREE.MeshStandardMaterial,
  lighting: LightingSettings,
  bakeIntensity: number = 1.0
): THREE.MeshStandardMaterial {
  const bakedMaterial = baseMaterial.clone();
  
  const lightIntensity = (
    lighting.ambientIntensity +
    lighting.keyLightIntensity * 0.8 +
    lighting.fillLightIntensity * 0.5
  ) / 2.5;
  
  const lightTint = new THREE.Color(lighting.keyLightColor);
  lightTint.lerp(new THREE.Color('#ffffff'), 0.5);
  
  if (bakedMaterial.color) {
    bakedMaterial.color.multiply(lightTint);
    bakedMaterial.color.multiplyScalar(0.8 + lightIntensity * 0.4 * bakeIntensity);
  }
  
  bakedMaterial.emissive = new THREE.Color(lighting.ambientColor);
  bakedMaterial.emissiveIntensity = lighting.ambientIntensity * 0.3 * bakeIntensity;
  
  return bakedMaterial;
}
