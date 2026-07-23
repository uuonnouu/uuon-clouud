/**
 * CHAKRA ENERGY VISUALIZATIONS
 * Traditional 7 Chakra System - PLATONIC SYMBOLIC FORMS
 * Each chakra rendered as a simple, clean geometric symbol
 * 
 * Design Philosophy:
 * - Simple platonic forms representing each chakra's essence
 * - Clean polygon-based symbols (lotus petals, geometric patterns)
 * - UV domain 0-1 for basic rendering
 * - Low polygon counts for clear visualization
 * - User can add layers/noise/tension as needed
 * 
 * Chakra Petal Counts (Traditional):
 * - Root (Muladhara): 4 petals
 * - Sacral (Svadhisthana): 6 petals
 * - Solar Plexus (Manipura): 10 petals
 * - Heart (Anahata): 12 petals
 * - Throat (Vishuddha): 16 petals
 * - Third Eye (Ajna): 2 petals
 * - Crown (Sahasrara): 1000 petals (simplified)
 * 
 * © 2025 UUON Foundation Inc.
 */

import { ParametricSurface, getCleanDefaults } from '../types/shapes';
import { SurfaceParameters } from '../types/math';

export const CHAKRA_SHAPES: Record<string, ParametricSurface> = {

  // ============================================================================
  // ROOT CHAKRA (MULADHARA) - Base of Spine
  // Symbol: 4-petaled lotus | Color: Red | Element: Earth
  // ============================================================================
  
  chakra_root_muladhara: {
    name: "🔴 Root Chakra (Muladhara) - 4-Petal Earth Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 4;
      const petalShape = 1 + 0.3 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.2 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 32, vSegments: 16 })
  },

  // ============================================================================
  // SACRAL CHAKRA (SVADHISTHANA) - Lower Abdomen
  // Symbol: 6-petaled lotus | Color: Orange | Element: Water
  // ============================================================================
  
  chakra_sacral_svadhisthana: {
    name: "🟠 Sacral Chakra (Svadhisthana) - 6-Petal Water Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 6;
      const petalShape = 1 + 0.35 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.15 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 36, vSegments: 16 })
  },

  // ============================================================================
  // SOLAR PLEXUS CHAKRA (MANIPURA) - Upper Abdomen
  // Symbol: 10-petaled lotus | Color: Yellow | Element: Fire
  // ============================================================================
  
  chakra_solar_plexus_manipura: {
    name: "🟡 Solar Plexus Chakra (Manipura) - 10-Petal Fire Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 10;
      const petalShape = 1 + 0.25 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.18 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 40, vSegments: 16 })
  },

  // ============================================================================
  // HEART CHAKRA (ANAHATA) - Center of Chest
  // Symbol: 12-petaled lotus | Color: Green | Element: Air
  // ============================================================================
  
  chakra_heart_anahata: {
    name: "💚 Heart Chakra (Anahata) - 12-Petal Air Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 12;
      const petalShape = 1 + 0.22 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.12 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 16 })
  },

  // ============================================================================
  // THROAT CHAKRA (VISHUDDHA) - Throat
  // Symbol: 16-petaled lotus | Color: Blue | Element: Ether/Sound
  // ============================================================================
  
  chakra_throat_vishuddha: {
    name: "🔵 Throat Chakra (Vishuddha) - 16-Petal Sound Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 16;
      const petalShape = 1 + 0.18 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.1 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 16 })
  },

  // ============================================================================
  // THIRD EYE CHAKRA (AJNA) - Between Eyebrows
  // Symbol: 2-petaled lotus | Color: Indigo | Element: Light/Mind
  // ============================================================================
  
  chakra_third_eye_ajna: {
    name: "🟣 Third Eye Chakra (Ajna) - 2-Petal Vision Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 2;
      const petalShape = 1 + 0.5 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.3 * Math.sin(petals * theta) * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 32, vSegments: 16 })
  },

  // ============================================================================
  // CROWN CHAKRA (SAHASRARA) - Top of Head
  // Symbol: 1000-petaled lotus (simplified) | Color: Violet/White | Element: Consciousness
  // ============================================================================
  
  chakra_crown_sahasrara: {
    name: "⚪ Crown Chakra (Sahasrara) - Thousand-Petal Consciousness Symbol",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const petals = 24;
      const petalShape = 1 + 0.15 * Math.cos(petals * theta);
      const radius = scale * r * petalShape;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = 0.08 * Math.sin(petals * theta) * r + 0.2 * r * r;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 16 })
  },

  // ============================================================================
  // FREQUENCY-BASED CHAKRA VISUALIZATIONS
  // Simple geometric interpretations of healing frequencies
  // ============================================================================

  chakra_frequency_396: {
    name: "🎵 396 Hz Liberation Frequency - Root Activation",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const wave = 1 + 0.3 * Math.cos(4 * theta);
      const radius = scale * r * wave;
      
      return [radius * Math.cos(theta), radius * Math.sin(theta), 0.15 * Math.sin(4 * theta) * r];
    },
    defaultParams: getCleanDefaults({ uSegments: 32, vSegments: 16 })
  },

  chakra_frequency_528: {
    name: "🎵 528 Hz Miracle Frequency - Love/DNA Repair",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const phi = (1 + Math.sqrt(5)) / 2;
      const wave = 1 + 0.25 * Math.cos(phi * 6 * theta);
      const radius = scale * r * wave;
      
      return [radius * Math.cos(theta), radius * Math.sin(theta), 0.12 * Math.sin(6 * theta) * r];
    },
    defaultParams: getCleanDefaults({ uSegments: 36, vSegments: 16 })
  },

  chakra_frequency_963: {
    name: "🎵 963 Hz Crown Frequency - Divine Connection",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const wave = 1 + 0.12 * Math.cos(12 * theta);
      const radius = scale * r * wave;
      const dome = 0.3 * r * r;
      
      return [radius * Math.cos(theta), radius * Math.sin(theta), dome + 0.08 * Math.sin(12 * theta) * r];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 16 })
  },

  // ============================================================================
  // ADVANCED CHAKRA VISUALIZATIONS
  // Full alignment, Kundalini, and Solfeggio systems
  // ============================================================================

  chakra_full_alignment: {
    name: "🌈 Full Chakra Alignment - 7-Tier Energy Column",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const height = v * 7;
      
      const tier = Math.floor(height);
      const petalCounts = [4, 6, 10, 12, 16, 2, 24];
      const petals = petalCounts[Math.min(tier, 6)];
      
      const baseRadius = scale * 0.5;
      const petalEffect = 1 + 0.2 * Math.cos(petals * theta);
      const radius = baseRadius * petalEffect * (0.8 + 0.2 * Math.sin(height * Math.PI / 7));
      
      const x = radius * Math.cos(theta);
      const y = height * scale * 0.4;
      const z = radius * Math.sin(theta);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 48, vSegments: 32 })
  },

  kundalini_spiral: {
    name: "🐍 Kundalini Spiral - Rising Serpent Energy",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 6;
      const t = v;
      
      const spiralRadius = scale * 0.3 * (1 - t * 0.5);
      const height = t * scale * 3;
      const coils = 3.5;
      
      const x = spiralRadius * Math.cos(theta * coils);
      const y = height;
      const z = spiralRadius * Math.sin(theta * coils);
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 64, vSegments: 24 })
  },

  solfeggio_mandala: {
    name: "🎼 Solfeggio Mandala - 9 Sacred Frequencies",
    equation: (u, v, params) => {
      const scale = params.d ?? 2;
      const theta = u * Math.PI * 2;
      const r = v;
      
      const layers = 9;
      const wave1 = 0.15 * Math.cos(3 * theta);
      const wave2 = 0.12 * Math.cos(6 * theta);
      const wave3 = 0.08 * Math.cos(9 * theta);
      const totalWave = 1 + wave1 + wave2 + wave3;
      
      const radius = scale * r * totalWave;
      const height = 0.1 * scale * Math.sin(layers * theta) * r;
      
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      const z = height;
      
      return [x, y, z];
    },
    defaultParams: getCleanDefaults({ uSegments: 54, vSegments: 18 })
  }
};

console.log(`🧘 Loaded ${Object.keys(CHAKRA_SHAPES).length} Chakra & Frequency visualizations 🌈💫`);
