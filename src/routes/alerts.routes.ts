import { Router } from 'express';
import { alertsController } from '../controllers/alerts.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(alertsController.getAll));
router.patch('/:id/resolve', asyncHandler(alertsController.resolve));

export default router;