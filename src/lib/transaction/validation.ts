import { TransactionInput } from "@/types/transaction";

export function validateTransactionInput(input: Partial<TransactionInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!input.type || (input.type !== "income" && input.type !== "expense")) {
    errors.push("Invalid transaction type");
  }

  if (typeof input.amount !== "number" || input.amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  if (!input.description || input.description.trim() === "") {
    errors.push("Description is required");
  }

  if (!input.date || isNaN(new Date(input.date).getTime())) {
    errors.push("Valid date is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
