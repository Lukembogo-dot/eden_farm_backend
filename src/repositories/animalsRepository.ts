import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';
import { Animal } from '../types/animal.types';

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
    // Note: weight_logs or health_events might be referenced, but let's query animals + health_events if they exist.
    // If weight_logs table doesn't exist, we can fallback to standard query.
    // Let's look at getById: it had `*, weight_logs(*), health_events(*)`
    // Let's keep the original select but handle it safely.
    return supabase
      .from('animals')
      .select('*, health_events(*)')
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

  async upsert(id: string | undefined, input: Partial<Animal>) {
    const data: any = { ...input, farm_id: input.farm_id || FARM_ID, updated_at: new Date().toISOString() };
    if (id) data.id = id;
    return supabase
      .from('animals')
      .upsert(data)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase.from('animals').delete().eq('id', id);
  },
};
