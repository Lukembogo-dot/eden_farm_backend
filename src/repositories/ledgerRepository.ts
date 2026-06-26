import { supabase } from '../config/supabase';
import { FARM_ID, applyFarmFilter } from '../config/farm';
import { LedgerEntry, LedgerSummary } from '../types/ledger.types';

export const ledgerRepository = {
  async getAll(limit = 5) {
    return supabase.from('ledger').select('*').limit(limit);
  },

  async getByFarm(limit = 5) {
    return applyFarmFilter(supabase.from('ledger').select('*').limit(limit));
  },

  async getSummary() {
    const { data, error } = await applyFarmFilter(
      supabase.from('ledger').select('category, amount, entry_type')
    );

    if (error) throw error;

    const summary: LedgerSummary = {
      totalExpenses: 0,
      totalIncome: 0,
      netPosition: 0,
      byCategory: {},
    };

    data.forEach((entry: { category: string; amount: number; entry_type: string }) => {
      if (entry.entry_type === 'income') {
        summary.totalIncome += entry.amount;
      } else {
        summary.totalExpenses += entry.amount;
        summary.byCategory[entry.category] = (summary.byCategory[entry.category] || 0) + entry.amount;
      }
    });

    summary.netPosition = summary.totalIncome - summary.totalExpenses;

    return summary;
  },

  async create(entry: LedgerEntry) {
    return supabase
      .from('ledger')
      .insert([{ ...entry, farm_id: entry.farm_id || FARM_ID, entry_type: entry.entry_type || 'expense' }])
      .select()
      .single();
  },

  async upsert(id: string, entry: Partial<LedgerEntry>) {
    return supabase
      .from('ledger')
      .upsert({ ...entry, id, farm_id: entry.farm_id || FARM_ID, entry_type: entry.entry_type || 'expense' })
      .select()
      .single();
  },

  async delete(id: string) {
    return supabase.from('ledger').delete().eq('id', id);
  },
};
