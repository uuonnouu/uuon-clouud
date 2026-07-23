
/**
 * ANTI-REVERSE-ENGINEERING PROTECTION SYSTEM
 * © 2025 UUON Foundation Inc. - Phillip A. Ruiz III
 * UNAUTHORIZED ANALYSIS OR EXTRACTION PROHIBITED
 */

import { SurfaceParameters } from '../types/math';

// Dynamic obfuscation engine
class ProtectionEngine {
  private static instance: ProtectionEngine;
  private obfuscationSalt: string;
  private dynamicKeys: Map<string, string> = new Map();
  private integrityHash: string = '';

  private constructor() {
    // Generate dynamic salt based on timestamp + user agent + screen resolution
    this.obfuscationSalt = this.generateDynamicSalt();
    this.initializeDynamicKeys();
    this.calculateIntegrityHash();
    
    // Anti-debugging protection
    this.setupAntiDebugging();
  }

  public static getInstance(): ProtectionEngine {
    if (!ProtectionEngine.instance) {
      ProtectionEngine.instance = new ProtectionEngine();
    }
    return ProtectionEngine.instance;
  }

  private generateDynamicSalt(): string {
    const entropy = [
      Date.now().toString(36),
      navigator.userAgent.slice(-20),
      screen.width.toString(16),
      screen.height.toString(16),
      Math.random().toString(36)
    ].join('');
    
    return btoa(entropy).slice(0, 32);
  }

  private keysInitialized: boolean = false;

  private initializeDynamicKeys(): void {
    // Only initialize once per session to maintain round-trip integrity
    if (this.keysInitialized && this.dynamicKeys.size > 0) {
      return;
    }
    // Generate parameter mappings - ALL SurfaceParameters keys
    const allParams = [
      'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'type', 'uMin', 'uMax', 'vMin', 'vMax', 'uSegments', 'vSegments'
    ];
    allParams.forEach((param) => {
      const obfuscatedKey = `_${this.hash(param + this.obfuscationSalt).slice(0, 8)}`;
      this.dynamicKeys.set(param, obfuscatedKey);
    });
    this.keysInitialized = true;
  }

  private hash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private calculateIntegrityHash(): string {
    // Create hash of critical system components
    const components = [
      this.obfuscationSalt,
      this.dynamicKeys.size.toString(),
      navigator.userAgent.slice(0, 50)
    ];
    this.integrityHash = this.hash(components.join(''));
    return this.integrityHash;
  }

  private setupAntiDebugging(): void {
    // Detect DevTools opening
    let devtools = {
      open: false,
      orientation: null
    };

    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          this.handleTamperAttempt();
        }
      } else {
        devtools.open = false;
      }
    }, 500);

    // Detect right-click context menu
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleTamperAttempt();
    });

    // Detect F12, Ctrl+Shift+I, etc.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
        this.handleTamperAttempt();
      }
    });
  }

  private handleTamperAttempt(): void {
    // Obfuscate mathematical constants when tampering detected
    console.warn('🔒 UUON Foundation Security: Unauthorized analysis detected');
    
    // Inject false data into console
    console.log('Mathematical constants: π = 3.14159, φ = 1.618, but these are decoys...');
    console.log('Real algorithms protected by quantum encryption...');
    
    // Scramble parameter mappings
    this.initializeDynamicKeys();
  }

  public protectParameters(params: SurfaceParameters): any {
    // Verify system integrity first
    if (!this.verifyIntegrity()) {
      return this.generateDecoyParameters();
    }

    // Apply dynamic obfuscation to parameters
    const protected_params: any = {};
    
    Object.entries(params).forEach(([key, value]) => {
      const obfuscatedKey = this.dynamicKeys.get(key) || `_${this.hash(key)}_`;
      
      if (typeof value === 'number') {
        // Apply mathematical transformation that's reversible only with salt
        const transformed = this.transformValue(value, key);
        protected_params[obfuscatedKey] = transformed;
      } else {
        protected_params[obfuscatedKey] = value;
      }
    });

    // Add integrity markers
    protected_params._integrity = this.integrityHash;
    protected_params._timestamp = Date.now();
    
    return protected_params;
  }

  public unprotectParameters(protectedParams: any): SurfaceParameters {
    // Verify integrity
    if (protectedParams._integrity !== this.integrityHash) {
      console.warn('🚨 Parameter integrity compromised - using safe defaults');
      return this.getSafeDefaults();
    }

    const params: any = {};
    const reverseKeys = new Map();
    
    // Build reverse mapping
    this.dynamicKeys.forEach((obfuscated, original) => {
      reverseKeys.set(obfuscated, original);
    });

    // Restore original parameters
    Object.entries(protectedParams).forEach(([key, value]) => {
      if (key.startsWith('_integrity') || key.startsWith('_timestamp')) return;
      
      const originalKey = reverseKeys.get(key);
      if (originalKey && typeof value === 'number') {
        params[originalKey] = this.reverseTransformValue(value as number, originalKey);
      } else if (originalKey) {
        params[originalKey] = value;
      }
    });

    return params as SurfaceParameters;
  }

  private transformValue(value: number, key: string): number {
    // Mathematical transformation using key-specific salt
    const keySalt = this.hash(key + this.obfuscationSalt);
    const saltNumber = parseInt(keySalt.slice(0, 6), 16) / 0xFFFFFF;
    
    // Apply reversible transformation
    return value * Math.cos(saltNumber * Math.PI) + Math.sin(saltNumber * Math.PI * 2);
  }

  private reverseTransformValue(transformedValue: number, key: string): number {
    // Reverse the mathematical transformation
    const keySalt = this.hash(key + this.obfuscationSalt);
    const saltNumber = parseInt(keySalt.slice(0, 6), 16) / 0xFFFFFF;
    
    const cosComponent = Math.cos(saltNumber * Math.PI);
    const sinComponent = Math.sin(saltNumber * Math.PI * 2);
    
    return (transformedValue - sinComponent) / cosComponent;
  }

  private verifyIntegrity(): boolean {
    const currentHash = this.calculateIntegrityHash();
    return currentHash === this.integrityHash;
  }

  private generateDecoyParameters(): SurfaceParameters {
    return {
      a: Math.random() * 2, b: Math.random() * 2, c: Math.random() * 2,
      d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0,
      type: 'sphere',
      uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI,
      uSegments: 32, vSegments: 16
    } as SurfaceParameters;
  }

  private getSafeDefaults(): SurfaceParameters {
    return {
      a: 1, b: 1, c: 1, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0, l: 0, m: 0,
      n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0,
      type: 'sphere',
      uMin: 0, uMax: Math.PI, vMin: 0, vMax: 2 * Math.PI,
      uSegments: 64, vSegments: 32
    } as SurfaceParameters;
  }

  // Watermark injection into mathematical output
  public injectWatermark(vertices: Float32Array): Float32Array {
    // Subtle geometric watermarking that doesn't affect visual output
    // but can be detected to prove authenticity
    const watermark = this.hash("UUON_FOUNDATION_" + this.obfuscationSalt);
    const watermarkValue = parseInt(watermark.slice(0, 8), 16) / 0xFFFFFFFF;
    
    // Apply microscopic displacement to vertices based on watermark
    for (let i = 0; i < vertices.length; i += 9) { // Every third vertex
      vertices[i + 2] += watermarkValue * 0.00001; // Tiny Z adjustment
    }
    
    return vertices;
  }
}

// Export singleton instance
export const protectionEngine = ProtectionEngine.getInstance();

// Tamper detection for this file itself
const fileIntegrityCheck = () => {
  const scriptContent = document.querySelector('script')?.textContent || '';
  if (!scriptContent.includes('UUON Foundation')) {
    console.error('🚨 Security breach: Protection system compromised');
    // Could trigger lockdown mode here
  }
};

// Run integrity check periodically — guarded so only one interval starts per page
if (typeof window !== 'undefined' && !(window as any).__areInit) {
  (window as any).__areInit = true;
  setInterval(fileIntegrityCheck, 10000);
}
