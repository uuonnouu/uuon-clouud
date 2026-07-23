
import { Router, Request, Response } from 'express';
import { mathematicalProofEngine } from './mathematical-proof-engine';

const router = Router();

// Run comprehensive proof tests
router.post('/run-proof-tests', async (req: Request, res: Response) => {
  try {
    console.log('🔬 Starting mathematical proof testing...');
    const report = await mathematicalProofEngine.runComprehensiveProofTests();
    
    res.json({
      success: true,
      report,
      message: 'Mathematical proof testing completed successfully'
    });
  } catch (error: any) {
    console.error('Proof testing failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Mathematical proof testing failed'
    });
  }
});

// Get proof certificate
router.post('/generate-certificate', async (req: Request, res: Response) => {
  try {
    const { report } = req.body;
    
    if (!report) {
      return res.status(400).json({
        success: false,
        message: 'Proof report required'
      });
    }
    
    const certificate = await mathematicalProofEngine.exportProofCertificate(report);
    
    res.json({
      success: true,
      certificate,
      message: 'Proof certificate generated successfully'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Certificate generation failed'
    });
  }
});

// Test specific shape
router.post('/test-shape/:shapeId', async (req: Request, res: Response) => {
  try {
    const { shapeId } = req.params;
    const { testType } = req.body;
    
    // This would test a specific shape with specific test type
    res.json({
      success: true,
      message: `Testing ${shapeId} with ${testType || 'all'} tests`,
      shapeId
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
