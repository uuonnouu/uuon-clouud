/**
 * UUON Foundation — Base Mainnet Calldata Anchor
 * Sends a 0 ETH transaction to own wallet with merkle root as calldata.
 * Permanent, timestamped, verifiable on Basescan. No contract needed.
 * Cost: ~$0.001 on Base mainnet.
 *
 * Usage: npx tsx scripts/anchor-base.ts
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { readFileSync, writeFileSync } from "fs";
import { ethers } from "ethers";

const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const WALLET_ADDRESS = process.env.METAMASK_WALLET_ADDRESS;
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;

if (!PRIVATE_KEY || !WALLET_ADDRESS || !THIRDWEB_CLIENT_ID) {
  console.error("FATAL: METAMASK_PRIVATE_KEY, METAMASK_WALLET_ADDRESS, and THIRDWEB_CLIENT_ID must be set.");
  process.exit(1);
}

const RPC_URL = `https://8453.rpc.thirdweb.com/${THIRDWEB_CLIENT_ID}`;

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON Base Mainnet Anchor — Phase II State Root");
  console.log("═══════════════════════════════════════════════════════\n");

  // Read manifest
  console.log("► Reading MERKLE_STATE_ROOT.json...");
  const manifest = JSON.parse(readFileSync("MERKLE_STATE_ROOT.json", "utf8"));
  console.log(`  Merkle root:  ${manifest.merkle_root}`);
  console.log(`  State hash:   ${manifest.state_hash}`);
  console.log(`  IPFS CID:     ${manifest.ipfs_cid}`);
  console.log(`  Shapes:       ${manifest.shapes_committed}\n`);

  if (!manifest.ipfs_cid) {
    console.error("FATAL: No IPFS CID found. Run pin-to-ipfs.ts first.");
    process.exit(1);
  }

  // Connect
  console.log("► Connecting to Base mainnet...");
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(wallet.address);

  console.log(`  Chain ID:     ${network.chainId}`);
  console.log(`  Wallet:       ${wallet.address}`);
  console.log(`  Balance:      ${ethers.formatEther(balance)} ETH\n`);

  if (network.chainId !== 8453n) {
    console.error(`FATAL: Wrong network. Expected Base mainnet (8453), got ${network.chainId}`);
    process.exit(1);
  }

  if (balance < ethers.parseEther("0.00005")) {
    console.error("FATAL: Insufficient ETH. Bridge at least 0.001 ETH to Base.");
    process.exit(1);
  }

  // Build calldata — structured anchor payload
  const anchorPayload = JSON.stringify({
    protocol: "UUON",
    version: "2.0",
    type: "STATE_ROOT_ANCHOR",
    phase: "II",
    merkle_root: manifest.merkle_root,
    state_hash: manifest.state_hash,
    shapes_committed: manifest.shapes_committed,
    ipfs_cid: manifest.ipfs_cid,
    genesis_hash: manifest.genesis_hash,
    timestamp: manifest.timestamp,
    copyright: "© UUON Foundation Inc. — Phillip Aguilar Ruiz III",
  });

  const calldata = ethers.hexlify(ethers.toUtf8Bytes(anchorPayload));

  console.log("► Anchor payload ready:");
  console.log(`  Payload size: ${anchorPayload.length} bytes`);
  console.log(`  Calldata:     ${calldata.substring(0, 66)}...\n`);

  // Estimate gas
  const gasEstimate = await provider.estimateGas({
    from: wallet.address,
    to: wallet.address,
    value: 0n,
    data: calldata,
  });

  const feeData = await provider.getFeeData();
  const gasCost = gasEstimate * (feeData.gasPrice ?? 1000000n);
  console.log(`  Est. gas:     ${gasEstimate.toString()} units`);
  console.log(`  Est. cost:    ${ethers.formatEther(gasCost)} ETH\n`);

  // Send anchor transaction
  console.log("► Sending anchor transaction to Base mainnet...");
  const tx = await wallet.sendTransaction({
    to: wallet.address,
    value: 0n,
    data: calldata,
  });

  console.log(`  Tx hash:      ${tx.hash}`);
  console.log("  Waiting for confirmation...");
  const receipt = await tx.wait();

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  BASE ANCHOR COMPLETE — UUON PHASE II");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Tx hash:      ${tx.hash}`);
  console.log(`  Block:        ${receipt!.blockNumber}`);
  console.log(`  Gas used:     ${receipt!.gasUsed.toString()}`);
  console.log(`  Explorer:     https://basescan.org/tx/${tx.hash}`);
  console.log("═══════════════════════════════════════════════════════");
  console.log("\n  ✓ Merkle root permanently anchored on Base mainnet.");
  console.log("  ✓ Verifiable at basescan.org forever.\n");

  // Update manifest
  const updated = {
    ...manifest,
    base_tx_hash: tx.hash,
    base_block: receipt!.blockNumber,
    base_explorer: `https://basescan.org/tx/${tx.hash}`,
    anchored_at: new Date().toISOString(),
  };

  writeFileSync("MERKLE_STATE_ROOT.json", JSON.stringify(updated, null, 2), "utf8");
  console.log("  ✓ MERKLE_STATE_ROOT.json updated with on-chain proof.");
  console.log("  ✓ Publish MERKLE_STATE_ROOT.json to UUON-Dmension-Mathematical-Universe repo.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});