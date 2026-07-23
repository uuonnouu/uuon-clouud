/**
 * DOMAIN WEIGHTING SYSTEM API ROUTES
 * Truth weighting for formula significance across domains
 * 
 * @author UUON Foundation
 * @system Dmension Mathematical Universe
 */

import { Router, Request, Response } from 'express';
import { 
  domainWeightingEngine, 
  DOMAIN_WEIGHT_PROFILES, 
  CATEGORY_BASE_WEIGHTS, 
  FORMULA_TRUTH_REGISTRY 
} from '../domain-weighting-system';

const router = Router();

router.get('/profiles', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: Object.keys(DOMAIN_WEIGHT_PROFILES).length,
      profiles: DOMAIN_WEIGHT_PROFILES
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve weight profiles' });
  }
});

router.get('/categories', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      categories: CATEGORY_BASE_WEIGHTS
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve categories' });
  }
});

router.get('/registry', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: Object.keys(FORMULA_TRUTH_REGISTRY).length,
      formulas: FORMULA_TRUTH_REGISTRY
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve formula registry' });
  }
});

router.post('/calculate', (req: Request, res: Response) => {
  try {
    const { formulaId, targetDomain, overrideCategory } = req.body;

    if (!formulaId || !targetDomain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: formulaId, targetDomain' 
      });
    }

    const weight = domainWeightingEngine.calculateFormulaWeight(
      formulaId, 
      targetDomain, 
      overrideCategory
    );

    res.json({
      success: true,
      weight
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Weight calculation failed' });
  }
});

router.post('/rank', (req: Request, res: Response) => {
  try {
    const { formulaIds, domain } = req.body;

    if (!formulaIds || !domain || !Array.isArray(formulaIds)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: formulaIds (array), domain' 
      });
    }

    const rankings = domainWeightingEngine.rankFormulasForDomain(formulaIds, domain);

    res.json({
      success: true,
      domain,
      rankings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Ranking failed' });
  }
});

router.post('/fusion-score', (req: Request, res: Response) => {
  try {
    const { formula1Id, formula2Id, domain } = req.body;

    if (!formula1Id || !formula2Id || !domain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: formula1Id, formula2Id, domain' 
      });
    }

    const fusionScore = domainWeightingEngine.getFusionTruthScore(
      formula1Id, 
      formula2Id, 
      domain
    );

    res.json({
      success: true,
      fusionScore
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Fusion score calculation failed' });
  }
});

router.post('/register', (req: Request, res: Response) => {
  try {
    const { formulaId, category, justification, citations } = req.body;

    if (!formulaId || !category || !justification) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: formulaId, category, justification' 
      });
    }

    domainWeightingEngine.registerFormula(
      formulaId, 
      category, 
      justification, 
      citations || []
    );

    res.json({
      success: true,
      message: `Formula '${formulaId}' registered successfully`
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

router.get('/report/:domain', (req: Request, res: Response) => {
  try {
    const { domain } = req.params;
    const report = domainWeightingEngine.generateWeightingReport(domain);

    res.json({
      success: true,
      domain,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Report generation failed' });
  }
});

router.get('/statistics', (req: Request, res: Response) => {
  try {
    const stats = domainWeightingEngine.getStatistics();

    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve statistics' });
  }
});

export default router;
