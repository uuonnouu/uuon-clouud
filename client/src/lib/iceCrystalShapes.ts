/**
 * ICE CRYSTALS & SNOWFLAKE SHAPES
 * Nature's geometric masterpieces with 6-fold symmetry
 * Based on Bentley's snowflake classification and crystallography
 */

import * as THREE from 'three';

export interface IceCrystalShape {
  name: string;
  category: string;
  equation: string;
  description: string;
  field: string;
  x: (u: number, v: number, params: Record<string, number>) => number;
  y: (u: number, v: number, params: Record<string, number>) => number;
  z: (u: number, v: number, params: Record<string, number>) => number;
}

// Hexagonal symmetry helper
function hexSymmetry(angle: number, radius: number, armCount: number = 6): { x: number; y: number } {
  const baseAngle = (Math.floor(angle * armCount / (2 * Math.PI)) * 2 * Math.PI) / armCount;
  const localAngle = angle - baseAngle;
  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle)
  };
}

// Koch snowflake iteration
function kochCurve(t: number, iterations: number): { x: number; y: number } {
  let x = 0, y = 0;
  let angle = 0;
  const step = 1 / Math.pow(3, iterations);
  
  for (let i = 0; i < iterations; i++) {
    const segment = Math.floor(t * Math.pow(4, i + 1)) % 4;
    const localT = (t * Math.pow(4, i + 1)) % 1;
    
    switch (segment) {
      case 0: angle += 0; break;
      case 1: angle += Math.PI / 3; break;
      case 2: angle -= Math.PI / 3; break;
      case 3: angle += 0; break;
    }
    
    x += step * Math.cos(angle) * localT;
    y += step * Math.sin(angle) * localT;
  }
  
  return { x, y };
}

export const ICE_CRYSTAL_SHAPES: Record<string, IceCrystalShape> = {
  // Classic Snowflake with 6-fold symmetry
  snowflake_hexagonal: {
    name: 'Hexagonal Snowflake',
    category: 'Nature & Crystals',
    equation: 'r(θ) = a(1 + b·sin(6θ))',
    description: 'Classic 6-fold symmetric snowflake pattern based on ice crystal formation at -15°C',
    field: 'Crystallography, Meteorology',
    x: (u, v, p) => {
      const a = p.a || 1;
      const b = p.b || 0.3;
      const theta = u * Math.PI * 2;
      const r = a * (1 + b * Math.sin(6 * theta)) * (1 - v * 0.1);
      const armDetail = 1 + 0.2 * Math.sin(12 * theta) * Math.cos(v * Math.PI);
      return r * armDetail * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const b = p.b || 0.3;
      const theta = u * Math.PI * 2;
      const r = a * (1 + b * Math.sin(6 * theta)) * (1 - v * 0.1);
      const armDetail = 1 + 0.2 * Math.sin(12 * theta) * Math.cos(v * Math.PI);
      return r * armDetail * Math.sin(theta);
    },
    z: (u, v, p) => {
      const c = p.c || 0.05;
      const theta = u * Math.PI * 2;
      return c * Math.sin(6 * theta) * Math.cos(v * Math.PI * 2);
    }
  },

  // Dendrite Snowflake (branching pattern)
  snowflake_dendrite: {
    name: 'Dendrite Snowflake',
    category: 'Nature & Crystals',
    equation: 'r(θ) = a·Σ(sin(6nθ)/n)',
    description: 'Branching dendrite pattern - the most complex and beautiful snowflake form',
    field: 'Crystallography, Fractal Geometry',
    x: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const branch = v;
      let r = a * 0.3;
      for (let n = 1; n <= 4; n++) {
        r += (a / n) * Math.sin(6 * n * theta) * Math.pow(0.7, n);
      }
      r *= (1 - branch * 0.4);
      const sideBranch = 0.15 * Math.sin(18 * theta) * branch;
      return (r + sideBranch) * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const branch = v;
      let r = a * 0.3;
      for (let n = 1; n <= 4; n++) {
        r += (a / n) * Math.sin(6 * n * theta) * Math.pow(0.7, n);
      }
      r *= (1 - branch * 0.4);
      const sideBranch = 0.15 * Math.sin(18 * theta) * branch;
      return (r + sideBranch) * Math.sin(theta);
    },
    z: (u, v, p) => {
      const c = p.c || 0.03;
      const theta = u * Math.PI * 2;
      return c * Math.cos(6 * theta) * (1 - v);
    }
  },

  // Stellar Plate Snowflake
  snowflake_stellar_plate: {
    name: 'Stellar Plate Crystal',
    category: 'Nature & Crystals',
    equation: 'r(θ) = a·(1 + b·cos(6θ)²)',
    description: 'Flat hexagonal plate with star-like extensions, forms at -2°C',
    field: 'Crystallography, Atmospheric Science',
    x: (u, v, p) => {
      const a = p.a || 1;
      const b = p.b || 0.5;
      const theta = u * Math.PI * 2;
      const r = a * (1 + b * Math.pow(Math.cos(3 * theta), 2));
      return r * Math.cos(theta) * (0.8 + 0.2 * Math.cos(v * Math.PI));
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const b = p.b || 0.5;
      const theta = u * Math.PI * 2;
      const r = a * (1 + b * Math.pow(Math.cos(3 * theta), 2));
      return r * Math.sin(theta) * (0.8 + 0.2 * Math.cos(v * Math.PI));
    },
    z: (u, v, p) => {
      const c = p.c || 0.02;
      return c * Math.sin(v * Math.PI);
    }
  },

  // Koch Snowflake (Fractal)
  snowflake_koch: {
    name: 'Koch Snowflake Fractal',
    category: 'Nature & Crystals',
    equation: 'L-system: F → F+F−−F+F',
    description: 'Mathematical fractal with infinite perimeter, finite area - nature approximates this',
    field: 'Fractal Geometry, Mathematics',
    x: (u, v, p) => {
      const a = p.a || 1;
      const iterations = Math.min(Math.floor((p.d || 3)), 5);
      const theta = u * Math.PI * 2;
      const armIndex = Math.floor(u * 6);
      const localU = (u * 6) % 1;
      
      const baseAngle = (armIndex * Math.PI * 2) / 6;
      let r = a * 0.5;
      
      for (let i = 1; i <= iterations; i++) {
        r += (a / Math.pow(3, i)) * Math.sin(Math.pow(4, i) * localU * Math.PI);
      }
      
      r *= (1 - v * 0.15);
      return r * Math.cos(baseAngle + localU * Math.PI / 3);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const iterations = Math.min(Math.floor((p.d || 3)), 5);
      const armIndex = Math.floor(u * 6);
      const localU = (u * 6) % 1;
      
      const baseAngle = (armIndex * Math.PI * 2) / 6;
      let r = a * 0.5;
      
      for (let i = 1; i <= iterations; i++) {
        r += (a / Math.pow(3, i)) * Math.sin(Math.pow(4, i) * localU * Math.PI);
      }
      
      r *= (1 - v * 0.15);
      return r * Math.sin(baseAngle + localU * Math.PI / 3);
    },
    z: (u, v, p) => {
      const c = p.c || 0.01;
      return c * v;
    }
  },

  // Ice Crystal Column
  ice_crystal_column: {
    name: 'Hexagonal Ice Column',
    category: 'Nature & Crystals',
    equation: 'Prism with hexagonal cross-section',
    description: 'Columnar ice crystal - forms at -5°C to -10°C',
    field: 'Crystallography, Glaciology',
    x: (u, v, p) => {
      const a = p.a || 0.5;
      const theta = u * Math.PI * 2;
      const hexR = a * Math.cos(Math.PI / 6) / Math.cos((theta % (Math.PI / 3)) - Math.PI / 6);
      return hexR * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.5;
      const theta = u * Math.PI * 2;
      const hexR = a * Math.cos(Math.PI / 6) / Math.cos((theta % (Math.PI / 3)) - Math.PI / 6);
      return hexR * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 2;
      return b * (v - 0.5);
    }
  },

  // Needle Ice Crystal
  ice_crystal_needle: {
    name: 'Ice Needle Crystal',
    category: 'Nature & Crystals',
    equation: 'r(z) = a·(1 - |z|/h)·cos(6θ)',
    description: 'Long thin needle-shaped ice crystals found in cirrus clouds',
    field: 'Atmospheric Science, Cloud Physics',
    x: (u, v, p) => {
      const a = p.a || 0.1;
      const theta = u * Math.PI * 2;
      const z = (v - 0.5) * 2;
      const taper = 1 - Math.abs(z) * 0.8;
      const hex = 1 + 0.1 * Math.cos(6 * theta);
      return a * taper * hex * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.1;
      const theta = u * Math.PI * 2;
      const z = (v - 0.5) * 2;
      const taper = 1 - Math.abs(z) * 0.8;
      const hex = 1 + 0.1 * Math.cos(6 * theta);
      return a * taper * hex * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 3;
      return b * (v - 0.5);
    }
  },

  // Sector Plate Snowflake
  snowflake_sector_plate: {
    name: 'Sector Plate Crystal',
    category: 'Nature & Crystals',
    equation: 'r(θ) = a·|sin(3θ)|',
    description: 'Hexagonal plate with alternating sector extensions',
    field: 'Crystallography, Snow Science',
    x: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const sector = Math.abs(Math.sin(3 * theta));
      const r = a * (0.5 + 0.5 * sector);
      return r * Math.cos(theta) * (0.9 + 0.1 * v);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const sector = Math.abs(Math.sin(3 * theta));
      const r = a * (0.5 + 0.5 * sector);
      return r * Math.sin(theta) * (0.9 + 0.1 * v);
    },
    z: (u, v, p) => {
      const c = p.c || 0.02;
      return c * (v - 0.5);
    }
  },

  // Fernlike Stellar Dendrite
  snowflake_fernlike: {
    name: 'Fernlike Stellar Dendrite',
    category: 'Nature & Crystals',
    equation: 'r(θ,n) = a·Π(1 + sin(6nθ)/n)',
    description: 'The most intricate snowflake - forms at -15°C with high humidity',
    field: 'Crystallography, Fractal Geometry',
    x: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const armPhase = Math.floor(u * 6) / 6 * Math.PI * 2;
      const localT = (u * 6) % 1;
      
      let r = a * 0.2;
      r += a * 0.6 * localT * (1 + 0.3 * Math.sin(24 * theta));
      
      const sideBranches = 0.2 * Math.sin(36 * theta) * localT * v;
      r += sideBranches;
      
      return r * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      
      let r = a * 0.2;
      const localT = (u * 6) % 1;
      r += a * 0.6 * localT * (1 + 0.3 * Math.sin(24 * theta));
      
      const sideBranches = 0.2 * Math.sin(36 * theta) * localT * v;
      r += sideBranches;
      
      return r * Math.sin(theta);
    },
    z: (u, v, p) => {
      const c = p.c || 0.015;
      const theta = u * Math.PI * 2;
      return c * Math.sin(6 * theta) * v;
    }
  },

  // Capped Column (bullet rosette component)
  ice_capped_column: {
    name: 'Capped Ice Column',
    category: 'Nature & Crystals',
    equation: 'Column with hexagonal plate caps',
    description: 'Columnar crystal with plate extensions at both ends',
    field: 'Cloud Physics, Glaciology',
    x: (u, v, p) => {
      const a = p.a || 0.3;
      const theta = u * Math.PI * 2;
      const z = (v - 0.5) * 2;
      const endCap = Math.abs(z) > 0.7 ? (1 + (Math.abs(z) - 0.7) * 3) : 1;
      const hex = 1 + 0.1 * Math.cos(6 * theta);
      return a * hex * endCap * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.3;
      const theta = u * Math.PI * 2;
      const z = (v - 0.5) * 2;
      const endCap = Math.abs(z) > 0.7 ? (1 + (Math.abs(z) - 0.7) * 3) : 1;
      const hex = 1 + 0.1 * Math.cos(6 * theta);
      return a * hex * endCap * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 1.5;
      return b * (v - 0.5);
    }
  },

  // Bullet Rosette (multiple crystal aggregate)
  ice_bullet_rosette: {
    name: 'Bullet Rosette',
    category: 'Nature & Crystals',
    equation: 'Multiple columns radiating from center',
    description: 'Polycrystalline ice form with multiple bullet-shaped columns',
    field: 'Cloud Microphysics, Atmospheric Science',
    x: (u, v, p) => {
      const a = p.a || 0.8;
      const bulletCount = 6;
      const bulletIndex = Math.floor(u * bulletCount);
      const localU = (u * bulletCount) % 1;
      
      const phi = (bulletIndex * Math.PI * 2) / bulletCount + Math.PI / 12;
      const theta = localU * Math.PI / 3;
      
      const bulletR = a * 0.15 * (1 - v * 0.3);
      const bulletLen = a * v;
      
      return bulletLen * Math.sin(phi) * Math.cos(theta) + bulletR * Math.cos(localU * Math.PI * 2);
    },
    y: (u, v, p) => {
      const a = p.a || 0.8;
      const bulletCount = 6;
      const bulletIndex = Math.floor(u * bulletCount);
      const localU = (u * bulletCount) % 1;
      
      const phi = (bulletIndex * Math.PI * 2) / bulletCount + Math.PI / 12;
      const theta = localU * Math.PI / 3;
      
      const bulletR = a * 0.15 * (1 - v * 0.3);
      const bulletLen = a * v;
      
      return bulletLen * Math.cos(phi) * Math.cos(theta) + bulletR * Math.sin(localU * Math.PI * 2);
    },
    z: (u, v, p) => {
      const a = p.a || 0.8;
      const bulletCount = 6;
      const localU = (u * bulletCount) % 1;
      const theta = localU * Math.PI / 3;
      
      return a * v * Math.sin(theta);
    }
  },

  // Simple Prism Crystal
  ice_simple_prism: {
    name: 'Simple Hexagonal Prism',
    category: 'Nature & Crystals',
    equation: 'Regular hexagonal prism',
    description: 'Basic ice crystal form - pure hexagonal symmetry at -8°C',
    field: 'Crystallography, Materials Science',
    x: (u, v, p) => {
      const a = p.a || 0.6;
      const theta = u * Math.PI * 2;
      const n = 6;
      const r = a / Math.cos(Math.PI / n - ((theta + Math.PI / n) % (2 * Math.PI / n)));
      return r * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.6;
      const theta = u * Math.PI * 2;
      const n = 6;
      const r = a / Math.cos(Math.PI / n - ((theta + Math.PI / n) % (2 * Math.PI / n)));
      return r * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 0.8;
      return b * (v - 0.5);
    }
  },

  // Frost Flower
  frost_flower: {
    name: 'Frost Flower',
    category: 'Nature & Crystals',
    equation: 'Curved petal formation',
    description: 'Ice formations on sea ice surfaces - delicate curved petals',
    field: 'Sea Ice Physics, Polar Science',
    x: (u, v, p) => {
      const a = p.a || 1;
      const petalCount = 5;
      const theta = u * Math.PI * 2;
      const petalPhase = theta * petalCount;
      const petal = Math.pow(Math.abs(Math.sin(petalPhase / 2)), 0.7);
      const r = a * (0.3 + 0.7 * petal) * (1 - v * 0.5);
      const curl = 0.2 * v * Math.sin(petalPhase);
      return (r + curl) * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const petalCount = 5;
      const theta = u * Math.PI * 2;
      const petalPhase = theta * petalCount;
      const petal = Math.pow(Math.abs(Math.sin(petalPhase / 2)), 0.7);
      const r = a * (0.3 + 0.7 * petal) * (1 - v * 0.5);
      const curl = 0.2 * v * Math.sin(petalPhase);
      return (r + curl) * Math.sin(theta);
    },
    z: (u, v, p) => {
      const c = p.c || 0.4;
      const theta = u * Math.PI * 2;
      return c * v * v * Math.cos(5 * theta);
    }
  },

  // Hoarfrost Crystal
  hoarfrost_crystal: {
    name: 'Hoarfrost Crystal',
    category: 'Nature & Crystals',
    equation: 'Feathery needle aggregation',
    description: 'Feathery ice deposits on cold surfaces - soft fuzzy appearance',
    field: 'Meteorology, Surface Physics',
    x: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const featherCount = 12;
      const feather = 0.3 * Math.sin(featherCount * theta) * v;
      const base = a * 0.3 * (1 + 0.5 * Math.sin(6 * theta));
      return (base + feather) * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const featherCount = 12;
      const feather = 0.3 * Math.sin(featherCount * theta) * v;
      const base = a * 0.3 * (1 + 0.5 * Math.sin(6 * theta));
      return (base + feather) * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 0.8;
      const theta = u * Math.PI * 2;
      return b * v * (1 + 0.2 * Math.sin(12 * theta));
    }
  },

  // Rime Ice Formation
  rime_ice: {
    name: 'Rime Ice Formation',
    category: 'Nature & Crystals',
    equation: 'Supercooled droplet accretion',
    description: 'Rough ice formed from supercooled fog droplets freezing on contact',
    field: 'Aviation Meteorology, Glaciology',
    x: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const roughness = 0.15 * Math.sin(17 * theta) * Math.cos(13 * v * Math.PI);
      const r = a * (0.5 + 0.5 * v) * (1 + roughness);
      return r * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 1;
      const theta = u * Math.PI * 2;
      const roughness = 0.15 * Math.sin(17 * theta) * Math.cos(13 * v * Math.PI);
      const r = a * (0.5 + 0.5 * v) * (1 + roughness);
      return r * Math.sin(theta);
    },
    z: (u, v, p) => {
      const b = p.b || 0.6;
      const theta = u * Math.PI * 2;
      return b * (v - 0.5) * (1 + 0.1 * Math.sin(11 * theta));
    }
  },

  // Graupel (snow pellet)
  graupel_pellet: {
    name: 'Graupel Snow Pellet',
    category: 'Nature & Crystals',
    equation: 'Rime-coated sphere',
    description: 'Snowflake core heavily coated with rime ice - soft hail',
    field: 'Precipitation Physics, Meteorology',
    x: (u, v, p) => {
      const a = p.a || 0.8;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const bumps = 0.1 * Math.sin(8 * theta) * Math.sin(6 * phi);
      const r = a * (1 + bumps);
      return r * Math.sin(phi) * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.8;
      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const bumps = 0.1 * Math.sin(8 * theta) * Math.sin(6 * phi);
      const r = a * (1 + bumps);
      return r * Math.sin(phi) * Math.sin(theta);
    },
    z: (u, v, p) => {
      const a = p.a || 0.8;
      const phi = v * Math.PI;
      return a * Math.cos(phi);
    }
  },

  // Diamond Dust (ice fog crystals)
  diamond_dust: {
    name: 'Diamond Dust Crystal',
    category: 'Nature & Crystals',
    equation: 'Tiny plate with minimal facets',
    description: 'Extremely small ice crystals floating in very cold air - creates light pillars',
    field: 'Atmospheric Optics, Polar Science',
    x: (u, v, p) => {
      const a = p.a || 0.3;
      const theta = u * Math.PI * 2;
      const r = a * (1 + 0.15 * Math.cos(6 * theta));
      return r * Math.cos(theta);
    },
    y: (u, v, p) => {
      const a = p.a || 0.3;
      const theta = u * Math.PI * 2;
      const r = a * (1 + 0.15 * Math.cos(6 * theta));
      return r * Math.sin(theta);
    },
    z: (u, v, p) => {
      const c = p.c || 0.02;
      return c * Math.sin(v * Math.PI);
    }
  }
};

// Export shape names for registration
export const ICE_CRYSTAL_SHAPE_NAMES = Object.keys(ICE_CRYSTAL_SHAPES);

// Create a category entry
export const ICE_CRYSTAL_CATEGORY = {
  id: 'ice_crystals',
  name: 'Ice Crystals & Snowflakes ❄️',
  icon: '❄️',
  description: 'Nature\'s geometric masterpieces - 6-fold symmetric ice crystal formations, Koch snowflake fractals, dendrites, stellar plates, and polar ice structures.',
  shapes: ICE_CRYSTAL_SHAPE_NAMES
};

console.log(`❄️ Loaded ${ICE_CRYSTAL_SHAPE_NAMES.length} ice crystal and snowflake shapes`);
