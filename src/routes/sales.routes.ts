import { Router } from 'express';
import { salesController } from '../controllers/sales.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(salesController.getAll));
router.post('/', asyncHandler(salesController.create));

export default router;