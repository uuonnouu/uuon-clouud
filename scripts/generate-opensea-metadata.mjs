/**
 * UUON Foundation — scripts/generate-opensea-metadata.mjs
 * Patched: column names aligned to actual formula_implementations schema.
 *
 * Run:
 *   DATABASE_URL=... PINATA_JWT=... node scripts/generate-opensea-metadata.mjs
 *   DATABASE_URL=... node scripts/generate-opensea-metadata.mjs --dry-run
 *   DATABASE_URL=... node scripts/generate-opensea-metadata.mjs --token-id=1 --dry-run
 *
 * © UUON Foundation Inc. — Phillip Aguilar Ruiz III
 */

import { neon } from '@neondatabase/serverless';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const DATABASE_URL = process.env.DATABASE_URL;
const PINATA_JWT   = process.env.PINATA_JWT;

if (!DATABASE_URL) {
  console.error('FATAL: DATABASE_URL not set.');
  process.exit(1);
}

const args       = process.argv.slice(2);
const DRY_RUN    = args.includes('--dry-run');
const BATCH_SIZE = parseInt(args.find(a => a.startsWith('--batch='))?.split('=')[1] ?? '50');
const SINGLE_ID  = args.find(a => a.startsWith('--token-id='))?.split('=')[1];

const NFT_CONTRACT  = process.env.UUON_CONTRACT_ADDRESS ?? '0xa14c3015E6b9Ad30337bD72c94Dc236835f61165';
const GENESIS_HASH  = 'cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04';
const MERKLE_ROOT   = '54fff9e19a729a3bfffbf9926d1e09d5134cb6e12a0723211ea04904d68530af';
const IPFS_CATALOG  = 'QmU7zUDNF3pyuWqNsfH9QCUJcT4oCUBr5JQfeptdCVT7t8';
const BASE_CHAIN_ID = 8453;

const OUT_DIR = join(__dirname, '..', 'metadata');
mkdirSync(OUT_DIR, { recursive: true });

const sql = neon(DATABASE_URL);

// Complexity class → numeric score
function complexityToScore(cls) {
  const map = { 'O(1)': 1, 'O(log n)': 2, 'O(n)': 3, 'O(n^2)': 5, 'O(n^3)': 7, 'O(2^n)': 9 };
  return map[cls] ?? 5;
}

function complexityRarity(score) {
  if (score >= 9) return 'Legendary';
  if (score >= 7) return 'Epic';
  if (score >= 5) return 'Rare';
  if (score >= 3) return 'Uncommon';
  return 'Common';
}

function buildTokenMetadata(shape, tokenId) {
  const score = complexityToScore(shape.complexity_class);
  const rarity = complexityRarity(score);

  const hasEquation = !!(
    shape.equation_x &&
    !['u','v','0','undefined','','MISSING'].includes(shape.equation_x)
  );

  return {
    name: shape.display_name ?? shape.shape_type,
    description: [
      `A ${shape.category} parametric surface from the Dmension Mathematical Universe.`,
      '',
      `Shape Type: ${shape.shape_type}`,
      `Category: ${shape.category}`,
      `Fibonacci Level: ${shape.fibonacci_level ?? 1}`,
      hasEquation
        ? 'Equation DNA: Verified — X,Y,Z parametric equations on-chain.'
        : 'Equation DNA: Pending verification.',
      '',
      `2,856 unique parametric shapes anchored on Base Mainnet by UUON Foundation Inc.`,
      '',
      `Genesis Hash: ${GENESIS_HASH.slice(0, 16)}...`,
      `Merkle Root:  ${MERKLE_ROOT.slice(0, 16)}...`,
      `IPFS Catalog: ipfs://${IPFS_CATALOG}`,
    ].join('\n'),
    image:         `ipfs://${IPFS_CATALOG}/${shape.shape_type}/thumbnail.png`,
    animation_url: `ipfs://${IPFS_CATALOG}/${shape.shape_type}/model.glb`,
    external_url:  `https://dmension.app/shapes/${shape.shape_type}`,
    attributes: [
      { trait_type: 'Shape Type',        value: shape.shape_type },
      { trait_type: 'Category',          value: shape.category ?? 'Mathematical' },
      { trait_type: 'Subcategory',       value: shape.subcategory ?? 'General' },
      { trait_type: 'Rarity',            value: rarity },
      { trait_type: 'Fibonacci Level',   value: shape.fibonacci_level ?? 1,  display_type: 'number' },
      { trait_type: 'String Theory Dim', value: shape.string_theory_dim ?? 0, display_type: 'number' },
      { trait_type: 'Complexity Class',  value: shape.complexity_class ?? 'O(n)' },
      { trait_type: 'Complexity Score',  value: score, display_type: 'number' },
      { trait_type: 'Equation DNA',      value: hasEquation ? 'Verified' : 'Pending' },
      { trait_type: 'Verification',      value: shape.verified ? 'Verified' : 'Unverified' },
    ],
    uuon_provenance: {
      genesis_hash:        GENESIS_HASH,
      merkle_root:         MERKLE_ROOT,
      base_block_anchored: 47403435,
      ipfs_catalog_cid:    IPFS_CATALOG,
      contract_address:    NFT_CONTRACT,
      chain_id:            BASE_CHAIN_ID,
      token_id:            tokenId,
      shape_type:          shape.shape_type,
      equation_verified:   hasEquation,
      created_by:          'Phillip Aguilar Ruiz III — UUON Foundation Inc.',
    },
  };
}

function buildContractMetadata(totalShapes, verifiedCount) {
  return {
    name: 'Dmension Mathematical Universe — Null Set Parametric Manifold',
    description: [
      'The first NFT collection where every token is a unique mathematical object.',
      '',
      `${totalShapes.toLocaleString()} parametric 3D shapes rendered as NeRF volumes,`,
      `organized across 6 Fibonacci levels (1+2+3+5+8+13=32 genesis shapes).`,
      '',
      `${verifiedCount.toLocaleString()} of ${totalShapes.toLocaleString()} shapes carry verified equation DNA.`,
      '',
      'Genesis Hash: ' + GENESIS_HASH,
      'Merkle Root:  ' + MERKLE_ROOT,
      'IPFS Catalog: ipfs://' + IPFS_CATALOG,
      '',
      '© UUON Foundation Inc. — Phillip Aguilar Ruiz III',
    ].join('\n'),
    image:         `ipfs://${IPFS_CATALOG}/collection-banner.png`,
    banner_image:  `ipfs://${IPFS_CATALOG}/collection-banner.png`,
    external_link: 'https://dmension.app',
    seller_fee_basis_points: 250,
    fee_recipient: '0x14a918D01D1a2B31C7c4411df057386A6b44e0b8',
    uuon_provenance: {
      genesis_hash:     GENESIS_HASH,
      merkle_root:      MERKLE_ROOT,
      base_block:       47403435,
      base_tx:          '0xaafd9865cedca7932838d7006a27b14898faca5c908e0fa092615f892aea8d05',
      ipfs_catalog_cid: IPFS_CATALOG,
      contract_address: NFT_CONTRACT,
      chain_id:         BASE_CHAIN_ID,
      total_shapes:     totalShapes,
      verified_shapes:  verifiedCount,
      created_by:       'Phillip Aguilar Ruiz III — UUON Foundation Inc.',
      generated_at:     new Date().toISOString(),
    },
  };
}

async function pinJSON(name, content) {
  if (DRY_RUN) {
    console.log(`  [dry-run] Would pin: ${name}`);
    return `Qm_DRY_RUN_${name.replace(/\W/g, '_')}`;
  }
  if (!PINATA_JWT) {
    console.warn('  ⚠  PINATA_JWT not set — skipping:', name);
    return null;
  }
  const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'pinata_api_key': process.env.PINATA_API_KEY, 'pinata_secret_api_key': process.env.PINATA_API_SECRET },
    body: JSON.stringify({ pinataMetadata: { name }, pinataContent: content }),
  });
  if (!res.ok) throw new Error(`Pinata ${res.status}: ${await res.text()}`);
  return (await res.json()).IpfsHash;
}

async function main() {
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║   UUON Foundation — OpenSea Metadata Generator              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  console.log(`  Mode:       ${DRY_RUN ? '🔍 DRY RUN (no IPFS pins)' : '🚀 LIVE (pinning to IPFS)'}`);
  console.log(`  Contract:   ${NFT_CONTRACT}`);
  console.log(`  Batch size: ${BATCH_SIZE}\n`);

  // Actual column names from formula_implementations
  let shapes;
  if (SINGLE_ID) {
    shapes = await sql`
      SELECT fi.id, fi.shape_type, fi.category, fi.subcategory, fi.display_name,
             fi.complexity_class, fi.verified, fi.fibonacci_level, fi.string_theory_dim,
             fi.equation_x, fi.equation_y, fi.equation_z,
             COALESCE(stl.token_id::text, ${SINGLE_ID}) AS on_chain_id
      FROM formula_implementations fi
      LEFT JOIN shape_token_ledger stl ON stl.shape_type = fi.shape_type
      WHERE fi.id::text = ${SINGLE_ID} OR fi.shape_type = ${SINGLE_ID}
      LIMIT 1
    `;
  } else {
    shapes = await sql`
      SELECT fi.id, fi.shape_type, fi.category, fi.subcategory, fi.display_name,
             fi.complexity_class, fi.verified, fi.fibonacci_level, fi.string_theory_dim,
             fi.equation_x, fi.equation_y, fi.equation_z,
             COALESCE(stl.token_id, fi.id::text) AS on_chain_id
      FROM formula_implementations fi
      LEFT JOIN shape_token_ledger stl ON stl.shape_type = fi.shape_type
      ORDER BY fi.id
    `;
  }

  console.log(`  Loaded ${shapes.length.toLocaleString()} shapes.\n`);

  const verifiedCount = shapes.filter(s =>
    s.equation_x && !['u','v','0','undefined','','MISSING'].includes(s.equation_x)
  ).length;

  // Contract metadata
  console.log('  [1/3] Generating contract.json...');
  const contractMeta = buildContractMetadata(shapes.length, verifiedCount);
  writeFileSync(join(OUT_DIR, 'contract.json'), JSON.stringify(contractMeta, null, 2));
  console.log('        ✅ metadata/contract.json\n');

  // Token metadata
  console.log(`  [2/3] Generating ${shapes.length.toLocaleString()} token files...`);
  const manifest = { generated_at: new Date().toISOString(), tokens: {} };
  let generated = 0;

  for (const shape of shapes) {
    const tokenId = shape.on_chain_id ?? shape.id;
    const metadata = buildTokenMetadata(shape, tokenId);
    writeFileSync(join(OUT_DIR, `${tokenId}.json`), JSON.stringify(metadata, null, 2));
    manifest.tokens[tokenId] = { shape_type: shape.shape_type, file: `${tokenId}.json`, cid: null };
    generated++;
    if (generated % 500 === 0) console.log(`        ${generated.toLocaleString()} / ${shapes.length.toLocaleString()}...`);
  }
  console.log(`        ✅ ${generated.toLocaleString()} files generated\n`);

  // Pin to IPFS
  if (!DRY_RUN && PINATA_JWT) {
    console.log(`  [3/3] Pinning to IPFS (batch ${BATCH_SIZE})...`);
    const contractCID = await pinJSON('UUON-contractURI', contractMeta);
    console.log(`        contractURI CID: ${contractCID}`);
    manifest.contract_cid = contractCID;

    const entries = Object.entries(manifest.tokens);
    let pinned = 0;
    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      await Promise.all(batch.map(async ([tokenId, entry]) => {
        try {
          const content = JSON.parse(readFileSync(join(OUT_DIR, entry.file), 'utf8'));
          manifest.tokens[tokenId].cid = await pinJSON(`UUON-token-${tokenId}`, content);
          pinned++;
        } catch (err) {
          console.error(`        ❌ token ${tokenId}:`, err.message);
        }
      }));
      console.log(`        Pinned ${Math.min(i + BATCH_SIZE, entries.length)} / ${entries.length}...`);
      if (i + BATCH_SIZE < entries.length) await new Promise(r => setTimeout(r, 2000));
    }
    manifest.pinned_count = pinned;
    console.log(`\n        ✅ ${pinned} tokens pinned.\n`);
  } else {
    console.log('  [3/3] Skipping IPFS (dry-run or no PINATA_JWT).\n');
  }

  writeFileSync(join(OUT_DIR, 'MANIFEST.json'), JSON.stringify(manifest, null, 2));
  console.log('  ✅ metadata/MANIFEST.json saved\n');
  console.log(`  Total shapes:   ${generated.toLocaleString()}`);
  console.log(`  Equation DNA:   ${verifiedCount.toLocaleString()} verified`);
  console.log(`  Output:         metadata/\n`);

  if (!DRY_RUN && manifest.contract_cid) {
    console.log('  Next: set contractURI in your ERC-1155 contract:');
    console.log(`  contractURI() → "ipfs://${manifest.contract_cid}"\n`);
  }
}

main().catch(err => { console.error('\nFATAL:', err.message); process.exit(1); });