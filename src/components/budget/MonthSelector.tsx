"use client";

import { useMemo } from "react";

export interface MonthSelectorProps {
  value: string;
  onChangeMonth: (month: string) => void;
  onChange?: (month: string) => void;
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

  // Range dari 12 bulan lalu hingga 6 bulan ke depan
  for (let offset = 12; offset >= -6; offset -= 1) {
    const date = new Date(current.getFullYear(), current.getMonth() - offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    options.push({ label: formatMonthLabel(value), value });
  }

  return options;
}

export function MonthSelector({ value, onChangeMonth, onChange }: MonthSelectorProps) {
  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const handleChange = (newMonth: string) => {
    onChangeMonth?.(newMonth);
    onChange?.(newMonth);
  };

  const isValueInOptions = monthOptions.some((option) => option.value === value);

  return (
    <div className="month-selector" style={{ display: "grid", gap: "8px", width: "100%" }}>
      <label htmlFor="month-select" style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
        Pilih Bulan Anggaran
      </label>
      <select
        id="month-select"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="input-field month-select-input"
        aria-label="Pilih bulan anggaran"
        style={{ width: "100%" }}
      >
        {!isValueInOptions && value ? (
          <option key={value} value={value}>
            {formatMonthLabel(value)}
          </option>
        ) : null}
        {monthOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
