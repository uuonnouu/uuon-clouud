
/**
 * THIRDWEB AI INTEGRATION
 * Natural language NFT minting and blockchain operations
 * © 2025 UUON Foundation Inc.
 */

import { Router, Request, Response } from 'express';

const router = Router();

const THIRDWEB_CLIENT_ID = process.env.THIRDWEB_CLIENT_ID;
const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY;

interface AIChartRequest {
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  context?: {
    chain_ids?: number[];
    from?: string;
  };
  stream?: boolean;
}

// AI-powered NFT minting with natural language
router.post('/ai-mint', async (req: Request, res: Response) => {
  try {
    const { naturalLanguageRequest, walletAddress, shapeData } = req.body;

    if (!THIRDWEB_CLIENT_ID || !THIRDWEB_SECRET_KEY) {
      return res.status(400).json({
        success: false,
        error: 'Thirdweb credentials not configured'
      });
    }

    // Construct AI request for NFT minting
    const aiRequest: AIChartRequest = {
      messages: [
        {
          role: 'user',
          content: `Mint an NFT for mathematical shape: ${shapeData?.shapeName || 'Unknown Shape'}. ${naturalLanguageRequest}`
        }
      ],
      context: {
        chain_ids: [137], // Polygon
        from: walletAddress
      },
      stream: false
    };

    // Call thirdweb AI API
    const response = await fetch('https://api.thirdweb.com/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': THIRDWEB_CLIENT_ID,
        'x-secret-key': THIRDWEB_SECRET_KEY
      },
      body: JSON.stringify(aiRequest)
    });

    if (!response.ok) {
      throw new Error(`Thirdweb AI API error: ${response.status}`);
    }

    const aiResponse = await response.json();

    res.json({
      success: true,
      ai_response: aiResponse,
      mint_ready: true,
      natural_language_processing: {
        request: naturalLanguageRequest,
        shape: shapeData?.shapeName,
        wallet: walletAddress,
        actions: aiResponse.actions || []
      }
    });

  } catch (error: any) {
    console.error('Thirdweb AI integration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'AI minting failed'
    });
  }
});

// Natural language blockchain queries for mathematical shapes
router.post('/ai-query', async (req: Request, res: Response) => {
  try {
    const { query, context } = req.body;

    const aiRequest: AIChartRequest = {
      messages: [
        {
          role: 'user',
          content: query
        }
      ],
      context: context || {
        chain_ids: [1, 137, 8453], // Ethereum, Polygon, Base
      },
      stream: false
    };

    const response = await fetch('https://api.thirdweb.com/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': THIRDWEB_CLIENT_ID!,
        'x-secret-key': THIRDWEB_SECRET_KEY!
      },
      body: JSON.stringify(aiRequest)
    });

    const aiResponse = await response.json();

    res.json({
      success: true,
      query,
      ai_response: aiResponse,
      blockchain_actions: aiResponse.actions || []
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get supported chains for mathematical shape NFTs
router.get('/supported-chains', async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://api.thirdweb.com/v1/bridge/chains', {
      headers: {
        'x-client-id': THIRDWEB_CLIENT_ID!
      }
    });

    const chains = await response.json();

    res.json({
      success: true,
      supported_chains: chains,
      recommended_for_nfts: [
        { chain_id: 1, name: 'Ethereum', gas_cost: 'High' },
        { chain_id: 137, name: 'Polygon', gas_cost: 'Low' },
        { chain_id: 8453, name: 'Base', gas_cost: 'Low' }
      ]
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

console.log("🤖 Thirdweb AI Integration loaded");
console.log("   💬 Natural language NFT minting");
console.log("   🧠 AI-powered blockchain queries");
console.log("   🌐 Multi-chain support");

export default router;
