/**
 * RENDERING CONFIGURATION MANAGER
 * Single source of truth for all WebGL renderer settings
 * Prevents conflicts from multiple components trying to modify renderer
 * 
 * DESIGN: Flat architecture - no hierarchies, all components READ ONLY
 */

import * as THREE from 'three';

export interface RenderingConfig {
  // Tone Mapping
  toneMapping: THREE.ToneMapping;
  toneMappingExposure: number;
  
  // Color Space
  outputColorSpace: THREE.ColorSpace;
  
  // Shadow Settings
  shadowMap: {
    enabled: boolean;
    type: THREE.ShadowMapType;
    autoUpdate: boolean;
  };
  
  // Antialiasing & Quality
  antialias: boolean;
  pixelRatio: number;
  
  // Performance
  powerPreference: 'default' | 'high-performance' | 'low-power';
  preserveDrawingBuffer: boolean;
  alpha: boolean;
  depth: boolean;
  stencil: boolean;
  
  // Gamma Correction
  gammaFactor: number;
}

class RenderingConfigManager {
  private static instance: RenderingConfigManager;
  private config: RenderingConfig;
  private initialized: boolean = false;
  private renderer: THREE.WebGLRenderer | null = null;

  private constructor() {
    // Default configuration optimized for mathematical visualization
    // FIXED: Reduced exposure from 1.6 to 1.0 to preserve topological detail
    this.config = {
      toneMapping: THREE.ACESFilmicToneMapping,
      toneMappingExposure: 1.0, // Reduced for better topological detail visibility
      outputColorSpace: THREE.SRGBColorSpace,
      shadowMap: {
        enabled: true,
        type: THREE.PCFSoftShadowMap,
        autoUpdate: true
      },
      antialias: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
      alpha: false,
      depth: true,
      stencil: false,
      gammaFactor: 2.2
    };
  }

  static getInstance(): RenderingConfigManager {
    if (!RenderingConfigManager.instance) {
      RenderingConfigManager.instance = new RenderingConfigManager();
    }
    return RenderingConfigManager.instance;
  }

  /**
   * Initialize renderer with centralized config
   * Called ONCE during app startup
   */
  initialize(gl: THREE.WebGLRenderer, isMobile: boolean = false): void {
    if (this.initialized) {
      console.warn('⚠️ RenderingConfigManager already initialized');
      return;
    }

    this.renderer = gl;

    // Adjust config for mobile devices
    if (isMobile) {
      this.config.toneMappingExposure = 1.5;
      this.config.shadowMap.enabled = false;
      this.config.pixelRatio = 1;
      this.config.powerPreference = 'default';
    }

    // Apply all settings to renderer
    this.applyConfig();
    
    this.initialized = true;
    console.log('✅ RenderingConfigManager initialized:', this.config);
  }

  /**
   * Apply current config to renderer
   * Private method - config changes flow through update methods
   */
  private applyConfig(): void {
    if (!this.renderer) {
      console.error('❌ Cannot apply config: renderer not set');
      return;
    }

    // Tone mapping
    this.renderer.toneMapping = this.config.toneMapping;
    this.renderer.toneMappingExposure = this.config.toneMappingExposure;

    // Color space
    this.renderer.outputColorSpace = this.config.outputColorSpace;

    // Shadows
    this.renderer.shadowMap.enabled = this.config.shadowMap.enabled;
    this.renderer.shadowMap.type = this.config.shadowMap.type;
    this.renderer.shadowMap.autoUpdate = this.config.shadowMap.autoUpdate;

    // Pixel ratio
    this.renderer.setPixelRatio(this.config.pixelRatio);

    console.log('🔧 Renderer config applied');
  }

  /**
   * Get current configuration (READ ONLY)
   * Components should use this to read settings, never modify renderer directly
   */
  getConfig(): Readonly<RenderingConfig> {
    return Object.freeze({ ...this.config });
  }

  /**
   * Update tone mapping exposure (e.g., for energy level changes)
   * Only allowed method for runtime config changes
   */
  setToneMappingExposure(exposure: number): void {
    if (!this.initialized) {
      console.warn('⚠️ Cannot update exposure: manager not initialized');
      return;
    }

    this.config.toneMappingExposure = Math.max(0.5, Math.min(3.0, exposure));
    
    if (this.renderer) {
      this.renderer.toneMappingExposure = this.config.toneMappingExposure;
    }
  }

  /**
   * Check if renderer is properly configured
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get canvas properties for export
   */
  getCanvasProperties() {
    return {
      toneMapping: this.config.toneMapping,
      toneMappingExposure: this.config.toneMappingExposure,
      outputColorSpace: this.config.outputColorSpace,
      gammaFactor: this.config.gammaFactor
    };
  }
}

// Singleton instance
export const renderingConfig = RenderingConfigManager.getInstance();
