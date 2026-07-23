/**
 * HDR COLOR SYSTEM
 * High Dynamic Range color processing with extended luminance range
 * Supports values beyond standard 0-1 RGB for glowing/emissive effects
 * 
 * Features:
 * - Extended range RGBA (values > 1.0)
 * - Tone mapping for display
 * - Bloom-ready emissive colors
 * - Exposure control
 */

import * as THREE from 'three';

export interface HDRColor {
  r: number;  // Red channel (can exceed 1.0)
  g: number;  // Green channel (can exceed 1.0)
  b: number;  // Blue channel (can exceed 1.0)
  a: number;  // Alpha channel (0-1)
  luminance: number;  // Perceived brightness
}

/**
 * Create HDR color from standard RGB
 * @param r Red (0-∞, values >1 are HDR)
 * @param g Green (0-∞, values >1 are HDR)
 * @param b Blue (0-∞, values >1 are HDR)
 * @param a Alpha (0-1)
 */
export function createHDRColor(r: number, g: number, b: number, a: number = 1.0): HDRColor {
  // Calculate relative luminance (ITU-R BT.709)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  
  return { r, g, b, a, luminance };
}

/**
 * Convert HDR color to THREE.Color (tone mapped for display)
 * Uses Reinhard tone mapping
 */
export function hdrToDisplayColor(hdr: HDRColor, exposure: number = 1.0): THREE.Color {
  // Apply exposure
  let r = hdr.r * exposure;
  let g = hdr.g * exposure;
  let b = hdr.b * exposure;
  
  // Reinhard tone mapping: c_display = c / (1 + c)
  r = r / (1 + r);
  g = g / (1 + g);
  b = b / (1 + b);
  
  return new THREE.Color(r, g, b);
}

/**
 * ACES Filmic tone mapping (more cinematic look)
 */
export function acesToneMap(hdr: HDRColor, exposure: number = 1.0): THREE.Color {
  const a = 2.51;
  const b = 0.03;
  const c = 2.43;
  const d = 0.59;
  const e = 0.14;
  
  const toneMap = (x: number) => {
    x *= exposure;
    return Math.max(0, (x * (a * x + b)) / (x * (c * x + d) + e));
  };
  
  return new THREE.Color(
    toneMap(hdr.r),
    toneMap(hdr.g),
    toneMap(hdr.b)
  );
}

/**
 * Create emissive HDR color (for glowing effects)
 * @param baseColor Base color
 * @param intensity Glow intensity (>1 = HDR)
 */
export function createEmissiveHDR(baseColor: THREE.Color, intensity: number): HDRColor {
  return createHDRColor(
    baseColor.r * intensity,
    baseColor.g * intensity,
    baseColor.b * intensity,
    1.0
  );
}

/**
 * Boost color saturation in HDR space
 */
export function boostSaturationHDR(hdr: HDRColor, amount: number): HDRColor {
  const l = hdr.luminance;
  
  // Preserve luminance while boosting chroma
  const r = l + (hdr.r - l) * amount;
  const g = l + (hdr.g - l) * amount;
  const b = l + (hdr.b - l) * amount;
  
  return createHDRColor(r, g, b, hdr.a);
}

/**
 * HDR bloom threshold
 * Extracts bright areas for bloom effect
 */
export function extractBloomHDR(hdr: HDRColor, threshold: number = 1.0): HDRColor {
  const excess = Math.max(0, hdr.luminance - threshold);
  
  if (excess === 0) {
    return createHDRColor(0, 0, 0, 0);
  }
  
  const scale = excess / hdr.luminance;
  return createHDRColor(
    hdr.r * scale,
    hdr.g * scale,
    hdr.b * scale,
    hdr.a
  );
}

/**
 * Convert standard THREE.Color to HDR with boost
 */
export function colorToHDR(color: THREE.Color, boost: number = 1.0): HDRColor {
  return createHDRColor(
    color.r * boost,
    color.g * boost,
    color.b * boost,
    1.0
  );
}

/**
 * Interpolate between two HDR colors
 */
export function lerpHDR(a: HDRColor, b: HDRColor, t: number): HDRColor {
  return createHDRColor(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
    a.a + (b.a - a.a) * t
  );
}

/**
 * HDR color presets for common effects
 */
export const HDR_PRESETS = {
  // Neon colors (HDR boost for glow)
  neonPink: createHDRColor(2.0, 0.2, 1.5),
  neonBlue: createHDRColor(0.2, 1.0, 3.0),
  neonGreen: createHDRColor(0.3, 2.5, 0.3),
  neonOrange: createHDRColor(2.5, 1.0, 0.2),
  
  // Quantum glow
  quantumViolet: createHDRColor(1.5, 0.5, 2.5),
  quantumCyan: createHDRColor(0.5, 2.0, 2.5),
  
  // Hot surfaces
  lavaGlow: createHDRColor(3.0, 0.8, 0.2),
  sunGlow: createHDRColor(2.5, 2.0, 1.5),
  
  // Cool surfaces
  iceGlow: createHDRColor(0.7, 1.5, 2.5),
  moonGlow: createHDRColor(1.8, 1.8, 2.0)
};
