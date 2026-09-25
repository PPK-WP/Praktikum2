"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import type { DashboardSummary } from "@/types/dashboard";
import type { UserPreference } from "@/types/shared";
import type { User } from "@/types/auth";
import { TransactionManager } from "@/components/transaction/TransactionManager";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";

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

  const refreshSummary = async () => {
    try {
      const res = await fetch("/api/dashboard/summary");
      const json = await res.json();
      if (res.ok && json.data) {
        setSummary(json.data);
      }
    } catch (err: unknown) {
      console.error("Failed to refresh dashboard summary:", err);
    }
  };

  return (
    <>
      <section className="summary-grid">
        <article className="panel stat-card success">
          <div className="stat-header">
            <span>Total Pemasukan</span>
            <TrendingUp size={24} className="stat-icon" />
          </div>
          <strong>{formatCurrency(summary.totalIncome)}</strong>
        </article>
        <article className="panel stat-card danger">
          <div className="stat-header">
            <span>Total Pengeluaran</span>
            <TrendingDown size={24} className="stat-icon" />
          </div>
          <strong>{formatCurrency(summary.totalExpense)}</strong>
        </article>
        <article className="panel stat-card primary">
          <div className="stat-header">
            <span>Saldo Keuangan</span>
            <Wallet size={24} className="stat-icon" />
          </div>
          <strong>{formatCurrency(summary.balance)}</strong>
        </article>
      </section>

      <section className="panel list-panel">
        <TransactionManager
          initialFilter={initialPreference.defaultFilter === "all" ? "" : initialPreference.defaultFilter}
          onTransactionChange={refreshSummary}
        />
      </section>
    </>
  );
}
