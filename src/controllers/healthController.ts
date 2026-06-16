import { Request, Response, NextFunction } from 'express';
import { healthRepository } from '../repositories/healthRepository';
import { HealthEvent } from '../types/health';

// GET /api/health-events
export const getHealthEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await healthRepository.getAll();
    if (error) throw error;
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/health-events/:id
export const getHealthEventById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { data, error } = await healthRepository.getById(id);
    if (error) throw error;
    if (!data) {
      res.status(404).json({ success: false, error: 'Health event not found' });
      return;
    }
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/health-events
export const createHealthEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { animal_id, batch_id, event_date, event_type, description, vet_name, cost, next_due_date, notes } = req.body as HealthEvent;

    if (!event_date || !event_type) {
      res.status(400).json({ success: false, error: 'event_date and event_type are required' });
      return;
    }

    const { data, error } = await healthRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      animal_id,
      batch_id,
      event_date,
      event_type,
      description,
      vet_name,
      cost,
      next_due_date,
      notes,
    });

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/health-events/:id
export const upsertHealthEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const input = req.body as Partial<HealthEvent>;

    const { data, error } = await healthRepository.upsert(id, input);
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/health-events/:id
export const deleteHealthEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { error } = await healthRepository.delete(id);
    if (error) throw error;
    res.json({ success: true, message: 'Health event record deleted' });
  } catch (err) {
    next(err);
  }
};
