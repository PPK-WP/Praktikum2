import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/services/transactions";
import { getSession } from "@/services/auth";

export async function GET() {
  const session = await getSession();
  if (!session.isAuthenticated || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;
  
  try {
    const summary = await getDashboardSummary(userId);
    return NextResponse.json({ data: summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
