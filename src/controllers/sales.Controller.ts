import { Request, Response } from 'express';
import { salesService } from '../services/sales.service';

export const salesController = {
  async getAll(req: Request, res: Response) {
    const { sales, totalRevenue } = await salesService.getAll();
    res.json({ success: true, count: sales.length, totalRevenue, data: sales });
  },

  async create(req: Request, res: Response) {
    const data = await salesService.create(req.body);
    res.status(201).json({ success: true, data });
  },
};