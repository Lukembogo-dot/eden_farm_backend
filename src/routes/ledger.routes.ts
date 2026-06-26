import { Router } from 'express';
import { ledgerController } from '../controllers/ledger.Controller';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', asyncHandler(ledgerController.getAll));
router.get('/summary', asyncHandler(ledgerController.getSummary));
router.post('/', asyncHandler(ledgerController.create));
router.delete('/:id', asyncHandler(ledgerController.delete));

export default router;