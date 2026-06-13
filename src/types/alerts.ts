export interface Alert {
  id?: string;
  farm_id: string;
  title?: string | null;
  message?: string | null;
  is_resolved?: boolean;
  created_at?: string;
  resolved_at?: string | null;
}
