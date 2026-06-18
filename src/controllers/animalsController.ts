import { Request, Response, NextFunction } from 'express';
import { animalsRepository } from '../repositories/animalsRepository';
import { Animal } from '../types/animals';

// GET /api/animals
export const getAnimals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { species, status } = req.query;

    const { data, error } = await animalsRepository.getAll(
      typeof species === 'string' ? species : undefined,
      typeof status === 'string' ? status : undefined,
    );
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/animals/:id
export const getAnimalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { data, error } = await animalsRepository.getById(id);

    if (error) throw error;
    if (!data) { res.status(404).json({ success: false, error: 'Animal not found' }); return; }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/animals
export const createAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tag_id, species, breed, batch_id, date_acquired, age_at_acquisition, acquisition_cost, source, litter_size, birth_date, notes } = req.body as Animal;

    if (!species) {
      res.status(400).json({ success: false, error: 'species is required' });
      return;
    }

    const { data, error } = await animalsRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      tag_id,
      species,
      breed,
      batch_id,
      date_acquired,
      age_at_acquisition,
      acquisition_cost,
      source,
      litter_size,
      birth_date,
      notes,
    } as Animal);

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/animals/:id
export const updateAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body as Partial<Animal>;

    const { data, error } = await animalsRepository.update(id, updates);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/animals/:id
export const deleteAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { error } = await animalsRepository.delete(id);
    if (error) throw error;

    res.json({ success: true, message: 'Animal record deleted' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/animals/:id
export const upsertAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const input = req.body as Partial<Animal>;

    const { data, error } = await animalsRepository.upsert(id, input);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};