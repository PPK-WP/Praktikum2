import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      theme: "light",
      defaultFilter: "all",
    },
  });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    data: {
      theme: body.theme ?? "light",
      defaultFilter: body.defaultFilter ?? "all",
    },
  });
}
