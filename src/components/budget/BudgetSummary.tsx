import { formatCurrency } from "@/lib/utils";

interface BudgetSummaryProps {
  limit: number;
  totalExpense: number;
}

export function BudgetSummary({ limit, totalExpense }: BudgetSummaryProps) {
  const remaining = limit - totalExpense;

  return (
    <div style={{ display: "grid", gap: "6px", width: "100%" }}>
      <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>
        Saldo budget
      </span>
      <strong style={{ fontSize: "1.25rem", color: remaining >= 0 ? "var(--success)" : "var(--danger)" }}>
        {limit > 0 ? formatCurrency(remaining) : "Belum ada batas"}
      </strong>
    </div>
  );
}
