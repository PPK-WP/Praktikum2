import { NextResponse } from "next/server";

import { jsonError, readJson } from "@/lib/auth/http";
import { createSession } from "@/lib/auth/session";
import { readStringFields } from "@/lib/auth/validation";
import { register } from "@/services/auth";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (body === null) {
    return jsonError(400, "Body harus berupa JSON.");
  }

  const result = await register(readStringFields(body, ["name", "email", "password"] as const));
  if (!result.ok) {
    return jsonError(result.status, result.message, result.errors);
  }

  await createSession(result.user.id);
  return NextResponse.json({ user: result.user }, { status: 201 });
}
