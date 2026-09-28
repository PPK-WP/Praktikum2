"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";
import type { UserPreference } from "@/types/shared";
import type { User } from "@/types/auth";
import { TransactionManager } from "@/components/transaction/TransactionManager";
import { SetBudgetForm } from "@/components/budget/SetBudgetForm";
import { MonthSelector } from "@/components/budget/MonthSelector";
import { BudgetIndicator } from "@/components/budget/BudgetIndicator";
import { BudgetSummary } from "@/components/budget/BudgetSummary";

interface DashboardViewProps {
  user: User;
  initialSummary: DashboardSummary;
  initialPreference: UserPreference;
}

export function DashboardView({
  initialSummary,
  initialPreference,
}: DashboardViewProps) {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [budgetLimit, setBudgetLimit] = useState(0);
  const [budgetUsage, setBudgetUsage] = useState(initialSummary.totalExpense);
  const [budgetLoading, setBudgetLoading] = useState(false);

  const refreshSummary = async () => {
    try {
      const res = await fetch("/api/dashboard/summary");
      const json = await res.json();
      if (res.ok && json.data) {
        setSummary(json.data);
        setBudgetUsage(Number(json.data.totalExpense ?? 0));
      }
    } catch (err: unknown) {
      console.error("Failed to refresh dashboard summary:", err);
    }
  };

  const refreshBudgetData = async (month = selectedMonth) => {
    setBudgetLoading(true);

    try {
      const [summaryRes, budgetRes] = await Promise.all([
        fetch("/api/dashboard/summary"),
        fetch(`/api/budgets?month=${encodeURIComponent(month)}`),
      ]);

      if (summaryRes.ok) {
        const summaryJson = await summaryRes.json();
        if (summaryJson.data) {
          setBudgetUsage(Number(summaryJson.data.totalExpense ?? 0));
        }
      }

      if (budgetRes.ok) {
        const budgetJson = await budgetRes.json();
        let nextBudget = 0;

        if (Array.isArray(budgetJson.data)) {
          const match = budgetJson.data.find((item: { month?: string; amount?: number | string }) => item.month === month);
          nextBudget = Number(match?.amount ?? 0);
        } else if (budgetJson.data && typeof budgetJson.data === "object") {
          const match = budgetJson.data.month === month ? budgetJson.data : null;
          nextBudget = Number(match?.amount ?? budgetJson.data.amount ?? 0);
        }

        setBudgetLimit(Number.isFinite(nextBudget) ? nextBudget : 0);
      } else {
        setBudgetLimit(0);
      }
    } catch (err: unknown) {
      console.error("Failed to refresh budget data:", err);
      setBudgetLimit(0);
    } finally {
      setBudgetLoading(false);
    }
  };

  useEffect(() => {
    void refreshBudgetData(selectedMonth);
  }, [selectedMonth]);

  return (
    <>
      <section className="summary-grid">
        <article className="panel stat-card success">
          <span>Total Pemasukan</span>
          <strong>{formatCurrency(summary.totalIncome)}</strong>
        </article>
        <article className="panel stat-card danger">
          <span>Total Pengeluaran</span>
          <strong>{formatCurrency(summary.totalExpense)}</strong>
        </article>
        <article className="panel stat-card primary">
          <span>Saldo Keuangan</span>
          <strong>{formatCurrency(summary.balance)}</strong>
        </article>
      </section>

      <section className="budget-grid">
        <div className="panel budget-panel">
          <div className="budget-header">
            <h2>Budget Bulanan</h2>
            <span>{budgetLoading ? "Memperbarui..." : selectedMonth}</span>
          </div>

          <div className="budget-controls">
            <MonthSelector value={selectedMonth} onChangeMonth={setSelectedMonth} />
            <SetBudgetForm
              selectedMonth={selectedMonth}
              initialAmount={budgetLimit}
              onBudgetSaved={() => refreshBudgetData(selectedMonth)}
            />
          </div>
        </div>

        <div className="panel budget-panel">
          <div className="budget-header">
            <h2>Indikator Anggaran</h2>
          </div>
          <BudgetSummary limit={budgetLimit} totalExpense={budgetUsage} />
          <BudgetIndicator limit={budgetLimit} totalExpense={budgetUsage} month={selectedMonth} />
        </div>
      </section>

      <section className="panel list-panel">
        <TransactionManager
          initialFilter={initialPreference.defaultFilter === "all" ? "" : initialPreference.defaultFilter}
          onTransactionChange={async () => {
            await refreshSummary();
            await refreshBudgetData(selectedMonth);
          }}
        />
      </section>
    </>
  );
}
