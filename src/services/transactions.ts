import prisma from "@/lib/prisma";
import type { DashboardSummary } from "@/types/dashboard";
import type { Transaction, TransactionInput, TransactionType } from "@/types/transaction";

export async function getTransactions(userId: string, filter?: TransactionType): Promise<Transaction[]> {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(filter ? { type: filter as any } : {}),
    },
    orderBy: [
      { date: 'desc' },
      { createdAt: 'desc' },
    ],
  });

  return transactions.map((t) => ({
    id: t.id,
    userId: t.userId,
    type: t.type as TransactionType,
    amount: Number(t.amount),
    description: t.description,
    date: t.date.toISOString().split('T')[0],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt?.toISOString(),
  }));
}

export async function getTransaction(userId: string, id: string): Promise<Transaction> {
  const t = await prisma.transaction.findFirst({
    where: { id, userId }
  });

  if (!t) throw new Error("Transaction not found");

  return {
    id: t.id,
    userId: t.userId,
    type: t.type as TransactionType,
    amount: Number(t.amount),
    description: t.description,
    date: t.date.toISOString().split('T')[0],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt?.toISOString(),
  };
}

export async function createTransaction(userId: string, input: TransactionInput): Promise<Transaction> {
  const t = await prisma.transaction.create({
    data: {
      userId,
      type: input.type as any,
      amount: input.amount,
      description: input.description,
      date: new Date(input.date),
    }
  });

  return {
    id: t.id,
    userId: t.userId,
    type: t.type as TransactionType,
    amount: Number(t.amount),
    description: t.description,
    date: t.date.toISOString().split('T')[0],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt?.toISOString(),
  };
}

export async function updateTransaction(userId: string, id: string, input: TransactionInput): Promise<Transaction> {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId }
  });
  if (!existing) throw new Error("Transaction not found");

  const t = await prisma.transaction.update({
    where: { id },
    data: {
      type: input.type as any,
      amount: input.amount,
      description: input.description,
      date: new Date(input.date),
    }
  });

  return {
    id: t.id,
    userId: t.userId,
    type: t.type as TransactionType,
    amount: Number(t.amount),
    description: t.description,
    date: t.date.toISOString().split('T')[0],
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt?.toISOString(),
  };
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  const existing = await prisma.transaction.findFirst({
    where: { id, userId }
  });
  if (!existing) throw new Error("Transaction not found");

  await prisma.transaction.delete({
    where: { id }
  });
  
  return true;
}

export async function getDashboardSummary(userId: string): Promise<DashboardSummary> {
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
