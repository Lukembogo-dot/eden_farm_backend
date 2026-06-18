import { Router } from 'express';
import {
  getBreedingRecords,
  getBreedingRecordById,
  createBreedingRecord,
  updateBreedingRecord,
  deleteBreedingRecord,
  upsertBreedingRecord,
} from '../controllers/breedingController';

const router = Router();

router.get('/', getBreedingRecords);
router.get('/:id', getBreedingRecordById);
router.post('/', createBreedingRecord);
router.patch('/:id', updateBreedingRecord);
router.put('/:id', upsertBreedingRecord);
router.delete('/:id', deleteBreedingRecord);

export default router;
