#!/bin/bash

echo "===================================================="
echo "🔍  UUON FOUNDATION — VARIABLE IDENTITY CHECK"
echo "===================================================="
echo "📡 Checking active environment variables one-by-one..."
echo "----------------------------------------------------"

check_secret() {
    local key_name="$1"
    # Safely evaluate if the variable string exists in your active shell environment
    local val=$(eval echo \$$key_name)
    
    if [ -n "$val" ]; then
        echo "🔹 STATUS: [ $key_name ] is actively initialized! ✓"
        
        # Safely determine the usage by reading the text contents without throwing errors
        if [[ "$val" == http* ]]; then
            echo "   -> Content Type: 🔗 Network Provider Gateway URL Link"
            echo "   -> Target String: $val"
        else
            echo "   -> Content Type: 🔑 Cryptographic Alphanumeric String"
        fi
        echo "----------------------------------------------------"
    else
        echo "❌ STATUS: [ $key_name ] is completely empty or unassigned."
        echo "----------------------------------------------------"
    fi
}

# Run explicit checks on your custom infrastructure variable handles
check_secret "RPC_URL"
check_secret "PROVIDER_URL"
check_secret "BASE_RPC"
check_secret "ALCHEMY_API_KEY"
check_secret "INFURA_API_KEY"
check_secret "PRIVATE_KEY"
check_secret "METAMASK_PRIVATE_KEY"
check_secret "PRIVATE_IPFS_MANIFEST_ANCHOR"
check_secret "IPFS_KEY"
check_secret "PINATA_API_KEY"

echo "🏁 SCANS FINALIZED."
echo "===================================================="
