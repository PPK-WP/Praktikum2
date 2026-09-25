import type { DashboardSummary } from "@/types/dashboard";
import type { Transaction, TransactionType } from "@/types/transaction";

const mockTransactions: Transaction[] = [
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

export async function getTransactions(filter?: TransactionType) {
  if (!filter) {
    return mockTransactions;
  }

  return mockTransactions.filter((transaction) => transaction.type === filter);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const transactions = await getTransactions();
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
    recentTransactions: [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    ),
  };
}
