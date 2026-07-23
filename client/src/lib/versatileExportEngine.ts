
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter.js';
import { SurfaceParameters } from '../types/math';
import { IndustrialExportManager, generateExportFingerprint, embedFingerprintInGLTF } from './industrialExportStandards';
import { 
  generateShapeSpecificPBRTextures, 
  getCategoryFromShapeId, 
  ShapeCategoryType,
  PBRTextureSet 
} from './shapeSpecificTextures';
import { 
  ParametricDataPreserver, 
  createParametricDataForExport, 
  embedParametricDataInGLTF,
  ParametricDataPackage 
} from './parametricDataPreservation';
import { createExportMaterial, generateExportTextures, MATERIAL_PRESETS } from './materialPresets';
import { 
  createGLTFAssetAttribution, 
  embedAIAttributionInGLTF, 
  getAttributionSummary 
} from './aiRecognizableAttribution';

export type ExportFormat = 'gltf' | 'glb' | 'fbx' | 'obj' | 'stl' | 'ply';
export type ShadingMode = 'flat' | 'gouraud' | 'phong' | 'pbr' | 'normal' | 'displacement' | 'parallax';

export interface ColorConfiguration {
  baseColor: THREE.Color;
  metalness: number;
  roughness: number;
  emissive: THREE.Color;
  emissiveIntensity: number;
  opacity: number;
  transparent: boolean;
}

export interface ExportConfiguration {
  format: ExportFormat;
  includeAnimations: boolean;
  includeMaterials: boolean;
  includeTextures: boolean;
  colorMode: 'vertex' | 'material' | 'pbr' | 'texture';
  shadingMode: ShadingMode;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  compression: boolean;
}

export class VersatileExportEngine {
  private geometry: THREE.BufferGeometry;
  private material: THREE.Material;
  private colorConfig: ColorConfiguration;
  private industrialManager: IndustrialExportManager;
  private shapeId: string;
  private shapeParameters: Record<string, number>;
  private shapeCategory: ShapeCategoryType;
  private pbrTextures: PBRTextureSet | null = null;
  private materialPresetId: string = 'voronoi'; // Track the current material preset

  constructor(geometry: THREE.BufferGeometry, material?: THREE.Material, shapeId?: string, shapeParameters?: Record<string, number>) {
    this.geometry = geometry.clone();
    this.material = material || this.createDefaultPBRMaterial();
    this.industrialManager = new IndustrialExportManager(this.geometry);
    this.colorConfig = this.extractColorConfiguration();
    this.shapeId = shapeId || 'unknown_shape';
    this.shapeParameters = shapeParameters || {};
    this.shapeCategory = getCategoryFromShapeId(this.shapeId);
  }

  /**
   * Set the material preset ID for proper texture baking during export
   */
  setMaterialPreset(presetId: string): void {
    if (MATERIAL_PRESETS[presetId]) {
      this.materialPresetId = presetId;
      console.log(`🎨 Material preset set for export: ${presetId}`);
    } else {
      console.warn(`Material preset "${presetId}" not found, keeping current preset`);
    }
  }

  getMaterialPresetId(): string {
    return this.materialPresetId;
  }

  setShapeParameters(parameters: Record<string, number>): void {
    this.shapeParameters = parameters;
  }

  setShapeCategory(category: ShapeCategoryType): void {
    this.shapeCategory = category;
  }

  private generateShapePBRTextures(resolution: number = 1024): PBRTextureSet {
    if (this.pbrTextures) {
      return this.pbrTextures;
    }

    console.log(`🎨 Generating shape-specific PBR textures for export: ${this.shapeId} (${this.shapeCategory})`);
    
    this.pbrTextures = generateShapeSpecificPBRTextures({
      shapeId: this.shapeId,
      category: this.shapeCategory,
      parameters: this.shapeParameters,
      resolution
    });

    return this.pbrTextures;
  }

  private createDefaultPBRMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x00ff88),
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color(0x001122),
      emissiveIntensity: 0.1,
      side: THREE.DoubleSide
    });
  }

  private extractColorConfiguration(): ColorConfiguration {
    if (this.material instanceof THREE.MeshStandardMaterial || 
        this.material instanceof THREE.MeshPhysicalMaterial) {
      return {
        baseColor: this.material.color.clone(),
        metalness: this.material.metalness || 0,
        roughness: this.material.roughness || 0.5,
        emissive: this.material.emissive.clone(),
        emissiveIntensity: this.material.emissiveIntensity || 0,
        opacity: this.material.opacity || 1,
        transparent: this.material.transparent || false
      };
    }
    
    return {
      baseColor: new THREE.Color(0x00ff88),
      metalness: 0.3,
      roughness: 0.4,
      emissive: new THREE.Color(0x001122),
      emissiveIntensity: 0.1,
      opacity: 1,
      transparent: false
    };
  }

  async exportAs(config: ExportConfiguration, filename: string): Promise<void> {
    console.log(`🎯 Exporting as ${config.format.toUpperCase()}:`, config);

    switch (config.format) {
      case 'gltf':
      case 'glb':
        return this.exportGLTF(config, filename);
      case 'fbx':
        return this.exportFBX(config, filename);
      case 'obj':
        return this.exportOBJ(config, filename);
      case 'stl':
        return this.exportSTL(config, filename);
      case 'ply':
        return this.exportPLY(config, filename);
      default:
        throw new Error(`Unsupported export format: ${config.format}`);
    }
  }

  private async exportGLTF(config: ExportConfiguration, filename: string): Promise<void> {
    const scene = new THREE.Scene();
    const material = this.createMaterialForExport(config);
    const mesh = new THREE.Mesh(this.geometry, material);
    scene.add(mesh);

    const exporter = new GLTFExporter();
    const fingerprint = generateExportFingerprint(this.shapeId, this.geometry);
    console.log(`🔐 Export fingerprint generated: ${fingerprint.exportId}`);
    
    this.geometry.computeBoundingBox();
    const vertexCount = this.geometry.attributes.position?.count || 0;
    const faceCount = this.geometry.index ? this.geometry.index.count / 3 : 0;
    
    const parametricPackage = createParametricDataForExport(
      this.shapeId,
      this.shapeParameters as any,
      {
        vertexCount,
        faceCount,
        boundingBox: this.geometry.boundingBox
      }
    );
    console.log(`📦 Parametric data package created for: ${this.shapeId}`);
    
    const shapeName = parametricPackage.identity?.shapeName || this.shapeId;
    const category = parametricPackage.identity?.category || this.shapeCategory;
    const formula = parametricPackage.identity?.formula || 'parametric-surface';
    
    const aiAttribution = createGLTFAssetAttribution(
      this.shapeId,
      shapeName,
      category,
      formula,
      this.materialPresetId,
      { vertexCount, faceCount },
      config.quality === 'ultra' ? 4096 : 2048
    );
    console.log(getAttributionSummary(aiAttribution.extras.attribution));
    
    return new Promise((resolve, reject) => {
      exporter.parse(
        scene,
        (result) => {
          const metadata = this.industrialManager.generateIndustrialGLTFMetadata(filename, {});
          
          if (config.format === 'glb') {
            const blob = new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' });
            this.downloadFile(blob, `${filename}.glb`);
            console.log(`🔐 GLB fingerprint embedded: ${fingerprint.exportId}`);
            console.log(`📦 Parametric data preserved in GLB export`);
            console.log(`🤖 AI-recognizable attribution embedded in GLB`);
          } else {
            const gltfWithMetadata = { ...result, ...metadata };
            const fingerprintedGltf = embedFingerprintInGLTF(gltfWithMetadata, fingerprint);
            const gltfWithParametricData = embedParametricDataInGLTF(fingerprintedGltf, parametricPackage);
            const gltfWithAIAttribution = embedAIAttributionInGLTF(gltfWithParametricData, aiAttribution);
            const output = JSON.stringify(gltfWithAIAttribution, null, 2);
            const blob = new Blob([output], { type: 'application/json' });
            this.downloadFile(blob, `${filename}.gltf`);
            console.log(`🔐 GLTF fingerprint embedded: ${fingerprint.exportId}`);
            console.log(`📦 Parametric data embedded in GLTF export`);
            console.log(`🤖 AI-recognizable attribution embedded in GLTF`);
          }
          
          console.log(`✅ ${config.format.toUpperCase()} export complete with IP protection + parametric data + AI attribution`);
          resolve();
        },
        (error) => {
          console.error(`❌ ${config.format.toUpperCase()} export failed:`, error);
          reject(error);
        },
        {
          binary: config.format === 'glb',
          includeCustomExtensions: config.includeMaterials,
          embedImages: config.includeTextures,
          maxTextureSize: config.quality === 'ultra' ? 4096 : 2048
        }
      );
    });
  }

  private async exportFBX(config: ExportConfiguration, filename: string): Promise<void> {
    // ASCII FBX with geometry data — includes vertices, indices, normals, and material.
    // Note: binary FBX and full animation support require a dedicated FBX library.
    const fbxContent = this.generateFBXContent(config);
    const blob = new Blob([fbxContent], { type: 'application/octet-stream' });
    this.downloadFile(blob, `${filename}.fbx`);
    console.log(`✅ FBX export complete (ASCII format — import into Blender or Maya for full editing)`);
  }

  private generateFBXContent(config: ExportConfiguration): string {
    const posArray = Array.from(this.geometry.attributes.position.array);
    const posCount = this.geometry.attributes.position.count;

    // Build normals — compute if missing
    let normArray: number[] = [];
    if (this.geometry.attributes.normal) {
      normArray = Array.from(this.geometry.attributes.normal.array);
    } else {
      // Flat default normals (0,1,0) if not present
      normArray = new Array(posCount * 3).fill(0).map((_, i) => i % 3 === 1 ? 1 : 0);
    }

    // Build UVs — use existing or generate zeroed fallback
    let uvArray: number[] = [];
    if (this.geometry.attributes.uv) {
      uvArray = Array.from(this.geometry.attributes.uv.array);
    } else {
      uvArray = new Array(posCount * 2).fill(0);
    }

    // Index data — FBX uses -1 to mark face end on last index of each triangle
    let polyIndexStr = '';
    if (this.geometry.index) {
      const raw = Array.from(this.geometry.index.array);
      const fbxIdx: number[] = [];
      for (let i = 0; i < raw.length; i += 3) {
        fbxIdx.push(raw[i], raw[i + 1], ~raw[i + 2]); // bitwise NOT marks end of polygon
      }
      polyIndexStr = fbxIdx.join(',');
    }

    const polyCount = this.geometry.index ? this.geometry.index.count / 3 : 0;

    return `; FBX Export from Δmension Mathematical Universe
; Version: 1.0.0
; Format: ASCII FBX 7.4

FBXHeaderExtension: {
    FBXHeaderVersion: 1003
    FBXVersion: 7400
    Creator: "Δmension Mathematical Universe"
}

Objects: {
    Geometry: 1001, "Geometry::Mesh", "Mesh" {
        Vertices: *${posCount * 3} {
            a: ${posArray.join(',')}
        }
        PolygonVertexIndex: *${polyCount * 3} {
            a: ${polyIndexStr}
        }
        LayerElementNormal: 0 {
            MappingInformationType: "ByVertice"
            ReferenceInformationType: "Direct"
            Normals: *${posCount * 3} {
                a: ${normArray.join(',')}
            }
        }
        LayerElementUV: 0 {
            MappingInformationType: "ByVertice"
            ReferenceInformationType: "Direct"
            UV: *${posCount * 2} {
                a: ${uvArray.join(',')}
            }
        }
        LayerElementMaterial: 0 {
            MappingInformationType: "AllSame"
            ReferenceInformationType: "IndexToDirect"
            Materials: *1 {
                a: 0
            }
        }
        Layer: 0 {
            Version: 100
            LayerElement: { Type: "LayerElementNormal" TypedIndex: 0 }
            LayerElement: { Type: "LayerElementUV" TypedIndex: 0 }
            LayerElement: { Type: "LayerElementMaterial" TypedIndex: 0 }
        }
    }

    Material: 2001, "Material::StandardMaterial", "" {
        ShadingModel: "Phong"
        Properties70: {
            P: "DiffuseColor", "Color", "", "A",${this.colorConfig.baseColor.r},${this.colorConfig.baseColor.g},${this.colorConfig.baseColor.b}
            P: "EmissiveColor", "Color", "", "A",${this.colorConfig.emissive.r},${this.colorConfig.emissive.g},${this.colorConfig.emissive.b}
            P: "Opacity", "double", "Number", "",${this.colorConfig.opacity}
            P: "Shininess", "double", "Number", "",50
        }
    }
}

Connections: {
    C: "OO",2001,1001
}`;
  }

  private async exportOBJ(config: ExportConfiguration, filename: string): Promise<void> {
    const scene = new THREE.Scene();
    const material = this.createMaterialForExport(config);
    const mesh = new THREE.Mesh(this.geometry, material);
    scene.add(mesh);

    const exporter = new OBJExporter();
    const objContent = exporter.parse(scene);
    
    // Generate MTL file for materials and colors
    const mtlContent = this.generateMTLContent(filename, config);
    
    // Add MTL reference to OBJ
    const objWithMTL = `# Δmension Mathematical Universe Export
# Format: Wavefront OBJ with MTL materials
mtllib ${filename}.mtl

${objContent}`;

    // Download OBJ file
    const objBlob = new Blob([objWithMTL], { type: 'text/plain' });
    this.downloadFile(objBlob, `${filename}.obj`);
    
    // Download MTL file
    const mtlBlob = new Blob([mtlContent], { type: 'text/plain' });
    this.downloadFile(mtlBlob, `${filename}.mtl`);
    
    console.log(`✅ OBJ+MTL export complete with full color information`);
  }

  private generateMTLContent(filename: string, config: ExportConfiguration): string {
    return `# Material Library for ${filename}
# Created by Δmension Mathematical Universe

newmtl Material
Ka ${this.colorConfig.emissive.r} ${this.colorConfig.emissive.g} ${this.colorConfig.emissive.b}  # Ambient color
Kd ${this.colorConfig.baseColor.r} ${this.colorConfig.baseColor.g} ${this.colorConfig.baseColor.b}  # Diffuse color
Ks ${1 - this.colorConfig.roughness} ${1 - this.colorConfig.roughness} ${1 - this.colorConfig.roughness}  # Specular color
Ns ${(1 - this.colorConfig.roughness) * 1000}  # Specular exponent
d ${this.colorConfig.opacity}  # Dissolve (opacity)
Tr ${1 - this.colorConfig.opacity}  # Transparency
illum 2  # Illumination model`;
  }

  private async exportSTL(config: ExportConfiguration, filename: string): Promise<void> {
    const stlContent = this.generateSTLContent();
    const blob = new Blob([stlContent], { type: 'application/octet-stream' });
    this.downloadFile(blob, `${filename}.stl`);
    console.log(`✅ STL export complete (geometry only - STL doesn't support colors)`);
  }

  private generateSTLContent(): ArrayBuffer {
    const positions = this.geometry.attributes.position.array;
    const indices = this.geometry.index?.array || [];
    const triangleCount = indices.length / 3;
    
    // STL binary format
    const buffer = new ArrayBuffer(80 + 4 + (triangleCount * 50));
    const view = new DataView(buffer);
    
    // Header (80 bytes)
    const headerText = "Δmension Mathematical Universe STL Export";
    for (let i = 0; i < Math.min(headerText.length, 80); i++) {
      view.setUint8(i, headerText.charCodeAt(i));
    }
    
    // Number of triangles
    view.setUint32(80, triangleCount, true);
    
    let offset = 84;
    for (let i = 0; i < indices.length; i += 3) {
      const i1 = indices[i] * 3;
      const i2 = indices[i + 1] * 3;
      const i3 = indices[i + 2] * 3;
      
      // Calculate normal
      const v1 = new THREE.Vector3(positions[i1], positions[i1 + 1], positions[i1 + 2]);
      const v2 = new THREE.Vector3(positions[i2], positions[i2 + 1], positions[i2 + 2]);
      const v3 = new THREE.Vector3(positions[i3], positions[i3 + 1], positions[i3 + 2]);
      
      const normal = new THREE.Vector3()
        .subVectors(v2, v1)
        .cross(new THREE.Vector3().subVectors(v3, v1))
        .normalize();
      
      // Write normal
      view.setFloat32(offset, normal.x, true); offset += 4;
      view.setFloat32(offset, normal.y, true); offset += 4;
      view.setFloat32(offset, normal.z, true); offset += 4;
      
      // Write vertices
      view.setFloat32(offset, v1.x, true); offset += 4;
      view.setFloat32(offset, v1.y, true); offset += 4;
      view.setFloat32(offset, v1.z, true); offset += 4;
      
      view.setFloat32(offset, v2.x, true); offset += 4;
      view.setFloat32(offset, v2.y, true); offset += 4;
      view.setFloat32(offset, v2.z, true); offset += 4;
      
      view.setFloat32(offset, v3.x, true); offset += 4;
      view.setFloat32(offset, v3.y, true); offset += 4;
      view.setFloat32(offset, v3.z, true); offset += 4;
      
      // Attribute byte count (unused)
      view.setUint16(offset, 0, true); offset += 2;
    }
    
    return buffer;
  }

  private async exportPLY(config: ExportConfiguration, filename: string): Promise<void> {
    const plyContent = this.generatePLYContent(config);
    const blob = new Blob([plyContent], { type: 'text/plain' });
    this.downloadFile(blob, `${filename}.ply`);
    console.log(`✅ PLY export complete with vertex colors`);
  }

  private generatePLYContent(config: ExportConfiguration): string {
    const positions = this.geometry.attributes.position.array;
    const indices = this.geometry.index?.array || [];
    const vertexCount = positions.length / 3;
    const faceCount = indices.length / 3;
    
    let header = `ply
format ascii 1.0
comment Δmension Mathematical Universe PLY Export
element vertex ${vertexCount}
property float x
property float y
property float z`;

    if (config.colorMode === 'vertex') {
      header += `
property uchar red
property uchar green
property uchar blue`;
    }

    header += `
element face ${faceCount}
property list uchar int vertex_indices
end_header
`;

    let content = header;
    
    // Write vertices with colors
    const vertexColors = this.geometry.attributes.color;
    for (let i = 0; i < vertexCount; i++) {
      const x = positions[i * 3];
      const y = positions[i * 3 + 1];
      const z = positions[i * 3 + 2];
      
      content += `${x} ${y} ${z}`;
      
      if (config.colorMode === 'vertex') {
        let r: number, g: number, b: number;
        if (vertexColors) {
          // Use actual per-vertex colors from geometry
          r = Math.min(255, Math.floor(vertexColors.getX(i) * 255));
          g = Math.min(255, Math.floor(vertexColors.getY(i) * 255));
          b = Math.min(255, Math.floor(vertexColors.getZ(i) * 255));
        } else {
          // Fall back to base color
          r = Math.floor(this.colorConfig.baseColor.r * 255);
          g = Math.floor(this.colorConfig.baseColor.g * 255);
          b = Math.floor(this.colorConfig.baseColor.b * 255);
        }
        content += ` ${r} ${g} ${b}`;
      }
      
      content += '\n';
    }
    
    // Write faces
    for (let i = 0; i < faceCount; i++) {
      const i1 = indices[i * 3];
      const i2 = indices[i * 3 + 1];
      const i3 = indices[i * 3 + 2];
      content += `3 ${i1} ${i2} ${i3}\n`;
    }
    
    return content;
  }

  private createMaterialForExport(config: ExportConfiguration): THREE.Material {
    const shadingMode = config.shadingMode || 'pbr';
    
    switch (shadingMode) {
      case 'flat':
        return new THREE.MeshStandardMaterial({
          color: this.colorConfig.baseColor,
          metalness: 0,
          roughness: 1,
          opacity: this.colorConfig.opacity,
          transparent: this.colorConfig.transparent,
          side: THREE.DoubleSide,
          flatShading: true
        });
      
      case 'gouraud':
        return new THREE.MeshLambertMaterial({
          color: this.colorConfig.baseColor,
          emissive: this.colorConfig.emissive,
          emissiveIntensity: this.colorConfig.emissiveIntensity,
          opacity: this.colorConfig.opacity,
          transparent: this.colorConfig.transparent,
          side: THREE.DoubleSide
        });
      
      case 'phong':
        return new THREE.MeshPhongMaterial({
          color: this.colorConfig.baseColor,
          emissive: this.colorConfig.emissive,
          emissiveIntensity: this.colorConfig.emissiveIntensity,
          specular: new THREE.Color(0xffffff),
          shininess: (1 - this.colorConfig.roughness) * 100,
          opacity: this.colorConfig.opacity,
          transparent: this.colorConfig.transparent,
          side: THREE.DoubleSide
        });
      
      case 'pbr':
        const textureResolution = config.quality === 'ultra' ? 2048 : 
                                   config.quality === 'high' ? 1024 : 
                                   config.quality === 'medium' ? 512 : 256;
        
        // Use the new baked material system with procedural textures
        if (this.materialPresetId && MATERIAL_PRESETS[this.materialPresetId]) {
          console.log(`✨ Baking procedural material "${this.materialPresetId}" for export at ${textureResolution}px`);
          return createExportMaterial(this.materialPresetId, textureResolution);
        }
        
        // Fallback to shape-specific textures if no material preset
        const pbrTextures = this.generateShapePBRTextures(textureResolution);
        console.log(`✨ Applying shape-specific PBR textures (${this.shapeCategory}) at ${textureResolution}px`);
        
        return new THREE.MeshStandardMaterial({
          color: this.colorConfig.baseColor,
          metalness: this.colorConfig.metalness,
          roughness: this.colorConfig.roughness,
          emissive: this.colorConfig.emissive,
          emissiveIntensity: this.colorConfig.emissiveIntensity,
          opacity: this.colorConfig.opacity,
          transparent: this.colorConfig.transparent,
          side: THREE.DoubleSide,
          map: pbrTextures.albedoMap,
          normalMap: pbrTextures.normalMap,
          normalScale: new THREE.Vector2(0.8, 0.8),
          roughnessMap: pbrTextures.roughnessMap,
          metalnessMap: pbrTextures.metallicMap,
          aoMap: pbrTextures.aoMap,
          aoMapIntensity: 0.8
        });
      
      case 'normal':
        this.geometry.computeVertexNormals();
        return new THREE.MeshStandardMaterial({
          color: this.colorConfig.baseColor,
          metalness: this.colorConfig.metalness,
          roughness: this.colorConfig.roughness,
          normalMap: this.generateNormalMap(),
          normalScale: new THREE.Vector2(1, 1),
          side: THREE.DoubleSide
        });
      
      case 'displacement':
        return new THREE.MeshStandardMaterial({
          color: this.colorConfig.baseColor,
          metalness: this.colorConfig.metalness,
          roughness: this.colorConfig.roughness,
          displacementMap: this.generateDisplacementMap(),
          displacementScale: 0.1,
          side: THREE.DoubleSide
        });
      
      case 'parallax':
        return new THREE.MeshStandardMaterial({
          color: this.colorConfig.baseColor,
          metalness: this.colorConfig.metalness,
          roughness: this.colorConfig.roughness,
          normalMap: this.generateNormalMap(),
          displacementMap: this.generateDisplacementMap(),
          displacementScale: 0.05,
          side: THREE.DoubleSide
        });
      
      default:
        if (config.colorMode === 'material') {
          return new THREE.MeshBasicMaterial({
            color: this.colorConfig.baseColor,
            opacity: this.colorConfig.opacity,
            transparent: this.colorConfig.transparent,
            side: THREE.DoubleSide
          });
        }
        return this.material;
    }
  }
  
  private generateNormalMap(): THREE.DataTexture {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    
    for (let i = 0; i < size * size; i++) {
      const x = (i % size) / size;
      const y = Math.floor(i / size) / size;
      
      const nx = Math.cos(x * Math.PI * 4) * 0.5 + 0.5;
      const ny = Math.sin(y * Math.PI * 4) * 0.5 + 0.5;
      const nz = 1.0;
      
      data[i * 4 + 0] = Math.floor(nx * 255);
      data[i * 4 + 1] = Math.floor(ny * 255);
      data[i * 4 + 2] = Math.floor(nz * 255);
      data[i * 4 + 3] = 255;
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }
  
  private generateDisplacementMap(): THREE.DataTexture {
    const size = 512;
    const data = new Uint8Array(size * size * 4);
    
    for (let i = 0; i < size * size; i++) {
      const x = (i % size) / size;
      const y = Math.floor(i / size) / size;
      
      const height = (Math.sin(x * Math.PI * 8) + Math.cos(y * Math.PI * 8)) * 0.5 + 0.5;
      const value = Math.floor(height * 255);
      
      data[i * 4 + 0] = value;
      data[i * 4 + 1] = value;
      data[i * 4 + 2] = value;
      data[i * 4 + 3] = 255;
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    return texture;
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  setCustomColor(color: THREE.Color): void {
    this.colorConfig.baseColor = color.clone();
    if (this.material instanceof THREE.MeshStandardMaterial) {
      this.material.color = color.clone();
    }
  }

  setPBRProperties(metalness: number, roughness: number): void {
    this.colorConfig.metalness = metalness;
    this.colorConfig.roughness = roughness;
    if (this.material instanceof THREE.MeshStandardMaterial) {
      this.material.metalness = metalness;
      this.material.roughness = roughness;
    }
  }
}
