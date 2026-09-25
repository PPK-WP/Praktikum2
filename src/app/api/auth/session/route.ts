import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      user: {
        id: "user-001",
        name: "Mahasiswa",
        email: "mahasiswa@expense.test",
        role: "student",
      },
    },
    { status: 200 },
  );
}
