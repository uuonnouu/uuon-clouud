/**
 * UNIFIED RGBA-HDR COLOR SYSTEM
 * Integrates spectral, HDR, and phi-harmonic color engines
 * Provides global rendering profile for all 699 shapes
 * 
 * Features:
 * - Spectral wavelength mapping (380-740nm)
 * - HDR with extended luminance
 * - Phi harmonic color relationships
 * - HSL control interface
 */

import * as THREE from 'three';
import { wavelengthToRGB, spectralGradient, EMISSION_LINES, blackbodyColor } from './spectralColorEngine';
import { createHDRColor, hdrToDisplayColor, acesToneMap, colorToHDR, HDRColor } from './hdrColorSystem';
import { phiHarmonicColor, phiPalette, rgbToHSL, modulateWithPhi, PHI, GOLDEN_ANGLE } from './phiHarmonicModulator';

export interface UnifiedColorProfile {
  mode: 'spectral' | 'phi-harmonic' | 'hdr-boost' | 'blackbody' | 'emission' | 'phi-spectral';
  
  // HSL controls
  hueShift: number;        // Hue rotation (0-360°)
  saturation: number;      // Saturation multiplier (0-2)
  lightness: number;       // Lightness adjustment (-1 to 1)
  
  // Spectral parameters
  wavelength?: number;     // Single wavelength (nm)
  wavelengthMin?: number;  // Min wavelength for gradients
  wavelengthMax?: number;  // Max wavelength for gradients
  
  // HDR parameters
  exposure: number;        // HDR exposure (0.1-10)
  hdrBoost: number;        // Emissive intensity (1-5)
  toneMapping: 'reinhard' | 'aces' | 'none';
  
  // Phi harmonic parameters
  phiSteps: number;        // Number of golden angle steps
  phiIntensity: number;    // Phi modulation strength (0-1)
  
  // Temperature (for blackbody mode)
  temperature?: number;    // Kelvin (1000-15000)
  
  // Emission line (for emission mode)
  emissionLine?: keyof typeof EMISSION_LINES;
}

export const DEFAULT_COLOR_PROFILE: UnifiedColorProfile = {
  mode: 'phi-spectral',
  hueShift: 0,
  saturation: 1.0,
  lightness: 0,
  exposure: 1.0,
  hdrBoost: 1.0,
  toneMapping: 'aces',
  phiSteps: 1,
  phiIntensity: 0.5,
  wavelengthMin: 380,
  wavelengthMax: 740
};

/**
 * Apply unified color profile to get final color
 * @param baseColor Starting color (can be from shape, UV, etc)
 * @param profile Color profile settings
 * @param u Parametric U coordinate (0-1)
 * @param v Parametric V coordinate (0-1)
 */
export function applyColorProfile(
  baseColor: THREE.Color | null,
  profile: UnifiedColorProfile,
  u: number = 0.5,
  v: number = 0.5
): { color: THREE.Color; emissive: THREE.Color; emissiveIntensity: number } {
  let finalColor: THREE.Color;
  let hdrColor: HDRColor;
  
  // STEP 1: Generate base color based on mode
  switch (profile.mode) {
    case 'spectral':
      // Pure spectral gradient
      finalColor = spectralGradient(
        u,
        v,
        profile.wavelengthMin || 380,
        profile.wavelengthMax || 740
      );
      break;
      
    case 'phi-harmonic':
      // Phi-based color harmony
      const baseHue = baseColor ? rgbToHSL(baseColor).h : 0;
      finalColor = phiHarmonicColor(baseHue, profile.phiSteps, profile.saturation, 0.5);
      break;
      
    case 'blackbody':
      // Blackbody radiation
      finalColor = blackbodyColor(profile.temperature || 5778);
      break;
      
    case 'emission':
      // Quantum emission line
      if (profile.emissionLine) {
        const wavelength = EMISSION_LINES[profile.emissionLine];
        finalColor = wavelengthToRGB(wavelength);
      } else {
        finalColor = baseColor || new THREE.Color(1, 1, 1);
      }
      break;
      
    case 'phi-spectral':
      // Hybrid: Spectral gradient with phi modulation
      const spectralColor = spectralGradient(
        u,
        v,
        profile.wavelengthMin || 380,
        profile.wavelengthMax || 740
      );
      finalColor = modulateWithPhi(spectralColor, profile.phiIntensity);
      break;
      
    case 'hdr-boost':
      // HDR-boosted base color
      finalColor = baseColor || new THREE.Color(0.5, 0.5, 0.5);
      break;
      
    default:
      finalColor = baseColor || new THREE.Color(1, 1, 1);
  }
  
  // STEP 2: Apply HSL adjustments
  finalColor = applyHSLAdjustments(finalColor, profile);
  
  // STEP 3: Convert to HDR
  hdrColor = colorToHDR(finalColor, profile.hdrBoost);
  
  // STEP 4: Tone map back to display color
  let displayColor: THREE.Color;
  if (profile.toneMapping === 'aces') {
    displayColor = acesToneMap(hdrColor, profile.exposure);
  } else if (profile.toneMapping === 'reinhard') {
    displayColor = hdrToDisplayColor(hdrColor, profile.exposure);
  } else {
    displayColor = new THREE.Color(
      Math.min(1, hdrColor.r * profile.exposure),
      Math.min(1, hdrColor.g * profile.exposure),
      Math.min(1, hdrColor.b * profile.exposure)
    );
  }
  
  // STEP 5: Extract emissive component for glow
  const emissiveIntensity = Math.max(0, profile.hdrBoost - 1.0);
  const emissive = displayColor.clone().multiplyScalar(emissiveIntensity);
  
  return {
    color: displayColor,
    emissive,
    emissiveIntensity: emissiveIntensity * 0.8
  };
}

/**
 * Apply HSL transformations
 */
function applyHSLAdjustments(color: THREE.Color, profile: UnifiedColorProfile): THREE.Color {
  const hsl = rgbToHSL(color);
  
  // Shift hue
  let newHue = (hsl.h + profile.hueShift) % 360;
  if (newHue < 0) newHue += 360;
  
  // Adjust saturation
  const newSat = Math.max(0, Math.min(1, hsl.s * profile.saturation));
  
  // Adjust lightness
  let newLight = hsl.l + profile.lightness;
  newLight = Math.max(0, Math.min(1, newLight));
  
  // Convert back to RGB
  return hslToRGB(newHue / 360, newSat, newLight);
}

/**
 * Helper to convert HSL to RGB
 */
function hslToRGB(h: number, s: number, l: number): THREE.Color {
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const r = hue2rgb(p, q, h + 1/3);
  const g = hue2rgb(p, q, h);
  const b = hue2rgb(p, q, h - 1/3);

  return new THREE.Color(r, g, b);
}

/**
 * Get color for shape type with intelligent defaults
 */
export function getShapeColor(
  shapeType: string,
  profile: UnifiedColorProfile,
  u: number = 0.5,
  v: number = 0.5
): { color: THREE.Color; emissive: THREE.Color; emissiveIntensity: number } {
  const typeLower = shapeType.toLowerCase();
  
  // Biological shapes: Use spectral mode with organic wavelengths
  if (typeLower.includes('cell') || typeLower.includes('blood') || typeLower.includes('virus')) {
    const bioProfile = {
      ...profile,
      mode: 'phi-spectral' as const,
      wavelengthMin: 500,  // Green-red range for organic colors
      wavelengthMax: 650,
      phiIntensity: 0.7
    };
    return applyColorProfile(null, bioProfile, u, v);
  }
  
  // Quantum/atomic shapes: Use emission lines
  if (typeLower.includes('quantum') || typeLower.includes('atom') || typeLower.includes('orbital')) {
    const quantumProfile = {
      ...profile,
      mode: 'emission' as const,
      emissionLine: 'hydrogen_alpha' as keyof typeof EMISSION_LINES,
      hdrBoost: 1.5
    };
    return applyColorProfile(null, quantumProfile, u, v);
  }
  
  // Wave shapes: Full spectral gradient
  if (typeLower.includes('wave')) {
    const waveProfile = {
      ...profile,
      mode: 'spectral' as const,
      wavelengthMin: 380,
      wavelengthMax: 740
    };
    return applyColorProfile(null, waveProfile, u, v);
  }
  
  // Default: Use profile as-is
  return applyColorProfile(null, profile, u, v);
}

/**
 * Preset color profiles for quick access
 */
export const COLOR_PRESETS: Record<string, UnifiedColorProfile> = {
  'Spectral Rainbow': {
    mode: 'spectral',
    hueShift: 0,
    saturation: 1.0,
    lightness: 0,
    exposure: 1.0,
    hdrBoost: 1.0,
    toneMapping: 'aces',
    phiSteps: 0,
    phiIntensity: 0,
    wavelengthMin: 380,
    wavelengthMax: 740
  },
  
  'Golden Harmony': {
    mode: 'phi-harmonic',
    hueShift: 0,
    saturation: 1.0,
    lightness: 0,
    exposure: 1.0,
    hdrBoost: 1.2,
    toneMapping: 'aces',
    phiSteps: 3,
    phiIntensity: 1.0,
    wavelengthMin: 380,
    wavelengthMax: 740
  },
  
  'Quantum Glow': {
    mode: 'emission',
    hueShift: 0,
    saturation: 1.2,
    lightness: 0.1,
    exposure: 1.2,
    hdrBoost: 2.0,
    toneMapping: 'aces',
    phiSteps: 0,
    phiIntensity: 0,
    emissionLine: 'hydrogen_beta'
  },
  
  'Solar Temperature': {
    mode: 'blackbody',
    hueShift: 0,
    saturation: 1.0,
    lightness: 0,
    exposure: 1.0,
    hdrBoost: 1.5,
    toneMapping: 'aces',
    phiSteps: 0,
    phiIntensity: 0,
    temperature: 5778
  },
  
  'Phi-Spectral Hybrid': {
    mode: 'phi-spectral',
    hueShift: 0,
    saturation: 1.0,
    lightness: 0,
    exposure: 1.0,
    hdrBoost: 1.3,
    toneMapping: 'aces',
    phiSteps: 1,
    phiIntensity: 0.6,
    wavelengthMin: 380,
    wavelengthMax: 740
  }
};
