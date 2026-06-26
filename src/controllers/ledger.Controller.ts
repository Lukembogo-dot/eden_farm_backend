import { Request, Response } from 'express';
import { ledgerService } from '../services/ledger.service';

export const ledgerController = {
  async getAll(req: Request, res: Response) {
    const { category, year, entry_type } = req.query as Record<string, string>;
    const data = await ledgerService.getAll({ category, year, entry_type });
    res.json({ success: true, count: data.length, data });
  },

  async getSummary(req: Request, res: Response) {
    const data = await ledgerService.getSummary();
    res.json({ success: true, data });
  },

  async create(req: Request, res: Response) {
    const data = await ledgerService.create(req.body);
    res.status(201).json({ success: true, data });
  },

  async delete(req: Request, res: Response) {
    await ledgerService.delete(String(req.params.id));
    res.json({ success: true, message: 'Ledger entry deleted' });
  },
};