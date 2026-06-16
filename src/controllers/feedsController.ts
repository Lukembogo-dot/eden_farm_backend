import { Request, Response, NextFunction } from 'express';
import { feedsRepository } from '../repositories/feedsRepository';
import { FeedStock } from '../types/feeds';

// GET /api/feeds
export const getFeedStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { data, error } = await feedsRepository.getAll();

    if (error) throw error;

    // Flag items below reorder level
    const withAlerts = data.map((f) => ({
      ...f,
      low_stock: f.quantity_kg <= f.reorder_level_kg,
    }));

    res.json({ success: true, count: data.length, data: withAlerts });
  } catch (err) {
    next(err);
  }
};

// POST /api/feeds
export const createFeedStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { feed_name, species, quantity_kg, unit_cost_per_kg, supplier, reorder_level_kg } = req.body as FeedStock;

    if (!feed_name) {
      res.status(400).json({ success: false, error: 'feed_name is required' });
      return;
    }

    const { data, error } = await feedsRepository.create({
      farm_id: 'a0000000-0000-0000-0000-000000000001',
      feed_name,
      species,
      quantity_kg,
      unit_cost_per_kg,
      supplier,
      reorder_level_kg,
    } as FeedStock);

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/feeds/:id/restock
export const restockFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { quantity_kg } = req.body;

    const { data: current, error: fetchError } = await feedsRepository.getById(id);

    if (fetchError) throw fetchError;

    const newQty = (current.quantity_kg || 0) + quantity_kg;

    const { data, error } = await feedsRepository.update(id, { quantity_kg: newQty });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PUT /api/feeds/:id
export const upsertFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const input = req.body as Partial<FeedStock>;

    const { data, error } = await feedsRepository.upsert(id, input);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};