import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { Sale, CreateSaleInput } from '../types/sale.types';
import { ledgerService } from './ledger.service';

export const salesService = {
  async getAll(): Promise<{ sales: Sale[]; totalRevenue: number }> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('sale_date', { ascending: false });

    if (error) throw new ApiError(500, error.message);

    const totalRevenue = (data || []).reduce((sum, s) => sum + s.total_amount, 0);
    return { sales: data || [], totalRevenue };
  },

  // Records the sale, marks the animal sold, AND auto-creates ledger income
  async create(input: CreateSaleInput): Promise<Sale> {
    const { data: sale, error } = await supabase
      .from('sales')
      .insert([{ farm_id: DEFAULT_FARM_ID, sale_type: 'live', ...input }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);

    await supabase
      .from('animals')
      .update({ status: 'sold', updated_at: new Date().toISOString() })
      .eq('id', input.animal_id);

    await ledgerService.create({
      entry_date: input.sale_date,
      description: `Sale${input.buyer_name ? ` to ${input.buyer_name}` : ''}${input.weight_at_sale_kg ? ` — ${input.weight_at_sale_kg}kg` : ''}`,
      category: 'Sale',
      amount: input.total_amount,
      entry_type: 'income',
      source_table: 'sales',
      source_id: sale.id,
      animal_id: input.animal_id,
    });

    return sale;
  },
};