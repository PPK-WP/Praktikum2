import { NextResponse } from "next/server";
import { createTransaction, getTransactions } from "@/services/transactions";
import { TransactionType } from "@/types/transaction";
import { validateTransactionInput } from "@/lib/transaction/validation";
import { getSession } from "@/services/auth";

export async function GET(request: Request) {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as TransactionType | null;

  try {
    const transactions = await getTransactions(userId, type || undefined);
    return NextResponse.json({ data: transactions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  try {
    const body = await request.json();
    const validation = validateTransactionInput(body);
    if (!validation.valid) {
      return NextResponse.json({ error: "Validation failed", details: validation.errors }, { status: 400 });
    }
    
    const newTransaction = await createTransaction(userId, body);
    return NextResponse.json({ data: newTransaction }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
