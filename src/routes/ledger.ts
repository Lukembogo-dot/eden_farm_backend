import { Router } from 'express';
import { getLedger, getLedgerSummary, createLedgerEntry, deleteLedgerEntry } from '../controllers/ledgerController';

const router = Router();

router.get('/', getLedger);
router.get('/summary', getLedgerSummary);
router.post('/', createLedgerEntry);
router.delete('/:id', deleteLedgerEntry);

export default router;