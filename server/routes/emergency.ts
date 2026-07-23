
import { Router, Request, Response } from 'express';
import { emergencyControls } from '../emergency-controls';
import { smartContractEscrow } from '../smart-contract-escrow';

const router = Router();

/**
 * Emergency pause endpoint - requires admin authentication
 */
router.post('/pause', (req: Request, res: Response) => {
  const { reason, adminKey, emergencyCode } = req.body;
  
  // Enhanced authentication - require both admin key and emergency code
  if (adminKey !== process.env.EMERGENCY_ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized emergency access' });
  }
  
  // Additional emergency code validation (in production, use multi-sig)
  if (emergencyCode !== process.env.EMERGENCY_CODE) {
    return res.status(401).json({ error: 'Invalid emergency authorization code' });
  }

  emergencyControls.emergencyPause(reason);
  
  // Log emergency action for audit trail (never log sensitive credentials)
  console.log(`🚨 EMERGENCY PAUSE ACTIVATED BY ADMIN`);
  console.log(`📝 Reason: ${reason}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log(`🔑 Admin authenticated: Yes`);
  
  res.json({
    success: true,
    message: 'Emergency pause activated - all operations stopped',
    timestamp: new Date().toISOString(),
    nextSteps: 'Contact system administrators for resolution'
  });
});

/**
 * Resume operations endpoint
 */
router.post('/resume', (req: Request, res: Response) => {
  const { adminKey, authorizedBy } = req.body;
  
  if (adminKey !== process.env.EMERGENCY_ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized emergency access' });
  }

  const resumed = emergencyControls.resumeOperations(authorizedBy);
  
  res.json({
    success: resumed,
    message: resumed ? 'Operations resumed' : 'System was not paused',
    timestamp: new Date().toISOString()
  });
});

/**
 * System health check
 */
router.get('/status', (req: Request, res: Response) => {
  const emergencyStatus = emergencyControls.getStatus();
  
  res.json({
    emergencyControls: emergencyStatus,
    timestamp: new Date().toISOString(),
    systemHealth: emergencyStatus.systemHealth
  });
});

export { router as emergencyRouter };
