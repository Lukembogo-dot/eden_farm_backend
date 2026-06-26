import { EntryType, LedgerCategory } from './common.types';

export interface LedgerEntry {
  id: string;
  farm_id: string;
  entry_date: string;
  description: string;
  category: LedgerCategory;
  amount: number;
  entry_type: EntryType;
  source_table: string | null;
  source_id: string | null;
  animal_id: string | null;
  notes: string | null;
  created_at: string;
  running_total?: number;
}

export interface CreateLedgerInput {
  entry_date: string;
  description: string;
  category: LedgerCategory;
  amount: number;
  entry_type?: EntryType;
  source_table?: string;
  source_id?: string;
  animal_id?: string;
  notes?: string;
}

export interface LedgerSummary {
  totalExpenses: number;
  totalIncome: number;
  netPosition: number;
  byCategory: Record<string, number>;
}