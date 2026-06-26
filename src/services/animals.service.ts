import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { Animal, CreateAnimalInput, UpdateAnimalInput, WeightLog } from '../types/animal.types';
import { ledgerService } from './ledger.service';

export const animalsService = {
  async getAll(filters: { status?: string; gender?: string; origin?: string }): Promise<Animal[]> {
    let query = supabase
      .from('animals')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('created_at', { ascending: false });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.gender) query = query.eq('gender', filters.gender);
    if (filters.origin) query = query.eq('origin', filters.origin);

    const { data, error } = await query;
    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

  async getById(id: string): Promise<Animal> {
    const { data, error } = await supabase
      .from('animals')
      .select('*, weight_logs(*), health_events(*)')
      .eq('id', id)
      .single();

    if (error || !data) throw new ApiError(404, 'Animal not found');
    return data;
  },

  // Pig acquired by direct purchase — creates animal + matching ledger expense
  async createPurchased(input: CreateAnimalInput): Promise<Animal> {
    const { data: animal, error } = await supabase
      .from('animals')
      .insert([{
        farm_id: DEFAULT_FARM_ID,
        species: 'pig',
        origin: 'purchased',
        status: 'active',
        ...input,
      }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);

    if (input.acquisition_cost > 0) {
      await ledgerService.create({
        entry_date: input.date_acquired,
        description: `Purchased ${input.species || 'pig'}${input.source ? ` from ${input.source}` : ''}`,
        category: 'Livestock',
        amount: input.acquisition_cost,
        source_table: 'animals',
        source_id: animal.id,
        animal_id: animal.id,
      });
    }

    return animal;
  },

  async update(id: string, input: UpdateAnimalInput): Promise<Animal> {
    const { data, error } = await supabase
      .from('animals')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) throw new ApiError(500, error.message);
  },

  async addWeightLog(animalId: string, weighed_date: string, weight_kg: number, notes?: string): Promise<WeightLog> {
    const { data, error } = await supabase
      .from('weight_logs')
      .insert([{ animal_id: animalId, weighed_date, weight_kg, notes }])
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);

    // Keep animals.current_weight_kg in sync with the latest log
    await supabase
      .from('animals')
      .update({ current_weight_kg: weight_kg, updated_at: new Date().toISOString() })
      .eq('id', animalId);

    return data;
  },

  // Age is always computed, never stored
  computeAgeInMonths(dob: string | null): number | null {
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months;
  },
};