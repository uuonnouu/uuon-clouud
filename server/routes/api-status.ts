
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  res.json({
    success: true,
    status: 'operational',
    message: 'Δmension API is accessible and responding',
    timestamp: new Date().toISOString(),
    endpoints: {

      apiInfo: '/api/sdk-info',
      shapes: '/api/shapes',
      health: '/api/health'
    },
    publicAccess: true
  });
});

export { router as apiStatusRoutes };
