import { create } from 'zustand';

export type LightingMode = 'glow' | 'studio' | 'cinematic';

export interface LightingSettings {
  // Lighting Mode - controls post-processing style
  lightingMode: LightingMode;
  
  // Ambient Light
  ambientIntensity: number;
  ambientColor: string;
  
  // Key Light (Main Directional)
  keyLightIntensity: number;
  keyLightColor: string;
  keyLightX: number;
  keyLightY: number;
  keyLightZ: number;
  
  // Fill Light
  fillLightIntensity: number;
  fillLightColor: string;
  
  // Rim Light
  rimLightIntensity: number;
  rimLightColor: string;
  
  // Shadow Settings
  shadowsEnabled: boolean;
  shadowIntensity: number;
  shadowSoftness: number;
  shadowMapSize: number;
  
  // Environment
  environmentPreset: string;
  
  // Bloom/Glow Effects
  bloomEnabled: boolean;
  bloomIntensity: number;
  
  // SSAO (Studio mode)
  ssaoEnabled: boolean;
  ssaoIntensity: number;
  
  // NEW: Studio Enhancement Features
  uvOffsetX: number;
  uvOffsetY: number;
  materialOpacity: number;
  sharpness: number;
  contrast: number;
  saturation: number;
  
  // Presets
  activePreset: string;
}

export interface LightingStore extends LightingSettings {
  setLightingMode: (mode: LightingMode) => void;
  setAmbientIntensity: (value: number) => void;
  setAmbientColor: (value: string) => void;
  setKeyLightIntensity: (value: number) => void;
  setKeyLightColor: (value: string) => void;
  setKeyLightPosition: (x: number, y: number, z: number) => void;
  setFillLightIntensity: (value: number) => void;
  setFillLightColor: (value: string) => void;
  setRimLightIntensity: (value: number) => void;
  setRimLightColor: (value: string) => void;
  setShadowsEnabled: (value: boolean) => void;
  setShadowIntensity: (value: number) => void;
  setShadowSoftness: (value: number) => void;
  setShadowMapSize: (value: number) => void;
  setEnvironmentPreset: (value: string) => void;
  setBloomEnabled: (value: boolean) => void;
  setBloomIntensity: (value: number) => void;
  setSsaoEnabled: (value: boolean) => void;
  setSsaoIntensity: (value: number) => void;
  setUvOffsetX: (value: number) => void;
  setUvOffsetY: (value: number) => void;
  setMaterialOpacity: (value: number) => void;
  setSharpness: (value: number) => void;
  setContrast: (value: number) => void;
  setSaturation: (value: number) => void;
  applyPreset: (preset: string) => void;
  resetToDefaults: () => void;
}

const defaultSettings: LightingSettings = {
  lightingMode: 'studio',
  
  ambientIntensity: 0.25,
  ambientColor: '#ffffff',
  
  keyLightIntensity: 1.0,
  keyLightColor: '#ffffff',
  keyLightX: 8,
  keyLightY: 12,
  keyLightZ: 6,
  
  fillLightIntensity: 0.35,
  fillLightColor: '#445566',
  
  rimLightIntensity: 0.4,
  rimLightColor: '#6688aa',
  
  shadowsEnabled: true,
  shadowIntensity: 0.85,
  shadowSoftness: 2,
  shadowMapSize: 1024,
  
  environmentPreset: 'studio',
  
  bloomEnabled: false,
  bloomIntensity: 1.0,
  
  ssaoEnabled: true,
  ssaoIntensity: 0.5,
  
  uvOffsetX: 0,
  uvOffsetY: 0,
  materialOpacity: 1.0,
  sharpness: 0,
  contrast: 1.0,
  saturation: 1.0,
  
  activePreset: 'studioQuality'
};

export const LIGHTING_PRESETS: Record<string, Partial<LightingSettings>> = {
  studioQuality: {
    lightingMode: 'studio',
    ambientIntensity: 0.25,
    keyLightIntensity: 1.0,
    keyLightColor: '#ffffff',
    fillLightIntensity: 0.35,
    fillLightColor: '#445566',
    rimLightIntensity: 0.4,
    rimLightColor: '#6688aa',
    shadowsEnabled: true,
    shadowSoftness: 3,
    bloomEnabled: false,
    ssaoEnabled: true,
    ssaoIntensity: 0.5,
    environmentPreset: 'studio'
  },
  cinematic: {
    lightingMode: 'cinematic',
    ambientIntensity: 0.15,
    keyLightIntensity: 1.2,
    keyLightColor: '#fff5e6',
    fillLightIntensity: 0.2,
    fillLightColor: '#334455',
    rimLightIntensity: 0.6,
    rimLightColor: '#ffaa66',
    shadowsEnabled: true,
    shadowSoftness: 4,
    bloomEnabled: true,
    bloomIntensity: 0.3,
    ssaoEnabled: true,
    ssaoIntensity: 0.6,
    environmentPreset: 'night'
  },
  dramatic: {
    lightingMode: 'glow',
    ambientIntensity: 0.15,
    keyLightIntensity: 0.85,
    fillLightIntensity: 0.2,
    rimLightIntensity: 0.5,
    shadowsEnabled: true,
    shadowSoftness: 3,
    bloomEnabled: true,
    bloomIntensity: 0.6,
    ssaoEnabled: false,
    environmentPreset: 'night'
  },
  studio: {
    lightingMode: 'studio',
    ambientIntensity: 0.3,
    keyLightIntensity: 1.0,
    keyLightColor: '#ffffff',
    fillLightIntensity: 0.5,
    fillLightColor: '#ccddff',
    rimLightIntensity: 0.4,
    rimLightColor: '#ffffff',
    shadowsEnabled: true,
    shadowSoftness: 2,
    bloomEnabled: false,
    ssaoEnabled: true,
    environmentPreset: 'studio'
  },
  soft: {
    lightingMode: 'glow',
    ambientIntensity: 0.4,
    keyLightIntensity: 0.6,
    fillLightIntensity: 0.4,
    rimLightIntensity: 0.3,
    shadowsEnabled: true,
    shadowSoftness: 5,
    bloomEnabled: true,
    bloomIntensity: 0.4,
    ssaoEnabled: false,
    environmentPreset: 'sunset'
  },
  bright: {
    lightingMode: 'studio',
    ambientIntensity: 0.5,
    keyLightIntensity: 1.2,
    fillLightIntensity: 0.6,
    rimLightIntensity: 0.4,
    shadowsEnabled: true,
    shadowSoftness: 2,
    bloomEnabled: false,
    ssaoEnabled: true,
    environmentPreset: 'dawn'
  },
  moody: {
    lightingMode: 'cinematic',
    ambientIntensity: 0.08,
    keyLightIntensity: 0.7,
    keyLightColor: '#aaccff',
    fillLightIntensity: 0.1,
    rimLightIntensity: 0.6,
    rimLightColor: '#ff8844',
    shadowsEnabled: true,
    shadowSoftness: 4,
    bloomEnabled: true,
    bloomIntensity: 0.5,
    ssaoEnabled: true,
    environmentPreset: 'night'
  },
  scientific: {
    lightingMode: 'studio',
    ambientIntensity: 0.35,
    keyLightIntensity: 0.9,
    keyLightColor: '#f0f8ff',
    fillLightIntensity: 0.4,
    fillLightColor: '#e8e8ff',
    rimLightIntensity: 0.3,
    shadowsEnabled: true,
    shadowSoftness: 2,
    bloomEnabled: false,
    ssaoEnabled: true,
    ssaoIntensity: 0.4,
    environmentPreset: 'warehouse'
  },
  noShadows: {
    lightingMode: 'glow',
    ambientIntensity: 0.5,
    keyLightIntensity: 0.8,
    fillLightIntensity: 0.5,
    rimLightIntensity: 0.3,
    shadowsEnabled: false,
    bloomEnabled: true,
    ssaoEnabled: false,
    environmentPreset: 'city'
  }
};

export const useLightingStore = create<LightingStore>((set) => ({
  ...defaultSettings,
  
  setLightingMode: (mode) => {
    if (mode === 'studio') {
      set({ lightingMode: mode, bloomEnabled: false, ssaoEnabled: true });
    } else if (mode === 'glow') {
      set({ lightingMode: mode, bloomEnabled: true, ssaoEnabled: false });
    } else {
      set({ lightingMode: mode, bloomEnabled: true, ssaoEnabled: true });
    }
  },
  
  setAmbientIntensity: (value) => set({ ambientIntensity: value }),
  setAmbientColor: (value) => set({ ambientColor: value }),
  
  setKeyLightIntensity: (value) => set({ keyLightIntensity: value }),
  setKeyLightColor: (value) => set({ keyLightColor: value }),
  setKeyLightPosition: (x, y, z) => set({ keyLightX: x, keyLightY: y, keyLightZ: z }),
  
  setFillLightIntensity: (value) => set({ fillLightIntensity: value }),
  setFillLightColor: (value) => set({ fillLightColor: value }),
  
  setRimLightIntensity: (value) => set({ rimLightIntensity: value }),
  setRimLightColor: (value) => set({ rimLightColor: value }),
  
  setShadowsEnabled: (value) => set({ shadowsEnabled: value }),
  setShadowIntensity: (value) => set({ shadowIntensity: value }),
  setShadowSoftness: (value) => set({ shadowSoftness: value }),
  setShadowMapSize: (value) => set({ shadowMapSize: value }),
  
  setEnvironmentPreset: (value) => set({ environmentPreset: value }),
  
  setBloomEnabled: (value) => set({ bloomEnabled: value }),
  setBloomIntensity: (value) => set({ bloomIntensity: value }),
  
  setSsaoEnabled: (value) => set({ ssaoEnabled: value }),
  setSsaoIntensity: (value) => set({ ssaoIntensity: value }),
  
  setUvOffsetX: (value) => set({ uvOffsetX: value }),
  setUvOffsetY: (value) => set({ uvOffsetY: value }),
  setMaterialOpacity: (value) => set({ materialOpacity: value }),
  setSharpness: (value) => set({ sharpness: value }),
  setContrast: (value) => set({ contrast: value }),
  setSaturation: (value) => set({ saturation: value }),
  
  applyPreset: (preset) => {
    const presetSettings = LIGHTING_PRESETS[preset];
    if (presetSettings) {
      set({ ...presetSettings, activePreset: preset });
    }
  },
  
  resetToDefaults: () => set({ ...defaultSettings })
}));
