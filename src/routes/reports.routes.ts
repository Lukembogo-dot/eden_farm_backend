import { Router } from 'express';
import { reportsController } from '../controllers/reports.controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/profit-loss', asyncHandler(reportsController.getProfitLoss));
router.get('/trajectory', asyncHandler(reportsController.getTrajectory));

export default router;