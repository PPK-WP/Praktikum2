import { NextResponse } from "next/server";

import { jsonError } from "@/lib/auth/http";
import { getSession } from "@/services/auth";

export async function GET() {
  const session = await getSession();
  if (!session.user) {
    return jsonError(401, "Belum login atau session sudah berakhir.");
  }

  return NextResponse.json({ user: session.user }, { status: 200 });
}
