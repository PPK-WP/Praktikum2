import { NextResponse } from "next/server";

import { jsonError, readJson } from "@/lib/auth/http";
import { getCurrentUser } from "@/lib/auth/session";
import { deleteBudget, updateBudget } from "@/services/budget";

type Context = { params: Promise<{ id: string }> };

/** PUT /api/budgets/:id { month, amount } -> { data: Budget } */
export async function PUT(request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Silakan login terlebih dahulu.");

  const { id } = await params;
  const result = await updateBudget(user.id, id, await readJson(request));
  if (!result.ok) return jsonError(result.status, result.message, result.errors);

  return NextResponse.json({ data: result.data });
}

/** DELETE /api/budgets/:id -> { success: true } */
export async function DELETE(_request: Request, { params }: Context) {
  const user = await getCurrentUser();
  if (!user) return jsonError(401, "Silakan login terlebih dahulu.");

  const { id } = await params;
  const result = await deleteBudget(user.id, id);
  if (!result.ok) return jsonError(result.status, result.message);

  return NextResponse.json({ success: true });
}
