import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      balance: 1550000,
      totalIncome: 2300000,
      totalExpense: 750000,
      recentTransactions: [
        {
          id: "trx-004",
          userId: "user-001",
          type: "income",
          amount: 300000,
          description: "Uang tugas tambahan",
          date: "2026-09-24",
        },
        {
          id: "trx-003",
          userId: "user-001",
          type: "expense",
          amount: 750000,
          description: "Beli buku",
          date: "2026-09-22",
        },
      ],
    },
  });
}
