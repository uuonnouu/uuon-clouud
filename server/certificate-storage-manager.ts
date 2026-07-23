
import { db as replitDB } from '@replit/database';

export interface StoredCertificate {
  id: string;
  timestamp: string;
  certificateText: string;
  reportData: any;
  averageScore: number;
  totalShapes: number;
}

export class CertificateStorageManager {
  private static readonly CERT_PREFIX = 'proof_cert_';
  private static readonly MAX_CERTIFICATES = 50; // Keep last 50 certificates
  
  static async storeCertificate(certificate: string, report: any): Promise<string> {
    const timestamp = new Date().toISOString();
    const certId = `${this.CERT_PREFIX}${Date.now()}`;
    
    const storedCert: StoredCertificate = {
      id: certId,
      timestamp,
      certificateText: certificate,
      reportData: report,
      averageScore: report.averageScore || 0,
      totalShapes: report.totalShapes || 0
    };
    
    // Store in Replit KV
    await replitDB.set(certId, JSON.stringify(storedCert));
    
    // Cleanup old certificates
    await this.cleanupOldCertificates();
    
    console.log(`📜 Certificate stored: ${certId}`);
    return certId;
  }
  
  static async getCertificate(certId: string): Promise<StoredCertificate | null> {
    try {
      const data = await replitDB.get(certId);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve certificate:', error);
      return null;
    }
  }
  
  static async getAllCertificates(): Promise<StoredCertificate[]> {
    try {
      const keys = await replitDB.list(this.CERT_PREFIX);
      const certificates: StoredCertificate[] = [];
      
      for (const key of keys) {
        const data = await replitDB.get(key);
        if (data) {
          certificates.push(JSON.parse(data));
        }
      }
      
      // Sort by timestamp, newest first
      return certificates.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to retrieve certificates:', error);
      return [];
    }
  }
  
  static async cleanupOldCertificates(): Promise<void> {
    try {
      const certificates = await this.getAllCertificates();
      
      if (certificates.length > this.MAX_CERTIFICATES) {
        // Delete oldest certificates
        const toDelete = certificates.slice(this.MAX_CERTIFICATES);
        
        for (const cert of toDelete) {
          await replitDB.delete(cert.id);
          console.log(`🗑️ Cleaned up old certificate: ${cert.id}`);
        }
      }
    } catch (error) {
      console.error('Certificate cleanup failed:', error);
    }
  }
  
  static async getCertificateStats(): Promise<{
    totalCertificates: number;
    averageScore: number;
    latestScore: number;
    storageUsed: string;
  }> {
    const certificates = await this.getAllCertificates();
    
    if (certificates.length === 0) {
      return {
        totalCertificates: 0,
        averageScore: 0,
        latestScore: 0,
        storageUsed: '0 KB'
      };
    }
    
    const avgScore = certificates.reduce((sum, cert) => sum + cert.averageScore, 0) / certificates.length;
    const latestScore = certificates[0]?.averageScore || 0;
    
    // Estimate storage (rough calculation)
    const totalSize = certificates.reduce((sum, cert) => 
      sum + JSON.stringify(cert).length, 0
    );
    const storageKB = Math.round(totalSize / 1024);
    
    return {
      totalCertificates: certificates.length,
      averageScore: Math.round(avgScore * 100) / 100,
      latestScore: Math.round(latestScore * 100) / 100,
      storageUsed: `${storageKB} KB`
    };
  }
}
/**
 * CERTIFICATE STORAGE MANAGER
 * Efficient storage of proof certificates using Replit KV
 */

interface CertificateStorage {
  id: string;
  certificate: string;
  report: any;
  timestamp: number;
  size: number;
}

interface StorageStats {
  totalCertificates: number;
  storageUsed: string;
  avgCertificateSize: number;
}

export class CertificateStorageManager {
  private static readonly MAX_STORAGE = 50 * 1024 * 1024; // 50MB limit
  private static readonly KEY_PREFIX = 'proof_cert_';
  
  static async storeCertificate(certificate: string, report: any): Promise<string> {
    const certId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const key = this.KEY_PREFIX + certId;
    
    const storage: CertificateStorage = {
      id: certId,
      certificate: certificate.substring(0, 1000), // Truncate for efficiency
      report: {
        timestamp: report.timestamp,
        totalShapes: report.totalShapes,
        averageScore: report.averageScore,
        passedTests: report.passedTests,
        failedTests: report.failedTests
      },
      timestamp: Date.now(),
      size: certificate.length
    };
    
    try {
      // Store in Replit KV if available
      if (process.env.REPLIT_DB_URL) {
        const response = await fetch(`${process.env.REPLIT_DB_URL}/${key}`, {
          method: 'POST',
          body: JSON.stringify(storage)
        });
        
        if (response.ok) {
          console.log(`🏆 Certificate stored in Replit KV: ${certId}`);
          return certId;
        }
      }
      
      // Fallback to memory (development)
      global.certificateCache = global.certificateCache || new Map();
      (global.certificateCache as Map<string, CertificateStorage>).set(key, storage);
      console.log(`🏆 Certificate stored in memory: ${certId}`);
      
      return certId;
      
    } catch (error) {
      console.error('Certificate storage error:', error);
      throw new Error('Failed to store certificate');
    }
  }
  
  static async getCertificate(certId: string): Promise<CertificateStorage | null> {
    const key = this.KEY_PREFIX + certId;
    
    try {
      if (process.env.REPLIT_DB_URL) {
        const response = await fetch(`${process.env.REPLIT_DB_URL}/${key}`);
        if (response.ok) {
          return JSON.parse(await response.text());
        }
      }
      
      // Fallback to memory
      const cache = global.certificateCache as Map<string, CertificateStorage>;
      return cache?.get(key) || null;
      
    } catch (error) {
      console.error('Certificate retrieval error:', error);
      return null;
    }
  }
  
  static async getCertificateStats(): Promise<StorageStats> {
    let totalCertificates = 0;
    let totalSize = 0;
    
    try {
      if (process.env.REPLIT_DB_URL) {
        // Query Replit KV for certificates
        const response = await fetch(`${process.env.REPLIT_DB_URL}?prefix=${this.KEY_PREFIX}`);
        if (response.ok) {
          const keys = (await response.text()).split('\n').filter(k => k);
          totalCertificates = keys.length;
          
          // Estimate size (simplified)
          totalSize = totalCertificates * 2048; // Average estimate
        }
      } else {
        // Memory fallback
        const cache = global.certificateCache as Map<string, CertificateStorage>;
        if (cache) {
          totalCertificates = cache.size;
          for (const cert of cache.values()) {
            totalSize += cert.size;
          }
        }
      }
      
      return {
        totalCertificates,
        storageUsed: this.formatBytes(totalSize),
        avgCertificateSize: totalCertificates > 0 ? Math.round(totalSize / totalCertificates) : 0
      };
      
    } catch (error) {
      console.error('Stats retrieval error:', error);
      return { totalCertificates: 0, storageUsed: '0 B', avgCertificateSize: 0 };
    }
  }
  
  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
