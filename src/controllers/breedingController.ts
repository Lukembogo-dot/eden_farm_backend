import { Request, Response, NextFunction } from 'express';
import { breedingRepository } from '../repositories/breedingRepository';
import { animalsRepository } from '../repositories/animalsRepository';
import { BreedingRecord } from '../types/breeding';

const validateSowExists = async (sow_id: string) => {
  const { data, error } = await animalsRepository.getById(sow_id);
  if (error) return { exists: false, error };
  return { exists: Boolean(data), error: null };
};

// GET /api/breeding-records
export const getBreedingRecords = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await breedingRepository.getAll();
    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/breeding-records/:id
export const getBreedingRecordById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { data, error } = await breedingRepository.getById(id);
    if (error) throw error;
    if (!data) {
      res.status(404).json({ success: false, error: 'Breeding record not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/breeding-records
export const createBreedingRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      sow_id,
      method,
      mating_date,
      expected_farrow_date,
      actual_farrow_date,
      litter_size,
      male_count,
      female_count,
      stillborn_count,
      status,
      notes,
    } = req.body as BreedingRecord;

    if (!sow_id) {
      res.status(400).json({ success: false, error: 'sow_id is required' });
      return;
    }

    const sowCheck = await validateSowExists(sow_id);
    if (sowCheck.error) throw sowCheck.error;
    if (!sowCheck.exists) {
      res.status(400).json({ success: false, error: 'sow_id must refer to an existing animal' });
      return;
    }

    const { data, error } = await breedingRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      sow_id,
      method,
      mating_date,
      expected_farrow_date,
      actual_farrow_date,
      litter_size,
      male_count,
      female_count,
      stillborn_count,
      status,
      notes,
    } as BreedingRecord);

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/breeding-records/:id
export const updateBreedingRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updates = req.body as Partial<BreedingRecord>;

    const { data, error } = await breedingRepository.update(id, updates);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/breeding-records/:id
export const deleteBreedingRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { error } = await breedingRepository.delete(id);
    if (error) throw error;
    res.json({ success: true, message: 'Breeding record deleted' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/breeding-records/:id
export const upsertBreedingRecord = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const input = req.body as Partial<BreedingRecord>;

    if (input.sow_id) {
      const sowCheck = await validateSowExists(input.sow_id);
      if (sowCheck.error) throw sowCheck.error;
      if (!sowCheck.exists) {
        res.status(400).json({ success: false, error: 'sow_id must refer to an existing animal' });
        return;
      }
    }

    const { data, error } = await breedingRepository.upsert(id, input);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
