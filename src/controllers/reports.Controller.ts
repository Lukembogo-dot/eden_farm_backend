import { Request, Response } from 'express';
import { reportsService } from '../services/reports.service';

export const reportsController = {
  async getProfitLoss(req: Request, res: Response) {
    const data = await reportsService.getProfitLoss();
    res.json({ success: true, data });
  },

  async getTrajectory(req: Request, res: Response) {
    const targetWeight = req.query.targetWeight ? Number(req.query.targetWeight) : undefined;
    const data = await reportsService.getTrajectory(targetWeight);
    res.json({ success: true, data });
  },
};