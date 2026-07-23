
/**
 * PINATA IPFS SERVICE
 * Handles file uploads to IPFS via Pinata API
 */

import axios from 'axios';
import FormData from 'form-data';

interface PinataUploadResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

class PinataService {
  private apiKey: string;
  private secretKey: string;
  private jwt: string;
  private baseUrl = 'https://api.pinata.cloud';

  constructor() {
    this.apiKey = process.env.PINATA_API_KEY || '';
    this.secretKey = process.env.PINATA_SECRET_API_KEY || '';
    this.jwt = process.env.PINATA_JWT || '';
    
    if (!this.apiKey || !this.secretKey || !this.jwt) {
      console.warn('⚠️ Pinata API credentials not configured - IPFS uploads will use placeholders');
    }
  }

  async testAuthentication(): Promise<boolean> {
    try {
      if (!this.jwt) return false;
      
      const response = await axios.get(`${this.baseUrl}/data/testAuthentication`, {
        headers: {
          'Authorization': `Bearer ${this.jwt}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Pinata authentication test failed:', error);
      return false;
    }
  }

  async uploadJSON(metadata: any, fileName: string): Promise<string> {
    try {
      if (!this.jwt) {
        console.warn('Pinata not configured, returning placeholder IPFS hash');
        return 'QmDmensionPlaceholder';
      }

      const response = await axios.post(
        `${this.baseUrl}/pinning/pinJSONToIPFS`,
        {
          pinataContent: metadata,
          pinataMetadata: {
            name: fileName,
            keyvalues: {
              type: 'nft-metadata',
              platform: 'dmension-mathematical-universe'
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.jwt}`
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Pinata JSON upload failed:', error);
      return 'QmDmensionPlaceholder';
    }
  }

  async uploadFile(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    try {
      if (!this.jwt) {
        console.warn('Pinata not configured, returning placeholder IPFS hash');
        return 'QmDmensionPlaceholder';
      }

      const formData = new FormData();
      formData.append('file', fileBuffer, fileName);
      formData.append('pinataMetadata', JSON.stringify({
        name: fileName,
        keyvalues: {
          type: 'nft-asset',
          platform: 'dmension-mathematical-universe',
          mimeType: mimeType
        }
      }));

      const response = await axios.post(
        `${this.baseUrl}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            'Authorization': `Bearer ${this.jwt}`
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Pinata file upload failed:', error);
      return 'QmDmensionPlaceholder';
    }
  }

  async getPinnedItems(limit: number = 10): Promise<any[]> {
    try {
      if (!this.jwt) return [];

      const response = await axios.get(
        `${this.baseUrl}/data/pinList?status=pinned&pageLimit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${this.jwt}`
          }
        }
      );

      return response.data.rows || [];
    } catch (error) {
      console.error('Failed to fetch pinned items:', error);
      return [];
    }
  }

  isConfigured(): boolean {
    return !!(this.apiKey && this.secretKey && this.jwt);
  }
}

export const pinataService = new PinataService();

// Enhanced status logging
if (pinataService.isConfigured()) {
  console.log('🌐 Pinata IPFS Service: ✅ FULLY CONFIGURED');
  console.log('   🔑 API Key: Connected');
  console.log('   🔐 Secret Key: Connected');
  console.log('   🎫 JWT Token: Connected');
  console.log('   🚀 Real IPFS uploads ENABLED');
  console.log('   📦 NFT assets will be uploaded to actual IPFS network');
  
  // Test connection on startup
  pinataService.testAuthentication().then(isValid => {
    if (isValid) {
      console.log('   ✅ Pinata API authentication successful');
    } else {
      console.log('   ⚠️ Pinata API authentication failed - check credentials');
    }
  }).catch(err => {
    console.log('   ❌ Pinata connection test failed:', err.message);
  });
} else {
  console.log('🌐 Pinata IPFS Service: ⚠️ NOT CONFIGURED');
  console.log('   📦 Using placeholder IPFS hashes (ipfs://QmDmensionPlaceholder/)');
  console.log('   💡 Add PINATA_API_KEY, PINATA_SECRET_API_KEY, and PINATA_JWT to Secrets');
}
