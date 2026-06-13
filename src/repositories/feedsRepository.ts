import { supabase } from '../config/supabase';
import { FeedStock } from '../types/feeds';

const FARM_ID = 'a0000000-0000-0000-0000-000000000001';

export const feedsRepository = {
  async getAll() {
    return supabase
      .from('feed_stock')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('feed_name');
  },

  async create(input: FeedStock) {
    return supabase
      .from('feed_stock')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID, last_restocked: new Date().toISOString().split('T')[0] }])
      .select()
      .single();
  },

  async getById(id: string) {
    return supabase
      .from('feed_stock')
      .select('quantity_kg')
      .eq('id', id)
      .single();
  },

  async update(id: string, updates: Partial<FeedStock>) {
    return supabase
      .from('feed_stock')
      .update({ ...updates, last_restocked: new Date().toISOString().split('T')[0], updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },
};
