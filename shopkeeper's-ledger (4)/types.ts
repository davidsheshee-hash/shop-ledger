export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string; // ISO String
}

export interface CategoryDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  income: number;
  expense: number;
  profit: number;
  label: string; // MM月 YYYY
}

export interface CategoryStat {
  name: string;
  value: number;
  icon: string;
  color: string;
}