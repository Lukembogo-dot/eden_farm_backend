import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { Alert, AlertType } from '../types/alert.types';
import { AlertSeverity } from '../types/common.types';

export const alertsService = {
  async getAll(): Promise<Alert[]> {
    const { data, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .eq('is_resolved', false)
      .order('created_at', { ascending: false });

    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  async resolve(id: string): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .update({ is_resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },

  async create(alert_type: AlertType, severity: AlertSeverity, title: string, message: string, related_animal_id?: string): Promise<Alert> {
    const { data, error } = await supabase
      .from('alerts')
      .insert([{ farm_id: DEFAULT_FARM_ID, alert_type, severity, title, message, related_animal_id }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },

  // Scans feed stock and creates low-stock alerts where needed
  async checkLowStock(): Promise<void> {
    const { data: stocks } = await supabase
      .from('feed_stock')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID);

    for (const stock of stocks || []) {
      if (stock.quantity_kg <= stock.reorder_level_kg) {
        const { data: existingAlert } = await supabase
          .from('alerts')
          .select('id')
          .eq('farm_id', DEFAULT_FARM_ID)
          .eq('alert_type', 'low_stock')
          .eq('is_resolved', false)
          .ilike('message', `%${stock.feed_name}%`)
          .maybeSingle();

        if (!existingAlert) {
          await this.create(
            'low_stock',
            'warning',
            `Low stock: ${stock.feed_name}`,
            `${stock.feed_name} is at ${stock.quantity_kg}kg, below the reorder level of ${stock.reorder_level_kg}kg.`
          );
        }
      }
    }
  },
};