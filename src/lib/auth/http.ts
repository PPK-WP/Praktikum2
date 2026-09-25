import { NextResponse } from "next/server";

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function jsonError(status: number, message: string, errors?: Record<string, string>) {
  return NextResponse.json(errors ? { message, errors } : { message }, { status });
}

/** Only allows same-site relative paths, so `?next=` cannot redirect off-site. */
export function safeRedirectPath(value: string | null | undefined, fallback: string) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
