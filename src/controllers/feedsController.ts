import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /api/feeds
export const getFeedStock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';

    const { data, error } = await supabase
      .from('feed_stock')
      .select('*')
      .eq('farm_id', farmId)
      .order('feed_name');

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
    const farmId = 'a0000000-0000-0000-0000-000000000001';
    const { feed_name, species, quantity_kg, unit_cost_per_kg, supplier, reorder_level_kg } = req.body;

    if (!feed_name) {
      res.status(400).json({ success: false, error: 'feed_name is required' });
      return;
    }

    const { data, error } = await supabase
      .from('feed_stock')
      .insert([{ farm_id: farmId, feed_name, species, quantity_kg, unit_cost_per_kg, supplier, reorder_level_kg, last_restocked: new Date().toISOString().split('T')[0] }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/feeds/:id/restock
export const restockFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity_kg } = req.body;

    const { data: current, error: fetchError } = await supabase
      .from('feed_stock')
      .select('quantity_kg')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    const newQty = (current.quantity_kg || 0) + quantity_kg;

    const { data, error } = await supabase
      .from('feed_stock')
      .update({ quantity_kg: newQty, last_restocked: new Date().toISOString().split('T')[0], updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};