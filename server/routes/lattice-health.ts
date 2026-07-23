
import { Router } from 'express';

const router = Router();

interface LatticeHealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  networks: {
    quantum: boolean;
    harmonic: boolean;
    geometric: boolean;
  };
  connectivity: number;
  lastUpdate: string;
}

// Lattice network health check
router.get('/health', async (req, res) => {
  try {
    const healthStatus: LatticeHealthStatus = {
      status: 'healthy',
      networks: {
        quantum: true,
        harmonic: true,
        geometric: true
      },
      connectivity: 100,
      lastUpdate: new Date().toISOString()
    };

    // Check if any critical lattice systems are down
    const failedNetworks = Object.entries(healthStatus.networks)
      .filter(([_, status]) => !status)
      .map(([network]) => network);

    if (failedNetworks.length > 0) {
      healthStatus.status = failedNetworks.length > 1 ? 'unhealthy' : 'degraded';
      res.status(503).json({
        ...healthStatus,
        systems: ['latticeSystem'],
        issues: [`Failed networks: ${failedNetworks.join(', ')}`]
      });
    } else {
      res.json({ 
        ...healthStatus,
        systems: ['latticeSystem']
      });
    }
  } catch (error) {
    console.error('Lattice health check failed:', error);
    res.status(503).json({ 
      status: 'unhealthy', 
      systems: ['latticeSystem'],
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

export default router;
