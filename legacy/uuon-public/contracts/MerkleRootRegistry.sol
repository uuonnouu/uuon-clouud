// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title MerkleRootRegistry
 * @notice Δmension UUON token ledger — on-chain Merkle root registry.
 *         Every week the server pushes one 32-byte hash that commits to the
 *         complete state of all 14,990+ tokens.  Anyone can verify any token
 *         without trusting Δmension at all: re-derive the leaf from the DB
 *         export, run the proof, check it matches the on-chain root.
 *
 * Deployed on Polygon Mainnet (chainId 137) — gas cost ~$2–5 one-time deploy,
 * ~$0.01 per weekly root update.
 *
 * Verification flow (off-chain):
 *   leaf  = keccak256(abi.encodePacked(token_id, param_hash, energy_hash))
 *   proof = merkle_proof column in shape_token_state_roots table
 *   valid = verifyTokenInclusion(leaf, proof)
 */
contract MerkleRootRegistry {

    // ─── State ────────────────────────────────────────────────────────────────

    address public owner;
    uint256 public publishCount;

    struct Publication {
        bytes32 merkleRoot;     // Root of the full token Merkle tree
        uint256 tokenCount;     // Total tokens committed
        uint256 energyTotal;    // Total accumulated energy (scaled ×1e0)
        uint256 weekNumber;     // block.timestamp / 1 weeks
        uint256 blockTimestamp; // Exact block time of publication
        string  reportUri;      // URI to the full signed weekly report JSON
    }

    Publication[] public publications;

    // ─── Events ───────────────────────────────────────────────────────────────

    event MerkleRootPublished(
        bytes32 indexed merkleRoot,
        uint256 tokenCount,
        uint256 energyTotal,
        uint256 weekNumber,
        uint256 indexed publishIndex,
        string  reportUri
    );

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    // ─── Constructor ──────────────────────────────────────────────────────────

    constructor() {
        owner = msg.sender;
    }

    // ─── Modifiers ────────────────────────────────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "MerkleRootRegistry: not owner");
        _;
    }

    // ─── Write ────────────────────────────────────────────────────────────────

    /**
     * @notice Publish the weekly Merkle root.  Called automatically every
     *         Monday at 09:00 UTC by the Δmension server scheduler.
     * @param merkleRoot  SHA-256 root of all token state leaf hashes.
     * @param tokenCount  Total tokens in the ledger at time of publication.
     * @param energyTotal Cumulative Floor-2 energy across all shapes.
     * @param reportUri   HTTPS URL to the full signed weekly report JSON.
     * @return index      Index in the publications array.
     */
    function publishWeeklyRoot(
        bytes32 merkleRoot,
        uint256 tokenCount,
        uint256 energyTotal,
        string calldata reportUri
    ) external onlyOwner returns (uint256 index) {
        uint256 weekNumber = block.timestamp / 1 weeks;
        Publication memory pub = Publication({
            merkleRoot:     merkleRoot,
            tokenCount:     tokenCount,
            energyTotal:    energyTotal,
            weekNumber:     weekNumber,
            blockTimestamp: block.timestamp,
            reportUri:      reportUri
        });
        publications.push(pub);
        publishCount = publications.length;
        index = publications.length - 1;
        emit MerkleRootPublished(
            merkleRoot, tokenCount, energyTotal,
            weekNumber, index, reportUri
        );
    }

    // ─── Read ─────────────────────────────────────────────────────────────────

    function getLatestPublication() external view returns (
        bytes32 merkleRoot,
        uint256 tokenCount,
        uint256 energyTotal,
        uint256 weekNumber,
        uint256 blockTimestamp,
        string memory reportUri
    ) {
        require(publications.length > 0, "No publications yet");
        Publication memory pub = publications[publications.length - 1];
        return (pub.merkleRoot, pub.tokenCount, pub.energyTotal,
                pub.weekNumber, pub.blockTimestamp, pub.reportUri);
    }

    function getPublication(uint256 index) external view returns (
        bytes32 merkleRoot,
        uint256 tokenCount,
        uint256 energyTotal,
        uint256 weekNumber,
        uint256 blockTimestamp,
        string memory reportUri
    ) {
        require(index < publications.length, "Index out of bounds");
        Publication memory pub = publications[index];
        return (pub.merkleRoot, pub.tokenCount, pub.energyTotal,
                pub.weekNumber, pub.blockTimestamp, pub.reportUri);
    }

    /**
     * @notice Verify that a token leaf is included in the latest Merkle root.
     * @param leafHash  keccak256(abi.encodePacked(token_id, param_hash, energy_hash))
     * @param proof     Ordered sibling hashes from leaf to root.
     * @return valid    True if the leaf is provably in the committed tree.
     */
    function verifyTokenInclusion(
        bytes32 leafHash,
        bytes32[] calldata proof
    ) external view returns (bool valid) {
        require(publications.length > 0, "No publications yet");
        bytes32 computed = leafHash;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 p = proof[i];
            computed = computed <= p
                ? keccak256(abi.encodePacked(computed, p))
                : keccak256(abi.encodePacked(p, computed));
        }
        return computed == publications[publications.length - 1].merkleRoot;
    }

    // ─── Admin ────────────────────────────────────────────────────────────────

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}
