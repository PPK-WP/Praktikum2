import { NextResponse } from "next/server";

import { jsonError, readJson } from "@/lib/auth/http";
import { getCurrentUser } from "@/lib/auth/session";
import { createBudget, getBudgetSummary, isValidMonth } from "@/services/budget";

/** GET /api/budgets?month=YYYY-MM -> { data: BudgetSummary } */
export async function GET(request: Request) {
  // Session first: no user, no data (SRS-203).
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Silakan login terlebih dahulu.");

  const month = new URL(request.url).searchParams.get("month");
  if (!isValidMonth(month)) {
    return jsonError(422, "Parameter month tidak valid.", { month: "Gunakan format YYYY-MM, contoh 2026-09." });
  }

  // userId comes from the session, never from the request (SRS-204).
  return NextResponse.json({ data: await getBudgetSummary(user.id, month) });
}

/** POST /api/budgets { month, amount } -> 201 created, or 200 if that month's budget was replaced */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Silakan login terlebih dahulu.");

  const result = await createBudget(user.id, await readJson(request));
  if (!result.ok) return jsonError(result.status, result.message, result.errors);

  return NextResponse.json({ data: result.data }, { status: result.created ? 201 : 200 });
}
