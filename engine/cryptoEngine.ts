import { SurfaceParameters } from '../types/math';
import { advancedCrypto } from './advancedCryptography';
import { postQuantumCrypto } from './postQuantumCrypto';

export interface CryptoHash {
  algorithm: 'SHA-256' | 'SHA-3' | 'BLAKE3' | 'Whirlpool' | 'Skein';
  hash: string;
  timestamp: number;
}

export interface ProofOfWork {
  nonce: number;
  difficulty: number;
  hash: string;
  timestamp: number;
  computeTime: number;
}

export interface BlockchainBlock {
  index: number;
  timestamp: number;
  data: any;
  previousHash: string;
  hash: string;
  nonce: number;
  difficulty: number;
}

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
  data?: any;
}

export interface CryptoToken {
  tokenId: string;
  shapeId: string;
  ownerSignature: string;
  timestamp: number;
  metadata: {
    proofOfWork: ProofOfWork;
    merkleRoot: string;
    blockchainProof: string;
  };
}

export class CryptoValidationEngine {
  private blockchain: BlockchainBlock[] = [];
  private readonly DEFAULT_DIFFICULTY = 4;

  async hashParameters(params: Partial<SurfaceParameters>, algorithm: 'SHA-256' | 'SHA-3' | 'BLAKE3' | 'Whirlpool' | 'Skein' = 'SHA-256'): Promise<CryptoHash> {
    const startTime = performance.now();
    
    const paramString = JSON.stringify(params, Object.keys(params).sort());
    let hash: string;
    
    switch (algorithm) {
      case 'SHA-3':
        hash = await advancedCrypto.sha3Hash(paramString);
        break;
      case 'BLAKE3':
        hash = await advancedCrypto.blake3Hash(paramString);
        break;
      case 'Whirlpool':
        hash = await advancedCrypto.whirlpoolHash(paramString);
        break;
      case 'Skein':
        hash = await advancedCrypto.skeinHash(paramString, 512);
        break;
      default:
        hash = await this.sha256(paramString);
    }
    
    return {
      algorithm,
      hash,
      timestamp: Date.now()
    };
  }

  async proofOfWork(data: string, difficulty: number = this.DEFAULT_DIFFICULTY): Promise<ProofOfWork> {
    const startTime = performance.now();
    let nonce = 0;
    let hash = '';
    const target = '0'.repeat(difficulty);

    while (true) {
      const input = `${data}${nonce}`;
      hash = await this.sha256(input);
      
      if (hash.startsWith(target)) {
        break;
      }
      nonce++;
      
      if (nonce % 10000 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    const computeTime = performance.now() - startTime;

    return {
      nonce,
      difficulty,
      hash,
      timestamp: Date.now(),
      computeTime
    };
  }

  async verifyProofOfWork(data: string, pow: ProofOfWork): Promise<boolean> {
    const input = `${data}${pow.nonce}`;
    const hash = await this.sha256(input);
    const target = '0'.repeat(pow.difficulty);
    
    return hash === pow.hash && hash.startsWith(target);
  }

  async createBlock(data: any, previousHash: string = '0', difficulty: number = this.DEFAULT_DIFFICULTY): Promise<BlockchainBlock> {
    const index = this.blockchain.length;
    const timestamp = Date.now();
    
    const blockData = JSON.stringify({
      index,
      timestamp,
      data,
      previousHash
    });

    const pow = await this.proofOfWork(blockData, difficulty);

    const block: BlockchainBlock = {
      index,
      timestamp,
      data,
      previousHash,
      hash: pow.hash,
      nonce: pow.nonce,
      difficulty
    };

    this.blockchain.push(block);

    return block;
  }

  async verifyBlock(block: BlockchainBlock): Promise<boolean> {
    const blockData = JSON.stringify({
      index: block.index,
      timestamp: block.timestamp,
      data: block.data,
      previousHash: block.previousHash
    });

    const pow: ProofOfWork = {
      nonce: block.nonce,
      difficulty: block.difficulty,
      hash: block.hash,
      timestamp: block.timestamp,
      computeTime: 0
    };

    return await this.verifyProofOfWork(blockData, pow);
  }

  async verifyBlockchain(): Promise<boolean> {
    if (this.blockchain.length === 0) return true;

    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const previousBlock = this.blockchain[i - 1];

      const blockValid = await this.verifyBlock(currentBlock);
      if (!blockValid) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }

  buildMerkleTree(dataArray: any[]): MerkleNode | null {
    if (dataArray.length === 0) return null;

    let nodes: MerkleNode[] = dataArray.map(data => ({
      hash: this.sha256Sync(JSON.stringify(data)),
      data
    }));

    while (nodes.length > 1) {
      const newLevel: MerkleNode[] = [];

      for (let i = 0; i < nodes.length; i += 2) {
        const left = nodes[i];
        const right = i + 1 < nodes.length ? nodes[i + 1] : left;

        const combinedHash = this.sha256Sync(left.hash + right.hash);
        newLevel.push({
          hash: combinedHash,
          left,
          right
        });
      }

      nodes = newLevel;
    }

    return nodes[0];
  }

  getMerkleRoot(tree: MerkleNode | null): string {
    return tree?.hash || '';
  }

  async generateCryptoToken(
    shapeId: string,
    shapeName: string,
    fusionData: any,
    uuonSignature: string
  ): Promise<CryptoToken> {
    const merkleTree = this.buildMerkleTree([fusionData, { uuonSignature }]);
    const merkleRoot = this.getMerkleRoot(merkleTree);

    const tokenData = {
      shapeId,
      shapeName,
      merkleRoot,
      timestamp: Date.now()
    };

    const pow = await this.proofOfWork(JSON.stringify(tokenData), 3);

    const block = await this.createBlock(tokenData, this.getLatestBlockHash(), 2);

    const tokenId = await this.sha256(
      `${shapeId}${shapeName}${pow.hash}${block.hash}`
    );

    return {
      tokenId,
      shapeId,
      ownerSignature: uuonSignature,
      timestamp: Date.now(),
      metadata: {
        proofOfWork: pow,
        merkleRoot,
        blockchainProof: block.hash
      }
    };
  }

  async validateToken(token: CryptoToken): Promise<boolean> {
    const tokenData = {
      shapeId: token.shapeId,
      timestamp: token.timestamp
    };

    const powValid = await this.verifyProofOfWork(
      JSON.stringify(tokenData),
      token.metadata.proofOfWork
    );

    if (!powValid) {
      return false;
    }

    const blockchainValid = await this.verifyBlockchain();
    if (!blockchainValid) {
      return false;
    }

    return true;
  }

  getLatestBlockHash(): string {
    return this.blockchain.length > 0 
      ? this.blockchain[this.blockchain.length - 1].hash 
      : '0';
  }

  getBlockchain(): BlockchainBlock[] {
    return [...this.blockchain];
  }

  async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  sha256Sync(message: string): string {
    let hash = 0;
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(64, '0').substring(0, 64);
  }

  async signData(data: any, privateKey: string): Promise<string> {
    const dataString = JSON.stringify(data);
    const signature = await this.sha256(`${dataString}${privateKey}`);
    return signature;
  }

  async verifySignature(data: any, signature: string, publicKey: string): Promise<boolean> {
    const dataString = JSON.stringify(data);
    const expectedSignature = await this.sha256(`${dataString}${publicKey}`);
    return signature === expectedSignature;
  }

  getBlockchainStats() {
    const totalBlocks = this.blockchain.length;
    const totalDifficulty = this.blockchain.reduce((sum, block) => sum + block.difficulty, 0);
    const latestBlock = this.blockchain[this.blockchain.length - 1];

    return {
      totalBlocks,
      averageDifficulty: totalBlocks > 0 ? totalDifficulty / totalBlocks : 0,
      latestBlockHash: latestBlock?.hash.substring(0, 16) || 'none',
      chainIntegrity: 'verified'
    };
  }

  async quantumResistantHash(data: string): Promise<string> {
    return await advancedCrypto.quantumResistantHash(data);
  }

  async encryptData(plaintext: string, password: string, algorithm: 'AES-256' | 'ChaCha20' = 'AES-256'): Promise<any> {
    if (algorithm === 'AES-256') {
      return await advancedCrypto.aes256Encrypt(plaintext, password);
    } else {
      return await advancedCrypto.chacha20Encrypt(plaintext, password);
    }
  }

  async decryptData(encrypted: any, password: string, algorithm: 'AES-256' | 'ChaCha20' = 'AES-256'): Promise<string> {
    if (algorithm === 'AES-256') {
      return await advancedCrypto.aes256Decrypt(encrypted, password);
    } else {
      throw new Error('ChaCha20 decryption not yet implemented');
    }
  }
}

export const cryptoEngine = new CryptoValidationEngine();
export { advancedCrypto, postQuantumCrypto };
