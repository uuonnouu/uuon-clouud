#!/bin/bash
set -e

echo "Backing up current versions first..."
cp README.md README.md.bak.$(date +%s)
cp uuon-public/README.md uuon-public/README.md.bak.$(date +%s)
cp public-release/README.md public-release/README.md.bak.$(date +%s)

echo ""
echo "--- Updating README.md: adding Basescan + Uniswap links ---"
python3 - "README.md" << 'PYEOF'
import sys
path = sys.argv[1]
with open(path) as f:
    content = f.read()

old_table = """## Tokens (Base Mainnet — verified on Basescan 2026-06-29)
| Token | Address | Note |
|---|---|---|
| PIEZ | `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` | compute access token |
| PSENT | `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` | signal access token |
| UUON | `0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE` | 10M hard cap, 4M circulating |"""

new_table = """## Tokens (Base Mainnet — verified on Basescan 2026-06-29)
| Token | Address | Contract | Note |
|---|---|---|---|
| PIEZ | `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` | [View on Basescan](https://basescan.org/address/0xfb9c83432331EAf6f4a9D9488828823587d6f3da) | compute access token |
| PSENT | `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` | [View on Basescan](https://basescan.org/address/0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7) | signal access token |
| UUON | `0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE` | [View on Basescan](https://basescan.org/address/0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE) | 10M hard cap, 4M circulating |

## Trade / liquidity (Uniswap v4, Base Mainnet)
| Pair | Link |
|---|---|
| ETH / PIEZ | [Trade on Uniswap](https://app.uniswap.org/swap?chain=base&outputCurrency=0xfb9c83432331EAf6f4a9D9488828823587d6f3da) |
| ETH / PSENT | [Trade on Uniswap](https://app.uniswap.org/swap?chain=base&outputCurrency=0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7) |

Note: Uniswap v4 pools are managed through a shared PoolManager contract and
identified by pool ID rather than a standalone address — the links above are
the correct way to inspect or trade each pool directly, rather than a
Basescan contract page."""

if old_table not in content:
    print("WARNING: exact match not found, no changes made to README.md. Check manually.")
else:
    content = content.replace(old_table, new_table)
    with open(path, "w") as f:
        f.write(content)
    print("[updated] README.md")
PYEOF

echo ""
echo "--- Updating public-release/README.md: adding Basescan links ---"
python3 - "public-release/README.md" << 'PYEOF'
import sys
path = sys.argv[1]
with open(path) as f:
    content = f.read()

old_table = """## Contracts (Base Mainnet — verified on Basescan)
| Token | Address |
|---|---|
| UUON ERC-20 | `0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE` |
| PIEZ ERC-20 | `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` |
| PSENT ERC-20 | `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` |
| NFT ERC-1155 | `0xa14c3015E6b9Ad30337bD72c94Dc236835f61165` |"""

new_table = """## Contracts (Base Mainnet — verified on Basescan)
| Token | Address | Link |
|---|---|---|
| UUON ERC-20 | `0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE` | [Basescan](https://basescan.org/address/0x1981B92B97Ba024BC5663Ce36809Da15B80B22dE) |
| PIEZ ERC-20 | `0xfb9c83432331EAf6f4a9D9488828823587d6f3da` | [Basescan](https://basescan.org/address/0xfb9c83432331EAf6f4a9D9488828823587d6f3da) |
| PSENT ERC-20 | `0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7` | [Basescan](https://basescan.org/address/0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7) |
| NFT ERC-1155 | `0xa14c3015E6b9Ad30337bD72c94Dc236835f61165` | [Basescan](https://basescan.org/address/0xa14c3015E6b9Ad30337bD72c94Dc236835f61165) |

## Trade (Uniswap v4, Base Mainnet)
- ETH / PIEZ: https://app.uniswap.org/swap?chain=base&outputCurrency=0xfb9c83432331EAf6f4a9D9488828823587d6f3da
- ETH / PSENT: https://app.uniswap.org/swap?chain=base&outputCurrency=0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7"""

if old_table not in content:
    print("WARNING: exact match not found, no changes made to public-release/README.md. Check manually.")
else:
    content = content.replace(old_table, new_table)
    with open(path, "w") as f:
        f.write(content)
    print("[updated] public-release/README.md")
PYEOF

echo ""
echo "Done. Review with: git diff README.md public-release/README.md"
echo "Then: git add -- README.md public-release/README.md && git commit -m 'Add Basescan and Uniswap links to token tables' && git push origin main"