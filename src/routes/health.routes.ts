import { Router } from 'express';
import { healthController } from '../controllers/health.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(healthController.getAll));
router.post('/', asyncHandler(healthController.create));

export default router;