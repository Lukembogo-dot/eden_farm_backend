export interface FeedStock {
  id: string;
  farm_id: string;
  feed_name: string;
  quantity_kg: number;
  unit_cost_per_kg: number | null;
  supplier: string | null;
  reorder_level_kg: number;
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
  low_stock?: boolean;
}

export interface PurchaseFeedInput {
  feed_name: string;
  quantity_kg: number;
  unit_cost_per_kg: number;
  supplier?: string;
  reorder_level_kg?: number;
  purchase_date: string;
}