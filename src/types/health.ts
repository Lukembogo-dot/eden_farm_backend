export interface HealthEvent {
  id?: string;
  farm_id: string;
  animal_id?: string | null;
  batch_id?: string | null;
  event_date: string;
  event_type: string;
  description?: string | null;
  vet_name?: string | null;
  cost?: number | null;
  next_due_date?: string | null;
  notes?: string | null;
  created_at?: string;
}
