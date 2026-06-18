export interface BreedingRecord {
  id?: string;
  farm_id: string;
  sow_id: string;
  method?: string | null;
  mating_date?: string | null;
  expected_farrow_date?: string | null;
  actual_farrow_date?: string | null;
  litter_size?: number | null;
  male_count?: number | null;
  female_count?: number | null;
  stillborn_count?: number | null;
  status?: string | null;
  notes?: string | null;
  created_at?: string;
}
