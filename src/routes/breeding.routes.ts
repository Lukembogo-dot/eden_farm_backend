import { Router } from 'express';
import { breedingController } from '../controllers/breeding.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(breedingController.getAll));
router.post('/', asyncHandler(breedingController.create));
router.patch('/:id/confirm-pregnant', asyncHandler(breedingController.confirmPregnant));
router.post('/:id/farrow', asyncHandler(breedingController.recordFarrow));

export default router;