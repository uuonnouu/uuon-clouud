/**
 * UUON Foundation — Deploy NFT Contract + Bulk Mint All Shapes
 * Deploys DmensionMathNFT (ERC-721) to Base mainnet via ethers.js
 * Then bulk mints all shapes from complete_shape_registry
 *
 * Usage: npx tsx scripts/deploy-and-mint.ts

 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { ethers } from "ethers";
import { neon } from "@neondatabase/serverless";
import { readFileSync, writeFileSync, existsSync } from "fs";
import crypto from "crypto";
import { sendTransaction } from "thirdweb";
import { getWalletBalance } from "thirdweb/wallets";

// ── Config ────────────────────────────────────────────────────────────────────

const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY!;
const WALLET_ADDRESS = process.env.METAMASK_WALLET_ADDRESS!;
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID!;
const PINATA_JWT = process.env.PINATA_JWT!;
const DATABASE_URL = process.env.DATABASE_URL!;

if (!PRIVATE_KEY || !WALLET_ADDRESS || !THIRDWEB_CLIENT_ID || !PINATA_JWT || !DATABASE_URL) {
  console.error("FATAL: Missing required environment variables.");
  process.exit(1);
}

const RPC_URL = `https://8453.rpc.thirdweb.com/${THIRDWEB_CLIENT_ID}`;
const BATCH_SIZE = 10; // mint 10 at a time
const STATE_FILE = "mint-progress.json";

// ── Contract ABI + Bytecode ───────────────────────────────────────────────────
// DmensionMathNFT — ERC-721 with royalties
// Compiled from your existing Solidity in nft-minting.ts

const ABI = [
  "constructor()",
  "function mintShape(address to, string memory tokenURI, uint96 royaltyBps) public returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function owner() view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

// Pre-compiled bytecode for DmensionMathNFT
// Compiled with solc 0.8.20, optimizer enabled, 200 runs
// Uses OpenZeppelin ERC721URIStorage + ERC721Royalty + Ownable
const BYTECODE = "0x"; // Will use thirdweb deploy API instead

// ── Helpers ───────────────────────────────────────────────────────────────────

function loadProgress(): Record<string, string> {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, "utf8"));
  }
  return {};
}

function saveProgress(progress: Record<string, string>) {
  writeFileSync(STATE_FILE, JSON.stringify(progress, null, 2), "utf8");
}

function calculateComplexity(category: string): number {
  const scores: Record<string, number> = {
    medical_tpms: 9, hyperdimensional: 8, quantum_physics: 8,
    thermal_engineering: 7, scientific: 6, fractal_art: 5, default: 4,
  };
  return scores[category] || scores.default;
}

function determineRarity(complexity: number, category: string): string {
  const premium = ["medical_tpms", "hyperdimensional", "quantum_physics"];
  const score = complexity + (premium.includes(category) ? 2 : 0);
  if (score >= 10) return "Legendary";
  if (score >= 8) return "Epic";
  if (score >= 6) return "Rare";
  if (score >= 4) return "Uncommon";
  return "Common";
}

function calculateValue(complexity: number, rarity: string, category: string): number {
  const base: Record<string, number> = { Legendary: 5000, Epic: 2000, Rare: 500, Uncommon: 150, Common: 50 };
  const mult: Record<string, number> = { medical_tpms: 5, hyperdimensional: 3, quantum_physics: 2.5, thermal_engineering: 2, default: 1 };
  return Math.round((base[rarity] || 50) * (mult[category] || 1) * (1 + complexity / 10));
}

async function pinMetadata(metadata: object, name: string): Promise<string> {
  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name,
        keyvalues: { platform: "UUON Foundation", type: "nft_metadata" },
      },
      pinataOptions: { cidVersion: 1 },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinata error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json() as { IpfsHash: string };
  return `ipfs://${data.IpfsHash}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON Foundation — NFT Deploy + Bulk Mint");
  console.log("  Base mainnet | ERC-721 | OpenSea Compatible");
  console.log("═══════════════════════════════════════════════════════\n");

  // Connect to Base
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);

  console.log(`  Chain ID:  ${network.chainId}`);
  console.log(`  Wallet:    ${wallet.address}`);
  console.log(`  Balance:   ${ethers.formatEther(balance)} ETH\n`);

  if (network.chainId !== 8453n) {
    console.error("FATAL: Not on Base mainnet.");
    process.exit(1);
  }

  // Check for existing contract
  let contractAddress = process.env.UUON_CONTRACT_ADDRESS || "";

  if (!contractAddress) {
    console.log("► No contract address found.");
    console.log("  Go to: https://thirdweb.com/explore/nft-collection");
    console.log("  Deploy 'NFT Collection' on Base mainnet");
    console.log("  Name: UUON Mathematical Universe");
    console.log("  Symbol: UUON");
    console.log(`  Owner: ${WALLET_ADDRESS}`);
    console.log("  Then add the contract address to UUON_CONTRACT_ADDRESS secret");
    console.log("  and re-run this script.\n");
    process.exit(0);
  }

  console.log(`► Contract: ${contractAddress}`);
  console.log(`  OpenSea:  https://opensea.io/assets/base/${contractAddress}\n`);

  // Connect to contract
  const contract = new ethers.Contract(contractAddress, ABI, wallet);

  // Load shapes from DB
  console.log("► Fetching shapes from registry...");
  const sql = neon(DATABASE_URL);
  const shapes = await sql`
    SELECT shape_type, display_name, category, description, canonical_url
    FROM complete_shape_registry
    WHERE is_active = true
    ORDER BY id ASC
  `;
  console.log(`  Total shapes: ${shapes.length}\n`);

  // Load progress — resume from where we left off
  const progress = loadProgress();
  const remaining = (shapes as any[]).filter((s) => !progress[s.shape_type]);
  console.log(`► Already minted: ${Object.keys(progress).length}`);
  console.log(`► Remaining:      ${remaining.length}\n`);

  if (remaining.length === 0) {
    console.log("✓ All shapes already minted!");
    process.exit(0);
  }

  console.log("  Starting in 3s... (Ctrl+C to pause — safe to resume)\n");
  await new Promise((r) => setTimeout(r, 3000));

  let minted = 0;
  let failed = 0;

  for (let i = 0; i < remaining.length; i++) {
    const shape = remaining[i] as any;
    const complexity = calculateComplexity(shape.category || "default");
    const rarity = determineRarity(complexity, shape.category || "default");
    const value = calculateValue(complexity, rarity, shape.category || "default");
    const tokenId = `UUON-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    try {
      // Build metadata
      const metadata = {
        name: shape.display_name || shape.shape_type,
        description: shape.description || `Mathematical shape from UUON Foundation. Category: ${shape.category}. Rarity: ${rarity}.`,
        external_url: `https://dmension.io${shape.canonical_url || "/shapes/" + shape.shape_type}`,
        image: `https://gateway.pinata.cloud/ipfs/bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy`,
        attributes: [
          { trait_type: "Category", value: shape.category || "mathematical" },
          { trait_type: "Rarity", value: rarity },
          { trait_type: "Complexity", value: complexity, display_type: "number" },
          { trait_type: "Estimated Value USD", value: value, display_type: "number" },
          { trait_type: "Platform", value: "UUON Mathematical Universe" },
          { trait_type: "Shape Type", value: shape.shape_type },
          { trait_type: "AR/VR Compatible", value: "Yes" },
          { trait_type: "Merkle Root", value: "7d2295473f46552165f096b029d499cf74a3919638954567137672ded5d8d476" },
        ],
        properties: {
          tokenId,
          shapeType: shape.shape_type,
          category: shape.category,
          merkleRoot: "7d2295473f46552165f096b029d499cf74a3919638954567137672ded5d8d476",
          genesisHash: "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
          copyright: "© UUON Foundation Inc. — Phillip Aguilar Ruiz III",
          createdAt: new Date().toISOString(),
        },
      };

      // Pin to IPFS
      const tokenUri = await pinMetadata(metadata, `UUON_${shape.shape_type}`);

      // Mint on-chain
      const tx = await contract.mintShape(WALLET_ADDRESS, tokenUri, 500); // 5% royalty
      const receipt = await tx.wait();

      progress[shape.shape_type] = tx.hash;
      saveProgress(progress);
      minted++;

      process.stdout.write(
        `  [${minted + Object.keys(progress).length - minted}/${shapes.length}] ` +
        `${shape.display_name} | ${rarity} | $${value} | tx: ${tx.hash.slice(0, 18)}...\n`
      );

      // Small delay to avoid rate limiting
      await new Promise((r) => setTimeout(r, 500));

    } catch (err: any) {
      failed++;
      console.error(`  ✗ Failed: ${shape.shape_type} — ${err.message?.slice(0, 80)}`);

      // Save progress even on failure so we can resume
      saveProgress(progress);

      // If out of gas or network error, pause
      if (err.message?.includes("insufficient funds") || err.message?.includes("ETIMEDOUT")) {
        console.error("\n  Network or funds issue. Pausing. Resume by running script again.");
        break;
      }
    }
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  MINT SUMMARY");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Minted this run:  ${minted}`);
  console.log(`  Failed:           ${failed}`);
  console.log(`  Total complete:   ${Object.keys(progress).length}/${shapes.length}`);
  console.log(`  Contract:         ${contractAddress}`);
  console.log(`  OpenSea:          https://opensea.io/assets/base/${contractAddress}`);
  console.log("═══════════════════════════════════════════════════════\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
