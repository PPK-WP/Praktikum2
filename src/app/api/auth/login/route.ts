import { NextResponse } from "next/server";

import { jsonError, readJson } from "@/lib/auth/http";
import { createSession } from "@/lib/auth/session";
import { readStringFields } from "@/lib/auth/validation";
import { login } from "@/services/auth";
import { restorePreference } from "@/services/preferences";

export async function POST(request: Request) {
  const body = await readJson(request);
  if (body === null) {
    return jsonError(400, "Body harus berupa JSON.");
  }

  const result = await login(readStringFields(body, ["email", "password"] as const));
  if (!result.ok) {
    return jsonError(result.status, result.message, result.errors);
  }

  const session = await createSession(result.user.id);
  await restorePreference(result.user.id);
  return NextResponse.json({ user: result.user, session }, { status: 200 });
}
