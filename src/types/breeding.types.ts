export type BreedingMethod = 'natural' | 'AI';
export type BreedingStatus = 'pending' | 'confirmed_pregnant' | 'farrowed' | 'failed';

export interface BreedingRecord {
  id: string;
  farm_id: string;
  sow_id: string;
  method: BreedingMethod;
  mating_date: string | null;
  expected_farrow_date: string | null;
  actual_farrow_date: string | null;
  litter_size: number | null;
  male_count: number;
  female_count: number;
  stillborn_count: number;
  status: BreedingStatus;
  notes: string | null;
  created_at: string;
}

export interface CreateBreedingInput {
  sow_id: string;
  method?: BreedingMethod;
  mating_date?: string;
  expected_farrow_date?: string;
  notes?: string;
}

export interface RecordFarrowInput {
  actual_farrow_date: string;
  male_count: number;
  female_count: number;
  stillborn_count?: number;
  notes?: string;
}