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

// Mint 4,000,000 to deployer (circulating supply)
const tx1 = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: [account.address, BigInt(4_000_000 * 10**18)],
});

const r1 = await sendTransaction({ transaction: tx1, account });
console.log("✅ 4,000,000 UUON circulating supply minted");
console.log("TX:", r1.transactionHash);

// Mint 6,000,000 to treasury (reserve)
const TREASURY = "0x14a918D01D1a2B31C7c4411df057386A6b44e0b8";
const tx2 = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: [TREASURY, BigInt(6_000_000 * 10**18)],
});

const r2 = await sendTransaction({ transaction: tx2, account });
console.log("✅ 6,000,000 UUON treasury reserve minted");
console.log("TX:", r2.transactionHash);

console.log("\n🎉 TOTAL SUPPLY: 10,000,000 UUON");
console.log("Basescan:", `https://basescan.org/address/${process.env.UUON_CONTRACT_ADDRESS}`);
