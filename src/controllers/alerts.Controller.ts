import { Request, Response } from 'express';
import { alertsService } from '../services/alerts.service';

export const alertsController = {
  async getAll(req: Request, res: Response) {
    await alertsService.checkLowStock(); // refresh low-stock alerts on each fetch
    const data = await alertsService.getAll();
    res.json({ success: true, count: data.length, data });
  },

  async resolve(req: Request, res: Response) {
    const data = await alertsService.resolve(String(req.params.id));
    res.json({ success: true, data });
  },
};