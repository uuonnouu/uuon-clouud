/**
 * PHI HARMONIC MODULATOR
 * Golden ratio (φ = 1.618033988749...) based color harmonies
 * Creates mathematically perfect color relationships
 * 
 * Theory:
 * - Phi divides color wheel into aesthetically pleasing intervals
 * - Each step rotates hue by 137.5° (golden angle = 360° / φ²)
 * - Creates natural, organic color progressions
 */

import * as THREE from 'three';

export const PHI = 1.618033988749895;
export const GOLDEN_ANGLE = 137.507764; // 360° / φ² (in degrees)
export const GOLDEN_ANGLE_RAD = GOLDEN_ANGLE * (Math.PI / 180);

/**
 * Generate phi-harmonic color from base hue
 * @param baseHue Starting hue (0-360)
 * @param step Number of golden angle steps
 * @param saturation Saturation (0-1)
 * @param lightness Lightness (0-1)
 */
export function phiHarmonicColor(
  baseHue: number,
  step: number = 0,
  saturation: number = 1.0,
  lightness: number = 0.5
): THREE.Color {
  // Rotate hue by golden angle steps
  const hue = (baseHue + (GOLDEN_ANGLE * step)) % 360;
  
  // Convert HSL to RGB
  return hslToRGB(hue / 360, saturation, lightness);
}

/**
 * Generate phi-harmonic palette
 * @param baseHue Starting hue
 * @param count Number of colors
 */
export function phiPalette(
  baseHue: number,
  count: number = 5,
  saturation: number = 1.0,
  lightness: number = 0.5
): THREE.Color[] {
  const colors: THREE.Color[] = [];
  for (let i = 0; i < count; i++) {
    colors.push(phiHarmonicColor(baseHue, i, saturation, lightness));
  }
  return colors;
}

/**
 * Fibonacci color sequence (uses phi ratio for spacing)
 * Perfect for organic, natural color progressions
 */
export function fibonacciColorSequence(baseHue: number, length: number): THREE.Color[] {
  const colors: THREE.Color[] = [];
  let fib1 = 1, fib2 = 1;
  
  for (let i = 0; i < length; i++) {
    // Use Fibonacci ratio for hue progression
    const hueShift = (360 * fib1 / fib2) % 360;
    const hue = (baseHue + hueShift) % 360;
    
    // Vary lightness with phi
    const lightness = 0.3 + 0.4 * Math.sin(i / PHI);
    
    colors.push(hslToRGB(hue / 360, 1.0, lightness));
    
    // Next Fibonacci number
    const next = fib1 + fib2;
    fib1 = fib2;
    fib2 = next;
  }
  
  return colors;
}

/**
 * Triadic harmony with phi modulation
 * Uses golden ratio to fine-tune classical triadic spacing
 */
export function phiTriadic(baseHue: number): THREE.Color[] {
  return [
    phiHarmonicColor(baseHue, 0),
    phiHarmonicColor(baseHue + 120, 0),
    phiHarmonicColor(baseHue + 240, 0)
  ];
}

/**
 * Complementary harmony with phi offset
 */
export function phiComplementary(baseHue: number): THREE.Color[] {
  return [
    phiHarmonicColor(baseHue, 0),
    phiHarmonicColor(baseHue + 180, 0)
  ];
}

/**
 * Analogous harmony using golden angle
 */
export function phiAnalogous(baseHue: number, count: number = 3): THREE.Color[] {
  const colors: THREE.Color[] = [];
  const angleStep = 30; // Analogous typically within 30°
  
  for (let i = 0; i < count; i++) {
    const offset = angleStep * (i - Math.floor(count / 2));
    colors.push(phiHarmonicColor(baseHue + offset, i));
  }
  
  return colors;
}

/**
 * Sacred geometry color mapping
 * Maps shape parameters to phi-harmonic colors
 */
export function sacredGeometryColor(
  shapeType: string,
  u: number,
  v: number,
  baseHue: number = 0
): THREE.Color {
  // Use UV coordinates with phi for harmonic distribution
  const phiU = (u * PHI) % 1;
  const phiV = (v / PHI) % 1;
  
  // Combine for hue shift
  const hueShift = (phiU + phiV) * GOLDEN_ANGLE;
  const hue = (baseHue + hueShift) % 360;
  
  // Phi-based saturation and lightness
  const saturation = 0.7 + 0.3 * Math.sin(phiU * Math.PI);
  const lightness = 0.4 + 0.2 * Math.cos(phiV * Math.PI);
  
  return hslToRGB(hue / 360, saturation, lightness);
}

/**
 * HSL to RGB conversion
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
 * RGB to HSL conversion
 */
export function rgbToHSL(color: THREE.Color): { h: number; s: number; l: number } {
  const r = color.r;
  const g = color.g;
  const b = color.b;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) {
    return { h: 0, s: 0, l };
  }
  
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
  let h = 0;
  if (max === r) {
    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  } else if (max === g) {
    h = ((b - r) / d + 2) / 6;
  } else {
    h = ((r - g) / d + 4) / 6;
  }
  
  return { h: h * 360, s, l };
}

/**
 * Apply phi modulation to existing color
 */
export function modulateWithPhi(color: THREE.Color, intensity: number = 1.0): THREE.Color {
  const hsl = rgbToHSL(color);
  
  // Shift hue by golden angle, scaled by intensity
  const newHue = (hsl.h + GOLDEN_ANGLE * intensity) % 360;
  
  // Boost saturation with phi ratio
  const newSat = Math.min(1, hsl.s * PHI * 0.6);
  
  return hslToRGB(newHue / 360, newSat, hsl.l);
}
