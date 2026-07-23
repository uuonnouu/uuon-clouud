import { Router, Request, Response } from 'express';
import { tokenLedgerService } from '../tokenLedgerService';

const router = Router();

const MINT_ACCESS_SECRET = process.env.UUON_TOKEN_SECRET;
const MAX_STOCKPILE_BATCH = 500;

function requireMintAuth(req: Request, res: Response): boolean {
  if (!MINT_ACCESS_SECRET) {
    res.status(503).json({ success: false, error: 'Minting disabled: UUON_TOKEN_SECRET not configured' });
    return false;
  }
  if (req.headers['x-uuon-token-secret'] !== MINT_ACCESS_SECRET) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return false;
  }
  return true;
}

router.get('/', (_req, res) => {
  res.json({
    name: 'UUON Token Ledger',
    version: '1.0.0',
    description: 'Digital DNA token economy — mint, transfer, track, and verify shape ownership tokens on an internal blockchain',
    endpoints: [
      { method: 'POST', path: '/mint', description: 'Mint a new shape token', auth: true },
      { method: 'GET',  path: '/list', description: 'List all minted tokens with pagination' },
      { method: 'GET',  path: '/stats', description: 'System-wide token and energy statistics' },
      { method: 'GET',  path: '/leaderboard', description: 'Top tokens by energy value' },
      { method: 'GET',  path: '/:tokenId', description: 'Specific token details' },
      { method: 'GET',  path: '/:tokenId/proof', description: 'Cryptographic verification proof' },
      { method: 'POST', path: '/:tokenId/energy', description: 'Update token energy from interaction' },
      { method: 'POST', path: '/:tokenId/transfer', description: 'Transfer token ownership' },
      { method: 'POST', path: '/stockpile', description: 'Batch-save tokens from frontend' },
      { method: 'POST', path: '/verify', description: 'Sync check between frontend and backend counts' }
    ],
    docs: '/api/sdk-info'
  });
});

router.post('/mint', async (req: Request, res: Response) => {
  try {
    if (!requireMintAuth(req, res)) return;
    const { shapeType, tokenName, parameters, equationSnapshot, mathematicalProperties, baseEnergy } = req.body;

    if (!shapeType || !tokenName) {
      return res.status(400).json({ 
        success: false, 
        error: 'shapeType and tokenName are required' 
      });
    }

    // Check if we're in development mode without database
    if (!process.env.DATABASE_URL) {
      console.log('🔧 Development Mode: Token minting simulation');
      return res.json({
        success: true,
        token: {
          tokenId: `dev-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
          txId: `dev-tx-${Date.now()}`,
          txHash: `dev-hash-${Date.now()}`,
          stateHash: `dev-state-${Date.now()}`,
          blockNumber: Math.floor(Date.now() / 1000)
        },
        message: 'Token minted in development mode (no database)',
        developmentMode: true
      });
    }

    const result = await tokenLedgerService.mintToken({
      shapeType,
      tokenName,
      parameters: parameters || { a: 1, b: 1, c: 1 },
      baseEnergy,
      equationSnapshot,
      mathematicalProperties
    });

    res.json({
      success: true,
      token: result,
      message: `Token ${result.tokenId} minted successfully`
    });
  } catch (error) {
    console.error('Token minting error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to mint token' 
    });
  }
});

router.get('/list', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 100, 500);
    const offset = parseInt(req.query.offset as string) || 0;

    const tokens = await tokenLedgerService.getAllTokens(limit, offset);

    res.json({
      success: true,
      tokens,
      count: tokens.length,
      pagination: { limit, offset }
    });
  } catch (error) {
    console.error('Token list error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch tokens' 
    });
  }
});

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const stats = await tokenLedgerService.getSystemStats();

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Token stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch system stats' 
    });
  }
});

router.get('/leaderboard', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const leaderboard = await tokenLedgerService.getEnergyLeaderboard(limit);

    res.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch leaderboard' 
    });
  }
});

router.get('/:tokenId', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const token = await tokenLedgerService.getToken(tokenId);

    if (!token) {
      return res.status(404).json({ 
        success: false, 
        error: `Token ${tokenId} not found` 
      });
    }

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Token fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch token' 
    });
  }
});

router.get('/:tokenId/proof', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const proof = await tokenLedgerService.getTokenProof(tokenId);

    if (!proof) {
      return res.status(404).json({ 
        success: false, 
        error: `Proof for token ${tokenId} not found` 
      });
    }

    res.json({
      success: true,
      proof
    });
  } catch (error) {
    console.error('Token proof error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch token proof' 
    });
  }
});

router.get('/:tokenId/transactions', async (req: Request, res: Response) => {
  try {
    const { tokenId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);

    const transactions = await tokenLedgerService.getTokenTransactions(tokenId, limit);

    res.json({
      success: true,
      transactions,
      count: transactions.length
    });
  } catch (error) {
    console.error('Token transactions error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch token transactions' 
    });
  }
});

router.post('/:tokenId/energy', async (req: Request, res: Response) => {
  try {
    if (!requireMintAuth(req, res)) return;
    const { tokenId } = req.params;
    const { source, delta, crossLearnConnections, patternDiscoveries } = req.body;

    if (!source || delta === undefined) {
      return res.status(400).json({ 
        success: false, 
        error: 'source and delta are required' 
      });
    }

    const result = await tokenLedgerService.updateEnergy({
      tokenId,
      source,
      delta,
      crossLearnConnections,
      patternDiscoveries
    });

    res.json({
      success: true,
      energy: result
    });
  } catch (error) {
    console.error('Energy update error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update energy' 
    });
  }
});

router.post('/:tokenId/transfer', async (req: Request, res: Response) => {
  try {
    if (!requireMintAuth(req, res)) return;
    const { tokenId } = req.params;
    const { toOwner, fromOwner, initiatorSignature } = req.body;

    if (!toOwner) {
      return res.status(400).json({ 
        success: false, 
        error: 'toOwner is required' 
      });
    }

    const result = await tokenLedgerService.transferToken({
      tokenId,
      toOwner,
      fromOwner,
      initiatorSignature
    });

    res.json({
      success: true,
      transfer: result
    });
  } catch (error) {
    console.error('Token transfer error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to transfer token' 
    });
  }
});

router.get('/shape/:shapeType', async (req: Request, res: Response) => {
  try {
    const { shapeType } = req.params;
    const tokens = await tokenLedgerService.getTokensByShape(shapeType);

    res.json({
      success: true,
      tokens,
      count: tokens.length,
      shapeType
    });
  } catch (error) {
    console.error('Shape tokens error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch tokens by shape' 
    });
  }
});

// STOCKPILE ENDPOINT - Save batch of tokens from frontend
router.post('/stockpile', async (req: Request, res: Response) => {
  try {
    if (!requireMintAuth(req, res)) return;
    const { tokens } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ 
        success: false, 
        error: 'tokens array is required' 
      });
    }

    if (tokens.length > MAX_STOCKPILE_BATCH) {
      return res.status(400).json({ success: false, error: `Batch too large: max ${MAX_STOCKPILE_BATCH} tokens per request` });
    }

    console.log(`📦 Processing stockpile: ${tokens.length} tokens`);

    // Mint each token in the batch with complete physics data
    const results = [];
    const errors = [];

    for (const token of tokens) {
      try {
        // Extract shape type from tokenId or use shape context
        const shapeType = token.tokenId?.split('-')[1]?.toLowerCase() || 
                         token.shapeContext?.toLowerCase() || 
                         'interaction_generated';

        // Parse physics data properly
        const physicsData = token.physicsData || {};
        const parameters = {
          a: physicsData.a || token.a || 1,
          b: physicsData.b || token.b || 1, 
          c: physicsData.c || token.c || 1,
          d: physicsData.d || token.d || 0,
          // Include all physics parameters
          ...physicsData.parameters
        };

        const minted = await tokenLedgerService.mintToken({
          shapeType: shapeType,
          tokenName: token.tokenId || `UUON-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
          parameters: parameters,
          baseEnergy: token.energyValue || 0,
          equationSnapshot: JSON.stringify({
            physicsData: physicsData,
            shapeContext: token.shapeContext,
            interactionType: token.interactionType,
            timestamp: token.timestamp,
            originalToken: token
          }),
          mathematicalProperties: {
            externalValue: token.externalValue || 0,
            rwaValue: token.rwaValue || 0,
            utility: token.utility || 'visualization',
            batchId: token.batchId || `batch-${Date.now()}`,
            interactionSource: token.source || 'frontend',
            shapeParameters: parameters
          }
        });

        results.push({
          tokenId: minted.tokenId,
          originalTokenId: token.tokenId,
          saved: true
        });

      } catch (e) {
        console.error('Failed to mint token:', token.tokenId, e);
        errors.push({
          tokenId: token.tokenId,
          error: e instanceof Error ? e.message : 'Unknown error'
        });
      }
    }

    console.log(`📦 Stockpile Results: ${results.length} saved, ${errors.length} errors`);
    if (errors.length > 0) {
      console.log('❌ Errors:', errors);
    }

    res.json({
      success: true,
      saved: results.length,
      total: tokens.length,
      errors: errors.length,
      results: results,
      schemaCompatible: true,
      uuonEconomyActive: true,
      message: `Saved ${results.length}/${tokens.length} tokens to UUON Token Economy database`
    });

  } catch (error) {
    console.error('Stockpile save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save stockpile' 
    });
  }
});

// VERIFICATION LEDGER: Compare frontend count with database reality
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { frontendCount, frontendTokenIds } = req.body;

    // Get database count
    const stats = await tokenLedgerService.getSystemStats();
    const dbCount = stats.totalTokens || 0;

    // Calculate discrepancy
    const discrepancy = Math.abs(frontendCount - dbCount);
    const syncStatus = discrepancy === 0 ? 'synced' : (discrepancy < 100 ? 'minor_drift' : 'recovery_needed');

    const verificationResult = {
      frontendCount,
      databaseCount: dbCount,
      discrepancy,
      syncStatus,
      timestamp: Date.now(),
      recommendation: syncStatus === 'recovery_needed' 
        ? 'Trigger stockpile recovery - large discrepancy detected'
        : syncStatus === 'minor_drift'
        ? 'Monitor closely - minor drift detected'
        : 'System synchronized - no action needed'
    };

    console.log(`🔍 Token Verification: Frontend=${frontendCount}, DB=${dbCount}, Status=${syncStatus}`);

    res.json({
      success: true,
      verification: verificationResult
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to verify token counts' 
    });
  }
});

// Stockpile endpoint - saves tokens from frontend to database
router.post('/stockpile-legacy-deprecated', async (req: Request, res: Response) => {
  try {
    return res.status(410).json({ success: false, error: 'Deprecated duplicate endpoint — removed from active routing' });
    const { tokens, energy, batchId } = req.body;

    if (!tokens || !Array.isArray(tokens)) {
      return res.status(400).json({ 
        success: false, 
        error: 'tokens array is required' 
      });
    }

    console.log(`📦 Stockpile save request: ${tokens.length} tokens, ${energy || 0} energy`);

    // Save each token to the database
    let savedCount = 0;
    for (const token of tokens) {
      try {
        await tokenLedgerService.mintToken({
          shapeType: token.shapeType || token.shapeId || 'stockpile_token',
          tokenName: token.tokenName || token.id || `Token-${Date.now()}`,
          parameters: token.parameters || { a: 1, b: 1, c: 1 },
          baseEnergy: token.energy || token.baseEnergy || 1,
          equationSnapshot: token.equationSnapshot,
          mathematicalProperties: token.mathematicalProperties
        });
        savedCount++;
      } catch (tokenError) {
        console.warn(`Failed to save token ${token.id}:`, tokenError);
      }
    }

    console.log(`✅ Saved ${savedCount}/${tokens.length} tokens to database`);

    res.json({
      success: true,
      savedCount,
      totalSubmitted: tokens.length,
      batchId,
      message: `Successfully saved ${savedCount} tokens to stockpile`
    });
  } catch (error) {
    console.error('Stockpile save error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save tokens to stockpile' 
    });
  }
});

// GET stockpile - retrieve stockpile status
router.get('/stockpile', async (req: Request, res: Response) => {
  try {
    const stats = await tokenLedgerService.getSystemStats();

    res.json({
      success: true,
      stockpile: {
        totalTokens: stats.totalTokens || 0,
        totalEnergy: stats.totalEnergy || 0,
        lastUpdated: Date.now()
      }
    });
  } catch (error) {
    console.error('Stockpile fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stockpile' 
    });
  }
});

export default router;