export const DEFAULT_FARM_ID = 'a0000000-0000-0000-0000-000000000001';
export const FARM_ID = process.env.FARM_ID?.trim() || DEFAULT_FARM_ID;

export function applyFarmFilter<T>(query: T): T {
  const q = query as any;
  return q?.eq ? q.eq('farm_id', FARM_ID) : query;
}
