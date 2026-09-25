import type { Transaction } from "@/types/transaction";

export interface DashboardSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  recentTransactions: Transaction[];
}
