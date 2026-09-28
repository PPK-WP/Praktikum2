"use client";

export interface MonthSelectorProps {
  value: string;
  onChange: (month: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    onChange(newMonth);
  };

  const currentYear = new Date().getFullYear();
  const months = [];

  for (let y = currentYear - 1; y <= currentYear + 1; y++) {
    for (let m = 1; m <= 12; m++) {
      const monthStr = `${y}-${String(m).padStart(2, "0")}`;
      months.push(monthStr);
    }
  }

  return (
    <div className="month-selector">
      <label htmlFor="month-select">Pilih Bulan</label>
      <select
        id="month-select"
        value={value}
        onChange={handleChange}
        className="month-select-input"
      >
        {months.map((m) => {
          const [y, mo] = m.split("-");
          const date = new Date(parseInt(y), parseInt(mo) - 1);
          const label = date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
          });
          return (
            <option key={m} value={m}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}
