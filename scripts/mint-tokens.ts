import { createThirdwebClient, getContract, sendTransaction } from "thirdweb";
import { base } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { mintTo } from "thirdweb/extensions/erc20";

const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.METAMASK_PRIVATE_KEY! as `0x${string}`,
});

async function main() {
  const contractAddress = process.env.TOKEN_CONTRACT!;
  const amount = process.env.TOKEN_AMOUNT || "10000000";
  const symbol = process.env.TOKEN_SYMBOL || "TOKEN";

  console.log(`Minting ${amount} ${symbol} to ${account.address}...`);

  const contract = getContract({
    client,
    chain: base,
    address: contractAddress as `0x${string}`,
  });

  const tx = mintTo({
    contract,
    to: account.address,
    amount: amount,
  });

  const receipt = await sendTransaction({ transaction: tx, account });
  console.log(`✓ Minted ${amount} ${symbol}`);
  console.log(`  Tx: https://basescan.org/tx/${receipt.transactionHash}`);
}

main().catch(console.error);
