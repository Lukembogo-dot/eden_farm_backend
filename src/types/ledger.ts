export type LedgerEntryType = 'income' | 'expense';

export interface LedgerEntry {
  id?: string;
  farm_id: string;
  entry_date: string;
  description: string;
  category: string;
  amount: number;
  entry_type?: LedgerEntryType;
  reference?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface LedgerSummary {
  totalExpenses: number;
  totalIncome: number;
  netPosition: number;
  byCategory: Record<string, number>;
}

export interface LedgerDebugSnapshot {
  count: number;
  error: unknown;
  sample?: LedgerEntry | null;
}
