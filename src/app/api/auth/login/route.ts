import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  if (body.email === "mahasiswa@expense.test" && body.password === "password123") {
    return NextResponse.json(
      {
        user: {
          id: "user-001",
          name: "Mahasiswa",
          email: body.email,
          role: "student",
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json({ message: "Email atau password salah" }, { status: 401 });
}
