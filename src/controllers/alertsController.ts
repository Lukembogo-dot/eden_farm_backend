import { Request, Response, NextFunction } from 'express';
import { alertsRepository } from '../repositories/alertsRepository';

// GET /api/alerts
export const getAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await alertsRepository.getAll();

    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/alerts/:id/resolve
export const resolveAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { data, error } = await alertsRepository.resolve(id);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};