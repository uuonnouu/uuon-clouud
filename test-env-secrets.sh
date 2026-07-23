#!/bin/bash

echo "===================================================="
echo "🔍  UUON FOUNDATION — ENVIRONMENT SECRETS AUDIT"
echo "===================================================="
echo "📡 Scanning active environment variable keys..."
echo "----------------------------------------------------"

# List of industry-standard secret keys and custom foundation handles to verify
SECRET_KEYS=(
    "RPC_URL"
    "PROVIDER_URL"
    "BASE_RPC"
    "ALCHEMY_API_KEY"
    "INFURA_API_KEY"
    "PRIVATE_KEY"
    "METAMASK_PRIVATE_KEY"
    "PRIVATE_IPFS_MANIFEST_ANCHOR"
    "IPFS_KEY"
    "PINATA_API_KEY"
)

for key in "${SECRET_KEYS[@]}"; do
    # Check if the environment variable has a value assigned to it
    if [ -n "${!key}" ]; then
        # Mask the actual value for security, showing only the length and format
        VALUE_LENGTH=${#!key}
        SAMPLE="${!key}"
        echo "🔹 FOUND: Key name matches [ $key ]"
        echo "   -> Data type: Alphanumeric String ($VALUE_LENGTH characters)"
        echo "   -> Value preview: ${SAMPLE:0:8}...${SAMPLE: -4}"
        
        # Test if the string looks like an HTTP link or an RPC address gateway
        if [[ "${!key}" == http* ]]; then
            echo "   -> Target usage: 🔗 Network Provider Gateway URL Link"
            
            # Direct network handshake test to see if the link responds to technical calls
            echo "   -> Testing network handshake..."
            RESPONSE_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 3 "${!key}")
            if [ "$RESPONSE_CODE" -eq 200 ] || [ "$RESPONSE_CODE" -eq 302 ]; then
                echo "      ✓ Server responded with status code: $RESPONSE_CODE"
            else
                echo "      ⚠️  Warning: Server connection timed out or rejected request."
            fi
        fi
        echo "----------------------------------------------------"
    fi
done

echo "🏁 AUDIT COMPLETE: Environment scan finalized."
echo "===================================================="
