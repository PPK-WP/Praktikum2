import { NextResponse } from "next/server";

import { parsePreferencePatch } from "@/features/preferences/preference";
import { jsonError, readJson } from "@/lib/auth/http";
import { getPreference, savePreference } from "@/services/preferences";

export async function GET() {
  return NextResponse.json({ preference: await getPreference() });
}

export async function PATCH(request: Request) {
  const patch = parsePreferencePatch(await readJson(request));
  if (!patch) {
    return jsonError(422, "Preferensi tidak valid.", {
      theme: "Gunakan light atau dark.",
      defaultFilter: "Gunakan all, income, atau expense.",
    });
  }

  return NextResponse.json({ preference: await savePreference(patch) });
}
