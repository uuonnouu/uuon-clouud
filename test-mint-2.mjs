import { createThirdwebClient, getContract, prepareContractCall, sendTransaction } from "thirdweb";
import { privateKeyToAccount } from "thirdweb/wallets";
import { base } from "thirdweb/chains";

const client = createThirdwebClient({ secretKey: process.env.THIRDWEB_SECRET_KEY });
const account = privateKeyToAccount({ client, privateKey: process.env.PRIVATE_KEY });

const contract = getContract({
  client,
  chain: base,
  address: process.env.UUON_CONTRACT_ADDRESS,
});

// Mint 100 UUON to treasury wallet
const TREASURY = "0x14a918D01D1a2B31C7c4411df057386A6b44e0b8";

const tx = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: [TREASURY, BigInt(100 * 10**18)],
});

const result = await sendTransaction({ transaction: tx, account });
console.log("✅ TEST 2 PASSED — 100 UUON minted to treasury");
console.log("TX:", result.transactionHash);
console.log("Basescan:", `https://basescan.org/tx/${result.transactionHash}`);
