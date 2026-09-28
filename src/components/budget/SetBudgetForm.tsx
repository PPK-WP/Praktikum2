"use client";

import { useEffect, useState } from "react";

export interface SetBudgetFormProps {
  selectedMonth?: string;
  month?: string;
  initialAmount?: number;
  onBudgetSaved?: () => void | Promise<void>;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function SetBudgetForm({
  selectedMonth,
  month,
  initialAmount = 0,
  onBudgetSaved,
  onSuccess,
  onError,
}: SetBudgetFormProps) {
  const activeMonth = selectedMonth || month || "";
  const [amount, setAmount] = useState(initialAmount ? String(initialAmount) : "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAmount(initialAmount ? String(initialAmount) : "");
    setError("");
    setSuccess("");
  }, [initialAmount, activeMonth]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      const msg = "Nominal anggaran harus lebih besar dari 0.";
      setError(msg);
      onError?.(msg);
      return;
    }

    if (!activeMonth) {
      const msg = "Bulan anggaran belum dipilih.";
      setError(msg);
      onError?.(msg);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: activeMonth,
          amount: parsedAmount,
        }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(json.error || json.message || "Gagal menyimpan anggaran bulan ini.");
      }

      setSuccess("Anggaran berhasil disimpan!");
      await onBudgetSaved?.();
      onSuccess?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan anggaran.";
      setError(msg);
      onError?.(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form" style={{ display: "grid", gap: "12px", width: "100%" }}>
      <label style={{ display: "grid", gap: "8px" }}>
        <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--muted)" }}>
          Atur Anggaran Bulanan {activeMonth ? `(${activeMonth})` : ""}
        </span>
        <input
          type="number"
          min="0"
          step="1000"
          value={amount}
          onChange={(event) => {
            setAmount(event.target.value);
            if (error) setError("");
          }}
          disabled={isSubmitting}
          className="input-field"
          placeholder="Masukkan nominal (cth: 2000000)"
          aria-label="Nominal anggaran bulanan"
        />
      </label>

      {error ? (
        <div className="error-message form-alert" style={{ fontSize: "0.85rem", padding: "8px 12px" }}>
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="success-message" style={{ fontSize: "0.85rem", padding: "8px 12px" }}>
          {success}
        </div>
      ) : null}

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
