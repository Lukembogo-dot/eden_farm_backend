import { supabase } from '../config/supabase';

const FARM_ID = 'a0000000-0000-0000-0000-000000000001';

export const alertsRepository = {
  async getAll() {
    return supabase
      .from('alerts')
      .select('*')
      .eq('farm_id', FARM_ID)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });
  },

  async resolve(id: string) {
    return supabase
      .from('alerts')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
};
