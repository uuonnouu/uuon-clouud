# Dmension Mathematical Universe — Hard Technical Specification Sheet

**Version 1.0.0 | December 2025**  
**© 2025 UUON Foundation Inc.**

---

## System Classification

A geometry-first computational asset framework producing parametric, regenerable, canonical geometry assets with no rendering dependency. Assets are material-agnostic, deterministic, and losslessly regenerable from closed-form parametric equations.

## Core Geometry Library

- **2,430+ unique parametric forms** across 145+ categories
- Topology, physics, medicine, architecture, hyperdimensional geometry
- Closed-form parametric equations (deterministic regeneration)

## UV and Displacement System

| Feature | Specification |
|---------|--------------|
| UV Domain | Continuous parametric with equation-aware remapping |
| Projection | High-accuracy non-photographic projection |
| Displacement | Native-safe displacement behavior |
| Texture Usage | Optional (not required for correct rendering) |
| Image Projection | Deterministic image-to-geometry mapping |

## PBR Material System

| Feature | Specification |
|---------|--------------|
| Material Requirement | Optional (geometry renders correctly without materials) |
| Resolution | Up to 2048×2048px |
| Material Count | 49 procedural materials (6 categories) |
| Emissive Support | Yes |
| Wireframe Export | Optional wireframe-core exports |
| Philosophy | Full material agnosticism |

### Material Categories

1. **Neon Glow** (18 patterns) - Premium category
2. **Metallic** (5 patterns) - Gold, silver, copper, bronze, titanium
3. **Crystalline** (7 patterns) - Diamond, opal, alexandrite, gems
4. **Energy** (4 patterns) - Plasma, lightning, neon, aurora
5. **Organic** (4 patterns) - Wood, marble, granite, leather
6. **Topological** (10 patterns) - Voronoi, Perlin, fractal, etc.

## Export Formats

### Static Exports

| Format | Extension | Description |
|--------|-----------|-------------|
| GLB Solid | .glb | Full mesh with baked PBR materials |
| GLB Wireframe | .glb | Edge geometry with emissive core |
| GLB Points | .glb | GLTF primitive mode 0 (true point cloud) |
| PLY Cloud | .ply | ASCII point cloud with RGB vertex colors |

### Animated Exports

| Format | Type | Description |
|--------|------|-------------|
| Transform Animation | GLB | Pulsing/morphing animations |
| Sketchfab Loop | GLB | Seamless 360° rotation (4 seconds) |

### Specialized Exports

| Format | Description |
|--------|-------------|
| AR/VR | Optimized with LOD support |
| Holographic | Multi-layer shell geometry with Fresnel glow |
| NeRF | Nerfstudio-compatible package |

### NeRF Export Package Contents

- `transforms.json` - 100 camera poses with intrinsics
- `points.ply` - Colored point cloud
- `instant_ngp_config.json` - Hash grid encoding parameters
- `formulas.json` - Mathematical documentation with LaTeX
- `metadata.json` - Shape parameters and security

## Parametric Metadata (GLTF Extras)

All exports embed structured regeneration metadata:

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

## NFT Architecture

| Feature | Specification |
|---------|--------------|
| Token Standards | ERC-721, ERC-1155 |
| Token Subject | Mathematical state (not rendered image) |
| IPFS Storage | Dual-provider (Pinata + NFT.Storage) |
| Marketplace Compatibility | OpenSea, Rarible, Foundation |
| Supported Networks | Ethereum, Polygon, Base |

## Geometric Fingerprinting

| Step | Process |
|------|---------|
| Input | Lexicographically sorted parameter data |
| Hash | SHA-256 |
| Output | First 16 hexadecimal characters |
| Result | Negligible collision probability, cryptographic identity |

## Token Ledger System

| Feature | Implementation |
|---------|----------------|
| Token IDs | ULID-based (time-ordered unique identifiers) |
| Transaction Integrity | SHA-256 hash chain |
| Energy Signatures | HMAC-SHA256 |
| Merkle Proofs | Generated for blockchain bridging |
| Stateful Tracking | Energy accounting with cross-learning integration |

## Valuation Algorithm

### Complexity Calculation
```
complexity = min(10, (paramCount × 0.5 + paramVariance × 0.3) × 10) / 10
```

### Rarity Tiers

| Rarity | Complexity | Base Value |
|--------|------------|------------|
| Legendary | 10+ | $5,000 |
| Epic | 8-9 | $2,000 |
| Rare | 6-7 | $500 |
| Uncommon | 4-5 | $150 |
| Common | 0-3 | $50 |

### Category Multipliers

| Category | Multiplier |
|----------|------------|
| Medical TPMS | 5.0× |
| Hyperdimensional | 3.0× |
| Quantum Physics | 2.5× |
| Thermal Engineering | 2.0× |
| Scientific | 1.5× |
| Default | 1.0× |

**Price Range:** $50 - $25,000+ per shape

## Security Measures

| Feature | Implementation |
|---------|----------------|
| Export Protection | Password-gated exports |
| API Verification | Server-side team password verification |
| Token Integrity | HMAC-SHA256 cryptographic enforcement |
| Provenance | Immutable tracking |
| Audit Trail | Export logging |

## Performance Targets

| Metric | Target |
|--------|--------|
| Mesh Size | < 1 MB typical |
| UV Generation | O(n) complexity |
| Regeneration Time | < 50 milliseconds |
| NeRF Preparation | Deterministic |
| Memory Footprint | Low |

## Application Domains

- Scientific visualization
- Architecture and engineering
- Biomedical modeling
- Neural rendering (NeRF)
- Blockchain ownership
- AR/VR experiences
- 3D printing
- Educational platforms

---

*© 2025 UUON Foundation Inc.*
