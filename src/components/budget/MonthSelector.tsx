"use client";

import { useMemo } from "react";

interface MonthSelectorProps {
  value: string;
  onChangeMonth: (month: string) => void;
}

function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-");
  if (!year || !monthNumber) return month;

  const date = new Date(Number(year), Number(monthNumber) - 1, 1);
  return new Intl.DateTimeFormat("id-ID", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function buildMonthOptions(): Array<{ label: string; value: string }> {
  const options: Array<{ label: string; value: string }> = [];
  const current = new Date();

  for (let offset = 5; offset >= 0; offset -= 1) {
    const date = new Date(current.getFullYear(), current.getMonth() - offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push({ label: formatMonthLabel(value), value });
  }

  return options;
}

export function MonthSelector({ value, onChangeMonth }: MonthSelectorProps) {
  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const currentValue = monthOptions.some((option) => option.value === value)
    ? value
    : monthOptions[0]?.value ?? new Date().toISOString().slice(0, 7);

  return (
    <label style={{ display: "grid", gap: "8px", width: "100%" }}>
      <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
        Pilih bulan anggaran
      </span>
      <select
        value={currentValue}
        onChange={(event) => onChangeMonth(event.target.value)}
        className="input-field"
        aria-label="Pilih bulan anggaran"
        style={{ width: "100%" }}
      >
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
