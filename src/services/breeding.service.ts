import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { BreedingRecord, CreateBreedingInput, RecordFarrowInput } from '../types/breeding.types';
import { Animal } from '../types/animal.types';

export const breedingService = {
  async getAll(): Promise<BreedingRecord[]> {
    const { data, error } = await supabase
      .from('breeding_records')
      .select('*')
      .eq('farm_id', DEFAULT_FARM_ID)
      .order('mating_date', { ascending: false });

    if (error) throw new ApiError(500, error.message);
    return data || [];
  },

async create(input: CreateBreedingInput): Promise<BreedingRecord> {
  const PIG_GESTATION_DAYS = 114;

  // Auto-calculate expected farrow date from mating date, unless explicitly overridden
  let expected_farrow_date = input.expected_farrow_date;
  if (!expected_farrow_date && input.mating_date) {
    const matingDate = new Date(input.mating_date);
    matingDate.setDate(matingDate.getDate() + PIG_GESTATION_DAYS);
    expected_farrow_date = matingDate.toISOString().split('T')[0];
  }

  const { data, error } = await supabase
    .from('breeding_records')
    .insert([{
      farm_id: DEFAULT_FARM_ID,
      status: 'pending',
      method: 'natural',
      ...input,
      expected_farrow_date,
    }])
    .select()
    .single();

  if (error) throw new ApiError(500, error.message);
  return data;
},

  async confirmPregnant(id: string): Promise<BreedingRecord> {
    const { data, error } = await supabase
      .from('breeding_records')
      .update({ status: 'confirmed_pregnant' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new ApiError(500, error.message);
    return data;
  },

  // The key scenario: farrowing happens -> litter logged -> individual piglets auto-created
  async recordFarrow(id: string, input: RecordFarrowInput): Promise<{ breedingRecord: BreedingRecord; piglets: Animal[] }> {
    const litter_size = input.male_count + input.female_count;

    const { data: breedingRecord, error: brError } = await supabase
      .from('breeding_records')
      .update({
        status: 'farrowed',
        actual_farrow_date: input.actual_farrow_date,
        male_count: input.male_count,
        female_count: input.female_count,
        stillborn_count: input.stillborn_count || 0,
        litter_size,
        notes: input.notes,
      })
      .eq('id', id)
      .select()
      .single();

    if (brError) throw new ApiError(500, brError.message);

    // Build individual piglet rows: one per male, one per female
    const pigletRows = [
      ...Array(input.male_count).fill('male'),
      ...Array(input.female_count).fill('female'),
    ].map((gender) => ({
      farm_id: DEFAULT_FARM_ID,
      species: 'pig',
      gender,
      origin: 'born' as const,
      date_of_birth: input.actual_farrow_date,
      source: 'Born on farm',
      breeding_record_id: id,
      mother_id: breedingRecord.sow_id,
      status: 'active' as const,
      acquisition_cost: 0, // no purchase cost — birth, not purchase
    }));

    let piglets: Animal[] = [];
    if (pigletRows.length > 0) {
      const { data: createdPiglets, error: pigletError } = await supabase
        .from('animals')
        .insert(pigletRows)
        .select();

      if (pigletError) throw new ApiError(500, pigletError.message);
      piglets = createdPiglets || [];
    }

    return { breedingRecord, piglets };
  },
};