export type HealthEventType =
  | 'vaccination' | 'treatment' | 'checkup'
  | 'insemination' | 'pregnancy_check' | 'deworming';

export interface HealthEvent {
  id: string;
  farm_id: string;
  animal_id: string | null;
  event_date: string;
  event_type: HealthEventType;
  description: string;
  vet_name: string | null;
  cost: number;
  next_due_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface CreateHealthEventInput {
  animal_id?: string;
  event_date: string;
  event_type: HealthEventType;
  description: string;
  vet_name?: string;
  cost?: number;
  next_due_date?: string;
  notes?: string;
}