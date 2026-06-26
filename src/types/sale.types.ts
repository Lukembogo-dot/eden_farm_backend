export type SaleType = 'live' | 'slaughter';

export interface Sale {
  id: string;
  farm_id: string;
  sale_date: string;
  animal_id: string;
  weight_at_sale_kg: number | null;
  price_per_kg: number | null;
  total_amount: number;
  buyer_name: string | null;
  buyer_contact: string | null;
  sale_type: SaleType;
  notes: string | null;
  created_at: string;
}

export interface CreateSaleInput {
  sale_date: string;
  animal_id: string;
  weight_at_sale_kg?: number;
  price_per_kg?: number;
  total_amount: number;
  buyer_name?: string;
  buyer_contact?: string;
  sale_type?: SaleType;
  notes?: string;
}
