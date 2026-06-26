import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';
import { HealthEvent } from '../types/health.types';

export const healthRepository = {
  async getAll() {
    return supabase
      .from('health_events')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('event_date', { ascending: false });
  },

  async getById(id: string) {
    return supabase
      .from('health_events')
      .select('*')
      .eq('id', id)
      .single();
  },

  async create(input: HealthEvent) {
    return supabase
      .from('health_events')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID }])
      .select()
      .single();
  },

  async upsert(id: string | undefined, input: Partial<HealthEvent>) {
    const data: any = { ...input, farm_id: input.farm_id || FARM_ID };
    if (id) data.id = id;
    return supabase
      .from('health_events')
      .upsert(data)
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase
      .from('health_events')
      .delete()
      .eq('id', id);
  },
};
