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

/** Budget usage for one month, as returned by GET /api/budgets?month=YYYY-MM. */
export interface BudgetSummary {
  month: string;
  /** null when the user has not set a budget for this month. */
  budget: Budget | null;
  /** Sum of the user's expense transactions dated in this month. */
  totalExpense: number;
  /** budget.amount - totalExpense; negative means over budget, null without a budget. */
  remaining: number | null;
}

/** Request body for POST /api/budgets and PUT /api/budgets/:id. */
export interface BudgetInput {
  month: string;
  amount: number;
}
