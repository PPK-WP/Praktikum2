import type { DashboardSummary } from "@/types/dashboard";
import type { Transaction, TransactionInput, TransactionType } from "@/types/transaction";

let mockTransactions: Transaction[] = [
  {
    id: "trx-001",
    userId: "user-001",
    type: "income",
    amount: 2000000,
    description: "Gaji part-time",
    date: "2026-09-20",
    createdAt: "2026-09-20T08:00:00.000Z",
  },
  {
    id: "trx-002",
    userId: "user-001",
    type: "expense",
    amount: 450000,
    description: "Makan siang",
    date: "2026-09-21",
    createdAt: "2026-09-21T12:30:00.000Z",
  },
  {
    id: "trx-003",
    userId: "user-001",
    type: "expense",
    amount: 750000,
    description: "Beli buku",
    date: "2026-09-22",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: "trx-004",
    userId: "user-001",
    type: "income",
    amount: 300000,
    description: "Uang tugas tambahan",
    date: "2026-09-24",
    createdAt: "2026-09-24T09:00:00.000Z",
  },
];

export async function getTransactions(userId: string, filter?: TransactionType) {
  let filtered = mockTransactions.filter((t) => t.userId === userId);
  
  if (filter) {
    filtered = filtered.filter((t) => t.type === filter);
  }

  return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getTransaction(userId: string, id: string) {
  const transaction = mockTransactions.find((t) => t.id === id && t.userId === userId);
  if (!transaction) throw new Error("Transaction not found");
  return transaction;
}

export async function createTransaction(userId: string, input: TransactionInput) {
  const newTransaction: Transaction = {
    id: `trx-${Date.now()}`,
    userId,
    ...input,
    createdAt: new Date().toISOString(),
  };
  mockTransactions.push(newTransaction);
  return newTransaction;
}

export async function updateTransaction(userId: string, id: string, input: TransactionInput) {
  const index = mockTransactions.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) throw new Error("Transaction not found");
  
  mockTransactions[index] = {
    ...mockTransactions[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };
  
  return mockTransactions[index];
}

export async function deleteTransaction(userId: string, id: string) {
  const index = mockTransactions.findIndex((t) => t.id === id && t.userId === userId);
  if (index === -1) throw new Error("Transaction not found");
  
  mockTransactions.splice(index, 1);
  return true;
}

export async function getDashboardSummary(userId: string = "user-001"): Promise<DashboardSummary> {
  const transactions = await getTransactions(userId);
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return {
    balance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    recentTransactions: transactions.slice(0, 5),
  };
}
