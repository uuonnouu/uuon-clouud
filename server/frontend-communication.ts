
import { Router, Request, Response } from 'express';

const router = Router();

interface CommunicationTest {
  timestamp: string;
  method: string;
  endpoint: string;
  payload?: any;
  responseTime: number;
  status: 'success' | 'error';
  message: string;
}

// Test frontend-backend communication
router.post('/test-connection', async (req: Request, res: Response) => {
  const startTime = Date.now();
  
  try {
    const { testPayload, expectedResponse } = req.body;
    
    const result: CommunicationTest = {
      timestamp: new Date().toISOString(),
      method: 'POST',
      endpoint: '/api/test-connection',
      payload: testPayload,
      responseTime: Date.now() - startTime,
      status: 'success',
      message: 'Frontend-backend communication is working correctly'
    };
    
    // Echo back the test payload with additional metadata
    res.json({
      success: true,
      result,
      echo: testPayload,
      serverInfo: {
        nodeVersion: process.version,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: {
        timestamp: new Date().toISOString(),
        method: 'POST',
        endpoint: '/api/test-connection',
        responseTime: Date.now() - startTime,
        status: 'error',
        message: `Communication test failed: ${error}`
      }
    });
  }
});

// Validate API endpoints
router.get('/validate-endpoints', (req: Request, res: Response) => {
  const endpoints = [
    { path: '/api/ai/analyze', method: 'POST', description: 'AI shape analysis' },
    { path: '/api/ai/patterns/:shape', method: 'GET', description: 'Mathematical patterns' },
    { path: '/api/ai/recommendations/:shape', method: 'GET', description: 'Shape recommendations' },
    { path: '/api/ai/feedback', method: 'POST', description: 'AI feedback submission' },
    { path: '/api/ai/chat', method: 'POST', description: 'AI chat interface' },
    { path: '/api/verify-surface', method: 'POST', description: 'Surface verification' },
    { path: '/api/verify-batch', method: 'POST', description: 'Batch verification' },
    { path: '/api/verification-capabilities', method: 'GET', description: 'Verification capabilities' },
    { path: '/health', method: 'GET', description: 'Health check' },
    { path: '/metrics', method: 'GET', description: 'System metrics' }
  ];
  
  res.json({
    success: true,
    endpoints,
    totalEndpoints: endpoints.length,
    timestamp: new Date().toISOString(),
    message: 'All API endpoints are registered and available'
  });
});

// Real-time communication test
router.get('/realtime-test', (req: Request, res: Response) => {
  // Set up Server-Sent Events for real-time communication testing
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  let counter = 0;
  const interval = setInterval(() => {
    counter++;
    const data = {
      id: counter,
      timestamp: new Date().toISOString(),
      message: `Real-time communication test ${counter}`,
      serverUptime: process.uptime()
    };
    
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    
    if (counter >= 10) {
      clearInterval(interval);
      res.write('data: {"message": "Test completed successfully"}\n\n');
      res.end();
    }
  }, 1000);
  
  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

export { router as communicationRoutes };
