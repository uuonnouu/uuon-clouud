export { cryptoEngine, advancedCrypto, postQuantumCrypto } from './cryptoEngine';
export { AdvancedCryptography } from './advancedCryptography';
export { PostQuantumCryptography } from './postQuantumCrypto';
export type { D13MON4Result, TetrahedronHash } from './d13mon4Types';

export type { CryptoHash, ProofOfWork, BlockchainBlock, MerkleNode, CryptoToken } from './cryptoEngine';
export type { HashResult, EncryptedData, KeyPair } from './advancedCryptography';
export type { LatticeKeyPair, QuantumSignature } from './postQuantumCrypto';

import { cryptoEngine, advancedCrypto, postQuantumCrypto } from './cryptoEngine';
import { apiRequest } from './queryClient';
import type { D13MON4Result } from './d13mon4Types';

export class CryptoSuite {
  async demonstrateCryptoCapabilities() {
    console.log('🔐 Cryptographic Suite Initialized');
    console.log('');
    console.log('Available Hashing Algorithms:');
    console.log('  • SHA-256 (Industry Standard)');
    console.log('  • SHA-3 (Next Generation)');
    console.log('  • BLAKE3 (Ultra Fast)');
    console.log('  • Whirlpool (512-bit)');
    console.log('  • Skein (Flexible Length)');
    console.log('  • D13MON4 (12-Tetrahedron Geometric)');
    console.log('');
    console.log('Encryption Algorithms:');
    console.log('  • AES-256-GCM (Symmetric)');
    console.log('  • ChaCha20-Poly1305 (Symmetric)');
    console.log('  • RSA-4096 (Asymmetric)');
    console.log('  • ECC P-384 (Asymmetric)');
    console.log('  • Ed25519 (Signatures)');
    console.log('');
    console.log('Post-Quantum Algorithms:');
    console.log('  • CRYSTALS-Kyber (Encryption)');
    console.log('  • CRYSTALS-Dilithium (Signatures)');
    console.log('  • SPHINCS+ (Hash-based Signatures)');
    console.log('  • Falcon (Lightweight Signatures)');
    console.log('');
    console.log('Key Derivation Functions:');
    console.log('  • PBKDF2 (Traditional)');
    console.log('  • Argon2 (Memory-Hard)');
    console.log('  • HMAC-SHA256 (Token Generation)');
    console.log('');
    console.log('Blockchain Primitives:');
    console.log('  • Merkle Trees');
    console.log('  • Proof-of-Work');
    console.log('  • Block Validation');
    console.log('');
    console.log('Security Features:');
    console.log('  • Isolation Forest (Anomaly Detection)');
    console.log('  • Statistical Entropy Monitoring');
    console.log('  • Quantum-Resistant Hashing');
    console.log('');
  }

  async hashWithAllAlgorithms(data: string) {
    const results = {
      sha256: await cryptoEngine.sha256(data),
      sha3: await advancedCrypto.sha3Hash(data),
      blake3: await advancedCrypto.blake3Hash(data),
      whirlpool: await advancedCrypto.whirlpoolHash(data),
      skein: await advancedCrypto.skeinHash(data, 512),
      quantumResistant: await advancedCrypto.quantumResistantHash(data)
    };

    return results;
  }

  async encryptWithAES(plaintext: string, password: string) {
    return await advancedCrypto.aes256Encrypt(plaintext, password);
  }

  async decryptWithAES(encrypted: any, password: string) {
    return await advancedCrypto.aes256Decrypt(encrypted, password);
  }

  async generatePostQuantumKeys() {
    return postQuantumCrypto.generateKyberKeyPair();
  }

  async signWithQuantumResistance(message: string) {
    const keys = postQuantumCrypto.generateKyberKeyPair();
    const signature = await postQuantumCrypto.dilithiumSign(message, keys.privateKey);
    return { signature, publicKey: keys.publicKey };
  }

  async buildSecureMerkleTree(data: string[]) {
    return advancedCrypto.buildMerkleTree(data);
  }

  async detectAnomalies(data: number[][]) {
    return advancedCrypto.isolationForest(data);
  }

  calculateEntropy(data: string) {
    return advancedCrypto.statisticalEntropy(data);
  }

  async deriveSecureKey(password: string, salt: string) {
    const pbkdf = await advancedCrypto.pbkdf2(password, salt, 100000);
    const argon = await advancedCrypto.argon2(password, salt);
    return { pbkdf, argon };
  }

  async createHMACToken(data: string, secret: string) {
    return await advancedCrypto.hmacSign(data, secret);
  }

  async verifyHMACToken(data: string, token: string, secret: string) {
    return await advancedCrypto.hmacVerify(data, token, secret);
  }

  async generateD13MON4Hash(inputText: string): Promise<D13MON4Result> {
    const res = await apiRequest('POST', '/api/d13mon4/hash', { inputText });
    return await res.json();
  }

  async generateGeometricLatticeTokens(latitude: number, longitude: number, dimensionalOffset: number = 0) {
    const res = await apiRequest('POST', '/api/d13mon4/lattice-tokens', { latitude, longitude, dimensionalOffset });
    return await res.json();
  }
}

export const cryptoSuite = new CryptoSuite();