import { query } from "@/lib/db";
import type { DashboardSummary } from "@/types/dashboard";
import type { Transaction, TransactionInput, TransactionType } from "@/types/transaction";

export async function getTransactions(userId: string, filter?: TransactionType): Promise<Transaction[]> {
  let sql = `
    SELECT 
      id, 
      user_id AS "userId", 
      type, 
      amount::numeric, 
      description, 
      TO_CHAR(date, 'YYYY-MM-DD') AS date, 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"
    FROM transactions 
    WHERE user_id = $1
  `;
  const params: unknown[] = [userId];

  if (filter) {
    sql += ` AND type = $2`;
    params.push(filter);
  }

  sql += ` ORDER BY date DESC, created_at DESC`;

  const rows = await query<any>(sql, params);
  return rows.map((row) => ({
    ...row,
    amount: Number(row.amount),
    createdAt: row.createdAt?.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  }));
}

export async function getTransaction(userId: string, id: string): Promise<Transaction> {
  const rows = await query<any>(
    `SELECT 
      id, 
      user_id AS "userId", 
      type, 
      amount::numeric, 
      description, 
      TO_CHAR(date, 'YYYY-MM-DD') AS date, 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"
    FROM transactions 
    WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );
  if (rows.length === 0) throw new Error("Transaction not found");
  
  return {
    ...rows[0],
    amount: Number(rows[0].amount),
    createdAt: rows[0].createdAt?.toISOString(),
    updatedAt: rows[0].updatedAt?.toISOString(),
  };
}

export async function createTransaction(userId: string, input: TransactionInput): Promise<Transaction> {
  const rows = await query<any>(
    `INSERT INTO transactions (user_id, type, amount, description, date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING 
      id, 
      user_id AS "userId", 
      type, 
      amount::numeric, 
      description, 
      TO_CHAR(date, 'YYYY-MM-DD') AS date, 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"`,
    [userId, input.type, input.amount, input.description, input.date]
  );
  
  return {
    ...rows[0],
    amount: Number(rows[0].amount),
    createdAt: rows[0].createdAt?.toISOString(),
    updatedAt: rows[0].updatedAt?.toISOString(),
  };
}

export async function updateTransaction(userId: string, id: string, input: TransactionInput): Promise<Transaction> {
  const rows = await query<any>(
    `UPDATE transactions 
     SET type = $1, amount = $2, description = $3, date = $4, updated_at = now()
     WHERE id = $5 AND user_id = $6
     RETURNING 
      id, 
      user_id AS "userId", 
      type, 
      amount::numeric, 
      description, 
      TO_CHAR(date, 'YYYY-MM-DD') AS date, 
      created_at AS "createdAt", 
      updated_at AS "updatedAt"`,
    [input.type, input.amount, input.description, input.date, id, userId]
  );
  
  if (rows.length === 0) throw new Error("Transaction not found");
  
  return {
    ...rows[0],
    amount: Number(rows[0].amount),
    createdAt: rows[0].createdAt?.toISOString(),
    updatedAt: rows[0].updatedAt?.toISOString(),
  };
}

export async function deleteTransaction(userId: string, id: string): Promise<boolean> {
  const rows = await query<{ id: string }>(
    `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id`,
    [id, userId]
  );
  
  if (rows.length === 0) throw new Error("Transaction not found");
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
