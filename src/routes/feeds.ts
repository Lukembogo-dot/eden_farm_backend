import { Router } from 'express';
import { getFeedStock, createFeedStock, restockFeed } from '../controllers/feedsController';

const router = Router();

router.get('/', getFeedStock);
router.post('/', createFeedStock);
router.patch('/:id/restock', restockFeed);

export default router;