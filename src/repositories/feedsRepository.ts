import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';
import { FeedStock } from '../types/feed.types';

export const feedsRepository = {
  async getAll() {
    return supabase
      .from('feeds')
      .select('*')
      .eq('farm_id', FARM_ID)
      .order('feed_name');
  },

  async create(input: FeedStock) {
    return supabase
      .from('feeds')
      .insert([{ ...input, farm_id: input.farm_id || FARM_ID, last_restocked: new Date().toISOString().split('T')[0] }])
      .select()
      .single();
  },

  async getById(id: string) {
    return supabase
      .from('feeds')
      .select('quantity_kg')
      .eq('id', id)
      .single();
  },

  async update(id: string, updates: Partial<FeedStock>) {
    return supabase
      .from('feeds')
      .update({ ...updates, last_restocked: new Date().toISOString().split('T')[0], updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  async upsert(id: string | undefined, input: Partial<FeedStock>) {
    const data: any = { ...input, farm_id: input.farm_id || FARM_ID, updated_at: new Date().toISOString() };
    if (id) data.id = id;
    return supabase
      .from('feeds')
      .upsert(data)
      .select()
      .single();
  },
};
