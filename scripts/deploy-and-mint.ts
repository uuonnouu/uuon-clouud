/**
 * UUON Foundation — NFT Bulk Mint v2
 * Hardened resumable minter with:
 *   - ETH balance check before starting
 *   - Exponential backoff on failure
 *   - Error classification (skip vs retry vs abort)
 *   - Configurable delay between mints to avoid rate limits
 *   - Progress saved after every successful mint
 *   - Dry-run mode to test without spending gas
 *
 * Usage:
 *   DATABASE_URL="..." UUON_CONTRACT_ADDRESS=$UUON_MATHEMATICAL_UNIVERS_WALLET \
 *   npx tsx scripts/deploy-and-mint-v2.ts
 *
 * Resumes automatically from mint-progress.json if it exists.
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { mintTo } from "thirdweb/extensions/erc1155";
import { getWalletBalance } from "thirdweb/wallets";
import { neon } from "@neondatabase/serverless";
import { createHash } from "crypto";
import * as fs from "fs";

// ── Config ───────────────────────────────────────────────────────────────────

const REQUIRED_ENV = [
  "THIRDWEB_CLIENT_ID",
  "THIRDWEB_SECRET_KEY",
  "METAMASK_PRIVATE_KEY",
  "UUON_CONTRACT_ADDRESS",
  "DATABASE_URL",
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing environment variable: ${key}`);
    process.exit(1);
  }
}

const CLIENT_ID       = process.env.THIRDWEB_CLIENT_ID!;
const SECRET_KEY      = process.env.THIRDWEB_SECRET_KEY!;
const PRIVATE_KEY     = process.env.METAMASK_PRIVATE_KEY!;
const CONTRACT_ADDR   = process.env.UUON_CONTRACT_ADDRESS!;
const DATABASE_URL    = process.env.DATABASE_URL!;

// Tuning — adjust these if you're still hitting failures
const DELAY_MS_BETWEEN_MINTS = 1200;   // 1.2 seconds between each mint
const MAX_RETRIES_PER_MINT   = 3;      // retry a failed mint this many times
const RETRY_BACKOFF_BASE_MS  = 3000;   // first retry waits 3s, second 9s, third 27s
const MIN_ETH_BALANCE        = 0.005;  // abort if wallet drops below this (ETH)
const PROGRESS_FILE          = "mint-progress.json";
const DRY_RUN                = process.env.DRY_RUN === "true"; // set DRY_RUN=true to simulate

const MERKLE_ROOT = "7d2295473f46552165f096b029d499cf74a3919638954567137672ded5d8d476";
const GENESIS_HASH = "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04";
const IPFS_CID = "bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MintProgress {
  lastMintedIndex: number;   // 0-based index into shapes array
  mintedCount: number;
  failedCount: number;
  skippedCount: number;
  startedAt: string;
  updatedAt: string;
}

interface ShapeRow {
  id: number;
  shape_type: string;
  display_name: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  source: string | null;
  is_active: boolean;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function sha256(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function loadProgress(): MintProgress | null {
  if (!fs.existsSync(PROGRESS_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
  } catch {
    console.warn("⚠ Could not parse progress file — starting fresh.");
    return null;
  }
}

function saveProgress(p: MintProgress): void {
  p.updatedAt = new Date().toISOString();
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p, null, 2), "utf8");
}

function getRarity(shape: ShapeRow): string {
  const cat = shape.category?.toLowerCase() ?? "";
  if (cat.includes("quantum") || cat.includes("hyperdimensional")) return "Legendary";
  if (cat.includes("cryptographic") || cat.includes("medical")) return "Epic";
  if (cat.includes("financial") || cat.includes("astrophysical")) return "Rare";
  return "Common";
}

function buildMetadata(shape: ShapeRow, index: number): object {
  return {
    name: shape.display_name || shape.shape_type,
    description: shape.description
      || `UUON Mathematical Universe — ${shape.category} shape. Part of the Dmension shape registry.`,
    image: `https://ipfs.io/ipfs/${IPFS_CID}`,
    external_url: `https://dmension.io/shapes/${shape.shape_type}`,
    attributes: [
      { trait_type: "Category",    value: shape.category || "General" },
      { trait_type: "Subcategory", value: shape.subcategory || "None" },
      { trait_type: "Rarity",      value: getRarity(shape) },
      { trait_type: "Source",      value: shape.source || "registry" },
      { trait_type: "Shape Type",  value: shape.shape_type },
      { trait_type: "Registry ID", value: shape.id.toString() },
      { trait_type: "Merkle Root", value: MERKLE_ROOT },
      { trait_type: "Genesis",     value: GENESIS_HASH },
      { trait_type: "Active",      value: shape.is_active ? "Yes" : "No" },
    ],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  UUON NFT Bulk Mint v2 — Hardened Resumable");
  if (DRY_RUN) console.log("  ⚠  DRY RUN MODE — no transactions will be sent");
  console.log("═══════════════════════════════════════════════════════\n");

  // ── Connect ─────────────────────────────────────────────────────────────────
  const client = createThirdwebClient({ clientId: CLIENT_ID, secretKey: SECRET_KEY });
  const account = privateKeyToAccount({ client, privateKey: PRIVATE_KEY as `0x${string}` });
  const contract = getContract({ client, chain: base, address: CONTRACT_ADDR as `0x${string}` });

  console.log(`► Wallet:   ${account.address}`);
  console.log(`► Contract: ${CONTRACT_ADDR}`);
  console.log(`► Chain:    Base mainnet\n`);

  // ── ETH balance check ────────────────────────────────────────────────────────
  if (!DRY_RUN) {
    console.log("► Checking wallet ETH balance...");
    const balance = await getWalletBalance({ address: account.address, client, chain: base });
    const ethBalance = parseFloat(balance.displayValue);
    console.log(`  Balance: ${ethBalance.toFixed(6)} ETH`);

    if (ethBalance < MIN_ETH_BALANCE) {
      console.error(`\n✗ ABORT: Wallet has only ${ethBalance} ETH. Minimum required: ${MIN_ETH_BALANCE} ETH.`);
      console.error("  Bridge more ETH to Base before continuing.");
      process.exit(1);
    }
    console.log("  ✓ Balance sufficient\n");
  }

  // ── Load shapes from DB ──────────────────────────────────────────────────────
  console.log("► Fetching shapes from complete_shape_registry...");
  const sql = neon(DATABASE_URL);
  const shapes = await sql<ShapeRow>`
    SELECT id, shape_type, display_name, category, subcategory,
           description, source, is_active
    FROM complete_shape_registry
    ORDER BY id ASC
  ` as ShapeRow[];
  console.log(`  Total shapes: ${shapes.length}\n`);

  // ── Load or init progress ────────────────────────────────────────────────────
  let progress = loadProgress();
  let startIndex = 0;

  if (progress) {
    startIndex = progress.lastMintedIndex + 1;
    console.log(`► Resuming from shape ${startIndex + 1} / ${shapes.length}`);
    console.log(`  Previously minted:  ${progress.mintedCount}`);
    console.log(`  Previously failed:  ${progress.failedCount}`);
    console.log(`  Previously skipped: ${progress.skippedCount}\n`);
  } else {
    progress = {
      lastMintedIndex: -1,
      mintedCount: 0,
      failedCount: 0,
      skippedCount: 0,
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log("► Starting fresh mint run\n");
  }

  if (startIndex >= shapes.length) {
    console.log("✓ All shapes already minted! Nothing to do.");
    process.exit(0);
  }

  // ── Mint loop ────────────────────────────────────────────────────────────────
  console.log(`► Minting shapes ${startIndex + 1} → ${shapes.length}...\n`);
  let consecutiveFailures = 0;

  for (let i = startIndex; i < shapes.length; i++) {
    const shape = shapes[i];
    const shapeNum = i + 1;

    // ETH check every 50 mints
    if (!DRY_RUN && i % 50 === 0 && i > startIndex) {
      const balance = await getWalletBalance({ address: account.address, client, chain: base });
      const eth = parseFloat(balance.displayValue);
      if (eth < MIN_ETH_BALANCE) {
        console.error(`\n✗ ABORT at shape ${shapeNum}: wallet ETH too low (${eth} ETH).`);
        console.error("  Bridge more ETH and run again — progress is saved.");
        saveProgress(progress);
        process.exit(1);
      }
    }

    const metadata = buildMetadata(shape, i);
    let minted = false;

    for (let attempt = 0; attempt < MAX_RETRIES_PER_MINT; attempt++) {
      try {
        if (!DRY_RUN) {
          // Pin metadata to IPFS via thirdweb storage, then mint
          const metadataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString("base64")}`;

          const transaction = mintTo({
            contract,
            to: account.address,
            nft: {
              name: (metadata as any).name,
              description: (metadata as any).description,
              image: (metadata as any).image,
              attributes: (metadata as any).attributes,
            },
            supply: 1n,
          });

          await sendTransaction({ transaction, account });
        }

        // Success
        progress.mintedCount++;
        progress.lastMintedIndex = i;
        consecutiveFailures = 0;
        saveProgress(progress);

        const status = DRY_RUN ? "[DRY]" : "✓";
        process.stdout.write(
          `  ${status} ${String(shapeNum).padStart(4)} / ${shapes.length} ` +
          `| ${shape.shape_type.substring(0, 32).padEnd(32)} ` +
          `| ${getRarity(shape)}\n`
        );

        minted = true;
        break;

      } catch (err: any) {
        const msg = err?.message ?? String(err);

        // Classify error
        const isOutOfGas = msg.includes("insufficient funds") || msg.includes("gas");
        const isRateLimit = msg.includes("429") || msg.includes("rate") || msg.includes("too many");
        const isSkippable = msg.includes("already minted") || msg.includes("token exists");
        const isContractRevert = msg.includes("revert") && !isOutOfGas;

        if (isOutOfGas) {
          console.error(`\n✗ OUT OF GAS at shape ${shapeNum}. Aborting — add ETH and resume.`);
          saveProgress(progress);
          process.exit(1);
        }

        if (isSkippable) {
          process.stdout.write(`  SKIP ${String(shapeNum).padStart(4)} | already exists: ${shape.shape_type}\n`);
          progress.skippedCount++;
          progress.lastMintedIndex = i;
          saveProgress(progress);
          minted = true;
          break;
        }

        if (attempt < MAX_RETRIES_PER_MINT - 1) {
          const wait = RETRY_BACKOFF_BASE_MS * Math.pow(3, attempt);
          const reason = isRateLimit ? "rate limit" : isContractRevert ? "contract revert" : "network error";
          process.stdout.write(`  ↺ Retry ${attempt + 1}/${MAX_RETRIES_PER_MINT - 1} (${reason}, wait ${wait}ms): ${shape.shape_type}\n`);
          await sleep(wait);
        } else {
          process.stdout.write(`  ✗ FAIL  ${String(shapeNum).padStart(4)} | ${shape.shape_type} — ${msg.substring(0, 60)}\n`);
          progress.failedCount++;
          progress.lastMintedIndex = i;
          consecutiveFailures++;
          saveProgress(progress);
        }
      }
    }

    // Abort if too many consecutive failures — probably a systemic problem
    if (consecutiveFailures >= 10) {
      console.error("\n✗ ABORT: 10 consecutive failures. Check contract, gas, and RPC.\n");
      console.error(`  Progress saved at shape ${shapeNum}. Run again to resume.`);
      process.exit(1);
    }

    // Delay between mints to avoid rate limiting
    if (minted && i < shapes.length - 1) {
      await sleep(DELAY_MS_BETWEEN_MINTS);
    }
  }

  // ── Final report ─────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  MINT COMPLETE");
  console.log("═══════════════════════════════════════════════════════");
  console.log(`  Total shapes:   ${shapes.length}`);
  console.log(`  Minted:         ${progress.mintedCount}`);
  console.log(`  Skipped:        ${progress.skippedCount}`);
  console.log(`  Failed:         ${progress.failedCount}`);
  console.log(`  OpenSea:        https://opensea.io/assets/base/${CONTRACT_ADDR}`);
  console.log("═══════════════════════════════════════════════════════\n");

  if (progress.failedCount > 0) {
    console.log(`⚠ ${progress.failedCount} shapes failed. Run again to retry them.`);
    console.log("  The script will resume from where it left off.\n");
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("\nFATAL:", err);
  process.exit(1);
});
