/**
 * AUTHORSHIP FINGERPRINT SYSTEM
 * Multi-layered protection for 3D models with cryptographic and geometric watermarks
 * 
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

import * as THREE from 'three';
import { UUON_ATTRIBUTION } from './biologicalShapesMetadata';

/**
 * Layer 1: Cryptographic Hash Fingerprint (Immutable)
 * Creates SHA-256 hash of vertex data for tamper detection
 */
export async function generateCryptographicHash(geometry: THREE.BufferGeometry): Promise<string> {
  const positions = geometry.attributes.position;
  const normals = geometry.attributes.normal;
  const indices = geometry.index;
  
  // Combine vertex data into canonical form
  const vertexData: number[] = [];
  
  // Add positions (rounded to 6 decimals for consistency)
  for (let i = 0; i < positions.count; i++) {
    vertexData.push(
      Math.round(positions.getX(i) * 1000000) / 1000000,
      Math.round(positions.getY(i) * 1000000) / 1000000,
      Math.round(positions.getZ(i) * 1000000) / 1000000
    );
  }
  
  // Add topology if available
  if (indices) {
    for (let i = 0; i < indices.count; i++) {
      vertexData.push(indices.getX(i));
    }
  }
  
  // Convert to bytes
  const buffer = new Float64Array(vertexData);
  const bytes = new Uint8Array(buffer.buffer);
  
  // Generate SHA-256 hash
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Layer 2: Hidden Geometry Watermark (Steganographic)
 * Embeds authorship data in vertex positions using imperceptible perturbations
 * Uses LSB modification of floating-point coordinates for recoverability
 */
export function embedGeometricWatermark(
  geometry: THREE.BufferGeometry,
  authorshipData: string = UUON_ATTRIBUTION.author
): THREE.BufferGeometry {
  const positions = geometry.attributes.position.array as Float32Array;
  
  // Convert authorship string to binary
  const binaryData = stringToBinary(authorshipData);
  const dataLength = binaryData.length;
  
  // Embed data in least significant bits of vertex coordinates
  // Use fractional part manipulation (imperceptible, recoverable)
  const scale = 0.00001; // Small enough to be invisible
  
  for (let i = 0; i < Math.min(dataLength, positions.length); i++) {
    const bit = parseInt(binaryData[i]);
    
    // Encode bit in the fractional part of the coordinate
    const original = positions[i];
    const integer = Math.floor(Math.abs(original));
    const fraction = Math.abs(original) - integer;
    
    // Modify the 5th decimal place based on bit value
    const newFraction = Math.floor(fraction * 10000) / 10000 + (bit * scale);
    positions[i] = (original >= 0 ? 1 : -1) * (integer + newFraction);
  }
  
  geometry.attributes.position.needsUpdate = true;
  geometry.computeBoundingSphere();
  
  // Store watermark metadata for verification
  geometry.userData.watermark = {
    dataLength,
    author: authorshipData,
    timestamp: new Date().toISOString()
  };
  
  return geometry;
}

/**
 * Layer 3: Digital Signature (Metadata + Cryptographic)
 * Creates verifiable signature combining hash + timestamp + attribution
 */
export async function generateDigitalSignature(
  geometry: THREE.BufferGeometry,
  shapeId: string
): Promise<AuthorshipSignature> {
  const timestamp = new Date().toISOString();
  const hash = await generateCryptographicHash(geometry);
  
  // Create signature payload
  const signatureData = {
    hash,
    timestamp,
    shapeId,
    author: UUON_ATTRIBUTION.author,
    organization: UUON_ATTRIBUTION.organization,
    copyright: UUON_ATTRIBUTION.copyright
  };
  
  // Generate verification code (simplified cryptographic signature)
  const verificationCode = await generateVerificationCode(signatureData);
  
  return {
    ...signatureData,
    verificationCode,
    version: '1.0'
  };
}

/**
 * Layer 4: Blockchain-Ready Hash
 * Creates compact hash suitable for blockchain timestamping
 */
export async function generateBlockchainHash(
  geometry: THREE.BufferGeometry,
  metadata: any
): Promise<BlockchainFingerprint> {
  const geometryHash = await generateCryptographicHash(geometry);
  
  // Combine geometry hash with metadata
  const combinedData = JSON.stringify({
    geometry: geometryHash,
    metadata: {
      author: metadata.author || UUON_ATTRIBUTION.author,
      organization: metadata.organization || UUON_ATTRIBUTION.organization,
      shapeId: metadata.shapeId,
      timestamp: new Date().toISOString()
    }
  });
  
  const encoder = new TextEncoder();
  const data = encoder.encode(combinedData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const blockchainHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return {
    hash: blockchainHash,
    geometryHash,
    timestamp: new Date().toISOString(),
    ready: true,
    instructions: 'Use this hash for blockchain timestamping services (ScoreDetect, Stampd.io, Verisart)'
  };
}

/**
 * Extract and verify hidden geometric watermark
 */
export function extractGeometricWatermark(geometry: THREE.BufferGeometry): string | null {
  const positions = geometry.attributes.position.array as Float32Array;
  
  // Check if watermark metadata exists
  if (!geometry.userData.watermark) {
    return null;
  }
  
  const dataLength = geometry.userData.watermark.dataLength;
  const extractedBits: string[] = [];
  const scale = 0.00001;
  const threshold = scale / 2; // Midpoint threshold for bit detection
  
  // Extract bits from coordinates (tolerance-friendly)
  for (let i = 0; i < Math.min(dataLength, positions.length); i++) {
    const value = positions[i];
    const fraction = Math.abs(value) - Math.floor(Math.abs(value));
    
    // Get the fractional part at the scale precision
    const scaledFraction = fraction * 100000; // Scale to 5 decimal places
    const modValue = scaledFraction % 2;
    
    // Use threshold-based detection to handle floating-point errors
    const bit = modValue > threshold * 100000 ? 1 : 0;
    extractedBits.push(bit.toString());
  }
  
  // Convert binary to string
  const extracted = binaryToString(extractedBits.join(''));
  return extracted.substring(0, geometry.userData.watermark.author.length);
}

/**
 * Verify authorship signature
 */
export async function verifyAuthorship(
  geometry: THREE.BufferGeometry,
  signature: AuthorshipSignature
): Promise<VerificationResult> {
  const currentHash = await generateCryptographicHash(geometry);
  const hashMatch = currentHash === signature.hash;
  
  // Check for watermark
  const extractedWatermark = extractGeometricWatermark(geometry);
  const watermarkMatch = extractedWatermark?.includes(signature.author) || false;
  
  return {
    verified: hashMatch || watermarkMatch,
    hashMatch,
    watermarkMatch,
    signature,
    currentHash,
    message: hashMatch 
      ? '✅ Geometry unchanged - authentic UUON Foundation model'
      : watermarkMatch
      ? '⚠️ Geometry modified but watermark intact - likely authentic'
      : '❌ Verification failed - model may be tampered or unauthorized'
  };
}

// Helper functions
function stringToBinary(str: string): string {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

function binaryToString(binary: string): string {
  const bytes = binary.match(/.{1,8}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
}

async function generateVerificationCode(data: any): Promise<string> {
  const jsonStr = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(jsonStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
}

// Types
export interface AuthorshipSignature {
  hash: string;
  timestamp: string;
  shapeId: string;
  author: string;
  organization: string;
  copyright: string;
  verificationCode: string;
  version: string;
}

export interface BlockchainFingerprint {
  hash: string;
  geometryHash: string;
  timestamp: string;
  ready: boolean;
  instructions: string;
}

export interface VerificationResult {
  verified: boolean;
  hashMatch: boolean;
  watermarkMatch: boolean;
  signature: AuthorshipSignature;
  currentHash: string;
  message: string;
}

/**
 * Complete authorship protection package
 */
export async function protectModel(
  geometry: THREE.BufferGeometry,
  shapeId: string,
  includeWatermark: boolean = true
): Promise<{
  geometry: THREE.BufferGeometry;
  signature: AuthorshipSignature;
  blockchainHash: BlockchainFingerprint;
  protection: string[];
}> {
  // Apply geometric watermark if requested
  const protectedGeometry = includeWatermark 
    ? embedGeometricWatermark(geometry.clone(), UUON_ATTRIBUTION.author)
    : geometry.clone();
  
  // Generate digital signature
  const signature = await generateDigitalSignature(protectedGeometry, shapeId);
  
  // Generate blockchain-ready hash
  const blockchainHash = await generateBlockchainHash(protectedGeometry, {
    author: UUON_ATTRIBUTION.author,
    organization: UUON_ATTRIBUTION.organization,
    shapeId
  });
  
  const protectionLayers = [
    '🔒 Cryptographic Hash (SHA-256)',
    '🔐 Digital Signature',
    '🔗 Blockchain-ready Hash'
  ];
  
  if (includeWatermark) {
    protectionLayers.push('🌊 Hidden Geometry Watermark');
  }
  
  return {
    geometry: protectedGeometry,
    signature,
    blockchainHash,
    protection: protectionLayers
  };
}
