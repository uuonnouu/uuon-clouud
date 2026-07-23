/**
 * MATERIAL PRESET SYSTEM - EXPANDED
 * 6 Categories: Neon Glow (NEW PREMIUM), Topological, Metallic, Crystalline, Energy, Organic
 */

import * as THREE from 'three';
import {
  // NEON GLOW PATTERNS - Premium category (18 patterns)
  generateNeonPinkPattern,
  generateNeonBluePattern,
  generateNeonGreenPattern,
  generateNeonOrangePattern,
  generateNeonPurplePattern,
  generateNeonCyanPattern,
  generateNeonRedPattern,
  generateNeonYellowPattern,
  generateNeonRainbowPattern,
  generateNeonGridPattern,
  generateNeonPulsePattern,
  generateNeonPlasmaFusionPattern,
  // Creative Glow Patterns
  generateNeonHexagonGridPattern,
  generateNeonCircuitPattern,
  generateNeonScanlinesPattern,
  generateNeonSpiralPattern,
  generateNeonLaserGridPattern,
  generateNeonConstellationPattern,
  // World Map Glow - Hello UUorld
  generateWorldMapGlowPattern,
  // Topological patterns
  generateVoronoiPattern,
  generatePerlinNoisePattern,
  generateFractalPattern,
  generateHexagonalPattern,
  generateTruchetPattern,
  generateCellularPattern,
  generateMandelbrotPattern,
  generateFibonacciPattern,
  generatePenrosePattern,
  generateDelaunayPattern,
  // Metallic patterns
  generateGoldPattern,
  generateSilverPattern,
  generateCopperPattern,
  generateBronzePattern,
  generateTitaniumPattern,
  // Crystalline patterns
  generateDiamondPattern,
  generateOpalPattern,
  generateAlexandritePattern,
  generateEmeraldPattern,
  generateRubyPattern,
  generateSapphirePattern,
  generateAmethystPattern,
  // Energy patterns
  generatePlasmaPattern,
  generateLightningPattern,
  generateNeonPattern,
  generateAuroraPattern,
  // Organic patterns
  generateWoodPattern,
  generateMarblePattern,
  generateGranitePattern,
  generateLeatherPattern
} from './proceduralPatterns';

export interface MaterialPreset {
  id: string;
  name: string;
  icon: string;
  properties: {
    color: string;
    metalness: number;
    roughness: number;
    emissive?: string;
    emissiveIntensity?: number;
    transmission?: number;
    thickness?: number;
    clearcoat?: number;
    clearcoatRoughness?: number;
    ior?: number;
    reflectivity?: number;
    opacity?: number;
    transparent?: boolean;
  };
  description: string;
}

export const MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  // ============================================================================
  // NEON GLOW - Premium Category (12 patterns) - FIRST for easy access
  // Reduced emissive intensity for smooth, clean exports without washout
  // ============================================================================
  
  neon_pink: {
    id: 'neon_pink',
    name: 'Neon Pink',
    icon: '💗',
    properties: {
      color: '#ff1493',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff1493',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Hot pink neon tubes with white-hot core'
  },

  neon_blue: {
    id: 'neon_blue',
    name: 'Neon Blue',
    icon: '💙',
    properties: {
      color: '#00bfff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#00bfff',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Electric blue with cyan highlights'
  },

  neon_green: {
    id: 'neon_green',
    name: 'Neon Green',
    icon: '💚',
    properties: {
      color: '#39ff14',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#39ff14',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95
    },
    description: 'Matrix/toxic green glow'
  },

  neon_orange: {
    id: 'neon_orange',
    name: 'Neon Orange',
    icon: '🧡',
    properties: {
      color: '#ff6600',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff6600',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Sunset/fire orange glow'
  },

  neon_purple: {
    id: 'neon_purple',
    name: 'Neon Purple',
    icon: '💜',
    properties: {
      color: '#9400d3',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#9400d3',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'UV blacklight purple glow'
  },

  neon_cyan: {
    id: 'neon_cyan',
    name: 'Neon Cyan',
    icon: '🩵',
    properties: {
      color: '#00ffff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#00ffff',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95
    },
    description: 'Cyberpunk teal glow'
  },

  neon_red: {
    id: 'neon_red',
    name: 'Neon Red',
    icon: '❤️',
    properties: {
      color: '#ff0000',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff0000',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Danger/warning red glow'
  },

  neon_yellow: {
    id: 'neon_yellow',
    name: 'Neon Yellow',
    icon: '💛',
    properties: {
      color: '#ffff00',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ffff00',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95
    },
    description: 'Electric yellow/gold glow'
  },

  neon_rainbow: {
    id: 'neon_rainbow',
    name: 'Neon Rainbow',
    icon: '🌈',
    properties: {
      color: '#ff00ff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff00ff',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Multi-color shifting spectrum'
  },

  neon_grid: {
    id: 'neon_grid',
    name: 'Neon Grid',
    icon: '🔲',
    properties: {
      color: '#00ddff',
      metalness: 0.15,
      roughness: 0.15,
      emissive: '#00ddff',
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.9
    },
    description: 'Tron-style glowing grid'
  },

  neon_pulse: {
    id: 'neon_pulse',
    name: 'Neon Pulse',
    icon: '💫',
    properties: {
      color: '#cc44ff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#cc44ff',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Pulsating rings emanating outward'
  },

  neon_plasma_fusion: {
    id: 'neon_plasma_fusion',
    name: 'Plasma Fusion',
    icon: '⚡',
    properties: {
      color: '#ff44cc',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff44cc',
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.95
    },
    description: 'Plasma + neon hybrid with swirling energy'
  },

  // NEW CREATIVE GLOW PATTERNS - 6 Additional Neon Effects
  
  neon_hexagon_grid: {
    id: 'neon_hexagon_grid',
    name: 'Hexagon Grid',
    icon: '⬡',
    properties: {
      color: '#ff3399',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff3399',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95
    },
    description: 'Cyberpunk honeycomb with glowing edges'
  },

  neon_circuit: {
    id: 'neon_circuit',
    name: 'Circuit Board',
    icon: '🔌',
    properties: {
      color: '#00ff66',
      metalness: 0.15,
      roughness: 0.25,
      emissive: '#00ff66',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Tech/cyberpunk glowing circuit traces'
  },

  neon_scanlines: {
    id: 'neon_scanlines',
    name: 'Scanlines',
    icon: '📺',
    properties: {
      color: '#ffb033',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ffb033',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Retro CRT monitor scanlines'
  },

  neon_spiral: {
    id: 'neon_spiral',
    name: 'Spiral Vortex',
    icon: '🌀',
    properties: {
      color: '#9933ff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#9933ff',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.95
    },
    description: 'Hypnotic spinning energy spiral'
  },

  neon_laser_grid: {
    id: 'neon_laser_grid',
    name: 'Laser Grid',
    icon: '🎯',
    properties: {
      color: '#ff3333',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ff3333',
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.95
    },
    description: 'Intense crossing laser beams'
  },

  neon_constellation: {
    id: 'neon_constellation',
    name: 'Constellation',
    icon: '✨',
    properties: {
      color: '#ccddff',
      metalness: 0.1,
      roughness: 0.2,
      emissive: '#ccddff',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.95
    },
    description: 'Connected glowing star points'
  },

  world_map_glow: {
    id: 'world_map_glow',
    name: 'World Map Glow',
    icon: '🌍',
    properties: {
      color: '#ffffff',
      metalness: 0.05,
      roughness: 0.4,
      emissive: '#000000',
      emissiveIntensity: 0.0,
      transparent: false,
      opacity: 1.0
    },
    description: 'Hello UUorld - Glowing world map with landmasses'
  },

  // ============================================================================
  // TOPOLOGICAL PATTERNS
  // ============================================================================

  voronoi: {
    id: 'voronoi',
    name: 'Voronoi',
    icon: '🔷',
    properties: {
      color: '#2a5588',
      metalness: 0.15,
      roughness: 0.55,
      emissive: '#0a2244',
      emissiveIntensity: 0.3
    },
    description: 'Voronoi diagram cellular pattern'
  },

  perlin_noise: {
    id: 'perlin_noise',
    name: 'Perlin Noise',
    icon: '🌫️',
    properties: {
      color: '#4a6688',
      metalness: 0.1,
      roughness: 0.7,
      emissive: '#1a2a3a',
      emissiveIntensity: 0.2
    },
    description: 'Organic perlin noise texture'
  },

  fractal: {
    id: 'fractal',
    name: 'Fractal',
    icon: '❄️',
    properties: {
      color: '#007799',
      metalness: 0.25,
      roughness: 0.5,
      emissive: '#002a44',
      emissiveIntensity: 0.35
    },
    description: 'Recursive fractal geometry'
  },

  hexagonal: {
    id: 'hexagonal',
    name: 'Hexagonal',
    icon: '⬡',
    properties: {
      color: '#996600',
      metalness: 0.2,
      roughness: 0.55,
      emissive: '#3a2800',
      emissiveIntensity: 0.25
    },
    description: 'Hexagonal honeycomb pattern'
  },

  truchet: {
    id: 'truchet',
    name: 'Truchet Tiles',
    icon: '🎨',
    properties: {
      color: '#993355',
      metalness: 0.15,
      roughness: 0.6,
      emissive: '#2a0a15',
      emissiveIntensity: 0.25
    },
    description: 'Truchet tiling pattern'
  },

  cellular: {
    id: 'cellular',
    name: 'Cellular',
    icon: '🧬',
    properties: {
      color: '#338844',
      metalness: 0.1,
      roughness: 0.6,
      emissive: '#0a2a12',
      emissiveIntensity: 0.3
    },
    description: 'Biological cellular structure'
  },

  mandelbrot: {
    id: 'mandelbrot',
    name: 'Mandelbrot',
    icon: '🌀',
    properties: {
      color: '#662299',
      metalness: 0.3,
      roughness: 0.45,
      emissive: '#1a0a2a',
      emissiveIntensity: 0.4
    },
    description: 'Mandelbrot set fractal'
  },

  fibonacci: {
    id: 'fibonacci',
    name: 'Fibonacci',
    icon: '🌻',
    properties: {
      color: '#997722',
      metalness: 0.2,
      roughness: 0.55,
      emissive: '#2a1a00',
      emissiveIntensity: 0.3
    },
    description: 'Fibonacci spiral pattern'
  },

  penrose: {
    id: 'penrose',
    name: 'Penrose',
    icon: '⭐',
    properties: {
      color: '#992255',
      metalness: 0.25,
      roughness: 0.5,
      emissive: '#2a0a18',
      emissiveIntensity: 0.35
    },
    description: 'Penrose aperiodic tiling'
  },

  delaunay: {
    id: 'delaunay',
    name: 'Delaunay',
    icon: '🔺',
    properties: {
      color: '#228866',
      metalness: 0.15,
      roughness: 0.55,
      emissive: '#0a2a1a',
      emissiveIntensity: 0.25
    },
    description: 'Delaunay triangulation'
  },

  // ============================================================================
  // METALLIC MATERIALS
  // ============================================================================
  
  gold: {
    id: 'gold',
    name: 'Gold',
    icon: '🥇',
    properties: {
      color: '#D4AF37', // Rich 24K gold tone
      metalness: 0.95,
      roughness: 0.10, // Very polished
      emissive: '#2a1f00',
      emissiveIntensity: 0.06
    },
    description: 'Polished 24K gold with warm reflections'
  },

  silver: {
    id: 'silver',
    name: 'Silver',
    icon: '🥈',
    properties: {
      color: '#AFB4BE', // Cool gray with blue undertone (not pure white)
      metalness: 0.95,
      roughness: 0.08, // Very polished
      emissive: '#151820',
      emissiveIntensity: 0.04
    },
    description: 'Polished sterling silver'
  },

  copper: {
    id: 'copper',
    name: 'Copper',
    icon: '🟤',
    properties: {
      color: '#B87333', // Warm reddish-brown
      metalness: 0.92,
      roughness: 0.12,
      emissive: '#1a0800',
      emissiveIntensity: 0.05
    },
    description: 'Warm copper with subtle patina'
  },

  bronze: {
    id: 'bronze',
    name: 'Bronze',
    icon: '🥉',
    properties: {
      color: '#A67D3C', // Warm brown-gold
      metalness: 0.88,
      roughness: 0.15,
      emissive: '#120800',
      emissiveIntensity: 0.04
    },
    description: 'Aged bronze with rich patina'
  },

  titanium: {
    id: 'titanium',
    name: 'Titanium',
    icon: '⚙️',
    properties: {
      color: '#5A6570', // Darker gray-blue for realistic titanium
      metalness: 0.92,
      roughness: 0.12, // Lower roughness for polished titanium sheen
      emissive: '#1a2535',
      emissiveIntensity: 0.05
    },
    description: 'Iridescent anodized titanium'
  },

  // ============================================================================
  // RARE & EXOTIC METALLIC MATERIALS - Scientific/Nanotechnology Grade
  // ============================================================================

  californium: {
    id: 'californium',
    name: 'Californium-252',
    icon: '☢️',
    properties: {
      color: '#C0C0C0', // Silvery-white radioactive metal
      metalness: 0.98,
      roughness: 0.05,
      emissive: '#40E0D0', // Faint radioactive glow
      emissiveIntensity: 0.4,
      clearcoat: 0.9,
      clearcoatRoughness: 0.02
    },
    description: 'Ultra-rare radioactive metal ($27M/gram) - neutron emitter for cancer therapy'
  },

  iridescent_metal: {
    id: 'iridescent_metal',
    name: 'Iridescent Metal',
    icon: '🌈',
    properties: {
      color: '#E8E8E8',
      metalness: 0.95,
      roughness: 0.08,
      emissive: '#8844AA', // Subtle color-shifting glow
      emissiveIntensity: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 2.8 // High IOR for rainbow dispersion
    },
    description: 'Anodized metal with color-shifting interference patterns'
  },

  oil_on_water: {
    id: 'oil_on_water',
    name: 'Oil Film Effect',
    icon: '🫧',
    properties: {
      color: '#4488AA',
      metalness: 0.0,
      roughness: 0.0,
      emissive: '#224466',
      emissiveIntensity: 0.2,
      transmission: 0.7,
      thickness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      ior: 1.48, // Thin film interference
      transparent: true,
      opacity: 0.85
    },
    description: 'Thin-film interference like oil floating on water'
  },

  plutonium: {
    id: 'plutonium',
    name: 'Plutonium',
    icon: '⚛️',
    properties: {
      color: '#8B8B8B', // Gray with bluish tint
      metalness: 0.96,
      roughness: 0.15,
      emissive: '#6666FF', // Blue radioactive glow
      emissiveIntensity: 0.35,
      clearcoat: 0.7,
      clearcoatRoughness: 0.1
    },
    description: 'Actinide metal - nuclear fuel and power source'
  },

  osmium: {
    id: 'osmium',
    name: 'Osmium',
    icon: '💠',
    properties: {
      color: '#7B8B8C', // Blue-gray, densest natural element
      metalness: 0.97,
      roughness: 0.06,
      emissive: '#4466AA',
      emissiveIntensity: 0.08,
      clearcoat: 0.95,
      clearcoatRoughness: 0.01
    },
    description: 'Densest element (22.59g/cm³) - blue-gray precious metal'
  },

  iridium: {
    id: 'iridium',
    name: 'Iridium',
    icon: '⭐',
    properties: {
      color: '#D0D0E0', // Silvery-white, extremely hard
      metalness: 0.98,
      roughness: 0.04,
      emissive: '#AABBCC',
      emissiveIntensity: 0.06,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0
    },
    description: 'Most corrosion-resistant metal - meteorite signature element'
  },

  palladium: {
    id: 'palladium',
    name: 'Palladium',
    icon: '🔘',
    properties: {
      color: '#CED0CE', // Silvery-white with slight gray
      metalness: 0.94,
      roughness: 0.10,
      emissive: '#E8E8E8',
      emissiveIntensity: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.05
    },
    description: 'Catalyst metal - hydrogen storage and catalytic converters'
  },

  bismuth_crystal: {
    id: 'bismuth_crystal',
    name: 'Bismuth Crystal',
    icon: '🔷',
    properties: {
      color: '#B0B0B0',
      metalness: 0.85,
      roughness: 0.15,
      emissive: '#FF88AA', // Rainbow oxide layer glow
      emissiveIntensity: 0.25,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05,
      ior: 2.1
    },
    description: 'Hopper crystal with rainbow oxide iridescence'
  },

  liquid_mercury: {
    id: 'liquid_mercury',
    name: 'Liquid Mercury',
    icon: '🪩',
    properties: {
      color: '#E8E8E8',
      metalness: 1.0,
      roughness: 0.0, // Perfect mirror
      emissive: '#444444',
      emissiveIntensity: 0.05,
      clearcoat: 0.0,
      ior: 1.0
    },
    description: 'Room-temperature liquid metal - perfect mirror surface'
  },

  // ============================================================================
  // CRYSTALLINE MATERIALS - Gems & Precious Stones
  // ============================================================================

  diamond: {
    id: 'diamond',
    name: 'Diamond',
    icon: '💎',
    properties: {
      color: '#E8E8E8',
      metalness: 0.0,
      roughness: 0.0,
      transmission: 0.95,
      ior: 2.42,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0
    },
    description: 'Brilliant cut diamond with fire dispersion'
  },

  opal: {
    id: 'opal',
    name: 'Opal',
    icon: '🌈',
    properties: {
      color: '#F8F8FF',
      metalness: 0.0,
      roughness: 0.08,
      emissive: '#8888FF',
      emissiveIntensity: 0.3,
      transmission: 0.6,
      thickness: 0.8,
      ior: 1.45,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      transparent: true,
      opacity: 0.92
    },
    description: 'Australian opal with rainbow play-of-color'
  },

  alexandrite: {
    id: 'alexandrite',
    name: 'Alexandrite',
    icon: '💜',
    properties: {
      color: '#4B8B3B',
      metalness: 0.0,
      roughness: 0.1,
      emissive: '#2a1a3a',
      emissiveIntensity: 0.35,
      transmission: 0.6,
      ior: 1.746,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    },
    description: 'Color-changing alexandrite (green to red)'
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald',
    icon: '💚',
    properties: {
      color: '#50C878',
      metalness: 0.0,
      roughness: 0.15,
      emissive: '#0a2a12',
      emissiveIntensity: 0.3,
      transmission: 0.7,
      ior: 1.58,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    },
    description: 'Colombian emerald with jardin inclusions'
  },

  ruby: {
    id: 'ruby',
    name: 'Ruby',
    icon: '❤️',
    properties: {
      color: '#E0115F',
      metalness: 0.0,
      roughness: 0.1,
      emissive: '#3a0a15',
      emissiveIntensity: 0.35,
      transmission: 0.65,
      ior: 1.77,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    },
    description: 'Pigeon blood Burmese ruby'
  },

  sapphire: {
    id: 'sapphire',
    name: 'Sapphire',
    icon: '💙',
    properties: {
      color: '#0F52BA',
      metalness: 0.0,
      roughness: 0.1,
      emissive: '#0a0a2a',
      emissiveIntensity: 0.3,
      transmission: 0.7,
      ior: 1.77,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05
    },
    description: 'Kashmir blue sapphire'
  },

  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    icon: '🔮',
    properties: {
      color: '#9966CC',
      metalness: 0.0,
      roughness: 0.12,
      emissive: '#1a0a2a',
      emissiveIntensity: 0.3,
      transmission: 0.75,
      ior: 1.54,
      clearcoat: 0.9,
      clearcoatRoughness: 0.05
    },
    description: 'Deep purple amethyst crystal'
  },

  // ============================================================================
  // ENERGY MATERIALS
  // ============================================================================

  plasma: {
    id: 'plasma',
    name: 'Plasma',
    icon: '⚡',
    properties: {
      color: '#FF00FF',
      metalness: 0.0,
      roughness: 0.0,
      emissive: '#FF44FF',
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.75
    },
    description: 'Electric plasma energy field'
  },

  lightning: {
    id: 'lightning',
    name: 'Lightning',
    icon: '🌩️',
    properties: {
      color: '#FFFFFF',
      metalness: 0.0,
      roughness: 0.0,
      emissive: '#88FFFF',
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.85
    },
    description: 'Electric lightning discharge'
  },

  neon: {
    id: 'neon',
    name: 'Neon',
    icon: '🎆',
    properties: {
      color: '#FF00FF',
      metalness: 0.0,
      roughness: 0.0,
      emissive: '#FF44BB',
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.88
    },
    description: 'Hot pink neon glow'
  },

  aurora: {
    id: 'aurora',
    name: 'Aurora',
    icon: '🌌',
    properties: {
      color: '#00FF88',
      metalness: 0.0,
      roughness: 0.0,
      emissive: '#44FFAA',
      emissiveIntensity: 0.7,
      transparent: true,
      opacity: 0.7
    },
    description: 'Northern lights aurora borealis'
  },

  // ============================================================================
  // ORGANIC MATERIALS
  // ============================================================================

  wood: {
    id: 'wood',
    name: 'Wood',
    icon: '🪵',
    properties: {
      color: '#8B4513',
      metalness: 0.0,
      roughness: 0.6,
      emissive: '#1a0800',
      emissiveIntensity: 0.05
    },
    description: 'Polished hardwood grain'
  },

  marble: {
    id: 'marble',
    name: 'Marble',
    icon: '🗿',
    properties: {
      color: '#F5F5F5',
      metalness: 0.0,
      roughness: 0.15,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1
    },
    description: 'White Carrara marble with veining'
  },

  granite: {
    id: 'granite',
    name: 'Granite',
    icon: '🪨',
    properties: {
      color: '#696969',
      metalness: 0.0,
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.2
    },
    description: 'Polished granite stone'
  },

  leather: {
    id: 'leather',
    name: 'Leather',
    icon: '👜',
    properties: {
      color: '#8B4513',
      metalness: 0.0,
      roughness: 0.7,
      emissive: '#0a0400',
      emissiveIntensity: 0.02
    },
    description: 'Rich tanned leather'
  }
};

export const MATERIAL_CATEGORIES = {
  // NEON GLOW first for easy access - Premium category (19 patterns including World Map)
  neon_glow: [
    'neon_pink', 'neon_blue', 'neon_green', 'neon_orange', 'neon_purple', 'neon_cyan', 
    'neon_red', 'neon_yellow', 'neon_rainbow', 'neon_grid', 'neon_pulse', 'neon_plasma_fusion',
    // Creative Glow Patterns
    'neon_hexagon_grid', 'neon_circuit', 'neon_scanlines', 'neon_spiral', 'neon_laser_grid', 'neon_constellation',
    // World Map Glow - Hello UUorld startup
    'world_map_glow'
  ],
  topological: ['voronoi', 'perlin_noise', 'fractal', 'hexagonal', 'truchet', 'cellular', 'mandelbrot', 'fibonacci', 'penrose', 'delaunay'],
  metallic: ['gold', 'silver', 'copper', 'bronze', 'titanium', 'californium', 'iridescent_metal', 'oil_on_water', 'plutonium', 'osmium', 'iridium', 'palladium', 'bismuth_crystal', 'liquid_mercury'],
  crystalline: ['diamond', 'opal', 'alexandrite', 'emerald', 'ruby', 'sapphire', 'amethyst'],
  energy: ['plasma', 'lightning', 'neon', 'aurora'],
  organic: ['wood', 'marble', 'granite', 'leather']
};

/**
 * Create a Three.js material from a preset with procedural patterns
 */
export function createMaterialFromPreset(
  presetId: string,
  side: THREE.Side = THREE.DoubleSide
): THREE.MeshPhysicalMaterial {
  const preset = MATERIAL_PRESETS[presetId];

  if (!preset) {
    console.warn(`Material preset "${presetId}" not found, using voronoi as default`);
    return createMaterialFromPreset('voronoi', side);
  }

  const props = preset.properties;

  // Check if this is a neon/glow material that should have full emissive intensity
  const isNeonGlow = MATERIAL_CATEGORIES.neon_glow.includes(presetId);
  const isEnergy = MATERIAL_CATEGORIES.energy.includes(presetId);

  // STUDIO QUALITY: PBR material optimized for geometric shading
  // FIXED: Neon glow materials use full emissive intensity for proper glow effect
  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(props.color),
    metalness: props.metalness, // Use actual metalness for proper light response
    roughness: Math.max(0.1, props.roughness), // Slight smoothness for reflections
    emissive: props.emissive ? new THREE.Color(props.emissive) : new THREE.Color(0x000000),
    // FIXED: Full emissive for neon glow, moderate for energy, reduced for others
    emissiveIntensity: isNeonGlow ? (props.emissiveIntensity || 0.8) : (isEnergy ? (props.emissiveIntensity || 0) * 0.6 : (props.emissiveIntensity || 0) * 0.3),
    transmission: props.transmission || 0,
    thickness: props.thickness || 0,
    clearcoat: props.clearcoat ?? 0.5, // Moderate clearcoat
    clearcoatRoughness: props.clearcoatRoughness ?? 0.1,
    ior: props.ior || 1.5,
    reflectivity: 0.5, // Balanced reflectivity
    transparent: props.transparent || false,
    opacity: props.opacity || 1,
    side: side,
    envMapIntensity: 0.8, // Moderate environment reflections
    flatShading: false,
    sheen: 0.2, // Subtle sheen
    sheenRoughness: 0.3,
    sheenColor: new THREE.Color(0x444444),
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1
  });

  // Apply procedural pattern textures based on material type
  let patternTexture: THREE.DataTexture | null = null;
  
  switch (presetId) {
    // NEON GLOW patterns - Premium category
    case 'neon_pink':
      patternTexture = generateNeonPinkPattern();
      break;
    case 'neon_blue':
      patternTexture = generateNeonBluePattern();
      break;
    case 'neon_green':
      patternTexture = generateNeonGreenPattern();
      break;
    case 'neon_orange':
      patternTexture = generateNeonOrangePattern();
      break;
    case 'neon_purple':
      patternTexture = generateNeonPurplePattern();
      break;
    case 'neon_cyan':
      patternTexture = generateNeonCyanPattern();
      break;
    case 'neon_red':
      patternTexture = generateNeonRedPattern();
      break;
    case 'neon_yellow':
      patternTexture = generateNeonYellowPattern();
      break;
    case 'neon_rainbow':
      patternTexture = generateNeonRainbowPattern();
      break;
    case 'neon_grid':
      patternTexture = generateNeonGridPattern();
      break;
    case 'neon_pulse':
      patternTexture = generateNeonPulsePattern();
      break;
    case 'neon_plasma_fusion':
      patternTexture = generateNeonPlasmaFusionPattern();
      break;
    // NEW Creative Glow Patterns - HIGH CONTRAST
    case 'neon_hexagon_grid':
      patternTexture = generateNeonHexagonGridPattern();
      break;
    case 'neon_circuit':
      patternTexture = generateNeonCircuitPattern();
      break;
    case 'neon_scanlines':
      patternTexture = generateNeonScanlinesPattern();
      break;
    case 'neon_spiral':
      patternTexture = generateNeonSpiralPattern();
      break;
    case 'neon_laser_grid':
      patternTexture = generateNeonLaserGridPattern();
      break;
    case 'neon_constellation':
      patternTexture = generateNeonConstellationPattern();
      break;
    case 'world_map_glow':
      // Load Hello UUorld Earth texture - no emission until texture ready
      const earthLoader = new THREE.TextureLoader();
      // Set initial state: invisible until texture loads
      material.transparent = true;
      material.opacity = 0;
      material.emissive = new THREE.Color(0x000000);
      material.emissiveIntensity = 0;
      
      earthLoader.load(
        '/textures/hello-uuorld-earth.jpg',
        (loadedEarthTexture) => {
          loadedEarthTexture.colorSpace = THREE.SRGBColorSpace;
          loadedEarthTexture.wrapS = THREE.ClampToEdgeWrapping;
          loadedEarthTexture.wrapT = THREE.ClampToEdgeWrapping;
          loadedEarthTexture.minFilter = THREE.LinearMipmapLinearFilter;
          loadedEarthTexture.magFilter = THREE.LinearFilter;
          loadedEarthTexture.generateMipmaps = true;
          loadedEarthTexture.anisotropy = 16;
          loadedEarthTexture.repeat.set(1, 1);
          loadedEarthTexture.needsUpdate = true;
          material.map = loadedEarthTexture;
          material.color = new THREE.Color(0xffffff);
          // Apply subtle emission only after texture is loaded
          material.emissive = new THREE.Color(0x112233);
          material.emissiveIntensity = 0.15;
          material.transparent = false;
          material.opacity = 1.0;
          material.needsUpdate = true;
          console.log('✅ Hello UUorld Earth texture loaded successfully');
        },
        undefined,
        (error) => {
          console.error('❌ Failed to load Earth texture:', error);
          // On error, show fallback solid color (no emission flash)
          material.color = new THREE.Color(0x1a3366);
          material.transparent = false;
          material.opacity = 1.0;
          material.needsUpdate = true;
        }
      );
      patternTexture = null;
      break;
    
    // Topological patterns
    case 'voronoi':
      patternTexture = generateVoronoiPattern();
      break;
    case 'perlin_noise':
      patternTexture = generatePerlinNoisePattern();
      break;
    case 'fractal':
      patternTexture = generateFractalPattern();
      break;
    case 'hexagonal':
      patternTexture = generateHexagonalPattern();
      break;
    case 'truchet':
      patternTexture = generateTruchetPattern();
      break;
    case 'cellular':
      patternTexture = generateCellularPattern();
      break;
    case 'mandelbrot':
      patternTexture = generateMandelbrotPattern();
      break;
    case 'fibonacci':
      patternTexture = generateFibonacciPattern();
      break;
    case 'penrose':
      patternTexture = generatePenrosePattern();
      break;
    case 'delaunay':
      patternTexture = generateDelaunayPattern();
      break;
    
    // Metallic patterns
    case 'gold':
      patternTexture = generateGoldPattern();
      break;
    case 'silver':
      patternTexture = generateSilverPattern();
      break;
    case 'copper':
      patternTexture = generateCopperPattern();
      break;
    case 'bronze':
      patternTexture = generateBronzePattern();
      break;
    case 'titanium':
      patternTexture = generateTitaniumPattern();
      break;
    
    // Crystalline patterns (gems)
    case 'diamond':
      patternTexture = generateDiamondPattern();
      break;
    case 'opal':
      patternTexture = generateOpalPattern();
      break;
    case 'alexandrite':
      patternTexture = generateAlexandritePattern();
      break;
    case 'emerald':
      patternTexture = generateEmeraldPattern();
      break;
    case 'ruby':
      patternTexture = generateRubyPattern();
      break;
    case 'sapphire':
      patternTexture = generateSapphirePattern();
      break;
    case 'amethyst':
      patternTexture = generateAmethystPattern();
      break;
    
    // Energy patterns
    case 'plasma':
      patternTexture = generatePlasmaPattern();
      break;
    case 'lightning':
      patternTexture = generateLightningPattern();
      break;
    case 'neon':
      patternTexture = generateNeonPattern();
      break;
    case 'aurora':
      patternTexture = generateAuroraPattern();
      break;
    
    // Organic patterns
    case 'wood':
      patternTexture = generateWoodPattern();
      break;
    case 'marble':
      patternTexture = generateMarblePattern();
      break;
    case 'granite':
      patternTexture = generateGranitePattern();
      break;
    case 'leather':
      patternTexture = generateLeatherPattern();
      break;
  }

  // ENHANCED: Material-specific texture application
  if (patternTexture) {
    patternTexture.wrapS = THREE.RepeatWrapping;
    patternTexture.wrapT = THREE.RepeatWrapping;
    patternTexture.anisotropy = 16;
    patternTexture.minFilter = THREE.LinearMipmapLinearFilter;
    patternTexture.magFilter = THREE.LinearFilter;
    patternTexture.generateMipmaps = true;
    patternTexture.colorSpace = THREE.SRGBColorSpace;
    
    // Determine material category for appropriate texture usage
    const isCrystalline = MATERIAL_CATEGORIES.crystalline.includes(presetId);
    const isEnergy = MATERIAL_CATEGORIES.energy.includes(presetId);
    const isMetallic = MATERIAL_CATEGORIES.metallic.includes(presetId);
    const isNeonGlow = MATERIAL_CATEGORIES.neon_glow.includes(presetId);
    
    if (isNeonGlow) {
      // NEON GLOW: Pattern IS the glow - use as color map with emissive from pattern
      // DO NOT apply separate emissive color - it washes out the pattern
      patternTexture.repeat.set(1, 1); // No repeat for constellation/pattern materials
      material.map = patternTexture;
      
      // Set emissive to BLACK - the pattern itself contains the glow colors
      material.emissive = new THREE.Color(0x000000);
      material.emissiveIntensity = 0;
      
      // Let the pattern colors be the visual - no emissive overlay
      material.color = new THREE.Color(0xffffff); // White base so pattern shows true colors
      material.roughness = 0.1; // Smooth for glow effect
      material.metalness = 0.0;
      material.transparent = true;
      material.opacity = props.opacity || 0.98;
      material.envMapIntensity = 0.2; // Subtle environment reflections
      
    } else if (isCrystalline) {
      // GEMS: Use subtle pattern as roughness variation, NOT color map
      // This preserves transparency and gem-like refraction
      patternTexture.repeat.set(2, 2);
      
      // Don't apply as color map - let transmission/color shine through
      // Apply as very subtle roughness map for internal structure effect
      material.roughnessMap = patternTexture;
      material.roughness = props.roughness * 0.5; // Reduce base roughness for gem clarity
      
      // Enhance gem properties
      material.transmission = props.transmission || 0.8;
      material.ior = props.ior || 1.5;
      material.thickness = props.thickness || 1.0;
      material.transparent = true;
      material.opacity = props.opacity || 0.95;
      material.clearcoat = 1.0;
      material.clearcoatRoughness = 0.02;
      material.envMapIntensity = 1.5; // More reflections
      material.sheen = 0.5;
      material.sheenRoughness = 0.2;
      material.sheenColor = new THREE.Color(props.color);
      
    } else if (isEnergy) {
      // ENERGY: Use pattern as emissive map for GLOWING effect
      patternTexture.repeat.set(3, 3);
      
      // Apply as emissive map - makes it GLOW
      material.emissiveMap = patternTexture;
      material.emissiveIntensity = props.emissiveIntensity || 1.5;
      material.emissive = new THREE.Color(props.emissive || props.color);
      
      // Energy materials should be semi-transparent and glowing
      material.transparent = true;
      material.opacity = props.opacity || 0.85;
      material.roughness = 0.0;
      material.metalness = 0.0;
      material.envMapIntensity = 0.3; // Less reflection, more glow
      
      // Don't use as color map - let emissive be the visual
      // material.map = null; // Intentionally not setting color map
      
    } else if (isMetallic) {
      // METALLIC: Use pattern as COLOR map for authentic metal appearance
      // The procedural patterns contain the metal's actual color/tone variation
      patternTexture.repeat.set(4, 4);
      material.map = patternTexture; // Apply as color/albedo map
      
      // Keep metalness high for proper metal reflections
      material.metalness = props.metalness || 0.9;
      material.roughness = props.roughness || 0.15; // Smooth for polish
      material.envMapIntensity = 1.4; // Strong environment reflections
      material.clearcoat = 0.3; // Subtle clearcoat for polish
      material.clearcoatRoughness = 0.1;
      
      // For metals, we want the pattern colors to show through
      // Not a white-washed roughness effect
      material.color = new THREE.Color(0xffffff); // White base so map shows true colors
      
    } else {
      // TOPOLOGICAL & ORGANIC: Use as color map (original behavior)
      patternTexture.repeat.set(4, 4);
      material.map = patternTexture;
    }
    
    material.needsUpdate = true;
  }

  return material;
}

/**
 * Apply custom texture to a material
 */
export function applyCustomTexture(material: THREE.MeshPhysicalMaterial, textureUrl: string): void {
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    textureUrl,
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;

      material.map = texture;
      material.needsUpdate = true;
    },
    undefined,
    (error) => {
      console.error('Error loading custom texture:', error);
    }
  );
}

/**
 * Export-ready texture set for GLB/GLTF baking
 */
export interface ExportTextureSet {
  albedoMap: THREE.DataTexture | null;
  emissiveMap: THREE.DataTexture | null;
  roughnessMap: THREE.DataTexture | null;
  metalnessMap: THREE.DataTexture | null;
  normalMap: THREE.DataTexture | null;
}

/**
 * Generate export-ready textures for a material preset
 * These textures are properly configured for GLB/GLTF export with baked materials
 */
export function generateExportTextures(presetId: string, resolution: number = 2048): ExportTextureSet {
  const result: ExportTextureSet = {
    albedoMap: null,
    emissiveMap: null,
    roughnessMap: null,
    metalnessMap: null,
    normalMap: null
  };

  let patternTexture: THREE.DataTexture | null = null;

  // Generate the appropriate pattern texture
  switch (presetId) {
    // NEON GLOW patterns - Premium category
    case 'neon_pink': patternTexture = generateNeonPinkPattern(resolution); break;
    case 'neon_blue': patternTexture = generateNeonBluePattern(resolution); break;
    case 'neon_green': patternTexture = generateNeonGreenPattern(resolution); break;
    case 'neon_orange': patternTexture = generateNeonOrangePattern(resolution); break;
    case 'neon_purple': patternTexture = generateNeonPurplePattern(resolution); break;
    case 'neon_cyan': patternTexture = generateNeonCyanPattern(resolution); break;
    case 'neon_red': patternTexture = generateNeonRedPattern(resolution); break;
    case 'neon_yellow': patternTexture = generateNeonYellowPattern(resolution); break;
    case 'neon_rainbow': patternTexture = generateNeonRainbowPattern(resolution); break;
    case 'neon_grid': patternTexture = generateNeonGridPattern(resolution); break;
    case 'neon_pulse': patternTexture = generateNeonPulsePattern(resolution); break;
    case 'neon_plasma_fusion': patternTexture = generateNeonPlasmaFusionPattern(resolution); break;
    // NEW Creative Glow Patterns
    case 'neon_hexagon_grid': patternTexture = generateNeonHexagonGridPattern(resolution); break;
    case 'neon_circuit': patternTexture = generateNeonCircuitPattern(resolution); break;
    case 'neon_scanlines': patternTexture = generateNeonScanlinesPattern(resolution); break;
    case 'neon_spiral': patternTexture = generateNeonSpiralPattern(resolution); break;
    case 'neon_laser_grid': patternTexture = generateNeonLaserGridPattern(resolution); break;
    case 'neon_constellation': patternTexture = generateNeonConstellationPattern(resolution); break;
    case 'world_map_glow': 
      // For exports, use synchronous pattern - texture handled separately
      patternTexture = null;
      break;
    // Topological patterns
    case 'voronoi': patternTexture = generateVoronoiPattern(resolution); break;
    case 'perlin_noise': patternTexture = generatePerlinNoisePattern(resolution); break;
    case 'fractal': patternTexture = generateFractalPattern(resolution); break;
    case 'hexagonal': patternTexture = generateHexagonalPattern(resolution); break;
    case 'truchet': patternTexture = generateTruchetPattern(resolution); break;
    case 'cellular': patternTexture = generateCellularPattern(resolution); break;
    case 'mandelbrot': patternTexture = generateMandelbrotPattern(resolution); break;
    case 'fibonacci': patternTexture = generateFibonacciPattern(resolution); break;
    case 'penrose': patternTexture = generatePenrosePattern(resolution); break;
    case 'delaunay': patternTexture = generateDelaunayPattern(resolution); break;
    // Metallic patterns
    case 'gold': patternTexture = generateGoldPattern(resolution); break;
    case 'silver': patternTexture = generateSilverPattern(resolution); break;
    case 'copper': patternTexture = generateCopperPattern(resolution); break;
    case 'bronze': patternTexture = generateBronzePattern(resolution); break;
    case 'titanium': patternTexture = generateTitaniumPattern(resolution); break;
    // Crystalline patterns
    case 'diamond': patternTexture = generateDiamondPattern(resolution); break;
    case 'opal': patternTexture = generateOpalPattern(resolution); break;
    case 'alexandrite': patternTexture = generateAlexandritePattern(resolution); break;
    case 'emerald': patternTexture = generateEmeraldPattern(resolution); break;
    case 'ruby': patternTexture = generateRubyPattern(resolution); break;
    case 'sapphire': patternTexture = generateSapphirePattern(resolution); break;
    case 'amethyst': patternTexture = generateAmethystPattern(resolution); break;
    // Energy patterns
    case 'plasma': patternTexture = generatePlasmaPattern(resolution); break;
    case 'lightning': patternTexture = generateLightningPattern(resolution); break;
    case 'neon': patternTexture = generateNeonPattern(resolution); break;
    case 'aurora': patternTexture = generateAuroraPattern(resolution); break;
    // Organic patterns
    case 'wood': patternTexture = generateWoodPattern(resolution); break;
    case 'marble': patternTexture = generateMarblePattern(resolution); break;
    case 'granite': patternTexture = generateGranitePattern(resolution); break;
    case 'leather': patternTexture = generateLeatherPattern(resolution); break;
    default:
      patternTexture = generateVoronoiPattern(resolution);
  }

  if (!patternTexture) return result;

  // Configure texture for export
  patternTexture.wrapS = THREE.RepeatWrapping;
  patternTexture.wrapT = THREE.RepeatWrapping;
  patternTexture.colorSpace = THREE.SRGBColorSpace;
  patternTexture.needsUpdate = true;

  // Determine material category for proper texture assignment
  const isCrystalline = MATERIAL_CATEGORIES.crystalline.includes(presetId);
  const isEnergy = MATERIAL_CATEGORIES.energy.includes(presetId);
  const isMetallic = MATERIAL_CATEGORIES.metallic.includes(presetId);
  const isNeonGlow = MATERIAL_CATEGORIES.neon_glow.includes(presetId);

  if (isNeonGlow) {
    // NEON GLOW: Use pattern as both emissive and albedo for intense glowing export
    // These should glow brightly even without external lighting
    result.emissiveMap = patternTexture;
    result.albedoMap = patternTexture;
  } else if (isCrystalline) {
    // Gems: Use pattern for subtle roughness variation, include as albedo for color hints
    result.roughnessMap = patternTexture;
    result.albedoMap = patternTexture; // Include pattern as subtle color hint
  } else if (isEnergy) {
    // Energy: Use pattern as both emissive and albedo for glowing export
    result.emissiveMap = patternTexture;
    result.albedoMap = patternTexture;
  } else if (isMetallic) {
    // METALLIC: Use pattern as COLOR map - shows the metal's actual appearance
    // The procedural pattern contains the metal's color/tone variation
    result.albedoMap = patternTexture;
    // Don't set roughness/metalness maps - let base material properties handle reflection
  } else {
    // Topological & Organic: Use pattern as primary albedo
    result.albedoMap = patternTexture;
  }

  console.log(`📦 Export textures generated for material: ${presetId} at ${resolution}px`);
  return result;
}

// =============================================================================
// TRIPLANAR fBm EXPORT BAKING
// JS-side mirrors of the GLSL functions in triplanarFbmShader.ts.
// Used to bake a DataTexture that approximates the runtime triplanar look
// into the GLB albedo map so exported assets reflect fBmLayers / domainWarp.
// =============================================================================

/** Set of pattern IDs that use triplanar GLSL rendering (mirrors TRIPLANAR_PATTERN_IDS) */
const TRIPLANAR_BAKE_IDS = new Set([
  'voronoi', 'cellular', 'fractal', 'hexagonal', 'truchet',
  'mandelbrot', 'fibonacci', 'penrose', 'delaunay', 'perlin_noise',
]);

function _tpHash(px: number, py: number): number {
  return Math.abs(Math.sin(px * 127.1 + py * 311.7) * 43758.5453) % 1;
}
function _tpNoise(px: number, py: number): number {
  const ix = Math.floor(px), iy = Math.floor(py);
  const fx = px - ix, fy = py - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  return (_tpHash(ix, iy) * (1 - ux) * (1 - uy) +
          _tpHash(ix + 1, iy) * ux * (1 - uy) +
          _tpHash(ix, iy + 1) * (1 - ux) * uy +
          _tpHash(ix + 1, iy + 1) * ux * uy) * 2 - 1;
}
function _tpFbm(px: number, py: number, octaves: number): number {
  let v = 0, a = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += a * _tpNoise(px * freq, py * freq);
    freq *= 2; a *= 0.5;
  }
  return v;
}
function _tpWarp(px: number, py: number, s: number): [number, number] {
  if (s < 0.001) return [px, py];
  return [px + s * _tpFbm(px, py, 3), py + s * _tpFbm(px + 5.2, py + 1.3, 3)];
}
function _tpCore(pattern: string, px: number, py: number): number {
  switch (pattern) {
    case 'voronoi': {
      const ix = Math.floor(px), iy = Math.floor(py);
      const fx = px - ix, fy = py - iy;
      let d = 8;
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) {
        const rx = x + _tpHash(ix + x, iy + y) - fx;
        const ry = y + _tpHash(ix + x + 3.7, iy + y + 1.1) - fy;
        d = Math.min(d, rx * rx + ry * ry);
      }
      return Math.max(0, Math.min(1, 1 - Math.sqrt(d)));
    }
    case 'cellular': {
      const ix = Math.floor(px), iy = Math.floor(py);
      const fx = px - ix, fy = py - iy;
      let d1 = 8, d2 = 8;
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) {
        const rx = x + _tpHash(ix + x, iy + y) - fx;
        const ry = y + _tpHash(ix + x + 2.3, iy + y + 5.7) - fy;
        const d = rx * rx + ry * ry;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
      }
      return Math.max(0, Math.min(1, (Math.sqrt(d2) - Math.sqrt(d1)) * 1.5));
    }
    case 'fractal': {
      let v = 0, a = 0.5, qx = px * 0.8, qy = py * 0.8;
      for (let i = 0; i < 6; i++) {
        v += a * Math.abs(Math.sin(qx * Math.PI) * Math.cos(qy * Math.PI));
        qx = qx * 2 + 0.31; qy = qy * 2 + 0.17; a *= 0.5;
      }
      return Math.max(0, Math.min(1, v));
    }
    case 'hexagonal': {
      const qx = px * 2 * 0.5773503, qy = py * 2 + px * 2 * 0.5773503 * 0.5;
      const fx = qx - Math.floor(qx), fy = qy - Math.floor(qy);
      const d = Math.min(
        Math.sqrt((fx - 0.5) ** 2 + (fy - 0.5) ** 2),
        Math.min(Math.sqrt(fx * fx + (fy - 0.5) ** 2),
                 Math.sqrt((fx - 1) ** 2 + (fy - 0.5) ** 2)));
      return 1 - Math.max(0, Math.min(1, (d - 0.3) / 0.18));
    }
    case 'truchet': {
      const ix = Math.floor(px), iy = Math.floor(py);
      const fx = px - ix, fy = py - iy;
      const flip = _tpHash(ix, iy) > 0.5;
      const r = flip
        ? Math.min(Math.sqrt((fx - 1) ** 2 + fy ** 2) - 0.5, Math.sqrt(fx ** 2 + (fy - 1) ** 2) - 0.5)
        : Math.min(Math.sqrt(fx ** 2 + fy ** 2) - 0.5, Math.sqrt((fx - 1) ** 2 + (fy - 1) ** 2) - 0.5);
      return Math.max(0, Math.min(1, 1 - Math.abs(r) * 6));
    }
    case 'mandelbrot': {
      const cx = px * 0.5 - 0.5, cy = py * 0.5;
      let zx = 0, zy = 0, n = 0;
      for (let i = 0; i < 32; i++) {
        const nx = zx * zx - zy * zy + cx, ny = 2 * zx * zy + cy;
        zx = nx; zy = ny;
        if (zx * zx + zy * zy > 4) break;
        n++;
      }
      return n / 32;
    }
    case 'fibonacci': {
      const r = Math.sqrt(px * px + py * py);
      const theta = Math.atan2(py, px);
      return Math.max(0, Math.min(1, (Math.sin(r * 6 - theta * 3) + Math.sin(r * 1.618 * 8)) * 0.5 + 0.5));
    }
    case 'penrose': {
      let v = 0;
      for (let k = 0; k < 5; k++) {
        const angle = k * 1.2566370614;
        v += Math.cos((px * 1.618 * Math.cos(angle) + py * 1.618 * Math.sin(angle)) * 4);
      }
      return Math.max(0, Math.min(1, v / 5 * 0.5 + 0.5));
    }
    case 'delaunay': {
      const ix = Math.floor(px), iy = Math.floor(py);
      const fx = px - ix, fy = py - iy;
      let d1 = 8, d2 = 8;
      for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) {
        const rx = x + _tpHash(ix + x, iy + y) - fx;
        const ry = y + _tpHash(ix + x + 1.7, iy + y + 3.3) - fy;
        const d = rx * rx + ry * ry;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) { d2 = d; }
      }
      return Math.max(0, Math.min(1, 1 - (Math.sqrt(d2) - Math.sqrt(d1)) * 3));
    }
    case 'perlin_noise':
    default:
      return Math.max(0, Math.min(1, _tpNoise(px, py) * 0.5 + 0.5));
  }
}

/**
 * Bake a UV-space DataTexture that approximates the triplanar fBm shader result.
 * Uses the same hash/noise/fBm logic as the GLSL functions in triplanarFbmShader.ts
 * so the exported GLB albedo map visually matches the runtime procedural shader.
 * Resolution defaults to 512 for fast generation (adequate for most viewers).
 */
export function bakeFbmEnrichedTexture(
  pattern: string,
  fBmLayers: number,
  domainWarp: number,
  resolution = 512
): THREE.DataTexture {
  const layers = Math.max(1, Math.min(6, Math.round(fBmLayers)));
  const warp   = Math.max(0, Math.min(1, domainWarp));
  const scale  = 2.5;
  const data   = new Uint8Array(resolution * resolution * 4);

  for (let row = 0; row < resolution; row++) {
    for (let col = 0; col < resolution; col++) {
      const u = (col / resolution * 2 - 1) * scale;
      const v = (row / resolution * 2 - 1) * scale;

      const [wu, wv] = _tpWarp(u, v, warp);
      const base   = _tpCore(pattern, wu, wv);
      const detail = _tpFbm(wu * 1.5, wv * 1.5, layers) * 0.25;
      // Mirror GLSL: mix(vec3(0.5), vec3(raw*1.8), 0.65)
      const raw    = Math.max(0, Math.min(1, base + detail));
      const val    = 0.5 * 0.35 + raw * 1.8 * 0.65;
      const px8    = Math.floor(Math.max(0, Math.min(1, val)) * 255);

      const idx = (row * resolution + col) * 4;
      data[idx] = px8; data[idx + 1] = px8; data[idx + 2] = px8; data[idx + 3] = 255;
    }
  }

  const tex = new THREE.DataTexture(data, resolution, resolution, THREE.RGBAFormat);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.needsUpdate = true;
  console.log(`🎨 Baked triplanar fBm texture: ${pattern} (layers=${layers}, warp=${warp.toFixed(2)}, ${resolution}px)`);
  return tex;
}

/**
 * Create a GLB-compatible export material for triplanar patterns with fBm enrichment.
 * The albedo map is baked using JS-side pattern evaluation that mirrors the runtime GLSL.
 * triplanarProjection parameters are also stored in material.userData for custom viewers.
 */
export function createTriplanarExportMaterial(
  presetId: string,
  fBmLayers: number,
  domainWarp: number,
  resolution = 512
): THREE.MeshStandardMaterial {
  const material = createExportMaterial(presetId, resolution);
  const fbmTex   = bakeFbmEnrichedTexture(presetId, fBmLayers, domainWarp, resolution);
  material.map   = fbmTex;
  material.userData = {
    ...material.userData,
    triplanarProjection: true,
    fBmLayers: Math.round(fBmLayers),
    domainWarp: parseFloat(domainWarp.toFixed(2)),
    pattern: presetId,
  };
  material.needsUpdate = true;
  return material;
}

/**
 * Create a fully export-ready material with baked textures for GLB/GLTF
 * This material is configured for maximum compatibility with external viewers
 * 
 * INTERNAL GLOW EFFECT: Using DoubleSide + high emissive intensity creates
 * the appearance of geometry glowing "from within" because:
 * 1. Both front and back faces emit light equally
 * 2. High emissive intensity (5.0+) makes the material self-luminous
 * 3. The emissive map defines the glow pattern visible from any angle
 * 
 * This gives the appearance of internal glow even though meshes are just surfaces.
 * External viewers like Sketchfab, Blender, and game engines will render this correctly.
 */
export function createExportMaterial(
  presetId: string,
  resolution: number = 2048
): THREE.MeshStandardMaterial {
  const preset = MATERIAL_PRESETS[presetId];
  if (!preset) {
    console.warn(`Material preset "${presetId}" not found, using voronoi`);
    return createExportMaterial('voronoi', resolution);
  }

  const props = preset.properties;
  const textures = generateExportTextures(presetId, resolution);
  
  const isCrystalline = MATERIAL_CATEGORIES.crystalline.includes(presetId);
  const isEnergy = MATERIAL_CATEGORIES.energy.includes(presetId);
  const isMetallic = MATERIAL_CATEGORIES.metallic.includes(presetId);
  const isNeonGlow = MATERIAL_CATEGORIES.neon_glow.includes(presetId);

  // SMOOTH EXPORT: Reduced emissive intensity for clean, professional exports
  // High values cause wireframe washout and rendering issues in external viewers
  const exportEmissiveIntensity = isNeonGlow 
    ? Math.min(1.5, (props.emissiveIntensity || 0.8) * 0.5) 
    : (isEnergy ? Math.min(1.0, (props.emissiveIntensity || 0.5) * 0.4) : Math.min(0.3, props.emissiveIntensity || 0));

  // Create a MeshStandardMaterial for maximum GLB compatibility
  const material = new THREE.MeshStandardMaterial({
    // Use white base for neon/metals so emissive/texture shows true colors
    color: (isMetallic || isNeonGlow) ? new THREE.Color(0xffffff) : new THREE.Color(props.color),
    metalness: isNeonGlow ? 0.0 : props.metalness, // No metalness for glow (pure emissive)
    roughness: isNeonGlow ? 0.3 : props.roughness, // Slight roughness for softer glow
    emissive: props.emissive ? new THREE.Color(props.emissive) : new THREE.Color(0x000000),
    // BOOSTED emissive intensity for authentic glow in external viewers
    emissiveIntensity: exportEmissiveIntensity,
    transparent: props.transparent || isCrystalline || isEnergy || isNeonGlow,
    opacity: props.opacity || (isCrystalline ? 0.9 : (isNeonGlow ? 0.98 : 1.0)),
    // CRITICAL: DoubleSide ensures glow is visible from INSIDE and OUTSIDE
    // This creates the "internal glow" effect where geometry appears to glow from within
    side: THREE.DoubleSide,
    // Disable depth write for better transparency blending in some viewers
    depthWrite: !(isNeonGlow || isEnergy)
  });

  // Apply baked textures based on material category
  if (textures.albedoMap) {
    material.map = textures.albedoMap;
  }
  if (textures.emissiveMap && (isEnergy || isNeonGlow)) {
    material.emissiveMap = textures.emissiveMap;
  }
  if (textures.roughnessMap && !isMetallic) {
    material.roughnessMap = textures.roughnessMap;
  }

  // FORCE DOUBLE-SIDED: Explicitly set userData for glTF export compatibility
  // Some glTF viewers/editors check userData.doubleSided in addition to material.side
  material.userData = {
    ...material.userData,
    doubleSided: true
  };
  
  material.needsUpdate = true;
  console.log(`✅ Export material created: ${presetId} with baked textures (emissive: ${exportEmissiveIntensity.toFixed(1)}, doubleSided: true)`);
  
  return material;
}
