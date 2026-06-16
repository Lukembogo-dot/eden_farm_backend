import { supabase } from '../config/supabase';
import { FARM_ID } from '../config/farm';

export const statsRepository = {
  async getDashboardSummary() {
    // 1. Fetch Animals
    const { data: animals, error: animalsError } = await supabase
      .from('animals')
      .select('species, status')
      .eq('farm_id', FARM_ID);

    if (animalsError) throw animalsError;

    // 2. Fetch Sales
    const { data: sales, error: salesError } = await supabase
      .from('sales')
      .select('total_amount, species')
      .eq('farm_id', FARM_ID);

    if (salesError) throw salesError;

    // 3. Fetch Health Events
    const { data: healthEvents, error: healthError } = await supabase
      .from('health_events')
      .select('event_type')
      .eq('farm_id', FARM_ID);

    if (healthError) throw healthError;

    // --- AGGREGATION ALGORITHM ---

    // Animals & Species aggregation
    const totalAnimals = animals?.length || 0;
    const speciesCounts: Record<string, number> = {};
    let activeAnimalsCount = 0;

    animals?.forEach((animal) => {
      const species = (animal.species || 'unknown').toLowerCase();
      speciesCounts[species] = (speciesCounts[species] || 0) + 1;
      if (animal.status !== 'sold') {
        activeAnimalsCount++;
      }
    });

    // Sales aggregation
    const totalSalesCount = sales?.length || 0;
    let totalRevenue = 0;
    const salesBySpeciesCount: Record<string, number> = {};

    sales?.forEach((sale) => {
      totalRevenue += sale.total_amount || 0;
      const species = (sale.species || 'unknown').toLowerCase();
      salesBySpeciesCount[species] = (salesBySpeciesCount[species] || 0) + 1;
    });

    // Health aggregation
    const totalHealthCases = healthEvents?.length || 0;
    const healthCasesByTypeCount: Record<string, number> = {};

    healthEvents?.forEach((event) => {
      const type = (event.event_type || 'other').toLowerCase();
      healthCasesByTypeCount[type] = (healthCasesByTypeCount[type] || 0) + 1;
    });

    return {
      animals: {
        total: totalAnimals,
        active: activeAnimalsCount,
        by_species: speciesCounts,
      },
      sales: {
        total_count: totalSalesCount,
        total_revenue: totalRevenue,
        by_species: salesBySpeciesCount,
      },
      health_cases: {
        total_count: totalHealthCases,
        by_type: healthCasesByTypeCount,
      },
    };
  },
};
