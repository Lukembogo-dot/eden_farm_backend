import { Router } from 'express';
import { getAlerts, resolveAlert } from '../controllers/alertsController';

const router = Router();

router.get('/', getAlerts);
router.patch('/:id/resolve', resolveAlert);

export default router;