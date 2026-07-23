import { createThirdwebClient } from "thirdweb";
import { base } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { deployERC20Contract } from "thirdweb/deploys";

const client = createThirdwebClient({
  clientId: process.env.THIRDWEB_CLIENT_ID!,
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
});

const account = privateKeyToAccount({
  client,
  privateKey: process.env.METAMASK_PRIVATE_KEY! as `0x${string}`,
});

async function main() {
  const name = process.env.TOKEN_NAME || "UUON TOKEN";
  const symbol = process.env.TOKEN_SYMBOL || "UUON";

  console.log(`Deploying ${name} (${symbol}) on Base...`);
  console.log(`Wallet: ${account.address}`);

  const address = await deployERC20Contract({
    chain: base,
    client,
    account,
    type: "TokenERC20",
    params: {
      name,
      symbol,
      description: `UUON Foundation — ${name} shape domain token. Genesis: cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04`,
      primary_sale_recipient: account.address,
    },
  });

  console.log(`\n✓ DEPLOYED: ${address}`);
  console.log(`Basescan: https://basescan.org/address/${address}`);
  console.log(`Save as: ${symbol}_CONTRACT=${address}`);
}

main().catch(console.error);
