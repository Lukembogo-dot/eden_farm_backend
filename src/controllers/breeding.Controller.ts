import { Request, Response } from 'express';
import { breedingService } from '../services/breeding.service';

export const breedingController = {
  async getAll(req: Request, res: Response) {
    const data = await breedingService.getAll();
    res.json({ success: true, count: data.length, data });
  },

  async create(req: Request, res: Response) {
    const data = await breedingService.create(req.body);
    res.status(201).json({ success: true, data });
  },

  async confirmPregnant(req: Request, res: Response) {
    const data = await breedingService.confirmPregnant(String(req.params.id));
    res.json({ success: true, data });
  },

  async recordFarrow(req: Request, res: Response) {
    const data = await breedingService.recordFarrow(String(req.params.id), req.body);
    res.status(201).json({ success: true, data });
  },
};