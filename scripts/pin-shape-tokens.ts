import * as fs from "fs";

const PINATA_JWT = process.env.PINATA_JWT!;

async function pinJSON(content: object, name: string): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: content,
      pinataMetadata: { name },
      pinataOptions: { cidVersion: 1 }
    }),
  });
  const data = await res.json() as any;
  if (!data.IpfsHash) throw new Error(`Pin failed: ${JSON.stringify(data)}`);
  return data.IpfsHash;
}

async function main() {
  console.log("Pinning PSENT & PIEZ to IPFS via Pinata...\n");

  const psent = JSON.parse(fs.readFileSync("/home/runner/workspace/psent_metadata.json", "utf8"));
  const piez = JSON.parse(fs.readFileSync("/home/runner/workspace/piez_metadata.json", "utf8"));

  console.log("► Pinning PSENT...");
  const psent_cid = await pinJSON(psent, "UUON_PSENT_euler_product_formula");
  console.log(`  ✓ ${psent_cid}`);

  console.log("► Pinning PIEZ...");
  const piez_cid = await pinJSON(piez, "UUON_PIEZ_policy_impact_visualization");
  console.log(`  ✓ ${piez_cid}`);

  console.log("\n  PSENT_METADATA_CID=" + psent_cid);
  console.log("  PIEZ_METADATA_CID=" + piez_cid);
}

main().catch(console.error);
