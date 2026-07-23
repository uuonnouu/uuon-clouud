import { Router, Request, Response } from 'express';
import { mathematicalProofEngine } from '../mathematical-proof-engine';
import { CertificateStorageManager } from '../certificate-storage-manager';

const router = Router();

// Endpoint to initiate a mathematical proof
router.post('/prove', async (req: Request, res: Response) => {
  try {
    const { shapes } = req.body;

    if (!shapes || !Array.isArray(shapes) || shapes.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input: "shapes" array is required and must not be empty.'
      });
    }

    // Validate input shapes here if necessary

    const { proofCertificate, proofReport } = await mathematicalProofEngine(shapes);

    // Store the certificate using the new manager
    const storedCertificate = await CertificateStorageManager.saveCertificate(proofCertificate, proofReport);

    res.json({
      success: true,
      message: 'Proof generated successfully!',
      certificate: {
        id: storedCertificate.id,
        timestamp: storedCertificate.timestamp,
        averageScore: storedCertificate.averageScore,
        totalShapes: storedCertificate.totalShapes,
      },
      report: proofReport,
    });
  } catch (error: any) {
    console.error('Error during proof generation:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during proof generation.',
      error: error.message,
    });
  }
});

// Get all certificates
router.get('/certificates', async (req: Request, res: Response) => {
  try {
    const certificates = await CertificateStorageManager.getAllCertificates();

    res.json({
      success: true,
      certificates: certificates.map(cert => ({
        id: cert.id,
        timestamp: cert.timestamp,
        averageScore: cert.averageScore,
        totalShapes: cert.totalShapes
      })),
      count: certificates.length
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific certificate
router.get('/certificates/:certId', async (req: Request, res: Response) => {
  try {
    const { certId } = req.params;
    const certificate = await CertificateStorageManager.getCertificate(certId);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      certificate
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get certificate storage stats
router.get('/certificates/stats', async (req: Request, res: Response) => {
  try {
    const stats = await CertificateStorageManager.getCertificateStats();

    res.json({
      success: true,
      stats
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


export default router;