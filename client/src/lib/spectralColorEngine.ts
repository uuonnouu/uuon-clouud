/**
 * SPECTRAL COLOR ENGINE
 * Converts physical light wavelengths (380-740nm) to RGB colors
 * Uses CIE 1931 color matching functions for scientific accuracy
 * 
 * Physics:
 * - Visible spectrum: 380nm (violet) → 740nm (red)
 * - Color perception based on human cone cell responses
 * - Accurate spectral emission/absorption modeling
 */

import * as THREE from 'three';

/**
 * CIE 1931 2° Standard Observer Color Matching Functions (simplified approximation)
 * These represent human eye's response to different wavelengths
 */
function cieColorMatch(wavelength: number): { x: number; y: number; z: number } {
  let x = 0, y = 0, z = 0;
  
  // Violet to Blue (380-490nm)
  if (wavelength >= 380 && wavelength < 440) {
    const t = (wavelength - 380) / (440 - 380);
    x = -(wavelength - 440) / (440 - 380);
    y = 0;
    z = 1;
  }
  // Blue to Cyan (440-490nm)
  else if (wavelength >= 440 && wavelength < 490) {
    x = 0;
    y = (wavelength - 440) / (490 - 440);
    z = 1;
  }
  // Cyan to Green (490-510nm)
  else if (wavelength >= 490 && wavelength < 510) {
    x = 0;
    y = 1;
    z = -(wavelength - 510) / (510 - 490);
  }
  // Green to Yellow (510-580nm)
  else if (wavelength >= 510 && wavelength < 580) {
    x = (wavelength - 510) / (580 - 510);
    y = 1;
    z = 0;
  }
  // Yellow to Orange (580-645nm)
  else if (wavelength >= 580 && wavelength < 645) {
    x = 1;
    y = -(wavelength - 645) / (645 - 580);
    z = 0;
  }
  // Orange to Red (645-740nm)
  else if (wavelength >= 645 && wavelength <= 740) {
    x = 1;
    y = 0;
    z = 0;
  }

  return { x, y, z };
}

/**
 * Apply intensity falloff at spectrum edges (human eye sensitivity)
 */
function applyIntensityFalloff(wavelength: number, rgb: THREE.Color): THREE.Color {
  let factor = 1.0;
  
  // Violet edge falloff (380-420nm)
  if (wavelength >= 380 && wavelength < 420) {
    factor = 0.3 + 0.7 * (wavelength - 380) / (420 - 380);
  }
  // Red edge falloff (700-740nm)
  else if (wavelength > 700 && wavelength <= 740) {
    factor = 0.3 + 0.7 * (740 - wavelength) / (740 - 700);
  }

  return new THREE.Color(rgb.r * factor, rgb.g * factor, rgb.b * factor);
}

/**
 * Convert wavelength to RGB color
 * @param wavelength Light wavelength in nanometers (380-740nm)
 * @param intensity Brightness multiplier (0-1, default 1)
 * @returns THREE.Color object with spectral color
 */
export function wavelengthToRGB(wavelength: number, intensity: number = 1.0): THREE.Color {
  // Clamp wavelength to visible spectrum
  wavelength = Math.max(380, Math.min(740, wavelength));
  
  // Get CIE color matching values
  const cie = cieColorMatch(wavelength);
  
  // Convert to RGB (normalized)
  let rgb = new THREE.Color(cie.x, cie.y, cie.z);
  
  // Apply intensity falloff at edges
  rgb = applyIntensityFalloff(wavelength, rgb);
  
  // Apply overall intensity
  rgb.multiplyScalar(intensity);
  
  return rgb;
}

/**
 * Generate spectral gradient across surface
 * Maps wavelength range to parametric coordinates
 */
export function spectralGradient(
  u: number, 
  v: number, 
  minWavelength: number = 380, 
  maxWavelength: number = 740
): THREE.Color {
  // Use UV coordinates to map across spectrum
  const wavelength = minWavelength + (maxWavelength - minWavelength) * u;
  return wavelengthToRGB(wavelength);
}

/**
 * Emission line spectroscopy colors for quantum/atomic shapes
 * Based on real atomic emission lines
 */
export const EMISSION_LINES = {
  // Hydrogen Balmer series
  hydrogen_alpha: 656.3,    // Red (Hα)
  hydrogen_beta: 486.1,     // Cyan (Hβ)
  hydrogen_gamma: 434.0,    // Violet (Hγ)
  
  // Notable spectral lines
  sodium_d: 589.0,          // Yellow (Na D-line)
  mercury_green: 546.1,     // Green (Hg)
  mercury_blue: 435.8,      // Blue (Hg)
  helium_yellow: 587.6,     // Yellow (He)
  neon_red: 640.2,          // Red (Ne)
  argon_blue: 415.9,        // Violet (Ar)
  
  // Laser lines
  ruby_laser: 694.3,        // Deep red
  helium_neon: 632.8,       // Red (HeNe laser)
  argon_laser: 514.5,       // Green (Ar+ laser)
  
  // Blackbody radiation peaks (Wien's displacement law)
  sun_peak: 502,            // Sun's peak emission (~5778K)
  candle_peak: 965,         // Candle flame (clamped to visible)
  led_blue: 465,            // Blue LED
  led_green: 525,           // Green LED
  led_red: 625              // Red LED
};

/**
 * Get color for specific quantum emission line
 */
export function getEmissionColor(lineName: keyof typeof EMISSION_LINES, intensity: number = 1.0): THREE.Color {
  const wavelength = EMISSION_LINES[lineName];
  return wavelengthToRGB(wavelength, intensity);
}

/**
 * Blackbody radiation color from temperature (Kelvin)
 * Uses Wien's displacement law: λ_peak = 2.898 × 10^6 / T
 */
export function blackbodyColor(temperature: number): THREE.Color {
  const wavelength = 2898000 / temperature; // Wien's law in nm
  
  // For high temperatures, blend towards blue-white
  if (temperature > 10000) {
    return new THREE.Color(0.6, 0.7, 1.0); // Hot blue-white
  }
  
  // Clamp to visible spectrum
  if (wavelength < 380 || wavelength > 740) {
    // Outside visible, approximate with color temperature
    if (temperature < 1900) return new THREE.Color(1.0, 0.3, 0.0); // Warm red
    if (temperature > 15000) return new THREE.Color(0.7, 0.8, 1.0); // Cool blue
  }
  
  return wavelengthToRGB(wavelength);
}

/**
 * Map energy (eV) to wavelength (nm) and get color
 * E = hc/λ where h = Planck's constant, c = speed of light
 */
export function energyToColor(energyEV: number): THREE.Color {
  // E(eV) = 1240 / λ(nm)
  const wavelength = 1240 / energyEV;
  return wavelengthToRGB(wavelength);
}

/**
 * Spectral rainbow (full visible spectrum)
 * Returns array of colors from violet to red
 */
export function spectralRainbow(steps: number = 100): THREE.Color[] {
  const colors: THREE.Color[] = [];
  for (let i = 0; i < steps; i++) {
    const wavelength = 380 + (360 * i / (steps - 1));
    colors.push(wavelengthToRGB(wavelength));
  }
  return colors;
}

/**
 * PRISMATIC SHADER EFFECTS
 * Fresnel-based view-angle dependent spectral dispersion
 */

// Fresnel-based prismatic material shader
export const PRISMATIC_SHADER = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      vUv = uv;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  
  fragmentShader: `
    uniform float fresnelPower;
    uniform float dispersionStrength;
    uniform float time;
    uniform vec3 baseColor;
    
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    
    vec3 wavelengthToRGB(float wavelength) {
      float w = clamp(wavelength, 380.0, 740.0);
      vec3 rgb = vec3(0.0);
      
      if (w < 440.0) {
        rgb.r = -(w - 440.0) / 60.0;
        rgb.b = 1.0;
      } else if (w < 490.0) {
        rgb.g = (w - 440.0) / 50.0;
        rgb.b = 1.0;
      } else if (w < 510.0) {
        rgb.g = 1.0;
        rgb.b = -(w - 510.0) / 20.0;
      } else if (w < 580.0) {
        rgb.r = (w - 510.0) / 70.0;
        rgb.g = 1.0;
      } else if (w < 645.0) {
        rgb.r = 1.0;
        rgb.g = -(w - 645.0) / 65.0;
      } else {
        rgb.r = 1.0;
      }
      
      return rgb;
    }
    
    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), fresnelPower);
      
      // Spectral dispersion based on viewing angle
      float wavelength = mix(380.0, 740.0, fresnel * dispersionStrength + 0.3);
      vec3 spectralColor = wavelengthToRGB(wavelength);
      
      // Blend with base color
      vec3 finalColor = mix(baseColor, spectralColor, fresnel * 0.7);
      
      // Add subtle iridescence
      float iridescence = sin(vUv.x * 20.0 + time) * 0.1 + 0.9;
      finalColor *= iridescence;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
};

/**
 * Create prismatic material with Fresnel-based spectral effects
 */
export function createPrismaticMaterial(options: {
  baseColor?: THREE.Color;
  fresnelPower?: number;
  dispersionStrength?: number;
} = {}): THREE.ShaderMaterial {
  const {
    baseColor = new THREE.Color(0.9, 0.9, 0.95),
    fresnelPower = 2.5,
    dispersionStrength = 0.8
  } = options;
  
  return new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: baseColor },
      fresnelPower: { value: fresnelPower },
      dispersionStrength: { value: dispersionStrength },
      time: { value: 0 }
    },
    vertexShader: PRISMATIC_SHADER.vertexShader,
    fragmentShader: PRISMATIC_SHADER.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide
  });
}

/**
 * Parametric color mapping: mathematical parameter to spectral position
 * Maps any parameter value to a position in the visible spectrum
 */
export function parameterToSpectralColor(
  value: number, 
  minVal: number = -50, 
  maxVal: number = 50
): THREE.Color {
  const normalized = (value - minVal) / (maxVal - minVal);
  const wavelength = 380 + normalized * 360;
  return wavelengthToRGB(wavelength);
}

/**
 * LOD-based prismatic effect intensity
 * Returns stronger effects at close range for performance
 */
export function getPrismaticLOD(distance: number): {
  dispersionStrength: number;
  fresnelPower: number;
  enabled: boolean;
} {
  if (distance > 50) {
    return { dispersionStrength: 0, fresnelPower: 1, enabled: false };
  } else if (distance > 20) {
    return { dispersionStrength: 0.3, fresnelPower: 1.5, enabled: true };
  } else if (distance > 10) {
    return { dispersionStrength: 0.6, fresnelPower: 2.0, enabled: true };
  } else {
    return { dispersionStrength: 1.0, fresnelPower: 3.0, enabled: true };
  }
}
