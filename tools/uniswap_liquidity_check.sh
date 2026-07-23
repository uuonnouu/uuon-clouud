#!/bin/bash
# Read-only liquidity/quote check. Does NOT execute any swap, does NOT spend funds.
# Per the swap-integration skill's own safety rule, no transaction is signed or sent here.

API="https://trade-api.gateway.uniswap.org/v1"
ETH="0x0000000000000000000000000000000000000000"
PIEZ="0xfb9c83432331EAf6f4a9D9488828823587d6f3da"
PSENT="0x985A1ebac4388DFb6EB4FE1171dCa9c6a5DB9cE7"
WALLET="0x425734a7fd13E9994b66a7909206007A1EF7030B"

get_quote() {
  local label="$1"
  local tokenIn="$2"
  local tokenOut="$3"
  local amount="$4"

  echo ""
  echo "=== $label ==="
  curl -s -X POST "$API/quote" \
    -H "Content-Type: application/json" \
    -H "x-api-key: ${UNISWAP_API_KEY}" \
    -H "x-universal-router-version: 2.0" \
    -d "{
      \"tokenInChainId\": 8453,
      \"tokenOutChainId\": 8453,
      \"tokenIn\": \"${tokenIn}\",
      \"tokenOut\": \"${tokenOut}\",
      \"amount\": \"${amount}\",
      \"type\": \"EXACT_INPUT\",
      \"swapper\": \"${WALLET}\"
    }"
  echo ""
}

echo "############################################"
echo "PIEZ / PSENT LIQUIDITY REALITY CHECK"
echo "No funds will move. Read-only quote requests only."
echo "############################################"

get_quote "0.01 ETH -> PIEZ" "$ETH" "$PIEZ" "10000000000000000"
get_quote "0.01 ETH -> PSENT" "$ETH" "$PSENT" "10000000000000000"
get_quote "1000 PIEZ -> ETH" "$PIEZ" "$ETH" "1000000000000000000000"
get_quote "1000 PSENT -> ETH" "$PSENT" "$ETH" "1000000000000000000000"

echo ""
echo "############################################"
echo "HOW TO READ THIS:"
echo " - A JSON quote with 'output.amount' or routing info = real liquidity exists."
echo " - An error like 'insufficient liquidity' or 'no route found' = pool is empty/nonexistent."
echo " - A 401/403 = API key issue, unrelated to liquidity."
echo "############################################"