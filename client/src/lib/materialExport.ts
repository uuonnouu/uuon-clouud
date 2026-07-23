/**
 * MATERIAL EXPORT SYSTEM
 * Exports 3D models with full material and shader properties
 * Supports GLTF/GLB format with embedded textures and PBR materials
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export interface MaterialExportOptions {
  format: 'gltf' | 'glb';
  includeTextures: boolean;
  includePBRProperties: boolean;
  includeProceduralParams: boolean;
  resolution: '4K' | 'FHD' | 'HD' | 'SD';
  embedTextures: boolean;
}

export interface ExportedMaterialData {
  name: string;
  type: string;
  color?: string;
  metalness?: number;
  roughness?: number;
  normalScale?: number;
  proceduralParams?: Record<string, any>;
  textureData?: {
    albedo?: string;
    normal?: string;
    roughness?: string;
    metallic?: string;
  };
}

export class MaterialExporter {
  private exporter: GLTFExporter;

  constructor() {
    this.exporter = new GLTFExporter();
  }

  /**
   * Export mesh with full material properties to GLTF/GLB
   */
  async exportWithMaterials(
    mesh: THREE.Mesh,
    options: Partial<MaterialExportOptions> = {}
  ): Promise<Blob> {
    const defaultOptions: MaterialExportOptions = {
      format: 'glb',
      includeTextures: true,
      includePBRProperties: true,
      includeProceduralParams: true,
      resolution: 'FHD',
      embedTextures: true
    };

    const opts = { ...defaultOptions, ...options };

    return new Promise((resolve, reject) => {
      const gltfOptions = {
        binary: opts.format === 'glb',
        embedImages: opts.embedTextures,
        includeCustomExtensions: true,
        maxTextureSize: this.getMaxTextureSize(opts.resolution)
      };

      this.exporter.parse(
        mesh,
        (result) => {
          const blob = opts.format === 'glb'
            ? new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' })
            : new Blob([JSON.stringify(result)], { type: 'application/json' });
          
          resolve(blob);
        },
        (error) => {
          reject(error);
        },
        gltfOptions
      );
    });
  }

  /**
   * Extract material data for JSON export
   */
  extractMaterialData(material: THREE.Material): ExportedMaterialData {
    const data: ExportedMaterialData = {
      name: material.name || 'Unnamed Material',
      type: material.type
    };

    // Extract PBR properties if MeshStandardMaterial
    if (material instanceof THREE.MeshStandardMaterial) {
      data.color = `#${material.color.getHexString()}`;
      data.metalness = material.metalness;
      data.roughness = material.roughness;
      
      if (material.normalMap) {
        data.normalScale = material.normalScale?.x || 1;
      }

      // Extract texture data
      data.textureData = {};
      if (material.map) {
        data.textureData.albedo = this.textureToDataURL(material.map);
      }
      if (material.normalMap) {
        data.textureData.normal = this.textureToDataURL(material.normalMap);
      }
      if (material.roughnessMap) {
        data.textureData.roughness = this.textureToDataURL(material.roughnessMap);
      }
      if (material.metalnessMap) {
        data.textureData.metallic = this.textureToDataURL(material.metalnessMap);
      }
    }

    // Extract shader uniforms if ShaderMaterial
    if (material instanceof THREE.ShaderMaterial) {
      data.proceduralParams = {};
      Object.entries(material.uniforms).forEach(([key, uniform]) => {
        if (typeof uniform.value === 'number' || typeof uniform.value === 'string') {
          data.proceduralParams![key] = uniform.value;
        } else if (uniform.value instanceof THREE.Color) {
          data.proceduralParams![key] = `#${uniform.value.getHexString()}`;
        }
      });
    }

    return data;
  }

  /**
   * Convert texture to data URL for embedding
   */
  private textureToDataURL(texture: THREE.Texture): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx || !texture.image) return '';

    canvas.width = texture.image.width;
    canvas.height = texture.image.height;
    ctx.drawImage(texture.image, 0, 0);
    
    return canvas.toDataURL('image/png');
  }

  /**
   * Get maximum texture size based on resolution setting
   */
  private getMaxTextureSize(resolution: MaterialExportOptions['resolution']): number {
    switch (resolution) {
      case '4K': return 4096;
      case 'FHD': return 2048;
      case 'HD': return 1024;
      case 'SD': return 512;
      default: return 2048;
    }
  }

  /**
   * Export scene with all materials to downloadable file
   */
  async exportSceneToFile(
    scene: THREE.Scene | THREE.Mesh,
    filename: string,
    options: Partial<MaterialExportOptions> = {}
  ): Promise<void> {
    try {
      const blob = await this.exportWithMaterials(
        scene instanceof THREE.Mesh ? scene : (scene.children[0] as THREE.Mesh),
        options
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      console.log(`✅ Exported ${filename} with materials successfully`);
    } catch (error) {
      console.error('❌ Material export failed:', error);
      throw error;
    }
  }

  /**
   * Export material properties as JSON metadata
   */
  exportMaterialJSON(material: THREE.Material, filename: string): void {
    const data = this.extractMaterialData(material);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    console.log(`✅ Exported material JSON: ${filename}`);
  }
}

// Singleton instance
export const materialExporter = new MaterialExporter();

/**
 * Quick export function for convenience
 */
export async function exportMeshWithMaterials(
  mesh: THREE.Mesh,
  filename: string,
  format: 'gltf' | 'glb' = 'glb'
): Promise<void> {
  await materialExporter.exportSceneToFile(mesh, filename, { format });
}
