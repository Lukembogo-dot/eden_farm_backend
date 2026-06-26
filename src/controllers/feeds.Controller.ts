import { Request, Response } from 'express';
import { feedsService } from '../services/feeds.service';

export const feedsController = {
  async getAll(req: Request, res: Response) {
    const data = await feedsService.getAll();
    res.json({ success: true, count: data.length, data });
  },

  async purchase(req: Request, res: Response) {
    const data = await feedsService.purchase(req.body);
    res.status(201).json({ success: true, data });
  },

  async consume(req: Request, res: Response) {
    const { quantity_kg } = req.body;
    const data = await feedsService.consume(String(req.params.id), quantity_kg);
    res.json({ success: true, data });
  },
};