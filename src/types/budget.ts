/** Monthly budget of one user, as returned by /api/budgets. */
export interface Budget {
  id: string;
  userId: string;
  /** Budget month in "YYYY-MM" format, e.g. "2026-09". */
  month: string;
  /** Spending limit for the month, always > 0. */
  amount: number;
  createdAt: string;
  updatedAt: string;
}

/** Request body for POST /api/budgets and PUT /api/budgets/:id. */
export interface BudgetInput {
  month: string;
  amount: number;
}
