import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';
import { BreedingRecord } from '../types/breeding';

export const breedingRepository = {
  async getAll() {
    return supabase
      .from('breeding_records')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('mating_date', { ascending: false });
  },

  async getById(id: string) {
    return supabase
      .from('breeding_records')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(input: BreedingRecord) {
    return supabase
      .from('breeding_records')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID }])
      .select()
      .single();
  },

  async update(id: string, updates: Partial<BreedingRecord>) {
    return supabase
      .from('breeding_records')
      .update({ ...updates })
      .eq('id', id)
      .select()
      .single();
  },

  async upsert(id: string | undefined, input: Partial<BreedingRecord>) {
    const data: any = { ...input, farm_id: input.farm_id || FARM_ID };
    if (id) data.id = id;
    return supabase
      .from('breeding_records')
      .upsert(data)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase
      .from('breeding_records')
      .delete()
      .eq('id', id);
  },
};
