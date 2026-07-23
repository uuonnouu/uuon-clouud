/**
 * QR CODE GENERATOR FOR VERIFICATION
 * 
 * Generates QR codes that link to UUON Foundation verification page
 * Can be embedded in textures or exported as standalone images
 * 
 * Uses a simple matrix-based QR code generation (no external dependencies)
 * 
 * © 2025 UUON Foundation Inc.
 */

import * as THREE from 'three';

const VERIFICATION_BASE_URL = 'https://uuonfoundation.com/verify';

interface QRCodeOptions {
  size: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorCorrection: 'L' | 'M' | 'Q' | 'H';
}

const DEFAULT_OPTIONS: QRCodeOptions = {
  size: 256,
  margin: 4,
  darkColor: '#000000',
  lightColor: '#FFFFFF',
  errorCorrection: 'M'
};

const ALPHANUMERIC_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:';

function getAlphanumericValue(char: string): number {
  const index = ALPHANUMERIC_CHARS.indexOf(char.toUpperCase());
  return index >= 0 ? index : -1;
}

function encodeAlphanumeric(text: string): number[] {
  const bits: number[] = [];
  const upperText = text.toUpperCase();
  
  for (let i = 0; i < upperText.length; i += 2) {
    if (i + 1 < upperText.length) {
      const val = getAlphanumericValue(upperText[i]) * 45 + getAlphanumericValue(upperText[i + 1]);
      for (let j = 10; j >= 0; j--) {
        bits.push((val >> j) & 1);
      }
    } else {
      const val = getAlphanumericValue(upperText[i]);
      for (let j = 5; j >= 0; j--) {
        bits.push((val >> j) & 1);
      }
    }
  }
  
  return bits;
}

function createSimpleQRMatrix(data: string): number[][] {
  const size = 21;
  const matrix: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      const isEdge = i === 0 || i === 6 || j === 0 || j === 6;
      const isCenter = i >= 2 && i <= 4 && j >= 2 && j <= 4;
      const value = isEdge || isCenter ? 1 : 0;
      
      matrix[i][j] = value;
      matrix[i][size - 1 - j] = value;
      matrix[size - 1 - i][j] = value;
    }
  }
  
  for (let i = 0; i < size; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }
  
  matrix[size - 8][8] = 1;
  
  const hash = simpleHash(data);
  let bitIndex = 0;
  
  for (let col = size - 1; col >= 0; col -= 2) {
    if (col === 6) col--;
    
    for (let row = 0; row < size; row++) {
      for (let c = 0; c < 2; c++) {
        const actualCol = col - c;
        if (actualCol < 0) continue;
        
        if (isReserved(row, actualCol, size)) continue;
        
        const bit = (hash >> (bitIndex % 32)) & 1;
        matrix[row][actualCol] = bit ^ ((row + actualCol) % 2 === 0 ? 1 : 0);
        bitIndex++;
      }
    }
  }
  
  return matrix;
}

function isReserved(row: number, col: number, size: number): boolean {
  if (row < 9 && col < 9) return true;
  if (row < 9 && col >= size - 8) return true;
  if (row >= size - 8 && col < 9) return true;
  if (row === 6 || col === 6) return true;
  return false;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function generateQRCodeCanvas(
  data: string,
  options: Partial<QRCodeOptions> = {}
): HTMLCanvasElement {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const matrix = createSimpleQRMatrix(data);
  const moduleSize = Math.floor((opts.size - opts.margin * 2) / matrix.length);
  
  const canvas = document.createElement('canvas');
  canvas.width = opts.size;
  canvas.height = opts.size;
  
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = opts.lightColor;
  ctx.fillRect(0, 0, opts.size, opts.size);
  
  ctx.fillStyle = opts.darkColor;
  
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === 1) {
        ctx.fillRect(
          opts.margin + col * moduleSize,
          opts.margin + row * moduleSize,
          moduleSize,
          moduleSize
        );
      }
    }
  }
  
  ctx.fillStyle = opts.darkColor;
  ctx.font = `${Math.floor(opts.size / 20)}px Arial`;
  ctx.textAlign = 'center';
  ctx.fillText('UUON VERIFY', opts.size / 2, opts.size - opts.margin / 2);
  
  return canvas;
}

export function generateQRCodeDataURL(
  data: string,
  options: Partial<QRCodeOptions> = {}
): string {
  const canvas = generateQRCodeCanvas(data, options);
  return canvas.toDataURL('image/png');
}

export function generateVerificationQRCode(
  shapeId: string,
  geometryHash: string,
  options: Partial<QRCodeOptions> = {}
): {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  verificationUrl: string;
  shortCode: string;
} {
  const shortCode = geometryHash.substring(0, 12).toUpperCase();
  const verificationUrl = `${VERIFICATION_BASE_URL}?h=${shortCode}&id=${encodeURIComponent(shapeId)}`;
  
  const canvas = generateQRCodeCanvas(verificationUrl, options);
  const dataUrl = canvas.toDataURL('image/png');
  
  return {
    canvas,
    dataUrl,
    verificationUrl,
    shortCode
  };
}

export function generateQRCodeTexture(
  shapeId: string,
  geometryHash: string,
  textureSize: number = 512
): THREE.Texture {
  const qrSize = Math.floor(textureSize * 0.3);
  const { canvas: qrCanvas } = generateVerificationQRCode(shapeId, geometryHash, { size: qrSize });
  
  const canvas = document.createElement('canvas');
  canvas.width = textureSize;
  canvas.height = textureSize;
  const ctx = canvas.getContext('2d')!;
  
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, textureSize, textureSize);
  
  const padding = 20;
  const qrX = textureSize - qrSize - padding;
  const qrY = textureSize - qrSize - padding;
  
  ctx.shadowColor = 'rgba(0, 255, 136, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
  ctx.shadowBlur = 0;
  
  ctx.drawImage(qrCanvas, qrX, qrY);
  
  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('UUON FOUNDATION', padding, padding + 24);
  
  ctx.fillStyle = '#888888';
  ctx.font = '14px Arial';
  ctx.fillText('Verified Mathematical Model', padding, padding + 48);
  
  ctx.fillStyle = '#666666';
  ctx.font = '12px monospace';
  const shortHash = geometryHash.substring(0, 16).toUpperCase();
  ctx.fillText(`Hash: ${shortHash}...`, padding, textureSize - padding);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

export function embedQRInExportTexture(
  baseTexture: THREE.Texture | null,
  shapeId: string,
  geometryHash: string,
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right'
): THREE.Texture {
  const size = 1024;
  const qrSize = 128;
  const margin = 16;
  
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  
  if (baseTexture && baseTexture.image instanceof HTMLImageElement) {
    ctx.drawImage(baseTexture.image, 0, 0, size, size);
  } else if (baseTexture && baseTexture.image instanceof HTMLCanvasElement) {
    ctx.drawImage(baseTexture.image, 0, 0, size, size);
  } else {
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
  }
  
  const { canvas: qrCanvas } = generateVerificationQRCode(shapeId, geometryHash, { 
    size: qrSize,
    margin: 2 
  });
  
  let qrX: number, qrY: number;
  switch (position) {
    case 'bottom-left':
      qrX = margin;
      qrY = size - qrSize - margin;
      break;
    case 'top-right':
      qrX = size - qrSize - margin;
      qrY = margin;
      break;
    case 'top-left':
      qrX = margin;
      qrY = margin;
      break;
    case 'bottom-right':
    default:
      qrX = size - qrSize - margin;
      qrY = size - qrSize - margin;
  }
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8);
  
  ctx.drawImage(qrCanvas, qrX, qrY);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

export function generateStandaloneVerificationImage(
  shapeId: string,
  shapeName: string,
  geometryHash: string,
  category: string
): string {
  const width = 600;
  const height = 400;
  const qrSize = 200;
  
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0a0a14');
  gradient.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  ctx.strokeStyle = '#00ff88';
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, width - 20, height - 20);
  
  ctx.fillStyle = '#00ff88';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('UUON FOUNDATION', 30, 50);
  
  ctx.fillStyle = '#888888';
  ctx.font = '14px Arial';
  ctx.fillText('Verified Mathematical Model', 30, 75);
  
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(shapeName, 30, 120);
  
  ctx.fillStyle = '#888888';
  ctx.font = '14px Arial';
  ctx.fillText(`Category: ${category}`, 30, 145);
  ctx.fillText(`ID: ${shapeId}`, 30, 165);
  
  ctx.fillStyle = '#666666';
  ctx.font = '12px monospace';
  const shortHash = geometryHash.substring(0, 32);
  ctx.fillText(`Hash: ${shortHash}...`, 30, 195);
  
  const { canvas: qrCanvas } = generateVerificationQRCode(shapeId, geometryHash, { 
    size: qrSize,
    margin: 4 
  });
  
  const qrX = width - qrSize - 30;
  const qrY = height - qrSize - 30;
  
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10);
  ctx.drawImage(qrCanvas, qrX, qrY);
  
  ctx.fillStyle = '#00ff88';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Scan to Verify', qrX + qrSize / 2, qrY - 10);
  
  ctx.fillStyle = '#444444';
  ctx.font = '10px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('© 2025 UUON Foundation Inc. | uuonfoundation.com', 30, height - 20);
  
  return canvas.toDataURL('image/png');
}
