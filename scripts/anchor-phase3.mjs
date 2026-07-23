import { readFileSync } from 'fs';
const root = JSON.parse(readFileSync('./MERKLE_STATE_ROOT.json', 'utf8'));
const payload = {
  merkle_root: root.merkle_root,
  ipfs_cid: root.ipfs_cid,
  shapes: root.shapes_committed,
  phase: 3,
  genesis: "cf114022b5e4e1d6fdeb36890f35f605857cf2de93b53ebcb9c8e5652413ca04"
};
const data = '0x' + Buffer.from(JSON.stringify(payload)).toString('hex');
const { createThirdwebClient } = await import('thirdweb');
const { privateKeyToAccount } = await import('thirdweb/wallets');
const { sendTransaction, prepareTransaction } = await import('thirdweb');
const { base } = await import('thirdweb/chains');
const client = createThirdwebClient({ secretKey: process.env.THIRDWEB_SECRET_KEY });
const account = privateKeyToAccount({ client, privateKey: process.env.METAMASK_PRIVATE_KEY });
const tx = prepareTransaction({ client, chain: base, to: account.address, value: 0n, data });
const receipt = await sendTransaction({ transaction: tx, account });
console.log('✓ TX:', receipt.transactionHash);
console.log('  https://basescan.org/tx/' + receipt.transactionHash);
console.log('  Merkle root:', root.merkle_root);
console.log('  IPFS:', root.ipfs_cid);
