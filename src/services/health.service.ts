import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { HealthEvent, CreateHealthEventInput } from '../types/health.types';
import { ledgerService } from './ledger.service';

export const healthService = {
  async getAll(animalId?: string): Promise<HealthEvent[]> {
    let query = supabase
      .from('health_events')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('event_date', { ascending: false });

    if (animalId) query = query.eq('animal_id', animalId);

    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  // Logs the health event AND auto-creates the matching ledger expense
  async create(input: CreateHealthEventInput): Promise<HealthEvent> {
    const { data: event, error } = await supabase
      .from('health_events')
      .insert([{ farm_id: DEFAULT_FARM_ID, cost: 0, ...input }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);

    if (input.cost && input.cost > 0) {
      const isBreedingRelated = input.event_type === 'insemination' || input.event_type === 'pregnancy_check';

      await ledgerService.create({
        entry_date: input.event_date,
        description: `${input.description} (${input.event_type})`,
        category: isBreedingRelated ? 'Breeding' : 'Veterinary',
        amount: input.cost,
        source_table: 'health_events',
        source_id: event.id,
        animal_id: input.animal_id,
      });
    }

    return event;
  },
};