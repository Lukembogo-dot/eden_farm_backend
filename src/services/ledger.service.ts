import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { CreateLedgerInput, LedgerEntry, LedgerSummary } from '../types/ledger.types';

export const ledgerService = {
  async getAll(filters: { category?: string; year?: string; entry_type?: string }): Promise<LedgerEntry[]> {
    let query = supabase
      .from('ledger')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('entry_date', { ascending: true });

    if (filters.category) query = query.eq('category', filters.category);
    if (filters.entry_type) query = query.eq('entry_type', filters.entry_type);
    if (filters.year) {
      query = query.gte('entry_date', `${filters.year}-01-01`).lte('entry_date', `${filters.year}-12-31`);
    }

    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);

    let running = 0;
    return (data || []).map((entry) => {
      running += entry.entry_type === 'income' ? -entry.amount : entry.amount;
      return { ...entry, running_total: running };
    });
  },

  async create(input: CreateLedgerInput): Promise<LedgerEntry> {
    const { data, error } = await supabase
      .from('ledger')
      .insert([{ farm_id: DEFAULT_FARM_ID, entry_type: 'expense', ...input }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('ledger').delete().eq('id', id);
    if (error) throw new ApiError(500, error.message);
  },

  async getSummary(): Promise<LedgerSummary> {
    const { data, error } = await supabase
      .from('ledger')
      .select('category, amount, entry_type')
      .eq('farm_id', DEFAULT_FARM_ID);

    if (error) throw new ApiError(500, error.message);

    const byCategory: Record<string, number> = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    (data || []).forEach((entry) => {
      if (entry.entry_type === 'income') {
        totalIncome += entry.amount;
      } else {
        totalExpenses += entry.amount;
        byCategory[entry.category] = (byCategory[entry.category] || 0) + entry.amount;
      }
    });

    return { totalExpenses, totalIncome, netPosition: totalIncome - totalExpenses, byCategory };
  },
};