import { NextResponse } from "next/server";
import { getTransaction, updateTransaction, deleteTransaction } from "@/services/transactions";
import { validateTransactionInput } from "@/lib/transaction/validation";
import { getSession } from "@/services/auth";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  try {
    const transaction = await getTransaction(userId, params.id);
    return NextResponse.json({ data: transaction });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
    
    const updatedTransaction = await updateTransaction(userId, params.id, body);
    return NextResponse.json({ data: updatedTransaction });
  } catch (error: any) {
    if (error.message === "Transaction not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  try {
    await deleteTransaction(userId, params.id);
    return NextResponse.json({ message: "Transaction deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
