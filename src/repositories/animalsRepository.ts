import { supabase } from '../config/supabase';
import { Animal } from '../types/animals';

const FARM_ID = 'a0000000-0000-0000-0000-000000000001';

export const animalsRepository = {
  async getAll(species?: string, status?: string) {
    let query = supabase
      .from('animals')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('date_acquired', { ascending: false });

    if (species) query = query.eq('species', species);
    if (status) query = query.eq('status', status);

    return query;
  },

  async getById(id: string) {
    return supabase
      .from('animals')
      .select('*, weight_logs(*), health_events(*)')
      .eq('id', id)
      .single();
  },

  async create(input: Animal) {
    return supabase
      .from('animals')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID }])
      .select()
      .single();
  },

  async update(id: string, updates: Partial<Animal>) {
    return supabase
      .from('animals')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase.from('animals').delete().eq('id', id);
  },
};
