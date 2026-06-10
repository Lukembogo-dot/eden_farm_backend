import { Router } from 'express';
import { getSales, createSale } from '../controllers/salesController';

const router = Router();

router.get('/', getSales);
router.post('/', createSale);

export default router;