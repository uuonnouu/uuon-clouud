import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { deployERC20Contract } from "thirdweb/deploys";

const client = createThirdwebClient({ 
  secretKey: process.env.THIRDWEB_SECRET_KEY 
});

const account = privateKeyToAccount({ 
  client, 
  privateKey: process.env.PRIVATE_KEY
});

console.log("Deployer:", account.address);
console.log("Deploying UUON ERC-20 to Base mainnet...");

const contractAddress = await deployERC20Contract({
  client,
  chain: base,
  account,
  type: "TokenERC20",
  params: {
    name: "UUON",
    symbol: "UUON",
    description: "UUON Mathematical Universe Token — Dmension Foundation",
    primary_sale_recipient: account.address,
    initial_supply: "10000000",
  },
});

console.log("✅ CONTRACT DEPLOYED:", contractAddress);
console.log("Basescan:", `https://basescan.org/address/${contractAddress}`);
