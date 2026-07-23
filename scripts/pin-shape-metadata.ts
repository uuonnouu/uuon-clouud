import * as fs from "fs";

const PINATA_JWT = process.env.PINATA_JWT!;
const SHAPE_ID = process.env.SHAPE_ID!;
const SHAPE_NAME = process.env.SHAPE_NAME!;
const CONTRACT = process.env.TOKEN_CONTRACT!;

async function pinFile(content: object, name: string): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: content,
      pinataMetadata: { name },
    }),
  });
  const data = await res.json() as any;
  return data.IpfsHash;
}

async function main() {
  console.log(`Pinning ${SHAPE_NAME} metadata to IPFS...`);

  const metadata = JSON.parse(
    fs.readFileSync(`/mnt/user-data/uploads/${SHAPE_ID}_metadata_*.json`, "utf8")
  );
  const formulas = JSON.parse(
    fs.readFileSync(`/mnt/user-data/uploads/${SHAPE_ID}_formulas_*.json`, "utf8")
  );
  const ngpConfig = JSON.parse(
    fs.readFileSync(`/mnt/user-data/uploads/${SHAPE_ID}_instant_ngp_config_*.json`, "utf8")
  );

  // Build full token metadata
  const tokenMetadata = {
    name: SHAPE_NAME,
    description: `UUON Foundation — ${SHAPE_NAME}. An Epic-tier shape domain token from the Dmension Mathematical Universe. Holding this token grants API access to the ${SHAPE_ID} rendering engine.`,
    image: `https://ipfs.io/ipfs/bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy`,
    external_url: `https://dmension.io/shapes/${SHAPE_ID}`,
    attributes: [
      { trait_type: "Shape ID", value: SHAPE_ID },
      { trait_type: "Tier", value: "Epic" },
      { trait_type: "Contract", value: CONTRACT },
      { trait_type: "Genesis", value: "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04" },
      { trait_type: "Cryptographic Hash", value: metadata.security?.cryptographicHash },
      { trait_type: "Parameters", value: JSON.stringify(metadata.parameters) },
      { trait_type: "NeRF Config", value: "Instant-NGP HashGrid 16 levels" },
      { trait_type: "License", value: "CC BY-NC 4.0" },
    ],
    nerf_config: ngpConfig,
    formulas: formulas,
    shape_metadata: metadata,
  };

  const cid = await pinFile(tokenMetadata, `${SHAPE_ID}_token_metadata`);
  console.log(`\n✓ Pinned to IPFS: ${cid}`);
  console.log(`  URL: https://ipfs.io/ipfs/${cid}`);
  console.log(`  Set this as token URI for ${CONTRACT}`);
}

main().catch(console.error);
