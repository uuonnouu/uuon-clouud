import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { deployERC1155Contract } from "thirdweb/deploys";

const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.METAMASK_PRIVATE_KEY! as `0x${string}`,
});

async function main() {
  console.log("Deploying ERC1155 to Base mainnet...");
  console.log("Wallet:", account.address);

  const contractAddress = await deployERC1155Contract({
    chain: base,
    client,
    account,
    type: "TokenERC1155",
    params: {
      name: "UUON Mathematical Universe",
      symbol: "UUON",
      description: "Dmension Mathematical Universe - 2154 parametric shapes. Genesis: cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04",
      image: "https://ipfs.io/ipfs/bafkreifk5rgcjbtke4etapbf4vpfajaieybeywdcvy4hthui62b6plwrqy",
      primary_sale_recipient: account.address,
      fee_recipient: account.address,
      seller_fee_basis_points: 500,
    },
  });

  console.log("\n✓ CONTRACT DEPLOYED SUCCESSFULLY");
  console.log("  Address:", contractAddress);
  console.log("  Basescan: https://basescan.org/address/" + contractAddress);
  console.log("\n  UPDATE Replit secret UUON_MATHEMATICAL_UNIVERS_WALLET =", contractAddress);
}

main().catch(console.error);