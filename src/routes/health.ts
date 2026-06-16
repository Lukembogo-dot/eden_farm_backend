import { Router } from 'express';
import {
  getHealthEvents,
  getHealthEventById,
  createHealthEvent,
  upsertHealthEvent,
  deleteHealthEvent
} from '../controllers/healthController';

const router = Router();

router.get('/', getHealthEvents);
router.get('/:id', getHealthEventById);
router.post('/', createHealthEvent);
router.put('/:id', upsertHealthEvent);
router.delete('/:id', deleteHealthEvent);

export default router;