/**
 * PROCEDURAL PATTERN GENERATION - UPGRADED FOR 4K/HD RENDERING
 * Supports HD (1920x1080), 4K UHD (3840x2160), and optimized detail rendering
 * Enhanced contrast and detail visibility for all procedural textures
 * 
 * SEAMLESS TILING: All patterns now use normalized coordinates with 2π wrapping
 * to ensure seamless tiling when textures are wrapped around 3D objects.
 */

import * as THREE from 'three';

// Resolution presets
export const TEXTURE_RESOLUTIONS = {
  SD: 512,      // Standard definition
  HD: 1024,     // High definition
  FHD: 2048,    // Full HD
  '4K': 4096    // 4K UHD
} as const;

export type TextureResolution = keyof typeof TEXTURE_RESOLUTIONS;

// ============================================================================
// SEAMLESS TILING UTILITIES
// ============================================================================

const TWO_PI = Math.PI * 2;

/**
 * Convert pixel coordinates to seamlessly tileable normalized coordinates
 * This ensures patterns wrap perfectly at texture boundaries
 */
function seamlessCoord(pixel: number, size: number, frequency: number = 1): number {
  return (pixel / size) * TWO_PI * frequency;
}

/**
 * Generate seamlessly tileable sine wave
 */
function seamlessSin(x: number, y: number, size: number, freqX: number, freqY: number): number {
  return Math.sin(seamlessCoord(x, size, freqX)) * Math.cos(seamlessCoord(y, size, freqY));
}

/**
 * Generate seamlessly tileable noise value (using multiple frequency overlays)
 */
function seamlessNoise(x: number, y: number, size: number, baseFreq: number = 4): number {
  const u = seamlessCoord(x, size, baseFreq);
  const v = seamlessCoord(y, size, baseFreq);
  return (Math.sin(u) * Math.cos(v) + Math.sin(u * 2.3) * Math.cos(v * 1.7)) * 0.5;
}

// ============================================================================
// NEON GLOW PATTERNS - 12 Pure Solid Glowing Colors
// Premium category - SOLID COLORS for authentic neon glow effect
// NO complex patterns - just pure, intense glowing colors
// ============================================================================

/**
 * Generate neon pink pattern - SOLID hot pink glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonPinkPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid hot pink - full intensity glow
      data[idx] = 255;     // R: Full red
      data[idx + 1] = 20;  // G: Minimal
      data[idx + 2] = 147; // B: Strong pink tint
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon blue pattern - SOLID electric blue glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonBluePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid electric blue - full intensity glow
      data[idx] = 0;       // R: None
      data[idx + 1] = 191; // G: Strong cyan tint
      data[idx + 2] = 255; // B: Full blue
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon green pattern - SOLID toxic/matrix green glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonGreenPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid toxic green - full intensity glow
      data[idx] = 57;      // R: Slight warmth
      data[idx + 1] = 255; // G: Full green
      data[idx + 2] = 20;  // B: Minimal
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon orange pattern - SOLID fire orange glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonOrangePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid fire orange - full intensity glow
      data[idx] = 255;     // R: Full red
      data[idx + 1] = 102; // G: Orange tint
      data[idx + 2] = 0;   // B: None
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon purple pattern - SOLID UV blacklight purple glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonPurplePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid UV purple - full intensity glow
      data[idx] = 148;     // R: Purple red
      data[idx + 1] = 0;   // G: None
      data[idx + 2] = 211; // B: Strong purple
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon cyan pattern - SOLID cyberpunk cyan glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonCyanPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid cyan - full intensity glow
      data[idx] = 0;       // R: None
      data[idx + 1] = 255; // G: Full green
      data[idx + 2] = 255; // B: Full blue
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon red pattern - SOLID danger red glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonRedPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid red - full intensity glow
      data[idx] = 255;     // R: Full red
      data[idx + 1] = 0;   // G: None
      data[idx + 2] = 0;   // B: None
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon yellow pattern - SOLID electric yellow glow
 * Pure solid color for authentic neon tube appearance
 */
export function generateNeonYellowPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid yellow - full intensity glow
      data[idx] = 255;     // R: Full red
      data[idx + 1] = 255; // G: Full green
      data[idx + 2] = 0;   // B: None
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon rainbow pattern - Smooth gradient rainbow
 * Seamless gradient from red through spectrum back to red
 */
export function generateNeonRainbowPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamless rainbow gradient based on position
      const hue = (x / size) * TWO_PI;
      
      // HSL to RGB conversion for full spectrum
      data[idx] = Math.floor((Math.sin(hue) * 0.5 + 0.5) * 255);
      data[idx + 1] = Math.floor((Math.sin(hue + TWO_PI / 3) * 0.5 + 0.5) * 255);
      data[idx + 2] = Math.floor((Math.sin(hue + TWO_PI * 2 / 3) * 0.5 + 0.5) * 255);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon grid pattern - Tron-style glowing grid
 * Grid lines with glow for that classic Tron look
 */
export function generateNeonGridPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const gridSize = 8;
  const cellSize = size / gridSize;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Grid line detection
      const xMod = x % cellSize;
      const yMod = y % cellSize;
      const lineWidth = cellSize * 0.08;
      
      // Distance to nearest grid line
      const xDist = Math.min(xMod, cellSize - xMod);
      const yDist = Math.min(yMod, cellSize - yMod);
      const lineDist = Math.min(xDist, yDist);
      
      // Glow falloff
      const intensity = lineDist < lineWidth ? 1.0 : Math.exp(-lineDist / (lineWidth * 3));
      
      // Cyan Tron grid color
      data[idx] = Math.floor(0 + intensity * 60);
      data[idx + 1] = Math.floor(180 * intensity + 40);
      data[idx + 2] = Math.floor(255 * intensity);
      data[idx + 3] = Math.floor(50 + intensity * 205);
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon pulse pattern - SOLID magenta glow
 * Pure solid color for authentic neon appearance
 */
export function generateNeonPulsePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Pure solid magenta
      data[idx] = 255;     // R: Full
      data[idx + 1] = 0;   // G: None
      data[idx + 2] = 255; // B: Full
      data[idx + 3] = 255; // Full opacity
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon hexagon grid pattern - Cyberpunk honeycomb
 * HIGH CONTRAST: Dark black background with bright glowing hex edges
 */
export function generateNeonHexagonGridPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const hexSize = size / 8; // BIGGER hexagons for visibility
  const sqrt3 = Math.sqrt(3);
  const lineWidth = hexSize * 0.1; // THICKER lines
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Convert to hex grid coordinates
      const col = x / (hexSize * 1.5);
      const row = y / (hexSize * sqrt3);
      
      // Offset every other column
      const offset = Math.floor(col) % 2 === 0 ? 0 : 0.5;
      const hexY = row - offset;
      
      // Find center of nearest hexagon
      const nearestCol = Math.round(col);
      const nearestRow = Math.round(hexY);
      const centerX = nearestCol * hexSize * 1.5;
      const centerY = (nearestRow + (nearestCol % 2 === 0 ? 0 : 0.5)) * hexSize * sqrt3;
      
      // Distance from center
      const dx = Math.abs(x - centerX);
      const dy = Math.abs(y - centerY);
      
      // Hexagonal distance approximation
      const hexDist = Math.max(dx * 2 / 3, dx / 3 + dy / sqrt3) / hexSize;
      
      // Edge detection (edges are at hexDist ≈ 0.5)
      const edgeDist = Math.abs(hexDist - 0.48) * hexSize;
      
      // Sharp edge with soft glow
      const coreEdge = edgeDist < lineWidth ? 1.0 : 0;
      const glowEdge = Math.exp(-edgeDist / (lineWidth * 3));
      const intensity = Math.max(coreEdge, glowEdge * 0.6);
      
      // HOT PINK hexagon on BLACK background
      // Full intensity = bright pink, zero = pure black
      data[idx] = Math.floor(255 * intensity);     // R: Full pink
      data[idx + 1] = Math.floor(50 * intensity);  // G: Minimal
      data[idx + 2] = Math.floor(200 * intensity); // B: Pink tint
      data[idx + 3] = 255; // FULL OPACITY - no transparency!
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon circuit board pattern - Tech/cyberpunk circuits
 * HIGH CONTRAST: Dark PCB green background with bright circuit traces
 */
export function generateNeonCircuitPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const gridSize = 12; // Fewer, larger cells for visibility
  const cellSize = size / gridSize;
  const lineWidth = cellSize * 0.15; // THICKER traces
  const nodeRadius = lineWidth * 2.5; // BIGGER nodes
  
  // Deterministic pseudo-random based on position
  const hash = (x: number, y: number) => {
    const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
    return h - Math.floor(h);
  };
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const localX = x % cellSize;
      const localY = y % cellSize;
      
      let intensity = 0;
      let glowIntensity = 0;
      
      // Horizontal traces (based on cell hash)
      if (hash(cellX, cellY) > 0.35) {
        const centerY = cellSize / 2;
        const distY = Math.abs(localY - centerY);
        if (distY < lineWidth) {
          intensity = Math.max(intensity, 1.0);
          glowIntensity = Math.max(glowIntensity, 1.0 - distY / lineWidth);
        } else if (distY < lineWidth * 3) {
          glowIntensity = Math.max(glowIntensity, Math.exp(-(distY - lineWidth) / lineWidth));
        }
      }
      
      // Vertical traces (based on different hash)
      if (hash(cellX + 100, cellY + 100) > 0.35) {
        const centerX = cellSize / 2;
        const distX = Math.abs(localX - centerX);
        if (distX < lineWidth) {
          intensity = Math.max(intensity, 1.0);
          glowIntensity = Math.max(glowIntensity, 1.0 - distX / lineWidth);
        } else if (distX < lineWidth * 3) {
          glowIntensity = Math.max(glowIntensity, Math.exp(-(distX - lineWidth) / lineWidth));
        }
      }
      
      // L-shaped corner traces
      if (hash(cellX + 50, cellY) > 0.5) {
        const cornerDist = Math.min(localX, localY);
        if (cornerDist < lineWidth * 2) {
          intensity = Math.max(intensity, 0.9);
        }
      }
      
      // Corner nodes (bright solder points)
      const corners = [[0, 0], [cellSize, 0], [0, cellSize], [cellSize, cellSize], [cellSize/2, cellSize/2]];
      for (const [cx, cy] of corners) {
        const dist = Math.sqrt((localX - cx) ** 2 + (localY - cy) ** 2);
        if (dist < nodeRadius) {
          intensity = Math.max(intensity, 1.0);
          glowIntensity = Math.max(glowIntensity, 1.0 - dist / nodeRadius);
        }
      }
      
      // Via holes (small bright circles)
      if (hash(cellX * 2, cellY * 3) > 0.7) {
        const viaDist = Math.sqrt((localX - cellSize/3) ** 2 + (localY - cellSize/3) ** 2);
        if (viaDist < lineWidth) {
          intensity = 1.0;
          glowIntensity = 1.0;
        }
      }
      
      // ELECTRIC GREEN on DARK PCB BACKGROUND
      // Background is dark green, traces are bright neon green
      const bgR = 5, bgG = 20, bgB = 10;
      const traceR = 50, traceG = 255, traceB = 100;
      
      data[idx] = Math.floor(bgR + (traceR - bgR) * intensity + glowIntensity * 30);
      data[idx + 1] = Math.floor(bgG + (traceG - bgG) * intensity);
      data[idx + 2] = Math.floor(bgB + (traceB - bgB) * intensity + glowIntensity * 50);
      data[idx + 3] = 255; // FULL OPACITY
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon scanlines pattern - Retro CRT effect
 * HIGH CONTRAST: Dark background with bright horizontal scan lines
 */
export function generateNeonScanlinesPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const lineSpacing = size / 32; // BIGGER spacing for visibility
  const lineWidth = lineSpacing * 0.35; // Bright core line
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Distance to nearest scanline center
      const lineDist = Math.abs((y % lineSpacing) - lineSpacing / 2);
      
      // Sharp core with soft glow
      const core = lineDist < lineWidth ? 1.0 : 0;
      const glow = Math.exp(-lineDist / (lineWidth * 2));
      const intensity = Math.max(core, glow * 0.5);
      
      // Slight horizontal variation for authenticity
      const flicker = 0.9 + 0.1 * Math.sin(x * 0.02);
      const finalIntensity = intensity * flicker;
      
      // AMBER/ORANGE on BLACK - classic CRT look
      data[idx] = Math.floor(255 * finalIntensity);
      data[idx + 1] = Math.floor(150 * finalIntensity);
      data[idx + 2] = Math.floor(20 * finalIntensity);
      data[idx + 3] = 255; // FULL OPACITY
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon spiral pattern - Hypnotic spinning energy
 * HIGH CONTRAST: Dark background with bright glowing spiral arms
 */
export function generateNeonSpiralPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const centerX = size / 2;
  const centerY = size / 2;
  const numArms = 5; // 5 arms for visible star pattern
  const armWidth = 0.25; // WIDER arms for visibility
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Spiral equation: angle offset based on distance (tighter spiral)
      const spiralAngle = angle - dist / (size * 0.06);
      
      // Find distance to nearest spiral arm
      const normalizedAngle = ((spiralAngle % (TWO_PI / numArms)) + TWO_PI / numArms) % (TWO_PI / numArms);
      const armDist = Math.abs(normalizedAngle - (Math.PI / numArms));
      
      // Sharp core with glow
      const core = armDist < armWidth * 0.5 ? 1.0 : 0;
      const glow = Math.exp(-armDist / (armWidth * 1.5));
      const intensity = Math.max(core, glow * 0.6);
      
      // Smooth radial fade (visible across most of texture)
      const radialFade = Math.min(1, dist / (size * 0.05)) * Math.max(0, 1 - dist / (size * 0.48));
      const finalIntensity = intensity * radialFade;
      
      // PURPLE/VIOLET spiral on BLACK
      data[idx] = Math.floor(200 * finalIntensity);
      data[idx + 1] = Math.floor(50 * finalIntensity);
      data[idx + 2] = Math.floor(255 * finalIntensity);
      data[idx + 3] = 255; // FULL OPACITY
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon laser grid pattern - Intense laser beams in 3D space
 * HIGH CONTRAST: Dark background with bright crossing laser beams
 */
export function generateNeonLaserGridPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const gridSpacing = size / 8; // BIGGER grid for visibility
  const lineWidth = gridSpacing * 0.08; // THICKER beams
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Horizontal and vertical grid lines
      const horiz = Math.abs(y % gridSpacing - gridSpacing / 2);
      const vert = Math.abs(x % gridSpacing - gridSpacing / 2);
      
      // Diagonal lines (creates X pattern in each cell)
      const diag1 = Math.abs((x + y) % gridSpacing - gridSpacing / 2);
      const diag2 = Math.abs((x - y + size) % gridSpacing - gridSpacing / 2);
      
      const minDist = Math.min(diag1, diag2, horiz, vert);
      
      // Sharp laser core with bloom glow
      const core = minDist < lineWidth ? 1.0 : 0;
      const innerGlow = Math.exp(-minDist / (lineWidth * 2.5));
      const intensity = Math.max(core, innerGlow * 0.5);
      
      // Intersection points glow brighter
      const intersectionBoost = (horiz < lineWidth * 2 && vert < lineWidth * 2) ? 0.3 : 0;
      const finalIntensity = Math.min(1.0, intensity + intersectionBoost);
      
      // HOT RED laser on BLACK background
      data[idx] = Math.floor(255 * finalIntensity);
      data[idx + 1] = Math.floor(30 * finalIntensity);
      data[idx + 2] = Math.floor(50 * finalIntensity);
      data[idx + 3] = 255; // FULL OPACITY
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon constellation pattern - Connected star points
 * HIGH CONTRAST: Dark space background with bright stars and connecting lines
 * OPTIMIZED: Pre-computes line segments to avoid O(n^2) per-pixel checks
 */
export function generateNeonConstellationPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  // Generate stars with golden angle distribution
  const stars: Array<{x: number, y: number, brightness: number}> = [];
  const numStars = 40; // Reduced for performance while maintaining visual density
  for (let i = 0; i < numStars; i++) {
    const angle = (i / numStars) * TWO_PI * 3.7; // Golden angle distribution
    const radius = (0.15 + (i / numStars) * 0.8) * size / 2;
    const brightness = 0.6 + Math.sin(i * 1.5) * 0.4;
    stars.push({
      x: size / 2 + Math.cos(angle) * radius,
      y: size / 2 + Math.sin(angle) * radius,
      brightness
    });
  }
  
  // Pre-compute line segments ONCE (not per-pixel)
  const lines: Array<{x1: number, y1: number, x2: number, y2: number, len: number}> = [];
  const maxDist = size * 0.25;
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      const dx = stars[j].x - stars[i].x;
      const dy = stars[j].y - stars[i].y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len < maxDist) {
        lines.push({
          x1: stars[i].x, y1: stars[i].y,
          x2: stars[j].x, y2: stars[j].y,
          len
        });
      }
    }
  }
  
  // First pass: fill with dark space background
  for (let i = 0; i < size * size * 4; i += 4) {
    data[i] = 5;      // Very dark blue-black
    data[i + 1] = 5;
    data[i + 2] = 15;
    data[i + 3] = 255;
  }
  
  // Draw lines using Bresenham-style approach (draw TO the texture, not check FROM)
  const lineWidth = 3;
  const glowRadius = 12;
  for (const line of lines) {
    const steps = Math.ceil(line.len);
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const cx = Math.round(line.x1 + (line.x2 - line.x1) * t);
      const cy = Math.round(line.y1 + (line.y2 - line.y1) * t);
      
      // Draw glow around line point
      for (let dy = -glowRadius; dy <= glowRadius; dy++) {
        for (let dx = -glowRadius; dx <= glowRadius; dx++) {
          const px = cx + dx;
          const py = cy + dy;
          if (px >= 0 && px < size && py >= 0 && py < size) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist <= glowRadius) {
              const idx = (py * size + px) * 4;
              const intensity = dist < lineWidth ? 0.5 : Math.exp(-dist / 4) * 0.3;
              const current = data[idx] / 180;
              const newVal = Math.max(current, intensity);
              data[idx] = Math.floor(180 * newVal);
              data[idx + 1] = Math.floor(200 * newVal);
              data[idx + 2] = Math.floor(255 * newVal);
            }
          }
        }
      }
    }
  }
  
  // Draw stars on top (brighter, with glow)
  const starGlowRadius = 30;
  for (const star of stars) {
    for (let dy = -starGlowRadius; dy <= starGlowRadius; dy++) {
      for (let dx = -starGlowRadius; dx <= starGlowRadius; dx++) {
        const px = Math.round(star.x) + dx;
        const py = Math.round(star.y) + dy;
        if (px >= 0 && px < size && py >= 0 && py < size) {
          const dist = Math.sqrt(dx * dx + dy * dy);
          const idx = (py * size + px) * 4;
          
          // Star core and glow
          const coreIntensity = dist < 8 ? 1.0 : 0;
          const glowIntensity = Math.exp(-dist / 15) * star.brightness;
          const intensity = Math.max(coreIntensity, glowIntensity);
          
          const current = data[idx] / 180;
          const newVal = Math.max(current, intensity);
          data[idx] = Math.floor(180 * newVal);
          data[idx + 1] = Math.floor(200 * newVal);
          data[idx + 2] = Math.floor(255 * newVal);
        }
      }
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate neon plasma fusion pattern - Swirling plasma energy
 * HIGH CONTRAST: Dark background with bright swirling plasma tendrils
 */
export function generateNeonPlasmaFusionPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const centerX = size / 2;
  const centerY = size / 2;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      // Multiple plasma tendrils swirling outward
      const numTendrils = 4;
      const spiralTightness = 0.015;
      const spiralAngle = angle - dist * spiralTightness;
      
      // Create tendril pattern
      const tendrilAngle = ((spiralAngle % (TWO_PI / numTendrils)) + TWO_PI / numTendrils) % (TWO_PI / numTendrils);
      const tendrilDist = Math.abs(tendrilAngle - (Math.PI / numTendrils));
      const tendrilWidth = 0.3 + 0.2 * Math.sin(dist * 0.02); // Varying width
      
      // Core intensity
      const tendrilCore = tendrilDist < tendrilWidth * 0.3 ? 1.0 : 0;
      const tendrilGlow = Math.exp(-tendrilDist / tendrilWidth) * 0.8;
      
      // Add turbulence/noise for organic plasma look
      const turbulence = Math.sin(x * 0.03 + y * 0.02) * Math.cos(y * 0.04 - x * 0.01);
      const noiseIntensity = 0.3 + turbulence * 0.2;
      
      // Radial fade - plasma extends from center
      const radialFade = Math.max(0, 1 - dist / (size * 0.5));
      
      // Central core glow
      const coreGlow = Math.exp(-dist / (size * 0.15));
      
      // Combine effects
      let intensity = Math.max(tendrilCore, tendrilGlow) * radialFade + coreGlow * 0.7;
      intensity = intensity * (0.7 + noiseIntensity);
      intensity = Math.min(1.0, intensity);
      
      // HOT WHITE-BLUE-PURPLE plasma colors on BLACK
      // Hotter in center (white), cooler at edges (blue-purple)
      const heat = coreGlow;
      data[idx] = Math.floor((180 + 75 * heat) * intensity);     // R: More red = hotter
      data[idx + 1] = Math.floor((100 + 120 * heat) * intensity); // G
      data[idx + 2] = Math.floor(255 * intensity);                // B: Always blue
      data[idx + 3] = 255; // FULL OPACITY
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

/**
 * Generate Voronoi cellular pattern with enhanced detail
 * UPGRADED: 2K default for vibrant, high-resolution rendering
 */
export function generateVoronoiPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const points: Array<[number, number]> = [];
  // Use a grid-seeded layout so cells are uniformly distributed and texture tiles cleanly.
  // gridN x gridN = gridN² cells → dense, fine-grained pattern when mapped to a mesh.
  const gridN = 14; // 196 cells per tile
  const cellW = size / gridN;
  const cellH = size / gridN;
  // Deterministic jitter using a hash so every call produces the same texture
  const hashJitter = (ix: number, iy: number, salt: number): number => {
    const h = Math.sin(ix * 127.1 + iy * 311.7 + salt * 74.3) * 43758.5453;
    return h - Math.floor(h);
  };
  for (let gy = 0; gy < gridN; gy++) {
    for (let gx = 0; gx < gridN; gx++) {
      const px = (gx + 0.1 + hashJitter(gx, gy, 0) * 0.8) * cellW;
      const py = (gy + 0.1 + hashJitter(gx, gy, 1) * 0.8) * cellH;
      points.push([px, py]);
    }
  }
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Find closest and second closest points for edge detection
      let minDist = Infinity;
      let secondMinDist = Infinity;
      let closestIdx = 0;
      
      for (let i = 0; i < points.length; i++) {
        const dx = x - points[i][0];
        const dy = y - points[i][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < minDist) {
          secondMinDist = minDist;
          minDist = dist;
          closestIdx = i;
        } else if (dist < secondMinDist) {
          secondMinDist = dist;
        }
      }
      
      // ENHANCED: Edge detection for better detail
      const edgeDist = secondMinDist - minDist;
      const isEdge = edgeDist < size * 0.015; // Adaptive edge threshold
      
      // ENHANCED: Higher contrast color mapping
      const cellValue = 100 + Math.sin(minDist * 0.05) * 120; // Increased amplitude
      const edgeValue = isEdge ? 30 : cellValue; // Sharp edges
      
      data[idx] = edgeValue;
      data[idx + 1] = edgeValue * 0.9;
      data[idx + 2] = edgeValue * 1.1;
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Tile the texture 3× in each UV direction so cells appear proportional on mesh surfaces
  texture.repeat.set(3, 3);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate Perlin-style noise pattern with enhanced detail
 * UPGRADED: 2K default, 8 octaves, vibrant contrast
 */
export function generatePerlinNoisePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // ENHANCED: Multi-octave noise with 8 octaves for better detail
      const nx = x / size;
      const ny = y / size;
      let value = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxAmplitude = 0;
      
      for (let octave = 0; octave < 8; octave++) { // Increased from 5 to 8
        value += Math.sin(nx * frequency * 20) * Math.cos(ny * frequency * 15) * amplitude;
        maxAmplitude += amplitude;
        frequency *= 2.1; // Slightly adjusted for better variation
        amplitude *= 0.48;
      }
      
      // ENHANCED: Normalize and increase contrast
      value = value / maxAmplitude;
      const color = Math.floor((value + 1) * 127.5);
      
      // ENHANCED: Increased color variation and contrast
      data[idx] = Math.min(255, color * 1.2);
      data[idx + 1] = Math.min(255, color * 1.0);
      data[idx + 2] = Math.min(255, color * 0.8);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate fractal pattern (Julia set) with enhanced detail
 * UPGRADED: 4K support, increased iterations, smooth coloring
 */
export function generateFractalPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const maxIterations = 150; // UPGRADED: Increased from 50 for more detail
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Map to complex plane with better zoom
      const zx = (x / size - 0.5) * 3;
      const zy = (y / size - 0.5) * 3;
      
      let cx = zx;
      let cy = zy;
      let iteration = 0;
      
      while (cx * cx + cy * cy < 4 && iteration < maxIterations) {
        const xtemp = cx * cx - cy * cy + zx;
        cy = 2 * cx * cy + zy;
        cx = xtemp;
        iteration++;
      }
      
      // ENHANCED: Smooth coloring algorithm for better gradients
      let smoothIter = iteration;
      if (iteration < maxIterations) {
        const log_zn = Math.log(cx * cx + cy * cy) / 2;
        const nu = Math.log(log_zn / Math.log(2)) / Math.log(2);
        smoothIter = iteration + 1 - nu;
      }
      
      const t = smoothIter / maxIterations;
      
      // ENHANCED: Better color mapping with higher contrast
      data[idx] = Math.floor(Math.sin(t * Math.PI * 2) * 127 + 128);
      data[idx + 1] = Math.floor(Math.sin(t * Math.PI * 2 + 2) * 127 + 128);
      data[idx + 2] = Math.floor(Math.sin(t * Math.PI * 2 + 4) * 127 + 128);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate hexagonal honeycomb pattern
 * UPGRADED: Smaller hexagons, smoother filtering
 */
export function generateHexagonalPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const hexSize = 10; // Smaller hexagons for finer detail
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Hexagonal grid math
      const q = (x * 2/3) / hexSize;
      const r = ((-x / 3) + (Math.sqrt(3)/3) * y) / hexSize;
      
      const qFloor = Math.floor(q);
      const rFloor = Math.floor(r);
      
      const qFrac = q - qFloor;
      const rFrac = r - rFloor;
      
      // Smooth edge detection
      const edgeDist = Math.min(qFrac, 1-qFrac, rFrac, 1-rFrac);
      const edgeSmooth = Math.min(1, edgeDist * 15);
      const color = 50 + 150 * edgeSmooth;
      
      data[idx] = Math.min(255, color * 1.2);
      data[idx + 1] = Math.min(255, color * 0.9);
      data[idx + 2] = Math.min(255, color * 0.6);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate Truchet tiles pattern
 * UPGRADED: Smaller tiles, smoother filtering for curved surfaces
 */
export function generateTruchetPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const tileSize = 8; // Much smaller tiles for finer detail on curved surfaces
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const tileX = Math.floor(x / tileSize);
      const tileY = Math.floor(y / tileSize);
      const localX = x % tileSize;
      const localY = y % tileSize;
      
      // Random tile orientation based on position
      const random = (Math.sin(tileX * 12.9898 + tileY * 78.233) * 43758.5453) % 1;
      const rotation = Math.floor(random * 4);
      
      // Quarter circle pattern with smoother edges
      const dist = Math.sqrt(localX * localX + localY * localY);
      const arcCenter = tileSize * 0.4;
      const arcWidth = tileSize * 0.15;
      const distFromArc = Math.abs(dist - arcCenter);
      const smoothness = Math.max(0, 1 - distFromArc / arcWidth);
      
      const baseColor = 80;
      const arcColor = 220;
      const color = baseColor + (arcColor - baseColor) * smoothness;
      
      data[idx] = color;
      data[idx + 1] = color * 0.7;
      data[idx + 2] = color * 0.9;
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate cellular/biological pattern
 * UPGRADED: Finer cells, smoother filtering
 */
export function generateCellularPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Increased from 20 to 48 so each texture tile has 48 biological cell cycles.
      // Combined with texture.repeat.set(3,3) below, this gives 144 cells visible on a mesh.
      const nx = x / size * 48;
      const ny = y / size * 48;
      
      const value = Math.sin(nx) * Math.cos(ny) + 
                    Math.sin(nx * 2) * Math.cos(ny * 2) * 0.5 +
                    Math.sin(nx * 4) * Math.cos(ny * 4) * 0.25 +
                    Math.sin(nx * 8) * Math.cos(ny * 8) * 0.125;
      
      const color = Math.floor((value + 2.5) * 55);
      data[idx] = Math.min(255, color * 0.8);
      data[idx + 1] = Math.min(255, color * 1.2);
      data[idx + 2] = Math.min(255, color * 0.9);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // Tile 3× so cell walls appear proportional on any mesh surface
  texture.repeat.set(3, 3);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate Mandelbrot set pattern
 */
export function generateMandelbrotPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const maxIterations = 100;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const cx = (x / size - 0.5) * 3.5 - 0.5;
      const cy = (y / size - 0.5) * 3;
      
      let zx = 0;
      let zy = 0;
      let iteration = 0;
      
      while (zx * zx + zy * zy < 4 && iteration < maxIterations) {
        const xtemp = zx * zx - zy * zy + cx;
        zy = 2 * zx * zy + cy;
        zx = xtemp;
        iteration++;
      }
      
      const color = (iteration / maxIterations) * 255;
      data[idx] = color * 1.2;
      data[idx + 1] = color * 0.6;
      data[idx + 2] = color;
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate Fibonacci spiral pattern
 */
export function generateFibonacciPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const center = size / 2;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const dx = x - center;
      const dy = y - center;
      const r = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);
      
      const spiral = Math.sin(r * 0.2 - angle * 5) * 0.5 + 0.5;
      const color = Math.floor(spiral * 255);
      
      data[idx] = color;
      data[idx + 1] = color * 1.1;
      data[idx + 2] = color * 0.7;
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate Penrose tiling pattern
 */
export function generatePenrosePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const nx = x / size * 20;
      const ny = y / size * 20;
      
      // Approximate Penrose with 5-fold symmetry
      let value = 0;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        const rotX = nx * Math.cos(angle) - ny * Math.sin(angle);
        const rotY = nx * Math.sin(angle) + ny * Math.cos(angle);
        value += Math.sin(rotX) * Math.cos(rotY);
      }
      
      const color = Math.floor((value + 5) * 25);
      data[idx] = color;
      data[idx + 1] = color * 0.6;
      data[idx + 2] = color * 1.1;
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate Delaunay triangulation pattern
 * UPGRADED: Smaller triangles, smoother filtering
 */
export function generateDelaunayPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  const triangleSize = 12; // Smaller triangles for finer detail
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Simplified triangulation grid
      const triX = Math.floor(x / triangleSize);
      const triY = Math.floor(y / triangleSize);
      const localX = x % triangleSize;
      const localY = y % triangleSize;
      
      // Smooth edge detection
      const edgeDist = Math.min(localX, localY, triangleSize * 0.5 - Math.abs(localX + localY - triangleSize * 0.5));
      const edgeSmooth = Math.min(1, edgeDist / 2);
      const color = 200 - 100 * edgeSmooth;
      
      data[idx] = Math.min(255, color * 0.7);
      data[idx + 1] = Math.min(255, color);
      data[idx + 2] = Math.min(255, color * 1.2);
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

// ============================================================================
// METALLIC PATTERNS
// ============================================================================

/**
 * Generate brushed gold pattern with rich 24K gold tones
 * Authentic gold has deep warm tones, not bright yellow
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateGoldPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 6);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 12);
      
      // Brushed metal streaks - seamlessly tiled
      const streak = Math.sin(u + v * 0.17) * 0.15 + 0.85;
      const grain = Math.sin(u2) * 0.05;
      
      const variation = streak + grain;
      
      // Rich 24K gold - deeper, warmer tones (not washed out yellow)
      const baseR = 212;
      const baseG = 175;
      const baseB = 55;
      
      data[idx] = Math.max(160, Math.min(235, Math.floor(baseR * variation)));
      data[idx + 1] = Math.max(130, Math.min(195, Math.floor(baseG * variation)));
      data[idx + 2] = Math.max(35, Math.min(85, Math.floor(baseB * variation)));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = 16;
  return texture;
}

/**
 * Generate polished silver pattern with cool metallic tones
 * Real silver has subtle blue-gray undertones, not pure white
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateSilverPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 4);
      const v = seamlessCoord(y, size, 1);
      const u2 = seamlessCoord(x, size, 8);
      const v2 = seamlessCoord(y, size, 2);
      
      // Subtle brushed streaks - seamlessly tiled
      const streak = Math.sin(u + v * 0.15) * 0.1 + 0.9;
      const grain = Math.sin(u2 - v2 * 0.2) * 0.05;
      
      const variation = streak + grain;
      
      // Authentic silver - cool gray with subtle blue undertone (NOT pure white)
      const baseR = 175;
      const baseG = 180;
      const baseB = 190;
      
      data[idx] = Math.max(140, Math.min(210, Math.floor(baseR * variation)));
      data[idx + 1] = Math.max(145, Math.min(215, Math.floor(baseG * variation)));
      data[idx + 2] = Math.max(155, Math.min(225, Math.floor(baseB * variation)));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate copper pattern with warm reddish-brown tones
 * Real copper has deep warm tones with subtle patina hints
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateCopperPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 5);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 1);
      const v2 = seamlessCoord(y, size, 1);
      
      // Subtle surface variation - seamlessly tiled
      const streak = Math.sin(u + v * 0.32) * 0.1 + 0.9;
      const patina = Math.sin(u2 + v2 * 1.5) * 0.08;
      const variation = streak + patina;
      
      // Deep warm copper tones (reddish-brown, not orange)
      const baseR = 184;
      const baseG = 115;
      const baseB = 51;
      
      data[idx] = Math.max(145, Math.min(210, Math.floor(baseR * variation)));
      data[idx + 1] = Math.max(85, Math.min(140, Math.floor(baseG * variation)));
      data[idx + 2] = Math.max(35, Math.min(75, Math.floor(baseB * variation)));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate bronze pattern with rich aged patina
 * Bronze has warm brown-gold tones with characteristic aged surface
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateBronzePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 4);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 1);
      const v2 = seamlessCoord(y, size, 1);
      const u3 = seamlessCoord(x, size, 0.5);
      const v3 = seamlessCoord(y, size, 0.5);
      
      // Aged surface with patina variation - seamlessly tiled
      const streak = Math.sin(u + v * 0.5) * 0.12 + 0.88;
      const patina = Math.sin(u2 + v2 * 1.5) * 0.1;
      const age = Math.sin(u3 - v3 * 1.67) * 0.05;
      const variation = streak + patina + age;
      
      // Rich bronze - warm brown-gold tones
      const baseR = 166;
      const baseG = 125;
      const baseB = 60;
      
      data[idx] = Math.max(130, Math.min(195, Math.floor(baseR * variation)));
      data[idx + 1] = Math.max(95, Math.min(150, Math.floor(baseG * variation)));
      data[idx + 2] = Math.max(40, Math.min(85, Math.floor(baseB * variation)));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate titanium pattern with iridescent anodized surface
 * Real titanium has a dark gray-blue base with colorful iridescence from anodization
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateTitaniumPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 3);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 1);
      const v2 = seamlessCoord(y, size, 2);
      
      // Subtle surface grain variation - seamlessly tiled
      const grain = Math.sin(u + v * 0.53) * 0.08 + 
                   Math.sin(u2 * 0.33 - v2) * 0.05;
      
      // Anodized iridescence - seamlessly tiled (reduced intensity for smoother look)
      const iriPhase = u * 1.5 + v * 0.8 + u2 * 0.3 + v2 * 0.2;
      const iriIntensity = 0.06 + Math.sin(u + v) * 0.03;
      
      // Base titanium gray-blue (darker, more realistic)
      const baseR = 100;
      const baseG = 108;
      const baseB = 118;
      
      // Rainbow iridescence overlay (subtle anodized effect - reduced by 75%)
      const iriR = Math.sin(iriPhase) * iriIntensity * 10;
      const iriG = Math.sin(iriPhase + Math.PI * 0.667) * iriIntensity * 8;
      const iriB = Math.sin(iriPhase + Math.PI * 1.333) * iriIntensity * 12;
      
      // Combine base + iridescence + grain
      data[idx] = Math.max(60, Math.min(180, Math.floor(baseR + iriR + grain * 30)));
      data[idx + 1] = Math.max(70, Math.min(175, Math.floor(baseG + iriG + grain * 25)));
      data[idx + 2] = Math.max(80, Math.min(190, Math.floor(baseB + iriB + grain * 35)));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// ============================================================================
// CRYSTALLINE PATTERNS - Gems & Precious Stones
// ============================================================================

/**
 * Generate diamond pattern with brilliant facets and rainbow fire dispersion
 * Simulates the characteristic brilliance and spectral fire of a cut diamond
 * SEAMLESS TILING: Uses facets that wrap correctly at boundaries
 */
export function generateDiamondPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  // Use a facet count that divides evenly into the texture size for seamless tiling
  const facetCount = 8;
  const facetSize = size / facetCount;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable facet pattern
      const facetX = Math.floor(x / facetSize);
      const facetY = Math.floor(y / facetSize);
      const localX = (x % facetSize) / facetSize;
      const localY = (y % facetSize) / facetSize;
      
      // Internal reflections and brilliance
      const brilliance = Math.pow(Math.abs(Math.sin(localX * Math.PI) * Math.sin(localY * Math.PI)), 0.5);
      
      // Rainbow fire dispersion - seamlessly wrapping phase
      const u = seamlessCoord(x, size, facetCount);
      const v = seamlessCoord(y, size, facetCount);
      const firePhase = u + v * 0.5 + localX * TWO_PI * 0.3;
      const fireIntensity = brilliance * 0.4;
      
      // Spectral colors with subtle rainbow hints
      const baseWhite = 240 + brilliance * 15;
      const rFire = Math.sin(firePhase) * fireIntensity * 30;
      const gFire = Math.sin(firePhase + Math.PI * 0.667) * fireIntensity * 25;
      const bFire = Math.sin(firePhase + Math.PI * 1.333) * fireIntensity * 35;
      
      data[idx] = Math.min(255, Math.floor(baseWhite + rFire));
      data[idx + 1] = Math.min(255, Math.floor(baseWhite + gFire));
      data[idx + 2] = Math.min(255, Math.floor(baseWhite + bFire));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate opal pattern with iridescent play-of-color effect
 * Creates a milky base with rainbow color shifts like real opal
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateOpalPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const u = seamlessCoord(x, size, 3);
      const v = seamlessCoord(y, size, 3);
      const u2 = seamlessCoord(x, size, 5);
      const v2 = seamlessCoord(y, size, 4);
      
      const flow1 = Math.sin(u * 2 + v * 1.5);
      const flow2 = Math.cos(u * 1.5 - v * 2);
      const flow3 = Math.sin(u2 * 0.8 + v2 * 1.2);
      const flow4 = Math.cos(u2 - v2 * 0.7);
      
      const colorPhase = (flow1 + flow2 + flow3 + flow4) * Math.PI * 0.8;
      
      const r = Math.sin(colorPhase) * 0.5 + 0.5;
      const g = Math.sin(colorPhase + Math.PI * 0.667) * 0.5 + 0.5;
      const b = Math.sin(colorPhase + Math.PI * 1.333) * 0.5 + 0.5;
      
      const fire = Math.abs(Math.sin(u * 4 + v * 3)) * 0.4;
      const milky = 0.6 + Math.sin(u + v * 0.5) * 0.15;
      
      data[idx] = Math.min(255, Math.floor((120 + r * 135 + fire * 80) * milky));
      data[idx + 1] = Math.min(255, Math.floor((100 + g * 155 + fire * 40) * milky));
      data[idx + 2] = Math.min(255, Math.floor((140 + b * 115 + fire * 60) * milky));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate alexandrite pattern with color-change effect
 * Shows green in some areas (daylight) and red/purple in others (incandescent)
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateAlexandritePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const u = seamlessCoord(x, size, 2);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 3);
      const v2 = seamlessCoord(y, size, 2.5);
      
      const colorMix = (Math.sin(u * 1.5 + v * 0.8) + Math.cos(u2 - v2)) * 0.5 + 0.5;
      
      const crystal = Math.abs(Math.sin(u2 * 2 + v2 * 1.5)) * 0.25 + 0.75;
      const sparkle = Math.pow(Math.abs(Math.sin(u * 8 + v * 6)), 4) * 0.3;
      
      const greenPhase = (1 - colorMix);
      const redPhase = colorMix;
      
      data[idx] = Math.min(255, Math.floor((60 + redPhase * 180 + sparkle * 50) * crystal));
      data[idx + 1] = Math.min(255, Math.floor((80 + greenPhase * 140 + sparkle * 30) * crystal));
      data[idx + 2] = Math.min(255, Math.floor((80 + redPhase * 100 + greenPhase * 40) * crystal));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate emerald pattern with jardin inclusions
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateEmeraldPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 3);
      const v = seamlessCoord(y, size, 3);
      const u2 = seamlessCoord(x, size, 5);
      const v2 = seamlessCoord(y, size, 4);
      
      // Emerald's characteristic inclusions (jardin) - seamlessly tiled
      const jardin = Math.sin(u + v * 0.5) * Math.cos(u * 0.3 - v) * 0.3;
      const crystal = Math.abs(Math.sin(u2) * Math.cos(v2)) * 0.2;
      
      const base = 0.6 + jardin + crystal;
      
      // Deep emerald green with bluish undertone
      data[idx] = Math.min(255, Math.floor(50 * base));
      data[idx + 1] = Math.min(255, Math.floor(180 * base));
      data[idx + 2] = Math.min(255, Math.floor(100 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate ruby pattern with silk inclusions
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateRubyPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 4);
      const v = seamlessCoord(y, size, 3);
      const u2 = seamlessCoord(x, size, 2);
      const v2 = seamlessCoord(y, size, 2);
      
      // Ruby's silk inclusions (rutile needles) - seamlessly tiled
      const silk = Math.abs(Math.sin(u + v * 0.5)) * 0.15;
      const depth = Math.sin(u2 + v2 * 0.8) * 0.2;
      
      const base = 0.7 + silk + depth;
      
      // Pigeon blood red
      data[idx] = Math.min(255, Math.floor(220 * base));
      data[idx + 1] = Math.min(255, Math.floor(40 * base));
      data[idx + 2] = Math.min(255, Math.floor(60 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate sapphire pattern with color zoning
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateSapphirePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 2);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 4);
      const v2 = seamlessCoord(y, size, 4);
      
      // Sapphire color zoning - seamlessly tiled
      const zoning = Math.sin(u + v * 0.75) * 0.2;
      const crystal = Math.abs(Math.sin(u2) * Math.cos(v2)) * 0.15;
      
      const base = 0.65 + zoning + crystal;
      
      // Kashmir blue
      data[idx] = Math.min(255, Math.floor(50 * base));
      data[idx + 1] = Math.min(255, Math.floor(80 * base));
      data[idx + 2] = Math.min(255, Math.floor(200 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate amethyst pattern with color banding
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateAmethystPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 2);
      const v = seamlessCoord(y, size, 2);
      const u2 = seamlessCoord(x, size, 5);
      const v2 = seamlessCoord(y, size, 4);
      
      // Amethyst color banding - seamlessly tiled
      const banding = Math.sin(u + v * 0.8) * 0.25;
      const crystal = Math.abs(Math.sin(u2 + v2 * 0.67)) * 0.15;
      
      const base = 0.6 + banding + crystal;
      
      // Deep purple
      data[idx] = Math.min(255, Math.floor(140 * base));
      data[idx + 1] = Math.min(255, Math.floor(50 * base));
      data[idx + 2] = Math.min(255, Math.floor(180 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// ============================================================================
// ENERGY PATTERNS
// ============================================================================

/**
 * Generate plasma energy pattern - intense glowing energy effect
 * Creates swirling, pulsating energy like real plasma
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generatePlasmaPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 3);
      const v = seamlessCoord(y, size, 3);
      const u2 = seamlessCoord(x, size, 2);
      const v2 = seamlessCoord(y, size, 2);
      
      // Complex plasma wave interference for swirling effect - seamlessly tiled
      const wave1 = Math.sin(u * 1.5 + Math.sin(v * 0.8) * 2);
      const wave2 = Math.sin(v * 1.3 + Math.cos(u * 0.9) * 2);
      const wave3 = Math.sin((u + v) * 0.7 + Math.sin(u2 - v2) * 1.5);
      const wave4 = Math.cos(u2 + v2);
      
      // Combine waves with intensity variation
      const plasma = (wave1 + wave2 + wave3 + wave4) / 4;
      const intensity = (plasma + 1) * 0.5; // 0 to 1
      
      // Hot core (white/pink) to outer glow (purple/blue)
      const hotCore = Math.pow(intensity, 0.5); // More white in bright areas
      
      // Vibrant magenta-purple plasma colors
      data[idx] = Math.min(255, Math.floor(200 * hotCore + 55 * (1-hotCore))); // R: hot=bright, cold=dim
      data[idx + 1] = Math.min(255, Math.floor(80 * intensity)); // G: subtle
      data[idx + 2] = Math.min(255, Math.floor(180 + intensity * 75)); // B: always strong
      data[idx + 3] = Math.min(255, Math.floor(200 + intensity * 55)); // Varying alpha for glow
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate lightning bolt pattern
 */
export function generateLightningPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  // Initialize with dark background
  for (let i = 0; i < size * size * 4; i += 4) {
    data[i] = 20;
    data[i + 1] = 30;
    data[i + 2] = 50;
    data[i + 3] = 255;
  }
  
  // Draw multiple lightning bolts
  for (let bolt = 0; bolt < 5; bolt++) {
    let x = Math.random() * size;
    let y = 0;
    
    while (y < size) {
      const idx = (Math.floor(y) * size + Math.floor(x)) * 4;
      if (idx >= 0 && idx < data.length - 3) {
        // Bright core
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        
        // Glow around bolt
        for (let glow = 1; glow < 15; glow++) {
          const glowIntensity = 1 - glow / 15;
          for (let dx = -glow; dx <= glow; dx++) {
            const gx = Math.floor(x) + dx;
            if (gx >= 0 && gx < size) {
              const glowIdx = (Math.floor(y) * size + gx) * 4;
              if (glowIdx >= 0 && glowIdx < data.length - 3) {
                data[glowIdx] = Math.max(data[glowIdx], Math.floor(150 * glowIntensity));
                data[glowIdx + 1] = Math.max(data[glowIdx + 1], Math.floor(180 * glowIntensity));
                data[glowIdx + 2] = Math.max(data[glowIdx + 2], Math.floor(255 * glowIntensity));
              }
            }
          }
        }
      }
      
      // Random walk with branching tendency
      x += (Math.random() - 0.5) * 20;
      y += 2 + Math.random() * 3;
      
      // Keep in bounds
      x = Math.max(0, Math.min(size - 1, x));
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate neon glow pattern - intense fluorescent light effect
 * Creates the characteristic glow of neon gas tubes
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateNeonPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 2);
      const v = seamlessCoord(y, size, 2);
      
      // Multiple flowing neon tube curves - seamlessly tiled
      const curve1 = Math.sin(u + 1) * 0.15 + 0.3;
      const curve2 = Math.sin(u * 0.8 + 3) * 0.2 + 0.6;
      const curve3 = Math.cos(u * 1.2) * 0.12 + 0.5;
      
      // Convert y to normalized position
      const yNorm = y / size;
      
      const dist1 = Math.abs(yNorm - curve1) * size;
      const dist2 = Math.abs(yNorm - curve2) * size;
      const dist3 = Math.abs(yNorm - curve3) * size;
      const minDist = Math.min(dist1, dist2, dist3);
      
      // Strong glow falloff with hot core
      const coreGlow = Math.exp(-minDist / 15); // Tight core
      const outerGlow = Math.exp(-minDist / 60); // Wide glow
      const totalGlow = coreGlow * 0.7 + outerGlow * 0.3;
      
      // Hot pink/magenta neon with white-hot core
      const coreWhite = coreGlow * 0.5;
      data[idx] = Math.min(255, Math.floor((255 * totalGlow) + coreWhite * 50));
      data[idx + 1] = Math.min(255, Math.floor((80 * totalGlow) + coreWhite * 175));
      data[idx + 2] = Math.min(255, Math.floor((220 * totalGlow) + coreWhite * 35));
      data[idx + 3] = Math.min(255, Math.floor(150 + totalGlow * 105));
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate aurora borealis pattern - flowing ethereal curtains of light
 * Simulates the characteristic green/blue/purple bands of northern lights
 * SEAMLESS TILING: Uses 2π-wrapped coordinates for perfect edge matching
 */
export function generateAuroraPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Seamlessly tileable coordinates
      const u = seamlessCoord(x, size, 2);
      const v = seamlessCoord(y, size, 1);
      const u2 = seamlessCoord(x, size, 3);
      const v2 = seamlessCoord(y, size, 2);
      
      // Vertical flowing curtains - seamlessly tiled
      const curtainFlow = Math.sin(u + Math.sin(v) * 3);
      const verticalWave = Math.sin(v + curtainFlow * 2);
      
      // Multiple overlapping bands - seamlessly tiled
      const band1 = Math.sin(u2 + v * 0.33) * 0.5 + 0.5;
      const band2 = Math.cos(u - v2 * 0.5) * 0.5 + 0.5;
      const band3 = Math.sin(u2 + v2) * 0.5 + 0.5;
      
      // Intensity based on bands
      const intensity = (band1 + band2 * 0.7 + band3 * 0.5) / 2.2;
      const glow = Math.pow(intensity, 0.7);
      
      // Aurora colors: primarily green, with blue/purple accents
      const greenDominant = glow * (0.8 + verticalWave * 0.2);
      const blueAccent = band2 * glow * 0.6;
      const purpleEdge = band3 * (1 - glow) * 0.4;
      
      data[idx] = Math.min(255, Math.floor(80 + purpleEdge * 120)); // R: purple edges
      data[idx + 1] = Math.min(255, Math.floor(180 * greenDominant + 75)); // G: dominant green
      data[idx + 2] = Math.min(255, Math.floor(120 * blueAccent + 100)); // B: blue accents
      data[idx + 3] = Math.min(255, Math.floor(180 + glow * 75)); // Varying alpha
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// ============================================================================
// ORGANIC PATTERNS - All use seamless tiling for perfect edge matching
// ============================================================================

/**
 * Generate wood grain pattern with seamless tiling
 */
export function generateWoodPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = seamlessCoord(x, size);
      const v = seamlessCoord(y, size);
      
      // Wood grain rings using seamless coordinates
      // Use radial pattern from center that wraps seamlessly
      const grainU = Math.sin(u * 4) + Math.sin(v * 0.5) * 0.3;
      const grainV = Math.sin(v * 8 + grainU * 2);
      const grain = grainV * 0.35 + grainU * 0.15;
      
      // Fine wood texture detail
      const detail = Math.sin(u * 20) * Math.sin(v * 25) * 0.05;
      
      const base = 0.55 + grain + detail;
      
      // Warm wood tones
      data[idx] = Math.min(255, Math.floor(180 * base));
      data[idx + 1] = Math.min(255, Math.floor(120 * base));
      data[idx + 2] = Math.min(255, Math.floor(80 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate marble pattern with veins using seamless tiling
 */
export function generateMarblePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = seamlessCoord(x, size);
      const v = seamlessCoord(y, size);
      
      // Marble veining using seamless coordinates
      const veinBase = Math.sin(u * 2 + Math.sin(v * 3) * 1.5);
      const veinDetail = Math.sin(u * 6 + v * 4) * 0.3;
      const vein = veinBase * 0.2 + veinDetail * 0.1;
      
      // Subtle color variation
      const noise = Math.sin(u * 12) * Math.sin(v * 10) * 0.08;
      
      const base = 0.85 + vein + noise;
      
      // White marble with gray veins
      data[idx] = Math.min(255, Math.floor(230 * base));
      data[idx + 1] = Math.min(255, Math.floor(225 * base));
      data[idx + 2] = Math.min(255, Math.floor(220 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate granite stone pattern with seamless tiling
 * Uses deterministic pseudo-random based on coordinates for repeatable speckle
 */
export function generateGranitePattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = seamlessCoord(x, size);
      const v = seamlessCoord(y, size);
      
      // Deterministic pseudo-random speckle using seamless coordinates
      // This creates repeatable "random" appearance that tiles seamlessly
      const speckle1 = Math.abs(Math.sin(u * 47.3 + v * 83.7));
      const speckle2 = Math.abs(Math.sin(u * 71.1 + v * 37.9));
      const speckle3 = Math.abs(Math.sin(u * 23.5 + v * 59.3));
      const speckle = (speckle1 * speckle2 + speckle3 * 0.5) * 0.35;
      
      // Quartz veins
      const quartz = Math.sin(u * 8) * Math.sin(v * 6) * 0.12;
      
      const base = 0.55 + speckle + quartz;
      
      // Gray granite with pink feldspar hints
      data[idx] = Math.min(255, Math.floor((140 + speckle * 50) * base));
      data[idx + 1] = Math.min(255, Math.floor(130 * base));
      data[idx + 2] = Math.min(255, Math.floor(125 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Generate leather texture pattern with seamless tiling
 */
export function generateLeatherPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const u = seamlessCoord(x, size);
      const v = seamlessCoord(y, size);
      
      // Leather pores using seamless coordinates
      const pores = Math.sin(u * 15) * Math.sin(v * 18) * 0.12;
      
      // Wrinkles and creases
      const wrinkle = Math.sin(u * 3 + v * 2.5) * 0.08;
      
      // Fine grain texture
      const grain = Math.abs(Math.sin(u * 10 + v * 8)) * 0.08;
      
      const base = 0.58 + pores + wrinkle + grain;
      
      // Rich brown leather
      data[idx] = Math.min(255, Math.floor(160 * base));
      data[idx + 1] = Math.min(255, Math.floor(100 * base));
      data[idx + 2] = Math.min(255, Math.floor(70 * base));
      data[idx + 3] = 255;
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Load Earth texture from file for world map visualization
 * Returns a promise that resolves to the loaded texture
 */
export function loadEarthTexture(): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.load(
      '/textures/hello-uuorld-earth.jpg',
      (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        resolve(texture);
      },
      undefined,
      () => {
        console.warn('Earth texture not found, using procedural fallback');
        resolve(generateWorldMapGlowPattern() as any);
      }
    );
  });
}

/**
 * Generate Hello UUorld World Map pattern with glowing landmasses
 * Creates a stylized world map with neon-glowing continent outlines on dark ocean
 * Used as the opening/startup visualization
 */
export function generateWorldMapGlowPattern(size: number = 2048): THREE.DataTexture {
  const data = new Uint8Array(size * size * 4);
  
  const hash = (x: number, y: number): number => {
    const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return h - Math.floor(h);
  };
  
  const isLand = (normX: number, normY: number): number => {
    const lon = normX * 360 - 180;
    const lat = normY * 180 - 90;
    
    let landValue = 0;
    
    if (lon >= -170 && lon <= -50 && lat >= 15 && lat <= 75) {
      const naShape = Math.sin((lon + 110) * 0.03) * 20 + 45;
      if (lat < naShape && lat > 20 + Math.sin(lon * 0.05) * 10) landValue = 1;
    }
    
    if (lon >= -85 && lon <= -30 && lat >= -60 && lat <= 15) {
      const saCenter = -55 + (15 - lat) * 0.3;
      const saWidth = 15 - Math.abs(lat + 20) * 0.3;
      if (Math.abs(lon - saCenter) < saWidth) landValue = 1;
    }
    
    if (lon >= -15 && lon <= 60 && lat >= -40 && lat <= 40) {
      const afCenter = 20;
      const afWidth = 25 - Math.abs(lat) * 0.4;
      if (Math.abs(lon - afCenter) < afWidth) landValue = 1;
    }
    
    if (lon >= -15 && lon <= 50 && lat >= 35 && lat <= 72) {
      if (lat > 40 + Math.sin(lon * 0.1) * 5) landValue = 1;
    }
    
    if (lon >= 25 && lon <= 180 && lat >= 5 && lat <= 75) {
      const asiaShape = 50 + Math.sin(lon * 0.02) * 15;
      if (lat < asiaShape && lat > 10 + Math.cos(lon * 0.03) * 8) landValue = 1;
    }
    
    if (lon >= 65 && lon <= 92 && lat >= 5 && lat <= 35) {
      const indCenter = 78;
      const indWidth = 12 - (35 - lat) * 0.3;
      if (Math.abs(lon - indCenter) < indWidth && lat < 30) landValue = 1;
    }
    
    if (lon >= 110 && lon <= 155 && lat >= -45 && lat <= -10) {
      const ausCenter = 135;
      const ausWidth = 18 - Math.abs(lat + 25) * 0.3;
      if (Math.abs(lon - ausCenter) < ausWidth) landValue = 1;
    }
    
    if (lon >= 125 && lon <= 150 && lat >= 25 && lat <= 48) {
      if (Math.abs(lon - 138) < 6 + Math.sin(lat * 0.2) * 3) landValue = 1;
    }
    
    if (lon >= -60 && lon <= -15 && lat >= 58 && lat <= 82) landValue = 1;
    
    if (lon >= -12 && lon <= 3 && lat >= 48 && lat <= 62) landValue = 1;
    
    return landValue;
  };
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      const normX = x / size;
      const normY = 1 - (y / size);
      
      const land = isLand(normX, normY);
      
      let edgeGlow = 0;
      const step = 4 / size;
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = normX + dx * step;
          const ny = normY + dy * step;
          if (isLand(nx, ny) !== land) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            edgeGlow = Math.max(edgeGlow, Math.exp(-dist * 0.4));
          }
        }
      }
      
      const noise = hash(x * 0.1, y * 0.1) * 0.1;
      
      if (land > 0) {
        const glow = 0.6 + edgeGlow * 0.4 + noise;
        data[idx] = Math.min(255, Math.floor(50 + 150 * edgeGlow));
        data[idx + 1] = Math.min(255, Math.floor(200 * glow));
        data[idx + 2] = Math.min(255, Math.floor(100 + 100 * edgeGlow));
        data[idx + 3] = 255;
      } else {
        const oceanGlow = edgeGlow * 0.8;
        data[idx] = Math.min(255, Math.floor(5 + 80 * oceanGlow));
        data[idx + 1] = Math.min(255, Math.floor(15 + 180 * oceanGlow));
        data[idx + 2] = Math.min(255, Math.floor(30 + 200 * oceanGlow));
        data[idx + 3] = 255;
      }
    }
  }
  
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  texture.needsUpdate = true;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}
