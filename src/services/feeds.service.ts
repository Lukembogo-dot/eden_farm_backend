import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { FeedStock, PurchaseFeedInput } from '../types/feed.types';
import { ledgerService } from './ledger.service';

export const feedsService = {
  async getAll(): Promise<FeedStock[]> {
    const { data, error } = await supabase
      .from('feed_stock')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('feed_name');

    if (error) throw new ApiError(500, error.message);

    return (data || []).map((f) => ({ ...f, low_stock: f.quantity_kg <= f.reorder_level_kg }));
  },

  // The combined action: logs feed purchase, updates stock, AND writes ledger expense — one call
  async purchase(input: PurchaseFeedInput): Promise<FeedStock> {
    const totalCost = input.quantity_kg * input.unit_cost_per_kg;

    // Check for existing stock entry with the same feed name
    const { data: existing } = await supabase
      .from('feed_stock')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .eq('feed_name', input.feed_name)
      .maybeSingle();

    let stockRow: FeedStock;

    if (existing) {
      const { data, error } = await supabase
        .from('feed_stock')
        .update({
          quantity_kg: existing.quantity_kg + input.quantity_kg,
          unit_cost_per_kg: input.unit_cost_per_kg,
          supplier: input.supplier || existing.supplier,
          last_restocked: input.purchase_date,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw new ApiError(500, error.message);
      stockRow = data;
    } else {
      const { data, error } = await supabase
        .from('feed_stock')
        .insert([{
          farm_id: DEFAULT_FARM_ID,
          feed_name: input.feed_name,
          quantity_kg: input.quantity_kg,
          unit_cost_per_kg: input.unit_cost_per_kg,
          supplier: input.supplier,
          reorder_level_kg: input.reorder_level_kg || 50,
          last_restocked: input.purchase_date,
        }])
        .select()
        .single();

      if (error) throw new ApiError(500, error.message);
      stockRow = data;
    }

    // Auto-create the ledger expense
    await ledgerService.create({
      entry_date: input.purchase_date,
      description: `${input.feed_name} — ${input.quantity_kg}kg${input.supplier ? ` from ${input.supplier}` : ''}`,
      category: 'Feeds',
      amount: totalCost,
      source_table: 'feed_stock',
      source_id: stockRow.id,
    });

    return stockRow;
  },

  async consume(feedStockId: string, quantity_kg: number): Promise<FeedStock> {
    const { data: existing, error: fetchError } = await supabase
      .from('feed_stock')
      .select('quantity_kg')
      .eq('id', feedStockId)
      .single();

    if (fetchError) throw new ApiError(404, 'Feed stock not found');

    const newQty = Math.max(0, existing.quantity_kg - quantity_kg);

    const { data, error } = await supabase
      .from('feed_stock')
      .update({ quantity_kg: newQty, updated_at: new Date().toISOString() })
      .eq('id', feedStockId)
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },
};