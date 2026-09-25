"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import type { Transaction, TransactionType, TransactionInput } from "@/types/transaction";

export function TransactionManager() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionType | "">("");
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    let url = "/api/transactions";
    if (filter) url += `?type=${filter}`;
    
    try {
      const res = await fetch(url);
      const { data } = await res.json();
      setTransactions(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      fetchTransactions();
    } catch (e) {
      console.error(e);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const input: TransactionInput = {
      type: formData.get("type") as TransactionType,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
      date: formData.get("date") as string,
    };

    try {
      if (editingTransaction) {
        await fetch(`/api/transactions/${editingTransaction.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
      } else {
        await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
      }
      
      setShowForm(false);
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="transaction-manager">
      <div className="flex justify-between items-center mb-4">
        <h2>Transactions</h2>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-field"
          >
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <button 
            className="primary-button"
            onClick={() => {
              setEditingTransaction(null);
              setShowForm(true);
            }}
          >
            + New Transaction
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleFormSubmit} className="panel mb-4">
          <h3>{editingTransaction ? "Edit Transaction" : "New Transaction"}</h3>
          <div className="flex flex-col gap-2 my-4">
            <label>
              Type:
              <select name="type" defaultValue={editingTransaction?.type || "expense"} className="input-field w-full">
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </label>
            <label>
              Amount:
              <input 
                name="amount" 
                type="number" 
                required 
                defaultValue={editingTransaction?.amount} 
                className="input-field w-full"
              />
            </label>
            <label>
              Description:
              <input 
                name="description" 
                type="text" 
                required 
                defaultValue={editingTransaction?.description} 
                className="input-field w-full"
              />
            </label>
            <label>
              Date:
              <input 
                name="date" 
                type="date" 
                required 
                defaultValue={editingTransaction?.date || new Date().toISOString().split("T")[0]} 
                className="input-field w-full"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="primary-button">Save</button>
            <button type="button" className="ghost-button" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="transaction-list">
          {transactions.length === 0 && <p>No transactions found.</p>}
          {transactions.map((transaction) => (
            <li key={transaction.id} className="transaction-item flex justify-between panel mb-2 p-4">
              <div>
                <strong>{transaction.description}</strong>
                <small className="block text-gray-500">{transaction.date}</small>
              </div>
              <div className="flex gap-4 items-center">
                <span className={transaction.type === "income" ? "income" : "expense"}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </span>
                <button type="button" onClick={() => handleEdit(transaction)} className="text-blue-500">Edit</button>
                <button type="button" onClick={() => handleDelete(transaction.id)} className="text-red-500">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
