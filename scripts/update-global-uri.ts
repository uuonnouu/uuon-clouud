import { ethers } from "ethers";

const THIRDWEB_UPDATE_ABI = [
    "function setURI(string _uri)",
    "function owner() view returns (address)"
];

async function broadcastGlobalUriUpdate() {
    console.log("====================================================");
    console.log("⚡ UUON FOUNDATION — ORIGINAL WALLET STATE ROUTER");
    console.log("====================================================");

    const CONTRACT_ADDRESS = "0xa14c3015E6b9Ad30337bD72c94Dc236835f61165";
    const RPC_ENDPOINT = "https://ankr.com";
    
    // Explicit target wallet verification address parameters
    const EXPECTED_WALLET = "0x14a918D01D1a2B31C7c4411df057386A6b44e0b8";
    const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;

    if (!PRIVATE_KEY) {
        console.error("❌ CRITICAL FAULT: METAMASK_PRIVATE_KEY environment secret is empty.");
        return;
    }

    const TARGET_GLOBAL_URI = "ipfs://QmTbaSgW1f8bA3Uo6XmY9vNqD5k4bXmE5aY2zW4xV3uN9o/{id}.json";

    try {
        console.log(`📡 Handshaking with Base Network Data Rail via Ankr...`);
        const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        
        console.log(`👛 Detected Wallet Address: ${wallet.address}`);
        
        if (wallet.address.toLowerCase() !== EXPECTED_WALLET.toLowerCase()) {
            console.log("⚠️  SECURITY ALERT: Your stored private key belongs to a different wallet signature!");
            console.log(`👉 Expected: ${EXPECTED_WALLET}`);
            console.log("💡 Fix: Update your METAMASK_PRIVATE_KEY secret to match the original wallet.");
        }

        console.log(`🎯 Targeting Verified Contract Proxy: ${CONTRACT_ADDRESS}`);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, THIRDWEB_UPDATE_ABI, wallet);

        console.log("🔍 Checking on-chain administrative access rights...");
        const currentOwner = await contract.owner().catch(() => "FAILED_TO_READ_OWNER");
        console.log(`👑 Current Deployed Contract Owner: ${currentOwner}`);

        console.log(`🚀 Attempting 'setURI' parameter update loop...`);
        const tx = await contract.setURI(TARGET_GLOBAL_URI);
        console.log(`⏳ Broadcasted! Transaction Hash: ${tx.hash}`);
        
        const receipt = await tx.wait();
        console.log(`\n🏁 SUCCESS: State update finalized in block ${receipt.blockNumber}`);

    } catch (error: any) {
        console.error("\n❌ TRANSACTION REVERTED: State update rejected.");
        console.error(`Reason: ${error.message}`);
        console.log("\n💡 ANALYSIS: If the error mentions 'caller is not the owner', you must switch your key back to wallet 0x4257... to finalize the metadata change.");
    }
    console.log("====================================================");
}

broadcastGlobalUriUpdate();
