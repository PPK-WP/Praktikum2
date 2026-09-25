import { NextResponse } from "next/server";

const transactions = [
  {
    id: "trx-001",
    userId: "user-001",
    type: "income",
    amount: 2000000,
    description: "Gaji part-time",
    date: "2026-09-20",
  },
  {
    id: "trx-002",
    userId: "user-001",
    type: "expense",
    amount: 450000,
    description: "Makan siang",
    date: "2026-09-21",
  },
  {
    id: "trx-003",
    userId: "user-001",
    type: "expense",
    amount: 750000,
    description: "Beli buku",
    date: "2026-09-22",
  },
];

export async function GET() {
  return NextResponse.json({ data: transactions });
}

export async function POST(request: Request) {
  const body = await request.json();

  return NextResponse.json(
    {
      data: {
        ...body,
        id: `trx-${Date.now()}`,
        userId: "user-001",
      },
    },
    { status: 201 },
  );
}
