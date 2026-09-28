"use client";

import { formatCurrency } from "@/lib/utils";

interface BudgetIndicatorProps {
  limit: number;
  totalExpense: number;
  month?: string;
}

export function BudgetIndicator({ limit, totalExpense, month }: BudgetIndicatorProps) {
  const safeRatio = limit > 0 ? totalExpense / limit : 0;
  const percentage = limit > 0 ? Math.min((totalExpense / limit) * 100, 100) : 0;

  let status: "safe" | "warning" | "danger" | "empty" = "empty";
  let color = "#94a3b8";

  if (limit <= 0) {
    status = "empty";
    color = "#94a3b8";
  } else if (safeRatio > 1) {
    status = "danger";
    color = "#ef4444";
  } else if (safeRatio >= 0.8) {
    status = "warning";
    color = "#f59e0b";
  } else {
    status = "safe";
    color = "#10b981";
  }

  const remaining = limit - totalExpense;

  return (
    <div style={{ display: "grid", gap: "12px", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
          {month ? `Penggunaan Anggaran ${month}` : "Penggunaan Anggaran"}
        </span>
        <strong style={{ fontSize: "0.85rem", color: status === "danger" ? "var(--danger)" : "var(--text)" }}>
          {limit > 0 ? `${Math.round(percentage)}%` : "0%"}
        </strong>
      </div>

      <div
        aria-label="Progress bar penggunaan anggaran"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={limit > 0 ? Math.min(Math.round(percentage), 100) : 0}
        role="progressbar"
        style={{
          position: "relative",
          width: "100%",
          height: "12px",
          borderRadius: "999px",
          background: "rgba(148, 163, 184, 0.2)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${limit > 0 ? Math.min(percentage, 100) : 0}%`,
            height: "100%",
            borderRadius: "inherit",
            background: color,
            transition: "width 0.25s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "0.9rem" }}>
        <span style={{ color: "var(--muted)" }}>
          {formatCurrency(totalExpense)} dipakai
        </span>
        <span style={{ fontWeight: 600, color: remaining >= 0 ? "var(--success)" : "var(--danger)" }}>
          {remaining >= 0 ? `${formatCurrency(remaining)} tersisa` : `${formatCurrency(Math.abs(remaining))} melebihi`}
        </span>
      </div>

      <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>
        Batas anggaran: {limit > 0 ? formatCurrency(limit) : "Belum diatur"}
      </div>
    </div>
  );
}
