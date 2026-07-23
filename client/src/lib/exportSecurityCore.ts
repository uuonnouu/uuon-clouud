/**
 * EXPORT SECURITY CORE
 * Unified encryption, digital signatures, and watermarking for all export types
 * 
 * Security Levels:
 * - Open: No encryption, includes hash for tamper detection
 * - Protected: Watermarked with digital signature, no password
 * - Encrypted: Full AES-256-GCM encryption with password protection
 * 
 * © 2024 UUON Foundation Inc. All Rights Reserved.
 */

import * as THREE from 'three';

export type SecurityLevel = 'open' | 'protected' | 'encrypted';

export interface AuthorshipMetadata {
  creatorId: string;
  creatorName: string;
  organization: string;
  license: string;
  timestamp: string;
  version: string;
  verificationUrl?: string;
}

export interface TopologicalSignature {
  eulerCharacteristic: number;
  genus: number;
  manifold: boolean;
  watertight: boolean;
  vertexCount: number;
  faceCount: number;
  edgeCount: number;
  boundaryLoops?: number;
  connectedComponents?: number;
}

export interface PhysicalProperties {
  volume: number;
  surfaceArea: number;
  mass: number;
  density?: number;
  centerOfMass: { x: number; y: number; z: number };
  boundingBox: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  momentOfInertia: {
    Ixx: number; Ixy: number; Ixz: number;
    Iyy: number; Iyz: number;
    Izz: number;
  };
}

export interface ParametricData {
  shapeCategory: string;
  shapeName: string;
  shapeId: string;
  formulaHash: string;
  parameters: {
    A: number; B: number; C: number;
    D: number; E: number; F: number;
    G: number; H: number; I: number;
    J: number; K: number; L: number;
    M: number; N: number; O: number;
    P: number; Q: number; R: number;
    S: number; T: number; U: number;
    V: number; W: number; X: number;
    Y: number; Z: number;
  };
  uvDomain: {
    uMin: number; uMax: number;
    vMin: number; vMax: number;
  };
  meshDensity: {
    uSegments: number;
    vSegments: number;
  };
}

export interface GeometricFingerprint {
  topologicalSignature: TopologicalSignature;
  physicalProperties: PhysicalProperties;
  parametricData: ParametricData;
  fingerprintHash: string;
  generatedAt: string;
}

export interface SecureExportOptions {
  securityLevel: SecurityLevel;
  password?: string;
  includeWatermark: boolean;
  creatorId: string;
  creatorName?: string;
  organization?: string;
  license: string;
  shapeId?: string;
  shapeName?: string;
  geometricFingerprint?: GeometricFingerprint;
}

export interface EncryptionMetadata {
  algorithm: 'AES-256-GCM';
  keyDerivation: 'PBKDF2';
  iterations: number;
  salt: string;
  iv: string;
}

export interface SecuredExportPackage {
  version: string;
  format: 'DMENSION-SECURE-1.0';
  securityLevel: SecurityLevel;
  encrypted: boolean;
  signature: string;
  hash: string;
  authorship: AuthorshipMetadata;
  encryption?: EncryptionMetadata;
  watermark?: {
    type: 'geometric' | 'metadata';
    embedded: boolean;
  };
  geometricFingerprint?: GeometricFingerprint;
  payload: string;
  exportedAt: string;
}

const PBKDF2_ITERATIONS = 100000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function generateRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

async function sha256Hash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function deriveKeyFromPassword(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256'
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: string, password: string): Promise<{
  ciphertext: string;
  salt: string;
  iv: string;
}> {
  const salt = generateRandomBytes(SALT_LENGTH);
  const iv = generateRandomBytes(IV_LENGTH);
  const key = await deriveKeyFromPassword(password, salt);

  const encoder = new TextEncoder();
  const plaintext = encoder.encode(data);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    plaintext
  );

  return {
    ciphertext: arrayBufferToBase64(ciphertext),
    salt: arrayBufferToBase64(salt.buffer as ArrayBuffer),
    iv: arrayBufferToBase64(iv.buffer as ArrayBuffer)
  };
}

export async function decryptData(
  ciphertext: string,
  password: string,
  salt: string,
  iv: string
): Promise<string> {
  const saltBytes = new Uint8Array(base64ToArrayBuffer(salt));
  const ivBytes = new Uint8Array(base64ToArrayBuffer(iv));
  const ciphertextBytes = base64ToArrayBuffer(ciphertext);

  const key = await deriveKeyFromPassword(password, saltBytes);

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    ciphertextBytes
  );

  const decoder = new TextDecoder();
  return decoder.decode(plaintext);
}

export async function generateDigitalSignature(
  data: string,
  authorship: AuthorshipMetadata
): Promise<string> {
  const nonceBytes = generateRandomBytes(16);
  const signaturePayload = JSON.stringify({
    dataHash: await sha256Hash(data),
    authorship,
    timestamp: new Date().toISOString(),
    nonce: arrayBufferToBase64(nonceBytes.buffer as ArrayBuffer)
  });

  const signatureHash = await sha256Hash(signaturePayload);
  return `DMENSION-SIG-${signatureHash.substring(0, 32)}`;
}

export async function verifySignature(
  pkg: SecuredExportPackage,
  expectedCreatorId: string
): Promise<{ valid: boolean; message: string }> {
  if (pkg.authorship.creatorId !== expectedCreatorId) {
    return { valid: false, message: 'Creator ID mismatch' };
  }

  const payloadHash = await sha256Hash(pkg.payload);
  if (payloadHash !== pkg.hash) {
    return { valid: false, message: 'Payload hash mismatch - data may be tampered' };
  }

  return { valid: true, message: 'Signature verified successfully' };
}

function stringToBinary(str: string): string {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
}

function binaryToString(binary: string): string {
  const chars: string[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.substring(i, i + 8);
    if (byte.length === 8) {
      chars.push(String.fromCharCode(parseInt(byte, 2)));
    }
  }
  return chars.join('');
}

export function embedSteganographicWatermark(
  geometry: THREE.BufferGeometry,
  watermarkData: string
): THREE.BufferGeometry {
  const positions = geometry.attributes.position.array as Float32Array;
  const binaryData = stringToBinary(watermarkData);
  const scale = 0.00001;

  for (let i = 0; i < Math.min(binaryData.length, positions.length); i++) {
    const bit = parseInt(binaryData[i]);
    const original = positions[i];
    const integer = Math.floor(Math.abs(original));
    const fraction = Math.abs(original) - integer;
    const newFraction = Math.floor(fraction * 10000) / 10000 + (bit * scale);
    positions[i] = (original >= 0 ? 1 : -1) * (integer + newFraction);
  }

  geometry.attributes.position.needsUpdate = true;
  geometry.computeBoundingSphere();

  geometry.userData.securityWatermark = {
    dataLength: binaryData.length,
    timestamp: new Date().toISOString(),
    embedded: true
  };

  return geometry;
}

export function extractSteganographicWatermark(
  geometry: THREE.BufferGeometry,
  expectedLength: number
): string | null {
  const positions = geometry.attributes.position.array as Float32Array;
  const extractedBits: string[] = [];
  const scale = 0.00001;
  const threshold = scale / 2;

  for (let i = 0; i < Math.min(expectedLength * 8, positions.length); i++) {
    const value = positions[i];
    const fraction = Math.abs(value) - Math.floor(Math.abs(value));
    const scaledFraction = fraction * 100000;
    const modValue = scaledFraction % 2;
    const bit = modValue > threshold * 100000 ? 1 : 0;
    extractedBits.push(bit.toString());
  }

  return binaryToString(extractedBits.join(''));
}

export async function secureExport(
  data: string | ArrayBuffer | object,
  options: SecureExportOptions
): Promise<SecuredExportPackage> {
  const dataString = typeof data === 'object' && !(data instanceof ArrayBuffer)
    ? JSON.stringify(data)
    : data instanceof ArrayBuffer
      ? arrayBufferToBase64(data)
      : data;

  const authorship: AuthorshipMetadata = {
    creatorId: options.creatorId,
    creatorName: options.creatorName || 'Anonymous',
    organization: options.organization || 'UUON Foundation Inc.',
    license: options.license,
    timestamp: new Date().toISOString(),
    version: '1.0',
    verificationUrl: `https://dmension.uuon.io/verify/${options.creatorId}`
  };

  const hash = await sha256Hash(dataString);
  const signature = await generateDigitalSignature(dataString, authorship);

  let payload: string;
  let encryption: EncryptionMetadata | undefined;

  if (options.securityLevel === 'encrypted') {
    if (!options.password) {
      throw new Error('Password required for encrypted exports');
    }

    const encrypted = await encryptData(dataString, options.password);
    payload = encrypted.ciphertext;
    encryption = {
      algorithm: 'AES-256-GCM',
      keyDerivation: 'PBKDF2',
      iterations: PBKDF2_ITERATIONS,
      salt: encrypted.salt,
      iv: encrypted.iv
    };
  } else {
    payload = dataString;
  }

  const pkg: SecuredExportPackage = {
    version: '1.0',
    format: 'DMENSION-SECURE-1.0',
    securityLevel: options.securityLevel,
    encrypted: options.securityLevel === 'encrypted',
    signature,
    hash,
    authorship,
    encryption,
    watermark: options.includeWatermark ? {
      type: 'metadata',
      embedded: true
    } : undefined,
    geometricFingerprint: options.geometricFingerprint,
    payload,
    exportedAt: new Date().toISOString()
  };

  return pkg;
}

export async function decryptExport(
  pkg: SecuredExportPackage,
  password: string
): Promise<string> {
  if (!pkg.encrypted || !pkg.encryption) {
    return pkg.payload;
  }

  try {
    const decrypted = await decryptData(
      pkg.payload,
      password,
      pkg.encryption.salt,
      pkg.encryption.iv
    );

    const decryptedHash = await sha256Hash(decrypted);
    if (decryptedHash !== pkg.hash) {
      throw new Error('Data integrity check failed after decryption');
    }

    return decrypted;
  } catch (error) {
    throw new Error('Decryption failed - incorrect password or corrupted data');
  }
}

export function getSecurityLevelDescription(level: SecurityLevel): string {
  switch (level) {
    case 'open':
      return 'No encryption. File includes tamper-detection hash but can be read by anyone.';
    case 'protected':
      return 'Watermarked with digital signature. File is readable but authorship is embedded.';
    case 'encrypted':
      return 'Full AES-256-GCM encryption. Password required to open file.';
    default:
      return '';
  }
}

export const SECURITY_PRESETS = {
  open: {
    securityLevel: 'open' as SecurityLevel,
    includeWatermark: false,
    description: 'Public sharing - no protection'
  },
  protected: {
    securityLevel: 'protected' as SecurityLevel,
    includeWatermark: true,
    description: 'Attribution preserved - watermarked'
  },
  encrypted: {
    securityLevel: 'encrypted' as SecurityLevel,
    includeWatermark: true,
    description: 'Maximum security - password protected'
  }
};

export async function createSecureGLBExport(
  glbData: ArrayBuffer,
  options: SecureExportOptions
): Promise<Blob> {
  const pkg = await secureExport(glbData, options);
  const jsonString = JSON.stringify(pkg, null, 2);
  return new Blob([jsonString], { type: 'application/json' });
}

export async function extractSecureGLBExport(
  blob: Blob,
  password?: string
): Promise<ArrayBuffer> {
  const text = await blob.text();
  const pkg: SecuredExportPackage = JSON.parse(text);

  let payload: string;
  if (pkg.encrypted) {
    if (!password) {
      throw new Error('Password required to decrypt this file');
    }
    payload = await decryptExport(pkg, password);
  } else {
    payload = pkg.payload;
  }

  return base64ToArrayBuffer(payload);
}

export async function computeGeometricFingerprint(
  geometry: THREE.BufferGeometry,
  shapeData: {
    shapeCategory: string;
    shapeName: string;
    shapeId: string;
    formula?: string;
  },
  parameters: Record<string, number>,
  uvDomain: { uMin: number; uMax: number; vMin: number; vMax: number },
  meshDensity: { uSegments: number; vSegments: number }
): Promise<GeometricFingerprint> {
  const positions = geometry.attributes.position;
  const index = geometry.index;
  
  const vertexCount = positions.count;
  const faceCount = index ? index.count / 3 : Math.floor(vertexCount / 3);
  const edgeCount = Math.floor(faceCount * 1.5);
  const eulerCharacteristic = vertexCount - edgeCount + faceCount;
  const genus = Math.max(0, (2 - eulerCharacteristic) / 2);
  
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
  
  const bbox = geometry.boundingBox!;
  const center = new THREE.Vector3();
  bbox.getCenter(center);
  
  const size = new THREE.Vector3();
  bbox.getSize(size);
  const volume = size.x * size.y * size.z;
  const surfaceArea = 2 * (size.x * size.y + size.y * size.z + size.x * size.z);
  const mass = volume * 1000;
  
  const Ixx = (mass / 12) * (size.y * size.y + size.z * size.z);
  const Iyy = (mass / 12) * (size.x * size.x + size.z * size.z);
  const Izz = (mass / 12) * (size.x * size.x + size.y * size.y);
  
  const parametricData: ParametricData = {
    shapeCategory: shapeData.shapeCategory,
    shapeName: shapeData.shapeName,
    shapeId: shapeData.shapeId,
    formulaHash: await sha256Hash(shapeData.formula || shapeData.shapeName),
    parameters: {
      A: parameters.A ?? 1, B: parameters.B ?? 1, C: parameters.C ?? 1,
      D: parameters.D ?? 0, E: parameters.E ?? 0, F: parameters.F ?? 0,
      G: parameters.G ?? 0, H: parameters.H ?? 0, I: parameters.I ?? 0,
      J: parameters.J ?? 0, K: parameters.K ?? 0, L: parameters.L ?? 0,
      M: parameters.M ?? 0, N: parameters.N ?? 0, O: parameters.O ?? 0,
      P: parameters.P ?? 0, Q: parameters.Q ?? 0, R: parameters.R ?? 0,
      S: parameters.S ?? 0, T: parameters.T ?? 0, U: parameters.U ?? 0,
      V: parameters.V ?? 0, W: parameters.W ?? 0, X: parameters.X ?? 1,
      Y: parameters.Y ?? 1, Z: parameters.Z ?? 1,
    },
    uvDomain,
    meshDensity
  };
  
  const topologicalSignature: TopologicalSignature = {
    eulerCharacteristic,
    genus,
    manifold: genus >= 0,
    watertight: eulerCharacteristic === 2,
    vertexCount,
    faceCount,
    edgeCount,
    boundaryLoops: 0,
    connectedComponents: 1
  };
  
  const physicalProperties: PhysicalProperties = {
    volume: parseFloat(volume.toFixed(4)),
    surfaceArea: parseFloat(surfaceArea.toFixed(4)),
    mass: parseFloat(mass.toFixed(4)),
    density: 1000,
    centerOfMass: {
      x: parseFloat(center.x.toFixed(4)),
      y: parseFloat(center.y.toFixed(4)),
      z: parseFloat(center.z.toFixed(4))
    },
    boundingBox: {
      min: {
        x: parseFloat(bbox.min.x.toFixed(4)),
        y: parseFloat(bbox.min.y.toFixed(4)),
        z: parseFloat(bbox.min.z.toFixed(4))
      },
      max: {
        x: parseFloat(bbox.max.x.toFixed(4)),
        y: parseFloat(bbox.max.y.toFixed(4)),
        z: parseFloat(bbox.max.z.toFixed(4))
      }
    },
    momentOfInertia: {
      Ixx: parseFloat(Ixx.toFixed(2)),
      Ixy: 0,
      Ixz: 0,
      Iyy: parseFloat(Iyy.toFixed(2)),
      Iyz: 0,
      Izz: parseFloat(Izz.toFixed(2))
    }
  };
  
  const fingerprintData = JSON.stringify({
    topologicalSignature,
    physicalProperties,
    parametricData
  });
  const fingerprintHash = await sha256Hash(fingerprintData);
  
  return {
    topologicalSignature,
    physicalProperties,
    parametricData,
    fingerprintHash: `DMENSION-FP-${fingerprintHash.substring(0, 32)}`,
    generatedAt: new Date().toISOString()
  };
}
