export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
}
