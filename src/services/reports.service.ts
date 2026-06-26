import { supabase } from '../config/supabase';
import { DEFAULT_FARM_ID } from '../config/constants';
import { ApiError } from '../middleware/errorHandler';
import { ledgerService } from './ledger.service';

export const reportsService = {
  async getProfitLoss() {
    const summary = await ledgerService.getSummary();

    const { data: sales, error } = await supabase
      .from('sales')
      .select('total_amount, animal_id')
      .eq('farm_id', DEFAULT_FARM_ID);

    if (error) throw new ApiError(500, error.message);

    const animalsSold = sales?.length || 0;

    return {
      ...summary,
      animalsSold,
      avgRevenuePerSale: animalsSold > 0 ? summary.totalIncome / animalsSold : 0,
    };
  },

  // Basic trajectory: uses weight-gain rate + feed cost per active pig to project value at target weight
  async getTrajectory(targetWeightKg: number = 90) {
    const { data: activeAnimals, error } = await supabase
      .from('animals')
      .select('id, date_of_birth, date_acquired, current_weight_kg, weight_logs(weighed_date, weight_kg)')
      .eq('farm_id', DEFAULT_FARM_ID)
      .eq('status', 'active')
      .eq('species', 'pig');

    if (error) throw new ApiError(500, error.message);

    const { data: feedTotals } = await supabase
      .from('ledger')
      .select('amount')
      .eq('farm_id', DEFAULT_FARM_ID)
      .eq('category', 'Feeds');

    const totalFeedCost = (feedTotals || []).reduce((sum, e) => sum + e.amount, 0);
    const activeCount = activeAnimals?.length || 1;
    const feedCostPerPig = totalFeedCost / activeCount;

    const projections = (activeAnimals || []).map((animal: any) => {
      const logs = (animal.weight_logs || []).sort(
        (a: any, b: any) => new Date(a.weighed_date).getTime() - new Date(b.weighed_date).getTime()
      );

      let gainRatePerDay = 0;
      if (logs.length >= 2) {
        const first = logs[0];
        const last = logs[logs.length - 1];
        const daysBetween = (new Date(last.weighed_date).getTime() - new Date(first.weighed_date).getTime()) / 86400000;
        if (daysBetween > 0) {
          gainRatePerDay = (last.weight_kg - first.weight_kg) / daysBetween;
        }
      }

      const currentWeight = animal.current_weight_kg || 0;
      const weightToGo = Math.max(0, targetWeightKg - currentWeight);
      const daysToTarget = gainRatePerDay > 0 ? Math.ceil(weightToGo / gainRatePerDay) : null;

      return {
        animal_id: animal.id,
        current_weight_kg: currentWeight,
        gain_rate_kg_per_day: Math.round(gainRatePerDay * 100) / 100,
        estimated_days_to_target: daysToTarget,
        feed_cost_so_far: Math.round(feedCostPerPig),
        note: logs.length < 2 ? 'Not enough weight logs yet for an accurate projection' : undefined,
      };
    });

    return { targetWeightKg, feedCostPerPig: Math.round(feedCostPerPig), projections };
  },
};