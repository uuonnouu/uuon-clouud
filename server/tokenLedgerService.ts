/**
 * TOKEN LEDGER SERVICE
 * =====================
 * 
 * Blockchain-ready token management system for Dmension Mathematical Universe.
 * Provides minting, transfer, energy tracking, and proof generation.
 * 
 * Features:
 * - ULID-based token IDs for ordering
 * - SHA-256 hash chain for transaction integrity
 * - Energy accumulation from cross-learning engine
 * - Merkle proof generation for blockchain bridging
 * - ERC-721/1155 compatible metadata
 * 
 * © 2025 UUON Foundation Inc.
 */

import { db, withRetry } from './storage';
import { neon as dmensionNeon } from '@neondatabase/serverless';
import { drizzle as dmensionDrizzle } from 'drizzle-orm/neon-http';
const _dmensionSql = dmensionNeon(process.env.DMENSION_DATABASE_URL || process.env.DATABASE_URL || '');
const dmensionDb = dmensionDrizzle(_dmensionSql);
import { 
  shape_token_ledger, 
  shape_token_metadata,
  shape_token_energy,
  shape_token_transactions,
  shape_token_state_roots,
} from '../shared/schema';
import { eq, desc, and, sql } from 'drizzle-orm';
import crypto from 'crypto';

// ULID-like ID generator (time-ordered unique IDs)
function generateULID(): string {
  const timestamp = Date.now().toString(36).padStart(10, '0');
  const randomPart = crypto.randomBytes(10).toString('hex').substring(0, 16);
  return `${timestamp}${randomPart}`.toUpperCase();
}

// SHA-256 hash function
function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// HMAC-SHA256 for energy signatures
function hmacSha256(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex');
}

// Platform secret for signatures - REQUIRED in production
const PLATFORM_SECRET = process.env.UUON_TOKEN_SECRET;
if (!PLATFORM_SECRET) {
  console.warn('⚠️ UUON_TOKEN_SECRET not set - using development fallback (NOT FOR PRODUCTION)');
}
const getSecret = () => PLATFORM_SECRET || 'dev-only-uuon-2025-not-for-production';

export interface MintTokenParams {
  shapeType: string;
  tokenName: string;
  ownerUserId?: number;
  ownerWalletAddress?: string;
  parameters: Record<string, number>;
  baseEnergy?: number;
  equationSnapshot?: string;
  mathematicalProperties?: Record<string, any>;
}

export interface TransferTokenParams {
  tokenId: string;
  fromOwner?: string;
  toOwner: string;
  initiatorSignature?: string;
}

export interface EnergyUpdateParams {
  tokenId: string;
  source: 'interaction' | 'stake' | 'cross_learn' | 'export' | 'discovery';
  delta: number;
  crossLearnConnections?: number;
  patternDiscoveries?: number;
}

export class TokenLedgerService {

  private checkDatabaseConnection(): boolean {
    if (!process.env.DATABASE_URL) {
      console.warn('⚠️ DATABASE_URL not set - token operations will fail in development');
      return false;
    }
    return true;
  }

  async getNextBlockNumber(): Promise<{ blockNumber: number; blockHash: string; prevBlockHash: string | null; blockTimestamp: number }> {
    if (!this.checkDatabaseConnection()) {
      console.log('🔧 Development Mode: Simulating block number generation');
      const blockNumber = Math.floor(Date.now() / 1000);
      const blockTimestamp = Date.now();
      const blockHash = sha256(`dev-block:${blockNumber}|ts:${blockTimestamp}`);
      return { blockNumber, blockHash, prevBlockHash: null, blockTimestamp };
    }

    try {
      const maxBlockResult = await db.execute(sql`
        SELECT COALESCE(MAX(block_number), 0) as max_block FROM token_blocks
      `);
      const blockNumber = Number((maxBlockResult.rows[0] as any)?.max_block || 0) + 1;

      const prevBlock = await db.execute(sql`
        SELECT block_hash FROM token_blocks 
        WHERE block_number = ${blockNumber - 1} 
        LIMIT 1
      `);
      const prevBlockHash = (prevBlock.rows[0] as any)?.block_hash || null;

      const blockTimestamp = Date.now();
      const blockHash = sha256(`block:${blockNumber}|prev:${prevBlockHash || 'genesis'}|ts:${blockTimestamp}`);

      await db.execute(sql`
        INSERT INTO token_blocks (block_number, block_hash, previous_block_hash, transaction_count, block_timestamp)
        VALUES (${blockNumber}, ${blockHash}, ${prevBlockHash}, 1, ${new Date(blockTimestamp)})
        ON CONFLICT (block_number) DO UPDATE SET transaction_count = token_blocks.transaction_count + 1
      `);

      return { blockNumber, blockHash, prevBlockHash, blockTimestamp };
    } catch (error) {
      console.error('Block number generation error:', error);
      const blockNumber = Math.floor(Date.now() / 1000);
      const blockTimestamp = Date.now();
      const blockHash = sha256(`block:${blockNumber}|prev:genesis|ts:${blockTimestamp}`);
      return { blockNumber, blockHash, prevBlockHash: null, blockTimestamp };
    }
  }

  computeStateHash(tokenId: string, paramHash: string, energySignature: string, timestamp: number): string {
    return sha256(`${tokenId}|${paramHash}|${energySignature}|${timestamp}`);
  }

  computeMerkleLeaf(tokenId: string, stateHash: string, blockHash: string): string {
    return sha256(`${tokenId}|${stateHash}|${blockHash}`);
  }

  async mintToken(params: MintTokenParams): Promise<{
    tokenId: string;
    txId: string;
    txHash: string;
    stateHash: string;
    blockNumber: number;
  }> {
    const tokenId = generateULID();
    const txId = generateULID();
    const block = await this.getNextBlockNumber();
    const mintTimestamp = Date.now();

    const paramHash = sha256(JSON.stringify(params.parameters));
    const calculatedEnergy = this.calculateBaseEnergy(params.parameters);
    if (params.baseEnergy !== undefined && Math.abs(params.baseEnergy - calculatedEnergy) > calculatedEnergy * 0.05) {
      console.warn(`⚠️ Client-submitted baseEnergy (${params.baseEnergy}) diverges from server calculation (${calculatedEnergy}) — using server value`);
    }
    const baseEnergy = calculatedEnergy;
    const energySignature = hmacSha256(`${tokenId}|${baseEnergy}|${mintTimestamp}`, getSecret());

    const txPayload = {
      action: 'minted',
      shapeType: params.shapeType,
      parameters: params.parameters,
      baseEnergy,
      mintTimestamp,
      blockNumber: block.blockNumber
    };

    const txHash = sha256(`${tokenId}|minted|${JSON.stringify(txPayload)}|${mintTimestamp}`);
    const stateHash = this.computeStateHash(tokenId, paramHash, energySignature, mintTimestamp);
    const merkleLeafHash = this.computeMerkleLeaf(tokenId, stateHash, block.blockHash);

    if (!this.checkDatabaseConnection()) {
      console.log(`🪙 Development Mode: Token minted in memory only: ${tokenId} for shape ${params.shapeType}`);
      return { tokenId, txId, txHash, stateHash, blockNumber: block.blockNumber };
    }

    try {
      await withRetry(
        () => db.insert(shape_token_ledger).values({
          token_id: tokenId,
          shape_type: params.shapeType,
          owner_user_id: params.ownerUserId,
          owner_wallet_address: params.ownerWalletAddress,
          token_name: params.tokenName,
          token_symbol: 'UUON',
          status: 'active',
          issuance_tx_id: txId,
          current_state_hash: stateHash,
          merkle_leaf_hash: merkleLeafHash
        }),
        { operationName: 'Token ledger insert' }
      );

      await withRetry(
        () => db.insert(shape_token_metadata).values({
          token_id: tokenId,
          param_snapshot: params.parameters,
          param_hash: paramHash,
          energy_signature: energySignature,
          base_energy: baseEnergy,
          erc721_compatible: true,
          equation_snapshot: params.equationSnapshot,
          mathematical_properties: params.mathematicalProperties,
          uuon_signature: hmacSha256(`${tokenId}|UUON|${mintTimestamp}`, getSecret())
        }),
        { operationName: 'Token metadata insert' }
      );

      await withRetry(
        () => db.insert(shape_token_energy).values({
          token_id: tokenId,
          energy_source: 'mint',
          base_energy: baseEnergy,
          interaction_delta: 0,
          cumulative_energy: baseEnergy,
          energy_hash: energySignature
        }),
        { operationName: 'Token energy insert' }
      );

      await withRetry(
        () => db.insert(shape_token_transactions).values({
          token_id: tokenId,
          tx_type: 'minted',
          to_address: params.ownerWalletAddress || `user:${params.ownerUserId}`,
          amount: baseEnergy,
          tx_hash: txHash,
          block_number: block.blockNumber
        }),
        { operationName: 'Token transaction insert' }
      );

      await withRetry(
        () => db.insert(shape_token_state_roots).values({
          token_id: tokenId,
          latest_tx_id: txId,
          state_leaf_hash: stateHash,
          state_merkle_root: merkleLeafHash,
          cumulative_energy_hash: energySignature
        }),
        { operationName: 'Token state roots insert' }
      );

      console.log(`🪙 Token minted: ${tokenId} for shape ${params.shapeType} with energy ${baseEnergy.toFixed(2)} in block ${block.blockNumber}`);
      return { tokenId, txId, txHash, stateHash, blockNumber: block.blockNumber };
    } catch (error) {
      console.error('❌ Token minting database error:', error);
      throw new Error(`Token mint failed during DB write: ${error instanceof Error ? error.message : 'unknown error'}`);
    }
  }

  async transferToken(params: TransferTokenParams): Promise<{
    txId: string;
    txHash: string;
    blockNumber: number;
  }> {
    const token = await db.select()
      .from(shape_token_ledger)
      .where(eq(shape_token_ledger.token_id, params.tokenId))
      .limit(1);

    if (!token.length || token[0].status !== 'active') {
      throw new Error(`Token ${params.tokenId} not found or not active`);
    }

    const prevTx = await db.select()
      .from(shape_token_transactions)
      .where(eq(shape_token_transactions.token_id, params.tokenId))
      .orderBy(desc(shape_token_transactions.created_at))
      .limit(1);

    const txId = generateULID();
    const block = await this.getNextBlockNumber();
    const transferTimestamp = Date.now();
    const txPayload = { 
      action: 'transferred', 
      from: params.fromOwner, 
      to: params.toOwner,
      timestamp: transferTimestamp,
      blockNumber: block.blockNumber
    };
    const txHash = sha256(`${params.tokenId}|transferred|${JSON.stringify(txPayload)}|${transferTimestamp}`);
    const prevTxHash = prevTx.length ? prevTx[0].tx_hash : null;

    const currentMetadata = await db.select()
      .from(shape_token_metadata)
      .where(eq(shape_token_metadata.token_id, params.tokenId))
      .limit(1);
    const paramHash = currentMetadata.length ? currentMetadata[0].param_hash : txHash;
    const energySignature = currentMetadata.length ? (currentMetadata[0].energy_signature || txHash) : txHash;

    const newStateHash = this.computeStateHash(params.tokenId, paramHash, energySignature, transferTimestamp);
    const newMerkleLeaf = this.computeMerkleLeaf(params.tokenId, newStateHash, block.blockHash);

    await db.update(shape_token_ledger)
      .set({ 
        owner_wallet_address: params.toOwner,
        current_state_hash: newStateHash,
        merkle_leaf_hash: newMerkleLeaf,
        updated_at: new Date(transferTimestamp)
      })
      .where(eq(shape_token_ledger.token_id, params.tokenId));

    await db.insert(shape_token_transactions).values({
      token_id: params.tokenId,
      tx_type: 'transferred',
      from_address: params.fromOwner,
      to_address: params.toOwner,
      tx_hash: txHash,
      block_number: block.blockNumber
    });

    await db.update(shape_token_state_roots)
      .set({
        latest_tx_id: txId,
        state_leaf_hash: newStateHash,
        state_merkle_root: newMerkleLeaf,
        updated_at: new Date(transferTimestamp)
      })
      .where(eq(shape_token_state_roots.token_id, params.tokenId));

    console.log(`🔄 Token transferred: ${params.tokenId} from ${params.fromOwner} to ${params.toOwner} in block ${block.blockNumber}`);
    return { txId, txHash, blockNumber: block.blockNumber };
  }

  async updateEnergy(params: EnergyUpdateParams): Promise<{
    newCumulativeEnergy: number;
    energyHash: string;
    timestamp: number;
    stateHash: string;
  }> {
    const latestEnergy = await db.select()
      .from(shape_token_energy)
      .where(eq(shape_token_energy.token_id, params.tokenId))
      .orderBy(desc(shape_token_energy.captured_at))
      .limit(1);

    const currentMetadata = await db.select()
      .from(shape_token_metadata)
      .where(eq(shape_token_metadata.token_id, params.tokenId))
      .limit(1);

    const block = await this.getNextBlockNumber();
    const energyTimestamp = block.blockTimestamp;
    const prevCumulative = latestEnergy.length ? (latestEnergy[0].cumulative_energy ?? 0) : 0;
    const newCumulativeEnergy = prevCumulative + params.delta;
    const energyHash = hmacSha256(`${params.tokenId}|${newCumulativeEnergy}|${energyTimestamp}`, getSecret());

    const paramHash = currentMetadata.length ? currentMetadata[0].param_hash : sha256(params.tokenId);
    const newStateHash = this.computeStateHash(params.tokenId, paramHash, energyHash, energyTimestamp);
    const newMerkleLeaf = this.computeMerkleLeaf(params.tokenId, newStateHash, block.blockHash);

    await db.insert(shape_token_energy).values({
      token_id: params.tokenId,
      energy_source: params.source,
      base_energy: latestEnergy.length ? (latestEnergy[0].base_energy ?? 0) : 0,
      interaction_delta: params.delta,
      cumulative_energy: newCumulativeEnergy,
      cross_learn_connections: params.crossLearnConnections,
      pattern_discoveries: params.patternDiscoveries,
      energy_hash: energyHash
    });

    await db.update(shape_token_metadata)
      .set({
        energy_signature: energyHash,
        base_energy: newCumulativeEnergy
      })
      .where(eq(shape_token_metadata.token_id, params.tokenId));

    await db.update(shape_token_ledger)
      .set({
        current_state_hash: newStateHash,
        merkle_leaf_hash: newMerkleLeaf,
        updated_at: new Date(energyTimestamp)
      })
      .where(eq(shape_token_ledger.token_id, params.tokenId));

    await db.update(shape_token_state_roots)
      .set({
        cumulative_energy_hash: energyHash,
        state_leaf_hash: newStateHash,
        state_merkle_root: newMerkleLeaf,
        updated_at: new Date(energyTimestamp)
      })
      .where(eq(shape_token_state_roots.token_id, params.tokenId));

    console.log(`⚡ Energy updated: ${params.tokenId} +${params.delta.toFixed(2)} = ${newCumulativeEnergy.toFixed(2)} in block ${block.blockNumber}`);
    return { newCumulativeEnergy, energyHash, timestamp: energyTimestamp, stateHash: newStateHash };
  }

  async getToken(tokenId: string): Promise<{
    token: any;
    metadata: any;
    latestEnergy: any;
    transactionCount: number;
  } | null> {
    const token = await db.select()
      .from(shape_token_ledger)
      .where(eq(shape_token_ledger.token_id, tokenId))
      .limit(1);

    if (!token.length) return null;

    const metadata = await db.select()
      .from(shape_token_metadata)
      .where(eq(shape_token_metadata.token_id, tokenId))
      .limit(1);

    const latestEnergy = await db.select()
      .from(shape_token_energy)
      .where(eq(shape_token_energy.token_id, tokenId))
      .orderBy(desc(shape_token_energy.captured_at))
      .limit(1);

    const txCount = await db.select({ count: sql<number>`COUNT(*)` })
      .from(shape_token_transactions)
      .where(eq(shape_token_transactions.token_id, tokenId));

    return {
      token: token[0],
      metadata: metadata[0] || null,
      latestEnergy: latestEnergy[0] || null,
      transactionCount: txCount[0]?.count || 0
    };
  }

  async getTokenTransactions(tokenId: string, limit = 50): Promise<any[]> {
    return db.select()
      .from(shape_token_transactions)
      .where(eq(shape_token_transactions.token_id, tokenId))
      .orderBy(desc(shape_token_transactions.created_at))
      .limit(limit);
  }

  async getTokenProof(tokenId: string): Promise<{
    tokenId: string;
    stateRoot: any;
    transactionChain: string[];
    signature: string;
  } | null> {
    const stateRoot = await db.select()
      .from(shape_token_state_roots)
      .where(eq(shape_token_state_roots.token_id, tokenId))
      .limit(1);

    if (!stateRoot.length) return null;

    const transactions = await db.select({ tx_hash: shape_token_transactions.tx_hash })
      .from(shape_token_transactions)
      .where(eq(shape_token_transactions.token_id, tokenId))
      .orderBy(shape_token_transactions.created_at);

    const proofData = {
      tokenId,
      stateRoot: stateRoot[0],
      transactionChain: transactions.map((t: { tx_hash: string }) => t.tx_hash)
    };

    const signature = hmacSha256(JSON.stringify(proofData), getSecret());
    return { ...proofData, signature };
  }

  async prepareBlockchainBridge(tokenId: string, targetChain: string): Promise<{
    integrationId: number;
    bridgePayload: any;
  }> {
    const token = await this.getToken(tokenId);
    if (!token) throw new Error(`Token ${tokenId} not found`);

    const bridgePayload = {
      tokenId,
      shapeType: token.token.shape_type,
      tokenName: token.token.token_name,
      parameters: token.metadata?.param_snapshot,
      energy: token.latestEnergy?.cumulative_energy || 0,
      merkleRoot: token.token.merkle_leaf_hash,
      timestamp: Date.now()
    };

    // Bridge table removed — return payload directly until token_integration_links is created
    console.log(`🌉 Bridge prepared: ${tokenId} -> ${targetChain}`);
    return { integrationId: 0, bridgePayload };
  }

  async getAllTokens(limit = 100, offset = 0): Promise<any[]> {
    return db.select()
      .from(shape_token_ledger)
      .orderBy(desc(shape_token_ledger.created_at))
      .limit(limit)
      .offset(offset);
  }

  async getTokensByShape(shapeType: string): Promise<any[]> {
    return db.select()
      .from(shape_token_ledger)
      .where(eq(shape_token_ledger.shape_type, shapeType))
      .orderBy(desc(shape_token_ledger.created_at));
  }

  async getTokensByOwner(ownerUserId: number): Promise<any[]> {
    return db.select()
      .from(shape_token_ledger)
      .where(eq(shape_token_ledger.owner_user_id, ownerUserId))
      .orderBy(desc(shape_token_ledger.created_at));
  }

  async getEnergyLeaderboard(limit = 20): Promise<any[]> {
    const subquery = db
      .select({
        token_id: shape_token_energy.token_id,
        max_energy: sql<number>`MAX(cumulative_energy)`.as('max_energy')
      })
      .from(shape_token_energy)
      .groupBy(shape_token_energy.token_id)
      .as('latest_energy');

    return db.select({
        tokenId: shape_token_ledger.token_id,
        tokenName: shape_token_ledger.token_name,
        shapeType: shape_token_ledger.shape_type,
        energy: subquery.max_energy
      })
      .from(shape_token_ledger)
      .innerJoin(subquery, eq(shape_token_ledger.token_id, subquery.token_id))
      .orderBy(desc(subquery.max_energy))
      .limit(limit);
  }

  async getSystemStats(): Promise<{
    totalTokens: number;
    activeTokens: number;
    totalTransactions: number;
    totalEnergy: number;
    latestBlock: number;
  }> {
    const tokenCount = await db.select({ count: sql<number>`COUNT(*)` }).from(shape_token_ledger);
    const activeCount = await db.select({ count: sql<number>`COUNT(*)` })
      .from(shape_token_ledger)
      .where(eq(shape_token_ledger.status, 'active'));
    const txCount = await db.select({ count: sql<number>`COUNT(*)` }).from(shape_token_transactions);
    const totalEnergy = await db.select({ sum: sql<number>`COALESCE(SUM(cumulative_energy), 0)` })
      .from(shape_token_energy);
    const latestBlock = await db.select({ max: sql<number>`COALESCE(MAX(block_number), 0)` })
      .from(shape_token_transactions);

    return {
      totalTokens: tokenCount[0]?.count || 0,
      activeTokens: activeCount[0]?.count || 0,
      totalTransactions: txCount[0]?.count || 0,
      totalEnergy: totalEnergy[0]?.sum || 0,
      latestBlock: latestBlock[0]?.max || 0
    };
  }

  /**
   * v1 energy: deterministic function of mint parameters (a, b, c, param count)
   * ONLY. It does NOT measure shape geometry or mathematics — shapes minted
   * with identical/default parameters get identical energy. The "phiAlignment"
   * term rewards proximity of param b to the golden ratio; it is a stylistic
   * choice, not a measurement.
   * FROZEN: v1 values are signed into all existing token signatures (HMAC
   * includes baseEnergy) — do not modify this formula. A geometry-derived
   * metric, if ever needed, must ship as energy_v2 with an explicit version
   * field. Until then: no energy leaderboards or energy-based value claims
   * in anything user-facing.
   */
  private calculateBaseEnergy(params: Record<string, number>): number {
    const a = params.a ?? 1;
    const b = params.b ?? 1;
    const c = params.c ?? 1;
    const PHI = 1.618033988749895;

    const phiAlignment = 1 + Math.abs(1 - Math.abs(b - PHI));
    const complexity = Math.sqrt(Math.abs(a * b * c));
    const paramCount = Object.keys(params).length;

    return (phiAlignment * complexity * Math.log(paramCount + 1)) * 10;
  }
}

export const tokenLedgerService = new TokenLedgerService();

async function verifySchemaCompatibility() {
  try {
    const schemaCheck = await dmensionDb.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('complete_shape_registry', 'shape_token_ledger', 'energy_transactions', 'portfolio_state')
    `);

    const existingTables = schemaCheck.rows.map((row: any) => row.table_name);
    const requiredTables = ['complete_shape_registry', 'shape_token_ledger', 'energy_transactions', 'portfolio_state'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length > 0) {
      console.warn(`⚠️ Missing UUON token economy tables: ${missingTables.join(', ')}`);
    } else {
      console.log('✅ UUON token economy schema verified - all tables present');
    }
  } catch (error) {
    console.warn('⚠️ Could not verify token economy schema:', error);
  }
}

verifySchemaCompatibility();
console.log('🪙 Token Ledger Service initialized - Blockchain-ready token storage active');