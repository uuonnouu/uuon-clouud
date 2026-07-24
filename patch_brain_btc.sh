#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# Patch CLOUUDBrain.jsx — Fix BTC price + add ETH
#
# Changes:
#   1. Replace Binance API (CORS-blocked) with CoinGecko (public, CORS-friendly)
#   2. Add ETH price tracking alongside BTC
#   3. Update simulator fallback with realistic starting prices
#   4. Add ETH display to HUD
#   5. Add LIVE/SIM indicator visibility
# ═══════════════════════════════════════════════════════════════
set -e

FILE="client/src/components/CLOUUDBrain.jsx"

if [ ! -f "$FILE" ]; then
  echo "✗ $FILE not found — are you in ~/workspace?"
  exit 1
fi

cp "$FILE" "${FILE}.bak"
echo "✓ Backed up to ${FILE}.bak"

# ── 1. Fix simulator starting prices ──
sed -i 's|let price=67500+Math\.random()\*3000,vol24h=28e9+Math\.random()\*8e9|let price=105000+Math.random()*3000,vol24h=28e9+Math.random()*8e9,ethPrice=3200+Math.random()*200,ethChange=0|' "$FILE"
echo "✓ Updated simulator starting prices (BTC ~105k, ETH ~3.2k)"

# ── 2. Add ETH to simulator tick return ──
sed -i 's|return{price,change24h:momentum\*100,vol24h,tradeSize,tradesPerSec,velocity:momentum,live:false};|ethPrice=ethPrice*(1+momentum*0.0012+(Math.random()-0.5)*0.002);return{price,change24h:momentum*100,vol24h,tradeSize,tradesPerSec,velocity:momentum,live:false,ethPrice,ethChange:momentum*120};|' "$FILE"
echo "✓ Added ETH to simulator tick"

# ── 3. Add ETH to market ref initial state ──
sed -i 's|const market=useRef({price:0,change24h:0,vol24h:0,tradeSize:0,tradesPerSec:0,velocity:0,live:false,history:\[\]});|const market=useRef({price:0,change24h:0,vol24h:0,tradeSize:0,tradesPerSec:0,velocity:0,live:false,history:[],ethPrice:0,ethChange:0});|' "$FILE"
echo "✓ Added ETH to market state"

# ── 4. Replace Binance fetch with CoinGecko ──
# This is the critical fix — Binance blocks CORS, CoinGecko doesn't
sed -i 's|const r=await fetch("https://api\.binance\.com/api/v3/ticker/24hr?symbol=BTCUSDT");|const r=await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum\&vs_currencies=usd\&include_24hr_change=true\&include_24hr_vol=true");|' "$FILE"
echo "✓ Replaced Binance → CoinGecko API"

# ── 5. Replace Binance response parsing with CoinGecko format ──
sed -i 's|const d=await r\.json();.*const price=parseFloat(d\.lastPrice),prev=market\.current\.price||price;|const d=await r.json();const price=d.bitcoin.usd,prev=market.current.price||price;const ethP=d.ethereum.usd,ethC=d.ethereum.usd_24h_change||0;|' "$FILE"

# The above might not match due to multiline. Let me do a more targeted approach.
# Replace the entire try block contents with python for reliability
python3 << 'PYEOF'
import re

with open("client/src/components/CLOUUDBrain.jsx", "r") as f:
    content = f.read()

# Replace the fetch response parsing block
old_parse = '''const d=await r.json();
      const price=parseFloat(d.lastPrice),prev=market.current.price||price;
      market.current={price,change24h:parseFloat(d.priceChangePercent),vol24h:parseFloat(d.quoteVolume),
        tradeSize:parseFloat(d.quoteVolume)/Math.max(1,parseInt(d.count)),
        tradesPerSec:parseInt(d.count)/86400,velocity:(price-prev)/prev,live:true,
        history:[...market.current.history.slice(-89),{price,t:Date.now()}]};'''

new_parse = '''const d=await r.json();
      const price=d.bitcoin.usd,prev=market.current.price||price;
      const ethP=d.ethereum?d.ethereum.usd:0,ethC=d.ethereum?d.ethereum.usd_24h_change||0:0;
      const vol=d.bitcoin.usd_24h_vol||0;
      market.current={price,change24h:d.bitcoin.usd_24h_change||0,vol24h:vol,
        tradeSize:vol/86400,tradesPerSec:vol/(price*86400),velocity:(price-prev)/Math.max(prev,1),live:true,
        history:[...market.current.history.slice(-89),{price,t:Date.now()}],ethPrice:ethP,ethChange:ethC};'''

if old_parse in content:
    content = content.replace(old_parse, new_parse)
    print("✓ Replaced Binance response parser → CoinGecko format")
else:
    # Try single-line match
    old_single = 'const d=await r.json();'
    if 'parseFloat(d.lastPrice)' in content:
        # Manual line-by-line replacement
        lines = content.split('\n')
        new_lines = []
        skip_until_closing = False
        for i, line in enumerate(lines):
            if 'parseFloat(d.lastPrice)' in line:
                # Replace this line and surrounding parse block
                new_lines.append('      const price=d.bitcoin.usd,prev=market.current.price||price;')
                skip_until_closing = True
                continue
            if skip_until_closing and 'history:[...market.current.history' in line:
                new_lines.append('      const ethP=d.ethereum?d.ethereum.usd:0,ethC=d.ethereum?d.ethereum.usd_24h_change||0:0;')
                new_lines.append('      const vol=d.bitcoin.usd_24h_vol||0;')
                new_lines.append('      market.current={price,change24h:d.bitcoin.usd_24h_change||0,vol24h:vol,')
                new_lines.append('        tradeSize:vol/86400,tradesPerSec:vol/(price*86400),velocity:(price-prev)/Math.max(prev,1),live:true,')
                new_lines.append('        history:[...market.current.history.slice(-89),{price,t:Date.now()}],ethPrice:ethP,ethChange:ethC};')
                skip_until_closing = False
                continue
            if skip_until_closing:
                continue
            new_lines.append(line)
        content = '\n'.join(new_lines)
        print("✓ Replaced response parser (line-by-line mode)")
    else:
        print("⚠ Could not find Binance parser — may need manual edit")

# Update sim fallback to include ETH fields
old_sim_fallback = 'const d=simRef.current.tick();market.current={...d,history:[...market.current.history.slice(-89),{price:d.price,t:Date.now()}]};'
new_sim_fallback = 'const d=simRef.current.tick();market.current={...d,history:[...market.current.history.slice(-89),{price:d.price,t:Date.now()}],ethPrice:d.ethPrice||0,ethChange:d.ethChange||0};'
# This appears twice (catch block line 102 and interval line 110)
content = content.replace(old_sim_fallback, new_sim_fallback)
print("✓ Updated sim fallback with ETH fields")

# Add ETH display to HUD — insert after the BTC display block
old_hud = '''    ctx.fillStyle="#555";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText(`${liveTag}  BTC/USDT  24h`,90,H-64);'''

new_hud = '''    ctx.fillStyle="#555";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText(`${liveTag}  BTC/USD  24h`,90,H-64);

    // ETH price
    if(m.ethPrice>0){
      const ethStr=`$${m.ethPrice.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;
      const ethChg=`${m.ethChange>=0?"+":""}${m.ethChange.toFixed(2)}%`;
      ctx.fillStyle="#888";ctx.font="600 16px 'Rajdhani','Share Tech Mono',monospace";
      ctx.fillText(ethStr,16,H-44);
      ctx.fillStyle=m.ethChange>=0?TEAL:VIOLET;ctx.font="11px 'Share Tech Mono',monospace";
      ctx.fillText(ethChg,16,H-28);
      ctx.fillStyle="#444";ctx.font="10px 'Share Tech Mono',monospace";
      ctx.fillText("ETH/USD",80,H-28);
    }'''

if old_hud in content:
    content = content.replace(old_hud, new_hud)
    print("✓ Added ETH price display to HUD")
else:
    print("⚠ Could not find HUD insertion point for ETH — may need manual edit")

# Also update the LIVE tag to be more visible with color
old_live_tag = "ctx.fillText(`${liveTag}  BTC/USD  24h`,90,H-64);"
new_live_tag = '''ctx.fillStyle=m.live?"#0a5":VIOLET;ctx.font="bold 11px 'Share Tech Mono',monospace";
    ctx.fillText(liveTag,90,H-64);
    ctx.fillStyle="#555";ctx.font="11px 'Share Tech Mono',monospace";
    ctx.fillText("BTC/USD  24h",120,H-64);'''

if old_live_tag in content:
    content = content.replace(old_live_tag, new_live_tag)
    print("✓ Added color-coded LIVE/SIM indicator")
else:
    print("⚠ LIVE tag color update skipped")

with open("client/src/components/CLOUUDBrain.jsx", "w") as f:
    f.write(content)

print("✓ File written")
PYEOF

echo ""
echo "── Verify changes ──"
echo "=== API endpoint ==="
grep "coingecko\|binance" "$FILE"
echo "=== ETH in state ==="
grep "ethPrice\|ethChange" "$FILE" | head -8
echo "=== Starting price ==="
grep "105000\|67500" "$FILE"

echo ""
echo "═══════════════════════════════════════════════"
echo "  Patch complete. Review above, then:"
echo "    git add $FILE"
echo "    git commit -m 'Fix Brain: live BTC+ETH via CoinGecko, kill fake simulator prices'"
echo "    git push private-origin main"
echo "═══════════════════════════════════════════════"
