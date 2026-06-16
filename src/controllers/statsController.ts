import { Request, Response, NextFunction } from 'express';
import { statsRepository } from '../repositories/statsRepository';

// GET /api/stats
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await statsRepository.getDashboardSummary();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
