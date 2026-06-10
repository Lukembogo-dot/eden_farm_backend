import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /api/alerts
export const getAlerts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';

    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('farm_id', farmId)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/alerts/:id/resolve
export const resolveAlert = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('alerts')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};