import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

// GET /api/animals
export const getAnimals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';
    const { species, status } = req.query;

    let query = supabase
      .from('animals')
      .select('*')
      .eq('farm_id', farmId)
      .order('date_acquired', { ascending: false });

    if (species) query = query.eq('species', species);
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/animals/:id
export const getAnimalById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('animals')
      .select('*, weight_logs(*), health_events(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) { res.status(404).json({ success: false, error: 'Animal not found' }); return; }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// POST /api/animals
export const createAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmId = 'a0000000-0000-0000-0000-000000000001';
    const { tag_id, species, breed, batch_id, date_acquired, age_at_acquisition, acquisition_cost, source, notes } = req.body;

    if (!species) {
      res.status(400).json({ success: false, error: 'species is required' });
      return;
    }

    const { data, error } = await supabase
      .from('animals')
      .insert([{ farm_id: farmId, tag_id, species, breed, batch_id, date_acquired, age_at_acquisition, acquisition_cost, source, notes }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/animals/:id
export const updateAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };

    const { data, error } = await supabase
      .from('animals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/animals/:id
export const deleteAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) throw error;

    res.json({ success: true, message: 'Animal record deleted' });
  } catch (err) {
    next(err);
  }
};