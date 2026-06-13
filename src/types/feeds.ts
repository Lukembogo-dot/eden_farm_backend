export interface FeedStock {
  id?: string;
  farm_id: string;
  feed_name: string;
  species?: string | null;
  quantity_kg: number;
  unit_cost_per_kg?: number | null;
  supplier?: string | null;
  reorder_level_kg?: number | null;
  last_restocked?: string | null;
  created_at?: string;
  updated_at?: string;
}
