export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  error?: string;
}

export type AnimalStatus = 'active' | 'sold' | 'slaughtered' | 'deceased';
export type AnimalOrigin = 'purchased' | 'born';
export type Gender = 'male' | 'female';
export type EntryType = 'expense' | 'income';
export type LedgerCategory =
  | 'Feeds' | 'Veterinary' | 'Breeding' | 'Livestock'
  | 'Construction' | 'Labor' | 'Repair' | 'Sale' | 'Other';
export type AlertSeverity = 'info' | 'warning' | 'danger';