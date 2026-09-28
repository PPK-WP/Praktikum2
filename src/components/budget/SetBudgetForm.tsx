"use client";

import { useState } from "react";

export interface SetBudgetFormProps {
  month: string;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

export function SetBudgetForm({ month, onSuccess, onError }: SetBudgetFormProps) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!amount || parseFloat(amount) <= 0) {
      const msg = "Anggaran harus lebih besar dari 0";
      setError(msg);
      onError?.(msg);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Gagal menyimpan anggaran");
      }

      setSuccess("Anggaran berhasil disimpan");
      setAmount("");
      onSuccess?.();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="budget-form">
      <div className="form-group">
        <label htmlFor="amount">Anggaran Bulanan ({month})</label>
        <input
          id="amount"
          type="number"
          placeholder="Masukkan jumlah anggaran"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          step="0.01"
          min="0"
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="primary-button"
      >
        {loading ? "Menyimpan..." : "Simpan Anggaran"}
      </button>
    </form>
  );
}
