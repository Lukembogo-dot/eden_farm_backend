import { Router } from 'express';
import { getSales, createSale, upsertSale } from '../controllers/salesController';

const router = Router();

router.get('/', getSales);
router.post('/', createSale);
router.put('/:id', upsertSale);

export default router;