/**
 * CUSTOM TEXTURE MANAGER
 * Handles user-uploaded textures and creates material presets from them
 * Integrated with Fractal UV Mapping Engine for advanced texture mapping
 */

import * as THREE from 'three';
import { UVMappingMode, UVMappingOptions, applyFractalUVsToGeometry } from './fractalUVMapping';

export interface CustomTexture {
  id: string;
  name: string;
  url: string;
  type: 'albedo' | 'normal' | 'roughness' | 'metallic' | 'combined';
  uploadedAt: number;
}

export interface UVMappingConfig {
  mode: UVMappingMode;
  scale: number;
  offsetU: number;
  offsetV: number;
  rotation: number;
  fractalIterations: number;
  seamless: boolean;
}

export interface CustomMaterialPreset {
  id: string;
  name: string;
  texture: CustomTexture;
  properties: {
    color: string;
    metalness: number;
    roughness: number;
    normalScale?: number;
  };
  uvMapping?: UVMappingConfig;
}

class CustomTextureManager {
  private customTextures: Map<string, CustomTexture> = new Map();
  private customPresets: Map<string, CustomMaterialPreset> = new Map();
  private textureLoader: THREE.TextureLoader;

  constructor() {
    this.textureLoader = new THREE.TextureLoader();
    this.loadFromStorage();
  }

  async uploadTexture(file: File, name: string, type: CustomTexture['type'] = 'albedo'): Promise<CustomTexture> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const url = e.target?.result as string;
        const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        const customTexture: CustomTexture = {
          id,
          name,
          url,
          type,
          uploadedAt: Date.now()
        };

        this.customTextures.set(id, customTexture);

        // Create a material preset from this texture
        const preset = this.createPresetFromTexture(customTexture);
        this.customPresets.set(preset.id, preset);

        this.saveToStorage();

        console.log(`✅ Uploaded texture: ${name}`, customTexture);
        resolve(customTexture);
      };

      reader.onerror = (error) => {
        console.error('Error reading texture file:', error);
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  private createPresetFromTexture(texture: CustomTexture): CustomMaterialPreset {
    return {
      id: `preset_${texture.id}`,
      name: texture.name,
      texture,
      properties: {
        color: '#ffffff',
        metalness: texture.type === 'metallic' ? 1 : 0.3,
        roughness: texture.type === 'roughness' ? 0.8 : 0.4,
        normalScale: texture.type === 'normal' ? 1 : undefined
      }
    };
  }

  createMaterialFromCustomPreset(presetId: string, side: THREE.Side = THREE.DoubleSide): THREE.MeshStandardMaterial | null {
    const preset = this.customPresets.get(presetId);

    if (!preset) {
      console.warn(`Custom preset "${presetId}" not found`);
      return null;
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(preset.properties.color),
      metalness: preset.properties.metalness,
      roughness: preset.properties.roughness,
      side
    });

    // NO-NULL-TEXTURE CONTRACT: Use loadTextureSafe to guarantee valid texture
    this.loadTextureSafe(preset.texture.url, preset.properties.color).then((loadedTexture) => {
      loadedTexture.wrapS = THREE.RepeatWrapping;
      loadedTexture.wrapT = THREE.RepeatWrapping;

      switch (preset.texture.type) {
        case 'albedo':
        case 'combined':
          material.map = loadedTexture;
          break;
        case 'normal':
          material.normalMap = loadedTexture;
          if (preset.properties.normalScale) {
            material.normalScale = new THREE.Vector2(
              preset.properties.normalScale,
              preset.properties.normalScale
            );
          }
          break;
        case 'roughness':
          material.roughnessMap = loadedTexture;
          break;
        case 'metallic':
          material.metalnessMap = loadedTexture;
          break;
      }

      material.needsUpdate = true;
      
      if (loadedTexture.userData.isFallback) {
        console.log(`🔄 Applied fallback texture for preset: ${preset.name}`);
      }
    });

    return material;
  }

  getAllCustomPresets(): CustomMaterialPreset[] {
    return Array.from(this.customPresets.values());
  }

  getCustomTextures(): CustomTexture[] {
    return Array.from(this.customTextures.values());
  }

  deleteTexture(id: string): void {
    const texture = this.customTextures.get(id);
    if (texture) {
      this.customTextures.delete(id);
      this.customPresets.delete(`preset_${id}`);
      this.saveToStorage();
      console.log(`🗑️ Deleted texture: ${texture.name}`);
    }
  }

  private saveToStorage(): void {
    try {
      const textures = Array.from(this.customTextures.values());
      localStorage.setItem('uuon-custom-textures', JSON.stringify(textures));
      console.log(`💾 Saved ${textures.length} custom textures to storage`);
    } catch (error) {
      console.error('Error saving textures to storage:', error);
    }
  }

  private loadFromStorage(): void {
    try {
      const oldStored = localStorage.getItem('customTextures');
      if (oldStored) {
        localStorage.setItem('uuon-custom-textures', oldStored);
        localStorage.removeItem('customTextures');
      }

      const stored = localStorage.getItem('uuon-custom-textures');
      if (stored) {
        const textures: CustomTexture[] = JSON.parse(stored);
        textures.forEach(texture => {
          this.customTextures.set(texture.id, texture);
          const preset = this.createPresetFromTexture(texture);
          this.customPresets.set(preset.id, preset);
        });
        console.log(`📂 Loaded ${textures.length} custom textures from storage`);
      }
    } catch (error) {
      // NO-NULL-TEXTURE CONTRACT: Log warning but don't fail
      // Storage empty or corrupted - this is normal for first-time users
      console.log('📂 No custom textures in storage (first use or cleared)');
    }
  }
  
  /**
   * NO-NULL-TEXTURE CONTRACT: Safe texture loader
   * Always returns a valid texture - never null/undefined
   * Implements industry-standard fallback pattern
   */
  loadTextureSafe(url: string, fallbackColor: string = '#cccccc'): Promise<THREE.Texture> {
    return new Promise((resolve) => {
      this.textureLoader.load(
        url,
        (texture) => {
          texture.userData.source = url;
          texture.userData.isFallback = false;
          resolve(texture);
        },
        undefined,
        (error) => {
          console.warn(`⚠️ Texture load failed for ${url}. Using fallback.`);
          resolve(this.makeFallbackTexture(fallbackColor));
        }
      );
    });
  }
  
  /**
   * NO-NULL-TEXTURE CONTRACT: Create guaranteed valid fallback texture
   * Returns a valid GPU-safe texture with known dimensions
   */
  makeFallbackTexture(color: string = '#cccccc'): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 32, 32);
    }
    
    const fallback = new THREE.CanvasTexture(canvas);
    fallback.userData.isFallback = true;
    fallback.userData.fallbackColor = color;
    return fallback;
  }
  
  /**
   * Get the global fallback texture (cached for consistency)
   */
  private _globalFallback: THREE.Texture | null = null;
  getGlobalFallbackTexture(): THREE.Texture {
    if (!this._globalFallback) {
      this._globalFallback = this.makeFallbackTexture('#888888');
    }
    return this._globalFallback;
  }

  clearAllCustomTextures(): void {
    this.customTextures.clear();
    this.customPresets.clear();
    localStorage.removeItem('uuon-custom-textures');
    console.log('🗑️ Cleared all custom textures');
  }

  /**
   * Apply fractal UV mapping to geometry based on preset configuration
   */
  applyUVMappingToGeometry(
    geometry: THREE.BufferGeometry,
    presetId: string
  ): THREE.BufferGeometry {
    const preset = this.customPresets.get(presetId);

    if (!preset?.uvMapping) {
      return geometry;
    }

    const uvOptions: Partial<UVMappingOptions> = {
      mode: preset.uvMapping.mode,
      scale: preset.uvMapping.scale,
      offset: {
        u: preset.uvMapping.offsetU,
        v: preset.uvMapping.offsetV
      },
      rotation: preset.uvMapping.rotation,
      fractalIterations: preset.uvMapping.fractalIterations,
      seamless: preset.uvMapping.seamless
    };

    return applyFractalUVsToGeometry(geometry, uvOptions);
  }

  /**
   * Update UV mapping configuration for a preset
   */
  updatePresetUVMapping(presetId: string, uvConfig: UVMappingConfig): void {
    const preset = this.customPresets.get(presetId);
    if (preset) {
      preset.uvMapping = uvConfig;
      this.customPresets.set(presetId, preset);
      this.saveToStorage();
      console.log(`🔄 Updated UV mapping for preset: ${preset.name}`);
    }
  }

  /**
   * Get default UV mapping configuration
   */
  getDefaultUVMapping(): UVMappingConfig {
    return {
      mode: 'spherical',
      scale: 1,
      offsetU: 0,
      offsetV: 0,
      rotation: 0,
      fractalIterations: 8,
      seamless: true
    };
  }

  /**
   * Get available UV mapping modes
   */
  getAvailableUVModes(): UVMappingMode[] {
    return [
      'spherical',
      'cylindrical',
      'planar',
      'box',
      'fractal-mandelbrot',
      'fractal-julia',
      'fractal-perlin',
      'hexagonal',
      'toroidal',
      'polar',
      'triplanar'
    ];
  }
}

// Singleton instance
export const customTextureManager = new CustomTextureManager();