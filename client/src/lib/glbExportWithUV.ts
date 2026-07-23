/**
 * ENHANCED GLB EXPORTER WITH FRACTAL UV MAPPING AND GIP METADATA
 * 
 * Exports 3D shapes with proper UV coordinates and embedded textures
 * Supports baked lighting, multiple UV channels, texture tiling, and GIP identity metrics
 * 
 * Author: UUON Foundation Inc.
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { 
  UVMappingMode, 
  UVMappingOptions, 
  generateFractalUVs,
  applyFractalUVsToGeometry,
  prepareUVsForGLBExport
} from './fractalUVMapping';
import { gipEngine, GIPMetrics, ParameterState } from './gipIdentityEngine';
import { 
  generatePBRTextures, 
  applyPBRTexturesToMaterial, 
  PBRTextureSet,
  PBRGenerationOptions 
} from './pbrTextureGenerator';

export interface GLBExportOptions {
  filename: string;
  includeTextures: boolean;
  uvMappingMode: UVMappingMode;
  uvScale: number;
  bakeLighting: boolean;
  embedAnimation: boolean;
  animationDuration: number;
  quality: 'low' | 'medium' | 'high';
  includePBR: boolean;
  includeDisplacement: boolean;
  includeTopologyData: boolean;
  includeGIPMetadata: boolean;
  generatePBRTextures: boolean;
  pbrTextureResolution: number;
  shapeParameters?: Partial<ParameterState>;
  materialPresetId?: string;
}

export interface ExportResult {
  success: boolean;
  blob?: Blob;
  error?: string;
  metadata: {
    vertexCount: number;
    faceCount: number;
    hasTextures: boolean;
    hasUVs: boolean;
    uvMappingMode: UVMappingMode;
    hasPBR: boolean;
    hasDisplacement: boolean;
    hasNormalMap: boolean;
    hasAOMap: boolean;
    hasTopologyData: boolean;
    hasGIPMetadata: boolean;
    materialProperties?: {
      metalness: number;
      roughness: number;
      emissiveIntensity: number;
    };
    gipMetrics?: GIPMetrics;
  };
}

const DEFAULT_EXPORT_OPTIONS: GLBExportOptions = {
  filename: 'math_shape',
  includeTextures: true,
  uvMappingMode: 'spherical',
  uvScale: 1,
  bakeLighting: false,
  embedAnimation: false,
  animationDuration: 4,
  quality: 'medium',
  includePBR: true,
  includeDisplacement: false,
  includeTopologyData: true,
  includeGIPMetadata: false,
  generatePBRTextures: false,
  pbrTextureResolution: 256,
  shapeParameters: undefined,
  materialPresetId: undefined
};

export async function exportToGLBWithUV(
  mesh: THREE.Mesh,
  options: Partial<GLBExportOptions> = {}
): Promise<ExportResult> {
  const opts = { ...DEFAULT_EXPORT_OPTIONS, ...options };
  
  try {
    const scene = new THREE.Scene();
    
    // Clone geometry and apply fractal UV mapping
    const sourceGeometry = mesh.geometry.clone();
    
    // Ensure geometry has normals
    if (!sourceGeometry.attributes.normal) {
      sourceGeometry.computeVertexNormals();
    }
    
    // Apply fractal UV mapping based on options
    const uvOptions: Partial<UVMappingOptions> = {
      mode: opts.uvMappingMode,
      scale: opts.uvScale,
      seamless: true,
      fractalIterations: opts.quality === 'high' ? 12 : opts.quality === 'medium' ? 8 : 4
    };
    
    applyFractalUVsToGeometry(sourceGeometry, uvOptions);
    
    // Prepare export UV data
    const uvExportData = prepareUVsForGLBExport(sourceGeometry, uvOptions);
    
    // Create material for export with PBR texture generation
    const exportMaterial = createExportMaterial(mesh.material as THREE.Material, sourceGeometry, opts);
    
    // Create export mesh
    const exportMesh = new THREE.Mesh(sourceGeometry, exportMaterial);
    exportMesh.name = opts.filename;
    
    // Apply baked lighting if requested
    if (opts.bakeLighting) {
      bakeLightingToVertexColors(exportMesh, scene);
    }
    
    scene.add(exportMesh);
    
    // Add ambient light for proper rendering in viewers
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);
    
    // Create animation if requested
    let animations: THREE.AnimationClip[] = [];
    if (opts.embedAnimation) {
      animations = createExportAnimations(exportMesh, opts.animationDuration);
    }
    
    // Compute GIP metrics if requested
    let gipMetrics: GIPMetrics | undefined;
    if (opts.includeGIPMetadata && opts.shapeParameters) {
      const positionAttr = sourceGeometry.attributes.position;
      const vertices = positionAttr ? positionAttr.array as Float32Array : undefined;
      const indices = sourceGeometry.index ? sourceGeometry.index.array as Uint32Array : undefined;
      
      gipMetrics = gipEngine.computeFullMetrics(opts.shapeParameters, vertices, indices);
      
      // Attach GIP metadata to the mesh userData for GLTF extras
      exportMesh.userData = {
        ...exportMesh.userData,
        gip: gipEngine.exportMetadata(gipMetrics)
      };
    }
    
    // Export using GLTFExporter
    const exporter = new GLTFExporter();
    
    return new Promise((resolve) => {
      exporter.parse(
        scene,
        (result) => {
          let blob: Blob;
          
          if (result instanceof ArrayBuffer) {
            blob = new Blob([result], { type: 'model/gltf-binary' });
          } else {
            const json = JSON.stringify(result, null, 2);
            blob = new Blob([json], { type: 'application/json' });
          }
          
          resolve({
            success: true,
            blob,
            metadata: {
              vertexCount: sourceGeometry.attributes.position.count,
              faceCount: sourceGeometry.index ? sourceGeometry.index.count / 3 : 0,
              hasTextures: opts.includeTextures && exportMaterial instanceof THREE.MeshStandardMaterial && !!exportMaterial.map,
              hasUVs: true,
              uvMappingMode: opts.uvMappingMode,
              hasPBR: opts.includePBR,
              hasDisplacement: opts.includeDisplacement && !!exportMaterial.displacementMap,
              hasNormalMap: !!exportMaterial.normalMap,
              hasAOMap: !!exportMaterial.aoMap,
              hasTopologyData: opts.includeTopologyData,
              hasGIPMetadata: opts.includeGIPMetadata && !!gipMetrics,
              materialProperties: {
                metalness: exportMaterial.metalness,
                roughness: exportMaterial.roughness,
                emissiveIntensity: exportMaterial.emissiveIntensity || 0
              },
              gipMetrics
            }
          });
        },
        (error) => {
          resolve({
            success: false,
            error: error.message || 'Export failed',
            metadata: {
              vertexCount: 0,
              faceCount: 0,
              hasTextures: false,
              hasUVs: false,
              uvMappingMode: opts.uvMappingMode,
              hasPBR: false,
              hasDisplacement: false,
              hasNormalMap: false,
              hasAOMap: false,
              hasTopologyData: false,
              hasGIPMetadata: false
            }
          });
        },
        {
          binary: true,
          animations,
          includeCustomExtensions: true
        }
      );
    });
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      metadata: {
        vertexCount: 0,
        faceCount: 0,
        hasTextures: false,
        hasUVs: false,
        uvMappingMode: opts.uvMappingMode,
        hasPBR: false,
        hasDisplacement: false,
        hasNormalMap: false,
        hasAOMap: false,
        hasTopologyData: false,
        hasGIPMetadata: false
      }
    };
  }
}

function createExportMaterial(
  sourceMaterial: THREE.Material,
  sourceGeometry: THREE.BufferGeometry,
  options: GLBExportOptions
): THREE.MeshStandardMaterial {
  const material = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide
  });
  
  let hasExistingPBRMaps = false;
  
  if (sourceMaterial instanceof THREE.MeshStandardMaterial) {
    material.color.copy(sourceMaterial.color);
    material.metalness = sourceMaterial.metalness;
    material.roughness = sourceMaterial.roughness;
    
    if (options.includeTextures) {
      if (sourceMaterial.map) {
        material.map = sourceMaterial.map.clone();
        material.map.wrapS = THREE.RepeatWrapping;
        material.map.wrapT = THREE.RepeatWrapping;
      }
      if (sourceMaterial.normalMap) {
        material.normalMap = sourceMaterial.normalMap.clone();
        material.normalScale = sourceMaterial.normalScale?.clone() || new THREE.Vector2(1, 1);
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.roughnessMap) {
        material.roughnessMap = sourceMaterial.roughnessMap.clone();
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.metalnessMap) {
        material.metalnessMap = sourceMaterial.metalnessMap.clone();
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.aoMap) {
        material.aoMap = sourceMaterial.aoMap.clone();
        material.aoMapIntensity = sourceMaterial.aoMapIntensity || 1.0;
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.displacementMap && options.includeDisplacement) {
        material.displacementMap = sourceMaterial.displacementMap.clone();
        material.displacementScale = sourceMaterial.displacementScale || 0.1;
        material.displacementBias = sourceMaterial.displacementBias || 0;
      }
      if (sourceMaterial.emissiveMap) {
        material.emissiveMap = sourceMaterial.emissiveMap.clone();
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.envMap) {
        material.envMap = sourceMaterial.envMap.clone();
        material.envMapIntensity = sourceMaterial.envMapIntensity || 1.0;
      }
    }
    
    if (sourceMaterial.emissive) {
      material.emissive.copy(sourceMaterial.emissive);
      material.emissiveIntensity = sourceMaterial.emissiveIntensity;
    }
    
    if (options.includePBR) {
      material.flatShading = sourceMaterial.flatShading || false;
      material.wireframe = sourceMaterial.wireframe || false;
      material.transparent = sourceMaterial.transparent || false;
      material.opacity = sourceMaterial.opacity || 1.0;
      material.alphaTest = sourceMaterial.alphaTest || 0;
    }
  } else if (sourceMaterial instanceof THREE.MeshPhysicalMaterial) {
    material.color.copy(sourceMaterial.color);
    material.metalness = sourceMaterial.metalness;
    material.roughness = sourceMaterial.roughness;
    
    if (sourceMaterial.emissive) {
      material.emissive.copy(sourceMaterial.emissive);
      material.emissiveIntensity = sourceMaterial.emissiveIntensity;
    }
    
    if (options.includeTextures) {
      if (sourceMaterial.map) material.map = sourceMaterial.map.clone();
      if (sourceMaterial.normalMap) {
        material.normalMap = sourceMaterial.normalMap.clone();
        material.normalScale = sourceMaterial.normalScale?.clone() || new THREE.Vector2(1, 1);
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.roughnessMap) {
        material.roughnessMap = sourceMaterial.roughnessMap.clone();
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.metalnessMap) {
        material.metalnessMap = sourceMaterial.metalnessMap.clone();
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.aoMap) {
        material.aoMap = sourceMaterial.aoMap.clone();
        material.aoMapIntensity = sourceMaterial.aoMapIntensity || 1.0;
        hasExistingPBRMaps = true;
      }
      if (sourceMaterial.displacementMap && options.includeDisplacement) {
        material.displacementMap = sourceMaterial.displacementMap.clone();
        material.displacementScale = sourceMaterial.displacementScale || 0.1;
      }
    }
  } else if (sourceMaterial instanceof THREE.MeshBasicMaterial) {
    material.color.copy(sourceMaterial.color);
    material.metalness = 0.1;
    material.roughness = 0.8;
  } else {
    material.color.setHex(0x00ff88);
    material.metalness = 0.3;
    material.roughness = 0.4;
  }
  
  if (options.generatePBRTextures && options.includePBR && !hasExistingPBRMaps) {
    console.log('🎨 Generating PBR texture maps for export...');
    
    const pbrOptions: Partial<PBRGenerationOptions> = {
      resolution: options.pbrTextureResolution || 512,
      generateNormal: !material.normalMap,
      generateMetallicRoughness: !material.roughnessMap && !material.metalnessMap,
      generateAO: !material.aoMap,
      generateEmissive: !material.emissiveMap && material.emissiveIntensity > 0,
      normalStrength: 1.0,
      aoSamples: options.quality === 'high' ? 32 : 16,
      aoRadius: 0.5
    };
    
    const pbrTextures = generatePBRTextures(sourceGeometry, material, pbrOptions);
    applyPBRTexturesToMaterial(material, pbrTextures);
    
    console.log('✅ PBR textures generated and applied');
  }
  
  console.log(`📦 Export material created with PBR: ${options.includePBR}, displacement: ${options.includeDisplacement}, generated textures: ${options.generatePBRTextures}`);
  
  return material;
}

function bakeLightingToVertexColors(
  mesh: THREE.Mesh,
  scene: THREE.Scene
): void {
  const geometry = mesh.geometry;
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  
  if (!positions || !normals) return;
  
  const vertexCount = positions.count;
  const colors = new Float32Array(vertexCount * 3);
  
  // Simple directional light simulation
  const lightDir = new THREE.Vector3(0.5, 1, 0.7).normalize();
  const ambientIntensity = 0.3;
  const diffuseIntensity = 0.7;
  
  const normal = new THREE.Vector3();
  
  for (let i = 0; i < vertexCount; i++) {
    normal.set(
      normals.getX(i),
      normals.getY(i),
      normals.getZ(i)
    );
    
    const diffuse = Math.max(0, normal.dot(lightDir)) * diffuseIntensity;
    const brightness = ambientIntensity + diffuse;
    
    colors[i * 3] = brightness;
    colors[i * 3 + 1] = brightness;
    colors[i * 3 + 2] = brightness;
  }
  
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  // Update material to use vertex colors
  if (mesh.material instanceof THREE.MeshStandardMaterial) {
    mesh.material.vertexColors = true;
  }
}

function createExportAnimations(
  mesh: THREE.Mesh,
  duration: number
): THREE.AnimationClip[] {
  // Create smooth rotation animation
  const times = [0, duration * 0.25, duration * 0.5, duration * 0.75, duration];
  
  const q0 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
  const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
  const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
  const q3 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 1.5, 0));
  const q4 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI * 2, 0));
  
  const values = [
    q0.x, q0.y, q0.z, q0.w,
    q1.x, q1.y, q1.z, q1.w,
    q2.x, q2.y, q2.z, q2.w,
    q3.x, q3.y, q3.z, q3.w,
    q4.x, q4.y, q4.z, q4.w
  ];
  
  const rotationTrack = new THREE.QuaternionKeyframeTrack(
    `${mesh.name}.quaternion`,
    times,
    values,
    THREE.InterpolateSmooth
  );
  
  return [new THREE.AnimationClip('Rotation', duration, [rotationTrack])];
}

export function downloadGLB(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.glb`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportAndDownload(
  mesh: THREE.Mesh,
  options: Partial<GLBExportOptions> = {}
): Promise<ExportResult> {
  const result = await exportToGLBWithUV(mesh, options);
  
  if (result.success && result.blob) {
    downloadGLB(result.blob, options.filename || 'math_shape');
  }
  
  return result;
}

export const UV_MAPPING_PRESETS: Record<string, Partial<UVMappingOptions>> = {
  standard: {
    mode: 'spherical',
    scale: 1,
    seamless: true
  },
  tiled: {
    mode: 'planar',
    scale: 4,
    seamless: true
  },
  fractal: {
    mode: 'fractal-mandelbrot',
    scale: 2,
    fractalIterations: 12,
    seamless: false
  },
  julia: {
    mode: 'fractal-julia',
    scale: 1.5,
    fractalIterations: 10,
    seamless: false
  },
  hexagonal: {
    mode: 'hexagonal',
    scale: 1,
    seamless: true
  },
  toroidal: {
    mode: 'toroidal',
    scale: 1,
    seamless: true
  },
  triplanar: {
    mode: 'triplanar',
    scale: 1,
    seamless: true
  }
};

export default {
  exportToGLBWithUV,
  exportAndDownload,
  downloadGLB,
  UV_MAPPING_PRESETS
};
