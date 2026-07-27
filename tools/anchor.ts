import { ethers } from "ethers";

const HASH = "0x48939153655e5195d9b287254dd7bb16262e556edbd794cd8f4d35126879c67c";
const RPC  = "https://mainnet.base.org";

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC);
  const wallet   = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Wallet  :", wallet.address);

  const tx = await wallet.sendTransaction({
    to:       "0x000000000000000000000000000000000000dEaD",
    value:    0n,
    data:     HASH,
    gasLimit: 50000n,
  });

  console.log("Tx hash :", tx.hash);
  console.log("Waiting...");
  const receipt = await tx.wait(1);
  console.log("Confirmed in block:", receipt?.blockNumber);
  console.log("Basescan: https://basescan.org/tx/" + tx.hash);
}

main().catch(err => { console.error(err); process.exit(1); });
