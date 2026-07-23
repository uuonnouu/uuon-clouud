/**
 * Polygon Bridge Service
 * Compiles, deploys, and weekly-updates the MerkleRootRegistry contract.
 * Uses ethers v6 + solc for zero-dependency compilation.
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACTS_DIR = path.join(__dirname, '../contracts');
const ARTIFACT_PATH = path.join(CONTRACTS_DIR, 'MerkleRootRegistry.artifact.json');
const SOL_SOURCE_PATH = path.join(CONTRACTS_DIR, 'MerkleRootRegistry.sol');

const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com';
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '';
const POLYGON_CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT_ADDRESS || '';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// ── Merkle Tree (SHA-256, binary, sorted pairs) ──────────────────────────────

export function buildMerkleTree(leaves: string[]): { root: string; proofs: Record<string, string[]> } {
  if (!leaves.length) return { root: '0x' + '0'.repeat(64), proofs: {} };

  const sorted = [...leaves].sort();
  const layers: string[][] = [sorted];

  while (layers[layers.length - 1].length > 1) {
    const prev = layers[layers.length - 1];
    const next: string[] = [];
    for (let i = 0; i < prev.length; i += 2) {
      const a = prev[i];
      const b = prev[i + 1] ?? prev[i];
      const pair = a <= b ? a + b : b + a;
      next.push(crypto.createHash('sha256').update(pair, 'hex').digest('hex'));
    }
    layers.push(next);
  }

  const root = '0x' + layers[layers.length - 1][0];
  const proofs: Record<string, string[]> = {};

  for (const leaf of sorted) {
    const proof: string[] = [];
    let idx = sorted.indexOf(leaf);
    for (let l = 0; l < layers.length - 1; l++) {
      const layer = layers[l];
      const sibling = idx % 2 === 0 ? layer[idx + 1] ?? layer[idx] : layer[idx - 1];
      proof.push('0x' + sibling);
      idx = Math.floor(idx / 2);
    }
    proofs[leaf] = proof;
  }

  return { root, proofs };
}

// ── Compile contract using solc ───────────────────────────────────────────────

async function compileContract(): Promise<{ abi: any[]; bytecode: string }> {
  if (fs.existsSync(ARTIFACT_PATH)) {
    return JSON.parse(fs.readFileSync(ARTIFACT_PATH, 'utf8'));
  }

  console.log('🔨 Compiling MerkleRootRegistry.sol with solc...');
  const solc = (await import('solc')).default;
  const source = fs.readFileSync(SOL_SOURCE_PATH, 'utf8');

  const input = JSON.stringify({
    language: 'Solidity',
    sources: { 'MerkleRootRegistry.sol': { content: source } },
    settings: { outputSelection: { '*': { '*': ['abi', 'evm.bytecode'] } } }
  });

  const output = JSON.parse(solc.compile(input));
  if (output.errors?.some((e: any) => e.severity === 'error')) {
    throw new Error('Compilation failed: ' + output.errors.map((e: any) => e.message).join('\n'));
  }

  const contract = output.contracts['MerkleRootRegistry.sol']['MerkleRootRegistry'];
  const artifact = {
    abi: contract.abi,
    bytecode: '0x' + contract.evm.bytecode.object
  };

  fs.mkdirSync(CONTRACTS_DIR, { recursive: true });
  fs.writeFileSync(ARTIFACT_PATH, JSON.stringify(artifact, null, 2));
  console.log('✅ Contract compiled and artifact saved.');
  return artifact;
}

// ── Deploy ────────────────────────────────────────────────────────────────────

export async function deployContract(): Promise<{ address: string; txHash: string }> {
  if (!POLYGON_PRIVATE_KEY) throw new Error('POLYGON_PRIVATE_KEY not set');

  const { ethers } = await import('ethers');
  const artifact = await compileContract();
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(POLYGON_PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);

  console.log('🚀 Deploying MerkleRootRegistry to Polygon...');
  const contract = await factory.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const receipt = await provider.getTransactionReceipt(contract.deploymentTransaction()!.hash);
  const txHash = receipt!.hash;

  console.log(`✅ Contract deployed at ${address} (tx: ${txHash})`);

  // Store in DB
  await pool.query(`
    INSERT INTO token_integration_links
      (token_id, target_chain_id, target_chain_network, bridge_contract, bridge_status, bridge_payload)
    SELECT token_id, 'polygon', 'mainnet', $1, 'complete', $2
    FROM shape_token_ledger LIMIT 1
    ON CONFLICT DO NOTHING
  `, [address, JSON.stringify({ txHash, deployedAt: new Date().toISOString() })]);

  return { address, txHash };
}

// ── Compute current Merkle root from DB ───────────────────────────────────────

export async function computeCurrentMerkleRoot(): Promise<{
  root: string;
  tokenCount: number;
  energyTotal: number;
  leafCount: number;
}> {
  const { rows: tokens } = await pool.query<{
    token_id: string; param_hash: string; energy_hash: string;
  }>(`
    SELECT stm.token_id, stm.param_hash,
           COALESCE(ste.energy_hash, 'none') AS energy_hash
    FROM shape_token_metadata stm
    LEFT JOIN shape_token_energy ste ON ste.token_id = stm.token_id
    ORDER BY stm.token_id
  `);

  const leaves = tokens.map(t =>
    crypto.createHash('sha256')
      .update(t.token_id + (t.param_hash || '') + (t.energy_hash || ''))
      .digest('hex')
  );

  const { root } = buildMerkleTree(leaves);

  const { rows: [energy] } = await pool.query<{ total: string }>(`
    SELECT COALESCE(SUM(energy_in), 0)::text AS total FROM energy_transactions
  `);

  const { rows: [count] } = await pool.query<{ total: string }>(`
    SELECT COUNT(*)::text AS total FROM shape_token_ledger
  `);

  return {
    root,
    tokenCount: parseInt(count.total),
    energyTotal: Math.round(parseFloat(energy.total)),
    leafCount: leaves.length
  };
}

// ── Weekly on-chain root update ───────────────────────────────────────────────

export async function pushMerkleRootToChain(
  root: string,
  tokenCount: number,
  energyTotal: number,
  reportUri: string
): Promise<{ txHash: string; blockNumber: number; gasUsed: string }> {
  if (!POLYGON_PRIVATE_KEY) throw new Error('POLYGON_PRIVATE_KEY not set');

  const contractAddress = POLYGON_CONTRACT_ADDRESS || process.env.POLYGON_CONTRACT_ADDRESS;
  if (!contractAddress) throw new Error('POLYGON_CONTRACT_ADDRESS not set — deploy first');

  const { ethers } = await import('ethers');
  const artifact = await compileContract();
  const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
  const wallet = new ethers.Wallet(POLYGON_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

  const rootBytes = ethers.zeroPadValue(
    ethers.getBytes(root.startsWith('0x') ? root : '0x' + root),
    32
  );

  console.log(`📡 Pushing Merkle root to Polygon: ${root}`);
  const tx = await contract.publishWeeklyRoot(rootBytes, tokenCount, energyTotal, reportUri);
  const receipt = await tx.wait();

  console.log(`✅ Root published on-chain (block ${receipt.blockNumber}, tx ${receipt.hash})`);

  // Update bridge status in DB
  await pool.query(`
    UPDATE shape_token_state_roots
    SET bridge_status = 'bridged',
        bridge_tx_hash = $1,
        updated_at = NOW()
    WHERE bridge_status = 'not_bridged'
      AND state_merkle_root IS NOT NULL
  `, [receipt.hash]);

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber,
    gasUsed: receipt.gasUsed.toString()
  };
}

// ── Status check ──────────────────────────────────────────────────────────────

export async function getBridgeStatus(): Promise<{
  configured: boolean;
  hasPrivateKey: boolean;
  contractAddress: string | null;
  polygonRpc: string;
  lastOnChainRoot: any | null;
}> {
  let lastOnChainRoot = null;

  const contractAddress = POLYGON_CONTRACT_ADDRESS || null;

  if (POLYGON_PRIVATE_KEY && contractAddress) {
    try {
      const { ethers } = await import('ethers');
      const artifact = await compileContract();
      const provider = new ethers.JsonRpcProvider(POLYGON_RPC_URL);
      const contract = new ethers.Contract(contractAddress, artifact.abi, provider);
      const count = await contract.publishCount();
      if (count > 0n) {
        const [root, tokenCount, energyTotal, weekNumber, blockTimestamp, reportUri] =
          await contract.getLatestPublication();
        lastOnChainRoot = {
          root,
          tokenCount: Number(tokenCount),
          energyTotal: Number(energyTotal),
          weekNumber: Number(weekNumber),
          publishedAt: new Date(Number(blockTimestamp) * 1000).toISOString(),
          reportUri,
          publicationsTotal: Number(count)
        };
      }
    } catch (_) {}
  }

  return {
    configured: !!(POLYGON_PRIVATE_KEY && contractAddress),
    hasPrivateKey: !!POLYGON_PRIVATE_KEY,
    contractAddress,
    polygonRpc: POLYGON_RPC_URL,
    lastOnChainRoot
  };
}
