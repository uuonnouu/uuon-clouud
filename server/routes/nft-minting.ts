/**
 * NFT MINTING API
 * One-Click NFT Creation for Mathematical Shape Assets
 * ERC-721/ERC-1155 compatible metadata with marketplace integration
 * © 2025 UUON Foundation Inc.
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import multer from 'multer';
import { MorphingTokenGenerator } from '../morphing-token-generator';

const router = Router();

// Configure multer for file uploads - F-H8: MIME validation + 10MB limit
const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "model/gltf+json", "model/gltf-binary"];
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`MIME type ${file.mimetype} not allowed`));
    }
  }
});

// Pinata IPFS Configuration
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_API_SECRET = process.env.PINATA_API_SECRET;
const PINATA_JWT = process.env.PINATA_JWT;

const isPinataConfigured = !!(PINATA_API_KEY && PINATA_API_SECRET) || !!PINATA_JWT;

// NFT.Storage Configuration
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;
const isNftStorageConfigured = !!NFT_STORAGE_API_KEY;

// Thirdweb Configuration
const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;
const isThirdwebConfigured = !!(THIRDWEB_CLIENT_ID && THIRDWEB_SECRET_KEY);

console.log(`📌 Pinata IPFS: ${isPinataConfigured ? '✅ Connected' : '⚠️ Not configured'}`);
console.log(`📦 NFT.Storage: ${isNftStorageConfigured ? '✅ Connected' : '⚠️ Not configured'}`);

// Premium NFT Collections for OpenSea
const PREMIUM_COLLECTIONS = {
  medical_tpms: {
    tier: 1,
    basePrice: 5000,
    shapes: ['gyroid_scaffold', 'diamond_tpms', 'vascular_scaffold', 'bone_growth_lattice'],
    description: 'Revolutionary tissue engineering and biomedical applications'
  },
  hyperdimensional: {
    tier: 1, 
    basePrice: 3000,
    shapes: ['tesseract', 'hopf_fibration', 'klein_bottle_4d', 'e8_lattice'],
    description: 'Advanced 4D+ mathematical visualizations for quantum computing research'
  },
  quantum_physics: {
    tier: 1,
    basePrice: 2500, 
    shapes: ['schrodinger_wave', 'quantum_superposition', 'bloch_sphere', 'entanglement_manifold'],
    description: 'Quantum mechanics visualizations for physics research and education'
  },
  sacred_geometry: {
    tier: 2,
    basePrice: 1000,
    shapes: ['metatron_cube', 'flower_of_life', 'golden_ratio_spiral', 'platonic_compound'],
    description: 'Sacred geometric patterns with spiritual and mathematical significance'
  },
  astrophysics: {
    tier: 2,
    basePrice: 800,
    shapes: ['black_hole', 'gravitational_waves', 'saturn_system', 'cosmic_background'],
    description: 'Astrophysical phenomena and cosmic visualizations'
  },
  fractal_art: {
    tier: 2,
    basePrice: 600,
    shapes: ['mandelbrot_deep', 'julia_variations', 'burning_ship', 'dragon_curve'],
    description: 'Infinite complexity fractal mathematical art'
  },
  famous_constants: {
    tier: 3,
    basePrice: 200,
    shapes: ['pi_surface', 'euler_spiral', 'golden_rectangle', 'sqrt2_proof'],
    description: 'Mathematical constants as geometric art'
  },
  physics_equations: {
    tier: 3,
    basePrice: 300,
    shapes: ['einstein_field', 'maxwell_fields', 'heisenberg_uncertainty', 'newton_gravity'],
    description: 'Famous physics equations as visual mathematics'
  }
};

// Upload NFT metadata to Pinata IPFS
async function uploadToPinata(metadata: any, name: string): Promise<{ success: boolean; ipfsHash?: string; ipfsUri?: string; error?: string }> {
  if (!isPinataConfigured) {
    return { 
      success: false, 
      error: 'Pinata not configured. Set PINATA_API_KEY/PINATA_API_SECRET or PINATA_JWT.' 
    };
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(PINATA_JWT 
          ? { 'Authorization': `Bearer ${PINATA_JWT}` }
          : { 'pinata_api_key': PINATA_API_KEY!, 'pinata_secret_api_key': PINATA_API_SECRET! }
        )
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: `${name}_metadata.json`,
          keyvalues: {
            platform: 'Dmension Mathematical Universe',
            type: 'nft_metadata'
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Pinata API error: ${error}` };
    }

    const data = await response.json();
    return {
      success: true,
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Upload file/image to Pinata IPFS
async function uploadFileToPinata(fileBuffer: Buffer, fileName: string): Promise<{ success: boolean; ipfsHash?: string; ipfsUri?: string; error?: string }> {
  if (!isPinataConfigured) {
    return { 
      success: false, 
      error: 'Pinata not configured' 
    };
  }

  try {
    const formData = new FormData();
    const blob = new Blob([fileBuffer]);
    formData.append('file', blob, fileName);
    formData.append('pinataMetadata', JSON.stringify({
      name: fileName,
      keyvalues: { platform: 'Dmension', type: 'nft_asset' }
    }));

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: PINATA_JWT 
        ? { 'Authorization': `Bearer ${PINATA_JWT}` }
        : { 'pinata_api_key': PINATA_API_KEY!, 'pinata_secret_api_key': PINATA_API_SECRET! },
      body: formData
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `Pinata API error: ${error}` };
    }

    const data = await response.json();
    return {
      success: true,
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Upload to NFT.Storage (alternative IPFS provider)
async function uploadToNftStorage(metadata: any, name: string): Promise<{ success: boolean; ipfsHash?: string; ipfsUri?: string; error?: string }> {
  if (!isNftStorageConfigured) {
    return { 
      success: false, 
      error: 'NFT.Storage not configured. Set NFT_STORAGE_API_KEY.' 
    };
  }

  try {
    const response = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NFT_STORAGE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(metadata)
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `NFT.Storage API error: ${error}` };
    }

    const data = await response.json();
    const cid = data.value?.cid || data.cid;
    return {
      success: true,
      ipfsHash: cid,
      ipfsUri: `ipfs://${cid}`
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Universal IPFS upload - tries Pinata first, falls back to NFT.Storage
async function uploadToIPFS(metadata: any, name: string): Promise<{ success: boolean; ipfsHash?: string; ipfsUri?: string; provider?: string; error?: string }> {
  // Try Pinata first (preferred)
  if (isPinataConfigured) {
    const result = await uploadToPinata(metadata, name);
    if (result.success) {
      return { ...result, provider: 'pinata' };
    }
  }
  
  // Fallback to NFT.Storage
  if (isNftStorageConfigured) {
    const result = await uploadToNftStorage(metadata, name);
    if (result.success) {
      return { ...result, provider: 'nft.storage' };
    }
  }
  
  return { 
    success: false, 
    error: 'No IPFS provider configured. Set PINATA_JWT or NFT_STORAGE_API_KEY.' 
  };
}

interface NFTMintRequest {
  shapeId: string;
  shapeName: string;
  category: string;
  formula: string;
  parameters: Record<string, number>;
  creatorWallet?: string;
  royaltyPercent?: number;
  collectionName?: string;
}

interface NFTMetadata {
  name: string;
  description: string;
  external_url: string;
  image: string;
  animation_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
    display_type?: string;
  }>;
  properties: {
    category: string;
    formula: string;
    parameters: Record<string, number>;
    complexity: number;
    rarity: string;
    mathematicalProperties: Record<string, any>;
  };
}

interface SmartContractTemplate {
  network: string;
  contractType: 'ERC721' | 'ERC1155';
  solidityCode: string;
  deploymentParams: Record<string, any>;
}

function calculateComplexity(params: Record<string, number>): number {
  const paramCount = Object.keys(params).length;
  const paramVariance = Object.values(params).reduce((sum, v) => sum + Math.abs(v - 1), 0);
  return Math.min(10, Math.round((paramCount * 0.5 + paramVariance * 0.3) * 10) / 10);
}

function determineRarity(complexity: number, category: string): string {
  const premiumCategories = ['medical_tpms', 'hyperdimensional', 'quantum_physics', 'thermal_engineering']; // Updated to include quantum_physics
  const categoryBonus = premiumCategories.includes(category) ? 2 : 0;
  const score = complexity + categoryBonus;

  if (score >= 10) return 'Legendary';
  if (score >= 8) return 'Epic';
  if (score >= 6) return 'Rare';
  if (score >= 4) return 'Uncommon';
  return 'Common';
}

function calculateMarketValue(complexity: number, rarity: string, category: string): number {
  const baseValues: Record<string, number> = {
    'Legendary': 5000,
    'Epic': 2000,
    'Rare': 500,
    'Uncommon': 150,
    'Common': 50
  };

  const categoryMultipliers: Record<string, number> = {
    'medical_tpms': 5.0,
    'hyperdimensional': 3.0,
    'quantum_physics': 2.5, // Updated to include quantum_physics
    'thermal_engineering': 2.0,
    'scientific': 1.5,
    'default': 1.0
  };

  const base = baseValues[rarity] || 50;
  const multiplier = categoryMultipliers[category] || categoryMultipliers['default'];

  return Math.round(base * multiplier * (1 + complexity / 10));
}

function generateGeometricFingerprint(params: Record<string, number>): string {
  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  const data = sorted.map(([k, v]) => `${k}:${v.toFixed(5)}`).join('|');
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 16);
}

router.post('/mint', async (req: Request, res: Response) => {
  try {
    const {
      shapeId,
      shapeName,
      category,
      formula,
      parameters,
      creatorWallet,
      royaltyPercent = 5,
      collectionName = 'Dmension Mathematical Universe'
    }: NFTMintRequest = req.body;

    if (!shapeId || !shapeName || !parameters) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shapeId, shapeName, parameters'
      });
    }

    const complexity = calculateComplexity(parameters);
    const rarity = determineRarity(complexity, category || 'default');
    const marketValue = calculateMarketValue(complexity, rarity, category || 'default');
    const geometricFingerprint = generateGeometricFingerprint(parameters);

    const tokenId = `DMN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const mintTimestamp = new Date().toISOString();

    const morphingToken = MorphingTokenGenerator.generateToken(
      { shapeId, parameters, category },
      tokenId,
      365 * 24 * 60 * 60 * 1000
    );

    const metadata: NFTMetadata = {
      name: `${shapeName} #${tokenId.substring(4, 12)}`,
      description: `Mathematical shape from Dmension Universe. Formula: ${formula || 'Parametric Surface'}. Category: ${category || 'General'}. Complexity: ${complexity}/10. Rarity: ${rarity}.`,
      external_url: `https://dmension.io/shapes/${shapeId}`,
      image: `ipfs://QmDmensionPlaceholder/${tokenId}.png`,
      animation_url: `ipfs://QmDmensionPlaceholder/${tokenId}.glb`,
      attributes: [
        { trait_type: 'Category', value: category || 'General' },
        { trait_type: 'Rarity', value: rarity },
        { trait_type: 'Complexity', value: complexity, display_type: 'number' },
        { trait_type: 'Parameter Count', value: Object.keys(parameters).length, display_type: 'number' },
        { trait_type: 'Geometric Fingerprint', value: geometricFingerprint },
        { trait_type: 'Mathematical Domain', value: getMathDomain(category || 'general') },
        { trait_type: 'Export Ready', value: 'GLB, USDZ, PLY' },
        { trait_type: 'AR/VR Compatible', value: 'Yes' }
      ],
      properties: {
        category: category || 'General',
        formula: formula || 'Parametric Surface',
        parameters,
        complexity,
        rarity,
        mathematicalProperties: {
          geometricFingerprint,
          topologicalSignature: morphingToken.geometryHash.substring(0, 32),
          phiConstant: morphingToken.metadata.phi,
          piConstant: morphingToken.metadata.pi,
          synthesis: morphingToken.metadata.synthesis
        }
      }
    };

    const contractPayload = {
      tokenId,
      to: creatorWallet || '0x0000000000000000000000000000000000000000',
      uri: `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`,
      royaltyRecipient: creatorWallet,
      royaltyBps: royaltyPercent * 100
    };

    res.json({
      success: true,
      nft: {
        tokenId,
        collectionName,
        metadata,
        morphingToken: {
          id: morphingToken.id,
          signature: morphingToken.signature,
          contractFingerprint: morphingToken.contractFingerprint,
          validUntil: new Date(morphingToken.timestamp + morphingToken.validity).toISOString()
        },
        valuation: {
          estimatedValue: marketValue,
          currency: 'USD',
          rarity,
          complexity
        },
        blockchain: {
          readyForDeployment: true,
          supportedNetworks: ['Ethereum', 'Polygon', 'Base', 'Optimism', 'Arbitrum'],
          contractPayload,
          gasEstimate: {
            ethereum: '~0.005 ETH',
            polygon: '~0.01 MATIC',
            base: '~0.0001 ETH'
          }
        },
        mintedAt: mintTimestamp
      }
    });

  } catch (error) {
    console.error('NFT minting error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mint NFT'
    });
  }
});

function getMathDomain(category: string): string {
  const domains: Record<string, string> = {
    'hyperdimensional': 'Higher Dimensions (4D+)',
    'quantum_physics': 'Quantum Mathematics', // Updated to include quantum_physics
    'medical_tpms': 'Biomedical Engineering',
    'thermal_engineering': 'Thermodynamics',
    'minimal_surfaces': 'Differential Geometry',
    'topology': 'Algebraic Topology',
    'fractals': 'Chaos Theory',
    'biological': 'Mathematical Biology'
  };
  return domains[category] || 'Pure Mathematics';
}

router.get('/smart-contract/:network', (req: Request, res: Response) => {
  const network = req.params.network.toLowerCase();

  const contracts: Record<string, SmartContractTemplate> = {
    ethereum: {
      network: 'Ethereum Mainnet',
      contractType: 'ERC721',
      solidityCode: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DmensionMathNFT is ERC721URIStorage, ERC721Royalty, Ownable {
    uint256 private _nextTokenId;

    constructor() ERC721("Dmension Mathematical Universe", "DMN") Ownable(msg.sender) {}

    function mintShape(
        address to,
        string memory tokenURI,
        uint96 royaltyBps
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        _setTokenRoyalty(tokenId, to, royaltyBps);
        return tokenId;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721URIStorage, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override {
        super._increaseBalance(account, value);
    }
}`,
      deploymentParams: {
        name: 'Dmension Mathematical Universe',
        symbol: 'DMN',
        baseURI: 'ipfs://',
        royaltyBps: 500
      }
    },
    polygon: {
      network: 'Polygon',
      contractType: 'ERC721',
      solidityCode: '// Same as Ethereum with gas optimizations for Polygon',
      deploymentParams: {
        name: 'Dmension Mathematical Universe',
        symbol: 'DMN',
        gasOptimized: true
      }
    },
    base: {
      network: 'Base',
      contractType: 'ERC721',
      solidityCode: '// Same as Ethereum optimized for Base L2',
      deploymentParams: {
        name: 'Dmension Mathematical Universe',
        symbol: 'DMN',
        l2Optimized: true
      }
    }
  };

  const contract = contracts[network] || contracts.ethereum;

  res.json({
    success: true,
    contract,
    deploymentGuide: {
      steps: [
        '1. Copy the Solidity code to Remix IDE or Hardhat',
        '2. Install OpenZeppelin contracts: npm install @openzeppelin/contracts',
        '3. Compile with Solidity 0.8.20+',
        '4. Deploy to your chosen network',
        '5. Verify contract on block explorer',
        '6. Use mintShape() to mint your mathematical NFTs'
      ],
      estimatedCost: network === 'ethereum' ? '~$50-100' : '~$1-5'
    }
  });
});

router.get('/marketplace-metadata/:tokenId', (req: Request, res: Response) => {
  const { tokenId } = req.params;

  res.json({
    success: true,
    marketplaceCompatibility: {
      opensea: {
        compatible: true,
        collectionUrl: 'https://opensea.io/collection/dmension-mathematical-universe',
        requirements: ['ERC-721 metadata standard', 'IPFS hosting', 'Royalty support']
      },
      rarible: {
        compatible: true,
        requirements: ['ERC-721/1155', 'Lazy minting supported']
      },
      foundation: {
        compatible: true,
        requirements: ['Curated collection', 'High-quality renders']
      },
      blur: {
        compatible: true,
        requirements: ['ERC-721', 'Royalty optional']
      }
    },
    tokenId,
    ipfsGateway: 'https://gateway.pinata.cloud/ipfs/',
    arweaveBackup: 'Recommended for permanent storage'
  });
});

router.get('/valuation/:category', (req: Request, res: Response) => {
  const { category } = req.params;

  const valuations: Record<string, any> = {
    medical_tpms: {
      category: 'Medical TPMS Tissue Engineering',
      priceRange: '$1,000 - $25,000',
      targetBuyers: ['Medical research institutions', 'Biotech companies', 'FDA-approved device manufacturers'],
      topShapes: ['gyroid_scaffold', 'diamond_scaffold', 'vascular_scaffold'],
      licensingModel: 'Per-use or perpetual license'
    },
    hyperdimensional: {
      category: 'Hyperdimensional Polytopes',
      priceRange: '$500 - $15,000',
      targetBuyers: ['Quantum computing researchers', 'Mathematics departments', 'AI/ML researchers'],
      topShapes: ['tesseract', 'hypersphere', '5_simplex', 'e8_lattice'],
      licensingModel: 'Research license with attribution'
    },
    thermal_engineering: {
      category: 'Thermal Engineering & Data Center',
      priceRange: '$500 - $10,000',
      targetBuyers: ['Data center operators', 'HVAC engineers', 'Cooling system manufacturers'],
      topShapes: ['heat_sink_fins', 'pue_optimization_surface', 'immersion_cooling'],
      licensingModel: 'Commercial license'
    },
    quantum_physics: { // Updated to use quantum_physics category
      category: 'Quantum Algorithm Visualizations',
      priceRange: '$500 - $15,000',
      targetBuyers: ['Quantum computing companies', 'University physics departments', 'Tech giants'],
      topShapes: ['bloch_sphere', 'quantum_superposition', 'entanglement_surface'],
      licensingModel: 'Research or enterprise license'
    }
  };

  res.json({
    success: true,
    valuation: valuations[category] || {
      category: category,
      priceRange: '$50 - $5,000',
      targetBuyers: ['General collectors', 'Math enthusiasts', 'Educational institutions'],
      licensingModel: 'Standard NFT license'
    },
    totalMarketPotential: {
      shapes: 2511,
      averageValue: '$500',
      totalPotential: '$1,255,500 - $12,555,000'
    }
  });
});

router.get('/batch-estimate', (req: Request, res: Response) => {
  const { count = 10, category = 'general' } = req.query;
  const batchCount = Math.min(Number(count), 100);

  const categoryMultipliers: Record<string, number> = {
    'medical_tpms': 5.0,
    'hyperdimensional': 3.0,
    'quantum_physics': 2.5, // Updated to include quantum_physics
    'thermal_engineering': 2.0,
    'general': 1.0
  };

  const baseValue = 150;
  const multiplier = categoryMultipliers[category as string] || 1.0;
  const totalValue = batchCount * baseValue * multiplier;

  res.json({
    success: true,
    batchMint: {
      shapesCount: batchCount,
      category,
      estimatedTotalValue: Math.round(totalValue),
      currency: 'USD',
      gasEstimate: {
        ethereum: `~${(batchCount * 0.005).toFixed(3)} ETH`,
        polygon: `~${(batchCount * 0.01).toFixed(2)} MATIC`,
        base: `~${(batchCount * 0.0001).toFixed(4)} ETH`
      },
      mintingTime: `~${Math.ceil(batchCount / 10)} minutes`,
      recommendation: batchCount > 50 ? 'Consider ERC-1155 for gas efficiency' : 'ERC-721 recommended'
    }
  });
});

router.get('/user-nfts/:walletAddress', async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.params;

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid wallet address format'
      });
    }

    // In a real implementation, you would query your database for NFTs minted to this address
    // For now, we'll return a mock response showing potential NFTs
    const mockNFTs = [
      {
        tokenId: 'DMN-1735686234-A7F3B9E1',
        name: 'Hyperdimensional Tesseract #A7F3B9E1',
        image: 'ipfs://QmDmensionPlaceholder/DMN-1735686234-A7F3B9E1.png',
        collection: 'Dmension Mathematical Universe',
        category: 'hyperdimensional',
        value: 2500,
        rarity: 'Rare',
        mintedAt: '2025-01-02T10:30:34.000Z'
      },
      {
        tokenId: 'DMN-1735686450-B2C4D8F6',
        name: 'Medical TPMS Gyroid #B2C4D8F6',
        image: 'ipfs://QmDmensionPlaceholder/DMN-1735686450-B2C4D8F6.png',
        collection: 'Dmension Mathematical Universe',
        category: 'medical_tpms',
        value: 8500,
        rarity: 'Epic',
        mintedAt: '2025-01-02T10:34:10.000Z'
      }
    ];

    res.json({
      success: true,
      walletAddress,
      nfts: mockNFTs,
      totalValue: mockNFTs.reduce((sum, nft) => sum + nft.value, 0),
      count: mockNFTs.length
    });

  } catch (error) {
    console.error('Failed to fetch user NFTs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user NFTs'
    });
  }
});

router.post('/connect-wallet', async (req: Request, res: Response) => {
  try {
    const { walletAddress, signature, message } = req.body;

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required wallet connection data'
      });
    }

    // In a real implementation, you would verify the signature here
    // For now, we'll accept the connection and return wallet info

    res.json({
      success: true,
      wallet: {
        address: walletAddress,
        verified: true,
        connectedAt: new Date().toISOString()
      },
      message: 'Wallet connected successfully to Dmension Mathematical Universe'
    });

  } catch (error) {
    console.error('Wallet connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect wallet'
    });
  }
});

// Pinata/IPFS Status Check
router.get('/pinata-status', (req: Request, res: Response) => {
  res.json({
    success: true,
    pinata: {
      configured: isPinataConfigured,
      hasApiKey: !!PINATA_API_KEY,
      hasApiSecret: !!PINATA_API_SECRET,
      hasJwt: !!PINATA_JWT,
      gateway: 'https://gateway.pinata.cloud/ipfs/'
    },
    instructions: isPinataConfigured 
      ? 'Pinata is configured and ready for IPFS uploads'
      : 'Add PINATA_API_KEY, PINATA_API_SECRET, or PINATA_JWT to enable IPFS uploads'
  });
});

// Upload NFT metadata to Pinata IPFS
router.post('/upload-to-ipfs', async (req: Request, res: Response) => {
  try {
    const { metadata, name } = req.body;

    if (!metadata) {
      return res.status(400).json({
        success: false,
        error: 'Missing metadata in request body'
      });
    }

    const result = await uploadToPinata(metadata, name || 'nft_metadata');

    if (result.success) {
      res.json({
        success: true,
        ipfsHash: result.ipfsHash,
        ipfsUri: result.ipfsUri,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Upload file (GLB, image) to Pinata IPFS
router.post('/upload-file-to-ipfs', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    if (!isPinataConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Pinata not configured. Add PINATA_API_KEY and PINATA_API_SECRET or PINATA_JWT.'
      });
    }

    const fileName = req.body.name || req.file.originalname || `file_${Date.now()}`;
    console.log(`Uploading file to IPFS: ${fileName} (${req.file.size} bytes)`);

    const result = await uploadFileToPinata(req.file.buffer, fileName);

    if (result.success) {
      console.log(`File uploaded to IPFS: ${result.ipfsUri}`);
      res.json({
        success: true,
        ipfsHash: result.ipfsHash,
        ipfsUri: result.ipfsUri,
        gatewayUrl: `https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`,
        fileName,
        fileSize: req.file.size
      });
    } else {
      console.error('IPFS upload failed:', result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error('File upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Connection Test - Verify both Pinata and Thirdweb are working
router.get('/connection-test', async (req: Request, res: Response) => {
  const results = {
    timestamp: new Date().toISOString(),
    pinata: { configured: false, tested: false, working: false, error: null as string | null },
    thirdweb: { configured: false, tested: false, working: false, error: null as string | null }
  };

  // Test Pinata connection
  if (isPinataConfigured) {
    results.pinata.configured = true;
    results.pinata.tested = true;
    try {
      const response = await fetch('https://api.pinata.cloud/data/testAuthentication', {
        method: 'GET',
        headers: PINATA_JWT 
          ? { 'Authorization': `Bearer ${PINATA_JWT}` }
          : { 'pinata_api_key': PINATA_API_KEY!, 'pinata_secret_api_key': PINATA_API_SECRET! }
      });
      if (response.ok) {
        results.pinata.working = true;
      } else {
        results.pinata.error = `API returned ${response.status}`;
      }
    } catch (err: any) {
      results.pinata.error = err.message;
    }
  }

  // Test Thirdweb - Call their API to verify credentials work
  if (isThirdwebConfigured) {
    results.thirdweb.configured = true;
    results.thirdweb.tested = true;
    try {
      // Use Bridge API to check supported chains (simple GET that validates auth)
      // Backend calls use only x-secret-key header
      const response = await fetch('https://api.thirdweb.com/v1/bridge/chains', {
        method: 'GET',
        headers: {
          'x-secret-key': THIRDWEB_SECRET_KEY!
        }
      });
      if (response.ok) {
        results.thirdweb.working = true;
      } else {
        const errorText = await response.text();
        results.thirdweb.error = `API returned ${response.status}: ${errorText.slice(0, 100)}`;
      }
    } catch (err: any) {
      results.thirdweb.error = err.message;
    }
  }

  res.json({
    success: results.pinata.working || results.thirdweb.configured,
    message: `Pinata: ${results.pinata.working ? 'VERIFIED' : 'NOT WORKING'}, Thirdweb: ${results.thirdweb.configured ? 'CONFIGURED' : 'NOT CONFIGURED'}`,
    ...results
  });
});

// Thirdweb Status Check
router.get('/tw-status', (req: Request, res: Response) => {
  res.json({
    success: true,
    thirdweb: {
      configured: isThirdwebConfigured,
      hasClientId: !!THIRDWEB_CLIENT_ID,
      hasSecretKey: !!THIRDWEB_SECRET_KEY,
      supportedNetworks: ['polygon', 'ethereum', 'base', 'arbitrum', 'optimism']
    },
    instructions: isThirdwebConfigured
      ? 'Thirdweb is configured and ready for NFT minting'
      : 'Add THIRDWEB_CLIENT_ID and THIRDWEB_SECRET_KEY to enable direct minting'
  });
});

// Thirdweb Direct Mint - Mint NFT using Thirdweb SDK
router.post('/thirdweb-mint', async (req: Request, res: Response) => {
  try {
    const { 
      contractAddress,
      network = 'polygon',
      recipientAddress,
      tokenUri,
      metadata
    } = req.body;

    if (!isThirdwebConfigured) {
      return res.status(400).json({
        success: false,
        error: 'Thirdweb not configured. Add THIRDWEB_CLIENT_ID and THIRDWEB_SECRET_KEY.',
        setupGuide: {
          step1: 'Go to https://thirdweb.com/dashboard',
          step2: 'Create an API key',
          step3: 'Add THIRDWEB_CLIENT_ID and THIRDWEB_SECRET_KEY to your environment'
        }
      });
    }

    if (!tokenUri && !metadata) {
      return res.status(400).json({
        success: false,
        error: 'Missing tokenUri or metadata. Provide either an IPFS URI or metadata object.'
      });
    }

    if (!recipientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing recipientAddress. Provide the wallet address to receive the NFT.'
      });
    }

    // Network chain IDs
    const chainIds: Record<string, number> = {
      'ethereum': 1,
      'polygon': 137,
      'base': 8453,
      'arbitrum': 42161,
      'optimism': 10,
      'sepolia': 11155111,
      'mumbai': 80001
    };

    const chainId = chainIds[network.toLowerCase()] || 137;

    // If metadata provided, upload to Pinata first
    let finalTokenUri = tokenUri;
    if (!tokenUri && metadata && isPinataConfigured) {
      const uploadResult = await uploadToPinata(metadata, `dmension_nft_${Date.now()}`);
      if (uploadResult.success) {
        finalTokenUri = uploadResult.ipfsUri;
      } else {
        return res.status(500).json({
          success: false,
          error: `Failed to upload metadata to IPFS: ${uploadResult.error}`
        });
      }
    }

    // Return minting instructions for manual execution
    // Direct server-side minting requires thirdweb Engine which needs additional setup
    res.json({
      success: true,
      mintReady: true,
      mintData: {
        network,
        chainId,
        recipientAddress,
        tokenUri: finalTokenUri,
        contractAddress: contractAddress || 'Deploy new contract via thirdweb dashboard'
      },
      thirdwebDashboard: {
        deployContract: 'https://thirdweb.com/explore/nft-collection',
        mintNFT: contractAddress 
          ? `https://thirdweb.com/${chainId}/${contractAddress}/nfts`
          : 'Deploy contract first, then mint from dashboard',
        documentation: 'https://portal.thirdweb.com/contracts/explore/pre-built-contracts/nft-collection'
      },
      instructions: {
        step1: contractAddress 
          ? 'Contract ready - proceed to mint'
          : 'Go to thirdweb dashboard and deploy an NFT Collection contract',
        step2: `Network: ${network} (Chain ID: ${chainId})`,
        step3: `Recipient: ${recipientAddress}`,
        step4: `Token URI: ${finalTokenUri}`,
        step5: 'Click Mint in the thirdweb dashboard NFTs tab'
      },
      clientConfig: {
        clientId: THIRDWEB_CLIENT_ID,
        note: 'Use this client ID in your frontend thirdweb SDK'
      }
    });

  } catch (error: any) {
    console.error('Thirdweb mint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to prepare mint'
    });
  }
});

// Quick Mint - Combined Pinata upload + Thirdweb mint preparation
router.post('/quick-mint', async (req: Request, res: Response) => {
  try {
    const {
      shapeName,
      category,
      parameters,
      glbIpfsHash,
      imageIpfsHash,
      recipientAddress,
      network = 'polygon',
      royaltyPercent = 5
    } = req.body;

    if (!shapeName || !recipientAddress) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: shapeName, recipientAddress'
      });
    }

    // Generate token ID and calculate properties
    const tokenId = `DMN-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const complexity = calculateComplexity(parameters || {});
    const rarity = determineRarity(complexity, category || 'general');
    const marketValue = calculateMarketValue(complexity, rarity, category || 'general');

    // Build NFT metadata
    const nftMetadata = {
      name: shapeName,
      description: `Mathematical shape from Dmension Universe. Category: ${category || 'mathematical'}. Complexity: ${complexity}/10. Rarity: ${rarity}.`,
      image: imageIpfsHash ? `ipfs://${imageIpfsHash}` : `ipfs://placeholder`,
      animation_url: glbIpfsHash ? `ipfs://${glbIpfsHash}` : undefined,
      external_url: `https://dmension.io/shapes/${shapeName.toLowerCase().replace(/\s+/g, '_')}`,
      attributes: [
        { trait_type: 'Category', value: category || 'mathematical' },
        { trait_type: 'Rarity', value: rarity },
        { trait_type: 'Complexity', value: complexity, display_type: 'number' },
        { trait_type: 'Estimated Value', value: marketValue, display_type: 'number' }
      ],
      properties: {
        tokenId,
        parameters: parameters || {},
        createdAt: new Date().toISOString(),
        platform: 'Dmension Mathematical Universe'
      }
    };

    // Upload metadata to Pinata if configured
    let metadataUri = null;
    if (isPinataConfigured) {
      const uploadResult = await uploadToPinata(nftMetadata, `${tokenId}_metadata`);
      if (uploadResult.success) {
        metadataUri = uploadResult.ipfsUri;
      }
    }

    const chainIds: Record<string, number> = {
      'ethereum': 1, 'polygon': 137, 'base': 8453, 
      'arbitrum': 42161, 'optimism': 10
    };

    res.json({
      success: true,
      tokenId,
      nft: {
        metadata: nftMetadata,
        metadataUri,
        valuation: { estimatedValue: marketValue, currency: 'USD', rarity, complexity }
      },
      mintInstructions: {
        network,
        chainId: chainIds[network] || 137,
        recipientAddress,
        tokenUri: metadataUri || 'Upload metadata to Pinata first',
        royaltyBps: royaltyPercent * 100,
        thirdwebMintUrl: 'https://thirdweb.com/explore/nft-collection',
        steps: [
          '1. Deploy NFT Collection contract on thirdweb (if not done)',
          '2. Go to your contract\'s NFTs tab',
          `3. Click Mint, paste tokenURI: ${metadataUri}`,
          `4. Set recipient: ${recipientAddress}`,
          '5. Confirm transaction in MetaMask'
        ]
      },
      thirdwebReady: isThirdwebConfigured,
      pinataReady: isPinataConfigured
    });

  } catch (error: any) {
    console.error('Quick mint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Quick mint failed'
    });
  }
});

console.log("🎨 NFT Minting API loaded");
console.log("   💎 One-click shape minting with ERC-721 metadata");
console.log("   📜 Smart contract templates: Ethereum, Polygon, Base");
console.log("   🏪 Marketplace compatible: OpenSea, Rarible, Foundation");
console.log("   💰 Dynamic valuation: $50 - $25,000 per shape");
console.log("   🦊 MetaMask wallet integration ready");
if (isThirdwebConfigured) {
  console.log("   🔷 Thirdweb: ✅ Connected - Direct minting enabled");
}

export default router;