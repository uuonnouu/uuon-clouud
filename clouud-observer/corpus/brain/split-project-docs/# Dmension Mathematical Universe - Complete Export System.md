  
# Dmension Mathematical Universe - Complete Export System  
  
**Version 1.0.0 | December 2025**    
**© 2025 UUON Foundation Inc.**  
  
---  
  
## Table of Contents  
  
1. [Overview](#overview)  
2. [Export Formats](#export-formats)  
3. [PBR Material System](#pbr-material-system)  
4. [NFT Minting Platform](#nft-minting-platform)  
5. [Token Ledger System](#token-ledger-system)  
6. [Valuation Algorithm](#valuation-algorithm)  
7. [Security & Authentication](#security--authentication)  
8. [API Reference](#api-reference)  
9. [Database Schema](#database-schema)  
10. [Configuration](#configuration)  
  
---  
  
## Overview  
  
The Dmension Mathematical Universe export system provides production-grade 3D model export, NFT minting, and blockchain-ready token management for 2,430+ parametric mathematical shapes across 145+ categories.  
  
### Key Capabilities  
  
| Feature | Description |  
|---------|-------------|  
| **Shape Library** | 2,430+ parametric equations |  
| **Export Formats** | GLB, PLY, Animated, Neural, AR/VR |  
| **PBR Materials** | 49 procedural materials at 2048px |  
| **NFT Minting** | ERC-721/1155 with dual IPFS storage |  
| **Token Economy** | Blockchain-ready ledger with Merkle proofs |  
| **Price Range** | $50 - $25,000 per shape |  
  
---  
  
## Export Formats  
  
### Static 3D Models  
  
| Format | Extension | Description | Use Case |  
|--------|-----------|-------------|----------|  
| **GLB Solid** | .glb | Full mesh with baked PBR materials (2048px textures) | 3D printing, game engines, AR/VR |  
| **GLB Wireframe** | .glb | Edge geometry with emissive glowing core mesh | Scientific visualization, holographic displays |  
| **GLB Points** | .glb | GLTF primitive mode 0 (true point cloud) | Point cloud software, LiDAR workflows |  
| **PLY Cloud** | .ply | ASCII point cloud with RGB vertex colors | Blender, MeshLab, CloudCompare |  
  
### Animated Exports  
  
| Format | Animation Type | Duration | Description |  
|--------|----------------|----------|-------------|  
| **Sketchfab** | Y-axis rotation | 4 seconds | 360° seamless loop for portfolio display |  
| **Transform Animation** | Pulsing/morphing | Variable | Interactive presentations |  
| **Physics Animation** | Simulated motion | Variable | Scientific simulations |  
  
### Specialized Exports  
  
| Format | Description |  
|--------|-------------|  
| **Holographic** | Multi-layer mesh with Fresnel glow, chromatic aberration (red/blue shift), cyan wireframe cage, outer glow shell |  
| **AR/VR** | Optimized for real-time rendering with LOD (Level of Detail) support |  
| **Neural (.nerf)** | Nerfstudio-compatible package: transforms.json (100 camera poses), points.ply, instant_ngp_config.json, formulas.json, metadata.json |  
  
### Geometry Enhancement  
  
All exports include automatic geometry enhancement:  
  
- **UV Mapping** (TEXCOORD_0) auto-generated  
- **Normals** computed analytically from parametric derivatives  
- **Tangents** calculated for normal mapping  
- **Indexed geometry** optimization  
- **Industry-standard GLTF 2.0** compliance  
  
### Parametric Data Preservation  
  
Every export embeds regeneration metadata in GLTF extras:  
  
```json  
{  
  "parametricData": {  
    "identity": {  
      "shapeId": "mobius_strip",  
      "category": "topology",  
      "formula": "LaTeX formula string"  
    },  
    "parameters": { "a": 1, "b": 1, "c": 1, ... },  
    "geometry": {  
      "vertexCount": 4096,  
      "faceCount": 8192,  
      "boundingBox": {...}  
    }  
  },  
  "dimensionUniverse": {  
    "canRegenerate": true,  
    "version": "1.0.0"  
  }  
}  
```  
  
---  
  
## PBR Material System  
  
### 49 Procedural Materials (6 Categories)  
  
All materials are procedurally generated at 2048×2048px resolution.  
  
#### 1. Neon Glow (18 patterns) - Premium Category  
  
| Material | Icon | Description |  
|----------|------|-------------|  
| neon_pink | 💗 | Hot pink neon tubes with white-hot core |  
| neon_blue | 💙 | Electric blue with cyan highlights |  
| neon_green | 💚 | Radioactive green glow |  
| neon_orange | 🧡 | Warm orange neon |  
| neon_purple | 💜 | Deep purple plasma |  
| neon_cyan | 🩵 | Bright cyan electric |  
| neon_red | ❤️ | Hot red neon |  
| neon_yellow | 💛 | Bright yellow glow |  
| neon_rainbow | 🌈 | Multi-color gradient |  
| neon_grid | 🔲 | Tron-style grid pattern |  
| neon_pulse | 💫 | Pulsating glow effect |  
| neon_plasma_fusion | ⚡ | Plasma energy fusion |  
| neon_hexagon_grid | ⬡ | Hexagonal grid pattern |  
| neon_circuit | 🔌 | Circuit board traces |  
| neon_scanlines | 📺 | Retro scanline effect |  
| neon_spiral | 🌀 | Spiral glow pattern |  
| neon_laser_grid | 🎯 | Laser grid projection |  
| neon_constellation | ✨ | Star constellation map |  
  
#### 2. Metallic (5 patterns)  
  
| Material | Properties |  
|----------|------------|  
| gold | High metalness, warm reflections |  
| silver | Cool metallic, high reflectivity |  
| copper | Orange-brown metallic |  
| bronze | Warm dark metallic |  
| titanium | Cool gray, aerospace finish |  
  
#### 3. Crystalline (7 patterns)  
  
| Material | Properties |  
|----------|------------|  
| diamond | High IOR (2.42), brilliant reflections |  
| opal | Iridescent color shift |  
| alexandrite | Color-changing crystal |  
| emerald | Deep green transparency |  
| ruby | Red transparency with depth |  
| sapphire | Blue crystal clarity |  
| amethyst | Purple crystalline |  
  
#### 4. Energy (4 patterns)  
  
| Material | Description |  
|----------|-------------|  
| plasma | Hot plasma energy effect |  
| lightning | Electric discharge pattern |  
| neon | Classic neon tube glow |  
| aurora | Northern lights gradient |  
  
#### 5. Organic (4 patterns)  
  
| Material | Description |  
|----------|-------------|  
| wood | Natural wood grain |  
| marble | Veined stone pattern |  
| granite | Speckled stone texture |  
| leather | Soft leather surface |  
  
#### 6. Topological (10 patterns)  
  
| Material | Description |  
|----------|-------------|  
| voronoi | Cell-based tessellation |  
| perlin_noise | Smooth noise gradient |  
| fractal | Self-similar patterns |  
| hexagonal | Honeycomb structure |  
| truchet | Tile-based patterns |  
| cellular | Organic cell growth |  
| mandelbrot | Fractal boundary |  
| fibonacci | Golden spiral |  
| penrose | Aperiodic tiling |  
| delaunay | Triangle mesh |  
  
### Engineering PBR System  
  
Physically-accurate materials for scientific/engineering visualization:  
  
| Category | Examples | Key Properties |  
|----------|----------|----------------|  
| **Printed Metal** | Titanium, Stainless Steel | Curvature-mapped roughness, additive manufacturing finish |  
| **Ceramic** | Structural ceramics | High IOR, low metalness, matte finish |  
| **Composite** | Carbon fiber, Kevlar | Anisotropic specular, woven structure |  
| **Alloy** | Bio-alloy, Aerospace alloy | Edge enhancement, smooth gradients |  
| **Carbon** | Graphene, Carbon nanotube | Ultra-low roughness, dark absorption |  
| **Organic** | Bio-polymer, Chitin | Subsurface scattering, natural structure |  
  
---  
  
## NFT Minting Platform  
  
### IPFS Storage (Dual Provider)  
  
| Provider | Purpose | Configuration |  
|----------|---------|---------------|  
| **Pinata** | Primary IPFS pinning service | `PINATA_API_KEY`, `PINATA_API_SECRET`, or `PINATA_JWT` |  
| **NFT.Storage** | Fallback IPFS storage | `NFT_STORAGE_API_KEY` |  
  
The system automatically falls back to NFT.Storage if Pinata fails.  
  
### Blockchain Integration  
  
| Service | Function | Configuration |  
|---------|----------|---------------|  
| **Thirdweb** | Direct NFT minting, smart contract deployment | `THIRDWEB_CLIENT_ID`, `THIRDWEB_SECRET_KEY` |  
| **MetaMask** | Wallet connection for user authentication | Client-side integration |  
  
### Smart Contract Templates  
  
| Standard | Description | Use Case |  
|----------|-------------|----------|  
| **ERC-721** | Single unique NFTs | One-of-one mathematical art |  
| **ERC-1155** | Multi-edition NFTs | Limited edition collections |  
  
**Supported Networks:** Ethereum, Polygon, Base  
  
### Marketplace Compatibility  
  
- OpenSea  
- Rarible  
- Foundation  
  
### Premium NFT Collections  
  
| Collection | Tier | Base Price | Example Shapes |  
|------------|------|------------|----------------|  
| **Medical TPMS** | 1 | $5,000 | gyroid_scaffold, diamond_tpms, vascular_scaffold, bone_growth_lattice |  
| **Hyperdimensional** | 1 | $3,000 | tesseract, hopf_fibration, klein_bottle_4d, e8_lattice |  
| **Quantum Physics** | 1 | $2,500 | schrodinger_wave, quantum_superposition, bloch_sphere, entanglement_manifold |  
| **Sacred Geometry** | 2 | $1,000 | metatron_cube, flower_of_life, golden_ratio_spiral, platonic_compound |  
| **Astrophysics** | 2 | $800 | black_hole, gravitational_waves, saturn_system, cosmic_background |  
| **Fractal Art** | 2 | $600 | mandelbrot_deep, julia_variations, burning_ship, dragon_curve |  
| **Famous Constants** | 3 | $200 | pi_surface, euler_spiral, golden_rectangle, sqrt2_proof |  
| **Physics Equations** | 3 | $300 | einstein_field, maxwell_fields, heisenberg_uncertainty, newton_gravity |  
  
### NFT Metadata Structure (ERC-721 Compatible)  
  
```json  
{  
  "name": "Gyroid Scaffold #1",  
  "description": "Mathematical parametric surface from Dmension Universe",  
  "external_url": "https://dmension.app/shape/gyroid_scaffold",  
  "image": "ipfs://QmXxxxx...",  
  "animation_url": "ipfs://QmYxxxx...",  
  "attributes": [  
    { "trait_type": "Category", "value": "Medical TPMS" },  
    { "trait_type": "Complexity", "value": 8.5, "display_type": "number" },  
    { "trait_type": "Rarity", "value": "Epic" },  
    { "trait_type": "Fingerprint", "value": "a1b2c3d4e5f67890" },  
    { "trait_type": "Parameter Count", "value": 26, "display_type": "number" }  
  ],  
  "properties": {  
    "category": "medical_tpms",  
    "formula": "cos(x)sin(y) + cos(y)sin(z) + cos(z)sin(x) = 0",  
    "parameters": { "a": 1, "b": 1, "c": 1, "d": 0, ... },  
    "complexity": 8.5,  
    "rarity": "Epic",  
    "mathematicalProperties": {  
      "genus": 3,  
      "meanCurvature": 0,  
      "surfaceArea": "calculated"  
    }  
  }  
}  
```  
  
---  
  
## Token Ledger System  
  
### Blockchain-Ready Architecture  
  
| Feature | Implementation |  
|---------|----------------|  
| **Token IDs** | ULID-based (time-ordered unique identifiers) |  
| **Transaction Integrity** | SHA-256 hash chain |  
| **Energy Signatures** | HMAC-SHA256 with platform secret |  
| **Merkle Proofs** | Generated for blockchain bridging |  
| **ERC Compatibility** | 721/1155 metadata format |  
  
### Geometric Fingerprinting  
  
Each shape receives a unique 16-character fingerprint:  
  
```  
Input: Sorted parameters → "a:1.00000|b:1.00000|c:1.00000|..."  
Process: SHA-256 hash  
Output: First 16 hex characters (e.g., "a1b2c3d4e5f67890")  
```  
  
### Token State Tracking  
  
| Field | Description |  
|-------|-------------|  
| `tokenId` | ULID unique identifier |  
| `paramHash` | SHA-256 of parameter snapshot |  
| `energySignature` | HMAC-SHA256 energy proof |  
| `blockNumber` | Sequential block reference |  
| `blockHash` | Block chain hash |  
| `stateRoot` | Merkle tree root |  
  
### Energy Accumulation  
  
Tokens accumulate energy from:  
  
| Source | Description |  
|--------|-------------|  
| `interaction` | User parameter adjustments |  
| `stake` | Token staking rewards |  
| `cross_learn` | Cross-learning engine connections |  
| `export` | Export operations |  
| `discovery` | Pattern discovery rewards |  
  
---  
  
## Valuation Algorithm  
  
### Complexity Calculation  
  
```javascript  
complexity = min(10, (paramCount * 0.5 + paramVariance * 0.3) * 10) / 10  
```  
  
Where:  
- `paramCount` = Number of non-default parameters  
- `paramVariance` = Sum of |value - 1| for all parameters  
  
### Rarity Tiers  
  
| Rarity | Complexity Score | Base Value |  
|--------|------------------|------------|  
| **Legendary** | 10+ | $5,000 |  
| **Epic** | 8-9 | $2,000 |  
| **Rare** | 6-7 | $500 |  
| **Uncommon** | 4-5 | $150 |  
| **Common** | 0-3 | $50 |  
  
### Category Multipliers  
  
| Category | Multiplier |  
|----------|------------|  
| Medical TPMS | 5.0x |  
| Hyperdimensional | 3.0x |  
| Quantum Physics | 2.5x |  
| Thermal Engineering | 2.0x |  
| Scientific | 1.5x |  
| Default | 1.0x |  
  
### Final Value Formula  
  
```  
finalValue = baseValue × categoryMultiplier × (1 + complexity/10)  
```  
  
**Price Range:** $50 - $25,000+ per shape  
  
---  
  
## Security & Authentication  
  
### Export Authentication  
  
| Layer | Implementation |  
|-------|----------------|  
| **Password Protection** | Team password required for all exports |  
| **Server Verification** | POST `/api/verify-team-password` |  
| **Secret Storage** | `TEAM_ACCESS_PASSWORD` environment variable |  
  
### Token Security  
  
| Feature | Implementation |  
|---------|----------------|  
| **Signatures** | HMAC-SHA256 with `UUON_TOKEN_SECRET` |  
| **Fingerprints** | SHA-256 hash of parameter snapshot |  
| **Hash Chain** | Transaction integrity verification |  
  
### Export Tracking  
  
All exports are logged to database with:  
  
- Timestamp  
- Shape ID  
- Export type  
- Parameters snapshot  
- User/session info  
- Material settings  
  
---  
  
## API Reference  
  
### Export Endpoints  
  
| Endpoint | Method | Description |  
|----------|--------|-------------|  
| `/api/verify-team-password` | POST | Verify export password |  
| `/api/nft/mint` | POST | Mint NFT with IPFS upload |  
| `/api/nft/valuation` | GET | Get shape valuation |  
| `/api/nft/collections` | GET | List premium collections |  
  
### Token Ledger Endpoints  
  
| Endpoint | Method | Description |  
|----------|--------|-------------|  
| `/api/token-ledger/mint` | POST | Mint new token |  
| `/api/token-ledger/transfer` | POST | Transfer token ownership |  
| `/api/token-ledger/energy` | POST | Update token energy |  
| `/api/token-ledger/proof` | GET | Get Merkle proof |  
  
### UUON Schema Endpoints  
  
| Endpoint | Method | Description |  
|----------|--------|-------------|  
| `/api/uuon-schema/status` | GET | Check schema status |  
| `/api/uuon-schema/sync-from-tokens` | POST | Sync from shape_tokens |  
| `/api/uuon-schema/economy-overview` | GET | Get economy stats |  
  
---  
  
## Database Schema  
  
### 5-Chamber UUON Architecture (11 Tables)  
  
| Table | Purpose | Key Fields |  
|-------|---------|------------|  
| `shape_tokens` | Original token store (111,125 records) | id, shape_type, token_type, token_value, weight |  
| `uuon_shapes` | Registered shapes (1,542 records) | id, name, type, created_at |  
| `uuon_tokens` | Active tokens (100,000+) | id, shape_id, status, hash |  
| `uuon_token_metadata` | Extended metadata | token_id, metadata_json |  
| `energy_transactions` | Energy flow logs | id, token_id, source, delta, timestamp |  
| `energy_balance` | Current energy state | token_id, balance, last_updated |  
| `token_values` | Valuation snapshots | token_id, fiat_value, timestamp |  
| `portfolio_state` | Aggregate portfolio | total_tokens_minted, total_value |  
| `token_minting_log` | Mint history | token_id, minted_at, tx_hash |  
| `uuon_shape_interactions` | User interactions | shape_id, user_id, interaction_type |  
| `uuon_system_config` | System settings | environment, version |  
  
---  
  
## Configuration  
  
### Required Environment Variables  
  
| Variable | Purpose | Required |  
|----------|---------|----------|  
| `PINATA_API_KEY` | Pinata IPFS authentication | Yes* |  
| `PINATA_API_SECRET` | Pinata IPFS authentication | Yes* |  
| `PINATA_JWT` | Alternative Pinata auth | Yes* |  
| `NFT_STORAGE_API_KEY` | NFT.Storage fallback | Recommended |  
| `THIRDWEB_CLIENT_ID` | Blockchain minting | For minting |  
| `THIRDWEB_SECRET_KEY` | Blockchain minting | For minting |  
| `TEAM_ACCESS_PASSWORD` | Export authentication | Yes |  
| `UUON_TOKEN_SECRET` | Token signatures | Yes (production) |  
  
*At least one IPFS provider required  
  
### Parameter Specifications  
  
All shape parameters use consistent whole-number stepping:  
  
| Parameter Group | Range | Step | Default |  
|-----------------|-------|------|---------|  
| A-C (Core Scale) | -50 to 50 | 1 | 1 |  
| D-W (Deformation) | -180 to 180 | 1 | 0 |  
| X-Y-Z (Offset) | -10 to 10 | 1 | 1 |  
| UV Domain | -180 to 180 | 1 | 0/1 |  
| Mesh Segments | -180 to 180 | 1 | 64 |  
  
---  
  
## Version History  
  
| Version | Date | Changes |  
|---------|------|---------|  
| 1.0.0 | Dec 2025 | Initial release with complete NFT minting platform |  
  
---  
  
**© 2025 UUON Foundation Inc. All rights reserved.**  
