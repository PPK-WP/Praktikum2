"use client";

import { useState, useEffect, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, TransactionType, TransactionInput } from "@/types/transaction";

interface TransactionManagerProps {
  initialFilter?: TransactionType | "";
  onTransactionChange?: () => void;
}

interface FormState {
  type: TransactionType;
  amount: number | string;
  description: string;
  date: string;
}

export function TransactionManager({
  initialFilter = "",
  onTransactionChange,
}: TransactionManagerProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | "">(initialFilter);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form states
  const [formData, setFormData] = useState<FormState>({
    type: "expense",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTransactions = useCallback(async (currentFilter: TransactionType | "") => {
    let url = "/api/transactions";
    if (currentFilter) url += `?type=${currentFilter}`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      if (res.ok && json.data) {
        setTransactions(json.data);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      let url = "/api/transactions";
      if (filter) url += `?type=${filter}`;

      try {
        const res = await fetch(url);
        const json = await res.json();
        if (!ignore && res.ok && json.data) {
          setTransactions(json.data);
        }
      } catch (err: unknown) {
        if (!ignore) console.error("Failed to fetch transactions:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [filter]);

  const handleFilterChange = async (newFilter: TransactionType | "") => {
    setFilter(newFilter);
    // Persist defaultFilter preference in cookies and database
    try {
      await fetch("/api/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ defaultFilter: newFilter || "all" }),
      });
    } catch {
      // Ignore background preference save failure
    }
  };

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setFormError("");
    setShowForm(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTransactions(filter);
        onTransactionChange?.();
      } else {
        alert("Gagal menghapus transaksi.");
      }
    } catch (err: unknown) {
      console.error(err);
      alert("Terjadi kesalahan saat menghapus transaksi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");

    const amountNum = Number(formData.amount);
    if (!amountNum || amountNum <= 0) {
      setFormError("Nominal transaksi harus lebih dari 0.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Deskripsi transaksi wajib diisi.");
      return;
    }
    if (!formData.date) {
      setFormError("Tanggal transaksi wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    const payload: TransactionInput = {
      type: formData.type,
      amount: amountNum,
      description: formData.description.trim(),
      date: formData.date,
    };

    try {
      let res: Response;
      if (editingTransaction) {
        res = await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowForm(false);
        setEditingTransaction(null);
        await fetchTransactions(filter);
        onTransactionChange?.();
      } else {
        const errorJson = await res.json().catch(() => ({}));
        setFormError(errorJson.error || "Gagal menyimpan transaksi.");
      }
    } catch (err: unknown) {
      console.error(err);
      setFormError("Terjadi kesalahan koneksi saat menyimpan transaksi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="transaction-manager">
      <div className="section-head">
        <h2>Riwayat & Manajemen Transaksi</h2>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value as TransactionType | "")}
            className="input-field"
            aria-label="Filter jenis transaksi"
            style={{ minHeight: "40px", padding: "6px 12px" }}
          >
            <option value="">Semua Transaksi</option>
            <option value="income">Pemasukan Saja</option>
            <option value="expense">Pengeluaran Saja</option>
          </select>
          <button
            type="button"
            className="primary-button"
            onClick={handleOpenAdd}
            style={{ padding: "0.6rem 1.2rem", fontSize: "0.9rem" }}
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="panel"
          style={{ padding: "24px", marginBottom: "28px", background: "var(--surface)" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 600 }}>
              {editingTransaction ? "Ubah Transaksi" : "Tambah Transaksi Baru"}
            </h3>
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowForm(false)}
              style={{ padding: "4px 8px" }}
            >
              ✕ Batal
            </button>
          </div>

          {formError && (
            <div className="form-alert" style={{ marginBottom: "16px" }}>
              {formError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
            <label style={{ display: "grid", gap: "6px", fontSize: "0.9rem", fontWeight: 500 }}>
              Jenis Transaksi
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TransactionType })}
                className="input-field"
                required
              >
                <option value="expense">Pengeluaran (-)</option>
                <option value="income">Pemasukan (+)</option>
              </select>
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "0.9rem", fontWeight: 500 }}>
              Nominal (Rp)
              <input
                type="number"
                min="1"
                step="any"
                required
                value={formData.amount || ""}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Contoh: 50000"
                className="input-field"
              />
            </label>

            <label style={{ display: "grid", gap: "6px", fontSize: "0.9rem", fontWeight: 500 }}>
              Tanggal
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field"
              />
            </label>
          </div>

          <label style={{ display: "grid", gap: "6px", fontSize: "0.9rem", fontWeight: 500, marginBottom: "20px" }}>
            Deskripsi Transaksi
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Contoh: Uang saku, Beli buku catatan, Makan siang"
              className="input-field"
            />
          </label>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowForm(false)}
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : editingTransaction ? "Simpan Perubahan" : "Simpan Transaksi"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: "var(--muted)", padding: "16px 0" }}>Memuat transaksi...</p>
      ) : (
        <ul className="transaction-list">
          {transactions.length === 0 ? (
            <li className="transaction-item" style={{ color: "var(--muted)", justifyContent: "center", padding: "32px 0" }}>
              Belum ada transaksi {filter ? `berjenis ${filter === "income" ? "pemasukan" : "pengeluaran"}` : ""}.
            </li>
          ) : (
            transactions.map((transaction) => (
              <li key={transaction.id} className="transaction-item">
                <div>
                  <strong>{transaction.description}</strong>
                  <small>{transaction.date}</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span className={transaction.type === "income" ? "income" : "expense"}>
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => handleEdit(transaction)}
                      className="ghost-button"
                      style={{ padding: "4px 10px", fontSize: "0.85rem", border: "1px solid var(--border)", borderRadius: "6px" }}
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(transaction.id)}
                      className="ghost-button"
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.85rem",
                        color: "var(--danger)",
                        border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)",
                        borderRadius: "6px",
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
