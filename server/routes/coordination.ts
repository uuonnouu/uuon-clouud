
import { Router, Request, Response } from 'express';
import { unifiedCommunicationCoordinator } from '../unified-communication-coordinator';

const router = Router();

// Main coordination endpoint
router.post('/coordinate', async (req: Request, res: Response) => {
  try {
    const { source, type, payload, priority = 'medium' } = req.body;

    const request = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      source,
      type,
      priority,
      payload,
      timestamp: new Date().toISOString()
    };

    const result = await unifiedCommunicationCoordinator.coordinateRequest(request);

    res.json({
      success: true,
      request,
      result,
      coordination: {
        approach: result.result?.processor || 'assistant',
        optimal: true,
        processing_time: '< 1s'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Coordination failed',
      recommendations: [
        'Check request parameters',
        'Ensure system is not overloaded',
        'Retry with different priority level'
      ]
    });
  }
});

// System status endpoint
router.get('/status', (req: Request, res: Response) => {
  const status = unifiedCommunicationCoordinator.getSystemStatus();
  res.json({
    success: true,
    status,
    recommendations: status.queueSize > 10 ? ['High queue size - consider load balancing'] : []
  });
});

export { router as coordinationRoutes };
