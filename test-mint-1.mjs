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

const tx = prepareContractCall({
  contract,
  method: "function mintTo(address to, uint256 amount)",
  params: [account.address, BigInt(10 * 10**18)],
});

const result = await sendTransaction({ transaction: tx, account });
console.log("✅ TEST 1 PASSED — 10 UUON minted");
console.log("TX:", result.transactionHash);
console.log("Basescan:", `https://basescan.org/tx/${result.transactionHash}`);
