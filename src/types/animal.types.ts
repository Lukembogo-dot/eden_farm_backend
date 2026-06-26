import { AnimalStatus, AnimalOrigin, Gender } from './common.types';

export interface Animal {
  id: string;
  farm_id: string;
  tag_id: string | null;
  species: string;
  breed: string | null;
  gender: Gender | null;
  origin: AnimalOrigin;
  date_of_birth: string | null;
  date_acquired: string | null;
  acquisition_cost: number;
  source: string | null;
  breeding_record_id: string | null;
  mother_id: string | null;
  current_weight_kg: number | null;
  status: AnimalStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateAnimalInput {
  tag_id?: string;
  species?: string;
  breed?: string;
  gender?: Gender;
  date_acquired: string;
  acquisition_cost: number;
  source?: string;
  current_weight_kg?: number;
  notes?: string;
}

export interface UpdateAnimalInput {
  tag_id?: string;
  breed?: string;
  gender?: Gender;
  current_weight_kg?: number;
  status?: AnimalStatus;
  notes?: string;
}

export interface WeightLog {
  id: string;
  animal_id: string;
  weighed_date: string;
  weight_kg: number;
  notes: string | null;
  created_at: string;
}