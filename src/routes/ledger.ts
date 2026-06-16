import { Router } from 'express';
import { getLedger, getLedgerSummary, createLedgerEntry, deleteLedgerEntry, upsertLedgerEntry } from '../controllers/ledgerController';

const router = Router();

router.get('/', getLedger);
router.get('/summary', getLedgerSummary);
router.post('/', createLedgerEntry);
router.put('/:id', upsertLedgerEntry);
router.delete('/:id', deleteLedgerEntry);

export default router;