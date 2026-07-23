/**
 * WIREFRAME TEXTURE GENERATOR
 * Generates wireframe overlay textures for solid exports
 */

import * as THREE from 'three';

export interface WireframeTextureOptions {
  size: number;           // Texture resolution (512, 1024, 2048)
  lineWidth: number;      // Width of wireframe lines (1-8 pixels)
  lineColor: string;      // Color of wireframe lines (hex)
  backgroundColor: string; // Background color (hex or 'transparent')
  gridDivisions: number;  // Number of grid divisions (8, 16, 32)
  opacity: number;        // Line opacity (0-1)
}

export const DEFAULT_WIREFRAME_OPTIONS: WireframeTextureOptions = {
  size: 512,
  lineWidth: 2,
  lineColor: '#00ffff',  // Cyan wireframe
  backgroundColor: 'transparent',
  gridDivisions: 16,
  opacity: 0.8
};

/**
 * Generate wireframe overlay texture for solid exports
 */
export function generateWireframeTexture(
  options: Partial<WireframeTextureOptions> = {}
): THREE.CanvasTexture {
  const opts = { ...DEFAULT_WIREFRAME_OPTIONS, ...options };
  
  const canvas = document.createElement('canvas');
  canvas.width = opts.size;
  canvas.height = opts.size;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to create canvas context for wireframe texture');
  }
  
  // Set background
  if (opts.backgroundColor === 'transparent') {
    ctx.clearRect(0, 0, opts.size, opts.size);
  } else {
    ctx.fillStyle = opts.backgroundColor;
    ctx.fillRect(0, 0, opts.size, opts.size);
  }
  
  // Draw wireframe grid
  ctx.strokeStyle = opts.lineColor;
  ctx.lineWidth = opts.lineWidth;
  ctx.globalAlpha = opts.opacity;
  
  const cellSize = opts.size / opts.gridDivisions;
  
  // Vertical lines
  for (let i = 0; i <= opts.gridDivisions; i++) {
    const x = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, opts.size);
    ctx.stroke();
  }
  
  // Horizontal lines
  for (let i = 0; i <= opts.gridDivisions; i++) {
    const y = i * cellSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(opts.size, y);
    ctx.stroke();
  }
  
  // Create Three.js texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.flipY = true;
  texture.needsUpdate = true;
  
  return texture;
}

/**
 * Generate wireframe+PBR combined material for solid exports
 */
export function createWireframePBRMaterial(
  baseColor: number,
  wireframeOptions?: Partial<WireframeTextureOptions>
): THREE.MeshStandardMaterial {
  const wireframeTex = generateWireframeTexture(wireframeOptions);
  
  return new THREE.MeshStandardMaterial({
    color: baseColor,
    map: wireframeTex,
    transparent: true,
    opacity: 1.0,
    metalness: 0.3,
    roughness: 0.5,
    side: THREE.DoubleSide
  });
}

/**
 * Add wireframe texture overlay to existing PBR material.
 * Uses emissiveMap so the grid glows on top of any base material regardless
 * of roughness, opacity or existing alphaMap state.
 */
export function addWireframeOverlay(
  material: THREE.MeshStandardMaterial,
  wireframeOptions?: Partial<WireframeTextureOptions>
): THREE.MeshStandardMaterial {
  const wireframeTex = generateWireframeTexture({
    lineColor: '#00ff88',
    lineWidth: 2,
    gridDivisions: 16,
    opacity: 1.0,
    ...wireframeOptions,
    backgroundColor: 'transparent'
  });

  const newMaterial = material.clone();

  // Apply the wireframe grid as an emissive map so it shines over any surface.
  // This works even on fully opaque, high-roughness or metallic materials.
  newMaterial.emissiveMap = wireframeTex;
  newMaterial.emissiveIntensity = 1.2;
  // If emissive colour is black it kills the emissiveMap — force a neutral tint
  if (!newMaterial.emissive || newMaterial.emissive.getHex() === 0x000000) {
    newMaterial.emissive = new THREE.Color('#00ff88');
  }
  newMaterial.needsUpdate = true;

  return newMaterial;
}
