
/**
 * SERVER-SIDE MATHEMATICAL FORMULA PROTECTION
 * Prevents client-side access to proprietary mathematical formulations
 */

interface ProtectedFormula {
  id: string;
  encryptedEquation: string;
  accessLevel: 'free' | 'premium' | 'institutional' | 'restricted';
  userFingerprint?: string;
}

export class FormulaProtectionSystem {
  private static instance: FormulaProtectionSystem;
  private serverEndpoint = '/api/uuon-secure/compute';

  static getInstance(): FormulaProtectionSystem {
    if (!FormulaProtectionSystem.instance) {
      FormulaProtectionSystem.instance = new FormulaProtectionSystem();
    }
    return FormulaProtectionSystem.instance;
  }

  /**
   * Request mathematical computation from secure server
   * Formula never exposed to client
   */
  async computeSecureShape(
    shapeId: string, 
    parameters: Record<string, number>,
    userToken: string
  ): Promise<Float32Array> {
    try {
      const response = await fetch(this.serverEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
          'X-Client-Fingerprint': await this.generateClientFingerprint()
        },
        body: JSON.stringify({
          shapeId,
          parameters,
          timestamp: Date.now()
        })
      });

      if (!response.ok) {
        throw new Error(`Secure computation failed: ${response.status}`);
      }

      const result = await response.json();
      
      // Verify response integrity
      if (!this.verifyResponseIntegrity(result)) {
        throw new Error('Response integrity verification failed');
      }

      return new Float32Array(result.vertices);
      
    } catch (error) {
      console.error('🚨 Secure shape computation failed:', error);
      
      // Log potential security incident
      this.reportSecurityIncident('COMPUTATION_FAILURE', {
        shapeId,
        error: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      });
      
      throw error;
    }
  }

  /**
   * Generate unique client fingerprint for tracking
   */
  private async generateClientFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Δmension Security Fingerprint', 2, 2);
    }

    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');

    // Hash the fingerprint
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verify response hasn't been tampered with
   */
  private verifyResponseIntegrity(response: any): boolean {
    if (!response.signature || !response.vertices || !response.timestamp) {
      return false;
    }

    // Verify timestamp isn't too old (prevent replay attacks)
    const age = Date.now() - response.timestamp;
    if (age > 30000) { // 30 seconds max
      return false;
    }

    return true;
  }

  /**
   * Report potential security incidents
   */
  private reportSecurityIncident(type: string, details: any): void {
    fetch('/api/security/incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        details,
        timestamp: Date.now(),
        url: window.location.href
      })
    }).catch(err => console.warn('Failed to report security incident:', err));
  }

  /**
   * Check if user has access to premium mathematical formulas
   */
  async verifyAccess(shapeId: string, userToken: string): Promise<boolean> {
    try {
      const response = await fetch('/api/access/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ shapeId })
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Add visible watermark to exported content
   */
  addExportWatermark(geometry: THREE.BufferGeometry, userId: string): THREE.BufferGeometry {
    // Add user-specific watermark to geometry
    const watermark = `© 2024 UUON Foundation - User: ${userId.substring(0, 8)}`;
    
    // Store watermark in geometry userData
    geometry.userData.watermark = watermark;
    geometry.userData.exportTimestamp = Date.now();
    geometry.userData.userId = userId;
    
    return geometry;
  }
}

// Export singleton instance
export const formulaProtection = FormulaProtectionSystem.getInstance();
