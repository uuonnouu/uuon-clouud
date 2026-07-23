import { ethers } from "ethers";

const COMPREHENSIVE_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function uri(uint256 id) view returns (string)"
];

async function executeMetadataAudit() {
    console.log("====================================================");
    console.log("🛰️  UUON MATRIX — TARGET INFRASTRUCTURE CHECK");
    console.log("====================================================");

    const CONTRACT_ADDRESS = "0xa14c3015E6b9Ad30337bD72c94Dc236835f61165";
    
    // Utilizing an un-throttled, specialized direct public node array
    const RPC_ENDPOINT = "https://meowrpc.com";

    try {
        console.log("📡 Connecting directly to Data Node Rail...");
        const provider = new ethers.JsonRpcProvider(RPC_ENDPOINT);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, COMPREHENSIVE_ABI, provider);

        console.log("🔍 Extracting fallback master token URI template...");
        const rawTemplateUri = await contract.uri(0).catch(() => "FAILED_TO_FETCH_GLOBAL_URI");
        const name = await contract.name().catch(() => "UUON Mathematical Universe");
        const symbol = await contract.symbol().catch(() => "UUON");

        console.log("\n📊 --- TRUE BLOCKCHAIN LEDGER BLUEPRINT ---");
        console.log(`🔹 Contract Name:   ${name}`);
        console.log(`🔹 Token Symbol:   ${symbol}`);
        console.log(`🔹 Raw On-Chain URI Template: ${rawTemplateUri}`);
        console.log("-------------------------------------------\n");

    } catch (error: any) {
        console.error(`\n❌ HANDSHAKE FAULT: ${error.message}`);
    }
}

executeMetadataAudit();
