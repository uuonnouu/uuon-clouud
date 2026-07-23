/**
 * UUON Foundation — IPFS Pinata Anchor
 * Pins MERKLE_STATE_ROOT.json to IPFS via Pinata.
 * Returns a permanent CID — the content address of the Phase II state root.
 *
 * Usage: npx tsx scripts/pin-to-ipfs.ts
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { readFileSync, writeFileSync } from "fs";

const PINATA_JWT = process.env.PINATA_JWT;
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;

if (!PINATA_JWT && !(PINATA_API_KEY && PINATA_API_SECRET)) {
  console.error("FATAL: PINATA_JWT or PINATA_API_KEY + PINATA_API_SECRET must be set.");
  process.exit(1);
}

async function pinJSON(data: object, name: string): Promise<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (PINATA_JWT) {
    headers["Authorization"] = `Bearer ${PINATA_JWT}`;
  } else {
    headers["pinata_api_key"] = PINATA_API_KEY!;
    headers["pinata_secret_api_key"] = PINATA_API_SECRET!;
  }

  const body = JSON.stringify({
    pinataContent: data,
    pinataMetadata: {
      name,
      keyvalues: {
        project: "UUON Foundation",
        type: "merkle_state_root",
        phase: "II",
        creator: "Phillip Aguilar Ruiz III",
      },
    },
    pinataOptions: {
      cidVersion: 1,
    },
  });

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers,
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Pinata API error ${response.status}: ${error}`);
  }

  const result = await response.json() as { IpfsHash: string };
  return result.IpfsHash;
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON IPFS Anchor — Phase II State Root");
  console.log("═══════════════════════════════════════════════════════\n");

  // Read the merkle root manifest
  console.log("► Reading MERKLE_STATE_ROOT.json...");
  const manifest = JSON.parse(readFileSync("MERKLE_STATE_ROOT.json", "utf8"));
  console.log(`  Merkle root: ${manifest.merkle_root}`);
  console.log(`  Shapes:      ${manifest.shapes_committed}`);
  console.log(`  Timestamp:   ${manifest.timestamp}\n`);

  // Pin to IPFS
  console.log("► Pinning to IPFS via Pinata...");
  const cid = await pinJSON(manifest, "UUON-Dmension-Mathematical-Universe-Phase-II");

  const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${cid}`;
  const ipfsPublic = `https://ipfs.io/ipfs/${cid}`;

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  IPFS ANCHOR COMPLETE");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  CID:           ${cid}`);
  console.log(`  Pinata URL:    ${ipfsUrl}`);
  console.log(`  Public URL:    ${ipfsPublic}`);
  console.log("═══════════════════════════════════════════════════════");

  // Update the manifest with the CID
  const updated = {
    ...manifest,
    ipfs_cid: cid,
    ipfs_url: ipfsPublic,
    pinned_at: new Date().toISOString(),
  };

  writeFileSync("MERKLE_STATE_ROOT.json", JSON.stringify(updated, null, 2), "utf8");
  console.log("\n  ✓ MERKLE_STATE_ROOT.json updated with CID.");
  console.log("  ✓ Next: anchor merkle_root on Base mainnet.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});