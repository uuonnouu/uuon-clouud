/**
 * PBR TEXTURE GENERATOR FOR GLB EXPORT
 * 
 * Generates complete PBR texture maps from geometry and material values:
 * - Normal Map: From geometry curvature analysis
 * - Metallic-Roughness Map: Combined R/G channels (glTF standard)
 * - Ambient Occlusion Map: From vertex accessibility analysis
 * - Emissive Map: From material emissive properties
 * 
 * Author: UUON Foundation Inc.
 */

import * as THREE from 'three';

export interface PBRTextureSet {
  normalMap: THREE.DataTexture | null;
  metallicRoughnessMap: THREE.DataTexture | null;
  aoMap: THREE.DataTexture | null;
  emissiveMap: THREE.DataTexture | null;
}

export interface PBRGenerationOptions {
  resolution: number;
  generateNormal: boolean;
  generateMetallicRoughness: boolean;
  generateAO: boolean;
  generateEmissive: boolean;
  normalStrength: number;
  aoSamples: number;
  aoRadius: number;
}

const DEFAULT_OPTIONS: PBRGenerationOptions = {
  resolution: 256,
  generateNormal: false,
  generateMetallicRoughness: true,
  generateAO: false,
  generateEmissive: false,
  normalStrength: 1.0,
  aoSamples: 8,
  aoRadius: 0.5
};

export function generatePBRTextures(
  geometry: THREE.BufferGeometry,
  material: THREE.MeshStandardMaterial,
  options: Partial<PBRGenerationOptions> = {}
): PBRTextureSet {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const res = opts.resolution;

  return {
    normalMap: opts.generateNormal ? generateNormalMap(geometry, res, opts.normalStrength) : null,
    metallicRoughnessMap: opts.generateMetallicRoughness ? generateMetallicRoughnessMap(material, res) : null,
    aoMap: opts.generateAO ? generateAOMap(geometry, res, opts.aoSamples, opts.aoRadius) : null,
    emissiveMap: opts.generateEmissive ? generateEmissiveMap(material, res) : null
  };
}

function generateNormalMap(
  geometry: THREE.BufferGeometry,
  resolution: number,
  strength: number
): THREE.DataTexture {
  const data = new Uint8Array(resolution * resolution * 4);
  
  const positions = geometry.attributes.position;
  const uvs = geometry.attributes.uv;
  const normals = geometry.attributes.normal;
  
  if (!positions || !normals) {
    for (let i = 0; i < resolution * resolution; i++) {
      data[i * 4] = 128;
      data[i * 4 + 1] = 128;
      data[i * 4 + 2] = 255;
      data[i * 4 + 3] = 255;
    }
    return createDataTexture(data, resolution);
  }
  
  const tempNormal = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const bitangent = new THREE.Vector3();
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      const vertexIndex = findClosestVertex(uvs, u, v, positions.count);
      
      if (vertexIndex >= 0 && vertexIndex < positions.count) {
        tempNormal.set(
          normals.getX(vertexIndex),
          normals.getY(vertexIndex),
          normals.getZ(vertexIndex)
        ).normalize();
        
        const curvature = computeLocalCurvature(geometry, vertexIndex);
        
        tangent.set(1, 0, 0);
        bitangent.crossVectors(tempNormal, tangent).normalize();
        tangent.crossVectors(bitangent, tempNormal).normalize();
        
        const perturbX = curvature.x * strength * 0.5;
        const perturbY = curvature.y * strength * 0.5;
        
        const idx = (y * resolution + x) * 4;
        data[idx] = Math.floor((perturbX + 1) * 0.5 * 255);
        data[idx + 1] = Math.floor((perturbY + 1) * 0.5 * 255);
        data[idx + 2] = Math.floor((1 - Math.abs(perturbX) * 0.5 - Math.abs(perturbY) * 0.5) * 255);
        data[idx + 3] = 255;
      } else {
        const idx = (y * resolution + x) * 4;
        data[idx] = 128;
        data[idx + 1] = 128;
        data[idx + 2] = 255;
        data[idx + 3] = 255;
      }
    }
  }
  
  return createDataTexture(data, resolution, THREE.LinearSRGBColorSpace);
}

function generateMetallicRoughnessMap(
  material: THREE.MeshStandardMaterial,
  resolution: number
): THREE.DataTexture {
  const data = new Uint8Array(resolution * resolution * 4);
  
  const metalness = Math.floor(material.metalness * 255);
  const roughness = Math.floor(material.roughness * 255);
  
  for (let i = 0; i < resolution * resolution; i++) {
    data[i * 4] = 0;
    data[i * 4 + 1] = roughness;
    data[i * 4 + 2] = metalness;
    data[i * 4 + 3] = 255;
  }
  
  return createDataTexture(data, resolution, THREE.LinearSRGBColorSpace);
}

function generateAOMap(
  geometry: THREE.BufferGeometry,
  resolution: number,
  samples: number,
  radius: number
): THREE.DataTexture {
  const data = new Uint8Array(resolution * resolution * 4);
  
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const uvs = geometry.attributes.uv;
  
  if (!positions || !normals) {
    for (let i = 0; i < resolution * resolution; i++) {
      data[i * 4] = 255;
      data[i * 4 + 1] = 255;
      data[i * 4 + 2] = 255;
      data[i * 4 + 3] = 255;
    }
    return createDataTexture(data, resolution);
  }
  
  const vertexAO = computeVertexAO(geometry, samples, radius);
  
  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const u = x / resolution;
      const v = y / resolution;
      
      const vertexIndex = findClosestVertex(uvs, u, v, positions.count);
      
      let ao = 255;
      if (vertexIndex >= 0 && vertexIndex < vertexAO.length) {
        ao = Math.floor(vertexAO[vertexIndex] * 255);
      }
      
      const idx = (y * resolution + x) * 4;
      data[idx] = ao;
      data[idx + 1] = ao;
      data[idx + 2] = ao;
      data[idx + 3] = 255;
    }
  }
  
  return createDataTexture(data, resolution);
}

function generateEmissiveMap(
  material: THREE.MeshStandardMaterial,
  resolution: number
): THREE.DataTexture | null {
  if (!material.emissive || material.emissiveIntensity <= 0) {
    return null;
  }
  
  const data = new Uint8Array(resolution * resolution * 4);
  
  const emissive = material.emissive;
  const intensity = material.emissiveIntensity;
  
  const r = Math.floor(Math.min(emissive.r * intensity * 255, 255));
  const g = Math.floor(Math.min(emissive.g * intensity * 255, 255));
  const b = Math.floor(Math.min(emissive.b * intensity * 255, 255));
  
  for (let i = 0; i < resolution * resolution; i++) {
    data[i * 4] = r;
    data[i * 4 + 1] = g;
    data[i * 4 + 2] = b;
    data[i * 4 + 3] = 255;
  }
  
  return createDataTexture(data, resolution, THREE.SRGBColorSpace);
}

function findClosestVertex(
  uvs: THREE.BufferAttribute | THREE.InterleavedBufferAttribute | undefined,
  targetU: number,
  targetV: number,
  vertexCount: number
): number {
  if (!uvs) {
    return Math.floor(targetU * targetV * vertexCount) % vertexCount;
  }
  
  let closestIndex = 0;
  let closestDist = Infinity;
  
  const sampleStep = Math.max(1, Math.floor(vertexCount / 1000));
  
  for (let i = 0; i < vertexCount; i += sampleStep) {
    const u = uvs.getX(i);
    const v = uvs.getY(i);
    
    const du = targetU - u;
    const dv = targetV - v;
    const dist = du * du + dv * dv;
    
    if (dist < closestDist) {
      closestDist = dist;
      closestIndex = i;
    }
    
    if (dist < 0.0001) break;
  }
  
  return closestIndex;
}

function computeLocalCurvature(
  geometry: THREE.BufferGeometry,
  vertexIndex: number
): { x: number; y: number } {
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const count = positions.count;
  
  if (!positions || !normals) {
    return { x: 0, y: 0 };
  }
  
  const pos = new THREE.Vector3(
    positions.getX(vertexIndex),
    positions.getY(vertexIndex),
    positions.getZ(vertexIndex)
  );
  
  const normal = new THREE.Vector3(
    normals.getX(vertexIndex),
    normals.getY(vertexIndex),
    normals.getZ(vertexIndex)
  );
  
  let curvatureX = 0;
  let curvatureY = 0;
  let neighbors = 0;
  
  const neighborIndices = findNeighborVertices(geometry, vertexIndex, 5);
  
  for (const ni of neighborIndices) {
    const neighborNormal = new THREE.Vector3(
      normals.getX(ni),
      normals.getY(ni),
      normals.getZ(ni)
    );
    
    const diff = neighborNormal.clone().sub(normal);
    curvatureX += diff.x;
    curvatureY += diff.y;
    neighbors++;
  }
  
  if (neighbors > 0) {
    curvatureX /= neighbors;
    curvatureY /= neighbors;
  }
  
  return { 
    x: Math.max(-1, Math.min(1, curvatureX * 2)),
    y: Math.max(-1, Math.min(1, curvatureY * 2))
  };
}

function findNeighborVertices(
  geometry: THREE.BufferGeometry,
  vertexIndex: number,
  maxNeighbors: number
): number[] {
  const positions = geometry.attributes.position;
  const count = positions.count;
  
  const pos = new THREE.Vector3(
    positions.getX(vertexIndex),
    positions.getY(vertexIndex),
    positions.getZ(vertexIndex)
  );
  
  const distances: Array<{ index: number; dist: number }> = [];
  
  const step = Math.max(1, Math.floor(count / 100));
  
  for (let i = 0; i < count; i += step) {
    if (i === vertexIndex) continue;
    
    const neighborPos = new THREE.Vector3(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    );
    
    const dist = pos.distanceToSquared(neighborPos);
    distances.push({ index: i, dist });
  }
  
  distances.sort((a, b) => a.dist - b.dist);
  
  return distances.slice(0, maxNeighbors).map(d => d.index);
}

function computeVertexAO(
  geometry: THREE.BufferGeometry,
  samples: number,
  radius: number
): Float32Array {
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const count = positions.count;
  
  const ao = new Float32Array(count);
  
  if (!positions || !normals) {
    ao.fill(1.0);
    return ao;
  }
  
  const pos = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const sampleDir = new THREE.Vector3();
  
  for (let i = 0; i < count; i++) {
    pos.set(
      positions.getX(i),
      positions.getY(i),
      positions.getZ(i)
    );
    
    normal.set(
      normals.getX(i),
      normals.getY(i),
      normals.getZ(i)
    ).normalize();
    
    let occlusion = 0;
    let validSamples = 0;
    
    const neighborIndices = findNeighborVertices(geometry, i, samples);
    
    for (const ni of neighborIndices) {
      const neighborPos = new THREE.Vector3(
        positions.getX(ni),
        positions.getY(ni),
        positions.getZ(ni)
      );
      
      sampleDir.copy(neighborPos).sub(pos);
      const dist = sampleDir.length();
      
      if (dist < radius) {
        sampleDir.normalize();
        const dot = normal.dot(sampleDir);
        
        if (dot > 0) {
          occlusion += (1 - dist / radius) * dot * 0.3;
        }
      }
      validSamples++;
    }
    
    ao[i] = Math.max(0, 1 - occlusion);
  }
  
  return ao;
}

function createDataTexture(
  data: Uint8Array,
  resolution: number,
  colorSpace: THREE.ColorSpace = THREE.SRGBColorSpace
): THREE.DataTexture {
  const texture = new THREE.DataTexture(
    data,
    resolution,
    resolution,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  
  return texture;
}

export function applyPBRTexturesToMaterial(
  material: THREE.MeshStandardMaterial,
  textures: PBRTextureSet
): void {
  if (textures.normalMap) {
    material.normalMap = textures.normalMap;
    material.normalScale = new THREE.Vector2(1, 1);
  }
  
  if (textures.metallicRoughnessMap) {
    material.roughnessMap = textures.metallicRoughnessMap;
    material.metalnessMap = textures.metallicRoughnessMap;
  }
  
  if (textures.aoMap) {
    material.aoMap = textures.aoMap;
    material.aoMapIntensity = 1.0;
  }
  
  if (textures.emissiveMap) {
    material.emissiveMap = textures.emissiveMap;
  }
  
  material.needsUpdate = true;
  
  console.log('✅ PBR textures applied to material:', {
    hasNormal: !!textures.normalMap,
    hasMetallicRoughness: !!textures.metallicRoughnessMap,
    hasAO: !!textures.aoMap,
    hasEmissive: !!textures.emissiveMap
  });
}

export function disposePBRTextures(textures: PBRTextureSet): void {
  if (textures.normalMap) textures.normalMap.dispose();
  if (textures.metallicRoughnessMap) textures.metallicRoughnessMap.dispose();
  if (textures.aoMap) textures.aoMap.dispose();
  if (textures.emissiveMap) textures.emissiveMap.dispose();
}
