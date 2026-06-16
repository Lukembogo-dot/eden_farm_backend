import { Router } from 'express';
import { getAnimals, getAnimalById, createAnimal, updateAnimal, deleteAnimal, upsertAnimal } from '../controllers/animalsController';

const router = Router();

router.get('/', getAnimals);
router.get('/:id', getAnimalById);
router.post('/', createAnimal);
router.patch('/:id', updateAnimal);
router.put('/:id', upsertAnimal);
router.delete('/:id', deleteAnimal);

export default router;