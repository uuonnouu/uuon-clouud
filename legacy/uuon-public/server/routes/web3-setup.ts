/**
 * WEB3 SETUP STATUS API
 * Returns which credentials are configured and what each unlocks.
 * Powers the in-app setup checklist in the MetaMask wallet panel.
 */

import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

/** Path where /api/polygon/deploy writes the deployed contract address */
const DEPLOYED_CONTRACT_FILE = path.join(process.cwd(), 'server', 'deployed-contract.json');

/** Read the persisted contract address (env var takes priority) */
function getContractAddress(): string | null {
  if (process.env.POLYGON_CONTRACT_ADDRESS) return process.env.POLYGON_CONTRACT_ADDRESS;
  try {
    if (fs.existsSync(DEPLOYED_CONTRACT_FILE)) {
      const raw = fs.readFileSync(DEPLOYED_CONTRACT_FILE, 'utf8');
      const data = JSON.parse(raw);
      return data.contract_address || null;
    }
  } catch { /* ignore read errors */ }
  return null;
}

/** Persist a deployed contract address so it survives restarts (before the user adds the env var) */
export function saveDeployedContractAddress(address: string): void {
  try {
    fs.writeFileSync(DEPLOYED_CONTRACT_FILE, JSON.stringify({ contract_address: address, deployed_at: new Date().toISOString() }, null, 2));
  } catch (err) {
    console.warn('[web3-setup] Could not persist contract address:', err);
  }
}

interface CredentialStatus {
  configured: boolean;
  label: string;
  purpose: string;
  howToGet: string;
  getUrl: string;
  cost: string;
}

/**
 * GET /api/web3/setup-status
 * Returns configuration state for every Web3 credential.
 * IPFS readiness: Pinata JWT, Pinata API key/secret, OR NFT.Storage all count.
 * Public endpoint — credentials are checked server-side, never exposed to client.
 */
router.get('/setup-status', (_req: Request, res: Response) => {
  const pinataJwt = !!process.env.PINATA_JWT;
  const pinataKey = !!(process.env.PINATA_API_KEY && process.env.PINATA_API_SECRET);
  const nftStorageReady = !!process.env.NFT_STORAGE_API_KEY;
  const ipfsConfigured = pinataJwt || pinataKey || nftStorageReady;

  const walletAddressConfigured = !!process.env.METAMASK_WALLET_ADDRESS;
  const thirdwebConfigured = !!(process.env.THIRDWEB_CLIENT_ID && process.env.THIRDWEB_SECRET_KEY);
  const polygonKeyConfigured = !!process.env.POLYGON_PRIVATE_KEY;
  const contractAddress = getContractAddress();
  const contractDeployed = !!contractAddress;

  const credentials: CredentialStatus[] = [
    {
      configured: walletAddressConfigured,
      label: 'MetaMask Wallet Address (METAMASK_WALLET_ADDRESS)',
      purpose: 'Default recipient address for NFT mints and fee payments — pre-fills the recipient field so you never have to type it',
      howToGet: 'Open MetaMask → copy your public wallet address (starts with 0x) → add as Replit Secret',
      getUrl: 'https://metamask.io/',
      cost: 'Free'
    },
    {
      configured: ipfsConfigured,
      label: 'Pinata IPFS (or NFT.Storage)',
      purpose: 'Stores your NFT 3D model (GLB) and preview image permanently on IPFS. Either Pinata or NFT.Storage works.',
      howToGet: 'Pinata: Sign up → API Keys → Create Key → copy JWT. Or use NFT.Storage: sign up → API → Create Key.',
      getUrl: 'https://app.pinata.cloud/developers/api-keys',
      cost: 'Free (1 GB free tier)'
    },
    {
      configured: thirdwebConfigured,
      label: 'Thirdweb',
      purpose: 'Deploys NFT contracts and enables gasless minting for your users',
      howToGet: 'Sign up free → Settings → API Keys → Create API Key → copy Client ID and Secret Key',
      getUrl: 'https://thirdweb.com/dashboard/settings/api-keys',
      cost: 'Free account available'
    },
    {
      configured: polygonKeyConfigured,
      label: 'Polygon Wallet (POLYGON_PRIVATE_KEY)',
      purpose: 'Required to deploy the MerkleRootRegistry contract and push weekly on-chain proofs',
      howToGet: 'Export private key from MetaMask → add as Replit Secret → fund with ~5 MATIC',
      getUrl: 'https://metamask.io/',
      cost: '~$2–5 MATIC one-time for contract deploy; ~$0.01 per weekly root push'
    },
    {
      configured: contractDeployed,
      label: 'Contract Address (POLYGON_CONTRACT_ADDRESS)',
      purpose: 'Set after deploying — enables weekly on-chain Merkle root proofs and your OpenSea collection link',
      howToGet: contractDeployed
        ? 'Already deployed — add POLYGON_CONTRACT_ADDRESS env var to make permanent'
        : 'Click "Deploy Contract" below once POLYGON_PRIVATE_KEY is set',
      getUrl: contractDeployed
        ? `https://polygonscan.com/address/${contractAddress}`
        : 'https://polygonscan.com/',
      cost: 'Included in contract deploy cost above'
    }
  ];

  const configuredCount = credentials.filter(c => c.configured).length;
  const allConfigured = configuredCount === credentials.length;
  const ipfsReady = ipfsConfigured;
  const mintingReady = ipfsReady && thirdwebConfigured;
  const onChainReady = polygonKeyConfigured && contractDeployed;

  // Fixed collection slug — this is the Dmension OpenSea collection page.
  // Only expose when we actually have a deployed contract (otherwise the page may 404).
  const collectionUrl = contractDeployed
    ? 'https://opensea.io/collection/dmension-mathematical-universe'
    : null;

  // Thirdweb contract URL — use "polygon" chain name (not chain ID 137) and include /mint path.
  const thirdwebContractUrl = contractAddress
    ? `https://thirdweb.com/polygon/${contractAddress}/nfts/mint`
    : 'https://thirdweb.com/explore/nft-collection';

  // Public wallet address is safe to return — it's visible on-chain
  const defaultRecipientAddress = process.env.METAMASK_WALLET_ADDRESS || null;

  res.json({
    success: true,
    credentials,
    defaultRecipientAddress,
    summary: {
      configuredCount,
      totalCount: credentials.length,
      allConfigured,
      ipfsReady,
      mintingReady,
      onChainReady,
      readinessPercent: Math.round((configuredCount / credentials.length) * 100)
    },
    collectionUrl,
    thirdwebContractUrl,
    contractAddress,
    gasEstimates: {
      pinataIpfs: 'Free',
      thirdwebContractDeploy: '~$0.001 on Base / ~$2–5 on Polygon',
      polygonContractDeploy: '~$2–5 MATIC (one-time)',
      weeklyMerkleRoot: '~$0.01 MATIC per week',
      userNftMint: 'User pays their own gas via MetaMask'
    },
    nextSteps: [
      !ipfsConfigured && { priority: 1, action: 'Add PINATA_JWT to Replit Secrets (free at pinata.cloud) — or NFT_STORAGE_API_KEY (free at nft.storage)' },
      !thirdwebConfigured && { priority: 2, action: 'Add THIRDWEB_CLIENT_ID + THIRDWEB_SECRET_KEY (free at thirdweb.com)' },
      !polygonKeyConfigured && { priority: 3, action: 'Add POLYGON_PRIVATE_KEY with ~5 MATIC to deploy contract' },
      polygonKeyConfigured && !contractDeployed && { priority: 3, action: 'Deploy contract via the Deploy button' },
      contractDeployed && !process.env.POLYGON_CONTRACT_ADDRESS && {
        priority: 4,
        action: `Add POLYGON_CONTRACT_ADDRESS=${contractAddress} to Replit Secrets to make contract permanent`
      }
    ].filter(Boolean)
  });
});

export default router;
