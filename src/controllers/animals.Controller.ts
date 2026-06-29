import { Request, Response } from 'express';
import { animalsService } from '../services/animals.service';

export const animalsController = {
  async getAll(req: Request, res: Response) {
    const { status, gender, origin } = req.query as Record<string, string>;
    const data = await animalsService.getAll({ status, gender, origin });
    res.json({ success: true, count: data.length, data });
  },

  async getById(req: Request, res: Response) {
    const data = await animalsService.getById(String(req.params.id));
    res.json({ success: true, data });
  },

  async createPurchased(req: Request, res: Response) {
    const data = await animalsService.createPurchased(req.body);
    res.status(201).json({ success: true, data });
  },

  async update(req: Request, res: Response) {
    const data = await animalsService.update(String(req.params.id), req.body);
    res.json({ success: true, data });
  },

 async delete(req: Request, res: Response) {
  const data = await animalsService.delete(String(req.params.id));
  res.json({ success: true, message: 'Animal marked as removed', data });
},

  async addWeightLog(req: Request, res: Response) {
    const { weighed_date, weight_kg, notes } = req.body;
    const data = await animalsService.addWeightLog(String(req.params.id), weighed_date, weight_kg, notes);
    res.status(201).json({ success: true, data });
  },
};