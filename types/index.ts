export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType | "both";
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  title: string;
  category: string;
  note?: string;
  date: string; // ISO string
  image?: string; // base64
  createdAt: string;
  updatedAt: string;
}

export interface DaySummary {
  date: string;
  income: number;
  expense: number;
  transactions: Transaction[];
}

export interface PeriodStats {
  income: number;
  expense: number;
  balance: number;
  transactions: Transaction[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface ChartDataPoint {
  label: string;
  income: number;
  expense: number;
  balance: number;
}

export type ViewPeriod = "day" | "week" | "month" | "year";
