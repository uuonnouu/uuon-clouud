
/**
 * INTELLIGENT COLOR RECOGNITION SYSTEM
 * Converts color names/codes to mathematically meaningful visualizations
 * © 2025 UUON Foundation Inc.
 */

export interface ColorMathMapping {
  colorName: string;
  hexCode?: string;
  wavelength?: number;
  mathematicalMeaning: string;
  shapeRecommendation: string;
  physicalPhenomena: string[];
  parameters: Record<string, number>;
}

// SCIENTIFIC COLOR-TO-MATH MAPPINGS
export const INTELLIGENT_COLOR_MAPPINGS: Record<string, ColorMathMapping> = {
  // PLASMA COLORS - Electric field physics
  "plasma": {
    colorName: "plasma",
    hexCode: "#8A2BE2",
    wavelength: 400, // Violet-blue range
    mathematicalMeaning: "Electromagnetic field ionization",
    shapeRecommendation: "electromagnetic_field",
    physicalPhenomena: ["ion_acceleration", "magnetic_confinement", "fusion_plasma"],
    parameters: { a: 2.5, b: 1.8, c: 0.4, temperature: 10000 }
  },

  // QUANTUM FIELD COLORS - Wave function visualization  
  "quantum": {
    colorName: "quantum",
    hexCode: "#00FFFF",
    mathematicalMeaning: "Quantum field fluctuations",
    shapeRecommendation: "quantum_field_oscillation", 
    physicalPhenomena: ["superposition", "entanglement", "wave_function_collapse"],
    parameters: { a: 1.5, b: 1.0, c: 0.8, uncertainty: 0.15 }
  },

  // THERMAL RADIATION - Blackbody physics
  "thermal": {
    colorName: "thermal",
    hexCode: "#FF4500",
    wavelength: 600,
    mathematicalMeaning: "Stefan-Boltzmann radiation",
    shapeRecommendation: "blackbody_surface",
    physicalPhenomena: ["thermal_emission", "planck_distribution"],
    parameters: { a: 3.0, b: 2.0, temperature: 6000 }
  },

  // ELECTROMAGNETIC SPECTRUM
  "ultraviolet": {
    colorName: "ultraviolet", 
    wavelength: 300,
    mathematicalMeaning: "High-energy photon interactions",
    shapeRecommendation: "photon_scattering_surface",
    physicalPhenomena: ["photoionization", "fluorescence"],
    parameters: { a: 1.2, energy: 4.1, frequency: 1e15 }
  },

  "infrared": {
    colorName: "infrared",
    wavelength: 1000,
    mathematicalMeaning: "Molecular vibration resonance", 
    shapeRecommendation: "molecular_vibration_field",
    physicalPhenomena: ["thermal_vibration", "rotational_states"],
    parameters: { a: 2.0, vibration_freq: 2000 }
  }
};

// COLOR NAME PARSER - Handles user input
export function parseColorInput(input: string): ColorMathMapping | null {
  const normalized = input.toLowerCase().trim();
  
  // Direct mapping
  if (INTELLIGENT_COLOR_MAPPINGS[normalized]) {
    return INTELLIGENT_COLOR_MAPPINGS[normalized];
  }
  
  // Fuzzy matching for common mistakes
  const fuzzyMappings: Record<string, string> = {
    "electric": "plasma",
    "fire": "thermal", 
    "heat": "thermal",
    "light": "photon",
    "wave": "quantum",
    "field": "quantum"
  };
  
  for (const [fuzzy, correct] of Object.entries(fuzzyMappings)) {
    if (normalized.includes(fuzzy)) {
      return INTELLIGENT_COLOR_MAPPINGS[correct];
    }
  }
  
  return null;
}

// HEX CODE TO WAVELENGTH CONVERTER
export function hexToWavelength(hexCode: string): number {
  // Remove # if present
  const hex = hexCode.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16); 
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Approximate wavelength mapping (simplified)
  if (r > g && r > b) return 650; // Red
  if (g > r && g > b) return 550; // Green  
  if (b > r && b > g) return 450; // Blue
  if (r > 200 && g > 200) return 580; // Yellow
  if (r > 200 && b > 200) return 500; // Magenta
  if (g > 200 && b > 200) return 480; // Cyan
  
  return 500; // Default green
}

// INTELLIGENT COLOR RECOMMENDATION ENGINE
export function recommendShapeFromColor(colorInput: string): {
  shapeType: string;
  parameters: Record<string, number>;
  explanation: string;
} | null {
  const mapping = parseColorInput(colorInput);
  
  if (!mapping) {
    return null;
  }
  
  return {
    shapeType: mapping.shapeRecommendation,
    parameters: mapping.parameters,
    explanation: `${colorInput} → ${mapping.mathematicalMeaning}: ${mapping.physicalPhenomena.join(', ')}`
  };
}

console.log(`🎨 Loaded intelligent color recognition with ${Object.keys(INTELLIGENT_COLOR_MAPPINGS).length} scientific mappings 🧬🔬`);
