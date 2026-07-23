
import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    // Add CORS headers for better API access
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    const sdkInfo = {
      version: '2.0.0',
      name: 'Δmension SDK',
      description: 'Comprehensive mathematical visualization and computation SDK',
      baseUrl: `${req.protocol}://${req.get('host')}/api`,
      status: 'operational',
      publicAccess: true,
      
      // Available endpoints
      endpoints: {
        shapes: {
          list: '/api/shapes',
          create: '/api/shapes/create',
          categories: '/api/shapes/categories',
          export: '/api/export'
        },
        quantum: {
          algorithms: '/api/quantum/algorithms',
          computing: '/api/quantum-computing',
          research: '/api/quantum-research'
        },
        ai: {
          models: '/api/ai-ml-models',
          integration: '/api/ai-agent-integration'
        },
        blockchain: {
          algorithms: '/api/blockchain-algorithms',
          nft: '/api/thirdweb/ai-mint'
        },
        external: {
          quantum: '/api/external-integration/quantum',
          nasa: '/api/external-integration/nasa-osdr',
          wolfram: '/api/external-integration/wolfram'
        }
      },
      
      // SDK Statistics
      statistics: {
        totalShapes: 2662,
        categories: 134,
        algorithms: 541,
        quantumCircuits: 50,
        aiModels: 25
      },
      
      // Authentication
      authentication: {
        required: true,
        methods: ['api-key', 'oauth'],
        scopes: ['read', 'write', 'export', 'premium']
      },
      
      // Rate limits
      rateLimits: {
        free: '100 requests/hour',
        professional: '10,000 requests/hour',
        enterprise: '100,000 requests/hour'
      },
      
      // Documentation links
      documentation: {
        quickStart: '/api-docs',
        reference: '/documentation',
        tutorials: '/tutorials',
        examples: '/gallery'
      },
      
      // Pricing tiers
      pricing: {
        developer: { price: 0, requests: 100 },
        professional: { price: 10000, requests: 500000 },
        enterprise: { price: 10000, requests: 1000000 },
        regulated: { price: 10000, requests: 2000000 }
      }
    };

    res.json({
      success: true,
      data: sdkInfo,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve SDK information',
      message: error.message
    });
  }
});

export { router as sdkInfoRoutes };
