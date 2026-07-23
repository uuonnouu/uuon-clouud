/**
 * UUON FOUNDATION VERIFICATION REGISTRY
 * 
 * Public registry for SHA-256 hashes of all mathematical shapes
 * Allows anyone to verify authenticity of exported models
 * 
 * © 2025 UUON Foundation Inc.
 */

import { generateCryptographicHash } from './authorshipFingerprint';
import * as THREE from 'three';

export interface ShapeRegistryEntry {
  shapeId: string;
  shapeName: string;
  category: string;
  geometryHash: string;
  formulaHash: string;
  registrationDate: string;
  author: string;
  organization: string;
  verificationUrl: string;
}

export interface VerificationResult {
  verified: boolean;
  shapeId?: string;
  shapeName?: string;
  category?: string;
  author?: string;
  organization?: string;
  registrationDate?: string;
  message: string;
  confidence: 'exact' | 'formula_match' | 'partial' | 'not_found';
}

const VERIFICATION_BASE_URL = 'https://uuonfoundation.com/verify';
const REGISTRY_VERSION = '1.0.0';

class VerificationRegistry {
  private static instance: VerificationRegistry;
  private registry: Map<string, ShapeRegistryEntry> = new Map();
  private formulaHashes: Map<string, string> = new Map();
  private initialized: boolean = false;

  static getInstance(): VerificationRegistry {
    if (!VerificationRegistry.instance) {
      VerificationRegistry.instance = new VerificationRegistry();
    }
    return VerificationRegistry.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    console.log('🔐 UUON Verification Registry initialized');
  }

  async registerShape(
    shapeId: string,
    shapeName: string,
    category: string,
    formula: string,
    geometry?: THREE.BufferGeometry
  ): Promise<ShapeRegistryEntry> {
    const formulaHash = await this.hashString(formula);
    const geometryHash = geometry 
      ? await generateCryptographicHash(geometry)
      : await this.hashString(`${shapeId}_${shapeName}_${formula}`);

    const entry: ShapeRegistryEntry = {
      shapeId,
      shapeName,
      category,
      geometryHash,
      formulaHash,
      registrationDate: new Date().toISOString(),
      author: 'Phillip Aguilar Ruiz III',
      organization: 'UUON Foundation Inc.',
      verificationUrl: `${VERIFICATION_BASE_URL}?hash=${geometryHash.substring(0, 16)}`
    };

    this.registry.set(geometryHash, entry);
    this.formulaHashes.set(formulaHash, shapeId);

    return entry;
  }

  async verifyHash(hash: string): Promise<VerificationResult> {
    const cleanHash = hash.trim().toLowerCase();

    const exactMatch = this.registry.get(cleanHash);
    if (exactMatch) {
      return {
        verified: true,
        shapeId: exactMatch.shapeId,
        shapeName: exactMatch.shapeName,
        category: exactMatch.category,
        author: exactMatch.author,
        organization: exactMatch.organization,
        registrationDate: exactMatch.registrationDate,
        message: '✅ VERIFIED: This is an authentic UUON Foundation mathematical model',
        confidence: 'exact'
      };
    }

    const entries = Array.from(this.registry.entries());
    for (const [registeredHash, entry] of entries) {
      if (registeredHash.startsWith(cleanHash) || cleanHash.startsWith(registeredHash.substring(0, 16))) {
        return {
          verified: true,
          shapeId: entry.shapeId,
          shapeName: entry.shapeName,
          category: entry.category,
          author: entry.author,
          organization: entry.organization,
          registrationDate: entry.registrationDate,
          message: '⚠️ PARTIAL MATCH: Likely authentic but geometry may have been modified',
          confidence: 'partial'
        };
      }
    }

    return {
      verified: false,
      message: '❌ NOT FOUND: This hash is not in the UUON Foundation registry. The model may be unofficial or modified.',
      confidence: 'not_found'
    };
  }

  async verifyFormula(formula: string): Promise<VerificationResult> {
    const formulaHash = await this.hashString(formula);
    const shapeId = this.formulaHashes.get(formulaHash);

    if (shapeId) {
      const registryValues = Array.from(this.registry.values());
      for (const entry of registryValues) {
        if (entry.shapeId === shapeId) {
          return {
            verified: true,
            shapeId: entry.shapeId,
            shapeName: entry.shapeName,
            category: entry.category,
            author: entry.author,
            organization: entry.organization,
            message: '✅ FORMULA VERIFIED: This mathematical formula is registered to UUON Foundation',
            confidence: 'formula_match'
          };
        }
      }
    }

    return {
      verified: false,
      message: '❌ Formula not found in registry',
      confidence: 'not_found'
    };
  }

  getPublicRegistry(): ShapeRegistryEntry[] {
    return Array.from(this.registry.values()).map(entry => ({
      ...entry,
      geometryHash: entry.geometryHash.substring(0, 32) + '...'
    }));
  }

  getFullRegistry(): ShapeRegistryEntry[] {
    return Array.from(this.registry.values());
  }

  getRegistryStats(): {
    totalShapes: number;
    categories: string[];
    registryVersion: string;
    lastUpdated: string;
  } {
    const categories = Array.from(new Set(Array.from(this.registry.values()).map(e => e.category)));
    const entries = Array.from(this.registry.values());
    const lastUpdated = entries.length > 0 
      ? entries.sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())[0].registrationDate
      : new Date().toISOString();

    return {
      totalShapes: this.registry.size,
      categories,
      registryVersion: REGISTRY_VERSION,
      lastUpdated
    };
  }

  generateVerificationUrl(hash: string): string {
    return `${VERIFICATION_BASE_URL}?hash=${hash.substring(0, 32)}`;
  }

  private async hashString(input: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  exportRegistryAsJSON(): string {
    const data = {
      version: REGISTRY_VERSION,
      exportDate: new Date().toISOString(),
      author: 'UUON Foundation Inc.',
      contact: 'phi1@uuonfoundation.com',
      website: 'https://uuonfoundation.com',
      registry: this.getFullRegistry()
    };
    return JSON.stringify(data, null, 2);
  }
}

export const verificationRegistry = VerificationRegistry.getInstance();

export async function generateVerificationQRData(
  shapeId: string,
  geometryHash: string
): Promise<{
  url: string;
  shortCode: string;
  qrData: string;
}> {
  const shortCode = geometryHash.substring(0, 12).toUpperCase();
  const url = `${VERIFICATION_BASE_URL}?hash=${geometryHash.substring(0, 32)}&id=${encodeURIComponent(shapeId)}`;
  
  const qrData = JSON.stringify({
    v: '1',
    t: 'UUON',
    h: shortCode,
    i: shapeId,
    u: url
  });

  return { url, shortCode, qrData };
}

export function generateVerificationBadge(verified: boolean, confidence: string): string {
  if (verified) {
    switch (confidence) {
      case 'exact':
        return '🟢 VERIFIED AUTHENTIC';
      case 'formula_match':
        return '🟢 FORMULA VERIFIED';
      case 'partial':
        return '🟡 LIKELY AUTHENTIC';
      default:
        return '🟢 VERIFIED';
    }
  }
  return '🔴 NOT VERIFIED';
}
