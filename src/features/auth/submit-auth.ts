import type { ApiError } from "@/types/shared";

export type SubmitResult = { ok: true } | { ok: false; message: string; errors: Record<string, string> };

export async function submitAuth(endpoint: string, payload: object): Promise<SubmitResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (response.ok) {
      return { ok: true };
    }

    const body = (await response.json().catch(() => null)) as ApiError | null;
    return {
      ok: false,
      message: body?.message ?? "Terjadi kesalahan. Coba lagi.",
      errors: body?.errors ?? {},
    };
  } catch {
    return { ok: false, message: "Tidak dapat terhubung ke server.", errors: {} };
  }
}
