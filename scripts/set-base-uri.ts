import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { prepareContractCall } from "thirdweb";

const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.METAMASK_PRIVATE_KEY! as `0x${string}`,
});

async function main() {
  const contract = getContract({
    client,
    chain: base,
    address: "0xa14c3015E6b9Ad30337bD72c94Dc236835f61165",
  });

  console.log("Setting base URI on NFT contract...");

  const tx = prepareContractCall({
    contract,
    method: "function setBaseURI(string _baseURI)",
    params: ["https://raw.githubusercontent.com/uuonnouu/UUON-Token-Metadata/main/"],
  });

  const receipt = await sendTransaction({ transaction: tx, account });
  console.log("✓ Base URI set");
  console.log("Tx:", receipt.transactionHash);
  console.log("OpenSea:", "https://opensea.io/assets/base/0xa14c3015E6b9Ad30337bD72c94Dc236835f61165");
}

main().catch(console.error);
