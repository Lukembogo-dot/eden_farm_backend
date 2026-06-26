import { AlertSeverity } from './common.types';

export type AlertType =
  | 'low_stock' | 'sell_ready' | 'vet_due'
  | 'pregnancy_check' | 'no_sale_recorded';

export interface Alert {
  id: string;
  farm_id: string;
  alert_type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  is_resolved: boolean;
  resolved_at: string | null;
  related_animal_id: string | null;
  created_at: string;
}