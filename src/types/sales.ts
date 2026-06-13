export interface Sale {
  id?: string;
  farm_id: string;
  sale_date: string;
  animal_id?: string | null;
  species: string;
  quantity?: number | null;
  weight_at_sale_kg?: number | null;
  price_per_kg?: number | null;
  price_per_head?: number | null;
  total_amount: number;
  buyer_name?: string | null;
  buyer_contact?: string | null;
  sale_type?: string | null;
  notes?: string | null;
  created_at?: string;
}
