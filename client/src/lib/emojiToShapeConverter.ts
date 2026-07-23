/**
 * EMOJI TO 3D SHAPE CONVERTER
 * Converts emojis, stickers, and GIFs to mathematical visualizations
 * © 2025 UUON Foundation Inc.
 */

import Graphemer from 'graphemer';
import { SurfaceParameters } from '../types/math';

// Handle CommonJS/ESM compatibility
const GraphemerClass = (Graphemer as any).default || Graphemer;
const graphemer = new GraphemerClass();

interface EmojiConversion {
  emoji: string;
  shapeType: string;
  parameters: Partial<SurfaceParameters>;
  description: string;
  animationHint?: string;
}

// Top 20 Most Used Emojis with Mathematical Conversions
// FIXED: Maps to ACTUAL shapes that exist in the registry
export const EMOJI_TO_SHAPE_MAPPINGS: Record<string, EmojiConversion> = {
  // TOP 5 GLOBALLY
  "😂": {
    emoji: "😂",
    shapeType: "brain_wave", // Oscillating joy = brain waves
    parameters: { a: 2, b: 1.5, c: 0.8, d: 8, e: 12 },
    description: "Tears of joy as oscillating wave patterns",
    animationHint: "rapid_oscillation"
  },
  "❤️": {
    emoji: "❤️", 
    shapeType: "diamond_heart", // Actual heart shape exists
    parameters: { a: 1.6, b: 1.3, c: 1.0, g: 0.618 },
    description: "Mathematical heart curve with golden ratio",
    animationHint: "heartbeat_pulse"
  },
  "🥺": {
    emoji: "🥺",
    shapeType: "ocean_wave", // Gentle waves
    parameters: { a: 1.2, b: 0.8, c: 0.6, j: 0.9 },
    description: "Soft pleading waves - gentle emotional field",
    animationHint: "gentle_waves"
  },
  "😍": {
    emoji: "😍",
    shapeType: "cardiac_wave", // Heart-shaped energy = cardiac wave
    parameters: { a: 2.0, b: 1.5, c: 1.2, g: 0.618, h: 2 },
    description: "Heart-eyes love field with romantic resonance",
    animationHint: "pulsing_hearts"
  },
  "🤣": {
    emoji: "🤣",
    shapeType: "circadian_wave", // Chaotic oscillating pattern
    parameters: { a: 3.0, b: 2.0, c: 1.0, d: 12, e: 8 },
    description: "Rolling on floor laughing - chaotic joy patterns",
    animationHint: "chaotic_rolling"
  },

  // TOP REACTION EMOJIS  
  "👍": {
    emoji: "👍",
    shapeType: "helicoid", // Ascending spiral
    parameters: { a: 2, b: 1, c: 3, d: 1 },
    description: "Thumbs up - positive energy spiral ascending",
    animationHint: "upward_spiral"
  },
  "👏": {
    emoji: "👏", 
    shapeType: "sound_wave", // Rhythmic clapping waves
    parameters: { a: 1.5, b: 1.5, c: 0.5, k: 4, l: 2 },
    description: "Applause rhythm waves - synchronized clapping",
    animationHint: "rhythmic_claps"
  },
  "🙏": {
    emoji: "🙏",
    shapeType: "operations_convergence", // Converging geometry
    parameters: { a: 1.8, b: 1.2, c: 2.0, g: 0.618 },
    description: "Prayer hands - converging sacred geometry",
    animationHint: "convergent_flow"
  },

  // NATURE & ELEMENTS
  "🔥": {
    emoji: "🔥",
    shapeType: "navier_stokes_turbulence", // Chaotic flame dynamics
    parameters: { a: 2.5, b: 1.8, c: 0.3, d: 15, j: 0.8 },
    description: "Fire flame - chaotic thermal dynamics",
    animationHint: "flickering_flame"
  },
  "🌊": {
    emoji: "🌊",
    shapeType: "ocean_wave", // EXACT match to existing shape
    parameters: { a: 3.0, b: 1.5, c: 0.8, d: 6, e: 4 },
    description: "Ocean waves - fluid dynamics simulation",
    animationHint: "flowing_waves"
  },
  "⭐": {
    emoji: "⭐",
    shapeType: "fibonacci_spiral", // Star = golden spiral
    parameters: { a: 2.0, b: 0.4, c: 1.0, h: 5 },
    description: "Star shape - 5-pointed stellar geometry",
    animationHint: "twinkling_star"
  },
  "🌈": {
    emoji: "🌈",
    shapeType: "torus", // Rainbow arc = toroidal shape
    parameters: { a: 4.0, b: 2.0, c: 0.8, d: 7 },
    description: "Rainbow arc - spectrum wavelength visualization", 
    animationHint: "color_cycling"
  },
  "✨": {
    emoji: "✨",
    shapeType: "fractal_time_spiral", // Sparkles = fractal particles
    parameters: { a: 1.5, b: 1.5, c: 1.5, d: 20 },
    description: "Sparkles - magical particle field",
    animationHint: "twinkling_particles"
  },

  // OBJECTS & SYMBOLS
  "🚀": {
    emoji: "🚀",
    shapeType: "cone", // Rocket = cone shape
    parameters: { a: 3.0, b: 0.5, c: 8.0, d: 2 },
    description: "Rocket launch - parabolic trajectory with thrust",
    animationHint: "launch_trajectory"
  },
  "💎": {
    emoji: "💎", 
    shapeType: "diamond_round_brilliant",
    parameters: { a: 1.5, b: 1.5, c: 1.0, h: 58 },
    description: "Diamond - brilliant cut with 58 facets",
    animationHint: "sparkling_facets"
  },
  "🎵": {
    emoji: "🎵",
    shapeType: "sound_wave", // Musical waves = sound waves
    parameters: { a: 2.0, b: 1.0, c: 0.5, d: 440 },
    description: "Musical note - sound wave at 440Hz (A4)",
    animationHint: "sound_oscillation"
  }
};

// STICKER SUPPORT SYSTEM
export class StickerToShapeConverter {
  static convertStickerToMesh(stickerData: string | File, options?: {
    extrusionDepth?: number;
    curveIntensity?: number;
    animationSpeed?: number;
  }) {
    const defaultOptions = {
      extrusionDepth: 0.1,
      curveIntensity: 0.2,
      animationSpeed: 1.0,
      ...options
    };

    return {
      shapeType: 'extruded_sticker',
      parameters: {
        a: 2.0,
        b: 2.0, 
        c: defaultOptions.extrusionDepth,
        d: defaultOptions.curveIntensity,
        animationSpeed: defaultOptions.animationSpeed,
        textureData: stickerData
      },
      description: 'Sticker converted to extruded 3D mesh',
      animationHint: 'texture_morph'
    };
  }
}

// GIF SUPPORT SYSTEM  
export class GifToShapeConverter {
  static convertGifToAnimatedMesh(gifData: string | File, options?: {
    morphIntensity?: number;
    frameRate?: number;
    depthVariation?: number;
  }) {
    const defaultOptions = {
      morphIntensity: 0.5,
      frameRate: 30,
      depthVariation: 0.3,
      ...options
    };

    return {
      shapeType: 'animated_gif_surface',
      parameters: {
        a: 2.5,
        b: 2.5,
        c: defaultOptions.depthVariation,
        d: defaultOptions.morphIntensity,
        frameRate: defaultOptions.frameRate,
        gifData: gifData
      },
      description: 'Animated GIF converted to morphing 3D surface',
      animationHint: 'frame_morphing'
    };
  }
}

// UTILITY FUNCTIONS
export function getEmojiShape(emoji: string): EmojiConversion | null {
  return EMOJI_TO_SHAPE_MAPPINGS[emoji] || null;
}

export function getSupportedEmojis(): string[] {
  return Object.keys(EMOJI_TO_SHAPE_MAPPINGS);
}

// Enhanced Unicode-aware parsing using Graphemer library
export function parseEmojiInput(input: string): string[] {
  // Use Graphemer for proper Unicode grapheme cluster splitting
  const graphemes = graphemer.splitGraphemes(input).filter((grapheme: string) => grapheme.trim());
  
  // Advanced sequence detection (inspired by June 2024 vision)
  return graphemes.map((grapheme: string) => {
    // Detect complex family sequences
    if (isComplexFamilySequence(grapheme)) {
      return processFamilyEmoji(grapheme);
    }
    
    // Detect skin tone modifiers
    if (hasSkinToneModifier(grapheme)) {
      return processSkinToneEmoji(grapheme);
    }
    
    // Detect flag sequences
    if (isFlagSequence(grapheme)) {
      return processFlagEmoji(grapheme);
    }
    
    return grapheme;
  });
}

// Advanced sequence processors (June vision realized)
function isComplexFamilySequence(grapheme: string): boolean {
  return grapheme.includes('👨‍👩‍👧‍👦') || grapheme.includes('👨‍👨‍👧') || grapheme.includes('👩‍👩‍👧‍👦');
}

function hasSkinToneModifier(grapheme: string): boolean {
  return grapheme.includes('🏻') || grapheme.includes('🏼') || grapheme.includes('🏽') || 
         grapheme.includes('🏾') || grapheme.includes('🏿');
}

function isFlagSequence(grapheme: string): boolean {
  // Detect regional indicator symbols (flags)
  return grapheme.charCodeAt(0) >= 0x1F1E6 && grapheme.charCodeAt(0) <= 0x1F1FF;
}

function processFamilyEmoji(grapheme: string): string {
  // Convert family emojis to mathematical relationship structures
  if (grapheme.includes('👨‍👩‍👧‍👦')) return 'family_four_network';
  if (grapheme.includes('👨‍👨‍👧')) return 'family_three_network';
  if (grapheme.includes('👩‍👩‍👧‍👦')) return 'family_four_alt_network';
  return grapheme;
}

function processSkinToneEmoji(grapheme: string): string {
  // Map skin tones to color wavelength mathematics
  let baseEmoji = grapheme;
  let toneCode = '';
  
  if (grapheme.includes('🏻')) {
    baseEmoji = grapheme.replace('🏻', '');
    toneCode = '🏻';
  } else if (grapheme.includes('🏼')) {
    baseEmoji = grapheme.replace('🏼', '');
    toneCode = '🏼';
  } else if (grapheme.includes('🏽')) {
    baseEmoji = grapheme.replace('🏽', '');
    toneCode = '🏽';
  } else if (grapheme.includes('🏾')) {
    baseEmoji = grapheme.replace('🏾', '');
    toneCode = '🏾';
  } else if (grapheme.includes('🏿')) {
    baseEmoji = grapheme.replace('🏿', '');
    toneCode = '🏿';
  }
  
  switch(toneCode) {
    case '🏻': return `${baseEmoji}_wavelength_380`; // Light skin = UV wavelength
    case '🏼': return `${baseEmoji}_wavelength_450`; // Medium-light = Blue
    case '🏽': return `${baseEmoji}_wavelength_550`; // Medium = Green  
    case '🏾': return `${baseEmoji}_wavelength_600`; // Medium-dark = Orange
    case '🏿': return `${baseEmoji}_wavelength_700`; // Dark = Red
    default: return baseEmoji;
  }
}

function processFlagEmoji(grapheme: string): string {
  // Convert flag emojis to geometric tessellations based on country codes
  const code1 = grapheme.codePointAt(0);
  const code2 = grapheme.codePointAt(2);
  if (code1 && code2) {
    const countryCode = code1.toString(16) + code2.toString(16);
    return `flag_tessellation_${countryCode}`;
  }
  return grapheme;
}


export function convertTextToShapes(text: string): EmojiConversion[] {
  const emojis = parseEmojiInput(text); // Use the grapheme-aware parser

  return emojis
    .map(emoji => getEmojiShape(emoji))
    .filter((shape): shape is EmojiConversion => shape !== null);
}

console.log(`✨ Loaded ${Object.keys(EMOJI_TO_SHAPE_MAPPINGS).length} emoji to shape conversions with sticker & GIF support 📱🎨💫`);