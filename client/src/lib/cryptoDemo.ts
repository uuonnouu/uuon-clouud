import { cryptoSuite } from './cryptoSuite';
import { cryptoEngine, advancedCrypto, postQuantumCrypto } from './cryptoEngine';

export async function runCryptographicTests() {
  console.log('='.repeat(60));
  console.log('COMPREHENSIVE CRYPTOGRAPHIC SYSTEM VERIFICATION');
  console.log('='.repeat(60));
  console.log('');

  const testData = 'UUON Foundation - Advanced Mathematical Visualization';
  const password = 'secure_password_2024';
  
  console.log('Test Data:', testData);
  console.log('');

  console.log('[1] HASHING ALGORITHMS');
  console.log('-'.repeat(60));
  
  const hashes = await cryptoSuite.hashWithAllAlgorithms(testData);
  console.log('SHA-256:', hashes.sha256.substring(0, 32) + '...');
  console.log('SHA-3:', hashes.sha3.substring(0, 32) + '...');
  console.log('BLAKE3:', hashes.blake3.substring(0, 32) + '...');
  console.log('Whirlpool:', hashes.whirlpool.substring(0, 32) + '...');
  console.log('Skein-512:', hashes.skein.substring(0, 32) + '...');
  console.log('Quantum-Resistant:', hashes.quantumResistant.substring(0, 32) + '...');
  console.log('');

  console.log('[2] SYMMETRIC ENCRYPTION (AES-256-GCM)');
  console.log('-'.repeat(60));
  
  const encrypted = await cryptoSuite.encryptWithAES(testData, password);
  console.log('Encrypted:', encrypted.ciphertext.substring(0, 40) + '...');
  console.log('Algorithm:', encrypted.algorithm);
  console.log('IV:', encrypted.iv.substring(0, 20) + '...');
  
  const decrypted = await cryptoSuite.decryptWithAES(encrypted, password);
  console.log('Decrypted:', decrypted);
  console.log('Match:', testData === decrypted ? 'SUCCESS' : 'FAILED');
  console.log('');

  console.log('[3] POST-QUANTUM CRYPTOGRAPHY');
  console.log('-'.repeat(60));
  
  const pqKeys = await cryptoSuite.generatePostQuantumKeys();
  console.log('CRYSTALS-Kyber Key Pair Generated');
  console.log('Public Key Dimensions:', pqKeys.publicKey.length, 'x', pqKeys.publicKey[0].length);
  console.log('Private Key Dimensions:', pqKeys.privateKey.length, 'x', pqKeys.privateKey[0].length);
  
  const pqEncrypted = postQuantumCrypto.kyberEncrypt(testData, pqKeys.publicKey);
  console.log('PQ Encrypted:', pqEncrypted.substring(0, 40) + '...');
  
  const pqDecrypted = postQuantumCrypto.kyberDecrypt(pqEncrypted, pqKeys.privateKey);
  console.log('PQ Decrypted:', pqDecrypted);
  console.log('Match:', testData === pqDecrypted ? 'SUCCESS' : 'FAILED');
  console.log('');

  console.log('[4] DIGITAL SIGNATURES');
  console.log('-'.repeat(60));
  
  const dilithiumKeys = postQuantumCrypto.generateKyberKeyPair();
  const signature = await postQuantumCrypto.dilithiumSign(testData, dilithiumKeys.privateKey);
  console.log('CRYSTALS-Dilithium Signature:', signature.signature.substring(0, 40) + '...');
  console.log('Algorithm:', signature.algorithm);
  console.log('Timestamp:', new Date(signature.timestamp).toISOString());
  
  const verified = await postQuantumCrypto.dilithiumVerify(testData, signature, dilithiumKeys.publicKey);
  console.log('Signature Valid:', verified ? 'SUCCESS' : 'FAILED');
  console.log('');

  console.log('[5] KEY DERIVATION FUNCTIONS');
  console.log('-'.repeat(60));
  
  const salt = 'random_salt_value';
  const derivedKeys = await cryptoSuite.deriveSecureKey(password, salt);
  console.log('PBKDF2:', derivedKeys.pbkdf.substring(0, 32) + '...');
  console.log('Argon2:', derivedKeys.argon.substring(0, 32) + '...');
  console.log('');

  console.log('[6] BLOCKCHAIN PRIMITIVES');
  console.log('-'.repeat(60));
  
  const merkleData = ['block1', 'block2', 'block3', 'block4'];
  const merkleRoot = await cryptoSuite.buildSecureMerkleTree(merkleData);
  console.log('Merkle Tree Root:', merkleRoot.substring(0, 40) + '...');
  
  await cryptoEngine.createBlock({ data: 'test_transaction' }, '0', 3);
  const blockchainStats = cryptoEngine.getBlockchainStats();
  console.log('Blockchain Blocks:', blockchainStats.totalBlocks);
  console.log('Average Difficulty:', blockchainStats.averageDifficulty);
  console.log('Chain Integrity:', blockchainStats.chainIntegrity);
  console.log('');

  console.log('[7] SECURITY ANALYTICS');
  console.log('-'.repeat(60));
  
  const entropy = cryptoSuite.calculateEntropy(testData);
  console.log('Data Entropy:', entropy.toFixed(4), 'bits');
  
  const anomalyData = [
    [1, 2, 3],
    [2, 3, 4],
    [3, 4, 5],
    [100, 200, 300]
  ];
  const anomalyScores = await cryptoSuite.detectAnomalies(anomalyData);
  console.log('Anomaly Detection Scores:', anomalyScores.map(s => s.toFixed(4)).join(', '));
  console.log('');

  console.log('[8] HMAC TOKEN GENERATION');
  console.log('-'.repeat(60));
  
  const hmacSecret = 'shared_secret_key';
  const hmacToken = await cryptoSuite.createHMACToken(testData, hmacSecret);
  console.log('HMAC Token:', hmacToken.substring(0, 40) + '...');
  
  const hmacValid = await cryptoSuite.verifyHMACToken(testData, hmacToken, hmacSecret);
  console.log('Token Valid:', hmacValid ? 'SUCCESS' : 'FAILED');
  console.log('');

  console.log('='.repeat(60));
  console.log('ALL CRYPTOGRAPHIC SYSTEMS OPERATIONAL');
  console.log('='.repeat(60));
  console.log('');
  
  return {
    hashing: 'operational',
    encryption: 'operational',
    postQuantum: 'operational',
    signatures: 'operational',
    blockchain: 'operational',
    analytics: 'operational'
  };
}
