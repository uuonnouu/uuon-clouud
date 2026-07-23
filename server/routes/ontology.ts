/**
 * GLOBAL VARIABLE ONTOLOGY API ROUTES
 * Unified symbol translation layer for cross-domain mathematical formula compatibility
 * 
 * @author UUON Foundation
 * @system Dmension Mathematical Universe
 */

import { Router, Request, Response } from 'express';
import { globalVariableOntology, GLOBAL_VARIABLE_ONTOLOGY, DOMAIN_MAPPINGS } from '../global-variable-ontology';

const router = Router();

router.get('/variables', (req: Request, res: Response) => {
  try {
    const variables = Object.entries(GLOBAL_VARIABLE_ONTOLOGY).map(([key, def]) => ({
      id: key,
      canonical: def.canonical,
      aliases: def.aliases,
      domains: def.domain,
      dataType: def.dataType,
      range: def.range,
      semanticMeaning: def.semanticMeaning,
      physicalInterpretations: def.physicalInterpretation
    }));

    res.json({
      success: true,
      count: variables.length,
      variables
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve ontology variables' });
  }
});

router.get('/domains', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      count: DOMAIN_MAPPINGS.length,
      domains: DOMAIN_MAPPINGS
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to retrieve domain mappings' });
  }
});

router.post('/translate', (req: Request, res: Response) => {
  try {
    const { symbol, fromDomain, toDomain } = req.body;

    if (!symbol || !fromDomain || !toDomain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: symbol, fromDomain, toDomain' 
      });
    }

    const result = globalVariableOntology.translateVariable(symbol, fromDomain, toDomain);

    res.json({
      success: true,
      translation: result
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Translation failed' });
  }
});

router.post('/validate-formula', (req: Request, res: Response) => {
  try {
    const { formula, sourceDomain, targetDomain } = req.body;

    if (!formula || !sourceDomain || !targetDomain) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: formula, sourceDomain, targetDomain' 
      });
    }

    const validation = globalVariableOntology.validateCrossdomainFormula(
      formula, sourceDomain, targetDomain
    );

    res.json({
      success: true,
      validation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Formula validation failed' });
  }
});

router.get('/unified-table', (req: Request, res: Response) => {
  try {
    const domains = (req.query.domains as string)?.split(',') || 
      ['thermal_engineering', 'quantum_physics', 'general_relativity', 'geometry'];

    const unifiedTable = globalVariableOntology.getUnifiedSymbolTable(domains);

    res.json({
      success: true,
      domains,
      symbolCount: Object.keys(unifiedTable).length,
      symbols: unifiedTable
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate unified table' });
  }
});

router.get('/report', (req: Request, res: Response) => {
  try {
    const report = globalVariableOntology.generateOntologyReport();

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to generate report' });
  }
});

router.get('/lookup/:symbol', (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const definition = globalVariableOntology.findVariableDefinition(symbol);

    if (!definition) {
      return res.status(404).json({ 
        success: false, 
        error: `Symbol '${symbol}' not found in ontology` 
      });
    }

    res.json({
      success: true,
      symbol,
      definition
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Lookup failed' });
  }
});

export default router;
