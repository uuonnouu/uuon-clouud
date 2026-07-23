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

const TREASURY = "0x14a918D01D1a2B31C7c4411df057386A6b44e0b8";

const tx = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: [TREASURY, BigInt(6_000_000 * 10**18)],
});

const result = await sendTransaction({ transaction: tx, account });
console.log("✅ 6,000,000 UUON treasury reserve minted");
console.log("TX:", result.transactionHash);
console.log("Basescan:", `https://basescan.org/tx/${result.transactionHash}`);
console.log("\n🎉 TOTAL SUPPLY COMPLETE: 10,000,000 UUON");
