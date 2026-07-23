
import { Router, Request, Response } from 'express';
import { pinataService } from '../services/pinataService';
import { wolframAlphaService } from '../services/wolframAlphaService';

const router = Router();

interface APIStatus {
  name: string;
  configured: boolean;
  tested: boolean;
  working: boolean;
  error?: string;
  requiredSecrets: string[];
  missingSecrets: string[];
}

// Comprehensive API Status Check
router.get('/status', async (req: Request, res: Response) => {
  console.log('🔍 Running comprehensive API connectivity check...');
  
  const results: APIStatus[] = [];

  // 1. DATABASE CONNECTION
  const databaseStatus: APIStatus = {
    name: 'Database (NeonDB)',
    configured: !!process.env.DATABASE_URL,
    tested: false,
    working: false,
    requiredSecrets: ['DATABASE_URL'],
    missingSecrets: []
  };

  if (!process.env.DATABASE_URL) {
    databaseStatus.missingSecrets.push('DATABASE_URL');
    databaseStatus.error = 'DATABASE_URL not configured';
  } else {
    try {
      // Test database connection
      const { neon } = require('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL);
      await sql`SELECT 1`;
      databaseStatus.tested = true;
      databaseStatus.working = true;
    } catch (error: any) {
      databaseStatus.tested = true;
      databaseStatus.error = error.message;
    }
  }
  results.push(databaseStatus);

  // 2. IBM QUANTUM
  const ibmQuantumStatus: APIStatus = {
    name: 'IBM Quantum',
    configured: !!(process.env.IBM_QUANTUM_TOKEN && process.env.IBM_QUANTUM_CRN),
    tested: false,
    working: false,
    requiredSecrets: ['IBM_QUANTUM_TOKEN', 'IBM_QUANTUM_CRN'],
    missingSecrets: []
  };

  if (!process.env.IBM_QUANTUM_TOKEN) ibmQuantumStatus.missingSecrets.push('IBM_QUANTUM_TOKEN');
  if (!process.env.IBM_QUANTUM_CRN) ibmQuantumStatus.missingSecrets.push('IBM_QUANTUM_CRN');

  if (ibmQuantumStatus.configured) {
    try {
      const response = await fetch('https://api.quantum-computing.ibm.com/runtime/backends', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.IBM_QUANTUM_TOKEN}`,
          'Service-CRN': process.env.IBM_QUANTUM_CRN!
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });
      
      ibmQuantumStatus.tested = true;
      if (response.ok) {
        ibmQuantumStatus.working = true;
      } else {
        ibmQuantumStatus.error = `HTTP ${response.status}: ${response.statusText}`;
      }
    } catch (error: any) {
      ibmQuantumStatus.tested = true;
      ibmQuantumStatus.error = error.message;
    }
  } else {
    ibmQuantumStatus.error = 'Missing required secrets';
  }
  results.push(ibmQuantumStatus);

  // 3. PINATA IPFS
  const pinataStatus: APIStatus = {
    name: 'Pinata IPFS',
    configured: pinataService.isConfigured(),
    tested: false,
    working: false,
    requiredSecrets: ['PINATA_API_KEY', 'PINATA_SECRET_API_KEY', 'PINATA_JWT'],
    missingSecrets: []
  };

  if (!process.env.PINATA_API_KEY) pinataStatus.missingSecrets.push('PINATA_API_KEY');
  if (!process.env.PINATA_SECRET_API_KEY) pinataStatus.missingSecrets.push('PINATA_SECRET_API_KEY');
  if (!process.env.PINATA_JWT) pinataStatus.missingSecrets.push('PINATA_JWT');

  if (pinataStatus.configured) {
    try {
      const isWorking = await pinataService.testAuthentication();
      pinataStatus.tested = true;
      pinataStatus.working = isWorking;
      if (!isWorking) {
        pinataStatus.error = 'Authentication failed - check API credentials';
      }
    } catch (error: any) {
      pinataStatus.tested = true;
      pinataStatus.error = error.message;
    }
  } else {
    pinataStatus.error = 'Missing required secrets';
  }
  results.push(pinataStatus);

  // 4. WOLFRAM ALPHA
  const wolframStatus: APIStatus = {
    name: 'Wolfram Alpha',
    configured: wolframAlphaService.isConfigured(),
    tested: false,
    working: false,
    requiredSecrets: ['WOLFRAM_ALPHA_APP_ID'],
    missingSecrets: []
  };

  if (!process.env.WOLFRAM_ALPHA_APP_ID) wolframStatus.missingSecrets.push('WOLFRAM_ALPHA_APP_ID');

  if (wolframStatus.configured) {
    try {
      const result = await wolframAlphaService.query('2+2');
      wolframStatus.tested = true;
      wolframStatus.working = result.success;
      if (!result.success) {
        wolframStatus.error = result.error || 'Query failed';
      }
    } catch (error: any) {
      wolframStatus.tested = true;
      wolframStatus.error = error.message;
    }
  } else {
    wolframStatus.error = 'Missing WOLFRAM_ALPHA_APP_ID';
  }
  results.push(wolframStatus);

  // 5. THIRDWEB
  const thirdwebStatus: APIStatus = {
    name: 'Thirdweb NFT',
    configured: !!(process.env.THIRDWEB_CLIENT_ID && process.env.THIRDWEB_SECRET_KEY),
    tested: false,
    working: false,
    requiredSecrets: ['THIRDWEB_CLIENT_ID', 'THIRDWEB_SECRET_KEY'],
    missingSecrets: []
  };

  if (!process.env.THIRDWEB_CLIENT_ID) thirdwebStatus.missingSecrets.push('THIRDWEB_CLIENT_ID');
  if (!process.env.THIRDWEB_SECRET_KEY) thirdwebStatus.missingSecrets.push('THIRDWEB_SECRET_KEY');

  if (thirdwebStatus.configured) {
    try {
      const response = await fetch('https://api.thirdweb.com/v1/bridge/chains', {
        method: 'GET',
        headers: {
          'x-secret-key': process.env.THIRDWEB_SECRET_KEY!
        },
        signal: AbortSignal.timeout(10000)
      });
      
      thirdwebStatus.tested = true;
      if (response.ok) {
        thirdwebStatus.working = true;
      } else {
        const errorText = await response.text();
        thirdwebStatus.error = `HTTP ${response.status}: ${errorText.slice(0, 100)}`;
      }
    } catch (error: any) {
      thirdwebStatus.tested = true;
      thirdwebStatus.error = error.message;
    }
  } else {
    thirdwebStatus.error = 'Missing required secrets';
  }
  results.push(thirdwebStatus);

  // Calculate summary statistics
  const totalAPIs = results.length;
  const configuredAPIs = results.filter(api => api.configured).length;
  const workingAPIs = results.filter(api => api.working).length;
  const criticalIssues = results.filter(api => api.missingSecrets.length > 0).length;

  console.log(`✅ API Status Check Complete: ${workingAPIs}/${totalAPIs} working, ${criticalIssues} critical issues`);

  res.json({
    success: true,
    summary: {
      totalAPIs,
      configuredAPIs,
      workingAPIs,
      criticalIssues,
      overallHealth: workingAPIs / totalAPIs
    },
    apis: results,
    recommendations: generateRecommendations(results),
    timestamp: new Date().toISOString()
  });
});

// Quick fix endpoint
router.post('/quick-fix', async (req: Request, res: Response) => {
  const { apis } = req.body;
  const fixResults = [];

  console.log('🔧 Running quick fix for API issues...');

  for (const apiName of apis) {
    try {
      switch (apiName) {
        case 'Database (NeonDB)':
          if (!process.env.DATABASE_URL) {
            fixResults.push({
              api: apiName,
              action: 'Please add DATABASE_URL to Secrets tab',
              status: 'manual_required'
            });
          }
          break;

        case 'IBM Quantum':
          if (!process.env.IBM_QUANTUM_TOKEN || !process.env.IBM_QUANTUM_CRN) {
            fixResults.push({
              api: apiName,
              action: 'Add IBM_QUANTUM_TOKEN and IBM_QUANTUM_CRN to Secrets',
              status: 'manual_required',
              note: 'Sign up at https://quantum.ibm.com/ for free access'
            });
          }
          break;

        case 'Pinata IPFS':
          if (!process.env.PINATA_JWT) {
            fixResults.push({
              api: apiName,
              action: 'Add PINATA_JWT to Secrets tab',
              status: 'manual_required',
              note: 'Get JWT from https://app.pinata.cloud/developers/api-keys'
            });
          }
          break;

        case 'Wolfram Alpha':
          if (!process.env.WOLFRAM_ALPHA_APP_ID) {
            fixResults.push({
              api: apiName,
              action: 'Add WOLFRAM_ALPHA_APP_ID to Secrets',
              status: 'manual_required',
              note: 'Get free App ID from https://products.wolframalpha.com/api/'
            });
          }
          break;

        case 'Thirdweb NFT':
          if (!process.env.THIRDWEB_CLIENT_ID || !process.env.THIRDWEB_SECRET_KEY) {
            fixResults.push({
              api: apiName,
              action: 'Add THIRDWEB_CLIENT_ID and THIRDWEB_SECRET_KEY to Secrets',
              status: 'manual_required',
              note: 'Get keys from https://thirdweb.com/dashboard'
            });
          }
          break;
      }
    } catch (error: any) {
      fixResults.push({
        api: apiName,
        action: 'Fix failed',
        status: 'error',
        error: error.message
      });
    }
  }

  res.json({
    success: true,
    fixes: fixResults,
    message: 'Quick fix analysis complete. Most issues require manual secret configuration.'
  });
});

function generateRecommendations(results: APIStatus[]): string[] {
  const recommendations = [];
  const criticalAPIs = results.filter(api => !api.working && api.missingSecrets.length > 0);

  if (criticalAPIs.length > 0) {
    recommendations.push('🚨 CRITICAL: Add missing API keys to Secrets tab in Replit');
    
    for (const api of criticalAPIs) {
      if (api.missingSecrets.length > 0) {
        recommendations.push(`   • ${api.name}: Add ${api.missingSecrets.join(', ')}`);
      }
    }
  }

  const workingCount = results.filter(api => api.working).length;
  const totalCount = results.length;
  
  if (workingCount === totalCount) {
    recommendations.push('✅ ALL SYSTEMS OPERATIONAL - No action needed');
  } else if (workingCount >= totalCount * 0.8) {
    recommendations.push('⚡ MOSTLY OPERATIONAL - Minor fixes needed');
  } else if (workingCount >= totalCount * 0.5) {
    recommendations.push('⚠️ DEGRADED SERVICE - Multiple API issues detected');
  } else {
    recommendations.push('🔥 CRITICAL SYSTEM ISSUES - Immediate attention required');
  }

  return recommendations;
}

export default router;
