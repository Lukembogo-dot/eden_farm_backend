import { Router } from 'express';
import { feedsController } from '../controllers/feeds.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(feedsController.getAll));
router.post('/purchase', asyncHandler(feedsController.purchase));
router.patch('/:id/consume', asyncHandler(feedsController.consume));

export default router;