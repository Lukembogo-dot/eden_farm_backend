export interface Animal {
  id?: string;
  farm_id: string;
  tag_id?: string | null;
  species: string;
  breed?: string | null;
  batch_id?: string | null;
  date_acquired?: string | null;
  age_at_acquisition?: number | null;
  acquisition_cost?: number | null;
  source?: string | null;
  status?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
