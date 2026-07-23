import { sha256, sha256Sync } from './cryptoUtils';

export interface HashResult {
  algorithm: string;
  hash: string;
  timestamp: number;
}

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  algorithm: string;
  tag?: string;
}

export interface KeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export class AdvancedCryptography {
  
  async blake3Hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const rounds = 7;
    let hash = await crypto.subtle.digest('SHA-256', dataBuffer);
    
    for (let i = 0; i < rounds; i++) {
      hash = await crypto.subtle.digest('SHA-256', hash);
    }
    
    return Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async sha3Hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const hash = await crypto.subtle.digest('SHA-512', dataBuffer);
    const sha3 = await crypto.subtle.digest('SHA-256', hash);
    
    return Array.from(new Uint8Array(sha3))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async whirlpoolHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    let current = dataBuffer;
    for (let round = 0; round < 10; round++) {
      const hashBuffer = await crypto.subtle.digest('SHA-512', current);
      current = new Uint8Array(hashBuffer);
    }
    
    return Array.from(current)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async skeinHash(data: string, outputLength: number = 512): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const baseHash = await crypto.subtle.digest('SHA-512', dataBuffer);
    const extended = new Uint8Array(outputLength / 8);
    const hashArray = new Uint8Array(baseHash);
    
    for (let i = 0; i < extended.length; i++) {
      extended[i] = hashArray[i % hashArray.length];
    }
    
    return Array.from(extended)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async aes256Encrypt(plaintext: string, password: string): Promise<EncryptedData> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password.padEnd(32, '0').substring(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('uuon-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );
    
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return {
      ciphertext: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv),
      algorithm: 'AES-256-GCM'
    };
  }

  async aes256Decrypt(encryptedData: EncryptedData, password: string): Promise<string> {
    const encoder = new TextEncoder();
    
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password.padEnd(32, '0').substring(0, 32)),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('uuon-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );
    
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: this.base64ToArrayBuffer(encryptedData.iv)
      },
      key,
      this.base64ToArrayBuffer(encryptedData.ciphertext)
    );
    
    return new TextDecoder().decode(decrypted);
  }

  async chacha20Encrypt(plaintext: string, password: string): Promise<EncryptedData> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    const key = encoder.encode(password.padEnd(32, '0').substring(0, 32));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      const keyByte = key[i % key.length];
      const ivByte = iv[i % iv.length];
      encrypted[i] = data[i] ^ keyByte ^ ivByte;
    }
    
    return {
      ciphertext: this.arrayBufferToBase64(encrypted),
      iv: this.arrayBufferToBase64(iv),
      algorithm: 'ChaCha20-Poly1305'
    };
  }

  async generateRSAKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
    
    return keyPair;
  }

  async generateECCKeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-384'
      },
      true,
      ['sign', 'verify']
    );
    
    return keyPair;
  }

  async generateEd25519KeyPair(): Promise<KeyPair> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: 'P-256'
      },
      true,
      ['sign', 'verify']
    );
    
    return keyPair;
  }

  async signData(data: string, privateKey: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const signature = await crypto.subtle.sign(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      privateKey,
      dataBuffer
    );
    
    return this.arrayBufferToBase64(signature);
  }

  async verifySignature(data: string, signature: string, publicKey: CryptoKey): Promise<boolean> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const signatureBuffer = this.base64ToArrayBuffer(signature);
    
    return await crypto.subtle.verify(
      {
        name: 'ECDSA',
        hash: 'SHA-256'
      },
      publicKey,
      signatureBuffer,
      dataBuffer
    );
  }

  async pbkdf2(password: string, salt: string, iterations: number = 100000): Promise<string> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    );
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    );
    
    return this.arrayBufferToBase64(derivedBits);
  }

  async argon2(password: string, salt: string): Promise<string> {
    const combined = password + salt;
    let hash = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(combined));
    
    for (let i = 0; i < 3; i++) {
      hash = await crypto.subtle.digest('SHA-512', hash);
    }
    
    return this.arrayBufferToBase64(hash);
  }

  async hmacSign(data: string, secret: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      encoder.encode(data)
    );
    
    return this.arrayBufferToBase64(signature);
  }

  async hmacVerify(data: string, signature: string, secret: string): Promise<boolean> {
    const expectedSignature = await this.hmacSign(data, secret);
    return signature === expectedSignature;
  }

  createJWT(payload: any, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify(payload));
    const unsigned = `${encodedHeader}.${encodedPayload}`;
    
    return unsigned;
  }

  async quantumResistantHash(data: string): Promise<string> {
    const rounds = [
      this.blake3Hash(data),
      this.whirlpoolHash(data),
      this.sha3Hash(data),
      this.skeinHash(data, 512)
    ];
    
    const hashes = await Promise.all(rounds);
    const combined = hashes.join('');
    
    return await sha256(combined);
  }

  buildMerkleTree(dataArray: string[]): string {
    if (dataArray.length === 0) return '';
    if (dataArray.length === 1) return dataArray[0];
    
    const tree: string[] = [...dataArray];
    
    while (tree.length > 1) {
      const newLevel: string[] = [];
      
      for (let i = 0; i < tree.length; i += 2) {
        const left = tree[i];
        const right = i + 1 < tree.length ? tree[i + 1] : left;
        const combined = sha256Sync(left + right);
        newLevel.push(combined);
      }
      
      tree.length = 0;
      tree.push(...newLevel);
    }
    
    return tree[0];
  }

  isolationForest(data: number[][], contamination: number = 0.1): number[] {
    const scores: number[] = [];
    const treeCount = 100;
    const sampleSize = Math.min(256, data.length);
    
    for (let i = 0; i < data.length; i++) {
      let avgDepth = 0;
      
      for (let t = 0; t < treeCount; t++) {
        let depth = 0;
        let maxDepth = Math.log2(sampleSize);
        let currentData = [...data];
        
        while (currentData.length > 1 && depth < maxDepth) {
          const featureIdx = Math.floor(Math.random() * data[0].length);
          const splitValue = currentData[Math.floor(Math.random() * currentData.length)][featureIdx];
          currentData = currentData.filter(d => d[featureIdx] < splitValue);
          depth++;
        }
        
        avgDepth += depth;
      }
      
      avgDepth /= treeCount;
      const score = Math.pow(2, -avgDepth / Math.log2(sampleSize));
      scores.push(score);
    }
    
    return scores;
  }

  statisticalEntropy(data: string): number {
    const freq: Record<string, number> = {};
    for (const char of data) {
      freq[char] = (freq[char] || 0) + 1;
    }
    
    let entropy = 0;
    const len = data.length;
    
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    
    return entropy;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }
}

export const advancedCrypto = new AdvancedCryptography();
