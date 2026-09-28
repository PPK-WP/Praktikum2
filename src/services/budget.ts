import { Prisma, type Budget as BudgetRow } from "@prisma/client";

import prisma from "@/lib/prisma";
import type { Budget, BudgetInput, BudgetSummary } from "@/types/budget";

// "YYYY-MM" with a real month (01-12).
const MONTH_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
// Largest value that fits the DECIMAL(14, 2) column.
const MAX_AMOUNT = 999_999_999_999.99;
// Budget ids are UUIDs; anything else cannot exist, and Postgres would reject it.
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type BudgetResult<T> =
  | { ok: true; data: T; created?: boolean }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

// Also used for another user's budget, so the API never reveals that it exists (SRS-204).
const NOT_FOUND = { ok: false, status: 404, message: "Budget tidak ditemukan." } as const;
const MONTH_TAKEN = {
  ok: false,
  status: 409,
  message: "Budget untuk bulan itu sudah ada.",
  errors: { month: "Budget untuk bulan itu sudah ada." },
} as const;

export function isValidMonth(value: unknown): value is string {
  return typeof value === "string" && MONTH_PATTERN.test(value);
}

type Validated = { ok: true; input: BudgetInput } | { ok: false; errors: Record<string, string> };

/** Checks a request body against the BudgetInput contract. */
export function validateBudgetInput(body: unknown): Validated {
  const { month, amount } = (body ?? {}) as Partial<Record<keyof BudgetInput, unknown>>;
  const errors: Record<string, string> = {};

  if (!isValidMonth(month)) {
    errors.month = "Bulan wajib berformat YYYY-MM, contoh 2026-09.";
  }
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    errors.amount = "Nominal budget harus angka lebih dari 0.";
  } else if (amount > MAX_AMOUNT) {
    errors.amount = "Nominal budget terlalu besar.";
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, input: { month: month as string, amount: amount as number } };
}

function toBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    userId: row.userId,
    month: row.month,
    amount: Number(row.amount), // Prisma returns DECIMAL as a Decimal object
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function hasPrismaCode(error: unknown, code: string) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;
}

/** The user's budget for one month, or null if none is set. */
export async function getBudget(userId: string, month: string): Promise<Budget | null> {
  const row = await prisma.budget.findUnique({
    where: { userId_month: { userId, month } }, // unique pair (user_id, month)
  });
  return row ? toBudget(row) : null;
}

/** Total of the user's expense transactions dated inside the "YYYY-MM" month. */
export async function getMonthlyExpense(userId: string, month: string): Promise<number> {
  const [year, monthIndex] = month.split("-").map(Number);
  const { _sum } = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: {
      userId, // only this user's transactions (SRS-204)
      type: "expense",
      // [first day of month, first day of next month); Date.UTC rolls month 12 over to January.
      date: { gte: new Date(Date.UTC(year, monthIndex - 1, 1)), lt: new Date(Date.UTC(year, monthIndex, 1)) },
    },
  });
  return Number(_sum.amount ?? 0); // SUM over zero rows is null
}

/** Budget, total expense and remaining amount for one month. */
export async function getBudgetSummary(userId: string, month: string): Promise<BudgetSummary> {
  const [budget, totalExpense] = await Promise.all([getBudget(userId, month), getMonthlyExpense(userId, month)]);
  return {
    month,
    budget,
    totalExpense,
    remaining: budget ? budget.amount - totalExpense : null,
  };
}

/**
 * Sets the budget for a month. A month has at most one budget, so if one already
 * exists its amount is replaced (created: false) instead of failing.
 */
export async function createBudget(userId: string, body: unknown): Promise<BudgetResult<Budget>> {
  const validated = validateBudgetInput(body);
  if (!validated.ok) {
    return { ok: false, status: 422, message: "Data budget belum valid.", errors: validated.errors };
  }
  const { month, amount } = validated.input;

  try {
    const row = await prisma.budget.create({ data: { userId, month, amount } });
    return { ok: true, data: toBudget(row), created: true };
  } catch (error) {
    // P2002 = unique (user_id, month) violated: the month already has a budget.
    if (!hasPrismaCode(error, "P2002")) throw error;
  }

  const row = await prisma.budget.update({
    where: { userId_month: { userId, month } },
    data: { amount },
  });
  return { ok: true, data: toBudget(row), created: false };
}

/** Updates one of the user's budgets. Another user's id gives 404. */
export async function updateBudget(userId: string, id: string, body: unknown): Promise<BudgetResult<Budget>> {
  const validated = validateBudgetInput(body);
  if (!validated.ok) {
    return { ok: false, status: 422, message: "Data budget belum valid.", errors: validated.errors };
  }
  if (!ID_PATTERN.test(id)) return NOT_FOUND;

  try {
    // id + userId in one query: the ownership check and the write cannot be split.
    const row = await prisma.budget.update({ where: { id, userId }, data: validated.input });
    return { ok: true, data: toBudget(row) };
  } catch (error) {
    if (hasPrismaCode(error, "P2025")) return NOT_FOUND; // no row with this id for this user
    if (hasPrismaCode(error, "P2002")) return MONTH_TAKEN; // moved onto a month that has a budget
    throw error;
  }
}

/** Deletes one of the user's budgets. Another user's id gives 404. */
export async function deleteBudget(userId: string, id: string): Promise<BudgetResult<null>> {
  if (!ID_PATTERN.test(id)) return NOT_FOUND;

  const { count } = await prisma.budget.deleteMany({ where: { id, userId } });
  return count > 0 ? { ok: true, data: null } : NOT_FOUND;
}
