import { Router } from 'express';
import * as scamController from '../controllers/scamController.js';

const router = Router();

router.get('/health', scamController.healthCheck);
router.get('/scam-entities/search', scamController.searchScamEntities);
router.get('/scam-entities/:id', scamController.getEntityById);
router.get('/scam-entities/:id/graph', scamController.getInvestigationGraph);
router.get('/scam-entities/:id/overlaps', scamController.getSharedIndicatorOverlaps);

export default router;
