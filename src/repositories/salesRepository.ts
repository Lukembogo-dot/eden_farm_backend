import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';
import { Sale } from '../types/sales';

export const salesRepository = {
  async getAll() {
    return supabase
      .from('sales')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('sale_date', { ascending: false });
  },

  async create(input: Sale) {
    return supabase
      .from('sales')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID, sale_type: input.sale_type || 'live' }])
      .select()
      .single();
  },

  async upsert(id: string, input: Partial<Sale>) {
    return supabase
      .from('sales')
      .upsert({ ...input, id, farm_id: input.farm_id || FARM_ID, sale_type: input.sale_type || 'live' })
      .select()
      .single();
  },

  async createLedgerEntry(entry: { farm_id: string; entry_date: string; description: string; category: string; amount: number; entry_type: string }) {
    return supabase.from('ledger').insert([entry]);
  },

  async markAnimalSold(id: string) {
    return supabase.from('animals').update({ status: 'sold', updated_at: new Date().toISOString() }).eq('id', id);
  },
};
