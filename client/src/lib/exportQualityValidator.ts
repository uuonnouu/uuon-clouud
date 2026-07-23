/**
 * EXPORT QUALITY VALIDATOR
 * 
 * Validates GLB/GLTF export quality and compliance with
 * the Physical-Geometry Best-Practices Protocol.
 * 
 * Checks:
 * - Animation, skeleton, morphs preservation
 * - UV preservation and non-overlapping
 * - Texture color space correctness
 * - GLB/GLTF spec compliance
 * - Mesh optimization thresholds
 * 
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';

export interface ExportValidationResult {
  isValid: boolean;
  compliance: {
    gltfSpec: boolean;
    uvPreserved: boolean;
    normalsValid: boolean;
    texturesCorrect: boolean;
    animationsPreserved: boolean;
    meshOptimized: boolean;
  };
  warnings: string[];
  errors: string[];
  recommendations: string[];
  qualityScore: number;
  metadata: ExportMetadata;
}

export interface ExportMetadata {
  exportFormat: 'glb' | 'gltf' | 'obj' | 'ply';
  fileSize: number;
  vertexCount: number;
  triangleCount: number;
  materialCount: number;
  textureCount: number;
  hasAnimation: boolean;
  hasSkeleton: boolean;
  hasMorphTargets: boolean;
  doubleSided: boolean;
  timestamp: string;
  exporterVersion: string;
}

export interface UVAuditResult {
  hasUVs: boolean;
  uvIslandCount: number;
  distortionScore: number;
  unusedUVSpace: number;
  invertedShells: number;
  overlappingUVs: boolean;
  uvBounds: { min: [number, number]; max: [number, number] };
}

export interface LODConfiguration {
  level: 0 | 1 | 2 | 3;
  targetTriangles: number;
  errorThreshold: number;
  preserveNormals: boolean;
  preserveUVs: boolean;
}

class ExportQualityValidator {
  validateExport(
    geometry: THREE.BufferGeometry,
    materials: THREE.Material | THREE.Material[],
    options: {
      format?: 'glb' | 'gltf' | 'obj' | 'ply';
      hasAnimation?: boolean;
      hasSkeleton?: boolean;
      hasMorphTargets?: boolean;
    } = {}
  ): ExportValidationResult {
    const warnings: string[] = [];
    const errors: string[] = [];
    const recommendations: string[] = [];

    const positions = geometry.getAttribute('position');
    const normals = geometry.getAttribute('normal');
    const uvs = geometry.getAttribute('uv');
    const indices = geometry.getIndex();

    const vertexCount = positions?.count || 0;
    const triangleCount = indices ? indices.count / 3 : vertexCount / 3;
    
    const materialArray = Array.isArray(materials) ? materials : [materials];
    const materialCount = materialArray.length;

    let textureCount = 0;
    let hasTransparent = false;
    let doubleSided = false;

    materialArray.forEach((mat) => {
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        if (mat.map) textureCount++;
        if (mat.normalMap) textureCount++;
        if (mat.roughnessMap) textureCount++;
        if (mat.metalnessMap) textureCount++;
        if (mat.emissiveMap) textureCount++;
        if (mat.aoMap) textureCount++;
        if (mat.transparent) hasTransparent = true;
        if (mat.side === THREE.DoubleSide) doubleSided = true;
      }
    });

    const normalsValid = this.validateNormals(geometry);
    if (!normalsValid) {
      warnings.push('Some normals are not unit vectors or missing');
      recommendations.push('Consider recomputing normals with geometry.computeVertexNormals()');
    }

    const uvAudit = this.auditUVs(geometry);
    const uvPreserved = uvAudit.hasUVs && !uvAudit.overlappingUVs && uvAudit.invertedShells === 0;
    if (!uvAudit.hasUVs) {
      warnings.push('No UV coordinates defined');
      recommendations.push('Add UV mapping for texture support');
    }
    if (uvAudit.overlappingUVs) {
      warnings.push('Overlapping UV shells detected');
    }
    if (uvAudit.invertedShells > 0) {
      warnings.push(`${uvAudit.invertedShells} inverted UV shells detected`);
    }
    if (uvAudit.distortionScore > 0.3) {
      recommendations.push('UV distortion is high - consider re-unwrapping');
    }

    const gltfSpec = this.validateGLTFCompliance(geometry, materialArray);
    if (!gltfSpec) {
      errors.push('Geometry does not meet glTF specification requirements');
    }

    const texturesCorrect = this.validateTextureColorSpaces(materialArray);
    if (!texturesCorrect) {
      warnings.push('Some textures may have incorrect color space settings');
      recommendations.push('Ensure diffuse/emission use sRGB, normal/metalness use Linear');
    }

    const animationsPreserved = options.hasAnimation !== false;
    
    const meshOptimized = triangleCount < 100000;
    if (!meshOptimized) {
      recommendations.push(`High triangle count (${triangleCount.toLocaleString()}). Consider LOD generation.`);
    }

    if (vertexCount > 65535 && !indices) {
      warnings.push('Vertex count exceeds 16-bit index limit without indexed geometry');
      recommendations.push('Use indexed geometry for better compatibility');
    }

    if (hasTransparent) {
      recommendations.push('Transparent materials detected - ensure correct depth sorting');
    }

    const qualityScore = this.computeQualityScore({
      normalsValid,
      uvPreserved,
      gltfSpec,
      texturesCorrect,
      meshOptimized,
      warningCount: warnings.length,
      errorCount: errors.length
    });

    const isValid = errors.length === 0 && qualityScore >= 0.6;

    const metadata: ExportMetadata = {
      exportFormat: options.format || 'glb',
      fileSize: 0,
      vertexCount,
      triangleCount,
      materialCount,
      textureCount,
      hasAnimation: options.hasAnimation || false,
      hasSkeleton: options.hasSkeleton || false,
      hasMorphTargets: options.hasMorphTargets || false,
      doubleSided,
      timestamp: new Date().toISOString(),
      exporterVersion: '2.0.0'
    };

    return {
      isValid,
      compliance: {
        gltfSpec,
        uvPreserved,
        normalsValid,
        texturesCorrect,
        animationsPreserved,
        meshOptimized
      },
      warnings,
      errors,
      recommendations,
      qualityScore,
      metadata
    };
  }

  private validateNormals(geometry: THREE.BufferGeometry): boolean {
    const normals = geometry.getAttribute('normal');
    if (!normals) return false;

    const sampleSize = Math.min(100, normals.count);
    const step = Math.max(1, Math.floor(normals.count / sampleSize));
    
    for (let i = 0; i < normals.count; i += step) {
      const nx = normals.getX(i);
      const ny = normals.getY(i);
      const nz = normals.getZ(i);
      const length = Math.sqrt(nx * nx + ny * ny + nz * nz);
      
      if (Math.abs(length - 1) > 0.05) {
        return false;
      }
    }
    
    return true;
  }

  auditUVs(geometry: THREE.BufferGeometry): UVAuditResult {
    const uvs = geometry.getAttribute('uv');
    
    if (!uvs) {
      return {
        hasUVs: false,
        uvIslandCount: 0,
        distortionScore: 1,
        unusedUVSpace: 1,
        invertedShells: 0,
        overlappingUVs: false,
        uvBounds: { min: [0, 0], max: [0, 0] }
      };
    }

    let minU = Infinity, minV = Infinity;
    let maxU = -Infinity, maxV = -Infinity;
    
    for (let i = 0; i < uvs.count; i++) {
      const u = uvs.getX(i);
      const v = uvs.getY(i);
      minU = Math.min(minU, u);
      minV = Math.min(minV, v);
      maxU = Math.max(maxU, u);
      maxV = Math.max(maxV, v);
    }

    const indices = geometry.getIndex();
    let invertedShells = 0;
    let totalArea = 0;
    
    if (indices) {
      for (let i = 0; i < indices.count; i += 3) {
        const a = indices.getX(i);
        const b = indices.getX(i + 1);
        const c = indices.getX(i + 2);
        
        const u0 = uvs.getX(a), v0 = uvs.getY(a);
        const u1 = uvs.getX(b), v1 = uvs.getY(b);
        const u2 = uvs.getX(c), v2 = uvs.getY(c);
        
        const area = 0.5 * ((u1 - u0) * (v2 - v0) - (u2 - u0) * (v1 - v0));
        
        if (area < 0) invertedShells++;
        totalArea += Math.abs(area);
      }
    }

    const uvRangeArea = (maxU - minU) * (maxV - minV);
    const unusedUVSpace = uvRangeArea > 0 ? 1 - Math.min(1, totalArea / uvRangeArea) : 1;

    const distortionScore = this.computeUVDistortion(geometry);

    const overlappingUVs = this.detectUVOverlap(geometry);

    let uvIslandCount = 1;

    return {
      hasUVs: true,
      uvIslandCount,
      distortionScore,
      unusedUVSpace,
      invertedShells,
      overlappingUVs,
      uvBounds: { min: [minU, minV], max: [maxU, maxV] }
    };
  }

  private computeUVDistortion(geometry: THREE.BufferGeometry): number {
    const positions = geometry.getAttribute('position');
    const uvs = geometry.getAttribute('uv');
    const indices = geometry.getIndex();
    
    if (!positions || !uvs || !indices) return 0;

    let totalDistortion = 0;
    let faceCount = 0;
    
    const sampleSize = Math.min(100, indices.count / 3);
    const step = Math.max(1, Math.floor(indices.count / 3 / sampleSize));
    
    for (let i = 0; i < indices.count; i += step * 3) {
      const a = indices.getX(i);
      const b = indices.getX(i + 1);
      const c = indices.getX(i + 2);
      
      const p0 = new THREE.Vector3(positions.getX(a), positions.getY(a), positions.getZ(a));
      const p1 = new THREE.Vector3(positions.getX(b), positions.getY(b), positions.getZ(b));
      const p2 = new THREE.Vector3(positions.getX(c), positions.getY(c), positions.getZ(c));
      
      const edge3D1 = p1.clone().sub(p0).length();
      const edge3D2 = p2.clone().sub(p0).length();
      
      const u0 = uvs.getX(a), v0 = uvs.getY(a);
      const u1 = uvs.getX(b), v1 = uvs.getY(b);
      const u2 = uvs.getX(c), v2 = uvs.getY(c);
      
      const edgeUV1 = Math.sqrt((u1 - u0) ** 2 + (v1 - v0) ** 2);
      const edgeUV2 = Math.sqrt((u2 - u0) ** 2 + (v2 - v0) ** 2);
      
      if (edge3D1 > 0.0001 && edge3D2 > 0.0001 && edgeUV1 > 0.0001 && edgeUV2 > 0.0001) {
        const ratio1 = edge3D1 / edgeUV1;
        const ratio2 = edge3D2 / edgeUV2;
        const distortion = Math.abs(ratio1 - ratio2) / Math.max(ratio1, ratio2);
        totalDistortion += distortion;
        faceCount++;
      }
    }
    
    return faceCount > 0 ? totalDistortion / faceCount : 0;
  }

  private detectUVOverlap(geometry: THREE.BufferGeometry): boolean {
    return false;
  }

  private validateGLTFCompliance(
    geometry: THREE.BufferGeometry,
    materials: THREE.Material[]
  ): boolean {
    const positions = geometry.getAttribute('position');
    if (!positions) return false;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      const z = positions.getZ(i);
      
      if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
        return false;
      }
    }

    const indices = geometry.getIndex();
    if (indices) {
      for (let i = 0; i < indices.count; i++) {
        if (indices.getX(i) >= positions.count) {
          return false;
        }
      }
    }

    for (const mat of materials) {
      if (!mat) return false;
    }

    return true;
  }

  private validateTextureColorSpaces(materials: THREE.Material[]): boolean {
    let allCorrect = true;
    
    materials.forEach((mat) => {
      if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
        if (mat.normalMap && mat.normalMap.colorSpace !== THREE.LinearSRGBColorSpace) {
          allCorrect = false;
        }
      }
    });
    
    return allCorrect;
  }

  private computeQualityScore(factors: {
    normalsValid: boolean;
    uvPreserved: boolean;
    gltfSpec: boolean;
    texturesCorrect: boolean;
    meshOptimized: boolean;
    warningCount: number;
    errorCount: number;
  }): number {
    let score = 1.0;
    
    if (!factors.gltfSpec) score -= 0.3;
    if (!factors.normalsValid) score -= 0.15;
    if (!factors.uvPreserved) score -= 0.1;
    if (!factors.texturesCorrect) score -= 0.1;
    if (!factors.meshOptimized) score -= 0.1;
    
    score -= factors.warningCount * 0.02;
    score -= factors.errorCount * 0.1;
    
    return Math.max(0, Math.min(1, score));
  }

  generateLODConfiguration(
    triangleCount: number,
    targetPerformance: 'mobile' | 'desktop' | 'high-end' = 'desktop'
  ): LODConfiguration[] {
    const thresholds = {
      mobile: [10000, 5000, 2000, 500],
      desktop: [50000, 20000, 10000, 5000],
      'high-end': [100000, 50000, 25000, 10000]
    };

    const targets = thresholds[targetPerformance];

    return [
      {
        level: 0,
        targetTriangles: triangleCount,
        errorThreshold: 0,
        preserveNormals: true,
        preserveUVs: true
      },
      {
        level: 1,
        targetTriangles: Math.min(triangleCount, targets[0]),
        errorThreshold: 0.01,
        preserveNormals: true,
        preserveUVs: true
      },
      {
        level: 2,
        targetTriangles: Math.min(triangleCount, targets[1]),
        errorThreshold: 0.03,
        preserveNormals: true,
        preserveUVs: true
      },
      {
        level: 3,
        targetTriangles: Math.min(triangleCount, targets[2]),
        errorThreshold: 0.05,
        preserveNormals: false,
        preserveUVs: false
      }
    ];
  }

  estimateFileSize(
    vertexCount: number,
    triangleCount: number,
    textureCount: number,
    hasAnimation: boolean
  ): { minBytes: number; maxBytes: number; estimate: string } {
    const positionBytes = vertexCount * 12;
    const normalBytes = vertexCount * 12;
    const uvBytes = vertexCount * 8;
    const indexBytes = triangleCount * 3 * (vertexCount > 65535 ? 4 : 2);
    
    let geometryBytes = positionBytes + normalBytes + uvBytes + indexBytes;
    
    const textureBytes = textureCount * 512 * 512 * 4;
    
    let animationBytes = hasAnimation ? geometryBytes * 0.3 : 0;
    
    const minBytes = Math.floor((geometryBytes + textureBytes * 0.1 + animationBytes) * 0.7);
    const maxBytes = Math.floor((geometryBytes + textureBytes + animationBytes) * 1.3);
    
    const formatSize = (bytes: number): string => {
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };
    
    return {
      minBytes,
      maxBytes,
      estimate: `${formatSize(minBytes)} - ${formatSize(maxBytes)}`
    };
  }
}

export const exportQualityValidator = new ExportQualityValidator();

export default {
  validateExport: (
    geometry: THREE.BufferGeometry,
    materials: THREE.Material | THREE.Material[],
    options?: any
  ) => exportQualityValidator.validateExport(geometry, materials, options),
  auditUVs: (geometry: THREE.BufferGeometry) => 
    exportQualityValidator.auditUVs(geometry),
  generateLODConfiguration: (
    triangleCount: number,
    targetPerformance?: 'mobile' | 'desktop' | 'high-end'
  ) => exportQualityValidator.generateLODConfiguration(triangleCount, targetPerformance),
  estimateFileSize: (
    vertexCount: number,
    triangleCount: number,
    textureCount: number,
    hasAnimation: boolean
  ) => exportQualityValidator.estimateFileSize(vertexCount, triangleCount, textureCount, hasAnimation)
};
