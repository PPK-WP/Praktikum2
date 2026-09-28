"use client";

import { useEffect, useState } from "react";

interface SetBudgetFormProps {
  selectedMonth: string;
  initialAmount?: number;
  onBudgetSaved?: () => void | Promise<void>;
}

export function SetBudgetForm({
  selectedMonth,
  initialAmount = 0,
  onBudgetSaved,
}: SetBudgetFormProps) {
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAmount(initialAmount ? String(initialAmount) : "");
  }, [initialAmount]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setError("Nominal anggaran harus lebih dari 0.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: selectedMonth,
          amount: parsedAmount,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || "Gagal menyimpan anggaran bulan ini.");
      }

      await onBudgetSaved?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan anggaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px", width: "100%" }}>
      <label style={{ display: "grid", gap: "8px" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
          Atur anggaran bulanan
        </span>
        <input
          type="number"
          min="0"
          step="1000"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="input-field"
          placeholder="Masukkan nominal"
          aria-label="Nominal anggaran bulanan"
        />
      </label>

      {error ? <div className="form-alert">{error}</div> : null}

      <button
        type="submit"
        className="primary-button"
        disabled={isSubmitting}
        style={{ width: "100%", opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Anggaran"}
      </button>
    </form>
  );
}
