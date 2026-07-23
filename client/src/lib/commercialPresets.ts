/**
 * Commercial Preset Collections for High-Value Surfaces
 * Optimized parameter combinations for maximum visual appeal and market demand
 */

export interface PresetCollection {
  name: string;
  description: string;
  surfaceType: string;
  presets: {
    name: string;
    description: string;
    parameters: Record<string, number>;
    marketValue: 'premium' | 'standard' | 'artistic';
    visualAppeal: number; // 1-10 scale
  }[];
}

export const COMMERCIAL_PRESETS: PresetCollection[] = [
  {
    name: "Nautilus Shell Collection",
    description: "Premium logarithmic spiral chambers - Highest market demand",
    surfaceType: "nautilus_shell",
    presets: [
      {
        name: "Golden Ratio Classic",
        description: "Perfect Fibonacci spiral with natural golden ratio growth",
        parameters: {
          a: 2.2, b: 0.306, c: 0.618, d: 1.618, e: 0.194, f: 0.85, g: 0.25, h: 3.14, i: 0.15, j: 2.0,
          k: 0.08, l: 0.03, m: 1.1, n: 0.35, o: 7.5, p: 0.12, q: 13.0, r: 5.8, s: 0.18, t: 0.08
        },
        marketValue: 'premium',
        visualAppeal: 10
      },
      {
        name: "Deep Ocean Shell",
        description: "Enhanced ridges and chamber definition for luxury applications",
        parameters: {
          a: 2.5, b: 0.28, c: 0.75, d: 1.2, e: 0.25, f: 0.9, g: 0.4, h: 2.8, i: 0.22, j: 1.8,
          k: 0.12, l: 0.06, m: 1.3, n: 0.5, o: 9.0, p: 0.15, q: 11.5, r: 6.2, s: 0.22, t: 0.12
        },
        marketValue: 'premium',
        visualAppeal: 9
      },
      {
        name: "Crystalline Chamber",
        description: "Faceted appearance with geometric precision",
        parameters: {
          a: 1.8, b: 0.35, c: 0.4, d: 0.9, e: 0.15, f: 0.7, g: 0.2, h: 4.0, i: 0.1, j: 2.5,
          k: 0.15, l: 0.04, m: 0.8, n: 0.3, o: 12.0, p: 0.08, q: 16.0, r: 7.0, s: 0.15, t: 0.06
        },
        marketValue: 'artistic',
        visualAppeal: 8
      },
      {
        name: "Organic Flow",
        description: "Smooth, natural growth pattern for architectural visualization",
        parameters: {
          a: 2.0, b: 0.3, c: 0.8, d: 1.4, e: 0.18, f: 1.0, g: 0.15, h: 2.5, i: 0.25, j: 1.5,
          k: 0.05, l: 0.02, m: 1.2, n: 0.25, o: 6.0, p: 0.06, q: 10.0, r: 5.0, s: 0.12, t: 0.04
        },
        marketValue: 'standard',
        visualAppeal: 9
      }
    ]
  },
  {
    name: "Enneper Surface Collection",
    description: "Classical minimal surfaces with self-intersecting beauty",
    surfaceType: "enneper_surface",
    presets: [
      {
        name: "Mathematical Pure",
        description: "Authentic Enneper surface with minimal distortion",
        parameters: {
          a: 1.0, b: 1.0, c: 1.0, d: 1.0, e: 0.05, f: 0.3, g: 0.15, h: 1.0, i: 0.05, j: 0.15,
          k: 0.25, l: 1.0, m: 0.08, n: 0.5, o: 0.3, p: 0.02, q: 0.8, r: 0.02, s: 1.0, t: 0.01
        },
        marketValue: 'premium',
        visualAppeal: 10
      },
      {
        name: "Twisted Elegance",
        description: "Enhanced twist and curvature for dynamic visualization",
        parameters: {
          a: 1.2, b: 1.1, c: 0.9, d: 1.4, e: 0.15, f: 0.8, g: 0.4, h: 1.3, i: 0.12, j: 0.4,
          k: 0.6, l: 1.2, m: 0.2, n: 1.0, o: 0.8, p: 0.08, q: 1.2, r: 0.06, s: 1.4, t: 0.03
        },
        marketValue: 'artistic',
        visualAppeal: 9
      }
    ]
  },
  {
    name: "3D Flower of Life Collection",
    description: "Sacred geometry with hexagonal perfection",
    surfaceType: "flower_of_life_3d",
    presets: [
      {
        name: "Sacred Harmony",
        description: "Perfect 7-circle arrangement with golden ratio proportions",
        parameters: {
          a: 1.0, b: 1.0, c: 0.08, d: 1.0, e: 0.08, f: 1.0, g: 0.15, h: 6.0, i: 0.12, j: 2.0,
          k: 2.5, l: 0.618, m: 0.4, n: 6.0, o: 0.25, p: 1.618, q: 6.0, r: 0.5, s: 0.15, t: 0.4
        },
        marketValue: 'premium',
        visualAppeal: 10
      },
      {
        name: "Crystalline Petals",
        description: "Enhanced petal definition with spiritual energy flow",
        parameters: {
          a: 1.1, b: 0.95, c: 0.12, d: 1.05, e: 0.1, f: 1.2, g: 0.25, h: 3.5, i: 0.18, j: 1.8,
          k: 2.0, l: 0.7, m: 0.35, n: 7.0, o: 0.3, p: 1.618, q: 7.0, r: 0.6, s: 0.2, t: 0.5
        },
        marketValue: 'artistic',
        visualAppeal: 9
      }
    ]
  },
  {
    name: "Catenoid Collection",
    description: "Minimal surfaces of revolution - Soap film mathematics",
    surfaceType: "catenoid",
    presets: [
      {
        name: "Perfect Minimal",
        description: "Pure mathematical form with optimal waist curve",
        parameters: {
          a: 1.0, b: 1.0, c: 1.0, d: 1.0, e: 0.15, f: 0.4, g: 0.05, h: 0.03, i: 1.8, j: 0.08,
          k: 6.0, l: 2.5, m: 0.4, n: 0.03, o: 1.2, p: 5.0, q: 0.03, r: 3.5, s: 1.8, t: 1.0
        },
        marketValue: 'premium',
        visualAppeal: 10
      },
      {
        name: "Architectural Flow",
        description: "Enhanced for structural visualization applications",
        parameters: {
          a: 1.2, b: 0.9, c: 1.1, d: 1.1, e: 0.25, f: 0.6, g: 0.12, h: 0.06, i: 2.2, j: 0.12,
          k: 8.5, l: 3.2, m: 0.6, n: 0.06, o: 1.6, p: 6.5, q: 0.06, r: 4.2, s: 2.2, t: 1.2
        },
        marketValue: 'standard',
        visualAppeal: 8
      }
    ]
  },
  {
    name: "Helicoid Collection",
    description: "Twisted minimal surfaces - Dynamic spiral mathematics",
    surfaceType: "helicoid",
    presets: [
      {
        name: "Pure Helical",
        description: "Classic ruled minimal surface with perfect twist",
        parameters: {
          a: 0.5, b: 1.0, c: 1.0, d: 0.15, e: 1.2, f: 0.08, g: 1.0, h: 0.25, i: 2.8, j: 0.18,
          k: 1.8, l: 0.08, m: 3.5, n: 1.2, o: 0.25, p: 0.06, q: 5.5, r: 2.2, s: 0.4, t: 0.15
        },
        marketValue: 'premium',
        visualAppeal: 10
      },
      {
        name: "Dynamic Twist",
        description: "Enhanced warping and edge effects for visual impact",
        parameters: {
          a: 0.6, b: 1.1, c: 1.2, d: 0.25, e: 1.6, f: 0.12, g: 1.1, h: 0.35, i: 3.2, j: 0.22,
          k: 2.2, l: 0.12, m: 4.2, n: 1.6, o: 0.35, p: 0.1, q: 6.2, r: 2.8, s: 0.6, t: 0.22
        },
        marketValue: 'artistic',
        visualAppeal: 9
      }
    ]
  }
];

export function getPresetsByType(surfaceType: string): PresetCollection | null {
  return COMMERCIAL_PRESETS.find(collection => collection.surfaceType === surfaceType) || null;
}

export function getAllPresets(): PresetCollection[] {
  return COMMERCIAL_PRESETS;
}

export function getPresetByName(surfaceType: string, presetName: string) {
  const collection = getPresetsByType(surfaceType);
  return collection?.presets.find(preset => preset.name === presetName) || null;
}

export function getHighValuePresets() {
  return COMMERCIAL_PRESETS.map(collection => ({
    ...collection,
    presets: collection.presets.filter(preset => preset.marketValue === 'premium' && preset.visualAppeal >= 9)
  })).filter(collection => collection.presets.length > 0);
}