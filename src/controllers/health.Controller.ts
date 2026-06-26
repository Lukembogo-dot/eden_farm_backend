import { Request, Response } from 'express';
import { healthService } from '../services/health.service';

export const healthController = {
  async getAll(req: Request, res: Response) {
    const { animal_id } = req.query as Record<string, string>;
    const data = await healthService.getAll(animal_id);
    res.json({ success: true, count: data.length, data });
  },

  async create(req: Request, res: Response) {
    const data = await healthService.create(req.body);
    res.status(201).json({ success: true, data });
  },
};