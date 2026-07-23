import { Router } from 'express';
import { apiKeyAuth } from '../../../middleware/apiKeyAuth';
import { provenanceHeaders } from '../middleware/provenance';
import {
  listShapes,
  getShapeMetadata,
  getShapeFormulas,
  getShapeTransforms,
} from '../controllers/shapes';

const router = Router();

// All NeRF API routes require a valid API key + UUON provenance headers
router.use(apiKeyAuth);
router.use(provenanceHeaders);

router.get('/',                    listShapes);
router.get('/:shapeId',            getShapeMetadata);
router.get('/:shapeId/formulas',   getShapeFormulas);
router.get('/:shapeId/transforms', getShapeTransforms);

// /weights and /ngp_config are intentionally omitted — internal-only tiers

export default router;
