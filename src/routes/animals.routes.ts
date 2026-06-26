import { Router } from 'express';
import { animalsController } from '../controllers/animals.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(animalsController.getAll));
router.get('/:id', asyncHandler(animalsController.getById));
router.post('/', asyncHandler(animalsController.createPurchased));
router.patch('/:id', asyncHandler(animalsController.update));
router.delete('/:id', asyncHandler(animalsController.delete));
router.post('/:id/weight', asyncHandler(animalsController.addWeightLog));

export default router;