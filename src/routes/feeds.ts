import { Router } from 'express';
import { getFeedStock, createFeedStock, restockFeed, upsertFeed } from '../controllers/feedsController';

const router = Router();

router.get('/', getFeedStock);
router.post('/', createFeedStock);
router.patch('/:id/restock', restockFeed);
router.put('/:id', upsertFeed);

export default router;