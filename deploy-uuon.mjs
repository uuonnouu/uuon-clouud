cat > ~/workspace/project/deploy-uuon.mjs << 'DEPLOYEOF'
import { createThirdwebClient } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { base } from "thirdweb/chains";
import { deployERC20Contract } from "thirdweb/deploys";

const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const DEPLOYER_PRIVATE_KEY = process.env.METAMASK_WALLET;
const TREASURY_WALLET = "0x14a918D01D1a2B31C7c4411df057386A6b44e0b8";

if (!THIRDWEB_SECRET_KEY) { console.error("Missing THIRDWEB_SECRET_KEY"); process.exit(1); }
if (!DEPLOYER_PRIVATE_KEY) { console.error("Missing METAMASK_WALLET"); process.exit(1); }

const client = createThirdwebClient({ secretKey: THIRDWEB_SECRET_KEY });
const account = privateKeyToAccount({ client, privateKey: DEPLOYER_PRIVATE_KEY });

console.log("Deploying UUON to Base mainnet...");
console.log("Deployer:", account.address);

const contractAddress = await deployERC20Contract({
  client, chain: base, account,
  type: "TokenERC20",
  params: {
    name: "UUON",
    symbol: "UUON",
    description: "UUON Mathematical Universe Token",
    primary_sale_recipient: TREASURY_WALLET,
  },
});

console.log("CONTRACT DEPLOYED:", contractAddress);
console.log("Basescan:", `https://basescan.org/address/${contractAddress}`);
console.log("SAVE THIS ADDRESS as UUON_CONTRACT_ADDRESS in Replit Secrets");
DEPLOYEOF